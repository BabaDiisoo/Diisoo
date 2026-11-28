/* diisoo-examen-accueil.js v1 : un seul écran d'accueil pour TOUS les examens (IELTS, TOEFL, TOEIC, Cambridge, Duolingo, PTE).
 * Les écrans « ton parcours » (longue liste à faire défiler, titres d'étapes, textes d'introduction) deviennent une grille de grosses tuiles :
 * un bouton principal en haut, puis des tuiles avec icône, titre court, une ligne d'explication, et un numéro de couleur pour l'étape (1 commencer, 2 s'entraîner, 3 se tester).
 * Les boutons sont les mêmes qu'avant (mêmes actions), seul l'affichage change. Interrupteur : ?examen2=0. Fichier autonome. */
(function () {
  "use strict";
  if (window.__diisooExamAccueil) return; window.__diisooExamAccueil = true;
  try { if (new URLSearchParams(location.search).get("examen2") === "0") return; } catch (e) {}

  var CSS =
    "#ie-ov .ie-w.xo{gap:8px}" +
    "#ie-ov .ie-w.xo .ie-top h2{font-size:20px}" +
    "#ie-ov .xo-chip{align-self:flex-start;font-size:12px;font-weight:800;padding:3px 10px;border-radius:99px;background:rgba(63,174,116,.16);color:#7BD9A2;border:1px solid #3FAE74}" +
    "#ie-ov .xo-leg{display:flex;gap:12px;flex-wrap:wrap;font-size:11.5px;color:#A69C86;align-items:center}" +
    "#ie-ov .xo-leg span{display:inline-flex;align-items:center;gap:5px}" +
    "#ie-ov .xo-leg b{width:16px;height:16px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10px;color:#0B0F1C;font-weight:800}" +
    "#ie-ov .xo-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
    "#ie-ov .xo-grid>button{position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;gap:3px;min-height:78px;padding:10px 10px 10px 12px;border-left:4px solid var(--xc,#2A3454)}" +
    "#ie-ov .xo-grid>button.ie-p{border:0;border-left:0}" +
    "#ie-ov .xo-grid.xo-dense{grid-template-columns:1fr 1fr 1fr;gap:6px}" +
    "#ie-ov .xo-dense>button{min-height:62px;padding:8px 6px 8px 8px}" +
    "#ie-ov .xo-dense>button.xo-hero{min-height:60px;padding:8px 12px}" +
    "#ie-ov .xo-dense .xo-i{font-size:18px}" +
    "#ie-ov .xo-dense .xo-t{font-size:11.5px}" +
    "#ie-ov .xo-dense .xo-s{display:none}" +
    "#ie-ov .xo-dense>button.xo-hero .xo-s{display:block}" +
    "#ie-ov .xo-i{font-size:22px;line-height:1}" +
    "#ie-ov .xo-t{font-size:14px;font-weight:800;line-height:1.15;color:#F6F1E7}" +
    "#ie-ov .xo-s{font-size:11.5px;color:#A69C86;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}" +
    "#ie-ov .xo-grid>button.xo-hero{grid-column:1/-1;flex-direction:row;align-items:center;gap:12px;min-height:72px}" +
    "#ie-ov .xo-grid>button.xo-hero .xo-t{font-size:16px;color:#fff}" +
    "#ie-ov .xo-grid>button.xo-hero .xo-s{color:#FFE7DA}" +
    "#ie-ov .xo-grid>button.xo-hero .xo-tx{display:flex;flex-direction:column;gap:2px;flex:1}" +
    "#ie-ov .xo-grid>button.xo-hero .xo-go{font-size:20px;font-weight:800}" +
    "#ie-ov .ie-w.xo .ie-note{font-size:11px;line-height:1.3}" +
    "#ie-ov .ie-w.xo>button.ie-x{min-height:38px;padding:6px 12px}";

  var COUL = { 1: "#6FB4F0", 2: "#F0A24B", 3: "#5FC98F", 4: "#C79BF0" };
  var ICONES = [
    [/positionnement|niveau/i, "📍"], [/objectif/i, "🎯"], [/7 examens|tous les examens|catalogue/i, "📚"],
    [/format|comprendre/i, "ℹ️"], [/écoute et lecture/i, "🎧"], [/listening|écoute/i, "🎧"], [/reading|lecture/i, "📖"],
    [/writing|écriture|écrit/i, "✍️"], [/speaking|oral|parle|speak/i, "🎤"], [/blanc|mock|simulation/i, "⏱️"],
    [/essay|summarize written|write|email/i, "✍️"], [/re-?order/i, "🔀"], [/highlight/i, "🖍️"], [/select|choose|multiple/i, "☑️"], [/fill|blanks|texte à trous/i, "🔤"], [/summarize spoken|repeat|retell|describe|respond/i, "🎤"],
    [/life skills/i, "👪"], [/vocabulaire|vocabulary/i, "🔤"], [/grammaire|grammar/i, "🧩"]
  ];
  var EMOJI_DEBUT = /^[←-⯿️\u{1F000}-\u{1FAFF}]/u;

  function icone(titre) { for (var i = 0; i < ICONES.length; i++) if (ICONES[i][0].test(titre)) return ICONES[i][1]; return "▶️"; }
  function texte(n) { return (n && n.textContent || "").replace(/\s+/g, " ").trim(); }

  function transformer(w) {
    var top = w.querySelector(".ie-top"), h2 = top && top.querySelector("h2");
    if (!h2 || !/parcours/i.test(h2.textContent)) return;
    var enfants = Array.prototype.slice.call(w.children);
    var tuiles = [], pied = [], notes = [], niveau = "", etape = 1, vu = {};
    enfants.forEach(function (c) {
      if (c === top) return;
      var t = texte(c), m;
      if (c.tagName === "BUTTON" && c.classList.contains("ie-x")) { pied.push(c); return; }
      if (c.tagName === "BUTTON") { tuiles.push({ b: c, etape: etape }); return; }
      if ((m = /^Étape\s*(\d)/i.exec(t)) && c.tagName !== "BUTTON") { etape = +m[1]; vu[etape] = 1; c.style.display = "none"; return; }
      if (/visa familial|life skills/i.test(t) && (c.tagName === "H2" || c.classList.contains("ie-n"))) { etape = 4; vu[4] = 1; c.style.display = "none"; return; }
      if (c.classList.contains("ie-note") || c.classList.contains("ie-warn")) { if (t.length < 25) c.style.display = "none"; else notes.push(c); return; }
      if (c.tagName === "P" || c.tagName === "H2") {
        var mn = /niveau estim[ée]\s*:?\s*([A-Za-z0-9+ ]{1,12})/i.exec(t); if (mn) niveau = mn[1].replace(/[.\s]+$/, "");
        c.style.display = "none";
      }
    });
    if (tuiles.length < 2) return;

    h2.textContent = h2.textContent.replace(/\s*:\s*ton parcours/i, "");
    w.classList.add("xo");
    var marq = document.createElement("i"); marq.className = "xo-done"; marq.style.display = "none"; w.appendChild(marq);

    if (niveau) { var chip = document.createElement("div"); chip.className = "xo-chip"; chip.textContent = "Niveau estimé : " + niveau; w.appendChild(chip); }

    var leg = document.createElement("div"); leg.className = "xo-leg";
    [[1, "Commencer"], [2, "S'entraîner"], [3, "Te tester"]].forEach(function (e) {
      if (!vu[e[0]] && e[0] !== 2) return;
      var s = document.createElement("span"); s.innerHTML = '<b style="background:' + COUL[e[0]] + '">' + e[0] + "</b>" + e[1]; leg.appendChild(s);
    });
    if (leg.children.length) w.appendChild(leg);

    var grille = document.createElement("div"); grille.className = "xo-grid" + (tuiles.length > 8 ? " xo-dense" : "");
    var hero = tuiles.filter(function (x) { return x.b.classList.contains("ie-p"); })[0];
    var ordre = hero ? [hero].concat(tuiles.filter(function (x) { return x !== hero; })) : tuiles;
    ordre.forEach(function (x) {
      var b = x.b, nEl = b.querySelector(".ie-n"), sEl = b.querySelector(".ie-s");
      var titre = texte(nEl) || texte(b), sous = texte(sEl);
      var ic = EMOJI_DEBUT.test(titre) ? "" : icone(titre);
      if (!ic) { var mm = /^(\S+)\s+(.*)$/u.exec(titre); if (mm) { ic = mm[1]; titre = mm[2]; } }
      var est = x === hero;
      b.innerHTML = "";
      var i = document.createElement("span"); i.className = "xo-i"; i.textContent = ic; b.appendChild(i);
      var tx = document.createElement("span"); tx.className = "xo-tx";
      var t = document.createElement("span"); t.className = "xo-t"; t.textContent = titre; tx.appendChild(t);
      if (sous) { var s = document.createElement("span"); s.className = "xo-s"; s.textContent = sous; tx.appendChild(s); }
      if (est) { b.classList.add("xo-hero"); b.appendChild(tx); var g = document.createElement("span"); g.className = "xo-go"; g.textContent = "›"; b.appendChild(g); }
      else { b.appendChild(tx); tx.style.display = "contents"; b.style.setProperty("--xc", COUL[x.etape] || "#2A3454"); }
      grille.appendChild(b);
    });
    w.insertBefore(grille, w.querySelector(".xo-leg") ? w.querySelector(".xo-leg").nextSibling : marq.nextSibling);
    notes.forEach(function (n) { w.appendChild(n); });
    pied.forEach(function (p) { w.appendChild(p); });
  }

  function passe() {
    var ov = document.getElementById("ie-ov"); if (!ov) return;
    var w = ov.querySelector(".ie-w"); if (!w || w.querySelector(".xo-done")) return;
    try { transformer(w); } catch (e) { console.warn("[diisoo] examen-accueil", e); }
  }

  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
  var obs = null, essais = 0;
  var t = setInterval(function () {
    var ov = document.getElementById("ie-ov"); essais++;
    if (ov && !obs) {
      obs = new MutationObserver(passe); obs.observe(ov, { childList: true, subtree: true });
      passe(); clearInterval(t);
    } else if (essais > 600) clearInterval(t);
  }, 500);
  window.DiisooExamAccueil = { version: 1 };
})();
