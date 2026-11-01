/* diisoo-assistant.js v1 : assistant d'equivalences dans les lecons
   Sous chaque mot ou phrase d'anglais (Anglais general, Business), un bouton « 💡 Autre façon de le dire » :
   - des equivalents : plus poli, plus simple, plus courant (regles et synonymes courants)
   - des phrases de la meme situation qui utilisent le meme mot
   Chaque proposition se lit a voix haute (🔊). Rien n'est affiche s'il n'y a rien d'utile a ajouter.
   Fonctionne sans connexion : aucune requete reseau. */
(function () {
  "use strict";

  /* ---------- equivalents ---------- */
  var REGLES = [
    [/^I want to (.+?)([.!?]?)$/i, function (m) { return [["I would like to " + m[1] + m[2], "Plus poli"]]; }],
    [/^I want (a |an |the |some )?(.+?)([.!?]?)$/i, function (m) { return [["I would like " + (m[1] || "") + m[2] + m[3], "Plus poli"]]; }],
    [/^I need (.+?)([.!?]?)$/i, function (m) { return [["I am looking for " + m[1] + m[2], "Plus courant au magasin"], ["I would like " + m[1] + m[2], "Plus poli"]]; }],
    [/^Can I (.+?)\?$/i, function (m) { return [["May I " + m[1] + "?", "Plus formel"], ["Could I " + m[1] + "?", "Plus poli"]]; }],
    [/^Can you (.+?)\?$/i, function (m) { return [["Could you " + m[1] + "?", "Plus poli"], ["Would you mind helping me to " + m[1] + "?", "Très poli"]]; }],
    [/^How much is (it|this|that)\?$/i, function () { return [["What is the price?", "Autre façon de demander le prix"], ["How much does it cost?", "Même sens"]]; }],
    [/^How much is (.+?)\?$/i, function (m) { return [["What is the price of " + m[1] + "?", "Autre façon de demander le prix"], ["How much does " + m[1] + " cost?", "Même sens"]]; }],
    [/^Where is (.+?)\?$/i, function (m) { return [["Could you tell me where " + m[1] + " is?", "Plus poli"], ["Do you know where " + m[1] + " is?", "Plus courant"]]; }],
    [/^Do you have (.+?)\?$/i, function (m) { return [["Is there " + m[1] + " available?", "Plus formel"], ["Have you got " + m[1] + "?", "Anglais britannique"]]; }],
    [/^I am from (.+?)([.!?]?)$/i, function (m) { return [["I come from " + m[1] + m[2], "Même sens"]]; }],
    [/^My name is (.+?)([.!?]?)$/i, function (m) { return [["I am " + m[1] + m[2], "Plus court"], ["Call me " + m[1] + m[2], "Plus amical"]]; }],
    [/^Thank you( very much)?([.!?]?)$/i, function () { return [["Thanks a lot!", "Plus amical"], ["I really appreciate it.", "Plus fort"]]; }],
    [/^You are welcome([.!?]?)$/i, function () { return [["No problem!", "Plus amical"], ["My pleasure.", "Plus poli"]]; }],
    [/^Nice to meet you([.!?]?)$/i, function () { return [["Pleased to meet you.", "Plus formel"]]; }],
    [/^I do not understand([.!?]?)$/i, function () { return [["Could you repeat that, please?", "Plus utile pour continuer"], ["Sorry, I did not catch that.", "Plus courant"]]; }],
    [/^That is too expensive([.!?]?)$/i, function () { return [["That is a bit pricey.", "Plus doux"], ["Can you give me a better price?", "Pour négocier"]]; }],
    [/^I will take it([.!?]?)$/i, function () { return [["I will buy it.", "Plus simple"], ["I will have it.", "Plus courant"]]; }],
    [/^I have a reservation([.!?]?)$/i, function () { return [["I booked a room.", "Plus simple"]]; }],
    [/^Excuse me(,)? (.+)$/i, function (m) { return [["Sorry to bother you, " + m[2].charAt(0).toLowerCase() + m[2].slice(1), "Plus poli"]]; }]
  ];
  var SYN = {
    cheap: ["inexpensive", "Plus formel"], expensive: ["pricey", "Plus courant"], big: ["large", "Plus formel"],
    small: ["little", "Plus simple"], buy: ["purchase", "Plus formel"], start: ["begin", "Plus formel"],
    help: ["assist", "Plus formel"], ask: ["request", "Plus formel"], fast: ["quick", "Même sens"],
    beautiful: ["lovely", "Plus courant"], delicious: ["tasty", "Plus simple"], hello: ["hi", "Plus amical"],
    goodbye: ["see you later", "Plus amical"], yes: ["of course", "Plus fort"], house: ["home", "Plus chaleureux"],
    car: ["vehicle", "Plus formel"], money: ["cash", "Plus précis"], job: ["work", "Plus simple"],
    tired: ["exhausted", "Plus fort"], happy: ["glad", "Plus simple"], hungry: ["starving", "Plus fort"],
    friend: ["buddy", "Plus amical"], shop: ["store", "Américain"], boss: ["manager", "Plus formel"],
    problem: ["issue", "Plus formel"], price: ["cost", "Même sens"], order: ["request", "Même sens"],
    near: ["close", "Même sens"], far: ["distant", "Plus formel"], wrong: ["incorrect", "Plus formel"]
  };

  function equivalents(en) {
    var out = [], t = String(en || "").trim();
    for (var i = 0; i < REGLES.length; i++) {
      var m = REGLES[i][0].exec(t);
      if (m) { out = out.concat(REGLES[i][1](m)); break; }
    }
    var mot = t.toLowerCase().replace(/[^a-z]/g, "");
    if (!out.length && SYN[mot]) out.push([SYN[mot][0].charAt(0).toUpperCase() + SYN[mot][0].slice(1), SYN[mot][1]]);
    return out.filter(function (x) { return x[0].toLowerCase() !== t.toLowerCase(); }).slice(0, 2);
  }

  /* ---------- phrases de la meme situation ---------- */
  var STOP = /^(the|and|you|are|was|for|with|have|this|that|what|your|from|please|would|could|there|will|can|how|not|but|any|our|its|his|her|she|him|they|them|who|why|may)$/;
  function motsCles(s) {
    return String(s || "").toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter(function (w) { return w.length > 3 && !STOP.test(w); });
  }
  function voisines(item, banque, deja) {
    var ks = motsCles(item.en), out = [];
    if (!ks.length) return out;
    banque.forEach(function (x) {
      if (!x || !x.en || x.en === item.en || deja[x.en]) return;
      var kx = motsCles(x.en), commun = ks.filter(function (k) { return kx.indexOf(k) > -1; }).length;
      if (commun) { out.push({ en: x.en, fr: x.fr || "", n: commun }); deja[x.en] = 1; }
    });
    out.sort(function (a, b) { return b.n - a.n || a.en.length - b.en.length; });
    return out.slice(0, 2);
  }

  /* ---------- source de chaque carte ---------- */
  function sourceDe(card) {
    var b = card.querySelector("[data-practice]");
    var bl = card.querySelector("[data-practice^='gen-l:']");
    try {
      if (bl) {
        var p = bl.dataset.practice.split(":"), th = GENERAL_THEMES.filter(function (t) { return t.id === p[1]; })[0];
        if (!th) return null;
        var banque = (th.vocab || []).concat((th.dialogue || []).map(function (d) { return { en: d.en, fr: d.fr }; }));
        return { item: th.vocab[+p[2]], banque: banque };
      }
      var bb = card.querySelector("[data-practice^='biz:']");
      if (bb) {
        var q = bb.dataset.practice.split(":"), mod = CHINA_TRADE_WOLOF[q[1]];
        var dl = (BUSINESS_DIALOGUES[q[1]] || []).map(function (d) { return { en: d.en, fr: d.fr }; });
        return { item: mod.vocab[+q[2]], banque: mod.vocab.concat(dl) };
      }
    } catch (e) {}
    void b;
    return null;
  }

  /* ---------- interface ---------- */
  var st = document.createElement("style");
  st.textContent =
    ".as-btn{width:100%;min-height:44px;margin-top:8px;border-radius:14px;background:#1A1530;border:1px solid #5B3FA0;color:#C9B6F2;font-size:12px;font-weight:700}" +
    ".as-box{margin-top:8px;display:flex;flex-direction:column;gap:6px}" +
    ".as-l{display:flex;align-items:center;gap:10px;background:#141A2B;border:1px solid #1E2740;border-radius:12px;padding:8px 10px}" +
    ".as-t{flex:1;font-size:13px;font-weight:700;color:#F6F1E7;line-height:1.25}" +
    ".as-t small{display:block;font-size:11px;font-weight:400;color:#A69C86;margin-top:1px}" +
    ".as-s{flex:0 0 auto;width:44px;height:44px;border-radius:50%;background:#25D366;border:0;color:#fff;font-size:18px}" +
    ".as-h{font-size:11px;font-weight:700;color:#8C8064;text-transform:uppercase;letter-spacing:.06em;margin-top:4px}";
  document.head.appendChild(st);

  function ligne(en, note) {
    var d = document.createElement("div"); d.className = "as-l";
    var t = document.createElement("div"); t.className = "as-t";
    t.textContent = en;
    if (note) { var s = document.createElement("small"); s.textContent = note; t.appendChild(s); }
    var b = document.createElement("button"); b.type = "button"; b.className = "as-s"; b.textContent = "🔊";
    b.setAttribute("aria-label", "Écouter : " + en);
    b.onclick = function (ev) { ev.stopPropagation(); try { speak(en, "en-US", 0.85); } catch (e) {} };
    d.appendChild(t); d.appendChild(b);
    return d;
  }

  function equiper(card) {
    if (card.__as) return;
    var src = sourceDe(card);
    if (!src || !src.item) return;
    card.__as = true;
    var eq = equivalents(src.item.en);
    var deja = {}; deja[src.item.en] = 1;
    eq.forEach(function (x) { deja[x[0]] = 1; });
    var vo = voisines(src.item, src.banque || [], deja);
    if (!eq.length && !vo.length) return;
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "as-btn"; btn.textContent = "💡 Autre façon de le dire";
    var box = document.createElement("div"); box.className = "as-box"; box.style.display = "none";
    if (eq.length) {
      var h1 = document.createElement("div"); h1.className = "as-h"; h1.textContent = "Même idée"; box.appendChild(h1);
      eq.forEach(function (x) { box.appendChild(ligne(x[0], x[1])); });
    }
    if (vo.length) {
      var h2 = document.createElement("div"); h2.className = "as-h"; h2.textContent = "Dans la même situation"; box.appendChild(h2);
      vo.forEach(function (x) { box.appendChild(ligne(x.en, x.fr)); });
    }
    btn.onclick = function () {
      var ouvert = box.style.display !== "none";
      box.style.display = ouvert ? "none" : "flex";
      btn.textContent = ouvert ? "💡 Autre façon de le dire" : "💡 Masquer";
    };
    var grille = card.querySelector(".grid") || card.lastElementChild;
    if (grille && grille.parentNode === card) card.insertBefore(btn, grille.nextSibling); else card.appendChild(btn);
    card.insertBefore(box, btn.nextSibling);
  }

  var plan = false;
  function balayer() {
    if (plan) return; plan = true;
    requestAnimationFrame(function () {
      plan = false;
      ["general-content", "business-content"].forEach(function (id) {
        var r = document.getElementById(id); if (!r) return;
        var bs = r.querySelectorAll("[data-practice^='gen-l:'], [data-practice^='biz:']");
        for (var i = 0; i < bs.length; i++) {
          var card = bs[i].closest(".rounded-2xl, .rounded-xl, .fx-em") || bs[i].parentNode.parentNode;
          if (card) equiper(card);
        }
      });
    });
  }
  try { new MutationObserver(balayer).observe(document.body, { childList: true, subtree: true }); balayer(); } catch (e) {}

  window.DiisooAssistant = { version: 1, equivalents: equivalents };
})();
