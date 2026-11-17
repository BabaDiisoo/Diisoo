/* diisoo-telephone.js v1 : theme « Téléphone & internet » (30 phrases, 1 dialogue, 3 questions), niveau N2.
   Wolof relu par Babacar. Desactivable : ?telephone=0 */
(function () {
  "use strict";
  if (window.__diisooTelephone || /[?&]telephone=0/.test(location.search)) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooTelephone = true;
  var VOC = [
[
"I need to buy credit.",
"Je dois acheter du crédit.",
"Dama soxla jënd kredi."
],
[
"How much is a recharge of one thousand francs?",
"Combien vaut une recharge de mille francs ?",
"Ñaata la resaarj bu junni farã ?"
],
[
"My phone is not working.",
"Mon téléphone ne marche pas.",
"Sama telefon du dox."
],
[
"The screen is broken.",
"L'écran est cassé.",
"Ekraŋ bi toj na."
],
[
"My battery is low.",
"Ma batterie est faible.",
"Sama batiri bi dafa jeex."
],
[
"Can I charge my phone here?",
"Je peux charger mon téléphone ici ?",
"Ndax mën naa sarse sama telefon fii ?"
],
[
"Is there Wi-Fi here?",
"Il y a du Wi-Fi ici ?",
"Ndax am na Wi-Fi fii ?"
],
[
"What is the Wi-Fi password?",
"Quel est le mot de passe du Wi-Fi ?",
"Ban la koodu Wi-Fi bi ?"
],
[
"I cannot hear you.",
"Je ne vous entends pas.",
"Dégguma la."
],
[
"Call me back, please.",
"Rappelez-moi, s'il vous plaît.",
"Woowaat ma, bu la neexee."
],
[
"I want a data bundle for one week.",
"Je veux un forfait internet pour une semaine.",
"Dama bëgg benn forfe internet ngir benn ayu-bés."
],
[
"How many gigabytes do I get?",
"Combien de giga ai-je ?",
"Ñaata giga laay am ?"
],
[
"My internet is very slow.",
"Mon internet est très lent.",
"Sama internet dafa yeex lool."
],
[
"The network is bad in my area.",
"Le réseau est mauvais dans mon quartier.",
"Reeso bi baaxul ci sama gox."
],
[
"I lost my phone. Can you block my SIM card?",
"J'ai perdu mon téléphone. Vous pouvez bloquer ma carte SIM ?",
"Rëcc naa sama telefon. Ndax mën nga tëj sama kart SIM ?"
],
[
"I want to keep my number on a new SIM.",
"Je veux garder mon numéro sur une nouvelle SIM.",
"Dama bëgg a denc sama nimero ci benn SIM bu bees."
],
[
"Can you send me the document on WhatsApp?",
"Vous pouvez m'envoyer le document sur WhatsApp ?",
"Ndax mën nga ma yónnee kayit bi ci WhatsApp ?"
],
[
"Please send your location.",
"Envoyez votre position, s'il vous plaît.",
"Yónneel sa bereb, bu la neexee."
],
[
"I cannot open the message.",
"Je n'arrive pas à ouvrir le message.",
"Mënuma ubbi mesaas bi."
],
[
"My phone is full. I need to delete some photos.",
"Mon téléphone est plein. Je dois supprimer des photos.",
"Sama telefon fees na. War naa far yenn nataal yi."
],
[
"I received a message saying I won a prize. Is it real?",
"J'ai reçu un message disant que j'ai gagné un prix. C'est vrai ?",
"Jot naa benn mesaas bu wax ne am naa ndam. Ndax dëgg la ?"
],
[
"Never click on a link from an unknown number.",
"Ne cliquez jamais sur un lien d'un numéro inconnu.",
"Bul bës mukk ci benn lëkkalekaay bu jóge ci nimero boo xamul."
],
[
"I was charged for a service I did not subscribe to.",
"On m'a facturé un service auquel je ne me suis pas abonné.",
"Dañu ma fayloo ci benn liggéey bu ma abonnewul."
],
[
"Can you repair the screen today? How much will it cost?",
"Vous pouvez réparer l'écran aujourd'hui ? Combien ça coûtera ?",
"Ndax mën nga defar ekraŋ bi tey ? Ñaata lay jar ?"
],
[
"Is this phone original or a copy? Can I check the IMEI?",
"Ce téléphone est original ou une copie ? Je peux vérifier l'IMEI ?",
"Ndax telefon bii dëgg-dëgg la walla royukaay la ? Ndax mën naa xool IMEI bi ?"
],
[
"I want to switch to a fibre internet subscription for my shop.",
"Je veux passer à un abonnement internet fibre pour ma boutique.",
"Dama bëgg a dem ci abonnemaŋ internet fibër ngir sama bitig."
],
[
"Please back up my photos before you reset the phone.",
"Sauvegardez mes photos avant de réinitialiser le téléphone.",
"Dencal samay nataal balaa ngay tëj-ubbiwaat telefon bi."
],
[
"I forgot my password. How can I recover my account?",
"J'ai oublié mon mot de passe. Comment récupérer mon compte ?",
"Fàtte naa sama kood. Naka laa mën a jotee sama kont ?"
],
[
"Someone is using my WhatsApp number. What can I do?",
"Quelqu'un utilise mon numéro WhatsApp. Que faire ?",
"Kenn mu ngi jëfandikoo sama nimero WhatsApp. Lan laa war a def ?"
],
[
"Do you offer a warranty on the repair?",
"Vous donnez une garantie sur la réparation ?",
"Ndax dangeen di joxe garanti ci defar bi ?"
]
];
  var DIA = [
[
"B",
"Hello. I would like a data bundle, please.",
"Bonjour. Je voudrais un forfait internet, s'il vous plaît.",
"Jàmm nga fanaan. Dama bëgg benn forfe internet, bu la neexee."
],
[
"A",
"Of course. For how long?",
"Bien sûr. Pour combien de temps ?",
"Waaw kay. Ngir ñaata dir ?"
],
[
"B",
"For one month. How many gigabytes do I get?",
"Pour un mois. Combien de giga ai-je ?",
"Ngir benn weer. Ñaata giga laay am ?"
],
[
"A",
"Ten gigabytes for five thousand francs.",
"Dix giga pour cinq mille francs.",
"Fukki giga ngir juróomi junni farã."
],
[
"B",
"Is there a cheaper bundle?",
"Il y a un forfait moins cher ?",
"Ndax am na forfe bu gën a yomb ?"
],
[
"A",
"Yes, five gigabytes for three thousand francs.",
"Oui, cinq giga pour trois mille francs.",
"Waaw, juróomi giga ngir ñetti junni farã."
],
[
"B",
"I will take the ten gigabytes. Can I pay with Orange Money?",
"Je prends les dix giga. Je peux payer avec Orange Money ?",
"Dinaa jël fukki giga yi. Ndax mën naa fay ak Orange Money ?"
],
[
"A",
"Yes. Enter your code, and the bundle will be active in one minute.",
"Oui. Entrez votre code, et le forfait sera actif dans une minute.",
"Waaw. Dugalal sa kood, te forfe bi dina dox ci benn simili."
]
];
  var QZ = [
[
"My phone is ___. It does not turn on.",
[
"broken",
"breaking",
"broke up"
],
"« is broken » = est cassé."
],
[
"What is the Wi-Fi ___?",
[
"password",
"passport",
"passage"
],
"« password » = mot de passe."
],
[
"I want a data ___ for one week.",
[
"bundle",
"bandage",
"bound"
],
"« data bundle » = forfait internet."
]
];
  if (G.some(function (t) { return t.id === "phone"; })) return;
  G.push({
    id: "phone", niveau: 2, title: "N2 · 📱 Téléphone & internet",
    vocab: VOC.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }),
    dialogue: DIA.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }),
    quiz: QZ.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; })
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();
