/* diisoo-exams2.js v5 : « Format réel » des examens, piloté par un registre
   Lit exam-formats.json : pour chaque examen, les tâches (type, nombre, préparation, durée de réponse) et les tests.
   Types gérés : repeat (écoute et répète), readaloud (lire à voix haute), question (réponse orale chronométrée),
   prompt (consigne affichée), describe (photo ou graphique), info (document puis questions),
   retell (résumer un cours entendu), short (réponse courte).
   v3 : fin de parole détectée par le micro, correction et suggestions (diisoo-oral.js), passage automatique à la question suivante,
   import des anciens thèmes IELTS (TEST_BANK) enrichis d'un enregistrement et de la partie « poser des questions ».
   Pour suivre un changement du vrai examen, on modifie exam-formats.json seulement : aucun code à toucher. */
(function () {
  "use strict";

  var REG = null, PROM = null;
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function charger() {
    if (PROM) return PROM;
    PROM = fetch("exam-formats.json", { cache: "no-cache" }).then(function (r) { return r.json(); })
      .then(function (j) { REG = j; return j; }).catch(function () { PROM = null; return null; });
    return PROM;
  }
  function son(n) { try { if (window.DiisooSon && window.DiisooSon.jouer) window.DiisooSon.jouer(n); } catch (e) {} }
  function attendre(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  /* ---------- comparaison ---------- */
  function mots(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean); }
  function comparer(cible, entendu) {
    if (window.DiisooCoach && window.DiisooCoach._comparer) return window.DiisooCoach._comparer(cible, entendu);
    var H = mots(entendu), res = [], ok = 0;
    mots(cible).forEach(function (w) { var v = H.indexOf(w) > -1; if (v) ok++; res.push({ w: w, etat: v ? 2 : 0 }); });
    return { mots: res, score: res.length ? ok / res.length : 0 };
  }

  /* ---------- graphique en barres (PTE : décrire un graphique) ---------- */
  function graphique(g) {
    var W = 320, H = 190, m = 28, max = Math.max.apply(null, g.valeurs), n = g.valeurs.length, bw = (W - 2 * m) / n * 0.6, gap = (W - 2 * m) / n, s = "";
    s += '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" style="width:100%;background:#fff;border-radius:12px">';
    s += '<text x="' + W / 2 + '" y="16" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#222">' + esc(g.titre) + "</text>";
    s += '<line x1="' + m + '" y1="' + (H - 28) + '" x2="' + (W - m + 6) + '" y2="' + (H - 28) + '" stroke="#444"/>';
    g.valeurs.forEach(function (v, i) {
      var h = (H - 70) * v / max, x = m + i * gap + (gap - bw) / 2, y = H - 28 - h;
      s += '<rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + h + '" fill="#2f5ca3" rx="3"/>';
      s += '<text x="' + (x + bw / 2) + '" y="' + (y - 4) + '" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#222">' + v + "</text>";
      s += '<text x="' + (x + bw / 2) + '" y="' + (H - 12) + '" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#222">' + esc(g.labels[i]) + "</text>";
    });
    return s + "</svg>";
  }

  /* ---------- styles ---------- */
  var st = document.createElement("style");
  st.textContent =
    ".fx-reel{width:100%;min-height:56px;margin:6px 0 4px;border-radius:16px;border:0;background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;font-size:15px;font-weight:800;text-align:left;padding:8px 14px}" +
    ".fx-reel small{display:block;font-size:11px;font-weight:600;opacity:.85}" +
    "#dii-fmt{position:fixed;inset:0;z-index:99980;background:rgba(5,8,18,.96);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-fmt .fm-box{width:100%;max-width:520px;max-height:96vh;overflow-y:auto;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px 22px 0 0;padding:16px 16px 22px;color:#F6F1E7}" +
    "#dii-fmt .fm-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}" +
    "#dii-fmt .fm-x{width:44px;height:44px;border-radius:50%;background:#141A2B;border:1px solid #1E2740;color:#A69C86;font-size:16px;flex:none}" +
    "#dii-fmt .fm-tt{flex:1;text-align:center;font-size:11px;font-weight:700;letter-spacing:.08em;color:#8C8064;text-transform:uppercase}" +
    "#dii-fmt .fm-pg{height:6px;border-radius:99px;background:#141A2B;overflow:hidden;margin:0 0 12px}" +
    "#dii-fmt .fm-pg i{display:block;height:100%;background:#3FAE74}" +
    "#dii-fmt h3{font-size:20px;font-weight:800;margin:4px 0;text-align:center}" +
    "#dii-fmt .fm-p{font-size:13px;color:#A69C86;line-height:1.45;margin:6px 0;text-align:center}" +
    "#dii-fmt .fm-big{font-size:20px;font-weight:700;line-height:1.35;text-align:center;margin:12px 0}" +
    "#dii-fmt .fm-ico{font-size:50px;text-align:center;margin:8px 0}" +
    "#dii-fmt .fm-b{display:block;width:100%;min-height:52px;margin-top:8px;border:0;border-radius:14px;background:#25D366;color:#fff;font-size:16px;font-weight:800}" +
    "#dii-fmt .fm-b.s{background:#141A2B;border:1px solid #1E2740;color:#E4DCC9;font-weight:700;font-size:14px}" +
    "#dii-fmt .fm-b.l{opacity:.55}" +
    "#dii-fmt .fm-cd{height:10px;border-radius:99px;background:#141A2B;overflow:hidden;margin:12px 0 4px}" +
    "#dii-fmt .fm-cd i{display:block;height:100%;background:#E5484D;transition:width .25s linear}" +
    "#dii-fmt .fm-sec{text-align:center;font-size:30px;font-weight:800;color:#F3A94E}" +
    "#dii-fmt .fm-mots{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:10px 0}" +
    "#dii-fmt .fm-m{padding:6px 10px;border-radius:10px;border:2px solid #1E2740;background:#141A2B;font-size:16px;font-weight:700}" +
    "#dii-fmt .fm-m.v{border-color:#25D366;background:#12351F}#dii-fmt .fm-m.o{border-color:#F3A94E;background:#3A2A10}#dii-fmt .fm-m.r{border-color:#E5484D;background:#3A1515}" +
    "#dii-fmt .fm-tr{background:#141A2B;border:1px solid #1E2740;border-radius:12px;padding:10px;font-size:14px;line-height:1.4;margin:8px 0;color:#C9BFA8}" +
    "#dii-fmt .fm-doc{background:#F6F1E7;color:#1b1b1b;border-radius:12px;padding:12px;margin:8px 0;font-size:14px;line-height:1.6}" +
    "#dii-fmt .fm-doc b{display:block;margin-bottom:4px}" +
    "#dii-fmt .fm-img{margin:8px 0;border-radius:12px;overflow:hidden}#dii-fmt .fm-img svg{width:100%;height:auto;display:block}" +
    "#dii-fmt .fm-src{font-size:11px;color:#8C8064;text-align:center;margin-top:10px;line-height:1.4}";
  document.head.appendChild(st);
  var st2 = document.createElement("style");
  st2.textContent =
    "@keyframes fmpulse{0%{transform:scale(1)}50%{transform:scale(1.12)}100%{transform:scale(1)}}" +
    "#dii-fmt .fm-ico.on{animation:fmpulse 1.1s infinite}" +
    "#dii-fmt .fm-live{min-height:42px;background:#141A2B;border:1px dashed #2a3350;border-radius:12px;padding:8px 10px;font-size:14px;color:#E4DCC9;line-height:1.35;margin:8px 0;text-align:center}" +
    "#dii-fmt .fm-sug{background:#141A2B;border:1px solid #1E2740;border-radius:12px;padding:10px;margin:8px 0;font-size:13px;line-height:1.5;color:#E4DCC9}" +
    "#dii-fmt .fm-sug b{display:block;color:#F3A94E;font-size:12px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}" +
    "#dii-fmt .fm-sug small{display:block;color:#A69C86;font-size:11px;margin:1px 0 6px}" +
    "#dii-fmt .fm-auto{height:6px;border-radius:99px;background:#141A2B;overflow:hidden;margin:10px 0 4px}" +
    "#dii-fmt .fm-auto i{display:block;height:100%;width:100%;background:#25D366}" +
    "#exam-tests.fx-seul>*:not(.et-retour):not(.fx-reel){display:none!important}";
  document.head.appendChild(st2);

  var st3 = document.createElement("style");
  st3.textContent =
    "#dii-fmt .fm-box{background:radial-gradient(120% 70% at 50% 0%,#18233f 0%,#0B0F1C 62%);border-color:#2a3558}" +
    "#dii-fmt .fm-top{margin-bottom:10px}" +
    "#dii-fmt .fm-bd{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:99px;background:linear-gradient(90deg,#F3A94E,#E2703E);color:#1a1206;font-size:12px;font-weight:900;letter-spacing:.06em}" +
    "#dii-fmt .fm-tt{font-size:12px;color:#9fb4ff}" +
    "#dii-fmt .fm-pg{height:5px;margin-bottom:14px}#dii-fmt .fm-pg i{background:linear-gradient(90deg,#3FAE74,#8fe3b0);transition:width .4s}" +
    "#dii-fmt .fm-in{display:flex;justify-content:center;margin:2px 0 10px}" +
    "#dii-fmt .fm-chip{display:inline-block;padding:5px 12px;border-radius:99px;background:#1a2340;border:1px solid #2a3558;font-size:11px;font-weight:800;letter-spacing:.05em;color:#9fb4ff;text-transform:uppercase}" +
    "#dii-fmt .fm-q{background:#121a30;border:1px solid #2a3558;border-radius:20px;padding:18px 14px;font-size:21px;font-weight:800;text-align:center;line-height:1.3;margin:6px 0 10px}" +
    "#dii-fmt .fm-q.sm{font-size:16px;font-weight:700}" +
    "#dii-fmt .fm-ring{position:relative;width:118px;height:118px;margin:8px auto 2px}" +
    "#dii-fmt .fm-ring svg{width:118px;height:118px;transform:rotate(-90deg)}" +
    "#dii-fmt .fm-ring .t{fill:none;stroke:#1b2542;stroke-width:9}#dii-fmt .fm-ring .p{fill:none;stroke:#F3A94E;stroke-width:9;stroke-linecap:round;stroke-dasharray:314.2;stroke-dashoffset:0;transition:stroke-dashoffset .25s linear}" +
    "#dii-fmt .fm-ring .n{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:34px;font-weight:900;color:#F6F1E7;line-height:1}" +
    "#dii-fmt .fm-ring .n small{font-size:20px;margin-bottom:2px}" +
    "#dii-fmt .fm-ring.rec .p{stroke:#E5484D}#dii-fmt .fm-ring.rec::after{content:'';position:absolute;inset:-7px;border-radius:50%;border:2px solid rgba(229,72,77,.55);animation:fmhalo 1.3s infinite}" +
    "@keyframes fmhalo{0%{transform:scale(.96);opacity:.9}100%{transform:scale(1.12);opacity:0}}" +
    "#dii-fmt .fm-state{text-align:center;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#8C8064;margin:4px 0 8px}" +
    "#dii-fmt .fm-state.rec{color:#E5484D}" +
    "#dii-fmt .fm-kw{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:8px 0}" +
    "#dii-fmt .fm-w{padding:6px 10px;border-radius:10px;background:#141A2B;border:1.5px solid #243055;font-size:16px;font-weight:700;color:#7d86a3;transition:all .2s}" +
    "#dii-fmt .fm-w.ok{color:#fff;background:#12351F;border-color:#25D366;transform:scale(1.05)}" +
    "#dii-fmt .fm-id{width:44px;height:44px;border-radius:50%;background:#141A2B;border:2px dashed #243055;display:flex;align-items:center;justify-content:center;font-size:20px;transition:all .25s}" +
    "#dii-fmt .fm-id.ok{border-style:solid;border-color:#25D366;background:#12351F}" +
    "#dii-fmt .fm-ids{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:10px 0}" +
    "#dii-fmt .fm-mt{height:8px;border-radius:99px;background:#141A2B;overflow:hidden;margin:6px 0 2px}#dii-fmt .fm-mt i{display:block;height:100%;width:0;background:linear-gradient(90deg,#4f8cff,#8fe3b0);transition:width .3s}" +
    "#dii-fmt .fm-mtl{display:flex;justify-content:space-between;font-size:11px;color:#8C8064;font-weight:700}" +
    "#dii-fmt .fm-cn{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin:6px 0}#dii-fmt .fm-cn span{padding:3px 9px;border-radius:99px;border:1px solid #243055;font-size:11px;font-weight:700;color:#5d6685}#dii-fmt .fm-cn span.ok{color:#8fe3b0;border-color:#25D366;background:#12351F}" +
    "#dii-fmt .fm-row{display:flex;gap:8px;margin-top:8px}#dii-fmt .fm-row .fm-b{margin-top:0;flex:1;min-height:46px;font-size:13px}" +
    "#dii-fmt .fm-nx{position:relative;overflow:hidden}#dii-fmt .fm-nx i{position:absolute;left:0;top:0;bottom:0;width:0;background:rgba(255,255,255,.22)}#dii-fmt .fm-nx span{position:relative}" +
    "#dii-fmt .fm-sc{display:flex;align-items:center;gap:14px;margin:6px 0 8px}" +
    "#dii-fmt .fm-sc .c{flex:none;width:76px;height:76px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;border:6px solid #25D366;color:#F6F1E7}" +
    "#dii-fmt .fm-sc .c.o{border-color:#F3A94E}#dii-fmt .fm-sc .c.r{border-color:#E5484D}" +
    "#dii-fmt .fm-sc .d{flex:1;font-size:13px;color:#C9BFA8;line-height:1.4}#dii-fmt .fm-sc .d b{display:block;font-size:16px;color:#F6F1E7;margin-bottom:2px}" +
    "#dii-fmt .fm-hr{font-size:12px;color:#8C8064;text-align:center;margin:4px 0}" +
    "#dii-fmt .fm-tl{margin:8px 0}#dii-fmt .fm-tl div{display:flex;align-items:center;gap:10px;padding:9px 4px;border-bottom:1px solid #1b2542;font-size:14px;font-weight:700}#dii-fmt .fm-tl em{margin-left:auto;font-style:normal;font-size:11px;color:#8C8064;font-weight:700}" +
    "#dii-fmt .fm-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}" +
    "#dii-fmt .fm-tc{border:1.5px solid #2a3558;border-radius:16px;background:#121a30;color:#F6F1E7;padding:12px 10px;text-align:left;min-height:84px}#dii-fmt .fm-tc b{display:block;font-size:22px;color:#F3A94E}#dii-fmt .fm-tc small{font-size:12px;color:#A69C86;line-height:1.3}#dii-fmt .fm-tc.l{opacity:.6}" +
    "#dii-fmt .fm-st{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:6px 0}" +
    "#dii-fmt .fm-sk{margin:8px 0}#dii-fmt .fm-sk div.h{display:flex;justify-content:space-between;font-size:13px;font-weight:800}#dii-fmt .fm-sk .b{height:10px;border-radius:99px;background:#141A2B;overflow:hidden;margin-top:4px}#dii-fmt .fm-sk .b i{display:block;height:100%;border-radius:99px}" +
    "#dii-fmt .fm-doc{cursor:pointer}#dii-fmt .fm-doc div.hl{background:#ffe58a;border-radius:4px}" +
    "#dii-fmt details{margin-top:12px;font-size:11px;color:#8C8064}#dii-fmt summary{cursor:pointer;text-align:center}";
  document.head.appendChild(st3);

  /* ---------- lecteur ---------- */
  var ov = null, jeton = 0, minuteur = null, ecoute = null, vadT = null, autoT = null;
  function AUTO() { try { return localStorage.getItem("diisoo_fmt_auto") !== "0"; } catch (e) { return true; } }

  function nettoyer() {
    jeton++;
    if (minuteur) { clearInterval(minuteur); minuteur = null; }
    if (vadT) { clearInterval(vadT); vadT = null; }
    if (autoT) { clearTimeout(autoT); autoT = null; }
    if (ecoute) { try { ecoute.stop(); } catch (e) {} ecoute = null; }
    try { if (typeof stopAllAudio === "function") stopAllAudio(); } catch (e) {}
  }
  function fermer() { nettoyer(); if (ov) { ov.remove(); ov = null; } }

  var BADGE = "";
  function cadre(titre, prog) {
    if (!ov) {
      ov = el("div"); ov.id = "dii-fmt"; ov.setAttribute("role", "dialog");
      ov.appendChild(el("div", "fm-box")); document.body.appendChild(ov);
    }
    var box = ov.firstChild; box.innerHTML = ""; box.scrollTop = 0;
    var top = el("div", "fm-top");
    var x = el("button", "fm-x", "✕"); x.type = "button"; x.setAttribute("aria-label", "Fermer"); x.onclick = fermer;
    top.appendChild(x);
    var mid = el("div", "fm-tt"); mid.style.display = "flex"; mid.style.flexDirection = "column"; mid.style.alignItems = "center"; mid.style.gap = "3px";
    if (BADGE) mid.appendChild(el("span", "fm-bd", BADGE));
    mid.appendChild(el("span", null, titre || ""));
    top.appendChild(mid); top.appendChild(el("div")); top.lastChild.style.width = "44px";
    box.appendChild(top);
    if (prog != null) { var pg = el("div", "fm-pg"); var i = el("i"); i.style.width = Math.round(prog * 100) + "%"; pg.appendChild(i); box.appendChild(pg); }
    return box;
  }
  function bouton(box, txt, fn, cls) { var b = el("button", "fm-b" + (cls ? " " + cls : ""), txt); b.type = "button"; b.onclick = fn; box.appendChild(b); return b; }

  /* contenu visuel d'un item : photo, graphique, document (lignes à surligner du doigt) */
  function support(box, e, sansTexte) {
    var it = e.item;
    if (it && typeof it === "object") {
      if (it.scene) {
        var im = el("div", "fm-img");
        try { im.innerHTML = window.DiisooExams ? window.DiisooExams.scene(it.scene) : ""; } catch (x) {}
        box.appendChild(im);
      }
      if (it.graphique) { var gi = el("div", "fm-img"); gi.innerHTML = graphique(it.graphique); box.appendChild(gi); }
    }
    if (e.doc) {
      var d = el("div", "fm-doc"); var t = el("b", null, e.doc.titre); d.appendChild(t);
      e.doc.lignes.forEach(function (l) { var r = el("div", null, l); r.onclick = function () { r.classList.toggle("hl"); }; d.appendChild(r); });
      box.appendChild(d);
      box.appendChild(el("div", "fm-hr", "Touche une ligne pour la surligner"));
    }
    if (e.visible && !sansTexte) box.appendChild(el("div", "fm-q", e.visible));
  }
  var ICONES = { repeat: "🔁", readaloud: "📖", question: "❓", prompt: "💬", describe: "🖼️", info: "📄", retell: "🎧", short: "⚡" };
  function courte(t) { var c = String(t || "").split(/[.:]/)[0]; return c.length > 60 ? c.slice(0, 57) + "…" : c; }
  function faibles() { try { return JSON.parse(localStorage.getItem("diisoo_fmt_faibles") || "[]") || []; } catch (e) { return []; } }
  function memoFaibles(liste) {
    try { var f = faibles(); liste.forEach(function (w) { if (f.indexOf(w) < 0) f.push(w); }); localStorage.setItem("diisoo_fmt_faibles", JSON.stringify(f.slice(-40))); } catch (e) {}
  }

  /* ---------- accueil d'un examen ---------- */
  var BANAL = /^(about|every|there|their|would|which|always|because|today|while|other|these|those|after|before|again|really|still|three|small)$/;
  function clesDe(txt) {
    var vus = {}, out = [];
    (txt.match(/[A-Za-z']{5,}|\b\d+\b/g) || []).forEach(function (w) {
      var k = w.toLowerCase(); if (BANAL.test(k) || vus[k]) return; vus[k] = 1; if (out.length < 8) out.push(k);
    });
    return out;
  }
  function enrichir() {
    try {
      Object.keys(REG.examens).forEach(function (k) {
        var ex = REG.examens[k];
        if (!ex.import_ancien || !ex.enregistrements || ex._imp || typeof TEST_BANK === "undefined") return;
        ex._imp = true;
        TEST_BANK.forEach(function (t) {
          var rec = ex.enregistrements[t.id];
          if (!rec || ex.tests.some(function (x) { return x.id === "ie-" + t.id; })) return;
          var ph = {}; (t.phases || []).forEach(function (p) { ph[p.id] = p.questions || []; });
          var th = t.topic;
          ex.tests.push({ id: "ie-" + t.id, titre: th,
            p1a: (ph["1a"] || []).slice(0, 3), p1b: (ph["1b"] || []).slice(0, 5),
            ask: ["Ask the examiner three questions about this theme: " + th + ". Start with What, Where or Do you."],
            p2a: [{ t: rec, cles: clesDe(rec) }],
            p2b: (ph["2b"] || []).slice(0, 2).concat(["What do you like or dislike about " + th.toLowerCase().replace(/&/g, "and") + "? Explain why."]) });
        });
      });
    } catch (e) { console.warn("[diisoo] import examens", e); }
  }
  function nbReel(ex, t) {
    var test = ex.tests[0], b = test[t.banque || t.type];
    if (t.type === "info") return t.nb;
    return b ? Math.min(t.nb, b.length) : t.nb;
  }
  function ouvrir(cle) {
    var ex = REG && REG.examens && REG.examens[cle]; if (!ex) return;
    enrichir();
    nettoyer();
    BADGE = ex.bouton ? ex.groupe + " " + ex.bouton : ex.court;
    var box = cadre("Format réel");
    box.appendChild(el("h3", null, ex.nom));
    var minutes = Math.max(1, Math.round(ex.taches.reduce(function (s, t) {
      return s + (t.type === "info" ? t.nb * ((t.lecture_s || 0) / Math.max(1, t.nb) + 20) : t.nb * ((t.prep_s || 0) + (t.rep_s || 10) + 8));
    }, 0) / 60));
    var st = el("div", "fm-st");
    st.appendChild(el("span", "fm-chip", "⏱ ~" + minutes + " min"));
    st.appendChild(el("span", "fm-chip", ex.taches.length + " parties"));
    st.appendChild(el("span", "fm-chip", "🎙️ Micro"));
    box.appendChild(st);
    var tl = el("div", "fm-tl");
    ex.taches.forEach(function (t) {
      var r = el("div"); r.appendChild(el("span", null, (ICONES[t.type] || "•") + " " + t.titre));
      r.appendChild(el("em", null, nbReel(ex, t) + " × " + (t.type === "info" ? t.reps.join("/") : t.rep_s) + " s"));
      tl.appendChild(r);
    });
    box.appendChild(tl);
    var libre = false; try { libre = typeof aAcces === "function" && aAcces("premium"); } catch (e) {}
    var grille = el("div", "fm-grid");
    ex.tests.forEach(function (t, i) {
      var verrou = i >= (ex.gratuits || 1) && !libre;
      var b = el("button", "fm-tc" + (verrou ? " l" : "")); b.type = "button";
      b.innerHTML = "<b>" + (verrou ? "⭐ " : "") + (i + 1) + "</b><small>" + esc(t.titre) + "</small>";
      b.onclick = function () {
        if (verrou) { try { toast("Ce test est réservé aux abonnés Diisoo Plus."); openPremium(); } catch (e) {} return; }
        lancer(cle, i);
      };
      grille.appendChild(b);
    });
    box.appendChild(grille);
    var fb = faibles();
    if (fb.length) bouton(box, "📌 Mots à revoir (" + fb.length + ")", function () { revoir(cle); }, "s");
    var ba = bouton(box, "", function () {
      try { localStorage.setItem("diisoo_fmt_auto", AUTO() ? "0" : "1"); } catch (e) {}
      ba.textContent = "⚙️ Question suivante automatique : " + (AUTO() ? "oui" : "non");
    }, "s");
    ba.textContent = "⚙️ Question suivante automatique : " + (AUTO() ? "oui" : "non");
    var dt = el("details"); dt.appendChild(el("summary", null, "À propos de ce test"));
    dt.appendChild(el("p", "fm-src", ex.confiance + " Dernière vérification : " + ex.verifie_le + ". Tests créés par Diisoo, sans affiliation avec les organismes d'examen."));
    box.appendChild(dt);
  }

  /* mots à revoir : touche un mot pour l'entendre, redis-le, puis efface-le de la liste */
  function revoir(cle) {
    var box = cadre("Mots à revoir");
    box.appendChild(el("h3", null, "📌 Mots à travailler"));
    box.appendChild(el("div", "fm-hr", "Touche un mot : tu l'entends. Dis-le à voix haute. Appui long pour l'effacer."));
    var wrap = el("div", "fm-kw");
    faibles().forEach(function (w) {
      var c = el("button", "fm-w", w); c.type = "button";
      var t0 = 0;
      c.onclick = function () { try { speak(w, "en-US", 0.8); } catch (x) {} };
      c.oncontextmenu = function (ev) { ev.preventDefault(); try { localStorage.setItem("diisoo_fmt_faibles", JSON.stringify(faibles().filter(function (z) { return z !== w; }))); } catch (x) {} c.remove(); };
      c.addEventListener("touchstart", function () { t0 = Date.now(); c._lp = setTimeout(function () { try { localStorage.setItem("diisoo_fmt_faibles", JSON.stringify(faibles().filter(function (z) { return z !== w; }))); } catch (x) {} c.remove(); }, 700); }, { passive: true });
      c.addEventListener("touchend", function () { clearTimeout(c._lp); }, { passive: true });
      wrap.appendChild(c);
    });
    box.appendChild(wrap);
    bouton(box, "Retour", function () { ouvrir(cle); }, "s");
  }

  /* ---------- déroulé d'un test ---------- */
  function lancer(cle, ti) {
    var ex = REG.examens[cle], test = ex.tests[ti], etapes = [];
    ex.taches.forEach(function (t) {
      var banque = test[t.banque || t.type] || [];
      if (t.type === "info") {
        banque.forEach(function (g) {
          g.questions.forEach(function (q, j) {
            etapes.push({ tache: { id: t.id, type: "question", titre: t.titre, prep_s: t.prep_s, rep_s: t.reps[j] || 15, consigne: t.consigne },
              i: j, n: g.questions.length, item: q, doc: g.doc, lecture: j === 0 ? t.lecture_s : 0 });
          });
        });
        return;
      }
      for (var i = 0; i < t.nb && i < banque.length; i++) etapes.push({ tache: t, i: i, n: Math.min(t.nb, banque.length), item: banque[i] });
    });
    var bilan = { precision: [], courtes: [], oraux: [], cles: [], corr: [], mots: [], expr: [] };

    function texteDe(e) { var it = e.item; return typeof it === "string" ? it : (it.t || it.q || it.consigne || ""); }
    function etape(k) {
      if (k >= etapes.length) return fin(cle, ti, bilan);
      var e = etapes[k], mon = ++jeton, ty = e.tache.type;
      e.k = k; e.mon = mon; e.prog = k / etapes.length; e.titre = e.tache.titre + (e.n > 1 ? " " + (e.i + 1) + "/" + e.n : "");
      if (ty === "readaloud") return lire(e);
      if (ty === "prompt") return consigne(e);
      if (ty === "describe") return decrire(e);
      return ecouter(e);   /* repeat, question, retell, short */
    }

    function compte(box, sec, surFin, rec) {
      var ring = el("div", "fm-ring" + (rec ? " rec" : ""));
      ring.innerHTML = '<svg viewBox="0 0 118 118"><circle class="t" cx="59" cy="59" r="50"/><circle class="p" cx="59" cy="59" r="50"/></svg><div class="n"></div>';
      var tx = ring.querySelector(".n"), pr = ring.querySelector(".p");
      tx.textContent = String(sec); box.appendChild(ring);
      var t0 = Date.now(), tot = sec * 1000;
      if (minuteur) clearInterval(minuteur);
      minuteur = setInterval(function () {
        var r = Math.max(0, tot - (Date.now() - t0));
        tx.textContent = String(Math.ceil(r / 1000)); pr.style.strokeDashoffset = String(314.2 * (1 - r / tot));
        if (r <= 0) { clearInterval(minuteur); minuteur = null; if (surFin) surFin(); }
      }, 250);
      return ring;
    }
    function arret() { if (minuteur) { clearInterval(minuteur); minuteur = null; } }
    function puce(box, txt) { var w = el("div", "fm-in"); w.appendChild(el("span", "fm-chip", txt)); box.appendChild(w); }

    /* attente avant de parler : lecture du document, préparation */
    function preparer(e, secondes, libelle, suite, avecSupport) {
      var box = cadre(e.titre, e.prog);
      puce(box, courte(libelle));
      if (avecSupport) support(box, e);
      var go = function () { if (e.mon === jeton) { arret(); suite(); } };
      compte(box, secondes, go, false);
      box.appendChild(el("div", "fm-state", "Prépare-toi"));
      bouton(box, "Je suis prêt", go, "s");
    }

    function silenceMs(t) {
      if (t.silence_ms) return t.silence_ms;
      if (t.type === "short") return 1100;
      if (t.type === "repeat") return 1400;
      if (t.type === "question") return t.rep_s <= 20 ? 1800 : (t.rep_s <= 30 ? 2100 : 2600);
      return 2800;
    }

    /* lecture karaoké : chaque mot s'allume quand tu le dis (cacher = mots masqués, comme à l'examen) */
    function karaoke(box, cible, cacher, petit) {
      var wrap = el("div", "fm-kw"), chips = [];
      cible.split(/\s+/).filter(Boolean).forEach(function (tok) {
        var n = mots(tok)[0] || ""; var c = el("span", "fm-w", cacher ? Array(Math.min(Math.max(n.length, 2), 6) + 1).join("•") : tok);
        if (petit) { c.style.fontSize = "14px"; c.style.padding = "3px 6px"; }
        c._n = n; c._t = tok; wrap.appendChild(c); chips.push(c);
      });
      box.appendChild(wrap);
      return function (txt) {
        var H = mots(txt);
        chips.forEach(function (c) { if (c.classList.contains("ok") || !c._n) return; if (H.indexOf(c._n) > -1) { c.classList.add("ok"); c.textContent = c._t; } });
      };
    }
    function aMatch(dit, spec) {
      var d = " " + mots(dit).join(" ") + " ";
      return String(spec).split("|").some(function (a) { var m = mots(a).join(" "); return m && d.indexOf(" " + m + " ") > -1; });
    }
    function ideesLive(box, cles) {
      var wrap = el("div", "fm-kw"), ch = [];
      cles.forEach(function (k) { var c = el("span", "fm-w", "•••"); c._k = k; wrap.appendChild(c); ch.push(c); });
      box.appendChild(wrap);
      return function (txt) { ch.forEach(function (c) { if (!c.classList.contains("ok") && aMatch(txt, c._k)) { c.classList.add("ok"); c.textContent = String(c._k).split("|")[0]; } }); };
    }
    var CONN = ["because", "and", "but", "for example"], QDEB = /\b(what|where|when|who|why|how|do you|did you|are you|is it|can you|have you|would you|could you)\b/gi;
    function metreLive(box, objectif, ask) {
      var up;
      if (ask) {
        var ids = el("div", "fm-ids"), pts = [];
        [1, 2, 3].forEach(function (n) { var c = el("div", "fm-id", String(n)); ids.appendChild(c); pts.push(c); });
        box.appendChild(ids);
        up = function (txt) { var q = (txt.match(QDEB) || []).length; pts.forEach(function (c, i) { if (i < q) { c.classList.add("ok"); c.textContent = "✓"; } }); };
      } else {
        var mt = el("div", "fm-mt"), bi = el("i"); mt.appendChild(bi); box.appendChild(mt);
        var lg = el("div", "fm-mtl"), l1 = el("span", null, "0 mot"), l2 = el("span", null, "objectif ~" + objectif); lg.appendChild(l1); lg.appendChild(l2); box.appendChild(lg);
        var cn = el("div", "fm-cn"), cs = []; CONN.forEach(function (w) { var c = el("span", null, w); cn.appendChild(c); cs.push(c); }); box.appendChild(cn);
        up = function (txt) {
          var n = mots(txt).length; bi.style.width = Math.min(100, Math.round(n / objectif * 100)) + "%"; l1.textContent = n + (n > 1 ? " mots" : " mot");
          var d = txt.toLowerCase(); cs.forEach(function (c, i) { if (d.indexOf(CONN[i]) > -1) c.classList.add("ok"); });
        };
      }
      return up;
    }

    function parler(e) {
      var t = e.tache, ty = t.type, cible = texteDe(e), box = cadre(e.titre, e.prog);
      puce(box, courte(t.consigne));
      var objectif = Math.round(t.rep_s * 1.2), maj = function () {};
      if (ty === "repeat") maj = karaoke(box, cible, true, false);
      else if (ty === "readaloud") maj = karaoke(box, cible, false, true);
      else if (ty === "retell" && e.item.cles) maj = ideesLive(box, e.item.cles);
      else {
        support(box, e);
        if (ty !== "short") maj = (e.item && e.item.cles) ? ideesLive(box, e.item.cles) : metreLive(box, objectif, t.id === "ask");
      }
      var ring = null, etat = el("div", "fm-state rec", "● Je t'écoute");
      var live = el("div", "fm-hr", "");
      var debut = Date.now(), fini = false, aParle = false, dernier = Date.now();
      var seuil = silenceMs(t), minM = ty === "repeat" ? 2 : 1, attenteMax = Math.min(9000, t.rep_s * 600);
      function terminer(res) {
        if (fini || e.mon !== jeton) return; fini = true;
        if (vadT) { clearInterval(vadT); vadT = null; }
        arret(); ecoute = null;
        resultat(e, res || { text: "" }, (Date.now() - debut) / 1000);
      }
      function stopper(raison) {
        if (fini) return;
        if (raison === "silence") { son("ferme"); etat.textContent = "✅ Terminé"; etat.className = "fm-state"; if (ring) ring.classList.remove("rec"); }
        else if (raison === "rien") { etat.textContent = "Je n'ai rien entendu"; etat.className = "fm-state"; }
        try { ecoute && ecoute.stop(); } catch (x) {}
      }
      son("ouvre");
      try {
        ecoute = startListening("en-US", t.rep_s * 1000, true, function (txt) {
          dernier = Date.now();
          if (!aParle && mots(txt).length >= minM) aParle = true;
          maj(txt); live.textContent = txt.length > 90 ? "…" + txt.slice(-90) : txt;
        });
        ecoute.promise.then(terminer, function () { terminer({ text: "" }); });
      } catch (err) { terminer({ text: "", unsupported: true }); }
      if (vadT) clearInterval(vadT);
      vadT = setInterval(function () {
        var now = Date.now();
        if (aParle && now - dernier >= seuil) stopper("silence");
        else if (!aParle && now - debut >= attenteMax) stopper("rien");
      }, 150);
      ring = compte(box, t.rep_s, function () { try { ecoute && ecoute.stop(); } catch (x) {} }, true);
      box.appendChild(etat); box.appendChild(live);
      bouton(box, "✋ J'ai fini", function () { try { ecoute && ecoute.stop(); } catch (x) {} }, "s");
    }

    /* la consigne est dite une seule fois, puis préparation éventuelle, puis réponse */
    function ecouter(e) {
      var ty = e.tache.type, box = cadre(e.titre, e.prog);
      if (e.lecture) {
        e.lecture0 = e.lecture; e.lecture = 0;
        return preparer(e, e.lecture0, "Lis le document", function () { ecouter(e); }, true);
      }
      puce(box, courte(e.tache.consigne));
      box.appendChild(el("div", "fm-ico on", "🔊"));
      box.appendChild(el("div", "fm-state", "Écoute : une seule fois"));
      if (e.doc) support(box, e);
      Promise.race([Promise.resolve().then(function () { return speak(texteDe(e), "en-US", 0.95); }), attendre(40000)]).then(function () {
        if (e.mon !== jeton) return;
        if (ty === "question") e.visible = texteDe(e);
        if (ty === "retell") e.visible = "";
        if (e.tache.prep_s) preparer(e, e.tache.prep_s, "Temps de préparation", function () { parler(e); }, true);
        else parler(e);
      }, function () { if (e.mon === jeton) { e.visible = texteDe(e); parler(e); } });
    }

    function lire(e) {
      var go = function () { parler(e); };
      e.visible = texteDe(e);
      if (e.tache.prep_s) preparer(e, e.tache.prep_s, e.tache.consigne, go, false);
      else go();
    }
    function consigne(e) {
      e.visible = texteDe(e);
      var run = function () {
        if (e.tache.prep_s) preparer(e, e.tache.prep_s, e.tache.consigne, function () { parler(e); }, true);
        else parler(e);
      };
      if (e.tache.lue) { try { speak(e.visible, "en-US", 0.95); } catch (x) {} }
      run();
    }
    function decrire(e) {
      e.visible = "";
      if (e.tache.prep_s) preparer(e, e.tache.prep_s, e.tache.consigne, function () { parler(e); }, true);
      else { var b = cadre(e.titre, e.prog); puce(b, courte(e.tache.consigne)); support(b, e); bouton(b, "🎙️ Commencer à parler", function () { parler(e); }); }
    }

    function resultat(e, res, dur) {
      var ty = e.tache.type, k = e.k, box = cadre(e.titre, (k + 1) / etapes.length);
      var texte = (res.text || "").trim(), cible = texteDe(e);
      var suite = function (nSug, manuel) {
        var dernierEl = k + 1 >= etapes.length, mon2 = jeton, ms = Math.min(10000, 4000 + 1500 * (nSug || 0));
        var go = function () { if (mon2 !== jeton) return; if (autoT) { clearTimeout(autoT); autoT = null; } etape(k + 1); };
        var row = el("div", "fm-row");
        var nx = el("button", "fm-b fm-nx"); nx.type = "button"; nx.style.flex = "3";
        var fill = el("i"); nx.appendChild(fill); nx.appendChild(el("span", null, dernierEl ? "Voir mon bilan" : "Suivant ›")); nx.onclick = go; row.appendChild(nx);
        if (AUTO() && !manuel) {
          fill.style.transition = "width " + ms + "ms linear";
          requestAnimationFrame(function () { requestAnimationFrame(function () { fill.style.width = "100%"; }); });
          var pz = el("button", "fm-b s", "⏸"); pz.type = "button"; pz.setAttribute("aria-label", "Rester ici");
          pz.onclick = function () { if (autoT) { clearTimeout(autoT); autoT = null; } fill.style.transition = "none"; fill.style.width = "0"; pz.remove(); };
          row.appendChild(pz); autoT = setTimeout(go, ms);
        }
        box.appendChild(row);
      };
      var conseils = function (libre) {
        if (!window.DiisooOral) return 0;
        var a = window.DiisooOral.analyser(texte, texteDe(e), { duree: e.tache.rep_s, ask: e.tache.id === "ask", court: ty === "short", libre: libre });
        var n = 0;
        bilan.corr.push(a.corrections.length ? 1 : 0);
        if (a.corrections.length) {
          var c = el("div", "fm-sug"); c.appendChild(el("b", null, "À corriger"));
          a.corrections.forEach(function (f) { var d = el("div"); d.innerHTML = "❌ <s>" + esc(f.avant) + "</s> → ✅ <b>" + esc(f.apres) + "</b><small>" + esc(f.note) + "</small>"; c.appendChild(d); n++; });
          box.appendChild(c);
        }
        if (a.conseils.length) {
          var g = el("div", "fm-sug"); g.appendChild(el("b", null, "Pour progresser"));
          a.conseils.forEach(function (x) { g.appendChild(el("div", null, "💡 " + x)); n++; });
          box.appendChild(g);
        }
        return n;
      };
      var rejouer = function () { bouton(box, "↻ Recommencer cette question", function () { var m = ++jeton; e.mon = m; ecouter(e); }, "s"); };
      function carte(val, cls, titre, detail) {
        var c = el("div", "fm-sc"); c.appendChild(el("div", "c " + cls, val));
        var d = el("div", "d"); d.appendChild(el("b", null, titre)); d.appendChild(document.createTextNode(detail)); c.appendChild(d); box.appendChild(c);
      }
      function entendu() { box.appendChild(el("div", "fm-hr", "Entendu : « " + (texte.length > 140 ? texte.slice(0, 137) + "…" : texte) + " »")); }

      if (res.unsupported) {
        puce(box, "Micro non disponible");
        if (ty === "repeat" || ty === "readaloud") box.appendChild(el("div", "fm-q sm", cible));
        bouton(box, "✅ C'était bien", function () { noter(e, ty, 1, dur, 0); etape(k + 1); });
        bouton(box, "❌ Pas encore", function () { noter(e, ty, 0, dur, 0); etape(k + 1); }, "s");
        return;
      }
      if (!texte) {
        box.appendChild(el("div", "fm-ico", "🤔"));
        box.appendChild(el("div", "fm-state", "Rien entendu : rapproche le téléphone"));
        noter(e, ty, 0, dur, 0);
        suite(0, true); rejouer(); return;
      }
      if (ty === "repeat" || ty === "readaloud") {
        var cmp = comparer(cible, texte), pc = Math.round(cmp.score * 100);
        bilan.precision.push(cmp.score);
        var rates = []; cmp.mots.forEach(function (m) { if (m.etat === 0 && m.w.length >= 3 && rates.indexOf(m.w) < 0) rates.push(m.w); });
        bilan.mots = bilan.mots.concat(rates); if (rates.length) memoFaibles(rates);
        carte(pc + "%", pc >= 80 ? "" : (pc >= 50 ? "o" : "r"), pc >= 80 ? "Très bien" : (pc >= 50 ? "Presque" : "À refaire"), cmp.mots.filter(function (m) { return m.etat === 2; }).length + " mots sur " + cmp.mots.length);
        var wrap = el("div", "fm-mots");
        cmp.mots.forEach(function (m) { wrap.appendChild(el("span", "fm-m " + (m.etat === 2 ? "v" : (m.etat === 1 ? "o" : "r")), m.w)); });
        box.appendChild(wrap);
        son(pc >= 80 ? "juste" : "reessaie");
        var r1 = el("div", "fm-row");
        var b1 = el("button", "fm-b s", "🔊 Modèle"); b1.type = "button"; b1.onclick = function () { try { speak(cible, "en-US", 0.85); } catch (x) {} };
        var b2 = el("button", "fm-b s", "↻ Refaire"); b2.type = "button"; b2.onclick = function () { var m = ++jeton; e.mon = m; ecouter(e); };
        r1.appendChild(b1); r1.appendChild(b2); box.appendChild(r1);
        suite(pc >= 80 ? 0 : 1); return;
      }
      if (ty === "short") {
        var rep = mots(texte), bonnes = e.item.a || [], jn = " " + rep.join(" ") + " ", jn2 = jn.replace(/(\d) (?=\d{3}(?!\d))/g, "$1");
        var ok = bonnes.some(function (a) { var x = " " + String(a).toLowerCase() + " "; return jn.indexOf(x) > -1 || jn2.indexOf(x) > -1; });
        bilan.courtes.push(ok ? 1 : 0);
        carte(ok ? "✓" : "✗", ok ? "" : "r", ok ? "Bonne réponse" : "Réponse attendue", ok ? "« " + texte + " »" : bonnes.join(" / "));
        son(ok ? "juste" : "reessaie"); suite(ok ? 0 : 1); return;
      }
      var n = mots(texte).length, objectif = Math.round(e.tache.rep_s * 1.2), plein = n >= objectif * 0.6, wpm = dur > 3 ? Math.round(n / dur * 60) : 0;
      bilan.oraux.push({ mots: n, obj: objectif });
      carte(String(n), plein ? "" : "o", plein ? "Bonne longueur" : "Développe un peu", "mots en " + Math.round(dur) + " s" + (wpm ? " · " + wpm + " mots/min" : "") + " · objectif ~" + objectif);
      entendu();
      if (ty === "retell" && e.item.cles) {
        var dit = texte.toLowerCase(), trouves = e.item.cles.filter(function (c) { return dit.indexOf(c.toLowerCase()) > -1; });
        bilan.cles.push(trouves.length / e.item.cles.length);
        var iw = el("div", "fm-kw");
        e.item.cles.forEach(function (c) { var ok2 = trouves.indexOf(c) > -1; iw.appendChild(el("span", "fm-w" + (ok2 ? " ok" : ""), ok2 ? c : "▢ " + c)); });
        box.appendChild(iw);
        box.appendChild(el("div", "fm-hr", "Idées retrouvées : " + trouves.length + " / " + e.item.cles.length));
      }
      if (ty !== "retell" && e.item && e.item.cles) {
        var ok3 = 0, wr = el("div", "fm-kw");
        e.item.cles.forEach(function (c) { var hit = aMatch(texte, c); if (hit) ok3++; wr.appendChild(el("span", "fm-w" + (hit ? " ok" : ""), (hit ? "" : "▢ ") + String(c).split("|")[0])); });
        bilan.expr.push(ok3 / e.item.cles.length);
        box.appendChild(el("div", "fm-hr", "Expressions utiles : " + ok3 + " / " + e.item.cles.length));
        box.appendChild(wr);
      }
      if (e.item && e.item.modele) {
        var mo = el("div", "fm-sug"); mo.appendChild(el("b", null, "Réponse modèle")); mo.appendChild(el("div", null, e.item.modele));
        var mb = el("button", "fm-b s", "🔊 Écouter le modèle"); mb.type = "button"; mb.style.minHeight = "40px"; mb.onclick = function () { try { speak(e.item.modele, "en-US", 0.9); } catch (x) {} };
        mo.appendChild(mb); box.appendChild(mo);
      }
      var nS = conseils(ty !== "question");
      suite(nS);
    }
    function noter(e, ty, v, dur, n) {
      if (ty === "repeat" || ty === "readaloud") bilan.precision.push(v);
      else if (ty === "short") bilan.courtes.push(v);
      else bilan.oraux.push({ mots: n, obj: Math.round(e.tache.rep_s * 1.2), manuel: v });
    }
    etape(0);
  }

  function fin(cle, ti, bilan) {
    nettoyer();
    var ex = REG.examens[cle];
    var box = cadre("Bilan");
    function moy(a) { return a.reduce(function (s, v) { return s + v; }, 0) / a.length; }
    var sk = [];
    if (bilan.precision.length) sk.push({ k: "pron", n: "Prononciation", v: moy(bilan.precision), c: "Répète à voix haute les mots à revoir, 5 minutes par jour." });
    if (bilan.oraux.length) sk.push({ k: "flu", n: "Fluidité", v: moy(bilan.oraux.map(function (o) { return Math.min(1, o.mots / o.obj); })), c: "Parle plus longtemps : une idée, une raison, un exemple." });
    if (bilan.expr.length) sk.push({ k: "expr", n: "Expressions pro", v: moy(bilan.expr), c: "Utilise les expressions du métier : demande polie, prix, garantie, livraison." });
    if (bilan.cles.length) sk.push({ k: "cont", n: "Compréhension", v: moy(bilan.cles), c: "Avant de répondre, retiens 3 idées clés de ce que tu entends." });
    if (bilan.corr.length) sk.push({ k: "gram", n: "Grammaire", v: 1 - moy(bilan.corr), c: "Relis tes corrections et refais la phrase correctement à voix haute." });
    if (bilan.courtes.length) sk.push({ k: "vit", n: "Réponses rapides", v: moy(bilan.courtes), c: "Réponds vite, en un ou deux mots, sans chercher la phrase parfaite." });
    var indice = sk.length ? Math.round(moy(sk.map(function (x) { return x.v; })) * 100) : 0;
    var carte = el("div", "fm-sc"); carte.appendChild(el("div", "c " + (indice >= 70 ? "" : (indice >= 45 ? "o" : "r")), String(indice)));
    var d = el("div", "d"); d.appendChild(el("b", null, "Indice Diisoo")); d.appendChild(document.createTextNode("sur 100, mesuré à partir de tes réponses. Pas une note officielle.")); carte.appendChild(d); box.appendChild(carte);
    sk.forEach(function (x) {
      var p = Math.round(x.v * 100), col = p >= 70 ? "#25D366" : (p >= 45 ? "#F3A94E" : "#E5484D");
      var r = el("div", "fm-sk"); r.innerHTML = '<div class="h"><span>' + x.n + '</span><span style="color:' + col + '">' + p + ' %</span></div><div class="b"><i style="width:' + p + '%;background:' + col + '"></i></div>';
      box.appendChild(r);
    });
    if (sk.length) {
      var faible = sk.slice().sort(function (a, b) { return a.v - b.v; })[0];
      var g = el("div", "fm-sug"); g.appendChild(el("b", null, "Ton objectif pour la prochaine fois")); g.appendChild(el("div", null, "🎯 " + faible.n + " : " + faible.c)); box.appendChild(g);
    }
    var uniq = []; bilan.mots.forEach(function (w) { if (uniq.indexOf(w) < 0) uniq.push(w); });
    if (uniq.length) {
      box.appendChild(el("div", "fm-hr", "📌 Mots à revoir (enregistrés) : touche pour écouter"));
      var wrap = el("div", "fm-kw");
      uniq.slice(0, 12).forEach(function (w) { var c = el("button", "fm-w", w); c.type = "button"; c.onclick = function () { try { speak(w, "en-US", 0.8); } catch (x) {} }; wrap.appendChild(c); });
      box.appendChild(wrap);
    }
    try { if (typeof addXP === "function") addXP(8); if (typeof bumpDailyGoal === "function") bumpDailyGoal(1); } catch (e) {}
    try {
      var h = JSON.parse(localStorage.getItem("diisoo_fmt") || "[]"); h.push({ e: cle, t: ex.tests[ti].id, d: new Date().toISOString().slice(0, 10), i: indice });
      localStorage.setItem("diisoo_fmt", JSON.stringify(h.slice(-60)));
    } catch (e) {}
    bouton(box, "↻ Refaire ce test", function () { lancer(cle, ti); });
    var rw = el("div", "fm-row");
    var b2 = el("button", "fm-b s", "Autre test"); b2.type = "button"; b2.onclick = function () { ouvrir(cle); };
    var b3 = el("button", "fm-b s", "Fermer"); b3.type = "button"; b3.onclick = fermer;
    rw.appendChild(b2); rw.appendChild(b3); box.appendChild(rw);
  }

  /* ---------- boutons dans la liste des tests ---------- */
  function brancherBiz() {
    var a = $("business-picker");
    if (!a || !a.parentNode || $("fx-biz-btn")) return;
    if (!REG) { charger().then(brancherBiz); return; }
    if (!REG.examens || !REG.examens.business) return;
    var b = el("button", "fx-reel"); b.id = "fx-biz-btn"; b.type = "button";
    b.innerHTML = "🎯 Simulation professionnelle<small>Vends, achète, négocie : comme en vrai</small>";
    b.onclick = function () { ouvrir("business"); };
    a.parentNode.insertBefore(b, a);
  }
  function brancher() {
    brancherBiz();
    var box = $("exam-tests");
    if (box && box.style.display === "none") delete box.dataset.auto;
    if (!box || box.style.display === "none" || box.querySelector(".fx-reel")) return;
    var titre = box.querySelector(".et-titre");
    if (!titre) return;
    if (!REG) { charger().then(brancher); return; }
    var txt = (titre.textContent || "").toLowerCase(), cles = [];
    Object.keys(REG.examens).forEach(function (k) {
      var g = (REG.examens[k].groupe || REG.examens[k].court).toLowerCase();
      if (txt.indexOf(g) === 0) cles.push(k);
    });
    var ref = titre, seul = null;
    cles.forEach(function (k) { if (REG.examens[k].remplace_ancien) seul = k; });
    if (seul) box.classList.add("fx-seul");
    cles.forEach(function (k) {
      var ex = REG.examens[k], b = el("button", "fx-reel"); b.type = "button";
      b.innerHTML = "🎯 Format réel " + esc(ex.bouton ? ex.groupe + " " + ex.bouton : ex.court) + "<small>Comme à l'examen</small>";
      b.onclick = function () { ouvrir(k); };
      ref.parentNode.insertBefore(b, ref.nextSibling); ref = b;
    });
    if (seul && cles.length === 1 && !box.dataset.auto) { box.dataset.auto = "1"; setTimeout(function () { ouvrir(seul); }, 250); }
  }
  var plan = false;
  try {
    new MutationObserver(function () { if (plan) return; plan = true; requestAnimationFrame(function () { plan = false; brancher(); }); })
      .observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
  charger().then(brancher);

  window.DiisooExams2 = { version: 5, ouvrir: ouvrir, registre: function () { return REG; } };
})();
