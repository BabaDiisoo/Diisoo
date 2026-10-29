/* diisoo-partage.js
 * Partager sa serie : toucher la pastille "🔥 N jours" ouvre WhatsApp avec un message pret
 * (avec le lien de parrainage de l'apprenant). Aucune place prise en plus sur l'ecran.
 * Fichier autonome : ne modifie aucun fichier existant.
 */
(function () {
  "use strict";
  var ID = "streak-counter";

  function code() {
    try { if (typeof monCodeRef === "function") return monCodeRef(); } catch (e) {}
    try { var c = JSON.parse(localStorage.getItem("diisoo_ref_code")); if (typeof c === "string") return c; } catch (e) {}
    return "";
  }

  function message(n) {
    var lien = "https://diisoo.sn/" + (code() ? "?ref=" + code() : "");
    var debut = n > 1
      ? "\uD83D\uDD25 J'ai " + n + " jours d'affil\u00E9e sur Diisoo, l'application pour apprendre l'anglais et le wolof avec la voix. "
      : "Je t'invite sur Diisoo, l'application pour apprendre l'anglais et le wolof avec la voix. ";
    return debut + "Essaie-la ici : " + lien;
  }

  function partager() {
    var el = document.getElementById(ID);
    var m = el && /(\d+)/.exec(el.textContent || "");
    var n = m ? parseInt(m[1], 10) : 0;
    window.open("https://wa.me/?text=" + encodeURIComponent(message(n)), "_blank", "noopener");
    try { if (typeof majCompteurParrainage === "function") setTimeout(majCompteurParrainage, 1500); } catch (e) {}
  }

  function installer() {
    var el = document.getElementById(ID);
    if (!el) return false;
    if (el.dataset.partage) return true;
    el.dataset.partage = "1";
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("title", "Partager ma s\u00E9rie sur WhatsApp");
    el.style.cursor = "pointer";
    el.addEventListener("click", partager);
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); partager(); } });
    if (!document.getElementById("diisoo-partage-css")) {
      var s = document.createElement("style");
      s.id = "diisoo-partage-css";
      s.textContent = "#" + ID + "{white-space:nowrap;flex:none}#" + ID + "::after{content:\"\\1F4E4\";font-size:11px;margin-left:3px}";
      document.head.appendChild(s);
    }
    return true;
  }

  function demarrer() {
    if (installer()) return;
    var n = 0, t = setInterval(function () { if (installer() || ++n > 40) clearInterval(t); }, 250);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();
