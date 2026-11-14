/* diisoo-abc.js v1 : propositions ABC-GLOBAL au bon moment (fin de mission reussie), message WhatsApp prerempli, clic compte */
(function () {
  "use strict";
  if (window.DiisooABC) return;
  var CAS = [
    { fin: "mv-x2", ok: /Visa accordé/, cle: "visa", t: "Tu es prêt. Besoin d'aide pour ton dossier de visa ?", b: "Parler à ABC-GLOBAL",
      m: "Bonjour ABC-GLOBAL, j'ai réussi la mission visa sur Diisoo. Je voudrais de l'aide pour mon dossier de visa." },
    { fin: "mvy-x2", ok: /Bon voyage/, cle: "voyage", t: "Tu voyages bientôt ? On réserve ton billet.", b: "Demander un billet",
      m: "Bonjour ABC-GLOBAL, j'ai fini la mission voyage sur Diisoo. Je voudrais un billet d'avion." },
    { fin: "mp-x2", ok: /Belle rencontre/, cle: "presentation", t: "Tu veux parler anglais en confiance ? Cours accompagné ABC-GLOBAL.", b: "En savoir plus",
      m: "Bonjour ABC-GLOBAL, j'ai réussi la mission présentation sur Diisoo. Je voudrais en savoir plus sur le cours d'anglais accompagné." },
    { fin: "me-x2", ok: /Embauché/, cle: "emploi", t: "Prêt pour l'entretien en anglais ? Cours accompagné ABC-GLOBAL.", b: "En savoir plus",
      m: "Bonjour ABC-GLOBAL, j'ai réussi la mission entretien d'embauche sur Diisoo. Je voudrais en savoir plus sur le cours d'anglais accompagné." },
    { fin: "mm-x2", ok: /Vente conclue/, cle: "marche", t: "Tu veux parler anglais avec tes clients ? Cours accompagné ABC-GLOBAL.", b: "En savoir plus",
      m: "Bonjour ABC-GLOBAL, j'ai réussi la mission marché sur Diisoo. Je voudrais en savoir plus sur le cours d'anglais accompagné pour commerçants." }
  ];
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  var st = document.createElement("style");
  st.textContent = ".dii-abc-c{width:100%;max-width:320px;border:1px solid #2A3454;background:#141A2B;border-radius:16px;padding:10px 12px;font-size:14px;font-weight:700;line-height:1.3;color:#F6F1E7;text-align:center}" +
    ".dii-abc-c button{margin-top:8px;border:0;border-radius:14px;min-height:44px;padding:8px 16px;font-size:14.5px;font-weight:800;background:#25D366;color:#08210F;width:100%}" +
    ".dii-abc-c small{display:block;margin-top:4px;font-size:11px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);
  function poser() {
    for (var i = 0; i < CAS.length; i++) {
      var c = CAS[i], x = document.getElementById(c.fin);
      if (!x || x.getAttribute("data-abc")) continue;
      x.setAttribute("data-abc", "1");
      var o = x.parentNode; if (!o || !c.ok.test(o.innerText || "")) continue;
      var d = document.createElement("div"); d.className = "dii-abc-c";
      d.innerHTML = c.t + '<button type="button">' + c.b + '</button><small>Un produit ABC-GLOBAL</small>';
      (function (cc) {
        d.querySelector("button").onclick = function () {
          noter("abc_" + cc.cle);
          window.open("https://wa.me/221772882109?text=" + encodeURIComponent(cc.m), "_blank");
        };
      })(c);
      o.insertBefore(d, x);
      noter("abc_vue_" + c.cle);
    }
  }
  try { new MutationObserver(function () { try { poser(); } catch (e) {} }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  window.DiisooABC = { poser: poser };
})();
