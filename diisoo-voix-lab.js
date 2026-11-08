/* diisoo-voix-lab.js v1 : lecteur "Voix Diisoo" (6 voix, API voiceover) + repli voix du telephone */
(function () {
  "use strict";
  var APIS = ["https://voix.diisoo.sn/api/voiceover/generate", "https://ais-pre-ysusyqb5u65ipxnrqydlue-998791602883.europe-west2.run.app/api/voiceover/generate"];
  var V = [
    { n: "Modou", api: "Modou", f: "🇸🇳", r: "Wolof · baryton posé, sage", l: "fr-SN", p: 0.82, w: 1 },
    { n: "Aïda", api: "Aïda", alt: "Aida", f: "🇸🇳", r: "Wolof · chaleureuse, Teranga", l: "fr-SN", p: 1.02, w: 1 },
    { n: "James", api: "James", f: "🇬🇧", r: "Anglais britannique · IELTS, Cambridge, visa", l: "en-GB", p: 0.95 },
    { n: "Emma", api: "Emma", f: "🇬🇧", r: "Anglais pédagogique · TOEFL, Duolingo, débutants", l: "en-GB", p: 0.95 },
    { n: "Marcus", api: "Marcus", f: "🇺🇸", r: "Anglais des affaires · Business, TOEIC", l: "en-US", p: 0.95 },
    { n: "Sarah", api: "Sarah", f: "🇺🇸", r: "Anglais accueil · hôtel, marché, tourisme", l: "en-US", p: 0.95 }
  ];
  var TXT = {
    w: ["Nanga def ? Maa ngi fi rekk. Jërëjëf.", "Diisoo, application bi di la jàngal anglais ak wolof."],
    e: ["Why do you want to study in Canada?", "Good morning, how can I help you today?", "Diisoo helps you speak English and Wolof."]
  };
  var cache = {}, audio = null, courant = null;
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function phon(t) { return t.replace(/\bDiisoo\b/g, "Dii-soo").replace(/\bThiès\b/g, "Tchéss").replace(/\bpoint S N\b/g, "point Èsse-Ènne"); }
  function arreter() {
    try { if (audio) { audio.pause(); audio = null; } } catch (e) {}
    try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {}
  }
  function b64blob(b64) {
    var bin = atob(b64), a = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([a], { type: "audio/wav" }));
  }
  function appel1(api, text, name) {
    var ctl = ("AbortController" in window) ? new AbortController() : null;
    var to = setTimeout(function () { if (ctl) ctl.abort(); }, 20000);
    return fetch(api, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: String(text).slice(0, 300), voiceName: name, tone: "prestige", pace: "moderate" }), signal: ctl ? ctl.signal : undefined })
      .then(function (r) { clearTimeout(to); if (r.status === 429 || r.status === 503) throw new Error("quota"); return r.json(); })
      .then(function (j) { if (!j || !j.success) throw new Error("api"); if (j.audioBase64) return b64blob(j.audioBase64); if (j.audioUrl) return j.audioUrl; throw new Error("api"); });
  }
  function appel(text, name) {
    return appel1(APIS[0], text, name).catch(function (e) { if (e && e.message === "quota") throw e; return appel1(APIS[1], text, name); });
  }
  function repli(text, v) {
    return new Promise(function (ok, ko) {
      try {
        var u = new SpeechSynthesisUtterance(phon(text));
        u.lang = v.l; u.pitch = v.p; u.rate = 0.92;
        u.onend = function () { ok(); }; u.onerror = function () { ko(); };
        speechSynthesis.cancel(); speechSynthesis.speak(u);
      } catch (e) { ko(e); }
    });
  }
  /* joue : renvoie "api" ou "repli" */
  function jouer(text, v) {
    arreter();
    var k = v.n + "|" + text;
    var p = cache[k] ? Promise.resolve(cache[k]) : appel(text, v.api).catch(function (e) { if (v.alt) return appel(text, v.alt); throw e; }).then(function (u) { cache[k] = u; return u; });
    return p.then(function (url) {
      return new Promise(function (ok, ko) {
        audio = new Audio(url); audio.onended = function () { ok("api"); }; audio.onerror = function () { ko(); };
        var pr = audio.play(); if (pr && pr.catch) pr.catch(ko);
      });
    }).catch(function () { return repli(text, v).then(function () { return "repli"; }); });
  }
  window.DiisooVoice = {
    speak: function (text, voice) {
      var v = V.filter(function (x) { return x.n === voice || x.api === voice || x.alt === voice; })[0] || V[0];
      return jouer(text, v);
    },
    voices: V
  };

  var st = document.createElement("style");
  st.textContent =
    "#dvb{width:36px;height:36px;border-radius:50%;border:1px solid #2A3454;background:#141A2B;font-size:17px;line-height:1;flex:none}" +
    "#dvo{position:fixed;inset:0;z-index:99992;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:16px 16px 28px}" +
    "#dvo .w{max-width:420px;margin:0 auto;display:flex;flex-direction:column;gap:10px}" +
    "#dvo h2{font-size:22px;font-weight:900;margin:2px 0 0}#dvo .sub{font-size:13px;color:#A69C86;margin-bottom:2px}" +
    "#dvo .x{align-self:flex-end;border:0;background:transparent;color:#A69C86;font-size:15px;font-weight:800;min-height:40px;padding:0 6px}" +
    "#dvo textarea{width:100%;min-height:74px;border-radius:14px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-size:16px;padding:10px 12px;resize:vertical;font-family:inherit}" +
    "#dvo .ch{display:flex;gap:6px;flex-wrap:wrap}#dvo .ch button{border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;border-radius:999px;font-size:12.5px;font-weight:700;padding:7px 11px;min-height:34px}" +
    "#dvo .c{display:flex;align-items:center;gap:12px;border:1px solid #2A3454;background:#141A2B;border-radius:18px;padding:10px 12px}" +
    "#dvo .c.on{border-color:#E1693F}#dvo .c .f{font-size:26px}#dvo .c .i{flex:1;min-width:0}#dvo .c b{display:block;font-size:17px}#dvo .c small{display:block;font-size:12px;color:#A69C86;line-height:1.25}" +
    "#dvo .c button{width:48px;height:48px;border-radius:50%;border:0;background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff;font-size:18px;font-weight:800;flex:none}" +
    "#dvo .c button.sp{animation:dvs 1s linear infinite;opacity:.8}@keyframes dvs{50%{opacity:.4}}" +
    "#dvo .st{min-height:18px;font-size:12.5px;color:#A69C86}#dvo .nt{font-size:11.5px;color:#7d7461;line-height:1.35}";
  document.head.appendChild(st);

  function ouvrir() {
    if (document.getElementById("dvo")) return;
    var o = document.createElement("div"); o.id = "dvo";
    var h = '<div class="w"><button class="x" id="dv-x" type="button">Fermer ✕</button><h2>🎧 Voix Diisoo</h2><div class="sub">Écoute les 6 voix. Écris ton texte ou choisis un exemple.</div>' +
      '<textarea id="dv-t" maxlength="300" aria-label="Texte à lire"></textarea><div class="ch" id="dv-ch"></div><div class="st" id="dv-s"></div>';
    V.forEach(function (v, i) { h += '<div class="c" data-i="' + i + '"><span class="f">' + v.f + '</span><span class="i"><b>' + v.n + '</b><small>' + v.r + '</small></span><button type="button" aria-label="Écouter ' + v.n + '">▶</button></div>'; });
    h += '<div class="nt">Voix générées par Diisoo. Si le service est indisponible, la voix de ton téléphone prend le relais.</div></div>';
    o.innerHTML = h; document.body.appendChild(o);
    var t = document.getElementById("dv-t"), s = document.getElementById("dv-s"), ch = document.getElementById("dv-ch");
    t.value = TXT.e[0];
    TXT.e.concat(TXT.w).forEach(function (x) { var b = document.createElement("button"); b.type = "button"; b.textContent = x.length > 26 ? x.slice(0, 24) + "…" : x; b.onclick = function () { t.value = x; }; ch.appendChild(b); });
    document.getElementById("dv-x").onclick = function () { arreter(); o.remove(); };
    [].forEach.call(o.querySelectorAll(".c"), function (c) {
      var btn = c.querySelector("button"), v = V[+c.getAttribute("data-i")];
      btn.onclick = function () {
        if (btn.classList.contains("sp") || courant === btn) { arreter(); }
        var txt = (t.value || "").trim(); if (!txt) { s.textContent = "Écris un texte d'abord."; return; }
        [].forEach.call(o.querySelectorAll(".c"), function (x) { x.classList.remove("on"); x.querySelector("button").classList.remove("sp"); x.querySelector("button").textContent = "▶"; });
        c.classList.add("on"); btn.classList.add("sp"); btn.textContent = "…"; courant = btn; s.textContent = "Chargement de la voix " + v.n + "...";
        noter("voix_lab", v.n);
        jouer(txt, v).then(function (m) {
          if (courant !== btn) return;
          btn.classList.remove("sp"); btn.textContent = "▶"; s.textContent = m === "api" ? "" : "Voix du téléphone (service indisponible).";
        });
        setTimeout(function () { if (courant === btn && btn.textContent === "…") { s.textContent = "Lecture..."; btn.classList.remove("sp"); btn.textContent = "🔊"; } }, 1500);
      };
    });
  }
  function monter() {
    if (document.getElementById("dvb")) return;
    var x = document.getElementById("xp-label"); if (!x || !x.parentNode) return;
    var b = document.createElement("button"); b.type = "button"; b.id = "dvb"; b.textContent = "🎧"; b.setAttribute("aria-label", "Voix Diisoo");
    b.onclick = ouvrir; x.parentNode.insertBefore(b, x);
  }
  var n = 0; (function l() { try { monter(); } catch (e) {} if (++n < 40) setTimeout(l, 750); })();
  try { new MutationObserver(function () { if (!document.getElementById("dvb")) { try { monter(); } catch (e) {} } }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
})();
