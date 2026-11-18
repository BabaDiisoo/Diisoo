/* diisoo-fin1.js : fin de la premiere lecon = UNE seule question.
 * Apres le premier exercice, l'app proposait une fiche de 4 questions (but, rythme, duree, heure).
 * Ici : « Bravo ! On te rappelle demain a quelle heure ? » avec 3 boutons (Matin, Midi, Soir).
 * Le reste utilise la fiche existante (aucune logique de rappel dupliquee). Lien discret pour choisir ses objectifs en detail.
 * Interrupteur : ?fin1=0 remet l'ancienne fiche. Aucun fichier existant modifie. */
(function () {
  "use strict";
  if (window.__fin1) return; window.__fin1 = true;
  try { if (new URLSearchParams(location.search).get("fin1") === "0") return; } catch (e) {}

  var st = document.createElement("style");
  st.textContent =
    "#dii-fin1{position:fixed;inset:0;z-index:9992;background:rgba(5,8,16,.86);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-fin1 .f-box{width:100%;max-width:480px;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px 22px 0 0;padding:20px 16px 24px;color:#F6F1E7;text-align:center}" +
    "#dii-fin1 h3{font-size:20px;font-weight:800;margin:0 0 6px}" +
    "#dii-fin1 p{font-size:14px;color:#C9BFA8;margin:0 0 14px}" +
    "#dii-fin1 .f-g{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}" +
    "#dii-fin1 .f-c{min-height:72px;border-radius:14px;background:#141A2B;border:2px solid #1E2740;color:#F6F1E7;font-size:14px;font-weight:700}" +
    "#dii-fin1 .f-c small{display:block;font-size:12px;font-weight:400;color:#A69C86}" +
    "#dii-fin1 .f-c:active{border-color:#25D366;background:#12351F}" +
    "#dii-fin1 .f-no{width:100%;min-height:44px;margin-top:10px;background:none;border:0;color:#A69C86;font-size:13px}" +
    "#dii-fin1 .f-lien{background:none;border:0;color:#A69C86;font-size:12px;text-decoration:underline;min-height:36px}";
  document.head.appendChild(st);

  function traiter(ov) {
    try {
      var plus = ov.querySelector("#ob-plus");
      if (!plus || plus.textContent.trim() !== "Plus tard") return; /* fiche ouverte volontairement : on ne touche pas */
      if (document.getElementById("dii-fin1")) return;
      ov.style.display = "none";
      var m = document.createElement("div"); m.id = "dii-fin1";
      m.innerHTML =
        '<div class="f-box"><h3>🎉 Bravo, première leçon faite !</h3>' +
        "<p>Reviens demain pour garder ta série. On te rappelle à quelle heure ?</p>" +
        '<div class="f-g">' +
        '<button type="button" class="f-c" data-h="06:30">🌅<small>Matin 6h30</small></button>' +
        '<button type="button" class="f-c" data-h="12:30">☀️<small>Midi 12h30</small></button>' +
        '<button type="button" class="f-c" data-h="20:30">🌙<small>Soir 20h30</small></button></div>' +
        '<button type="button" class="f-no">Plus tard</button>' +
        '<button type="button" class="f-lien">Choisir mes objectifs en détail</button></div>';
      document.body.appendChild(m);
      Array.prototype.forEach.call(m.querySelectorAll(".f-c"), function (b) {
        b.onclick = function () {
          var h = ov.querySelector("#ob-heure");
          if (h) h.value = b.getAttribute("data-h");
          m.remove();
          var v = ov.querySelector("#ob-valider");
          if (v) v.click(); else ov.remove();
        };
      });
      m.querySelector(".f-no").onclick = function () { m.remove(); if (plus) plus.click(); else ov.remove(); };
      m.querySelector(".f-lien").onclick = function () { m.remove(); ov.style.display = ""; };
    } catch (e) { try { ov.style.display = ""; } catch (x) {} }
  }

  function observer() {
    if (!document.body || typeof MutationObserver !== "function") return;
    new MutationObserver(function (list) {
      list.forEach(function (r) {
        Array.prototype.forEach.call(r.addedNodes, function (n) { if (n && n.id === "dii-obj") traiter(n); });
      });
    }).observe(document.body, { childList: true });
  }
  if (document.body) observer(); else document.addEventListener("DOMContentLoaded", observer);
})();
