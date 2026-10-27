/* diisoo-essai.js
 * Ecran d'accueil : permet d'ecouter 3 phrases wolof AVANT de donner son prenom.
 * Fichier autonome, ajoute seulement une carte au-dessus du formulaire. Ne modifie aucun fichier existant.
 */
(function () {
  "use strict";
  var PHRASES = [
    { wo: "Salaam aleekum", fr: "Bonjour", pr: "Salaam aleekum" },
    { wo: "Nanga def ?", fr: "Comment vas-tu ?", pr: "Nanga def ?" },
    { wo: "Jërëjëf", fr: "Merci", pr: "Djeureudjeuf" }
  ];

  function jouer(texte, bouton) {
    var fin = function () { if (bouton) { bouton.disabled = false; bouton.style.opacity = "1"; } };
    try {
      if (bouton) { bouton.disabled = true; bouton.style.opacity = ".6"; }
      var r;
      if (typeof window.speak === "function") r = window.speak(texte, "wo", 0.9);
      else if (window.Diisoo && window.Diisoo.voix) r = window.Diisoo.voix.jouer(texte, "wo");
      Promise.resolve(r).then(fin, fin);
    } catch (e) { fin(); }
  }

  function construire() {
    var ecran = document.getElementById("screen-onboarding");
    var form = document.getElementById("form-onboarding");
    if (!ecran || !form || document.getElementById("diisoo-essai")) return !!document.getElementById("diisoo-essai");
    var carte = document.createElement("div");
    carte.id = "diisoo-essai";
    carte.style.cssText = "background:#141A2B;border:1px solid #1E2740;border-radius:16px;padding:14px;";
    var titre = document.createElement("p");
    titre.style.cssText = "font-size:13px;font-weight:700;color:#E4DCC9;margin:0 0 2px;";
    titre.textContent = "Écoute d'abord, sans t'inscrire";
    var sous = document.createElement("p");
    sous.style.cssText = "font-size:11px;color:#A69C86;margin:0 0 10px;";
    sous.textContent = "Touche une phrase pour l'entendre en wolof.";
    carte.appendChild(titre); carte.appendChild(sous);
    PHRASES.forEach(function (p) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Écouter : " + p.wo);
      b.style.cssText = "display:flex;align-items:center;gap:12px;width:100%;min-height:52px;padding:8px 12px;margin-top:6px;background:#0B0F1C;border:1px solid #1E2740;border-radius:12px;color:inherit;text-align:left;cursor:pointer;";
      var ic = document.createElement("span");
      ic.textContent = "🔊"; ic.style.cssText = "font-size:20px;flex:none;";
      var tx = document.createElement("span");
      tx.style.cssText = "display:block;min-width:0;";
      var l1 = document.createElement("span");
      l1.style.cssText = "display:block;font-size:15px;font-weight:700;color:#5FC98F;";
      l1.textContent = p.wo;
      var l2 = document.createElement("span");
      l2.style.cssText = "display:block;font-size:11px;color:#A69C86;";
      l2.textContent = p.fr; /* la prononciation est ajoutee par diisoo-pron.js */
      tx.appendChild(l1); tx.appendChild(l2);
      b.appendChild(ic); b.appendChild(tx);
      b.addEventListener("click", function () { jouer(p.wo, b); });
      carte.appendChild(b);
    });
    var suite = document.createElement("p");
    suite.style.cssText = "font-size:11px;color:#8C8064;margin:10px 0 0;text-align:center;";
    suite.textContent = "Ça te plaît ? Donne ton prénom ci-dessous pour continuer.";
    carte.appendChild(suite);
    form.parentNode.insertBefore(carte, form);
    return true;
  }

  function demarrer() {
    if (construire()) return;
    var n = 0, t = setInterval(function () { if (construire() || ++n > 40) clearInterval(t); }, 250);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();
