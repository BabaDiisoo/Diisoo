/* diisoo-ios-fix.js v1 : stabilité audio et micro sur iPhone / iPad (Safari, PWA)
 * Actif uniquement sur iOS. Aucun effet sur Android et ordinateur. Ne modifie aucun autre fichier.
 *
 * 1) Contextes audio : iOS en tolère très peu. On suit tous ceux que l'app crée, on ferme les plus anciens
 *    inutilisés au-delà de 3, et on réveille ceux qui sont "suspended" ou "interrupted" (état propre à iOS).
 * 2) Retour d'une autre app, d'un appel, de la veille : reprise automatique de l'audio.
 * 3) Après le micro : dès qu'une piste micro est arrêtée, retour en mode "lecture" (sinon son faible ou muet).
 * 4) MediaRecorder : choix d'un format que l'iPhone sait produire (audio/mp4) quand l'app n'en précise aucun.
 * Diagnostic : window.DiisooIosFix.etat()
 */
(function () {
  "use strict";
  if (window.__diisooIosFix) return;
  window.__diisooIosFix = true;

  var UA = navigator.userAgent || "";
  var IOS = /iPhone|iPad|iPod/.test(UA) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!IOS) return;

  var MAX_CTX = 3;
  var contextes = [];

  function vivants() {
    contextes = contextes.filter(function (c) { return c && c.state !== "closed"; });
    return contextes;
  }

  function enLecture() {
    try {
      if (navigator.audioSession && navigator.audioSession.type !== "playback") navigator.audioSession.type = "playback";
    } catch (e) {}
  }

  function reveiller() {
    enLecture();
    vivants().forEach(function (c) {
      if (c.state === "suspended" || c.state === "interrupted") {
        try { var p = c.resume(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
      }
    });
  }

  function elaguer() {
    var v = vivants();
    if (v.length <= MAX_CTX) return;
    /* On ferme d'abord les plus anciens qui ne jouent pas */
    for (var i = 0; i < v.length - MAX_CTX; i++) {
      var c = v[i];
      if (c.state !== "running") { try { c.close(); } catch (e) {} }
    }
    vivants();
  }

  /* 1) Suivi des AudioContext */
  var Base = window.AudioContext || window.webkitAudioContext;
  if (Base && typeof Base === "function") {
    try {
      var Suivi = class extends Base {
        constructor(options) {
          super(options);
          contextes.push(this);
          elaguer();
          try {
            this.addEventListener("statechange", function () {
              if (this.state === "interrupted" || this.state === "suspended") { /* réveil au prochain geste */ }
            });
          } catch (e) {}
        }
      };
      window.AudioContext = Suivi;
      window.webkitAudioContext = Suivi;
    } catch (e) { console.warn("Diisoo iOS : suivi AudioContext impossible", e); }
  }

  /* 2) Reprise après interruption */
  var dernier = 0;
  function surGeste() {
    var t = Date.now();
    if (t - dernier < 800) return;
    dernier = t;
    reveiller();
  }
  ["touchend", "pointerdown", "click", "keydown"].forEach(function (ev) {
    document.addEventListener(ev, surGeste, { capture: true, passive: true });
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) return;
    dernier = 0;
    reveiller();
  });
  window.addEventListener("pageshow", function () { dernier = 0; reveiller(); });
  window.addEventListener("focus", reveiller);

  /* 3) Fin du micro : retour au mode lecture */
  try {
    var MST = window.MediaStreamTrack && window.MediaStreamTrack.prototype;
    if (MST && !MST.__diisooStop) {
      var stopOrig = MST.stop;
      MST.stop = function () {
        var r = stopOrig.apply(this, arguments);
        if (this.kind === "audio") setTimeout(reveiller, 150);
        return r;
      };
      MST.__diisooStop = true;
    }
  } catch (e) {}

  /* 4) Format d'enregistrement compatible iPhone */
  var FORMATS = ["audio/mp4", "audio/mp4;codecs=mp4a.40.2", "audio/aac", "audio/webm;codecs=opus", "audio/webm"];
  function formatSupporte() {
    var MR = window.MediaRecorder;
    if (!MR || !MR.isTypeSupported) return "";
    for (var i = 0; i < FORMATS.length; i++) {
      try { if (MR.isTypeSupported(FORMATS[i])) return FORMATS[i]; } catch (e) {}
    }
    return "";
  }
  try {
    var MRBase = window.MediaRecorder;
    if (MRBase && !MRBase.__diisooPatched) {
      var Rec = class extends MRBase {
        constructor(stream, options) {
          var o = options || {};
          if (!o.mimeType) {
            var f = formatSupporte();
            if (f) o = Object.assign({}, o, { mimeType: f });
          }
          try { super(stream, o); } catch (e) { super(stream); }
        }
      };
      Rec.isTypeSupported = MRBase.isTypeSupported ? MRBase.isTypeSupported.bind(MRBase) : function () { return false; };
      Rec.__diisooPatched = true;
      window.MediaRecorder = Rec;
    }
  } catch (e) { console.warn("Diisoo iOS : MediaRecorder non adapté", e); }

  window.DiisooIosFix = {
    etat: function () {
      return {
        ios: true,
        contextes: vivants().map(function (c) { return c.state; }),
        audioSession: (navigator.audioSession && navigator.audioSession.type) || "non disponible",
        formatMicro: formatSupporte() || "aucun",
        standalone: !!navigator.standalone
      };
    },
    reveiller: reveiller
  };
})();
