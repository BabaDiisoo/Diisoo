/* diisoo-ielts-p2.js v1 : module IELTS, phase 2 (entraînement Écoute et Lecture)
 * R8 : correction côté serveur, bonnes réponses reçues seulement après la soumission.
 * R9 : mode "practice" (réécoute libre, pas de chrono) ou "exam" (une seule écoute, chrono, envoi automatique).
 * R7 : mention "Contenu Diisoo, pas un sujet officiel IELTS" sur chaque exercice.
 * R1 : le score est un résultat d'entraînement, pas une note IELTS.
 * Prérequis : diisoo-ielts-p1.js + sql-ielts-phase1.sql + sql-ielts-phase2.sql. Sans effet sinon.
 */
(function () {
  "use strict";
  function demarrer() {
    var I = window.DiisooIelts;
    if (!I || !I.ui || I.entrainement) return !!(I && I.entrainement);
    var U = I.ui, el = U.el, esc = U.esc, bouton = U.bouton;
    var MODE = "practice", EX = null, REP = {}, IDX = 0, T0 = 0, chrono = null, ecoutes = 0, lecture = false;

    function sb() { return U.sb(); }
    function stopChrono() { if (chrono) { clearInterval(chrono); chrono = null; } }
    function arreterVoix() { try { window.Diisoo.voix.arreter(); } catch (e) {} }

    function liste() {
      stopChrono(); arreterVoix();
      U.vider(); U.entete("Entraînement", U.accueil);
      var w = U.racine();
      w.appendChild(el("p", "", "Choisis le mode, puis un exercice."));
      var m = el("div", "", ""); m.style.cssText = "display:flex;gap:8px";
      [["practice", "Entraînement", "Réécoute libre, sans chrono"], ["exam", "Mode examen", "Une écoute, chrono"]].forEach(function (x) {
        var b = bouton(MODE === x[0] ? "ie-sel" : "", '<div class="ie-n">' + x[1] + '</div><div class="ie-s">' + x[2] + "</div>", function () { MODE = x[0]; liste(); });
        b.style.flex = "1"; m.appendChild(b);
      });
      w.appendChild(m);
      var c = sb();
      if (!c) { w.appendChild(el("p", "", "Connexion indisponible.")); return; }
      c.rpc("ielts_liste_exercices", { p_skill: null }).then(function (r) {
        if (r.error || !r.data || !r.data.length) { w.appendChild(el("p", "", "Aucun exercice disponible pour l'instant.")); return; }
        var NOM = { listening: "🎧 Écoute", reading: "📖 Lecture" };
        r.data.forEach(function (x) {
          w.appendChild(bouton("", '<div class="ie-n">' + NOM[x.skill] + " · " + esc(x.titre) + '</div><div class="ie-s">Niveau ' + esc(x.level) + " · " + x.nb_questions + " questions · " + x.duree_min + " min</div>", function () { ouvrirExercice(x.code); }));
        });
        w.appendChild(el("div", "ie-note", "Contenus créés par Diisoo : ce ne sont pas des sujets officiels IELTS."));
      }).catch(function () { w.appendChild(el("p", "", "Connexion impossible. Réessaie.")); });
    }

    function ouvrirExercice(code) {
      U.vider(); U.entete("Chargement…", liste);
      sb().rpc("ielts_charger_exercice", { p_code: code }).then(function (r) {
        if (r.error || !r.data) { U.vider(); U.entete("Erreur", liste); U.racine().appendChild(el("p", "", "Exercice indisponible.")); return; }
        EX = r.data; REP = {}; IDX = 0; ecoutes = 0; lecture = false; T0 = Date.now();
        if (EX.skill === "listening") consigneEcoute(); else page();
      }).catch(function () { U.vider(); U.entete("Erreur", liste); U.racine().appendChild(el("p", "", "Connexion impossible.")); });
    }

    /* Écoute : l'audio est lu par la voix de l'app (le texte n'est jamais affiché avant la fin). */
    function consigneEcoute() {
      stopChrono(); U.vider(); U.entete(EX.titre, liste);
      var w = U.racine();
      w.appendChild(el("p", "", esc(EX.consigne || "")));
      w.appendChild(el("div", "ie-warn", MODE === "exam" ? "Mode examen : tu n'as qu'une seule écoute. Appuie sur Lecture quand tu es prêt." : "Mode entraînement : tu peux réécouter autant que tu veux."));
      w.appendChild(bouton("ie-p", "▶ Écouter", function () { jouer(true); }));
      var q = bouton("", "Aller aux questions", function () { if (MODE === "exam") demarrerChrono(); page(); });
      w.appendChild(q);
      if (MODE === "practice") w.appendChild(el("div", "ie-note", "Tu pourras réécouter pendant les questions."));
    }
    function jouer(depuisConsigne) {
      if (MODE === "exam" && ecoutes >= 1) { toast("Une seule écoute en mode examen."); return; }
      if (lecture) return;
      lecture = true; ecoutes++;
      if (MODE === "exam" && !chrono) demarrerChrono();
      var fin = function () { lecture = false; if (depuisConsigne) { page(); } };
      try {
        window.Diisoo.voix.debloquer();
        Promise.resolve(window.Diisoo.voix.jouer(EX.texte, "en", {})).then(fin, function () { lecture = false; toast("Son indisponible. Réessaie."); });
      } catch (e) { lecture = false; toast("Son indisponible sur cet appareil."); }
    }
    function toast(t) { var n = el("div", "ie-warn", esc(t)); var w = U.racine(); w.insertBefore(n, w.firstChild.nextSibling); setTimeout(function () { try { n.remove(); } catch (e) {} }, 2500); }

    function demarrerChrono() {
      stopChrono(); var fin = Date.now() + EX.duree_min * 60000;
      chrono = setInterval(function () {
        var reste = Math.max(0, Math.round((fin - Date.now()) / 1000));
        var s = document.getElementById("ie-chrono");
        if (s) s.textContent = Math.floor(reste / 60) + ":" + ("0" + (reste % 60)).slice(-2);
        if (reste <= 0) { stopChrono(); envoyer(); }
      }, 500);
    }

    function page() {
      U.vider();
      var n = EX.questions.length, q = EX.questions[IDX];
      var tete = el("div", "ie-top", ""); tete.appendChild(el("h2", "", "Question " + (IDX + 1) + " / " + n));
      var bq = el("button", "ie-x", "Quitter"); bq.onclick = function () { stopChrono(); arreterVoix(); liste(); }; tete.appendChild(bq);
      var w = U.racine(); w.appendChild(tete);
      if (MODE === "exam") w.appendChild(el("div", "ie-row", '<span>⏱ Temps restant</span><b id="ie-chrono">' + EX.duree_min + ":00</b>"));
      w.appendChild(el("div", "ie-bar", "<i style='width:" + Math.round(IDX / n * 100) + "%'></i>"));
      if (EX.skill === "reading") {
        var t = el("div", "ie-ctx", esc(EX.texte)); w.appendChild(t);
      } else if (MODE === "practice" || ecoutes === 0) {
        w.appendChild(bouton("", "🔊 " + (ecoutes ? "Réécouter" : "Écouter"), function () { jouer(false); }));
      } else {
        w.appendChild(el("div", "ie-note", "Écoute terminée (une seule écoute en mode examen)."));
      }
      w.appendChild(el("h2", "", esc(q.prompt)));
      var choisi = REP[q.id];
      var suiv = bouton("ie-p", IDX === n - 1 ? "Terminer" : "Suivant", function () { if (IDX === n - 1) envoyer(); else { IDX++; page(); } });
      suiv.disabled = choisi == null;
      (q.options || []).forEach(function (t, i) {
        w.appendChild(bouton(choisi === i ? "ie-sel" : "", esc(t), function () {
          REP[q.id] = i; Array.prototype.forEach.call(w.querySelectorAll("button"), function (b) { b.classList.remove("ie-sel"); });
          this.classList.add("ie-sel"); suiv.disabled = false;
        }));
      });
      w.appendChild(suiv);
    }

    function envoyer() {
      stopChrono(); arreterVoix(); U.vider(); U.entete("Correction…", liste); U.racine().appendChild(el("p", "", "Correction en cours…"));
      var duree = Math.round((Date.now() - T0) / 1000);
      sb().rpc("ielts_soumettre", { p_code: EX.code, p_reponses: REP, p_mode: MODE, p_ref: U.ref(), p_duree_s: duree }).then(function (r) {
        if (r.error || !r.data) { U.vider(); U.entete("Erreur", liste); U.racine().appendChild(el("p", "", "La correction a échoué.")); return; }
        bilan(r.data);
      }).catch(function () { U.vider(); U.entete("Erreur", liste); U.racine().appendChild(el("p", "", "Connexion impossible.")); });
    }

    function bilan(d) {
      U.vider(); U.entete("Résultat", liste);
      var w = U.racine();
      var c = el("div", "", '<div class="ie-s">Ton score d\'entraînement</div><div style="font-size:40px;font-weight:900;color:#5FC98F">' + d.bons + " / " + d.total + '</div><div class="ie-s">' + d.taux + " % de réussite</div>");
      c.style.cssText = "border:1px solid #3FAE74;background:#10251A;border-radius:16px;padding:12px 14px;text-align:center"; w.appendChild(c);
      w.appendChild(el("div", "ie-note", "Score d'entraînement Diisoo, pas une note IELTS."));
      EX.questions.forEach(function (q, i) {
        var det = d.details.filter(function (x) { return x.id === q.id; })[0] || {};
        var b = el("div", "", "");
        b.style.cssText = "border:1px solid " + (det.ok ? "#3FAE74" : "#E1693F") + ";background:#141A2B;border-radius:16px;padding:12px 14px";
        b.innerHTML = '<div class="ie-n">' + (i + 1) + ". " + esc(q.prompt) + "</div>" +
          '<div class="ie-s ' + (det.ok ? "ie-ok" : "ie-ko") + '">' + (det.ok ? "✔ Correct" : "✘ Ta réponse : " + (det.choix == null ? "aucune" : esc(q.options[det.choix]))) + "</div>" +
          (det.ok ? "" : '<div class="ie-s">Bonne réponse : ' + esc(q.options[det.bonne_option]) + "</div>") +
          (det.explication ? '<div class="ie-s">' + esc(det.explication) + "</div>" : "");
        w.appendChild(b);
      });
      if (EX.skill === "listening") {
        var tr = el("div", "ie-ctx", "<b>Script de l'audio</b><br>" + esc(EX.texte)); w.appendChild(tr);
        w.appendChild(bouton("", "🔊 Réécouter", function () { try { window.Diisoo.voix.jouer(EX.texte, "en", {}); } catch (e) {} }));
      }
      w.appendChild(bouton("ie-p", "Autre exercice", liste));
    }

    I.entrainement = liste;
    return true;
  }
  /* p1 peut se charger après p2 : on réessaie brièvement */
  if (!demarrer()) { var n = 0, t = setInterval(function () { if (demarrer() || ++n > 40) clearInterval(t); }, 250); }
})();
