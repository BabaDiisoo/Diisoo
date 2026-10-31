/* diisoo-passage.js : test de passage pour Anglais et Wolof
   - Toucher Intermediaire : test du niveau Debutant. Reussi (70 % ou plus) = Intermediaire ouvert.
   - Toucher Avance : test du niveau Intermediaire. Reussi = Avance ouvert.
     Rate (et Intermediaire pas encore ouvert) = test Debutant pour savoir s'il commence Intermediaire ou Debutant.
   - Une question = un mot entendu (audio) + 3 reponses. 8 questions, 6 bonnes reponses pour reussir.
   - Apres un echec, le meme test se refait apres 24 heures. */
(function () {
  "use strict";

  var NB = 8, SEUIL = 0.7, ATTENTE = 24 * 3600 * 1000;
  var NOMS = ["Débutant", "Intermédiaire", "Avancé"];
  var ICONS = ["🌱", "🌿", "🌳"];
  var KEYF = "diisoo_passage";
  var etat = null, ov = null;

  /* ---------- outils ---------- */
  function $(id) { return document.getElementById(id); }
  function melanger(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function lire() { try { return JSON.parse(localStorage.getItem(KEYF) || "{}") || {}; } catch (e) { return {}; } }
  function ecrire(o) { try { localStorage.setItem(KEYF, JSON.stringify(o)); } catch (e) {} }
  function aide(cle) { try { return window.DiisooAideWolof.phrases[cle]; } catch (e) { return null; } }
  function dire(t, key) {
    try {
      if (key === "wolof" && typeof speakWolofOolel === "function") return speakWolofOolel(t);
      if (typeof speak === "function") return speak(t, "en-US", 0.85);
    } catch (e) {}
  }
  function direWolof(t) { try { if (t && typeof speakWolofOolel === "function") return speakWolofOolel(t); } catch (e) {} }

  function debloque(key) { try { return tierState()[key].unlocked || 1; } catch (e) { return 1; } }
  function ouvrirNiveau(key, L) {
    try {
      var all = tierState();
      if (L > all[key].unlocked) all[key].unlocked = L;
      if (typeof TIER_GOALS !== "undefined" && all[key].pts < TIER_GOALS[L - 1]) all[key].pts = TIER_GOALS[L - 1];
      store.set(TIER_KEY, all);
    } catch (e) { console.warn("[diisoo] passage", e); }
  }

  /* ---------- questions a partir du vocabulaire du niveau ---------- */
  function mots(key, niveau) {
    var out = [];
    if (key === "general") {
      GENERAL_THEMES.forEach(function (t) {
        var nom = t.title || t.label || t.name || "";
        var m = /N([123])\b/.exec(nom);
        if (m && +m[1] === niveau) (t.vocab || []).forEach(function (w) { if (w.en && w.fr) out.push({ q: w.en, a: w.fr, lang: "en" }); });
      });
    } else {
      var n = WOLOF_THEMES.length, per = Math.ceil(n / 3);
      WOLOF_THEMES.forEach(function (t, i) {
        if (Math.min(3, Math.floor(i / per) + 1) === niveau)
          (t.words || []).forEach(function (w) { if (w.wo && w.en) out.push({ q: w.wo, a: w.en, lang: "wo" }); });
      });
    }
    return out.filter(function (w) { return w.q.length <= 45 && w.a.length <= 45; });
  }
  function fabriquer(key, niveau) {
    var pool = mots(key, niveau);
    if (pool.length < 4) return [];
    var tirage = melanger(pool).slice(0, Math.min(NB, pool.length));
    return tirage.map(function (w) {
      var autres = melanger(pool.filter(function (x) { return x.a !== w.a; })).slice(0, 2).map(function (x) { return x.a; });
      return { q: w.q, a: w.a, lang: w.lang, options: melanger([w.a].concat(autres)) };
    });
  }

  /* ---------- interface ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#dii-passage{position:fixed;inset:0;z-index:9999;background:#0B0F1C;color:#F6F1E7;display:flex;flex-direction:column;" +
    "padding:14px 16px;overflow-y:auto;font-family:inherit}" +
    "#dii-passage .ps-top{display:flex;align-items:center;gap:10px}" +
    "#dii-passage .ps-x{width:40px;height:40px;border-radius:50%;background:#141A2B;border:1px solid #1E2740;color:#A69C86;font-size:16px}" +
    "#dii-passage .ps-bar{flex:1;height:8px;background:#141A2B;border-radius:6px;overflow:hidden}" +
    "#dii-passage .ps-bar i{display:block;height:100%;background:#25D366;transition:width .3s}" +
    "#dii-passage .ps-titre{text-align:center;font-size:12px;color:#A69C86;margin:12px 0 4px}" +
    "#dii-passage .ps-mot{text-align:center;font-size:26px;font-weight:800;line-height:1.25;margin:14px 0;word-break:break-word}" +
    "#dii-passage .ps-son{align-self:center;width:84px;height:84px;border-radius:50%;background:#25D366;color:#fff;font-size:36px;border:0;margin:6px 0 16px}" +
    "#dii-passage .ps-rep{width:100%;min-height:58px;margin-bottom:10px;padding:10px 14px;border-radius:16px;background:#141A2B;" +
    "border:2px solid #1E2740;color:#F6F1E7;font-size:16px;font-weight:700;text-align:left}" +
    "#dii-passage .ps-rep.ok{background:#12351F;border-color:#25D366}" +
    "#dii-passage .ps-rep.ko{background:#3A1515;border-color:#E5484D}" +
    "#dii-passage .ps-grand{font-size:56px;text-align:center;margin:18px 0 6px}" +
    "#dii-passage .ps-msg{text-align:center;font-size:17px;font-weight:800;margin:6px 0}" +
    "#dii-passage .ps-sub{text-align:center;font-size:13px;color:#A69C86;margin:0 0 14px}" +
    "#dii-passage .ps-btn{width:100%;min-height:54px;margin-bottom:10px;border-radius:999px;border:0;background:#25D366;color:#fff;font-size:15px;font-weight:800}" +
    "#dii-passage .ps-btn.sec{background:#141A2B;border:1px solid #1E2740;color:#C9BFA8}";
  document.head.appendChild(st);

  function fermer() {
    if (ov) { ov.remove(); ov = null; }
    etat = null;
  }
  function montrer(html) {
    if (!ov || !document.body.contains(ov)) { ov = document.createElement("div"); ov.id = "dii-passage"; document.body.appendChild(ov); }
    ov.innerHTML = html;
    ov.scrollTop = 0;
  }
  function retourMenu(key, L) {
    fermer();
    try { window[key === "general" ? "openGeneralModule" : "openWolofModule"](); } catch (e) {}
    if (L) {
      setTimeout(function () {
        var b = document.querySelectorAll("#lvl-" + key + " .lvl-btn")[L - 1];
        if (b) b.click();
      }, 150);
    }
  }

  function message(grand, titre, sous, boutons) {
    var h = '<div class="ps-top"><button class="ps-x" id="ps-close" aria-label="Fermer">✕</button></div>' +
      '<div class="ps-grand">' + grand + '</div><div class="ps-msg">' + titre + '</div><div class="ps-sub">' + sous + "</div>";
    boutons.forEach(function (b, i) { h += '<button class="ps-btn ' + (b.sec ? "sec" : "") + '" data-i="' + i + '">' + b.t + "</button>"; });
    montrer(h);
    $("ps-close").onclick = function () { retourMenu(etat ? etat.key : "general", 0); };
    Array.prototype.forEach.call(ov.querySelectorAll(".ps-btn"), function (el) {
      el.onclick = function () { boutons[+el.dataset.i].f(); };
    });
  }

  function question() {
    var s = etat, q = s.qs[s.i];
    var h = '<div class="ps-top"><button class="ps-x" id="ps-close" aria-label="Fermer">✕</button>' +
      '<div class="ps-bar"><i style="width:' + Math.round((s.i / s.qs.length) * 100) + '%"></i></div></div>' +
      '<div class="ps-titre">' + ICONS[s.niveau - 1] + " Test " + NOMS[s.niveau - 1] + " : " + (s.i + 1) + " / " + s.qs.length + "</div>" +
      '<button class="ps-son" id="ps-son" aria-label="Écouter">🔊</button><div class="ps-mot">' + q.q.replace(/</g, "&lt;") + "</div>";
    q.options.forEach(function (o, i) { h += '<button class="ps-rep" data-i="' + i + '">' + o.replace(/</g, "&lt;") + "</button>"; });
    montrer(h);
    $("ps-close").onclick = function () { retourMenu(s.key, 0); };
    $("ps-son").onclick = function () { dire(q.q, q.lang === "wo" ? "wolof" : "en"); };
    dire(q.q, q.lang === "wo" ? "wolof" : "en");
    Array.prototype.forEach.call(ov.querySelectorAll(".ps-rep"), function (el) {
      el.onclick = function () {
        if (s.verrou) return;
        s.verrou = true;
        var bon = q.options[+el.dataset.i] === q.a;
        if (bon) s.score++;
        el.classList.add(bon ? "ok" : "ko");
        el.textContent = (bon ? "✅ " : "❌ ") + el.textContent;
        if (!bon) Array.prototype.forEach.call(ov.querySelectorAll(".ps-rep"), function (x, k) { if (q.options[k] === q.a) x.classList.add("ok"); });
        setTimeout(function () {
          s.verrou = false; s.i++;
          if (s.i < s.qs.length) question(); else fin();
        }, bon ? 700 : 1400);
      };
    });
  }

  function cooldown(key, niveau) {
    var f = lire()[key + ":" + niveau];
    if (f && Date.now() - f < ATTENTE) return Math.ceil((ATTENTE - (Date.now() - f)) / 3600000);
    return 0;
  }

  /* Lance le test du niveau `niveau` pour viser `cible` */
  function lancer(key, cible, niveau, fallback) {
    var h = cooldown(key, niveau);
    if (h > 0) {
      etat = { key: key };
      message("⏳", "Pas tout de suite", "Tu pourras refaire ce test dans " + h + " h. Révise d'abord le niveau " + NOMS[niveau - 1] + ".",
        [{ t: "Réviser " + NOMS[niveau - 1], f: function () { retourMenu(key, niveau); } }]);
      direWolof(aide("retour"));
      return;
    }
    var qs = fabriquer(key, niveau);
    if (!qs.length) { ouvrirNiveau(key, cible); retourMenu(key, cible); return; }
    etat = { key: key, cible: cible, niveau: niveau, fallback: !!fallback, qs: qs, i: 0, score: 0, verrou: false };
    question();
  }

  function fin() {
    var s = etat, pct = s.score / s.qs.length, ok = pct >= SEUIL;
    var note = s.score + " / " + s.qs.length;
    if (ok) {
      ouvrirNiveau(s.key, s.cible);
      message("🎉", "Baax na ! " + note, "Niveau " + NOMS[s.cible - 1] + " débloqué.",
        [{ t: ICONS[s.cible - 1] + " Commencer " + NOMS[s.cible - 1], f: function () { retourMenu(s.key, s.cible); } }]);
      direWolof(aide("bravo"));
      return;
    }
    var f = lire(); f[s.key + ":" + s.niveau] = Date.now(); ecrire(f);
    var deja = debloque(s.key);
    var key = s.key, cible = s.cible;
    direWolof(aide("encore"));
    if (!s.fallback && cible === 3 && deja < 2) {
      message("🤔", "Pas encore. " + note, "On vérifie si tu peux commencer au niveau Intermédiaire.",
        [{ t: "🌱 Test Débutant", f: function () { lancer(key, 2, 1, true); } },
         { t: "Rester Débutant", sec: true, f: function () { retourMenu(key, 1); } }]);
      return;
    }
    if (s.fallback) {
      message("🌱", "Pas encore. " + note, "Tu commences au niveau Débutant. Tu peux refaire le test demain.",
        [{ t: "🌱 Commencer Débutant", f: function () { retourMenu(key, 1); } }]);
      return;
    }
    var reste = Math.max(1, deja);
    message("💪", "Pas encore. " + note, "Il faut " + Math.ceil(SEUIL * s.qs.length) + " bonnes réponses sur " + s.qs.length + ". Tu peux refaire le test demain.",
      [{ t: ICONS[reste - 1] + " Réviser " + NOMS[reste - 1], f: function () { retourMenu(key, reste); } }]);
  }

  /* ---------- declenchement : toucher un niveau verrouille ---------- */
  window.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest(".lvl-btn.lock");
    if (!b || ev.target.closest(".aide-ic")) return;
    var box = b.parentNode, key = /lvl-(general|wolof)/.exec(box.id || "");
    if (!key) return;
    ev.stopImmediatePropagation(); ev.preventDefault();
    var idx = Array.prototype.indexOf.call(box.querySelectorAll(".lvl-btn"), b) + 1;
    lancer(key[1], idx, idx - 1, false);
  }, true);

  window.DiisooPassage = { version: 1, _etat: function () { return etat; } };
})();
