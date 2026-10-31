/* diisoo-orga.js : organisation des menus (remplace diisoo-menus.js)
   Anglais et Wolof : on choisit d'abord le niveau, puis on ne voit que les themes de ce niveau.
   Business et Examens : grille propre, rien de cache sur le cote, pas de doublon. */
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
    "#general-tabs>*,#wolof-tabs>*,#business-tabs>*{margin:0!important;width:100%;min-height:44px;" +
    "padding:6px 10px!important;font-size:12px!important;line-height:1.2;text-align:left;" +
    "white-space:normal!important;border-radius:14px!important;box-sizing:border-box}" +
    "#general-content,#lexicon-container,#business-content{max-height:none!important;overflow:visible!important}" +
    "#general-tabs.lvl-hide,#wolof-tabs.lvl-hide,#general-content.lvl-hide,#lexicon-container.lvl-hide,.lvl-hide{display:none!important}" +
    /* Choix du niveau */
    ".lvl-picker{display:flex;flex-direction:column;gap:10px}" +
    ".lvl-title{text-align:center;font-size:13px;font-weight:700;color:#F6F1E7;margin:4px 0}" +
    ".lvl-btn{display:flex;align-items:center;gap:12px;width:100%;min-height:64px;padding:10px 14px;" +
    "background:#141A2B;border:1px solid #1E2740;border-radius:16px;color:#F6F1E7;text-align:left}" +
    ".lvl-btn:active{border-color:#E1693F}" +
    ".lvl-btn.lock{opacity:.5}" +
    ".lvl-ic{font-size:26px;line-height:1}" +
    ".lvl-nm{font-size:14px;font-weight:800;line-height:1.2}" +
    ".lvl-sub{font-size:11px;color:#A69C86;font-weight:400;margin-top:2px}" +
    ".lvl-back{width:100%;min-height:36px;padding:6px 12px;background:#10251A;border:1px solid #3FAE74;" +
    "border-radius:12px;color:#5FC98F;font-size:12px;font-weight:700;text-align:left}";
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
  var oldApply = window.applyTierLocks;
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

  function retirerBack(key) { var b = $("lvlback-" + key); if (b) b.remove(); }

  function afficherPicker(key) {
    var c = KEYS[key], box = $(c.tabs), content = $(c.content);
    if (!box) return;
    lvl[key] = null; filtrer(key);
    var counts = [0, 0, 0];
    Array.prototype.forEach.call(box.children, function (b) { counts[+b.dataset.lvl - 1]++; });
    var p = $("lvl-" + key);
    if (!p) { p = document.createElement("div"); p.id = "lvl-" + key; p.className = "lvl-picker"; box.parentNode.insertBefore(p, box); }
    p.innerHTML = "";
    var t = document.createElement("p"); t.className = "lvl-title"; t.textContent = "Choisis ton niveau"; p.appendChild(t);
    var un = unlocked(key);
    [1, 2, 3].forEach(function (L) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "lvl-btn" + (L > un ? " lock" : "");
      b.innerHTML = '<span class="lvl-ic">' + (L > un ? "🔒" : ICONS[L - 1]) + '</span><span><span class="lvl-nm">' +
        NAMES[L - 1] + '</span><br><span class="lvl-sub">' + counts[L - 1] + " " + c.unit + "</span></span>";
      b.onclick = function () { choisir(key, L); };
      p.appendChild(b);
    });
    p.style.display = "";
    box.classList.add("lvl-hide");
    if (content) content.classList.add("lvl-hide");
    retirerBack(key);
  }

  function choisir(key, L) {
    if (L > unlocked(key)) {
      try { toast("🔒 Termine d'abord le niveau " + NAMES[L - 2]); } catch (e) {}
      return;
    }
    var c = KEYS[key], box = $(c.tabs), content = $(c.content);
    lvl[key] = L;
    $("lvl-" + key).style.display = "none";
    box.classList.remove("lvl-hide");
    if (content) content.classList.remove("lvl-hide");
    filtrer(key);
    retirerBack(key);
    var back = document.createElement("button");
    back.type = "button"; back.id = "lvlback-" + key; back.className = "lvl-back";
    back.textContent = ICONS[L - 1] + " " + NAMES[L - 1] + " : changer de niveau";
    back.onclick = function () { afficherPicker(key); };
    box.parentNode.insertBefore(back, box);
    var first = Array.prototype.slice.call(box.children).filter(function (b) { return b.style.display !== "none"; })[0];
    if (first) first.click();
  }

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
})();
