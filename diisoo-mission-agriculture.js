/* diisoo-mission-agriculture.js v1 : Mission « Au marché agricole »
   L'app joue l'acheteur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Beykat ».
   Bouton place en haut du theme « Agriculture » (Anglais). Essai : https://diisoo.sn/?mission=agriculture */
(function () {
  "use strict";
  if (window.DiisooMissionAgriculture) return;
  var Q = [
    { q: "Hello. What do you grow?", kw: /grow|millet|rice|tomato|onion|groundnut|vegetable|corn|maize|i/i, m: "I grow millet and groundnuts." },
    { q: "How much do you have this year?", kw: /ton|tons|kilo|kilos|sack|sacks|\d|two|three|ten|twenty|much/i, m: "I have two tons of millet." },
    { q: "What is your price per kilo?", kw: /franc|francs|hundred|thousand|\d|price|kilo|two|three|four|five/i, m: "My price is two hundred francs per kilo." },
    { q: "Can you deliver to the market?", kw: /yes|no|deliver|truck|bring|can|market|sure|please/i, m: "Yes, I can deliver with my truck." },
    { q: "When can you bring it?", kw: /monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next|week|today|day|morning|soon/i, m: "I can bring it on Saturday." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mgr{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mgr .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mgr .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mgr .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mgr button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mgr .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mgr .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mgr .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mgr .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mgr .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mgr .ok{color:#25D366}#mgr .or{color:#FFAA3C}" +
    "#mgr-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mgr-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mgr")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mgr";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🌾 Agriculture · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mgr-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mgr-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mgr-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mgr-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mgr-skip" type="button">Passer</button>' +
        '<button class="b3" id="mgr-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mgr-r"), mic = document.getElementById("mgr-mic"), nx = document.getElementById("mgr-next");
      document.getElementById("mgr-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mgr-x").onclick = function () { o.remove(); };
      document.getElementById("mgr-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
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
        try { if (typeof BADGES !== "undefined" && !BADGES["beykat"]) BADGES["beykat"] = { icon: "🌾", label: "Beykat", desc: "Vente de récolte réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("beykat"); } catch (e) {}
      }
      noter("mission_agriculture", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🌾 Mission agriculture</div><div class="q">' + (ok ? "Belle récolte ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Beykat » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Agriculture et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mgr-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mgr-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mgr-x2" type="button">Fermer</button>';
      document.getElementById("mgr-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mgr-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mgr-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma vente de récolte en anglais sur Diisoo 🌾 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
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
    if (!box || document.getElementById("mgr-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "agri") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mgr-btn";
    b.innerHTML = '<span style="font-size:22px">🌾</span><span>Mission : vendre ma récolte<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionAgriculture = { ouvrir: ouvrir };
  if (/[?&]mission=agriculture/.test(location.search)) setTimeout(ouvrir, 3000);
})();
