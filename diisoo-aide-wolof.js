/* diisoo-aide-wolof.js v3 : aide vocale en wolof sur chaque etape
   - parle tout seul UNE SEULE FOIS par etape (menu, niveau, theme, mots, examens), ensuite seul le bouton 🔊 repete
   - ta voix d'abord : si la phrase est enregistree avec l'outil #enregistrer-voix, c'est elle qui est lue (instantane)
   - sinon la voix generee de l'app est utilisee
   - si le telephone bloque le son, le bouton 🔊 clignote et une bulle affiche la phrase
   - bouton rond 🔊 en haut a droite : repete l'aide a tout moment */
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
    test: "Tànnal benn test.",
    retour: "Dellu ginnaaw."
  };
  var FR = {
    menu: "Choisis ce que tu veux.", niveau: "Choisis ton niveau.", debutant: "Facile (Débutant).",
    inter: "Moyen (Intermédiaire).", avance: "Difficile (Avancé).", verrou: "Étudie d'abord, puis avance.",
    theme: "Choisis un thème.", micro: "Maintiens, parle, relâche.", annule: "Glisse pour annuler.",
    bravo: "Bravo !", encore: "Réessaie.", passage: "Réponds aux questions pour passer.",
    examen: "Choisis ton examen.", test: "Choisis un test.", retour: "Retour."
  };
  window.DiisooAideWolof = { phrases: P };

  /* Les phrases apparaissent dans l'outil d'enregistrement #enregistrer-voix (les plus courtes en premier) */
  try {
    if (typeof WOLOF_EXTRA === "object" && WOLOF_EXTRA) {
      WOLOF_EXTRA.__aide = Object.keys(P).map(function (k) { return { wo: P[k], fr: FR[k], en: "" }; });
    }
  } catch (e) {}

  /* ---------- lecture ---------- */
  var jeton = 0, cur = null;
  function arreter() { try { if (cur) { cur.onended = null; cur.onerror = null; cur.pause(); } } catch (e) {} cur = null; }

  function lireURL(url, jt) {
    return new Promise(function (resolve) {
      arreter();
      var a = new Audio(url);
      a.setAttribute("playsinline", "");
      cur = a;
      a.onended = function () { resolve(true); };
      a.onerror = function () { resolve(false); };
      var p = a.play();
      if (p && p.catch) p.catch(function () { if (jt === jeton) pulser(true); resolve(false); });
    });
  }

  async function jouerUne(phrase, jt) {
    try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
    try {
      if (window.voixHumaine) {
        var url = await window.voixHumaine.url(phrase);
        if (jt !== jeton) return false;
        if (url) { var ok = await lireURL(url, jt); if (ok) return true; }
      }
    } catch (e) {}
    if (jt !== jeton) return false;
    if (typeof speakWolofOolel === "function") {
      try { var r = await speakWolofOolel(phrase); return r !== false; } catch (e) { return false; }
    }
    return false;
  }

  function dire(liste) {
    var mon = ++jeton;
    pulser(false);
    (async function () {
      for (var i = 0; i < liste.length; i++) {
        if (mon !== jeton) return;
        legende(liste[i]);
        await jouerUne(liste[i], mon);
      }
    })();
  }

  /* ---------- interface ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#dii-aide-wolof{position:fixed;top:10px;right:12px;z-index:9998;width:44px;height:44px;border-radius:50%;" +
    "border:0;background:#25D366;color:#fff;font-size:20px;display:none;align-items:center;justify-content:center;" +
    "box-shadow:0 3px 12px rgba(0,0,0,.4)}" +
    "#dii-aide-wolof:active{background:#128C7E}" +
    "#dii-aide-wolof.pulse{animation:diipulse 1s infinite}" +
    "@keyframes diipulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(37,211,102,.7)}50%{transform:scale(1.12);box-shadow:0 0 0 12px rgba(37,211,102,0)}}" +
    "#dii-aide-bulle{position:fixed;top:60px;right:12px;z-index:9998;max-width:72vw;background:#1F2C34;color:#fff;" +
    "padding:8px 12px;border-radius:14px;font-size:13px;line-height:1.3;display:none;box-shadow:0 3px 12px rgba(0,0,0,.4)}" +
    "#dii-aide-bulle small{display:block;color:#A8B8C0;font-size:11px;margin-top:2px}" +
    ".aide-ic{margin-left:auto;flex:0 0 auto;width:44px;height:44px;border-radius:50%;background:#25D366;color:#fff;" +
    "display:flex;align-items:center;justify-content:center;font-size:20px}";
  document.head.appendChild(st);

  var btn = document.createElement("button");
  btn.id = "dii-aide-wolof"; btn.type = "button"; btn.setAttribute("aria-label", "Aide en wolof"); btn.textContent = "🔊";
  document.body.appendChild(btn);
  var bulle = document.createElement("div");
  bulle.id = "dii-aide-bulle";
  document.body.appendChild(bulle);

  var tBulle = null;
  function legende(phrase) {
    var cle = null;
    Object.keys(P).forEach(function (k) { if (P[k] === phrase) cle = k; });
    bulle.innerHTML = phrase.replace(/</g, "&lt;") + (cle ? "<small>" + FR[cle] + "</small>" : "");
    bulle.style.display = "block";
    clearTimeout(tBulle);
    tBulle = setTimeout(function () { bulle.style.display = "none"; }, 3500);
  }
  function pulser(on) { btn.classList.toggle("pulse", !!on); }

  function visible(id) { var e = document.getElementById(id); return !!(e && e.offsetParent !== null); }
  function pickerVisible(key) { var e = document.getElementById("lvl-" + key); return !!(e && e.style.display !== "none" && e.offsetParent !== null); }

  /* Quelle aide pour l'etape actuelle ? */
  function phrasesEcran() {
    if (visible("dii-passage")) return { sig: "passage", l: [P.passage] };
    if (visible("screen-dashboard")) return { sig: "menu", l: [P.menu] };
    if (visible("screen-general") || visible("screen-wolof")) {
      var key = visible("screen-general") ? "general" : "wolof";
      if (pickerVisible(key)) return { sig: key + ":niveau", l: [P.niveau] };
      if (document.getElementById("step-" + key)) return { sig: key + ":theme", l: [P.theme] };
      return { sig: key + ":mots", l: [P.micro] };
    }
    if (visible("screen-business")) {
      if (pickerVisible("business")) return { sig: "business:niveau", l: [P.niveau] };
      return visible("business-content") ? { sig: "biz:mots", l: [P.micro] } : { sig: "biz:theme", l: [P.theme] };
    }
    if (visible("screen-test-simulation")) {
      if (visible("exam-grid")) return { sig: "exam:liste", l: [P.examen] };
      if (visible("exam-tests")) return { sig: "exam:tests", l: [P.test] };
      return { sig: "exam:live", l: [P.micro] };
    }
    return null;
  }

  btn.onclick = function () { montreJusqua = Date.now() + 6000; pulser(false); var e = phrasesEcran(); try { localStorage.setItem("diisoo_aide_vu", "1"); } catch (x) {} if (e) dire(e.l); };

  /* ---------- declenchement automatique ---------- */
  var geste = 0;
  ["pointerdown", "touchstart", "click", "keydown"].forEach(function (ev) {
    window.addEventListener(ev, function () { geste = Date.now(); }, true);
  });
  var MAXAUTO = 1;
  function compteurs() { try { return JSON.parse(localStorage.getItem("diisoo_aide_n") || "{}") || {}; } catch (e) { return {}; } }
  function ecrire(o) { try { localStorage.setItem("diisoo_aide_n", JSON.stringify(o)); } catch (e) {} }

  var derniere = "", montreJusqua = 0;
  function surcouche() { var e = document.getElementById("screen-premium"); return !!(e && !e.classList.contains("hidden")); }
  setInterval(function () {
    var e = phrasesEcran();
    if (e && surcouche()) e = null;
    /* le bouton ne reste pas affiche en permanence : 10 s a chaque nouvel ecran (20 s s'il clignote), puis il disparait */
    btn.style.display = (e && Date.now() < montreJusqua) ? "flex" : "none";
    if (!e) { derniere = ""; return; }
    if (e.sig === derniere) return;
    derniere = e.sig;
    montreJusqua = Date.now() + 10000;
    var recent = Date.now() - geste < 3000;
    var c = compteurs(), n = c[e.sig] || 0;
    if (e.sig === "passage") return;
    if (recent && n < MAXAUTO) {
      c[e.sig] = n + 1; ecrire(c);
      var sig = e.sig;
      setTimeout(function () { var x = phrasesEcran(); if (x && x.sig === sig) dire(x.l); }, 250);
    } else if (!recent) {
      /* pas de geste recent (ouverture de l'app) : le navigateur bloque le son, on attire l'oeil */
      var vu = false; try { vu = !!localStorage.getItem("diisoo_aide_vu"); } catch (x) {}
      if (!vu || n < MAXAUTO) { pulser(true); montreJusqua = Date.now() + 20000; }
    }
  }, 350);

  /* ---------- 🔊 sur chaque niveau ---------- */
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

  /* Niveau verrouille (si le test de passage n'est pas charge) */
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest(".lvl-btn.lock");
    if (b && !ev.target.closest(".aide-ic")) dire([P.verrou]);
  }, true);

  /* Prepare les voix en arriere-plan pour que la premiere ecoute soit immediate */
  setTimeout(function () {
    try {
      var liste = Object.keys(P).map(function (k) { return P[k]; });
      if (typeof prefetchVoix === "function") prefetchVoix(liste, "wo");
    } catch (e) {}
  }, 6000);

  window.DiisooAideWolof.dire = function (cle) { if (P[cle]) dire([P[cle]]); };
})();
