/* diisoo-secteurs.js
 * Chargeur des modules sectoriels (Colobane, Sandaga, Centenaire, Guangzhou).
 * Zero-Breaking Change : aucune clé existante n'est lue ni modifiée.
 * Clé propre : "diisoo_secteurs_v1" (localStorage). Aucun accès à IndexedDB.
 */
(function () {
  "use strict";

  var MODULES = [
    "diisoo-module-colobane.json",
    "diisoo-module-sandaga.json",
    "diisoo-module-centenaire.json",
    "diisoo-module-guangzhou.json"
  ];
  var KEY = "diisoo_secteurs_v1";
  var cache = {};

  function lireEtat() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { faits: {} }; }
    catch (e) { return { faits: {} }; }
  }

  function ecrireEtat(etat) {
    try { localStorage.setItem(KEY, JSON.stringify(etat)); } catch (e) {}
  }

  function charger(fichier) {
    return fetch(fichier, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error(fichier + " " + r.status);
        return r.json();
      })
      .then(function (m) { cache[m.id] = m; return m; })
      .catch(function () { return null; });
  }

  function chargerTout() {
    return Promise.all(MODULES.map(charger)).then(function (liste) {
      return liste.filter(Boolean);
    });
  }

  function liste() {
    var etat = lireEtat();
    return Object.keys(cache).map(function (id) {
      var m = cache[id];
      return {
        id: m.id,
        marche: m.marche,
        theme: m.theme,
        niveau: m.niveau,
        xp: m.xp,
        fait: !!etat.faits[id]
      };
    });
  }

  function obtenir(id) { return cache[id] || null; }

  /* Évaluation : reponses = tableau de textes choisis (3 questions).
   * Valide à 2 bonnes réponses sur 3. XP donné une seule fois par module. */
  function evaluer(id, reponses) {
    var m = cache[id];
    if (!m) return { ok: false, raison: "module introuvable" };
    var bonnes = 0;
    m.evaluation.forEach(function (q, i) {
      if (reponses[i] === q.reponse) bonnes++;
    });
    var reussi = bonnes >= 2;
    var etat = lireEtat();
    var xpGagne = 0;
    if (reussi && !etat.faits[id]) {
      etat.faits[id] = { date: new Date().toISOString(), score: bonnes };
      xpGagne = m.xp;
      ecrireEtat(etat);
      /* Brancher ici l'XP existant de Diisoo, par exemple : */
      /* if (window.validerExercice) window.validerExercice(id, xpGagne); */
      document.dispatchEvent(new CustomEvent("diisoo:secteur-valide", {
        detail: { id: id, xp: xpGagne, score: bonnes }
      }));
    }
    return { ok: true, reussi: reussi, bonnes: bonnes, xp: xpGagne, suivant: m.suivant };
  }

  window.DiisooSecteurs = {
    chargerTout: chargerTout,
    liste: liste,
    obtenir: obtenir,
    evaluer: evaluer
  };
})();
