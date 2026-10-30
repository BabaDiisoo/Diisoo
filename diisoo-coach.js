/* diisoo-coach.js
 * Coach vocal autonome. Une ligne dans index.html : <script src="diisoo-coach.js" defer></script>
 * Usage : DiisooCoach.ouvrir({ en: "How are you?", pron: "Haou ar you ?", wo: "Naka nga def ?", fr: "Comment vas-tu ?" })
 * Parcours : écouter, répéter, s'enregistrer, comparer (si reconnaissance vocale), se réécouter, recommencer ou suivant.
 * Limite affichée à l'utilisateur : le texte reconnu est comparé à la phrase cible. Ce n'est pas une note de prononciation.
 * Sans reconnaissance vocale : l'enregistrement est réécouté et l'apprenant s'auto-évalue.
 * Sans micro : écoute et répétition à voix haute seulement.
 */
(function () {
  "use strict";
  if (window.DiisooCoach) return;

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var CAN_REC = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  var SEUIL = 0.8;

  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function dist(a, b) {
    var d = [], i, j;
    for (i = 0; i <= a.length; i++) { d[i] = [i]; }
    for (j = 1; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  function simil(a, b) { var m = Math.max(a.length, b.length); return m ? 1 - dist(a, b) / m : 1; }

  function el(tag, css, txt) {
    var e = document.createElement(tag);
    if (css) e.style.cssText = css;
    if (txt != null) e.textContent = txt;
    return e;
  }
  var BTN = "min-height:52px;padding:0 18px;border:0;border-radius:14px;font:600 16px system-ui,sans-serif;color:#fff;background:#1f6feb;width:100%;margin-top:10px;";
  var BTN2 = BTN.replace("#1f6feb", "#2a3350");

  function jouerEn(texte) {
    try {
      if (window.Diisoo && window.Diisoo.voix && window.Diisoo.voix.jouer) return window.Diisoo.voix.jouer(texte, "en");
    } catch (e) {}
    return new Promise(function (res, rej) {
      if (!window.speechSynthesis) return rej(new Error("voix indisponible"));
      var u = new SpeechSynthesisUtterance(texte); u.lang = "en-US"; u.rate = 0.9;
      u.onend = function () { res(true); }; u.onerror = function () { rej(new Error("voix")); };
      speechSynthesis.speak(u);
    });
  }
  function jouerWo(texte) {
    if (window.Diisoo && window.Diisoo.ecouter) return window.Diisoo.ecouter(texte);
    return Promise.resolve("indisponible");
  }

  function ouvrir(o) {
    o = o || {};
    if (!o.en) return;
    var fond = el("div", "position:fixed;inset:0;z-index:99999;background:rgba(5,8,18,.92);display:flex;align-items:flex-end;justify-content:center;");
    var box = el("div", "width:100%;max-width:520px;max-height:92vh;overflow:auto;background:#121a2e;color:#f2f5ff;border-radius:22px 22px 0 0;padding:20px 18px 26px;font-family:system-ui,sans-serif;");
    fond.appendChild(box);
    document.body.appendChild(fond);

    var flux = null, rec = null, audioUrl = null, sr = null, enCours = false;

    function fermer() {
      try { if (sr) sr.abort(); } catch (e) {}
      try { if (rec && rec.state !== "inactive") rec.stop(); } catch (e) {}
      try { if (flux) flux.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
      try { if (window.Diisoo && window.Diisoo.voix) window.Diisoo.voix.arreter(); } catch (e) {}
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      fond.remove();
      if (o.onFin) o.onFin();
    }

    function vue() {
      box.innerHTML = "";
      box.appendChild(el("div", "font:700 26px system-ui;margin-bottom:6px;", o.en));
      if (o.pron) box.appendChild(el("div", "font-size:18px;color:#ffd166;margin-bottom:6px;", o.pron));
      if (o.wo) box.appendChild(el("div", "font-size:18px;margin-bottom:4px;", "Wolof : " + o.wo));
      if (o.fr) box.appendChild(el("div", "font-size:16px;color:#aab4d4;margin-bottom:10px;", "Français : " + o.fr));
      var msg = el("div", "min-height:44px;margin:10px 0;font-size:17px;line-height:1.4;");
      msg.setAttribute("aria-live", "polite");
      box.appendChild(msg);

      var bEn = el("button", BTN, "1. Écouter en anglais");
      var bWo = o.wo ? el("button", BTN2, "Écouter en wolof") : null;
      var bRep = el("button", BTN, CAN_REC || SR ? "2. Répéter (micro)" : "2. Répéter à voix haute");
      var bSuiv = el("button", BTN2, o.suivant ? "Phrase suivante" : "Fermer");
      var lecteur = el("div", "margin-top:10px;");

      bEn.onclick = function () {
        msg.textContent = "Écoute bien...";
        jouerEn(o.en).then(function () { msg.textContent = "Maintenant, répète à voix haute."; })
          .catch(function () { msg.textContent = "Son indisponible. Vérifie le volume ou ta connexion, puis réessaie."; });
      };
      if (bWo) bWo.onclick = function () {
        msg.textContent = "Écoute...";
        jouerWo(o.wo).then(function (r) {
          msg.textContent = r === "limite" ? "Limite d'écoutes atteinte." : r === "ok" ? "" : "Son wolof indisponible pour le moment.";
        });
      };

      bRep.onclick = function () {
        if (enCours) return;
        if (!CAN_REC && !SR) { msg.textContent = "Ton navigateur n'a pas de micro ici. Répète à voix haute, puis réécoute la phrase."; return; }
        enCours = true; lecteur.innerHTML = "";
        msg.textContent = "Je t'écoute... parle maintenant (8 secondes).";
        var morceaux = [], texte = "", fini = 0;

        function bilan() {
          if (++fini < (CAN_REC ? 1 : 0) + (SR ? 1 : 0)) return;
          enCours = false;
          if (audioUrl) { var a = el("audio"); a.controls = true; a.src = audioUrl; a.style.cssText = "width:100%;"; lecteur.appendChild(a); }
          if (SR && texte) {
            var s = simil(norm(texte), norm(o.en));
            msg.textContent = s >= SEUIL
              ? "Bravo ! Le texte reconnu correspond à la phrase. (Ce n'est pas une note de prononciation.)"
              : "J'ai compris : « " + texte + " ». Réécoute le modèle et réessaie. (Ce n'est pas une note de prononciation.)";
          } else if (SR) {
            msg.textContent = "Je n'ai rien compris. Rapproche-toi du micro et réessaie.";
          } else {
            msg.textContent = "Réécoute-toi, puis compare avec le modèle. Ici, c'est toi qui juges, l'application ne note pas ta prononciation.";
          }
        }

        function lancerSR() {
          if (!SR) return;
          try {
            sr = new SR(); sr.lang = "en-US"; sr.interimResults = false; sr.maxAlternatives = 3;
            sr.onresult = function (e) {
              var best = ""; var bs = -1;
              Array.prototype.forEach.call(e.results[0], function (a) {
                var s = simil(norm(a.transcript), norm(o.en)); if (s > bs) { bs = s; best = a.transcript; }
              });
              texte = best;
            };
            sr.onerror = function (e) {
              if (e.error === "not-allowed" || e.error === "service-not-allowed")
                msg.textContent = "Micro bloqué. Autorise le micro dans le navigateur, puis réessaie.";
              else if (e.error === "network")
                msg.textContent = "Connexion trop faible pour la reconnaissance vocale. Réessaie.";
            };
            sr.onend = bilan;
            sr.start();
            setTimeout(function () { try { sr.stop(); } catch (e) {} }, 8000);
          } catch (e) { bilan(); }
        }

        if (CAN_REC) {
          navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
            flux = s;
            rec = new MediaRecorder(s);
            rec.ondataavailable = function (e) { if (e.data && e.data.size) morceaux.push(e.data); };
            rec.onstop = function () {
              try { s.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
              if (audioUrl) URL.revokeObjectURL(audioUrl);
              audioUrl = morceaux.length ? URL.createObjectURL(new Blob(morceaux, { type: rec.mimeType || "audio/webm" })) : null;
              bilan();
            };
            rec.start();
            setTimeout(function () { try { if (rec.state !== "inactive") rec.stop(); } catch (e) {} }, 8000);
            lancerSR();
          }).catch(function () {
            enCours = false; CAN_REC && (msg.textContent = "Micro refusé ou indisponible. Autorise-le dans le navigateur, ou répète à voix haute sans enregistrer.");
          });
        } else {
          lancerSR();
        }
      };

      bSuiv.onclick = function () { fermer(); if (o.suivant) o.suivant(); };

      box.appendChild(bEn); if (bWo) box.appendChild(bWo); box.appendChild(bRep);
      box.appendChild(lecteur);
      var bFin = el("button", BTN2, "Fermer"); bFin.onclick = fermer;
      box.appendChild(bSuiv);
      if (o.suivant) box.appendChild(bFin);
    }
    vue();
    return { fermer: fermer };
  }

  window.DiisooCoach = { ouvrir: ouvrir, supporte: { enregistrement: CAN_REC, reconnaissance: !!SR } };
})();
