/* diisoo-examens-coach.js
 * Entraînement oral pour les examens (IELTS Life Skills A1, TOEFL, TOEIC, Cambridge, Duolingo, PTE).
 * Ajoute un bouton « Entraînement oral » sous la liste des tests : phrases modèles à écouter et répéter avec le coach.
 * Séparé du simulateur : aucun minuteur, aucune note, aucun test existant modifié.
 * Charger APRES diisoo-coach.js. Prononciation simplifiée : prélecture à valider.
 */
(function () {
  "use strict";
  if (window.__diisooExamCoach) return;
  window.__diisooExamCoach = true;

  var DATA = {"ielts": {"nom": "IELTS Life Skills A1", "p": [{"en": "My name is ___ and I come from Senegal.", "fr": "Je m'appelle ___ et je viens du Sénégal.", "pr": "Maï néïm iz ___ and aï keum from Sénégal"}, {"en": "I live in Thiès with my family.", "fr": "J'habite à Thiès avec ma famille.", "pr": "Aï liv in Tiès wiz maï fameli"}, {"en": "I work as a driver.", "fr": "Je travaille comme chauffeur.", "pr": "Aï weurk az a draïveur"}, {"en": "I like football and I like cooking.", "fr": "J'aime le football et la cuisine.", "pr": "Aï laïk foutbol and aï laïk koukinng"}, {"en": "In the picture I can see two people.", "fr": "Sur l'image, je vois deux personnes.", "pr": "In zi piktcheur aï kan sî tou pîpel"}, {"en": "They are happy and they are talking.", "fr": "Ils sont contents et ils parlent.", "pr": "Zéï ar hapi and zéï ar tokinng"}, {"en": "I think it is a good idea because it is cheap.", "fr": "Je pense que c'est une bonne idée parce que ce n'est pas cher.", "pr": "Aï thinnk it iz a goud aïdia bikoz it iz tchîp"}, {"en": "Could you repeat that, please?", "fr": "Pouvez-vous répéter, s'il vous plaît ?", "pr": "Koud you ripît zat, plîz ?"}]}, "toefl": {"nom": "TOEFL Speaking", "p": [{"en": "I prefer to study in the library because it is quiet.", "fr": "Je préfère étudier à la bibliothèque parce que c'est calme.", "pr": "Aï prifeur tou stoudi in zi laïbrèri bikoz it iz kouaïet"}, {"en": "For example, last week I studied there for three hours.", "fr": "Par exemple, la semaine dernière, j'y ai étudié trois heures.", "pr": "For ègzampel, last wîk aï steudid zèr for thri aourz"}, {"en": "In my opinion, group work is more useful.", "fr": "À mon avis, le travail en groupe est plus utile.", "pr": "In maï opinienn, groupe weurk iz mor iousfoul"}, {"en": "There are two reasons for my choice.", "fr": "Il y a deux raisons à mon choix.", "pr": "Zèr ar tou rîzenz for maï tchoïss"}, {"en": "First, it saves time. Second, it saves money.", "fr": "D'abord, cela fait gagner du temps. Ensuite, de l'argent.", "pr": "Feurst, it séïvz taïm. Sèkend, it séïvz meuni"}, {"en": "In the picture, the students are reading books.", "fr": "Sur l'image, les étudiants lisent des livres.", "pr": "In zi piktcheur, zi stioudents ar rîdinng bouks"}, {"en": "I agree with this statement because it is practical.", "fr": "Je suis d'accord avec cette affirmation parce que c'est pratique.", "pr": "Aï agrî wiz ziss stéïtment bikoz it iz praktikel"}, {"en": "To sum up, I believe this is the best option.", "fr": "En résumé, je pense que c'est la meilleure option.", "pr": "Tou seum eup, aï bilîv ziss iz zi bèst opchen"}]}, "toeic": {"nom": "TOEIC Speaking", "p": [{"en": "Hello, this is Baba from ABC Global.", "fr": "Bonjour, ici Baba de ABC Global.", "pr": "Hèlô, ziss iz Baba from Eï-Bî-Sî Glôbal"}, {"en": "I would like to confirm our meeting on Monday.", "fr": "Je voudrais confirmer notre réunion de lundi.", "pr": "Aï woud laïk tou konfeurm aour mîtinng on Meundéï"}, {"en": "Could you send me the report by Friday?", "fr": "Pouvez-vous m'envoyer le rapport avant vendredi ?", "pr": "Koud you sènd mi zi ripôrt baï Fraïdéï ?"}, {"en": "The shipment will arrive next week.", "fr": "L'expédition arrivera la semaine prochaine.", "pr": "Zi chipment wil araïv nèkst wîk"}, {"en": "I am sorry for the delay.", "fr": "Je suis désolé pour le retard.", "pr": "Aï am sori for zi diléï"}, {"en": "The office opens at eight and closes at five.", "fr": "Le bureau ouvre à huit heures et ferme à dix-sept heures.", "pr": "Zi offiss ôpenz at éït and klôziz at faïv"}, {"en": "Please let me know if you have any questions.", "fr": "N'hésitez pas à me le dire si vous avez des questions.", "pr": "Plîz lèt mi nô if you hav èni kouèschenz"}, {"en": "Thank you for your help.", "fr": "Merci pour votre aide.", "pr": "Thènk you for yor hèlp"}]}, "cambridge": {"nom": "Cambridge A2/B1 Speaking", "p": [{"en": "I would like to tell you about my last holiday.", "fr": "J'aimerais vous parler de mes dernières vacances.", "pr": "Aï woud laïk tou tèl you abaout maï last holidéï"}, {"en": "I went to Dakar with my friends.", "fr": "Je suis allé à Dakar avec mes amis.", "pr": "Aï wènt tou Dakar wiz maï frèndz"}, {"en": "We stayed in a small hotel near the beach.", "fr": "Nous avons logé dans un petit hôtel près de la plage.", "pr": "Wi stéïd in a smol hôtèl nir zi bîtch"}, {"en": "The weather was hot, but we had a great time.", "fr": "Il faisait chaud, mais nous avons passé un super moment.", "pr": "Zi wèzeur woz hot, beut wi had a gréït taïm"}, {"en": "I think the first photo is more interesting.", "fr": "Je trouve que la première photo est plus intéressante.", "pr": "Aï thinnk zi feurst fôtô iz mor intrestinng"}, {"en": "In the future, I would like to travel more.", "fr": "À l'avenir, j'aimerais voyager davantage.", "pr": "In zi fioutcheur, aï woud laïk tou travel mor"}, {"en": "What about you? What do you think?", "fr": "Et vous ? Qu'en pensez-vous ?", "pr": "Wot abaout you ? Wot dou you thinnk ?"}, {"en": "That is a good point, but I disagree.", "fr": "C'est un bon argument, mais je ne suis pas d'accord.", "pr": "Zat iz a goud poïnt, beut aï disagrî"}]}, "duolingo": {"nom": "Duolingo English Test", "p": [{"en": "I usually wake up early and drink tea.", "fr": "D'habitude, je me réveille tôt et je bois du thé.", "pr": "Aï ioujouali wéïk eup eurli and drinnk tî"}, {"en": "The picture shows a busy street market.", "fr": "L'image montre un marché de rue animé.", "pr": "Zi piktcheur chôz a bizi strît markit"}, {"en": "Many people are buying fruit and vegetables.", "fr": "Beaucoup de gens achètent des fruits et des légumes.", "pr": "Mèni pîpel ar baïinng frout and vèdjtabelz"}, {"en": "I would describe my hometown as small and friendly.", "fr": "Je décrirais ma ville natale comme petite et chaleureuse.", "pr": "Aï woud diskraïb maï homtaoun az smol and frèndli"}, {"en": "Technology has changed the way we communicate.", "fr": "La technologie a changé notre façon de communiquer.", "pr": "Tèknolodji haz tchéïndjd zi wéï wi komiounikéït"}, {"en": "I have been learning English for two years.", "fr": "J'apprends l'anglais depuis deux ans.", "pr": "Aï hav bîn leurninng Inngliche for tou yirz"}, {"en": "One advantage is that it saves time.", "fr": "Un avantage est que cela fait gagner du temps.", "pr": "Wan advantidj iz zat it séïvz taïm"}, {"en": "That is all I want to say about this topic.", "fr": "C'est tout ce que je veux dire sur ce sujet.", "pr": "Zat iz ol aï wont tou séï abaout ziss topik"}]}, "pte": {"nom": "PTE Academic Speaking", "p": [{"en": "The graph shows an increase in sales over five years.", "fr": "Le graphique montre une hausse des ventes sur cinq ans.", "pr": "Zi graf chôz an inkrîss in séïlz ôveur faïv yirz"}, {"en": "Overall, the trend is positive.", "fr": "Globalement, la tendance est positive.", "pr": "Ôveurol, zi trènd iz pozitiv"}, {"en": "The lecture was about climate change.", "fr": "Le cours portait sur le changement climatique.", "pr": "Zi lèktcheur woz abaout klaïmet tchéïndj"}, {"en": "According to the speaker, farmers need more support.", "fr": "Selon l'orateur, les agriculteurs ont besoin de plus de soutien.", "pr": "Akordinng tou zi spîkeur, farmeurz nîd mor seupôrt"}, {"en": "The main idea is that education creates opportunities.", "fr": "L'idée principale est que l'éducation crée des opportunités.", "pr": "Zi méïn aïdia iz zat èdioukéïchen kriéïts opeurtiounitiz"}, {"en": "In conclusion, we should invest in renewable energy.", "fr": "En conclusion, nous devrions investir dans les énergies renouvelables.", "pr": "In konklioujen, wi choud invèst in rinioueubel ènerdji"}, {"en": "Let me describe what I see in the image.", "fr": "Laissez-moi décrire ce que je vois sur l'image.", "pr": "Lèt mi diskraïb wot aï sî in zi imidj"}, {"en": "There are several people standing near a bus.", "fr": "Il y a plusieurs personnes debout près d'un bus.", "pr": "Zèr ar sèvral pîpel stanndinng nir a beuss"}]}};
  var ORDRE = ["ielts", "toefl", "toeic", "cambridge", "duolingo", "pte"];

  function courant() {
    try { var s = localStorage.getItem("diisoo_exam"); if (s && DATA[s]) return s; } catch (e) {}
    return "ielts";
  }
  function el(tag, css, txt) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; }

  function ouvrir() {
    if (!window.DiisooCoach) return;
    var ex = courant();
    var fond = el("div", "position:fixed;inset:0;z-index:99990;background:rgba(5,8,18,.94);display:flex;align-items:flex-end;justify-content:center;");
    var box = el("div", "width:100%;max-width:520px;max-height:92vh;overflow:auto;background:#121a2e;color:#f2f5ff;border-radius:22px 22px 0 0;padding:18px 16px 26px;font-family:inherit;");
    fond.appendChild(box); document.body.appendChild(fond);

    function lancer(liste, i) {
      var p = liste[i]; if (!p) return;
      window.DiisooCoach.ouvrir({
        en: p.en, pron: p.pr, fr: p.fr,
        suivant: liste[i + 1] ? function () { lancer(liste, i + 1); } : null
      });
    }
    function rendre() {
      box.innerHTML = "";
      box.appendChild(el("div", "font:700 20px inherit;margin-bottom:4px;", "🎓 Entraînement oral"));
      box.appendChild(el("div", "font-size:13px;color:#aab4d4;margin-bottom:12px;line-height:1.4;", "Phrases modèles à écouter et répéter avant le test. Ce n'est pas le test : pas de minuteur, pas de note."));
      var chips = el("div", "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;");
      ORDRE.forEach(function (k) {
        var on = k === ex;
        var b = el("button", "min-height:40px;padding:0 14px;border-radius:999px;border:1px solid " + (on ? "#E1693F" : "#2a3350") + ";background:" + (on ? "#C2542D" : "#0B0F1C") + ";color:" + (on ? "#fff" : "#A69C86") + ";font-weight:700;font-size:13px;", k === "ielts" ? "IELTS" : k.toUpperCase() === "TOEFL" || k === "toeic" || k === "pte" ? k.toUpperCase() : k.charAt(0).toUpperCase() + k.slice(1));
        b.type = "button";
        b.onclick = function () { ex = k; try { localStorage.setItem("diisoo_exam", k); } catch (e) {} rendre(); };
        chips.appendChild(b);
      });
      box.appendChild(chips);
      box.appendChild(el("div", "font-weight:700;margin-bottom:8px;", DATA[ex].nom));
      var liste = DATA[ex].p;
      liste.forEach(function (p, i) {
        var b = el("button", "display:block;width:100%;text-align:left;min-height:52px;margin-top:8px;padding:10px 14px;border-radius:14px;border:1px solid #2a3350;background:#141A2B;color:#f2f5ff;font-size:15px;line-height:1.35;");
        b.type = "button";
        b.appendChild(el("div", "font-weight:600;", p.en));
        b.appendChild(el("div", "font-size:12px;color:#F3A94E;margin-top:2px;", p.pr));
        b.onclick = function () { lancer(liste, i); };
        box.appendChild(b);
      });
      var f = el("button", "width:100%;min-height:52px;margin-top:14px;border:0;border-radius:14px;background:#2a3350;color:#fff;font-weight:600;font-size:16px;", "Fermer");
      f.type = "button"; f.onclick = function () { fond.remove(); };
      box.appendChild(f);
    }
    rendre();
  }

  function ajouter() {
    var box = document.getElementById("test-topic-buttons");
    if (!box || document.getElementById("dii-exam-train")) return;
    var b = el("button", "width:100%;min-height:48px;margin-top:10px;border-radius:12px;border:1px solid #F3A94E;background:transparent;color:#F3A94E;font-weight:700;font-size:14px;", "🎓 Entraînement oral (avant le test)");
    b.id = "dii-exam-train"; b.type = "button"; b.onclick = ouvrir;
    box.parentNode.insertBefore(b, box.nextSibling);
  }

  var plan = false;
  function planifier() {
    if (plan) return; plan = true;
    setTimeout(function () { plan = false; try { ajouter(); } catch (e) {} }, 250);
  }
  new MutationObserver(planifier).observe(document.body, { childList: true, subtree: true });
  planifier();
})();
