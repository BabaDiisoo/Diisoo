/* diisoo-accueil.js
 * Accueil (tableau de bord) :
 * 1) la carte "Ajoute ton WhatsApp" passe sous les 4 menus (l'action principale reste en haut) ;
 * 2) le champ du numero ne depasse plus de sa carte ;
 * 3) libelles plus clairs : "Dashboard" devient "Accueil", la disquette affiche "Sauvegarder" tant que le progres n'est pas sauvegarde.
 * 4) tout tient sur le premier ecran ; 5) la demande de WhatsApp n'apparait qu'apres 3 jours de pratique.
 * Ne modifie aucun fichier existant : deplace seulement un element deja present et ajoute une regle CSS.
 */
(function () {
  "use strict";
  function css() {
    if (document.getElementById("diisoo-accueil-css")) return;
    var s = document.createElement("style");
    s.id = "diisoo-accueil-css";
    s.textContent =
      "#wa-capture,#wa-capture *{box-sizing:border-box}" +
      "#wa-capture{max-width:100%;overflow:hidden}" +
      "#wa-capture input[type=tel]{min-width:0;width:100%}" +
      "#wa-capture>.flex{max-width:100%}" +
      "#wa-capture>.flex>input{flex:1 1 0%}" +
      /* tout visible des l'entree : espacements et hauteurs reduits (ecran d'accueil seulement) */
      "#screen-dashboard{justify-content:flex-start!important;padding-top:.25rem}" +
      "#screen-dashboard>*+*{margin-top:.5rem!important}" +
      "#screen-dashboard .space-y-3>*+*{margin-top:.5rem!important}" +
      "#screen-dashboard .space-y-3{margin-top:.5rem!important;margin-bottom:0!important}" +
      "#screen-dashboard .grid.grid-cols-2{gap:.5rem!important}" +
      "#screen-dashboard .grid.grid-cols-2>button{min-height:6.4rem!important;padding:.7rem .8rem!important}" +
      "#screen-dashboard .grid.grid-cols-2>button>span{font-size:1.9rem!important;margin-bottom:.2rem!important}" +
      "#screen-dashboard .grid.grid-cols-2>button>h3{font-size:.95rem!important}" +
      "#screen-dashboard .grid.grid-cols-2>button>p{font-size:.68rem!important;margin-top:.15rem!important;line-height:1.2!important}" +
      "#revision-card{padding:.7rem .9rem!important}" +
      "#screen-dashboard>div:last-child>p:last-child{font-size:9px!important;line-height:1.3!important}" +
      /* demande de numero : cachee tant que l'apprenant n'a pas pratique quelques jours */
      "body:not([data-wa-ok]) #wa-capture{display:none!important}" +
      /* libelles plus clairs sans toucher aux scripts qui ecrivent ces boutons */
      "button[aria-label^=\"Sauvegarder mon\"]::after{content:\" Sauvegarder\";font-size:11px;font-weight:700;margin-left:4px}";
    document.head.appendChild(s);
  }
  function deplacer() {
    var wa = document.getElementById("wa-capture");
    var rev = document.getElementById("revision-card");
    if (!wa || !rev || wa.dataset.accueil) return !!wa;
    var zone = rev.parentNode;                       /* le bloc "space-y-3" qui contient revision + 4 menus */
    var grille = zone && zone.querySelector(".grid.grid-cols-2");
    if (!grille) return false;
    wa.dataset.accueil = "1";
    grille.parentNode.insertBefore(wa, grille.nextSibling);
    return true;
  }
  var JOURS_AVANT_WHATSAPP = 3;
  function joursPratique() {
    var n = 0;
    try {
      var log = JSON.parse(localStorage.getItem("diisoo_daily_xp") || "{}");
      Object.keys(log).forEach(function (k) { if (Number(log[k]) > 0) n++; });
    } catch (e) {}
    try {
      var st = JSON.parse(localStorage.getItem("diisoo_streak") || "{}");
      if (st && Number(st.count) > n) n = Number(st.count);
    } catch (e) {}
    return n;
  }
  function majWhatsApp() {
    try {
      if (joursPratique() >= JOURS_AVANT_WHATSAPP) document.body.setAttribute("data-wa-ok", "1");
      else document.body.removeAttribute("data-wa-ok");
    } catch (e) {}
  }
  function renommer() {
    var h = document.querySelector("#screen-dashboard h1 span span");
    if (h && /dashboard/i.test(h.textContent)) { h.textContent = "Accueil"; return true; }
    return !!h;
  }
  function demarrer() {
    css();
    renommer();
    majWhatsApp();
    setInterval(majWhatsApp, 5000);
    if (deplacer()) return;
    var n = 0, t = setInterval(function () { if (deplacer() || ++n > 40) clearInterval(t); }, 250);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();
