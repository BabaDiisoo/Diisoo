/* diisoo-universel.js v1 : compatibilite petits ecrans (<=700px de haut), polices minimales */
(function () {
  "use strict";
  var st = document.createElement("style");
  st.textContent =
    ".lvl-sub{font-size:12px!important}" +
    "@media (max-height:700px){" +
    "#xh-hub{gap:5px!important}#xh-hub .xh-s,#xh-hub h2{display:none!important}" +
    "#xh-hub button{min-height:46px!important;padding:5px 9px!important}#xh-hub .xh-big{min-height:52px!important}" +
    "#xh-hub .xh-i{font-size:20px!important}#xh-hub .xh-d{font-size:11.5px!important;margin-top:0!important}" +
    ".fx-em{padding:10px!important}.fx-em>.flex.justify-between.items-start>p:first-child{font-size:20px!important}" +
    ".fx-em .dl-plus{min-height:36px!important}.fx-em>div[data-em],.fx-em:before{font-size:30px!important}" +
    ".lvl-btn{min-height:54px!important;padding:6px 12px!important}.lvl-picker{gap:6px!important}" +
    "body.dnav-on [role=main]{padding-top:0!important;padding-bottom:0!important}" +
    "}" +
    "@media (max-height:600px){body.dnav-on{padding-top:48px!important}.fx-em{padding:8px!important}.lvl-btn{min-height:48px!important}}";
  document.head.appendChild(st);
})();
