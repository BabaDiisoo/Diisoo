/* diisoo-mission-colobane.js v1 : Mission « Acheter mes pièces à Colobane »
   L'app joue le marchand (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Colobane ».
   Bouton place en haut du secteur « Pièces détachées » (Business). Essai : https://diisoo.sn/?mission=colobane */
(function () {
  "use strict";
  if (window.DiisooMissionColobane) return;
  var Q = [
    { q: "Hello. What do you need today?", kw: /need|want|looking|brake|filter|tyre|tire|part|pads|oil|battery|i/i, m: "I need brake pads for a Corolla." },
    { q: "Which car is it for?", kw: /corolla|toyota|peugeot|renault|honda|car|2010|2008|2012|\d|for/i, m: "It is for a 2010 Corolla." },
    { q: "Original or aftermarket?", kw: /original|aftermarket|copy|cheap|oem|new|second|used/i, m: "I want the original, please." },
    { q: "Twelve thousand each. How many do you want?", kw: /two|three|four|five|ten|twenty|\d|sets|pieces|take|want|price|lower/i, m: "I want ten sets. What is your best price?" },
    { q: "Okay, eleven thousand. Do you want a warranty?", kw: /yes|warranty|guarantee|invoice|please|months|write|sure|ok/i, m: "Yes, please write the warranty on the invoice." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mcb{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mcb .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mcb .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mcb .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mcb button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mcb .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mcb .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mcb .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mcb .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mcb .m.on{animation:mgq 1s infinite}@keyframes mgq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mcb .ok{color:#25D366}#mcb .or{color:#FFAA3C}" +
    "#mcb-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mcb-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mcb")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mcb";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🔧 Colobane · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mcb-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mcb-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mcb-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mcb-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mcb-skip" type="button">Passer</button>' +
        '<button class="b3" id="mcb-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mcb-r"), mic = document.getElementById("mcb-mic"), nx = document.getElementById("mcb-next");
      document.getElementById("mcb-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mcb-x").onclick = function () { o.remove(); };
      document.getElementById("mcb-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
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
        try { if (typeof BADGES !== "undefined" && !BADGES["colobane"]) BADGES["colobane"] = { icon: "🔧", label: "Colobane", desc: "Achat de pièces réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("colobane"); } catch (e) {}
      }
      noter("mission_colobane", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🌾 Mission Colobane</div><div class="q">' + (ok ? "Belle affaire ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Colobane » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du secteur Colobane et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mcb-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mcb-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mcb-x2" type="button">Fermer</button>';
      document.getElementById("mcb-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mcb-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mcb-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon achat de pièces en anglais sur Diisoo 🔧 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
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
    if (!box || box.classList.contains("hidden") || document.getElementById("mcb-btn")) return;
    var id = ""; try { id = businessModule; } catch (e) {}
    if (id !== "colobane") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mcb-btn";
    b.innerHTML = '<span style="font-size:22px">🔧</span><span>Mission : acheter mes pièces<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    var h = box.querySelector("h4"); if (h && h.nextSibling) box.insertBefore(b, h.nextSibling); else box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("business-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true, attributes: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionColobane = { ouvrir: ouvrir };
  if (/[?&]mission=colobane/.test(location.search)) setTimeout(ouvrir, 3000);
})();
