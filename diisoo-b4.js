/* diisoo-b4.js : morceau 4/6 du bundle. Généré, ne pas modifier à la main. */
try{
/* ---- diisoo-mission-telephone.js ---- */
/* diisoo-mission-telephone.js v1 : Mission « Acheter un forfait »
   L'app joue le vendeur de forfaits (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Téléphone ».
   Bouton place en haut du theme « Téléphone & internet » (Anglais). Essai : https://diisoo.sn/?mission=telephone */
(function () {
  "use strict";
  if (window.DiisooMissionTelephone) return;
  var Q = [
    { q: "Hello. How can I help you?", kw: /bundle|data|credit|internet|phone|sim|recharge|want|need|buy|help/i, m: "I would like a data bundle, please." },
    { q: "For how long do you want it?", kw: /day|days|week|weeks|month|months|one|two|three|\d/i, m: "I want it for one month." },
    { q: "Ten gigabytes cost five thousand francs. Is that okay?", kw: /yes|ok|okay|fine|cheaper|expensive|take|no|lower|price|sure/i, m: "Yes, I will take it." },
    { q: "How do you want to pay?", kw: /orange|wave|cash|money|mobile|pay|card/i, m: "I will pay with Orange Money." },
    { q: "Do you need a new SIM card as well?", kw: /yes|no|sim|card|need|thank|please|already/i, m: "No, thank you. I already have one." }
  ];




  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mtl{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mtl .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mtl .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mtl .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mtl button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mtl .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mtl .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mtl .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mtl .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mtl .m.on{animation:mfp 1s infinite}@keyframes mfp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mtl .ok{color:#25D366}#mtl .or{color:#FFAA3C}" +
    "#mtl-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mtl-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mtl")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mtl";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">📱 Acheter un forfait · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mf-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mf-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mf-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mf-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mf-skip" type="button">Passer</button>' +
        '<button class="b3" id="mf-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mf-r"), mic = document.getElementById("mf-mic"), nx = document.getElementById("mf-next");
      document.getElementById("mf-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mf-x").onclick = function () { o.remove(); };
      document.getElementById("mf-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["telephone"]) BADGES["telephone"] = { icon: "📱", label: "Téléphone", desc: "Forfait internet acheté à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("telephone"); } catch (e) {}
      }
      noter("mission_telephone", score + "/" + Q.length);
      o.innerHTML = '<div class="k">📱 Mission telephone</div><div class="q">' + (ok ? "Forfait acheté ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Téléphone » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Famille et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mf-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mf-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mf-x2" type="button">Fermer</button>';
      document.getElementById("mf-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mf-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mf-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon achat de forfait internet en anglais sur Diisoo 📱 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComtlnent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mtl-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "phone") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mtl-btn";
    b.innerHTML = '<span style="font-size:22px">📱</span><span>Mission : acheter un forfait<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionTelephone = { ouvrir: ouvrir };
  if (/[?&]mission=telephone/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-telephone.js",e);}

try{
/* ---- diisoo-administration.js ---- */
/* diisoo-administration.js v1 : theme « Administration » (30 phrases, 1 dialogue, 3 questions), niveau N2.
   Wolof relu par Babacar. Desactivable : ?administration=0 */
(function () {
  "use strict";
  if (window.__diisooAdministration || /[?&]administration=0/.test(location.search)) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooAdministration = true;
  var VOC = [
[
"Where is the town hall?",
"Où est la mairie ?",
"Fan la meri bi nekk ?"
],
[
"I need an identity card.",
"Il me faut une carte d'identité.",
"Dama soxla kart didantite."
],
[
"I want to make a passport.",
"Je veux faire un passeport.",
"Dama bëgg a defar paspoor."
],
[
"What time do you open?",
"À quelle heure ouvrez-vous ?",
"Ban waxtu ngeen di ubbi ?"
],
[
"What time do you close?",
"À quelle heure fermez-vous ?",
"Ban waxtu ngeen di tëj ?"
],
[
"Where do I wait?",
"Où dois-je attendre ?",
"Fan laa war a xaar ?"
],
[
"Which window is it?",
"C'est quel guichet ?",
"Ban gise la ?"
],
[
"I have an appointment.",
"J'ai un rendez-vous.",
"Am naa benn ràndewu."
],
[
"Here are my documents.",
"Voici mes documents.",
"Samay kayit ñii ngi nii."
],
[
"Please, I am in a hurry.",
"S'il vous plaît, je suis pressé.",
"Bu la neexee, dama yàkkamti."
],
[
"Which documents do I need to bring?",
"Quels documents dois-je apporter ?",
"Yan kayit laa war a indi ?"
],
[
"I need a copy of my birth certificate.",
"Il me faut une copie de mon extrait de naissance.",
"Dama soxla benn koppi sama ekstere de nesaas."
],
[
"How much does it cost?",
"Combien ça coûte ?",
"Ñaata lay jar ?"
],
[
"How long does it take?",
"Combien de temps ça prend ?",
"Ñaata dir lay jël ?"
],
[
"When can I come back to collect it?",
"Quand puis-je revenir le récupérer ?",
"Kañ laa mën a dellusi ngir jël ko ?"
],
[
"Is my file complete?",
"Mon dossier est-il complet ?",
"Ndax sama dosiye bi mat na ?"
],
[
"A document is missing.",
"Il manque un document.",
"Am na benn kayit bu ñàkk."
],
[
"I need a photo for the file.",
"Il faut une photo pour le dossier.",
"Dafa laaj benn nataal ngir dosiye bi."
],
[
"Please fill in this form.",
"Remplissez ce formulaire, s'il vous plaît.",
"Feesalal fiis bii, bu la neexee."
],
[
"Where can I make photocopies?",
"Où puis-je faire des photocopies ?",
"Fan laa mën a defaree fotokoppi ?"
],
[
"I lost my identity card. How can I get a new one?",
"J'ai perdu ma carte d'identité. Comment en obtenir une nouvelle ?",
"Rëcc naa sama kart didantite. Naka laa mën a amee beneen ?"
],
[
"I need a police report for the declaration of loss.",
"Il me faut un récépissé de déclaration de perte.",
"Dama soxla benn resipise ngir seedeel ne rëcc naa ko."
],
[
"My passport expires in three months. Can I renew it?",
"Mon passeport expire dans trois mois. Je peux le renouveler ?",
"Sama paspoor dina jeex ci ñetti weer. Ndax mën naa ko yeesal ?"
],
[
"There is a mistake in the spelling of my name.",
"Il y a une erreur dans l'orthographe de mon nom.",
"Am na njuumte ci mbindum sama tur."
],
[
"I would like to register my business.",
"Je voudrais enregistrer mon entreprise.",
"Dama bëgg a bindloo sama liggéeyukaay."
],
[
"I need a certificate of residence for my visa file.",
"Il me faut un certificat de résidence pour mon dossier de visa.",
"Dama soxla sertifikaa de residãas ngir sama dosiye wisa."
],
[
"Can someone else collect the document for me?",
"Quelqu'un d'autre peut récupérer le document pour moi ?",
"Ndax keneen mën na ma jëlal kayit bi ?"
],
[
"I would like to make a complaint about the delay.",
"Je voudrais faire une réclamation à propos du retard.",
"Dama bëgg a joxe benn laaj-ubbi ci yeex bi."
],
[
"Please give me a stamped receipt as proof.",
"Donnez-moi un reçu tamponné comme preuve.",
"Jox ma benn resi bu ñu tàmpoŋe ngir seede."
],
[
"I will come back tomorrow with the missing document.",
"Je reviens demain avec le document manquant.",
"Dinaa dellusi suba ak kayit bi ñàkk."
]
];
  var DIA = [
[
"B",
"Good morning. I would like to make an identity card.",
"Bonjour. Je voudrais faire une carte d'identité.",
"Jàmm nga fanaan. Dama bëgg a defar kart didantite."
],
[
"A",
"Do you have your birth certificate?",
"Vous avez votre extrait de naissance ?",
"Ndax am nga sa ekstere de nesaas ?"
],
[
"B",
"Yes, here it is. I also have two photos.",
"Oui, le voici. J'ai aussi deux photos.",
"Waaw, mii ngi nii. Am naa itam ñaari nataal."
],
[
"A",
"Good. Please fill in this form.",
"Bien. Remplissez ce formulaire, s'il vous plaît.",
"Baax na. Feesalal fiis bii, bu la neexee."
],
[
"B",
"Here it is. How much does it cost?",
"Le voici. Combien ça coûte ?",
"Mii ngi nii. Ñaata lay jar ?"
],
[
"A",
"It is ten thousand francs. You will get a receipt.",
"C'est dix mille francs. Vous aurez un reçu.",
"Fukki junni farã la. Dinga am benn resi."
],
[
"B",
"When can I collect the card?",
"Quand puis-je récupérer la carte ?",
"Kañ laa mën a jël kart bi ?"
],
[
"A",
"Come back in three weeks with this receipt.",
"Revenez dans trois semaines avec ce reçu.",
"Dellusil ci ñetti ayu-bés ak resi bii."
]
];
  var QZ = [
[
"I need an identity ___.",
[
"card",
"cart",
"car"
],
"« identity card » = carte d'identité."
],
[
"Please fill in this ___.",
[
"form",
"from",
"farm"
],
"« form » = formulaire."
],
[
"I have an ___ at ten o'clock.",
[
"appointment",
"appoint",
"apartment"
],
"« appointment » = rendez-vous."
]
];
  if (G.some(function (t) { return t.id === "admin"; })) return;
  G.push({
    id: "admin", niveau: 2, title: "N2 · 🪪 Administration",
    vocab: VOC.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }),
    dialogue: DIA.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }),
    quiz: QZ.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; })
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-administration.js",e);}

try{
/* ---- diisoo-mission-administration.js ---- */
/* diisoo-mission-administration.js v1 : Mission « Faire ma carte d'identité »
   L'app joue l'agent de l'état civil (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Administration ».
   Bouton place en haut du theme « Administration » (Anglais). Essai : https://diisoo.sn/?mission=administration */
(function () {
  "use strict";
  if (window.DiisooMissionAdministration) return;
  var Q = [
    { q: "Good morning. How can I help you?", kw: /identity|card|passport|document|certificate|need|want|make|register|help|id/i, m: "I would like to make an identity card." },
    { q: "Do you have your birth certificate?", kw: /yes|no|birth|certificate|here|have|copy|photo/i, m: "Yes, here it is. I also have two photos." },
    { q: "Please fill in this form. Do you have a pen?", kw: /yes|no|pen|form|thank|please|can|borrow|fill|sure/i, m: "Yes, I have a pen. Thank you." },
    { q: "It costs ten thousand francs. Do you want a receipt?", kw: /yes|please|receipt|no|thank|ok|okay|sure/i, m: "Yes, please. I need a receipt." },
    { q: "When do you want to come back for the card?", kw: /week|weeks|day|days|month|tomorrow|monday|friday|three|two|\d|when|next/i, m: "I will come back in three weeks." }
  ];




  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mad{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mad .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mad .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mad .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mad button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mad .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mad .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mad .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mad .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mad .m.on{animation:mfp 1s infinite}@keyframes mfp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mad .ok{color:#25D366}#mad .or{color:#FFAA3C}" +
    "#mad-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mad-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mad")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mad";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🪪 Faire ma carte d’identité · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mf-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mf-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mf-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mf-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mf-skip" type="button">Passer</button>' +
        '<button class="b3" id="mf-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mf-r"), mic = document.getElementById("mf-mic"), nx = document.getElementById("mf-next");
      document.getElementById("mf-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mf-x").onclick = function () { o.remove(); };
      document.getElementById("mf-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["administration"]) BADGES["administration"] = { icon: "🪪", label: "Administration", desc: "Carte d'identité demandée à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("administration"); } catch (e) {}
      }
      noter("mission_administration", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🪪 Mission administration</div><div class="q">' + (ok ? "Dossier accepté ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Administration » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Famille et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mf-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mf-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mf-x2" type="button">Fermer</button>';
      document.getElementById("mf-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mf-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mf-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma démarche administrative en anglais sur Diisoo 🪪 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComadnent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mad-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "admin") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mad-btn";
    b.innerHTML = '<span style="font-size:22px">🪪</span><span>Mission : faire ma carte d’identité<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionAdministration = { ouvrir: ouvrir };
  if (/[?&]mission=administration/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-administration.js",e);}

try{
/* ---- diisoo-etudes.js ---- */
/* diisoo-etudes.js v1 : theme « Études & école » (30 phrases, 1 dialogue, 3 questions), niveau N2.
   Wolof relu par Babacar. Desactivable : ?etudes=0 */
(function () {
  "use strict";
  if (window.__diisooEtudes || /[?&]etudes=0/.test(location.search)) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooEtudes = true;
  var VOC = [
[
"I am a student.",
"Je suis étudiant.",
"Ndongo laa."
],
[
"What is your school?",
"Quelle est votre école ?",
"Ban la sa daara ?"
],
[
"I study at the university.",
"J'étudie à l'université.",
"Maa ngi jàng ci iniwersite bi."
],
[
"What time does the class start?",
"À quelle heure commence le cours ?",
"Ban waxtu la kuur bi di tàmbali ?"
],
[
"Where is the classroom?",
"Où est la salle de classe ?",
"Fan la néegu njàng bi nekk ?"
],
[
"I do not understand.",
"Je ne comprends pas.",
"Dégguma ko."
],
[
"Can you repeat, please?",
"Vous pouvez répéter, s'il vous plaît ?",
"Ndax mën nga ko waxaat, bu la neexee ?"
],
[
"I need a notebook and a pen.",
"Il me faut un cahier et un stylo.",
"Dama soxla kaye ak bik."
],
[
"The teacher is very good.",
"Le professeur est très bon.",
"Jàngalekat bi baax na lool."
],
[
"I have homework today.",
"J'ai des devoirs aujourd'hui.",
"Am naa liggéeyu kër tey."
],
[
"When is the exam?",
"Quand est l'examen ?",
"Kañ la ekzaameŋ bi ?"
],
[
"I am preparing for the exam.",
"Je prépare l'examen.",
"Maa ngi waajal ekzaameŋ bi."
],
[
"I passed the exam.",
"J'ai réussi l'examen.",
"Jàll naa ekzaameŋ bi."
],
[
"I failed the exam. I will try again.",
"J'ai échoué à l'examen. Je vais réessayer.",
"Daanoo naa ci ekzaameŋ bi. Dinaa ko jéemaat."
],
[
"What are my marks?",
"Quelles sont mes notes ?",
"Yan not laa am ?"
],
[
"Can I borrow your notes?",
"Je peux emprunter vos notes ?",
"Ndax mën naa ab say not ?"
],
[
"We have a group project.",
"Nous avons un projet de groupe.",
"Am nanu benn porose bu mbooloo."
],
[
"I want to register for the next year.",
"Je veux m'inscrire pour l'année prochaine.",
"Dama bëgg a bindu ngir at mi di ñëw."
],
[
"How much are the school fees?",
"Combien sont les frais de scolarité ?",
"Ñaata la fere daara bi ?"
],
[
"Can I pay the fees in two instalments?",
"Je peux payer les frais en deux fois ?",
"Ndax mën naa fay fere bi ci ñaari yoon ?"
],
[
"I would like to apply for a scholarship.",
"Je voudrais demander une bourse d'études.",
"Dama bëgg a laaj benn bursu njàng."
],
[
"Which documents are required for the application?",
"Quels documents sont requis pour la candidature ?",
"Yan kayit lañu laaj ngir laaj bi ?"
],
[
"I need a recommendation letter from my teacher.",
"Il me faut une lettre de recommandation de mon professeur.",
"Dama soxla benn bataaxalu seede bu jóge ci sama jàngalekat."
],
[
"The deadline for applications is the thirty-first of December.",
"La date limite des candidatures est le trente et un décembre.",
"Bés bu mujj bi ngir laaj yi mooy fanweer ak benn ci desàmbar."
],
[
"I want to study abroad. What is the process?",
"Je veux étudier à l'étranger. Quelle est la démarche ?",
"Dama bëgg a jàng ci biti réew. Nan lañu ciy doxee ?"
],
[
"I need a language test result, like IELTS, for my application.",
"Il me faut un résultat de test de langue, comme l'IELTS, pour ma candidature.",
"Dama soxla njëlu testu làkk, mel ni IELTS, ngir sama laaj bi."
],
[
"I am writing my thesis on agriculture.",
"J'écris mon mémoire sur l'agriculture.",
"Maa ngi bind sama memwaar ci wàllu mbay."
],
[
"Can I follow the course online?",
"Je peux suivre le cours en ligne ?",
"Ndax mën naa topp kuur bi ci internet ?"
],
[
"I did not receive my grades. Can you check the system?",
"Je n'ai pas reçu mes notes. Vous pouvez vérifier le système ?",
"Jotuma samay not. Ndax mën nga xool sistem bi ?"
],
[
"I would like to change my course because it does not suit me.",
"Je voudrais changer de filière car elle ne me convient pas.",
"Dama bëgg a soppi sama filyeer ndax dëppoowul ak man."
]
];
  var DIA = [
[
"B",
"Good morning. I would like to register for the first year.",
"Bonjour. Je voudrais m'inscrire en première année.",
"Jàmm nga fanaan. Dama bëgg a bindu ci at mu njëkk mi."
],
[
"A",
"Of course. Which course do you want to study?",
"Bien sûr. Quelle filière voulez-vous suivre ?",
"Waaw kay. Ban filyeer nga bëgg a jàng ?"
],
[
"B",
"Computer science. What documents do I need?",
"L'informatique. De quels documents ai-je besoin ?",
"Informatik. Yan kayit laa soxla ?"
],
[
"A",
"Your baccalaureate certificate, your birth certificate and two photos.",
"Votre diplôme du baccalauréat, votre extrait de naissance et deux photos.",
"Sa diplomu bak, sa ekstere de nesaas ak ñaari nataal."
],
[
"B",
"How much are the school fees?",
"Combien sont les frais de scolarité ?",
"Ñaata la fere daara bi ?"
],
[
"A",
"Two hundred thousand francs per year. You can pay in two instalments.",
"Deux cent mille francs par an. Vous pouvez payer en deux fois.",
"Ñaar-téeméeri junni farã ci at mu nekk. Mën nga fay ci ñaari yoon."
],
[
"B",
"When do the classes start?",
"Quand commencent les cours ?",
"Kañ la kuur yi di tàmbali ?"
],
[
"A",
"On the first of October. Please come with your documents.",
"Le premier octobre. Venez avec vos documents, s'il vous plaît.",
"Ci benn oktoobar. Ñëwal ak say kayit, bu la neexee."
]
];
  var QZ = [
[
"I am a ___ at the university.",
[
"student",
"studio",
"study"
],
"« student » = étudiant."
],
[
"When is the ___?",
[
"exam",
"example",
"exact"
],
"« exam » = examen."
],
[
"I want to apply for a ___.",
[
"scholarship",
"school ship",
"scholar"
],
"« scholarship » = bourse d'études."
]
];
  if (G.some(function (t) { return t.id === "school"; })) return;
  G.push({
    id: "school", niveau: 2, title: "N2 · 🎓 Études & école",
    vocab: VOC.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }),
    dialogue: DIA.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }),
    quiz: QZ.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; })
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-etudes.js",e);}

try{
/* ---- diisoo-mission-etudes.js ---- */
/* diisoo-mission-etudes.js v1 : Mission « M'inscrire à l'université »
   L'app joue la secrétaire de l'université (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Études ».
   Bouton place en haut du theme « Études & école » (Anglais). Essai : https://diisoo.sn/?mission=etudes */
(function () {
  "use strict";
  if (window.DiisooMissionEtudes) return;
  var Q = [
    { q: "Good morning. How can I help you?", kw: /register|registration|enrol|enroll|study|course|year|university|want|need|help|inscri/i, m: "I would like to register for the first year." },
    { q: "Which course do you want to study?", kw: /computer|science|law|medicine|agriculture|business|english|economics|course|study|management|engineering/i, m: "I want to study computer science." },
    { q: "Do you have your baccalaureate certificate and two photos?", kw: /yes|no|here|have|photo|photos|certificate|baccalaureate|bac/i, m: "Yes, I have them here." },
    { q: "The school fees are two hundred thousand francs per year. Is that okay?", kw: /yes|no|ok|okay|pay|instal|two|expensive|can|fees|thousand/i, m: "Yes, can I pay in two instalments?" },
    { q: "The classes start on the first of October. Do you have any questions?", kw: /yes|no|when|where|what|thank|question|time|class|classes|schedule/i, m: "No, thank you. See you on the first of October." }
  ];




  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mel2{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mel2 .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mel2 .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mel2 .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mel2 button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mel2 .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mel2 .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mel2 .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mel2 .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mel2 .m.on{animation:mfp 1s infinite}@keyframes mfp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mel2 .ok{color:#25D366}#mel2 .or{color:#FFAA3C}" +
    "#mel2-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mel2-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mel2")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mel2";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🎓 M’inscrire à l’université · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mf-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mf-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mf-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mf-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mf-skip" type="button">Passer</button>' +
        '<button class="b3" id="mf-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mf-r"), mic = document.getElementById("mf-mic"), nx = document.getElementById("mf-next");
      document.getElementById("mf-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mf-x").onclick = function () { o.remove(); };
      document.getElementById("mf-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["etudes"]) BADGES["etudes"] = { icon: "🎓", label: "Études", desc: "Inscription universitaire réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("etudes"); } catch (e) {}
      }
      noter("mission_etudes", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🎓 Mission etudes</div><div class="q">' + (ok ? "Inscription validée ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Études » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Famille et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mf-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mf-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mf-x2" type="button">Fermer</button>';
      document.getElementById("mf-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mf-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mf-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon inscription à l'université en anglais sur Diisoo 🎓 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComel2nent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mel2-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "school") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mel2-btn";
    b.innerHTML = '<span style="font-size:22px">🎓</span><span>Mission : m’inscrire à l’université<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionEtudes = { ouvrir: ouvrir };
  if (/[?&]mission=etudes/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-etudes.js",e);}

try{
/* ---- diisoo-freelance.js ---- */
/* diisoo-freelance.js v1 : theme « Freelance & travail en ligne » (30 phrases, 1 dialogue, 3 questions), niveau N2.
   Wolof relu par Babacar. Desactivable : ?freelance=0 */
(function () {
  "use strict";
  if (window.__diisooFreelance || /[?&]freelance=0/.test(location.search)) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooFreelance = true;
  var VOC = [
[
"I work online.",
"Je travaille en ligne.",
"Maa ngi liggéey ci internet."
],
[
"I am a freelancer.",
"Je suis freelance.",
"Freelance laa."
],
[
"This is my CV.",
"Voici mon CV.",
"Sama CV mii ngi nii."
],
[
"I can send you my portfolio.",
"Je peux vous envoyer mon portfolio.",
"Mën naa la yónnee sama portfoliyo."
],
[
"What is your budget?",
"Quel est votre budget ?",
"Ban la sa budse ?"
],
[
"How many days do you need?",
"De combien de jours avez-vous besoin ?",
"Ñaata fan nga soxla ?"
],
[
"I will send it tomorrow.",
"Je l'envoie demain.",
"Dinaa ko yónnee suba."
],
[
"Can we talk on WhatsApp?",
"On peut parler sur WhatsApp ?",
"Ndax mën nanu waxtaan ci WhatsApp ?"
],
[
"Thank you for your message.",
"Merci pour votre message.",
"Jërëjëf ci sa mesaas."
],
[
"I do not have a computer today.",
"Je n'ai pas d'ordinateur aujourd'hui.",
"Amuma ordinatër tey."
],
[
"I have three years of experience.",
"J'ai trois ans d'expérience.",
"Am naa ñetti ati xam-xam ci liggéey bi."
],
[
"I speak French, English and Wolof.",
"Je parle français, anglais et wolof.",
"Maa ngi wax farañse, àngale ak wolof."
],
[
"Can we have a video call at ten?",
"On peut faire un appel vidéo à dix heures ?",
"Ndax mën nanu def woote wideo ci fukki waxtu ?"
],
[
"Can you hear me? My connection is not good.",
"Vous m'entendez ? Ma connexion n'est pas bonne.",
"Ndax dégg nga ma ? Sama koneksiyoŋ baaxul."
],
[
"What is the deadline for this project?",
"Quelle est la date limite de ce projet ?",
"Kañ la bés bu mujj bi ngir porose bii ?"
],
[
"I will send you a draft this evening.",
"Je vous envoie un brouillon ce soir.",
"Dinaa la yónnee benn bën-bën tey ci ngoon."
],
[
"Could you give me some feedback?",
"Pouvez-vous me donner votre avis ?",
"Ndax mën nga ma jox sa xalaat ?"
],
[
"I can make the changes you asked for.",
"Je peux faire les modifications demandées.",
"Mën naa def coppite yi nga laaj."
],
[
"My rate is fifty dollars per hour.",
"Mon tarif est de cinquante dollars de l'heure.",
"Sama njëg mooy juróom-fukki dolaar ci waxtu wu nekk."
],
[
"How would you like to pay me?",
"Comment souhaitez-vous me payer ?",
"Naka nga bëgg a ma fayee ?"
],
[
"I would like to sign a contract before I start.",
"Je voudrais signer un contrat avant de commencer.",
"Dama bëgg a siñe benn kontraa balaa ma di tàmbali."
],
[
"Can you pay half upfront and half after delivery?",
"Vous pouvez payer la moitié d'avance et la moitié à la livraison ?",
"Ndax mën nga fay genn-wàll gi ci njëlbéen te genn-wàll gi ci gannaaw yónnee bi ?"
],
[
"I receive payments by bank transfer or an online platform.",
"Je reçois les paiements par virement ou une plateforme en ligne.",
"Maa ngi jot fay yi ci wirmaa walla ci benn platfoorm ci internet."
],
[
"The payment has not arrived yet. Can you send the proof?",
"Le paiement n'est pas encore arrivé. Vous pouvez envoyer la preuve ?",
"Fay bi àggagul ba léegi. Ndax mën nga yónnee seede bi ?"
],
[
"I will need an invoice for my records.",
"J'aurai besoin d'une facture pour mes dossiers.",
"Dinaa soxla benn faktir ngir samay kayit."
],
[
"We can extend the deadline by three days if needed.",
"Nous pouvons prolonger le délai de trois jours si besoin.",
"Mën nanu yokk bés bu mujj bi ñetti fan su soxlawee."
],
[
"I apologise for the delay. I had a power cut.",
"Je m'excuse pour le retard. Il y a eu une coupure d'électricité.",
"Baal ma ci yeex bi. Am na benn dogu kuraŋ."
],
[
"Please keep the files confidential.",
"Merci de garder les fichiers confidentiels.",
"Bu leen neexee, denc leen dosiye yi ci kumpa."
],
[
"I am looking for long-term clients.",
"Je cherche des clients à long terme.",
"Maa ngi seet kliyaan yu di yàgg."
],
[
"Thank you for your trust. I look forward to working with you.",
"Merci pour votre confiance. J'ai hâte de travailler avec vous.",
"Jërëjëf ci sa wóolu. Maa ngi xaar liggéey ak yaw."
]
];
  var DIA = [
[
"B",
"Hello. I saw your portfolio. Can you design a website for my shop?",
"Bonjour. J'ai vu votre portfolio. Pouvez-vous créer un site pour ma boutique ?",
"Jàmm nga fanaan. Gis naa sa portfoliyo. Ndax mën nga defar benn sit ngir sama bitig ?"
],
[
"A",
"Yes, of course. How many pages do you need?",
"Oui, bien sûr. De combien de pages avez-vous besoin ?",
"Waaw kay. Ñaata pàj nga soxla ?"
],
[
"B",
"Five pages. How much will it cost?",
"Cinq pages. Combien ça coûtera ?",
"Juróomi pàj. Ñaata lay jar ?"
],
[
"A",
"It will cost three hundred dollars, and I need ten days.",
"Ça coûtera trois cents dollars, et il me faut dix jours.",
"Dina jar ñetti téeméeri dolaar, te dama soxla fukki fan."
],
[
"B",
"Can you do it in one week?",
"Vous pouvez le faire en une semaine ?",
"Ndax mën nga ko def ci benn ayu-bés ?"
],
[
"A",
"Yes, but the price will be three hundred and fifty dollars.",
"Oui, mais le prix sera de trois cent cinquante dollars.",
"Waaw, waaye njëg li dina nekk ñetti téeméeri dolaar ak juróom-fukk."
],
[
"B",
"Okay. Can I pay half now and half at the end?",
"D'accord. Je peux payer la moitié maintenant et la moitié à la fin ?",
"Waaw. Ndax mën naa fay genn-wàll léegi te genn-wàll bi ci mujj ?"
],
[
"A",
"Yes, I will send you the contract and my invoice today.",
"Oui, je vous envoie le contrat et ma facture aujourd'hui.",
"Waaw, dinaa la yónnee kontraa bi ak sama faktir tey."
]
];
  var QZ = [
[
"I am a ___. I work online.",
[
"freelancer",
"free land",
"fridge"
],
"« freelancer » = travailleur indépendant."
],
[
"What is the ___ for this project?",
[
"deadline",
"deadly",
"dead line up"
],
"« deadline » = date limite."
],
[
"Can you send me an ___ for my records?",
[
"invoice",
"invite",
"involve"
],
"« invoice » = facture."
]
];
  if (G.some(function (t) { return t.id === "freelance"; })) return;
  G.push({
    id: "freelance", niveau: 2, title: "N2 · 💻 Freelance & travail en ligne",
    vocab: VOC.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }),
    dialogue: DIA.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }),
    quiz: QZ.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; })
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-freelance.js",e);}

try{
/* ---- diisoo-mission-freelance.js ---- */
/* diisoo-mission-freelance.js v1 : Mission « Négocier avec un client »
   L'app joue un client étranger (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Freelance ».
   Bouton place en haut du theme « Freelance & travail en ligne » (Anglais). Essai : https://diisoo.sn/?mission=freelance */
(function () {
  "use strict";
  if (window.DiisooMissionFreelance) return;
  var Q = [
    { q: "Hello. I saw your portfolio. Can you design a website for my shop?", kw: /yes|sure|of course|website|design|shop|pages|can|need|portfolio/i, m: "Yes, of course. How many pages do you need?" },
    { q: "I need five pages. How long will it take?", kw: /day|days|week|weeks|ten|five|seven|time|take|about|\d/i, m: "It will take about ten days." },
    { q: "How much will it cost?", kw: /dollars|\d|hundred|price|cost|francs|euro|thousand/i, m: "It will cost three hundred dollars." },
    { q: "Can I pay half now and half at the end?", kw: /yes|no|half|contract|invoice|ok|okay|sure|pay|deposit|payment/i, m: "Yes, I will send you the contract and my invoice." },
    { q: "Great. When can you send me the first draft?", kw: /tomorrow|monday|friday|week|days|day|evening|tonight|next|draft|send|\d/i, m: "I will send you the first draft in three days." }
  ];




  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mfl{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mfl .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mfl .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mfl .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mfl button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mfl .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mfl .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mfl .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mfl .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mfl .m.on{animation:mfp 1s infinite}@keyframes mfp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mfl .ok{color:#25D366}#mfl .or{color:#FFAA3C}" +
    "#mfl-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mfl-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mfl")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mfl";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">💻 Négocier avec un client · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mf-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mf-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mf-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mf-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mf-skip" type="button">Passer</button>' +
        '<button class="b3" id="mf-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mf-r"), mic = document.getElementById("mf-mic"), nx = document.getElementById("mf-next");
      document.getElementById("mf-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mf-x").onclick = function () { o.remove(); };
      document.getElementById("mf-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["freelance"]) BADGES["freelance"] = { icon: "💻", label: "Freelance", desc: "Négociation avec un client étranger réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("freelance"); } catch (e) {}
      }
      noter("mission_freelance", score + "/" + Q.length);
      o.innerHTML = '<div class="k">💻 Mission freelance</div><div class="q">' + (ok ? "Contrat signé ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Freelance » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Famille et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mf-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mf-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mf-x2" type="button">Fermer</button>';
      document.getElementById("mf-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mf-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mf-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma négociation avec un client en anglais sur Diisoo 💻 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComflnent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mfl-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "freelance") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mfl-btn";
    b.innerHTML = '<span style="font-size:22px">💻</span><span>Mission : négocier avec un client<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionFreelance = { ouvrir: ouvrir };
  if (/[?&]mission=freelance/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-freelance.js",e);}

try{
/* ---- diisoo-fetes.js ---- */
/* diisoo-fetes.js v1 : theme « Fêtes & événements » (30 phrases, 1 dialogue, 3 questions), niveau N2.
   Wolof relu par Babacar. Desactivable : ?fetes=0 */
(function () {
  "use strict";
  if (window.__diisooFetes || /[?&]fetes=0/.test(location.search)) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooFetes = true;
  var VOC = [
[
"Happy birthday!",
"Joyeux anniversaire !",
"Bésu juddu bu neex !"
],
[
"Happy new year!",
"Bonne année !",
"Dewenati !"
],
[
"Happy Tabaski!",
"Bonne Tabaski !",
"Dewenati !"
],
[
"Happy Korité!",
"Bonne Korité !",
"Korite bu neex !"
],
[
"Congratulations!",
"Félicitations !",
"Ndokkeel !"
],
[
"Thank you for the invitation.",
"Merci pour l'invitation.",
"Jërëjëf ci woote bi."
],
[
"What time does the party start?",
"À quelle heure commence la fête ?",
"Ban waxtu la xew bi di tàmbali ?"
],
[
"Where is the ceremony?",
"Où est la cérémonie ?",
"Fan la xew bi nekk ?"
],
[
"This is a gift for you.",
"Voici un cadeau pour vous.",
"Kado bii ngir yaw la."
],
[
"The food is delicious.",
"La nourriture est délicieuse.",
"Ñam bi neex na lool."
],
[
"We celebrate Tabaski with the whole family.",
"Nous fêtons la Tabaski avec toute la famille.",
"Danuy màggal Tabaski ak njaboot gi yépp."
],
[
"I am buying a sheep for Tabaski.",
"J'achète un mouton pour la Tabaski.",
"Maa ngi jënd xar ngir Tabaski."
],
[
"The sheep is very expensive this year.",
"Le mouton est très cher cette année.",
"Xar mi dafa seer lool at mii."
],
[
"I am going to the Magal in Touba.",
"Je vais au Magal à Touba.",
"Maa ngi dem Magal ci Tuubaa."
],
[
"Many people travel for the Magal.",
"Beaucoup de gens voyagent pour le Magal.",
"Nit ñu bari dañuy tukki ngir Magal."
],
[
"The wedding is on Saturday.",
"Le mariage est samedi.",
"Céet bi mooy gaawu."
],
[
"The baptism of the baby is on Friday.",
"Le baptême du bébé est vendredi.",
"Ngénte li mooy àjjuma."
],
[
"Where can I rent chairs and tents?",
"Où puis-je louer des chaises et des bâches ?",
"Fan laa mën a luwaasee ay siis ak ay baas ?"
],
[
"What should I wear to the ceremony?",
"Que dois-je porter pour la cérémonie ?",
"Lan laa war a sol ci xew bi ?"
],
[
"I will bring a gift for the family.",
"J'apporterai un cadeau pour la famille.",
"Dinaa indi kado ngir njaboot gi."
],
[
"We would be honoured if you could attend our wedding.",
"Nous serions honorés de votre présence à notre mariage.",
"Dinanu bég lool su ngeen ñëwee ci sunu céet."
],
[
"Please confirm your attendance before Friday.",
"Merci de confirmer votre présence avant vendredi.",
"Bu leen neexee, dëggal leen ne dingeen ñëw balaa àjjuma."
],
[
"I would like to hire a caterer for two hundred guests.",
"Je voudrais engager un traiteur pour deux cents invités.",
"Dama bëgg a jël benn toggkat ngir ñaar-téeméeri gan."
],
[
"How much do you charge for the decoration and the sound system?",
"Combien facturez-vous pour la décoration et la sonorisation ?",
"Ñaata ngeen di jël ngir dekorasiyoŋ bi ak sonorisaasiyoŋ bi ?"
],
[
"We are collecting contributions for the ceremony.",
"Nous collectons des cotisations pour la cérémonie.",
"Danuy dajale ndimbal ngir xew bi."
],
[
"I am sorry for your loss. May God give you strength.",
"Mes condoléances. Que Dieu vous donne de la force.",
"Njaal ! Yàlla na la Yàlla jox muñ."
],
[
"I could not attend because I was travelling. Please forgive me.",
"Je n'ai pas pu venir car j'étais en voyage. Pardonnez-moi.",
"Mënuma woon a ñëw ndax maa ngi woon ci tukki. Baal ma."
],
[
"We will take photos and a video of the event.",
"Nous prendrons des photos et une vidéo de l'événement.",
"Dinanu jël ay nataal ak wideo ci xew bi."
],
[
"May God grant us many more years together.",
"Que Dieu nous accorde encore de nombreuses années ensemble.",
"Yàlla na nu Yàlla yokk at yu bari ci ànd."
],
[
"Thank you all for coming. It means a lot to us.",
"Merci à tous d'être venus. Cela compte beaucoup pour nous.",
"Jërëjëf ci yéen ñépp ci seen ñëw. Am na solo lool ci nun."
]
];
  var DIA = [
[
"B",
"Hello. I am looking for a sheep for Tabaski.",
"Bonjour. Je cherche un mouton pour la Tabaski.",
"Jàmm nga fanaan. Maa ngi seet xar ngir Tabaski."
],
[
"A",
"Welcome. I have very good sheep. What is your budget?",
"Bienvenue. J'ai de très beaux moutons. Quel est votre budget ?",
"Dalal ak jàmm. Am naa xar yu baax lool. Ban la sa budse ?"
],
[
"B",
"About one hundred and fifty thousand francs.",
"Environ cent cinquante mille francs.",
"Lu tollu ci téeméeri junni ak juróom-fukki junni farã."
],
[
"A",
"This one is healthy and strong. It costs one hundred and eighty thousand.",
"Celui-ci est en bonne santé et fort. Il coûte cent quatre-vingt mille.",
"Bii dafa wér te am doole. Téeméeri junni ak juróom-ñett-fukki junni la."
],
[
"B",
"It is too expensive. Can you lower the price?",
"C'est trop cher. Vous pouvez baisser le prix ?",
"Dafa seer lool. Ndax mën nga wàññi njëg li ?"
],
[
"A",
"For you, one hundred and sixty thousand, and I help you load it.",
"Pour vous, cent soixante mille, et je vous aide à le charger.",
"Ngir yaw, téeméeri junni ak juróom-benn-fukki junni, te dinaa la dimbali nga yëkkati ko."
],
[
"B",
"Okay. I will take it. Can I pay with Wave?",
"D'accord. Je le prends. Je peux payer avec Wave ?",
"Waaw. Dinaa ko jël. Ndax mën naa fay ak Wave ?"
],
[
"A",
"Yes. Happy Tabaski to you and your family!",
"Oui. Bonne Tabaski à vous et à votre famille !",
"Waaw. Tabaski bu neex ci yaw ak sa njaboot !"
]
];
  var QZ = [
[
"___ birthday!",
[
"Happy",
"Hippy",
"Happily"
],
"« Happy birthday » = joyeux anniversaire."
],
[
"Thank you for the ___.",
[
"invitation",
"invention",
"investigation"
],
"« invitation » = invitation."
],
[
"I am buying a ___ for Tabaski.",
[
"sheep",
"ship",
"sleep"
],
"« sheep » = mouton."
]
];
  if (G.some(function (t) { return t.id === "fetes"; })) return;
  G.push({
    id: "fetes", niveau: 2, title: "N2 · 🐑 Fêtes & événements",
    vocab: VOC.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }),
    dialogue: DIA.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }),
    quiz: QZ.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; })
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-fetes.js",e);}

try{
/* ---- diisoo-mission-fetes.js ---- */
/* diisoo-mission-fetes.js v1 : Mission « Acheter mon mouton »
   L'app joue le vendeur de moutons (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Fêtes ».
   Bouton place en haut du theme « Fêtes & événements » (Anglais). Essai : https://diisoo.sn/?mission=fetes */
(function () {
  "use strict";
  if (window.DiisooMissionFetes) return;
  var Q = [
    { q: "Hello. What are you looking for?", kw: /sheep|ram|tabaski|buy|looking|need|want|animal|goat/i, m: "I am looking for a sheep for Tabaski." },
    { q: "What is your budget?", kw: /thousand|francs|\d|hundred|budget|about|around|fifty|sixty/i, m: "My budget is about one hundred and fifty thousand francs." },
    { q: "This one is healthy and strong. It costs one hundred and eighty thousand.", kw: /lower|price|expensive|cheaper|less|discount|too|better|reduce/i, m: "It is too expensive. Can you lower the price?" },
    { q: "Okay, one hundred and sixty thousand. Do you want to take it?", kw: /yes|take|ok|okay|deal|sure|buy|fine|agree/i, m: "Yes, I will take it." },
    { q: "How do you want to pay?", kw: /wave|orange|cash|money|mobile|pay|card|transfer/i, m: "I will pay with Wave." }
  ];




  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mft{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mft .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mft .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mft .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mft button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mft .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mft .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mft .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mft .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mft .m.on{animation:mfp 1s infinite}@keyframes mfp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mft .ok{color:#25D366}#mft .or{color:#FFAA3C}" +
    "#mft-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mft-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mft")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mft";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🐑 Acheter mon mouton · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mf-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mf-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mf-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mf-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mf-skip" type="button">Passer</button>' +
        '<button class="b3" id="mf-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mf-r"), mic = document.getElementById("mf-mic"), nx = document.getElementById("mf-next");
      document.getElementById("mf-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mf-x").onclick = function () { o.remove(); };
      document.getElementById("mf-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["fetes"]) BADGES["fetes"] = { icon: "🐑", label: "Fêtes", desc: "Achat du mouton de Tabaski réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("fetes"); } catch (e) {}
      }
      noter("mission_fetes", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🐑 Mission fetes</div><div class="q">' + (ok ? "Tabaski préparée ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Fêtes » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Famille et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mf-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mf-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mf-x2" type="button">Fermer</button>';
      document.getElementById("mf-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mf-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mf-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon achat de mouton en anglais sur Diisoo 🐑 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComftnent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mft-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "fetes") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mft-btn";
    b.innerHTML = '<span style="font-size:22px">🐑</span><span>Mission : acheter mon mouton<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionFetes = { ouvrir: ouvrir };
  if (/[?&]mission=fetes/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-fetes.js",e);}

try{
/* ---- diisoo-factures.js ---- */
/* diisoo-factures.js v1 : theme « Eau, électricité & factures » (30 phrases, 1 dialogue, 3 questions), niveau N2.
   Wolof relu par Babacar. Desactivable : ?factures=0 */
(function () {
  "use strict";
  if (window.__diisooFactures || /[?&]factures=0/.test(location.search)) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooFactures = true;
  var VOC = [
[
"There is no electricity.",
"Il n'y a pas d'électricité.",
"Kuraŋ amul."
],
[
"There is no water.",
"Il n'y a pas d'eau.",
"Ndox amul."
],
[
"When will the power come back?",
"Quand le courant va-t-il revenir ?",
"Kañ la kuraŋ bi di dellusi ?"
],
[
"This is my electricity bill.",
"Voici ma facture d'électricité.",
"Sama faktir kuraŋ mii ngi nii."
],
[
"How much is the bill?",
"Combien est la facture ?",
"Ñaata la faktir bi ?"
],
[
"I want to pay my bill.",
"Je veux payer ma facture.",
"Dama bëgg a fay sama faktir."
],
[
"I want to buy electricity credit.",
"Je veux acheter du crédit d'électricité.",
"Dama bëgg a jënd kredi kuraŋ."
],
[
"The tap is leaking.",
"Le robinet fuit.",
"Robine bi dafay tuuru."
],
[
"The light is not working.",
"La lumière ne marche pas.",
"Làmp bi du dox."
],
[
"Please come quickly.",
"Venez vite, s'il vous plaît.",
"Ñëwal gaaw, bu la neexee."
],
[
"Where is the meter?",
"Où est le compteur ?",
"Fan la komteer bi nekk ?"
],
[
"My meter is not working.",
"Mon compteur ne marche pas.",
"Sama komteer du dox."
],
[
"The prepaid meter shows an error.",
"Le compteur prépayé affiche une erreur.",
"Komteer bu Woyofal bi dafay wone njuumte."
],
[
"Can I pay my bill with Wave?",
"Je peux payer ma facture avec Wave ?",
"Ndax mën naa fay sama faktir ak Wave ?"
],
[
"The power cut lasted two days.",
"La coupure a duré deux jours.",
"Dogug kuraŋ bi yàgg na ñaari fan."
],
[
"The water is dirty.",
"L'eau est sale.",
"Ndox mi dafa tilim."
],
[
"The water pressure is very low.",
"La pression de l'eau est très faible.",
"Doole ndox mi dafa néew lool."
],
[
"When will the technician come?",
"Quand le technicien viendra-t-il ?",
"Kañ la teknisiyeŋ bi di ñëw ?"
],
[
"I want to change the name on the contract.",
"Je veux changer le nom sur le contrat.",
"Dama bëgg a soppi tur bi ci kontraa bi."
],
[
"I need a copy of my last bill.",
"Il me faut une copie de ma dernière facture.",
"Dama soxla benn koppi sama faktir bu mujj bi."
],
[
"My bill is much higher than usual. I would like it checked.",
"Ma facture est beaucoup plus élevée que d'habitude. Je voudrais qu'on la vérifie.",
"Sama faktir dafa ëpp lool ni mu daan mel. Dama bëgg ñu xool ko."
],
[
"I paid my bill, but the power was cut.",
"J'ai payé ma facture, mais le courant a été coupé.",
"Fay naa sama faktir, waaye kuraŋ bi dañu ko dog."
],
[
"I would like to make a complaint about the repeated cuts.",
"Je voudrais faire une réclamation pour les coupures répétées.",
"Dama bëgg a joxe benn laaj-ubbi ci dogug kuraŋ yi di faral di am."
],
[
"The voltage is unstable and it damaged my fridge.",
"La tension est instable et elle a abîmé mon frigo.",
"Kuraŋ bi dafay dem di dikk te yàq na sama firigo."
],
[
"I would like to apply for a new connection.",
"Je voudrais demander un nouveau branchement.",
"Dama bëgg a laaj benn lëkkale bu bees."
],
[
"How much is the connection fee, and how long does it take?",
"Combien coûtent les frais de branchement, et combien de temps ça prend ?",
"Ñaata la fere lëkkale bi te ñaata dir lay jël ?"
],
[
"Please give me a payment receipt as proof.",
"Donnez-moi un reçu de paiement comme preuve.",
"Jox ma benn resi fay ngir seede."
],
[
"Can you set up an instalment plan for the unpaid bill?",
"Vous pouvez mettre en place un échéancier pour la facture impayée ?",
"Ndax mën nga ma defaral benn pexem fay ci ay wàll ngir faktir bi ñu fayagul ?"
],
[
"I will switch to a solar panel to reduce the cost.",
"Je vais passer au panneau solaire pour réduire le coût.",
"Dinaa jëfandikoo pano soleer ngir wàññi njëg li."
],
[
"Please send me a message when the service is restored.",
"Envoyez-moi un message quand le service sera rétabli.",
"Yónneel ma benn mesaas bu kuraŋ bi dellusee."
]
];
  var DIA = [
[
"B",
"Hello. There is no electricity in my house since this morning.",
"Bonjour. Il n'y a pas d'électricité chez moi depuis ce matin.",
"Jàmm nga fanaan. Kuraŋ amul ci sama kër li dale suba."
],
[
"A",
"I am sorry. What is your meter number?",
"Je suis désolé. Quel est votre numéro de compteur ?",
"Baal ma. Ban la nimero sa komteer ?"
],
[
"B",
"It is one two three four five six. I live in Thiès, Mbour 2.",
"C'est le 123456. J'habite à Thiès, Mbour 2.",
"Mooy benn ñaar ñett ñeent juróom juróom-benn. Maa ngi dëkk Cees, Mbuur 2."
],
[
"A",
"We know about the problem. A technician is on the way.",
"Nous connaissons le problème. Un technicien est en route.",
"Xam nanu jafe-jafe bi. Benn teknisiyeŋ mu ngi ci yoon."
],
[
"B",
"How long will it take?",
"Combien de temps ça va prendre ?",
"Ñaata waxtu lay jël ?"
],
[
"A",
"About two hours. The power will be back this afternoon.",
"Environ deux heures. Le courant sera de retour cet après-midi.",
"Lu tollu ci ñaari waxtu. Kuraŋ bi dina dellusi ci ngoon gi."
],
[
"B",
"Can you send me a message when it is fixed?",
"Vous pouvez m'envoyer un message quand c'est réparé ?",
"Ndax mën nga ma yónnee benn mesaas bu ñu ko defaree ?"
],
[
"A",
"Yes, we will send you a message. Thank you for your patience.",
"Oui, nous vous enverrons un message. Merci de votre patience.",
"Waaw, dinanu la yónnee benn mesaas. Jërëjëf ci sa muñ."
]
];
  var QZ = [
[
"There is no ___ in my house.",
[
"electricity",
"electric city",
"elect"
],
"« electricity » = électricité."
],
[
"I want to pay my ___.",
[
"bill",
"bell",
"bull"
],
"« bill » = facture."
],
[
"The ___ is not working.",
[
"meter",
"metre of",
"meteor"
],
"« meter » = compteur."
]
];
  if (G.some(function (t) { return t.id === "bills"; })) return;
  G.push({
    id: "bills", niveau: 2, title: "N2 · 💡 Eau, électricité & factures",
    vocab: VOC.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }),
    dialogue: DIA.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }),
    quiz: QZ.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; })
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-factures.js",e);}

try{
/* ---- diisoo-mission-factures.js ---- */
/* diisoo-mission-factures.js v1 : Mission « Signaler une panne »
   L'app joue l'agent du service client (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Factures ».
   Bouton place en haut du theme « Eau, électricité & factures » (Anglais). Essai : https://diisoo.sn/?mission=factures */
(function () {
  "use strict";
  if (window.DiisooMissionFactures) return;
  var Q = [
    { q: "Hello. How can I help you?", kw: /electricity|power|water|light|no|problem|bill|cut|help|house|meter/i, m: "There is no electricity in my house since this morning." },
    { q: "I am sorry. What is your meter number?", kw: /\d|one|two|three|four|five|six|number|meter|it is/i, m: "My meter number is one two three four five six." },
    { q: "Where do you live?", kw: /thies|thiès|dakar|live|mbour|house|street|district|quarter|near/i, m: "I live in Thiès, in the Mbour 2 district." },
    { q: "A technician will come this afternoon. Is someone at home?", kw: /yes|no|home|someone|wife|brother|here|will|be|afternoon|thank/i, m: "Yes, someone will be at home. Thank you." },
    { q: "Do you want a message when the power is back?", kw: /yes|please|message|sms|no|thank|sure|send/i, m: "Yes, please send me a message." }
  ];




  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mfc{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mfc .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mfc .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mfc .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mfc button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mfc .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mfc .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mfc .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mfc .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mfc .m.on{animation:mfp 1s infinite}@keyframes mfp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mfc .ok{color:#25D366}#mfc .or{color:#FFAA3C}" +
    "#mfc-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mfc-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mfc")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mfc";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">💡 Signaler une panne · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mf-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mf-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mf-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mf-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mf-skip" type="button">Passer</button>' +
        '<button class="b3" id="mf-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mf-r"), mic = document.getElementById("mf-mic"), nx = document.getElementById("mf-next");
      document.getElementById("mf-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mf-x").onclick = function () { o.remove(); };
      document.getElementById("mf-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["factures"]) BADGES["factures"] = { icon: "💡", label: "Factures", desc: "Panne d'électricité signalée à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("factures"); } catch (e) {}
      }
      noter("mission_factures", score + "/" + Q.length);
      o.innerHTML = '<div class="k">💡 Mission factures</div><div class="q">' + (ok ? "Panne signalée ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Factures » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Famille et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mf-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mf-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mf-x2" type="button">Fermer</button>';
      document.getElementById("mf-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mf-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mf-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon signalement de panne en anglais sur Diisoo 💡 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComfcnent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mfc-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "bills") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mfc-btn";
    b.innerHTML = '<span style="font-size:22px">💡</span><span>Mission : signaler une panne<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionFactures = { ouvrir: ouvrir };
  if (/[?&]mission=factures/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-factures.js",e);}

try{
/* ---- diisoo-diaspora.js ---- */
/* diisoo-diaspora.js v1 : theme « Appeler la diaspora » (30 phrases, 1 dialogue, 3 questions), niveau N2.
   Wolof relu par Babacar. Desactivable : ?diaspora=0 */
(function () {
  "use strict";
  if (window.__diisooDiaspora || /[?&]diaspora=0/.test(location.search)) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooDiaspora = true;
  var VOC = [
[
"Hello, how are you?",
"Bonjour, comment vas-tu ?",
"Na nga def, naka nga fanaanee ?"
],
[
"I am fine, thank God.",
"Je vais bien, grâce à Dieu.",
"Maa ngi fi, alxamdulilaay."
],
[
"How is the family?",
"Comment va la famille ?",
"Naka la njaboot gi def ?"
],
[
"I miss you.",
"Tu me manques.",
"Dama la nammoon."
],
[
"Can you hear me?",
"Tu m'entends ?",
"Ndax dégg nga ma ?"
],
[
"The network is bad.",
"Le réseau est mauvais.",
"Reeso bi baaxul."
],
[
"I will call you tomorrow.",
"Je t'appelle demain.",
"Dinaa la woo suba."
],
[
"Send me a photo, please.",
"Envoie-moi une photo, s'il te plaît.",
"Yónneel ma benn nataal, bu la neexee."
],
[
"How is the weather there?",
"Quel temps fait-il là-bas ?",
"Naka la jawu ji mel foofu ?"
],
[
"Take care of yourself.",
"Prends soin de toi.",
"Sàmmal sa bopp."
],
[
"Can we do a video call tonight?",
"On peut faire un appel vidéo ce soir ?",
"Ndax mën nanu def woote wideo tey ci guddi ?"
],
[
"What time is it there?",
"Quelle heure est-il là-bas ?",
"Ban waxtu la fa nekk ?"
],
[
"There is a time difference of two hours.",
"Il y a deux heures de décalage horaire.",
"Am na wuute waxtu bu tollu ci ñaari waxtu."
],
[
"How are mum and dad?",
"Comment vont maman et papa ?",
"Naka la yaay ak baay def ?"
],
[
"I am sending you some money for the family.",
"Je t'envoie de l'argent pour la famille.",
"Maa ngi lay yónnee xaalis ngir njaboot gi."
],
[
"Did you receive the money?",
"Tu as reçu l'argent ?",
"Ndax jot nga xaalis bi ?"
],
[
"When are you coming back home?",
"Quand rentres-tu à la maison ?",
"Kañ ngay dellusi kër ?"
],
[
"I am thinking of visiting in December.",
"Je pense venir en décembre.",
"Maa ngi xalaat a ñëw ci desàmbar."
],
[
"What do you want me to bring from here?",
"Qu'est-ce que tu veux que j'apporte d'ici ?",
"Lan nga bëgg ma indil la ?"
],
[
"The children are growing fast.",
"Les enfants grandissent vite.",
"Xale yi dañuy màgg bu baax."
],
[
"It is difficult to be far from the family, but I am working hard.",
"C'est difficile d'être loin de la famille, mais je travaille dur.",
"Jafe na ma lool sori njaboot gi, waaye maa ngi liggéey ak doole."
],
[
"I am sending a parcel with a friend who is travelling.",
"J'envoie un colis avec un ami qui voyage.",
"Maa ngi yónnee benn koli ci sama xarit biy tukki."
],
[
"The parcel contains clothes and some medicine.",
"Le colis contient des vêtements et des médicaments.",
"Koli bi am na ay yéere ak ay garab."
],
[
"Please pay the customs fee when you collect it.",
"Payez les frais de douane quand vous le récupérez.",
"Fayal fere duwaan bi bu ngeen ko jëlee."
],
[
"I would like to organise a family reunion this summer.",
"Je voudrais organiser des retrouvailles familiales cet été.",
"Dama bëgg a waajal benn ndajem njaboot ci jamonoy tàkk."
],
[
"I am saving money to build a house back home.",
"J'économise pour construire une maison au pays.",
"Maa ngi denc xaalis ngir tabax kër ci réew mi."
],
[
"I want to invest in a small business in Senegal.",
"Je veux investir dans un petit commerce au Sénégal.",
"Dama bëgg a dugal xaalis ci benn njaay mu ndaw ci Senegaal."
],
[
"Please send me the documents by WhatsApp, I need them for my visa.",
"Envoie-moi les documents par WhatsApp, j'en ai besoin pour mon visa.",
"Yónneel ma kayit yi ci WhatsApp, dama leen soxla ngir sama wisa."
],
[
"Please pray for me. I will do the same for you.",
"Prie pour moi. Je ferai de même pour toi.",
"Ñaanal ma. Dinaa la ñaanal itam."
],
[
"God willing, we will meet again soon.",
"Si Dieu le veut, nous nous reverrons bientôt.",
"Yàlla na nu gisaat ci lu gaaw."
]
];
  var DIA = [
[
"B",
"Hello mum, it is me. How are you?",
"Allô maman, c'est moi. Comment vas-tu ?",
"Alo yaay, man la. Naka nga fanaanee ?"
],
[
"A",
"My son! I am fine, thank God. How is your work?",
"Mon fils ! Je vais bien, grâce à Dieu. Comment va ton travail ?",
"Sama doom ! Maa ngi fi, sant Yàlla. Naka sa liggéey ?"
],
[
"B",
"It is going well. I am working hard. Is everyone well at home?",
"Ça va bien. Je travaille dur. Tout le monde va bien à la maison ?",
"Mu ngi dox bu baax. Maa ngi liggéey ak doole. Ndax ñépp ñu ngi ci jàmm ci kër ga ?"
],
[
"A",
"Yes, everyone is fine. Your sister asks about you.",
"Oui, tout le monde va bien. Ta sœur demande de tes nouvelles.",
"Waaw, ñépp ñu ngi ci jàmm. Sa rakk bu jigéen mu ngi laaj sa xibaar."
],
[
"B",
"I sent you some money this morning. Did you receive it?",
"Je t'ai envoyé de l'argent ce matin. Tu l'as reçu ?",
"Yónnee naa la xaalis ci suba. Ndax jot nga ko ?"
],
[
"A",
"Yes, I received it. Thank you, may God bless you.",
"Oui, je l'ai reçu. Merci, que Dieu te bénisse.",
"Waaw, jot naa ko. Jërëjëf, Yàlla na la Yàlla barkeel."
],
[
"B",
"I am planning to come home in December.",
"Je prévois de rentrer en décembre.",
"Maa ngi yëgle ne dinaa dellusi ci desàmbar."
],
[
"A",
"That is wonderful news. We will wait for you.",
"Quelle bonne nouvelle. Nous t'attendrons.",
"Xibaar bu rafet la. Dinanu la xaar."
]
];
  var QZ = [
[
"I ___ you.",
[
"miss",
"mess",
"mist"
],
"« I miss you » = tu me manques."
],
[
"Can you ___ me?",
[
"hear",
"here",
"heart"
],
"« hear » = entendre."
],
[
"I am sending ___ money for the family.",
[
"some",
"a",
"much of"
],
"« some money » = de l'argent."
]
];
  if (G.some(function (t) { return t.id === "diaspora"; })) return;
  G.push({
    id: "diaspora", niveau: 2, title: "N2 · 📞 Appeler la diaspora",
    vocab: VOC.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }),
    dialogue: DIA.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }),
    quiz: QZ.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; })
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-diaspora.js",e);}

try{
/* ---- diisoo-mission-diaspora.js ---- */
/* diisoo-mission-diaspora.js v1 : Mission « Appeler la famille »
   L'app joue le membre de la famille à l'étranger (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Diaspora ».
   Bouton place en haut du theme « Appeler la diaspora » (Anglais). Essai : https://diisoo.sn/?mission=diaspora */
(function () {
  "use strict";
  if (window.DiisooMissionDiaspora) return;
  var Q = [
    { q: "Hello, it is me. How are you?", kw: /fine|good|well|thank|god|hello|hi|and you|great|ok/i, m: "I am fine, thank God. And you?" },
    { q: "I am fine too. How is the family?", kw: /fine|good|well|everyone|family|all|mum|dad|mother|father|sister|brother|thank/i, m: "Everyone is fine. Your sister asks about you." },
    { q: "I sent you some money this morning. Did you receive it?", kw: /yes|no|received|receive|thank|got|money|not yet|blessed|god/i, m: "Yes, I received it. Thank you, may God bless you." },
    { q: "I am thinking of coming home in December.", kw: /december|wonderful|great|good|news|wait|happy|when|come|welcome|nice/i, m: "That is wonderful news. We will wait for you." },
    { q: "Do you want me to bring something from here?", kw: /yes|no|bring|please|clothes|medicine|gift|nothing|need|want|thank/i, m: "Yes, please bring some clothes. Thank you." }
  ];




  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mdp{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mdp .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mdp .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mdp .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mdp button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mdp .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mdp .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mdp .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mdp .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mdp .m.on{animation:mfp 1s infinite}@keyframes mfp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mdp .ok{color:#25D366}#mdp .or{color:#FFAA3C}" +
    "#mdp-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mdp-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mdp")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mdp";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">📞 Appeler la famille · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mf-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mf-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mf-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mf-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mf-skip" type="button">Passer</button>' +
        '<button class="b3" id="mf-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mf-r"), mic = document.getElementById("mf-mic"), nx = document.getElementById("mf-next");
      document.getElementById("mf-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mf-x").onclick = function () { o.remove(); };
      document.getElementById("mf-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["diaspora"]) BADGES["diaspora"] = { icon: "📞", label: "Diaspora", desc: "Appel avec la famille réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("diaspora"); } catch (e) {}
      }
      noter("mission_diaspora", score + "/" + Q.length);
      o.innerHTML = '<div class="k">📞 Mission diaspora</div><div class="q">' + (ok ? "Appel réussi ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Diaspora » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Famille et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mf-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mf-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mf-x2" type="button">Fermer</button>';
      document.getElementById("mf-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mf-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mf-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon appel avec la famille en anglais sur Diisoo 📞 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComdpnent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mdp-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "diaspora") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mdp-btn";
    b.innerHTML = '<span style="font-size:22px">📞</span><span>Mission : appeler la famille<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionDiaspora = { ouvrir: ouvrir };
  if (/[?&]mission=diaspora/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-diaspora.js",e);}

try{
/* ---- diisoo-son.js ---- */
/* diisoo-son.js v1 : sons de retour, comme les assistants vocaux
   - bip montant quand le micro s'ouvre (tu peux parler)
   - bip descendant quand le micro se ferme
   - petit carillon quand la reponse est juste (✅), son doux quand il faut reessayer
   Aucun fichier audio : les sons sont generes par le telephone. Desactiver : localStorage diisoo_son = "0". */
(function () {
  "use strict";

  var ctx = null;
  function actif() { try { return localStorage.getItem("diisoo_son") !== "0"; } catch (e) { return true; } }
  function audio() {
    if (ctx) return ctx;
    try { var C = window.AudioContext || window.webkitAudioContext; if (C) ctx = new C(); } catch (e) {}
    return ctx;
  }
  /* notes : [frequence Hz, debut s, duree s] */
  function jouer(notes, vol) {
    if (!actif()) return;
    var c = audio(); if (!c) return;
    try { if (c.state === "suspended") c.resume(); } catch (e) {}
    var t0 = c.currentTime + 0.01;
    notes.forEach(function (n) {
      try {
        var o = c.createOscillator(), g = c.createGain();
        o.type = "sine"; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, t0 + n[1]);
        g.gain.exponentialRampToValueAtTime(vol || 0.18, t0 + n[1] + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + n[1] + n[2]);
        o.connect(g); g.connect(c.destination);
        o.start(t0 + n[1]); o.stop(t0 + n[1] + n[2] + 0.05);
      } catch (e) {}
    });
  }
  var SONS = {
    ouvre: [[660, 0, 0.09], [880, 0.09, 0.12]],
    ferme: [[880, 0, 0.08], [587, 0.08, 0.12]],
    juste: [[784, 0, 0.1], [988, 0.1, 0.1], [1319, 0.2, 0.22]],
    reessaie: [[392, 0, 0.14], [349, 0.14, 0.2]]
  };
  function son(nom) { if (SONS[nom]) jouer(SONS[nom], nom === "juste" ? 0.2 : 0.16); }
  function vibre(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  /* Le moteur audio se reveille au premier toucher (exigence des navigateurs) */
  ["pointerdown", "touchstart", "click"].forEach(function (ev) {
    window.addEventListener(ev, function () { var c = audio(); try { if (c && c.state === "suspended") c.resume(); } catch (e) {} }, { capture: true, passive: true });
  });

  /* Sons du micro : on enveloppe l'ouverture et la fin de l'ecoute */
  var orig = window.startListening;
  if (typeof orig === "function") {
    window.startListening = function () {
      var h = orig.apply(this, arguments);
      try {
        son("ouvre"); vibre(15);
        if (h && h.promise && h.promise.then) {
          h.promise.then(function () { son("ferme"); }, function () {});
        }
      } catch (e) {}
      return h;
    };
  }

  /* Reponse juste : un ✅ apparait dans une zone de resultat */
  var dernier = 0;
  function verifier(noeud) {
    try {
      var el = noeud.nodeType === 3 ? noeud.parentNode : noeud;
      if (!el || !el.closest) return;
      var zone = el.closest("[id*='res'], [id*='-res'], .res, [data-res]");
      if (!zone) return;
      var t = zone.textContent || "";
      if (Date.now() - dernier < 900) return;
      if (t.indexOf("✅") > -1) { dernier = Date.now(); son("juste"); vibre([20, 40, 20]); }
      else if (/Réessaie|Reessaie|Rien entendu|Objectif/i.test(t)) { dernier = Date.now(); son("reessaie"); }
    } catch (e) {}
  }
  try {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === "childList") { for (var k = 0; k < m.addedNodes.length; k++) verifier(m.addedNodes[k]); }
        else if (m.type === "characterData") verifier(m.target);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) {}

  window.DiisooSon = { jouer: son, version: 1 };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-son.js",e);}

try{
/* ---- diisoo-objectif.js ---- */
/* diisoo-objectif.js v1 : un objectif personnel qu'on peut toucher du doigt
   - Apres le premier exercice, une fiche demande : ton but (visa, business, tourisme, wolof), ton rythme (3, 5 ou 10 exercices par jour), ta duree (30, 60 ou 90 jours)
   - Le tableau de bord montre : exercices du jour, jour X sur N, et le but choisi
   - Rappel quotidien : un fichier calendrier (.ics) qui sonne chaque jour a l'heure choisie, meme si l'app est fermee
   - A l'ouverture de l'app, si l'objectif du jour n'est pas fini, un message le rappelle */
(function () {
  "use strict";

  var CLE = "diisoo_obj";
  var BUTS = [
    ["visa", "🛂", "Visa et examen"],
    ["business", "💼", "Business et commerce"],
    ["tourisme", "🏝️", "Tourisme"],
    ["wolof", "🗣️", "Parler wolof"]
  ];
  var RYTHMES = [[3, "Doux", "3 par jour"], [5, "Régulier", "5 par jour"], [10, "Intense", "10 par jour"]];
  var DUREES = [30, 60, 90];

  function $(id) { return document.getElementById(id); }
  function lire() { try { return JSON.parse(localStorage.getItem(CLE) || "null"); } catch (e) { return null; } }
  function ecrire(o) { try { localStorage.setItem(CLE, JSON.stringify(o)); } catch (e) {} }
  function aujourd() { return new Date().toISOString().slice(0, 10); }
  function jours(a, b) { return Math.floor((new Date(b) - new Date(a)) / 86400000); }
  function cible() { var o = lire(); return (o && o.rythme) || (typeof DAILY_TARGET !== "undefined" ? DAILY_TARGET : 5); }
  function nomBut(o) { var x = BUTS.filter(function (b) { return b[0] === (o && o.but); })[0]; return x ? x[1] + " " + x[2] : ""; }

  /* ---------- tableau de bord ---------- */
  function rendre() {
    var el = $("daily-goal");
    if (!el) return;
    var g = typeof getDailyGoal === "function" ? getDailyGoal() : { done: 0 };
    var T = cible(), done = Math.min(g.done, T), o = lire();
    var h = '<div class="flex justify-between items-center text-[11px] text-[#A69C86] mb-1"><span>🎯 Objectif du jour</span><span class="flex items-center"><span id="slot-save"></span>' + done + "/" + T + "</span></div>" +
      '<div class="w-full bg-[#141A2B] h-1.5 rounded-full overflow-hidden"><div class="bg-[#3FAE74] h-full transition-all" style="width:' + Math.round(done / T * 100) + '%"></div></div>';
    if (o && o.debut) {
      var j = Math.min(o.duree, jours(o.debut, aujourd()) + 1);
      h += '<div class="flex justify-between text-[10px] text-[#8C8064] mt-1"><span>' + nomBut(o) + "</span><span>Jour " + j + " sur " + o.duree + "</span></div>";
      h += '<div class="w-full bg-[#141A2B] h-1 rounded-full overflow-hidden mt-1"><div class="bg-[#E1693F] h-full" style="width:' + Math.round(j / o.duree * 100) + '%"></div></div>';
      h += '<button type="button" id="obj-modif" class="mt-1 text-[10px] text-[#A69C86] underline">Changer mon objectif ou mon rappel</button>';
    } else {
      h += '<button type="button" id="obj-modif" class="mt-1 text-[11px] text-[#25D366] underline">🔔 Activer mon rappel quotidien</button>';
    }
    el.innerHTML = h;
    var m = $("obj-modif"); if (m) m.onclick = function () { fiche(true); };
    if (window.montrerSauvegarde) { try { window.montrerSauvegarde(); } catch (e) {} }
  }
  window.renderDailyGoal = rendre;
  window.bumpDailyGoal = function (n) {
    var g = getDailyGoal(), T = cible(), avant = g.done >= T;
    g.done += n; store.set("diisoo_goal", g);
    rendre();
    if (!avant && g.done >= T) { try { toast("🎯 Objectif du jour atteint ! Reviens demain pour continuer ta série."); } catch (e) {} }
    setTimeout(proposer, 1500);
  };

  /* ---------- fiche : but, rythme, duree, rappel ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#dii-obj{position:fixed;inset:0;z-index:9990;background:rgba(5,8,16,.86);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-obj .ob-box{width:100%;max-width:480px;max-height:94vh;overflow-y:auto;background:#0B0F1C;border:1px solid #1E2740;" +
    "border-radius:22px 22px 0 0;padding:18px 16px 24px;color:#F6F1E7}" +
    "#dii-obj h3{font-size:18px;font-weight:800;text-align:center;margin:0 0 4px}" +
    "#dii-obj .ob-sub{text-align:center;font-size:12px;color:#A69C86;margin:0 0 12px}" +
    "#dii-obj .ob-q{font-size:12px;font-weight:700;color:#C9BFA8;margin:12px 0 6px}" +
    "#dii-obj .ob-g{display:grid;gap:8px}" +
    "#dii-obj .ob-g.c2{grid-template-columns:1fr 1fr}#dii-obj .ob-g.c3{grid-template-columns:1fr 1fr 1fr}" +
    "#dii-obj .ob-c{min-height:56px;padding:8px;border-radius:14px;background:#141A2B;border:2px solid #1E2740;color:#F6F1E7;font-size:13px;font-weight:700;text-align:center}" +
    "#dii-obj .ob-c small{display:block;font-size:11px;font-weight:400;color:#A69C86}" +
    "#dii-obj .ob-c.on{border-color:#25D366;background:#12351F}" +
    "#dii-obj .ob-ok{width:100%;min-height:56px;margin-top:16px;border-radius:999px;border:0;background:#25D366;color:#fff;font-size:16px;font-weight:800}" +
    "#dii-obj .ob-no{width:100%;min-height:44px;margin-top:8px;background:none;border:0;color:#A69C86;font-size:13px}" +
    "#dii-obj input[type=time]{width:100%;min-height:48px;border-radius:14px;background:#141A2B;border:2px solid #1E2740;color:#F6F1E7;font-size:18px;text-align:center}";
  document.head.appendChild(st);

  function fiche(modif) {
    if ($("dii-obj")) return;
    var o = lire() || { but: "visa", rythme: 5, duree: 30, heure: "20:30" };
    var ov = document.createElement("div"); ov.id = "dii-obj";
    var b = '<div class="ob-box"><h3>🎯 Fixe ton objectif</h3><p class="ob-sub">Un but clair, un rythme, une date. Tu avances chaque jour.</p>';
    b += '<p class="ob-q">1. Pourquoi tu apprends ?</p><div class="ob-g c2" data-k="but">';
    BUTS.forEach(function (x) { b += '<button type="button" class="ob-c' + (o.but === x[0] ? " on" : "") + '" data-v="' + x[0] + '">' + x[1] + "<br>" + x[2] + "</button>"; });
    b += '</div><p class="ob-q">2. Combien d\'exercices par jour ?</p><div class="ob-g c3" data-k="rythme">';
    RYTHMES.forEach(function (x) { b += '<button type="button" class="ob-c' + (o.rythme === x[0] ? " on" : "") + '" data-v="' + x[0] + '">' + x[1] + "<small>" + x[2] + "</small></button>"; });
    b += '</div><p class="ob-q">3. En combien de jours ?</p><div class="ob-g c3" data-k="duree">';
    DUREES.forEach(function (x) { b += '<button type="button" class="ob-c' + (o.duree === x ? " on" : "") + '" data-v="' + x + '">' + x + "<small>jours</small></button>"; });
    b += '</div><p class="ob-q">4. Quand es-tu disponible ? (rappel chaque jour, même si l\'app est fermée)</p><div class="ob-g c3" id="ob-creneaux">';
    [["06:30", "🌅", "Matin"], ["12:30", "☀️", "Midi"], ["20:30", "🌙", "Soir"]].forEach(function (x) { b += '<button type="button" class="ob-c' + (o.heure === x[0] ? " on" : "") + '" data-h="' + x[0] + '">' + x[1] + "<small>" + x[2] + " " + x[0].replace(":", "h") + "</small></button>"; });
    b += '</div><p class="ob-q" style="margin-top:8px">ou une autre heure :</p><input type="time" id="ob-heure" value="' + (o.heure || "20:30") + '">';
    b += '<button type="button" class="ob-ok" id="ob-valider">✅ Valider mon objectif</button>';
    b += '<button type="button" class="ob-no" id="ob-plus">' + (modif ? "Fermer" : "Plus tard") + "</button></div>";
    ov.innerHTML = b;
    document.body.appendChild(ov);
    Array.prototype.forEach.call(ov.querySelectorAll(".ob-g"), function (g) {
      var k = g.getAttribute("data-k");
      Array.prototype.forEach.call(g.children, function (c) {
        c.onclick = function () {
          Array.prototype.forEach.call(g.children, function (x) { x.classList.remove("on"); });
          c.classList.add("on");
          var v = c.getAttribute("data-v"); o[k] = k === "but" ? v : +v;
        };
      });
    });
    Array.prototype.forEach.call(ov.querySelectorAll("#ob-creneaux .ob-c"), function (c) {
      c.onclick = function () {
        Array.prototype.forEach.call(ov.querySelectorAll("#ob-creneaux .ob-c"), function (x) { x.classList.remove("on"); });
        c.classList.add("on"); $("ob-heure").value = c.getAttribute("data-h");
      };
    });
    $("ob-heure").onchange = function () {
      Array.prototype.forEach.call(ov.querySelectorAll("#ob-creneaux .ob-c"), function (x) { x.classList.toggle("on", x.getAttribute("data-h") === $("ob-heure").value); });
    };
    $("ob-plus").onclick = function () {
      ov.remove();
      if (!modif) { try { localStorage.setItem("diisoo_obj_plus", aujourd()); } catch (e) {} }
    };
    $("ob-valider").onclick = function () {
      o.heure = $("ob-heure").value || "20:30";
      o.debut = (lire() && lire().debut) || aujourd();
      ecrire(o);
      ov.remove();
      rendre();
      var repli = function () {
        telechargerRappel(o);
        try { toast("🎯 Objectif enregistré. Ouvre le fichier pour activer ton rappel."); } catch (e) {}
      };
      if (window.DiisooRappel && window.DiisooRappel.ok()) {
        window.DiisooRappel.activer(o).then(function (bon) {
          if (bon) { try { toast("🔔 Rappel activé chaque jour à " + o.heure); } catch (e) {} } else repli();
        });
      } else repli();
    };
  }

  /* ---------- rappel : fichier calendrier quotidien ---------- */
  function telechargerRappel(o) {
    try {
      var h = (o.heure || "20:30").split(":"), d = new Date();
      var pad = function (n) { return (n < 10 ? "0" : "") + n; };
      var jour = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
      var ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Diisoo//FR", "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT", "UID:diisoo-rappel-quotidien@diisoo.sn", "DTSTAMP:" + jour + "T000000Z",
        "DTSTART:" + jour + "T" + pad(+h[0]) + pad(+h[1]) + "00",
        "DTEND:" + jour + "T" + pad(+h[0]) + pad(+h[1] + 10 > 59 ? 59 : +h[1] + 10) + "00",
        "RRULE:FREQ=DAILY;COUNT=" + (o.duree || 30),
        "SUMMARY:Diisoo : " + (o.rythme || 5) + " exercices aujourd'hui",
        "DESCRIPTION:Ouvre https://diisoo.sn et fais ton objectif du jour. Une série à ne pas casser !",
        "URL:https://diisoo.sn/",
        "BEGIN:VALARM", "TRIGGER:PT0M", "ACTION:DISPLAY", "DESCRIPTION:Diisoo : ton objectif du jour t'attend", "END:VALARM",
        "END:VEVENT", "END:VCALENDAR"
      ].join("\r\n");
      var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "rappel-diisoo.ics";
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    } catch (e) {}
  }

  /* ---------- quand proposer la fiche, et le rappel a l'ouverture ---------- */
  function ecran() { var e = $("screen-dashboard"); return !!(e && e.offsetParent !== null); }
  function proposer() {
    if (lire() || !ecran()) return;
    var g = typeof getDailyGoal === "function" ? getDailyGoal() : { done: 0 };
    var plus = ""; try { plus = localStorage.getItem("diisoo_obj_plus") || ""; } catch (e) {}
    if (g.done >= 1 && plus !== aujourd()) fiche(false);
  }
  setInterval(function () { if (ecran()) proposer(); }, 4000);

  var rappele = false;
  setTimeout(function () {
    var o = lire();
    if (rappele || !o || !ecran()) return;
    var g = getDailyGoal();
    if (g.done < cible()) {
      rappele = true;
      try { toast("🎯 Il te reste " + (cible() - g.done) + " exercice" + (cible() - g.done > 1 ? "s" : "") + " pour ton objectif du jour."); } catch (e) {}
    }
  }, 6000);

  if (/[?&]objectif=1/.test(location.search)) setTimeout(function () { fiche(true); }, 2500);
  rendre();
  window.DiisooObjectif = { version: 1, fiche: fiche, cible: cible };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-objectif.js",e);}

try{
/* ---- diisoo-rappel.js ---- */
/* diisoo-rappel.js v1 : vrai rappel quotidien (notification), meme si l'app est fermee
   - activer(objectif) : demande l'autorisation, abonne le telephone, envoie l'abonnement a Supabase (RPC enregistrer_push)
   - a chaque ouverture et a chaque exercice : dit au serveur si l'objectif du jour est fait (RPC push_actif), pour ne pas relancer quelqu'un qui a deja pratique
   - si tout echoue ou si le navigateur ne sait pas : repli sur le fichier calendrier de diisoo-objectif.js */
(function () {
  "use strict";
  if (window.DiisooRappel) return;
  var CLE_VAPID = "BMrk9C1QrIXB4jnV4U7PglLE5wkVxdUWRSH-wNk-9slpMW-ovOW8fdBuNMkAkLIO_ju6RRQ7TwjOfASggo1w3Wg";

  function ok() { return "Notification" in window && "serviceWorker" in navigator && "PushManager" in window; }
  function b64(s) {
    var p = "=".repeat((4 - s.length % 4) % 4), r = atob((s + p).replace(/-/g, "+").replace(/_/g, "/")), o = new Uint8Array(r.length);
    for (var i = 0; i < r.length; i++) o[i] = r.charCodeAt(i);
    return o;
  }
  function buf(a) { return btoa(String.fromCharCode.apply(null, new Uint8Array(a))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function rpc(nom, corps) {
    if (typeof SUPABASE_URL === "undefined" || typeof SUPABASE_KEY === "undefined") return Promise.reject(new Error("pas de config"));
    return fetch(SUPABASE_URL + "/rest/v1/rpc/" + nom, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      body: JSON.stringify(corps)
    }).then(function (r) { if (!r.ok) throw new Error("rpc " + r.status); return true; });
  }
  function aujourd() { return new Date().toISOString().slice(0, 10); }
  function serie() { try { return ((JSON.parse(localStorage.getItem("diisoo_streak") || "null")) || {}).count || 0; } catch (e) { return 0; } }
  function faits() { try { return (typeof getDailyGoal === "function" ? getDailyGoal().done : 0) || 0; } catch (e) { return 0; } }
  function langue() { try { var o = JSON.parse(localStorage.getItem("diisoo_obj") || "null"); return (o && o.but) || "general"; } catch (e) { return "general"; } }
  function minutesUtc(hhmm) {
    var h = (hhmm || "18:00").split(":"), d = new Date();
    var loc = (+h[0] || 0) * 60 + (+h[1] || 0);
    loc = Math.max(360, Math.min(1319, loc)); /* jamais la nuit : entre 6h00 et 21h59 */
    d.setHours(Math.floor(loc / 60), loc % 60, 0, 0);
    return d.getUTCHours() * 60 + d.getUTCMinutes();
  }
  function abonnement() {
    return navigator.serviceWorker.ready.then(function (reg) {
      return reg.pushManager.getSubscription().then(function (s) {
        return s || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(CLE_VAPID) });
      });
    });
  }

  function activer(o) {
    if (!ok()) return Promise.resolve(false);
    return Notification.requestPermission().then(function (p) {
      if (p !== "granted") return false;
      return abonnement().then(function (s) {
        return rpc("enregistrer_push", {
          p_endpoint: s.endpoint, p_p256dh: buf(s.getKey("p256dh")), p_auth: buf(s.getKey("auth")),
          p_minutes_utc: minutesUtc(o && o.heure), p_serie: serie(), p_but: langue(), p_jour: aujourd(), p_faits: faits()
        });
      });
    }).then(function (r) { if (r) { try { localStorage.setItem("diisoo_rappel_on", "1"); } catch (e) {} } return !!r; })
      .catch(function () { return false; });
  }

  var envoye = "";
  function sync() {
    try {
      if (!ok() || localStorage.getItem("diisoo_rappel_on") !== "1" || Notification.permission !== "granted") return;
      var cle = aujourd() + ":" + faits() + ":" + serie();
      if (cle === envoye) return;
      envoye = cle;
      navigator.serviceWorker.ready.then(function (reg) { return reg.pushManager.getSubscription(); }).then(function (s) {
        if (!s) return;
        return rpc("push_actif", { p_endpoint: s.endpoint, p_serie: serie(), p_jour: aujourd(), p_faits: faits() });
      }).catch(function () {});
    } catch (e) {}
  }

  /* ---- heure reelle de pratique : proposition apres 3 jours ---- */
  function noterHeure() {
    try {
      var h = new Date(), j = aujourd(), L = lire("diisoo_heures", []);
      if (!Array.isArray(L)) L = [];
      if (L.some(function (x) { return x.j === j; })) return;
      L.push({ j: j, m: h.getHours() * 60 + h.getMinutes() });
      while (L.length > 30) L.shift();
      localStorage.setItem("diisoo_heures", JSON.stringify(L));
    } catch (e) {}
  }
  function lire(k, v) { try { return JSON.parse(localStorage.getItem(k) || "null") || v; } catch (e) { return v; } }
  function mediane() {
    var L = lire("diisoo_heures", []).map(function (x) { return x.m; }).sort(function (a, b) { return a - b; });
    return L.length >= 3 ? L[Math.floor(L.length / 2)] : null;
  }
  function hhmm(m) { var h = Math.floor(m / 60), n = m % 60; return (h < 10 ? "0" : "") + h + ":" + (n < 10 ? "0" : "") + n; }
  function proposer() {
    try {
      if (localStorage.getItem("diisoo_rappel_on") !== "1") return;
      var o = lire("diisoo_obj", null); if (!o || !o.heure) return;
      var med = mediane(); if (med === null) return;
      med = Math.round(med / 30) * 30;
      var cur = (+o.heure.split(":")[0]) * 60 + (+o.heure.split(":")[1] || 0);
      if (Math.abs(med - cur) < 90 || med < 360 || med > 1319) return;
      var dernier = localStorage.getItem("diisoo_rappel_propose");
      if (dernier && (Date.now() - new Date(dernier).getTime()) < 14 * 86400000) return;
      var d = document.getElementById("screen-dashboard");
      if (!d || d.classList.contains("hidden") || document.querySelector("#dii-obj,#dii-recap,#dii-defi,#dar,#dsr,[id^=screen-].fixed:not(.hidden)")) return;
      localStorage.setItem("diisoo_rappel_propose", aujourd());
      var nom = hhmm(med).replace(":", "h").replace(/h00$/, "h");
      var b = document.createElement("div");
      b.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:9991;max-width:456px;margin:0 auto;background:#141A2B;border:1px solid #25D366;border-radius:16px;padding:12px 14px;color:#F6F1E7;font-size:13px";
      b.innerHTML = "Tu pratiques souvent vers <b>" + nom + "</b>. Te rappeler à " + nom + " ?<br>" +
        '<button type="button" id="rp-oui" style="margin:8px 8px 0 0;min-height:44px;padding:0 16px;border-radius:999px;border:0;background:#25D366;color:#fff;font-weight:800;font-size:14px">Oui</button>' +
        '<button type="button" id="rp-non" style="margin-top:8px;min-height:44px;padding:0 12px;border:0;background:none;color:#A69C86;font-size:13px">Non merci</button>';
      document.body.appendChild(b);
      document.getElementById("rp-non").onclick = function () { b.remove(); };
      document.getElementById("rp-oui").onclick = function () {
        o.heure = hhmm(med);
        try { localStorage.setItem("diisoo_obj", JSON.stringify(o)); } catch (e) {}
        b.remove();
        activer(o).then(function (bon) { if (bon) { try { toast("🔔 Rappel déplacé à " + nom); } catch (e) {} } });
      };
      setTimeout(function () { if (b.parentNode) b.remove(); }, 15000);
    } catch (e) {}
  }

  /* ---- point d'entree visible : toucher la serie (🔥) ouvre le reglage du rappel ; une cloche invite a l'activer ---- */
  (function () {
    var css = document.createElement("style");
    css.textContent = "body.rp-off #streak-counter::after{content:' 🔔'}#streak-counter{cursor:pointer}";
    document.head.appendChild(css);
    function etat() { try { document.body.classList.toggle("rp-off", localStorage.getItem("diisoo_rappel_on") !== "1" && ok()); } catch (e) {} }
    function brancher() {
      var s = document.getElementById("streak-counter");
      if (!s) return false;
      if (!s.__rp) {
        s.__rp = 1; s.setAttribute("role", "button"); s.setAttribute("aria-label", "Régler mon rappel quotidien");
        s.addEventListener("click", function () { if (window.DiisooObjectif && DiisooObjectif.fiche) DiisooObjectif.fiche(true); });
      }
      return true;
    }
    etat(); setInterval(etat, 3000);
    var n = 0, t = setInterval(function () { n++; if (brancher() || n > 30) clearInterval(t); }, 500);
  })();

  window.DiisooRappel = { ok: ok, activer: activer, sync: sync, proposer: proposer };
  noterHeure();
  setTimeout(proposer, 7000);
  setTimeout(sync, 4000);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") sync(); });
  var essais = 0, t = setInterval(function () {
    essais++;
    if (typeof window.bumpDailyGoal === "function" && !window.bumpDailyGoal.__r) {
      var f = window.bumpDailyGoal;
      window.bumpDailyGoal = function () { var r = f.apply(this, arguments); noterHeure(); setTimeout(sync, 800); return r; };
      window.bumpDailyGoal.__r = 1; clearInterval(t);
    } else if (essais > 20) clearInterval(t);
  }, 500);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-rappel.js",e);}

try{
/* ---- diisoo-recap.js ---- */
/* diisoo-recap.js v1 : « Ta semaine », un bilan une fois par semaine
   - Lit le journal d'XP existant (diisoo_daily_xp) : jours actifs sur 7, XP gagne, comparaison avec la semaine d'avant, serie, niveau
   - S'affiche a la premiere ouverture de chaque nouvelle semaine, seulement si la personne a pratique ; jamais pendant un exercice
   - Bouton « Partager » : message WhatsApp avec le lien diisoo.sn (chaque bilan peut ramener un ami)
   - Essai : https://diisoo.sn/?recap=1 */
(function () {
  "use strict";
  if (window.DiisooRecap) return;
  var CLE = "diisoo_recap_semaine";
  function $(id) { return document.getElementById(id); }
  function jour(d) { return d.toISOString().slice(0, 10); }
  function lire(k, v) { try { return JSON.parse(localStorage.getItem(k) || "null") || v; } catch (e) { return v; } }
  function semaine(d) { // cle = lundi de la semaine
    var x = new Date(d); x.setUTCHours(0, 0, 0, 0);
    x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
    return jour(x);
  }
  function bilan() {
    var log = lire("diisoo_daily_xp", {}), n = Date.now(), cur = { j: 0, xp: 0 }, avant = { j: 0, xp: 0 };
    for (var i = 0; i < 14; i++) {
      var v = log[jour(new Date(n - i * 86400000))] || 0, t = i < 7 ? cur : avant;
      if (v > 0) { t.j++; t.xp += v; }
    }
    var xp = lire("diisoo_xp", { total: 0 }).total || 0;
    return { cur: cur, avant: avant, serie: (lire("diisoo_streak", {}).count) || 0, niveau: Math.floor(xp / 50) + 1 };
  }
  function phrase(b) {
    if (b.cur.j >= 6) return "Semaine exceptionnelle. Tu es régulier, c'est ça qui fait progresser.";
    if (b.cur.j >= 4) return "Très belle semaine. Encore un jour de plus et tu fais encore mieux.";
    if (b.cur.xp > b.avant.xp && b.avant.xp > 0) return "Tu progresses par rapport à la semaine dernière. Continue comme ça.";
    return "Un bon début. Quelques minutes par jour valent mieux qu'une longue séance.";
  }

  var st = document.createElement("style");
  st.textContent =
    "#dii-recap{position:fixed;inset:0;z-index:9991;background:rgba(5,8,16,.88);display:flex;align-items:center;justify-content:center;padding:16px}" +
    "#dii-recap .rc{width:100%;max-width:380px;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px;padding:20px 16px;color:#F6F1E7;text-align:center}" +
    "#dii-recap h3{font-size:20px;font-weight:800;margin:0 0 2px}" +
    "#dii-recap .rc-s{font-size:12px;color:#A69C86;margin:0 0 14px}" +
    "#dii-recap .rc-g{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
    "#dii-recap .rc-c{background:#141A2B;border:1px solid #1E2740;border-radius:14px;padding:12px 6px}" +
    "#dii-recap .rc-c b{display:block;font-size:24px;font-weight:900}" +
    "#dii-recap .rc-c span{font-size:11px;color:#A69C86}" +
    "#dii-recap .rc-p{font-size:13px;color:#C9BFA8;margin:14px 4px 0}" +
    "#dii-recap button{width:100%;min-height:52px;margin-top:10px;border-radius:999px;border:0;font-size:15px;font-weight:800}" +
    "#dii-recap .rc-w{background:#25D366;color:#fff}#dii-recap .rc-f{background:none;color:#A69C86;font-size:13px;min-height:44px;font-weight:600}";
  document.head.appendChild(st);

  function afficher() {
    if ($("dii-recap")) return;
    var b = bilan(), diff = b.cur.xp - b.avant.xp;
    var ov = document.createElement("div"); ov.id = "dii-recap";
    ov.innerHTML = '<div class="rc"><h3>📊 Ta semaine</h3><p class="rc-s">Les 7 derniers jours</p><div class="rc-g">' +
      '<div class="rc-c"><b>' + b.cur.j + '/7</b><span>jours actifs</span></div>' +
      '<div class="rc-c"><b>+' + b.cur.xp + '</b><span>XP gagnés' + (b.avant.xp ? " (" + (diff >= 0 ? "+" : "") + diff + " vs sem. dernière)" : "") + '</span></div>' +
      '<div class="rc-c"><b>🔥 ' + b.serie + '</b><span>jours de série</span></div>' +
      '<div class="rc-c"><b>⭐ ' + b.niveau + '</b><span>niveau</span></div></div>' +
      '<p class="rc-p">' + phrase(b) + '</p>' +
      '<button type="button" class="rc-w" id="rc-share">Partager mon bilan</button>' +
      '<button type="button" class="rc-f" id="rc-close">Continuer</button></div>';
    document.body.appendChild(ov);
    $("rc-close").onclick = function () { ov.remove(); };
    $("rc-share").onclick = function () {
      var t = "Ma semaine sur Diisoo : " + b.cur.j + "/7 jours, +" + b.cur.xp + " XP, série de " + b.serie + " jours 🔥\nApprends l'anglais et le wolof gratuitement : https://diisoo.sn/?source=recap";
      try { window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank"); } catch (e) {}
    };
    try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", "recap_semaine", ""); } catch (e) {}
  }

  function peutAfficher() {
    var d = $("screen-dashboard");
    if (!d || d.classList.contains("hidden")) return false;
    return !document.querySelector("#dii-obj,#dar,#dsr,[id^=screen-].fixed:not(.hidden)");
  }
  function verifier(force) {
    var cle = semaine(new Date());
    if (!force) {
      if (lire(CLE, "") === cle) return;
      var b = bilan();
      if (b.cur.j < 1) return;
      if (!peutAfficher()) return;
    }
    try { localStorage.setItem(CLE, JSON.stringify(cle)); } catch (e) {}
    afficher();
  }
  window.DiisooRecap = { afficher: afficher, verifier: verifier };
  var force = /[?&]recap=1/.test(location.search);
  setTimeout(function () { verifier(force); }, 4500);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-recap.js",e);}

try{
/* ---- diisoo-defi.js ---- */
/* diisoo-defi.js v1 : « Défie un ami »
   - Quand l'objectif du jour est atteint, une fenetre propose de defier un ami sur WhatsApp : « je suis a N jours de serie, tu peux me battre ? »
   - Le lien partage contient ?source=defi&serie=N. L'ami qui arrive voit un bandeau (une fois) et le defi est memorise
   - Quand l'ami depasse la serie de celui qui l'a defie, il recoit un message de victoire
   - Essai : https://diisoo.sn/?defi=1 (ouvre la fenetre de defi) */
(function () {
  "use strict";
  if (window.DiisooDefi) return;
  function $(id) { return document.getElementById(id); }
  function lire(k, v) { try { return JSON.parse(localStorage.getItem(k) || "null") || v; } catch (e) { return v; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function aujourd() { return new Date().toISOString().slice(0, 10); }
  function serie() { return (lire("diisoo_streak", {}).count) || 0; }
  function suivi(a) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", a, ""); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#dii-defi{position:fixed;inset:0;z-index:9991;background:rgba(5,8,16,.86);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-defi .df{width:100%;max-width:480px;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px 22px 0 0;padding:20px 16px 24px;color:#F6F1E7;text-align:center}" +
    "#dii-defi h3{font-size:19px;font-weight:800;margin:0 0 6px}" +
    "#dii-defi p{font-size:13px;color:#C9BFA8;margin:0 0 4px}" +
    "#dii-defi button{width:100%;min-height:52px;margin-top:10px;border-radius:999px;border:0;font-size:15px;font-weight:800}" +
    "#dii-defi .d-w{background:#25D366;color:#fff}#dii-defi .d-f{background:none;color:#A69C86;font-size:13px;min-height:44px;font-weight:600}" +
    "#dii-defi-ban{position:fixed;left:12px;right:12px;bottom:12px;z-index:9991;max-width:456px;margin:0 auto;background:#12351F;border:1px solid #25D366;border-radius:16px;padding:12px 14px;color:#F6F1E7;font-size:13px}" +
    "#dii-defi-ban button{margin-top:8px;min-height:44px;padding:0 16px;border-radius:999px;border:0;background:#25D366;color:#fff;font-weight:800;font-size:14px}";
  document.head.appendChild(st);

  function proposer() {
    if ($("dii-defi")) return;
    var n = Math.max(1, serie());
    var ov = document.createElement("div"); ov.id = "dii-defi";
    ov.innerHTML = '<div class="df"><h3>🎯 Objectif atteint !</h3><p>Tu es à <b>' + n + (n > 1 ? " jours" : " jour") + '</b> de série.</p><p>Défie un ami de te battre.</p>' +
      '<button type="button" class="d-w" id="df-go">Défier un ami sur WhatsApp</button>' +
      '<button type="button" class="d-f" id="df-no">Plus tard</button></div>';
    document.body.appendChild(ov);
    $("df-no").onclick = function () { ov.remove(); };
    $("df-go").onclick = function () {
      var t = "Je suis à " + n + (n > 1 ? " jours" : " jour") + " de série sur Diisoo 🔥 Tu peux me battre ?\nApprends l'anglais et le wolof gratuitement : https://diisoo.sn/?source=defi&serie=" + n;
      try { window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank"); } catch (e) {}
      suivi("defi_envoye");
      ov.remove();
    };
  }

  function bandeau(n) {
    if ($("dii-defi-ban") || $("dar") || $("dsr")) return;
    var b = document.createElement("div"); b.id = "dii-defi-ban";
    b.innerHTML = "🔥 Un ami t'a défié : il est à <b>" + n + (n > 1 ? " jours" : " jour") + "</b> de série. Pratique chaque jour pour le battre !<br><button type=\"button\">Relever le défi</button>";
    document.body.appendChild(b);
    b.querySelector("button").onclick = function () { b.remove(); };
    setTimeout(function () { if (b.parentNode) b.remove(); }, 12000);
    suivi("defi_recu");
  }

  function victoire() {
    var d = lire("diisoo_defi", null);
    if (!d || d.gagne || serie() <= d.serie) return;
    d.gagne = true; ecrire("diisoo_defi", d);
    try { toast("🏆 Tu as battu ton ami : " + serie() + " jours contre " + d.serie + " !"); } catch (e) {}
    suivi("defi_gagne");
  }

  var q = location.search, m = q.match(/[?&]serie=(\d{1,4})/);
  if (/[?&]source=defi/.test(q) && m && !lire("diisoo_defi", null)) {
    var n = Math.min(999, +m[1]);
    ecrire("diisoo_defi", { serie: n, date: aujourd(), gagne: false });
    setTimeout(function () { bandeau(n); }, 3500);
  }
  setTimeout(victoire, 5000);
  if (/[?&]defi=1/.test(q)) setTimeout(proposer, 3500);

  /* v2 : le defi ne coupe plus un exercice. Il attend le retour a l'accueil (aucune seance ni fenetre ouverte). */
  var attente = false;
  setInterval(function () {
    if (!attente) return;
    var acc = $("screen-dashboard"), sn = $("dsn");
    if (!acc || acc.classList.contains("hidden")) return;
    if (sn && !sn.classList.contains("hidden")) return;
    if ($("dii-obj") || $("dar") || $("dsr") || $("dii-defi")) return;
    attente = false; proposer();
  }, 1500);

  var essais = 0, t = setInterval(function () {
    essais++;
    if (typeof window.bumpDailyGoal === "function" && !window.bumpDailyGoal.__d) {
      var f = window.bumpDailyGoal;
      window.bumpDailyGoal = function () {
        var avant = 0; try { avant = getDailyGoal().done; } catch (e) {}
        var cible = 5; try { cible = (lire("diisoo_obj", null) || {}).rythme || DAILY_TARGET; } catch (e) {}
        var r = f.apply(this, arguments);
        var apres = 0; try { apres = getDailyGoal().done; } catch (e) {}
        if (avant < cible && apres >= cible) {
          setTimeout(function () { victoire(); attente = true; }, 2200);
        }
        return r;
      };
      window.bumpDailyGoal.__d = 1; clearInterval(t);
    } else if (essais > 30) clearInterval(t);
  }, 500);
  window.DiisooDefi = { proposer: proposer };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-defi.js",e);}

try{
/* ---- diisoo-mission-visa.js ---- */
/* diisoo-mission-visa.js v1 : Mission « Entretien visa »
   L'app joue l'officier (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Visa & Entretien consulaire » (Anglais). Essai : https://diisoo.sn/?mission=visa */
(function () {
  "use strict";
  if (window.DiisooMissionVisa) return;
  var Q = [
    { q: "What is the purpose of your trip?", kw: /business|visit|family|study|tourism|holiday|travel|buy|work/i, m: "I am travelling for business." },
    { q: "How long will you stay?", kw: /day|week|month/i, m: "I will stay for ten days." },
    { q: "Where will you stay?", kw: /hotel|friend|family|brother|sister|house|apartment/i, m: "I will stay at a hotel." },
    { q: "Who is paying for your trip?", kw: /myself|my |family|company|brother|sister|father|mother|employer/i, m: "I am paying for myself." },
    { q: "How can I be sure that you will come back?", kw: /family|business|shop|job|work|ticket|return|home|children|wife|husband/i, m: "My family and my business are in Senegal." }
  ];
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mvo{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mvo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mvo .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mvo .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mvo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mvo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mvo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mvo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mvo .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mvo .m.on{animation:mvp 1s infinite}@keyframes mvp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mvo .ok{color:#25D366}#mvo .or{color:#FFAA3C}" +
    "#mv-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mv-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mvo")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mvo";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🛂 Entretien visa · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mv-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mv-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mv-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mv-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mv-skip" type="button">Passer</button>' +
        '<button class="b3" id="mv-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mv-r"), mic = document.getElementById("mv-mic"), nx = document.getElementById("mv-next");
      document.getElementById("mv-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mv-x").onclick = function () { o.remove(); };
      document.getElementById("mv-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["entretien-visa"]) BADGES["entretien-visa"] = { icon: "🛂", label: "Entretien réussi", desc: "Mission visa réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("entretien-visa"); } catch (e) {}
      }
      noter("mission_visa", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🛂 Mission visa</div><div class="q">' + (ok ? "Visa accordé ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Entretien réussi » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Visa et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mv-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mv-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mv-x2" type="button">Fermer</button>';
      document.getElementById("mv-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mv-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mv-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon entretien visa en anglais sur Diisoo 🛂 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mv-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "visa") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mv-btn";
    b.innerHTML = '<span style="font-size:22px">🛂</span><span>Mission : passer l\'entretien<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionVisa = { ouvrir: ouvrir };
  if (/[?&]mission=visa/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-visa.js",e);}

try{
/* ---- diisoo-mission-marche.js ---- */
/* diisoo-mission-marche.js v1 : Mission « Négocier au marché »
   L'app joue le client (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Achats & argent » (Anglais). Essai : https://diisoo.sn/?mission=marche */
(function () {
  "use strict";
  if (window.DiisooMissionMarche) return;
  var Q = [
    { q: "Hello! How much is this bag?", kw: /price|franc|thousand|hundred|cost|\d/i, m: "It is five thousand francs." },
    { q: "That is too expensive. Can you lower the price?", kw: /ok|okay|better|discount|lower|price|francs|\d/i, m: "Okay, four thousand francs for you." },
    { q: "How many do you have?", kw: /have|piece|kilo|bag|stock|\d/i, m: "I have twenty pieces." },
    { q: "Do you accept Wave or cash?", kw: /wave|cash|orange|mobile|yes|both/i, m: "Yes, I accept Wave and cash." },
    { q: "Can I pay later?", kw: /no|sorry|today|now|cannot|can't|not/i, m: "Sorry, you pay today, please." }
  ];

  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mmo{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mmo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mmo .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mmo .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mmo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mmo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mmo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mmo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mmo .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mmo .m.on{animation:mmp 1s infinite}@keyframes mmp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mmo .ok{color:#25D366}#mmo .or{color:#FFAA3C}" +
    "#mm-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mm-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mmo")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mmo";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🛒 Négocier au marché · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mm-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mm-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mm-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mm-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mm-skip" type="button">Passer</button>' +
        '<button class="b3" id="mm-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mm-r"), mic = document.getElementById("mm-mic"), nx = document.getElementById("mm-next");
      document.getElementById("mm-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mm-x").onclick = function () { o.remove(); };
      document.getElementById("mm-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["vendeur-marche"]) BADGES["vendeur-marche"] = { icon: "🛒", label: "Vendeur de marché", desc: "Négociation réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("vendeur-marche"); } catch (e) {}
      }
      noter("mission_marche", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🛒 Mission marché</div><div class="q">' + (ok ? "Vente conclue ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Vendeur de marché » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Achats & argent et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mm-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mm-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mm-x2" type="button">Fermer</button>';
      document.getElementById("mm-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mm-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mm-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma négociation au marché en anglais sur Diisoo 🛒 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mm-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "market") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mm-btn";
    b.innerHTML = '<span style="font-size:22px">🛒</span><span>Mission : négocier au marché<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionMarche = { ouvrir: ouvrir };
  if (/[?&]mission=marche/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-marche.js",e);}

try{
/* ---- diisoo-mission-voyage.js ---- */
/* diisoo-mission-voyage.js v1 : Mission « Voyager seul »
   L'app joue l'agent de l'aeroport (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Voyage & transport » (Anglais). Essai : https://diisoo.sn/?mission=voyage */
(function () {
  "use strict";
  if (window.DiisooMissionVoyage) return;
  var Q = [
    { q: "Where are you flying to?", kw: /paris|dakar|france|flying|going|travel|fly|to |\w{4,}/i, m: "I am flying to Paris." },
    { q: "May I see your passport and ticket?", kw: /here|passport|ticket|sure|yes|of course/i, m: "Yes, here is my passport and my ticket." },
    { q: "How many bags do you have?", kw: /one|two|three|bag|suitcase|\d/i, m: "I have one suitcase." },
    { q: "Do you want a window or an aisle seat?", kw: /window|aisle/i, m: "A window seat, please." },
    { q: "Your flight is delayed one hour. What do you do?", kw: /wait|ok|okay|thank|coffee|sit|fine/i, m: "Okay, I will wait. Thank you." }
  ];


  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mvyo{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mvyo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mvyo .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mvyo .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mvyo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mvyo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mvyo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mvyo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mvyo .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mvyo .m.on{animation:mvyp 1s infinite}@keyframes mvyp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mvyo .ok{color:#25D366}#mvyo .or{color:#FFAA3C}" +
    "#mvy-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mvy-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mvyo")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mvyo";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">✈️ Voyager seul · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mvy-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mvy-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mvy-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mvy-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mvy-skip" type="button">Passer</button>' +
        '<button class="b3" id="mvy-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mvy-r"), mic = document.getElementById("mvy-mic"), nx = document.getElementById("mvy-next");
      document.getElementById("mvy-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mvy-x").onclick = function () { o.remove(); };
      document.getElementById("mvy-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["voyageur-confirme"]) BADGES["voyageur-confirme"] = { icon: "✈️", label: "Voyageur confirmé", desc: "Voyage réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("voyageur-confirme"); } catch (e) {}
      }
      noter("mission_voyage", score + "/" + Q.length);
      o.innerHTML = '<div class="k">✈️ Mission voyage</div><div class="q">' + (ok ? "Bon voyage ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Voyageur confirmé » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Voyage & transport et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mvy-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mvy-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mvy-x2" type="button">Fermer</button>';
      document.getElementById("mvy-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mvy-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mvy-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon voyage à l'aéroport en anglais sur Diisoo ✈️ (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mvy-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "travel") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mvy-btn";
    b.innerHTML = '<span style="font-size:22px">✈️</span><span>Mission : voyager seul<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionVoyage = { ouvrir: ouvrir };
  if (/[?&]mission=voyage/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-voyage.js",e);}

try{
/* ---- diisoo-mission-presentation.js ---- */
/* diisoo-mission-presentation.js v1 : Mission « Se présenter à un inconnu »
   L'app joue la personne que tu rencontres (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Se présenter » (Anglais). Essai : https://diisoo.sn/?mission=presentation */
(function () {
  "use strict";
  if (window.DiisooMissionPresentation) return;
  var Q = [
    { q: "Hello! What is your name?", kw: /name|i am|i'm|my/i, m: "My name is Babacar. Nice to meet you." },
    { q: "Where are you from?", kw: /senegal|thi[eè]s|dakar|from|come/i, m: "I am from Thiès, in Senegal." },
    { q: "What do you do?", kw: /work|sell|student|farmer|business|agency|trader|teacher|driver/i, m: "I work in a travel agency." },
    { q: "Are you here for business or holiday?", kw: /business|holiday|visit|work|vacation|trip/i, m: "I am here for business." },
    { q: "Can I have your WhatsApp number?", kw: /yes|sure|of course|number|here|ok|okay/i, m: "Yes, sure. Here is my number." }
  ];



  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mpo{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mpo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mpo .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mpo .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mpo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mpo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mpo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mpo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mpo .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mpo .m.on{animation:mpp 1s infinite}@keyframes mpp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mpo .ok{color:#25D366}#mpo .or{color:#FFAA3C}" +
    "#mp-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mp-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mpo")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mpo";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🤝 Se présenter à un inconnu · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mp-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mp-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mp-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mp-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mp-skip" type="button">Passer</button>' +
        '<button class="b3" id="mp-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mp-r"), mic = document.getElementById("mp-mic"), nx = document.getElementById("mp-next");
      document.getElementById("mp-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mp-x").onclick = function () { o.remove(); };
      document.getElementById("mp-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["bonne-presentation"]) BADGES["bonne-presentation"] = { icon: "🤝", label: "Bonne présentation", desc: "Présentation réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("bonne-presentation"); } catch (e) {}
      }
      noter("mission_presentation", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🤝 Mission présentation</div><div class="q">' + (ok ? "Belle rencontre ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Bonne présentation » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Se présenter et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mp-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mp-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mp-x2" type="button">Fermer</button>';
      document.getElementById("mp-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mp-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mp-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma présentation en anglais sur Diisoo 🤝 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mp-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "intro") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mp-btn";
    b.innerHTML = '<span style="font-size:22px">🤝</span><span>Mission : se présenter<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionPresentation = { ouvrir: ouvrir };
  if (/[?&]mission=presentation/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-presentation.js",e);}

try{
/* ---- diisoo-mission-famille.js ---- */
/* diisoo-mission-famille.js v1 : Mission « Parler de sa famille »
   L'app joue un ami (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Famille » (Anglais). Essai : https://diisoo.sn/?mission=famille */
(function () {
  "use strict";
  if (window.DiisooMissionFamille) return;
  var Q = [
    { q: "Do you have a big family?", kw: /yes|no|big|small|family|brother|sister/i, m: "Yes, I have a big family." },
    { q: "How many children do you have?", kw: /one|two|three|four|children|none|son|daughter|no |\d/i, m: "I have two children, a son and a daughter." },
    { q: "Where do your parents live?", kw: /live|thi[eè]s|dakar|senegal|village|home|here/i, m: "My parents live in Thiès." },
    { q: "What does your mother do?", kw: /cook|sell|work|farmer|nurse|teacher|trader|housewife|home/i, m: "My mother is a trader." },
    { q: "Do you miss your family?", kw: /yes|miss|call|often|sometimes|very much/i, m: "Yes, I miss them. I call them every week." }
  ];




  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mfo{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mfo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mfo .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mfo .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mfo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mfo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mfo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mfo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mfo .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mfo .m.on{animation:mfp 1s infinite}@keyframes mfp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mfo .ok{color:#25D366}#mfo .or{color:#FFAA3C}" +
    "#mf-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mf-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mfo")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mfo";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">👨‍👩‍👧 Parler de sa famille · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mf-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mf-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mf-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mf-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mf-skip" type="button">Passer</button>' +
        '<button class="b3" id="mf-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mf-r"), mic = document.getElementById("mf-mic"), nx = document.getElementById("mf-next");
      document.getElementById("mf-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mf-x").onclick = function () { o.remove(); };
      document.getElementById("mf-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["famille-unie"]) BADGES["famille-unie"] = { icon: "👨‍👩‍👧", label: "Famille unie", desc: "Famille présentée à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("famille-unie"); } catch (e) {}
      }
      noter("mission_famille", score + "/" + Q.length);
      o.innerHTML = '<div class="k">👨‍👩‍👧 Mission famille</div><div class="q">' + (ok ? "Belle famille ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Famille unie » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Famille et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mf-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mf-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mf-x2" type="button">Fermer</button>';
      document.getElementById("mf-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mf-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mf-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma famille en anglais sur Diisoo 👨‍👩‍👧 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComfonent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mf-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "family") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mf-btn";
    b.innerHTML = '<span style="font-size:22px">👨‍👩‍👧</span><span>Mission : parler de sa famille<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionFamille = { ouvrir: ouvrir };
  if (/[?&]mission=famille/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-famille.js",e);}
