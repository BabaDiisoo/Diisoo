/* diisoo-electronique-plus.js v1 : Business, Électronique (mode et beauté) enrichi
   +15 phrases et un dialogue. Wolof relu par Babacar.
   Desactivable : ?electronique=0 */
(function () {
  "use strict";
  if (window.__diisooÉlectroniquePlus || /[?&]electronique=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.electronique) return;
  window.__diisooÉlectroniquePlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Do you sell original phones?",
"fr": "Vous vendez des téléphones originaux ?",
"wo": "Ndax dangay jaay telefon yu original ?"
},
{
"niveau": "debutant",
"en": "How much is this phone?",
"fr": "Combien coûte ce téléphone ?",
"wo": "Ñaata la téléfon bii ?"
},
{
"niveau": "debutant",
"en": "Do you have a cheaper one?",
"fr": "Vous en avez un moins cher ?",
"wo": "Ndax am nga bu gën a yomb ?"
},
{
"niveau": "debutant",
"en": "I need a phone case.",
"fr": "Il me faut une coque de téléphone.",
"wo": "Dama soxla coque ngir sama téléfon."
},
{
"niveau": "debutant",
"en": "Can you charge it for me?",
"fr": "Vous pouvez me le charger ?",
"wo": "Ndax mën nga ma ko sarse ?"
},
{
"niveau": "intermediaire",
"en": "How many days does the battery last?",
"fr": "La batterie tient combien de jours ?",
"wo": "Ñaata fan la batiri bi di téye ?"
},
{
"niveau": "intermediaire",
"en": "Can you transfer my contacts to the new phone?",
"fr": "Vous pouvez transférer mes contacts sur le nouveau téléphone ?",
"wo": "Ndax mën nga ma jàllale sama contact yi ci telefon bu bees bi ?"
},
{
"niveau": "intermediaire",
"en": "Is the screen original or a copy?",
"fr": "L'écran est original ou une copie ?",
"wo": "Ndax ekraŋ bi original la walla copie la ?"
},
{
"niveau": "intermediaire",
"en": "Do you repair phones here?",
"fr": "Vous réparez les téléphones ici ?",
"wo": "Ndax dangeen di defar téléfon fii ?"
},
{
"niveau": "intermediaire",
"en": "How long does the repair take?",
"fr": "La réparation prend combien de temps ?",
"wo": "Ñaata waxtu la defar bi di jël ?"
},
{
"niveau": "avance",
"en": "Can you give me a discount if I buy three phones?",
"fr": "Vous pouvez me faire une remise si j'en achète trois ?",
"wo": "Ndax mën nga ma wàññil njëg li su ma jëndee ñetti téléfon ?"
},
{
"niveau": "avance",
"en": "I want to check that the phone is not stolen.",
"fr": "Je veux vérifier que le téléphone n'est pas volé.",
"wo": "Dama bëgg a seet ndax telefon bi du lu ñu sàcc."
},
{
"niveau": "avance",
"en": "What does the warranty cover exactly?",
"fr": "Qu'est-ce que la garantie couvre exactement ?",
"wo": "Lan la garanti bi tënk ci dëgg-dëgg ?"
},
{
"niveau": "avance",
"en": "The charger got hot. Is that normal?",
"fr": "Le chargeur a chauffé. C'est normal ?",
"wo": "Sarsëer bi dafa tàng. Ndax normal la ?"
},
{
"niveau": "avance",
"en": "Can you deliver to Thiès by bus tomorrow?",
"fr": "Vous pouvez livrer à Thiès par car demain ?",
"wo": "Ndax mën nga ma ko yónnee Cees ci kaar suba ?"
}
];
  var L = [
{
"role": "client",
"en": "Hello. I want a good phone for my work.",
"fr": "Bonjour. Je veux un bon téléphone pour mon travail.",
"wo": "Jàmm nga fanaan. Dama bëgg téléfon bu baax ngir sama liggéey.",
"scene": "📱 Acheter un téléphone"
},
{
"role": "marchand",
"en": "This one is very good. It is new and original.",
"fr": "Celui-ci est très bon. Il est neuf et original.",
"wo": "Bii baax na torop. Bees na te original la."
},
{
"role": "client",
"en": "How much is it?",
"fr": "Combien coûte-t-il ?",
"wo": "Ñaata la ?"
},
{
"role": "marchand",
"en": "One hundred and fifty thousand francs.",
"fr": "Cent cinquante mille francs.",
"wo": "Téeméeri junni ak juróom-fukki junni farã."
},
{
"role": "client",
"en": "It is expensive. Can you lower the price?",
"fr": "C'est cher. Vous pouvez baisser le prix ?",
"wo": "Dafa seer. Ndax mën nga wàññi njëg li ?"
},
{
"role": "marchand",
"en": "For you, one hundred and thirty thousand.",
"fr": "Pour vous, cent trente mille.",
"wo": "Ngir yaw, téeméeri junni ak fanweeri junni."
},
{
"role": "client",
"en": "Okay. Please put a screen protector and a case.",
"fr": "D'accord. Mettez un protège-écran et une coque, s'il vous plaît.",
"wo": "Waaw. Defal ma protège-écran ak coque, bu la neexee."
},
{
"role": "marchand",
"en": "Of course. Here is your phone and the receipt.",
"fr": "Bien sûr. Voici votre téléphone et le reçu.",
"wo": "Waaw kay. Sa telefon bi ak resi bi ñoo ngi nii."
}
];
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.electronique.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.electronique.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.electronique.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.electronique.vocab.length = 0; tri.forEach(function (t) { C.electronique.vocab.push(t[0]); });
  D.electronique = D.electronique || [];
  var vus = {}; D.electronique.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.electronique.push(l); });
})();
