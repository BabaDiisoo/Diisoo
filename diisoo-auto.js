/* diisoo-auto.js v2 : lecture automatique des cartes (Wolof = le sens, puis Anglais = la cible, puis le micro pulse).
 * Agit seulement quand une carte est affichée seule (mode « une carte à la fois » de diisoo-focus.js) et après le premier toucher de l'utilisateur
 * (règle des navigateurs). S'arrête dès que l'utilisateur touche l'écran, ne joue rien si une fenêtre plein écran est ouverte (coach, séance, mission).
 * Interrupteurs : ?auto=0 (coupe tout) ou le bouton « Lecture auto » dans la barre des cartes. Fichier autonome, sans effet sur les autres. */
(function () {
  "use strict";
  if (window.__diisooAuto) return; window.__diisooAuto = true;
  try { if (new URLSearchParams(location.search).get("auto") === "0") return; } catch (e) {}

  var CLE = "diisoo_auto_off";
  var BOITES = ["general-content", "business-content", "lexicon-container"];
  var touche = false, jeton = 0, nbTouch = 0, derniere = "", derniereP = null, monWrap = null, memoire = true;

  /* le choix est gardé dans le téléphone ; si le stockage est bloqué, il est gardé jusqu'à la fermeture de la page */
  function actif() { try { return localStorage.getItem(CLE) !== "1"; } catch (e) { return memoire; } }
  function regler(on) { memoire = !!on; try { if (on) localStorage.removeItem(CLE); else localStorage.setItem(CLE, "1"); } catch (e) {} }
  function pause(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function visible(el) {
    if (!el || el.style.display === "none") return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && el.getClientRects().length > 0;
  }

  /* un toucher de l'utilisateur : autorise le son, et coupe la lecture automatique en cours */
  function toucher() { touche = true; jeton++; nbTouch++; }
  ["pointerdown", "touchstart", "mousedown", "keydown"].forEach(function (ev) {
    try { window.addEventListener(ev, toucher, { capture: true, passive: true }); } catch (e) {}
  });

  /* on note la promesse de la dernière lecture pour savoir quand elle se termine (se remet par-dessus les autres modules) */
  function assurer() {
    var V = window.Diisoo && window.Diisoo.voix;
    if (!V || typeof V.jouer !== "function" || V.jouer === monWrap) return;
    var o = V.jouer;
    monWrap = function () { var p = o.apply(this, arguments); derniereP = p; return p; };
    V.jouer = monWrap;
  }

  /* une fenêtre plein écran est-elle ouverte (coach, séance guidée, conversation, mission, examen) ? */
  function surcouche() {
    var kids = document.body ? document.body.children : [];
    for (var i = 0; i < kids.length; i++) {
      var el = kids[i];
      if (el.tagName === "SCRIPT" || el.tagName === "STYLE") continue;
      var cs = window.getComputedStyle(el);
      if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden") continue;
      var r = el.getBoundingClientRect();
      if (r.width >= window.innerWidth * 0.9 && r.height >= window.innerHeight * 0.9) return true;
    }
    return false;
  }

  function boutons(carte) {
    var res = { en: null, wo: null, mic: null };
    var bs = carte.querySelectorAll("button");
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i], t = (b.textContent || "").trim();
      if (!visible(b)) continue;
      if (!res.en && (b.getAttribute("data-biz") === "en" || /(^|\s)English$/i.test(t))) res.en = b;
      else if (!res.wo && (b.getAttribute("data-biz") === "wo" || /(^|\s)Wolof$/i.test(t))) res.wo = b;
      else if (!res.mic && /Maintiens|M'entra/i.test(t)) res.mic = b;
    }
    return res;
  }

  function carteCourante() {
    for (var k = 0; k < BOITES.length; k++) {
      var box = document.getElementById(BOITES[k]);
      if (!box || box.classList.contains("hidden") || !visible(box) || !box.querySelector(".fx-nav")) continue;
      var n = 0;
      for (var i = 0; i < box.children.length; i++) {
        var c = box.children[i];
        if (c.tagName !== "DIV" || c.classList.contains("fx-nav")) continue;
        n++;
        if (!visible(c)) continue;
        var b = boutons(c);
        if (!b.en) continue;
        return { box: box, carte: c, cle: box.id + ":" + n + ":" + (c.textContent || "").trim().slice(0, 60), b: b };
      }
    }
    return null;
  }

  function fin(mon) {
    return pause(450).then(function () {
      if (mon !== jeton) return;
      var p = derniereP;
      if (p && typeof p.then === "function") return Promise.race([p.then(function () {}, function () {}), pause(12000)]);
      return pause(2500);
    });
  }

  function pulser(el) {
    if (!el) return;
    el.classList.remove("dii-pulse"); void el.offsetWidth; el.classList.add("dii-pulse");
    setTimeout(function () { try { el.classList.remove("dii-pulse"); } catch (e) {} }, 4200);
  }

  /* ordre pédagogique : le sens en wolof d'abord, puis l'anglais (dernier son entendu, celui qu'on va répéter), puis le micro */
  async function lire(c) {
    var mon = ++jeton;
    try {
      if (c.b.wo && visible(c.b.wo)) {
        derniereP = null; c.b.wo.click();
        await fin(mon); if (mon !== jeton) return;
        await pause(300); if (mon !== jeton) return;
      }
      derniereP = null; c.b.en.click();
      await fin(mon); if (mon !== jeton) return;
      if (c.b.mic) pulser(c.b.mic);
    } catch (e) {}
  }

  function bouton() {
    var nav = document.querySelector(".fx-nav");
    if (!nav) return;
    var b = nav.querySelector(".dii-auto-btn");
    var txt = actif() ? "🔁 Lecture auto : oui" : "🔁 Lecture auto : non";
    if (b) { if (b.textContent !== txt) b.textContent = txt; return; }
    b = document.createElement("button");
    b.type = "button"; b.className = "dii-auto-btn"; b.textContent = txt;
    b.onclick = function (e) {
      e.stopPropagation();
      var on = !actif(); regler(on); b.textContent = on ? "🔁 Lecture auto : oui" : "🔁 Lecture auto : non";
      derniere = "";
    };
    nav.appendChild(b);
  }

  function tour() {
    try { assurer(); bouton(); } catch (e) {}
    if (!actif() || !touche || document.hidden) return;
    var c = null;
    try { c = carteCourante(); } catch (e) {}
    if (!c) { derniere = ""; return; }
    if (c.cle === derniere) return;
    if (surcouche()) return;
    derniere = c.cle;
    var ma = c.cle, nt = nbTouch;
    setTimeout(function () {
      if (nt !== nbTouch || !actif() || surcouche()) return;   /* l'utilisateur a touché l'écran entre-temps : on ne lance rien */
      var c2 = null; try { c2 = carteCourante(); } catch (e) {}
      if (c2 && c2.cle === ma) lire(c2);
    }, 350);
  }

  var st = document.createElement("style");
  st.textContent =
    "@keyframes diiPulse{0%{box-shadow:0 0 0 0 rgba(37,211,102,.75)}70%{box-shadow:0 0 0 16px rgba(37,211,102,0)}100%{box-shadow:0 0 0 0 rgba(37,211,102,0)}}" +
    ".dii-pulse{animation:diiPulse 1.2s ease-out 3}" +
    ".dii-auto-btn{width:100%;margin-top:6px;min-height:34px;border-radius:10px;border:1px solid #1E2740;background:transparent;color:#A69C86;font-size:12px;font-weight:700}";
  document.head.appendChild(st);

  setInterval(tour, 500);
  window.DiisooAuto = { version: 2, actif: actif, regler: regler };
})();
