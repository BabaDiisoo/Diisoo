/* diisoo-secteurs-ui.js (v2)
 * Anglais des marches : meme apparence et meme logique que les autres secteurs Business
 * (un titre, un niveau, une carte a la fois, fleches et barre de progression).
 * Usage : DiisooSecteursUI.menu(conteneur) ; DiisooSecteursUI.ouvrir(id, conteneur)
 * Voix : window.diisooParler(texte, langue). Evaluation et XP : DiisooSecteurs (inchange).
 */
(function () {
  "use strict";

  var CSS = [
    ".mk{display:flex;flex-direction:column;gap:.5rem}",
    ".mk-h{font-size:.875rem;font-weight:700;color:#F6F1E7;text-align:center;margin:0}",
    ".mk-lvl{font-size:11px;font-weight:700;color:#C99CEA;padding-top:6px;margin:0}",
    ".mk-cap{font-size:10px;font-weight:700;color:#8C8064;text-transform:uppercase;letter-spacing:.06em;margin:0}",
    ".mk-nav{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;padding:2px 0}",
    ".mk-row{display:flex;align-items:center;justify-content:center;width:100%}",
    ".mk-arr{background:#141A2B;border:1px solid #1E2740;color:#C9BFA8;border-radius:9999px;width:34px;height:34px;font-size:16px;line-height:1;padding:0}",
    ".mk-rowlab{flex:1;text-align:center;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#8C8064}",
    ".mk-bar{width:100%;height:4px;border-radius:9999px;background:#1E2740;margin:6px 0 4px;overflow:hidden}",
    ".mk-fill{height:100%;background:#E1693F;border-radius:9999px;transition:width .25s}",
    ".mk-card{background:#141A2B;border:1px solid #1E2740;border-radius:.75rem;padding:.75rem;display:flex;flex-direction:column;gap:.25rem;animation:mkin .22s ease-out}",
    "@keyframes mkin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}",
    ".mk-en{font-size:.875rem;font-weight:600;color:#F6F1E7}",
    ".mk-big{font-size:1rem;font-weight:700;color:#F6F1E7;line-height:1.35}",
    ".mk-fr{font-size:.75rem;color:#A69C86}",
    ".mk-wo{font-size:.75rem;color:#5FC98F;font-style:italic}",
    ".mk-role{font-size:10px;font-weight:700;color:#C99CEA;text-transform:uppercase;letter-spacing:.06em}",
    ".mk-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-top:.25rem}",
    ".mk-b{background:#1E2740;color:#E4DCC9;border:0;border-radius:.5rem;padding:.5rem;font-size:11px;font-weight:600}",
    ".mk-b:active{background:#2A3454}",
    ".mk-go{width:100%;padding:.8rem;border-radius:.75rem;font-size:.85rem;font-weight:700;margin-top:.25rem}",
    ".mk-sec{width:100%;padding:.7rem;border-radius:.75rem;background:#141A2B;color:#A69C86;font-size:.75rem;font-weight:600;border:1px solid #1E2740}",
    ".mk-choix{display:block;width:100%;text-align:left;background:#1E2740;color:#F6F1E7;border:2px solid transparent;border-radius:.75rem;padding:.8rem;margin-top:.4rem;font-size:.85rem}",
    ".mk-choix:active{border-color:#E1693F}",
    ".mk-ok{color:#5FC98F}.mk-ko{color:#EE85A3}"
  ].join("");

  function injecterCSS() {
    if (document.getElementById("mk-css")) return;
    var s = document.createElement("style");
    s.id = "mk-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function parler(texte, langue) {
    if (typeof window.diisooParler === "function") { try { window.diisooParler(texte, langue || "en"); } catch (e) {} }
  }
  function emoji(en) {
    try { return (window.DiisooImages && window.DiisooImages.emojiFor(en)) || ""; } catch (e) { return ""; }
  }
  function boutons(en, wo) {
    var h = '<div class="mk-grid" style="' + (wo ? "" : "grid-template-columns:1fr") + '">';
    if (en) h += '<button type="button" class="mk-b" data-say="' + esc(en) + '" data-lang="en">🔊 English</button>';
    if (wo) h += '<button type="button" class="mk-b" data-say="' + esc(wo) + '" data-lang="wo">🔊 Wolof</button>';
    return h + "</div>";
  }
  function lier(racine) {
    var b = racine.querySelectorAll("[data-say]");
    for (var i = 0; i < b.length; i++) b[i].addEventListener("click", function () { parler(this.getAttribute("data-say"), this.getAttribute("data-lang")); });
  }
  function nav(lab, pct) {
    return '<div class="mk-nav"><div class="mk-row"><button type="button" class="mk-arr" data-d="-1" aria-label="Precedent">‹</button>' +
      '<div class="mk-rowlab">' + esc(lab) + '</div><button type="button" class="mk-arr" data-d="1" aria-label="Suivant">›</button></div>' +
      '<div class="mk-bar"><div class="mk-fill" style="width:' + pct + '%"></div></div></div>';
  }
  var ORDRE_MARCHE = { colobane: 0, sandaga: 1, centenaire: 2, guangzhou: 3 };
  function niveauLabel(n) { return n === "intermediaire" ? "📈 Intermédiaire" : "🌱 Débutant"; }

  function menu(conteneur) {
    injecterCSS();
    var liste = window.DiisooSecteurs.liste().slice().sort(function (a, b) {
      var na = a.niveau === "intermediaire" ? 1 : 0, nb = b.niveau === "intermediaire" ? 1 : 0;
      if (na !== nb) return na - nb;
      return (ORDRE_MARCHE[String(a.marche).toLowerCase().split(" ")[0]] || 0) - (ORDRE_MARCHE[String(b.marche).toLowerCase().split(" ")[0]] || 0);
    });
    if (!liste.length) { conteneur.innerHTML = '<p class="mk-fr" style="text-align:center">Modules indisponibles pour le moment.</p>'; return; }
    var cur = 0;
    for (var i = 0; i < liste.length; i++) { if (!liste[i].fait) { cur = i; break; } }
    function rendre() {
      var m = liste[cur];
      conteneur.innerHTML = '<div class="mk"><h4 class="mk-h">🛒 Anglais des marchés</h4>' +
        nav("Module " + (cur + 1) + " sur " + liste.length, Math.round((cur + 1) / liste.length * 100)) +
        '<p class="mk-lvl">' + niveauLabel(m.niveau) + "</p>" +
        '<div class="mk-card"><p class="mk-en">' + esc(m.marche) + '</p><p class="mk-fr">' + esc(m.theme) + "</p>" +
        '<p class="mk-wo" style="font-style:normal">' + (m.fait ? "✅ Terminé" : "+" + m.xp + " XP") + "</p>" +
        '<button type="button" class="mk-go btn-primary" id="mk-start">' + (m.fait ? "Refaire ▶" : "Commencer ▶") + "</button></div></div>";
      var arr = conteneur.querySelectorAll(".mk-arr");
      for (var k = 0; k < arr.length; k++) arr[k].addEventListener("click", function () {
        var n = cur + parseInt(this.getAttribute("data-d"), 10);
        if (n >= 0 && n < liste.length) { cur = n; rendre(); }
      });
      conteneur.querySelector("#mk-start").addEventListener("click", function () { ouvrir(liste[cur].id, conteneur); });
    }
    rendre();
  }

  function ouvrir(id, conteneur) {
    injecterCSS();
    var m = window.DiisooSecteurs.obtenir(id);
    if (!m) { conteneur.innerHTML = '<p class="mk-fr">Module introuvable.</p>'; return; }
    var cartes = [];
    cartes.push({ t: "accroche", cap: "Pour commencer", en: m.accroche.en, fr: m.accroche.fr });
    (m.vocabulaire || []).forEach(function (v) { cartes.push({ t: "voc", cap: "Vocabulaire à écouter et répéter", en: v.en, fr: v.fr }); });
    (m.pont_wolof || []).forEach(function (p) { cartes.push({ t: "pont", cap: "En wolof, sur le marché", en: p.en, wo: p.wo }); });
    (m.dialogue || []).forEach(function (d) { cartes.push({ t: "dlg", cap: "Dialogue", role: d.role, en: d.en, fr: d.fr }); });
    (m.pratique_micro || []).forEach(function (p) { cartes.push({ t: "prat", cap: "Répète 3 fois à voix haute", en: p }); });
    if (m.defi) cartes.push({ t: "defi", cap: "Défi", en: m.defi.en, fr: m.defi.fr });
    var nq = (m.evaluation || []).length;
    (m.evaluation || []).forEach(function (q, i) { cartes.push({ t: "quiz", cap: "Question " + (i + 1) + " sur " + nq, q: q }); });
    var pos = 0, reponses = [];

    function entete() {
      return '<h4 class="mk-h">🛒 ' + esc(m.marche) + " · " + esc(m.theme) + "</h4>" +
        nav(pos < cartes.length ? "Étape " + (pos + 1) + " sur " + cartes.length : "Résultat", Math.round((Math.min(pos + 1, cartes.length)) / cartes.length * 100)) +
        '<p class="mk-lvl">' + niveauLabel(m.niveau) + "</p>";
    }
    function lierNav() {
      var arr = conteneur.querySelectorAll(".mk-arr");
      for (var k = 0; k < arr.length; k++) arr[k].addEventListener("click", function () {
        var n = pos + parseInt(this.getAttribute("data-d"), 10);
        var maxLibre = cartes.length - nq;   // les questions ne se sautent pas
        if (n >= 0 && n <= Math.max(maxLibre, 0) && n < cartes.length) { pos = n; rendre(); }
      });
    }
    function retour() {
      return '<button type="button" class="mk-sec" id="mk-back">⬅️ Retour aux marchés</button>';
    }
    function rendre() {
      var c = cartes[pos], h = '<div class="mk">' + entete();
      var em = c.en ? emoji(c.en) : "";
      if (c.t === "quiz") {
        h += '<p class="mk-cap">' + esc(c.cap) + '</p><div class="mk-card"><p class="mk-big">' + esc(c.q.q) + "</p>";
        c.q.choix.forEach(function (x) { h += '<button type="button" class="mk-choix" data-c="' + esc(x) + '">' + esc(x) + "</button>"; });
        h += "</div>";
      } else {
        h += '<p class="mk-cap">' + esc(c.cap) + "</p>";
        h += '<div class="mk-card' + (em ? " fx-em" : "") + '"' + (em ? ' data-em="' + em + '"' : "") + ">";
        if (c.role) h += '<p class="mk-role">' + (/vend|march/i.test(c.role) ? "🧑‍💼 " : "🛍️ ") + esc(c.role) + "</p>";
        h += '<p class="' + (c.t === "accroche" || c.t === "defi" || c.t === "prat" ? "mk-big" : "mk-en") + '">' + esc(c.en) + "</p>";
        if (c.fr) h += '<p class="mk-fr">' + esc(c.fr) + "</p>";
        if (c.wo) h += '<p class="mk-wo">🗣️ ' + esc(c.wo) + "</p>";
        if (c.t !== "defi") h += boutons(c.en, c.wo);
        var dernier = pos === cartes.length - nq - 1;
        h += '<button type="button" class="mk-go btn-primary" id="mk-next">' + (dernier && nq ? "Passer aux questions ▶" : "Suivant ▶") + "</button></div>";
      }
      h += retour() + "</div>";
      conteneur.innerHTML = h;
      lier(conteneur); lierNav();
      conteneur.querySelector("#mk-back").addEventListener("click", function () { menu(conteneur); });
      var n = conteneur.querySelector("#mk-next");
      if (n) n.addEventListener("click", function () { if (pos < cartes.length - 1) { pos++; rendre(); } });
      var ch = conteneur.querySelectorAll(".mk-choix");
      for (var i = 0; i < ch.length; i++) ch[i].addEventListener("click", function () {
        reponses[pos - (cartes.length - nq)] = this.getAttribute("data-c");
        if (pos < cartes.length - 1) { pos++; rendre(); } else fin();
      });
    }
    function fin() {
      var r = window.DiisooSecteurs.evaluer(id, reponses);
      var h = '<div class="mk"><h4 class="mk-h">🛒 ' + esc(m.marche) + " · " + esc(m.theme) + "</h4>";
      h += '<div class="mk-card"><p class="mk-big ' + (r.reussi ? "mk-ok" : "mk-ko") + '">' + (r.reussi ? "Bravo ! " : "Presque. ") + r.bonnes + "/" + nq + "</p>";
      if (r.xp) h += '<p class="mk-wo" style="font-style:normal">+' + r.xp + " XP</p>";
      h += '<p class="mk-fr">' + esc(r.reussi ? m.recap : "Il faut 2 bonnes réponses sur 3. Réessaie.") + "</p></div>";
      h += '<button type="button" class="mk-go btn-primary" id="mk-fin">' + (r.reussi && r.suivant ? "Marché suivant ▶" : "Retour aux marchés") + "</button>";
      if (!r.reussi) h += '<button type="button" class="mk-sec" id="mk-retry">Réessayer</button>';
      h += "</div>";
      conteneur.innerHTML = h;
      conteneur.querySelector("#mk-fin").addEventListener("click", function () {
        if (r.reussi && r.suivant && window.DiisooSecteurs.obtenir(r.suivant)) ouvrir(r.suivant, conteneur); else menu(conteneur);
      });
      var rt = conteneur.querySelector("#mk-retry");
      if (rt) rt.addEventListener("click", function () { reponses = []; pos = cartes.length - nq; rendre(); });
    }
    rendre();
  }

  window.DiisooSecteursUI = { menu: menu, ouvrir: ouvrir };
})();
