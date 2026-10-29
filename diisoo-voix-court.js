/* diisoo-voix-court.js
 * Corrige les mots wolof courts (Waaw, Ndëk...) ou la voix Oolel ajoute des sons inventes apres le mot.
 * Principe : pour un mot ou deux mots seulement, on arrete la lecture a la fin du mot
 * (premier silence apres la voix, ou duree maximale selon la longueur du mot).
 * Ne modifie aucun fichier existant. Une seule ligne a ajouter dans diisoo-secteurs-loader.js.
 */
(function () {
  "use strict";
  /* Interrupteur de test : ouvrir https://diisoo.sn/?court=0 desactive ce correctif */
  try { if (new URLSearchParams(location.search).get("court") === "0") return; } catch (e) {}
  var ACTIF = false;
  var DEBUG = false; /* message temporaire a l'ecran, passer a false une fois valide */
  function avis(m) { try { if (DEBUG && typeof window.toast === "function") window.toast(m); } catch (e) {} }

  /* Calcule la duree a jouer (secondes) pour un signal mono et un nombre de lettres */
  function dureeUtile(data, rate, lettres, mots) {
    mots = mots || 1;
    var fen = Math.max(1, Math.round(rate * 0.01));
    var n = Math.floor(data.length / fen), rms = new Float32Array(n), max = 0, i, j;
    for (i = 0; i < n; i++) {
      var s = 0;
      for (j = 0; j < fen; j++) { var v = data[i * fen + j]; s += v * v; }
      rms[i] = Math.sqrt(s / fen);
      if (rms[i] > max) max = rms[i];
    }
    var total = data.length / rate;
    var cap = 0.5 + 0.1 * lettres + (mots > 2 ? 0.2 * mots : 0);
    var silenceMin = mots > 2 ? 30 : 15; /* 300 ms pour une phrase, 150 ms pour un mot */
    if (max <= 0) return total;
    var seuil = max * 0.06, debut = -1;
    for (i = 0; i < n; i++) { if (rms[i] > seuil) { debut = i; break; } }
    if (debut < 0) return total;
    var coupe = -1, calme = 0;
    for (i = debut; i < n; i++) {
      if (rms[i] <= seuil) {
        calme++;
        /* silence d'au moins 150 ms apres au moins 150 ms de voix */
        if (calme >= silenceMin && (i - calme + 1 - debut) >= 15) { coupe = (i - calme + 1) * fen / rate + 0.06; break; }
      } else calme = 0;
    }
    var fin = coupe > 0 ? coupe : total;
    var plafond = debut * fen / rate + cap;
    return Math.min(fin, plafond, total);
  }

  function motsCourts(texte) {
    var t = String(texte || "").trim();
    var mots = t.split(/\s+/).filter(function (m) { return /\p{L}/u.test(m); });
    var lettres = t.replace(/[^\p{L}]/gu, "").length;
    return (mots.length >= 1 && mots.length <= 4 && lettres <= 24) ? { lettres: lettres, mots: mots.length } : 0;
  }

  function patcherStart() {
    var AB = window.AudioBufferSourceNode;
    if (!AB || AB.prototype.__diisooCourt) return;
    var orig = AB.prototype.start;
    AB.prototype.start = function (when, offset, duration) {
      try {
        if (ACTIF && this.buffer && duration === undefined && !offset) {
          var d = dureeUtile(this.buffer.getChannelData(0), this.buffer.sampleRate, ACTIF.lettres, ACTIF.mots);
          if (d > 0.2 && d < this.buffer.duration - 0.05) {
            avis("\u2702\uFE0F coupe a " + d.toFixed(1) + "s sur " + this.buffer.duration.toFixed(1) + "s");
            return orig.call(this, when || 0, 0, d);
          }
          avis("mot court, audio de " + this.buffer.duration.toFixed(1) + "s, rien a couper");
        }
      } catch (e) {}
      return orig.apply(this, arguments);
    };
    AB.prototype.__diisooCourt = true;
  }

  function envelopper() {
    var V = window.Diisoo && window.Diisoo.voix;
    if (!V || !V.jouer || V.jouer.__court) return !!(V && V.jouer);
    var orig = V.jouer;
    var nouveau = function (texte, langue) {
      var l = langue === "wo" ? motsCourts(texte) : 0;
      ACTIF = l;
      var r;
      try { r = orig.apply(this, arguments); } catch (e) { ACTIF = false; throw e; }
      return Promise.resolve(r).finally(function () { if (ACTIF === l) ACTIF = false; });
    };
    nouveau.__court = true;
    V.jouer = nouveau;
    return true;
  }

  patcherStart();
  var essais = 0;
  var t = setInterval(function () { if (envelopper() || ++essais > 100) clearInterval(t); }, 100);

  if (typeof module !== "undefined") module.exports = { dureeUtile: dureeUtile, motsCourts: motsCourts };
})();
