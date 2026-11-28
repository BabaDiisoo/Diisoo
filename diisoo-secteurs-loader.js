/* diisoo-ios-perf.js : allege l'app sur iPhone. Une quarantaine de modules surveillent la page entiere (MutationObserver sur body,
 * sous-arbre complet) et se reveillent a CHAQUE changement : sur un ecran qui bouge (chronometre, conversation) l'iPhone fige.
 * Ici, les observateurs de la page entiere sont regroupes : au plus un reveil toutes les 250 ms, avec tous les changements d'un coup.
 * Sans effet hors iPhone/iPad. Interrupteur : ?perf=0 */
(function () {
  "use strict";
  if (window.__perfIosOK) return; window.__perfIosOK = true;
  if (!/iPhone|iPad|iPod/.test(navigator.userAgent || "")) return;
  try { if (new URLSearchParams(location.search).get("perf") === "0") return; } catch (e) {}
  var MO = window.MutationObserver || window.WebKitMutationObserver;
  if (!MO || MO.__diisooPerf) return;
  var DELAI = 250, stats = { reveils: 0, regroupes: 0 };
  function Regroupe(cb) {
    var self = this, file = [], minuteur = null, large = false;
    var vrai = new MO(function (recs) {
      if (!large) { stats.reveils++; try { cb.call(self, recs, self); } catch (e) { setTimeout(function () { throw e; }); } return; }
      for (var i = 0; i < recs.length; i++) file.push(recs[i]);
      if (file.length > 500) file.splice(0, file.length - 500);
      stats.regroupes++;
      if (minuteur) return;
      minuteur = setTimeout(function () {
        minuteur = null; var lot = file; file = []; stats.reveils++;
        try { cb.call(self, lot, self); } catch (e) { setTimeout(function () { throw e; }); }
      }, DELAI);
    });
    this.observe = function (cible, opts) {
      try { if (opts && opts.subtree && (cible === document.body || cible === document.documentElement || cible === document)) large = true; } catch (e) {}
      return vrai.observe(cible, opts);
    };
    this.disconnect = function () { if (minuteur) { clearTimeout(minuteur); minuteur = null; } file = []; return vrai.disconnect(); };
    this.takeRecords = function () { var r = vrai.takeRecords(); return file.concat(r); };
  }
  Regroupe.__diisooPerf = true;
  try { window.MutationObserver = Regroupe; window.WebKitMutationObserver = Regroupe; } catch (e) {}
  window.DiisooIosPerf = { stats: function () { return stats; } };
})();

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
    "diisoo-controle-oolel.js",
    "diisoo-fixe.js",
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
    "diisoo-tourisme.js", "diisoo-banque.js", "diisoo-mission-banque.js", "diisoo-telephone.js", "diisoo-mission-telephone.js", "diisoo-administration.js", "diisoo-mission-administration.js", "diisoo-etudes.js", "diisoo-mission-etudes.js", "diisoo-freelance.js", "diisoo-mission-freelance.js", "diisoo-fetes.js", "diisoo-mission-fetes.js", "diisoo-factures.js", "diisoo-mission-factures.js", "diisoo-diaspora.js", "diisoo-mission-diaspora.js",
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
    "diisoo-access.js", "diisoo-suivi.js",
    "diisoo-entree.js",
    "diisoo-accueil3.js",
    "diisoo-accueil4.js",
    "diisoo-fin1.js",
    "diisoo-wolof-plus.js"
  ];

  /* Correctif iPhone : charge en tout premier, avant tout contexte audio (sans effet hors iOS) */
  try {
    var ix = document.createElement("script");
    ix.src = "diisoo-ios-fix.js";
    (document.head || document.documentElement).appendChild(ix);
  } catch (e) {}

  /* Sonde iPhone : test du son et detection des fermetures brutales (sans effet hors iOS) */
  try {
    var so = document.createElement("script");
    so.src = "diisoo-ios-sonde.js";
    (document.head || document.documentElement).appendChild(so);
  } catch (e) {}

  /* Premier pas : la premiere lecon guidee s'ouvre toute seule apres "Commencer" (premiere visite) */
  try {
    var pp = document.createElement("script");
    pp.src = "diisoo-premier-pas.js";
    (document.head || document.documentElement).appendChild(pp);
  } catch (e) {}

  /* Lecture automatique des cartes (Anglais puis Wolof) : fichier autonome, hors bundle. Interrupteur : ?auto=0 */
  try {
    var au = document.createElement("script");
    au.src = "diisoo-auto.js";
    (document.head || document.documentElement).appendChild(au);
  } catch (e) {}

  /* Accueil unique des examens (grille de tuiles, sans defilement) : fichier autonome. Interrupteur : ?examen2=0 */
  try {
    var xa = document.createElement("script");
    xa.src = "diisoo-examen-accueil.js";
    (document.head || document.documentElement).appendChild(xa);
  } catch (e) {}

  /* Entree simplifiee : chargee tout de suite, avant le reste, pour que le premier ecran soit deja le bon */
  try {
    var e0 = document.createElement("script");
    e0.src = "diisoo-entree.js";
    (document.head || document.documentElement).appendChild(e0);
  } catch (e) {}

  /* Module IELTS phase 1 : fichier autonome, hors bundle (pas de régénération à faire) */
  try {
    var ie = document.createElement("script");
    ie.src = "diisoo-ielts-p1.js";
    (document.head || document.documentElement).appendChild(ie);
    var ie2 = document.createElement("script");
    ie2.src = "diisoo-ielts-p2.js";
    (document.head || document.documentElement).appendChild(ie2);
    var ie3 = document.createElement("script");
    ie3.src = "diisoo-ielts-p3.js";
    (document.head || document.documentElement).appendChild(ie3);
    var ie4 = document.createElement("script");
    ie4.src = "diisoo-ielts-p4.js";
    (document.head || document.documentElement).appendChild(ie4);
    var ie5 = document.createElement("script");
    ie5.src = "diisoo-ielts-p5.js";
    (document.head || document.documentElement).appendChild(ie5);
    var ie6 = document.createElement("script");
    ie6.src = "diisoo-ielts-p6.js";
    (document.head || document.documentElement).appendChild(ie6);
    var tf = document.createElement("script");
    tf.src = "diisoo-toefl.js";
    (document.head || document.documentElement).appendChild(tf);
    var tc = document.createElement("script");
    tc.src = "diisoo-toeic.js";
    (document.head || document.documentElement).appendChild(tc);
    var cb = document.createElement("script");
    cb.src = "diisoo-cambridge.js";
    (document.head || document.documentElement).appendChild(cb);
    var dl = document.createElement("script");
    dl.src = "diisoo-duolingo.js";
    (document.head || document.documentElement).appendChild(dl);
    var pt = document.createElement("script");
    pt.src = "diisoo-pte.js";
    (document.head || document.documentElement).appendChild(pt);
    var ve = document.createElement("script");
    ve.src = "diisoo-voix-en.js";
    (document.head || document.documentElement).appendChild(ve);
    var vw = document.createElement("script");
    vw.src = "diisoo-voix-wo.js";
    (document.head || document.documentElement).appendChild(vw);
  } catch (e) {}

  function sequentiel(i) {
    if (i >= FICHIERS.length) return;
    var s = document.createElement("script");
    s.src = FICHIERS[i];
    s.onload = function () { sequentiel(i + 1); };
    s.onerror = function () { console.error("Diisoo : fichier introuvable " + FICHIERS[i]); sequentiel(i + 1); };
    document.body.appendChild(s);
  }

  function bundleUnique() {
    var b = document.createElement("script");
    b.src = "diisoo-bundle.js";
    var repli = function () { if (!window.__diisooBundle) { console.warn("Diisoo : chargement fichier par fichier"); sequentiel(0); } };
    b.onload = repli; b.onerror = repli;
    document.body.appendChild(b);
  }

  /* Demarrage en 6 morceaux : le telephone respire entre chaque morceau. ?lent=0 = ancien bundle unique. */
  function morceaux(i) {
    if (i > 6) return;
    var s = document.createElement("script");
    s.src = "diisoo-b" + i + ".js";
    s.onload = function () { setTimeout(function () { morceaux(i + 1); }, 30); };
    s.onerror = function () {
      console.error("Diisoo : morceau introuvable " + i);
      if (i === 1) bundleUnique(); else morceaux(i + 1);
    };
    document.body.appendChild(s);
  }

  function demarrer() {
    setTimeout(function () {
      var unique = false;
      try { unique = new URLSearchParams(location.search).get("lent") === "0"; } catch (e) {}
      if (unique) bundleUnique(); else morceaux(1);
    }, 100);
  }

  if (document.readyState === "complete") demarrer();
  else window.addEventListener("load", demarrer);
})();
