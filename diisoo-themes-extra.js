/* diisoo-themes-extra.js
 * 1) Classe les thèmes d'anglais généraux en 3 niveaux (N1 Débutant complet, N2 Débutant, N3 Pratique réelle).
 * 2) Ajoute 5 thèmes de situations réelles : hôtel, chemin, entretien d'embauche, présenter son activité, commande et livraison.
 * Ne supprime et ne modifie aucune phrase existante. Seul le titre des onglets reçoit un préfixe « N1 · », « N2 · » ou « N3 · ».
 * Wolof : première version écrite par Claude, à faire valider par un locuteur natif avant de communiquer dessus.
 */
(function () {
  "use strict";
  if (window.__diisooThemesExtra) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooThemesExtra = true;

  var NIVEAU = {
    intro: 1, family: 1, food: 1, time: 1,
    work: 2, market: 2, travel: 2, health: 2, housing: 2, directions: 2,
    visa: 3, agri: 3, hotel: 3, interview: 3, pitch: 3, orders: 3
  };

  var NOUVEAUX = [
    {
      id: "hotel", title: "Réserver un hôtel",
      vocab: [
        { en: "Room", fr: "Chambre", wo: "Néeg bi" },
        { en: "Key", fr: "Clé", wo: "Caabi bi" },
        { en: "Night", fr: "Nuit", wo: "Guddi gi" },
        { en: "Breakfast", fr: "Petit-déjeuner", wo: "Ndekki bi" },
        { en: "I have a reservation", fr: "J'ai une réservation", wo: "Am naa réserwasioŋ" },
        { en: "Do you have a free room?", fr: "Avez-vous une chambre libre ?", wo: "Am ngeen néeg bu amul kenn ?" },
        { en: "How much is it per night?", fr: "C'est combien la nuit ?", wo: "Ñaata la guddi gi ?" },
        { en: "Is breakfast included?", fr: "Le petit-déjeuner est-il compris ?", wo: "Ndekki bi dafa nekk ci njëg gi ?" }
      ],
      dialogue: [
        { who: "A", en: "Good evening. How can I help you?", fr: "Bonsoir. Comment puis-je vous aider ?", wo: "Naka laa la mën a dimbali ?" },
        { who: "B", en: "I would like a room for two nights.", fr: "Je voudrais une chambre pour deux nuits.", wo: "Maa ngi bëgg benn néeg ñaari guddi." },
        { who: "A", en: "Single or double?", fr: "Simple ou double ?", wo: "Néeg bu benn nit walla bu ñaari nit ?" },
        { who: "B", en: "A single room, please. How much is it?", fr: "Une chambre simple, s'il vous plaît. C'est combien ?", wo: "Benn néeg bu benn nit, baal ma. Ñaata la ?" },
        { who: "A", en: "It is thirty thousand francs per night, breakfast included.", fr: "C'est trente mille francs la nuit, petit-déjeuner compris.", wo: "Fanweer junni franc la guddi gi, ndekki bi ci biir la." },
        { who: "B", en: "That is fine. Here is my passport.", fr: "C'est bon. Voici mon passeport.", wo: "Baax na. Nii mooy sama paspoor." },
        { who: "A", en: "Thank you. Here is your key. Room twelve.", fr: "Merci. Voici votre clé. Chambre douze.", wo: "Jërëjëf. Nii mooy sa caabi. Néeg bu fukk ak ñaar." }
      ],
      quiz: [
        { q: "I have a ___.", o: ["reservation", "reserve", "reservate"], a: 0, why: "« I have a reservation » = j'ai une réservation." },
        { q: "How much is it ___ night?", o: ["per", "for", "at"], a: 0, why: "« per night » = par nuit." },
        { q: "Is breakfast ___?", o: ["included", "include", "including"], a: 0, why: "« Is breakfast included? » = le petit-déjeuner est-il compris ?" }
      ]
    },
    {
      id: "directions", title: "Demander son chemin",
      vocab: [
        { en: "Left", fr: "Gauche", wo: "Càmmoñ" },
        { en: "Right", fr: "Droite", wo: "Ndeyjoor" },
        { en: "Straight ahead", fr: "Tout droit", wo: "Jubal" },
        { en: "Street", fr: "Rue", wo: "Mbedd mi" },
        { en: "Near", fr: "Près", wo: "Jege" },
        { en: "Far", fr: "Loin", wo: "Sori" },
        { en: "Excuse me, where is the market?", fr: "Excusez-moi, où est le marché ?", wo: "Baal ma, fan la marse bi nekk ?" },
        { en: "Turn left", fr: "Tournez à gauche", wo: "Jëw ci càmmoñ" }
      ],
      dialogue: [
        { who: "A", en: "Excuse me, where is the bus station?", fr: "Excusez-moi, où est la gare routière ?", wo: "Baal ma, fan la gaar bi nekk ?" },
        { who: "B", en: "Go straight, then turn left at the traffic light.", fr: "Allez tout droit, puis tournez à gauche au feu.", wo: "Jubal, noppi jëw ci càmmoñ ci làmp bi." },
        { who: "A", en: "Is it far?", fr: "C'est loin ?", wo: "Dafa sori ?" },
        { who: "B", en: "No, it is five minutes on foot.", fr: "Non, c'est à cinq minutes à pied.", wo: "Déedéet, juroom miniit rekk ci tànk." },
        { who: "A", en: "Thank you very much.", fr: "Merci beaucoup.", wo: "Jërëjëf ci lool." },
        { who: "B", en: "You are welcome.", fr: "Je vous en prie.", wo: "Amul solo." }
      ],
      quiz: [
        { q: "Turn ___ at the traffic light.", o: ["left", "leave", "lift"], a: 0, why: "« Turn left » = tournez à gauche." },
        { q: "How ___ is it?", o: ["far", "long-far", "much-far"], a: 0, why: "« How far is it? » = c'est à quelle distance ?" },
        { q: "Go ___, then turn right.", o: ["straight", "strait", "straigth"], a: 0, why: "« Go straight » = allez tout droit." }
      ]
    },
    {
      id: "interview", title: "Entretien d'embauche",
      vocab: [
        { en: "Experience", fr: "Expérience", wo: "Eksperiyaas" },
        { en: "Skills", fr: "Compétences", wo: "Xam-xam yi" },
        { en: "Salary", fr: "Salaire", wo: "Peyoor" },
        { en: "Tell me about yourself", fr: "Parlez-moi de vous", wo: "Wax ma ci sa bopp" },
        { en: "I have five years of experience", fr: "J'ai cinq ans d'expérience", wo: "Am naa juroom at ci liggéey bi" },
        { en: "Why do you want this job?", fr: "Pourquoi voulez-vous ce poste ?", wo: "Lu tax nga bëgg liggéey bii ?" },
        { en: "I can start next month", fr: "Je peux commencer le mois prochain", wo: "Mën naa tàmbali weer wi di ñëw" },
        { en: "I am reliable", fr: "Je suis fiable", wo: "Ñuy wóolu ma" }
      ],
      dialogue: [
        { who: "A", en: "Tell me about yourself.", fr: "Parlez-moi de vous.", wo: "Wax ma ci sa bopp." },
        { who: "B", en: "I am a logistics graduate with five years of experience.", fr: "Je suis diplômé en logistique avec cinq ans d'expérience.", wo: "Maa ngi jàng lojistik te am naa juroom at ci liggéey bi." },
        { who: "A", en: "Why do you want this job?", fr: "Pourquoi voulez-vous ce poste ?", wo: "Lu tax nga bëgg liggéey bii ?" },
        { who: "B", en: "I like organizing transport and working with a team.", fr: "J'aime organiser le transport et travailler en équipe.", wo: "Bëgg naa tëral yoonu transpoor te liggéey ak mbooloo mi." },
        { who: "A", en: "What is your greatest strength?", fr: "Quel est votre point fort ?", wo: "Lan mooy sa kàttan bu ëpp ?" },
        { who: "B", en: "I am reliable and I solve problems quickly.", fr: "Je suis fiable et je résous vite les problèmes.", wo: "Ñuy wóolu ma te di leru jafe-jafe yi ci gaaw." },
        { who: "A", en: "When can you start?", fr: "Quand pouvez-vous commencer ?", wo: "Kañ nga mën a tàmbali ?" },
        { who: "B", en: "I can start next month.", fr: "Je peux commencer le mois prochain.", wo: "Mën naa tàmbali weer wi di ñëw." }
      ],
      quiz: [
        { q: "I have five years of ___.", o: ["experience", "experiences", "experiment"], a: 0, why: "« experience » est indénombrable ici : five years of experience." },
        { q: "Tell me about ___.", o: ["yourself", "you", "your"], a: 0, why: "« Tell me about yourself » = parlez-moi de vous." },
        { q: "When can you ___?", o: ["start", "starting", "to start"], a: 0, why: "Après « can », le verbe reste à l'infinitif sans « to »." }
      ]
    },
    {
      id: "pitch", title: "Présenter son activité",
      vocab: [
        { en: "Company", fr: "Entreprise", wo: "Kompaañi bi" },
        { en: "Customer", fr: "Client", wo: "Kiliyaŋ bi" },
        { en: "Product", fr: "Produit", wo: "Produi bi" },
        { en: "Catalogue", fr: "Catalogue", wo: "Katalog bi" },
        { en: "I run a small business in Thiès", fr: "Je dirige une petite entreprise à Thiès", wo: "Maa ngi jiite ab liggéeyukaay bu ndaw ci Cees" },
        { en: "We sell and export local products", fr: "Nous vendons et exportons des produits locaux", wo: "Ñu ngi jaay te di yónnee yëfi réew mi" },
        { en: "We are looking for a reliable partner", fr: "Nous cherchons un partenaire fiable", wo: "Ñu ngi seet ab pàrtneer bu ñuy wóolu" },
        { en: "Can I send you our catalogue?", fr: "Puis-je vous envoyer notre catalogue ?", wo: "Mën naa la yónnee sunu katalog ?" }
      ],
      dialogue: [
        { who: "A", en: "Nice to meet you. What does your company do?", fr: "Enchanté. Que fait votre entreprise ?", wo: "Neex na ma xam la. Lu sa liggéeyukaay def ?" },
        { who: "B", en: "We sell and export local products from Senegal.", fr: "Nous vendons et exportons des produits locaux du Sénégal.", wo: "Ñu ngi jaay te di yónnee yëfi réew mi ci Senegaal." },
        { who: "A", en: "How long have you been in business?", fr: "Depuis quand êtes-vous en activité ?", wo: "Ñaata at ngeen am ci liggéey bi ?" },
        { who: "B", en: "Since 2022. We have clients in Dakar and Thiès.", fr: "Depuis 2022. Nous avons des clients à Dakar et à Thiès.", wo: "Li dale 2022. Am nanu kiliyaŋ ci Ndakaaru ak Cees." },
        { who: "A", en: "What are you looking for?", fr: "Que cherchez-vous ?", wo: "Lan ngeen di seet ?" },
        { who: "B", en: "We are looking for a reliable partner abroad. Can I send you our catalogue?", fr: "Nous cherchons un partenaire fiable à l'étranger. Puis-je vous envoyer notre catalogue ?", wo: "Ñu ngi seet ab pàrtneer bu ñuy wóolu ci biti. Mën naa la yónnee sunu katalog ?" }
      ],
      quiz: [
        { q: "We ___ local products.", o: ["sell", "sells", "selling"], a: 0, why: "« We sell » : pas de -s avec we." },
        { q: "We are looking ___ a partner.", o: ["for", "to", "at"], a: 0, why: "« look for » = chercher." },
        { q: "Can I send you our ___?", o: ["catalogue", "catalogue's", "cataloguing"], a: 0, why: "« catalogue » = catalogue de produits." }
      ]
    },
    {
      id: "orders", title: "Commande & livraison",
      vocab: [
        { en: "Order", fr: "Commande", wo: "Komaand bi" },
        { en: "Quantity", fr: "Quantité", wo: "Kantite bi" },
        { en: "Delivery", fr: "Livraison", wo: "Yónnee bi" },
        { en: "Invoice", fr: "Facture", wo: "Faktiir bi" },
        { en: "I want to place an order", fr: "Je veux passer une commande", wo: "Bëgg naa def ab komaand" },
        { en: "How many pieces do you need?", fr: "Combien de pièces vous faut-il ?", wo: "Ñaata pyes ngeen soxla ?" },
        { en: "When will the goods arrive?", fr: "Quand les marchandises arriveront-elles ?", wo: "Kañ la marsandiis yi di agsi ?" },
        { en: "Can you send me the invoice?", fr: "Pouvez-vous m'envoyer la facture ?", wo: "Mën ngeen ma yónnee faktiir bi ?" }
      ],
      dialogue: [
        { who: "A", en: "Hello, I would like to place an order.", fr: "Bonjour, je voudrais passer une commande.", wo: "Salaamaleekum, bëgg naa def ab komaand." },
        { who: "B", en: "Sure. How many pieces do you need?", fr: "Bien sûr. Combien de pièces vous faut-il ?", wo: "Waaw. Ñaata pyes ngeen soxla ?" },
        { who: "A", en: "Five hundred pieces. What is the price?", fr: "Cinq cents pièces. Quel est le prix ?", wo: "Juroom téeméer pyes. Ñaata la njëg gi ?" },
        { who: "B", en: "For five hundred pieces, it is two dollars each.", fr: "Pour cinq cents pièces, c'est deux dollars l'unité.", wo: "Ci juroom téeméer pyes, ñaari dolaar la ci benn." },
        { who: "A", en: "When will the goods arrive in Dakar?", fr: "Quand les marchandises arriveront-elles à Dakar ?", wo: "Kañ la marsandiis yi di agsi Ndakaaru ?" },
        { who: "B", en: "Delivery takes three weeks by sea. I will send the invoice today.", fr: "La livraison prend trois semaines par bateau. J'envoie la facture aujourd'hui.", wo: "Yónnee bi dafay jël ñetti ayubés ci géej. Dinaa yónnee faktiir bi tey." }
      ],
      quiz: [
        { q: "How ___ pieces do you need?", o: ["many", "much", "more"], a: 0, why: "« pieces » se compte : how many." },
        { q: "The minimum ___ is one hundred pieces.", o: ["order", "ordering", "ordered"], a: 0, why: "« minimum order » = commande minimum." },
        { q: "Delivery ___ two weeks.", o: ["takes", "take", "taking"], a: 0, why: "Sujet singulier (delivery) : takes." }
      ]
    }
  ];

  var ids = {};
  G.forEach(function (t) { ids[t.id] = true; });
  NOUVEAUX.forEach(function (t) { if (!ids[t.id]) G.push(t); });

  G.forEach(function (t) {
    var n = NIVEAU[t.id] || 3;
    t.niveau = n;
    if (!/^N[123] · /.test(t.title)) t.title = "N" + n + " · " + t.title;
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();
