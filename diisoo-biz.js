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
    try { return Object.keys(BUSINESS_SECTORS).filter(function (k) { return CHINA_TRADE_WOLOF[k] && CHINA_TRADE_WOLOF[k].vocab.length; }); } catch (e) { return []; }
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
    "#biz-grid button.bz-m{grid-column:1/-1;border-color:#3FAE74}" +
    "#biz-grid button.bz-t{grid-column:1/-1;border-color:#F3A94E;background:#1B1A22}" +
    "body:has(#screen-business:not(.hidden)) [role=main]{min-height:0!important;padding:60px 14px 10px!important;justify-content:flex-start!important}" +
    "body:has(#bizback-sec) #screen-business>div.text-center{display:none!important}" +
    "body:has(#bizstep) #screen-business>div.text-center,body:has(#bizstep) #fx-biz-btn,body:has(#bizback-sec) #fx-biz-btn,body:has(#bizback-sec) #bizback-lvl,body:has(#bizback-sec) #secteurs-zone{display:none!important}" +
    "body:has(#bizback-sec) #screen-business:not(.hidden){display:flex;flex-direction:row;flex-wrap:wrap;gap:8px;align-content:flex-start;margin:0!important}" +
    "body:has(#bizback-sec) #screen-business>*{flex:0 0 100%;margin:0!important}" +
    "body:has(#bizback-sec) #dsn-btn-business,body:has(#bizback-sec) #dcv-btn-business{flex:1 1 calc(50% - 4px)!important;min-width:0;padding:8px 10px!important;font-size:12px!important;line-height:1.2!important;min-height:48px;width:auto!important}" +
    "body:has(#bizstep) #screen-business,body:has(#bizback-lvl) #screen-business{margin:0!important}" +
    "body:has(#screen-business:not(.hidden)):has(#bizback-sec) [role=main]{padding-top:4px!important}" +
    "body:has(#bizback-sec) #business-content .fx-lab{display:none}" +
    "body:has(#bizback-sec) #business-content .fx-nav{padding:0}" +
    "body:has(#bizback-sec) #business-content [data-practice]{min-height:0!important;height:auto!important;padding:6px 8px!important;display:flex!important;flex-direction:row!important;align-items:center;justify-content:center;gap:8px}" +
    "body:has(#bizback-sec) #business-content [data-practice] .dii-i{font-size:18px!important;line-height:1!important;margin:0!important;width:auto!important;height:auto!important}" +
    "body:has(#bizback-sec) #business-content [data-practice] .dii-c{font-size:12px!important;margin:0!important}" +
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
    if (nbT) g.appendChild(tuile("🏝️", "Tourisme", "Hôtel, restaurant, guide, taxi, plage... · " + nbT + " phrases", function () { tourisme(n); }, "bz-t"));
    if (marchesDispo()) g.appendChild(tuile("🛒", "Anglais des marchés", "Colobane, Sandaga, Centenaire, Guangzhou", ouvrirMarches, "bz-m"));
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
