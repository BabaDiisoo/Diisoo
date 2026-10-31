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
    "[data-practice][onclick^='practice']{background:#25D366!important;color:#fff!important;min-height:40px;" +
    "border-radius:999px!important;font-size:11px!important;font-weight:700!important}" +
    "[data-practice][onclick^='practice'].mic-pulsing-whatsapp{background:#128C7E!important;transform:scale(1.04)}" +
    "#wa-pill{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:9999;display:none;" +
    "align-items:center;gap:10px;background:#1F2C34;color:#fff;padding:10px 16px;border-radius:999px;" +
    "font-size:13px;box-shadow:0 4px 16px rgba(0,0,0,.45);white-space:nowrap}" +
    "#wa-pill .dot{width:10px;height:10px;border-radius:50%;background:#F44336;animation:wablink 1s infinite}" +
    "#wa-pill.annule{background:#B3261E}" +
    "@keyframes wablink{0%,100%{opacity:1}50%{opacity:.25}}";
  document.head.appendChild(st);

  function monterPill() {
    if (pill) return pill;
    pill = document.createElement("div");
    pill.id = "wa-pill";
    pill.innerHTML = '<span class="dot"></span><span id="wa-time">0:00</span><span id="wa-hint">‹ Glisse pour annuler</span>';
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
    document.getElementById("wa-hint").textContent = "‹ Glisse pour annuler";
    p.style.display = "flex";
    clearInterval(timer);
    timer = setInterval(function () { document.getElementById("wa-time").textContent = fmt(Date.now() - t0); }, 200);
    vib(30);
  }, { capture: true });

  document.addEventListener("pointermove", function (ev) {
    if (!holdBtn || cancelled) return;
    if (ev.clientX - startX < -80) {
      cancelled = true;
      window.__waCancel = true;
      if (pill) { pill.classList.add("annule"); document.getElementById("wa-hint").textContent = "Annulé"; }
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
