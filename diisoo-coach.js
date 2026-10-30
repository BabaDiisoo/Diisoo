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
    if (window.Diisoo && window.Diisoo.ecouter) {
      try { if (window.Diisoo.voix && window.Diisoo.voix.debloquer) window.Diisoo.voix.debloquer(); } catch (e) {}
      return window.Diisoo.ecouter(texte);
    }
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
      var bVer = el("button", BTN2, "3. Vérifier ce que j'ai dit");
      var lecteur = el("div", "margin-top:10px;");

      bEn.onclick = function () {
        msg.textContent = "Écoute bien...";
        jouerEn(o.en).then(function () { msg.textContent = "Maintenant, répète à voix haute."; })
          .catch(function () { msg.textContent = "Son indisponible. Vérifie le volume ou ta connexion, puis réessaie."; });
      };
      if (bWo) bWo.onclick = function () {
        msg.textContent = "Écoute...";
        jouerWo(o.wo).then(function (r) {
          var T = {
            ok: "",
            limite: "Limite d'écoutes atteinte.",
            occupe: "Une lecture est déjà en cours. Attends la fin, puis réessaie.",
            erreur: "La voix wolof ne répond pas (serveur de voix). Réessaie dans une minute. [code: erreur]",
            vide: "Pas de texte wolof pour cette phrase. [code: vide]",
            indisponible: "Voix wolof non chargée sur cette page. Recharge la page. [code: non chargé]"
          };
          msg.textContent = T[r] != null ? T[r] : "Son wolof indisponible. [code: " + r + "]";
        });
      };

      /* Étape 2 : enregistrement seul (MediaRecorder). Touche encore pour arrêter. Lecture automatique ensuite. */
      var recTimer = null;
      function arreterEnreg() { try { if (rec && rec.state !== "inactive") rec.stop(); } catch (e) {} }
      bRep.onclick = function () {
        if (enCours) { arreterEnreg(); return; }
        if (!CAN_REC) {
          if (SR) { bVer.onclick(); return; }
          msg.textContent = "Ton navigateur n'a pas de micro ici. Répète à voix haute, puis réécoute la phrase.";
          return;
        }
        lecteur.innerHTML = "";
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (st) {
          flux = st; var morceaux = [];
          rec = new MediaRecorder(st);
          rec.ondataavailable = function (e) { if (e.data && e.data.size) morceaux.push(e.data); };
          rec.onstop = function () {
            clearTimeout(recTimer);
            try { st.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
            enCours = false; bRep.textContent = "2. Répéter (micro)";
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            audioUrl = morceaux.length ? URL.createObjectURL(new Blob(morceaux, { type: rec.mimeType || "audio/webm" })) : null;
            if (!audioUrl) { msg.textContent = "Rien enregistré. Rapproche-toi du micro et réessaie."; return; }
            var a = el("audio"); a.controls = true; a.src = audioUrl; a.style.cssText = "width:100%;";
            lecteur.appendChild(a);
            msg.textContent = "Voici ta voix. Compare avec le modèle, ou touche « Vérifier ».";
            a.play().catch(function () {});
            if (SR) bVer.style.display = "block";
          };
          rec.start(); enCours = true;
          bRep.textContent = "Arrêter l'enregistrement";
          msg.textContent = "Je t'enregistre... dis la phrase, puis touche « Arrêter ».";
          recTimer = setTimeout(arreterEnreg, 10000);
        }).catch(function () {
          msg.textContent = "Micro refusé ou indisponible. Autorise-le dans le navigateur, puis réessaie.";
        });
      };

      /* Étape 3 : reconnaissance vocale seule (jamais en même temps que l'enregistrement). */
      bVer.style.display = SR ? "block" : "none";
      bVer.onclick = function () {
        if (enCours || !SR) return;
        enCours = true; var texte = "", erreur = "";
        msg.textContent = "Je t'écoute... dis la phrase maintenant (8 secondes).";
        try {
          sr = new SR(); sr.lang = "en-US"; sr.interimResults = false; sr.maxAlternatives = 3;
          sr.onresult = function (e) {
            var best = "", bs = -1;
            Array.prototype.forEach.call(e.results[0], function (x) {
              var v = simil(norm(x.transcript), norm(o.en)); if (v > bs) { bs = v; best = x.transcript; }
            });
            texte = best;
          };
          sr.onerror = function (e) { erreur = e.error || "erreur"; };
          sr.onend = function () {
            enCours = false;
            if (erreur === "not-allowed" || erreur === "service-not-allowed") msg.textContent = "Micro bloqué. Autorise le micro dans le navigateur, puis réessaie.";
            else if (erreur === "network") msg.textContent = "Connexion trop faible pour la reconnaissance vocale. Réessaie.";
            else if (erreur === "audio-capture") msg.textContent = "Le micro est occupé. Ferme les autres applications qui l'utilisent, puis réessaie.";
            else if (texte) {
              var v = simil(norm(texte), norm(o.en));
              msg.textContent = v >= SEUIL
                ? "Bravo ! Le texte reconnu correspond à la phrase. (Ce n'est pas une note de prononciation.)"
                : "J'ai compris : « " + texte + " ». Réécoute le modèle et réessaie. (Ce n'est pas une note de prononciation.)";
            } else msg.textContent = "Je n'ai rien compris. Parle plus fort, plus près du micro, et réessaie. [code: " + (erreur || "silence") + "]";
          };
          sr.start();
          setTimeout(function () { try { sr.stop(); } catch (e) {} }, 8000);
        } catch (e) { enCours = false; msg.textContent = "Reconnaissance vocale indisponible sur ce navigateur."; }
      };

      bSuiv.onclick = function () { fermer(); if (o.suivant) o.suivant(); };

      box.appendChild(bEn); if (bWo) box.appendChild(bWo); box.appendChild(bRep);
      box.appendChild(lecteur); box.appendChild(bVer);
      var bFin = el("button", BTN2, "Fermer"); bFin.onclick = fermer;
      box.appendChild(bSuiv);
      if (o.suivant) box.appendChild(bFin);
      box.appendChild(el("div", "margin-top:14px;font-size:12px;color:#6f7aa0;text-align:center;", "Coach v2 : micro séparé"));
    }
    vue();
    return { fermer: fermer };
  }

  window.DiisooCoach = { ouvrir: ouvrir, supporte: { enregistrement: CAN_REC, reconnaissance: !!SR } };
})();
