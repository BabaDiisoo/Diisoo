/* diisoo-accueil2.js v1 : accueil plus compact (cartes moins hautes, sous-titres courts) et ecran Business sans grand vide en haut. Desactivable : ?accueil2=0 */
(function () {
  "use strict";
  if (window.DiisooAccueil2 || /[?&]accueil2=0/.test(location.search)) return;
  var st = document.createElement("style");
  st.textContent =
    "#screen-dashboard .grid.grid-cols-2>button{min-height:0!important;padding:12px 14px!important;display:flex;flex-direction:column;justify-content:flex-start;gap:2px}" +
    "#screen-dashboard .grid.grid-cols-2>button>*:first-child{font-size:30px!important;line-height:1.1!important;margin-bottom:2px!important}" +
    "#screen-dashboard .grid.grid-cols-2>button>*:empty{display:none!important}" +
    "#screen-dashboard .grid.grid-cols-2{height:auto!important;flex:none!important;grid-template-rows:auto!important;align-content:start}" +
    "#screen-dashboard p.text-center.leading-relaxed.text-\\[10px\\]{display:none!important}" +
    "html #screen-dashboard:not(.hidden)>div.space-y-3>.grid{grid-template-rows:repeat(2,128px)!important;gap:8px!important}" +
    "#screen-dashboard .grid.grid-cols-2>button *{line-height:1.25}" +
    "#screen-dashboard .grid.grid-cols-2>button h3{font-size:17px!important;line-height:1.2!important;margin:0!important}" +
    "#screen-dashboard .grid.grid-cols-2>button p{font-size:12.5px!important;line-height:1.3!important;margin:0!important;color:#A69C86}" +
    "body:has(#bizstep) .max-w-md.min-h-screen{padding-top:10px!important}" +
    "body:has(#bizstep) #screen-business{height:auto!important;margin-top:0!important}" +
    "";
  document.head.appendChild(st);
  var COURT = { "IELTS, TOEFL, TOEIC, Cambridge, Duolingo, PTE": "IELTS, TOEFL, TOEIC, visa..." };
  function maj() {
    var bs = document.querySelectorAll("#screen-dashboard .grid.grid-cols-2>button");
    for (var i = 0; i < bs.length; i++) {
      var all = bs[i].querySelectorAll("*");
      for (var j = 0; j < all.length; j++) {
        var el = all[j];
        if (el.children.length === 0) {
          var t = (el.textContent || "").trim();
          if (COURT[t]) el.textContent = COURT[t];
        }
      }
    }
  }
  var n = 0;
  (function boucle() { try { maj(); } catch (e) {} if (++n < 30) setTimeout(boucle, 800); })();
  window.DiisooAccueil2 = { maj: maj };
})();
