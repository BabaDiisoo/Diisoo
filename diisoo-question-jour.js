/* diisoo-question-jour.js v1 : carte "Question du jour" (entretien visa, examens, business) + serie de jours */
(function () {
  "use strict";
  var Q = [
    ["Why do you want to study in Canada?", "I want to study in Canada because I want to improve my skills."],
    ["What is your name and where are you from?", "My name is Awa and I am from Senegal."],
    ["What do you do for a living?", "I work in a travel agency in Thies."],
    ["Why do you want to visit France?", "I want to visit France to see my family and discover the country."],
    ["How long will you stay?", "I will stay for two weeks."],
    ["Who will pay for your trip?", "I will pay for the trip myself."],
    ["Do you have family in the country you want to visit?", "Yes, I have a cousin who lives there."],
    ["What is the purpose of your visit?", "The purpose of my visit is tourism."],
    ["Where will you stay?", "I will stay at a hotel in the city center."],
    ["Do you have a return ticket?", "Yes, I have a return ticket for the same month."],
    ["Do you have a job in your country?", "Yes, I have a job and my family is in Senegal."],
    ["Are you married?", "Yes, I am married and I have two children."],
    ["Why should we give you a visa?", "You should give me a visa because I will come back to my family and my job."],
    ["What will you study?", "I will study business management."],
    ["Why did you choose this university?", "I chose this university because it has a good program."],
    ["How will you pay for your studies?", "My family will pay for my studies."],
    ["What are your plans after your studies?", "After my studies, I will come back to Senegal and start my business."],
    ["Have you travelled abroad before?", "Yes, I travelled to Gambia last year."],
    ["Tell me about your job.", "I work in a travel agency. I help customers book flights and hotels."],
    ["How is your English?", "My English is good and I practise every day."],
    ["Why do you want to learn English?", "I want to learn English for my studies and my work."],
    ["Can you describe your family?", "I have a big family. I live with my parents and my two sisters."],
    ["What do you do in your free time?", "In my free time, I like football and music."],
    ["Tell me about your hometown.", "I come from Thies. It is a busy city near Dakar."],
    ["What is your favourite food?", "My favourite food is chicken with rice."],
    ["What time do you get up?", "I get up at six o'clock every morning."],
    ["Can you introduce your business?", "I sell clothes and I want to grow my business."],
    ["How much does this cost?", "This costs ten thousand francs."],
    ["Can you give me a discount?", "Can you give me a better price, please?"],
    ["Where is the nearest bank?", "The bank is next to the market, on the left."]
  ];
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function jour(dec) { var d = new Date(); d.setDate(d.getDate() + (dec || 0)); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function idx() { var d = new Date(); var n = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 0, 1)) / 86400000); return ((n % Q.length) + Q.length) % Q.length; }
  function etat() { var e; try { e = JSON.parse(lire("diisoo_qj") || "{}"); } catch (x) { e = {}; } return { last: e.last || "", serie: e.serie || 0 }; }
  function serieActive() { var e = etat(); return (e.last === jour(0) || e.last === jour(-1)) ? e.serie : 0; }
  function faitAujourdhui() { return etat().last === jour(0); }

  var st = document.createElement("style");
  st.textContent =
    "#dqj{order:3;display:flex;align-items:center;gap:10px;width:100%;min-height:50px;padding:6px 14px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;text-align:left}" +
    "#dqj .a{font-size:22px}#dqj .t{flex:1;font-size:14.5px;font-weight:800;line-height:1.2}#dqj .t small{display:block;font-size:12px;font-weight:600;color:#A69C86}" +
    "#dqj .s{font-size:13px;font-weight:800;color:#FFAA3C;white-space:nowrap}#dqj.ok{border-color:#25D366}#dqj.ok .s{color:#25D366}" +
    "@media (max-height:700px){#screen-dashboard:not(.hidden) .grid.grid-cols-2{grid-template-rows:repeat(2,142px)!important}}" +
    "#dqo{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px;text-align:center}" +
    "#dqo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#dqo .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#dqo .r{min-height:62px;font-size:17px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#dqo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#dqo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#dqo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#dqo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#dqo .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#dqo .m.on{animation:dqp 1s infinite}@keyframes dqp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#dqo .ok{color:#25D366}#dqo .or{color:#FFAA3C}";
  document.head.appendChild(st);

  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }
  function ouvrir() {
    if (document.getElementById("dqo")) return;
    var i = idx(), qq = Q[i];
    var o = document.createElement("div"); o.id = "dqo";
    o.innerHTML =
      '<div class="k">Question du jour · ' + (i + 1) + '/' + Q.length + '</div>' +
      '<div class="q">' + qq[0] + '</div>' +
      '<button class="b2" id="dqo-ec" type="button">🔊 Écouter la question</button>' +
      '<button class="m" id="dqo-mic" type="button" aria-label="Parler">🎙️</button>' +
      '<div class="r" id="dqo-r">Touche le micro et réponds en anglais.</div>' +
      '<div id="dqo-fin" style="display:none;width:100%;flex-direction:column;gap:8px;align-items:center">' +
      '<button class="b2" id="dqo-mod" type="button">🔊 Écouter une réponse modèle</button>' +
      '<button class="b1" id="dqo-sh" type="button">Partager sur WhatsApp</button></div>' +
      '<button class="b3" id="dqo-x" type="button">Fermer</button>';
    document.body.appendChild(o);
    var r = document.getElementById("dqo-r"), mic = document.getElementById("dqo-mic"), fin = document.getElementById("dqo-fin");
    document.getElementById("dqo-ec").onclick = function () { parler(qq[0]); };
    document.getElementById("dqo-mod").onclick = function () { parler(qq[1]); };
    document.getElementById("dqo-x").onclick = function () { o.remove(); majCarte(); };
    document.getElementById("dqo-sh").onclick = function () {
      var txt = "Ma question d'entretien du jour sur Diisoo : « " + qq[0] + " ». Essaie, c'est gratuit : https://diisoo.sn/?source=whatsapp";
      noter("qj_partage");
      try { if (navigator.share) { navigator.share({ text: txt }); return; } } catch (e) {}
      window.open("https://wa.me/?text=" + encodeURIComponent(txt), "_blank");
    };
    var enCours = false;
    mic.onclick = function () {
      if (enCours) return;
      if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
      enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
      var h = null; try { h = startListening("en-US", 7000, false); } catch (e) { h = null; }
      Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
        enCours = false; mic.classList.remove("on");
        var t = res && res.text ? String(res.text).trim() : "";
        if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
        if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
        var n = t.split(/\s+/).length;
        if (n < 3) { r.innerHTML = '<span class="or">Essaie une phrase plus longue.</span><br>« ' + t.replace(/</g, "&lt;") + ' »'; return; }
        var e = etat(), s = e.serie;
        if (e.last !== jour(0)) { s = (e.last === jour(-1)) ? e.serie + 1 : 1; ecrire("diisoo_qj", JSON.stringify({ last: jour(0), serie: s })); }
        r.innerHTML = '<span class="ok">Bravo ! Série : ' + s + ' jour' + (s > 1 ? 's' : '') + '</span><br>« ' + t.replace(/</g, "&lt;") + ' »';
        fin.style.display = "flex"; noter("qj_reponse", String(s)); majCarte();
      }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
    };
    noter("qj_vue");
    setTimeout(function () { parler(qq[0]); }, 700);
  }
  function majCarte() {
    var c = document.getElementById("dqj"); if (!c) return;
    var fait = faitAujourdhui(), s = serieActive();
    c.className = fait ? "ok" : "";
    c.innerHTML = '<span class="a">' + (fait ? "✅" : "🎯") + '</span><span class="t">Question du jour<small>' + (fait ? "Bravo, à demain !" : "Réponds à voix haute, 1 minute") + '</small></span><span class="s">' + (s ? "🔥 " + s : "") + '</span>';
  }
  function monter() {
    var d = document.getElementById("screen-dashboard"); if (!d) return;
    if (document.getElementById("dqj")) return;
    var rev = document.getElementById("revision-card");
    if (!rev || !rev.parentNode) return;
    var b = document.createElement("button"); b.type = "button"; b.id = "dqj";
    b.onclick = ouvrir;
    rev.parentNode.insertBefore(b, rev.nextSibling);
    majCarte();
  }
  var essais = 0;
  (function boucle() { try { monter(); } catch (e) {} if (++essais < 40) setTimeout(boucle, 750); })();
  try { new MutationObserver(function () { if (!document.getElementById("dqj")) { try { monter(); } catch (e) {} } }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
})();
