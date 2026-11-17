/* diisoo-tour_plage-plus.js v1 : Business, Plage (mode et beauté) enrichi
   Wolof des phrases existantes complété, +15 phrases, 1 dialogue. Wolof relu par Babacar.
   Desactivable : ?tour_plage=0 */
(function () {
  "use strict";
  if (window.__diisooPlagePlus || /[?&]tour_plage=0/.test(location.search)) return;
  var C, D;
  try { C = CHINA_TRADE_WOLOF; D = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !C.tour_plage) return;
  window.__diisooPlagePlus = true;
  var V = [
{
"niveau": "debutant",
"en": "Where can I change?",
"fr": "Où puis-je me changer ?",
"wo": "Fan laa mën a soppee samay yéere ?"
},
{
"niveau": "debutant",
"en": "A bottle of cold water, please.",
"fr": "Une bouteille d'eau fraîche, s'il vous plaît.",
"wo": "Benn butéelu ndox mu sedd, bu la neexee."
},
{
"niveau": "debutant",
"en": "How much is the sunbed?",
"fr": "Combien coûte le transat ?",
"wo": "Ñaata la lal bu jant bi ?"
},
{
"niveau": "debutant",
"en": "Is there a shower?",
"fr": "Il y a une douche ?",
"wo": "Ndax am na duus ?"
},
{
"niveau": "debutant",
"en": "Do not go too far.",
"fr": "N'allez pas trop loin.",
"wo": "Bul dem ba sori lool."
},
{
"niveau": "intermediaire",
"en": "The tide is coming in. Move your things.",
"fr": "La marée monte. Déplacez vos affaires.",
"wo": "Géej gi dafay fees. Toxalal say yëf."
},
{
"niveau": "intermediaire",
"en": "Can I leave my bag with you while I swim?",
"fr": "Je peux laisser mon sac avec vous pendant que je nage ?",
"wo": "Ndax mën naa bàyyi sama saaku ci yaw ba ma di féey ?"
},
{
"niveau": "intermediaire",
"en": "We offer a fishing trip with local fishermen.",
"fr": "Nous proposons une sortie de pêche avec des pêcheurs locaux.",
"wo": "Dañuy joxe benn tukki napp ak nappkat yu dëkk fii."
},
{
"niveau": "intermediaire",
"en": "The red flag means that swimming is forbidden.",
"fr": "Le drapeau rouge signifie que la baignade est interdite.",
"wo": "Drapo bu xonq bi dafay wax ne féey araam na."
},
{
"niveau": "intermediaire",
"en": "Put on sun cream, the sun is strong.",
"fr": "Mettez de la crème solaire, le soleil est fort.",
"wo": "Diwal keremu jant, jant bi dafa tàng lool."
},
{
"niveau": "avance",
"en": "I would like to organise a birthday party on the beach for twenty people.",
"fr": "Je voudrais organiser une fête d'anniversaire sur la plage pour vingt personnes.",
"wo": "Dama bëgg a wàajal benn màggalu bésu juddu ci tefes bi ngir ñaar-fukki nit."
},
{
"niveau": "avance",
"en": "Is it possible to camp on the beach for one night?",
"fr": "Il est possible de camper sur la plage pour une nuit ?",
"wo": "Ndax mën nanu def kamp ci tefes bi ngir benn guddi ?"
},
{
"niveau": "avance",
"en": "There is a jellyfish. Where is the first aid post?",
"fr": "Il y a une méduse. Où est le poste de premiers secours ?",
"wo": "Am na meduuz. Fan la berebu ndimbal bu njëkk bi nekk ?"
},
{
"niveau": "avance",
"en": "Can you take a group photo of us at sunset?",
"fr": "Vous pouvez nous prendre en photo de groupe au coucher du soleil ?",
"wo": "Ndax mën nga nu jël nataalu mbooloo ci jant bi di so ?"
},
{
"niveau": "avance",
"en": "Do you offer a discount for a group of fifteen people?",
"fr": "Vous faites une remise pour un groupe de quinze personnes ?",
"wo": "Ndax dangeen di wàññi njëg ngir mbooloo mu fukk ak juróomi nit ?"
}
];
  var L = [
{
"role": "touriste",
"en": "Hello. Is it safe to take a boat trip today?",
"fr": "Bonjour. C'est sûr de faire une sortie en bateau aujourd'hui ?",
"wo": "Jàmm nga fanaan. Ndax am na kaaraange ngir dem ci tukki gaal tey ?",
"scene": "🏖️ Réserver une sortie en pirogue"
},
{
"role": "pecheur",
"en": "Yes, the sea is calm. We leave at four o'clock.",
"fr": "Oui, la mer est calme. Nous partons à seize heures.",
"wo": "Waaw, géej gi dal na. Danuy dem ci ñeenti waxtu."
},
{
"role": "touriste",
"en": "How long is the trip and how much is it?",
"fr": "Combien de temps dure la sortie et combien ça coûte ?",
"wo": "Ñaata waxtu la tukki bi di yàgg te ñaata la ?"
},
{
"role": "pecheur",
"en": "Two hours, five thousand francs per person. Life jackets are free.",
"fr": "Deux heures, cinq mille francs par personne. Les gilets sont gratuits.",
"wo": "Ñaari waxtu, juróomi junni farã ku nekk. Yérey mucc ci ndox yi amuñu fay."
},
{
"role": "touriste",
"en": "We are four people. Can we have a discount?",
"fr": "Nous sommes quatre. On peut avoir une remise ?",
"wo": "Nun ñeent lanu. Ndax mën nanu am wàññi njëg ?"
},
{
"role": "pecheur",
"en": "For four people, eighteen thousand in total.",
"fr": "Pour quatre personnes, dix-huit mille au total.",
"wo": "Ngir ñeenti nit, fukk ak juróom-ñetti junni lépp."
},
{
"role": "touriste",
"en": "Perfect. Can we see dolphins?",
"fr": "Parfait. On peut voir des dauphins ?",
"wo": "Baax na lool. Ndax mën nanu gis ay dofin ?"
},
{
"role": "pecheur",
"en": "Maybe, if we are lucky. Please be at the beach at four.",
"fr": "Peut-être, avec un peu de chance. Soyez à la plage à seize heures.",
"wo": "Xanaa, su nu amee wërsëg. Ñëwal ci tefes bi ci ñeenti waxtu, bu la neexee."
}
];
  var FIX = {"Is it safe to swim here?": "Ndax am na kaaraange ngir féey fii ?", "Do you want a parasol?": "Ndax bëgg nga parasol ?", "The water is warm": "Ndox mi dafa tàng.", "Do not leave your bag alone": "Bul bàyyi sa saaku moom rekk.", "Do you want to go on a boat trip?": "Ndax bëgg nga dem ci tukki gaal ?", "The sunset is wonderful": "Jant bi di so rafet na lool.", "Surf lessons start at ten in the morning": "Njàggalem surf bi dafay tàmbali ci fukki waxtu ci suba.", "The fishermen come back at five in the afternoon": "Nappkat yi dañuy dellusi ci juróomi waxtu ci ngoon.", "Beware of strong currents, swim between the flags": "Moytul wal mu dëgër mi, féeyal ci diggante drapo yi.", "I want to rent a kayak for two hours": "Dama bëgg a luwaas benn kayak ngir ñaari waxtu.", "The boat trip to the mangroves takes ninety minutes": "Tukki gaal bi ba ci mangrov yi dafay jël juróom-ñeent-fukki simili.", "Life jackets are provided for everyone": "Yérey mucc ci ndox yi am nañu ngir ñépp.", "Fresh grilled fish is served on the beach at noon": "Jën wu bees wu ñu lakk dañu koy joxe ci tefes bi ci digg-bëccëg.", "Our resort offers a full-board package with water sports and an evening show.": "Sunu otel dafay joxe pak bu mat sëkk ak lekk, ay po ci ndox ak benn poñ ci ngoon.", "The sea is rough today, so the boat trip is postponed until tomorrow.": "Géej gi dafa xul tey, kon tukki gaal bi dañu ko randal ba suba.", "Children under twelve must be accompanied by an adult.": "Xale yi amagul fukki at ak ñaar war nañu ànd ak mag.", "We can organise a beach wedding for eighty guests.": "Mën nanu wàajal céet ci tefes bi ngir juróom-ñett-fukki gan.", "Please respect the turtle nests and do not leave plastic on the beach.": "Wormaalal tëggu mbonaat yi te bul bàyyi plastik ci tefes bi.", "The price of the sunset cruise includes drinks and snacks.": "Njëgu tukki gaal bi ci jant bi di so dafay boole naan ak lekk yu ndaw.", "I would like to book a private boat for my family for the whole day.": "Bëgg naa reserwe gaal bu ma moom samab bopp ngir sama njaboot ci bés bi yépp."};
  C.tour_plage.vocab.forEach(function (v) { if (FIX[v.en]) v.wo = FIX[v.en]; });
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };
  var deja = {}; C.tour_plage.vocab.forEach(function (v) { deja[v.en] = 1; });
  V.forEach(function (v) { if (!deja[v.en]) { C.tour_plage.vocab.push(v); deja[v.en] = 1; } });
  var tri = C.tour_plage.vocab.map(function (v, i) { return [v, i]; });
  tri.sort(function (a, b) { var x = ORDRE[a[0].niveau], y = ORDRE[b[0].niveau]; return (x === y ? a[1] - b[1] : x - y); });
  C.tour_plage.vocab.length = 0; tri.forEach(function (t) { C.tour_plage.vocab.push(t[0]); });
  D.tour_plage = D.tour_plage || [];
  var vus = {}; D.tour_plage.forEach(function (l) { vus[l.en] = 1; });
  L.forEach(function (l) { if (!vus[l.en]) D.tour_plage.push(l); });
})();
