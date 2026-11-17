/* diisoo-factures.js v1 : theme « Eau, électricité & factures » (30 phrases, 1 dialogue, 3 questions), niveau N2.
   Wolof relu par Babacar. Desactivable : ?factures=0 */
(function () {
  "use strict";
  if (window.__diisooFactures || /[?&]factures=0/.test(location.search)) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooFactures = true;
  var VOC = [
[
"There is no electricity.",
"Il n'y a pas d'électricité.",
"Kuraŋ amul."
],
[
"There is no water.",
"Il n'y a pas d'eau.",
"Ndox amul."
],
[
"When will the power come back?",
"Quand le courant va-t-il revenir ?",
"Kañ la kuraŋ bi di dellusi ?"
],
[
"This is my electricity bill.",
"Voici ma facture d'électricité.",
"Sama faktir kuraŋ mii ngi nii."
],
[
"How much is the bill?",
"Combien est la facture ?",
"Ñaata la faktir bi ?"
],
[
"I want to pay my bill.",
"Je veux payer ma facture.",
"Dama bëgg a fay sama faktir."
],
[
"I want to buy electricity credit.",
"Je veux acheter du crédit d'électricité.",
"Dama bëgg a jënd kredi kuraŋ."
],
[
"The tap is leaking.",
"Le robinet fuit.",
"Robine bi dafay tuuru."
],
[
"The light is not working.",
"La lumière ne marche pas.",
"Làmp bi du dox."
],
[
"Please come quickly.",
"Venez vite, s'il vous plaît.",
"Ñëwal gaaw, bu la neexee."
],
[
"Where is the meter?",
"Où est le compteur ?",
"Fan la komteer bi nekk ?"
],
[
"My meter is not working.",
"Mon compteur ne marche pas.",
"Sama komteer du dox."
],
[
"The prepaid meter shows an error.",
"Le compteur prépayé affiche une erreur.",
"Komteer bu Woyofal bi dafay wone njuumte."
],
[
"Can I pay my bill with Wave?",
"Je peux payer ma facture avec Wave ?",
"Ndax mën naa fay sama faktir ak Wave ?"
],
[
"The power cut lasted two days.",
"La coupure a duré deux jours.",
"Dogug kuraŋ bi yàgg na ñaari fan."
],
[
"The water is dirty.",
"L'eau est sale.",
"Ndox mi dafa tilim."
],
[
"The water pressure is very low.",
"La pression de l'eau est très faible.",
"Doole ndox mi dafa néew lool."
],
[
"When will the technician come?",
"Quand le technicien viendra-t-il ?",
"Kañ la teknisiyeŋ bi di ñëw ?"
],
[
"I want to change the name on the contract.",
"Je veux changer le nom sur le contrat.",
"Dama bëgg a soppi tur bi ci kontraa bi."
],
[
"I need a copy of my last bill.",
"Il me faut une copie de ma dernière facture.",
"Dama soxla benn koppi sama faktir bu mujj bi."
],
[
"My bill is much higher than usual. I would like it checked.",
"Ma facture est beaucoup plus élevée que d'habitude. Je voudrais qu'on la vérifie.",
"Sama faktir dafa ëpp lool ni mu daan mel. Dama bëgg ñu xool ko."
],
[
"I paid my bill, but the power was cut.",
"J'ai payé ma facture, mais le courant a été coupé.",
"Fay naa sama faktir, waaye kuraŋ bi dañu ko dog."
],
[
"I would like to make a complaint about the repeated cuts.",
"Je voudrais faire une réclamation pour les coupures répétées.",
"Dama bëgg a joxe benn laaj-ubbi ci dogug kuraŋ yi di faral di am."
],
[
"The voltage is unstable and it damaged my fridge.",
"La tension est instable et elle a abîmé mon frigo.",
"Kuraŋ bi dafay dem di dikk te yàq na sama firigo."
],
[
"I would like to apply for a new connection.",
"Je voudrais demander un nouveau branchement.",
"Dama bëgg a laaj benn lëkkale bu bees."
],
[
"How much is the connection fee, and how long does it take?",
"Combien coûtent les frais de branchement, et combien de temps ça prend ?",
"Ñaata la fere lëkkale bi te ñaata dir lay jël ?"
],
[
"Please give me a payment receipt as proof.",
"Donnez-moi un reçu de paiement comme preuve.",
"Jox ma benn resi fay ngir seede."
],
[
"Can you set up an instalment plan for the unpaid bill?",
"Vous pouvez mettre en place un échéancier pour la facture impayée ?",
"Ndax mën nga ma defaral benn pexem fay ci ay wàll ngir faktir bi ñu fayagul ?"
],
[
"I will switch to a solar panel to reduce the cost.",
"Je vais passer au panneau solaire pour réduire le coût.",
"Dinaa jëfandikoo pano soleer ngir wàññi njëg li."
],
[
"Please send me a message when the service is restored.",
"Envoyez-moi un message quand le service sera rétabli.",
"Yónneel ma benn mesaas bu kuraŋ bi dellusee."
]
];
  var DIA = [
[
"B",
"Hello. There is no electricity in my house since this morning.",
"Bonjour. Il n'y a pas d'électricité chez moi depuis ce matin.",
"Jàmm nga fanaan. Kuraŋ amul ci sama kër li dale suba."
],
[
"A",
"I am sorry. What is your meter number?",
"Je suis désolé. Quel est votre numéro de compteur ?",
"Baal ma. Ban la nimero sa komteer ?"
],
[
"B",
"It is one two three four five six. I live in Thiès, Mbour 2.",
"C'est le 123456. J'habite à Thiès, Mbour 2.",
"Mooy benn ñaar ñett ñeent juróom juróom-benn. Maa ngi dëkk Cees, Mbuur 2."
],
[
"A",
"We know about the problem. A technician is on the way.",
"Nous connaissons le problème. Un technicien est en route.",
"Xam nanu jafe-jafe bi. Benn teknisiyeŋ mu ngi ci yoon."
],
[
"B",
"How long will it take?",
"Combien de temps ça va prendre ?",
"Ñaata waxtu lay jël ?"
],
[
"A",
"About two hours. The power will be back this afternoon.",
"Environ deux heures. Le courant sera de retour cet après-midi.",
"Lu tollu ci ñaari waxtu. Kuraŋ bi dina dellusi ci ngoon gi."
],
[
"B",
"Can you send me a message when it is fixed?",
"Vous pouvez m'envoyer un message quand c'est réparé ?",
"Ndax mën nga ma yónnee benn mesaas bu ñu ko defaree ?"
],
[
"A",
"Yes, we will send you a message. Thank you for your patience.",
"Oui, nous vous enverrons un message. Merci de votre patience.",
"Waaw, dinanu la yónnee benn mesaas. Jërëjëf ci sa muñ."
]
];
  var QZ = [
[
"There is no ___ in my house.",
[
"electricity",
"electric city",
"elect"
],
"« electricity » = électricité."
],
[
"I want to pay my ___.",
[
"bill",
"bell",
"bull"
],
"« bill » = facture."
],
[
"The ___ is not working.",
[
"meter",
"metre of",
"meteor"
],
"« meter » = compteur."
]
];
  if (G.some(function (t) { return t.id === "bills"; })) return;
  G.push({
    id: "bills", niveau: 2, title: "N2 · 💡 Eau, électricité & factures",
    vocab: VOC.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }),
    dialogue: DIA.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }),
    quiz: QZ.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; })
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();
