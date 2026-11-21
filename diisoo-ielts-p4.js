/* diisoo-ielts-p4.js v1 : module IELTS, phase 3 (Écriture / Writing, retour automatique par règles)
 * R1 : tout retour est une estimation d'entraînement, aucune note IELTS (pas de band) n'est donnée.
 * R7 : sujets créés par Diisoo, pas des sujets officiels.
 * Sans IA payante : analyse locale (longueur, paragraphes, liens, répétitions, style) + DiisooOral pour les erreurs courantes.
 * Brouillon gardé sur l'appareil. Pas de fin automatique : le temps est un repère, l'élève décide quand terminer.
 * Prérequis : diisoo-ielts-p1.js. Sans effet sinon. Une vraie IA pourra se brancher plus tard via window.DiisooIelts.iaEcriture.
 */
(function () {
  "use strict";
  function demarrer() {
    var I = window.DiisooIelts;
    if (!I || !I.ui) return false;
    if (I.ecriture) return true;
    var U = I.ui, el = U.el, esc = U.esc, bouton = U.bouton;

    var TACHES = {
      t1: { titre: "Task 1 : lettre (General Training)", min: 150, minutes: 20, sujets: [
        { id: "t1a", q: "You live in a rented flat. The heating has not worked for two weeks. Write a letter to your landlord. Explain the problem, say what you have already done, and ask him to repair it quickly.", formel: true },
        { id: "t1b", q: "You are going to miss an English class next week. Write a letter to your teacher. Explain why you cannot come, ask what you will miss, and say how you will catch up.", formel: false },
        { id: "t1c", q: "You bought a phone online, but it arrived damaged. Write a letter to the shop. Describe the problem, say what you want them to do, and ask for an answer soon.", formel: true },
        { id: "t1d", q: "You saw an advertisement for a part-time job at a local shop. Write a letter to the manager. Say why you are interested, describe your experience, and ask when you can come for an interview.", formel: true },
        { id: "t1e", q: "A friend is coming to visit you for a weekend. Write a letter to your friend. Say what you have planned, tell him what to bring, and explain how to get to your home.", formel: false },
        { id: "t1f", q: "You were charged too much on your electricity bill. Write a letter to the electricity company. Explain what is wrong, say what you have checked, and ask them to correct the bill.", formel: true }
      ] },
      t2: { titre: "Task 2 : essai d'opinion", min: 250, minutes: 40, sujets: [
        { id: "t2a", q: "Some people think children should start learning English at primary school. Others think it is better to wait until secondary school. Discuss both views and give your own opinion." },
        { id: "t2b", q: "Many young people leave their villages to work in big cities. What are the advantages and disadvantages of this?" },
        { id: "t2c", q: "Some people say that mobile phones make life easier. Others say they cause problems. To what extent do you agree or disagree?" },
        { id: "t2d", q: "Some people believe that governments should spend more money on public transport than on roads. Do you agree or disagree?" },
        { id: "t2e", q: "Some people think that young people should do a period of national or community service. Do you agree or disagree?" },
        { id: "t2f", q: "In many countries, more people are buying food from supermarkets instead of local markets. Is this a positive or a negative development?" },
        { id: "t2g", q: "Some people think that learning a foreign language is more useful than learning other subjects. To what extent do you agree or disagree?" },
        { id: "t2h", q: "Many people now work from home. What are the advantages and disadvantages of this trend for workers and for society?" }
      ] }
    };
    var LIENS = /\b(however|moreover|furthermore|in addition|for example|for instance|on the other hand|as a result|therefore|because|although|while|firstly|secondly|finally|in conclusion|to conclude|besides|despite)\b/gi;
    var OPINION = /\b(in my opinion|i believe|i think|i agree|i disagree|in my view|from my point of view|i strongly)\b/i;
    var CONCLU = /\b(in conclusion|to conclude|to sum up|in summary|overall)\b/i;
    var FORMEL_DEB = /\bdear (sir|madam|mr|mrs|ms|dr)/i, FORMEL_FIN = /\byours (faithfully|sincerely)\b/i;
    var CONTR = /\b(don't|doesn't|can't|won't|isn't|aren't|didn't|I'm|it's|that's|there's|they're)\b/gi;
    var STOP = /^(the|a|an|and|or|but|to|of|in|on|at|for|with|is|are|was|were|be|been|it|this|that|these|those|i|you|he|she|we|they|my|your|our|their|have|has|had|not|as|by|from|so|do|does|did|will|would|can|could)$/;

    var S = null, minuteur = null, ecoule = 0, enPause = false;

    function cle(id) { return "diisoo_ielts_brouillon_" + id; }
    function lireBrouillon(id) { try { return localStorage.getItem(cle(id)) || ""; } catch (e) { return ""; } }
    function ecrireBrouillon(id, t) { try { localStorage.setItem(cle(id), t); } catch (e) {} }
    function stop() { if (minuteur) { clearInterval(minuteur); minuteur = null; } }
    function fmt(s) { return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
    function nbMots(t) { return (String(t).trim().match(/[A-Za-z0-9'’-]+/g) || []).length; }

    function menu() {
      stop(); U.vider(); U.entete("Écriture (Writing)", U.accueil);
      var w = U.racine();
      w.appendChild(el("p", "", "Choisis une tâche. Tu écris à ton rythme : le temps est un repère, rien ne s'arrête tout seul."));
      ["t1", "t2"].forEach(function (k) {
        var T = TACHES[k];
        w.appendChild(bouton("ie-p", '<div class="ie-n">' + T.titre + '</div><div class="ie-s">Au moins ' + T.min + " mots · repère " + T.minutes + " min</div>", function () { sujets(k); }));
      });
      w.appendChild(el("div", "ie-warn", "Le retour est une estimation automatique d'entraînement, pas une note IELTS. Aucun score de 0 à 9 n'est donné."));
      w.appendChild(el("div", "ie-note", "Sujets créés par Diisoo : ce ne sont pas des sujets officiels IELTS."));
    }

    function sujets(k) {
      stop(); U.vider(); U.entete(TACHES[k].titre, menu);
      var w = U.racine();
      TACHES[k].sujets.forEach(function (s, i) {
        var b = lireBrouillon(s.id), reste = nbMots(b);
        w.appendChild(bouton("", '<div class="ie-n">Sujet ' + (i + 1) + '</div><div class="ie-s">' + esc(s.q.slice(0, 90)) + "…</div>" + (reste ? '<div class="ie-s ie-ok">Brouillon : ' + reste + " mots</div>" : ""), function () { ecrire(k, i); }));
      });
    }

    function ecrire(k, i) {
      stop(); var T = TACHES[k], s = T.sujets[i];
      S = { k: k, i: i }; ecoule = 0; enPause = false;
      U.vider(); U.entete(T.titre, function () { sujets(k); });
      var w = U.racine();
      w.appendChild(el("div", "ie-ctx", esc(s.q)));
      var ligne = el("div", "ie-row", '<span id="ie-nb">0 mots</span><span>⏱ <b id="ie-tps">0:00</b> / ' + T.minutes + ":00</span>");
      w.appendChild(ligne);
      var ta = el("textarea", "", ""); ta.id = "ie-wr"; ta.rows = 12; ta.value = lireBrouillon(s.id);
      ta.placeholder = "Écris ta réponse en anglais ici";
      ta.style.cssText = "width:100%;box-sizing:border-box;border-radius:14px;border:1px solid #1E2740;background:#141A2B;color:#F6F1E7;padding:12px;font:inherit;font-size:16px;line-height:1.5";
      w.appendChild(ta);
      var go = bouton("ie-p", "Voir mon retour", function () { retour(k, i, ta.value); });
      function maj() {
        var n = nbMots(ta.value), e = document.getElementById("ie-nb");
        if (e) e.innerHTML = n + " mots · " + (n >= T.min ? '<span class="ie-ok">objectif atteint</span>' : "encore " + (T.min - n));
        go.disabled = n < 20; ecrireBrouillon(s.id, ta.value);
      }
      ta.addEventListener("input", maj); maj();
      var pz = bouton("", "⏸ Pause du minuteur", function () {
        enPause = !enPause; pz.innerHTML = enPause ? "▶ Reprendre le minuteur" : "⏸ Pause du minuteur";
      });
      w.appendChild(pz); w.appendChild(go);
      w.appendChild(el("div", "ie-note", "Ton brouillon est gardé sur cet appareil. Il faut au moins 20 mots pour voir un retour."));
      minuteur = setInterval(function () {
        if (enPause || !document.getElementById("ie-tps")) return;
        ecoule++; var e = document.getElementById("ie-tps"); if (e) e.textContent = fmt(ecoule);
      }, 1000);
    }

    function analyse(k, texte, formel) {
      var T = TACHES[k], n = nbMots(texte);
      var paras = String(texte).split(/\n\s*\n|\n/).filter(function (p) { return p.trim(); }).length;
      var phrases = String(texte).split(/[.!?]+\s/).filter(function (p) { return p.trim(); });
      var moy = phrases.length ? Math.round(n / phrases.length) : n;
      var liens = {}; (String(texte).match(LIENS) || []).forEach(function (x) { liens[x.toLowerCase()] = 1; });
      var nl = Object.keys(liens).length;
      var cpt = {}; (String(texte).toLowerCase().match(/[a-z']+/g) || []).forEach(function (w) { if (w.length > 3 && !STOP.test(w)) cpt[w] = (cpt[w] || 0) + 1; });
      var rep = Object.keys(cpt).filter(function (w) { return cpt[w] >= 5; }).slice(0, 4);
      var contr = (String(texte).match(CONTR) || []).length;
      var c = []; /* critères : [nom IELTS, ok, message] */
      if (k === "t1") {
        c.push(["Task Achievement", n >= T.min, n >= T.min ? "Longueur suffisante (" + n + " mots)." : "Trop court : " + n + " mots, vise au moins " + T.min + ". Couvre les 3 points demandés."]);
        var deb = FORMEL_DEB.test(texte), fin = FORMEL_FIN.test(texte);
        c.push(["Ton de la lettre", formel ? (deb && fin) : true, formel ? (deb && fin ? "Début et fin formels présents." : "Lettre formelle : commence par « Dear Sir or Madam, » et finis par « Yours faithfully, ».") : "Lettre à un enseignant : ton poli, « Dear + nom », fin « Yours sincerely, »."]);
      } else {
        c.push(["Task Response", n >= T.min && OPINION.test(texte), n < T.min ? "Trop court : " + n + " mots, vise au moins " + T.min + "." : OPINION.test(texte) ? "Ton avis est clairement donné." : "Donne ton avis clairement : « In my opinion, … »."]);
        c.push(["Conclusion", CONCLU.test(texte), CONCLU.test(texte) ? "Conclusion présente." : "Ajoute une conclusion : « In conclusion, … »."]);
        c.push(["Style formel", contr === 0, contr === 0 ? "Pas de formes contractées." : "Évite les formes courtes (" + contr + " trouvées) : écris « do not », « it is »."]);
      }
      c.push(["Coherence and Cohesion", paras >= (k === "t2" ? 4 : 3) && nl >= 3, (paras >= (k === "t2" ? 4 : 3) ? "Paragraphes : " + paras + ". " : "Organise en " + (k === "t2" ? "4" : "3") + " paragraphes (introduction, idées, conclusion). ") + (nl >= 3 ? nl + " mots de liaison différents." : "Utilise plus de liens : however, for example, because, therefore.")]);
      c.push(["Lexical Resource", rep.length === 0, rep.length ? "Mots très répétés : " + rep.join(", ") + ". Cherche des synonymes." : "Peu de répétitions, bien."]);
      c.push(["Grammatical Range", moy >= 9 && moy <= 28, moy < 9 ? "Phrases très courtes (moyenne " + moy + " mots) : relie-les avec because, although, which." : moy > 28 ? "Phrases très longues (moyenne " + moy + " mots) : coupe-les." : "Longueur de phrases équilibrée (moyenne " + moy + " mots)."]);
      return { c: c, n: n, paras: paras };
    }

    function retour(k, i, texte) {
      stop(); var T = TACHES[k], s = T.sujets[i], a = analyse(k, texte, s.formel);
      var o = { corrections: [], conseils: [] };
      try { if (window.DiisooOral) o = window.DiisooOral.analyser(texte, s.q, { libre: true }) || o; } catch (e) {}
      try { var h = JSON.parse(localStorage.getItem("diisoo_ielts_ecriture") || "[]"); h.push({ t: Date.now(), k: k, id: s.id, mots: a.n, ok: a.c.filter(function (x) { return x[1]; }).length, sur: a.c.length }); localStorage.setItem("diisoo_ielts_ecriture", JSON.stringify(h.slice(-30))); } catch (e) {}
      U.vider(); U.entete("Ton retour", function () { ecrire(k, i); });
      var w = U.racine();
      var bons = a.c.filter(function (x) { return x[1]; }).length;
      var carte = el("div", "", '<div class="ie-s">Points forts</div><div style="font-size:36px;font-weight:900;color:#5FC98F">' + bons + " / " + a.c.length + '</div><div class="ie-s">' + a.n + " mots · " + a.paras + " paragraphe(s)</div>");
      carte.style.cssText = "border:1px solid #3FAE74;background:#10251A;border-radius:16px;padding:12px 14px;text-align:center"; w.appendChild(carte);
      w.appendChild(el("div", "ie-warn", "Estimation automatique d'entraînement, pas une note IELTS. Aucun band n'est donné."));
      a.c.forEach(function (x) {
        w.appendChild(el("div", "ie-row", "<span><b>" + esc(x[0]) + "</b><br><span class='ie-s'>" + esc(x[2]) + "</span></span><span class='" + (x[1] ? "ie-ok" : "ie-ko") + "'>" + (x[1] ? "✔" : "à revoir") + "</span>"));
      });
      (o.corrections || []).forEach(function (c) { w.appendChild(el("div", "ie-ctx", "<b>" + esc(c.avant) + "</b> → <b>" + esc(c.apres) + "</b><br>" + esc(c.note || ""))); });
      w.appendChild(el("div", "ie-note", "Ce retour ne lit pas le sens de ton texte. Montre-le à ton professeur pour un avis complet."));
      w.appendChild(bouton("ie-p", "Améliorer mon texte", function () { ecrire(k, i); }));
      w.appendChild(bouton("", "Autre sujet", function () { sujets(k); }));
    }

    I.ecriture = menu;
    I.ecritureOutils = { TACHES: TACHES, analyse: analyse, nbMots: nbMots };
    return true;
  }
  if (!demarrer()) { var n = 0, t = setInterval(function () { if (demarrer() || ++n > 40) clearInterval(t); }, 250); }
})();
