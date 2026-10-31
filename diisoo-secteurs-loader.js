/* diisoo-secteurs-loader.js
 * Charge les 3 scripts sectoriels dans l'ordre, après le chargement complet de la page.
 * Une seule ligne dans index.html, à n'importe quel endroit.
 */
(function () {
  "use strict";
var FICHIERS = ["diisoo-secteurs.js", "diisoo-secteurs-ui.js", "diisoo-secteurs-init.js", "diisoo-pron.js", "diisoo-voix-court.js", "diisoo-essai.js", "diisoo-accueil.js", "diisoo-partage.js", "diisoo-ui.js", "diisoo-coach.js",  
    "diisoo-themes-extra.js", "diisoo-lecons.js", "diisoo-reseau.js", "diisoo-coach-liens.js", "diisoo-examens-coach.js", "diisoo-pron-business.js", "diisoo-ios-audio.js", "diisoo-direct.js", "diisoo-orga.js", "diisoo-wamic.js", "diisoo-aide-wolof.js" ];
  function charger(i) {
    if (i >= FICHIERS.length) return;
    var s = document.createElement("script");
    s.src = FICHIERS[i];
    s.onload = function () { charger(i + 1); };
    s.onerror = function () { console.error("Secteurs : fichier introuvable " + FICHIERS[i]); };
    document.body.appendChild(s);
  }

  function demarrer() { setTimeout(function () { charger(0); }, 300); }

  if (document.readyState === "complete") demarrer();
  else window.addEventListener("load", demarrer);
})();
