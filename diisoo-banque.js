/* diisoo-banque.js v1 : theme « Banque & mobile money » (30 phrases, 1 dialogue, 3 questions), niveau N2.
   Wolof relu par Babacar. Desactivable : ?banque=0 */
(function () {
  "use strict";
  if (window.__diisooBanque || /[?&]banque=0/.test(location.search)) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooBanque = true;
  var VOC = [
[
"Where is the bank?",
"Où est la banque ?",
"Fan la bànk bi nekk ?"
],
[
"I want to send money.",
"Je veux envoyer de l'argent.",
"Dama bëgg a yónnee xaalis."
],
[
"I want to withdraw money.",
"Je veux retirer de l'argent.",
"Dama bëgg a génne xaalis."
],
[
"I want to deposit money.",
"Je veux déposer de l'argent.",
"Dama bëgg a dugal xaalis."
],
[
"What is your Wave number?",
"Quel est votre numéro Wave ?",
"Ban la sa nimero Wave ?"
],
[
"How much is the fee?",
"Combien sont les frais ?",
"Ñaata la fere bi ?"
],
[
"I have sent the money.",
"J'ai envoyé l'argent.",
"Yónnee naa xaalis bi."
],
[
"I have received the money.",
"J'ai reçu l'argent.",
"Jot naa xaalis bi."
],
[
"Please give me a receipt.",
"Donnez-moi un reçu, s'il vous plaît.",
"Jox ma resi, bu la neexee."
],
[
"My phone has no network.",
"Mon téléphone n'a pas de réseau.",
"Sama telefon amul reeso."
],
[
"What is the maximum amount I can send?",
"Quel est le montant maximum que je peux envoyer ?",
"Ñaata la xaalis bi ëpp bu ma mën a yónnee ?"
],
[
"I made a mistake in the number. Can you cancel it?",
"Je me suis trompé de numéro. Vous pouvez annuler ?",
"Damaa juum ci nimero bi. Ndax mën nga ko neenal ?"
],
[
"I forgot my secret code.",
"J'ai oublié mon code secret.",
"Fàtte naa sama koodu kumpa."
],
[
"How do I check my balance?",
"Comment vérifier mon solde ?",
"Naka laa mën a xool sama solde ?"
],
[
"I want to open a bank account.",
"Je veux ouvrir un compte bancaire.",
"Dama bëgg a ubbi benn kontu bànk."
],
[
"Which documents do I need?",
"De quels documents ai-je besoin ?",
"Yan kayit laa soxla ?"
],
[
"Can I pay my bill with Orange Money?",
"Je peux payer ma facture avec Orange Money ?",
"Ndax mën naa fay sama faktir ak Orange Money ?"
],
[
"The agent has no cash.",
"L'agent n'a pas d'argent liquide.",
"Ajaan bi amul xaalis bu mu joxe."
],
[
"How long does a transfer to France take?",
"Combien de temps dure un transfert vers la France ?",
"Ñaata waxtu la yónnee xaalis ba Faraas di jël ?"
],
[
"Please check your phone, I sent you a code.",
"Vérifiez votre téléphone, je vous ai envoyé un code.",
"Xoolal sa telefon, yónnee naa la benn kood."
],
[
"Someone called me and asked for my secret code. It is a scam.",
"Quelqu'un m'a appelé pour avoir mon code secret. C'est une arnaque.",
"Kenn woo na ma te laaj ma sama koodu kumpa. Njaayum nax la."
],
[
"My money was deducted but the person did not receive it.",
"Mon argent a été débité mais la personne ne l'a pas reçu.",
"Sama xaalis dañu ko wàññi waaye ki ko waroon a jot jotul ko."
],
[
"I would like to apply for a loan to start my business.",
"Je voudrais demander un prêt pour lancer mon activité.",
"Dama bëgg a laaj benn leb ngir tàmbali sama liggéey."
],
[
"What is the interest rate and the repayment period?",
"Quel est le taux d'intérêt et la durée de remboursement ?",
"Ñaata la njëgu teg ci leb bi te ñaata dir la fay bi di yàgg ?"
],
[
"I receive money from abroad. How do I withdraw it?",
"Je reçois de l'argent de l'étranger. Comment le retirer ?",
"Maa ngi jot xaalis bu jóge biti réew. Naka laa ko mën a génnee ?"
],
[
"Can I get a bank statement for my visa application?",
"Je peux avoir un relevé bancaire pour ma demande de visa ?",
"Ndax mën naa am relewe bànk ngir sama laaju wisa ?"
],
[
"The exchange rate is not good. Is there a better one?",
"Le taux de change n'est pas bon. Il y en a un meilleur ?",
"Njëgu wecciku xaalis bi baaxul. Ndax am na bu gën a baax ?"
],
[
"My card was blocked. How can I unblock it?",
"Ma carte a été bloquée. Comment la débloquer ?",
"Sama kart bi dañu ko tëj. Naka laa ko mën a ubbiloo ?"
],
[
"I want to set up a standing order for my rent.",
"Je veux programmer un virement mensuel pour mon loyer.",
"Dama bëgg a def benn wirmaa weer wu nekk ngir fay sama luwaas."
],
[
"Please keep your code secret and never share it with anyone.",
"Gardez votre code secret et ne le partagez avec personne.",
"Dencal sa koodu kumpa te bul ko wax kenn."
]
];
  var DIA = [
[
"B",
"Hello. I want to send money to my mother in Thiès.",
"Bonjour. Je veux envoyer de l'argent à ma mère à Thiès.",
"Jàmm nga fanaan. Dama bëgg a yónnee xaalis sama yaay ci Cees."
],
[
"A",
"Of course. What is her Wave number?",
"Bien sûr. Quel est son numéro Wave ?",
"Waaw kay. Ban la nimero Wave bi ?"
],
[
"B",
"Seven seven, two eight eight, two one, zero nine.",
"Le 77 288 21 09.",
"Juróom-ñaar juróom-ñaar, ñaar juróom-ñett juróom-ñett, ñaar benn, tus juróom-ñeent."
],
[
"A",
"How much do you want to send?",
"Combien voulez-vous envoyer ?",
"Ñaata xaalis nga bëgg a yónnee ?"
],
[
"B",
"Fifty thousand francs. How much is the fee?",
"Cinquante mille francs. Combien sont les frais ?",
"Juróom-fukki junni farã. Ñaata la fere bi ?"
],
[
"A",
"The fee is five hundred francs. Please confirm.",
"Les frais sont de cinq cents francs. Confirmez, s'il vous plaît.",
"Fere bi juróom-téeméeri farã la. Dëggalal ko, bu la neexee."
],
[
"B",
"Yes, I confirm. Can I have a receipt?",
"Oui, je confirme. Je peux avoir un reçu ?",
"Waaw, dëggal naa ko. Ndax mën naa am resi ?"
],
[
"A",
"Here you are. The money has been sent.",
"Voilà. L'argent a été envoyé.",
"Mii ngi nii. Xaalis bi yónnee nañu ko."
]
];
  var QZ = [
[
"I want to ___ money to my mother.",
[
"send",
"sended",
"sent to"
],
"« want to » + verbe de base : send."
],
[
"How much is the ___ for the transfer?",
[
"fee",
"fine",
"feed"
],
"« fee » = les frais."
],
[
"I forgot my secret ___.",
[
"code",
"cold",
"coat"
],
"« secret code » = code secret."
]
];
  if (G.some(function (t) { return t.id === "banking"; })) return;
  G.push({
    id: "banking", niveau: 2, title: "N2 · 💳 Banque & mobile money",
    vocab: VOC.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }),
    dialogue: DIA.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }),
    quiz: QZ.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; })
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();
