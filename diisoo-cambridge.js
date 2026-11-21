/* Diisoo · Cambridge A2 Key et B1 Preliminary : Reading & Writing, Listening, examen blanc au format réduit.
   Contenu original. Résultats = estimation de niveau, pas une note Cambridge. */
(function () {
  "use strict";
  var DATA = null, ui = null, K = null;
  var NIV = {
    a2: { nom: "Cambridge A2 Key", tuile: /Cambridge A2/, cle: "cambridge_a2", rw: 30, li: 12, ls: "diisoo_camb_a2_blancs",
      rwDesc: "Reading & Writing · 1 h · 7 parties · 32 questions + 2 textes", liDesc: "Listening · 30 min · 5 parties · 25 questions", spDesc: "Speaking · 8 à 10 min à deux · 2 parties",
      R: [["r1", "Part 1 · Panneaux et messages", "Choisis ce que dit le texte"], ["r2", "Part 2 · Association", "Relie des personnes à des textes"], ["r3", "Part 3 · Texte long", "Questions à choix multiple"], ["r4", "Part 4 · Texte à trous (choix)", "Choisis le bon mot"], ["r5", "Part 5 · Texte à trous (libre)", "Écris le mot qui manque"]],
      W: ["Part 6 et 7 · Écriture", "E-mail court (25 mots) et histoire en images (35 mots)"],
      L: [["l1", "Part 1 · Mini-dialogues", "Choix multiple"], ["l2", "Part 2 · Notes à compléter", "Écris les mots entendus"], ["l3", "Part 3 · Dialogue", "Choix multiple"], ["l4", "Part 5 · Association", "Qui a fait quoi"]] },
    b1: { nom: "Cambridge B1 Preliminary", tuile: /Cambridge B1/, cle: "cambridge_b1", rw: 45, li: 14, ls: "diisoo_camb_b1_blancs",
      rwDesc: "Reading 45 min (6 parties, 32 questions) + Writing 45 min (2 parties)", liDesc: "Listening · 30 min · 4 parties · 25 questions", spDesc: "Speaking · 10 à 12 min à deux · 4 parties",
      R: [["r1", "Part 1 · Messages courts", "Choisis le but du message"], ["r2", "Part 2 · Association", "Relie des personnes à des textes"], ["r3", "Part 3 · Article", "Questions à choix multiple"], ["r4", "Part 4 · Phrases manquantes", "Choisis la phrase qui convient"], ["r5", "Part 5 · Texte à trous (choix)", "Choisis le bon mot"], ["r6", "Part 6 · Texte à trous (libre)", "Écris le mot qui manque"]],
      W: ["Writing · 2 parties", "E-mail (100 mots) et article ou histoire (100 mots)"],
      L: [["l1", "Part 1 · Mini-dialogues", "Choix multiple"], ["l2", "Part 2 · Dialogue ou interview", "Idée générale"], ["l3", "Part 3 · Notes à compléter", "Écris les mots entendus"], ["l4", "Part 4 · Interview", "Détails et opinions"]] }
  };
  function el(t, c, h) { return ui.el(t, c, h); }
  function charger() {
    if (DATA) return Promise.resolve(DATA);
    return fetch("cambridge-data.json").then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) { DATA = d; return d; });
  }
  function rx(s) { if (!s || typeof s !== "string") return s; var m = s.match(/^\/(.*)\/([a-z]*)$/); return m ? new RegExp(m[1], m[2]) : null; }
  function items(niv, k, d, tache) {
    var N = NIV[niv], arr = d[niv][k] || [];
    if (k === "w") return arr.map(function (x) { var y = JSON.parse(JSON.stringify(x.x)); y.kw = rx(y.kw); return { kind: "libre", tache: tache, x: y }; });
    var ctw = k === "r5" || k === "r6" || k === "l2" && niv === "a2" || k === "l3" && niv === "b1";
    return arr.map(function (x) {
      if (x.complet) return { kind: "ctw", complet: true, tache: tache, titre: x.titre, texte: x.texte, audio: x.t };
      return { kind: "mcq", tache: tache, titre: x.titre, texte: x.texte, audio: x.t, qs: x.q };
    });
  }
  function nomPart(N, k) { var r = N.R.concat(N.L).filter(function (p) { return p[0] === k; })[0]; return r ? r[1] : N.W[0]; }
  function hist(N) { try { return JSON.parse(localStorage.getItem(N.ls) || "[]") || []; } catch (e) { return []; } }
  function ouvrir(niv) {
    var I = window.DiisooIelts, T = window.DiisooToefl; if (!I || !T) return;
    I.ouvrir(); T.init(); ui = I.ui; K = T; accueil(niv);
  }
  function accueil(niv) {
    var N = NIV[niv]; ui.vider(); ui.entete(N.nom + " : ton parcours", function () { window.DiisooIelts.fermer(); });
    var w = ui.racine(), h = hist(N);
    w.appendChild(el("p", "", "Un examen officiel Cambridge English. Suis les 3 étapes."));
    w.appendChild(el("p", "ie-n", "Étape 1 · Comprendre le test"));
    w.appendChild(ui.bouton("ie-p", "Voir le format officiel", function () { format(niv); }));
    w.appendChild(el("p", "ie-n", "Étape 2 · S'entraîner par partie"));
    w.appendChild(el("p", "ie-note", "📖 Reading"));
    N.R.forEach(function (p) { w.appendChild(ui.bouton("", '<span class="ie-n">' + p[1] + '</span><div class="ie-s">' + p[2] + "</div>", function () { partie(niv, p[0], p[1]); })); });
    w.appendChild(ui.bouton("", '<span class="ie-n">✍️ ' + N.W[0] + '</span><div class="ie-s">' + N.W[1] + "</div>", function () { partie(niv, "w", N.W[0]); }));
    w.appendChild(el("p", "ie-note", "🎧 Listening"));
    N.L.forEach(function (p) { w.appendChild(ui.bouton("", '<span class="ie-n">' + p[1] + '</span><div class="ie-s">' + p[2] + "</div>", function () { partie(niv, p[0], p[1]); })); });
    w.appendChild(ui.bouton("", '<span class="ie-n">🎤 Speaking</span><div class="ie-s">' + N.spDesc + " · entraînement oral avec analyse de ta voix</div>", function () { window.DiisooIelts.fermer(); try { window.DiisooExams2.ouvrir(N.cle); } catch (e) {} }));
    w.appendChild(el("p", "ie-n", "Étape 3 · Te tester"));
    w.appendChild(ui.bouton("", '<span class="ie-n">⏱ Examen blanc (format réduit)</span><div class="ie-s">Reading & Writing ' + N.rw + " min · Listening " + N.li + " min · une seule écoute</div>", function () { menuBlanc(niv); }));
    if (h.length) { var d = h[h.length - 1]; w.appendChild(el("div", "ie-note", "Dernier examen blanc : " + ui.esc(d.t) + " · " + d.p + " % · niveau estimé " + K.niveau(d.p))); }
    w.appendChild(ui.bouton("ie-x", "← Tous les examens", function () { window.DiisooIelts.ui.accueil(); }));
  }
  function format(niv) {
    var N = NIV[niv]; ui.vider(); ui.entete("Format " + N.nom, function () { accueil(niv); }); var w = ui.racine();
    [N.rwDesc, N.liDesc, N.spDesc].forEach(function (t) { w.appendChild(el("div", "ie-ctx", ui.esc(t))); });
    w.appendChild(el("div", "ie-note", "Source : Cambridge English (cambridgeenglish.org). Résultat officiel : échelle Cambridge English, avec certificat. Vérifie le format avant de t'inscrire. Diisoo propose des questions originales et une estimation de niveau, pas une note Cambridge."));
    w.appendChild(ui.bouton("ie-p", "Commencer l'entraînement", function () { accueil(niv); }));
  }
  function partie(niv, k, titre) {
    charger().then(function (d) {
      K.lancer(titre, items(niv, k, d, titre), { retour: function () { accueil(niv); } }, function (R) {
        ui.vider(); ui.entete("Résultat", function () { accueil(niv); }); var w = ui.racine(), pc = R.tot ? Math.round(R.ok / R.tot * 100) : 0;
        if (R.tot) { w.appendChild(el("h2", "", R.ok + " / " + R.tot + " · " + pc + " %")); w.appendChild(el("p", "", pc >= 70 ? "Très bien. Passe à la partie suivante." : "Refais cette partie et relis les corrections.")); }
        else w.appendChild(el("p", "", "Terminé. Relis ton texte et compare avec la consigne."));
        w.appendChild(ui.bouton("ie-p", "Continuer", function () { accueil(niv); }));
      });
    }, function () { ui.racine().appendChild(el("div", "ie-warn", "Contenu indisponible. Vérifie ta connexion.")); });
  }
  function menuBlanc(niv) {
    var N = NIV[niv]; ui.vider(); ui.entete("Examen blanc " + N.nom, function () { accueil(niv); }); var w = ui.racine();
    w.appendChild(el("div", "ie-warn", "Format réduit (environ un tiers des questions) avec temps proportionnel. Chaque partie s'arrête toute seule. Un seul audio, pas de pause. Résultat = estimation."));
    [["Reading & Writing + Listening", ["RW", "L"]], ["Reading & Writing seul · " + N.rw + " min", ["RW"]], ["Listening seul · " + N.li + " min", ["L"]]].forEach(function (c) {
      w.appendChild(ui.bouton("", '<span class="ie-n">' + c[0] + "</span>", function () { blanc(niv, c[1], c[0]); }));
    });
  }
  function blanc(niv, secs, titre) {
    var N = NIV[niv];
    charger().then(function (d) {
      var res = {}, i = 0;
      function suite() {
        if (i >= secs.length) return bilan(niv, titre, res);
        var s = secs[i++], its = [];
        if (s === "RW") { N.R.forEach(function (p) { its = its.concat(items(niv, p[0], d, p[1])); }); its = its.concat(items(niv, "w", d, N.W[0]).slice(0, 2)); }
        else N.L.forEach(function (p) { its = its.concat(items(niv, p[0], d, p[1])); });
        K.lancer(N.nom + " · " + (s === "RW" ? "Reading & Writing" : "Listening"), its, { examen: true, minutes: s === "RW" ? N.rw : N.li, retour: function () { menuBlanc(niv); } }, function (R, force) {
          res[s] = R;
          if (i < secs.length) { ui.vider(); ui.entete("Partie suivante", function () {}); ui.racine().appendChild(el("p", "", (force ? "Temps écoulé. " : "") + "Partie terminée. Respire, la suite arrive.")); ui.racine().appendChild(ui.bouton("ie-p", "Continuer", suite)); }
          else suite();
        });
      }
      suite();
    }, function () { ui.racine().appendChild(el("div", "ie-warn", "Contenu indisponible. Vérifie ta connexion.")); });
  }
  function bilan(niv, titre, res) {
    var N = NIV[niv]; ui.vider(); ui.entete("Bilan de l'examen blanc", function () { accueil(niv); }); var w = ui.racine(), ok = 0, tot = 0;
    [["RW", "Reading & Writing"], ["L", "Listening"]].forEach(function (s) {
      var R = res[s[0]]; if (!R) return; var o = R.ok, t = R.tot;
      (R.ecr || []).forEach(function (e) { o += e.sc; t += e.tot; });
      ok += o; tot += t; var p = t ? Math.round(o / t * 100) : 0;
      w.appendChild(el("div", "ie-row", "<b>" + s[1] + "</b><span>" + o + " / " + t + " · " + p + " % · niveau estimé " + K.niveau(p) + "</span>"));
    });
    var g = tot ? Math.round(ok / tot * 100) : 0;
    w.appendChild(el("h2", "", "Estimation globale : niveau " + K.niveau(g)));
    w.appendChild(el("div", "ie-note", "Estimation Diisoo sur des questions d'entraînement. Ce n'est pas une note Cambridge. L'écriture est vérifiée automatiquement (longueur, structure), pas notée par un examinateur."));
    var h = hist(N); h.push({ t: titre, p: g, d: Date.now() }); try { localStorage.setItem(N.ls, JSON.stringify(h.slice(-20))); } catch (e) {}
    w.appendChild(ui.bouton("ie-p", "Retour au parcours", function () { accueil(niv); }));
  }
  window.DiisooCambridge = { ouvrir: ouvrir };
  function brancher() {
    var h = document.getElementById("xh-hub"); if (!h || h.getAttribute("data-cb")) return;
    var found = 0;
    Array.prototype.forEach.call(h.querySelectorAll(".xh-g button"), function (t) {
      ["a2", "b1"].forEach(function (n) {
        if (NIV[n].tuile.test(t.textContent)) { found++; t.addEventListener("click", function (ev) { ev.stopImmediatePropagation(); ev.preventDefault(); ouvrir(n); }, true); }
      });
    });
    if (found) h.setAttribute("data-cb", "1");
  }
  try { new MutationObserver(brancher).observe(document.documentElement, { childList: true, subtree: true }); brancher(); } catch (e) {}
  try { var q = new URLSearchParams(location.search).get("cambridge"); if (q === "a2" || q === "b1") setTimeout(function () { ouvrir(q); }, 1000); } catch (e) {}
})();
