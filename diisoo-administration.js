/* diisoo-administration.js v1 : theme « Administration » (30 phrases, 1 dialogue, 3 questions), niveau N2.
   Wolof relu par Babacar. Desactivable : ?administration=0 */
(function () {
  "use strict";
  if (window.__diisooAdministration || /[?&]administration=0/.test(location.search)) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooAdministration = true;
  var VOC = [
[
"Where is the town hall?",
"Où est la mairie ?",
"Fan la meri bi nekk ?"
],
[
"I need an identity card.",
"Il me faut une carte d'identité.",
"Dama soxla kart didantite."
],
[
"I want to make a passport.",
"Je veux faire un passeport.",
"Dama bëgg a defar paspoor."
],
[
"What time do you open?",
"À quelle heure ouvrez-vous ?",
"Ban waxtu ngeen di ubbi ?"
],
[
"What time do you close?",
"À quelle heure fermez-vous ?",
"Ban waxtu ngeen di tëj ?"
],
[
"Where do I wait?",
"Où dois-je attendre ?",
"Fan laa war a xaar ?"
],
[
"Which window is it?",
"C'est quel guichet ?",
"Ban gise la ?"
],
[
"I have an appointment.",
"J'ai un rendez-vous.",
"Am naa benn ràndewu."
],
[
"Here are my documents.",
"Voici mes documents.",
"Samay kayit ñii ngi nii."
],
[
"Please, I am in a hurry.",
"S'il vous plaît, je suis pressé.",
"Bu la neexee, dama yàkkamti."
],
[
"Which documents do I need to bring?",
"Quels documents dois-je apporter ?",
"Yan kayit laa war a indi ?"
],
[
"I need a copy of my birth certificate.",
"Il me faut une copie de mon extrait de naissance.",
"Dama soxla benn koppi sama ekstere de nesaas."
],
[
"How much does it cost?",
"Combien ça coûte ?",
"Ñaata lay jar ?"
],
[
"How long does it take?",
"Combien de temps ça prend ?",
"Ñaata dir lay jël ?"
],
[
"When can I come back to collect it?",
"Quand puis-je revenir le récupérer ?",
"Kañ laa mën a dellusi ngir jël ko ?"
],
[
"Is my file complete?",
"Mon dossier est-il complet ?",
"Ndax sama dosiye bi mat na ?"
],
[
"A document is missing.",
"Il manque un document.",
"Am na benn kayit bu ñàkk."
],
[
"I need a photo for the file.",
"Il faut une photo pour le dossier.",
"Dafa laaj benn nataal ngir dosiye bi."
],
[
"Please fill in this form.",
"Remplissez ce formulaire, s'il vous plaît.",
"Feesalal fiis bii, bu la neexee."
],
[
"Where can I make photocopies?",
"Où puis-je faire des photocopies ?",
"Fan laa mën a defaree fotokoppi ?"
],
[
"I lost my identity card. How can I get a new one?",
"J'ai perdu ma carte d'identité. Comment en obtenir une nouvelle ?",
"Rëcc naa sama kart didantite. Naka laa mën a amee beneen ?"
],
[
"I need a police report for the declaration of loss.",
"Il me faut un récépissé de déclaration de perte.",
"Dama soxla benn resipise ngir seedeel ne rëcc naa ko."
],
[
"My passport expires in three months. Can I renew it?",
"Mon passeport expire dans trois mois. Je peux le renouveler ?",
"Sama paspoor dina jeex ci ñetti weer. Ndax mën naa ko yeesal ?"
],
[
"There is a mistake in the spelling of my name.",
"Il y a une erreur dans l'orthographe de mon nom.",
"Am na njuumte ci mbindum sama tur."
],
[
"I would like to register my business.",
"Je voudrais enregistrer mon entreprise.",
"Dama bëgg a bindloo sama liggéeyukaay."
],
[
"I need a certificate of residence for my visa file.",
"Il me faut un certificat de résidence pour mon dossier de visa.",
"Dama soxla sertifikaa de residãas ngir sama dosiye wisa."
],
[
"Can someone else collect the document for me?",
"Quelqu'un d'autre peut récupérer le document pour moi ?",
"Ndax keneen mën na ma jëlal kayit bi ?"
],
[
"I would like to make a complaint about the delay.",
"Je voudrais faire une réclamation à propos du retard.",
"Dama bëgg a joxe benn laaj-ubbi ci yeex bi."
],
[
"Please give me a stamped receipt as proof.",
"Donnez-moi un reçu tamponné comme preuve.",
"Jox ma benn resi bu ñu tàmpoŋe ngir seede."
],
[
"I will come back tomorrow with the missing document.",
"Je reviens demain avec le document manquant.",
"Dinaa dellusi suba ak kayit bi ñàkk."
]
];
  var DIA = [
[
"B",
"Good morning. I would like to make an identity card.",
"Bonjour. Je voudrais faire une carte d'identité.",
"Jàmm nga fanaan. Dama bëgg a defar kart didantite."
],
[
"A",
"Do you have your birth certificate?",
"Vous avez votre extrait de naissance ?",
"Ndax am nga sa ekstere de nesaas ?"
],
[
"B",
"Yes, here it is. I also have two photos.",
"Oui, le voici. J'ai aussi deux photos.",
"Waaw, mii ngi nii. Am naa itam ñaari nataal."
],
[
"A",
"Good. Please fill in this form.",
"Bien. Remplissez ce formulaire, s'il vous plaît.",
"Baax na. Feesalal fiis bii, bu la neexee."
],
[
"B",
"Here it is. How much does it cost?",
"Le voici. Combien ça coûte ?",
"Mii ngi nii. Ñaata lay jar ?"
],
[
"A",
"It is ten thousand francs. You will get a receipt.",
"C'est dix mille francs. Vous aurez un reçu.",
"Fukki junni farã la. Dinga am benn resi."
],
[
"B",
"When can I collect the card?",
"Quand puis-je récupérer la carte ?",
"Kañ laa mën a jël kart bi ?"
],
[
"A",
"Come back in three weeks with this receipt.",
"Revenez dans trois semaines avec ce reçu.",
"Dellusil ci ñetti ayu-bés ak resi bii."
]
];
  var QZ = [
[
"I need an identity ___.",
[
"card",
"cart",
"car"
],
"« identity card » = carte d'identité."
],
[
"Please fill in this ___.",
[
"form",
"from",
"farm"
],
"« form » = formulaire."
],
[
"I have an ___ at ten o'clock.",
[
"appointment",
"appoint",
"apartment"
],
"« appointment » = rendez-vous."
]
];
  if (G.some(function (t) { return t.id === "admin"; })) return;
  G.push({
    id: "admin", niveau: 2, title: "N2 · 🪪 Administration",
    vocab: VOC.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }),
    dialogue: DIA.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }),
    quiz: QZ.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; })
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();
