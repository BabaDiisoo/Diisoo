/* diisoo-ielts-p3.js v1 : IELTS Life Skills A1, A2, B1 (Écoute + Oral)
 * R4 : parcours distinct. R6 : aucune note 0 à 9, aucun "réussi / échoué" : appréciation pédagogique d'entraînement.
 * R7 : contenus Diisoo, pas des sujets officiels. R1 : tout retour est une estimation d'entraînement.
 * Écoute : réutilise le moteur de diisoo-ielts-p2.js (exercices lsk-*), correction côté serveur.
 * Oral : question lue par la voix de l'app, réponse parlée (reconnaissance vocale si disponible) ou écrite,
 *        retour instantané avec DiisooOral (sans réseau, sans IA payante).
 * Prérequis : p1 + p2 + sql-ielts-lifeskills-a1/a2/b1.sql.
 */
(function () {
  "use strict";
  function demarrer() {
    var I = window.DiisooIelts;
    if (!I || !I.ui || !I.entrainement) return false;
    if (I.lifeskills) return true;
    var U = I.ui, el = U.el, esc = U.esc, bouton = U.bouton;

    var NIV = {
      A1: { cible: 5, ecoute: "lsk-a1-", titre: "Life Skills A1", sous: "Démarches familiales, bases du quotidien",
        taches: ["What is your name?", "Where do you live?", "Tell me about your family.", "What do you do every day?", "What food do you like?", "Tell me about your best friend.", "What time do you get up?", "What do you like to do on Sunday?"] },
      A2: { cible: 10, ecoute: "lsk-a2-", titre: "Life Skills A2", sous: "Prolongation familiale, vie quotidienne",
        taches: ["Describe your home.", "What did you do last weekend?", "What do you usually buy at the market?", "How do you go to work or to school?", "What is your plan for next week?", "Tell me about your last holiday.", "What do you do in the evening?", "Describe your best friend."] },
      B1: { cible: 20, ecoute: "lsk-b1-", titre: "Life Skills B1", sous: "Résidence permanente, citoyenneté",
        taches: ["Tell me about a job you have done.", "Compare living in a city and living in a village.", "Describe a problem you had and how you solved it.", "What are your plans for the future, and why?", "Do you think people should learn English? Why?", "Describe a place you would like to visit and say why.", "What are the advantages of using a mobile phone?", "Tell me about a time you helped someone."] }
    };
    var LIENS = /\b(because|and|but|so|then|also|when|if|after|before|first|next|however)\b/i;
    var S = null, rec = null;

    function arreter() { try { if (rec) rec.stop(); } catch (e) {} rec = null; try { window.Diisoo.voix.arreter(); } catch (e) {} }

    function menu() {
      arreter(); U.vider(); U.entete("Life Skills", U.accueil);
      var w = U.racine();
      w.appendChild(el("p", "", "Test distinct : écoute et oral seulement. Choisis ton niveau."));
      ["A1", "A2", "B1"].forEach(function (k) {
        w.appendChild(bouton("", '<div class="ie-n">' + NIV[k].titre + '</div><div class="ie-s">' + NIV[k].sous + "</div>", function () { niveau(k); }));
      });
      w.appendChild(el("div", "ie-warn", "Life Skills n'a pas de note de 0 à 9. Diisoo te donne une appréciation d'entraînement : ce n'est pas un résultat officiel de réussite ou d'échec."));
      w.appendChild(el("div", "ie-note", "Contenus créés par Diisoo : ce ne sont pas des sujets officiels."));
    }

    function niveau(k) {
      arreter(); U.vider(); U.entete(NIV[k].titre, menu);
      var w = U.racine();
      w.appendChild(bouton("ie-p", "🎧 Écoute", function () { I.entrainement(NIV[k].ecoute); }));
      w.appendChild(bouton("ie-p", "🎤 Oral : 5 questions", function () { S = nouvelle(k); tache(); }));
    }

    function nouvelle(k) {
      var t = NIV[k].taches.slice(), r = [];
      while (r.length < 5 && t.length) r.push(t.splice(Math.floor(Math.random() * t.length), 1)[0]);
      return { k: k, i: 0, rep: [], taches: r };
    }

    function micDispo() { return window.SpeechRecognition || window.webkitSpeechRecognition; }

    function tache() {
      arreter(); U.vider();
      var N = NIV[S.k], q = S.taches[S.i], n = S.taches.length;
      var tete = el("div", "ie-top", ""); tete.appendChild(el("h2", "", "Question " + (S.i + 1) + " / " + n));
      var x = el("button", "ie-x", "Quitter"); x.onclick = function () { niveau(S.k); }; tete.appendChild(x);
      var w = U.racine(); w.appendChild(tete);
      w.appendChild(el("div", "ie-bar", "<i style='width:" + Math.round(S.i / n * 100) + "%'></i>"));
      w.appendChild(el("h2", "", esc(q)));
      w.appendChild(bouton("", "🔊 Écouter la question", function () {
        try { window.Diisoo.voix.debloquer(); window.Diisoo.voix.jouer(q, "en", {}); } catch (e) {}
      }));
      var ta = el("textarea", "", ""); ta.id = "ie-ta"; ta.rows = 4; ta.placeholder = "Réponds en anglais (parle avec le micro ou écris ici)";
      ta.style.cssText = "width:100%;box-sizing:border-box;border-radius:14px;border:1px solid #1E2740;background:#141A2B;color:#F6F1E7;padding:12px;font:inherit;font-size:16px";
      var go = bouton("ie-p", "Voir mon retour", function () { retour(ta.value); });
      go.disabled = true;
      ta.addEventListener("input", function () { go.disabled = !ta.value.trim(); });
      var SR = micDispo();
      if (SR) {
        var mic = bouton("", "🎤 Parler", function () {
          if (rec) { arreter(); mic.innerHTML = "🎤 Parler"; return; }
          try {
            rec = new SR(); rec.lang = "en-US"; rec.interimResults = true; rec.continuous = false;
            rec.onresult = function (ev) { var t = ""; for (var i = 0; i < ev.results.length; i++) t += ev.results[i][0].transcript; ta.value = t; go.disabled = !t.trim(); };
            rec.onend = function () { rec = null; mic.innerHTML = "🎤 Parler"; };
            rec.onerror = function () { rec = null; mic.innerHTML = "🎤 Parler"; };
            rec.start(); mic.innerHTML = "⏹ Arrêter";
          } catch (e) { rec = null; }
        });
        w.appendChild(mic);
      } else {
        w.appendChild(el("div", "ie-note", "Le micro n'est pas disponible sur cet appareil : écris ta réponse."));
      }
      w.appendChild(ta); w.appendChild(go);
    }

    function retour(texte) {
      arreter(); texte = String(texte || "").trim();
      var N = NIV[S.k], q = S.taches[S.i];
      var mots = texte.split(/\s+/).filter(Boolean).length;
      var assez = mots >= N.cible, liens = LIENS.test(texte);
      var a = { corrections: [], conseils: [], exemple: "" };
      try { if (window.DiisooOral) a = window.DiisooOral.analyser(texte, q, {}) || a; } catch (e) {}
      S.rep[S.i] = { q: q, mots: mots, assez: assez, liens: liens };
      U.vider(); U.entete("Ton retour", function () { niveau(S.k); });
      var w = U.racine();
      w.appendChild(el("div", "ie-ctx", esc(texte)));
      var b = el("div", "", ""); b.style.cssText = "border:1px solid #1E2740;background:#141A2B;border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:6px";
      b.appendChild(el("div", "ie-row", "<span>Longueur (" + mots + " mots)</span><span class='" + (assez ? "ie-ok" : "ie-ko") + "'>" + (assez ? "✔ assez développée" : "à développer (vise " + N.cible + " mots)") + "</span>"));
      b.appendChild(el("div", "ie-row", "<span>Liens entre idées</span><span class='" + (liens ? "ie-ok" : "ie-ko") + "'>" + (liens ? "✔ présents" : "ajoute and, but, because") + "</span>"));
      w.appendChild(b);
      (a.corrections || []).forEach(function (c) {
        w.appendChild(el("div", "ie-ctx", "<b>" + esc(c.avant) + "</b> → <b>" + esc(c.apres) + "</b><br>" + esc(c.note || "")));
      });
      (a.conseils || []).forEach(function (c) { w.appendChild(el("div", "ie-note", "• " + esc(c))); });
      if (a.exemple) w.appendChild(el("div", "ie-ctx", "<b>Exemple de réponse</b><br>" + esc(a.exemple)));
      var dernier = S.i === S.taches.length - 1;
      w.appendChild(bouton("ie-p", dernier ? "Voir mon bilan" : "Question suivante", function () { if (dernier) bilan(); else { S.i++; tache(); } }));
    }

    function bilan() {
      arreter(); var N = NIV[S.k];
      var ok = S.rep.filter(function (r) { return r && r.assez; }).length, n = S.taches.length;
      U.vider(); U.entete("Bilan " + N.titre, function () { niveau(S.k); });
      var w = U.racine();
      var msg = ok >= 4 ? "Très bon entraînement : tes réponses sont bien développées. Continue avec des phrases plus variées."
        : ok >= 2 ? "Bon début : développe davantage tes réponses avec des raisons et des exemples."
        : "Continue : essaie de répondre avec 2 ou 3 phrases complètes à chaque question.";
      var c = el("div", "", '<div class="ie-s">Réponses assez développées</div><div style="font-size:36px;font-weight:900;color:#5FC98F">' + ok + " / " + n + '</div><div class="ie-s">' + esc(msg) + "</div>");
      c.style.cssText = "border:1px solid #3FAE74;background:#10251A;border-radius:16px;padding:12px 14px;text-align:center"; w.appendChild(c);
      w.appendChild(el("div", "ie-warn", "Appréciation pédagogique d'entraînement. Ce n'est pas un résultat officiel de réussite ou d'échec."));
      S.rep.forEach(function (r, i) {
        if (!r) return;
        w.appendChild(el("div", "ie-row", "<span>" + (i + 1) + ". " + esc(r.q) + "</span><span class='" + (r.assez ? "ie-ok" : "ie-ko") + "'>" + r.mots + " mots</span>"));
      });
      w.appendChild(bouton("ie-p", "Refaire l'oral", function () { S = nouvelle(S.k); tache(); }));
      w.appendChild(bouton("", "Autre niveau", menu));
    }

    I.lifeskills = menu;
    return true;
  }
  if (!demarrer()) { var n = 0, t = setInterval(function () { if (demarrer() || ++n > 40) clearInterval(t); }, 250); }
})();
