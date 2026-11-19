/* diisoo-ielts-p1.js v1 : module IELTS, phase 1 (catalogue, objectif, positionnement)
 * Règles : R1 estimation, R2 positionnement interne, R3 pas de band depuis un niveau, R4 Life Skills distinct,
 * R5 avertissement visa, R6 Life Skills sans band, R7 contenus Diisoo, R8 corrections côté serveur.
 * Ouverture : bouton "IELTS : parcours" dans le hub Examens, ou ?ielts=1, ou window.DiisooIelts.ouvrir().
 * Prérequis : sql-ielts-phase1.sql exécuté dans Supabase. Sans effet sur le reste de l'app.
 */
(function () {
  "use strict";
  if (window.DiisooIelts) return;

  var URL_SB = "https://jkwtyoefqvafnlqkhium.supabase.co";
  var KEY_SB = "sb_publishable__lzrlmMaJdFC_kav6DkfEA_UbH6DiTC";
  var LS = "diisoo_ielts_p1";
  var client = null;

  var EXAMS_SECOURS = [
    { code: "academic", nom: "IELTS Academic", objectif: "Études supérieures, certaines inscriptions professionnelles", competences: ["listening", "reading", "writing", "speaking"] },
    { code: "general", nom: "IELTS General Training", objectif: "Migration, travail, formation", competences: ["listening", "reading", "writing", "speaking"] },
    { code: "ukvi_academic", nom: "IELTS for UKVI Academic", objectif: "Justificatif linguistique pour certaines démarches UKVI", competences: ["listening", "reading", "writing", "speaking"] },
    { code: "ukvi_general", nom: "IELTS for UKVI General Training", objectif: "Justificatif linguistique pour certaines démarches UKVI", competences: ["listening", "reading", "writing", "speaking"] },
    { code: "life_skills_a1", nom: "IELTS Life Skills A1", objectif: "Certaines démarches familiales au Royaume-Uni", competences: ["listening", "speaking"], resultat: "pass_fail" },
    { code: "life_skills_a2", nom: "IELTS Life Skills A2", objectif: "Certaines démarches de prolongation familiale", competences: ["listening", "speaking"], resultat: "pass_fail" },
    { code: "life_skills_b1", nom: "IELTS Life Skills B1", objectif: "Certaines démarches de résidence permanente ou de citoyenneté", competences: ["listening", "speaking"], resultat: "pass_fail" }
  ];
  var OBJECTIFS_SECOURS = [
    { code: "etudier", libelle: "Étudier à l'étranger", exams: ["academic", "ukvi_academic"] },
    { code: "travailler", libelle: "Travailler à l'étranger", exams: ["general", "academic"] },
    { code: "immigration", libelle: "Préparer une demande d'immigration", exams: ["general", "ukvi_general"] },
    { code: "famille", libelle: "Préparer une démarche familiale", exams: ["life_skills_a1", "life_skills_a2", "life_skills_b1"] },
    { code: "certification", libelle: "Obtenir une certification linguistique", exams: ["academic", "general"] },
    { code: "general", libelle: "Améliorer mon anglais sans examen immédiat", exams: [] }
  ];
  var NOM_SKILL = { listening: "Écoute", reading: "Lecture", writing: "Écriture", speaking: "Oral", grammar: "Grammaire", vocabulary: "Vocabulaire" };

  var CSS =
    "#ie-ov{position:fixed;inset:0;z-index:99999;background:#0B0F1C;color:#F6F1E7;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:max(14px,env(safe-area-inset-top)) 14px max(24px,env(safe-area-inset-bottom));font-family:inherit}" +
    "#ie-ov .ie-w{max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:10px}" +
    "#ie-ov h2{font-size:20px;font-weight:800;margin:0}" +
    "#ie-ov p{margin:0;font-size:14px;line-height:1.45;color:#C9BFA8}" +
    "#ie-ov .ie-top{display:flex;align-items:center;justify-content:space-between;gap:8px}" +
    "#ie-ov button{font:inherit;color:inherit;text-align:left;border-radius:16px;border:1px solid #1E2740;background:#141A2B;padding:12px 14px;min-height:48px}" +
    "#ie-ov button:active{border-color:#E1693F}" +
    "#ie-ov .ie-x{min-height:40px;padding:8px 14px;text-align:center}" +
    "#ie-ov .ie-p{background:linear-gradient(135deg,#C2542D,#E1693F);border:0;font-weight:800;text-align:center}" +
    "#ie-ov .ie-p[disabled]{opacity:.45}" +
    "#ie-ov .ie-n{font-weight:800;font-size:15px}" +
    "#ie-ov .ie-s{font-size:12.5px;color:#A69C86;font-weight:500;margin-top:2px}" +
    "#ie-ov .ie-tag{display:inline-block;font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:2px 8px;border-radius:99px;background:#2A3454;color:#F0906B;margin-top:6px}" +
    "#ie-ov .ie-warn{border:1px solid #E1A93F;background:rgba(225,169,63,.1);border-radius:14px;padding:10px 12px;font-size:13px;color:#F3D9A0;line-height:1.45}" +
    "#ie-ov .ie-note{font-size:12px;color:#8C8064;line-height:1.4}" +
    "#ie-ov .ie-sel{border-color:#3FAE74!important;background:rgba(63,174,116,.12)!important}" +
    "#ie-ov .ie-ctx{background:#10251A;border-radius:12px;padding:10px 12px;font-size:14px;line-height:1.45;color:#E4DCC9}" +
    "#ie-ov .ie-bar{height:6px;border-radius:3px;background:#1E2740;overflow:hidden}#ie-ov .ie-bar>i{display:block;height:100%;background:#3FAE74}" +
    "#ie-ov .ie-row{display:flex;justify-content:space-between;gap:8px;font-size:14px}" +
    "#ie-ov .ie-ok{color:#5FC98F}#ie-ov .ie-ko{color:#F0906B}" +
    "#ie-btn{margin:8px 0}";

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function lire() { try { return JSON.parse(localStorage.getItem(LS) || "{}") || {}; } catch (e) { return {}; } }
  function ecrire(o) { try { localStorage.setItem(LS, JSON.stringify(o)); } catch (e) {} }

  function sb() {
    if (client) return client;
    if (window.supabase && window.supabase.createClient) { client = window.supabase.createClient(URL_SB, KEY_SB); return client; }
    return null;
  }
  function ref() { try { return localStorage.getItem("diisoo_whatsapp") || localStorage.getItem("diisoo_prenom") || null; } catch (e) { return null; } }

  var ov = null, w = null;
  function ouvrirEcran() {
    if (!document.getElementById("ie-style")) { var st = el("style"); st.id = "ie-style"; st.textContent = CSS; document.head.appendChild(st); }
    if (!ov) { ov = el("div"); ov.id = "ie-ov"; w = el("div", "ie-w"); ov.appendChild(w); document.body.appendChild(ov); }
    ov.style.display = "block"; ov.scrollTop = 0;
  }
  function fermer() { if (ov) ov.style.display = "none"; }
  function vider() { w.innerHTML = ""; if (ov) ov.scrollTop = 0; }
  function entete(titre, retour) {
    var t = el("div", "ie-top"); t.appendChild(el("h2", "", titre));
    var b = el("button", "ie-x", retour ? "← Retour" : "Fermer"); b.onclick = retour || fermer; t.appendChild(b); w.appendChild(t);
  }
  function bouton(cls, html, fn) { var b = el("button", cls, html); b.type = "button"; b.onclick = fn; return b; }

  /* ---------- données ---------- */
  function chargerCatalogue() {
    var c = sb();
    if (!c) return Promise.resolve({ exams: EXAMS_SECOURS, objectifs: OBJECTIFS_SECOURS });
    return Promise.all([
      c.from("ielts_exam_types").select("code,nom,objectif,competences,resultat,ordre").order("ordre"),
      c.from("ielts_goals").select("code,libelle,exams,ordre").order("ordre")
    ]).then(function (r) {
      var e = r[0].data, g = r[1].data;
      return { exams: e && e.length ? e : EXAMS_SECOURS, objectifs: g && g.length ? g : OBJECTIFS_SECOURS };
    }).catch(function () { return { exams: EXAMS_SECOURS, objectifs: OBJECTIFS_SECOURS }; });
  }

  /* ---------- écran 1 : accueil / catalogue ---------- */
  function accueil() {
    vider(); entete("IELTS : ton parcours");
    w.appendChild(el("p", "", "Choisis ton objectif, vois les examens possibles, puis fais un test de niveau."));
    var etat = lire();
    if (etat.niveau) {
      w.appendChild(bouton("", '<div class="ie-n">Ton niveau estimé : ' + esc(etat.niveau) + '</div><div class="ie-s">Estimation interne Diisoo. Refaire le test</div>', positionnement));
    }
    w.appendChild(bouton("ie-p", "1. Choisir mon objectif", objectifs));
    w.appendChild(bouton("", '<div class="ie-n">2. Voir les 7 examens</div><div class="ie-s">Academic, General Training, UKVI, Life Skills</div>', catalogue));
    w.appendChild(bouton("", '<div class="ie-n">3. Test de positionnement</div><div class="ie-s">12 questions, environ 5 minutes</div>', positionnement));
    if (window.DiisooIelts && window.DiisooIelts.entrainement) w.appendChild(bouton("", '<div class="ie-n">4. S\'entraîner : Écoute et Lecture</div><div class="ie-s">Exercices corrigés avec explications</div>', function () { window.DiisooIelts.entrainement(); }));
    w.appendChild(el("div", "ie-note", "Diisoo est un outil d'entraînement. Il ne délivre aucun score officiel IELTS. Les contenus sont créés par Diisoo : ce ne sont pas les sujets officiels."));
  }

  /* ---------- catalogue (R4, R6) ---------- */
  function catalogue(surligner) {
    vider(); entete("Les 7 examens", accueil);
    chargerCatalogue().then(function (d) {
      d.exams.forEach(function (x) {
        var ls = x.code.indexOf("life_skills") === 0;
        var b = el("div", "", "");
        b.style.cssText = "border:1px solid #1E2740;background:#141A2B;border-radius:16px;padding:12px 14px";
        if (surligner && surligner.indexOf(x.code) >= 0) b.style.borderColor = "#3FAE74";
        b.innerHTML = '<div class="ie-n">' + esc(x.nom) + '</div><div class="ie-s">' + esc(x.objectif) + "</div>" +
          '<div class="ie-s">Compétences : ' + (x.competences || []).map(function (k) { return NOM_SKILL[k] || k; }).join(", ") + "</div>" +
          '<span class="ie-tag">' + (ls ? "Test distinct : réussi ou non (pas de note 0 à 9)" : "Note de 0 à 9 pour le test officiel") + "</span>";
        w.appendChild(b);
      });
      w.appendChild(el("div", "ie-note", "UKVI est une version sécurisée d'Academic et de General Training. Life Skills est un test à part, limité à l'écoute et à l'oral."));
    });
  }

  /* ---------- objectif (R5) ---------- */
  function objectifs() {
    vider(); entete("Ton objectif", accueil);
    chargerCatalogue().then(function (d) {
      var etat = lire();
      d.objectifs.forEach(function (o) {
        var b = bouton(etat.objectif === o.code ? "ie-sel" : "", '<div class="ie-n">' + esc(o.libelle) + "</div>", function () {
          var e2 = lire(); e2.objectif = o.code; e2.exams = o.exams; ecrire(e2); resultatObjectif(o, d.exams);
        });
        w.appendChild(b);
      });
    });
  }
  function resultatObjectif(o, exams) {
    vider(); entete(o.libelle, objectifs);
    if (!o.exams.length) {
      w.appendChild(el("p", "", "Pas d'examen pour l'instant : on te propose un parcours d'anglais général par thèmes."));
    } else {
      w.appendChild(el("p", "", "Examens qui peuvent correspondre :"));
      o.exams.forEach(function (c) {
        var x = exams.filter(function (e) { return e.code === c; })[0]; if (!x) return;
        w.appendChild(el("div", "", '<div class="ie-n">' + esc(x.nom) + '</div><div class="ie-s">' + esc(x.objectif) + "</div>")).style.cssText = "border:1px solid #3FAE74;background:#141A2B;border-radius:16px;padding:12px 14px";
      });
    }
    w.appendChild(el("div", "ie-warn", "Aucun test n'est obligatoire pour toutes les demandes de visa. Vérifie toujours l'examen exigé auprès de l'organisme, de l'établissement ou de l'autorité concernée."));
    w.appendChild(bouton("ie-p", "Continuer : test de positionnement", positionnement));
  }

  /* ---------- positionnement (R2, R8) ---------- */
  var Q = [], REP = {}, IDX = 0;
  function positionnement() {
    vider(); entete("Test de positionnement", accueil);
    w.appendChild(el("p", "", "Chargement des questions…"));
    var c = sb();
    if (!c) { erreur("Connexion indisponible. Réessaie plus tard."); return; }
    c.rpc("ielts_questions_positionnement").then(function (r) {
      if (r.error || !r.data || !r.data.length) { erreur("Le test n'est pas encore disponible. Réessaie plus tard."); return; }
      Q = r.data; REP = {}; IDX = 0; question();
    }).catch(function () { erreur("Connexion impossible. Vérifie ton réseau."); });
  }
  function erreur(msg) { vider(); entete("Test de positionnement", accueil); w.appendChild(el("p", "", esc(msg))); w.appendChild(bouton("ie-p", "Réessayer", positionnement)); }
  function question() {
    vider(); entete("Question " + (IDX + 1) + " / " + Q.length, accueil);
    var bar = el("div", "ie-bar", "<i style='width:" + Math.round(IDX / Q.length * 100) + "%'></i>"); w.appendChild(bar);
    var q = Q[IDX];
    if (q.contexte) w.appendChild(el("div", "ie-ctx", esc(q.contexte)));
    w.appendChild(el("h2", "", esc(q.prompt)));
    var opts = Array.isArray(q.options) ? q.options : [];
    var choisi = REP[q.id];
    var suiv = bouton("ie-p", IDX === Q.length - 1 ? "Voir mon résultat" : "Suivant", function () { if (IDX === Q.length - 1) corriger(); else { IDX++; question(); } });
    suiv.disabled = choisi == null;
    opts.forEach(function (t, i) {
      w.appendChild(bouton(choisi === i ? "ie-sel" : "", esc(t), function () {
        REP[q.id] = i; Array.prototype.forEach.call(w.querySelectorAll("button"), function (b) { b.classList.remove("ie-sel"); });
        this.classList.add("ie-sel"); suiv.disabled = false;
      }));
    });
    w.appendChild(suiv);
  }
  function corriger() {
    vider(); entete("Résultat", accueil); w.appendChild(el("p", "", "Correction en cours…"));
    sb().rpc("ielts_corriger_positionnement", { p_reponses: REP, p_ref: ref() }).then(function (r) {
      if (r.error || !r.data) { erreur("La correction a échoué. Réessaie."); return; }
      resultat(r.data);
    }).catch(function () { erreur("Connexion impossible. Réessaie."); });
  }
  function resultat(d) {
    var e = lire(); e.niveau = d.niveau; e.date = new Date().toISOString().slice(0, 10); ecrire(e);
    vider(); entete("Ton résultat", accueil);
    w.appendChild(el("div", "", '<div class="ie-s">Niveau estimé</div><div style="font-size:40px;font-weight:900;color:#5FC98F">' + esc(d.niveau) + '</div><div class="ie-s">' + d.bons + " bonnes réponses sur " + d.total + "</div>")).style.cssText = "border:1px solid #3FAE74;background:#10251A;border-radius:16px;padding:12px 14px;text-align:center";
    w.appendChild(el("div", "ie-warn", "Estimation interne Diisoo, pas un résultat IELTS. Ce niveau ne donne aucune note IELTS et ne remplace pas l'examen officiel."));
    var lignes = Object.keys(d.par_skill || {}).map(function (k) {
      var s = d.par_skill[k]; return { k: k, p: s.total ? s.bons / s.total : 0, t: s.bons + "/" + s.total };
    }).sort(function (a, b) { return b.p - a.p; });
    var bloc = el("div", "", ""); bloc.style.cssText = "border:1px solid #1E2740;background:#141A2B;border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:6px";
    lignes.forEach(function (l) { bloc.appendChild(el("div", "ie-row", "<span>" + (NOM_SKILL[l.k] || l.k) + '</span><span class="' + (l.p >= .5 ? "ie-ok" : "ie-ko") + '">' + l.t + "</span>")); });
    w.appendChild(bloc);
    if (lignes.length) {
      w.appendChild(el("p", "", "<b>Point fort :</b> " + (NOM_SKILL[lignes[0].k] || lignes[0].k) + "<br><b>À travailler en priorité :</b> " + (NOM_SKILL[lignes[lignes.length - 1].k] || lignes[lignes.length - 1].k)));
    }
    w.appendChild(el("div", "ie-note", "Ce test couvre la grammaire, le vocabulaire et la lecture. L'écoute, l'écriture et l'oral seront évalués dans les prochaines phases."));
    var etat = lire();
    if (etat.exams && etat.exams.length) w.appendChild(bouton("ie-p", "Voir mes examens", function () { catalogue(etat.exams); }));
    else w.appendChild(bouton("ie-p", "Choisir mon objectif", objectifs));
    var fin = bouton("", "Terminer", fermer); fin.className = "ie-x"; w.appendChild(fin);
  }

  /* ---------- point d'entrée dans le hub Examens ---------- */
  function ajouterBouton() {
    var h = document.getElementById("xh-hub");
    if (!h || document.getElementById("ie-btn")) return;
    var st = document.getElementById("ie-style");
    if (!st) { st = el("style"); st.id = "ie-style"; st.textContent = CSS; document.head.appendChild(st); }
    var b = el("button", "xh-big", '<span class="xh-i">🇬🇧</span><span class="xh-n">IELTS : mon parcours<small>Objectif, examens, test de niveau</small></span>');
    b.id = "ie-btn"; b.type = "button"; b.onclick = function () { window.DiisooIelts.ouvrir(); };
    var grille = h.querySelector(".xh-g"); h.insertBefore(b, grille || null);
  }
  try {
    new MutationObserver(ajouterBouton).observe(document.documentElement, { childList: true, subtree: true });
    ajouterBouton();
  } catch (e) {}

  window.DiisooIelts = {
    ouvrir: function () { ouvrirEcran(); accueil(); }, fermer: fermer,
    ui: { vider: vider, entete: entete, bouton: bouton, el: el, esc: esc, sb: sb, ref: ref, accueil: accueil, racine: function () { return w; } }
  };
  try { if (new URLSearchParams(location.search).get("ielts") === "1") setTimeout(function () { window.DiisooIelts.ouvrir(); }, 800); } catch (e) {}
})();
