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
