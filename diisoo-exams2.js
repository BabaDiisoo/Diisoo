/* diisoo-exams2.js v3 : « Format réel » des examens, piloté par un registre
   Lit exam-formats.json : pour chaque examen, les tâches (type, nombre, préparation, durée de réponse) et les tests.
   Types gérés : repeat (écoute et répète), readaloud (lire à voix haute), question (réponse orale chronométrée),
   prompt (consigne affichée), describe (photo ou graphique), info (document puis questions),
   retell (résumer un cours entendu), short (réponse courte).
   v3 : fin de parole détectée par le micro, correction et suggestions (diisoo-oral.js), passage automatique à la question suivante,
   import des anciens thèmes IELTS (TEST_BANK) enrichis d'un enregistrement et de la partie « poser des questions ».
   Pour suivre un changement du vrai examen, on modifie exam-formats.json seulement : aucun code à toucher. */
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
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  /* ---------- comparaison ---------- */
  function mots(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean); }
  function comparer(cible, entendu) {
    if (window.DiisooCoach && window.DiisooCoach._comparer) return window.DiisooCoach._comparer(cible, entendu);
    var H = mots(entendu), res = [], ok = 0;
    mots(cible).forEach(function (w) { var v = H.indexOf(w) > -1; if (v) ok++; res.push({ w: w, etat: v ? 2 : 0 }); });
    return { mots: res, score: res.length ? ok / res.length : 0 };
  }

  /* ---------- graphique en barres (PTE : décrire un graphique) ---------- */
  function graphique(g) {
    var W = 320, H = 190, m = 28, max = Math.max.apply(null, g.valeurs), n = g.valeurs.length, bw = (W - 2 * m) / n * 0.6, gap = (W - 2 * m) / n, s = "";
    s += '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" style="width:100%;background:#fff;border-radius:12px">';
    s += '<text x="' + W / 2 + '" y="16" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#222">' + esc(g.titre) + "</text>";
    s += '<line x1="' + m + '" y1="' + (H - 28) + '" x2="' + (W - m + 6) + '" y2="' + (H - 28) + '" stroke="#444"/>';
    g.valeurs.forEach(function (v, i) {
      var h = (H - 70) * v / max, x = m + i * gap + (gap - bw) / 2, y = H - 28 - h;
      s += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + h + '" fill="#2f5ca3" rx="3"/>';
      s += '<text x="' + (x + bw / 2) + '" y="' + (y - 4) + '" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#222">' + v + "</text>";
      s += '<text x="' + (x + bw / 2) + '" y="' + (H - 12) + '" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#222">' + esc(g.labels[i]) + "</text>";
    });
    return s + "</svg>";
  }

  /* ---------- styles ---------- */
  var st = document.createElement("style");
  st.textContent =
    ".fx-reel{width:100%;min-height:56px;margin:6px 0 4px;border-radius:16px;border:0;background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;font-size:15px;font-weight:800;text-align:left;padding:8px 14px}" +
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
    "#dii-fmt .fm-big{font-size:20px;font-weight:700;line-height:1.35;text-align:center;margin:12px 0}" +
    "#dii-fmt .fm-ico{font-size:50px;text-align:center;margin:8px 0}" +
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
    "#dii-fmt .fm-doc{background:#F6F1E7;color:#1b1b1b;border-radius:12px;padding:12px;margin:8px 0;font-size:14px;line-height:1.6}" +
    "#dii-fmt .fm-doc b{display:block;margin-bottom:4px}" +
    "#dii-fmt .fm-img{margin:8px 0;border-radius:12px;overflow:hidden}#dii-fmt .fm-img svg{width:100%;height:auto;display:block}" +
    "#dii-fmt .fm-src{font-size:11px;color:#8C8064;text-align:center;margin-top:10px;line-height:1.4}";
  var st2 = document.createElement("style");
  st2.textContent =
    "@keyframes fmpulse{0%{transform:scale(1)}50%{transform:scale(1.12)}100%{transform:scale(1)}}" +
    "#dii-fmt .fm-ico.on{animation:fmpulse 1.1s infinite}" +
    "#dii-fmt .fm-live{min-height:42px;background:#141A2B;border:1px dashed #2a3350;border-radius:12px;padding:8px 10px;font-size:14px;color:#E4DCC9;line-height:1.35;margin:8px 0;text-align:center}" +
    "#dii-fmt .fm-sug{background:#141A2B;border:1px solid #1E2740;border-radius:12px;padding:10px;margin:8px 0;font-size:13px;line-height:1.5;color:#E4DCC9}" +
    "#dii-fmt .fm-sug b{display:block;color:#F3A94E;font-size:12px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}" +
    "#dii-fmt .fm-sug small{display:block;color:#A69C86;font-size:11px;margin:1px 0 6px}" +
    "#dii-fmt .fm-auto{height:6px;border-radius:99px;background:#141A2B;overflow:hidden;margin:10px 0 4px}" +
    "#dii-fmt .fm-auto i{display:block;height:100%;width:100%;background:#25D366}" +
    "#exam-tests.fx-seul>*:not(.et-retour):not(.fx-reel){display:none!important}";
  document.head.appendChild(st2);

  /* ---------- lecteur ---------- */
  var ov = null, jeton = 0, minuteur = null, ecoute = null, vadT = null, autoT = null;
  function AUTO() { try { return localStorage.getItem("diisoo_fmt_auto") !== "0"; } catch (e) { return true; } }

  function nettoyer() {
    jeton++;
    if (minuteur) { clearInterval(minuteur); minuteur = null; }
    if (vadT) { clearInterval(vadT); vadT = null; }
    if (autoT) { clearTimeout(autoT); autoT = null; }
    if (ecoute) { try { ecoute.stop(); } catch (e) {} ecoute = null; }
    try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
  }
  function fermer() { nettoyer(); if (ov) { ov.remove(); ov = null; } }

  function cadre(titre, prog) {
    if (!ov) {
      ov = el("div"); ov.id = "dii-fmt"; ov.setAttribute("role", "dialog");
      ov.appendChild(el("div", "fm-box")); document.body.appendChild(ov);
    }
    var box = ov.firstChild; box.innerHTML = ""; box.scrollTop = 0;
    var top = el("div", "fm-top");
    var x = el("button", "fm-x", "✕"); x.type = "button"; x.setAttribute("aria-label", "Fermer"); x.onclick = fermer;
    top.appendChild(x); top.appendChild(el("div", "fm-tt", titre || "")); top.appendChild(el("div")); top.lastChild.style.width = "44px";
    box.appendChild(top);
    if (prog != null) { var pg = el("div", "fm-pg"); var i = el("i"); i.style.width = Math.round(prog * 100) + "%"; pg.appendChild(i); box.appendChild(pg); }
    return box;
  }
  function bouton(box, txt, fn, cls) { var b = el("button", "fm-b" + (cls ? " " + cls : ""), txt); b.type = "button"; b.onclick = fn; box.appendChild(b); return b; }

  /* contenu visuel d'un item : photo, graphique, document, consigne */
  function support(box, e) {
    var it = e.item;
    if (it && typeof it === "object") {
      if (it.consigne) box.appendChild(el("div", "fm-tr", it.consigne));
      if (it.scene) {
        var im = el("div", "fm-img");
        try { im.innerHTML = window.DiisooExams ? window.DiisooExams.scene(it.scene) : ""; } catch (x) {}
        box.appendChild(im);
      }
      if (it.graphique) { var gi = el("div", "fm-img"); gi.innerHTML = graphique(it.graphique); box.appendChild(gi); }
    }
    if (e.doc) {
      var d = el("div", "fm-doc"); var t = el("b", null, e.doc.titre); d.appendChild(t);
      e.doc.lignes.forEach(function (l) { d.appendChild(el("div", null, l)); });
      box.appendChild(d);
    }
    if (e.visible) box.appendChild(el("div", "fm-tr", e.visible));
  }

  /* ---------- accueil d'un examen ---------- */
  var BANAL = /^(about|every|there|their|would|which|always|because|today|while|other|these|those|after|before|again|really|still|three|small)$/;
  function clesDe(txt) {
    var vus = {}, out = [];
    (txt.match(/[A-Za-z']{5,}|\b\d+\b/g) || []).forEach(function (w) {
      var k = w.toLowerCase(); if (BANAL.test(k) || vus[k]) return; vus[k] = 1; if (out.length < 8) out.push(k);
    });
    return out;
  }
  function enrichir() {
    try {
      Object.keys(REG.examens).forEach(function (k) {
        var ex = REG.examens[k];
        if (!ex.import_ancien || !ex.enregistrements || ex._imp || typeof TEST_BANK === "undefined") return;
        ex._imp = true;
        TEST_BANK.forEach(function (t) {
          var rec = ex.enregistrements[t.id];
          if (!rec || ex.tests.some(function (x) { return x.id === "ie-" + t.id; })) return;
          var ph = {}; (t.phases || []).forEach(function (p) { ph[p.id] = p.questions || []; });
          var th = t.topic;
          ex.tests.push({ id: "ie-" + t.id, titre: th,
            p1a: (ph["1a"] || []).slice(0, 3), p1b: (ph["1b"] || []).slice(0, 5),
            ask: ["Ask the examiner three questions about this theme: " + th + ". Start with What, Where or Do you."],
            p2a: [{ t: rec, cles: clesDe(rec) }],
            p2b: (ph["2b"] || []).slice(0, 2).concat(["What do you like or dislike about " + th.toLowerCase().replace(/&/g, "and") + "? Explain why."]) });
        });
      });
    } catch (e) { console.warn("[diisoo] import examens", e); }
  }
  function nbReel(ex, t) {
    var test = ex.tests[0], b = test[t.banque || t.type];
    if (t.type === "info") return t.nb;
    return b ? Math.min(t.nb, b.length) : t.nb;
  }
  function ouvrir(cle) {
    var ex = REG && REG.examens && REG.examens[cle]; if (!ex) return;
    enrichir();
    nettoyer();
    var box = cadre((ex.bouton ? ex.groupe + " " + ex.bouton : ex.court) + " · Format réel");
    box.appendChild(el("h3", null, ex.nom));
    box.appendChild(el("p", "fm-p", ex.resume));
    ex.taches.forEach(function (t) {
      var prep = t.type === "info" ? t.lecture_s + " s pour lire le document" : (t.prep_s ? t.prep_s + " s de préparation" : "pas de préparation");
      var rep = t.type === "info" ? t.reps.join(" / ") + " s pour répondre" : t.rep_s + " s pour répondre";
      box.appendChild(el("div", "fm-tr", nbReel(ex, t) + " × " + t.titre + " : " + prep + ", " + rep));
    });
    var libre = false; try { libre = typeof aAcces === "function" && aAcces("premium"); } catch (e) {}
    ex.tests.forEach(function (t, i) {
      var verrou = i >= (ex.gratuits || 1) && !libre;
      bouton(box, (verrou ? "⭐ " : "▶ ") + "Test " + (i + 1) + " : " + t.titre, function () {
        if (verrou) { try { toast("Ce test est réservé aux abonnés Premium."); openPremium(); } catch (e) {} return; }
        lancer(cle, i);
      }, verrou ? "s l" : "");
    });
    var ba = bouton(box, "⚙️ Passage automatique à la question suivante : " + (AUTO() ? "OUI" : "NON"), function () {
      try { localStorage.setItem("diisoo_fmt_auto", AUTO() ? "0" : "1"); } catch (e) {}
      ba.textContent = "⚙️ Passage automatique à la question suivante : " + (AUTO() ? "OUI" : "NON");
    }, "s");
    box.appendChild(el("div", "fm-src", ex.confiance + " Dernière vérification : " + ex.verifie_le + ". Les tests sont créés par Diisoo. Diisoo n'est pas affilié aux organismes d'examen."));
  }

  /* ---------- déroulé d'un test ---------- */
  function lancer(cle, ti) {
    var ex = REG.examens[cle], test = ex.tests[ti], etapes = [];
    ex.taches.forEach(function (t) {
      var banque = test[t.banque || t.type] || [];
      if (t.type === "info") {
        banque.forEach(function (g) {
          g.questions.forEach(function (q, j) {
            etapes.push({ tache: { id: t.id, type: "question", titre: t.titre, prep_s: t.prep_s, rep_s: t.reps[j] || 15, consigne: t.consigne },
              i: j, n: g.questions.length, item: q, doc: g.doc, lecture: j === 0 ? t.lecture_s : 0 });
          });
        });
        return;
      }
      for (var i = 0; i < t.nb && i < banque.length; i++) etapes.push({ tache: t, i: i, n: Math.min(t.nb, banque.length), item: banque[i] });
    });
    var bilan = { precision: [], courtes: [], oraux: [], cles: [] };

    function texteDe(e) { var it = e.item; return typeof it === "string" ? it : (it.t || it.q || it.consigne || ""); }
    function etape(k) {
      if (k >= etapes.length) return fin(cle, ti, bilan);
      var e = etapes[k], mon = ++jeton, ty = e.tache.type;
      e.k = k; e.mon = mon; e.prog = k / etapes.length; e.titre = e.tache.titre + (e.n > 1 ? " " + (e.i + 1) + "/" + e.n : "");
      if (ty === "readaloud") return lire(e);
      if (ty === "prompt") return consigne(e);
      if (ty === "describe") return decrire(e);
      return ecouter(e);   /* repeat, question, retell, short */
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
    function arret() { if (minuteur) { clearInterval(minuteur); minuteur = null; } }

    /* attente avant de parler : lecture du document, préparation */
    function preparer(e, secondes, libelle, suite, avecSupport) {
      var box = cadre(e.titre, e.prog);
      box.appendChild(el("p", "fm-p", libelle));
      if (avecSupport) support(box, e);
      var go = function () { if (e.mon === jeton) { arret(); suite(); } };
      compte(box, secondes, go);
      bouton(box, "Je suis prêt", go, "s");
    }

    function silenceMs(t) {
      if (t.silence_ms) return t.silence_ms;
      if (t.type === "short") return 1200;
      if (t.type === "repeat") return 1500;
      if (t.type === "question") return t.rep_s <= 20 ? 1800 : (t.rep_s <= 30 ? 2200 : 2800);
      return 3000;
    }
    function parler(e) {
      var box = cadre(e.titre, e.prog);
      var ico = el("div", "fm-ico on", "🎙️"); box.appendChild(ico);
      var etat = el("p", "fm-p", "Parle maintenant. Quand tu as fini, fais une pause : je passe à la suite."); box.appendChild(etat);
      support(box, e);
      var live = el("div", "fm-live", "…"); box.appendChild(live);
      var debut = Date.now(), fini = false, aParle = false, dernier = Date.now();
      var seuil = silenceMs(e.tache), minM = e.tache.type === "repeat" ? 2 : 1, attenteMax = Math.min(9000, e.tache.rep_s * 600);
      function terminer(res) {
        if (fini || e.mon !== jeton) return; fini = true;
        if (vadT) { clearInterval(vadT); vadT = null; }
        arret(); ecoute = null;
        resultat(e, res || { text: "" }, (Date.now() - debut) / 1000);
      }
      function stopper(raison) {
        if (fini) return;
        if (raison === "silence") { son("ferme"); etat.textContent = "✅ J'ai compris que tu as fini."; ico.className = "fm-ico"; ico.textContent = "✅"; }
        else if (raison === "rien") { etat.textContent = "Je n'ai rien entendu."; }
        try { ecoute && ecoute.stop(); } catch (x) {}
      }
      son("ouvre");
      try {
        ecoute = startListening("en-US", e.tache.rep_s * 1000, true, function (t) {
          dernier = Date.now();
          if (!aParle && mots(t).length >= minM) aParle = true;
          live.textContent = "« " + t + " »";
        });
        ecoute.promise.then(terminer, function () { terminer({ text: "" }); });
      } catch (err) { terminer({ text: "", unsupported: true }); }
      if (vadT) clearInterval(vadT);
      vadT = setInterval(function () {
        var now = Date.now();
        if (aParle && now - dernier >= seuil) stopper("silence");
        else if (!aParle && now - debut >= attenteMax) stopper("rien");
      }, 200);
      compte(box, e.tache.rep_s, function () { try { ecoute && ecoute.stop(); } catch (x) {} });
      bouton(box, "✋ J'ai fini", function () { try { ecoute && ecoute.stop(); } catch (x) {} }, "s");
    }

    /* la consigne est dite une seule fois, puis préparation éventuelle, puis réponse */
    function ecouter(e) {
      var ty = e.tache.type, box = cadre(e.titre, e.prog);
      box.appendChild(el("div", "fm-ico", "🔊"));
      box.appendChild(el("p", "fm-p", e.tache.consigne));
      if (e.lecture) {
        /* premier élément d'un groupe avec document : lecture du document d'abord */
        e.lecture0 = e.lecture; e.lecture = 0;
        return preparer(e, e.lecture0, "Lis le document. Les questions arrivent ensuite.", function () { ecouter(e); }, true);
      }
      if (e.doc) support(box, e);
      box.appendChild(el("p", "fm-p", "Écoute bien : la question n'est dite qu'une fois."));
      Promise.race([Promise.resolve().then(function () { return speak(texteDe(e), "en-US", 0.95); }), attendre(40000)]).then(function () {
        if (e.mon !== jeton) return;
        if (ty === "question") e.visible = texteDe(e);
        if (ty === "retell") e.visible = "";
        if (e.tache.prep_s) preparer(e, e.tache.prep_s, "Temps de préparation", function () { parler(e); }, true);
        else parler(e);
      }, function () { if (e.mon === jeton) { e.visible = texteDe(e); parler(e); } });
    }

    function lire(e) {
      var go = function () { parler(e); };
      e.visible = texteDe(e);
      if (e.tache.prep_s) preparer(e, e.tache.prep_s, e.tache.consigne, go, true);
      else go();
    }
    function consigne(e) {
      e.visible = texteDe(e);
      var run = function () {
        if (e.tache.prep_s) preparer(e, e.tache.prep_s, e.tache.consigne, function () { parler(e); }, true);
        else parler(e);
      };
      if (e.tache.lue) { try { speak(e.visible, "en-US", 0.95); } catch (x) {} }
      run();
    }
    function decrire(e) {
      e.visible = "";
      if (e.tache.prep_s) preparer(e, e.tache.prep_s, e.tache.consigne, function () { parler(e); }, true);
      else { var b = cadre(e.titre, e.prog); b.appendChild(el("p", "fm-p", e.tache.consigne)); support(b, e); bouton(b, "🎙️ Commencer à parler", function () { parler(e); }); }
    }

    function resultat(e, res, dur) {
      var ty = e.tache.type, k = e.k, box = cadre(e.titre, (k + 1) / etapes.length);
      var texte = (res.text || "").trim(), cible = texteDe(e);
      var suite = function (nSug, manuel) {
        var dernierEl = k + 1 >= etapes.length, mon2 = jeton, ms = Math.min(11000, 4500 + 1500 * (nSug || 0));
        var go = function () { if (mon2 !== jeton) return; if (autoT) { clearTimeout(autoT); autoT = null; } etape(k + 1); };
        bouton(box, dernierEl ? "Voir mon bilan" : "Suivant ›", go);
        if (AUTO() && !manuel) {
          var bar = el("div", "fm-auto"), bi = el("i"); bar.appendChild(bi);
          var msg = el("p", "fm-p", dernierEl ? "Ton bilan s'affiche dans quelques secondes." : "La question suivante arrive toute seule.");
          box.appendChild(msg); box.appendChild(bar);
          bi.style.transition = "width " + ms + "ms linear";
          requestAnimationFrame(function () { requestAnimationFrame(function () { bi.style.width = "0%"; }); });
          var pause = bouton(box, "⏸ Rester ici pour relire", function () { if (autoT) { clearTimeout(autoT); autoT = null; } bar.remove(); msg.remove(); pause.remove(); }, "s");
          autoT = setTimeout(go, ms);
        }
      };
      var conseils = function (libre) {
        if (!window.DiisooOral) return 0;
        var a = window.DiisooOral.analyser(texte, texteDe(e), { duree: e.tache.rep_s, ask: e.tache.id === "ask", court: ty === "short", libre: libre });
        var n = 0;
        if (a.corrections.length) {
          var c = el("div", "fm-sug"); c.appendChild(el("b", null, "À corriger"));
          a.corrections.forEach(function (f) { var d = el("div"); d.innerHTML = "❌ <s>" + esc(f.avant) + "</s> → ✅ <b>" + esc(f.apres) + "</b><small>" + esc(f.note) + "</small>"; c.appendChild(d); n++; });
          box.appendChild(c);
        }
        if (a.conseils.length) {
          var g = el("div", "fm-sug"); g.appendChild(el("b", null, "Pour progresser"));
          a.conseils.forEach(function (x) { g.appendChild(el("div", null, "💡 " + x)); n++; });
          box.appendChild(g);
        }
        if (!n) box.appendChild(el("p", "fm-p", "👍 Rien à corriger sur cette réponse."));
        return n;
      };
      var rejouer = function () { bouton(box, "↻ Recommencer cette question", function () { var m = ++jeton; e.mon = m; ecouter(e); }, "s"); };

      if (res.unsupported) {
        box.appendChild(el("p", "fm-p", "Ton navigateur ne reconnaît pas la voix. Juge toi-même ta réponse."));
        if (ty === "repeat" || ty === "readaloud") box.appendChild(el("div", "fm-big", cible));
        bouton(box, "✅ C'était bien", function () { noter(e, ty, 1, dur, 0); etape(k + 1); });
        bouton(box, "❌ Pas encore", function () { noter(e, ty, 0, dur, 0); etape(k + 1); }, "s");
        return;
      }
      if (!texte) {
        box.appendChild(el("div", "fm-ico", "🤔"));
        box.appendChild(el("p", "fm-p", "Je n'ai rien entendu. Garde le téléphone près de la bouche."));
        noter(e, ty, 0, dur, 0);
        suite(0, true); rejouer(); return;
      }
      if (ty === "repeat" || ty === "readaloud") {
        var cmp = comparer(cible, texte);
        bilan.precision.push(cmp.score);
        box.appendChild(el("div", "fm-ico", cmp.score >= 0.8 ? "✅" : (cmp.score >= 0.5 ? "🟡" : "❌")));
        var wrap = el("div", "fm-mots");
        cmp.mots.forEach(function (m) { wrap.appendChild(el("span", "fm-m " + (m.etat === 2 ? "v" : (m.etat === 1 ? "o" : "r")), m.w)); });
        box.appendChild(wrap);
        box.appendChild(el("p", "fm-p", "J'ai entendu : « " + texte + " »  (" + Math.round(cmp.score * 100) + " % des mots)"));
        son(cmp.score >= 0.8 ? "juste" : "reessaie");
        bouton(box, "🔊 Réécouter le modèle", function () { try { speak(cible, "en-US", 0.85); } catch (x) {} }, "s");
        suite(cmp.score >= 0.8 ? 0 : 1); return;
      }
      if (ty === "short") {
        var rep = mots(texte), bonnes = e.item.a || [], ok = bonnes.some(function (a) { return rep.indexOf(a.toLowerCase()) > -1; });
        bilan.courtes.push(ok ? 1 : 0);
        box.appendChild(el("div", "fm-ico", ok ? "✅" : "❌"));
        box.appendChild(el("p", "fm-p", ok ? "Bonne réponse." : "J'ai entendu : « " + texte + " ». Réponse attendue : " + bonnes.join(" ou ") + "."));
        son(ok ? "juste" : "reessaie"); suite(ok ? 0 : 1); return;
      }
      /* question, prompt, describe, retell : on mesure le volume de parole */
      var n = mots(texte).length, objectif = Math.round(e.tache.rep_s * 1.2);
      bilan.oraux.push({ mots: n, obj: objectif });
      var plein = n >= objectif * 0.6;
      box.appendChild(el("div", "fm-ico", plein ? "✅" : "🟡"));
      box.appendChild(el("p", "fm-p", "Tu as dit " + n + " mots en " + Math.round(dur) + " secondes. Objectif conseillé : environ " + objectif + " mots."));
      box.appendChild(el("div", "fm-tr", "J'ai entendu : « " + texte + " »"));
      if (ty === "retell" && e.item.cles) {
        var dit = texte.toLowerCase(), trouves = e.item.cles.filter(function (c) { return dit.indexOf(c.toLowerCase()) > -1; });
        bilan.cles.push(trouves.length / e.item.cles.length);
        box.appendChild(el("p", "fm-p", "Idées clés retrouvées : " + trouves.length + " sur " + e.item.cles.length + " (" + e.item.cles.join(", ") + ")."));
      }
      var nS = conseils(ty !== "question");
      if (!window.DiisooOral && !plein) box.appendChild(el("p", "fm-p", "Astuce : ajoute une raison et un exemple (« because… », « for example… »)."));
      suite(nS);
    }
    function noter(e, ty, v, dur, n) {
      if (ty === "repeat" || ty === "readaloud") bilan.precision.push(v);
      else if (ty === "short") bilan.courtes.push(v);
      else bilan.oraux.push({ mots: n, obj: Math.round(e.tache.rep_s * 1.2), manuel: v });
    }
    etape(0);
  }

  function fin(cle, ti, bilan) {
    nettoyer();
    var ex = REG.examens[cle];
    var box = cadre((ex.bouton ? ex.groupe + " " + ex.bouton : ex.court) + " · Bilan", 1);
    box.appendChild(el("div", "fm-ico", "🏁"));
    function moy(a) { return a.reduce(function (s, v) { return s + v; }, 0) / a.length; }
    if (bilan.precision.length) box.appendChild(el("div", "fm-tr", "Répétition et lecture : " + bilan.precision.filter(function (v) { return v >= 0.8; }).length + " / " + bilan.precision.length + " bien dites (" + Math.round(moy(bilan.precision) * 100) + " % des mots)."));
    if (bilan.courtes.length) box.appendChild(el("div", "fm-tr", "Réponses courtes : " + bilan.courtes.reduce(function (s, v) { return s + v; }, 0) + " / " + bilan.courtes.length + " justes."));
    if (bilan.oraux.length) box.appendChild(el("div", "fm-tr", "Réponses orales : " + bilan.oraux.length + " réponses, " + Math.round(moy(bilan.oraux.map(function (o) { return o.mots; }))) + " mots en moyenne (objectif conseillé : " + Math.round(moy(bilan.oraux.map(function (o) { return o.obj; }))) + ")."));
    if (bilan.cles.length) box.appendChild(el("div", "fm-tr", "Écoute et compréhension : " + Math.round(moy(bilan.cles) * 100) + " % des idées clés retrouvées."));
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

  /* ---------- boutons dans la liste des tests ---------- */
  function brancher() {
    var box = $("exam-tests");
    if (box && box.style.display === "none") delete box.dataset.auto;
    if (!box || box.style.display === "none" || box.querySelector(".fx-reel")) return;
    var titre = box.querySelector(".et-titre");
    if (!titre) return;
    if (!REG) { charger().then(brancher); return; }
    var txt = (titre.textContent || "").toLowerCase(), cles = [];
    Object.keys(REG.examens).forEach(function (k) {
      var g = (REG.examens[k].groupe || REG.examens[k].court).toLowerCase();
      if (txt.indexOf(g) === 0) cles.push(k);
    });
    var ref = titre, seul = null;
    cles.forEach(function (k) { if (REG.examens[k].remplace_ancien) seul = k; });
    if (seul) box.classList.add("fx-seul");
    cles.forEach(function (k) {
      var ex = REG.examens[k], b = el("button", "fx-reel"); b.type = "button";
      b.innerHTML = "🎯 Format réel " + esc(ex.bouton ? ex.groupe + " " + ex.bouton : ex.court) + "<small>Les mêmes tâches et les mêmes durées que l'examen</small>";
      b.onclick = function () { ouvrir(k); };
      ref.parentNode.insertBefore(b, ref.nextSibling); ref = b;
    });
    if (seul && cles.length === 1 && !box.dataset.auto) { box.dataset.auto = "1"; setTimeout(function () { ouvrir(seul); }, 250); }
  }
  var plan = false;
  try {
    new MutationObserver(function () { if (plan) return; plan = true; requestAnimationFrame(function () { plan = false; brancher(); }); })
      .observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
  charger().then(brancher);

  window.DiisooExams2 = { version: 3, ouvrir: ouvrir, registre: function () { return REG; } };
})();
