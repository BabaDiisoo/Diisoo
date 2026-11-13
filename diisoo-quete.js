/* diisoo-quete.js v1 : Quete du jour (3 missions) + coffre a recompense variable + mot du jour wolof/anglais */
(function () {
  "use strict";
  /* Mots du jour : [wolof, francais, anglais, phrase anglaise d'exemple] */
  var MOTS = [
    ["Jërëjëf", "merci", "thank you", "Thank you for your help."],
    ["Ndank", "doucement", "slowly", "Please speak slowly."],
    ["Xaalis", "argent", "money", "I need money for the ticket."],
    ["Jaay", "vendre", "to sell", "I sell clothes at the market."],
    ["Jënd", "acheter", "to buy", "I want to buy this bag."],
    ["Ndox", "eau", "water", "Can I have some water, please?"],
    ["Mburu", "pain", "bread", "I eat bread in the morning."],
    ["Ceeb", "riz", "rice", "We eat rice for lunch."],
    ["Nelaw", "dormir", "to sleep", "I go to sleep at ten."],
    ["Liggéey", "travailler", "to work", "I work in a travel agency."],
    ["Jàng", "apprendre, étudier", "to learn", "I learn English every day."],
    ["Dégg", "entendre, comprendre", "to hear", "I can't hear you."],
    ["Wax", "parler", "to speak", "Can you speak English?"],
    ["Xam", "savoir, connaître", "to know", "I know this city well."],
    ["Bëgg", "vouloir, aimer", "to want", "I want to visit France."],
    ["Baax", "bon", "good", "This is a good price."],
    ["Réew", "pays", "country", "I love my country."],
    ["Kër", "maison", "house", "My house is in Thiès."],
    ["Mbokk", "parent, proche", "relative", "I have a relative in Paris."],
    ["Xale", "enfant", "child", "My child goes to school."],
    ["Tay", "aujourd'hui", "today", "I am busy today."],
    ["Suba", "demain", "tomorrow", "I will call you tomorrow."],
    ["Démb", "hier", "yesterday", "I travelled yesterday."],
    ["Guddi", "nuit", "night", "The bus leaves at night."],
    ["Bés", "jour", "day", "Have a nice day."],
    ["Ñaata", "combien", "how much", "How much is this?"],
    ["Fan", "où", "where", "Where is the bank?"],
    ["Naka", "comment", "how", "How do you say this in English?"],
    ["Lan", "quoi, quel", "what", "What is your name?"],
    ["Waaw", "oui", "yes", "Yes, of course."],
    ["Déedéet", "non", "no", "No, thank you."],
    ["Teranga", "hospitalité", "hospitality", "Senegal is famous for its hospitality."],
    ["Njaay", "commerce", "trade, business", "My business is growing."],
    ["Tukki", "voyage", "trip, journey", "I am preparing my trip."],
    ["Bataaxal", "lettre, message", "letter", "I have a letter for you."],
    ["Paspoor", "passeport", "passport", "This is my passport."],
    ["Njaboot", "famille", "family", "My family lives in Senegal."],
    ["Liggéeykat", "travailleur", "worker", "He is a good worker."],
    ["Dem", "partir, aller", "to go", "I go to Dakar every week."]
  ];
  /* Phrases rares gagnees dans les coffres : [francais, anglais] */
  var RARES = [
    ["Pouvez-vous répéter, s'il vous plaît ?", "Could you repeat that, please?"],
    ["Je n'ai pas compris.", "I didn't catch that."],
    ["Parlez plus lentement, s'il vous plaît.", "Could you speak more slowly, please?"],
    ["Quel est votre meilleur prix ?", "What is your best price?"],
    ["Je reviendrai demain.", "I will come back tomorrow."],
    ["Enchanté de faire votre connaissance.", "Nice to meet you."],
    ["Où se trouve la gare routière ?", "Where is the bus station?"],
    ["Je voudrais réserver une chambre.", "I would like to book a room."],
    ["Combien de temps dure le voyage ?", "How long does the journey take?"],
    ["Je suis ici pour affaires.", "I am here on business."],
    ["Pouvez-vous m'aider ?", "Can you help me, please?"],
    ["Je cherche un hôtel pas cher.", "I am looking for a cheap hotel."]
  ];
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function jour(d) { var x = new Date(); x.setDate(x.getDate() + (d || 0)); return x.getFullYear() + "-" + ("0" + (x.getMonth() + 1)).slice(-2) + "-" + ("0" + x.getDate()).slice(-2); }
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function json(k, def) { try { var v = JSON.parse(lire(k) || "null"); return v == null ? def : v; } catch (e) { return def; } }
  function etat() {
    var e = json("diisoo_quete", {});
    if (e.date !== jour(0)) { e = { date: jour(0), mot: false, coffre: false, deb: false, rec: "" }; ecrire("diisoo_quete", JSON.stringify(e)); }
    return e;
  }
  function sauver(e) { ecrire("diisoo_quete", JSON.stringify(e)); }
  function idxMot() { var d = new Date(); var n = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 0, 1)) / 86400000); return ((n % MOTS.length) + MOTS.length) % MOTS.length; }
  function m1() { var g = json("diisoo_goal", {}); return g.date === jour(0) && (g.done || 0) >= 3; }
  function m2() { var q = json("diisoo_qj", {}); return q.last === jour(0); }
  function m3() { return !!etat().mot; }
  function faites() { return (m1() ? 1 : 0) + (m2() ? 1 : 0) + (m3() ? 1 : 0); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }
  function esc(s) { return String(s).replace(/</g, "&lt;"); }

  var st = document.createElement("style");
  st.textContent =
    "#dqq{order:3;display:flex;align-items:center;gap:10px;width:100%;min-height:54px;padding:6px 14px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;text-align:left}" +
    "#dqq .a{font-size:24px}#dqq .t{flex:1;font-size:14.5px;font-weight:800;line-height:1.2}#dqq .t small{display:block;font-size:12px;font-weight:600;color:#A69C86}" +
    "#dqq .p{display:flex;gap:4px}#dqq .p i{width:12px;height:12px;border-radius:50%;background:#2A3454;display:block}#dqq .p i.on{background:#25D366}" +
    "#dqq.pret{border-color:#FFAA3C;animation:dqqp 1.6s infinite}@keyframes dqqp{0%{box-shadow:0 0 0 0 rgba(255,170,60,.5)}100%{box-shadow:0 0 0 14px rgba(255,170,60,0)}}" +
    "#dqq.ouvert{border-color:#25D366}" +
    "#dqqo{position:fixed;inset:0;z-index:99992;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center;overflow:auto}" +
    "#dqqo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#dqqo .l{width:100%;max-width:330px;display:flex;flex-direction:column;gap:8px}" +
    "#dqqo .mi{display:flex;align-items:center;gap:10px;text-align:left;border:1px solid #2A3454;background:#141A2B;border-radius:14px;padding:10px 12px;font-size:15px;font-weight:700;min-height:48px}" +
    "#dqqo .mi.ok{border-color:#25D366}#dqqo .mi .c{font-size:20px}" +
    "#dqqo .w{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;max-width:330px;width:100%}" +
    "#dqqo .w b{display:block;font-size:30px;line-height:1.1}#dqqo .w span{display:block;font-size:15px;margin-top:4px;font-weight:700}" +
    "#dqqo .w em{display:block;font-style:normal;font-size:14px;margin-top:8px;color:#5a5f73}" +
    "#dqqo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:330px}" +
    "#dqqo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#dqqo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#dqqo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#dqqo .cf{font-size:84px;line-height:1}#dqqo .cf.sec{animation:dqqs .5s infinite alternate}@keyframes dqqs{0%{transform:rotate(-8deg)}100%{transform:rotate(8deg)}}" +
    "#dqqo .rec{font-size:19px;font-weight:800;line-height:1.3;max-width:320px}#dqqo .ok{color:#25D366}";
  document.head.appendChild(st);

  function majCarte() {
    var c = document.getElementById("dqq"); if (!c) return;
    var n = faites(), e = etat(), pret = n >= 3 && !e.coffre;
    c.className = pret ? "pret" : (e.coffre ? "ouvert" : "");
    var sous = e.coffre ? "Coffre ouvert, à demain !" : (pret ? "Ton coffre t'attend, ouvre-le" : (3 - n) + " mission" + (3 - n > 1 ? "s" : "") + " pour ouvrir le coffre");
    c.innerHTML = '<span class="a">' + (e.coffre ? "✅" : "🎁") + '</span><span class="t">Quête du jour<small>' + sous + '</small></span><span class="p"><i class="' + (m1() ? "on" : "") + '"></i><i class="' + (m2() ? "on" : "") + '"></i><i class="' + (m3() ? "on" : "") + '"></i></span>';
    if (pret && !e.deb) { e.deb = true; sauver(e); try { if (typeof toast === "function") toast("🎁 Coffre débloqué ! Ouvre-le depuis l'accueil."); } catch (x) {} noter("quete_coffre_pret"); }
  }

  function tirer() {
    var r = Math.random() * 100;
    if (r < 55) return { t: "xp", v: 15 };
    if (r < 80) return { t: "xp", v: 30 };
    if (r < 95) return { t: "phrase" };
    return { t: "gel" };
  }
  function appliquer(rw) {
    var txt = "";
    if (rw.t === "xp") {
      try { if (typeof addXP === "function") addXP(rw.v); } catch (e) {}
      txt = "<span class='ok'>+" + rw.v + " XP</span> ajoutés à ton niveau";
    } else if (rw.t === "gel") {
      var s = json("diisoo_streak", null);
      if (s && typeof s === "object") { s.gel = 1; ecrire("diisoo_streak", JSON.stringify(s)); }
      txt = "<span class='ok'>❄️ Gel de série</span> : un jour manqué sera pardonné";
    } else {
      var vus = json("diisoo_rares", []), libres = [];
      for (var i = 0; i < RARES.length; i++) if (vus.indexOf(i) < 0) libres.push(i);
      if (!libres.length) { try { if (typeof addXP === "function") addXP(30); } catch (e) {} rw = { t: "xp", v: 30 }; txt = "<span class='ok'>+30 XP</span> (tu as toutes les phrases rares !)"; }
      else {
        var k = libres[Math.floor(Math.random() * libres.length)]; vus.push(k); ecrire("diisoo_rares", JSON.stringify(vus));
        rw.k = k; txt = "<span class='ok'>💎 Phrase rare</span> (" + vus.length + "/" + RARES.length + ")<br>« " + esc(RARES[k][1]) + " »<br><small>" + esc(RARES[k][0]) + "</small>";
      }
    }
    return { rw: rw, txt: txt };
  }

  function ouvrir() {
    if (document.getElementById("dqqo")) return;
    var o = document.createElement("div"); o.id = "dqqo"; document.body.appendChild(o);
    function fermer() { o.remove(); majCarte(); }
    function vueMissions() {
      var e = etat(), n = faites(), mm = MOTS[idxMot()];
      o.innerHTML =
        '<div class="k">Quête du jour · ' + n + '/3</div>' +
        '<div class="l">' +
        '<div class="mi ' + (m1() ? "ok" : "") + '"><span class="c">' + (m1() ? "✅" : "📘") + '</span>Fais 3 exercices dans une leçon</div>' +
        '<div class="mi ' + (m2() ? "ok" : "") + '"><span class="c">' + (m2() ? "✅" : "🎙️") + '</span>Réponds à la question du jour</div>' +
        '<div class="mi ' + (m3() ? "ok" : "") + '"><span class="c">' + (m3() ? "✅" : "💡") + '</span>Apprends le mot du jour</div></div>' +
        '<div class="w"><b>' + esc(mm[0]) + '</b><span>' + esc(mm[1]) + ' = <u>' + esc(mm[2]) + '</u></span><em>' + esc(mm[3]) + '</em></div>' +
        '<button class="b2" id="dqq-ec" type="button">🔊 Écouter en anglais</button>' +
        (m3() ? "" : '<button class="b1" id="dqq-ok" type="button">J\'ai appris ce mot</button>') +
        ((n >= 3 && !e.coffre) ? '<button class="b1" id="dqq-cf" type="button">🎁 Ouvrir mon coffre</button>' : "") +
        '<button class="b3" id="dqq-x" type="button">Fermer</button>';
      document.getElementById("dqq-x").onclick = fermer;
      document.getElementById("dqq-ec").onclick = function () { parler(mm[2] + ". " + mm[3]); };
      var ok = document.getElementById("dqq-ok");
      if (ok) ok.onclick = function () {
        var e2 = etat(); e2.mot = true; sauver(e2);
        var ap = json("diisoo_mots", []); if (ap.indexOf(idxMot()) < 0) { ap.push(idxMot()); ecrire("diisoo_mots", JSON.stringify(ap)); }
        noter("quete_mot", mm[0]); vueMissions();
      };
      var cf = document.getElementById("dqq-cf");
      if (cf) cf.onclick = vueCoffre;
    }
    function vueCoffre() {
      var e = etat(); if (e.coffre) { vueMissions(); return; }
      o.innerHTML = '<div class="k">Ton coffre du jour</div><div class="cf sec">🎁</div><div class="rec">Ouverture...</div>';
      setTimeout(function () {
        var e3 = etat(); if (e3.coffre) { vueMissions(); return; }
        var res = appliquer(tirer()); e3.coffre = true; e3.rec = res.rw.t; sauver(e3);
        try { if (typeof celebrate === "function") celebrate(); } catch (x) {}
        var mots = json("diisoo_mots", []).length;
        o.innerHTML = '<div class="k">Récompense</div><div class="cf">' + (res.rw.t === "phrase" ? "💎" : (res.rw.t === "gel" ? "❄️" : "⭐")) + '</div>' +
          '<div class="rec">' + res.txt + '</div>' +
          (res.rw.t === "phrase" && res.rw.k != null ? '<button class="b2" id="dqq-ph" type="button">🔊 Écouter la phrase</button>' : "") +
          '<div class="k">Mots appris : ' + mots + '</div>' +
          '<button class="b1" id="dqq-sh" type="button">Partager sur WhatsApp</button>' +
          '<button class="b3" id="dqq-x" type="button">Fermer</button>';
        document.getElementById("dqq-x").onclick = fermer;
        var ph = document.getElementById("dqq-ph"); if (ph) ph.onclick = function () { parler(RARES[res.rw.k][1]); };
        document.getElementById("dqq-sh").onclick = function () {
          var t = "J'ai ouvert mon coffre du jour sur Diisoo. Apprends l'anglais et le wolof gratuitement : https://diisoo.sn/?source=whatsapp";
          noter("quete_partage");
          try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (x) {}
          window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
        };
        noter("quete_coffre_ouvert", res.rw.t); majCarte();
      }, 1100);
    }
    noter("quete_vue");
    if (faites() >= 3 && !etat().coffre) vueCoffre(); else vueMissions();
  }

  function monter() {
    var d = document.getElementById("screen-dashboard"); if (!d) return;
    if (document.getElementById("dqq")) return;
    var ref = document.getElementById("dqj") || document.getElementById("revision-card");
    if (!ref || !ref.parentNode) return;
    var b = document.createElement("button"); b.type = "button"; b.id = "dqq"; b.onclick = ouvrir;
    ref.parentNode.insertBefore(b, ref.nextSibling);
    majCarte();
  }
  var essais = 0;
  (function boucle() { try { monter(); } catch (e) {} if (++essais < 40) setTimeout(boucle, 750); })();
  try { new MutationObserver(function () { if (!document.getElementById("dqq")) { try { monter(); } catch (e) {} } }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  setInterval(function () { try { majCarte(); } catch (e) {} }, 3000);
  window.DiisooQuete = { ouvrir: ouvrir, faites: faites };
  if (/[?&]quete=1/.test(location.search)) setTimeout(ouvrir, 1200);
})();
