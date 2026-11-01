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
