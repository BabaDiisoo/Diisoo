/* diisoo-stable.js v1 : stabilite
   1. L'ecran ne s'eteint pas pendant un exercice (Wake Lock)
   2. L'app revient a l'endroit ou tu etais apres un rechargement ou si le telephone a ferme l'onglet
   3. Dans les dialogues, l'ecran suit la phrase qui est lue (defilement + surlignage)
   4. Micro plus tolerant : contractions, chiffres, hesitations, 5 propositions du moteur vocal */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function visible(id) { var e = $(id); return !!(e && e.offsetParent !== null); }

  /* ---------- 1. Ecran toujours allume ---------- */
  var verrou = null, veut = false;
  function demander() {
    if (!veut || verrou || document.hidden) return;
    try {
      if (navigator.wakeLock && navigator.wakeLock.request) {
        navigator.wakeLock.request("screen").then(function (l) {
          verrou = l;
          l.addEventListener("release", function () { verrou = null; });
        }).catch(function () {});
      }
    } catch (e) {}
  }
  function liberer() { try { if (verrou) verrou.release(); } catch (e) {} verrou = null; }
  function ecranActif() {
    var s = document.querySelectorAll("[id^='screen-']"), id = null;
    for (var i = 0; i < s.length; i++) { if (!s[i].classList.contains("hidden")) { id = s[i].id; break; } }
    return id;
  }
  setInterval(function () {
    var id = ecranActif();
    veut = !!id && id !== "screen-dashboard" && id !== "screen-login" && id !== "screen-register";
    if (veut) demander(); else liberer();
  }, 1500);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) { verrou = null; demander(); } });

  /* ---------- 2. Reprise la ou on s'etait arrete ---------- */
  var CLE = "diisoo_pos", DUREE = 30 * 60 * 1000;
  var OUVRIR = {
    "screen-general": ["openGeneralModule", "general"],
    "screen-wolof": ["openWolofModule", "wolof"],
    "screen-business": ["openBusinessModule", "business"],
    "screen-test-simulation": ["startTestSimulation", null]
  };
  function niveauActuel(key) {
    try {
      if (key === "business") return window.DiisooBiz.niveau();
      return window.DiisooOrga.niveau(key);
    } catch (e) { return null; }
  }
  var restaure = false;
  function sauver() {
    if (!restaure) return;
    var id = ecranActif();
    try {
      if (!id || !OUVRIR[id]) { localStorage.removeItem(CLE); return; }
      localStorage.setItem(CLE, JSON.stringify({ s: id, l: niveauActuel(OUVRIR[id][1]), t: Date.now() }));
    } catch (e) {}
  }
  function reprendre() {
    var p = null;
    try { p = JSON.parse(localStorage.getItem(CLE) || "null"); } catch (e) {}
    restaure = true;
    if (!p || !OUVRIR[p.s] || Date.now() - p.t > DUREE) return;
    if (ecranActif() !== "screen-dashboard") return;
    var fn = window[OUVRIR[p.s][0]];
    if (typeof fn !== "function") return;
    try { fn(); } catch (e) { return; }
    if (p.l) {
      setTimeout(function () {
        var b = document.querySelectorAll("#lvl-" + OUVRIR[p.s][1] + " .lvl-btn")[p.l - 1];
        if (b && !b.classList.contains("lock")) b.click();
      }, 400);
    }
  }
  setInterval(sauver, 1000);
  document.addEventListener("visibilitychange", function () { if (document.hidden) sauver(); });
  window.addEventListener("pagehide", sauver);
  /* On attend que l'ecran d'accueil soit pret, puis on reprend (une seule fois) */
  var essais = 0, tReprise = setInterval(function () {
    essais++;
    if (visible("screen-dashboard")) { clearInterval(tReprise); setTimeout(reprendre, 300); }
    else if (essais > 40) { clearInterval(tReprise); restaure = true; }
  }, 250);

  /* ---------- 3. L'ecran suit le dialogue ---------- */
  var st = document.createElement("style");
  st.textContent = ".dii-suit{background:rgba(225,105,63,.22)!important;outline:2px solid #E1693F;border-radius:10px;transition:background .2s}";
  document.head.appendChild(st);
  var dernier = null;
  function suivre(texte) {
    try {
      var t = String(texte || "").trim();
      if (t.length < 2) return;
      var cands = document.querySelectorAll("[id^='bdl-'], .dlg-bulle, [data-dlg-line], .dlg-ligne");
      var trouve = null;
      for (var i = 0; i < cands.length; i++) {
        if (cands[i].textContent.indexOf(t) > -1 && cands[i].offsetParent !== null) { trouve = cands[i]; break; }
      }
      if (dernier) dernier.classList.remove("dii-suit");
      if (!trouve) { dernier = null; return; }
      dernier = trouve;
      trouve.classList.add("dii-suit");
      trouve.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {}
  }
  function finSuivi() { if (dernier) { dernier.classList.remove("dii-suit"); dernier = null; } }
  var seqOrig = window.playSequence;
  if (typeof seqOrig === "function") {
    window.playSequence = function (items) {
      var liste = (items || []).map(function (it) {
        var o = Object.assign({}, it), f = it.onStart;
        o.onStart = function () { suivre(it.text); if (typeof f === "function") f(); };
        return o;
      });
      var r = seqOrig.call(this, liste);
      try { Promise.resolve(r).then(finSuivi, finSuivi); } catch (e) {}
      return r;
    };
  }

  /* ---------- 4. Micro plus tolerant ---------- */
  var CONTR = [
    [/\bi'm\b/g, "i am"], [/\byou're\b/g, "you are"], [/\bwe're\b/g, "we are"], [/\bthey're\b/g, "they are"],
    [/\bhe's\b/g, "he is"], [/\bshe's\b/g, "she is"], [/\bit's\b/g, "it is"], [/\bthat's\b/g, "that is"],
    [/\bwhat's\b/g, "what is"], [/\bwhere's\b/g, "where is"], [/\bhow's\b/g, "how is"], [/\bthere's\b/g, "there is"],
    [/\bi've\b/g, "i have"], [/\bwe've\b/g, "we have"], [/\byou've\b/g, "you have"], [/\bi'll\b/g, "i will"],
    [/\byou'll\b/g, "you will"], [/\bwe'll\b/g, "we will"], [/\bi'd\b/g, "i would"], [/\blet's\b/g, "let us"],
    [/\bdon't\b/g, "do not"], [/\bdoesn't\b/g, "does not"], [/\bdidn't\b/g, "did not"], [/\bcan't\b/g, "can not"],
    [/\bcannot\b/g, "can not"], [/\bwon't\b/g, "will not"], [/\bisn't\b/g, "is not"], [/\baren't\b/g, "are not"],
    [/\bwasn't\b/g, "was not"], [/\bcouldn't\b/g, "could not"], [/\bshouldn't\b/g, "should not"], [/\bwouldn't\b/g, "would not"],
    [/\bgonna\b/g, "going to"], [/\bwanna\b/g, "want to"], [/\bgotta\b/g, "got to"]
  ];
  var NB = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
    "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
  var origNorm = window.normalize;
  if (typeof origNorm === "function") {
    window.normalize = function (s) {
      var t = String(s == null ? "" : s).toLowerCase().replace(/[‘’ʼ`]/g, "'");
      CONTR.forEach(function (c) { t = t.replace(c[0], c[1]); });
      t = t.replace(/\b(\d{1,2})\b/g, function (m, n) { n = +n; return n <= 20 ? NB[n] : m; });
      t = t.replace(/\b(uh|um|umm|uhm|erm|er|hmm|ah|oh)\b/g, " ");
      t = t.replace(/\b(ok|okay)\b/g, "okay");
      return origNorm(t);
    };
  }

  /* 5 propositions du moteur vocal au lieu d'une : la meilleure par rapport a la phrase attendue est gardee */
  try {
    var SRc = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SRc && SRc.prototype) {
      var P = SRc.prototype;
      var dm = Object.getOwnPropertyDescriptor(P, "maxAlternatives");
      if (dm && dm.set) {
        Object.defineProperty(P, "maxAlternatives", {
          configurable: true, enumerable: dm.enumerable,
          get: dm.get, set: function () { dm.set.call(this, 5); }
        });
      }
      var dr = Object.getOwnPropertyDescriptor(P, "onresult");
      if (dr && dr.set) {
        Object.defineProperty(P, "onresult", {
          configurable: true, enumerable: dr.enumerable,
          get: dr.get,
          set: function (fn) {
            if (typeof fn !== "function") { dr.set.call(this, fn); return; }
            dr.set.call(this, function (e) {
              var ev = e;
              try { ev = choisirMeilleur(e); } catch (x) { ev = e; }
              return fn.call(this, ev);
            });
          }
        });
      }
    }
  } catch (e) {}

  /* Phrase attendue : lue sur le bouton micro touche en dernier */
  var cible = "";
  function lireCible(btn) {
    try {
      var d = (btn.dataset.practice || "").split(":");
      if (d[0] === "biz" && window.CHINA_TRADE_WOLOF) return CHINA_TRADE_WOLOF[d[1]].vocab[+d[2]].en;
      var carte = btn.closest(".fx-em, .bg-\\[\\#141A2B\\], .dlg-bulle, div");
      var p = carte && carte.querySelector("p");
      return p ? p.textContent : "";
    } catch (e) { return ""; }
  }
  document.addEventListener("pointerdown", function (ev) {
    var b = ev.target.closest && ev.target.closest("[data-practice]");
    cible = b && !/^(biz-|.*-en|.*-wo)/.test(b.dataset.practice || "") ? lireCible(b) : "";
  }, true);

  function score(a, b) {
    a = window.normalize(a); b = window.normalize(b);
    if (!a || !b) return 0;
    var A = a.split(" "), B = b.split(" "), ok = 0;
    B.forEach(function (w) { if (A.indexOf(w) > -1) ok++; });
    return ok / B.length;
  }
  /* Renvoie un evenement equivalent ou la meilleure proposition est en position 0 */
  function choisirMeilleur(e) {
    if (!cible || !e.results) return e;
    var res = [];
    for (var i = 0; i < e.results.length; i++) {
      var r = e.results[i], best = 0, bs = -1;
      for (var k = 0; k < r.length; k++) {
        var sc = score(r[k].transcript, cible);
        if (sc > bs) { bs = sc; best = k; }
      }
      var x = [r[best]];
      x.isFinal = r.isFinal;
      res.push(x);
    }
    return { resultIndex: e.resultIndex, results: res, type: e.type };
  }

  window.DiisooStable = { version: 1, reprendre: reprendre };
})();
