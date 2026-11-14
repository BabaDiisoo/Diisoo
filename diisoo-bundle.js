/* diisoo-bundle.js : tous les scripts de Diisoo en un seul fichier (chargement plus rapide). Généré, ne pas modifier à la main. */
try{
/* ---- diisoo-secteurs.js ---- */
/* diisoo-secteurs.js
 * Chargeur des modules sectoriels (Colobane, Sandaga, Centenaire, Guangzhou).
 * Zero-Breaking Change : aucune clé existante n'est lue ni modifiée.
 * Clé propre : "diisoo_secteurs_v1" (localStorage). Aucun accès à IndexedDB.
 */
(function () {
  "use strict";

  var MODULES = [
    "diisoo-module-colobane.json",
    "diisoo-module-sandaga.json",
    "diisoo-module-centenaire.json",
    "diisoo-module-guangzhou.json",
    "diisoo-module-colobane-intermediaire.json",
    "diisoo-module-sandaga-intermediaire.json",
    "diisoo-module-centenaire-intermediaire.json",
    "diisoo-module-guangzhou-intermediaire.json"
  ];
  var KEY = "diisoo_secteurs_v1";
  var cache = {};

  function lireEtat() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { faits: {} }; }
    catch (e) { return { faits: {} }; }
  }

  function ecrireEtat(etat) {
    try { localStorage.setItem(KEY, JSON.stringify(etat)); } catch (e) {}
  }

  function charger(fichier) {
    return fetch(fichier, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error(fichier + " " + r.status);
        return r.json();
      })
      .then(function (m) { cache[m.id] = m; return m; })
      .catch(function () { return null; });
  }

  function chargerTout() {
    return Promise.all(MODULES.map(charger)).then(function (liste) {
      return liste.filter(Boolean);
    });
  }

  function liste() {
    var etat = lireEtat();
    return Object.keys(cache).map(function (id) {
      var m = cache[id];
      return {
        id: m.id,
        marche: m.marche,
        theme: m.theme,
        niveau: m.niveau,
        xp: m.xp,
        fait: !!etat.faits[id]
      };
    });
  }

  function obtenir(id) { return cache[id] || null; }

  /* Évaluation : reponses = tableau de textes choisis (3 questions).
   * Valide à 2 bonnes réponses sur 3. XP donné une seule fois par module. */
  function evaluer(id, reponses) {
    var m = cache[id];
    if (!m) return { ok: false, raison: "module introuvable" };
    var bonnes = 0;
    m.evaluation.forEach(function (q, i) {
      if (reponses[i] === q.reponse) bonnes++;
    });
    var reussi = bonnes >= 2;
    var etat = lireEtat();
    var xpGagne = 0;
    if (reussi && !etat.faits[id]) {
      etat.faits[id] = { date: new Date().toISOString(), score: bonnes };
      xpGagne = m.xp;
      ecrireEtat(etat);
      /* Brancher ici l'XP existant de Diisoo, par exemple : */
      /* if (window.validerExercice) window.validerExercice(id, xpGagne); */
      document.dispatchEvent(new CustomEvent("diisoo:secteur-valide", {
        detail: { id: id, xp: xpGagne, score: bonnes }
      }));
    }
    return { ok: true, reussi: reussi, bonnes: bonnes, xp: xpGagne, suivant: m.suivant };
  }

  window.DiisooSecteurs = {
    chargerTout: chargerTout,
    liste: liste,
    obtenir: obtenir,
    evaluer: evaluer
  };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-secteurs.js",e);}

try{
/* ---- diisoo-secteurs-ui.js ---- */
/* diisoo-secteurs-ui.js (v2)
 * Anglais des marches : meme apparence et meme logique que les autres secteurs Business
 * (un titre, un niveau, une carte a la fois, fleches et barre de progression).
 * Usage : DiisooSecteursUI.menu(conteneur) ; DiisooSecteursUI.ouvrir(id, conteneur)
 * Voix : window.diisooParler(texte, langue). Evaluation et XP : DiisooSecteurs (inchange).
 */
(function () {
  "use strict";

  var CSS = [
    ".mk{display:flex;flex-direction:column;gap:.5rem}",
    ".mk-h{font-size:.875rem;font-weight:700;color:#F6F1E7;text-align:center;margin:0}",
    ".mk-lvl{font-size:11px;font-weight:700;color:#C99CEA;padding-top:6px;margin:0}",
    ".mk-cap{font-size:10px;font-weight:700;color:#8C8064;text-transform:uppercase;letter-spacing:.06em;margin:0}",
    ".mk-nav{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;padding:2px 0}",
    ".mk-row{display:flex;align-items:center;justify-content:center;width:100%}",
    ".mk-arr{background:#141A2B;border:1px solid #1E2740;color:#C9BFA8;border-radius:9999px;width:34px;height:34px;font-size:16px;line-height:1;padding:0}",
    ".mk-rowlab{flex:1;text-align:center;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#8C8064}",
    ".mk-bar{width:100%;height:4px;border-radius:9999px;background:#1E2740;margin:6px 0 4px;overflow:hidden}",
    ".mk-fill{height:100%;background:#E1693F;border-radius:9999px;transition:width .25s}",
    ".mk-card{background:#141A2B;border:1px solid #1E2740;border-radius:.75rem;padding:.75rem;display:flex;flex-direction:column;gap:.25rem;animation:mkin .22s ease-out}",
    "@keyframes mkin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}",
    ".mk-en{font-size:.875rem;font-weight:600;color:#F6F1E7}",
    ".mk-big{font-size:1rem;font-weight:700;color:#F6F1E7;line-height:1.35}",
    ".mk-fr{font-size:.75rem;color:#A69C86}",
    ".mk-wo{font-size:.75rem;color:#5FC98F;font-style:italic}",
    ".mk-role{font-size:10px;font-weight:700;color:#C99CEA;text-transform:uppercase;letter-spacing:.06em}",
    ".mk-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-top:.25rem}",
    ".mk-b{background:#1E2740;color:#E4DCC9;border:0;border-radius:.5rem;padding:.5rem;font-size:11px;font-weight:600}",
    ".mk-b:active{background:#2A3454}",
    ".mk-go{width:100%;padding:.8rem;border-radius:.75rem;font-size:.85rem;font-weight:700;margin-top:.25rem}",
    ".mk-sec{width:100%;padding:.7rem;border-radius:.75rem;background:#141A2B;color:#A69C86;font-size:.75rem;font-weight:600;border:1px solid #1E2740}",
    ".mk-choix{display:block;width:100%;text-align:left;background:#1E2740;color:#F6F1E7;border:2px solid transparent;border-radius:.75rem;padding:.8rem;margin-top:.4rem;font-size:.85rem}",
    ".mk-choix:active{border-color:#E1693F}",
    ".mk-ok{color:#5FC98F}.mk-ko{color:#EE85A3}"
  ].join("");

  function injecterCSS() {
    if (document.getElementById("mk-css")) return;
    var s = document.createElement("style");
    s.id = "mk-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function parler(texte, langue) {
    if (typeof window.diisooParler === "function") { try { window.diisooParler(texte, langue || "en"); } catch (e) {} }
  }
  function emoji(en) {
    try { return (window.DiisooImages && window.DiisooImages.emojiFor(en)) || ""; } catch (e) { return ""; }
  }
  function boutons(en, wo) {
    var h = '<div class="mk-grid" style="' + (wo ? "" : "grid-template-columns:1fr") + '">';
    if (en) h += '<button type="button" class="mk-b" data-say="' + esc(en) + '" data-lang="en">🔊 English</button>';
    if (wo) h += '<button type="button" class="mk-b" data-say="' + esc(wo) + '" data-lang="wo">🔊 Wolof</button>';
    return h + "</div>";
  }
  function lier(racine) {
    var b = racine.querySelectorAll("[data-say]");
    for (var i = 0; i < b.length; i++) b[i].addEventListener("click", function () { parler(this.getAttribute("data-say"), this.getAttribute("data-lang")); });
  }
  function nav(lab, pct) {
    return '<div class="mk-nav"><div class="mk-row"><button type="button" class="mk-arr" data-d="-1" aria-label="Precedent">‹</button>' +
      '<div class="mk-rowlab">' + esc(lab) + '</div><button type="button" class="mk-arr" data-d="1" aria-label="Suivant">›</button></div>' +
      '<div class="mk-bar"><div class="mk-fill" style="width:' + pct + '%"></div></div></div>';
  }
  var ORDRE_MARCHE = { colobane: 0, sandaga: 1, centenaire: 2, guangzhou: 3 };
  function niveauLabel(n) { return n === "intermediaire" ? "📈 Intermédiaire" : "🌱 Débutant"; }

  function menu(conteneur) {
    injecterCSS();
    var liste = window.DiisooSecteurs.liste().slice().sort(function (a, b) {
      var na = a.niveau === "intermediaire" ? 1 : 0, nb = b.niveau === "intermediaire" ? 1 : 0;
      if (na !== nb) return na - nb;
      return (ORDRE_MARCHE[String(a.marche).toLowerCase().split(" ")[0]] || 0) - (ORDRE_MARCHE[String(b.marche).toLowerCase().split(" ")[0]] || 0);
    });
    if (!liste.length) { conteneur.innerHTML = '<p class="mk-fr" style="text-align:center">Modules indisponibles pour le moment.</p>'; return; }
    var cur = 0;
    for (var i = 0; i < liste.length; i++) { if (!liste[i].fait) { cur = i; break; } }
    function rendre() {
      var m = liste[cur];
      conteneur.innerHTML = '<div class="mk"><h4 class="mk-h">🛒 Anglais des marchés</h4>' +
        nav("Module " + (cur + 1) + " sur " + liste.length, Math.round((cur + 1) / liste.length * 100)) +
        '<p class="mk-lvl">' + niveauLabel(m.niveau) + "</p>" +
        '<div class="mk-card"><p class="mk-en">' + esc(m.marche) + '</p><p class="mk-fr">' + esc(m.theme) + "</p>" +
        '<p class="mk-wo" style="font-style:normal">' + (m.fait ? "✅ Terminé" : "+" + m.xp + " XP") + "</p>" +
        '<button type="button" class="mk-go btn-primary" id="mk-start">' + (m.fait ? "Refaire ▶" : "Commencer ▶") + "</button></div></div>";
      var arr = conteneur.querySelectorAll(".mk-arr");
      for (var k = 0; k < arr.length; k++) arr[k].addEventListener("click", function () {
        var n = cur + parseInt(this.getAttribute("data-d"), 10);
        if (n >= 0 && n < liste.length) { cur = n; rendre(); }
      });
      conteneur.querySelector("#mk-start").addEventListener("click", function () { ouvrir(liste[cur].id, conteneur); });
    }
    rendre();
  }

  function ouvrir(id, conteneur) {
    injecterCSS();
    var m = window.DiisooSecteurs.obtenir(id);
    if (!m) { conteneur.innerHTML = '<p class="mk-fr">Module introuvable.</p>'; return; }
    var cartes = [];
    cartes.push({ t: "accroche", cap: "Pour commencer", en: m.accroche.en, fr: m.accroche.fr });
    (m.vocabulaire || []).forEach(function (v) { cartes.push({ t: "voc", cap: "Vocabulaire à écouter et répéter", en: v.en, fr: v.fr }); });
    (m.pont_wolof || []).forEach(function (p) { cartes.push({ t: "pont", cap: "En wolof, sur le marché", en: p.en, wo: p.wo }); });
    (m.dialogue || []).forEach(function (d) { cartes.push({ t: "dlg", cap: "Dialogue", role: d.role, en: d.en, fr: d.fr }); });
    (m.pratique_micro || []).forEach(function (p) { cartes.push({ t: "prat", cap: "Répète 3 fois à voix haute", en: p }); });
    if (m.defi) cartes.push({ t: "defi", cap: "Défi", en: m.defi.en, fr: m.defi.fr });
    var nq = (m.evaluation || []).length;
    (m.evaluation || []).forEach(function (q, i) { cartes.push({ t: "quiz", cap: "Question " + (i + 1) + " sur " + nq, q: q }); });
    var pos = 0, reponses = [];

    function entete() {
      return '<h4 class="mk-h">🛒 ' + esc(m.marche) + " · " + esc(m.theme) + "</h4>" +
        nav(pos < cartes.length ? "Étape " + (pos + 1) + " sur " + cartes.length : "Résultat", Math.round((Math.min(pos + 1, cartes.length)) / cartes.length * 100)) +
        '<p class="mk-lvl">' + niveauLabel(m.niveau) + "</p>";
    }
    function lierNav() {
      var arr = conteneur.querySelectorAll(".mk-arr");
      for (var k = 0; k < arr.length; k++) arr[k].addEventListener("click", function () {
        var n = pos + parseInt(this.getAttribute("data-d"), 10);
        var maxLibre = cartes.length - nq;   // les questions ne se sautent pas
        if (n >= 0 && n <= Math.max(maxLibre, 0) && n < cartes.length) { pos = n; rendre(); }
      });
    }
    function retour() {
      return '<button type="button" class="mk-sec" id="mk-back">⬅️ Retour aux marchés</button>';
    }
    function rendre() {
      var c = cartes[pos], h = '<div class="mk">' + entete();
      var em = c.en ? emoji(c.en) : "";
      if (c.t === "quiz") {
        h += '<p class="mk-cap">' + esc(c.cap) + '</p><div class="mk-card"><p class="mk-big">' + esc(c.q.q) + "</p>";
        c.q.choix.forEach(function (x) { h += '<button type="button" class="mk-choix" data-c="' + esc(x) + '">' + esc(x) + "</button>"; });
        h += "</div>";
      } else {
        h += '<p class="mk-cap">' + esc(c.cap) + "</p>";
        h += '<div class="mk-card' + (em ? " fx-em" : "") + '"' + (em ? ' data-em="' + em + '"' : "") + ">";
        if (c.role) h += '<p class="mk-role">' + (/vend|march/i.test(c.role) ? "🧑‍💼 " : "🛍️ ") + esc(c.role) + "</p>";
        h += '<p class="' + (c.t === "accroche" || c.t === "defi" || c.t === "prat" ? "mk-big" : "mk-en") + '">' + esc(c.en) + "</p>";
        if (c.fr) h += '<p class="mk-fr">' + esc(c.fr) + "</p>";
        if (c.wo) h += '<p class="mk-wo">🗣️ ' + esc(c.wo) + "</p>";
        if (c.t !== "defi") h += boutons(c.en, c.wo);
        var dernier = pos === cartes.length - nq - 1;
        h += '<button type="button" class="mk-go btn-primary" id="mk-next">' + (dernier && nq ? "Passer aux questions ▶" : "Suivant ▶") + "</button></div>";
      }
      h += retour() + "</div>";
      conteneur.innerHTML = h;
      lier(conteneur); lierNav();
      conteneur.querySelector("#mk-back").addEventListener("click", function () { menu(conteneur); });
      var n = conteneur.querySelector("#mk-next");
      if (n) n.addEventListener("click", function () { if (pos < cartes.length - 1) { pos++; rendre(); } });
      var ch = conteneur.querySelectorAll(".mk-choix");
      for (var i = 0; i < ch.length; i++) ch[i].addEventListener("click", function () {
        reponses[pos - (cartes.length - nq)] = this.getAttribute("data-c");
        if (pos < cartes.length - 1) { pos++; rendre(); } else fin();
      });
    }
    function fin() {
      var r = window.DiisooSecteurs.evaluer(id, reponses);
      var h = '<div class="mk"><h4 class="mk-h">🛒 ' + esc(m.marche) + " · " + esc(m.theme) + "</h4>";
      h += '<div class="mk-card"><p class="mk-big ' + (r.reussi ? "mk-ok" : "mk-ko") + '">' + (r.reussi ? "Bravo ! " : "Presque. ") + r.bonnes + "/" + nq + "</p>";
      if (r.xp) h += '<p class="mk-wo" style="font-style:normal">+' + r.xp + " XP</p>";
      h += '<p class="mk-fr">' + esc(r.reussi ? m.recap : "Il faut 2 bonnes réponses sur 3. Réessaie.") + "</p></div>";
      h += '<button type="button" class="mk-go btn-primary" id="mk-fin">' + (r.reussi && r.suivant ? "Marché suivant ▶" : "Retour aux marchés") + "</button>";
      if (!r.reussi) h += '<button type="button" class="mk-sec" id="mk-retry">Réessayer</button>';
      h += "</div>";
      conteneur.innerHTML = h;
      conteneur.querySelector("#mk-fin").addEventListener("click", function () {
        if (r.reussi && r.suivant && window.DiisooSecteurs.obtenir(r.suivant)) ouvrir(r.suivant, conteneur); else menu(conteneur);
      });
      var rt = conteneur.querySelector("#mk-retry");
      if (rt) rt.addEventListener("click", function () { reponses = []; pos = cartes.length - nq; rendre(); });
    }
    rendre();
  }

  window.DiisooSecteursUI = { menu: menu, ouvrir: ouvrir };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-secteurs-ui.js",e);}

try{
/* ---- diisoo-secteurs-init.js ---- */
/* diisoo-secteurs-init.js
 * Branche les modules sectoriels dans l'écran Outils Business, sans rien modifier d'autre.
 * Ajoute un bouton "Anglais des marchés" au-dessus de la liste des secteurs.
 * Relie la voix (speak) et l'XP (addXP) existants. Aucune clé localStorage existante touchée.
 */
(function () {
    "use strict";

    /* Pont voix : utilise le moteur existant (Oolel pour le wolof, TTS pour l'anglais) */
    window.diisooParler = function (texte, langue) {
        try { return speak(texte, langue === "wo" ? "wo" : "en-US", 0.9); }
        catch (e) { console.error("Erreur voix secteurs :", e); }
    };

    /* Pont XP : une seule fois par module (géré dans DiisooSecteurs.evaluer) */
    document.addEventListener("diisoo:secteur-valide", function (ev) {
        try { addXP(ev.detail.xp); bumpDailyGoal(1); }
        catch (e) { console.error("Erreur XP secteurs :", e); }
    });

    function el(id) { return document.getElementById(id); }

    function reinitialiser() {
        var vue = el("secteurs-vue"), ouvrir = el("secteurs-ouvrir"), retour = el("secteurs-retour");
        if (vue) { vue.classList.add("hidden"); vue.innerHTML = ""; }
        if (ouvrir) ouvrir.classList.remove("hidden");
        if (retour) retour.classList.add("hidden");
    }

    function injecter() {
        var picker = el("business-picker");
        if (!picker || el("secteurs-zone")) { reinitialiser(); return; }

        var z = document.createElement("div");
        z.id = "secteurs-zone";
        z.className = "space-y-2";
        z.innerHTML =
            '<button type="button" id="secteurs-ouvrir" class="w-full text-left p-4 rounded-2xl shadow-md" ' +
                'style="background:linear-gradient(135deg,#2A1A14,#141A2B);border:1px solid #E1693F">' +
                '<span class="text-2xl">🛒</span>' +
                '<h4 class="text-sm font-bold text-[#F6F1E7] mt-1">Anglais des marchés</h4>' +
                '<p class="text-[11px] text-[#A69C86]">Colobane, Sandaga, Centenaire, Guangzhou : 4 minutes par module, +30 XP.</p>' +
            '</button>' +
            '<button type="button" id="secteurs-retour" class="hidden w-full py-3 bg-[#141A2B] text-[#A69C86] rounded-xl text-xs font-semibold">⬅️ Retour aux secteurs</button>' +
            '<div id="secteurs-vue" class="hidden"></div>';
        picker.parentNode.insertBefore(z, picker);

        el("secteurs-ouvrir").onclick = function () {
            window.DiisooSecteurs.chargerTout().then(function (liste) {
                if (!liste.length) { toast("Modules indisponibles pour le moment"); return; }
                picker.classList.add("hidden");
                var contenu = el("business-content");
                if (contenu) contenu.classList.add("hidden");
                el("secteurs-ouvrir").classList.add("hidden");
                el("secteurs-retour").classList.remove("hidden");
                var vue = el("secteurs-vue");
                vue.classList.remove("hidden");
                window.DiisooSecteursUI.menu(vue);
            });
        };
        el("secteurs-retour").onclick = function () {
            stopAllAudio();
            openBusinessModule();
        };
    }

    /* On enveloppe openBusinessModule : l'original s'exécute en premier, puis on ajoute le bouton */
    var _ouvrir = window.openBusinessModule;
    if (typeof _ouvrir === "function") {
        window.openBusinessModule = function () {
            var r = _ouvrir.apply(this, arguments);
            try { injecter(); } catch (e) { console.error(e); }
            return r;
        };
    }
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-secteurs-init.js",e);}

try{
/* ---- diisoo-pron.js ---- */
/* diisoo-pron.js
 * Affiche la prononciation (phonetique pour francophones) sous les phrases wolof.
 * Fichier autonome : une seule ligne dans index.html : <script src="diisoo-pron.js" defer></script>
 * Ne modifie aucun texte existant, ajoute seulement une ligne grise sous la phrase wolof.
 * Source : relecture-wolof-diisoo-3000-avec-prononciation.xlsx (prelecture, a faire valider par un locuteur natif).
 */
(function () {
  "use strict";
  var PRON = {"Jërëjëf":"Djeureudjeuf","Ba ëllëg":"Ba eulleug","Fanaanal jàmm":"Fanaanal djàmm","Maa ngi fi rekk, jërëjëf":"Maa ngi fi rekk, djeureudjeuf","Njaboot":"Ndjaboot","Am naa njaboot bu réy":"Am naa ndjaboot bu réy","Sama yaay mi ngi ci kër gi":"Sama yaay mi ngi tchi keur gi","Bëgg naa sama doom yi":"Beugg naa sama doom yi","Ñaata doom nga am ?":"Gnaata doom nga am ?","Ndax am nga rakk ?":"Ndakh am nga rakk ?","Kër":"Keur","Dëkkandoo":"Deukkandoo","Ndox":"Ndokh","Xarit":"Kharit","Ñam":"Gnam","Maa ngi dem kër":"Maa ngi dem keur","Soxla naa ndox":"Sokhla naa ndokh","Foo dëkk ?":"Foo deukk ?","Maa ngi liggéey ci butik":"Maa ngi liggéey tchi butik","Xaalis":"Khaalis","Njëg":"Ndjeug","Ñaata la ?":"Gnaata la ?","Jënd":"Djeund","Jaay":"Djaay","Wàññi njëg li, su la neexee":"Wàgngni ndjeug li, su la neekhee","Bëgg naa jënd ceeb":"Beugg naa djeund tcheeb","Amuma xaalis léegi":"Amuma khaalis léegi","Wàññi ko tuuti":"Wàgngni ko tuuti","Ñëw":"Gneuw","Jege":"Djege","Foo jëm ?":"Foo djeum ?","Marse bi jege na fi":"Marse bi djege na fi","Kaay fi, su la neexee":"Kaay fi, su la neekhee","Fan la kaar bi jóge ?":"Fan la kaar bi djóge ?","Loxo":"Lokho","Faju":"Fadju","Soxla naa gis doktoor":"Sokhla naa gis doktoor","Dama gën a baax léegi":"Dama geun a baakh léegi","Ceeb":"Tcheeb","Jën":"Djeun","Neex":"Neekh","Dama xiif":"Dama khiif","Ñam bi neex na":"Gnam bi neekh na","Bëgg naa lekk ceeb ak jën":"Beugg naa lekk tcheeb ak djeun","Ndox mi":"Ndokh mi","Ñaar":"Gnaar","Ñett":"Gnett","Ëllëg":"Eulleug","Ban waxtu la ?":"Ban wakhtu la ?","Dinaa ñëw ëllëg":"Dinaa gneuw eulleug","Ñaata nit ñoo fi nekk ?":"Gnaata nit gnoo fi nekk ?","Maa ngi wut kër":"Maa ngi wut keur","Ñaata la loyer bi ?":"Gnaata la loyer bi ?","Boroom kër":"Boroom keur","Ndax mën naa xool kër gi ?":"Ndakh meun naa khool keur gi ?","Kuraŋ bi du liggéey":"Kurang bi du liggéey","Gox bi dafa dal":"Gokh bi dafa dal","Dama war a sinye kontra kër gi":"Dama war a sinye kontra keur gi","Jaaykat":"Djaaykat","Jëndkat":"Djeundkat","Xar":"Khar","Bëy":"Beuy","Senegaal laa jóge":"Senegaal laa djóge","Neex na ma xam la":"Neekh na ma kham la","Ñaata at nga am ?":"Gnaata at nga am ?","Maa ngi dëkk Cees":"Maa ngi deukk Tchees","Damay wax angale ak farañse":"Damay wakh angale ak faragnse","Mën nga wax sa tur araf ci araf ?":"Meun nga wakh sa tur araf tchi araf ?","F-A-T-O-U (araf ci araf)":"F-A-T-O-U (araf tchi araf)","Maa ngi tudd Fatou. Neex na ma xam la.":"Maa ngi tudd Fatou. Neekh na ma kham la.","Neex na ma it. Fu nga jóge ?":"Neekh na ma it. Fu nga djóge ?","Thiès laa jóge, ci Senegaal.":"Thiès laa djóge, tchi Senegaal.","Mag bu jigéen (grande sœur) / Rakk bu jigéen (petite sœur)":"Mag bu djigéen (grande sœur) / Rakk bu djigéen (petite sœur)","Am naa ñett doom":"Am naa gnett doom","Sama yaay dafay dëkk ak nun":"Sama yaay dafay deukk ak nun","Danuy lekk ànd ci ngoon, bés bu nekk":"Danuy lekk ànd tchi ngoon, bés bu nekk","Sama baay chauffeur la":"Sama baay tchhauffeur la","Dama bëgg sama njaboot lool":"Dama beugg sama ndjaboot lool","Kan moo gëna mag ci sa njaboot ?":"Kan moo geuna mag tchi sa ndjaboot ?","Sama maam bu jigéen moo gëna mag":"Sama maam bu djigéen moo geuna mag","Ndax am nga njaboot bu mag ?":"Ndakh am nga ndjaboot bu mag ?","Waaw, am naa ñaar rakk bu góor ak benn rakk bu jigéen.":"Waaw, am naa gnaar rakk bu góor ak benn rakk bu djigéen.","Ndax dangeen dëkk ànd ?":"Ndakh dangeen deukk ànd ?","Waaw, danuy dëkk ci benn kër ak sunu waajur.":"Waaw, danuy deukk tchi benn keur ak sunu waadjur.","Sama maam bu jigéen ; am na juróom ñaar fukk ak juróom ñett at.":"Sama maam bu djigéen ; am na djuróom gnaar fukk ak djuróom gnett at.","Xarit ci liggéey":"Kharit tchi liggéey","Damay tàmbali liggéey ci juróom ñett":"Damay tàmbali liggéey tchi djuróom gnett","Damay noppi liggéey ci juróom":"Damay noppi liggéey tchi djuróom","Damay liggéey ci bureau bi":"Damay liggéey tchi bureau bi","Sama liggéey dafa sonn waaye dafay neex ma":"Sama liggéey dafa sonn waaye dafay neekh ma","Dama bëgg dimbali kiliyaan yi":"Dama beugg dimbali kiliyaan yi","Damay noppalu tuuti ci digg-bëccëg":"Damay noppalu tuuti tchi digg-beutchtcheug","Damay liggéey ci butik bi bés bu nekk.":"Damay liggéey tchi butik bi bés bu nekk.","Ci ban waxtu nga tàmbali liggéey ?":"Tchi ban wakhtu nga tàmbali liggéey ?","Damay tàmbali ci juróom ñett te noppi ci juróom benn.":"Damay tàmbali tchi djuróom gnett te noppi tchi djuróom benn.","Lan nga bëgg ci sa liggéey ?":"Lan nga beugg tchi sa liggéey ?","Dama bëgg dimbali kiliyaan yi bés bu nekk.":"Dama beugg dimbali kiliyaan yi bés bu nekk.","Mën nga wàññi njëg li ?":"Meun nga wàgngni ndjeug li ?","Dama bëgg jënd ceeb":"Dama beugg djeund tcheeb","Ndax nangu ngeen Wave ak Orange Money ?":"Ndakh nangu ngeen Wave ak Orange Money ?","Ñaata la tamaate yi ?":"Gnaata la tamaate yi ?","Mën nga ma wàññil ci njëg li ?":"Meun nga ma wàgngnil tchi ndjeug li ?","Ñaata la sac bi ?":"Gnaata la satch bi ?","Juróom junni franc la.":"Djuróom djunni frantch la.","Dafa seer lool. Mën nga wàññi njëg li ?":"Dafa seer lool. Meun nga wàgngni ndjeug li ?","Waaw, ñeent junni franc ngir yaw.":"Waaw, gneent djunni frantch ngir yaw.","Jërëjëf, dinaa jël ñaar.":"Djeureudjeuf, dinaa djeul gnaar.","Dama bëgg reserve benn bilee":"Dama beugg reserve benn bilee","Ci ban waxtu la bus bi di dem ?":"Tchi ban wakhtu la bus bi di dem ?","Ana arre bu gëna jege ?":"Ana arre bu geuna djege ?","Maa ngi tukki ngir gis sama njaboot":"Maa ngi tukki ngir gis sama ndjaboot","Ndax war naa am visa ngir réew mii ?":"Ndakh war naa am visa ngir réew mii ?","Damay jël bus bi suba su nekk":"Damay djeul bus bi suba su nekk","Fukki minut la ci taksi bu jóge fii.":"Fukki minut la tchi taksi bu djóge fii.","Ci ban waxtu la sama tukki avion di dem ?":"Tchi ban wakhtu la sama tukki avion di dem ?","Sa tukki avion bi dafay dem ci juróom ñett ci suba.":"Sa tukki avion bi dafay dem tchi djuróom gnett tchi suba.","Damay jël bus bi suba su nekk.":"Damay djeul bus bi suba su nekk.","Ana opitaal bu gëna jege ?":"Ana opitaal bu geuna djege ?","Dama gën a baax tey":"Dama geun a baakh tey","Wool ambilaas bi, su la neexee":"Wool ambilaas bi, su la neekhee","Naanal benn comprimé ñaari yoon ci bés bi":"Naanal benn tchomprimé gnaari yoon tchi bés bi","Kañ nga tàmbali feebar ?":"Kagn nga tàmbali feebar ?","Yaa ngi ci jàmm ?":"Yaa ngi tchi djàmm ?","Démb ci ngoon.":"Démb tchi ngoon.","Dafa neex lool":"Dafa neekh lool","Xiif na ma":"Khiif na ma","Dama bëgg ceeb ak jën":"Dama beugg tcheeb ak djeun","Lekk bii dafa neex lool":"Lekk bii dafa neekh lool","Mën naa am addition bi, su la neexee ?":"Meun naa am addition bi, su la neekhee ?","Ban lekk nga gëna bëgg ?":"Ban lekk nga geuna beugg ?","Dama bëgg ceebu jën":"Dama beugg tcheebu djeun","Mën naa am menu bi, su la neexee ?":"Meun naa am menu bi, su la neekhee ?","Waaw, jël ko.":"Waaw, djeul ko.","Jën wu ñu def ak ceeb neex na lool tey.":"Djeun wu gnu def ak tcheeb neekh na lool tey.","Lan nga bëgg a naan ?":"Lan nga beugg a naan ?","Ndox rekk, su la neexee.":"Ndokh rekk, su la neekhee.","Waxtu":"Wakhtu","Ban waxtu la léegi ?":"Ban wakhtu la léegi ?","Dinaa la gis ëllëg ci suba":"Dinaa la gis eulleug tchi suba","Ndaje mi dafay tàmbali ci fukk":"Ndadje mi dafay tàmbali tchi fukk","Ñaata nit ñu ngi ñëw ?":"Gnaata nit gnu ngi gneuw ?","Ci ban waxtu nga di jóg ?":"Tchi ban wakhtu nga di djóg ?","Damay jóg ci juróom benn suba su nekk":"Damay djóg tchi djuróom benn suba su nekk","Ñett waxtu la.":"Gnett wakhtu la.","Ci ban waxtu la ndaje mi di tàmbali ?":"Tchi ban wakhtu la ndadje mi di tàmbali ?","Dafay tàmbali ëllëg ci fukk.":"Dafay tàmbali eulleug tchi fukk.","Damay jóg ci juróom benn suba su nekk.":"Damay djóg tchi djuróom benn suba su nekk.","Ñaan visa":"Gnaan visa","Maa ngi dem gis sama njaboot":"Maa ngi dem gis sama ndjaboot","Ñaata bés ngay toog ?":"Gnaata bés ngay toog ?","Dinaa toog ñaari ayubés":"Dinaa toog gnaari ayubés","Ndax am nga bérab bu nga di nelaw bu nga reserve ?":"Ndakh am nga bérab bu nga di nelaw bu nga reserve ?","Lan moo tax nga di tukki ?":"Lan moo takh nga di tukki ?","Maa ngi dem gis sama njaboot ñaari ayubés.":"Maa ngi dem gis sama ndjaboot gnaari ayubés.","Ndax am nga bilee bu délsi ?":"Ndakh am nga bilee bu délsi ?","Ndax caution bi mu ngi ci ?":"Ndakh tchaution bi mu ngi tchi ?","Boroom kër gi":"Boroom keur gi","Mën naa gis kër gi ?":"Meun naa gis keur gi ?","Ñaata pièce la am ?":"Gnaata piètche la am ?","Ñaata la loyer apartema bii ?":"Gnaata la loyer apartema bii ?","Juróom fukk junni franc la, ak caution bi.":"Djuróom fukk djunni frantch la, ak tchaution bi.","Mën naa gis balaa may tànn ?":"Meun naa gis balaa may tànn ?","Waaw, dëgg la, ñëwal ëllëg ci suba.":"Waaw, deugg la, gneuwal eulleug tchi suba.","Semences yi":"Sementches yi","Dama soxla semences ngir sama tool":"Dama sokhla sementches ngir sama tool","Ñaata la benn saaku engrais ?":"Gnaata la benn saaku engrais ?","Ndax semences yii dañuy sax bu baax ci nawet ?":"Ndakh sementches yii dagnuy sakh bu baakh tchi nawet ?","Damay sotti ndox ci sama gàncax yi suba su nekk":"Damay sotti ndokh tchi sama gàntchakh yi suba su nekk","Ngóob mi baax na at mii":"Ngóob mi baakh na at mii","Damay jaay sama légumes ci marse bu Thiès":"Damay djaay sama légumes tchi marse bu Thiès","Mën nga ko yóbbu ci sama tool ?":"Meun nga ko yóbbu tchi sama tool ?","Salaam aleekum. Dama soxla semences ngir sama tool.":"Salaam aleekum. Dama sokhla sementches ngir sama tool.","Lan nga bëgg a ji ?":"Lan nga beugg a dji ?","Semences yii baax nañu ci nawet.":"Sementches yii baakh nagnu tchi nawet.","Ñaata la saaku bu ndaw ?":"Gnaata la saaku bu ndaw ?","Ñaari junni ak juróom téeméer franc.":"Gnaari djunni ak djuróom téeméer frantch.","Ndax am ngeen engrais itam ?":"Ndakh am ngeen engrais itam ?","Waaw, fukki junni franc ngir saaku bu mag.":"Waaw, fukki djunni frantch ngir saaku bu mag.","Mën nga ko yóbbu ci sama tool ci Thiès ?":"Meun nga ko yóbbu tchi sama tool tchi Thiès ?","Waaw, ëllëg ci suba.":"Waaw, eulleug tchi suba.","Damay yor sama njaay bu ndaw":"Damay yor sama ndjaay bu ndaw","Beykat laa, te maa ngi jaay sama légumes ci marse bi.":"Beykat laa, te maa ngi djaay sama légumes tchi marse bi.","Yaa ko jaay ci sa bopp ?":"Yaa ko djaay tchi sa bopp ?","Sama njaboot dafay liggéey ci tool yi":"Sama ndjaboot dafay liggéey tchi tool yi","Sama rakk bu góor dafay jaay meññeef ci marse bi":"Sama rakk bu góor dafay djaay megngneef tchi marse bi","Ndax sa njaboot am na tool ?":"Ndakh sa ndjaboot am na tool ?","Waaw, sama waajur yi dañuy ji dugub ak gerte.":"Waaw, sama waadjur yi dagnuy dji dugub ak gerte.","Baana-baana la ci Thiès.":"Baana-baana la tchi Thiès.","Damay tàmbali liggéey ci juróom benn ci suba":"Damay tàmbali liggéey tchi djuróom benn tchi suba","Damay sotti ndox ci gàncax yi bés bu nekk":"Damay sotti ndokh tchi gàntchakh yi bés bu nekk","Damay jaay sama yëf ci mbedd mi":"Damay djaay sama yeuf tchi mbedd mi","Ci juróom benn. Damay sotti ndox ci sama légumes yi njëkk, ba noppi dem ci marse bi.":"Tchi djuróom benn. Damay sotti ndokh tchi sama légumes yi ndjeukk, ba noppi dem tchi marse bi.","Ñaata waxtu nga liggéey ?":"Gnaata wakhtu nga liggéey ?","Ni fukki waxtu ci bés bu nekk.":"Ni fukki wakhtu tchi bés bu nekk.","Wàññil ma tuuti":"Wàgngnil ma tuuti","Dama bëgg jënd fukki kilo sooble":"Dama beugg djeund fukki kilo sooble","Salaam aleekum. Ñaata la tamaate yi ?":"Salaam aleekum. Gnaata la tamaate yi ?","Juróom téeméer franc la ci kilo bi.":"Djuróom téeméer frantch la tchi kilo bi.","Dafa seer. Mën nga wàññi njëg li ?":"Dafa seer. Meun nga wàgngni ndjeug li ?","Ngir yaw, ñeent téeméer. Ñu ngi jóge ci tool bi tey ci suba.":"Ngir yaw, gneent téeméer. Gnu ngi djóge tchi tool bi tey tchi suba.","Baax na, bëgg naa ñett kilo.":"Baakh na, beugg naa gnett kilo.","Damay yóbbu marsandiis ci Ndakaaru":"Damay yóbbu marsandiis tchi Ndakaaru","Kamiyon bi dafay dem ci juróom ñaar":"Kamiyon bi dafay dem tchi djuróom gnaar","Ñaata la bilee bi ngir dem marse bi ?":"Gnaata la bilee bi ngir dem marse bi ?","Ndax kamiyon bii dafay dem marse bu Thiès ?":"Ndakh kamiyon bii dafay dem marse bu Thiès ?","Waaw, dafay dem ci juróom ñaar ak légumes yu bees.":"Waaw, dafay dem tchi djuróom gnaar ak légumes yu bees.","Ñaata la sama bagaas yi ?":"Gnaata la sama bagaas yi ?","Ñaar junni franc la.":"Gnaar djunni frantch la.","Dama war a noppalu, liggéey naa ci jant bi bés bi bépp":"Dama war a noppalu, liggéey naa tchi djant bi bés bi bépp","Naanal ndox bu bari bu tàngee":"Naanal ndokh bu bari bu tàngee","Liggéey naa ci tool bi bés bi bépp te naanul ndox.":"Liggéey naa tchi tool bi bés bi bépp te naanul ndokh.","War nga naan ndox te noppalu.":"War nga naan ndokh te noppalu.","Dëgg nga, jërëjëf.":"Deugg nga, djeureudjeuf.","Légumes yu bees ak meññeef":"Légumes yu bees ak megngneef","Dama bëgg ceeb ak ginaar, su la neexee":"Dama beugg tcheeb ak ginaar, su la neekhee","Lan nga bëgg ?":"Lan nga beugg ?","Ceeb ak ginaar, su la neexee.":"Tcheeb ak ginaar, su la neekhee.","Ndax bëgg nga légumes ?":"Ndakh beugg nga légumes ?","Waaw, ak ndox.":"Waaw, ak ndokh.","Nawet dafay tàmbali ci sulet":"Nawet dafay tàmbali tchi sulet","Marse bi dafay ubbeeku ci juróom benn":"Marse bi dafay ubbeeku tchi djuróom benn","Juróom téeméer franc":"Djuróom téeméer frantch","Kañ la nawet di tàmbali ?":"Kagn la nawet di tàmbali ?","Ci sulet. Danuy ji gerte gannaaw taw bi njëkk.":"Tchi sulet. Danuy dji gerte gannaaw taw bi ndjeukk.","Ci ban waxtu la marse bi di ubbeeku ?":"Tchi ban wakhtu la marse bi di ubbeeku ?","Ci juróom benn.":"Tchi djuróom benn.","Am naa sama njaay bu ndaw ci Senegaal":"Am naa sama ndjaay bu ndaw tchi Senegaal","Dinaa délsi sama kër gannaaw tukki bi":"Dinaa délsi sama keur gannaaw tukki bi","Damay jënd marsandiis ngir jaay ko ci sama butik":"Damay djeund marsandiis ngir djaay ko tchi sama butik","Lu tax nga bëgg a tukki ?":"Lu takh nga beugg a tukki ?","Dama bëgg jënd marsandiis ngir sama njaay.":"Dama beugg djeund marsandiis ngir sama ndjaay.","Ndax dinga délsi Senegaal ?":"Ndakh dinga délsi Senegaal ?","Waaw, sama njaboot ak sama butik ñu ngi fa.":"Waaw, sama ndjaboot ak sama butik gnu ngi fa.","Am naa tool bu ndaw ci gannaaw kër gi":"Am naa tool bu ndaw tchi gannaaw keur gi","Loyer bi fanweer junni franc la ci weer wi":"Loyer bi fanweer djunni frantch la tchi weer wi","Ndax am nga tool ?":"Ndakh am nga tool ?","Waaw, damay ji tamaate ak sooble ci gannaaw kër gi.":"Waaw, damay dji tamaate ak sooble tchi gannaaw keur gi.","Ndax loyer bi dafa seer ?":"Ndakh loyer bi dafa seer ?","Ban référans la pièce bii am ?":"Ban référans la piètche bii am ?","Amortisëer":"Amortiseuer","Ndax pièce bii original la walla copie la ?":"Ndakh piètche bii original la walla tchopie la ?","Ñaata la pièce bii ?":"Gnaata la piètche bii ?","Ndax am nga garanti ?":"Ndakh am nga garanti ?","Ndax pièce bii OEM la walla aftermarket ?":"Ndakh piètche bii OEM la walla aftermarket ?","Maa ngi wut fournisseur bu jóge fabrik bi":"Maa ngi wut fournisseur bu djóge fabrik bi","Ñaata la ngir commande gros ?":"Gnaata la ngir tchommande gros ?","Ñaata acompte laa war a fey ?":"Gnaata atchompte laa war a fey ?","Ndax fey nga ci Yuan walla dollar ?":"Ndakh fey nga tchi Yuan walla dollar ?","Ñaata weer garanti pièce bii am ?":"Gnaata weer garanti piètche bii am ?","Ndax prix bi dafa bokk montage bi ?":"Ndakh prikh bi dafa bokk montage bi ?","Dinaa dellusi bu prix bi neexul ma":"Dinaa dellusi bu prikh bi neekhul ma","Ndax mën nga ma jox facture ?":"Ndakh meun nga ma djokh fatchture ?","Pièce bii dafa yem ak ban marque oto ?":"Piètche bii dafa yem ak ban marque oto ?","Prix gros / prix détail":"Prikh gros / prikh détail","Ndax tissu bii baax na ?":"Ndakh tissu bii baakh na ?","Am nga yeneen couleur ?":"Am nga yeneen tchouleur ?","Bëgg naa jënd ci gros":"Beugg naa djeund tchi gros","Ñaata la ngir fukk pièce ?":"Gnaata la ngir fukk piètche ?","Ndax tissu bii dafay soppi couleur bu ñu ko raxasee ?":"Ndakh tissu bii dafay soppi tchouleur bu gnu ko rakhasee ?","Ñaata la minimum commande bi ?":"Gnaata la minimum tchommande bi ?","Ndax mën nga ma yónnee échantillon ?":"Ndakh meun nga ma yónnee étchhantillon ?","Ndax tissu bii coton pur la ?":"Ndakh tissu bii tchoton pur la ?","Am nga ticket bi ?":"Am nga titchket bi ?","Ndax mën naa ko soppi su neexul ma ?":"Ndakh meun naa ko soppi su neekhul ma ?","Ñaata fan ngir am beneen stock ?":"Gnaata fan ngir am beneen stotchk ?","Ndax jaay nga itam ci internet ?":"Ndakh djaay nga itam tchi internet ?","Ndax jumtukaay bii dafay dox ci 220V ?":"Ndakh djumtukaay bii dafay dokh tchi 220V ?","Ndax am na garanti bu fabrikaan bi ?":"Ndakh am na garanti bu fabrikaan bi ?","Ndax mën nga ma ko testeel ci sama kanam ?":"Ndakh meun nga ma ko testeel tchi sama kanam ?","Ndax dafa yem ak voltage bu Senegaal ?":"Ndakh dafa yem ak voltage bu Senegaal ?","Ndax am nga facture bu njëkk bi ?":"Ndakh am nga fatchture bu ndjeukk bi ?","Ñaata la ngir carton bu mat ?":"Gnaata la ngir tcharton bu mat ?","Ndax chargeur bi dafa bokk ?":"Ndakh tchhargeur bi dafa bokk ?","Ñaata la capacité batterie bi ?":"Gnaata la tchapatchité batterie bi ?","Ndax mën naa fey ci mobile money ?":"Ndakh meun naa fey tchi mobile money ?","Am nga service après-vente ?":"Am nga servitche après-vente ?","Ndax meuble bii mën nañ ko wàcce ?":"Ndakh meuble bii meun nagn ko wàtchtche ?","Lan matière lañu jëfandikoo ?":"Lan matière lagnu djeufandikoo ?","Ndax dinañ ko yónnee ci kër gi ?":"Ndakh dinagn ko yónnee tchi keur gi ?","Ñaata la ngir ensemble bi bépp ?":"Gnaata la ngir ensemble bi bépp ?","Ndax mën naa fey ci plusieurs fois ?":"Ndakh meun naa fey tchi plusieurs fois ?","Ndax meuble bii dafa traité ci termites ?":"Ndakh meuble bii dafa traité tchi termites ?","Ñaata fan ngir fabriquer commande bi ?":"Gnaata fan ngir fabriquer tchommande bi ?","Am nga service montage ?":"Am nga servitche montage ?","Ndax mën naa xool catalogue modèles yi ?":"Ndakh meun naa khool tchatalogue modèles yi ?","Ñaata la transport bu conteneur ?":"Gnaata la transport bu tchonteneur ?","Ñaata fan ngir livraison bi ?":"Gnaata fan ngir livraison bi ?","Ndax soxla nga visa d'affaires ?":"Ndakh sokhla nga visa d'affaires ?","Ñaata la prix FOB bi ?":"Gnaata la prikh FOB bi ?","Bëgg naa envoi bu bokk ak yeneen":"Beugg naa envoi bu bokk ak yeneen","Ñaata CBM la sama marsandiis am ?":"Gnaata TchBM la sama marsandiis am ?","Soxla naa Bill of Lading bi":"Sokhla naa Bill of Lading bi","Fan la packing list bi ?":"Fan la patchking list bi ?","Ñaata fan ngir dédouaner ci Port Dakar ?":"Gnaata fan ngir dédouaner tchi Port Dakar ?","Ban Incoterm nga jëfandikoo ?":"Ban Intchoterm nga djeufandikoo ?","Ndax nangu nga fey ci acompte, topp solde bi ?":"Ndakh nangu nga fey tchi atchompte, topp solde bi ?","Ñaata fan la devis bi dox ?":"Gnaata fan la devis bi dokh ?","Am nga assurance transport ?":"Am nga assurantche transport ?","Boy, ñaata la pièce bii ?":"Boy, gnaata la piètche bii ?","Fukk ak juróom-ñeent junni la, waay.":"Fukk ak djuróom-gneent djunni la, waay.","Waaw waaw, ndax mën nga wàññi tuuti ?":"Waaw waaw, ndakh meun nga wàgngni tuuti ?","Ci sa ndigël, dinaa la ko jox ci fukk ak juróom-ñaar junni.":"Tchi sa ndigeul, dinaa la ko djokh tchi fukk ak djuróom-gnaar djunni.","Ndax pièce bii dafa bokk ci fabrik bi, walla copie la ?":"Ndakh piètche bii dafa bokk tchi fabrik bi, walla tchopie la ?","Dafa bokk ci fabrik bi, wóor na ko.":"Dafa bokk tchi fabrik bi, wóor na ko.","Ban taille nga am ci tissu bii ?":"Ban taille nga am tchi tissu bii ?","Am naa L ak XL, walla mën naa la ko def ci sa mesure.":"Am naa L ak KhL, walla meun naa la ko def tchi sa mesure.","Ñaata la ngir fukk pièces, bu ma jëndee ci gros ?":"Gnaata la ngir fukk piètches, bu ma djeundee tchi gros ?","Ci gros, dinaa la ko wàññi, ñeent fukk junni rekk.":"Tchi gros, dinaa la ko wàgngni, gneent fukk djunni rekk.","Ndax mën nga ma yónnee échantillon bu njëkk ?":"Ndakh meun nga ma yónnee étchhantillon bu ndjeukk ?","Waaw, léegi léegi, dinaa ko tàbbal ci prise bi.":"Waaw, léegi léegi, dinaa ko tàbbal tchi prise bi.","Waaw, benn at garanti, ak facture bu njëkk.":"Waaw, benn at garanti, ak fatchture bu ndjeukk.","Waaw, mën nañ ko wàcce ngir livraison bi yomb.":"Waaw, meun nagn ko wàtchtche ngir livraison bi yomb.","Waaw, livraison bi bokkul ci njëg bi, ñaar fukk junni la.":"Waaw, livraison bi bokkul tchi ndjeug bi, gnaar fukk djunni la.","Waaw, mën nga fey ñetti yoon, ci ñetti weer.":"Waaw, meun nga fey gnetti yoon, tchi gnetti weer.","Ñaata la transport bu conteneur bi ?":"Gnaata la transport bu tchonteneur bi ?","Dafa aju ci ñaata CBM la sa marsandiis am.":"Dafa adju tchi gnaata TchBM la sa marsandiis am.","Ñaata fan ngir livraison bi ci Port Dakar ?":"Gnaata fan ngir livraison bi tchi Port Dakar ?","Tollu na ci fanweer, bu dédouanement bi yomb.":"Tollu na tchi fanweer, bu dédouanement bi yomb.","Soxla naa Bill of Lading bi ak packing list bi.":"Sokhla naa Bill of Lading bi ak patchking list bi.","Waaw, dinaa la ko yónnee bu ñu jëlee marsandiis bi.":"Waaw, dinaa la ko yónnee bu gnu djeulee marsandiis bi.","Pompu ndox ngir tool bi":"Pompu ndokh ngir tool bi","Pièces détachées yu tracteur":"Piètches détatchhées yu tratchteur","Prix gros ngir baana-baana yi":"Prikh gros ngir baana-baana yi","Damay jaay ci crédit":"Damay djaay tchi tchrédit","Fey ci mobile money":"Fey tchi mobile money","Caisse ngir denc légumes yi":"Tchaisse ngir dentch légumes yi","Jumtukaay yu irrigation":"Djumtukaay yu irrigation","Conteneur ngir yónnee marsandiis":"Tchonteneur ngir yónnee marsandiis","Ñaata la tamaate bi ci kilo ?":"Gnaata la tamaate bi tchi kilo ?","Juróom téeméer la ci kilo bi.":"Djuróom téeméer la tchi kilo bi.","Dafa seer. Wàññil ma tuuti.":"Dafa seer. Wàgngnil ma tuuti.","Baax na, ñeent téeméer la.":"Baakh na, gneent téeméer la.","Jërëjëf. Jënd naa ñett kilo.":"Djeureudjeuf. Djeund naa gnett kilo.","Ndax am na garanti ci pièce bii ?":"Ndakh am na garanti tchi piètche bii ?","Waaw, ñetti weer la.":"Waaw, gnetti weer la.","Bu ma ko tàbbalee te dootul dox, mën naa ko delloo ?":"Bu ma ko tàbbalee te dootul dokh, meun naa ko delloo ?","Waaw, indil ma facture bi ak pièce bi.":"Waaw, indil ma fatchture bi ak piètche bi.","Ndax mën nga ma ko wuutal ak beneen ?":"Ndakh meun nga ma ko wuutal ak beneen ?","Waaw, mën nañu ko wuutal ci ñetti fan.":"Waaw, meun nagnu ko wuutal tchi gnetti fan.","Ñaata la ci téeméer pièces ?":"Gnaata la tchi téeméer piètches ?","Ci téeméer pièces, ñett téeméer ak juróom-fukk junni.":"Tchi téeméer piètches, gnett téeméer ak djuróom-fukk djunni.","Dafa seer. Ndax mën nga ko def ñett téeméer junni ?":"Dafa seer. Ndakh meun nga ko def gnett téeméer djunni ?","Baax na, waaye fey bi dafa war a jëkk.":"Baakh na, waaye fey bi dafa war a djeukk.","Dinaa fey juróom-fukk ci téeméer léegi, li desul bu ma jotee marsandiis bi.":"Dinaa fey djuróom-fukk tchi téeméer léegi, li desul bu ma djotee marsandiis bi.","Waaw, jërëjëf. Dinaa ko waajal ci ñetti fan.":"Waaw, djeureudjeuf. Dinaa ko waadjal tchi gnetti fan.","Ndax mën naa fey ak Wave ?":"Ndakh meun naa fey ak Wave ?","Waaw, yónnee ma ko ci numéro bii.":"Waaw, yónnee ma ko tchi numéro bii.","Yónnee naa ko. Ndax mën nga ma jox reçu ?":"Yónnee naa ko. Ndakh meun nga ma djokh reçu ?","Waaw, dinaa la jox facture bi ak numéro série bi.":"Waaw, dinaa la djokh fatchture bi ak numéro série bi.","Bu mu xaalee ci benn weer, ndax dinga ma ko wuutal ?":"Bu mu khaalee tchi benn weer, ndakh dinga ma ko wuutal ?","Ndax mën nga ñëw ci kër gi ngir jël mesure yi ?":"Ndakh meun nga gneuw tchi keur gi ngir djeul mesure yi ?","Waaw, kañ nga bëgg ñu ñëw ?":"Waaw, kagn nga beugg gnu gneuw ?","Altine ci suba.":"Altine tchi suba.","Baax na. Dinañu ñëw ak ñaari liggéeykat ngir montage bi.":"Baakh na. Dinagnu gneuw ak gnaari liggéeykat ngir montage bi.","Ñaata la montage bi ?":"Gnaata la montage bi ?","Bokkul ci njëg bi, juróom junni la.":"Bokkul tchi ndjeug bi, djuróom djunni la.","Ñaata la pompu ndox bii ?":"Gnaata la pompu ndokh bii ?","Ñaar téeméer ak juróom-fukk junni la.":"Gnaar téeméer ak djuróom-fukk djunni la.","Ndax dafay dox ak solaire ?":"Ndakh dafay dokh ak solaire ?","Ndax mën nga ma won ni muy liggéey ?":"Ndakh meun nga ma won ni muy liggéey ?","Waaw, ñëwal, dinaa la ko won ci tool bi.":"Waaw, gneuwal, dinaa la ko won tchi tool bi.","Ban papiers lañuy laaj ci douane ?":"Ban papiers lagnuy laadj tchi douane ?","Facture bi, packing list bi ak Bill of Lading bi.":"Fatchture bi, patchking list bi ak Bill of Lading bi.","Ñaata la droits de douane yi ?":"Gnaata la droits de douane yi ?","Dafa aju ci xeetu marsandiis bi. Transitaire bi dina la ko wax.":"Dafa adju tchi kheetu marsandiis bi. Transitaire bi dina la ko wakh.","Ndax mën nga ma jox numéro transitaire bi ?":"Ndakh meun nga ma djokh numéro transitaire bi ?","Waaw, dinaa la ko yónnee ci WhatsApp.":"Waaw, dinaa la ko yónnee tchi WhatsApp.","Ñaata la benn pièce ?":"Gnaata la benn piètche ?","Fukk dolaar la ci benn.":"Fukk dolaar la tchi benn.","Dafa seer. Dinaa jënd juróom téeméer.":"Dafa seer. Dinaa djeund djuróom téeméer.","Juróom-ñett dolaar ngir juróom téeméer pièces.":"Djuróom-gnett dolaar ngir djuróom téeméer piètches.","Ndax mën nga ko yónnee Dakar ?":"Ndakh meun nga ko yónnee Dakar ?","Waaw, FOB walla CIF, ban nga bëgg ?":"Waaw, FOB walla TchIF, ban nga beugg ?","+ sectionKey +":"+ setchtionKey +","Plakët fren":"Plakeut fren","Buji":"Budji","Radiyatëer":"Radiyateuer","Paar-choks":"Paar-tchhoks","Ci fabrik":"Tchi fabrik","Ocasiyoŋ":"Otchasiyong","Ndax am nga ko ci stok ?":"Ndakh am nga ko tchi stok ?","Soxla naa pièce bu Toyota Corolla":"Sokhla naa piètche bu Toyota Tchorolla","Won ma pièce bu njëkk bi":"Won ma piètche bu ndjeukk bi","Ñaata la di yàgg ?":"Gnaata la di yàgg ?","Mën nga ma ko taxawal ?":"Meun nga ma ko takhawal ?","Kii kopi bu baax la":"Kii kopi bu baakh la","Ndax essãas la walla gasoil ?":"Ndakh essãas la walla gasoil ?","Am na coow lu bees":"Am na tchoow lu bees","Soxla naa lu gën a yomb":"Sokhla naa lu geun a yomb","Mën naa ko delloo bu yemul ?":"Meun naa ko delloo bu yemul ?","Bind njëg bi, baal ma":"Bind ndjeug bi, baal ma","Ñaata nga am ?":"Gnaata nga am ?","Dinaa jël ñaar yi":"Dinaa djeul gnaar yi","Xaar tuuti, dinaa xool stok bi":"Khaar tuuti, dinaa khool stok bi","Bëgg naa commande téeméer plakët fren":"Beugg naa tchommande téeméer plakeut fren","Ban njëg bi gën a baax ngir konteneer ?":"Ban ndjeug bi geun a baakh ngir konteneer ?","Soxla nanu échantillon balaa commande bi":"Sokhla nanu étchhantillon balaa tchommande bi","Ndax qualité bi am na certifika ?":"Ndakh qualité bi am na tchertifika ?","Ban quantité bu ndaw la war a commande ?":"Ban quantité bu ndaw la war a tchommande ?","Mën nga def njëg bu gën a baax ngir kiliyaŋ bu mu bokk ?":"Meun nga def ndjeug bu geun a baakh ngir kiliyang bu mu bokk ?","Dinanu fey fanweer ci téeméer léegi, li des ci livraison bi":"Dinanu fey fanweer tchi téeméer léegi, li des tchi livraison bi","Yónnee ma nataal ci pièce bu nekk":"Yónnee ma nataal tchi piètche bu nekk","Ñaata fan la livraison bi ci Ndakaaru ?":"Gnaata fan la livraison bi tchi Ndakaaru ?","Marsandiz bi agsi na ak pièce yu yàqu":"Marsandiz bi agsi na ak piètche yu yàqu","Bëgg nanu ñu delloo xaalis bi walla ñu weccil ko":"Beugg nanu gnu delloo khaalis bi walla gnu wetchtchil ko","Mën nga ma defal factuur ci tur sama entreprise ?":"Meun nga ma defal fatchtuur tchi tur sama entreprise ?","Ndax njëg bi FOB la walla CIF ?":"Ndakh ndjeug bi FOB la walla TchIF ?","Bëgg nanu kontra bu yàgg":"Beugg nanu kontra bu yàgg","Bu mujj bi fanweer fan la":"Bu mudjdj bi fanweer fan la","Dinaa la ko wax bu ma xoolee ak sama partner":"Dinaa la ko wakh bu ma khoolee ak sama partner","Soxla naa batri.":"Sokhla naa batri.","Bees walla ocasiyoŋ ?":"Bees walla otchasiyong ?","Bees. Ñaata la ?":"Bees. Gnaata la ?","Càmmoñ walla ndeyjoor ?":"Tchàmmogn walla ndeydjoor ?","Bi ci càmmoñ.":"Bi tchi tchàmmogn.","Waaw, ci fabrik walla kopi ?":"Waaw, tchi fabrik walla kopi ?","Kopi, dafa gën a yomb.":"Kopi, dafa geun a yomb.","Sama oto bi demul. Man maa ngi jàpp ne batri la.":"Sama oto bi demul. Man maa ngi djàpp ne batri la.","Ñaata la bu bees ak garanti ?":"Gnaata la bu bees ak garanti ?","Soxla naa plakët fren ngir Toyota Corolla 2010.":"Sokhla naa plakeut fren ngir Toyota Tchorolla 2010.","Ci fabrik walla kopi ?":"Tchi fabrik walla kopi ?","Ban la diggante njëg bi ?":"Ban la diggante ndjeug bi ?","Am na coow lu bees ci kanam.":"Am na tchoow lu bees tchi kanam.","Man maa ngi jàpp ne amortisör la. Bàyyi ma xool.":"Man maa ngi djàpp ne amortisör la. Bàyyi ma khool.","Mën nga ko soppi tey ?":"Meun nga ko soppi tey ?","Pièce bii yemul ak sama oto.":"Piètche bii yemul ak sama oto.","Waaw, jënd naa ko démb.":"Waaw, djeund naa ko démb.","Jox ma ñaar, benn ngir oto bu nekk.":"Djokh ma gnaar, benn ngir oto bu nekk.","Bëgg nanu commande juróom téeméer plakët fren ngir Toyota. Ban njëg bi gën a baax ?":"Beugg nanu tchommande djuróom téeméer plakeut fren ngir Toyota. Ban ndjeug bi geun a baakh ?","Ngir juróom téeméer, ñaar dolaar ci benn, FOB Guangzhou.":"Ngir djuróom téeméer, gnaar dolaar tchi benn, FOB Guangzhou.","Mën nanu fey fanweer ci téeméer léegi, li des balaa yónnee bi.":"Meun nanu fey fanweer tchi téeméer léegi, li des balaa yónnee bi.","Balaa commande bu mag bi, yónnee nu échantillon ci pièce bu nekk.":"Balaa tchommande bu mag bi, yónnee nu étchhantillon tchi piètche bu nekk.","Mën nanu yónnee ñett échantillon. Yéen ngeen fey yónnee bi.":"Meun nanu yónnee gnett étchhantillon. Yéen ngeen fey yónnee bi.","Ndax qualité bi am na certifika ? Am nga ko ?":"Ndakh qualité bi am na tchertifika ? Am nga ko ?","Konteneer bi agsi na, waaye ñaar-fukk pièce yàqu nañu.":"Konteneer bi agsi na, waaye gnaar-fukk piètche yàqu nagnu.","Yónnee nataal yi ak packing list bi.":"Yónnee nataal yi ak patchking list bi.","Lii la. Bëgg nanu weccil ci yónnee bi toppu.":"Lii la. Beugg nanu wetchtchil tchi yónnee bi toppu.","Danuy jënd ci yaw weer wu nekk. Mën nga nu def njëg bu gën a baax ?":"Danuy djeund tchi yaw weer wu nekk. Meun nga nu def ndjeug bu geun a baakh ?","Ngir kontra bu benn at, mën naa wàññi juróom ci téeméer.":"Ngir kontra bu benn at, meun naa wàgngni djuróom tchi téeméer.","Def ko juróom-ñett ci téeméer te dinanu signé tey.":"Def ko djuróom-gnett tchi téeméer te dinanu signé tey.","Defal ma factuur bi ci tur sama entreprise.":"Defal ma fatchtuur bi tchi tur sama entreprise.","ABC Global, Thiès, Senegaal. Douane bi soxla na njëg bi bu mat.":"ABTch Global, Thiès, Senegaal. Douane bi sokhla na ndjeug bi bu mat.","Rujlev":"Rudjlev","Am nga taille bu gën a mag ?":"Am nga taille bu geun a mag ?","Mën naa ko jéem ?":"Meun naa ko djéem ?","Fu néegu jéem bi nekk ?":"Fu néegu djéem bi nekk ?","Kuloor bii dafa la neex":"Kuloor bii dafa la neekh","Ndax tissu bii kotoŋ la ?":"Ndakh tissu bii kotong la ?","Ndax day ndaw bu ñu ko raxasee ?":"Ndakh day ndaw bu gnu ko rakhasee ?","Mën nga ko def ci sama taille ?":"Meun nga ko def tchi sama taille ?","Kañ la di mat ?":"Kagn la di mat ?","Bëgg naa produi yu kawar yu natirel":"Beugg naa produi yu kawar yu natirel","Ndax parfem bii ci fabrik la ?":"Ndakh parfem bii tchi fabrik la ?","Ñaata ngir ensemble bi bépp ?":"Gnaata ngir ensemble bi bépp ?","Dinaa fey ci Wave":"Dinaa fey tchi Wave","Bëgg naa ko soppi":"Beugg naa ko soppi","Am nga ko ci ñuul ?":"Am nga ko tchi gnuul ?","Danuy jaay ci gros ci boutik yi ci Thiès":"Danuy djaay tchi gros tchi boutik yi tchi Thiès","Bëgg naa import tissu wax bu jóge Siin":"Beugg naa import tissu wakh bu djóge Siin","Mën nga ko print ci sunu dessin ?":"Meun nga ko print tchi sunu dessin ?","Soxla nanu kuloor yu yem ak échantillon bi":"Sokhla nanu kuloor yu yem ak étchhantillon bi","Ñaata fan la production bi di yàgg ?":"Gnaata fan la produtchtion bi di yàgg ?","Ndax kuloor bi day dem ?":"Ndakh kuloor bi day dem ?","Am nga certifika ngir cosmétique yi ?":"Am nga tchertifika ngir tchosmétique yi ?","Xool bés bu mujj bi balaa yónnee bi":"Khool bés bu mudjdj bi balaa yónnee bi","Bëgg nanu sunu logo ci emballaas bi":"Beugg nanu sunu logo tchi emballaas bi","Damay jaay ci kiliyaŋ yi ci réso sosyal":"Damay djaay tchi kiliyang yi tchi réso sosyal","Mën nga yónnee ci sama kiliyaŋ yi ci kanam ?":"Meun nga yónnee tchi sama kiliyang yi tchi kanam ?","Soxla naa njëg bu gën a baax ngir téeméer pièce":"Sokhla naa ndjeug bu geun a baakh ngir téeméer piètche","Dañuy nangu dellu ci diggante juróom-ñaar fan":"Dagnuy nangu dellu tchi diggante djuróom-gnaar fan","Danuy joxe exclusivité ngir Senegaal":"Danuy djokhe ekhtchlusivité ngir Senegaal","Nanu signé accord bi":"Nanu signé atchtchord bi","Bëgg naa robu.":"Beugg naa robu.","Moyenne. Am nga ko ci xonq ?":"Moyenne. Am nga ko tchi khonq ?","Ñaata la tissu bii ?":"Gnaata la tissu bii ?","Ñett junni ci metar bi.":"Gnett djunni tchi metar bi.","Dinaa jël juróom metar.":"Dinaa djeul djuróom metar.","Am nga dàll yii ci ñeent-fukk ?":"Am nga dàll yii tchi gneent-fukk ?","Waaw, ci ñuul ak marron.":"Waaw, tchi gnuul ak marron.","Dinaa jël yu ñuul yi.":"Dinaa djeul yu gnuul yi.","Parfem bii neex na ma. Ñaata la ?":"Parfem bii neekh na ma. Gnaata la ?","Fukk ak ñaar junni, ci fabrik la.":"Fukk ak gnaar djunni, tchi fabrik la.","Mën naa jéem beneen ?":"Meun naa djéem beneen ?","Bëgg naa saabu ak kerem ngir yaram.":"Beugg naa saabu ak kerem ngir yaram.","Natirel, baal ma. Ñaata la ?":"Natirel, baal ma. Gnaata la ?","Am nga taille bu gën a mag ? Bii dafa ndaw.":"Am nga taille bu geun a mag ? Bii dafa ndaw.","Jéemal bii. Néegu jéem bi, fale la nekk.":"Djéemal bii. Néegu djéem bi, fale la nekk.","Dafa ma yem. Am nga ko ci bleu ?":"Dafa ma yem. Am nga ko tchi bleu ?","Mën nga def mbubb mii ci sama taille ?":"Meun nga def mbubb mii tchi sama taille ?","Waaw. War naa jël sa mesure yi.":"Waaw. War naa djeul sa mesure yi.","Jënd naa robu bii démb, waaye fermetir bi yàqu na.":"Djeund naa robu bii démb, waaye fermetir bi yàqu na.","Waaw, lii la. Bëgg naa ko soppi.":"Waaw, lii la. Beugg naa ko soppi.","Dinaa jël ñett robu. Ñaata ngir yépp ?":"Dinaa djeul gnett robu. Gnaata ngir yépp ?","Ñaar-fukk ak ñeent junni, waaye ñaar-fukk junni ngir yaw.":"Gnaar-fukk ak gneent djunni, waaye gnaar-fukk djunni ngir yaw.","Dinaa fey ci Wave.":"Dinaa fey tchi Wave.","Danuy jaay ci boutik yi ci Thiès. Ban quantité bu ndaw la ngir gros ?":"Danuy djaay tchi boutik yi tchi Thiès. Ban quantité bu ndaw la ngir gros ?","Juróom-fukk pièce ci modèle bu nekk.":"Djuróom-fukk piètche tchi modèle bu nekk.","Mën nga wàññi fukk ci téeméer ngir juróom-fukk pièce ?":"Meun nga wàgngni fukk tchi téeméer ngir djuróom-fukk piètche ?","Bëgg naa import tissu wax bu jóge Siin. Mën nga ko print ci sunu dessin ?":"Beugg naa import tissu wakh bu djóge Siin. Meun nga ko print tchi sunu dessin ?","Waaw, yónnee fichier bi. Bu ndaw bi, junni metar.":"Waaw, yónnee fitchhier bi. Bu ndaw bi, djunni metar.","Am nga certifika ngir cosmétique yii ?":"Am nga tchertifika ngir tchosmétique yii ?","Waaw, te bés bu mujj bi ci ñaari at la.":"Waaw, te bés bu mudjdj bi tchi gnaari at la.","Bëgg nanu sunu logo ci emballaas bi.":"Beugg nanu sunu logo tchi emballaas bi.","Damay jaay ci réso sosyal. Mën nga yónnee ci sama kiliyaŋ yi ci kanam ?":"Damay djaay tchi réso sosyal. Meun nga yónnee tchi sama kiliyang yi tchi kanam ?","Waaw, danuy def dropshipping. Colis bu nekk dafa am njëg bu ci yokk.":"Waaw, danuy def dropshipping. Tcholis bu nekk dafa am ndjeug bu tchi yokk.","Ñaata la colis bu nekk ?":"Gnaata la tcholis bu nekk ?","Bëgg nanu exclusivité ngir Senegaal.":"Beugg nanu ekhtchlusivité ngir Senegaal.","Su fekkee loolu, war ngeen jënd fukk junni pièce ci at.":"Su fekkee loolu, war ngeen djeund fukk djunni piètche tchi at.","Nu nangu. Nanu signé accord bi.":"Nu nangu. Nanu signé atchtchord bi.","Factuur":"Fatchtuur","Échantillon":"Étchhantillon","Tarjumaan":"Tardjumaan","Ñaata fan ci géej ?":"Gnaata fan tchi géedj ?","Ñaata ci metar kib ?":"Gnaata tchi metar kib ?","Soxla nanu packing list bi":"Sokhla nanu patchking list bi","Uzin bi ci Guangzhou la nekk":"Uzin bi tchi Guangzhou la nekk","Mën nga ma tekki ?":"Meun nga ma tekki ?","Bind ko ci sinwaa, baal ma":"Bind ko tchi sinwaa, baal ma","Soxla naa virmaŋ bank":"Sokhla naa virmang bank","Taux bi kawe na tey":"Taukh bi kawe na tey","Ban otel moo jege marse bi ?":"Ban otel moo djege marse bi ?","Ñaata la uzin bi sore ?":"Gnaata la uzin bi sore ?","Soxla naa visa ngir Siin":"Sokhla naa visa ngir Siin","Fan laa mën a soppi xaalis ?":"Fan laa meun a soppi khaalis ?","Mën nga ma dem jël ci àeroporu bi ?":"Meun nga ma dem djeul tchi àeroporu bi ?","Ban Incoterm la, FOB walla CIF ?":"Ban Intchoterm la, FOB walla TchIF ?","Soxla nanu Bill of Lading bi":"Sokhla nanu Bill of Lading bi","Marsandiz bi tëj nañu ko ci douane":"Marsandiz bi teudj nagnu ko tchi douane","Soxla nanu certifika orijin":"Sokhla nanu tchertifika oridjin","Defal assurance ngir marsandiz bi":"Defal assurantche ngir marsandiz bi","Ñaata la konteneer bu fees ?":"Gnaata la konteneer bu fees ?","Mën nanu bokk konteneer ?":"Meun nanu bokk konteneer ?","Bu mujj bi amul bu ñu ko sàmm":"Bu mudjdj bi amul bu gnu ko sàmm","Bëgg nanu ñibbi uzin bi balaa nu fey":"Beugg nanu gnibbi uzin bi balaa nu fey","Ndax nangu nga crédit documentaire ?":"Ndakh nangu nga tchrédit dotchumentaire ?","Xoolal qualité bi balaa ñu yeb marsandiz bi":"Khoolal qualité bi balaa gnu yeb marsandiz bi","Am nanu agent bu exclusif ci Ndakaaru":"Am nanu agent bu ekhtchlusif tchi Ndakaaru","Nanu tàmbali ak commande d'essai":"Nanu tàmbali ak tchommande d'essai","Fan nga bëgg a dem ?":"Fan nga beugg a dem ?","Ci otel bii, baal ma.":"Tchi otel bii, baal ma.","Am naa néeg ngir ñett guddi.":"Am naa néeg ngir gnett guddi.","Salaamaalekum, Senegaal laa jóge. Bëgg naa jënd marsandiz.":"Salaamaalekum, Senegaal laa djóge. Beugg naa djeund marsandiz.","Dalal ak jàmm. Bëgg nga gis échantillon yi ?":"Dalal ak djàmm. Beugg nga gis étchhantillon yi ?","Waaw, baal ma. Ñaata la ?":"Waaw, baal ma. Gnaata la ?","Ñaata la benn karton ?":"Gnaata la benn karton ?","Ñaari téeméer yuan.":"Gnaari téeméer yuan.","Ñaata la diisaay bi ?":"Gnaata la diisaay bi ?","Kañ la livraison bi ?":"Kagn la livraison bi ?","Ci ñaari ayubés.":"Tchi gnaari ayubés.","Ci port bu Ndakaaru ?":"Tchi port bu Ndakaaru ?","Ci virmaŋ bank. Dinaa la yónnee sama kont.":"Tchi virmang bank. Dinaa la yónnee sama kont.","Ndax taux bi baax na tey ?":"Ndakh taukh bi baakh na tey ?","Mën nga ma yónnee nimero suivi bi ?":"Meun nga ma yónnee nimero suivi bi ?","Soxla naa visa ngir Siin. Ban kayit lañu soxla ?":"Sokhla naa visa ngir Siin. Ban kayit lagnu sokhla ?","Ñaata fan la di yàgg ?":"Gnaata fan la di yàgg ?","Mën nga ma tekki ? Mënuma wax sinwaa.":"Meun nga ma tekki ? Meunuma wakh sinwaa.","Waaw, man mooy sa tarjumaan tey.":"Waaw, man mooy sa tardjumaan tey.","Laaj ko njëg bi ngir junni pièce.":"Laadj ko ndjeug bi ngir djunni piètche.","Ndax marsandiz bi mat na ?":"Ndakh marsandiz bi mat na ?","Yónnee nataal ci karton yi.":"Yónnee nataal tchi karton yi.","FOB Shenzhen la. Yaw ngay fey fret ci géej.":"FOB Shenzhen la. Yaw ngay fey fret tchi géedj.","Mën nga ma joxe njëg CIF Ndakaaru ?":"Meun nga ma djokhe ndjeug TchIF Ndakaaru ?","Konteneer bi tëj nañu ko ci douane bu Ndakaaru.":"Konteneer bi teudj nagnu ko tchi douane bu Ndakaaru.","Ban kayit moo ñàkk ?":"Ban kayit moo gnàkk ?","Certifika orijin bi. Mën nga ko yónnee tey ?":"Tchertifika oridjin bi. Meun nga ko yónnee tey ?","Ñu di njaay yu ndaw lanu. Mën nanu bokk konteneer ?":"Gnu di ndjaay yu ndaw lanu. Meun nanu bokk konteneer ?","Ñaata la ci metar kib ?":"Gnaata la tchi metar kib ?","Bëgg nanu ñibbi uzin bi balaa nu fey.":"Beugg nanu gnibbi uzin bi balaa nu fey.","Dalal ak jàmm. Kañ ngeen di agsi ?":"Dalal ak djàmm. Kagn ngeen di agsi ?","Weer wi ñëw. Xoolal qualité bi balaa ñu yeb marsandiz bi.":"Weer wi gneuw. Khoolal qualité bi balaa gnu yeb marsandiz bi.","Nanu tàmbali ak commande d'essai.":"Nanu tàmbali ak tchommande d'essai.","Baax na, benn konteneer bu ñaar-fukk pied.":"Baakh na, benn konteneer bu gnaar-fukk pied.","Mbaxal":"Mbakhal","Limoŋ":"Limong","Ndax légum yii bees nañu ?":"Ndakh légum yii bees nagnu ?","Ñaata ngir saak ceeb ?":"Gnaata ngir saak tcheeb ?","Dama jënd ci baykat bi ci kanam":"Dama djeund tchi baykat bi tchi kanam","Kañ la ngóob bi ?":"Kagn la ngóob bi ?","Nawet bi baax na at mii":"Nawet bi baakh na at mii","Danuy wow mangoro yi ci jant bi":"Danuy wow mangoro yi tchi djant bi","Naka ngay denc sooble yi ?":"Naka ngay dentch sooble yi ?","Soxla naa néeg bu sedd ngir jën":"Sokhla naa néeg bu sedd ngir djeun","Ñaata la diisaay saak bii ?":"Gnaata la diisaay saak bii ?","War na denc ci bérab bu wow":"War na dentch tchi bérab bu wow","Ndax produi bi bio la ?":"Ndakh produi bi bio la ?","Damay jaay jus ak konfitir":"Damay djaay djus ak konfitir","Mën naa ko jéem njëkk ?":"Meun naa ko djéem ndjeukk ?","Ñaata la mën a yàgg ?":"Gnaata la meun a yàgg ?","Bëgg naa emballaas bu set":"Beugg naa emballaas bu set","Livraison du fey bu ëpp juróom-fukk junni":"Livraison du fey bu eupp djuróom-fukk djunni","Danuy soppi meññeef yi ci jus ak konfitir":"Danuy soppi megngneef yi tchi djus ak konfitir","Soxla nanu certifika sécurité alimentaire":"Sokhla nanu tchertifika sétchurité alimentaire","Ñaata la produi bi mën a yàgg ?":"Gnaata la produi bi meun a yàgg ?","Bëgg nanu export mangoro yu wow":"Beugg nanu ekhport mangoro yu wow","Jëndkat bi bëgg na etiket ci angale":"Djeundkat bi beugg na etiket tchi angale","Ñaata la ci tonn ?":"Gnaata la tchi tonn ?","Dinanu signé kontra appovisionmaŋ ngir benn at":"Dinanu signé kontra appovisionmang ngir benn at","Soxla nanu transpoor bu sedd":"Sokhla nanu transpoor bu sedd","Genn-wàll ci ngóob bi jaay nañu ko":"Genn-wàll tchi ngóob bi djaay nagnu ko","Danuy jënd ci kooperatif yu jigéen":"Danuy djeund tchi kooperatif yu djigéen","Mën nga fey ci jamono ngóob bi ?":"Meun nga fey tchi djamono ngóob bi ?","Soxla nanu am prêt ngir jënd mašin bi":"Sokhla nanu am prêt ngir djeund mašin bi","Njëg bi day wàññiku ci jamono ngóob bi":"Ndjeug bi day wàgngniku tchi djamono ngóob bi","Nanu dëgmal njëg bi balaa jamono bi":"Nanu deugmal ndjeug bi balaa djamono bi","Waaw, bees nañu.":"Waaw, bees nagnu.","Benn kilo, baal ma. Ñaata la ?":"Benn kilo, baal ma. Gnaata la ?","Bëgg naa saak ceeb.":"Beugg naa saak tcheeb.","Ñaar-fukk ak juróom kilo walla juróom-fukk kilo ?":"Gnaar-fukk ak djuróom kilo walla djuróom-fukk kilo ?","Ñaar-fukk ak juróom kilo.":"Gnaar-fukk ak djuróom kilo.","Ñaari plato nen, baal ma.":"Gnaari plato nen, baal ma.","Fanweer nen ci plato bu nekk.":"Fanweer nen tchi plato bu nekk.","Ñaata ngir ñaar ?":"Gnaata ngir gnaar ?","Ndax jën bi bees na ?":"Ndakh djeun bi bees na ?","Waaw, agsi na ci suba.":"Waaw, agsi na tchi suba.","Ñaari kilo, baal ma.":"Gnaari kilo, baal ma.","Mangoro yii dañuy mag. Ñaata la ?":"Mangoro yii dagnuy mag. Gnaata la ?","Téeméer franc ci benn.":"Téeméer frantch tchi benn.","Dinaa jël fukk.":"Dinaa djeul fukk.","Dama jënd ci baykat bi ci kanam. Ñaata ci saak sooble ?":"Dama djeund tchi baykat bi tchi kanam. Gnaata tchi saak sooble ?","Fukk ak juróom junni ci saak bi, juróom-fukk kilo.":"Fukk ak djuróom djunni tchi saak bi, djuróom-fukk kilo.","Su ma jëlee ñaar-fukk saak, ban njëg la ?":"Su ma djeulee gnaar-fukk saak, ban ndjeug la ?","Ci bérab bu wow te am ngelaw.":"Tchi bérab bu wow te am ngelaw.","Kañ la ngóob bi at mii ?":"Kagn la ngóob bi at mii ?","Ci oktoobar, nawet bi baax na.":"Tchi oktoobar, nawet bi baakh na.","Mën naa commande léegi te jël ko ginnaaw ?":"Meun naa tchommande léegi te djeul ko ginnaaw ?","Danuy wow mangoro yi ci jant bi. Bëgg nga jéem ?":"Danuy wow mangoro yi tchi djant bi. Beugg nga djéem ?","Waaw, dafa suukar. Ñaata ci kilo ?":"Waaw, dafa suukar. Gnaata tchi kilo ?","Ñett junni ci kilo, ci emballaas bu set.":"Gnett djunni tchi kilo, tchi emballaas bu set.","Ndax dangay yónnee ?":"Ndakh dangay yónnee ?","Waaw, livraison du fey bu ëpp juróom-fukk junni.":"Waaw, livraison du fey bu eupp djuróom-fukk djunni.","Sama commande juróom-benn-fukk junni la.":"Sama tchommande djuróom-benn-fukk djunni la.","Bëgg nanu export mangoro yu wow ci Ërop.":"Beugg nanu ekhport mangoro yu wow tchi Europ.","Am nga certifika sécurité alimentaire ?":"Am nga tchertifika sétchurité alimentaire ?","Danuy ko waajal. Etiket bi dina nekk ci angale.":"Danuy ko waadjal. Etiket bi dina nekk tchi angale.","Bëgg nanu kontra appovisionmaŋ ngir benn at.":"Beugg nanu kontra appovisionmang ngir benn at.","Ban quantité ci weer wu nekk ?":"Ban quantité tchi weer wu nekk ?","Ñaari tonn, te qualité bi war na bokk saa su nekk.":"Gnaari tonn, te qualité bi war na bokk saa su nekk.","Danuy jënd ci kooperatif yu jigéen. Mën nga fey ci jamono ngóob bi ?":"Danuy djeund tchi kooperatif yu djigéen. Meun nga fey tchi djamono ngóob bi ?","Waaw, genn-wàll ci ngóob bi, te genn-wàll ginnaaw jaay bi.":"Waaw, genn-wàll tchi ngóob bi, te genn-wàll ginnaaw djaay bi.","Loolu dina dimbali jigéen ñi lool.":"Loolu dina dimbali djigéen gni lool.","Soxla nanu transpoor bu sedd ngir jën bi.":"Sokhla nanu transpoor bu sedd ngir djeun bi.","Kamiyon bu sedd ñaari téeméer junni la ci tukki bu nekk.":"Kamiyon bu sedd gnaari téeméer djunni la tchi tukki bu nekk.","Mën nanu bokk kamiyon bi ak njaay yeneen ?":"Meun nanu bokk kamiyon bi ak ndjaay yeneen ?","Njëg bi day wàññiku ci jamono ngóob bi. Nanu dëgmal njëg bi balaa jamono bi.":"Ndjeug bi day wàgngniku tchi djamono ngóob bi. Nanu deugmal ndjeug bi balaa djamono bi.","Ban njëg nga di joxe ?":"Ban ndjeug nga di djokhe ?","Ñett téeméer franc ci kilo ngir jamono bi bépp.":"Gnett téeméer frantch tchi kilo ngir djamono bi bépp.","Jàng":"Djàng","Xët":"Kheut","Jàngalekat":"Djàngalekat","Mën nga ma jàngal lii ?":"Meun nga ma djàngal lii ?","Mën naa jàng waaye damay bind ndank":"Meun naa djàng waaye damay bind ndank","Naka lañu di bind baat bii ?":"Naka lagnu di bind baat bii ?","Lii mooy lisit njëg yi":"Lii mooy lisit ndjeug yi","Jàngal etiket bi ci kaas bi":"Djàngal etiket bi tchi kaas bi","Damay lim ci sama bopp":"Damay lim tchi sama bopp","Bind xaalis bi ci limu ak araf":"Bind khaalis bi tchi limu ak araf","Soxla naa lunet ngir jàng":"Sokhla naa lunet ngir djàng","Mën nga ma dimbali ma bind mesaas ?":"Meun nga ma dimbali ma bind mesaas ?","Tey dinaa jàng fukk baat yu bees":"Tey dinaa djàng fukk baat yu bees","Limu bii juum na":"Limu bii djuum na","Jàngaat ko, ndank":"Djàngaat ko, ndank","Bind ko ci reçu bi":"Bind ko tchi reçu bi","Bëgg naa jàng ci farañse":"Beugg naa djàng tchi faragnse","Damay jàngal njaay yi jàng ak bind":"Damay djàngal ndjaay yi djàng ak bind","Mag ñi dañuy jàng gaaw ak misaal yu dëgg":"Mag gni dagnuy djàng gaaw ak misaal yu deugg","Danuy jàngal jàng ak njëgu marse bi":"Danuy djàngal djàng ak ndjeugu marse bi","Bind quantité bi, njëg bi ak total bi":"Bind quantité bi, ndjeug bi ak total bi","Xoolal ne total bi jub na":"Khoolal ne total bi djub na","Jàng kontra bi balaa nga signé":"Djàng kontra bi balaa nga signé","Laaj kenn mu leeral la klos yi":"Laadj kenn mu leeral la klos yi","Danuy jëfandikoo telefon ngir jàng":"Danuy djeufandikoo telefon ngir djàng","Mesaas yu baat mën nañu dimbali ñi tàmbali":"Mesaas yu baat meun nagnu dimbali gni tàmbali","Ku nekk am na droit ci jàng":"Ku nekk am na droit tchi djàng","Denc kopi ci dokimaŋ bu nekk":"Dentch kopi tchi dokimang bu nekk","Jàng di tijji bunt yu bees":"Djàng di tidjdji bunt yu bees","Damay jàngal sama kiliyaŋ yi xool seen factuur":"Damay djàngal sama kiliyang yi khool seen fatchtuur","Jàng mooy benn xëyu ci sa bopp":"Djàng mooy benn kheuyu tchi sa bopp","Juróom téeméer franc la.":"Djuróom téeméer frantch la.","Mën nga jàng etiket bii ?":"Meun nga djàng etiket bii ?","Waaw, bind nañu suukar.":"Waaw, bind nagnu suukar.","Te njëg bi ?":"Te ndjeug bi ?","Thiès, ci wetu marse bi.":"Thiès, tchi wetu marse bi.","Tey, juróom ci weeru oktoobar la.":"Tey, djuróom tchi weeru oktoobar la.","Fii, ci suuf xët bi.":"Fii, tchi suuf kheut bi.","Mën nga ma ko jàngal njëkk ?":"Meun nga ma ko djàngal ndjeukk ?","Njëkk, bindal sa tur ak sa sant.":"Ndjeukk, bindal sa tur ak sa sant.","Bëgg naa bind factuur.":"Beugg naa bind fatchtuur.","Njëkk bind produi bi, ba noppi quantité bi.":"Ndjeukk bind produi bi, ba noppi quantité bi.","Ba noppi njëg bi ak total bi ?":"Ba noppi ndjeug bi ak total bi ?","Mën nga ma dimbali ma bind mesaas ngir sama fournisseur ?":"Meun nga ma dimbali ma bind mesaas ngir sama fournisseur ?","Waaw. Lan nga bëgg a wax ?":"Waaw. Lan nga beugg a wakh ?","Bëgg naa juróom-fukk saak ceeb altine.":"Beugg naa djuróom-fukk saak tcheeb altine.","Limu bii juum na.":"Limu bii djuum na.","Dëgg nga. Jàngaat ko, ndank.":"Deugg nga. Djàngaat ko, ndank.","Juróom-ñaar téeméer la, du junni ak juróom-ñaar téeméer.":"Djuróom-gnaar téeméer la, du djunni ak djuróom-gnaar téeméer.","Damay jàngal njaay yi jàng ak bind.":"Damay djàngal ndjaay yi djàng ak bind.","Naka ngay ñu jàngal ?":"Naka ngay gnu djàngal ?","Ak misaal yu dëgg: njëg yi, factuur yi ak mesaas yi.":"Ak misaal yu deugg: ndjeug yi, fatchtuur yi ak mesaas yi.","Jàng kontra bii balaa nga signé.":"Djàng kontra bii balaa nga signé.","Laaj kenn mu leeral la ko. Bul signé lu nga dégguwul.":"Laadj kenn mu leeral la ko. Bul signé lu nga dégguwul.","Damay jàngal sama kiliyaŋ yi xool seen factuur.":"Damay djàngal sama kiliyang yi khool seen fatchtuur.","Lan lañu war a xool ?":"Lan lagnu war a khool ?","Quantité bi, njëg bi ak total bi.":"Quantité bi, ndjeug bi ak total bi.","Danuy jëfandikoo telefon ngir jàng.":"Danuy djeufandikoo telefon ngir djàng.","Mesaas yu baat mën nañu dimbali ñi tàmbali ?":"Mesaas yu baat meun nagnu dimbali gni tàmbali ?","Waaw, dinañu déglu njëkk, ba noppi jàng bind bi.":"Waaw, dinagnu déglu ndjeukk, ba noppi djàng bind bi.","Ku nekk am na droit ci jàng.":"Ku nekk am na droit tchi djàng.","Ba ci juróom-fukk at ?":"Ba tchi djuróom-fukk at ?","Waaw. Jàng di tijji bunt yu bees.":"Waaw. Djàng di tidjdji bunt yu bees.","Am naa ñaar doom":"Am naa gnaar doom","Maa ngi liggéey ci boutik":"Maa ngi liggéey tchi boutik","Fan nga juddoo ?":"Fan nga djuddoo ?","Thiès laa juddoo":"Thiès laa djuddoo","Waxal ndank, baal ma":"Wakhal ndank, baal ma","Mën nga waxaat ko ?":"Meun nga wakhaat ko ?","Maa ngi tudd Moussa, sama sant mooy Jóob.":"Maa ngi tudd Moussa, sama sant mooy Djóob.","Thiès laa juddoo, ci at mi 1993.":"Thiès laa djuddoo, tchi at mi 1993.","Mooy juróom-ñaar juróom-ñaar, benn ñaar ñett, ñeent juróom juróom-benn juróom-ñaar.":"Mooy djuróom-gnaar djuróom-gnaar, benn gnaar gnett, gneent djuróom djuróom-benn djuróom-gnaar.","Am naa ñett rakk yu góor":"Am naa gnett rakk yu góor","Am naa benn rakk bu jigéen":"Am naa benn rakk bu djigéen","Moom mooy sama jabar":"Moom mooy sama djabar","Moom mooy sama jëkkër":"Moom mooy sama djeukkeur","Kii mooy sama xarit bu gëna ma jege":"Kii mooy sama kharit bu geuna ma djege","Danoo bokk dëkk":"Danoo bokk deukk","Sama njaboot dafa bare":"Sama ndjaboot dafa bare","Danuy lekk bokk ci dibéer":"Danuy lekk bokk tchi dibéer","Wax ma ci sa njaboot.":"Wakh ma tchi sa ndjaboot.","Dama bokk dëkk ak sama waajur ak sama ñaar rakk yu jigéen.":"Dama bokk deukk ak sama waadjur ak sama gnaar rakk yu djigéen.","Sóofóor la. Sama yaay mi, légumes la di jaay.":"Sóofóor la. Sama yaay mi, légumes la di djaay.","Ndax am nga njaboot bu bare ?":"Ndakh am nga ndjaboot bu bare ?","Waaw, juróom-ñett nit lanu ci kër gi.":"Waaw, djuróom-gnett nit lanu tchi keur gi.","Dama door liggéey ci juróom-ñett":"Dama door liggéey tchi djuróom-gnett","Dama jeex ci juróom":"Dama djeekh tchi djuróom","Sama patroŋ dafa baax":"Sama patrong dafa baakh","Ndax mën nga ma dalal ngir waxtaan ?":"Ndakh meun nga ma dalal ngir wakhtaan ?","Am naa juróom at ci liggéey bi":"Am naa djuróom at tchi liggéey bi","Kii mooy sama CV":"Kii mooy sama TchV","Dinañu ma fey ci fan weer wi":"Dinagnu ma fey tchi fan weer wi","Maa ngi ci kongé":"Maa ngi tchi kongé","Rendez-vous bi ci fukk la":"Rendez-vous bi tchi fukk la","Soxla naa benn bés ngir noppalu":"Sokhla naa benn bés ngir noppalu","Salaamaalekum. Lu tax nga bëgg liggéey bii ?":"Salaamaalekum. Lu takh nga beugg liggéey bii ?","Bëgg naa liggéey ak nit ñi te damay jàng bu gaaw.":"Beugg naa liggéey ak nit gni te damay djàng bu gaaw.","Ñaata at nga am ci liggéey bi ?":"Gnaata at nga am tchi liggéey bi ?","Am naa ñeent at ci ajaans bu tukki.":"Am naa gneent at tchi adjaans bu tukki.","Ndax mën nga door altine ?":"Ndakh meun nga door altine ?","Waaw, mën naa door altine ci juróom-ñett.":"Waaw, meun naa door altine tchi djuróom-gnett.","Mën nga wàññi njëg bi ?":"Meun nga wàgngni ndjeug bi ?","Dinaa jël ñaar":"Dinaa djeul gnaar","Am nga weccit ?":"Am nga wetchtchit ?","Lii mooy sa weccit":"Lii mooy sa wetchtchit","Ndax njëg bii amul wàññi ?":"Ndakh ndjeug bii amul wàgngni ?","Jox ma wàññi":"Djokh ma wàgngni","Bëgg naa gis beneen kuloor":"Beugg naa gis beneen kuloor","Dinaa dellusi ëllëg":"Dinaa dellusi eulleug","Dalal ak jàmm, soxna. Lan nga bëgg jënd ?":"Dalal ak djàmm, sokhna. Lan nga beugg djeund ?","Bëgg naa ñett kilo sooble. Ñaata la ?":"Beugg naa gnett kilo sooble. Gnaata la ?","Ñeent téeméer la ci kilo bi.":"Gneent téeméer la tchi kilo bi.","Dafa seer. Ñett téeméer ak juróom-fukk, baal ma.":"Dafa seer. Gnett téeméer ak djuróom-fukk, baal ma.","Baax na, ci yaw, ñett téeméer ak juróom-fukk.":"Baakh na, tchi yaw, gnett téeméer ak djuróom-fukk.","Jërëjëf. Lii mooy xaalis bi.":"Djeureudjeuf. Lii mooy khaalis bi.","Ban waxtu la bus bi di dem ?":"Ban wakhtu la bus bi di dem ?","Ñaata waxtu la tukki bi di yàgg ?":"Gnaata wakhtu la tukki bi di yàgg ?","Ndax palaas bii amul boroom ?":"Ndakh palaas bii amul boroom ?","Mën nga ma won ko ci kart bi ?":"Meun nga ma won ko tchi kart bi ?","Wëlbatilal ci càmmoñ, ba noppi ci ndeyjoor":"Weulbatilal tchi tchàmmogn, ba noppi tchi ndeydjoor","Waaw. Juróom-benn junni la.":"Waaw. Djuróom-benn djunni la.","Dina dem ci ñaar waxtu, ci platform bu ñett.":"Dina dem tchi gnaar wakhtu, tchi platform bu gnett.","Ci diggante ñeent waxtu.":"Tchi diggante gneent wakhtu.","Mënuma nelaw":"Meunuma nelaw","Soxla naa doktoor":"Sokhla naa doktoor","Ñaata yoon laa war a naan ko ?":"Gnaata yoon laa war a naan ko ?","Naanal ko bu ñu lekkee":"Naanal ko bu gnu lekkee","Ndax dafa metti lool ?":"Ndakh dafa metti lool ?","Allerjik naa ci lii":"Allerdjik naa tchi lii","Maa ngi gën a woomle tey":"Maa ngi geun a woomle tey","Salaamaalekum. Lan mooy jafe-jafe bi ?":"Salaamaalekum. Lan mooy djafe-djafe bi ?","Ndax am nga sëqët ?":"Ndakh am nga seuqeut ?","Naanal garab gii ñaari yoon ci bés, bu ñu lekkee.":"Naanal garab gii gnaari yoon tchi bés, bu gnu lekkee.","Jërëjëf, doktoor.":"Djeureudjeuf, doktoor.","Xiif naa":"Khiif naa","Benn taabal ngir ñeent, baal ma":"Benn taabal ngir gneent, baal ma","Mën naa gis kart bi ?":"Meun naa gis kart bi ?","Bëgg naa ceebu jën":"Beugg naa tcheebu djeun","Bu ci nekk kaani, baal ma":"Bu tchi nekk kaani, baal ma","Lekk bi neex na lool":"Lekk bi neekh na lool","Mën nanu am facture bi ?":"Meun nanu am fatchture bi ?","Benn kaas ndox, baal ma":"Benn kaas ndokh, baal ma","Dafa xorom lool":"Dafa khorom lool","Salaamaalekum. Benn taabal ngir ñaar ?":"Salaamaalekum. Benn taabal ngir gnaar ?","Waaw, baal ma. Mën nanu gis kart bi ?":"Waaw, baal ma. Meun nanu gis kart bi ?","Waaw, baax na. Lan ngeen bëgg naan ?":"Waaw, baakh na. Lan ngeen beugg naan ?","Ñaari butéel ndox ak benn jus.":"Gnaari butéel ndokh ak benn djus.","Te lan ngeen bëgg lekk ?":"Te lan ngeen beugg lekk ?","Ganaar ak ceeb ngir man, jën ngir sama xarit.":"Ganaar ak tcheeb ngir man, djeun ngir sama kharit.","Ñaar waxtu ak genn-wàll la":"Gnaar wakhtu ak genn-wàll la","Juróom waxtu la":"Djuróom wakhtu la","Ëllëg, talaata la":"Eulleug, talaata la","Démb, ci kër laa nekkoon":"Démb, tchi keur laa nekkoon","Damay yeewu ci juróom-benn":"Damay yeewu tchi djuróom-benn","Bés bu nekk ci suba":"Bés bu nekk tchi suba","Ayu-bi jëm":"Ayu-bi djeum","Fan wi mooy juróom ci weeru mee":"Fan wi mooy djuróom tchi weeru mee","Sama bésu juddu ci oktoobar la":"Sama bésu djuddu tchi oktoobar la","Baal ma, ban waxtu la ?":"Baal ma, ban wakhtu la ?","Ñett waxtu ak fukk simili la.":"Gnett wakhtu ak fukk simili la.","Ban waxtu la jàng bi di tàmbali ?":"Ban wakhtu la djàng bi di tàmbali ?","Ci ñeent waxtu, ci juróom-fukk simili.":"Tchi gneent wakhtu, tchi djuróom-fukk simili.","Ndax jàng bi bés bu nekk la ?":"Ndakh djàng bi bés bu nekk la ?","Déedéet, altine rekk, àllarba ak àjjuma.":"Déedéet, altine rekk, àllarba ak àdjdjuma.","Jàmm nga yendoo ?":"Djàmm nga yendoo ?","Fanaanal ak jàmm":"Fanaanal ak djàmm","Dalal ak jàmm":"Dalal ak djàmm","Jërëjëf bu baax":"Djeureudjeuf bu baakh","Jàmm":"Djàmm","Jëkkër":"Djeukkeur","Jabar":"Djabar","Ëtt":"Eutt","Caabi":"Tchaabi","Dëkk":"Deukk","Wàññi":"Wàgngni","Junni":"Djunni","Jox ma":"Djokh ma","Càmmoñ":"Tchàmmogn","Ndeyjoor":"Ndeydjoor","Bët":"Beut","Gémmiñ":"Gémmign","Xol":"Khol","Xorom":"Khorom","Meññeef":"Megngneef","Buntu ëtt":"Buntu eutt","Patroŋ":"Patrong","Mekanisiyeŋ":"Mekanisiyeng","Ndaje":"Ndadje","Njabootu":"Ndjabootu","Fanaanal jamm":"Fanaanal djamm","Ndax am nga njabootu bu mag ?":"Ndakh am nga ndjabootu bu mag ?","Ndax sa njabootu am na tool ?":"Ndakh sa ndjabootu am na tool ?","Maa ngi tukki ngir gis sama njabootu":"Maa ngi tukki ngir gis sama ndjabootu","Dafa jafe":"Dafa djafe","Ndax jayye nga itam ci internet ?":"Ndakh djayye nga itam tchi internet ?","Maa ngi dem gis sama njabootu":"Maa ngi dem gis sama ndjabootu","Damaa soxla semences ngir sama tool":"Damaa sokhla sementches ngir sama tool","Kitchen":"Kittchhen","Kuran gi dafa taxaw":"Kuran gi dafa takhaw","Salaamaalekum. Damaa soxla semences ngir sama tool.":"Salaamaalekum. Damaa sokhla sementches ngir sama tool.","Dafa baax":"Dafa baakh","Dafa ñaaw":"Dafa gnaaw","Ñaata la?":"Gnaata la?","Baax na lool ! Mën nga ñëw ci test bu dëgg.":"Baakh na lool ! Meun nga gneuw tchi test bu deugg.","Baax na, waaye kontinuwaal jàng.":"Baakh na, waaye kontinuwaal djàng.","Jàngaat tuuti balaa test bi.":"Djàngaat tuuti balaa test bi.","Fii, ñuy laaj la sa bopp : sa tur, sa at yi, foo dëkk, sa liggéey. Tontul ak baat yu leer.":"Fii, gnuy laadj la sa bopp : sa tur, sa at yi, foo deukk, sa liggéey. Tontul ak baat yu leer.","Laaj yi dañuy jëm ci benn mbir (kër, njaboot, liggéey). Tontul ak kàddu gu mat, bul tontu ak benn baat rekk.":"Laadj yi dagnuy djeum tchi benn mbir (keur, ndjaboot, liggéey). Tontul ak kàddu gu mat, bul tontu ak benn baat rekk.","Xool nataal bi te wax li nga gis : nit ñi, béj bi, li ñuy def. Ni : « I can see... ».":"Khool nataal bi te wakh li nga gis : nit gni, bédj bi, li gnuy def. Ni : « I tchan see... ».","Wax sa xalaat te joxal ab sabab. Ni : « I think... because... ».":"Wakh sa khalaat te djokhal ab sabab. Ni : « I think... betchause... ».","Bu sa tontu nuru tontu bu baax, pourcentage bi dafay yokku. 70 % walla ko ëpp = baax na.":"Bu sa tontu nuru tontu bu baakh, pourtchentage bi dafay yokku. 70 % walla ko eupp = baakh na.","Ci 5 sekond yi ñu noppi, xalaatal ci li nga wax.":"Tchi 5 sekond yi gnu noppi, khalaatal tchi li nga wakh.","jërëjëf":"djeureudjeuf","baax":"baakh","ñaata la":"gnaata la","jaay ma":"djaay ma","amul weccu":"amul wetchtchu","jox ma weccu":"djokh ma wetchtchu","ndaje":"ndadje","junni":"djunni","ndox":"ndokh"};
  var CLS = "diisoo-pron";
  function norm(s) { return String(s || "").replace(/\s+/g, " ").trim(); }
  function traiter(el) {
    if (!el || el.nodeType !== 1 || el.classList.contains(CLS)) return;
    if (el.children.length > 0 || el.dataset.pronDone) return;
    var t = norm(el.textContent).replace(/^\S*\uFE0F?\s+(?=\S)/u, function (m) { return /\p{L}/u.test(m) ? m : ""; });
    var p = PRON[t] || PRON[norm(el.textContent)];
    if (!p) return;
    el.dataset.pronDone = "1";
    var d = document.createElement(el.tagName === "P" ? "p" : "span");
    d.className = CLS;
    d.style.cssText = "font-size:10px;color:#9A8F7A;margin-top:1px;" + (el.tagName === "P" ? "" : "display:block;");
    d.textContent = "\uD83D\uDD24 " + p;
    el.insertAdjacentElement("afterend", d);
  }
  function balayer(racine) {
    if (!racine || racine.nodeType !== 1) return;
    if (racine.children.length === 0) { traiter(racine); return; }
    racine.querySelectorAll("p,span,div,h3,h4,td,li").forEach(traiter);
  }
  var attente = null;
  function planifier(n) {
    if (attente) return;
    attente = setTimeout(function () { attente = null; balayer(document.body); }, 150);
  }
  function demarrer() {
    balayer(document.body);
    new MutationObserver(planifier).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-pron.js",e);}

try{
/* ---- diisoo-voix-court.js ---- */
/* diisoo-voix-court.js
 * Corrige les mots wolof courts (Waaw, Ndëk...) ou la voix Oolel ajoute des sons inventes apres le mot.
 * Principe : pour un mot ou deux mots seulement, on arrete la lecture a la fin du mot
 * (premier silence apres la voix, ou duree maximale selon la longueur du mot).
 * Ne modifie aucun fichier existant. Une seule ligne a ajouter dans diisoo-secteurs-loader.js.
 */
(function () {
  "use strict";
  /* Interrupteur de test : ouvrir https://diisoo.sn/?court=0 desactive ce correctif */
  try { if (new URLSearchParams(location.search).get("court") === "0") return; } catch (e) {}
  var ACTIF = false;
  var DEBUG = false; /* message temporaire a l'ecran, passer a false une fois valide */
  function avis(m) { try { if (DEBUG && typeof window.toast === "function") window.toast(m); } catch (e) {} }

  /* Calcule la duree a jouer (secondes) pour un signal mono et un nombre de lettres */
  function dureeUtile(data, rate, lettres, mots) {
    mots = mots || 1;
    var fen = Math.max(1, Math.round(rate * 0.01));
    var n = Math.floor(data.length / fen), rms = new Float32Array(n), max = 0, i, j;
    for (i = 0; i < n; i++) {
      var s = 0;
      for (j = 0; j < fen; j++) { var v = data[i * fen + j]; s += v * v; }
      rms[i] = Math.sqrt(s / fen);
      if (rms[i] > max) max = rms[i];
    }
    var total = data.length / rate;
    var cap = 0.8 + 0.13 * lettres + (mots > 2 ? 0.3 * mots : 0);
    var silenceMin = mots > 2 ? 45 : 25; /* 450 ms pour une phrase, 250 ms pour un mot */
    if (max <= 0) return total;
    var seuil = max * 0.06, debut = -1;
    for (i = 0; i < n; i++) { if (rms[i] > seuil) { debut = i; break; } }
    if (debut < 0) return total;
    var coupe = -1, calme = 0;
    for (i = debut; i < n; i++) {
      if (rms[i] <= seuil) {
        calme++;
        /* silence d'au moins 150 ms apres au moins 150 ms de voix */
        if (calme >= silenceMin && (i - calme + 1 - debut) >= 20) { coupe = (i - calme + 1) * fen / rate + 0.2; break; }
      } else calme = 0;
    }
    var fin = coupe > 0 ? coupe : total;
    var plafond = debut * fen / rate + cap;
    return Math.min(fin, plafond, total);
  }

  function motsCourts(texte) {
    var t = String(texte || "").trim();
    var mots = t.split(/\s+/).filter(function (m) { return /\p{L}/u.test(m); });
    var lettres = t.replace(/[^\p{L}]/gu, "").length;
    return (mots.length >= 1 && mots.length <= 4 && lettres <= 24) ? { lettres: lettres, mots: mots.length } : 0;
  }

  function patcherStart() {
    var AB = window.AudioBufferSourceNode;
    if (!AB || AB.prototype.__diisooCourt) return;
    var orig = AB.prototype.start;
    AB.prototype.start = function (when, offset, duration) {
      try {
        if (ACTIF && this.buffer && duration === undefined && !offset) {
          var d = dureeUtile(this.buffer.getChannelData(0), this.buffer.sampleRate, ACTIF.lettres, ACTIF.mots);
          if (d > 0.2 && d < this.buffer.duration - 0.05) {
            avis("\u2702\uFE0F coupe a " + d.toFixed(1) + "s sur " + this.buffer.duration.toFixed(1) + "s");
            return orig.call(this, when || 0, 0, d);
          }
          avis("mot court, audio de " + this.buffer.duration.toFixed(1) + "s, rien a couper");
        }
      } catch (e) {}
      return orig.apply(this, arguments);
    };
    AB.prototype.__diisooCourt = true;
  }

  function envelopper() {
    var V = window.Diisoo && window.Diisoo.voix;
    if (!V || !V.jouer || V.jouer.__court) return !!(V && V.jouer);
    var orig = V.jouer;
    var nouveau = function (texte, langue) {
      var l = langue === "wo" ? motsCourts(texte) : 0;
      ACTIF = l;
      var r;
      try { r = orig.apply(this, arguments); } catch (e) { ACTIF = false; throw e; }
      return Promise.resolve(r).finally(function () { if (ACTIF === l) ACTIF = false; });
    };
    nouveau.__court = true;
    V.jouer = nouveau;
    return true;
  }

  patcherStart();
  var essais = 0;
  var t = setInterval(function () { if (envelopper() || ++essais > 100) clearInterval(t); }, 100);

  if (typeof module !== "undefined") module.exports = { dureeUtile: dureeUtile, motsCourts: motsCourts };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-voix-court.js",e);}

try{
/* ---- diisoo-essai.js ---- */
/* diisoo-essai.js
 * Ecran d'accueil : permet d'ecouter 3 phrases wolof AVANT de donner son prenom.
 * Fichier autonome, ajoute seulement une carte au-dessus du formulaire. Ne modifie aucun fichier existant.
 */
(function () {
  "use strict";
  var PHRASES = [
    { wo: "Salaam aleekum", fr: "Bonjour", pr: "Salaam aleekum" },
    { wo: "Nanga def ?", fr: "Comment vas-tu ?", pr: "Nanga def ?" },
    { wo: "Jërëjëf", fr: "Merci", pr: "Djeureudjeuf" }
  ];

  function jouer(texte, bouton) {
    var fin = function () { if (bouton) { bouton.disabled = false; bouton.style.opacity = "1"; } };
    try {
      if (bouton) { bouton.disabled = true; bouton.style.opacity = ".6"; }
      var r;
      if (typeof window.speak === "function") r = window.speak(texte, "wo", 0.9);
      else if (window.Diisoo && window.Diisoo.voix) r = window.Diisoo.voix.jouer(texte, "wo");
      Promise.resolve(r).then(fin, fin);
    } catch (e) { fin(); }
  }

  function construire() {
    var ecran = document.getElementById("screen-onboarding");
    var form = document.getElementById("form-onboarding");
    if (!ecran || !form || document.getElementById("diisoo-essai")) return !!document.getElementById("diisoo-essai");
    var carte = document.createElement("div");
    carte.id = "diisoo-essai";
    carte.style.cssText = "background:#141A2B;border:1px solid #1E2740;border-radius:16px;padding:14px;";
    var titre = document.createElement("p");
    titre.style.cssText = "font-size:13px;font-weight:700;color:#E4DCC9;margin:0 0 2px;";
    titre.textContent = "Écoute d'abord, sans t'inscrire";
    var sous = document.createElement("p");
    sous.style.cssText = "font-size:11px;color:#A69C86;margin:0 0 10px;";
    sous.textContent = "Touche une phrase pour l'entendre en wolof.";
    carte.appendChild(titre); carte.appendChild(sous);
    PHRASES.forEach(function (p) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Écouter : " + p.wo);
      b.style.cssText = "display:flex;align-items:center;gap:12px;width:100%;min-height:52px;padding:8px 12px;margin-top:6px;background:#0B0F1C;border:1px solid #1E2740;border-radius:12px;color:inherit;text-align:left;cursor:pointer;";
      var ic = document.createElement("span");
      ic.textContent = "🔊"; ic.style.cssText = "font-size:20px;flex:none;";
      var tx = document.createElement("span");
      tx.style.cssText = "display:block;min-width:0;";
      var l1 = document.createElement("span");
      l1.style.cssText = "display:block;font-size:15px;font-weight:700;color:#5FC98F;";
      l1.textContent = p.wo;
      var l2 = document.createElement("span");
      l2.style.cssText = "display:block;font-size:11px;color:#A69C86;";
      l2.textContent = p.fr; /* la prononciation est ajoutee par diisoo-pron.js */
      tx.appendChild(l1); tx.appendChild(l2);
      b.appendChild(ic); b.appendChild(tx);
      b.addEventListener("click", function () { jouer(p.wo, b); });
      carte.appendChild(b);
    });
    var suite = document.createElement("p");
    suite.style.cssText = "font-size:11px;color:#8C8064;margin:10px 0 0;text-align:center;";
    suite.textContent = "Ça te plaît ? Donne ton prénom ci-dessous pour continuer.";
    carte.appendChild(suite);
    form.parentNode.insertBefore(carte, form);
    return true;
  }

  function demarrer() {
    if (construire()) return;
    var n = 0, t = setInterval(function () { if (construire() || ++n > 40) clearInterval(t); }, 250);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-essai.js",e);}

try{
/* ---- diisoo-accueil.js ---- */
/* diisoo-accueil.js
 * Accueil (tableau de bord) :
 * 1) la carte "Ajoute ton WhatsApp" passe sous les 4 menus (l'action principale reste en haut) ;
 * 2) le champ du numero ne depasse plus de sa carte ;
 * 3) libelles plus clairs : "Dashboard" devient "Accueil", la disquette affiche "Sauvegarder" tant que le progres n'est pas sauvegarde.
 * 4) tout tient sur le premier ecran ; 5) la demande de WhatsApp n'apparait qu'apres 3 jours de pratique.
 * Ne modifie aucun fichier existant : deplace seulement un element deja present et ajoute une regle CSS.
 */
(function () {
  "use strict";
  function css() {
    if (document.getElementById("diisoo-accueil-css")) return;
    var s = document.createElement("style");
    s.id = "diisoo-accueil-css";
    s.textContent =
      "#wa-capture,#wa-capture *{box-sizing:border-box}" +
      "#wa-capture{max-width:100%;overflow:hidden}" +
      "#wa-capture input[type=tel]{min-width:0;width:100%}" +
      "#wa-capture>.flex{max-width:100%}" +
      "#wa-capture>.flex>input{flex:1 1 0%}" +
      /* tout visible des l'entree : espacements et hauteurs reduits (ecran d'accueil seulement) */
      "#screen-dashboard{justify-content:flex-start!important;padding-top:.25rem}" +
      "#screen-dashboard>*+*{margin-top:.5rem!important}" +
      "#screen-dashboard .space-y-3>*+*{margin-top:.5rem!important}" +
      "#screen-dashboard .space-y-3{margin-top:.5rem!important;margin-bottom:0!important}" +
      "#screen-dashboard .grid.grid-cols-2{gap:.5rem!important}" +
      "#screen-dashboard .grid.grid-cols-2>button{min-height:6.4rem!important;padding:.7rem .8rem!important}" +
      "#screen-dashboard .grid.grid-cols-2>button>span{font-size:1.9rem!important;margin-bottom:.2rem!important}" +
      "#screen-dashboard .grid.grid-cols-2>button>h3{font-size:.95rem!important}" +
      "#screen-dashboard .grid.grid-cols-2>button>p{font-size:.68rem!important;margin-top:.15rem!important;line-height:1.2!important}" +
      "#revision-card{padding:.7rem .9rem!important}" +
      /* demande de numero : cachee tant que l'apprenant n'a pas pratique quelques jours */
      "body:not([data-wa-ok]) #wa-capture{display:none!important}" +
      /* libelles plus clairs sans toucher aux scripts qui ecrivent ces boutons */
      "button[aria-label^=\"Sauvegarder mon\"]::after{content:\" Sauvegarder\";font-size:11px;font-weight:700;margin-left:4px}" +
      /* la barre « Revenir » ajoute 56 px en haut : on les retire de la hauteur minimale, sinon CHAQUE page dépasse l'écran de 56 px */
      "body.dnav-on [role=main]{min-height:calc(100vh - 56px)!important;min-height:calc(100dvh - 56px)!important}" +
      "body.dnav-on [role=main]{padding-top:3px!important;padding-bottom:3px!important}" +
      "#screen-test-simulation>div.flex-1{padding-top:4px!important;padding-bottom:4px!important}#test-picker .pt-2{padding-top:4px!important}" +
      "body.dnav-on .fx-lab{display:none!important}.fx-nav{padding:0!important}.fx-nav .fx-dot{margin:2px 1px!important;width:6px!important;height:6px!important}.fx-nav .fx-dot.fx-on{width:12px!important}body:has(#thbar-wolof) #wolof-tabs,body:has(#thbar-general) #general-tabs{display:none!important}" +
      "body:has(#thbar-general) #screen-general>div.text-center,body:has(#thbar-general) #lvlback-general{display:none!important}" +
      "body:has(#thbar-general) #screen-general:not(.hidden){display:flex!important;flex-direction:row;flex-wrap:wrap;gap:6px;align-content:flex-start;margin:0!important}" +
      "body:has(#thbar-general) #screen-general>*{flex:0 0 100%;margin:0!important;max-height:none!important}" +
      "body:has(#thbar-general) #dsn-btn-general,body:has(#thbar-general) #dcv-btn-general{flex:1 1 calc(50% - 4px)!important;min-width:0;padding:5px 8px!important;font-size:13px!important;line-height:1.15!important;min-height:44px;width:auto!important}" +
      "body:has(#thbar-general) #general-content [data-practice]{min-height:0!important;height:auto!important;padding:6px 8px!important;display:flex!important;flex-direction:row!important;align-items:center;justify-content:center;gap:8px}" +
      "body:has(#thbar-general) #general-content [data-practice] .dii-i{font-size:18px!important;line-height:1!important;margin:0!important;width:auto!important;height:auto!important}" +
      "body:has(#thbar-general) #general-content [data-practice] .dii-c{font-size:13.5px!important;margin:0!important}" +
      "body:has(#thbar-general) #general-content .as-btn{min-height:0!important;padding:8px!important}" +
      "body:has(#thbar-wolof) #screen-wolof>div.text-center,body:has(#thbar-wolof) #lvlback-wolof{display:none!important}" +
      "body:has(#thbar-wolof) #screen-wolof:not(.hidden){display:flex!important;flex-direction:row;flex-wrap:wrap;gap:6px;align-content:flex-start;margin:0!important}" +
      "body:has(#thbar-wolof) #screen-wolof>*{flex:0 0 100%;margin:0!important;max-height:none!important}" +
      "body:has(#thbar-wolof) #dsn-btn-wolof,body:has(#thbar-wolof) #dcv-btn-wolof{flex:1 1 calc(50% - 4px)!important;min-width:0;padding:5px 8px!important;font-size:13px!important;line-height:1.15!important;min-height:44px;width:auto!important}" +
      "body:has(#thbar-wolof) #lexicon-container [data-practice]{min-height:0!important;height:auto!important;padding:6px 8px!important;display:flex!important;flex-direction:row!important;align-items:center;justify-content:center;gap:8px}" +
      "body:has(#thbar-wolof) #lexicon-container [data-practice] .dii-i{font-size:18px!important;line-height:1!important;margin:0!important;width:auto!important;height:auto!important}" +
      "body:has(#thbar-wolof) #lexicon-container [data-practice] .dii-c{font-size:13.5px!important;margin:0!important}" +
      "body:has(#thbar-wolof) #lexicon-container .as-btn{min-height:0!important;padding:8px!important}" +
      "body.dnav-on .fx-secs{display:flex!important;flex-wrap:nowrap!important;gap:4px!important;margin:0 0 2px!important}body.dnav-on .fx-sec{flex:1 1 0!important;min-width:0;padding:6px 2px!important;font-size:12.5px!important;min-height:0!important;line-height:1.1!important}" +
      "body.dnav-on .aide-barre{min-height:0!important;padding:2px 8px!important;font-size:12.5px!important}" +
      /* ACCUEIL v3 : tuiles compactes, révision en haut, bouton Continuer */
      "#screen-dashboard:not(.hidden)>div.space-y-3{display:contents!important}" +
      "#screen-dashboard:not(.hidden)>div:first-child{order:0!important}#screen-dashboard #dg-open{order:1!important}#screen-dashboard #dcont{order:2!important}" +
      "#screen-dashboard:not(.hidden)>div.space-y-3>#revision-card{order:3!important;padding:.7rem .9rem!important;border-width:2px!important}" +
      "#screen-dashboard #revision-card h3,#screen-dashboard #revision-card .font-bold{font-size:1rem!important}" +
      "#screen-dashboard:not(.hidden)>div:has(#streak-counter){order:4!important}#screen-dashboard:not(.hidden)>div:has(#xp-bar){order:5!important}" +
      "#screen-dashboard:not(.hidden)>div.space-y-3>.grid{order:6!important;flex:none!important;grid-template-rows:repeat(2,160px)!important;gap:10px!important}" +
      "#screen-dashboard:not(.hidden)>div.space-y-3>button[onclick*=openPremium]{order:7!important}" +
      "#screen-dashboard:not(.hidden)>div:last-child{order:9!important;margin-top:auto!important}" +
      "#screen-dashboard .grid.grid-cols-2>button>span{font-size:2.1rem!important;margin-bottom:.25rem!important}" +
      "#screen-dashboard .grid.grid-cols-2>button{padding:.7rem .9rem!important}#screen-dashboard .grid.grid-cols-2>button>h3{font-size:1.05rem!important;line-height:1.15!important}#screen-dashboard .grid.grid-cols-2>button>p{font-size:.78rem!important;line-height:1.25!important}#screen-dashboard>div.space-y-3>button[onclick*=openPremium]{font-size:13px!important;min-height:0!important;padding:.55rem .9rem!important}#screen-dashboard>div.space-y-3>button[onclick*=openPremium] *{font-size:13px!important;line-height:1.2!important}" +
      /* lisibilité : aucun texte en dessous de 12 px, les petits textes secondaires à 12,5 px */
      "[class*=\"text-[10px]\"],[class*=\"text-[11px]\"],.bz-n{font-size:12.5px!important}" +
      "#screen-dashboard>div:last-child p{font-size:12px!important}" +
      "[style*=\"font-size:11px\"],[style*=\"font-size:10px\"],[style*=\"font-size:9px\"],[style*=\"font-size: 11px\"],[style*=\"font-size: 10px\"]{font-size:12px!important}" +
      ".as-t small,.as-h,.fm-src,.fm-sug small,.fm-mtl,#dii-fmt details,.et-leg,#dii-aide-bulle small,.co-tt,.fx-reel small,.fm-tt,#biz-grid .bz-n,.aide-chip{font-size:12px!important}" +
      /* ACCUEIL v2 : les 4 grands menus d'abord, tout tient sur l'écran, rien à lire, rien à remplir */
      "body:has(#screen-dashboard:not(.hidden)) [role=main]{height:100dvh;min-height:0!important;padding:10px 14px 10px!important;justify-content:flex-start!important}" +
      "#screen-dashboard:not(.hidden){height:100%;display:flex;flex-direction:column;gap:8px;margin:0!important;padding:0!important}" +
      "#screen-dashboard>*{margin:0!important;flex:none}" +
      "#screen-dashboard>div:first-child{padding:0 54px 0 0!important}" +
      "#screen-dashboard #daily-goal,#screen-dashboard #wa-capture,#screen-dashboard #badges-row,#dmic-chip,#dg-welcome,#screen-dashboard #ref-compteur{display:none!important}#screen-dashboard>div:last-child>p{display:block!important;font-size:11.5px!important;line-height:1.3!important;margin:0!important;text-align:center}" +
      "#screen-dashboard:not(.hidden)>div.space-y-3{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;gap:8px}" +
      "#screen-dashboard h1 span span{display:none!important}#welcome-tag{white-space:nowrap}#streak-counter,#xp-label{min-height:0!important;padding:5px 12px!important}#screen-dashboard>div.flex.items-center.justify-between{align-items:center}" +
      "#screen-dashboard>div.space-y-3>*{margin:0!important}" +
      "#screen-dashboard>div.space-y-3>.grid{order:1;flex:1 1 auto;min-height:0;grid-template-rows:1fr 1fr;gap:10px!important}" +
      "#screen-dashboard>div.space-y-3>#revision-card{order:2;padding:.55rem .8rem!important}" +
      "#screen-dashboard>div.space-y-3>#revision-card #revision-sub{display:none}" +
      "#screen-dashboard>div.space-y-3>#revision-card .mb-2{margin:0!important}" +
      "#screen-dashboard>div.space-y-3>button[onclick*=openPremium]{order:3;padding:.5rem .9rem!important}" +
      "#screen-dashboard>div.space-y-3>button[onclick*=partagerDiisoo]{display:none}" +
      "#screen-dashboard .grid.grid-cols-2>button{min-height:0!important;display:flex!important;flex-direction:column;justify-content:flex-start;align-items:flex-start;padding:1.1rem .9rem!important}" +
      "#screen-dashboard .grid.grid-cols-2>button>span{font-size:2.6rem!important;margin-bottom:.35rem!important;line-height:1}" +
      "#screen-dashboard .grid.grid-cols-2>button>h3{font-size:1.1rem!important}" +
      "#screen-dashboard .grid.grid-cols-2>button>p{font-size:.82rem!important}" +
      "#screen-dashboard .grid.grid-cols-2>button[onclick*=openGeneralModule]{order:3}#screen-dashboard .grid.grid-cols-2>button[onclick*=openWolofModule]{order:4}#screen-dashboard .grid.grid-cols-2>button[onclick*=openBusinessModule]{order:2}#screen-dashboard .grid.grid-cols-2>button:not([onclick*=openGeneralModule]):not([onclick*=openWolofModule]):not([onclick*=openBusinessModule]){order:1}" +
      "#dg-open{padding:8px 12px!important}" +
      "#screen-dashboard>div:last-child{padding:0}" +
      /* niveaux d'Anglais : le titre porte le niveau */
      "";
    document.head.appendChild(s);
  }
  function deplacer() {
    var wa = document.getElementById("wa-capture");
    var rev = document.getElementById("revision-card");
    if (!wa || !rev || wa.dataset.accueil) return !!wa;
    var zone = rev.parentNode;                       /* le bloc "space-y-3" qui contient revision + 4 menus */
    var grille = zone && zone.querySelector(".grid.grid-cols-2");
    if (!grille) return false;
    wa.dataset.accueil = "1";
    grille.parentNode.insertBefore(wa, grille.nextSibling);
    return true;
  }
  var JOURS_AVANT_WHATSAPP = 3;
  function joursPratique() {
    var n = 0;
    try {
      var log = JSON.parse(localStorage.getItem("diisoo_daily_xp") || "{}");
      Object.keys(log).forEach(function (k) { if (Number(log[k]) > 0) n++; });
    } catch (e) {}
    try {
      var st = JSON.parse(localStorage.getItem("diisoo_streak") || "{}");
      if (st && Number(st.count) > n) n = Number(st.count);
    } catch (e) {}
    return n;
  }
  function majWhatsApp() {
    try {
      if (joursPratique() >= JOURS_AVANT_WHATSAPP) document.body.setAttribute("data-wa-ok", "1");
      else document.body.removeAttribute("data-wa-ok");
    } catch (e) {}
  }
  function renommer() {
    var h = document.querySelector("#screen-dashboard h1 span span");
    if (h && /dashboard/i.test(h.textContent)) { h.textContent = "Accueil"; return true; }
    return !!h;
  }
  /* difficulté croissante : un thème trop simple pour son niveau est remonté d'un cran, un thème trop dur est descendu */
  function reniveler() {
    try {
      var M = { "Demander son chemin": 1, "Réserver un hôtel": 2 };
      GENERAL_THEMES.forEach(function (t) {
        Object.keys(M).forEach(function (nom) {
          if (String(t.title).indexOf(nom) >= 0 && t.niveau !== M[nom]) { t.niveau = M[nom]; t.title = t.title.replace(/^N\d/, "N" + M[nom]); }
        });
      });
    } catch (e) {}
  }
  function demarrer() {
    reniveler();
    css();
    renommer();
    majWhatsApp();
    setInterval(majWhatsApp, 5000);
    if (deplacer()) return;
    var n = 0, t = setInterval(function () { if (deplacer() || ++n > 40) clearInterval(t); }, 250);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-accueil.js",e);}

try{
/* ---- diisoo-partage.js ---- */
/* diisoo-partage.js
 * Partager sa serie : toucher la pastille "🔥 N jours" ouvre WhatsApp avec un message pret
 * (avec le lien de parrainage de l'apprenant). Aucune place prise en plus sur l'ecran.
 * Fichier autonome : ne modifie aucun fichier existant.
 */
(function () {
  "use strict";
  var ID = "streak-counter";

  function code() {
    try { if (typeof monCodeRef === "function") return monCodeRef(); } catch (e) {}
    try { var c = JSON.parse(localStorage.getItem("diisoo_ref_code")); if (typeof c === "string") return c; } catch (e) {}
    return "";
  }

  function message(n) {
    var lien = "https://diisoo.sn/" + (code() ? "?ref=" + code() : "");
    var debut = n > 1
      ? "\uD83D\uDD25 J'ai " + n + " jours d'affil\u00E9e sur Diisoo, l'application pour apprendre l'anglais et le wolof avec la voix. "
      : "Je t'invite sur Diisoo, l'application pour apprendre l'anglais et le wolof avec la voix. ";
    return debut + "Essaie-la ici : " + lien;
  }

  function partager() {
    var el = document.getElementById(ID);
    var m = el && /(\d+)/.exec(el.textContent || "");
    var n = m ? parseInt(m[1], 10) : 0;
    window.open("https://wa.me/?text=" + encodeURIComponent(message(n)), "_blank", "noopener");
    try { if (typeof majCompteurParrainage === "function") setTimeout(majCompteurParrainage, 1500); } catch (e) {}
  }

  function installer() {
    var el = document.getElementById(ID);
    if (!el) return false;
    if (el.dataset.partage) return true;
    el.dataset.partage = "1";
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("title", "Partager ma s\u00E9rie sur WhatsApp");
    el.style.cursor = "pointer";
    el.addEventListener("click", partager);
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); partager(); } });
    if (!document.getElementById("diisoo-partage-css")) {
      var s = document.createElement("style");
      s.id = "diisoo-partage-css";
      s.textContent = "#" + ID + "{white-space:nowrap;flex:none}#" + ID + "::after{content:\"\\1F4E4\";font-size:11px;margin-left:3px}";
      document.head.appendChild(s);
    }
    return true;
  }

  function demarrer() {
    if (installer()) return;
    var n = 0, t = setInterval(function () { if (installer() || ++n > 40) clearInterval(t); }, 250);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-partage.js",e);}

try{
/* ---- diisoo-ui.js ---- */
/* diisoo-ui.js
 * Uniformise le design de toute l'application : polices, couleurs, boutons, champs, focus.
 * Fichier autonome, ne modifie aucun autre fichier.
 * Ajouter "diisoo-ui.js" EN DERNIER dans le tableau FICHIERS de diisoo-secteurs-loader.js.
 * Déploiement progressif : inactif par défaut. Actif seulement si l'adresse contient ?ui=1
 * (mémorisé ensuite sur l'appareil). ?ui=0 le désactive. Pour l'activer pour tout le monde : ACTIF_PAR_DEFAUT = true.
 */
(function () {
  "use strict";
  var ACTIF_PAR_DEFAUT = true;
  var CLE = "diisooUI";

  var actif = ACTIF_PAR_DEFAUT;
  try {
    var q = new URLSearchParams(location.search).get("ui");
    if (q === "1") localStorage.setItem(CLE, "1");
    if (q === "0") localStorage.removeItem(CLE);
    if (localStorage.getItem(CLE) === "1") actif = true;
    if (q === "0") actif = false;
  } catch (e) {}
  if (!actif) return;
  if (window.__diisooUI) return;
  window.__diisooUI = true;

  var CSS = [
    /* Polices : tout hérite de la police de l'application */
    "button,input,select,textarea{font-family:inherit}",
    /* Champs : 16 px minimum (évite le zoom automatique sur iPhone), hauteur confortable */
    "input:not([type=checkbox]):not([type=radio]):not([type=range]),select,textarea{font-size:16px;min-height:48px;border-radius:12px}",
    /* Texte lisible */
    "body{font-size:16px;line-height:1.5;-webkit-text-size-adjust:100%}",
    /* Focus visible partout (clavier et lecteurs d'écran) */
    ":focus-visible{outline:3px solid var(--gold,#F3A94E);outline-offset:2px}",
    /* Boutons : zone tactile minimale et coins uniformes (classes ajoutées par le script ci-dessous) */
    ".diisoo-ui-btn{min-height:48px;border-radius:14px;touch-action:manipulation;-webkit-tap-highlight-color:transparent}",
    ".diisoo-ui-btn:active{transform:scale(.98)}",
    /* Liens utiles : zone tactile */
    "a.diisoo-ui-link{display:inline-block;min-height:44px;line-height:44px}",
    /* Images et médias ne débordent jamais */
    "img,video,canvas,svg{max-width:100%}",
    "audio{width:100%}",
    /* Défilement doux, sauf pour qui préfère moins de mouvement */
    "@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}"
  ].join("\n");

  var st = document.createElement("style");
  st.id = "diisoo-ui-style";
  st.textContent = CSS;
  document.head.appendChild(st);

  /* Boutons avec du texte : on leur donne une zone tactile de 48 px.
     Les boutons à icône seule (sans texte) ne sont pas touchés pour ne pas déformer les menus. */
  var planifie = false;
  function appliquer() {
    planifie = false;
    var bs = document.querySelectorAll("button:not(.diisoo-ui-btn),[role=button]:not(.diisoo-ui-btn)");
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i];
      var t = (b.textContent || "").replace(/\s+/g, " ").trim();
      var lettres = t.replace(/[^A-Za-zÀ-ÿ0-9]/g, "");
      if (lettres.length >= 3 && b.offsetHeight > 0 && b.offsetHeight < 44) b.classList.add("diisoo-ui-btn");
    }
    var ls = document.querySelectorAll("a[href]:not(.diisoo-ui-link)");
    for (var j = 0; j < ls.length; j++) {
      var a = ls[j];
      if (a.closest("p,li,span") || a.children.length) continue;
      if (a.offsetHeight > 0 && a.offsetHeight < 32 && (a.textContent || "").trim().length >= 3) a.classList.add("diisoo-ui-link");
    }
  }
  function planifier() {
    if (planifie) return;
    planifie = true;
    (window.requestIdleCallback || function (f) { return setTimeout(f, 200); })(appliquer);
  }
  new MutationObserver(planifier).observe(document.body, { childList: true, subtree: true });
  planifier();
  window.DiisooUI = { actif: true, reappliquer: appliquer };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-ui.js",e);}

try{
/* ---- diisoo-coach.js ---- */
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

}catch(e){console.error("Diisoo : erreur dans diisoo-coach.js",e);}

try{
/* ---- diisoo-themes-extra.js ---- */
/* diisoo-themes-extra.js
 * 1) Classe les thèmes d'anglais généraux en 3 niveaux (N1 Débutant complet, N2 Débutant, N3 Pratique réelle).
 * 2) Ajoute 5 thèmes de situations réelles : hôtel, chemin, entretien d'embauche, présenter son activité, commande et livraison.
 * Ne supprime et ne modifie aucune phrase existante. Seul le titre des onglets reçoit un préfixe « N1 · », « N2 · » ou « N3 · ».
 * Wolof : première version écrite par Claude, à faire valider par un locuteur natif avant de communiquer dessus.
 */
(function () {
  "use strict";
  if (window.__diisooThemesExtra) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooThemesExtra = true;

  var NIVEAU = {
    intro: 1, family: 1, food: 1, time: 1,
    work: 2, market: 2, travel: 2, health: 2, housing: 2, directions: 2,
    visa: 3, agri: 3, hotel: 3, interview: 3, pitch: 3, orders: 3
  };

  var NOUVEAUX = [
    {
      id: "hotel", title: "Réserver un hôtel",
      vocab: [
        { en: "Room", fr: "Chambre", wo: "Néeg bi" },
        { en: "Key", fr: "Clé", wo: "Caabi bi" },
        { en: "Night", fr: "Nuit", wo: "Guddi gi" },
        { en: "Breakfast", fr: "Petit-déjeuner", wo: "Ndekki bi" },
        { en: "I have a reservation", fr: "J'ai une réservation", wo: "Am naa réserwasioŋ" },
        { en: "Do you have a free room?", fr: "Avez-vous une chambre libre ?", wo: "Am ngeen néeg bu amul kenn ?" },
        { en: "How much is it per night?", fr: "C'est combien la nuit ?", wo: "Ñaata la guddi gi ?" },
        { en: "Is breakfast included?", fr: "Le petit-déjeuner est-il compris ?", wo: "Ndekki bi dafa nekk ci njëg gi ?" }
      ],
      dialogue: [
        { who: "A", en: "Good evening. How can I help you?", fr: "Bonsoir. Comment puis-je vous aider ?", wo: "Naka laa la mën a dimbali ?" },
        { who: "B", en: "I would like a room for two nights.", fr: "Je voudrais une chambre pour deux nuits.", wo: "Maa ngi bëgg benn néeg ñaari guddi." },
        { who: "A", en: "Single or double?", fr: "Simple ou double ?", wo: "Néeg bu benn nit walla bu ñaari nit ?" },
        { who: "B", en: "A single room, please. How much is it?", fr: "Une chambre simple, s'il vous plaît. C'est combien ?", wo: "Benn néeg bu benn nit, baal ma. Ñaata la ?" },
        { who: "A", en: "It is thirty thousand francs per night, breakfast included.", fr: "C'est trente mille francs la nuit, petit-déjeuner compris.", wo: "Fanweer junni franc la guddi gi, ndekki bi ci biir la." },
        { who: "B", en: "That is fine. Here is my passport.", fr: "C'est bon. Voici mon passeport.", wo: "Baax na. Nii mooy sama paspoor." },
        { who: "A", en: "Thank you. Here is your key. Room twelve.", fr: "Merci. Voici votre clé. Chambre douze.", wo: "Jërëjëf. Nii mooy sa caabi. Néeg bu fukk ak ñaar." }
      ],
      quiz: [
        { q: "I have a ___.", o: ["reservation", "reserve", "reservate"], a: 0, why: "« I have a reservation » = j'ai une réservation." },
        { q: "How much is it ___ night?", o: ["per", "for", "at"], a: 0, why: "« per night » = par nuit." },
        { q: "Is breakfast ___?", o: ["included", "include", "including"], a: 0, why: "« Is breakfast included? » = le petit-déjeuner est-il compris ?" }
      ]
    },
    {
      id: "directions", title: "Demander son chemin",
      vocab: [
        { en: "Left", fr: "Gauche", wo: "Càmmoñ" },
        { en: "Right", fr: "Droite", wo: "Ndeyjoor" },
        { en: "Straight ahead", fr: "Tout droit", wo: "Jubal" },
        { en: "Street", fr: "Rue", wo: "Mbedd mi" },
        { en: "Near", fr: "Près", wo: "Jege" },
        { en: "Far", fr: "Loin", wo: "Sori" },
        { en: "Excuse me, where is the market?", fr: "Excusez-moi, où est le marché ?", wo: "Baal ma, fan la marse bi nekk ?" },
        { en: "Turn left", fr: "Tournez à gauche", wo: "Jëw ci càmmoñ" }
      ],
      dialogue: [
        { who: "A", en: "Excuse me, where is the bus station?", fr: "Excusez-moi, où est la gare routière ?", wo: "Baal ma, fan la gaar bi nekk ?" },
        { who: "B", en: "Go straight, then turn left at the traffic light.", fr: "Allez tout droit, puis tournez à gauche au feu.", wo: "Jubal, noppi jëw ci càmmoñ ci làmp bi." },
        { who: "A", en: "Is it far?", fr: "C'est loin ?", wo: "Dafa sori ?" },
        { who: "B", en: "No, it is five minutes on foot.", fr: "Non, c'est à cinq minutes à pied.", wo: "Déedéet, juroom miniit rekk ci tànk." },
        { who: "A", en: "Thank you very much.", fr: "Merci beaucoup.", wo: "Jërëjëf ci lool." },
        { who: "B", en: "You are welcome.", fr: "Je vous en prie.", wo: "Amul solo." }
      ],
      quiz: [
        { q: "Turn ___ at the traffic light.", o: ["left", "leave", "lift"], a: 0, why: "« Turn left » = tournez à gauche." },
        { q: "How ___ is it?", o: ["far", "long-far", "much-far"], a: 0, why: "« How far is it? » = c'est à quelle distance ?" },
        { q: "Go ___, then turn right.", o: ["straight", "strait", "straigth"], a: 0, why: "« Go straight » = allez tout droit." }
      ]
    },
    {
      id: "interview", title: "Entretien d'embauche",
      vocab: [
        { en: "Experience", fr: "Expérience", wo: "Eksperiyaas" },
        { en: "Skills", fr: "Compétences", wo: "Xam-xam yi" },
        { en: "Salary", fr: "Salaire", wo: "Peyoor" },
        { en: "Tell me about yourself", fr: "Parlez-moi de vous", wo: "Wax ma ci sa bopp" },
        { en: "I have five years of experience", fr: "J'ai cinq ans d'expérience", wo: "Am naa juroom at ci liggéey bi" },
        { en: "Why do you want this job?", fr: "Pourquoi voulez-vous ce poste ?", wo: "Lu tax nga bëgg liggéey bii ?" },
        { en: "I can start next month", fr: "Je peux commencer le mois prochain", wo: "Mën naa tàmbali weer wi di ñëw" },
        { en: "I am reliable", fr: "Je suis fiable", wo: "Ñuy wóolu ma" }
      ],
      dialogue: [
        { who: "A", en: "Tell me about yourself.", fr: "Parlez-moi de vous.", wo: "Wax ma ci sa bopp." },
        { who: "B", en: "I am a logistics graduate with five years of experience.", fr: "Je suis diplômé en logistique avec cinq ans d'expérience.", wo: "Maa ngi jàng lojistik te am naa juroom at ci liggéey bi." },
        { who: "A", en: "Why do you want this job?", fr: "Pourquoi voulez-vous ce poste ?", wo: "Lu tax nga bëgg liggéey bii ?" },
        { who: "B", en: "I like organizing transport and working with a team.", fr: "J'aime organiser le transport et travailler en équipe.", wo: "Bëgg naa tëral yoonu transpoor te liggéey ak mbooloo mi." },
        { who: "A", en: "What is your greatest strength?", fr: "Quel est votre point fort ?", wo: "Lan mooy sa kàttan bu ëpp ?" },
        { who: "B", en: "I am reliable and I solve problems quickly.", fr: "Je suis fiable et je résous vite les problèmes.", wo: "Ñuy wóolu ma te di leru jafe-jafe yi ci gaaw." },
        { who: "A", en: "When can you start?", fr: "Quand pouvez-vous commencer ?", wo: "Kañ nga mën a tàmbali ?" },
        { who: "B", en: "I can start next month.", fr: "Je peux commencer le mois prochain.", wo: "Mën naa tàmbali weer wi di ñëw." }
      ],
      quiz: [
        { q: "I have five years of ___.", o: ["experience", "experiences", "experiment"], a: 0, why: "« experience » est indénombrable ici : five years of experience." },
        { q: "Tell me about ___.", o: ["yourself", "you", "your"], a: 0, why: "« Tell me about yourself » = parlez-moi de vous." },
        { q: "When can you ___?", o: ["start", "starting", "to start"], a: 0, why: "Après « can », le verbe reste à l'infinitif sans « to »." }
      ]
    },
    {
      id: "pitch", title: "Présenter son activité",
      vocab: [
        { en: "Company", fr: "Entreprise", wo: "Kompaañi bi" },
        { en: "Customer", fr: "Client", wo: "Kiliyaŋ bi" },
        { en: "Product", fr: "Produit", wo: "Produi bi" },
        { en: "Catalogue", fr: "Catalogue", wo: "Katalog bi" },
        { en: "I run a small business in Thiès", fr: "Je dirige une petite entreprise à Thiès", wo: "Maa ngi jiite ab liggéeyukaay bu ndaw ci Cees" },
        { en: "We sell and export local products", fr: "Nous vendons et exportons des produits locaux", wo: "Ñu ngi jaay te di yónnee yëfi réew mi" },
        { en: "We are looking for a reliable partner", fr: "Nous cherchons un partenaire fiable", wo: "Ñu ngi seet ab pàrtneer bu ñuy wóolu" },
        { en: "Can I send you our catalogue?", fr: "Puis-je vous envoyer notre catalogue ?", wo: "Mën naa la yónnee sunu katalog ?" }
      ],
      dialogue: [
        { who: "A", en: "Nice to meet you. What does your company do?", fr: "Enchanté. Que fait votre entreprise ?", wo: "Neex na ma xam la. Lu sa liggéeyukaay def ?" },
        { who: "B", en: "We sell and export local products from Senegal.", fr: "Nous vendons et exportons des produits locaux du Sénégal.", wo: "Ñu ngi jaay te di yónnee yëfi réew mi ci Senegaal." },
        { who: "A", en: "How long have you been in business?", fr: "Depuis quand êtes-vous en activité ?", wo: "Ñaata at ngeen am ci liggéey bi ?" },
        { who: "B", en: "Since 2022. We have clients in Dakar and Thiès.", fr: "Depuis 2022. Nous avons des clients à Dakar et à Thiès.", wo: "Li dale 2022. Am nanu kiliyaŋ ci Ndakaaru ak Cees." },
        { who: "A", en: "What are you looking for?", fr: "Que cherchez-vous ?", wo: "Lan ngeen di seet ?" },
        { who: "B", en: "We are looking for a reliable partner abroad. Can I send you our catalogue?", fr: "Nous cherchons un partenaire fiable à l'étranger. Puis-je vous envoyer notre catalogue ?", wo: "Ñu ngi seet ab pàrtneer bu ñuy wóolu ci biti. Mën naa la yónnee sunu katalog ?" }
      ],
      quiz: [
        { q: "We ___ local products.", o: ["sell", "sells", "selling"], a: 0, why: "« We sell » : pas de -s avec we." },
        { q: "We are looking ___ a partner.", o: ["for", "to", "at"], a: 0, why: "« look for » = chercher." },
        { q: "Can I send you our ___?", o: ["catalogue", "catalogue's", "cataloguing"], a: 0, why: "« catalogue » = catalogue de produits." }
      ]
    },
    {
      id: "orders", title: "Commande & livraison",
      vocab: [
        { en: "Order", fr: "Commande", wo: "Komaand bi" },
        { en: "Quantity", fr: "Quantité", wo: "Kantite bi" },
        { en: "Delivery", fr: "Livraison", wo: "Yónnee bi" },
        { en: "Invoice", fr: "Facture", wo: "Faktiir bi" },
        { en: "I want to place an order", fr: "Je veux passer une commande", wo: "Bëgg naa def ab komaand" },
        { en: "How many pieces do you need?", fr: "Combien de pièces vous faut-il ?", wo: "Ñaata pyes ngeen soxla ?" },
        { en: "When will the goods arrive?", fr: "Quand les marchandises arriveront-elles ?", wo: "Kañ la marsandiis yi di agsi ?" },
        { en: "Can you send me the invoice?", fr: "Pouvez-vous m'envoyer la facture ?", wo: "Mën ngeen ma yónnee faktiir bi ?" }
      ],
      dialogue: [
        { who: "A", en: "Hello, I would like to place an order.", fr: "Bonjour, je voudrais passer une commande.", wo: "Salaamaleekum, bëgg naa def ab komaand." },
        { who: "B", en: "Sure. How many pieces do you need?", fr: "Bien sûr. Combien de pièces vous faut-il ?", wo: "Waaw. Ñaata pyes ngeen soxla ?" },
        { who: "A", en: "Five hundred pieces. What is the price?", fr: "Cinq cents pièces. Quel est le prix ?", wo: "Juroom téeméer pyes. Ñaata la njëg gi ?" },
        { who: "B", en: "For five hundred pieces, it is two dollars each.", fr: "Pour cinq cents pièces, c'est deux dollars l'unité.", wo: "Ci juroom téeméer pyes, ñaari dolaar la ci benn." },
        { who: "A", en: "When will the goods arrive in Dakar?", fr: "Quand les marchandises arriveront-elles à Dakar ?", wo: "Kañ la marsandiis yi di agsi Ndakaaru ?" },
        { who: "B", en: "Delivery takes three weeks by sea. I will send the invoice today.", fr: "La livraison prend trois semaines par bateau. J'envoie la facture aujourd'hui.", wo: "Yónnee bi dafay jël ñetti ayubés ci géej. Dinaa yónnee faktiir bi tey." }
      ],
      quiz: [
        { q: "How ___ pieces do you need?", o: ["many", "much", "more"], a: 0, why: "« pieces » se compte : how many." },
        { q: "The minimum ___ is one hundred pieces.", o: ["order", "ordering", "ordered"], a: 0, why: "« minimum order » = commande minimum." },
        { q: "Delivery ___ two weeks.", o: ["takes", "take", "taking"], a: 0, why: "Sujet singulier (delivery) : takes." }
      ]
    }
  ];

  var ids = {};
  G.forEach(function (t) { ids[t.id] = true; });
  NOUVEAUX.forEach(function (t) { if (!ids[t.id]) G.push(t); });

  G.forEach(function (t) {
    var n = NIVEAU[t.id] || 3;
    t.niveau = n;
    if (!/^N[123] · /.test(t.title)) t.title = "N" + n + " · " + t.title;
  });
  G.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3); });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-themes-extra.js",e);}

try{
/* ---- diisoo-lecons.js ---- */
/* diisoo-lecons.js
 * Leçons d'anglais générales : affiche la prononciation simplifiée sous chaque phrase
 * et ajoute un bouton « Coach » (écouter, répéter, se réécouter) sous chaque carte.
 * Dépend de diisoo-coach.js (à charger avant). Ne modifie aucun autre fichier.
 * La prononciation simplifiée est une AIDE (écriture pour francophones). Prélecture à valider.
 */
(function () {
  "use strict";
  if (window.__diisooLecons) return;
  window.__diisooLecons = true;

  var PRON_EN = {"Left":"Lèft","Right":"Raït","Straight ahead":"Stréït ahèd","Street":"Strît","Near":"Nir","Far":"Far","Excuse me, where is the market?":"Èkskiouz mi, wèr iz zi markit ?","Turn left":"Teurn lèft","Room":"Roum","Key":"Kî","Night":"Naït","Breakfast":"Brèkfast","I have a reservation":"Aï hav a rézeurvéïchen","Do you have a free room?":"Dou you hav a frî roum ?","How much is it per night?":"Haou meutch iz it peur naït ?","Is breakfast included?":"Iz brèkfast inklioudid ?","Experience":"Ekspirièns","Skills":"Skilz","Salary":"Saleuri","Tell me about yourself":"Tèl mi abaout yorsèlf","I have five years of experience":"Aï hav faïv yeurz ov ekspirièns","Why do you want this job?":"Waï dou you wont ziss djob ?","I can start next month":"Aï kan start nèkst meunth","I am reliable":"Aï am rilaïabel","Company":"Keumpani","Customer":"Keustomeur","Product":"Prodakt","Catalogue":"Katalog","I run a small business in Thiès":"Aï reun a smol biznis in Tiès","We sell and export local products":"Wi sèl and èksport lôkal prodakts","We are looking for a reliable partner":"Wi ar loukinng for a rilaïabel partneur","Can I send you our catalogue?":"Kan aï sènd you aour katalog ?","Order":"Ordeur","Quantity":"Kouantiti","Delivery":"Dilivri","Invoice":"Inn-voïss","I want to place an order":"Aï wont tou pléïss an ordeur","How many pieces do you need?":"Haou mèni pîssiz dou you nîd ?","When will the goods arrive?":"Wèn wil zi goudz araïv ?","Can you send me the invoice?":"Kan you sènd mi zi inn-voïss ?","My name is...": "Maï néïm iz...","I am from Senegal": "Aï am frome Sénégal","Nice to meet you": "Naïce tou mîte you","I am a student": "Aï am a stioudent","How old are you?": "Haou ôld ar you ?","I am thirty years old": "Aï am theurti yeurz ôld","Where do you live?": "Wèr dou you liv ?","I live in Thiès": "Aï liv in Tiès","What do you do for a living?": "Wot dou you dou for a livinng ?","I speak English and French": "Aï spîk Inngliche and Frènntch","Can you spell your name?": "Kan you spèl yor néïm ?","F-A-T-O-U": "Èf-Eï-Ti-Ô-You","Family": "Fameli","Father": "Fa-zeur","Mother": "Meu-zeur","Brother": "Breu-zeur","Sister": "Sisteur","I have three children": "Aï hav thri tchildren","My mother lives with us": "Maï meu-zeur livz wiz eus","We eat together every evening": "Wi ît tou-guè-zeur èvri îvninng","My father is a driver": "Maï fa-zeur iz a draïveur","I love my family very much": "Aï leuv maï fameli vèri meutch","Who is the oldest in your family?": "Hou iz zi ôldist in yor fameli ?","My grandmother is the oldest": "Maï grandmeu-zeur iz zi ôldist","Work": "Weurk","Job": "Djob","Every day": "Èvri déï","Busy": "Bizi","Colleague": "Kolîg","I start work at eight o'clock": "Aï start weurk at éït o-klok","I finish work at five o'clock": "Aï finiche weurk at faïv o-klok","I work in an office": "Aï weurk in an offiss","My job is difficult but interesting": "Maï djob iz difikeult beut intrestinng","I am looking for a new job": "Aï am loukinng for a niou djob","I like helping customers": "Aï laïk hèlpinng keustomeurz","I take a short break at noon": "Aï téïk a chort bréïk at noun","Market": "Markit","Price": "Praïce","Money": "Meuni","Buy": "Baï","Cheap": "Tchîp","How much does it cost?": "Haou meutch deuz it kost ?","That is too expensive": "Zat iz tou ekspènnsiv","Can you make it cheaper?": "Kan you méïk it tchîpeur ?","I would like to buy some rice": "Aï woud laïk tou baï seum raïce","Do you accept mobile money?": "Dou you aksèpt môbaïl meuni ?","How much are the tomatoes?": "Haou meutch ar zi tomêtôz ?","Could you give me a discount?": "Koud you guiv mi a diskaount ?","Airport": "Èrport","Ticket": "Tikit","Passport": "Passport","Flight": "Flaït","Bus": "Beuss","I would like to book a ticket": "Aï woud laïk tou bouk a tikit","What time does the bus leave?": "Wot taïm deuz zi beuss lîv ?","Where is the nearest bus stop?": "Wèr iz zi nirist beuss stop ?","I am traveling to visit my family": "Aï am travelinng tou vizit maï fameli","Do I need a visa for this country?": "Dou aï nîd a vîza for ziss keuntri ?","How do you get to work?": "Haou dou you guét tou weurk ?","I take the bus every morning": "Aï téïk zi beuss èvri morninng","Doctor": "Doktor","Hospital": "Hospitel","Sick": "Sik","Medicine": "Médsin","Help": "Hèlp","I have a headache": "Aï hav a hèdéïk","I need to see a doctor": "Aï nîd tou sî a doktor","Where is the nearest hospital?": "Wèr iz zi nirist hospitel ?","I feel better today": "Aï fîl bèteur toudéï","Please call an ambulance": "Plîz kol an ambioulenss","Take one tablet twice a day": "Téïk wan tablèt twaïce a déï","Since when do you feel sick?": "Sinss wèn dou you fîl sik ?","Restaurant": "Rèstorant","Menu": "Mènniou","Water": "Wotteur","Delicious": "Dilichess","Bill": "Bil","I am hungry": "Aï am heunngri","What do you recommend?": "Wot dou you rékomènd ?","I would like some rice and fish": "Aï woud laïk seum raïce and fiche","This meal is very tasty": "Ziss mîl iz vèri téïsti","Can I have the bill, please?": "Kan aï hav zi bil, plîz ?","What is your favourite dish?": "Wot iz yor féïvorit diche ?","I like thieboudienne": "Aï laïk tiébou-diène","Today": "Toudéï","Tomorrow": "Toumorô","Yesterday": "Yèsteurdéï","Number": "Neumbeur","Time": "Taïm","What time is it now?": "Wot taïm iz it naou ?","I will see you tomorrow morning": "Aï wil sî you toumorô morninng","The meeting starts at ten o'clock": "Zi mîtinng starts at tèn o-klok","I was busy yesterday": "Aï woz bizi yèsteurdéï","How many people are coming?": "Haou mèni pîpel ar keuminng ?","What time do you wake up?": "Wot taïm dou you wéïk eup ?","I wake up at six every morning": "Aï wéïk eup at siks èvri morninng","Visa application": "Vîza aplikéïchen","Purpose of visit": "Peurpeuss ov vizit","I am visiting my family": "Aï am vizitinng maï fameli","Return ticket": "Ritèrn tikit","How long will you stay?": "Haou lonng wil you stéï ?","I will stay for two weeks": "Aï wil stéï for tou wîks","Who is paying for your trip?": "Hou iz péïinng for yor trip ?","I am paying for myself": "Aï am péïinng for maïsèlf","Do you have accommodation booked?": "Dou you hav akomodéïchen boukt ?","I am looking for an apartment": "Aï am loukinng for an apartment","How much is the rent?": "Haou meutch iz zi rènt ?","Is the deposit included?": "Iz zi dipozit inklioudid ?","Landlord": "Lanndlord","Tenant": "Ténnant","The electricity is not working": "Zi ilèktrissiti iz not weurkinng","Can I visit the house?": "Kan aï vizit zi haouss ?","How many rooms are there?": "Haou mèni roumz ar zèr ?","I need to sign the lease": "Aï nîd tou saïn zi lîss","The neighbourhood is quiet": "Zi néïbeur-houd iz kouaïet","Seeds": "Sîdz","Fertilizer": "Feurtilaïzeur","Field": "Fîld","Harvest": "Harvist","Farmer": "Farmeur","I need seeds for my field": "Aï nîd sîdz for maï fîld","How much is a bag of fertilizer?": "Haou meutch iz a bag ov feurtilaïzeur ?","Do these seeds grow well in the rainy season?": "Dou zîz sîdz grô wèl in zi réïni sîzen ?","I water my crops every morning": "Aï wotteur maï krops èvri morninng","The harvest was good this year": "Zi harvist woz goud ziss yir","I sell my vegetables at the Thiès market": "Aï sèl maï vèdjtabelz at zi Tiès markit","Can you deliver to my farm?": "Kan you délivèr tou maï farm ?"};

  window.DiisooPronEN = Object.assign(window.DiisooPronEN || {}, PRON_EN);

  function theme() { try { return typeof currentGeneralTheme === "function" ? currentGeneralTheme() : null; } catch (e) { return null; } }

  function ouvrirCoach(t, i) {
    var w = t.vocab[i];
    if (!w || !window.DiisooCoach) return;
    var suiv = t.vocab[i + 1] ? function () { ouvrirCoach(t, i + 1); } : null;
    window.DiisooCoach.ouvrir({ en: w.en, pron: PRON_EN[w.en] || "", wo: w.wo || "", fr: w.fr || "", suivant: suiv });
  }

  function enrichir() {
    if (!window.DiisooCoach) return;
    var t = theme();
    if (!t || !t.vocab) return;
    var btns = document.querySelectorAll('button[data-practice^="gen-l:"]');
    btns.forEach(function (b) {
      var parts = String(b.getAttribute("data-practice")).split(":");
      var i = parseInt(parts[2], 10);
      if (isNaN(i) || parts[1] !== t.id || !t.vocab[i]) return;
      var grille = b.parentElement, carte = grille && grille.parentElement;
      if (!carte || carte.getAttribute("data-dii-lecon") === "1") return;
      carte.setAttribute("data-dii-lecon", "1");
      var w = t.vocab[i];
      var p = PRON_EN[w.en];
      var titre = carte.querySelector("p");
      if (p && titre) {
        var l = document.createElement("p");
        l.className = "diisoo-pron-en";
        l.style.cssText = "font-size:12px;color:#F3A94E;margin-top:2px;";
        l.textContent = "Prononce : " + p;
        titre.parentNode.insertBefore(l, titre.nextSibling);
      }
      var c = document.createElement("button");
      c.type = "button";
      c.textContent = "🎓 Coach vocal";
      c.style.cssText = "width:100%;min-height:44px;border-radius:12px;border:1px solid #F3A94E;background:transparent;color:#F3A94E;font-weight:700;font-size:13px;";
      c.onclick = function () { ouvrirCoach(t, i); };
      grille.parentNode.insertBefore(c, grille.nextSibling);
    });
  }

  var plan = false;
  function planifier() {
    if (plan) return; plan = true;
    setTimeout(function () { plan = false; try { enrichir(); } catch (e) {} }, 250);
  }
  new MutationObserver(planifier).observe(document.body, { childList: true, subtree: true });
  planifier();
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-lecons.js",e);}

try{
/* ---- diisoo-reseau.js ---- */
/* diisoo-reseau.js
 * Bandeau simple quand la connexion est coupée ou très lente. Ne touche à aucune requête.
 * Ajouter "diisoo-reseau.js" à la fin du tableau FICHIERS de diisoo-secteurs-loader.js.
 */
(function () {
  "use strict";
  if (window.__diisooReseau) return;
  window.__diisooReseau = true;

  var barre = null, masque = null;

  function lente() {
    try {
      var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      return !!c && (c.saveData === true || /^(slow-2g|2g)$/.test(c.effectiveType || ""));
    } catch (e) { return false; }
  }

  function afficher(texte, couleur) {
    clearTimeout(masque);
    if (!barre) {
      barre = document.createElement("div");
      barre.setAttribute("role", "status");
      barre.setAttribute("aria-live", "polite");
      barre.style.cssText = "position:fixed;left:0;right:0;top:0;z-index:99998;padding:10px 14px;font:600 14px/1.4 system-ui,sans-serif;text-align:center;color:#0B0F1C;";
      document.body.appendChild(barre);
    }
    barre.style.background = couleur;
    barre.textContent = texte;
    barre.style.display = "block";
  }
  function cacher() { if (barre) barre.style.display = "none"; }

  function etat() {
    if (navigator.onLine === false) {
      afficher("Pas de connexion. Les leçons déjà ouvertes restent disponibles. Les voix demandent internet.", "#F3A94E");
    } else if (lente()) {
      afficher("Connexion lente. Les voix peuvent mettre plus de temps à arriver.", "#F6F1E7");
      masque = setTimeout(cacher, 6000);
    } else {
      afficher("Connexion rétablie.", "#5FC98F");
      masque = setTimeout(cacher, 2500);
    }
  }

  window.addEventListener("offline", etat);
  window.addEventListener("online", etat);
  try {
    var c = navigator.connection;
    if (c && c.addEventListener) c.addEventListener("change", function () { if (navigator.onLine !== false && lente()) etat(); });
  } catch (e) {}
  if (navigator.onLine === false) etat();
  else if (lente()) etat();
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-reseau.js",e);}

try{
/* ---- diisoo-coach-liens.js ---- */
/* diisoo-coach-liens.js
 * Branche le coach vocal (diisoo-coach.js) dans les Outils Business et dans les modules « Anglais des marchés ».
 * Les simulateurs d'examens (IELTS, TOEFL...) gardent leur propre moteur micro : le coach n'y est pas ajouté.
 * Charger APRES diisoo-coach.js et diisoo-lecons.js. Ne modifie aucun autre fichier.
 */
(function () {
  "use strict";
  if (window.__diisooCoachLiens) return;
  window.__diisooCoachLiens = true;

  var STYLE = "width:100%;min-height:44px;margin-top:6px;border-radius:12px;border:1px solid #F3A94E;background:transparent;color:#F3A94E;font-weight:700;font-size:13px;";
  function pron(en) { var P = window.DiisooPronEN || {}; return P[en] || ""; }
  function bouton(onclick) {
    var c = document.createElement("button");
    c.type = "button"; c.textContent = "🎓 Coach vocal"; c.style.cssText = STYLE; c.onclick = onclick;
    return c;
  }

  /* 1) Outils Business : cartes de vocabulaire (boutons data-biz) */
  function business() {
    var T; try { T = typeof CHINA_TRADE_WOLOF !== "undefined" ? CHINA_TRADE_WOLOF : null; } catch (e) { T = null; }
    if (!T) return;
    document.querySelectorAll('button[data-biz="en"]').forEach(function (b) {
      var sec = b.getAttribute("data-sec"), i = parseInt(b.getAttribute("data-i"), 10);
      var grille = b.parentElement, carte = grille && grille.parentElement;
      if (!carte || carte.getAttribute("data-dii-coach") === "1" || !T[sec] || !T[sec].vocab[i]) return;
      carte.setAttribute("data-dii-coach", "1");
      var lancer = function (k) {
        var v = T[sec].vocab[k]; if (!v || !window.DiisooCoach) return;
        window.DiisooCoach.ouvrir({
          en: v.en, pron: pron(v.en), wo: v.wo || "", fr: v.fr || "",
          suivant: T[sec].vocab[k + 1] ? function () { lancer(k + 1); } : null
        });
      };
      var cible = carte.querySelector('button[onclick^="practiceBusinessPhrase"]') || grille;
      cible.parentNode.insertBefore(bouton(function () { lancer(i); }), cible.nextSibling);
    });
  }

  /* 2) Modules « Anglais des marchés » : cartes .mk-card */
  function marches() {
    document.querySelectorAll(".mk-card").forEach(function (carte) {
      if (carte.getAttribute("data-dii-coach") === "1" || carte.querySelector(".mk-choix")) return;
      var en = carte.querySelector(".mk-en, .mk-big");
      if (!en) return;
      var texte = (en.textContent || "").trim();
      if (!texte) return;
      carte.setAttribute("data-dii-coach", "1");
      var frEl = carte.querySelector(".mk-fr"), woEl = carte.querySelector(".mk-wo");
      var fr = frEl ? frEl.textContent.trim() : "";
      var wo = woEl ? woEl.textContent.replace(/^\s*🗣️\s*/, "").trim() : "";
      var b = bouton(function () {
        if (window.DiisooCoach) window.DiisooCoach.ouvrir({ en: texte, pron: pron(texte), wo: wo, fr: fr });
      });
      var suivant = carte.querySelector("#mk-next");
      if (suivant) suivant.parentNode.insertBefore(b, suivant); else carte.appendChild(b);
    });
  }

  var plan = false;
  function planifier() {
    if (plan) return; plan = true;
    setTimeout(function () { plan = false; try { if (window.DiisooCoach) { business(); marches(); } } catch (e) {} }, 250);
  }
  new MutationObserver(planifier).observe(document.body, { childList: true, subtree: true });
  planifier();
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-coach-liens.js",e);}

try{
/* ---- diisoo-examens-coach.js ---- */
/* diisoo-examens-coach.js
 * Entraînement oral pour les examens (IELTS Life Skills A1, TOEFL, TOEIC, Cambridge, Duolingo, PTE).
 * Ajoute un bouton « Entraînement oral » sous la liste des tests : phrases modèles à écouter et répéter avec le coach.
 * Séparé du simulateur : aucun minuteur, aucune note, aucun test existant modifié.
 * Charger APRES diisoo-coach.js. Prononciation simplifiée : prélecture à valider.
 */
(function () {
  "use strict";
  if (window.__diisooExamCoach) return;
  window.__diisooExamCoach = true;

  var DATA = {"ielts": {"nom": "IELTS Life Skills A1", "p": [{"en": "My name is ___ and I come from Senegal.", "fr": "Je m'appelle ___ et je viens du Sénégal.", "pr": "Maï néïm iz ___ and aï keum from Sénégal"}, {"en": "I live in Thiès with my family.", "fr": "J'habite à Thiès avec ma famille.", "pr": "Aï liv in Tiès wiz maï fameli"}, {"en": "I work as a driver.", "fr": "Je travaille comme chauffeur.", "pr": "Aï weurk az a draïveur"}, {"en": "I like football and I like cooking.", "fr": "J'aime le football et la cuisine.", "pr": "Aï laïk foutbol and aï laïk koukinng"}, {"en": "In the picture I can see two people.", "fr": "Sur l'image, je vois deux personnes.", "pr": "In zi piktcheur aï kan sî tou pîpel"}, {"en": "They are happy and they are talking.", "fr": "Ils sont contents et ils parlent.", "pr": "Zéï ar hapi and zéï ar tokinng"}, {"en": "I think it is a good idea because it is cheap.", "fr": "Je pense que c'est une bonne idée parce que ce n'est pas cher.", "pr": "Aï thinnk it iz a goud aïdia bikoz it iz tchîp"}, {"en": "Could you repeat that, please?", "fr": "Pouvez-vous répéter, s'il vous plaît ?", "pr": "Koud you ripît zat, plîz ?"}]}, "toefl": {"nom": "TOEFL Speaking", "p": [{"en": "I prefer to study in the library because it is quiet.", "fr": "Je préfère étudier à la bibliothèque parce que c'est calme.", "pr": "Aï prifeur tou stoudi in zi laïbrèri bikoz it iz kouaïet"}, {"en": "For example, last week I studied there for three hours.", "fr": "Par exemple, la semaine dernière, j'y ai étudié trois heures.", "pr": "For ègzampel, last wîk aï steudid zèr for thri aourz"}, {"en": "In my opinion, group work is more useful.", "fr": "À mon avis, le travail en groupe est plus utile.", "pr": "In maï opinienn, groupe weurk iz mor iousfoul"}, {"en": "There are two reasons for my choice.", "fr": "Il y a deux raisons à mon choix.", "pr": "Zèr ar tou rîzenz for maï tchoïss"}, {"en": "First, it saves time. Second, it saves money.", "fr": "D'abord, cela fait gagner du temps. Ensuite, de l'argent.", "pr": "Feurst, it séïvz taïm. Sèkend, it séïvz meuni"}, {"en": "In the picture, the students are reading books.", "fr": "Sur l'image, les étudiants lisent des livres.", "pr": "In zi piktcheur, zi stioudents ar rîdinng bouks"}, {"en": "I agree with this statement because it is practical.", "fr": "Je suis d'accord avec cette affirmation parce que c'est pratique.", "pr": "Aï agrî wiz ziss stéïtment bikoz it iz praktikel"}, {"en": "To sum up, I believe this is the best option.", "fr": "En résumé, je pense que c'est la meilleure option.", "pr": "Tou seum eup, aï bilîv ziss iz zi bèst opchen"}]}, "toeic": {"nom": "TOEIC Speaking", "p": [{"en": "Hello, this is Baba from ABC Global.", "fr": "Bonjour, ici Baba de ABC Global.", "pr": "Hèlô, ziss iz Baba from Eï-Bî-Sî Glôbal"}, {"en": "I would like to confirm our meeting on Monday.", "fr": "Je voudrais confirmer notre réunion de lundi.", "pr": "Aï woud laïk tou konfeurm aour mîtinng on Meundéï"}, {"en": "Could you send me the report by Friday?", "fr": "Pouvez-vous m'envoyer le rapport avant vendredi ?", "pr": "Koud you sènd mi zi ripôrt baï Fraïdéï ?"}, {"en": "The shipment will arrive next week.", "fr": "L'expédition arrivera la semaine prochaine.", "pr": "Zi chipment wil araïv nèkst wîk"}, {"en": "I am sorry for the delay.", "fr": "Je suis désolé pour le retard.", "pr": "Aï am sori for zi diléï"}, {"en": "The office opens at eight and closes at five.", "fr": "Le bureau ouvre à huit heures et ferme à dix-sept heures.", "pr": "Zi offiss ôpenz at éït and klôziz at faïv"}, {"en": "Please let me know if you have any questions.", "fr": "N'hésitez pas à me le dire si vous avez des questions.", "pr": "Plîz lèt mi nô if you hav èni kouèschenz"}, {"en": "Thank you for your help.", "fr": "Merci pour votre aide.", "pr": "Thènk you for yor hèlp"}]}, "cambridge": {"nom": "Cambridge A2/B1 Speaking", "p": [{"en": "I would like to tell you about my last holiday.", "fr": "J'aimerais vous parler de mes dernières vacances.", "pr": "Aï woud laïk tou tèl you abaout maï last holidéï"}, {"en": "I went to Dakar with my friends.", "fr": "Je suis allé à Dakar avec mes amis.", "pr": "Aï wènt tou Dakar wiz maï frèndz"}, {"en": "We stayed in a small hotel near the beach.", "fr": "Nous avons logé dans un petit hôtel près de la plage.", "pr": "Wi stéïd in a smol hôtèl nir zi bîtch"}, {"en": "The weather was hot, but we had a great time.", "fr": "Il faisait chaud, mais nous avons passé un super moment.", "pr": "Zi wèzeur woz hot, beut wi had a gréït taïm"}, {"en": "I think the first photo is more interesting.", "fr": "Je trouve que la première photo est plus intéressante.", "pr": "Aï thinnk zi feurst fôtô iz mor intrestinng"}, {"en": "In the future, I would like to travel more.", "fr": "À l'avenir, j'aimerais voyager davantage.", "pr": "In zi fioutcheur, aï woud laïk tou travel mor"}, {"en": "What about you? What do you think?", "fr": "Et vous ? Qu'en pensez-vous ?", "pr": "Wot abaout you ? Wot dou you thinnk ?"}, {"en": "That is a good point, but I disagree.", "fr": "C'est un bon argument, mais je ne suis pas d'accord.", "pr": "Zat iz a goud poïnt, beut aï disagrî"}]}, "duolingo": {"nom": "Duolingo English Test", "p": [{"en": "I usually wake up early and drink tea.", "fr": "D'habitude, je me réveille tôt et je bois du thé.", "pr": "Aï ioujouali wéïk eup eurli and drinnk tî"}, {"en": "The picture shows a busy street market.", "fr": "L'image montre un marché de rue animé.", "pr": "Zi piktcheur chôz a bizi strît markit"}, {"en": "Many people are buying fruit and vegetables.", "fr": "Beaucoup de gens achètent des fruits et des légumes.", "pr": "Mèni pîpel ar baïinng frout and vèdjtabelz"}, {"en": "I would describe my hometown as small and friendly.", "fr": "Je décrirais ma ville natale comme petite et chaleureuse.", "pr": "Aï woud diskraïb maï homtaoun az smol and frèndli"}, {"en": "Technology has changed the way we communicate.", "fr": "La technologie a changé notre façon de communiquer.", "pr": "Tèknolodji haz tchéïndjd zi wéï wi komiounikéït"}, {"en": "I have been learning English for two years.", "fr": "J'apprends l'anglais depuis deux ans.", "pr": "Aï hav bîn leurninng Inngliche for tou yirz"}, {"en": "One advantage is that it saves time.", "fr": "Un avantage est que cela fait gagner du temps.", "pr": "Wan advantidj iz zat it séïvz taïm"}, {"en": "That is all I want to say about this topic.", "fr": "C'est tout ce que je veux dire sur ce sujet.", "pr": "Zat iz ol aï wont tou séï abaout ziss topik"}]}, "pte": {"nom": "PTE Academic Speaking", "p": [{"en": "The graph shows an increase in sales over five years.", "fr": "Le graphique montre une hausse des ventes sur cinq ans.", "pr": "Zi graf chôz an inkrîss in séïlz ôveur faïv yirz"}, {"en": "Overall, the trend is positive.", "fr": "Globalement, la tendance est positive.", "pr": "Ôveurol, zi trènd iz pozitiv"}, {"en": "The lecture was about climate change.", "fr": "Le cours portait sur le changement climatique.", "pr": "Zi lèktcheur woz abaout klaïmet tchéïndj"}, {"en": "According to the speaker, farmers need more support.", "fr": "Selon l'orateur, les agriculteurs ont besoin de plus de soutien.", "pr": "Akordinng tou zi spîkeur, farmeurz nîd mor seupôrt"}, {"en": "The main idea is that education creates opportunities.", "fr": "L'idée principale est que l'éducation crée des opportunités.", "pr": "Zi méïn aïdia iz zat èdioukéïchen kriéïts opeurtiounitiz"}, {"en": "In conclusion, we should invest in renewable energy.", "fr": "En conclusion, nous devrions investir dans les énergies renouvelables.", "pr": "In konklioujen, wi choud invèst in rinioueubel ènerdji"}, {"en": "Let me describe what I see in the image.", "fr": "Laissez-moi décrire ce que je vois sur l'image.", "pr": "Lèt mi diskraïb wot aï sî in zi imidj"}, {"en": "There are several people standing near a bus.", "fr": "Il y a plusieurs personnes debout près d'un bus.", "pr": "Zèr ar sèvral pîpel stanndinng nir a beuss"}]}};
  var ORDRE = ["ielts", "toefl", "toeic", "cambridge", "duolingo", "pte"];

  function courant() {
    try { var s = localStorage.getItem("diisoo_exam"); if (s && DATA[s]) return s; } catch (e) {}
    return "ielts";
  }
  function el(tag, css, txt) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; }

  function ouvrir() {
    if (!window.DiisooCoach) return;
    var ex = courant();
    var fond = el("div", "position:fixed;inset:0;z-index:99990;background:rgba(5,8,18,.94);display:flex;align-items:flex-end;justify-content:center;");
    var box = el("div", "width:100%;max-width:520px;max-height:92vh;overflow:auto;background:#121a2e;color:#f2f5ff;border-radius:22px 22px 0 0;padding:18px 16px 26px;font-family:inherit;");
    fond.appendChild(box); document.body.appendChild(fond);

    function lancer(liste, i) {
      var p = liste[i]; if (!p) return;
      window.DiisooCoach.ouvrir({
        en: p.en, pron: p.pr, fr: p.fr,
        suivant: liste[i + 1] ? function () { lancer(liste, i + 1); } : null
      });
    }
    function rendre() {
      box.innerHTML = "";
      box.appendChild(el("div", "font:700 20px inherit;margin-bottom:4px;", "🎓 Entraînement oral"));
      box.appendChild(el("div", "font-size:13px;color:#aab4d4;margin-bottom:12px;line-height:1.4;", "Phrases modèles à écouter et répéter avant le test. Ce n'est pas le test : pas de minuteur, pas de note."));
      var chips = el("div", "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;");
      ORDRE.forEach(function (k) {
        var on = k === ex;
        var b = el("button", "min-height:40px;padding:0 14px;border-radius:999px;border:1px solid " + (on ? "#E1693F" : "#2a3350") + ";background:" + (on ? "#C2542D" : "#0B0F1C") + ";color:" + (on ? "#fff" : "#A69C86") + ";font-weight:700;font-size:13px;", k === "ielts" ? "IELTS" : k.toUpperCase() === "TOEFL" || k === "toeic" || k === "pte" ? k.toUpperCase() : k.charAt(0).toUpperCase() + k.slice(1));
        b.type = "button";
        b.onclick = function () { ex = k; try { localStorage.setItem("diisoo_exam", k); } catch (e) {} rendre(); };
        chips.appendChild(b);
      });
      box.appendChild(chips);
      box.appendChild(el("div", "font-weight:700;margin-bottom:8px;", DATA[ex].nom));
      var liste = DATA[ex].p;
      liste.forEach(function (p, i) {
        var b = el("button", "display:block;width:100%;text-align:left;min-height:52px;margin-top:8px;padding:10px 14px;border-radius:14px;border:1px solid #2a3350;background:#141A2B;color:#f2f5ff;font-size:15px;line-height:1.35;");
        b.type = "button";
        b.appendChild(el("div", "font-weight:600;", p.en));
        b.appendChild(el("div", "font-size:12px;color:#F3A94E;margin-top:2px;", p.pr));
        b.onclick = function () { lancer(liste, i); };
        box.appendChild(b);
      });
      var f = el("button", "width:100%;min-height:52px;margin-top:14px;border:0;border-radius:14px;background:#2a3350;color:#fff;font-weight:600;font-size:16px;", "Fermer");
      f.type = "button"; f.onclick = function () { fond.remove(); };
      box.appendChild(f);
    }
    rendre();
  }

  function ajouter() {
    var box = document.getElementById("test-topic-buttons");
    if (!box || document.getElementById("dii-exam-train")) return;
    var b = el("button", "width:100%;min-height:48px;margin-top:10px;border-radius:12px;border:1px solid #F3A94E;background:transparent;color:#F3A94E;font-weight:700;font-size:14px;", "🎓 Entraînement oral (avant le test)");
    b.id = "dii-exam-train"; b.type = "button"; b.onclick = ouvrir;
    box.parentNode.insertBefore(b, box.nextSibling);
  }

  var plan = false;
  function planifier() {
    if (plan) return; plan = true;
    setTimeout(function () { plan = false; try { ajouter(); } catch (e) {} }, 250);
  }
  new MutationObserver(planifier).observe(document.body, { childList: true, subtree: true });
  planifier();
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-examens-coach.js",e);}

try{
/* ---- diisoo-pron-business.js ---- */
/* diisoo-pron-business.js
 * Prononciation simplifiée (écriture pour francophones) du vocabulaire et des dialogues Business et « Anglais des marchés ».
 * Alimente le coach vocal via window.DiisooPronEN. Aide pédagogique, prélecture à valider.
 */
(function () {
  "use strict";
  window.DiisooPronEN = Object.assign(window.DiisooPronEN || {}, {"Shock absorber": "Chok abzorbeur", "Brakes / brake pads": "Bréïks / bréïk padz", "Do you have a warranty?": "Dou you hav a woranti ?", "Does the price include installation?": "Deuz zi praïce inklioud instaléïchen ?", "How much for a bulk order?": "Haou meutch for a beulk ordeur ?", "How much deposit do I pay?": "Haou meutch dipozit dou aï péï ?", "Can you give me an invoice?": "Kan you guiv mi an inn-voïss ?", "How much does this part cost?": "Haou meutch deuz ziss part kost ?", "Do you pay in Yuan or dollars?": "Dou you péï in you-ane or dolarz ?", "What is the reference of this part?": "Wot iz zi rèfrenss ov ziss part ?", "I'm looking for a direct factory supplier": "Aïm loukinng for a dairèkt faktri seupplaïeur", "Is this an original part or a copy?": "Iz ziss an oridjinel part or a kopi ?", "Is this an OEM or an aftermarket part?": "Iz ziss an Ô-Î-Èm or an aftermarkit part ?", "Which vehicle brand is this part compatible with?": "Witch vîkel brand iz ziss part kompatibel wiz ?", "How many months of warranty does this part have?": "Haou mèni meunths ov woranti deuz ziss part hav ?", "I will come back if the price doesn't suit me": "Aï wil keum bak if zi praïce deuzent sout mi", "I sell on credit": "Aï sèl on krèdit", "What size do you have?": "Wot saïz dou you hav ?", "Do you have a receipt?": "Dou you hav a rissît ?", "How much for ten pieces?": "Haou meutch for tèn pîssiz ?", "Do you also sell online?": "Dou you olsô sèl onlaïn ?", "Do you have other colours?": "Dou you hav euzeur keuleurz ?", "Is the fabric pure cotton?": "Iz zi fabrik pioueur koton ?", "Is this fabric good quality?": "Iz ziss fabrik goud kwoliti ?", "What is the restocking time?": "Wot iz zi ristokinng taïm ?", "Wholesale price / retail price": "Hôlséïl praïce / rîtéïl praïce", "Wholesale price for street traders": "Hôlséïl praïce for strît tréïdeurz", "Can you send me a sample?": "Kan you sènd mi a sampel ?", "Does this fabric bleed when washed?": "Deuz ziss fabrik blîd wèn woched ?", "What is the minimum order quantity?": "Wot iz zi minimoum ordeur kouantiti ?", "I would like to buy in bulk": "Aï woud laïk tou baï in beulk", "Can I exchange it if it doesn't fit?": "Kan aï èkstchéïndj it if it deuzent fit ?", "Mobile money payment": "Môbaïl meuni péïment", "Is the charger included?": "Iz zi tchardjeur inklioudid ?", "What is the battery capacity?": "Wot iz zi bateri kapassiti ?", "Is there a manufacturer's warranty?": "Iz zèr a manioufaktchereurz woranti ?", "Can I pay by mobile money?": "Kan aï péï baï môbaïl meuni ?", "Does this device work on 220V?": "Deuz ziss divaïss weurk on tou-tou-zîrô vôlt ?", "Do you have the original invoice?": "Dou you hav zi oridjinel inn-voïss ?", "Do you have an after-sales service?": "Dou you hav an aftèr séïlz seurviss ?", "Is it compatible with Senegalese voltage?": "Iz it kompatibel wiz Sénégalîz vôltidj ?", "What is the price for a full carton?": "Wot iz zi praïce for a foul kartonn ?", "Can you test the device in front of me?": "Kan you tèst zi divaïss in freunt ov mi ?", "What material is used?": "Wot matirièl iz iouzd ?", "Do you deliver to home?": "Dou you délivèr tou hôm ?", "Can I pay in instalments?": "Kan aï péï in instolments ?", "Do you offer an assembly service?": "Dou you ofeur an assembli seurviss ?", "Can this furniture be taken apart?": "Kan ziss feurnitcheur bi téïkenn apart ?", "Is the furniture treated against termites?": "Iz zi feurnitcheur trîtid agèinst teurmaïts ?", "Can I see a catalogue of models?": "Kan aï sî a katalog ov modelz ?", "How much for the whole living room set?": "Haou meutch for zi hôl livinng roum sèt ?", "What is the manufacturing time for custom orders?": "Wot iz zi manioufaktchrinng taïm for keustom ordeurz ?", "Customs clearance": "Keustemz klirenss", "Shipping container": "Chipinng kontéïneur", "What is the FOB price?": "Wot iz zi Èf-Ô-Bî praïce ?", "What is the delivery time?": "Wot iz zi dilivri taïm ?", "Where is the packing list?": "Wèr iz zi pakinng list ?", "Which Incoterm do you use?": "Witch Inkotèrm dou you iouz ?", "Where is the customs office?": "Wèr iz zi keustemz offiss ?", "I prefer a groupage shipment": "Aï prifeur a groupidj chipment", "Do you have transport insurance?": "Dou you hav transport inchourenss ?", "How many CBM is my cargo?": "Haou mèni Sî-Bî-Èm iz maï kargô ?", "I need the Bill of Lading": "Aï nîd zi bil ov lédinng", "Do you need a business visa?": "Dou you nîd a biznis vîza ?", "I'm looking for a reliable supplier": "Aïm loukinng for a rilaïabel seupplaïeur", "How much does transport by container cost?": "Haou meutch deuz transport baï kontéïneur kost ?", "What is the validity period of the quote?": "Wot iz zi validiti pirièd ov zi kwôt ?", "Do you accept a deposit then balance payment?": "Dou you aksèpt a dipozit zèn balanss péïment ?", "How many days to clear customs at the Port of Dakar?": "Haou mèni déïz tou klir keustemz at zi port ov Dakar ?", "Irrigation equipment": "Irigéïchen ikwipment", "Tractor spare parts": "Traktor spèr parts", "Fresh tomatoes and onions": "Frèch tomêtôz and euniennz", "Storage crates for vegetables": "Storidj kréïts for vèdjtabelz", "Water pump for the field": "Wotteur peump for zi fîld", "Solar panel for the farm": "Sôlar panel for zi farm", "I want to buy ten refurbished phones to resell in my shop.": "Aï wont tou baï tèn rifeurbicht fônz tou risèl in maï chop", "to resell": "tou risèl", "battery health": "bateri hèlth", "unlocked": "eunlokt", "original box": "oridjinel boks", "to test": "tou tèst", "receipt": "rissît", "It's good": "Its goud", "It's bad / damaged": "Its bad / damidjd", "Pay": "Péï", "Reduce it a little": "Ridiouss it a litel", "Hello. I want ten refurbished phones to resell in my shop.": "Hèlô. Aï wont tèn rifeurbicht fônz tou risèl in maï chop", "Which brand? I have Samsung and Tecno.": "Witch brand ? Aï hav Samseung and Tèknô.", "Samsung. What is the battery health?": "Samseung. Wot iz zi bateri hèlth ?", "Above 85 percent. All phones are unlocked.": "Abeuv éïti-faïv peursènt. Ol fônz ar eunlokt.", "Can I test three phones before I pay?": "Kan aï tèst thri fônz bifor aï péï ?", "Of course. Test them here.": "Ov kors. Tèst zèm hir.", "What is your price for ten, with the original box?": "Wot iz yor praïce for tèn, wiz zi oridjinel boks ?", "55,000 CFA each without box, 58,000 CFA with the original box.": "Fifti-faïv zaouzend Sî-Èf-Eï îtch wizaout boks, fifti-éït zaouzend Sî-Èf-Eï wiz zi oridjinel boks.", "I will take ten without box. Please give me a receipt and a three months warranty.": "Aï wil téïk tèn wizaout boks. Plîz guiv mi a rissît and a thri meunths woranti.", "What is the battery health?": "Wot iz zi bateri hèlth ?", "Can I test the phones before I pay?": "Kan aï tèst zi fônz bifor aï péï ?", "Please give me a receipt and a warranty.": "Plîz guiv mi a rissît and a woranti.", "Hello, do you have a refurbished phone with a warranty?": "Hèlô, dou you hav a rifeurbicht fôn wiz a woranti ?", "refurbished": "rifeurbicht", "battery": "bateri", "charger": "tchardjeur", "screen": "skrîn", "warranty": "woranti", "mobile money": "môbaïl meuni", "How much is it?": "Haou meutch iz it ?", "Hello. Do you have a refurbished Samsung phone?": "Hèlô. Dou you hav a rifeurbicht Samseung fôn ?", "Yes. This one is very good. The screen is perfect.": "Yès. Ziss wan iz vèri goud. Zi skrîn iz peurfèkt.", "How is the battery?": "Haou iz zi bateri ?", "The battery is new. Three months warranty.": "Zi bateri iz niou. Thri meunths woranti.", "60,000 CFA.": "Sikssti zaouzend Sî-Èf-Eï.", "Yes. Wave or Orange Money.": "Yès. Wéïv or Orindj Meuni.", "Is there a warranty?": "Iz zèr a woranti ?", "I want to order twenty sets of brake pads. What is your best wholesale price?": "Aï wont tou ordeur twènti sèts ov bréïk padz. Wot iz yor bèst hôlséïl praïce ?", "compatible with": "kompatibel wiz", "original / aftermarket": "oridjinel / aftermarkit", "delivery time": "dilivri taïm", "return policy": "ritèrn polissi", "defective": "difèktiv", "deposit": "dipozit", "Money": "Meuni", "It's expensive": "Its ekspènnsiv", "Good morning. I need twenty sets of brake pads for Toyota Corolla and Hyundai Accent.": "Goud morninng. Aï nîd twènti sèts ov bréïk padz for Toyota Korola and Hiyoundaï Aksènt.", "Original or aftermarket? Original is 25,000 CFA, aftermarket is 15,000 CFA.": "Oridjinel or aftermarkit ? Oridjinel iz twènti-faïv zaouzend Sî-Èf-Eï, aftermarkit iz fifetîn zaouzend Sî-Èf-Eï.", "Are the aftermarket ones compatible with both models?": "Ar zi aftermarkit wannz kompatibel wiz bôth modelz ?", "Yes, they are compatible. For twenty sets, I can do 13,000 CFA each.": "Yès, zéï ar kompatibel. For twènti sèts, aï kan dou theurtîn zaouzend Sî-Èf-Eï îtch.", "What is the delivery time to Thies?": "Wot iz zi dilivri taïm tou Tiès ?", "Three days. I need a deposit of 30 percent.": "Thri déïz. Aï nîd a dipozit ov theurti peursènt.", "And if some pieces are defective?": "And if seum pîssiz ar difèktiv ?", "You can return them within seven days. I will give you an invoice.": "You kan ritèrn zèm wizin sèvenn déïz. Aï wil guiv you an inn-voïss.", "Deal. I will send the deposit by Wave today.": "Dîl. Aï wil sènd zi dipozit baï Wéïv toudéï.", "Are they compatible with this model?": "Ar zéï kompatibel wiz ziss modèl ?", "What is your return policy for defective parts?": "Wot iz yor ritèrn polissi for difèktiv parts ?", "Hello, I need brake pads for a Toyota Corolla.": "Hèlô, aï nîd bréïk padz for a Toyota Korola.", "brake pads": "bréïk padz", "spare part": "spèr part", "price": "praïce", "wholesale": "hôlséïl", "discount": "diskaount", "Slowly / Take it easy": "Slôli / Téïk it îzi", "Buy": "Baï", "Sell": "Sèl", "Good morning. Do you have brake pads for a Corolla?": "Goud morninng. Dou you hav bréïk padz for a Korola ?", "Yes. Original or used?": "Yès. Oridjinel or iouzd ?", "Original. How much is it?": "Oridjinel. Haou meutch iz it ?", "25,000 CFA.": "Twènti-faïv zaouzend Sî-Èf-Eï.", "It's expensive. What is your best price?": "Its ekspènnsiv. Wot iz yor bèst praïce ?", "For you, 22,000 CFA, with one month warranty.": "For you, twènti-tou zaouzend Sî-Èf-Eï, wiz wan meunth woranti.", "Deal. I'll take two.": "Dîl. Aïl téïk tou.", "What is your best price?": "Wot iz yor bèst praïce ?", "Can you quote me a price FOB Guangzhou for one twenty-foot container?": "Kan you kwôt mi a praïce Èf-Ô-Bî Gouanng-djô for wan twènti-fout kontéïneur ?", "FOB (free on board)": "Èf-Ô-Bî (frî on bord)", "CIF (cost, insurance, freight)": "Sî-Aï-Èf (kost, inchourenss, fréït)", "bill of lading": "bil ov lédinng", "payment terms": "péïment teurmz", "freight forwarder": "fréït forwardeur", "inspection": "inspèkchen", "Hello. Can you quote me a price FOB Guangzhou for one twenty-foot container of plastic chairs?": "Hèlô. Kan you kwôt mi a praïce Èf-Ô-Bî Gouanng-djô for wan twènti-fout kontéïneur ov plastik tchèrz ?", "Yes. FOB Guangzhou is 4,800 dollars for the full container.": "Yès. Èf-Ô-Bî Gouanng-djô iz for zaouzend éït eundrid dolarz for zi foul kontéïneur.", "What are your payment terms?": "Wot ar yor péïment teurmz ?", "Thirty percent deposit, and seventy percent against the bill of lading.": "Theurti peursènt dipozit, and sèventi peursènt agèinst zi bil ov lédinng.", "Can my freight forwarder do an inspection before shipping?": "Kan maï fréït forwardeur dou an inspèkchen bifor chipinng ?", "Yes. Inspection is possible one week before loading.": "Yès. Inspèkchen iz posibel wan wîk bifor lôdinng.", "What is the price CIF Dakar?": "Wot iz zi praïce Sî-Aï-Èf Dakar ?", "5,900 dollars. Transit time is about thirty-five days.": "Faïv zaouzend naïn eundrid dolarz. Tranzit taïm iz abaout theurti-faïv déïz.", "Please send me the proforma invoice. I will compare with my freight forwarder.": "Plîz sènd mi zi proforma inn-voïss. Aï wil kompèr wiz maï fréït forwardeur.", "Can you quote me a price FOB?": "Kan you kwôt mi a praïce Èf-Ô-Bî ?", "Can my freight forwarder do an inspection?": "Kan maï fréït forwardeur dou an inspèkchen ?", "Hello, I want to ship a container to Dakar.": "Hèlô, aï wont tou chip a kontéïneur tou Dakar.", "container": "kontéïneur", "shipment": "chipment", "invoice": "inn-voïss", "customs": "keustemz", "freight": "fréït", "minimum order": "minimoum ordeur", "Container": "Kontéïneur", "Customs": "Keustemz", "Hello. What is your minimum order?": "Hèlô. Wot iz yor minimoum ordeur ?", "One hundred pieces.": "Wan eundrid pîssiz.", "What is the price per piece?": "Wot iz zi praïce peur pîss ?", "Five dollars each.": "Faïv dolarz îtch.", "Can you give me a discount for five hundred pieces?": "Kan you guiv mi a diskaount for faïv eundrid pîssiz ?", "Yes. Four dollars fifty each.": "Yès. For dolarz fifti îtch.", "How long is the shipment to Dakar?": "Haou lonng iz zi chipment tou Dakar ?", "About thirty-five days by sea. I will send the invoice today.": "Abaout theurti-faïv déïz baï sî. Aï wil sènd zi inn-voïss toudéï.", "What is your minimum order?": "Wot iz yor minimoum ordeur ?", "Please send me the invoice.": "Plîz sènd mi zi inn-voïss.", "I want to order fifty shirts in three sizes and two colors.": "Aï wont tou ordeur fifti cheurts in thri saïziz and tou keuleurz.", "bulk order": "beulk ordeur", "color / pattern": "keuleur / patern", "sample": "sampel", "custom-made": "keustom-méïd", "lead time": "lîd taïm", "quality control": "kwoliti kontrôl", "It's beautiful": "Its biouitifoul", "It's too small": "Its tou smol", "It's too big": "Its tou big", "Good afternoon. I want fifty shirts, sizes small, medium and large.": "Goud afteurnoun. Aï wont fifti cheurts, saïziz smol, mîdiem and lardj.", "Which colors and which fabric?": "Witch keuleurz and witch fabrik ?", "Blue and white, in cotton. Can I see a sample first?": "Blou and waït, in koton. Kan aï sî a sampel feurst ?", "Yes. The sample is 5,000 CFA, and I will deduct it from the order.": "Yès. Zi sampel iz faïv zaouzend Sî-Èf-Eï, and aï wil didekt it from zi ordeur.", "What is the price for fifty pieces?": "Wot iz zi praïce for fifti pîssiz ?", "8,000 CFA each. If you want it custom-made with your logo, it is 9,500 CFA.": "Éït zaouzend Sî-Èf-Eï îtch. If you wont it keustom-méïd wiz yor lôgô, it iz naïn zaouzend faïv eundrid Sî-Èf-Eï.", "What is the lead time for custom-made shirts?": "Wot iz zi lîd taïm for keustom-méïd cheurts ?", "Ten days. We do quality control before delivery.": "Tèn déïz. Wi dou kwoliti kontrôl bifor dilivri.", "Good. I will pay half now and half at delivery.": "Goud. Aï wil péï haf naou and haf at dilivri.", "Can I see a sample first?": "Kan aï sî a sampel feurst ?", "What is the lead time?": "Wot iz zi lîd taïm ?", "Do you do quality control before delivery?": "Dou you dou kwoliti kontrôl bifor dilivri ?", "Good afternoon, I'm looking for a size medium dress.": "Goud afteurnoun, aïm loukinng for a saïz mîdiem drèss.", "fabric": "fabrik", "size": "saïz", "dress": "drèss", "tailor": "téïleur", "supplier": "seupplaïeur", "fitting room": "fitinng roum", "Good afternoon. Do you have this dress in medium?": "Goud afteurnoun. Dou you hav ziss drèss in mîdiem ?", "Yes. This fabric is very good quality.": "Yès. Ziss fabrik iz vèri goud kwoliti.", "Can I try it on?": "Kan aï traï it on ?", "Of course. The fitting room is there.": "Ov kors. Zi fitinng roum iz zèr.", "It's a little big. Do you have a smaller size?": "Its a litel big. Dou you hav a smoleur saïz ?", "Yes, size small. 15,000 CFA.": "Yès, saïz smol. Fifetîn zaouzend Sî-Èf-Eï.", "If I buy three, what is your wholesale price?": "If aï baï thri, wot iz yor hôlséïl praïce ?", "For three, 12,000 CFA each.": "For thri, twèlv zaouzend Sî-Èf-Eï îtch.", "Do you have this in medium?": "Dou you hav ziss in mîdiem ?", "What is your wholesale price?": "Wot iz yor hôlséïl praïce ?"});
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-pron-business.js",e);}

try{
/* ---- diisoo-ios-audio.js ---- */
/* diisoo-ios-audio.js
 * Correctifs audio pour iPhone / iPad (Safari) :
 * 1) Le déverrouillage audio d'origine ne se fait qu'au tout premier toucher. Après un retour d'une autre
 *    application, un appel ou la mise en veille, iOS suspend l'audio et les voix restent muettes.
 *    Ici : on redéverrouille à chaque toucher (au plus une fois par seconde) et au retour sur l'app.
 * 2) Interrupteur silencieux : sur iOS 16 et avant, le son Web Audio est coupé par l'interrupteur de sonnerie.
 *    Une piste silencieuse jouée par un élément audio règle la catégorie « lecture ».
 * 3) Après usage du micro, iOS 17+ garde la catégorie « enregistrement » (son faible, haut-parleur d'appel) :
 *    on remet la catégorie « lecture » au toucher suivant.
 * Sans effet sur Android et ordinateur. Ne modifie aucun autre fichier.
 */
(function () {
  "use strict";
  if (window.__diisooIosAudio) return;
  window.__diisooIosAudio = true;

  var UA = navigator.userAgent || "";
  var IOS = /iPhone|iPad|iPod/.test(UA) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!IOS) return;

  var dernier = 0;
  var SILENCE = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
  var piste = null;

  function debloquer() {
    var t = Date.now();
    if (t - dernier < 1000) return;
    dernier = t;
    try { if (navigator.audioSession && navigator.audioSession.type !== "playback") navigator.audioSession.type = "playback"; } catch (e) {}
    try { if (window.Diisoo && window.Diisoo.voix && window.Diisoo.voix.debloquer) window.Diisoo.voix.debloquer(); } catch (e) {}
    demarrerPiste();
  }

  function demarrerPiste() {
    if (navigator.audioSession) return;            // iOS 17+ : la catégorie suffit
    try {
      if (!piste) {
        piste = new Audio(SILENCE);
        piste.setAttribute("playsinline", "");
        piste.loop = true;
        piste.volume = 1;
      }
      if (piste.paused) { var p = piste.play(); if (p && p.catch) p.catch(function () {}); }
    } catch (e) {}
  }

  ["touchend", "pointerdown", "click"].forEach(function (ev) {
    document.addEventListener(ev, debloquer, { capture: true, passive: true });
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { try { if (piste && !piste.paused) piste.pause(); } catch (e) {} }
    else { dernier = 0; }
  });
  window.addEventListener("pageshow", function () { dernier = 0; });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-ios-audio.js",e);}

try{
/* ---- diisoo-direct.js ---- */
/* diisoo-direct.js v2 : Examens et visa en 2 etapes
   - supprime l'explication apres inscription
   - Etape 1 : les 6 examens en grille
   - Etape 2 : les tests de l'examen choisi, numerotes (fait, Premium), avec un gros bouton "Continuer" */
(function () {
  "use strict";

  /* Plus d'explication apres inscription (le bouton "Comment ca marche" du menu reste) */
  try { store.set("diisoo_tuto_seen", true); } catch (e) {}

  var st = document.createElement("style");
  st.textContent =
    "#exam-tabs,#autres-examens{display:none!important}" +
    "#btn-test-main[data-mode='start']{display:none!important}" +
    "#test-topic-buttons{display:none!important}" +
    "#exam-grid,#exam-tests .et-grille{display:grid;gap:10px}" +
    "#exam-grid{grid-template-columns:1fr 1fr}" +
    "#exam-grid button{min-height:60px;padding:8px 10px;text-align:left;border-radius:16px;" +
    "background:#141A2B;border:1px solid #1E2740;color:#F6F1E7;display:flex;align-items:center;gap:8px}" +
    "#exam-grid button:active{border-color:#E1693F}" +
    "#exam-grid .ex-ic{font-size:24px;line-height:1}" +
    "#exam-grid .ex-nm{font-size:14px;font-weight:700;line-height:1.2}" +
    "#exam-tests .et-titre{text-align:center;font-size:13px;font-weight:700;color:#C9BFA8;margin:2px 0 8px}" +
    "#exam-tests .et-retour{width:100%;min-height:38px;padding:6px 12px;margin-bottom:8px;background:#141A2B;border:1px solid #1E2740;" +
    "border-radius:12px;color:#E4DCC9;font-size:12px;font-weight:700;text-align:left}" +
    "#exam-tests .et-suite{width:100%;min-height:62px;margin-bottom:12px;padding:10px 14px;border-radius:18px;border:0;" +
    "background:#25D366;color:#fff;font-size:16px;font-weight:800;text-align:left}" +
    "#exam-tests .et-suite small{display:block;font-size:12px;font-weight:600;opacity:.9;margin-top:2px}" +
    "#exam-tests .et-grille{grid-template-columns:repeat(5,1fr)}" +
    "#exam-tests .et-t{position:relative;min-height:56px;border-radius:14px;background:#141A2B;border:1px solid #1E2740;" +
    "color:#F6F1E7;font-size:17px;font-weight:800}" +
    "#exam-tests .et-t.fait{background:#12351F;border-color:#25D366}" +
    "#exam-tests .et-t.prem{opacity:.6}" +
    "#exam-tests .et-t i{position:absolute;top:2px;right:4px;font-style:normal;font-size:11px}" +
    "#exam-tests .et-leg{text-align:center;font-size:11px;color:#8C8064;margin-top:10px}";
  document.head.appendChild(st);

  var EXAMS = [
    ["ielts", "IELTS", "🇬🇧", "Visa A1"],
    ["toefl", "TOEFL", "🎓", "Speaking"],
    ["toeic", "TOEIC", "💼", "Speaking"],
    ["cambridge", "Cambridge", "📘", "A2/B1"],
    ["duolingo", "Duolingo", "🦉", "English Test"],
    ["pte", "PTE", "🧪", "Academic"]
  ];

  function $(id) { return document.getElementById(id); }
  function vus() {
    var o = {};
    try { (store.get("diisoo_tests") || []).forEach(function (h) { if (h && h.topic) o[h.topic] = 1; }); } catch (e) {}
    return o;
  }

  function listeTests(ex) {
    try { if (ex === "ielts") return TEST_BANK; } catch (e) {}
    return window.__examList || [];
  }

  function montrerEtape1() {
    var g = $("exam-grid"), t = $("exam-tests");
    if (g) g.style.display = "";
    if (t) t.style.display = "none";
  }

  function lancerTest(i) {
    var boutons = document.querySelectorAll("#test-topic-buttons > button");
    if (boutons[i]) boutons[i].click();
  }

  function montrerEtape2(ex, nom) {
    var picker = $("test-picker");
    if (!picker) return;
    var g = $("exam-grid");
    if (g) g.style.display = "none";
    var box = $("exam-tests");
    if (!box) { box = document.createElement("div"); box.id = "exam-tests"; picker.insertBefore(box, picker.firstChild); }
    box.style.display = "";
    box.innerHTML = "";

    var liste = listeTests(ex), seen = vus();
    var boutons = document.querySelectorAll("#test-topic-buttons > button");

    var back = document.createElement("button");
    back.type = "button"; back.className = "et-retour"; back.textContent = "‹ Changer d'examen";
    back.onclick = montrerEtape1;
    box.appendChild(back);

    var titre = document.createElement("div");
    titre.className = "et-titre"; titre.textContent = nom + " : " + liste.length + " tests";
    box.appendChild(titre);

    /* Test suivant : le premier non fait et ouvert */
    var suite = -1, premier = -1;
    liste.forEach(function (t, i) {
      var verrou = boutons[i] && /^\s*⭐/.test(boutons[i].textContent);
      if (!verrou && premier < 0) premier = i;
      if (!verrou && !seen[t.topic] && suite < 0) suite = i;
    });
    var cible = suite >= 0 ? suite : premier;
    if (cible >= 0) {
      var c = document.createElement("button");
      c.type = "button"; c.className = "et-suite";
      c.innerHTML = "▶ " + (suite >= 0 ? "Continuer" : "Refaire") + "<small>Test " + (cible + 1) + " : " + String(liste[cible].topic).replace(/</g, "&lt;") + "</small>";
      c.onclick = function () { lancerTest(cible); };
      box.appendChild(c);
    }

    var grille = document.createElement("div");
    grille.className = "et-grille";
    liste.forEach(function (t, i) {
      var verrou = boutons[i] && /^\s*⭐/.test(boutons[i].textContent);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "et-t" + (seen[t.topic] ? " fait" : "") + (verrou ? " prem" : "");
      b.innerHTML = (i + 1) + (seen[t.topic] ? "<i>✅</i>" : (verrou ? "<i>⭐</i>" : ""));
      b.setAttribute("aria-label", "Test " + (i + 1) + " : " + t.topic);
      b.onclick = function () { lancerTest(i); };
      grille.appendChild(b);
    });
    box.appendChild(grille);

    var leg = document.createElement("div");
    leg.className = "et-leg"; leg.textContent = "✅ fait   ⭐ Premium";
    box.appendChild(leg);
  }

  function choisirExamen(ex, nom) {
    try {
      var chip = Array.prototype.slice.call(document.querySelectorAll("#exam-tabs button"))
        .filter(function (b) { return b.textContent === nom; })[0];
      if (chip) chip.click();
      if (ex === "ielts") { currentTest = TEST_BANK[0]; renderTestPicker(); }
      montrerEtape2(ex, nom);
    } catch (e) { console.warn("[diisoo] direct", e); }
  }

  function monterGrille() {
    var picker = $("test-picker");
    if (!picker) return;
    var g = $("exam-grid");
    if (!g) {
      g = document.createElement("div");
      g.id = "exam-grid";
      EXAMS.forEach(function (e) {
        var b = document.createElement("button");
        b.type = "button";
        b.innerHTML = '<span class="ex-ic">' + e[2] + '</span><span class="ex-nm">' + e[1] +
          '<br><span style="font-size:11px;font-weight:400;color:#A69C86">' + e[3] + "</span></span>";
        b.onclick = function () { choisirExamen(e[0], e[1]); };
        g.appendChild(b);
      });
      picker.insertBefore(g, picker.firstChild);
    }
    montrerEtape1();
  }

  var orig = window.startTestSimulation;
  if (typeof orig === "function") {
    window.startTestSimulation = function () {
      var r = orig.apply(this, arguments);
      try { monterGrille(); } catch (e) {}
      return r;
    };
  }
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-direct.js",e);}

try{
/* ---- diisoo-orga.js ---- */
/* diisoo-orga.js v2 : organisation des menus, un choix a la fois
   Anglais et Wolof : Niveau, puis Theme, puis Mots (3 etapes, une decision par ecran).
   Cartes de mots : Wolof, English, Francais bien separes, boutons numerotes 1, 2, 3.
   Business et Examens : grille propre, pas de doublon. Wikidata retire des themes. */
(function () {
  "use strict";

  /* Neutralise l'ancien diisoo-menus.js s'il est encore charge */
  try {
    var olds = document.querySelectorAll("style");
    for (var i = 0; i < olds.length; i++) {
      if (olds[i].textContent.indexOf("#business-picker{display:grid") >= 0) olds[i].remove();
    }
  } catch (e) {}

  var st = document.createElement("style");
  st.textContent =
    /* Barres de niveau de l'ancien systeme et textes parasites */
    "#tierbar-general,#tierbar-wolof,#tierbar-business,#tierbar-ielts{display:none!important}" +
    "#test-picker>p{display:none!important}" +
    /* Grilles : 2 colonnes alignees, aucun defilement lateral */
    "#general-tabs,#wolof-tabs,#business-tabs{display:grid!important;grid-template-columns:1fr 1fr;gap:8px;" +
    "overflow:visible!important;padding:0!important;margin:8px 0 0!important}" +
    "#general-tabs>*,#wolof-tabs>*,#business-tabs>*{margin:0!important;width:100%;min-height:48px;" +
    "padding:6px 10px!important;font-size:13px!important;line-height:1.2;text-align:left;" +
    "white-space:normal!important;border-radius:14px!important;box-sizing:border-box}" +
    "#general-content,#lexicon-container,#business-content{max-height:none!important;overflow:visible!important}" +
    "#general-tabs.lvl-hide,#wolof-tabs.lvl-hide,#general-content.lvl-hide,#lexicon-container.lvl-hide,.lvl-hide{display:none!important}" +
    /* Choix du niveau */
    ".lvl-picker{display:flex;flex-direction:column;gap:10px}" +
    ".lvl-title{text-align:center;font-size:14px;font-weight:700;color:#F6F1E7;margin:4px 0}" +
    ".lvl-btn{display:flex;align-items:center;gap:12px;width:100%;min-height:68px;padding:10px 14px;" +
    "background:#141A2B;border:1px solid #1E2740;border-radius:16px;color:#F6F1E7;text-align:left}" +
    ".lvl-btn:active{border-color:#E1693F}" +
    ".lvl-btn.lock{opacity:.6}" +
    ".lvl-ic{font-size:28px;line-height:1}" +
    ".lvl-nm{font-size:15px;font-weight:800;line-height:1.2}" +
    ".lvl-sub{font-size:11px;color:#A69C86;font-weight:400;margin-top:2px}" +
    ".lvl-back{width:100%;min-height:38px;padding:6px 12px;margin-bottom:6px;background:#10251A;border:1px solid #3FAE74;" +
    "border-radius:12px;color:#5FC98F;font-size:12px;font-weight:700;text-align:left}" +
    ".lvl-back.th{background:#141A2B;border-color:#1E2740;color:#E4DCC9}" +
    ".lvl-step{text-align:center;font-size:12px;font-weight:700;color:#C9BFA8;margin:6px 0 0}" +
    /* Cartes de mots (Anglais Wolof) : trois blocs bien separes */
    "#lexicon-container>.fx-em{padding:16px!important}" +
    "#lexicon-container>.fx-em>div:first-of-type{display:flex!important;flex-direction:column;gap:12px}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:first-child{display:contents}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:last-child{order:2;text-align:left!important}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:first-child>p:first-child{order:1;font-size:26px!important;line-height:1.15!important;margin:0}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:first-child>p:last-child{order:3;font-size:14px!important;color:#A69C86!important;margin:0}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:last-child>p{font-size:26px!important;line-height:1.15!important;margin:0}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:first-child>p:first-child::before{content:'\\1F1F8\\1F1F3  WOLOF';display:block;font-size:11px;letter-spacing:.12em;font-weight:700;color:#5FC98F;margin-bottom:2px}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:last-child>p::before{content:'\\1F1EC\\1F1E7  ENGLISH';display:block;font-size:11px;letter-spacing:.12em;font-weight:700;color:#A69C86;margin-bottom:2px}" +
    "#lexicon-container>.fx-em>div:first-of-type>div:first-child>p:last-child::before{content:'\\1F1EB\\1F1F7  '}" +
    "#lexicon-container>.fx-em>.grid{grid-template-columns:1fr 1fr 1fr!important;gap:10px!important}" +
    "#lexicon-container .grid>button.dii-b:nth-child(1)::before{content:'1'}" +
    "#lexicon-container .grid>button.dii-b:nth-child(2)::before{content:'2'}" +
    "#lexicon-container .grid>button.dii-b:nth-child(3)::before{content:'3'}" +
    "#lexicon-container .grid>button.dii-b::before{position:absolute;top:6px;left:8px;width:18px;height:18px;border-radius:50%;" +
    "background:rgba(255,255,255,.18);font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center}" +
    /* Boutons : icone au-dessus, mot en dessous, identiques partout */
    "button.dii-b[data-practice]{position:relative;display:flex!important;flex-direction:column;align-items:center;justify-content:center;" +
    "gap:3px;min-height:68px!important;padding:8px 4px!important;border-radius:16px!important;font-size:11px!important;line-height:1.1;text-align:center}" +
    "button.dii-b[data-practice] .dii-i{font-size:26px;line-height:1}" +
    "button.dii-b[data-practice] .dii-c{font-weight:700}" +
    "button.dii-b[data-practice] .dii-x{display:none}" +
    "button.dii-b[data-practice]:disabled{opacity:.45}";
  document.head.appendChild(st);

  var NAMES = ["Débutant", "Intermédiaire", "Avancé"];
  var ICONS = ["🌱", "🌿", "🌳"];
  var KEYS = {
    general: { tabs: "general-tabs", content: "general-content", unit: "thèmes" },
    wolof: { tabs: "wolof-tabs", content: "lexicon-container", unit: "thèmes" }
  };
  var lvl = { general: null, wolof: null };

  function $(id) { return document.getElementById(id); }
  function unlocked(key) { try { return tierState()[key].unlocked || 1; } catch (e) { return 1; } }
  function levelOf(key, b, i, n) {
    if (key === "general") { var m = /N([123])\b/.exec(b.textContent); return m ? +m[1] : 1; }
    return Math.min(3, Math.floor(i / Math.ceil(n / 3)) + 1);
  }

  function filtrer(key) {
    var c = KEYS[key], box = $(c.tabs);
    if (!box) return;
    var items = Array.prototype.slice.call(box.children), n = items.length;
    items.forEach(function (b, i) {
      b.dataset.lvl = levelOf(key, b, i, n);
      b.disabled = false; b.style.pointerEvents = ""; b.style.opacity = "";
      var tag = b.querySelector(".tier-lock-tag"); if (tag) tag.remove();
      b.style.display = (lvl[key] === null || +b.dataset.lvl === lvl[key]) ? "" : "none";
    });
  }

  /* Remplace l'ancien verrouillage par points : plus de cadenas par bouton */
  window.applyTierLocks = function (key) {
    if (key === "general" || key === "wolof") { filtrer(key); return; }
    var bar = $("tierbar-" + key); if (bar) bar.remove();
    if (key === "ielts") {
      try {
        Array.prototype.forEach.call($("test-topic-buttons").children, function (b) {
          b.disabled = false; b.style.pointerEvents = ""; b.style.opacity = "";
        });
      } catch (e) {}
    }
  };

  /* Wikidata : donnees brutes non validees, retirees de l'affichage des apprenants */
  var orw = window.renderWolofTabs;
  if (typeof orw === "function") {
    window.renderWolofTabs = function () {
      var r = orw.apply(this, arguments);
      try {
        Array.prototype.slice.call($("wolof-tabs").children).forEach(function (b) {
          if (/^\s*(🔒\s*)?Wikidata\s*$/.test(b.textContent)) b.remove();
        });
        filtrer("wolof");
      } catch (e) {}
      return r;
    };
  }

  function retirer(id) { var e = $(id); if (e) e.remove(); }
  function haut() { try { window.scrollTo(0, 0); } catch (e) {} }

  /* ---------- Etape 0 : choix du niveau ---------- */
  function afficherPicker(key) {
    var c = KEYS[key], box = $(c.tabs), content = $(c.content);
    if (!box) return;
    lvl[key] = null; filtrer(key);
    var counts = [0, 0, 0];
    Array.prototype.forEach.call(box.children, function (b) { counts[+b.dataset.lvl - 1]++; });
    var p = $("lvl-" + key);
    if (!p) { p = document.createElement("div"); p.id = "lvl-" + key; p.className = "lvl-picker"; box.parentNode.insertBefore(p, box); }
    p.innerHTML = "";
    var t = document.createElement("p"); t.className = "lvl-title"; t.textContent = "Étape 1 : choisis ton niveau"; p.appendChild(t);
    var un = unlocked(key);
    [1, 2, 3].forEach(function (L) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "lvl-btn" + (L > un ? " lock" : "");
      b.innerHTML = '<span class="lvl-ic">' + (L > un ? "🔒" : ICONS[L - 1]) + '</span><span><span class="lvl-nm">' +
        NAMES[L - 1] + '</span><br><span class="lvl-sub">' + (L > un ? "Test de passage" : "✅ Ouvert") + " · " + counts[L - 1] + " " + c.unit + "</span></span>";
      b.onclick = function () { choisir(key, L); };
      p.appendChild(b);
    });
    p.style.display = "";
    box.classList.add("lvl-hide");
    if (content) content.classList.add("lvl-hide");
    retirer("lvlback-" + key); retirer("thbar-" + key); retirer("step-" + key);
    haut();
  }

  /* ---------- Etape 1 : choix du theme ---------- */
  function afficherThemes(key, L) {
    var c = KEYS[key], box = $(c.tabs), content = $(c.content);
    lvl[key] = L;
    $("lvl-" + key).style.display = "none";
    filtrer(key);
    box.classList.remove("lvl-hide");
    if (content) content.classList.add("lvl-hide");
    retirer("lvlback-" + key); retirer("thbar-" + key); retirer("step-" + key);
    var back = document.createElement("button");
    back.type = "button"; back.id = "lvlback-" + key; back.className = "lvl-back";
    back.textContent = ICONS[L - 1] + " " + NAMES[L - 1] + " : changer de niveau";
    back.onclick = function () { afficherPicker(key); };
    box.parentNode.insertBefore(back, box);
    var s = document.createElement("p");
    s.id = "step-" + key; s.className = "lvl-step"; s.textContent = "Étape 2 : choisis ton thème";
    box.parentNode.insertBefore(s, box);
    haut();
  }

  /* ---------- Etape 2 : les mots ---------- */
  function afficherLecon(key, titre) {
    var c = KEYS[key], box = $(c.tabs), content = $(c.content);
    if (lvl[key] === null) return;
    box.classList.add("lvl-hide");
    if (content) content.classList.remove("lvl-hide");
    retirer("step-" + key); retirer("thbar-" + key);
    var th = document.createElement("button");
    th.type = "button"; th.id = "thbar-" + key; th.className = "lvl-back th";
    th.textContent = "📚 " + titre + " : changer de thème";
    th.onclick = function () { afficherThemes(key, lvl[key]); };
    box.parentNode.insertBefore(th, box);
    haut();
  }

  function choisir(key, L) {
    if (L > unlocked(key)) {
      try { toast("🔒 Termine d'abord le niveau " + NAMES[L - 2]); } catch (e) {}
      return;
    }
    afficherThemes(key, L);
  }

  /* Toucher un theme : on passe a l'etape 3 */
  ["general", "wolof"].forEach(function (key) {
    var box = $(KEYS[key].tabs);
    if (!box) return;
    box.addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest("button");
      if (!b || b.parentNode !== box) return;
      var titre = b.textContent.trim().replace(/^🔒\s*/, "");
      setTimeout(function () { if (lvl[key] !== null) afficherLecon(key, titre); }, 0);
    }, true);
  });

  /* ---------- Boutons des cartes : icone en haut, mot en bas ---------- */
  var LIB = "🎤 Maintiens pour parler";
  function esc(s) { return String(s).replace(/[&<>"']/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]; }); }
  function formater(root) {
    var list = root.querySelectorAll("button[data-practice]:not(.dii-b)");
    for (var i = 0; i < list.length; i++) {
      var b = list[i], t = (b.textContent || "").trim();
      var m = /^(🔊|🎤)\s+(.+)$/.exec(t);
      if (!m) continue;
      var cap = esc(m[2]);
      if (t === LIB) cap = 'Maintiens<span class="dii-x"> pour parler</span>';
      b.innerHTML = '<span class="dii-i">' + m[1] + '</span> <span class="dii-c">' + cap + "</span>";
      b.classList.add("dii-b");
    }
  }
  var plan = false;
  function planifier() {
    if (plan) return; plan = true;
    requestAnimationFrame(function () {
      plan = false;
      ["lexicon-container", "general-content", "business-content"].forEach(function (id) { var e = $(id); if (e) formater(e); });
    });
  }
  try {
    new MutationObserver(planifier).observe(document.body, { childList: true, subtree: true });
    planifier();
  } catch (e) {}

  var TXT = {
    general: "Écoute, répète, puis teste-toi.",
    wolof: "Écoute le wolof, répète en anglais.",
    business: "Choisis ton secteur."
  };
  function titre(screen, key) {
    try { var p = document.querySelector("#" + screen + ">div:first-child p"); if (p) p.textContent = TXT[key]; } catch (e) {}
  }

  function envelopper(nom, key) {
    var o = window[nom];
    if (typeof o !== "function") return;
    window[nom] = function () {
      var r = o.apply(this, arguments);
      try { titre(key === "general" ? "screen-general" : key === "wolof" ? "screen-wolof" : "screen-business", key); if (KEYS[key]) afficherPicker(key); } catch (e) { console.warn("[diisoo] orga", e); }
      return r;
    };
  }
  envelopper("openGeneralModule", "general");
  envelopper("openWolofModule", "wolof");
  envelopper("openBusinessModule", "business");

  window.DiisooOrga = { version: 2, niveau: function (k) { return lvl[k]; }, picker: afficherPicker };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-orga.js",e);}

try{
/* ---- diisoo-wamic.js ---- */
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

}catch(e){console.error("Diisoo : erreur dans diisoo-wamic.js",e);}

try{
/* ---- diisoo-aide-wolof.js ---- */
/* diisoo-aide-wolof.js v3 : aide vocale en wolof sur chaque etape
   - parle tout seul UNE SEULE FOIS par etape (menu, niveau, theme, mots, examens), ensuite seul le bouton 🔊 repete
   - ta voix d'abord : si la phrase est enregistree avec l'outil #enregistrer-voix, c'est elle qui est lue (instantane)
   - sinon la voix generee de l'app est utilisee
   - si le telephone bloque le son, le bouton 🔊 clignote et une bulle affiche la phrase
   - bouton rond 🔊 en haut a droite : repete l'aide a tout moment */
(function () {
  "use strict";

  var P = {
    menu: "Tànnal li nga bëgg.",
    niveau: "Tànnal sa niveau.",
    debutant: "Yomb.",
    inter: "Digg.",
    avance: "Jafe.",
    verrou: "Jàng ba noppi, nga dem ci kanam.",
    theme: "Tànnal benn thème.",
    micro: "Téyél, wax, bàyyi.",
    annule: "Bàyyi ko ci kaw.",
    bravo: "Baax na !",
    encore: "Jéemaat.",
    passage: "Tontul ñetti laaj ngir dem ci kanam.",
    examen: "Tànnal sa examen.",
    test: "Tànnal benn test.",
    retour: "Dellu ginnaaw."
  };
  var FR = {
    menu: "Choisis ce que tu veux.", niveau: "Choisis ton niveau.", debutant: "Facile (Débutant).",
    inter: "Moyen (Intermédiaire).", avance: "Difficile (Avancé).", verrou: "Étudie d'abord, puis avance.",
    theme: "Choisis un thème.", micro: "Maintiens, parle, relâche.", annule: "Glisse pour annuler.",
    bravo: "Bravo !", encore: "Réessaie.", passage: "Réponds aux questions pour passer.",
    examen: "Choisis ton examen.", test: "Choisis un test.", retour: "Retour."
  };
  window.DiisooAideWolof = { phrases: P };

  /* Les phrases apparaissent dans l'outil d'enregistrement #enregistrer-voix (les plus courtes en premier) */
  try {
    if (typeof WOLOF_EXTRA === "object" && WOLOF_EXTRA) {
      WOLOF_EXTRA.__aide = Object.keys(P).map(function (k) { return { wo: P[k], fr: FR[k], en: "" }; });
    }
  } catch (e) {}

  /* ---------- lecture ---------- */
  var jeton = 0, cur = null;
  function arreter() { try { if (cur) { cur.onended = null; cur.onerror = null; cur.pause(); } } catch (e) {} cur = null; }

  function lireURL(url, jt) {
    return new Promise(function (resolve) {
      arreter();
      var a = new Audio(url);
      a.setAttribute("playsinline", "");
      cur = a;
      a.onended = function () { resolve(true); };
      a.onerror = function () { resolve(false); };
      var p = a.play();
      if (p && p.catch) p.catch(function () { if (jt === jeton) pulser(true); resolve(false); });
    });
  }

  async function jouerUne(phrase, jt) {
    try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
    try {
      if (window.voixHumaine) {
        var url = await window.voixHumaine.url(phrase);
        if (jt !== jeton) return false;
        if (url) { var ok = await lireURL(url, jt); if (ok) return true; }
      }
    } catch (e) {}
    if (jt !== jeton) return false;
    if (typeof speakWolofOolel === "function") {
      try { var r = await speakWolofOolel(phrase); return r !== false; } catch (e) { return false; }
    }
    return false;
  }

  function dire(liste) {
    var mon = ++jeton;
    pulser(false);
    (async function () {
      for (var i = 0; i < liste.length; i++) {
        if (mon !== jeton) return;
        legende(liste[i]);
        await jouerUne(liste[i], mon);
      }
    })();
  }

  /* ---------- interface ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#dii-aide-wolof{position:fixed;top:10px;right:12px;z-index:9998;width:44px;height:44px;border-radius:50%;" +
    "border:0;background:#25D366;color:#fff;font-size:20px;display:none;align-items:center;justify-content:center;" +
    "box-shadow:0 3px 12px rgba(0,0,0,.4)}" +
    "#dii-aide-wolof:active{background:#128C7E}" +
    "#dii-aide-wolof.pulse{animation:diipulse 1s infinite}" +
    "@keyframes diipulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(37,211,102,.7)}50%{transform:scale(1.12);box-shadow:0 0 0 12px rgba(37,211,102,0)}}" +
    "#dii-aide-bulle{position:fixed;top:60px;right:12px;z-index:9998;max-width:72vw;background:#1F2C34;color:#fff;" +
    "padding:8px 12px;border-radius:14px;font-size:13px;line-height:1.3;display:none;box-shadow:0 3px 12px rgba(0,0,0,.4)}" +
    "#dii-aide-bulle small{display:block;color:#A8B8C0;font-size:11px;margin-top:2px}" +
    ".aide-ic{margin-left:auto;flex:0 0 auto;width:44px;height:44px;border-radius:50%;background:#25D366;color:#fff;" +
    "display:flex;align-items:center;justify-content:center;font-size:20px}";
  document.head.appendChild(st);

  var btn = document.createElement("button");
  btn.id = "dii-aide-wolof"; btn.type = "button"; btn.setAttribute("aria-label", "Aide en wolof"); btn.textContent = "🔊";
  document.body.appendChild(btn);
  var bulle = document.createElement("div");
  bulle.id = "dii-aide-bulle";
  document.body.appendChild(bulle);

  var tBulle = null;
  function legende(phrase) {
    var cle = null;
    Object.keys(P).forEach(function (k) { if (P[k] === phrase) cle = k; });
    bulle.innerHTML = phrase.replace(/</g, "&lt;") + (cle ? "<small>" + FR[cle] + "</small>" : "");
    bulle.style.display = "block";
    clearTimeout(tBulle);
    tBulle = setTimeout(function () { bulle.style.display = "none"; }, 3500);
  }
  function pulser(on) { btn.classList.toggle("pulse", !!on); }

  function visible(id) { var e = document.getElementById(id); return !!(e && e.offsetParent !== null); }
  function pickerVisible(key) { var e = document.getElementById("lvl-" + key); return !!(e && e.style.display !== "none" && e.offsetParent !== null); }

  /* Quelle aide pour l'etape actuelle ? */
  function phrasesEcran() {
    if (visible("dii-passage")) return { sig: "passage", l: [P.passage] };
    if (visible("screen-dashboard")) return { sig: "menu", l: [P.menu] };
    if (visible("screen-general") || visible("screen-wolof")) {
      var key = visible("screen-general") ? "general" : "wolof";
      if (pickerVisible(key)) return { sig: key + ":niveau", l: [P.niveau] };
      if (document.getElementById("step-" + key)) return { sig: key + ":theme", l: [P.theme] };
      return { sig: key + ":mots", l: [P.micro] };
    }
    if (visible("screen-business")) {
      if (pickerVisible("business")) return { sig: "business:niveau", l: [P.niveau] };
      return visible("business-content") ? { sig: "biz:mots", l: [P.micro] } : { sig: "biz:theme", l: [P.theme] };
    }
    if (visible("screen-test-simulation")) {
      if (visible("exam-grid")) return { sig: "exam:liste", l: [P.examen] };
      if (visible("exam-tests")) return { sig: "exam:tests", l: [P.test] };
      return { sig: "exam:live", l: [P.micro] };
    }
    return null;
  }

  btn.onclick = function () { montreJusqua = Date.now() + 6000; pulser(false); var e = phrasesEcran(); try { localStorage.setItem("diisoo_aide_vu", "1"); } catch (x) {} if (e) dire(e.l); };

  /* ---------- declenchement automatique ---------- */
  var geste = 0;
  ["pointerdown", "touchstart", "click", "keydown"].forEach(function (ev) {
    window.addEventListener(ev, function () { geste = Date.now(); }, true);
  });
  var MAXAUTO = 1;
  function compteurs() { try { return JSON.parse(localStorage.getItem("diisoo_aide_n") || "{}") || {}; } catch (e) { return {}; } }
  function ecrire(o) { try { localStorage.setItem("diisoo_aide_n", JSON.stringify(o)); } catch (e) {} }

  var derniere = "", montreJusqua = 0;
  function surcouche() { var e = document.getElementById("screen-premium"); return !!(e && !e.classList.contains("hidden")); }
  setInterval(function () {
    var e = phrasesEcran();
    if (e && surcouche()) e = null;
    /* le bouton ne reste pas affiche en permanence : 10 s a chaque nouvel ecran (20 s s'il clignote), puis il disparait */
    btn.style.display = (e && Date.now() < montreJusqua) ? "flex" : "none";
    if (!e) { derniere = ""; return; }
    if (e.sig === derniere) return;
    derniere = e.sig;
    montreJusqua = Date.now() + 10000;
    var recent = Date.now() - geste < 3000;
    var c = compteurs(), n = c[e.sig] || 0;
    if (e.sig === "passage") return;
    if (recent && n < MAXAUTO) {
      c[e.sig] = n + 1; ecrire(c);
      var sig = e.sig;
      setTimeout(function () { var x = phrasesEcran(); if (x && x.sig === sig) dire(x.l); }, 250);
    } else if (!recent) {
      /* pas de geste recent (ouverture de l'app) : le navigateur bloque le son, on attire l'oeil */
      var vu = false; try { vu = !!localStorage.getItem("diisoo_aide_vu"); } catch (x) {}
      if (!vu || n < MAXAUTO) { pulser(true); montreJusqua = Date.now() + 20000; }
    }
  }, 350);

  /* ---------- 🔊 sur chaque niveau ---------- */
  var NIV = [P.debutant, P.inter, P.avance];
  function equiper() {
    var btns = document.querySelectorAll(".lvl-btn");
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      if (b.querySelector(".aide-ic")) continue;
      var idx = Array.prototype.indexOf.call(b.parentNode.querySelectorAll(".lvl-btn"), b);
      var s = document.createElement("span");
      s.className = "aide-ic"; s.textContent = "🔊";
      (function (n) {
        s.addEventListener("click", function (ev) { ev.stopPropagation(); ev.preventDefault(); dire([NIV[n]]); });
      })(idx);
      b.appendChild(s);
    }
  }
  try { new MutationObserver(equiper).observe(document.body, { childList: true, subtree: true }); equiper(); } catch (e) {}

  /* Niveau verrouille (si le test de passage n'est pas charge) */
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest(".lvl-btn.lock");
    if (b && !ev.target.closest(".aide-ic")) dire([P.verrou]);
  }, true);

  /* Prepare les voix en arriere-plan pour que la premiere ecoute soit immediate */
  setTimeout(function () {
    try {
      var liste = Object.keys(P).map(function (k) { return P[k]; });
      if (typeof prefetchVoix === "function") prefetchVoix(liste, "wo");
    } catch (e) {}
  }, 6000);

  window.DiisooAideWolof.dire = function (cle) { if (P[cle]) dire([P[cle]]); };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-aide-wolof.js",e);}

try{
/* ---- diisoo-biz.js ---- */
/* diisoo-biz.js v1 : Business range comme Anglais et Wolof
   Etape 1 : choisir son niveau (Debutant, Intermediaire, Avance), les niveaux fermes ouvrent le test de passage
   Etape 2 : choisir son secteur (+ Anglais des marches)
   Etape 3 : les phrases de CE niveau seulement, une carte a la fois */
(function () {
  "use strict";

  var NAMES = ["Débutant", "Intermédiaire", "Avancé"];
  var ICONS = ["🌱", "🌿", "🌳"];
  var CODES = ["debutant", "intermediaire", "avance"];
  var L = null, sect = null, marches = false;

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function haut() { try { window.scrollTo(0, 0); } catch (e) {} }
  function unlocked() { try { return tierState().business.unlocked || 1; } catch (e) { return 1; } }
  function secteurs() {
    try {
      var o = window.DIISOO_ORDRE_TOURISME || [], r = function (k) { var i = o.indexOf(k); return i < 0 ? 99 : i; };
      return Object.keys(BUSINESS_SECTORS).filter(function (k) { return CHINA_TRADE_WOLOF[k] && CHINA_TRADE_WOLOF[k].vocab.length; })
        .sort(function (a, b) { return r(a) - r(b); });
    } catch (e) { return []; }
  }
  function items(k, niv) {
    var out = [];
    CHINA_TRADE_WOLOF[k].vocab.forEach(function (v, i) { if (v.niveau === CODES[niv - 1]) out.push({ v: v, i: i }); });
    return out;
  }
  function total(niv) { var n = 0; secteurs().forEach(function (k) { n += items(k, niv).length; }); return n; }

  var st = document.createElement("style");
  st.textContent =
    "#business-picker,#btn-business-back{display:none!important}" +
    "#business-tabs,#business-tabs.biz-off{display:none!important}" +
    "#biz-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}" +
    "#biz-grid button{display:flex;align-items:center;gap:8px;min-height:64px;padding:8px 10px;border-radius:14px;" +
    "background:#141A2B;border:1px solid #1E2740;color:#F6F1E7;text-align:left}" +
    "#biz-grid button:active{border-color:#E1693F}" +
    "#biz-grid .bz-ic{font-size:24px;line-height:1}" +
    "#biz-grid .bz-nm{font-size:13px;font-weight:700;line-height:1.2}" +
    "#biz-grid .bz-n{display:block;font-size:11px;font-weight:400;color:#A69C86;margin-top:2px}" +
    "#biz-grid button.bz-m{grid-column:1/-1;border-color:#3FAE74}" +
    "#biz-grid button.bz-t{grid-column:1/-1;border-color:#F3A94E;background:#1B1A22}" +
    "body:has(#screen-business:not(.hidden)) [role=main]{min-height:0!important;padding:60px 14px 10px!important;justify-content:flex-start!important}" +
    "body:has(#bizback-sec) #screen-business>div.text-center{display:none!important}" +
    "body:has(#bizstep) #screen-business>div.text-center,body:has(#bizstep) #fx-biz-btn,body:has(#bizback-sec) #fx-biz-btn,body:has(#bizback-sec) #bizback-lvl,body:has(#bizback-sec) #secteurs-zone{display:none!important}" +
    "body:has(#bizback-sec) #screen-business:not(.hidden){display:flex;flex-direction:row;flex-wrap:wrap;gap:8px;align-content:flex-start;margin:0!important}" +
    "body:has(#bizback-sec) #screen-business>*{flex:0 0 100%;margin:0!important}" +
    "body:has(#bizback-sec) #dsn-btn-business,body:has(#bizback-sec) #dcv-btn-business{flex:1 1 calc(50% - 4px)!important;min-width:0;padding:6px 8px!important;font-size:13px!important;line-height:1.15!important;min-height:44px;width:auto!important}" +
    "body:has(#bizstep) #screen-business,body:has(#bizback-lvl) #screen-business{margin:0!important}" +
    "body:has(#screen-business:not(.hidden)):has(#bizback-sec) [role=main]{padding-top:4px!important}" +
    "body:has(#bizback-sec) #business-content .fx-lab{display:none}" +
    "body:has(#bizback-sec) #business-content .fx-nav{padding:0}" +
    "body:has(#bizback-sec) #business-content [data-practice]{min-height:0!important;height:auto!important;padding:6px 8px!important;display:flex!important;flex-direction:row!important;align-items:center;justify-content:center;gap:8px}" +
    "body:has(#bizback-sec) #business-content [data-practice] .dii-i{font-size:18px!important;line-height:1!important;margin:0!important;width:auto!important;height:auto!important}" +
    "body:has(#bizback-sec) #business-content [data-practice] .dii-c{font-size:13.5px!important;margin:0!important}" +
    "body:has(#bizback-sec) #business-content .as-btn{min-height:0!important;padding:8px!important}" +
    "body:has(#bizback-sec) #business-content>div.bg-\\[\\#141A2B\\]{padding:10px!important}" +
    "#business-content{max-height:none!important;overflow:visible!important}";
  document.head.appendChild(st);

  function ancre() { return $("business-picker"); }
  function retirer(id) { var e = $(id); if (e) e.remove(); }
  function nettoyer() {
    retirer("biz-grid"); retirer("bizback-lvl"); retirer("bizback-sec"); retirer("bizstep");
    var c = $("business-content"); if (c) { c.classList.add("hidden"); c.innerHTML = ""; }
    var v = $("secteurs-vue"); if (v) { v.classList.add("hidden"); v.innerHTML = ""; }
    var r = $("secteurs-retour"); if (r) r.classList.add("hidden");
  }
  function insererAvant(el) { var a = ancre(); if (a && a.parentNode) a.parentNode.insertBefore(el, a); }
  function barre(id, texte, cls, fn) {
    var b = document.createElement("button");
    b.type = "button"; b.id = id; b.className = "lvl-back " + (cls || "");
    b.textContent = texte; b.onclick = fn;
    insererAvant(b);
  }

  /* ---------- Etape 1 : niveau ---------- */
  function niveaux() {
    L = null; sect = null; marches = false;
    nettoyer();
    var p = $("lvl-business");
    if (!p) { p = document.createElement("div"); p.id = "lvl-business"; p.className = "lvl-picker"; insererAvant(p); }
    p.innerHTML = "";
    var t = document.createElement("p"); t.className = "lvl-title"; t.textContent = "Étape 1 : choisis ton niveau"; p.appendChild(t);
    var un = unlocked();
    [1, 2, 3].forEach(function (n) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "lvl-btn" + (n > un ? " lock" : "");
      b.innerHTML = '<span class="lvl-ic">' + (n > un ? "🔒" : ICONS[n - 1]) + '</span><span><span class="lvl-nm">' + NAMES[n - 1] +
        '</span><br><span class="lvl-sub">' + (n > un ? "Test de passage" : "✅ Ouvert") + " · " + total(n) + " phrases</span></span>";
      b.onclick = function () { if (n <= un) liste(n); };
      p.appendChild(b);
    });
    p.style.display = "";
    haut();
  }

  /* ---------- Etape 2 : secteur (le tourisme est UN secteur, ses métiers sont dedans) ---------- */
  function estTour(k) { return /^tour_/.test(k); }
  function tuile(ic, nom, sous, fn, cls) {
    var b = document.createElement("button");
    b.type = "button"; if (cls) b.className = cls;
    b.innerHTML = '<span class="bz-ic">' + ic + '</span><span class="bz-nm">' + esc(nom) + '<span class="bz-n">' + esc(sous) + "</span></span>";
    b.onclick = fn; return b;
  }
  function liste(n) {
    L = n; sect = null; marches = false;
    nettoyer();
    var p = $("lvl-business"); if (p) p.style.display = "none";
    barre("bizback-lvl", ICONS[n - 1] + " " + NAMES[n - 1] + " : changer de niveau", "", niveaux);
    var s = document.createElement("p"); s.id = "bizstep"; s.className = "lvl-step"; s.textContent = "Étape 2 : choisis ton secteur";
    insererAvant(s);
    var g = document.createElement("div"); g.id = "biz-grid";
    var nbT = 0;
    secteurs().forEach(function (k) {
      var nb = items(k, n).length;
      if (!nb) return;
      if (estTour(k)) { nbT += nb; return; }
      g.appendChild(tuile(BUSINESS_SECTORS[k].icon, BUSINESS_SECTORS[k].titre, nb + " phrases", function () { lecon(k); }));
    });
    if (nbT) g.appendChild(tuile("🏝️", "Tourisme", "Hôtel, restaurant, guide, taxi, plage... · " + nbT + " phrases", function () { tourisme(n); }, "bz-t"));
    if (marchesDispo()) g.appendChild(tuile("🛒", "Anglais des marchés", "Colobane, Sandaga, Centenaire, Guangzhou", ouvrirMarches, "bz-m"));
    insererAvant(g);
    haut();
  }
  function tourisme(n) {
    L = n; sect = null; marches = false;
    nettoyer();
    barre("bizback-lvl", "🏝️ Tourisme : changer de secteur", "", function () { liste(n); });
    var s = document.createElement("p"); s.id = "bizstep"; s.className = "lvl-step"; s.textContent = "Tourisme : choisis ton métier";
    insererAvant(s);
    var g = document.createElement("div"); g.id = "biz-grid";
    secteurs().forEach(function (k) {
      if (!estTour(k)) return;
      var nb = items(k, n).length; if (!nb) return;
      g.appendChild(tuile(BUSINESS_SECTORS[k].icon, BUSINESS_SECTORS[k].titre, nb + " phrases", function () { lecon(k); }));
    });
    insererAvant(g);
    haut();
  }

  /* ---------- Etape 3 : les phrases du niveau ---------- */
  function lecon(k) {
    sect = k; marches = false;
    retirer("biz-grid"); retirer("bizstep"); retirer("bizback-sec");
    barre("bizback-sec", BUSINESS_SECTORS[k].icon + " " + BUSINESS_SECTORS[k].titre + " : changer de secteur", "th", function () { if (estTour(k)) tourisme(L); else liste(L); });
    try { businessModule = k; } catch (e) {}
    var mod = CHINA_TRADE_WOLOF[k], liste1 = items(k, L);
    try {
      var dl = BUSINESS_DIALOGUES[k] || [];
      prefetchVoix(liste1.map(function (x) { return x.v.wo; }).concat(dl.map(function (l) { return l.wo; })), "wo");
      prefetchVoix(liste1.map(function (x) { return x.v.en; }).concat(dl.map(function (l) { return l.en; })), "en");
    } catch (e) {}
    var box = $("business-content");
    box.classList.remove("hidden");
    var html = '<h4 class="text-sm font-bold text-[#F6F1E7] text-center">' + esc(mod.title) + " · " + NAMES[L - 1] + "</h4>";
    var vb = null;
    if (L > 1 && liste1.length && typeof verrouBiz === "function") { try { vb = verrouBiz(mod, liste1[0].v, liste1[0].i); } catch (e) { vb = null; } }
    if (vb) html += vb;
    else {
      liste1.forEach(function (x) {
        var v = x.v, i = x.i;
        html += '<div class="bg-[#141A2B] border border-[#1E2740] rounded-xl p-3 space-y-1">' +
          '<p class="text-sm font-semibold text-[#F6F1E7]">' + esc(v.en) + "</p>" +
          '<p class="text-xs text-[#A69C86]">' + esc(v.fr) + "</p>" +
          (v.wo ? '<p class="text-xs text-[#5FC98F] italic">🗣️ ' + esc(v.wo) + "</p>" : "") +
          '<div class="grid grid-cols-2 gap-2 mt-1">' +
          '<button data-biz="en" data-sec="' + k + '" data-i="' + i + '" data-practice="biz-en:' + k + ":" + i + '" data-gate="0" class="py-2 bg-[#1E2740] hover:bg-[#2A3454] rounded-lg text-[11px] font-semibold">🔊 English</button>' +
          (v.wo ? '<button data-biz="wo" data-sec="' + k + '" data-i="' + i + '" data-practice="biz-wo:' + k + ":" + i + '" data-gate="0" class="py-2 bg-[#1E2740] hover:bg-[#2A3454] rounded-lg text-[11px] font-semibold">🔊 Wolof</button>' : "") +
          "</div>" +
          '<button onclick="practiceBusinessPhrase(\'' + k + "'," + i + ')" data-practice="biz:' + k + ":" + i + '" class="mt-1 w-full py-2 bg-[#1E2740] hover:bg-[#2A3454] rounded-lg text-[11px] font-semibold">🎤 M\'entraîner</button>' +
          '<p id="biz-res-' + k + "-" + i + '" class="text-[11px] text-[#A69C86]">👂 Écoute d\'abord l\'anglais, puis entraîne-toi.</p>' +
          "</div>";
      });
      if (L >= 2 && BUSINESS_DIALOGUES[k] && BUSINESS_DIALOGUES[k].length && typeof renderBusinessDialogue === "function") html += renderBusinessDialogue(k);
    }
    box.innerHTML = html;
    try { refreshPracticeButtons(); } catch (e) {}
    haut();
  }

  /* ---------- Anglais des marches (module existant, ouvert via l'onglet cache) ---------- */
  function ongletMarches() {
    var t = $("business-tabs");
    if (!t) return null;
    return Array.prototype.slice.call(t.children).filter(function (b) { return /Anglais des march/i.test(b.textContent); })[0] || null;
  }
  function marchesDispo() { return !!(ongletMarches() || $("secteurs-ouvrir")); }
  function ouvrirMarches() {
    marches = true;
    retirer("biz-grid"); retirer("bizstep"); retirer("bizback-sec");
    var bc = $("business-content"); if (bc) { bc.classList.add("hidden"); bc.innerHTML = ""; }
    barre("bizback-sec", "🛒 Anglais des marchés : changer de secteur", "th", function () { liste(L || 1); });
    var o = ongletMarches();
    if (o) o.click(); else { var x = $("secteurs-ouvrir"); if (x) x.click(); }
    var r = $("secteurs-retour"); if (r) r.classList.add("hidden");
    haut();
  }

  /* ---------- entree dans Business ---------- */
  var orig = window.openBusinessModule;
  if (typeof orig === "function") {
    window.openBusinessModule = function () {
      var r = orig.apply(this, arguments);
      try {
        var a = ancre(); if (a) a.classList.add("hidden");
        niveaux();
      } catch (e) { console.warn("[diisoo] biz", e); }
      return r;
    };
  }

  window.DiisooBiz = { version: 1, niveau: function () { return L; }, secteur: function () { return sect; } };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-biz.js",e);}

try{
/* ---- diisoo-biz-plus.js ---- */
/* diisoo-biz-plus.js v1 : Business enrichi
   1) plus de vocabulaire dans les 6 secteurs existants (débutant, intermédiaire, avancé)
   2) 7 nouveaux secteurs touristiques : Hôtel, Restaurant, Guide, Taxi, Artisanat, Agence de voyage, Plage
   Le wolof des nouvelles lignes est une première version à faire valider par un locuteur natif ; une ligne sans wolof n'affiche que l'anglais et le français. */
(function () {
  "use strict";
  if (window.__diisooBizPlus) return;
  var C, S, DL;
  try { C = CHINA_TRADE_WOLOF; S = BUSINESS_SECTORS; DL = BUSINESS_DIALOGUES; } catch (e) { return; }
  if (!C || !S || !DL) return;
  window.__diisooBizPlus = true;
  var AJOUTS = {"colobane": [{"en": "Do you have this part in stock?", "fr": "Avez-vous cette pièce en stock ?", "niveau": "debutant", "wo": "Ndax am nga pièce bii ci stock bi ?"}, {"en": "Which car is it for?", "fr": "C'est pour quelle voiture ?", "niveau": "debutant", "wo": "Ban oto la ?"}, {"en": "I need an oil filter", "fr": "Il me faut un filtre à huile", "niveau": "debutant", "wo": "Dama soxla filtre à huile."}, {"en": "Please make the price lower", "fr": "Baissez un peu le prix, s'il vous plaît", "niveau": "debutant", "wo": "Wàññil ma njëg gi tuuti, bu la neexee."}, {"en": "Is this part compatible with a 2010 Corolla?", "fr": "Cette pièce est-elle compatible avec une Corolla 2010 ?", "niveau": "intermediaire", "wo": "Ndax pièce bii dafa méngoo ak Corolla 2010 ?"}, {"en": "Can you check the part number for me?", "fr": "Pouvez-vous vérifier le numéro de la pièce ?", "niveau": "intermediaire"}, {"en": "I buy ten units. What is your best price?", "fr": "J'en achète dix. Quel est votre dernier prix ?", "niveau": "intermediaire"}, {"en": "Is the warranty valid for six months?", "fr": "La garantie est-elle valable six mois ?", "niveau": "intermediaire"}, {"en": "The part you sold me does not fit. I would like an exchange.", "fr": "La pièce que vous m'avez vendue ne va pas. Je voudrais un échange.", "niveau": "avance"}, {"en": "Can you supply twenty sets of brake pads every month?", "fr": "Pouvez-vous fournir vingt jeux de plaquettes chaque mois ?", "niveau": "avance"}, {"en": "I want a written invoice with the warranty terms.", "fr": "Je veux une facture écrite avec les conditions de garantie.", "niveau": "avance"}, {"en": "If I pay in cash today, will you include delivery?", "fr": "Si je paie comptant aujourd'hui, la livraison est-elle comprise ?", "niveau": "avance"}], "sandaga": [{"en": "Can I try it on?", "fr": "Puis-je l'essayer ?", "niveau": "debutant", "wo": "Mën naa ko sol ?"}, {"en": "Do you have this in another colour?", "fr": "Avez-vous ceci dans une autre couleur ?", "niveau": "debutant", "wo": "Ndax am nga ko ci beneen melo ?"}, {"en": "It is too small", "fr": "C'est trop petit", "niveau": "debutant", "wo": "Dafa tuuti lool."}, {"en": "It is too big", "fr": "C'est trop grand", "niveau": "debutant", "wo": "Dafa mag lool."}, {"en": "How many metres of fabric do I need for a dress?", "fr": "Combien de mètres de tissu faut-il pour une robe ?", "niveau": "intermediaire"}, {"en": "Is this wax fabric real or a copy?", "fr": "Ce pagne wax est-il authentique ou une copie ?", "niveau": "intermediaire"}, {"en": "Do you give a discount for six pieces?", "fr": "Faites-vous une remise pour six pièces ?", "niveau": "intermediaire"}, {"en": "Does the colour fade when I wash it?", "fr": "La couleur déteint-elle au lavage ?", "niveau": "intermediaire"}, {"en": "I would like to order fifty shirts in three sizes.", "fr": "Je voudrais commander cinquante chemises en trois tailles.", "niveau": "avance"}, {"en": "What is the delivery time for a large order?", "fr": "Quel est le délai de livraison pour une grosse commande ?", "niveau": "avance"}, {"en": "Can you put my shop name on the labels?", "fr": "Pouvez-vous mettre le nom de ma boutique sur les étiquettes ?", "niveau": "avance"}, {"en": "I want to pay half now and half on delivery.", "fr": "Je veux payer la moitié maintenant et la moitié à la livraison.", "niveau": "avance"}], "electronique": [{"en": "Does it work with a Senegalese plug?", "fr": "Est-ce que ça marche avec une prise sénégalaise ?", "niveau": "debutant"}, {"en": "Is it new or second-hand?", "fr": "Est-il neuf ou d'occasion ?", "niveau": "debutant"}, {"en": "How much is the screen protector?", "fr": "Combien coûte le verre de protection ?", "niveau": "debutant"}, {"en": "Can I test it before I pay?", "fr": "Puis-je le tester avant de payer ?", "niveau": "debutant"}, {"en": "How much memory does this phone have?", "fr": "Quelle est la mémoire de ce téléphone ?", "niveau": "intermediaire"}, {"en": "Is it unlocked for all networks?", "fr": "Est-il débloqué pour tous les réseaux ?", "niveau": "intermediaire"}, {"en": "Does it come with a one-year warranty?", "fr": "Est-il vendu avec un an de garantie ?", "niveau": "intermediaire"}, {"en": "The battery drains very fast. Can you check it?", "fr": "La batterie se vide très vite. Pouvez-vous la vérifier ?", "niveau": "intermediaire"}, {"en": "I am a reseller. What is your wholesale price for twenty phones?", "fr": "Je suis revendeur. Quel est votre prix de gros pour vingt téléphones ?", "niveau": "avance"}, {"en": "Can you show me the original box and the IMEI number?", "fr": "Pouvez-vous me montrer la boîte d'origine et le numéro IMEI ?", "niveau": "avance"}, {"en": "Which after-sales service do you offer?", "fr": "Quel service après-vente proposez-vous ?", "niveau": "avance"}, {"en": "I want a refund because the device is defective.", "fr": "Je veux un remboursement car l'appareil est défectueux.", "niveau": "avance"}], "bazar": [{"en": "How much is this chair?", "fr": "Combien coûte cette chaise ?", "niveau": "debutant", "wo": "Ñaata la chaise bii ?"}, {"en": "Do you have a bigger table?", "fr": "Avez-vous une table plus grande ?", "niveau": "debutant"}, {"en": "I want to see the mattress", "fr": "Je veux voir le matelas", "niveau": "debutant", "wo": "Bëgg naa gis matela bi."}, {"en": "Can you deliver it today?", "fr": "Pouvez-vous le livrer aujourd'hui ?", "niveau": "debutant"}, {"en": "What are the dimensions of the wardrobe?", "fr": "Quelles sont les dimensions de l'armoire ?", "niveau": "intermediaire"}, {"en": "Is assembly included in the price?", "fr": "Le montage est-il compris dans le prix ?", "niveau": "intermediaire"}, {"en": "Can I pay in three instalments?", "fr": "Puis-je payer en trois fois ?", "niveau": "intermediaire"}, {"en": "Do you have this sofa in stock or must I wait?", "fr": "Ce canapé est-il en stock ou dois-je attendre ?", "niveau": "intermediaire"}, {"en": "I am furnishing a guesthouse. What discount can you offer for ten beds?", "fr": "J'équipe une maison d'hôtes. Quelle remise pour dix lits ?", "niveau": "avance"}, {"en": "Can you build the cupboard to my measurements?", "fr": "Pouvez-vous fabriquer le placard à mes mesures ?", "niveau": "avance"}, {"en": "The delivery was late and the table is scratched.", "fr": "La livraison était en retard et la table est rayée.", "niveau": "avance"}, {"en": "I need a quotation with delivery to Saint-Louis.", "fr": "J'ai besoin d'un devis avec livraison à Saint-Louis.", "niveau": "avance"}], "agriculture": [{"en": "How much is a kilo of tomatoes?", "fr": "Combien coûte un kilo de tomates ?", "niveau": "debutant", "wo": "Ñaata la kilo tomaat ?"}, {"en": "Are these vegetables fresh?", "fr": "Ces légumes sont-ils frais ?", "niveau": "debutant"}, {"en": "I want a bag of onions", "fr": "Je veux un sac d'oignons", "niveau": "debutant", "wo": "Bëgg naa benn sak soble."}, {"en": "Is the price per kilo or per bag?", "fr": "Le prix est-il au kilo ou au sac ?", "niveau": "debutant"}, {"en": "When is the harvest season?", "fr": "Quand est la saison de la récolte ?", "niveau": "intermediaire"}, {"en": "Do you sell directly from the farm?", "fr": "Vendez-vous directement depuis la ferme ?", "niveau": "intermediaire"}, {"en": "How many hectares do you cultivate?", "fr": "Combien d'hectares cultivez-vous ?", "niveau": "intermediaire"}, {"en": "Can you deliver to the market before six in the morning?", "fr": "Pouvez-vous livrer au marché avant six heures du matin ?", "niveau": "intermediaire"}, {"en": "I want to sign a supply contract for the whole season.", "fr": "Je veux signer un contrat d'approvisionnement pour toute la saison.", "niveau": "avance"}, {"en": "What are your quality standards for export?", "fr": "Quelles sont vos normes de qualité pour l'export ?", "niveau": "avance"}, {"en": "How do you keep the produce cool during transport?", "fr": "Comment gardez-vous les produits au frais pendant le transport ?", "niveau": "avance"}, {"en": "The price depends on the rain this year.", "fr": "Le prix dépend de la pluie cette année.", "niveau": "avance"}], "chine": [{"en": "Where is the nearest customs office?", "fr": "Où est le bureau de douane le plus proche ?", "niveau": "debutant"}, {"en": "How long does the shipping take?", "fr": "Combien de temps dure l'expédition ?", "niveau": "debutant"}, {"en": "I need a tracking number", "fr": "J'ai besoin d'un numéro de suivi", "niveau": "debutant"}, {"en": "Can you send me photos of the goods?", "fr": "Pouvez-vous m'envoyer des photos de la marchandise ?", "niveau": "debutant"}, {"en": "What is the minimum order quantity?", "fr": "Quelle est la quantité minimale de commande ?", "niveau": "intermediaire"}, {"en": "Is the price FOB or CIF?", "fr": "Le prix est-il FOB ou CIF ?", "niveau": "intermediaire"}, {"en": "Can you arrange the packing list and the invoice?", "fr": "Pouvez-vous préparer la liste de colisage et la facture ?", "niveau": "intermediaire"}, {"en": "How much is the sea freight for one container?", "fr": "Combien coûte le fret maritime pour un conteneur ?", "niveau": "intermediaire"}, {"en": "I would like to inspect the goods before they are shipped.", "fr": "Je voudrais inspecter la marchandise avant l'expédition.", "niveau": "avance"}, {"en": "Who is responsible if the container is damaged?", "fr": "Qui est responsable si le conteneur est endommagé ?", "niveau": "avance"}, {"en": "Please confirm the payment terms in writing.", "fr": "Veuillez confirmer les conditions de paiement par écrit.", "niveau": "avance"}, {"en": "The shipment is held at the port. What documents are missing?", "fr": "L'expédition est bloquée au port. Quels documents manquent ?", "niveau": "avance"}]};
  var TOUR = {"tour_hotel": {"icon": "🏨", "titre": "Hôtel & Accueil", "sous": "Réception, chambres, plaintes, séjours.", "fond": "#14203A", "title": "🏨 Hôtel & Accueil", "vocab": [{"en": "Welcome to our hotel", "fr": "Bienvenue dans notre hôtel", "niveau": "debutant", "wo": "Dalal ak jàmm ci sunu hôtel."}, {"en": "Do you have a reservation?", "fr": "Avez-vous une réservation ?", "niveau": "debutant", "wo": "Ndax am nga réservation ?"}, {"en": "Your room is on the second floor", "fr": "Votre chambre est au deuxième étage", "niveau": "debutant"}, {"en": "Here is your key", "fr": "Voici votre clé", "niveau": "debutant", "wo": "Kle bi nii."}, {"en": "Breakfast is from seven to ten", "fr": "Le petit déjeuner est de sept à dix heures", "niveau": "debutant"}, {"en": "The Wi-Fi password is on the card", "fr": "Le mot de passe du Wi-Fi est sur la carte", "niveau": "debutant"}, {"en": "How many nights will you stay?", "fr": "Combien de nuits restez-vous ?", "niveau": "debutant", "wo": "Ñaata guddi ngay def fii ?"}, {"en": "A single room or a double room?", "fr": "Une chambre simple ou une chambre double ?", "niveau": "intermediaire"}, {"en": "The price includes breakfast and taxes", "fr": "Le prix comprend le petit déjeuner et les taxes", "niveau": "intermediaire"}, {"en": "Check-out is at noon", "fr": "Le départ se fait à midi", "niveau": "intermediaire"}, {"en": "I can store your luggage until the evening", "fr": "Je peux garder vos bagages jusqu'au soir", "niveau": "intermediaire"}, {"en": "Would you like air conditioning or a fan?", "fr": "Voulez-vous la climatisation ou un ventilateur ?", "niveau": "intermediaire"}, {"en": "We can arrange an airport transfer for you", "fr": "Nous pouvons organiser votre transfert depuis l'aéroport", "niveau": "intermediaire"}, {"en": "Please fill in this registration form", "fr": "Veuillez remplir cette fiche d'enregistrement", "niveau": "intermediaire"}, {"en": "I am sorry for the inconvenience. We will change your room immediately.", "fr": "Désolé pour le désagrément. Nous changeons votre chambre tout de suite.", "niveau": "avance"}, {"en": "The hot water is not working. Could you send someone?", "fr": "L'eau chaude ne marche pas. Pouvez-vous envoyer quelqu'un ?", "niveau": "avance"}, {"en": "We are fully booked, but I can offer you a room at our sister hotel.", "fr": "Nous sommes complets, mais je peux vous proposer une chambre dans notre hôtel partenaire.", "niveau": "avance"}, {"en": "For a stay of seven nights, I can offer a ten percent discount.", "fr": "Pour sept nuits, je peux vous accorder dix pour cent de remise.", "niveau": "avance"}, {"en": "Could you recommend a quiet restaurant nearby?", "fr": "Pouvez-vous me recommander un restaurant calme à proximité ?", "niveau": "avance"}, {"en": "The cancellation is free up to forty-eight hours before arrival.", "fr": "L'annulation est gratuite jusqu'à quarante-huit heures avant l'arrivée.", "niveau": "avance"}, {"en": "I would like to leave a review about your excellent service.", "fr": "Je voudrais laisser un avis sur votre excellent service.", "niveau": "avance"}], "dlg": [{"role": "client", "wo": "Salaamaleekum, am naa benn réservation.", "fr": "Bonjour, j'ai une réservation.", "en": "Good evening, I have a reservation."}, {"role": "marchand", "wo": "Dalal ak jàmm. Ban tur la ?", "fr": "Bienvenue. À quel nom ?", "en": "Welcome. What is the name, please?"}, {"role": "client", "wo": "Tur wi Smith la, ñaar guddi.", "fr": "Smith, pour deux nuits.", "en": "Smith, for two nights."}, {"role": "marchand", "wo": "Waaw, gis naa ko. Néeg bi ci étage bi ñaareel la.", "fr": "Oui, je le vois. Votre chambre est au deuxième étage.", "en": "Yes, I can see it. Your room is on the second floor."}, {"role": "client", "wo": "Ndax petit déjeuner bi dafa bokk ?", "fr": "Le petit déjeuner est-il compris ?", "en": "Is breakfast included?"}, {"role": "marchand", "wo": "Waaw, dafa bokk. Mu tàmbali ci juróom-ñaar.", "fr": "Oui, il est compris. Il commence à sept heures.", "en": "Yes, it is included. It starts at seven."}, {"role": "client", "wo": "Jërëjëf lool.", "fr": "Merci beaucoup.", "en": "Thank you very much."}, {"role": "marchand", "wo": "Amul solo. Jërëjëf, jàmm ak jàmm.", "fr": "Je vous en prie. Bon séjour.", "en": "You are welcome. Enjoy your stay."}]}, "tour_resto": {"icon": "🍽️", "titre": "Restaurant & Bar", "sous": "Commander, plats sénégalais, addition.", "fond": "#2A1810", "title": "🍽️ Restaurant & Bar", "vocab": [{"en": "A table for two, please", "fr": "Une table pour deux, s'il vous plaît", "niveau": "debutant", "wo": "Benn table ñaar nit, bu la neexee."}, {"en": "Here is the menu", "fr": "Voici la carte", "niveau": "debutant", "wo": "Menu bi nii."}, {"en": "What would you like to drink?", "fr": "Que désirez-vous boire ?", "niveau": "debutant", "wo": "Lan nga bëgg a naan ?"}, {"en": "Water, please", "fr": "De l'eau, s'il vous plaît", "niveau": "debutant", "wo": "Ndox, bu la neexee."}, {"en": "I would like fish and rice", "fr": "Je voudrais du riz au poisson", "niveau": "debutant", "wo": "Bëgg naa ceebu jën."}, {"en": "The bill, please", "fr": "L'addition, s'il vous plaît", "niveau": "debutant", "wo": "Facture bi, bu la neexee."}, {"en": "It is delicious", "fr": "C'est délicieux", "niveau": "debutant", "wo": "Neex na lool."}, {"en": "Today's special is chicken yassa", "fr": "Le plat du jour est le poulet yassa", "niveau": "intermediaire"}, {"en": "Is it spicy?", "fr": "Est-ce épicé ?", "niveau": "intermediaire"}, {"en": "I am allergic to peanuts", "fr": "Je suis allergique aux arachides", "niveau": "intermediaire"}, {"en": "Can I have it without pepper?", "fr": "Puis-je l'avoir sans piment ?", "niveau": "intermediaire"}, {"en": "Would you like to try the bissap juice?", "fr": "Voulez-vous goûter le jus de bissap ?", "niveau": "intermediaire"}, {"en": "Do you accept card or mobile money?", "fr": "Acceptez-vous la carte ou le mobile money ?", "niveau": "intermediaire"}, {"en": "We recommend the grilled fish with onion sauce", "fr": "Nous recommandons le poisson grillé sauce oignon", "niveau": "intermediaire"}, {"en": "Could you recommend a typical Senegalese dish for someone who has never tried it?", "fr": "Pouvez-vous recommander un plat sénégalais typique à quelqu'un qui n'a jamais goûté ?", "niveau": "avance"}, {"en": "This dish is cold. Could you heat it up, please?", "fr": "Ce plat est froid. Pouvez-vous le réchauffer, s'il vous plaît ?", "niveau": "avance"}, {"en": "We have a vegetarian menu and a halal kitchen.", "fr": "Nous avons un menu végétarien et une cuisine halal.", "niveau": "avance"}, {"en": "I would like to book the terrace for a group of twelve on Saturday.", "fr": "Je voudrais réserver la terrasse pour douze personnes samedi.", "niveau": "avance"}, {"en": "The service was excellent, please keep the change.", "fr": "Le service était excellent, gardez la monnaie.", "niveau": "avance"}, {"en": "We can prepare a set menu for tour groups at a fixed price.", "fr": "Nous pouvons préparer un menu fixe pour les groupes à prix unique.", "niveau": "avance"}, {"en": "Could we split the bill between four people?", "fr": "Pouvons-nous partager l'addition entre quatre personnes ?", "niveau": "avance"}], "dlg": [{"role": "marchand", "wo": "Salaamaleekum. Ñaata nit ngeen ?", "fr": "Bonjour. Vous êtes combien ?", "en": "Good evening. How many are you?"}, {"role": "client", "wo": "Ñett nit lanu, bu la neexee.", "fr": "Nous sommes trois, s'il vous plaît.", "en": "We are three, please."}, {"role": "marchand", "wo": "Menu bi nii. Lan ngeen bëgg a naan ?", "fr": "Voici la carte. Que voulez-vous boire ?", "en": "Here is the menu. What would you like to drink?"}, {"role": "client", "wo": "Ndox ak bisaab, bu la neexee.", "fr": "De l'eau et du bissap, s'il vous plaît.", "en": "Water and bissap juice, please."}, {"role": "marchand", "wo": "Waaw. Ak lan ngeen bëgg a lekk ?", "fr": "Très bien. Et pour manger ?", "en": "Very well. And what would you like to eat?"}, {"role": "client", "wo": "Ñetti ceebu jën, waaye bul ko def piment lu bari.", "fr": "Trois riz au poisson, mais pas trop épicé.", "en": "Three fish and rice, but not too spicy."}, {"role": "marchand", "wo": "Baax na. Dinaa ko def ni nga ko bëgge.", "fr": "D'accord. Je le ferai comme vous voulez.", "en": "Of course. I will make it the way you like."}, {"role": "client", "wo": "Jërëjëf.", "fr": "Merci.", "en": "Thank you."}]}, "tour_guide": {"icon": "🧭", "titre": "Guide & Excursions", "sous": "Gorée, Lac Rose, Saloum, Casamance, circuits.", "fond": "#10261A", "title": "🧭 Guide & Excursions", "vocab": [{"en": "Welcome, I am your guide", "fr": "Bienvenue, je suis votre guide", "niveau": "debutant", "wo": "Dalal ak jàmm, maa ngi di sa guide."}, {"en": "Please follow me", "fr": "Suivez-moi, s'il vous plaît", "niveau": "debutant", "wo": "Toppal ma, bu la neexee."}, {"en": "This is Gorée Island", "fr": "Voici l'île de Gorée", "niveau": "debutant", "wo": "Gorée la."}, {"en": "Be careful, the road is slippery", "fr": "Attention, la route est glissante", "niveau": "debutant"}, {"en": "Do you want to take a photo?", "fr": "Voulez-vous prendre une photo ?", "niveau": "debutant"}, {"en": "We will stop here for ten minutes", "fr": "Nous nous arrêtons ici dix minutes", "niveau": "debutant"}, {"en": "Drink water, it is very hot", "fr": "Buvez de l'eau, il fait très chaud", "niveau": "debutant", "wo": "Naan ndox, dafa tàng lool."}, {"en": "The boat leaves at nine from the Dakar pier", "fr": "La chaloupe part à neuf heures de l'embarcadère de Dakar", "niveau": "intermediaire"}, {"en": "The visit lasts about three hours", "fr": "La visite dure environ trois heures", "niveau": "intermediaire"}, {"en": "The House of Slaves is an important memorial", "fr": "La Maison des Esclaves est un mémorial important", "niveau": "intermediaire"}, {"en": "At Lake Retba the water is pink because of the algae", "fr": "Au Lac Rose, l'eau est rose à cause des algues", "niveau": "intermediaire"}, {"en": "Please wear a hat and sun cream", "fr": "Portez un chapeau et mettez de la crème solaire", "niveau": "intermediaire"}, {"en": "The entrance fee is not included", "fr": "Le droit d'entrée n'est pas compris", "niveau": "intermediaire"}, {"en": "Do you want to see the baobab trees or the birds?", "fr": "Voulez-vous voir les baobabs ou les oiseaux ?", "niveau": "intermediaire"}, {"en": "Our two-day tour includes the Saloum Delta, a night in a lodge and all meals.", "fr": "Notre circuit de deux jours comprend le delta du Saloum, une nuit en lodge et tous les repas.", "niveau": "avance"}, {"en": "The price is per person, based on a minimum of four travellers.", "fr": "Le prix est par personne, sur la base d'au moins quatre voyageurs.", "niveau": "avance"}, {"en": "Due to the weather, we have to change the programme. I apologise.", "fr": "À cause du temps, nous devons changer le programme. Je m'en excuse.", "niveau": "avance"}, {"en": "Please keep your valuables with you and respect local customs.", "fr": "Gardez vos objets de valeur sur vous et respectez les coutumes locales.", "niveau": "avance"}, {"en": "May I ask your permission before taking photos of people?", "fr": "Puis-je demander votre accord avant de photographier des gens ?", "niveau": "avance"}, {"en": "We can adapt the tour for families with young children.", "fr": "Nous pouvons adapter le circuit aux familles avec de jeunes enfants.", "niveau": "avance"}, {"en": "Cancellations made less than forty-eight hours before are not refunded.", "fr": "Les annulations à moins de quarante-huit heures ne sont pas remboursées.", "niveau": "avance"}], "dlg": [{"role": "marchand", "wo": "Salaamaleekum, maa ngi di sa guide tey.", "fr": "Bonjour, je suis votre guide aujourd'hui.", "en": "Good morning, I am your guide today."}, {"role": "client", "wo": "Salaamaleekum. Ñaata waxtu la visite bi ?", "fr": "Bonjour. Combien de temps dure la visite ?", "en": "Hello. How long is the visit?"}, {"role": "marchand", "wo": "Ñett waxtu rekk. Dinanu tàmbali ci Gorée.", "fr": "Trois heures environ. Nous commençons par Gorée.", "en": "About three hours. We start with Gorée."}, {"role": "client", "wo": "Ndax prix bi dafa bokk ak chaloupe bi ?", "fr": "Le prix comprend-il la chaloupe ?", "en": "Does the price include the boat?"}, {"role": "marchand", "wo": "Déedéet, chaloupe bi dafa leer ci wàllu bi.", "fr": "Non, la chaloupe est à part.", "en": "No, the boat ticket is separate."}, {"role": "client", "wo": "Baax na. Mën naa jël nataal ?", "fr": "D'accord. Puis-je prendre des photos ?", "en": "All right. Can I take photos?"}, {"role": "marchand", "wo": "Waaw, waaye ci kër gi kese lañu ko tere.", "fr": "Oui, sauf à l'intérieur de la maison.", "en": "Yes, except inside the house."}, {"role": "client", "wo": "Jërëjëf, nanu dem.", "fr": "Merci, allons-y.", "en": "Thank you, let's go."}]}, "tour_transport": {"icon": "🚕", "titre": "Taxi & Transport", "sous": "Taxi, location de voiture, prix de la course.", "fond": "#1A1830", "title": "🚕 Taxi & Transport", "vocab": [{"en": "Where do you want to go?", "fr": "Où voulez-vous aller ?", "niveau": "debutant", "wo": "Fan nga bëgg a dem ?"}, {"en": "Take me to the airport, please", "fr": "Emmenez-moi à l'aéroport, s'il vous plaît", "niveau": "debutant", "wo": "Yóbbu ma ci aeroport bi, bu la neexee."}, {"en": "How much is the ride?", "fr": "Combien coûte la course ?", "niveau": "debutant", "wo": "Ñaata la course bi ?"}, {"en": "It is too expensive", "fr": "C'est trop cher", "niveau": "debutant", "wo": "Dafa cher lool."}, {"en": "Please stop here", "fr": "Arrêtez-vous ici, s'il vous plaît", "niveau": "debutant", "wo": "Taxawal fii, bu la neexee."}, {"en": "Turn left", "fr": "Tournez à gauche", "niveau": "debutant"}, {"en": "Turn right", "fr": "Tournez à droite", "niveau": "debutant"}, {"en": "Please use the meter", "fr": "Utilisez le compteur, s'il vous plaît", "niveau": "intermediaire"}, {"en": "Can you wait for me for one hour?", "fr": "Pouvez-vous m'attendre une heure ?", "niveau": "intermediaire"}, {"en": "How long does it take to get to Saly?", "fr": "Combien de temps faut-il pour aller à Saly ?", "niveau": "intermediaire"}, {"en": "The traffic is heavy at this time", "fr": "Il y a beaucoup d'embouteillages à cette heure", "niveau": "intermediaire"}, {"en": "Could you put the air conditioning on?", "fr": "Pouvez-vous mettre la climatisation ?", "niveau": "intermediaire"}, {"en": "The fare to the city centre is five thousand francs", "fr": "La course jusqu'au centre-ville coûte cinq mille francs", "niveau": "intermediaire"}, {"en": "I need a receipt, please", "fr": "J'ai besoin d'un reçu, s'il vous plaît", "niveau": "intermediaire"}, {"en": "I would like to rent a car with a driver for three days.", "fr": "Je voudrais louer une voiture avec chauffeur pendant trois jours.", "niveau": "avance"}, {"en": "Is fuel included in the daily price?", "fr": "Le carburant est-il compris dans le prix journalier ?", "niveau": "avance"}, {"en": "What is the deposit and is it refundable?", "fr": "Quelle est la caution et est-elle remboursable ?", "niveau": "avance"}, {"en": "We can arrange a shuttle for your group from the hotel to the airport.", "fr": "Nous pouvons organiser une navette pour votre groupe de l'hôtel à l'aéroport.", "niveau": "avance"}, {"en": "I have to report a small accident to the insurance company.", "fr": "Je dois déclarer un petit accident à l'assurance.", "niveau": "avance"}, {"en": "Please check the tyres and the spare wheel before we leave.", "fr": "Vérifiez les pneus et la roue de secours avant de partir.", "niveau": "avance"}, {"en": "For a long trip to Ziguinchor, I recommend leaving very early.", "fr": "Pour un long trajet vers Ziguinchor, je recommande de partir très tôt.", "niveau": "avance"}], "dlg": [{"role": "client", "wo": "Salaamaleekum. Yóbbu ma ci Saly, bu la neexee.", "fr": "Bonjour. Emmenez-moi à Saly, s'il vous plaît.", "en": "Hello. Take me to Saly, please."}, {"role": "marchand", "wo": "Waaw. Ñaata nit ngeen ?", "fr": "Oui. Vous êtes combien ?", "en": "Yes. How many of you are there?"}, {"role": "client", "wo": "Ñaar nit ak ñaari valiis.", "fr": "Deux personnes et deux valises.", "en": "Two people and two suitcases."}, {"role": "marchand", "wo": "Baax na. Fukk ak juróom junni la.", "fr": "D'accord. C'est quinze mille.", "en": "All right. It is fifteen thousand."}, {"role": "client", "wo": "Dafa cher lool. Mën nga ma wàññil ko ?", "fr": "C'est trop cher. Pouvez-vous baisser ?", "en": "That is too expensive. Can you lower it?"}, {"role": "marchand", "wo": "Fukk ak ñaar junni, waay. Loolu mooy sama njëg gu mujj.", "fr": "Douze mille. C'est mon dernier prix.", "en": "Twelve thousand. That is my last price."}, {"role": "client", "wo": "Baax na, nanu dem.", "fr": "D'accord, partons.", "en": "Okay, let's go."}, {"role": "marchand", "wo": "Jàmm rekk, dinanu agsi ci benn waxtu.", "fr": "Pas de souci, nous arrivons dans une heure.", "en": "No problem, we will arrive in one hour."}]}, "tour_artisanat": {"icon": "🎨", "titre": "Artisanat & Souvenirs", "sous": "Marchander, masques, tissus, bijoux.", "fond": "#2A2410", "title": "🎨 Artisanat & Souvenirs", "vocab": [{"en": "Welcome, come and see", "fr": "Bienvenue, venez voir", "niveau": "debutant", "wo": "Dalal ak jàmm, ñëwal gis."}, {"en": "This is handmade", "fr": "C'est fait à la main", "niveau": "debutant", "wo": "Loolu loxo la."}, {"en": "How much is this?", "fr": "Combien coûte ceci ?", "niveau": "debutant", "wo": "Ñaata la lii ?"}, {"en": "This necklace is beautiful", "fr": "Ce collier est très beau", "niveau": "debutant", "wo": "Collier bii rafet na lool."}, {"en": "I will take two", "fr": "J'en prends deux", "niveau": "debutant", "wo": "Dinaa jël ñaar."}, {"en": "Can I pay by card?", "fr": "Puis-je payer par carte ?", "niveau": "debutant"}, {"en": "Do you have a smaller size?", "fr": "Avez-vous plus petit ?", "niveau": "debutant"}, {"en": "This mask is made of wood from the Casamance", "fr": "Ce masque est en bois de Casamance", "niveau": "intermediaire"}, {"en": "The price is fixed, but I can make a small gift", "fr": "Le prix est fixe, mais je peux faire un petit cadeau", "niveau": "intermediaire"}, {"en": "What is the best price you can give me?", "fr": "Quel est votre meilleur prix ?", "niveau": "intermediaire"}, {"en": "Can you wrap it so it does not break in my suitcase?", "fr": "Pouvez-vous l'emballer pour qu'il ne casse pas dans ma valise ?", "niveau": "intermediaire"}, {"en": "Is this leather real?", "fr": "Ce cuir est-il vrai ?", "niveau": "intermediaire"}, {"en": "I am looking for a gift for my mother", "fr": "Je cherche un cadeau pour ma mère", "niveau": "intermediaire"}, {"en": "This cloth is dyed with natural colours", "fr": "Ce tissu est teint avec des couleurs naturelles", "niveau": "intermediaire"}, {"en": "Each piece is unique and signed by the artist.", "fr": "Chaque pièce est unique et signée par l'artiste.", "niveau": "avance"}, {"en": "If you buy three pieces, I can offer a fifteen percent discount.", "fr": "Si vous achetez trois pièces, je peux faire quinze pour cent de remise.", "niveau": "avance"}, {"en": "I can ship it to Europe and give you a customs invoice.", "fr": "Je peux l'expédier en Europe et vous donner une facture pour la douane.", "niveau": "avance"}, {"en": "I am sorry, this item is not for export because it is protected wood.", "fr": "Désolé, cet objet ne peut pas être exporté car c'est un bois protégé.", "niveau": "avance"}, {"en": "Our cooperative supports thirty families in the village.", "fr": "Notre coopérative fait vivre trente familles du village.", "niveau": "avance"}, {"en": "Could you make one for me in a different colour? I can wait three days.", "fr": "Pourriez-vous m'en faire un dans une autre couleur ? Je peux attendre trois jours.", "niveau": "avance"}, {"en": "The price is high because it takes two weeks to weave.", "fr": "Le prix est élevé car il faut deux semaines pour le tisser.", "niveau": "avance"}], "dlg": [{"role": "marchand", "wo": "Dalal ak jàmm, ñëwal gis sunu liggéey.", "fr": "Bienvenue, venez voir mon travail.", "en": "Welcome, come and see my work."}, {"role": "client", "wo": "Masque bii rafet na. Ñaata la ?", "fr": "Ce masque est très beau. Combien ?", "en": "This mask is beautiful. How much is it?"}, {"role": "marchand", "wo": "Fukk ak juróom junni la.", "fr": "Quinze mille francs.", "en": "Fifteen thousand francs."}, {"role": "client", "wo": "Dafa cher. Mën nga ma wàññil ko ?", "fr": "C'est cher. Pouvez-vous baisser ?", "en": "That is expensive. Can you lower it?"}, {"role": "marchand", "wo": "Bu ma jëndee ñaar, dinaa la ko def fukk ak ñaar junni.", "fr": "Si vous en prenez deux, je fais douze mille chacun.", "en": "If you take two, I will do twelve thousand each."}, {"role": "client", "wo": "Baax na. Dinaa jël ñaar.", "fr": "D'accord. Je prends deux.", "en": "Okay. I will take two."}, {"role": "marchand", "wo": "Jërëjëf. Dinaa leen takk bu baax.", "fr": "Merci. Je vais les emballer avec soin.", "en": "Thank you. I will wrap them carefully."}, {"role": "client", "wo": "Jërëjëf lool, rafet na.", "fr": "Merci beaucoup, c'est magnifique.", "en": "Thank you so much, it is wonderful."}]}, "tour_agence": {"icon": "✈️", "titre": "Agence de voyage", "sous": "Billets, visa, réservation, conseils voyageurs.", "fond": "#14203A", "title": "✈️ Agence de voyage", "vocab": [{"en": "How can I help you?", "fr": "Comment puis-je vous aider ?", "niveau": "debutant", "wo": "Naka laa mën a dimbali la ?"}, {"en": "Where do you want to travel?", "fr": "Où voulez-vous voyager ?", "niveau": "debutant", "wo": "Fan nga bëgg a dem ?"}, {"en": "When do you want to leave?", "fr": "Quand voulez-vous partir ?", "niveau": "debutant", "wo": "Kañ nga bëgg a dem ?"}, {"en": "One way or return?", "fr": "Aller simple ou aller-retour ?", "niveau": "debutant"}, {"en": "May I see your passport?", "fr": "Puis-je voir votre passeport ?", "niveau": "debutant", "wo": "Mën naa gis sa paspoor ?"}, {"en": "Your ticket is confirmed", "fr": "Votre billet est confirmé", "niveau": "debutant"}, {"en": "The flight leaves at eight in the morning", "fr": "Le vol part à huit heures du matin", "niveau": "debutant"}, {"en": "Do you want a direct flight or with a stopover?", "fr": "Voulez-vous un vol direct ou avec escale ?", "niveau": "intermediaire"}, {"en": "The price includes a twenty-three kilo bag", "fr": "Le prix comprend un bagage de vingt-trois kilos", "niveau": "intermediaire"}, {"en": "You must arrive at the airport three hours before", "fr": "Vous devez arriver à l'aéroport trois heures avant", "niveau": "intermediaire"}, {"en": "Your passport must be valid for six months", "fr": "Votre passeport doit être valable six mois", "niveau": "intermediaire"}, {"en": "Do you need a visa for this country?", "fr": "Avez-vous besoin d'un visa pour ce pays ?", "niveau": "intermediaire"}, {"en": "I can reserve a hotel for you near the city centre", "fr": "Je peux vous réserver un hôtel près du centre-ville", "niveau": "intermediaire"}, {"en": "Would you like travel insurance?", "fr": "Voulez-vous une assurance voyage ?", "niveau": "intermediaire"}, {"en": "The cheapest fare is non-refundable. A flexible ticket costs more.", "fr": "Le tarif le moins cher n'est pas remboursable. Un billet flexible coûte plus cher.", "niveau": "avance"}, {"en": "To change the date, there is a fee of fifty euros plus the fare difference.", "fr": "Pour changer la date, il y a cinquante euros de frais plus la différence de tarif.", "niveau": "avance"}, {"en": "Your visa application needs a bank statement, a hotel booking and a return ticket.", "fr": "Votre demande de visa nécessite un relevé bancaire, une réservation d'hôtel et un billet retour.", "niveau": "avance"}, {"en": "I will prepare a complete itinerary and send you a quotation today.", "fr": "Je vais préparer un itinéraire complet et vous envoyer un devis aujourd'hui.", "niveau": "avance"}, {"en": "The airline cancelled your flight. We can rebook you or refund you.", "fr": "La compagnie a annulé votre vol. Nous pouvons vous reprogrammer ou vous rembourser.", "niveau": "avance"}, {"en": "For a group of ten, we can negotiate a special rate with the airline.", "fr": "Pour un groupe de dix, nous pouvons négocier un tarif spécial avec la compagnie.", "niveau": "avance"}, {"en": "Please pay a deposit of thirty percent to confirm the booking.", "fr": "Veuillez verser un acompte de trente pour cent pour confirmer la réservation.", "niveau": "avance"}], "dlg": [{"role": "marchand", "wo": "Salaamaleekum. Naka laa mën a dimbali la ?", "fr": "Bonjour. Comment puis-je vous aider ?", "en": "Good morning. How can I help you?"}, {"role": "client", "wo": "Bëgg naa dem Paris ci weer wu ñëw.", "fr": "Je voudrais aller à Paris le mois prochain.", "en": "I would like to fly to Paris next month."}, {"role": "marchand", "wo": "Waaw. Aller simple walla aller-retour ?", "fr": "Très bien. Aller simple ou aller-retour ?", "en": "Very well. One way or return?"}, {"role": "client", "wo": "Aller-retour, bu la neexee. Ñaata la ?", "fr": "Aller-retour, s'il vous plaît. Combien ?", "en": "Return, please. How much is it?"}, {"role": "marchand", "wo": "380.000 francs la.", "fr": "Trois cent quatre-vingt mille francs.", "en": "Three hundred and eighty thousand francs."}, {"role": "client", "wo": "Ndax bagaas bi dafa bokk ?", "fr": "Le bagage est-il compris ?", "en": "Is the luggage included?"}, {"role": "marchand", "wo": "Waaw, benn valiis ci ñaar fukk ak ñett kilo.", "fr": "Oui, une valise de vingt-trois kilos.", "en": "Yes, one suitcase of twenty-three kilos."}, {"role": "client", "wo": "Baax na, dinaa ko jël.", "fr": "D'accord, je le prends.", "en": "All right, I will take it."}]}, "tour_plage": {"icon": "🏖️", "titre": "Plage & Loisirs", "sous": "Saly, pirogue, pêche, surf, hôtels de plage.", "fond": "#10261A", "title": "🏖️ Plage & Loisirs", "vocab": [{"en": "The beach is very beautiful", "fr": "La plage est très belle", "niveau": "debutant", "wo": "Tefes bi rafet na lool."}, {"en": "Is it safe to swim here?", "fr": "Peut-on se baigner ici sans danger ?", "niveau": "debutant"}, {"en": "Do you want a parasol?", "fr": "Voulez-vous un parasol ?", "niveau": "debutant"}, {"en": "The water is warm", "fr": "L'eau est chaude", "niveau": "debutant"}, {"en": "Do not leave your bag alone", "fr": "Ne laissez pas votre sac seul", "niveau": "debutant"}, {"en": "Do you want to go on a boat trip?", "fr": "Voulez-vous faire une sortie en pirogue ?", "niveau": "debutant"}, {"en": "The sunset is wonderful", "fr": "Le coucher de soleil est magnifique", "niveau": "debutant"}, {"en": "Surf lessons start at ten in the morning", "fr": "Les cours de surf commencent à dix heures", "niveau": "intermediaire"}, {"en": "The fishermen come back at five in the afternoon", "fr": "Les pêcheurs rentrent à dix-sept heures", "niveau": "intermediaire"}, {"en": "Beware of strong currents, swim between the flags", "fr": "Attention aux courants forts, baignez-vous entre les drapeaux", "niveau": "intermediaire"}, {"en": "I want to rent a kayak for two hours", "fr": "Je veux louer un kayak pour deux heures", "niveau": "intermediaire"}, {"en": "The boat trip to the mangroves takes ninety minutes", "fr": "La sortie en pirogue vers la mangrove dure quatre-vingt-dix minutes", "niveau": "intermediaire"}, {"en": "Life jackets are provided for everyone", "fr": "Des gilets de sauvetage sont fournis pour tous", "niveau": "intermediaire"}, {"en": "Fresh grilled fish is served on the beach at noon", "fr": "Du poisson grillé frais est servi sur la plage à midi", "niveau": "intermediaire"}, {"en": "Our resort offers a full-board package with water sports and an evening show.", "fr": "Notre hôtel de plage propose une formule pension complète avec sports nautiques et spectacle le soir.", "niveau": "avance"}, {"en": "The sea is rough today, so the boat trip is postponed until tomorrow.", "fr": "La mer est agitée aujourd'hui, la sortie est donc reportée à demain.", "niveau": "avance"}, {"en": "Children under twelve must be accompanied by an adult.", "fr": "Les enfants de moins de douze ans doivent être accompagnés d'un adulte.", "niveau": "avance"}, {"en": "We can organise a beach wedding for eighty guests.", "fr": "Nous pouvons organiser un mariage sur la plage pour quatre-vingts invités.", "niveau": "avance"}, {"en": "Please respect the turtle nests and do not leave plastic on the beach.", "fr": "Respectez les nids de tortues et ne laissez pas de plastique sur la plage.", "niveau": "avance"}, {"en": "The price of the sunset cruise includes drinks and snacks.", "fr": "Le prix de la croisière au coucher du soleil comprend boissons et collations.", "niveau": "avance"}, {"en": "I would like to book a private boat for my family for the whole day.", "fr": "Je voudrais réserver une pirogue privée pour ma famille pour la journée entière.", "niveau": "avance"}], "dlg": [{"role": "client", "wo": "Salaamaleekum, mën naa dem ci pirogue ?", "fr": "Bonjour, peut-on faire une sortie en pirogue ?", "en": "Hello, can we go on a boat trip?"}, {"role": "marchand", "wo": "Waaw, ñaar waxtu la, dinanu dem ci mangrove yi.", "fr": "Oui, deux heures, vers la mangrove.", "en": "Yes, two hours, to the mangroves."}, {"role": "client", "wo": "Ñaata la ci nit ?", "fr": "Combien par personne ?", "en": "How much per person?"}, {"role": "marchand", "wo": "Juróom junni ci nit, gilet de sauvetage dafa bokk.", "fr": "Cinq mille par personne, gilets inclus.", "en": "Five thousand per person, life jackets included."}, {"role": "client", "wo": "Ñetti nit lanu, ak benn xale.", "fr": "Nous sommes trois, avec un enfant.", "en": "There are three of us, with one child."}, {"role": "marchand", "wo": "Baax na, xale bi dina sol gilet bu ndaw.", "fr": "D'accord, l'enfant portera un petit gilet.", "en": "Fine, the child will wear a small life jacket."}, {"role": "client", "wo": "Kañ lanu dem ?", "fr": "On part quand ?", "en": "When do we leave?"}, {"role": "marchand", "wo": "Ci benn waxtu, ci tefes bi.", "fr": "Dans une heure, au bord de l'eau.", "en": "In an hour, at the water's edge."}]}};
  var ORDRE = { debutant: 0, intermediaire: 1, avance: 2 };

  function trier(vocab) {
    return vocab.map(function (v, i) { return [v, i]; }).sort(function (a, b) {
      var d = (ORDRE[a[0].niveau] || 0) - (ORDRE[b[0].niveau] || 0); return d || a[1] - b[1];
    }).map(function (x) { return x[0]; });
  }
  Object.keys(AJOUTS).forEach(function (k) {
    if (!C[k] || !C[k].vocab) return;
    var vus = {}; C[k].vocab.forEach(function (v) { vus[String(v.en).toLowerCase()] = 1; });
    AJOUTS[k].forEach(function (v) { if (!vus[v.en.toLowerCase()]) C[k].vocab.push(v); });
    C[k].vocab = trier(C[k].vocab);
  });
  Object.keys(TOUR).forEach(function (k) {
    var t = TOUR[k];
    S[k] = { icon: t.icon, titre: t.titre, sousTitre: t.sous, fond: t.fond };
    C[k] = { title: t.title, vocab: t.vocab };
    DL[k] = t.dlg;
  });
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-biz-plus.js",e);}

try{
/* ---- diisoo-passage.js ---- */
/* diisoo-passage.js v2 : test de passage, organise en 3 ecrans (Presentation, Questions, Resultat)
   - Toucher Intermediaire : test du niveau Debutant. Reussi (75 %) = Intermediaire ouvert.
   - Toucher Avance : test du niveau Intermediaire. Reussi = Avance ouvert.
     Rate (et Intermediaire pas encore ouvert) = test Debutant pour savoir s'il commence Intermediaire ou Debutant.
   - Une question = un mot entendu (audio) + 3 reponses. 8 questions, 6 bonnes reponses pour reussir.
   - Apres un echec, le meme test se refait apres 24 heures. */
(function () {
  "use strict";

  var NB = 8, SEUIL = 0.7, ATTENTE = 24 * 3600 * 1000;
  var NOMS = ["Débutant", "Intermédiaire", "Avancé"];
  var ICONS = ["🌱", "🌿", "🌳"];
  var KEYF = "diisoo_passage";
  var etat = null, ov = null;
  var TABS = { general: "general-tabs", wolof: "wolof-tabs" };

  /* ---------- outils ---------- */
  function $(id) { return document.getElementById(id); }
  function melanger(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function lire() { try { return JSON.parse(localStorage.getItem(KEYF) || "{}") || {}; } catch (e) { return {}; } }
  function ecrire(o) { try { localStorage.setItem(KEYF, JSON.stringify(o)); } catch (e) {} }
  function aide(cle) { try { return window.DiisooAideWolof.phrases[cle]; } catch (e) { return null; } }
  function direAide(cle) { try { window.DiisooAideWolof.dire(cle); } catch (e) {} }
  function dire(t, lang) {
    try {
      if (lang === "wo" && typeof speakWolofOolel === "function") return speakWolofOolel(t);
      if (typeof speak === "function") return speak(t, "en-US", 0.85);
    } catch (e) {}
  }
  function debloque(key) { try { return tierState()[key].unlocked || 1; } catch (e) { return 1; } }
  function ouvrirNiveau(key, L) {
    try {
      var all = tierState();
      if (L > all[key].unlocked) all[key].unlocked = L;
      if (typeof TIER_GOALS !== "undefined" && all[key].pts < TIER_GOALS[L - 1]) all[key].pts = TIER_GOALS[L - 1];
      store.set(TIER_KEY, all);
    } catch (e) { console.warn("[diisoo] passage", e); }
  }

  /* ---------- questions a partir du vocabulaire du niveau (meme decoupage que les menus) ---------- */
  function themesDuNiveau(key, niveau) {
    var box = $(TABS[key]), data = key === "general" ? GENERAL_THEMES : WOLOF_THEMES, out = [];
    if (key === "business") return out;
    if (box) {
      Array.prototype.forEach.call(box.children, function (b) {
        if (+b.dataset.lvl !== niveau) return;
        var t = b.textContent.trim().replace(/^🔒\s*/, "");
        var th = data.filter(function (x) { return (x.title || x.label || x.name || "") === t; })[0];
        if (th) out.push(th);
      });
    }
    return out;
  }
  function mots(key, niveau) {
    var out = [];
    if (key === "business") {
      try {
        Object.keys(CHINA_TRADE_WOLOF).forEach(function (k) {
          ((CHINA_TRADE_WOLOF[k] || {}).vocab || []).forEach(function (v) {
            if (v.niveau === ["debutant", "intermediaire", "avance"][niveau - 1] && v.en && v.fr) out.push({ q: v.en, a: v.fr, lang: "en" });
          });
        });
      } catch (e) {}
      return out.filter(function (w) { return w.q.length <= 60 && w.a.length <= 70; });
    }
    themesDuNiveau(key, niveau).forEach(function (t) {
      if (key === "general") (t.vocab || []).forEach(function (w) { if (w.en && w.fr) out.push({ q: w.en, a: w.fr, lang: "en" }); });
      else (t.words || []).forEach(function (w) { if (w.wo && w.en) out.push({ q: w.wo, a: w.en, lang: "wo" }); });
    });
    return out.filter(function (w) { return w.q.length <= 45 && w.a.length <= 45; });
  }
  function fabriquer(key, niveau) {
    var pool = mots(key, niveau);
    if (pool.length < 4) return [];
    var tirage = melanger(pool).slice(0, Math.min(NB, pool.length));
    return tirage.map(function (w) {
      var autres = melanger(pool.filter(function (x) { return x.a !== w.a; })).slice(0, 2).map(function (x) { return x.a; });
      return { q: w.q, a: w.a, lang: w.lang, options: melanger([w.a].concat(autres)) };
    });
  }

  /* ---------- interface ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#dii-passage{position:fixed;inset:0;z-index:9999;background:#0B0F1C;color:#F6F1E7;display:flex;flex-direction:column;" +
    "padding:14px 16px 24px;overflow-y:auto;font-family:inherit}" +
    "#dii-passage .ps-top{display:flex;align-items:center;gap:10px}" +
    "#dii-passage .ps-x{width:44px;height:44px;border-radius:50%;background:#141A2B;border:1px solid #1E2740;color:#A69C86;font-size:16px}" +
    "#dii-passage .ps-aide{margin-left:auto;width:44px;height:44px;border-radius:50%;background:#25D366;border:0;color:#fff;font-size:20px}" +
    "#dii-passage .ps-head{text-align:center;font-size:12px;font-weight:700;letter-spacing:.08em;color:#8C8064;text-transform:uppercase;margin:12px 0 2px}" +
    "#dii-passage .ps-titre{text-align:center;font-size:20px;font-weight:800;margin:2px 0 6px}" +
    "#dii-passage .ps-path{display:flex;align-items:center;justify-content:center;gap:0;margin:14px 0}" +
    "#dii-passage .ps-n{display:flex;flex-direction:column;align-items:center;width:84px;font-size:11px;color:#A69C86;font-weight:700}" +
    "#dii-passage .ps-n b{display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:#141A2B;" +
    "border:3px solid #1E2740;font-size:26px;margin-bottom:4px}" +
    "#dii-passage .ps-n.done b{border-color:#25D366;background:#12351F}" +
    "#dii-passage .ps-n.on b{border-color:#F3A94E;background:#3A2A10;box-shadow:0 0 0 4px rgba(243,169,78,.25)}" +
    "#dii-passage .ps-n.lock b{opacity:.55}" +
    "#dii-passage .ps-l{width:26px;height:4px;background:#1E2740;border-radius:3px;margin-bottom:22px}" +
    "#dii-passage .ps-regles{display:flex;flex-direction:column;gap:8px;margin:8px 0 16px}" +
    "#dii-passage .ps-r{display:flex;align-items:center;gap:12px;background:#141A2B;border:1px solid #1E2740;border-radius:14px;padding:10px 14px;font-size:14px}" +
    "#dii-passage .ps-r span{font-size:22px}" +
    "#dii-passage .ps-pts{display:flex;justify-content:center;gap:6px;margin:10px 0 4px}" +
    "#dii-passage .ps-pts i{width:14px;height:14px;border-radius:50%;background:#1E2740}" +
    "#dii-passage .ps-pts i.ok{background:#25D366}#dii-passage .ps-pts i.ko{background:#E5484D}" +
    "#dii-passage .ps-pts i.cur{box-shadow:0 0 0 3px rgba(243,169,78,.6);background:#F3A94E}" +
    "#dii-passage .ps-son{align-self:center;width:84px;height:84px;border-radius:50%;background:#25D366;color:#fff;font-size:36px;border:0;margin:10px 0 12px}" +
    "#dii-passage .ps-mot{text-align:center;font-size:26px;font-weight:800;line-height:1.25;margin:6px 0 16px;word-break:break-word}" +
    "#dii-passage .ps-rep{width:100%;min-height:58px;margin-bottom:10px;padding:10px 14px;border-radius:16px;background:#141A2B;" +
    "border:2px solid #1E2740;color:#F6F1E7;font-size:16px;font-weight:700;text-align:left}" +
    "#dii-passage .ps-rep.ok{background:#12351F;border-color:#25D366}" +
    "#dii-passage .ps-rep.ko{background:#3A1515;border-color:#E5484D}" +
    "#dii-passage .ps-grand{font-size:56px;text-align:center;margin:10px 0 2px}" +
    "#dii-passage .ps-score{text-align:center;font-size:34px;font-weight:900;margin:0}" +
    "#dii-passage .ps-msg{text-align:center;font-size:17px;font-weight:800;margin:6px 0}" +
    "#dii-passage .ps-sub{text-align:center;font-size:13px;color:#A69C86;margin:0 0 14px}" +
    "#dii-passage .ps-btn{width:100%;min-height:56px;margin-bottom:10px;border-radius:999px;border:0;background:#25D366;color:#fff;font-size:16px;font-weight:800}" +
    "#dii-passage .ps-btn.sec{background:#141A2B;border:1px solid #1E2740;color:#C9BFA8}";
  document.head.appendChild(st);

  function fermer() { if (ov) { ov.remove(); ov = null; } etat = null; }
  function montrer(html) {
    if (!ov || !document.body.contains(ov)) { ov = document.createElement("div"); ov.id = "dii-passage"; document.body.appendChild(ov); }
    ov.innerHTML = html;
    ov.scrollTop = 0;
  }
  function retourMenu(key, L) {
    fermer();
    try { window[key === "general" ? "openGeneralModule" : key === "wolof" ? "openWolofModule" : "openBusinessModule"](); } catch (e) {}
    if (L) {
      setTimeout(function () {
        var b = document.querySelectorAll("#lvl-" + key + " .lvl-btn")[L - 1];
        if (b) b.click();
      }, 150);
    }
  }

  /* Chemin Debutant, Intermediaire, Avance : ouvert (vert), test en cours (orange), ferme (cadenas) */
  function chemin(key, cible) {
    var un = debloque(key), h = '<div class="ps-path">';
    for (var L = 1; L <= 3; L++) {
      var cls = L <= un ? "done" : (L === cible ? "on" : "lock");
      var ic = L <= un ? "✅" : (L === cible ? ICONS[L - 1] : "🔒");
      h += '<div class="ps-n ' + cls + '"><b>' + ic + "</b>" + NOMS[L - 1] + "</div>";
      if (L < 3) h += '<div class="ps-l"></div>';
    }
    return h + "</div>";
  }

  function entete(key) {
    return '<div class="ps-top"><button class="ps-x" id="ps-close" aria-label="Fermer">✕</button>' +
      '<button class="ps-aide" id="ps-aide" aria-label="Aide en wolof">🔊</button></div>';
  }
  function brancher(key, boutons) {
    var c = $("ps-close"); if (c) c.onclick = function () { retourMenu(key, 0); };
    var a = $("ps-aide"); if (a) a.onclick = function () { direAide("passage"); };
    Array.prototype.forEach.call(ov.querySelectorAll(".ps-btn"), function (el) {
      el.onclick = function () { boutons[+el.dataset.i].f(); };
    });
  }
  function boutonsHtml(boutons) {
    var h = "";
    boutons.forEach(function (b, i) { h += '<button class="ps-btn ' + (b.sec ? "sec" : "") + '" data-i="' + i + '">' + b.t + "</button>"; });
    return h;
  }

  /* Ecran 1 : presentation */
  function presentation(key, cible, niveau, fallback) {
    var qs = fabriquer(key, niveau);
    if (!qs.length) { ouvrirNiveau(key, cible); retourMenu(key, cible); return; }
    var need = Math.ceil(SEUIL * qs.length);
    etat = { key: key, cible: cible, niveau: niveau, fallback: !!fallback, qs: qs, i: 0, score: 0, verrou: false, hist: [] };
    var boutons = [
      { t: "▶ Commencer", f: function () { question(); } },
      { t: "Plus tard", sec: true, f: function () { retourMenu(key, 0); } }
    ];
    montrer(entete(key) +
      '<div class="ps-head">Test de passage</div>' +
      '<div class="ps-titre">Pour ouvrir ' + ICONS[cible - 1] + " " + NOMS[cible - 1] + "</div>" +
      chemin(key, cible) +
      '<div class="ps-regles">' +
      '<div class="ps-r"><span>🔊</span>Écoute le mot</div>' +
      '<div class="ps-r"><span>👆</span>Touche la bonne réponse</div>' +
      '<div class="ps-r"><span>🎯</span>' + need + " bonnes réponses sur " + qs.length + "</div></div>" +
      boutonsHtml(boutons));
    brancher(key, boutons);
    direAide("passage");
  }

  /* Ecran 2 : questions */
  function points(s) {
    var h = '<div class="ps-pts">';
    for (var k = 0; k < s.qs.length; k++) h += "<i class=\"" + (k < s.hist.length ? (s.hist[k] ? "ok" : "ko") : (k === s.i ? "cur" : "")) + '"></i>';
    return h + "</div>";
  }
  function question() {
    var s = etat, q = s.qs[s.i];
    var h = entete(s.key) +
      '<div class="ps-head">' + ICONS[s.niveau - 1] + " Test " + NOMS[s.niveau - 1] + " : " + (s.i + 1) + " / " + s.qs.length + "</div>" +
      points(s) +
      '<button class="ps-son" id="ps-son" aria-label="Écouter">🔊</button><div class="ps-mot">' + q.q.replace(/</g, "&lt;") + "</div>";
    q.options.forEach(function (o, i) { h += '<button class="ps-rep" data-i="' + i + '">' + o.replace(/</g, "&lt;") + "</button>"; });
    montrer(h);
    brancher(s.key, []);
    $("ps-aide").onclick = function () { dire(q.q, q.lang); };
    $("ps-son").onclick = function () { dire(q.q, q.lang); };
    dire(q.q, q.lang);
    Array.prototype.forEach.call(ov.querySelectorAll(".ps-rep"), function (el) {
      el.onclick = function () {
        if (s.verrou) return;
        s.verrou = true;
        var bon = q.options[+el.dataset.i] === q.a;
        if (bon) s.score++;
        s.hist.push(bon);
        el.classList.add(bon ? "ok" : "ko");
        el.textContent = (bon ? "✅ " : "❌ ") + el.textContent;
        if (!bon) Array.prototype.forEach.call(ov.querySelectorAll(".ps-rep"), function (x, k) { if (q.options[k] === q.a) x.classList.add("ok"); });
        setTimeout(function () {
          s.verrou = false; s.i++;
          if (s.i < s.qs.length) question(); else fin();
        }, bon ? 700 : 1400);
      };
    });
  }

  function cooldown(key, niveau) {
    var f = lire()[key + ":" + niveau];
    if (f && Date.now() - f < ATTENTE) return Math.ceil((ATTENTE - (Date.now() - f)) / 3600000);
    return 0;
  }

  /* Ecran 3 : resultat */
  function resultat(key, cible, emoji, titre, sous, boutons, histo) {
    montrer(entete(key) +
      '<div class="ps-grand">' + emoji + "</div>" + titre + '<div class="ps-sub">' + sous + "</div>" +
      (histo || "") + chemin(key, cible) + boutonsHtml(boutons));
    brancher(key, boutons);
  }

  /* Lance le test du niveau `niveau` pour viser `cible` */
  function lancer(key, cible, niveau, fallback) {
    var h = cooldown(key, niveau);
    if (h > 0) {
      etat = { key: key };
      resultat(key, cible, "⏳", '<div class="ps-msg">Pas tout de suite</div>',
        "Tu pourras refaire ce test dans " + h + " h. Révise d'abord le niveau " + NOMS[niveau - 1] + ".",
        [{ t: ICONS[niveau - 1] + " Réviser " + NOMS[niveau - 1], f: function () { retourMenu(key, niveau); } }]);
      direAide("retour");
      return;
    }
    presentation(key, cible, niveau, fallback);
  }

  function fin() {
    var s = etat, pct = s.score / s.qs.length, ok = pct >= SEUIL;
    var note = s.score + " / " + s.qs.length, histo = points({ qs: s.qs, hist: s.hist, i: -1 });
    var key = s.key, cible = s.cible;
    var scoreHtml = '<p class="ps-score">' + note + "</p>";
    if (ok) {
      ouvrirNiveau(key, cible);
      resultat(key, cible, "🎉", scoreHtml + '<div class="ps-msg">Baax na ! Niveau débloqué</div>',
        ICONS[cible - 1] + " " + NOMS[cible - 1] + " est ouvert.",
        [{ t: ICONS[cible - 1] + " Commencer " + NOMS[cible - 1], f: function () { retourMenu(key, cible); } }], histo);
      direAide("bravo");
      return;
    }
    var f = lire(); f[key + ":" + s.niveau] = Date.now(); ecrire(f);
    var deja = debloque(key);
    direAide("encore");
    if (!s.fallback && cible === 3 && deja < 2) {
      resultat(key, cible, "🤔", scoreHtml + '<div class="ps-msg">Pas encore</div>',
        "On vérifie si tu peux commencer au niveau Intermédiaire.",
        [{ t: "🌱 Test Débutant", f: function () { lancer(key, 2, 1, true); } },
         { t: "Rester Débutant", sec: true, f: function () { retourMenu(key, 1); } }], histo);
      return;
    }
    if (s.fallback) {
      resultat(key, 2, "🌱", scoreHtml + '<div class="ps-msg">Tu commences Débutant</div>',
        "Tu pourras refaire le test demain.",
        [{ t: "🌱 Commencer Débutant", f: function () { retourMenu(key, 1); } }], histo);
      return;
    }
    var reste = Math.max(1, deja);
    resultat(key, cible, "💪", scoreHtml + '<div class="ps-msg">Pas encore</div>',
      "Il faut " + Math.ceil(SEUIL * s.qs.length) + " bonnes réponses sur " + s.qs.length + ". Tu peux refaire le test demain.",
      [{ t: ICONS[reste - 1] + " Réviser " + NOMS[reste - 1], f: function () { retourMenu(key, reste); } }], histo);
  }

  /* ---------- declenchement : toucher un niveau verrouille ---------- */
  window.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest(".lvl-btn.lock");
    if (!b || ev.target.closest(".aide-ic")) return;
    var box = b.parentNode, key = /lvl-(general|wolof|business)/.exec(box.id || "");
    if (!key) return;
    ev.stopImmediatePropagation(); ev.preventDefault();
    var idx = Array.prototype.indexOf.call(box.querySelectorAll(".lvl-btn"), b) + 1;
    lancer(key[1], idx, idx - 1, false);
  }, true);

  window.DiisooPassage = { version: 2, _etat: function () { return etat; } };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-passage.js",e);}

try{
/* ---- diisoo-stable.js ---- */
/* diisoo-stable.js v1 : stabilite
   1. L'ecran ne s'eteint pas pendant un exercice (Wake Lock)
   2. L'app revient a l'endroit ou tu etais apres un rechargement ou si le telephone a ferme l'onglet
   3. Dans les dialogues, l'ecran suit la phrase qui est lue (defilement + surlignage)
   4. Micro plus tolerant : contractions, chiffres, hesitations, 5 propositions du moteur vocal */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function visible(id) { var e = $(id); return !!(e && e.offsetParent !== null); }

  /* ---------- 1. Ecran toujours allume ---------- */
  var verrou = null, veut = false;
  function demander() {
    if (!veut || verrou || document.hidden) return;
    try {
      if (navigator.wakeLock && navigator.wakeLock.request) {
        navigator.wakeLock.request("screen").then(function (l) {
          verrou = l;
          l.addEventListener("release", function () { verrou = null; });
        }).catch(function () {});
      }
    } catch (e) {}
  }
  function liberer() { try { if (verrou) verrou.release(); } catch (e) {} verrou = null; }
  function ecranActif() {
    var s = document.querySelectorAll("[id^='screen-']"), id = null;
    for (var i = 0; i < s.length; i++) { if (!s[i].classList.contains("hidden")) { id = s[i].id; break; } }
    return id;
  }
  setInterval(function () {
    var id = ecranActif();
    veut = !!id && id !== "screen-dashboard" && id !== "screen-login" && id !== "screen-register";
    if (veut) demander(); else liberer();
  }, 1500);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) { verrou = null; demander(); } });

  /* ---------- 2. Reprise la ou on s'etait arrete ---------- */
  var CLE = "diisoo_pos", DUREE = 30 * 60 * 1000;
  var OUVRIR = {
    "screen-general": ["openGeneralModule", "general"],
    "screen-wolof": ["openWolofModule", "wolof"],
    "screen-business": ["openBusinessModule", "business"],
    "screen-test-simulation": ["startTestSimulation", null]
  };
  function niveauActuel(key) {
    try {
      if (key === "business") return window.DiisooBiz.niveau();
      return window.DiisooOrga.niveau(key);
    } catch (e) { return null; }
  }
  var restaure = false;
  function sauver() {
    if (!restaure) return;
    var id = ecranActif();
    try {
      if (!id || !OUVRIR[id]) { localStorage.removeItem(CLE); return; }
      localStorage.setItem(CLE, JSON.stringify({ s: id, l: niveauActuel(OUVRIR[id][1]), t: Date.now() }));
    } catch (e) {}
  }
  function reprendre() {
    var p = null;
    try { p = JSON.parse(localStorage.getItem(CLE) || "null"); } catch (e) {}
    restaure = true;
    if (!p || !OUVRIR[p.s] || Date.now() - p.t > DUREE) return;
    if (ecranActif() !== "screen-dashboard") return;
    var fn = window[OUVRIR[p.s][0]];
    if (typeof fn !== "function") return;
    try { fn(); } catch (e) { return; }
    if (p.l) {
      setTimeout(function () {
        var b = document.querySelectorAll("#lvl-" + OUVRIR[p.s][1] + " .lvl-btn")[p.l - 1];
        if (b && !b.classList.contains("lock")) b.click();
      }, 400);
    }
  }
  setInterval(sauver, 1000);
  document.addEventListener("visibilitychange", function () { if (document.hidden) sauver(); });
  window.addEventListener("pagehide", sauver);
  /* On attend que l'ecran d'accueil soit pret, puis on reprend (une seule fois) */
  var essais = 0, tReprise = setInterval(function () {
    essais++;
    if (visible("screen-dashboard")) { clearInterval(tReprise); setTimeout(reprendre, 300); }
    else if (essais > 40) { clearInterval(tReprise); restaure = true; }
  }, 250);

  /* ---------- 3. L'ecran suit le dialogue ---------- */
  var st = document.createElement("style");
  st.textContent = ".dii-suit{background:rgba(225,105,63,.22)!important;outline:2px solid #E1693F;border-radius:10px;transition:background .2s}";
  document.head.appendChild(st);
  var dernier = null;
  function suivre(texte) {
    try {
      var t = String(texte || "").trim();
      if (t.length < 2) return;
      var cands = document.querySelectorAll("[id^='bdl-'], .dlg-bulle, [data-dlg-line], .dlg-ligne");
      var trouve = null;
      for (var i = 0; i < cands.length; i++) {
        if (cands[i].textContent.indexOf(t) > -1 && cands[i].offsetParent !== null) { trouve = cands[i]; break; }
      }
      if (dernier) dernier.classList.remove("dii-suit");
      if (!trouve) { dernier = null; return; }
      dernier = trouve;
      trouve.classList.add("dii-suit");
      trouve.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {}
  }
  function finSuivi() { if (dernier) { dernier.classList.remove("dii-suit"); dernier = null; } }
  var seqOrig = window.playSequence;
  if (typeof seqOrig === "function") {
    window.playSequence = function (items) {
      var liste = (items || []).map(function (it) {
        var o = Object.assign({}, it), f = it.onStart;
        o.onStart = function () { suivre(it.text); if (typeof f === "function") f(); };
        return o;
      });
      var r = seqOrig.call(this, liste);
      try { Promise.resolve(r).then(finSuivi, finSuivi); } catch (e) {}
      return r;
    };
  }

  /* ---------- 4. Micro plus tolerant ---------- */
  var CONTR = [
    [/\bi'm\b/g, "i am"], [/\byou're\b/g, "you are"], [/\bwe're\b/g, "we are"], [/\bthey're\b/g, "they are"],
    [/\bhe's\b/g, "he is"], [/\bshe's\b/g, "she is"], [/\bit's\b/g, "it is"], [/\bthat's\b/g, "that is"],
    [/\bwhat's\b/g, "what is"], [/\bwhere's\b/g, "where is"], [/\bhow's\b/g, "how is"], [/\bthere's\b/g, "there is"],
    [/\bi've\b/g, "i have"], [/\bwe've\b/g, "we have"], [/\byou've\b/g, "you have"], [/\bi'll\b/g, "i will"],
    [/\byou'll\b/g, "you will"], [/\bwe'll\b/g, "we will"], [/\bi'd\b/g, "i would"], [/\blet's\b/g, "let us"],
    [/\bdon't\b/g, "do not"], [/\bdoesn't\b/g, "does not"], [/\bdidn't\b/g, "did not"], [/\bcan't\b/g, "can not"],
    [/\bcannot\b/g, "can not"], [/\bwon't\b/g, "will not"], [/\bisn't\b/g, "is not"], [/\baren't\b/g, "are not"],
    [/\bwasn't\b/g, "was not"], [/\bcouldn't\b/g, "could not"], [/\bshouldn't\b/g, "should not"], [/\bwouldn't\b/g, "would not"],
    [/\bgonna\b/g, "going to"], [/\bwanna\b/g, "want to"], [/\bgotta\b/g, "got to"]
  ];
  var NB = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
    "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
  var origNorm = window.normalize;
  if (typeof origNorm === "function") {
    window.normalize = function (s) {
      var t = String(s == null ? "" : s).toLowerCase().replace(/[‘’ʼ`]/g, "'");
      CONTR.forEach(function (c) { t = t.replace(c[0], c[1]); });
      t = t.replace(/\b(\d{1,2})\b/g, function (m, n) { n = +n; return n <= 20 ? NB[n] : m; });
      t = t.replace(/\b(uh|um|umm|uhm|erm|er|hmm|ah|oh)\b/g, " ");
      t = t.replace(/\b(ok|okay)\b/g, "okay");
      return origNorm(t);
    };
  }

  /* 5 propositions du moteur vocal au lieu d'une : la meilleure par rapport a la phrase attendue est gardee */
  try {
    var SRc = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SRc && SRc.prototype) {
      var P = SRc.prototype;
      var dm = Object.getOwnPropertyDescriptor(P, "maxAlternatives");
      if (dm && dm.set) {
        Object.defineProperty(P, "maxAlternatives", {
          configurable: true, enumerable: dm.enumerable,
          get: dm.get, set: function () { dm.set.call(this, 5); }
        });
      }
      var dr = Object.getOwnPropertyDescriptor(P, "onresult");
      if (dr && dr.set) {
        Object.defineProperty(P, "onresult", {
          configurable: true, enumerable: dr.enumerable,
          get: dr.get,
          set: function (fn) {
            if (typeof fn !== "function") { dr.set.call(this, fn); return; }
            dr.set.call(this, function (e) {
              var ev = e;
              try { ev = choisirMeilleur(e); } catch (x) { ev = e; }
              return fn.call(this, ev);
            });
          }
        });
      }
    }
  } catch (e) {}

  /* Phrase attendue : lue sur le bouton micro touche en dernier */
  var cible = "";
  function lireCible(btn) {
    try {
      var d = (btn.dataset.practice || "").split(":");
      if (d[0] === "biz" && window.CHINA_TRADE_WOLOF) return CHINA_TRADE_WOLOF[d[1]].vocab[+d[2]].en;
      var carte = btn.closest(".fx-em, .bg-\\[\\#141A2B\\], .dlg-bulle, div");
      var p = carte && carte.querySelector("p");
      return p ? p.textContent : "";
    } catch (e) { return ""; }
  }
  document.addEventListener("pointerdown", function (ev) {
    var b = ev.target.closest && ev.target.closest("[data-practice]");
    cible = b && !/^(biz-|.*-en|.*-wo)/.test(b.dataset.practice || "") ? lireCible(b) : "";
  }, true);

  function score(a, b) {
    a = window.normalize(a); b = window.normalize(b);
    if (!a || !b) return 0;
    var A = a.split(" "), B = b.split(" "), ok = 0;
    B.forEach(function (w) { if (A.indexOf(w) > -1) ok++; });
    return ok / B.length;
  }
  /* Renvoie un evenement equivalent ou la meilleure proposition est en position 0 */
  function choisirMeilleur(e) {
    if (!cible || !e.results) return e;
    var res = [];
    for (var i = 0; i < e.results.length; i++) {
      var r = e.results[i], best = 0, bs = -1;
      for (var k = 0; k < r.length; k++) {
        var sc = score(r[k].transcript, cible);
        if (sc > bs) { bs = sc; best = k; }
      }
      var x = [r[best]];
      x.isFinal = r.isFinal;
      res.push(x);
    }
    return { resultIndex: e.resultIndex, results: res, type: e.type };
  }

  window.DiisooStable = { version: 1, reprendre: reprendre };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-stable.js",e);}

try{
/* ---- diisoo-tourisme.js ---- */
/* diisoo-tourisme.js v1 : le tourisme au coeur de Diisoo
   12 themes de situations reelles (accueil, taxi, restaurant, Goree, monuments, artisanat, excursions, plage,
   vendre un circuit, urgences, agence de voyage, culture). Chaque theme : 8 mots, un dialogue, 3 questions.
   Marques par le pictogramme 🏝️ et classes en N1 / N2 / N3 comme les autres themes.
   Wolof : premiere version a faire valider par un locuteur natif. */
(function () {
  "use strict";
  if (window.__diisooTourisme) return;
  var G;
  try { G = typeof GENERAL_THEMES !== "undefined" ? GENERAL_THEMES : null; } catch (e) { G = null; }
  if (!G || !G.push) return;
  window.__diisooTourisme = true;

  function V(a) { return a.map(function (x) { return { en: x[0], fr: x[1], wo: x[2] }; }); }
  function D(a) { return a.map(function (x) { return { who: x[0], en: x[1], fr: x[2], wo: x[3] }; }); }
  function Q(a) { return a.map(function (x) { return { q: x[0], o: x[1], a: 0, why: x[2] }; }); }

  var T = [
    /* ---------------- N1 ---------------- */
    { id: "tour-accueil", niv: 1, title: "Accueillir un touriste",
      vocab: V([
        ["Welcome to Senegal", "Bienvenue au Sénégal", "Dalal ak jàmm ci Senegaal"],
        ["Hello, how are you?", "Bonjour, comment allez-vous ?", "Salaamaleekum, naka nga def ?"],
        ["My name is Awa", "Je m'appelle Awa", "Maa ngi tudd Awa"],
        ["Where are you from?", "D'où venez-vous ?", "Fan nga jóge ?"],
        ["I am from France", "Je viens de France", "Maa ngi jóge Faraas"],
        ["Nice to meet you", "Enchanté", "Neex na ma xam la"],
        ["Is it your first visit?", "C'est votre première visite ?", "Ndax yoon wu jëkk la ?"],
        ["Enjoy your stay", "Bon séjour", "Jàmm ak jàmm ci sa fanaan"]
      ]),
      dialogue: D([
        ["A", "Welcome to Senegal. How are you?", "Bienvenue au Sénégal. Comment allez-vous ?", "Dalal ak jàmm ci Senegaal. Naka nga def ?"],
        ["B", "I am fine, thank you. My name is Anna.", "Je vais bien, merci. Je m'appelle Anna.", "Maa ngi fi, jërëjëf. Maa ngi tudd Anna."],
        ["A", "Nice to meet you, Anna. Where are you from?", "Enchanté, Anna. D'où venez-vous ?", "Neex na ma xam la, Anna. Fan nga jóge ?"],
        ["B", "I am from Germany. It is my first visit.", "Je viens d'Allemagne. C'est ma première visite.", "Maa ngi jóge Almaañ. Yoon wu jëkk la."],
        ["A", "Very good. I will show you the city.", "Très bien. Je vais vous montrer la ville.", "Baax na. Dinaa la won dëkk bi."],
        ["B", "Thank you, you are very kind.", "Merci, vous êtes très gentil.", "Jërëjëf, jàmm nga ci lool."]
      ]),
      quiz: Q([
        ["___ to Senegal!", ["Welcome", "Welcomed", "Well come"], "« Welcome to » = bienvenue à."],
        ["Where are you ___?", ["from", "of", "at"], "« Where are you from? » = d'où venez-vous ?"],
        ["Nice to ___ you.", ["meet", "met", "meeting"], "Après « to », le verbe reste à l'infinitif."]
      ]) },

    { id: "tour-taxi", niv: 1, title: "Taxi et transport",
      vocab: V([
        ["Taxi", "Taxi", "Taksi bi"],
        ["Airport", "Aéroport", "Ayeropoor bi"],
        ["Hotel", "Hôtel", "Otel bi"],
        ["Where do you want to go?", "Où voulez-vous aller ?", "Fan nga bëgg a dem ?"],
        ["Take me to the hotel", "Emmenez-moi à l'hôtel", "Yóbbu ma ci otel bi"],
        ["How much is the ride?", "Combien coûte la course ?", "Ñaata la yoon wi ?"],
        ["Please stop here", "Arrêtez-vous ici, s'il vous plaît", "Taxawal fii, baal ma"],
        ["Keep the change", "Gardez la monnaie", "Bàyyil ko ñaanu"]
      ]),
      dialogue: D([
        ["A", "Hello. Where do you want to go?", "Bonjour. Où voulez-vous aller ?", "Salaamaleekum. Fan nga bëgg a dem ?"],
        ["B", "Take me to the Hotel Teranga, please.", "Emmenez-moi à l'hôtel Teranga, s'il vous plaît.", "Yóbbu ma ci otel Teranga, baal ma."],
        ["B", "How much is the ride?", "Combien coûte la course ?", "Ñaata la yoon wi ?"],
        ["A", "Five thousand francs.", "Cinq mille francs.", "Juróom junni franc."],
        ["B", "That is a bit expensive. Can you do four thousand?", "C'est un peu cher. Pouvez-vous faire quatre mille ?", "Dafa seer tuuti. Mën nga def ñaar junni ak ñaar ?"],
        ["A", "Okay, four thousand. Let us go.", "D'accord, quatre mille. Allons-y.", "Baax na, ñeent junni. Ñu dem."]
      ]),
      quiz: Q([
        ["Take me ___ the hotel.", ["to", "at", "in"], "« take me to » = emmenez-moi à."],
        ["How ___ is the ride?", ["much", "many", "long-much"], "Le prix : « how much »."],
        ["Please ___ here.", ["stop", "stops", "stopping"], "Impératif poli : « please stop here »."]
      ]) },

    { id: "tour-resto", niv: 1, title: "Au restaurant",
      vocab: V([
        ["Menu", "Carte", "Menu bi"],
        ["Water", "Eau", "Ndox mi"],
        ["Rice and fish", "Riz et poisson", "Ceebu jën"],
        ["I would like chicken", "Je voudrais du poulet", "Bëgg naa ganaar"],
        ["Is it spicy?", "Est-ce pimenté ?", "Ndax dafa xonq ?"],
        ["No pepper, please", "Sans piment, s'il vous plaît", "Amul sàkka, baal ma"],
        ["The bill, please", "L'addition, s'il vous plaît", "Faktiir bi, baal ma"],
        ["It was delicious", "C'était délicieux", "Neex na lool"]
      ]),
      dialogue: D([
        ["A", "Good evening. Here is the menu.", "Bonsoir. Voici la carte.", "Bonsoir. Nii mooy menu bi."],
        ["B", "Thank you. What is the dish of the day?", "Merci. Quel est le plat du jour ?", "Jërëjëf. Lan mooy añu bi tey ?"],
        ["A", "It is thieboudienne, rice with fish.", "C'est le thieboudienne, du riz au poisson.", "Ceebu jën la."],
        ["B", "Is it spicy? I do not like pepper.", "Est-ce pimenté ? Je n'aime pas le piment.", "Ndax dafa xonq ? Bëgguma sàkka."],
        ["A", "No problem, I will ask the cook.", "Pas de souci, je demande au cuisinier.", "Amul solo, dinaa ko wax kuisinie bi."],
        ["B", "Perfect. And a bottle of water, please.", "Parfait. Et une bouteille d'eau, s'il vous plaît.", "Baax na. Ak benn butel ndox, baal ma."]
      ]),
      quiz: Q([
        ["I ___ like chicken.", ["would", "will", "am"], "« I would like » = je voudrais (poli)."],
        ["The ___, please.", ["bill", "bell", "bull"], "« the bill » = l'addition."],
        ["Is it ___?", ["spicy", "spice", "spicing"], "Adjectif après « is it » : spicy."]
      ]) },

    /* ---------------- N2 ---------------- */
    { id: "tour-goree", niv: 2, title: "Visiter l'île de Gorée",
      vocab: V([
        ["Island", "Île", "Dun gi"],
        ["Ferry", "Bateau", "Pirogue bu mag bi"],
        ["Ticket", "Billet", "Tikke bi"],
        ["History", "Histoire", "Taarix bi"],
        ["The House of Slaves", "La Maison des Esclaves", "Kër gu jaam yi"],
        ["The ferry leaves at ten o'clock", "Le bateau part à dix heures", "Bato bi dina dem ci fukk i waxtu"],
        ["How long is the crossing?", "Combien dure la traversée ?", "Ñaata la yoon wi di yagg ?"],
        ["Can I take photos here?", "Puis-je prendre des photos ici ?", "Mën naa foto fii ?"]
      ]),
      dialogue: D([
        ["A", "Good morning. Two tickets for Gorée, please.", "Bonjour. Deux billets pour Gorée, s'il vous plaît.", "Salaamaleekum. Ñaari tikke ngir Beer, baal ma."],
        ["B", "Here you are. The ferry leaves at ten o'clock.", "Voilà. Le bateau part à dix heures.", "Nii la. Bato bi dina dem ci fukk i waxtu."],
        ["A", "How long is the crossing?", "Combien dure la traversée ?", "Ñaata la yoon wi di yagg ?"],
        ["B", "About twenty minutes.", "Environ vingt minutes.", "Ni ñaar fukk i miniit."],
        ["A", "Can I take photos in the House of Slaves?", "Puis-je prendre des photos dans la Maison des Esclaves ?", "Mën naa foto ci kër gu jaam yi ?"],
        ["B", "Yes, but please be respectful. It is a place of memory.", "Oui, mais soyez respectueux. C'est un lieu de mémoire.", "Waaw, waaye teral fi. Barab la bu ñuy fàttali."]
      ]),
      quiz: Q([
        ["The ferry ___ at ten o'clock.", ["leaves", "leave", "leaving"], "Sujet singulier : leaves."],
        ["How ___ is the crossing?", ["long", "far", "many"], "La durée : « how long »."],
        ["Can I ___ photos here?", ["take", "taking", "took"], "Après « can » : verbe de base."]
      ]) },

    { id: "tour-monuments", niv: 2, title: "Monuments et lieux célèbres",
      vocab: V([
        ["The African Renaissance Monument", "Le Monument de la Renaissance africaine", "Mónumaa Mucc-Afrig bi"],
        ["The Pink Lake", "Le Lac Rose", "Lac Rose bi"],
        ["The museum", "Le musée", "Musée bi"],
        ["The cathedral", "La cathédrale", "Katedraal bi"],
        ["It is open every day", "C'est ouvert tous les jours", "Dafa ubbeeku bés bu nekk"],
        ["How much is the entrance fee?", "Combien coûte l'entrée ?", "Ñaata la dugg bi ?"],
        ["Is there a guide?", "Y a-t-il un guide ?", "Ndax am na ab gid ?"],
        ["It is very beautiful", "C'est très beau", "Dafa rafet lool"]
      ]),
      dialogue: D([
        ["A", "Is the museum open today?", "Le musée est-il ouvert aujourd'hui ?", "Ndax musée bi dafa ubbeeku tey ?"],
        ["B", "Yes, from nine to five.", "Oui, de neuf heures à dix-sept heures.", "Waaw, ci juróom-ñaar waxtu ba ci juróom i waxtu."],
        ["A", "How much is the entrance fee?", "Combien coûte l'entrée ?", "Ñaata la dugg bi ?"],
        ["B", "Two thousand francs for adults.", "Deux mille francs pour les adultes.", "Ñaar junni franc ngir ñi mag."],
        ["A", "Is there a guide who speaks English?", "Y a-t-il un guide qui parle anglais ?", "Ndax am na gid bu wax Àngale ?"],
        ["B", "Yes, he will meet you at the door.", "Oui, il vous attendra à la porte.", "Waaw, dina la xaar ci bunt bi."]
      ]),
      quiz: Q([
        ["The museum is open ___ day.", ["every", "all", "each of"], "« every day » = tous les jours."],
        ["How much is the ___ fee?", ["entrance", "enter", "entering"], "« entrance fee » = prix d'entrée."],
        ["Is there a guide who ___ English?", ["speaks", "speak", "speaking"], "Sujet singulier (who = a guide) : speaks."]
      ]) },

    { id: "tour-artisanat", niv: 2, title: "Artisanat et marchandage",
      vocab: V([
        ["Souvenir", "Souvenir", "Fàttaliku"],
        ["Mask", "Masque", "Maske bi"],
        ["Fabric", "Tissu", "Almba bi"],
        ["Handmade", "Fait main", "Ñaw ci loxo"],
        ["How much is this?", "C'est combien ?", "Ñaata la bii ?"],
        ["That is too expensive", "C'est trop cher", "Dafa seer lool"],
        ["Can you lower the price?", "Pouvez-vous baisser le prix ?", "Mën nga wàññi njëg gi ?"],
        ["I will take it", "Je le prends", "Dinaa ko jënd"]
      ]),
      dialogue: D([
        ["A", "Welcome. Look, it is handmade.", "Bienvenue. Regardez, c'est fait main.", "Dalal ak jàmm. Xoolal, ñaw ci loxo la."],
        ["B", "It is beautiful. How much is this mask?", "C'est beau. Combien coûte ce masque ?", "Dafa rafet. Ñaata la maske bii ?"],
        ["A", "Twenty thousand francs.", "Vingt mille francs.", "Ñaar fukk junni franc."],
        ["B", "That is too expensive. Can you lower the price?", "C'est trop cher. Pouvez-vous baisser le prix ?", "Dafa seer lool. Mën nga wàññi njëg gi ?"],
        ["A", "For you, fifteen thousand.", "Pour vous, quinze mille.", "Ngir yow, fukk ak juróom junni."],
        ["B", "Twelve thousand and I will take it.", "Douze mille et je le prends.", "Fukk ak ñaar junni te dinaa ko jënd."]
      ]),
      quiz: Q([
        ["That is ___ expensive.", ["too", "to", "two"], "« too expensive » = trop cher."],
        ["Can you ___ the price?", ["lower", "lowering", "lowered"], "Après « can » : verbe de base."],
        ["I will ___ it.", ["take", "took", "taking"], "« I will take it » = je le prends."]
      ]) },

    { id: "tour-excursion", niv: 2, title: "Excursions et safari",
      vocab: V([
        ["Tour", "Circuit, visite", "Tuur bi"],
        ["Guide", "Guide", "Gid bi"],
        ["Animals", "Animaux", "Mala yi"],
        ["Bird", "Oiseau", "Picc mi"],
        ["The Saloum Delta", "Le delta du Saloum", "Saloum bi"],
        ["What time does the tour start?", "À quelle heure commence la visite ?", "Ban waxtu la tuur bi di tambali ?"],
        ["Bring water and a hat", "Apportez de l'eau et un chapeau", "Indil ndox ak mbaxanaas"],
        ["We will see lions and giraffes", "Nous verrons des lions et des girafes", "Dinanu gis gaynde ak jiraaf"]
      ]),
      dialogue: D([
        ["A", "I would like to book a tour of the Bandia reserve.", "Je voudrais réserver une visite de la réserve de Bandia.", "Bëgg naa jàppe tuur ci rezerw Bandia."],
        ["B", "Of course. What time do you want to start?", "Bien sûr. À quelle heure voulez-vous commencer ?", "Waaw. Ban waxtu nga bëgg a tambali ?"],
        ["A", "At nine o'clock. How long is the tour?", "À neuf heures. Combien de temps dure la visite ?", "Ci juróom-ñett i waxtu. Ñaata la tuur bi di yagg ?"],
        ["B", "Three hours. You will see giraffes and rhinos.", "Trois heures. Vous verrez des girafes et des rhinocéros.", "Ñetti waxtu. Dinga gis jiraaf ak rinoseros."],
        ["A", "What should I bring?", "Que dois-je apporter ?", "Lan laa war a indi ?"],
        ["B", "Water, a hat and sun cream.", "De l'eau, un chapeau et de la crème solaire.", "Ndox, mbaxanaas ak krem bu jant."]
      ]),
      quiz: Q([
        ["What time ___ the tour start?", ["does", "do", "is"], "Question au présent : « does » avec the tour."],
        ["We will ___ lions.", ["see", "saw", "seeing"], "« will » + verbe de base."],
        ["Bring water ___ a hat.", ["and", "or", "but"], "« and » = et."]
      ]) },

    { id: "tour-plage", niv: 2, title: "Plage et activités",
      vocab: V([
        ["Beach", "Plage", "Tefes gi"],
        ["Sea", "Mer", "Géej gi"],
        ["Sun cream", "Crème solaire", "Krem bu jant"],
        ["Surfboard", "Planche de surf", "Planch surf"],
        ["Is it safe to swim here?", "Peut-on nager ici sans danger ?", "Ndax mën nañu bëre fii ci jàmm ?"],
        ["The water is warm", "L'eau est chaude", "Ndox mi dafa tàng"],
        ["I want to rent a boat", "Je veux louer une pirogue", "Bëgg naa fey pirog"],
        ["What a beautiful sunset", "Quel beau coucher de soleil", "Jant bi dafa rafet"]
      ]),
      dialogue: D([
        ["A", "Excuse me, is it safe to swim here?", "Excusez-moi, peut-on nager ici sans danger ?", "Baal ma, ndax mën nañu bëre fii ci jàmm ?"],
        ["B", "Yes, but stay near the flags.", "Oui, mais restez près des drapeaux.", "Waaw, waaye nekkal ci wetu drapo yi."],
        ["A", "Can I rent a surfboard?", "Puis-je louer une planche de surf ?", "Mën naa fey planch surf ?"],
        ["B", "Yes, ten thousand francs for two hours.", "Oui, dix mille francs pour deux heures.", "Waaw, fukk junni franc ngir ñaari waxtu."],
        ["A", "Thank you. The water is warm today.", "Merci. L'eau est chaude aujourd'hui.", "Jërëjëf. Ndox mi dafa tàng tey."],
        ["B", "Enjoy the sunset at the end of the day.", "Profitez du coucher de soleil en fin de journée.", "Bégal ak jant bi ci ngoon."]
      ]),
      quiz: Q([
        ["Is it ___ to swim here?", ["safe", "save", "sure"], "« safe » = sans danger."],
        ["I want to ___ a boat.", ["rent", "rents", "renting"], "« want to » + verbe de base."],
        ["The water ___ warm.", ["is", "are", "be"], "Sujet singulier : is."]
      ]) },

    /* ---------------- N3 ---------------- */
    { id: "tour-circuit", niv: 3, title: "Vendre un circuit touristique",
      vocab: V([
        ["Itinerary", "Itinéraire", "Yoon wi"],
        ["Package", "Forfait", "Pak bi"],
        ["All inclusive", "Tout compris", "Lépp ci biir"],
        ["Group discount", "Réduction de groupe", "Wàññi njëg ngir mbooloo"],
        ["Our tours include transport, meals and a guide", "Nos circuits comprennent le transport, les repas et un guide", "Sunu tuur yi am nañu yoon, añ ak gid"],
        ["We can adapt the program to your needs", "Nous pouvons adapter le programme à vos besoins", "Mën nanu soppi porogaram bi ci li ngeen soxla"],
        ["A deposit of thirty percent is required", "Un acompte de trente pour cent est demandé", "Ñu di laaj fanweer ci téeméer ci ndoorte"],
        ["The price is per person", "Le prix est par personne", "Njëg gi ci nit la"]
      ]),
      dialogue: D([
        ["A", "We would like a five-day tour of Senegal.", "Nous voudrions un circuit de cinq jours au Sénégal.", "Bëgg nanu ab tuur ci juróom fan ci Senegaal."],
        ["B", "Certainly. We offer a package with Dakar, Gorée, Saly and the Saloum Delta.", "Bien sûr. Nous proposons un forfait avec Dakar, Gorée, Saly et le delta du Saloum.", "Waaw. Dinanu la jox pak bu am Ndakaaru, Beer, Saly ak Saloum."],
        ["A", "What is included in the price?", "Qu'est-ce qui est compris dans le prix ?", "Lan la njëg gi ëmb ?"],
        ["B", "Transport, hotels, breakfast and an English-speaking guide.", "Le transport, les hôtels, le petit-déjeuner et un guide anglophone.", "Yoon, otel yi, ndekki ak gid bu xam Àngale."],
        ["A", "Is there a discount for a group of ten?", "Y a-t-il une réduction pour un groupe de dix ?", "Ndax am na wàññi njëg ngir mbooloo mu fukk ?"],
        ["B", "Yes, ten percent. A deposit of thirty percent confirms the booking.", "Oui, dix pour cent. Un acompte de trente pour cent confirme la réservation.", "Waaw, fukk ci téeméer. Ndoorte bu fanweer ci téeméer mooy dëggal réserwasioŋ bi."]
      ]),
      quiz: Q([
        ["The price is ___ person.", ["per", "for each of", "by"], "« per person » = par personne."],
        ["We can ___ the program.", ["adapt", "adopt", "adept"], "« adapt » = adapter."],
        ["A ___ of thirty percent is required.", ["deposit", "depose", "deposition"], "« deposit » = acompte."]
      ]) },

    { id: "tour-urgence", niv: 3, title: "Santé, sécurité et urgences",
      vocab: V([
        ["I need a doctor", "J'ai besoin d'un médecin", "Soxla naa doktoor"],
        ["Pharmacy", "Pharmacie", "Farmasi bi"],
        ["My bag was stolen", "On m'a volé mon sac", "Sama sàq bi sàcc nañu ko"],
        ["Call the police", "Appelez la police", "Woowal poliis yi"],
        ["I have lost my passport", "J'ai perdu mon passeport", "Réer naa sama paspoor"],
        ["Where is the nearest hospital?", "Où est l'hôpital le plus proche ?", "Fan la opitaal bi gën a jege nekk ?"],
        ["I am allergic to peanuts", "Je suis allergique aux arachides", "Maa ngi am alerji ci gerte"],
        ["Please help me", "Aidez-moi, s'il vous plaît", "Dimbali ma, baal ma"]
      ]),
      dialogue: D([
        ["A", "Help! My bag was stolen.", "Au secours ! On m'a volé mon sac.", "Dimbali ma ! Sama sàq bi sàcc nañu ko."],
        ["B", "Stay calm. What was in the bag?", "Restez calme. Qu'y avait-il dans le sac ?", "Dal-leen. Lan la sàq bi doon ëmb ?"],
        ["A", "My passport and my phone.", "Mon passeport et mon téléphone.", "Sama paspoor ak sama telefon."],
        ["B", "We will call the police. Where were you?", "Nous allons appeler la police. Où étiez-vous ?", "Dinanu woowal poliis yi. Fan nga nekkoon ?"],
        ["A", "Near the market. Where is the nearest police station?", "Près du marché. Où est le commissariat le plus proche ?", "Ci wetu marse bi. Fan la komiseriya bi gën a jege nekk ?"],
        ["B", "I will take you there. Do not worry.", "Je vous y emmène. Ne vous inquiétez pas.", "Dinaa la yóbbu foofu. Bul jaaxle."]
      ]),
      quiz: Q([
        ["My bag was ___.", ["stolen", "stole", "steal"], "Passif : « was stolen » = a été volé."],
        ["I have ___ my passport.", ["lost", "lose", "loose"], "« have lost » = ai perdu."],
        ["Where is the ___ hospital?", ["nearest", "near", "nearly"], "Superlatif : « the nearest »."]
      ]) },

    { id: "tour-agence", niv: 3, title: "Agence de voyage : vols et billets",
      vocab: V([
        ["Flight", "Vol", "Vol bi"],
        ["Round trip", "Aller-retour", "Dem ak dellusi"],
        ["One way", "Aller simple", "Dem rekk"],
        ["Departure", "Départ", "Dem bi"],
        ["Arrival", "Arrivée", "Agsi bi"],
        ["I would like to book a flight to Paris", "Je voudrais réserver un vol pour Paris", "Bëgg naa jàppe vol ngir Pari"],
        ["Do you have a visa?", "Avez-vous un visa ?", "Ndax am nga visa ?"],
        ["The luggage limit is twenty-three kilos", "La limite de bagage est de vingt-trois kilos", "Bagaas bi ñetti fukk ak ñaar kilo la"]
      ]),
      dialogue: D([
        ["A", "Good morning. I would like to book a round trip to Paris.", "Bonjour. Je voudrais réserver un aller-retour pour Paris.", "Salaamaleekum. Bëgg naa jàppe dem ak dellusi ngir Pari."],
        ["B", "When do you want to leave?", "Quand voulez-vous partir ?", "Kañ nga bëgg a dem ?"],
        ["A", "On the fifteenth of December, and return on the second of January.", "Le quinze décembre, et retour le deux janvier.", "Ci fukk ak juróom i desàmbar, te dellusi ci ñaar i sanwiyee."],
        ["B", "The price is five hundred thousand francs. Do you have a valid passport?", "Le prix est de cinq cent mille francs. Avez-vous un passeport valide ?", "Njëg gi juróom téeméer junni la. Ndax am nga paspoor bu baax ?"],
        ["A", "Yes. Is the luggage included?", "Oui. Les bagages sont-ils compris ?", "Waaw. Ndax bagaas bi ci biir la ?"],
        ["B", "One bag of twenty-three kilos is included.", "Un bagage de vingt-trois kilos est inclus.", "Benn bagaas bu ñetti fukk ak ñaar kilo ci biir la."]
      ]),
      quiz: Q([
        ["I would like to ___ a flight.", ["book", "booking", "booked"], "« would like to » + verbe de base."],
        ["A ___ trip means going and coming back.", ["round", "circle", "double"], "« round trip » = aller-retour."],
        ["Is the luggage ___?", ["included", "include", "including"], "« Is ... included? » = est-ce compris ?"]
      ]) },

    { id: "tour-culture", niv: 3, title: "Parler de la culture sénégalaise",
      vocab: V([
        ["Teranga means hospitality", "La teranga veut dire l'hospitalité", "Teranga mooy dalal ak jàmm"],
        ["Wrestling is our national sport", "La lutte est notre sport national", "Làmb mooy sunu ay ndaje"],
        ["Thieboudienne is the national dish", "Le thieboudienne est le plat national", "Ceebu jën mooy añu réew mi"],
        ["We say hello with a handshake", "On se salue en se serrant la main", "Nuyoo nanu ak loxo"],
        ["Tea is shared with friends", "Le thé se partage entre amis", "Attaaya mi, ñépp a ko séddoo"],
        ["Music and dance are very important", "La musique et la danse sont très importantes", "Xalam ak fecc am nañu solo bu réy"],
        ["Many languages are spoken in Senegal", "On parle beaucoup de langues au Sénégal", "Ay làkk a bari ci Senegaal"],
        ["Wolof is the most widely spoken language", "Le wolof est la langue la plus parlée", "Wolof mooy làkk wi gën a jëfandikoo"]
      ]),
      dialogue: D([
        ["A", "What is the meaning of teranga?", "Que signifie la teranga ?", "Lan mooy tekki teranga ?"],
        ["B", "It means hospitality. We welcome everyone as family.", "Cela veut dire l'hospitalité. Nous accueillons chacun comme de la famille.", "Mooy dalal ak jàmm. Danuy dalal ñépp ni njabootu."],
        ["A", "What do people eat for lunch?", "Que mange-t-on au déjeuner ?", "Lan la nit ñi di añ ?"],
        ["B", "Usually thieboudienne. We eat from one big plate.", "Généralement le thieboudienne. On mange dans un grand plat.", "Ceebu jën la lu ëpp. Danuy lekk ci benn bàttu."],
        ["A", "And after the meal?", "Et après le repas ?", "Ak ginnaaw añ bi ?"],
        ["B", "We drink attaya, three small glasses, slowly and with friends.", "On boit l'attaya, trois petits verres, doucement et entre amis.", "Danuy naan attaaya, ñetti kaas yu ndaw, ak jàmm ak xarit yi."]
      ]),
      quiz: Q([
        ["Wolof is the ___ widely spoken language.", ["most", "more", "much"], "Superlatif long : « the most widely »."],
        ["Many languages ___ spoken in Senegal.", ["are", "is", "be"], "Sujet pluriel : are."],
        ["Tea is ___ with friends.", ["shared", "share", "sharing"], "Passif : « is shared »."]
      ]) }
  ];

  var ids = {};
  G.forEach(function (t) { ids[t.id] = true; });
  T.forEach(function (t) {
    if (ids[t.id]) return;
    G.push({
      id: t.id, niveau: t.niv, tourisme: true,
      title: "N" + t.niv + " · 🏝️ " + t.title,
      vocab: t.vocab, dialogue: t.dialogue, quiz: t.quiz
    });
  });
  G.sort(function (a, b) {
    var d = (a.niveau || 3) - (b.niveau || 3);
    if (d) return d;
    return (b.tourisme ? 1 : 0) - (a.tourisme ? 1 : 0); /* le tourisme en tete de chaque niveau */
  });
  window.DiisooTourisme = { themes: T.length };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-tourisme.js",e);}

try{
/* ---- diisoo-son.js ---- */
/* diisoo-son.js v1 : sons de retour, comme les assistants vocaux
   - bip montant quand le micro s'ouvre (tu peux parler)
   - bip descendant quand le micro se ferme
   - petit carillon quand la reponse est juste (✅), son doux quand il faut reessayer
   Aucun fichier audio : les sons sont generes par le telephone. Desactiver : localStorage diisoo_son = "0". */
(function () {
  "use strict";

  var ctx = null;
  function actif() { try { return localStorage.getItem("diisoo_son") !== "0"; } catch (e) { return true; } }
  function audio() {
    if (ctx) return ctx;
    try { var C = window.AudioContext || window.webkitAudioContext; if (C) ctx = new C(); } catch (e) {}
    return ctx;
  }
  /* notes : [frequence Hz, debut s, duree s] */
  function jouer(notes, vol) {
    if (!actif()) return;
    var c = audio(); if (!c) return;
    try { if (c.state === "suspended") c.resume(); } catch (e) {}
    var t0 = c.currentTime + 0.01;
    notes.forEach(function (n) {
      try {
        var o = c.createOscillator(), g = c.createGain();
        o.type = "sine"; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, t0 + n[1]);
        g.gain.exponentialRampToValueAtTime(vol || 0.18, t0 + n[1] + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + n[1] + n[2]);
        o.connect(g); g.connect(c.destination);
        o.start(t0 + n[1]); o.stop(t0 + n[1] + n[2] + 0.05);
      } catch (e) {}
    });
  }
  var SONS = {
    ouvre: [[660, 0, 0.09], [880, 0.09, 0.12]],
    ferme: [[880, 0, 0.08], [587, 0.08, 0.12]],
    juste: [[784, 0, 0.1], [988, 0.1, 0.1], [1319, 0.2, 0.22]],
    reessaie: [[392, 0, 0.14], [349, 0.14, 0.2]]
  };
  function son(nom) { if (SONS[nom]) jouer(SONS[nom], nom === "juste" ? 0.2 : 0.16); }
  function vibre(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  /* Le moteur audio se reveille au premier toucher (exigence des navigateurs) */
  ["pointerdown", "touchstart", "click"].forEach(function (ev) {
    window.addEventListener(ev, function () { var c = audio(); try { if (c && c.state === "suspended") c.resume(); } catch (e) {} }, { capture: true, passive: true });
  });

  /* Sons du micro : on enveloppe l'ouverture et la fin de l'ecoute */
  var orig = window.startListening;
  if (typeof orig === "function") {
    window.startListening = function () {
      var h = orig.apply(this, arguments);
      try {
        son("ouvre"); vibre(15);
        if (h && h.promise && h.promise.then) {
          h.promise.then(function () { son("ferme"); }, function () {});
        }
      } catch (e) {}
      return h;
    };
  }

  /* Reponse juste : un ✅ apparait dans une zone de resultat */
  var dernier = 0;
  function verifier(noeud) {
    try {
      var el = noeud.nodeType === 3 ? noeud.parentNode : noeud;
      if (!el || !el.closest) return;
      var zone = el.closest("[id*='res'], [id*='-res'], .res, [data-res]");
      if (!zone) return;
      var t = zone.textContent || "";
      if (Date.now() - dernier < 900) return;
      if (t.indexOf("✅") > -1) { dernier = Date.now(); son("juste"); vibre([20, 40, 20]); }
      else if (/Réessaie|Reessaie|Rien entendu|Objectif/i.test(t)) { dernier = Date.now(); son("reessaie"); }
    } catch (e) {}
  }
  try {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === "childList") { for (var k = 0; k < m.addedNodes.length; k++) verifier(m.addedNodes[k]); }
        else if (m.type === "characterData") verifier(m.target);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  } catch (e) {}

  window.DiisooSon = { jouer: son, version: 1 };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-son.js",e);}

try{
/* ---- diisoo-objectif.js ---- */
/* diisoo-objectif.js v1 : un objectif personnel qu'on peut toucher du doigt
   - Apres le premier exercice, une fiche demande : ton but (visa, business, tourisme, wolof), ton rythme (3, 5 ou 10 exercices par jour), ta duree (30, 60 ou 90 jours)
   - Le tableau de bord montre : exercices du jour, jour X sur N, et le but choisi
   - Rappel quotidien : un fichier calendrier (.ics) qui sonne chaque jour a l'heure choisie, meme si l'app est fermee
   - A l'ouverture de l'app, si l'objectif du jour n'est pas fini, un message le rappelle */
(function () {
  "use strict";

  var CLE = "diisoo_obj";
  var BUTS = [
    ["visa", "🛂", "Visa et examen"],
    ["business", "💼", "Business et commerce"],
    ["tourisme", "🏝️", "Tourisme"],
    ["wolof", "🗣️", "Parler wolof"]
  ];
  var RYTHMES = [[3, "Doux", "3 par jour"], [5, "Régulier", "5 par jour"], [10, "Intense", "10 par jour"]];
  var DUREES = [30, 60, 90];

  function $(id) { return document.getElementById(id); }
  function lire() { try { return JSON.parse(localStorage.getItem(CLE) || "null"); } catch (e) { return null; } }
  function ecrire(o) { try { localStorage.setItem(CLE, JSON.stringify(o)); } catch (e) {} }
  function aujourd() { return new Date().toISOString().slice(0, 10); }
  function jours(a, b) { return Math.floor((new Date(b) - new Date(a)) / 86400000); }
  function cible() { var o = lire(); return (o && o.rythme) || (typeof DAILY_TARGET !== "undefined" ? DAILY_TARGET : 5); }
  function nomBut(o) { var x = BUTS.filter(function (b) { return b[0] === (o && o.but); })[0]; return x ? x[1] + " " + x[2] : ""; }

  /* ---------- tableau de bord ---------- */
  function rendre() {
    var el = $("daily-goal");
    if (!el) return;
    var g = typeof getDailyGoal === "function" ? getDailyGoal() : { done: 0 };
    var T = cible(), done = Math.min(g.done, T), o = lire();
    var h = '<div class="flex justify-between items-center text-[11px] text-[#A69C86] mb-1"><span>🎯 Objectif du jour</span><span class="flex items-center"><span id="slot-save"></span>' + done + "/" + T + "</span></div>" +
      '<div class="w-full bg-[#141A2B] h-1.5 rounded-full overflow-hidden"><div class="bg-[#3FAE74] h-full transition-all" style="width:' + Math.round(done / T * 100) + '%"></div></div>';
    if (o && o.debut) {
      var j = Math.min(o.duree, jours(o.debut, aujourd()) + 1);
      h += '<div class="flex justify-between text-[10px] text-[#8C8064] mt-1"><span>' + nomBut(o) + "</span><span>Jour " + j + " sur " + o.duree + "</span></div>";
      h += '<div class="w-full bg-[#141A2B] h-1 rounded-full overflow-hidden mt-1"><div class="bg-[#E1693F] h-full" style="width:' + Math.round(j / o.duree * 100) + '%"></div></div>';
      h += '<button type="button" id="obj-modif" class="mt-1 text-[10px] text-[#A69C86] underline">Changer mon objectif ou mon rappel</button>';
    } else {
      h += '<button type="button" id="obj-modif" class="mt-1 text-[11px] text-[#25D366] underline">🔔 Activer mon rappel quotidien</button>';
    }
    el.innerHTML = h;
    var m = $("obj-modif"); if (m) m.onclick = function () { fiche(true); };
    if (window.montrerSauvegarde) { try { window.montrerSauvegarde(); } catch (e) {} }
  }
  window.renderDailyGoal = rendre;
  window.bumpDailyGoal = function (n) {
    var g = getDailyGoal(), T = cible(), avant = g.done >= T;
    g.done += n; store.set("diisoo_goal", g);
    rendre();
    if (!avant && g.done >= T) { try { toast("🎯 Objectif du jour atteint ! Reviens demain pour continuer ta série."); } catch (e) {} }
    setTimeout(proposer, 1500);
  };

  /* ---------- fiche : but, rythme, duree, rappel ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#dii-obj{position:fixed;inset:0;z-index:9990;background:rgba(5,8,16,.86);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-obj .ob-box{width:100%;max-width:480px;max-height:94vh;overflow-y:auto;background:#0B0F1C;border:1px solid #1E2740;" +
    "border-radius:22px 22px 0 0;padding:18px 16px 24px;color:#F6F1E7}" +
    "#dii-obj h3{font-size:18px;font-weight:800;text-align:center;margin:0 0 4px}" +
    "#dii-obj .ob-sub{text-align:center;font-size:12px;color:#A69C86;margin:0 0 12px}" +
    "#dii-obj .ob-q{font-size:12px;font-weight:700;color:#C9BFA8;margin:12px 0 6px}" +
    "#dii-obj .ob-g{display:grid;gap:8px}" +
    "#dii-obj .ob-g.c2{grid-template-columns:1fr 1fr}#dii-obj .ob-g.c3{grid-template-columns:1fr 1fr 1fr}" +
    "#dii-obj .ob-c{min-height:56px;padding:8px;border-radius:14px;background:#141A2B;border:2px solid #1E2740;color:#F6F1E7;font-size:13px;font-weight:700;text-align:center}" +
    "#dii-obj .ob-c small{display:block;font-size:11px;font-weight:400;color:#A69C86}" +
    "#dii-obj .ob-c.on{border-color:#25D366;background:#12351F}" +
    "#dii-obj .ob-ok{width:100%;min-height:56px;margin-top:16px;border-radius:999px;border:0;background:#25D366;color:#fff;font-size:16px;font-weight:800}" +
    "#dii-obj .ob-no{width:100%;min-height:44px;margin-top:8px;background:none;border:0;color:#A69C86;font-size:13px}" +
    "#dii-obj input[type=time]{width:100%;min-height:48px;border-radius:14px;background:#141A2B;border:2px solid #1E2740;color:#F6F1E7;font-size:18px;text-align:center}";
  document.head.appendChild(st);

  function fiche(modif) {
    if ($("dii-obj")) return;
    var o = lire() || { but: "visa", rythme: 5, duree: 30, heure: "20:30" };
    var ov = document.createElement("div"); ov.id = "dii-obj";
    var b = '<div class="ob-box"><h3>🎯 Fixe ton objectif</h3><p class="ob-sub">Un but clair, un rythme, une date. Tu avances chaque jour.</p>';
    b += '<p class="ob-q">1. Pourquoi tu apprends ?</p><div class="ob-g c2" data-k="but">';
    BUTS.forEach(function (x) { b += '<button type="button" class="ob-c' + (o.but === x[0] ? " on" : "") + '" data-v="' + x[0] + '">' + x[1] + "<br>" + x[2] + "</button>"; });
    b += '</div><p class="ob-q">2. Combien d\'exercices par jour ?</p><div class="ob-g c3" data-k="rythme">';
    RYTHMES.forEach(function (x) { b += '<button type="button" class="ob-c' + (o.rythme === x[0] ? " on" : "") + '" data-v="' + x[0] + '">' + x[1] + "<small>" + x[2] + "</small></button>"; });
    b += '</div><p class="ob-q">3. En combien de jours ?</p><div class="ob-g c3" data-k="duree">';
    DUREES.forEach(function (x) { b += '<button type="button" class="ob-c' + (o.duree === x ? " on" : "") + '" data-v="' + x + '">' + x + "<small>jours</small></button>"; });
    b += '</div><p class="ob-q">4. Quand es-tu disponible ? (rappel chaque jour, même si l\'app est fermée)</p><div class="ob-g c3" id="ob-creneaux">';
    [["06:30", "🌅", "Matin"], ["12:30", "☀️", "Midi"], ["20:30", "🌙", "Soir"]].forEach(function (x) { b += '<button type="button" class="ob-c' + (o.heure === x[0] ? " on" : "") + '" data-h="' + x[0] + '">' + x[1] + "<small>" + x[2] + " " + x[0].replace(":", "h") + "</small></button>"; });
    b += '</div><p class="ob-q" style="margin-top:8px">ou une autre heure :</p><input type="time" id="ob-heure" value="' + (o.heure || "20:30") + '">';
    b += '<button type="button" class="ob-ok" id="ob-valider">✅ Valider mon objectif</button>';
    b += '<button type="button" class="ob-no" id="ob-plus">' + (modif ? "Fermer" : "Plus tard") + "</button></div>";
    ov.innerHTML = b;
    document.body.appendChild(ov);
    Array.prototype.forEach.call(ov.querySelectorAll(".ob-g"), function (g) {
      var k = g.getAttribute("data-k");
      Array.prototype.forEach.call(g.children, function (c) {
        c.onclick = function () {
          Array.prototype.forEach.call(g.children, function (x) { x.classList.remove("on"); });
          c.classList.add("on");
          var v = c.getAttribute("data-v"); o[k] = k === "but" ? v : +v;
        };
      });
    });
    Array.prototype.forEach.call(ov.querySelectorAll("#ob-creneaux .ob-c"), function (c) {
      c.onclick = function () {
        Array.prototype.forEach.call(ov.querySelectorAll("#ob-creneaux .ob-c"), function (x) { x.classList.remove("on"); });
        c.classList.add("on"); $("ob-heure").value = c.getAttribute("data-h");
      };
    });
    $("ob-heure").onchange = function () {
      Array.prototype.forEach.call(ov.querySelectorAll("#ob-creneaux .ob-c"), function (x) { x.classList.toggle("on", x.getAttribute("data-h") === $("ob-heure").value); });
    };
    $("ob-plus").onclick = function () {
      ov.remove();
      if (!modif) { try { localStorage.setItem("diisoo_obj_plus", aujourd()); } catch (e) {} }
    };
    $("ob-valider").onclick = function () {
      o.heure = $("ob-heure").value || "20:30";
      o.debut = (lire() && lire().debut) || aujourd();
      ecrire(o);
      ov.remove();
      rendre();
      var repli = function () {
        telechargerRappel(o);
        try { toast("🎯 Objectif enregistré. Ouvre le fichier pour activer ton rappel."); } catch (e) {}
      };
      if (window.DiisooRappel && window.DiisooRappel.ok()) {
        window.DiisooRappel.activer(o).then(function (bon) {
          if (bon) { try { toast("🔔 Rappel activé chaque jour à " + o.heure); } catch (e) {} } else repli();
        });
      } else repli();
    };
  }

  /* ---------- rappel : fichier calendrier quotidien ---------- */
  function telechargerRappel(o) {
    try {
      var h = (o.heure || "20:30").split(":"), d = new Date();
      var pad = function (n) { return (n < 10 ? "0" : "") + n; };
      var jour = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
      var ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Diisoo//FR", "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT", "UID:diisoo-rappel-quotidien@diisoo.sn", "DTSTAMP:" + jour + "T000000Z",
        "DTSTART:" + jour + "T" + pad(+h[0]) + pad(+h[1]) + "00",
        "DTEND:" + jour + "T" + pad(+h[0]) + pad(+h[1] + 10 > 59 ? 59 : +h[1] + 10) + "00",
        "RRULE:FREQ=DAILY;COUNT=" + (o.duree || 30),
        "SUMMARY:Diisoo : " + (o.rythme || 5) + " exercices aujourd'hui",
        "DESCRIPTION:Ouvre https://diisoo.sn et fais ton objectif du jour. Une série à ne pas casser !",
        "URL:https://diisoo.sn/",
        "BEGIN:VALARM", "TRIGGER:PT0M", "ACTION:DISPLAY", "DESCRIPTION:Diisoo : ton objectif du jour t'attend", "END:VALARM",
        "END:VEVENT", "END:VCALENDAR"
      ].join("\r\n");
      var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "rappel-diisoo.ics";
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    } catch (e) {}
  }

  /* ---------- quand proposer la fiche, et le rappel a l'ouverture ---------- */
  function ecran() { var e = $("screen-dashboard"); return !!(e && e.offsetParent !== null); }
  function proposer() {
    if (lire() || !ecran()) return;
    var g = typeof getDailyGoal === "function" ? getDailyGoal() : { done: 0 };
    var plus = ""; try { plus = localStorage.getItem("diisoo_obj_plus") || ""; } catch (e) {}
    if (g.done >= 1 && plus !== aujourd()) fiche(false);
  }
  setInterval(function () { if (ecran()) proposer(); }, 4000);

  var rappele = false;
  setTimeout(function () {
    var o = lire();
    if (rappele || !o || !ecran()) return;
    var g = getDailyGoal();
    if (g.done < cible()) {
      rappele = true;
      try { toast("🎯 Il te reste " + (cible() - g.done) + " exercice" + (cible() - g.done > 1 ? "s" : "") + " pour ton objectif du jour."); } catch (e) {}
    }
  }, 6000);

  if (/[?&]objectif=1/.test(location.search)) setTimeout(function () { fiche(true); }, 2500);
  rendre();
  window.DiisooObjectif = { version: 1, fiche: fiche, cible: cible };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-objectif.js",e);}

try{
/* ---- diisoo-rappel.js ---- */
/* diisoo-rappel.js v1 : vrai rappel quotidien (notification), meme si l'app est fermee
   - activer(objectif) : demande l'autorisation, abonne le telephone, envoie l'abonnement a Supabase (RPC enregistrer_push)
   - a chaque ouverture et a chaque exercice : dit au serveur si l'objectif du jour est fait (RPC push_actif), pour ne pas relancer quelqu'un qui a deja pratique
   - si tout echoue ou si le navigateur ne sait pas : repli sur le fichier calendrier de diisoo-objectif.js */
(function () {
  "use strict";
  if (window.DiisooRappel) return;
  var CLE_VAPID = "BMrk9C1QrIXB4jnV4U7PglLE5wkVxdUWRSH-wNk-9slpMW-ovOW8fdBuNMkAkLIO_ju6RRQ7TwjOfASggo1w3Wg";

  function ok() { return "Notification" in window && "serviceWorker" in navigator && "PushManager" in window; }
  function b64(s) {
    var p = "=".repeat((4 - s.length % 4) % 4), r = atob((s + p).replace(/-/g, "+").replace(/_/g, "/")), o = new Uint8Array(r.length);
    for (var i = 0; i < r.length; i++) o[i] = r.charCodeAt(i);
    return o;
  }
  function buf(a) { return btoa(String.fromCharCode.apply(null, new Uint8Array(a))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function rpc(nom, corps) {
    if (typeof SUPABASE_URL === "undefined" || typeof SUPABASE_KEY === "undefined") return Promise.reject(new Error("pas de config"));
    return fetch(SUPABASE_URL + "/rest/v1/rpc/" + nom, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
      body: JSON.stringify(corps)
    }).then(function (r) { if (!r.ok) throw new Error("rpc " + r.status); return true; });
  }
  function aujourd() { return new Date().toISOString().slice(0, 10); }
  function serie() { try { return ((JSON.parse(localStorage.getItem("diisoo_streak") || "null")) || {}).count || 0; } catch (e) { return 0; } }
  function faits() { try { return (typeof getDailyGoal === "function" ? getDailyGoal().done : 0) || 0; } catch (e) { return 0; } }
  function langue() { try { var o = JSON.parse(localStorage.getItem("diisoo_obj") || "null"); return (o && o.but) || "general"; } catch (e) { return "general"; } }
  function minutesUtc(hhmm) {
    var h = (hhmm || "18:00").split(":"), d = new Date();
    var loc = (+h[0] || 0) * 60 + (+h[1] || 0);
    loc = Math.max(360, Math.min(1319, loc)); /* jamais la nuit : entre 6h00 et 21h59 */
    d.setHours(Math.floor(loc / 60), loc % 60, 0, 0);
    return d.getUTCHours() * 60 + d.getUTCMinutes();
  }
  function abonnement() {
    return navigator.serviceWorker.ready.then(function (reg) {
      return reg.pushManager.getSubscription().then(function (s) {
        return s || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(CLE_VAPID) });
      });
    });
  }

  function activer(o) {
    if (!ok()) return Promise.resolve(false);
    return Notification.requestPermission().then(function (p) {
      if (p !== "granted") return false;
      return abonnement().then(function (s) {
        return rpc("enregistrer_push", {
          p_endpoint: s.endpoint, p_p256dh: buf(s.getKey("p256dh")), p_auth: buf(s.getKey("auth")),
          p_minutes_utc: minutesUtc(o && o.heure), p_serie: serie(), p_but: langue(), p_jour: aujourd(), p_faits: faits()
        });
      });
    }).then(function (r) { if (r) { try { localStorage.setItem("diisoo_rappel_on", "1"); } catch (e) {} } return !!r; })
      .catch(function () { return false; });
  }

  var envoye = "";
  function sync() {
    try {
      if (!ok() || localStorage.getItem("diisoo_rappel_on") !== "1" || Notification.permission !== "granted") return;
      var cle = aujourd() + ":" + faits() + ":" + serie();
      if (cle === envoye) return;
      envoye = cle;
      navigator.serviceWorker.ready.then(function (reg) { return reg.pushManager.getSubscription(); }).then(function (s) {
        if (!s) return;
        return rpc("push_actif", { p_endpoint: s.endpoint, p_serie: serie(), p_jour: aujourd(), p_faits: faits() });
      }).catch(function () {});
    } catch (e) {}
  }

  /* ---- heure reelle de pratique : proposition apres 3 jours ---- */
  function noterHeure() {
    try {
      var h = new Date(), j = aujourd(), L = lire("diisoo_heures", []);
      if (!Array.isArray(L)) L = [];
      if (L.some(function (x) { return x.j === j; })) return;
      L.push({ j: j, m: h.getHours() * 60 + h.getMinutes() });
      while (L.length > 30) L.shift();
      localStorage.setItem("diisoo_heures", JSON.stringify(L));
    } catch (e) {}
  }
  function lire(k, v) { try { return JSON.parse(localStorage.getItem(k) || "null") || v; } catch (e) { return v; } }
  function mediane() {
    var L = lire("diisoo_heures", []).map(function (x) { return x.m; }).sort(function (a, b) { return a - b; });
    return L.length >= 3 ? L[Math.floor(L.length / 2)] : null;
  }
  function hhmm(m) { var h = Math.floor(m / 60), n = m % 60; return (h < 10 ? "0" : "") + h + ":" + (n < 10 ? "0" : "") + n; }
  function proposer() {
    try {
      if (localStorage.getItem("diisoo_rappel_on") !== "1") return;
      var o = lire("diisoo_obj", null); if (!o || !o.heure) return;
      var med = mediane(); if (med === null) return;
      med = Math.round(med / 30) * 30;
      var cur = (+o.heure.split(":")[0]) * 60 + (+o.heure.split(":")[1] || 0);
      if (Math.abs(med - cur) < 90 || med < 360 || med > 1319) return;
      var dernier = localStorage.getItem("diisoo_rappel_propose");
      if (dernier && (Date.now() - new Date(dernier).getTime()) < 14 * 86400000) return;
      var d = document.getElementById("screen-dashboard");
      if (!d || d.classList.contains("hidden") || document.querySelector("#dii-obj,#dii-recap,#dii-defi,#dar,#dsr,[id^=screen-].fixed:not(.hidden)")) return;
      localStorage.setItem("diisoo_rappel_propose", aujourd());
      var nom = hhmm(med).replace(":", "h").replace(/h00$/, "h");
      var b = document.createElement("div");
      b.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:9991;max-width:456px;margin:0 auto;background:#141A2B;border:1px solid #25D366;border-radius:16px;padding:12px 14px;color:#F6F1E7;font-size:13px";
      b.innerHTML = "Tu pratiques souvent vers <b>" + nom + "</b>. Te rappeler à " + nom + " ?<br>" +
        '<button type="button" id="rp-oui" style="margin:8px 8px 0 0;min-height:44px;padding:0 16px;border-radius:999px;border:0;background:#25D366;color:#fff;font-weight:800;font-size:14px">Oui</button>' +
        '<button type="button" id="rp-non" style="margin-top:8px;min-height:44px;padding:0 12px;border:0;background:none;color:#A69C86;font-size:13px">Non merci</button>';
      document.body.appendChild(b);
      document.getElementById("rp-non").onclick = function () { b.remove(); };
      document.getElementById("rp-oui").onclick = function () {
        o.heure = hhmm(med);
        try { localStorage.setItem("diisoo_obj", JSON.stringify(o)); } catch (e) {}
        b.remove();
        activer(o).then(function (bon) { if (bon) { try { toast("🔔 Rappel déplacé à " + nom); } catch (e) {} } });
      };
      setTimeout(function () { if (b.parentNode) b.remove(); }, 15000);
    } catch (e) {}
  }

  /* ---- point d'entree visible : toucher la serie (🔥) ouvre le reglage du rappel ; une cloche invite a l'activer ---- */
  (function () {
    var css = document.createElement("style");
    css.textContent = "body.rp-off #streak-counter::after{content:' 🔔'}#streak-counter{cursor:pointer}";
    document.head.appendChild(css);
    function etat() { try { document.body.classList.toggle("rp-off", localStorage.getItem("diisoo_rappel_on") !== "1" && ok()); } catch (e) {} }
    function brancher() {
      var s = document.getElementById("streak-counter");
      if (!s) return false;
      if (!s.__rp) {
        s.__rp = 1; s.setAttribute("role", "button"); s.setAttribute("aria-label", "Régler mon rappel quotidien");
        s.addEventListener("click", function () { if (window.DiisooObjectif && DiisooObjectif.fiche) DiisooObjectif.fiche(true); });
      }
      return true;
    }
    etat(); setInterval(etat, 3000);
    var n = 0, t = setInterval(function () { n++; if (brancher() || n > 30) clearInterval(t); }, 500);
  })();

  window.DiisooRappel = { ok: ok, activer: activer, sync: sync, proposer: proposer };
  noterHeure();
  setTimeout(proposer, 7000);
  setTimeout(sync, 4000);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") sync(); });
  var essais = 0, t = setInterval(function () {
    essais++;
    if (typeof window.bumpDailyGoal === "function" && !window.bumpDailyGoal.__r) {
      var f = window.bumpDailyGoal;
      window.bumpDailyGoal = function () { var r = f.apply(this, arguments); noterHeure(); setTimeout(sync, 800); return r; };
      window.bumpDailyGoal.__r = 1; clearInterval(t);
    } else if (essais > 20) clearInterval(t);
  }, 500);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-rappel.js",e);}

try{
/* ---- diisoo-recap.js ---- */
/* diisoo-recap.js v1 : « Ta semaine », un bilan une fois par semaine
   - Lit le journal d'XP existant (diisoo_daily_xp) : jours actifs sur 7, XP gagne, comparaison avec la semaine d'avant, serie, niveau
   - S'affiche a la premiere ouverture de chaque nouvelle semaine, seulement si la personne a pratique ; jamais pendant un exercice
   - Bouton « Partager » : message WhatsApp avec le lien diisoo.sn (chaque bilan peut ramener un ami)
   - Essai : https://diisoo.sn/?recap=1 */
(function () {
  "use strict";
  if (window.DiisooRecap) return;
  var CLE = "diisoo_recap_semaine";
  function $(id) { return document.getElementById(id); }
  function jour(d) { return d.toISOString().slice(0, 10); }
  function lire(k, v) { try { return JSON.parse(localStorage.getItem(k) || "null") || v; } catch (e) { return v; } }
  function semaine(d) { // cle = lundi de la semaine
    var x = new Date(d); x.setUTCHours(0, 0, 0, 0);
    x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
    return jour(x);
  }
  function bilan() {
    var log = lire("diisoo_daily_xp", {}), n = Date.now(), cur = { j: 0, xp: 0 }, avant = { j: 0, xp: 0 };
    for (var i = 0; i < 14; i++) {
      var v = log[jour(new Date(n - i * 86400000))] || 0, t = i < 7 ? cur : avant;
      if (v > 0) { t.j++; t.xp += v; }
    }
    var xp = lire("diisoo_xp", { total: 0 }).total || 0;
    return { cur: cur, avant: avant, serie: (lire("diisoo_streak", {}).count) || 0, niveau: Math.floor(xp / 50) + 1 };
  }
  function phrase(b) {
    if (b.cur.j >= 6) return "Semaine exceptionnelle. Tu es régulier, c'est ça qui fait progresser.";
    if (b.cur.j >= 4) return "Très belle semaine. Encore un jour de plus et tu fais encore mieux.";
    if (b.cur.xp > b.avant.xp && b.avant.xp > 0) return "Tu progresses par rapport à la semaine dernière. Continue comme ça.";
    return "Un bon début. Quelques minutes par jour valent mieux qu'une longue séance.";
  }

  var st = document.createElement("style");
  st.textContent =
    "#dii-recap{position:fixed;inset:0;z-index:9991;background:rgba(5,8,16,.88);display:flex;align-items:center;justify-content:center;padding:16px}" +
    "#dii-recap .rc{width:100%;max-width:380px;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px;padding:20px 16px;color:#F6F1E7;text-align:center}" +
    "#dii-recap h3{font-size:20px;font-weight:800;margin:0 0 2px}" +
    "#dii-recap .rc-s{font-size:12px;color:#A69C86;margin:0 0 14px}" +
    "#dii-recap .rc-g{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
    "#dii-recap .rc-c{background:#141A2B;border:1px solid #1E2740;border-radius:14px;padding:12px 6px}" +
    "#dii-recap .rc-c b{display:block;font-size:24px;font-weight:900}" +
    "#dii-recap .rc-c span{font-size:11px;color:#A69C86}" +
    "#dii-recap .rc-p{font-size:13px;color:#C9BFA8;margin:14px 4px 0}" +
    "#dii-recap button{width:100%;min-height:52px;margin-top:10px;border-radius:999px;border:0;font-size:15px;font-weight:800}" +
    "#dii-recap .rc-w{background:#25D366;color:#fff}#dii-recap .rc-f{background:none;color:#A69C86;font-size:13px;min-height:44px;font-weight:600}";
  document.head.appendChild(st);

  function afficher() {
    if ($("dii-recap")) return;
    var b = bilan(), diff = b.cur.xp - b.avant.xp;
    var ov = document.createElement("div"); ov.id = "dii-recap";
    ov.innerHTML = '<div class="rc"><h3>📊 Ta semaine</h3><p class="rc-s">Les 7 derniers jours</p><div class="rc-g">' +
      '<div class="rc-c"><b>' + b.cur.j + '/7</b><span>jours actifs</span></div>' +
      '<div class="rc-c"><b>+' + b.cur.xp + '</b><span>XP gagnés' + (b.avant.xp ? " (" + (diff >= 0 ? "+" : "") + diff + " vs sem. dernière)" : "") + '</span></div>' +
      '<div class="rc-c"><b>🔥 ' + b.serie + '</b><span>jours de série</span></div>' +
      '<div class="rc-c"><b>⭐ ' + b.niveau + '</b><span>niveau</span></div></div>' +
      '<p class="rc-p">' + phrase(b) + '</p>' +
      '<button type="button" class="rc-w" id="rc-share">Partager mon bilan</button>' +
      '<button type="button" class="rc-f" id="rc-close">Continuer</button></div>';
    document.body.appendChild(ov);
    $("rc-close").onclick = function () { ov.remove(); };
    $("rc-share").onclick = function () {
      var t = "Ma semaine sur Diisoo : " + b.cur.j + "/7 jours, +" + b.cur.xp + " XP, série de " + b.serie + " jours 🔥\nApprends l'anglais et le wolof gratuitement : https://diisoo.sn/?source=recap";
      try { window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank"); } catch (e) {}
    };
    try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", "recap_semaine", ""); } catch (e) {}
  }

  function peutAfficher() {
    var d = $("screen-dashboard");
    if (!d || d.classList.contains("hidden")) return false;
    return !document.querySelector("#dii-obj,#dar,#dsr,[id^=screen-].fixed:not(.hidden)");
  }
  function verifier(force) {
    var cle = semaine(new Date());
    if (!force) {
      if (lire(CLE, "") === cle) return;
      var b = bilan();
      if (b.cur.j < 1) return;
      if (!peutAfficher()) return;
    }
    try { localStorage.setItem(CLE, JSON.stringify(cle)); } catch (e) {}
    afficher();
  }
  window.DiisooRecap = { afficher: afficher, verifier: verifier };
  var force = /[?&]recap=1/.test(location.search);
  setTimeout(function () { verifier(force); }, 4500);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-recap.js",e);}

try{
/* ---- diisoo-defi.js ---- */
/* diisoo-defi.js v1 : « Défie un ami »
   - Quand l'objectif du jour est atteint, une fenetre propose de defier un ami sur WhatsApp : « je suis a N jours de serie, tu peux me battre ? »
   - Le lien partage contient ?source=defi&serie=N. L'ami qui arrive voit un bandeau (une fois) et le defi est memorise
   - Quand l'ami depasse la serie de celui qui l'a defie, il recoit un message de victoire
   - Essai : https://diisoo.sn/?defi=1 (ouvre la fenetre de defi) */
(function () {
  "use strict";
  if (window.DiisooDefi) return;
  function $(id) { return document.getElementById(id); }
  function lire(k, v) { try { return JSON.parse(localStorage.getItem(k) || "null") || v; } catch (e) { return v; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function aujourd() { return new Date().toISOString().slice(0, 10); }
  function serie() { return (lire("diisoo_streak", {}).count) || 0; }
  function suivi(a) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", a, ""); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#dii-defi{position:fixed;inset:0;z-index:9991;background:rgba(5,8,16,.86);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-defi .df{width:100%;max-width:480px;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px 22px 0 0;padding:20px 16px 24px;color:#F6F1E7;text-align:center}" +
    "#dii-defi h3{font-size:19px;font-weight:800;margin:0 0 6px}" +
    "#dii-defi p{font-size:13px;color:#C9BFA8;margin:0 0 4px}" +
    "#dii-defi button{width:100%;min-height:52px;margin-top:10px;border-radius:999px;border:0;font-size:15px;font-weight:800}" +
    "#dii-defi .d-w{background:#25D366;color:#fff}#dii-defi .d-f{background:none;color:#A69C86;font-size:13px;min-height:44px;font-weight:600}" +
    "#dii-defi-ban{position:fixed;left:12px;right:12px;bottom:12px;z-index:9991;max-width:456px;margin:0 auto;background:#12351F;border:1px solid #25D366;border-radius:16px;padding:12px 14px;color:#F6F1E7;font-size:13px}" +
    "#dii-defi-ban button{margin-top:8px;min-height:44px;padding:0 16px;border-radius:999px;border:0;background:#25D366;color:#fff;font-weight:800;font-size:14px}";
  document.head.appendChild(st);

  function proposer() {
    if ($("dii-defi")) return;
    var n = Math.max(1, serie());
    var ov = document.createElement("div"); ov.id = "dii-defi";
    ov.innerHTML = '<div class="df"><h3>🎯 Objectif atteint !</h3><p>Tu es à <b>' + n + (n > 1 ? " jours" : " jour") + '</b> de série.</p><p>Défie un ami de te battre.</p>' +
      '<button type="button" class="d-w" id="df-go">Défier un ami sur WhatsApp</button>' +
      '<button type="button" class="d-f" id="df-no">Plus tard</button></div>';
    document.body.appendChild(ov);
    $("df-no").onclick = function () { ov.remove(); };
    $("df-go").onclick = function () {
      var t = "Je suis à " + n + (n > 1 ? " jours" : " jour") + " de série sur Diisoo 🔥 Tu peux me battre ?\nApprends l'anglais et le wolof gratuitement : https://diisoo.sn/?source=defi&serie=" + n;
      try { window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank"); } catch (e) {}
      suivi("defi_envoye");
      ov.remove();
    };
  }

  function bandeau(n) {
    if ($("dii-defi-ban") || $("dar") || $("dsr")) return;
    var b = document.createElement("div"); b.id = "dii-defi-ban";
    b.innerHTML = "🔥 Un ami t'a défié : il est à <b>" + n + (n > 1 ? " jours" : " jour") + "</b> de série. Pratique chaque jour pour le battre !<br><button type=\"button\">Relever le défi</button>";
    document.body.appendChild(b);
    b.querySelector("button").onclick = function () { b.remove(); };
    setTimeout(function () { if (b.parentNode) b.remove(); }, 12000);
    suivi("defi_recu");
  }

  function victoire() {
    var d = lire("diisoo_defi", null);
    if (!d || d.gagne || serie() <= d.serie) return;
    d.gagne = true; ecrire("diisoo_defi", d);
    try { toast("🏆 Tu as battu ton ami : " + serie() + " jours contre " + d.serie + " !"); } catch (e) {}
    suivi("defi_gagne");
  }

  var q = location.search, m = q.match(/[?&]serie=(\d{1,4})/);
  if (/[?&]source=defi/.test(q) && m && !lire("diisoo_defi", null)) {
    var n = Math.min(999, +m[1]);
    ecrire("diisoo_defi", { serie: n, date: aujourd(), gagne: false });
    setTimeout(function () { bandeau(n); }, 3500);
  }
  setTimeout(victoire, 5000);
  if (/[?&]defi=1/.test(q)) setTimeout(proposer, 3500);

  var essais = 0, t = setInterval(function () {
    essais++;
    if (typeof window.bumpDailyGoal === "function" && !window.bumpDailyGoal.__d) {
      var f = window.bumpDailyGoal;
      window.bumpDailyGoal = function () {
        var avant = 0; try { avant = getDailyGoal().done; } catch (e) {}
        var cible = 5; try { cible = (lire("diisoo_obj", null) || {}).rythme || DAILY_TARGET; } catch (e) {}
        var r = f.apply(this, arguments);
        var apres = 0; try { apres = getDailyGoal().done; } catch (e) {}
        if (avant < cible && apres >= cible) {
          setTimeout(function () { victoire(); if (!$("dii-obj") && !$("dar")) proposer(); }, 2200);
        }
        return r;
      };
      window.bumpDailyGoal.__d = 1; clearInterval(t);
    } else if (essais > 30) clearInterval(t);
  }, 500);
  window.DiisooDefi = { proposer: proposer };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-defi.js",e);}

try{
/* ---- diisoo-mission-visa.js ---- */
/* diisoo-mission-visa.js v1 : Mission « Entretien visa »
   L'app joue l'officier (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Visa & Entretien consulaire » (Anglais). Essai : https://diisoo.sn/?mission=visa */
(function () {
  "use strict";
  if (window.DiisooMissionVisa) return;
  var Q = [
    { q: "What is the purpose of your trip?", kw: /business|visit|family|study|tourism|holiday|travel|buy|work/i, m: "I am travelling for business." },
    { q: "How long will you stay?", kw: /day|week|month/i, m: "I will stay for ten days." },
    { q: "Where will you stay?", kw: /hotel|friend|family|brother|sister|house|apartment/i, m: "I will stay at a hotel." },
    { q: "Who is paying for your trip?", kw: /myself|my |family|company|brother|sister|father|mother|employer/i, m: "I am paying for myself." },
    { q: "How can I be sure that you will come back?", kw: /family|business|shop|job|work|ticket|return|home|children|wife|husband/i, m: "My family and my business are in Senegal." }
  ];
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mvo{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mvo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mvo .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mvo .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mvo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mvo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mvo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mvo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mvo .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mvo .m.on{animation:mvp 1s infinite}@keyframes mvp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mvo .ok{color:#25D366}#mvo .or{color:#FFAA3C}" +
    "#mv-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mv-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mvo")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mvo";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🛂 Entretien visa · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mv-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mv-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mv-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mv-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mv-skip" type="button">Passer</button>' +
        '<button class="b3" id="mv-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mv-r"), mic = document.getElementById("mv-mic"), nx = document.getElementById("mv-next");
      document.getElementById("mv-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mv-x").onclick = function () { o.remove(); };
      document.getElementById("mv-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["entretien-visa"]) BADGES["entretien-visa"] = { icon: "🛂", label: "Entretien réussi", desc: "Mission visa réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("entretien-visa"); } catch (e) {}
      }
      noter("mission_visa", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🛂 Mission visa</div><div class="q">' + (ok ? "Visa accordé ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Entretien réussi » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Visa et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mv-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mv-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mv-x2" type="button">Fermer</button>';
      document.getElementById("mv-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mv-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mv-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon entretien visa en anglais sur Diisoo 🛂 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mv-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "visa") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mv-btn";
    b.innerHTML = '<span style="font-size:22px">🛂</span><span>Mission : passer l\'entretien<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionVisa = { ouvrir: ouvrir };
  if (/[?&]mission=visa/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-visa.js",e);}

try{
/* ---- diisoo-mission-marche.js ---- */
/* diisoo-mission-marche.js v1 : Mission « Négocier au marché »
   L'app joue le client (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Achats & argent » (Anglais). Essai : https://diisoo.sn/?mission=marche */
(function () {
  "use strict";
  if (window.DiisooMissionMarche) return;
  var Q = [
    { q: "Hello! How much is this bag?", kw: /price|franc|thousand|hundred|cost|\d/i, m: "It is five thousand francs." },
    { q: "That is too expensive. Can you lower the price?", kw: /ok|okay|better|discount|lower|price|francs|\d/i, m: "Okay, four thousand francs for you." },
    { q: "How many do you have?", kw: /have|piece|kilo|bag|stock|\d/i, m: "I have twenty pieces." },
    { q: "Do you accept Wave or cash?", kw: /wave|cash|orange|mobile|yes|both/i, m: "Yes, I accept Wave and cash." },
    { q: "Can I pay later?", kw: /no|sorry|today|now|cannot|can't|not/i, m: "Sorry, you pay today, please." }
  ];

  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mmo{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mmo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mmo .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mmo .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mmo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mmo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mmo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mmo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mmo .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mmo .m.on{animation:mmp 1s infinite}@keyframes mmp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mmo .ok{color:#25D366}#mmo .or{color:#FFAA3C}" +
    "#mm-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mm-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mmo")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mmo";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🛒 Négocier au marché · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mm-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mm-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mm-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mm-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mm-skip" type="button">Passer</button>' +
        '<button class="b3" id="mm-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mm-r"), mic = document.getElementById("mm-mic"), nx = document.getElementById("mm-next");
      document.getElementById("mm-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mm-x").onclick = function () { o.remove(); };
      document.getElementById("mm-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["vendeur-marche"]) BADGES["vendeur-marche"] = { icon: "🛒", label: "Vendeur de marché", desc: "Négociation réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("vendeur-marche"); } catch (e) {}
      }
      noter("mission_marche", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🛒 Mission marché</div><div class="q">' + (ok ? "Vente conclue ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Vendeur de marché » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Achats & argent et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mm-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mm-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mm-x2" type="button">Fermer</button>';
      document.getElementById("mm-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mm-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mm-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma négociation au marché en anglais sur Diisoo 🛒 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mm-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "market") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mm-btn";
    b.innerHTML = '<span style="font-size:22px">🛒</span><span>Mission : négocier au marché<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionMarche = { ouvrir: ouvrir };
  if (/[?&]mission=marche/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-marche.js",e);}

try{
/* ---- diisoo-mission-voyage.js ---- */
/* diisoo-mission-voyage.js v1 : Mission « Voyager seul »
   L'app joue l'agent de l'aeroport (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Voyage & transport » (Anglais). Essai : https://diisoo.sn/?mission=voyage */
(function () {
  "use strict";
  if (window.DiisooMissionVoyage) return;
  var Q = [
    { q: "Where are you flying to?", kw: /paris|dakar|france|flying|going|travel|fly|to |\w{4,}/i, m: "I am flying to Paris." },
    { q: "May I see your passport and ticket?", kw: /here|passport|ticket|sure|yes|of course/i, m: "Yes, here is my passport and my ticket." },
    { q: "How many bags do you have?", kw: /one|two|three|bag|suitcase|\d/i, m: "I have one suitcase." },
    { q: "Do you want a window or an aisle seat?", kw: /window|aisle/i, m: "A window seat, please." },
    { q: "Your flight is delayed one hour. What do you do?", kw: /wait|ok|okay|thank|coffee|sit|fine/i, m: "Okay, I will wait. Thank you." }
  ];


  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mvyo{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mvyo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mvyo .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mvyo .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mvyo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mvyo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mvyo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mvyo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mvyo .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mvyo .m.on{animation:mvyp 1s infinite}@keyframes mvyp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mvyo .ok{color:#25D366}#mvyo .or{color:#FFAA3C}" +
    "#mvy-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mvy-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mvyo")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mvyo";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">✈️ Voyager seul · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mvy-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mvy-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mvy-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mvy-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mvy-skip" type="button">Passer</button>' +
        '<button class="b3" id="mvy-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mvy-r"), mic = document.getElementById("mvy-mic"), nx = document.getElementById("mvy-next");
      document.getElementById("mvy-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mvy-x").onclick = function () { o.remove(); };
      document.getElementById("mvy-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["voyageur-confirme"]) BADGES["voyageur-confirme"] = { icon: "✈️", label: "Voyageur confirmé", desc: "Voyage réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("voyageur-confirme"); } catch (e) {}
      }
      noter("mission_voyage", score + "/" + Q.length);
      o.innerHTML = '<div class="k">✈️ Mission voyage</div><div class="q">' + (ok ? "Bon voyage ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Voyageur confirmé » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Voyage & transport et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mvy-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mvy-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mvy-x2" type="button">Fermer</button>';
      document.getElementById("mvy-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mvy-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mvy-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon voyage à l'aéroport en anglais sur Diisoo ✈️ (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mvy-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "travel") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mvy-btn";
    b.innerHTML = '<span style="font-size:22px">✈️</span><span>Mission : voyager seul<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionVoyage = { ouvrir: ouvrir };
  if (/[?&]mission=voyage/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-voyage.js",e);}

try{
/* ---- diisoo-mission-presentation.js ---- */
/* diisoo-mission-presentation.js v1 : Mission « Se présenter à un inconnu »
   L'app joue la personne que tu rencontres (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Se présenter » (Anglais). Essai : https://diisoo.sn/?mission=presentation */
(function () {
  "use strict";
  if (window.DiisooMissionPresentation) return;
  var Q = [
    { q: "Hello! What is your name?", kw: /name|i am|i'm|my/i, m: "My name is Babacar. Nice to meet you." },
    { q: "Where are you from?", kw: /senegal|thi[eè]s|dakar|from|come/i, m: "I am from Thiès, in Senegal." },
    { q: "What do you do?", kw: /work|sell|student|farmer|business|agency|trader|teacher|driver/i, m: "I work in a travel agency." },
    { q: "Are you here for business or holiday?", kw: /business|holiday|visit|work|vacation|trip/i, m: "I am here for business." },
    { q: "Can I have your WhatsApp number?", kw: /yes|sure|of course|number|here|ok|okay/i, m: "Yes, sure. Here is my number." }
  ];



  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mpo{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mpo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mpo .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mpo .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mpo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mpo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mpo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mpo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mpo .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mpo .m.on{animation:mpp 1s infinite}@keyframes mpp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mpo .ok{color:#25D366}#mpo .or{color:#FFAA3C}" +
    "#mp-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mp-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mpo")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mpo";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🤝 Se présenter à un inconnu · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mp-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mp-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mp-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mp-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mp-skip" type="button">Passer</button>' +
        '<button class="b3" id="mp-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mp-r"), mic = document.getElementById("mp-mic"), nx = document.getElementById("mp-next");
      document.getElementById("mp-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mp-x").onclick = function () { o.remove(); };
      document.getElementById("mp-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["bonne-presentation"]) BADGES["bonne-presentation"] = { icon: "🤝", label: "Bonne présentation", desc: "Présentation réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("bonne-presentation"); } catch (e) {}
      }
      noter("mission_presentation", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🤝 Mission présentation</div><div class="q">' + (ok ? "Belle rencontre ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Bonne présentation » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Se présenter et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mp-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mp-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mp-x2" type="button">Fermer</button>';
      document.getElementById("mp-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mp-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mp-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma présentation en anglais sur Diisoo 🤝 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mp-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "intro") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mp-btn";
    b.innerHTML = '<span style="font-size:22px">🤝</span><span>Mission : se présenter<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionPresentation = { ouvrir: ouvrir };
  if (/[?&]mission=presentation/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-presentation.js",e);}

try{
/* ---- diisoo-mission-famille.js ---- */
/* diisoo-mission-famille.js v1 : Mission « Parler de sa famille »
   L'app joue un ami (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Famille » (Anglais). Essai : https://diisoo.sn/?mission=famille */
(function () {
  "use strict";
  if (window.DiisooMissionFamille) return;
  var Q = [
    { q: "Do you have a big family?", kw: /yes|no|big|small|family|brother|sister/i, m: "Yes, I have a big family." },
    { q: "How many children do you have?", kw: /one|two|three|four|children|none|son|daughter|no |\d/i, m: "I have two children, a son and a daughter." },
    { q: "Where do your parents live?", kw: /live|thi[eè]s|dakar|senegal|village|home|here/i, m: "My parents live in Thiès." },
    { q: "What does your mother do?", kw: /cook|sell|work|farmer|nurse|teacher|trader|housewife|home/i, m: "My mother is a trader." },
    { q: "Do you miss your family?", kw: /yes|miss|call|often|sometimes|very much/i, m: "Yes, I miss them. I call them every week." }
  ];




  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mfo{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mfo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mfo .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mfo .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mfo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mfo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mfo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mfo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mfo .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mfo .m.on{animation:mfp 1s infinite}@keyframes mfp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mfo .ok{color:#25D366}#mfo .or{color:#FFAA3C}" +
    "#mf-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mf-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mfo")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mfo";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">👨‍👩‍👧 Parler de sa famille · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mf-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mf-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mf-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mf-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mf-skip" type="button">Passer</button>' +
        '<button class="b3" id="mf-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mf-r"), mic = document.getElementById("mf-mic"), nx = document.getElementById("mf-next");
      document.getElementById("mf-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mf-x").onclick = function () { o.remove(); };
      document.getElementById("mf-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["famille-unie"]) BADGES["famille-unie"] = { icon: "👨‍👩‍👧", label: "Famille unie", desc: "Famille présentée à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("famille-unie"); } catch (e) {}
      }
      noter("mission_famille", score + "/" + Q.length);
      o.innerHTML = '<div class="k">👨‍👩‍👧 Mission famille</div><div class="q">' + (ok ? "Belle famille ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Famille unie » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Famille et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mf-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mf-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mf-x2" type="button">Fermer</button>';
      document.getElementById("mf-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mf-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mf-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma famille en anglais sur Diisoo 👨‍👩‍👧 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComfonent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mf-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "family") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mf-btn";
    b.innerHTML = '<span style="font-size:22px">👨‍👩‍👧</span><span>Mission : parler de sa famille<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionFamille = { ouvrir: ouvrir };
  if (/[?&]mission=famille/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-famille.js",e);}

try{
/* ---- diisoo-mission-emploi.js ---- */
/* diisoo-mission-emploi.js v1 : Mission « Entretien d’embauche »
   L'app joue l'employeur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Travail & routine » (Anglais). Essai : https://diisoo.sn/?mission=emploi */
(function () {
  "use strict";
  if (window.DiisooMissionEmploi) return;
  var Q = [
    { q: "Tell me about yourself.", kw: /my name|i am|i'm|i work|i have|i live|years/i, m: "My name is Babacar. I am thirty years old and I work in a travel agency." },
    { q: "Why do you want this job?", kw: /want|like|need|learn|because|love|good|experience/i, m: "I want this job because I like helping customers." },
    { q: "Do you have experience?", kw: /yes|year|experience|worked|work|no |some/i, m: "Yes, I have five years of experience." },
    { q: "What are your strengths?", kw: /hard|honest|team|fast|reliable|work|strong|good|serious|punctual/i, m: "I am a hard worker and I am honest." },
    { q: "When can you start?", kw: /tomorrow|monday|next|now|week|today|soon|day/i, m: "I can start tomorrow." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#meo{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#meo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#meo .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#meo .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#meo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#meo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#meo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#meo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#meo .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#meo .m.on{animation:mep 1s infinite}@keyframes mep{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#meo .ok{color:#25D366}#meo .or{color:#FFAA3C}" +
    "#me-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#me-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("meo")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "meo";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">💼 Entretien d’embauche · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="me-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="me-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="me-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="me-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="me-skip" type="button">Passer</button>' +
        '<button class="b3" id="me-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("me-r"), mic = document.getElementById("me-mic"), nx = document.getElementById("me-next");
      document.getElementById("me-ec").onclick = function () { parler(cur.q); };
      document.getElementById("me-x").onclick = function () { o.remove(); };
      document.getElementById("me-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["pret-travailler"]) BADGES["pret-travailler"] = { icon: "💼", label: "Prêt à travailler", desc: "Entretien d’embauche réussi à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("pret-travailler"); } catch (e) {}
      }
      noter("mission_emploi", score + "/" + Q.length);
      o.innerHTML = '<div class="k">💼 Mission emploi</div><div class="q">' + (ok ? "Embauché ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Prêt à travailler » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Travail & routine et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="me-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="me-re" type="button">Réessayer</button>') +
        '<button class="b3" id="me-x2" type="button">Fermer</button>';
      document.getElementById("me-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("me-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("me-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi mon entretien en anglais sur Diisoo 💼 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("me-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "work") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "me-btn";
    b.innerHTML = '<span style="font-size:22px">💼</span><span>Mission : entretien d’embauche<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionEmploi = { ouvrir: ouvrir };
  if (/[?&]mission=emploi/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-emploi.js",e);}

try{
/* ---- diisoo-mission-sante.js ---- */
/* diisoo-mission-sante.js v1 : Mission « Chez le médecin »
   L'app joue le médecin (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Santé & urgences » (Anglais). Essai : https://diisoo.sn/?mission=sante */
(function () {
  "use strict";
  if (window.DiisooMissionSante) return;
  var Q = [
    { q: "Good morning. What is the problem?", kw: /pain|hurt|ache|sick|fever|cough|head|stomach|have|feel/i, m: "I have a stomach ache and a fever." },
    { q: "Where does it hurt?", kw: /here|head|stomach|chest|back|leg|arm|hurt|my/i, m: "It hurts here, in my stomach." },
    { q: "How long have you been sick?", kw: /day|days|week|since|yesterday|hour|night|morning/i, m: "I have been sick for three days." },
    { q: "Are you allergic to any medicine?", kw: /yes|no|allergic|penicillin|not|none/i, m: "No, I am not allergic to any medicine." },
    { q: "Take this medicine twice a day. Do you understand?", kw: /yes|ok|okay|understand|thank|twice|sure/i, m: "Yes, I understand. Thank you, doctor." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#msa{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#msa .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#msa .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#msa .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#msa button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#msa .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#msa .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#msa .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#msa .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#msa .m.on{animation:msp 1s infinite}@keyframes msp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#msa .ok{color:#25D366}#msa .or{color:#FFAA3C}" +
    "#ms-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#ms-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("msa")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "msa";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🩺 Consultation · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="ms-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="ms-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="ms-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="ms-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="ms-skip" type="button">Passer</button>' +
        '<button class="b3" id="ms-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("ms-r"), mic = document.getElementById("ms-mic"), nx = document.getElementById("ms-next");
      document.getElementById("ms-ec").onclick = function () { parler(cur.q); };
      document.getElementById("ms-x").onclick = function () { o.remove(); };
      document.getElementById("ms-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["pret-urgence"]) BADGES["pret-urgence"] = { icon: "🩺", label: "Prêt pour l’urgence", desc: "Consultation médicale réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("pret-urgence"); } catch (e) {}
      }
      noter("mission_sante", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🩺 Mission santé</div><div class="q">' + (ok ? "Bien soigné ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Prêt pour l’urgence » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Santé & urgences et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="ms-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="ms-re" type="button">Réessayer</button>') +
        '<button class="b3" id="ms-x2" type="button">Fermer</button>';
      document.getElementById("ms-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("ms-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("ms-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma consultation médicale en anglais sur Diisoo 🩺 (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("ms-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "health") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "ms-btn";
    b.innerHTML = '<span style="font-size:22px">🩺</span><span>Mission : chez le médecin<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionSante = { ouvrir: ouvrir };
  if (/[?&]mission=sante/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-sante.js",e);}

try{
/* ---- diisoo-mission-nourriture.js ---- */
/* diisoo-mission-nourriture.js v1 : Mission « Au restaurant »
   L'app joue le serveur (voix), la personne repond a voix haute (micro). 5 questions, 4 bonnes reponses sur 5 = badge « Entretien reussi ».
   Bouton place en haut du theme « Nourriture » (Anglais). Essai : https://diisoo.sn/?mission=nourriture */
(function () {
  "use strict";
  if (window.DiisooMissionNourriture) return;
  var Q = [
    { q: "Good evening. What would you like?", kw: /like|want|rice|fish|chicken|please|have|eat|order/i, m: "I would like rice and fish, please." },
    { q: "Anything to drink?", kw: /water|juice|tea|coffee|drink|bissap|please|no|yes/i, m: "I would like water, please." },
    { q: "Is it spicy? Do you want it hot?", kw: /yes|no|spicy|hot|not|little|please|sure/i, m: "No, not too spicy, please." },
    { q: "Would you like dessert?", kw: /yes|no|thank|dessert|fruit|ice|cake|please|full/i, m: "No, thank you. I am full." },
    { q: "Here is the bill. How would you like to pay?", kw: /cash|wave|card|orange|pay|money|by/i, m: "I will pay by Wave, please." }
  ];





  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#mnr{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center}" +
    "#mnr .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#mnr .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#mnr .r{min-height:70px;font-size:16px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#mnr button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#mnr .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#mnr .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#mnr .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#mnr .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#mnr .m.on{animation:mnp 1s infinite}@keyframes mnp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#mnr .ok{color:#25D366}#mnr .or{color:#FFAA3C}" +
    "#mn-btn{width:100%;min-height:52px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-weight:800;font-size:14.5px;text-align:left;padding:8px 14px;display:flex;align-items:center;gap:10px}" +
    "#mn-btn small{display:block;font-size:12px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("mnr")) return;
    var i = 0, score = 0, tentative = false, enCours = false;
    var o = document.createElement("div"); o.id = "mnr";
    document.body.appendChild(o);

    function ecran() {
      var cur = Q[i];
      tentative = false;
      o.innerHTML = '<div class="k">🍽️ Restaurant · question ' + (i + 1) + '/' + Q.length + '</div>' +
        '<div class="q">' + esc(cur.q) + '</div>' +
        '<div class="r" id="mn-r">Touche le micro et réponds en anglais.</div>' +
        '<button class="m" id="mn-mic" type="button" aria-label="Répondre au micro">🎤</button>' +
        '<button class="b2" id="mn-ec" type="button">🔊 Réécouter la question</button>' +
        '<button class="b1" id="mn-next" type="button" style="display:none">Suivant</button>' +
        '<button class="b3" id="mn-skip" type="button">Passer</button>' +
        '<button class="b3" id="mn-x" type="button">Quitter la mission</button>';
      var r = document.getElementById("mn-r"), mic = document.getElementById("mn-mic"), nx = document.getElementById("mn-next");
      document.getElementById("mn-ec").onclick = function () { parler(cur.q); };
      document.getElementById("mn-x").onclick = function () { o.remove(); };
      document.getElementById("mn-skip").onclick = function () { r.innerHTML = 'Réponse possible : <b>' + esc(cur.m) + '</b>'; nx.style.display = "block"; };
      nx.onclick = function () { i++; if (i >= Q.length) fin(); else { ecran(); setTimeout(function () { parler(Q[i].q); }, 500); } };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null; try { h = startListening("en-US", 8000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.split(/\s+/).length >= 3 && cur.kw.test(t);
          if (bon) { if (!tentative) score++; tentative = true; r.innerHTML = '<span class="ok">✅ Très bien !</span><br>« ' + esc(t) + ' »'; nx.style.display = "block"; }
          else { tentative = true; r.innerHTML = '<span class="or">Pas tout à fait.</span> « ' + esc(t) + ' »<br>Exemple : <b>' + esc(cur.m) + '</b><br>Réessaie, ou touche Suivant.'; nx.style.display = "block"; }
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
    }

    function fin() {
      var ok = score >= 4;
      if (ok) {
        try { if (typeof BADGES !== "undefined" && !BADGES["pret-commander"]) BADGES["pret-commander"] = { icon: "🍽️", label: "Prêt à commander", desc: "Commande au restaurant réussie à l'oral" }; } catch (e) {}
        try { if (typeof awardBadge === "function") awardBadge("pret-commander"); } catch (e) {}
      }
      noter("mission_nourriture", score + "/" + Q.length);
      o.innerHTML = '<div class="k">🍽️ Mission restaurant</div><div class="q">' + (ok ? "Bon appétit ! 🎉" : "Pas encore…") + '</div>' +
        '<div class="r">' + (ok ? 'Score : <b class="ok">' + score + '/' + Q.length + '</b><br>Badge « Prêt à commander » débloqué.' : 'Score : <b class="or">' + score + '/' + Q.length + '</b><br>Il faut 4 sur 5. Révise les phrases du thème Nourriture et réessaie.') + '</div>' +
        (ok ? '<button class="b1" id="mn-sh" type="button">Partager sur WhatsApp</button>' : '<button class="b1" id="mn-re" type="button">Réessayer</button>') +
        '<button class="b3" id="mn-x2" type="button">Fermer</button>';
      document.getElementById("mn-x2").onclick = function () { o.remove(); };
      var re = document.getElementById("mn-re"); if (re) re.onclick = function () { o.remove(); ouvrir(); };
      var sh = document.getElementById("mn-sh");
      if (sh) sh.onclick = function () {
        var t = "J'ai réussi ma commande au restaurant en anglais sur Diisoo 🍽️ (" + score + "/" + Q.length + "). Teste-toi, c'est gratuit : https://diisoo.sn/?source=mission";
        noter("mission_partage");
        try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (e) {}
        window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
      };
    }
    noter("mission_vue");
    ecran();
    setTimeout(function () { parler(Q[0].q); }, 600);
  }

  function monter() {
    var box = document.getElementById("general-content");
    if (!box || document.getElementById("mn-btn")) return;
    var id = ""; try { id = generalThemeId; } catch (e) {}
    if (id !== "food") return;
    var b = document.createElement("button"); b.type = "button"; b.id = "mn-btn";
    b.innerHTML = '<span style="font-size:22px">🍽️</span><span>Mission : au restaurant<small>5 questions à voix haute, badge à la clé</small></span>';
    b.onclick = ouvrir;
    box.insertBefore(b, box.firstChild);
  }
  try {
    var box0 = document.getElementById("general-content");
    if (box0) new MutationObserver(function () { try { monter(); } catch (e) {} }).observe(box0, { childList: true });
  } catch (e) {}
  setInterval(function () { try { monter(); } catch (e) {} }, 1500);
  window.DiisooMissionNourriture = { ouvrir: ouvrir };
  if (/[?&]mission=nourriture/.test(location.search)) setTimeout(ouvrir, 3000);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-mission-nourriture.js",e);}

try{
/* ---- diisoo-installer.js ---- */
/* diisoo-installer.js v1 : installer Diisoo comme une vraie application, en un geste
   - Carte claire "Mets Diisoo sur ton telephone" (apres un premier exercice, une fois par semaine au maximum)
   - Android / Chrome / Samsung Internet : un seul bouton, la fenetre d'installation du telephone s'ouvre
   - iPhone / Safari : 3 etapes illustrees (Partager, Sur l'ecran d'accueil, Ajouter)
   - Jamais affichee si l'app est deja installee */
(function () {
  "use strict";
  var CLE = "diisoo_install_plus";
  function dejaInstallee() { return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true; }
  var iOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  var promptEvt = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); promptEvt = e; });
  window.addEventListener("appinstalled", function () { promptEvt = null; fermer(); try { localStorage.setItem(CLE, "9999999999999"); } catch (x) {} });

  var st = document.createElement("style");
  st.textContent =
    "#dii-inst{position:fixed;inset:0;z-index:9991;background:rgba(5,8,16,.86);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-inst .in-box{width:100%;max-width:480px;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px 22px 0 0;padding:20px 16px 26px;color:#F6F1E7;text-align:center}" +
    "#dii-inst .in-ic{width:72px;height:72px;border-radius:18px;margin:0 auto 8px;display:block}" +
    "#dii-inst h3{font-size:19px;font-weight:800;margin:0 0 4px}" +
    "#dii-inst p{font-size:13px;color:#A69C86;margin:0 0 12px}" +
    "#dii-inst .in-liste{text-align:left;margin:8px 0 14px}" +
    "#dii-inst .in-l{display:flex;align-items:center;gap:12px;background:#141A2B;border:1px solid #1E2740;border-radius:14px;padding:10px 12px;margin-bottom:8px;font-size:14px;font-weight:700}" +
    "#dii-inst .in-l b{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#25D366;color:#fff;flex:0 0 auto}" +
    "#dii-inst .in-l span{font-size:22px;margin-left:auto}" +
    "#dii-inst .in-ok{width:100%;min-height:56px;border-radius:999px;border:0;background:#25D366;color:#fff;font-size:16px;font-weight:800}" +
    "#dii-inst .in-no{width:100%;min-height:44px;margin-top:6px;background:none;border:0;color:#A69C86;font-size:13px}";
  document.head.appendChild(st);

  function fermer() { var e = document.getElementById("dii-inst"); if (e) e.remove(); }
  function repousser(jours) { try { localStorage.setItem(CLE, String(Date.now() + jours * 86400000)); } catch (e) {} }

  function ouvrir() {
    if (document.getElementById("dii-inst") || dejaInstallee()) return;
    var ov = document.createElement("div"); ov.id = "dii-inst";
    var h = '<div class="in-box"><img class="in-ic" src="icon-192.png" alt="Diisoo"><h3>📲 Mets Diisoo sur ton téléphone</h3>';
    if (iOS) {
      h += '<p>Comme une vraie application, sans magasin d\'applications. 3 gestes :</p><div class="in-liste">' +
        '<div class="in-l"><b>1</b>Touche « Partager » en bas de Safari<span>⬆️</span></div>' +
        '<div class="in-l"><b>2</b>Choisis « Sur l\'écran d\'accueil »<span>➕</span></div>' +
        '<div class="in-l"><b>3</b>Touche « Ajouter »<span>✅</span></div></div>' +
        '<button type="button" class="in-ok" id="in-fait">J\'ai compris</button>';
    } else if (promptEvt) {
      h += '<p>Ouvre Diisoo en un geste, même sans connexion, sans chercher dans Google.</p>' +
        '<button type="button" class="in-ok" id="in-go">📲 Installer Diisoo</button>';
    } else {
      h += '<p>Comme une vraie application. 2 gestes :</p><div class="in-liste">' +
        '<div class="in-l"><b>1</b>Touche le menu du navigateur<span>⋮</span></div>' +
        '<div class="in-l"><b>2</b>Choisis « Installer l\'application » ou « Ajouter à l\'écran d\'accueil »<span>✅</span></div></div>' +
        '<button type="button" class="in-ok" id="in-fait">J\'ai compris</button>';
    }
    h += '<button type="button" class="in-no" id="in-plus">Plus tard</button></div>';
    ov.innerHTML = h; document.body.appendChild(ov);
    var go = document.getElementById("in-go");
    if (go) go.onclick = function () {
      var e = promptEvt; if (!e) { fermer(); return; }
      try { e.prompt(); e.userChoice.then(function (r) { if (r && r.outcome !== "accepted") repousser(7); }); } catch (x) {}
      promptEvt = null; fermer();
    };
    var fait = document.getElementById("in-fait"); if (fait) fait.onclick = function () { repousser(30); fermer(); };
    document.getElementById("in-plus").onclick = function () { repousser(7); fermer(); };
  }

  function pret() {
    if (dejaInstallee()) return false;
    var t = 0; try { t = +localStorage.getItem(CLE) || 0; } catch (e) {}
    if (Date.now() < t) return false;
    var d = document.getElementById("screen-dashboard");
    if (!d || d.offsetParent === null) return false;
    if (document.getElementById("dii-obj") || document.getElementById("dii-passage")) return false;
    var g = null; try { g = JSON.parse(localStorage.getItem("diisoo_goal") || "null"); } catch (e) {}
    return !!(g && g.done >= 1) && !!localStorage.getItem("diisoo_obj");
  }
  /* Apres le premier exercice ET l'objectif fixe : c'est le bon moment */
  setInterval(function () { if (pret()) ouvrir(); }, 5000);

  window.DiisooInstaller = { version: 1, ouvrir: ouvrir };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-installer.js",e);}

try{
/* ---- diisoo-assistant.js ---- */
/* diisoo-assistant.js v1 : assistant d'equivalences dans les lecons
   Sous chaque mot ou phrase d'anglais (Anglais general, Business), un bouton « 💡 Autre façon de le dire » :
   - des equivalents : plus poli, plus simple, plus courant (regles et synonymes courants)
   - des phrases de la meme situation qui utilisent le meme mot
   Chaque proposition se lit a voix haute (🔊). Rien n'est affiche s'il n'y a rien d'utile a ajouter.
   Fonctionne sans connexion : aucune requete reseau. */
(function () {
  "use strict";

  /* ---------- equivalents ---------- */
  var REGLES = [
    [/^I want to (.+?)([.!?]?)$/i, function (m) { return [["I would like to " + m[1] + m[2], "Plus poli"]]; }],
    [/^I want (a |an |the |some )?(.+?)([.!?]?)$/i, function (m) { return [["I would like " + (m[1] || "") + m[2] + m[3], "Plus poli"]]; }],
    [/^I need (.+?)([.!?]?)$/i, function (m) { return [["I am looking for " + m[1] + m[2], "Plus courant au magasin"], ["I would like " + m[1] + m[2], "Plus poli"]]; }],
    [/^Can I (.+?)\?$/i, function (m) { return [["May I " + m[1] + "?", "Plus formel"], ["Could I " + m[1] + "?", "Plus poli"]]; }],
    [/^Can you (.+?)\?$/i, function (m) { return [["Could you " + m[1] + "?", "Plus poli"], ["Would you mind helping me to " + m[1] + "?", "Très poli"]]; }],
    [/^How much is (it|this|that)\?$/i, function () { return [["What is the price?", "Autre façon de demander le prix"], ["How much does it cost?", "Même sens"]]; }],
    [/^How much is (.+?)\?$/i, function (m) { return [["What is the price of " + m[1] + "?", "Autre façon de demander le prix"], ["How much does " + m[1] + " cost?", "Même sens"]]; }],
    [/^Where is (.+?)\?$/i, function (m) { return [["Could you tell me where " + m[1] + " is?", "Plus poli"], ["Do you know where " + m[1] + " is?", "Plus courant"]]; }],
    [/^Do you have (.+?)\?$/i, function (m) { return [["Is there " + m[1] + " available?", "Plus formel"], ["Have you got " + m[1] + "?", "Anglais britannique"]]; }],
    [/^I am from (.+?)([.!?]?)$/i, function (m) { return [["I come from " + m[1] + m[2], "Même sens"]]; }],
    [/^My name is (.+?)([.!?]?)$/i, function (m) { return [["I am " + m[1] + m[2], "Plus court"], ["Call me " + m[1] + m[2], "Plus amical"]]; }],
    [/^Thank you( very much)?([.!?]?)$/i, function () { return [["Thanks a lot!", "Plus amical"], ["I really appreciate it.", "Plus fort"]]; }],
    [/^You are welcome([.!?]?)$/i, function () { return [["No problem!", "Plus amical"], ["My pleasure.", "Plus poli"]]; }],
    [/^Nice to meet you([.!?]?)$/i, function () { return [["Pleased to meet you.", "Plus formel"]]; }],
    [/^I do not understand([.!?]?)$/i, function () { return [["Could you repeat that, please?", "Plus utile pour continuer"], ["Sorry, I did not catch that.", "Plus courant"]]; }],
    [/^That is too expensive([.!?]?)$/i, function () { return [["That is a bit pricey.", "Plus doux"], ["Can you give me a better price?", "Pour négocier"]]; }],
    [/^I will take it([.!?]?)$/i, function () { return [["I will buy it.", "Plus simple"], ["I will have it.", "Plus courant"]]; }],
    [/^I have a reservation([.!?]?)$/i, function () { return [["I booked a room.", "Plus simple"]]; }],
    [/^Excuse me(,)? (.+)$/i, function (m) { return [["Sorry to bother you, " + m[2].charAt(0).toLowerCase() + m[2].slice(1), "Plus poli"]]; }]
  ];
  var SYN = {
    cheap: ["inexpensive", "Plus formel"], expensive: ["pricey", "Plus courant"], big: ["large", "Plus formel"],
    small: ["little", "Plus simple"], buy: ["purchase", "Plus formel"], start: ["begin", "Plus formel"],
    help: ["assist", "Plus formel"], ask: ["request", "Plus formel"], fast: ["quick", "Même sens"],
    beautiful: ["lovely", "Plus courant"], delicious: ["tasty", "Plus simple"], hello: ["hi", "Plus amical"],
    goodbye: ["see you later", "Plus amical"], yes: ["of course", "Plus fort"], house: ["home", "Plus chaleureux"],
    car: ["vehicle", "Plus formel"], money: ["cash", "Plus précis"], job: ["work", "Plus simple"],
    tired: ["exhausted", "Plus fort"], happy: ["glad", "Plus simple"], hungry: ["starving", "Plus fort"],
    friend: ["buddy", "Plus amical"], shop: ["store", "Américain"], boss: ["manager", "Plus formel"],
    problem: ["issue", "Plus formel"], price: ["cost", "Même sens"], order: ["request", "Même sens"],
    near: ["close", "Même sens"], far: ["distant", "Plus formel"], wrong: ["incorrect", "Plus formel"]
  };

  function equivalents(en) {
    var out = [], t = String(en || "").trim();
    for (var i = 0; i < REGLES.length; i++) {
      var m = REGLES[i][0].exec(t);
      if (m) { out = out.concat(REGLES[i][1](m)); break; }
    }
    var mot = t.toLowerCase().replace(/[^a-z]/g, "");
    if (!out.length && SYN[mot]) out.push([SYN[mot][0].charAt(0).toUpperCase() + SYN[mot][0].slice(1), SYN[mot][1]]);
    return out.filter(function (x) { return x[0].toLowerCase() !== t.toLowerCase(); }).slice(0, 2);
  }

  /* ---------- phrases de la meme situation ---------- */
  var STOP = /^(the|and|you|are|was|for|with|have|this|that|what|your|from|please|would|could|there|will|can|how|not|but|any|our|its|his|her|she|him|they|them|who|why|may)$/;
  function motsCles(s) {
    return String(s || "").toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter(function (w) { return w.length > 3 && !STOP.test(w); });
  }
  function voisines(item, banque, deja) {
    var ks = motsCles(item.en), out = [];
    if (!ks.length) return out;
    banque.forEach(function (x) {
      if (!x || !x.en || x.en === item.en || deja[x.en]) return;
      var kx = motsCles(x.en), commun = ks.filter(function (k) { return kx.indexOf(k) > -1; }).length;
      if (commun) { out.push({ en: x.en, fr: x.fr || "", n: commun }); deja[x.en] = 1; }
    });
    out.sort(function (a, b) { return b.n - a.n || a.en.length - b.en.length; });
    return out.slice(0, 2);
  }

  /* ---------- source de chaque carte ---------- */
  function sourceDe(card) {
    var b = card.querySelector("[data-practice]");
    var bl = card.querySelector("[data-practice^='gen-l:']");
    try {
      if (bl) {
        var p = bl.dataset.practice.split(":"), th = GENERAL_THEMES.filter(function (t) { return t.id === p[1]; })[0];
        if (!th) return null;
        var banque = (th.vocab || []).concat((th.dialogue || []).map(function (d) { return { en: d.en, fr: d.fr }; }));
        return { item: th.vocab[+p[2]], banque: banque };
      }
      var bb = card.querySelector("[data-practice^='biz:']");
      if (bb) {
        var q = bb.dataset.practice.split(":"), mod = CHINA_TRADE_WOLOF[q[1]];
        var dl = (BUSINESS_DIALOGUES[q[1]] || []).map(function (d) { return { en: d.en, fr: d.fr }; });
        return { item: mod.vocab[+q[2]], banque: mod.vocab.concat(dl) };
      }
    } catch (e) {}
    void b;
    return null;
  }

  /* ---------- interface ---------- */
  var st = document.createElement("style");
  st.textContent =
    ".as-btn{width:100%;min-height:44px;margin-top:8px;border-radius:14px;background:#1A1530;border:1px solid #5B3FA0;color:#C9B6F2;font-size:12px;font-weight:700}" +
    ".as-box{margin-top:8px;display:flex;flex-direction:column;gap:6px}" +
    ".as-l{display:flex;align-items:center;gap:10px;background:#141A2B;border:1px solid #1E2740;border-radius:12px;padding:8px 10px}" +
    ".as-t{flex:1;font-size:13px;font-weight:700;color:#F6F1E7;line-height:1.25}" +
    ".as-t small{display:block;font-size:11px;font-weight:400;color:#A69C86;margin-top:1px}" +
    ".as-s{flex:0 0 auto;width:44px;height:44px;border-radius:50%;background:#25D366;border:0;color:#fff;font-size:18px}" +
    ".as-h{font-size:11px;font-weight:700;color:#8C8064;text-transform:uppercase;letter-spacing:.06em;margin-top:4px}";
  document.head.appendChild(st);

  function ligne(en, note) {
    var d = document.createElement("div"); d.className = "as-l";
    var t = document.createElement("div"); t.className = "as-t";
    t.textContent = en;
    if (note) { var s = document.createElement("small"); s.textContent = note; t.appendChild(s); }
    var b = document.createElement("button"); b.type = "button"; b.className = "as-s"; b.textContent = "🔊";
    b.setAttribute("aria-label", "Écouter : " + en);
    b.onclick = function (ev) { ev.stopPropagation(); try { speak(en, "en-US", 0.85); } catch (e) {} };
    d.appendChild(t); d.appendChild(b);
    return d;
  }

  function equiper(card) {
    if (card.__as) return;
    var src = sourceDe(card);
    if (!src || !src.item) return;
    card.__as = true;
    var eq = equivalents(src.item.en);
    var deja = {}; deja[src.item.en] = 1;
    eq.forEach(function (x) { deja[x[0]] = 1; });
    var vo = voisines(src.item, src.banque || [], deja);
    if (!eq.length && !vo.length) return;
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "as-btn"; btn.textContent = "💡 Autre façon de le dire";
    var box = document.createElement("div"); box.className = "as-box"; box.style.display = "none";
    if (eq.length) {
      var h1 = document.createElement("div"); h1.className = "as-h"; h1.textContent = "Même idée"; box.appendChild(h1);
      eq.forEach(function (x) { box.appendChild(ligne(x[0], x[1])); });
    }
    if (vo.length) {
      var h2 = document.createElement("div"); h2.className = "as-h"; h2.textContent = "Dans la même situation"; box.appendChild(h2);
      vo.forEach(function (x) { box.appendChild(ligne(x.en, x.fr)); });
    }
    btn.onclick = function () {
      var ouvert = box.style.display !== "none";
      box.style.display = ouvert ? "none" : "flex";
      btn.textContent = ouvert ? "💡 Autre façon de le dire" : "💡 Masquer";
    };
    var grille = card.querySelector(".grid") || card.lastElementChild;
    if (grille && grille.parentNode === card) card.insertBefore(btn, grille.nextSibling); else card.appendChild(btn);
    card.insertBefore(box, btn.nextSibling);
  }

  var plan = false;
  function balayer() {
    if (plan) return; plan = true;
    requestAnimationFrame(function () {
      plan = false;
      ["general-content", "business-content"].forEach(function (id) {
        var r = document.getElementById(id); if (!r) return;
        var bs = r.querySelectorAll("[data-practice^='gen-l:'], [data-practice^='biz:']");
        for (var i = 0; i < bs.length; i++) {
          var card = bs[i].closest(".rounded-2xl, .rounded-xl, .fx-em") || bs[i].parentNode.parentNode;
          if (card) equiper(card);
        }
      });
    });
  }
  try { new MutationObserver(balayer).observe(document.body, { childList: true, subtree: true }); balayer(); } catch (e) {}

  window.DiisooAssistant = { version: 1, equivalents: equivalents };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-assistant.js",e);}

try{
/* ---- diisoo-coach2.js ---- */
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

}catch(e){console.error("Diisoo : erreur dans diisoo-coach2.js",e);}

try{
/* ---- diisoo-parrainage.js ---- */
/* diisoo-parrainage.js v1 : parrainage plus parlant
   - Carte d'accueil : barre de progression vers 3 amis (1 mois Premium) puis 10 amis (Pack Commerçants)
   - Partage en un geste (menu de partage du téléphone, sinon WhatsApp), message adapté à l'objectif et à la série
   - Ami invité : message d'accueil « un ami t'invite », qui explique que son premier exercice récompense son parrain
   - Palier atteint : bouton « Réclamer ma récompense » qui ouvre WhatsApp avec un message prêt (code + numéro)
   S'appuie sur le système existant (monCodeRef, compter_parrainages, valider au premier exercice). Aucune table en plus. */
(function () {
  "use strict";

  var WA = "221772882109";
  function $(id) { return document.getElementById(id); }
  function lire(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function code() { try { return monCodeRef(); } catch (e) { return lire("diisoo_ref_code", ""); } }
  function nb() { return lire("diisoo_ref_nb", 0) | 0; }

  /* ---------- partage en un geste ---------- */
  var PHRASE = {
    visa: "pour préparer son visa et son examen d'anglais",
    business: "pour l'anglais du commerce et des affaires",
    tourisme: "pour parler anglais avec les touristes",
    wolof: "pour apprendre le wolof et l'anglais"
  };
  function message() {
    var o = lire("diisoo_obj", null), s = lire("diisoo_streak", null);
    var jours = s && typeof s === "object" ? (s.count || s.n || 0) : (+s || 0);
    var but = o && PHRASE[o.but] ? PHRASE[o.but] : "pour apprendre l'anglais et le wolof avec la voix";
    var deb = jours > 1 ? "🔥 " + jours + " jours d'affilée sur Diisoo, l'application " + but + ". " : "Je te recommande Diisoo, l'application " + but + ". ";
    return deb + "C'est gratuit, ça marche sur téléphone : https://diisoo.sn/?ref=" + code();
  }
  window.partagerDiisoo = function () {
    var m = message();
    if (navigator.share) {
      navigator.share({ title: "Diisoo", text: m }).catch(function () {});
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(m), "_blank", "noopener");
    }
    setTimeout(function () { try { majCompteurParrainage(); } catch (e) {} }, 2000);
  };

  /* ---------- carte avec progression ---------- */
  var st = document.createElement("style");
  st.textContent =
    ".pr-b{height:8px;border-radius:99px;background:#0B0F1C;overflow:hidden;margin:6px 0 4px;position:relative}" +
    ".pr-b i{display:block;height:100%;background:linear-gradient(90deg,#3FAE74,#F3A94E);border-radius:99px;transition:width .4s}" +
    ".pr-r{display:block;width:100%;min-height:44px;margin-top:6px;border:0;border-radius:12px;background:#25D366;color:#fff;font-size:13px;font-weight:800}" +
    "#pr-accueil{position:fixed;left:12px;right:12px;bottom:12px;z-index:9985;background:#12351F;border:1px solid #3FAE74;border-radius:16px;padding:12px 14px;color:#F6F1E7;font-size:13px;line-height:1.4;box-shadow:0 8px 24px rgba(0,0,0,.5)}" +
    "#pr-accueil button{margin-top:8px;min-height:44px;width:100%;border:0;border-radius:12px;background:#25D366;color:#fff;font-weight:800;font-size:14px}";
  document.head.appendChild(st);

  function dessiner() {
    var el = $("ref-compteur");
    if (!el) return;
    var n = nb(), cible = n >= 3 ? 10 : 3, pct = Math.min(100, Math.round(n / cible * 100));
    var txt = n >= 10 ? "🎁 " + n + " amis actifs : Pack Commerçants offert !"
      : n >= 3 ? "🎁 " + n + " amis actifs : 1 mois Premium gagné. Encore " + (10 - n) + " pour le Pack Commerçants."
      : n + " / 3 amis actifs. Encore " + (3 - n) + " pour 1 mois Premium.";
    var h = '<span style="display:block">' + txt + '</span><span class="pr-b"><i style="width:' + pct + '%"></i></span>' +
      '<span style="display:block;font-size:10px;color:#A69C86;font-weight:400">Un ami compte quand il a fait son premier exercice.</span>';
    var fait = lire("diisoo_ref_reclame", 0) | 0, palier = n >= 10 ? 10 : n >= 3 ? 3 : 0;
    el.innerHTML = h;
    if (palier && fait < palier) {
      var b = document.createElement("span");
      b.className = "pr-r"; b.setAttribute("role", "button"); b.style.lineHeight = "44px"; b.style.textAlign = "center";
      b.textContent = "🎁 Activée automatiquement. Un souci ? Écris-nous";
      b.onclick = function (ev) {
        ev.stopPropagation();
        var p = lire("diisoo_profile", {}) || {};
        var m = "Bonjour Diisoo, ma récompense de parrainage n'est pas activée. J'ai invité " + n + " amis. Mon code : " + code() + (p.phone ? ". Mon numéro WhatsApp : " + p.phone : "") +
          ". Récompense attendue : " + (palier >= 10 ? "le Pack Commerçants" : "1 mois Premium") + ".";
        window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(m), "_blank", "noopener");
        ecrire("diisoo_ref_reclame", palier);
        setTimeout(dessiner, 500);
      };
      el.appendChild(b);
    }
  }

  /* chaque mise à jour du compteur existant est redessinée avec la barre */
  var orig = window.majCompteurParrainage;
  if (typeof orig === "function") {
    window.majCompteurParrainage = function () {
      var r; try { r = orig.apply(this, arguments); } catch (e) {}
      Promise.resolve(r).then(dessiner, dessiner);
      return r;
    };
  }
  try { new MutationObserver(function () { var e = $("ref-compteur"); if (e && !e.querySelector(".pr-b")) dessiner(); }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  setTimeout(dessiner, 1500);

  /* ---------- lien code -> numéro : la récompense s'accorde alors toute seule ---------- */
  function lier() {
    try {
      var pr = lire("diisoo_profile", {}) || {};
      if (!pr.phone || typeof db === "undefined" || !db || lire("diisoo_ref_lie", "") === pr.phone + code()) return;
      db.rpc("lier_code_parrain", { p_code: code(), p_whatsapp: pr.phone }).then(function (r) {
        if (r && !r.error) {
          ecrire("diisoo_ref_lie", pr.phone + code());
          try { if (typeof majStatutAcces === "function") majStatutAcces(); } catch (e) {}
        }
      }, function () {});
    } catch (e) {}
  }
  setTimeout(lier, 4000);
  window.addEventListener("online", lier);
  setInterval(function () { try { if (typeof majStatutAcces === "function" && nb() >= 3) majStatutAcces(); } catch (e) {} }, 60000);

  /* ---------- accueil de l'ami invité ---------- */
  setTimeout(function () {
    var parrain = lire("diisoo_ref_parrain", ""), vu = lire("diisoo_ref_accueil", 0);
    var ecran = $("screen-dashboard");
    if (!parrain || vu || !ecran || ecran.offsetParent === null) return;
    ecrire("diisoo_ref_accueil", 1);
    var d = document.createElement("div"); d.id = "pr-accueil";
    d.innerHTML = "🎁 <b>Un ami t'a invité sur Diisoo.</b><br>Fais ton premier exercice : cela lui compte pour sa récompense, et tu démarres ton objectif.";
    var b = document.createElement("button"); b.type = "button"; b.textContent = "C'est parti";
    b.onclick = function () { d.remove(); };
    d.appendChild(b); document.body.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.remove(); }, 15000);
  }, 5000);

  window.DiisooParrainage = { version: 1, message: message };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-parrainage.js",e);}

try{
/* ---- diisoo-oral.js ---- */
/* diisoo-oral.js v1 : analyse d'une réponse orale (sans réseau, instantanée)
   window.DiisooOral.analyser(texte, question, opts) -> { corrections:[{avant,apres,note}], conseils:[texte], exemple }
   - corrections : fautes fréquentes des francophones en anglais (I am agree, since 3 years, she have...)
   - conseils : phrase complète, début de phrase attendu, oui/non, liens entre idées (because, and, but), nombre de questions posées
   Utilisé par diisoo-exams2.js après chaque réponse. Les règles se complètent ici, sans toucher au moteur. */
(function () {
  "use strict";

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  var IRR = { go: "goes", have: "has", do: "does", study: "studies", watch: "watches", pass: "passes", carry: "carries" };
  function troisieme(v) { return IRR[v] || (v + "s"); }

  /* [motif, remplacement (fonction), note en français] */
  var REGLES = [
    [/\b(i|we) am agree\b/i, function (m) { return m[1] + " agree"; }, "En anglais on dit « I agree », sans « am »."],
    [/\bi have (\d+) years?( old)?\b/i, function (m) { return "I am " + m[1] + " years old"; }, "L'âge se dit avec « to be » : « I am 25 years old »."],
    [/\bi am (\d{1,2})\b(?! years)/i, function (m) { return "I am " + m[1] + " years old"; }, "Pour l'âge, ajoute « years old »."],
    [/\b(he|she|it) (have)\b/i, function (m) { return m[1] + " has"; }, "À la 3e personne : he / she / it « has »."],
    [/\b(he|she) (go|do|like|live|work|come|want|need|eat|play|make|take|love|study|watch|speak|read)\b/i, function (m) { return m[1] + " " + troisieme(m[2].toLowerCase()); }, "À la 3e personne du singulier, le verbe prend un « s »."],
    [/\bpeoples\b/i, function () { return "people"; }, "« people » n'a pas de « s »."],
    [/\binformations\b/i, function () { return "information"; }, "« information » ne se met pas au pluriel."],
    [/\badvices\b/i, function () { return "advice"; }, "« advice » ne se met pas au pluriel."],
    [/\b(luggages|furnitures|moneys|homeworks)\b/i, function (m) { return m[1].slice(0, -1); }, "Ce mot ne se met pas au pluriel en anglais."],
    [/\bi am (go|come|work|live|eat|play|study)\b/i, function (m) { return "I " + m[1]; }, "Après « I am », mets « -ing » (« I am going ») ou utilise le présent simple (« I go »)."],
    [/\bsince (\d+|one|two|three|four|five|six|ten|a few) (years?|months?|weeks?|days?)\b/i, function (m) { return "for " + m[1] + " " + m[2]; }, "Pour une durée, on dit « for » ; « since » s'utilise avec une date."],
    [/\bcan to\b/i, function () { return "can"; }, "Après « can », pas de « to »."],
    [/\bmore better\b/i, function () { return "better"; }, "« better » suffit."],
    [/\bvery much (people|money|children|friends|food)\b/i, function (m) { return "a lot of " + m[1]; }, "Utilise « a lot of » avec un nom."],
    [/\bi want that you\b/i, function () { return "I want you to"; }, "On dit « I want you to… »."],
    [/\bmake (a )?sport\b/i, function () { return "do sport"; }, "On dit « do sport » ou « play sport »."],
    [/\bmake (my |the )?homework\b/i, function (m) { return "do " + (m[1] || "") + "homework"; }, "On dit « do homework »."],
    [/\bi live to\b/i, function () { return "I live in"; }, "On dit « I live in… »."],
    [/\bi am from in\b/i, function () { return "I am from"; }, "« from » suffit, sans « in »."],
    [/\bmy name ((?!is\b)[a-z]+)\b/i, function (m) { return "my name is " + m[1]; }, "N'oublie pas « is » : « My name is… »."],
    [/\bi have (hunger|thirst|cold)\b/i, function (m) { return "I am " + ({ hunger: "hungry", thirst: "thirsty", cold: "cold" })[m[1].toLowerCase()]; }, "Pour la faim, la soif et le froid, on utilise « to be »."],
    [/\bthe (people|life|love|nature) is\b/i, function (m) { return m[1].toLowerCase() === "people" ? "people are" : m[1].toLowerCase() + " is"; }, "On évite « the » devant un mot général."]
  ];

  /* début de phrase attendu selon la question */
  var DEBUTS = [
    [/what('?s| is) your name/i, /\bmy name\b|\bi am\b|\bi'm\b/i, "My name is …"],
    [/where are you from|where do you come from/i, /\bi am from\b|\bi'm from\b|\bi come from\b/i, "I am from …"],
    [/where do you live/i, /\bi live\b|\bi'm living\b|\bi am living\b/i, "I live in …"],
    [/how old are you/i, /\bi am\b|\bi'm\b/i, "I am … years old."],
    [/what do you do|what is your job|what's your job/i, /\bi am\b|\bi'm\b|\bi work\b/i, "I am a … / I work as a …"],
    [/what time/i, /\bat\b|\baround\b|\bo'clock\b|\b\d/i, "I … at seven o'clock."]
  ];
  var OUINON = /^(do|does|did|are|is|can|have|has|will|would|could)\b/i;

  var CONNECTEURS = /\b(because|and|but|so|also|then|after that|before|for example|when)\b/i;
  var DEBUT_QUESTION = /\b(what|where|when|who|why|how|do you|did you|are you|is it|can you|have you|would you|could you|does he|does she)\b/gi;
  var VERBES = /\b(am|is|are|was|were|have|has|had|like|likes|love|live|lives|work|works|go|goes|come|comes|eat|eats|play|plays|want|need|do|does|make|take|study|buy|drink|cook|read|watch|visit|get|help|see|use|call|speak|think|feel)\b/i;

  function mots(s) { return String(s || "").trim().split(/\s+/).filter(Boolean); }

  function analyser(texte, question, opts) {
    opts = opts || {};
    var t = String(texte || "").trim(), q = String(question || ""), out = { corrections: [], conseils: [], exemple: "" };
    if (!t) return out;
    var n = mots(t).length;

    REGLES.forEach(function (r) {
      var m = r[0].exec(t);
      if (m && out.corrections.length < 3) out.corrections.push({ avant: m[0], apres: r[1](m), note: r[2] });
    });

    if (!opts.court && !opts.libre) {
      var attendu = null;
      DEBUTS.forEach(function (d) { if (!attendu && d[0].test(q)) attendu = d; });
      if (attendu) {
        out.exemple = attendu[2];
        if (!attendu[1].test(t)) out.conseils.push("Commence par une phrase complète, par exemple : « " + attendu[2] + " »");
      } else if (OUINON.test(q) && !/\b(yes|no|sometimes|never|always|usually|of course|not really)\b/i.test(t)) {
        out.conseils.push("Pour une question en « Do / Are / Can… », commence par « Yes, I do. » ou « No, I don't. », puis explique.");
      }
      if (n < 4 && !out.conseils.length && !VERBES.test(t)) out.conseils.push("Réponds par une phrase complète (sujet + verbe), pas par un seul mot.");
    }

    if (opts.ask) {
      var qs = (t.match(DEBUT_QUESTION) || []).length;
      out.conseils.push(qs >= 3 ? "Bien : tu as posé environ " + qs + " questions." : "Il te faut poser 3 questions : j'en ai compté " + qs + ". Commence chacune par What, Where, Do you…");
    } else if (opts.duree >= 25 && n >= 25 && !CONNECTEURS.test(t)) {
      out.conseils.push("Relie tes idées avec « because », « and », « but » pour parler plus longtemps et plus naturellement.");
    } else if (opts.duree >= 20 && n < Math.round(opts.duree * 0.6) && !opts.court) {
      out.conseils.push("Ta réponse est courte : ajoute une raison (« because… ») ou un exemple (« for example… »).");
    }
    return out;
  }

  window.DiisooOral = { version: 1, analyser: analyser };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-oral.js",e);}

try{
/* ---- diisoo-exams2.js ---- */
/* diisoo-exams2.js v5 : « Format réel » des examens, piloté par un registre
   Lit exam-formats.json : pour chaque examen, les tâches (type, nombre, préparation, durée de réponse) et les tests.
   Types gérés : repeat (écoute et répète), readaloud (lire à voix haute), question (réponse orale chronométrée),
   prompt (consigne affichée), describe (photo ou graphique), info (document puis questions),
   retell (résumer un cours entendu), short (réponse courte).
   v3 : fin de parole détectée par le micro, correction et suggestions (diisoo-oral.js), passage automatique à la question suivante,
   import des anciens thèmes IELTS (TEST_BANK) enrichis d'un enregistrement et de la partie « poser des questions ».
   Pour suivre un changement du vrai examen, on modifie exam-formats.json seulement : aucun code à toucher. */
(function () {
  "use strict";

  var REG = null, PROM = null;
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function charger() {
    if (PROM) return PROM;
    PROM = fetch("exam-formats.json", { cache: "no-cache" }).then(function (r) { return r.json(); })
      .then(function (j) { REG = j; return j; }).catch(function () { PROM = null; return null; });
    return PROM;
  }
  function son(n) { try { if (window.DiisooSon && window.DiisooSon.jouer) window.DiisooSon.jouer(n); } catch (e) {} }
  function attendre(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  /* ---------- comparaison ---------- */
  function mots(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean); }
  function comparer(cible, entendu) {
    if (window.DiisooCoach && window.DiisooCoach._comparer) return window.DiisooCoach._comparer(cible, entendu);
    var H = mots(entendu), res = [], ok = 0;
    mots(cible).forEach(function (w) { var v = H.indexOf(w) > -1; if (v) ok++; res.push({ w: w, etat: v ? 2 : 0 }); });
    return { mots: res, score: res.length ? ok / res.length : 0 };
  }

  /* ---------- graphique en barres (PTE : décrire un graphique) ---------- */
  function graphique(g) {
    var W = 320, H = 190, m = 28, max = Math.max.apply(null, g.valeurs), n = g.valeurs.length, bw = (W - 2 * m) / n * 0.6, gap = (W - 2 * m) / n, s = "";
    s += '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" style="width:100%;background:#fff;border-radius:12px">';
    s += '<text x="' + W / 2 + '" y="16" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#222">' + esc(g.titre) + "</text>";
    s += '<line x1="' + m + '" y1="' + (H - 28) + '" x2="' + (W - m + 6) + '" y2="' + (H - 28) + '" stroke="#444"/>';
    g.valeurs.forEach(function (v, i) {
      var h = (H - 70) * v / max, x = m + i * gap + (gap - bw) / 2, y = H - 28 - h;
      s += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + h + '" fill="#2f5ca3" rx="3"/>';
      s += '<text x="' + (x + bw / 2) + '" y="' + (y - 4) + '" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#222">' + v + "</text>";
      s += '<text x="' + (x + bw / 2) + '" y="' + (H - 12) + '" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#222">' + esc(g.labels[i]) + "</text>";
    });
    return s + "</svg>";
  }

  /* ---------- styles ---------- */
  var st = document.createElement("style");
  st.textContent =
    ".fx-reel{width:100%;min-height:56px;margin:6px 0 4px;border-radius:16px;border:0;background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;font-size:15px;font-weight:800;text-align:left;padding:8px 14px}" +
    ".fx-reel small{display:block;font-size:11px;font-weight:600;opacity:.85}" +
    "#dii-fmt{position:fixed;inset:0;z-index:99980;background:rgba(5,8,18,.96);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-fmt .fm-box{width:100%;max-width:520px;max-height:96vh;overflow-y:auto;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px 22px 0 0;padding:16px 16px 22px;color:#F6F1E7}" +
    "#dii-fmt .fm-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}" +
    "#dii-fmt .fm-x{width:44px;height:44px;border-radius:50%;background:#141A2B;border:1px solid #1E2740;color:#A69C86;font-size:16px;flex:none}" +
    "#dii-fmt .fm-tt{flex:1;text-align:center;font-size:11px;font-weight:700;letter-spacing:.08em;color:#8C8064;text-transform:uppercase}" +
    "#dii-fmt .fm-pg{height:6px;border-radius:99px;background:#141A2B;overflow:hidden;margin:0 0 12px}" +
    "#dii-fmt .fm-pg i{display:block;height:100%;background:#3FAE74}" +
    "#dii-fmt h3{font-size:20px;font-weight:800;margin:4px 0;text-align:center}" +
    "#dii-fmt .fm-p{font-size:13px;color:#A69C86;line-height:1.45;margin:6px 0;text-align:center}" +
    "#dii-fmt .fm-big{font-size:20px;font-weight:700;line-height:1.35;text-align:center;margin:12px 0}" +
    "#dii-fmt .fm-ico{font-size:50px;text-align:center;margin:8px 0}" +
    "#dii-fmt .fm-b{display:block;width:100%;min-height:52px;margin-top:8px;border:0;border-radius:14px;background:#25D366;color:#fff;font-size:16px;font-weight:800}" +
    "#dii-fmt .fm-b.s{background:#141A2B;border:1px solid #1E2740;color:#E4DCC9;font-weight:700;font-size:14px}" +
    "#dii-fmt .fm-b.l{opacity:.55}" +
    "#dii-fmt .fm-cd{height:10px;border-radius:99px;background:#141A2B;overflow:hidden;margin:12px 0 4px}" +
    "#dii-fmt .fm-cd i{display:block;height:100%;background:#E5484D;transition:width .25s linear}" +
    "#dii-fmt .fm-sec{text-align:center;font-size:30px;font-weight:800;color:#F3A94E}" +
    "#dii-fmt .fm-mots{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:10px 0}" +
    "#dii-fmt .fm-m{padding:6px 10px;border-radius:10px;border:2px solid #1E2740;background:#141A2B;font-size:16px;font-weight:700}" +
    "#dii-fmt .fm-m.v{border-color:#25D366;background:#12351F}#dii-fmt .fm-m.o{border-color:#F3A94E;background:#3A2A10}#dii-fmt .fm-m.r{border-color:#E5484D;background:#3A1515}" +
    "#dii-fmt .fm-tr{background:#141A2B;border:1px solid #1E2740;border-radius:12px;padding:10px;font-size:14px;line-height:1.4;margin:8px 0;color:#C9BFA8}" +
    "#dii-fmt .fm-doc{background:#F6F1E7;color:#1b1b1b;border-radius:12px;padding:12px;margin:8px 0;font-size:14px;line-height:1.6}" +
    "#dii-fmt .fm-doc b{display:block;margin-bottom:4px}" +
    "#dii-fmt .fm-img{margin:8px 0;border-radius:12px;overflow:hidden}#dii-fmt .fm-img svg{width:100%;height:auto;display:block}" +
    "#dii-fmt .fm-src{font-size:11px;color:#8C8064;text-align:center;margin-top:10px;line-height:1.4}";
  document.head.appendChild(st);
  var st2 = document.createElement("style");
  st2.textContent =
    "@keyframes fmpulse{0%{transform:scale(1)}50%{transform:scale(1.12)}100%{transform:scale(1)}}" +
    "#dii-fmt .fm-ico.on{animation:fmpulse 1.1s infinite}" +
    "#dii-fmt .fm-live{min-height:42px;background:#141A2B;border:1px dashed #2a3350;border-radius:12px;padding:8px 10px;font-size:14px;color:#E4DCC9;line-height:1.35;margin:8px 0;text-align:center}" +
    "#dii-fmt .fm-sug{background:#141A2B;border:1px solid #1E2740;border-radius:12px;padding:10px;margin:8px 0;font-size:13px;line-height:1.5;color:#E4DCC9}" +
    "#dii-fmt .fm-sug b{display:block;color:#F3A94E;font-size:12px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}" +
    "#dii-fmt .fm-sug small{display:block;color:#A69C86;font-size:11px;margin:1px 0 6px}" +
    "#dii-fmt .fm-auto{height:6px;border-radius:99px;background:#141A2B;overflow:hidden;margin:10px 0 4px}" +
    "#dii-fmt .fm-auto i{display:block;height:100%;width:100%;background:#25D366}" +
    "#exam-tests.fx-seul>*:not(.et-retour):not(.fx-reel){display:none!important}";
  document.head.appendChild(st2);

  var st3 = document.createElement("style");
  st3.textContent =
    "#dii-fmt .fm-box{background:radial-gradient(120% 70% at 50% 0%,#18233f 0%,#0B0F1C 62%);border-color:#2a3558}" +
    "#dii-fmt .fm-top{margin-bottom:10px}" +
    "#dii-fmt .fm-bd{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:99px;background:linear-gradient(90deg,#F3A94E,#E2703E);color:#1a1206;font-size:12px;font-weight:900;letter-spacing:.06em}" +
    "#dii-fmt .fm-tt{font-size:12px;color:#9fb4ff}" +
    "#dii-fmt .fm-pg{height:5px;margin-bottom:14px}#dii-fmt .fm-pg i{background:linear-gradient(90deg,#3FAE74,#8fe3b0);transition:width .4s}" +
    "#dii-fmt .fm-in{display:flex;justify-content:center;margin:2px 0 10px}" +
    "#dii-fmt .fm-chip{display:inline-block;padding:5px 12px;border-radius:99px;background:#1a2340;border:1px solid #2a3558;font-size:11px;font-weight:800;letter-spacing:.05em;color:#9fb4ff;text-transform:uppercase}" +
    "#dii-fmt .fm-q{background:#121a30;border:1px solid #2a3558;border-radius:20px;padding:18px 14px;font-size:21px;font-weight:800;text-align:center;line-height:1.3;margin:6px 0 10px}" +
    "#dii-fmt .fm-q.sm{font-size:16px;font-weight:700}" +
    "#dii-fmt .fm-ring{position:relative;width:118px;height:118px;margin:8px auto 2px}" +
    "#dii-fmt .fm-ring svg{width:118px;height:118px;transform:rotate(-90deg)}" +
    "#dii-fmt .fm-ring .t{fill:none;stroke:#1b2542;stroke-width:9}#dii-fmt .fm-ring .p{fill:none;stroke:#F3A94E;stroke-width:9;stroke-linecap:round;stroke-dasharray:314.2;stroke-dashoffset:0;transition:stroke-dashoffset .25s linear}" +
    "#dii-fmt .fm-ring .n{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:34px;font-weight:900;color:#F6F1E7;line-height:1}" +
    "#dii-fmt .fm-ring .n small{font-size:20px;margin-bottom:2px}" +
    "#dii-fmt .fm-ring.rec .p{stroke:#E5484D}#dii-fmt .fm-ring.rec::after{content:'';position:absolute;inset:-7px;border-radius:50%;border:2px solid rgba(229,72,77,.55);animation:fmhalo 1.3s infinite}" +
    "@keyframes fmhalo{0%{transform:scale(.96);opacity:.9}100%{transform:scale(1.12);opacity:0}}" +
    "#dii-fmt .fm-state{text-align:center;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#8C8064;margin:4px 0 8px}" +
    "#dii-fmt .fm-state.rec{color:#E5484D}" +
    "#dii-fmt .fm-kw{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:8px 0}" +
    "#dii-fmt .fm-w{padding:6px 10px;border-radius:10px;background:#141A2B;border:1.5px solid #243055;font-size:16px;font-weight:700;color:#7d86a3;transition:all .2s}" +
    "#dii-fmt .fm-w.ok{color:#fff;background:#12351F;border-color:#25D366;transform:scale(1.05)}" +
    "#dii-fmt .fm-id{width:44px;height:44px;border-radius:50%;background:#141A2B;border:2px dashed #243055;display:flex;align-items:center;justify-content:center;font-size:20px;transition:all .25s}" +
    "#dii-fmt .fm-id.ok{border-style:solid;border-color:#25D366;background:#12351F}" +
    "#dii-fmt .fm-ids{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:10px 0}" +
    "#dii-fmt .fm-mt{height:8px;border-radius:99px;background:#141A2B;overflow:hidden;margin:6px 0 2px}#dii-fmt .fm-mt i{display:block;height:100%;width:0;background:linear-gradient(90deg,#4f8cff,#8fe3b0);transition:width .3s}" +
    "#dii-fmt .fm-mtl{display:flex;justify-content:space-between;font-size:11px;color:#8C8064;font-weight:700}" +
    "#dii-fmt .fm-cn{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin:6px 0}#dii-fmt .fm-cn span{padding:3px 9px;border-radius:99px;border:1px solid #243055;font-size:11px;font-weight:700;color:#5d6685}#dii-fmt .fm-cn span.ok{color:#8fe3b0;border-color:#25D366;background:#12351F}" +
    "#dii-fmt .fm-row{display:flex;gap:8px;margin-top:8px}#dii-fmt .fm-row .fm-b{margin-top:0;flex:1;min-height:46px;font-size:13px}" +
    "#dii-fmt .fm-nx{position:relative;overflow:hidden}#dii-fmt .fm-nx i{position:absolute;left:0;top:0;bottom:0;width:0;background:rgba(255,255,255,.22)}#dii-fmt .fm-nx span{position:relative}" +
    "#dii-fmt .fm-sc{display:flex;align-items:center;gap:14px;margin:6px 0 8px}" +
    "#dii-fmt .fm-sc .c{flex:none;width:76px;height:76px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border:6px solid #25D366;color:#F6F1E7}" +
    "#dii-fmt .fm-sc .c.o{border-color:#F3A94E}#dii-fmt .fm-sc .c.r{border-color:#E5484D}" +
    "#dii-fmt .fm-sc .d{flex:1;font-size:13px;color:#C9BFA8;line-height:1.4}#dii-fmt .fm-sc .d b{display:block;font-size:16px;color:#F6F1E7;margin-bottom:2px}" +
    "#dii-fmt .fm-hr{font-size:12px;color:#8C8064;text-align:center;margin:4px 0}" +
    "#dii-fmt .fm-tl{margin:8px 0}#dii-fmt .fm-tl div{display:flex;align-items:center;gap:10px;padding:9px 4px;border-bottom:1px solid #1b2542;font-size:14px;font-weight:700}#dii-fmt .fm-tl em{margin-left:auto;font-style:normal;font-size:11px;color:#8C8064;font-weight:700}" +
    "#dii-fmt .fm-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}" +
    "#dii-fmt .fm-tc{border:1.5px solid #2a3558;border-radius:16px;background:#121a30;color:#F6F1E7;padding:12px 10px;text-align:left;min-height:84px}#dii-fmt .fm-tc b{display:block;font-size:22px;color:#F3A94E}#dii-fmt .fm-tc small{font-size:12px;color:#A69C86;line-height:1.3}#dii-fmt .fm-tc.l{opacity:.6}" +
    "#dii-fmt .fm-st{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:6px 0}" +
    "#dii-fmt .fm-sk{margin:8px 0}#dii-fmt .fm-sk div.h{display:flex;justify-content:space-between;font-size:13px;font-weight:800}#dii-fmt .fm-sk .b{height:10px;border-radius:99px;background:#141A2B;overflow:hidden;margin-top:4px}#dii-fmt .fm-sk .b i{display:block;height:100%;border-radius:99px}" +
    "#dii-fmt .fm-doc{cursor:pointer}#dii-fmt .fm-doc div.hl{background:#ffe58a;border-radius:4px}" +
    "#dii-fmt details{margin-top:12px;font-size:11px;color:#8C8064}#dii-fmt summary{cursor:pointer;text-align:center}";
  document.head.appendChild(st3);

  /* ---------- lecteur ---------- */
  var ov = null, jeton = 0, minuteur = null, ecoute = null, vadT = null, autoT = null;
  function AUTO() { try { return localStorage.getItem("diisoo_fmt_auto") !== "0"; } catch (e) { return true; } }

  function nettoyer() {
    jeton++;
    if (minuteur) { clearInterval(minuteur); minuteur = null; }
    if (vadT) { clearInterval(vadT); vadT = null; }
    if (autoT) { clearTimeout(autoT); autoT = null; }
    if (ecoute) { try { ecoute.stop(); } catch (e) {} ecoute = null; }
    try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
  }
  function fermer() { nettoyer(); if (ov) { ov.remove(); ov = null; } }

  var BADGE = "";
  function cadre(titre, prog) {
    if (!ov) {
      ov = el("div"); ov.id = "dii-fmt"; ov.setAttribute("role", "dialog");
      ov.appendChild(el("div", "fm-box")); document.body.appendChild(ov);
    }
    var box = ov.firstChild; box.innerHTML = ""; box.scrollTop = 0;
    var top = el("div", "fm-top");
    var x = el("button", "fm-x", "✕"); x.type = "button"; x.setAttribute("aria-label", "Fermer"); x.onclick = fermer;
    top.appendChild(x);
    var mid = el("div", "fm-tt"); mid.style.display = "flex"; mid.style.flexDirection = "column"; mid.style.alignItems = "center"; mid.style.gap = "3px";
    if (BADGE) mid.appendChild(el("span", "fm-bd", BADGE));
    mid.appendChild(el("span", null, titre || ""));
    top.appendChild(mid); top.appendChild(el("div")); top.lastChild.style.width = "44px";
    box.appendChild(top);
    if (prog != null) { var pg = el("div", "fm-pg"); var i = el("i"); i.style.width = Math.round(prog * 100) + "%"; pg.appendChild(i); box.appendChild(pg); }
    return box;
  }
  function bouton(box, txt, fn, cls) { var b = el("button", "fm-b" + (cls ? " " + cls : ""), txt); b.type = "button"; b.onclick = fn; box.appendChild(b); return b; }

  /* contenu visuel d'un item : photo, graphique, document (lignes à surligner du doigt) */
  function support(box, e, sansTexte) {
    var it = e.item;
    if (it && typeof it === "object") {
      if (it.scene) {
        var im = el("div", "fm-img");
        try { im.innerHTML = window.DiisooExams ? window.DiisooExams.scene(it.scene) : ""; } catch (x) {}
        box.appendChild(im);
      }
      if (it.graphique) { var gi = el("div", "fm-img"); gi.innerHTML = graphique(it.graphique); box.appendChild(gi); }
    }
    if (e.doc) {
      var d = el("div", "fm-doc"); var t = el("b", null, e.doc.titre); d.appendChild(t);
      e.doc.lignes.forEach(function (l) { var r = el("div", null, l); r.onclick = function () { r.classList.toggle("hl"); }; d.appendChild(r); });
      box.appendChild(d);
      box.appendChild(el("div", "fm-hr", "Touche une ligne pour la surligner"));
    }
    if (e.visible && !sansTexte) box.appendChild(el("div", "fm-q", e.visible));
  }
  var ICONES = { repeat: "🔁", readaloud: "📖", question: "❓", prompt: "💬", describe: "🖼️", info: "📄", retell: "🎧", short: "⚡" };
  function courte(t) { var c = String(t || "").split(/[.:]/)[0]; return c.length > 60 ? c.slice(0, 57) + "…" : c; }
  function faibles() { try { return JSON.parse(localStorage.getItem("diisoo_fmt_faibles") || "[]") || []; } catch (e) { return []; } }
  function memoFaibles(liste) {
    try { var f = faibles(); liste.forEach(function (w) { if (f.indexOf(w) < 0) f.push(w); }); localStorage.setItem("diisoo_fmt_faibles", JSON.stringify(f.slice(-40))); } catch (e) {}
  }

  /* ---------- accueil d'un examen ---------- */
  var BANAL = /^(about|every|there|their|would|which|always|because|today|while|other|these|those|after|before|again|really|still|three|small)$/;
  function clesDe(txt) {
    var vus = {}, out = [];
    (txt.match(/[A-Za-z']{5,}|\b\d+\b/g) || []).forEach(function (w) {
      var k = w.toLowerCase(); if (BANAL.test(k) || vus[k]) return; vus[k] = 1; if (out.length < 8) out.push(k);
    });
    return out;
  }
  function enrichir() {
    try {
      Object.keys(REG.examens).forEach(function (k) {
        var ex = REG.examens[k];
        if (!ex.import_ancien || !ex.enregistrements || ex._imp || typeof TEST_BANK === "undefined") return;
        ex._imp = true;
        TEST_BANK.forEach(function (t) {
          var rec = ex.enregistrements[t.id];
          if (!rec || ex.tests.some(function (x) { return x.id === "ie-" + t.id; })) return;
          var ph = {}; (t.phases || []).forEach(function (p) { ph[p.id] = p.questions || []; });
          var th = t.topic;
          ex.tests.push({ id: "ie-" + t.id, titre: th,
            p1a: (ph["1a"] || []).slice(0, 3), p1b: (ph["1b"] || []).slice(0, 5),
            ask: ["Ask the examiner three questions about this theme: " + th + ". Start with What, Where or Do you."],
            p2a: [{ t: rec, cles: clesDe(rec) }],
            p2b: (ph["2b"] || []).slice(0, 2).concat(["What do you like or dislike about " + th.toLowerCase().replace(/&/g, "and") + "? Explain why."]) });
        });
      });
    } catch (e) { console.warn("[diisoo] import examens", e); }
  }
  function nbReel(ex, t) {
    var test = ex.tests[0], b = test[t.banque || t.type];
    if (t.type === "info") return t.nb;
    return b ? Math.min(t.nb, b.length) : t.nb;
  }
  function ouvrir(cle) {
    var ex = REG && REG.examens && REG.examens[cle]; if (!ex) return;
    enrichir();
    nettoyer();
    BADGE = ex.bouton ? ex.groupe + " " + ex.bouton : ex.court;
    var box = cadre("Format réel");
    box.appendChild(el("h3", null, ex.nom));
    var minutes = Math.max(1, Math.round(ex.taches.reduce(function (s, t) {
      return s + (t.type === "info" ? t.nb * ((t.lecture_s || 0) / Math.max(1, t.nb) + 20) : t.nb * ((t.prep_s || 0) + (t.rep_s || 10) + 8));
    }, 0) / 60));
    var st = el("div", "fm-st");
    st.appendChild(el("span", "fm-chip", "⏱ ~" + minutes + " min"));
    st.appendChild(el("span", "fm-chip", ex.taches.length + " parties"));
    st.appendChild(el("span", "fm-chip", "🎙️ Micro"));
    box.appendChild(st);
    var tl = el("div", "fm-tl");
    ex.taches.forEach(function (t) {
      var r = el("div"); r.appendChild(el("span", null, (ICONES[t.type] || "•") + " " + t.titre));
      r.appendChild(el("em", null, nbReel(ex, t) + " × " + (t.type === "info" ? t.reps.join("/") : t.rep_s) + " s"));
      tl.appendChild(r);
    });
    box.appendChild(tl);
    var libre = false; try { libre = typeof aAcces === "function" && aAcces("premium"); } catch (e) {}
    var grille = el("div", "fm-grid");
    ex.tests.forEach(function (t, i) {
      var verrou = i >= (ex.gratuits || 1) && !libre;
      var b = el("button", "fm-tc" + (verrou ? " l" : "")); b.type = "button";
      b.innerHTML = "<b>" + (verrou ? "⭐ " : "") + (i + 1) + "</b><small>" + esc(t.titre) + "</small>";
      b.onclick = function () {
        if (verrou) { try { toast("Ce test est réservé aux abonnés Diisoo Plus."); openPremium(); } catch (e) {} return; }
        lancer(cle, i);
      };
      grille.appendChild(b);
    });
    box.appendChild(grille);
    var fb = faibles();
    if (fb.length) bouton(box, "📌 Mots à revoir (" + fb.length + ")", function () { revoir(cle); }, "s");
    var ba = bouton(box, "", function () {
      try { localStorage.setItem("diisoo_fmt_auto", AUTO() ? "0" : "1"); } catch (e) {}
      ba.textContent = "⚙️ Question suivante automatique : " + (AUTO() ? "oui" : "non");
    }, "s");
    ba.textContent = "⚙️ Question suivante automatique : " + (AUTO() ? "oui" : "non");
    var dt = el("details"); dt.appendChild(el("summary", null, "À propos de ce test"));
    dt.appendChild(el("p", "fm-src", ex.confiance + " Dernière vérification : " + ex.verifie_le + ". Tests créés par Diisoo, sans affiliation avec les organismes d'examen."));
    box.appendChild(dt);
  }

  /* mots à revoir : touche un mot pour l'entendre, redis-le, puis efface-le de la liste */
  function revoir(cle) {
    var box = cadre("Mots à revoir");
    box.appendChild(el("h3", null, "📌 Mots à travailler"));
    box.appendChild(el("div", "fm-hr", "Touche un mot : tu l'entends. Dis-le à voix haute. Appui long pour l'effacer."));
    var wrap = el("div", "fm-kw");
    faibles().forEach(function (w) {
      var c = el("button", "fm-w", w); c.type = "button";
      var t0 = 0;
      c.onclick = function () { try { speak(w, "en-US", 0.8); } catch (x) {} };
      c.oncontextmenu = function (ev) { ev.preventDefault(); try { localStorage.setItem("diisoo_fmt_faibles", JSON.stringify(faibles().filter(function (z) { return z !== w; }))); } catch (x) {} c.remove(); };
      c.addEventListener("touchstart", function () { t0 = Date.now(); c._lp = setTimeout(function () { try { localStorage.setItem("diisoo_fmt_faibles", JSON.stringify(faibles().filter(function (z) { return z !== w; }))); } catch (x) {} c.remove(); }, 700); }, { passive: true });
      c.addEventListener("touchend", function () { clearTimeout(c._lp); }, { passive: true });
      wrap.appendChild(c);
    });
    box.appendChild(wrap);
    bouton(box, "Retour", function () { ouvrir(cle); }, "s");
  }

  /* ---------- déroulé d'un test ---------- */
  function lancer(cle, ti) {
    var ex = REG.examens[cle], test = ex.tests[ti], etapes = [];
    ex.taches.forEach(function (t) {
      var banque = test[t.banque || t.type] || [];
      if (t.type === "info") {
        banque.forEach(function (g) {
          g.questions.forEach(function (q, j) {
            etapes.push({ tache: { id: t.id, type: "question", titre: t.titre, prep_s: t.prep_s, rep_s: t.reps[j] || 15, consigne: t.consigne },
              i: j, n: g.questions.length, item: q, doc: g.doc, lecture: j === 0 ? t.lecture_s : 0 });
          });
        });
        return;
      }
      for (var i = 0; i < t.nb && i < banque.length; i++) etapes.push({ tache: t, i: i, n: Math.min(t.nb, banque.length), item: banque[i] });
    });
    var bilan = { precision: [], courtes: [], oraux: [], cles: [], corr: [], mots: [], expr: [] };

    function texteDe(e) { var it = e.item; return typeof it === "string" ? it : (it.t || it.q || it.consigne || ""); }
    function etape(k) {
      if (k >= etapes.length) return fin(cle, ti, bilan);
      var e = etapes[k], mon = ++jeton, ty = e.tache.type;
      e.k = k; e.mon = mon; e.prog = k / etapes.length; e.titre = e.tache.titre + (e.n > 1 ? " " + (e.i + 1) + "/" + e.n : "");
      if (ty === "readaloud") return lire(e);
      if (ty === "prompt") return consigne(e);
      if (ty === "describe") return decrire(e);
      return ecouter(e);   /* repeat, question, retell, short */
    }

    function compte(box, sec, surFin, rec) {
      var ring = el("div", "fm-ring" + (rec ? " rec" : ""));
      ring.innerHTML = '<svg viewBox="0 0 118 118"><circle class="t" cx="59" cy="59" r="50"/><circle class="p" cx="59" cy="59" r="50"/></svg><div class="n"></div>';
      var tx = ring.querySelector(".n"), pr = ring.querySelector(".p");
      tx.textContent = String(sec); box.appendChild(ring);
      var t0 = Date.now(), tot = sec * 1000;
      if (minuteur) clearInterval(minuteur);
      minuteur = setInterval(function () {
        var r = Math.max(0, tot - (Date.now() - t0));
        tx.textContent = String(Math.ceil(r / 1000)); pr.style.strokeDashoffset = String(314.2 * (1 - r / tot));
        if (r <= 0) { clearInterval(minuteur); minuteur = null; if (surFin) surFin(); }
      }, 250);
      return ring;
    }
    function arret() { if (minuteur) { clearInterval(minuteur); minuteur = null; } }
    function puce(box, txt) { var w = el("div", "fm-in"); w.appendChild(el("span", "fm-chip", txt)); box.appendChild(w); }

    /* attente avant de parler : lecture du document, préparation */
    function preparer(e, secondes, libelle, suite, avecSupport) {
      var box = cadre(e.titre, e.prog);
      puce(box, courte(libelle));
      if (avecSupport) support(box, e);
      var go = function () { if (e.mon === jeton) { arret(); suite(); } };
      compte(box, secondes, go, false);
      box.appendChild(el("div", "fm-state", "Prépare-toi"));
      bouton(box, "Je suis prêt", go, "s");
    }

    function silenceMs(t) {
      if (t.silence_ms) return t.silence_ms;
      if (t.type === "short") return 1100;
      if (t.type === "repeat") return 1400;
      if (t.type === "question") return t.rep_s <= 20 ? 1800 : (t.rep_s <= 30 ? 2100 : 2600);
      return 2800;
    }

    /* lecture karaoké : chaque mot s'allume quand tu le dis (cacher = mots masqués, comme à l'examen) */
    function karaoke(box, cible, cacher, petit) {
      var wrap = el("div", "fm-kw"), chips = [];
      cible.split(/\s+/).filter(Boolean).forEach(function (tok) {
        var n = mots(tok)[0] || ""; var c = el("span", "fm-w", cacher ? Array(Math.min(Math.max(n.length, 2), 6) + 1).join("•") : tok);
        if (petit) { c.style.fontSize = "14px"; c.style.padding = "3px 6px"; }
        c._n = n; c._t = tok; wrap.appendChild(c); chips.push(c);
      });
      box.appendChild(wrap);
      return function (txt) {
        var H = mots(txt);
        chips.forEach(function (c) { if (c.classList.contains("ok") || !c._n) return; if (H.indexOf(c._n) > -1) { c.classList.add("ok"); c.textContent = c._t; } });
      };
    }
    function aMatch(dit, spec) {
      var d = " " + mots(dit).join(" ") + " ";
      return String(spec).split("|").some(function (a) { var m = mots(a).join(" "); return m && d.indexOf(" " + m + " ") > -1; });
    }
    function ideesLive(box, cles) {
      var wrap = el("div", "fm-kw"), ch = [];
      cles.forEach(function (k) { var c = el("span", "fm-w", "•••"); c._k = k; wrap.appendChild(c); ch.push(c); });
      box.appendChild(wrap);
      return function (txt) { ch.forEach(function (c) { if (!c.classList.contains("ok") && aMatch(txt, c._k)) { c.classList.add("ok"); c.textContent = String(c._k).split("|")[0]; } }); };
    }
    var CONN = ["because", "and", "but", "for example"], QDEB = /\b(what|where|when|who|why|how|do you|did you|are you|is it|can you|have you|would you|could you)\b/gi;
    function metreLive(box, objectif, ask) {
      var up;
      if (ask) {
        var ids = el("div", "fm-ids"), pts = [];
        [1, 2, 3].forEach(function (n) { var c = el("div", "fm-id", String(n)); ids.appendChild(c); pts.push(c); });
        box.appendChild(ids);
        up = function (txt) { var q = (txt.match(QDEB) || []).length; pts.forEach(function (c, i) { if (i < q) { c.classList.add("ok"); c.textContent = "✓"; } }); };
      } else {
        var mt = el("div", "fm-mt"), bi = el("i"); mt.appendChild(bi); box.appendChild(mt);
        var lg = el("div", "fm-mtl"), l1 = el("span", null, "0 mot"), l2 = el("span", null, "objectif ~" + objectif); lg.appendChild(l1); lg.appendChild(l2); box.appendChild(lg);
        var cn = el("div", "fm-cn"), cs = []; CONN.forEach(function (w) { var c = el("span", null, w); cn.appendChild(c); cs.push(c); }); box.appendChild(cn);
        up = function (txt) {
          var n = mots(txt).length; bi.style.width = Math.min(100, Math.round(n / objectif * 100)) + "%"; l1.textContent = n + (n > 1 ? " mots" : " mot");
          var d = txt.toLowerCase(); cs.forEach(function (c, i) { if (d.indexOf(CONN[i]) > -1) c.classList.add("ok"); });
        };
      }
      return up;
    }

    function parler(e) {
      var t = e.tache, ty = t.type, cible = texteDe(e), box = cadre(e.titre, e.prog);
      puce(box, courte(t.consigne));
      var objectif = Math.round(t.rep_s * 1.2), maj = function () {};
      if (ty === "repeat") maj = karaoke(box, cible, true, false);
      else if (ty === "readaloud") maj = karaoke(box, cible, false, true);
      else if (ty === "retell" && e.item.cles) maj = ideesLive(box, e.item.cles);
      else {
        support(box, e);
        if (ty !== "short") maj = (e.item && e.item.cles) ? ideesLive(box, e.item.cles) : metreLive(box, objectif, t.id === "ask");
      }
      var ring = null, etat = el("div", "fm-state rec", "● Je t'écoute");
      var live = el("div", "fm-hr", "");
      var debut = Date.now(), fini = false, aParle = false, dernier = Date.now();
      var seuil = silenceMs(t), minM = ty === "repeat" ? 2 : 1, attenteMax = Math.min(9000, t.rep_s * 600);
      function terminer(res) {
        if (fini || e.mon !== jeton) return; fini = true;
        if (vadT) { clearInterval(vadT); vadT = null; }
        arret(); ecoute = null;
        resultat(e, res || { text: "" }, (Date.now() - debut) / 1000);
      }
      function stopper(raison) {
        if (fini) return;
        if (raison === "silence") { son("ferme"); etat.textContent = "✅ Terminé"; etat.className = "fm-state"; if (ring) ring.classList.remove("rec"); }
        else if (raison === "rien") { etat.textContent = "Je n'ai rien entendu"; etat.className = "fm-state"; }
        try { ecoute && ecoute.stop(); } catch (x) {}
      }
      son("ouvre");
      try {
        ecoute = startListening("en-US", t.rep_s * 1000, true, function (txt) {
          dernier = Date.now();
          if (!aParle && mots(txt).length >= minM) aParle = true;
          maj(txt); live.textContent = txt.length > 90 ? "…" + txt.slice(-90) : txt;
        });
        ecoute.promise.then(terminer, function () { terminer({ text: "" }); });
      } catch (err) { terminer({ text: "", unsupported: true }); }
      if (vadT) clearInterval(vadT);
      vadT = setInterval(function () {
        var now = Date.now();
        if (aParle && now - dernier >= seuil) stopper("silence");
        else if (!aParle && now - debut >= attenteMax) stopper("rien");
      }, 150);
      ring = compte(box, t.rep_s, function () { try { ecoute && ecoute.stop(); } catch (x) {} }, true);
      box.appendChild(etat); box.appendChild(live);
      bouton(box, "✋ J'ai fini", function () { try { ecoute && ecoute.stop(); } catch (x) {} }, "s");
    }

    /* la consigne est dite une seule fois, puis préparation éventuelle, puis réponse */
    function ecouter(e) {
      var ty = e.tache.type, box = cadre(e.titre, e.prog);
      if (e.lecture) {
        e.lecture0 = e.lecture; e.lecture = 0;
        return preparer(e, e.lecture0, "Lis le document", function () { ecouter(e); }, true);
      }
      puce(box, courte(e.tache.consigne));
      box.appendChild(el("div", "fm-ico on", "🔊"));
      box.appendChild(el("div", "fm-state", "Écoute : une seule fois"));
      if (e.doc) support(box, e);
      Promise.race([Promise.resolve().then(function () { return speak(texteDe(e), "en-US", 0.95); }), attendre(40000)]).then(function () {
        if (e.mon !== jeton) return;
        if (ty === "question") e.visible = texteDe(e);
        if (ty === "retell") e.visible = "";
        if (e.tache.prep_s) preparer(e, e.tache.prep_s, "Temps de préparation", function () { parler(e); }, true);
        else parler(e);
      }, function () { if (e.mon === jeton) { e.visible = texteDe(e); parler(e); } });
    }

    function lire(e) {
      var go = function () { parler(e); };
      e.visible = texteDe(e);
      if (e.tache.prep_s) preparer(e, e.tache.prep_s, e.tache.consigne, go, false);
      else go();
    }
    function consigne(e) {
      e.visible = texteDe(e);
      var run = function () {
        if (e.tache.prep_s) preparer(e, e.tache.prep_s, e.tache.consigne, function () { parler(e); }, true);
        else parler(e);
      };
      if (e.tache.lue) { try { speak(e.visible, "en-US", 0.95); } catch (x) {} }
      run();
    }
    function decrire(e) {
      e.visible = "";
      if (e.tache.prep_s) preparer(e, e.tache.prep_s, e.tache.consigne, function () { parler(e); }, true);
      else { var b = cadre(e.titre, e.prog); puce(b, courte(e.tache.consigne)); support(b, e); bouton(b, "🎙️ Commencer à parler", function () { parler(e); }); }
    }

    function resultat(e, res, dur) {
      var ty = e.tache.type, k = e.k, box = cadre(e.titre, (k + 1) / etapes.length);
      var texte = (res.text || "").trim(), cible = texteDe(e);
      var suite = function (nSug, manuel) {
        var dernierEl = k + 1 >= etapes.length, mon2 = jeton, ms = Math.min(10000, 4000 + 1500 * (nSug || 0));
        var go = function () { if (mon2 !== jeton) return; if (autoT) { clearTimeout(autoT); autoT = null; } etape(k + 1); };
        var row = el("div", "fm-row");
        var nx = el("button", "fm-b fm-nx"); nx.type = "button"; nx.style.flex = "3";
        var fill = el("i"); nx.appendChild(fill); nx.appendChild(el("span", null, dernierEl ? "Voir mon bilan" : "Suivant ›")); nx.onclick = go; row.appendChild(nx);
        if (AUTO() && !manuel) {
          fill.style.transition = "width " + ms + "ms linear";
          requestAnimationFrame(function () { requestAnimationFrame(function () { fill.style.width = "100%"; }); });
          var pz = el("button", "fm-b s", "⏸"); pz.type = "button"; pz.setAttribute("aria-label", "Rester ici");
          pz.onclick = function () { if (autoT) { clearTimeout(autoT); autoT = null; } fill.style.transition = "none"; fill.style.width = "0"; pz.remove(); };
          row.appendChild(pz); autoT = setTimeout(go, ms);
        }
        box.appendChild(row);
      };
      var conseils = function (libre) {
        if (!window.DiisooOral) return 0;
        var a = window.DiisooOral.analyser(texte, texteDe(e), { duree: e.tache.rep_s, ask: e.tache.id === "ask", court: ty === "short", libre: libre });
        var n = 0;
        bilan.corr.push(a.corrections.length ? 1 : 0);
        if (a.corrections.length) {
          var c = el("div", "fm-sug"); c.appendChild(el("b", null, "À corriger"));
          a.corrections.forEach(function (f) { var d = el("div"); d.innerHTML = "❌ <s>" + esc(f.avant) + "</s> → ✅ <b>" + esc(f.apres) + "</b><small>" + esc(f.note) + "</small>"; c.appendChild(d); n++; });
          box.appendChild(c);
        }
        if (a.conseils.length) {
          var g = el("div", "fm-sug"); g.appendChild(el("b", null, "Pour progresser"));
          a.conseils.forEach(function (x) { g.appendChild(el("div", null, "💡 " + x)); n++; });
          box.appendChild(g);
        }
        return n;
      };
      var rejouer = function () { bouton(box, "↻ Recommencer cette question", function () { var m = ++jeton; e.mon = m; ecouter(e); }, "s"); };
      function carte(val, cls, titre, detail) {
        var c = el("div", "fm-sc"); c.appendChild(el("div", "c " + cls, val));
        var d = el("div", "d"); d.appendChild(el("b", null, titre)); d.appendChild(document.createTextNode(detail)); c.appendChild(d); box.appendChild(c);
      }
      function entendu() { box.appendChild(el("div", "fm-hr", "Entendu : « " + (texte.length > 140 ? texte.slice(0, 137) + "…" : texte) + " »")); }

      if (res.unsupported) {
        puce(box, "Micro non disponible");
        if (ty === "repeat" || ty === "readaloud") box.appendChild(el("div", "fm-q sm", cible));
        bouton(box, "✅ C'était bien", function () { noter(e, ty, 1, dur, 0); etape(k + 1); });
        bouton(box, "❌ Pas encore", function () { noter(e, ty, 0, dur, 0); etape(k + 1); }, "s");
        return;
      }
      if (!texte) {
        box.appendChild(el("div", "fm-ico", "🤔"));
        box.appendChild(el("div", "fm-state", "Rien entendu : rapproche le téléphone"));
        noter(e, ty, 0, dur, 0);
        suite(0, true); rejouer(); return;
      }
      if (ty === "repeat" || ty === "readaloud") {
        var cmp = comparer(cible, texte), pc = Math.round(cmp.score * 100);
        bilan.precision.push(cmp.score);
        var rates = []; cmp.mots.forEach(function (m) { if (m.etat === 0 && m.w.length >= 3 && rates.indexOf(m.w) < 0) rates.push(m.w); });
        bilan.mots = bilan.mots.concat(rates); if (rates.length) memoFaibles(rates);
        carte(pc + "%", pc >= 80 ? "" : (pc >= 50 ? "o" : "r"), pc >= 80 ? "Très bien" : (pc >= 50 ? "Presque" : "À refaire"), cmp.mots.filter(function (m) { return m.etat === 2; }).length + " mots sur " + cmp.mots.length);
        var wrap = el("div", "fm-mots");
        cmp.mots.forEach(function (m) { wrap.appendChild(el("span", "fm-m " + (m.etat === 2 ? "v" : (m.etat === 1 ? "o" : "r")), m.w)); });
        box.appendChild(wrap);
        son(pc >= 80 ? "juste" : "reessaie");
        var r1 = el("div", "fm-row");
        var b1 = el("button", "fm-b s", "🔊 Modèle"); b1.type = "button"; b1.onclick = function () { try { speak(cible, "en-US", 0.85); } catch (x) {} };
        var b2 = el("button", "fm-b s", "↻ Refaire"); b2.type = "button"; b2.onclick = function () { var m = ++jeton; e.mon = m; ecouter(e); };
        r1.appendChild(b1); r1.appendChild(b2); box.appendChild(r1);
        suite(pc >= 80 ? 0 : 1); return;
      }
      if (ty === "short") {
        var rep = mots(texte), bonnes = e.item.a || [], jn = " " + rep.join(" ") + " ", jn2 = jn.replace(/(\d) (?=\d{3}(?!\d))/g, "$1");
        var ok = bonnes.some(function (a) { var x = " " + String(a).toLowerCase() + " "; return jn.indexOf(x) > -1 || jn2.indexOf(x) > -1; });
        bilan.courtes.push(ok ? 1 : 0);
        carte(ok ? "✓" : "✗", ok ? "" : "r", ok ? "Bonne réponse" : "Réponse attendue", ok ? "« " + texte + " »" : bonnes.join(" / "));
        son(ok ? "juste" : "reessaie"); suite(ok ? 0 : 1); return;
      }
      var n = mots(texte).length, objectif = Math.round(e.tache.rep_s * 1.2), plein = n >= objectif * 0.6, wpm = dur > 3 ? Math.round(n / dur * 60) : 0;
      bilan.oraux.push({ mots: n, obj: objectif });
      carte(String(n), plein ? "" : "o", plein ? "Bonne longueur" : "Développe un peu", "mots en " + Math.round(dur) + " s" + (wpm ? " · " + wpm + " mots/min" : "") + " · objectif ~" + objectif);
      entendu();
      if (ty === "retell" && e.item.cles) {
        var dit = texte.toLowerCase(), trouves = e.item.cles.filter(function (c) { return dit.indexOf(c.toLowerCase()) > -1; });
        bilan.cles.push(trouves.length / e.item.cles.length);
        var iw = el("div", "fm-kw");
        e.item.cles.forEach(function (c) { var ok2 = trouves.indexOf(c) > -1; iw.appendChild(el("span", "fm-w" + (ok2 ? " ok" : ""), ok2 ? c : "▢ " + c)); });
        box.appendChild(iw);
        box.appendChild(el("div", "fm-hr", "Idées retrouvées : " + trouves.length + " / " + e.item.cles.length));
      }
      if (ty !== "retell" && e.item && e.item.cles) {
        var ok3 = 0, wr = el("div", "fm-kw");
        e.item.cles.forEach(function (c) { var hit = aMatch(texte, c); if (hit) ok3++; wr.appendChild(el("span", "fm-w" + (hit ? " ok" : ""), (hit ? "" : "▢ ") + String(c).split("|")[0])); });
        bilan.expr.push(ok3 / e.item.cles.length);
        box.appendChild(el("div", "fm-hr", "Expressions utiles : " + ok3 + " / " + e.item.cles.length));
        box.appendChild(wr);
      }
      if (e.item && e.item.modele) {
        var mo = el("div", "fm-sug"); mo.appendChild(el("b", null, "Réponse modèle")); mo.appendChild(el("div", null, e.item.modele));
        var mb = el("button", "fm-b s", "🔊 Écouter le modèle"); mb.type = "button"; mb.style.minHeight = "40px"; mb.onclick = function () { try { speak(e.item.modele, "en-US", 0.9); } catch (x) {} };
        mo.appendChild(mb); box.appendChild(mo);
      }
      var nS = conseils(ty !== "question");
      suite(nS);
    }
    function noter(e, ty, v, dur, n) {
      if (ty === "repeat" || ty === "readaloud") bilan.precision.push(v);
      else if (ty === "short") bilan.courtes.push(v);
      else bilan.oraux.push({ mots: n, obj: Math.round(e.tache.rep_s * 1.2), manuel: v });
    }
    etape(0);
  }

  function fin(cle, ti, bilan) {
    nettoyer();
    var ex = REG.examens[cle];
    var box = cadre("Bilan");
    function moy(a) { return a.reduce(function (s, v) { return s + v; }, 0) / a.length; }
    var sk = [];
    if (bilan.precision.length) sk.push({ k: "pron", n: "Prononciation", v: moy(bilan.precision), c: "Répète à voix haute les mots à revoir, 5 minutes par jour." });
    if (bilan.oraux.length) sk.push({ k: "flu", n: "Fluidité", v: moy(bilan.oraux.map(function (o) { return Math.min(1, o.mots / o.obj); })), c: "Parle plus longtemps : une idée, une raison, un exemple." });
    if (bilan.expr.length) sk.push({ k: "expr", n: "Expressions pro", v: moy(bilan.expr), c: "Utilise les expressions du métier : demande polie, prix, garantie, livraison." });
    if (bilan.cles.length) sk.push({ k: "cont", n: "Compréhension", v: moy(bilan.cles), c: "Avant de répondre, retiens 3 idées clés de ce que tu entends." });
    if (bilan.corr.length) sk.push({ k: "gram", n: "Grammaire", v: 1 - moy(bilan.corr), c: "Relis tes corrections et refais la phrase correctement à voix haute." });
    if (bilan.courtes.length) sk.push({ k: "vit", n: "Réponses rapides", v: moy(bilan.courtes), c: "Réponds vite, en un ou deux mots, sans chercher la phrase parfaite." });
    var indice = sk.length ? Math.round(moy(sk.map(function (x) { return x.v; })) * 100) : 0;
    var carte = el("div", "fm-sc"); carte.appendChild(el("div", "c " + (indice >= 70 ? "" : (indice >= 45 ? "o" : "r")), String(indice)));
    var d = el("div", "d"); d.appendChild(el("b", null, "Indice Diisoo")); d.appendChild(document.createTextNode("sur 100, mesuré à partir de tes réponses. Pas une note officielle.")); carte.appendChild(d); box.appendChild(carte);
    sk.forEach(function (x) {
      var p = Math.round(x.v * 100), col = p >= 70 ? "#25D366" : (p >= 45 ? "#F3A94E" : "#E5484D");
      var r = el("div", "fm-sk"); r.innerHTML = '<div class="h"><span>' + x.n + '</span><span style="color:' + col + '">' + p + ' %</span></div><div class="b"><i style="width:' + p + '%;background:' + col + '"></i></div>';
      box.appendChild(r);
    });
    if (sk.length) {
      var faible = sk.slice().sort(function (a, b) { return a.v - b.v; })[0];
      var g = el("div", "fm-sug"); g.appendChild(el("b", null, "Ton objectif pour la prochaine fois")); g.appendChild(el("div", null, "🎯 " + faible.n + " : " + faible.c)); box.appendChild(g);
    }
    var uniq = []; bilan.mots.forEach(function (w) { if (uniq.indexOf(w) < 0) uniq.push(w); });
    if (uniq.length) {
      box.appendChild(el("div", "fm-hr", "📌 Mots à revoir (enregistrés) : touche pour écouter"));
      var wrap = el("div", "fm-kw");
      uniq.slice(0, 12).forEach(function (w) { var c = el("button", "fm-w", w); c.type = "button"; c.onclick = function () { try { speak(w, "en-US", 0.8); } catch (x) {} }; wrap.appendChild(c); });
      box.appendChild(wrap);
    }
    try { if (typeof addXP === "function") addXP(8); if (typeof bumpDailyGoal === "function") bumpDailyGoal(1); } catch (e) {}
    try {
      var h = JSON.parse(localStorage.getItem("diisoo_fmt") || "[]"); h.push({ e: cle, t: ex.tests[ti].id, d: new Date().toISOString().slice(0, 10), i: indice });
      localStorage.setItem("diisoo_fmt", JSON.stringify(h.slice(-60)));
    } catch (e) {}
    bouton(box, "↻ Refaire ce test", function () { lancer(cle, ti); });
    var rw = el("div", "fm-row");
    var b2 = el("button", "fm-b s", "Autre test"); b2.type = "button"; b2.onclick = function () { ouvrir(cle); };
    var b3 = el("button", "fm-b s", "Fermer"); b3.type = "button"; b3.onclick = fermer;
    rw.appendChild(b2); rw.appendChild(b3); box.appendChild(rw);
  }

  /* ---------- boutons dans la liste des tests ---------- */
  function brancherBiz() {
    var a = $("business-picker");
    if (!a || !a.parentNode || $("fx-biz-btn")) return;
    if (!REG) { charger().then(brancherBiz); return; }
    if (!REG.examens || !REG.examens.business) return;
    var b = el("button", "fx-reel"); b.id = "fx-biz-btn"; b.type = "button";
    b.innerHTML = "🎯 Simulation professionnelle<small>Vends, achète, négocie : comme en vrai</small>";
    b.onclick = function () { ouvrir("business"); };
    a.parentNode.insertBefore(b, a);
  }
  function brancher() {
    brancherBiz();
    var box = $("exam-tests");
    if (box && box.style.display === "none") delete box.dataset.auto;
    if (!box || box.style.display === "none" || box.querySelector(".fx-reel")) return;
    var titre = box.querySelector(".et-titre");
    if (!titre) return;
    if (!REG) { charger().then(brancher); return; }
    var txt = (titre.textContent || "").toLowerCase(), cles = [];
    Object.keys(REG.examens).forEach(function (k) {
      var g = (REG.examens[k].groupe || REG.examens[k].court).toLowerCase();
      if (txt.indexOf(g) === 0) cles.push(k);
    });
    var ref = titre, seul = null;
    cles.forEach(function (k) { if (REG.examens[k].remplace_ancien) seul = k; });
    if (seul) box.classList.add("fx-seul");
    cles.forEach(function (k) {
      var ex = REG.examens[k], b = el("button", "fx-reel"); b.type = "button";
      b.innerHTML = "🎯 Format réel " + esc(ex.bouton ? ex.groupe + " " + ex.bouton : ex.court) + "<small>Comme à l'examen</small>";
      b.onclick = function () { ouvrir(k); };
      ref.parentNode.insertBefore(b, ref.nextSibling); ref = b;
    });
    if (seul && cles.length === 1 && !box.dataset.auto) { box.dataset.auto = "1"; setTimeout(function () { ouvrir(seul); }, 250); }
  }
  var plan = false;
  try {
    new MutationObserver(function () { if (plan) return; plan = true; requestAnimationFrame(function () { plan = false; brancher(); }); })
      .observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
  charger().then(brancher);

  window.DiisooExams2 = { version: 5, ouvrir: ouvrir, registre: function () { return REG; } };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-exams2.js",e);}

try{
/* ---- diisoo-premium.js ---- */
/* diisoo-premium.js v3 : ecran Premium simplifie (Gratuit / Diisoo Plus / services ABC-GLOBAL). Prix : voir PRIX. */
(function () {
  "use strict";

  var PRIX = {
    plus30: "2 500 FCFA",
    plus90: "6 000 FCFA",
    plus365: "20 000 FCFA"
  };
  var ETRANGER = "🔒 Paiement sécurisé PayTech, depuis n'importe quel pays : Wave, Orange Money, Visa, Mastercard.";

  var NEUF = [
    { id: "plus30", icone: "⭐", titre: "Diisoo Plus · 30 jours", prix: PRIX.plus30, dispo: true,
      texte: "Tout est débloqué. Pas de renouvellement automatique." },
    { id: "plus90", icone: "⭐", titre: "Diisoo Plus · 90 jours", prix: PRIX.plus90, dispo: true,
      texte: "Le même accès pendant 3 mois." },
    { id: "plus365", icone: "🏆", titre: "Diisoo Plus · 1 an", prix: PRIX.plus365, dispo: true,
      texte: "Un an d'accès complet." }
  ];

  function ajuster() {
    try {
      var o = PREMIUM_CONFIG.offres;
      if (o.some(function (x) { return x.id === "plus30"; })) return;
      var garde = {};
      o.forEach(function (x) { garde[x.id] = x; });
      var suite = [];
      ["commercants", "visa", "coaching", "pro"].forEach(function (id) { if (garde[id]) suite.push(garde[id]); });
      o.length = 0;
      NEUF.concat(suite).forEach(function (x) { o.push(x); });
    } catch (e) {}
  }

  var WA = "221772882109";
  var choix = "plus90";
  var DUREES = [
    { id: "plus30", court: "30 jours", prix: PRIX.plus30, note: "" },
    { id: "plus90", court: "90 jours", prix: PRIX.plus90, note: "-20 %" },
    { id: "plus365", court: "1 an", prix: PRIX.plus365, note: "-33 %" }
  ];
  function el(html, css) {
    var d = document.createElement("div");
    d.className = "dp-t bg-[#0B0F1C]/60 border border-[#1E2740] rounded-2xl p-3";
    d.style.cssText = "margin-top:10px;" + (css || "");
    d.innerHTML = html;
    return d;
  }
  function offre(id) { try { return PREMIUM_CONFIG.offres.filter(function (x) { return x.id === id; })[0]; } catch (e) { return null; } }
  function payer(id) {
    try { if (typeof payerOffre === "function") return payerOffre(id); } catch (e) {}
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent("Bonjour, je veux l'offre " + id + "."), "_blank", "noopener");
  }
  var BTN = "display:block;width:100%;min-height:46px;border:0;border-radius:12px;font-size:14px;font-weight:800;color:#1a1206;background:linear-gradient(90deg,#F3A94E,#E2703E)";
  var SOUS = "font-size:11px;color:#A69C86;line-height:1.5;margin-top:6px;text-align:center";
  var enCours = false;
  function habiller() {
    var box = document.getElementById("premium-offers");
    if (!box || enCours) return;
    if (box.querySelector(".dp-t")) return;
    if (!box.children.length) return;
    enCours = true;
    try {
      box.innerHTML = "";
            var g = el('<div style="font-size:14px;font-weight:800;color:#F6F1E7">🆓 Gratuit pour toujours</div>' +
        '<div style="font-size:11px;color:#A69C86;line-height:1.5;margin-top:4px">Leçons d\'anglais et de wolof, tourisme, coach vocal, 3 tests d\'examen, entraînement oral, objectifs, parrainage.</div>', "border-color:#25D366;margin-top:0");
      box.appendChild(g);

      var plus = el('<div style="font-size:15px;font-weight:800;color:#F6F1E7">⭐ Diisoo Plus</div>' +
        '<div style="font-size:11px;color:#A69C86;line-height:1.5;margin:4px 0 8px">Tout est débloqué : simulateur IELTS complet, tests de format réel (TOEFL, TOEIC, Cambridge, Duolingo, PTE), niveaux Intermédiaire et Avancé. Pas de renouvellement automatique.</div>' +
        '<div class="dp-seg" style="display:flex;gap:6px"></div>' +
        '<button type="button" class="dp-pay" style="margin-top:10px;' + BTN + '"></button>' +
        '<div style="' + SOUS + '">Wave, Orange Money, Visa ou Mastercard, d\'où que tu sois. Activation immédiate sur ton numéro.</div>');
      var seg = plus.querySelector(".dp-seg"), pay = plus.querySelector(".dp-pay");
      function maj() {
        var d = DUREES.filter(function (x) { return x.id === choix; })[0];
        Array.prototype.forEach.call(seg.children, function (b) {
          var on = b.getAttribute("data-id") === choix;
          b.style.borderColor = on ? "#F3A94E" : "#1E2740";
          b.style.background = on ? "#2A2113" : "#0B0F1C";
        });
        pay.textContent = "💳 Payer " + d.prix;
      }
      DUREES.forEach(function (d) {
        var b = document.createElement("button");
        b.type = "button"; b.setAttribute("data-id", d.id);
        b.style.cssText = "flex:1;min-height:58px;border:1.5px solid #1E2740;border-radius:12px;color:#F6F1E7;padding:6px 2px;font-size:12px;line-height:1.3";
        b.innerHTML = "<b>" + d.court + "</b><br><span style=\"font-size:11px;color:#F0906B\">" + d.prix.replace(" FCFA", " F") + "</span>" +
          (d.note ? "<br><span style=\"font-size:10px;color:#5FC98F\">" + d.note + "</span>" : "");
        b.onclick = function () { choix = d.id; maj(); };
        seg.appendChild(b);
      });
      pay.onclick = function () { payer(choix); };
      maj();
      box.appendChild(plus);
            var c = offre("commercants");
      var pc = el('<div style="display:flex;justify-content:space-between;gap:8px"><div style="font-size:14px;font-weight:800;color:#F6F1E7">🧰 Pack Commerçants</div><div style="font-size:12px;font-weight:700;color:#F0906B;white-space:nowrap">' + (c && c.prix || "5 000 FCFA") + '</div></div>' +
        '<div style="font-size:11px;color:#A69C86;line-height:1.5;margin:4px 0 8px">Anglais de tous les secteurs : pièces détachées, mode, électronique, import Chine. Achat unique, accès à vie.</div>' +
        '<button type="button" class="dp-pc" style="' + BTN + '">💳 Payer ' + (c && c.prix || "5 000 FCFA") + '</button>');
      pc.querySelector(".dp-pc").onclick = function () { payer("commercants"); };
      box.appendChild(pc);

      var rows = ["visa", "coaching", "pro"].map(function (id) {
        var o = offre(id); if (!o) return "";
        var lien = ""; try { lien = premiumLien(o); } catch (e) { lien = "https://wa.me/" + WA; }
        return '<a href="' + lien + '" target="_blank" rel="noopener" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 0;border-top:1px solid #1E2740;text-decoration:none">' +
          '<span style="font-size:13px;color:#F6F1E7;font-weight:700">' + o.icone + " " + o.titre + '</span>' +
          '<span style="font-size:11px;color:#F0906B;white-space:nowrap">' + o.prix + ' ›</span></a>';
      }).join("");
      box.appendChild(el('<div style="font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#F3A94E">Services ABC-GLOBAL</div>' +
        '<div style="font-size:11px;color:#A69C86;margin:2px 0 4px">Besoin d\'un accompagnement humain ? Touche une ligne.</div>' + rows));

      var f = document.createElement("div");
      f.className = "dp-t";
      f.style.cssText = "font-size:11px;color:#8C8064;line-height:1.5;margin:10px 2px 0;text-align:center";
      f.textContent = ETRANGER;
      box.appendChild(f);
    } catch (e) {}
    enCours = false;
  }

  var orig = window.renderPremium;
  if (typeof orig === "function") {
    window.renderPremium = function () {
      ajuster();
      var r = orig.apply(this, arguments);
      setTimeout(habiller, 50);
      return r;
    };
  }
  try {
    new MutationObserver(function () { setTimeout(habiller, 30); })
      .observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
  ajuster();

  window.DiisooPremium = { version: 3, prix: PRIX };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-premium.js",e);}

try{
/* ---- diisoo-guide.js ---- */
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
      "#dg-open b{display:block;font-size:15px;line-height:1.2}#dg-open span.dg-s{display:block;font-size:12.5px;color:#C9BFA8;margin-top:2px}" +
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

}catch(e){console.error("Diisoo : erreur dans diisoo-guide.js",e);}

try{
/* ---- diisoo-seance.js ---- */
/* diisoo-seance.js v1 : séance guidée (Anglais et Wolof ↔ Anglais)
   Un bouton « Séance guidée » dans chaque thème. La voix dit le mot, l'apprenant répète, l'app corrige avec bienveillance
   et passe seule au mot suivant. Mini-quiz, bilan, puis le thème suivant. Rien à chercher, rien à faire défiler. */
(function () {
  "use strict";
  if (window.DiisooSeance) return;
  var $ = function (id) { return document.getElementById(id); };
  function pause(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function norm(s) { return String(s || "").toLowerCase().replace(/[^a-z\s']/g, " ").replace(/\s+/g, " ").trim(); }
  function melanger(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ---------- données du thème en cours ---------- */
  function themeCourant(key) {
    try {
      if (key === "general") {
        var t = GENERAL_THEMES.filter(function (x) { return x.id === generalThemeId; })[0];
        if (!t) return null;
        return { titre: t.title.replace(/🏝️?\s*/g, ""), mots: (t.vocab || []).map(function (v) { return { en: v.en, fr: v.fr, wo: v.wo }; }), key: key, id: t.id };
      }
      if (key === "business") {
        var sk = window.DiisooBiz && DiisooBiz.secteur(), nv = window.DiisooBiz && DiisooBiz.niveau();
        var mod = sk && CHINA_TRADE_WOLOF[sk]; if (!mod || !nv) return null;
        var code = ["debutant", "intermediaire", "avance"][nv - 1];
        var mots = mod.vocab.filter(function (v) { return v.niveau === code; }).map(function (v) { return { en: v.en, fr: v.fr, wo: v.wo }; });
        return { titre: mod.title, mots: mots, key: key, id: sk };
      }
      var W = WOLOF_THEMES.filter(function (x) { return x.id === wolofCat; })[0];
      if (!W) return null;
      return { titre: W.title, mots: LEXICON.filter(function (w) { return w.cat === wolofCat; }), key: key, id: W.id };
    } catch (e) { return null; }
  }

  /* ---------- interface ---------- */
  function css() {
    if ($("dsn-css")) return;
    var s = document.createElement("style"); s.id = "dsn-css";
    s.textContent =
      ".dsn-go{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:52px;margin:8px 0;border-radius:16px;border:0;" +
      "background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;font-weight:800;font-size:15px}" +
      "#dsn{position:fixed;inset:0;z-index:95;background:#0B0F1C;color:#F6F1E7;display:flex;flex-direction:column;padding:68px 18px 18px;overflow-y:auto}" +
      "#dsn.hidden{display:none}" +
      "#dsn .dsn-top{display:flex;align-items:center;justify-content:space-between;gap:8px}" +
      "#dsn .dsn-x{min-height:44px;min-width:44px;border-radius:14px;background:#141A2B;border:1px solid #1E2740;color:#C9BFA8;font-size:13px;padding:0 14px}" +
      "#dsn .dsn-bar{flex:1;height:8px;border-radius:99px;background:#1E2740;overflow:hidden}#dsn .dsn-bar i{display:block;height:100%;background:linear-gradient(90deg,#F3A94E,#E1693F);width:0;transition:width .4s}" +
      "#dsn .dsn-c{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:10px;padding:10px 0}" +
      "#dsn .dsn-lab{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#8C8064}" +
      "#dsn .dsn-big{font-size:34px;font-weight:900;line-height:1.15;max-width:320px}" +
      "#dsn .dsn-wo{font-size:26px;font-weight:800;color:#5FC98F}" +
      "#dsn .dsn-fr{font-size:16px;color:#A69C86}" +
      "#dsn .dsn-orb{width:104px;height:104px;border-radius:50%;margin:14px 0 4px;display:flex;align-items:center;justify-content:center;font-size:44px;background:#141A2B;border:2px solid #1E2740}" +
      "#dsn .dsn-orb.on{background:linear-gradient(135deg,#F3A94E,#E1693F);border-color:transparent;animation:dsnp 1s infinite}" +
      "#dsn .dsn-orb.ok{background:#2C8F5C;border-color:transparent}" +
      "@keyframes dsnp{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(225,105,63,.5)}50%{transform:scale(1.07);box-shadow:0 0 0 18px rgba(225,105,63,0)}}" +
      "#dsn .dsn-msg{min-height:44px;font-size:15px;font-weight:700;max-width:320px}" +
      "#dsn .dsn-row{display:flex;gap:10px;width:100%}" +
      "#dsn .dsn-b{flex:1;min-height:56px;border-radius:16px;font-weight:800;font-size:15px;background:#141A2B;border:1px solid #1E2740;color:#F6F1E7}" +
      "#dsn .dsn-b.p{background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;border:0}" +
      "#dsn .dsn-opt{display:block;width:100%;min-height:56px;margin-top:10px;border-radius:16px;background:#141A2B;border:2px solid #1E2740;color:#F6F1E7;font-weight:700;font-size:16px;padding:10px 14px}" +
      "#dsn .dsn-opt.bon{border-color:#3FAE74;background:#12301f}#dsn .dsn-opt.mal{border-color:#C2542D;background:#33170e}" +
      "#dsn .dsn-stars{font-size:44px;letter-spacing:6px}";
    document.head.appendChild(s);
  }

  var ov = null, S = null;

  function monter() {
    css();
    if (ov) return;
    ov = document.createElement("div"); ov.id = "dsn"; ov.className = "hidden"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Séance guidée");
    document.body.appendChild(ov);
  }
  function entete() {
    return '<div class="dsn-top"><button class="dsn-x" type="button" id="dsn-quit" aria-label="Arrêter la séance">✕ Arrêter</button>' +
      '<div class="dsn-bar"><i id="dsn-prog" style="width:' + S.pct + '%"></i></div></div>';
  }
  function fin() {
    if (!S) return;
    S.jeton++;
    try { if (S.h && S.h.stop) S.h.stop(); } catch (e) {}
    try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
    if (ov) ov.classList.add("hidden");
    S = null;
  }
  function liens() { var q = $("dsn-quit"); if (q) q.onclick = fin; }
  function maj(pct) { S.pct = pct; var b = $("dsn-prog"); if (b) b.style.width = pct + "%"; }
  function dire(t, l) {
    try { return Promise.resolve(speak(t, l, l === "en-US" ? 0.85 : undefined)).catch(function () {}); } catch (e) { return Promise.resolve(); }
  }

  /* ---------- la répétition d'un mot ---------- */
  function ecouterMot(cible, mon) {
    return new Promise(function (res) {
      var h;
      try {
        h = startListening("en-US", 7000, false, function (t) {
          if (mon !== S.jeton) return;
          var el = $("dsn-heard"); if (el) el.textContent = "« " + t + " »";
          try { if (voixJuste(norm(t), norm(cible))) h.stop(); } catch (e) {}
        });
      } catch (e) { res({ text: "", indispo: true }); return; }
      S.h = h;
      h.promise.then(function (r) {
        r = r || {};
        if (r.unsupported || r.error === "not-allowed" || r.error === "service-not-allowed") r.indispo = true;
        res(r);
      });
    });
  }
  function note(w, bon) {
    try {
      if (S.key === "general") bumpStat("diisoo_word_stats", "gen:" + S.id + ":" + w.en, bon ? "correct" : "wrong");
      else if (S.key === "business") bumpStat("diisoo_word_stats", "biz:" + S.id + ":" + w.en, bon ? "correct" : "wrong");
      else bumpWordStat(w.en, bon ? "correct" : "wrong");
      if (bon) { addXP(3); bumpDailyGoal(1); }
    } catch (e) {}
  }

  function carte(w, i, essai, mon) {
    var n = S.mots.length;
    maj(Math.round(i / (n + S.quiz.length) * 100));
    ov.innerHTML = entete() +
      '<div class="dsn-c"><div class="dsn-lab">Mot ' + (i + 1) + ' sur ' + n + '</div>' +
      (S.key !== "general" && w.wo ? '<div class="dsn-wo">🇸🇳 ' + esc(w.wo) + '</div>' : "") +
      '<div class="dsn-big">' + esc(w.en) + '</div><div class="dsn-fr">' + esc(w.fr || "") + '</div>' +
      (S.key === "general" && w.wo ? '<div class="dsn-fr" style="color:#5FC98F">🗣️ ' + esc(w.wo) + '</div>' : "") +
      '<div class="dsn-orb" id="dsn-orb" role="img" aria-label="Micro">🔊</div><div class="dsn-msg" id="dsn-msg">Écoute...</div><div id="dsn-heard" class="dsn-fr"></div></div>' +
      '<div class="dsn-row"><button class="dsn-b" type="button" id="dsn-skip">Passer</button><button class="dsn-b" type="button" id="dsn-again">🔁 Réécouter</button></div>';
    liens();
    var passer = false, reecouter = false;
    $("dsn-skip").onclick = function () { passer = true; try { S.h && S.h.stop(); } catch (e) {} };
    $("dsn-again").onclick = function () { reecouter = true; try { S.h && S.h.stop(); stopAllAudio(); } catch (e) {} };
    var dit = (S.key !== "general" && w.wo && essai === 0) ? dire(w.wo, "wo").then(function () { return mon === S.jeton && pause(250); }) : Promise.resolve();
    return dit.then(function () { return mon === S.jeton && dire(w.en, "en-US"); }).then(function () {
      if (mon !== S.jeton) return "stop";
      var orb = $("dsn-orb"), msg = $("dsn-msg");
      if (orb) { orb.textContent = "🎙️"; orb.className = "dsn-orb on"; }
      if (msg) msg.textContent = "À toi : répète en anglais";
      return ecouterMot(w.en, mon);
    }).then(function (r) {
      if (r === "stop" || mon !== S.jeton) return "stop";
      var orb = $("dsn-orb"), msg = $("dsn-msg");
      if (reecouter) return carte(w, i, 1, mon);
      if (passer) return "suite";
      if (r.indispo) { S.micOff = true; if (msg) msg.textContent = "Micro indisponible : on écoute seulement"; return pause(900).then(function () { return "suite"; }); }
      var heard = norm(r.text), bon = heard && voixJuste(heard, norm(w.en));
      if (bon) {
        S.bons++; note(w, true);
        if (orb) { orb.textContent = "✅"; orb.className = "dsn-orb ok"; }
        var ok = ""; try { ok = encourageMsg(); } catch (e) { ok = "Bravo !"; }
        if (msg) msg.textContent = ok;
        return pause(1100).then(function () { return "suite"; });
      }
      if (essai === 0) {
        if (orb) { orb.textContent = "💪"; orb.className = "dsn-orb"; }
        if (msg) msg.textContent = heard ? "J'ai entendu « " + heard + " ». Écoute encore et réessaie." : "Je n'ai rien entendu. On réessaie.";
        return pause(900).then(function () { return carte(w, i, 1, mon); });
      }
      note(w, false); S.revoir.push(w);
      if (msg) msg.textContent = "Pas grave, on le reverra. Réponse : " + w.en;
      return pause(1300).then(function () { return "suite"; });
    });
  }

  /* ---------- le quiz ---------- */
  function questions() {
    var M = S.mots, out = [];
    var base = melanger(M).slice(0, Math.min(5, M.length));
    base.forEach(function (w) {
      var champ = S.key === "general" ? "fr" : "en";
      var autres = melanger(M.filter(function (x) { return x !== w && x[champ] && x[champ] !== w[champ]; })).slice(0, 2);
      if (autres.length < 1) return;
      var opts = melanger([w[champ]].concat(autres.map(function (x) { return x[champ]; })));
      out.push({ q: S.key === "wolof" ? "Comment dit-on « " + w.wo + " » en anglais ?" : S.key === "business" ? "Comment dit-on « " + w.fr + " » en anglais ?" : "Que veut dire « " + w.en + " » ?", bonne: w[champ], opts: opts, mot: w });
    });
    return out;
  }
  function question(k, mon) {
    var Q = S.quiz[k], n = S.mots.length;
    maj(Math.round((n + k) / (n + S.quiz.length) * 100));
    ov.innerHTML = entete() + '<div class="dsn-c" style="justify-content:flex-start;padding-top:28px"><div class="dsn-lab">Mini-quiz ' + (k + 1) + ' sur ' + S.quiz.length + '</div>' +
      '<div class="dsn-big" style="font-size:24px">' + esc(Q.q) + '</div><div style="width:100%" id="dsn-opts"></div><div class="dsn-msg" id="dsn-msg"></div></div>';
    liens();
    return new Promise(function (res) {
      Q.opts.forEach(function (o) {
        var b = document.createElement("button"); b.type = "button"; b.className = "dsn-opt"; b.textContent = o;
        b.onclick = function () {
          var tous = $("dsn-opts").querySelectorAll("button"); for (var i = 0; i < tous.length; i++) tous[i].disabled = true;
          var bon = o === Q.bonne;
          b.className = "dsn-opt " + (bon ? "bon" : "mal");
          if (!bon) Array.prototype.forEach.call(tous, function (x) { if (x.textContent === Q.bonne) x.className = "dsn-opt bon"; });
          if (bon) { S.qbons++; try { addXP(2); } catch (e) {} }
          $("dsn-msg").textContent = bon ? "✅ Exact !" : "Pas tout à fait. C'était : " + Q.bonne;
          var l = S.key === "wolof" ? "en-US" : "en-US";
          dire(Q.mot.en, l).then(function () { return pause(700); }).then(res);
        };
        $("dsn-opts").appendChild(b);
      });
    }).then(function () { return mon === S.jeton ? "suite" : "stop"; });
  }

  /* ---------- le bilan et le thème suivant ---------- */
  function suivantExiste(key) { return !!boutonSuivant(key); }
  function boutonSuivant(key) {
    if (key === "business") return null;
    var box = $(key === "general" ? "general-tabs" : "wolof-tabs"); if (!box) return null;
    var btns = Array.prototype.slice.call(box.children).filter(function (b) { return b.style.display !== "none"; });
    var th = themeCourant(key); if (!th) return null;
    var titre = String(th.titre).replace(/\s+/g, " ").trim().toLowerCase();
    for (var i = 0; i < btns.length; i++) {
      var tb = btns[i].textContent.replace(/🏝️?/g, "").replace(/N[123]\s*·?/, "").replace(/\s+/g, " ").trim().toLowerCase();
      if (tb.indexOf(titre) >= 0 || titre.indexOf(tb) >= 0) return btns[i + 1] || null;
    }
    return null;
  }
  function bilan() {
    var n = S.mots.length, total = n + S.quiz.length, bons = S.bons + S.qbons;
    var pct = total ? Math.round(bons / total * 100) : 0;
    var etoiles = pct >= 85 ? "⭐⭐⭐" : pct >= 60 ? "⭐⭐" : "⭐";
    var phrase = pct >= 85 ? "Excellent ! Tu maîtrises ce thème." : pct >= 60 ? "Très bien ! Encore un peu et c'est parfait." : "Bon début ! Refais la séance pour progresser.";
    var key = S.key;
    maj(100);
    ov.innerHTML = entete() + '<div class="dsn-c"><div class="dsn-stars">' + etoiles + '</div><div class="dsn-big">' + pct + ' %</div>' +
      '<div class="dsn-msg">' + phrase + '</div><div class="dsn-fr">' + S.bons + ' mots répétés sur ' + n + ' · ' + S.qbons + ' bonnes réponses au quiz</div>' +
      (S.revoir.length ? '<div class="dsn-fr">À revoir : ' + esc(S.revoir.map(function (w) { return w.en; }).join(", ")) + '</div>' : "") + '</div>' +
      '<div class="dsn-row" style="flex-direction:column">' +
      (suivantExiste(key) ? '<button class="dsn-b p" type="button" id="dsn-next">➡️ Thème suivant</button>' : "") +
      '<button class="dsn-b" type="button" id="dsn-redo">🔁 Refaire la séance</button><button class="dsn-b" type="button" id="dsn-end">Terminer</button></div>';
    liens();
    $("dsn-end").onclick = fin;
    $("dsn-redo").onclick = function () { fin(); demarrer(key); };
    var nx = $("dsn-next");
    if (nx) nx.onclick = function () {
      var b = boutonSuivant(key); fin();
      if (b) { b.click(); setTimeout(function () { demarrer(key); }, 900); }
    };
    try { if (typeof speak === "function") speak("Bravo, " + pct + " pour cent", "en-US"); } catch (e) {}
  }

  /* ---------- déroulé ---------- */
  function demarrer(key) {
    monter();
    var th = themeCourant(key);
    if (!th || !th.mots.length) { try { toast("Ouvre d'abord un thème"); } catch (e) {} return; }
    if (S) fin();
    S = { key: key, id: th.id, mots: th.mots, jeton: 1, bons: 0, qbons: 0, revoir: [], quiz: [], pct: 0, h: null };
    S.quiz = questions();
    var mon = S.jeton;
    ov.classList.remove("hidden");
    ov.innerHTML = entete() + '<div class="dsn-c"><div class="dsn-lab">Séance guidée</div><div class="dsn-big">' + esc(th.titre) + '</div>' +
      '<div class="dsn-fr">' + th.mots.length + ' mots · ' + S.quiz.length + ' questions · environ ' + Math.max(2, Math.round(th.mots.length * 0.35)) + ' min</div>' +
      '<div class="dsn-fr">Écoute, répète à voix haute, je corrige. Je passe seul au mot suivant.</div></div>' +
      '<div class="dsn-row"><button class="dsn-b p" type="button" id="dsn-go">▶️ Commencer</button></div>';
    liens();
    /* Le toucher « Commencer » autorise le son et le micro du navigateur */
    $("dsn-go").onclick = function () {
      (function boucle(i) {
        if (!S || mon !== S.jeton) return;
        if (i >= S.mots.length) { suiteQuiz(0); return; }
        carte(S.mots[i], i, 0, mon).then(function (r) { if (r === "stop" || !S || mon !== S.jeton) return; boucle(i + 1); });
      })(0);
    };
    function suiteQuiz(k) {
      if (!S || mon !== S.jeton) return;
      if (k >= S.quiz.length) { bilan(); return; }
      question(k, mon).then(function (r) { if (r === "stop") return; suiteQuiz(k + 1); });
    }
  }

  /* ---------- le bouton dans chaque thème ---------- */
  function poser() {
    ["general", "wolof", "business"].forEach(function (key) {
      var bar = $(key === "business" ? "bizback-sec" : "thbar-" + key), id = "dsn-btn-" + key;
      var ecran = $(key === "general" ? "screen-general" : key === "wolof" ? "screen-wolof" : "screen-business");
      var visible = ecran && !ecran.classList.contains("hidden");
      var b = $(id);
      if (!bar || !visible) { if (b) b.remove(); return; }
      if (b) return;
      b = document.createElement("button"); b.type = "button"; b.id = id; b.className = "dsn-go";
      b.innerHTML = "▶️ Séance guidée : je te guide, tu répètes";
      b.onclick = function () { demarrer(key); };
      bar.parentNode.insertBefore(b, bar.nextSibling);
    });
  }
  css();
  setInterval(function () { try { poser(); } catch (e) {} }, 600);

  window.DiisooSeance = { version: 1, demarrer: demarrer };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-seance.js",e);}

try{
/* ---- diisoo-conversation.js ---- */
/* diisoo-conversation.js v1 : conversation avec l'IA
   Un bouton « Converse avec l'IA » dans chaque secteur Business et chaque thème d'Anglais.
   L'IA joue le client (ou un ami), parle anglais, écoute la réponse de l'apprenant, la corrige gentiment
   et pose la question suivante. 6 échanges, puis un bilan avec les phrases à retenir.
   La clé OpenAI reste côté Supabase (fonction dynamic-processor) : rien de secret dans ce fichier. */
(function () {
  "use strict";
  if (window.DiisooConversation) return;
  var FONCTION = "dynamic-processor";
  var TOURS = 6, LIMITE_JOUR = 40;
  var $ = function (id) { return document.getElementById(id); };
  function pause(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  var SCENES = {
    colobane: "You are a customer in a car spare parts shop in Colobane market, Dakar. The learner is the seller. You want brake pads for a Toyota Corolla and you try to get a good price.",
    sandaga: "You are a customer in a clothes and fabric shop at Sandaga market, Dakar. The learner is the seller. You want to buy shirts and ask about sizes, colours and price.",
    electronique: "You are a customer in an electronics shop in Dakar. The learner is the seller. You want to buy a phone and ask about memory, battery, warranty and price.",
    bazar: "You are a customer in a furniture shop in Dakar. The learner is the seller. You want a sofa and a table and ask about price, delivery and payment.",
    agriculture: "You are a buyer at a fresh vegetable market in Senegal. The learner is the farmer or seller. You want to buy tomatoes and onions and ask about price and quality.",
    chine: "You are a Chinese supplier in Guangzhou. The learner is a Senegalese importer. Talk about price, minimum order, shipping time and payment.",
    tour_hotel: "You are a tourist arriving at a hotel in Dakar. The learner is the hotel receptionist. You have a reservation and ask about the room, breakfast and Wi-Fi.",
    tour_resto: "You are a tourist in a restaurant in Dakar. The learner is the waiter. You want to order Senegalese food and ask what is typical and if it is spicy.",
    tour_guide: "You are a tourist who wants to visit Gorée Island. The learner is the tour guide. Ask about the time, the price, what to see and if you can take photos.",
    tour_transport: "You are a tourist who needs a taxi from Dakar to Saly. The learner is the taxi driver. Ask about the price and the time, and try to negotiate.",
    tour_artisanat: "You are a tourist in a craft market in Senegal. The learner is the craftsman. You like a wooden mask and you want to negotiate the price.",
    tour_agence: "You are a customer in a travel agency in Thiès. The learner is the travel agent. You want a return flight to Paris next month and ask about price, luggage and visa.",
    tour_plage: "You are a tourist on a beach near Saly. The learner works for a boat tour company. You want a boat trip and ask about the price, the duration and safety."
  };

  var S = null, ov = null;

  function jourCle() { return "diisoo_conv_" + new Date().toISOString().slice(0, 10); }
  function utilises() { try { return +localStorage.getItem(jourCle()) || 0; } catch (e) { return 0; } }
  function compter() { try { localStorage.setItem(jourCle(), String(utilises() + 1)); } catch (e) {} }

  function appeler(corps) {
    if (window.__convStub) return Promise.resolve(window.__convStub(corps));
    try { return db.functions.invoke(FONCTION, { body: corps }); } catch (e) { return Promise.reject(e); }
  }
  function demander(texte) {
    compter();
    return appeler({ scene: S.scene, niveau: S.niveau, hist: S.hist, texte: texte || "" }).then(function (r) {
      var d = r && r.data;
      if (typeof d === "string") { try { d = JSON.parse(d); } catch (e) { d = null; } }
      if (!d || d.erreur || !d.reply) return { erreur: (d && d.erreur) || (r && r.error && "ia") || "ia" };
      return d;
    }).catch(function () { return { erreur: "ia" }; });
  }

  function css() {
    if ($("dcv-css")) return;
    var s = document.createElement("style"); s.id = "dcv-css";
    s.textContent =
      ".dcv-go{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:52px;margin:6px 0;border-radius:16px;border:1px solid #3FAE74;background:#10261A;color:#F6F1E7;font-weight:800;font-size:15px}" +
      "#dcv{position:fixed;inset:0;z-index:96;background:#0B0F1C;color:#F6F1E7;display:flex;flex-direction:column;padding:68px 18px 18px;overflow-y:auto}#dcv.hidden{display:none}" +
      "#dcv .top{display:flex;align-items:center;gap:10px}#dcv .x{min-height:44px;min-width:44px;border-radius:14px;background:#141A2B;border:1px solid #1E2740;color:#C9BFA8;font-size:13px;padding:0 14px}" +
      "#dcv .bar{flex:1;height:8px;border-radius:99px;background:#1E2740;overflow:hidden}#dcv .bar i{display:block;height:100%;background:linear-gradient(90deg,#3FAE74,#5FC98F);width:0;transition:width .4s}" +
      "#dcv .zone{flex:1;display:flex;flex-direction:column;gap:12px;justify-content:center;padding:10px 0}" +
      "#dcv .ia{background:#141A2B;border:1px solid #1E2740;border-radius:18px;padding:14px;font-size:20px;font-weight:800;line-height:1.3}" +
      "#dcv .moi{align-self:flex-end;background:#2a1a12;border:1px solid #E1693F;border-radius:18px;padding:10px 14px;font-size:16px;max-width:90%}" +
      "#dcv .fix{background:#12301f;border:1px solid #3FAE74;border-radius:14px;padding:10px 12px;font-size:14px;line-height:1.35}" +
      "#dcv .fix b{color:#5FC98F}#dcv .tip{color:#C9BFA8;font-size:13px;margin-top:4px}" +
      "#dcv .orb{align-self:center;width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;background:#141A2B;border:2px solid #1E2740}" +
      "#dcv .orb.on{background:linear-gradient(135deg,#F3A94E,#E1693F);border-color:transparent;animation:dcvp 1s infinite}@keyframes dcvp{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}" +
      "#dcv .msg{text-align:center;font-size:14px;color:#C9BFA8;min-height:20px}" +
      "#dcv .row{display:flex;gap:10px}#dcv .b{flex:1;min-height:56px;border-radius:16px;font-weight:800;font-size:15px;background:#141A2B;border:1px solid #1E2740;color:#F6F1E7}#dcv .b.p{background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;border:0}";
    document.head.appendChild(s);
  }

  function fin() {
    if (!S) return;
    S.jeton++;
    try { S.h && S.h.stop(); } catch (e) {}
    try { stopAllAudio(); } catch (e) {}
    if (ov) ov.classList.add("hidden");
    S = null;
  }
  function dire(t) { try { return Promise.resolve(speak(t, "en-US", 0.9)).catch(function () {}); } catch (e) { return Promise.resolve(); } }
  function entete(pct) {
    return '<div class="top"><button class="x" type="button" id="dcv-q">✕ Arrêter</button><div class="bar"><i style="width:' + pct + '%"></i></div></div>';
  }
  function liens() { var q = $("dcv-q"); if (q) q.onclick = fin; }

  function ecouter(mon) {
    return new Promise(function (res) {
      var h, dernier = Date.now(), vu = "", debut = false;
      try {
        h = startListening("en-US", 12000, false, function (t) { if (t !== vu) { vu = t; dernier = Date.now(); debut = true; var e = $("dcv-heard"); if (e) e.textContent = "« " + t + " »"; } });
      } catch (e) { res({ texte: "", indispo: true }); return; }
      S.h = h;
      var iv = setInterval(function () {
        if (!S || mon !== S.jeton) { clearInterval(iv); return; }
        if (debut && Date.now() - dernier > 1700) { clearInterval(iv); try { h.stop(); } catch (e) {} }
      }, 250);
      h.promise.then(function (r) { clearInterval(iv); r = r || {}; res({ texte: (r.text || "").trim(), indispo: !!(r.unsupported || r.error === "not-allowed" || r.error === "service-not-allowed") }); });
    });
  }

  function erreurEcran(code) {
    var m = code === "limite" ? "Tu as beaucoup parlé aujourd'hui ! Reviens demain pour continuer." :
      code === "insufficient_quota" ? "L'IA n'est pas encore activée. Essaie le jeu de rôle en attendant." :
      "L'IA est indisponible pour le moment. Essaie le jeu de rôle en attendant.";
    ov.innerHTML = entete(0) + '<div class="zone"><div class="ia" style="font-size:17px">' + esc(m) + '</div></div><div class="row"><button class="b p" type="button" id="dcv-ok">Fermer</button></div>';
    liens(); $("dcv-ok").onclick = fin;
  }

  function jouer(i, mon) {
    if (!S || mon !== S.jeton) return Promise.resolve();
    var dernierIA = S.hist.length ? S.hist[S.hist.length - 1].content : "";
    var pct = Math.round(i / TOURS * 100);
    ov.innerHTML = entete(pct) + '<div class="zone"><div class="ia">' + esc(dernierIA) + '</div><div id="dcv-fix"></div><div class="moi" id="dcv-heard" style="visibility:hidden"></div></div>' +
      '<div class="orb" id="dcv-orb">🔊</div><div class="msg" id="dcv-msg">Écoute...</div>' +
      '<div class="row" style="margin-top:10px"><button class="b" type="button" id="dcv-skip">Passer</button></div>';
    liens();
    var passer = false;
    $("dcv-skip").onclick = function () { passer = true; try { S.h && S.h.stop(); } catch (e) {} };
    return dire(dernierIA).then(function () {
      if (!S || mon !== S.jeton) return null;
      var o = $("dcv-orb"), m = $("dcv-msg"), hh = $("dcv-heard");
      if (o) { o.textContent = "🎙️"; o.className = "orb on"; }
      if (m) m.textContent = "À toi : réponds en anglais";
      if (hh) hh.style.visibility = "visible";
      return ecouter(mon);
    }).then(function (r) {
      if (!S || mon !== S.jeton || !r) return null;
      if (r.indispo) { var m = $("dcv-msg"); if (m) m.textContent = "Micro indisponible. Autorise le micro et réessaie."; return null; }
      if (passer || !r.texte) { var mm = $("dcv-msg"); if (mm) mm.textContent = "Je n'ai rien entendu. On réessaie."; return pause(1000).then(function () { return jouer(i, mon); }); }
      var o2 = $("dcv-orb"); if (o2) { o2.textContent = "💭"; o2.className = "orb"; }
      var m2 = $("dcv-msg"); if (m2) m2.textContent = "L'IA réfléchit...";
      return demander(r.texte).then(function (d) {
        if (!S || mon !== S.jeton) return null;
        if (d.erreur) { erreurEcran(d.erreur); return null; }
        S.hist.push({ role: "user", content: r.texte });
        S.hist.push({ role: "assistant", content: d.reply });
        if (d.fix && d.fix.trim().toLowerCase() !== r.texte.trim().toLowerCase()) S.fixes.push({ avant: r.texte, apres: d.fix, tip: d.tip || "" });
        var z = $("dcv-fix");
        if (z && d.fix && d.fix.trim().toLowerCase() !== r.texte.trim().toLowerCase()) z.innerHTML = '<div class="fix"><b>Mieux :</b> ' + esc(d.fix) + (d.tip ? '<div class="tip">💡 ' + esc(d.tip) + '</div>' : '') + '</div>';
        else if (z) z.innerHTML = '<div class="fix"><b>✅ Très bien !</b></div>';
        return pause(d.fix ? 2600 : 1200).then(function () {
          if (!S || mon !== S.jeton) return null;
          if (i + 1 >= TOURS) return bilan();
          return jouer(i + 1, mon);
        });
      });
    });
  }

  function bilan() {
    var f = S.fixes.slice(0, 4);
    ov.innerHTML = entete(100) + '<div class="zone"><div style="font-size:44px;text-align:center">🎉</div><div class="ia" style="text-align:center">Bravo ! Tu as tenu une vraie conversation en anglais.</div>' +
      (f.length ? '<div style="font-size:13px;color:#8C8064;font-weight:800;text-transform:uppercase">À retenir</div>' + f.map(function (x) {
        return '<div class="fix"><span style="color:#C9BFA8">' + esc(x.avant) + '</span><br><b>→ ' + esc(x.apres) + '</b>' + (x.tip ? '<div class="tip">💡 ' + esc(x.tip) + '</div>' : '') + '</div>';
      }).join("") : '<div class="fix"><b>Aucune erreur à corriger. Excellent !</b></div>') + '</div>' +
      '<div class="row"><button class="b" type="button" id="dcv-redo">🔁 Recommencer</button><button class="b p" type="button" id="dcv-end">Terminer</button></div>';
    liens(); $("dcv-end").onclick = fin;
    var sc = S.scene, nv = S.niveau, ti = S.titre;
    $("dcv-redo").onclick = function () { fin(); demarrer(sc, nv, ti); };
    try { addXP(10); bumpDailyGoal(1); } catch (e) {}
    return null;
  }

  function demarrer(scene, niveau, titre) {
    css();
    if (!ov) { ov = document.createElement("div"); ov.id = "dcv"; ov.className = "hidden"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Conversation avec l'IA"); document.body.appendChild(ov); }
    if (S) fin();
    S = { scene: scene, niveau: niveau, titre: titre, hist: [], fixes: [], jeton: 1 };
    var mon = S.jeton;
    ov.classList.remove("hidden");
    if (utilises() >= LIMITE_JOUR) { erreurEcran("limite"); return; }
    ov.innerHTML = entete(0) + '<div class="zone"><div class="ia" style="text-align:center">💬 ' + esc(titre) + '</div><div class="msg">Je joue le rôle. Tu réponds en anglais, à voix haute. Je corrige gentiment.</div></div>' +
      '<div class="row"><button class="b p" type="button" id="dcv-go">▶️ Commencer</button></div>';
    liens();
    $("dcv-go").onclick = function () {
      ov.innerHTML = entete(0) + '<div class="zone"><div class="ia" style="text-align:center">...</div></div>';
      liens();
      demander("").then(function (d) {
        if (!S || mon !== S.jeton) return;
        if (d.erreur) { erreurEcran(d.erreur); return; }
        S.hist.push({ role: "assistant", content: d.reply });
        jouer(0, mon);
      });
    };
  }

  /* ---------- boutons ---------- */
  function niveauBiz() { try { return ["A1", "A2", "B1"][DiisooBiz.niveau() - 1] || "A2"; } catch (e) { return "A2"; } }
  function niveauGen() { try { return ["A1", "A2", "B1"][DiisooOrga.niveau("general") - 1] || "A2"; } catch (e) { return "A2"; } }
  function titreBiz() { try { return BUSINESS_SECTORS[DiisooBiz.secteur()].titre; } catch (e) { return "Conversation"; } }
  function titreGen() { try { return GENERAL_THEMES.filter(function (t) { return t.id === generalThemeId; })[0].title.replace(/🏝️?\s*/g, ""); } catch (e) { return "Conversation"; } }

  function poser() {
    var cfg = [
      ["business", "dsn-btn-business", "screen-business", function () { var k = DiisooBiz.secteur(); return SCENES[k] ? [SCENES[k], niveauBiz(), titreBiz()] : null; }],
      ["general", "dsn-btn-general", "screen-general", function () { var t = titreGen(); return ["You are a friendly person chatting with the learner about this topic: " + t + ". Ask simple questions about it.", niveauGen(), t]; }]
    ];
    cfg.forEach(function (c) {
      var ancre = $(c[1]), id = "dcv-btn-" + c[0], b = $(id);
      var ecran = $(c[2]), visible = ecran && !ecran.classList.contains("hidden");
      if (!ancre || !visible) { if (b) b.remove(); return; }
      if (b) return;
      b = document.createElement("button"); b.type = "button"; b.id = id; b.className = "dcv-go";
      b.innerHTML = "💬 Converse avec l'IA : joue la scène";
      b.onclick = function () { var p = c[3](); if (p) demarrer(p[0], p[1], p[2]); };
      ancre.parentNode.insertBefore(b, ancre.nextSibling);
    });
  }
  css();
  setInterval(function () { try { poser(); } catch (e) {} }, 700);

  window.DiisooConversation = { version: 1, demarrer: demarrer };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-conversation.js",e);}

try{
/* ---- diisoo-indulgence.js ---- */
/* diisoo-indulgence.js v1 : micro indulgent + voix wolof plus rapide
   1) Les noms propres et les lieux (Senegal, Dakar, Gorée, Awa, Colobane...) ne comptent ni juste ni faux : ils sont ignorés.
   2) Le seuil de validation baisse : il suffit de dire environ 60 % des mots pour passer à l'étape suivante.
   3) Le préchargement de la voix wolof utilise le même texte que la lecture (avant, les phrases avec « ñ » ou des parenthèses
      n'étaient jamais retrouvées dans le cache et la voix repartait de zéro).
   Ne modifie aucun fichier existant : remplace voixJuste, voixHeatmap, practiceWord, practiceBusinessPhrase, prefetchVoix. */
(function () {
  "use strict";
  if (window.__diisooIndulgence) return;
  window.__diisooIndulgence = true;

  function nz(s) {
    return String(s == null ? "" : s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z\s']/g, " ").replace(/\s+/g, " ").trim();
  }
  function lev(a, b) {
    try { if (typeof levenshtein === "function") return levenshtein(a, b); } catch (e) {}
    var m = a.length, n = b.length, p = [], i, j, c;
    for (j = 0; j <= n; j++) p[j] = j;
    for (i = 1; i <= m; i++) {
      var prev = p[0]; p[0] = i;
      for (j = 1; j <= n; j++) {
        c = p[j];
        p[j] = Math.min(p[j] + 1, p[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = c;
      }
    }
    return p[n];
  }
  function sim(a, b) { var L = Math.max(a.length, b.length); return L ? 1 - lev(a, b) / L : 0; }

  /* ---- noms propres et lieux ignorés ---- */
  var ENT = {};
  ("senegal dakar thies goree saly mbour saloum casamance ziguinchor touba kaolack louga saint louis st retba rose " +
   "colobane sandaga centenaire guangzhou china chine africa africain france europe paris london canada usa america " +
   "wolof french english diisoo teranga thieboudienne thiebou yassa mafe dibi bissap wave orange money " +
   "awa fatou moussa ousmane ibrahima mamadou aminata khady babacar abdou cheikh modou omar samba ndeye mariama " +
   "pinterest abc global").split(" ").forEach(function (w) { if (w) ENT[w] = 1; });
  var COMMUN = {}; ("the and you are how what who where when why can could would will please thank thanks yes no hello hi good fine okay ok welcome sorry excuse today tomorrow monday tuesday wednesday thursday friday saturday sunday").split(" ").forEach(function (w) { COMMUN[w] = 1; });
  var DEJA_APPRIS = false;
  function apprendre() {
    if (DEJA_APPRIS) return;
    var textes = [];
    try { Object.keys(CHINA_TRADE_WOLOF).forEach(function (k) { (CHINA_TRADE_WOLOF[k].vocab || []).forEach(function (v) { textes.push(v.en); }); }); } catch (e) {}
    try { Object.keys(BUSINESS_DIALOGUES).forEach(function (k) { (BUSINESS_DIALOGUES[k] || []).forEach(function (l) { textes.push(l.en); }); }); } catch (e) {}
    try { GENERAL_THEMES.forEach(function (t) { (t.vocab || []).forEach(function (v) { textes.push(v.en); }); (t.dialogue || []).forEach(function (l) { textes.push(l.en || l.text); }); }); } catch (e) {}
    textes.forEach(function (s) {
      var mots = String(s || "").split(/\s+/);
      for (var i = 1; i < mots.length; i++) {
        if (/[.!?;:\u2026"\u00AB\u201C(\-\u2013\u2014]$/.test(mots[i - 1]) || /^[-\u2013\u2014]$/.test(mots[i - 1])) continue;
        var w = mots[i].replace(/[^A-Za-zÀ-ÿ']/g, "");
        if (w.length > 2 && /^[A-ZÀ-Þ]/.test(w) && !/^I'/.test(w)) ENT[nz(w)] = 1;
      }
    });
    DEJA_APPRIS = true;
  }
  function mots(s) { return nz(s).split(" ").filter(Boolean); }
  function sansNoms(arr) { return arr.filter(function (w) { return !ENT[w]; }); }

  /* ---- validation indulgente ---- */
  function voixJuste(heard, target) {
    apprendre();
    if (!String(heard || "").trim() || !String(target || "").trim()) return false;
    var H = mots(heard), Tall = mots(target), T = sansNoms(Tall);
    if (!T.length) return H.length > 0;                  /* la cible n'est qu'un nom : tout ce qui est dit passe */
    var Hs = sansNoms(H);
    if (!Hs.length) return false;
    var h = Hs.join(" "), t = T.join(" ");
    if ((" " + h + " ").indexOf(" " + t + " ") > -1) return true;
    if (sim(h, t) >= 0.6) return true;
    var utilise = [], bons = 0;
    T.forEach(function (w) {
      var best = 0, bi = -1;
      for (var i = 0; i < Hs.length; i++) {
        if (utilise[i]) continue;
        var s = Hs[i] === w ? 1 : (Hs[i].indexOf(w) === 0 || w.indexOf(Hs[i]) === 0) && Math.min(w.length, Hs[i].length) >= 3 ? 0.8 : sim(w, Hs[i]);
        if (s > best) { best = s; bi = i; }
      }
      if (best >= 0.6 && bi > -1) { utilise[bi] = true; bons++; }
    });
    return bons >= Math.max(1, Math.round(T.length * 0.6));
  }
  window.voixJuste = voixJuste;

  function voixHeatmap(heard, target) {
    apprendre();
    if (!target) return "";
    var T = String(target).split(" ").filter(Boolean), H = sansNoms(mots(heard)), used = [], total = 0, compte = 0;
    var out = T.map(function (word) {
      var w = nz(word);
      if (!w || ENT[w]) return '<span style="color:#8C8064">⚪ ' + word + "</span>";
      compte++;
      var best = 0, bi = -1;
      for (var i = 0; i < H.length; i++) {
        if (used[i]) continue;
        var s = H[i] === w ? 1 : sim(w, H[i]);
        if (s > best) { best = s; bi = i; }
      }
      if (best >= 0.45 && bi > -1) used[bi] = true;
      total += best >= 0.7 ? 1 : best >= 0.45 ? 0.7 : 0;
      var c = best >= 0.7 ? ["🟢", "#5FC98F", ""] : best >= 0.45 ? ["🟡", "#F3A94E", "text-decoration:underline wavy;"] : ["🔴", "#E1693F", "text-decoration:underline;font-weight:800;"];
      return '<span style="color:' + c[1] + ";" + c[2] + '">' + c[0] + " " + word + "</span>";
    });
    var pct = compte ? Math.round(total / compte * 100) : 100;
    return '<div style="margin-top:6px;font-size:12px;line-height:1.9">' + out.join(" &nbsp;") +
      '<div style="color:#A69C86;font-size:11px">Prononciation : ' + pct + " %" + (ENT[nz(T[0])] || T.some(function (x) { return ENT[nz(x)]; }) ? " · les noms propres ne comptent pas" : "") + "</div></div>";
  }
  window.voixHeatmap = voixHeatmap;

  /* ---- les deux exercices qui comparaient en mots exacts utilisent maintenant la même règle ---- */
  function $(id) { return document.getElementById(id); }
  window.practiceBusinessPhrase = async function (sectionKey, idx) {
    var v = CHINA_TRADE_WOLOF[sectionKey].vocab[idx];
    var res = $("biz-res-" + sectionKey + "-" + idx);
    if (!res) return;
    if (!SR) { res.textContent = "Reconnaissance vocale indisponible sur ce navigateur. Utilise Chrome."; return; }
    res.innerHTML = '<span class="text-[#F0906B]">🎤 Parle... relâche pour valider</span>';
    stopAllAudio();
    var h = startListening("en-US", 15000, true); window.__micHandle = h; if (window.__micReleased) h.stop();
    var r = await h.promise;
    if (r.error === "not-allowed" || r.error === "service-not-allowed") { res.textContent = "Micro bloqué. Autorise le micro dans le navigateur."; return; }
    if (!r.text) { res.textContent = "Rien entendu. Garde le bouton enfoncé pendant que tu parles."; return; }
    var heard = normalize(r.text), target = normalize(v.en);
    if (voixJuste(heard, target)) {
      res.innerHTML = '<span class="text-[#5FC98F] pop-in">✅ ' + encourageMsg() + "</span>";
      addXP(3); bumpDailyGoal(1);
    } else {
      res.innerHTML = '<span class="text-amber-400">J\'ai entendu : « ' + heard + " ». Objectif : « " + v.en + " ». Réessaie.</span>";
    }
    res.innerHTML += voixHeatmap(heard, target);
  };
  window.practiceWord = async function (i) {
    var w = LEXICON[i], res = $("res-" + i);
    if (!res) return;
    if (!SR) { res.textContent = "La reconnaissance vocale n'est pas disponible sur ce navigateur. Utilise Chrome."; return; }
    res.innerHTML = '<span class="text-[#F0906B]">🎤 Parle... relâche pour valider</span>';
    stopAllAudio();
    var h = startListening("en-US", 15000, true); window.__micHandle = h; if (window.__micReleased) h.stop();
    var r = await h.promise;
    if (r.error === "not-allowed" || r.error === "service-not-allowed") { res.textContent = "Micro bloqué. Autorise le micro dans le navigateur."; return; }
    if (!r.text) { res.textContent = "Rien entendu. Garde le bouton enfoncé pendant que tu parles."; return; }
    var heard = normalize(r.text), target = normalize(w.en);
    if (voixJuste(heard, target)) {
      res.innerHTML = '<span class="text-[#5FC98F] pop-in">✅ ' + encourageMsg() + " J'ai entendu : « " + heard + " »</span>";
      bumpWordStat(w.en, "correct");
      addXP(3); bumpDailyGoal(1); checkBilingueBadge();
      var fu = pickFollowUp(heard);
      res.innerHTML += '<p class="text-[11px] text-[#A69C86] mt-1">💬 ' + fu + "</p>";
      speak(fu, "en-US", 0.85);
    } else {
      res.innerHTML = '<span class="text-amber-400">J\'ai entendu : « ' + heard + " ». Objectif : « " + w.en + " ». Réessaie.</span>";
      bumpWordStat(w.en, "wrong");
    }
    res.innerHTML += voixHeatmap(heard, target);
  };

  /* ---- voix wolof : même texte au préchargement et à la lecture, plus quelques nettoyages sûrs ---- */
  try {
    var pw = window.prononciationWolof;
    if (typeof pw === "function" && !pw.__indulg) {
      var pw2 = function (t) {
        t = String(t || "").replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, " ").replace(/[«»"“”]/g, " ").replace(/’/g, "'");
        return pw(t);
      };
      pw2.__indulg = true; window.prononciationWolof = pw2;
    }
  } catch (e) {}
  try {
    var pf = window.prefetchVoix;
    if (typeof pf === "function" && !pf.__indulg) {
      var pf2 = function (textes, langue) {
        var liste = (textes || []).filter(Boolean);
        if (langue === "wo" && typeof window.prononciationWolof === "function") liste = liste.map(function (t) { return window.prononciationWolof(String(t).trim().slice(0, 500)); }).filter(Boolean);
        return pf(liste, langue);
      };
      pf2.__indulg = true; window.prefetchVoix = pf2;
    }
  } catch (e) {}
  /* le préchargement direct (autres scripts) passe par la même transformation */
  var essais = 0, t = setInterval(function () {
    try {
      var v = window.Diisoo && window.Diisoo.voix;
      if (v && v.precharger && !v.precharger.__indulg) {
        var p0 = v.precharger;
        v.precharger = function (textes, langue, nom) {
          var l = textes || [];
          if (langue === "wo" && typeof window.prononciationWolof === "function") l = l.filter(Boolean).map(function (x) { return window.prononciationWolof(String(x).trim().slice(0, 500)); }).filter(Boolean);
          return p0.call(this, l, langue, nom);
        };
        v.precharger.__indulg = true; clearInterval(t);
      }
    } catch (e) {}
    if (++essais > 40) clearInterval(t);
  }, 500);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-indulgence.js",e);}

try{
/* ---- diisoo-priorites.js ---- */
/* diisoo-priorites.js v1 : les thèmes et les secteurs sont rangés par priorité d'usage, dans toute l'application.
   Anglais : Se présenter d'abord, puis nombres, famille, nourriture... ; les thèmes touristiques viennent après les thèmes de base.
   Wolof : Salutations d'abord. Tourisme (Business) : Hôtel, Restaurant, Taxi, Guide, Plage, Artisanat, Agence.
   Niveaux : « Demander son chemin » passe en niveau 1, « Réserver un hôtel » en niveau 2 (difficulté croissante). */
(function () {
  "use strict";
  if (window.__diisooPriorites) return;
  window.__diisooPriorites = true;
  var NIVEAU = { directions: 1, hotel: 2 };
  var ORDRE_EN = ["intro", "time", "family", "food", "directions",
    "tour-accueil", "tour-resto", "tour-taxi",
    "work", "market", "travel", "health", "housing", "hotel",
    "tour-goree", "tour-monuments", "tour-excursion", "tour-plage", "tour-artisanat",
    "interview", "pitch", "orders", "visa", "agri",
    "tour-circuit", "tour-agence", "tour-culture", "tour-urgence"];
  var ORDRE_WO = ["salutations", "famille", "temps", "marche", "nourriture", "voyage", "maison", "corps", "logement"];
  window.DIISOO_ORDRE_TOURISME = ["tour_hotel", "tour_resto", "tour_transport", "tour_guide", "tour_plage", "tour_artisanat", "tour_agence"];

  function rang(liste, id) { var i = liste.indexOf(id); return i < 0 ? 999 : i; }
  function trier() {
    try {
      GENERAL_THEMES.forEach(function (t) {
        var n = NIVEAU[t.id];
        if (n && t.niveau !== n) { t.niveau = n; t.title = String(t.title).replace(/^N\d/, "N" + n); }
      });
      GENERAL_THEMES.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3) || rang(ORDRE_EN, a.id) - rang(ORDRE_EN, b.id); });
      var d = GENERAL_THEMES.find(function (t) { return t.id === "intro"; });
      if (d && typeof generalThemeId !== "undefined" && /^tour-/.test(generalThemeId)) generalThemeId = d.id;
    } catch (e) {}
    try {
      if (Array.isArray(WOLOF_THEMES)) WOLOF_THEMES.sort(function (a, b) { return rang(ORDRE_WO, a.id) - rang(ORDRE_WO, b.id); });
    } catch (e) {}
  }
  trier();
  setTimeout(trier, 1500);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-priorites.js",e);}

try{
/* ---- diisoo-continuer.js ---- */
/* diisoo-continuer.js v1 : bouton « Continuer » sur l'accueil.
   Mémorise la dernière leçon ouverte (Anglais, Wolof ou Business) et la rouvre en un seul toucher. Rien n'est envoyé nulle part. */
(function () {
  "use strict";
  if (window.__diisooContinuer) return;
  window.__diisooContinuer = true;
  var CLE = "diisoo_dernier";
  function lire() { try { return JSON.parse(localStorage.getItem(CLE) || "null"); } catch (e) { return null; } }
  function ecrire(o) { try { localStorage.setItem(CLE, JSON.stringify(o)); } catch (e) {} }
  function $(id) { return document.getElementById(id); }
  function visible(id) { var e = $(id); return !!(e && !e.classList.contains("hidden") && e.offsetParent !== null); }

  function suivre() {
    try {
      if (visible("screen-general") && $("thbar-general") && typeof generalThemeId !== "undefined") {
        var th = GENERAL_THEMES.filter(function (t) { return t.id === generalThemeId; })[0];
        if (th) ecrire({ type: "anglais", cle: th.id, niv: th.niveau || 1, titre: th.title.replace(/^N\d\s*·\s*/, ""), ic: "📚" });
      } else if (visible("screen-wolof") && $("thbar-wolof") && typeof wolofCat !== "undefined") {
        var w = WOLOF_THEMES.filter(function (t) { return t.id === wolofCat; })[0];
        if (w) ecrire({ type: "wolof", cle: w.id, niv: 1, titre: w.title, ic: "🇸🇳" });
      } else if (visible("screen-business") && $("bizback-sec") && window.DiisooBiz) {
        var k = window.DiisooBiz.secteur && window.DiisooBiz.secteur(), n = window.DiisooBiz.niveau && window.DiisooBiz.niveau();
        if (k && BUSINESS_SECTORS[k]) ecrire({ type: "business", cle: k, niv: n || 1, titre: BUSINESS_SECTORS[k].titre, ic: "💼" });
      }
    } catch (e) {}
  }

  function poser() {
    try {
      var d = $("screen-dashboard"), g = $("dg-open"), ex = $("dcont");
      if (!d || d.classList.contains("hidden")) return;
      var s = lire();
      if (!s || !s.cle) { if (ex) ex.remove(); return; }
      var txt = s.titre + (s.type === "anglais" ? " · niveau " + s.niv : s.type === "business" ? " · niveau " + s.niv : "");
      if (ex) { if (ex.getAttribute("data-k") === s.type + s.cle + s.niv) return; ex.remove(); }
      var b = document.createElement("button");
      b.type = "button"; b.id = "dcont"; b.setAttribute("data-k", s.type + s.cle + s.niv);
      b.setAttribute("aria-label", "Continuer : " + txt);
      b.innerHTML = '<span class="dcont-p">▶</span><span class="dcont-t"><b>Continuer</b><small>' + s.ic + " " + txt.replace(/</g, "&lt;") + "</small></span>";
      b.onclick = function () {
        try { if (window.DiisooVoixGuide && window.DiisooVoixGuide.aller) window.DiisooVoixGuide.aller({ type: s.type, cle: s.cle, niv: s.niv }); } catch (e) {}
      };
      if (g && g.parentNode) g.parentNode.insertBefore(b, g.nextSibling); else d.insertBefore(b, d.children[1] || null);
    } catch (e) {}
  }

  var st = document.createElement("style");
  st.textContent =
    "#dcont{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:10px 14px;border-radius:16px;background:linear-gradient(135deg,#E1693F,#F3A94E);color:#1a1208;border:0;min-height:54px}" +
    "#dcont .dcont-p{flex:none;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;font-size:16px}" +
    "#dcont .dcont-t{min-width:0}#dcont b{display:block;font-size:15px;line-height:1.2}" +
    "#dcont small{display:block;font-size:12.5px;line-height:1.25;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    "#dcont:focus-visible{outline:3px solid #fff;outline-offset:2px}";
  document.head.appendChild(st);

  setInterval(suivre, 2000);
  setInterval(poser, 1000);
  setTimeout(poser, 600);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-continuer.js",e);}

try{
/* ---- diisoo-examens-hub.js ---- */
/* diisoo-examens-hub.js v1 : nouveau hub "Examens & visa" (remplace l'ancien simulateur) */
(function () {
  "use strict";
  var CSS =
    "#screen-test-simulation:not(.hidden) #test-phase-label,#screen-test-simulation:not(.hidden) #test-topic-label{display:none!important}" +
    "#screen-test-simulation.xh-on>div:first-child{display:none!important}" +
    "#screen-test-simulation.xh-on #test-picker>*:not(#xh-hub){display:none!important}" +
    "#screen-test-simulation.xh-on>div.flex-1{padding-top:4px!important;padding-bottom:4px!important;justify-content:flex-start!important}" +
    "#screen-test-simulation.xh-on>div:last-child{display:none!important}" +
    "#test-dots{flex-wrap:nowrap!important;gap:3px!important;padding:0 4px}" +
    "#test-dots button{flex:1 1 0;min-width:0;width:auto!important;height:8px!important;border-radius:4px!important;font-size:0!important;padding:0;border:0!important}" +
    "#test-dots button.bg-\\[\\#141A2B\\]{background:#2A3454!important}" +
    "body>div.fixed.bottom-6.pop-in{bottom:auto!important;top:62px!important;max-width:70vw!important;font-size:12.5px!important}" +
    "#screen-test-simulation:not(.xh-on) #test-live{gap:10px}" +
    "#xh-hub{display:flex;flex-direction:column;gap:8px}" +
    "#xh-hub h2{font-size:19px;font-weight:800;color:#F6F1E7;margin:2px 0 0}" +
    "#xh-hub .xh-s{font-size:12.5px;color:#A69C86;margin:0 0 2px}" +
    "#xh-hub .xh-g{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
    "#xh-hub button{text-align:left;border-radius:16px;border:1px solid #1E2740;background:#141A2B;color:#F6F1E7;display:flex;align-items:center;gap:10px;padding:8px 10px;min-height:56px}" +
    "#xh-hub button:active{border-color:#E1693F}" +
    "#xh-hub .xh-i{font-size:24px;line-height:1}" +
    "#xh-hub .xh-n{font-size:14px;font-weight:800;line-height:1.15}" +
    "#xh-hub .xh-n small{display:block;font-size:12px;font-weight:500;color:#A69C86;margin-top:1px}" +
    "#xh-hub .xh-big{min-height:64px;border:2px solid #F0906B;background:linear-gradient(135deg,#C2542D,#E1693F);box-shadow:0 6px 18px rgba(226,105,63,.3)}" +
    "#xh-hub .xh-big .xh-n small{color:#FFE7DA}" +
    "#xh-hub .xh-biz{border-color:#25D366}" +
    "#xh-hub .xh-l{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#F0906B;margin-top:2px}" +
    "#xh-hub .xh-d{font-size:12px;color:#8C8064;text-align:center;line-height:1.35;margin-top:2px}";
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  var EX = [
    ["ielts", "🇬🇧", "IELTS", "Visa A1"], ["toefl", "🎓", "TOEFL", "Speaking"],
    ["toeic", "💼", "TOEIC", "Speaking"], ["duolingo", "🦉", "Duolingo", "English Test"],
    ["cambridge_a2", "📘", "Cambridge A2", "Key"], ["cambridge_b1", "📗", "Cambridge B1", "Preliminary"],
    ["pte", "🧪", "PTE", "Academic"], ["business", "🎯", "Business", "Simulation pro"]
  ];
  function ouv(k) { try { window.DiisooExams2.ouvrir(k); } catch (e) { console.warn("[diisoo] hub", e); } }
  function btn(cls, ic, nm, sm, fn) {
    var b = document.createElement("button"); b.type = "button"; if (cls) b.className = cls;
    b.innerHTML = '<span class="xh-i">' + ic + '</span><span class="xh-n">' + nm + (sm ? "<small>" + sm + "</small>" : "") + "</span>";
    b.onclick = fn; return b;
  }
  function monter() {
    var s = document.getElementById("screen-test-simulation"), p = document.getElementById("test-picker");
    if (!s || !p) return;
    s.classList.add("xh-on");
    var h = document.getElementById("xh-hub");
    if (h) { return; }
    h = document.createElement("div"); h.id = "xh-hub";
    h.innerHTML = "<h2>Examens &amp; visa</h2><p class='xh-s'>Format réel, avec ta voix. Choisis ton examen.</p>";
    var big = btn("xh-big", "🛂", "Entretien visa", "Simule l'entretien consulaire", function () {
      try { generalThemeId = "visa"; openGeneralModule(); } catch (e) {}
    });
    h.appendChild(big);
    var g = document.createElement("div"); g.className = "xh-g";
    EX.forEach(function (e) { g.appendChild(btn(e[0] === "business" ? "xh-biz" : "", e[1], e[2], e[3], function () { ouv(e[0]); })); });
    h.appendChild(g);
    var l = document.createElement("div"); l.className = "xh-l"; l.textContent = "S'entraîner avant"; h.appendChild(l);
    var g2 = document.createElement("div"); g2.className = "xh-g";
    g2.appendChild(btn("", "🤝", "Oral", "En binôme", function () { try { openPairsModule(); } catch (e) {} }));
    g2.appendChild(btn("", "👂", "Écoute", "Comprendre", function () { try { openListeningModule(); } catch (e) {} }));
    h.appendChild(g2);
    var q = btn("", "⬅️", "Retour à l'accueil", "", function () { try { quitTest(); } catch (e) {} });
    q.style.minHeight = "44px"; h.appendChild(q);
    var d = document.createElement("div"); d.className = "xh-d";
    d.textContent = "Préparation indépendante. Diisoo n'est pas affilié aux organismes d'examen."; h.appendChild(d);
    p.insertBefore(h, p.firstChild);
  }
  var o = window.startTestSimulation;
  if (typeof o === "function") window.startTestSimulation = function () {
    var r = o.apply(this, arguments); try { monter(); } catch (e) {} return r;
  };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-examens-hub.js",e);}

try{
/* ---- diisoo-lecons-plus.js ---- */
/* diisoo-lecons-plus.js v1 : lecons epurees (carte mot empilee, actions secondaires sous "Plus", themes sans prefixe) */
(function () {
  "use strict";
  var st = document.createElement("style");
  st.textContent =
    ".fx-em>.flex.justify-between.items-start{flex-direction:column!important;align-items:flex-start!important;gap:3px!important}" +
    ".fx-em>.flex.justify-between.items-start>p:first-child{font-size:24px!important;font-weight:800!important;line-height:1.15!important;color:#F6F1E7!important}" +
    ".fx-em>.flex.justify-between.items-start .text-right{text-align:left!important}" +
    ".fx-em>.flex.justify-between.items-start .text-right>p:first-child{font-size:16px!important;color:#C9BFA8!important}" +
    ".fx-em .dl-sec{display:none!important}" +
    ".fx-em.dl-on .dl-sec{display:block!important}" +
    ".fx-em .dl-plus{width:100%;min-height:40px;border-radius:12px;border:1px solid #1E2740;background:transparent;color:#A69C86;font-size:13px;font-weight:700}";
  document.head.appendChild(st);

  function carte(c) {
    var ex = c.querySelector(".dl-plus");
    var sec = [];
    Array.prototype.forEach.call(c.children, function (e) {
      var t = (e.textContent || "").trim();
      if (e.tagName === "BUTTON" && (/^🎓\s*Coach vocal/.test(t) || e.classList.contains("as-btn"))) sec.push(e);
    });
    sec = sec.filter(function (e) { return !e.classList.contains("dl-sec"); });
    if (!sec.length) return;
    sec.forEach(function (e) { e.classList.add("dl-sec"); });
    if (ex) return;
    var p = document.createElement("button");
    p.type = "button"; p.className = "dl-plus"; p.textContent = "⋯ Plus";
    p.onclick = function () { var on = c.classList.toggle("dl-on"); p.textContent = on ? "▴ Moins" : "⋯ Plus"; };
    c.insertBefore(p, sec[0]);
  }
  function themes() {
    Array.prototype.forEach.call(document.querySelectorAll("#screen-general button,#screen-wolof button"), function (b) {
      var n = b.firstChild;
      var m = n && n.nodeType === 3 && /^(N\d\s·\s)/.exec(n.nodeValue);
      if (m) { var sp = document.createElement("span"); sp.style.display = "none"; sp.textContent = m[1]; n.nodeValue = n.nodeValue.slice(m[1].length); b.insertBefore(sp, n); }
    });
  }
  function passe() {
    Array.prototype.forEach.call(document.querySelectorAll(".fx-em"), carte);
    themes();
  }
  var plan = false;
  try {
    new MutationObserver(function () { if (plan) return; plan = true; setTimeout(function () { plan = false; try { passe(); } catch (e) {} }, 60); })
      .observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
  passe();
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-lecons-plus.js",e);}

try{
/* ---- diisoo-universel.js ---- */
/* diisoo-universel.js v1 : compatibilite petits ecrans (<=700px de haut), polices minimales */
(function () {
  "use strict";
  var st = document.createElement("style");
  st.textContent =
    ".lvl-sub{font-size:12px!important}" +
    "@media (max-height:700px){" +
    "#xh-hub{gap:5px!important}#xh-hub .xh-s,#xh-hub h2{display:none!important}" +
    "#xh-hub button{min-height:46px!important;padding:5px 9px!important}#xh-hub .xh-big{min-height:52px!important}" +
    "#xh-hub .xh-i{font-size:20px!important}#xh-hub .xh-d{font-size:11.5px!important;margin-top:0!important}" +
    ".fx-em{padding:10px!important}.fx-em>.flex.justify-between.items-start>p:first-child{font-size:20px!important}" +
    ".fx-em .dl-plus{min-height:36px!important}.fx-em>div[data-em],.fx-em:before{font-size:30px!important}" +
    ".lvl-btn{min-height:54px!important;padding:6px 12px!important}.lvl-picker{gap:6px!important}" +
    "body.dnav-on [role=main]{padding-top:0!important;padding-bottom:0!important}" +
    "}" +
    "@media (max-height:600px){body.dnav-on{padding-top:48px!important}.fx-em{padding:8px!important}.lvl-btn{min-height:48px!important}}";
  document.head.appendChild(st);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-universel.js",e);}

try{
/* ---- diisoo-arrivee.js ---- */
/* diisoo-arrivee.js v2 : arrivee par lien (?source=tiktok) = mini-lecon d'1 minute. Par defaut : entretien visa. Avec &mini=wolof : Wolof > Anglais #2 (Nanga def, Jerejef, Ndank ndank). &revoir=1 force l'affichage. */
(function () {
  "use strict";
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var q = {};
  try { new URLSearchParams(location.search).forEach(function (v, k) { q[k] = v; }); } catch (e) {}
  var src = String(q.source || q.utm_source || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 24);
  if (!src) return;
  var MODE = String(q.mini || "").toLowerCase() === "wolof" ? "wo" : "visa";
  var CLE_VU = MODE === "wo" ? "diisoo_arrivee_vu_wo" : "diisoo_arrivee_vu";
  ecrire("diisoo_source", src);
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  setTimeout(function () { noter("arrivee", src); }, 3000);
  if (lire(CLE_VU) === "1" && q.mini !== "1" && q.revoir !== "1") return;

  var QUESTION = "Why do you want to study in Canada?";
  var MODELE = "I want to study in Canada because I want to improve my skills.";
  var st = document.createElement("style");
  st.textContent =
    "#dar{position:fixed;inset:0;z-index:99990;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px 20px 24px;font-family:inherit;text-align:center}" +
    "#dar .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#dar h1{font-size:24px;font-weight:800;line-height:1.2;margin:0}" +
    "#dar .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#dar .r{min-height:62px;font-size:17px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#dar button{border:0;border-radius:18px;font-weight:800;min-height:52px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#dar .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}" +
    "#dar .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}" +
    "#dar .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#dar .m{width:92px;height:92px;border-radius:50%;max-width:92px;padding:0;font-size:36px;background:#E1693F;color:#fff;box-shadow:0 0 0 0 rgba(225,105,63,.6)}" +
    "#dar .m.on{animation:darp 1s infinite}@keyframes darp{70%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#dar .d{font-size:12px;color:#8C8064;max-width:320px;line-height:1.35}" +
    "#dar .ok{color:#25D366}#dar .or{color:#FFAA3C}" +
    "#dar .wo{font-size:34px;font-weight:800;line-height:1.15;color:#E1693F;background:#F6F1E7;border-radius:20px;padding:18px 20px;max-width:320px;width:100%;box-sizing:border-box}" +
    "#dar .en{min-height:44px;font-size:26px;font-weight:800;color:#6FA8FF;max-width:320px}" +
    "#dar .li{font-size:19px;font-weight:700;line-height:1.5;max-width:320px}" +
    "#dar .li b{color:#E1693F}";
  document.head.appendChild(st);

  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }
  function fermer() { var e = document.getElementById("dar"); if (e) e.remove(); ecrire(CLE_VU, "1"); }
  var MOTS = [
    { wo: "Nanga def ?", say: "Nanga def", en: "How are you?", cle: "how" },
    { wo: "Jërëjëf", say: "Jërëjëf", en: "Thank you", cle: "thank" },
    { wo: "Ndank ndank", say: "Ndank ndank", en: "Slowly", cle: "slow" }
  ];
  function ouvrirWolof() {
    if (document.getElementById("dar")) return;
    var o = document.createElement("div"); o.id = "dar";
    document.body.appendChild(o);
    var i = 0, enCours = false;
    function dire(t, l, r) { try { if (typeof speak === "function") return speak(t, l, r); } catch (e) {} }
    function etape() {
      var m = MOTS[i];
      o.innerHTML =
        '<div class="k">Wolof &gt; Anglais #2 · mot ' + (i + 1) + ' sur 3</div>' +
        '<h1>Écoute, puis dis-le en anglais</h1>' +
        '<div class="wo" id="dw-wo">' + m.wo + '</div>' +
        '<button class="b2" id="dw-ec" type="button">🔊 Écouter en wolof</button>' +
        '<button class="b1" id="dw-voir" type="button">Voir l\'anglais</button>' +
        '<div class="en" id="dw-en"></div>' +
        '<button class="m" id="dw-mic" type="button" aria-label="Répéter" style="display:none">🎙️</button>' +
        '<div class="r" id="dw-r"></div>' +
        '<button class="b1" id="dw-suite" type="button" style="display:none">' + (i < 2 ? "Mot suivant" : "Terminer") + '</button>' +
        '<button class="b3" id="dw-pass" type="button">Passer</button>';
      var en = document.getElementById("dw-en"), r = document.getElementById("dw-r"), mic = document.getElementById("dw-mic"), suite = document.getElementById("dw-suite"), voir = document.getElementById("dw-voir");
      document.getElementById("dw-ec").onclick = function () { dire(m.say, "wo", 0.8); };
      document.getElementById("dw-pass").onclick = function () { noter("mini_wo_passer", src + ":" + (i + 1)); fermer(); };
      voir.onclick = function () {
        voir.style.display = "none";
        en.textContent = "= " + m.en;
        mic.style.display = "block"; suite.style.display = "block";
        r.textContent = "Touche le micro et répète : " + m.en;
        noter("mini_wo_mot", src + ":" + (i + 1));
        dire(m.en, "en-US", 0.9);
      };
      suite.onclick = function () { i++; if (i < MOTS.length) etape(); else fin(); };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici. Continue."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null;
        try { h = startListening("en-US", 6000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.toLowerCase().indexOf(m.cle) >= 0;
          r.innerHTML = '<span class="' + (bon ? "ok" : "or") + '">' + (bon ? "Bien joué !" : "Presque, réessaie.") + '</span><br>« ' + t.replace(/</g, "&lt;") + ' »';
          noter("mini_wo_reponse", src + ":" + (i + 1));
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
      setTimeout(function () { dire(m.say, "wo", 0.8); }, 600);
    }
    function fin() {
      noter("mini_wo_fin", src);
      var lien = "https://diisoo.sn/?source=whatsapp&mini=wolof";
      var txt = "Tu sais dire « Nanga def » en anglais ? Essaie sur Diisoo, c'est gratuit : " + lien;
      o.innerHTML =
        '<div class="k">Bravo</div>' +
        '<h1>3 mots wolof, 3 mots anglais</h1>' +
        '<div class="li"><b>Nanga def ?</b> = How are you?<br><b>Jërëjëf</b> = Thank you<br><b>Ndank ndank</b> = Slowly</div>' +
        '<button class="b1" id="dw-go" type="button">Continuer sur Diisoo</button>' +
        '<button class="b2" id="dw-wa" type="button">Envoyer à un ami (WhatsApp)</button>';
      document.getElementById("dw-go").onclick = function () { fermer(); };
      document.getElementById("dw-wa").onclick = function () { noter("mini_wo_partage", src); try { window.open("https://wa.me/?text=" + encodeURIComponent(txt), "_blank"); } catch (e) {} };
    }
    noter("mini_wo_vue", src);
    etape();
  }
  function ouvrir() {
    if (MODE === "wo") return ouvrirWolof();
    if (document.getElementById("dar")) return;
    var o = document.createElement("div"); o.id = "dar";
    o.innerHTML =
      '<div class="k">Entretien visa · 1 minute</div>' +
      '<h1>Écoute la question, réponds à voix haute</h1>' +
      '<div class="q" id="dar-q">' + QUESTION + '</div>' +
      '<button class="b2" id="dar-ec" type="button">🔊 Écouter la question</button>' +
      '<button class="m" id="dar-mic" type="button" aria-label="Parler">🎙️</button>' +
      '<div class="r" id="dar-r">Touche le micro et réponds en anglais.</div>' +
      '<div id="dar-fin" style="display:none;width:100%;max-width:320px;flex-direction:column;gap:8px;align-items:center">' +
      '<button class="b2" id="dar-mod" type="button">🔊 Écouter une réponse modèle</button>' +
      '<button class="b1" id="dar-visa" type="button">Continuer l\'entretien visa</button>' +
      '<button class="b2" id="dar-ex" type="button">Voir tous les examens</button></div>' +
      '<button class="b3" id="dar-pass" type="button">Passer</button>' +
      '<div class="d">Préparation indépendante. Diisoo n\'est pas affilié aux organismes d\'examen.</div>';
    document.body.appendChild(o);
    var r = document.getElementById("dar-r"), mic = document.getElementById("dar-mic"), fin = document.getElementById("dar-fin");
    document.getElementById("dar-ec").onclick = function () { parler(QUESTION); };
    document.getElementById("dar-mod").onclick = function () { parler(MODELE); };
    document.getElementById("dar-pass").onclick = function () { noter("mini_passer", src); fermer(); };
    document.getElementById("dar-visa").onclick = function () { noter("mini_visa", src); choisir("visa"); };
    document.getElementById("dar-ex").onclick = function () { noter("mini_examens", src); choisir("examens"); };
    var enCours = false;
    mic.onclick = function () {
      if (enCours) return;
      if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici. Continue avec les examens."; fin.style.display = "flex"; return; }
      enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
      var h = null;
      try { h = startListening("en-US", 7000, false); } catch (e) { h = null; }
      Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
        enCours = false; mic.classList.remove("on");
        var t = res && res.text ? String(res.text).trim() : "";
        if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; fin.style.display = "flex"; return; }
        if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
        var n = t.split(/\s+/).length;
        r.innerHTML = '<span class="' + (n >= 4 ? "ok" : "or") + '">' + (n >= 4 ? "Bien joué !" : "Essaie une phrase plus longue.") + '</span><br>« ' + t.replace(/</g, "&lt;") + ' »';
        noter("mini_reponse", src);
        if (n >= 4) fin.style.display = "flex";
      }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; fin.style.display = "flex"; });
    };
    noter("mini_vue", src);
    setTimeout(function () { parler(QUESTION); }, 800);
  }
  function visible(id) { var d = document.getElementById(id); return !!(d && !d.classList.contains("hidden") && d.offsetParent); }
  function agir(intent) {
    if (intent === "visa") { try { generalThemeId = "visa"; openGeneralModule(); } catch (e) {} }
    else if (intent === "examens") { try { startTestSimulation(); } catch (e) {} }
  }
  // Apres l'inscription : si le visiteur avait choisi une suite, on l'y emmene une seule fois.
  var tentatives = 0;
  var suite = setInterval(function () {
    var it = lire("diisoo_arrivee_suite");
    if (!it || ++tentatives > 900) { clearInterval(suite); return; }
    if (visible("screen-dashboard") && !document.getElementById("dar")) { ecrire("diisoo_arrivee_suite", ""); clearInterval(suite); agir(it); }
  }, 1000);
  function choisir(intent) {
    fermer();
    if (visible("screen-dashboard")) agir(intent); else ecrire("diisoo_arrivee_suite", intent);
  }
  function demarrer() { setTimeout(ouvrir, 500); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer); else demarrer();
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-arrivee.js",e);}

try{
/* ---- diisoo-question-jour.js ---- */
/* diisoo-question-jour.js v1 : carte "Question du jour" (entretien visa, examens, business) + serie de jours */
(function () {
  "use strict";
  var Q = [
    ["Why do you want to study in Canada?", "I want to study in Canada because I want to improve my skills."],
    ["What is your name and where are you from?", "My name is Awa and I am from Senegal."],
    ["What do you do for a living?", "I work in a travel agency in Thies."],
    ["Why do you want to visit France?", "I want to visit France to see my family and discover the country."],
    ["How long will you stay?", "I will stay for two weeks."],
    ["Who will pay for your trip?", "I will pay for the trip myself."],
    ["Do you have family in the country you want to visit?", "Yes, I have a cousin who lives there."],
    ["What is the purpose of your visit?", "The purpose of my visit is tourism."],
    ["Where will you stay?", "I will stay at a hotel in the city center."],
    ["Do you have a return ticket?", "Yes, I have a return ticket for the same month."],
    ["Do you have a job in your country?", "Yes, I have a job and my family is in Senegal."],
    ["Are you married?", "Yes, I am married and I have two children."],
    ["Why should we give you a visa?", "You should give me a visa because I will come back to my family and my job."],
    ["What will you study?", "I will study business management."],
    ["Why did you choose this university?", "I chose this university because it has a good program."],
    ["How will you pay for your studies?", "My family will pay for my studies."],
    ["What are your plans after your studies?", "After my studies, I will come back to Senegal and start my business."],
    ["Have you travelled abroad before?", "Yes, I travelled to Gambia last year."],
    ["Tell me about your job.", "I work in a travel agency. I help customers book flights and hotels."],
    ["How is your English?", "My English is good and I practise every day."],
    ["Why do you want to learn English?", "I want to learn English for my studies and my work."],
    ["Can you describe your family?", "I have a big family. I live with my parents and my two sisters."],
    ["What do you do in your free time?", "In my free time, I like football and music."],
    ["Tell me about your hometown.", "I come from Thies. It is a busy city near Dakar."],
    ["What is your favourite food?", "My favourite food is chicken with rice."],
    ["What time do you get up?", "I get up at six o'clock every morning."],
    ["Can you introduce your business?", "I sell clothes and I want to grow my business."],
    ["How much does this cost?", "This costs ten thousand francs."],
    ["Can you give me a discount?", "Can you give me a better price, please?"],
    ["Where is the nearest bank?", "The bank is next to the market, on the left."]
  ];
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function jour(dec) { var d = new Date(); d.setDate(d.getDate() + (dec || 0)); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function idx() { var d = new Date(); var n = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 0, 1)) / 86400000); return ((n % Q.length) + Q.length) % Q.length; }
  function etat() { var e; try { e = JSON.parse(lire("diisoo_qj") || "{}"); } catch (x) { e = {}; } return { last: e.last || "", serie: e.serie || 0 }; }
  function serieActive() { var e = etat(); return (e.last === jour(0) || e.last === jour(-1)) ? e.serie : 0; }
  function faitAujourdhui() { return etat().last === jour(0); }

  var st = document.createElement("style");
  st.textContent =
    "#dqj{order:3;display:flex;align-items:center;gap:10px;width:100%;min-height:50px;padding:6px 14px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;text-align:left}" +
    "#dqj .a{font-size:22px}#dqj .t{flex:1;font-size:14.5px;font-weight:800;line-height:1.2}#dqj .t small{display:block;font-size:12px;font-weight:600;color:#A69C86}" +
    "#dqj .s{font-size:13px;font-weight:800;color:#FFAA3C;white-space:nowrap}#dqj.ok{border-color:#25D366}#dqj.ok .s{color:#25D366}" +
    "@media (max-height:700px){#screen-dashboard:not(.hidden) .grid.grid-cols-2{grid-template-rows:repeat(2,142px)!important}}" +
    "#dqo{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px;text-align:center}" +
    "#dqo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#dqo .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#dqo .r{min-height:62px;font-size:17px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#dqo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#dqo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#dqo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#dqo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#dqo .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#dqo .m.on{animation:dqp 1s infinite}@keyframes dqp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#dqo .ok{color:#25D366}#dqo .or{color:#FFAA3C}";
  document.head.appendChild(st);

  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }
  function ouvrir() {
    if (document.getElementById("dqo")) return;
    var i = idx(), qq = Q[i];
    var o = document.createElement("div"); o.id = "dqo";
    o.innerHTML =
      '<div class="k">Question du jour · ' + (i + 1) + '/' + Q.length + '</div>' +
      '<div class="q">' + qq[0] + '</div>' +
      '<button class="b2" id="dqo-ec" type="button">🔊 Écouter la question</button>' +
      '<button class="m" id="dqo-mic" type="button" aria-label="Parler">🎙️</button>' +
      '<div class="r" id="dqo-r">Touche le micro et réponds en anglais.</div>' +
      '<div id="dqo-fin" style="display:none;width:100%;flex-direction:column;gap:8px;align-items:center">' +
      '<button class="b2" id="dqo-mod" type="button">🔊 Écouter une réponse modèle</button>' +
      '<button class="b1" id="dqo-sh" type="button">Partager sur WhatsApp</button></div>' +
      '<button class="b3" id="dqo-x" type="button">Fermer</button>';
    document.body.appendChild(o);
    var r = document.getElementById("dqo-r"), mic = document.getElementById("dqo-mic"), fin = document.getElementById("dqo-fin");
    document.getElementById("dqo-ec").onclick = function () { parler(qq[0]); };
    document.getElementById("dqo-mod").onclick = function () { parler(qq[1]); };
    document.getElementById("dqo-x").onclick = function () { o.remove(); majCarte(); };
    document.getElementById("dqo-sh").onclick = function () {
      var txt = "Ma question d'entretien du jour sur Diisoo : « " + qq[0] + " ». Essaie, c'est gratuit : https://diisoo.sn/?source=whatsapp";
      noter("qj_partage");
      try { if (navigator.share) { navigator.share({ text: txt }); return; } } catch (e) {}
      window.open("https://wa.me/?text=" + encodeURIComponent(txt), "_blank");
    };
    var enCours = false;
    mic.onclick = function () {
      if (enCours) return;
      if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
      enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
      var h = null; try { h = startListening("en-US", 7000, false); } catch (e) { h = null; }
      Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
        enCours = false; mic.classList.remove("on");
        var t = res && res.text ? String(res.text).trim() : "";
        if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
        if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
        var n = t.split(/\s+/).length;
        if (n < 3) { r.innerHTML = '<span class="or">Essaie une phrase plus longue.</span><br>« ' + t.replace(/</g, "&lt;") + ' »'; return; }
        var e = etat(), s = e.serie;
        if (e.last !== jour(0)) { s = (e.last === jour(-1)) ? e.serie + 1 : 1; ecrire("diisoo_qj", JSON.stringify({ last: jour(0), serie: s })); }
        r.innerHTML = '<span class="ok">Bravo ! Série : ' + s + ' jour' + (s > 1 ? 's' : '') + '</span><br>« ' + t.replace(/</g, "&lt;") + ' »';
        fin.style.display = "flex"; noter("qj_reponse", String(s)); majCarte();
      }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
    };
    noter("qj_vue");
    setTimeout(function () { parler(qq[0]); }, 700);
  }
  function majCarte() {
    var c = document.getElementById("dqj"); if (!c) return;
    var fait = faitAujourdhui(), s = serieActive();
    c.className = fait ? "ok" : "";
    c.innerHTML = '<span class="a">' + (fait ? "✅" : "🎯") + '</span><span class="t">Question du jour<small>' + (fait ? "Bravo, à demain !" : "Réponds à voix haute, 1 minute") + '</small></span><span class="s">' + (s ? "🔥 " + s : "") + '</span>';
  }
  function monter() {
    var d = document.getElementById("screen-dashboard"); if (!d) return;
    if (document.getElementById("dqj")) return;
    var rev = document.getElementById("revision-card");
    if (!rev || !rev.parentNode) return;
    var b = document.createElement("button"); b.type = "button"; b.id = "dqj";
    b.onclick = ouvrir;
    rev.parentNode.insertBefore(b, rev.nextSibling);
    majCarte();
  }
  var essais = 0;
  (function boucle() { try { monter(); } catch (e) {} if (++essais < 40) setTimeout(boucle, 750); })();
  try { new MutationObserver(function () { if (!document.getElementById("dqj")) { try { monter(); } catch (e) {} } }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-question-jour.js",e);}

try{
/* ---- diisoo-quete.js ---- */
/* diisoo-quete.js v1 : Quete du jour (3 missions) + coffre a recompense variable + mot du jour wolof/anglais */
(function () {
  "use strict";
  /* Mots du jour : [wolof, francais, anglais, phrase anglaise d'exemple] */
  var MOTS = [
    ["Jërëjëf", "merci", "thank you", "Thank you for your help."],
    ["Ndank", "doucement", "slowly", "Please speak slowly."],
    ["Xaalis", "argent", "money", "I need money for the ticket."],
    ["Jaay", "vendre", "to sell", "I sell clothes at the market."],
    ["Jënd", "acheter", "to buy", "I want to buy this bag."],
    ["Ndox", "eau", "water", "Can I have some water, please?"],
    ["Mburu", "pain", "bread", "I eat bread in the morning."],
    ["Ceeb", "riz", "rice", "We eat rice for lunch."],
    ["Nelaw", "dormir", "to sleep", "I go to sleep at ten."],
    ["Liggéey", "travailler", "to work", "I work in a travel agency."],
    ["Jàng", "apprendre, étudier", "to learn", "I learn English every day."],
    ["Dégg", "entendre, comprendre", "to hear", "I can't hear you."],
    ["Wax", "parler", "to speak", "Can you speak English?"],
    ["Xam", "savoir, connaître", "to know", "I know this city well."],
    ["Bëgg", "vouloir, aimer", "to want", "I want to visit France."],
    ["Baax", "bon", "good", "This is a good price."],
    ["Réew", "pays", "country", "I love my country."],
    ["Kër", "maison", "house", "My house is in Thiès."],
    ["Mbokk", "parent, proche", "relative", "I have a relative in Paris."],
    ["Xale", "enfant", "child", "My child goes to school."],
    ["Tay", "aujourd'hui", "today", "I am busy today."],
    ["Suba", "demain", "tomorrow", "I will call you tomorrow."],
    ["Démb", "hier", "yesterday", "I travelled yesterday."],
    ["Guddi", "nuit", "night", "The bus leaves at night."],
    ["Bés", "jour", "day", "Have a nice day."],
    ["Ñaata", "combien", "how much", "How much is this?"],
    ["Fan", "où", "where", "Where is the bank?"],
    ["Naka", "comment", "how", "How do you say this in English?"],
    ["Lan", "quoi, quel", "what", "What is your name?"],
    ["Waaw", "oui", "yes", "Yes, of course."],
    ["Déedéet", "non", "no", "No, thank you."],
    ["Teranga", "hospitalité", "hospitality", "Senegal is famous for its hospitality."],
    ["Njaay", "commerce", "trade, business", "My business is growing."],
    ["Tukki", "voyage", "trip, journey", "I am preparing my trip."],
    ["Bataaxal", "lettre, message", "letter", "I have a letter for you."],
    ["Paspoor", "passeport", "passport", "This is my passport."],
    ["Njaboot", "famille", "family", "My family lives in Senegal."],
    ["Liggéeykat", "travailleur", "worker", "He is a good worker."],
    ["Dem", "partir, aller", "to go", "I go to Dakar every week."]
  ];
  /* Phrases rares gagnees dans les coffres : [francais, anglais] */
  var RARES = [
    ["Pouvez-vous répéter, s'il vous plaît ?", "Could you repeat that, please?"],
    ["Je n'ai pas compris.", "I didn't catch that."],
    ["Parlez plus lentement, s'il vous plaît.", "Could you speak more slowly, please?"],
    ["Quel est votre meilleur prix ?", "What is your best price?"],
    ["Je reviendrai demain.", "I will come back tomorrow."],
    ["Enchanté de faire votre connaissance.", "Nice to meet you."],
    ["Où se trouve la gare routière ?", "Where is the bus station?"],
    ["Je voudrais réserver une chambre.", "I would like to book a room."],
    ["Combien de temps dure le voyage ?", "How long does the journey take?"],
    ["Je suis ici pour affaires.", "I am here on business."],
    ["Pouvez-vous m'aider ?", "Can you help me, please?"],
    ["Je cherche un hôtel pas cher.", "I am looking for a cheap hotel."]
  ];
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function jour(d) { var x = new Date(); x.setDate(x.getDate() + (d || 0)); return x.getFullYear() + "-" + ("0" + (x.getMonth() + 1)).slice(-2) + "-" + ("0" + x.getDate()).slice(-2); }
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function json(k, def) { try { var v = JSON.parse(lire(k) || "null"); return v == null ? def : v; } catch (e) { return def; } }
  function etat() {
    var e = json("diisoo_quete", {});
    if (e.date !== jour(0)) { e = { date: jour(0), mot: false, coffre: false, deb: false, rec: "" }; ecrire("diisoo_quete", JSON.stringify(e)); }
    return e;
  }
  function sauver(e) { ecrire("diisoo_quete", JSON.stringify(e)); }
  function idxMot() { var d = new Date(); var n = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 0, 1)) / 86400000); return ((n % MOTS.length) + MOTS.length) % MOTS.length; }
  function m1() { var g = json("diisoo_goal", {}); return g.date === jour(0) && (g.done || 0) >= 3; }
  function m2() { var q = json("diisoo_qj", {}); return q.last === jour(0); }
  function m3() { return !!etat().mot; }
  function faites() { return (m1() ? 1 : 0) + (m2() ? 1 : 0) + (m3() ? 1 : 0); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }
  function esc(s) { return String(s).replace(/</g, "&lt;"); }

  var st = document.createElement("style");
  st.textContent =
    "#dqq{order:3;display:flex;align-items:center;gap:10px;width:100%;min-height:54px;padding:6px 14px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;text-align:left}" +
    "#dqq .a{font-size:24px}#dqq .t{flex:1;font-size:14.5px;font-weight:800;line-height:1.2}#dqq .t small{display:block;font-size:12px;font-weight:600;color:#A69C86}" +
    "#dqq .p{display:flex;gap:4px}#dqq .p i{width:12px;height:12px;border-radius:50%;background:#2A3454;display:block}#dqq .p i.on{background:#25D366}" +
    "#dqq.pret{border-color:#FFAA3C;animation:dqqp 1.6s infinite}@keyframes dqqp{0%{box-shadow:0 0 0 0 rgba(255,170,60,.5)}100%{box-shadow:0 0 0 14px rgba(255,170,60,0)}}" +
    "#dqq.ouvert{border-color:#25D366}" +
    "#dqqo{position:fixed;inset:0;z-index:99992;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center;overflow:auto}" +
    "#dqqo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#dqqo .l{width:100%;max-width:330px;display:flex;flex-direction:column;gap:8px}" +
    "#dqqo .mi{display:flex;align-items:center;gap:10px;text-align:left;border:1px solid #2A3454;background:#141A2B;border-radius:14px;padding:10px 12px;font-size:15px;font-weight:700;min-height:48px}" +
    "#dqqo .mi.ok{border-color:#25D366}#dqqo .mi .c{font-size:20px}" +
    "#dqqo .w{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;max-width:330px;width:100%}" +
    "#dqqo .w b{display:block;font-size:30px;line-height:1.1}#dqqo .w span{display:block;font-size:15px;margin-top:4px;font-weight:700}" +
    "#dqqo .w em{display:block;font-style:normal;font-size:14px;margin-top:8px;color:#5a5f73}" +
    "#dqqo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:330px}" +
    "#dqqo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#dqqo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#dqqo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#dqqo .cf{font-size:84px;line-height:1}#dqqo .cf.sec{animation:dqqs .5s infinite alternate}@keyframes dqqs{0%{transform:rotate(-8deg)}100%{transform:rotate(8deg)}}" +
    "#dqqo .rec{font-size:19px;font-weight:800;line-height:1.3;max-width:320px}#dqqo .ok{color:#25D366}";
  document.head.appendChild(st);

  function majCarte() {
    var c = document.getElementById("dqq"); if (!c) return;
    var n = faites(), e = etat(), pret = n >= 3 && !e.coffre;
    c.className = pret ? "pret" : (e.coffre ? "ouvert" : "");
    var sous = e.coffre ? "Coffre ouvert, à demain !" : (pret ? "Ton coffre t'attend, ouvre-le" : (3 - n) + " mission" + (3 - n > 1 ? "s" : "") + " pour ouvrir le coffre");
    c.innerHTML = '<span class="a">' + (e.coffre ? "✅" : "🎁") + '</span><span class="t">Quête du jour<small>' + sous + '</small></span><span class="p"><i class="' + (m1() ? "on" : "") + '"></i><i class="' + (m2() ? "on" : "") + '"></i><i class="' + (m3() ? "on" : "") + '"></i></span>';
    if (pret && !e.deb) { e.deb = true; sauver(e); try { if (typeof toast === "function") toast("🎁 Coffre débloqué ! Ouvre-le depuis l'accueil."); } catch (x) {} noter("quete_coffre_pret"); }
  }

  function tirer() {
    var r = Math.random() * 100;
    if (r < 55) return { t: "xp", v: 15 };
    if (r < 80) return { t: "xp", v: 30 };
    if (r < 95) return { t: "phrase" };
    return { t: "gel" };
  }
  function appliquer(rw) {
    var txt = "";
    if (rw.t === "xp") {
      try { if (typeof addXP === "function") addXP(rw.v); } catch (e) {}
      txt = "<span class='ok'>+" + rw.v + " XP</span> ajoutés à ton niveau";
    } else if (rw.t === "gel") {
      var s = json("diisoo_streak", null);
      if (s && typeof s === "object") { s.gel = 1; ecrire("diisoo_streak", JSON.stringify(s)); }
      txt = "<span class='ok'>❄️ Gel de série</span> : un jour manqué sera pardonné";
    } else {
      var vus = json("diisoo_rares", []), libres = [];
      for (var i = 0; i < RARES.length; i++) if (vus.indexOf(i) < 0) libres.push(i);
      if (!libres.length) { try { if (typeof addXP === "function") addXP(30); } catch (e) {} rw = { t: "xp", v: 30 }; txt = "<span class='ok'>+30 XP</span> (tu as toutes les phrases rares !)"; }
      else {
        var k = libres[Math.floor(Math.random() * libres.length)]; vus.push(k); ecrire("diisoo_rares", JSON.stringify(vus));
        rw.k = k; txt = "<span class='ok'>💎 Phrase rare</span> (" + vus.length + "/" + RARES.length + ")<br>« " + esc(RARES[k][1]) + " »<br><small>" + esc(RARES[k][0]) + "</small>";
      }
    }
    return { rw: rw, txt: txt };
  }

  function ouvrir() {
    if (document.getElementById("dqqo")) return;
    var o = document.createElement("div"); o.id = "dqqo"; document.body.appendChild(o);
    function fermer() { o.remove(); majCarte(); }
    function vueMissions() {
      var e = etat(), n = faites(), mm = MOTS[idxMot()];
      o.innerHTML =
        '<div class="k">Quête du jour · ' + n + '/3</div>' +
        '<div class="l">' +
        '<div class="mi ' + (m1() ? "ok" : "") + '"><span class="c">' + (m1() ? "✅" : "📘") + '</span>Fais 3 exercices dans une leçon</div>' +
        '<div class="mi ' + (m2() ? "ok" : "") + '"><span class="c">' + (m2() ? "✅" : "🎙️") + '</span>Réponds à la question du jour</div>' +
        '<div class="mi ' + (m3() ? "ok" : "") + '"><span class="c">' + (m3() ? "✅" : "💡") + '</span>Apprends le mot du jour</div></div>' +
        '<div class="w"><b>' + esc(mm[0]) + '</b><span>' + esc(mm[1]) + ' = <u>' + esc(mm[2]) + '</u></span><em>' + esc(mm[3]) + '</em></div>' +
        '<button class="b2" id="dqq-ec" type="button">🔊 Écouter en anglais</button>' +
        (m3() ? "" : '<button class="b1" id="dqq-ok" type="button">J\'ai appris ce mot</button>') +
        ((n >= 3 && !e.coffre) ? '<button class="b1" id="dqq-cf" type="button">🎁 Ouvrir mon coffre</button>' : "") +
        '<button class="b3" id="dqq-x" type="button">Fermer</button>';
      document.getElementById("dqq-x").onclick = fermer;
      document.getElementById("dqq-ec").onclick = function () { parler(mm[2] + ". " + mm[3]); };
      var ok = document.getElementById("dqq-ok");
      if (ok) ok.onclick = function () {
        var e2 = etat(); e2.mot = true; sauver(e2);
        var ap = json("diisoo_mots", []); if (ap.indexOf(idxMot()) < 0) { ap.push(idxMot()); ecrire("diisoo_mots", JSON.stringify(ap)); }
        noter("quete_mot", mm[0]); vueMissions();
      };
      var cf = document.getElementById("dqq-cf");
      if (cf) cf.onclick = vueCoffre;
    }
    function vueCoffre() {
      var e = etat(); if (e.coffre) { vueMissions(); return; }
      o.innerHTML = '<div class="k">Ton coffre du jour</div><div class="cf sec">🎁</div><div class="rec">Ouverture...</div>';
      setTimeout(function () {
        var e3 = etat(); if (e3.coffre) { vueMissions(); return; }
        var res = appliquer(tirer()); e3.coffre = true; e3.rec = res.rw.t; sauver(e3);
        try { if (typeof celebrate === "function") celebrate(); } catch (x) {}
        var mots = json("diisoo_mots", []).length;
        o.innerHTML = '<div class="k">Récompense</div><div class="cf">' + (res.rw.t === "phrase" ? "💎" : (res.rw.t === "gel" ? "❄️" : "⭐")) + '</div>' +
          '<div class="rec">' + res.txt + '</div>' +
          (res.rw.t === "phrase" && res.rw.k != null ? '<button class="b2" id="dqq-ph" type="button">🔊 Écouter la phrase</button>' : "") +
          '<div class="k">Mots appris : ' + mots + '</div>' +
          '<button class="b1" id="dqq-sh" type="button">Partager sur WhatsApp</button>' +
          '<button class="b3" id="dqq-x" type="button">Fermer</button>';
        document.getElementById("dqq-x").onclick = fermer;
        var ph = document.getElementById("dqq-ph"); if (ph) ph.onclick = function () { parler(RARES[res.rw.k][1]); };
        document.getElementById("dqq-sh").onclick = function () {
          var t = "J'ai ouvert mon coffre du jour sur Diisoo. Apprends l'anglais et le wolof gratuitement : https://diisoo.sn/?source=whatsapp";
          noter("quete_partage");
          try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (x) {}
          window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
        };
        noter("quete_coffre_ouvert", res.rw.t); majCarte();
      }, 1100);
    }
    noter("quete_vue");
    if (faites() >= 3 && !etat().coffre) vueCoffre(); else vueMissions();
  }

  function monter() {
    var d = document.getElementById("screen-dashboard"); if (!d) return;
    if (document.getElementById("dqq")) return;
    var ref = document.getElementById("dqj") || document.getElementById("revision-card");
    if (!ref || !ref.parentNode) return;
    var b = document.createElement("button"); b.type = "button"; b.id = "dqq"; b.onclick = ouvrir;
    ref.parentNode.insertBefore(b, ref.nextSibling);
    majCarte();
  }
  var essais = 0;
  (function boucle() { try { monter(); } catch (e) {} if (++essais < 40) setTimeout(boucle, 750); })();
  try { new MutationObserver(function () { if (!document.getElementById("dqq")) { try { monter(); } catch (e) {} } }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  setInterval(function () { try { majCarte(); } catch (e) {} }, 3000);
  window.DiisooQuete = { ouvrir: ouvrir, faites: faites };
  if (/[?&]quete=1/.test(location.search)) setTimeout(ouvrir, 1200);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-quete.js",e);}

try{
/* ---- diisoo-aujourdhui.js ---- */
/* diisoo-aujourdhui.js v1 : accueil allege. Regroupe Revision + Question du jour + Quete en un seul bloc « Aujourd'hui »
   (les cartes d'origine restent dans la page, masquees, et gardent leur fonction) + raccourci « ABC-GLOBAL ». Desactivable : ?aujourdhui=0 */
(function () {
  "use strict";
  if (window.DiisooAujourdhui || /[?&]aujourdhui=0/.test(location.search)) return;
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function json(k, d) { try { var v = JSON.parse(lire(k) || "null"); return v == null ? d : v; } catch (e) { return d; } }
  function jour() { var x = new Date(); return x.getFullYear() + "-" + ("0" + (x.getMonth() + 1)).slice(-2) + "-" + ("0" + x.getDate()).slice(-2); }
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#screen-dashboard #revision-card,#screen-dashboard #dqj,#screen-dashboard #dqq{display:none!important}" +
    "#screen-dashboard:not(.hidden)>div.space-y-3>#dii-auj{order:3}" +
    "#dii-auj{display:block;width:100%;border:1px solid #2A3454;background:#141A2B;border-radius:18px;padding:10px 10px 10px}" +
    "#dii-auj .h{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:800;color:#F6F1E7;margin:0 2px 8px}" +
    "#dii-auj .h small{font-size:11.5px;font-weight:700;color:#A69C86}" +
    "#dii-auj .r{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}" +
    "#dii-auj button{min-height:62px;border-radius:14px;border:1px solid #2A3454;background:#0F1424;color:#F6F1E7;padding:6px 4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:12px;font-weight:800;line-height:1.15;text-align:center}" +
    "#dii-auj button b{font-size:21px;font-weight:400}" +
    "#dii-auj button small{font-size:10.5px;font-weight:700;color:#A69C86}" +
    "#dii-auj button.ok{border-color:#25D366}#dii-auj button.ok small{color:#25D366}" +
    "#dii-auj button.pret{border-color:#FFAA3C;animation:diaup 1.6s infinite}@keyframes diaup{0%{box-shadow:0 0 0 0 rgba(255,170,60,.5)}100%{box-shadow:0 0 0 12px rgba(255,170,60,0)}}" +
    "#screen-dashboard #dg-open{min-height:44px!important;padding-top:4px!important;padding-bottom:4px!important}" +
    "#screen-dashboard #dg-open .dg-mic{width:32px!important;height:32px!important;font-size:18px!important}" +
    "#screen-dashboard button[onclick*=openPremium]{flex:none!important;height:auto!important;overflow:visible!important;min-height:36px!important;white-space:normal!important;line-height:1.2!important;padding:6px 12px!important;font-size:12.5px!important}" +
    "";
  document.head.appendChild(st);

  function nbRevision() { var c = document.getElementById("revision-card"); if (!c) return ""; var m = (c.innerText || "").match(/(\d+)/); return m ? m[1] : ""; }
  function maj() {
    var box = document.getElementById("dii-auj"); if (!box) return;
    var rev = document.getElementById("revision-card"), qj = document.getElementById("dqj"), qq = document.getElementById("dqq");
    var q = json("diisoo_qj", {}), fait = q.last === jour();
    var n = 0, coffre = json("diisoo_quete", {}); try { n = window.DiisooQuete ? DiisooQuete.faites() : 0; } catch (e) {}
    var ouvert = coffre.date === jour() && coffre.coffre, pret = n >= 3 && !ouvert;
    var nr = nbRevision();
    var b = box.querySelectorAll("button");
    b[0].className = ""; b[0].innerHTML = "<b>🔁</b>Révision<small>" + (nr ? nr + " à revoir" : "à faire") + "</small>";
    b[1].className = fait ? "ok" : ""; b[1].innerHTML = "<b>" + (fait ? "✅" : "🎯") + "</b>Question<small>" + (fait ? "faite" : "1 minute") + "</small>";
    b[2].className = ouvert ? "ok" : (pret ? "pret" : ""); b[2].innerHTML = "<b>" + (ouvert ? "✅" : "🎁") + "</b>Quête<small>" + (ouvert ? "coffre ouvert" : (pret ? "ouvre le coffre" : n + "/3")) + "</small>";
    b[0].hidden = !rev; b[1].hidden = !qj; b[2].hidden = !qq;
  }
  function monter() {
    var rev = document.getElementById("revision-card");
    if (!rev || !rev.parentNode || document.getElementById("dii-auj")) return;
    var box = document.createElement("div"); box.id = "dii-auj";
    box.innerHTML = '<div class="h"><span>Aujourd\'hui</span><small>3 petites tâches</small></div><div class="r"><button type="button"></button><button type="button"></button><button type="button"></button></div>';
    rev.parentNode.insertBefore(box, rev);
    var b = box.querySelectorAll("button");
    b[0].onclick = function () { noter("auj_revision"); var c = document.getElementById("revision-card"); if (c) c.click(); };
    b[1].onclick = function () { noter("auj_question"); var c = document.getElementById("dqj"); if (c) c.click(); };
    b[2].onclick = function () { noter("auj_quete"); var c = document.getElementById("dqq"); if (c) c.click(); };
    maj();
    // ligne « Un produit ABC-GLOBAL » touchable (WhatsApp)
    var ps = document.querySelectorAll("#screen-dashboard p");
    for (var k = 0; k < ps.length; k++) {
      if (/Un produit ABC-GLOBAL/i.test(ps[k].textContent || "") && !ps[k].getAttribute("data-abc")) {
        ps[k].setAttribute("data-abc", "1"); ps[k].style.cursor = "pointer"; ps[k].style.textDecoration = "underline";
        ps[k].onclick = function () {
          noter("abc_pied");
          window.open("https://wa.me/221772882109?text=" + encodeURIComponent("Bonjour ABC-GLOBAL, je viens de l'application Diisoo. Je voudrais des informations sur vos services."), "_blank");
        };
      }
    }
  }
  var essais = 0;
  (function boucle() { try { monter(); maj(); } catch (e) {} if (++essais < 40) setTimeout(boucle, 750); })();
  try { new MutationObserver(function () { if (!document.getElementById("dii-auj")) { try { monter(); } catch (e) {} } }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  setInterval(function () { try { maj(); } catch (e) {} }, 2500);
  window.DiisooAujourdhui = { maj: maj };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-aujourdhui.js",e);}

try{
/* ---- diisoo-abc.js ---- */
/* diisoo-abc.js v1 : propositions ABC-GLOBAL au bon moment (fin de mission reussie), message WhatsApp prerempli, clic compte */
(function () {
  "use strict";
  if (window.DiisooABC) return;
  var CAS = [
    { fin: "mv-x2", ok: /Visa accordé/, cle: "visa", t: "Tu es prêt. Besoin d'aide pour ton dossier de visa ?", b: "Parler à ABC-GLOBAL",
      m: "Bonjour ABC-GLOBAL, j'ai réussi la mission visa sur Diisoo. Je voudrais de l'aide pour mon dossier de visa." },
    { fin: "mvy-x2", ok: /Bon voyage/, cle: "voyage", t: "Tu voyages bientôt ? On réserve ton billet.", b: "Demander un billet",
      m: "Bonjour ABC-GLOBAL, j'ai fini la mission voyage sur Diisoo. Je voudrais un billet d'avion." },
    { fin: "mp-x2", ok: /Belle rencontre/, cle: "presentation", t: "Tu veux parler anglais en confiance ? Cours accompagné ABC-GLOBAL.", b: "En savoir plus",
      m: "Bonjour ABC-GLOBAL, j'ai réussi la mission présentation sur Diisoo. Je voudrais en savoir plus sur le cours d'anglais accompagné." },
    { fin: "me-x2", ok: /Embauché/, cle: "emploi", t: "Prêt pour l'entretien en anglais ? Cours accompagné ABC-GLOBAL.", b: "En savoir plus",
      m: "Bonjour ABC-GLOBAL, j'ai réussi la mission entretien d'embauche sur Diisoo. Je voudrais en savoir plus sur le cours d'anglais accompagné." },
    { fin: "mm-x2", ok: /Vente conclue/, cle: "marche", t: "Tu veux parler anglais avec tes clients ? Cours accompagné ABC-GLOBAL.", b: "En savoir plus",
      m: "Bonjour ABC-GLOBAL, j'ai réussi la mission marché sur Diisoo. Je voudrais en savoir plus sur le cours d'anglais accompagné pour commerçants." }
  ];
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  var st = document.createElement("style");
  st.textContent = ".dii-abc-c{width:100%;max-width:320px;border:1px solid #2A3454;background:#141A2B;border-radius:16px;padding:10px 12px;font-size:14px;font-weight:700;line-height:1.3;color:#F6F1E7;text-align:center}" +
    ".dii-abc-c button{margin-top:8px;border:0;border-radius:14px;min-height:44px;padding:8px 16px;font-size:14.5px;font-weight:800;background:#25D366;color:#08210F;width:100%}" +
    ".dii-abc-c small{display:block;margin-top:4px;font-size:11px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);
  function poser() {
    for (var i = 0; i < CAS.length; i++) {
      var c = CAS[i], x = document.getElementById(c.fin);
      if (!x || x.getAttribute("data-abc")) continue;
      x.setAttribute("data-abc", "1");
      var o = x.parentNode; if (!o || !c.ok.test(o.innerText || "")) continue;
      var d = document.createElement("div"); d.className = "dii-abc-c";
      d.innerHTML = c.t + '<button type="button">' + c.b + '</button><small>Un produit ABC-GLOBAL</small>';
      (function (cc) {
        d.querySelector("button").onclick = function () {
          noter("abc_" + cc.cle);
          window.open("https://wa.me/221772882109?text=" + encodeURIComponent(cc.m), "_blank");
        };
      })(c);
      o.insertBefore(d, x);
      noter("abc_vue_" + c.cle);
    }
  }
  try { new MutationObserver(function () { try { poser(); } catch (e) {} }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  window.DiisooABC = { poser: poser };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-abc.js",e);}

try{
/* ---- diisoo-access.js ---- */
/* diisoo-access.js v1 : accessibilité et confort de lecture
   - texte jamais plus petit que 12 px (les mentions de 9 et 10 px étaient trop petites sur téléphone)
   - réglage « Taille du texte » dans le menu : Normal / Grand / Très grand, mémorisé
   - noms lisibles (aria-label) pour les boutons faits d'un seul pictogramme
   - contour visible au clavier, zones tactiles d'au moins 44 px dans les leçons
   Aucun fichier existant n'est modifié. */
(function () {
  "use strict";
  if (window.DiisooAccess) return;
  var $ = function (id) { return document.getElementById(id); };
  var CLE = "diisoo_taille_texte";
  var TAILLES = [["1", "Normal"], ["1.12", "Grand"], ["1.2", "Très grand"]];

  function lire() { try { return localStorage.getItem(CLE) || "1"; } catch (e) { return "1"; } }
  function ecrire(v) { try { localStorage.setItem(CLE, v); } catch (e) {} }

  function css() {
    if ($("dacc-css")) return;
    var s = document.createElement("style"); s.id = "dacc-css";
    s.textContent =
      ".text-\\[9px\\],.text-\\[10px\\]{font-size:12px!important;line-height:1.35!important}" +
      ".text-\\[11px\\]{font-size:12.5px!important}" +
      "button:focus-visible,a:focus-visible,[role=button]:focus-visible,input:focus-visible{outline:3px solid #F3A94E!important;outline-offset:2px}" +
      "#general-tabs button,#wolof-tabs button{min-height:44px}" +
      "button[data-practice]{min-height:48px}" +
      "html[data-dacc=\"1.12\"] body{zoom:1.12}html[data-dacc=\"1.2\"] body{zoom:1.2}" +
      "#dacc-row{display:flex;gap:6px;padding:8px 16px 12px}" +
      "#dacc-row button{flex:1;min-height:44px;border-radius:12px;background:#0B0F1C;border:1px solid #1E2740;color:#C9BFA8;font-weight:700}" +
      "#dacc-row button[aria-pressed=true]{border-color:#E1693F;color:#F6F1E7;background:#2a1a12}";
    document.head.appendChild(s);
  }

  function appliquer(v) {
    document.documentElement.setAttribute("data-dacc", v);
    var b = $("dacc-row"); if (!b) return;
    Array.prototype.forEach.call(b.querySelectorAll("button"), function (x) { x.setAttribute("aria-pressed", x.dataset.v === v ? "true" : "false"); });
  }

  function menu() {
    var m = $("burger-menu"), fin = $("menu-session");
    if (!m || !fin || $("dacc-row")) return;
    var t = document.createElement("p");
    t.className = "px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#8C8064]"; t.id = "dacc-titre"; t.textContent = "Taille du texte";
    var row = document.createElement("div"); row.id = "dacc-row"; row.setAttribute("role", "group"); row.setAttribute("aria-label", "Taille du texte");
    TAILLES.forEach(function (x) {
      var b = document.createElement("button"); b.type = "button"; b.dataset.v = x[0]; b.textContent = x[1];
      b.onclick = function (e) { e.stopPropagation(); ecrire(x[0]); appliquer(x[0]); };
      row.appendChild(b);
    });
    m.insertBefore(t, fin); m.insertBefore(row, fin);
    appliquer(lire());
  }

  /* Un bouton qui ne contient qu'un pictogramme reçoit un nom lisible par les lecteurs d'écran */
  var NOMS = { "🔊": "Écouter", "🎤": "Parler", "🎙️": "Parler", "⬅️": "Retour", "⬅": "Retour", "☰": "Menu", "✕": "Fermer", "✖": "Fermer", "×": "Fermer", "💾": "Sauvegarder", "🔁": "Rejouer", "▶️": "Lancer", "⏸": "Pause" };
  function nommer(racine) {
    var bs = (racine || document).querySelectorAll("button:not([aria-label]),a[role=button]:not([aria-label])");
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i], t = (b.textContent || "").trim();
      if (b.title) { b.setAttribute("aria-label", b.title); continue; }
      if (t && NOMS[t]) b.setAttribute("aria-label", NOMS[t]);
    }
    var inps = (racine || document).querySelectorAll("input:not([aria-label]):not([type=hidden])");
    for (var j = 0; j < inps.length; j++) { var p = inps[j].placeholder; if (p) inps[j].setAttribute("aria-label", p); }
  }
  var plan = false;
  function planifier() { if (plan) return; plan = true; setTimeout(function () { plan = false; try { nommer(); menu(); } catch (e) {} }, 300); }

  css();
  appliquer(lire());
  try { new MutationObserver(planifier).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  planifier();
  window.DiisooAccess = { version: 1, taille: function (v) { ecrire(String(v)); appliquer(String(v)); } };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-access.js",e);}

try{
/* ---- diisoo-suivi.js ---- */
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
    return (m ? "Android " + m[1] : /iPhone|iPad/.test(u) ? "iOS" : /Windows|Mac|Linux/.test(u) ? "Ordinateur" : "Autre").slice(0, 160);
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
  }

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

}catch(e){console.error("Diisoo : erreur dans diisoo-suivi.js",e);}

window.__diisooBundle=true;
