/* Diisoo : audio cache-first (P2). Les fichiers audio Supabase (MP3 wolof natifs, voix humaines) sont
 * telecharges a la premiere ecoute puis relus depuis le telephone : 0 Mo de bande passante Supabase aux reecoutes,
 * lecture hors ligne. S'ajoute a l'existant : si rien n'est en cache, le comportement d'origine continue
 * (voix humaine, sinon synthese vocale). Aucun risque pour les autres fonctions. */
(function () {
  "use strict";
  if (window.DiisooAudioCache) return;
  var CACHE = "diisoo-audio-v1";
  var MAX = 400;
  var MANIFEST = "wolof_extraction_v1.json";
  var blobs = Object.create(null);
  var inflight = Object.create(null);
  var cachePromise = null;
  var manifest = null;

  function supported() {
    return "caches" in window && typeof URL !== "undefined" && typeof URL.createObjectURL === "function";
  }
  function remote(url) {
    try {
      var u = new URL(url, location.href);
      return /\.supabase\.co$/.test(u.hostname) && u.pathname.indexOf("/storage/v1/object/public/") === 0 ? u.href : null;
    } catch (e) { return null; }
  }
  function norm(t) {
    return String(t == null ? "" : t).normalize("NFC").replace(/\s+/g, " ").trim().toLowerCase();
  }
  function open() {
    if (!cachePromise) cachePromise = caches.open(CACHE);
    return cachePromise;
  }

  function warm() {
    if (!supported()) return;
    open().then(function (c) {
      return c.keys().then(function (reqs) {
        reqs.slice(-MAX).forEach(function (req) {
          c.match(req).then(function (r) { return r ? r.blob() : null; }).then(function (b) {
            if (b && b.size && !blobs[req.url]) blobs[req.url] = URL.createObjectURL(b);
          }).catch(function () {});
        });
      });
    }).catch(function () {});
  }

  function trim(c) {
    return c.keys().then(function (keys) {
      var extra = keys.length - MAX;
      for (var i = 0; i < extra; i++) {
        var u = keys[i].url;
        c.delete(keys[i]);
        if (blobs[u]) { try { URL.revokeObjectURL(blobs[u]); } catch (e) {} delete blobs[u]; }
      }
    });
  }

  function prefetch(href) {
    if (!supported() || blobs[href] || inflight[href]) return;
    if (typeof navigator !== "undefined" && navigator.onLine === false) return;
    inflight[href] = true;
    fetch(href, { mode: "cors", credentials: "omit" }).then(function (r) {
      var type = r.headers.get("content-type") || "";
      if (!r.ok || !/^audio\//i.test(type)) throw new Error("not audio");
      var copy = r.clone();
      return Promise.all([open(), r.blob()]).then(function (x) {
        if (!x[1].size) throw new Error("empty");
        blobs[href] = URL.createObjectURL(x[1]);
        return x[0].put(href, copy).then(function () { return trim(x[0]); });
      });
    }).catch(function () {}).then(function () { delete inflight[href]; });
  }

  /* Renvoie l'URL a lire : copie locale si elle existe, sinon l'URL d'origine (et mise en cache en arriere-plan). */
  function resolve(url) {
    var h = remote(url);
    if (!h) return url;
    if (blobs[h]) return blobs[h];
    prefetch(h);
    return url;
  }

  /* MP3 natifs declares dans wolof_extraction_v1.json (audio_status = native) */
  function loadManifest() {
    if (manifest) return manifest;
    manifest = fetch(MANIFEST, { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : []; }).then(function (arr) {
      var m = Object.create(null);
      (Array.isArray(arr) ? arr : []).forEach(function (e) {
        if (e && e.audio_status === "native" && e.wolof_current && e.audio_url && remote(e.audio_url)) {
          m[norm(e.wolof_current)] = e.audio_url;
        }
      });
      return m;
    }).catch(function () {
      setTimeout(function () { manifest = null; }, 60000);
      return Object.create(null);
    });
    return manifest;
  }

  function hookPlayAudioFile() {
    var o = window.playAudioFile;
    if (typeof o !== "function" || o.__dac) return false;
    var w = function (url, key, keepSeq) { return o.call(this, resolve(url), key, keepSeq); };
    w.__dac = true;
    try { window.playAudioFile = w; } catch (e) { return false; }
    return true;
  }

  function hookVoix() {
    var v = window.voixHumaine;
    if (!v || typeof v.url !== "function" || v.__dac) return !!(v && v.__dac);
    var o = v.url;
    v.url = function (t) {
      return Promise.resolve(o.call(v, t)).then(function (u) {
        if (u) return u;
        return loadManifest().then(function (m) { return m[norm(t)] || null; });
      });
    };
    v.__dac = true;
    return true;
  }

  warm();
  var tries = 0;
  (function install() {
    var a = hookPlayAudioFile();
    var b = hookVoix();
    if (!(a && b) && tries++ < 50) setTimeout(install, 100);
  })();

  window.DiisooAudioCache = {
    resolve: resolve,
    prefetch: function (u) { var h = remote(u); if (h) prefetch(h); },
    stats: function () { return { count: Object.keys(blobs).length }; },
    clear: function () {
      Object.keys(blobs).forEach(function (k) { try { URL.revokeObjectURL(blobs[k]); } catch (e) {} delete blobs[k]; });
      return supported() ? caches.delete(CACHE).then(function () { cachePromise = null; return true; }) : Promise.resolve(false);
    }
  };
})();
