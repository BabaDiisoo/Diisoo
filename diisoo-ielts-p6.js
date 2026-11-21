/* diisoo-ielts-p6.js v1 : module IELTS, phase 5 (statistiques administrateur, lecture seule)
 * Ouverture : https://diisoo.sn/?ielts=stats (aucun bouton public). Les chiffres viennent de ielts_stats(),
 * qui ne répond qu'à un administrateur connecté (is_admin()). Sans droit : message "Accès réservé".
 * Prérequis : p1 + sql-ielts-phase5.sql.
 */
(function () {
  "use strict";
  function demarrer() {
    var I = window.DiisooIelts;
    if (!I || !I.ui || !I.ouvrir) return false;
    if (I.stats) return true;
    var U = I.ui, el = U.el, esc = U.esc, bouton = U.bouton;
    function stats() {
      U.vider(); U.entete("Statistiques IELTS", U.accueil);
      var w = U.racine(), c = U.sb();
      if (!c) { w.appendChild(el("p", "", "Connexion indisponible.")); return; }
      w.appendChild(el("p", "", "Chargement…"));
      c.rpc("ielts_stats").then(function (r) {
        U.vider(); U.entete("Statistiques IELTS", U.accueil); w = U.racine();
        if (r.error || !r.data) { w.appendChild(el("div", "ie-warn", "Accès réservé à l'administrateur. Connecte-toi avec le compte administrateur Diisoo.")); return; }
        var d = r.data;
        [["Tentatives (total)", d.tentatives_total], ["Tentatives (7 jours)", d.tentatives_7j], ["Appareils (7 jours)", d.appareils_7j], ["Exercices publiés", d.exercices_publies], ["Questions publiées", d.questions_publiees]].forEach(function (x) {
          w.appendChild(el("div", "ie-row", "<span>" + x[0] + "</span><b>" + esc(String(x[1])) + "</b>"));
        });
        w.appendChild(el("h2", "", "Par exercice"));
        (d.par_exercice || []).forEach(function (x) {
          w.appendChild(el("div", "ie-row", "<span>" + esc(x.code) + " · " + esc(x.mode) + "</span><span>" + x.n + " essai(s) · " + (x.taux_moyen == null ? "?" : x.taux_moyen) + " %</span>"));
        });
        if (!(d.par_exercice || []).length) w.appendChild(el("div", "ie-note", "Aucune tentative enregistrée pour l'instant."));
        w.appendChild(bouton("", "Actualiser", stats));
      }).catch(function () { w.appendChild(el("p", "", "Connexion impossible.")); });
    }
    I.stats = stats;
    try { if (new URLSearchParams(location.search).get("ielts") === "stats") setTimeout(function () { I.ouvrir(); stats(); }, 900); } catch (e) {}
    return true;
  }
  if (!demarrer()) { var n = 0, t = setInterval(function () { if (demarrer() || ++n > 40) clearInterval(t); }, 250); }
})();
