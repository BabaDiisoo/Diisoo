/* diisoo-b1.js : morceau 1/6 du bundle. Généré, ne pas modifier à la main. */
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
/* ---- diisoo-controle-oolel.js ---- */
/* diisoo-controle-oolel.js : couche de controle de la voix wolof Oolel.
 * 1) Respellings : reecrit le texte envoye a Oolel (ex. ñaar -> nyaar) sans toucher au texte affiche ni au cache.
 * 2) Plafond par telephone et par jour, pour proteger le quota Oolel.
 * 3) Mode controle (?ctrl=1) : bouton "Mal lu" qui garde les phrases mal lues, a envoyer pour creer de nouveaux respellings.
 * Interrupteurs : ?resp=0 coupe les respellings, ?resp=1 les remet. Aucun fichier existant modifie. */
(function () {
  "use strict";
  if (window.DiisooControleOolel) return;
  var PLAFOND_JOUR = 60;
  /* Mots a reecrire : cle = mot wolof (minuscules), valeur = ecriture que Oolel lit mieux. A completer avec ?ctrl=1. */
  var MOTS = {};
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  try {
    var q = new URLSearchParams(location.search);
    if (q.get("resp") === "0") lsSet("diisoo_resp", "0");
    if (q.get("resp") === "1") lsSet("diisoo_resp", "1");
    if (q.get("ctrl") === "1") lsSet("diisoo_ctrl", "1");
    if (q.get("ctrl") === "0") lsSet("diisoo_ctrl", "0");
  } catch (e) {}
  function respActif() { return lsGet("diisoo_resp") !== "0"; }
  function ctrlActif() { return lsGet("diisoo_ctrl") === "1"; }

  /* Respelling : ñ et ŋ en debut de mot lus de travers par Oolel */
  function respell(t) {
    var s = String(t || "");
    s = s.replace(/(^|[^\p{L}])([ñÑ])/gu, function (m, a, n) { return a + (n === "Ñ" ? "Ny" : "ny"); });
    s = s.replace(/ŋ/g, "ng").replace(/Ŋ/g, "Ng");
    s = s.replace(/[\p{L}]+/gu, function (w) { var r = MOTS[w.toLowerCase()]; return r ? r : w; });
    return s;
  }

  function jour() { return new Date().toISOString().slice(0, 10); }
  function compteur() {
    try { var c = JSON.parse(lsGet("diisoo_oolel_cpt") || "{}"); return c.j === jour() ? c : { j: jour(), n: 0 }; } catch (e) { return { j: jour(), n: 0 }; }
  }

  var dernier = "";
  var f0 = window.fetch;
  if (typeof f0 !== "function") return;
  window.fetch = function (input, init) {
    try {
      var url = typeof input === "string" ? input : (input && input.url) || "";
      if (url.indexOf("/functions/v1/smart-handler") > -1 && init && typeof init.body === "string") {
        var b = JSON.parse(init.body);
        if (b && b.lang === "wo" && typeof b.texte === "string") {
          var c = compteur();
          if (c.n >= PLAFOND_JOUR) {
            return Promise.resolve(new Response(JSON.stringify({ error: "plafond jour" }), { status: 429, headers: { "Content-Type": "application/json" } }));
          }
          c.n++; lsSet("diisoo_oolel_cpt", JSON.stringify(c));
          dernier = b.texte;
          if (respActif()) {
            b.texte = respell(b.texte);
            init = Object.assign({}, init, { body: JSON.stringify(b) });
          }
        }
      }
    } catch (e) {}
    return f0.call(this, input, init);
  };

  /* Mode controle : bouton "Mal lu" */
  function liste() { try { return JSON.parse(lsGet("diisoo_mal_lu") || "[]"); } catch (e) { return []; } }
  function ajouterBouton() {
    if (!ctrlActif() || document.getElementById("diisoo-mallu")) return;
    var b = document.createElement("button");
    b.id = "diisoo-mallu";
    b.type = "button";
    b.style.cssText = "position:fixed;right:10px;bottom:90px;z-index:99998;background:#c0392b;color:#fff;border:0;border-radius:20px;padding:10px 14px;font:14px system-ui,sans-serif";
    function maj() { b.textContent = "Mal lu (" + liste().length + ")"; }
    maj();
    var timer = 0;
    b.onclick = function () {
      var l = liste();
      if (dernier && l.indexOf(dernier) < 0) { l.push(dernier); lsSet("diisoo_mal_lu", JSON.stringify(l)); }
      maj();
    };
    b.oncontextmenu = b.ontouchstart = function () { clearTimeout(timer); timer = setTimeout(function () { window.DiisooControleOolel.copier(); }, 900); };
    b.ontouchend = function () { clearTimeout(timer); };
    document.body.appendChild(b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ajouterBouton); else ajouterBouton();

  window.DiisooControleOolel = {
    respell: respell,
    mots: MOTS,
    liste: liste,
    compteur: compteur,
    copier: function () {
      var t = liste().join("\n");
      try { navigator.clipboard.writeText(t); if (typeof window.toast === "function") window.toast("Liste copiee, envoie-la dans la conversation"); } catch (e) {}
      return t;
    },
    vider: function () { lsSet("diisoo_mal_lu", "[]"); }
  };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-controle-oolel.js",e);}

try{
/* ---- diisoo-fixe.js ---- */
/* Écran fixe : pas de zoom, pas de rebond, pas de saut. Désactiver : ?fixe=0 */
(function () {
  if (/[?&]fixe=0/.test(location.search)) return;
  try {
    var m = document.querySelector('meta[name="viewport"]');
    if (m) m.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover");
    var s = document.createElement("style");
    s.textContent = "html,body{overscroll-behavior:none;-webkit-text-size-adjust:100%;text-size-adjust:100%;-webkit-tap-highlight-color:transparent}" +
      "html,body,button,a,input,select,textarea,[onclick]{touch-action:manipulation}" +
      "body{-webkit-user-select:none;user-select:none}input,textarea{-webkit-user-select:text;user-select:text}" +
      "html{scrollbar-gutter:stable}";
    document.head.appendChild(s);
    ["gesturestart", "gesturechange", "gestureend"].forEach(function (n) { document.addEventListener(n, function (e) { e.preventDefault(); }, { passive: false }); });
    document.addEventListener("dblclick", function (e) { e.preventDefault(); }, { passive: false });
  } catch (e) {}
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-fixe.js",e);}

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
