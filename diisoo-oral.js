/* diisoo-oral.js v1 : analyse d'une réponse orale (sans réseau, instantanée)
   window.DiisooOral.analyser(texte, question, opts) -> { corrections:[{avant,apres,note}], conseils:[texte], exemple }
   - corrections : fautes fréquentes des francophones en anglais (I am agree, since 3 years, she have...)
   - conseils : phrase complète, début de phrase attendu, oui/non, liens entre idées (because, and, but), nombre de questions posées
   Utilisé par diisoo-exams2.js après chaque réponse. Les règles se complètent ici, sans toucher au moteur. */
(function () {
  "use strict";

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  var IRR = { go: "goes", have: "has", do: "does", study: "studies", watch: "watches", pass: "passes", carry: "carries" };
  function troisieme(v) { return IRR[v] || (v + "s"); }

  /* [motif, remplacement (fonction), note en français] */
  var REGLES = [
    [/\b(i|we) am agree\b/i, function (m) { return m[1] + " agree"; }, "En anglais on dit « I agree », sans « am »."],
    [/\bi have (\d+) years?( old)?\b/i, function (m) { return "I am " + m[1] + " years old"; }, "L'âge se dit avec « to be » : « I am 25 years old »."],
    [/\bi am (\d{1,2})\b(?! years)/i, function (m) { return "I am " + m[1] + " years old"; }, "Pour l'âge, ajoute « years old »."],
    [/\b(he|she|it) (have)\b/i, function (m) { return m[1] + " has"; }, "À la 3e personne : he / she / it « has »."],
    [/\b(he|she) (go|do|like|live|work|come|want|need|eat|play|make|take|love|study|watch|speak|read)\b/i, function (m) { return m[1] + " " + troisieme(m[2].toLowerCase()); }, "À la 3e personne du singulier, le verbe prend un « s »."],
    [/\bpeoples\b/i, function () { return "people"; }, "« people » n'a pas de « s »."],
    [/\binformations\b/i, function () { return "information"; }, "« information » ne se met pas au pluriel."],
    [/\badvices\b/i, function () { return "advice"; }, "« advice » ne se met pas au pluriel."],
    [/\b(luggages|furnitures|moneys|homeworks)\b/i, function (m) { return m[1].slice(0, -1); }, "Ce mot ne se met pas au pluriel en anglais."],
    [/\bi am (go|come|work|live|eat|play|study)\b/i, function (m) { return "I " + m[1]; }, "Après « I am », mets « -ing » (« I am going ») ou utilise le présent simple (« I go »)."],
    [/\bsince (\d+|one|two|three|four|five|six|ten|a few) (years?|months?|weeks?|days?)\b/i, function (m) { return "for " + m[1] + " " + m[2]; }, "Pour une durée, on dit « for » ; « since » s'utilise avec une date."],
    [/\bcan to\b/i, function () { return "can"; }, "Après « can », pas de « to »."],
    [/\bmore better\b/i, function () { return "better"; }, "« better » suffit."],
    [/\bvery much (people|money|children|friends|food)\b/i, function (m) { return "a lot of " + m[1]; }, "Utilise « a lot of » avec un nom."],
    [/\bi want that you\b/i, function () { return "I want you to"; }, "On dit « I want you to… »."],
    [/\bmake (a )?sport\b/i, function () { return "do sport"; }, "On dit « do sport » ou « play sport »."],
    [/\bmake (my |the )?homework\b/i, function (m) { return "do " + (m[1] || "") + "homework"; }, "On dit « do homework »."],
    [/\bi live to\b/i, function () { return "I live in"; }, "On dit « I live in… »."],
    [/\bi am from in\b/i, function () { return "I am from"; }, "« from » suffit, sans « in »."],
    [/\bmy name ((?!is\b)[a-z]+)\b/i, function (m) { return "my name is " + m[1]; }, "N'oublie pas « is » : « My name is… »."],
    [/\bi have (hunger|thirst|cold)\b/i, function (m) { return "I am " + ({ hunger: "hungry", thirst: "thirsty", cold: "cold" })[m[1].toLowerCase()]; }, "Pour la faim, la soif et le froid, on utilise « to be »."],
    [/\bthe (people|life|love|nature) is\b/i, function (m) { return m[1].toLowerCase() === "people" ? "people are" : m[1].toLowerCase() + " is"; }, "On évite « the » devant un mot général."]
  ];

  /* début de phrase attendu selon la question */
  var DEBUTS = [
    [/what('?s| is) your name/i, /\bmy name\b|\bi am\b|\bi'm\b/i, "My name is …"],
    [/where are you from|where do you come from/i, /\bi am from\b|\bi'm from\b|\bi come from\b/i, "I am from …"],
    [/where do you live/i, /\bi live\b|\bi'm living\b|\bi am living\b/i, "I live in …"],
    [/how old are you/i, /\bi am\b|\bi'm\b/i, "I am … years old."],
    [/what do you do|what is your job|what's your job/i, /\bi am\b|\bi'm\b|\bi work\b/i, "I am a … / I work as a …"],
    [/what time/i, /\bat\b|\baround\b|\bo'clock\b|\b\d/i, "I … at seven o'clock."]
  ];
  var OUINON = /^(do|does|did|are|is|can|have|has|will|would|could)\b/i;

  var CONNECTEURS = /\b(because|and|but|so|also|then|after that|before|for example|when)\b/i;
  var DEBUT_QUESTION = /\b(what|where|when|who|why|how|do you|did you|are you|is it|can you|have you|would you|could you|does he|does she)\b/gi;
  var VERBES = /\b(am|is|are|was|were|have|has|had|like|likes|love|live|lives|work|works|go|goes|come|comes|eat|eats|play|plays|want|need|do|does|make|take|study|buy|drink|cook|read|watch|visit|get|help|see|use|call|speak|think|feel)\b/i;

  function mots(s) { return String(s || "").trim().split(/\s+/).filter(Boolean); }

  function analyser(texte, question, opts) {
    opts = opts || {};
    var t = String(texte || "").trim(), q = String(question || ""), out = { corrections: [], conseils: [], exemple: "" };
    if (!t) return out;
    var n = mots(t).length;

    REGLES.forEach(function (r) {
      var m = r[0].exec(t);
      if (m && out.corrections.length < 3) out.corrections.push({ avant: m[0], apres: r[1](m), note: r[2] });
    });

    if (!opts.court && !opts.libre) {
      var attendu = null;
      DEBUTS.forEach(function (d) { if (!attendu && d[0].test(q)) attendu = d; });
      if (attendu) {
        out.exemple = attendu[2];
        if (!attendu[1].test(t)) out.conseils.push("Commence par une phrase complète, par exemple : « " + attendu[2] + " »");
      } else if (OUINON.test(q) && !/\b(yes|no|sometimes|never|always|usually|of course|not really)\b/i.test(t)) {
        out.conseils.push("Pour une question en « Do / Are / Can… », commence par « Yes, I do. » ou « No, I don't. », puis explique.");
      }
      if (n < 4 && !out.conseils.length && !VERBES.test(t)) out.conseils.push("Réponds par une phrase complète (sujet + verbe), pas par un seul mot.");
    }

    if (opts.ask) {
      var qs = (t.match(DEBUT_QUESTION) || []).length;
      out.conseils.push(qs >= 3 ? "Bien : tu as posé environ " + qs + " questions." : "Il te faut poser 3 questions : j'en ai compté " + qs + ". Commence chacune par What, Where, Do you…");
    } else if (opts.duree >= 25 && n >= 25 && !CONNECTEURS.test(t)) {
      out.conseils.push("Relie tes idées avec « because », « and », « but » pour parler plus longtemps et plus naturellement.");
    } else if (opts.duree >= 20 && n < Math.round(opts.duree * 0.6) && !opts.court) {
      out.conseils.push("Ta réponse est courte : ajoute une raison (« because… ») ou un exemple (« for example… »).");
    }
    return out;
  }

  window.DiisooOral = { version: 1, analyser: analyser };
})();
