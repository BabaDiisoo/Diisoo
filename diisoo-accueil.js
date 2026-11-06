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
      /* demande de numero : cachee tant que l'apprenant n'a pas pratique quelques jours */
      "body:not([data-wa-ok]) #wa-capture{display:none!important}" +
      /* libelles plus clairs sans toucher aux scripts qui ecrivent ces boutons */
      "button[aria-label^=\"Sauvegarder mon\"]::after{content:\" Sauvegarder\";font-size:11px;font-weight:700;margin-left:4px}" +
      /* la barre « Revenir » ajoute 56 px en haut : on les retire de la hauteur minimale, sinon CHAQUE page dépasse l'écran de 56 px */
      "body.dnav-on [role=main]{min-height:calc(100vh - 56px)!important;min-height:calc(100dvh - 56px)!important}" +
      "body.dnav-on [role=main]{padding-top:3px!important;padding-bottom:3px!important}" +
      "#screen-test-simulation>div.flex-1{padding-top:4px!important;padding-bottom:4px!important}#test-picker .pt-2{padding-top:4px!important}" +
      "body.dnav-on .fx-lab{display:none!important}.fx-nav{padding:0!important}.fx-nav .fx-dot{margin:2px 1px!important;width:6px!important;height:6px!important}.fx-nav .fx-dot.fx-on{width:12px!important}body:has(#thbar-wolof) #wolof-tabs,body:has(#thbar-general) #general-tabs{display:none!important}" +
      "body:has(#thbar-general) #screen-general>div.text-center,body:has(#thbar-general) #lvlback-general{display:none!important}" +
      "body:has(#thbar-general) #screen-general:not(.hidden){display:flex!important;flex-direction:row;flex-wrap:wrap;gap:6px;align-content:flex-start;margin:0!important}" +
      "body:has(#thbar-general) #screen-general>*{flex:0 0 100%;margin:0!important;max-height:none!important}" +
      "body:has(#thbar-general) #dsn-btn-general,body:has(#thbar-general) #dcv-btn-general{flex:1 1 calc(50% - 4px)!important;min-width:0;padding:5px 8px!important;font-size:13px!important;line-height:1.15!important;min-height:44px;width:auto!important}" +
      "body:has(#thbar-general) #general-content [data-practice]{min-height:0!important;height:auto!important;padding:6px 8px!important;display:flex!important;flex-direction:row!important;align-items:center;justify-content:center;gap:8px}" +
      "body:has(#thbar-general) #general-content [data-practice] .dii-i{font-size:18px!important;line-height:1!important;margin:0!important;width:auto!important;height:auto!important}" +
      "body:has(#thbar-general) #general-content [data-practice] .dii-c{font-size:13.5px!important;margin:0!important}" +
      "body:has(#thbar-general) #general-content .as-btn{min-height:0!important;padding:8px!important}" +
      "body:has(#thbar-wolof) #screen-wolof>div.text-center,body:has(#thbar-wolof) #lvlback-wolof{display:none!important}" +
      "body:has(#thbar-wolof) #screen-wolof:not(.hidden){display:flex!important;flex-direction:row;flex-wrap:wrap;gap:6px;align-content:flex-start;margin:0!important}" +
      "body:has(#thbar-wolof) #screen-wolof>*{flex:0 0 100%;margin:0!important;max-height:none!important}" +
      "body:has(#thbar-wolof) #dsn-btn-wolof,body:has(#thbar-wolof) #dcv-btn-wolof{flex:1 1 calc(50% - 4px)!important;min-width:0;padding:5px 8px!important;font-size:13px!important;line-height:1.15!important;min-height:44px;width:auto!important}" +
      "body:has(#thbar-wolof) #lexicon-container [data-practice]{min-height:0!important;height:auto!important;padding:6px 8px!important;display:flex!important;flex-direction:row!important;align-items:center;justify-content:center;gap:8px}" +
      "body:has(#thbar-wolof) #lexicon-container [data-practice] .dii-i{font-size:18px!important;line-height:1!important;margin:0!important;width:auto!important;height:auto!important}" +
      "body:has(#thbar-wolof) #lexicon-container [data-practice] .dii-c{font-size:13.5px!important;margin:0!important}" +
      "body:has(#thbar-wolof) #lexicon-container .as-btn{min-height:0!important;padding:8px!important}" +
      "body.dnav-on .fx-secs{display:flex!important;flex-wrap:nowrap!important;gap:4px!important;margin:0 0 2px!important}body.dnav-on .fx-sec{flex:1 1 0!important;min-width:0;padding:6px 2px!important;font-size:12.5px!important;min-height:0!important;line-height:1.1!important}" +
      "body.dnav-on .aide-barre{min-height:0!important;padding:2px 8px!important;font-size:12.5px!important}" +
      /* lisibilité : aucun texte en dessous de 12 px, les petits textes secondaires à 12,5 px */
      "[class*=\"text-[10px]\"],[class*=\"text-[11px]\"],.bz-n{font-size:12.5px!important}" +
      "#screen-dashboard>div:last-child p{font-size:12px!important}" +
      "[style*=\"font-size:11px\"],[style*=\"font-size:10px\"],[style*=\"font-size:9px\"],[style*=\"font-size: 11px\"],[style*=\"font-size: 10px\"]{font-size:12px!important}" +
      ".as-t small,.as-h,.fm-src,.fm-sug small,.fm-mtl,#dii-fmt details,.et-leg,#dii-aide-bulle small,.co-tt,.fx-reel small,.fm-tt,#biz-grid .bz-n,.aide-chip{font-size:12px!important}" +
      /* ACCUEIL v2 : les 4 grands menus d'abord, tout tient sur l'écran, rien à lire, rien à remplir */
      "body:has(#screen-dashboard:not(.hidden)) [role=main]{height:100dvh;min-height:0!important;padding:10px 14px 10px!important;justify-content:flex-start!important}" +
      "#screen-dashboard:not(.hidden){height:100%;display:flex;flex-direction:column;gap:8px;margin:0!important;padding:0!important}" +
      "#screen-dashboard>*{margin:0!important;flex:none}" +
      "#screen-dashboard>div:first-child{padding:0 54px 0 0!important}" +
      "#screen-dashboard #daily-goal,#screen-dashboard #wa-capture,#screen-dashboard #badges-row,#dmic-chip,#dg-welcome,#screen-dashboard #ref-compteur{display:none!important}#screen-dashboard>div:last-child>p{display:block!important;font-size:11.5px!important;line-height:1.3!important;margin:0!important;text-align:center}" +
      "#screen-dashboard:not(.hidden)>div.space-y-3{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;gap:8px}" +
      "#screen-dashboard h1 span span{display:none!important}#welcome-tag{white-space:nowrap}#streak-counter,#xp-label{min-height:0!important;padding:5px 12px!important}#screen-dashboard>div.flex.items-center.justify-between{align-items:center}" +
      "#screen-dashboard>div.space-y-3>*{margin:0!important}" +
      "#screen-dashboard>div.space-y-3>.grid{order:1;flex:1 1 auto;min-height:0;grid-template-rows:1fr 1fr;gap:10px!important}" +
      "#screen-dashboard>div.space-y-3>#revision-card{order:2;padding:.55rem .8rem!important}" +
      "#screen-dashboard>div.space-y-3>#revision-card #revision-sub{display:none}" +
      "#screen-dashboard>div.space-y-3>#revision-card .mb-2{margin:0!important}" +
      "#screen-dashboard>div.space-y-3>button[onclick*=openPremium]{order:3;padding:.5rem .9rem!important}" +
      "#screen-dashboard>div.space-y-3>button[onclick*=partagerDiisoo]{display:none}" +
      "#screen-dashboard .grid.grid-cols-2>button{min-height:0!important;display:flex!important;flex-direction:column;justify-content:flex-start;align-items:flex-start;padding:1.1rem .9rem!important}" +
      "#screen-dashboard .grid.grid-cols-2>button>span{font-size:2.6rem!important;margin-bottom:.35rem!important;line-height:1}" +
      "#screen-dashboard .grid.grid-cols-2>button>h3{font-size:1.1rem!important}" +
      "#screen-dashboard .grid.grid-cols-2>button>p{font-size:.82rem!important}" +
      "#screen-dashboard .grid.grid-cols-2>button[onclick*=openGeneralModule]{order:1}#screen-dashboard .grid.grid-cols-2>button[onclick*=openWolofModule]{order:2}#screen-dashboard .grid.grid-cols-2>button[onclick*=openBusinessModule]{order:3}#screen-dashboard .grid.grid-cols-2>button:not([onclick*=openGeneralModule]):not([onclick*=openWolofModule]):not([onclick*=openBusinessModule]){order:4}" +
      "#dg-open{padding:8px 12px!important}" +
      "#screen-dashboard>div:last-child{padding:0}" +
      /* niveaux d'Anglais : le titre porte le niveau */
      "";
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
  /* difficulté croissante : un thème trop simple pour son niveau est remonté d'un cran, un thème trop dur est descendu */
  function reniveler() {
    try {
      var M = { "Demander son chemin": 1, "Réserver un hôtel": 2 };
      GENERAL_THEMES.forEach(function (t) {
        Object.keys(M).forEach(function (nom) {
          if (String(t.title).indexOf(nom) >= 0 && t.niveau !== M[nom]) { t.niveau = M[nom]; t.title = t.title.replace(/^N\d/, "N" + M[nom]); }
        });
      });
    } catch (e) {}
  }
  function demarrer() {
    reniveler();
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
