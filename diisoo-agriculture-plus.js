/* diisoo-agriculture-plus.js v1 : Business, Agriculture (mode et beauté) enrichi
   +15 phrases et un dialogue. Wolof relu par Babacar.
   Desactivable : ?agriculture=0 */
(function () {
  "use strict";
  if (window.__diisooAgriculturePlus || /[?&]agriculture=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.agriculture) return;
  window.__diisooAgriculturePlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Do you have fresh mangoes?",
"fr": "Vous avez des mangues fraîches ?",
"wo": "Ndax am nga màngo yu bees ?"
},
{
"niveau": "debutant",
"en": "How much is a bag of rice?",
"fr": "Combien coûte un sac de riz ?",
"wo": "Ñaata la benn saaku ceeb ?"
},
{
"niveau": "debutant",
"en": "I need seeds for the rainy season.",
"fr": "Il me faut des semences pour l'hivernage.",
"wo": "Dama soxla jiwu ngir nawet bi."
},
{
"niveau": "debutant",
"en": "Where is your field?",
"fr": "Où est votre champ ?",
"wo": "Fan la sa tool bi nekk ?"
},
{
"niveau": "debutant",
"en": "Can I taste it?",
"fr": "Je peux goûter ?",
"wo": "Ndax mën naa ko mos ?"
},
{
"niveau": "intermediaire",
"en": "How many bags can you supply per week?",
"fr": "Combien de sacs pouvez-vous fournir par semaine ?",
"wo": "Ñaata saaku ngeen mën a joxe ci ayu-bés bu nekk ?"
},
{
"niveau": "intermediaire",
"en": "Do you use fertiliser?",
"fr": "Vous utilisez de l'engrais ?",
"wo": "Ndax dangeen di jëfandikoo àngere ?"
},
{
"niveau": "intermediaire",
"en": "Is the harvest ready?",
"fr": "La récolte est prête ?",
"wo": "Ndax ngóob mi pare na ?"
},
{
"niveau": "intermediaire",
"en": "Can you deliver to Thiès market on Monday?",
"fr": "Vous pouvez livrer au marché de Thiès lundi ?",
"wo": "Ndax mën nga ko yónnee marse Cees altine ?"
},
{
"niveau": "intermediaire",
"en": "Can I visit your farm this weekend?",
"fr": "Je peux visiter votre ferme ce week-end ?",
"wo": "Ndax mën naa seeti sa ferme bii weekend ?"
},
{
"niveau": "avance",
"en": "I want to buy your whole harvest at a fixed price.",
"fr": "Je veux acheter toute votre récolte à prix fixe.",
"wo": "Dama bëgg a jënd sa ngóob mépp ci benn njëg bu tënku."
},
{
"niveau": "avance",
"en": "Do you have a certificate for organic products?",
"fr": "Vous avez un certificat pour les produits bio ?",
"wo": "Ndax am nga sertifika ngir produit yu bio ?"
},
{
"niveau": "avance",
"en": "Part of the harvest was damaged by the drought.",
"fr": "Une partie de la récolte a été abîmée par la sécheresse.",
"wo": "Benn wàll ci ngóob mi yàqu na ndax bekkoor."
},
{
"niveau": "avance",
"en": "Can you give me credit until I sell the produce?",
"fr": "Vous pouvez me faire crédit jusqu'à la vente ?",
"wo": "Ndax mën nga ma joxe leb ba ma jaayee marsandiis bi ?"
},
{
"niveau": "avance",
"en": "I want to pay half now and half at delivery.",
"fr": "Je veux payer la moitié maintenant et la moitié à la livraison.",
"wo": "Dama bëgg a fay genn-wàll gi léegi, beneen genn-wàll bi bu yónnee bi agsee."
}
];
  var L = [
{
"role": "client",
"en": "Hello. I want to buy vegetables for my restaurant.",
"fr": "Bonjour. Je veux acheter des légumes pour mon restaurant.",
"wo": "Jàmm nga fanaan. Dama bëgg a jënd legim ngir sama restoraŋ.",
"scene": "🌾 Visite chez un producteur"
},
{
"role": "producteur",
"en": "Welcome to my farm. Everything is fresh.",
"fr": "Bienvenue dans ma ferme. Tout est frais.",
"wo": "Dalal ak jàmm ci sama ferme. Lépp dafa bees."
},
{
"role": "client",
"en": "How many kilos of tomatoes can you give me every week?",
"fr": "Combien de kilos de tomates pouvez-vous me donner chaque semaine ?",
"wo": "Ñaata kilo tamaate ngeen ma mën a jox ci ayu-bés bu nekk ?"
},
{
"role": "producteur",
"en": "One hundred kilos, and I can deliver on Monday.",
"fr": "Cent kilos, et je peux livrer lundi.",
"wo": "Téeméeri kilo, te mën naa ko yónnee altine."
},
{
"role": "client",
"en": "What is your price for one kilo?",
"fr": "Quel est votre prix pour un kilo ?",
"wo": "Ñaata la sa njëg ngir benn kilo ?"
},
{
"role": "producteur",
"en": "Four hundred francs. For a regular client, three hundred and fifty.",
"fr": "Quatre cents francs. Pour un client régulier, trois cent cinquante.",
"wo": "Juróom-ñett-fukki dërëm. Ngir kliyaan bu sax, juróom-ñaar-fukki dërëm."
},
{
"role": "client",
"en": "Good. I will take one hundred kilos every week.",
"fr": "Bien. Je prends cent kilos chaque semaine.",
"wo": "Baax na. Dinaa jël téeméeri kilo ci ayu-bés bu nekk."
},
{
"role": "producteur",
"en": "Perfect. I will write it down and call you on Sunday.",
"fr": "Parfait. Je le note et je vous appelle dimanche.",
"wo": "Baax na lool. Dinaa ko bind te woo la dibéer."
}
];
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.agriculture.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.agriculture.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.agriculture.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.agriculture.vocab.length = 0; tri.forEach(function (t) { C.agriculture.vocab.push(t[0]); });
  D.agriculture = D.agriculture || [];
  var vus = {}; D.agriculture.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.agriculture.push(l); });
})();
