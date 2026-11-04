/* diisoo-secteurs-loader.js
 * Charge les scripts de Diisoo dans l'ordre, après le chargement complet de la page.
 * Un fichier introuvable n'arrête plus les suivants.
 */
(function () {
  "use strict";
  var FICHIERS = [
    "diisoo-secteurs.js", "diisoo-secteurs-ui.js", "diisoo-secteurs-init.js", "diisoo-pron.js", "diisoo-voix-court.js",
    "diisoo-essai.js", "diisoo-accueil.js", "diisoo-partage.js", "diisoo-ui.js", "diisoo-coach.js",
    "diisoo-themes-extra.js", "diisoo-lecons.js", "diisoo-reseau.js", "diisoo-coach-liens.js", "diisoo-examens-coach.js",
    "diisoo-pron-business.js", "diisoo-ios-audio.js", "diisoo-direct.js", "diisoo-orga.js", "diisoo-wamic.js",
    "diisoo-aide-wolof.js", "diisoo-biz.js", "diisoo-passage.js", "diisoo-stable.js", "diisoo-tourisme.js",
    "diisoo-son.js", "diisoo-objectif.js", "diisoo-installer.js", "diisoo-assistant.js", "diisoo-coach2.js",
    "diisoo-parrainage.js", "diisoo-oral.js", "diisoo-exams2.js", "diisoo-premium.js", "diisoo-guide.js", "diisoo-seance.js", "diisoo-access.js"
  ];

  function charger(i) {
    if (i >= FICHIERS.length) return;
    var s = document.createElement("script");
    s.src = FICHIERS[i];
    s.onload = function () { charger(i + 1); };
    s.onerror = function () { console.error("Diisoo : fichier introuvable " + FICHIERS[i]); charger(i + 1); };
    document.body.appendChild(s);
  }

  function demarrer() { setTimeout(function () { charger(0); }, 300); }

  if (document.readyState === "complete") demarrer();
  else window.addEventListener("load", demarrer);
})();
