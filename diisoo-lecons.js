/* diisoo-lecons.js v1 : lecons epurees (carte mot empilee, actions secondaires sous "Plus", themes sans prefixe) */
(function () {
  "use strict";
  var st = document.createElement("style");
  st.textContent =
    ".fx-em>.flex.justify-between.items-start{flex-direction:column!important;align-items:flex-start!important;gap:3px!important}" +
    ".fx-em>.flex.justify-between.items-start>p:first-child{font-size:24px!important;font-weight:800!important;line-height:1.15!important;color:#F6F1E7!important}" +
    ".fx-em>.flex.justify-between.items-start .text-right{text-align:left!important}" +
    ".fx-em>.flex.justify-between.items-start .text-right>p:first-child{font-size:16px!important;color:#C9BFA8!important}" +
    ".fx-em .dl-sec{display:none!important}" +
    ".fx-em.dl-on .dl-sec{display:block!important}" +
    ".fx-em .dl-plus{width:100%;min-height:40px;border-radius:12px;border:1px solid #1E2740;background:transparent;color:#A69C86;font-size:13px;font-weight:700}";
  document.head.appendChild(st);

  function carte(c) {
    var ex = c.querySelector(".dl-plus");
    var sec = [];
    Array.prototype.forEach.call(c.children, function (e) {
      var t = (e.textContent || "").trim();
      if (e.tagName === "BUTTON" && (/^🎓\s*Coach vocal/.test(t) || e.classList.contains("as-btn"))) sec.push(e);
    });
    sec = sec.filter(function (e) { return !e.classList.contains("dl-sec"); });
    if (!sec.length) return;
    sec.forEach(function (e) { e.classList.add("dl-sec"); });
    if (ex) return;
    var p = document.createElement("button");
    p.type = "button"; p.className = "dl-plus"; p.textContent = "⋯ Plus";
    p.onclick = function () { var on = c.classList.toggle("dl-on"); p.textContent = on ? "▴ Moins" : "⋯ Plus"; };
    c.insertBefore(p, sec[0]);
  }
  function themes() {
    Array.prototype.forEach.call(document.querySelectorAll("#screen-general button,#screen-wolof button"), function (b) {
      var n = b.firstChild;
      var m = n && n.nodeType === 3 && /^(N\d\s·\s)/.exec(n.nodeValue);
      if (m) { var sp = document.createElement("span"); sp.style.display = "none"; sp.textContent = m[1]; n.nodeValue = n.nodeValue.slice(m[1].length); b.insertBefore(sp, n); }
    });
  }
  function passe() {
    Array.prototype.forEach.call(document.querySelectorAll(".fx-em"), carte);
    themes();
  }
  var plan = false;
  try {
    new MutationObserver(function () { if (plan) return; plan = true; setTimeout(function () { plan = false; try { passe(); } catch (e) {} }, 60); })
      .observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
  passe();
})();
