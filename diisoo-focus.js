/* Diisoo : mode "une carte a la fois" (Anglais General, Anglais Wolof, Outils Business).
 * Un seul element visible a la fois. Passage automatique apres une bonne reponse.
 * Aucun acces a localStorage ni IndexedDB. Desactivation : retirer la ligne <script> dans index.html,
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
    return { hidden: pre, keep: keep, steps: steps, key: txt(vocs[0]).slice(0, 40) + "|" + vocs.length, anchor: keep[0] || null };
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
    return { hidden: [], keep: keep, steps: steps, key: txt(cards[0]).slice(0, 40) + "|" + cards.length, anchor: keep[keep.length - 1] || null };
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
    return { hidden: [], keep: keep, steps: steps, key: txt(steps[0].els[steps[0].els.length - 1]).slice(0, 40) + "|" + steps.length, anchor: keep[0] || null };
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
        if (!same) { cur = 0; doneMap = {}; }
        steps = c.steps;
        compact = steps.length >= COMPACT_FROM;
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

  function init() {
    injectCss();
    mount("general-content", classifyGeneral);
    mount("lexicon-container", classifyWolof);
    mount("business-content", classifyBusiness);
  }

  window.DiisooFocus = { version: 2 };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
