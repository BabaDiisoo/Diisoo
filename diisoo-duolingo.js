/* Diisoo · Duolingo English Test : types de questions réels, test blanc adaptatif simplifié (format réduit).
   Contenu original. Résultats = estimation de niveau, pas un score Duolingo (10-160). */
(function () {
  "use strict";
  var DATA = null, ui = null, K = null, LS = "diisoo_det_blancs";
  var TYPES = [
    ["rac", "Read and Complete", "Complète les lettres manquantes d'un paragraphe", "📖"],
    ["sel", "Read and Select", "Choisis les vrais mots anglais", "📖"],
    ["fib", "Fill in the Blanks", "Écris le mot qui manque dans la phrase", "📖"],
    ["ir", "Interactive Reading", "Un texte, 4 questions dont le meilleur titre", "📖"],
    ["dict", "Listen and Type", "Écris exactement ce que tu entends", "🎧"],
    ["il", "Interactive Listening", "Réponds dans une conversation puis résume-la", "🎧"],
    ["wph", "Write About the Photo", "Décris l'image en 1 ou 2 phrases", "✍️"],
    ["iw", "Interactive Writing", "Donne ton opinion en 5 minutes", "✍️"]
  ];
  function el(t, c, h) { return ui.el(t, c, h); }
  function charger() {
    if (DATA) return Promise.resolve(DATA);
    return fetch("duolingo-data.json").then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) { DATA = d; return d; });
  }
  function mots(s) { return String(s).toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean); }
  function lcs(a, b) { var t = [], i, j; for (i = 0; i <= a.length; i++) { t[i] = []; for (j = 0; j <= b.length; j++) t[i][j] = 0; }
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) t[i][j] = a[i - 1] === b[j - 1] ? t[i - 1][j - 1] + 1 : Math.max(t[i - 1][j], t[i][j - 1]); return t[a.length][b.length]; }
  function jouer(txt, btn, examen, etat) {
    if (examen && etat.n >= 1) return; etat.n++; btn.disabled = true;
    try { window.Diisoo.voix.debloquer(); Promise.resolve(window.Diisoo.voix.jouer(txt, "en", {})).then(function () { btn.disabled = !!examen; btn.textContent = examen ? "Écoute terminée" : "🔊 Réécouter"; }, function () { btn.disabled = false; }); } catch (e) { btn.disabled = false; }
  }
  function itemSel(g, nom) {
    return { kind: "custom", tache: nom, render: function (c) {
      var all = g.reel.map(function (m) { return { m: m, r: 1 }; }).concat(g.faux.map(function (m) { return { m: m, r: 0 }; })), sel = {}, w = c.w;
      all.sort(function () { return Math.random() - .5; });
      w.appendChild(el("p", "", "Touche tous les mots qui existent vraiment en anglais."));
      var zone = el("div"); zone.style.cssText = "display:flex;flex-wrap:wrap;gap:8px"; w.appendChild(zone);
      all.forEach(function (x) { var b = ui.bouton("", ui.esc(x.m), function () { if (zone.getAttribute("data-f")) return; sel[x.m] = !sel[x.m]; b.classList.toggle("ie-sel", !!sel[x.m]); }); b.style.minHeight = "40px"; b.style.padding = "8px 12px"; x.b = b; zone.appendChild(b); });
      var go = ui.bouton("ie-p", c.opt.examen ? (c.last ? "Terminer" : "Suivant →") : "Corriger", function () {
        all.forEach(function (x) { c.R.tot++; if (!!sel[x.m] === !!x.r) c.R.ok++; });
        if (c.opt.examen) return c.suivant();
        go.remove(); zone.setAttribute("data-f", 1);
        all.forEach(function (x) { x.b.style.borderColor = x.r ? "#5FC98F" : "#1E2740"; if (x.r) x.b.innerHTML = "✓ " + x.b.innerHTML; if (!x.r && sel[x.m]) x.b.style.borderColor = "#F0906B"; });
        w.appendChild(el("p", "ie-note", "Vert : vrais mots. Les autres sont inventés."));
        c.btnSuite(c.suivant);
      });
      w.appendChild(go);
    } };
  }
  function itemDict(phrase, nom) {
    return { kind: "custom", tache: nom, render: function (c) {
      var w = c.w, et = { n: 0 };
      var bp = ui.bouton("ie-p", "🔊 Écouter", function () { jouer(phrase, bp, c.opt.examen, et); }); w.appendChild(bp);
      w.appendChild(el("p", "ie-note", c.opt.examen ? "Une seule écoute en examen blanc." : "Tu peux réécouter autant de fois que tu veux."));
      var ta = document.createElement("textarea"); ta.rows = 3; ta.placeholder = "Type what you hear…"; ta.autocapitalize = "off"; ta.spellcheck = false;
      ta.style.cssText = "width:100%;box-sizing:border-box;background:#141A2B;color:#F6F1E7;border:1px solid #1E2740;border-radius:14px;padding:12px;font:inherit;font-size:15px"; w.appendChild(ta);
      var go = ui.bouton("ie-p", c.opt.examen ? (c.last ? "Terminer" : "Suivant →") : "Corriger", function () {
        var a = mots(phrase), b = mots(ta.value), n = lcs(a, b); c.R.tot += a.length; c.R.ok += n; c.arreterVoix();
        if (c.opt.examen) return c.suivant();
        go.remove(); ta.disabled = true;
        w.appendChild(el("div", "ie-ctx " + (n === a.length ? "ie-ok" : "ie-ko"), n + " / " + a.length + " mots corrects<br>Phrase : " + ui.esc(phrase)));
        c.btnSuite(c.suivant);
      });
      w.appendChild(go);
    } };
  }
  function rx(s) { var m = typeof s === "string" && s.match(/^\/(.*)\/([a-z]*)$/); return m ? new RegExp(m[1], m[2]) : null; }
  function libres(arr, nom) { return arr.map(function (x) { var y = JSON.parse(JSON.stringify(x)); y.kw = rx(y.kw); return { kind: "libre", tache: nom, x: y }; }); }
  function items(k, d, nom) {
    if (k === "rac") return d.rac.map(function (x) { return { kind: "ctw", tache: nom, titre: x.titre, texte: x.texte }; });
    if (k === "fib") return d.fib.map(function (x) { return { kind: "ctw", tache: nom, titre: x.titre, texte: x.texte }; });
    if (k === "sel") return d.sel.map(function (g) { return itemSel(g, nom); });
    if (k === "dict") return d.dict.map(function (p) { return itemDict(p, nom); });
    if (k === "ir") return d.ir.map(function (x) { return { kind: "mcq", tache: nom, titre: x.titre, texte: x.texte, qs: x.q }; });
    if (k === "il") return d.il.map(function (x) { return { kind: "mcq", tache: nom, audio: x.t, qs: x.q }; }).concat(libres(d.sum, nom));
    if (k === "wph") return libres(d.wph, nom);
    if (k === "iw") return libres(d.iw, nom);
    return [];
  }
  function hist() { try { return JSON.parse(localStorage.getItem(LS) || "[]") || []; } catch (e) { return []; } }
  function ouvrir() { var I = window.DiisooIelts, T = window.DiisooToefl; if (!I || !T) return; I.ouvrir(); T.init(); ui = I.ui; K = T; accueil(); }
  function accueil() {
    ui.vider(); ui.entete("Duolingo English Test : ton parcours", function () { window.DiisooIelts.fermer(); });
    var w = ui.racine(), h = hist();
    w.appendChild(el("p", "", "Test sur ordinateur ou téléphone, environ 1 heure, qui s'adapte à ton niveau. Suis les 3 étapes."));
    w.appendChild(el("p", "ie-n", "Étape 1 · Comprendre le test"));
    w.appendChild(ui.bouton("ie-p", "Voir le format officiel", format));
    w.appendChild(el("p", "ie-n", "Étape 2 · S'entraîner par type de question"));
    TYPES.forEach(function (t) { w.appendChild(ui.bouton("", '<span class="ie-n">' + t[3] + " " + t[1] + '</span><div class="ie-s">' + t[2] + "</div>", function () { type(t); })); });
    w.appendChild(ui.bouton("", '<span class="ie-n">🎤 Speak About the Photo, Read Then Speak</span><div class="ie-s">Entraînement oral avec analyse de ta voix</div>', function () { window.DiisooIelts.fermer(); try { window.DiisooExams2.ouvrir("duolingo"); } catch (e) {} }));
    w.appendChild(el("p", "ie-n", "Étape 3 · Te tester"));
    w.appendChild(ui.bouton("", '<span class="ie-n">⏱ Test blanc (format réduit)</span><div class="ie-s">15 minutes · lecture, écoute, écriture · une seule écoute</div>', blanc));
    if (h.length) { var d = h[h.length - 1]; w.appendChild(el("div", "ie-note", "Dernier test blanc : " + d.p + " % · niveau estimé " + K.niveau(d.p))); }
    w.appendChild(ui.bouton("ie-x", "← Tous les examens", function () { window.DiisooIelts.ui.accueil(); }));
  }
  function format() {
    ui.vider(); ui.entete("Format Duolingo English Test", accueil); var w = ui.racine();
    w.appendChild(el("div", "ie-ctx", "<b>Durée totale : environ 60 minutes</b><br>• Introduction (5 min) : vérification caméra, micro et pièce d'identité<br>• Test adaptatif (45 min) : les questions s'adaptent à tes réponses<br>• Échantillon écrit et oral (10 min), envoyé aux universités"));
    w.appendChild(el("div", "ie-ctx", "<b>Types de questions</b><br>Read and Complete · Read and Select · Fill in the Blanks · Interactive Reading · Listen and Type · Interactive Listening · Interactive Writing · Write About the Photo · Speak About the Photo · Read, Then Write · Read, Then Speak"));
    w.appendChild(el("div", "ie-note", "Score de 10 à 160, avec des sous-scores. Chaque université fixe son minimum. Source : duolingo.com/englishtest. Vérifie le format actuel avant de t'inscrire. Diisoo propose des questions originales et une estimation de niveau, pas un score Duolingo."));
    w.appendChild(ui.bouton("ie-p", "Commencer l'entraînement", accueil));
  }
  function type(t) {
    charger().then(function (d) {
      K.lancer(t[1], items(t[0], d, t[1]), { retour: accueil }, function (R) {
        ui.vider(); ui.entete("Résultat", accueil); var w = ui.racine(), pc = R.tot ? Math.round(R.ok / R.tot * 100) : 0;
        if (R.tot) { w.appendChild(el("h2", "", R.ok + " / " + R.tot + " · " + pc + " %")); w.appendChild(el("p", "", pc >= 70 ? "Très bien. Passe au type suivant." : "Refais cet exercice et relis les corrections.")); }
        else w.appendChild(el("p", "", "Terminé. Relis ton texte et compare avec la consigne."));
        w.appendChild(ui.bouton("ie-p", "Continuer", accueil));
      });
    }, function () { ui.racine().appendChild(el("div", "ie-warn", "Contenu indisponible. Vérifie ta connexion.")); });
  }
  function blanc() {
    charger().then(function (d) {
      var its = [].concat(items("rac", d, "Read and Complete").slice(0, 1), items("sel", d, "Read and Select").slice(0, 2), items("dict", d, "Listen and Type").slice(0, 4),
        items("fib", d, "Fill in the Blanks"), items("ir", d, "Interactive Reading"), items("il", d, "Interactive Listening"), items("wph", d, "Write About the Photo").slice(0, 1), items("iw", d, "Interactive Writing").slice(0, 1));
      K.lancer("Duolingo · test blanc", its, { examen: true, minutes: 15, retour: accueil }, function (R, force) {
        ui.vider(); ui.entete("Bilan du test blanc", accueil); var w = ui.racine(), o = R.ok, t = R.tot;
        (R.ecr || []).forEach(function (e) { o += e.sc; t += e.tot; });
        var g = t ? Math.round(o / t * 100) : 0;
        if (force) w.appendChild(el("p", "", "Temps écoulé."));
        w.appendChild(el("h2", "", "Estimation : niveau " + K.niveau(g) + " · " + g + " %"));
        w.appendChild(el("div", "ie-note", "Estimation Diisoo sur des questions d'entraînement. Ce n'est pas un score Duolingo (10 à 160). L'écriture est vérifiée automatiquement, pas notée par un examinateur."));
        var h = hist(); h.push({ p: g, d: Date.now() }); try { localStorage.setItem(LS, JSON.stringify(h.slice(-20))); } catch (e) {}
        w.appendChild(ui.bouton("ie-p", "Retour au parcours", accueil));
      });
    }, function () { ui.racine().appendChild(el("div", "ie-warn", "Contenu indisponible. Vérifie ta connexion.")); });
  }
  window.DiisooDuolingo = { ouvrir: ouvrir };
  function brancher() {
    var h = document.getElementById("xh-hub"); if (!h || h.getAttribute("data-dl")) return; var tuile = null;
    Array.prototype.forEach.call(h.querySelectorAll(".xh-g button"), function (t) { if (!tuile && /Duolingo/.test(t.textContent)) tuile = t; });
    if (!tuile) return; h.setAttribute("data-dl", "1");
    tuile.addEventListener("click", function (ev) { ev.stopImmediatePropagation(); ev.preventDefault(); ouvrir(); }, true);
  }
  try { new MutationObserver(brancher).observe(document.documentElement, { childList: true, subtree: true }); brancher(); } catch (e) {}
  try { if (new URLSearchParams(location.search).get("duolingo") === "1") setTimeout(ouvrir, 1000); } catch (e) {}
})();
