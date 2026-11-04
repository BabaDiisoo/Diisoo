/* diisoo-seance.js v1 : séance guidée (Anglais et Wolof ↔ Anglais)
   Un bouton « Séance guidée » dans chaque thème. La voix dit le mot, l'apprenant répète, l'app corrige avec bienveillance
   et passe seule au mot suivant. Mini-quiz, bilan, puis le thème suivant. Rien à chercher, rien à faire défiler. */
(function () {
  "use strict";
  if (window.DiisooSeance) return;
  var $ = function (id) { return document.getElementById(id); };
  function pause(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function norm(s) { return String(s || "").toLowerCase().replace(/[^a-z\s']/g, " ").replace(/\s+/g, " ").trim(); }
  function melanger(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- données du thème en cours ---------- */
  function themeCourant(key) {
    try {
      if (key === "general") {
        var t = GENERAL_THEMES.filter(function (x) { return x.id === generalThemeId; })[0];
        if (!t) return null;
        return { titre: t.title.replace(/🏝️?\s*/g, ""), mots: (t.vocab || []).map(function (v) { return { en: v.en, fr: v.fr, wo: v.wo }; }), key: key, id: t.id };
      }
      var W = WOLOF_THEMES.filter(function (x) { return x.id === wolofCat; })[0];
      if (!W) return null;
      return { titre: W.title, mots: LEXICON.filter(function (w) { return w.cat === wolofCat; }), key: key, id: W.id };
    } catch (e) { return null; }
  }

  /* ---------- interface ---------- */
  function css() {
    if ($("dsn-css")) return;
    var s = document.createElement("style"); s.id = "dsn-css";
    s.textContent =
      ".dsn-go{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:52px;margin:8px 0;border-radius:16px;border:0;" +
      "background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;font-weight:800;font-size:15px}" +
      "#dsn{position:fixed;inset:0;z-index:95;background:#0B0F1C;color:#F6F1E7;display:flex;flex-direction:column;padding:68px 18px 18px;overflow-y:auto}" +
      "#dsn.hidden{display:none}" +
      "#dsn .dsn-top{display:flex;align-items:center;justify-content:space-between;gap:8px}" +
      "#dsn .dsn-x{min-height:44px;min-width:44px;border-radius:14px;background:#141A2B;border:1px solid #1E2740;color:#C9BFA8;font-size:13px;padding:0 14px}" +
      "#dsn .dsn-bar{flex:1;height:8px;border-radius:99px;background:#1E2740;overflow:hidden}#dsn .dsn-bar i{display:block;height:100%;background:linear-gradient(90deg,#F3A94E,#E1693F);width:0;transition:width .4s}" +
      "#dsn .dsn-c{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:10px;padding:10px 0}" +
      "#dsn .dsn-lab{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#8C8064}" +
      "#dsn .dsn-big{font-size:34px;font-weight:900;line-height:1.15;max-width:320px}" +
      "#dsn .dsn-wo{font-size:26px;font-weight:800;color:#5FC98F}" +
      "#dsn .dsn-fr{font-size:16px;color:#A69C86}" +
      "#dsn .dsn-orb{width:104px;height:104px;border-radius:50%;margin:14px 0 4px;display:flex;align-items:center;justify-content:center;font-size:44px;background:#141A2B;border:2px solid #1E2740}" +
      "#dsn .dsn-orb.on{background:linear-gradient(135deg,#F3A94E,#E1693F);border-color:transparent;animation:dsnp 1s infinite}" +
      "#dsn .dsn-orb.ok{background:#2C8F5C;border-color:transparent}" +
      "@keyframes dsnp{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(225,105,63,.5)}50%{transform:scale(1.07);box-shadow:0 0 0 18px rgba(225,105,63,0)}}" +
      "#dsn .dsn-msg{min-height:44px;font-size:15px;font-weight:700;max-width:320px}" +
      "#dsn .dsn-row{display:flex;gap:10px;width:100%}" +
      "#dsn .dsn-b{flex:1;min-height:56px;border-radius:16px;font-weight:800;font-size:15px;background:#141A2B;border:1px solid #1E2740;color:#F6F1E7}" +
      "#dsn .dsn-b.p{background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;border:0}" +
      "#dsn .dsn-opt{display:block;width:100%;min-height:56px;margin-top:10px;border-radius:16px;background:#141A2B;border:2px solid #1E2740;color:#F6F1E7;font-weight:700;font-size:16px;padding:10px 14px}" +
      "#dsn .dsn-opt.bon{border-color:#3FAE74;background:#12301f}#dsn .dsn-opt.mal{border-color:#C2542D;background:#33170e}" +
      "#dsn .dsn-stars{font-size:44px;letter-spacing:6px}";
    document.head.appendChild(s);
  }

  var ov = null, S = null;

  function monter() {
    css();
    if (ov) return;
    ov = document.createElement("div"); ov.id = "dsn"; ov.className = "hidden"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Séance guidée");
    document.body.appendChild(ov);
  }
  function entete() {
    return '<div class="dsn-top"><button class="dsn-x" type="button" id="dsn-quit" aria-label="Arrêter la séance">✕ Arrêter</button>' +
      '<div class="dsn-bar"><i id="dsn-prog" style="width:' + S.pct + '%"></i></div></div>';
  }
  function fin() {
    if (!S) return;
    S.jeton++;
    try { if (S.h && S.h.stop) S.h.stop(); } catch (e) {}
    try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
    if (ov) ov.classList.add("hidden");
    S = null;
  }
  function liens() { var q = $("dsn-quit"); if (q) q.onclick = fin; }
  function maj(pct) { S.pct = pct; var b = $("dsn-prog"); if (b) b.style.width = pct + "%"; }
  function dire(t, l) {
    try { return Promise.resolve(speak(t, l, l === "en-US" ? 0.85 : undefined)).catch(function () {}); } catch (e) { return Promise.resolve(); }
  }

  /* ---------- la répétition d'un mot ---------- */
  function ecouterMot(cible, mon) {
    return new Promise(function (res) {
      var h;
      try {
        h = startListening("en-US", 7000, false, function (t) {
          if (mon !== S.jeton) return;
          var el = $("dsn-heard"); if (el) el.textContent = "« " + t + " »";
          try { if (voixJuste(norm(t), norm(cible))) h.stop(); } catch (e) {}
        });
      } catch (e) { res({ text: "", indispo: true }); return; }
      S.h = h;
      h.promise.then(function (r) {
        r = r || {};
        if (r.unsupported || r.error === "not-allowed" || r.error === "service-not-allowed") r.indispo = true;
        res(r);
      });
    });
  }
  function note(w, bon) {
    try {
      if (S.key === "general") bumpStat("diisoo_word_stats", "gen:" + S.id + ":" + w.en, bon ? "correct" : "wrong");
      else bumpWordStat(w.en, bon ? "correct" : "wrong");
      if (bon) { addXP(3); bumpDailyGoal(1); }
    } catch (e) {}
  }

  function carte(w, i, essai, mon) {
    var n = S.mots.length;
    maj(Math.round(i / (n + S.quiz.length) * 100));
    ov.innerHTML = entete() +
      '<div class="dsn-c"><div class="dsn-lab">Mot ' + (i + 1) + ' sur ' + n + '</div>' +
      (S.key === "wolof" ? '<div class="dsn-wo">🇸🇳 ' + esc(w.wo) + '</div>' : "") +
      '<div class="dsn-big">' + esc(w.en) + '</div><div class="dsn-fr">' + esc(w.fr || "") + '</div>' +
      (S.key === "general" && w.wo ? '<div class="dsn-fr" style="color:#5FC98F">🗣️ ' + esc(w.wo) + '</div>' : "") +
      '<div class="dsn-orb" id="dsn-orb" role="img" aria-label="Micro">🔊</div><div class="dsn-msg" id="dsn-msg">Écoute...</div><div id="dsn-heard" class="dsn-fr"></div></div>' +
      '<div class="dsn-row"><button class="dsn-b" type="button" id="dsn-skip">Passer</button><button class="dsn-b" type="button" id="dsn-again">🔁 Réécouter</button></div>';
    liens();
    var passer = false, reecouter = false;
    $("dsn-skip").onclick = function () { passer = true; try { S.h && S.h.stop(); } catch (e) {} };
    $("dsn-again").onclick = function () { reecouter = true; try { S.h && S.h.stop(); stopAllAudio(); } catch (e) {} };
    var dit = (S.key === "wolof" && essai === 0) ? dire(w.wo, "wo").then(function () { return mon === S.jeton && pause(250); }) : Promise.resolve();
    return dit.then(function () { return mon === S.jeton && dire(w.en, "en-US"); }).then(function () {
      if (mon !== S.jeton) return "stop";
      var orb = $("dsn-orb"), msg = $("dsn-msg");
      if (orb) { orb.textContent = "🎙️"; orb.className = "dsn-orb on"; }
      if (msg) msg.textContent = "À toi : répète en anglais";
      return ecouterMot(w.en, mon);
    }).then(function (r) {
      if (r === "stop" || mon !== S.jeton) return "stop";
      var orb = $("dsn-orb"), msg = $("dsn-msg");
      if (reecouter) return carte(w, i, 1, mon);
      if (passer) return "suite";
      if (r.indispo) { S.micOff = true; if (msg) msg.textContent = "Micro indisponible : on écoute seulement"; return pause(900).then(function () { return "suite"; }); }
      var heard = norm(r.text), bon = heard && voixJuste(heard, norm(w.en));
      if (bon) {
        S.bons++; note(w, true);
        if (orb) { orb.textContent = "✅"; orb.className = "dsn-orb ok"; }
        var ok = ""; try { ok = encourageMsg(); } catch (e) { ok = "Bravo !"; }
        if (msg) msg.textContent = ok;
        return pause(1100).then(function () { return "suite"; });
      }
      if (essai === 0) {
        if (orb) { orb.textContent = "💪"; orb.className = "dsn-orb"; }
        if (msg) msg.textContent = heard ? "J'ai entendu « " + heard + " ». Écoute encore et réessaie." : "Je n'ai rien entendu. On réessaie.";
        return pause(900).then(function () { return carte(w, i, 1, mon); });
      }
      note(w, false); S.revoir.push(w);
      if (msg) msg.textContent = "Pas grave, on le reverra. Réponse : " + w.en;
      return pause(1300).then(function () { return "suite"; });
    });
  }

  /* ---------- le quiz ---------- */
  function questions() {
    var M = S.mots, out = [];
    var base = melanger(M).slice(0, Math.min(5, M.length));
    base.forEach(function (w) {
      var champ = S.key === "wolof" ? "en" : "fr";
      var autres = melanger(M.filter(function (x) { return x !== w && x[champ] && x[champ] !== w[champ]; })).slice(0, 2);
      if (autres.length < 1) return;
      var opts = melanger([w[champ]].concat(autres.map(function (x) { return x[champ]; })));
      out.push({ q: S.key === "wolof" ? "Comment dit-on « " + w.wo + " » en anglais ?" : "Que veut dire « " + w.en + " » ?", bonne: w[champ], opts: opts, mot: w });
    });
    return out;
  }
  function question(k, mon) {
    var Q = S.quiz[k], n = S.mots.length;
    maj(Math.round((n + k) / (n + S.quiz.length) * 100));
    ov.innerHTML = entete() + '<div class="dsn-c" style="justify-content:flex-start;padding-top:28px"><div class="dsn-lab">Mini-quiz ' + (k + 1) + ' sur ' + S.quiz.length + '</div>' +
      '<div class="dsn-big" style="font-size:24px">' + esc(Q.q) + '</div><div style="width:100%" id="dsn-opts"></div><div class="dsn-msg" id="dsn-msg"></div></div>';
    liens();
    return new Promise(function (res) {
      Q.opts.forEach(function (o) {
        var b = document.createElement("button"); b.type = "button"; b.className = "dsn-opt"; b.textContent = o;
        b.onclick = function () {
          var tous = $("dsn-opts").querySelectorAll("button"); for (var i = 0; i < tous.length; i++) tous[i].disabled = true;
          var bon = o === Q.bonne;
          b.className = "dsn-opt " + (bon ? "bon" : "mal");
          if (!bon) Array.prototype.forEach.call(tous, function (x) { if (x.textContent === Q.bonne) x.className = "dsn-opt bon"; });
          if (bon) { S.qbons++; try { addXP(2); } catch (e) {} }
          $("dsn-msg").textContent = bon ? "✅ Exact !" : "Pas tout à fait. C'était : " + Q.bonne;
          var l = S.key === "wolof" ? "en-US" : "en-US";
          dire(Q.mot.en, l).then(function () { return pause(700); }).then(res);
        };
        $("dsn-opts").appendChild(b);
      });
    }).then(function () { return mon === S.jeton ? "suite" : "stop"; });
  }

  /* ---------- le bilan et le thème suivant ---------- */
  function suivantExiste(key) { return !!boutonSuivant(key); }
  function boutonSuivant(key) {
    var box = $(key === "general" ? "general-tabs" : "wolof-tabs"); if (!box) return null;
    var btns = Array.prototype.slice.call(box.children).filter(function (b) { return b.style.display !== "none"; });
    var th = themeCourant(key); if (!th) return null;
    var titre = String(th.titre).replace(/\s+/g, " ").trim().toLowerCase();
    for (var i = 0; i < btns.length; i++) {
      var tb = btns[i].textContent.replace(/🏝️?/g, "").replace(/N[123]\s*·?/, "").replace(/\s+/g, " ").trim().toLowerCase();
      if (tb.indexOf(titre) >= 0 || titre.indexOf(tb) >= 0) return btns[i + 1] || null;
    }
    return null;
  }
  function bilan() {
    var n = S.mots.length, total = n + S.quiz.length, bons = S.bons + S.qbons;
    var pct = total ? Math.round(bons / total * 100) : 0;
    var etoiles = pct >= 85 ? "⭐⭐⭐" : pct >= 60 ? "⭐⭐" : "⭐";
    var phrase = pct >= 85 ? "Excellent ! Tu maîtrises ce thème." : pct >= 60 ? "Très bien ! Encore un peu et c'est parfait." : "Bon début ! Refais la séance pour progresser.";
    var key = S.key;
    maj(100);
    ov.innerHTML = entete() + '<div class="dsn-c"><div class="dsn-stars">' + etoiles + '</div><div class="dsn-big">' + pct + ' %</div>' +
      '<div class="dsn-msg">' + phrase + '</div><div class="dsn-fr">' + S.bons + ' mots répétés sur ' + n + ' · ' + S.qbons + ' bonnes réponses au quiz</div>' +
      (S.revoir.length ? '<div class="dsn-fr">À revoir : ' + esc(S.revoir.map(function (w) { return w.en; }).join(", ")) + '</div>' : "") + '</div>' +
      '<div class="dsn-row" style="flex-direction:column">' +
      (suivantExiste(key) ? '<button class="dsn-b p" type="button" id="dsn-next">➡️ Thème suivant</button>' : "") +
      '<button class="dsn-b" type="button" id="dsn-redo">🔁 Refaire la séance</button><button class="dsn-b" type="button" id="dsn-end">Terminer</button></div>';
    liens();
    $("dsn-end").onclick = fin;
    $("dsn-redo").onclick = function () { fin(); demarrer(key); };
    var nx = $("dsn-next");
    if (nx) nx.onclick = function () {
      var b = boutonSuivant(key); fin();
      if (b) { b.click(); setTimeout(function () { demarrer(key); }, 900); }
    };
    try { if (typeof speak === "function") speak("Bravo, " + pct + " pour cent", "en-US"); } catch (e) {}
  }

  /* ---------- déroulé ---------- */
  function demarrer(key) {
    monter();
    var th = themeCourant(key);
    if (!th || !th.mots.length) { try { toast("Ouvre d'abord un thème"); } catch (e) {} return; }
    if (S) fin();
    S = { key: key, id: th.id, mots: th.mots, jeton: 1, bons: 0, qbons: 0, revoir: [], quiz: [], pct: 0, h: null };
    S.quiz = questions();
    var mon = S.jeton;
    ov.classList.remove("hidden");
    ov.innerHTML = entete() + '<div class="dsn-c"><div class="dsn-lab">Séance guidée</div><div class="dsn-big">' + esc(th.titre) + '</div>' +
      '<div class="dsn-fr">' + th.mots.length + ' mots · ' + S.quiz.length + ' questions · environ ' + Math.max(2, Math.round(th.mots.length * 0.35)) + ' min</div>' +
      '<div class="dsn-fr">Écoute, répète à voix haute, je corrige. Je passe seul au mot suivant.</div></div>' +
      '<div class="dsn-row"><button class="dsn-b p" type="button" id="dsn-go">▶️ Commencer</button></div>';
    liens();
    /* Le toucher « Commencer » autorise le son et le micro du navigateur */
    $("dsn-go").onclick = function () {
      (function boucle(i) {
        if (!S || mon !== S.jeton) return;
        if (i >= S.mots.length) { suiteQuiz(0); return; }
        carte(S.mots[i], i, 0, mon).then(function (r) { if (r === "stop" || !S || mon !== S.jeton) return; boucle(i + 1); });
      })(0);
    };
    function suiteQuiz(k) {
      if (!S || mon !== S.jeton) return;
      if (k >= S.quiz.length) { bilan(); return; }
      question(k, mon).then(function (r) { if (r === "stop") return; suiteQuiz(k + 1); });
    }
  }

  /* ---------- le bouton dans chaque thème ---------- */
  function poser() {
    ["general", "wolof"].forEach(function (key) {
      var bar = $("thbar-" + key), id = "dsn-btn-" + key;
      var ecran = $(key === "general" ? "screen-general" : "screen-wolof");
      var visible = ecran && !ecran.classList.contains("hidden");
      var b = $(id);
      if (!bar || !visible) { if (b) b.remove(); return; }
      if (b) return;
      b = document.createElement("button"); b.type = "button"; b.id = id; b.className = "dsn-go";
      b.innerHTML = "▶️ Séance guidée : je te guide, tu répètes";
      b.onclick = function () { demarrer(key); };
      bar.parentNode.insertBefore(b, bar.nextSibling);
    });
  }
  css();
  setInterval(function () { try { poser(); } catch (e) {} }, 600);

  window.DiisooSeance = { version: 1, demarrer: demarrer };
})();
