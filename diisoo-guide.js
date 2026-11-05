/* diisoo-guide.js v1 : guide vocal
   Un bouton sur l'accueil. La voix demande « Qu'est-ce que tu veux étudier ? », l'apprenant répond (français ou anglais),
   et l'app ouvre directement la leçon : plus de recherche, plus de défilement.
   Le navigateur exige un toucher avant le son et le micro : c'est ce bouton.
   Le wolof n'est pas reconnu par le micro : la question est dite en wolof, la réponse se donne en français ou en anglais. */
(function () {
  "use strict";
  if (window.DiisooVoixGuide) return;

  var $ = function (id) { return document.getElementById(id); };
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function has(t, words) {
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if ((" " + t + " ").indexOf(" " + w) >= 0) return true;   /* debut de mot : « agricult » trouve « agriculture » */
    }
    return false;
  }
  function pause(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function click(el) { try { el.click(); return true; } catch (e) { return false; } }

  /* ---------- ce que l'apprenant peut demander ---------- */
  var EXAMS = [
    ["ielts", ["ielts", "iels", "ielt", "aielts", "ailts", "eyelts", "visa", "life skills"]],
    ["toefl", ["toefl", "tofl", "tofel", "toeffle", "toffle"]],
    ["toeic", ["toeic", "toeik", "toique", "toik", "toeick"]],
    ["cambridge_a2", ["cambridge a2", "key", "a2"]],
    ["cambridge_b1", ["cambridge b1", "preliminary", "b1"]],
    ["duolingo", ["duolingo", "duo lingo"]],
    ["pte", ["pte", "pete", "pearson"]],
    ["business", ["simulateur", "entretien", "interview", "professionnel", "professional"]]
  ];
  var SECTEURS = {
    colobane: ["colobane", "piece", "mecanique", "auto", "voiture", "garage", "moto"],
    sandaga: ["sandaga", "mode", "beaute", "vetement", "coiffure", "cosmetique", "tissu"],
    electronique: ["electronique", "centenaire", "telephone", "ordinateur", "electro"],
    bazar: ["bazar", "meuble", "maison", "deco"],
    chine: ["chine", "logistique", "import", "guangzhou", "container", "conteneur", "fournisseur", "china"],
    tour_hotel: ["hotel", "hebergement", "reception", "chambre", "accueil"],
    tour_resto: ["restaurant", "serveur", "serveuse", "bar ", "cafe"],
    tour_guide: ["guide", "excursion", "visite", "circuit", "goree"],
    tour_transport: ["taxi", "location de voiture", "chauffeur"],
    tour_artisanat: ["artisan", "souvenir", "masque", "bijou"],
    tour_agence: ["agence", "billet", "reservation", "avion"],
    tour_plage: ["plage", "pirogue", "surf", "saly", "peche"],
    agriculture: ["agricult", "champ", "ferme", "legume", "fruit", "recolte", "farm"]
  };
  var THEMES_EN = {
    intro: ["presenter", "presentation", "introduire", "introduce", "myself", "salut", "bonjour", "hello"],
    family: ["njaboot", "famille", "family", "parent", "enfant"],
    work: ["liggeey", "travail", "travailler", "work", "routine", "job", "metier", "boulot"],
    market: ["xaalis", "njaay", "jaay", "achat", "acheter", "argent", "shopping", "market", "marche", "prix", "money", "price"],
    travel: ["tukki", "dem", "voyage", "voyager", "transport", "travel", "taxi", "bus", "avion"],
    health: ["wer", "wéral", "weral", "sante", "health", "docteur", "medecin", "hopital", "malade", "corps"],
    food: ["lekk", "ñam", "nam", "nourriture", "manger", "food", "restaurant", "cuisine", "repas"],
    time: ["temps", "heure", "time", "date", "jour", "calendrier"],
    visa: ["visa", "ambassade", "consulat", "embassy"],
    housing: ["ker", "dekk", "logement", "housing", "maison", "appartement", "louer", "house"]
  };
  var THEMES_WO = {
    salutations: ["salut", "salutation", "bonjour", "greet", "hello"],
    famille: ["famille", "family", "parent"],
    maison: ["maison", "quotidien", "daily", "house"],
    marche: ["marche", "argent", "acheter", "prix", "market", "money"],
    voyage: ["deplacement", "voyage", "transport", "travel", "taxi"],
    corps: ["corps", "sante", "health", "docteur", "body"],
    nourriture: ["nourriture", "manger", "food", "cuisine"],
    temps: ["temps", "nombre", "chiffre", "number", "time", "heure", "compter"],
    logement: ["logement", "housing", "louer", "appartement"]
  };
  var NIVEAU = [[3, ["avance", "expert", "difficile", "advanced"]], [2, ["intermediaire", "moyen", "intermediate"]], [1, ["debutant", "commenc", "zero", "base", "facile", "beginner"]]];

  function niveauDit(t) {
    for (var i = 0; i < NIVEAU.length; i++) if (has(t, NIVEAU[i][1])) return NIVEAU[i][0];
    return 0;
  }

  /* ---------- comprendre la réponse ---------- */
  function comprendre(texte) {
    var t = norm(texte);
    if (!t) return null;
    var out = { niv: niveauDit(t) };
    var i, k;
    for (i = 0; i < EXAMS.length; i++) if (has(t, EXAMS[i][1])) { out.type = "exam"; out.cle = EXAMS[i][0]; return out; }
    if (has(t, ["ekzamen", "examen", "exam", "test", "passer un", "certificat"])) { out.type = "exams"; return out; }
    if (has(t, ["turis", "tourisme", "touriste", "tourist", "tourism"])) { out.type = "business"; out.groupe = "tourisme"; out.cle = ""; for (k in SECTEURS) if (/^tour_/.test(k) && has(t, SECTEURS[k])) { out.cle = k; break; } return out; }
    var biz = has(t, ["business", "bisnes", "bizness", "njaay", "jaay", "affaire", "commerce", "vendre", "vente", "boutique", "commerçant", "commercant", "negoc"]);
    for (k in SECTEURS) if (has(t, SECTEURS[k])) { out.type = "business"; out.cle = k; return out; }
    if (biz) { out.type = "business"; return out; }
    var wolof = has(t, ["wolof", "wollof", "ouolof", "walaf", "wolo", "walof"]);
    if (wolof) {
      out.type = "wolof";
      for (k in THEMES_WO) if (has(t, THEMES_WO[k])) { out.cle = k; break; }
      return out;
    }
    for (k in THEMES_EN) if (has(t, THEMES_EN[k])) { out.type = "anglais"; out.cle = k; return out; }
    if (has(t, ["angale", "angalee", "angle", "anglais", "english", "angles", "langlais"])) { out.type = "anglais"; return out; }
    return null;
  }

  /* ---------- navigation : on réutilise les vrais boutons de l'app ---------- */
  function attendre(test, ms) {
    return new Promise(function (res) {
      var t0 = Date.now();
      (function boucle() {
        var r; try { r = test(); } catch (e) { r = null; }
        if (r) return res(r);
        if (Date.now() - t0 > ms) return res(null);
        setTimeout(boucle, 60);
      })();
    });
  }
  function ouvert(id) { var e = $(id); return e && !e.classList.contains("hidden"); }
  function debloque(key) { try { return tierState()[key].unlocked || 1; } catch (e) { return 1; } }

  function choisirNiveau(pickerId, voulu, max) {
    return attendre(function () { var p = $(pickerId); return p && p.querySelectorAll(".lvl-btn").length === 3 && p; }, 2500).then(function (p) {
      if (!p) return 0;
      var L = Math.max(1, Math.min(voulu || max, max, 3));
      click(p.querySelectorAll(".lvl-btn")[L - 1]);
      return L;
    });
  }

  function motsDe(txt) { return norm(txt).split(" ").filter(function (w) { return w.length > 3; }); }
  function boutonParTitre(box, titres) {
    var bs = Array.prototype.slice.call(box.querySelectorAll("button")).filter(function (b) { return b.offsetParent !== null || true; });
    for (var i = 0; i < titres.length; i++) {
      var n = norm(titres[i]);
      for (var j = 0; j < bs.length; j++) if (norm(bs[j].textContent).indexOf(n) >= 0) return bs[j];
    }
    return null;
  }

  function allerAnglais(r) {
    var G; try { G = GENERAL_THEMES; } catch (e) { G = []; }
    if (typeof openGeneralModule !== "function") return Promise.resolve(null);
    var un = debloque("general");
    openGeneralModule();
    return choisirNiveau("lvl-general", r.niv, un).then(function (L) {
      var box = $("general-tabs"); if (!box || !L) return null;
      var btns = Array.prototype.slice.call(box.children).filter(function (b) { return b.style.display !== "none"; });
      var cible = null;
      if (r.type === "tourisme") {
        cible = btns.filter(function (b) { return /🏝/.test(b.textContent) || /tour|touriste|hotel|goree|plage|excursion/.test(norm(b.textContent)); })[0];
      } else if (r.cle) {
        var th = G.filter(function (x) { return x.id === r.cle; })[0];
        if (th) cible = boutonParTitre(box, [th.title]);
        if (cible && cible.style.display === "none") cible = null;
      }
      var exact = !!cible;
      if (!cible) cible = btns.filter(function (b) { return !/🏝/.test(b.textContent); })[0] || btns[0];
      if (!cible) return null;
      click(cible);
      return { niveau: L, titre: cible.textContent.replace(/🏝️?/g, "").replace(/N[123]/g, "").trim(), exact: exact || (!r.cle && r.type !== "tourisme") };
    });
  }

  function allerWolof(r) {
    if (typeof openWolofModule !== "function") return Promise.resolve(null);
    var un = debloque("wolof");
    openWolofModule();
    return choisirNiveau("lvl-wolof", r.niv, un).then(function (L) {
      var box = $("wolof-tabs"); if (!box || !L) return null;
      var btns = Array.prototype.slice.call(box.children).filter(function (b) { return b.style.display !== "none"; });
      var cible = null, W; try { W = WOLOF_THEMES; } catch (e) { W = []; }
      if (r.cle) {
        var th = W.filter(function (x) { return x.id === r.cle; })[0];
        if (th) cible = btns.filter(function (b) { return norm(b.textContent) === norm(th.title); })[0];
      }
      var exact = !!cible;
      if (!cible) cible = btns[0];
      if (!cible) return null;
      click(cible);
      return { niveau: L, titre: cible.textContent.trim(), exact: exact || !r.cle };
    });
  }

  function allerBusiness(r) {
    if (typeof openBusinessModule !== "function") return Promise.resolve(null);
    openBusinessModule();
    return attendre(function () { var p = $("lvl-business"); return p && p.querySelectorAll(".lvl-btn").length === 3 && p; }, 2500).then(function (p) {
      if (!p) return null;
      var ouverts = Array.prototype.slice.call(p.querySelectorAll(".lvl-btn")).filter(function (b) { return !b.classList.contains("lock"); });
      var L = Math.max(1, Math.min(r.niv || ouverts.length, ouverts.length));
      click(p.querySelectorAll(".lvl-btn")[L - 1]);
      if (!r.cle && !r.groupe) return { niveau: L, titre: "Business", exact: true };
      return attendre(function () { var g = $("biz-grid"); return g && g.querySelectorAll("button").length && g; }, 2500).then(function (g0) {
        if (!g0) return { niveau: L, titre: "Business", exact: false };
        var tour = r.groupe === "tourisme" || /^tour_/.test(r.cle || "");
        if (!tour) return g0;
        var tb = g0.querySelector("button.bz-t"); if (tb) click(tb);
        if (!r.cle) return { niveau: L, titre: "Tourisme", exact: true, stop: true };
        return attendre(function () { var g = $("biz-grid"); return g && g !== g0 && g.querySelectorAll("button").length && g; }, 2500);
      }).then(function (g) {
        if (!g) return { niveau: L, titre: "Business", exact: false };
        if (g.stop) return g;
        var mod; try { mod = CHINA_TRADE_WOLOF[r.cle]; } catch (e) { mod = null; }
        var cible = null;
        if (mod && mod.title) {
          var mots = motsDe(mod.title);
          cible = Array.prototype.slice.call(g.querySelectorAll("button:not(.bz-m)")).filter(function (b) {
            var tb = norm(b.textContent); return mots.some(function (m) { return tb.indexOf(m) >= 0; });
          })[0];
        }
        if (!cible) cible = g.querySelector("button:not(.bz-m)");
        var exact = !!(cible && mod);
        if (cible) click(cible);
        return { niveau: L, titre: (mod && mod.title) || "Business", exact: exact };
      });
    });
  }

  function allerExam(r) {
    var X = window.DiisooExams2;
    if (!X || !X.ouvrir) return Promise.resolve(null);
    try { if (typeof startTestSimulation === "function") startTestSimulation(); } catch (e) {}
    return pause(150).then(function () {
      if (r.type === "exam") { X.ouvrir(r.cle); var ex; try { ex = X.registre().examens[r.cle]; } catch (e) {} return { titre: ex ? ex.court || ex.nom : "Examen", exact: true }; }
      return { titre: "Examens", exact: true };
    });
  }

  function aller(r) {
    if (r.type === "anglais" || r.type === "tourisme") return allerAnglais(r);
    if (r.type === "wolof") return allerWolof(r);
    if (r.type === "business") return allerBusiness(r);
    return allerExam(r);
  }

  /* ---------- interface ---------- */
  function css() {
    if ($("diisoo-guide-css")) return;
    var s = document.createElement("style"); s.id = "diisoo-guide-css";
    s.textContent =
      "#dg-open{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:12px 14px;border-radius:18px;border:1px solid #E1693F;" +
      "background:linear-gradient(135deg,#2a1a12,#1b1410);color:#F6F1E7;box-shadow:0 0 0 0 rgba(225,105,63,.5);animation:dgp 2.4s infinite}" +
      "#dg-open .dg-mic{flex:none;width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#F3A94E,#E1693F);display:flex;align-items:center;justify-content:center;font-size:22px}" +
      "#dg-open b{display:block;font-size:14px;line-height:1.2}#dg-open span.dg-s{display:block;font-size:11px;color:#C9BFA8;margin-top:2px}" +
      "@keyframes dgp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.45)}70%{box-shadow:0 0 0 12px rgba(225,105,63,0)}100%{box-shadow:0 0 0 0 rgba(225,105,63,0)}}" +
      "#dg-ov{position:fixed;inset:0;z-index:90;background:rgba(11,15,28,.97);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;color:#F6F1E7}" +
      "#dg-ov.hidden{display:none}" +
      "#dg-q{font-size:22px;font-weight:800;line-height:1.25;max-width:320px}" +
      "#dg-sub{font-size:13px;color:#A69C86;margin-top:8px;min-height:18px}" +
      "#dg-orb{width:96px;height:96px;border-radius:50%;margin:26px 0 14px;background:linear-gradient(135deg,#F3A94E,#E1693F);display:flex;align-items:center;justify-content:center;font-size:42px;transition:transform .2s}" +
      "#dg-orb.on{animation:dgo 1s infinite}@keyframes dgo{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(225,105,63,.5)}50%{transform:scale(1.08);box-shadow:0 0 0 18px rgba(225,105,63,0)}}" +
      "#dg-heard{font-size:16px;font-weight:700;color:#F3A94E;min-height:24px;max-width:320px}" +
      "#dg-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:18px;max-width:340px}" +
      "#dg-chips button{padding:9px 14px;border-radius:999px;background:#141A2B;border:1px solid #1E2740;color:#F6F1E7;font-size:13px;font-weight:700}" +
      "#dg-close{margin-top:22px;padding:10px 22px;border-radius:14px;background:transparent;border:1px solid #1E2740;color:#A69C86;font-size:13px}";
    document.head.appendChild(s);
  }

  var ov = null, jeton = 0, ecoute = null;

  function fermer() {
    jeton++;
    try { if (ecoute && ecoute.stop) ecoute.stop(); } catch (e) {}
    try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
    if (ov) ov.classList.add("hidden");
  }
  function maj(q, sub, heard, on) {
    if (!ov) return;
    $("dg-q").textContent = q; $("dg-sub").textContent = sub || "";
    $("dg-heard").textContent = heard || "";
    $("dg-orb").classList.toggle("on", !!on);
  }
  function dire(texte, lang) {
    try { if (typeof speak === "function") return Promise.resolve(speak(texte, lang)).catch(function () {}); } catch (e) {}
    return Promise.resolve();
  }

  function construire() {
    if (ov) return;
    ov = document.createElement("div"); ov.id = "dg-ov"; ov.className = "hidden";
    ov.innerHTML = '<div id="dg-q"></div><div id="dg-sub"></div><div id="dg-orb" role="button" aria-label="Parler">🎙️</div><div id="dg-heard"></div>' +
      '<div id="dg-chips"></div><button id="dg-close" type="button">Fermer</button>';
    document.body.appendChild(ov);
    $("dg-close").onclick = fermer;
    $("dg-orb").onclick = function () { demarrer(false); };
    var C = [["🇬🇧 Anglais", "anglais"], ["🇸🇳 Wolof", "wolof"], ["💼 Business", "business"], ["✈️ Examens", "examen"]];
    C.forEach(function (c) {
      var b = document.createElement("button"); b.type = "button"; b.textContent = c[0];
      b.onclick = function () { traiter(c[1], ++jeton); };
      $("dg-chips").appendChild(b);
    });
  }

  function traiter(texte, mon) {
    var r = comprendre(texte);
    if (!r) {
      maj("Je n'ai pas compris", "Dis : « anglais », « wolof », « business » ou « examens »", texte ? "« " + texte + " »" : "", false);
      return dire("Dégg ma ko ñaar yoon. Waxaat ko, angale, wolof, walla njaay.", "wo").then(function () { return null; });
    }
    maj("Waaw, ñu ngi ko ubbi...", "J'ouvre ta leçon", texte ? "« " + texte + " »" : "", false);
    return aller(r).then(function (res) {
      if (mon !== jeton) return;
      if (!res) { maj("Je n'ai pas pu ouvrir", "Choisis un thème ci-dessous", "", false); return; }
      fermer();
      try { if (typeof toast === "function") toast("🎙️ " + res.titre + (res.niveau ? " · niveau " + res.niveau : "")); } catch (e) {}
    });
  }

  function demarrer(premiere) {
    var mon = ++jeton;
    try { if (ecoute && ecoute.stop) ecoute.stop(); } catch (e) {}
    maj("Lan nga bëgg a jàng ?", "Qu'est-ce que tu veux étudier ? Dis : anglais, wolof, business ou examens", "", false);
    var suite = function () {
      if (mon !== jeton) return;
      maj("Je t'écoute...", "Parle maintenant", "", true);
      var langues = ["fr-FR", "en-US"], essai = 0;
      (function tour() {
        if (mon !== jeton) return;
        var p;
        try {
          p = startListening(langues[essai], 8000, false, function (t) { if (mon === jeton) $("dg-heard").textContent = "« " + t + " »"; });
        } catch (e) { p = null; }
        if (!p) { maj("Micro indisponible", "Touche un choix ci-dessous", "", false); return; }
        ecoute = { stop: p.stop };
        (p.promise || p).then(function (r) {
          if (mon !== jeton) return;
          var txt = r && r.text || "";
          if (r && (r.error === "not-allowed" || r.error === "service-not-allowed" || r.unsupported)) { maj("Micro indisponible", "Touche un choix ci-dessous", "", false); return; }
          if (txt && comprendre(txt)) { traiter(txt, mon); return; }
          if (essai < langues.length - 1) { essai++; tour(); return; }
          traiter(txt, mon);
          maj("Je n'ai pas compris", "Touche le micro pour réessayer, ou un choix ci-dessous", txt ? "« " + txt + " »" : "", false);
        });
      })();
    };
    if (premiere === false) { suite(); return; }
    /* Question dite en wolof, puis le micro s'ouvre */
    dire("Lan nga bëgg a jàng ?", "wo").then(suite);
  }

  function ouvrir() {
    css(); construire();
    ov.classList.remove("hidden");
    demarrer(true);
  }

  /* ---------- bouton sur l'accueil ---------- */
  function poser() {
    css();
    var dash = $("screen-dashboard");
    if (!dash || $("dg-open")) return !!$("dg-open");
    var tete = dash.children[0];
    if (!tete) return false;
    var b = document.createElement("button");
    b.type = "button"; b.id = "dg-open";
    b.innerHTML = '<span class="dg-mic">🎙️</span><span><b>Dis-moi ce que tu veux étudier</b><span class="dg-s">Touche, parle, et j\'ouvre la leçon</span></span>';
    b.onclick = ouvrir;
    tete.parentNode.insertBefore(b, tete.nextSibling);
    return true;
  }
  /* ---------- premier lancement : accueil chaleureux, une seule fois ---------- */
  var VU = "diisoo_guide_vu";
  function vu() { try { return localStorage.getItem(VU) === "1"; } catch (e) { return true; } }
  function marquerVu() { try { localStorage.setItem(VU, "1"); } catch (e) {} }
  function prenom() { try { var p = store.get("diisoo_profile"); return (p && p.first_name) || ""; } catch (e) { return ""; } }
  function bienvenue() {
    var dash = $("screen-dashboard");
    if (vu() || !dash || dash.classList.contains("hidden") || $("dg-welcome") || (ov && !ov.classList.contains("hidden"))) return;
    css();
    var w = document.createElement("div"); w.id = "dg-welcome"; w.setAttribute("role", "dialog"); w.setAttribute("aria-label", "Bienvenue");
    w.style.cssText = "position:fixed;left:12px;right:12px;bottom:14px;z-index:88;background:#141A2B;border:1px solid #E1693F;border-radius:20px;padding:16px;color:#F6F1E7;box-shadow:0 10px 40px rgba(0,0,0,.6)";
    var n = prenom();
    w.innerHTML = '<div style="font-size:17px;font-weight:800;line-height:1.25">👋 ' + (n ? "Bienvenue " + n.replace(/[<>&]/g, "") + " !" : "Bienvenue !") + '</div>' +
      '<div style="font-size:13px;color:#C9BFA8;margin-top:6px">Dis-moi ce que tu veux apprendre, et j\'ouvre ta leçon. Pas besoin de chercher.</div>' +
      '<button type="button" id="dg-w-go" style="width:100%;min-height:52px;margin-top:12px;border-radius:16px;border:0;background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;font-weight:800;font-size:15px">🎙️ Commencer avec la voix</button>' +
      '<button type="button" id="dg-w-no" style="width:100%;min-height:44px;margin-top:6px;border-radius:14px;border:0;background:transparent;color:#A69C86;font-size:13px">Je choisis moi-même</button>';
    document.body.appendChild(w);
    var ferme = function () { marquerVu(); w.remove(); };
    $("dg-w-go").onclick = function () { ferme(); ouvrir(); };
    $("dg-w-no").onclick = ferme;
  }
  setInterval(function () { try { bienvenue(); } catch (e) {} }, 1500);

  /* Si l'accueil est reconstruit par un autre script, le bouton revient */
  setInterval(function () { try { poser(); } catch (e) {} }, 1000);
  poser();

  window.DiisooVoixGuide = { version: 1, ouvrir: ouvrir, comprendre: comprendre, aller: aller };
})();
