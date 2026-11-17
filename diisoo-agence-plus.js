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
