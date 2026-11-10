/* diisoo-arrivee.js v2 : arrivee par lien (?source=tiktok) = mini-lecon d'1 minute. Par defaut : entretien visa. Avec &mini=wolof : Wolof > Anglais #2 (Nanga def, Jerejef, Ndank ndank). &revoir=1 force l'affichage. */
(function () {
  "use strict";
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var q = {};
  try { new URLSearchParams(location.search).forEach(function (v, k) { q[k] = v; }); } catch (e) {}
  var src = String(q.source || q.utm_source || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 24);
  if (!src) return;
  var MODE = String(q.mini || "").toLowerCase() === "wolof" ? "wo" : "visa";
  var CLE_VU = MODE === "wo" ? "diisoo_arrivee_vu_wo" : "diisoo_arrivee_vu";
  ecrire("diisoo_source", src);
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  setTimeout(function () { noter("arrivee", src); }, 3000);
  if (lire(CLE_VU) === "1" && q.mini !== "1" && q.revoir !== "1") return;

  var QUESTION = "Why do you want to study in Canada?";
  var MODELE = "I want to study in Canada because I want to improve my skills.";
  var st = document.createElement("style");
  st.textContent =
    "#dar{position:fixed;inset:0;z-index:99990;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px 20px 24px;font-family:inherit;text-align:center}" +
    "#dar .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#dar h1{font-size:24px;font-weight:800;line-height:1.2;margin:0}" +
    "#dar .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#dar .r{min-height:62px;font-size:17px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#dar button{border:0;border-radius:18px;font-weight:800;min-height:52px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#dar .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}" +
    "#dar .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}" +
    "#dar .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#dar .m{width:92px;height:92px;border-radius:50%;max-width:92px;padding:0;font-size:36px;background:#E1693F;color:#fff;box-shadow:0 0 0 0 rgba(225,105,63,.6)}" +
    "#dar .m.on{animation:darp 1s infinite}@keyframes darp{70%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#dar .d{font-size:12px;color:#8C8064;max-width:320px;line-height:1.35}" +
    "#dar .ok{color:#25D366}#dar .or{color:#FFAA3C}" +
    "#dar .wo{font-size:34px;font-weight:800;line-height:1.15;color:#E1693F;background:#F6F1E7;border-radius:20px;padding:18px 20px;max-width:320px;width:100%;box-sizing:border-box}" +
    "#dar .en{min-height:44px;font-size:26px;font-weight:800;color:#6FA8FF;max-width:320px}" +
    "#dar .li{font-size:19px;font-weight:700;line-height:1.5;max-width:320px}" +
    "#dar .li b{color:#E1693F}";
  document.head.appendChild(st);

  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }
  function fermer() { var e = document.getElementById("dar"); if (e) e.remove(); ecrire(CLE_VU, "1"); }
  var MOTS = [
    { wo: "Nanga def ?", say: "Nanga def", en: "How are you?", cle: "how" },
    { wo: "Jërëjëf", say: "Jërëjëf", en: "Thank you", cle: "thank" },
    { wo: "Ndank ndank", say: "Ndank ndank", en: "Slowly", cle: "slow" }
  ];
  function ouvrirWolof() {
    if (document.getElementById("dar")) return;
    var o = document.createElement("div"); o.id = "dar";
    document.body.appendChild(o);
    var i = 0, enCours = false;
    function dire(t, l, r) { try { if (typeof speak === "function") return speak(t, l, r); } catch (e) {} }
    function etape() {
      var m = MOTS[i];
      o.innerHTML =
        '<div class="k">Wolof &gt; Anglais #2 · mot ' + (i + 1) + ' sur 3</div>' +
        '<h1>Écoute, puis dis-le en anglais</h1>' +
        '<div class="wo" id="dw-wo">' + m.wo + '</div>' +
        '<button class="b2" id="dw-ec" type="button">🔊 Écouter en wolof</button>' +
        '<button class="b1" id="dw-voir" type="button">Voir l\'anglais</button>' +
        '<div class="en" id="dw-en"></div>' +
        '<button class="m" id="dw-mic" type="button" aria-label="Répéter" style="display:none">🎙️</button>' +
        '<div class="r" id="dw-r"></div>' +
        '<button class="b1" id="dw-suite" type="button" style="display:none">' + (i < 2 ? "Mot suivant" : "Terminer") + '</button>' +
        '<button class="b3" id="dw-pass" type="button">Passer</button>';
      var en = document.getElementById("dw-en"), r = document.getElementById("dw-r"), mic = document.getElementById("dw-mic"), suite = document.getElementById("dw-suite"), voir = document.getElementById("dw-voir");
      document.getElementById("dw-ec").onclick = function () { dire(m.say, "wo", 0.8); };
      document.getElementById("dw-pass").onclick = function () { noter("mini_wo_passer", src + ":" + (i + 1)); fermer(); };
      voir.onclick = function () {
        voir.style.display = "none";
        en.textContent = "= " + m.en;
        mic.style.display = "block"; suite.style.display = "block";
        r.textContent = "Touche le micro et répète : " + m.en;
        noter("mini_wo_mot", src + ":" + (i + 1));
        dire(m.en, "en-US", 0.9);
      };
      suite.onclick = function () { i++; if (i < MOTS.length) etape(); else fin(); };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici. Continue."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null;
        try { h = startListening("en-US", 6000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.toLowerCase().indexOf(m.cle) >= 0;
          r.innerHTML = '<span class="' + (bon ? "ok" : "or") + '">' + (bon ? "Bien joué !" : "Presque, réessaie.") + '</span><br>« ' + t.replace(/</g, "&lt;") + ' »';
          noter("mini_wo_reponse", src + ":" + (i + 1));
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
      setTimeout(function () { dire(m.say, "wo", 0.8); }, 600);
    }
    function fin() {
      noter("mini_wo_fin", src);
      var lien = "https://diisoo.sn/?source=whatsapp&mini=wolof";
      var txt = "Tu sais dire « Nanga def » en anglais ? Essaie sur Diisoo, c'est gratuit : " + lien;
      o.innerHTML =
        '<div class="k">Bravo</div>' +
        '<h1>3 mots wolof, 3 mots anglais</h1>' +
        '<div class="li"><b>Nanga def ?</b> = How are you?<br><b>Jërëjëf</b> = Thank you<br><b>Ndank ndank</b> = Slowly</div>' +
        '<button class="b1" id="dw-go" type="button">Continuer sur Diisoo</button>' +
        '<button class="b2" id="dw-wa" type="button">Envoyer à un ami (WhatsApp)</button>';
      document.getElementById("dw-go").onclick = function () { fermer(); };
      document.getElementById("dw-wa").onclick = function () { noter("mini_wo_partage", src); try { window.open("https://wa.me/?text=" + encodeURIComponent(txt), "_blank"); } catch (e) {} };
    }
    noter("mini_wo_vue", src);
    etape();
  }
  function ouvrir() {
    if (MODE === "wo") return ouvrirWolof();
    if (document.getElementById("dar")) return;
    var o = document.createElement("div"); o.id = "dar";
    o.innerHTML =
      '<div class="k">Entretien visa · 1 minute</div>' +
      '<h1>Écoute la question, réponds à voix haute</h1>' +
      '<div class="q" id="dar-q">' + QUESTION + '</div>' +
      '<button class="b2" id="dar-ec" type="button">🔊 Écouter la question</button>' +
      '<button class="m" id="dar-mic" type="button" aria-label="Parler">🎙️</button>' +
      '<div class="r" id="dar-r">Touche le micro et réponds en anglais.</div>' +
      '<div id="dar-fin" style="display:none;width:100%;max-width:320px;flex-direction:column;gap:8px;align-items:center">' +
      '<button class="b2" id="dar-mod" type="button">🔊 Écouter une réponse modèle</button>' +
      '<button class="b1" id="dar-visa" type="button">Continuer l\'entretien visa</button>' +
      '<button class="b2" id="dar-ex" type="button">Voir tous les examens</button></div>' +
      '<button class="b3" id="dar-pass" type="button">Passer</button>' +
      '<div class="d">Préparation indépendante. Diisoo n\'est pas affilié aux organismes d\'examen.</div>';
    document.body.appendChild(o);
    var r = document.getElementById("dar-r"), mic = document.getElementById("dar-mic"), fin = document.getElementById("dar-fin");
    document.getElementById("dar-ec").onclick = function () { parler(QUESTION); };
    document.getElementById("dar-mod").onclick = function () { parler(MODELE); };
    document.getElementById("dar-pass").onclick = function () { noter("mini_passer", src); fermer(); };
    document.getElementById("dar-visa").onclick = function () { noter("mini_visa", src); choisir("visa"); };
    document.getElementById("dar-ex").onclick = function () { noter("mini_examens", src); choisir("examens"); };
    var enCours = false;
    mic.onclick = function () {
      if (enCours) return;
      if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici. Continue avec les examens."; fin.style.display = "flex"; return; }
      enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
      var h = null;
      try { h = startListening("en-US", 7000, false); } catch (e) { h = null; }
      Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
        enCours = false; mic.classList.remove("on");
        var t = res && res.text ? String(res.text).trim() : "";
        if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; fin.style.display = "flex"; return; }
        if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
        var n = t.split(/\s+/).length;
        r.innerHTML = '<span class="' + (n >= 4 ? "ok" : "or") + '">' + (n >= 4 ? "Bien joué !" : "Essaie une phrase plus longue.") + '</span><br>« ' + t.replace(/</g, "&lt;") + ' »';
        noter("mini_reponse", src);
        if (n >= 4) fin.style.display = "flex";
      }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; fin.style.display = "flex"; });
    };
    noter("mini_vue", src);
    setTimeout(function () { parler(QUESTION); }, 800);
  }
  function visible(id) { var d = document.getElementById(id); return !!(d && !d.classList.contains("hidden") && d.offsetParent); }
  function agir(intent) {
    if (intent === "visa") { try { generalThemeId = "visa"; openGeneralModule(); } catch (e) {} }
    else if (intent === "examens") { try { startTestSimulation(); } catch (e) {} }
  }
  // Apres l'inscription : si le visiteur avait choisi une suite, on l'y emmene une seule fois.
  var tentatives = 0;
  var suite = setInterval(function () {
    var it = lire("diisoo_arrivee_suite");
    if (!it || ++tentatives > 900) { clearInterval(suite); return; }
    if (visible("screen-dashboard") && !document.getElementById("dar")) { ecrire("diisoo_arrivee_suite", ""); clearInterval(suite); agir(it); }
  }, 1000);
  function choisir(intent) {
    fermer();
    if (visible("screen-dashboard")) agir(intent); else ecrire("diisoo_arrivee_suite", intent);
  }
  function demarrer() { setTimeout(ouvrir, 500); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer); else demarrer();
})();
