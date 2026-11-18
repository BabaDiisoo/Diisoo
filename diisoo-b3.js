/* diisoo-b3.js : morceau 3/6 du bundle. Généré, ne pas modifier à la main. */
try{
/* ---- diisoo-guide-plus.js ---- */
/* diisoo-tour_guide-plus.js v1 : Business, Guide (mode et beauté) enrichi
   Wolof des phrases existantes complété, +15 phrases, 1 dialogue. Wolof relu par Babacar.
   Desactivable : ?tour_guide=0 */
(function () {
  "use strict";
  if (window.__diisooGuidePlus || /[?&]tour_guide=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.tour_guide) return;
  window.__diisooGuidePlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Good morning. Are you ready?",
"fr": "Bonjour. Vous êtes prêts ?",
"wo": "Jàmm ngeen fanaan. Ndax pare ngeen ?"
},
{
"niveau": "debutant",
"en": "Where are you from?",
"fr": "Vous venez d'où ?",
"wo": "Fan ngeen jóge ?"
},
{
"niveau": "debutant",
"en": "Stay together, please.",
"fr": "Restez ensemble, s'il vous plaît.",
"wo": "Àndleen benn, bu leen neexee."
},
{
"niveau": "debutant",
"en": "Do you need a toilet?",
"fr": "Vous avez besoin des toilettes ?",
"wo": "Ndax soxla ngeen wànaag ?"
},
{
"niveau": "debutant",
"en": "This way, please.",
"fr": "Par ici, s'il vous plaît.",
"wo": "Fii la, bu la neexee."
},
{
"niveau": "intermediaire",
"en": "The museum opens at nine.",
"fr": "Le musée ouvre à neuf heures.",
"wo": "Musée bi dafay ubbi ci juróom-ñeenti waxtu."
},
{
"niveau": "intermediaire",
"en": "You can buy tickets at the entrance.",
"fr": "Vous pouvez acheter les billets à l'entrée.",
"wo": "Mën ngeen jënd tike yi ci bunt bi."
},
{
"niveau": "intermediaire",
"en": "We will have lunch after the visit.",
"fr": "Nous déjeunerons après la visite.",
"wo": "Dinanu añ gannaaw seeti bi."
},
{
"niveau": "intermediaire",
"en": "This tree is more than five hundred years old.",
"fr": "Cet arbre a plus de cinq cents ans.",
"wo": "Garab gii màgg na ba weesu juróom-téeméeri at."
},
{
"niveau": "intermediaire",
"en": "Please do not touch the objects.",
"fr": "Merci de ne pas toucher les objets.",
"wo": "Buleen laal yëf yi, bu leen neexee."
},
{
"niveau": "avance",
"en": "This village is known for its traditional fishing.",
"fr": "Ce village est connu pour sa pêche traditionnelle.",
"wo": "Dëkk bii xam nañu ko ci nàpp gu aada."
},
{
"niveau": "avance",
"en": "I will tell you the story of the island.",
"fr": "Je vais vous raconter l'histoire de l'île.",
"wo": "Dinaa leen nettali taariixu dunu bi."
},
{
"niveau": "avance",
"en": "If it rains, we will visit the museum instead.",
"fr": "S'il pleut, nous visiterons le musée à la place.",
"wo": "Su tawee, dinanu seeti musée bi ci palaas bi."
},
{
"niveau": "avance",
"en": "Would you like to meet a local family?",
"fr": "Voulez-vous rencontrer une famille locale ?",
"wo": "Ndax bëgg ngeen gis benn njaboot gu dëkk fii ?"
},
{
"niveau": "avance",
"en": "The bus will pick you up at the hotel at eight.",
"fr": "Le bus passera vous prendre à l'hôtel à huit heures.",
"wo": "Kaar bi dina ñëw jël leen ci otel bi ci juróom-ñetti waxtu."
}
];
  var L = [
{
"role": "guide",
"en": "Welcome to Gorée Island. Please stay together.",
"fr": "Bienvenue sur l'île de Gorée. Restez ensemble, s'il vous plaît.",
"wo": "Dalal ak jàmm ci dunu Gorée. Àndleen benn, bu leen neexee.",
"scene": "🧭 Visite de Gorée"
},
{
"role": "touriste",
"en": "Thank you. What is the history of this island?",
"fr": "Merci. Quelle est l'histoire de cette île ?",
"wo": "Jërëjëf. Lan mooy taariixu dunu bii ?"
},
{
"role": "guide",
"en": "For many years, it was a place where people were sent as slaves.",
"fr": "Pendant de nombreuses années, c'était un lieu d'où l'on envoyait des gens comme esclaves.",
"wo": "Ci at yu bari, fii lañu daan yóbbu nit ñi ñu def leen jaam."
},
{
"role": "touriste",
"en": "That is very sad. Can we visit the House of Slaves?",
"fr": "C'est très triste. Nous pouvons visiter la Maison des Esclaves ?",
"wo": "Dafa naqari lool. Ndax mën nanu seeti Maison des Esclaves ?"
},
{
"role": "guide",
"en": "Yes, it is on the left. The entrance is two thousand francs.",
"fr": "Oui, elle est à gauche. L'entrée coûte deux mille francs.",
"wo": "Waaw, ci càmmoñ la nekk. Dugg bi ñaari junni farã la."
},
{
"role": "touriste",
"en": "Can I take photos inside?",
"fr": "Je peux prendre des photos à l'intérieur ?",
"wo": "Ndax mën naa jël nataal ci biir ?"
},
{
"role": "guide",
"en": "Yes, but please be respectful.",
"fr": "Oui, mais soyez respectueux, s'il vous plaît.",
"wo": "Waaw, waaye wormaal fi, bu la neexee."
},
{
"role": "touriste",
"en": "Of course. Thank you for the explanation.",
"fr": "Bien sûr. Merci pour l'explication.",
"wo": "Waaw kay. Jërëjëf ci leeral bi."
}
];
  var FIX = {"Be careful, the road is slippery": "Moytul, yoon wi dafa tarax.", "Do you want to take a photo?": "Ndax bëgg nga jël nataal ?", "We will stop here for ten minutes": "Dinanu taxaw fii fukki simili.", "The boat leaves at nine from the Dakar pier": "Gaal gi dafay dem ci juróom-ñeenti waxtu ci waaxu Ndakaaru.", "The visit lasts about three hours": "Seeti bi dafay jël lu tollook ñetti waxtu.", "The House of Slaves is an important memorial": "Kër gi ñuy wax Maison des Esclaves am na solo lool ci taariix bi.", "At Lake Retba the water is pink because of the algae": "Ci Lac Rose, ndox mi dafa xonq ndax alg yi.", "Please wear a hat and sun cream": "Solal mbaxana te diw kerem ngir jant bi, bu la neexee.", "The entrance fee is not included": "Njëg li ñuy fay ngir dugg bokkul ci.", "Do you want to see the baobab trees or the birds?": "Ndax bëgg nga gis guy yi walla picc yi ?", "Our two-day tour includes the Saloum Delta, a night in a lodge and all meals.": "Sunu tukki bu ñaari fan bi dafay boole Saalum, benn guddi ci lotel ak lekk yépp.", "The price is per person, based on a minimum of four travellers.": "Njëg li ci nit ku nekk la, te dafa laaj ñeenti nit ba ci kaw.", "Due to the weather, we have to change the programme. I apologise.": "Ndax jaww ji, war nanu soppi porogaraam bi. Baal ma.", "Please keep your valuables with you and respect local customs.": "Dencal sa yëf yu am solo ci yaw, te wormaal aaday réew mi.", "May I ask your permission before taking photos of people?": "Ndax mën naa la ñaan ndigal balaa may jël nataali nit ñi ?", "We can adapt the tour for families with young children.": "Mën nanu soppi tukki bi ngir njaboot yu am xale yu ndaw.", "Cancellations made less than forty-eight hours before are not refunded.": "Anile bi ñuy def lu yées ñeent-fukk ak juróom-ñetti waxtu balaa agsi bi, amul fay."};
  C.tour_guide.vocab.forEach(function (v) { if (FIX[v.en]) v.wo = FIX[v.en]; });
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.tour_guide.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.tour_guide.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.tour_guide.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.tour_guide.vocab.length = 0; tri.forEach(function (t) { C.tour_guide.vocab.push(t[0]); });
  D.tour_guide = D.tour_guide || [];
  var vus = {}; D.tour_guide.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.tour_guide.push(l); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-guide-plus.js",e);}

try{
/* ---- diisoo-mission-guide.js ---- */
/* diisoo-mission-guide.js v1 : Mission « Guider des touristes »
   L'app joue le vendeur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Guide ».
   Bouton place en haut du secteur « Guide touristique » (Business). Essai : https://diisoo.sn/?mission=guide */
(function () {
  "use strict";
  if (window.DiisooMissionGuide) return;
  var Q = [
    { q: "Hello. Are you our guide for today?", kw: /yes|guide|welcome|hello|good|morning|i am|ready|today/i, m: "Yes, good morning. I am your guide for today." },
    { q: "How long is the visit?", kw: /hour|hours|minutes|three|two|about|visit|long|morning|afternoon|\d/i, m: "The visit lasts about three hours." },
    { q: "Does the price include the boat ticket?", kw: /yes|no|include|included|ticket|boat|separate|extra|price|francs|\d/i, m: "No, the boat ticket is separate." },
    { q: "Is it safe to take photos here?", kw: /yes|no|photo|photos|picture|allowed|ask|permission|respect|inside|outside|except|please/i, m: "Yes, but please ask permission before photographing people." },
    { q: "What time do we come back to the hotel?", kw: /back|return|hotel|at|o'clock|pm|four|five|six|three|afternoon|evening|\d/i, m: "We come back to the hotel at four o'clock." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mgd{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mgd .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mgd .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mgd .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mgd button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mgd .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mgd .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mgd .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mgd .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mgd .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mgd .ok{color:#25D366}#mgd .or{color:#FFAA3C}" +
    "#mgd-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mgd-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mgd")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mgd";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🧭 Guide · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mgd-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mgd-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mgd-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mgd-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mgd-skip" type="button">Passer</button>' +
        '<button class="b3" id="mgd-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mgd-r"), mic = document.getElementById("mgd-mic"), nx = document.getElementById("mgd-next");
      document.getElementById("mgd-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mgd-x").onclick = function () { o.remove(); };
      document.getElementById("mgd-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
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
        try { if (typeof BADGES !== "undefined" && !BADGES["guide"]) BADGES["guide"] = { icon: "🧭", label: "Guide", desc: "Guidage de touristes réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("guide"); } catch (e) {}
      }
      noter("mission_guide", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🧭 Mission Guide</div><div class="q">' + (ok ? "Bien joué ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Guide » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du secteur Guide et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mgd-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mgd-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mgd-x2" type="button">Fermer</button>';
      document.getElementById("mgd-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mgd-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mgd-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon rôle de guide touristique en anglais sur Diisoo 🧭 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
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
    var box = document.getElementById("business-content");
    if (!box || box.classList.contains("hidden") || document.getElementById("mgd-btn")) return;
    var id = ""; try { id = businessModule; } catch (e) {}
    if (id !== "tour_guide") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mgd-btn";
    b.innerHTML = '<span style="font-size:22px">🧭</span><span>Mission : guider des touristes<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    var h = box.querySelector("h4"); if (h && h.nextSibling) box.insertBefore(b, h.nextSibling); else box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("business-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true, attributes: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionGuide = { ouvrir: ouvrir };
  if (/[?&]mission=guide/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-guide.js",e);}

try{
/* ---- diisoo-transport-plus.js ---- */
/* diisoo-tour_transport-plus.js v1 : Business, Transport (mode et beauté) enrichi
   Wolof des phrases existantes complété, +15 phrases, 1 dialogue. Wolof relu par Babacar.
   Desactivable : ?tour_transport=0 */
(function () {
  "use strict";
  if (window.__diisooTransportPlus || /[?&]tour_transport=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.tour_transport) return;
  window.__diisooTransportPlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Where is the bus stop?",
"fr": "Où est l'arrêt de bus ?",
"wo": "Fan la are bi nekk ?"
},
{
"niveau": "debutant",
"en": "How much is the ticket?",
"fr": "Combien coûte le billet ?",
"wo": "Ñaata la tike bi ?"
},
{
"niveau": "debutant",
"en": "Is this the bus to Dakar?",
"fr": "C'est le bus pour Dakar ?",
"wo": "Ndax kaar bii dafay dem Ndakaaru ?"
},
{
"niveau": "debutant",
"en": "Please go slowly.",
"fr": "Roulez doucement, s'il vous plaît.",
"wo": "Doxal ndànk, bu la neexee."
},
{
"niveau": "debutant",
"en": "I am here.",
"fr": "Je suis ici.",
"wo": "Maa ngi fii."
},
{
"niveau": "intermediaire",
"en": "What time does the bus leave?",
"fr": "À quelle heure part le bus ?",
"wo": "Ban waxtu la kaar bi di dem ?"
},
{
"niveau": "intermediaire",
"en": "Can you drop me at the market?",
"fr": "Vous pouvez me déposer au marché ?",
"wo": "Ndax mën nga ma wàcce ci marse bi ?"
},
{
"niveau": "intermediaire",
"en": "Is there space for my luggage?",
"fr": "Il y a de la place pour mes bagages ?",
"wo": "Ndax am na palaas ngir sama bagaas ?"
},
{
"niveau": "intermediaire",
"en": "How much is a taxi to the airport?",
"fr": "Combien coûte un taxi jusqu'à l'aéroport ?",
"wo": "Ñaata la taksi bi ba ci aeroport bi ?"
},
{
"niveau": "intermediaire",
"en": "Please open the trunk.",
"fr": "Ouvrez le coffre, s'il vous plaît.",
"wo": "Ubbil mal bi, bu la neexee."
},
{
"niveau": "avance",
"en": "I booked a car for tomorrow morning. Is it ready?",
"fr": "J'ai réservé une voiture pour demain matin. Elle est prête ?",
"wo": "Reserwe naa oto ngir suba ci suba. Ndax pare na ?"
},
{
"niveau": "avance",
"en": "Can you take the highway? I am in a hurry.",
"fr": "Vous pouvez prendre l'autoroute ? Je suis pressé.",
"wo": "Ndax mën nga jël otorut bi ? Dama jamp."
},
{
"niveau": "avance",
"en": "The car broke down. Can you send a mechanic?",
"fr": "La voiture est tombée en panne. Vous pouvez envoyer un mécanicien ?",
"wo": "Oto bi dafa yàqu. Ndax mën nga yónnee meekaanisiyeŋ ?"
},
{
"niveau": "avance",
"en": "I would like a written quote for a full day.",
"fr": "Je voudrais un devis écrit pour une journée complète.",
"wo": "Dama bëgg a am devis bu ñu bind ngir benn bés bu mat."
},
{
"niveau": "avance",
"en": "We lost our bags. Where is the lost-and-found office?",
"fr": "Nous avons perdu nos bagages. Où est le bureau des objets trouvés ?",
"wo": "Sunu bagaas yi dañu sànku. Fan la biro bu yëf yi ñu for nekk ?"
}
];
  var L = [
{
"role": "client",
"en": "Hello. I need a taxi for the whole day.",
"fr": "Bonjour. Il me faut un taxi pour toute la journée.",
"wo": "Jàmm nga fanaan. Dama soxla taksi ngir bés bi bépp.",
"scene": "🚖 Louer un taxi pour la journée"
},
{
"role": "chauffeur",
"en": "Yes, where do you want to go?",
"fr": "Oui, vous voulez aller où ?",
"wo": "Waaw, fan nga bëgg a dem ?"
},
{
"role": "client",
"en": "Dakar, then Gorée, then back to Thiès.",
"fr": "Dakar, puis Gorée, puis retour à Thiès.",
"wo": "Ndakaaru, gannaaw gi Gorée, ba noppi dellusi Cees."
},
{
"role": "chauffeur",
"en": "That is a long day. It is sixty thousand francs.",
"fr": "C'est une longue journée. C'est soixante mille francs.",
"wo": "Bés bu gudd la. Juróom-benn-fukki junni farã la."
},
{
"role": "client",
"en": "It is expensive. Can you do fifty thousand?",
"fr": "C'est cher. Vous pouvez faire cinquante mille ?",
"wo": "Dafa seer. Ndax mën nga def juróom-fukki junni ?"
},
{
"role": "chauffeur",
"en": "Okay, fifty-five thousand, with the fuel included.",
"fr": "D'accord, cinquante-cinq mille, carburant compris.",
"wo": "Waaw, juróom-fukki junni ak juróomi junni, boole ci gaswaal bi."
},
{
"role": "client",
"en": "Good. What time can we leave tomorrow?",
"fr": "Bien. On peut partir à quelle heure demain ?",
"wo": "Baax na. Ban waxtu lanu mën a dem suba ?"
},
{
"role": "chauffeur",
"en": "At seven o'clock, in front of your hotel.",
"fr": "À sept heures, devant votre hôtel.",
"wo": "Ci juróom-ñaari waxtu, ci kanamu sa otel."
}
];
  var FIX = {"Turn left": "Jàddal ci càmmoñ.", "Turn right": "Jàddal ci ndey-joor.", "Please use the meter": "Jëfandikool kompteer bi, bu la neexee.", "Can you wait for me for one hour?": "Ndax mën nga ma xaar benn waxtu ?", "How long does it take to get to Saly?": "Ñaata waxtu lay jël ba àgg Saly ?", "The traffic is heavy at this time": "Yoon wi dafa fees ak oto ci waxtu wii.", "Could you put the air conditioning on?": "Ndax mën nga taal klimatisëer bi ?", "The fare to the city centre is five thousand francs": "Njëg li ba ci digg dëkk bi mooy juróomi junni farã.", "I need a receipt, please": "Dama soxla resi, bu la neexee.", "I would like to rent a car with a driver for three days.": "Dama bëgg a luwaas benn oto ak soofër ngir ñetti fan.", "Is fuel included in the daily price?": "Ndax gaswaal bokk na ci njëgu bés bi ?", "What is the deposit and is it refundable?": "Ñaata la koosoŋ bi te ndax dañu koy delloo ?", "We can arrange a shuttle for your group from the hotel to the airport.": "Mën nanu la defal nawett ngir sa gurup, jóge ci otel bi ba ci aeroport bi.", "I have to report a small accident to the insurance company.": "War naa xamal asirans bi ci benn aksidaŋ bu ndaw.", "Please check the tyres and the spare wheel before we leave.": "Seetal pnë yi ak rëw de sekuur bi balaa nuy dem, bu la neexee.", "For a long trip to Ziguinchor, I recommend leaving very early.": "Ngir tukki bu gudd bi ba Siguinsoor, damay digal nga dem suba teel."};
  C.tour_transport.vocab.forEach(function (v) { if (FIX[v.en]) v.wo = FIX[v.en]; });
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.tour_transport.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.tour_transport.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.tour_transport.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.tour_transport.vocab.length = 0; tri.forEach(function (t) { C.tour_transport.vocab.push(t[0]); });
  D.tour_transport = D.tour_transport || [];
  var vus = {}; D.tour_transport.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.tour_transport.push(l); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-transport-plus.js",e);}

try{
/* ---- diisoo-mission-transport.js ---- */
/* diisoo-mission-transport.js v1 : Mission « Conduire un client »
   L'app joue le vendeur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Transport ».
   Bouton place en haut du secteur « Transport » (Business). Essai : https://diisoo.sn/?mission=transport */
(function () {
  "use strict";
  if (window.DiisooMissionTransport) return;
  var Q = [
    { q: "Hello. Can you take me to Saly, please?", kw: /yes|sure|saly|of course|how many|people|take|ok|okay|where|go/i, m: "Yes, of course. How many people are you?" },
    { q: "It is just me and one suitcase. How much is it?", kw: /thousand|francs|\d|price|fare|cost|ride|it is/i, m: "It is fifteen thousand francs." },
    { q: "That is too expensive. Can you lower the price?", kw: /lower|price|last|okay|ok|thousand|francs|\d|discount|best|offer|twelve/i, m: "Okay, twelve thousand. That is my last price." },
    { q: "Okay. How long does it take to get there?", kw: /hour|hours|minutes|about|one|two|long|traffic|arrive|\d/i, m: "It takes about one hour." },
    { q: "Please stop here. Can I have a receipt?", kw: /yes|sure|receipt|stop|here|of course|ok|okay|here you are|thank/i, m: "Yes, of course. Here is your receipt." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mtr{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mtr .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mtr .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mtr .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mtr button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mtr .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mtr .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mtr .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mtr .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mtr .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mtr .ok{color:#25D366}#mtr .or{color:#FFAA3C}" +
    "#mtr-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mtr-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mtr")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mtr";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🚖 Transport · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mtr-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mtr-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mtr-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mtr-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mtr-skip" type="button">Passer</button>' +
        '<button class="b3" id="mtr-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mtr-r"), mic = document.getElementById("mtr-mic"), nx = document.getElementById("mtr-next");
      document.getElementById("mtr-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mtr-x").onclick = function () { o.remove(); };
      document.getElementById("mtr-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
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
        try { if (typeof BADGES !== "undefined" && !BADGES["transport"]) BADGES["transport"] = { icon: "🚖", label: "Transport", desc: "Course de taxi réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("transport"); } catch (e) {}
      }
      noter("mission_transport", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🚖 Mission Transport</div><div class="q">' + (ok ? "Bien joué ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Transport » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du secteur Transport et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mtr-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mtr-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mtr-x2" type="button">Fermer</button>';
      document.getElementById("mtr-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mtr-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mtr-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma course de taxi en anglais sur Diisoo 🚖 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
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
    var box = document.getElementById("business-content");
    if (!box || box.classList.contains("hidden") || document.getElementById("mtr-btn")) return;
    var id = ""; try { id = businessModule; } catch (e) {}
    if (id !== "tour_transport") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mtr-btn";
    b.innerHTML = '<span style="font-size:22px">🚖</span><span>Mission : conduire un client<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    var h = box.querySelector("h4"); if (h && h.nextSibling) box.insertBefore(b, h.nextSibling); else box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("business-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true, attributes: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionTransport = { ouvrir: ouvrir };
  if (/[?&]mission=transport/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-transport.js",e);}

try{
/* ---- diisoo-artisanat-plus.js ---- */
/* diisoo-tour_artisanat-plus.js v1 : Business, Artisanat (mode et beauté) enrichi
   Wolof des phrases existantes complété, +15 phrases, 1 dialogue. Wolof relu par Babacar.
   Desactivable : ?tour_artisanat=0 */
(function () {
  "use strict";
  if (window.__diisooArtisanatPlus || /[?&]tour_artisanat=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.tour_artisanat) return;
  window.__diisooArtisanatPlus = true;
  var V = [
{
"niveau": "debutant",
"en": "May I see that bag?",
"fr": "Je peux voir ce sac ?",
"wo": "Ndax mën naa gis saaku bii ?"
},
{
"niveau": "debutant",
"en": "How much is the bracelet?",
"fr": "Combien coûte le bracelet ?",
"wo": "Ñaata la barasle bi ?"
},
{
"niveau": "debutant",
"en": "Do you have other colours?",
"fr": "Vous avez d'autres couleurs ?",
"wo": "Ndax am nga yeneen kuloor ?"
},
{
"niveau": "debutant",
"en": "It is too big for me.",
"fr": "C'est trop grand pour moi.",
"wo": "Dafa réy lool ngir man."
},
{
"niveau": "debutant",
"en": "I like this one.",
"fr": "J'aime celui-ci.",
"wo": "Bii neex na ma."
},
{
"niveau": "intermediaire",
"en": "Who made this piece?",
"fr": "Qui a fabriqué cette pièce ?",
"wo": "Ku defar yëf bii ?"
},
{
"niveau": "intermediaire",
"en": "How long did it take to make?",
"fr": "Combien de temps a pris la fabrication ?",
"wo": "Ñaata waxtu la jël ngir defar ko ?"
},
{
"niveau": "intermediaire",
"en": "Can you engrave my name on it?",
"fr": "Vous pouvez graver mon nom dessus ?",
"wo": "Ndax mën nga ma bind sama tur ci kawam ?"
},
{
"niveau": "intermediaire",
"en": "Is this basket made of straw or leather?",
"fr": "Ce panier est en paille ou en cuir ?",
"wo": "Ndax pañe bii ñax lañu ko defare walla der ?"
},
{
"niveau": "intermediaire",
"en": "Can I take a photo of your workshop?",
"fr": "Je peux photographier votre atelier ?",
"wo": "Ndax mën naa jël nataalu sa ateliye bi ?"
},
{
"niveau": "avance",
"en": "I am a shop owner abroad. Do you sell in bulk?",
"fr": "Je tiens une boutique à l'étranger. Vous vendez en gros ?",
"wo": "Maa ngi yor butik ci biti réew. Ndax dangay jaay en gros ?"
},
{
"niveau": "avance",
"en": "Can you guarantee the delivery date for an order of fifty pieces?",
"fr": "Vous pouvez garantir la date de livraison pour cinquante pièces ?",
"wo": "Ndax mën nga ma wóoral bésu yónnee bi ngir juróom-fukki yëf ?"
},
{
"niveau": "avance",
"en": "I would like to see a certificate of origin for this piece.",
"fr": "Je voudrais voir un certificat d'origine pour cette pièce.",
"wo": "Dama bëgg a gis sertifika bu fa mu jóge ngir yëf bii."
},
{
"niveau": "avance",
"en": "Do you accept orders by WhatsApp and payment by Wave?",
"fr": "Vous acceptez les commandes par WhatsApp et le paiement par Wave ?",
"wo": "Ndax dangeen di nangu komànd ci WhatsApp ak faye Wave ?"
},
{
"niveau": "avance",
"en": "The colour is different from the photo. I would like an exchange.",
"fr": "La couleur est différente de la photo. Je voudrais un échange.",
"wo": "Kuloor bi wuute na ak nataal bi. Dama bëgg ñu soppi ma ko."
}
];
  var L = [
{
"role": "touriste",
"en": "Hello. I am looking for a gift for my family.",
"fr": "Bonjour. Je cherche un cadeau pour ma famille.",
"wo": "Jàmm nga fanaan. Maa ngi seet kado ngir sama njaboot.",
"scene": "🎨 Acheter un souvenir au marché artisanal"
},
{
"role": "artisan",
"en": "Welcome. Everything here is handmade.",
"fr": "Bienvenue. Tout ici est fait à la main.",
"wo": "Dalal ak jàmm. Lépp fii loxo lañu ko defare."
},
{
"role": "touriste",
"en": "This bag is very beautiful. How much is it?",
"fr": "Ce sac est très beau. Combien coûte-t-il ?",
"wo": "Saaku bii rafet na torop. Ñaata la ?"
},
{
"role": "artisan",
"en": "Twenty thousand francs. It is made of real leather.",
"fr": "Vingt mille francs. Il est en vrai cuir.",
"wo": "Ñaar-fukki junni farã. Der bu dëgg la."
},
{
"role": "touriste",
"en": "That is a lot. Can you do fifteen thousand?",
"fr": "C'est beaucoup. Vous pouvez faire quinze mille ?",
"wo": "Dafa bari. Ndax mën nga def fukk ak juróomi junni ?"
},
{
"role": "artisan",
"en": "For you, eighteen thousand and I add a small keyring.",
"fr": "Pour vous, dix-huit mille et j'ajoute un petit porte-clés.",
"wo": "Ngir yaw, fukk ak juróom-ñetti junni, te dinaa yokk benn porte-clé bu ndaw."
},
{
"role": "touriste",
"en": "Okay, deal. Can you wrap it carefully?",
"fr": "D'accord, c'est bon. Vous pouvez l'emballer avec soin ?",
"wo": "Waaw, baax na. Ndax mën nga ko laxas bu baax ?"
},
{
"role": "artisan",
"en": "Of course. Thank you, and come back soon.",
"fr": "Bien sûr. Merci, et revenez bientôt.",
"wo": "Waaw kay. Jërëjëf, te dellusil ci lu gaaw."
}
];
  var FIX = {"Can I pay by card?": "Ndax mën naa fay ci kart ?", "Do you have a smaller size?": "Ndax am nga lu gën a ndaw ?", "This mask is made of wood from the Casamance": "Mask bii banti Kasamaas lañu ko defare.", "The price is fixed, but I can make a small gift": "Njëg li dafa tënku, waaye mën naa la may benn kado bu ndaw.", "What is the best price you can give me?": "Ban njëg lu gën a tuuti nga ma mën a jox ?", "Can you wrap it so it does not break in my suitcase?": "Ndax mën nga ko laxas ba du toj ci sama waliis ?", "Is this leather real?": "Ndax der bii dëgg la ?", "I am looking for a gift for my mother": "Maa ngi seet kado ngir sama yaay.", "This cloth is dyed with natural colours": "Ràbb bii dañu ko suub ak kuloor yu natirel.", "Each piece is unique and signed by the artist.": "Benn bu nekk melul ni beneen te artist bi moo ko siñe.", "If you buy three pieces, I can offer a fifteen percent discount.": "Soo jëndee ñetti yëf, mën naa la wàññil fukk ak juróomi pursaŋ.", "I can ship it to Europe and give you a customs invoice.": "Mën naa ko yónnee Tugal te jox la faktir bu duwaan.", "I am sorry, this item is not for export because it is protected wood.": "Baal ma, yëf bii mënul a génn réew mi ndax bant bu ñu aar la.", "Our cooperative supports thirty families in the village.": "Sunu koperatiw dafay dimbali fanweeri njaboot ci dëkk bi.", "Could you make one for me in a different colour? I can wait three days.": "Ndax mën nga ma defal benn ci beneen kuloor ? Mën naa xaar ñetti fan.", "The price is high because it takes two weeks to weave.": "Njëg li dafa seer ndax dafay jël ñaari ayu-bés ngir ràbb ko."};
  C.tour_artisanat.vocab.forEach(function (v) { if (FIX[v.en]) v.wo = FIX[v.en]; });
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.tour_artisanat.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.tour_artisanat.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.tour_artisanat.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.tour_artisanat.vocab.length = 0; tri.forEach(function (t) { C.tour_artisanat.vocab.push(t[0]); });
  D.tour_artisanat = D.tour_artisanat || [];
  var vus = {}; D.tour_artisanat.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.tour_artisanat.push(l); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-artisanat-plus.js",e);}

try{
/* ---- diisoo-mission-artisanat.js ---- */
/* diisoo-mission-artisanat.js v1 : Mission « Vendre mon artisanat »
   L'app joue le vendeur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Artisanat ».
   Bouton place en haut du secteur « Artisanat » (Business). Essai : https://diisoo.sn/?mission=artisanat */
(function () {
  "use strict";
  if (window.DiisooMissionArtisanat) return;
  var Q = [
    { q: "Hello. This bag is beautiful. Is it handmade?", kw: /yes|handmade|hand|made|leather|local|artisan|myself|workshop|real/i, m: "Yes, it is handmade, in leather." },
    { q: "How much is it?", kw: /thousand|francs|\d|price|cost|it is|twenty|fifteen/i, m: "It is twenty thousand francs." },
    { q: "That is expensive. Can you lower the price?", kw: /lower|price|thousand|francs|\d|discount|okay|ok|best|eighteen|fifteen|special/i, m: "For you, eighteen thousand." },
    { q: "Okay. Can you wrap it so it does not break in my suitcase?", kw: /yes|sure|wrap|carefully|of course|paper|box|bag|ok|okay/i, m: "Yes, of course. I will wrap it carefully." },
    { q: "Can I pay by card or Wave?", kw: /wave|card|cash|yes|no|mobile|orange|pay|only|accept/i, m: "Yes, you can pay with Wave or cash." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mat{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mat .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mat .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mat .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mat button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mat .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mat .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mat .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mat .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mat .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mat .ok{color:#25D366}#mat .or{color:#FFAA3C}" +
    "#mat-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mat-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mat")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mat";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🎨 Artisanat · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mat-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mat-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mat-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mat-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mat-skip" type="button">Passer</button>' +
        '<button class="b3" id="mat-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mat-r"), mic = document.getElementById("mat-mic"), nx = document.getElementById("mat-next");
      document.getElementById("mat-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mat-x").onclick = function () { o.remove(); };
      document.getElementById("mat-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
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
        try { if (typeof BADGES !== "undefined" && !BADGES["artisanat"]) BADGES["artisanat"] = { icon: "🎨", label: "Artisanat", desc: "Vente d'artisanat réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("artisanat"); } catch (e) {}
      }
      noter("mission_artisanat", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🎨 Mission Artisanat</div><div class="q">' + (ok ? "Bien joué ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Artisanat » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du secteur Artisanat et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mat-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mat-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mat-x2" type="button">Fermer</button>';
      document.getElementById("mat-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mat-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mat-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma vente d'artisanat en anglais sur Diisoo 🎨 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
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
    var box = document.getElementById("business-content");
    if (!box || box.classList.contains("hidden") || document.getElementById("mat-btn")) return;
    var id = ""; try { id = businessModule; } catch (e) {}
    if (id !== "tour_artisanat") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mat-btn";
    b.innerHTML = '<span style="font-size:22px">🎨</span><span>Mission : vendre mon artisanat<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    var h = box.querySelector("h4"); if (h && h.nextSibling) box.insertBefore(b, h.nextSibling); else box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("business-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true, attributes: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionArtisanat = { ouvrir: ouvrir };
  if (/[?&]mission=artisanat/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-artisanat.js",e);}

try{
/* ---- diisoo-agence-plus.js ---- */
/* diisoo-tour_agence-plus.js v1 : Business, Agence (mode et beauté) enrichi
   Wolof des phrases existantes complété, +15 phrases, 1 dialogue. Wolof relu par Babacar.
   Desactivable : ?tour_agence=0 */
(function () {
  "use strict";
  if (window.__diisooAgencePlus || /[?&]tour_agence=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.tour_agence) return;
  window.__diisooAgencePlus = true;
  var V = [
{
"niveau": "debutant",
"en": "What is your name, please?",
"fr": "Quel est votre nom, s'il vous plaît ?",
"wo": "Naka nga tudd, bu la neexee ?"
},
{
"niveau": "debutant",
"en": "How many people are travelling?",
"fr": "Combien de personnes voyagent ?",
"wo": "Ñaata nit ñoo di tukki ?"
},
{
"niveau": "debutant",
"en": "Here is your ticket.",
"fr": "Voici votre billet.",
"wo": "Sa tike bi mii ngi nii."
},
{
"niveau": "debutant",
"en": "Please sign here.",
"fr": "Signez ici, s'il vous plaît.",
"wo": "Siñeel fii, bu la neexee."
},
{
"niveau": "debutant",
"en": "Is it your first trip abroad?",
"fr": "C'est votre premier voyage à l'étranger ?",
"wo": "Ndax sa tukki bu njëkk ci biti réew la ?"
},
{
"niveau": "intermediaire",
"en": "Which airline do you prefer?",
"fr": "Quelle compagnie aérienne préférez-vous ?",
"wo": "Ban kompañi awiyoŋ nga gën a bëgg ?"
},
{
"niveau": "intermediaire",
"en": "The visa takes about two weeks.",
"fr": "Le visa prend environ deux semaines.",
"wo": "Wisa bi dafay jël lu tollook ñaari ayu-bés."
},
{
"niveau": "intermediaire",
"en": "You can pay in two instalments.",
"fr": "Vous pouvez payer en deux fois.",
"wo": "Mën nga fay ci ñaari yoon."
},
{
"niveau": "intermediaire",
"en": "I will send the ticket to your WhatsApp.",
"fr": "J'envoie le billet sur votre WhatsApp.",
"wo": "Dinaa yónnee tike bi ci sa WhatsApp."
},
{
"niveau": "intermediaire",
"en": "Do you have a vaccination certificate?",
"fr": "Vous avez un carnet de vaccination ?",
"wo": "Ndax am nga karne bu vaksinasiyoŋ ?"
},
{
"niveau": "avance",
"en": "The flight is delayed. We will inform you as soon as we know more.",
"fr": "Le vol est retardé. Nous vous informons dès que nous en savons plus.",
"wo": "Vol bi yeex na. Dinanu la xamal bu nu xamee lu ci gën a leer."
},
{
"niveau": "avance",
"en": "I need to change the name on the ticket. There is a spelling mistake.",
"fr": "Je dois changer le nom sur le billet. Il y a une faute d'orthographe.",
"wo": "War naa soppi tur bi ci tike bi. Am na njuumte ci mbind mi."
},
{
"niveau": "avance",
"en": "Can you book a package with flight, hotel and airport transfer?",
"fr": "Vous pouvez réserver un forfait avec vol, hôtel et transfert ?",
"wo": "Ndax mën nga reserwe pak bu am vol, otel ak transfer ?"
},
{
"niveau": "avance",
"en": "My visa was refused. What can I do?",
"fr": "Mon visa a été refusé. Que puis-je faire ?",
"wo": "Sama wisa dañu ko bañ."
},
{
"niveau": "avance",
"en": "I would like a refund for the unused part of the trip.",
"fr": "Je voudrais un remboursement pour la partie non utilisée du voyage.",
"wo": "Dama bëgg ñu delloo ma xaalis bi ngir wàll gi ma tukkiwul."
}
];
  var L = [
{
"role": "client",
"en": "Hello. I would like to go to Casablanca in December.",
"fr": "Bonjour. Je voudrais aller à Casablanca en décembre.",
"wo": "Jàmm nga fanaan. Dama bëgg a dem Kasablanka ci desàmbar.",
"scene": "✈️ Réserver un voyage pour le Maroc"
},
{
"role": "agent",
"en": "Very well. For how many days?",
"fr": "Très bien. Pour combien de jours ?",
"wo": "Baax na. Ngir ñaata fan ?"
},
{
"role": "client",
"en": "Seven days. I want a hotel near the city centre.",
"fr": "Sept jours. Je veux un hôtel près du centre-ville.",
"wo": "Juróom-ñaari fan. Dama bëgg otel bu jege digg dëkk bi."
},
{
"role": "agent",
"en": "Okay. The flight and the hotel together cost five hundred thousand francs.",
"fr": "D'accord. Le vol et l'hôtel ensemble coûtent cinq cent mille francs.",
"wo": "Waaw. Vol bi ak otel bi, boole leen, juróom-téeméeri junni farã la."
},
{
"role": "client",
"en": "Do I need a visa?",
"fr": "J'ai besoin d'un visa ?",
"wo": "Ndax soxla naa wisa ?"
},
{
"role": "agent",
"en": "No, Senegalese citizens do not need a visa for Morocco.",
"fr": "Non, les Sénégalais n'ont pas besoin de visa pour le Maroc.",
"wo": "Déedéet, doomi Senegaal soxlawuñu wisa ngir Maroog."
},
{
"role": "client",
"en": "Perfect. Can I pay half now and half next week?",
"fr": "Parfait. Je peux payer la moitié maintenant et la moitié la semaine prochaine ?",
"wo": "Baax na lool. Ndax mën naa fay genn-wàll gi léegi, beneen genn-wàll bi ayu-bés bi di ñëw ?"
},
{
"role": "agent",
"en": "Yes. Please give me your passport to confirm the booking.",
"fr": "Oui. Donnez-moi votre passeport pour confirmer la réservation.",
"wo": "Waaw. Joxal ma sa paspoor ngir dëggal reserwaasiyoŋ bi."
}
];
  var FIX = {"One way or return?": "Dem rekk walla dem ak dellusi ?", "Your ticket is confirmed": "Sa tike bi wóor na.", "The flight leaves at eight in the morning": "Awiyoŋ bi dafay dem ci juróom-ñetti waxtu ci suba.", "Do you want a direct flight or with a stopover?": "Ndax bëgg nga vol bu direkt walla bu am eskaal ?", "The price includes a twenty-three kilo bag": "Njëg li dafa boole saaku bu ñaar-fukk ak ñetti kilo.", "You must arrive at the airport three hours before": "War nga àggsi ci aeroport bi ñetti waxtu balaa dem bi.", "Your passport must be valid for six months": "Sa paspoor war na am juróom-benni weer yu des ci kaw.", "Do you need a visa for this country?": "Ndax soxla nga wisa ngir réew mii ?", "I can reserve a hotel for you near the city centre": "Mën naa la reserwe otel bu jege digg dëkk bi.", "Would you like travel insurance?": "Ndax bëgg nga asirans ngir tukki bi ?", "The cheapest fare is non-refundable. A flexible ticket costs more.": "Njëg li gën a yomb amul delloo xaalis. Tike bu ñu mën a soppi dafa gën a seer.", "To change the date, there is a fee of fifty euros plus the fare difference.": "Ngir soppi bés bi, am na fay bu juróom-fukki ero ak li yokku ci njëg li.", "Your visa application needs a bank statement, a hotel booking and a return ticket.": "Sa laaj bu wisa soxla na relewe bànk, reserwaasiyoŋ otel ak tike bu dem ak dellusi.", "I will prepare a complete itinerary and send you a quotation today.": "Dinaa defar benn yoonu tukki bu mat te yónnee la devis tey.", "The airline cancelled your flight. We can rebook you or refund you.": "Kompañi awiyoŋ bi anile na sa vol. Mën nanu la dugal ci beneen walla delloo la xaalis bi.", "For a group of ten, we can negotiate a special rate with the airline.": "Ngir gurup bu fukki nit, mën nanu waxtaan ak kompañi bi ngir njëg lu gën a yomb.", "Please pay a deposit of thirty percent to confirm the booking.": "Fayal awãas bu fanweeri pursaŋ ngir dëggal reserwaasiyoŋ bi."};
  C.tour_agence.vocab.forEach(function (v) { if (FIX[v.en]) v.wo = FIX[v.en]; });
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.tour_agence.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.tour_agence.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.tour_agence.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.tour_agence.vocab.length = 0; tri.forEach(function (t) { C.tour_agence.vocab.push(t[0]); });
  D.tour_agence = D.tour_agence || [];
  var vus = {}; D.tour_agence.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.tour_agence.push(l); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-agence-plus.js",e);}

try{
/* ---- diisoo-mission-agence.js ---- */
/* diisoo-mission-agence.js v1 : Mission « Vendre un billet d'avion »
   L'app joue le vendeur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Agence ».
   Bouton place en haut du secteur « Agence de voyage » (Business). Essai : https://diisoo.sn/?mission=agence */
(function () {
  "use strict";
  if (window.DiisooMissionAgence) return;
  var Q = [
    { q: "Hello. I would like to travel to Paris next month.", kw: /yes|sure|paris|welcome|of course|how many|when|date|travel|help|ok|okay|dates/i, m: "Of course. What dates do you want to travel?" },
    { q: "I want to leave on the tenth. One way or return?", kw: /return|one way|one-way|round|both|ticket|which|do you|would you/i, m: "Would you like a one way or a return ticket?" },
    { q: "Return, please. How much is the ticket?", kw: /thousand|francs|\d|price|cost|ticket|euro|it is|total/i, m: "The return ticket is three hundred and eighty thousand francs." },
    { q: "Is the luggage included?", kw: /yes|no|included|include|luggage|bag|suitcase|kilo|kilos|twenty|extra/i, m: "Yes, one suitcase of twenty-three kilos is included." },
    { q: "Okay. Can I pay half now and half next week?", kw: /yes|sure|pay|half|deposit|instalment|installment|ok|okay|passport|confirm|please/i, m: "Yes. Please give me your passport to confirm the booking." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mae{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mae .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mae .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mae .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mae button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mae .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mae .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mae .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mae .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mae .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mae .ok{color:#25D366}#mae .or{color:#FFAA3C}" +
    "#mae-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mae-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mae")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mae";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">✈️ Agence · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mae-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mae-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mae-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mae-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mae-skip" type="button">Passer</button>' +
        '<button class="b3" id="mae-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mae-r"), mic = document.getElementById("mae-mic"), nx = document.getElementById("mae-next");
      document.getElementById("mae-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mae-x").onclick = function () { o.remove(); };
      document.getElementById("mae-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
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
        try { if (typeof BADGES !== "undefined" && !BADGES["agence"]) BADGES["agence"] = { icon: "✈️", label: "Agence", desc: "Vente d'un billet réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("agence"); } catch (e) {}
      }
      noter("mission_agence", score + "/" + Q.length);
      o.innerHTML = '<div class="k">✈️ Mission Agence</div><div class="q">' + (ok ? "Bien joué ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Agence » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du secteur Agence et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mae-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mae-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mae-x2" type="button">Fermer</button>';
      document.getElementById("mae-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mae-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mae-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma vente de billet d'avion en anglais sur Diisoo ✈️ (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
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
    var box = document.getElementById("business-content");
    if (!box || box.classList.contains("hidden") || document.getElementById("mae-btn")) return;
    var id = ""; try { id = businessModule; } catch (e) {}
    if (id !== "tour_agence") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mae-btn";
    b.innerHTML = '<span style="font-size:22px">✈️</span><span>Mission : vendre un billet d\'avion<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    var h = box.querySelector("h4"); if (h && h.nextSibling) box.insertBefore(b, h.nextSibling); else box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("business-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true, attributes: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionAgence = { ouvrir: ouvrir };
  if (/[?&]mission=agence/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-agence.js",e);}

try{
/* ---- diisoo-plage-plus.js ---- */
/* diisoo-tour_plage-plus.js v1 : Business, Plage (mode et beauté) enrichi
   Wolof des phrases existantes complété, +15 phrases, 1 dialogue. Wolof relu par Babacar.
   Desactivable : ?tour_plage=0 */
(function () {
  "use strict";
  if (window.__diisooPlagePlus || /[?&]tour_plage=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.tour_plage) return;
  window.__diisooPlagePlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Where can I change?",
"fr": "Où puis-je me changer ?",
"wo": "Fan laa mën a soppee samay yéere ?"
},
{
"niveau": "debutant",
"en": "A bottle of cold water, please.",
"fr": "Une bouteille d'eau fraîche, s'il vous plaît.",
"wo": "Benn butéelu ndox mu sedd, bu la neexee."
},
{
"niveau": "debutant",
"en": "How much is the sunbed?",
"fr": "Combien coûte le transat ?",
"wo": "Ñaata la lal bu jant bi ?"
},
{
"niveau": "debutant",
"en": "Is there a shower?",
"fr": "Il y a une douche ?",
"wo": "Ndax am na duus ?"
},
{
"niveau": "debutant",
"en": "Do not go too far.",
"fr": "N'allez pas trop loin.",
"wo": "Bul dem ba sori lool."
},
{
"niveau": "intermediaire",
"en": "The tide is coming in. Move your things.",
"fr": "La marée monte. Déplacez vos affaires.",
"wo": "Géej gi dafay fees. Toxalal say yëf."
},
{
"niveau": "intermediaire",
"en": "Can I leave my bag with you while I swim?",
"fr": "Je peux laisser mon sac avec vous pendant que je nage ?",
"wo": "Ndax mën naa bàyyi sama saaku ci yaw ba ma di féey ?"
},
{
"niveau": "intermediaire",
"en": "We offer a fishing trip with local fishermen.",
"fr": "Nous proposons une sortie de pêche avec des pêcheurs locaux.",
"wo": "Dañuy joxe benn tukki napp ak nappkat yu dëkk fii."
},
{
"niveau": "intermediaire",
"en": "The red flag means that swimming is forbidden.",
"fr": "Le drapeau rouge signifie que la baignade est interdite.",
"wo": "Drapo bu xonq bi dafay wax ne féey araam na."
},
{
"niveau": "intermediaire",
"en": "Put on sun cream, the sun is strong.",
"fr": "Mettez de la crème solaire, le soleil est fort.",
"wo": "Diwal keremu jant, jant bi dafa tàng lool."
},
{
"niveau": "avance",
"en": "I would like to organise a birthday party on the beach for twenty people.",
"fr": "Je voudrais organiser une fête d'anniversaire sur la plage pour vingt personnes.",
"wo": "Dama bëgg a wàajal benn màggalu bésu juddu ci tefes bi ngir ñaar-fukki nit."
},
{
"niveau": "avance",
"en": "Is it possible to camp on the beach for one night?",
"fr": "Il est possible de camper sur la plage pour une nuit ?",
"wo": "Ndax mën nanu def kamp ci tefes bi ngir benn guddi ?"
},
{
"niveau": "avance",
"en": "There is a jellyfish. Where is the first aid post?",
"fr": "Il y a une méduse. Où est le poste de premiers secours ?",
"wo": "Am na meduuz. Fan la berebu ndimbal bu njëkk bi nekk ?"
},
{
"niveau": "avance",
"en": "Can you take a group photo of us at sunset?",
"fr": "Vous pouvez nous prendre en photo de groupe au coucher du soleil ?",
"wo": "Ndax mën nga nu jël nataalu mbooloo ci jant bi di so ?"
},
{
"niveau": "avance",
"en": "Do you offer a discount for a group of fifteen people?",
"fr": "Vous faites une remise pour un groupe de quinze personnes ?",
"wo": "Ndax dangeen di wàññi njëg ngir mbooloo mu fukk ak juróomi nit ?"
}
];
  var L = [
{
"role": "touriste",
"en": "Hello. Is it safe to take a boat trip today?",
"fr": "Bonjour. C'est sûr de faire une sortie en bateau aujourd'hui ?",
"wo": "Jàmm nga fanaan. Ndax am na kaaraange ngir dem ci tukki gaal tey ?",
"scene": "🏖️ Réserver une sortie en pirogue"
},
{
"role": "pecheur",
"en": "Yes, the sea is calm. We leave at four o'clock.",
"fr": "Oui, la mer est calme. Nous partons à seize heures.",
"wo": "Waaw, géej gi dal na. Danuy dem ci ñeenti waxtu."
},
{
"role": "touriste",
"en": "How long is the trip and how much is it?",
"fr": "Combien de temps dure la sortie et combien ça coûte ?",
"wo": "Ñaata waxtu la tukki bi di yàgg te ñaata la ?"
},
{
"role": "pecheur",
"en": "Two hours, five thousand francs per person. Life jackets are free.",
"fr": "Deux heures, cinq mille francs par personne. Les gilets sont gratuits.",
"wo": "Ñaari waxtu, juróomi junni farã ku nekk. Yérey mucc ci ndox yi amuñu fay."
},
{
"role": "touriste",
"en": "We are four people. Can we have a discount?",
"fr": "Nous sommes quatre. On peut avoir une remise ?",
"wo": "Nun ñeent lanu. Ndax mën nanu am wàññi njëg ?"
},
{
"role": "pecheur",
"en": "For four people, eighteen thousand in total.",
"fr": "Pour quatre personnes, dix-huit mille au total.",
"wo": "Ngir ñeenti nit, fukk ak juróom-ñetti junni lépp."
},
{
"role": "touriste",
"en": "Perfect. Can we see dolphins?",
"fr": "Parfait. On peut voir des dauphins ?",
"wo": "Baax na lool. Ndax mën nanu gis ay dofin ?"
},
{
"role": "pecheur",
"en": "Maybe, if we are lucky. Please be at the beach at four.",
"fr": "Peut-être, avec un peu de chance. Soyez à la plage à seize heures.",
"wo": "Xanaa, su nu amee wërsëg. Ñëwal ci tefes bi ci ñeenti waxtu, bu la neexee."
}
];
  var FIX = {"Is it safe to swim here?": "Ndax am na kaaraange ngir féey fii ?", "Do you want a parasol?": "Ndax bëgg nga parasol ?", "The water is warm": "Ndox mi dafa tàng.", "Do not leave your bag alone": "Bul bàyyi sa saaku moom rekk.", "Do you want to go on a boat trip?": "Ndax bëgg nga dem ci tukki gaal ?", "The sunset is wonderful": "Jant bi di so rafet na lool.", "Surf lessons start at ten in the morning": "Njàggalem surf bi dafay tàmbali ci fukki waxtu ci suba.", "The fishermen come back at five in the afternoon": "Nappkat yi dañuy dellusi ci juróomi waxtu ci ngoon.", "Beware of strong currents, swim between the flags": "Moytul wal mu dëgër mi, féeyal ci diggante drapo yi.", "I want to rent a kayak for two hours": "Dama bëgg a luwaas benn kayak ngir ñaari waxtu.", "The boat trip to the mangroves takes ninety minutes": "Tukki gaal bi ba ci mangrov yi dafay jël juróom-ñeent-fukki simili.", "Life jackets are provided for everyone": "Yérey mucc ci ndox yi am nañu ngir ñépp.", "Fresh grilled fish is served on the beach at noon": "Jën wu bees wu ñu lakk dañu koy joxe ci tefes bi ci digg-bëccëg.", "Our resort offers a full-board package with water sports and an evening show.": "Sunu otel dafay joxe pak bu mat sëkk ak lekk, ay po ci ndox ak benn poñ ci ngoon.", "The sea is rough today, so the boat trip is postponed until tomorrow.": "Géej gi dafa xul tey, kon tukki gaal bi dañu ko randal ba suba.", "Children under twelve must be accompanied by an adult.": "Xale yi amagul fukki at ak ñaar war nañu ànd ak mag.", "We can organise a beach wedding for eighty guests.": "Mën nanu wàajal céet ci tefes bi ngir juróom-ñett-fukki gan.", "Please respect the turtle nests and do not leave plastic on the beach.": "Wormaalal tëggu mbonaat yi te bul bàyyi plastik ci tefes bi.", "The price of the sunset cruise includes drinks and snacks.": "Njëgu tukki gaal bi ci jant bi di so dafay boole naan ak lekk yu ndaw.", "I would like to book a private boat for my family for the whole day.": "Bëgg naa reserwe gaal bu ma moom samab bopp ngir sama njaboot ci bés bi yépp."};
  C.tour_plage.vocab.forEach(function (v) { if (FIX[v.en]) v.wo = FIX[v.en]; });
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.tour_plage.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.tour_plage.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.tour_plage.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.tour_plage.vocab.length = 0; tri.forEach(function (t) { C.tour_plage.vocab.push(t[0]); });
  D.tour_plage = D.tour_plage || [];
  var vus = {}; D.tour_plage.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.tour_plage.push(l); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-plage-plus.js",e);}

try{
/* ---- diisoo-mission-plage.js ---- */
/* diisoo-mission-plage.js v1 : Mission « Proposer une sortie en pirogue »
   L'app joue le vendeur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Plage ».
   Bouton place en haut du secteur « Plage » (Business). Essai : https://diisoo.sn/?mission=plage */
(function () {
  "use strict";
  if (window.DiisooMissionPlage) return;
  var Q = [
    { q: "Hello. Is it safe to take a boat trip today?", kw: /yes|safe|calm|sea|weather|good|sure|boat|trip|today|fine/i, m: "Yes, the sea is calm today." },
    { q: "How long is the trip?", kw: /hour|hours|minutes|two|one|about|long|\d|sunset/i, m: "The trip lasts two hours." },
    { q: "How much is it per person?", kw: /thousand|francs|\d|price|cost|person|per|five|free|included/i, m: "It is five thousand francs per person." },
    { q: "We are four people. Can we have a discount?", kw: /yes|no|discount|lower|price|thousand|francs|\d|total|group|four|okay|ok/i, m: "For four people, eighteen thousand in total." },
    { q: "Do you have life jackets? We have a child.", kw: /yes|life|jacket|jackets|child|children|small|free|all|everyone|provide/i, m: "Yes, life jackets are free, and we have a small one for the child." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mpl{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mpl .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mpl .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mpl .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mpl button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mpl .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mpl .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mpl .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mpl .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mpl .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mpl .ok{color:#25D366}#mpl .or{color:#FFAA3C}" +
    "#mpl-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mpl-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mpl")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mpl";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🏖️ Plage · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mpl-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mpl-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mpl-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mpl-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mpl-skip" type="button">Passer</button>' +
        '<button class="b3" id="mpl-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mpl-r"), mic = document.getElementById("mpl-mic"), nx = document.getElementById("mpl-next");
      document.getElementById("mpl-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mpl-x").onclick = function () { o.remove(); };
      document.getElementById("mpl-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
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
        try { if (typeof BADGES !== "undefined" && !BADGES["plage"]) BADGES["plage"] = { icon: "🏖️", label: "Plage", desc: "Sortie en pirogue proposée à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("plage"); } catch (e) {}
      }
      noter("mission_plage", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🏖️ Mission Plage</div><div class="q">' + (ok ? "Bien joué ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Plage » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du secteur Plage et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mpl-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mpl-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mpl-x2" type="button">Fermer</button>';
      document.getElementById("mpl-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mpl-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mpl-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma sortie en pirogue en anglais sur Diisoo 🏖️ (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
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
    var box = document.getElementById("business-content");
    if (!box || box.classList.contains("hidden") || document.getElementById("mpl-btn")) return;
    var id = ""; try { id = businessModule; } catch (e) {}
    if (id !== "tour_plage") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mpl-btn";
    b.innerHTML = '<span style="font-size:22px">🏖️</span><span>Mission : proposer une sortie en pirogue<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    var h = box.querySelector("h4"); if (h && h.nextSibling) box.insertBefore(b, h.nextSibling); else box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("business-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true, attributes: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionPlage = { ouvrir: ouvrir };
  if (/[?&]mission=plage/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-plage.js",e);}

try{
/* ---- diisoo-bazar-plus.js ---- */
/* diisoo-bazar-plus.js v1 : Business, Bazar (mode et beauté) enrichi
   +15 phrases et un dialogue. Wolof relu par Babacar.
   Desactivable : ?bazar=0 */
(function () {
  "use strict";
  if (window.__diisooBazarPlus || /[?&]bazar=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.bazar) return;
  window.__diisooBazarPlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Do you have a double bed?",
"fr": "Vous avez un lit double ?",
"wo": "Ndax am nga lal bu ñaari palaas ?"
},
{
"niveau": "debutant",
"en": "What colour is available?",
"fr": "Quelle couleur est disponible ?",
"wo": "Ban kuloor moo am ?"
},
{
"niveau": "debutant",
"en": "How much is the fan?",
"fr": "Combien coûte le ventilateur ?",
"wo": "Ñaata la wantilatëer bi ?"
},
{
"niveau": "debutant",
"en": "Do you sell mattresses?",
"fr": "Vous vendez des matelas ?",
"wo": "Ndax dangay jaay matela ?"
},
{
"niveau": "debutant",
"en": "I will take this one.",
"fr": "Je prends celui-ci.",
"wo": "Dinaa jël bii."
},
{
"niveau": "intermediaire",
"en": "Is the mattress hard or soft?",
"fr": "Le matelas est dur ou mou ?",
"wo": "Ndax matela bi dafa dëgër walla dafa nooy ?"
},
{
"niveau": "intermediaire",
"en": "How many months is the fridge warranty?",
"fr": "Quelle est la garantie du frigo, en mois ?",
"wo": "Ñaata weer la garanti frigo bi di yàgg ?"
},
{
"niveau": "intermediaire",
"en": "Does the cooker use gas or electricity?",
"fr": "La cuisinière marche au gaz ou à l'électricité ?",
"wo": "Ndax kuisinier bi dafay dox ci gaas walla ci kuraŋ ?"
},
{
"niveau": "intermediaire",
"en": "Can you bring it to the third floor?",
"fr": "Vous pouvez le monter au troisième étage ?",
"wo": "Ndax mën nga ko yóbbu ci ñetteelu etaas bi ?"
},
{
"niveau": "intermediaire",
"en": "Can I return it if it does not fit?",
"fr": "Je peux le rendre s'il ne rentre pas ?",
"wo": "Ndax mën naa ko delloo su xajul ?"
},
{
"niveau": "avance",
"en": "I am furnishing a new house. Can you make me a package price?",
"fr": "J'équipe une nouvelle maison. Vous pouvez me faire un prix global ?",
"wo": "Maa ngi sàmm kër gu bees. Ndax mën nga ma defal benn njëg ngir lépp ?"
},
{
"niveau": "avance",
"en": "The delivery is late. When exactly will you come?",
"fr": "La livraison est en retard. Vous venez quand exactement ?",
"wo": "Yónnee bi yeex na. Kañ ngeen di ñëw ci dëgg-dëgg ?"
},
{
"niveau": "avance",
"en": "The door of the wardrobe does not close properly.",
"fr": "La porte de l'armoire ne ferme pas bien.",
"wo": "Buntu armuwaar bi du tëj bu baax."
},
{
"niveau": "avance",
"en": "I want a written guarantee on the repair.",
"fr": "Je veux une garantie écrite pour la réparation.",
"wo": "Dama bëgg garanti bu ñu bind ngir defar bi."
},
{
"niveau": "avance",
"en": "Can you take away my old furniture?",
"fr": "Vous pouvez emporter mes vieux meubles ?",
"wo": "Ndax mën nga yóbbu sama bagaas yu màggat yi ?"
}
];
  var L = [
{
"role": "client",
"en": "Hello. I need a bed and a mattress.",
"fr": "Bonjour. Il me faut un lit et un matelas.",
"wo": "Jàmm nga fanaan. Dama soxla lit ak matela.",
"scene": "🛏️ Acheter un lit et un matelas"
},
{
"role": "marchand",
"en": "Which size do you want?",
"fr": "Quelle taille voulez-vous ?",
"wo": "Ban taille nga bëgg ?"
},
{
"role": "client",
"en": "A double bed. How much is it?",
"fr": "Un lit double. Combien coûte-t-il ?",
"wo": "Lal bu ñaari palaas. Ñaata la ?"
},
{
"role": "marchand",
"en": "Bed and mattress together, one hundred and twenty thousand francs.",
"fr": "Lit et matelas ensemble, cent vingt mille francs.",
"wo": "Lit ak matela bi, ñoom ñaar, téeméeri junni ak ñaar-fukki junni farã."
},
{
"role": "client",
"en": "It is too expensive. Can you do a better price?",
"fr": "C'est trop cher. Vous pouvez faire mieux ?",
"wo": "Dafa seer lool. Ndax mën nga def njëg lu gën a baax ?"
},
{
"role": "marchand",
"en": "For you, one hundred thousand, and delivery is free.",
"fr": "Pour vous, cent mille, et la livraison est gratuite.",
"wo": "Ngir yaw, téeméeri junni, te yónnee bi amul fay."
},
{
"role": "client",
"en": "Okay. Can you deliver it tomorrow morning?",
"fr": "D'accord. Vous pouvez livrer demain matin ?",
"wo": "Waaw. Ndax mën nga ko yónnee suba ci suba ?"
},
{
"role": "marchand",
"en": "Yes. Please give me your address and your number.",
"fr": "Oui. Donnez-moi votre adresse et votre numéro, s'il vous plaît.",
"wo": "Waaw. Joxal ma sa adrees ak sa nimero, bu la neexee."
}
];
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.bazar.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.bazar.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.bazar.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.bazar.vocab.length = 0; tri.forEach(function (t) { C.bazar.vocab.push(t[0]); });
  D.bazar = D.bazar || [];
  var vus = {}; D.bazar.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.bazar.push(l); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-bazar-plus.js",e);}

try{
/* ---- diisoo-mission-bazar.js ---- */
/* diisoo-mission-bazar.js v1 : Mission « Acheter mon lit »
   L'app joue le vendeur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Bazar ».
   Bouton place en haut du secteur « Meubles & électroménager » (Business). Essai : https://diisoo.sn/?mission=bazar */
(function () {
  "use strict";
  if (window.DiisooMissionBazar) return;
  var Q = [
    { q: "Hello. What are you looking for?", kw: /bed|mattress|sofa|table|chair|fridge|fan|looking|need|want|i/i, m: "I am looking for a bed and a mattress." },
    { q: "Which size do you want?", kw: /double|single|large|big|small|size|king|two|one/i, m: "I want a double bed." },
    { q: "It costs one hundred and twenty thousand francs.", kw: /lower|discount|price|expensive|cheaper|less|better|please|how much/i, m: "It is expensive. Can you lower the price?" },
    { q: "Okay, one hundred thousand. Do you want delivery?", kw: /yes|delivery|deliver|free|please|tomorrow|today|home|bring|ok/i, m: "Yes, please deliver it tomorrow morning." },
    { q: "How do you want to pay?", kw: /wave|orange|mobile|money|cash|pay|payment|transfer|instal|card|three/i, m: "I will pay in cash." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mbz{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mbz .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mbz .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mbz .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mbz button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mbz .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mbz .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mbz .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mbz .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mbz .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mbz .ok{color:#25D366}#mbz .or{color:#FFAA3C}" +
    "#mbz-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mbz-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mbz")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mbz";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🛏️ Bazar · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mbz-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mbz-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mbz-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mbz-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mbz-skip" type="button">Passer</button>' +
        '<button class="b3" id="mbz-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mbz-r"), mic = document.getElementById("mbz-mic"), nx = document.getElementById("mbz-next");
      document.getElementById("mbz-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mbz-x").onclick = function () { o.remove(); };
      document.getElementById("mbz-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
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
        try { if (typeof BADGES !== "undefined" && !BADGES["bazar"]) BADGES["bazar"] = { icon: "🛏️", label: "Bazar", desc: "Achat de meubles réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("bazar"); } catch (e) {}
      }
      noter("mission_bazar", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🛏️ Mission Bazar</div><div class="q">' + (ok ? "Bonne affaire ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Bazar » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du secteur Bazar et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mbz-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mbz-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mbz-x2" type="button">Fermer</button>';
      document.getElementById("mbz-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mbz-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mbz-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon achat de meubles en anglais sur Diisoo 🛏️ (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
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
    var box = document.getElementById("business-content");
    if (!box || box.classList.contains("hidden") || document.getElementById("mbz-btn")) return;
    var id = ""; try { id = businessModule; } catch (e) {}
    if (id !== "bazar") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mbz-btn";
    b.innerHTML = '<span style="font-size:22px">🛏️</span><span>Mission : acheter mon lit<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    var h = box.querySelector("h4"); if (h && h.nextSibling) box.insertBefore(b, h.nextSibling); else box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("business-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true, attributes: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionBazar = { ouvrir: ouvrir };
  if (/[?&]mission=bazar/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-bazar.js",e);}

try{
/* ---- diisoo-electronique-plus.js ---- */
/* diisoo-electronique-plus.js v1 : Business, Électronique (mode et beauté) enrichi
   +15 phrases et un dialogue. Wolof relu par Babacar.
   Desactivable : ?electronique=0 */
(function () {
  "use strict";
  if (window.__diisooÉlectroniquePlus || /[?&]electronique=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.electronique) return;
  window.__diisooÉlectroniquePlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Do you sell original phones?",
"fr": "Vous vendez des téléphones originaux ?",
"wo": "Ndax dangay jaay telefon yu original ?"
},
{
"niveau": "debutant",
"en": "How much is this phone?",
"fr": "Combien coûte ce téléphone ?",
"wo": "Ñaata la téléfon bii ?"
},
{
"niveau": "debutant",
"en": "Do you have a cheaper one?",
"fr": "Vous en avez un moins cher ?",
"wo": "Ndax am nga bu gën a yomb ?"
},
{
"niveau": "debutant",
"en": "I need a phone case.",
"fr": "Il me faut une coque de téléphone.",
"wo": "Dama soxla coque ngir sama téléfon."
},
{
"niveau": "debutant",
"en": "Can you charge it for me?",
"fr": "Vous pouvez me le charger ?",
"wo": "Ndax mën nga ma ko sarse ?"
},
{
"niveau": "intermediaire",
"en": "How many days does the battery last?",
"fr": "La batterie tient combien de jours ?",
"wo": "Ñaata fan la batiri bi di téye ?"
},
{
"niveau": "intermediaire",
"en": "Can you transfer my contacts to the new phone?",
"fr": "Vous pouvez transférer mes contacts sur le nouveau téléphone ?",
"wo": "Ndax mën nga ma jàllale sama contact yi ci telefon bu bees bi ?"
},
{
"niveau": "intermediaire",
"en": "Is the screen original or a copy?",
"fr": "L'écran est original ou une copie ?",
"wo": "Ndax ekraŋ bi original la walla copie la ?"
},
{
"niveau": "intermediaire",
"en": "Do you repair phones here?",
"fr": "Vous réparez les téléphones ici ?",
"wo": "Ndax dangeen di defar téléfon fii ?"
},
{
"niveau": "intermediaire",
"en": "How long does the repair take?",
"fr": "La réparation prend combien de temps ?",
"wo": "Ñaata waxtu la defar bi di jël ?"
},
{
"niveau": "avance",
"en": "Can you give me a discount if I buy three phones?",
"fr": "Vous pouvez me faire une remise si j'en achète trois ?",
"wo": "Ndax mën nga ma wàññil njëg li su ma jëndee ñetti téléfon ?"
},
{
"niveau": "avance",
"en": "I want to check that the phone is not stolen.",
"fr": "Je veux vérifier que le téléphone n'est pas volé.",
"wo": "Dama bëgg a seet ndax telefon bi du lu ñu sàcc."
},
{
"niveau": "avance",
"en": "What does the warranty cover exactly?",
"fr": "Qu'est-ce que la garantie couvre exactement ?",
"wo": "Lan la garanti bi tënk ci dëgg-dëgg ?"
},
{
"niveau": "avance",
"en": "The charger got hot. Is that normal?",
"fr": "Le chargeur a chauffé. C'est normal ?",
"wo": "Sarsëer bi dafa tàng. Ndax normal la ?"
},
{
"niveau": "avance",
"en": "Can you deliver to Thiès by bus tomorrow?",
"fr": "Vous pouvez livrer à Thiès par car demain ?",
"wo": "Ndax mën nga ma ko yónnee Cees ci kaar suba ?"
}
];
  var L = [
{
"role": "client",
"en": "Hello. I want a good phone for my work.",
"fr": "Bonjour. Je veux un bon téléphone pour mon travail.",
"wo": "Jàmm nga fanaan. Dama bëgg téléfon bu baax ngir sama liggéey.",
"scene": "📱 Acheter un téléphone"
},
{
"role": "marchand",
"en": "This one is very good. It is new and original.",
"fr": "Celui-ci est très bon. Il est neuf et original.",
"wo": "Bii baax na torop. Bees na te original la."
},
{
"role": "client",
"en": "How much is it?",
"fr": "Combien coûte-t-il ?",
"wo": "Ñaata la ?"
},
{
"role": "marchand",
"en": "One hundred and fifty thousand francs.",
"fr": "Cent cinquante mille francs.",
"wo": "Téeméeri junni ak juróom-fukki junni farã."
},
{
"role": "client",
"en": "It is expensive. Can you lower the price?",
"fr": "C'est cher. Vous pouvez baisser le prix ?",
"wo": "Dafa seer. Ndax mën nga wàññi njëg li ?"
},
{
"role": "marchand",
"en": "For you, one hundred and thirty thousand.",
"fr": "Pour vous, cent trente mille.",
"wo": "Ngir yaw, téeméeri junni ak fanweeri junni."
},
{
"role": "client",
"en": "Okay. Please put a screen protector and a case.",
"fr": "D'accord. Mettez un protège-écran et une coque, s'il vous plaît.",
"wo": "Waaw. Defal ma protège-écran ak coque, bu la neexee."
},
{
"role": "marchand",
"en": "Of course. Here is your phone and the receipt.",
"fr": "Bien sûr. Voici votre téléphone et le reçu.",
"wo": "Waaw kay. Sa telefon bi ak resi bi ñoo ngi nii."
}
];
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.electronique.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.electronique.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.electronique.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.electronique.vocab.length = 0; tri.forEach(function (t) { C.electronique.vocab.push(t[0]); });
  D.electronique = D.electronique || [];
  var vus = {}; D.electronique.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.electronique.push(l); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-electronique-plus.js",e);}

try{
/* ---- diisoo-mission-electronique.js ---- */
/* diisoo-mission-electronique.js v1 : Mission « Acheter mon téléphone »
   L'app joue le vendeur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Électronique ».
   Bouton place en haut du secteur « Téléphones & accessoires » (Business). Essai : https://diisoo.sn/?mission=electronique */
(function () {
  "use strict";
  if (window.DiisooMissionÉlectronique) return;
  var Q = [
    { q: "Hello. What phone are you looking for?", kw: /phone|samsung|iphone|tecno|infinix|looking|need|want|new|i/i, m: "I am looking for a new Samsung phone." },
    { q: "This one is new and original. Do you want to see it?", kw: /yes|see|show|please|original|check|look|ok|okay/i, m: "Yes, please show me. Is it original?" },
    { q: "It costs one hundred thousand francs.", kw: /lower|discount|price|expensive|cheaper|less|better|please|how much/i, m: "It is expensive. Can you lower the price?" },
    { q: "Okay, ninety thousand. Do you want a case and a charger?", kw: /yes|case|charger|screen|protector|please|include|want|need|ok/i, m: "Yes, please add a case and a charger." },
    { q: "How do you want to pay?", kw: /wave|orange|mobile|money|cash|pay|payment|transfer|card/i, m: "I will pay with Wave." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mel{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mel .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mel .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mel .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mel button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mel .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mel .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mel .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mel .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mel .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mel .ok{color:#25D366}#mel .or{color:#FFAA3C}" +
    "#mel-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mel-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mel")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mel";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">📱 Électronique · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mel-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mel-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mel-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mel-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mel-skip" type="button">Passer</button>' +
        '<button class="b3" id="mel-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mel-r"), mic = document.getElementById("mel-mic"), nx = document.getElementById("mel-next");
      document.getElementById("mel-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mel-x").onclick = function () { o.remove(); };
      document.getElementById("mel-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
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
        try { if (typeof BADGES !== "undefined" && !BADGES["electronique"]) BADGES["electronique"] = { icon: "📱", label: "Électronique", desc: "Achat de téléphone réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("electronique"); } catch (e) {}
      }
      noter("mission_electronique", score + "/" + Q.length);
      o.innerHTML = '<div class="k">📱 Mission Électronique</div><div class="q">' + (ok ? "Bonne affaire ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Électronique » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du secteur Électronique et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mel-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mel-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mel-x2" type="button">Fermer</button>';
      document.getElementById("mel-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mel-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mel-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon achat de téléphone en anglais sur Diisoo 📱 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
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
    var box = document.getElementById("business-content");
    if (!box || box.classList.contains("hidden") || document.getElementById("mel-btn")) return;
    var id = ""; try { id = businessModule; } catch (e) {}
    if (id !== "electronique") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mel-btn";
    b.innerHTML = '<span style="font-size:22px">📱</span><span>Mission : acheter mon téléphone<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    var h = box.querySelector("h4"); if (h && h.nextSibling) box.insertBefore(b, h.nextSibling); else box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("business-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true, attributes: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionÉlectronique = { ouvrir: ouvrir };
  if (/[?&]mission=electronique/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-electronique.js",e);}

try{
/* ---- diisoo-passage.js ---- */
/* diisoo-passage.js v2 : test de passage, organise en 3 ecrans (Presentation, Questions, Resultat)
   - Toucher Intermediaire : test du niveau Debutant. Reussi (75 %) = Intermediaire ouvert.
   - Toucher Avance : test du niveau Intermediaire. Reussi = Avance ouvert.
     Rate (et Intermediaire pas encore ouvert) = test Debutant pour savoir s'il commence Intermediaire ou Debutant.
   - Une question = un mot entendu (audio) + 3 reponses. 8 questions, 6 bonnes reponses pour reussir.
   - Apres un echec, le meme test se refait apres 24 heures. */
(function () {
  "use strict";

  var NB = 8, SEUIL = 0.7, ATTENTE = 24 * 3600 * 1000;
  var NOMS = ["Débutant", "Intermédiaire", "Avancé"];
  var ICONS = ["🌱", "🌿", "🌳"];
  var KEYF = "diisoo_passage";
  var etat = null, ov = null;
  var TABS = { general: "general-tabs", wolof: "wolof-tabs" };

  /* ---------- outils ---------- */
  function $(id) { return document.getElementById(id); }
  function melanger(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function lire() { try { return JSON.parse(localStorage.getItem(KEYF) || "{}") || {}; } catch (e) { return {}; } }
  function ecrire(o) { try { localStorage.setItem(KEYF, JSON.stringify(o)); } catch (e) {} }
  function aide(cle) { try { return window.DiisooAideWolof.phrases[cle]; } catch (e) { return null; } }
  function direAide(cle) { try { window.DiisooAideWolof.dire(cle); } catch (e) {} }
  function dire(t, lang) {
    try {
      if (lang === "wo" && typeof speakWolofOolel === "function") return speakWolofOolel(t);
      if (typeof speak === "function") return speak(t, "en-US", 0.85);
    } catch (e) {}
  }
  function debloque(key) { try { return tierState()[key].unlocked || 1; } catch (e) { return 1; } }
  function ouvrirNiveau(key, L) {
    try {
      var all = tierState();
      if (L > all[key].unlocked) all[key].unlocked = L;
      if (typeof TIER_GOALS !== "undefined" && all[key].pts < TIER_GOALS[L - 1]) all[key].pts = TIER_GOALS[L - 1];
      store.set(TIER_KEY, all);
    } catch (e) { console.warn("[diisoo] passage", e); }
  }

  /* ---------- questions a partir du vocabulaire du niveau (meme decoupage que les menus) ---------- */
  function themesDuNiveau(key, niveau) {
    var box = $(TABS[key]), data = key === "general" ? GENERAL_THEMES : WOLOF_THEMES, out = [];
    if (key === "business") return out;
    if (box) {
      Array.prototype.forEach.call(box.children, function (b) {
        if (+b.dataset.lvl !== niveau) return;
        var t = b.textContent.trim().replace(/^🔒\s*/, "");
        var th = data.filter(function (x) { return (x.title || x.label || x.name || "") === t; })[0];
        if (th) out.push(th);
      });
    }
    return out;
  }
  function mots(key, niveau) {
    var out = [];
    if (key === "business") {
      try {
        Object.keys(CHINA_TRADE_WOLOF).forEach(function (k) {
          ((CHINA_TRADE_WOLOF[k] || {}).vocab || []).forEach(function (v) {
            if (v.niveau === ["debutant", "intermediaire", "avance"][niveau - 1] && v.en && v.fr) out.push({ q: v.en, a: v.fr, lang: "en" });
          });
        });
      } catch (e) {}
      return out.filter(function (w) { return w.q.length <= 60 && w.a.length <= 70; });
    }
    themesDuNiveau(key, niveau).forEach(function (t) {
      if (key === "general") (t.vocab || []).forEach(function (w) { if (w.en && w.fr) out.push({ q: w.en, a: w.fr, lang: "en" }); });
      else (t.words || []).forEach(function (w) { if (w.wo && w.en) out.push({ q: w.wo, a: w.en, lang: "wo" }); });
    });
    return out.filter(function (w) { return w.q.length <= 45 && w.a.length <= 45; });
  }
  function fabriquer(key, niveau) {
    var pool = mots(key, niveau);
    if (pool.length < 4) return [];
    var tirage = melanger(pool).slice(0, Math.min(NB, pool.length));
    return tirage.map(function (w) {
      var autres = melanger(pool.filter(function (x) { return x.a !== w.a; })).slice(0, 2).map(function (x) { return x.a; });
      return { q: w.q, a: w.a, lang: w.lang, options: melanger([w.a].concat(autres)) };
    });
  }

  /* ---------- interface ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#dii-passage{position:fixed;inset:0;z-index:9999;background:#0B0F1C;color:#F6F1E7;display:flex;flex-direction:column;" +
    "padding:14px 16px 24px;overflow-y:auto;font-family:inherit}" +
    "#dii-passage .ps-top{display:flex;align-items:center;gap:10px}" +
    "#dii-passage .ps-x{width:44px;height:44px;border-radius:50%;background:#141A2B;border:1px solid #1E2740;color:#A69C86;font-size:16px}" +
    "#dii-passage .ps-aide{margin-left:auto;width:44px;height:44px;border-radius:50%;background:#25D366;border:0;color:#fff;font-size:20px}" +
    "#dii-passage .ps-head{text-align:center;font-size:12px;font-weight:700;letter-spacing:.08em;color:#8C8064;text-transform:uppercase;margin:12px 0 2px}" +
    "#dii-passage .ps-titre{text-align:center;font-size:20px;font-weight:800;margin:2px 0 6px}" +
    "#dii-passage .ps-path{display:flex;align-items:center;justify-content:center;gap:0;margin:14px 0}" +
    "#dii-passage .ps-n{display:flex;flex-direction:column;align-items:center;width:84px;font-size:11px;color:#A69C86;font-weight:700}" +
    "#dii-passage .ps-n b{display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:#141A2B;" +
    "border:3px solid #1E2740;font-size:26px;margin-bottom:4px}" +
    "#dii-passage .ps-n.done b{border-color:#25D366;background:#12351F}" +
    "#dii-passage .ps-n.on b{border-color:#F3A94E;background:#3A2A10;box-shadow:0 0 0 4px rgba(243,169,78,.25)}" +
    "#dii-passage .ps-n.lock b{opacity:.55}" +
    "#dii-passage .ps-l{width:26px;height:4px;background:#1E2740;border-radius:3px;margin-bottom:22px}" +
    "#dii-passage .ps-regles{display:flex;flex-direction:column;gap:8px;margin:8px 0 16px}" +
    "#dii-passage .ps-r{display:flex;align-items:center;gap:12px;background:#141A2B;border:1px solid #1E2740;border-radius:14px;padding:10px 14px;font-size:14px}" +
    "#dii-passage .ps-r span{font-size:22px}" +
    "#dii-passage .ps-pts{display:flex;justify-content:center;gap:6px;margin:10px 0 4px}" +
    "#dii-passage .ps-pts i{width:14px;height:14px;border-radius:50%;background:#1E2740}" +
    "#dii-passage .ps-pts i.ok{background:#25D366}#dii-passage .ps-pts i.ko{background:#E5484D}" +
    "#dii-passage .ps-pts i.cur{box-shadow:0 0 0 3px rgba(243,169,78,.6);background:#F3A94E}" +
    "#dii-passage .ps-son{align-self:center;width:84px;height:84px;border-radius:50%;background:#25D366;color:#fff;font-size:36px;border:0;margin:10px 0 12px}" +
    "#dii-passage .ps-mot{text-align:center;font-size:26px;font-weight:800;line-height:1.25;margin:6px 0 16px;word-break:break-word}" +
    "#dii-passage .ps-rep{width:100%;min-height:58px;margin-bottom:10px;padding:10px 14px;border-radius:16px;background:#141A2B;" +
    "border:2px solid #1E2740;color:#F6F1E7;font-size:16px;font-weight:700;text-align:left}" +
    "#dii-passage .ps-rep.ok{background:#12351F;border-color:#25D366}" +
    "#dii-passage .ps-rep.ko{background:#3A1515;border-color:#E5484D}" +
    "#dii-passage .ps-grand{font-size:56px;text-align:center;margin:10px 0 2px}" +
    "#dii-passage .ps-score{text-align:center;font-size:34px;font-weight:900;margin:0}" +
    "#dii-passage .ps-msg{text-align:center;font-size:17px;font-weight:800;margin:6px 0}" +
    "#dii-passage .ps-sub{text-align:center;font-size:13px;color:#A69C86;margin:0 0 14px}" +
    "#dii-passage .ps-btn{width:100%;min-height:56px;margin-bottom:10px;border-radius:999px;border:0;background:#25D366;color:#fff;font-size:16px;font-weight:800}" +
    "#dii-passage .ps-btn.sec{background:#141A2B;border:1px solid #1E2740;color:#C9BFA8}";
  document.head.appendChild(st);

  function fermer() { if (ov) { ov.remove(); ov = null; } etat = null; }
  function montrer(html) {
    if (!ov || !document.body.contains(ov)) { ov = document.createElement("div"); ov.id = "dii-passage"; document.body.appendChild(ov); }
    ov.innerHTML = html;
    ov.scrollTop = 0;
  }
  function retourMenu(key, L) {
    fermer();
    try { window[key === "general" ? "openGeneralModule" : key === "wolof" ? "openWolofModule" : "openBusinessModule"](); } catch (e) {}
    if (L) {
      setTimeout(function () {
        var b = document.querySelectorAll("#lvl-" + key + " .lvl-btn")[L - 1];
        if (b) b.click();
      }, 150);
    }
  }

  /* Chemin Debutant, Intermediaire, Avance : ouvert (vert), test en cours (orange), ferme (cadenas) */
  function chemin(key, cible) {
    var un = debloque(key), h = '<div class="ps-path">';
    for (var L = 1; L <= 3; L++) {
      var cls = L <= un ? "done" : (L === cible ? "on" : "lock");
      var ic = L <= un ? "✅" : (L === cible ? ICONS[L - 1] : "🔒");
      h += '<div class="ps-n ' + cls + '"><b>' + ic + "</b>" + NOMS[L - 1] + "</div>";
      if (L < 3) h += '<div class="ps-l"></div>';
    }
    return h + "</div>";
  }

  function entete(key) {
    return '<div class="ps-top"><button class="ps-x" id="ps-close" aria-label="Fermer">✕</button>' +
      '<button class="ps-aide" id="ps-aide" aria-label="Aide en wolof">🔊</button></div>';
  }
  function brancher(key, boutons) {
    var c = $("ps-close"); if (c) c.onclick = function () { retourMenu(key, 0); };
    var a = $("ps-aide"); if (a) a.onclick = function () { direAide("passage"); };
    Array.prototype.forEach.call(ov.querySelectorAll(".ps-btn"), function (el) {
      el.onclick = function () { boutons[+el.dataset.i].f(); };
    });
  }
  function boutonsHtml(boutons) {
    var h = "";
    boutons.forEach(function (b, i) { h += '<button class="ps-btn ' + (b.sec ? "sec" : "") + '" data-i="' + i + '">' + b.t + "</button>"; });
    return h;
  }

  /* Ecran 1 : presentation */
  function presentation(key, cible, niveau, fallback) {
    var qs = fabriquer(key, niveau);
    if (!qs.length) { ouvrirNiveau(key, cible); retourMenu(key, cible); return; }
    var need = Math.ceil(SEUIL * qs.length);
    etat = { key: key, cible: cible, niveau: niveau, fallback: !!fallback, qs: qs, i: 0, score: 0, verrou: false, hist: [] };
    var boutons = [
      { t: "▶ Commencer", f: function () { question(); } },
      { t: "Plus tard", sec: true, f: function () { retourMenu(key, 0); } }
    ];
    montrer(entete(key) +
      '<div class="ps-head">Test de passage</div>' +
      '<div class="ps-titre">Pour ouvrir ' + ICONS[cible - 1] + " " + NOMS[cible - 1] + "</div>" +
      chemin(key, cible) +
      '<div class="ps-regles">' +
      '<div class="ps-r"><span>🔊</span>Écoute le mot</div>' +
      '<div class="ps-r"><span>👆</span>Touche la bonne réponse</div>' +
      '<div class="ps-r"><span>🎯</span>' + need + " bonnes réponses sur " + qs.length + "</div></div>" +
      boutonsHtml(boutons));
    brancher(key, boutons);
    direAide("passage");
  }

  /* Ecran 2 : questions */
  function points(s) {
    var h = '<div class="ps-pts">';
    for (var k = 0; k < s.qs.length; k++) h += "<i class=\"" + (k < s.hist.length ? (s.hist[k] ? "ok" : "ko") : (k === s.i ? "cur" : "")) + '"></i>';
    return h + "</div>";
  }
  function question() {
    var s = etat, q = s.qs[s.i];
    var h = entete(s.key) +
      '<div class="ps-head">' + ICONS[s.niveau - 1] + " Test " + NOMS[s.niveau - 1] + " : " + (s.i + 1) + " / " + s.qs.length + "</div>" +
      points(s) +
      '<button class="ps-son" id="ps-son" aria-label="Écouter">🔊</button><div class="ps-mot">' + q.q.replace(/</g, "&lt;") + "</div>";
    q.options.forEach(function (o, i) { h += '<button class="ps-rep" data-i="' + i + '">' + o.replace(/</g, "&lt;") + "</button>"; });
    montrer(h);
    brancher(s.key, []);
    $("ps-aide").onclick = function () { dire(q.q, q.lang); };
    $("ps-son").onclick = function () { dire(q.q, q.lang); };
    dire(q.q, q.lang);
    Array.prototype.forEach.call(ov.querySelectorAll(".ps-rep"), function (el) {
      el.onclick = function () {
        if (s.verrou) return;
        s.verrou = true;
        var bon = q.options[+el.dataset.i] === q.a;
        if (bon) s.score++;
        s.hist.push(bon);
        el.classList.add(bon ? "ok" : "ko");
        el.textContent = (bon ? "✅ " : "❌ ") + el.textContent;
        if (!bon) Array.prototype.forEach.call(ov.querySelectorAll(".ps-rep"), function (x, k) { if (q.options[k] === q.a) x.classList.add("ok"); });
        setTimeout(function () {
          s.verrou = false; s.i++;
          if (s.i < s.qs.length) question(); else fin();
        }, bon ? 700 : 1400);
      };
    });
  }

  function cooldown(key, niveau) {
    var f = lire()[key + ":" + niveau];
    if (f && Date.now() - f < ATTENTE) return Math.ceil((ATTENTE - (Date.now() - f)) / 3600000);
    return 0;
  }

  /* Ecran 3 : resultat */
  function resultat(key, cible, emoji, titre, sous, boutons, histo) {
    montrer(entete(key) +
      '<div class="ps-grand">' + emoji + "</div>" + titre + '<div class="ps-sub">' + sous + "</div>" +
      (histo || "") + chemin(key, cible) + boutonsHtml(boutons));
    brancher(key, boutons);
  }

  /* Lance le test du niveau `niveau` pour viser `cible` */
  function lancer(key, cible, niveau, fallback) {
    var h = cooldown(key, niveau);
    if (h > 0) {
      etat = { key: key };
      resultat(key, cible, "⏳", '<div class="ps-msg">Pas tout de suite</div>',
        "Tu pourras refaire ce test dans " + h + " h. Révise d'abord le niveau " + NOMS[niveau - 1] + ".",
        [{ t: ICONS[niveau - 1] + " Réviser " + NOMS[niveau - 1], f: function () { retourMenu(key, niveau); } }]);
      direAide("retour");
      return;
    }
    presentation(key, cible, niveau, fallback);
  }

  function fin() {
    var s = etat, pct = s.score / s.qs.length, ok = pct >= SEUIL;
    var note = s.score + " / " + s.qs.length, histo = points({ qs: s.qs, hist: s.hist, i: -1 });
    var key = s.key, cible = s.cible;
    var scoreHtml = '<p class="ps-score">' + note + "</p>";
    if (ok) {
      ouvrirNiveau(key, cible);
      resultat(key, cible, "🎉", scoreHtml + '<div class="ps-msg">Baax na ! Niveau débloqué</div>',
        ICONS[cible - 1] + " " + NOMS[cible - 1] + " est ouvert.",
        [{ t: ICONS[cible - 1] + " Commencer " + NOMS[cible - 1], f: function () { retourMenu(key, cible); } }], histo);
      direAide("bravo");
      return;
    }
    var f = lire(); f[key + ":" + s.niveau] = Date.now(); ecrire(f);
    var deja = debloque(key);
    direAide("encore");
    if (!s.fallback && cible === 3 && deja < 2) {
      resultat(key, cible, "🤔", scoreHtml + '<div class="ps-msg">Pas encore</div>',
        "On vérifie si tu peux commencer au niveau Intermédiaire.",
        [{ t: "🌱 Test Débutant", f: function () { lancer(key, 2, 1, true); } },
         { t: "Rester Débutant", sec: true, f: function () { retourMenu(key, 1); } }], histo);
      return;
    }
    if (s.fallback) {
      resultat(key, 2, "🌱", scoreHtml + '<div class="ps-msg">Tu commences Débutant</div>',
        "Tu pourras refaire le test demain.",
        [{ t: "🌱 Commencer Débutant", f: function () { retourMenu(key, 1); } }], histo);
      return;
    }
    var reste = Math.max(1, deja);
    resultat(key, cible, "💪", scoreHtml + '<div class="ps-msg">Pas encore</div>',
      "Il faut " + Math.ceil(SEUIL * s.qs.length) + " bonnes réponses sur " + s.qs.length + ". Tu peux refaire le test demain.",
      [{ t: ICONS[reste - 1] + " Réviser " + NOMS[reste - 1], f: function () { retourMenu(key, reste); } }], histo);
  }

  /* ---------- declenchement : toucher un niveau verrouille ---------- */
  window.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest(".lvl-btn.lock");
    if (!b || ev.target.closest(".aide-ic")) return;
    var box = b.parentNode, key = /lvl-(general|wolof|business)/.exec(box.id || "");
    if (!key) return;
    ev.stopImmediatePropagation(); ev.preventDefault();
    var idx = Array.prototype.indexOf.call(box.querySelectorAll(".lvl-btn"), b) + 1;
    lancer(key[1], idx, idx - 1, false);
  }, true);

  window.DiisooPassage = { version: 2, _etat: function () { return etat; } };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-passage.js",e);}

try{
/* ---- diisoo-stable.js ---- */
/* diisoo-stable.js v1 : stabilite
   1. L'ecran ne s'eteint pas pendant un exercice (Wake Lock)
   2. L'app revient a l'endroit ou tu etais apres un rechargement ou si le telephone a ferme l'onglet
   3. Dans les dialogues, l'ecran suit la phrase qui est lue (defilement + surlignage)
   4. Micro plus tolerant : contractions, chiffres, hesitations, 5 propositions du moteur vocal */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function visible(id) { var e = $(id); return !!(e && e.offsetParent !== null); }

  /* ---------- 1. Ecran toujours allume ---------- */
  var verrou = null, veut = false;
  function demander() {
    if (!veut || verrou || document.hidden) return;
    try {
      if (navigator.wakeLock && navigator.wakeLock.request) {
        navigator.wakeLock.request("screen").then(function (l) {
          verrou = l;
          l.addEventListener("release", function () { verrou = null; });
        }).catch(function () {});
      }
    } catch (e) {}
  }
  function liberer() { try { if (verrou) verrou.release(); } catch (e) {} verrou = null; }
  function ecranActif() {
    var s = document.querySelectorAll("[id^='screen-']"), id = null;
    for (var i = 0; i < s.length; i++) { if (!s[i].classList.contains("hidden")) { id = s[i].id; break; } }
    return id;
  }
  setInterval(function () {
    var id = ecranActif();
    veut = !!id && id !== "screen-dashboard" && id !== "screen-login" && id !== "screen-register";
    if (veut) demander(); else liberer();
  }, 1500);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) { verrou = null; demander(); } });

  /* ---------- 2. Reprise la ou on s'etait arrete ---------- */
  var CLE = "diisoo_pos", DUREE = 30 * 60 * 1000;
  var OUVRIR = {
    "screen-general": ["openGeneralModule", "general"],
    "screen-wolof": ["openWolofModule", "wolof"],
    "screen-business": ["openBusinessModule", "business"],
    "screen-test-simulation": ["startTestSimulation", null]
  };
  function niveauActuel(key) {
    try {
      if (key === "business") return window.DiisooBiz.niveau();
      return window.DiisooOrga.niveau(key);
    } catch (e) { return null; }
  }
  var restaure = false;
  function sauver() {
    if (!restaure) return;
    var id = ecranActif();
    try {
      if (!id || !OUVRIR[id]) { localStorage.removeItem(CLE); return; }
      localStorage.setItem(CLE, JSON.stringify({ s: id, l: niveauActuel(OUVRIR[id][1]), t: Date.now() }));
    } catch (e) {}
  }
  function reprendre() {
    var p = null;
    try { p = JSON.parse(localStorage.getItem(CLE) || "null"); } catch (e) {}
    restaure = true;
    if (!p || !OUVRIR[p.s] || Date.now() - p.t > DUREE) return;
    if (ecranActif() !== "screen-dashboard") return;
    var fn = window[OUVRIR[p.s][0]];
    if (typeof fn !== "function") return;
    try { fn(); } catch (e) { return; }
    if (p.l) {
      setTimeout(function () {
        var b = document.querySelectorAll("#lvl-" + OUVRIR[p.s][1] + " .lvl-btn")[p.l - 1];
        if (b && !b.classList.contains("lock")) b.click();
      }, 400);
    }
  }
  setInterval(sauver, 1000);
  document.addEventListener("visibilitychange", function () { if (document.hidden) sauver(); });
  window.addEventListener("pagehide", sauver);
  /* On attend que l'ecran d'accueil soit pret, puis on reprend (une seule fois) */
  var essais = 0, tReprise = setInterval(function () {
    essais++;
    if (visible("screen-dashboard")) { clearInterval(tReprise); setTimeout(reprendre, 300); }
    else if (essais > 40) { clearInterval(tReprise); restaure = true; }
  }, 250);

  /* ---------- 3. L'ecran suit le dialogue ---------- */
  var st = document.createElement("style");
  st.textContent = ".dii-suit{background:rgba(225,105,63,.22)!important;outline:2px solid #E1693F;border-radius:10px;transition:background .2s}";
  document.head.appendChild(st);
  var dernier = null;
  function suivre(texte) {
    try {
      var t = String(texte || "").trim();
      if (t.length < 2) return;
      var cands = document.querySelectorAll("[id^='bdl-'], .dlg-bulle, [data-dlg-line], .dlg-ligne");
      var trouve = null;
      for (var i = 0; i < cands.length; i++) {
        if (cands[i].textContent.indexOf(t) > -1 && cands[i].offsetParent !== null) { trouve = cands[i]; break; }
      }
      if (dernier) dernier.classList.remove("dii-suit");
      if (!trouve) { dernier = null; return; }
      dernier = trouve;
      trouve.classList.add("dii-suit");
      trouve.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {}
  }
  function finSuivi() { if (dernier) { dernier.classList.remove("dii-suit"); dernier = null; } }
  var seqOrig = window.playSequence;
  if (typeof seqOrig === "function") {
    window.playSequence = function (items) {
      var liste = (items || []).map(function (it) {
        var o = Object.assign({}, it), f = it.onStart;
        o.onStart = function () { suivre(it.text); if (typeof f === "function") f(); };
        return o;
      });
      var r = seqOrig.call(this, liste);
      try { Promise.resolve(r).then(finSuivi, finSuivi); } catch (e) {}
      return r;
    };
  }

  /* ---------- 4. Micro plus tolerant ---------- */
  var CONTR = [
    [/\bi'm\b/g, "i am"], [/\byou're\b/g, "you are"], [/\bwe're\b/g, "we are"], [/\bthey're\b/g, "they are"],
    [/\bhe's\b/g, "he is"], [/\bshe's\b/g, "she is"], [/\bit's\b/g, "it is"], [/\bthat's\b/g, "that is"],
    [/\bwhat's\b/g, "what is"], [/\bwhere's\b/g, "where is"], [/\bhow's\b/g, "how is"], [/\bthere's\b/g, "there is"],
    [/\bi've\b/g, "i have"], [/\bwe've\b/g, "we have"], [/\byou've\b/g, "you have"], [/\bi'll\b/g, "i will"],
    [/\byou'll\b/g, "you will"], [/\bwe'll\b/g, "we will"], [/\bi'd\b/g, "i would"], [/\blet's\b/g, "let us"],
    [/\bdon't\b/g, "do not"], [/\bdoesn't\b/g, "does not"], [/\bdidn't\b/g, "did not"], [/\bcan't\b/g, "can not"],
    [/\bcannot\b/g, "can not"], [/\bwon't\b/g, "will not"], [/\bisn't\b/g, "is not"], [/\baren't\b/g, "are not"],
    [/\bwasn't\b/g, "was not"], [/\bcouldn't\b/g, "could not"], [/\bshouldn't\b/g, "should not"], [/\bwouldn't\b/g, "would not"],
    [/\bgonna\b/g, "going to"], [/\bwanna\b/g, "want to"], [/\bgotta\b/g, "got to"]
  ];
  var NB = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
    "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
  var origNorm = window.normalize;
  if (typeof origNorm === "function") {
    window.normalize = function (s) {
      var t = String(s == null ? "" : s).toLowerCase().replace(/[‘’ʼ`]/g, "'");
      CONTR.forEach(function (c) { t = t.replace(c[0], c[1]); });
      t = t.replace(/\b(\d{1,2})\b/g, function (m, n) { n = +n; return n <= 20 ? NB[n] : m; });
      t = t.replace(/\b(uh|um|umm|uhm|erm|er|hmm|ah|oh)\b/g, " ");
      t = t.replace(/\b(ok|okay)\b/g, "okay");
      return origNorm(t);
    };
  }

  /* 5 propositions du moteur vocal au lieu d'une : la meilleure par rapport a la phrase attendue est gardee */
  try {
    var SRc = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SRc && SRc.prototype) {
      var P = SRc.prototype;
      var dm = Object.getOwnPropertyDescriptor(P, "maxAlternatives");
      if (dm && dm.set) {
        Object.defineProperty(P, "maxAlternatives", {
          configurable: true, enumerable: dm.enumerable,
          get: dm.get, set: function () { dm.set.call(this, 5); }
        });
      }
      var dr = Object.getOwnPropertyDescriptor(P, "onresult");
      if (dr && dr.set) {
        Object.defineProperty(P, "onresult", {
          configurable: true, enumerable: dr.enumerable,
          get: dr.get,
          set: function (fn) {
            if (typeof fn !== "function") { dr.set.call(this, fn); return; }
            dr.set.call(this, function (e) {
              var ev = e;
              try { ev = choisirMeilleur(e); } catch (x) { ev = e; }
              return fn.call(this, ev);
            });
          }
        });
      }
    }
  } catch (e) {}

  /* Phrase attendue : lue sur le bouton micro touche en dernier */
  var cible = "";
  function lireCible(btn) {
    try {
      var d = (btn.dataset.practice || "").split(":");
      if (d[0] === "biz" && window.CHINA_TRADE_WOLOF) return CHINA_TRADE_WOLOF[d[1]].vocab[+d[2]].en;
      var carte = btn.closest(".fx-em, .bg-\\[\\#141A2B\\], .dlg-bulle, div");
      var p = carte && carte.querySelector("p");
      return p ? p.textContent : "";
    } catch (e) { return ""; }
  }
  document.addEventListener("pointerdown", function (ev) {
    var b = ev.target.closest && ev.target.closest("[data-practice]");
    cible = b && !/^(biz-|.*-en|.*-wo)/.test(b.dataset.practice || "") ? lireCible(b) : "";
  }, true);

  function score(a, b) {
    a = window.normalize(a); b = window.normalize(b);
    if (!a || !b) return 0;
    var A = a.split(" "), B = b.split(" "), ok = 0;
    B.forEach(function (w) { if (A.indexOf(w) > -1) ok++; });
    return ok / B.length;
  }
  /* Renvoie un evenement equivalent ou la meilleure proposition est en position 0 */
  function choisirMeilleur(e) {
    if (!cible || !e.results) return e;
    var res = [];
    for (var i = 0; i < e.results.length; i++) {
      var r = e.results[i], best = 0, bs = -1;
      for (var k = 0; k < r.length; k++) {
        var sc = score(r[k].transcript, cible);
        if (sc > bs) { bs = sc; best = k; }
      }
      var x = [r[best]];
      x.isFinal = r.isFinal;
      res.push(x);
    }
    return { resultIndex: e.resultIndex, results: res, type: e.type };
  }

  window.DiisooStable = { version: 1, reprendre: reprendre };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-stable.js",e);}

try{
/* ---- diisoo-tourisme.js ---- */
/* diisoo-tourisme.js v1 : le tourisme au coeur de Diisoo
   12 themes de situations reelles (accueil, taxi, restaurant, Goree, monuments, artisanat, excursions, plage,
   vendre un circuit, urgences, agence de voyage, culture). Chaque theme : 8 mots, un dialogue, 3 questions.
   Marques par le pictogramme 🏝️ et classes en N1 / N2 / N3 comme les autres themes.
   Wolof : premiere version a faire valider par un locuteur natif. */
(function () {
  "use strict";
  if (window.__diisooTourisme) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooTourisme = true;

  function V(a) { return a.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }); }
  function D(a) { return a.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }); }
  function Q(a) { return a.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; }); }

  var T = [
    /* ---------------- N1 ---------------- */
    { id: "tour-accueil", niv: 1, title: "Accueillir un touriste",
      vocab: V([
        ["Welcome to Senegal", "Bienvenue au Sénégal", "Dalal ak jàmm ci Senegaal"],
        ["Hello, how are you?", "Bonjour, comment allez-vous ?", "Salaamaleekum, naka nga def ?"],
        ["My name is Awa", "Je m'appelle Awa", "Maa ngi tudd Awa"],
        ["Where are you from?", "D'où venez-vous ?", "Fan nga jóge ?"],
        ["I am from France", "Je viens de France", "Maa ngi jóge Faraas"],
        ["Nice to meet you", "Enchanté", "Neex na ma xam la"],
        ["Is it your first visit?", "C'est votre première visite ?", "Ndax yoon wu jëkk la ?"],
        ["Enjoy your stay", "Bon séjour", "Jàmm ak jàmm ci sa fanaan"]
      ]),
      dialogue: D([
        ["A", "Welcome to Senegal. How are you?", "Bienvenue au Sénégal. Comment allez-vous ?", "Dalal ak jàmm ci Senegaal. Naka nga def ?"],
        ["B", "I am fine, thank you. My name is Anna.", "Je vais bien, merci. Je m'appelle Anna.", "Maa ngi fi, jërëjëf. Maa ngi tudd Anna."],
        ["A", "Nice to meet you, Anna. Where are you from?", "Enchanté, Anna. D'où venez-vous ?", "Neex na ma xam la, Anna. Fan nga jóge ?"],
        ["B", "I am from Germany. It is my first visit.", "Je viens d'Allemagne. C'est ma première visite.", "Maa ngi jóge Almaañ. Yoon wu jëkk la."],
        ["A", "Very good. I will show you the city.", "Très bien. Je vais vous montrer la ville.", "Baax na. Dinaa la won dëkk bi."],
        ["B", "Thank you, you are very kind.", "Merci, vous êtes très gentil.", "Jërëjëf, jàmm nga ci lool."]
      ]),
      quiz: Q([
        ["___ to Senegal!", ["Welcome", "Welcomed", "Well come"], "« Welcome to » = bienvenue à."],
        ["Where are you ___?", ["from", "of", "at"], "« Where are you from? » = d'où venez-vous ?"],
        ["Nice to ___ you.", ["meet", "met", "meeting"], "Après « to », le verbe reste à l'infinitif."]
      ]) },

    { id: "tour-taxi", niv: 1, title: "Taxi et transport",
      vocab: V([
        ["Taxi", "Taxi", "Taksi bi"],
        ["Airport", "Aéroport", "Ayeropoor bi"],
        ["Hotel", "Hôtel", "Otel bi"],
        ["Where do you want to go?", "Où voulez-vous aller ?", "Fan nga bëgg a dem ?"],
        ["Take me to the hotel", "Emmenez-moi à l'hôtel", "Yóbbu ma ci otel bi"],
        ["How much is the ride?", "Combien coûte la course ?", "Ñaata la yoon wi ?"],
        ["Please stop here", "Arrêtez-vous ici, s'il vous plaît", "Taxawal fii, baal ma"],
        ["Keep the change", "Gardez la monnaie", "Bàyyil ko ñaanu"]
      ]),
      dialogue: D([
        ["A", "Hello. Where do you want to go?", "Bonjour. Où voulez-vous aller ?", "Salaamaleekum. Fan nga bëgg a dem ?"],
        ["B", "Take me to the Hotel Teranga, please.", "Emmenez-moi à l'hôtel Teranga, s'il vous plaît.", "Yóbbu ma ci otel Teranga, baal ma."],
        ["B", "How much is the ride?", "Combien coûte la course ?", "Ñaata la yoon wi ?"],
        ["A", "Five thousand francs.", "Cinq mille francs.", "Juróom junni franc."],
        ["B", "That is a bit expensive. Can you do four thousand?", "C'est un peu cher. Pouvez-vous faire quatre mille ?", "Dafa seer tuuti. Mën nga def ñaar junni ak ñaar ?"],
        ["A", "Okay, four thousand. Let us go.", "D'accord, quatre mille. Allons-y.", "Baax na, ñeent junni. Ñu dem."]
      ]),
      quiz: Q([
        ["Take me ___ the hotel.", ["to", "at", "in"], "« take me to » = emmenez-moi à."],
        ["How ___ is the ride?", ["much", "many", "long-much"], "Le prix : « how much »."],
        ["Please ___ here.", ["stop", "stops", "stopping"], "Impératif poli : « please stop here »."]
      ]) },

    { id: "tour-resto", niv: 1, title: "Au restaurant",
      vocab: V([
        ["Menu", "Carte", "Menu bi"],
        ["Water", "Eau", "Ndox mi"],
        ["Rice and fish", "Riz et poisson", "Ceebu jën"],
        ["I would like chicken", "Je voudrais du poulet", "Bëgg naa ganaar"],
        ["Is it spicy?", "Est-ce pimenté ?", "Ndax dafa xonq ?"],
        ["No pepper, please", "Sans piment, s'il vous plaît", "Amul sàkka, baal ma"],
        ["The bill, please", "L'addition, s'il vous plaît", "Faktiir bi, baal ma"],
        ["It was delicious", "C'était délicieux", "Neex na lool"]
      ]),
      dialogue: D([
        ["A", "Good evening. Here is the menu.", "Bonsoir. Voici la carte.", "Bonsoir. Nii mooy menu bi."],
        ["B", "Thank you. What is the dish of the day?", "Merci. Quel est le plat du jour ?", "Jërëjëf. Lan mooy añu bi tey ?"],
        ["A", "It is thieboudienne, rice with fish.", "C'est le thieboudienne, du riz au poisson.", "Ceebu jën la."],
        ["B", "Is it spicy? I do not like pepper.", "Est-ce pimenté ? Je n'aime pas le piment.", "Ndax dafa xonq ? Bëgguma sàkka."],
        ["A", "No problem, I will ask the cook.", "Pas de souci, je demande au cuisinier.", "Amul solo, dinaa ko wax kuisinie bi."],
        ["B", "Perfect. And a bottle of water, please.", "Parfait. Et une bouteille d'eau, s'il vous plaît.", "Baax na. Ak benn butel ndox, baal ma."]
      ]),
      quiz: Q([
        ["I ___ like chicken.", ["would", "will", "am"], "« I would like » = je voudrais (poli)."],
        ["The ___, please.", ["bill", "bell", "bull"], "« the bill » = l'addition."],
        ["Is it ___?", ["spicy", "spice", "spicing"], "Adjectif après « is it » : spicy."]
      ]) },

    /* ---------------- N2 ---------------- */
    { id: "tour-goree", niv: 2, title: "Visiter l'île de Gorée",
      vocab: V([
        ["Island", "Île", "Dun gi"],
        ["Ferry", "Bateau", "Pirogue bu mag bi"],
        ["Ticket", "Billet", "Tikke bi"],
        ["History", "Histoire", "Taarix bi"],
        ["The House of Slaves", "La Maison des Esclaves", "Kër gu jaam yi"],
        ["The ferry leaves at ten o'clock", "Le bateau part à dix heures", "Bato bi dina dem ci fukk i waxtu"],
        ["How long is the crossing?", "Combien dure la traversée ?", "Ñaata la yoon wi di yagg ?"],
        ["Can I take photos here?", "Puis-je prendre des photos ici ?", "Mën naa foto fii ?"]
      ]),
      dialogue: D([
        ["A", "Good morning. Two tickets for Gorée, please.", "Bonjour. Deux billets pour Gorée, s'il vous plaît.", "Salaamaleekum. Ñaari tikke ngir Beer, baal ma."],
        ["B", "Here you are. The ferry leaves at ten o'clock.", "Voilà. Le bateau part à dix heures.", "Nii la. Bato bi dina dem ci fukk i waxtu."],
        ["A", "How long is the crossing?", "Combien dure la traversée ?", "Ñaata la yoon wi di yagg ?"],
        ["B", "About twenty minutes.", "Environ vingt minutes.", "Ni ñaar fukk i miniit."],
        ["A", "Can I take photos in the House of Slaves?", "Puis-je prendre des photos dans la Maison des Esclaves ?", "Mën naa foto ci kër gu jaam yi ?"],
        ["B", "Yes, but please be respectful. It is a place of memory.", "Oui, mais soyez respectueux. C'est un lieu de mémoire.", "Waaw, waaye teral fi. Barab la bu ñuy fàttali."]
      ]),
      quiz: Q([
        ["The ferry ___ at ten o'clock.", ["leaves", "leave", "leaving"], "Sujet singulier : leaves."],
        ["How ___ is the crossing?", ["long", "far", "many"], "La durée : « how long »."],
        ["Can I ___ photos here?", ["take", "taking", "took"], "Après « can » : verbe de base."]
      ]) },

    { id: "tour-monuments", niv: 2, title: "Monuments et lieux célèbres",
      vocab: V([
        ["The African Renaissance Monument", "Le Monument de la Renaissance africaine", "Mónumaa Mucc-Afrig bi"],
        ["The Pink Lake", "Le Lac Rose", "Lac Rose bi"],
        ["The museum", "Le musée", "Musée bi"],
        ["The cathedral", "La cathédrale", "Katedraal bi"],
        ["It is open every day", "C'est ouvert tous les jours", "Dafa ubbeeku bés bu nekk"],
        ["How much is the entrance fee?", "Combien coûte l'entrée ?", "Ñaata la dugg bi ?"],
        ["Is there a guide?", "Y a-t-il un guide ?", "Ndax am na ab gid ?"],
        ["It is very beautiful", "C'est très beau", "Dafa rafet lool"]
      ]),
      dialogue: D([
        ["A", "Is the museum open today?", "Le musée est-il ouvert aujourd'hui ?", "Ndax musée bi dafa ubbeeku tey ?"],
        ["B", "Yes, from nine to five.", "Oui, de neuf heures à dix-sept heures.", "Waaw, ci juróom-ñaar waxtu ba ci juróom i waxtu."],
        ["A", "How much is the entrance fee?", "Combien coûte l'entrée ?", "Ñaata la dugg bi ?"],
        ["B", "Two thousand francs for adults.", "Deux mille francs pour les adultes.", "Ñaar junni franc ngir ñi mag."],
        ["A", "Is there a guide who speaks English?", "Y a-t-il un guide qui parle anglais ?", "Ndax am na gid bu wax Àngale ?"],
        ["B", "Yes, he will meet you at the door.", "Oui, il vous attendra à la porte.", "Waaw, dina la xaar ci bunt bi."]
      ]),
      quiz: Q([
        ["The museum is open ___ day.", ["every", "all", "each of"], "« every day » = tous les jours."],
        ["How much is the ___ fee?", ["entrance", "enter", "entering"], "« entrance fee » = prix d'entrée."],
        ["Is there a guide who ___ English?", ["speaks", "speak", "speaking"], "Sujet singulier (who = a guide) : speaks."]
      ]) },

    { id: "tour-artisanat", niv: 2, title: "Artisanat et marchandage",
      vocab: V([
        ["Souvenir", "Souvenir", "Fàttaliku"],
        ["Mask", "Masque", "Maske bi"],
        ["Fabric", "Tissu", "Almba bi"],
        ["Handmade", "Fait main", "Ñaw ci loxo"],
        ["How much is this?", "C'est combien ?", "Ñaata la bii ?"],
        ["That is too expensive", "C'est trop cher", "Dafa seer lool"],
        ["Can you lower the price?", "Pouvez-vous baisser le prix ?", "Mën nga wàññi njëg gi ?"],
        ["I will take it", "Je le prends", "Dinaa ko jënd"]
      ]),
      dialogue: D([
        ["A", "Welcome. Look, it is handmade.", "Bienvenue. Regardez, c'est fait main.", "Dalal ak jàmm. Xoolal, ñaw ci loxo la."],
        ["B", "It is beautiful. How much is this mask?", "C'est beau. Combien coûte ce masque ?", "Dafa rafet. Ñaata la maske bii ?"],
        ["A", "Twenty thousand francs.", "Vingt mille francs.", "Ñaar fukk junni franc."],
        ["B", "That is too expensive. Can you lower the price?", "C'est trop cher. Pouvez-vous baisser le prix ?", "Dafa seer lool. Mën nga wàññi njëg gi ?"],
        ["A", "For you, fifteen thousand.", "Pour vous, quinze mille.", "Ngir yow, fukk ak juróom junni."],
        ["B", "Twelve thousand and I will take it.", "Douze mille et je le prends.", "Fukk ak ñaar junni te dinaa ko jënd."]
      ]),
      quiz: Q([
        ["That is ___ expensive.", ["too", "to", "two"], "« too expensive » = trop cher."],
        ["Can you ___ the price?", ["lower", "lowering", "lowered"], "Après « can » : verbe de base."],
        ["I will ___ it.", ["take", "took", "taking"], "« I will take it » = je le prends."]
      ]) },

    { id: "tour-excursion", niv: 2, title: "Excursions et safari",
      vocab: V([
        ["Tour", "Circuit, visite", "Tuur bi"],
        ["Guide", "Guide", "Gid bi"],
        ["Animals", "Animaux", "Mala yi"],
        ["Bird", "Oiseau", "Picc mi"],
        ["The Saloum Delta", "Le delta du Saloum", "Saloum bi"],
        ["What time does the tour start?", "À quelle heure commence la visite ?", "Ban waxtu la tuur bi di tambali ?"],
        ["Bring water and a hat", "Apportez de l'eau et un chapeau", "Indil ndox ak mbaxanaas"],
        ["We will see lions and giraffes", "Nous verrons des lions et des girafes", "Dinanu gis gaynde ak jiraaf"]
      ]),
      dialogue: D([
        ["A", "I would like to book a tour of the Bandia reserve.", "Je voudrais réserver une visite de la réserve de Bandia.", "Bëgg naa jàppe tuur ci rezerw Bandia."],
        ["B", "Of course. What time do you want to start?", "Bien sûr. À quelle heure voulez-vous commencer ?", "Waaw. Ban waxtu nga bëgg a tambali ?"],
        ["A", "At nine o'clock. How long is the tour?", "À neuf heures. Combien de temps dure la visite ?", "Ci juróom-ñett i waxtu. Ñaata la tuur bi di yagg ?"],
        ["B", "Three hours. You will see giraffes and rhinos.", "Trois heures. Vous verrez des girafes et des rhinocéros.", "Ñetti waxtu. Dinga gis jiraaf ak rinoseros."],
        ["A", "What should I bring?", "Que dois-je apporter ?", "Lan laa war a indi ?"],
        ["B", "Water, a hat and sun cream.", "De l'eau, un chapeau et de la crème solaire.", "Ndox, mbaxanaas ak krem bu jant."]
      ]),
      quiz: Q([
        ["What time ___ the tour start?", ["does", "do", "is"], "Question au présent : « does » avec the tour."],
        ["We will ___ lions.", ["see", "saw", "seeing"], "« will » + verbe de base."],
        ["Bring water ___ a hat.", ["and", "or", "but"], "« and » = et."]
      ]) },

    { id: "tour-plage", niv: 2, title: "Plage et activités",
      vocab: V([
        ["Beach", "Plage", "Tefes gi"],
        ["Sea", "Mer", "Géej gi"],
        ["Sun cream", "Crème solaire", "Krem bu jant"],
        ["Surfboard", "Planche de surf", "Planch surf"],
        ["Is it safe to swim here?", "Peut-on nager ici sans danger ?", "Ndax mën nañu bëre fii ci jàmm ?"],
        ["The water is warm", "L'eau est chaude", "Ndox mi dafa tàng"],
        ["I want to rent a boat", "Je veux louer une pirogue", "Bëgg naa fey pirog"],
        ["What a beautiful sunset", "Quel beau coucher de soleil", "Jant bi dafa rafet"]
      ]),
      dialogue: D([
        ["A", "Excuse me, is it safe to swim here?", "Excusez-moi, peut-on nager ici sans danger ?", "Baal ma, ndax mën nañu bëre fii ci jàmm ?"],
        ["B", "Yes, but stay near the flags.", "Oui, mais restez près des drapeaux.", "Waaw, waaye nekkal ci wetu drapo yi."],
        ["A", "Can I rent a surfboard?", "Puis-je louer une planche de surf ?", "Mën naa fey planch surf ?"],
        ["B", "Yes, ten thousand francs for two hours.", "Oui, dix mille francs pour deux heures.", "Waaw, fukk junni franc ngir ñaari waxtu."],
        ["A", "Thank you. The water is warm today.", "Merci. L'eau est chaude aujourd'hui.", "Jërëjëf. Ndox mi dafa tàng tey."],
        ["B", "Enjoy the sunset at the end of the day.", "Profitez du coucher de soleil en fin de journée.", "Bégal ak jant bi ci ngoon."]
      ]),
      quiz: Q([
        ["Is it ___ to swim here?", ["safe", "save", "sure"], "« safe » = sans danger."],
        ["I want to ___ a boat.", ["rent", "rents", "renting"], "« want to » + verbe de base."],
        ["The water ___ warm.", ["is", "are", "be"], "Sujet singulier : is."]
      ]) },

    /* ---------------- N3 ---------------- */
    { id: "tour-circuit", niv: 3, title: "Vendre un circuit touristique",
      vocab: V([
        ["Itinerary", "Itinéraire", "Yoon wi"],
        ["Package", "Forfait", "Pak bi"],
        ["All inclusive", "Tout compris", "Lépp ci biir"],
        ["Group discount", "Réduction de groupe", "Wàññi njëg ngir mbooloo"],
        ["Our tours include transport, meals and a guide", "Nos circuits comprennent le transport, les repas et un guide", "Sunu tuur yi am nañu yoon, añ ak gid"],
        ["We can adapt the program to your needs", "Nous pouvons adapter le programme à vos besoins", "Mën nanu soppi porogaram bi ci li ngeen soxla"],
        ["A deposit of thirty percent is required", "Un acompte de trente pour cent est demandé", "Ñu di laaj fanweer ci téeméer ci ndoorte"],
        ["The price is per person", "Le prix est par personne", "Njëg gi ci nit la"]
      ]),
      dialogue: D([
        ["A", "We would like a five-day tour of Senegal.", "Nous voudrions un circuit de cinq jours au Sénégal.", "Bëgg nanu ab tuur ci juróom fan ci Senegaal."],
        ["B", "Certainly. We offer a package with Dakar, Gorée, Saly and the Saloum Delta.", "Bien sûr. Nous proposons un forfait avec Dakar, Gorée, Saly et le delta du Saloum.", "Waaw. Dinanu la jox pak bu am Ndakaaru, Beer, Saly ak Saloum."],
        ["A", "What is included in the price?", "Qu'est-ce qui est compris dans le prix ?", "Lan la njëg gi ëmb ?"],
        ["B", "Transport, hotels, breakfast and an English-speaking guide.", "Le transport, les hôtels, le petit-déjeuner et un guide anglophone.", "Yoon, otel yi, ndekki ak gid bu xam Àngale."],
        ["A", "Is there a discount for a group of ten?", "Y a-t-il une réduction pour un groupe de dix ?", "Ndax am na wàññi njëg ngir mbooloo mu fukk ?"],
        ["B", "Yes, ten percent. A deposit of thirty percent confirms the booking.", "Oui, dix pour cent. Un acompte de trente pour cent confirme la réservation.", "Waaw, fukk ci téeméer. Ndoorte bu fanweer ci téeméer mooy dëggal réserwasioŋ bi."]
      ]),
      quiz: Q([
        ["The price is ___ person.", ["per", "for each of", "by"], "« per person » = par personne."],
        ["We can ___ the program.", ["adapt", "adopt", "adept"], "« adapt » = adapter."],
        ["A ___ of thirty percent is required.", ["deposit", "depose", "deposition"], "« deposit » = acompte."]
      ]) },

    { id: "tour-urgence", niv: 3, title: "Santé, sécurité et urgences",
      vocab: V([
        ["I need a doctor", "J'ai besoin d'un médecin", "Soxla naa doktoor"],
        ["Pharmacy", "Pharmacie", "Farmasi bi"],
        ["My bag was stolen", "On m'a volé mon sac", "Sama sàq bi sàcc nañu ko"],
        ["Call the police", "Appelez la police", "Woowal poliis yi"],
        ["I have lost my passport", "J'ai perdu mon passeport", "Réer naa sama paspoor"],
        ["Where is the nearest hospital?", "Où est l'hôpital le plus proche ?", "Fan la opitaal bi gën a jege nekk ?"],
        ["I am allergic to peanuts", "Je suis allergique aux arachides", "Maa ngi am alerji ci gerte"],
        ["Please help me", "Aidez-moi, s'il vous plaît", "Dimbali ma, baal ma"]
      ]),
      dialogue: D([
        ["A", "Help! My bag was stolen.", "Au secours ! On m'a volé mon sac.", "Dimbali ma ! Sama sàq bi sàcc nañu ko."],
        ["B", "Stay calm. What was in the bag?", "Restez calme. Qu'y avait-il dans le sac ?", "Dal-leen. Lan la sàq bi doon ëmb ?"],
        ["A", "My passport and my phone.", "Mon passeport et mon téléphone.", "Sama paspoor ak sama telefon."],
        ["B", "We will call the police. Where were you?", "Nous allons appeler la police. Où étiez-vous ?", "Dinanu woowal poliis yi. Fan nga nekkoon ?"],
        ["A", "Near the market. Where is the nearest police station?", "Près du marché. Où est le commissariat le plus proche ?", "Ci wetu marse bi. Fan la komiseriya bi gën a jege nekk ?"],
        ["B", "I will take you there. Do not worry.", "Je vous y emmène. Ne vous inquiétez pas.", "Dinaa la yóbbu foofu. Bul jaaxle."]
      ]),
      quiz: Q([
        ["My bag was ___.", ["stolen", "stole", "steal"], "Passif : « was stolen » = a été volé."],
        ["I have ___ my passport.", ["lost", "lose", "loose"], "« have lost » = ai perdu."],
        ["Where is the ___ hospital?", ["nearest", "near", "nearly"], "Superlatif : « the nearest »."]
      ]) },

    { id: "tour-agence", niv: 3, title: "Agence de voyage : vols et billets",
      vocab: V([
        ["Flight", "Vol", "Vol bi"],
        ["Round trip", "Aller-retour", "Dem ak dellusi"],
        ["One way", "Aller simple", "Dem rekk"],
        ["Departure", "Départ", "Dem bi"],
        ["Arrival", "Arrivée", "Agsi bi"],
        ["I would like to book a flight to Paris", "Je voudrais réserver un vol pour Paris", "Bëgg naa jàppe vol ngir Pari"],
        ["Do you have a visa?", "Avez-vous un visa ?", "Ndax am nga visa ?"],
        ["The luggage limit is twenty-three kilos", "La limite de bagage est de vingt-trois kilos", "Bagaas bi ñetti fukk ak ñaar kilo la"]
      ]),
      dialogue: D([
        ["A", "Good morning. I would like to book a round trip to Paris.", "Bonjour. Je voudrais réserver un aller-retour pour Paris.", "Salaamaleekum. Bëgg naa jàppe dem ak dellusi ngir Pari."],
        ["B", "When do you want to leave?", "Quand voulez-vous partir ?", "Kañ nga bëgg a dem ?"],
        ["A", "On the fifteenth of December, and return on the second of January.", "Le quinze décembre, et retour le deux janvier.", "Ci fukk ak juróom i desàmbar, te dellusi ci ñaar i sanwiyee."],
        ["B", "The price is five hundred thousand francs. Do you have a valid passport?", "Le prix est de cinq cent mille francs. Avez-vous un passeport valide ?", "Njëg gi juróom téeméer junni la. Ndax am nga paspoor bu baax ?"],
        ["A", "Yes. Is the luggage included?", "Oui. Les bagages sont-ils compris ?", "Waaw. Ndax bagaas bi ci biir la ?"],
        ["B", "One bag of twenty-three kilos is included.", "Un bagage de vingt-trois kilos est inclus.", "Benn bagaas bu ñetti fukk ak ñaar kilo ci biir la."]
      ]),
      quiz: Q([
        ["I would like to ___ a flight.", ["book", "booking", "booked"], "« would like to » + verbe de base."],
        ["A ___ trip means going and coming back.", ["round", "circle", "double"], "« round trip » = aller-retour."],
        ["Is the luggage ___?", ["included", "include", "including"], "« Is ... included? » = est-ce compris ?"]
      ]) },

    { id: "tour-culture", niv: 3, title: "Parler de la culture sénégalaise",
      vocab: V([
        ["Teranga means hospitality", "La teranga veut dire l'hospitalité", "Teranga mooy dalal ak jàmm"],
        ["Wrestling is our national sport", "La lutte est notre sport national", "Làmb mooy sunu ay ndaje"],
        ["Thieboudienne is the national dish", "Le thieboudienne est le plat national", "Ceebu jën mooy añu réew mi"],
        ["We say hello with a handshake", "On se salue en se serrant la main", "Nuyoo nanu ak loxo"],
        ["Tea is shared with friends", "Le thé se partage entre amis", "Attaaya mi, ñépp a ko séddoo"],
        ["Music and dance are very important", "La musique et la danse sont très importantes", "Xalam ak fecc am nañu solo bu réy"],
        ["Many languages are spoken in Senegal", "On parle beaucoup de langues au Sénégal", "Ay làkk a bari ci Senegaal"],
        ["Wolof is the most widely spoken language", "Le wolof est la langue la plus parlée", "Wolof mooy làkk wi gën a jëfandikoo"]
      ]),
      dialogue: D([
        ["A", "What is the meaning of teranga?", "Que signifie la teranga ?", "Lan mooy tekki teranga ?"],
        ["B", "It means hospitality. We welcome everyone as family.", "Cela veut dire l'hospitalité. Nous accueillons chacun comme de la famille.", "Mooy dalal ak jàmm. Danuy dalal ñépp ni njabootu."],
        ["A", "What do people eat for lunch?", "Que mange-t-on au déjeuner ?", "Lan la nit ñi di añ ?"],
        ["B", "Usually thieboudienne. We eat from one big plate.", "Généralement le thieboudienne. On mange dans un grand plat.", "Ceebu jën la lu ëpp. Danuy lekk ci benn bàttu."],
        ["A", "And after the meal?", "Et après le repas ?", "Ak ginnaaw añ bi ?"],
        ["B", "We drink attaya, three small glasses, slowly and with friends.", "On boit l'attaya, trois petits verres, doucement et entre amis.", "Danuy naan attaaya, ñetti kaas yu ndaw, ak jàmm ak xarit yi."]
      ]),
      quiz: Q([
        ["Wolof is the ___ widely spoken language.", ["most", "more", "much"], "Superlatif long : « the most widely »."],
        ["Many languages ___ spoken in Senegal.", ["are", "is", "be"], "Sujet pluriel : are."],
        ["Tea is ___ with friends.", ["shared", "share", "sharing"], "Passif : « is shared »."]
      ]) }
  ];

  var ids = {};
  G.forEach(function (t) { ids[t.id] = true; });
  T.forEach(function (t) {
    if (ids[t.id]) return;
    G.push({
      id: t.id, niveau: t.niv, tourisme: true,
      title: "N" + t.niv + " · 🏝️ " + t.title,
      vocab: t.vocab, dialogue: t.dialogue, quiz: t.quiz
    });
  });
  G.sort(function (a, b) {
    var d = (a.niveau || 3) - (b.niveau || 3);
    if (d) return d;
    return (b.tourisme ? 1 : 0) - (a.tourisme ? 1 : 0); /* le tourisme en tete de chaque niveau */
  });
  window.DiisooTourisme = { themes: T.length };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-tourisme.js",e);}

try{
/* ---- diisoo-banque.js ---- */
/* diisoo-banque.js v1 : theme « Banque & mobile money » (30 phrases, 1 dialogue, 3 questions), niveau N2.
   Wolof relu par Babacar. Desactivable : ?banque=0 */
(function () {
  "use strict";
  if (window.__diisooBanque || /[?&]banque=0/.test(location.search)) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooBanque = true;
  var VOC = [
[
"Where is the bank?",
"Où est la banque ?",
"Fan la bànk bi nekk ?"
],
[
"I want to send money.",
"Je veux envoyer de l'argent.",
"Dama bëgg a yónnee xaalis."
],
[
"I want to withdraw money.",
"Je veux retirer de l'argent.",
"Dama bëgg a génne xaalis."
],
[
"I want to deposit money.",
"Je veux déposer de l'argent.",
"Dama bëgg a dugal xaalis."
],
[
"What is your Wave number?",
"Quel est votre numéro Wave ?",
"Ban la sa nimero Wave ?"
],
[
"How much is the fee?",
"Combien sont les frais ?",
"Ñaata la fere bi ?"
],
[
"I have sent the money.",
"J'ai envoyé l'argent.",
"Yónnee naa xaalis bi."
],
[
"I have received the money.",
"J'ai reçu l'argent.",
"Jot naa xaalis bi."
],
[
"Please give me a receipt.",
"Donnez-moi un reçu, s'il vous plaît.",
"Jox ma resi, bu la neexee."
],
[
"My phone has no network.",
"Mon téléphone n'a pas de réseau.",
"Sama telefon amul reeso."
],
[
"What is the maximum amount I can send?",
"Quel est le montant maximum que je peux envoyer ?",
"Ñaata la xaalis bi ëpp bu ma mën a yónnee ?"
],
[
"I made a mistake in the number. Can you cancel it?",
"Je me suis trompé de numéro. Vous pouvez annuler ?",
"Damaa juum ci nimero bi. Ndax mën nga ko neenal ?"
],
[
"I forgot my secret code.",
"J'ai oublié mon code secret.",
"Fàtte naa sama koodu kumpa."
],
[
"How do I check my balance?",
"Comment vérifier mon solde ?",
"Naka laa mën a xool sama solde ?"
],
[
"I want to open a bank account.",
"Je veux ouvrir un compte bancaire.",
"Dama bëgg a ubbi benn kontu bànk."
],
[
"Which documents do I need?",
"De quels documents ai-je besoin ?",
"Yan kayit laa soxla ?"
],
[
"Can I pay my bill with Orange Money?",
"Je peux payer ma facture avec Orange Money ?",
"Ndax mën naa fay sama faktir ak Orange Money ?"
],
[
"The agent has no cash.",
"L'agent n'a pas d'argent liquide.",
"Ajaan bi amul xaalis bu mu joxe."
],
[
"How long does a transfer to France take?",
"Combien de temps dure un transfert vers la France ?",
"Ñaata waxtu la yónnee xaalis ba Faraas di jël ?"
],
[
"Please check your phone, I sent you a code.",
"Vérifiez votre téléphone, je vous ai envoyé un code.",
"Xoolal sa telefon, yónnee naa la benn kood."
],
[
"Someone called me and asked for my secret code. It is a scam.",
"Quelqu'un m'a appelé pour avoir mon code secret. C'est une arnaque.",
"Kenn woo na ma te laaj ma sama koodu kumpa. Njaayum nax la."
],
[
"My money was deducted but the person did not receive it.",
"Mon argent a été débité mais la personne ne l'a pas reçu.",
"Sama xaalis dañu ko wàññi waaye ki ko waroon a jot jotul ko."
],
[
"I would like to apply for a loan to start my business.",
"Je voudrais demander un prêt pour lancer mon activité.",
"Dama bëgg a laaj benn leb ngir tàmbali sama liggéey."
],
[
"What is the interest rate and the repayment period?",
"Quel est le taux d'intérêt et la durée de remboursement ?",
"Ñaata la njëgu teg ci leb bi te ñaata dir la fay bi di yàgg ?"
],
[
"I receive money from abroad. How do I withdraw it?",
"Je reçois de l'argent de l'étranger. Comment le retirer ?",
"Maa ngi jot xaalis bu jóge biti réew. Naka laa ko mën a génnee ?"
],
[
"Can I get a bank statement for my visa application?",
"Je peux avoir un relevé bancaire pour ma demande de visa ?",
"Ndax mën naa am relewe bànk ngir sama laaju wisa ?"
],
[
"The exchange rate is not good. Is there a better one?",
"Le taux de change n'est pas bon. Il y en a un meilleur ?",
"Njëgu wecciku xaalis bi baaxul. Ndax am na bu gën a baax ?"
],
[
"My card was blocked. How can I unblock it?",
"Ma carte a été bloquée. Comment la débloquer ?",
"Sama kart bi dañu ko tëj. Naka laa ko mën a ubbiloo ?"
],
[
"I want to set up a standing order for my rent.",
"Je veux programmer un virement mensuel pour mon loyer.",
"Dama bëgg a def benn wirmaa weer wu nekk ngir fay sama luwaas."
],
[
"Please keep your code secret and never share it with anyone.",
"Gardez votre code secret et ne le partagez avec personne.",
"Dencal sa koodu kumpa te bul ko wax kenn."
]
];
  var DIA = [
[
"B",
"Hello. I want to send money to my mother in Thiès.",
"Bonjour. Je veux envoyer de l'argent à ma mère à Thiès.",
"Jàmm nga fanaan. Dama bëgg a yónnee xaalis sama yaay ci Cees."
],
[
"A",
"Of course. What is her Wave number?",
"Bien sûr. Quel est son numéro Wave ?",
"Waaw kay. Ban la nimero Wave bi ?"
],
[
"B",
"Seven seven, two eight eight, two one, zero nine.",
"Le 77 288 21 09.",
"Juróom-ñaar juróom-ñaar, ñaar juróom-ñett juróom-ñett, ñaar benn, tus juróom-ñeent."
],
[
"A",
"How much do you want to send?",
"Combien voulez-vous envoyer ?",
"Ñaata xaalis nga bëgg a yónnee ?"
],
[
"B",
"Fifty thousand francs. How much is the fee?",
"Cinquante mille francs. Combien sont les frais ?",
"Juróom-fukki junni farã. Ñaata la fere bi ?"
],
[
"A",
"The fee is five hundred francs. Please confirm.",
"Les frais sont de cinq cents francs. Confirmez, s'il vous plaît.",
"Fere bi juróom-téeméeri farã la. Dëggalal ko, bu la neexee."
],
[
"B",
"Yes, I confirm. Can I have a receipt?",
"Oui, je confirme. Je peux avoir un reçu ?",
"Waaw, dëggal naa ko. Ndax mën naa am resi ?"
],
[
"A",
"Here you are. The money has been sent.",
"Voilà. L'argent a été envoyé.",
"Mii ngi nii. Xaalis bi yónnee nañu ko."
]
];
  var QZ = [
[
"I want to ___ money to my mother.",
[
"send",
"sended",
"sent to"
],
"« want to » + verbe de base : send."
],
[
"How much is the ___ for the transfer?",
[
"fee",
"fine",
"feed"
],
"« fee » = les frais."
],
[
"I forgot my secret ___.",
[
"code",
"cold",
"coat"
],
"« secret code » = code secret."
]
];
  if (G.some(function (t) { return t.id === "banking"; })) return;
  G.push({
    id: "banking", niveau: 2, title: "N2 · 💳 Banque & mobile money",
    vocab: VOC.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }),
    dialogue: DIA.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }),
    quiz: QZ.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; })
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-banque.js",e);}

try{
/* ---- diisoo-mission-banque.js ---- */
/* diisoo-mission-banque.js v1 : Mission « Envoyer de l’argent »
   L'app joue l'agent Wave (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Banque ».
   Bouton place en haut du theme « Banque & mobile money » (Anglais). Essai : https://diisoo.sn/?mission=banque */
(function () {
  "use strict";
  if (window.DiisooMissionBanque) return;
  var Q = [
    { q: "Hello. How can I help you?", kw: /send|withdraw|deposit|money|transfer|account|want|need|cash|pay|help/i, m: "I want to send money to my mother." },
    { q: "What is her Wave number?", kw: /\d|number|seven|zero|wave|eight|two|one|nine|six|five|four|three/i, m: "Her number is seven seven, two eight eight, two one, zero nine." },
    { q: "How much do you want to send?", kw: /thousand|francs|\d|fifty|ten|twenty|hundred|five|send/i, m: "I want to send fifty thousand francs." },
    { q: "The fee is five hundred francs. Do you confirm?", kw: /yes|confirm|ok|okay|sure|fine|agree|no|expensive|too/i, m: "Yes, I confirm." },
    { q: "Do you want a receipt?", kw: /yes|please|receipt|no|thank|sure/i, m: "Yes, please. Thank you." }
  ];




  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mbq{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mbq .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mbq .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mbq .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mbq button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mbq .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mbq .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mbq .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mbq .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mbq .m.on{animation:mfp 1s infinite}@keyframes mfp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mbq .ok{color:#25D366}#mbq .or{color:#FFAA3C}" +
    "#mbq-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mbq-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mbq")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mbq";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">💳 Envoyer de l’argent · question ' + (i + 1) + '/' + Q.length + '</div>' +
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
        try { if (typeof BADGES !== "undefined" && !BADGES["banque"]) BADGES["banque"] = { icon: "💳", label: "Banque", desc: "Transfert d’argent réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("banque"); } catch (e) {}
      }
      noter("mission_banque", score + "/" + Q.length);
      o.innerHTML = '<div class="k">💳 Mission banque</div><div class="q">' + (ok ? "Transfert réussi ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Banque » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Famille et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mf-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mf-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mf-x2" type="button">Fermer</button>';
      document.getElementById("mf-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mf-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mf-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon envoi d’argent en anglais sur Diisoo 💳 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURICombqnent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mbq-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "banking") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mbq-btn";
    b.innerHTML = '<span style="font-size:22px">💳</span><span>Mission : envoyer de l’argent<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionBanque = { ouvrir: ouvrir };
  if (/[?&]mission=banque/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-banque.js",e);}
