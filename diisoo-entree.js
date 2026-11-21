/* diisoo-entree.js : entree la plus simple possible.
 * Ecran d'accueil : un seul bouton "Commencer", prenom facultatif, plus de barre d'etapes, plus de carte "Ecoute d'abord",
 * Google en simple lien discret. Aucun faux profil : un seul appui de la personne est necessaire.
 * Interrupteur : ?entree=0 remet l'ancien ecran. Aucun fichier existant modifie. */
(function () {
  "use strict";
  if (window.__entreeOK) return; window.__entreeOK = true;
  try { if (new URLSearchParams(location.search).get("entree") === "0") return; } catch (e) {}

  var st = document.createElement("style");
  st.textContent =
    "#screen-onboarding > div:first-child{display:none!important}" +
    "#diisoo-essai{display:none!important}" +
    "#screen-onboarding > p.text-center{display:none!important}" +
    "#btn-google{background:transparent!important;border:0!important;box-shadow:none!important;color:#A69C86!important;font-size:12px!important;padding:4px!important;text-decoration:underline}" +
    "#btn-google svg{display:none!important}";
  (document.head || document.documentElement).appendChild(st);

  function txt(el, t) { if (el && el.textContent !== t) el.textContent = t; }
  function adapter() {
    try {
      var ob = document.getElementById("screen-onboarding");
      if (!ob) return;
      var h2 = ob.querySelector("h2");
      txt(h2, "Bienvenue 👋");
      var p = h2 && h2.nextElementSibling;
      if (p && p.tagName === "P") txt(p, "Apprends l'anglais et le wolof. Commence tout de suite.");
      var champ = document.getElementById("user-firstname");
      if (champ) { champ.required = false; champ.placeholder = "Ton prénom (facultatif)"; }
      txt(ob.querySelector('label[for="user-firstname"]'), "Ton prénom (facultatif)");
      var b = document.getElementById("btn-submit-onboarding");
      if (b && !b.disabled) txt(b, "Commencer");
      var g = document.getElementById("btn-google");
      if (g) {
        var n = g.lastChild;
        if (n && n.nodeType === 3 && n.textContent.trim() !== "J'ai déjà un compte (Google)") n.textContent = " J'ai déjà un compte (Google)";
      }
    } catch (e) {}
  }
  [300, 1000, 2500, 5000].forEach(function (t) { setTimeout(adapter, t); });

  /* Accueil : "Bonjour" sans nom si le prenom est vide */
  function corrigerBonjour() {
    try { var w = document.getElementById("welcome-tag"); if (w && /^Bonjour\s*$/.test(w.textContent)) w.textContent = "Bonjour 👋"; } catch (e) {}
  }
  var essais = 0, tm = setInterval(function () {
    var w = document.getElementById("welcome-tag");
    if (w && typeof MutationObserver === "function") { clearInterval(tm); new MutationObserver(corrigerBonjour).observe(w, { childList: true, characterData: true, subtree: true }); corrigerBonjour(); }
    else if (++essais > 100) clearInterval(tm);
  }, 200);

  /* Acces direct : "Commencer" ouvre le menu tout de suite, sans reseau ni module externe. */
  document.addEventListener("submit", function (ev) {
    try {
      var f = ev.target;
      if (!f || f.id !== "form-onboarding") return;
      ev.preventDefault(); ev.stopImmediatePropagation();
      var v = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ""; };
      var prenom = v("user-firstname") || "Ami";
      try { localStorage.setItem("diisoo_tuto_seen", JSON.stringify(true)); } catch (e2) {}
      if (typeof window.terminerInscription === "function") window.terminerInscription({ first_name: prenom, last_name: v("user-lastname"), email: v("user-email").toLowerCase() || null, phone: null, whatsapp_optin: false });
      else if (typeof window.continuerSansCompte === "function") window.continuerSansCompte();
    } catch (e) { console.error("entree", e); }
  }, true);
})();
