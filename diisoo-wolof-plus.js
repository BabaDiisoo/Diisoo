/* diisoo-wolof-plus.js : Anglais Wolof passe de 10 a 18 themes (8 nouveaux, 12 mots chacun, wolof relu par Babacar).
   Les themes sont ajoutes a la fin : les niveaux (Debutant, Intermediaire, Avance) se repartissent automatiquement par tiers (6, 6, 6).
   Aucun fichier existant modifie. */
(function () {
  "use strict";
  if (window.__wolofPlus) return; window.__wolofPlus = true;
  var NOUVEAUX = [
{
"id": "nature",
"title": "Nature & animaux",
"words": [
{
"en": "Tree",
"wo": "Garab",
"fr": "Arbre"
},
{
"en": "Sun",
"wo": "Jant",
"fr": "Soleil"
},
{
"en": "Moon",
"wo": "Weer",
"fr": "Lune"
},
{
"en": "Rain",
"wo": "Taw",
"fr": "Pluie"
},
{
"en": "Wind",
"wo": "Ngelaw",
"fr": "Vent"
},
{
"en": "Sea",
"wo": "Géej",
"fr": "Mer"
},
{
"en": "River",
"wo": "Dex",
"fr": "Fleuve"
},
{
"en": "Dog",
"wo": "Xaj",
"fr": "Chien"
},
{
"en": "Cat",
"wo": "Muus",
"fr": "Chat"
},
{
"en": "Horse",
"wo": "Fas",
"fr": "Cheval"
},
{
"en": "Bird",
"wo": "Picc",
"fr": "Oiseau"
},
{
"en": "Fish",
"wo": "Jën",
"fr": "Poisson"
}
]
},
{
"id": "sentiments",
"title": "Sentiments",
"words": [
{
"en": "Happy",
"wo": "Bég",
"fr": "Content"
},
{
"en": "Sad",
"wo": "Naqar",
"fr": "Triste"
},
{
"en": "Angry",
"wo": "Mer",
"fr": "En colère"
},
{
"en": "Afraid",
"wo": "Ragal",
"fr": "Avoir peur"
},
{
"en": "Patience",
"wo": "Muñ",
"fr": "Patience"
},
{
"en": "Hope",
"wo": "Yaakaar",
"fr": "Espoir"
},
{
"en": "Trust",
"wo": "Wóolu",
"fr": "Confiance"
},
{
"en": "Respect",
"wo": "Kersa",
"fr": "Respect"
},
{
"en": "Friend",
"wo": "Xarit",
"fr": "Ami"
},
{
"en": "Peace",
"wo": "Jàmm",
"fr": "Paix"
},
{
"en": "I love you",
"wo": "Bëgg naa la",
"fr": "Je t'aime"
},
{
"en": "I miss you",
"wo": "Dama la nammoon",
"fr": "Tu me manques"
}
]
},
{
"id": "ecole",
"title": "École & études",
"words": [
{
"en": "School",
"wo": "Ekool",
"fr": "École"
},
{
"en": "Teacher",
"wo": "Jàngalekat",
"fr": "Enseignant"
},
{
"en": "Student",
"wo": "Jàngkat",
"fr": "Élève"
},
{
"en": "Book",
"wo": "Téere",
"fr": "Livre"
},
{
"en": "Notebook",
"wo": "Kaye",
"fr": "Cahier"
},
{
"en": "Pen",
"wo": "Stilo",
"fr": "Stylo"
},
{
"en": "Lesson",
"wo": "Njàng",
"fr": "Leçon"
},
{
"en": "Exam",
"wo": "Ekzamen",
"fr": "Examen"
},
{
"en": "To read",
"wo": "Jàng",
"fr": "Lire"
},
{
"en": "To write",
"wo": "Bind",
"fr": "Écrire"
},
{
"en": "Question",
"wo": "Laaj",
"fr": "Question"
},
{
"en": "Answer",
"wo": "Tontu",
"fr": "Réponse"
}
]
},
{
"id": "telephone",
"title": "Téléphone & internet",
"words": [
{
"en": "Phone",
"wo": "Telefon",
"fr": "Téléphone"
},
{
"en": "Call",
"wo": "Woote",
"fr": "Appel"
},
{
"en": "Message",
"wo": "Bataaxal",
"fr": "Message"
},
{
"en": "Credit",
"wo": "Kredi",
"fr": "Crédit"
},
{
"en": "Charger",
"wo": "Cargeur",
"fr": "Chargeur"
},
{
"en": "Battery",
"wo": "Batri",
"fr": "Batterie"
},
{
"en": "Internet",
"wo": "Intërnet",
"fr": "Internet"
},
{
"en": "Network",
"wo": "Rezo",
"fr": "Réseau"
},
{
"en": "Number",
"wo": "Nimero",
"fr": "Numéro"
},
{
"en": "Video call",
"wo": "Woote wideo",
"fr": "Appel vidéo"
},
{
"en": "Photo",
"wo": "Nataal",
"fr": "Photo"
},
{
"en": "Screen",
"wo": "Ekraŋ",
"fr": "Écran"
}
]
},
{
"id": "metiers",
"title": "Métiers courants",
"words": [
{
"en": "Driver",
"wo": "Cofër",
"fr": "Chauffeur"
},
{
"en": "Mechanic",
"wo": "Mekanisiyeŋ",
"fr": "Mécanicien"
},
{
"en": "Tailor",
"wo": "Tayoor",
"fr": "Tailleur"
},
{
"en": "Doctor",
"wo": "Doktoor",
"fr": "Médecin"
},
{
"en": "Nurse",
"wo": "Infirmiye",
"fr": "Infirmier"
},
{
"en": "Builder",
"wo": "Maasoŋ",
"fr": "Maçon"
},
{
"en": "Electrician",
"wo": "Elektrisien",
"fr": "Électricien"
},
{
"en": "Hairdresser",
"wo": "Kuafëer",
"fr": "Coiffeur"
},
{
"en": "Guard",
"wo": "Garde",
"fr": "Gardien"
},
{
"en": "Boss",
"wo": "Patroŋ",
"fr": "Patron"
},
{
"en": "Employee",
"wo": "Liggéeykat",
"fr": "Employé"
},
{
"en": "Apprentice",
"wo": "Apranti",
"fr": "Apprenti"
}
]
},
{
"id": "fetes",
"title": "Fêtes & traditions",
"words": [
{
"en": "Tabaski",
"wo": "Tabaski",
"fr": "Tabaski"
},
{
"en": "Korité",
"wo": "Koriteh",
"fr": "Korité"
},
{
"en": "Magal",
"wo": "Màggal",
"fr": "Magal"
},
{
"en": "Gamou",
"wo": "Gàmmu",
"fr": "Gamou"
},
{
"en": "Wedding",
"wo": "Céet",
"fr": "Mariage"
},
{
"en": "Baptism",
"wo": "Ngénte",
"fr": "Baptême"
},
{
"en": "Prayer",
"wo": "Julli",
"fr": "Prière"
},
{
"en": "Mosque",
"wo": "Jàkka",
"fr": "Mosquée"
},
{
"en": "Guest",
"wo": "Gan",
"fr": "Invité"
},
{
"en": "Gift",
"wo": "Kado",
"fr": "Cadeau"
},
{
"en": "Dance",
"wo": "Fecc",
"fr": "Danse"
},
{
"en": "Song",
"wo": "Woy",
"fr": "Chanson"
}
]
},
{
"id": "papiers",
"title": "Administration",
"words": [
{
"en": "Passport",
"wo": "Paaspoor",
"fr": "Passeport"
},
{
"en": "ID card",
"wo": "Kart d'identité",
"fr": "Carte d'identité"
},
{
"en": "Form",
"wo": "Formilaar",
"fr": "Formulaire"
},
{
"en": "Office",
"wo": "Biro",
"fr": "Bureau"
},
{
"en": "Document",
"wo": "Kayit",
"fr": "Document"
},
{
"en": "Signature",
"wo": "Sinatiir",
"fr": "Signature"
},
{
"en": "Fee",
"wo": "Fere",
"fr": "Frais"
},
{
"en": "Appointment",
"wo": "Randevu",
"fr": "Rendez-vous"
},
{
"en": "Visa",
"wo": "Wisa",
"fr": "Visa"
},
{
"en": "Queue",
"wo": "Rang",
"fr": "File d'attente"
},
{
"en": "Stamp",
"wo": "Tampon",
"fr": "Tampon"
},
{
"en": "Request",
"wo": "Demaand",
"fr": "Demande"
}
]
},
{
"id": "banque",
"title": "Banque & argent",
"words": [
{
"en": "Money",
"wo": "Xaalis",
"fr": "Argent"
},
{
"en": "Bank",
"wo": "Bànk",
"fr": "Banque"
},
{
"en": "Account",
"wo": "Kompt",
"fr": "Compte"
},
{
"en": "Cash",
"wo": "Xaalis ci loxo",
"fr": "Espèces"
},
{
"en": "Send money",
"wo": "Yónnee xaalis",
"fr": "Envoyer de l'argent"
},
{
"en": "Withdraw",
"wo": "Génne xaalis",
"fr": "Retirer"
},
{
"en": "Deposit",
"wo": "Dugal xaalis",
"fr": "Déposer"
},
{
"en": "Balance",
"wo": "Sold",
"fr": "Solde"
},
{
"en": "Loan",
"wo": "Leb",
"fr": "Prêt"
},
{
"en": "Savings",
"wo": "Denc xaalis",
"fr": "Épargne"
},
{
"en": "To pay",
"wo": "Fay",
"fr": "Payer"
},
{
"en": "Receipt",
"wo": "Reesi",
"fr": "Reçu"
}
]
}
];
  try {
    if (typeof WOLOF_THEMES === "undefined") return;
    NOUVEAUX.forEach(function (n) {
      if (WOLOF_THEMES.some(function (t) { return t.id === n.id; })) return;
      WOLOF_THEMES.push(n);
    });
    if (typeof LEXICON !== "undefined") {
      var deja = {};
      LEXICON.forEach(function (w) { deja[w.cat + "|" + w.en + "|" + w.wo] = 1; });
      NOUVEAUX.forEach(function (t) { t.words.forEach(function (w) { if (!deja[t.id + "|" + w.en + "|" + w.wo]) LEXICON.push({ cat: t.id, en: w.en, wo: w.wo, fr: w.fr, audio: null }); }); });
    }
  } catch (e) { console.warn("[diisoo] wolof-plus", e); }
})();
