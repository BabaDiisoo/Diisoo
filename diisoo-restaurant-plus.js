/* diisoo-tour_resto-plus.js v1 : Business, Restaurant (mode et beauté) enrichi
   Wolof des phrases existantes complété, +15 phrases, 1 dialogue. Wolof relu par Babacar.
   Desactivable : ?tour_resto=0 */
(function () {
  "use strict";
  if (window.__diisooRestaurantPlus || /[?&]tour_resto=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.tour_resto) return;
  window.__diisooRestaurantPlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Do you have a free table?",
"fr": "Vous avez une table libre ?",
"wo": "Ndax am nga taabal bu libre ?"
},
{
"niveau": "debutant",
"en": "I would like to see the menu.",
"fr": "Je voudrais voir la carte.",
"wo": "Dama bëgg a gis menu bi."
},
{
"niveau": "debutant",
"en": "What do you recommend?",
"fr": "Que recommandez-vous ?",
"wo": "Lan nga may digal ?"
},
{
"niveau": "debutant",
"en": "A bottle of water, please.",
"fr": "Une bouteille d'eau, s'il vous plaît.",
"wo": "Benn butéelu ndox, bu la neexee."
},
{
"niveau": "debutant",
"en": "Chicken with rice, please.",
"fr": "Du poulet avec du riz, s'il vous plaît.",
"wo": "Ginaar ak ceeb, bu la neexee."
},
{
"niveau": "intermediaire",
"en": "Is the thieboudienne ready?",
"fr": "Le thieboudienne est prêt ?",
"wo": "Ndax ceebu jën bi pare na ?"
},
{
"niveau": "intermediaire",
"en": "How long do we have to wait?",
"fr": "On doit attendre combien de temps ?",
"wo": "Ñaata waxtu lanu war a xaar ?"
},
{
"niveau": "intermediaire",
"en": "Can I have a little more sauce?",
"fr": "Je peux avoir un peu plus de sauce ?",
"wo": "Ndax mën naa am tuuti soos bu ñu yokk ?"
},
{
"niveau": "intermediaire",
"en": "We are four. Can you push two tables together?",
"fr": "Nous sommes quatre. Vous pouvez rapprocher deux tables ?",
"wo": "Nun ñeent lanu. Ndax mën nga boole ñaari taabal ?"
},
{
"niveau": "intermediaire",
"en": "Can I pay with Wave?",
"fr": "Je peux payer avec Wave ?",
"wo": "Ndax mën naa faye ci Wave ?"
},
{
"niveau": "avance",
"en": "I have a food allergy. Does this dish contain fish?",
"fr": "J'ai une allergie alimentaire. Ce plat contient du poisson ?",
"wo": "Am naa aleerji ci lekk. Ndax ñam wii am na jën ?"
},
{
"niveau": "avance",
"en": "The dish is not what I ordered. Can you change it?",
"fr": "Ce plat n'est pas ce que j'ai commandé. Vous pouvez le changer ?",
"wo": "Lekk bii du li ma komànde woon. Ndax mën nga ko soppi ?"
},
{
"niveau": "avance",
"en": "There is a mistake on the bill.",
"fr": "Il y a une erreur sur la facture.",
"wo": "Am na njuumte ci faktir bi."
},
{
"niveau": "avance",
"en": "Can you prepare a birthday cake for Saturday evening?",
"fr": "Vous pouvez préparer un gâteau d'anniversaire pour samedi soir ?",
"wo": "Ndax mën nga defar gato ngir bésu juddu gaawu ci guddi ?"
},
{
"niveau": "avance",
"en": "I would like to leave feedback for the chef.",
"fr": "Je voudrais faire un compliment au chef.",
"wo": "Dama bëgg a sant njiitu kuisinye yi."
}
];
  var L = [
{
"role": "client",
"en": "Hello. I would like to book a table for eight people.",
"fr": "Bonjour. Je voudrais réserver une table pour huit personnes.",
"wo": "Jàmm nga fanaan. Dama bëgg a reserwe benn taabal ngir juróom-ñetti nit.",
"scene": "🍽️ Réserver une table pour un groupe"
},
{
"role": "serveur",
"en": "Of course. For which day and what time?",
"fr": "Bien sûr. Pour quel jour et à quelle heure ?",
"wo": "Waaw kay. Ngir ban bés ak ban waxtu ?"
},
{
"role": "client",
"en": "Saturday evening at eight o'clock.",
"fr": "Samedi soir à vingt heures.",
"wo": "Gaawu ci guddi ci juróom-ñetti waxtu."
},
{
"role": "serveur",
"en": "Perfect. Is it for a special occasion?",
"fr": "Parfait. C'est pour une occasion spéciale ?",
"wo": "Baax na lool. Ndax ngir benn xew-xew bu espesiyaal la ?"
},
{
"role": "client",
"en": "Yes, it is a birthday. Can you prepare a cake?",
"fr": "Oui, c'est un anniversaire. Vous pouvez préparer un gâteau ?",
"wo": "Waaw, bésu juddu la. Ndax mën nga defar gato ?"
},
{
"role": "serveur",
"en": "Yes, no problem. May I have your name and number?",
"fr": "Oui, pas de problème. Je peux avoir votre nom et votre numéro ?",
"wo": "Waaw, amul jafe-jafe. Ndax mën naa am sa tur ak sa nimero ?"
},
{
"role": "client",
"en": "Babacar, and my number is seven seven, two eight eight, two one, zero nine.",
"fr": "Babacar, et mon numéro est le 77 288 21 09.",
"wo": "Babacar, te sama nimero mooy juróom-ñaar juróom-ñaar, ñaar juróom-ñett juróom-ñett, ñaar benn, tus juróom-ñeent."
},
{
"role": "serveur",
"en": "Thank you, your table is reserved. See you on Saturday.",
"fr": "Merci, votre table est réservée. À samedi.",
"wo": "Jërëjëf, sa taabal bi reserwe nañu ko. Ba gaawu."
}
];
  var FIX = {"Today's special is chicken yassa": "Plaa bu bés bi mooy yassa ginaar.", "Is it spicy?": "Ndax dafa saf kaani ?", "I am allergic to peanuts": "Gerte dafay ma yakk.", "Can I have it without pepper?": "Ndax mën naa ko am te amul kaani ?", "Would you like to try the bissap juice?": "Ndax bëgg nga mos ndoxum bissap ?", "Do you accept card or mobile money?": "Ndax dangeen di nangu faye kart walla mobile money ?", "We recommend the grilled fish with onion sauce": "Dañuy digal jën wu ñu lakk ak soosu sooble.", "Could you recommend a typical Senegalese dish for someone who has never tried it?": "Ndax mën nga ma digal benn ñamu Senegaal ngir ku masul koo mos ?", "This dish is cold. Could you heat it up, please?": "Lekk bii dafa sedd. Ndax mën nga ko tàngal, bu la neexee ?", "We have a vegetarian menu and a halal kitchen.": "Am nanu menu bu amul yàpp ak waañ bu alal.", "I would like to book the terrace for a group of twelve on Saturday.": "Dama bëgg a reserwe teras bi ngir benn gurup bu fukk ak ñaari nit ci gaawu.", "The service was excellent, please keep the change.": "Liggéey bi baax na lool, jëlal xaalis bi ci des.", "We can prepare a set menu for tour groups at a fixed price.": "Mën nanu defar menu bu tënku ngir gurup yu turis ci benn njëg.", "Could we split the bill between four people?": "Ndax mën nanu séddoo faktir bi ci ñeenti nit ?"};
  C.tour_resto.vocab.forEach(function (v) { if (FIX[v.en]) v.wo = FIX[v.en]; });
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.tour_resto.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.tour_resto.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.tour_resto.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.tour_resto.vocab.length = 0; tri.forEach(function (t) { C.tour_resto.vocab.push(t[0]); });
  D.tour_resto = D.tour_resto || [];
  var vus = {}; D.tour_resto.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.tour_resto.push(l); });
})();
