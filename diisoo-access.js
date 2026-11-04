/* diisoo-access.js v1 : accessibilité et confort de lecture
   - texte jamais plus petit que 12 px (les mentions de 9 et 10 px étaient trop petites sur téléphone)
   - réglage « Taille du texte » dans le menu : Normal / Grand / Très grand, mémorisé
   - noms lisibles (aria-label) pour les boutons faits d'un seul pictogramme
   - contour visible au clavier, zones tactiles d'au moins 44 px dans les leçons
   Aucun fichier existant n'est modifié. */
(function () {
  "use strict";
  if (window.DiisooAccess) return;
  var $ = function (id) { return document.getElementById(id); };
  var CLE = "diisoo_taille_texte";
  var TAILLES = [["1", "Normal"], ["1.12", "Grand"], ["1.2", "Très grand"]];

  function lire() { try { return localStorage.getItem(CLE) || "1"; } catch (e) { return "1"; } }
  function ecrire(v) { try { localStorage.setItem(CLE, v); } catch (e) {} }

  function css() {
    if ($("dacc-css")) return;
    var s = document.createElement("style"); s.id = "dacc-css";
    s.textContent =
      ".text-\\[9px\\],.text-\\[10px\\]{font-size:12px!important;line-height:1.35!important}" +
      ".text-\\[11px\\]{font-size:12.5px!important}" +
      "button:focus-visible,a:focus-visible,[role=button]:focus-visible,input:focus-visible{outline:3px solid #F3A94E!important;outline-offset:2px}" +
      "#general-tabs button,#wolof-tabs button{min-height:44px}" +
      "button[data-practice]{min-height:48px}" +
      "html[data-dacc=\"1.12\"] body{zoom:1.12}html[data-dacc=\"1.2\"] body{zoom:1.2}" +
      "#dacc-row{display:flex;gap:6px;padding:8px 16px 12px}" +
      "#dacc-row button{flex:1;min-height:44px;border-radius:12px;background:#0B0F1C;border:1px solid #1E2740;color:#C9BFA8;font-weight:700}" +
      "#dacc-row button[aria-pressed=true]{border-color:#E1693F;color:#F6F1E7;background:#2a1a12}";
    document.head.appendChild(s);
  }

  function appliquer(v) {
    document.documentElement.setAttribute("data-dacc", v);
    var b = $("dacc-row"); if (!b) return;
    Array.prototype.forEach.call(b.querySelectorAll("button"), function (x) { x.setAttribute("aria-pressed", x.dataset.v === v ? "true" : "false"); });
  }

  function menu() {
    var m = $("burger-menu"), fin = $("menu-session");
    if (!m || !fin || $("dacc-row")) return;
    var t = document.createElement("p");
    t.className = "px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#8C8064]"; t.id = "dacc-titre"; t.textContent = "Taille du texte";
    var row = document.createElement("div"); row.id = "dacc-row"; row.setAttribute("role", "group"); row.setAttribute("aria-label", "Taille du texte");
    TAILLES.forEach(function (x) {
      var b = document.createElement("button"); b.type = "button"; b.dataset.v = x[0]; b.textContent = x[1];
      b.onclick = function (e) { e.stopPropagation(); ecrire(x[0]); appliquer(x[0]); };
      row.appendChild(b);
    });
    m.insertBefore(t, fin); m.insertBefore(row, fin);
    appliquer(lire());
  }

  /* Un bouton qui ne contient qu'un pictogramme reçoit un nom lisible par les lecteurs d'écran */
  var NOMS = { "🔊": "Écouter", "🎤": "Parler", "🎙️": "Parler", "⬅️": "Retour", "⬅": "Retour", "☰": "Menu", "✕": "Fermer", "✖": "Fermer", "×": "Fermer", "💾": "Sauvegarder", "🔁": "Rejouer", "▶️": "Lancer", "⏸": "Pause" };
  function nommer(racine) {
    var bs = (racine || document).querySelectorAll("button:not([aria-label]),a[role=button]:not([aria-label])");
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i], t = (b.textContent || "").trim();
      if (b.title) { b.setAttribute("aria-label", b.title); continue; }
      if (t && NOMS[t]) b.setAttribute("aria-label", NOMS[t]);
    }
    var inps = (racine || document).querySelectorAll("input:not([aria-label]):not([type=hidden])");
    for (var j = 0; j < inps.length; j++) { var p = inps[j].placeholder; if (p) inps[j].setAttribute("aria-label", p); }
  }
  var plan = false;
  function planifier() { if (plan) return; plan = true; setTimeout(function () { plan = false; try { nommer(); menu(); } catch (e) {} }, 300); }

  css();
  appliquer(lire());
  try { new MutationObserver(planifier).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  planifier();
  window.DiisooAccess = { version: 1, taille: function (v) { ecrire(String(v)); appliquer(String(v)); } };
})();
