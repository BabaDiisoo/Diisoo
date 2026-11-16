/* diisoo-sandaga-plus.js v1 : Business, Sandaga (mode et beauté) enrichi
   +17 phrases (5 débutant, 5 intermédiaire, 7 avancé) et un dialogue « Commande de 50 chemises ». Wolof relu par Babacar.
   Desactivable : ?sandaga=0 */
(function () {
  "use strict";
  if (window.__diisooSandagaPlus || /[?&]sandaga=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.sandaga) return;
  window.__diisooSandagaPlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Do you have this dress in my size?",
"fr": "Vous avez cette robe dans ma taille ?",
"wo": "Ndax am nga robe bii ci sama taille ?"
},
{
"niveau": "debutant",
"en": "How much is one metre of this fabric?",
"fr": "Combien coûte un mètre de ce tissu ?",
"wo": "Ñaata la benn mètr tissu bii ?"
},
{
"niveau": "debutant",
"en": "I like the red one.",
"fr": "J'aime le rouge.",
"wo": "Neex na ma bu xonq bi."
},
{
"niveau": "debutant",
"en": "Can you lower the price a little?",
"fr": "Tu peux baisser un peu le prix ?",
"wo": "Ndax mën nga wàññi njëg li tuuti ?"
},
{
"niveau": "debutant",
"en": "I will come back tomorrow.",
"fr": "Je reviens demain.",
"wo": "Dinaa dellusi suba."
},
{
"niveau": "intermediaire",
"en": "Do you have the same fabric in other patterns?",
"fr": "Vous avez le même tissu avec d'autres motifs ?",
"wo": "Ndax am nga tissu bii ci yeneen motif ?"
},
{
"niveau": "intermediaire",
"en": "How many metres are in a full piece?",
"fr": "Combien de mètres y a-t-il dans une pièce complète ?",
"wo": "Ñaata mètr a nekk ci benn pièce bu mat ?"
},
{
"niveau": "intermediaire",
"en": "Can the tailor make it by Friday?",
"fr": "Le tailleur peut le faire pour vendredi ?",
"wo": "Ndax tayëer bi mën na ko ñaaw balaa àjjuma ?"
},
{
"niveau": "intermediaire",
"en": "I would like to see your newest collection.",
"fr": "J'aimerais voir votre nouvelle collection.",
"wo": "Dama bëgg a gis seen koleksiyoŋ bu bees bi."
},
{
"niveau": "intermediaire",
"en": "Is the colour natural or chemical?",
"fr": "La couleur est-elle naturelle ou chimique ?",
"wo": "Ndax couleur bi natirel la walla chimique la ?"
},
{
"niveau": "avance",
"en": "Can you make the same model in five sizes?",
"fr": "Pouvez-vous faire le même modèle en cinq tailles ?",
"wo": "Ndax mën nga def modèle bii ci juróomi taille ?"
},
{
"niveau": "avance",
"en": "I need the order ready before Tabaski.",
"fr": "Il me faut la commande avant la Tabaski.",
"wo": "Dama soxla commande bi pare balaa Tabaski."
},
{
"niveau": "avance",
"en": "What is the price if I bring my own fabric?",
"fr": "Quel est le prix si j'apporte mon propre tissu ?",
"wo": "Ñaata la njëg li bu ma indee sama tissu ?"
},
{
"niveau": "avance",
"en": "Can you embroider a logo on each piece?",
"fr": "Pouvez-vous broder un logo sur chaque pièce ?",
"wo": "Ndax mën nga brode logo ci pièce bu nekk ?"
},
{
"niveau": "avance",
"en": "The sizes are not correct. I want a replacement.",
"fr": "Les tailles ne sont pas correctes. Je veux un remplacement.",
"wo": "Taille yi baaxul. Dama bëgg ngeen soppi ma leen."
},
{
"niveau": "avance",
"en": "Do you give credit to regular customers?",
"fr": "Vous faites crédit aux clients réguliers ?",
"wo": "Ndax dangeen di joxe leb ngir kliyaan yu sax yi ?"
},
{
"niveau": "avance",
"en": "Please send photos of the finished clothes before shipping.",
"fr": "Envoyez des photos des vêtements finis avant l'expédition.",
"wo": "Yónnee ma nataali yére yi pare balaa ngeen leen di yónnee."
}
];
  var L = [
{
"role": "client",
"en": "Good morning. I would like to order fifty shirts in three sizes.",
"fr": "Bonjour. Je voudrais commander cinquante chemises en trois tailles.",
"wo": "Jàmm nga fanaan. Dama bëgg a komànde juróom-fukki simis ci ñetti taille.",
"scene": "👗 Commande de 50 chemises"
},
{
"role": "tailleur",
"en": "Which fabric do you want?",
"fr": "Quel tissu voulez-vous ?",
"wo": "Ban tissu ngeen bëgg ?"
},
{
"role": "client",
"en": "Wax fabric. Here is a sample.",
"fr": "Du wax. Voici un échantillon.",
"wo": "Wax la. Eesaantiyoŋ bi mii ngi nii."
},
{
"role": "tailleur",
"en": "It will take two weeks. The price is eight thousand francs per shirt.",
"fr": "Ça prendra deux semaines. Le prix est de huit mille francs par chemise.",
"wo": "Dina jël ñaari ayu-bés. Njëg li mooy juróom-ñetti junni ci simis bu nekk."
},
{
"role": "client",
"en": "Can you put my shop name on the labels?",
"fr": "Vous pouvez mettre le nom de ma boutique sur les étiquettes ?",
"wo": "Ndax mën nga def turu sama butik ci etikët yi ?"
},
{
"role": "tailleur",
"en": "Yes, it costs five hundred francs more per shirt.",
"fr": "Oui, ça coûte cinq cents francs de plus par chemise.",
"wo": "Waaw, dina yokku juróomi téeméeri farã ci simis bu nekk."
},
{
"role": "client",
"en": "Okay. Send me photos before shipping.",
"fr": "D'accord. Envoyez-moi des photos avant l'expédition.",
"wo": "Waaw. Yónnee ma nataali yére yi pare balaa ngeen leen di yónnee."
},
{
"role": "tailleur",
"en": "Of course. Thank you for your trust.",
"fr": "Bien sûr. Merci de votre confiance.",
"wo": "Waaw kay. Jërëjëf ci sa kóolute."
}
];
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.sandaga.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.sandaga.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.sandaga.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.sandaga.vocab.length = 0; tri.forEach(function (t) { C.sandaga.vocab.push(t[0]); });
  D.sandaga = D.sandaga || [];
  var vus = {}; D.sandaga.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.sandaga.push(l); });
})();
