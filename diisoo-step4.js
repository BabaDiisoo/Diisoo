/* Diisoo etape 4 (additif) : vocal style WhatsApp, WebView iOS, guide d'installation, bouton retour.
   Expose : window.DiisooVoice, window.DiisooGuide, window.DiisooBack. */
(function () {
  "use strict";
  var SITE = "https://diisoo.sn";
  var ua = navigator.userAgent || "";
  var iOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var android = /Android/i.test(ua);
  var standalone = function () { return (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true; };
  var buzz = function (p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }

  /* ---------- Styles ---------- */
  var css = ".dii4-ov{position:fixed;inset:0;z-index:2147483000;background:rgba(5,8,16,.8);display:flex;align-items:flex-end;justify-content:center;padding:16px}" +
    ".dii4-box{width:100%;max-width:420px;background:#141A2B;border:1px solid #1E2740;border-radius:20px;padding:20px;color:#F6F1E7;font:14px/1.5 system-ui,sans-serif;max-height:88vh;overflow:auto}" +
    ".dii4-box h3{margin:0 0 6px;font-size:18px}.dii4-box p{margin:0 0 8px;color:#C9BFA8}.dii4-box ol{padding-left:22px;margin:8px 0 12px;color:#E4DCC9;list-style:decimal}.dii4-box li{margin-bottom:6px}" +
    ".dii4-btn{display:block;width:100%;padding:12px;border:0;border-radius:12px;font:700 14px system-ui,sans-serif;margin-top:8px;background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505}" +
    ".dii4-btn.sec{background:#1E2740;color:#F6F1E7}.dii4-link{display:block;margin-top:8px;padding:10px;border-radius:10px;background:#0B0F1C;color:#F3A94E;font:600 13px monospace;text-align:center;word-break:break-all}" +
    ".dii4-voice{display:flex;align-items:center;justify-content:flex-end;gap:10px;touch-action:none;user-select:none;-webkit-user-select:none}" +
    ".dii4-vbar{flex:1;display:flex;align-items:center;gap:10px;background:#1E2740;border-radius:999px;padding:8px 14px;color:#F6F1E7;font:700 13px system-ui,sans-serif;overflow:hidden}" +
    ".dii4-vbar[hidden]{display:none}.dii4-dot{width:9px;height:9px;border-radius:50%;background:#E5484D;animation:dii4-p 1s infinite}" +
    ".dii4-wave{display:flex;align-items:center;gap:3px;height:22px}.dii4-wave i{width:3px;height:6px;border-radius:2px;background:#3FAE74;animation:dii4-w .8s infinite ease-in-out}" +
    ".dii4-wave i:nth-child(2){animation-delay:.1s}.dii4-wave i:nth-child(3){animation-delay:.2s}.dii4-wave i:nth-child(4){animation-delay:.3s}.dii4-wave i:nth-child(5){animation-delay:.4s}" +
    ".dii4-hint{flex:1;color:#A69C86;font-weight:600;text-align:right;white-space:nowrap;transition:transform .05s}.dii4-vbar.cancel{background:#4A1D22}.dii4-vbar.cancel .dii4-hint{color:#FF8B8B}" +
    ".dii4-mic{width:56px;height:56px;border-radius:50%;border:0;background:#25D366;color:#fff;font-size:24px;box-shadow:0 4px 14px rgba(37,211,102,.4);touch-action:none;transition:transform .15s}" +
    ".dii4-voice.rec .dii4-mic{transform:scale(1.25);background:#1FB855}.dii4-live{font:12px system-ui,sans-serif;color:#A69C86;margin-top:6px;min-height:16px}" +
    ".dii4-act{width:44px;height:44px;border-radius:50%;border:0;font-size:18px;background:#1E2740;color:#fff}.dii4-act.ok{background:#25D366}" +
    ".dii4-back{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border:1px solid #1E2740;border-radius:999px;background:#141A2B;color:#C9BFA8;font:700 12px system-ui,sans-serif}" +
    "@keyframes dii4-w{0%,100%{height:6px}50%{height:20px}}@keyframes dii4-p{50%{opacity:.3}}";
  var st = el("style"); st.id = "dii4-style"; st.textContent = css; (document.head || document.documentElement).appendChild(st);

  /* ---------- Modale ---------- */
  function modal(html) {
    var ov = el("div", "dii4-ov"), box = el("div", "dii4-box", html);
    ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true");
    ov.appendChild(box);
    function close() { ov.remove(); document.removeEventListener("keydown", key); }
    function key(e) { if (e.key === "Escape") close(); }
    ov.addEventListener("pointerdown", function (e) { if (e.target === ov) close(); });
    document.addEventListener("keydown", key);
    document.body.appendChild(ov);
    var c = box.querySelector("[data-close]"); if (c) c.onclick = close;
    return { ov: ov, box: box, close: close };
  }
  function copier(texte, fb) {
    function ok() { fb.textContent = "Lien copié ✅"; }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(texte).then(ok, legacy); } else legacy();
    function legacy() {
      var t = el("textarea"); t.value = texte; t.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); ok(); } catch (e) { fb.textContent = "Copie le lien affiché ci-dessus"; } t.remove();
    }
  }

  /* ---------- 1) WebView WhatsApp / réseaux sur iPhone ---------- */
  function enWebViewIOS() { return /iPhone|iPad|iPod/i.test(ua) && !/Safari/i.test(ua) && !standalone(); }
  function modaleSafari() {
    var m = modal('<h3>Ouvrir dans Safari 🧭</h3><p>Pour installer Diisoo et utiliser le micro, ouvre le site dans Safari.</p>' +
      '<ol><li>Touche l\'icône <b>boussole 🧭</b> ou <b>⋯</b> en bas à droite</li><li>Choisis <b>« Ouvrir dans Safari »</b></li></ol>' +
      '<p>Ou copie le lien puis colle-le dans Safari :</p><div class="dii4-link">' + SITE + '</div>' +
      '<button type="button" class="dii4-btn" data-copy>📋 Copier le lien</button><p data-fb style="text-align:center;margin-top:8px"></p>' +
      '<button type="button" class="dii4-btn sec" data-close>Continuer ici</button>');
    m.box.querySelector("[data-copy]").onclick = function () { copier(SITE, m.box.querySelector("[data-fb]")); };
  }

  /* ---------- 2) Guide d'installation universel ---------- */
  var promptInstall = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); promptInstall = e; });
  window.addEventListener("appinstalled", function () { promptInstall = null; });
  function profil() {
    var safari = iOS && /Safari/i.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/i.test(ua);
    var marque = /TECNO/i.test(ua) ? "TECNO" : /Infinix/i.test(ua) ? "Infinix" : /itel/i.test(ua) ? "itel" : /SM-|Samsung/i.test(ua) ? "Samsung" : "";
    if (iOS) return { cle: safari ? "ios" : "ios-autre", titre: "Installer sur iPhone" + (safari ? " (Safari)" : "") };
    if (android && /SamsungBrowser/i.test(ua)) return { cle: "samsung", titre: "Installer (Samsung Internet)" };
    if (android && /Firefox/i.test(ua)) return { cle: "firefox", titre: "Installer (Firefox)" };
    if (android && /OPR|Opera/i.test(ua)) return { cle: "android-autre", titre: "Installer sur Android" };
    if (android) return { cle: "chrome", titre: "Installer sur Android" + (marque ? " (" + marque + ")" : "") };
    return { cle: "bureau", titre: "Installer sur ordinateur" };
  }
  var ETAPES = {
    "ios": ["Touche le bouton <b>Partager ⎋</b> (en bas de l'écran)", "Fais défiler puis touche <b>« Sur l'écran d'accueil » ➕</b>", "Touche <b>« Ajouter »</b> en haut à droite", "Ouvre Diisoo depuis son icône"],
    "ios-autre": ["Ouvre <b>" + SITE + "</b> dans <b>Safari</b> (copie le lien ci-dessous)", "Touche <b>Partager ⎋</b>", "Touche <b>« Sur l'écran d'accueil » ➕</b> puis <b>« Ajouter »</b>"],
    "chrome": ["Touche le menu <b>⋮</b> en haut à droite", "Touche <b>« Installer l'application »</b> (ou <b>« Ajouter à l'écran d'accueil »</b>)", "Confirme avec <b>« Installer »</b>", "Ouvre Diisoo depuis son icône"],
    "samsung": ["Touche le menu <b>☰</b> en bas à droite", "Touche <b>« Ajouter la page à »</b>", "Choisis <b>« Écran d'accueil »</b> puis confirme"],
    "firefox": ["Touche le menu <b>⋮</b>", "Touche <b>« Installer »</b>", "Confirme l'ajout à l'écran d'accueil"],
    "android-autre": ["Copie le lien ci-dessous", "Ouvre-le dans <b>Chrome</b>", "Menu <b>⋮</b> puis <b>« Installer l'application »</b>"],
    "bureau": ["Dans Chrome ou Edge, clique sur l'icône <b>d'installation</b> à droite de la barre d'adresse", "Clique sur <b>« Installer »</b>"]
  };
  function guide() {
    var p = profil(), li = (ETAPES[p.cle] || []).map(function (s) { return "<li>" + s + "</li>"; }).join("");
    var note = /TECNO|Infinix|itel/i.test(ua) ? "<p>Sur TECNO, Infinix et itel, utilise <b>Chrome</b> si tu ne vois pas « Installer ».</p>" : "";
    var m = modal("<h3>" + esc(p.titre) + " 📲</h3><p>Sans Play Store ni App Store. Diisoo reste léger et marche hors ligne.</p><ol>" + li + "</ol>" + note +
      (promptInstall ? '<button type="button" class="dii4-btn" data-install>📲 Installer maintenant</button>' : "") +
      '<div class="dii4-link">' + SITE + '</div><button type="button" class="dii4-btn sec" data-copy>📋 Copier le lien</button><p data-fb style="text-align:center;margin-top:8px"></p>' +
      '<button type="button" class="dii4-btn sec" data-close>Fermer</button>');
    m.box.querySelector("[data-copy]").onclick = function () { copier(SITE, m.box.querySelector("[data-fb]")); };
    var bi = m.box.querySelector("[data-install]");
    if (bi) bi.onclick = function () { try { promptInstall.prompt(); promptInstall.userChoice.then(function () { promptInstall = null; m.close(); }); } catch (e) { m.close(); } };
  }
  window.DiisooGuide = { ouvrir: guide, modaleSafari: modaleSafari };

  /* ---------- 3) Composant vocal style WhatsApp ---------- */
  var Voice = {
    mount: function (box, o) {
      o = o || {};
      var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      var root = el("div"), row = el("div", "dii4-voice"), live = el("div", "dii4-live");
      var bar = el("div", "dii4-vbar"); bar.hidden = true;
      bar.innerHTML = '<span class="dii4-dot"></span><span data-time>00:00</span><span class="dii4-wave"><i></i><i></i><i></i><i></i><i></i></span><span class="dii4-hint" data-hint>‹ Glisser pour annuler 🗑️</span>';
      var del = el("button", "dii4-act", "🗑️"), send = el("button", "dii4-act ok", "➤");
      del.type = send.type = "button"; del.hidden = send.hidden = true;
      var mic = el("button", "dii4-mic", "🎙️"); mic.type = "button"; mic.setAttribute("aria-label", "Maintenir pour parler");
      row.appendChild(bar); row.appendChild(del); row.appendChild(send); row.appendChild(mic);
      root.appendChild(row); root.appendChild(live); box.appendChild(root);
      var state = "idle", rec = null, t0 = 0, tick = null, text = "", cancelled = false, x0 = 0, dx = 0, down = 0, maxMs = o.maxMs || 60000;
      var fmt = function (ms) { var s = Math.floor(ms / 1000); return ("0" + Math.floor(s / 60)).slice(-2) + ":" + ("0" + (s % 60)).slice(-2); };
      function msg(t) { live.textContent = t || ""; }
      function reset() { clearInterval(tick); state = "idle"; bar.hidden = true; bar.classList.remove("cancel"); row.classList.remove("rec"); del.hidden = send.hidden = true; mic.hidden = false; dx = 0; bar.querySelector("[data-hint]").style.transform = ""; }
      function start() {
        if (!SR) { msg("Micro non supporté ici. Utilise Chrome ou Safari."); return false; }
        text = ""; cancelled = false; msg("");
        rec = new SR(); rec.lang = o.lang || "en-US"; rec.interimResults = true; rec.continuous = true;
        rec.onresult = function (e) { var t = ""; for (var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript + " "; text = t.trim(); msg(text); };
        rec.onerror = function (e) { if (e.error === "not-allowed" || e.error === "service-not-allowed") { cancelled = true; msg("Micro bloqué. Autorise le micro dans le navigateur."); o.onError && o.onError("micro-bloque"); } };
        rec.onend = function () {
          var ms = Date.now() - t0, c = cancelled, tx = text; rec = null; reset();
          if (c) return;
          if (tx) { buzz(15); o.onResult && o.onResult(tx, ms); } else { msg("Rien entendu. Réessaie."); o.onError && o.onError("silence"); }
        };
        try { rec.start(); } catch (e) { return false; }
        t0 = Date.now(); bar.hidden = false; row.classList.add("rec"); buzz(30);
        tick = setInterval(function () { var ms = Date.now() - t0; bar.querySelector("[data-time]").textContent = fmt(ms); if (ms >= maxMs) stop(false); }, 250);
        return true;
      }
      function stop(cancel) {
        if (!rec) { reset(); return; }
        cancelled = !!cancel;
        if (cancel) { buzz([20, 40, 20]); msg("Annulé"); o.onCancel && o.onCancel(); try { rec.abort(); } catch (e) {} } else { try { rec.stop(); } catch (e) {} }
      }
      mic.addEventListener("contextmenu", function (e) { e.preventDefault(); });
      mic.addEventListener("pointerdown", function (e) {
        if (state !== "idle") return; e.preventDefault();
        try { mic.setPointerCapture(e.pointerId); } catch (x) {}
        x0 = e.clientX; down = Date.now(); if (start()) state = "hold";
      });
      mic.addEventListener("pointermove", function (e) {
        if (state !== "hold") return; dx = e.clientX - x0;
        bar.querySelector("[data-hint]").style.transform = "translateX(" + Math.min(0, dx) + "px)";
        bar.classList.toggle("cancel", dx < -80);
      });
      mic.addEventListener("pointerup", function () {
        if (state !== "hold") return;
        if (dx < -80) { stop(true); return; }
        if (Date.now() - down < 300) { state = "locked"; mic.hidden = true; del.hidden = send.hidden = false; bar.querySelector("[data-hint]").textContent = "Enregistrement..."; return; }
        stop(false);
      });
      mic.addEventListener("pointercancel", function () { if (state === "hold") stop(true); });
      del.onclick = function () { stop(true); }; send.onclick = function () { stop(false); };
      return { destroy: function () { stop(true); root.remove(); } };
    }
  };
  window.DiisooVoice = Voice;

  /* ---------- 4) Bouton retour intelligent ---------- */
  function retour() {
    var interne = false;
    try { interne = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
    if (history.length > 1 && (interne || history.state)) history.back(); else location.href = "/";
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".btn-back,[data-btn-back]");
    if (b) { e.preventDefault(); retour(); }
  });
  window.DiisooBack = { retour: retour, creer: function (box) { var b = el("button", "btn-back dii4-back", "← Retour"); b.type = "button"; b.setAttribute("aria-label", "Retour"); box.appendChild(b); return b; } };

  /* ---------- Démarrage ---------- */
  function init() {
    if (enWebViewIOS()) { try { if (!sessionStorage.getItem("dii4_safari")) { sessionStorage.setItem("dii4_safari", "1"); modaleSafari(); } } catch (e) { modaleSafari(); } return; }
    if (standalone() || !(iOS || android)) return;
    setTimeout(function () {
      var deja = [].some.call(document.querySelectorAll("button"), function (b) { return /Installer Diisoo/.test(b.textContent); });
      if (deja) return;
      var b = el("button", "", "📲 Installer Diisoo"); b.type = "button";
      b.style.cssText = "position:fixed;left:10px;bottom:calc(14px + env(safe-area-inset-bottom));z-index:30;padding:8px 12px;border-radius:999px;border:0;background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;font:800 11px system-ui,sans-serif";
      b.onclick = guide; document.body.appendChild(b);
    }, 3500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
