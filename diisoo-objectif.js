/* diisoo-objectif.js v1 : un objectif personnel qu'on peut toucher du doigt
   - Apres le premier exercice, une fiche demande : ton but (visa, business, tourisme, wolof), ton rythme (3, 5 ou 10 exercices par jour), ta duree (30, 60 ou 90 jours)
   - Le tableau de bord montre : exercices du jour, jour X sur N, et le but choisi
   - Rappel quotidien : un fichier calendrier (.ics) qui sonne chaque jour a l'heure choisie, meme si l'app est fermee
   - A l'ouverture de l'app, si l'objectif du jour n'est pas fini, un message le rappelle */
(function () {
  "use strict";

  var CLE = "diisoo_obj";
  var BUTS = [
    ["visa", "🛂", "Visa et examen"],
    ["business", "💼", "Business et commerce"],
    ["tourisme", "🏝️", "Tourisme"],
    ["wolof", "🗣️", "Parler wolof"]
  ];
  var RYTHMES = [[3, "Doux", "3 par jour"], [5, "Régulier", "5 par jour"], [10, "Intense", "10 par jour"]];
  var DUREES = [30, 60, 90];

  function $(id) { return document.getElementById(id); }
  function lire() { try { return JSON.parse(localStorage.getItem(CLE) || "null"); } catch (e) { return null; } }
  function ecrire(o) { try { localStorage.setItem(CLE, JSON.stringify(o)); } catch (e) {} }
  function aujourd() { return new Date().toISOString().slice(0, 10); }
  function jours(a, b) { return Math.floor((new Date(b) - new Date(a)) / 86400000); }
  function cible() { var o = lire(); return (o && o.rythme) || (typeof DAILY_TARGET !== "undefined" ? DAILY_TARGET : 5); }
  function nomBut(o) { var x = BUTS.filter(function (b) { return b[0] === (o && o.but); })[0]; return x ? x[1] + " " + x[2] : ""; }

  /* ---------- tableau de bord ---------- */
  function rendre() {
    var el = $("daily-goal");
    if (!el) return;
    var g = typeof getDailyGoal === "function" ? getDailyGoal() : { done: 0 };
    var T = cible(), done = Math.min(g.done, T), o = lire();
    var h = '<div class="flex justify-between items-center text-[11px] text-[#A69C86] mb-1"><span>🎯 Objectif du jour</span><span class="flex items-center"><span id="slot-save"></span>' + done + "/" + T + "</span></div>" +
      '<div class="w-full bg-[#141A2B] h-1.5 rounded-full overflow-hidden"><div class="bg-[#3FAE74] h-full transition-all" style="width:' + Math.round(done / T * 100) + '%"></div></div>';
    if (o && o.debut) {
      var j = Math.min(o.duree, jours(o.debut, aujourd()) + 1);
      h += '<div class="flex justify-between text-[10px] text-[#8C8064] mt-1"><span>' + nomBut(o) + "</span><span>Jour " + j + " sur " + o.duree + "</span></div>";
      h += '<div class="w-full bg-[#141A2B] h-1 rounded-full overflow-hidden mt-1"><div class="bg-[#E1693F] h-full" style="width:' + Math.round(j / o.duree * 100) + '%"></div></div>';
      h += '<button type="button" id="obj-modif" class="mt-1 text-[10px] text-[#A69C86] underline">Changer mon objectif ou mon rappel</button>';
    }
    el.innerHTML = h;
    var m = $("obj-modif"); if (m) m.onclick = function () { fiche(true); };
    if (window.montrerSauvegarde) { try { window.montrerSauvegarde(); } catch (e) {} }
  }
  window.renderDailyGoal = rendre;
  window.bumpDailyGoal = function (n) {
    var g = getDailyGoal(), T = cible(), avant = g.done >= T;
    g.done += n; store.set("diisoo_goal", g);
    rendre();
    if (!avant && g.done >= T) { try { toast("🎯 Objectif du jour atteint ! Reviens demain pour continuer ta série."); } catch (e) {} }
    setTimeout(proposer, 1500);
  };

  /* ---------- fiche : but, rythme, duree, rappel ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#dii-obj{position:fixed;inset:0;z-index:9990;background:rgba(5,8,16,.86);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-obj .ob-box{width:100%;max-width:480px;max-height:94vh;overflow-y:auto;background:#0B0F1C;border:1px solid #1E2740;" +
    "border-radius:22px 22px 0 0;padding:18px 16px 24px;color:#F6F1E7}" +
    "#dii-obj h3{font-size:18px;font-weight:800;text-align:center;margin:0 0 4px}" +
    "#dii-obj .ob-sub{text-align:center;font-size:12px;color:#A69C86;margin:0 0 12px}" +
    "#dii-obj .ob-q{font-size:12px;font-weight:700;color:#C9BFA8;margin:12px 0 6px}" +
    "#dii-obj .ob-g{display:grid;gap:8px}" +
    "#dii-obj .ob-g.c2{grid-template-columns:1fr 1fr}#dii-obj .ob-g.c3{grid-template-columns:1fr 1fr 1fr}" +
    "#dii-obj .ob-c{min-height:56px;padding:8px;border-radius:14px;background:#141A2B;border:2px solid #1E2740;color:#F6F1E7;font-size:13px;font-weight:700;text-align:center}" +
    "#dii-obj .ob-c small{display:block;font-size:11px;font-weight:400;color:#A69C86}" +
    "#dii-obj .ob-c.on{border-color:#25D366;background:#12351F}" +
    "#dii-obj .ob-ok{width:100%;min-height:56px;margin-top:16px;border-radius:999px;border:0;background:#25D366;color:#fff;font-size:16px;font-weight:800}" +
    "#dii-obj .ob-no{width:100%;min-height:44px;margin-top:8px;background:none;border:0;color:#A69C86;font-size:13px}" +
    "#dii-obj input[type=time]{width:100%;min-height:48px;border-radius:14px;background:#141A2B;border:2px solid #1E2740;color:#F6F1E7;font-size:18px;text-align:center}";
  document.head.appendChild(st);

  function fiche(modif) {
    if ($("dii-obj")) return;
    var o = lire() || { but: "visa", rythme: 5, duree: 30, heure: "18:00" };
    var ov = document.createElement("div"); ov.id = "dii-obj";
    var b = '<div class="ob-box"><h3>🎯 Fixe ton objectif</h3><p class="ob-sub">Un but clair, un rythme, une date. Tu avances chaque jour.</p>';
    b += '<p class="ob-q">1. Pourquoi tu apprends ?</p><div class="ob-g c2" data-k="but">';
    BUTS.forEach(function (x) { b += '<button type="button" class="ob-c' + (o.but === x[0] ? " on" : "") + '" data-v="' + x[0] + '">' + x[1] + "<br>" + x[2] + "</button>"; });
    b += '</div><p class="ob-q">2. Combien d\'exercices par jour ?</p><div class="ob-g c3" data-k="rythme">';
    RYTHMES.forEach(function (x) { b += '<button type="button" class="ob-c' + (o.rythme === x[0] ? " on" : "") + '" data-v="' + x[0] + '">' + x[1] + "<small>" + x[2] + "</small></button>"; });
    b += '</div><p class="ob-q">3. En combien de jours ?</p><div class="ob-g c3" data-k="duree">';
    DUREES.forEach(function (x) { b += '<button type="button" class="ob-c' + (o.duree === x ? " on" : "") + '" data-v="' + x + '">' + x + "<small>jours</small></button>"; });
    b += '</div><p class="ob-q">4. Rappel chaque jour (sonne même si l\'app est fermée)</p><input type="time" id="ob-heure" value="' + (o.heure || "18:00") + '">';
    b += '<button type="button" class="ob-ok" id="ob-valider">✅ Valider mon objectif</button>';
    b += '<button type="button" class="ob-no" id="ob-plus">' + (modif ? "Fermer" : "Plus tard") + "</button></div>";
    ov.innerHTML = b;
    document.body.appendChild(ov);
    Array.prototype.forEach.call(ov.querySelectorAll(".ob-g"), function (g) {
      var k = g.getAttribute("data-k");
      Array.prototype.forEach.call(g.children, function (c) {
        c.onclick = function () {
          Array.prototype.forEach.call(g.children, function (x) { x.classList.remove("on"); });
          c.classList.add("on");
          var v = c.getAttribute("data-v"); o[k] = k === "but" ? v : +v;
        };
      });
    });
    $("ob-plus").onclick = function () {
      ov.remove();
      if (!modif) { try { localStorage.setItem("diisoo_obj_plus", aujourd()); } catch (e) {} }
    };
    $("ob-valider").onclick = function () {
      o.heure = $("ob-heure").value || "18:00";
      o.debut = (lire() && lire().debut) || aujourd();
      ecrire(o);
      ov.remove();
      rendre();
      var repli = function () {
        telechargerRappel(o);
        try { toast("🎯 Objectif enregistré. Ouvre le fichier pour activer ton rappel."); } catch (e) {}
      };
      if (window.DiisooRappel && window.DiisooRappel.ok()) {
        window.DiisooRappel.activer(o).then(function (bon) {
          if (bon) { try { toast("🔔 Rappel activé chaque jour à " + o.heure); } catch (e) {} } else repli();
        });
      } else repli();
    };
  }

  /* ---------- rappel : fichier calendrier quotidien ---------- */
  function telechargerRappel(o) {
    try {
      var h = (o.heure || "18:00").split(":"), d = new Date();
      var pad = function (n) { return (n < 10 ? "0" : "") + n; };
      var jour = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
      var ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Diisoo//FR", "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT", "UID:diisoo-rappel-quotidien@diisoo.sn", "DTSTAMP:" + jour + "T000000Z",
        "DTSTART:" + jour + "T" + pad(+h[0]) + pad(+h[1]) + "00",
        "DTEND:" + jour + "T" + pad(+h[0]) + pad(+h[1] + 10 > 59 ? 59 : +h[1] + 10) + "00",
        "RRULE:FREQ=DAILY;COUNT=" + (o.duree || 30),
        "SUMMARY:Diisoo : " + (o.rythme || 5) + " exercices aujourd'hui",
        "DESCRIPTION:Ouvre https://diisoo.sn et fais ton objectif du jour. Une série à ne pas casser !",
        "URL:https://diisoo.sn/",
        "BEGIN:VALARM", "TRIGGER:PT0M", "ACTION:DISPLAY", "DESCRIPTION:Diisoo : ton objectif du jour t'attend", "END:VALARM",
        "END:VEVENT", "END:VCALENDAR"
      ].join("\r\n");
      var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "rappel-diisoo.ics";
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    } catch (e) {}
  }

  /* ---------- quand proposer la fiche, et le rappel a l'ouverture ---------- */
  function ecran() { var e = $("screen-dashboard"); return !!(e && e.offsetParent !== null); }
  function proposer() {
    if (lire() || !ecran()) return;
    var g = typeof getDailyGoal === "function" ? getDailyGoal() : { done: 0 };
    var plus = ""; try { plus = localStorage.getItem("diisoo_obj_plus") || ""; } catch (e) {}
    if (g.done >= 1 && plus !== aujourd()) fiche(false);
  }
  setInterval(function () { if (ecran()) proposer(); }, 4000);

  var rappele = false;
  setTimeout(function () {
    var o = lire();
    if (rappele || !o || !ecran()) return;
    var g = getDailyGoal();
    if (g.done < cible()) {
      rappele = true;
      try { toast("🎯 Il te reste " + (cible() - g.done) + " exercice" + (cible() - g.done > 1 ? "s" : "") + " pour ton objectif du jour."); } catch (e) {}
    }
  }, 6000);

  rendre();
  window.DiisooObjectif = { version: 1, fiche: fiche, cible: cible };
})();
