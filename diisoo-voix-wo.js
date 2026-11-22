/* diisoo-voix-wo.js : voix wolof plus fiable. Un seul nouvel essai après une panne passagère (Space d'Oolel qui se réveille),
 * et signalement des phrases en échec ou lentes (événements « [diisoo-voix-wo] ... ») pour savoir lesquelles faire enregistrer
 * par une vraie voix. Ne change rien d'autre. Interrupteur : ?voixwo=0 */
(function () {
  "use strict";
  if (window.__voixWoOK) return; window.__voixWoOK = true;
  try { if (new URLSearchParams(location.search).get("voixwo") === "0") return; } catch (e) {}
  var signales = 0;
  function note(msg, t) { if (signales++ < 30) console.error("[diisoo-voix-wo] " + msg, String(t || "").slice(0, 100)); }
  function attendre(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function installer(V) {
    var orig = V.jouer;
    V.jouer = async function (texte, langue, options) {
      if (langue !== "wo" || !texte) return orig.apply(this, arguments);
      var debut = Date.now(), args = arguments, self = this, o = options || {}, aDebute = false, o2 = Object.assign({}, o);
      o2.onDebut = function () { aDebute = true; if (Date.now() - debut > 7000) note("lent", texte); if (o.onDebut) o.onDebut(); };
      var a2 = Array.prototype.slice.call(args); a2[2] = o2;
      try { return await orig.apply(self, a2); }
      catch (e1) {
        if (aDebute) throw e1;
        note("echec", texte);
        await attendre(1800);
        try { return await orig.apply(self, a2); } catch (e2) { note("echec definitif", texte); throw e2; }
      }
    };
  }
  var n = 0, t = setInterval(function () {
    n++;
    if (window.Diisoo && window.Diisoo.voix && typeof window.Diisoo.voix.jouer === "function") { clearInterval(t); setTimeout(function () { installer(window.Diisoo.voix); }, 1500); }
    else if (n > 80) clearInterval(t);
  }, 250);
})();
