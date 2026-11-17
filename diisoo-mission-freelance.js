/* diisoo-mission-freelance.js v1 : Mission « Négocier avec un client »
   L'app joue un client étranger (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Freelance ».
   Bouton place en haut du theme « Freelance & travail en ligne » (Anglais). Essai : https://diisoo.sn/?mission=freelance */
(function () {
  "use strict";
  if (window.DiisooMissionFreelance) return;
  var Q = [
    { q: "Hello. I saw your portfolio. Can you design a website for my shop?", kw: /yes|sure|of course|website|design|shop|pages|can|need|portfolio/i, m: "Yes, of course. How many pages do you need?" },
    { q: "I need five pages. How long will it take?", kw: /day|days|week|weeks|ten|five|seven|time|take|about|\d/i, m: "It will take about ten days." },
    { q: "How much will it cost?", kw: /dollars|\d|hundred|price|cost|francs|euro|thousand/i, m: "It will cost three hundred dollars." },
    { q: "Can I pay half now and half at the end?", kw: /yes|no|half|contract|invoice|ok|okay|sure|pay|deposit|payment/i, m: "Yes, I will send you the contract and my invoice." },
    { q: "Great. When can you send me the first draft?", kw: /tomorrow|monday|friday|week|days|day|evening|tonight|next|draft|send|\d/i, m: "I will send you the first draft in three days." }
  ];




  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mfl{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mfl .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mfl .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mfl .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mfl button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mfl .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mfl .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mfl .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mfl .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mfl .m.on{animation:mfp 1s infinite}@keyframes mfp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mfl .ok{color:#25D366}#mfl .or{color:#FFAA3C}" +
    "#mfl-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mfl-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mfl")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mfl";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">💻 Négocier avec un client · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mf-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mf-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mf-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mf-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mf-skip" type="button">Passer</button>' +
        '<button class="b3" id="mf-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mf-r"), mic = document.getElementById("mf-mic"), nx = document.getElementById("mf-next");
      document.getElementById("mf-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mf-x").onclick = function () { o.remove(); };
      document.getElementById("mf-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
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
        try { if (typeof BADGES !== "undefined" && !BADGES["freelance"]) BADGES["freelance"] = { icon: "💻", label: "Freelance", desc: "Négociation avec un client étranger réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("freelance"); } catch (e) {}
      }
      noter("mission_freelance", score + "/" + Q.length);
      o.innerHTML = '<div class="k">💻 Mission freelance</div><div class="q">' + (ok ? "Contrat signé ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Freelance » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Famille et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mf-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mf-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mf-x2" type="button">Fermer</button>';
      document.getElementById("mf-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mf-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mf-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma négociation avec un client en anglais sur Diisoo 💻 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComflnent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mfl-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "freelance") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mfl-btn";
    b.innerHTML = '<span style="font-size:22px">💻</span><span>Mission : négocier avec un client<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionFreelance = { ouvrir: ouvrir };
  if (/[?&]mission=freelance/.test(location.search)) setTimeout(ouvrir, 3000);
})();
