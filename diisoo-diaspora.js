/* diisoo-diaspora.js v1 : theme « Appeler la diaspora » (30 phrases, 1 dialogue, 3 questions), niveau N2.
   Wolof relu par Babacar. Desactivable : ?diaspora=0 */
(function () {
  "use strict";
  if (window.__diisooDiaspora || /[?&]diaspora=0/.test(location.search)) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooDiaspora = true;
  var VOC = [
[
"Hello, how are you?",
"Bonjour, comment vas-tu ?",
"Na nga def, naka nga fanaanee ?"
],
[
"I am fine, thank God.",
"Je vais bien, grâce à Dieu.",
"Maa ngi fi, alxamdulilaay."
],
[
"How is the family?",
"Comment va la famille ?",
"Naka la njaboot gi def ?"
],
[
"I miss you.",
"Tu me manques.",
"Dama la nammoon."
],
[
"Can you hear me?",
"Tu m'entends ?",
"Ndax dégg nga ma ?"
],
[
"The network is bad.",
"Le réseau est mauvais.",
"Reeso bi baaxul."
],
[
"I will call you tomorrow.",
"Je t'appelle demain.",
"Dinaa la woo suba."
],
[
"Send me a photo, please.",
"Envoie-moi une photo, s'il te plaît.",
"Yónneel ma benn nataal, bu la neexee."
],
[
"How is the weather there?",
"Quel temps fait-il là-bas ?",
"Naka la jawu ji mel foofu ?"
],
[
"Take care of yourself.",
"Prends soin de toi.",
"Sàmmal sa bopp."
],
[
"Can we do a video call tonight?",
"On peut faire un appel vidéo ce soir ?",
"Ndax mën nanu def woote wideo tey ci guddi ?"
],
[
"What time is it there?",
"Quelle heure est-il là-bas ?",
"Ban waxtu la fa nekk ?"
],
[
"There is a time difference of two hours.",
"Il y a deux heures de décalage horaire.",
"Am na wuute waxtu bu tollu ci ñaari waxtu."
],
[
"How are mum and dad?",
"Comment vont maman et papa ?",
"Naka la yaay ak baay def ?"
],
[
"I am sending you some money for the family.",
"Je t'envoie de l'argent pour la famille.",
"Maa ngi lay yónnee xaalis ngir njaboot gi."
],
[
"Did you receive the money?",
"Tu as reçu l'argent ?",
"Ndax jot nga xaalis bi ?"
],
[
"When are you coming back home?",
"Quand rentres-tu à la maison ?",
"Kañ ngay dellusi kër ?"
],
[
"I am thinking of visiting in December.",
"Je pense venir en décembre.",
"Maa ngi xalaat a ñëw ci desàmbar."
],
[
"What do you want me to bring from here?",
"Qu'est-ce que tu veux que j'apporte d'ici ?",
"Lan nga bëgg ma indil la ?"
],
[
"The children are growing fast.",
"Les enfants grandissent vite.",
"Xale yi dañuy màgg bu baax."
],
[
"It is difficult to be far from the family, but I am working hard.",
"C'est difficile d'être loin de la famille, mais je travaille dur.",
"Jafe na ma lool sori njaboot gi, waaye maa ngi liggéey ak doole."
],
[
"I am sending a parcel with a friend who is travelling.",
"J'envoie un colis avec un ami qui voyage.",
"Maa ngi yónnee benn koli ci sama xarit biy tukki."
],
[
"The parcel contains clothes and some medicine.",
"Le colis contient des vêtements et des médicaments.",
"Koli bi am na ay yéere ak ay garab."
],
[
"Please pay the customs fee when you collect it.",
"Payez les frais de douane quand vous le récupérez.",
"Fayal fere duwaan bi bu ngeen ko jëlee."
],
[
"I would like to organise a family reunion this summer.",
"Je voudrais organiser des retrouvailles familiales cet été.",
"Dama bëgg a waajal benn ndajem njaboot ci jamonoy tàkk."
],
[
"I am saving money to build a house back home.",
"J'économise pour construire une maison au pays.",
"Maa ngi denc xaalis ngir tabax kër ci réew mi."
],
[
"I want to invest in a small business in Senegal.",
"Je veux investir dans un petit commerce au Sénégal.",
"Dama bëgg a dugal xaalis ci benn njaay mu ndaw ci Senegaal."
],
[
"Please send me the documents by WhatsApp, I need them for my visa.",
"Envoie-moi les documents par WhatsApp, j'en ai besoin pour mon visa.",
"Yónneel ma kayit yi ci WhatsApp, dama leen soxla ngir sama wisa."
],
[
"Please pray for me. I will do the same for you.",
"Prie pour moi. Je ferai de même pour toi.",
"Ñaanal ma. Dinaa la ñaanal itam."
],
[
"God willing, we will meet again soon.",
"Si Dieu le veut, nous nous reverrons bientôt.",
"Yàlla na nu gisaat ci lu gaaw."
]
];
  var DIA = [
[
"B",
"Hello mum, it is me. How are you?",
"Allô maman, c'est moi. Comment vas-tu ?",
"Alo yaay, man la. Naka nga fanaanee ?"
],
[
"A",
"My son! I am fine, thank God. How is your work?",
"Mon fils ! Je vais bien, grâce à Dieu. Comment va ton travail ?",
"Sama doom ! Maa ngi fi, sant Yàlla. Naka sa liggéey ?"
],
[
"B",
"It is going well. I am working hard. Is everyone well at home?",
"Ça va bien. Je travaille dur. Tout le monde va bien à la maison ?",
"Mu ngi dox bu baax. Maa ngi liggéey ak doole. Ndax ñépp ñu ngi ci jàmm ci kër ga ?"
],
[
"A",
"Yes, everyone is fine. Your sister asks about you.",
"Oui, tout le monde va bien. Ta sœur demande de tes nouvelles.",
"Waaw, ñépp ñu ngi ci jàmm. Sa rakk bu jigéen mu ngi laaj sa xibaar."
],
[
"B",
"I sent you some money this morning. Did you receive it?",
"Je t'ai envoyé de l'argent ce matin. Tu l'as reçu ?",
"Yónnee naa la xaalis ci suba. Ndax jot nga ko ?"
],
[
"A",
"Yes, I received it. Thank you, may God bless you.",
"Oui, je l'ai reçu. Merci, que Dieu te bénisse.",
"Waaw, jot naa ko. Jërëjëf, Yàlla na la Yàlla barkeel."
],
[
"B",
"I am planning to come home in December.",
"Je prévois de rentrer en décembre.",
"Maa ngi yëgle ne dinaa dellusi ci desàmbar."
],
[
"A",
"That is wonderful news. We will wait for you.",
"Quelle bonne nouvelle. Nous t'attendrons.",
"Xibaar bu rafet la. Dinanu la xaar."
]
];
  var QZ = [
[
"I ___ you.",
[
"miss",
"mess",
"mist"
],
"« I miss you » = tu me manques."
],
[
"Can you ___ me?",
[
"hear",
"here",
"heart"
],
"« hear » = entendre."
],
[
"I am sending ___ money for the family.",
[
"some",
"a",
"much of"
],
"« some money » = de l'argent."
]
];
  if (G.some(function (t) { return t.id === "diaspora"; })) return;
  G.push({
    id: "diaspora", niveau: 2, title: "N2 · 📞 Appeler la diaspora",
    vocab: VOC.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }),
    dialogue: DIA.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }),
    quiz: QZ.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; })
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();
