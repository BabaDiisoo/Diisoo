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
