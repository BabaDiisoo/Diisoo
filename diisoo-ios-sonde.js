/* diisoo-ios-sonde.js : sonde iPhone. Sur iPhone/iPad uniquement, une fois par jour et par appareil, teste le vrai chemin du son
 * (moteur audio, lecture par tranche, decodage MP3, voix du telephone, micro, stockage) et envoie UNE ligne de resultat
 * (evenement ios_sonde). Detecte aussi les fermetures brutales de la page (ios_ferme_brutal) = page tuee par Safari.
 * Aucun contenu personnel. Interrupteur : ?sonde=0 */
(function () {
  "use strict";
  if (window.__sondeIosOK) return; window.__sondeIosOK = true;
  var ua = navigator.userAgent || "";
  if (!/iPhone|iPad|iPod/.test(ua)) return;
  try { if (new URLSearchParams(location.search).get("sonde") === "0") return; } catch (e) {}
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function noter(nom, d) { try { if (window.DiisooSuivi && window.DiisooSuivi.noter) window.DiisooSuivi.noter("action", nom, d); } catch (e) {} }
  function ecran() { try { var e = document.querySelectorAll("[id^=screen-]"); for (var i = 0; i < e.length; i++) if (!e[i].classList.contains("hidden") && e[i].offsetParent !== null) return e[i].id.replace("screen-", ""); } catch (x) {} return ""; }

  /* ---- 1) fermeture brutale : l'etat "run" n'a pas ete remplace par "bg" ---- */
  var prev = lire("diisoo_etat"), prevEcran = lire("diisoo_dernier_ecran") || "";
  ecrire("diisoo_etat", "run");
  document.addEventListener("visibilitychange", function () { ecrire("diisoo_etat", document.visibilityState === "hidden" ? "bg" : "run"); });
  window.addEventListener("pagehide", function () { ecrire("diisoo_etat", "bg"); });
  setInterval(function () { var s = ecran(); if (s) ecrire("diisoo_dernier_ecran", s); }, 3000);
  if (prev === "run") setTimeout(function () { noter("ios_ferme_brutal", "ecran=" + prevEcran); }, 4000);

  /* ---- 2) sonde du son, une fois par jour ---- */
  var jour = new Date().toISOString().slice(0, 10);
  if (lire("diisoo_sonde") === jour) return;
  var lance = false;
  function attendre(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  async function sonde() {
    var r = [];
    try {
      var AC = window.AudioContext || window.webkitAudioContext, c = new AC(), t0 = Date.now();
      try { await Promise.race([c.resume(), attendre(1500)]); } catch (e) {}
      r.push("ctx=" + c.state);
      var a0 = c.currentTime; await attendre(400); r.push("tick=" + (c.currentTime > a0 ? "oui" : "NON"));
      r.push("as=" + ((navigator.audioSession && navigator.audioSession.type) || "nd"));
      try {
        var ix = await (await fetch("audio-en/index.json")).json(), k = Object.keys(ix.i)[0], e = ix.i[k];
        var d1 = Date.now(), rep = await fetch("audio-en/p00" + e[0] + ".mp3", { headers: { Range: "bytes=" + e[1] + "-" + (e[1] + e[2] - 1) } });
        r.push("rg=" + rep.status); var ab = await rep.arrayBuffer(); if (ab.byteLength > 2000000) r.push("GROS");
        var d2 = Date.now(); if (rep.status !== 206) ab = ab.slice(e[1], e[1] + e[2]); var buf = await new Promise(function (ok, ko) { try { var p = c.decodeAudioData(ab, ok, ko); if (p && p.then) p.then(ok, ko); } catch (x) { ko(x); } });
        r.push("dec=ok" + (Date.now() - d2) + "ms/dl" + (d2 - d1) + "ms");
      } catch (e2) { r.push("dec=KO:" + String((e2 && e2.message) || e2).slice(0, 30)); }
      try { c.close(); } catch (e) {}
    } catch (e3) { r.push("ctx=KO:" + String((e3 && e3.message) || e3).slice(0, 30)); }
    try { var v = window.speechSynthesis ? speechSynthesis.getVoices() : null; r.push("tts=" + (v ? v.length + "v/en" + v.filter(function (x) { return /^en/i.test(x.lang); }).length : "NON")); } catch (e) { r.push("tts=KO"); }
    try {
      var MR = window.MediaRecorder; r.push("mic=" + (navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? "api" : "NON") + "/" + (MR ? (MR.isTypeSupported && MR.isTypeSupported("audio/mp4") ? "mp4" : "mr") : "noMR"));
    } catch (e) { r.push("mic=KO"); }
    try { if (navigator.storage && navigator.storage.estimate) { var q = await navigator.storage.estimate(); r.push("q=" + Math.round((q.quota || 0) / 1048576) + "Mo/u" + Math.round((q.usage || 0) / 1048576)); } } catch (e) {}
    try { r.push("sw=" + (navigator.serviceWorker && navigator.serviceWorker.controller ? "oui" : "non")); } catch (e) {}
    r.push(navigator.standalone ? "pwa" : "web");
    noter("ios_sonde", r.join("|")); ecrire("diisoo_sonde", jour);
  }
  function declencher() { if (lance) return; lance = true; setTimeout(function () { sonde().catch(function () {}); }, 2500); }
  ["pointerup", "touchend", "click"].forEach(function (ev) { window.addEventListener(ev, declencher, { once: true, passive: true, capture: true }); });
})();
