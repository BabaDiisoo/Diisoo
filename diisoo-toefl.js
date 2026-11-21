/* Diisoo · TOEFL iBT (format 2026) : Reading, Listening, Writing, Speaking + examen blanc chronométré.
   Contenu original (aucune question officielle copiée). Les résultats sont des estimations, pas un score ETS. */
(function () {
  "use strict";
  var LS = "diisoo_toefl_blancs", DATA = null, T = null, ui = null, minuteur = null;
  function U() { return (window.DiisooIelts && window.DiisooIelts.ui) || null; }
  function el(t, c, h) { return ui.el(t, c, h); }
  function arreterVoix() { try { window.Diisoo.voix.arreter(); } catch (e) {} }
  function stopT() { if (minuteur) { clearInterval(minuteur); minuteur = null; } }
  function mel(a) { var b = a.slice(), i, j, x; for (i = b.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); x = b[i]; b[i] = b[j]; b[j] = x; } return b; }
  function hist() { try { return JSON.parse(localStorage.getItem(LS) || "[]") || []; } catch (e) { return []; } }
  function charger() {
    if (DATA) return Promise.resolve(DATA);
    return fetch("toefl-data.json").then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) { DATA = d; return d; });
  }
  function nbMots(s) { var m = String(s || "").trim().match(/\S+/g); return m ? m.length : 0; }
  function mmss(s) { s = Math.max(0, s); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function niveau(p) { return p >= 80 ? "C1" : p >= 62 ? "B2" : p >= 42 ? "B1" : p >= 25 ? "A2" : "A1"; }

  var FORMAT = {
    reading: { nom: "Reading", min: 30, items: 50, taches: ["Complete the Words", "Read in Daily Life", "Read an Academic Passage"] },
    listening: { nom: "Listening", min: 29, items: 47, taches: ["Listen and Choose a Response", "Listen to a Conversation", "Listen to an Announcement", "Listen to an Academic Talk"] },
    writing: { nom: "Writing", min: 23, items: 12, taches: ["Build a Sentence", "Write an Email", "Write for an Academic Discussion"] },
    speaking: { nom: "Speaking", min: 8, items: 11, taches: ["Listen and Repeat", "Take an Interview"] }
  };

  /* ---------- séries d'items ---------- */
  function serie(nom, d) {
    var L = [], i;
    function pass(a, kind) { a.forEach(function (x) { L.push({ kind: "mcq", tache: kind, titre: x.titre, texte: x.texte, audio: x.t, qs: x.q }); }); }
    if (nom === "ctw") d.ctw.forEach(function (x) { L.push({ kind: "ctw", tache: "Complete the Words", titre: x.titre, texte: x.texte }); });
    if (nom === "rdl") pass(d.rdl, "Read in Daily Life");
    if (nom === "ap") pass(d.ap, "Read an Academic Passage");
    if (nom === "lcr") mel(d.lcr).forEach(function (x) { L.push({ kind: "mcq", tache: "Listen and Choose a Response", audio: x.t, qs: [{ p: "Choose the best response.", o: x.o, b: x.b }] }); });
    if (nom === "conv") pass(d.conv, "Listen to a Conversation");
    if (nom === "ann") pass(d.ann, "Listen to an Announcement");
    if (nom === "talk") pass(d.talk, "Listen to an Academic Talk");
    if (nom === "bas") d.bas.forEach(function (x) { L.push({ kind: "bas", tache: "Build a Sentence", x: x }); });
    if (nom === "email") d.email.forEach(function (x) { L.push({ kind: "email", tache: "Write an Email", x: x }); });
    if (nom === "disc") d.disc.forEach(function (x) { L.push({ kind: "disc", tache: "Write for an Academic Discussion", x: x }); });
    return L;
  }
  function section(nom, d) {
    if (nom === "reading") return [].concat(serie("ctw", d), serie("rdl", d), serie("ap", d));
    if (nom === "listening") return [].concat(serie("lcr", d), serie("conv", d), serie("ann", d), serie("talk", d));
    return [].concat(serie("bas", d).slice(0, 5), serie("email", d).slice(0, 1), serie("disc", d).slice(0, 1));
  }

  /* ---------- exécuteur ---------- */
  function lancer(titre, items, opt, fin) {
    var k = 0, R = { ok: 0, tot: 0, ecr: [] }, fini = false, restant = opt.minutes ? opt.minutes * 60 : 0, chrono = null;
    stopT();
    function terminer(force) {
      if (fini) return; fini = true; stopT(); arreterVoix(); fin(R, !!force);
    }
    function barre() {
      var b = el("div", "ie-bar"); b.innerHTML = '<i style="width:' + Math.round(k / items.length * 100) + '%"></i>'; ui.racine().appendChild(b);
    }
    function entetePage() {
      ui.vider();
      ui.entete(titre, function () {
        if (opt.examen && !confirm("Quitter l'examen blanc ? Ta progression sera perdue.")) return;
        stopT(); arreterVoix(); opt.retour();
      });
      if (opt.minutes) { chrono = el("div", "ie-warn", "⏱ Temps restant : <b>" + mmss(restant) + "</b>"); ui.racine().appendChild(chrono); }
      barre(); ui.racine().appendChild(el("p", "ie-note", items[k].tache + " · " + (k + 1) + " / " + items.length));
    }
    function suivant() { k++; if (k >= items.length) terminer(false); else page(); }
    function page() {
      entetePage(); var it = items[k];
      if (it.kind === "mcq") pMcq(it); else if (it.kind === "ctw") pCtw(it); else if (it.kind === "bas") pBas(it); else pEcrit(it);
    }
    function btnSuite(fn) { var b = ui.bouton("ie-p", k + 1 >= items.length ? "Terminer" : "Suivant →", fn); ui.racine().appendChild(b); }
    function pMcq(it) {
      var w = ui.racine(), ecoutes = 0, rep = [], lu = false;
      if (it.scene) { var sc = el("div", "ie-ctx", it.scene); sc.style.cssText = "font-size:64px;text-align:center;line-height:1.2"; w.appendChild(sc); }
      if (it.texte && !it.audio) w.appendChild(el("div", "ie-ctx", ui.esc(it.texte).replace(/\n/g, "<br>")));
      if (it.audio) {
        var bp = ui.bouton("ie-p", "🔊 Écouter", function () {
          if (opt.examen && ecoutes >= 1) return;
          ecoutes++; lu = true; bp.disabled = true;
          try { window.Diisoo.voix.debloquer(); Promise.resolve(window.Diisoo.voix.jouer(it.audio, "en", {})).then(function () { bp.disabled = !!opt.examen; bp.textContent = opt.examen ? "Écoute terminée" : "🔊 Réécouter"; }, function () { bp.disabled = false; }); } catch (e) { bp.disabled = false; }
        });
        w.appendChild(bp);
        w.appendChild(el("p", "ie-note", opt.examen ? "Une seule écoute, comme à l'examen." : "En entraînement, tu peux réécouter. Le texte est montré après la correction."));
      }
      it.qs.forEach(function (q, qi) {
        var box = el("div"); box.style.cssText = "display:flex;flex-direction:column;gap:8px;margin-top:6px";
        box.appendChild(el("p", "", "<b>" + ui.esc(q.p) + "</b>"));
        q.o.forEach(function (o, oi) {
          var b = ui.bouton("", ui.esc(o), function () {
            if (b.parentNode.getAttribute("data-f")) return;
            rep[qi] = oi; Array.prototype.forEach.call(box.querySelectorAll("button"), function (x) { x.classList.remove("ie-sel"); }); b.classList.add("ie-sel");
          });
          b.setAttribute("data-o", oi); box.appendChild(b);
        });
        w.appendChild(box);
      });
      var go = ui.bouton("ie-p", opt.examen ? (k + 1 >= items.length ? "Terminer" : "Suivant →") : "Corriger", function () {
        it.qs.forEach(function (q, qi) { R.tot++; if (rep[qi] === q.b) R.ok++; });
        if (opt.examen) { arreterVoix(); return suivant(); }
        arreterVoix(); go.remove();
        var boxes = w.querySelectorAll("div[style]");
        it.qs.forEach(function (q, qi) {
          var box = boxes[boxes.length - it.qs.length + qi]; box.setAttribute("data-f", 1);
          Array.prototype.forEach.call(box.querySelectorAll("button"), function (b) {
            var oi = +b.getAttribute("data-o"); b.classList.remove("ie-sel");
            if (oi === q.b) { b.classList.add("ie-sel"); b.innerHTML = "✓ " + b.innerHTML; } else if (oi === rep[qi]) { b.innerHTML = "✗ " + b.innerHTML; b.style.borderColor = "#F0906B"; }
          });
        });
        if (it.audio) w.appendChild(el("div", "ie-ctx", "<b>Texte :</b> " + ui.esc(it.audio)));
        btnSuite(suivant);
      });
      w.appendChild(go);
    }
    function pCtw(it) {
      var w = ui.racine(), champs = [];
      w.appendChild(el("p", "", "Complète chaque mot : les premières lettres sont données, écris la fin."));
      var box = el("div", "ie-ctx"); box.style.lineHeight = "2.3";
      it.texte.split(/(\[\[[^\]]+\]\])/).forEach(function (part) {
        var m = part.match(/^\[\[([^\]]+)\]\]$/);
        if (!m) { box.appendChild(document.createTextNode(part)); return; }
        var mot = m[1], cut = Math.ceil(mot.length / 2), pre = mot.slice(0, cut), reste = mot.slice(cut);
        var sp = el("span"); sp.style.whiteSpace = "nowrap"; sp.appendChild(document.createTextNode(pre));
        var inp = document.createElement("input"); inp.type = "text"; inp.size = Math.max(2, reste.length); inp.maxLength = reste.length + 2;
        inp.autocapitalize = "off"; inp.autocomplete = "off"; inp.spellcheck = false;
        inp.style.cssText = "background:#0B0F1C;color:#F6F1E7;border:0;border-bottom:2px solid #E1693F;font:inherit;width:" + (reste.length + 1) + "ch;text-align:left;padding:0 2px";
        sp.appendChild(inp); box.appendChild(sp); champs.push({ inp: inp, reste: reste, mot: mot });
      });
      w.appendChild(box);
      var go = ui.bouton("ie-p", opt.examen ? (k + 1 >= items.length ? "Terminer" : "Suivant →") : "Corriger", function () {
        champs.forEach(function (c) { R.tot++; var ok = c.inp.value.trim().toLowerCase() === c.reste; if (ok) R.ok++; c._ok = ok; });
        if (opt.examen) return suivant();
        go.remove();
        champs.forEach(function (c) { c.inp.disabled = true; c.inp.style.borderBottomColor = c._ok ? "#5FC98F" : "#F0906B"; if (!c._ok) c.inp.value = c.reste; c.inp.style.color = c._ok ? "#5FC98F" : "#F0906B"; });
        btnSuite(suivant);
      });
      w.appendChild(go);
    }
    function pBas(it) {
      var w = ui.racine(), x = it.x, mots = x.rep.split(" "), choix = [], banque = mel(mots.map(function (m, i) { return { m: m, i: i }; }));
      w.appendChild(el("p", "", "Remets les mots dans l'ordre pour répondre."));
      w.appendChild(el("div", "ie-ctx", "<b>" + ui.esc(x.ctx) + "</b>"));
      var zone = el("div", "ie-ctx"); zone.style.minHeight = "52px"; w.appendChild(zone);
      var bq = el("div"); bq.style.cssText = "display:flex;flex-wrap:wrap;gap:8px"; w.appendChild(bq);
      function dessiner() {
        zone.innerHTML = choix.length ? ui.esc(choix.map(function (c) { return c.m; }).join(" ")) : '<span style="opacity:.5">Touche les mots…</span>';
        bq.innerHTML = "";
        banque.forEach(function (c) {
          if (choix.indexOf(c) >= 0) return;
          var b = ui.bouton("", ui.esc(c.m), function () { choix.push(c); dessiner(); }); b.style.minHeight = "40px"; b.style.padding = "8px 12px"; bq.appendChild(b);
        });
      }
      dessiner();
      var ann = ui.bouton("ie-x", "↩ Effacer le dernier", function () { choix.pop(); dessiner(); }); w.appendChild(ann);
      var go = ui.bouton("ie-p", opt.examen ? (k + 1 >= items.length ? "Terminer" : "Suivant →") : "Corriger", function () {
        var ok = choix.map(function (c) { return c.m; }).join(" ").toLowerCase() === x.rep.toLowerCase(); R.tot++; if (ok) R.ok++;
        if (opt.examen) return suivant();
        go.remove(); ann.remove(); bq.remove();
        w.appendChild(el("div", "ie-ctx " + (ok ? "ie-ok" : "ie-ko"), (ok ? "✓ Correct" : "✗ Réponse attendue :") + "<br>" + ui.esc(x.rep)));
        btnSuite(suivant);
      });
      w.appendChild(go);
    }
    function pEcrit(it) {
      var w = ui.racine(), x = it.x, email = it.kind === "email", cle = "diisoo_toefl_br_" + it.kind + "_" + k;
      w.appendChild(el("p", "", email ? "Write an email. Temps conseillé : 7 minutes · 80 mots ou plus." : "Write for an academic discussion. Temps conseillé : 10 minutes · 100 mots ou plus."));
      if (email) { w.appendChild(el("div", "ie-ctx", ui.esc(x.s))); w.appendChild(el("div", "ie-note", "À inclure : " + x.pts.map(ui.esc).join(" · "))); }
      else w.appendChild(el("div", "ie-ctx", "<b>" + ui.esc(x.prof) + "</b><br><br>" + ui.esc(x.a) + "<br><br>" + ui.esc(x.b)));
      var ta = document.createElement("textarea"); ta.rows = 9; ta.placeholder = "Write here…";
      ta.style.cssText = "width:100%;box-sizing:border-box;background:#141A2B;color:#F6F1E7;border:1px solid #1E2740;border-radius:14px;padding:12px;font:inherit;font-size:15px";
      var cp = el("div", "ie-note", "0 mot"); ta.oninput = function () { cp.textContent = nbMots(ta.value) + " mots"; };
      w.appendChild(ta); w.appendChild(cp);
      var go = ui.bouton("ie-p", opt.examen ? (k + 1 >= items.length ? "Terminer" : "Suivant →") : "Vérifier mon texte", function () {
        var t = ta.value, n = nbMots(t), min = email ? 80 : 100, v = [];
        var ver = [["Longueur suffisante (" + min + "+ mots)", n >= min]];
        if (email) { ver.push(["Formule d'appel (Dear…)", /\b(dear|hello|hi)\b/i.test(t)]); ver.push(["Formule de fin (Sincerely, Best regards…)", /(sincerely|regards|thank you|thanks|yours)/i.test(t)]); ver.push(["Demande claire (please / could / would)", /\b(please|could you|would you|i would like|i am writing)\b/i.test(t)]); }
        else { ver.push(["Opinion claire (I think / I believe / In my opinion)", /\b(i think|i believe|in my opinion|i agree|i disagree|i would argue)\b/i.test(t)]); ver.push(["Raison ou exemple (because / for example)", /\b(because|for example|for instance|since)\b/i.test(t)]); ver.push(["Lien avec un autre étudiant (Anna / Tom… said)", /\b(however|also|agree with|disagree with|unlike|as .* said|mentioned)\b/i.test(t)]); }
        var sc = ver.filter(function (z) { return z[1]; }).length; R.ecr.push({ n: n, sc: sc, tot: ver.length });
        if (opt.examen) return suivant();
        go.remove(); ta.disabled = true;
        w.appendChild(el("div", "ie-ctx", "<b>Contrôle automatique</b> (pas une note officielle)<br>" + ver.map(function (z) { return (z[1] ? '<span class="ie-ok">✓</span> ' : '<span class="ie-ko">✗</span> ') + ui.esc(z[0]); }).join("<br>")));
        w.appendChild(el("p", "ie-note", "Relis ton texte : grammaire, précision, organisation. Un enseignant peut le corriger avec toi."));
        btnSuite(suivant);
      });
      w.appendChild(go);
    }
    if (opt.minutes) {
      minuteur = setInterval(function () {
        restant--; if (chrono && chrono.parentNode) chrono.innerHTML = "⏱ Temps restant : <b>" + mmss(restant) + "</b>";
        if (restant <= 0) { terminer(true); }
      }, 1000);
    }
    page();
  }

  /* ---------- écrans ---------- */
  var CSSX = "#ie-ov textarea:focus,#ie-ov input:focus{outline:2px solid #E1693F}";
  function ouvrir() {
    var I = window.DiisooIelts; ui = U(); if (!I || !ui) { return; }
    I.ouvrir(); /* crée l'overlay */ 
    if (!document.getElementById("tf-style")) { var s = document.createElement("style"); s.id = "tf-style"; s.textContent = CSSX; document.head.appendChild(s); }
    accueil();
  }
  function retourIelts() { try { window.DiisooIelts.ui.accueil(); } catch (e) {} }
  function accueil() {
    stopT(); arreterVoix(); ui.vider(); ui.entete("TOEFL iBT : ton parcours", function () { window.DiisooIelts.fermer(); });
    var w = ui.racine(), h = hist();
    w.appendChild(el("p", "", "Le TOEFL iBT mesure ton anglais académique pour étudier à l'étranger. Suis les 3 étapes."));
    w.appendChild(el("p", "ie-n", "Étape 1 · Comprendre le test"));
    w.appendChild(ui.bouton("ie-p", "Voir le format officiel 2026", formatEcran));
    w.appendChild(el("p", "ie-n", "Étape 2 · S'entraîner par partie"));
    [["📖 Reading", "reading"], ["🎧 Listening", "listening"], ["✍️ Writing", "writing"]].forEach(function (c) {
      w.appendChild(ui.bouton("", '<span class="ie-n">' + c[0] + '</span><div class="ie-s">' + FORMAT[c[1]].taches.join(" · ") + "</div>", function () { menuSection(c[1]); }));
    });
    w.appendChild(ui.bouton("", '<span class="ie-n">🎤 Speaking</span><div class="ie-s">Listen and Repeat · Take an Interview (avec analyse de ta voix)</div>', function () { window.DiisooIelts.fermer(); try { window.DiisooExams2.ouvrir("toefl"); } catch (e) {} }));
    w.appendChild(el("p", "ie-n", "Étape 3 · Te tester"));
    w.appendChild(ui.bouton("", '<span class="ie-n">⏱ Examen blanc</span><div class="ie-s">Reading 30 min · Listening 29 min · Writing 23 min · une seule écoute</div>', menuBlanc));
    if (h.length) {
      var d = h[h.length - 1]; w.appendChild(el("div", "ie-note", "Dernier examen blanc : " + ui.esc(d.t) + " · " + (d.p != null ? d.p + " % · niveau estimé " + niveau(d.p) : "terminé")));
    }
    w.appendChild(ui.bouton("ie-x", "← Tous les examens", function () { retourIelts(); }));
  }
  function formatEcran() {
    ui.vider(); ui.entete("Format TOEFL iBT 2026", accueil); var w = ui.racine();
    w.appendChild(el("p", "", "Test passé sur ordinateur, environ 2 heures. Reading et Listening s'adaptent à ton niveau pendant le test. Score sur une échelle de 1 à 6 (par partie et global)."));
    Object.keys(FORMAT).forEach(function (k) {
      var f = FORMAT[k];
      w.appendChild(el("div", "ie-ctx", "<b>" + f.nom + "</b> · " + f.items + " questions · " + f.min + " min<br>" + f.taches.map(function (t) { return "• " + t; }).join("<br>")));
    });
    w.appendChild(el("div", "ie-note", "Source : ETS (toefl.org). Les durées et nombres peuvent évoluer : vérifie toujours sur le site officiel avant de t'inscrire. Diisoo propose un entraînement avec des questions originales et des estimations, pas un score ETS."));
    w.appendChild(ui.bouton("ie-p", "Commencer l'entraînement", accueil));
  }
  var LISTE = {
    reading: [["Complete the Words", "ctw"], ["Read in Daily Life", "rdl"], ["Read an Academic Passage", "ap"]],
    listening: [["Listen and Choose a Response", "lcr"], ["Listen to a Conversation", "conv"], ["Listen to an Announcement", "ann"], ["Listen to an Academic Talk", "talk"]],
    writing: [["Build a Sentence", "bas"], ["Write an Email", "email"], ["Write for an Academic Discussion", "disc"]]
  };
  function menuSection(k) {
    ui.vider(); ui.entete("TOEFL · " + FORMAT[k].nom, accueil); var w = ui.racine();
    w.appendChild(el("p", "", "Choisis une tâche. Pas de chrono : prends ton temps pour apprendre."));
    LISTE[k].forEach(function (c) {
      w.appendChild(ui.bouton("", '<span class="ie-n">' + c[0] + "</span>", function () {
        charger().then(function (d) {
          var items = serie(c[1], d);
          lancer(c[0], items, { retour: function () { menuSection(k); } }, function (R) { fin(c[0], R, function () { menuSection(k); }); });
        }, function () { ui.racine().appendChild(el("div", "ie-warn", "Contenu indisponible. Vérifie ta connexion.")); });
      }));
    });
  }
  function fin(nom, R, retour) {
    ui.vider(); ui.entete("Résultat", retour); var w = ui.racine();
    if (R.tot) { var p = Math.round(R.ok / R.tot * 100); w.appendChild(el("h2", "", R.ok + " / " + R.tot + " · " + p + " %")); w.appendChild(el("p", "", p >= 70 ? "Très bien. Passe à la tâche suivante." : "Refais cette tâche et lis bien les corrections.")); }
    else w.appendChild(el("p", "", "Terminé. Relis tes textes."));
    w.appendChild(ui.bouton("ie-p", "Continuer", retour));
  }
  function menuBlanc() {
    ui.vider(); ui.entete("Examen blanc TOEFL", accueil); var w = ui.racine();
    w.appendChild(el("div", "ie-warn", "Conditions réelles : chaque partie est chronométrée et se termine toute seule. Les audios ne se jouent qu'une fois. Pas de pause. Résultat = estimation."));
    [["Examen complet (Reading + Listening + Writing)", ["reading", "listening", "writing"]], ["Reading seul · 30 min", ["reading"]], ["Listening seul · 29 min", ["listening"]], ["Writing seul · 23 min", ["writing"]]].forEach(function (c) {
      w.appendChild(ui.bouton("", '<span class="ie-n">' + c[0] + "</span>", function () { demarrerBlanc(c[0], c[1]); }));
    });
  }
  function demarrerBlanc(titre, parts) {
    charger().then(function (d) {
      var res = { reading: null, listening: null, writing: null }, i = 0;
      function suite() {
        if (i >= parts.length) return bilan(titre, res);
        var p = parts[i++];
        lancer("TOEFL · " + FORMAT[p].nom, section(p, d), { examen: true, minutes: FORMAT[p].min, retour: menuBlanc }, function (R, force) {
          res[p] = R;
          if (i < parts.length) { ui.vider(); ui.entete("Partie suivante", function () {}); ui.racine().appendChild(el("p", "", (force ? "Temps écoulé. " : "") + "Partie " + FORMAT[p].nom + " terminée. Respire, la suite arrive.")); ui.racine().appendChild(ui.bouton("ie-p", "Continuer", suite)); }
          else suite();
        });
      }
      suite();
    }, function () { ui.racine().appendChild(el("div", "ie-warn", "Contenu indisponible. Vérifie ta connexion.")); });
  }
  function bilan(titre, res) {
    ui.vider(); ui.entete("Bilan de l'examen blanc", accueil); var w = ui.racine(), ps = [], tot = 0, ok = 0;
    ["reading", "listening", "writing"].forEach(function (k) {
      var R = res[k]; if (!R) return;
      var o = R.ok, t = R.tot;
      if (k === "writing" && R.ecr.length) R.ecr.forEach(function (e) { o += e.sc; t += e.tot; });
      var p = t ? Math.round(o / t * 100) : 0; ps.push(p); tot += t; ok += o;
      w.appendChild(el("div", "ie-row", "<b>" + FORMAT[k].nom + "</b><span>" + o + " / " + t + " · " + p + " % · niveau estimé " + niveau(p) + "</span>"));
    });
    var g = tot ? Math.round(ok / tot * 100) : 0;
    w.appendChild(el("h2", "", "Estimation globale : niveau " + niveau(g)));
    w.appendChild(el("div", "ie-note", "Estimation Diisoo à partir de questions d'entraînement. Ce n'est pas un score TOEFL officiel. Le Writing libre est vérifié automatiquement (longueur, structure), pas noté par un examinateur. Le Speaking s'entraîne à part."));
    var h = hist(); h.push({ t: titre, p: g, d: Date.now() }); try { localStorage.setItem(LS, JSON.stringify(h.slice(-20))); } catch (e) {}
    w.appendChild(ui.bouton("ie-p", "Retour au parcours TOEFL", accueil));
  }
  T = { ouvrir: ouvrir, lancer: lancer, init: function () { ui = U(); }, mel: mel, mmss: mmss, niveau: niveau, nbMots: nbMots }; window.DiisooToefl = T;

  /* ---------- tuile TOEFL du hub Examens ---------- */
  function brancher() {
    var h = document.getElementById("xh-hub"); if (!h || h.getAttribute("data-tf")) return;
    var tuile = null;
    Array.prototype.forEach.call(h.querySelectorAll(".xh-g button"), function (t) { if (!tuile && /TOEFL/.test(t.textContent)) tuile = t; });
    if (!tuile) return; h.setAttribute("data-tf", "1");
    tuile.addEventListener("click", function (ev) { ev.stopImmediatePropagation(); ev.preventDefault(); ouvrir(); }, true);
  }
  try { new MutationObserver(brancher).observe(document.documentElement, { childList: true, subtree: true }); brancher(); } catch (e) {}
  try { if (new URLSearchParams(location.search).get("toefl") === "1") setTimeout(ouvrir, 900); } catch (e) {}
})();
