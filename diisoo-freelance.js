/* diisoo-freelance.js v1 : theme « Freelance & travail en ligne » (30 phrases, 1 dialogue, 3 questions), niveau N2.
   Wolof relu par Babacar. Desactivable : ?freelance=0 */
(function () {
  "use strict";
  if (window.__diisooFreelance || /[?&]freelance=0/.test(location.search)) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooFreelance = true;
  var VOC = [
[
"I work online.",
"Je travaille en ligne.",
"Maa ngi liggéey ci internet."
],
[
"I am a freelancer.",
"Je suis freelance.",
"Freelance laa."
],
[
"This is my CV.",
"Voici mon CV.",
"Sama CV mii ngi nii."
],
[
"I can send you my portfolio.",
"Je peux vous envoyer mon portfolio.",
"Mën naa la yónnee sama portfoliyo."
],
[
"What is your budget?",
"Quel est votre budget ?",
"Ban la sa budse ?"
],
[
"How many days do you need?",
"De combien de jours avez-vous besoin ?",
"Ñaata fan nga soxla ?"
],
[
"I will send it tomorrow.",
"Je l'envoie demain.",
"Dinaa ko yónnee suba."
],
[
"Can we talk on WhatsApp?",
"On peut parler sur WhatsApp ?",
"Ndax mën nanu waxtaan ci WhatsApp ?"
],
[
"Thank you for your message.",
"Merci pour votre message.",
"Jërëjëf ci sa mesaas."
],
[
"I do not have a computer today.",
"Je n'ai pas d'ordinateur aujourd'hui.",
"Amuma ordinatër tey."
],
[
"I have three years of experience.",
"J'ai trois ans d'expérience.",
"Am naa ñetti ati xam-xam ci liggéey bi."
],
[
"I speak French, English and Wolof.",
"Je parle français, anglais et wolof.",
"Maa ngi wax farañse, àngale ak wolof."
],
[
"Can we have a video call at ten?",
"On peut faire un appel vidéo à dix heures ?",
"Ndax mën nanu def woote wideo ci fukki waxtu ?"
],
[
"Can you hear me? My connection is not good.",
"Vous m'entendez ? Ma connexion n'est pas bonne.",
"Ndax dégg nga ma ? Sama koneksiyoŋ baaxul."
],
[
"What is the deadline for this project?",
"Quelle est la date limite de ce projet ?",
"Kañ la bés bu mujj bi ngir porose bii ?"
],
[
"I will send you a draft this evening.",
"Je vous envoie un brouillon ce soir.",
"Dinaa la yónnee benn bën-bën tey ci ngoon."
],
[
"Could you give me some feedback?",
"Pouvez-vous me donner votre avis ?",
"Ndax mën nga ma jox sa xalaat ?"
],
[
"I can make the changes you asked for.",
"Je peux faire les modifications demandées.",
"Mën naa def coppite yi nga laaj."
],
[
"My rate is fifty dollars per hour.",
"Mon tarif est de cinquante dollars de l'heure.",
"Sama njëg mooy juróom-fukki dolaar ci waxtu wu nekk."
],
[
"How would you like to pay me?",
"Comment souhaitez-vous me payer ?",
"Naka nga bëgg a ma fayee ?"
],
[
"I would like to sign a contract before I start.",
"Je voudrais signer un contrat avant de commencer.",
"Dama bëgg a siñe benn kontraa balaa ma di tàmbali."
],
[
"Can you pay half upfront and half after delivery?",
"Vous pouvez payer la moitié d'avance et la moitié à la livraison ?",
"Ndax mën nga fay genn-wàll gi ci njëlbéen te genn-wàll gi ci gannaaw yónnee bi ?"
],
[
"I receive payments by bank transfer or an online platform.",
"Je reçois les paiements par virement ou une plateforme en ligne.",
"Maa ngi jot fay yi ci wirmaa walla ci benn platfoorm ci internet."
],
[
"The payment has not arrived yet. Can you send the proof?",
"Le paiement n'est pas encore arrivé. Vous pouvez envoyer la preuve ?",
"Fay bi àggagul ba léegi. Ndax mën nga yónnee seede bi ?"
],
[
"I will need an invoice for my records.",
"J'aurai besoin d'une facture pour mes dossiers.",
"Dinaa soxla benn faktir ngir samay kayit."
],
[
"We can extend the deadline by three days if needed.",
"Nous pouvons prolonger le délai de trois jours si besoin.",
"Mën nanu yokk bés bu mujj bi ñetti fan su soxlawee."
],
[
"I apologise for the delay. I had a power cut.",
"Je m'excuse pour le retard. Il y a eu une coupure d'électricité.",
"Baal ma ci yeex bi. Am na benn dogu kuraŋ."
],
[
"Please keep the files confidential.",
"Merci de garder les fichiers confidentiels.",
"Bu leen neexee, denc leen dosiye yi ci kumpa."
],
[
"I am looking for long-term clients.",
"Je cherche des clients à long terme.",
"Maa ngi seet kliyaan yu di yàgg."
],
[
"Thank you for your trust. I look forward to working with you.",
"Merci pour votre confiance. J'ai hâte de travailler avec vous.",
"Jërëjëf ci sa wóolu. Maa ngi xaar liggéey ak yaw."
]
];
  var DIA = [
[
"B",
"Hello. I saw your portfolio. Can you design a website for my shop?",
"Bonjour. J'ai vu votre portfolio. Pouvez-vous créer un site pour ma boutique ?",
"Jàmm nga fanaan. Gis naa sa portfoliyo. Ndax mën nga defar benn sit ngir sama bitig ?"
],
[
"A",
"Yes, of course. How many pages do you need?",
"Oui, bien sûr. De combien de pages avez-vous besoin ?",
"Waaw kay. Ñaata pàj nga soxla ?"
],
[
"B",
"Five pages. How much will it cost?",
"Cinq pages. Combien ça coûtera ?",
"Juróomi pàj. Ñaata lay jar ?"
],
[
"A",
"It will cost three hundred dollars, and I need ten days.",
"Ça coûtera trois cents dollars, et il me faut dix jours.",
"Dina jar ñetti téeméeri dolaar, te dama soxla fukki fan."
],
[
"B",
"Can you do it in one week?",
"Vous pouvez le faire en une semaine ?",
"Ndax mën nga ko def ci benn ayu-bés ?"
],
[
"A",
"Yes, but the price will be three hundred and fifty dollars.",
"Oui, mais le prix sera de trois cent cinquante dollars.",
"Waaw, waaye njëg li dina nekk ñetti téeméeri dolaar ak juróom-fukk."
],
[
"B",
"Okay. Can I pay half now and half at the end?",
"D'accord. Je peux payer la moitié maintenant et la moitié à la fin ?",
"Waaw. Ndax mën naa fay genn-wàll léegi te genn-wàll bi ci mujj ?"
],
[
"A",
"Yes, I will send you the contract and my invoice today.",
"Oui, je vous envoie le contrat et ma facture aujourd'hui.",
"Waaw, dinaa la yónnee kontraa bi ak sama faktir tey."
]
];
  var QZ = [
[
"I am a ___. I work online.",
[
"freelancer",
"free land",
"fridge"
],
"« freelancer » = travailleur indépendant."
],
[
"What is the ___ for this project?",
[
"deadline",
"deadly",
"dead line up"
],
"« deadline » = date limite."
],
[
"Can you send me an ___ for my records?",
[
"invoice",
"invite",
"involve"
],
"« invoice » = facture."
]
];
  if (G.some(function (t) { return t.id === "freelance"; })) return;
  G.push({
    id: "freelance", niveau: 2, title: "N2 · 💻 Freelance & travail en ligne",
    vocab: VOC.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }),
    dialogue: DIA.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }),
    quiz: QZ.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; })
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();
