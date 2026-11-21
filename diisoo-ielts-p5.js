/* diisoo-ielts-p5.js v1 : module IELTS, phase 4 (examens blancs chronométrés)
 * Types : Écoute seule, Lecture seule, Écriture seule, complet (Écoute + Lecture + Écriture), Life Skills A1/A2/B1 (écoute).
 * Règles d'examen (R9) : une seule écoute, chrono par section, envoi automatique à 0, pas de pause, confirmation avant de quitter.
 * R8 : correction côté serveur (ielts_soumettre). R1 : résultats = estimations d'entraînement, aucun band IELTS (la règle de conversion n'est pas fournie).
 * R4/R6 : Life Skills sans note ni réussite/échec. R7 : contenus Diisoo, pas des sujets officiels.
 * Historique gardé sur l'appareil (20 derniers). Prérequis : p1 (+ p4 pour l'écriture). Sans effet sinon.
 */
(function () {
  "use strict";
  function demarrer() {
    var I = window.DiisooIelts;
    if (!I || !I.ui) return false;
    if (I.blanc) return true;
    var U = I.ui, el = U.el, esc = U.esc, bouton = U.bouton;
    var M = null, chrono = null, ecoutes = 0, lecture = false;

    function sb() { return U.sb(); }
    function stop() { if (chrono) { clearInterval(chrono); chrono = null; } }
    function arreterVoix() { try { window.Diisoo.voix.arreter(); } catch (e) {} }
    function fmt(s) { return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
    function histoLire() { try { return JSON.parse(localStorage.getItem("diisoo_ielts_blancs") || "[]") || []; } catch (e) { return []; } }
    function histoAjouter(x) { try { var h = histoLire(); h.push(x); localStorage.setItem("diisoo_ielts_blancs", JSON.stringify(h.slice(-20))); } catch (e) {} }

    var TYPES = [
      ["complet", "Examen blanc complet", "Écoute, Lecture, Écriture", null],
      ["listening", "Écoute seule", "Une seule écoute, chrono", "listening"],
      ["reading", "Lecture seule", "Chrono, envoi automatique", "reading"],
      ["writing", "Écriture seule", "Task 2, 40 minutes", null],
      ["lsk-a1-", "Life Skills A1 : écoute", "Sans note, appréciation d'entraînement", "listening"],
      ["lsk-a2-", "Life Skills A2 : écoute", "Sans note, appréciation d'entraînement", "listening"],
      ["lsk-b1-", "Life Skills B1 : écoute", "Sans note, appréciation d'entraînement", "listening"]
    ];

    function accueil() {
      stop(); arreterVoix(); M = null; U.vider(); U.entete("Examens blancs", U.accueil);
      var w = U.racine();
      w.appendChild(el("p", "", "Conditions d'examen : chrono, une seule écoute, pas de pause. Choisis ta simulation."));
      TYPES.forEach(function (t) {
        w.appendChild(bouton(t[0] === "complet" ? "ie-p" : "", '<div class="ie-n">' + t[1] + '</div><div class="ie-s">' + t[2] + "</div>", function () { lancer(t[0]); }));
      });
      var h = histoLire().slice(-5).reverse();
      if (h.length) {
        w.appendChild(el("h2", "", "Tes dernières simulations"));
        h.forEach(function (x) {
          w.appendChild(el("div", "ie-row", "<span>" + new Date(x.t).toLocaleDateString("fr-FR") + " · " + esc(x.nom) + "</span><span>" + esc(x.res) + "</span>"));
        });
      }
      w.appendChild(el("div", "ie-warn", "Les résultats sont des estimations d'entraînement, pas des notes IELTS. Diisoo ne délivre aucun score officiel."));
      w.appendChild(el("div", "ie-note", "Contenus créés par Diisoo : ce ne sont pas des sujets officiels IELTS."));
    }

    function lancer(type) {
      var c = sb(); if (!c) { U.vider(); U.entete("Examens blancs", accueil); U.racine().appendChild(el("p", "", "Connexion indisponible.")); return; }
      U.vider(); U.entete("Préparation…", accueil); U.racine().appendChild(el("p", "", "Préparation de l'examen…"));
      var lsk = type.indexOf("lsk-") === 0;
      c.rpc("ielts_liste_exercices", { p_skill: null }).then(function (r) {
        var L = (r.data || []).filter(function (x) { return lsk ? x.code.indexOf(type) === 0 : x.code.indexOf("lsk-") !== 0; });
        var steps = [];
        function ajouter(sk) { L.filter(function (x) { return x.skill === sk; }).forEach(function (x) { steps.push({ k: sk, code: x.code, titre: x.titre }); }); }
        if (type === "complet") { ajouter("listening"); ajouter("reading"); if (window.DiisooIelts.ecritureOutils) steps.push({ k: "writing", titre: "Writing Task 2" }); }
        else if (type === "writing") { if (window.DiisooIelts.ecritureOutils) steps.push({ k: "writing", titre: "Writing Task 2" }); }
        else ajouter(type === "reading" ? "reading" : "listening");
        if (!steps.length) { U.vider(); U.entete("Examens blancs", accueil); U.racine().appendChild(el("p", "", "Aucun exercice disponible pour cette simulation.")); return; }
        var nom = TYPES.filter(function (t) { return t[0] === type; })[0][1];
        M = { type: type, nom: nom, lsk: lsk, steps: steps, i: 0, res: [] };
        consigne();
      }).catch(function () { U.vider(); U.entete("Examens blancs", accueil); U.racine().appendChild(el("p", "", "Connexion impossible. Réessaie.")); });
    }

    function quitter() { if (window.confirm("Quitter l'examen blanc ? Ta progression sera perdue.")) { stop(); arreterVoix(); accueil(); } }

    function consigne() {
      stop(); var s = M.steps[M.i];
      U.vider(); U.entete(M.nom, quitter);
      var w = U.racine();
      w.appendChild(el("h2", "", "Partie " + (M.i + 1) + " / " + M.steps.length + " : " + esc(s.k === "writing" ? "Écriture" : s.titre)));
      var regle = s.k === "listening" ? "Tu n'as qu'une seule écoute. Les questions sont visibles pendant l'écoute." : s.k === "reading" ? "Lis le texte puis réponds. Le chrono envoie tes réponses à la fin du temps." : "Écris ta rédaction. À la fin du temps, ton texte est envoyé tel qu'il est.";
      w.appendChild(el("div", "ie-warn", regle + " Il n'y a pas de pause."));
      w.appendChild(bouton("ie-p", "Commencer la partie", function () { section(); }));
    }

    function section() {
      var s = M.steps[M.i];
      if (s.k === "writing") return ecriture(s);
      U.vider(); U.entete(M.nom, quitter); U.racine().appendChild(el("p", "", "Chargement…"));
      sb().rpc("ielts_charger_exercice", { p_code: s.code }).then(function (r) {
        if (r.error || !r.data) { erreurSection(); return; }
        rendre(s, r.data);
      }).catch(erreurSection);
    }
    function erreurSection() { stop(); U.vider(); U.entete("Erreur", accueil); var w = U.racine(); w.appendChild(el("p", "", "Connexion impossible. L'examen est interrompu.")); w.appendChild(bouton("ie-p", "Retour", accueil)); }

    function minuteur(secondes, fin) {
      stop(); var t0 = Date.now(), fini = false;
      chrono = setInterval(function () {
        var reste = Math.max(0, secondes - Math.floor((Date.now() - t0) / 1000));
        var e = document.getElementById("ie-chrono"); if (e) e.textContent = fmt(reste);
        if (reste <= 0 && !fini) { fini = true; stop(); fin(); }
      }, 500);
    }

    function rendre(s, EX) {
      stop(); ecoutes = 0; lecture = false; var REP = {};
      U.vider(); U.entete(M.nom, quitter);
      var w = U.racine();
      w.appendChild(el("div", "ie-row", "<span>⏱ Temps restant</span><b id=\"ie-chrono\">" + EX.duree_min + ":00</b>"));
      if (EX.skill === "reading") w.appendChild(el("div", "ie-ctx", esc(EX.texte)));
      else {
        var bl = bouton("ie-p", "▶ Écouter (une seule fois)", function () {
          if (ecoutes >= 1 || lecture) return; lecture = true; ecoutes++; bl.disabled = true; bl.innerHTML = "🔊 Écoute en cours…";
          var fin = function () { lecture = false; bl.innerHTML = "Écoute terminée"; };
          try { window.Diisoo.voix.debloquer(); Promise.resolve(window.Diisoo.voix.jouer(EX.texte, "en", {})).then(fin, function () { fin(); bl.innerHTML = "Son indisponible"; }); } catch (e) { fin(); }
        });
        w.appendChild(bl);
      }
      var fait = false;
      function envoyer() {
        if (fait) return; fait = true; stop(); arreterVoix();
        U.vider(); U.entete(M.nom, accueil); U.racine().appendChild(el("p", "", "Correction en cours…"));
        sb().rpc("ielts_soumettre", { p_code: EX.code, p_reponses: REP, p_mode: "exam", p_ref: U.ref(), p_duree_s: null }).then(function (r) {
          if (r.error || !r.data) { erreurSection(); return; }
          M.res.push({ k: s.k, titre: EX.titre, bons: r.data.bons, total: r.data.total, taux: r.data.taux, det: r.data.details, EX: EX }); suite();
        }).catch(erreurSection);
      }
      EX.questions.forEach(function (q, qi) {
        var b = el("div", "", ""); b.style.cssText = "border:1px solid #1E2740;background:#141A2B;border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:8px";
        b.appendChild(el("div", "ie-n", (qi + 1) + ". " + esc(q.prompt)));
        var bs = [];
        (q.options || []).forEach(function (t, i) {
          var o = bouton("", esc(t), function () { REP[q.id] = i; bs.forEach(function (x) { x.classList.remove("ie-sel"); }); o.classList.add("ie-sel"); });
          bs.push(o); b.appendChild(o);
        });
        w.appendChild(b);
      });
      w.appendChild(bouton("ie-p", "Terminer cette partie", function () { if (window.confirm("Envoyer tes réponses ?")) envoyer(); }));
      minuteur(EX.duree_min * 60, envoyer);
    }

    function ecriture(s) {
      var O = window.DiisooIelts.ecritureOutils, T = O.TACHES.t2, suj = T.sujets[(new Date().getDate()) % T.sujets.length];
      stop(); U.vider(); U.entete(M.nom, quitter);
      var w = U.racine();
      w.appendChild(el("div", "ie-row", "<span>⏱ Temps restant</span><b id=\"ie-chrono\">" + T.minutes + ":00</b>"));
      w.appendChild(el("div", "ie-ctx", esc(suj.q)));
      var ta = el("textarea", "", ""); ta.id = "ie-wr"; ta.rows = 12; ta.placeholder = "Écris ta réponse en anglais (au moins " + T.min + " mots)";
      ta.style.cssText = "width:100%;box-sizing:border-box;border-radius:14px;border:1px solid #1E2740;background:#141A2B;color:#F6F1E7;padding:12px;font:inherit;font-size:16px;line-height:1.5";
      var nb = el("div", "ie-s", "0 mots"); ta.addEventListener("input", function () { nb.textContent = O.nbMots(ta.value) + " mots"; });
      w.appendChild(ta); w.appendChild(nb);
      var fait = false;
      function terminer() {
        if (fait) return; fait = true; stop();
        var n = O.nbMots(ta.value), a = O.analyse("t2", ta.value, false), bons = a.c.filter(function (x) { return x[1]; }).length;
        M.res.push({ k: "writing", titre: "Writing Task 2", bons: bons, total: a.c.length, taux: Math.round(bons * 100 / a.c.length), mots: n, crit: a.c }); suite();
      }
      w.appendChild(bouton("ie-p", "Terminer cette partie", function () { if (O.nbMots(ta.value) < 1 || window.confirm("Envoyer ta rédaction ?")) terminer(); }));
      minuteur(T.minutes * 60, terminer);
    }

    function suite() { M.i++; if (M.i < M.steps.length) consigne(); else bilan(); }

    function bilan() {
      stop(); U.vider(); U.entete("Résultat", accueil);
      var w = U.racine();
      var NOM = { listening: "🎧 Écoute", reading: "📖 Lecture", writing: "✍️ Écriture" };
      var obj = M.res.filter(function (r) { return r.k !== "writing"; }), tous = M.res;
      var moy = tous.length ? Math.round(tous.reduce(function (s, r) { return s + r.taux; }, 0) / tous.length) : 0;
      var texte = M.lsk ? "Appréciation d'entraînement" : "Moyenne d'entraînement";
      var c = el("div", "", '<div class="ie-s">' + texte + '</div><div style="font-size:40px;font-weight:900;color:#5FC98F">' + moy + ' %</div><div class="ie-s">Estimation, pas une note IELTS</div>');
      c.style.cssText = "border:1px solid #3FAE74;background:#10251A;border-radius:16px;padding:12px 14px;text-align:center"; w.appendChild(c);
      w.appendChild(el("div", "ie-warn", M.lsk ? "Life Skills n'a pas de note de 0 à 9, ni de réussite ou d'échec ici. Pour l'oral, utilise Life Skills dans le menu IELTS." : "Aucun band IELTS n'est donné : la règle de conversion officielle n'est pas disponible. L'Écriture est une estimation automatique par règles."));
      tous.forEach(function (r) {
        var d = el("div", "ie-row", "<span>" + NOM[r.k] + " · " + esc(r.titre) + "</span><span class='" + (r.taux >= 70 ? "ie-ok" : r.taux < 50 ? "ie-ko" : "") + "'>" + r.bons + " / " + r.total + " (" + r.taux + " %)</span>");
        w.appendChild(d);
      });
      var forts = tous.filter(function (r) { return r.taux >= 70; }).map(function (r) { return NOM[r.k]; });
      var faibles = tous.filter(function (r) { return r.taux < 50; }).map(function (r) { return NOM[r.k]; });
      if (forts.length) w.appendChild(el("div", "ie-note", "Points forts : " + forts.join(", ")));
      if (faibles.length) w.appendChild(el("div", "ie-note", "À travailler en priorité : " + faibles.join(", ") + ". Reprends l'entraînement de cette compétence dans le menu IELTS."));
      obj.forEach(function (r) {
        var ko = (r.det || []).filter(function (x) { return !x.ok; });
        if (!ko.length) return;
        var dt = el("details", "", ""); dt.appendChild(el("summary", "", "Corrections : " + esc(r.titre) + " (" + ko.length + " erreur(s))"));
        ko.forEach(function (x) {
          var q = r.EX.questions.filter(function (z) { return z.id === x.id; })[0] || { prompt: "", options: [] };
          dt.appendChild(el("div", "ie-ctx", "<b>" + esc(q.prompt) + "</b><br>Ta réponse : " + (x.choix == null ? "aucune" : esc(q.options[x.choix])) + "<br>Bonne réponse : " + esc(q.options[x.bonne_option]) + (x.explication ? "<br>" + esc(x.explication) : "")));
        });
        w.appendChild(dt);
      });
      histoAjouter({ t: Date.now(), nom: M.nom, res: moy + " %" });
      w.appendChild(bouton("ie-p", "Nouvelle simulation", accueil));
    }

    I.blanc = accueil;
    return true;
  }
  if (!demarrer()) { var n = 0, t = setInterval(function () { if (demarrer() || ++n > 40) clearInterval(t); }, 250); }
})();
