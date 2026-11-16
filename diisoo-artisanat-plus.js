/* diisoo-tour_artisanat-plus.js v1 : Business, Artisanat (mode et beauté) enrichi
   Wolof des phrases existantes complété, +15 phrases, 1 dialogue. Wolof relu par Babacar.
   Desactivable : ?tour_artisanat=0 */
(function () {
  "use strict";
  if (window.__diisooArtisanatPlus || /[?&]tour_artisanat=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.tour_artisanat) return;
  window.__diisooArtisanatPlus = true;
  var V = [
{
"niveau": "debutant",
"en": "May I see that bag?",
"fr": "Je peux voir ce sac ?",
"wo": "Ndax mën naa gis saaku bii ?"
},
{
"niveau": "debutant",
"en": "How much is the bracelet?",
"fr": "Combien coûte le bracelet ?",
"wo": "Ñaata la barasle bi ?"
},
{
"niveau": "debutant",
"en": "Do you have other colours?",
"fr": "Vous avez d'autres couleurs ?",
"wo": "Ndax am nga yeneen kuloor ?"
},
{
"niveau": "debutant",
"en": "It is too big for me.",
"fr": "C'est trop grand pour moi.",
"wo": "Dafa réy lool ngir man."
},
{
"niveau": "debutant",
"en": "I like this one.",
"fr": "J'aime celui-ci.",
"wo": "Bii neex na ma."
},
{
"niveau": "intermediaire",
"en": "Who made this piece?",
"fr": "Qui a fabriqué cette pièce ?",
"wo": "Ku defar yëf bii ?"
},
{
"niveau": "intermediaire",
"en": "How long did it take to make?",
"fr": "Combien de temps a pris la fabrication ?",
"wo": "Ñaata waxtu la jël ngir defar ko ?"
},
{
"niveau": "intermediaire",
"en": "Can you engrave my name on it?",
"fr": "Vous pouvez graver mon nom dessus ?",
"wo": "Ndax mën nga ma bind sama tur ci kawam ?"
},
{
"niveau": "intermediaire",
"en": "Is this basket made of straw or leather?",
"fr": "Ce panier est en paille ou en cuir ?",
"wo": "Ndax pañe bii ñax lañu ko defare walla der ?"
},
{
"niveau": "intermediaire",
"en": "Can I take a photo of your workshop?",
"fr": "Je peux photographier votre atelier ?",
"wo": "Ndax mën naa jël nataalu sa ateliye bi ?"
},
{
"niveau": "avance",
"en": "I am a shop owner abroad. Do you sell in bulk?",
"fr": "Je tiens une boutique à l'étranger. Vous vendez en gros ?",
"wo": "Maa ngi yor butik ci biti réew. Ndax dangay jaay en gros ?"
},
{
"niveau": "avance",
"en": "Can you guarantee the delivery date for an order of fifty pieces?",
"fr": "Vous pouvez garantir la date de livraison pour cinquante pièces ?",
"wo": "Ndax mën nga ma wóoral bésu yónnee bi ngir juróom-fukki yëf ?"
},
{
"niveau": "avance",
"en": "I would like to see a certificate of origin for this piece.",
"fr": "Je voudrais voir un certificat d'origine pour cette pièce.",
"wo": "Dama bëgg a gis sertifika bu fa mu jóge ngir yëf bii."
},
{
"niveau": "avance",
"en": "Do you accept orders by WhatsApp and payment by Wave?",
"fr": "Vous acceptez les commandes par WhatsApp et le paiement par Wave ?",
"wo": "Ndax dangeen di nangu komànd ci WhatsApp ak faye Wave ?"
},
{
"niveau": "avance",
"en": "The colour is different from the photo. I would like an exchange.",
"fr": "La couleur est différente de la photo. Je voudrais un échange.",
"wo": "Kuloor bi wuute na ak nataal bi. Dama bëgg ñu soppi ma ko."
}
];
  var L = [
{
"role": "touriste",
"en": "Hello. I am looking for a gift for my family.",
"fr": "Bonjour. Je cherche un cadeau pour ma famille.",
"wo": "Jàmm nga fanaan. Maa ngi seet kado ngir sama njaboot.",
"scene": "🎨 Acheter un souvenir au marché artisanal"
},
{
"role": "artisan",
"en": "Welcome. Everything here is handmade.",
"fr": "Bienvenue. Tout ici est fait à la main.",
"wo": "Dalal ak jàmm. Lépp fii loxo lañu ko defare."
},
{
"role": "touriste",
"en": "This bag is very beautiful. How much is it?",
"fr": "Ce sac est très beau. Combien coûte-t-il ?",
"wo": "Saaku bii rafet na torop. Ñaata la ?"
},
{
"role": "artisan",
"en": "Twenty thousand francs. It is made of real leather.",
"fr": "Vingt mille francs. Il est en vrai cuir.",
"wo": "Ñaar-fukki junni farã. Der bu dëgg la."
},
{
"role": "touriste",
"en": "That is a lot. Can you do fifteen thousand?",
"fr": "C'est beaucoup. Vous pouvez faire quinze mille ?",
"wo": "Dafa bari. Ndax mën nga def fukk ak juróomi junni ?"
},
{
"role": "artisan",
"en": "For you, eighteen thousand and I add a small keyring.",
"fr": "Pour vous, dix-huit mille et j'ajoute un petit porte-clés.",
"wo": "Ngir yaw, fukk ak juróom-ñetti junni, te dinaa yokk benn porte-clé bu ndaw."
},
{
"role": "touriste",
"en": "Okay, deal. Can you wrap it carefully?",
"fr": "D'accord, c'est bon. Vous pouvez l'emballer avec soin ?",
"wo": "Waaw, baax na. Ndax mën nga ko laxas bu baax ?"
},
{
"role": "artisan",
"en": "Of course. Thank you, and come back soon.",
"fr": "Bien sûr. Merci, et revenez bientôt.",
"wo": "Waaw kay. Jërëjëf, te dellusil ci lu gaaw."
}
];
  var FIX = {"Can I pay by card?": "Ndax mën naa fay ci kart ?", "Do you have a smaller size?": "Ndax am nga lu gën a ndaw ?", "This mask is made of wood from the Casamance": "Mask bii banti Kasamaas lañu ko defare.", "The price is fixed, but I can make a small gift": "Njëg li dafa tënku, waaye mën naa la may benn kado bu ndaw.", "What is the best price you can give me?": "Ban njëg lu gën a tuuti nga ma mën a jox ?", "Can you wrap it so it does not break in my suitcase?": "Ndax mën nga ko laxas ba du toj ci sama waliis ?", "Is this leather real?": "Ndax der bii dëgg la ?", "I am looking for a gift for my mother": "Maa ngi seet kado ngir sama yaay.", "This cloth is dyed with natural colours": "Ràbb bii dañu ko suub ak kuloor yu natirel.", "Each piece is unique and signed by the artist.": "Benn bu nekk melul ni beneen te artist bi moo ko siñe.", "If you buy three pieces, I can offer a fifteen percent discount.": "Soo jëndee ñetti yëf, mën naa la wàññil fukk ak juróomi pursaŋ.", "I can ship it to Europe and give you a customs invoice.": "Mën naa ko yónnee Tugal te jox la faktir bu duwaan.", "I am sorry, this item is not for export because it is protected wood.": "Baal ma, yëf bii mënul a génn réew mi ndax bant bu ñu aar la.", "Our cooperative supports thirty families in the village.": "Sunu koperatiw dafay dimbali fanweeri njaboot ci dëkk bi.", "Could you make one for me in a different colour? I can wait three days.": "Ndax mën nga ma defal benn ci beneen kuloor ? Mën naa xaar ñetti fan.", "The price is high because it takes two weeks to weave.": "Njëg li dafa seer ndax dafay jël ñaari ayu-bés ngir ràbb ko."};
  C.tour_artisanat.vocab.forEach(function (v) { if (FIX[v.en]) v.wo = FIX[v.en]; });
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.tour_artisanat.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.tour_artisanat.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.tour_artisanat.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.tour_artisanat.vocab.length = 0; tri.forEach(function (t) { C.tour_artisanat.vocab.push(t[0]); });
  D.tour_artisanat = D.tour_artisanat || [];
  var vus = {}; D.tour_artisanat.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.tour_artisanat.push(l); });
})();
