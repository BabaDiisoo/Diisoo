/* diisoo-b5.js : morceau 5/6 du bundle. Généré, ne pas modifier à la main. */
try{
/* ---- diisoo-mission-emploi.js ---- */
/* diisoo-mission-emploi.js v1 : Mission « Entretien d’embauche »
   L'app joue l'employeur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Travail & routine » (Anglais). Essai : https://diisoo.sn/?mission=emploi */
(function () {
  "use strict";
  if (window.DiisooMissionEmploi) return;
  var Q = [
    { q: "Tell me about yourself.", kw: /my name|i am|i'm|i work|i have|i live|years/i, m: "My name is Babacar. I am thirty years old and I work in a travel agency." },
    { q: "Why do you want this job?", kw: /want|like|need|learn|because|love|good|experience/i, m: "I want this job because I like helping customers." },
    { q: "Do you have experience?", kw: /yes|year|experience|worked|work|no |some/i, m: "Yes, I have five years of experience." },
    { q: "What are your strengths?", kw: /hard|honest|team|fast|reliable|work|strong|good|serious|punctual/i, m: "I am a hard worker and I am honest." },
    { q: "When can you start?", kw: /tomorrow|monday|next|now|week|today|soon|day/i, m: "I can start tomorrow." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#meo{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#meo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#meo .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#meo .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#meo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#meo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#meo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#meo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#meo .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#meo .m.on{animation:mep 1s infinite}@keyframes mep{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#meo .ok{color:#25D366}#meo .or{color:#FFAA3C}" +
    "#me-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#me-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("meo")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "meo";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">💼 Entretien d’embauche · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="me-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="me-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="me-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="me-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="me-skip" type="button">Passer</button>' +
        '<button class="b3" id="me-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("me-r"), mic = document.getElementById("me-mic"), nx = document.getElementById("me-next");
      document.getElementById("me-ec").onclick = function () { parler(cur.q); };
      document.getElementById("me-x").onclick = function () { o.remove(); };
      document.getElementById("me-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
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
        try { if (typeof BADGES !== "undefined" && !BADGES["pret-travailler"]) BADGES["pret-travailler"] = { icon: "💼", label: "Prêt à travailler", desc: "Entretien d’embauche réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("pret-travailler"); } catch (e) {}
      }
      noter("mission_emploi", score + "/" + Q.length);
      o.innerHTML = '<div class="k">💼 Mission emploi</div><div class="q">' + (ok ? "Embauché ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Prêt à travailler » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Travail & routine et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="me-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="me-re" type="button">Réessayer</button>') +
        '<button class="b3" id="me-x2" type="button">Fermer</button>';
      document.getElementById("me-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("me-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("me-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon entretien en anglais sur Diisoo 💼 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
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
    if (!box || document.getElementById("me-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "work") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "me-btn";
    b.innerHTML = '<span style="font-size:22px">💼</span><span>Mission : entretien d’embauche<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionEmploi = { ouvrir: ouvrir };
  if (/[?&]mission=emploi/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-emploi.js",e);}

try{
/* ---- diisoo-mission-sante.js ---- */
/* diisoo-mission-sante.js v1 : Mission « Chez le médecin »
   L'app joue le médecin (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Santé & urgences » (Anglais). Essai : https://diisoo.sn/?mission=sante */
(function () {
  "use strict";
  if (window.DiisooMissionSante) return;
  var Q = [
    { q: "Good morning. What is the problem?", kw: /pain|hurt|ache|sick|fever|cough|head|stomach|have|feel/i, m: "I have a stomach ache and a fever." },
    { q: "Where does it hurt?", kw: /here|head|stomach|chest|back|leg|arm|hurt|my/i, m: "It hurts here, in my stomach." },
    { q: "How long have you been sick?", kw: /day|days|week|since|yesterday|hour|night|morning/i, m: "I have been sick for three days." },
    { q: "Are you allergic to any medicine?", kw: /yes|no|allergic|penicillin|not|none/i, m: "No, I am not allergic to any medicine." },
    { q: "Take this medicine twice a day. Do you understand?", kw: /yes|ok|okay|understand|thank|twice|sure/i, m: "Yes, I understand. Thank you, doctor." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#msa{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#msa .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#msa .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#msa .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#msa button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#msa .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#msa .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#msa .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#msa .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#msa .m.on{animation:msp 1s infinite}@keyframes msp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#msa .ok{color:#25D366}#msa .or{color:#FFAA3C}" +
    "#ms-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#ms-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("msa")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "msa";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🩺 Consultation · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="ms-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="ms-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="ms-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="ms-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="ms-skip" type="button">Passer</button>' +
        '<button class="b3" id="ms-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("ms-r"), mic = document.getElementById("ms-mic"), nx = document.getElementById("ms-next");
      document.getElementById("ms-ec").onclick = function () { parler(cur.q); };
      document.getElementById("ms-x").onclick = function () { o.remove(); };
      document.getElementById("ms-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
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
        try { if (typeof BADGES !== "undefined" && !BADGES["pret-urgence"]) BADGES["pret-urgence"] = { icon: "🩺", label: "Prêt pour l’urgence", desc: "Consultation médicale réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("pret-urgence"); } catch (e) {}
      }
      noter("mission_sante", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🩺 Mission santé</div><div class="q">' + (ok ? "Bien soigné ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Prêt pour l’urgence » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Santé & urgences et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="ms-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="ms-re" type="button">Réessayer</button>') +
        '<button class="b3" id="ms-x2" type="button">Fermer</button>';
      document.getElementById("ms-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("ms-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("ms-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma consultation médicale en anglais sur Diisoo 🩺 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
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
    if (!box || document.getElementById("ms-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "health") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "ms-btn";
    b.innerHTML = '<span style="font-size:22px">🩺</span><span>Mission : chez le médecin<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionSante = { ouvrir: ouvrir };
  if (/[?&]mission=sante/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-sante.js",e);}

try{
/* ---- diisoo-mission-nourriture.js ---- */
/* diisoo-mission-nourriture.js v1 : Mission « Au restaurant »
   L'app joue le serveur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Nourriture » (Anglais). Essai : https://diisoo.sn/?mission=nourriture */
(function () {
  "use strict";
  if (window.DiisooMissionNourriture) return;
  var Q = [
    { q: "Good evening. What would you like?", kw: /like|want|rice|fish|chicken|please|have|eat|order/i, m: "I would like rice and fish, please." },
    { q: "Anything to drink?", kw: /water|juice|tea|coffee|drink|bissap|please|no|yes/i, m: "I would like water, please." },
    { q: "Is it spicy? Do you want it hot?", kw: /yes|no|spicy|hot|not|little|please|sure/i, m: "No, not too spicy, please." },
    { q: "Would you like dessert?", kw: /yes|no|thank|dessert|fruit|ice|cake|please|full/i, m: "No, thank you. I am full." },
    { q: "Here is the bill. How would you like to pay?", kw: /cash|wave|card|orange|pay|money|by/i, m: "I will pay by Wave, please." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mnr{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mnr .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mnr .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mnr .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mnr button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mnr .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mnr .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mnr .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mnr .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mnr .m.on{animation:mnp 1s infinite}@keyframes mnp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mnr .ok{color:#25D366}#mnr .or{color:#FFAA3C}" +
    "#mn-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mn-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mnr")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mnr";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🍽️ Restaurant · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mn-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mn-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mn-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mn-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mn-skip" type="button">Passer</button>' +
        '<button class="b3" id="mn-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mn-r"), mic = document.getElementById("mn-mic"), nx = document.getElementById("mn-next");
      document.getElementById("mn-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mn-x").onclick = function () { o.remove(); };
      document.getElementById("mn-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
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
        try { if (typeof BADGES !== "undefined" && !BADGES["pret-commander"]) BADGES["pret-commander"] = { icon: "🍽️", label: "Prêt à commander", desc: "Commande au restaurant réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("pret-commander"); } catch (e) {}
      }
      noter("mission_nourriture", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🍽️ Mission restaurant</div><div class="q">' + (ok ? "Bon appétit ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Prêt à commander » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Nourriture et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mn-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mn-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mn-x2" type="button">Fermer</button>';
      document.getElementById("mn-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mn-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mn-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma commande au restaurant en anglais sur Diisoo 🍽️ (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
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
    if (!box || document.getElementById("mn-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "food") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mn-btn";
    b.innerHTML = '<span style="font-size:22px">🍽️</span><span>Mission : au restaurant<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionNourriture = { ouvrir: ouvrir };
  if (/[?&]mission=nourriture/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-nourriture.js",e);}

try{
/* ---- diisoo-mission-temps.js ---- */
/* diisoo-mission-temps.js v1 : Mission « Prendre rendez-vous »
   L'app joue la secrétaire (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « A l heure ».
   Bouton place en haut du theme « Temps & nombres » (Anglais). Essai : https://diisoo.sn/?mission=temps */
(function () {
  "use strict";
  if (window.DiisooMissionTemps) return;
  var Q = [
    { q: "Hello. How can I help you?", kw: /appointment|meeting|meet|see|book|need|want|like|doctor|come/i, m: "I would like to make an appointment, please." },
    { q: "What day would you like to come?", kw: /monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next|day|week/i, m: "I would like to come on Tuesday." },
    { q: "What time is good for you?", kw: /o'clock|oclock|morning|afternoon|evening|am|pm|nine|ten|eleven|two|three|four|five|time|at/i, m: "Ten o'clock in the morning is good." },
    { q: "Can I have your name and phone number?", kw: /name|number|phone|my|is|babacar|seven/i, m: "My name is Babacar and my number is seven seven." },
    { q: "Sorry, that time is full. Is eleven o'clock okay?", kw: /yes|ok|okay|fine|good|perfect|no|sorry|thank|eleven/i, m: "Yes, eleven o'clock is okay. Thank you." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mtm{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mtm .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mtm .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mtm .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mtm button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mtm .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mtm .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mtm .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mtm .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mtm .m.on{animation:mtq 1s infinite}@keyframes mtq{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mtm .ok{color:#25D366}#mtm .or{color:#FFAA3C}" +
    "#mt-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mt-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mtm")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mtm";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">⏰ Rendez-vous · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mt-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mt-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mt-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mt-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mt-skip" type="button">Passer</button>' +
        '<button class="b3" id="mt-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mt-r"), mic = document.getElementById("mt-mic"), nx = document.getElementById("mt-next");
      document.getElementById("mt-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mt-x").onclick = function () { o.remove(); };
      document.getElementById("mt-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
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
        try { if (typeof BADGES !== "undefined" && !BADGES["a-lheure"]) BADGES["a-lheure"] = { icon: "⏰", label: "À l’heure", desc: "Prise de rendez-vous réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("a-lheure"); } catch (e) {}
      }
      noter("mission_temps", score + "/" + Q.length);
      o.innerHTML = '<div class="k">⏰ Mission rendez-vous</div><div class="q">' + (ok ? "Rendez-vous pris ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « À l’heure » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Temps & nombres et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mt-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mt-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mt-x2" type="button">Fermer</button>';
      document.getElementById("mt-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mt-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mt-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma prise de rendez-vous en anglais sur Diisoo ⏰ (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
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
    if (!box || document.getElementById("mt-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "time") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mt-btn";
    b.innerHTML = '<span style="font-size:22px">⏰</span><span>Mission : prendre rendez-vous<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionTemps = { ouvrir: ouvrir };
  if (/[?&]mission=temps/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-temps.js",e);}

try{
/* ---- diisoo-mission-logement.js ---- */
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

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-logement.js",e);}

try{
/* ---- diisoo-mission-agriculture.js ---- */
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

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-agriculture.js",e);}

try{
/* ---- diisoo-installer.js ---- */
/* diisoo-installer.js v1 : installer Diisoo comme une vraie application, en un geste
   - Carte claire "Mets Diisoo sur ton telephone" (apres un premier exercice, une fois par semaine au maximum)
   - Android / Chrome / Samsung Internet : un seul bouton, la fenetre d'installation du telephone s'ouvre
   - iPhone / Safari : 3 etapes illustrees (Partager, Sur l'ecran d'accueil, Ajouter)
   - Jamais affichee si l'app est deja installee */
(function () {
  "use strict";
  var CLE = "diisoo_install_plus";
  function dejaInstallee() { return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true; }
  var iOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  var promptEvt = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); promptEvt = e; });
  window.addEventListener("appinstalled", function () { promptEvt = null; fermer(); try { localStorage.setItem(CLE, "9999999999999"); } catch (x) {} });

  var st = document.createElement("style");
  st.textContent =
    "#dii-inst{position:fixed;inset:0;z-index:9991;background:rgba(5,8,16,.86);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-inst .in-box{width:100%;max-width:480px;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px 22px 0 0;padding:20px 16px 26px;color:#F6F1E7;text-align:center}" +
    "#dii-inst .in-ic{width:72px;height:72px;border-radius:18px;margin:0 auto 8px;display:block}" +
    "#dii-inst h3{font-size:19px;font-weight:800;margin:0 0 4px}" +
    "#dii-inst p{font-size:13px;color:#A69C86;margin:0 0 12px}" +
    "#dii-inst .in-liste{text-align:left;margin:8px 0 14px}" +
    "#dii-inst .in-l{display:flex;align-items:center;gap:12px;background:#141A2B;border:1px solid #1E2740;border-radius:14px;padding:10px 12px;margin-bottom:8px;font-size:14px;font-weight:700}" +
    "#dii-inst .in-l b{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#25D366;color:#fff;flex:0 0 auto}" +
    "#dii-inst .in-l span{font-size:22px;margin-left:auto}" +
    "#dii-inst .in-ok{width:100%;min-height:56px;border-radius:999px;border:0;background:#25D366;color:#fff;font-size:16px;font-weight:800}" +
    "#dii-inst .in-no{width:100%;min-height:44px;margin-top:6px;background:none;border:0;color:#A69C86;font-size:13px}";
  document.head.appendChild(st);

  function fermer() { var e = document.getElementById("dii-inst"); if (e) e.remove(); }
  function repousser(jours) { try { localStorage.setItem(CLE, String(Date.now() + jours * 86400000)); } catch (e) {} }

  function ouvrir() {
    if (document.getElementById("dii-inst") || dejaInstallee()) return;
    var ov = document.createElement("div"); ov.id = "dii-inst";
    var h = '<div class="in-box"><img class="in-ic" src="icon-192.png" alt="Diisoo"><h3>📲 Mets Diisoo sur ton téléphone</h3>';
    if (iOS) {
      h += '<p>Comme une vraie application, sans magasin d\'applications. 3 gestes :</p><div class="in-liste">' +
        '<div class="in-l"><b>1</b>Touche « Partager » en bas de Safari<span>⬆️</span></div>' +
        '<div class="in-l"><b>2</b>Choisis « Sur l\'écran d\'accueil »<span>➕</span></div>' +
        '<div class="in-l"><b>3</b>Touche « Ajouter »<span>✅</span></div></div>' +
        '<button type="button" class="in-ok" id="in-fait">J\'ai compris</button>';
    } else if (promptEvt) {
      h += '<p>Ouvre Diisoo en un geste, même sans connexion, sans chercher dans Google.</p>' +
        '<button type="button" class="in-ok" id="in-go">📲 Installer Diisoo</button>';
    } else {
      h += '<p>Comme une vraie application. 2 gestes :</p><div class="in-liste">' +
        '<div class="in-l"><b>1</b>Touche le menu du navigateur<span>⋮</span></div>' +
        '<div class="in-l"><b>2</b>Choisis « Installer l\'application » ou « Ajouter à l\'écran d\'accueil »<span>✅</span></div></div>' +
        '<button type="button" class="in-ok" id="in-fait">J\'ai compris</button>';
    }
    h += '<button type="button" class="in-no" id="in-plus">Plus tard</button></div>';
    ov.innerHTML = h; document.body.appendChild(ov);
    var go = document.getElementById("in-go");
    if (go) go.onclick = function () {
      var e = promptEvt; if (!e) { fermer(); return; }
      try { e.prompt(); e.userChoice.then(function (r) { if (r && r.outcome !== "accepted") repousser(7); }); } catch (x) {}
      promptEvt = null; fermer();
    };
    var fait = document.getElementById("in-fait"); if (fait) fait.onclick = function () { repousser(30); fermer(); };
    document.getElementById("in-plus").onclick = function () { repousser(7); fermer(); };
  }

  function pret() {
    if (dejaInstallee()) return false;
    var t = 0; try { t = +localStorage.getItem(CLE) || 0; } catch (e) {}
    if (Date.now() < t) return false;
    var d = document.getElementById("screen-dashboard");
    if (!d || d.offsetParent === null) return false;
    if (document.getElementById("dii-obj") || document.getElementById("dii-passage")) return false;
    var g = null; try { g = JSON.parse(localStorage.getItem("diisoo_goal") || "null"); } catch (e) {}
    return !!(g && g.done >= 1) && !!localStorage.getItem("diisoo_obj");
  }
  /* Apres le premier exercice ET l'objectif fixe : c'est le bon moment */
  setInterval(function () { if (pret()) ouvrir(); }, 5000);

  window.DiisooInstaller = { version: 1, ouvrir: ouvrir };
})();

/* ---- v2 : bandeau « ouvre dans ton navigateur » pour TikTok / Instagram / Facebook (stockage, son et micro limités dans ces fenêtres) ---- */
(function () {
  "use strict";
  var UA = navigator.userAgent || "", RX = /musical_ly|TikTok|Bytedance|Instagram|FBAN|FBAV|Snapchat/i;
  if (!RX.test(UA) || window.__diisooInapp) return; window.__diisooInapp = true;
  try { if (new URLSearchParams(location.search).get("inapp") === "0") return; } catch (e) {}
  var IOS = /iPhone|iPad|iPod/.test(UA), NOM = /TikTok|musical_ly|Bytedance/i.test(UA) ? "TikTok" : /Instagram/i.test(UA) ? "Instagram" : /FBAN|FBAV/.test(UA) ? "Facebook" : "Snapchat";
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function note(n) { try { window.DiisooSuivi && DiisooSuivi.noter && DiisooSuivi.noter("action", n, NOM + (IOS ? " iOS" : " Android")); } catch (e) {} }
  function occupe() { return !!document.querySelector("#dsn:not(.hidden), #dcv:not(.hidden), #dii-fmt, #dar, #dsr, #dii-obj, #dii-defi, .dii4-ov, [role='dialog'], [aria-modal='true']"); }
  function montrer() {
    if (document.getElementById("dii-inapp") || occupe()) return false;
    var d = document.createElement("div"); d.id = "dii-inapp";
    d.style.cssText = "position:fixed;left:10px;right:10px;bottom:12px;z-index:9000;max-width:520px;margin:0 auto;background:#141A2B;border:1px solid #F3A94E;border-radius:18px;padding:14px;color:#F6F1E7;box-shadow:0 8px 30px rgba(0,0,0,.55);font-family:inherit";
    d.innerHTML = '<div style="font-weight:800;font-size:15px">📲 Garde ta progression et le son</div>' +
      '<div style="font-size:13px;color:#C9BFA8;margin:6px 0 10px;line-height:1.4">Dans ' + NOM + ', l\'app peut oublier ta progression et couper le son. Touche <b>⋯</b> ou <b>↗</b>, puis <b>' + (IOS ? "« Ouvrir dans Safari »" : "« Ouvrir dans le navigateur »") + '</b>.</div>' +
      '<div style="display:flex;gap:8px"><button type="button" id="dii-inapp-c" style="flex:1;min-height:46px;border:0;border-radius:14px;background:linear-gradient(135deg,#F3A94E,#E1693F);color:#1a0f00;font-weight:800;font-size:14px">📋 Copier le lien</button>' +
      '<button type="button" id="dii-inapp-x" style="min-height:46px;padding:0 16px;border-radius:14px;background:#0B0F1C;border:1px solid #1E2740;color:#C9BFA8;font-size:13px">Plus tard</button></div>';
    document.body.appendChild(d); note("inapp_vu");
    document.getElementById("dii-inapp-x").onclick = function () { d.remove(); note("inapp_plus_tard"); };
    document.getElementById("dii-inapp-c").onclick = function () {
      var b = this, u = "https://diisoo.sn/", ok = function () { b.textContent = "✅ Copié : colle-le dans Safari"; note("inapp_copie"); setTimeout(function () { d.remove(); }, 2600); };
      try { navigator.clipboard.writeText(u).then(ok, function () { throw 0; }); } catch (e) {
        try { var t = document.createElement("textarea"); t.value = u; t.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); ok(); } catch (e2) { b.textContent = u; }
      }
    };
    return true;
  }
  /* une fois par jour au plus, jamais pendant un exercice, après 12 s de présence */
  setTimeout(function () {
    var j = new Date().toISOString().slice(0, 10), n = 0;
    if (lire("diisoo_inapp_j") === j) return;
    var t = setInterval(function () { n++; if (n > 40) { clearInterval(t); return; } if (montrer()) { clearInterval(t); ecrire("diisoo_inapp_j", j); } }, 3000);
  }, 12000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-installer.js",e);}

try{
/* ---- diisoo-assistant.js ---- */
/* diisoo-assistant.js v1 : assistant d'equivalences dans les lecons
   Sous chaque mot ou phrase d'anglais (Anglais general, Business), un bouton « 💡 Autre façon de le dire » :
   - des equivalents : plus poli, plus simple, plus courant (regles et synonymes courants)
   - des phrases de la meme situation qui utilisent le meme mot
   Chaque proposition se lit a voix haute (🔊). Rien n'est affiche s'il n'y a rien d'utile a ajouter.
   Fonctionne sans connexion : aucune requete reseau. */
(function () {
  "use strict";

  /* ---------- equivalents ---------- */
  var REGLES = [
    [/^I want to (.+?)([.!?]?)$/i, function (m) { return [["I would like to " + m[1] + m[2], "Plus poli"]]; }],
    [/^I want (a |an |the |some )?(.+?)([.!?]?)$/i, function (m) { return [["I would like " + (m[1] || "") + m[2] + m[3], "Plus poli"]]; }],
    [/^I need (.+?)([.!?]?)$/i, function (m) { return [["I am looking for " + m[1] + m[2], "Plus courant au magasin"], ["I would like " + m[1] + m[2], "Plus poli"]]; }],
    [/^Can I (.+?)\?$/i, function (m) { return [["May I " + m[1] + "?", "Plus formel"], ["Could I " + m[1] + "?", "Plus poli"]]; }],
    [/^Can you (.+?)\?$/i, function (m) { return [["Could you " + m[1] + "?", "Plus poli"], ["Would you mind helping me to " + m[1] + "?", "Très poli"]]; }],
    [/^How much is (it|this|that)\?$/i, function () { return [["What is the price?", "Autre façon de demander le prix"], ["How much does it cost?", "Même sens"]]; }],
    [/^How much is (.+?)\?$/i, function (m) { return [["What is the price of " + m[1] + "?", "Autre façon de demander le prix"], ["How much does " + m[1] + " cost?", "Même sens"]]; }],
    [/^Where is (.+?)\?$/i, function (m) { return [["Could you tell me where " + m[1] + " is?", "Plus poli"], ["Do you know where " + m[1] + " is?", "Plus courant"]]; }],
    [/^Do you have (.+?)\?$/i, function (m) { return [["Is there " + m[1] + " available?", "Plus formel"], ["Have you got " + m[1] + "?", "Anglais britannique"]]; }],
    [/^I am from (.+?)([.!?]?)$/i, function (m) { return [["I come from " + m[1] + m[2], "Même sens"]]; }],
    [/^My name is (.+?)([.!?]?)$/i, function (m) { return [["I am " + m[1] + m[2], "Plus court"], ["Call me " + m[1] + m[2], "Plus amical"]]; }],
    [/^Thank you( very much)?([.!?]?)$/i, function () { return [["Thanks a lot!", "Plus amical"], ["I really appreciate it.", "Plus fort"]]; }],
    [/^You are welcome([.!?]?)$/i, function () { return [["No problem!", "Plus amical"], ["My pleasure.", "Plus poli"]]; }],
    [/^Nice to meet you([.!?]?)$/i, function () { return [["Pleased to meet you.", "Plus formel"]]; }],
    [/^I do not understand([.!?]?)$/i, function () { return [["Could you repeat that, please?", "Plus utile pour continuer"], ["Sorry, I did not catch that.", "Plus courant"]]; }],
    [/^That is too expensive([.!?]?)$/i, function () { return [["That is a bit pricey.", "Plus doux"], ["Can you give me a better price?", "Pour négocier"]]; }],
    [/^I will take it([.!?]?)$/i, function () { return [["I will buy it.", "Plus simple"], ["I will have it.", "Plus courant"]]; }],
    [/^I have a reservation([.!?]?)$/i, function () { return [["I booked a room.", "Plus simple"]]; }],
    [/^Excuse me(,)? (.+)$/i, function (m) { return [["Sorry to bother you, " + m[2].charAt(0).toLowerCase() + m[2].slice(1), "Plus poli"]]; }]
  ];
  var SYN = {
    cheap: ["inexpensive", "Plus formel"], expensive: ["pricey", "Plus courant"], big: ["large", "Plus formel"],
    small: ["little", "Plus simple"], buy: ["purchase", "Plus formel"], start: ["begin", "Plus formel"],
    help: ["assist", "Plus formel"], ask: ["request", "Plus formel"], fast: ["quick", "Même sens"],
    beautiful: ["lovely", "Plus courant"], delicious: ["tasty", "Plus simple"], hello: ["hi", "Plus amical"],
    goodbye: ["see you later", "Plus amical"], yes: ["of course", "Plus fort"], house: ["home", "Plus chaleureux"],
    car: ["vehicle", "Plus formel"], money: ["cash", "Plus précis"], job: ["work", "Plus simple"],
    tired: ["exhausted", "Plus fort"], happy: ["glad", "Plus simple"], hungry: ["starving", "Plus fort"],
    friend: ["buddy", "Plus amical"], shop: ["store", "Américain"], boss: ["manager", "Plus formel"],
    problem: ["issue", "Plus formel"], price: ["cost", "Même sens"], order: ["request", "Même sens"],
    near: ["close", "Même sens"], far: ["distant", "Plus formel"], wrong: ["incorrect", "Plus formel"]
  };

  function equivalents(en) {
    var out = [], t = String(en || "").trim();
    for (var i = 0; i < REGLES.length; i++) {
      var m = REGLES[i][0].exec(t);
      if (m) { out = out.concat(REGLES[i][1](m)); break; }
    }
    var mot = t.toLowerCase().replace(/[^a-z]/g, "");
    if (!out.length && SYN[mot]) out.push([SYN[mot][0].charAt(0).toUpperCase() + SYN[mot][0].slice(1), SYN[mot][1]]);
    return out.filter(function (x) { return x[0].toLowerCase() !== t.toLowerCase(); }).slice(0, 2);
  }

  /* ---------- phrases de la meme situation ---------- */
  var STOP = /^(the|and|you|are|was|for|with|have|this|that|what|your|from|please|would|could|there|will|can|how|not|but|any|our|its|his|her|she|him|they|them|who|why|may)$/;
  function motsCles(s) {
    return String(s || "").toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter(function (w) { return w.length > 3 && !STOP.test(w); });
  }
  function voisines(item, banque, deja) {
    var ks = motsCles(item.en), out = [];
    if (!ks.length) return out;
    banque.forEach(function (x) {
      if (!x || !x.en || x.en === item.en || deja[x.en]) return;
      var kx = motsCles(x.en), commun = ks.filter(function (k) { return kx.indexOf(k) > -1; }).length;
      if (commun) { out.push({ en: x.en, fr: x.fr || "", n: commun }); deja[x.en] = 1; }
    });
    out.sort(function (a, b) { return b.n - a.n || a.en.length - b.en.length; });
    return out.slice(0, 2);
  }

  /* ---------- source de chaque carte ---------- */
  function sourceDe(card) {
    var b = card.querySelector("[data-practice]");
    var bl = card.querySelector("[data-practice^='gen-l:']");
    try {
      if (bl) {
        var p = bl.dataset.practice.split(":"), th = GENERAL_THEMES.filter(function (t) { return t.id === p[1]; })[0];
        if (!th) return null;
        var banque = (th.vocab || []).concat((th.dialogue || []).map(function (d) { return { en: d.en, fr: d.fr }; }));
        return { item: th.vocab[+p[2]], banque: banque };
      }
      var bb = card.querySelector("[data-practice^='biz:']");
      if (bb) {
        var q = bb.dataset.practice.split(":"), mod = CHINA_TRADE_WOLOF[q[1]];
        var dl = (BUSINESS_DIALOGUES[q[1]] || []).map(function (d) { return { en: d.en, fr: d.fr }; });
        return { item: mod.vocab[+q[2]], banque: mod.vocab.concat(dl) };
      }
    } catch (e) {}
    void b;
    return null;
  }

  /* ---------- interface ---------- */
  var st = document.createElement("style");
  st.textContent =
    ".as-btn{width:100%;min-height:44px;margin-top:8px;border-radius:14px;background:#1A1530;border:1px solid #5B3FA0;color:#C9B6F2;font-size:12px;font-weight:700}" +
    ".as-box{margin-top:8px;display:flex;flex-direction:column;gap:6px}" +
    ".as-l{display:flex;align-items:center;gap:10px;background:#141A2B;border:1px solid #1E2740;border-radius:12px;padding:8px 10px}" +
    ".as-t{flex:1;font-size:13px;font-weight:700;color:#F6F1E7;line-height:1.25}" +
    ".as-t small{display:block;font-size:11px;font-weight:400;color:#A69C86;margin-top:1px}" +
    ".as-s{flex:0 0 auto;width:44px;height:44px;border-radius:50%;background:#25D366;border:0;color:#fff;font-size:18px}" +
    ".as-h{font-size:11px;font-weight:700;color:#8C8064;text-transform:uppercase;letter-spacing:.06em;margin-top:4px}";
  document.head.appendChild(st);

  function ligne(en, note) {
    var d = document.createElement("div"); d.className = "as-l";
    var t = document.createElement("div"); t.className = "as-t";
    t.textContent = en;
    if (note) { var s = document.createElement("small"); s.textContent = note; t.appendChild(s); }
    var b = document.createElement("button"); b.type = "button"; b.className = "as-s"; b.textContent = "🔊";
    b.setAttribute("aria-label", "Écouter : " + en);
    b.onclick = function (ev) { ev.stopPropagation(); try { speak(en, "en-US", 0.85); } catch (e) {} };
    d.appendChild(t); d.appendChild(b);
    return d;
  }

  function equiper(card) {
    if (card.__as) return;
    var src = sourceDe(card);
    if (!src || !src.item) return;
    card.__as = true;
    var eq = equivalents(src.item.en);
    var deja = {}; deja[src.item.en] = 1;
    eq.forEach(function (x) { deja[x[0]] = 1; });
    var vo = voisines(src.item, src.banque || [], deja);
    if (!eq.length && !vo.length) return;
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "as-btn"; btn.textContent = "💡 Autre façon de le dire";
    var box = document.createElement("div"); box.className = "as-box"; box.style.display = "none";
    if (eq.length) {
      var h1 = document.createElement("div"); h1.className = "as-h"; h1.textContent = "Même idée"; box.appendChild(h1);
      eq.forEach(function (x) { box.appendChild(ligne(x[0], x[1])); });
    }
    if (vo.length) {
      var h2 = document.createElement("div"); h2.className = "as-h"; h2.textContent = "Dans la même situation"; box.appendChild(h2);
      vo.forEach(function (x) { box.appendChild(ligne(x.en, x.fr)); });
    }
    btn.onclick = function () {
      var ouvert = box.style.display !== "none";
      box.style.display = ouvert ? "none" : "flex";
      btn.textContent = ouvert ? "💡 Autre façon de le dire" : "💡 Masquer";
    };
    var grille = card.querySelector(".grid") || card.lastElementChild;
    if (grille && grille.parentNode === card) card.insertBefore(btn, grille.nextSibling); else card.appendChild(btn);
    card.insertBefore(box, btn.nextSibling);
  }

  var plan = false;
  function balayer() {
    if (plan) return; plan = true;
    requestAnimationFrame(function () {
      plan = false;
      ["general-content", "business-content"].forEach(function (id) {
        var r = document.getElementById(id); if (!r) return;
        var bs = r.querySelectorAll("[data-practice^='gen-l:'], [data-practice^='biz:']");
        for (var i = 0; i < bs.length; i++) {
          var card = bs[i].closest(".rounded-2xl, .rounded-xl, .fx-em") || bs[i].parentNode.parentNode;
          if (card) equiper(card);
        }
      });
    });
  }
  try { new MutationObserver(balayer).observe(document.body, { childList: true, subtree: true }); balayer(); } catch (e) {}

  window.DiisooAssistant = { version: 1, equivalents: equivalents };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-assistant.js",e);}

try{
/* ---- diisoo-coach2.js ---- */
/* diisoo-coach2.js v1 : coach vocal en un seul geste
   Remplace le parcours en 3 boutons par une boucle guidee :
   1. Le modele s'ecoute tout seul (anglais, voix de l'app)
   2. Un gros bouton micro : maintiens, parle, relache (comme le vocal WhatsApp)
   3. Resultat mot par mot : vert = bien, orange = proche, rouge = a reprendre. Touche un mot pour l'entendre doucement
   4. Reessaie jusqu'a reussir, puis la phrase suivante. Apres 2 essais ratés, le modele est relu lentement.
   Meme appel que l'ancien coach : DiisooCoach.ouvrir({ en, pron, wo, fr, suivant, onFin }). */
(function () {
  "use strict";
  var ancien = window.DiisooCoach || {};
  var SEUIL = 0.8;

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function mots(s) { try { return normalize(s).split(" ").filter(Boolean); } catch (e) { return String(s).toLowerCase().replace(/[^a-z' ]/g, " ").split(/\s+/).filter(Boolean); } }
  function lev(a, b) {
    var d = [], i, j;
    for (i = 0; i <= a.length; i++) d[i] = [i];
    for (j = 1; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  var HOMO = [["two", "too", "to"], ["for", "four", "fore"], ["night", "knight"], ["no", "know"], ["write", "right"], ["there", "their", "theyre"],
    ["hear", "here"], ["one", "won"], ["buy", "by", "bye"], ["sea", "see"], ["i", "eye"], ["our", "hour"], ["wait", "weight"], ["week", "weak"],
    ["son", "sun"], ["meet", "meat"], ["wear", "where", "ware"], ["whole", "hole"], ["would", "wood"], ["your", "youre"], ["its", "it's"], ["new", "knew"]];
  var PETITS = { a: 1, an: 1, the: 1, of: 1 };
  function memeSon(a, b) {
    for (var i = 0; i < HOMO.length; i++) { if (HOMO[i].indexOf(a) > -1 && HOMO[i].indexOf(b) > -1) return true; }
    return false;
  }
  function proche(a, b) { var m = Math.max(a.length, b.length); return m ? 1 - lev(a, b) / m : 1; }

  /* Compare mot a mot : 2 = bien, 1 = proche, 0 = a reprendre */
  function comparer(cible, entendu) {
    var C = mots(cible), H = mots(entendu), res = [], pts = 0;
    C.forEach(function (w) {
      var best = 0;
      H.forEach(function (h) { var s = (h === w || memeSon(w, h)) ? 1 : proche(w, h); if (s > best) best = s; });
      var etat = best >= 0.99 ? 2 : (best >= 0.7 ? 1 : 0);
      if (etat === 0 && PETITS[w]) { etat = 1; best = 0.8; } /* petits mots souvent avales par la reconnaissance */
      pts += etat === 2 ? 1 : (etat === 1 ? (PETITS[w] ? 0.9 : 0.6) : 0);
      res.push({ w: w, etat: etat });
    });
    return { mots: res, score: C.length ? pts / C.length : 0 };
  }

  var st = document.createElement("style");
  st.textContent =
    "#dii-coach{position:fixed;inset:0;z-index:99999;background:rgba(5,8,18,.94);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-coach .co-box{width:100%;max-width:520px;max-height:96vh;overflow-y:auto;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px 22px 0 0;padding:16px 16px 22px;color:#F6F1E7;font-family:inherit}" +
    "#dii-coach .co-top{display:flex;align-items:center;gap:8px;margin-bottom:6px}" +
    "#dii-coach .co-x{width:44px;height:44px;border-radius:50%;background:#141A2B;border:1px solid #1E2740;color:#A69C86;font-size:16px}" +
    "#dii-coach .co-tt{flex:1;text-align:center;font-size:11px;font-weight:700;letter-spacing:.1em;color:#8C8064;text-transform:uppercase}" +
    "#dii-coach .co-en{font-size:26px;font-weight:800;line-height:1.2;text-align:center;margin:6px 0 4px}" +
    "#dii-coach .co-pron{text-align:center;font-size:16px;color:#F3A94E;margin:0 0 4px}" +
    "#dii-coach .co-aide{text-align:center;font-size:13px;color:#A69C86;margin:0 0 2px}" +
    "#dii-coach .co-mots{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:12px 0 6px}" +
    "#dii-coach .co-m{min-height:44px;padding:6px 12px;border-radius:12px;border:2px solid #1E2740;background:#141A2B;color:#F6F1E7;font-size:17px;font-weight:700}" +
    "#dii-coach .co-m.v{border-color:#25D366;background:#12351F}#dii-coach .co-m.o{border-color:#F3A94E;background:#3A2A10}#dii-coach .co-m.r{border-color:#E5484D;background:#3A1515}" +
    "#dii-coach .co-msg{min-height:44px;text-align:center;font-size:15px;line-height:1.35;margin:6px 0}" +
    "#dii-coach .co-ecoute{display:flex;gap:8px;margin:6px 0}" +
    "#dii-coach .co-ecoute button{flex:1;min-height:48px;border-radius:14px;background:#141A2B;border:1px solid #1E2740;color:#E4DCC9;font-size:13px;font-weight:700}" +
    "#dii-coach .co-mic{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;min-height:96px;border-radius:24px;border:0;background:#25D366;color:#fff;font-size:15px;font-weight:800;touch-action:none;user-select:none;-webkit-user-select:none;margin-top:6px}" +
    "#dii-coach .co-mic span{font-size:34px;line-height:1}" +
    "#dii-coach .co-mic.on{background:#E5484D;animation:copulse 1s infinite}" +
    "@keyframes copulse{0%,100%{box-shadow:0 0 0 0 rgba(229,72,77,.6)}50%{box-shadow:0 0 0 14px rgba(229,72,77,0)}}" +
    "#dii-coach .co-pts{display:flex;justify-content:center;gap:6px;margin:8px 0 0}" +
    "#dii-coach .co-pts i{width:12px;height:12px;border-radius:50%;background:#1E2740}#dii-coach .co-pts i.ko{background:#E5484D}#dii-coach .co-pts i.ok{background:#25D366}" +
    "#dii-coach .co-suiv{width:100%;min-height:56px;margin-top:10px;border-radius:999px;border:0;background:#25D366;color:#fff;font-size:16px;font-weight:800}" +
    "#dii-coach .co-sec{width:100%;min-height:46px;margin-top:6px;background:none;border:0;color:#A69C86;font-size:13px}";
  document.head.appendChild(st);

  function parler(txt, rate) { try { if (typeof speak === "function") return speak(txt, "en-US", rate || 0.85); } catch (e) {} }
  function son(n) { try { if (window.DiisooSon) window.DiisooSon.jouer(n); } catch (e) {} }

  function ouvrir(o) {
    o = o || {};
    if (!o.en) return;
    if (document.getElementById("dii-coach")) return;
    try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
    var fond = el("div"); fond.id = "dii-coach";
    var box = el("div", "co-box"); fond.appendChild(box); document.body.appendChild(fond);
    var essais = [], fini = false, h = null, actif = false;

    function fermer() {
      try { if (h) h.stop(); } catch (e) {}
      try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
      fond.remove();
      if (o.onFin) { try { o.onFin(); } catch (e) {} }
    }

    var top = el("div", "co-top");
    var x = el("button", "co-x", "✕"); x.type = "button"; x.setAttribute("aria-label", "Fermer"); x.onclick = fermer;
    top.appendChild(x); top.appendChild(el("div", "co-tt", "Coach vocal"));
    box.appendChild(top);
    box.appendChild(el("div", "co-en", o.en));
    if (o.pron) box.appendChild(el("div", "co-pron", o.pron));
    if (o.fr) box.appendChild(el("div", "co-aide", o.fr));
    if (o.wo) box.appendChild(el("div", "co-aide", "🗣️ " + o.wo));
    var zoneMots = el("div", "co-mots"); box.appendChild(zoneMots);
    var msg = el("div", "co-msg", "Écoute le modèle, puis maintiens le bouton vert et dis la phrase."); msg.setAttribute("aria-live", "polite");
    box.appendChild(msg);

    var ec = el("div", "co-ecoute");
    var bMod = el("button", null, "🔊 Modèle"); bMod.type = "button";
    var bLent = el("button", null, "🐢 Lentement"); bLent.type = "button";
    bMod.onclick = function () { msg.textContent = "Écoute..."; parler(o.en, 0.9); };
    bLent.onclick = function () { msg.textContent = "Écoute doucement..."; parler(o.en, 0.6); };
    ec.appendChild(bMod); ec.appendChild(bLent);
    if (o.wo) {
      var bWo = el("button", null, "🗣️ Wolof"); bWo.type = "button";
      bWo.onclick = function () { try { if (typeof speakWolofOolel === "function") speakWolofOolel(o.wo); } catch (e) {} };
      ec.appendChild(bWo);
    }
    box.appendChild(ec);

    var mic = el("button", "co-mic"); mic.type = "button";
    mic.innerHTML = "<span>🎤</span>Maintiens pour parler";
    box.appendChild(mic);
    var pts = el("div", "co-pts"); box.appendChild(pts);
    function points() {
      pts.innerHTML = "";
      for (var i = 0; i < Math.max(3, essais.length); i++) {
        var p = el("i", essais[i] === undefined ? "" : (essais[i] ? "ok" : "ko")); pts.appendChild(p);
      }
    }
    points();
    var zoneSuite = el("div"); box.appendChild(zoneSuite);

    function afficher(res) {
      zoneMots.innerHTML = "";
      res.mots.forEach(function (m) {
        var b = el("button", "co-m " + (m.etat === 2 ? "v" : m.etat === 1 ? "o" : "r"), m.w); b.type = "button";
        b.setAttribute("aria-label", "Écouter le mot " + m.w);
        b.onclick = function () { parler(m.w, 0.6); };
        zoneMots.appendChild(b);
      });
    }

    function suite(reussi) {
      zoneSuite.innerHTML = "";
      if (reussi) {
        var s = el("button", "co-suiv", o.suivant ? "➡️ Phrase suivante" : "✅ Terminer"); s.type = "button";
        s.onclick = function () { fermer(); if (o.suivant) o.suivant(); };
        zoneSuite.appendChild(s);
        var r = el("button", "co-sec", "Refaire encore une fois"); r.type = "button";
        r.onclick = function () { zoneSuite.innerHTML = ""; zoneMots.innerHTML = ""; msg.textContent = "Maintiens le bouton vert et dis la phrase."; };
        zoneSuite.appendChild(r);
      } else if (o.suivant && essais.length >= 3) {
        var p = el("button", "co-sec", "Passer à la phrase suivante"); p.type = "button";
        p.onclick = function () { fermer(); o.suivant(); };
        zoneSuite.appendChild(p);
      }
    }

    function resultat(texte) {
      actif = false; mic.classList.remove("on"); mic.innerHTML = "<span>🎤</span>Maintiens pour parler";
      if (!texte) {
        msg.textContent = "Je n'ai rien entendu. Rapproche-toi du micro, garde le doigt appuyé pendant que tu parles.";
        return;
      }
      var res = comparer(o.en, texte);
      afficher(res);
      var ok = res.score >= SEUIL;
      essais.push(ok); points();
      if (ok) {
        fini = true; son("juste");
        try { if (typeof addXP === "function") addXP(3); if (typeof bumpDailyGoal === "function") bumpDailyGoal(1); } catch (e) {}
        msg.textContent = "Bravo ! " + Math.round(res.score * 100) + " % des mots sont justes.";
        suite(true);
      } else {
        son("reessaie");
        var rouges = res.mots.filter(function (m) { return m.etat === 0; }).map(function (m) { return m.w; });
        msg.textContent = "J'ai entendu : « " + texte + " ».\n" + (rouges.length ? "À reprendre : " + rouges.slice(0, 3).join(", ") + ". Touche un mot pour l'écouter." : "Presque ! Réessaie plus doucement.");
        msg.style.whiteSpace = "pre-line";
        if (essais.filter(function (v) { return !v; }).length >= 2 && !fini) { setTimeout(function () { parler(o.en, 0.6); }, 500); }
        suite(false);
      }
    }

    function debut(ev) {
      if (actif) return;
      ev.preventDefault();
      try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
      actif = true; mic.classList.add("on"); mic.innerHTML = "<span>🎙️</span>Je t'écoute... relâche à la fin";
      zoneSuite.innerHTML = "";
      try {
        h = startListening("en-US", 12000, true);
        h.promise.then(function (r) { resultat(r && r.text); }, function () { resultat(""); });
      } catch (e) { actif = false; resultat(""); }
    }
    function fin() { if (actif && h) { try { h.stop(); } catch (e) {} } }
    mic.addEventListener("pointerdown", debut);
    mic.addEventListener("pointerup", fin);
    mic.addEventListener("pointercancel", fin);
    mic.addEventListener("pointerleave", fin);
    mic.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    mic.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { if (!actif) debut(e); else fin(); } });

    /* Le modele se lit tout seul a l'ouverture */
    setTimeout(function () { parler(o.en, 0.9); }, 350);
    return { fermer: fermer };
  }

  window.DiisooCoach = { ouvrir: ouvrir, supporte: ancien.supporte || { enregistrement: false, reconnaissance: true }, version: 2, _comparer: comparer };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-coach2.js",e);}

try{
/* ---- diisoo-parrainage.js ---- */
/* diisoo-parrainage.js v1 : parrainage plus parlant
   - Carte d'accueil : barre de progression vers 3 amis (1 mois Premium) puis 10 amis (Pack Commerçants)
   - Partage en un geste (menu de partage du téléphone, sinon WhatsApp), message adapté à l'objectif et à la série
   - Ami invité : message d'accueil « un ami t'invite », qui explique que son premier exercice récompense son parrain
   - Palier atteint : bouton « Réclamer ma récompense » qui ouvre WhatsApp avec un message prêt (code + numéro)
   S'appuie sur le système existant (monCodeRef, compter_parrainages, valider au premier exercice). Aucune table en plus. */
(function () {
  "use strict";

  var WA = "221772882109";
  function $(id) { return document.getElementById(id); }
  function lire(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function code() { try { return monCodeRef(); } catch (e) { return lire("diisoo_ref_code", ""); } }
  function nb() { return lire("diisoo_ref_nb", 0) | 0; }

  /* ---------- partage en un geste ---------- */
  var PHRASE = {
    visa: "pour préparer son visa et son examen d'anglais",
    business: "pour l'anglais du commerce et des affaires",
    tourisme: "pour parler anglais avec les touristes",
    wolof: "pour apprendre le wolof et l'anglais"
  };
  function message() {
    var o = lire("diisoo_obj", null), s = lire("diisoo_streak", null);
    var jours = s && typeof s === "object" ? (s.count || s.n || 0) : (+s || 0);
    var but = o && PHRASE[o.but] ? PHRASE[o.but] : "pour apprendre l'anglais et le wolof avec la voix";
    var deb = jours > 1 ? "🔥 " + jours + " jours d'affilée sur Diisoo, l'application " + but + ". " : "Je te recommande Diisoo, l'application " + but + ". ";
    return deb + "C'est gratuit, ça marche sur téléphone : https://diisoo.sn/?ref=" + code();
  }
  window.partagerDiisoo = function () {
    var m = message();
    if (navigator.share) {
      navigator.share({ title: "Diisoo", text: m }).catch(function () {});
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(m), "_blank", "noopener");
    }
    setTimeout(function () { try { majCompteurParrainage(); } catch (e) {} }, 2000);
  };

  /* ---------- carte avec progression ---------- */
  var st = document.createElement("style");
  st.textContent =
    ".pr-b{height:8px;border-radius:99px;background:#0B0F1C;overflow:hidden;margin:6px 0 4px;position:relative}" +
    ".pr-b i{display:block;height:100%;background:linear-gradient(90deg,#3FAE74,#F3A94E);border-radius:99px;transition:width .4s}" +
    ".pr-r{display:block;width:100%;min-height:44px;margin-top:6px;border:0;border-radius:12px;background:#25D366;color:#fff;font-size:13px;font-weight:800}" +
    "#pr-accueil{position:fixed;left:12px;right:12px;bottom:12px;z-index:9985;background:#12351F;border:1px solid #3FAE74;border-radius:16px;padding:12px 14px;color:#F6F1E7;font-size:13px;line-height:1.4;box-shadow:0 8px 24px rgba(0,0,0,.5)}" +
    "#pr-accueil button{margin-top:8px;min-height:44px;width:100%;border:0;border-radius:12px;background:#25D366;color:#fff;font-weight:800;font-size:14px}";
  document.head.appendChild(st);

  function dessiner() {
    var el = $("ref-compteur");
    if (!el) return;
    var n = nb(), cible = n >= 3 ? 10 : 3, pct = Math.min(100, Math.round(n / cible * 100));
    var txt = n >= 10 ? "🎁 " + n + " amis actifs : Pack Commerçants offert !"
      : n >= 3 ? "🎁 " + n + " amis actifs : 1 mois Premium gagné. Encore " + (10 - n) + " pour le Pack Commerçants."
      : n + " / 3 amis actifs. Encore " + (3 - n) + " pour 1 mois Premium.";
    var h = '<span style="display:block">' + txt + '</span><span class="pr-b"><i style="width:' + pct + '%"></i></span>' +
      '<span style="display:block;font-size:10px;color:#A69C86;font-weight:400">Un ami compte quand il a fait son premier exercice.</span>';
    var fait = lire("diisoo_ref_reclame", 0) | 0, palier = n >= 10 ? 10 : n >= 3 ? 3 : 0;
    el.innerHTML = h;
    if (palier && fait < palier) {
      var b = document.createElement("span");
      b.className = "pr-r"; b.setAttribute("role", "button"); b.style.lineHeight = "44px"; b.style.textAlign = "center";
      b.textContent = "🎁 Activée automatiquement. Un souci ? Écris-nous";
      b.onclick = function (ev) {
        ev.stopPropagation();
        var p = lire("diisoo_profile", {}) || {};
        var m = "Bonjour Diisoo, ma récompense de parrainage n'est pas activée. J'ai invité " + n + " amis. Mon code : " + code() + (p.phone ? ". Mon numéro WhatsApp : " + p.phone : "") +
          ". Récompense attendue : " + (palier >= 10 ? "le Pack Commerçants" : "1 mois Premium") + ".";
        window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(m), "_blank", "noopener");
        ecrire("diisoo_ref_reclame", palier);
        setTimeout(dessiner, 500);
      };
      el.appendChild(b);
    }
  }

  /* chaque mise à jour du compteur existant est redessinée avec la barre */
  var orig = window.majCompteurParrainage;
  if (typeof orig === "function") {
    window.majCompteurParrainage = function () {
      var r; try { r = orig.apply(this, arguments); } catch (e) {}
      Promise.resolve(r).then(dessiner, dessiner);
      return r;
    };
  }
  try { new MutationObserver(function () { var e = $("ref-compteur"); if (e && !e.querySelector(".pr-b")) dessiner(); }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  setTimeout(dessiner, 1500);

  /* ---------- lien code -> numéro : la récompense s'accorde alors toute seule ---------- */
  function lier() {
    try {
      var pr = lire("diisoo_profile", {}) || {};
      if (!pr.phone || typeof db === "undefined" || !db || lire("diisoo_ref_lie", "") === pr.phone + code()) return;
      db.rpc("lier_code_parrain", { p_code: code(), p_whatsapp: pr.phone }).then(function (r) {
        if (r && !r.error) {
          ecrire("diisoo_ref_lie", pr.phone + code());
          try { if (typeof majStatutAcces === "function") majStatutAcces(); } catch (e) {}
        }
      }, function () {});
    } catch (e) {}
  }
  setTimeout(lier, 4000);
  window.addEventListener("online", lier);
  setInterval(function () { try { if (typeof majStatutAcces === "function" && nb() >= 3) majStatutAcces(); } catch (e) {} }, 60000);

  /* ---------- accueil de l'ami invité ---------- */
  setTimeout(function () {
    var parrain = lire("diisoo_ref_parrain", ""), vu = lire("diisoo_ref_accueil", 0);
    var ecran = $("screen-dashboard");
    if (!parrain || vu || !ecran || ecran.offsetParent === null) return;
    ecrire("diisoo_ref_accueil", 1);
    var d = document.createElement("div"); d.id = "pr-accueil";
    d.innerHTML = "🎁 <b>Un ami t'a invité sur Diisoo.</b><br>Fais ton premier exercice : cela lui compte pour sa récompense, et tu démarres ton objectif.";
    var b = document.createElement("button"); b.type = "button"; b.textContent = "C'est parti";
    b.onclick = function () { d.remove(); };
    d.appendChild(b); document.body.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.remove(); }, 15000);
  }, 5000);

  window.DiisooParrainage = { version: 1, message: message };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-parrainage.js",e);}

try{
/* ---- diisoo-oral.js ---- */
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

}catch(e){console.error("Diisoo : erreur dans diisoo-oral.js",e);}

try{
/* ---- diisoo-exams2.js ---- */
/* diisoo-exams2.js v6 (pause, temps de réflexion réglable, passage automatique coupé par défaut, micro plus patient) ; base v5 : « Format réel » des examens, piloté par un registre
   Lit exam-formats.json : pour chaque examen, les tâches (type, nombre, préparation, durée de réponse) et les tests.
   Types gérés : repeat (écoute et répète), readaloud (lire à voix haute), question (réponse orale chronométrée),
   prompt (consigne affichée), describe (photo ou graphique), info (document puis questions),
   retell (résumer un cours entendu), short (réponse courte).
   v3 : fin de parole détectée par le micro, correction et suggestions (diisoo-oral.js), passage automatique à la question suivante,
   import des anciens thèmes IELTS (TEST_BANK) enrichis d'un enregistrement et de la partie « poser des questions ».
   Pour suivre un changement du vrai examen, on modifie exam-formats.json seulement : aucun code à toucher. */
(function () {
  "use strict";

  var REG = null, PROM = null;
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function charger() {
    if (PROM) return PROM;
    PROM = fetch("exam-formats.json", { cache: "no-cache" }).then(function (r) { return r.json(); })
      .then(function (j) { REG = j; return j; }).catch(function () { PROM = null; return null; });
    return PROM;
  }
  function son(n) { try { if (window.DiisooSon && window.DiisooSon.jouer) window.DiisooSon.jouer(n); } catch (e) {} }
  function attendre(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  /* ---------- comparaison ---------- */
  function mots(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean); }
  function comparer(cible, entendu) {
    if (window.DiisooCoach && window.DiisooCoach._comparer) return window.DiisooCoach._comparer(cible, entendu);
    var H = mots(entendu), res = [], ok = 0;
    mots(cible).forEach(function (w) { var v = H.indexOf(w) > -1; if (v) ok++; res.push({ w: w, etat: v ? 2 : 0 }); });
    return { mots: res, score: res.length ? ok / res.length : 0 };
  }

  /* ---------- graphique en barres (PTE : décrire un graphique) ---------- */
  function graphique(g) {
    var W = 320, H = 190, m = 28, max = Math.max.apply(null, g.valeurs), n = g.valeurs.length, bw = (W - 2 * m) / n * 0.6, gap = (W - 2 * m) / n, s = "";
    s += '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" style="width:100%;background:#fff;border-radius:12px">';
    s += '<text x="' + W / 2 + '" y="16" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#222">' + esc(g.titre) + "</text>";
    s += '<line x1="' + m + '" y1="' + (H - 28) + '" x2="' + (W - m + 6) + '" y2="' + (H - 28) + '" stroke="#444"/>';
    g.valeurs.forEach(function (v, i) {
      var h = (H - 70) * v / max, x = m + i * gap + (gap - bw) / 2, y = H - 28 - h;
      s += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + h + '" fill="#2f5ca3" rx="3"/>';
      s += '<text x="' + (x + bw / 2) + '" y="' + (y - 4) + '" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#222">' + v + "</text>";
      s += '<text x="' + (x + bw / 2) + '" y="' + (H - 12) + '" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#222">' + esc(g.labels[i]) + "</text>";
    });
    return s + "</svg>";
  }

  /* ---------- styles ---------- */
  var st = document.createElement("style");
  st.textContent =
    ".fx-reel{width:100%;min-height:56px;margin:6px 0 4px;border-radius:16px;border:0;background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;font-size:15px;font-weight:800;text-align:left;padding:8px 14px}" +
    ".fx-reel small{display:block;font-size:11px;font-weight:600;opacity:.85}" +
    "#dii-fmt{position:fixed;inset:0;z-index:99980;background:rgba(5,8,18,.96);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-fmt .fm-box{width:100%;max-width:520px;max-height:96vh;overflow-y:auto;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px 22px 0 0;padding:16px 16px 22px;color:#F6F1E7}" +
    "#dii-fmt .fm-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}" +
    "#dii-fmt .fm-x{width:44px;height:44px;border-radius:50%;background:#141A2B;border:1px solid #1E2740;color:#A69C86;font-size:16px;flex:none}" +
    "#dii-fmt .fm-tt{flex:1;text-align:center;font-size:11px;font-weight:700;letter-spacing:.08em;color:#8C8064;text-transform:uppercase}" +
    "#dii-fmt .fm-pg{height:6px;border-radius:99px;background:#141A2B;overflow:hidden;margin:0 0 12px}" +
    "#dii-fmt .fm-pg i{display:block;height:100%;background:#3FAE74}" +
    "#dii-fmt h3{font-size:20px;font-weight:800;margin:4px 0;text-align:center}" +
    "#dii-fmt .fm-p{font-size:13px;color:#A69C86;line-height:1.45;margin:6px 0;text-align:center}" +
    "#dii-fmt .fm-big{font-size:20px;font-weight:700;line-height:1.35;text-align:center;margin:12px 0}" +
    "#dii-fmt .fm-ico{font-size:50px;text-align:center;margin:8px 0}" +
    "#dii-fmt .fm-b{display:block;width:100%;min-height:52px;margin-top:8px;border:0;border-radius:14px;background:#25D366;color:#fff;font-size:16px;font-weight:800}" +
    "#dii-fmt .fm-b.s{background:#141A2B;border:1px solid #1E2740;color:#E4DCC9;font-weight:700;font-size:14px}" +
    "#dii-fmt .fm-b.l{opacity:.55}" +
    "#dii-fmt .fm-cd{height:10px;border-radius:99px;background:#141A2B;overflow:hidden;margin:12px 0 4px}" +
    "#dii-fmt .fm-cd i{display:block;height:100%;background:#E5484D;transition:width .25s linear}" +
    "#dii-fmt .fm-sec{text-align:center;font-size:30px;font-weight:800;color:#F3A94E}" +
    "#dii-fmt .fm-mots{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:10px 0}" +
    "#dii-fmt .fm-m{padding:6px 10px;border-radius:10px;border:2px solid #1E2740;background:#141A2B;font-size:16px;font-weight:700}" +
    "#dii-fmt .fm-m.v{border-color:#25D366;background:#12351F}#dii-fmt .fm-m.o{border-color:#F3A94E;background:#3A2A10}#dii-fmt .fm-m.r{border-color:#E5484D;background:#3A1515}" +
    "#dii-fmt .fm-tr{background:#141A2B;border:1px solid #1E2740;border-radius:12px;padding:10px;font-size:14px;line-height:1.4;margin:8px 0;color:#C9BFA8}" +
    "#dii-fmt .fm-doc{background:#F6F1E7;color:#1b1b1b;border-radius:12px;padding:12px;margin:8px 0;font-size:14px;line-height:1.6}" +
    "#dii-fmt .fm-doc b{display:block;margin-bottom:4px}" +
    "#dii-fmt .fm-img{margin:8px 0;border-radius:12px;overflow:hidden}#dii-fmt .fm-img svg{width:100%;height:auto;display:block}" +
    "#dii-fmt .fm-src{font-size:11px;color:#8C8064;text-align:center;margin-top:10px;line-height:1.4}";
  document.head.appendChild(st);
  var st2 = document.createElement("style");
  st2.textContent =
    "@keyframes fmpulse{0%{transform:scale(1)}50%{transform:scale(1.12)}100%{transform:scale(1)}}" +
    "#dii-fmt .fm-ico.on{animation:fmpulse 1.1s infinite}" +
    "#dii-fmt .fm-live{min-height:42px;background:#141A2B;border:1px dashed #2a3350;border-radius:12px;padding:8px 10px;font-size:14px;color:#E4DCC9;line-height:1.35;margin:8px 0;text-align:center}" +
    "#dii-fmt .fm-sug{background:#141A2B;border:1px solid #1E2740;border-radius:12px;padding:10px;margin:8px 0;font-size:13px;line-height:1.5;color:#E4DCC9}" +
    "#dii-fmt .fm-sug b{display:block;color:#F3A94E;font-size:12px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}" +
    "#dii-fmt .fm-sug small{display:block;color:#A69C86;font-size:11px;margin:1px 0 6px}" +
    "#dii-fmt .fm-auto{height:6px;border-radius:99px;background:#141A2B;overflow:hidden;margin:10px 0 4px}" +
    "#dii-fmt .fm-auto i{display:block;height:100%;width:100%;background:#25D366}" +
    "#exam-tests.fx-seul>*:not(.et-retour):not(.fx-reel){display:none!important}";
  document.head.appendChild(st2);

  var st3 = document.createElement("style");
  st3.textContent =
    "#dii-fmt .fm-box{background:radial-gradient(120% 70% at 50% 0%,#18233f 0%,#0B0F1C 62%);border-color:#2a3558}" +
    "#dii-fmt .fm-top{margin-bottom:10px}" +
    "#dii-fmt .fm-bd{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:99px;background:linear-gradient(90deg,#F3A94E,#E2703E);color:#1a1206;font-size:12px;font-weight:900;letter-spacing:.06em}" +
    "#dii-fmt .fm-tt{font-size:12px;color:#9fb4ff}" +
    "#dii-fmt .fm-pg{height:5px;margin-bottom:14px}#dii-fmt .fm-pg i{background:linear-gradient(90deg,#3FAE74,#8fe3b0);transition:width .4s}" +
    "#dii-fmt .fm-in{display:flex;justify-content:center;margin:2px 0 10px}" +
    "#dii-fmt .fm-chip{display:inline-block;padding:5px 12px;border-radius:99px;background:#1a2340;border:1px solid #2a3558;font-size:11px;font-weight:800;letter-spacing:.05em;color:#9fb4ff;text-transform:uppercase}" +
    "#dii-fmt .fm-q{background:#121a30;border:1px solid #2a3558;border-radius:20px;padding:18px 14px;font-size:21px;font-weight:800;text-align:center;line-height:1.3;margin:6px 0 10px}" +
    "#dii-fmt .fm-q.sm{font-size:16px;font-weight:700}" +
    "#dii-fmt .fm-ring{position:relative;width:118px;height:118px;margin:8px auto 2px}" +
    "#dii-fmt .fm-ring svg{width:118px;height:118px;transform:rotate(-90deg)}" +
    "#dii-fmt .fm-ring .t{fill:none;stroke:#1b2542;stroke-width:9}#dii-fmt .fm-ring .p{fill:none;stroke:#F3A94E;stroke-width:9;stroke-linecap:round;stroke-dasharray:314.2;stroke-dashoffset:0;transition:stroke-dashoffset .25s linear}" +
    "#dii-fmt .fm-ring .n{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:34px;font-weight:900;color:#F6F1E7;line-height:1}" +
    "#dii-fmt .fm-ring .n small{font-size:20px;margin-bottom:2px}" +
    "#dii-fmt .fm-ring.rec .p{stroke:#E5484D}#dii-fmt .fm-ring.rec::after{content:'';position:absolute;inset:-7px;border-radius:50%;border:2px solid rgba(229,72,77,.55);animation:fmhalo 1.3s infinite}" +
    "@keyframes fmhalo{0%{transform:scale(.96);opacity:.9}100%{transform:scale(1.12);opacity:0}}" +
    "#dii-fmt .fm-state{text-align:center;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#8C8064;margin:4px 0 8px}" +
    "#dii-fmt .fm-state.rec{color:#E5484D}" +
    "#dii-fmt .fm-kw{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:8px 0}" +
    "#dii-fmt .fm-w{padding:6px 10px;border-radius:10px;background:#141A2B;border:1.5px solid #243055;font-size:16px;font-weight:700;color:#7d86a3;transition:all .2s}" +
    "#dii-fmt .fm-w.ok{color:#fff;background:#12351F;border-color:#25D366;transform:scale(1.05)}" +
    "#dii-fmt .fm-id{width:44px;height:44px;border-radius:50%;background:#141A2B;border:2px dashed #243055;display:flex;align-items:center;justify-content:center;font-size:20px;transition:all .25s}" +
    "#dii-fmt .fm-id.ok{border-style:solid;border-color:#25D366;background:#12351F}" +
    "#dii-fmt .fm-ids{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:10px 0}" +
    "#dii-fmt .fm-mt{height:8px;border-radius:99px;background:#141A2B;overflow:hidden;margin:6px 0 2px}#dii-fmt .fm-mt i{display:block;height:100%;width:0;background:linear-gradient(90deg,#4f8cff,#8fe3b0);transition:width .3s}" +
    "#dii-fmt .fm-mtl{display:flex;justify-content:space-between;font-size:11px;color:#8C8064;font-weight:700}" +
    "#dii-fmt .fm-cn{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin:6px 0}#dii-fmt .fm-cn span{padding:3px 9px;border-radius:99px;border:1px solid #243055;font-size:11px;font-weight:700;color:#5d6685}#dii-fmt .fm-cn span.ok{color:#8fe3b0;border-color:#25D366;background:#12351F}" +
    "#dii-fmt .fm-row{display:flex;gap:8px;margin-top:8px}#dii-fmt .fm-row .fm-b{margin-top:0;flex:1;min-height:46px;font-size:13px}" +
    "#dii-fmt .fm-nx{position:relative;overflow:hidden}#dii-fmt .fm-nx i{position:absolute;left:0;top:0;bottom:0;width:0;background:rgba(255,255,255,.22)}#dii-fmt .fm-nx span{position:relative}" +
    "#dii-fmt .fm-sc{display:flex;align-items:center;gap:14px;margin:6px 0 8px}" +
    "#dii-fmt .fm-sc .c{flex:none;width:76px;height:76px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border:6px solid #25D366;color:#F6F1E7}" +
    "#dii-fmt .fm-sc .c.o{border-color:#F3A94E}#dii-fmt .fm-sc .c.r{border-color:#E5484D}" +
    "#dii-fmt .fm-sc .d{flex:1;font-size:13px;color:#C9BFA8;line-height:1.4}#dii-fmt .fm-sc .d b{display:block;font-size:16px;color:#F6F1E7;margin-bottom:2px}" +
    "#dii-fmt .fm-hr{font-size:12px;color:#8C8064;text-align:center;margin:4px 0}" +
    "#dii-fmt .fm-tl{margin:8px 0}#dii-fmt .fm-tl div{display:flex;align-items:center;gap:10px;padding:9px 4px;border-bottom:1px solid #1b2542;font-size:14px;font-weight:700}#dii-fmt .fm-tl em{margin-left:auto;font-style:normal;font-size:11px;color:#8C8064;font-weight:700}" +
    "#dii-fmt .fm-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}" +
    "#dii-fmt .fm-tc{border:1.5px solid #2a3558;border-radius:16px;background:#121a30;color:#F6F1E7;padding:12px 10px;text-align:left;min-height:84px}#dii-fmt .fm-tc b{display:block;font-size:22px;color:#F3A94E}#dii-fmt .fm-tc small{font-size:12px;color:#A69C86;line-height:1.3}#dii-fmt .fm-tc.l{opacity:.6}" +
    "#dii-fmt .fm-st{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:6px 0}" +
    "#dii-fmt .fm-sk{margin:8px 0}#dii-fmt .fm-sk div.h{display:flex;justify-content:space-between;font-size:13px;font-weight:800}#dii-fmt .fm-sk .b{height:10px;border-radius:99px;background:#141A2B;overflow:hidden;margin-top:4px}#dii-fmt .fm-sk .b i{display:block;height:100%;border-radius:99px}" +
    "#dii-fmt .fm-doc{cursor:pointer}#dii-fmt .fm-doc div.hl{background:#ffe58a;border-radius:4px}" +
    "#dii-fmt details{margin-top:12px;font-size:11px;color:#8C8064}#dii-fmt summary{cursor:pointer;text-align:center}";
  document.head.appendChild(st3);

  /* ---------- lecteur ---------- */
  var ov = null, jeton = 0, minuteur = null, ecoute = null, vadT = null, autoT = null;
  /* Réglages de l'élève : temps de réflexion avant de parler, passage automatique à la question suivante */
  var DUREES = { court: 8, normal: 20, long: 45, libre: 0 };
  function reglages() {
    var r = {}; try { r = JSON.parse(localStorage.getItem("diisoo_exam_reglages") || "{}") || {}; } catch (e) {}
    return { reflexion: DUREES[r.reflexion] !== undefined ? r.reflexion : "normal", auto: r.auto === true };
  }
  function sauverReglage(cle, val) { var r = reglages(); r[cle] = val; try { localStorage.setItem("diisoo_exam_reglages", JSON.stringify(r)); } catch (e) {} }
  function AUTO() { return reglages().auto; }
  var pauseCb = null, courant = 0;
  /* reprise : la question en cours est gardee 24 h, pour reprendre apres une coupure ou un depart */
  function repriseLire(cle) {
    try { var r = JSON.parse(localStorage.getItem("diisoo_exam_reprise") || "null");
      if (r && r.cle === cle && r.k > 0 && Date.now() - r.t < 86400000) return r; } catch (e) {}
    return null;
  }
  function repriseEcrire(cle, ti, k, n) { try { localStorage.setItem("diisoo_exam_reprise", JSON.stringify({ cle: cle, ti: ti, k: k, n: n, t: Date.now() })); } catch (e) {} }
  function repriseEffacer() { try { localStorage.removeItem("diisoo_exam_reprise"); } catch (e) {} }

  function nettoyer() {
    jeton++;
    if (minuteur) { clearInterval(minuteur); minuteur = null; }
    if (vadT) { clearInterval(vadT); vadT = null; }
    if (autoT) { clearTimeout(autoT); autoT = null; }
    if (ecoute) { try { ecoute.stop(); } catch (e) {} ecoute = null; }
    try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
  }
  function fermer() { pauseCb = null; nettoyer(); if (ov) { ov.remove(); ov = null; } }

  var BADGE = "";
  function cadre(titre, prog) {
    if (!ov) {
      ov = el("div"); ov.id = "dii-fmt"; ov.setAttribute("role", "dialog");
      ov.appendChild(el("div", "fm-box")); document.body.appendChild(ov);
    }
    var box = ov.firstChild; box.innerHTML = ""; box.scrollTop = 0;
    var top = el("div", "fm-top");
    var x = el("button", "fm-x", "✕"); x.type = "button"; x.setAttribute("aria-label", "Fermer"); x.onclick = fermer;
    top.appendChild(x);
    var mid = el("div", "fm-tt"); mid.style.display = "flex"; mid.style.flexDirection = "column"; mid.style.alignItems = "center"; mid.style.gap = "3px";
    if (BADGE) mid.appendChild(el("span", "fm-bd", BADGE));
    mid.appendChild(el("span", null, titre || ""));
    top.appendChild(mid);
    if (pauseCb && titre !== "Pause") {
      var pz0 = el("button", "fm-x", "⏸"); pz0.type = "button"; pz0.setAttribute("aria-label", "Pause"); pz0.onclick = function () { pauseCb(); };
      top.appendChild(pz0);
    } else { top.appendChild(el("div")); top.lastChild.style.width = "44px"; }
    box.appendChild(top);
    if (prog != null) { var pg = el("div", "fm-pg"); var i = el("i"); i.style.width = Math.round(prog * 100) + "%"; pg.appendChild(i); box.appendChild(pg); }
    return box;
  }
  function bouton(box, txt, fn, cls) { var b = el("button", "fm-b" + (cls ? " " + cls : ""), txt); b.type = "button"; b.onclick = fn; box.appendChild(b); return b; }

  /* contenu visuel d'un item : photo, graphique, document (lignes à surligner du doigt) */
  function support(box, e, sansTexte) {
    var it = e.item;
    if (it && typeof it === "object") {
      if (it.scene) {
        var im = el("div", "fm-img");
        try { im.innerHTML = window.DiisooExams ? window.DiisooExams.scene(it.scene) : ""; } catch (x) {}
        box.appendChild(im);
      }
      if (it.graphique) { var gi = el("div", "fm-img"); gi.innerHTML = graphique(it.graphique); box.appendChild(gi); }
    }
    if (e.doc) {
      var d = el("div", "fm-doc"); var t = el("b", null, e.doc.titre); d.appendChild(t);
      e.doc.lignes.forEach(function (l) { var r = el("div", null, l); r.onclick = function () { r.classList.toggle("hl"); }; d.appendChild(r); });
      box.appendChild(d);
      box.appendChild(el("div", "fm-hr", "Touche une ligne pour la surligner"));
    }
    if (e.visible && !sansTexte) box.appendChild(el("div", "fm-q", e.visible));
  }
  var ICONES = { repeat: "🔁", readaloud: "📖", question: "❓", prompt: "💬", describe: "🖼️", info: "📄", retell: "🎧", short: "⚡" };
  function courte(t) { var c = String(t || "").split(/[.:]/)[0]; return c.length > 60 ? c.slice(0, 57) + "…" : c; }
  function faibles() { try { return JSON.parse(localStorage.getItem("diisoo_fmt_faibles") || "[]") || []; } catch (e) { return []; } }
  function memoFaibles(liste) {
    try { var f = faibles(); liste.forEach(function (w) { if (f.indexOf(w) < 0) f.push(w); }); localStorage.setItem("diisoo_fmt_faibles", JSON.stringify(f.slice(-40))); } catch (e) {}
  }

  /* ---------- accueil d'un examen ---------- */
  var BANAL = /^(about|every|there|their|would|which|always|because|today|while|other|these|those|after|before|again|really|still|three|small)$/;
  function clesDe(txt) {
    var vus = {}, out = [];
    (txt.match(/[A-Za-z']{5,}|\b\d+\b/g) || []).forEach(function (w) {
      var k = w.toLowerCase(); if (BANAL.test(k) || vus[k]) return; vus[k] = 1; if (out.length < 8) out.push(k);
    });
    return out;
  }
  function enrichir() {
    try {
      Object.keys(REG.examens).forEach(function (k) {
        var ex = REG.examens[k];
        if (!ex.import_ancien || !ex.enregistrements || ex._imp || typeof TEST_BANK === "undefined") return;
        ex._imp = true;
        TEST_BANK.forEach(function (t) {
          var rec = ex.enregistrements[t.id];
          if (!rec || ex.tests.some(function (x) { return x.id === "ie-" + t.id; })) return;
          var ph = {}; (t.phases || []).forEach(function (p) { ph[p.id] = p.questions || []; });
          var th = t.topic;
          ex.tests.push({ id: "ie-" + t.id, titre: th,
            p1a: (ph["1a"] || []).slice(0, 3), p1b: (ph["1b"] || []).slice(0, 5),
            ask: ["Ask the examiner three questions about this theme: " + th + ". Start with What, Where or Do you."],
            p2a: [{ t: rec, cles: clesDe(rec) }],
            p2b: (ph["2b"] || []).slice(0, 2).concat(["What do you like or dislike about " + th.toLowerCase().replace(/&/g, "and") + "? Explain why."]) });
        });
      });
    } catch (e) { console.warn("[diisoo] import examens", e); }
    try { deriver(); } catch (e) { console.warn("[diisoo] derive examens", e); }
  }
  /* Tests supplementaires : chaque theme du vieux jeu (27 themes) devient un test pour TOEFL, Cambridge A2/B1 et Duolingo */
  var SCN = { neighbours: "family", family: "family", work: "office", shopping: "shop", travel: "airport", health: "gym", food: "kitchen", shopping_food: "market", transport_travel: "bus", health_emergencies: "gym", family_reunion: "airport", airport: "airport", hotel: "cafe", money: "shop", clothes: "shop", friends: "cafe", phone: "tech", jobs: "office", restaurant: "cafe", weekend: "beach", festivals: "market", farming: "market", bank: "office", school: "classroom", home: "kitchen", holidays: "beach", "free-time": "gym" };
  var ASQ = [{ q: "What do you call the person who teaches you at school?", a: ["teacher", "professor"] }, { q: "What season comes after summer?", a: ["autumn", "fall"] }, { q: "What do you use to write on paper?", a: ["pen", "pencil"] }, { q: "Which is bigger, an elephant or a cat?", a: ["elephant"] }, { q: "What do you call the place where you buy medicine?", a: ["pharmacy", "chemist"] }, { q: "What is the opposite of hot?", a: ["cold"] }, { q: "How many days are there in a week?", a: ["seven", "7"] }, { q: "What do you drink when you are thirsty?", a: ["water"] }, { q: "What colour is the sky on a clear day?", a: ["blue"] }, { q: "What do you call a doctor who takes care of children?", a: ["pediatrician", "paediatrician"] }, { q: "What do you wear on your feet?", a: ["shoes", "socks", "sandals"] }, { q: "Which month comes after March?", a: ["april"] }, { q: "What is the place where you borrow books?", a: ["library"] }, { q: "What do you call the money you pay to a landlord each month?", a: ["rent"] }, { q: "Which animal gives us milk?", a: ["cow", "goat", "sheep"] }, { q: "What do you use to call a friend?", a: ["phone", "telephone", "mobile"] }, { q: "How many minutes are there in an hour?", a: ["sixty", "60"] }, { q: "What is the opposite of expensive?", a: ["cheap"] }, { q: "What do farmers grow in a field?", a: ["crops", "vegetables", "rice", "millet", "corn"] }, { q: "Where do you wait for a plane?", a: ["airport"] }, { q: "What do we call the day after today?", a: ["tomorrow"] }, { q: "What do you use to cut paper?", a: ["scissors"] }, { q: "What is the capital city of Senegal?", a: ["dakar"] }, { q: "What do you do with a key?", a: ["open", "lock", "unlock"] }];
  function deriver() {
    if (typeof TEST_BANK === "undefined" || !REG || REG._der) return;
    REG._der = true;
    var ie = REG.examens.ielts, rec = (ie && ie.enregistrements) || {};
    TEST_BANK.forEach(function (t) {
      var ph = {}; (t.phases || []).forEach(function (p) { ph[p.id] = p.questions || []; });
      var th = t.topic, tl = th.toLowerCase().replace(/&/g, "and"), sc = SCN[t.id] || "cafe";
      var q1 = (ph["1b"] || []).slice(0, 5), q2 = ph["2b"] || [], id = "x-" + t.id;
      var sens = String(rec[t.id] || "").replace(/([.!?])\s+/g, "$1\u0001").split("\u0001").filter(function (x) { return x.split(/\s+/).length >= 3; }).slice(0, 7);
      function add(k, test) { var ex = REG.examens[k]; if (!ex || ex.tests.some(function (x) { return x.id === id; })) return; test.id = id; test.titre = th; ex.tests.push(test); }
      add("toefl", { repeat: sens.length >= 3 ? sens : q1,
        question: ["What do you think about " + tl + "? Explain your answer.", q2[0] || "Why is " + tl + " important?", q2[1] || "Tell me about your experience with " + tl + ".", "Tell me about a time related to " + tl + ". What happened?"] });
      add("cambridge_a2", { p1: q1.concat(q2.slice(0, 1)).slice(0, 6),
        p2: [{ scene: sc, consigne: "Look at the picture. Do you like " + tl + "? Say why." }, { scene: sc, consigne: "Look at the picture. What can you see? What are the people doing?" }] });
      add("cambridge_b1", { p1: q1.concat(["Tell me about your experience with " + tl + "."]).slice(0, 6),
        p2: [{ scene: sc, consigne: "Talk about the photo: where are the people, what are they doing, and why do you think they are there?" }],
        p3: ["You and a friend are talking about " + tl + ". Talk about two ideas and say which one is best."],
        p4: q2.slice(0, 2).concat(["How has " + tl + " changed in your country?", "Do you think " + tl + " is important for young people? Why?"]) });
      var h = Math.ceil(sens.length / 2), ra1 = sens.slice(0, h).join(" "), ra2 = sens.slice(h).join(" "), sc2 = { office: "tech", tech: "office", shop: "market", market: "shop", cafe: "kitchen", kitchen: "cafe", family: "kitchen", beach: "family", gym: "classroom", classroom: "gym", bus: "airport", airport: "bus" }[sc] || "cafe";
      if (sens.length >= 4 && ra1.split(/\s+/).length >= 8 && ra2.split(/\s+/).length >= 8) add("toeic", {
        readaloud: [ra1, ra2], describe: [{ scene: sc }, { scene: sc2 }],
        q15: [q1[0] || "Do you like " + tl + "?", q1[1] || "Tell me about " + tl + "."], q30: [q2[0] || "Why is " + tl + " important?"],
        info: [{ doc: { titre: "Short text · " + th, lignes: sens }, questions: ["Who is speaking in this text?", "What is the main idea of the text?", "Could you give me more details about what is described in the text?"] }],
        opinion: ["What do you think about " + tl + "? Give reasons and examples to support your opinion."] });
      if (sens.length >= 4 && ra1.split(/\s+/).length >= 8 && ra2.split(/\s+/).length >= 8) {
        var hv = 0; for (var hi = 0; hi < t.id.length; hi++) hv = (hv * 31 + t.id.charCodeAt(hi)) % 997;
        var gr = function (titre, labels, k) { return { graphique: { titre: titre + " (example data)", labels: labels, valeurs: labels.map(function (_, i) { return 4 + ((hv * (k + 3) + i * 7 * (k + 1)) % 17); }) } }; };
        var shorts = ASQ.slice((hv % ASQ.length)).concat(ASQ).slice(0, 8);
        add("pte", { intro: ["Introduce yourself. Include your name, where you are from, and your interests. Then say what you think about " + tl + "."],
          readaloud: [ra1, ra2], repeat: sens.slice(0, 6),
          describe: [gr("People interested in " + tl + " by weekday", ["Mon", "Tue", "Wed", "Thu", "Fri"], 1), gr("Interest in " + tl + " by month", ["Jun", "Jul", "Aug", "Sep", "Oct"], 2), gr("Interest in " + tl + " by age group", ["10-19", "20-29", "30-39", "40-49"], 3)],
          retell: [{ t: ra1, cles: clesDe(ra1) }, { t: ra2, cles: clesDe(ra2) }], short: shorts });
      }
      add("duolingo", { photo: [{ scene: sc }], lire: ["Describe a time related to " + tl + ". What did you do, and how did you feel?"],
        inter: q1.concat(q2).slice(0, 6), echant: ["Talk about " + tl + " and explain why it matters in your life."] });
    });
  }
  function nbReel(ex, t) {
    var test = ex.tests[0], b = test[t.banque || t.type];
    if (t.type === "info") return t.nb;
    return b ? Math.min(t.nb, b.length) : t.nb;
  }
  function ouvrir(cle) {
    var ex = REG && REG.examens && REG.examens[cle]; if (!ex) return;
    enrichir();
    nettoyer();
    BADGE = ex.bouton ? ex.groupe + " " + ex.bouton : ex.court;
    var box = cadre("Format réel");
    box.appendChild(el("h3", null, ex.nom));
    var minutes = Math.max(1, Math.round(ex.taches.reduce(function (s, t) {
      return s + (t.type === "info" ? t.nb * ((t.lecture_s || 0) / Math.max(1, t.nb) + 20) : t.nb * ((t.rep_s || 10) + 8));
    }, 0) / 60));
    var st = el("div", "fm-st");
    st.appendChild(el("span", "fm-chip", "⏱ ~" + minutes + " min"));
    st.appendChild(el("span", "fm-chip", ex.taches.length + " parties"));
    st.appendChild(el("span", "fm-chip", "🎙️ Micro"));
    box.appendChild(st);
    var tl = el("div", "fm-tl");
    ex.taches.forEach(function (t) {
      var r = el("div"); r.appendChild(el("span", null, (ICONES[t.type] || "•") + " " + t.titre));
      r.appendChild(el("em", null, nbReel(ex, t) + " × " + (t.type === "info" ? t.reps.join("/") : t.rep_s) + " s"));
      tl.appendChild(r);
    });
    box.appendChild(tl);
    var libre = false; try { libre = typeof aAcces === "function" && aAcces("premium"); } catch (e) {}
    var rp = repriseLire(cle);
    if (rp && ex.tests[rp.ti]) {
      var br = el("button", "fm-b", "▶ Reprendre le test " + (rp.ti + 1) + " (question " + (rp.k + 1) + " / " + rp.n + ")"); br.type = "button";
      br.onclick = function () { lancer(cle, rp.ti, rp.k); };
      box.appendChild(br);
    }
    var grille = el("div", "fm-grid");
    ex.tests.forEach(function (t, i) {
      var verrou = i >= (ex.gratuits || 1) && !libre;
      var b = el("button", "fm-tc" + (verrou ? " l" : "")); b.type = "button";
      b.innerHTML = "<b>" + (verrou ? "⭐ " : "") + (i + 1) + "</b><small>" + esc(t.titre) + "</small>";
      b.onclick = function () {
        if (verrou) { try { toast("Ce test est réservé aux abonnés Diisoo Plus."); openPremium(); } catch (e) {} return; }
        lancer(cle, i);
      };
      grille.appendChild(b);
    });
    box.appendChild(grille);
    var fb = faibles();
    if (fb.length) bouton(box, "📌 Mots à revoir (" + fb.length + ")", function () { revoir(cle); }, "s");
    var dt = el("details"); dt.appendChild(el("summary", null, "À propos de ce test"));
    dt.appendChild(el("p", "fm-src", ex.confiance + " Dernière vérification : " + ex.verifie_le + ". Tests créés par Diisoo, sans affiliation avec les organismes d'examen."));
    box.appendChild(dt);
  }

  /* mots à revoir : touche un mot pour l'entendre, redis-le, puis efface-le de la liste */
  function revoir(cle) {
    var box = cadre("Mots à revoir");
    box.appendChild(el("h3", null, "📌 Mots à travailler"));
    box.appendChild(el("div", "fm-hr", "Touche un mot : tu l'entends. Dis-le à voix haute. Appui long pour l'effacer."));
    var wrap = el("div", "fm-kw");
    faibles().forEach(function (w) {
      var c = el("button", "fm-w", w); c.type = "button";
      var t0 = 0;
      c.onclick = function () { try { speak(w, "en-US", 0.8); } catch (x) {} };
      c.oncontextmenu = function (ev) { ev.preventDefault(); try { localStorage.setItem("diisoo_fmt_faibles", JSON.stringify(faibles().filter(function (z) { return z !== w; }))); } catch (x) {} c.remove(); };
      c.addEventListener("touchstart", function () { t0 = Date.now(); c._lp = setTimeout(function () { try { localStorage.setItem("diisoo_fmt_faibles", JSON.stringify(faibles().filter(function (z) { return z !== w; }))); } catch (x) {} c.remove(); }, 700); }, { passive: true });
      c.addEventListener("touchend", function () { clearTimeout(c._lp); }, { passive: true });
      wrap.appendChild(c);
    });
    box.appendChild(wrap);
    bouton(box, "Retour", function () { ouvrir(cle); }, "s");
  }

  /* ---------- déroulé d'un test ---------- */
  /* Entretien visa : questions tirées au sort dans une grande réserve, jamais les mêmes d'une séance à l'autre */
  function vusLire() { try { return JSON.parse(localStorage.getItem("diisoo_visa_vus") || "{}") || {}; } catch (e) { return {}; } }
  function tirer(ex, test, t, ti, depart) {
    var pool = (ex.pool && ex.pool[t.banque]) || [], ses = null;
    try { ses = JSON.parse(localStorage.getItem("diisoo_visa_session") || "null"); } catch (e) {}
    if (depart && ses && ses.ti === ti && ses.p && ses.p[t.banque]) {
      var rep = ses.p[t.banque].map(function (q) { return pool.filter(function (x) { return x.q === q; })[0]; }).filter(Boolean);
      if (rep.length) return rep;
    }
    var cand = pool.filter(function (x) { return test.dyn === "mixte" || !x.v || x.v.indexOf("*") > -1 || x.v.indexOf(test.dyn) > -1; });
    var vus = vusLire(), deja = vus[t.banque] || [];
    var neuves = cand.filter(function (x) { return deja.indexOf(x.q) < 0; });
    if (neuves.length < t.nb) { deja = []; neuves = cand.slice(); }
    neuves.sort(function () { return Math.random() - .5; });
    var pris = neuves.slice(0, t.nb);
    vus[t.banque] = deja.concat(pris.map(function (x) { return x.q; }));
    try {
      localStorage.setItem("diisoo_visa_vus", JSON.stringify(vus));
      if (!ses || ses.ti !== ti) ses = { ti: ti, p: {} };
      ses.p[t.banque] = pris.map(function (x) { return x.q; });
      localStorage.setItem("diisoo_visa_session", JSON.stringify(ses));
    } catch (e) {}
    return pris;
  }
  function lancer(cle, ti, depart) {
    var ex = REG.examens[cle], test = ex.tests[ti], etapes = [];
    if (test.dyn && !depart) { try { localStorage.removeItem("diisoo_visa_session"); } catch (e) {} }
    ex.taches.forEach(function (t) {
      var banque = test.dyn ? tirer(ex, test, t, ti, depart) : (test[t.banque || t.type] || []);
      if (t.type === "info") {
        banque.forEach(function (g) {
          g.questions.forEach(function (q, j) {
            etapes.push({ tache: { id: t.id, type: "question", titre: t.titre, prep_s: t.prep_s, rep_s: t.reps[j] || 15, consigne: t.consigne },
              i: j, n: g.questions.length, item: q, doc: g.doc, lecture: j === 0 ? t.lecture_s : 0 });
          });
        });
        return;
      }
      for (var i = 0; i < t.nb && i < banque.length; i++) etapes.push({ tache: t, i: i, n: Math.min(t.nb, banque.length), item: banque[i] });
    });
    var bilan = { precision: [], courtes: [], oraux: [], cles: [], corr: [], mots: [], expr: [] };
    pauseCb = function () {
      var kk = courant; nettoyer();
      var box = cadre("Pause", null);
      box.appendChild(el("div", "fm-ico", "⏸"));
      box.appendChild(el("div", "fm-state", "Examen en pause : rien ne bouge"));
      bouton(box, "▶ Reprendre cette question", function () { etape(kk); });
      box.appendChild(el("div", "fm-hr", "Temps de réflexion avant de parler"));
      var row = el("div", "fm-row"), cur = reglages();
      [["court", "8 s"], ["normal", "20 s"], ["long", "45 s"], ["libre", "Libre"]].forEach(function (o) {
        var b = el("button", "fm-b " + (cur.reflexion === o[0] ? "" : "s"), o[1]); b.type = "button"; b.style.minHeight = "44px";
        b.onclick = function () { sauverReglage("reflexion", o[0]); pauseCb(); }; row.appendChild(b);
      });
      box.appendChild(row);
      bouton(box, "Passage automatique : " + (cur.auto ? "oui" : "non"), function () { sauverReglage("auto", !cur.auto); pauseCb(); }, "s");
      bouton(box, "Quitter l'examen", fermer, "s");
    };

    function texteDe(e) { var it = e.item; return typeof it === "string" ? it : (it.t || it.q || it.consigne || ""); }
    function etape(k) {
      if (k >= etapes.length) return fin(cle, ti, bilan);
      var e = etapes[k], mon = ++jeton, ty = e.tache.type;
      courant = k; repriseEcrire(cle, ti, k, etapes.length); e.k = k; e.mon = mon; e.prog = k / etapes.length; e.titre = e.tache.titre + (e.n > 1 ? " " + (e.i + 1) + "/" + e.n : "");
      if (ty === "readaloud") return lire(e);
      if (ty === "prompt") return consigne(e);
      if (ty === "describe") return decrire(e);
      return ecouter(e);   /* repeat, question, retell, short */
    }

    function compte(box, sec, surFin, rec) {
      var ring = el("div", "fm-ring" + (rec ? " rec" : ""));
      ring.innerHTML = '<svg viewBox="0 0 118 118"><circle class="t" cx="59" cy="59" r="50"/><circle class="p" cx="59" cy="59" r="50"/></svg><div class="n"></div>';
      var tx = ring.querySelector(".n"), pr = ring.querySelector(".p");
      tx.textContent = String(sec); box.appendChild(ring);
      var t0 = Date.now(), tot = sec * 1000;
      if (minuteur) clearInterval(minuteur);
      minuteur = setInterval(function () {
        var r = Math.max(0, tot - (Date.now() - t0));
        tx.textContent = String(Math.ceil(r / 1000)); pr.style.strokeDashoffset = String(314.2 * (1 - r / tot));
        if (r <= 0) { clearInterval(minuteur); minuteur = null; if (surFin) surFin(); }
      }, 250);
      return ring;
    }
    function arret() { if (minuteur) { clearInterval(minuteur); minuteur = null; } }
    function puce(box, txt) { var w = el("div", "fm-in"); w.appendChild(el("span", "fm-chip", txt)); box.appendChild(w); }

    /* attente avant de parler : lecture du document, préparation */
    function preparer(e, secondes, libelle, suite, avecSupport) {
      var box = cadre(e.titre, e.prog);
      puce(box, courte(libelle));
      if (avecSupport) support(box, e);
      var go = function () { if (e.mon === jeton) { arret(); suite(); } };
      compte(box, secondes, go, false);
      box.appendChild(el("div", "fm-state", "Prépare-toi"));
      bouton(box, "Je suis prêt", go, "s");
    }

    function silenceMs(t) {
      if (t.silence_ms) return t.silence_ms;
      if (t.type === "short") return 3200;
      if (t.type === "repeat") return 3000;
      if (t.type === "question") return t.rep_s <= 20 ? 5000 : (t.rep_s <= 30 ? 5500 : 6000);
      return 6000;
    }

    /* lecture karaoké : chaque mot s'allume quand tu le dis (cacher = mots masqués, comme à l'examen) */
    function karaoke(box, cible, cacher, petit) {
      var wrap = el("div", "fm-kw"), chips = [];
      cible.split(/\s+/).filter(Boolean).forEach(function (tok) {
        var n = mots(tok)[0] || ""; var c = el("span", "fm-w", cacher ? Array(Math.min(Math.max(n.length, 2), 6) + 1).join("•") : tok);
        if (petit) { c.style.fontSize = "14px"; c.style.padding = "3px 6px"; }
        c._n = n; c._t = tok; wrap.appendChild(c); chips.push(c);
      });
      box.appendChild(wrap);
      return function (txt) {
        var H = mots(txt);
        chips.forEach(function (c) { if (c.classList.contains("ok") || !c._n) return; if (H.indexOf(c._n) > -1) { c.classList.add("ok"); c.textContent = c._t; } });
      };
    }
    function aMatch(dit, spec) {
      var d = " " + mots(dit).join(" ") + " ";
      return String(spec).split("|").some(function (a) { var m = mots(a).join(" "); return m && d.indexOf(" " + m + " ") > -1; });
    }
    function ideesLive(box, cles) {
      var wrap = el("div", "fm-kw"), ch = [];
      cles.forEach(function (k) { var c = el("span", "fm-w", "•••"); c._k = k; wrap.appendChild(c); ch.push(c); });
      box.appendChild(wrap);
      return function (txt) { ch.forEach(function (c) { if (!c.classList.contains("ok") && aMatch(txt, c._k)) { c.classList.add("ok"); c.textContent = String(c._k).split("|")[0]; } }); };
    }
    var CONN = ["because", "and", "but", "for example"], QDEB = /\b(what|where|when|who|why|how|do you|did you|are you|is it|can you|have you|would you|could you)\b/gi;
    function metreLive(box, objectif, ask) {
      var up;
      if (ask) {
        var ids = el("div", "fm-ids"), pts = [];
        [1, 2, 3].forEach(function (n) { var c = el("div", "fm-id", String(n)); ids.appendChild(c); pts.push(c); });
        box.appendChild(ids);
        up = function (txt) { var q = (txt.match(QDEB) || []).length; pts.forEach(function (c, i) { if (i < q) { c.classList.add("ok"); c.textContent = "✓"; } }); };
      } else {
        var mt = el("div", "fm-mt"), bi = el("i"); mt.appendChild(bi); box.appendChild(mt);
        var lg = el("div", "fm-mtl"), l1 = el("span", null, "0 mot"), l2 = el("span", null, "objectif ~" + objectif); lg.appendChild(l1); lg.appendChild(l2); box.appendChild(lg);
        var cn = el("div", "fm-cn"), cs = []; CONN.forEach(function (w) { var c = el("span", null, w); cn.appendChild(c); cs.push(c); }); box.appendChild(cn);
        up = function (txt) {
          var n = mots(txt).length; bi.style.width = Math.min(100, Math.round(n / objectif * 100)) + "%"; l1.textContent = n + (n > 1 ? " mots" : " mot");
          var d = txt.toLowerCase(); cs.forEach(function (c, i) { if (d.indexOf(CONN[i]) > -1) c.classList.add("ok"); });
        };
      }
      return up;
    }

    function parler(e) {
      var t = e.tache, ty = t.type, cible = texteDe(e), box = cadre(e.titre, e.prog);
      puce(box, courte(t.consigne));
      var objectif = Math.round(t.rep_s * 1.2), maj = function () {};
      if (ty === "repeat") maj = karaoke(box, cible, true, false);
      else if (ty === "readaloud") maj = karaoke(box, cible, false, true);
      else if (ty === "retell" && e.item.cles) maj = ideesLive(box, e.item.cles);
      else {
        support(box, e);
        if (ty !== "short") maj = (e.item && e.item.cles) ? ideesLive(box, e.item.cles) : metreLive(box, objectif, t.id === "ask");
      }
      var ring = null, etat = el("div", "fm-state rec", "● Je t'écoute");
      var live = el("div", "fm-hr", "");
      var debut = Date.now(), fini = false, aParle = false, dernier = Date.now();
      var seuil = silenceMs(t), minM = ty === "repeat" ? 2 : 1, attenteMax = Math.max(12000, Math.min(20000, t.rep_s * 1000));
      function terminer(res) {
        if (fini || e.mon !== jeton) return; fini = true;
        if (vadT) { clearInterval(vadT); vadT = null; }
        arret(); ecoute = null;
        resultat(e, res || { text: "" }, (Date.now() - debut) / 1000);
      }
      function stopper(raison) {
        if (fini) return;
        if (raison === "silence") { son("ferme"); etat.textContent = "✅ Terminé"; etat.className = "fm-state"; if (ring) ring.classList.remove("rec"); }
        else if (raison === "rien") { etat.textContent = "Je n'ai rien entendu"; etat.className = "fm-state"; }
        try { ecoute && ecoute.stop(); } catch (x) {}
      }
      son("ouvre");
      try {
        ecoute = startListening("en-US", t.rep_s * 1000, true, function (txt) {
          dernier = Date.now();
          if (!aParle && mots(txt).length >= minM) aParle = true;
          maj(txt); live.textContent = txt.length > 90 ? "…" + txt.slice(-90) : txt;
        });
        ecoute.promise.then(terminer, function () { terminer({ text: "" }); });
      } catch (err) { terminer({ text: "", unsupported: true }); }
      if (vadT) clearInterval(vadT);
      vadT = setInterval(function () {
        var now = Date.now();
        if (aParle && now - dernier >= seuil) stopper("silence");
        else if (!aParle && now - debut >= attenteMax) stopper("rien");
      }, 150);
      ring = compte(box, t.rep_s, function () { try { ecoute && ecoute.stop(); } catch (x) {} }, true);
      box.appendChild(etat); box.appendChild(live);
      bouton(box, "✋ J'ai fini", function () { try { ecoute && ecoute.stop(); } catch (x) {} }, "s");
    }

    /* temps de réflexion avant de parler : durée réglable, ou illimité jusqu'au bouton « Je suis prêt » */
    function reflechir(e) {
      var ty = e.tache.type;
      if (ty !== "question" && ty !== "retell" && ty !== "prompt") return parler(e);
      var secs = DUREES[reglages().reflexion], box = cadre(e.titre, e.prog);
      puce(box, courte(e.tache.consigne));
      support(box, e);
      var go = function () { if (e.mon === jeton) { arret(); parler(e); } };
      if (secs) compte(box, secs, go, false);
      box.appendChild(el("div", "fm-state", secs ? "Réfléchis, puis parle" : "Prends ton temps"));
      bouton(box, "🎙️ Je suis prêt, je parle", go);
      bouton(box, "🔊 Réécouter la question", function () { try { speak(texteDe(e), "en-US", 0.95); } catch (x) {} }, "s");
    }

    /* la consigne est dite une seule fois, puis préparation éventuelle, puis réponse */
    function ecouter(e) {
      var ty = e.tache.type, box = cadre(e.titre, e.prog);
      if (e.lecture) {
        e.lecture0 = e.lecture; e.lecture = 0;
        return preparer(e, e.lecture0, "Lis le document", function () { ecouter(e); }, true);
      }
      puce(box, courte(e.tache.consigne));
      box.appendChild(el("div", "fm-ico on", "🔊"));
      box.appendChild(el("div", "fm-state", "Écoute : une seule fois"));
      if (e.doc) support(box, e);
      Promise.race([Promise.resolve().then(function () { return speak(texteDe(e), "en-US", 0.95); }), attendre(40000)]).then(function () {
        if (e.mon !== jeton) return;
        if (ty === "question") e.visible = texteDe(e);
        if (ty === "retell") e.visible = "";
        reflechir(e);
      }, function () { if (e.mon === jeton) { e.visible = texteDe(e); reflechir(e); } });
    }

    function lire(e) {
      var go = function () { parler(e); };
      e.visible = texteDe(e);
      go();
    }
    function consigne(e) {
      e.visible = texteDe(e);
      var run = function () {
        reflechir(e);
      };
      if (e.tache.lue) { try { speak(e.visible, "en-US", 0.95); } catch (x) {} }
      run();
    }
    function decrire(e) {
      e.visible = "";
      { var b = cadre(e.titre, e.prog); puce(b, courte(e.tache.consigne)); support(b, e); bouton(b, "🎙️ Commencer à parler", function () { parler(e); }); }
    }

    function resultat(e, res, dur) {
      var ty = e.tache.type, k = e.k, box = cadre(e.titre, (k + 1) / etapes.length);
      var texte = (res.text || "").trim(), cible = texteDe(e);
      var suite = function (nSug, manuel) {
        var dernierEl = k + 1 >= etapes.length, mon2 = jeton, ms = Math.min(10000, 4000 + 1500 * (nSug || 0));
        var go = function () { if (mon2 !== jeton) return; if (autoT) { clearTimeout(autoT); autoT = null; } etape(k + 1); };
        var row = el("div", "fm-row");
        var nx = el("button", "fm-b fm-nx"); nx.type = "button"; nx.style.flex = "3";
        var fill = el("i"); nx.appendChild(fill); nx.appendChild(el("span", null, dernierEl ? "Voir mon bilan" : "Suivant ›")); nx.onclick = go; row.appendChild(nx);
        if (AUTO() && !manuel) {
          fill.style.transition = "width " + ms + "ms linear";
          requestAnimationFrame(function () { requestAnimationFrame(function () { fill.style.width = "100%"; }); });
          var pz = el("button", "fm-b s", "⏸"); pz.type = "button"; pz.setAttribute("aria-label", "Rester ici");
          pz.onclick = function () { if (autoT) { clearTimeout(autoT); autoT = null; } fill.style.transition = "none"; fill.style.width = "0"; pz.remove(); };
          row.appendChild(pz); autoT = setTimeout(go, ms);
        }
        box.appendChild(row);
      };
      var conseils = function (libre) {
        if (!window.DiisooOral) return 0;
        var a = window.DiisooOral.analyser(texte, texteDe(e), { duree: e.tache.rep_s, ask: e.tache.id === "ask", court: ty === "short", libre: libre });
        var n = 0;
        bilan.corr.push(a.corrections.length ? 1 : 0);
        if (a.corrections.length) {
          var c = el("div", "fm-sug"); c.appendChild(el("b", null, "À corriger"));
          a.corrections.forEach(function (f) { var d = el("div"); d.innerHTML = "❌ <s>" + esc(f.avant) + "</s> → ✅ <b>" + esc(f.apres) + "</b><small>" + esc(f.note) + "</small>"; c.appendChild(d); n++; });
          box.appendChild(c);
        }
        if (a.conseils.length) {
          var g = el("div", "fm-sug"); g.appendChild(el("b", null, "Pour progresser"));
          a.conseils.forEach(function (x) { g.appendChild(el("div", null, "💡 " + x)); n++; });
          box.appendChild(g);
        }
        return n;
      };
      var rejouer = function () { bouton(box, "↻ Recommencer cette question", function () { var m = ++jeton; e.mon = m; ecouter(e); }, "s"); };
      function carte(val, cls, titre, detail) {
        var c = el("div", "fm-sc"); c.appendChild(el("div", "c " + cls, val));
        var d = el("div", "d"); d.appendChild(el("b", null, titre)); d.appendChild(document.createTextNode(detail)); c.appendChild(d); box.appendChild(c);
      }
      function entendu() { box.appendChild(el("div", "fm-hr", "Entendu : « " + (texte.length > 140 ? texte.slice(0, 137) + "…" : texte) + " »")); }

      if (res.unsupported) {
        puce(box, "Micro non disponible");
        if (ty === "repeat" || ty === "readaloud") box.appendChild(el("div", "fm-q sm", cible));
        bouton(box, "✅ C'était bien", function () { noter(e, ty, 1, dur, 0); etape(k + 1); });
        bouton(box, "❌ Pas encore", function () { noter(e, ty, 0, dur, 0); etape(k + 1); }, "s");
        return;
      }
      if (!texte) {
        box.appendChild(el("div", "fm-ico", "🤔"));
        box.appendChild(el("div", "fm-state", "Rien entendu : rapproche le téléphone"));
        noter(e, ty, 0, dur, 0);
        suite(0, true); rejouer(); return;
      }
      if (ty === "repeat" || ty === "readaloud") {
        var cmp = comparer(cible, texte), pc = Math.round(cmp.score * 100);
        bilan.precision.push(cmp.score);
        var rates = []; cmp.mots.forEach(function (m) { if (m.etat === 0 && m.w.length >= 3 && rates.indexOf(m.w) < 0) rates.push(m.w); });
        bilan.mots = bilan.mots.concat(rates); if (rates.length) memoFaibles(rates);
        carte(pc + "%", pc >= 80 ? "" : (pc >= 50 ? "o" : "r"), pc >= 80 ? "Très bien" : (pc >= 50 ? "Presque" : "À refaire"), cmp.mots.filter(function (m) { return m.etat === 2; }).length + " mots sur " + cmp.mots.length);
        var wrap = el("div", "fm-mots");
        cmp.mots.forEach(function (m) { wrap.appendChild(el("span", "fm-m " + (m.etat === 2 ? "v" : (m.etat === 1 ? "o" : "r")), m.w)); });
        box.appendChild(wrap);
        son(pc >= 80 ? "juste" : "reessaie");
        var r1 = el("div", "fm-row");
        var b1 = el("button", "fm-b s", "🔊 Modèle"); b1.type = "button"; b1.onclick = function () { try { speak(cible, "en-US", 0.85); } catch (x) {} };
        var b2 = el("button", "fm-b s", "↻ Refaire"); b2.type = "button"; b2.onclick = function () { var m = ++jeton; e.mon = m; ecouter(e); };
        r1.appendChild(b1); r1.appendChild(b2); box.appendChild(r1);
        suite(pc >= 80 ? 0 : 1); return;
      }
      if (ty === "short") {
        var rep = mots(texte), bonnes = e.item.a || [], jn = " " + rep.join(" ") + " ", jn2 = jn.replace(/(\d) (?=\d{3}(?!\d))/g, "$1");
        var ok = bonnes.some(function (a) { var x = " " + String(a).toLowerCase() + " "; return jn.indexOf(x) > -1 || jn2.indexOf(x) > -1; });
        bilan.courtes.push(ok ? 1 : 0);
        carte(ok ? "✓" : "✗", ok ? "" : "r", ok ? "Bonne réponse" : "Réponse attendue", ok ? "« " + texte + " »" : bonnes.join(" / "));
        son(ok ? "juste" : "reessaie"); suite(ok ? 0 : 1); return;
      }
      var n = mots(texte).length, objectif = Math.round(e.tache.rep_s * 1.2), plein = n >= objectif * 0.6, wpm = dur > 3 ? Math.round(n / dur * 60) : 0;
      bilan.oraux.push({ mots: n, obj: objectif });
      carte(String(n), plein ? "" : "o", plein ? "Bonne longueur" : "Développe un peu", "mots en " + Math.round(dur) + " s" + (wpm ? " · " + wpm + " mots/min" : "") + " · objectif ~" + objectif);
      entendu();
      if (ty === "retell" && e.item.cles) {
        var dit = texte.toLowerCase(), trouves = e.item.cles.filter(function (c) { return dit.indexOf(c.toLowerCase()) > -1; });
        bilan.cles.push(trouves.length / e.item.cles.length);
        var iw = el("div", "fm-kw");
        e.item.cles.forEach(function (c) { var ok2 = trouves.indexOf(c) > -1; iw.appendChild(el("span", "fm-w" + (ok2 ? " ok" : ""), ok2 ? c : "▢ " + c)); });
        box.appendChild(iw);
        box.appendChild(el("div", "fm-hr", "Idées retrouvées : " + trouves.length + " / " + e.item.cles.length));
      }
      if (ty !== "retell" && e.item && e.item.cles) {
        var ok3 = 0, wr = el("div", "fm-kw");
        e.item.cles.forEach(function (c) { var hit = aMatch(texte, c); if (hit) ok3++; wr.appendChild(el("span", "fm-w" + (hit ? " ok" : ""), (hit ? "" : "▢ ") + String(c).split("|")[0])); });
        bilan.expr.push(ok3 / e.item.cles.length);
        box.appendChild(el("div", "fm-hr", "Expressions utiles : " + ok3 + " / " + e.item.cles.length));
        box.appendChild(wr);
      }
      if (e.item && e.item.modele) {
        var mo = el("div", "fm-sug"); mo.appendChild(el("b", null, "Réponse modèle")); mo.appendChild(el("div", null, e.item.modele));
        var mb = el("button", "fm-b s", "🔊 Écouter le modèle"); mb.type = "button"; mb.style.minHeight = "40px"; mb.onclick = function () { try { speak(e.item.modele, "en-US", 0.9); } catch (x) {} };
        mo.appendChild(mb); box.appendChild(mo);
      }
      var nS = conseils(ty !== "question");
      suite(nS);
    }
    function noter(e, ty, v, dur, n) {
      if (ty === "repeat" || ty === "readaloud") bilan.precision.push(v);
      else if (ty === "short") bilan.courtes.push(v);
      else bilan.oraux.push({ mots: n, obj: Math.round(e.tache.rep_s * 1.2), manuel: v });
    }
    etape(depart > 0 && depart < etapes.length ? depart : 0);
  }

  function fin(cle, ti, bilan) {
    repriseEffacer(); pauseCb = null; nettoyer();
    var ex = REG.examens[cle];
    var box = cadre("Bilan");
    function moy(a) { return a.reduce(function (s, v) { return s + v; }, 0) / a.length; }
    var sk = [];
    if (bilan.precision.length) sk.push({ k: "pron", n: "Prononciation", v: moy(bilan.precision), c: "Répète à voix haute les mots à revoir, 5 minutes par jour." });
    if (bilan.oraux.length) sk.push({ k: "flu", n: "Fluidité", v: moy(bilan.oraux.map(function (o) { return Math.min(1, o.mots / o.obj); })), c: "Parle plus longtemps : une idée, une raison, un exemple." });
    if (bilan.expr.length) sk.push({ k: "expr", n: "Expressions pro", v: moy(bilan.expr), c: "Utilise les expressions du métier : demande polie, prix, garantie, livraison." });
    if (bilan.cles.length) sk.push({ k: "cont", n: "Compréhension", v: moy(bilan.cles), c: "Avant de répondre, retiens 3 idées clés de ce que tu entends." });
    if (bilan.corr.length) sk.push({ k: "gram", n: "Grammaire", v: 1 - moy(bilan.corr), c: "Relis tes corrections et refais la phrase correctement à voix haute." });
    if (bilan.courtes.length) sk.push({ k: "vit", n: "Réponses rapides", v: moy(bilan.courtes), c: "Réponds vite, en un ou deux mots, sans chercher la phrase parfaite." });
    var indice = sk.length ? Math.round(moy(sk.map(function (x) { return x.v; })) * 100) : 0;
    var carte = el("div", "fm-sc"); carte.appendChild(el("div", "c " + (indice >= 70 ? "" : (indice >= 45 ? "o" : "r")), String(indice)));
    var d = el("div", "d"); d.appendChild(el("b", null, "Indice Diisoo")); d.appendChild(document.createTextNode("sur 100, mesuré à partir de tes réponses. Pas une note officielle.")); carte.appendChild(d); box.appendChild(carte);
    sk.forEach(function (x) {
      var p = Math.round(x.v * 100), col = p >= 70 ? "#25D366" : (p >= 45 ? "#F3A94E" : "#E5484D");
      var r = el("div", "fm-sk"); r.innerHTML = '<div class="h"><span>' + x.n + '</span><span style="color:' + col + '">' + p + ' %</span></div><div class="b"><i style="width:' + p + '%;background:' + col + '"></i></div>';
      box.appendChild(r);
    });
    if (sk.length) {
      var faible = sk.slice().sort(function (a, b) { return a.v - b.v; })[0];
      var g = el("div", "fm-sug"); g.appendChild(el("b", null, "Ton objectif pour la prochaine fois")); g.appendChild(el("div", null, "🎯 " + faible.n + " : " + faible.c)); box.appendChild(g);
    }
    var uniq = []; bilan.mots.forEach(function (w) { if (uniq.indexOf(w) < 0) uniq.push(w); });
    if (uniq.length) {
      box.appendChild(el("div", "fm-hr", "📌 Mots à revoir (enregistrés) : touche pour écouter"));
      var wrap = el("div", "fm-kw");
      uniq.slice(0, 12).forEach(function (w) { var c = el("button", "fm-w", w); c.type = "button"; c.onclick = function () { try { speak(w, "en-US", 0.8); } catch (x) {} }; wrap.appendChild(c); });
      box.appendChild(wrap);
    }
    try { if (typeof addXP === "function") addXP(8); if (typeof bumpDailyGoal === "function") bumpDailyGoal(1); } catch (e) {}
    try {
      var h = JSON.parse(localStorage.getItem("diisoo_fmt") || "[]"); h.push({ e: cle, t: ex.tests[ti].id, d: new Date().toISOString().slice(0, 10), i: indice });
      localStorage.setItem("diisoo_fmt", JSON.stringify(h.slice(-60)));
    } catch (e) {}
    bouton(box, "↻ Refaire ce test", function () { lancer(cle, ti); });
    var rw = el("div", "fm-row");
    var b2 = el("button", "fm-b s", "Autre test"); b2.type = "button"; b2.onclick = function () { ouvrir(cle); };
    var b3 = el("button", "fm-b s", "Fermer"); b3.type = "button"; b3.onclick = fermer;
    rw.appendChild(b2); rw.appendChild(b3); box.appendChild(rw);
  }

  /* ---------- boutons dans la liste des tests ---------- */
  function brancherBiz() {
    var a = $("business-picker");
    if (!a || !a.parentNode || $("fx-biz-btn")) return;
    if (!REG) { charger().then(brancherBiz); return; }
    if (!REG.examens || !REG.examens.business) return;
    var b = el("button", "fx-reel"); b.id = "fx-biz-btn"; b.type = "button";
    b.innerHTML = "🎯 Simulation professionnelle<small>Vends, achète, négocie : comme en vrai</small>";
    b.onclick = function () { ouvrir("business"); };
    a.parentNode.insertBefore(b, a);
  }
  function brancher() {
    brancherBiz();
    var box = $("exam-tests");
    if (box && box.style.display === "none") delete box.dataset.auto;
    if (!box || box.style.display === "none" || box.querySelector(".fx-reel")) return;
    var titre = box.querySelector(".et-titre");
    if (!titre) return;
    if (!REG) { charger().then(brancher); return; }
    var txt = (titre.textContent || "").toLowerCase(), cles = [];
    Object.keys(REG.examens).forEach(function (k) {
      var g = (REG.examens[k].groupe || REG.examens[k].court).toLowerCase();
      if (txt.indexOf(g) === 0) cles.push(k);
    });
    var ref = titre, seul = null;
    cles.forEach(function (k) { if (REG.examens[k].remplace_ancien) seul = k; });
    if (seul) box.classList.add("fx-seul");
    cles.forEach(function (k) {
      var ex = REG.examens[k], b = el("button", "fx-reel"); b.type = "button";
      b.innerHTML = "🎯 Format réel " + esc(ex.bouton ? ex.groupe + " " + ex.bouton : ex.court) + "<small>Comme à l'examen</small>";
      b.onclick = function () { ouvrir(k); };
      ref.parentNode.insertBefore(b, ref.nextSibling); ref = b;
    });
    if (seul && cles.length === 1 && !box.dataset.auto) { box.dataset.auto = "1"; setTimeout(function () { ouvrir(seul); }, 250); }
  }
  var plan = false;
  try {
    new MutationObserver(function () { if (plan) return; plan = true; requestAnimationFrame(function () { plan = false; brancher(); }); })
      .observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
  charger().then(brancher);

  window.DiisooExams2 = { version: 7, ouvrir: ouvrir, registre: function () { return REG; } };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-exams2.js",e);}

try{
/* ---- diisoo-premium.js ---- */
/* diisoo-premium.js v3 : ecran Premium simplifie (Gratuit / Diisoo Plus / services ABC-GLOBAL). Prix : voir PRIX. */
(function () {
  "use strict";

  var PRIX = {
    plus30: "2 500 FCFA",
    plus90: "6 000 FCFA",
    plus365: "20 000 FCFA"
  };
  var ETRANGER = "🔒 Paiement sécurisé PayTech, depuis n'importe quel pays : Wave, Orange Money, Visa, Mastercard.";

  var NEUF = [
    { id: "plus30", icone: "⭐", titre: "Diisoo Plus · 30 jours", prix: PRIX.plus30, dispo: true,
      texte: "Tout est débloqué. Pas de renouvellement automatique." },
    { id: "plus90", icone: "⭐", titre: "Diisoo Plus · 90 jours", prix: PRIX.plus90, dispo: true,
      texte: "Le même accès pendant 3 mois." },
    { id: "plus365", icone: "🏆", titre: "Diisoo Plus · 1 an", prix: PRIX.plus365, dispo: true,
      texte: "Un an d'accès complet." }
  ];

  function ajuster() {
    try {
      var o = PREMIUM_CONFIG.offres;
      if (o.some(function (x) { return x.id === "plus30"; })) return;
      var garde = {};
      o.forEach(function (x) { garde[x.id] = x; });
      var suite = [];
      ["commercants", "visa", "coaching", "pro"].forEach(function (id) { if (garde[id]) suite.push(garde[id]); });
      o.length = 0;
      NEUF.concat(suite).forEach(function (x) { o.push(x); });
    } catch (e) {}
  }

  var WA = "221772882109";
  var choix = "plus90";
  var DUREES = [
    { id: "plus30", court: "30 jours", prix: PRIX.plus30, note: "" },
    { id: "plus90", court: "90 jours", prix: PRIX.plus90, note: "-20 %" },
    { id: "plus365", court: "1 an", prix: PRIX.plus365, note: "-33 %" }
  ];
  function el(html, css) {
    var d = document.createElement("div");
    d.className = "dp-t bg-[#0B0F1C]/60 border border-[#1E2740] rounded-2xl p-3";
    d.style.cssText = "margin-top:10px;" + (css || "");
    d.innerHTML = html;
    return d;
  }
  function offre(id) { try { return PREMIUM_CONFIG.offres.filter(function (x) { return x.id === id; })[0]; } catch (e) { return null; } }
  function payer(id) {
    try { if (typeof payerOffre === "function") return payerOffre(id); } catch (e) {}
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent("Bonjour, je veux l'offre " + id + "."), "_blank", "noopener");
  }
  var BTN = "display:block;width:100%;min-height:46px;border:0;border-radius:12px;font-size:14px;font-weight:800;color:#1a1206;background:linear-gradient(90deg,#F3A94E,#E2703E)";
  var SOUS = "font-size:11px;color:#A69C86;line-height:1.5;margin-top:6px;text-align:center";
  var enCours = false;
  function habiller() {
    var box = document.getElementById("premium-offers");
    if (!box || enCours) return;
    if (box.querySelector(".dp-t")) return;
    if (!box.children.length) return;
    enCours = true;
    try {
      box.innerHTML = "";
            var g = el('<div style="font-size:14px;font-weight:800;color:#F6F1E7">🆓 Gratuit pour toujours</div>' +
        '<div style="font-size:11px;color:#A69C86;line-height:1.5;margin-top:4px">Leçons d\'anglais et de wolof, tourisme, coach vocal, 3 tests d\'examen, entraînement oral, objectifs, parrainage.</div>', "border-color:#25D366;margin-top:0");
      box.appendChild(g);

      var plus = el('<div style="font-size:15px;font-weight:800;color:#F6F1E7">⭐ Diisoo Plus</div>' +
        '<div style="font-size:11px;color:#A69C86;line-height:1.5;margin:4px 0 8px">Tout est débloqué : simulateur IELTS complet, tests de format réel (TOEFL, TOEIC, Cambridge, Duolingo, PTE), niveaux Intermédiaire et Avancé. Pas de renouvellement automatique.</div>' +
        '<div class="dp-seg" style="display:flex;gap:6px"></div>' +
        '<button type="button" class="dp-pay" style="margin-top:10px;' + BTN + '"></button>' +
        '<div style="' + SOUS + '">Wave, Orange Money, Visa ou Mastercard, d\'où que tu sois. Activation immédiate sur ton numéro.</div>');
      var seg = plus.querySelector(".dp-seg"), pay = plus.querySelector(".dp-pay");
      function maj() {
        var d = DUREES.filter(function (x) { return x.id === choix; })[0];
        Array.prototype.forEach.call(seg.children, function (b) {
          var on = b.getAttribute("data-id") === choix;
          b.style.borderColor = on ? "#F3A94E" : "#1E2740";
          b.style.background = on ? "#2A2113" : "#0B0F1C";
        });
        pay.textContent = "💳 Payer " + d.prix;
      }
      DUREES.forEach(function (d) {
        var b = document.createElement("button");
        b.type = "button"; b.setAttribute("data-id", d.id);
        b.style.cssText = "flex:1;min-height:58px;border:1.5px solid #1E2740;border-radius:12px;color:#F6F1E7;padding:6px 2px;font-size:12px;line-height:1.3";
        b.innerHTML = "<b>" + d.court + "</b><br><span style=\"font-size:11px;color:#F0906B\">" + d.prix.replace(" FCFA", " F") + "</span>" +
          (d.note ? "<br><span style=\"font-size:10px;color:#5FC98F\">" + d.note + "</span>" : "");
        b.onclick = function () { choix = d.id; maj(); };
        seg.appendChild(b);
      });
      pay.onclick = function () { payer(choix); };
      maj();
      box.appendChild(plus);
            var c = offre("commercants");
      var pc = el('<div style="display:flex;justify-content:space-between;gap:8px"><div style="font-size:14px;font-weight:800;color:#F6F1E7">🧰 Pack Commerçants</div><div style="font-size:12px;font-weight:700;color:#F0906B;white-space:nowrap">' + (c && c.prix || "5 000 FCFA") + '</div></div>' +
        '<div style="font-size:11px;color:#A69C86;line-height:1.5;margin:4px 0 8px">Anglais de tous les secteurs : pièces détachées, mode, électronique, import Chine. Achat unique, accès à vie.</div>' +
        '<button type="button" class="dp-pc" style="' + BTN + '">💳 Payer ' + (c && c.prix || "5 000 FCFA") + '</button>');
      pc.querySelector(".dp-pc").onclick = function () { payer("commercants"); };
      box.appendChild(pc);

      var rows = ["visa", "coaching", "pro"].map(function (id) {
        var o = offre(id); if (!o) return "";
        var lien = ""; try { lien = premiumLien(o); } catch (e) { lien = "https://wa.me/" + WA; }
        return '<a href="' + lien + '" target="_blank" rel="noopener" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 0;border-top:1px solid #1E2740;text-decoration:none">' +
          '<span style="font-size:13px;color:#F6F1E7;font-weight:700">' + o.icone + " " + o.titre + '</span>' +
          '<span style="font-size:11px;color:#F0906B;white-space:nowrap">' + o.prix + ' ›</span></a>';
      }).join("");
      box.appendChild(el('<div style="font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#F3A94E">Services ABC-GLOBAL</div>' +
        '<div style="font-size:11px;color:#A69C86;margin:2px 0 4px">Besoin d\'un accompagnement humain ? Touche une ligne.</div>' + rows));

      var f = document.createElement("div");
      f.className = "dp-t";
      f.style.cssText = "font-size:11px;color:#8C8064;line-height:1.5;margin:10px 2px 0;text-align:center";
      f.textContent = ETRANGER;
      box.appendChild(f);
    } catch (e) {}
    enCours = false;
  }

  var orig = window.renderPremium;
  if (typeof orig === "function") {
    window.renderPremium = function () {
      ajuster();
      var r = orig.apply(this, arguments);
      setTimeout(habiller, 50);
      return r;
    };
  }
  try {
    new MutationObserver(function () { setTimeout(habiller, 30); })
      .observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
  ajuster();

  window.DiisooPremium = { version: 3, prix: PRIX };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-premium.js",e);}

try{
/* ---- diisoo-guide.js ---- */
/* diisoo-guide.js v1 : guide vocal
   Un bouton sur l'accueil. La voix demande « Qu'est-ce que tu veux étudier ? », l'apprenant répond (français ou anglais),
   et l'app ouvre directement la leçon : plus de recherche, plus de défilement.
   Le navigateur exige un toucher avant le son et le micro : c'est ce bouton.
   Le wolof n'est pas reconnu par le micro : la question est dite en wolof, la réponse se donne en français ou en anglais. */
(function () {
  "use strict";
  if (window.DiisooVoixGuide) return;

  var $ = function (id) { return document.getElementById(id); };
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function has(t, words) {
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if ((" " + t + " ").indexOf(" " + w) >= 0) return true;   /* debut de mot : « agricult » trouve « agriculture » */
    }
    return false;
  }
  function pause(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function click(el) { try { el.click(); return true; } catch (e) { return false; } }

  /* ---------- ce que l'apprenant peut demander ---------- */
  var EXAMS = [
    ["ielts", ["ielts", "iels", "ielt", "aielts", "ailts", "eyelts", "visa", "life skills"]],
    ["toefl", ["toefl", "tofl", "tofel", "toeffle", "toffle"]],
    ["toeic", ["toeic", "toeik", "toique", "toik", "toeick"]],
    ["cambridge_a2", ["cambridge a2", "key", "a2"]],
    ["cambridge_b1", ["cambridge b1", "preliminary", "b1"]],
    ["duolingo", ["duolingo", "duo lingo"]],
    ["pte", ["pte", "pete", "pearson"]],
    ["business", ["simulateur", "entretien", "interview", "professionnel", "professional"]]
  ];
  var SECTEURS = {
    colobane: ["colobane", "piece", "mecanique", "auto", "voiture", "garage", "moto"],
    sandaga: ["sandaga", "mode", "beaute", "vetement", "coiffure", "cosmetique", "tissu"],
    electronique: ["electronique", "centenaire", "telephone", "ordinateur", "electro"],
    bazar: ["bazar", "meuble", "maison", "deco"],
    chine: ["chine", "logistique", "import", "guangzhou", "container", "conteneur", "fournisseur", "china"],
    tour_hotel: ["hotel", "hebergement", "reception", "chambre", "accueil"],
    tour_resto: ["restaurant", "serveur", "serveuse", "bar ", "cafe"],
    tour_guide: ["guide", "excursion", "visite", "circuit", "goree"],
    tour_transport: ["taxi", "location de voiture", "chauffeur"],
    tour_artisanat: ["artisan", "souvenir", "masque", "bijou"],
    tour_agence: ["agence", "billet", "reservation", "avion"],
    tour_plage: ["plage", "pirogue", "surf", "saly", "peche"],
    agriculture: ["agricult", "champ", "ferme", "legume", "fruit", "recolte", "farm"]
  };
  var THEMES_EN = {
    intro: ["presenter", "presentation", "introduire", "introduce", "myself", "salut", "bonjour", "hello"],
    family: ["njaboot", "famille", "family", "parent", "enfant"],
    work: ["liggeey", "travail", "travailler", "work", "routine", "job", "metier", "boulot"],
    market: ["xaalis", "njaay", "jaay", "achat", "acheter", "argent", "shopping", "market", "marche", "prix", "money", "price"],
    travel: ["tukki", "dem", "voyage", "voyager", "transport", "travel", "taxi", "bus", "avion"],
    health: ["wer", "wéral", "weral", "sante", "health", "docteur", "medecin", "hopital", "malade", "corps"],
    food: ["lekk", "ñam", "nam", "nourriture", "manger", "food", "restaurant", "cuisine", "repas"],
    time: ["temps", "heure", "time", "date", "jour", "calendrier"],
    visa: ["visa", "ambassade", "consulat", "embassy"],
    housing: ["ker", "dekk", "logement", "housing", "maison", "appartement", "louer", "house"]
  };
  var THEMES_WO = {
    salutations: ["salut", "salutation", "bonjour", "greet", "hello"],
    famille: ["famille", "family", "parent"],
    maison: ["maison", "quotidien", "daily", "house"],
    marche: ["marche", "argent", "acheter", "prix", "market", "money"],
    voyage: ["deplacement", "voyage", "transport", "travel", "taxi"],
    corps: ["corps", "sante", "health", "docteur", "body"],
    nourriture: ["nourriture", "manger", "food", "cuisine"],
    temps: ["temps", "nombre", "chiffre", "number", "time", "heure", "compter"],
    logement: ["logement", "housing", "louer", "appartement"]
  };
  var NIVEAU = [[3, ["avance", "expert", "difficile", "advanced"]], [2, ["intermediaire", "moyen", "intermediate"]], [1, ["debutant", "commenc", "zero", "base", "facile", "beginner"]]];

  function niveauDit(t) {
    for (var i = 0; i < NIVEAU.length; i++) if (has(t, NIVEAU[i][1])) return NIVEAU[i][0];
    return 0;
  }

  /* ---------- comprendre la réponse ---------- */
  function comprendre(texte) {
    var t = norm(texte);
    if (!t) return null;
    var out = { niv: niveauDit(t) };
    var i, k;
    for (i = 0; i < EXAMS.length; i++) if (has(t, EXAMS[i][1])) { out.type = "exam"; out.cle = EXAMS[i][0]; return out; }
    if (has(t, ["ekzamen", "examen", "exam", "test", "passer un", "certificat"])) { out.type = "exams"; return out; }
    if (has(t, ["turis", "tourisme", "touriste", "tourist", "tourism"])) { out.type = "business"; out.groupe = "tourisme"; out.cle = ""; for (k in SECTEURS) if (/^tour_/.test(k) && has(t, SECTEURS[k])) { out.cle = k; break; } return out; }
    var biz = has(t, ["business", "bisnes", "bizness", "njaay", "jaay", "affaire", "commerce", "vendre", "vente", "boutique", "commerçant", "commercant", "negoc"]);
    for (k in SECTEURS) if (has(t, SECTEURS[k])) { out.type = "business"; out.cle = k; return out; }
    if (biz) { out.type = "business"; return out; }
    var wolof = has(t, ["wolof", "wollof", "ouolof", "walaf", "wolo", "walof"]);
    if (wolof) {
      out.type = "wolof";
      for (k in THEMES_WO) if (has(t, THEMES_WO[k])) { out.cle = k; break; }
      return out;
    }
    for (k in THEMES_EN) if (has(t, THEMES_EN[k])) { out.type = "anglais"; out.cle = k; return out; }
    if (has(t, ["angale", "angalee", "angle", "anglais", "english", "angles", "langlais"])) { out.type = "anglais"; return out; }
    return null;
  }

  /* ---------- navigation : on réutilise les vrais boutons de l'app ---------- */
  function attendre(test, ms) {
    return new Promise(function (res) {
      var t0 = Date.now();
      (function boucle() {
        var r; try { r = test(); } catch (e) { r = null; }
        if (r) return res(r);
        if (Date.now() - t0 > ms) return res(null);
        setTimeout(boucle, 60);
      })();
    });
  }
  function ouvert(id) { var e = $(id); return e && !e.classList.contains("hidden"); }
  function debloque(key) { try { return tierState()[key].unlocked || 1; } catch (e) { return 1; } }

  function choisirNiveau(pickerId, voulu, max) {
    return attendre(function () { var p = $(pickerId); return p && p.querySelectorAll(".lvl-btn").length === 3 && p; }, 2500).then(function (p) {
      if (!p) return 0;
      var L = Math.max(1, Math.min(voulu || max, max, 3));
      click(p.querySelectorAll(".lvl-btn")[L - 1]);
      return L;
    });
  }

  function motsDe(txt) { return norm(txt).split(" ").filter(function (w) { return w.length > 3; }); }
  function boutonParTitre(box, titres) {
    var bs = Array.prototype.slice.call(box.querySelectorAll("button")).filter(function (b) { return b.offsetParent !== null || true; });
    for (var i = 0; i < titres.length; i++) {
      var n = norm(titres[i]);
      for (var j = 0; j < bs.length; j++) if (norm(bs[j].textContent).indexOf(n) >= 0) return bs[j];
    }
    return null;
  }

  function allerAnglais(r) {
    var G; try { G = GENERAL_THEMES; } catch (e) { G = []; }
    if (typeof openGeneralModule !== "function") return Promise.resolve(null);
    var un = debloque("general");
    openGeneralModule();
    return choisirNiveau("lvl-general", r.niv, un).then(function (L) {
      var box = $("general-tabs"); if (!box || !L) return null;
      var btns = Array.prototype.slice.call(box.children).filter(function (b) { return b.style.display !== "none"; });
      var cible = null;
      if (r.type === "tourisme") {
        cible = btns.filter(function (b) { return /🏝/.test(b.textContent) || /tour|touriste|hotel|goree|plage|excursion/.test(norm(b.textContent)); })[0];
      } else if (r.cle) {
        var th = G.filter(function (x) { return x.id === r.cle; })[0];
        if (th) cible = boutonParTitre(box, [th.title]);
        if (cible && cible.style.display === "none") cible = null;
      }
      var exact = !!cible;
      if (!cible) cible = btns.filter(function (b) { return !/🏝/.test(b.textContent); })[0] || btns[0];
      if (!cible) return null;
      click(cible);
      return { niveau: L, titre: cible.textContent.replace(/🏝️?/g, "").replace(/N[123]/g, "").trim(), exact: exact || (!r.cle && r.type !== "tourisme") };
    });
  }

  function allerWolof(r) {
    if (typeof openWolofModule !== "function") return Promise.resolve(null);
    var un = debloque("wolof");
    openWolofModule();
    return choisirNiveau("lvl-wolof", r.niv, un).then(function (L) {
      var box = $("wolof-tabs"); if (!box || !L) return null;
      var btns = Array.prototype.slice.call(box.children).filter(function (b) { return b.style.display !== "none"; });
      var cible = null, W; try { W = WOLOF_THEMES; } catch (e) { W = []; }
      if (r.cle) {
        var th = W.filter(function (x) { return x.id === r.cle; })[0];
        if (th) cible = btns.filter(function (b) { return norm(b.textContent) === norm(th.title); })[0];
      }
      var exact = !!cible;
      if (!cible) cible = btns[0];
      if (!cible) return null;
      click(cible);
      return { niveau: L, titre: cible.textContent.trim(), exact: exact || !r.cle };
    });
  }

  function allerBusiness(r) {
    if (typeof openBusinessModule !== "function") return Promise.resolve(null);
    openBusinessModule();
    return attendre(function () { var p = $("lvl-business"); return p && p.querySelectorAll(".lvl-btn").length === 3 && p; }, 2500).then(function (p) {
      if (!p) return null;
      var ouverts = Array.prototype.slice.call(p.querySelectorAll(".lvl-btn")).filter(function (b) { return !b.classList.contains("lock"); });
      var L = Math.max(1, Math.min(r.niv || ouverts.length, ouverts.length));
      click(p.querySelectorAll(".lvl-btn")[L - 1]);
      if (!r.cle && !r.groupe) return { niveau: L, titre: "Business", exact: true };
      return attendre(function () { var g = $("biz-grid"); return g && g.querySelectorAll("button").length && g; }, 2500).then(function (g0) {
        if (!g0) return { niveau: L, titre: "Business", exact: false };
        var tour = r.groupe === "tourisme" || /^tour_/.test(r.cle || "");
        if (!tour) return g0;
        var tb = g0.querySelector("button.bz-t"); if (tb) click(tb);
        if (!r.cle) return { niveau: L, titre: "Tourisme", exact: true, stop: true };
        return attendre(function () { var g = $("biz-grid"); return g && g !== g0 && g.querySelectorAll("button").length && g; }, 2500);
      }).then(function (g) {
        if (!g) return { niveau: L, titre: "Business", exact: false };
        if (g.stop) return g;
        var mod; try { mod = CHINA_TRADE_WOLOF[r.cle]; } catch (e) { mod = null; }
        var cible = null;
        if (mod && mod.title) {
          var mots = motsDe(mod.title);
          cible = Array.prototype.slice.call(g.querySelectorAll("button:not(.bz-m)")).filter(function (b) {
            var tb = norm(b.textContent); return mots.some(function (m) { return tb.indexOf(m) >= 0; });
          })[0];
        }
        if (!cible) cible = g.querySelector("button:not(.bz-m)");
        var exact = !!(cible && mod);
        if (cible) click(cible);
        return { niveau: L, titre: (mod && mod.title) || "Business", exact: exact };
      });
    });
  }

  function allerExam(r) {
    var X = window.DiisooExams2;
    if (!X || !X.ouvrir) return Promise.resolve(null);
    try { if (typeof startTestSimulation === "function") startTestSimulation(); } catch (e) {}
    return pause(150).then(function () {
      if (r.type === "exam") { X.ouvrir(r.cle); var ex; try { ex = X.registre().examens[r.cle]; } catch (e) {} return { titre: ex ? ex.court || ex.nom : "Examen", exact: true }; }
      return { titre: "Examens", exact: true };
    });
  }

  function aller(r) {
    if (r.type === "anglais" || r.type === "tourisme") return allerAnglais(r);
    if (r.type === "wolof") return allerWolof(r);
    if (r.type === "business") return allerBusiness(r);
    return allerExam(r);
  }

  /* ---------- interface ---------- */
  function css() {
    if ($("diisoo-guide-css")) return;
    var s = document.createElement("style"); s.id = "diisoo-guide-css";
    s.textContent =
      "#dg-open{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:12px 14px;border-radius:18px;border:1px solid #E1693F;" +
      "background:linear-gradient(135deg,#2a1a12,#1b1410);color:#F6F1E7;box-shadow:0 0 0 0 rgba(225,105,63,.5);animation:dgp 2.4s infinite}" +
      "#dg-open .dg-mic{flex:none;width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#F3A94E,#E1693F);display:flex;align-items:center;justify-content:center;font-size:22px}" +
      "#dg-open b{display:block;font-size:15px;line-height:1.2}#dg-open span.dg-s{display:block;font-size:12.5px;color:#C9BFA8;margin-top:2px}" +
      "@keyframes dgp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.45)}70%{box-shadow:0 0 0 12px rgba(225,105,63,0)}100%{box-shadow:0 0 0 0 rgba(225,105,63,0)}}" +
      "#dg-ov{position:fixed;inset:0;z-index:90;background:rgba(11,15,28,.97);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;color:#F6F1E7}" +
      "#dg-ov.hidden{display:none}" +
      "#dg-q{font-size:22px;font-weight:800;line-height:1.25;max-width:320px}" +
      "#dg-sub{font-size:13px;color:#A69C86;margin-top:8px;min-height:18px}" +
      "#dg-orb{width:96px;height:96px;border-radius:50%;margin:26px 0 14px;background:linear-gradient(135deg,#F3A94E,#E1693F);display:flex;align-items:center;justify-content:center;font-size:42px;transition:transform .2s}" +
      "#dg-orb.on{animation:dgo 1s infinite}@keyframes dgo{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(225,105,63,.5)}50%{transform:scale(1.08);box-shadow:0 0 0 18px rgba(225,105,63,0)}}" +
      "#dg-heard{font-size:16px;font-weight:700;color:#F3A94E;min-height:24px;max-width:320px}" +
      "#dg-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:18px;max-width:340px}" +
      "#dg-chips button{padding:9px 14px;border-radius:999px;background:#141A2B;border:1px solid #1E2740;color:#F6F1E7;font-size:13px;font-weight:700}" +
      "#dg-close{margin-top:22px;padding:10px 22px;border-radius:14px;background:transparent;border:1px solid #1E2740;color:#A69C86;font-size:13px}";
    document.head.appendChild(s);
  }

  var ov = null, jeton = 0, ecoute = null;

  function fermer() {
    jeton++;
    try { if (ecoute && ecoute.stop) ecoute.stop(); } catch (e) {}
    try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
    if (ov) ov.classList.add("hidden");
  }
  function maj(q, sub, heard, on) {
    if (!ov) return;
    $("dg-q").textContent = q; $("dg-sub").textContent = sub || "";
    $("dg-heard").textContent = heard || "";
    $("dg-orb").classList.toggle("on", !!on);
  }
  function dire(texte, lang) {
    try { if (typeof speak === "function") return Promise.resolve(speak(texte, lang)).catch(function () {}); } catch (e) {}
    return Promise.resolve();
  }

  function construire() {
    if (ov) return;
    ov = document.createElement("div"); ov.id = "dg-ov"; ov.className = "hidden";
    ov.innerHTML = '<div id="dg-q"></div><div id="dg-sub"></div><div id="dg-orb" role="button" aria-label="Parler">🎙️</div><div id="dg-heard"></div>' +
      '<div id="dg-chips"></div><button id="dg-close" type="button">Fermer</button>';
    document.body.appendChild(ov);
    $("dg-close").onclick = fermer;
    $("dg-orb").onclick = function () { demarrer(false); };
    var C = [["🇬🇧 Anglais", "anglais"], ["🇸🇳 Wolof", "wolof"], ["💼 Business", "business"], ["✈️ Examens", "examen"]];
    C.forEach(function (c) {
      var b = document.createElement("button"); b.type = "button"; b.textContent = c[0];
      b.onclick = function () { traiter(c[1], ++jeton); };
      $("dg-chips").appendChild(b);
    });
  }

  function traiter(texte, mon) {
    var r = comprendre(texte);
    if (!r) {
      maj("Je n'ai pas compris", "Dis : « anglais », « wolof », « business » ou « examens »", texte ? "« " + texte + " »" : "", false);
      return dire("Dégg ma ko ñaar yoon. Waxaat ko, angale, wolof, walla njaay.", "wo").then(function () { return null; });
    }
    maj("Waaw, ñu ngi ko ubbi...", "J'ouvre ta leçon", texte ? "« " + texte + " »" : "", false);
    return aller(r).then(function (res) {
      if (mon !== jeton) return;
      if (!res) { maj("Je n'ai pas pu ouvrir", "Choisis un thème ci-dessous", "", false); return; }
      fermer();
      try { if (typeof toast === "function") toast("🎙️ " + res.titre + (res.niveau ? " · niveau " + res.niveau : "")); } catch (e) {}
    });
  }

  function demarrer(premiere) {
    var mon = ++jeton;
    try { if (ecoute && ecoute.stop) ecoute.stop(); } catch (e) {}
    maj("Lan nga bëgg a jàng ?", "Qu'est-ce que tu veux étudier ? Dis : anglais, wolof, business ou examens", "", false);
    var suite = function () {
      if (mon !== jeton) return;
      maj("Je t'écoute...", "Parle maintenant", "", true);
      var langues = ["fr-FR", "en-US"], essai = 0;
      (function tour() {
        if (mon !== jeton) return;
        var p;
        try {
          p = startListening(langues[essai], 8000, false, function (t) { if (mon === jeton) $("dg-heard").textContent = "« " + t + " »"; });
        } catch (e) { p = null; }
        if (!p) { maj("Micro indisponible", "Touche un choix ci-dessous", "", false); return; }
        ecoute = { stop: p.stop };
        (p.promise || p).then(function (r) {
          if (mon !== jeton) return;
          var txt = r && r.text || "";
          if (r && (r.error === "not-allowed" || r.error === "service-not-allowed" || r.unsupported)) { maj("Micro indisponible", "Touche un choix ci-dessous", "", false); return; }
          if (txt && comprendre(txt)) { traiter(txt, mon); return; }
          if (essai < langues.length - 1) { essai++; tour(); return; }
          traiter(txt, mon);
          maj("Je n'ai pas compris", "Touche le micro pour réessayer, ou un choix ci-dessous", txt ? "« " + txt + " »" : "", false);
        });
      })();
    };
    if (premiere === false) { suite(); return; }
    /* Question dite en wolof, puis le micro s'ouvre */
    dire("Lan nga bëgg a jàng ?", "wo").then(suite);
  }

  function ouvrir() {
    css(); construire();
    ov.classList.remove("hidden");
    demarrer(true);
  }

  /* ---------- bouton sur l'accueil ---------- */
  function poser() {
    css();
    var dash = $("screen-dashboard");
    if (!dash || $("dg-open")) return !!$("dg-open");
    var tete = dash.children[0];
    if (!tete) return false;
    var b = document.createElement("button");
    b.type = "button"; b.id = "dg-open";
    b.innerHTML = '<span class="dg-mic">🎙️</span><span><b>Dis-moi ce que tu veux étudier</b><span class="dg-s">Touche, parle, et j\'ouvre la leçon</span></span>';
    b.onclick = ouvrir;
    tete.parentNode.insertBefore(b, tete.nextSibling);
    return true;
  }
  /* ---------- premier lancement : accueil chaleureux, une seule fois ---------- */
  var VU = "diisoo_guide_vu";
  function vu() { try { return localStorage.getItem(VU) === "1"; } catch (e) { return true; } }
  function marquerVu() { try { localStorage.setItem(VU, "1"); } catch (e) {} }
  function prenom() { try { var p = store.get("diisoo_profile"); return (p && p.first_name) || ""; } catch (e) { return ""; } }
  function bienvenue() {
    var dash = $("screen-dashboard");
    if (vu() || !dash || dash.classList.contains("hidden") || $("dg-welcome") || (ov && !ov.classList.contains("hidden"))) return;
    css();
    var w = document.createElement("div"); w.id = "dg-welcome"; w.setAttribute("role", "dialog"); w.setAttribute("aria-label", "Bienvenue");
    w.style.cssText = "position:fixed;left:12px;right:12px;bottom:14px;z-index:88;background:#141A2B;border:1px solid #E1693F;border-radius:20px;padding:16px;color:#F6F1E7;box-shadow:0 10px 40px rgba(0,0,0,.6)";
    var n = prenom();
    w.innerHTML = '<div style="font-size:17px;font-weight:800;line-height:1.25">👋 ' + (n ? "Bienvenue " + n.replace(/[<>&]/g, "") + " !" : "Bienvenue !") + '</div>' +
      '<div style="font-size:13px;color:#C9BFA8;margin-top:6px">Dis-moi ce que tu veux apprendre, et j\'ouvre ta leçon. Pas besoin de chercher.</div>' +
      '<button type="button" id="dg-w-go" style="width:100%;min-height:52px;margin-top:12px;border-radius:16px;border:0;background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;font-weight:800;font-size:15px">🎙️ Commencer avec la voix</button>' +
      '<button type="button" id="dg-w-no" style="width:100%;min-height:44px;margin-top:6px;border-radius:14px;border:0;background:transparent;color:#A69C86;font-size:13px">Je choisis moi-même</button>';
    document.body.appendChild(w);
    var ferme = function () { marquerVu(); w.remove(); };
    $("dg-w-go").onclick = function () { ferme(); ouvrir(); };
    $("dg-w-no").onclick = ferme;
  }
  setInterval(function () { try { bienvenue(); } catch (e) {} }, 1500);

  /* Si l'accueil est reconstruit par un autre script, le bouton revient */
  setInterval(function () { try { poser(); } catch (e) {} }, 1000);
  poser();

  window.DiisooVoixGuide = { version: 1, ouvrir: ouvrir, comprendre: comprendre, aller: aller };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-guide.js",e);}

try{
/* ---- diisoo-seance.js ---- */
/* diisoo-seance.js v1 : séance guidée (Anglais et Wolof ↔ Anglais)
   Un bouton « Séance guidée » dans chaque thème. La voix dit le mot, l'apprenant répète, l'app corrige avec bienveillance
   et passe seule au mot suivant. Mini-quiz, bilan, puis le thème suivant. Rien à chercher, rien à faire défiler. */
(function () {
  "use strict";
  if (window.DiisooSeance) return;
  var $ = function (id) { return document.getElementById(id); };
  function pause(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function norm(s) { return String(s || "").toLowerCase().replace(/[^a-z\s']/g, " ").replace(/\s+/g, " ").trim(); }
  function melanger(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- données du thème en cours ---------- */
  function themeCourant(key) {
    try {
      if (key === "general") {
        var t = GENERAL_THEMES.filter(function (x) { return x.id === generalThemeId; })[0];
        if (!t) return null;
        return { titre: t.title.replace(/🏝️?\s*/g, ""), mots: (t.vocab || []).map(function (v) { return { en: v.en, fr: v.fr, wo: v.wo }; }), key: key, id: t.id };
      }
      if (key === "business") {
        var sk = window.DiisooBiz && DiisooBiz.secteur(), nv = window.DiisooBiz && DiisooBiz.niveau();
        var mod = sk && CHINA_TRADE_WOLOF[sk]; if (!mod || !nv) return null;
        var code = ["debutant", "intermediaire", "avance"][nv - 1];
        var mots = mod.vocab.filter(function (v) { return v.niveau === code; }).map(function (v) { return { en: v.en, fr: v.fr, wo: v.wo }; });
        return { titre: mod.title, mots: mots, key: key, id: sk };
      }
      var W = WOLOF_THEMES.filter(function (x) { return x.id === wolofCat; })[0];
      if (!W) return null;
      return { titre: W.title, mots: LEXICON.filter(function (w) { return w.cat === wolofCat; }), key: key, id: W.id };
    } catch (e) { return null; }
  }

  /* ---------- interface ---------- */
  function css() {
    if ($("dsn-css")) return;
    var s = document.createElement("style"); s.id = "dsn-css";
    s.textContent =
      ".dsn-go{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:52px;margin:8px 0;border-radius:16px;border:0;" +
      "background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;font-weight:800;font-size:15px}" +
      "#dsn{position:fixed;inset:0;z-index:95;background:#0B0F1C;color:#F6F1E7;display:flex;flex-direction:column;padding:68px 18px 18px;overflow-y:auto}" +
      "#dsn.hidden{display:none}" +
      "#dsn .dsn-top{display:flex;align-items:center;justify-content:space-between;gap:8px}" +
      "#dsn .dsn-x{min-height:44px;min-width:44px;border-radius:14px;background:#141A2B;border:1px solid #1E2740;color:#C9BFA8;font-size:13px;padding:0 14px}" +
      "#dsn .dsn-bar{flex:1;height:8px;border-radius:99px;background:#1E2740;overflow:hidden}#dsn .dsn-bar i{display:block;height:100%;background:linear-gradient(90deg,#F3A94E,#E1693F);width:0;transition:width .4s}" +
      "#dsn .dsn-c{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:10px;padding:10px 0}" +
      "#dsn .dsn-lab{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#8C8064}" +
      "#dsn .dsn-big{font-size:34px;font-weight:900;line-height:1.15;max-width:320px}" +
      "#dsn .dsn-wo{font-size:26px;font-weight:800;color:#5FC98F}" +
      "#dsn .dsn-fr{font-size:16px;color:#A69C86}" +
      "#dsn .dsn-orb{width:104px;height:104px;border-radius:50%;margin:14px 0 4px;display:flex;align-items:center;justify-content:center;font-size:44px;background:#141A2B;border:2px solid #1E2740}" +
      "#dsn .dsn-orb.on{background:linear-gradient(135deg,#F3A94E,#E1693F);border-color:transparent;animation:dsnp 1s infinite}" +
      "#dsn .dsn-orb.ok{background:#2C8F5C;border-color:transparent}" +
      "@keyframes dsnp{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(225,105,63,.5)}50%{transform:scale(1.07);box-shadow:0 0 0 18px rgba(225,105,63,0)}}" +
      "#dsn .dsn-msg{min-height:44px;font-size:15px;font-weight:700;max-width:320px}" +
      "#dsn .dsn-row{display:flex;gap:10px;width:100%}" +
      "#dsn .dsn-b{flex:1;min-height:56px;border-radius:16px;font-weight:800;font-size:15px;background:#141A2B;border:1px solid #1E2740;color:#F6F1E7}" +
      "#dsn .dsn-b.p{background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;border:0}" +
      "#dsn .dsn-opt{display:block;width:100%;min-height:56px;margin-top:10px;border-radius:16px;background:#141A2B;border:2px solid #1E2740;color:#F6F1E7;font-weight:700;font-size:16px;padding:10px 14px}" +
      "#dsn .dsn-opt.bon{border-color:#3FAE74;background:#12301f}#dsn .dsn-opt.mal{border-color:#C2542D;background:#33170e}" +
      "#dsn .dsn-stars{font-size:44px;letter-spacing:6px}";
    document.head.appendChild(s);
  }

  var ov = null, S = null;

  function monter() {
    css();
    if (ov) return;
    ov = document.createElement("div"); ov.id = "dsn"; ov.className = "hidden"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Séance guidée");
    document.body.appendChild(ov);
  }
  function entete() {
    return '<div class="dsn-top"><button class="dsn-x" type="button" id="dsn-quit" aria-label="Arrêter la séance">✕ Arrêter</button>' +
      '<div class="dsn-bar"><i id="dsn-prog" style="width:' + S.pct + '%"></i></div></div>';
  }
  function fin() {
    if (!S) return;
    S.jeton++;
    try { if (S.h && S.h.stop) S.h.stop(); } catch (e) {}
    try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
    if (ov) ov.classList.add("hidden");
    S = null;
  }
  function liens() { var q = $("dsn-quit"); if (q) q.onclick = fin; }
  function maj(pct) { S.pct = pct; var b = $("dsn-prog"); if (b) b.style.width = pct + "%"; }
  function dire(t, l) {
    try { return Promise.resolve(speak(t, l, l === "en-US" ? 0.85 : undefined)).catch(function () {}); } catch (e) { return Promise.resolve(); }
  }

  /* ---------- la répétition d'un mot ---------- */
  function ecouterMot(cible, mon) {
    return new Promise(function (res) {
      var h;
      try {
        h = startListening("en-US", 7000, false, function (t) {
          if ((!S || mon !== S.jeton)) return;
          var el = $("dsn-heard"); if (el) el.textContent = "« " + t + " »";
          try { if (voixJuste(norm(t), norm(cible))) h.stop(); } catch (e) {}
        });
      } catch (e) { res({ text: "", indispo: true }); return; }
      S.h = h;
      h.promise.then(function (r) {
        r = r || {};
        if (r.unsupported || r.error === "not-allowed" || r.error === "service-not-allowed") r.indispo = true;
        res(r);
      });
    });
  }
  function note(w, bon) {
    try {
      if (S.key === "general") bumpStat("diisoo_word_stats", "gen:" + S.id + ":" + w.en, bon ? "correct" : "wrong");
      else if (S.key === "business") bumpStat("diisoo_word_stats", "biz:" + S.id + ":" + w.en, bon ? "correct" : "wrong");
      else bumpWordStat(w.en, bon ? "correct" : "wrong");
      if (bon) { addXP(3); bumpDailyGoal(1); }
    } catch (e) {}
  }

  function carte(w, i, essai, mon) {
    var n = S.mots.length;
    maj(Math.round(i / (n + S.quiz.length) * 100));
    ov.innerHTML = entete() +
      '<div class="dsn-c"><div class="dsn-lab">Mot ' + (i + 1) + ' sur ' + n + '</div>' +
      (S.key !== "general" && w.wo ? '<div class="dsn-wo">🇸🇳 ' + esc(w.wo) + '</div>' : "") +
      '<div class="dsn-big">' + esc(w.en) + '</div><div class="dsn-fr">' + esc(w.fr || "") + '</div>' +
      (S.key === "general" && w.wo ? '<div class="dsn-fr" style="color:#5FC98F">🗣️ ' + esc(w.wo) + '</div>' : "") +
      '<div class="dsn-orb" id="dsn-orb" role="img" aria-label="Micro">🔊</div><div class="dsn-msg" id="dsn-msg">Écoute...</div><div id="dsn-heard" class="dsn-fr"></div></div>' +
      '<div class="dsn-row"><button class="dsn-b" type="button" id="dsn-skip">Passer</button><button class="dsn-b" type="button" id="dsn-again">🔁 Réécouter</button></div>';
    liens();
    var passer = false, reecouter = false;
    $("dsn-skip").onclick = function () { passer = true; try { S.h && S.h.stop(); } catch (e) {} };
    $("dsn-again").onclick = function () { reecouter = true; try { S.h && S.h.stop(); stopAllAudio(); } catch (e) {} };
    var dit = (S.key !== "general" && w.wo && essai === 0) ? dire(w.wo, "wo").then(function () { return (S && mon === S.jeton) && pause(250); }) : Promise.resolve();
    return dit.then(function () { return (S && mon === S.jeton) && dire(w.en, "en-US"); }).then(function () {
      if ((!S || mon !== S.jeton)) return "stop";
      var orb = $("dsn-orb"), msg = $("dsn-msg");
      if (orb) { orb.textContent = "🎙️"; orb.className = "dsn-orb on"; }
      if (msg) msg.textContent = "À toi : répète en anglais";
      return ecouterMot(w.en, mon);
    }).then(function (r) {
      if (r === "stop" || (!S || mon !== S.jeton)) return "stop";
      var orb = $("dsn-orb"), msg = $("dsn-msg");
      if (reecouter) return carte(w, i, 1, mon);
      if (passer) return "suite";
      if (r.indispo) { S.micOff = true; if (msg) msg.textContent = "Micro indisponible : on écoute seulement"; return pause(900).then(function () { return "suite"; }); }
      var heard = norm(r.text), bon = heard && voixJuste(heard, norm(w.en));
      if (bon) {
        S.bons++; note(w, true);
        if (orb) { orb.textContent = "✅"; orb.className = "dsn-orb ok"; }
        var ok = ""; try { ok = encourageMsg(); } catch (e) { ok = "Bravo !"; }
        if (msg) msg.textContent = ok;
        return pause(1100).then(function () { return "suite"; });
      }
      if (essai === 0) {
        if (orb) { orb.textContent = "💪"; orb.className = "dsn-orb"; }
        if (msg) msg.textContent = heard ? "J'ai entendu « " + heard + " ». Écoute encore et réessaie." : "Je n'ai rien entendu. On réessaie.";
        return pause(900).then(function () { return carte(w, i, 1, mon); });
      }
      note(w, false); S.revoir.push(w);
      if (msg) msg.textContent = "Pas grave, on le reverra. Réponse : " + w.en;
      return pause(1300).then(function () { return "suite"; });
    });
  }

  /* ---------- le quiz ---------- */
  function questions() {
    var M = S.mots, out = [];
    var base = melanger(M).slice(0, Math.min(5, M.length));
    base.forEach(function (w) {
      var champ = S.key === "general" ? "fr" : "en";
      var autres = melanger(M.filter(function (x) { return x !== w && x[champ] && x[champ] !== w[champ]; })).slice(0, 2);
      if (autres.length < 1) return;
      var opts = melanger([w[champ]].concat(autres.map(function (x) { return x[champ]; })));
      out.push({ q: S.key === "wolof" ? "Comment dit-on « " + w.wo + " » en anglais ?" : S.key === "business" ? "Comment dit-on « " + w.fr + " » en anglais ?" : "Que veut dire « " + w.en + " » ?", bonne: w[champ], opts: opts, mot: w });
    });
    return out;
  }
  function question(k, mon) {
    var Q = S.quiz[k], n = S.mots.length;
    maj(Math.round((n + k) / (n + S.quiz.length) * 100));
    ov.innerHTML = entete() + '<div class="dsn-c" style="justify-content:flex-start;padding-top:28px"><div class="dsn-lab">Mini-quiz ' + (k + 1) + ' sur ' + S.quiz.length + '</div>' +
      '<div class="dsn-big" style="font-size:24px">' + esc(Q.q) + '</div><div style="width:100%" id="dsn-opts"></div><div class="dsn-msg" id="dsn-msg"></div></div>';
    liens();
    return new Promise(function (res) {
      Q.opts.forEach(function (o) {
        var b = document.createElement("button"); b.type = "button"; b.className = "dsn-opt"; b.textContent = o;
        b.onclick = function () {
          var tous = $("dsn-opts").querySelectorAll("button"); for (var i = 0; i < tous.length; i++) tous[i].disabled = true;
          var bon = o === Q.bonne;
          b.className = "dsn-opt " + (bon ? "bon" : "mal");
          if (!bon) Array.prototype.forEach.call(tous, function (x) { if (x.textContent === Q.bonne) x.className = "dsn-opt bon"; });
          if (bon) { S.qbons++; try { addXP(2); } catch (e) {} }
          $("dsn-msg").textContent = bon ? "✅ Exact !" : "Pas tout à fait. C'était : " + Q.bonne;
          var l = S.key === "wolof" ? "en-US" : "en-US";
          dire(Q.mot.en, l).then(function () { return pause(700); }).then(res);
        };
        $("dsn-opts").appendChild(b);
      });
    }).then(function () { return (S && mon === S.jeton) ? "suite" : "stop"; });
  }

  /* ---------- le bilan et le thème suivant ---------- */
  function suivantExiste(key) { return !!boutonSuivant(key); }
  function boutonSuivant(key) {
    if (key === "business") return null;
    var box = $(key === "general" ? "general-tabs" : "wolof-tabs"); if (!box) return null;
    var btns = Array.prototype.slice.call(box.children).filter(function (b) { return b.style.display !== "none"; });
    var th = themeCourant(key); if (!th) return null;
    var titre = String(th.titre).replace(/\s+/g, " ").trim().toLowerCase();
    for (var i = 0; i < btns.length; i++) {
      var tb = btns[i].textContent.replace(/🏝️?/g, "").replace(/N[123]\s*·?/, "").replace(/\s+/g, " ").trim().toLowerCase();
      if (tb.indexOf(titre) >= 0 || titre.indexOf(tb) >= 0) return btns[i + 1] || null;
    }
    return null;
  }
  /* Fin de la toute premiere seance : victoire, promesse du lendemain, puis choix libre de ce que la personne veut faire. */
  function allerA(motif) {
    fin();
    var acc = null; Array.prototype.forEach.call(document.querySelectorAll("button"), function (b) { if (!acc && b.offsetParent && /Accueil/.test(b.textContent)) acc = b; });
    if (acc) acc.click();
    setTimeout(function () {
      var cible = null; Array.prototype.forEach.call(document.querySelectorAll("#screen-dashboard button, #screen-dashboard a"), function (b) { if (!cible && b.offsetParent && motif.test(b.textContent)) cible = b; });
      if (cible) cible.click();
    }, 600);
  }
  function bilanPremier(n, key) {
    ov.innerHTML = entete() + '<div class="dsn-c"><div class="dsn-stars">🎉</div><div class="dsn-big">Bravo !</div>' +
      '<div class="dsn-msg">' + n + ' mots appris. Ta série commence : 🔥 1 jour.</div>' +
      '<div class="dsn-fr">Reviens demain pour 5 nouveaux mots.</div>' +
      '<div class="dsn-lab" style="margin-top:14px">🔔 Je te rappelle demain à quelle heure ?</div>' +
      '<div class="dsn-row" style="margin-top:8px"><button class="dsn-b" type="button" data-h="06:30" id="dsn-h1">🌅 6h30</button><button class="dsn-b" type="button" data-h="12:30" id="dsn-h2">☀️ 12h30</button><button class="dsn-b" type="button" data-h="20:30" id="dsn-h3">🌙 20h30</button></div>' +
      '<div class="dsn-msg" id="dsn-hmsg"></div>' +
      '<div class="dsn-lab" style="margin-top:14px">Maintenant, tu veux quoi ?</div></div>' +
      '<div class="dsn-row" style="flex-direction:column">' +
      '<button class="dsn-b p" type="button" id="dsn-p-ex">✈️ Examens &amp; visa</button>' +
      '<button class="dsn-b" type="button" id="dsn-p-bz">💼 Business et métiers</button>' +
      '<button class="dsn-b" type="button" id="dsn-p-wo">🇸🇳 Wolof ↔ Anglais</button>' +
      '<button class="dsn-b" type="button" id="dsn-p-en">📚 Continuer l\'anglais</button>' +
      '<button class="dsn-b" type="button" id="dsn-end">Plus tard</button></div>';
    liens();
    ["dsn-h1", "dsn-h2", "dsn-h3"].forEach(function (id) {
      var bt = $(id); if (!bt) return;
      bt.onclick = function () {
        var h = bt.getAttribute("data-h");
        try { var o = JSON.parse(localStorage.getItem("diisoo_obj") || "null") || {}; o.heure = h; if (!o.debut) o.debut = new Date().toISOString().slice(0, 10); localStorage.setItem("diisoo_obj", JSON.stringify(o)); } catch (e) {}
        var m = $("dsn-hmsg"); if (m) m.textContent = "⏳ Un instant…";
        var fini = function (bon) { var mm = $("dsn-hmsg"); if (mm) mm.textContent = bon ? "✅ C'est noté : rappel à " + h.replace(":", "h") : "Autorise les notifications pour recevoir le rappel."; };
        try { if (window.DiisooRappel && DiisooRappel.activer) DiisooRappel.activer({ heure: h }).then(fini); else fini(false); } catch (e) { fini(false); }
      };
    });
    $("dsn-end").onclick = fin;
    $("dsn-p-ex").onclick = function () { allerA(/Examens/); };
    $("dsn-p-bz").onclick = function () { allerA(/Business/); };
    $("dsn-p-wo").onclick = function () { allerA(/Wolof/); };
    $("dsn-p-en").onclick = function () { fin(); demarrer(key); };
    try { if (typeof speak === "function") speak("Bravo", "en-US"); } catch (e) {}
  }
  function bilan() {
    var n = S.mots.length, total = n + S.quiz.length, bons = S.bons + S.qbons;
    var pct = total ? Math.round(bons / total * 100) : 0;
    var etoiles = pct >= 85 ? "⭐⭐⭐" : pct >= 60 ? "⭐⭐" : "⭐";
    var phrase = pct >= 85 ? "Excellent ! Tu maîtrises ce thème." : pct >= 60 ? "Très bien ! Encore un peu et c'est parfait." : "Bon début ! Refais la séance pour progresser.";
    var key = S.key;
    maj(100);
    if (S.court) { bilanPremier(n, key); return; }
    ov.innerHTML = entete() + '<div class="dsn-c"><div class="dsn-stars">' + etoiles + '</div><div class="dsn-big">' + pct + ' %</div>' +
      '<div class="dsn-msg">' + phrase + '</div><div class="dsn-fr">' + S.bons + ' mots répétés sur ' + n + ' · ' + S.qbons + ' bonnes réponses au quiz</div>' +
      (S.revoir.length ? '<div class="dsn-fr">À revoir : ' + esc(S.revoir.map(function (w) { return w.en; }).join(", ")) + '</div>' : "") + '</div>' +
      '<div class="dsn-row" style="flex-direction:column">' +
      (suivantExiste(key) ? '<button class="dsn-b p" type="button" id="dsn-next">➡️ Thème suivant</button>' : "") +
      '<button class="dsn-b" type="button" id="dsn-redo">🔁 Refaire la séance</button><button class="dsn-b" type="button" id="dsn-end">Terminer</button></div>';
    liens();
    $("dsn-end").onclick = fin;
    $("dsn-redo").onclick = function () { fin(); demarrer(key); };
    var nx = $("dsn-next");
    if (nx) nx.onclick = function () {
      var b = boutonSuivant(key); fin();
      if (b) { b.click(); setTimeout(function () { demarrer(key); }, 900); }
    };
    try { if (typeof speak === "function") speak("Bravo, " + pct + " pour cent", "en-US"); } catch (e) {}
  }

  /* ---------- déroulé ---------- */
  function demarrer(key, max) {
    monter();
    var th = themeCourant(key);
    if (!th || !th.mots.length) { try { toast("Ouvre d'abord un thème"); } catch (e) {} return; }
    if (max > 0 && th.mots.length > max) th = { id: th.id, titre: th.titre, mots: th.mots.slice(0, max) }; /* v2 : premiere seance courte */
    var court = max > 0;
    if (S) fin();
    S = { key: key, court: court, id: th.id, mots: th.mots, jeton: 1, bons: 0, qbons: 0, revoir: [], quiz: [], pct: 0, h: null };
    var mon = S.jeton;
    var Qs = []; try { Qs = questions(); } catch (e) {}
    if (!S || mon !== S.jeton) return; /* v3 : la seance a pu etre fermee pendant la preparation du quiz */
    S.quiz = Qs;
    ov.classList.remove("hidden");
    ov.innerHTML = entete() + '<div class="dsn-c"><div class="dsn-lab">Séance guidée</div><div class="dsn-big">' + esc(th.titre) + '</div>' +
      '<div class="dsn-fr">' + th.mots.length + ' mots · ' + S.quiz.length + ' questions · environ ' + Math.max(2, Math.round(th.mots.length * 0.35)) + ' min</div>' +
      '<div class="dsn-fr">Écoute, répète à voix haute, je corrige. Je passe seul au mot suivant.</div></div>' +
      '<div class="dsn-row"><button class="dsn-b p" type="button" id="dsn-go">▶️ Commencer</button></div>';
    liens();
    /* Le toucher « Commencer » autorise le son et le micro du navigateur */
    $("dsn-go").onclick = function () {
      (function boucle(i) {
        if (!S || mon !== S.jeton) return;
        if (i >= S.mots.length) { suiteQuiz(0); return; }
        carte(S.mots[i], i, 0, mon).then(function (r) { if (r === "stop" || !S || mon !== S.jeton) return; boucle(i + 1); });
      })(0);
    };
    function suiteQuiz(k) {
      if (!S || mon !== S.jeton) return;
      if (k >= S.quiz.length) { bilan(); return; }
      question(k, mon).then(function (r) { if (r === "stop") return; suiteQuiz(k + 1); });
    }
  }

  /* ---------- le Mini-bilan : 5 questions, sans réapprendre, jamais obligatoire ---------- */
  function trace(nom, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", nom, d || ""); } catch (e) {} }
  function miniBilan(key) {
    monter();
    var th = themeCourant(key);
    if (!th || !th.mots.length) { try { toast("Ouvre d'abord un thème"); } catch (e) {} return; }
    if (S) fin();
    S = { key: key, court: false, id: th.id, mots: th.mots, jeton: 1, bons: 0, qbons: 0, revoir: [], quiz: [], pct: 0, h: null, mini: true };
    var mon = S.jeton, Qs = []; try { Qs = questions(); } catch (e) {}
    if (!S || mon !== S.jeton) return;
    S.quiz = Qs.slice(0, 5);
    if (!S.quiz.length) { fin(); return; }
    S.mots = [];
    trace("minibilan_debut", th.id);
    ov.classList.remove("hidden");
    ov.innerHTML = entete() + '<div class="dsn-c"><div class="dsn-lab">Mini-bilan</div><div class="dsn-big">' + esc(th.titre) + '</div>' +
      '<div class="dsn-fr">' + S.quiz.length + ' questions · 1 minute</div></div>' +
      '<div class="dsn-row"><button class="dsn-b p" type="button" id="dsn-go">▶️ C\'est parti</button></div>';
    liens();
    $("dsn-go").onclick = function () { suite(0); };
    function suite(k) {
      if (!S || mon !== S.jeton) return;
      if (k >= S.quiz.length) { finMini(th); return; }
      question(k, mon).then(function (r) { if (r === "stop") return; suite(k + 1); });
    }
  }
  function finMini(th) {
    var n = S.quiz.length, b = S.qbons, key = S.key, ok = b >= Math.ceil(n * 0.8);
    maj(100); trace("minibilan_fin", th.id + "|" + b + "/" + n);
    ov.innerHTML = entete() + '<div class="dsn-c"><div class="dsn-stars">' + (ok ? "🏅" : "💪") + '</div><div class="dsn-big">' + b + ' / ' + n + '</div>' +
      '<div class="dsn-msg">' + (ok ? "Badge « " + esc(th.titre) + " » gagné !" : "Presque. Refais la séance guidée, puis retente.") + '</div></div>' +
      '<div class="dsn-row" style="flex-direction:column">' +
      (suivantExiste(key) ? '<button class="dsn-b p" type="button" id="dsn-next">➡️ Thème suivant</button>' : "") +
      '<button class="dsn-b" type="button" id="dsn-redo">🔁 Retenter</button><button class="dsn-b" type="button" id="dsn-end">Terminer</button></div>';
    liens();
    if (ok) { try { addXP(10); var o = JSON.parse(localStorage.getItem("diisoo_badges") || "{}"); o[key + ":" + th.id] = new Date().toISOString().slice(0, 10); localStorage.setItem("diisoo_badges", JSON.stringify(o)); } catch (e) {} }
    $("dsn-end").onclick = fin;
    $("dsn-redo").onclick = function () { fin(); miniBilan(key); };
    var nx = $("dsn-next");
    if (nx) nx.onclick = function () { var bt = boutonSuivant(key); fin(); if (bt) bt.click(); };
    try { if (typeof speak === "function") speak(ok ? "Bravo" : "Almost", "en-US"); } catch (e) {}
  }

  /* ---------- le bouton dans chaque thème ---------- */
  function poser() {
    ["general", "wolof", "business"].forEach(function (key) {
      var bar = $(key === "business" ? "bizback-sec" : "thbar-" + key), id = "dsn-btn-" + key;
      var ecran = $(key === "general" ? "screen-general" : key === "wolof" ? "screen-wolof" : "screen-business");
      var visible = ecran && !ecran.classList.contains("hidden");
      var b = $(id);
      if (!bar || !visible) { if (b) b.remove(); return; }
      var pil = key === "general" && window.generalThemeId === "intro" || (key === "general" && typeof generalThemeId !== "undefined" && generalThemeId === "intro"), mb = $("dsn-mb-" + key);
      if (mb && !pil) mb.remove();
      if (b && pil && !mb) { mb = document.createElement("button"); mb.type = "button"; mb.id = "dsn-mb-" + key; mb.className = "dsn-go"; mb.style.background = "#141A2B"; mb.style.color = "#F6F1E7"; mb.style.border = "1px solid #1E2740"; mb.innerHTML = "🎯 Mini-bilan : 5 questions, 1 minute"; mb.onclick = function () { miniBilan(key); }; b.parentNode.insertBefore(mb, b.nextSibling); }
      if (b) return;
      b = document.createElement("button"); b.type = "button"; b.id = id; b.className = "dsn-go";
      b.innerHTML = "▶️ Séance guidée : je te guide, tu répètes";
      b.onclick = function () { demarrer(key); };
      bar.parentNode.insertBefore(b, bar.nextSibling);
    });
  }
  css();
  setInterval(function () { try { poser(); } catch (e) {} }, 600);

  window.DiisooSeance = { version: 1, demarrer: demarrer, miniBilan: miniBilan };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-seance.js",e);}
