/* diisoo-secteurs-loader.js v2
 * Charge Diisoo en UN seul fichier (diisoo-bundle.js) : l'app démarre plus vite sur réseau mobile.
 * Si ce fichier est absent ou invalide, retour automatique au chargement fichier par fichier (ancienne méthode).
 */
(function () {
  "use strict";
  var FICHIERS = [
    "diisoo-secteurs.js",
    "diisoo-secteurs-ui.js",
    "diisoo-secteurs-init.js",
    "diisoo-pron.js",
    "diisoo-voix-court.js",
    "diisoo-essai.js",
    "diisoo-accueil.js",
    "diisoo-partage.js",
    "diisoo-ui.js",
    "diisoo-coach.js",
    "diisoo-themes-extra.js",
    "diisoo-lecons.js",
    "diisoo-reseau.js",
    "diisoo-coach-liens.js",
    "diisoo-examens-coach.js",
    "diisoo-pron-business.js",
    "diisoo-ios-audio.js",
    "diisoo-direct.js",
    "diisoo-orga.js",
    "diisoo-wamic.js",
    "diisoo-aide-wolof.js",
    "diisoo-biz.js", "diisoo-biz-plus.js",
    "diisoo-passage.js",
    "diisoo-stable.js",
    "diisoo-tourisme.js",
    "diisoo-son.js",
    "diisoo-objectif.js",
    "diisoo-installer.js",
    "diisoo-assistant.js",
    "diisoo-coach2.js",
    "diisoo-parrainage.js",
    "diisoo-oral.js",
    "diisoo-exams2.js",
    "diisoo-premium.js",
    "diisoo-guide.js",
    "diisoo-seance.js", "diisoo-conversation.js", "diisoo-indulgence.js", "diisoo-priorites.js", "diisoo-continuer.js","diisoo-examens-hub.js","diisoo-lecons-plus.js","diisoo-universel.js","diisoo-arrivee.js","diisoo-question-jour.js","diisoo-voix-lab.js",
    "diisoo-access.js", "diisoo-suivi.js"
  ];

  function sequentiel(i) {
    if (i >= FICHIERS.length) return;
    var s = document.createElement("script");
    s.src = FICHIERS[i];
    s.onload = function () { sequentiel(i + 1); };
    s.onerror = function () { console.error("Diisoo : fichier introuvable " + FICHIERS[i]); sequentiel(i + 1); };
    document.body.appendChild(s);
  }

  function demarrer() {
    setTimeout(function () {
      var b = document.createElement("script");
      b.src = "diisoo-bundle.js";
      var repli = function () { if (!window.__diisooBundle) { console.warn("Diisoo : chargement fichier par fichier"); sequentiel(0); } };
      b.onload = repli; b.onerror = repli;
      document.body.appendChild(b);
    }, 100);
  }

  if (document.readyState === "complete") demarrer();
  else window.addEventListener("load", demarrer);
})();
