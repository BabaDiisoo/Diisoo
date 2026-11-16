/* diisoo-tour_guide-plus.js v1 : Business, Guide (mode et beauté) enrichi
   Wolof des phrases existantes complété, +15 phrases, 1 dialogue. Wolof relu par Babacar.
   Desactivable : ?tour_guide=0 */
(function () {
  "use strict";
  if (window.__diisooGuidePlus || /[?&]tour_guide=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.tour_guide) return;
  window.__diisooGuidePlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Good morning. Are you ready?",
"fr": "Bonjour. Vous êtes prêts ?",
"wo": "Jàmm ngeen fanaan. Ndax pare ngeen ?"
},
{
"niveau": "debutant",
"en": "Where are you from?",
"fr": "Vous venez d'où ?",
"wo": "Fan ngeen jóge ?"
},
{
"niveau": "debutant",
"en": "Stay together, please.",
"fr": "Restez ensemble, s'il vous plaît.",
"wo": "Àndleen benn, bu leen neexee."
},
{
"niveau": "debutant",
"en": "Do you need a toilet?",
"fr": "Vous avez besoin des toilettes ?",
"wo": "Ndax soxla ngeen wànaag ?"
},
{
"niveau": "debutant",
"en": "This way, please.",
"fr": "Par ici, s'il vous plaît.",
"wo": "Fii la, bu la neexee."
},
{
"niveau": "intermediaire",
"en": "The museum opens at nine.",
"fr": "Le musée ouvre à neuf heures.",
"wo": "Musée bi dafay ubbi ci juróom-ñeenti waxtu."
},
{
"niveau": "intermediaire",
"en": "You can buy tickets at the entrance.",
"fr": "Vous pouvez acheter les billets à l'entrée.",
"wo": "Mën ngeen jënd tike yi ci bunt bi."
},
{
"niveau": "intermediaire",
"en": "We will have lunch after the visit.",
"fr": "Nous déjeunerons après la visite.",
"wo": "Dinanu añ gannaaw seeti bi."
},
{
"niveau": "intermediaire",
"en": "This tree is more than five hundred years old.",
"fr": "Cet arbre a plus de cinq cents ans.",
"wo": "Garab gii màgg na ba weesu juróom-téeméeri at."
},
{
"niveau": "intermediaire",
"en": "Please do not touch the objects.",
"fr": "Merci de ne pas toucher les objets.",
"wo": "Buleen laal yëf yi, bu leen neexee."
},
{
"niveau": "avance",
"en": "This village is known for its traditional fishing.",
"fr": "Ce village est connu pour sa pêche traditionnelle.",
"wo": "Dëkk bii xam nañu ko ci nàpp gu aada."
},
{
"niveau": "avance",
"en": "I will tell you the story of the island.",
"fr": "Je vais vous raconter l'histoire de l'île.",
"wo": "Dinaa leen nettali taariixu dunu bi."
},
{
"niveau": "avance",
"en": "If it rains, we will visit the museum instead.",
"fr": "S'il pleut, nous visiterons le musée à la place.",
"wo": "Su tawee, dinanu seeti musée bi ci palaas bi."
},
{
"niveau": "avance",
"en": "Would you like to meet a local family?",
"fr": "Voulez-vous rencontrer une famille locale ?",
"wo": "Ndax bëgg ngeen gis benn njaboot gu dëkk fii ?"
},
{
"niveau": "avance",
"en": "The bus will pick you up at the hotel at eight.",
"fr": "Le bus passera vous prendre à l'hôtel à huit heures.",
"wo": "Kaar bi dina ñëw jël leen ci otel bi ci juróom-ñetti waxtu."
}
];
  var L = [
{
"role": "guide",
"en": "Welcome to Gorée Island. Please stay together.",
"fr": "Bienvenue sur l'île de Gorée. Restez ensemble, s'il vous plaît.",
"wo": "Dalal ak jàmm ci dunu Gorée. Àndleen benn, bu leen neexee.",
"scene": "🧭 Visite de Gorée"
},
{
"role": "touriste",
"en": "Thank you. What is the history of this island?",
"fr": "Merci. Quelle est l'histoire de cette île ?",
"wo": "Jërëjëf. Lan mooy taariixu dunu bii ?"
},
{
"role": "guide",
"en": "For many years, it was a place where people were sent as slaves.",
"fr": "Pendant de nombreuses années, c'était un lieu d'où l'on envoyait des gens comme esclaves.",
"wo": "Ci at yu bari, fii lañu daan yóbbu nit ñi ñu def leen jaam."
},
{
"role": "touriste",
"en": "That is very sad. Can we visit the House of Slaves?",
"fr": "C'est très triste. Nous pouvons visiter la Maison des Esclaves ?",
"wo": "Dafa naqari lool. Ndax mën nanu seeti Maison des Esclaves ?"
},
{
"role": "guide",
"en": "Yes, it is on the left. The entrance is two thousand francs.",
"fr": "Oui, elle est à gauche. L'entrée coûte deux mille francs.",
"wo": "Waaw, ci càmmoñ la nekk. Dugg bi ñaari junni farã la."
},
{
"role": "touriste",
"en": "Can I take photos inside?",
"fr": "Je peux prendre des photos à l'intérieur ?",
"wo": "Ndax mën naa jël nataal ci biir ?"
},
{
"role": "guide",
"en": "Yes, but please be respectful.",
"fr": "Oui, mais soyez respectueux, s'il vous plaît.",
"wo": "Waaw, waaye wormaal fi, bu la neexee."
},
{
"role": "touriste",
"en": "Of course. Thank you for the explanation.",
"fr": "Bien sûr. Merci pour l'explication.",
"wo": "Waaw kay. Jërëjëf ci leeral bi."
}
];
  var FIX = {"Be careful, the road is slippery": "Moytul, yoon wi dafa tarax.", "Do you want to take a photo?": "Ndax bëgg nga jël nataal ?", "We will stop here for ten minutes": "Dinanu taxaw fii fukki simili.", "The boat leaves at nine from the Dakar pier": "Gaal gi dafay dem ci juróom-ñeenti waxtu ci waaxu Ndakaaru.", "The visit lasts about three hours": "Seeti bi dafay jël lu tollook ñetti waxtu.", "The House of Slaves is an important memorial": "Kër gi ñuy wax Maison des Esclaves am na solo lool ci taariix bi.", "At Lake Retba the water is pink because of the algae": "Ci Lac Rose, ndox mi dafa xonq ndax alg yi.", "Please wear a hat and sun cream": "Solal mbaxana te diw kerem ngir jant bi, bu la neexee.", "The entrance fee is not included": "Njëg li ñuy fay ngir dugg bokkul ci.", "Do you want to see the baobab trees or the birds?": "Ndax bëgg nga gis guy yi walla picc yi ?", "Our two-day tour includes the Saloum Delta, a night in a lodge and all meals.": "Sunu tukki bu ñaari fan bi dafay boole Saalum, benn guddi ci lotel ak lekk yépp.", "The price is per person, based on a minimum of four travellers.": "Njëg li ci nit ku nekk la, te dafa laaj ñeenti nit ba ci kaw.", "Due to the weather, we have to change the programme. I apologise.": "Ndax jaww ji, war nanu soppi porogaraam bi. Baal ma.", "Please keep your valuables with you and respect local customs.": "Dencal sa yëf yu am solo ci yaw, te wormaal aaday réew mi.", "May I ask your permission before taking photos of people?": "Ndax mën naa la ñaan ndigal balaa may jël nataali nit ñi ?", "We can adapt the tour for families with young children.": "Mën nanu soppi tukki bi ngir njaboot yu am xale yu ndaw.", "Cancellations made less than forty-eight hours before are not refunded.": "Anile bi ñuy def lu yées ñeent-fukk ak juróom-ñetti waxtu balaa agsi bi, amul fay."};
  C.tour_guide.vocab.forEach(function (v) { if (FIX[v.en]) v.wo = FIX[v.en]; });
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.tour_guide.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.tour_guide.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.tour_guide.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.tour_guide.vocab.length = 0; tri.forEach(function (t) { C.tour_guide.vocab.push(t[0]); });
  D.tour_guide = D.tour_guide || [];
  var vus = {}; D.tour_guide.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.tour_guide.push(l); });
})();
