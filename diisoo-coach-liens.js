/* diisoo-coach-liens.js
 * Branche le coach vocal (diisoo-coach.js) dans les Outils Business et dans les modules « Anglais des marchés ».
 * Les simulateurs d'examens (IELTS, TOEFL...) gardent leur propre moteur micro : le coach n'y est pas ajouté.
 * Charger APRES diisoo-coach.js et diisoo-lecons.js. Ne modifie aucun autre fichier.
 */
(function () {
  "use strict";
  if (window.__diisooCoachLiens) return;
  window.__diisooCoachLiens = true;

  var STYLE = "width:100%;min-height:44px;margin-top:6px;border-radius:12px;border:1px solid #F3A94E;background:transparent;color:#F3A94E;font-weight:700;font-size:13px;";
  function pron(en) { var P = window.DiisooPronEN || {}; return P[en] || ""; }
  function bouton(onclick) {
    var c = document.createElement("button");
    c.type = "button"; c.textContent = "🎓 Coach vocal"; c.style.cssText = STYLE; c.onclick = onclick;
    return c;
  }

  /* 1) Outils Business : cartes de vocabulaire (boutons data-biz) */
  function business() {
    var T; try { T = typeof CHINA_TRADE_WOLOF !== "undefined" ? CHINA_TRADE_WOLOF : null; } catch (e) { T = null; }
    if (!T) return;
    document.querySelectorAll('button[data-biz="en"]').forEach(function (b) {
      var sec = b.getAttribute("data-sec"), i = parseInt(b.getAttribute("data-i"), 10);
      var grille = b.parentElement, carte = grille && grille.parentElement;
      if (!carte || carte.getAttribute("data-dii-coach") === "1" || !T[sec] || !T[sec].vocab[i]) return;
      carte.setAttribute("data-dii-coach", "1");
      var lancer = function (k) {
        var v = T[sec].vocab[k]; if (!v || !window.DiisooCoach) return;
        window.DiisooCoach.ouvrir({
          en: v.en, pron: pron(v.en), wo: v.wo || "", fr: v.fr || "",
          suivant: T[sec].vocab[k + 1] ? function () { lancer(k + 1); } : null
        });
      };
      var cible = carte.querySelector('button[onclick^="practiceBusinessPhrase"]') || grille;
      cible.parentNode.insertBefore(bouton(function () { lancer(i); }), cible.nextSibling);
    });
  }

  /* 2) Modules « Anglais des marchés » : cartes .mk-card */
  function marches() {
    document.querySelectorAll(".mk-card").forEach(function (carte) {
      if (carte.getAttribute("data-dii-coach") === "1" || carte.querySelector(".mk-choix")) return;
      var en = carte.querySelector(".mk-en, .mk-big");
      if (!en) return;
      var texte = (en.textContent || "").trim();
      if (!texte) return;
      carte.setAttribute("data-dii-coach", "1");
      var frEl = carte.querySelector(".mk-fr"), woEl = carte.querySelector(".mk-wo");
      var fr = frEl ? frEl.textContent.trim() : "";
      var wo = woEl ? woEl.textContent.replace(/^\s*🗣️\s*/, "").trim() : "";
      var b = bouton(function () {
        if (window.DiisooCoach) window.DiisooCoach.ouvrir({ en: texte, pron: pron(texte), wo: wo, fr: fr });
      });
      var suivant = carte.querySelector("#mk-next");
      if (suivant) suivant.parentNode.insertBefore(b, suivant); else carte.appendChild(b);
    });
  }

  var plan = false;
  function planifier() {
    if (plan) return; plan = true;
    setTimeout(function () { plan = false; try { if (window.DiisooCoach) { business(); marches(); } } catch (e) {} }, 250);
  }
  new MutationObserver(planifier).observe(document.body, { childList: true, subtree: true });
  planifier();
})();
