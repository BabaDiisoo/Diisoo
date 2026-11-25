/* diisoo-suivi.js v1 : suivi d'usage anonyme et des erreurs
   Enregistre dans Supabase (table diisoo_evenements) : les erreurs de l'app et les actions clés (guide vocal, séances,
   conversation, examens, secteurs Business). Aucun nom, aucun numéro, aucun contenu parlé : seulement un identifiant
   aléatoire de l'appareil, le nom de l'action, l'écran et le modèle de téléphone.
   Pour l'arrêter sur un appareil : localStorage.setItem("diisoo_no_suivi", "1"). */
(function () {
  "use strict";
  if (window.DiisooSuivi) return;
  var VERSION = "b1", MAX_SESSION = 80, file = [], envoyes = 0, vus = {}, minuteur = null;

  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  if (lire("diisoo_no_suivi") === "1") { window.DiisooSuivi = { arret: true }; return; }

  function anonId() {
    var a = lire("diisoo_anon");
    if (!a) { a = "a" + Math.random().toString(36).slice(2, 12) + Date.now().toString(36); ecrire("diisoo_anon", a); }
    return a;
  }
  function base() { try { return SUPABASE_URL.replace(/\/$/, ""); } catch (e) { return ""; } }
  function cle() { try { return SUPABASE_KEY; } catch (e) { return ""; } }
  function ecran() {
    try {
      var e = document.querySelectorAll("[id^=screen-]");
      for (var i = 0; i < e.length; i++) if (!e[i].classList.contains("hidden") && e[i].offsetParent !== null && !/tutorial|feedback|progress|premium/.test(e[i].id)) return e[i].id.replace("screen-", "").slice(0, 40);
    } catch (x) {}
    return "";
  }
  function appareil() {
    var u = navigator.userAgent || "", m = /Android [^;)]*; ([^;)]*)/.exec(u);
    return (m ? "Android " + m[1] : /iPhone|iPad/.test(u) ? ("iOS" + ((/OS (\d+)[_.](\d+)/.exec(u) || []).length ? " " + /OS (\d+)[_.](\d+)/.exec(u)[1] + "." + /OS (\d+)[_.](\d+)/.exec(u)[2] : "") + (/musical_ly|TikTok|Bytedance/i.test(u) ? " TikTok" : /Instagram/i.test(u) ? " Instagram" : /FBAN|FBAV/.test(u) ? " Facebook" : /CriOS/.test(u) ? " Chrome" : /Safari/.test(u) ? " Safari" : " integre")) : /Windows|Mac|Linux/.test(u) ? "Ordinateur" : "Autre").slice(0, 160);
  }

  function envoyer(garde) {
    if (!file.length) return;
    var lot = file.splice(0, 20), u = base(), k = cle();
    if (!u || !k) return;
    try {
      fetch(u + "/rest/v1/diisoo_evenements", {
        method: "POST", keepalive: !!garde,
        headers: { apikey: k, Authorization: "Bearer " + k, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify(lot)
      }).catch(function () {});
    } catch (e) {}
    if (file.length) envoyer(garde);
  }
  function planifier() { if (!minuteur) minuteur = setTimeout(function () { minuteur = null; envoyer(false); }, 8000); }

  function noter(type, nom, detail) {
    if (envoyes >= MAX_SESSION) return;
    nom = String(nom || "").slice(0, 80); if (!nom) return;
    if (type === "erreur") { var c = nom + "|" + (detail || ""); if (vus[c]) return; vus[c] = 1; }
    envoyes++;
    file.push({ anon: anonId(), type: type, nom: nom, detail: detail ? String(detail).slice(0, 300) : null, ecran: ecran(), appareil: appareil(), version: VERSION });
    planifier();
  }

  /* ---- erreurs ---- */
  window.addEventListener("error", function (e) {
    var m = String(e.message || "");
    if (!m || /ResizeObserver|^Script error/i.test(m)) return;
    noter("erreur", m, (String(e.filename || "").split("/").pop() || "") + ":" + (e.lineno || 0));
  });
  window.addEventListener("unhandledrejection", function (e) {
    var r = e.reason, m = String((r && (r.message || r)) || "");
    if (!m || /AbortError|NetworkError|Failed to fetch|Load failed/i.test(m)) return;
    noter("erreur", "promesse: " + m, "");
  });


  /* ---- erreurs avalees par les sections protegees ("[diisoo-xxx] ...") et parcours IELTS ---- */
  try {
    var ce = console.error;
    console.error = function () {
      try { var m = String(arguments[0] || ""); if (/^\[diisoo-/.test(m)) noter("erreur", m.slice(0, 80), String(arguments[1] && (arguments[1].message || arguments[1]) || "").slice(0, 200)); } catch (e) {}
      return ce.apply(this, arguments);
    };
  } catch (e) {}
  document.addEventListener("click", function (ev) {
    try {
      var b = ev.target && ev.target.closest && ev.target.closest("button");
      if (!b) return;
      var t = (b.getAttribute("aria-label") || b.textContent || "").trim().slice(0, 30);
      if (document.getElementById("ie-ov") && /Voir les 7|Life Skills|Écoute|Oral|Terminer/.test(t)) noter("action", "ielts_clic", t);
      else if (b.getAttribute("aria-label") === "Pause") noter("action", "examen_pause", "");
    } catch (e) {}
  }, true);

  /* ---- actions : on entoure les fonctions existantes sans les modifier ---- */
  function entourer(obj, nom, action, detail) {
    try {
      var f = obj[nom]; if (typeof f !== "function" || f.__suivi) return;
      var g = function () { try { noter("action", action, detail ? detail.apply(null, arguments) : ""); } catch (e) {} return f.apply(this, arguments); };
      g.__suivi = true; obj[nom] = g;
    } catch (e) {}
  }
  function brancher() {
    entourer(window, "openGeneralModule", "ouvre_anglais");
    entourer(window, "openWolofModule", "ouvre_wolof");
    entourer(window, "openBusinessModule", "ouvre_business");
    entourer(window, "startTestSimulation", "ouvre_examens");
    entourer(window, "openPremium", "ouvre_premium");
    entourer(window, "openRevision", "ouvre_revision");
    if (window.DiisooVoixGuide) entourer(window.DiisooVoixGuide, "ouvrir", "guide_vocal");
    if (window.DiisooSeance) entourer(window.DiisooSeance, "demarrer", "seance_debut", function (k) { return k; });
    if (window.DiisooConversation) entourer(window.DiisooConversation, "demarrer", "conversation_debut", function (s, n, t) { return t; });
    if (window.DiisooExams2) entourer(window.DiisooExams2, "ouvrir", "examen", function (k) { return k; });
    if (typeof window.selectBusinessModule === "function") entourer(window, "selectBusinessModule", "secteur_business", function (k) { return k; });
    /* v188 : étapes entre « j'ouvre » et « je reviens » (écoute, micro, rappel) */
    if (window.Diisoo && window.Diisoo.voix) entourer(window.Diisoo.voix, "jouer", "voix_jouee", function (t, l) { return (l || "") + "|" + String(t || "").replace(/\s+/g, " ").slice(0, 70); });
    if (window.DiisooCoach) entourer(window.DiisooCoach, "ouvrir", "coach_ouvert");
    if (window.DiisooRappel) { entourer(window.DiisooRappel, "proposer", "rappel_propose"); entourer(window.DiisooRappel, "activer", "rappel_active"); }
    if (typeof window.startListening === "function") entourer(window, "startListening", "micro_demarre", function (l) { return l; });
  }
  document.addEventListener("click", function (ev) {
    try { var b = ev.target && ev.target.closest && ev.target.closest(".f-c[data-h]"); if (b) noter("action", "rappel_choix", b.getAttribute("data-h")); } catch (e) {}
  }, true);
  document.addEventListener("submit", function (ev) {
    try { if (ev.target && ev.target.id === "form-onboarding") noter("action", "commencer", ""); } catch (e) {}
  }, true);

  /* ---- fins de séance, de conversation, d'examen : on regarde apparaître l'écran de bilan ---- */
  var fins = { "dsn-end": "seance_fin", "dcv-end": "conversation_fin" }, deja = {};
  try {
    new MutationObserver(function () {
      for (var id in fins) { var e = document.getElementById(id); if (e && !e.__vu) { e.__vu = 1; noter("action", fins[id], ""); } else if (!e) { } }
      var f = document.getElementById("dii-fmt");
      if (f && /Indice Diisoo/.test(f.innerText || "") && !f.__bilan) { f.__bilan = 1; noter("action", "examen_fin", ""); }
    }).observe(document.body, { childList: true, subtree: true });
  } catch (e) {}

  /* ---- envoi ---- */
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") envoyer(true); });
  window.addEventListener("pagehide", function () { envoyer(true); });

  setTimeout(brancher, 500);
  setTimeout(brancher, 4000);
  noter("action", "session", lire("diisoo_premier") ? "retour" : "nouveau");
  ecrire("diisoo_premier", "1");

  window.DiisooSuivi = { version: 1, noter: noter, envoyer: function () { envoyer(false); } };
})();
