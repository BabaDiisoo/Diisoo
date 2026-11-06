/* diisoo-priorites.js v1 : les thèmes et les secteurs sont rangés par priorité d'usage, dans toute l'application.
   Anglais : Se présenter d'abord, puis nombres, famille, nourriture... ; les thèmes touristiques viennent après les thèmes de base.
   Wolof : Salutations d'abord. Tourisme (Business) : Hôtel, Restaurant, Taxi, Guide, Plage, Artisanat, Agence.
   Niveaux : « Demander son chemin » passe en niveau 1, « Réserver un hôtel » en niveau 2 (difficulté croissante). */
(function () {
  "use strict";
  if (window.__diisooPriorites) return;
  window.__diisooPriorites = true;
  var NIVEAU = { directions: 1, hotel: 2 };
  var ORDRE_EN = ["intro", "time", "family", "food", "directions",
    "tour-accueil", "tour-resto", "tour-taxi",
    "work", "market", "travel", "health", "housing", "hotel",
    "tour-goree", "tour-monuments", "tour-excursion", "tour-plage", "tour-artisanat",
    "interview", "pitch", "orders", "visa", "agri",
    "tour-circuit", "tour-agence", "tour-culture", "tour-urgence"];
  var ORDRE_WO = ["salutations", "famille", "temps", "marche", "nourriture", "voyage", "maison", "corps", "logement"];
  window.DIISOO_ORDRE_TOURISME = ["tour_hotel", "tour_resto", "tour_transport", "tour_guide", "tour_plage", "tour_artisanat", "tour_agence"];

  function rang(liste, id) { var i = liste.indexOf(id); return i < 0 ? 999 : i; }
  function trier() {
    try {
      GENERAL_THEMES.forEach(function (t) {
        var n = NIVEAU[t.id];
        if (n && t.niveau !== n) { t.niveau = n; t.title = String(t.title).replace(/^N\d/, "N" + n); }
      });
      GENERAL_THEMES.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3) || rang(ORDRE_EN, a.id) - rang(ORDRE_EN, b.id); });
      var d = GENERAL_THEMES.find(function (t) { return t.id === "intro"; });
      if (d && typeof generalThemeId !== "undefined" && /^tour-/.test(generalThemeId)) generalThemeId = d.id;
    } catch (e) {}
    try {
      if (Array.isArray(WOLOF_THEMES)) WOLOF_THEMES.sort(function (a, b) { return rang(ORDRE_WO, a.id) - rang(ORDRE_WO, b.id); });
    } catch (e) {}
  }
  trier();
  setTimeout(trier, 1500);
})();
