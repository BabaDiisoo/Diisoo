/* diisoo-ui.js
 * Uniformise le design de toute l'application : polices, couleurs, boutons, champs, focus.
 * Fichier autonome, ne modifie aucun autre fichier.
 * Ajouter "diisoo-ui.js" EN DERNIER dans le tableau FICHIERS de diisoo-secteurs-loader.js.
 * Déploiement progressif : inactif par défaut. Actif seulement si l'adresse contient ?ui=1
 * (mémorisé ensuite sur l'appareil). ?ui=0 le désactive. Pour l'activer pour tout le monde : ACTIF_PAR_DEFAUT = true.
 */
(function () {
  "use strict";
  var ACTIF_PAR_DEFAUT = false;
  var CLE = "diisooUI";

  var actif = ACTIF_PAR_DEFAUT;
  try {
    var q = new URLSearchParams(location.search).get("ui");
    if (q === "1") localStorage.setItem(CLE, "1");
    if (q === "0") localStorage.removeItem(CLE);
    if (localStorage.getItem(CLE) === "1") actif = true;
    if (q === "0") actif = false;
  } catch (e) {}
  if (!actif) return;
  if (window.__diisooUI) return;
  window.__diisooUI = true;

  var CSS = [
    /* Polices : tout hérite de la police de l'application */
    "button,input,select,textarea{font-family:inherit}",
    /* Champs : 16 px minimum (évite le zoom automatique sur iPhone), hauteur confortable */
    "input:not([type=checkbox]):not([type=radio]):not([type=range]),select,textarea{font-size:16px;min-height:48px;border-radius:12px}",
    /* Texte lisible */
    "body{font-size:16px;line-height:1.5;-webkit-text-size-adjust:100%}",
    /* Focus visible partout (clavier et lecteurs d'écran) */
    ":focus-visible{outline:3px solid var(--gold,#F3A94E);outline-offset:2px}",
    /* Boutons : zone tactile minimale et coins uniformes (classes ajoutées par le script ci-dessous) */
    ".diisoo-ui-btn{min-height:48px;border-radius:14px;touch-action:manipulation;-webkit-tap-highlight-color:transparent}",
    ".diisoo-ui-btn:active{transform:scale(.98)}",
    /* Liens utiles : zone tactile */
    "a.diisoo-ui-link{display:inline-block;min-height:44px;line-height:44px}",
    /* Images et médias ne débordent jamais */
    "img,video,canvas,svg{max-width:100%}",
    "audio{width:100%}",
    /* Défilement doux, sauf pour qui préfère moins de mouvement */
    "@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}"
  ].join("\n");

  var st = document.createElement("style");
  st.id = "diisoo-ui-style";
  st.textContent = CSS;
  document.head.appendChild(st);

  /* Boutons avec du texte : on leur donne une zone tactile de 48 px.
     Les boutons à icône seule (sans texte) ne sont pas touchés pour ne pas déformer les menus. */
  var planifie = false;
  function appliquer() {
    planifie = false;
    var bs = document.querySelectorAll("button:not(.diisoo-ui-btn),[role=button]:not(.diisoo-ui-btn)");
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i];
      var t = (b.textContent || "").replace(/\s+/g, " ").trim();
      var lettres = t.replace(/[^A-Za-zÀ-ÿ0-9]/g, "");
      if (lettres.length >= 3 && b.offsetHeight > 0 && b.offsetHeight < 44) b.classList.add("diisoo-ui-btn");
    }
    var ls = document.querySelectorAll("a[href]:not(.diisoo-ui-link)");
    for (var j = 0; j < ls.length; j++) {
      var a = ls[j];
      if (a.closest("p,li,span") || a.children.length) continue;
      if (a.offsetHeight > 0 && a.offsetHeight < 32 && (a.textContent || "").trim().length >= 3) a.classList.add("diisoo-ui-link");
    }
  }
  function planifier() {
    if (planifie) return;
    planifie = true;
    (window.requestIdleCallback || function (f) { return setTimeout(f, 200); })(appliquer);
  }
  new MutationObserver(planifier).observe(document.body, { childList: true, subtree: true });
  planifier();
  window.DiisooUI = { actif: true, reappliquer: appliquer };
})();
