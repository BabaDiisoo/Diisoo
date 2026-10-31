/* diisoo-menus.js : etape 2
   Anglais, Wolof, Business : toutes les options visibles des l'entree,
   rangees en grille comme le menu principal, sans defilement lateral, boutons reduits. */
(function () {
  "use strict";
  var st = document.createElement("style");
  st.textContent =
    /* Anglais et Wolof : onglets en grille 2 colonnes, plus de defilement lateral */
    "#general-tabs,#wolof-tabs{display:grid!important;grid-template-columns:1fr 1fr;gap:8px;" +
    "overflow:visible!important;padding-bottom:0!important}" +
    "#general-tabs>button,#wolof-tabs>button{min-height:44px;padding:6px 8px!important;font-size:12px!important;" +
    "line-height:1.2;text-align:left;white-space:normal!important;border-radius:14px!important;width:100%}" +
    /* Business : secteurs en grille 2 colonnes, sans zone qui defile */
    "#business-picker{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;" +
    "max-height:none!important;overflow:visible!important}" +
    "#business-picker>button{min-height:56px;padding:8px 10px!important;border-radius:14px!important}" +
    "#business-picker>button *{font-size:12px!important;line-height:1.25}" +
    /* Boutons Accueil reduits et uniformes */
    "#screen-general>button:last-child,#screen-wolof>button:last-child,#screen-business button[onclick*='screen-dashboard']," +
    "#screen-test-simulation button[onclick*='quitTest']{min-height:40px;padding:8px 10px!important;font-size:12px!important}" +
    /* Les textes d'introduction longs sont reduits */
    "#screen-general>div:first-child p,#screen-wolof>div:first-child p,#screen-business>div:first-child p{font-size:11px!important}";
  document.head.appendChild(st);
})();
