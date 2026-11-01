/* diisoo-passage.js v2 : test de passage, organise en 3 ecrans (Presentation, Questions, Resultat)
   - Toucher Intermediaire : test du niveau Debutant. Reussi (75 %) = Intermediaire ouvert.
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
  var TABS = { general: "general-tabs", wolof: "wolof-tabs" };

  /* ---------- outils ---------- */
  function $(id) { return document.getElementById(id); }
  function melanger(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function lire() { try { return JSON.parse(localStorage.getItem(KEYF) || "{}") || {}; } catch (e) { return {}; } }
  function ecrire(o) { try { localStorage.setItem(KEYF, JSON.stringify(o)); } catch (e) {} }
  function aide(cle) { try { return window.DiisooAideWolof.phrases[cle]; } catch (e) { return null; } }
  function direAide(cle) { try { window.DiisooAideWolof.dire(cle); } catch (e) {} }
  function dire(t, lang) {
    try {
      if (lang === "wo" && typeof speakWolofOolel === "function") return speakWolofOolel(t);
      if (typeof speak === "function") return speak(t, "en-US", 0.85);
    } catch (e) {}
  }
  function debloque(key) { try { return tierState()[key].unlocked || 1; } catch (e) { return 1; } }
  function ouvrirNiveau(key, L) {
    try {
      var all = tierState();
      if (L > all[key].unlocked) all[key].unlocked = L;
      if (typeof TIER_GOALS !== "undefined" && all[key].pts < TIER_GOALS[L - 1]) all[key].pts = TIER_GOALS[L - 1];
      store.set(TIER_KEY, all);
    } catch (e) { console.warn("[diisoo] passage", e); }
  }

  /* ---------- questions a partir du vocabulaire du niveau (meme decoupage que les menus) ---------- */
  function themesDuNiveau(key, niveau) {
    var box = $(TABS[key]), data = key === "general" ? GENERAL_THEMES : WOLOF_THEMES, out = [];
    if (box) {
      Array.prototype.forEach.call(box.children, function (b) {
        if (+b.dataset.lvl !== niveau) return;
        var t = b.textContent.trim().replace(/^🔒\s*/, "");
        var th = data.filter(function (x) { return (x.title || x.label || x.name || "") === t; })[0];
        if (th) out.push(th);
      });
    }
    return out;
  }
  function mots(key, niveau) {
    var out = [];
    themesDuNiveau(key, niveau).forEach(function (t) {
      if (key === "general") (t.vocab || []).forEach(function (w) { if (w.en && w.fr) out.push({ q: w.en, a: w.fr, lang: "en" }); });
      else (t.words || []).forEach(function (w) { if (w.wo && w.en) out.push({ q: w.wo, a: w.en, lang: "wo" }); });
    });
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
    "padding:14px 16px 24px;overflow-y:auto;font-family:inherit}" +
    "#dii-passage .ps-top{display:flex;align-items:center;gap:10px}" +
    "#dii-passage .ps-x{width:44px;height:44px;border-radius:50%;background:#141A2B;border:1px solid #1E2740;color:#A69C86;font-size:16px}" +
    "#dii-passage .ps-aide{margin-left:auto;width:44px;height:44px;border-radius:50%;background:#25D366;border:0;color:#fff;font-size:20px}" +
    "#dii-passage .ps-head{text-align:center;font-size:12px;font-weight:700;letter-spacing:.08em;color:#8C8064;text-transform:uppercase;margin:12px 0 2px}" +
    "#dii-passage .ps-titre{text-align:center;font-size:20px;font-weight:800;margin:2px 0 6px}" +
    "#dii-passage .ps-path{display:flex;align-items:center;justify-content:center;gap:0;margin:14px 0}" +
    "#dii-passage .ps-n{display:flex;flex-direction:column;align-items:center;width:84px;font-size:11px;color:#A69C86;font-weight:700}" +
    "#dii-passage .ps-n b{display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:#141A2B;" +
    "border:3px solid #1E2740;font-size:26px;margin-bottom:4px}" +
    "#dii-passage .ps-n.done b{border-color:#25D366;background:#12351F}" +
    "#dii-passage .ps-n.on b{border-color:#F3A94E;background:#3A2A10;box-shadow:0 0 0 4px rgba(243,169,78,.25)}" +
    "#dii-passage .ps-n.lock b{opacity:.55}" +
    "#dii-passage .ps-l{width:26px;height:4px;background:#1E2740;border-radius:3px;margin-bottom:22px}" +
    "#dii-passage .ps-regles{display:flex;flex-direction:column;gap:8px;margin:8px 0 16px}" +
    "#dii-passage .ps-r{display:flex;align-items:center;gap:12px;background:#141A2B;border:1px solid #1E2740;border-radius:14px;padding:10px 14px;font-size:14px}" +
    "#dii-passage .ps-r span{font-size:22px}" +
    "#dii-passage .ps-pts{display:flex;justify-content:center;gap:6px;margin:10px 0 4px}" +
    "#dii-passage .ps-pts i{width:14px;height:14px;border-radius:50%;background:#1E2740}" +
    "#dii-passage .ps-pts i.ok{background:#25D366}#dii-passage .ps-pts i.ko{background:#E5484D}" +
    "#dii-passage .ps-pts i.cur{box-shadow:0 0 0 3px rgba(243,169,78,.6);background:#F3A94E}" +
    "#dii-passage .ps-son{align-self:center;width:84px;height:84px;border-radius:50%;background:#25D366;color:#fff;font-size:36px;border:0;margin:10px 0 12px}" +
    "#dii-passage .ps-mot{text-align:center;font-size:26px;font-weight:800;line-height:1.25;margin:6px 0 16px;word-break:break-word}" +
    "#dii-passage .ps-rep{width:100%;min-height:58px;margin-bottom:10px;padding:10px 14px;border-radius:16px;background:#141A2B;" +
    "border:2px solid #1E2740;color:#F6F1E7;font-size:16px;font-weight:700;text-align:left}" +
    "#dii-passage .ps-rep.ok{background:#12351F;border-color:#25D366}" +
    "#dii-passage .ps-rep.ko{background:#3A1515;border-color:#E5484D}" +
    "#dii-passage .ps-grand{font-size:56px;text-align:center;margin:10px 0 2px}" +
    "#dii-passage .ps-score{text-align:center;font-size:34px;font-weight:900;margin:0}" +
    "#dii-passage .ps-msg{text-align:center;font-size:17px;font-weight:800;margin:6px 0}" +
    "#dii-passage .ps-sub{text-align:center;font-size:13px;color:#A69C86;margin:0 0 14px}" +
    "#dii-passage .ps-btn{width:100%;min-height:56px;margin-bottom:10px;border-radius:999px;border:0;background:#25D366;color:#fff;font-size:16px;font-weight:800}" +
    "#dii-passage .ps-btn.sec{background:#141A2B;border:1px solid #1E2740;color:#C9BFA8}";
  document.head.appendChild(st);

  function fermer() { if (ov) { ov.remove(); ov = null; } etat = null; }
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

  /* Chemin Debutant, Intermediaire, Avance : ouvert (vert), test en cours (orange), ferme (cadenas) */
  function chemin(key, cible) {
    var un = debloque(key), h = '<div class="ps-path">';
    for (var L = 1; L <= 3; L++) {
      var cls = L <= un ? "done" : (L === cible ? "on" : "lock");
      var ic = L <= un ? "✅" : (L === cible ? ICONS[L - 1] : "🔒");
      h += '<div class="ps-n ' + cls + '"><b>' + ic + "</b>" + NOMS[L - 1] + "</div>";
      if (L < 3) h += '<div class="ps-l"></div>';
    }
    return h + "</div>";
  }

  function entete(key) {
    return '<div class="ps-top"><button class="ps-x" id="ps-close" aria-label="Fermer">✕</button>' +
      '<button class="ps-aide" id="ps-aide" aria-label="Aide en wolof">🔊</button></div>';
  }
  function brancher(key, boutons) {
    var c = $("ps-close"); if (c) c.onclick = function () { retourMenu(key, 0); };
    var a = $("ps-aide"); if (a) a.onclick = function () { direAide("passage"); };
    Array.prototype.forEach.call(ov.querySelectorAll(".ps-btn"), function (el) {
      el.onclick = function () { boutons[+el.dataset.i].f(); };
    });
  }
  function boutonsHtml(boutons) {
    var h = "";
    boutons.forEach(function (b, i) { h += '<button class="ps-btn ' + (b.sec ? "sec" : "") + '" data-i="' + i + '">' + b.t + "</button>"; });
    return h;
  }

  /* Ecran 1 : presentation */
  function presentation(key, cible, niveau, fallback) {
    var qs = fabriquer(key, niveau);
    if (!qs.length) { ouvrirNiveau(key, cible); retourMenu(key, cible); return; }
    var need = Math.ceil(SEUIL * qs.length);
    etat = { key: key, cible: cible, niveau: niveau, fallback: !!fallback, qs: qs, i: 0, score: 0, verrou: false, hist: [] };
    var boutons = [
      { t: "▶ Commencer", f: function () { question(); } },
      { t: "Plus tard", sec: true, f: function () { retourMenu(key, 0); } }
    ];
    montrer(entete(key) +
      '<div class="ps-head">Test de passage</div>' +
      '<div class="ps-titre">Pour ouvrir ' + ICONS[cible - 1] + " " + NOMS[cible - 1] + "</div>" +
      chemin(key, cible) +
      '<div class="ps-regles">' +
      '<div class="ps-r"><span>🔊</span>Écoute le mot</div>' +
      '<div class="ps-r"><span>👆</span>Touche la bonne réponse</div>' +
      '<div class="ps-r"><span>🎯</span>' + need + " bonnes réponses sur " + qs.length + "</div></div>" +
      boutonsHtml(boutons));
    brancher(key, boutons);
    direAide("passage");
  }

  /* Ecran 2 : questions */
  function points(s) {
    var h = '<div class="ps-pts">';
    for (var k = 0; k < s.qs.length; k++) h += "<i class=\"" + (k < s.hist.length ? (s.hist[k] ? "ok" : "ko") : (k === s.i ? "cur" : "")) + '"></i>';
    return h + "</div>";
  }
  function question() {
    var s = etat, q = s.qs[s.i];
    var h = entete(s.key) +
      '<div class="ps-head">' + ICONS[s.niveau - 1] + " Test " + NOMS[s.niveau - 1] + " : " + (s.i + 1) + " / " + s.qs.length + "</div>" +
      points(s) +
      '<button class="ps-son" id="ps-son" aria-label="Écouter">🔊</button><div class="ps-mot">' + q.q.replace(/</g, "&lt;") + "</div>";
    q.options.forEach(function (o, i) { h += '<button class="ps-rep" data-i="' + i + '">' + o.replace(/</g, "&lt;") + "</button>"; });
    montrer(h);
    brancher(s.key, []);
    $("ps-aide").onclick = function () { dire(q.q, q.lang); };
    $("ps-son").onclick = function () { dire(q.q, q.lang); };
    dire(q.q, q.lang);
    Array.prototype.forEach.call(ov.querySelectorAll(".ps-rep"), function (el) {
      el.onclick = function () {
        if (s.verrou) return;
        s.verrou = true;
        var bon = q.options[+el.dataset.i] === q.a;
        if (bon) s.score++;
        s.hist.push(bon);
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

  /* Ecran 3 : resultat */
  function resultat(key, cible, emoji, titre, sous, boutons, histo) {
    montrer(entete(key) +
      '<div class="ps-grand">' + emoji + "</div>" + titre + '<div class="ps-sub">' + sous + "</div>" +
      (histo || "") + chemin(key, cible) + boutonsHtml(boutons));
    brancher(key, boutons);
  }

  /* Lance le test du niveau `niveau` pour viser `cible` */
  function lancer(key, cible, niveau, fallback) {
    var h = cooldown(key, niveau);
    if (h > 0) {
      etat = { key: key };
      resultat(key, cible, "⏳", '<div class="ps-msg">Pas tout de suite</div>',
        "Tu pourras refaire ce test dans " + h + " h. Révise d'abord le niveau " + NOMS[niveau - 1] + ".",
        [{ t: ICONS[niveau - 1] + " Réviser " + NOMS[niveau - 1], f: function () { retourMenu(key, niveau); } }]);
      direAide("retour");
      return;
    }
    presentation(key, cible, niveau, fallback);
  }

  function fin() {
    var s = etat, pct = s.score / s.qs.length, ok = pct >= SEUIL;
    var note = s.score + " / " + s.qs.length, histo = points({ qs: s.qs, hist: s.hist, i: -1 });
    var key = s.key, cible = s.cible;
    var scoreHtml = '<p class="ps-score">' + note + "</p>";
    if (ok) {
      ouvrirNiveau(key, cible);
      resultat(key, cible, "🎉", scoreHtml + '<div class="ps-msg">Baax na ! Niveau débloqué</div>',
        ICONS[cible - 1] + " " + NOMS[cible - 1] + " est ouvert.",
        [{ t: ICONS[cible - 1] + " Commencer " + NOMS[cible - 1], f: function () { retourMenu(key, cible); } }], histo);
      direAide("bravo");
      return;
    }
    var f = lire(); f[key + ":" + s.niveau] = Date.now(); ecrire(f);
    var deja = debloque(key);
    direAide("encore");
    if (!s.fallback && cible === 3 && deja < 2) {
      resultat(key, cible, "🤔", scoreHtml + '<div class="ps-msg">Pas encore</div>',
        "On vérifie si tu peux commencer au niveau Intermédiaire.",
        [{ t: "🌱 Test Débutant", f: function () { lancer(key, 2, 1, true); } },
         { t: "Rester Débutant", sec: true, f: function () { retourMenu(key, 1); } }], histo);
      return;
    }
    if (s.fallback) {
      resultat(key, 2, "🌱", scoreHtml + '<div class="ps-msg">Tu commences Débutant</div>',
        "Tu pourras refaire le test demain.",
        [{ t: "🌱 Commencer Débutant", f: function () { retourMenu(key, 1); } }], histo);
      return;
    }
    var reste = Math.max(1, deja);
    resultat(key, cible, "💪", scoreHtml + '<div class="ps-msg">Pas encore</div>',
      "Il faut " + Math.ceil(SEUIL * s.qs.length) + " bonnes réponses sur " + s.qs.length + ". Tu peux refaire le test demain.",
      [{ t: ICONS[reste - 1] + " Réviser " + NOMS[reste - 1], f: function () { retourMenu(key, reste); } }], histo);
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

  window.DiisooPassage = { version: 2, _etat: function () { return etat; } };
})();
