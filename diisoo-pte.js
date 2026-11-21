/* Diisoo · PTE Academic : Speaking & Writing, Reading, Listening, examen blanc au format réduit.
   Contenu original. Résultats = estimation de niveau, pas un score Pearson (10-90). */
(function () {
  "use strict";
  var DATA = null, ui = null, K = null, LS = "diisoo_pte_blancs";
  var TYPES = [
    ["swt", "Summarize Written Text", "Résume un texte en une seule phrase", "✍️", "W"],
    ["essay", "Write Essay", "Essai de 200 mots en 20 minutes", "✍️", "W"],
    ["rwfib", "Reading & Writing: Fill in the Blanks", "Choisis le bon mot dans chaque blanc", "📖", "R"],
    ["mmr", "Multiple Choice, Multiple Answers", "Plusieurs bonnes réponses (lecture)", "📖", "R"],
    ["ro", "Re-order Paragraphs", "Remets les phrases dans l'ordre", "📖", "R"],
    ["rfib", "Reading: Fill in the Blanks", "Texte à trous avec banque de mots", "📖", "R"],
    ["sst", "Summarize Spoken Text", "Écoute et résume en 30 mots ou plus", "🎧", "L"],
    ["mml", "Multiple Choice, Multiple Answers", "Plusieurs bonnes réponses (écoute)", "🎧", "L"],
    ["lfib", "Listening: Fill in the Blanks", "Écris les mots entendus", "🎧", "L"],
    ["hcs", "Highlight Correct Summary", "Choisis le meilleur résumé", "🎧", "L"],
    ["mcs", "Multiple Choice, Single Answer", "Une seule bonne réponse (écoute)", "🎧", "L"],
    ["smw", "Select Missing Word", "Trouve le dernier mot de l'audio", "🎧", "L"],
    ["hiw", "Highlight Incorrect Words", "Repère les mots différents de l'audio", "🎧", "L"],
    ["wfd", "Write from Dictation", "Écris exactement la phrase entendue", "🎧", "L"]
  ];
  function el(t, c, h) { return ui.el(t, c, h); }
  function charger() { if (DATA) return Promise.resolve(DATA); return fetch("pte-data.json").then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) { DATA = d; return d; }); }
  function mots(s) { return String(s).toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean); }
  function lcs(a, b) { var t = [], i, j; for (i = 0; i <= a.length; i++) { t[i] = []; for (j = 0; j <= b.length; j++) t[i][j] = 0; } for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) t[i][j] = a[i - 1] === b[j - 1] ? t[i - 1][j - 1] + 1 : Math.max(t[i - 1][j], t[i][j - 1]); return t[a.length][b.length]; }
  function son(txt, btn, examen, et) {
    if (examen && et.n >= 1) return; et.n++; btn.disabled = true;
    try { window.Diisoo.voix.debloquer(); Promise.resolve(window.Diisoo.voix.jouer(txt, "en", {})).then(function () { btn.disabled = !!examen; btn.textContent = examen ? "Écoute terminée" : "🔊 Réécouter"; }, function () { btn.disabled = false; }); } catch (e) { btn.disabled = false; }
  }
  function sty(ta) { ta.style.cssText = "width:100%;box-sizing:border-box;background:#141A2B;color:#F6F1E7;border:1px solid #1E2740;border-radius:14px;padding:12px;font:inherit;font-size:15px"; }
  function fin(c, label, fn) { var go = ui.bouton("ie-p", c.opt.examen ? (c.last ? "Terminer" : "Suivant →") : label, fn); c.w.appendChild(go); return go; }

  function itemMulti(x, nom, audio) {
    return { kind: "custom", tache: nom, render: function (c) {
      var w = c.w, sel = {}, et = { n: 0 };
      if (audio) { var bp = ui.bouton("ie-p", "🔊 Écouter", function () { son(x.t, bp, c.opt.examen, et); }); w.appendChild(bp); } else w.appendChild(el("div", "ie-ctx", ui.esc(x.texte)));
      w.appendChild(el("p", "", "<b>" + ui.esc(x.p) + "</b> (plusieurs réponses : une mauvaise réponse retire un point)"));
      var bs = x.o.map(function (o, i) { var b = ui.bouton("", ui.esc(o), function () { if (w.getAttribute("data-f")) return; sel[i] = !sel[i]; b.classList.toggle("ie-sel", !!sel[i]); }); w.appendChild(b); return b; });
      var go = fin(c, "Corriger", function () {
        var pts = 0; Object.keys(sel).forEach(function (i) { if (sel[i]) pts += x.b.indexOf(+i) >= 0 ? 1 : -1; }); pts = Math.max(0, pts);
        c.R.tot += x.b.length; c.R.ok += pts; c.arreterVoix();
        if (c.opt.examen) return c.suivant();
        go.remove(); w.setAttribute("data-f", 1);
        bs.forEach(function (b, i) { if (x.b.indexOf(i) >= 0) { b.classList.add("ie-sel"); b.innerHTML = "✓ " + b.innerHTML; } else if (sel[i]) b.style.borderColor = "#F0906B"; });
        if (audio) w.appendChild(el("div", "ie-ctx", "<b>Texte :</b> " + ui.esc(x.t)));
        c.btnSuite(c.suivant);
      });
    } };
  }
  function itemOrdre(x, nom) {
    return { kind: "custom", tache: nom, render: function (c) {
      var w = c.w, ch = [], bq = x.s.map(function (t, i) { return { t: t, i: i }; }).sort(function () { return Math.random() - .5; });
      w.appendChild(el("p", "", "Touche les phrases dans le bon ordre."));
      var zone = el("div", "ie-ctx"); zone.style.minHeight = "52px"; w.appendChild(zone);
      var box = el("div"); box.style.cssText = "display:flex;flex-direction:column;gap:8px"; w.appendChild(box);
      function dessiner() {
        zone.innerHTML = ch.length ? ch.map(function (o, n) { return (n + 1) + ". " + ui.esc(o.t); }).join("<br>") : '<span style="opacity:.5">Ton ordre apparaît ici…</span>';
        box.innerHTML = ""; bq.forEach(function (o) { if (ch.indexOf(o) >= 0) return; box.appendChild(ui.bouton("", ui.esc(o.t), function () { ch.push(o); dessiner(); })); });
      }
      dessiner();
      w.appendChild(ui.bouton("ie-x", "↩ Effacer le dernier", function () { ch.pop(); dessiner(); }));
      var go = fin(c, "Corriger", function () {
        var ord = x.ordre, pos = {}; ord.forEach(function (idx, n) { pos[idx] = n; });
        var paires = 0; for (var n = 0; n + 1 < ch.length; n++) if (pos[ch[n + 1].i] === pos[ch[n].i] + 1) paires++;
        c.R.tot += x.s.length - 1; c.R.ok += paires;
        if (c.opt.examen) return c.suivant();
        go.remove(); box.remove();
        w.appendChild(el("div", "ie-ctx", "<b>Bon ordre :</b><br>" + ord.map(function (idx, n) { return (n + 1) + ". " + ui.esc(x.s[idx]); }).join("<br>")));
        c.btnSuite(c.suivant);
      });
    } };
  }
  function itemHiw(x, nom) {
    return { kind: "custom", tache: nom, render: function (c) {
      var w = c.w, sel = {}, et = { n: 0 };
      var bp = ui.bouton("ie-p", "🔊 Écouter", function () { son(x.audio, bp, c.opt.examen, et); }); w.appendChild(bp);
      w.appendChild(el("p", "", "Touche les mots du texte qui sont différents de l'audio."));
      var z = el("div", "ie-ctx"); z.style.cssText += ";display:flex;flex-wrap:wrap;gap:6px";
      var ws = x.txt.split(" ").map(function (m, i) { var b = ui.bouton("", ui.esc(m), function () { if (w.getAttribute("data-f")) return; sel[i] = !sel[i]; b.classList.toggle("ie-sel", !!sel[i]); }); b.style.cssText = "min-height:36px;padding:4px 8px"; z.appendChild(b); return { m: m.toLowerCase().replace(/[^a-z]/g, ""), b: b, i: i }; });
      w.appendChild(z);
      var go = fin(c, "Corriger", function () {
        var pts = 0; ws.forEach(function (o) { if (sel[o.i]) pts += x.diff.indexOf(o.m) >= 0 ? 1 : -1; }); pts = Math.max(0, pts);
        c.R.tot += x.diff.length; c.R.ok += pts; c.arreterVoix();
        if (c.opt.examen) return c.suivant();
        go.remove(); w.setAttribute("data-f", 1);
        ws.forEach(function (o) { if (x.diff.indexOf(o.m) >= 0) o.b.style.borderColor = "#5FC98F"; });
        w.appendChild(el("div", "ie-ctx", "<b>Audio :</b> " + ui.esc(x.audio)));
        c.btnSuite(c.suivant);
      });
    } };
  }
  function itemDict(p, nom) {
    return { kind: "custom", tache: nom, render: function (c) {
      var w = c.w, et = { n: 0 }, bp = ui.bouton("ie-p", "🔊 Écouter", function () { son(p, bp, c.opt.examen, et); }); w.appendChild(bp);
      w.appendChild(el("p", "ie-note", c.opt.examen ? "Une seule écoute." : "Tu peux réécouter."));
      var ta = document.createElement("textarea"); ta.rows = 3; ta.autocapitalize = "off"; ta.spellcheck = false; sty(ta); w.appendChild(ta);
      var go = fin(c, "Corriger", function () {
        var a = mots(p), n = lcs(a, mots(ta.value)); c.R.tot += a.length; c.R.ok += n; c.arreterVoix();
        if (c.opt.examen) return c.suivant();
        go.remove(); ta.disabled = true;
        w.appendChild(el("div", "ie-ctx " + (n === a.length ? "ie-ok" : "ie-ko"), n + " / " + a.length + " mots corrects<br>Phrase : " + ui.esc(p))); c.btnSuite(c.suivant);
      });
    } };
  }
  function itemSst(x, nom) {
    return { kind: "custom", tache: nom, render: function (c) {
      var w = c.w, et = { n: 0 }, bp = ui.bouton("ie-p", "🔊 Écouter", function () { son(x.t, bp, c.opt.examen, et); }); w.appendChild(bp);
      w.appendChild(el("p", "", "Résume ce que tu entends (" + x.min + " mots ou plus)."));
      var ta = document.createElement("textarea"); ta.rows = 6; sty(ta); w.appendChild(ta); var cp = el("div", "ie-note", "0 mot"); ta.oninput = function () { cp.textContent = K.nbMots(ta.value) + " mots"; }; w.appendChild(cp);
      var go = fin(c, "Vérifier", function () {
        var n = K.nbMots(ta.value), ver = [["Longueur (" + x.min + "+ mots)", n >= x.min], ["Idée principale reprise", x.kw.test ? x.kw.test(ta.value) : true], ["Phrases complètes (majuscule, point)", /[A-Z]/.test(ta.value) && /[.!?]/.test(ta.value)]];
        var sc = ver.filter(function (z) { return z[1]; }).length; c.R.ecr.push({ n: n, sc: sc, tot: ver.length }); c.arreterVoix();
        if (c.opt.examen) return c.suivant();
        go.remove(); ta.disabled = true;
        w.appendChild(el("div", "ie-ctx", "<b>Contrôle automatique</b> (pas une note officielle)<br>" + ver.map(function (z) { return (z[1] ? '<span class="ie-ok">✓</span> ' : '<span class="ie-ko">✗</span> ') + ui.esc(z[0]); }).join("<br>")));
        w.appendChild(el("div", "ie-ctx", "<b>Texte :</b> " + ui.esc(x.t))); c.btnSuite(c.suivant);
      });
    } };
  }
  function rx(s) { var m = typeof s === "string" && s.match(/^\/(.*)\/([a-z]*)$/); return m ? new RegExp(m[1], m[2]) : null; }
  function libres(arr, nom, swt) {
    return arr.map(function (x) {
      var y = JSON.parse(JSON.stringify(x)); y.kw = rx(y.kw);
      if (swt) y.s = "Summarize the passage in ONE sentence (5 to 75 words).\n\n" + x.texte;
      return { kind: "libre", tache: nom, x: y };
    });
  }
  function items(k, d, nom) {
    if (k === "swt") { var a = libres(d.swt, nom, true); a[0].x.min = 15; a[0].x.tps = 10; return a; }
    if (k === "essay") return libres(d.essay, nom);
    if (k === "rwfib" || k === "rfib") return d[k].map(function (x) { return { kind: "mcq", tache: nom, texte: x.texte, qs: x.q }; });
    if (k === "mmr") return d.mmr.map(function (x) { return itemMulti(x, nom, false); });
    if (k === "ro") return d.ro.map(function (x) { return itemOrdre(x, nom); });
    if (k === "sst") return d.sst.map(function (x) { x.kw = rx(x.kw) || { test: function () { return true; } }; return itemSst(x, nom); });
    if (k === "mml") return d.mml.map(function (x) { return itemMulti(x, nom, true); });
    if (k === "lfib") return d.lfib.map(function (x) { return { kind: "ctw", complet: true, tache: nom, texte: x.texte, audio: x.t }; });
    if (k === "hcs" || k === "mcs" || k === "smw") return d[k].map(function (x) { return { kind: "mcq", tache: nom, audio: x.t, qs: x.q }; });
    if (k === "hiw") return d.hiw.map(function (x) { return itemHiw(x, nom); });
    if (k === "wfd") return d.wfd.map(function (p) { return itemDict(p, nom); });
    return [];
  }
  function hist() { try { return JSON.parse(localStorage.getItem(LS) || "[]") || []; } catch (e) { return []; } }
  function ouvrir() { var I = window.DiisooIelts, T = window.DiisooToefl; if (!I || !T) return; I.ouvrir(); T.init(); ui = I.ui; K = T; accueil(); }
  function accueil() {
    ui.vider(); ui.entete("PTE Academic : ton parcours", function () { window.DiisooIelts.fermer(); });
    var w = ui.racine(), h = hist();
    w.appendChild(el("p", "", "Test sur ordinateur, environ 2 heures, noté par ordinateur. Suis les 3 étapes."));
    w.appendChild(el("p", "ie-n", "Étape 1 · Comprendre le test"));
    w.appendChild(ui.bouton("ie-p", "Voir le format officiel", format));
    w.appendChild(el("p", "ie-n", "Étape 2 · S'entraîner par type de question"));
    [["W", "✍️ Writing"], ["R", "📖 Reading"], ["L", "🎧 Listening"]].forEach(function (g) {
      w.appendChild(el("p", "ie-note", g[1]));
      TYPES.filter(function (t) { return t[4] === g[0]; }).forEach(function (t) { w.appendChild(ui.bouton("", '<span class="ie-n">' + t[1] + '</span><div class="ie-s">' + t[2] + "</div>", function () { type(t); })); });
    });
    w.appendChild(ui.bouton("", '<span class="ie-n">🎤 Speaking</span><div class="ie-s">Read Aloud, Repeat Sentence, Describe Image, Re-tell Lecture · analyse de ta voix</div>', function () { window.DiisooIelts.fermer(); try { window.DiisooExams2.ouvrir("pte"); } catch (e) {} }));
    w.appendChild(el("p", "ie-n", "Étape 3 · Te tester"));
    w.appendChild(ui.bouton("", '<span class="ie-n">⏱ Examen blanc (format réduit)</span><div class="ie-s">Writing 25 min · Reading 8 min · Listening 12 min · une seule écoute</div>', menuBlanc));
    if (h.length) { var d = h[h.length - 1]; w.appendChild(el("div", "ie-note", "Dernier examen blanc : " + d.p + " % · niveau estimé " + K.niveau(d.p))); }
    w.appendChild(ui.bouton("ie-x", "← Tous les examens", function () { window.DiisooIelts.ui.accueil(); }));
  }
  function format() {
    ui.vider(); ui.entete("Format PTE Academic", accueil); var w = ui.racine();
    w.appendChild(el("div", "ie-ctx", "<b>Durée : environ 2 heures</b>, 3 parties passées à la suite sur ordinateur."));
    w.appendChild(el("div", "ie-ctx", "<b>Speaking & Writing</b><br>Read Aloud · Repeat Sentence · Describe Image · Re-tell Lecture · Answer Short Question · Summarize Written Text · Write Essay. Depuis 2025, deux nouvelles tâches orales : Respond to a Situation et Summarize Group Discussion (22 types au total)."));
    w.appendChild(el("div", "ie-ctx", "<b>Reading</b><br>Reading & Writing Fill in the Blanks · Multiple Choice (multiple et single) · Re-order Paragraphs · Reading Fill in the Blanks"));
    w.appendChild(el("div", "ie-ctx", "<b>Listening</b><br>Summarize Spoken Text · Multiple Choice · Fill in the Blanks · Highlight Correct Summary · Select Missing Word · Highlight Incorrect Words · Write from Dictation"));
    w.appendChild(el("div", "ie-note", "Score de 10 à 90, par ordinateur. Source : pearsonpte.com. Vérifie le format actuel avant de t'inscrire. Diisoo propose des questions originales et une estimation de niveau, pas un score Pearson."));
    w.appendChild(ui.bouton("ie-p", "Commencer l'entraînement", accueil));
  }
  function type(t) {
    charger().then(function (d) {
      K.lancer(t[1], items(t[0], d, t[1]), { retour: accueil }, function (R) {
        ui.vider(); ui.entete("Résultat", accueil); var w = ui.racine(), pc = R.tot ? Math.round(R.ok / R.tot * 100) : 0;
        if (R.tot) { w.appendChild(el("h2", "", R.ok + " / " + R.tot + " · " + pc + " %")); w.appendChild(el("p", "", pc >= 70 ? "Très bien. Passe au type suivant." : "Refais cet exercice et relis les corrections.")); }
        else w.appendChild(el("p", "", "Terminé. Relis ton texte."));
        w.appendChild(ui.bouton("ie-p", "Continuer", accueil));
      });
    }, function () { ui.racine().appendChild(el("div", "ie-warn", "Contenu indisponible. Vérifie ta connexion.")); });
  }
  function menuBlanc() {
    ui.vider(); ui.entete("Examen blanc PTE", accueil); var w = ui.racine();
    w.appendChild(el("div", "ie-warn", "Format réduit avec temps proportionnel. Chaque partie s'arrête toute seule. Un seul audio, pas de pause. Résultat = estimation."));
    [["Complet : Writing + Reading + Listening", ["W", "R", "L"]], ["Writing seul · 25 min", ["W"]], ["Reading seul · 8 min", ["R"]], ["Listening seul · 12 min", ["L"]]].forEach(function (c) { w.appendChild(ui.bouton("", '<span class="ie-n">' + c[0] + "</span>", function () { blanc(c[1]); })); });
  }
  var MIN = { W: 25, R: 8, L: 12 }, NOMS = { W: "Writing", R: "Reading", L: "Listening" };
  function blanc(secs) {
    charger().then(function (d) {
      var res = {}, i = 0;
      function suite() {
        if (i >= secs.length) return bilan(res);
        var s = secs[i++], its = [];
        TYPES.forEach(function (t) { if (t[4] === s) its = its.concat(items(t[0], d, t[1])); });
        its = its.filter(function (it, n) { return s !== "L" || n % 1 === 0; });
        K.lancer("PTE · " + NOMS[s], its, { examen: true, minutes: MIN[s], retour: menuBlanc }, function (R, force) {
          res[s] = R;
          if (i < secs.length) { ui.vider(); ui.entete("Partie suivante", function () {}); ui.racine().appendChild(el("p", "", (force ? "Temps écoulé. " : "") + "Partie terminée. Respire, la suite arrive.")); ui.racine().appendChild(ui.bouton("ie-p", "Continuer", suite)); } else suite();
        });
      }
      suite();
    }, function () { ui.racine().appendChild(el("div", "ie-warn", "Contenu indisponible. Vérifie ta connexion.")); });
  }
  function bilan(res) {
    ui.vider(); ui.entete("Bilan de l'examen blanc", accueil); var w = ui.racine(), ok = 0, tot = 0;
    ["W", "R", "L"].forEach(function (s) {
      var R = res[s]; if (!R) return; var o = R.ok, t = R.tot; (R.ecr || []).forEach(function (e) { o += e.sc; t += e.tot; });
      ok += o; tot += t; var p = t ? Math.round(o / t * 100) : 0;
      w.appendChild(el("div", "ie-row", "<b>" + NOMS[s] + "</b><span>" + o + " / " + t + " · " + p + " % · niveau estimé " + K.niveau(p) + "</span>"));
    });
    var g = tot ? Math.round(ok / tot * 100) : 0;
    w.appendChild(el("h2", "", "Estimation globale : niveau " + K.niveau(g)));
    w.appendChild(el("div", "ie-note", "Estimation Diisoo sur des questions d'entraînement. Ce n'est pas un score PTE (10 à 90). L'écriture est vérifiée automatiquement, pas notée par un examinateur. Le Speaking s'entraîne à part."));
    var h = hist(); h.push({ p: g, d: Date.now() }); try { localStorage.setItem(LS, JSON.stringify(h.slice(-20))); } catch (e) {}
    w.appendChild(ui.bouton("ie-p", "Retour au parcours", accueil));
  }
  window.DiisooPte = { ouvrir: ouvrir };
  function brancher() {
    var h = document.getElementById("xh-hub"); if (!h || h.getAttribute("data-pt")) return; var tuile = null;
    Array.prototype.forEach.call(h.querySelectorAll(".xh-g button"), function (t) { if (!tuile && /PTE/.test(t.textContent)) tuile = t; });
    if (!tuile) return; h.setAttribute("data-pt", "1");
    tuile.addEventListener("click", function (ev) { ev.stopImmediatePropagation(); ev.preventDefault(); ouvrir(); }, true);
  }
  try { new MutationObserver(brancher).observe(document.documentElement, { childList: true, subtree: true }); brancher(); } catch (e) {}
  try { if (new URLSearchParams(location.search).get("pte") === "1") setTimeout(ouvrir, 1000); } catch (e) {}
})();
