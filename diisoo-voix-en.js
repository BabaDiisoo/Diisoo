/* diisoo-voix-en.js : voix anglaise pré-enregistrée (gratuite), lue avant OpenAI et avant la voix du téléphone.
 * Les phrases sont rangées dans audio-en/ (index.json + paquets pNNN.mp3). Une phrase absente repasse par l'ancien chemin
 * et est signalée (événement « [diisoo-voix-en] absente ») pour être ajoutée au lot suivant. Interrupteur : ?voixen=0 */
(function () {
  "use strict";
  if (window.__voixEnOK) return; window.__voixEnOK = true;
  try { if (new URLSearchParams(location.search).get("voixen") === "0") return; } catch (e) {}
  var CACHE = "diisoo-audio-en", IDX = null, IDXP = null, PAQ = {}, CTX = null, SRC = null, JETON = 0, tentes = 0;

  function norm(t) { return String(t).replace(/\s+/g, " ").trim().toLowerCase(); }
  function cle(t) {  /* cyrb53, identique à make_audio_en.py */
    t = norm(t); var h1 = 0xdeadbeef, h2 = 0x41c6ce57, i, c;
    for (i = 0; i < t.length; i++) { c = t.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
  }
  function contexte() {
    if (CTX) return CTX;
    try { var AC = window.AudioContext || window.webkitAudioContext; CTX = new AC(); } catch (e) { CTX = null; }
    return CTX;
  }
  function index() {
    if (IDX) return Promise.resolve(IDX);
    if (!IDXP) IDXP = fetch("audio-en/index.json").then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) { IDX = j; return j; }).catch(function () { IDXP = null; return null; });
    return IDXP;
  }
  function paquet(n) {
    var nom = "audio-en/p" + ("00" + n).slice(-3) + ".mp3";
    if (PAQ[nom]) return PAQ[nom];
    PAQ[nom] = (async function () {
      try {
        var c = window.caches ? await caches.open(CACHE) : null, r = c ? await c.match(nom) : null;
        if (!r) { r = await fetch(nom); if (!r.ok) throw 0; if (c) { try { await c.put(nom, r.clone()); } catch (e) {} } }
        return await r.arrayBuffer();
      } catch (e) { delete PAQ[nom]; return null; }
    })();
    return PAQ[nom];
  }
  function arreterNotre() { JETON++; try { if (SRC) { SRC.onended = null; SRC.stop(); } } catch (e) {} SRC = null; }
  function installer(V) {
    var jouerOrig = V.jouer, arreterOrig = V.arreter;
    V.arreter = function () { arreterNotre(); return arreterOrig.apply(this, arguments); };
    V.jouer = async function (texte, langue, options) {
      var o = options || {};
      if (langue !== "en" || !texte) return jouerOrig.apply(this, arguments);
      var ctx = contexte(); try { if (ctx && ctx.state === "suspended") ctx.resume(); } catch (e) {}  /* dans le geste de l'utilisateur (iPhone) */
      var args = arguments, self = this;
      try {
        var idx = await index(); if (!idx) return jouerOrig.apply(self, args);
        var e = idx.i[cle(texte)];
        if (!e) { console.error("[diisoo-voix-en] absente", String(texte).slice(0, 160)); return jouerOrig.apply(self, args); }
        if (!ctx) return jouerOrig.apply(self, args);
        V.arreter(); var mon = JETON;
        if (o.onAttente && !PAQ["audio-en/p" + ("00" + e[0]).slice(-3) + ".mp3"]) o.onAttente();
        var buf = await paquet(e[0]); if (!buf) return jouerOrig.apply(self, args);
        if (mon !== JETON) return false;
        var seg = buf.slice(e[1], e[1] + e[2]), dec = await new Promise(function (ok, ko) { try { var p = ctx.decodeAudioData(seg, ok, ko); if (p && p.then) p.then(ok, ko); } catch (x) { ko(x); } });
        if (mon !== JETON) return false;
        if (o.onDebut) { try { o.onDebut(); } catch (x) {} }
        return await new Promise(function (fin) {
          var s = ctx.createBufferSource(); s.buffer = dec; s.connect(ctx.destination); SRC = s;
          s.onended = function () { if (SRC === s) SRC = null; fin(mon === JETON); };
          s.start(0);
        });
      } catch (err) {
        tentes++; if (tentes < 50) console.error("[diisoo-voix-en] erreur", String((err && err.message) || err).slice(0, 80));
        return jouerOrig.apply(self, args);
      }
    };
    window.__voixEn = { cle: cle, index: index };
  }
  var essais = 0, t = setInterval(function () {
    essais++;
    if (window.Diisoo && window.Diisoo.voix && typeof window.Diisoo.voix.jouer === "function") { clearInterval(t); installer(window.Diisoo.voix); }
    else if (essais > 80) clearInterval(t);
  }, 250);
})();
