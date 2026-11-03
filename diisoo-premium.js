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
    var box = document.getElementById("premium-offers");
    if (!box || enCours) return;
    if (box.querySelector(".dp-t")) return;
    if (box.children.length < 4) return;
    enCours = true;
    try {
      box.innerHTML = "";
      /* 1. gratuit */
      var g = el('<div style="font-size:14px;font-weight:800;color:#F6F1E7">🆓 Gratuit pour toujours</div>' +
        '<div style="font-size:11px;color:#A69C86;line-height:1.5;margin-top:4px">Leçons d\'anglais et de wolof, tourisme, coach vocal, 3 tests d\'examen, entraînement oral, objectifs, parrainage.</div>', "border-color:#25D366;margin-top:0");
      box.appendChild(g);

      /* 2. Diisoo Plus : un seul choix, un seul bouton */
      var plus = el('<div style="font-size:15px;font-weight:800;color:#F6F1E7">⭐ Diisoo Plus</div>' +
        '<div style="font-size:11px;color:#A69C86;line-height:1.5;margin:4px 0 8px">Tout est débloqué : simulateur IELTS complet, tests de format réel (TOEFL, TOEIC, Cambridge, Duolingo, PTE), niveaux Intermédiaire et Avancé. Pas de renouvellement automatique.</div>' +
        '<div class="dp-seg" style="display:flex;gap:6px"></div>' +
        '<button type="button" class="dp-pay" style="margin-top:10px;' + BTN + '"></button>' +
        '<div style="' + SOUS + '">Wave, Orange Money ou carte bancaire. Activation immédiate sur ton numéro.</div>');
      var seg = plus.querySelector(".dp-seg"), pay = plus.querySelector(".dp-pay");
      function maj() {
        var d = DUREES.filter(function (x) { return x.id === choix; })[0];
        Array.prototype.forEach.call(seg.children, function (b) {
          var on = b.getAttribute("data-id") === choix;
          b.style.borderColor = on ? "#F3A94E" : "#1E2740";
          b.style.background = on ? "#2A2113" : "#0B0F1C";
        });
        pay.textContent = "💳 Payer " + d.prix;
      }
      DUREES.forEach(function (d) {
        var b = document.createElement("button");
        b.type = "button"; b.setAttribute("data-id", d.id);
        b.style.cssText = "flex:1;min-height:58px;border:1.5px solid #1E2740;border-radius:12px;color:#F6F1E7;padding:6px 2px;font-size:12px;line-height:1.3";
        b.innerHTML = "<b>" + d.court + "</b><br><span style=\"font-size:11px;color:#F0906B\">" + d.prix.replace(" FCFA", " F") + "</span>" +
          (d.note ? "<br><span style=\"font-size:10px;color:#5FC98F\">" + d.note + "</span>" : "");
        b.onclick = function () { choix = d.id; maj(); };
        seg.appendChild(b);
      });
      pay.onclick = function () { payer(choix); };
      maj();
      box.appendChild(plus);

      /* 3. Pack Commerçants */
      var c = offre("commercants");
      var pc = el('<div style="display:flex;justify-content:space-between;gap:8px"><div style="font-size:14px;font-weight:800;color:#F6F1E7">🧰 Pack Commerçants</div><div style="font-size:12px;font-weight:700;color:#F0906B;white-space:nowrap">' + (c && c.prix || "5 000 FCFA") + '</div></div>' +
        '<div style="font-size:11px;color:#A69C86;line-height:1.5;margin:4px 0 8px">Anglais de tous les secteurs : pièces détachées, mode, électronique, import Chine. Achat unique, accès à vie.</div>' +
        '<button type="button" class="dp-pc" style="' + BTN + '">💳 Payer ' + (c && c.prix || "5 000 FCFA") + '</button>');
      pc.querySelector(".dp-pc").onclick = function () { payer("commercants"); };
      box.appendChild(pc);

      /* 4. Services ABC-GLOBAL : accompagnement humain, une ligne chacun */
      var rows = ["visa", "coaching", "pro"].map(function (id) {
        var o = offre(id); if (!o) return "";
        var lien = ""; try { lien = premiumLien(o); } catch (e) { lien = "https://wa.me/" + WA; }
        return '<a href="' + lien + '" target="_blank" rel="noopener" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 0;border-top:1px solid #1E2740;text-decoration:none">' +
          '<span style="font-size:13px;color:#F6F1E7;font-weight:700">' + o.icone + " " + o.titre + '</span>' +
          '<span style="font-size:11px;color:#F0906B;white-space:nowrap">' + o.prix + ' ›</span></a>';
      }).join("");
      box.appendChild(el('<div style="font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#F3A94E">Avec l\'agence ABC-GLOBAL</div>' +
        '<div style="font-size:11px;color:#A69C86;margin:2px 0 4px">Un accompagnement humain. Touche une ligne pour en parler sur WhatsApp.</div>' + rows));

      /* 5. étranger et aide */
      var f = document.createElement("div");
      f.className = "dp-t";
      f.style.cssText = "font-size:11px;color:#8C8064;line-height:1.5;margin:10px 2px 0;text-align:center";
      f.innerHTML = ETRANGER + '<br><a href="https://wa.me/' + WA + '" target="_blank" rel="noopener" style="color:#F3A94E">Un souci avec un paiement ? Écris-nous</a>';
      box.appendChild(f);
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

  window.DiisooPremium = { version: 3, prix: PRIX };
})();
