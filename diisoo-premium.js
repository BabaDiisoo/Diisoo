/* diisoo-premium.js v3 : écran Premium simplifié
   3 niveaux clairs : Gratuit pour toujours / Diisoo Plus (pass 30 jours, 90 jours, 1 an) / Services ABC-GLOBAL.
   Les prix sont dans PRIX ci-dessous : une seule ligne à changer.
   Paiement en ligne (Wave, Orange Money) via PayTech : boutons toujours visibles. Les achats déjà faits restent valables. */
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

  var WA = "221772882109";
  var choix = "plus90";
  var DUREES = [
    { id: "plus30", court: "30 jours", prix: PRIX.plus30, note: "" },
    { id: "plus90", court: "90 jours", prix: PRIX.plus90, note: "-20 %" },
    { id: "plus365", court: "1 an", prix: PRIX.plus365, note: "-33 %" }
  ];
  function el(html, css) {
    var d = document.createElement("div");
    d.className = "dp-t bg-[#0B0F1C]/60 border border-[#1E2740] rounded-2xl p-3";
    d.style.cssText = "margin-top:10px;" + (css || "");
    d.innerHTML = html;
    return d;
  }
  function offre(id) { try { return PREMIUM_CONFIG.offres.filter(function (x) { return x.id === id; })[0]; } catch (e) { return null; } }
  function payer(id) {
    try { if (typeof payerOffre === "function") return payerOffre(id); } catch (e) {}
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent("Bonjour, je veux l'offre " + id + "."), "_blank", "noopener");
  }
  var BTN = "display:block;width:100%;min-height:46px;border:0;border-radius:12px;font-size:14px;font-weight:800;color:#1a1206;background:linear-gradient(90deg,#F3A94E,#E2703E)";
  var SOUS = "font-size:11px;color:#A69C86;line-height:1.5;margin-top:6px;text-align:center";

  var enCours = false;
  function habiller() {
    var
