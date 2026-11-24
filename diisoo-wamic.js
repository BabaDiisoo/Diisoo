/* diisoo-wamic.js : etape 3
   Bouton micro identique au vocal WhatsApp :
   - maintenir = enregistrer, relacher = envoyer
   - glisser vers la gauche = annuler
   - chrono visible, vibration, couleur verte, meme libelle partout */
(function () {
  "use strict";
  var RX = /^\s*practice(GeneralWord|BusinessPhrase|Word)\(/;
  var holdBtn = null, startX = 0, t0 = 0, timer = null, cancelled = false, pill = null;

  /* CSS */
  var st = document.createElement("style");
  st.textContent =
    "[data-practice][onclick^='practice']{background:#25D366!important;color:#fff!important;min-height:44px;" +
    "border-radius:999px!important;font-size:12px!important;font-weight:700!important;box-shadow:0 2px 8px rgba(37,211,102,.35);transition:transform .15s,box-shadow .15s}" +
    "[data-practice][onclick^='practice'].mic-pulsing-whatsapp{background:#00A884!important;transform:scale(1.12);box-shadow:0 0 0 10px rgba(37,211,102,.22),0 0 0 22px rgba(37,211,102,.10)}" +
    "#wa-pill{position:fixed;left:10px;right:10px;bottom:14px;max-width:480px;margin:0 auto;z-index:9999;display:none;" +
    "align-items:center;gap:10px;background:#1F2C34;color:#E9EDEF;padding:12px 16px;border-radius:999px;" +
    "font-size:14px;box-shadow:0 6px 22px rgba(0,0,0,.5);white-space:nowrap;overflow:hidden}" +
    "#wa-pill .dot{width:11px;height:11px;border-radius:50%;background:#F15C6D;flex:none;animation:wablink 1s infinite}" +
    "#wa-pill #wa-time{font-variant-numeric:tabular-nums;font-weight:600;min-width:34px}" +
    "#wa-pill .wv{display:flex;align-items:center;gap:3px;height:22px;flex:none}" +
    "#wa-pill .wv i{display:block;width:3px;border-radius:2px;background:#25D366;height:6px;animation:wavebar .9s ease-in-out infinite}" +
    "#wa-pill .wv i:nth-child(2){animation-delay:.12s}#wa-pill .wv i:nth-child(3){animation-delay:.24s}#wa-pill .wv i:nth-child(4){animation-delay:.36s}#wa-pill .wv i:nth-child(5){animation-delay:.48s}#wa-pill .wv i:nth-child(6){animation-delay:.6s}" +
    "#wa-pill #wa-hint{flex:1;text-align:center;color:#8696A0;font-size:13px;will-change:transform,opacity}" +
    "#wa-pill.annule{background:#5A1A1A;color:#fff}#wa-pill.annule .dot{animation:none;background:#fff}#wa-pill.annule #wa-hint{color:#fff;font-weight:700}" +
    "@keyframes wablink{0%,100%{opacity:1}50%{opacity:.25}}" +
    "@keyframes wavebar{0%,100%{height:5px}50%{height:20px}}";
  document.head.appendChild(st);

  function monterPill() {
    if (pill) return pill;
    pill = document.createElement("div");
    pill.id = "wa-pill";
    pill.innerHTML = '<span class="dot"></span><span id="wa-time">0:00</span><span class="wv"><i></i><i></i><i></i><i></i><i></i><i></i></span><span id="wa-hint">‹ Glisse pour annuler</span>';
    document.body.appendChild(pill);
    return pill;
  }
  function fmt(ms) { var s = Math.floor(ms / 1000); return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60); }
  function vib(n) { try { if (navigator.vibrate) navigator.vibrate(n); } catch (e) {} }

  function arreterUI() {
    clearInterval(timer); timer = null;
    if (pill) { pill.style.display = "none"; pill.classList.remove("annule"); }
  }

  /* Annulation : le resultat de la reconnaissance est jete */
  var osl = window.startListening;
  if (typeof osl === "function") {
    window.startListening = function () {
      var h = osl.apply(this, arguments);
      if (!h || !h.promise) return h;
      var p = h.promise;
      h.promise = p.then(function (r) {
        if (window.__waCancel) { window.__waCancel = false; try { toast("Annulé"); } catch (e) {} return { text: "", error: "cancelled" }; }
        return r;
      });
      return h;
    };
  }

  document.addEventListener("pointerdown", function (ev) {
    var b = ev.target.closest && ev.target.closest("[data-practice]");
    if (!b || b.disabled || holdBtn) return;
    if (!RX.test(b.getAttribute("onclick") || "")) return;
    holdBtn = b; startX = ev.clientX; t0 = Date.now(); cancelled = false; window.__waCancel = false;
    var p = monterPill();
    p.classList.remove("annule");
    document.getElementById("wa-time").textContent = "0:00";
    var h0 = document.getElementById("wa-hint"); h0.textContent = "‹ Glisse pour annuler"; h0.style.transform = ""; h0.style.opacity = "";
    p.style.display = "flex";
    clearInterval(timer);
    timer = setInterval(function () { document.getElementById("wa-time").textContent = fmt(Date.now() - t0); }, 200);
    vib(30);
  }, { capture: true });

  document.addEventListener("pointermove", function (ev) {
    if (!holdBtn || cancelled) return;
    var dx = ev.clientX - startX, hint = document.getElementById("wa-hint");
    if (hint && dx < 0) { hint.style.transform = "translateX(" + Math.round(dx * 0.5) + "px)"; hint.style.opacity = String(Math.max(0.2, 1 + dx / 100)); }
    if (dx < -80) {
      cancelled = true;
      window.__waCancel = true;
      if (pill) { pill.classList.add("annule"); document.getElementById("wa-hint").textContent = "🗑️ Annulé"; }
      vib([20, 40, 20]);
      /* declenche le relachement du systeme existant (arret immediat du micro) */
      document.dispatchEvent(new Event("pointerup"));
    }
  }, { capture: true, passive: true });

  ["pointerup", "pointercancel", "touchend", "touchcancel"].forEach(function (t) {
    document.addEventListener(t, function () {
      if (!holdBtn) return;
      holdBtn = null;
      if (!cancelled) vib(15);
      setTimeout(arreterUI, cancelled ? 500 : 0);
    }, { capture: true, passive: true });
  });

  /* Meme libelle partout */
  var LIB = "🎤 Maintiens pour parler";
  function uniformiser(root) {
    var list = (root || document).querySelectorAll("[data-practice][onclick^='practice']");
    for (var i = 0; i < list.length; i++) {
      var b = list[i];
      if (RX.test(b.getAttribute("onclick") || "") && b.textContent !== LIB) b.textContent = LIB;
    }
  }
  try {
    new MutationObserver(function () { uniformiser(document); })
      .observe(document.body, { childList: true, subtree: true });
    uniformiser(document);
  } catch (e) {}
})();
