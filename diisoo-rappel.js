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
    d.setHours(+h[0] || 0, +h[1] || 0, 0, 0);
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

  window.DiisooRappel = { ok: ok, activer: activer, sync: sync };
  setTimeout(sync, 4000);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") sync(); });
  var essais = 0, t = setInterval(function () {
    essais++;
    if (typeof window.bumpDailyGoal === "function" && !window.bumpDailyGoal.__r) {
      var f = window.bumpDailyGoal;
      window.bumpDailyGoal = function () { var r = f.apply(this, arguments); setTimeout(sync, 800); return r; };
      window.bumpDailyGoal.__r = 1; clearInterval(t);
    } else if (essais > 20) clearInterval(t);
  }, 500);
})();
