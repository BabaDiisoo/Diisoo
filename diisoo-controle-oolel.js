/* diisoo-controle-oolel.js : couche de controle de la voix wolof Oolel.
 * 1) Respellings : reecrit le texte envoye a Oolel (ex. ñaar -> nyaar) sans toucher au texte affiche ni au cache.
 * 2) Plafond par telephone et par jour, pour proteger le quota Oolel.
 * 3) Mode controle (?ctrl=1) : bouton "Mal lu" qui garde les phrases mal lues, a envoyer pour creer de nouveaux respellings.
 * Interrupteurs : ?resp=0 coupe les respellings, ?resp=1 les remet. Aucun fichier existant modifie. */
(function () {
  "use strict";
  if (window.DiisooControleOolel) return;
  var PLAFOND_JOUR = 60;
  /* Mots a reecrire : cle = mot wolof (minuscules), valeur = ecriture que Oolel lit mieux. A completer avec ?ctrl=1. */
  var MOTS = {};
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  try {
    var q = new URLSearchParams(location.search);
    if (q.get("resp") === "0") lsSet("diisoo_resp", "0");
    if (q.get("resp") === "1") lsSet("diisoo_resp", "1");
    if (q.get("ctrl") === "1") lsSet("diisoo_ctrl", "1");
    if (q.get("ctrl") === "0") lsSet("diisoo_ctrl", "0");
  } catch (e) {}
  function respActif() { return lsGet("diisoo_resp") !== "0"; }
  function ctrlActif() { return lsGet("diisoo_ctrl") === "1"; }

  /* Respelling : ñ et ŋ en debut de mot lus de travers par Oolel */
  function respell(t) {
    var s = String(t || "");
    s = s.replace(/(^|[^\p{L}])([ñÑ])/gu, function (m, a, n) { return a + (n === "Ñ" ? "Ny" : "ny"); });
    s = s.replace(/ŋ/g, "ng").replace(/Ŋ/g, "Ng");
    s = s.replace(/[\p{L}]+/gu, function (w) { var r = MOTS[w.toLowerCase()]; return r ? r : w; });
    return s;
  }

  function jour() { return new Date().toISOString().slice(0, 10); }
  function compteur() {
    try { var c = JSON.parse(lsGet("diisoo_oolel_cpt") || "{}"); return c.j === jour() ? c : { j: jour(), n: 0 }; } catch (e) { return { j: jour(), n: 0 }; }
  }

  var dernier = "";
  var f0 = window.fetch;
  if (typeof f0 !== "function") return;
  window.fetch = function (input, init) {
    try {
      var url = typeof input === "string" ? input : (input && input.url) || "";
      if (url.indexOf("/functions/v1/smart-handler") > -1 && init && typeof init.body === "string") {
        var b = JSON.parse(init.body);
        if (b && b.lang === "wo" && typeof b.texte === "string") {
          var c = compteur();
          if (c.n >= PLAFOND_JOUR) {
            return Promise.resolve(new Response(JSON.stringify({ error: "plafond jour" }), { status: 429, headers: { "Content-Type": "application/json" } }));
          }
          c.n++; lsSet("diisoo_oolel_cpt", JSON.stringify(c));
          dernier = b.texte;
          if (respActif()) {
            b.texte = respell(b.texte);
            init = Object.assign({}, init, { body: JSON.stringify(b) });
          }
        }
      }
    } catch (e) {}
    return f0.call(this, input, init);
  };

  /* Mode controle : bouton "Mal lu" */
  function liste() { try { return JSON.parse(lsGet("diisoo_mal_lu") || "[]"); } catch (e) { return []; } }
  function ajouterBouton() {
    if (!ctrlActif() || document.getElementById("diisoo-mallu")) return;
    var b = document.createElement("button");
    b.id = "diisoo-mallu";
    b.type = "button";
    b.style.cssText = "position:fixed;right:10px;bottom:90px;z-index:99998;background:#c0392b;color:#fff;border:0;border-radius:20px;padding:10px 14px;font:14px system-ui,sans-serif";
    function maj() { b.textContent = "Mal lu (" + liste().length + ")"; }
    maj();
    var timer = 0;
    b.onclick = function () {
      var l = liste();
      if (dernier && l.indexOf(dernier) < 0) { l.push(dernier); lsSet("diisoo_mal_lu", JSON.stringify(l)); }
      maj();
    };
    b.oncontextmenu = b.ontouchstart = function () { clearTimeout(timer); timer = setTimeout(function () { window.DiisooControleOolel.copier(); }, 900); };
    b.ontouchend = function () { clearTimeout(timer); };
    document.body.appendChild(b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ajouterBouton); else ajouterBouton();

  window.DiisooControleOolel = {
    respell: respell,
    mots: MOTS,
    liste: liste,
    compteur: compteur,
    copier: function () {
      var t = liste().join("\n");
      try { navigator.clipboard.writeText(t); if (typeof window.toast === "function") window.toast("Liste copiee, envoie-la dans la conversation"); } catch (e) {}
      return t;
    },
    vider: function () { lsSet("diisoo_mal_lu", "[]"); }
  };
})();
