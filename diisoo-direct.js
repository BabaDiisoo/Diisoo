/* diisoo-direct.js : etape 1
   - supprime l'explication apres inscription
   - Examens et visa : les 6 examens s'affichent directement, un clic lance le test */
(function () {
  "use strict";

  /* 1. Plus d'explication apres inscription (le bouton "Comment ca marche" du menu reste) */
  try { store.set("diisoo_tuto_seen", true); } catch (e) {}

  /* 2. CSS : liste de tests et chips masques, bouton "Commencer" masque, boutons reduits */
  var st = document.createElement("style");
  st.textContent =
    "#exam-tabs,#autres-examens{display:none!important}" +
    "#btn-test-main[data-mode='start']{display:none!important}" +
    "#test-topic-buttons{display:none!important}" +
    "#exam-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}" +
    "#exam-grid button{min-height:56px;padding:8px 10px;text-align:left;border-radius:16px;" +
    "background:#141A2B;border:1px solid #1E2740;color:#F6F1E7;display:flex;align-items:center;gap:8px}" +
    "#exam-grid button:active{border-color:#E1693F}" +
    "#exam-grid .ex-ic{font-size:22px;line-height:1}" +
    "#exam-grid .ex-nm{font-size:13px;font-weight:700;line-height:1.2}";
  document.head.appendChild(st);

  var EXAMS = [
    ["ielts", "IELTS", "🇬🇧", "Visa A1"],
    ["toefl", "TOEFL", "🎓", "Speaking"],
    ["toeic", "TOEIC", "💼", "Speaking"],
    ["cambridge", "Cambridge", "📘", "A2/B1"],
    ["duolingo", "Duolingo", "🦉", "English Test"],
    ["pte", "PTE", "🧪", "Academic"]
  ];

  function lancer(ex, label) {
    try {
      var chip = Array.prototype.slice.call(document.querySelectorAll("#exam-tabs button"))
        .filter(function (b) { return b.textContent === label; })[0];
      if (chip) chip.click();
      if (ex === "ielts") { currentTest = TEST_BANK[0]; }
      else if (window.__examList && window.__examList[0]) { currentTest = window.__examList[0]; }
      renderTestPicker();
      runTest();
    } catch (e) { console.warn("[diisoo] direct", e); }
  }

  function monterGrille() {
    var picker = document.getElementById("test-picker");
    if (!picker) return;
    var g = document.getElementById("exam-grid");
    if (!g) {
      g = document.createElement("div");
      g.id = "exam-grid";
      EXAMS.forEach(function (e) {
        var b = document.createElement("button");
        b.type = "button";
        b.innerHTML = '<span class="ex-ic">' + e[2] + '</span><span class="ex-nm">' + e[1] +
          '<br><span style="font-size:10px;font-weight:400;color:#A69C86">' + e[3] + "</span></span>";
        b.onclick = function () { lancer(e[0], e[1]); };
        g.appendChild(b);
      });
      picker.insertBefore(g, picker.firstChild);
    }
  }

  var orig = window.startTestSimulation;
  if (typeof orig === "function") {
    window.startTestSimulation = function () {
      var r = orig.apply(this, arguments);
      try { monterGrille(); } catch (e) {}
      return r;
    };
  }
})();
