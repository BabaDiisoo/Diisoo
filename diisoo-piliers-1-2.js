/* ==========================================================
   DIISOO EXPANSION : piliers 1, 2, 3 et 4
   Ajoute du contenu sans toucher au code existant.
   Le wolof est a faire relire par un locuteur avant diffusion.
   ========================================================== */
(function diisooExpansion() {
  "use strict";
  const _L = (s) => s.trim().split("\n").map((l) => l.split("|").map((x) => x.trim()));
  const _P = (s) => _L(s).map(([en, fr, wo]) => (wo ? { en, fr, wo } : { en, fr }));
  const _W = (s) => _L(s).map(([en, fr, wo]) => ({ en, wo, fr }));
  const _D = (s) => s.trim().split("\n").map((l) => {
    const m = l.match(/^([A-Z])>\s*(.*)$/);
    const [en, fr, wo] = m[2].split("|").map((x) => x.trim());
    return { who: m[1], en, fr, wo };
  });
  const _B = (scene, s) => s.trim().split("\n").map((l, i) => {
    const m = l.match(/^([CM])>\s*(.*)$/);
    const [en, fr, wo] = m[2].split("|").map((x) => x.trim());
    const o = { role: m[1] === "C" ? "client" : "marchand", wo, fr, en };
    if (i === 0) o.scene = scene;
    return o;
  });
  const _Q = (q, o, a, why) => ({ q, o, a, why });

  /* ---------- PILIER 1 : anglais general, 8 themes ---------- */
  const GEN = {
    intro: {
      vocab: _P(`
What is your surname? | Quel est ton nom de famille ? | Ana sa sant ?
I am married | Je suis marié(e) | Dama séy
I am single | Je suis célibataire | Séyuma
I have two children | J'ai deux enfants | Am naa ñaar doom
I work in a shop | Je travaille dans une boutique | Maa ngi liggéey ci boutik
Where were you born? | Où es-tu né(e) ? | Fan nga juddoo ?
I was born in Thiès | Je suis né(e) à Thiès | Thiès laa juddoo
What is your phone number? | Quel est ton numéro de téléphone ? | Ban nimero telefon nga am ?
Please speak slowly | Parlez lentement, s'il vous plaît | Waxal ndank, baal ma
I do not understand | Je ne comprends pas | Dégguma
Can you repeat, please? | Pouvez-vous répéter ? | Mën nga waxaat ko ?
See you tomorrow | À demain | Ba ëllëg
`),
      dialogue: _D(`
A> Good morning. What is your full name? | Bonjour. Quel est votre nom complet ? | Salaamaalekum. Noo tudd, ak sa sant ?
B> My first name is Moussa and my surname is Diop. | Mon prénom est Moussa et mon nom de famille est Diop. | Maa ngi tudd Moussa, sama sant mooy Jóob.
A> Where were you born? | Où êtes-vous né ? | Fan nga juddoo ?
B> I was born in Thiès in 1993. | Je suis né à Thiès en 1993. | Thiès laa juddoo, ci at mi 1993.
A> What is your phone number? | Quel est votre numéro de téléphone ? | Ban nimero telefon nga am ?
B> It is seven seven, one two three, four five six seven. | C'est le sept sept, un deux trois, quatre cinq six sept. | Mooy juróom-ñaar juróom-ñaar, benn ñaar ñett, ñeent juróom juróom-benn juróom-ñaar.
`),
      quiz: [
        _Q("Where ___ you born?", ["was", "were", "are"], 1, "Avec you, le passé de be est « were »."),
        _Q("« Je ne comprends pas » se dit :", ["I do not understand", "I do not understood", "I not understand"], 0, "Négation au présent : do not + verbe de base."),
        _Q("I ___ two children.", ["have", "has", "am"], 0, "I + have pour dire que l'on possède.")
      ]
    },
    family: {
      vocab: _P(`
My father is a farmer | Mon père est agriculteur | Sama baay baykat la
My mother is a nurse | Ma mère est infirmière | Sama yaay infirmiyee la
I have three brothers | J'ai trois frères | Am naa ñett rakk yu góor
I have one sister | J'ai une soeur | Am naa benn rakk bu jigéen
My grandfather is old | Mon grand-père est âgé | Sama maam mag na
She is my wife | C'est ma femme | Moom mooy sama jabar
He is my husband | C'est mon mari | Moom mooy sama jëkkër
This is my best friend | Voici mon meilleur ami | Kii mooy sama xarit bu gëna ma jege
We live together | Nous vivons ensemble | Danoo bokk dëkk
How many children do you have? | Combien d'enfants as-tu ? | Ñaata doom nga am ?
My family is big | Ma famille est grande | Sama njaboot dafa bare
We eat together on Sunday | Nous mangeons ensemble le dimanche | Danuy lekk bokk ci dibéer
`),
      dialogue: _D(`
A> Tell me about your family. | Parle-moi de ta famille. | Wax ma ci sa njaboot.
B> I live with my parents and my two sisters. | Je vis avec mes parents et mes deux soeurs. | Dama bokk dëkk ak sama waajur ak sama ñaar rakk yu jigéen.
A> What does your father do? | Que fait ton père ? | Ban liggéey la sa baay di def ?
B> He is a driver. My mother sells vegetables. | Il est chauffeur. Ma mère vend des légumes. | Sóofóor la. Sama yaay mi, légumes la di jaay.
A> Do you have a big family? | As-tu une grande famille ? | Ndax am nga njaboot bu bare ?
B> Yes, we are eight people in the house. | Oui, nous sommes huit personnes à la maison. | Waaw, juróom-ñett nit lanu ci kër gi.
`),
      quiz: [
        _Q("My mother ___ a nurse.", ["is", "are", "am"], 0, "Pour la 3e personne du singulier on emploie is."),
        _Q("« Mon mari » se dit :", ["my husband", "my wife", "my uncle"], 0, "Husband = mari, wife = épouse."),
        _Q("How ___ children do you have?", ["many", "much", "more"], 0, "Many se met devant un nom que l'on peut compter.")
      ]
    },
    work: {
      vocab: _P(`
I start work at eight | Je commence le travail à huit heures | Dama door liggéey ci juróom-ñett
I finish at five | Je termine à dix-sept heures | Dama jeex ci juróom
I work every day except Sunday | Je travaille tous les jours sauf le dimanche | Damay liggéey bés bu nekk lu dul dibéer
My boss is kind | Mon patron est gentil | Sama patroŋ dafa baax
I am looking for a job | Je cherche un travail | Maa ngi wut liggéey
Can you give me an interview? | Pouvez-vous me recevoir pour un entretien ? | Ndax mën nga ma dalal ngir waxtaan ?
I have five years of experience | J'ai cinq ans d'expérience | Am naa juróom at ci liggéey bi
This is my CV | Voici mon CV | Kii mooy sama CV
I am paid at the end of the month | Je suis payé à la fin du mois | Dinañu ma fey ci fan weer wi
I am on holiday | Je suis en congé | Maa ngi ci kongé
The meeting is at ten | La réunion est à dix heures | Rendez-vous bi ci fukk la
I need a day off | J'ai besoin d'un jour de repos | Soxla naa benn bés ngir noppalu
`),
      dialogue: _D(`
A> Good morning. Why do you want this job? | Bonjour. Pourquoi voulez-vous ce travail ? | Salaamaalekum. Lu tax nga bëgg liggéey bii ?
B> I like working with people and I learn fast. | J'aime travailler avec les gens et j'apprends vite. | Bëgg naa liggéey ak nit ñi te damay jàng bu gaaw.
A> How many years of experience do you have? | Combien d'années d'expérience avez-vous ? | Ñaata at nga am ci liggéey bi ?
B> I have four years in a travel agency. | J'ai quatre ans dans une agence de voyage. | Am naa ñeent at ci ajaans bu tukki.
A> Can you start on Monday? | Pouvez-vous commencer lundi ? | Ndax mën nga door altine ?
B> Yes, I can start on Monday at eight. | Oui, je peux commencer lundi à huit heures. | Waaw, mën naa door altine ci juróom-ñett.
`),
      quiz: [
        _Q("I ___ work at eight every morning.", ["start", "starts", "starting"], 0, "I + verbe de base au présent simple."),
        _Q("« Entretien d'embauche » se dit :", ["job interview", "job holiday", "job meeting room"], 0, "Job interview = entretien d'embauche."),
        _Q("She ___ in a shop.", ["works", "work", "working"], 0, "3e personne : on ajoute -s (works).")
      ]
    },
    market: {
      vocab: _P(`
How much is this? | C'est combien ? | Ñaata la ?
It is too expensive | C'est trop cher | Dafa seer lool
Can you lower the price? | Pouvez-vous baisser le prix ? | Mën nga wàññi njëg bi ?
I will take two | J'en prends deux | Dinaa jël ñaar
Do you have change? | Avez-vous la monnaie ? | Am nga weccit ?
I only have a big note | J'ai seulement un gros billet | Am naa kayit bu mag rekk
Can I pay by mobile money? | Puis-je payer par mobile money ? | Ndax mën naa fey ci mobile money ?
Here is your change | Voici votre monnaie | Lii mooy sa weccit
Is this a fixed price? | Est-ce un prix fixe ? | Ndax njëg bii amul wàññi ?
Give me a discount | Faites-moi une remise | Jox ma wàññi
I want to see another colour | Je voudrais voir une autre couleur | Bëgg naa gis beneen kuloor
I will come back tomorrow | Je reviendrai demain | Dinaa dellusi ëllëg
`),
      dialogue: _D(`
A> Welcome, madam. What do you want to buy? | Bienvenue, madame. Que voulez-vous acheter ? | Dalal ak jàmm, soxna. Lan nga bëgg jënd ?
B> I want three kilos of onions. How much are they? | Je voudrais trois kilos d'oignons. C'est combien ? | Bëgg naa ñett kilo sooble. Ñaata la ?
A> Four hundred francs a kilo. | Quatre cents francs le kilo. | Ñeent téeméer la ci kilo bi.
B> That is expensive. Three hundred and fifty, please. | C'est cher. Trois cent cinquante, s'il vous plaît. | Dafa seer. Ñett téeméer ak juróom-fukk, baal ma.
A> Okay, for you, three hundred and fifty. | D'accord, pour vous, trois cent cinquante. | Baax na, ci yaw, ñett téeméer ak juróom-fukk.
B> Thank you. Here is the money. | Merci. Voici l'argent. | Jërëjëf. Lii mooy xaalis bi.
`),
      quiz: [
        _Q("How ___ is this bag?", ["much", "many", "long"], 0, "Pour un prix on emploie how much."),
        _Q("« Avez-vous la monnaie ? » se dit :", ["Do you have change?", "Have you the changes?", "Do you has change?"], 0, "Do you have + nom."),
        _Q("I ___ take two, please.", ["will", "am", "does"], 0, "Will exprime une décision prise sur le moment.")
      ]
    },
    travel: {
      vocab: _P(`
Where is the bus station? | Où est la gare routière ? | Fu garaas bi nekk ?
One ticket to Dakar, please | Un billet pour Dakar, s'il vous plaît | Benn bileet ngir Ndakaaru, baal ma
What time does the bus leave? | À quelle heure part le bus ? | Ban waxtu la bus bi di dem ?
How long is the trip? | Combien de temps dure le trajet ? | Ñaata waxtu la tukki bi di yàgg ?
Is this seat free? | Cette place est-elle libre ? | Ndax palaas bii amul boroom ?
I have one suitcase | J'ai une valise | Am naa benn valiis
Where is my luggage? | Où sont mes bagages ? | Fu samay bagaas nekk ?
My flight is delayed | Mon vol est retardé | Sama avion bi yàgg na
Can you show me on the map? | Pouvez-vous me montrer sur la carte ? | Mën nga ma won ko ci kart bi ?
Turn left, then turn right | Tournez à gauche, puis à droite | Wëlbatilal ci càmmoñ, ba noppi ci ndeyjoor
I am lost | Je suis perdu(e) | Réer naa
Where is the airport? | Où est l'aéroport ? | Fu àeroporu bi nekk ?
`),
      dialogue: _D(`
A> Good afternoon. One ticket to Saint-Louis, please. | Bonjour. Un billet pour Saint-Louis, s'il vous plaît. | Salaamaalekum. Benn bileet ngir Ndar, baal ma.
B> Sure. It is six thousand francs. | Bien sûr. C'est six mille francs. | Waaw. Juróom-benn junni la.
A> What time does the bus leave? | À quelle heure part le bus ? | Ban waxtu la bus bi di dem ?
B> It leaves at two o'clock from platform three. | Il part à quatorze heures, quai trois. | Dina dem ci ñaar waxtu, ci platform bu ñett.
A> How long is the trip? | Combien de temps dure le trajet ? | Ñaata waxtu la tukki bi di yàgg ?
B> About four hours. | Environ quatre heures. | Ci diggante ñeent waxtu.
`),
      quiz: [
        _Q("What time ___ the bus leave?", ["does", "do", "is"], 0, "Question au présent simple, 3e personne : does."),
        _Q("« Je suis perdu » se dit :", ["I am lost", "I lose", "I am losing"], 0, "I am lost = je suis perdu."),
        _Q("Turn ___ at the market.", ["left", "leave", "lift"], 0, "Left = gauche.")
      ]
    },
    health: {
      vocab: _P(`
I have a headache | J'ai mal à la tête | Bopp bi dafay metti
I have a fever | J'ai de la fièvre | Am naa tangoor
My stomach hurts | J'ai mal au ventre | Biir bi dafay metti
I cannot sleep | Je n'arrive pas à dormir | Mënuma nelaw
I need a doctor | J'ai besoin d'un médecin | Soxla naa doktoor
Where is the pharmacy? | Où est la pharmacie ? | Fu farmasi bi nekk ?
How often must I take this? | Combien de fois dois-je prendre cela ? | Ñaata yoon laa war a naan ko ?
Take it after meals | À prendre après les repas | Naanal ko bu ñu lekkee
Is it serious? | Est-ce grave ? | Ndax dafa metti lool ?
Call an ambulance! | Appelez une ambulance ! | Woo ambilaans !
I am allergic to this | Je suis allergique à cela | Allerjik naa ci lii
I feel better today | Je vais mieux aujourd'hui | Maa ngi gën a woomle tey
`),
      dialogue: _D(`
A> Good morning. What is the problem? | Bonjour. Quel est le problème ? | Salaamaalekum. Lan mooy jafe-jafe bi ?
B> I have a fever and a bad headache since yesterday. | J'ai de la fièvre et un fort mal de tête depuis hier. | Am naa tangoor ak bopp bu metti, démb.
A> Do you have a cough? | Avez-vous de la toux ? | Ndax am nga sëqët ?
B> No, but I feel very tired. | Non, mais je me sens très fatigué. | Déedéet, waaye damaa sonn lool.
A> Take this medicine twice a day, after meals. | Prenez ce médicament deux fois par jour, après les repas. | Naanal garab gii ñaari yoon ci bés, bu ñu lekkee.
B> Thank you, doctor. | Merci, docteur. | Jërëjëf, doktoor.
`),
      quiz: [
        _Q("I ___ a fever.", ["have", "am", "do"], 0, "On dit I have a fever."),
        _Q("« Pharmacie » se dit :", ["pharmacy", "farm", "fashion"], 0, "Pharmacy = pharmacie."),
        _Q("Take it ___ meals.", ["after", "afraid", "among"], 0, "After meals = après les repas.")
      ]
    },
    food: {
      vocab: _P(`
I am hungry | J'ai faim | Xiif naa
I am thirsty | J'ai soif | Mar naa
A table for four, please | Une table pour quatre, s'il vous plaît | Benn taabal ngir ñeent, baal ma
Can I see the menu? | Puis-je voir la carte ? | Mën naa gis kart bi ?
What do you recommend? | Que recommandez-vous ? | Lan nga ma di digal ?
I would like fish and rice | Je voudrais du poisson et du riz | Bëgg naa ceebu jën
Without pepper, please | Sans piment, s'il vous plaît | Bu ci nekk kaani, baal ma
The food is delicious | La nourriture est délicieuse | Lekk bi neex na lool
Can we have the bill? | Pouvons-nous avoir l'addition ? | Mën nanu am facture bi ?
I am a vegetarian | Je suis végétarien(ne) | Duma lekk yàpp
A glass of water, please | Un verre d'eau, s'il vous plaît | Benn kaas ndox, baal ma
It is too salty | C'est trop salé | Dafa xorom lool
`),
      dialogue: _D(`
A> Good evening. A table for two? | Bonsoir. Une table pour deux ? | Salaamaalekum. Benn taabal ngir ñaar ?
B> Yes, please. Can we see the menu? | Oui, s'il vous plaît. Pouvons-nous voir la carte ? | Waaw, baal ma. Mën nanu gis kart bi ?
A> Of course. What would you like to drink? | Bien sûr. Que désirez-vous boire ? | Waaw, baax na. Lan ngeen bëgg naan ?
B> Two bottles of water and one juice. | Deux bouteilles d'eau et un jus. | Ñaari butéel ndox ak benn jus.
A> And to eat? | Et pour manger ? | Te lan ngeen bëgg lekk ?
B> Chicken and rice for me, fish for my friend. | Du poulet et du riz pour moi, du poisson pour mon ami. | Ganaar ak ceeb ngir man, jën ngir sama xarit.
`),
      quiz: [
        _Q("I ___ hungry.", ["am", "have", "do"], 0, "Hungry se construit avec be : I am hungry."),
        _Q("Can we ___ the bill, please?", ["have", "has", "having"], 0, "Can we + verbe de base."),
        _Q("« Sans piment » se dit :", ["without pepper", "with pepper", "within pepper"], 0, "Without = sans.")
      ]
    },
    time: {
      vocab: _P(`
What time is it? | Quelle heure est-il ? | Ban waxtu la ?
It is half past two | Il est deux heures et demie | Ñaar waxtu ak genn-wàll la
It is five o'clock | Il est cinq heures | Juróom waxtu la
Today is Monday | Aujourd'hui, c'est lundi | Tey, altine la
Tomorrow is Tuesday | Demain, c'est mardi | Ëllëg, talaata la
Yesterday I was at home | Hier, j'étais à la maison | Démb, ci kër laa nekkoon
I wake up at six | Je me réveille à six heures | Damay yeewu ci juróom-benn
Every morning | Chaque matin | Bés bu nekk ci suba
Next week | La semaine prochaine | Ayu-bi jëm
Last month | Le mois dernier | Weer wi weesu
It is the fifth of May | C'est le cinq mai | Fan wi mooy juróom ci weeru mee
My birthday is in October | Mon anniversaire est en octobre | Sama bésu juddu ci oktoobar la
`),
      dialogue: _D(`
A> Excuse me, what time is it? | Excusez-moi, quelle heure est-il ? | Baal ma, ban waxtu la ?
B> It is ten past three. | Il est trois heures dix. | Ñett waxtu ak fukk simili la.
A> What time does the class start? | À quelle heure commence le cours ? | Ban waxtu la jàng bi di tàmbali ?
B> At four o'clock, in fifty minutes. | À seize heures, dans cinquante minutes. | Ci ñeent waxtu, ci juróom-fukk simili.
A> Is the class every day? | Le cours est-il tous les jours ? | Ndax jàng bi bés bu nekk la ?
B> No, only on Monday, Wednesday and Friday. | Non, seulement lundi, mercredi et vendredi. | Déedéet, altine rekk, àllarba ak àjjuma.
`),
      quiz: [
        _Q("« Il est deux heures et demie » :", ["It is half past two", "It is half to two", "It is two and half past"], 0, "Half past two = deux heures et demie."),
        _Q("I wake ___ at six.", ["up", "on", "out"], 0, "Wake up = se réveiller."),
        _Q("My birthday is ___ October.", ["in", "on", "at"], 0, "On dit in + nom du mois.")
      ]
    }
  };
  if (typeof GENERAL_THEMES !== "undefined") {
    GENERAL_THEMES.forEach((t) => {
      const x = GEN[t.id];
      if (!x) return;
      x.vocab.forEach((v) => { if (!t.vocab.some((o) => o.en === v.en)) t.vocab.push(v); });
      (x.dialogue || []).forEach((d) => t.dialogue.push(d));
      (x.quiz || []).forEach((q) => { if (!t.quiz.some((o) => o.q === q.q)) t.quiz.push(q); });
    });
  }

  /* ---------- PILIER 2 : wolof, mots par theme ---------- */
  const WOX = {
    salutations: _W(`
Good morning | Bonjour (matin) | Jàmm nga yendoo ?
Good night | Bonne nuit | Fanaanal ak jàmm
Welcome | Bienvenue | Dalal ak jàmm
Thank you very much | Merci beaucoup | Jërëjëf bu baax
Excuse me | Pardon | Baal ma
See you tomorrow | À demain | Ba ëllëg
Goodbye | Au revoir | Ba beneen yoon
Yes | Oui | Waaw
No | Non | Déedéet
Peace | Paix | Jàmm
`),
    famille: _W(`
Father | Père | Baay
Mother | Mère | Yaay
Child | Enfant | Doom
Husband | Mari | Jëkkër
Wife | Épouse | Jabar
Friend | Ami | Xarit
Family | Famille | Njaboot
Grandparent | Grand-parent | Maam
Neighbour | Voisin | Jarbaat
Elder brother or sister | Aîné | Mag
Younger brother or sister | Cadet | Rakk
`),
    maison: _W(`
Door | Porte | Bunt
Bed | Lit | Lal
Water | Eau | Ndox
Courtyard | Cour | Ëtt
Key | Clé | Caabi
Light | Lumière | Leer
Fire | Feu | Safara
Bowl | Bol | Ndab
Village or town | Village ou ville | Dëkk
`),
    marche: _W(`
Money | Argent | Xaalis
Market | Marché | Marse
To buy | Acheter | Jënd
To sell | Vendre | Jaay
Discount | Réduction | Wàññi
Thousand | Mille | Junni
Hundred | Cent | Téeméer
Shop | Boutique | Boutik
How much is it? | C'est combien ? | Ñaata la ?
Give me | Donne-moi | Jox ma
`),
    voyage: _W(`
Bus | Bus | Bus
Car | Voiture | Oto
Road | Route | Yoon
Ticket | Billet | Bileet
Airport | Aéroport | Àeroporu
To travel | Voyager | Tukki
Left | Gauche | Càmmoñ
Right | Droite | Ndeyjoor
Far | Loin | Sori
Near | Proche | Jege
Where? | Où ? | Fan ?
`),
    corps: _W(`
Head | Tête | Bopp
Stomach | Ventre | Biir
Hand | Main | Loxo
Foot | Pied | Tànk
Eye | Oeil | Bët
Ear | Oreille | Nopp
Mouth | Bouche | Gémmiñ
Heart | Coeur | Xol
Back | Dos | Ginnaaw
Fever | Fièvre | Tangoor
Medicine | Médicament | Garab
Sick | Malade | Feebar
Doctor | Médecin | Doktoor
`),
    nourriture: _W(`
Fish | Poisson | Jën
Meat | Viande | Yàpp
Bread | Pain | Mburu
Milk | Lait | Meew
Tea | Thé | Attaya
Sugar | Sucre | Suukar
Salt | Sel | Xorom
Fruit | Fruit | Meññeef
Mango | Mangue | Mangoro
Tomato | Tomate | Tomaat
Oil | Huile | Diw
`),
    temps: _W(`
Today | Aujourd'hui | Tey
Tomorrow | Demain | Ëllëg
Yesterday | Hier | Démb
Day | Jour | Bés
Night | Nuit | Guddi
Morning | Matin | Suba
Afternoon | Après-midi | Ngoon
Week | Semaine | Ayubés
Month | Mois | Weer
Year | Année | At
Time | Temps ou heure | Waxtu
Now | Maintenant | Léegi
`),
    logement: _W(`
Bathroom | Salle de bain | Néegu sangu
Guest | Invité | Gan
Gate | Portail | Buntu ëtt
Rooms | Chambres | Néeg yi
`)
  };
  const TRAVAIL = {
    id: "travail", title: "Travail & métiers",
    words: _W(`
Work | Travail | Liggéey
Worker | Travailleur | Liggéeykat
Boss | Patron | Patroŋ
Salary | Salaire | Peyoor
Teacher | Enseignant | Jàngalekat
Student | Élève ou étudiant | Ndongo
Driver | Chauffeur | Sóofóor
Tailor | Couturier | Tayoor
Mechanic | Mécanicien | Mekanisiyeŋ
Office | Bureau | Biro
Meeting | Réunion | Ndaje
To rest | Se reposer | Noppalu
`)
  };
  if (typeof WOLOF_THEMES !== "undefined") {
    if (!WOLOF_THEMES.some((t) => t.id === "travail")) WOLOF_THEMES.push(TRAVAIL);
    WOLOF_THEMES.forEach((t) => {
      (WOX[t.id] || []).forEach((w) => { if (!t.words.some((o) => o.en === w.en && o.wo === w.wo)) t.words.push(w); });
    });
    if (typeof LEXICON !== "undefined") {
      LEXICON.length = 0;
      WOLOF_THEMES.forEach((t) => t.words.forEach((w) => LEXICON.push({ cat: t.id, en: w.en, wo: w.wo, fr: w.fr, audio: w.audio || null })));
    }
  }
})();
