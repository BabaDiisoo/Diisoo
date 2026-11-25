/* diisoo-voix-en.js : voix anglaise pré-enregistrée (gratuite), lue avant OpenAI et avant la voix du téléphone.
 * Les phrases sont rangées dans audio-en/ (index.json + 2 gros paquets pNNN.mp3, lus par tranches). Une phrase absente repasse par l'ancien chemin
 * et est signalée (événement « [diisoo-voix-en] absente ») pour être ajoutée au lot suivant. Interrupteur : ?voixen=0 */
(function () {
  "use strict";
  if (window.__voixEnOK) return; window.__voixEnOK = true;
  try { if (new URLSearchParams(location.search).get("voixen") === "0") return; } catch (e) {}
  var CACHE = "diisoo-audio-en", IDX = null, IDXP = null, FEM = null, FEMP = null, CTX = null, SRC = null, JETON = 0, tentes = 0;

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
  /* v3 : voix feminines (repliques « B » des dialogues, questions des missions metiers) dans audio-en/f001.mp3 + index-f.json */
  function indexF() {
    if (FEM) return Promise.resolve(FEM);
    if (!FEMP) FEMP = fetch("audio-en/index-f.json").then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) { FEM = j; return j; }).catch(function () { FEM = { i: {} }; return FEM; });
    return FEMP;
  }
  var TR = {}, GROS = {};
  function nomPaquet(n, f) { return "audio-en/" + (f ? "f" : "p") + ("00" + n).slice(-3) + ".mp3"; }
  /* v2 : les paquets sont de gros fichiers (moins de 25 Mo chacun, pour le depot GitHub) : on ne telecharge que la tranche de la phrase (requete Range). */
  function tranche(e, f) {
    var nom = nomPaquet(e[0], f), deb = e[1], fin = e[1] + e[2] - 1, cl = nom + "?r=" + deb + "-" + fin;
    if (TR[cl]) return TR[cl];
    TR[cl] = (async function () {
      try {
        var c = window.caches ? await caches.open(CACHE) : null, r = c ? await c.match(cl) : null;
        if (r) return await r.arrayBuffer();
        var ab = null;
        if (GROS[nom]) ab = GROS[nom].slice(deb, fin + 1);
        else {
          var rep = await fetch(nom, { headers: { Range: "bytes=" + deb + "-" + fin } });
          if (rep.status === 206) ab = await rep.arrayBuffer();
          else if (rep.ok) { var tout = await rep.arrayBuffer(); GROS[nom] = tout; ab = tout.slice(deb, fin + 1); }
          else throw 0;
        }
        if (c && ab && ab.byteLength === e[2]) { try { await c.put(cl, new Response(ab.slice(0))); } catch (x) {} }
        return ab;
      } catch (x) { delete TR[cl]; return null; }
    })();
    return TR[cl];
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
        var ck = cle(texte), fm = await indexF(), ef = fm && fm.i ? fm.i[ck] : null, e = ef || idx.i[ck];
        if (!e) { console.error("[diisoo-voix-en] absente", String(texte).slice(0, 160)); return jouerOrig.apply(self, args); }
        if (!ctx) return jouerOrig.apply(self, args);
        V.arreter(); var mon = JETON;
        if (o.onAttente && !TR[nomPaquet(e[0], !!ef) + "?r=" + e[1] + "-" + (e[1] + e[2] - 1)]) o.onAttente();
        var seg = await tranche(e, !!ef); if (!seg) return jouerOrig.apply(self, args);
        if (mon !== JETON) return false;
        var dec = await new Promise(function (ok, ko) { try { var p = ctx.decodeAudioData(seg, ok, ko); if (p && p.then) p.then(ok, ko); } catch (x) { ko(x); } });
        if (mon !== JETON) return false;
        /* iPhone : un moteur audio suspendu ne joue rien et ne se termine jamais. On le reveille (1 s max), sinon repli sur l'ancien chemin. */
        if (ctx.state !== "running") { try { await Promise.race([ctx.resume(), new Promise(function (r) { setTimeout(r, 1000); })]); } catch (x) {} }
        if (ctx.state !== "running") { tentes++; if (tentes < 50) console.error("[diisoo-voix-en] moteur suspendu"); return jouerOrig.apply(self, args); }
        if (mon !== JETON) return false;
        if (o.onDebut) { try { o.onDebut(); } catch (x) {} }
        return await new Promise(function (fin) {
          var s = ctx.createBufferSource(), fini = false; s.buffer = dec; s.connect(ctx.destination); SRC = s;
          function clore() { if (fini) return; fini = true; if (SRC === s) SRC = null; fin(mon === JETON); }
          s.onended = clore;
          setTimeout(clore, Math.round((dec.duration || 3) * 1000) + 2500);  /* garde-fou : ne jamais bloquer la suite */
          s.start(0);
        });
      } catch (err) {
        tentes++; if (tentes < 50) console.error("[diisoo-voix-en] erreur", String((err && err.message) || err).slice(0, 80));
        return jouerOrig.apply(self, args);
      }
    };
    window.__voixEn = { cle: cle, index: index, indexF: indexF };
  }
  var essais = 0, t = setInterval(function () {
    essais++;
    if (window.Diisoo && window.Diisoo.voix && typeof window.Diisoo.voix.jouer === "function") { clearInterval(t); installer(window.Diisoo.voix); }
    else if (essais > 80) clearInterval(t);
  }, 250);
})();
