/* Diisoo : mode "une carte a la fois" (Anglais General, Anglais Wolof, Outils Business).
 * Un seul element visible a la fois. Passage automatique apres une bonne reponse.
 * Lecture seule des cles existantes. Ecrit seulement 2 nouvelles cles : diisoo_fx_theme, diisoo_fx_biz. Desactivation : retirer la ligne <script> dans index.html,
 * ou ouvrir https://diisoo.sn/?focus=0 */
(function () {
  "use strict";
  if (window.DiisooFocus) return;
  try { if (new URLSearchParams(location.search).get("focus") === "0") return; } catch (e) {}

  var AUTO_MS = 1200;
  var END_DIALOGUE_MS = 1500;
  var COMPACT_FROM = 20;

  function injectCss() {
    if (document.getElementById("fx-style")) return;
    var s = document.createElement("style");
    s.id = "fx-style";
    s.textContent =
      ".fx-nav{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;padding:2px 0}" +
      ".fx-lab{width:100%;text-align:center;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#8C8064;margin-bottom:2px}" +
      ".fx-dot{width:10px;height:10px;border-radius:9999px;background:#2A3454;border:0;padding:0;margin:7px 3px;transition:width .2s,background .2s}" +
      ".fx-dot.fx-ok{background:#5FC98F}" +
      ".fx-dot.fx-on{width:22px;background:#E1693F}" +
      ".fx-row{display:flex;align-items:center;justify-content:center;width:100%}" +
      ".fx-arr{background:#141A2B;border:1px solid #1E2740;color:#C9BFA8;border-radius:9999px;width:34px;height:34px;font-size:16px;line-height:1;padding:0}" +
      ".fx-rowlab{flex:1;text-align:center;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#8C8064}" +
      ".fx-bar{width:100%;height:4px;border-radius:9999px;background:#1E2740;margin:6px 0 4px;overflow:hidden}" +
      ".fx-fill{height:100%;background:#E1693F;border-radius:9999px;transition:width .25s}" +
      ".fx-in{animation:fxin .22s ease-out}" +
      "@keyframes fxin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}";
    document.head.appendChild(s);
  }

  function txt(el) { return (el.textContent || "").trim(); }
  function hide(el) { el.style.display = "none"; }
  function show(el) { el.style.display = ""; }
  function resOf(el) { return el.querySelector ? el.querySelector('[id*="res-"]') : null; }

  /* ---------- Reprise : lecture seule de diisoo_word_stats et diisoo_tests ---------- */
  function readStore(k) { try { return store.get(k) || null; } catch (e) { return null; } }
  function statDone(stats, key) { var e = stats && stats[key]; return !!(e && e.correct >= 1); }
  function resumeSteps(steps, keyOf, afterAll) {
    var stats = readStore("diisoo_word_stats") || {}, done = {}, start = -1, n = 0;
    steps.forEach(function (st, i) {
      if (st.type !== "voc") return;
      n++;
      var k = keyOf(st.els[0]);
      if (k && statDone(stats, k)) done[i] = true; else if (start < 0) start = i;
    });
    if (start < 0) start = n && afterAll < steps.length ? afterAll : 0;
    return { start: start, done: done };
  }
  function enOf(card) {
    var p = card.querySelector("p.text-base.font-bold") || card.querySelector("p");
    return p ? txt(p) : "";
  }

  /* ---------- Classificateurs : un par ecran. Retournent null si la structure n'est pas reconnue. ---------- */
  function classifyGeneral(box) {
    var kids = Array.prototype.slice.call(box.children).filter(function (el) { return !el.classList.contains("fx-nav"); });
    var vocs = [], dlg = [], quiz = [], pre = [], keep = [], stage = "pre";
    kids.forEach(function (el) {
      if (el.classList.contains("aide-barre")) { keep.push(el); return; }
      if (el.querySelector('[id^="gen-res-"]')) { vocs.push(el); stage = "voc"; return; }
      if (el.tagName === "P" && /^dialogue/i.test(txt(el))) stage = "dlg";
      else if (el.tagName === "P" && /^grammaire/i.test(txt(el))) stage = "quiz";
      else if (el.id === "dlg-fil" || el.id === "jdr-zone") { if (stage !== "quiz") stage = "dlg"; }
      else if (el.id === "general-quiz-box") stage = "quiz";
      if (stage === "pre") pre.push(el);
      else if (stage === "dlg") dlg.push(el);
      else if (stage === "quiz") quiz.push(el);
    });
    if (!vocs.length || !box.querySelector("#dlg-fil")) return null;
    var steps = vocs.map(function (el, i) {
      return { type: "voc", els: [el], label: "Mot " + (i + 1) + " sur " + vocs.length, res: resOf(el) };
    });
    if (dlg.length) steps.push({ type: "dlg", els: dlg, label: "Dialogue" });
    if (quiz.length) steps.push({ type: "quiz", els: quiz, label: "Grammaire" });
    var rg = { start: 0, done: {} };
    try { rg = resumeSteps(steps, function (el) { return "gen:" + generalThemeId + ":" + enOf(el); }, vocs.length); } catch (e) {}
    return { hidden: pre, keep: keep, steps: steps, start: rg.start, done: rg.done, key: txt(vocs[0]).slice(0, 40) + "|" + vocs.length, anchor: keep[0] || null };
  }

  function classifyWolof(box) {
    var kids = Array.prototype.slice.call(box.children).filter(function (el) { return !el.classList.contains("fx-nav"); });
    var cards = [], keep = [];
    kids.forEach(function (el) {
      if (el.tagName === "P" && !resOf(el)) { keep.push(el); return; }
      cards.push(el);
    });
    if (!cards.length) return null;
    var steps = cards.map(function (el, i) {
      return { type: "voc", els: [el], label: "Mot " + (i + 1) + " sur " + cards.length, res: resOf(el) };
    });
    var rw = { start: 0, done: {} };
    try { rw = resumeSteps(steps, function (el) { return "wo:" + enOf(el); }, steps.length); } catch (e) {}
    return { hidden: [], keep: keep, steps: steps, start: rw.start, done: rw.done, key: txt(cards[0]).slice(0, 40) + "|" + cards.length, anchor: keep[keep.length - 1] || null };
  }

  /* Liste simple : chaque <div> est une carte, les <p> sont des messages conserves. */
  function resumeTests(cards) {
    var hist = readStore("diisoo_tests") || [], seen = {}, done = {}, start = -1;
    hist.forEach(function (h) { if (h && h.topic) seen[h.topic] = 1; });
    var bank = (typeof TEST_BANK !== "undefined") ? TEST_BANK : [];
    cards.forEach(function (el, i) {
      var t = bank[i];
      if (t && seen[t.topic]) done[i] = true; else if (start < 0) start = i;
    });
    return { start: start < 0 ? 0 : start, done: done, sig: hist.length };
  }
  function classifyList(word, compact, resume) {
    return function (box) {
      var kids = Array.prototype.slice.call(box.children).filter(function (el) { return !el.classList.contains("fx-nav"); });
      var cards = kids.filter(function (el) { return el.tagName === "DIV" || el.tagName === "BUTTON"; });
      var keep = kids.filter(function (el) { return cards.indexOf(el) === -1; });
      if (cards.length < 2) return null;
      var steps = cards.map(function (el, i) { return { type: "item", els: [el], label: word + " " + (i + 1) + " sur " + cards.length, res: null }; });
      var r = { start: 0, done: {}, sig: "" };
      if (resume) { try { r = resume(cards); } catch (e) {} }
      return { hidden: [], keep: keep, steps: steps, compact: compact, start: r.start, done: r.done, key: word + "|" + cards.length + "|" + txt(cards[0]).slice(0, 30) + "|" + r.sig, anchor: keep[0] || null };
    };
  }

  function classifyBusiness(box) {
    var kids = Array.prototype.slice.call(box.children).filter(function (el) { return !el.classList.contains("fx-nav"); });
    var keep = [], steps = [], pending = [], nvoc = 0, dlgStep = null;
    kids.forEach(function (el) {
      if (el.tagName === "H4") { keep.push(el); return; }
      if (el.tagName === "P" && !resOf(el)) { pending.push(el); return; }
      if (el.querySelector && el.querySelector('[id^="bdl-"]')) {
        dlgStep = { type: "dlg2", els: pending.concat([el]), label: "Dialogue" };
        pending = [];
        return;
      }
      var r = resOf(el);
      steps.push({ type: r ? "voc" : "lock", els: pending.concat([el]), label: "", res: r });
      pending = [];
    });
    if (pending.length) { pending.forEach(function (p) { keep.push(p); }); }
    var total = steps.length;
    steps.forEach(function (s, i) { s.label = (s.type === "lock" ? "Niveau verrouillé" : "Phrase " + (i + 1) + " sur " + total); });
    if (dlgStep) steps.push(dlgStep);
    if (!steps.length) return null;
    var rb = { start: 0, done: {} };
    try {
      var saved = readStore("diisoo_fx_biz") || {}, sec = null, first = -1;
      steps.forEach(function (st, i) {
        var m = st.res && st.res.id ? /^biz-res-(.+)-(\d+)$/.exec(st.res.id) : null;
        if (!m) return;
        sec = m[1];
        var idx = parseInt(m[2], 10);
        st.onDone = function () {
          try {
            var d = readStore("diisoo_fx_biz") || {};
            var arr = d[m[1]] || [];
            if (arr.indexOf(idx) === -1) arr.push(idx);
            d[m[1]] = arr;
            localStorage.setItem("diisoo_fx_biz", JSON.stringify(d));
          } catch (e) {}
        };
        if ((saved[m[1]] || []).indexOf(idx) > -1) rb.done[i] = true; else if (first < 0) first = i;
      });
      rb.start = first >= 0 ? first : (dlgStep ? steps.length - 1 : 0);
    } catch (e) {}
    return { hidden: [], keep: keep, steps: steps, start: rb.start, done: rb.done, key: txt(steps[0].els[steps[0].els.length - 1]).slice(0, 40) + "|" + steps.length, anchor: keep[0] || null };
  }

  /* ---------- Moteur ---------- */
  function mount(boxId, classify) {
    var box = document.getElementById(boxId);
    if (!box) return;
    var nav = null, steps = [], cur = 0, doneMap = {}, key = "", dlgCur = 0, dlgSeen = false, timers = [], compact = false;

    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    function bubbles() { return Array.prototype.slice.call(box.querySelectorAll("#dlg-fil .dlg-bulle")); }
    function showBubble(i) {
      var b = bubbles();
      if (!b.length) return;
      if (i < 0) i = 0;
      if (i > b.length - 1) i = b.length - 1;
      dlgCur = i;
      b.forEach(function (el, k) { el.style.display = k === i ? "" : "none"; });
    }
    function showAllBubbles() { bubbles().forEach(show); }

    function paintNav() {
      if (!nav) return;
      var st = steps[cur];
      if (compact) {
        var f = nav.querySelector(".fx-fill");
        if (f) f.style.width = Math.round((cur + 1) / steps.length * 100) + "%";
        var l = nav.querySelector(".fx-rowlab");
        if (l && st) l.textContent = st.label;
        return;
      }
      var dots = nav.querySelectorAll(".fx-dot");
      for (var i = 0; i < dots.length; i++) dots[i].className = "fx-dot" + (doneMap[i] ? " fx-ok" : "") + (i === cur ? " fx-on" : "");
      var lab = nav.querySelector(".fx-lab");
      if (lab && st) lab.textContent = st.label;
    }

    function go(i) {
      if (i < 0 || i > steps.length - 1) return;
      clearTimers();
      cur = i;
      steps.forEach(function (st, k) { st.els.forEach(function (el) { if (k === i) show(el); else hide(el); }); });
      steps[i].els.forEach(function (el) { el.classList.remove("fx-in"); void el.offsetWidth; el.classList.add("fx-in"); });
      if (steps[i].type === "dlg") { dlgSeen = false; showBubble(0); } else { showAllBubbles(); }
      paintNav();
      try { box.scrollTop = 0; } catch (e) {}
    }

    function buildNav(anchor) {
      nav = document.createElement("div");
      nav.className = "fx-nav";
      if (compact) {
        var row = document.createElement("div");
        row.className = "fx-row";
        var p = document.createElement("button");
        p.type = "button"; p.className = "fx-arr"; p.textContent = "‹"; p.setAttribute("aria-label", "Precedent");
        p.onclick = function () { go(cur - 1); };
        var l = document.createElement("div");
        l.className = "fx-rowlab";
        var n = document.createElement("button");
        n.type = "button"; n.className = "fx-arr"; n.textContent = "›"; n.setAttribute("aria-label", "Suivant");
        n.onclick = function () { go(cur + 1); };
        row.appendChild(p); row.appendChild(l); row.appendChild(n);
        var bar = document.createElement("div");
        bar.className = "fx-bar";
        var fill = document.createElement("div");
        fill.className = "fx-fill";
        bar.appendChild(fill);
        nav.appendChild(row); nav.appendChild(bar);
      } else {
        var lab = document.createElement("div");
        lab.className = "fx-lab";
        nav.appendChild(lab);
        steps.forEach(function (s, k) {
          var d = document.createElement("button");
          d.type = "button"; d.className = "fx-dot"; d.setAttribute("aria-label", "Etape " + (k + 1));
          d.onclick = function () { go(k); };
          nav.appendChild(d);
        });
      }
      if (anchor && anchor.parentNode === box) box.insertBefore(nav, anchor.nextSibling);
      else box.insertBefore(nav, box.firstChild);
    }

    function watchRes(st, idx) {
      if (!st.res) return;
      new MutationObserver(function () {
        if (doneMap[idx]) return;
        if (st.res.textContent.indexOf("✅") === -1) return;
        doneMap[idx] = true;
        try { if (st.onDone) st.onDone(); } catch (e) {}
        paintNav();
        later(function () { if (cur === idx) go(idx + 1); }, AUTO_MS);
      }).observe(st.res, { childList: true, subtree: true, characterData: true });
    }

    function watchDialogue(idx) {
      var fil = box.querySelector("#dlg-fil");
      if (!fil) return;
      new MutationObserver(function () {
        if (cur !== idx) return;
        var b = bubbles(), act = -1;
        b.forEach(function (el, k) { if (el.classList.contains("dlg-actif")) act = k; });
        if (act >= 0) { dlgSeen = true; showBubble(act); return; }
        if (!dlgSeen) return;
        if (dlgCur < b.length - 1) showBubble(dlgCur + 1);
        else {
          doneMap[idx] = true;
          paintNav();
          later(function () { if (cur === idx) go(idx + 1); }, END_DIALOGUE_MS);
        }
      }).observe(fil, { attributes: true, attributeFilter: ["class"], subtree: true });
    }

    function revealAll(c) {
      if (!c) return;
      c.hidden.concat(c.keep).forEach(show);
      c.steps.forEach(function (s) { s.els.forEach(show); });
      showAllBubbles();
    }

    function build() {
      var c = null;
      try {
        c = classify(box);
        if (!c || !c.steps.length) return;
        clearTimers();
        var same = c.key === key;
        key = c.key;
        if (!same) { cur = c.start || 0; doneMap = c.done || {}; }
        steps = c.steps;
        compact = !!c.compact || steps.length >= COMPACT_FROM;
        c.hidden.forEach(hide);
        c.keep.forEach(show);
        buildNav(c.anchor);
        steps.forEach(function (st, i) { watchRes(st, i); });
        steps.forEach(function (st, i) { if (st.type === "dlg") watchDialogue(i); });
        go(Math.min(cur, steps.length - 1));
      } catch (e) {
        try { revealAll(c); var n = box.querySelector(".fx-nav"); if (n) n.remove(); } catch (e2) {}
      }
    }

    var x0 = null, y0 = null;
    box.addEventListener("touchstart", function (e) {
      var t = e.touches && e.touches[0];
      if (t) { x0 = t.clientX; y0 = t.clientY; }
    }, { passive: true });
    box.addEventListener("touchend", function (e) {
      var t = e.changedTouches && e.changedTouches[0];
      if (!t || x0 === null) return;
      var dx = t.clientX - x0, dy = t.clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 70 && Math.abs(dy) < 40 && steps.length) go(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });

    new MutationObserver(function () {
      if (box.querySelector(".fx-nav")) return;
      if (!box.children.length) return;
      build();
    }).observe(box, { childList: true });
    if (box.children.length) build();
  }

  /* ---------- Tableau de bord : 4 grands menus plus grands ---------- */
  function injectDashCss() {
    if (document.getElementById("fx-dash-style")) return;
    var s = document.createElement("style");
    s.id = "fx-dash-style";
    s.textContent =
      "#screen-dashboard .grid.grid-cols-2>button{display:flex;flex-direction:column;justify-content:flex-start;align-items:flex-start;min-height:clamp(8.5rem,21vh,12.5rem);padding:1.1rem 1rem}" +
      "#screen-dashboard .grid.grid-cols-2>button>span{font-size:2.6rem;line-height:1;margin-bottom:.5rem}" +
      "#screen-dashboard .grid.grid-cols-2>button>h3{font-size:1.05rem;line-height:1.15}" +
      "#screen-dashboard .grid.grid-cols-2>button>p{font-size:.75rem;margin-top:.3rem}" +
      "#screen-dashboard .grid.grid-cols-2{gap:.75rem}";
    document.head.appendChild(s);
  }

  /* ---------- Revision : concentree sur ce que l'apprenant a travaille la veille ---------- */
  function dayKey(ts) { var d = new Date(ts); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function patchRevision() {
    try {
      if (typeof window.revFocus !== "function" || typeof window.revIntro !== "function" || window.__fxRev) return;
      window.__fxRev = true;
      var origFocus = window.revFocus;
      window.revFocus = function () {
        window.__revVeille = false;
        try {
          var f = store.get("diisoo_focus") || {};
          var now = Date.now(), yest = dayKey(now - 86400000);
          var veille = Object.keys(f).map(function (k) {
            var e = f[k];
            return { cle: k, type: e.type, id: e.id, titre: e.titre, pts: e.pts || 0, last: e.last || 0 };
          }).filter(function (e) { return e.last && dayKey(e.last) === yest; });
          veille.sort(function (a, b) { return (b.pts - a.pts) || (b.last - a.last); });
          if (veille.length) { window.__revVeille = true; return veille[0]; }
        } catch (e) {}
        return origFocus.apply(this, arguments);
      };
      var origIntro = window.revIntro;
      window.revIntro = function () {
        var r = origIntro.apply(this, arguments);
        if (window.__revVeille) r = r.replace("Pour toi, d'apr\u00e8s ce que tu travailles :", "Pour toi, d'apr\u00e8s ta journ\u00e9e d'hier :");
        return r;
      };
    } catch (e) {}
  }

  /* ---------- Business : les secteurs et "Anglais des marches" deviennent des onglets, comme les autres menus ---------- */
  function patchBusiness() {
    try {
      var picker = document.getElementById("business-picker");
      if (!picker || window.__fxBiz) return;
      if (typeof window.selectBusinessModule !== "function" || typeof window.openBusinessModule !== "function") return;
      if (typeof BUSINESS_SECTORS === "undefined" || typeof CHINA_TRADE_WOLOF === "undefined") return;
      window.__fxBiz = true;
      var tabs = document.createElement("div");
      tabs.id = "business-tabs";
      tabs.className = "flex space-x-2 overflow-x-auto pb-1";
      picker.parentNode.insertBefore(tabs, picker);
      var st = document.createElement("style");
      st.textContent = "#secteurs-ouvrir,#secteurs-retour{display:none!important}";
      document.head.appendChild(st);
      var last = null, marches = false;

      function keys() { return Object.keys(BUSINESS_SECTORS).filter(function (k) { return CHINA_TRADE_WOLOF[k]; }); }
      function tab(label, on, fn) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition " + (on ? "bg-[#8A4BBF] text-white" : "bg-[#141A2B] text-[#A69C86]");
        b.textContent = label;
        b.onclick = fn;
        tabs.appendChild(b);
      }
      function paint() {
        tabs.innerHTML = "";
        keys().forEach(function (k) { tab(BUSINESS_SECTORS[k].titre, !marches && k === last, function () { window.selectBusinessModule(k); }); });
        tab("\ud83d\uded2 Anglais des march\u00e9s", marches, openMarches);
      }
      function hideVue() {
        var v = document.getElementById("secteurs-vue");
        if (v) { v.classList.add("hidden"); v.innerHTML = ""; }
        var r = document.getElementById("secteurs-retour");
        if (r) r.classList.add("hidden");
      }
      function chrome() {
        picker.classList.add("hidden");
        var bk = document.getElementById("btn-business-back");
        if (bk) bk.classList.add("hidden");
      }
      function openMarches() {
        var o = document.getElementById("secteurs-ouvrir");
        if (!o) { setTimeout(function () { var o2 = document.getElementById("secteurs-ouvrir"); if (o2) openMarches(); }, 700); return; }
        marches = true; paint();
        o.click();
        var r = document.getElementById("secteurs-retour");
        if (r) r.classList.add("hidden");
      }

      var origSel = window.selectBusinessModule;
      window.selectBusinessModule = function (k) {
        hideVue();
        var r = origSel.apply(this, arguments);
        last = k; marches = false; paint(); chrome();
        return r;
      };
      var origOpen = window.openBusinessModule;
      window.openBusinessModule = function () {
        var r = origOpen.apply(this, arguments);
        var ks = keys();
        if (ks.length) window.selectBusinessModule(last && ks.indexOf(last) > -1 ? last : ks[0]);
        return r;
      };
    } catch (e) {}
  }

  /* ---------- Theme memorise (Anglais, Wolof) et libelle du nombre de tests ---------- */
  function patchThemes() {
    try {
      var saved = {};
      try { saved = JSON.parse(localStorage.getItem("diisoo_fx_theme")) || {}; } catch (e) {}
      function keep(k, v) {
        try {
          var d = {}; try { d = JSON.parse(localStorage.getItem("diisoo_fx_theme")) || {}; } catch (e2) {}
          d[k] = v; localStorage.setItem("diisoo_fx_theme", JSON.stringify(d));
        } catch (e) {}
      }
      if (typeof GENERAL_THEMES !== "undefined" && saved.gen && GENERAL_THEMES.some(function (t) { return t.id === saved.gen; })) generalThemeId = saved.gen;
      if (typeof WOLOF_THEMES !== "undefined" && saved.wo && (saved.wo === "wikidata" ? false : WOLOF_THEMES.some(function (t) { return t.id === saved.wo; }))) wolofCat = saved.wo;
      if (typeof window.setGeneralTheme === "function") {
        var og = window.setGeneralTheme;
        window.setGeneralTheme = function (id) { var r = og.apply(this, arguments); keep("gen", id); return r; };
      }
      if (typeof window.setWolofCat === "function") {
        var ow = window.setWolofCat;
        window.setWolofCat = function (c) { var r = ow.apply(this, arguments); keep("wo", c); return r; };
      }
    } catch (e) {}
  }
  function fixTestsLabel() {
    try {
      var lab = document.getElementById("test-phase-label");
      if (lab && typeof TEST_BANK !== "undefined" && /^\d+ tests complets$/.test(txt(lab))) lab.textContent = TEST_BANK.length + " tests complets";
      if (typeof window.renderTestPicker === "function" && !window.__fxLab) {
        window.__fxLab = true;
        var orp = window.renderTestPicker;
        window.renderTestPicker = function () {
          var r = orp.apply(this, arguments);
          var l = document.getElementById("test-phase-label");
          if (l && /^\d+ tests complets$/.test(txt(l))) l.textContent = TEST_BANK.length + " tests complets";
          return r;
        };
      }
    } catch (e) {}
  }

  function init() {
    injectCss();
    patchThemes();
    fixTestsLabel();
    patchBusiness();
    injectDashCss();
    patchRevision();
    mount("general-content", classifyGeneral);
    mount("lexicon-container", classifyWolof);
    mount("business-content", classifyBusiness);
    mount("test-topic-buttons", classifyList("Test", true, resumeTests));
    mount("pairs-list", classifyList("R\u00e9ponse", true));
    try { if (typeof window.renderRevisionCard === "function") window.renderRevisionCard(); } catch (e) {}
  }

  window.DiisooFocus = { version: 7 };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
