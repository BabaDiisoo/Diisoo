/* diisoo-accueil4.js : accueil plus clair.
 * Les icones du bandeau portent un mot : Ligue pour le trophee, Rappel pour la cloche (sans casser la ligne sur petit ecran).
 * Interrupteur : ?accueil4=0 remet l'ancien affichage. Aucun fichier existant modifie. */
(function () {
  "use strict";
  if (window.__accueil4) return; window.__accueil4 = true;
  try { if (new URLSearchParams(location.search).get("accueil4") === "0") return; } catch (e) {}
  var st = document.createElement("style");
  st.textContent =
    "#xp-label{white-space:nowrap!important;font-size:12px!important}" +
    "#xp-label *{white-space:nowrap!important}" +
    "#dii-ligue-c{padding-left:8px!important;padding-right:8px!important;white-space:nowrap}" +
    "#streak-counter{white-space:nowrap}" +
    "*:has(> #dii-ligue-c){flex-wrap:wrap!important;row-gap:8px!important}" +
    "#dii-ligue-c::after{content:' Ligue';font-size:11.5px;font-weight:700;margin-left:3px}" +
    "body.rp-off #streak-counter::after{content:' 🔔 Rappel'!important;font-size:11.5px}";
  document.head.appendChild(st);
})();
