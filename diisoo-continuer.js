/* diisoo-continuer.js v1 : bouton « Continuer » sur l'accueil.
   Mémorise la dernière leçon ouverte (Anglais, Wolof ou Business) et la rouvre en un seul toucher. Rien n'est envoyé nulle part. */
(function () {
  "use strict";
  if (window.__diisooContinuer) return;
  window.__diisooContinuer = true;
  var CLE = "diisoo_dernier";
  function lire() { try { return JSON.parse(localStorage.getItem(CLE) || "null"); } catch (e) { return null; } }
  function ecrire(o) { try { localStorage.setItem(CLE, JSON.stringify(o)); } catch (e) {} }
  function $(id) { return document.getElementById(id); }
  function visible(id) { var e = $(id); return !!(e && !e.classList.contains("hidden") && e.offsetParent !== null); }

  function suivre() {
    try {
      if (visible("screen-general") && $("thbar-general") && typeof generalThemeId !== "undefined") {
        var th = GENERAL_THEMES.filter(function (t) { return t.id === generalThemeId; })[0];
        if (th) ecrire({ type: "anglais", cle: th.id, niv: th.niveau || 1, titre: th.title.replace(/^N\d\s*·\s*/, ""), ic: "📚" });
      } else if (visible("screen-wolof") && $("thbar-wolof") && typeof wolofCat !== "undefined") {
        var w = WOLOF_THEMES.filter(function (t) { return t.id === wolofCat; })[0];
        if (w) ecrire({ type: "wolof", cle: w.id, niv: 1, titre: w.title, ic: "🇸🇳" });
      } else if (visible("screen-business") && $("bizback-sec") && window.DiisooBiz) {
        var k = window.DiisooBiz.secteur && window.DiisooBiz.secteur(), n = window.DiisooBiz.niveau && window.DiisooBiz.niveau();
        if (k && BUSINESS_SECTORS[k]) ecrire({ type: "business", cle: k, niv: n || 1, titre: BUSINESS_SECTORS[k].titre, ic: "💼" });
      }
    } catch (e) {}
  }

  function poser() {
    try {
      var d = $("screen-dashboard"), g = $("dg-open"), ex = $("dcont");
      if (!d || d.classList.contains("hidden")) return;
      var s = lire();
      if (!s || !s.cle) { if (ex) ex.remove(); return; }
      var txt = s.titre + (s.type === "anglais" ? " · niveau " + s.niv : s.type === "business" ? " · niveau " + s.niv : "");
      if (ex) { if (ex.getAttribute("data-k") === s.type + s.cle + s.niv) return; ex.remove(); }
      var b = document.createElement("button");
      b.type = "button"; b.id = "dcont"; b.setAttribute("data-k", s.type + s.cle + s.niv);
      b.setAttribute("aria-label", "Continuer : " + txt);
      b.innerHTML = '<span class="dcont-p">▶</span><span class="dcont-t"><b>Continuer</b><small>' + s.ic + " " + txt.replace(/</g, "&lt;") + "</small></span>";
      b.onclick = function () {
        try { if (window.DiisooVoixGuide && window.DiisooVoixGuide.aller) window.DiisooVoixGuide.aller({ type: s.type, cle: s.cle, niv: s.niv }); } catch (e) {}
      };
      if (g && g.parentNode) g.parentNode.insertBefore(b, g.nextSibling); else d.insertBefore(b, d.children[1] || null);
    } catch (e) {}
  }

  var st = document.createElement("style");
  st.textContent =
    "#dcont{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:10px 14px;border-radius:16px;background:linear-gradient(135deg,#E1693F,#F3A94E);color:#1a1208;border:0;min-height:54px}" +
    "#dcont .dcont-p{flex:none;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;font-size:16px}" +
    "#dcont .dcont-t{min-width:0}#dcont b{display:block;font-size:15px;line-height:1.2}" +
    "#dcont small{display:block;font-size:12.5px;line-height:1.25;opacity:.9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    "#dcont:focus-visible{outline:3px solid #fff;outline-offset:2px}";
  document.head.appendChild(st);

  setInterval(suivre, 2000);
  setInterval(poser, 1000);
  setTimeout(poser, 600);
})();
