/* diisoo-direct.js v2 : Examens et visa en 2 etapes
   - supprime l'explication apres inscription
   - Etape 1 : les 6 examens en grille
   - Etape 2 : les tests de l'examen choisi, numerotes (fait, Premium), avec un gros bouton "Continuer" */
(function () {
  "use strict";

  /* Plus d'explication apres inscription (le bouton "Comment ca marche" du menu reste) */
  try { store.set("diisoo_tuto_seen", true); } catch (e) {}

  var st = document.createElement("style");
  st.textContent =
    "#exam-tabs,#autres-examens{display:none!important}" +
    "#btn-test-main[data-mode='start']{display:none!important}" +
    "#test-topic-buttons{display:none!important}" +
    "#exam-grid,#exam-tests .et-grille{display:grid;gap:10px}" +
    "#exam-grid{grid-template-columns:1fr 1fr}" +
    "#exam-grid button{min-height:60px;padding:8px 10px;text-align:left;border-radius:16px;" +
    "background:#141A2B;border:1px solid #1E2740;color:#F6F1E7;display:flex;align-items:center;gap:8px}" +
    "#exam-grid button:active{border-color:#E1693F}" +
    "#exam-grid .ex-ic{font-size:24px;line-height:1}" +
    "#exam-grid .ex-nm{font-size:14px;font-weight:700;line-height:1.2}" +
    "#exam-tests .et-titre{text-align:center;font-size:13px;font-weight:700;color:#C9BFA8;margin:2px 0 8px}" +
    "#exam-tests .et-retour{width:100%;min-height:38px;padding:6px 12px;margin-bottom:8px;background:#141A2B;border:1px solid #1E2740;" +
    "border-radius:12px;color:#E4DCC9;font-size:12px;font-weight:700;text-align:left}" +
    "#exam-tests .et-suite{width:100%;min-height:62px;margin-bottom:12px;padding:10px 14px;border-radius:18px;border:0;" +
    "background:#25D366;color:#fff;font-size:16px;font-weight:800;text-align:left}" +
    "#exam-tests .et-suite small{display:block;font-size:12px;font-weight:600;opacity:.9;margin-top:2px}" +
    "#exam-tests .et-grille{grid-template-columns:repeat(5,1fr)}" +
    "#exam-tests .et-t{position:relative;min-height:56px;border-radius:14px;background:#141A2B;border:1px solid #1E2740;" +
    "color:#F6F1E7;font-size:17px;font-weight:800}" +
    "#exam-tests .et-t.fait{background:#12351F;border-color:#25D366}" +
    "#exam-tests .et-t.prem{opacity:.6}" +
    "#exam-tests .et-t i{position:absolute;top:2px;right:4px;font-style:normal;font-size:11px}" +
    "#exam-tests .et-leg{text-align:center;font-size:11px;color:#8C8064;margin-top:10px}";
  document.head.appendChild(st);

  var EXAMS = [
    ["ielts", "IELTS", "🇬🇧", "Visa A1"],
    ["toefl", "TOEFL", "🎓", "Speaking"],
    ["toeic", "TOEIC", "💼", "Speaking"],
    ["cambridge", "Cambridge", "📘", "A2/B1"],
    ["duolingo", "Duolingo", "🦉", "English Test"],
    ["pte", "PTE", "🧪", "Academic"]
  ];

  function $(id) { return document.getElementById(id); }
  function vus() {
    var o = {};
    try { (store.get("diisoo_tests") || []).forEach(function (h) { if (h && h.topic) o[h.topic] = 1; }); } catch (e) {}
    return o;
  }

  function listeTests(ex) {
    try { if (ex === "ielts") return TEST_BANK; } catch (e) {}
    return window.__examList || [];
  }

  function montrerEtape1() {
    var g = $("exam-grid"), t = $("exam-tests");
    if (g) g.style.display = "";
    if (t) t.style.display = "none";
  }

  function lancerTest(i) {
    var boutons = document.querySelectorAll("#test-topic-buttons > button");
    if (boutons[i]) boutons[i].click();
  }

  function montrerEtape2(ex, nom) {
    var picker = $("test-picker");
    if (!picker) return;
    var g = $("exam-grid");
    if (g) g.style.display = "none";
    var box = $("exam-tests");
    if (!box) { box = document.createElement("div"); box.id = "exam-tests"; picker.insertBefore(box, picker.firstChild); }
    box.style.display = "";
    box.innerHTML = "";

    var liste = listeTests(ex), seen = vus();
    var boutons = document.querySelectorAll("#test-topic-buttons > button");

    var back = document.createElement("button");
    back.type = "button"; back.className = "et-retour"; back.textContent = "‹ Changer d'examen";
    back.onclick = montrerEtape1;
    box.appendChild(back);

    var titre = document.createElement("div");
    titre.className = "et-titre"; titre.textContent = nom + " : " + liste.length + " tests";
    box.appendChild(titre);

    /* Test suivant : le premier non fait et ouvert */
    var suite = -1, premier = -1;
    liste.forEach(function (t, i) {
      var verrou = boutons[i] && /^\s*⭐/.test(boutons[i].textContent);
      if (!verrou && premier < 0) premier = i;
      if (!verrou && !seen[t.topic] && suite < 0) suite = i;
    });
    var cible = suite >= 0 ? suite : premier;
    if (cible >= 0) {
      var c = document.createElement("button");
      c.type = "button"; c.className = "et-suite";
      c.innerHTML = "▶ " + (suite >= 0 ? "Continuer" : "Refaire") + "<small>Test " + (cible + 1) + " : " + String(liste[cible].topic).replace(/</g, "&lt;") + "</small>";
      c.onclick = function () { lancerTest(cible); };
      box.appendChild(c);
    }

    var grille = document.createElement("div");
    grille.className = "et-grille";
    liste.forEach(function (t, i) {
      var verrou = boutons[i] && /^\s*⭐/.test(boutons[i].textContent);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "et-t" + (seen[t.topic] ? " fait" : "") + (verrou ? " prem" : "");
      b.innerHTML = (i + 1) + (seen[t.topic] ? "<i>✅</i>" : (verrou ? "<i>⭐</i>" : ""));
      b.setAttribute("aria-label", "Test " + (i + 1) + " : " + t.topic);
      b.onclick = function () { lancerTest(i); };
      grille.appendChild(b);
    });
    box.appendChild(grille);

    var leg = document.createElement("div");
    leg.className = "et-leg"; leg.textContent = "✅ fait   ⭐ Premium";
    box.appendChild(leg);
  }

  function choisirExamen(ex, nom) {
    try {
      var chip = Array.prototype.slice.call(document.querySelectorAll("#exam-tabs button"))
        .filter(function (b) { return b.textContent === nom; })[0];
      if (chip) chip.click();
      if (ex === "ielts") { currentTest = TEST_BANK[0]; renderTestPicker(); }
      montrerEtape2(ex, nom);
    } catch (e) { console.warn("[diisoo] direct", e); }
  }

  function monterGrille() {
    var picker = $("test-picker");
    if (!picker) return;
    var g = $("exam-grid");
    if (!g) {
      g = document.createElement("div");
      g.id = "exam-grid";
      EXAMS.forEach(function (e) {
        var b = document.createElement("button");
        b.type = "button";
        b.innerHTML = '<span class="ex-ic">' + e[2] + '</span><span class="ex-nm">' + e[1] +
          '<br><span style="font-size:11px;font-weight:400;color:#A69C86">' + e[3] + "</span></span>";
        b.onclick = function () { choisirExamen(e[0], e[1]); };
        g.appendChild(b);
      });
      picker.insertBefore(g, picker.firstChild);
    }
    montrerEtape1();
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
