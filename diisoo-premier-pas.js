/* diisoo-premier-pas.js : le nouveau venu entre directement dans sa premiere lecon guidee.
 * Apres « Commencer » (premiere visite seulement), la seance guidee "Se presenter" s'ouvre toute seule :
 * objectif 5 actions des la premiere minute. Note aussi l'action « commencer » (suivi).
 * Interrupteur : ?premier=0. N'agit qu'une fois par appareil. */
(function () {
  "use strict";
  if (window.__premierPas) return; window.__premierPas = true;
  try { if (new URLSearchParams(location.search).get("premier") === "0") return; } catch (e) {}
  var FAIT = "diisoo_premier_pas";
  function lire() { try { return localStorage.getItem(FAIT); } catch (e) { return "1"; } }
  function ecrire() { try { localStorage.setItem(FAIT, "1"); } catch (e) {} }
  function noter(n) { try { if (window.DiisooSuivi && window.DiisooSuivi.noter) window.DiisooSuivi.noter("action", n, ""); } catch (e) {} }
  var vu = false;
  function appui() {
    if (vu) return; vu = true;
    noter("commencer");
    if (lire()) return;
    ecrire();
    var essais = 0, t = setInterval(function () {
      essais++;
      try {
        var d = document.getElementById("screen-dashboard");
        var pret = d && !d.classList.contains("hidden");
        if (pret && window.DiisooSeance && window.DiisooSeance.demarrer) {
          clearInterval(t);
          setTimeout(function () {
            try {
              if (window.DiisooVoixGuide && window.DiisooVoixGuide.aller) window.DiisooVoixGuide.aller({ type: "anglais", cle: "intro", niv: 1 });
            } catch (e) {}
            var n2 = 0, t2 = setInterval(function () {
              n2++;
              try {
                if (document.querySelector("#screen-general:not(.hidden)") && window.DiisooSeance && window.DiisooSeance.demarrer) {
                  clearInterval(t2); window.DiisooSeance.demarrer("general", 5); noter("premier_pas_auto");
                }
              } catch (e) {}
              if (n2 > 15) clearInterval(t2);
            }, 300);
          }, 400);
          return;
        }
      } catch (e) {}
      if (essais > 40) clearInterval(t);
    }, 250);
  }
  document.addEventListener("submit", function (ev) { try { if (ev.target && ev.target.id === "form-onboarding") appui(); } catch (e) {} }, true);
  document.addEventListener("click", function (ev) { try { if (ev.target && ev.target.closest && ev.target.closest("#btn-submit-onboarding")) setTimeout(appui, 0); } catch (e) {} }, true);
})();
