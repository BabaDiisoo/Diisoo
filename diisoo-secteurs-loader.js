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
    "diisoo-biz.js", "diisoo-biz-plus.js", "diisoo-colobane-plus.js", "diisoo-mission-colobane.js", "diisoo-sandaga-plus.js", "diisoo-mission-sandaga.js", "diisoo-chine-plus.js", "diisoo-mission-chine.js", "diisoo-agriculture-plus.js", "diisoo-mission-agribiz.js", "diisoo-hotel-plus.js", "diisoo-mission-hotel.js", "diisoo-restaurant-plus.js", "diisoo-mission-restaurant.js", "diisoo-guide-plus.js", "diisoo-mission-guide.js", "diisoo-transport-plus.js", "diisoo-mission-transport.js", "diisoo-artisanat-plus.js", "diisoo-mission-artisanat.js", "diisoo-agence-plus.js", "diisoo-mission-agence.js", "diisoo-plage-plus.js", "diisoo-mission-plage.js", "diisoo-bazar-plus.js", "diisoo-mission-bazar.js", "diisoo-electronique-plus.js", "diisoo-mission-electronique.js",
    "diisoo-passage.js",
    "diisoo-stable.js",
    "diisoo-tourisme.js",
    "diisoo-son.js",
    "diisoo-objectif.js",
    "diisoo-rappel.js",
    "diisoo-recap.js",
    "diisoo-defi.js",
    "diisoo-mission-visa.js", "diisoo-mission-marche.js", "diisoo-mission-voyage.js", "diisoo-mission-presentation.js", "diisoo-mission-famille.js", "diisoo-mission-emploi.js", "diisoo-mission-sante.js", "diisoo-mission-nourriture.js", "diisoo-mission-temps.js", "diisoo-mission-logement.js", "diisoo-mission-agriculture.js",
    "diisoo-installer.js",
    "diisoo-assistant.js",
    "diisoo-coach2.js",
    "diisoo-parrainage.js",
    "diisoo-oral.js",
    "diisoo-exams2.js",
    "diisoo-premium.js",
    "diisoo-guide.js",
    "diisoo-seance.js", "diisoo-conversation.js", "diisoo-indulgence.js", "diisoo-priorites.js", "diisoo-continuer.js","diisoo-examens-hub.js","diisoo-lecons-plus.js","diisoo-universel.js","diisoo-arrivee.js","diisoo-question-jour.js","diisoo-quete.js", "diisoo-aujourdhui.js", "diisoo-accueil2.js", "diisoo-diag.js", "diisoo-ligue.js", "diisoo-invite-moment.js", "diisoo-ecoute.js", "diisoo-abc.js",
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
