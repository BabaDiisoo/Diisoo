/* diisoo-etudes.js v1 : theme « Études & école » (30 phrases, 1 dialogue, 3 questions), niveau N2.
   Wolof relu par Babacar. Desactivable : ?etudes=0 */
(function () {
  "use strict";
  if (window.__diisooEtudes || /[?&]etudes=0/.test(location.search)) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooEtudes = true;
  var VOC = [
[
"I am a student.",
"Je suis étudiant.",
"Ndongo laa."
],
[
"What is your school?",
"Quelle est votre école ?",
"Ban la sa daara ?"
],
[
"I study at the university.",
"J'étudie à l'université.",
"Maa ngi jàng ci iniwersite bi."
],
[
"What time does the class start?",
"À quelle heure commence le cours ?",
"Ban waxtu la kuur bi di tàmbali ?"
],
[
"Where is the classroom?",
"Où est la salle de classe ?",
"Fan la néegu njàng bi nekk ?"
],
[
"I do not understand.",
"Je ne comprends pas.",
"Dégguma ko."
],
[
"Can you repeat, please?",
"Vous pouvez répéter, s'il vous plaît ?",
"Ndax mën nga ko waxaat, bu la neexee ?"
],
[
"I need a notebook and a pen.",
"Il me faut un cahier et un stylo.",
"Dama soxla kaye ak bik."
],
[
"The teacher is very good.",
"Le professeur est très bon.",
"Jàngalekat bi baax na lool."
],
[
"I have homework today.",
"J'ai des devoirs aujourd'hui.",
"Am naa liggéeyu kër tey."
],
[
"When is the exam?",
"Quand est l'examen ?",
"Kañ la ekzaameŋ bi ?"
],
[
"I am preparing for the exam.",
"Je prépare l'examen.",
"Maa ngi waajal ekzaameŋ bi."
],
[
"I passed the exam.",
"J'ai réussi l'examen.",
"Jàll naa ekzaameŋ bi."
],
[
"I failed the exam. I will try again.",
"J'ai échoué à l'examen. Je vais réessayer.",
"Daanoo naa ci ekzaameŋ bi. Dinaa ko jéemaat."
],
[
"What are my marks?",
"Quelles sont mes notes ?",
"Yan not laa am ?"
],
[
"Can I borrow your notes?",
"Je peux emprunter vos notes ?",
"Ndax mën naa ab say not ?"
],
[
"We have a group project.",
"Nous avons un projet de groupe.",
"Am nanu benn porose bu mbooloo."
],
[
"I want to register for the next year.",
"Je veux m'inscrire pour l'année prochaine.",
"Dama bëgg a bindu ngir at mi di ñëw."
],
[
"How much are the school fees?",
"Combien sont les frais de scolarité ?",
"Ñaata la fere daara bi ?"
],
[
"Can I pay the fees in two instalments?",
"Je peux payer les frais en deux fois ?",
"Ndax mën naa fay fere bi ci ñaari yoon ?"
],
[
"I would like to apply for a scholarship.",
"Je voudrais demander une bourse d'études.",
"Dama bëgg a laaj benn bursu njàng."
],
[
"Which documents are required for the application?",
"Quels documents sont requis pour la candidature ?",
"Yan kayit lañu laaj ngir laaj bi ?"
],
[
"I need a recommendation letter from my teacher.",
"Il me faut une lettre de recommandation de mon professeur.",
"Dama soxla benn bataaxalu seede bu jóge ci sama jàngalekat."
],
[
"The deadline for applications is the thirty-first of December.",
"La date limite des candidatures est le trente et un décembre.",
"Bés bu mujj bi ngir laaj yi mooy fanweer ak benn ci desàmbar."
],
[
"I want to study abroad. What is the process?",
"Je veux étudier à l'étranger. Quelle est la démarche ?",
"Dama bëgg a jàng ci biti réew. Nan lañu ciy doxee ?"
],
[
"I need a language test result, like IELTS, for my application.",
"Il me faut un résultat de test de langue, comme l'IELTS, pour ma candidature.",
"Dama soxla njëlu testu làkk, mel ni IELTS, ngir sama laaj bi."
],
[
"I am writing my thesis on agriculture.",
"J'écris mon mémoire sur l'agriculture.",
"Maa ngi bind sama memwaar ci wàllu mbay."
],
[
"Can I follow the course online?",
"Je peux suivre le cours en ligne ?",
"Ndax mën naa topp kuur bi ci internet ?"
],
[
"I did not receive my grades. Can you check the system?",
"Je n'ai pas reçu mes notes. Vous pouvez vérifier le système ?",
"Jotuma samay not. Ndax mën nga xool sistem bi ?"
],
[
"I would like to change my course because it does not suit me.",
"Je voudrais changer de filière car elle ne me convient pas.",
"Dama bëgg a soppi sama filyeer ndax dëppoowul ak man."
]
];
  var DIA = [
[
"B",
"Good morning. I would like to register for the first year.",
"Bonjour. Je voudrais m'inscrire en première année.",
"Jàmm nga fanaan. Dama bëgg a bindu ci at mu njëkk mi."
],
[
"A",
"Of course. Which course do you want to study?",
"Bien sûr. Quelle filière voulez-vous suivre ?",
"Waaw kay. Ban filyeer nga bëgg a jàng ?"
],
[
"B",
"Computer science. What documents do I need?",
"L'informatique. De quels documents ai-je besoin ?",
"Informatik. Yan kayit laa soxla ?"
],
[
"A",
"Your baccalaureate certificate, your birth certificate and two photos.",
"Votre diplôme du baccalauréat, votre extrait de naissance et deux photos.",
"Sa diplomu bak, sa ekstere de nesaas ak ñaari nataal."
],
[
"B",
"How much are the school fees?",
"Combien sont les frais de scolarité ?",
"Ñaata la fere daara bi ?"
],
[
"A",
"Two hundred thousand francs per year. You can pay in two instalments.",
"Deux cent mille francs par an. Vous pouvez payer en deux fois.",
"Ñaar-téeméeri junni farã ci at mu nekk. Mën nga fay ci ñaari yoon."
],
[
"B",
"When do the classes start?",
"Quand commencent les cours ?",
"Kañ la kuur yi di tàmbali ?"
],
[
"A",
"On the first of October. Please come with your documents.",
"Le premier octobre. Venez avec vos documents, s'il vous plaît.",
"Ci benn oktoobar. Ñëwal ak say kayit, bu la neexee."
]
];
  var QZ = [
[
"I am a ___ at the university.",
[
"student",
"studio",
"study"
],
"« student » = étudiant."
],
[
"When is the ___?",
[
"exam",
"example",
"exact"
],
"« exam » = examen."
],
[
"I want to apply for a ___.",
[
"scholarship",
"school ship",
"scholar"
],
"« scholarship » = bourse d'études."
]
];
  if (G.some(function (t) { return t.id === "school"; })) return;
  G.push({
    id: "school", niveau: 2, title: "N2 · 🎓 Études & école",
    vocab: VOC.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }),
    dialogue: DIA.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }),
    quiz: QZ.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; })
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();
