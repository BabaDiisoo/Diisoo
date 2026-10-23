/* diisoo-secteurs-ui.js
 * Écran d'un module sectoriel (étapes B à G) branché sur DiisooSecteurs.
 * Usage : DiisooSecteursUI.ouvrir("colobane-pieces-auto-debutant", conteneur)
 *         DiisooSecteursUI.menu(conteneur)  // liste des 4 marchés
 * Voix : utilise window.diisooParler(texte, langue) si elle existe (voix Oolel / TTS
 * déjà en place). Sinon, les boutons Écouter sont masqués. Aucun speechSynthesis.
 * Styles injectés avec le préfixe "dsx-" pour ne rien casser.
 */
(function () {
  "use strict";

  var CSS = [
    ".dsx{background:#121212;color:#f2f2f2;font-family:system-ui,sans-serif;padding:16px;border-radius:14px;max-width:560px;margin:0 auto}",
    ".dsx h2{margin:0 0 4px;font-size:20px;color:#f5c542}",
    ".dsx .dsx-sub{opacity:.7;font-size:13px;margin-bottom:14px}",
    ".dsx .dsx-card{background:#1e1e1e;border-radius:12px;padding:14px;margin:10px 0}",
    ".dsx .dsx-big{font-size:20px;line-height:1.4}",
    ".dsx .dsx-fr{opacity:.65;font-size:14px;margin-top:4px}",
    ".dsx .dsx-row{display:flex;justify-content:space-between;gap:8px;padding:8px 0;border-bottom:1px solid #2a2a2a}",
    ".dsx .dsx-row:last-child{border-bottom:0}",
    ".dsx .dsx-btn{display:block;width:100%;box-sizing:border-box;background:#f5c542;color:#121212;border:0;border-radius:12px;padding:16px;font-size:17px;font-weight:700;margin-top:12px}",
    ".dsx .dsx-btn.sec{background:#2a2a2a;color:#f2f2f2}",
    ".dsx .dsx-ecouter{background:none;border:1px solid #444;color:#f2f2f2;border-radius:8px;padding:4px 10px;font-size:14px}",
    ".dsx .dsx-choix{display:block;width:100%;box-sizing:border-box;text-align:left;background:#2a2a2a;color:#f2f2f2;border:2px solid transparent;border-radius:10px;padding:14px;margin-top:8px;font-size:16px}",
    ".dsx .dsx-choix.sel{border-color:#f5c542}",
    ".dsx .dsx-bar{height:6px;background:#2a2a2a;border-radius:3px;margin-bottom:14px}",
    ".dsx .dsx-bar i{display:block;height:100%;background:#f5c542;border-radius:3px}",
    ".dsx .dsx-ok{color:#4cd964}.dsx .dsx-ko{color:#ff6b6b}",
    ".dsx .dsx-role{font-size:12px;opacity:.6;text-transform:uppercase}"
  ].join("");

  function injecterCSS() {
    if (document.getElementById("dsx-css")) return;
    var s = document.createElement("style");
    s.id = "dsx-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function ecouter(texte, langue) {
    if (typeof window.diisooParler === "function") {
      try { window.diisooParler(texte, langue || "en"); } catch (e) {}
    }
  }

  function boutonEcouter(texte, langue) {
    if (typeof window.diisooParler !== "function") return "";
    return '<button class="dsx-ecouter" data-say="' + esc(texte) + '" data-lang="' + (langue || "en") + '">🔊 Écouter</button>';
  }

  function lierEcoute(racine) {
    var btns = racine.querySelectorAll("[data-say]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        ecouter(this.getAttribute("data-say"), this.getAttribute("data-lang"));
      });
    }
  }

  function menu(conteneur) {
    injecterCSS();
    var liste = window.DiisooSecteurs.liste();
    var h = '<div class="dsx"><h2>Anglais des marchés</h2><div class="dsx-sub">Choisis ton marché</div>';
    liste.forEach(function (m) {
      h += '<button class="dsx-btn sec" data-id="' + esc(m.id) + '">' +
        esc(m.marche) + " : " + esc(m.theme) + (m.fait ? " ✅" : " (+" + m.xp + " XP)") + "</button>";
    });
    h += "</div>";
    conteneur.innerHTML = h;
    var b = conteneur.querySelectorAll("[data-id]");
    for (var i = 0; i < b.length; i++) {
      b[i].addEventListener("click", function () {
        ouvrir(this.getAttribute("data-id"), conteneur);
      });
    }
  }

  function ouvrir(id, conteneur) {
    injecterCSS();
    var m = window.DiisooSecteurs.obtenir(id);
    if (!m) { conteneur.innerHTML = '<div class="dsx">Module introuvable.</div>'; return; }

    var etapes = ["accroche", "vocabulaire", "pont", "dialogue", "pratique", "defi", "quiz"];
    var pos = 0;
    var reponses = [];

    function entete() {
      var pct = Math.round((pos / etapes.length) * 100);
      return '<h2>' + esc(m.marche) + '</h2><div class="dsx-sub">' + esc(m.theme) +
        ' · ' + m.duree_min + ' min</div><div class="dsx-bar"><i style="width:' + pct + '%"></i></div>';
    }

    function suivant(label) {
      return '<button class="dsx-btn" id="dsx-next">' + (label || "Continuer") + "</button>";
    }

    function rendre() {
      var e = etapes[pos];
      var h = '<div class="dsx">' + entete();

      if (e === "accroche") {
        h += '<div class="dsx-card"><div class="dsx-big">' + esc(m.accroche.en) + '</div><div class="dsx-fr">' +
          esc(m.accroche.fr) + "</div>" + boutonEcouter(m.accroche.en, "en") + "</div>" + suivant("C'est parti");
      } else if (e === "vocabulaire") {
        h += '<div class="dsx-card">';
        m.vocabulaire.forEach(function (v) {
          h += '<div class="dsx-row"><span>' + esc(v.en) + "</span><span class='dsx-fr'>" + esc(v.fr) + "</span>" +
            boutonEcouter(v.en, "en") + "</div>";
        });
        h += "</div>" + suivant();
      } else if (e === "pont") {
        h += '<div class="dsx-card">';
        m.pont_wolof.forEach(function (p) {
          h += '<div class="dsx-row"><span>🇸🇳 ' + esc(p.wo) + "</span><span>🇬🇧 " + esc(p.en) + "</span>" +
            boutonEcouter(p.wo, "wo") + "</div>";
        });
        h += "</div>" + suivant();
      } else if (e === "dialogue") {
        h += '<div class="dsx-card">';
        m.dialogue.forEach(function (d) {
          h += '<div class="dsx-row" style="display:block"><div class="dsx-role">' + esc(d.role) + '</div>' +
            esc(d.en) + " " + boutonEcouter(d.en, "en") + "</div>";
        });
        h += "</div>" + suivant();
      } else if (e === "pratique") {
        h += '<div class="dsx-card"><div class="dsx-sub">Répète 3 fois à voix haute</div>';
        m.pratique_micro.forEach(function (p) {
          h += '<div class="dsx-row"><span class="dsx-big">' + esc(p) + "</span>" + boutonEcouter(p, "en") + "</div>";
        });
        h += "</div>" + suivant();
      } else if (e === "defi") {
        h += '<div class="dsx-card"><div class="dsx-sub">Défi victoire</div><div class="dsx-big">' + esc(m.defi.en) +
          '</div><div class="dsx-fr">' + esc(m.defi.fr) + "</div></div>" + suivant("Défi relevé");
      } else if (e === "quiz") {
        h += '<div id="dsx-quiz"></div>';
      }

      h += "</div>";
      conteneur.innerHTML = h;
      lierEcoute(conteneur);

      if (e === "quiz") { quiz(); return; }
      var n = conteneur.querySelector("#dsx-next");
      if (n) n.addEventListener("click", function () { pos++; rendre(); });
    }

    function quiz() {
      var q = 0;
      var zone = conteneur.querySelector("#dsx-quiz");

      function question() {
        var item = m.evaluation[q];
        var h = '<div class="dsx-card"><div class="dsx-sub">Question ' + (q + 1) + "/" + m.evaluation.length +
          '</div><div class="dsx-big">' + esc(item.q) + "</div>";
        item.choix.forEach(function (c) {
          h += '<button class="dsx-choix" data-c="' + esc(c) + '">' + esc(c) + "</button>";
        });
        h += "</div>";
        zone.innerHTML = h;
        var cs = zone.querySelectorAll(".dsx-choix");
        for (var i = 0; i < cs.length; i++) {
          cs[i].addEventListener("click", function () {
            reponses[q] = this.getAttribute("data-c");
            q++;
            if (q < m.evaluation.length) question(); else fin();
          });
        }
      }

      function fin() {
        var r = window.DiisooSecteurs.evaluer(id, reponses);
        var h = '<div class="dsx-card"><div class="dsx-big ' + (r.reussi ? "dsx-ok" : "dsx-ko") + '">' +
          (r.reussi ? "Bravo ! " : "Presque. ") + r.bonnes + "/" + m.evaluation.length + "</div>";
        if (r.xp) h += '<div class="dsx-sub">+' + r.xp + " XP</div>";
        h += '<div class="dsx-fr">' + esc(r.reussi ? m.recap : "Il faut 2 bonnes réponses sur 3. Réessaie.") + "</div></div>";
        h += '<button class="dsx-btn" id="dsx-fin">' + (r.reussi && r.suivant ? "Marché suivant" : "Retour aux marchés") + "</button>";
        if (!r.reussi) h += '<button class="dsx-btn sec" id="dsx-retry">Réessayer</button>';
        zone.innerHTML = h;
        var f = zone.querySelector("#dsx-fin");
        f.addEventListener("click", function () {
          if (r.reussi && r.suivant && window.DiisooSecteurs.obtenir(r.suivant)) ouvrir(r.suivant, conteneur);
          else menu(conteneur);
        });
        var rt = zone.querySelector("#dsx-retry");
        if (rt) rt.addEventListener("click", function () { reponses = []; q = 0; question(); });
      }

      question();
    }

    rendre();
  }

  window.DiisooSecteursUI = { menu: menu, ouvrir: ouvrir };
})();
