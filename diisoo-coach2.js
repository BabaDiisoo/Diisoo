/* diisoo-coach2.js v1 : coach vocal en un seul geste
   Remplace le parcours en 3 boutons par une boucle guidee :
   1. Le modele s'ecoute tout seul (anglais, voix de l'app)
   2. Un gros bouton micro : maintiens, parle, relache (comme le vocal WhatsApp)
   3. Resultat mot par mot : vert = bien, orange = proche, rouge = a reprendre. Touche un mot pour l'entendre doucement
   4. Reessaie jusqu'a reussir, puis la phrase suivante. Apres 2 essais ratés, le modele est relu lentement.
   Meme appel que l'ancien coach : DiisooCoach.ouvrir({ en, pron, wo, fr, suivant, onFin }). */
(function () {
  "use strict";
  var ancien = window.DiisooCoach || {};
  var SEUIL = 0.8;

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function mots(s) { try { return normalize(s).split(" ").filter(Boolean); } catch (e) { return String(s).toLowerCase().replace(/[^a-z' ]/g, " ").split(/\s+/).filter(Boolean); } }
  function lev(a, b) {
    var d = [], i, j;
    for (i = 0; i <= a.length; i++) d[i] = [i];
    for (j = 1; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  var HOMO = [["two", "too", "to"], ["for", "four", "fore"], ["night", "knight"], ["no", "know"], ["write", "right"], ["there", "their", "theyre"],
    ["hear", "here"], ["one", "won"], ["buy", "by", "bye"], ["sea", "see"], ["i", "eye"], ["our", "hour"], ["wait", "weight"], ["week", "weak"],
    ["son", "sun"], ["meet", "meat"], ["wear", "where", "ware"], ["whole", "hole"], ["would", "wood"], ["your", "youre"], ["its", "it's"], ["new", "knew"]];
  var PETITS = { a: 1, an: 1, the: 1, of: 1 };
  function memeSon(a, b) {
    for (var i = 0; i < HOMO.length; i++) { if (HOMO[i].indexOf(a) > -1 && HOMO[i].indexOf(b) > -1) return true; }
    return false;
  }
  function proche(a, b) { var m = Math.max(a.length, b.length); return m ? 1 - lev(a, b) / m : 1; }

  /* Compare mot a mot : 2 = bien, 1 = proche, 0 = a reprendre */
  function comparer(cible, entendu) {
    var C = mots(cible), H = mots(entendu), res = [], pts = 0;
    C.forEach(function (w) {
      var best = 0;
      H.forEach(function (h) { var s = (h === w || memeSon(w, h)) ? 1 : proche(w, h); if (s > best) best = s; });
      var etat = best >= 0.99 ? 2 : (best >= 0.7 ? 1 : 0);
      if (etat === 0 && PETITS[w]) { etat = 1; best = 0.8; } /* petits mots souvent avales par la reconnaissance */
      pts += etat === 2 ? 1 : (etat === 1 ? (PETITS[w] ? 0.9 : 0.6) : 0);
      res.push({ w: w, etat: etat });
    });
    return { mots: res, score: C.length ? pts / C.length : 0 };
  }

  var st = document.createElement("style");
  st.textContent =
    "#dii-coach{position:fixed;inset:0;z-index:99999;background:rgba(5,8,18,.94);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-coach .co-box{width:100%;max-width:520px;max-height:96vh;overflow-y:auto;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px 22px 0 0;padding:16px 16px 22px;color:#F6F1E7;font-family:inherit}" +
    "#dii-coach .co-top{display:flex;align-items:center;gap:8px;margin-bottom:6px}" +
    "#dii-coach .co-x{width:44px;height:44px;border-radius:50%;background:#141A2B;border:1px solid #1E2740;color:#A69C86;font-size:16px}" +
    "#dii-coach .co-tt{flex:1;text-align:center;font-size:11px;font-weight:700;letter-spacing:.1em;color:#8C8064;text-transform:uppercase}" +
    "#dii-coach .co-en{font-size:26px;font-weight:800;line-height:1.2;text-align:center;margin:6px 0 4px}" +
    "#dii-coach .co-pron{text-align:center;font-size:16px;color:#F3A94E;margin:0 0 4px}" +
    "#dii-coach .co-aide{text-align:center;font-size:13px;color:#A69C86;margin:0 0 2px}" +
    "#dii-coach .co-mots{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:12px 0 6px}" +
    "#dii-coach .co-m{min-height:44px;padding:6px 12px;border-radius:12px;border:2px solid #1E2740;background:#141A2B;color:#F6F1E7;font-size:17px;font-weight:700}" +
    "#dii-coach .co-m.v{border-color:#25D366;background:#12351F}#dii-coach .co-m.o{border-color:#F3A94E;background:#3A2A10}#dii-coach .co-m.r{border-color:#E5484D;background:#3A1515}" +
    "#dii-coach .co-msg{min-height:44px;text-align:center;font-size:15px;line-height:1.35;margin:6px 0}" +
    "#dii-coach .co-ecoute{display:flex;gap:8px;margin:6px 0}" +
    "#dii-coach .co-ecoute button{flex:1;min-height:48px;border-radius:14px;background:#141A2B;border:1px solid #1E2740;color:#E4DCC9;font-size:13px;font-weight:700}" +
    "#dii-coach .co-mic{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;min-height:96px;border-radius:24px;border:0;background:#25D366;color:#fff;font-size:15px;font-weight:800;touch-action:none;user-select:none;-webkit-user-select:none;margin-top:6px}" +
    "#dii-coach .co-mic span{font-size:34px;line-height:1}" +
    "#dii-coach .co-mic.on{background:#E5484D;animation:copulse 1s infinite}" +
    "@keyframes copulse{0%,100%{box-shadow:0 0 0 0 rgba(229,72,77,.6)}50%{box-shadow:0 0 0 14px rgba(229,72,77,0)}}" +
    "#dii-coach .co-pts{display:flex;justify-content:center;gap:6px;margin:8px 0 0}" +
    "#dii-coach .co-pts i{width:12px;height:12px;border-radius:50%;background:#1E2740}#dii-coach .co-pts i.ko{background:#E5484D}#dii-coach .co-pts i.ok{background:#25D366}" +
    "#dii-coach .co-suiv{width:100%;min-height:56px;margin-top:10px;border-radius:999px;border:0;background:#25D366;color:#fff;font-size:16px;font-weight:800}" +
    "#dii-coach .co-sec{width:100%;min-height:46px;margin-top:6px;background:none;border:0;color:#A69C86;font-size:13px}";
  document.head.appendChild(st);

  function parler(txt, rate) { try { if (typeof speak === "function") return speak(txt, "en-US", rate || 0.85); } catch (e) {} }
  function son(n) { try { if (window.DiisooSon) window.DiisooSon.jouer(n); } catch (e) {} }

  function ouvrir(o) {
    o = o || {};
    if (!o.en) return;
    if (document.getElementById("dii-coach")) return;
    try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
    var fond = el("div"); fond.id = "dii-coach";
    var box = el("div", "co-box"); fond.appendChild(box); document.body.appendChild(fond);
    var essais = [], fini = false, h = null, actif = false;

    function fermer() {
      try { if (h) h.stop(); } catch (e) {}
      try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
      fond.remove();
      if (o.onFin) { try { o.onFin(); } catch (e) {} }
    }

    var top = el("div", "co-top");
    var x = el("button", "co-x", "✕"); x.type = "button"; x.setAttribute("aria-label", "Fermer"); x.onclick = fermer;
    top.appendChild(x); top.appendChild(el("div", "co-tt", "Coach vocal"));
    box.appendChild(top);
    box.appendChild(el("div", "co-en", o.en));
    if (o.pron) box.appendChild(el("div", "co-pron", o.pron));
    if (o.fr) box.appendChild(el("div", "co-aide", o.fr));
    if (o.wo) box.appendChild(el("div", "co-aide", "🗣️ " + o.wo));
    var zoneMots = el("div", "co-mots"); box.appendChild(zoneMots);
    var msg = el("div", "co-msg", "Écoute le modèle, puis maintiens le bouton vert et dis la phrase."); msg.setAttribute("aria-live", "polite");
    box.appendChild(msg);

    var ec = el("div", "co-ecoute");
    var bMod = el("button", null, "🔊 Modèle"); bMod.type = "button";
    var bLent = el("button", null, "🐢 Lentement"); bLent.type = "button";
    bMod.onclick = function () { msg.textContent = "Écoute..."; parler(o.en, 0.9); };
    bLent.onclick = function () { msg.textContent = "Écoute doucement..."; parler(o.en, 0.6); };
    ec.appendChild(bMod); ec.appendChild(bLent);
    if (o.wo) {
      var bWo = el("button", null, "🗣️ Wolof"); bWo.type = "button";
      bWo.onclick = function () { try { if (typeof speakWolofOolel === "function") speakWolofOolel(o.wo); } catch (e) {} };
      ec.appendChild(bWo);
    }
    box.appendChild(ec);

    var mic = el("button", "co-mic"); mic.type = "button";
    mic.innerHTML = "<span>🎤</span>Maintiens pour parler";
    box.appendChild(mic);
    var pts = el("div", "co-pts"); box.appendChild(pts);
    function points() {
      pts.innerHTML = "";
      for (var i = 0; i < Math.max(3, essais.length); i++) {
        var p = el("i", essais[i] === undefined ? "" : (essais[i] ? "ok" : "ko")); pts.appendChild(p);
      }
    }
    points();
    var zoneSuite = el("div"); box.appendChild(zoneSuite);

    function afficher(res) {
      zoneMots.innerHTML = "";
      res.mots.forEach(function (m) {
        var b = el("button", "co-m " + (m.etat === 2 ? "v" : m.etat === 1 ? "o" : "r"), m.w); b.type = "button";
        b.setAttribute("aria-label", "Écouter le mot " + m.w);
        b.onclick = function () { parler(m.w, 0.6); };
        zoneMots.appendChild(b);
      });
    }

    function suite(reussi) {
      zoneSuite.innerHTML = "";
      if (reussi) {
        var s = el("button", "co-suiv", o.suivant ? "➡️ Phrase suivante" : "✅ Terminer"); s.type = "button";
        s.onclick = function () { fermer(); if (o.suivant) o.suivant(); };
        zoneSuite.appendChild(s);
        var r = el("button", "co-sec", "Refaire encore une fois"); r.type = "button";
        r.onclick = function () { zoneSuite.innerHTML = ""; zoneMots.innerHTML = ""; msg.textContent = "Maintiens le bouton vert et dis la phrase."; };
        zoneSuite.appendChild(r);
      } else if (o.suivant && essais.length >= 3) {
        var p = el("button", "co-sec", "Passer à la phrase suivante"); p.type = "button";
        p.onclick = function () { fermer(); o.suivant(); };
        zoneSuite.appendChild(p);
      }
    }

    function resultat(texte) {
      actif = false; mic.classList.remove("on"); mic.innerHTML = "<span>🎤</span>Maintiens pour parler";
      if (!texte) {
        msg.textContent = "Je n'ai rien entendu. Rapproche-toi du micro, garde le doigt appuyé pendant que tu parles.";
        return;
      }
      var res = comparer(o.en, texte);
      afficher(res);
      var ok = res.score >= SEUIL;
      essais.push(ok); points();
      if (ok) {
        fini = true; son("juste");
        try { if (typeof addXP === "function") addXP(3); if (typeof bumpDailyGoal === "function") bumpDailyGoal(1); } catch (e) {}
        msg.textContent = "Bravo ! " + Math.round(res.score * 100) + " % des mots sont justes.";
        suite(true);
      } else {
        son("reessaie");
        var rouges = res.mots.filter(function (m) { return m.etat === 0; }).map(function (m) { return m.w; });
        msg.textContent = "J'ai entendu : « " + texte + " ».\n" + (rouges.length ? "À reprendre : " + rouges.slice(0, 3).join(", ") + ". Touche un mot pour l'écouter." : "Presque ! Réessaie plus doucement.");
        msg.style.whiteSpace = "pre-line";
        if (essais.filter(function (v) { return !v; }).length >= 2 && !fini) { setTimeout(function () { parler(o.en, 0.6); }, 500); }
        suite(false);
      }
    }

    function debut(ev) {
      if (actif) return;
      ev.preventDefault();
      try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
      actif = true; mic.classList.add("on"); mic.innerHTML = "<span>🎙️</span>Je t'écoute... relâche à la fin";
      zoneSuite.innerHTML = "";
      try {
        h = startListening("en-US", 12000, true);
        h.promise.then(function (r) { resultat(r && r.text); }, function () { resultat(""); });
      } catch (e) { actif = false; resultat(""); }
    }
    function fin() { if (actif && h) { try { h.stop(); } catch (e) {} } }
    mic.addEventListener("pointerdown", debut);
    mic.addEventListener("pointerup", fin);
    mic.addEventListener("pointercancel", fin);
    mic.addEventListener("pointerleave", fin);
    mic.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    mic.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { if (!actif) debut(e); else fin(); } });

    /* Le modele se lit tout seul a l'ouverture */
    setTimeout(function () { parler(o.en, 0.9); }, 350);
    return { fermer: fermer };
  }

  window.DiisooCoach = { ouvrir: ouvrir, supporte: ancien.supporte || { enregistrement: false, reconnaissance: true }, version: 2, _comparer: comparer };
})();
