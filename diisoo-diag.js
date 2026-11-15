/* diisoo-diag.js v1 : page de test (?diag=1) pour verifier micro, voix, son et installation sur chaque telephone. */
(function () {
  "use strict";
  if (!/[?&]diag=1/.test(location.search) && location.hash !== "#diag") return;
  var R = {};
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function ua() { return navigator.userAgent || ""; }
  function modele() { var m = ua().match(/Android [^;]*;\s*([^)]*?)\s*(Build|\))/); return m ? m[1] : "inconnu"; }
  function chrome() { var m = ua().match(/(Chrome|SamsungBrowser|MiuiBrowser|HuaweiBrowser|UCBrowser|OPR|Firefox)\/([\d.]+)/); return m ? m[1] + " " + m[2].split(".")[0] : "inconnu"; }
  function android() { var m = ua().match(/Android ([\d.]+)/); return m ? m[1] : (/iPhone|iPad/.test(ua()) ? "iOS" : "inconnu"); }
  var box = document.createElement("div");
  box.id = "dii-diag";
  box.style.cssText = "position:fixed;inset:0;z-index:2147483000;background:#0B0F1C;color:#F6F1E7;overflow:auto;padding:14px 14px 40px;font:14px/1.45 Roboto,Arial,sans-serif";
  function btn(id, txt) { return '<button id="' + id + '" style="display:block;width:100%;margin:8px 0;padding:12px;border-radius:12px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-size:15px;font-weight:700">' + txt + "</button>"; }
  box.innerHTML = '<h2 style="margin:0 0 6px;font-size:20px">Test de ton téléphone</h2><p style="margin:0 0 10px;color:#A69C86">Touche chaque bouton, puis envoie le résultat.</p><div id="dd-info"></div>' +
    btn("dd-mic", "🎙️ Tester le micro") + btn("dd-voix", "🔊 Tester la voix anglaise") + btn("dd-son", "🎵 Tester le son") +
    '<pre id="dd-res" style="white-space:pre-wrap;background:#141A2B;border-radius:12px;padding:10px;margin:10px 0;font-size:13px"></pre>' +
    btn("dd-envoi", "📤 Envoyer le résultat par WhatsApp") + btn("dd-fermer", "⬅️ Retour à l’app");
  document.body.appendChild(box);
  function $(id) { return document.getElementById(id); }
  function rendre() {
    var l = [];
    Object.keys(R).forEach(function (k) { l.push(k + " : " + R[k]); });
    $("dd-res").textContent = l.join("\n");
  }
  function info() {
    R["Modèle"] = modele(); R["Android"] = android(); R["Navigateur"] = chrome();
    R["Écran"] = screen.width + "x" + screen.height + " (dpr " + (window.devicePixelRatio || 1) + ")";
    R["Installée"] = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) ? "oui" : "non (navigateur)";
    R["Internet"] = navigator.onLine ? "oui" : "non";
    R["Reconnaissance vocale"] = (window.SpeechRecognition || window.webkitSpeechRecognition) ? "disponible" : "NON DISPONIBLE";
    R["Synthèse vocale"] = ("speechSynthesis" in window) ? "disponible" : "NON DISPONIBLE";
    try { localStorage.setItem("dd", "1"); localStorage.removeItem("dd"); R["Stockage"] = "ok"; } catch (e) { R["Stockage"] = "BLOQUÉ"; }
    R["Service worker"] = ("serviceWorker" in navigator) ? "disponible" : "NON DISPONIBLE";
    if (window.caches && caches.keys) caches.keys().then(function (k) { R["Version app"] = k.join(", ") || "aucune"; rendre(); });
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) navigator.serviceWorker.getRegistration().then(function (r) { R["Service worker actif"] = r && r.active ? "oui" : "non"; rendre(); });
    if (window.speechSynthesis) { var v = speechSynthesis.getVoices(); R["Voix anglaises"] = v.filter(function (x) { return /^en/i.test(x.lang); }).length + " sur " + v.length; speechSynthesis.onvoiceschanged = function () { var w = speechSynthesis.getVoices(); R["Voix anglaises"] = w.filter(function (x) { return /^en/i.test(x.lang); }).length + " sur " + w.length; rendre(); }; }
    rendre();
  }
  $("dd-mic").onclick = function () {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { R["Test micro"] = "ÉCHEC : pas de reconnaissance vocale sur ce navigateur"; rendre(); return; }
    R["Test micro"] = "parle en anglais maintenant (5 s)..."; rendre();
    var r = new SR(), fini = false; r.lang = "en-US"; r.interimResults = true; r.maxAlternatives = 1;
    var t0 = Date.now(), vu = "";
    r.onresult = function (e) { vu = e.results[e.results.length - 1][0].transcript; R["Test micro"] = "entendu : « " + vu + " »"; rendre(); };
    r.onerror = function (e) { fini = true; R["Test micro"] = "ERREUR : " + e.error + (e.error === "not-allowed" ? " (autorise le micro dans les réglages)" : e.error === "network" ? " (pas d'Internet ou service vocal absent)" : ""); rendre(); };
    r.onend = function () { if (!fini && !vu) R["Test micro"] = "ÉCHEC : rien entendu en " + Math.round((Date.now() - t0) / 1000) + " s"; else if (!fini) R["Test micro"] = "OK · " + R["Test micro"]; rendre(); };
    try { r.start(); setTimeout(function () { try { r.stop(); } catch (e) {} }, 6000); } catch (e) { R["Test micro"] = "ERREUR : " + e.message; rendre(); }
  };
  $("dd-voix").onclick = function () {
    if (!window.speechSynthesis) { R["Test voix"] = "ÉCHEC : pas de synthèse vocale"; rendre(); return; }
    try {
      var u = new SpeechSynthesisUtterance("Hello, this is a voice test."); u.lang = "en-US";
      u.onstart = function () { R["Test voix"] = "lecture en cours : tu dois entendre une voix"; rendre(); };
      u.onend = function () { R["Test voix"] = "OK : lecture terminée (as-tu entendu ? oui / non)"; rendre(); };
      u.onerror = function (e) { R["Test voix"] = "ERREUR : " + (e.error || "inconnue"); rendre(); };
      speechSynthesis.cancel(); speechSynthesis.speak(u);
      setTimeout(function () { if (!R["Test voix"]) { R["Test voix"] = "ÉCHEC : aucune lecture démarrée"; rendre(); } }, 3000);
    } catch (e) { R["Test voix"] = "ERREUR : " + e.message; rendre(); }
  };
  $("dd-son").onclick = function () {
    try {
      var A = window.AudioContext || window.webkitAudioContext, c = new A(), o = c.createOscillator(), g = c.createGain();
      o.frequency.value = 660; g.gain.value = 0.2; o.connect(g); g.connect(c.destination); o.start(); setTimeout(function () { o.stop(); c.close(); R["Test son"] = "OK : tu as dû entendre un bip"; rendre(); }, 600);
    } catch (e) { R["Test son"] = "ERREUR : " + e.message; rendre(); }
  };
  $("dd-envoi").onclick = function () {
    var l = []; Object.keys(R).forEach(function (k) { l.push(k + " : " + R[k]); });
    window.open("https://wa.me/221772882109?text=" + encodeURIComponent("Test Diisoo\n" + l.join("\n")), "_blank");
  };
  $("dd-fermer").onclick = function () { location.href = location.pathname; };
  info();
})();
