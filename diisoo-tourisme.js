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
