/* DIISOO : PILIER 4 IELTS Life Skills A1, 5 nouveaux tests complets.
   Chaque test : 1a Personal Information, 1b Topic Questioning,
   2a Photograph Discussion (avec photo), 2b Further Discussion,
   plus un script de discussion en binome (champ "binome"). */
(function diisooIelts() {
  "use strict";
  const _S = (s) => s.trim().split("\n").map((l) => {
    const m = l.match(/^([AB])>\s*(.*)$/);
    const [en, fr] = m[2].split("|").map((x) => x.trim());
    return { who: m[1], en, fr };
  });
  const svg = (bg, body) => '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="260" fill="' + bg + '"/>' + body + "</svg>";
  const head = (x, y, c) => '<circle cx="' + x + '" cy="' + y + '" r="14" fill="' + c + '"/>';
  const body = (x, y, w, h, c) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" fill="' + c + '"/>';

  const PHOTOS = {
    school: svg("#f4ead6",
      '<rect x="40" y="30" width="320" height="90" fill="#2f5d3a"/><rect x="40" y="120" width="320" height="6" fill="#8a5a34"/>' +
      head(90, 150, "#7a4a2b") + body(76, 166, 28, 48, "#c2542d") +
      head(180, 200, "#a86a3c") + body(166, 214, 28, 36, "#3a6fb0") +
      head(250, 200, "#7a4a2b") + body(236, 214, 28, 36, "#e1a93f") +
      head(320, 200, "#a86a3c") + body(306, 214, 28, 36, "#b26fe0") +
      '<rect x="150" y="226" width="60" height="6" fill="#8a5a34"/><rect x="220" y="226" width="60" height="6" fill="#8a5a34"/>'),
    home: svg("#f6efe2",
      '<rect y="190" width="400" height="70" fill="#c9a877"/><rect x="30" y="110" width="150" height="14" fill="#8a5a34"/>' +
      '<rect x="40" y="124" width="8" height="66" fill="#8a5a34"/><rect x="162" y="124" width="8" height="66" fill="#8a5a34"/>' +
      '<circle cx="80" cy="96" r="12" fill="#e1693f"/><circle cx="110" cy="98" r="10" fill="#e1a93f"/><circle cx="138" cy="97" r="11" fill="#3fae74"/>' +
      head(260, 120, "#7a4a2b") + body(244, 136, 32, 70, "#c2542d") +
      '<rect x="300" y="60" width="70" height="90" fill="#bcdff5" stroke="#8a5a34" stroke-width="4"/>'),
    money: svg("#e8eef2",
      '<rect x="40" y="60" width="130" height="150" rx="10" fill="#33425b"/><rect x="55" y="75" width="100" height="40" rx="4" fill="#9fd3c7"/>' +
      '<rect x="75" y="140" width="60" height="8" fill="#e1a93f"/><rect x="75" y="160" width="60" height="30" rx="4" fill="#2a3448"/>' +
      head(260, 110, "#7a4a2b") + body(242, 126, 36, 84, "#3a6fb0") +
      '<rect x="296" y="150" width="40" height="64" rx="6" fill="#1b2235"/><rect x="302" y="158" width="28" height="40" fill="#6fd1a0"/>' +
      '<circle cx="360" cy="210" r="14" fill="#e1a93f"/><circle cx="330" cy="236" r="12" fill="#e1a93f"/>'),
    holidays: svg("#bfe3f7",
      '<circle cx="330" cy="50" r="28" fill="#f6c343"/><rect y="150" width="400" height="110" fill="#f0d9a0"/>' +
      '<rect y="130" width="400" height="30" fill="#4aa3d8"/>' +
      head(100, 170, "#7a4a2b") + body(86, 186, 28, 52, "#e1693f") +
      head(150, 180, "#a86a3c") + body(136, 196, 28, 42, "#3fae74") +
      head(230, 190, "#7a4a2b") + body(216, 204, 28, 34, "#b26fe0") +
      '<path d="M290 150 L340 150 L315 110 Z" fill="#e1693f"/><rect x="313" y="150" width="4" height="40" fill="#8a5a34"/>'),
    phone: svg("#dfe5ee",
      '<rect y="190" width="400" height="70" fill="#9aa3b2"/><rect x="0" y="40" width="130" height="150" fill="#b7bfcc"/>' +
      '<rect x="270" y="30" width="120" height="160" fill="#c8cfda"/>' +
      head(200, 90, "#7a4a2b") + body(180, 106, 40, 90, "#c2542d") +
      '<rect x="190" y="128" width="20" height="34" rx="4" fill="#1b2235"/><rect x="193" y="132" width="14" height="22" fill="#6fd1a0"/>')
  };

  const TESTS = [
    { id: "school", topic: "School & Learning", phases: [
      { id: "1a", label: "Personal Information", questions: ["What is your name?", "Where are you from?", "What do you do?"] },
      { id: "1b", label: "Topic Questioning", questions: [
        "Did you go to school when you were a child?", "What was your favourite subject?",
        "How do you learn English?", "Do you study at home or in a class?", "Who helps you with your studies?"
      ] },
      { id: "2a", label: "Photograph Discussion", introFR: "Imaginez une photo d'une salle de classe avec une enseignante au tableau et des élèves assis à leurs tables.", questions: [
        "What can you see in this picture?", "What is the teacher doing?", "What are the students doing?"
      ] },
      { id: "2b", label: "Further Discussion", questions: [
        "Why is education important?", "What would you like to learn next year?",
        "Do you prefer to learn alone or with other people? Why?",
        "Ask your partner: What did you learn this week?", "Ask your partner: How do you practise English every day?"
      ] }
    ], binome: _S(`
A> Hello! What do you study? | Bonjour ! Qu'étudies-tu ?
B> I study English in an evening class. And you? | J'étudie l'anglais dans un cours du soir. Et toi ?
A> I study English too. When is your class? | J'étudie aussi l'anglais. Quand est ton cours ?
B> It is on Monday and Wednesday at six o'clock. | Il est le lundi et le mercredi à dix-huit heures.
A> Is it difficult for you? | Est-ce difficile pour toi ?
B> Speaking is difficult, but I practise every day. | Parler est difficile, mais je pratique tous les jours.
A> That is a good idea. How do you practise? | C'est une bonne idée. Comment pratiques-tu ?
B> I listen to English and I speak with my friends. | J'écoute de l'anglais et je parle avec mes amis.
`) },
    { id: "home", topic: "Home & Housing", phases: [
      { id: "1a", label: "Personal Information", questions: ["What is your name?", "Where do you live?", "Who do you live with?"] },
      { id: "1b", label: "Topic Questioning", questions: [
        "Do you live in a house or in an apartment?", "How many rooms are there in your home?",
        "What is your favourite room? Why?", "Do you live in the city or in a village?", "Who cleans your home?"
      ] },
      { id: "2a", label: "Photograph Discussion", introFR: "Imaginez une photo d'une cuisine où une femme prépare le repas, avec une grande fenêtre et des légumes sur la table.", questions: [
        "What can you see in this picture?", "What is the woman doing?", "Do you like cooking at home? Why?"
      ] },
      { id: "2b", label: "Further Discussion", questions: [
        "What would you change in your home?", "Is it better to rent or to buy a house? Why?",
        "What makes a home comfortable?",
        "Ask your partner: Where do you live?", "Ask your partner: What is your favourite thing in your home?"
      ] }
    ], binome: _S(`
A> Where do you live? | Où habites-tu ?
B> I live in an apartment in Thiès. And you? | J'habite dans un appartement à Thiès. Et toi ?
A> I live in a house with my family. | J'habite dans une maison avec ma famille.
B> How many rooms are there? | Combien y a-t-il de pièces ?
A> There are five rooms and a small garden. | Il y a cinq pièces et un petit jardin.
B> That is nice. What is your favourite room? | C'est bien. Quelle est ta pièce préférée ?
A> The kitchen, because I love cooking. | La cuisine, parce que j'adore cuisiner.
B> I like the living room because we sit together there. | J'aime le salon parce que nous nous y asseyons ensemble.
`) },
    { id: "money", topic: "Money & Banks", phases: [
      { id: "1a", label: "Personal Information", questions: ["What is your name?", "Where are you from?", "What do you do?"] },
      { id: "1b", label: "Topic Questioning", questions: [
        "Do you have a bank account?", "How do you pay in the shop, with cash or with your phone?",
        "Do you save money?", "What do you buy every week?", "Do you use mobile money? What for?"
      ] },
      { id: "2a", label: "Photograph Discussion", introFR: "Imaginez une photo d'une personne qui retire de l'argent à un distributeur, avec un téléphone à la main.", questions: [
        "What can you see in this picture?", "What is the person doing?", "Why do people use cash machines?"
      ] },
      { id: "2b", label: "Further Discussion", questions: [
        "Is it important to save money? Why?", "What would you do with ten thousand francs as a gift?",
        "Is it better to pay with cash or with your phone? Why?",
        "Ask your partner: Do you save money every month?", "Ask your partner: What do you spend most money on?"
      ] }
    ], binome: _S(`
A> Do you have a bank account? | As-tu un compte en banque ?
B> No, but I use mobile money. And you? | Non, mais j'utilise le mobile money. Et toi ?
A> Yes, I have a small account. | Oui, j'ai un petit compte.
B> Do you save money every month? | Économises-tu de l'argent chaque mois ?
A> Yes, I save five thousand francs. | Oui, j'économise cinq mille francs.
B> What do you spend most money on? | Pour quoi dépenses-tu le plus d'argent ?
A> On food and transport. And you? | Pour la nourriture et le transport. Et toi ?
B> On my children's school. | Pour l'école de mes enfants.
`) },
    { id: "holidays", topic: "Holidays & Weather", phases: [
      { id: "1a", label: "Personal Information", questions: ["What is your name?", "Where do you live?", "What do you do?"] },
      { id: "1b", label: "Topic Questioning", questions: [
        "What is the weather like today?", "What is your favourite season? Why?",
        "Do you like the rain?", "Where do you go on holiday?", "Who do you travel with?"
      ] },
      { id: "2a", label: "Photograph Discussion", introFR: "Imaginez une photo d'une famille à la plage par une journée ensoleillée, avec la mer et un parasol.", questions: [
        "What can you see in this picture?", "What is the weather like?", "What are the people doing?"
      ] },
      { id: "2b", label: "Further Discussion", questions: [
        "What is the best place to go on holiday? Why?", "What do you do when it rains?",
        "Do you prefer holidays at the beach or in the village? Why?",
        "Ask your partner: What did you do last holiday?", "Ask your partner: Do you like hot weather?"
      ] }
    ], binome: _S(`
A> What is the weather like today? | Quel temps fait-il aujourd'hui ?
B> It is hot and sunny. I like it. | Il fait chaud et il y a du soleil. J'aime ça.
A> Do you like hot weather? | Aimes-tu le temps chaud ?
B> Yes, but I prefer the rainy season. | Oui, mais je préfère la saison des pluies.
A> Why? | Pourquoi ?
B> Because the fields are green and the air is fresh. | Parce que les champs sont verts et que l'air est frais.
A> Where do you go on holiday? | Où pars-tu en vacances ?
B> I go to Saint-Louis with my family. | Je vais à Saint-Louis avec ma famille.
`) },
    { id: "phone", topic: "Phones & Internet", phases: [
      { id: "1a", label: "Personal Information", questions: ["What is your name?", "Where are you from?", "What do you do?"] },
      { id: "1b", label: "Topic Questioning", questions: [
        "Do you have a mobile phone?", "What do you use your phone for?",
        "Do you use WhatsApp?", "How often do you call your family?", "Do you use the internet every day?"
      ] },
      { id: "2a", label: "Photograph Discussion", introFR: "Imaginez une photo d'une jeune femme qui marche dans la rue en regardant son téléphone.", questions: [
        "What can you see in this picture?", "What is the woman doing?", "What do you think she is looking at?"
      ] },
      { id: "2b", label: "Further Discussion", questions: [
        "Are phones good for children? Why?", "What would you do without your phone for one day?",
        "Is the internet useful for learning English? How?",
        "Ask your partner: What do you use your phone for?", "Ask your partner: Do you send voice messages?"
      ] }
    ], binome: _S(`
A> Do you have a mobile phone? | As-tu un téléphone portable ?
B> Yes, I use it every day. | Oui, je l'utilise tous les jours.
A> What do you use it for? | Pour quoi l'utilises-tu ?
B> I call my family and I use WhatsApp. | J'appelle ma famille et j'utilise WhatsApp.
A> Do you send voice messages? | Envoies-tu des messages vocaux ?
B> Yes, it is easier than writing. | Oui, c'est plus facile qu'écrire.
A> Do you learn English on your phone? | Apprends-tu l'anglais sur ton téléphone ?
B> Yes, I listen and I repeat every morning. | Oui, j'écoute et je répète chaque matin.
`) }
  ];

  if (typeof TEST_PHOTOS !== "undefined") Object.keys(PHOTOS).forEach((k) => { if (!TEST_PHOTOS[k]) TEST_PHOTOS[k] = PHOTOS[k]; });
  if (typeof TEST_BANK !== "undefined") TESTS.forEach((t) => { if (!TEST_BANK.some((o) => o.id === t.id)) TEST_BANK.push(t); });
  window.DIISOO_BINOME = Object.assign(window.DIISOO_BINOME || {}, Object.fromEntries(TESTS.map((t) => [t.id, t.binome])));
})();
