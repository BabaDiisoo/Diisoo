/* diisoo-mission-logement.js v1 : Mission « Visiter une maison »
   L'app joue le propriétaire (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Chez moi ».
   Bouton place en haut du theme « Logement » (Anglais). Essai : https://diisoo.sn/?mission=logement */
(function () {
  "use strict";
  if (window.DiisooMissionLogement) return;
  var Q = [
    { q: "Hello. What kind of house are you looking for?", kw: /house|flat|apartment|room|small|big|looking|need|want|like/i, m: "I am looking for a small house." },
    { q: "How many bedrooms do you need?", kw: /one|two|three|four|bedroom|bedrooms|room|rooms|need|\d/i, m: "I need two bedrooms." },
    { q: "What is your budget per month?", kw: /thousand|francs|budget|pay|\d|fifty|forty|sixty|thirty|hundred/i, m: "My budget is fifty thousand francs." },
    { q: "Do you want a furnished house?", kw: /yes|no|furnished|bed|table|please|not|want/i, m: "No, I do not need furniture." },
    { q: "When do you want to move in?", kw: /next|week|month|today|tomorrow|monday|soon|now|january|february|march|move|day/i, m: "I want to move in next month." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mlg{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mlg .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mlg .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mlg .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mlg button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mlg .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mlg .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mlg .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mlg .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mlg .m.on{animation:mlq 1s infinite}@keyframes mlq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mlg .ok{color:#25D366}#mlg .or{color:#FFAA3C}" +
    "#ml-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#ml-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mlg")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mlg";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🏠 Logement · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="ml-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="ml-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="ml-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="ml-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="ml-skip" type="button">Passer</button>' +
        '<button class="b3" id="ml-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("ml-r"), mic = document.getElementById("ml-mic"), nx = document.getElementById("ml-next");
      document.getElementById("ml-ec").onclick = function () { parler(cur.q); };
      document.getElementById("ml-x").onclick = function () { o.remove(); };
      document.getElementById("ml-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["chez-moi"]) BADGES["chez-moi"] = { icon: "🏠", label: "Chez moi", desc: "Visite de maison réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("chez-moi"); } catch (e) {}
      }
      noter("mission_logement", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🏠 Mission logement</div><div class="q">' + (ok ? "Bienvenue chez vous ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Chez moi » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Logement et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="ml-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="ml-re" type="button">Réessayer</button>') +
        '<button class="b3" id="ml-x2" type="button">Fermer</button>';
      document.getElementById("ml-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("ml-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("ml-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma visite de maison en anglais sur Diisoo 🏠 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("ml-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "housing") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "ml-btn";
    b.innerHTML = '<span style="font-size:22px">🏠</span><span>Mission : visiter une maison<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionLogement = { ouvrir: ouvrir };
  if (/[?&]mission=logement/.test(location.search)) setTimeout(ouvrir, 3000);
})();
