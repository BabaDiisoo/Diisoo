/* Diisoo · TOEIC Listening & Reading (7 parties) + Speaking/Writing existant + examen blanc au tiers.
   Contenu original. Résultats = estimation de niveau, pas un score ETS (10-990). */
(function () {
  "use strict";
  var LS = "diisoo_toeic_blancs", DATA = null, ui = null, K = null;
  var PARTS = [
    ["p1", "Part 1 · Photographs", "Regarde l'image, écoute 4 phrases, choisis la meilleure (6 questions à l'examen)", "L"],
    ["p2", "Part 2 · Question-Response", "Une question + 3 réponses entendues seulement (25 questions)", "L"],
    ["p3", "Part 3 · Conversations", "Dialogues courts, 3 questions chacun (39 questions)", "L"],
    ["p4", "Part 4 · Talks", "Annonces et messages, 3 questions chacun (30 questions)", "L"],
    ["p5", "Part 5 · Incomplete Sentences", "Complète la phrase : grammaire et vocabulaire (30 questions)", "R"],
    ["p6", "Part 6 · Text Completion", "Complète un texte professionnel (16 questions)", "R"],
    ["p7", "Part 7 · Reading Comprehension", "Emails, annonces, articles, textes doubles (54 questions)", "R"]
  ];
  function el(t, c, h) { return ui.el(t, c, h); }
  function charger() {
    if (DATA) return Promise.resolve(DATA);
    return fetch("toeic-data.json").then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) { DATA = d; return d; });
  }
  function hist() { try { return JSON.parse(localStorage.getItem(LS) || "[]") || []; } catch (e) { return []; } }
  function items(k, d) {
    var nom = PARTS.filter(function (p) { return p[0] === k; })[0][1];
    return (d[k] || []).map(function (x) { return { kind: "mcq", tache: nom, titre: x.titre, texte: x.texte, audio: x.t, scene: x.scene, qs: x.q }; });
  }
  function ouvrir() {
    var I = window.DiisooIelts, T = window.DiisooToefl; if (!I || !T) return;
    I.ouvrir(); T.init(); ui = I.ui; K = T; accueil();
  }
  function accueil() {
    ui.vider(); ui.entete("TOEIC : ton parcours", function () { window.DiisooIelts.fermer(); });
    var w = ui.racine(), h = hist();
    w.appendChild(el("p", "", "Le TOEIC mesure ton anglais au travail. Suis les 3 étapes."));
    w.appendChild(el("p", "ie-n", "Étape 1 · Comprendre le test"));
    w.appendChild(ui.bouton("ie-p", "Voir le format officiel", formatEcran));
    w.appendChild(el("p", "ie-n", "Étape 2 · S'entraîner par partie"));
    PARTS.forEach(function (p) { w.appendChild(ui.bouton("", '<span class="ie-n">' + (p[3] === "L" ? "🎧 " : "📖 ") + p[1] + '</span><div class="ie-s">' + p[2] + "</div>", function () { part(p); })); });
    w.appendChild(ui.bouton("", '<span class="ie-n">🎤 Speaking & Writing</span><div class="ie-s">Entraînement oral avec analyse de ta voix</div>', function () { window.DiisooIelts.fermer(); try { window.DiisooExams2.ouvrir("toeic"); } catch (e) {} }));
    w.appendChild(el("p", "ie-n", "Étape 3 · Te tester"));
    w.appendChild(ui.bouton("", '<span class="ie-n">⏱ Examen blanc (format réduit au tiers)</span><div class="ie-s">Listening 14 min · Reading 25 min · une seule écoute</div>', menuBlanc));
    if (h.length) { var d = h[h.length - 1]; w.appendChild(el("div", "ie-note", "Dernier examen blanc : " + ui.esc(d.t) + " · " + d.p + " % · niveau estimé " + K.niveau(d.p))); }
    w.appendChild(ui.bouton("ie-x", "← Tous les examens", function () { window.DiisooIelts.ui.accueil(); }));
  }
  function formatEcran() {
    ui.vider(); ui.entete("Format TOEIC Listening & Reading", accueil); var w = ui.racine();
    w.appendChild(el("p", "", "200 questions à choix multiple, environ 2 heures. Score total de 10 à 990 (5 à 495 par section)."));
    w.appendChild(el("div", "ie-ctx", "<b>Listening</b> · 100 questions · 45 min<br>• Part 1 Photographs (6)<br>• Part 2 Question-Response (25)<br>• Part 3 Conversations (39)<br>• Part 4 Talks (30)"));
    w.appendChild(el("div", "ie-ctx", "<b>Reading</b> · 100 questions · 75 min<br>• Part 5 Incomplete Sentences (30)<br>• Part 6 Text Completion (16)<br>• Part 7 Reading Comprehension (54)"));
    w.appendChild(el("div", "ie-note", "Il existe aussi des tests TOEIC Speaking et Writing séparés. Vérifie toujours le format sur le site officiel (ets.org/toeic). Diisoo propose des questions originales et une estimation de niveau, pas un score officiel."));
    w.appendChild(ui.bouton("ie-p", "Commencer l'entraînement", accueil));
  }
  function part(p) {
    charger().then(function (d) {
      K.lancer(p[1], items(p[0], d), { retour: accueil }, function (R) {
        ui.vider(); ui.entete("Résultat", accueil); var w = ui.racine(), pc = R.tot ? Math.round(R.ok / R.tot * 100) : 0;
        w.appendChild(el("h2", "", R.ok + " / " + R.tot + " · " + pc + " %"));
        w.appendChild(el("p", "", pc >= 70 ? "Très bien. Passe à la partie suivante." : "Refais cette partie et relis les corrections."));
        w.appendChild(ui.bouton("ie-p", "Continuer", accueil));
      });
    }, function () { ui.racine().appendChild(el("div", "ie-warn", "Contenu indisponible. Vérifie ta connexion.")); });
  }
  function menuBlanc() {
    ui.vider(); ui.entete("Examen blanc TOEIC", accueil); var w = ui.racine();
    w.appendChild(el("div", "ie-warn", "Format réduit au tiers (environ 70 questions) avec le temps proportionnel. Chaque partie s'arrête toute seule. Un seul audio, pas de pause. Résultat = estimation."));
    [["Listening + Reading", ["L", "R"]], ["Listening seul · 14 min", ["L"]], ["Reading seul · 25 min", ["R"]]].forEach(function (c) {
      w.appendChild(ui.bouton("", '<span class="ie-n">' + c[0] + "</span>", function () { blanc(c[0], c[1]); }));
    });
  }
  function blanc(titre, secs) {
    charger().then(function (d) {
      var res = {}, i = 0;
      function suite() {
        if (i >= secs.length) return bilan(titre, res);
        var s = secs[i++], its = [];
        PARTS.forEach(function (p) { if (p[3] === s) its = its.concat(items(p[0], d)); });
        K.lancer("TOEIC · " + (s === "L" ? "Listening" : "Reading"), its, { examen: true, minutes: s === "L" ? 14 : 25, retour: menuBlanc }, function (R, force) {
          res[s] = R;
          if (i < secs.length) { ui.vider(); ui.entete("Partie suivante", function () {}); ui.racine().appendChild(el("p", "", (force ? "Temps écoulé. " : "") + "Partie terminée. Respire, la suite arrive.")); ui.racine().appendChild(ui.bouton("ie-p", "Continuer", suite)); }
          else suite();
        });
      }
      suite();
    }, function () { ui.racine().appendChild(el("div", "ie-warn", "Contenu indisponible. Vérifie ta connexion.")); });
  }
  function bilan(titre, res) {
    ui.vider(); ui.entete("Bilan de l'examen blanc", accueil); var w = ui.racine(), ok = 0, tot = 0;
    [["L", "Listening"], ["R", "Reading"]].forEach(function (s) {
      var R = res[s[0]]; if (!R) return; ok += R.ok; tot += R.tot; var p = R.tot ? Math.round(R.ok / R.tot * 100) : 0;
      w.appendChild(el("div", "ie-row", "<b>" + s[1] + "</b><span>" + R.ok + " / " + R.tot + " · " + p + " % · niveau estimé " + K.niveau(p) + "</span>"));
    });
    var g = tot ? Math.round(ok / tot * 100) : 0;
    w.appendChild(el("h2", "", "Estimation globale : niveau " + K.niveau(g)));
    w.appendChild(el("div", "ie-note", "Estimation Diisoo sur des questions d'entraînement. Ce n'est pas un score TOEIC officiel (10 à 990)."));
    var h = hist(); h.push({ t: titre, p: g, d: Date.now() }); try { localStorage.setItem(LS, JSON.stringify(h.slice(-20))); } catch (e) {}
    w.appendChild(ui.bouton("ie-p", "Retour au parcours TOEIC", accueil));
  }
  window.DiisooToeic = { ouvrir: ouvrir };
  function brancher() {
    var h = document.getElementById("xh-hub"); if (!h || h.getAttribute("data-tc")) return;
    var tuile = null;
    Array.prototype.forEach.call(h.querySelectorAll(".xh-g button"), function (t) { if (!tuile && /TOEIC/.test(t.textContent)) tuile = t; });
    if (!tuile) return; h.setAttribute("data-tc", "1");
    tuile.addEventListener("click", function (ev) { ev.stopImmediatePropagation(); ev.preventDefault(); ouvrir(); }, true);
  }
  try { new MutationObserver(brancher).observe(document.documentElement, { childList: true, subtree: true }); brancher(); } catch (e) {}
  try { if (new URLSearchParams(location.search).get("toeic") === "1") setTimeout(ouvrir, 1000); } catch (e) {}
})();
