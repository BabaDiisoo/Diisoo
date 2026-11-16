/* diisoo-chine-plus.js v1 : Business, Chine (mode et beauté) enrichi
   +16 phrases (5 débutant, 5 intermédiaire, 6 avancé) et un dialogue « Visite d'usine à Guangzhou ». Wolof relu par Babacar.
   Desactivable : ?chine=0 */
(function () {
  "use strict";
  if (window.__diisooChinePlus || /[?&]chine=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.chine) return;
  window.__diisooChinePlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Where is the factory?",
"fr": "Où est l'usine ?",
"wo": "Fan la isin bi nekk ?"
},
{
"niveau": "debutant",
"en": "Can I visit the factory?",
"fr": "Je peux visiter l'usine ?",
"wo": "Ndax mën naa dem seeti isin bi ?"
},
{
"niveau": "debutant",
"en": "Please send me the price list.",
"fr": "Envoyez-moi la liste des prix, s'il vous plaît.",
"wo": "Yónnee ma listu njëg yi, bu la neexee."
},
{
"niveau": "debutant",
"en": "Do you speak English?",
"fr": "Parlez-vous anglais ?",
"wo": "Ndax dangay wax àngale ?"
},
{
"niveau": "debutant",
"en": "I want to pay by bank transfer.",
"fr": "Je veux payer par virement bancaire.",
"wo": "Dama bëgg a faye wirmaa ci bànk."
},
{
"niveau": "intermediaire",
"en": "How long is the production time?",
"fr": "Combien de temps dure la production ?",
"wo": "Ñaata fan la liggéey bi di jël ?"
},
{
"niveau": "intermediaire",
"en": "Can you send a video of the product?",
"fr": "Vous pouvez envoyer une vidéo du produit ?",
"wo": "Ndax mën nga yónnee wideo produit bi ?"
},
{
"niveau": "intermediaire",
"en": "What is the weight of one carton?",
"fr": "Quel est le poids d'un carton ?",
"wo": "Ñaata kilo la benn kartoŋ am ?"
},
{
"niveau": "intermediaire",
"en": "Is the product tested before shipping?",
"fr": "Le produit est-il testé avant l'expédition ?",
"wo": "Ndax produit bi dañu koy seet bu baax balaa ñu koy yónnee ?"
},
{
"niveau": "intermediaire",
"en": "Can I change my order before production starts?",
"fr": "Je peux modifier ma commande avant le début de la production ?",
"wo": "Ndax mën naa soppi sama komànd balaa production bi di tàmbali ?"
},
{
"niveau": "avance",
"en": "We need a quality inspection by a third party.",
"fr": "Il nous faut une inspection qualité par un tiers.",
"wo": "Dafa war nu am saytu bu keneen ku bokkul ci jaay bi def."
},
{
"niveau": "avance",
"en": "What happens if the goods do not match the sample?",
"fr": "Que se passe-t-il si la marchandise n'est pas conforme à l'échantillon ?",
"wo": "Lan mooy am su marsandiis bi méngoowul ak eesaantiyoŋ bi ?"
},
{
"niveau": "avance",
"en": "Can you handle the export documents?",
"fr": "Pouvez-vous gérer les documents d'exportation ?",
"wo": "Ndax mën nga toppatoo dokimaŋ yu export yi ?"
},
{
"niveau": "avance",
"en": "I want a refund if the container arrives damaged.",
"fr": "Je veux un remboursement si le conteneur arrive endommagé.",
"wo": "Dama bëgg ñu delloo ma xaalis bi su konteneer bi agsee yàqu."
},
{
"niveau": "avance",
"en": "Is the exchange rate fixed in the contract?",
"fr": "Le taux de change est-il fixé dans le contrat ?",
"wo": "Ndax taux de change bi dañu ko tënk ci kontraa bi ?"
},
{
"niveau": "avance",
"en": "We will pay the balance after the inspection.",
"fr": "Nous paierons le solde après l'inspection.",
"wo": "Dinanu fay li ci des gannaaw inspeksiyoŋ bi."
}
];
  var L = [
{
"role": "client",
"en": "Hello. I am the buyer from Senegal. Thank you for the visit.",
"fr": "Bonjour. Je suis l'acheteur du Sénégal. Merci pour la visite.",
"wo": "Jàmm nga fanaan. Maa di jënd bu jóge Senegaal. Jërëjëf ci seetu bi.",
"scene": "🏭 Visite d'usine à Guangzhou"
},
{
"role": "usine",
"en": "Welcome. This is our production line.",
"fr": "Bienvenue. Voici notre ligne de production.",
"wo": "Dalal ak jàmm. Lii mooy sunu chaîne bu production."
},
{
"role": "client",
"en": "How many pieces can you make per month?",
"fr": "Combien de pièces pouvez-vous faire par mois ?",
"wo": "Ñaata pièce ngeen mën a def ci weer wu nekk ?"
},
{
"role": "usine",
"en": "Ten thousand pieces. The production time is twenty-five days.",
"fr": "Dix mille pièces. Le délai de production est de vingt-cinq jours.",
"wo": "Fukki junni pièce. Production bi di yàgg ñaar-fukk ak juróom fan."
},
{
"role": "client",
"en": "Can I see the quality test?",
"fr": "Je peux voir le test de qualité ?",
"wo": "Ndax mën naa gis test bi ci kalite bi ?"
},
{
"role": "usine",
"en": "Of course. We test every product before shipping.",
"fr": "Bien sûr. Nous testons chaque produit avant l'expédition.",
"wo": "Waaw kay. Dañu seet produit bu nekk bu baax balaa ñu koy yónnee."
},
{
"role": "client",
"en": "Good. I will order five thousand pieces. Please send the contract.",
"fr": "Bien. Je commande cinq mille pièces. Envoyez le contrat.",
"wo": "Baax na. Dinaa komànde juróomi junni pièce. Yónnee ma kontraa bi."
},
{
"role": "usine",
"en": "Thank you. We will send it today by email.",
"fr": "Merci. Nous l'envoyons aujourd'hui par e-mail.",
"wo": "Jërëjëf. Dinanu ko yónnee tey ci imel."
}
];
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.chine.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.chine.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.chine.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.chine.vocab.length = 0; tri.forEach(function (t) { C.chine.vocab.push(t[0]); });
  D.chine = D.chine || [];
  var vus = {}; D.chine.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.chine.push(l); });
})();
