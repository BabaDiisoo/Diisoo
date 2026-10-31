/* diisoo-ios-audio.js
 * Correctifs audio pour iPhone / iPad (Safari) :
 * 1) Le déverrouillage audio d'origine ne se fait qu'au tout premier toucher. Après un retour d'une autre
 *    application, un appel ou la mise en veille, iOS suspend l'audio et les voix restent muettes.
 *    Ici : on redéverrouille à chaque toucher (au plus une fois par seconde) et au retour sur l'app.
 * 2) Interrupteur silencieux : sur iOS 16 et avant, le son Web Audio est coupé par l'interrupteur de sonnerie.
 *    Une piste silencieuse jouée par un élément audio règle la catégorie « lecture ».
 * 3) Après usage du micro, iOS 17+ garde la catégorie « enregistrement » (son faible, haut-parleur d'appel) :
 *    on remet la catégorie « lecture » au toucher suivant.
 * Sans effet sur Android et ordinateur. Ne modifie aucun autre fichier.
 */
(function () {
  "use strict";
  if (window.__diisooIosAudio) return;
  window.__diisooIosAudio = true;

  var UA = navigator.userAgent || "";
  var IOS = /iPhone|iPad|iPod/.test(UA) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!IOS) return;

  var dernier = 0;
  var SILENCE = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
  var piste = null;

  function debloquer() {
    var t = Date.now();
    if (t - dernier < 1000) return;
    dernier = t;
    try { if (navigator.audioSession && navigator.audioSession.type !== "playback") navigator.audioSession.type = "playback"; } catch (e) {}
    try { if (window.Diisoo && window.Diisoo.voix && window.Diisoo.voix.debloquer) window.Diisoo.voix.debloquer(); } catch (e) {}
    demarrerPiste();
  }

  function demarrerPiste() {
    if (navigator.audioSession) return;            // iOS 17+ : la catégorie suffit
    try {
      if (!piste) {
        piste = new Audio(SILENCE);
        piste.setAttribute("playsinline", "");
        piste.loop = true;
        piste.volume = 1;
      }
      if (piste.paused) { var p = piste.play(); if (p && p.catch) p.catch(function () {}); }
    } catch (e) {}
  }

  ["touchend", "pointerdown", "click"].forEach(function (ev) {
    document.addEventListener(ev, debloquer, { capture: true, passive: true });
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { try { if (piste && !piste.paused) piste.pause(); } catch (e) {} }
    else { dernier = 0; }
  });
  window.addEventListener("pageshow", function () { dernier = 0; });
})();
