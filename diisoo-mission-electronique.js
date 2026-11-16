/* diisoo-mission-electronique.js v1 : Mission « Acheter mon téléphone »
   L'app joue le vendeur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Électronique ».
   Bouton place en haut du secteur « Téléphones & accessoires » (Business). Essai : https://diisoo.sn/?mission=electronique */
(function () {
  "use strict";
  if (window.DiisooMissionÉlectronique) return;
  var Q = [
    { q: "Hello. What phone are you looking for?", kw: /phone|samsung|iphone|tecno|infinix|looking|need|want|new|i/i, m: "I am looking for a new Samsung phone." },
    { q: "This one is new and original. Do you want to see it?", kw: /yes|see|show|please|original|check|look|ok|okay/i, m: "Yes, please show me. Is it original?" },
    { q: "It costs one hundred thousand francs.", kw: /lower|discount|price|expensive|cheaper|less|better|please|how much/i, m: "It is expensive. Can you lower the price?" },
    { q: "Okay, ninety thousand. Do you want a case and a charger?", kw: /yes|case|charger|screen|protector|please|include|want|need|ok/i, m: "Yes, please add a case and a charger." },
    { q: "How do you want to pay?", kw: /wave|orange|mobile|money|cash|pay|payment|transfer|card/i, m: "I will pay with Wave." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mel{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mel .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mel .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mel .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mel button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mel .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mel .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mel .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mel .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mel .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mel .ok{color:#25D366}#mel .or{color:#FFAA3C}" +
    "#mel-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mel-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mel")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mel";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">📱 Électronique · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mel-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mel-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mel-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mel-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mel-skip" type="button">Passer</button>' +
        '<button class="b3" id="mel-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mel-r"), mic = document.getElementById("mel-mic"), nx = document.getElementById("mel-next");
      document.getElementById("mel-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mel-x").onclick = function () { o.remove(); };
      document.getElementById("mel-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
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
        try { if (typeof BADGES !== "undefined" && !BADGES["electronique"]) BADGES["electronique"] = { icon: "📱", label: "Électronique", desc: "Achat de téléphone réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("electronique"); } catch (e) {}
      }
      noter("mission_electronique", score + "/" + Q.length);
      o.innerHTML = '<div class="k">📱 Mission Électronique</div><div class="q">' + (ok ? "Bonne affaire ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Électronique » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du secteur Électronique et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mel-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mel-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mel-x2" type="button">Fermer</button>';
      document.getElementById("mel-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mel-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mel-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon achat de téléphone en anglais sur Diisoo 📱 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
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
    var box = document.getElementById("business-content");
    if (!box || box.classList.contains("hidden") || document.getElementById("mel-btn")) return;
    var id = ""; try { id = businessModule; } catch (e) {}
    if (id !== "electronique") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mel-btn";
    b.innerHTML = '<span style="font-size:22px">📱</span><span>Mission : acheter mon téléphone<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    var h = box.querySelector("h4"); if (h && h.nextSibling) box.insertBefore(b, h.nextSibling); else box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("business-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true, attributes: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionÉlectronique = { ouvrir: ouvrir };
  if (/[?&]mission=electronique/.test(location.search)) setTimeout(ouvrir, 3000);
})();
