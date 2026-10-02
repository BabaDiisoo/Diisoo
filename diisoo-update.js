/* Rechargement automatique quand une nouvelle version de Diisoo est installee.
   Attend la fin d'un test ou d'un enregistrement avant de recharger. */
(function () {
    if (!("serviceWorker" in navigator)) return;
    var avaitControleur = !!navigator.serviceWorker.controller;
    var rechargement = false;

    function occupe() {
        return ["screen-test-simulation", "screen-pairs"].some(function (id) {
            var el = document.getElementById(id);
            return el && !el.classList.contains("hidden");
        });
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
