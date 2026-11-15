/* diisoo-ecoute.js v1 : Écoute par niveaux (remplace l'ancien entrainement de 12 questions)
   - 3 niveaux (Débutant, Intermédiaire, Avancé), séances de 8 questions tirées au hasard, les non vues d'abord
   - 2 écoutes maximum par question, puis question à choix ; le texte entendu s'affiche après la réponse
   - Niveau suivant débloqué à 6/8 ; XP par bonne réponse ; progression sauvegardée (diisoo_ecoute)
   Branche sur openListeningModule() existant (bouton « Écoute » du hub Examens). Desactivable : ?ecoute=0 */
(function () {
  "use strict";
  if (window.DiisooEcoute || /[?&]ecoute=0/.test(location.search)) return;
  function lire(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var TF = ["True", "False"];
  function tf(txt, st, vrai) { return [txt, "True or false? " + st, TF, vrai ? 0 : 1]; }

  var NIV = [
    { nom: "Débutant", ic: "🌱", rate: 0.82, q: [
      ["Attention please. The bus to Thiès will leave from platform two in ten minutes.", "Where does the bus leave from?", ["Platform one", "Platform two", "Platform three"], 1],
      ["Good morning. The doctor is ready to see you now. Please come to room five.", "Where should you go?", ["Room two", "Room five", "Room seven"], 1],
      ["The market closes at six o'clock today because of the holiday.", "What time does the market close today?", ["Five o'clock", "Six o'clock", "Seven o'clock"], 1],
      ["Excuse me, your flight to Paris is delayed. It will now leave at three thirty.", "What happened to the flight?", ["It is cancelled", "It is delayed", "It left early"], 1],
      ["Welcome to the class. Please sit down and open your books to page ten.", "What page should you open?", ["Page ten", "Page eleven", "Page twenty"], 0],
      ["We are sorry, the restaurant is full right now. Please wait fifteen minutes for a table.", "How long must you wait?", ["Five minutes", "Fifteen minutes", "Fifty minutes"], 1],
      ["Good morning. Fresh tomatoes are five hundred francs a kilo today. Onions are four hundred.", "How much are the tomatoes?", ["Four hundred francs", "Five hundred francs", "Six hundred francs"], 1],
      ["The rainy season starts next month. Farmers will plant groundnuts after the first rain.", "What will farmers plant?", ["Rice", "Millet", "Groundnuts"], 2],
      ["Hello. My name is Awa. I am twenty-five years old. I live in Thiès.", "Where does Awa live?", ["Dakar", "Thiès", "Saint-Louis"], 1],
      ["Please be quiet. The baby is sleeping.", "Why must you be quiet?", ["The baby is sleeping", "The class has started", "The shop is closed"], 0],
      ["The bus number twelve goes to the market. A ticket costs two hundred francs.", "How much is the ticket?", ["One hundred francs", "Two hundred francs", "Three hundred francs"], 1],
      ["I have two brothers and one sister. My sister is a teacher.", "What does his sister do?", ["She is a nurse", "She is a teacher", "She is a farmer"], 1],
      ["Today is Monday. The shop opens at eight and closes at five.", "When does the shop open?", ["At five", "At eight", "At nine"], 1],
      ["Excuse me, where is the pharmacy? It is next to the bank, on the left.", "Where is the pharmacy?", ["Next to the bank", "Next to the school", "Behind the market"], 0],
      ["I am hungry. I would like rice and fish, please.", "What does he want to eat?", ["Rice and fish", "Bread and eggs", "Chicken and chips"], 0],
      tf("My phone is new. I bought it last week.", "The phone is old.", false),
      ["I sell eggs and chickens. My farm is near Thiès, and I deliver to the market every Saturday.", "When does he deliver to the market?", ["Every Friday", "Every Saturday", "Every Sunday"], 1],
      ["Sorry, I cannot lower the price. But if you buy ten kilos, I can give you one kilo free.", "What do you get if you buy ten kilos?", ["A lower price", "One kilo free", "A free bag"], 1],
      ["Please remember to drink water. It is very hot in the field today.", "Why should you drink water?", ["It is hot", "It is late", "It is raining"], 0],
      ["Attention please. The truck with vegetables leaves for Dakar at six in the morning.", "What time does the truck leave?", ["At five", "At six", "At seven"], 1]
    ] },
    { nom: "Intermédiaire", ic: "🌿", rate: 0.92, q: [
      ["Hi, this is Mr Sow from the travel agency. Your visa appointment is on Thursday at ten thirty. Please bring your passport and two photos.", "What should you bring?", ["Passport and two photos", "Passport and a letter", "Two photos and money"], 0],
      ["Good evening. I'd like a room for two nights, please. Certainly. Do you prefer a room with a sea view? Yes, if it isn't too expensive. It's thirty thousand francs a night.", "What does the guest want?", ["A room for two nights", "A table for two", "A taxi to the beach"], 0],
      ["The meeting has been moved from Tuesday to Wednesday because the manager is travelling. It will start at nine.", "Why was the meeting moved?", ["The manager is travelling", "The room is busy", "It is a holiday"], 0],
      ["If you want to open an account, you need an ID card, a proof of address and ten thousand francs.", "Which of these is NOT needed?", ["An ID card", "A proof of address", "A work contract"], 2],
      ["Our delivery from Guangzhou arrived two days late. The customs officer asked for more documents, so we waited until Friday.", "Why was the delivery late?", ["Customs asked for more documents", "The ship broke down", "The address was wrong"], 0],
      ["I'm calling about the apartment for rent. Is it still available? Yes. It has two bedrooms and a small garden. The rent is sixty thousand a month.", "How much is the rent?", ["Sixty thousand a month", "Sixteen thousand a month", "Sixty thousand a year"], 0],
      ["I've been working here for three years. Before that, I worked in a shop in Dakar for two years.", "How long has he worked here?", ["Two years", "Three years", "Five years"], 1],
      tf("The pharmacy closes at seven on Saturdays, but it is closed on Sundays.", "You can buy medicine there on Sunday.", false),
      ["Next week's weather: heavy rain on Monday and Tuesday, then sunny until the weekend.", "When will it be sunny?", ["Monday and Tuesday", "From Wednesday to the weekend", "Only on Sunday"], 1],
      ["Could you speak more slowly, please? I didn't catch your last name.", "What does the person ask?", ["To speak more slowly", "To write his address", "To call later"], 0],
      ["Passengers for flight two oh four to Casablanca, please go to gate eleven. Boarding closes in twenty minutes.", "Which gate must passengers go to?", ["Gate eleven", "Gate twelve", "Gate fourteen"], 0],
      ["I'd like to return this shirt. It's too small, and I don't have the receipt. I'm sorry, without a receipt we can only exchange it.", "What can the shop do?", ["Give a refund", "Exchange it", "Nothing at all"], 1],
      ["My farm produces tomatoes and onions. This year the harvest is bigger because we used a new irrigation system.", "Why is the harvest bigger?", ["A new irrigation system", "More land", "Cheaper seeds"], 0],
      ["The doctor says I must rest for three days and drink a lot of water. I can go back to work on Friday.", "When can he go back to work?", ["On Wednesday", "On Friday", "On Monday"], 1],
      tf("Our company was created in 2015. Since then, we have opened four shops in Senegal and one in Mali.", "The company has five shops.", true)
    ] },
    { nom: "Avancé", ic: "🌳", rate: 1.0, q: [
      ["Despite the heavy rain, the match went ahead as planned, although attendance was lower than organisers had hoped.", "What happened to the match?", ["It was cancelled", "It went ahead", "It was postponed"], 1],
      ["I'd have called earlier, but my phone ran out of battery just as I was leaving the office.", "Why didn't he call earlier?", ["His phone battery died", "He was too busy", "He forgot the number"], 0],
      ["The proposal is interesting in principle, but we'd need to see detailed costs before committing to anything.", "What does the speaker want?", ["Detailed costs", "An immediate agreement", "A shorter proposal"], 0],
      ["Applicants must submit their file before the thirtieth of November. Late submissions will not be considered under any circumstances.", "What happens to late submissions?", ["They are accepted with a fee", "They are not considered", "They are reviewed later"], 1],
      ["Our exports have grown by twelve percent this year, mainly thanks to demand from the Gulf, whereas European sales remained flat.", "Which market stayed flat?", ["The Gulf", "Europe", "Asia"], 1],
      ["Unless you transfer the funds by Friday, the supplier won't release the goods, and the shipping slot will be lost.", "What must be done by Friday?", ["Transfer the funds", "Sign the contract", "Visit the supplier"], 0],
      ["I'm afraid the position has already been filled, but we'll keep your CV on file in case something suitable comes up.", "What will they do with his CV?", ["Throw it away", "Keep it on file", "Send it to another company"], 1],
      tf("Though the interview was short, the panel seemed impressed by her experience.", "The interview was long.", false),
      ["The visa officer asked whether I had sufficient funds and a return ticket, and then explained that processing could take up to three weeks.", "How long could processing take?", ["Three days", "Up to three weeks", "Three months"], 1],
      ["Rather than lowering our prices, we decided to improve the packaging, which turned out to be more effective.", "What did they do instead of lowering prices?", ["Improved the packaging", "Raised the prices", "Bought more advertising"], 0],
      ["Had I known the road was closed, I would have taken the coastal route.", "What does the speaker regret?", ["Not knowing the road was closed", "Taking the coastal route", "Being late for work"], 0],
      ["The clinic offers free consultations on Mondays, but medication must be paid for separately.", "What must patients pay for?", ["The consultation", "The medication", "The parking"], 1],
      ["To be eligible for the scholarship, candidates need a minimum overall score of six point five, with no band below six.", "What is the minimum overall score?", ["Six", "Six point five", "Seven"], 1],
      ["According to the forecast, temperatures will peak at forty degrees on Thursday before dropping sharply over the weekend.", "When will it be hottest?", ["On Thursday", "On Saturday", "On Sunday"], 0],
      tf("She wouldn't have accepted the offer if the salary hadn't been raised.", "She accepted because the salary increased.", true)
    ] }
  ];
  var TAILLE = 8, SEUIL = 6, ECOUTES = 2;

  function etat() { return lire("diisoo_ecoute", {}); }
  function sauver(e) { ecrire("diisoo_ecoute", e); }
  function debloque(i) { if (i === 0) return true; var e = etat(), p = e["n" + (i - 1)]; return !!(p && p.best >= SEUIL); }

  var st = document.createElement("style");
  st.textContent =
    "#ec-ov{position:fixed;inset:0;z-index:10040;background:#0B0F1C;color:#F6F1E7;overflow:auto;padding:14px 14px 24px}" +
    "#ec-ov .bk{min-height:44px;padding:0 14px;border:1px solid #2A3454;background:#141A2B;border-radius:14px;color:#F6F1E7;font-weight:800;font-size:14px}" +
    "#ec-ov h2{font-size:20px;font-weight:800;margin:14px 0 4px}#ec-ov .sub{font-size:13px;color:#A69C86;margin:0 0 12px}" +
    "#ec-ov .nv{display:flex;align-items:center;gap:12px;width:100%;min-height:68px;padding:10px 14px;margin-bottom:8px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;text-align:left;font-size:15px;font-weight:800}" +
    "#ec-ov .nv b{font-size:26px;font-weight:400}#ec-ov .nv small{display:block;font-size:12px;font-weight:600;color:#A69C86;margin-top:2px}" +
    "#ec-ov .nv.off{opacity:.45}" +
    "#ec-ov .pg{font-size:12.5px;color:#A69C86;text-align:center;margin:10px 0 2px}" +
    "#ec-ov .play{display:block;width:100%;min-height:58px;border:0;border-radius:16px;background:#F3A94E;color:#0B0F1C;font-size:17px;font-weight:800;margin:12px 0 6px}" +
    "#ec-ov .play:disabled{opacity:.45}#ec-ov .cp{font-size:12px;text-align:center;color:#A69C86;margin-bottom:10px}" +
    "#ec-ov .q{font-size:16px;font-weight:800;text-align:center;margin:10px 4px 12px;line-height:1.35}" +
    "#ec-ov .op{display:block;width:100%;min-height:50px;margin-bottom:8px;padding:8px 12px;border-radius:14px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-size:15px;font-weight:700}" +
    "#ec-ov .op.ok{background:#12351F;border-color:#3FAE74}#ec-ov .op.no{background:#3a1a1a;border-color:#c0504d}" +
    "#ec-ov .tx{font-size:13px;color:#C9C0AA;background:#141A2B;border-radius:12px;padding:10px 12px;margin:8px 0;line-height:1.4}" +
    "#ec-ov .go{display:block;width:100%;min-height:50px;border:0;border-radius:14px;background:#25D366;color:#fff;font-size:15px;font-weight:800;margin-top:8px}" +
    "#ec-ov .go.g{background:#1B2238;color:#F6F1E7}#ec-ov .big{font-size:42px;text-align:center;font-weight:800;margin:16px 0 4px}";
  document.head.appendChild(st);

  var ov = null, S = null;
  function fermer() { if (ov) { ov.remove(); ov = null; } S = null; try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} }
  function nouveau() { if (ov) { ov.remove(); ov = null; } try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} ov = document.createElement("div"); ov.id = "ec-ov"; document.body.appendChild(ov); return ov; }
  function dire(txt, rate) { try { speak(txt, "en-GB", rate); } catch (e) {} }

  function accueil() {
    nouveau();
    var e = etat(), h = '<button class="bk" id="ec-x">⬅️ Revenir</button><h2>👂 Écoute</h2><p class="sub">Écoute, puis réponds. 2 écoutes par question. 6 bonnes réponses sur 8 débloquent le niveau suivant.</p>';
    NIV.forEach(function (n, i) {
      var p = e["n" + i], ok = debloque(i);
      var info = ok ? (p ? "Meilleur score : " + p.best + "/" + TAILLE + " · " + n.q.length + " passages" : n.q.length + " passages") : "🔒 Réussis le niveau précédent (6/8)";
      h += '<button class="nv' + (ok ? "" : " off") + '" data-i="' + i + '"><b>' + n.ic + "</b><span>" + n.nom + "<small>" + info + "</small></span></button>";
    });
    ov.innerHTML = h;
    $("ec-x").onclick = fermer;
    Array.prototype.forEach.call(ov.querySelectorAll(".nv"), function (b) {
      b.onclick = function () { var i = +b.getAttribute("data-i"); if (!debloque(i)) { try { toast("Réussis d'abord le niveau précédent (6/8)."); } catch (x) {} return; } seance(i); };
    });
  }

  function seance(i) {
    var e = etat(), p = e["n" + i] || { best: 0, vus: [] };
    var ids = NIV[i].q.map(function (_, k) { return k; });
    var neufs = ids.filter(function (k) { return p.vus.indexOf(k) < 0; }), vus = ids.filter(function (k) { return p.vus.indexOf(k) >= 0; });
    function mel(a) { for (var j = a.length - 1; j > 0; j--) { var r = Math.floor(Math.random() * (j + 1)), t = a[j]; a[j] = a[r]; a[r] = t; } return a; }
    var liste = mel(neufs).concat(mel(vus)).slice(0, TAILLE);
    S = { i: i, liste: liste, n: 0, bon: 0, ecoutes: 0, repondu: false };
    question();
  }

  function question() {
    var niv = NIV[S.i], k = S.liste[S.n], d = niv.q[k];
    S.ecoutes = 0; S.repondu = false;
    nouveau();
    var h = '<button class="bk" id="ec-x">⬅️ Quitter</button><p class="pg">' + niv.ic + " " + niv.nom + " · Question " + (S.n + 1) + " / " + S.liste.length + " · Score " + S.bon + "</p>" +
      '<button class="play" id="ec-p">🔊 Écouter</button><p class="cp" id="ec-c"></p><p class="q">' + esc(d[1]) + '</p><div id="ec-o"></div><div id="ec-f"></div>';
    ov.innerHTML = h;
    $("ec-x").onclick = accueil;
    $("ec-p").onclick = jouer;
    d[2].forEach(function (o, j) {
      var b = document.createElement("button"); b.className = "op"; b.type = "button"; b.textContent = o; b.onclick = function () { repondre(j); };
      $("ec-o").appendChild(b);
    });
    majEcoutes();
    setTimeout(jouer, 350);
  }
  function majEcoutes() {
    var p = $("ec-p"), c = $("ec-c"); if (!p) return;
    var r = ECOUTES - S.ecoutes;
    c.textContent = S.repondu ? "" : (r > 0 ? "Écoutes restantes : " + r : "Plus d'écoute : réponds avec ce que tu as compris");
    p.disabled = r <= 0 || S.repondu;
  }
  function jouer() {
    if (!S || S.repondu || S.ecoutes >= ECOUTES) return;
    S.ecoutes++; majEcoutes();
    dire(NIV[S.i].q[S.liste[S.n]][0], NIV[S.i].rate);
  }
  function repondre(j) {
    if (!S || S.repondu) return;
    S.repondu = true;
    var niv = NIV[S.i], d = niv.q[S.liste[S.n]], ok = j === d[3];
    if (ok) { S.bon++; try { addXP(3); } catch (e) {} }
    try { bumpDailyGoal(1); } catch (e) {}
    var bs = $("ec-o").children;
    Array.prototype.forEach.call(bs, function (b, x) { b.disabled = true; if (x === d[3]) b.className = "op ok"; else if (x === j) b.className = "op no"; });
    majEcoutes();
    var dernier = S.n + 1 >= S.liste.length;
    $("ec-f").innerHTML = '<p class="tx">' + (ok ? "✅ Bonne réponse. " : "❌ Bonne réponse : " + esc(d[2][d[3]]) + ". ") + "<br><b>Texte :</b> " + esc(d[0]) + '</p><button class="go" id="ec-n">' + (dernier ? "Voir mon score" : "Suivant") + "</button>";
    $("ec-n").onclick = function () { if (dernier) bilan(); else { S.n++; question(); } };
  }

  function bilan() {
    var i = S.i, e = etat(), p = e["n" + i] || { best: 0, vus: [] };
    S.liste.forEach(function (k) { if (p.vus.indexOf(k) < 0) p.vus.push(k); });
    if (p.vus.length >= NIV[i].q.length) p.vus = [];
    var avant = debloque(i + 1);
    if (S.bon > p.best) p.best = S.bon;
    e["n" + i] = p; sauver(e);
    var apres = debloque(i + 1), reussi = S.bon >= SEUIL;
    nouveau();
    var h = '<button class="bk" id="ec-x">⬅️ Revenir</button><p class="big">' + S.bon + " / " + S.liste.length + "</p>" +
      '<p class="sub" style="text-align:center">' + (reussi ? "Bravo ! Tu progresses." : "Encore un essai : il faut " + SEUIL + " sur " + TAILLE + " pour passer au niveau suivant.") + "</p>";
    if (apres && !avant && i + 1 < NIV.length) h += '<p class="tx" style="text-align:center">🔓 Niveau ' + NIV[i + 1].nom + " débloqué !</p>";
    h += '<button class="go" id="ec-r">Rejouer ce niveau</button>';
    if (apres && i + 1 < NIV.length) h += '<button class="go" id="ec-s">Niveau suivant : ' + NIV[i + 1].nom + "</button>";
    h += '<button class="go g" id="ec-m">Tous les niveaux</button>';
    ov.innerHTML = h;
    $("ec-x").onclick = fermer; $("ec-r").onclick = function () { seance(i); }; $("ec-m").onclick = accueil;
    var s = $("ec-s"); if (s) s.onclick = function () { seance(i + 1); };
  }

  window.openListeningModule = accueil;
  window.DiisooEcoute = { ouvrir: accueil, niveaux: NIV.map(function (n) { return n.q.length; }) };
})();
