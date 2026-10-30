/* diisoo-reseau.js
 * Bandeau simple quand la connexion est coupée ou très lente. Ne touche à aucune requête.
 * Ajouter "diisoo-reseau.js" à la fin du tableau FICHIERS de diisoo-secteurs-loader.js.
 */
(function () {
  "use strict";
  if (window.__diisooReseau) return;
  window.__diisooReseau = true;

  var barre = null, masque = null;

  function lente() {
    try {
      var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      return !!c && (c.saveData === true || /^(slow-2g|2g)$/.test(c.effectiveType || ""));
    } catch (e) { return false; }
  }

  function afficher(texte, couleur) {
    clearTimeout(masque);
    if (!barre) {
      barre = document.createElement("div");
      barre.setAttribute("role", "status");
      barre.setAttribute("aria-live", "polite");
      barre.style.cssText = "position:fixed;left:0;right:0;top:0;z-index:99998;padding:10px 14px;font:600 14px/1.4 system-ui,sans-serif;text-align:center;color:#0B0F1C;";
      document.body.appendChild(barre);
    }
    barre.style.background = couleur;
    barre.textContent = texte;
    barre.style.display = "block";
  }
  function cacher() { if (barre) barre.style.display = "none"; }

  function etat() {
    if (navigator.onLine === false) {
      afficher("Pas de connexion. Les leçons déjà ouvertes restent disponibles. Les voix demandent internet.", "#F3A94E");
    } else if (lente()) {
      afficher("Connexion lente. Les voix peuvent mettre plus de temps à arriver.", "#F6F1E7");
      masque = setTimeout(cacher, 6000);
    } else {
      afficher("Connexion rétablie.", "#5FC98F");
      masque = setTimeout(cacher, 2500);
    }
  }

  window.addEventListener("offline", etat);
  window.addEventListener("online", etat);
  try {
    var c = navigator.connection;
    if (c && c.addEventListener) c.addEventListener("change", function () { if (navigator.onLine !== false && lente()) etat(); });
  } catch (e) {}
  if (navigator.onLine === false) etat();
  else if (lente()) etat();
})();
