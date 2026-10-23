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
