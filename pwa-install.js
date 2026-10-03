let invite = null;
let bouton = null;

const dejaInstallee = () =>
  window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

function creer(texte, action) {
  if (bouton || dejaInstallee()) return;
  bouton = document.createElement("button");
  bouton.type = "button";
  bouton.textContent = texte;
  bouton.style.cssText = "position:fixed;left:10px;bottom:52px;z-index:30;padding:8px 12px;border-radius:999px;border:0;background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;font:800 11px system-ui,sans-serif";
  bouton.addEventListener("click", action);
  document.body.appendChild(bouton);
}

function retirer() {
  if (bouton) { bouton.remove(); bouton = null; }
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  invite = e;
  console.log("[diisoo-pwa] installation possible");
  creer("📲 Installer Diisoo", async () => {
    if (!invite) return;
    invite.prompt();
    try {
      const r = await invite.userChoice;
      console.log("[diisoo-pwa] choix :", r.outcome);
    } catch (err) { console.error("[diisoo-pwa]", err); }
    invite = null;
    retirer();
  });
});

window.addEventListener("appinstalled", () => {
  console.log("[diisoo-pwa] application installee");
  invite = null;
  retirer();
});

const iOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
if (iOS && !dejaInstallee()) {
  const attendre = () => creer("📲 Installer Diisoo", () => {
    alert("Sur iPhone : touche le bouton Partager, puis « Sur l'écran d'accueil ».");
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", attendre);
  else attendre();
}
