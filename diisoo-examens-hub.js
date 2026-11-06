/* diisoo-examens-hub.js v1 : nouveau hub "Examens & visa" (remplace l'ancien simulateur) */
(function () {
  "use strict";
  var CSS =
    "#screen-test-simulation:not(.hidden) #test-phase-label,#screen-test-simulation:not(.hidden) #test-topic-label{display:none!important}" +
    "#screen-test-simulation.xh-on>div:first-child{display:none!important}" +
    "#screen-test-simulation.xh-on #test-picker>*:not(#xh-hub){display:none!important}" +
    "#screen-test-simulation.xh-on>div.flex-1{padding-top:4px!important;padding-bottom:4px!important;justify-content:flex-start!important}" +
    "#screen-test-simulation.xh-on>div:last-child{display:none!important}" +
    "#xh-hub{display:flex;flex-direction:column;gap:8px}" +
    "#xh-hub h2{font-size:19px;font-weight:800;color:#F6F1E7;margin:2px 0 0}" +
    "#xh-hub .xh-s{font-size:12.5px;color:#A69C86;margin:0 0 2px}" +
    "#xh-hub .xh-g{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
    "#xh-hub button{text-align:left;border-radius:16px;border:1px solid #1E2740;background:#141A2B;color:#F6F1E7;display:flex;align-items:center;gap:10px;padding:8px 10px;min-height:56px}" +
    "#xh-hub button:active{border-color:#E1693F}" +
    "#xh-hub .xh-i{font-size:24px;line-height:1}" +
    "#xh-hub .xh-n{font-size:14px;font-weight:800;line-height:1.15}" +
    "#xh-hub .xh-n small{display:block;font-size:12px;font-weight:500;color:#A69C86;margin-top:1px}" +
    "#xh-hub .xh-big{min-height:64px;border:2px solid #F0906B;background:linear-gradient(135deg,#C2542D,#E1693F);box-shadow:0 6px 18px rgba(226,105,63,.3)}" +
    "#xh-hub .xh-big .xh-n small{color:#FFE7DA}" +
    "#xh-hub .xh-biz{border-color:#25D366}" +
    "#xh-hub .xh-l{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#F0906B;margin-top:2px}" +
    "#xh-hub .xh-d{font-size:12px;color:#8C8064;text-align:center;line-height:1.35;margin-top:2px}";
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  var EX = [
    ["ielts", "🇬🇧", "IELTS", "Visa A1"], ["toefl", "🎓", "TOEFL", "Speaking"],
    ["toeic", "💼", "TOEIC", "Speaking"], ["duolingo", "🦉", "Duolingo", "English Test"],
    ["cambridge_a2", "📘", "Cambridge A2", "Key"], ["cambridge_b1", "📗", "Cambridge B1", "Preliminary"],
    ["pte", "🧪", "PTE", "Academic"], ["business", "🎯", "Business", "Simulation pro"]
  ];
  function ouv(k) { try { window.DiisooExams2.ouvrir(k); } catch (e) { console.warn("[diisoo] hub", e); } }
  function btn(cls, ic, nm, sm, fn) {
    var b = document.createElement("button"); b.type = "button"; if (cls) b.className = cls;
    b.innerHTML = '<span class="xh-i">' + ic + '</span><span class="xh-n">' + nm + (sm ? "<small>" + sm + "</small>" : "") + "</span>";
    b.onclick = fn; return b;
  }
  function monter() {
    var s = document.getElementById("screen-test-simulation"), p = document.getElementById("test-picker");
    if (!s || !p) return;
    s.classList.add("xh-on");
    var h = document.getElementById("xh-hub");
    if (h) { return; }
    h = document.createElement("div"); h.id = "xh-hub";
    h.innerHTML = "<h2>Examens &amp; visa</h2><p class='xh-s'>Format réel, avec ta voix. Choisis ton examen.</p>";
    var big = btn("xh-big", "🛂", "Entretien visa", "Simule l'entretien consulaire", function () {
      try { generalThemeId = "visa"; openGeneralModule(); } catch (e) {}
    });
    h.appendChild(big);
    var g = document.createElement("div"); g.className = "xh-g";
    EX.forEach(function (e) { g.appendChild(btn(e[0] === "business" ? "xh-biz" : "", e[1], e[2], e[3], function () { ouv(e[0]); })); });
    h.appendChild(g);
    var l = document.createElement("div"); l.className = "xh-l"; l.textContent = "S'entraîner avant"; h.appendChild(l);
    var g2 = document.createElement("div"); g2.className = "xh-g";
    g2.appendChild(btn("", "🤝", "Oral", "En binôme", function () { try { openPairsModule(); } catch (e) {} }));
    g2.appendChild(btn("", "👂", "Écoute", "Comprendre", function () { try { openListeningModule(); } catch (e) {} }));
    h.appendChild(g2);
    var q = btn("", "⬅️", "Retour à l'accueil", "", function () { try { quitTest(); } catch (e) {} });
    q.style.minHeight = "44px"; h.appendChild(q);
    var d = document.createElement("div"); d.className = "xh-d";
    d.textContent = "Préparation indépendante. Diisoo n'est pas affilié aux organismes d'examen."; h.appendChild(d);
    p.insertBefore(h, p.firstChild);
  }
  var o = window.startTestSimulation;
  if (typeof o === "function") window.startTestSimulation = function () {
    var r = o.apply(this, arguments); try { monter(); } catch (e) {} return r;
  };
})();
