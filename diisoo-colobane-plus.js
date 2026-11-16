/* diisoo-colobane-plus.js v1 : Business, Colobane (pièces détachées) enrichi
   +17 phrases (5 débutant, 5 intermédiaire, 7 avancé) et un dialogue « Commande de 20 jeux de plaquettes ». Wolof relu par Babacar.
   Desactivable : ?colobane=0 */
(function () {
  "use strict";
  if (window.__diisooColobanePlus || /[?&]colobane=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.colobane) return;
  window.__diisooColobanePlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Show me the brake pads, please.",
"fr": "Montre-moi les plaquettes de frein, s'il te plaît.",
"wo": "Won ma plaket fren yi, bu la neexee."
},
{
"niveau": "debutant",
"en": "How much is one tyre?",
"fr": "Combien coûte un pneu ?",
"wo": "Ñaata la benn pneu ?"
},
{
"niveau": "debutant",
"en": "Is it new or second-hand?",
"fr": "C'est neuf ou d'occasion ?",
"wo": "Ndax bu bées la wala occasion la ?"
},
{
"niveau": "debutant",
"en": "I will take two.",
"fr": "J'en prends deux.",
"wo": "Dinaa jënd ñaar."
},
{
"niveau": "debutant",
"en": "Can you deliver it to Thiès?",
"fr": "Tu peux la livrer à Thiès ?",
"wo": "Ndax mën nga ko yóbbu Cees ?"
},
{
"niveau": "intermediaire",
"en": "Can I test the part before paying?",
"fr": "Je peux tester la pièce avant de payer ?",
"wo": "Ndax mën naa jéem pièce bi balaa ma fey ?"
},
{
"niveau": "intermediaire",
"en": "How long does the delivery take?",
"fr": "La livraison prend combien de temps ?",
"wo": "Ñaata fan la livraison bi di ame ?"
},
{
"niveau": "intermediaire",
"en": "Do you have the same part in a cheaper brand?",
"fr": "Vous avez la même pièce dans une marque moins chère ?",
"wo": "Ndax am nga pièce bii ci marque bu njëg bi gën a tuuti ?"
},
{
"niveau": "intermediaire",
"en": "The part is damaged. I want a refund.",
"fr": "La pièce est abîmée. Je veux être remboursé.",
"wo": "Pièce bi dafa yaxu. Dama bëgg ñu delloo ma xaalis bi."
},
{
"niveau": "intermediaire",
"en": "Please write the price and the warranty on the invoice.",
"fr": "Écris le prix et la garantie sur la facture, s'il te plaît.",
"wo": "Bindal prix bi ak garanti bi ci facture bi, bu la neexee."
},
{
"niveau": "avance",
"en": "What is your minimum order quantity?",
"fr": "Quelle est votre commande minimale ?",
"wo": "Ban komànd bu gën a tuuti nga nangu ?"
},
{
"niveau": "avance",
"en": "Can you send me a sample before I order?",
"fr": "Pouvez-vous m'envoyer un échantillon avant ma commande ?",
"wo": "Ndax mën nga ma yónnee eesaantiyoŋ balaa may komànde ?"
},
{
"niveau": "avance",
"en": "What are your payment terms?",
"fr": "Quelles sont vos conditions de paiement ?",
"wo": "Naka ngeen di nangu fay gi ?"
},
{
"niveau": "avance",
"en": "I will pay half now and half on delivery.",
"fr": "Je paie la moitié maintenant et la moitié à la livraison.",
"wo": "Dinaa fay genn-wàll gi léegi, beneen genn-wàll bi bu ñu ma ko yónnee."
},
{
"niveau": "avance",
"en": "The shipment arrived late. Who pays the extra costs?",
"fr": "Le colis est arrivé en retard. Qui paie les frais en plus ?",
"wo": "Koli bi dafa yeex a agsi. Kan mooy fay xaalis bi ci yokku ?"
},
{
"niveau": "avance",
"en": "We need a contract with a delivery date.",
"fr": "Il nous faut un contrat avec une date de livraison.",
"wo": "Dafa war nu am kontraa bu am bés bu ñu koy yóbbu."
},
{
"niveau": "avance",
"en": "Please confirm the order by email.",
"fr": "Merci de confirmer la commande par e-mail.",
"wo": "Dëggalal komànd bi ci imel, bu la neexee."
}
];
  var L = [
{
"role": "client",
"en": "Good morning. I need twenty sets of brake pads for a 2010 Corolla.",
"fr": "Bonjour. Il me faut vingt jeux de plaquettes pour une Corolla 2010.",
"wo": "Jàmm nga fanaan. Dama soxla ñaar-fukki jeu plaket fren ngir Corolla 2010.",
"scene": "🔧 Commande de 20 jeux de plaquettes"
},
{
"role": "marchand",
"en": "Original or aftermarket?",
"fr": "D'origine ou aftermarket ?",
"wo": "Original walla aftermarket ?"
},
{
"role": "client",
"en": "Aftermarket. What is your best price for twenty?",
"fr": "Aftermarket. Quel est votre meilleur prix pour vingt ?",
"wo": "Aftermarket. Ban mooy sa njëg bi gën a tuuti ngir ñaar-fukk ?"
},
{
"role": "marchand",
"en": "Twelve thousand each, with six months of warranty.",
"fr": "Douze mille chacun, avec six mois de garantie.",
"wo": "Fukk ak ñaari junni benn bu nekk, ak garanti bu juróom-benni weer."
},
{
"role": "client",
"en": "Can you include delivery to Thiès?",
"fr": "Vous pouvez inclure la livraison à Thiès ?",
"wo": "Ndax mën nga boole livraison bi ba Cees ?"
},
{
"role": "marchand",
"en": "Yes, if you pay half now.",
"fr": "Oui, si vous payez la moitié maintenant.",
"wo": "Waaw, boo fayee genn-wàll gi léegi."
},
{
"role": "client",
"en": "Okay. Please write everything on the invoice.",
"fr": "D'accord. Écrivez tout sur la facture.",
"wo": "Waaw. Bindal lépp ci facture bi, bu la neexee."
},
{
"role": "marchand",
"en": "No problem. Thank you!",
"fr": "Pas de souci. Merci !",
"wo": "Amul jafe-jafe. Jërëjëf !"
}
];
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.colobane.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.colobane.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.colobane.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.colobane.vocab.length = 0; tri.forEach(function (t) { C.colobane.vocab.push(t[0]); });
  D.colobane = D.colobane || [];
  var vus = {}; D.colobane.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.colobane.push(l); });
})();
