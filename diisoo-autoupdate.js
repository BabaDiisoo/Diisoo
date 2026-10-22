/* Mise a jour automatique et silencieuse de Diisoo.
   - Compare version.json (jamais mis en cache) avec la version memorisee.
   - Si elle a change : telecharge les nouveaux fichiers en arriere-plan.
   - Recharge l'application seulement quand la personne est sur l'ecran d'accueil,
     sans rien toucher depuis quelques secondes, sans son ni micro en cours.
   Aucun message, aucune demande, aucune action requise. Echec = on ne fait rien. */
(function () {
    "use strict";
    var CLE = "diisoo_build", CLE_RELOAD = "diisoo_build_reload";
    var INTERVALLE = 20 * 60 * 1000, INACTIF = 10 * 1000, PAUSE_RELOAD = 10 * 60 * 1000;
    var nouvelle = null, pret = false, dernier = Date.now(), tick = null;

    function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

    ["touchstart", "click", "keydown", "scroll", "pointerdown"].forEach(function (ev) {
        window.addEventListener(ev, function () { dernier = Date.now(); }, { passive: true, capture: true });
    });

    function surAccueil() {
        var ecrans = document.querySelectorAll('[id^="screen-"]');
        var visibles = [];
        for (var i = 0; i < ecrans.length; i++) {
            if (!ecrans[i].classList.contains("hidden")) visibles.push(ecrans[i].id);
        }
        return visibles.length > 0 && visibles.every(function (id) { return id === "screen-dashboard"; });
    }
    function sonEnCours() {
        try { if (window.speechSynthesis && (speechSynthesis.speaking || speechSynthesis.pending)) return true; } catch (e) {}
        var audios = document.querySelectorAll("audio");
        for (var i = 0; i < audios.length; i++) { if (!audios[i].paused && !audios[i].ended) return true; }
        var a = document.activeElement;
        return !!(a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
    }
    function peutRecharger() {
        return pret && document.visibilityState === "visible" && surAccueil() && !sonEnCours() &&
            (Date.now() - dernier) >= INACTIF;
    }
    function tenter() {
        if (!pret) return;
        if (peutRecharger()) {
            var dr = parseInt(lire(CLE_RELOAD) || "0", 10) || 0;
            if (Date.now() - dr < PAUSE_RELOAD) return;     /* garde-fou anti-boucle */
            ecrire(CLE, nouvelle);
            ecrire(CLE_RELOAD, String(Date.now()));
            location.reload();
        }
    }
    function surveiller() { if (!tick) tick = setInterval(tenter, 5000); }

    async function rafraichir(version) {
        try {
            var urls = [location.origin + "/", location.origin + "/index.html"];
            var sc = document.querySelectorAll("script[src]");
            for (var i = 0; i < sc.length; i++) {
                var u = new URL(sc[i].getAttribute("src"), location.href);
                if (u.origin === location.origin) urls.push(u.href.split("?")[0]);
            }
            var noms = (window.caches && (await caches.keys())) || [];
            noms = noms.filter(function (n) { return n.indexOf("diisoo-cache-") === 0; });
            for (var j = 0; j < urls.length; j++) {
                var res = await fetch(urls[j] + (urls[j].indexOf("?") < 0 ? "?b=" : "&b=") + encodeURIComponent(version), { cache: "no-store" });
                if (!res || !res.ok) { if (j < 2) return false; continue; }   /* page d'accueil obligatoire, le reste tolere */
                for (var k = 0; k < noms.length; k++) {
                    var c = await caches.open(noms[k]);
                    await c.put(urls[j], res.clone());
                }
            }
            return true;
        } catch (e) { return false; }
    }

    async function verifier() {
        try {
            if (!navigator.onLine) return;
            var r = await fetch("version.json?t=" + Date.now(), { cache: "no-store" });
            if (!r.ok) return;
            var d = await r.json();
            var v = d && d.v ? String(d.v) : null;
            if (!v) return;
            var connue = lire(CLE);
            if (!connue) { ecrire(CLE, v); return; }          /* premiere visite : on memorise */
            if (connue === v || nouvelle === v) return;
            nouvelle = v; pret = false;
            if (await rafraichir(v)) { pret = true; surveiller(); }
        } catch (e) { /* silencieux */ }
    }

    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") verifier();
    });
    window.addEventListener("online", verifier);
    setTimeout(verifier, 4000);
    setInterval(verifier, INTERVALLE);
    window.DiisooAutoUpdate = { verifier: verifier, etat: function () { return { connue: lire(CLE), nouvelle: nouvelle, pret: pret, accueil: surAccueil() }; } };
})();
;(function () {
    /* Confidentialité : les nouveaux enregistrements ne portent plus de numéro ni d'e-mail dans leur nom. */
    if (typeof uploadTestAudio !== "function") return;
    window.uploadTestAudio = async function (blob) {
        if (!db || !blob || blob.size === 0) return null;
        try {
            var id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(36).slice(2);
            var path = "r/" + id + "." + recExt();
            var res = await db.storage.from("recordings").upload(path, blob, { contentType: (recMime || "audio/webm").split(";")[0] });
            if (res.error) return null;
            var pub = db.storage.from("recordings").getPublicUrl(path);
            return pub && pub.data ? pub.data.publicUrl : null;
        } catch (e) { return null; }
    };
})();
