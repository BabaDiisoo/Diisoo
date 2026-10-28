/* diisoo-accueil.js
 * Accueil (tableau de bord) :
 * 1) la carte "Ajoute ton WhatsApp" passe sous les 4 menus (l'action principale reste en haut) ;
 * 2) le champ du numero ne depasse plus de sa carte.
 * Ne modifie aucun fichier existant : deplace seulement un element deja present et ajoute une regle CSS.
 */
(function () {
  "use strict";
  function css() {
    if (document.getElementById("diisoo-accueil-css")) return;
    var s = document.createElement("style");
    s.id = "diisoo-accueil-css";
    s.textContent =
      "#wa-capture,#wa-capture *{box-sizing:border-box}" +
      "#wa-capture{max-width:100%;overflow:hidden}" +
      "#wa-capture input[type=tel]{min-width:0;width:100%}" +
      "#wa-capture>.flex{max-width:100%}" +
      "#wa-capture>.flex>input{flex:1 1 0%}";
    document.head.appendChild(s);
  }
  function deplacer() {
    var wa = document.getElementById("wa-capture");
    var rev = document.getElementById("revision-card");
    if (!wa || !rev || wa.dataset.accueil) return !!wa;
    var zone = rev.parentNode;                       /* le bloc "space-y-3" qui contient revision + 4 menus */
    var grille = zone && zone.querySelector(".grid.grid-cols-2");
    if (!grille) return false;
    wa.dataset.accueil = "1";
    grille.parentNode.insertBefore(wa, grille.nextSibling);
    return true;
  }
  function demarrer() {
    css();
    if (deplacer()) return;
    var n = 0, t = setInterval(function () { if (deplacer() || ++n > 40) clearInterval(t); }, 250);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();
