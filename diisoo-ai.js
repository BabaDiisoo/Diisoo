/* Diisoo : client du cache IA (P2). Cache-first en 3 niveaux :
 * 1. memoire locale du telephone (0 reseau), 2. cache_dict Supabase (reponses validees, lecture seule),
 * 3. Edge Function ai-cache (qui interroge OpenAI uniquement si la reponse n'existe nulle part).
 * Aucune cle OpenAI ni service_role dans ce fichier. */
(function () {
  "use strict";
  if (window.DiisooAI) return;
  var PREFIX = "diisoo_ai:";
  var MAX_LOCAL = 200;
  var TIMEOUT_MS = 20000;
  var FUNCTION_NAME = "super-responder"; /* nom de la fonction Edge deployee dans Supabase */
  var LOCALES = { wo: 1, ff: 1, srr: 1, dyu: 1, mnk: 1, fr: 1, en: 1 };
  var TASKS = { translate: 1, explain: 1 };

  function base() {
    try { if (typeof SUPABASE_URL === "string") return SUPABASE_URL.replace(/\/$/, ""); } catch (e) {}
    return "";
  }
  function anon() {
    try { if (typeof SUPABASE_KEY === "string") return SUPABASE_KEY; } catch (e) {}
    return "";
  }

  function normalize(t) {
    return String(t == null ? "" : t).normalize("NFC")
      .replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function sha256Hex(s) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
    });
  }

  function lsGet(k) { try { return JSON.parse(localStorage.getItem(PREFIX + k)); } catch (e) { return null; } }
  function lsSet(k, v) {
    try {
      localStorage.setItem(PREFIX + k, JSON.stringify(v));
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var n = localStorage.key(i);
        if (n && n.indexOf(PREFIX) === 0) keys.push(n);
      }
      if (keys.length > MAX_LOCAL) {
        keys.map(function (n) { var o = null; try { o = JSON.parse(localStorage.getItem(n)); } catch (e) {} return { n: n, t: (o && o.t) || 0 }; })
          .sort(function (a, b) { return a.t - b.t; })
          .slice(0, keys.length - MAX_LOCAL)
          .forEach(function (x) { localStorage.removeItem(x.n); });
      }
    } catch (e) {}
  }

  function withTimeout(url, opts) {
    var ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, TIMEOUT_MS);
    if (ctrl) opts.signal = ctrl.signal;
    return fetch(url, opts).then(function (r) { clearTimeout(timer); return r; }, function (e) { clearTimeout(timer); throw e; });
  }

  function fail(code, extra) {
    var e = new Error(code);
    e.code = code;
    if (extra) for (var k in extra) e[k] = extra[k];
    return e;
  }

  /* ask("translate", "How much is this?", "wo") -> Promise<{answer, confidence_score, source, review_status}> */
  function ask(task, text, locale) {
    task = String(task || ""); locale = String(locale || "");
    var norm = normalize(text);
    if (!TASKS[task]) return Promise.reject(fail("invalid_task"));
    if (!LOCALES[locale]) return Promise.reject(fail("invalid_locale"));
    if (!norm || norm.length > 300) return Promise.reject(fail("invalid_text"));
    var url = base(), key = anon();
    if (!url || !key) return Promise.reject(fail("not_configured"));

    return sha256Hex(task + "|" + locale + "|" + norm).then(function (h) {
      var local = lsGet(h);
      if (local && local.d && local.d.answer) {
        var d0 = local.d; d0.source = "local";
        return d0;
      }
      if (typeof navigator !== "undefined" && navigator.onLine === false) throw fail("offline");

      var headers = { apikey: key };
      var q = url + "/rest/v1/cache_dict?select=response_json,review_status&locale=eq." + encodeURIComponent(locale) +
        "&query_key=eq." + h + "&review_status=eq.approved&limit=1";
      return withTimeout(q, { headers: headers }).then(function (r) {
        return r.ok ? r.json() : [];
      }).catch(function () { return []; }).then(function (rows) {
        if (rows && rows.length && rows[0].response_json && rows[0].response_json.answer) {
          var d1 = {
            answer: rows[0].response_json.answer,
            confidence_score: rows[0].response_json.confidence_score == null ? null : rows[0].response_json.confidence_score,
            source: "cache", review_status: "approved"
          };
          lsSet(h, { t: Date.now(), d: d1 });
          return d1;
        }
        return withTimeout(url + "/functions/v1/" + FUNCTION_NAME, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: key },
          body: JSON.stringify({ task: task, text: norm, locale: locale })
        }).then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (j) {
            if (!r.ok || !j.ok) throw fail(j.error || "ai_unavailable", { status: r.status });
            var d2 = {
              answer: j.answer, confidence_score: j.confidence_score,
              source: j.source, review_status: j.review_status, low_confidence: !!j.low_confidence
            };
            if (!d2.low_confidence) lsSet(h, { t: Date.now(), d: d2 });
            return d2;
          });
        });
      });
    });
  }

  window.DiisooAI = { ask: ask, normalize: normalize, _hash: function (t, l, x) { return sha256Hex(t + "|" + l + "|" + normalize(x)); } };
})();
