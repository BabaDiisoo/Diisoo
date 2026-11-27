/* diisoo-installer.js v1 : installer Diisoo comme une vraie application, en un geste
   - Carte claire "Mets Diisoo sur ton telephone" (apres un premier exercice, une fois par semaine au maximum)
   - Android / Chrome / Samsung Internet : un seul bouton, la fenetre d'installation du telephone s'ouvre
   - iPhone / Safari : 3 etapes illustrees (Partager, Sur l'ecran d'accueil, Ajouter)
   - Jamais affichee si l'app est deja installee */
(function () {
  "use strict";
  var CLE = "diisoo_install_plus";
  function dejaInstallee() { return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true; }
  var iOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  var promptEvt = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); promptEvt = e; });
  window.addEventListener("appinstalled", function () { promptEvt = null; fermer(); try { localStorage.setItem(CLE, "9999999999999"); } catch (x) {} });

  var st = document.createElement("style");
  st.textContent =
    "#dii-inst{position:fixed;inset:0;z-index:9991;background:rgba(5,8,16,.86);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-inst .in-box{width:100%;max-width:480px;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px 22px 0 0;padding:20px 16px 26px;color:#F6F1E7;text-align:center}" +
    "#dii-inst .in-ic{width:72px;height:72px;border-radius:18px;margin:0 auto 8px;display:block}" +
    "#dii-inst h3{font-size:19px;font-weight:800;margin:0 0 4px}" +
    "#dii-inst p{font-size:13px;color:#A69C86;margin:0 0 12px}" +
    "#dii-inst .in-liste{text-align:left;margin:8px 0 14px}" +
    "#dii-inst .in-l{display:flex;align-items:center;gap:12px;background:#141A2B;border:1px solid #1E2740;border-radius:14px;padding:10px 12px;margin-bottom:8px;font-size:14px;font-weight:700}" +
    "#dii-inst .in-l b{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#25D366;color:#fff;flex:0 0 auto}" +
    "#dii-inst .in-l span{font-size:22px;margin-left:auto}" +
    "#dii-inst .in-ok{width:100%;min-height:56px;border-radius:999px;border:0;background:#25D366;color:#fff;font-size:16px;font-weight:800}" +
    "#dii-inst .in-no{width:100%;min-height:44px;margin-top:6px;background:none;border:0;color:#A69C86;font-size:13px}";
  document.head.appendChild(st);

  function fermer() { var e = document.getElementById("dii-inst"); if (e) e.remove(); }
  function repousser(jours) { try { localStorage.setItem(CLE, String(Date.now() + jours * 86400000)); } catch (e) {} }

  function ouvrir() {
    if (document.getElementById("dii-inst") || dejaInstallee()) return;
    var ov = document.createElement("div"); ov.id = "dii-inst";
    var h = '<div class="in-box"><img class="in-ic" src="icon-192.png" alt="Diisoo"><h3>📲 Mets Diisoo sur ton téléphone</h3>';
    if (iOS) {
      h += '<p>Comme une vraie application, sans magasin d\'applications. 3 gestes :</p><div class="in-liste">' +
        '<div class="in-l"><b>1</b>Touche « Partager » en bas de Safari<span>⬆️</span></div>' +
        '<div class="in-l"><b>2</b>Choisis « Sur l\'écran d\'accueil »<span>➕</span></div>' +
        '<div class="in-l"><b>3</b>Touche « Ajouter »<span>✅</span></div></div>' +
        '<button type="button" class="in-ok" id="in-fait">J\'ai compris</button>';
    } else if (promptEvt) {
      h += '<p>Ouvre Diisoo en un geste, même sans connexion, sans chercher dans Google.</p>' +
        '<button type="button" class="in-ok" id="in-go">📲 Installer Diisoo</button>';
    } else {
      h += '<p>Comme une vraie application. 2 gestes :</p><div class="in-liste">' +
        '<div class="in-l"><b>1</b>Touche le menu du navigateur<span>⋮</span></div>' +
        '<div class="in-l"><b>2</b>Choisis « Installer l\'application » ou « Ajouter à l\'écran d\'accueil »<span>✅</span></div></div>' +
        '<button type="button" class="in-ok" id="in-fait">J\'ai compris</button>';
    }
    h += '<button type="button" class="in-no" id="in-plus">Plus tard</button></div>';
    ov.innerHTML = h; document.body.appendChild(ov);
    var go = document.getElementById("in-go");
    if (go) go.onclick = function () {
      var e = promptEvt; if (!e) { fermer(); return; }
      try { e.prompt(); e.userChoice.then(function (r) { if (r && r.outcome !== "accepted") repousser(7); }); } catch (x) {}
      promptEvt = null; fermer();
    };
    var fait = document.getElementById("in-fait"); if (fait) fait.onclick = function () { repousser(30); fermer(); };
    document.getElementById("in-plus").onclick = function () { repousser(7); fermer(); };
  }

  function pret() {
    if (dejaInstallee()) return false;
    var t = 0; try { t = +localStorage.getItem(CLE) || 0; } catch (e) {}
    if (Date.now() < t) return false;
    var d = document.getElementById("screen-dashboard");
    if (!d || d.offsetParent === null) return false;
    if (document.getElementById("dii-obj") || document.getElementById("dii-passage")) return false;
    var g = null; try { g = JSON.parse(localStorage.getItem("diisoo_goal") || "null"); } catch (e) {}
    return !!(g && g.done >= 1) && !!localStorage.getItem("diisoo_obj");
  }
  /* Apres le premier exercice ET l'objectif fixe : c'est le bon moment */
  setInterval(function () { if (pret()) ouvrir(); }, 5000);

  window.DiisooInstaller = { version: 1, ouvrir: ouvrir };
})();

/* ---- v2 : bandeau « ouvre dans ton navigateur » pour TikTok / Instagram / Facebook (stockage, son et micro limités dans ces fenêtres) ---- */
(function () {
  "use strict";
  var UA = navigator.userAgent || "", RX = /musical_ly|TikTok|Bytedance|Instagram|FBAN|FBAV|Snapchat|GSA\//i;
  if (!RX.test(UA) || window.__diisooInapp) return; window.__diisooInapp = true;
  try { if (new URLSearchParams(location.search).get("inapp") === "0") return; } catch (e) {}
  var IOS = /iPhone|iPad|iPod/.test(UA), NOM = /TikTok|musical_ly|Bytedance/i.test(UA) ? "TikTok" : /Instagram/i.test(UA) ? "Instagram" : /FBAN|FBAV/.test(UA) ? "Facebook" : /GSA\//.test(UA) ? "Google" : "Snapchat";
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function note(n) { try { window.DiisooSuivi && DiisooSuivi.noter && DiisooSuivi.noter("action", n, NOM + (IOS ? " iOS" : " Android")); } catch (e) {} }
  function occupe() { return !!document.querySelector("#dsn:not(.hidden), #dcv:not(.hidden), #dii-fmt, #dar, #dsr, #dii-obj, #dii-defi, .dii4-ov, [role='dialog'], [aria-modal='true']"); }
  function montrer() {
    if (document.getElementById("dii-inapp") || occupe()) return false;
    var d = document.createElement("div"); d.id = "dii-inapp";
    d.style.cssText = "position:fixed;left:10px;right:10px;bottom:12px;z-index:9000;max-width:520px;margin:0 auto;background:#141A2B;border:1px solid #F3A94E;border-radius:18px;padding:14px;color:#F6F1E7;box-shadow:0 8px 30px rgba(0,0,0,.55);font-family:inherit";
    d.innerHTML = '<div style="font-weight:800;font-size:15px">📲 Garde ta progression et le son</div>' +
      '<div style="font-size:13px;color:#C9BFA8;margin:6px 0 10px;line-height:1.4">Dans ' + NOM + ', l\'app peut oublier ta progression et couper le son. Touche <b>⋯</b> ou <b>↗</b>, puis <b>' + (IOS ? "« Ouvrir dans Safari »" : "« Ouvrir dans le navigateur »") + '</b>.</div>' +
      '<div style="display:flex;gap:8px"><button type="button" id="dii-inapp-c" style="flex:1;min-height:46px;border:0;border-radius:14px;background:linear-gradient(135deg,#F3A94E,#E1693F);color:#1a0f00;font-weight:800;font-size:14px">📋 Copier le lien</button>' +
      '<button type="button" id="dii-inapp-x" style="min-height:46px;padding:0 16px;border-radius:14px;background:#0B0F1C;border:1px solid #1E2740;color:#C9BFA8;font-size:13px">Plus tard</button></div>';
    document.body.appendChild(d); note("inapp_vu");
    document.getElementById("dii-inapp-x").onclick = function () { d.remove(); note("inapp_plus_tard"); };
    document.getElementById("dii-inapp-c").onclick = function () {
      var b = this, u = "https://diisoo.sn/", ok = function () { b.textContent = "✅ Copié : colle-le dans Safari"; note("inapp_copie"); setTimeout(function () { d.remove(); }, 2600); };
      try { navigator.clipboard.writeText(u).then(ok, function () { throw 0; }); } catch (e) {
        try { var t = document.createElement("textarea"); t.value = u; t.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); ok(); } catch (e2) { b.textContent = u; }
      }
    };
    return true;
  }
  /* une fois par jour au plus, jamais pendant un exercice, après 12 s de présence */
  setTimeout(function () {
    var j = new Date().toISOString().slice(0, 10), n = 0;
    if (lire("diisoo_inapp_j") === j) return;
    var t = setInterval(function () { n++; if (n > 40) { clearInterval(t); return; } if (montrer()) { clearInterval(t); ecrire("diisoo_inapp_j", j); } }, 3000);
  }, 12000);
})();
