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
