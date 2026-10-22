/* Rechargement automatique quand une nouvelle version de Diisoo est installee.
   Ne recharge JAMAIS pendant une session : seulement sur l'ecran d'accueil,
   sans son, sans micro, sans saisie, et apres quelques secondes d'inactivite. */
(function () {
    if (!("serviceWorker" in navigator)) return;
    var avaitControleur = !!navigator.serviceWorker.controller;
    var rechargement = false;
    var INACTIF = 10 * 1000;
    var dernier = Date.now();

    ["touchstart", "click", "keydown", "scroll", "pointerdown"].forEach(function (ev) {
        window.addEventListener(ev, function () { dernier = Date.now(); }, { passive: true, capture: true });
    });

    function occupe() {
        try {
            var ecrans = document.querySelectorAll('[id^="screen-"]');
            var visibles = [];
            for (var i = 0; i < ecrans.length; i++) {
                if (!ecrans[i].classList.contains("hidden")) visibles.push(ecrans[i].id);
            }
            /* tout ecran autre que l'accueil (test, coach vocal, revision, onboarding...) = occupe */
            if (!visibles.length || !visibles.every(function (id) { return id === "screen-dashboard"; })) return true;
            var mic = document.getElementById("df-mic");
            if (mic && mic.classList.contains("on")) return true;
            if (window.speechSynthesis && (speechSynthesis.speaking || speechSynthesis.pending)) return true;
            var audios = document.querySelectorAll("audio");
            for (var j = 0; j < audios.length; j++) { if (!audios[j].paused && !audios[j].ended) return true; }
            var a = document.activeElement;
            if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return true;
            if (document.visibilityState !== "visible") return true;
            if (Date.now() - dernier < INACTIF) return true;
            return false;
        } catch (e) { return true; }
    }

    function recharger() {
        if (occupe()) { setTimeout(recharger, 10000); return; }
        window.location.reload();
    }

    navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (!avaitControleur || rechargement) return;
        rechargement = true;
        recharger();
    });

    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState !== "visible") return;
        navigator.serviceWorker.getRegistration().then(function (reg) {
            if (reg) reg.update().catch(function () {});
        });
    });
})();
