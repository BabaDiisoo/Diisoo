/* diisoo-b2.js : morceau 2/6 du bundle. Généré, ne pas modifier à la main. */
try{
/* ---- diisoo-orga.js ---- */
/* diisoo-orga.js v2 : organisation des menus, un choix a la fois
   Anglais et Wolof : Niveau, puis Theme, puis Mots (3 etapes, une decision par ecran).
   Cartes de mots : Wolof, English, Francais bien separes, boutons numerotes 1, 2, 3.
   Business et Examens : grille propre, pas de doublon. Wikidata retire des themes. */
(function () {
  "use strict";

  /* Neutralise l'ancien diisoo-menus.js s'il est encore charge */
  try {
    var olds = document.querySelectorAll("style");
    for (var i = 0; i < olds.length; i++) {
      if (olds[i].textContent.indexOf("#business-picker{display:grid") >= 0) olds[i].remove();
    }
  } catch (e) {}

  var st = document.createElement("style");
  st.textContent =
    /* Barres de niveau de l'ancien systeme et textes parasites */
    "#tierbar-general,#tierbar-wolof,#tierbar-business,#tierbar-ielts{display:none!important}" +
    "#test-picker>p{display:none!important}" +
    /* Grilles : 2 colonnes alignees, aucun defilement lateral */
    "#general-tabs,#wolof-tabs,#business-tabs{display:grid!important;grid-template-columns:1fr 1fr;gap:8px;" +
    "overflow:visible!important;padding:0!important;margin:8px 0 0!important}" +
    "#general-tabs>*,#wolof-tabs>*,#business-tabs>*{margin:0!important;width:100%;min-height:48px;" +
    "padding:6px 10px!important;font-size:13px!important;line-height:1.2;text-align:left;" +
    "white-space:normal!important;border-radius:14px!important;box-sizing:border-box}" +
    "#general-content,#lexicon-container,#business-content{max-height:none!important;overflow:visible!important}" +
    "#general-tabs.lvl-hide,#wolof-tabs.lvl-hide,#general-content.lvl-hide,#lexicon-container.lvl-hide,.lvl-hide{display:none!important}" +
    /* Choix du niveau */
    ".lvl-picker{display:flex;flex-direction:column;gap:10px}" +
    ".lvl-title{text-align:center;font-size:14px;font-weight:700;color:#F6F1E7;margin:4px 0}" +
    ".lvl-btn{display:flex;align-items:center;gap:12px;width:100%;min-height:68px;padding:10px 14px;" +
    "background:#141A2B;border:1px solid #1E2740;border-radius:16px;color:#F6F1E7;text-align:left}" +
    ".lvl-btn:active{border-color:#E1693F}" +
    ".lvl-btn.lock{opacity:.6}" +
    ".lvl-ic{font-size:28px;line-height:1}" +
    ".lvl-nm{font-size:15px;font-weight:800;line-height:1.2}" +
    ".lvl-sub{font-size:11px;color:#A69C86;font-weight:400;margin-top:2px}" +
    ".lvl-back{width:100%;min-height:38px;padding:6px 12px;margin-bottom:6px;background:#10251A;border:1px solid #3FAE74;" +
    "border-radius:12px;color:#5FC98F;font-size:12px;font-weight:700;text-align:left}" +
    ".lvl-back.th{background:#141A2B;border-color:#1E2740;color:#E4DCC9}" +
    ".lvl-step{text-align:center;font-size:12px;font-weight:700;color:#C9BFA8;margin:6px 0 0}" +
    /* Cartes de mots (Anglais Wolof) : trois blocs bien separes */
    "#lexicon-container>.fx-em{padding:16px!important}" +
    "#lexicon-container>.fx-em>div:first-of-type{display:flex!important;flex-direction:column;gap:12px}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:first-child{display:contents}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:last-child{order:2;text-align:left!important}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:first-child>p:first-child{order:1;font-size:26px!important;line-height:1.15!important;margin:0}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:first-child>p:last-child{order:3;font-size:14px!important;color:#A69C86!important;margin:0}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:last-child>p{font-size:26px!important;line-height:1.15!important;margin:0}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:first-child>p:first-child::before{content:'\\1F1F8\\1F1F3  WOLOF';display:block;font-size:11px;letter-spacing:.12em;font-weight:700;color:#5FC98F;margin-bottom:2px}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:last-child>p::before{content:'\\1F1EC\\1F1E7  ENGLISH';display:block;font-size:11px;letter-spacing:.12em;font-weight:700;color:#A69C86;margin-bottom:2px}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:first-child>p:last-child::before{content:'\\1F1EB\\1F1F7  '}" +
    "#lexicon-container>.fx-em>.grid{grid-template-columns:1fr 1fr 1fr!important;gap:10px!important}" +
    "#lexicon-container .grid>button.dii-b:nth-child(1)::before{content:'1'}" +
    "#lexicon-container .grid>button.dii-b:nth-child(2)::before{content:'2'}" +
    "#lexicon-container .grid>button.dii-b:nth-child(3)::before{content:'3'}" +
    "#lexicon-container .grid>button.dii-b::before{position:absolute;top:6px;left:8px;width:18px;height:18px;border-radius:50%;" +
    "background:rgba(255,255,255,.18);font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center}" +
    /* Boutons : icone au-dessus, mot en dessous, identiques partout */
    "button.dii-b[data-practice]{position:relative;display:flex!important;flex-direction:column;align-items:center;justify-content:center;" +
    "gap:3px;min-height:68px!important;padding:8px 4px!important;border-radius:16px!important;font-size:11px!important;line-height:1.1;text-align:center}" +
    "button.dii-b[data-practice] .dii-i{font-size:26px;line-height:1}" +
    "button.dii-b[data-practice] .dii-c{font-weight:700}" +
    "button.dii-b[data-practice] .dii-x{display:none}" +
    "button.dii-b[data-practice]:disabled{opacity:.45}";
  document.head.appendChild(st);

  var NAMES = ["Débutant", "Intermédiaire", "Avancé"];
  var ICONS = ["🌱", "🌿", "🌳"];
  var KEYS = {
    general: { tabs: "general-tabs", content: "general-content", unit: "thèmes" },
    wolof: { tabs: "wolof-tabs", content: "lexicon-container", unit: "thèmes" }
  };
  var lvl = { general: null, wolof: null };

  function $(id) { return document.getElementById(id); }
  function unlocked(key) { try { return tierState()[key].unlocked || 1; } catch (e) { return 1; } }
  function levelOf(key, b, i, n) {
    if (key === "general") { var m = /N([123])\b/.exec(b.textContent); return m ? +m[1] : 1; }
    return Math.min(3, Math.floor(i / Math.ceil(n / 3)) + 1);
  }

  function filtrer(key) {
    var c = KEYS[key], box = $(c.tabs);
    if (!box) return;
    var items = Array.prototype.slice.call(box.children), n = items.length;
    items.forEach(function (b, i) {
      b.dataset.lvl = levelOf(key, b, i, n);
      b.disabled = false; b.style.pointerEvents = ""; b.style.opacity = "";
      var tag = b.querySelector(".tier-lock-tag"); if (tag) tag.remove();
      b.style.display = (lvl[key] === null || +b.dataset.lvl === lvl[key]) ? "" : "none";
    });
  }

  /* Remplace l'ancien verrouillage par points : plus de cadenas par bouton */
  window.applyTierLocks = function (key) {
    if (key === "general" || key === "wolof") { filtrer(key); return; }
    var bar = $("tierbar-" + key); if (bar) bar.remove();
    if (key === "ielts") {
      try {
        Array.prototype.forEach.call($("test-topic-buttons").children, function (b) {
          b.disabled = false; b.style.pointerEvents = ""; b.style.opacity = "";
        });
      } catch (e) {}
    }
  };

  /* Wikidata : donnees brutes non validees, retirees de l'affichage des apprenants */
  var orw = window.renderWolofTabs;
  if (typeof orw === "function") {
    window.renderWolofTabs = function () {
      var r = orw.apply(this, arguments);
      try {
        Array.prototype.slice.call($("wolof-tabs").children).forEach(function (b) {
          if (/^\s*(🔒\s*)?Wikidata\s*$/.test(b.textContent)) b.remove();
        });
        filtrer("wolof");
      } catch (e) {}
      return r;
    };
  }

  function retirer(id) { var e = $(id); if (e) e.remove(); }
  function haut() { try { window.scrollTo(0, 0); } catch (e) {} }

  /* ---------- Etape 0 : choix du niveau ---------- */
  function afficherPicker(key) {
    var c = KEYS[key], box = $(c.tabs), content = $(c.content);
    if (!box) return;
    lvl[key] = null; filtrer(key);
    var counts = [0, 0, 0];
    Array.prototype.forEach.call(box.children, function (b) { counts[+b.dataset.lvl - 1]++; });
    var p = $("lvl-" + key);
    if (!p) { p = document.createElement("div"); p.id = "lvl-" + key; p.className = "lvl-picker"; box.parentNode.insertBefore(p, box); }
    p.innerHTML = "";
    var t = document.createElement("p"); t.className = "lvl-title"; t.textContent = "Étape 1 : choisis ton niveau"; p.appendChild(t);
    var un = unlocked(key);
    [1, 2, 3].forEach(function (L) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "lvl-btn" + (L > un ? " lock" : "");
      b.innerHTML = '<span class="lvl-ic">' + (L > un ? "🔒" : ICONS[L - 1]) + '</span><span><span class="lvl-nm">' +
        NAMES[L - 1] + '</span><br><span class="lvl-sub">' + (L > un ? "Test de passage" : "✅ Ouvert") + " · " + counts[L - 1] + " " + c.unit + "</span></span>";
      b.onclick = function () { choisir(key, L); };
      p.appendChild(b);
    });
    p.style.display = "";
    box.classList.add("lvl-hide");
    if (content) content.classList.add("lvl-hide");
    retirer("lvlback-" + key); retirer("thbar-" + key); retirer("step-" + key);
    haut();
  }

  /* ---------- Etape 1 : choix du theme ---------- */
  function afficherThemes(key, L) {
    var c = KEYS[key], box = $(c.tabs), content = $(c.content);
    lvl[key] = L;
    $("lvl-" + key).style.display = "none";
    filtrer(key);
    box.classList.remove("lvl-hide");
    if (content) content.classList.add("lvl-hide");
    retirer("lvlback-" + key); retirer("thbar-" + key); retirer("step-" + key);
    var back = document.createElement("button");
    back.type = "button"; back.id = "lvlback-" + key; back.className = "lvl-back";
    back.textContent = ICONS[L - 1] + " " + NAMES[L - 1] + " : changer de niveau";
    back.onclick = function () { afficherPicker(key); };
    box.parentNode.insertBefore(back, box);
    var s = document.createElement("p");
    s.id = "step-" + key; s.className = "lvl-step"; s.textContent = "Étape 2 : choisis ton thème";
    box.parentNode.insertBefore(s, box);
    haut();
  }

  /* ---------- Etape 2 : les mots ---------- */
  function afficherLecon(key, titre) {
    var c = KEYS[key], box = $(c.tabs), content = $(c.content);
    if (lvl[key] === null) return;
    box.classList.add("lvl-hide");
    if (content) content.classList.remove("lvl-hide");
    retirer("step-" + key); retirer("thbar-" + key);
    var th = document.createElement("button");
    th.type = "button"; th.id = "thbar-" + key; th.className = "lvl-back th";
    th.textContent = "📚 " + titre + " : changer de thème";
    th.onclick = function () { afficherThemes(key, lvl[key]); };
    box.parentNode.insertBefore(th, box);
    haut();
  }

  function choisir(key, L) {
    if (L > unlocked(key)) {
      try { toast("🔒 Termine d'abord le niveau " + NAMES[L - 2]); } catch (e) {}
      return;
    }
    afficherThemes(key, L);
  }

  /* Toucher un theme : on passe a l'etape 3 */
  ["general", "wolof"].forEach(function (key) {
    var box = $(KEYS[key].tabs);
    if (!box) return;
    box.addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest("button");
      if (!b || b.parentNode !== box) return;
      var titre = b.textContent.trim().replace(/^🔒\s*/, "");
      setTimeout(function () { if (lvl[key] !== null) afficherLecon(key, titre); }, 0);
    }, true);
  });

  /* ---------- Boutons des cartes : icone en haut, mot en bas ---------- */
  var LIB = "🎤 Maintiens pour parler";
  function esc(s) { return String(s).replace(/[&<>"']/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]; }); }
  function formater(root) {
    var list = root.querySelectorAll("button[data-practice]:not(.dii-b)");
    for (var i = 0; i < list.length; i++) {
      var b = list[i], t = (b.textContent || "").trim();
      var m = /^(🔊|🎤)\s+(.+)$/.exec(t);
      if (!m) continue;
      var cap = esc(m[2]);
      if (t === LIB) cap = 'Maintiens<span class="dii-x"> pour parler</span>';
      b.innerHTML = '<span class="dii-i">' + m[1] + '</span> <span class="dii-c">' + cap + "</span>";
      b.classList.add("dii-b");
    }
  }
  var plan = false;
  function planifier() {
    if (plan) return; plan = true;
    requestAnimationFrame(function () {
      plan = false;
      ["lexicon-container", "general-content", "business-content"].forEach(function (id) { var e = $(id); if (e) formater(e); });
    });
  }
  try {
    new MutationObserver(planifier).observe(document.body, { childList: true, subtree: true });
    planifier();
  } catch (e) {}

  var TXT = {
    general: "Écoute, répète, puis teste-toi.",
    wolof: "Écoute le wolof, répète en anglais.",
    business: "Choisis ton secteur."
  };
  function titre(screen, key) {
    try { var p = document.querySelector("#" + screen + ">div:first-child p"); if (p) p.textContent = TXT[key]; } catch (e) {}
  }

  function envelopper(nom, key) {
    var o = window[nom];
    if (typeof o !== "function") return;
    window[nom] = function () {
      var r = o.apply(this, arguments);
      try { titre(key === "general" ? "screen-general" : key === "wolof" ? "screen-wolof" : "screen-business", key); if (KEYS[key]) afficherPicker(key); } catch (e) { console.warn("[diisoo] orga", e); }
      return r;
    };
  }
  envelopper("openGeneralModule", "general");
  envelopper("openWolofModule", "wolof");
  envelopper("openBusinessModule", "business");

  window.DiisooOrga = { version: 2, niveau: function (k) { return lvl[k]; }, picker: afficherPicker };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-orga.js",e);}

try{
/* ---- diisoo-wamic.js ---- */
/* diisoo-wamic.js : etape 3
   Bouton micro identique au vocal WhatsApp :
   - maintenir = enregistrer, relacher = envoyer
   - glisser vers la gauche = annuler
   - chrono visible, vibration, couleur verte, meme libelle partout */
(function () {
  "use strict";
  var RX = /^\s*practice(GeneralWord|BusinessPhrase|Word)\(/;
  var holdBtn = null, startX = 0, t0 = 0, timer = null, cancelled = false, pill = null;

  /* CSS */
  var st = document.createElement("style");
  st.textContent =
    "[data-practice][onclick^='practice']{background:#25D366!important;color:#fff!important;min-height:40px;" +
    "border-radius:999px!important;font-size:11px!important;font-weight:700!important}" +
    "[data-practice][onclick^='practice'].mic-pulsing-whatsapp{background:#128C7E!important;transform:scale(1.04)}" +
    "#wa-pill{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:9999;display:none;" +
    "align-items:center;gap:10px;background:#1F2C34;color:#fff;padding:10px 16px;border-radius:999px;" +
    "font-size:13px;box-shadow:0 4px 16px rgba(0,0,0,.45);white-space:nowrap}" +
    "#wa-pill .dot{width:10px;height:10px;border-radius:50%;background:#F44336;animation:wablink 1s infinite}" +
    "#wa-pill.annule{background:#B3261E}" +
    "@keyframes wablink{0%,100%{opacity:1}50%{opacity:.25}}";
  document.head.appendChild(st);

  function monterPill() {
    if (pill) return pill;
    pill = document.createElement("div");
    pill.id = "wa-pill";
    pill.innerHTML = '<span class="dot"></span><span id="wa-time">0:00</span><span id="wa-hint">‹ Glisse pour annuler</span>';
    document.body.appendChild(pill);
    return pill;
  }
  function fmt(ms) { var s = Math.floor(ms / 1000); return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60); }
  function vib(n) { try { if (navigator.vibrate) navigator.vibrate(n); } catch (e) {} }

  function arreterUI() {
    clearInterval(timer); timer = null;
    if (pill) { pill.style.display = "none"; pill.classList.remove("annule"); }
  }

  /* Annulation : le resultat de la reconnaissance est jete */
  var osl = window.startListening;
  if (typeof osl === "function") {
    window.startListening = function () {
      var h = osl.apply(this, arguments);
      if (!h || !h.promise) return h;
      var p = h.promise;
      h.promise = p.then(function (r) {
        if (window.__waCancel) { window.__waCancel = false; try { toast("Annulé"); } catch (e) {} return { text: "", error: "cancelled" }; }
        return r;
      });
      return h;
    };
  }

  document.addEventListener("pointerdown", function (ev) {
    var b = ev.target.closest && ev.target.closest("[data-practice]");
    if (!b || b.disabled || holdBtn) return;
    if (!RX.test(b.getAttribute("onclick") || "")) return;
    holdBtn = b; startX = ev.clientX; t0 = Date.now(); cancelled = false; window.__waCancel = false;
    var p = monterPill();
    p.classList.remove("annule");
    document.getElementById("wa-time").textContent = "0:00";
    document.getElementById("wa-hint").textContent = "‹ Glisse pour annuler";
    p.style.display = "flex";
    clearInterval(timer);
    timer = setInterval(function () { document.getElementById("wa-time").textContent = fmt(Date.now() - t0); }, 200);
    vib(30);
  }, { capture: true });

  document.addEventListener("pointermove", function (ev) {
    if (!holdBtn || cancelled) return;
    if (ev.clientX - startX < -80) {
      cancelled = true;
      window.__waCancel = true;
      if (pill) { pill.classList.add("annule"); document.getElementById("wa-hint").textContent = "Annulé"; }
      vib([20, 40, 20]);
      /* declenche le relachement du systeme existant (arret immediat du micro) */
      document.dispatchEvent(new Event("pointerup"));
    }
  }, { capture: true, passive: true });

  ["pointerup", "pointercancel", "touchend", "touchcancel"].forEach(function (t) {
    document.addEventListener(t, function () {
      if (!holdBtn) return;
      holdBtn = null;
      if (!cancelled) vib(15);
      setTimeout(arreterUI, cancelled ? 500 : 0);
    }, { capture: true, passive: true });
  });

  /* Meme libelle partout */
  var LIB = "🎤 Maintiens pour parler";
  function uniformiser(root) {
    var list = (root || document).querySelectorAll("[data-practice][onclick^='practice']");
    for (var i = 0; i < list.length; i++) {
      var b = list[i];
      if (RX.test(b.getAttribute("onclick") || "") && b.textContent !== LIB) b.textContent = LIB;
    }
  }
  try {
    new MutationObserver(function () { uniformiser(document); })
      .observe(document.body, { childList: true, subtree: true });
    uniformiser(document);
  } catch (e) {}
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-wamic.js",e);}

try{
/* ---- diisoo-aide-wolof.js ---- */
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

}catch(e){console.error("Diisoo : erreur dans diisoo-aide-wolof.js",e);}

try{
/* ---- diisoo-biz.js ---- */
/* diisoo-biz.js v1 : Business range comme Anglais et Wolof
   Etape 1 : choisir son niveau (Debutant, Intermediaire, Avance), les niveaux fermes ouvrent le test de passage
   Etape 2 : choisir son secteur (+ Anglais des marches)
   Etape 3 : les phrases de CE niveau seulement, une carte a la fois */
(function () {
  "use strict";

  var NAMES = ["Débutant", "Intermédiaire", "Avancé"];
  var ICONS = ["🌱", "🌿", "🌳"];
  var CODES = ["debutant", "intermediaire", "avance"];
  var L = null, sect = null, marches = false;

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function haut() { try { window.scrollTo(0, 0); } catch (e) {} }
  function unlocked() { try { return tierState().business.unlocked || 1; } catch (e) { return 1; } }
  function secteurs() {
    try {
      var o = window.DIISOO_ORDRE_TOURISME || [], r = function (k) { var i = o.indexOf(k); return i < 0 ? 99 : i; };
      return Object.keys(BUSINESS_SECTORS).filter(function (k) { return CHINA_TRADE_WOLOF[k] && CHINA_TRADE_WOLOF[k].vocab.length; })
        .sort(function (a, b) { return r(a) - r(b); });
    } catch (e) { return []; }
  }
  function items(k, niv) {
    var out = [];
    CHINA_TRADE_WOLOF[k].vocab.forEach(function (v, i) { if (v.niveau === CODES[niv - 1]) out.push({ v: v, i: i }); });
    return out;
  }
  function total(niv) { var n = 0; secteurs().forEach(function (k) { n += items(k, niv).length; }); return n; }

  var st = document.createElement("style");
  st.textContent =
    "#business-picker,#btn-business-back{display:none!important}" +
    "#business-tabs,#business-tabs.biz-off{display:none!important}" +
    "#biz-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}" +
    "#biz-grid button{display:flex;align-items:center;gap:8px;min-height:64px;padding:8px 10px;border-radius:14px;" +
    "background:#141A2B;border:1px solid #1E2740;color:#F6F1E7;text-align:left}" +
    "#biz-grid button:active{border-color:#E1693F}" +
    "#biz-grid .bz-ic{font-size:24px;line-height:1}" +
    "#biz-grid .bz-nm{font-size:13px;font-weight:700;line-height:1.2}" +
    "#biz-grid .bz-n{display:block;font-size:11px;font-weight:400;color:#A69C86;margin-top:2px}" +
    "body:has(#screen-business:not(.hidden)) [role=main]{min-height:0!important;padding:60px 14px 10px!important;justify-content:flex-start!important}" +
    "body:has(#bizback-sec) #screen-business>div.text-center{display:none!important}" +
    "body:has(#bizstep) #screen-business>div.text-center,body:has(#bizstep) #fx-biz-btn,body:has(#bizback-sec) #fx-biz-btn,body:has(#bizback-sec) #bizback-lvl,body:has(#bizback-sec) #secteurs-zone{display:none!important}" +
    "body:has(#bizback-sec) #screen-business:not(.hidden){display:flex;flex-direction:row;flex-wrap:wrap;gap:8px;align-content:flex-start;margin:0!important}" +
    "body:has(#bizback-sec) #screen-business>*{flex:0 0 100%;margin:0!important}" +
    "body:has(#bizback-sec) #dsn-btn-business,body:has(#bizback-sec) #dcv-btn-business{flex:1 1 calc(50% - 4px)!important;min-width:0;padding:6px 8px!important;font-size:13px!important;line-height:1.15!important;min-height:44px;width:auto!important}" +
    "body:has(#bizstep) #screen-business,body:has(#bizback-lvl) #screen-business{margin:0!important}" +
    "body:has(#screen-business:not(.hidden)):has(#bizback-sec) [role=main]{padding-top:4px!important}" +
    "body:has(#bizback-sec) #business-content .fx-lab{display:none}" +
    "body:has(#bizback-sec) #business-content .fx-nav{padding:0}" +
    "body:has(#bizback-sec) #business-content [data-practice]{min-height:0!important;height:auto!important;padding:6px 8px!important;display:flex!important;flex-direction:row!important;align-items:center;justify-content:center;gap:8px}" +
    "body:has(#bizback-sec) #business-content [data-practice] .dii-i{font-size:18px!important;line-height:1!important;margin:0!important;width:auto!important;height:auto!important}" +
    "body:has(#bizback-sec) #business-content [data-practice] .dii-c{font-size:13.5px!important;margin:0!important}" +
    "body:has(#bizback-sec) #business-content .as-btn{min-height:0!important;padding:8px!important}" +
    "body:has(#bizback-sec) #business-content>div.bg-\\[\\#141A2B\\]{padding:10px!important}" +
    "#business-content{max-height:none!important;overflow:visible!important}";
  document.head.appendChild(st);

  function ancre() { return $("business-picker"); }
  function retirer(id) { var e = $(id); if (e) e.remove(); }
  function nettoyer() {
    retirer("biz-grid"); retirer("bizback-lvl"); retirer("bizback-sec"); retirer("bizstep");
    var c = $("business-content"); if (c) { c.classList.add("hidden"); c.innerHTML = ""; }
    var v = $("secteurs-vue"); if (v) { v.classList.add("hidden"); v.innerHTML = ""; }
    var r = $("secteurs-retour"); if (r) r.classList.add("hidden");
  }
  function insererAvant(el) { var a = ancre(); if (a && a.parentNode) a.parentNode.insertBefore(el, a); }
  function barre(id, texte, cls, fn) {
    var b = document.createElement("button");
    b.type = "button"; b.id = id; b.className = "lvl-back " + (cls || "");
    b.textContent = texte; b.onclick = fn;
    insererAvant(b);
  }

  /* ---------- Etape 1 : niveau ---------- */
  function niveaux() {
    L = null; sect = null; marches = false;
    nettoyer();
    var p = $("lvl-business");
    if (!p) { p = document.createElement("div"); p.id = "lvl-business"; p.className = "lvl-picker"; insererAvant(p); }
    p.innerHTML = "";
    var t = document.createElement("p"); t.className = "lvl-title"; t.textContent = "Étape 1 : choisis ton niveau"; p.appendChild(t);
    var un = unlocked();
    [1, 2, 3].forEach(function (n) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "lvl-btn" + (n > un ? " lock" : "");
      b.innerHTML = '<span class="lvl-ic">' + (n > un ? "🔒" : ICONS[n - 1]) + '</span><span><span class="lvl-nm">' + NAMES[n - 1] +
        '</span><br><span class="lvl-sub">' + (n > un ? "Test de passage" : "✅ Ouvert") + " · " + total(n) + " phrases</span></span>";
      b.onclick = function () { if (n <= un) liste(n); };
      p.appendChild(b);
    });
    p.style.display = "";
    haut();
  }

  /* ---------- Etape 2 : secteur (le tourisme est UN secteur, ses métiers sont dedans) ---------- */
  function estTour(k) { return /^tour_/.test(k); }
  function tuile(ic, nom, sous, fn, cls) {
    var b = document.createElement("button");
    b.type = "button"; if (cls) b.className = cls;
    b.innerHTML = '<span class="bz-ic">' + ic + '</span><span class="bz-nm">' + esc(nom) + '<span class="bz-n">' + esc(sous) + "</span></span>";
    b.onclick = fn; return b;
  }
  function liste(n) {
    L = n; sect = null; marches = false;
    nettoyer();
    var p = $("lvl-business"); if (p) p.style.display = "none";
    barre("bizback-lvl", ICONS[n - 1] + " " + NAMES[n - 1] + " : changer de niveau", "", niveaux);
    var s = document.createElement("p"); s.id = "bizstep"; s.className = "lvl-step"; s.textContent = "Étape 2 : choisis ton secteur";
    insererAvant(s);
    var g = document.createElement("div"); g.id = "biz-grid";
    var nbT = 0;
    secteurs().forEach(function (k) {
      var nb = items(k, n).length;
      if (!nb) return;
      if (estTour(k)) { nbT += nb; return; }
      g.appendChild(tuile(BUSINESS_SECTORS[k].icon, BUSINESS_SECTORS[k].titre, nb + " phrases", function () { lecon(k); }));
    });
    if (nbT) g.appendChild(tuile("🏝️", "Tourisme", nbT + " phrases", function () { tourisme(n); }, "bz-t"));
    if (marchesDispo()) g.appendChild(tuile("🛒", "Anglais des marchés", "4 marchés", ouvrirMarches, "bz-m"));
    insererAvant(g);
    haut();
  }
  function tourisme(n) {
    L = n; sect = null; marches = false;
    nettoyer();
    barre("bizback-lvl", "🏝️ Tourisme : changer de secteur", "", function () { liste(n); });
    var s = document.createElement("p"); s.id = "bizstep"; s.className = "lvl-step"; s.textContent = "Tourisme : choisis ton métier";
    insererAvant(s);
    var g = document.createElement("div"); g.id = "biz-grid";
    secteurs().forEach(function (k) {
      if (!estTour(k)) return;
      var nb = items(k, n).length; if (!nb) return;
      g.appendChild(tuile(BUSINESS_SECTORS[k].icon, BUSINESS_SECTORS[k].titre, nb + " phrases", function () { lecon(k); }));
    });
    insererAvant(g);
    haut();
  }

  /* ---------- Etape 3 : les phrases du niveau ---------- */
  function lecon(k) {
    sect = k; marches = false;
    retirer("biz-grid"); retirer("bizstep"); retirer("bizback-sec");
    barre("bizback-sec", BUSINESS_SECTORS[k].icon + " " + BUSINESS_SECTORS[k].titre + " : changer de secteur", "th", function () { if (estTour(k)) tourisme(L); else liste(L); });
    try { businessModule = k; } catch (e) {}
    var mod = CHINA_TRADE_WOLOF[k], liste1 = items(k, L);
    try {
      var dl = BUSINESS_DIALOGUES[k] || [];
      prefetchVoix(liste1.map(function (x) { return x.v.wo; }).concat(dl.map(function (l) { return l.wo; })), "wo");
      prefetchVoix(liste1.map(function (x) { return x.v.en; }).concat(dl.map(function (l) { return l.en; })), "en");
    } catch (e) {}
    var box = $("business-content");
    box.classList.remove("hidden");
    var html = '<h4 class="text-sm font-bold text-[#F6F1E7] text-center">' + esc(mod.title) + " · " + NAMES[L - 1] + "</h4>";
    var vb = null;
    if (L > 1 && liste1.length && typeof verrouBiz === "function") { try { vb = verrouBiz(mod, liste1[0].v, liste1[0].i); } catch (e) { vb = null; } }
    if (vb) html += vb;
    else {
      liste1.forEach(function (x) {
        var v = x.v, i = x.i;
        html += '<div class="bg-[#141A2B] border border-[#1E2740] rounded-xl p-3 space-y-1">' +
          '<p class="text-sm font-semibold text-[#F6F1E7]">' + esc(v.en) + "</p>" +
          '<p class="text-xs text-[#A69C86]">' + esc(v.fr) + "</p>" +
          (v.wo ? '<p class="text-xs text-[#5FC98F] italic">🗣️ ' + esc(v.wo) + "</p>" : "") +
          '<div class="grid grid-cols-2 gap-2 mt-1">' +
          '<button data-biz="en" data-sec="' + k + '" data-i="' + i + '" data-practice="biz-en:' + k + ":" + i + '" data-gate="0" class="py-2 bg-[#1E2740] hover:bg-[#2A3454] rounded-lg text-[11px] font-semibold">🔊 English</button>' +
          (v.wo ? '<button data-biz="wo" data-sec="' + k + '" data-i="' + i + '" data-practice="biz-wo:' + k + ":" + i + '" data-gate="0" class="py-2 bg-[#1E2740] hover:bg-[#2A3454] rounded-lg text-[11px] font-semibold">🔊 Wolof</button>' : "") +
          "</div>" +
          '<button onclick="practiceBusinessPhrase(\'' + k + "'," + i + ')" data-practice="biz:' + k + ":" + i + '" class="mt-1 w-full py-2 bg-[#1E2740] hover:bg-[#2A3454] rounded-lg text-[11px] font-semibold">🎤 M\'entraîner</button>' +
          '<p id="biz-res-' + k + "-" + i + '" class="text-[11px] text-[#A69C86]">👂 Écoute d\'abord l\'anglais, puis entraîne-toi.</p>' +
          "</div>";
      });
      if (L >= 2 && BUSINESS_DIALOGUES[k] && BUSINESS_DIALOGUES[k].length && typeof renderBusinessDialogue === "function") html += renderBusinessDialogue(k);
    }
    box.innerHTML = html;
    try { refreshPracticeButtons(); } catch (e) {}
    haut();
  }

  /* ---------- Anglais des marches (module existant, ouvert via l'onglet cache) ---------- */
  function ongletMarches() {
    var t = $("business-tabs");
    if (!t) return null;
    return Array.prototype.slice.call(t.children).filter(function (b) { return /Anglais des march/i.test(b.textContent); })[0] || null;
  }
  function marchesDispo() { return !!(ongletMarches() || $("secteurs-ouvrir")); }
  function ouvrirMarches() {
    marches = true;
    retirer("biz-grid"); retirer("bizstep"); retirer("bizback-sec");
    var bc = $("business-content"); if (bc) { bc.classList.add("hidden"); bc.innerHTML = ""; }
    barre("bizback-sec", "🛒 Anglais des marchés : changer de secteur", "th", function () { liste(L || 1); });
    var o = ongletMarches();
    if (o) o.click(); else { var x = $("secteurs-ouvrir"); if (x) x.click(); }
    var r = $("secteurs-retour"); if (r) r.classList.add("hidden");
    haut();
  }

  /* ---------- entree dans Business ---------- */
  var orig = window.openBusinessModule;
  if (typeof orig === "function") {
    window.openBusinessModule = function () {
      var r = orig.apply(this, arguments);
      try {
        var a = ancre(); if (a) a.classList.add("hidden");
        niveaux();
      } catch (e) { console.warn("[diisoo] biz", e); }
      return r;
    };
  }

  window.DiisooBiz = { version: 1, niveau: function () { return L; }, secteur: function () { return sect; } };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-biz.js",e);}

try{
/* ---- diisoo-biz-plus.js ---- */
/* diisoo-biz-plus.js v1 : Business enrichi
   1) plus de vocabulaire dans les 6 secteurs existants (débutant, intermédiaire, avancé)
   2) 7 nouveaux secteurs touristiques : Hôtel, Restaurant, Guide, Taxi, Artisanat, Agence de voyage, Plage
   Le wolof des nouvelles lignes est une première version à faire valider par un locuteur natif ; une ligne sans wolof n'affiche que l'anglais et le français. */
(function () {
  "use strict";
  if (window.__diisooBizPlus) return;
  var C, S, DL;
  try { C = CHINA_TRADE_WOLOF; S = BUSINESS_SECTORS; DL = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !S || !DL) return;
  window.__diisooBizPlus = true;
  var AJOUTS = {"colobane": [{"en": "Do you have this part in stock?", "fr": "Avez-vous cette pièce en stock ?", "niveau": "debutant", "wo": "Ndax am nga pièce bii ci stock bi ?"}, {"en": "Which car is it for?", "fr": "C'est pour quelle voiture ?", "niveau": "debutant", "wo": "Ban oto la ?"}, {"en": "I need an oil filter", "fr": "Il me faut un filtre à huile", "niveau": "debutant", "wo": "Dama soxla filtre à huile."}, {"en": "Please make the price lower", "fr": "Baissez un peu le prix, s'il vous plaît", "niveau": "debutant", "wo": "Wàññil ma njëg gi tuuti, bu la neexee."}, {"en": "Is this part compatible with a 2010 Corolla?", "fr": "Cette pièce est-elle compatible avec une Corolla 2010 ?", "niveau": "intermediaire", "wo": "Ndax pièce bii dafa méngoo ak Corolla 2010 ?"}, {"en": "Can you check the part number for me?", "fr": "Pouvez-vous vérifier le numéro de la pièce ?", "niveau": "intermediaire"}, {"en": "I buy ten units. What is your best price?", "fr": "J'en achète dix. Quel est votre dernier prix ?", "niveau": "intermediaire"}, {"en": "Is the warranty valid for six months?", "fr": "La garantie est-elle valable six mois ?", "niveau": "intermediaire"}, {"en": "The part you sold me does not fit. I would like an exchange.", "fr": "La pièce que vous m'avez vendue ne va pas. Je voudrais un échange.", "niveau": "avance"}, {"en": "Can you supply twenty sets of brake pads every month?", "fr": "Pouvez-vous fournir vingt jeux de plaquettes chaque mois ?", "niveau": "avance"}, {"en": "I want a written invoice with the warranty terms.", "fr": "Je veux une facture écrite avec les conditions de garantie.", "niveau": "avance"}, {"en": "If I pay in cash today, will you include delivery?", "fr": "Si je paie comptant aujourd'hui, la livraison est-elle comprise ?", "niveau": "avance"}], "sandaga": [{"en": "Can I try it on?", "fr": "Puis-je l'essayer ?", "niveau": "debutant", "wo": "Mën naa ko sol ?"}, {"en": "Do you have this in another colour?", "fr": "Avez-vous ceci dans une autre couleur ?", "niveau": "debutant", "wo": "Ndax am nga ko ci beneen melo ?"}, {"en": "It is too small", "fr": "C'est trop petit", "niveau": "debutant", "wo": "Dafa tuuti lool."}, {"en": "It is too big", "fr": "C'est trop grand", "niveau": "debutant", "wo": "Dafa mag lool."}, {"en": "How many metres of fabric do I need for a dress?", "fr": "Combien de mètres de tissu faut-il pour une robe ?", "niveau": "intermediaire"}, {"en": "Is this wax fabric real or a copy?", "fr": "Ce pagne wax est-il authentique ou une copie ?", "niveau": "intermediaire"}, {"en": "Do you give a discount for six pieces?", "fr": "Faites-vous une remise pour six pièces ?", "niveau": "intermediaire"}, {"en": "Does the colour fade when I wash it?", "fr": "La couleur déteint-elle au lavage ?", "niveau": "intermediaire"}, {"en": "I would like to order fifty shirts in three sizes.", "fr": "Je voudrais commander cinquante chemises en trois tailles.", "niveau": "avance"}, {"en": "What is the delivery time for a large order?", "fr": "Quel est le délai de livraison pour une grosse commande ?", "niveau": "avance"}, {"en": "Can you put my shop name on the labels?", "fr": "Pouvez-vous mettre le nom de ma boutique sur les étiquettes ?", "niveau": "avance"}, {"en": "I want to pay half now and half on delivery.", "fr": "Je veux payer la moitié maintenant et la moitié à la livraison.", "niveau": "avance"}], "electronique": [{"en": "Does it work with a Senegalese plug?", "fr": "Est-ce que ça marche avec une prise sénégalaise ?", "niveau": "debutant"}, {"en": "Is it new or second-hand?", "fr": "Est-il neuf ou d'occasion ?", "niveau": "debutant"}, {"en": "How much is the screen protector?", "fr": "Combien coûte le verre de protection ?", "niveau": "debutant"}, {"en": "Can I test it before I pay?", "fr": "Puis-je le tester avant de payer ?", "niveau": "debutant"}, {"en": "How much memory does this phone have?", "fr": "Quelle est la mémoire de ce téléphone ?", "niveau": "intermediaire"}, {"en": "Is it unlocked for all networks?", "fr": "Est-il débloqué pour tous les réseaux ?", "niveau": "intermediaire"}, {"en": "Does it come with a one-year warranty?", "fr": "Est-il vendu avec un an de garantie ?", "niveau": "intermediaire"}, {"en": "The battery drains very fast. Can you check it?", "fr": "La batterie se vide très vite. Pouvez-vous la vérifier ?", "niveau": "intermediaire"}, {"en": "I am a reseller. What is your wholesale price for twenty phones?", "fr": "Je suis revendeur. Quel est votre prix de gros pour vingt téléphones ?", "niveau": "avance"}, {"en": "Can you show me the original box and the IMEI number?", "fr": "Pouvez-vous me montrer la boîte d'origine et le numéro IMEI ?", "niveau": "avance"}, {"en": "Which after-sales service do you offer?", "fr": "Quel service après-vente proposez-vous ?", "niveau": "avance"}, {"en": "I want a refund because the device is defective.", "fr": "Je veux un remboursement car l'appareil est défectueux.", "niveau": "avance"}], "bazar": [{"en": "How much is this chair?", "fr": "Combien coûte cette chaise ?", "niveau": "debutant", "wo": "Ñaata la chaise bii ?"}, {"en": "Do you have a bigger table?", "fr": "Avez-vous une table plus grande ?", "niveau": "debutant"}, {"en": "I want to see the mattress", "fr": "Je veux voir le matelas", "niveau": "debutant", "wo": "Bëgg naa gis matela bi."}, {"en": "Can you deliver it today?", "fr": "Pouvez-vous le livrer aujourd'hui ?", "niveau": "debutant"}, {"en": "What are the dimensions of the wardrobe?", "fr": "Quelles sont les dimensions de l'armoire ?", "niveau": "intermediaire"}, {"en": "Is assembly included in the price?", "fr": "Le montage est-il compris dans le prix ?", "niveau": "intermediaire"}, {"en": "Can I pay in three instalments?", "fr": "Puis-je payer en trois fois ?", "niveau": "intermediaire"}, {"en": "Do you have this sofa in stock or must I wait?", "fr": "Ce canapé est-il en stock ou dois-je attendre ?", "niveau": "intermediaire"}, {"en": "I am furnishing a guesthouse. What discount can you offer for ten beds?", "fr": "J'équipe une maison d'hôtes. Quelle remise pour dix lits ?", "niveau": "avance"}, {"en": "Can you build the cupboard to my measurements?", "fr": "Pouvez-vous fabriquer le placard à mes mesures ?", "niveau": "avance"}, {"en": "The delivery was late and the table is scratched.", "fr": "La livraison était en retard et la table est rayée.", "niveau": "avance"}, {"en": "I need a quotation with delivery to Saint-Louis.", "fr": "J'ai besoin d'un devis avec livraison à Saint-Louis.", "niveau": "avance"}], "agriculture": [{"en": "How much is a kilo of tomatoes?", "fr": "Combien coûte un kilo de tomates ?", "niveau": "debutant", "wo": "Ñaata la kilo tomaat ?"}, {"en": "Are these vegetables fresh?", "fr": "Ces légumes sont-ils frais ?", "niveau": "debutant"}, {"en": "I want a bag of onions", "fr": "Je veux un sac d'oignons", "niveau": "debutant", "wo": "Bëgg naa benn sak soble."}, {"en": "Is the price per kilo or per bag?", "fr": "Le prix est-il au kilo ou au sac ?", "niveau": "debutant"}, {"en": "When is the harvest season?", "fr": "Quand est la saison de la récolte ?", "niveau": "intermediaire"}, {"en": "Do you sell directly from the farm?", "fr": "Vendez-vous directement depuis la ferme ?", "niveau": "intermediaire"}, {"en": "How many hectares do you cultivate?", "fr": "Combien d'hectares cultivez-vous ?", "niveau": "intermediaire"}, {"en": "Can you deliver to the market before six in the morning?", "fr": "Pouvez-vous livrer au marché avant six heures du matin ?", "niveau": "intermediaire"}, {"en": "I want to sign a supply contract for the whole season.", "fr": "Je veux signer un contrat d'approvisionnement pour toute la saison.", "niveau": "avance"}, {"en": "What are your quality standards for export?", "fr": "Quelles sont vos normes de qualité pour l'export ?", "niveau": "avance"}, {"en": "How do you keep the produce cool during transport?", "fr": "Comment gardez-vous les produits au frais pendant le transport ?", "niveau": "avance"}, {"en": "The price depends on the rain this year.", "fr": "Le prix dépend de la pluie cette année.", "niveau": "avance"}], "chine": [{"en": "Where is the nearest customs office?", "fr": "Où est le bureau de douane le plus proche ?", "niveau": "debutant"}, {"en": "How long does the shipping take?", "fr": "Combien de temps dure l'expédition ?", "niveau": "debutant"}, {"en": "I need a tracking number", "fr": "J'ai besoin d'un numéro de suivi", "niveau": "debutant"}, {"en": "Can you send me photos of the goods?", "fr": "Pouvez-vous m'envoyer des photos de la marchandise ?", "niveau": "debutant"}, {"en": "What is the minimum order quantity?", "fr": "Quelle est la quantité minimale de commande ?", "niveau": "intermediaire"}, {"en": "Is the price FOB or CIF?", "fr": "Le prix est-il FOB ou CIF ?", "niveau": "intermediaire"}, {"en": "Can you arrange the packing list and the invoice?", "fr": "Pouvez-vous préparer la liste de colisage et la facture ?", "niveau": "intermediaire"}, {"en": "How much is the sea freight for one container?", "fr": "Combien coûte le fret maritime pour un conteneur ?", "niveau": "intermediaire"}, {"en": "I would like to inspect the goods before they are shipped.", "fr": "Je voudrais inspecter la marchandise avant l'expédition.", "niveau": "avance"}, {"en": "Who is responsible if the container is damaged?", "fr": "Qui est responsable si le conteneur est endommagé ?", "niveau": "avance"}, {"en": "Please confirm the payment terms in writing.", "fr": "Veuillez confirmer les conditions de paiement par écrit.", "niveau": "avance"}, {"en": "The shipment is held at the port. What documents are missing?", "fr": "L'expédition est bloquée au port. Quels documents manquent ?", "niveau": "avance"}]};
  var TOUR = {"tour_hotel": {"icon": "🏨", "titre": "Hôtel & Accueil", "sous": "Réception, chambres, plaintes, séjours.", "fond": "#14203A", "title": "🏨 Hôtel & Accueil", "vocab": [{"en": "Welcome to our hotel", "fr": "Bienvenue dans notre hôtel", "niveau": "debutant", "wo": "Dalal ak jàmm ci sunu hôtel."}, {"en": "Do you have a reservation?", "fr": "Avez-vous une réservation ?", "niveau": "debutant", "wo": "Ndax am nga réservation ?"}, {"en": "Your room is on the second floor", "fr": "Votre chambre est au deuxième étage", "niveau": "debutant"}, {"en": "Here is your key", "fr": "Voici votre clé", "niveau": "debutant", "wo": "Kle bi nii."}, {"en": "Breakfast is from seven to ten", "fr": "Le petit déjeuner est de sept à dix heures", "niveau": "debutant"}, {"en": "The Wi-Fi password is on the card", "fr": "Le mot de passe du Wi-Fi est sur la carte", "niveau": "debutant"}, {"en": "How many nights will you stay?", "fr": "Combien de nuits restez-vous ?", "niveau": "debutant", "wo": "Ñaata guddi ngay def fii ?"}, {"en": "A single room or a double room?", "fr": "Une chambre simple ou une chambre double ?", "niveau": "intermediaire"}, {"en": "The price includes breakfast and taxes", "fr": "Le prix comprend le petit déjeuner et les taxes", "niveau": "intermediaire"}, {"en": "Check-out is at noon", "fr": "Le départ se fait à midi", "niveau": "intermediaire"}, {"en": "I can store your luggage until the evening", "fr": "Je peux garder vos bagages jusqu'au soir", "niveau": "intermediaire"}, {"en": "Would you like air conditioning or a fan?", "fr": "Voulez-vous la climatisation ou un ventilateur ?", "niveau": "intermediaire"}, {"en": "We can arrange an airport transfer for you", "fr": "Nous pouvons organiser votre transfert depuis l'aéroport", "niveau": "intermediaire"}, {"en": "Please fill in this registration form", "fr": "Veuillez remplir cette fiche d'enregistrement", "niveau": "intermediaire"}, {"en": "I am sorry for the inconvenience. We will change your room immediately.", "fr": "Désolé pour le désagrément. Nous changeons votre chambre tout de suite.", "niveau": "avance"}, {"en": "The hot water is not working. Could you send someone?", "fr": "L'eau chaude ne marche pas. Pouvez-vous envoyer quelqu'un ?", "niveau": "avance"}, {"en": "We are fully booked, but I can offer you a room at our sister hotel.", "fr": "Nous sommes complets, mais je peux vous proposer une chambre dans notre hôtel partenaire.", "niveau": "avance"}, {"en": "For a stay of seven nights, I can offer a ten percent discount.", "fr": "Pour sept nuits, je peux vous accorder dix pour cent de remise.", "niveau": "avance"}, {"en": "Could you recommend a quiet restaurant nearby?", "fr": "Pouvez-vous me recommander un restaurant calme à proximité ?", "niveau": "avance"}, {"en": "The cancellation is free up to forty-eight hours before arrival.", "fr": "L'annulation est gratuite jusqu'à quarante-huit heures avant l'arrivée.", "niveau": "avance"}, {"en": "I would like to leave a review about your excellent service.", "fr": "Je voudrais laisser un avis sur votre excellent service.", "niveau": "avance"}], "dlg": [{"role": "client", "wo": "Salaamaleekum, am naa benn réservation.", "fr": "Bonjour, j'ai une réservation.", "en": "Good evening, I have a reservation."}, {"role": "marchand", "wo": "Dalal ak jàmm. Ban tur la ?", "fr": "Bienvenue. À quel nom ?", "en": "Welcome. What is the name, please?"}, {"role": "client", "wo": "Tur wi Smith la, ñaar guddi.", "fr": "Smith, pour deux nuits.", "en": "Smith, for two nights."}, {"role": "marchand", "wo": "Waaw, gis naa ko. Néeg bi ci étage bi ñaareel la.", "fr": "Oui, je le vois. Votre chambre est au deuxième étage.", "en": "Yes, I can see it. Your room is on the second floor."}, {"role": "client", "wo": "Ndax petit déjeuner bi dafa bokk ?", "fr": "Le petit déjeuner est-il compris ?", "en": "Is breakfast included?"}, {"role": "marchand", "wo": "Waaw, dafa bokk. Mu tàmbali ci juróom-ñaar.", "fr": "Oui, il est compris. Il commence à sept heures.", "en": "Yes, it is included. It starts at seven."}, {"role": "client", "wo": "Jërëjëf lool.", "fr": "Merci beaucoup.", "en": "Thank you very much."}, {"role": "marchand", "wo": "Amul solo. Jërëjëf, jàmm ak jàmm.", "fr": "Je vous en prie. Bon séjour.", "en": "You are welcome. Enjoy your stay."}]}, "tour_resto": {"icon": "🍽️", "titre": "Restaurant & Bar", "sous": "Commander, plats sénégalais, addition.", "fond": "#2A1810", "title": "🍽️ Restaurant & Bar", "vocab": [{"en": "A table for two, please", "fr": "Une table pour deux, s'il vous plaît", "niveau": "debutant", "wo": "Benn table ñaar nit, bu la neexee."}, {"en": "Here is the menu", "fr": "Voici la carte", "niveau": "debutant", "wo": "Menu bi nii."}, {"en": "What would you like to drink?", "fr": "Que désirez-vous boire ?", "niveau": "debutant", "wo": "Lan nga bëgg a naan ?"}, {"en": "Water, please", "fr": "De l'eau, s'il vous plaît", "niveau": "debutant", "wo": "Ndox, bu la neexee."}, {"en": "I would like fish and rice", "fr": "Je voudrais du riz au poisson", "niveau": "debutant", "wo": "Bëgg naa ceebu jën."}, {"en": "The bill, please", "fr": "L'addition, s'il vous plaît", "niveau": "debutant", "wo": "Facture bi, bu la neexee."}, {"en": "It is delicious", "fr": "C'est délicieux", "niveau": "debutant", "wo": "Neex na lool."}, {"en": "Today's special is chicken yassa", "fr": "Le plat du jour est le poulet yassa", "niveau": "intermediaire"}, {"en": "Is it spicy?", "fr": "Est-ce épicé ?", "niveau": "intermediaire"}, {"en": "I am allergic to peanuts", "fr": "Je suis allergique aux arachides", "niveau": "intermediaire"}, {"en": "Can I have it without pepper?", "fr": "Puis-je l'avoir sans piment ?", "niveau": "intermediaire"}, {"en": "Would you like to try the bissap juice?", "fr": "Voulez-vous goûter le jus de bissap ?", "niveau": "intermediaire"}, {"en": "Do you accept card or mobile money?", "fr": "Acceptez-vous la carte ou le mobile money ?", "niveau": "intermediaire"}, {"en": "We recommend the grilled fish with onion sauce", "fr": "Nous recommandons le poisson grillé sauce oignon", "niveau": "intermediaire"}, {"en": "Could you recommend a typical Senegalese dish for someone who has never tried it?", "fr": "Pouvez-vous recommander un plat sénégalais typique à quelqu'un qui n'a jamais goûté ?", "niveau": "avance"}, {"en": "This dish is cold. Could you heat it up, please?", "fr": "Ce plat est froid. Pouvez-vous le réchauffer, s'il vous plaît ?", "niveau": "avance"}, {"en": "We have a vegetarian menu and a halal kitchen.", "fr": "Nous avons un menu végétarien et une cuisine halal.", "niveau": "avance"}, {"en": "I would like to book the terrace for a group of twelve on Saturday.", "fr": "Je voudrais réserver la terrasse pour douze personnes samedi.", "niveau": "avance"}, {"en": "The service was excellent, please keep the change.", "fr": "Le service était excellent, gardez la monnaie.", "niveau": "avance"}, {"en": "We can prepare a set menu for tour groups at a fixed price.", "fr": "Nous pouvons préparer un menu fixe pour les groupes à prix unique.", "niveau": "avance"}, {"en": "Could we split the bill between four people?", "fr": "Pouvons-nous partager l'addition entre quatre personnes ?", "niveau": "avance"}], "dlg": [{"role": "marchand", "wo": "Salaamaleekum. Ñaata nit ngeen ?", "fr": "Bonjour. Vous êtes combien ?", "en": "Good evening. How many are you?"}, {"role": "client", "wo": "Ñett nit lanu, bu la neexee.", "fr": "Nous sommes trois, s'il vous plaît.", "en": "We are three, please."}, {"role": "marchand", "wo": "Menu bi nii. Lan ngeen bëgg a naan ?", "fr": "Voici la carte. Que voulez-vous boire ?", "en": "Here is the menu. What would you like to drink?"}, {"role": "client", "wo": "Ndox ak bisaab, bu la neexee.", "fr": "De l'eau et du bissap, s'il vous plaît.", "en": "Water and bissap juice, please."}, {"role": "marchand", "wo": "Waaw. Ak lan ngeen bëgg a lekk ?", "fr": "Très bien. Et pour manger ?", "en": "Very well. And what would you like to eat?"}, {"role": "client", "wo": "Ñetti ceebu jën, waaye bul ko def piment lu bari.", "fr": "Trois riz au poisson, mais pas trop épicé.", "en": "Three fish and rice, but not too spicy."}, {"role": "marchand", "wo": "Baax na. Dinaa ko def ni nga ko bëgge.", "fr": "D'accord. Je le ferai comme vous voulez.", "en": "Of course. I will make it the way you like."}, {"role": "client", "wo": "Jërëjëf.", "fr": "Merci.", "en": "Thank you."}]}, "tour_guide": {"icon": "🧭", "titre": "Guide & Excursions", "sous": "Gorée, Lac Rose, Saloum, Casamance, circuits.", "fond": "#10261A", "title": "🧭 Guide & Excursions", "vocab": [{"en": "Welcome, I am your guide", "fr": "Bienvenue, je suis votre guide", "niveau": "debutant", "wo": "Dalal ak jàmm, maa ngi di sa guide."}, {"en": "Please follow me", "fr": "Suivez-moi, s'il vous plaît", "niveau": "debutant", "wo": "Toppal ma, bu la neexee."}, {"en": "This is Gorée Island", "fr": "Voici l'île de Gorée", "niveau": "debutant", "wo": "Gorée la."}, {"en": "Be careful, the road is slippery", "fr": "Attention, la route est glissante", "niveau": "debutant"}, {"en": "Do you want to take a photo?", "fr": "Voulez-vous prendre une photo ?", "niveau": "debutant"}, {"en": "We will stop here for ten minutes", "fr": "Nous nous arrêtons ici dix minutes", "niveau": "debutant"}, {"en": "Drink water, it is very hot", "fr": "Buvez de l'eau, il fait très chaud", "niveau": "debutant", "wo": "Naan ndox, dafa tàng lool."}, {"en": "The boat leaves at nine from the Dakar pier", "fr": "La chaloupe part à neuf heures de l'embarcadère de Dakar", "niveau": "intermediaire"}, {"en": "The visit lasts about three hours", "fr": "La visite dure environ trois heures", "niveau": "intermediaire"}, {"en": "The House of Slaves is an important memorial", "fr": "La Maison des Esclaves est un mémorial important", "niveau": "intermediaire"}, {"en": "At Lake Retba the water is pink because of the algae", "fr": "Au Lac Rose, l'eau est rose à cause des algues", "niveau": "intermediaire"}, {"en": "Please wear a hat and sun cream", "fr": "Portez un chapeau et mettez de la crème solaire", "niveau": "intermediaire"}, {"en": "The entrance fee is not included", "fr": "Le droit d'entrée n'est pas compris", "niveau": "intermediaire"}, {"en": "Do you want to see the baobab trees or the birds?", "fr": "Voulez-vous voir les baobabs ou les oiseaux ?", "niveau": "intermediaire"}, {"en": "Our two-day tour includes the Saloum Delta, a night in a lodge and all meals.", "fr": "Notre circuit de deux jours comprend le delta du Saloum, une nuit en lodge et tous les repas.", "niveau": "avance"}, {"en": "The price is per person, based on a minimum of four travellers.", "fr": "Le prix est par personne, sur la base d'au moins quatre voyageurs.", "niveau": "avance"}, {"en": "Due to the weather, we have to change the programme. I apologise.", "fr": "À cause du temps, nous devons changer le programme. Je m'en excuse.", "niveau": "avance"}, {"en": "Please keep your valuables with you and respect local customs.", "fr": "Gardez vos objets de valeur sur vous et respectez les coutumes locales.", "niveau": "avance"}, {"en": "May I ask your permission before taking photos of people?", "fr": "Puis-je demander votre accord avant de photographier des gens ?", "niveau": "avance"}, {"en": "We can adapt the tour for families with young children.", "fr": "Nous pouvons adapter le circuit aux familles avec de jeunes enfants.", "niveau": "avance"}, {"en": "Cancellations made less than forty-eight hours before are not refunded.", "fr": "Les annulations à moins de quarante-huit heures ne sont pas remboursées.", "niveau": "avance"}], "dlg": [{"role": "marchand", "wo": "Salaamaleekum, maa ngi di sa guide tey.", "fr": "Bonjour, je suis votre guide aujourd'hui.", "en": "Good morning, I am your guide today."}, {"role": "client", "wo": "Salaamaleekum. Ñaata waxtu la visite bi ?", "fr": "Bonjour. Combien de temps dure la visite ?", "en": "Hello. How long is the visit?"}, {"role": "marchand", "wo": "Ñett waxtu rekk. Dinanu tàmbali ci Gorée.", "fr": "Trois heures environ. Nous commençons par Gorée.", "en": "About three hours. We start with Gorée."}, {"role": "client", "wo": "Ndax prix bi dafa bokk ak chaloupe bi ?", "fr": "Le prix comprend-il la chaloupe ?", "en": "Does the price include the boat?"}, {"role": "marchand", "wo": "Déedéet, chaloupe bi dafa leer ci wàllu bi.", "fr": "Non, la chaloupe est à part.", "en": "No, the boat ticket is separate."}, {"role": "client", "wo": "Baax na. Mën naa jël nataal ?", "fr": "D'accord. Puis-je prendre des photos ?", "en": "All right. Can I take photos?"}, {"role": "marchand", "wo": "Waaw, waaye ci kër gi kese lañu ko tere.", "fr": "Oui, sauf à l'intérieur de la maison.", "en": "Yes, except inside the house."}, {"role": "client", "wo": "Jërëjëf, nanu dem.", "fr": "Merci, allons-y.", "en": "Thank you, let's go."}]}, "tour_transport": {"icon": "🚕", "titre": "Taxi & Transport", "sous": "Taxi, location de voiture, prix de la course.", "fond": "#1A1830", "title": "🚕 Taxi & Transport", "vocab": [{"en": "Where do you want to go?", "fr": "Où voulez-vous aller ?", "niveau": "debutant", "wo": "Fan nga bëgg a dem ?"}, {"en": "Take me to the airport, please", "fr": "Emmenez-moi à l'aéroport, s'il vous plaît", "niveau": "debutant", "wo": "Yóbbu ma ci aeroport bi, bu la neexee."}, {"en": "How much is the ride?", "fr": "Combien coûte la course ?", "niveau": "debutant", "wo": "Ñaata la course bi ?"}, {"en": "It is too expensive", "fr": "C'est trop cher", "niveau": "debutant", "wo": "Dafa cher lool."}, {"en": "Please stop here", "fr": "Arrêtez-vous ici, s'il vous plaît", "niveau": "debutant", "wo": "Taxawal fii, bu la neexee."}, {"en": "Turn left", "fr": "Tournez à gauche", "niveau": "debutant"}, {"en": "Turn right", "fr": "Tournez à droite", "niveau": "debutant"}, {"en": "Please use the meter", "fr": "Utilisez le compteur, s'il vous plaît", "niveau": "intermediaire"}, {"en": "Can you wait for me for one hour?", "fr": "Pouvez-vous m'attendre une heure ?", "niveau": "intermediaire"}, {"en": "How long does it take to get to Saly?", "fr": "Combien de temps faut-il pour aller à Saly ?", "niveau": "intermediaire"}, {"en": "The traffic is heavy at this time", "fr": "Il y a beaucoup d'embouteillages à cette heure", "niveau": "intermediaire"}, {"en": "Could you put the air conditioning on?", "fr": "Pouvez-vous mettre la climatisation ?", "niveau": "intermediaire"}, {"en": "The fare to the city centre is five thousand francs", "fr": "La course jusqu'au centre-ville coûte cinq mille francs", "niveau": "intermediaire"}, {"en": "I need a receipt, please", "fr": "J'ai besoin d'un reçu, s'il vous plaît", "niveau": "intermediaire"}, {"en": "I would like to rent a car with a driver for three days.", "fr": "Je voudrais louer une voiture avec chauffeur pendant trois jours.", "niveau": "avance"}, {"en": "Is fuel included in the daily price?", "fr": "Le carburant est-il compris dans le prix journalier ?", "niveau": "avance"}, {"en": "What is the deposit and is it refundable?", "fr": "Quelle est la caution et est-elle remboursable ?", "niveau": "avance"}, {"en": "We can arrange a shuttle for your group from the hotel to the airport.", "fr": "Nous pouvons organiser une navette pour votre groupe de l'hôtel à l'aéroport.", "niveau": "avance"}, {"en": "I have to report a small accident to the insurance company.", "fr": "Je dois déclarer un petit accident à l'assurance.", "niveau": "avance"}, {"en": "Please check the tyres and the spare wheel before we leave.", "fr": "Vérifiez les pneus et la roue de secours avant de partir.", "niveau": "avance"}, {"en": "For a long trip to Ziguinchor, I recommend leaving very early.", "fr": "Pour un long trajet vers Ziguinchor, je recommande de partir très tôt.", "niveau": "avance"}], "dlg": [{"role": "client", "wo": "Salaamaleekum. Yóbbu ma ci Saly, bu la neexee.", "fr": "Bonjour. Emmenez-moi à Saly, s'il vous plaît.", "en": "Hello. Take me to Saly, please."}, {"role": "marchand", "wo": "Waaw. Ñaata nit ngeen ?", "fr": "Oui. Vous êtes combien ?", "en": "Yes. How many of you are there?"}, {"role": "client", "wo": "Ñaar nit ak ñaari valiis.", "fr": "Deux personnes et deux valises.", "en": "Two people and two suitcases."}, {"role": "marchand", "wo": "Baax na. Fukk ak juróom junni la.", "fr": "D'accord. C'est quinze mille.", "en": "All right. It is fifteen thousand."}, {"role": "client", "wo": "Dafa cher lool. Mën nga ma wàññil ko ?", "fr": "C'est trop cher. Pouvez-vous baisser ?", "en": "That is too expensive. Can you lower it?"}, {"role": "marchand", "wo": "Fukk ak ñaar junni, waay. Loolu mooy sama njëg gu mujj.", "fr": "Douze mille. C'est mon dernier prix.", "en": "Twelve thousand. That is my last price."}, {"role": "client", "wo": "Baax na, nanu dem.", "fr": "D'accord, partons.", "en": "Okay, let's go."}, {"role": "marchand", "wo": "Jàmm rekk, dinanu agsi ci benn waxtu.", "fr": "Pas de souci, nous arrivons dans une heure.", "en": "No problem, we will arrive in one hour."}]}, "tour_artisanat": {"icon": "🎨", "titre": "Artisanat & Souvenirs", "sous": "Marchander, masques, tissus, bijoux.", "fond": "#2A2410", "title": "🎨 Artisanat & Souvenirs", "vocab": [{"en": "Welcome, come and see", "fr": "Bienvenue, venez voir", "niveau": "debutant", "wo": "Dalal ak jàmm, ñëwal gis."}, {"en": "This is handmade", "fr": "C'est fait à la main", "niveau": "debutant", "wo": "Loolu loxo la."}, {"en": "How much is this?", "fr": "Combien coûte ceci ?", "niveau": "debutant", "wo": "Ñaata la lii ?"}, {"en": "This necklace is beautiful", "fr": "Ce collier est très beau", "niveau": "debutant", "wo": "Collier bii rafet na lool."}, {"en": "I will take two", "fr": "J'en prends deux", "niveau": "debutant", "wo": "Dinaa jël ñaar."}, {"en": "Can I pay by card?", "fr": "Puis-je payer par carte ?", "niveau": "debutant"}, {"en": "Do you have a smaller size?", "fr": "Avez-vous plus petit ?", "niveau": "debutant"}, {"en": "This mask is made of wood from the Casamance", "fr": "Ce masque est en bois de Casamance", "niveau": "intermediaire"}, {"en": "The price is fixed, but I can make a small gift", "fr": "Le prix est fixe, mais je peux faire un petit cadeau", "niveau": "intermediaire"}, {"en": "What is the best price you can give me?", "fr": "Quel est votre meilleur prix ?", "niveau": "intermediaire"}, {"en": "Can you wrap it so it does not break in my suitcase?", "fr": "Pouvez-vous l'emballer pour qu'il ne casse pas dans ma valise ?", "niveau": "intermediaire"}, {"en": "Is this leather real?", "fr": "Ce cuir est-il vrai ?", "niveau": "intermediaire"}, {"en": "I am looking for a gift for my mother", "fr": "Je cherche un cadeau pour ma mère", "niveau": "intermediaire"}, {"en": "This cloth is dyed with natural colours", "fr": "Ce tissu est teint avec des couleurs naturelles", "niveau": "intermediaire"}, {"en": "Each piece is unique and signed by the artist.", "fr": "Chaque pièce est unique et signée par l'artiste.", "niveau": "avance"}, {"en": "If you buy three pieces, I can offer a fifteen percent discount.", "fr": "Si vous achetez trois pièces, je peux faire quinze pour cent de remise.", "niveau": "avance"}, {"en": "I can ship it to Europe and give you a customs invoice.", "fr": "Je peux l'expédier en Europe et vous donner une facture pour la douane.", "niveau": "avance"}, {"en": "I am sorry, this item is not for export because it is protected wood.", "fr": "Désolé, cet objet ne peut pas être exporté car c'est un bois protégé.", "niveau": "avance"}, {"en": "Our cooperative supports thirty families in the village.", "fr": "Notre coopérative fait vivre trente familles du village.", "niveau": "avance"}, {"en": "Could you make one for me in a different colour? I can wait three days.", "fr": "Pourriez-vous m'en faire un dans une autre couleur ? Je peux attendre trois jours.", "niveau": "avance"}, {"en": "The price is high because it takes two weeks to weave.", "fr": "Le prix est élevé car il faut deux semaines pour le tisser.", "niveau": "avance"}], "dlg": [{"role": "marchand", "wo": "Dalal ak jàmm, ñëwal gis sunu liggéey.", "fr": "Bienvenue, venez voir mon travail.", "en": "Welcome, come and see my work."}, {"role": "client", "wo": "Masque bii rafet na. Ñaata la ?", "fr": "Ce masque est très beau. Combien ?", "en": "This mask is beautiful. How much is it?"}, {"role": "marchand", "wo": "Fukk ak juróom junni la.", "fr": "Quinze mille francs.", "en": "Fifteen thousand francs."}, {"role": "client", "wo": "Dafa cher. Mën nga ma wàññil ko ?", "fr": "C'est cher. Pouvez-vous baisser ?", "en": "That is expensive. Can you lower it?"}, {"role": "marchand", "wo": "Bu ma jëndee ñaar, dinaa la ko def fukk ak ñaar junni.", "fr": "Si vous en prenez deux, je fais douze mille chacun.", "en": "If you take two, I will do twelve thousand each."}, {"role": "client", "wo": "Baax na. Dinaa jël ñaar.", "fr": "D'accord. Je prends deux.", "en": "Okay. I will take two."}, {"role": "marchand", "wo": "Jërëjëf. Dinaa leen takk bu baax.", "fr": "Merci. Je vais les emballer avec soin.", "en": "Thank you. I will wrap them carefully."}, {"role": "client", "wo": "Jërëjëf lool, rafet na.", "fr": "Merci beaucoup, c'est magnifique.", "en": "Thank you so much, it is wonderful."}]}, "tour_agence": {"icon": "✈️", "titre": "Agence de voyage", "sous": "Billets, visa, réservation, conseils voyageurs.", "fond": "#14203A", "title": "✈️ Agence de voyage", "vocab": [{"en": "How can I help you?", "fr": "Comment puis-je vous aider ?", "niveau": "debutant", "wo": "Naka laa mën a dimbali la ?"}, {"en": "Where do you want to travel?", "fr": "Où voulez-vous voyager ?", "niveau": "debutant", "wo": "Fan nga bëgg a dem ?"}, {"en": "When do you want to leave?", "fr": "Quand voulez-vous partir ?", "niveau": "debutant", "wo": "Kañ nga bëgg a dem ?"}, {"en": "One way or return?", "fr": "Aller simple ou aller-retour ?", "niveau": "debutant"}, {"en": "May I see your passport?", "fr": "Puis-je voir votre passeport ?", "niveau": "debutant", "wo": "Mën naa gis sa paspoor ?"}, {"en": "Your ticket is confirmed", "fr": "Votre billet est confirmé", "niveau": "debutant"}, {"en": "The flight leaves at eight in the morning", "fr": "Le vol part à huit heures du matin", "niveau": "debutant"}, {"en": "Do you want a direct flight or with a stopover?", "fr": "Voulez-vous un vol direct ou avec escale ?", "niveau": "intermediaire"}, {"en": "The price includes a twenty-three kilo bag", "fr": "Le prix comprend un bagage de vingt-trois kilos", "niveau": "intermediaire"}, {"en": "You must arrive at the airport three hours before", "fr": "Vous devez arriver à l'aéroport trois heures avant", "niveau": "intermediaire"}, {"en": "Your passport must be valid for six months", "fr": "Votre passeport doit être valable six mois", "niveau": "intermediaire"}, {"en": "Do you need a visa for this country?", "fr": "Avez-vous besoin d'un visa pour ce pays ?", "niveau": "intermediaire"}, {"en": "I can reserve a hotel for you near the city centre", "fr": "Je peux vous réserver un hôtel près du centre-ville", "niveau": "intermediaire"}, {"en": "Would you like travel insurance?", "fr": "Voulez-vous une assurance voyage ?", "niveau": "intermediaire"}, {"en": "The cheapest fare is non-refundable. A flexible ticket costs more.", "fr": "Le tarif le moins cher n'est pas remboursable. Un billet flexible coûte plus cher.", "niveau": "avance"}, {"en": "To change the date, there is a fee of fifty euros plus the fare difference.", "fr": "Pour changer la date, il y a cinquante euros de frais plus la différence de tarif.", "niveau": "avance"}, {"en": "Your visa application needs a bank statement, a hotel booking and a return ticket.", "fr": "Votre demande de visa nécessite un relevé bancaire, une réservation d'hôtel et un billet retour.", "niveau": "avance"}, {"en": "I will prepare a complete itinerary and send you a quotation today.", "fr": "Je vais préparer un itinéraire complet et vous envoyer un devis aujourd'hui.", "niveau": "avance"}, {"en": "The airline cancelled your flight. We can rebook you or refund you.", "fr": "La compagnie a annulé votre vol. Nous pouvons vous reprogrammer ou vous rembourser.", "niveau": "avance"}, {"en": "For a group of ten, we can negotiate a special rate with the airline.", "fr": "Pour un groupe de dix, nous pouvons négocier un tarif spécial avec la compagnie.", "niveau": "avance"}, {"en": "Please pay a deposit of thirty percent to confirm the booking.", "fr": "Veuillez verser un acompte de trente pour cent pour confirmer la réservation.", "niveau": "avance"}], "dlg": [{"role": "marchand", "wo": "Salaamaleekum. Naka laa mën a dimbali la ?", "fr": "Bonjour. Comment puis-je vous aider ?", "en": "Good morning. How can I help you?"}, {"role": "client", "wo": "Bëgg naa dem Paris ci weer wu ñëw.", "fr": "Je voudrais aller à Paris le mois prochain.", "en": "I would like to fly to Paris next month."}, {"role": "marchand", "wo": "Waaw. Aller simple walla aller-retour ?", "fr": "Très bien. Aller simple ou aller-retour ?", "en": "Very well. One way or return?"}, {"role": "client", "wo": "Aller-retour, bu la neexee. Ñaata la ?", "fr": "Aller-retour, s'il vous plaît. Combien ?", "en": "Return, please. How much is it?"}, {"role": "marchand", "wo": "380.000 francs la.", "fr": "Trois cent quatre-vingt mille francs.", "en": "Three hundred and eighty thousand francs."}, {"role": "client", "wo": "Ndax bagaas bi dafa bokk ?", "fr": "Le bagage est-il compris ?", "en": "Is the luggage included?"}, {"role": "marchand", "wo": "Waaw, benn valiis ci ñaar fukk ak ñett kilo.", "fr": "Oui, une valise de vingt-trois kilos.", "en": "Yes, one suitcase of twenty-three kilos."}, {"role": "client", "wo": "Baax na, dinaa ko jël.", "fr": "D'accord, je le prends.", "en": "All right, I will take it."}]}, "tour_plage": {"icon": "🏖️", "titre": "Plage & Loisirs", "sous": "Saly, pirogue, pêche, surf, hôtels de plage.", "fond": "#10261A", "title": "🏖️ Plage & Loisirs", "vocab": [{"en": "The beach is very beautiful", "fr": "La plage est très belle", "niveau": "debutant", "wo": "Tefes bi rafet na lool."}, {"en": "Is it safe to swim here?", "fr": "Peut-on se baigner ici sans danger ?", "niveau": "debutant"}, {"en": "Do you want a parasol?", "fr": "Voulez-vous un parasol ?", "niveau": "debutant"}, {"en": "The water is warm", "fr": "L'eau est chaude", "niveau": "debutant"}, {"en": "Do not leave your bag alone", "fr": "Ne laissez pas votre sac seul", "niveau": "debutant"}, {"en": "Do you want to go on a boat trip?", "fr": "Voulez-vous faire une sortie en pirogue ?", "niveau": "debutant"}, {"en": "The sunset is wonderful", "fr": "Le coucher de soleil est magnifique", "niveau": "debutant"}, {"en": "Surf lessons start at ten in the morning", "fr": "Les cours de surf commencent à dix heures", "niveau": "intermediaire"}, {"en": "The fishermen come back at five in the afternoon", "fr": "Les pêcheurs rentrent à dix-sept heures", "niveau": "intermediaire"}, {"en": "Beware of strong currents, swim between the flags", "fr": "Attention aux courants forts, baignez-vous entre les drapeaux", "niveau": "intermediaire"}, {"en": "I want to rent a kayak for two hours", "fr": "Je veux louer un kayak pour deux heures", "niveau": "intermediaire"}, {"en": "The boat trip to the mangroves takes ninety minutes", "fr": "La sortie en pirogue vers la mangrove dure quatre-vingt-dix minutes", "niveau": "intermediaire"}, {"en": "Life jackets are provided for everyone", "fr": "Des gilets de sauvetage sont fournis pour tous", "niveau": "intermediaire"}, {"en": "Fresh grilled fish is served on the beach at noon", "fr": "Du poisson grillé frais est servi sur la plage à midi", "niveau": "intermediaire"}, {"en": "Our resort offers a full-board package with water sports and an evening show.", "fr": "Notre hôtel de plage propose une formule pension complète avec sports nautiques et spectacle le soir.", "niveau": "avance"}, {"en": "The sea is rough today, so the boat trip is postponed until tomorrow.", "fr": "La mer est agitée aujourd'hui, la sortie est donc reportée à demain.", "niveau": "avance"}, {"en": "Children under twelve must be accompanied by an adult.", "fr": "Les enfants de moins de douze ans doivent être accompagnés d'un adulte.", "niveau": "avance"}, {"en": "We can organise a beach wedding for eighty guests.", "fr": "Nous pouvons organiser un mariage sur la plage pour quatre-vingts invités.", "niveau": "avance"}, {"en": "Please respect the turtle nests and do not leave plastic on the beach.", "fr": "Respectez les nids de tortues et ne laissez pas de plastique sur la plage.", "niveau": "avance"}, {"en": "The price of the sunset cruise includes drinks and snacks.", "fr": "Le prix de la croisière au coucher du soleil comprend boissons et collations.", "niveau": "avance"}, {"en": "I would like to book a private boat for my family for the whole day.", "fr": "Je voudrais réserver une pirogue privée pour ma famille pour la journée entière.", "niveau": "avance"}], "dlg": [{"role": "client", "wo": "Salaamaleekum, mën naa dem ci pirogue ?", "fr": "Bonjour, peut-on faire une sortie en pirogue ?", "en": "Hello, can we go on a boat trip?"}, {"role": "marchand", "wo": "Waaw, ñaar waxtu la, dinanu dem ci mangrove yi.", "fr": "Oui, deux heures, vers la mangrove.", "en": "Yes, two hours, to the mangroves."}, {"role": "client", "wo": "Ñaata la ci nit ?", "fr": "Combien par personne ?", "en": "How much per person?"}, {"role": "marchand", "wo": "Juróom junni ci nit, gilet de sauvetage dafa bokk.", "fr": "Cinq mille par personne, gilets inclus.", "en": "Five thousand per person, life jackets included."}, {"role": "client", "wo": "Ñetti nit lanu, ak benn xale.", "fr": "Nous sommes trois, avec un enfant.", "en": "There are three of us, with one child."}, {"role": "marchand", "wo": "Baax na, xale bi dina sol gilet bu ndaw.", "fr": "D'accord, l'enfant portera un petit gilet.", "en": "Fine, the child will wear a small life jacket."}, {"role": "client", "wo": "Kañ lanu dem ?", "fr": "On part quand ?", "en": "When do we leave?"}, {"role": "marchand", "wo": "Ci benn waxtu, ci tefes bi.", "fr": "Dans une heure, au bord de l'eau.", "en": "In an hour, at the water's edge."}]}};
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };

  function trier(vocab) {
    return vocab.map(function (v, i) { return [v, i]; }).sort(function (a, b) {
      var d = (ORDRE[a[0].niveau] || 0) - (ORDRE[b[0].niveau] || 0); return d || a[1] - b[1];
    }).map(function (x) { return x[0]; });
  }
  Object.keys(AJOUTS).forEach(function (k) {
    if (!C[k] || !C[k].vocab) return;
    var vus = {}; C[k].vocab.forEach(function (v) { vus[String(v.en).toLowerCase()] = 1; });
    AJOUTS[k].forEach(function (v) { if (!vus[v.en.toLowerCase()]) C[k].vocab.push(v); });
    C[k].vocab = trier(C[k].vocab);
  });
  Object.keys(TOUR).forEach(function (k) {
    var t = TOUR[k];
    S[k] = { icon: t.icon, titre: t.titre, sousTitre: t.sous, fond: t.fond };
    C[k] = { title: t.title, vocab: t.vocab };
    DL[k] = t.dlg;
  });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-biz-plus.js",e);}

try{
/* ---- diisoo-colobane-plus.js ---- */
/* diisoo-colobane-plus.js v1 : Business, Colobane (pièces détachées) enrichi
   +17 phrases (5 débutant, 5 intermédiaire, 7 avancé) et un dialogue « Commande de 20 jeux de plaquettes ». Wolof relu par Babacar.
   Desactivable : ?colobane=0 */
(function () {
  "use strict";
  if (window.__diisooColobanePlus || /[?&]colobane=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.colobane) return;
  window.__diisooColobanePlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Show me the brake pads, please.",
"fr": "Montre-moi les plaquettes de frein, s'il te plaît.",
"wo": "Won ma plaket fren yi, bu la neexee."
},
{
"niveau": "debutant",
"en": "How much is one tyre?",
"fr": "Combien coûte un pneu ?",
"wo": "Ñaata la benn pneu ?"
},
{
"niveau": "debutant",
"en": "Is it new or second-hand?",
"fr": "C'est neuf ou d'occasion ?",
"wo": "Ndax bu bées la wala occasion la ?"
},
{
"niveau": "debutant",
"en": "I will take two.",
"fr": "J'en prends deux.",
"wo": "Dinaa jënd ñaar."
},
{
"niveau": "debutant",
"en": "Can you deliver it to Thiès?",
"fr": "Tu peux la livrer à Thiès ?",
"wo": "Ndax mën nga ko yóbbu Cees ?"
},
{
"niveau": "intermediaire",
"en": "Can I test the part before paying?",
"fr": "Je peux tester la pièce avant de payer ?",
"wo": "Ndax mën naa jéem pièce bi balaa ma fey ?"
},
{
"niveau": "intermediaire",
"en": "How long does the delivery take?",
"fr": "La livraison prend combien de temps ?",
"wo": "Ñaata fan la livraison bi di ame ?"
},
{
"niveau": "intermediaire",
"en": "Do you have the same part in a cheaper brand?",
"fr": "Vous avez la même pièce dans une marque moins chère ?",
"wo": "Ndax am nga pièce bii ci marque bu njëg bi gën a tuuti ?"
},
{
"niveau": "intermediaire",
"en": "The part is damaged. I want a refund.",
"fr": "La pièce est abîmée. Je veux être remboursé.",
"wo": "Pièce bi dafa yaxu. Dama bëgg ñu delloo ma xaalis bi."
},
{
"niveau": "intermediaire",
"en": "Please write the price and the warranty on the invoice.",
"fr": "Écris le prix et la garantie sur la facture, s'il te plaît.",
"wo": "Bindal prix bi ak garanti bi ci facture bi, bu la neexee."
},
{
"niveau": "avance",
"en": "What is your minimum order quantity?",
"fr": "Quelle est votre commande minimale ?",
"wo": "Ban komànd bu gën a tuuti nga nangu ?"
},
{
"niveau": "avance",
"en": "Can you send me a sample before I order?",
"fr": "Pouvez-vous m'envoyer un échantillon avant ma commande ?",
"wo": "Ndax mën nga ma yónnee eesaantiyoŋ balaa may komànde ?"
},
{
"niveau": "avance",
"en": "What are your payment terms?",
"fr": "Quelles sont vos conditions de paiement ?",
"wo": "Naka ngeen di nangu fay gi ?"
},
{
"niveau": "avance",
"en": "I will pay half now and half on delivery.",
"fr": "Je paie la moitié maintenant et la moitié à la livraison.",
"wo": "Dinaa fay genn-wàll gi léegi, beneen genn-wàll bi bu ñu ma ko yónnee."
},
{
"niveau": "avance",
"en": "The shipment arrived late. Who pays the extra costs?",
"fr": "Le colis est arrivé en retard. Qui paie les frais en plus ?",
"wo": "Koli bi dafa yeex a agsi. Kan mooy fay xaalis bi ci yokku ?"
},
{
"niveau": "avance",
"en": "We need a contract with a delivery date.",
"fr": "Il nous faut un contrat avec une date de livraison.",
"wo": "Dafa war nu am kontraa bu am bés bu ñu koy yóbbu."
},
{
"niveau": "avance",
"en": "Please confirm the order by email.",
"fr": "Merci de confirmer la commande par e-mail.",
"wo": "Dëggalal komànd bi ci imel, bu la neexee."
}
];
  var L = [
{
"role": "client",
"en": "Good morning. I need twenty sets of brake pads for a 2010 Corolla.",
"fr": "Bonjour. Il me faut vingt jeux de plaquettes pour une Corolla 2010.",
"wo": "Jàmm nga fanaan. Dama soxla ñaar-fukki jeu plaket fren ngir Corolla 2010.",
"scene": "🔧 Commande de 20 jeux de plaquettes"
},
{
"role": "marchand",
"en": "Original or aftermarket?",
"fr": "D'origine ou aftermarket ?",
"wo": "Original walla aftermarket ?"
},
{
"role": "client",
"en": "Aftermarket. What is your best price for twenty?",
"fr": "Aftermarket. Quel est votre meilleur prix pour vingt ?",
"wo": "Aftermarket. Ban mooy sa njëg bi gën a tuuti ngir ñaar-fukk ?"
},
{
"role": "marchand",
"en": "Twelve thousand each, with six months of warranty.",
"fr": "Douze mille chacun, avec six mois de garantie.",
"wo": "Fukk ak ñaari junni benn bu nekk, ak garanti bu juróom-benni weer."
},
{
"role": "client",
"en": "Can you include delivery to Thiès?",
"fr": "Vous pouvez inclure la livraison à Thiès ?",
"wo": "Ndax mën nga boole livraison bi ba Cees ?"
},
{
"role": "marchand",
"en": "Yes, if you pay half now.",
"fr": "Oui, si vous payez la moitié maintenant.",
"wo": "Waaw, boo fayee genn-wàll gi léegi."
},
{
"role": "client",
"en": "Okay. Please write everything on the invoice.",
"fr": "D'accord. Écrivez tout sur la facture.",
"wo": "Waaw. Bindal lépp ci facture bi, bu la neexee."
},
{
"role": "marchand",
"en": "No problem. Thank you!",
"fr": "Pas de souci. Merci !",
"wo": "Amul jafe-jafe. Jërëjëf !"
}
];
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.colobane.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.colobane.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.colobane.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.colobane.vocab.length = 0; tri.forEach(function (t) { C.colobane.vocab.push(t[0]); });
  D.colobane = D.colobane || [];
  var vus = {}; D.colobane.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.colobane.push(l); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-colobane-plus.js",e);}

try{
/* ---- diisoo-mission-colobane.js ---- */
/* diisoo-mission-colobane.js v1 : Mission « Acheter mes pièces à Colobane »
   L'app joue le marchand (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Colobane ».
   Bouton place en haut du secteur « Pièces détachées » (Business). Essai : https://diisoo.sn/?mission=colobane */
(function () {
  "use strict";
  if (window.DiisooMissionColobane) return;
  var Q = [
    { q: "Hello. What do you need today?", kw: /need|want|looking|brake|filter|tyre|tire|part|pads|oil|battery|i/i, m: "I need brake pads for a Corolla." },
    { q: "Which car is it for?", kw: /corolla|toyota|peugeot|renault|honda|car|2010|2008|2012|\d|for/i, m: "It is for a 2010 Corolla." },
    { q: "Original or aftermarket?", kw: /original|aftermarket|copy|cheap|oem|new|second|used/i, m: "I want the original, please." },
    { q: "Twelve thousand each. How many do you want?", kw: /two|three|four|five|ten|twenty|\d|sets|pieces|take|want|price|lower/i, m: "I want ten sets. What is your best price?" },
    { q: "Okay, eleven thousand. Do you want a warranty?", kw: /yes|warranty|guarantee|invoice|please|months|write|sure|ok/i, m: "Yes, please write the warranty on the invoice." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mcb{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mcb .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mcb .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mcb .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mcb button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mcb .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mcb .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mcb .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mcb .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mcb .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mcb .ok{color:#25D366}#mcb .or{color:#FFAA3C}" +
    "#mcb-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mcb-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mcb")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mcb";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🔧 Colobane · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mcb-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mcb-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mcb-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mcb-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mcb-skip" type="button">Passer</button>' +
        '<button class="b3" id="mcb-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mcb-r"), mic = document.getElementById("mcb-mic"), nx = document.getElementById("mcb-next");
      document.getElementById("mcb-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mcb-x").onclick = function () { o.remove(); };
      document.getElementById("mcb-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["colobane"]) BADGES["colobane"] = { icon: "🔧", label: "Colobane", desc: "Achat de pièces réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("colobane"); } catch (e) {}
      }
      noter("mission_colobane", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🌾 Mission Colobane</div><div class="q">' + (ok ? "Belle affaire ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Colobane » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du secteur Colobane et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mcb-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mcb-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mcb-x2" type="button">Fermer</button>';
      document.getElementById("mcb-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mcb-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mcb-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon achat de pièces en anglais sur Diisoo 🔧 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("business-content");
    if (!box || box.classList.contains("hidden") || document.getElementById("mcb-btn")) return;
    var id = ""; try { id = businessModule; } catch (e) {}
    if (id !== "colobane") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mcb-btn";
    b.innerHTML = '<span style="font-size:22px">🔧</span><span>Mission : acheter mes pièces<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    var h = box.querySelector("h4"); if (h && h.nextSibling) box.insertBefore(b, h.nextSibling); else box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("business-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true, attributes: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionColobane = { ouvrir: ouvrir };
  if (/[?&]mission=colobane/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-colobane.js",e);}

try{
/* ---- diisoo-sandaga-plus.js ---- */
/* diisoo-sandaga-plus.js v1 : Business, Sandaga (mode et beauté) enrichi
   +17 phrases (5 débutant, 5 intermédiaire, 7 avancé) et un dialogue « Commande de 50 chemises ». Wolof relu par Babacar.
   Desactivable : ?sandaga=0 */
(function () {
  "use strict";
  if (window.__diisooSandagaPlus || /[?&]sandaga=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.sandaga) return;
  window.__diisooSandagaPlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Do you have this dress in my size?",
"fr": "Vous avez cette robe dans ma taille ?",
"wo": "Ndax am nga robe bii ci sama taille ?"
},
{
"niveau": "debutant",
"en": "How much is one metre of this fabric?",
"fr": "Combien coûte un mètre de ce tissu ?",
"wo": "Ñaata la benn mètr tissu bii ?"
},
{
"niveau": "debutant",
"en": "I like the red one.",
"fr": "J'aime le rouge.",
"wo": "Neex na ma bu xonq bi."
},
{
"niveau": "debutant",
"en": "Can you lower the price a little?",
"fr": "Tu peux baisser un peu le prix ?",
"wo": "Ndax mën nga wàññi njëg li tuuti ?"
},
{
"niveau": "debutant",
"en": "I will come back tomorrow.",
"fr": "Je reviens demain.",
"wo": "Dinaa dellusi suba."
},
{
"niveau": "intermediaire",
"en": "Do you have the same fabric in other patterns?",
"fr": "Vous avez le même tissu avec d'autres motifs ?",
"wo": "Ndax am nga tissu bii ci yeneen motif ?"
},
{
"niveau": "intermediaire",
"en": "How many metres are in a full piece?",
"fr": "Combien de mètres y a-t-il dans une pièce complète ?",
"wo": "Ñaata mètr a nekk ci benn pièce bu mat ?"
},
{
"niveau": "intermediaire",
"en": "Can the tailor make it by Friday?",
"fr": "Le tailleur peut le faire pour vendredi ?",
"wo": "Ndax tayëer bi mën na ko ñaaw balaa àjjuma ?"
},
{
"niveau": "intermediaire",
"en": "I would like to see your newest collection.",
"fr": "J'aimerais voir votre nouvelle collection.",
"wo": "Dama bëgg a gis seen koleksiyoŋ bu bees bi."
},
{
"niveau": "intermediaire",
"en": "Is the colour natural or chemical?",
"fr": "La couleur est-elle naturelle ou chimique ?",
"wo": "Ndax couleur bi natirel la walla chimique la ?"
},
{
"niveau": "avance",
"en": "Can you make the same model in five sizes?",
"fr": "Pouvez-vous faire le même modèle en cinq tailles ?",
"wo": "Ndax mën nga def modèle bii ci juróomi taille ?"
},
{
"niveau": "avance",
"en": "I need the order ready before Tabaski.",
"fr": "Il me faut la commande avant la Tabaski.",
"wo": "Dama soxla commande bi pare balaa Tabaski."
},
{
"niveau": "avance",
"en": "What is the price if I bring my own fabric?",
"fr": "Quel est le prix si j'apporte mon propre tissu ?",
"wo": "Ñaata la njëg li bu ma indee sama tissu ?"
},
{
"niveau": "avance",
"en": "Can you embroider a logo on each piece?",
"fr": "Pouvez-vous broder un logo sur chaque pièce ?",
"wo": "Ndax mën nga brode logo ci pièce bu nekk ?"
},
{
"niveau": "avance",
"en": "The sizes are not correct. I want a replacement.",
"fr": "Les tailles ne sont pas correctes. Je veux un remplacement.",
"wo": "Taille yi baaxul. Dama bëgg ngeen soppi ma leen."
},
{
"niveau": "avance",
"en": "Do you give credit to regular customers?",
"fr": "Vous faites crédit aux clients réguliers ?",
"wo": "Ndax dangeen di joxe leb ngir kliyaan yu sax yi ?"
},
{
"niveau": "avance",
"en": "Please send photos of the finished clothes before shipping.",
"fr": "Envoyez des photos des vêtements finis avant l'expédition.",
"wo": "Yónnee ma nataali yére yi pare balaa ngeen leen di yónnee."
}
];
  var L = [
{
"role": "client",
"en": "Good morning. I would like to order fifty shirts in three sizes.",
"fr": "Bonjour. Je voudrais commander cinquante chemises en trois tailles.",
"wo": "Jàmm nga fanaan. Dama bëgg a komànde juróom-fukki simis ci ñetti taille.",
"scene": "👗 Commande de 50 chemises"
},
{
"role": "tailleur",
"en": "Which fabric do you want?",
"fr": "Quel tissu voulez-vous ?",
"wo": "Ban tissu ngeen bëgg ?"
},
{
"role": "client",
"en": "Wax fabric. Here is a sample.",
"fr": "Du wax. Voici un échantillon.",
"wo": "Wax la. Eesaantiyoŋ bi mii ngi nii."
},
{
"role": "tailleur",
"en": "It will take two weeks. The price is eight thousand francs per shirt.",
"fr": "Ça prendra deux semaines. Le prix est de huit mille francs par chemise.",
"wo": "Dina jël ñaari ayu-bés. Njëg li mooy juróom-ñetti junni ci simis bu nekk."
},
{
"role": "client",
"en": "Can you put my shop name on the labels?",
"fr": "Vous pouvez mettre le nom de ma boutique sur les étiquettes ?",
"wo": "Ndax mën nga def turu sama butik ci etikët yi ?"
},
{
"role": "tailleur",
"en": "Yes, it costs five hundred francs more per shirt.",
"fr": "Oui, ça coûte cinq cents francs de plus par chemise.",
"wo": "Waaw, dina yokku juróomi téeméeri farã ci simis bu nekk."
},
{
"role": "client",
"en": "Okay. Send me photos before shipping.",
"fr": "D'accord. Envoyez-moi des photos avant l'expédition.",
"wo": "Waaw. Yónnee ma nataali yére yi pare balaa ngeen leen di yónnee."
},
{
"role": "tailleur",
"en": "Of course. Thank you for your trust.",
"fr": "Bien sûr. Merci de votre confiance.",
"wo": "Waaw kay. Jërëjëf ci sa kóolute."
}
];
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.sandaga.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.sandaga.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.sandaga.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.sandaga.vocab.length = 0; tri.forEach(function (t) { C.sandaga.vocab.push(t[0]); });
  D.sandaga = D.sandaga || [];
  var vus = {}; D.sandaga.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.sandaga.push(l); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-sandaga-plus.js",e);}

try{
/* ---- diisoo-mission-sandaga.js ---- */
/* diisoo-mission-sandaga.js v1 : Mission « Acheter mon tissu à Sandaga »
   L'app joue le vendeur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Sandaga ».
   Bouton place en haut du secteur « Mode & Beauté » (Business). Essai : https://diisoo.sn/?mission=sandaga */
(function () {
  "use strict";
  if (window.DiisooMissionSandaga) return;
  var Q = [
    { q: "Hello. What are you looking for?", kw: /looking|need|want|dress|fabric|shirt|wax|trousers|cloth|i/i, m: "I am looking for a wax dress." },
    { q: "What size do you wear?", kw: /small|medium|large|xl|size|\d|wear|l\b|m\b|s\b/i, m: "I wear size medium." },
    { q: "Which colour do you prefer?", kw: /red|blue|green|yellow|black|white|colour|color|pink|orange|prefer|like/i, m: "I prefer the red one." },
    { q: "It is ten thousand francs. Do you want to buy it?", kw: /lower|discount|price|expensive|yes|buy|take|how much|cheaper|less|please/i, m: "It is expensive. Can you lower the price?" },
    { q: "Okay, eight thousand. When do you want it?", kw: /tomorrow|friday|monday|tuesday|wednesday|thursday|saturday|sunday|week|today|next|day|ready|tabaski|before/i, m: "I need it before Friday." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#msd{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#msd .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#msd .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#msd .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#msd button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#msd .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#msd .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#msd .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#msd .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#msd .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#msd .ok{color:#25D366}#msd .or{color:#FFAA3C}" +
    "#msd-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#msd-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("msd")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "msd";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">👗 Sandaga · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="msd-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="msd-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="msd-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="msd-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="msd-skip" type="button">Passer</button>' +
        '<button class="b3" id="msd-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("msd-r"), mic = document.getElementById("msd-mic"), nx = document.getElementById("msd-next");
      document.getElementById("msd-ec").onclick = function () { parler(cur.q); };
      document.getElementById("msd-x").onclick = function () { o.remove(); };
      document.getElementById("msd-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["sandaga"]) BADGES["sandaga"] = { icon: "👗", label: "Sandaga", desc: "Achat de tissus réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("sandaga"); } catch (e) {}
      }
      noter("mission_sandaga", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🌾 Mission Sandaga</div><div class="q">' + (ok ? "Belle affaire ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Sandaga » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du secteur Sandaga et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="msd-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="msd-re" type="button">Réessayer</button>') +
        '<button class="b3" id="msd-x2" type="button">Fermer</button>';
      document.getElementById("msd-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("msd-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("msd-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon achat de tissus en anglais sur Diisoo 👗 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("business-content");
    if (!box || box.classList.contains("hidden") || document.getElementById("msd-btn")) return;
    var id = ""; try { id = businessModule; } catch (e) {}
    if (id !== "sandaga") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "msd-btn";
    b.innerHTML = '<span style="font-size:22px">👗</span><span>Mission : acheter mon tissu<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    var h = box.querySelector("h4"); if (h && h.nextSibling) box.insertBefore(b, h.nextSibling); else box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("business-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true, attributes: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionSandaga = { ouvrir: ouvrir };
  if (/[?&]mission=sandaga/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-sandaga.js",e);}

try{
/* ---- diisoo-chine-plus.js ---- */
/* diisoo-chine-plus.js v1 : Business, Chine (mode et beauté) enrichi
   +16 phrases (5 débutant, 5 intermédiaire, 6 avancé) et un dialogue « Visite d'usine à Guangzhou ». Wolof relu par Babacar.
   Desactivable : ?chine=0 */
(function () {
  "use strict";
  if (window.__diisooChinePlus || /[?&]chine=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.chine) return;
  window.__diisooChinePlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Where is the factory?",
"fr": "Où est l'usine ?",
"wo": "Fan la isin bi nekk ?"
},
{
"niveau": "debutant",
"en": "Can I visit the factory?",
"fr": "Je peux visiter l'usine ?",
"wo": "Ndax mën naa dem seeti isin bi ?"
},
{
"niveau": "debutant",
"en": "Please send me the price list.",
"fr": "Envoyez-moi la liste des prix, s'il vous plaît.",
"wo": "Yónnee ma listu njëg yi, bu la neexee."
},
{
"niveau": "debutant",
"en": "Do you speak English?",
"fr": "Parlez-vous anglais ?",
"wo": "Ndax dangay wax àngale ?"
},
{
"niveau": "debutant",
"en": "I want to pay by bank transfer.",
"fr": "Je veux payer par virement bancaire.",
"wo": "Dama bëgg a faye wirmaa ci bànk."
},
{
"niveau": "intermediaire",
"en": "How long is the production time?",
"fr": "Combien de temps dure la production ?",
"wo": "Ñaata fan la liggéey bi di jël ?"
},
{
"niveau": "intermediaire",
"en": "Can you send a video of the product?",
"fr": "Vous pouvez envoyer une vidéo du produit ?",
"wo": "Ndax mën nga yónnee wideo produit bi ?"
},
{
"niveau": "intermediaire",
"en": "What is the weight of one carton?",
"fr": "Quel est le poids d'un carton ?",
"wo": "Ñaata kilo la benn kartoŋ am ?"
},
{
"niveau": "intermediaire",
"en": "Is the product tested before shipping?",
"fr": "Le produit est-il testé avant l'expédition ?",
"wo": "Ndax produit bi dañu koy seet bu baax balaa ñu koy yónnee ?"
},
{
"niveau": "intermediaire",
"en": "Can I change my order before production starts?",
"fr": "Je peux modifier ma commande avant le début de la production ?",
"wo": "Ndax mën naa soppi sama komànd balaa production bi di tàmbali ?"
},
{
"niveau": "avance",
"en": "We need a quality inspection by a third party.",
"fr": "Il nous faut une inspection qualité par un tiers.",
"wo": "Dafa war nu am saytu bu keneen ku bokkul ci jaay bi def."
},
{
"niveau": "avance",
"en": "What happens if the goods do not match the sample?",
"fr": "Que se passe-t-il si la marchandise n'est pas conforme à l'échantillon ?",
"wo": "Lan mooy am su marsandiis bi méngoowul ak eesaantiyoŋ bi ?"
},
{
"niveau": "avance",
"en": "Can you handle the export documents?",
"fr": "Pouvez-vous gérer les documents d'exportation ?",
"wo": "Ndax mën nga toppatoo dokimaŋ yu export yi ?"
},
{
"niveau": "avance",
"en": "I want a refund if the container arrives damaged.",
"fr": "Je veux un remboursement si le conteneur arrive endommagé.",
"wo": "Dama bëgg ñu delloo ma xaalis bi su konteneer bi agsee yàqu."
},
{
"niveau": "avance",
"en": "Is the exchange rate fixed in the contract?",
"fr": "Le taux de change est-il fixé dans le contrat ?",
"wo": "Ndax taux de change bi dañu ko tënk ci kontraa bi ?"
},
{
"niveau": "avance",
"en": "We will pay the balance after the inspection.",
"fr": "Nous paierons le solde après l'inspection.",
"wo": "Dinanu fay li ci des gannaaw inspeksiyoŋ bi."
}
];
  var L = [
{
"role": "client",
"en": "Hello. I am the buyer from Senegal. Thank you for the visit.",
"fr": "Bonjour. Je suis l'acheteur du Sénégal. Merci pour la visite.",
"wo": "Jàmm nga fanaan. Maa di jënd bu jóge Senegaal. Jërëjëf ci seetu bi.",
"scene": "🏭 Visite d'usine à Guangzhou"
},
{
"role": "usine",
"en": "Welcome. This is our production line.",
"fr": "Bienvenue. Voici notre ligne de production.",
"wo": "Dalal ak jàmm. Lii mooy sunu chaîne bu production."
},
{
"role": "client",
"en": "How many pieces can you make per month?",
"fr": "Combien de pièces pouvez-vous faire par mois ?",
"wo": "Ñaata pièce ngeen mën a def ci weer wu nekk ?"
},
{
"role": "usine",
"en": "Ten thousand pieces. The production time is twenty-five days.",
"fr": "Dix mille pièces. Le délai de production est de vingt-cinq jours.",
"wo": "Fukki junni pièce. Production bi di yàgg ñaar-fukk ak juróom fan."
},
{
"role": "client",
"en": "Can I see the quality test?",
"fr": "Je peux voir le test de qualité ?",
"wo": "Ndax mën naa gis test bi ci kalite bi ?"
},
{
"role": "usine",
"en": "Of course. We test every product before shipping.",
"fr": "Bien sûr. Nous testons chaque produit avant l'expédition.",
"wo": "Waaw kay. Dañu seet produit bu nekk bu baax balaa ñu koy yónnee."
},
{
"role": "client",
"en": "Good. I will order five thousand pieces. Please send the contract.",
"fr": "Bien. Je commande cinq mille pièces. Envoyez le contrat.",
"wo": "Baax na. Dinaa komànde juróomi junni pièce. Yónnee ma kontraa bi."
},
{
"role": "usine",
"en": "Thank you. We will send it today by email.",
"fr": "Merci. Nous l'envoyons aujourd'hui par e-mail.",
"wo": "Jërëjëf. Dinanu ko yónnee tey ci imel."
}
];
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.chine.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.chine.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.chine.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.chine.vocab.length = 0; tri.forEach(function (t) { C.chine.vocab.push(t[0]); });
  D.chine = D.chine || [];
  var vus = {}; D.chine.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.chine.push(l); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-chine-plus.js",e);}

try{
/* ---- diisoo-mission-chine.js ---- */
/* diisoo-mission-chine.js v1 : Mission « Négocier à l'usine en Chine »
   L'app joue le vendeur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Chine ».
   Bouton place en haut du secteur « Chine (import/export) » (Business). Essai : https://diisoo.sn/?mission=chine */
(function () {
  "use strict";
  if (window.DiisooMissionChine) return;
  var Q = [
    { q: "Hello. Welcome to our factory. What product are you interested in?", kw: /product|phone|shoes|clothes|machine|furniture|interested|want|need|looking|i/i, m: "I am interested in plastic chairs." },
    { q: "How many pieces do you want to order?", kw: /\d|hundred|thousand|pieces|units|order|want|need|many/i, m: "I want to order five thousand pieces." },
    { q: "The price is two dollars per piece. Is that okay?", kw: /lower|discount|price|expensive|yes|okay|ok|cheaper|less|better|please|how much/i, m: "It is expensive. Can you give a better price?" },
    { q: "The production time is twenty-five days. Is that okay for you?", kw: /yes|okay|ok|fine|days|faster|quick|time|production|ship|need|week|long/i, m: "Yes, that is fine. Please send the contract." },
    { q: "How do you want to pay?", kw: /bank|transfer|pay|payment|cash|deposit|percent|wire|card|%/i, m: "I will pay by bank transfer." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mch{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mch .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mch .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mch .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mch button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mch .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mch .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mch .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mch .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mch .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mch .ok{color:#25D366}#mch .or{color:#FFAA3C}" +
    "#mch-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mch-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mch")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mch";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🏭 Chine · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mch-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mch-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mch-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mch-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mch-skip" type="button">Passer</button>' +
        '<button class="b3" id="mch-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mch-r"), mic = document.getElementById("mch-mic"), nx = document.getElementById("mch-next");
      document.getElementById("mch-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mch-x").onclick = function () { o.remove(); };
      document.getElementById("mch-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["chine"]) BADGES["chine"] = { icon: "🏭", label: "Chine", desc: "Négociation d'usine réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("chine"); } catch (e) {}
      }
      noter("mission_chine", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🏭 Mission Chine</div><div class="q">' + (ok ? "Bonne commande ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Chine » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du secteur Chine et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mch-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mch-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mch-x2" type="button">Fermer</button>';
      document.getElementById("mch-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mch-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mch-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma négociation avec une usine chinoise en anglais sur Diisoo 🏭 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("business-content");
    if (!box || box.classList.contains("hidden") || document.getElementById("mch-btn")) return;
    var id = ""; try { id = businessModule; } catch (e) {}
    if (id !== "chine") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mch-btn";
    b.innerHTML = '<span style="font-size:22px">🏭</span><span>Mission : négocier à l\'usine<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    var h = box.querySelector("h4"); if (h && h.nextSibling) box.insertBefore(b, h.nextSibling); else box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("business-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true, attributes: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionChine = { ouvrir: ouvrir };
  if (/[?&]mission=chine/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-chine.js",e);}

try{
/* ---- diisoo-agriculture-plus.js ---- */
/* diisoo-agriculture-plus.js v1 : Business, Agriculture (mode et beauté) enrichi
   +15 phrases et un dialogue. Wolof relu par Babacar.
   Desactivable : ?agriculture=0 */
(function () {
  "use strict";
  if (window.__diisooAgriculturePlus || /[?&]agriculture=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.agriculture) return;
  window.__diisooAgriculturePlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Do you have fresh mangoes?",
"fr": "Vous avez des mangues fraîches ?",
"wo": "Ndax am nga màngo yu bees ?"
},
{
"niveau": "debutant",
"en": "How much is a bag of rice?",
"fr": "Combien coûte un sac de riz ?",
"wo": "Ñaata la benn saaku ceeb ?"
},
{
"niveau": "debutant",
"en": "I need seeds for the rainy season.",
"fr": "Il me faut des semences pour l'hivernage.",
"wo": "Dama soxla jiwu ngir nawet bi."
},
{
"niveau": "debutant",
"en": "Where is your field?",
"fr": "Où est votre champ ?",
"wo": "Fan la sa tool bi nekk ?"
},
{
"niveau": "debutant",
"en": "Can I taste it?",
"fr": "Je peux goûter ?",
"wo": "Ndax mën naa ko mos ?"
},
{
"niveau": "intermediaire",
"en": "How many bags can you supply per week?",
"fr": "Combien de sacs pouvez-vous fournir par semaine ?",
"wo": "Ñaata saaku ngeen mën a joxe ci ayu-bés bu nekk ?"
},
{
"niveau": "intermediaire",
"en": "Do you use fertiliser?",
"fr": "Vous utilisez de l'engrais ?",
"wo": "Ndax dangeen di jëfandikoo àngere ?"
},
{
"niveau": "intermediaire",
"en": "Is the harvest ready?",
"fr": "La récolte est prête ?",
"wo": "Ndax ngóob mi pare na ?"
},
{
"niveau": "intermediaire",
"en": "Can you deliver to Thiès market on Monday?",
"fr": "Vous pouvez livrer au marché de Thiès lundi ?",
"wo": "Ndax mën nga ko yónnee marse Cees altine ?"
},
{
"niveau": "intermediaire",
"en": "Can I visit your farm this weekend?",
"fr": "Je peux visiter votre ferme ce week-end ?",
"wo": "Ndax mën naa seeti sa ferme bii weekend ?"
},
{
"niveau": "avance",
"en": "I want to buy your whole harvest at a fixed price.",
"fr": "Je veux acheter toute votre récolte à prix fixe.",
"wo": "Dama bëgg a jënd sa ngóob mépp ci benn njëg bu tënku."
},
{
"niveau": "avance",
"en": "Do you have a certificate for organic products?",
"fr": "Vous avez un certificat pour les produits bio ?",
"wo": "Ndax am nga sertifika ngir produit yu bio ?"
},
{
"niveau": "avance",
"en": "Part of the harvest was damaged by the drought.",
"fr": "Une partie de la récolte a été abîmée par la sécheresse.",
"wo": "Benn wàll ci ngóob mi yàqu na ndax bekkoor."
},
{
"niveau": "avance",
"en": "Can you give me credit until I sell the produce?",
"fr": "Vous pouvez me faire crédit jusqu'à la vente ?",
"wo": "Ndax mën nga ma joxe leb ba ma jaayee marsandiis bi ?"
},
{
"niveau": "avance",
"en": "I want to pay half now and half at delivery.",
"fr": "Je veux payer la moitié maintenant et la moitié à la livraison.",
"wo": "Dama bëgg a fay genn-wàll gi léegi, beneen genn-wàll bi bu yónnee bi agsee."
}
];
  var L = [
{
"role": "client",
"en": "Hello. I want to buy vegetables for my restaurant.",
"fr": "Bonjour. Je veux acheter des légumes pour mon restaurant.",
"wo": "Jàmm nga fanaan. Dama bëgg a jënd legim ngir sama restoraŋ.",
"scene": "🌾 Visite chez un producteur"
},
{
"role": "producteur",
"en": "Welcome to my farm. Everything is fresh.",
"fr": "Bienvenue dans ma ferme. Tout est frais.",
"wo": "Dalal ak jàmm ci sama ferme. Lépp dafa bees."
},
{
"role": "client",
"en": "How many kilos of tomatoes can you give me every week?",
"fr": "Combien de kilos de tomates pouvez-vous me donner chaque semaine ?",
"wo": "Ñaata kilo tamaate ngeen ma mën a jox ci ayu-bés bu nekk ?"
},
{
"role": "producteur",
"en": "One hundred kilos, and I can deliver on Monday.",
"fr": "Cent kilos, et je peux livrer lundi.",
"wo": "Téeméeri kilo, te mën naa ko yónnee altine."
},
{
"role": "client",
"en": "What is your price for one kilo?",
"fr": "Quel est votre prix pour un kilo ?",
"wo": "Ñaata la sa njëg ngir benn kilo ?"
},
{
"role": "producteur",
"en": "Four hundred francs. For a regular client, three hundred and fifty.",
"fr": "Quatre cents francs. Pour un client régulier, trois cent cinquante.",
"wo": "Juróom-ñett-fukki dërëm. Ngir kliyaan bu sax, juróom-ñaar-fukki dërëm."
},
{
"role": "client",
"en": "Good. I will take one hundred kilos every week.",
"fr": "Bien. Je prends cent kilos chaque semaine.",
"wo": "Baax na. Dinaa jël téeméeri kilo ci ayu-bés bu nekk."
},
{
"role": "producteur",
"en": "Perfect. I will write it down and call you on Sunday.",
"fr": "Parfait. Je le note et je vous appelle dimanche.",
"wo": "Baax na lool. Dinaa ko bind te woo la dibéer."
}
];
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.agriculture.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.agriculture.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.agriculture.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.agriculture.vocab.length = 0; tri.forEach(function (t) { C.agriculture.vocab.push(t[0]); });
  D.agriculture = D.agriculture || [];
  var vus = {}; D.agriculture.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.agriculture.push(l); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-agriculture-plus.js",e);}

try{
/* ---- diisoo-mission-agribiz.js ---- */
/* diisoo-mission-producteur.js v1 : Mission « Acheter chez un producteur »
   L'app joue le vendeur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Producteur ».
   Bouton place en haut du secteur « Agriculture & produits locaux » (Business). Essai : https://diisoo.sn/?mission=agribiz */
(function () {
  "use strict";
  if (window.DiisooMissionAgribiz) return;
  var Q = [
    { q: "Hello. Welcome to my farm. What do you want to buy?", kw: /tomato|onion|vegetable|rice|mango|fruit|buy|want|need|looking|i/i, m: "I want to buy tomatoes and onions." },
    { q: "How many kilos do you need?", kw: /\d|kilo|kg|bag|hundred|ten|twenty|fifty|many|need|want/i, m: "I need fifty kilos." },
    { q: "It is four hundred francs a kilo.", kw: /lower|discount|price|expensive|cheaper|less|better|please|how much|regular/i, m: "It is expensive. Can you lower the price?" },
    { q: "Okay, three hundred and fifty. When do you want it?", kw: /monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today|week|morning|deliver|day|next/i, m: "I want it on Monday morning." },
    { q: "How do you want to pay?", kw: /wave|orange|mobile|money|cash|pay|payment|transfer|half|advance|card/i, m: "I will pay half now and half at delivery." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mpd{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mpd .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mpd .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mpd .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mpd button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mpd .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mpd .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mpd .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mpd .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mpd .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mpd .ok{color:#25D366}#mpd .or{color:#FFAA3C}" +
    "#mpd-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mpd-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mpd")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mpd";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🌾 Producteur · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mpd-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mpd-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mpd-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mpd-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mpd-skip" type="button">Passer</button>' +
        '<button class="b3" id="mpd-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mpd-r"), mic = document.getElementById("mpd-mic"), nx = document.getElementById("mpd-next");
      document.getElementById("mpd-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mpd-x").onclick = function () { o.remove(); };
      document.getElementById("mpd-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["producteur"]) BADGES["producteur"] = { icon: "🌾", label: "Producteur", desc: "Achat chez un producteur réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("producteur"); } catch (e) {}
      }
      noter("mission_agribiz", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🌾 Mission Producteur</div><div class="q">' + (ok ? "Bonne affaire ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Producteur » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du secteur Producteur et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mpd-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mpd-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mpd-x2" type="button">Fermer</button>';
      document.getElementById("mpd-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mpd-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mpd-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon achat chez un producteur en anglais sur Diisoo 🌾 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("business-content");
    if (!box || box.classList.contains("hidden") || document.getElementById("mpd-btn")) return;
    var id = ""; try { id = businessModule; } catch (e) {}
    if (id !== "agriculture") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mpd-btn";
    b.innerHTML = '<span style="font-size:22px">🌾</span><span>Mission : acheter chez un producteur<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    var h = box.querySelector("h4"); if (h && h.nextSibling) box.insertBefore(b, h.nextSibling); else box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("business-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true, attributes: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionAgribiz = { ouvrir: ouvrir };
  if (/[?&]mission=agribiz/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-agribiz.js",e);}

try{
/* ---- diisoo-hotel-plus.js ---- */
/* diisoo-tour_hotel-plus.js v1 : Business, Hôtel (mode et beauté) enrichi
   Wolof des phrases existantes complété, +15 phrases, 1 dialogue. Wolof relu par Babacar.
   Desactivable : ?tour_hotel=0 */
(function () {
  "use strict";
  if (window.__diisooHôtelPlus || /[?&]tour_hotel=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.tour_hotel) return;
  window.__diisooHôtelPlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Do you have a free room tonight?",
"fr": "Vous avez une chambre libre ce soir ?",
"wo": "Ndax am nga benn néeg bu libre tey ci guddi ?"
},
{
"niveau": "debutant",
"en": "How much is one night?",
"fr": "Combien coûte une nuit ?",
"wo": "Ñaata la benn guddi ?"
},
{
"niveau": "debutant",
"en": "Can I see the room?",
"fr": "Je peux voir la chambre ?",
"wo": "Ndax mën naa gis néeg bi ?"
},
{
"niveau": "debutant",
"en": "Is there hot water?",
"fr": "Il y a de l'eau chaude ?",
"wo": "Ndax am na ndox mu tàng ?"
},
{
"niveau": "debutant",
"en": "I need a towel, please.",
"fr": "Il me faut une serviette, s'il vous plaît.",
"wo": "Dama soxla sërwiyet, bu la neexee."
},
{
"niveau": "intermediaire",
"en": "The air conditioning is not working.",
"fr": "La clim ne marche pas.",
"wo": "Klimatisëer bi du dox."
},
{
"niveau": "intermediaire",
"en": "Can I have a late check-out?",
"fr": "Je peux partir plus tard ?",
"wo": "Ndax mën naa génn ci ngoon ?"
},
{
"niveau": "intermediaire",
"en": "Can you wake me up at six?",
"fr": "Vous pouvez me réveiller à six heures ?",
"wo": "Ndax mën nga ma yeew ci juróom-benni waxtu ?"
},
{
"niveau": "intermediaire",
"en": "Where is the swimming pool?",
"fr": "Où est la piscine ?",
"wo": "Fan la pisin bi nekk ?"
},
{
"niveau": "intermediaire",
"en": "Can you call a taxi for me?",
"fr": "Vous pouvez m'appeler un taxi ?",
"wo": "Ndax mën nga ma woo taksi ?"
},
{
"niveau": "avance",
"en": "I booked online, but my name is not on the list.",
"fr": "J'ai réservé en ligne, mais mon nom n'est pas sur la liste.",
"wo": "Reserwe naa ci internet, waaye sama tur nekkul ci list bi."
},
{
"niveau": "avance",
"en": "Can you give me a receipt for my company?",
"fr": "Vous pouvez me faire un reçu pour mon entreprise ?",
"wo": "Ndax mën nga ma defal resi ngir sama àntërpiris ?"
},
{
"niveau": "avance",
"en": "There is too much noise in the next room.",
"fr": "Il y a trop de bruit dans la chambre d'à côté.",
"wo": "Am na coow lu bari ci néeg bi ci wetu sama bos."
},
{
"niveau": "avance",
"en": "I would like to extend my stay by two nights.",
"fr": "Je voudrais prolonger mon séjour de deux nuits.",
"wo": "Dama bëgg a yokk sama fanaan ñaari guddi."
},
{
"niveau": "avance",
"en": "Do you accept payment by card or mobile money?",
"fr": "Vous acceptez la carte ou le mobile money ?",
"wo": "Ndax dangeen di nangu faye kart walla mobile money ?"
}
];
  var L = [
{
"role": "client",
"en": "Excuse me. The air conditioning in my room is not working.",
"fr": "Excusez-moi. La clim de ma chambre ne marche pas.",
"wo": "Baal ma. Klimatisëer bi nekk ci sama néeg du dox.",
"scene": "🛎️ Un problème dans la chambre"
},
{
"role": "receptionniste",
"en": "I am very sorry. Which room are you in?",
"fr": "Je suis vraiment désolé. Vous êtes dans quelle chambre ?",
"wo": "Baal ma lool. Ban néeg nga nekk ?"
},
{
"role": "client",
"en": "Room twelve, on the second floor.",
"fr": "Chambre douze, au deuxième étage.",
"wo": "Néeg fukk ak ñaar, ci ñaareelu etaas bi."
},
{
"role": "receptionniste",
"en": "I will send a technician in ten minutes.",
"fr": "J'envoie un technicien dans dix minutes.",
"wo": "Dinaa yónnee teknisiyeŋ ci fukki simili."
},
{
"role": "client",
"en": "Thank you. Can I also have another towel?",
"fr": "Merci. Je peux aussi avoir une autre serviette ?",
"wo": "Jërëjëf. Ndax mën naa am beneen sërwiyet ?"
},
{
"role": "receptionniste",
"en": "Of course. I will bring it to your room.",
"fr": "Bien sûr. Je vous l'apporte dans votre chambre.",
"wo": "Waaw kay. Dinaa la ko indil ci sa néeg."
},
{
"role": "client",
"en": "If it is not fixed, can I change rooms?",
"fr": "Si ce n'est pas réparé, je peux changer de chambre ?",
"wo": "Su defaruwul, ndax mën naa soppi néeg ?"
},
{
"role": "receptionniste",
"en": "Yes, we have a free room on the third floor.",
"fr": "Oui, nous avons une chambre libre au troisième étage.",
"wo": "Waaw, am nanu benn néeg bu libre ci ñetteelu etaas bi."
}
];
  var FIX = {"Your room is on the second floor": "Sa néeg bi ci ñaareelu etaas bi la nekk.", "Breakfast is from seven to ten": "Ndékki li dafay tàmbali ci juróom-ñaari waxtu ba fukki waxtu.", "The Wi-Fi password is on the card": "Koodu Wi-Fi bi ci kart bi la nekk.", "A single room or a double room?": "Néeg bu benn nit walla néeg bu ñaari nit ?", "The price includes breakfast and taxes": "Njëg li dafa boole ndékki li ak taks yi.", "Check-out is at noon": "Génn gi dafay am ci midi.", "I can store your luggage until the evening": "Mën naa denc sa bagaas yi ba ngoon.", "Would you like air conditioning or a fan?": "Ndax bëgg nga klimatisëer walla wantilatëer ?", "We can arrange an airport transfer for you": "Mën nanu la yóbbu walla jëli la ci aeroport bi.", "Please fill in this registration form": "Bindal sa tur ci fiis bii, bu la neexee.", "I am sorry for the inconvenience. We will change your room immediately.": "Baal ma ci jafe-jafe bi. Dinanu soppi sa néeg bi léegi.", "The hot water is not working. Could you send someone?": "Ndox mu tàng mi du dox. Ndax mën nga yónnee ku ñëw ?", "We are fully booked, but I can offer you a room at our sister hotel.": "Sunu otel bi fees na, waaye mën naa la jox benn néeg ci beneen otel bi nu bokkal.", "For a stay of seven nights, I can offer a ten percent discount.": "Ngir juróom-ñaari guddi, mën naa la wàññil fukki pursaŋ ci njëg li.", "Could you recommend a quiet restaurant nearby?": "Ndax mën nga ma digal benn restoraŋ bu dal bu jege fii ?", "The cancellation is free up to forty-eight hours before arrival.": "Anile bi amul fay ba ñeent-fukk ak juróom-ñetti waxtu balaa ngay agsi.", "I would like to leave a review about your excellent service.": "Dama bëgg a bàyyi benn gis-gis ci sa liggéey bu rafet bi."};
  C.tour_hotel.vocab.forEach(function (v) { if (FIX[v.en]) v.wo = FIX[v.en]; });
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.tour_hotel.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.tour_hotel.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.tour_hotel.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.tour_hotel.vocab.length = 0; tri.forEach(function (t) { C.tour_hotel.vocab.push(t[0]); });
  D.tour_hotel = D.tour_hotel || [];
  var vus = {}; D.tour_hotel.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.tour_hotel.push(l); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-hotel-plus.js",e);}

try{
/* ---- diisoo-mission-hotel.js ---- */
/* diisoo-mission-hotel.js v1 : Mission « Accueillir un client à l'hôtel »
   L'app joue le vendeur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Hôtel ».
   Bouton place en haut du secteur « Hôtel » (Business). Essai : https://diisoo.sn/?mission=hotel */
(function () {
  "use strict";
  if (window.DiisooMissionHôtel) return;
  var Q = [
    { q: "Good evening. I have a reservation under the name Smith.", kw: /welcome|name|smith|passport|reservation|yes|room|check|see|good|evening|hello/i, m: "Welcome. Let me check your reservation." },
    { q: "How much is the room for one night?", kw: /thousand|francs|\d|euro|dollar|night|price|per|cost|breakfast/i, m: "It is forty thousand francs per night." },
    { q: "Is breakfast included?", kw: /yes|no|breakfast|included|include|seven|ten|morning|price|from/i, m: "Yes, breakfast is included, from seven to ten." },
    { q: "What time is check-out?", kw: /noon|twelve|eleven|ten|check|time|morning|late|at|o'clock/i, m: "Check-out is at noon." },
    { q: "The air conditioning is not working. Can you help me?", kw: /sorry|help|technician|send|change|room|minutes|fix|immediately|repair|moment/i, m: "I am sorry. I will send a technician now." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mht{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mht .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mht .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mht .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mht button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mht .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mht .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mht .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mht .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mht .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mht .ok{color:#25D366}#mht .or{color:#FFAA3C}" +
    "#mht-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mht-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mht")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mht";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🛎️ Hôtel · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mht-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mht-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mht-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mht-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mht-skip" type="button">Passer</button>' +
        '<button class="b3" id="mht-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mht-r"), mic = document.getElementById("mht-mic"), nx = document.getElementById("mht-next");
      document.getElementById("mht-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mht-x").onclick = function () { o.remove(); };
      document.getElementById("mht-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["hotel"]) BADGES["hotel"] = { icon: "🛎️", label: "Hôtel", desc: "Accueil à l'hôtel réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("hotel"); } catch (e) {}
      }
      noter("mission_hotel", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🛎️ Mission Hôtel</div><div class="q">' + (ok ? "Bien joué ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Hôtel » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du secteur Hôtel et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mht-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mht-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mht-x2" type="button">Fermer</button>';
      document.getElementById("mht-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mht-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mht-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon accueil à l'hôtel en anglais sur Diisoo 🛎️ (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("business-content");
    if (!box || box.classList.contains("hidden") || document.getElementById("mht-btn")) return;
    var id = ""; try { id = businessModule; } catch (e) {}
    if (id !== "tour_hotel") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mht-btn";
    b.innerHTML = '<span style="font-size:22px">🛎️</span><span>Mission : accueillir un client<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    var h = box.querySelector("h4"); if (h && h.nextSibling) box.insertBefore(b, h.nextSibling); else box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("business-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true, attributes: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionHôtel = { ouvrir: ouvrir };
  if (/[?&]mission=hotel/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-hotel.js",e);}

try{
/* ---- diisoo-restaurant-plus.js ---- */
/* diisoo-tour_resto-plus.js v1 : Business, Restaurant (mode et beauté) enrichi
   Wolof des phrases existantes complété, +15 phrases, 1 dialogue. Wolof relu par Babacar.
   Desactivable : ?tour_resto=0 */
(function () {
  "use strict";
  if (window.__diisooRestaurantPlus || /[?&]tour_resto=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.tour_resto) return;
  window.__diisooRestaurantPlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Do you have a free table?",
"fr": "Vous avez une table libre ?",
"wo": "Ndax am nga taabal bu libre ?"
},
{
"niveau": "debutant",
"en": "I would like to see the menu.",
"fr": "Je voudrais voir la carte.",
"wo": "Dama bëgg a gis menu bi."
},
{
"niveau": "debutant",
"en": "What do you recommend?",
"fr": "Que recommandez-vous ?",
"wo": "Lan nga may digal ?"
},
{
"niveau": "debutant",
"en": "A bottle of water, please.",
"fr": "Une bouteille d'eau, s'il vous plaît.",
"wo": "Benn butéelu ndox, bu la neexee."
},
{
"niveau": "debutant",
"en": "Chicken with rice, please.",
"fr": "Du poulet avec du riz, s'il vous plaît.",
"wo": "Ginaar ak ceeb, bu la neexee."
},
{
"niveau": "intermediaire",
"en": "Is the thieboudienne ready?",
"fr": "Le thieboudienne est prêt ?",
"wo": "Ndax ceebu jën bi pare na ?"
},
{
"niveau": "intermediaire",
"en": "How long do we have to wait?",
"fr": "On doit attendre combien de temps ?",
"wo": "Ñaata waxtu lanu war a xaar ?"
},
{
"niveau": "intermediaire",
"en": "Can I have a little more sauce?",
"fr": "Je peux avoir un peu plus de sauce ?",
"wo": "Ndax mën naa am tuuti soos bu ñu yokk ?"
},
{
"niveau": "intermediaire",
"en": "We are four. Can you push two tables together?",
"fr": "Nous sommes quatre. Vous pouvez rapprocher deux tables ?",
"wo": "Nun ñeent lanu. Ndax mën nga boole ñaari taabal ?"
},
{
"niveau": "intermediaire",
"en": "Can I pay with Wave?",
"fr": "Je peux payer avec Wave ?",
"wo": "Ndax mën naa faye ci Wave ?"
},
{
"niveau": "avance",
"en": "I have a food allergy. Does this dish contain fish?",
"fr": "J'ai une allergie alimentaire. Ce plat contient du poisson ?",
"wo": "Am naa aleerji ci lekk. Ndax ñam wii am na jën ?"
},
{
"niveau": "avance",
"en": "The dish is not what I ordered. Can you change it?",
"fr": "Ce plat n'est pas ce que j'ai commandé. Vous pouvez le changer ?",
"wo": "Lekk bii du li ma komànde woon. Ndax mën nga ko soppi ?"
},
{
"niveau": "avance",
"en": "There is a mistake on the bill.",
"fr": "Il y a une erreur sur la facture.",
"wo": "Am na njuumte ci faktir bi."
},
{
"niveau": "avance",
"en": "Can you prepare a birthday cake for Saturday evening?",
"fr": "Vous pouvez préparer un gâteau d'anniversaire pour samedi soir ?",
"wo": "Ndax mën nga defar gato ngir bésu juddu gaawu ci guddi ?"
},
{
"niveau": "avance",
"en": "I would like to leave feedback for the chef.",
"fr": "Je voudrais faire un compliment au chef.",
"wo": "Dama bëgg a sant njiitu kuisinye yi."
}
];
  var L = [
{
"role": "client",
"en": "Hello. I would like to book a table for eight people.",
"fr": "Bonjour. Je voudrais réserver une table pour huit personnes.",
"wo": "Jàmm nga fanaan. Dama bëgg a reserwe benn taabal ngir juróom-ñetti nit.",
"scene": "🍽️ Réserver une table pour un groupe"
},
{
"role": "serveur",
"en": "Of course. For which day and what time?",
"fr": "Bien sûr. Pour quel jour et à quelle heure ?",
"wo": "Waaw kay. Ngir ban bés ak ban waxtu ?"
},
{
"role": "client",
"en": "Saturday evening at eight o'clock.",
"fr": "Samedi soir à vingt heures.",
"wo": "Gaawu ci guddi ci juróom-ñetti waxtu."
},
{
"role": "serveur",
"en": "Perfect. Is it for a special occasion?",
"fr": "Parfait. C'est pour une occasion spéciale ?",
"wo": "Baax na lool. Ndax ngir benn xew-xew bu espesiyaal la ?"
},
{
"role": "client",
"en": "Yes, it is a birthday. Can you prepare a cake?",
"fr": "Oui, c'est un anniversaire. Vous pouvez préparer un gâteau ?",
"wo": "Waaw, bésu juddu la. Ndax mën nga defar gato ?"
},
{
"role": "serveur",
"en": "Yes, no problem. May I have your name and number?",
"fr": "Oui, pas de problème. Je peux avoir votre nom et votre numéro ?",
"wo": "Waaw, amul jafe-jafe. Ndax mën naa am sa tur ak sa nimero ?"
},
{
"role": "client",
"en": "Babacar, and my number is seven seven, two eight eight, two one, zero nine.",
"fr": "Babacar, et mon numéro est le 77 288 21 09.",
"wo": "Babacar, te sama nimero mooy juróom-ñaar juróom-ñaar, ñaar juróom-ñett juróom-ñett, ñaar benn, tus juróom-ñeent."
},
{
"role": "serveur",
"en": "Thank you, your table is reserved. See you on Saturday.",
"fr": "Merci, votre table est réservée. À samedi.",
"wo": "Jërëjëf, sa taabal bi reserwe nañu ko. Ba gaawu."
}
];
  var FIX = {"Today's special is chicken yassa": "Plaa bu bés bi mooy yassa ginaar.", "Is it spicy?": "Ndax dafa saf kaani ?", "I am allergic to peanuts": "Gerte dafay ma yakk.", "Can I have it without pepper?": "Ndax mën naa ko am te amul kaani ?", "Would you like to try the bissap juice?": "Ndax bëgg nga mos ndoxum bissap ?", "Do you accept card or mobile money?": "Ndax dangeen di nangu faye kart walla mobile money ?", "We recommend the grilled fish with onion sauce": "Dañuy digal jën wu ñu lakk ak soosu sooble.", "Could you recommend a typical Senegalese dish for someone who has never tried it?": "Ndax mën nga ma digal benn ñamu Senegaal ngir ku masul koo mos ?", "This dish is cold. Could you heat it up, please?": "Lekk bii dafa sedd. Ndax mën nga ko tàngal, bu la neexee ?", "We have a vegetarian menu and a halal kitchen.": "Am nanu menu bu amul yàpp ak waañ bu alal.", "I would like to book the terrace for a group of twelve on Saturday.": "Dama bëgg a reserwe teras bi ngir benn gurup bu fukk ak ñaari nit ci gaawu.", "The service was excellent, please keep the change.": "Liggéey bi baax na lool, jëlal xaalis bi ci des.", "We can prepare a set menu for tour groups at a fixed price.": "Mën nanu defar menu bu tënku ngir gurup yu turis ci benn njëg.", "Could we split the bill between four people?": "Ndax mën nanu séddoo faktir bi ci ñeenti nit ?"};
  C.tour_resto.vocab.forEach(function (v) { if (FIX[v.en]) v.wo = FIX[v.en]; });
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.tour_resto.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.tour_resto.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.tour_resto.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.tour_resto.vocab.length = 0; tri.forEach(function (t) { C.tour_resto.vocab.push(t[0]); });
  D.tour_resto = D.tour_resto || [];
  var vus = {}; D.tour_resto.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.tour_resto.push(l); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-restaurant-plus.js",e);}

try{
/* ---- diisoo-mission-restaurant.js ---- */
/* diisoo-mission-restaurant.js v1 : Mission « Servir un client au restaurant »
   L'app joue le vendeur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Restaurant ».
   Bouton place en haut du secteur « Restaurant » (Business). Essai : https://diisoo.sn/?mission=restaurant */
(function () {
  "use strict";
  if (window.DiisooMissionRestaurant) return;
  var Q = [
    { q: "Good evening. A table for four, please.", kw: /table|welcome|sure|yes|follow|here|seat|four|evening|please|come/i, m: "Good evening. Please follow me, this is your table." },
    { q: "What do you recommend?", kw: /recommend|fish|chicken|yassa|thieboudienne|special|rice|today|dish|try/i, m: "I recommend the chicken yassa." },
    { q: "Is it spicy? I do not like pepper.", kw: /no|not|spicy|pepper|mild|little|can|without|prepare|sure/i, m: "It is not too spicy. I can make it without pepper." },
    { q: "Can I have a bottle of water and a bissap juice?", kw: /water|bissap|juice|yes|sure|of course|drink|bring|minute|please/i, m: "Of course. I will bring them now." },
    { q: "The bill, please. Can I pay with Wave?", kw: /wave|yes|card|cash|mobile|pay|bill|total|francs|thank|\d/i, m: "Yes, you can pay with Wave. The total is eight thousand francs." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mrs{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mrs .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mrs .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mrs .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mrs button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mrs .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mrs .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mrs .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mrs .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mrs .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mrs .ok{color:#25D366}#mrs .or{color:#FFAA3C}" +
    "#mrs-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mrs-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mrs")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mrs";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🍽️ Restaurant · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mrs-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mrs-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mrs-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mrs-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mrs-skip" type="button">Passer</button>' +
        '<button class="b3" id="mrs-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mrs-r"), mic = document.getElementById("mrs-mic"), nx = document.getElementById("mrs-next");
      document.getElementById("mrs-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mrs-x").onclick = function () { o.remove(); };
      document.getElementById("mrs-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["restaurant"]) BADGES["restaurant"] = { icon: "🍽️", label: "Restaurant", desc: "Service au restaurant réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("restaurant"); } catch (e) {}
      }
      noter("mission_restaurant", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🍽️ Mission Restaurant</div><div class="q">' + (ok ? "Bien joué ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Restaurant » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du secteur Restaurant et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mrs-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mrs-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mrs-x2" type="button">Fermer</button>';
      document.getElementById("mrs-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mrs-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mrs-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon service au restaurant en anglais sur Diisoo 🍽️ (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("business-content");
    if (!box || box.classList.contains("hidden") || document.getElementById("mrs-btn")) return;
    var id = ""; try { id = businessModule; } catch (e) {}
    if (id !== "tour_resto") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mrs-btn";
    b.innerHTML = '<span style="font-size:22px">🍽️</span><span>Mission : servir un client<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    var h = box.querySelector("h4"); if (h && h.nextSibling) box.insertBefore(b, h.nextSibling); else box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("business-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true, attributes: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionRestaurant = { ouvrir: ouvrir };
  if (/[?&]mission=restaurant/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-restaurant.js",e);}

try{
/* ---- diisoo-guide-plus.js ---- */
/* diisoo-tour_guide-plus.js v1 : Business, Guide (mode et beauté) enrichi
   Wolof des phrases existantes complété, +15 phrases, 1 dialogue. Wolof relu par Babacar.
   Desactivable : ?tour_guide=0 */
(function () {
  "use strict";
  if (window.__diisooGuidePlus || /[?&]tour_guide=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.tour_guide) return;
  window.__diisooGuidePlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Good morning. Are you ready?",
"fr": "Bonjour. Vous êtes prêts ?",
"wo": "Jàmm ngeen fanaan. Ndax pare ngeen ?"
},
{
"niveau": "debutant",
"en": "Where are you from?",
"fr": "Vous venez d'où ?",
"wo": "Fan ngeen jóge ?"
},
{
"niveau": "debutant",
"en": "Stay together, please.",
"fr": "Restez ensemble, s'il vous plaît.",
"wo": "Àndleen benn, bu leen neexee."
},
{
"niveau": "debutant",
"en": "Do you need a toilet?",
"fr": "Vous avez besoin des toilettes ?",
"wo": "Ndax soxla ngeen wànaag ?"
},
{
"niveau": "debutant",
"en": "This way, please.",
"fr": "Par ici, s'il vous plaît.",
"wo": "Fii la, bu la neexee."
},
{
"niveau": "intermediaire",
"en": "The museum opens at nine.",
"fr": "Le musée ouvre à neuf heures.",
"wo": "Musée bi dafay ubbi ci juróom-ñeenti waxtu."
},
{
"niveau": "intermediaire",
"en": "You can buy tickets at the entrance.",
"fr": "Vous pouvez acheter les billets à l'entrée.",
"wo": "Mën ngeen jënd tike yi ci bunt bi."
},
{
"niveau": "intermediaire",
"en": "We will have lunch after the visit.",
"fr": "Nous déjeunerons après la visite.",
"wo": "Dinanu añ gannaaw seeti bi."
},
{
"niveau": "intermediaire",
"en": "This tree is more than five hundred years old.",
"fr": "Cet arbre a plus de cinq cents ans.",
"wo": "Garab gii màgg na ba weesu juróom-téeméeri at."
},
{
"niveau": "intermediaire",
"en": "Please do not touch the objects.",
"fr": "Merci de ne pas toucher les objets.",
"wo": "Buleen laal yëf yi, bu leen neexee."
},
{
"niveau": "avance",
"en": "This village is known for its traditional fishing.",
"fr": "Ce village est connu pour sa pêche traditionnelle.",
"wo": "Dëkk bii xam nañu ko ci nàpp gu aada."
},
{
"niveau": "avance",
"en": "I will tell you the story of the island.",
"fr": "Je vais vous raconter l'histoire de l'île.",
"wo": "Dinaa leen nettali taariixu dunu bi."
},
{
"niveau": "avance",
"en": "If it rains, we will visit the museum instead.",
"fr": "S'il pleut, nous visiterons le musée à la place.",
"wo": "Su tawee, dinanu seeti musée bi ci palaas bi."
},
{
"niveau": "avance",
"en": "Would you like to meet a local family?",
"fr": "Voulez-vous rencontrer une famille locale ?",
"wo": "Ndax bëgg ngeen gis benn njaboot gu dëkk fii ?"
},
{
"niveau": "avance",
"en": "The bus will pick you up at the hotel at eight.",
"fr": "Le bus passera vous prendre à l'hôtel à huit heures.",
"wo": "Kaar bi dina ñëw jël leen ci otel bi ci juróom-ñetti waxtu."
}
];
  var L = [
{
"role": "guide",
"en": "Welcome to Gorée Island. Please stay together.",
"fr": "Bienvenue sur l'île de Gorée. Restez ensemble, s'il vous plaît.",
"wo": "Dalal ak jàmm ci dunu Gorée. Àndleen benn, bu leen neexee.",
"scene": "🧭 Visite de Gorée"
},
{
"role": "touriste",
"en": "Thank you. What is the history of this island?",
"fr": "Merci. Quelle est l'histoire de cette île ?",
"wo": "Jërëjëf. Lan mooy taariixu dunu bii ?"
},
{
"role": "guide",
"en": "For many years, it was a place where people were sent as slaves.",
"fr": "Pendant de nombreuses années, c'était un lieu d'où l'on envoyait des gens comme esclaves.",
"wo": "Ci at yu bari, fii lañu daan yóbbu nit ñi ñu def leen jaam."
},
{
"role": "touriste",
"en": "That is very sad. Can we visit the House of Slaves?",
"fr": "C'est très triste. Nous pouvons visiter la Maison des Esclaves ?",
"wo": "Dafa naqari lool. Ndax mën nanu seeti Maison des Esclaves ?"
},
{
"role": "guide",
"en": "Yes, it is on the left. The entrance is two thousand francs.",
"fr": "Oui, elle est à gauche. L'entrée coûte deux mille francs.",
"wo": "Waaw, ci càmmoñ la nekk. Dugg bi ñaari junni farã la."
},
{
"role": "touriste",
"en": "Can I take photos inside?",
"fr": "Je peux prendre des photos à l'intérieur ?",
"wo": "Ndax mën naa jël nataal ci biir ?"
},
{
"role": "guide",
"en": "Yes, but please be respectful.",
"fr": "Oui, mais soyez respectueux, s'il vous plaît.",
"wo": "Waaw, waaye wormaal fi, bu la neexee."
},
{
"role": "touriste",
"en": "Of course. Thank you for the explanation.",
"fr": "Bien sûr. Merci pour l'explication.",
"wo": "Waaw kay. Jërëjëf ci leeral bi."
}
];
  var FIX = {"Be careful, the road is slippery": "Moytul, yoon wi dafa tarax.", "Do you want to take a photo?": "Ndax bëgg nga jël nataal ?", "We will stop here for ten minutes": "Dinanu taxaw fii fukki simili.", "The boat leaves at nine from the Dakar pier": "Gaal gi dafay dem ci juróom-ñeenti waxtu ci waaxu Ndakaaru.", "The visit lasts about three hours": "Seeti bi dafay jël lu tollook ñetti waxtu.", "The House of Slaves is an important memorial": "Kër gi ñuy wax Maison des Esclaves am na solo lool ci taariix bi.", "At Lake Retba the water is pink because of the algae": "Ci Lac Rose, ndox mi dafa xonq ndax alg yi.", "Please wear a hat and sun cream": "Solal mbaxana te diw kerem ngir jant bi, bu la neexee.", "The entrance fee is not included": "Njëg li ñuy fay ngir dugg bokkul ci.", "Do you want to see the baobab trees or the birds?": "Ndax bëgg nga gis guy yi walla picc yi ?", "Our two-day tour includes the Saloum Delta, a night in a lodge and all meals.": "Sunu tukki bu ñaari fan bi dafay boole Saalum, benn guddi ci lotel ak lekk yépp.", "The price is per person, based on a minimum of four travellers.": "Njëg li ci nit ku nekk la, te dafa laaj ñeenti nit ba ci kaw.", "Due to the weather, we have to change the programme. I apologise.": "Ndax jaww ji, war nanu soppi porogaraam bi. Baal ma.", "Please keep your valuables with you and respect local customs.": "Dencal sa yëf yu am solo ci yaw, te wormaal aaday réew mi.", "May I ask your permission before taking photos of people?": "Ndax mën naa la ñaan ndigal balaa may jël nataali nit ñi ?", "We can adapt the tour for families with young children.": "Mën nanu soppi tukki bi ngir njaboot yu am xale yu ndaw.", "Cancellations made less than forty-eight hours before are not refunded.": "Anile bi ñuy def lu yées ñeent-fukk ak juróom-ñetti waxtu balaa agsi bi, amul fay."};
  C.tour_guide.vocab.forEach(function (v) { if (FIX[v.en]) v.wo = FIX[v.en]; });
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.tour_guide.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.tour_guide.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.tour_guide.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.tour_guide.vocab.length = 0; tri.forEach(function (t) { C.tour_guide.vocab.push(t[0]); });
  D.tour_guide = D.tour_guide || [];
  var vus = {}; D.tour_guide.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.tour_guide.push(l); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-guide-plus.js",e);}
