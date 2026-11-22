/* diisoo-accueil3.js : un seul gros bouton d'action sur l'accueil.
 * - Utilisateur qui revient : « Continuer » passe en premier, la carte micro devient une ligne discrete.
 * - Nouvel utilisateur : bouton « Commencer ma premiere lecon » en premier.
 * Interrupteur : ?accueil3=0 remet l'ancien accueil. Aucun fichier existant modifie. */
(function () {
  "use strict";
  if (window.__accueil3) return; window.__accueil3 = true;
  try { if (new URLSearchParams(location.search).get("accueil3") === "0") return; } catch (e) {}
  function $(id) { return document.getElementById(id); }

  var st = document.createElement("style");
  st.textContent =
    "#dg-open.dg-compact{padding:8px 12px!important;border:1px dashed #2A3454!important;background:transparent!important;animation:none!important;box-shadow:none!important;border-radius:14px!important}" +
    "#dg-open.dg-compact .dg-mic{width:30px!important;height:30px!important;font-size:16px!important}" +
    "#dg-open.dg-compact .dg-s{display:none!important}" +
    "#dg-open.dg-compact b{font-size:13px!important;font-weight:600!important;color:#C9BFA8}" +
    "#dstart{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:14px;border-radius:18px;background:linear-gradient(135deg,#E1693F,#F3A94E);color:#1a1208;border:0;min-height:64px}" +
    "#dstart .p{flex:none;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;font-size:18px}" +
    "#dstart b{display:block;font-size:17px;line-height:1.2}#dstart small{display:block;font-size:13px;opacity:.9;margin-top:2px}";
  document.head.appendChild(st);

  function demarrer() {
    try {
      if (window.DiisooVoixGuide && window.DiisooVoixGuide.aller) window.DiisooVoixGuide.aller({ type: "anglais", cle: "intro", niv: 1 });
    } catch (e) {}
    /* v2 : la premiere lecon s'ouvre directement en seance guidee (un seul gros bouton), pas sur la page aux 15 boutons. Contenu universel : Se presenter. */
    var essais = 0, t = setInterval(function () {
      essais++;
      try {
        if (window.DiisooSeance && window.DiisooSeance.demarrer && document.querySelector("#screen-general:not(.hidden)")) {
          clearInterval(t); window.DiisooSeance.demarrer("general", 5); return;
        }
      } catch (e) {}
      if (essais > 15) clearInterval(t);
    }, 300);
  }

  function ajuster() {
    try {
      var d = $("screen-dashboard"), g = $("dg-open"), c = $("dcont"), s = $("dstart");
      if (!d || d.classList.contains("hidden") || !g) return;
      if (c) {
        if (s) s.remove();
        g.classList.add("dg-compact");
        if (c.nextElementSibling !== g && c.compareDocumentPosition(g) & 2) { /* g avant c : on remet c avant g */ }
        if (g.compareDocumentPosition(c) & 4) g.parentNode.insertBefore(c, g); /* c apres g : on le place avant */
      } else {
        g.classList.remove("dg-compact");
        if (!s) {
          s = document.createElement("button");
          s.type = "button"; s.id = "dstart";
          s.innerHTML = '<span class="p">▶</span><span><b>Commencer ma première leçon</b><small>Se présenter en anglais, 1 minute</small></span>';
          s.onclick = demarrer;
          g.parentNode.insertBefore(s, g);
        }
      }
    } catch (e) {}
  }
  setInterval(ajuster, 800);
  setTimeout(ajuster, 500);
})();
