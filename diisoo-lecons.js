/* diisoo-lecons.js
 * Leçons d'anglais générales : affiche la prononciation simplifiée sous chaque phrase
 * et ajoute un bouton « Coach » (écouter, répéter, se réécouter) sous chaque carte.
 * Dépend de diisoo-coach.js (à charger avant). Ne modifie aucun autre fichier.
 * La prononciation simplifiée est une AIDE (écriture pour francophones). Prélecture à valider.
 */
(function () {
  "use strict";
  if (window.__diisooLecons) return;
  window.__diisooLecons = true;

  var PRON_EN = {"Left":"Lèft","Right":"Raït","Straight ahead":"Stréït ahèd","Street":"Strît","Near":"Nir","Far":"Far","Excuse me, where is the market?":"Èkskiouz mi, wèr iz zi markit ?","Turn left":"Teurn lèft","Room":"Roum","Key":"Kî","Night":"Naït","Breakfast":"Brèkfast","I have a reservation":"Aï hav a rézeurvéïchen","Do you have a free room?":"Dou you hav a frî roum ?","How much is it per night?":"Haou meutch iz it peur naït ?","Is breakfast included?":"Iz brèkfast inklioudid ?","Experience":"Ekspirièns","Skills":"Skilz","Salary":"Saleuri","Tell me about yourself":"Tèl mi abaout yorsèlf","I have five years of experience":"Aï hav faïv yeurz ov ekspirièns","Why do you want this job?":"Waï dou you wont ziss djob ?","I can start next month":"Aï kan start nèkst meunth","I am reliable":"Aï am rilaïabel","Company":"Keumpani","Customer":"Keustomeur","Product":"Prodakt","Catalogue":"Katalog","I run a small business in Thiès":"Aï reun a smol biznis in Tiès","We sell and export local products":"Wi sèl and èksport lôkal prodakts","We are looking for a reliable partner":"Wi ar loukinng for a rilaïabel partneur","Can I send you our catalogue?":"Kan aï sènd you aour katalog ?","Order":"Ordeur","Quantity":"Kouantiti","Delivery":"Dilivri","Invoice":"Inn-voïss","I want to place an order":"Aï wont tou pléïss an ordeur","How many pieces do you need?":"Haou mèni pîssiz dou you nîd ?","When will the goods arrive?":"Wèn wil zi goudz araïv ?","Can you send me the invoice?":"Kan you sènd mi zi inn-voïss ?","My name is...": "Maï néïm iz...","I am from Senegal": "Aï am frome Sénégal","Nice to meet you": "Naïce tou mîte you","I am a student": "Aï am a stioudent","How old are you?": "Haou ôld ar you ?","I am thirty years old": "Aï am theurti yeurz ôld","Where do you live?": "Wèr dou you liv ?","I live in Thiès": "Aï liv in Tiès","What do you do for a living?": "Wot dou you dou for a livinng ?","I speak English and French": "Aï spîk Inngliche and Frènntch","Can you spell your name?": "Kan you spèl yor néïm ?","F-A-T-O-U": "Èf-Eï-Ti-Ô-You","Family": "Fameli","Father": "Fa-zeur","Mother": "Meu-zeur","Brother": "Breu-zeur","Sister": "Sisteur","I have three children": "Aï hav thri tchildren","My mother lives with us": "Maï meu-zeur livz wiz eus","We eat together every evening": "Wi ît tou-guè-zeur èvri îvninng","My father is a driver": "Maï fa-zeur iz a draïveur","I love my family very much": "Aï leuv maï fameli vèri meutch","Who is the oldest in your family?": "Hou iz zi ôldist in yor fameli ?","My grandmother is the oldest": "Maï grandmeu-zeur iz zi ôldist","Work": "Weurk","Job": "Djob","Every day": "Èvri déï","Busy": "Bizi","Colleague": "Kolîg","I start work at eight o'clock": "Aï start weurk at éït o-klok","I finish work at five o'clock": "Aï finiche weurk at faïv o-klok","I work in an office": "Aï weurk in an offiss","My job is difficult but interesting": "Maï djob iz difikeult beut intrestinng","I am looking for a new job": "Aï am loukinng for a niou djob","I like helping customers": "Aï laïk hèlpinng keustomeurz","I take a short break at noon": "Aï téïk a chort bréïk at noun","Market": "Markit","Price": "Praïce","Money": "Meuni","Buy": "Baï","Cheap": "Tchîp","How much does it cost?": "Haou meutch deuz it kost ?","That is too expensive": "Zat iz tou ekspènnsiv","Can you make it cheaper?": "Kan you méïk it tchîpeur ?","I would like to buy some rice": "Aï woud laïk tou baï seum raïce","Do you accept mobile money?": "Dou you aksèpt môbaïl meuni ?","How much are the tomatoes?": "Haou meutch ar zi tomêtôz ?","Could you give me a discount?": "Koud you guiv mi a diskaount ?","Airport": "Èrport","Ticket": "Tikit","Passport": "Passport","Flight": "Flaït","Bus": "Beuss","I would like to book a ticket": "Aï woud laïk tou bouk a tikit","What time does the bus leave?": "Wot taïm deuz zi beuss lîv ?","Where is the nearest bus stop?": "Wèr iz zi nirist beuss stop ?","I am traveling to visit my family": "Aï am travelinng tou vizit maï fameli","Do I need a visa for this country?": "Dou aï nîd a vîza for ziss keuntri ?","How do you get to work?": "Haou dou you guét tou weurk ?","I take the bus every morning": "Aï téïk zi beuss èvri morninng","Doctor": "Doktor","Hospital": "Hospitel","Sick": "Sik","Medicine": "Médsin","Help": "Hèlp","I have a headache": "Aï hav a hèdéïk","I need to see a doctor": "Aï nîd tou sî a doktor","Where is the nearest hospital?": "Wèr iz zi nirist hospitel ?","I feel better today": "Aï fîl bèteur toudéï","Please call an ambulance": "Plîz kol an ambioulenss","Take one tablet twice a day": "Téïk wan tablèt twaïce a déï","Since when do you feel sick?": "Sinss wèn dou you fîl sik ?","Restaurant": "Rèstorant","Menu": "Mènniou","Water": "Wotteur","Delicious": "Dilichess","Bill": "Bil","I am hungry": "Aï am heunngri","What do you recommend?": "Wot dou you rékomènd ?","I would like some rice and fish": "Aï woud laïk seum raïce and fiche","This meal is very tasty": "Ziss mîl iz vèri téïsti","Can I have the bill, please?": "Kan aï hav zi bil, plîz ?","What is your favourite dish?": "Wot iz yor féïvorit diche ?","I like thieboudienne": "Aï laïk tiébou-diène","Today": "Toudéï","Tomorrow": "Toumorô","Yesterday": "Yèsteurdéï","Number": "Neumbeur","Time": "Taïm","What time is it now?": "Wot taïm iz it naou ?","I will see you tomorrow morning": "Aï wil sî you toumorô morninng","The meeting starts at ten o'clock": "Zi mîtinng starts at tèn o-klok","I was busy yesterday": "Aï woz bizi yèsteurdéï","How many people are coming?": "Haou mèni pîpel ar keuminng ?","What time do you wake up?": "Wot taïm dou you wéïk eup ?","I wake up at six every morning": "Aï wéïk eup at siks èvri morninng","Visa application": "Vîza aplikéïchen","Purpose of visit": "Peurpeuss ov vizit","I am visiting my family": "Aï am vizitinng maï fameli","Return ticket": "Ritèrn tikit","How long will you stay?": "Haou lonng wil you stéï ?","I will stay for two weeks": "Aï wil stéï for tou wîks","Who is paying for your trip?": "Hou iz péïinng for yor trip ?","I am paying for myself": "Aï am péïinng for maïsèlf","Do you have accommodation booked?": "Dou you hav akomodéïchen boukt ?","I am looking for an apartment": "Aï am loukinng for an apartment","How much is the rent?": "Haou meutch iz zi rènt ?","Is the deposit included?": "Iz zi dipozit inklioudid ?","Landlord": "Lanndlord","Tenant": "Ténnant","The electricity is not working": "Zi ilèktrissiti iz not weurkinng","Can I visit the house?": "Kan aï vizit zi haouss ?","How many rooms are there?": "Haou mèni roumz ar zèr ?","I need to sign the lease": "Aï nîd tou saïn zi lîss","The neighbourhood is quiet": "Zi néïbeur-houd iz kouaïet","Seeds": "Sîdz","Fertilizer": "Feurtilaïzeur","Field": "Fîld","Harvest": "Harvist","Farmer": "Farmeur","I need seeds for my field": "Aï nîd sîdz for maï fîld","How much is a bag of fertilizer?": "Haou meutch iz a bag ov feurtilaïzeur ?","Do these seeds grow well in the rainy season?": "Dou zîz sîdz grô wèl in zi réïni sîzen ?","I water my crops every morning": "Aï wotteur maï krops èvri morninng","The harvest was good this year": "Zi harvist woz goud ziss yir","I sell my vegetables at the Thiès market": "Aï sèl maï vèdjtabelz at zi Tiès markit","Can you deliver to my farm?": "Kan you délivèr tou maï farm ?"};

  function theme() { try { return typeof currentGeneralTheme === "function" ? currentGeneralTheme() : null; } catch (e) { return null; } }

  function ouvrirCoach(t, i) {
    var w = t.vocab[i];
    if (!w || !window.DiisooCoach) return;
    var suiv = t.vocab[i + 1] ? function () { ouvrirCoach(t, i + 1); } : null;
    window.DiisooCoach.ouvrir({ en: w.en, pron: PRON_EN[w.en] || "", wo: w.wo || "", fr: w.fr || "", suivant: suiv });
  }

  function enrichir() {
    if (!window.DiisooCoach) return;
    var t = theme();
    if (!t || !t.vocab) return;
    var btns = document.querySelectorAll('button[data-practice^="gen-l:"]');
    btns.forEach(function (b) {
      var parts = String(b.getAttribute("data-practice")).split(":");
      var i = parseInt(parts[2], 10);
      if (isNaN(i) || parts[1] !== t.id || !t.vocab[i]) return;
      var grille = b.parentElement, carte = grille && grille.parentElement;
      if (!carte || carte.getAttribute("data-dii-lecon") === "1") return;
      carte.setAttribute("data-dii-lecon", "1");
      var w = t.vocab[i];
      var p = PRON_EN[w.en];
      var titre = carte.querySelector("p");
      if (p && titre) {
        var l = document.createElement("p");
        l.className = "diisoo-pron-en";
        l.style.cssText = "font-size:12px;color:#F3A94E;margin-top:2px;";
        l.textContent = "Prononce : " + p;
        titre.parentNode.insertBefore(l, titre.nextSibling);
      }
      var c = document.createElement("button");
      c.type = "button";
      c.textContent = "🎓 Coach vocal";
      c.style.cssText = "width:100%;min-height:44px;border-radius:12px;border:1px solid #F3A94E;background:transparent;color:#F3A94E;font-weight:700;font-size:13px;";
      c.onclick = function () { ouvrirCoach(t, i); };
      grille.parentNode.insertBefore(c, grille.nextSibling);
    });
  }

  var plan = false;
  function planifier() {
    if (plan) return; plan = true;
    setTimeout(function () { plan = false; try { enrichir(); } catch (e) {} }, 250);
  }
  new MutationObserver(planifier).observe(document.body, { childList: true, subtree: true });
  planifier();
})();
