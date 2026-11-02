/* diisoo-premium.js v1 : écran Premium simplifié
   3 niveaux clairs : Gratuit pour toujours / Diisoo Plus (pass 30 jours, 90 jours, 1 an) / Services ABC-GLOBAL.
   Les prix sont dans PRIX ci-dessous : une seule ligne à changer.
   Les pass se commandent par WhatsApp (activation sur le numéro) ; le paiement en ligne reste réservé aux offres
   que le serveur connaît déjà (Pack Commerçants). Les achats déjà faits restent valables. */
(function () {
  "use strict";

  var PRIX = {
    plus30: "2 500 FCFA",
    plus90: "6 000 FCFA",
    plus365: "20 000 FCFA"
  };
  var ETRANGER = "Depuis l'étranger : même offre en euros (environ 5 € / 12 € / 35 €), écris-nous sur WhatsApp.";

  var NEUF = [
    { id: "plus30", icone: "⭐", titre: "Diisoo Plus · 30 jours", prix: PRIX.plus30, dispo: true,
      texte: "Tout est débloqué : simulateur IELTS complet, tests de format réel des autres examens, niveaux Intermédiaire et Avancé du Business. Pas de renouvellement automatique." },
    { id: "plus90", icone: "⭐", titre: "Diisoo Plus · 90 jours", prix: PRIX.plus90, dispo: true,
      texte: "Le même accès pendant 3 mois, pour préparer un examen sans souci. Meilleur prix par mois." },
    { id: "plus365", icone: "🏆", titre: "Diisoo Plus · 1 an", prix: PRIX.plus365, dispo: true,
      texte: "Un an d'accès complet. Le plus avantageux : moins de 1 700 FCFA par mois." }
  ];

  function ajuster() {
    try {
      var o = PREMIUM_CONFIG.offres;
      if (o.some(function (x) { return x.id === "plus30"; })) return;
      var garde = {};
      o.forEach(function (x) { garde[x.id] = x; });
      var suite = [];
      ["commercants", "visa", "coaching", "pro"].forEach(function (id) { if (garde[id]) suite.push(garde[id]); });
      if (garde.commercants) garde.commercants.titre = "Pack Commerçants (achat unique)";
      o.length = 0;
      NEUF.concat(suite).forEach(function (x) { o.push(x); });
    } catch (e) {}
  }

  function titre(txt, sous) {
    var d = document.createElement("div");
    d.className = "dp-t";
    d.style.cssText = "margin:14px 2px 2px;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#F3A94E";
    d.textContent = txt;
    if (sous) { var s = document.createElement("div"); s.style.cssText = "font-size:11px;font-weight:400;color:#A69C86;text-transform:none;letter-spacing:0;margin-top:2px"; s.textContent = sous; d.appendChild(s); }
    return d;
  }

  var enCours = false;
  function habiller() {
    var box = document.getElementById("premium-offers");
    if (!box || enCours) return;
    if (box.querySelector(".dp-t")) return;
    var cartes = box.children;
    if (cartes.length < 4) return;
    enCours = true;
    try {
      var l = [];
      for (var i = 0; i < cartes.length; i++) l.push(cartes[i]);
      /* ordre : plus30, plus90, plus365, commercants, visa, coaching, pro */
      var gratuit = document.createElement("div");
      gratuit.className = "bg-[#0B0F1C]/60 border border-[#1E2740] rounded-2xl p-3";
      gratuit.style.cssText = "border-color:#25D366";
      gratuit.innerHTML = '<div style="font-size:14px;font-weight:800;color:#F6F1E7">🆓 Gratuit pour toujours</div>' +
        '<div style="font-size:11px;color:#A69C86;line-height:1.5;margin-top:4px">Leçons d\'anglais et de wolof, tourisme, coach vocal, 3 tests d\'examen, entraînement oral, objectifs et rappels, parrainage.</div>';
      box.insertBefore(gratuit, l[0]);
      box.insertBefore(titre("Diisoo Plus : tout débloqué", "Choisis une durée. Tu paies une fois, tu n'es jamais prélevé automatiquement."), l[0]);
      var etr = document.createElement("div");
      etr.style.cssText = "font-size:11px;color:#8C8064;line-height:1.4;margin:2px 2px 0";
      etr.textContent = ETRANGER;
      box.insertBefore(etr, l[3]);
      box.insertBefore(titre("Achat unique"), l[3]);
      box.insertBefore(titre("Services ABC-GLOBAL", "Un accompagnement humain, avec l'agence."), l[4]);
    } catch (e) {}
    enCours = false;
  }

  /* l'écran redessine ses offres deux fois : on réhabille à chaque fois */
  var orig = window.renderPremium;
  if (typeof orig === "function") {
    window.renderPremium = function () {
      ajuster();
      var r = orig.apply(this, arguments);
      setTimeout(habiller, 50);
      return r;
    };
  }
  try {
    new MutationObserver(function () { setTimeout(habiller, 30); })
      .observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
  ajuster();

  window.DiisooPremium = { version: 1, prix: PRIX };
})();
