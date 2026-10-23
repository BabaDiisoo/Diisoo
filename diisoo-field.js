/* Diisoo : correctifs terrain mobile (P1 Tache 3)
 * 1. Defilement fluide : retire le verrou touch-action sur les boutons micro,
 *    isole le defilement des fenetres, hauteurs dynamiques (barre d'adresse mobile).
 * 2. Micro : enveloppe getUserMedia (aucun flux supplementaire ouvert) pour
 *    afficher un indicateur de niveau en direct et un guide clair si l'acces est refuse.
 * Additif : n'altere aucune fonction existante. */
(function () {
  "use strict";
  if (window.DiisooField) return;

  /* ---------- 1. CSS de fluidite ---------- */
  var css =
    "html{-webkit-text-size-adjust:100%;scroll-behavior:auto}" +
    "body{overscroll-behavior-y:none}" +
    /* un doigt pose sur le bouton micro peut maintenant faire defiler la page (le defilement annule l'enregistrement via pointercancel) */
    "[data-practice]{touch-action:pan-y!important}" +
    "button,[role=button],a,label,select{touch-action:manipulation}" +
    ".overflow-y-auto,.overflow-x-auto{-webkit-overflow-scrolling:touch}" +
    ".fixed.inset-0{overscroll-behavior:contain;-webkit-overflow-scrolling:touch}" +
    "@supports (height:1dvh){" +
    ".min-h-screen{min-height:100dvh}" +
    ".min-h-\\[85vh\\]{min-height:85dvh}" +
    ".max-h-\\[35vh\\]{max-height:35dvh}" +
    ".max-h-\\[55vh\\]{max-height:55dvh}" +
    ".max-h-\\[60vh\\]{max-height:60dvh}" +
    ".max-h-\\[90vh\\]{max-height:90dvh}}" +
    "#df-mic{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 8px);transform:translateX(-50%);z-index:10000;display:none;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;background:rgba(11,15,28,.92);border:1px solid #25D366;color:#F6F1E7;font:600 12px/1.2 system-ui,sans-serif;pointer-events:none;max-width:92vw}" +
    "#df-mic.on{display:flex}" +
    "#df-mic .df-bars{display:flex;align-items:center;gap:3px;height:20px}" +
    "#df-mic .df-bars i{display:block;width:4px;height:3px;border-radius:2px;background:#25D366;transition:height .08s linear}" +
    "#df-mic.quiet{border-color:#F3A94E}" +
    "#df-mic.quiet .df-bars i{background:#F3A94E}" +
    "#df-help{position:fixed;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 12px);z-index:10001;display:none;padding:14px 14px 12px;border-radius:16px;background:#141A2B;border:2px solid #E1693F;color:#F6F1E7;font:14px/1.45 system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.5);max-width:520px;margin:0 auto}" +
    "#df-help.on{display:block}" +
    "#df-help b{display:block;margin-bottom:4px;font-size:15px}" +
    "#df-help .df-act{display:flex;gap:8px;margin-top:10px}" +
    "#df-help button{flex:1;padding:10px;border-radius:12px;border:0;font:700 13px system-ui,sans-serif;color:#0B0F1C;background:#3FAE74}" +
    "#df-help button.df-sec{background:#1E2740;color:#C9BFA8}";
  var st = document.createElement("style");
  st.id = "diisoo-field-css";
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  /* ---------- 2. Micro ---------- */
  var md = navigator.mediaDevices;
  var UA = navigator.userAgent || "";
  var IOS = /iPhone|iPad|iPod/.test(UA);
  var WEBVIEW = /FBAN|FBAV|Instagram|TikTok|musical_ly|WhatsApp|Line\/|; wv\)|Snapchat|Twitter/i.test(UA);
  var meterEl = null, helpEl = null, lastHelp = 0, active = 0;

  function el(tag, id, html) {
    var e = document.createElement(tag);
    if (id) e.id = id;
    if (html) e.innerHTML = html;
    document.body.appendChild(e);
    return e;
  }

  function ensureMeter() {
    if (meterEl && document.body.contains(meterEl)) return meterEl;
    meterEl = el("div", "df-mic",
      '<span aria-hidden="true">🎤</span><span class="df-bars"><i></i><i></i><i></i><i></i><i></i></span><span class="df-txt">Micro actif</span>');
    meterEl.setAttribute("role", "status");
    meterEl.setAttribute("aria-live", "polite");
    return meterEl;
  }

  function steps() {
    if (WEBVIEW) return "Vous êtes dans une application (WhatsApp, Facebook, TikTok...). Touchez les trois points puis « Ouvrir dans Chrome » (ou Safari), et autorisez le micro.";
    if (IOS) return "iPhone : Réglages, Safari, Micro, choisissez « Autoriser ». Puis revenez sur Diisoo et réessayez.";
    return "Android : touchez le cadenas à côté de l'adresse, puis Autorisations, Micro, « Autoriser ». Puis réessayez.";
  }

  function hideHelp() { if (helpEl) helpEl.classList.remove("on"); }

  function showHelp(title, body, canRetry) {
    var now = Date.now();
    if (now - lastHelp < 8000 && helpEl && helpEl.classList.contains("on")) return;
    lastHelp = now;
    if (!helpEl || !document.body.contains(helpEl)) {
      helpEl = el("div", "df-help");
      helpEl.setAttribute("role", "alert");
    }
    helpEl.innerHTML = "<b></b><span class='df-body'></span><div class='df-act'></div>";
    helpEl.querySelector("b").textContent = title;
    helpEl.querySelector(".df-body").textContent = body;
    var act = helpEl.querySelector(".df-act");
    if (canRetry) {
      var r = document.createElement("button");
      r.type = "button"; r.textContent = "Réessayer";
      r.onclick = function () { hideHelp(); retry(); };
      act.appendChild(r);
    }
    var c = document.createElement("button");
    c.type = "button"; c.className = "df-sec"; c.textContent = "Fermer";
    c.onclick = hideHelp;
    act.appendChild(c);
    helpEl.classList.add("on");
  }

  function explain(err) {
    var n = (err && err.name) || "";
    if (/NotAllowed|PermissionDenied|Security/.test(n))
      showHelp("Micro bloqué", steps(), true);
    else if (/NotFound|DevicesNotFound/.test(n))
      showHelp("Aucun micro détecté", "Aucun micro n'a été trouvé sur cet appareil. Branchez un micro ou essayez un autre téléphone.", false);
    else if (/NotReadable|TrackStart|Abort/.test(n))
      showHelp("Micro occupé", "Une autre application utilise le micro. Fermez-la (appel, enregistreur vocal), puis réessayez.", true);
    else if (!md || !window.isSecureContext)
      showHelp("Micro indisponible", "Ouvrez Diisoo avec Chrome ou Safari, à l'adresse https://diisoo.sn.", false);
  }

  function attachMeter(stream) {
    var AC = window.AudioContext || window.webkitAudioContext;
    var tracks = stream.getAudioTracks ? stream.getAudioTracks() : [];
    if (!AC || !tracks.length) return;
    var ctx, src, an;
    try {
      ctx = new AC();
      if (ctx.state === "suspended" && ctx.resume) ctx.resume().catch(function () {});
      an = ctx.createAnalyser();
      an.fftSize = 256;
      an.smoothingTimeConstant = 0.6;
      src = ctx.createMediaStreamSource(stream);
      src.connect(an); /* jamais connecte a destination : aucun retour sonore */
    } catch (e) { try { ctx && ctx.close(); } catch (e2) {} return; }

    var box = ensureMeter();
    var bars = box.querySelectorAll(".df-bars i");
    var txt = box.querySelector(".df-txt");
    var freq = new Uint8Array(an.frequencyBinCount);
    var t0 = Date.now(), peak = 0, stopped = false;
    active++;
    box.classList.add("on");
    box.classList.remove("quiet");
    txt.textContent = "Micro actif";
    hideHelp();

    function done() {
      if (stopped) return;
      stopped = true;
      active = Math.max(0, active - 1);
      try { src.disconnect(); } catch (e) {}
      try { ctx.close(); } catch (e) {}
      if (!active) box.classList.remove("on");
    }
    function live() {
      return tracks.some(function (t) { return t.readyState === "live"; });
    }
    (function tick() {
      if (stopped) return;
      if (!live()) { done(); return; }
      an.getByteFrequencyData(freq);
      var per = Math.floor(freq.length / 2 / bars.length) || 1, total = 0;
      for (var b = 0; b < bars.length; b++) {
        var s = 0;
        for (var k = 0; k < per; k++) s += freq[b * per + k + 2] || 0;
        var v = s / per / 255;
        total += v;
        bars[b].style.height = Math.max(3, Math.min(20, Math.round(v * 40))) + "px";
      }
      var lvl = total / bars.length;
      if (lvl > peak) peak = lvl;
      if (Date.now() - t0 > 3000 && peak < 0.03) {
        box.classList.add("quiet");
        txt.textContent = "Je n'entends rien : parlez plus fort";
      } else if (peak >= 0.03) {
        box.classList.remove("quiet");
        txt.textContent = "Micro actif";
      }
      setTimeout(tick, 70);
    })();
    tracks.forEach(function (t) { t.addEventListener("ended", function () { if (!live()) done(); }); });
  }

  function retry() {
    if (!md || !md.getUserMedia) return explain(null);
    md.getUserMedia({ audio: true }).then(function (s) {
      setTimeout(function () { s.getTracks().forEach(function (t) { t.stop(); }); }, 3000);
    }, function () {});
  }

  if (md && typeof md.getUserMedia === "function" && !md.__diisooWrapped) {
    var orig = md.getUserMedia.bind(md);
    var wrapped = function (constraints) {
      var wantsAudio = !!(constraints && constraints.audio);
      var p;
      try { p = orig(constraints); } catch (e) { if (wantsAudio) explain(e); throw e; }
      if (!wantsAudio) return p;
      p.then(function (stream) { try { attachMeter(stream); } catch (e) {} },
             function (err) { try { explain(err); } catch (e) {} });
      return p;
    };
    try { md.getUserMedia = wrapped; md.__diisooWrapped = true; } catch (e) {}
  }

  /* Cache le guide des que l'utilisateur autorise le micro dans les reglages */
  try {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "microphone" }).then(function (ps) {
        ps.addEventListener("change", function () { if (ps.state === "granted") hideHelp(); });
      }, function () {});
    }
  } catch (e) {}

  window.DiisooField = {
    explain: explain,
    check: function () {
      if (!md || !md.getUserMedia || !window.isSecureContext) { explain(null); return Promise.resolve("unavailable"); }
      if (!navigator.permissions || !navigator.permissions.query) return Promise.resolve("unknown");
      return navigator.permissions.query({ name: "microphone" }).then(function (ps) {
        if (ps.state === "denied") explain({ name: "NotAllowedError" });
        return ps.state;
      }, function () { return "unknown"; });
    }
  };
})();

/* ---------- 3. Bouton « Revenir » universel + bouton Retour du telephone (correctif n°3) ----------
 * Additif : n'enleve aucun bouton existant, n'altere aucune fonction. Un seul bouton fixe en haut a gauche
 * sur tous les ecrans sauf l'accueil et l'inscription, et le bouton Retour d'Android/iPhone ramene a l'ecran
 * precedent au lieu de quitter l'application. */
(function () {
  "use strict";
  if (window.DiisooNav) return;
  var HOME = "screen-dashboard";
  var NO_BACK = { "screen-dashboard": 1, "screen-onboarding": 1 };
  var btn = null, pushed = false, ignorePop = false, planned = false;

  var css =
    "#dnav-back{position:fixed;top:calc(env(safe-area-inset-top,0px) + 12px);left:12px;z-index:999;display:none;align-items:center;gap:6px;min-height:40px;padding:9px 14px;border-radius:999px;border:1px solid #1E2740;background:rgba(20,26,43,.96);color:#F6F1E7;font:700 13px/1 system-ui,sans-serif;touch-action:manipulation;box-shadow:0 2px 10px rgba(0,0,0,.35)}" +
    "#dnav-back.on{display:inline-flex}" +
    "body.dnav-on{padding-top:56px}" +
    /* Micro actif : petite pastille a droite, dans la bande du haut (a cote du bouton Revenir), sans couvrir le contenu */
    "body.dnav-on #df-mic{top:calc(env(safe-area-inset-top,0px) + 12px);left:auto;right:12px;transform:none;max-width:calc(100vw - 150px);padding:6px 10px}" +
    "body.dnav-on #df-mic:not(.quiet) .df-txt{display:none}";
  var st = document.createElement("style");
  st.id = "diisoo-nav-css";
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  function etat() {
    var els = document.querySelectorAll('[id^="screen-"]'), cur = null, overlay = false;
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      if (e.classList.contains("hidden")) continue;
      if (e.classList.contains("fixed")) overlay = true;
      else if (!cur) cur = e.id;
    }
    return { cur: cur, overlay: overlay };
  }

  function retour(depuisSysteme) {
    var s = etat().cur;
    if (!s || NO_BACK[s]) return false;
    if (s === "screen-business") {
      var d = document.getElementById("btn-business-back");
      if (d && !d.classList.contains("hidden") && typeof window.closeBusinessDetail === "function") { window.closeBusinessDetail(); return true; }
    }
    var dest = (s === "screen-listening" || s === "screen-pairs") ? "screen-test-simulation" : HOME;
    if (depuisSysteme && s === "screen-test-simulation") {
      var ok = true;
      try { ok = window.confirm("Quitter le test en cours ?"); } catch (e) {}
      if (!ok) { try { history.pushState({ dnav: 1 }, ""); pushed = true; } catch (e2) {} return true; }
    }
    if (typeof window.changeScreen === "function") window.changeScreen(dest);
    return true;
  }

  function maj() {
    planned = false;
    if (!btn) return;
    var e = etat();
    var away = !!e.cur && !NO_BACK[e.cur];
    var show = away && !e.overlay;
    btn.classList.toggle("on", show);
    if (document.body) document.body.classList.toggle("dnav-on", show);
    if (away && !pushed) {
      try { history.pushState({ dnav: 1 }, ""); pushed = true; } catch (x) {}
    } else if (!away && pushed) {
      pushed = false;
      ignorePop = true;
      try { history.back(); } catch (x2) { ignorePop = false; }
    }
  }
  function planifier() {
    if (planned) return;
    planned = true;
    (window.requestAnimationFrame || setTimeout)(maj);
  }

  function init() {
    if (btn || !document.body) return;
    btn = document.createElement("button");
    btn.id = "dnav-back";
    btn.type = "button";
    btn.setAttribute("aria-label", "Revenir");
    btn.textContent = "⬅️ Revenir";
    btn.addEventListener("click", function () { retour(false); });
    document.body.appendChild(btn);
    try {
      new MutationObserver(planifier).observe(document.body, { attributes: true, attributeFilter: ["class"], subtree: true });
    } catch (e) {}
    window.addEventListener("popstate", function () {
      if (ignorePop) { ignorePop = false; return; }
      if (!pushed) return;
      pushed = false;
      retour(true);
      planifier();
    });
    maj();
  }

  window.DiisooNav = { retour: function () { return retour(false); }, majour: maj };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

/* ---------- 4. Badge « Micro » dans la barre d'etat du tableau de bord (correctif n°5) ----------
 * Additif. Vert « Micro actif » quand le micro est autorise, « Autoriser » quand il reste a autoriser
 * (un toucher demande l'acces), « Micro bloque » quand il est refuse (un toucher affiche le guide).
 * Invisible si le navigateur ne permet pas de connaitre l'etat du micro. */
(function () {
  "use strict";
  if (window.DiisooMicBadge) return;
  var chip = null, perm = null;

  var st = document.createElement("style");
  st.id = "diisoo-micbadge-css";
  st.textContent =
    "#dmic-chip{display:none;align-items:center;gap:4px;min-height:32px;padding:6px 12px;border-radius:999px;border:1px solid #1E2740;background:rgba(20,26,43,.6);color:#A69C86;font:700 11px/1 system-ui,sans-serif;touch-action:manipulation;white-space:nowrap}" +
    "#dmic-chip.show{display:inline-flex}" +
    "#dmic-chip.granted{color:#3DFFA0;border-color:#25D366;background:rgba(37,211,102,.1);box-shadow:0 0 8px rgba(37,211,102,.45)}" +
    "#dmic-chip.prompt{color:#F3A94E;border-color:#F3A94E}" +
    "#dmic-chip.denied{color:#E1693F;border-color:#E1693F}";
  (document.head || document.documentElement).appendChild(st);

  function ensure() {
    var s = document.getElementById("streak-counter");
    if (!s || !s.parentNode) return null;
    var c = document.getElementById("dmic-chip");
    if (!c) {
      c = document.createElement("button");
      c.id = "dmic-chip";
      c.type = "button";
      s.parentNode.insertBefore(c, s.nextSibling);
      c.addEventListener("click", onClick);
    }
    return c;
  }

  function render() {
    chip = ensure();
    if (!chip) return;
    var state = perm ? perm.state : null;
    chip.className = state ? "show " + state : "";
    if (state === "granted") { chip.textContent = "🎤 Micro actif"; chip.setAttribute("aria-label", "Micro autorisé"); }
    else if (state === "prompt") { chip.textContent = "🎤 Autoriser"; chip.setAttribute("aria-label", "Autoriser le micro"); }
    else if (state === "denied") { chip.textContent = "🔇 Micro bloqué"; chip.setAttribute("aria-label", "Micro bloqué, toucher pour l'aide"); }
  }

  function onClick() {
    var state = perm ? perm.state : null;
    if (state === "denied") {
      try { window.DiisooField && window.DiisooField.explain({ name: "NotAllowedError" }); } catch (e) {}
    } else if (state === "prompt") {
      try {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
          setTimeout(function () { s.getTracks().forEach(function (t) { t.stop(); }); }, 300);
        }, function () {});
      } catch (e) {}
    }
  }

  function init() {
    try {
      if (!navigator.permissions || !navigator.permissions.query || !navigator.mediaDevices) return;
      navigator.permissions.query({ name: "microphone" }).then(function (ps) {
        perm = ps;
        ps.addEventListener("change", render);
        render();
      }, function () {});
    } catch (e) {}
  }

  window.DiisooMicBadge = { majour: render };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
