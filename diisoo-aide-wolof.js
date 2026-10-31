/* diisoo-aide-wolof.js : aide vocale en wolof sur chaque menu
   - bouton rond 🔊 en haut a droite : explique l'ecran en wolof
   - chaque bouton de niveau a son 🔊 (dit le nom du niveau sans le choisir)
   - le choix du niveau est dit automatiquement a l'ouverture d'Anglais et de Wolof
   - niveau verrouille : une phrase explique quoi faire */
(function () {
  "use strict";

  var P = {
    menu: "Tànnal li nga bëgg.",
    niveau: "Tànnal sa niveau.",
    debutant: "Yomb.",
    inter: "Digg.",
    avance: "Jafe.",
    verrou: "Jàng ba noppi, nga dem ci kanam.",
    theme: "Tànnal benn thème.",
    micro: "Téyél, wax, bàyyi.",
    annule: "Bàyyi ko ci kaw.",
    bravo: "Baax na !",
    encore: "Jéemaat.",
    passage: "Tontul ñetti laaj ngir dem ci kanam.",
    examen: "Tànnal sa examen.",
    retour: "Dellu ginnaaw."
  };
  window.DiisooAideWolof = { phrases: P };

  var jeton = 0;
  function dire(liste) {
    var mon = ++jeton;
    if (typeof speakWolofOolel !== "function") return;
    (async function () {
      for (var i = 0; i < liste.length; i++) {
        if (mon !== jeton) return;
        try { await speakWolofOolel(liste[i]); } catch (e) { return; }
      }
    })();
  }

  /* CSS */
  var st = document.createElement("style");
  st.textContent =
    "#dii-aide-wolof{position:fixed;top:10px;right:12px;z-index:9998;width:44px;height:44px;border-radius:50%;" +
    "border:0;background:#25D366;color:#fff;font-size:20px;display:none;align-items:center;justify-content:center;" +
    "box-shadow:0 3px 12px rgba(0,0,0,.4)}" +
    "#dii-aide-wolof:active{background:#128C7E}" +
    ".aide-ic{margin-left:auto;flex:0 0 auto;width:40px;height:40px;border-radius:50%;background:#25D366;color:#fff;" +
    "display:flex;align-items:center;justify-content:center;font-size:18px}";
  document.head.appendChild(st);

  var btn = document.createElement("button");
  btn.id = "dii-aide-wolof"; btn.type = "button"; btn.setAttribute("aria-label", "Aide en wolof"); btn.textContent = "🔊";
  document.body.appendChild(btn);

  function visible(id) { var e = document.getElementById(id); return !!(e && e.offsetParent !== null); }
  function pickerVisible(key) { var e = document.getElementById("lvl-" + key); return !!(e && e.style.display !== "none" && e.offsetParent !== null); }

  /* Quelle phrase pour l'ecran actuel ? */
  function phrasesEcran() {
    if (visible("screen-dashboard")) return [P.menu];
    if (visible("screen-general")) return pickerVisible("general") ? [P.niveau] : [P.theme, P.micro];
    if (visible("screen-wolof")) return pickerVisible("wolof") ? [P.niveau] : [P.theme, P.micro];
    if (visible("screen-business")) return [P.theme, P.micro];
    if (visible("screen-test-simulation")) {
      return visible("exam-grid") ? [P.examen] : [P.micro];
    }
    return null;
  }

  btn.onclick = function () { var l = phrasesEcran(); if (l) dire(l); };

  setInterval(function () {
    var l = phrasesEcran();
    btn.style.display = l ? "flex" : "none";
  }, 500);

  /* Bouton 🔊 sur chaque niveau */
  var NIV = [P.debutant, P.inter, P.avance];
  function equiper() {
    var btns = document.querySelectorAll(".lvl-btn");
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      if (b.querySelector(".aide-ic")) continue;
      var idx = Array.prototype.indexOf.call(b.parentNode.querySelectorAll(".lvl-btn"), b);
      var s = document.createElement("span");
      s.className = "aide-ic"; s.textContent = "🔊";
      (function (n) {
        s.addEventListener("click", function (ev) { ev.stopPropagation(); ev.preventDefault(); dire([NIV[n]]); });
      })(idx);
      b.appendChild(s);
    }
  }
  try { new MutationObserver(equiper).observe(document.body, { childList: true, subtree: true }); equiper(); } catch (e) {}

  /* Niveau verrouille : on explique quoi faire */
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest(".lvl-btn.lock");
    if (b && !ev.target.closest(".aide-ic")) dire([P.verrou]);
  }, true);

  /* Parle tout seul a l'ouverture d'un menu (une fois par session) */
  var deja = {};
  function auto(nom, cle, phrases) {
    var o = window[nom];
    if (typeof o !== "function") return;
    window[nom] = function () {
      var r = o.apply(this, arguments);
      if (!deja[cle]) { deja[cle] = true; setTimeout(function () { dire(phrases); }, 500); }
      return r;
    };
  }
  auto("openGeneralModule", "general", [P.niveau]);
  auto("openWolofModule", "wolof", [P.niveau]);
  auto("startTestSimulation", "examens", [P.examen]);

  /* Prepare les voix en arriere-plan pour que la premiere ecoute soit immediate */
  setTimeout(function () {
    try {
      var liste = Object.keys(P).map(function (k) { return P[k]; });
      if (typeof prefetchVoix === "function") prefetchVoix(liste, "wo");
    } catch (e) {}
  }, 6000);
})();
