/* diisoo-exams2.js v1 : « Format réel » des examens, piloté par un registre
   Lit exam-formats.json : pour chaque examen, les tâches (type, nombre, préparation, durée de réponse) et les tests.
   Types gérés : repeat (écoute et répète), readaloud (lire à voix haute), question (réponse orale chronométrée).
   Pour suivre un changement du vrai examen, on modifie exam-formats.json seulement : aucun code à toucher.
   Un bouton « 🎯 Format réel » s'ajoute dans la liste des tests de chaque examen présent dans le registre. */
(function () {
  "use strict";

  var REG = null, PROM = null;
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function charger() {
    if (PROM) return PROM;
    PROM = fetch("exam-formats.json", { cache: "no-cache" }).then(function (r) { return r.json(); })
      .then(function (j) { REG = j; return j; }).catch(function () { PROM = null; return null; });
    return PROM;
  }
  function son(n) { try { if (window.DiisooSon && window.DiisooSon.jouer) window.DiisooSon.jouer(n); } catch (e) {} }
  function attendre(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* ---------- comparaison mot a mot ---------- */
  function mots(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean); }
  function comparer(cible, entendu) {
    if (window.DiisooCoach && window.DiisooCoach._comparer) return window.DiisooCoach._comparer(cible, entendu);
    var H = mots(entendu), res = [], ok = 0;
    mots(cible).forEach(function (w) { var v = H.indexOf(w) > -1; if (v) ok++; res.push({ w: w, etat: v ? 2 : 0 }); });
    return { mots: res, score: res.length ? ok / res.length : 0 };
  }

  /* ---------- styles ---------- */
  var st = document.createElement("style");
  st.textContent =
    ".fx-reel{width:100%;min-height:56px;margin:6px 0 10px;border-radius:16px;border:0;background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;font-size:15px;font-weight:800;text-align:left;padding:8px 14px}" +
    ".fx-reel small{display:block;font-size:11px;font-weight:600;opacity:.85}" +
    "#dii-fmt{position:fixed;inset:0;z-index:99980;background:rgba(5,8,18,.96);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-fmt .fm-box{width:100%;max-width:520px;max-height:96vh;overflow-y:auto;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px 22px 0 0;padding:16px 16px 22px;color:#F6F1E7}" +
    "#dii-fmt .fm-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}" +
    "#dii-fmt .fm-x{width:44px;height:44px;border-radius:50%;background:#141A2B;border:1px solid #1E2740;color:#A69C86;font-size:16px;flex:none}" +
    "#dii-fmt .fm-tt{flex:1;text-align:center;font-size:11px;font-weight:700;letter-spacing:.08em;color:#8C8064;text-transform:uppercase}" +
    "#dii-fmt .fm-pg{height:6px;border-radius:99px;background:#141A2B;overflow:hidden;margin:0 0 12px}" +
    "#dii-fmt .fm-pg i{display:block;height:100%;background:#3FAE74}" +
    "#dii-fmt h3{font-size:20px;font-weight:800;margin:4px 0;text-align:center}" +
    "#dii-fmt .fm-p{font-size:13px;color:#A69C86;line-height:1.45;margin:6px 0;text-align:center}" +
    "#dii-fmt .fm-big{font-size:24px;font-weight:800;line-height:1.25;text-align:center;margin:14px 0}" +
    "#dii-fmt .fm-ico{font-size:54px;text-align:center;margin:10px 0}" +
    "#dii-fmt .fm-b{display:block;width:100%;min-height:52px;margin-top:8px;border:0;border-radius:14px;background:#25D366;color:#fff;font-size:16px;font-weight:800}" +
    "#dii-fmt .fm-b.s{background:#141A2B;border:1px solid #1E2740;color:#E4DCC9;font-weight:700;font-size:14px}" +
    "#dii-fmt .fm-b.l{opacity:.55}" +
    "#dii-fmt .fm-cd{height:10px;border-radius:99px;background:#141A2B;overflow:hidden;margin:12px 0 4px}" +
    "#dii-fmt .fm-cd i{display:block;height:100%;background:#E5484D;transition:width .25s linear}" +
    "#dii-fmt .fm-sec{text-align:center;font-size:30px;font-weight:800;color:#F3A94E}" +
    "#dii-fmt .fm-mots{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:10px 0}" +
    "#dii-fmt .fm-m{padding:6px 10px;border-radius:10px;border:2px solid #1E2740;background:#141A2B;font-size:16px;font-weight:700}" +
    "#dii-fmt .fm-m.v{border-color:#25D366;background:#12351F}#dii-fmt .fm-m.o{border-color:#F3A94E;background:#3A2A10}#dii-fmt .fm-m.r{border-color:#E5484D;background:#3A1515}" +
    "#dii-fmt .fm-tr{background:#141A2B;border:1px solid #1E2740;border-radius:12px;padding:10px;font-size:14px;line-height:1.4;margin:8px 0;color:#C9BFA8}" +
    "#dii-fmt .fm-src{font-size:11px;color:#8C8064;text-align:center;margin-top:10px}";
  document.head.appendChild(st);

  /* ---------- lecteur ---------- */
  var ov = null, jeton = 0, minuteur = null, ecoute = null;

  function nettoyer() {
    jeton++;
    if (minuteur) { clearInterval(minuteur); minuteur = null; }
    if (ecoute) { try { ecoute.stop(); } catch (e) {} ecoute = null; }
    try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
  }
  function fermer() { nettoyer(); if (ov) { ov.remove(); ov = null; } }

  function cadre(titre, prog) {
    if (!ov) {
      ov = el("div"); ov.id = "dii-fmt"; ov.setAttribute("role", "dialog");
      ov.appendChild(el("div", "fm-box")); document.body.appendChild(ov);
    }
    var box = ov.firstChild; box.innerHTML = "";
    var top = el("div", "fm-top");
    var x = el("button", "fm-x", "✕"); x.type = "button"; x.setAttribute("aria-label", "Fermer"); x.onclick = fermer;
    top.appendChild(x); top.appendChild(el("div", "fm-tt", titre || "")); top.appendChild(el("div")); top.lastChild.style.width = "44px";
    box.appendChild(top);
    if (prog != null) { var pg = el("div", "fm-pg"); var i = el("i"); i.style.width = Math.round(prog * 100) + "%"; pg.appendChild(i); box.appendChild(pg); }
    return box;
  }
  function bouton(box, txt, fn, cls) { var b = el("button", "fm-b" + (cls ? " " + cls : ""), txt); b.type = "button"; b.onclick = fn; box.appendChild(b); return b; }

  /* ---------- accueil d'un examen ---------- */
  function ouvrir(cle) {
    var ex = REG && REG.examens && REG.examens[cle]; if (!ex) return;
    nettoyer();
    var box = cadre(ex.court + " · Format réel");
    box.appendChild(el("h3", null, ex.nom));
    box.appendChild(el("p", "fm-p", ex.resume));
    ex.taches.forEach(function (t) {
      var d = t.nb + " × " + t.titre + " : " + (t.prep_s ? t.prep_s + " s de préparation, " : "pas de préparation, ") + t.rep_s + " s pour répondre";
      var l = el("div", "fm-tr", d); box.appendChild(l);
    });
    var libre = false; try { libre = typeof aAcces === "function" && aAcces("premium"); } catch (e) {}
    ex.tests.forEach(function (t, i) {
      var verrou = i >= 1 && !libre;
      var b = bouton(box, (verrou ? "⭐ " : "▶ ") + "Test " + (i + 1) + " : " + t.titre, function () {
        if (verrou) { try { toast("Ce test est réservé aux abonnés Premium."); openPremium(); } catch (e) {} return; }
        lancer(cle, i);
      }, verrou ? "s l" : "");
      void b;
    });
    var conf = ex.niveau_confiance === "officiel" ? "Format publié par l'organisme d'examen" : "Format décrit par des sites de préparation, à confirmer avec l'organisme d'examen";
    box.appendChild(el("div", "fm-src", conf + ". Dernière vérification : " + ex.verifie_le + ". Diisoo n'est pas affilié aux organismes d'examen."));
  }

  /* ---------- déroulé d'un test ---------- */
  function lancer(cle, ti) {
    var ex = REG.examens[cle], test = ex.tests[ti], etapes = [];
    ex.taches.forEach(function (t) {
      var banque = test[t.banque || t.type] || [];
      for (var i = 0; i < t.nb && i < banque.length; i++) etapes.push({ tache: t, i: i, n: Math.min(t.nb, banque.length), texte: banque[i] });
    });
    var bilan = { repeat: [], question: [], readaloud: [] };
    function etape(k) {
      if (k >= etapes.length) return fin(cle, ti, bilan);
      var e = etapes[k], mon = ++jeton;
      var prog = k / etapes.length, titre = e.tache.titre + " " + (e.i + 1) + "/" + e.n;
      if (e.tache.type === "readaloud") return lire(e, k, mon, titre, prog);
      return ecouter(e, k, mon, titre, prog);
    }

    function compte(box, sec, surFin) {
      var cd = el("div", "fm-cd"), bar = el("i"); bar.style.width = "100%"; cd.appendChild(bar);
      var tx = el("div", "fm-sec", String(sec)); box.appendChild(tx); box.appendChild(cd);
      var t0 = Date.now(), tot = sec * 1000;
      if (minuteur) clearInterval(minuteur);
      minuteur = setInterval(function () {
        var r = Math.max(0, tot - (Date.now() - t0));
        tx.textContent = String(Math.ceil(r / 1000)); bar.style.width = Math.round(r / tot * 100) + "%";
        if (r <= 0) { clearInterval(minuteur); minuteur = null; if (surFin) surFin(); }
      }, 250);
    }

    function parler(e, k, mon, titre, prog, texteVisible) {
      /* enregistrement avec compte à rebours */
      var box = cadre(titre, prog);
      box.appendChild(el("div", "fm-ico", "🎙️"));
      box.appendChild(el("p", "fm-p", "Parle maintenant. Le micro écoute."));
      if (texteVisible) box.appendChild(el("div", "fm-tr", texteVisible));
      var debut = Date.now(), fini = false;
      function terminer(res) {
        if (fini || mon !== jeton) return; fini = true;
        if (minuteur) { clearInterval(minuteur); minuteur = null; }
        ecoute = null;
        resultat(e, k, mon, titre, prog, res || { text: "" }, (Date.now() - debut) / 1000);
      }
      son("ouvre");
      try {
        ecoute = startListening("en-US", e.tache.rep_s * 1000, true);
        ecoute.promise.then(terminer, function () { terminer({ text: "" }); });
      } catch (err) { terminer({ text: "", unsupported: true }); }
      compte(box, e.tache.rep_s, function () { try { ecoute && ecoute.stop(); } catch (x) {} });
      bouton(box, "✋ J'ai fini", function () { try { ecoute && ecoute.stop(); } catch (x) {} }, "s");
    }

    function ecouter(e, k, mon, titre, prog) {
      var box = cadre(titre, prog);
      box.appendChild(el("div", "fm-ico", "🔊"));
      box.appendChild(el("p", "fm-p", e.tache.consigne));
      box.appendChild(el("p", "fm-p", "Écoute bien : la phrase n'est lue qu'une fois."));
      Promise.race([Promise.resolve().then(function () { return speak(e.texte, "en-US", 0.95); }), attendre(15000)]).then(function () {
        if (mon !== jeton) return;
        if (e.tache.prep_s) { preparer(e, k, mon, titre, prog, e.tache.type === "question" ? e.texte : ""); }
        else parler(e, k, mon, titre, prog, e.tache.type === "question" ? e.texte : "");
      }, function () { if (mon === jeton) parler(e, k, mon, titre, prog, e.texte); });
    }

    function lire(e, k, mon, titre, prog) {
      var box = cadre(titre, prog);
      box.appendChild(el("p", "fm-p", e.tache.consigne));
      box.appendChild(el("div", "fm-big", e.texte));
      var go = function () { if (mon === jeton) parler(e, k, mon, titre, prog, e.texte); };
      if (e.tache.prep_s) { box.appendChild(el("p", "fm-p", "Temps de préparation")); compte(box, e.tache.prep_s, go); bouton(box, "Je suis prêt", function () { if (minuteur) { clearInterval(minuteur); minuteur = null; } go(); }, "s"); }
      else go();
    }
    function preparer(e, k, mon, titre, prog, txt) {
      var box = cadre(titre, prog);
      box.appendChild(el("p", "fm-p", "Temps de préparation"));
      if (txt) box.appendChild(el("div", "fm-tr", txt));
      var go = function () { if (mon === jeton) parler(e, k, mon, titre, prog, txt); };
      compte(box, e.tache.prep_s, go);
      bouton(box, "Je suis prêt", function () { if (minuteur) { clearInterval(minuteur); minuteur = null; } go(); }, "s");
    }

    function resultat(e, k, mon, titre, prog, res, dur) {
      var box = cadre(titre, (k + 1) / etapes.length);
      var texte = (res.text || "").trim();
      var suite = function () { bouton(box, k + 1 < etapes.length ? "Suivant ›" : "Voir mon bilan", function () { etape(k + 1); }); };
      if (e.tache.type === "question") {
        if (res.unsupported) {
          box.appendChild(el("p", "fm-p", "Ton navigateur ne reconnaît pas la voix. Juge toi-même si ta réponse remplissait le temps."));
          bilan.question.push({ mots: 0, sec: dur, manuel: true });
        } else if (!texte) {
          box.appendChild(el("div", "fm-ico", "🤔"));
          box.appendChild(el("p", "fm-p", "Je n'ai rien entendu. Garde le téléphone près de la bouche. Tu peux continuer ou recommencer."));
          bouton(box, "↻ Recommencer cette question", function () { etapes[k] && ecouter(e, k, ++jeton, titre, prog); }, "s");
          bilan.question.push({ mots: 0, sec: dur });
        } else {
          var n = mots(texte).length;
          bilan.question.push({ mots: n, sec: dur });
          box.appendChild(el("div", "fm-ico", n >= 40 ? "✅" : "🟡"));
          box.appendChild(el("p", "fm-p", "Tu as dit " + n + " mots en " + Math.round(dur) + " secondes. Objectif conseillé : environ 60 mots pour 45 secondes."));
          box.appendChild(el("div", "fm-tr", "J'ai entendu : « " + texte + " »"));
          if (n < 25) box.appendChild(el("p", "fm-p", "Astuce : ajoute une raison et un exemple (« because… », « for example… »)."));
        }
        suite(); return;
      }
      /* repeat et readaloud : comparaison mot a mot */
      if (res.unsupported) {
        box.appendChild(el("div", "fm-big", e.texte));
        box.appendChild(el("p", "fm-p", "Ton navigateur ne reconnaît pas la voix. Compare toi-même avec la phrase."));
        var a = bouton(box, "✅ Je l'ai bien dite", function () { bilan[e.tache.type].push(1); etape(k + 1); });
        void a;
        bouton(box, "❌ Pas encore", function () { bilan[e.tache.type].push(0); etape(k + 1); }, "s");
        return;
      }
      var cmp = comparer(e.texte, texte);
      bilan[e.tache.type].push(cmp.score);
      box.appendChild(el("div", "fm-ico", cmp.score >= 0.8 ? "✅" : (cmp.score >= 0.5 ? "🟡" : "❌")));
      var wrap = el("div", "fm-mots");
      cmp.mots.forEach(function (m) { wrap.appendChild(el("span", "fm-m " + (m.etat === 2 ? "v" : (m.etat === 1 ? "o" : "r")), m.w)); });
      box.appendChild(wrap);
      box.appendChild(el("p", "fm-p", texte ? "J'ai entendu : « " + texte + " »  (" + Math.round(cmp.score * 100) + " % des mots)" : "Je n'ai rien entendu."));
      if (cmp.score >= 0.8) son("juste"); else son("reessaie");
      bouton(box, "🔊 Réécouter le modèle", function () { try { speak(e.texte, "en-US", 0.85); } catch (x) {} }, "s");
      suite();
    }
    etape(0);
  }

  function fin(cle, ti, bilan) {
    nettoyer();
    var ex = REG.examens[cle];
    var box = cadre(ex.court + " · Bilan", 1);
    box.appendChild(el("div", "fm-ico", "🏁"));
    var rep = bilan.repeat.concat(bilan.readaloud);
    if (rep.length) {
      var m = Math.round(rep.reduce(function (s, v) { return s + v; }, 0) / rep.length * 100);
      var bons = rep.filter(function (v) { return v >= 0.8; }).length;
      box.appendChild(el("div", "fm-tr", "Répétition et lecture : " + bons + " / " + rep.length + " phrases bien dites (" + m + " % des mots)."));
    }
    if (bilan.question.length) {
      var mt = bilan.question.reduce(function (s, v) { return s + v.mots; }, 0);
      box.appendChild(el("div", "fm-tr", "Entretien : " + bilan.question.length + " réponses, " + Math.round(mt / bilan.question.length) + " mots en moyenne par réponse."));
    }
    box.appendChild(el("p", "fm-p", "Ce bilan compte les mots reconnus. Ce n'est pas une note officielle de l'examen."));
    try { if (typeof addXP === "function") addXP(8); if (typeof bumpDailyGoal === "function") bumpDailyGoal(1); } catch (e) {}
    try {
      var h = JSON.parse(localStorage.getItem("diisoo_fmt") || "[]"); h.push({ e: cle, t: ex.tests[ti].id, d: new Date().toISOString().slice(0, 10) });
      localStorage.setItem("diisoo_fmt", JSON.stringify(h.slice(-60)));
    } catch (e) {}
    bouton(box, "↻ Refaire ce test", function () { lancer(cle, ti); });
    bouton(box, "Choisir un autre test", function () { ouvrir(cle); }, "s");
    bouton(box, "Fermer", fermer, "s");
  }

  /* ---------- bouton dans la liste des tests ---------- */
  function brancher() {
    var box = $("exam-tests");
    if (!box || box.style.display === "none" || box.querySelector(".fx-reel")) return;
    var titre = box.querySelector(".et-titre");
    if (!titre) return;
    if (!REG) { charger().then(brancher); return; }
    var txt = (titre.textContent || "").toLowerCase(), cle = null;
    Object.keys(REG.examens).forEach(function (k) { if (txt.indexOf(REG.examens[k].court.toLowerCase()) === 0) cle = k; });
    if (!cle) return;
    var b = el("button", "fx-reel"); b.type = "button";
    b.innerHTML = "🎯 Format réel " + REG.examens[cle].court + "<small>Les mêmes tâches et les mêmes durées que l'examen</small>";
    b.onclick = function () { ouvrir(cle); };
    titre.parentNode.insertBefore(b, titre.nextSibling);
  }
  var plan = false;
  try {
    new MutationObserver(function () { if (plan) return; plan = true; requestAnimationFrame(function () { plan = false; brancher(); }); })
      .observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
  charger().then(brancher);

  window.DiisooExams2 = { version: 1, ouvrir: ouvrir, registre: function () { return REG; } };
})();
