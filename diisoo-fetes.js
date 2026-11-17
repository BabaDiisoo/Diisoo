/* diisoo-fetes.js v1 : theme « Fêtes & événements » (30 phrases, 1 dialogue, 3 questions), niveau N2.
   Wolof relu par Babacar. Desactivable : ?fetes=0 */
(function () {
  "use strict";
  if (window.__diisooFetes || /[?&]fetes=0/.test(location.search)) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooFetes = true;
  var VOC = [
[
"Happy birthday!",
"Joyeux anniversaire !",
"Bésu juddu bu neex !"
],
[
"Happy new year!",
"Bonne année !",
"Dewenati !"
],
[
"Happy Tabaski!",
"Bonne Tabaski !",
"Dewenati !"
],
[
"Happy Korité!",
"Bonne Korité !",
"Korite bu neex !"
],
[
"Congratulations!",
"Félicitations !",
"Ndokkeel !"
],
[
"Thank you for the invitation.",
"Merci pour l'invitation.",
"Jërëjëf ci woote bi."
],
[
"What time does the party start?",
"À quelle heure commence la fête ?",
"Ban waxtu la xew bi di tàmbali ?"
],
[
"Where is the ceremony?",
"Où est la cérémonie ?",
"Fan la xew bi nekk ?"
],
[
"This is a gift for you.",
"Voici un cadeau pour vous.",
"Kado bii ngir yaw la."
],
[
"The food is delicious.",
"La nourriture est délicieuse.",
"Ñam bi neex na lool."
],
[
"We celebrate Tabaski with the whole family.",
"Nous fêtons la Tabaski avec toute la famille.",
"Danuy màggal Tabaski ak njaboot gi yépp."
],
[
"I am buying a sheep for Tabaski.",
"J'achète un mouton pour la Tabaski.",
"Maa ngi jënd xar ngir Tabaski."
],
[
"The sheep is very expensive this year.",
"Le mouton est très cher cette année.",
"Xar mi dafa seer lool at mii."
],
[
"I am going to the Magal in Touba.",
"Je vais au Magal à Touba.",
"Maa ngi dem Magal ci Tuubaa."
],
[
"Many people travel for the Magal.",
"Beaucoup de gens voyagent pour le Magal.",
"Nit ñu bari dañuy tukki ngir Magal."
],
[
"The wedding is on Saturday.",
"Le mariage est samedi.",
"Céet bi mooy gaawu."
],
[
"The baptism of the baby is on Friday.",
"Le baptême du bébé est vendredi.",
"Ngénte li mooy àjjuma."
],
[
"Where can I rent chairs and tents?",
"Où puis-je louer des chaises et des bâches ?",
"Fan laa mën a luwaasee ay siis ak ay baas ?"
],
[
"What should I wear to the ceremony?",
"Que dois-je porter pour la cérémonie ?",
"Lan laa war a sol ci xew bi ?"
],
[
"I will bring a gift for the family.",
"J'apporterai un cadeau pour la famille.",
"Dinaa indi kado ngir njaboot gi."
],
[
"We would be honoured if you could attend our wedding.",
"Nous serions honorés de votre présence à notre mariage.",
"Dinanu bég lool su ngeen ñëwee ci sunu céet."
],
[
"Please confirm your attendance before Friday.",
"Merci de confirmer votre présence avant vendredi.",
"Bu leen neexee, dëggal leen ne dingeen ñëw balaa àjjuma."
],
[
"I would like to hire a caterer for two hundred guests.",
"Je voudrais engager un traiteur pour deux cents invités.",
"Dama bëgg a jël benn toggkat ngir ñaar-téeméeri gan."
],
[
"How much do you charge for the decoration and the sound system?",
"Combien facturez-vous pour la décoration et la sonorisation ?",
"Ñaata ngeen di jël ngir dekorasiyoŋ bi ak sonorisaasiyoŋ bi ?"
],
[
"We are collecting contributions for the ceremony.",
"Nous collectons des cotisations pour la cérémonie.",
"Danuy dajale ndimbal ngir xew bi."
],
[
"I am sorry for your loss. May God give you strength.",
"Mes condoléances. Que Dieu vous donne de la force.",
"Njaal ! Yàlla na la Yàlla jox muñ."
],
[
"I could not attend because I was travelling. Please forgive me.",
"Je n'ai pas pu venir car j'étais en voyage. Pardonnez-moi.",
"Mënuma woon a ñëw ndax maa ngi woon ci tukki. Baal ma."
],
[
"We will take photos and a video of the event.",
"Nous prendrons des photos et une vidéo de l'événement.",
"Dinanu jël ay nataal ak wideo ci xew bi."
],
[
"May God grant us many more years together.",
"Que Dieu nous accorde encore de nombreuses années ensemble.",
"Yàlla na nu Yàlla yokk at yu bari ci ànd."
],
[
"Thank you all for coming. It means a lot to us.",
"Merci à tous d'être venus. Cela compte beaucoup pour nous.",
"Jërëjëf ci yéen ñépp ci seen ñëw. Am na solo lool ci nun."
]
];
  var DIA = [
[
"B",
"Hello. I am looking for a sheep for Tabaski.",
"Bonjour. Je cherche un mouton pour la Tabaski.",
"Jàmm nga fanaan. Maa ngi seet xar ngir Tabaski."
],
[
"A",
"Welcome. I have very good sheep. What is your budget?",
"Bienvenue. J'ai de très beaux moutons. Quel est votre budget ?",
"Dalal ak jàmm. Am naa xar yu baax lool. Ban la sa budse ?"
],
[
"B",
"About one hundred and fifty thousand francs.",
"Environ cent cinquante mille francs.",
"Lu tollu ci téeméeri junni ak juróom-fukki junni farã."
],
[
"A",
"This one is healthy and strong. It costs one hundred and eighty thousand.",
"Celui-ci est en bonne santé et fort. Il coûte cent quatre-vingt mille.",
"Bii dafa wér te am doole. Téeméeri junni ak juróom-ñett-fukki junni la."
],
[
"B",
"It is too expensive. Can you lower the price?",
"C'est trop cher. Vous pouvez baisser le prix ?",
"Dafa seer lool. Ndax mën nga wàññi njëg li ?"
],
[
"A",
"For you, one hundred and sixty thousand, and I help you load it.",
"Pour vous, cent soixante mille, et je vous aide à le charger.",
"Ngir yaw, téeméeri junni ak juróom-benn-fukki junni, te dinaa la dimbali nga yëkkati ko."
],
[
"B",
"Okay. I will take it. Can I pay with Wave?",
"D'accord. Je le prends. Je peux payer avec Wave ?",
"Waaw. Dinaa ko jël. Ndax mën naa fay ak Wave ?"
],
[
"A",
"Yes. Happy Tabaski to you and your family!",
"Oui. Bonne Tabaski à vous et à votre famille !",
"Waaw. Tabaski bu neex ci yaw ak sa njaboot !"
]
];
  var QZ = [
[
"___ birthday!",
[
"Happy",
"Hippy",
"Happily"
],
"« Happy birthday » = joyeux anniversaire."
],
[
"Thank you for the ___.",
[
"invitation",
"invention",
"investigation"
],
"« invitation » = invitation."
],
[
"I am buying a ___ for Tabaski.",
[
"sheep",
"ship",
"sleep"
],
"« sheep » = mouton."
]
];
  if (G.some(function (t) { return t.id === "fetes"; })) return;
  G.push({
    id: "fetes", niveau: 2, title: "N2 · 🐑 Fêtes & événements",
    vocab: VOC.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }),
    dialogue: DIA.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }),
    quiz: QZ.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; })
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();
