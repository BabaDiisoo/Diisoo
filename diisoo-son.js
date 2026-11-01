/* diisoo-son.js v1 : sons de retour, comme les assistants vocaux
   - bip montant quand le micro s'ouvre (tu peux parler)
   - bip descendant quand le micro se ferme
   - petit carillon quand la reponse est juste (✅), son doux quand il faut reessayer
   Aucun fichier audio : les sons sont generes par le telephone. Desactiver : localStorage diisoo_son = "0". */
(function () {
  "use strict";

  var ctx = null;
  function actif() { try { return localStorage.getItem("diisoo_son") !== "0"; } catch (e) { return true; } }
  function audio() {
    if (ctx) return ctx;
    try { var C = window.AudioContext || window.webkitAudioContext; if (C) ctx = new C(); } catch (e) {}
    return ctx;
  }
  /* notes : [frequence Hz, debut s, duree s] */
  function jouer(notes, vol) {
    if (!actif()) return;
    var c = audio(); if (!c) return;
    try { if (c.state === "suspended") c.resume(); } catch (e) {}
    var t0 = c.currentTime + 0.01;
    notes.forEach(function (n) {
      try {
        var o = c.createOscillator(), g = c.createGain();
        o.type = "sine"; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, t0 + n[1]);
        g.gain.exponentialRampToValueAtTime(vol || 0.18, t0 + n[1] + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + n[1] + n[2]);
        o.connect(g); g.connect(c.destination);
        o.start(t0 + n[1]); o.stop(t0 + n[1] + n[2] + 0.05);
      } catch (e) {}
    });
  }
  var SONS = {
    ouvre: [[660, 0, 0.09], [880, 0.09, 0.12]],
    ferme: [[880, 0, 0.08], [587, 0.08, 0.12]],
    juste: [[784, 0, 0.1], [988, 0.1, 0.1], [1319, 0.2, 0.22]],
    reessaie: [[392, 0, 0.14], [349, 0.14, 0.2]]
  };
  function son(nom) { if (SONS[nom]) jouer(SONS[nom], nom === "juste" ? 0.2 : 0.16); }
  function vibre(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  /* Le moteur audio se reveille au premier toucher (exigence des navigateurs) */
  ["pointerdown", "touchstart", "click"].forEach(function (ev) {
    window.addEventListener(ev, function () { var c = audio(); try { if (c && c.state === "suspended") c.resume(); } catch (e) {} }, { capture: true, passive: true });
  });

  /* Sons du micro : on enveloppe l'ouverture et la fin de l'ecoute */
  var orig = window.startListening;
  if (typeof orig === "function") {
    window.startListening = function () {
      var h = orig.apply(this, arguments);
      try {
        son("ouvre"); vibre(15);
        if (h && h.promise && h.promise.then) {
          h.promise.then(function () { son("ferme"); }, function () {});
        }
      } catch (e) {}
      return h;
    };
  }

  /* Reponse juste : un ✅ apparait dans une zone de resultat */
  var dernier = 0;
  function verifier(noeud) {
    try {
      var el = noeud.nodeType === 3 ? noeud.parentNode : noeud;
      if (!el || !el.closest) return;
      var zone = el.closest("[id*='res'], [id*='-res'], .res, [data-res]");
      if (!zone) return;
      var t = zone.textContent || "";
      if (Date.now() - dernier < 900) return;
      if (t.indexOf("✅") > -1) { dernier = Date.now(); son("juste"); vibre([20, 40, 20]); }
      else if (/Réessaie|Reessaie|Rien entendu|Objectif/i.test(t)) { dernier = Date.now(); son("reessaie"); }
    } catch (e) {}
  }
  try {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === "childList") { for (var k = 0; k < m.addedNodes.length; k++) verifier(m.addedNodes[k]); }
        else if (m.type === "characterData") verifier(m.target);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) {}

  window.DiisooSon = { jouer: son, version: 1 };
})();
