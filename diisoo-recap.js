/* diisoo-recap.js v1 : « Ta semaine », un bilan une fois par semaine
   - Lit le journal d'XP existant (diisoo_daily_xp) : jours actifs sur 7, XP gagne, comparaison avec la semaine d'avant, serie, niveau
   - S'affiche a la premiere ouverture de chaque nouvelle semaine, seulement si la personne a pratique ; jamais pendant un exercice
   - Bouton « Partager » : message WhatsApp avec le lien diisoo.sn (chaque bilan peut ramener un ami)
   - Essai : https://diisoo.sn/?recap=1 */
(function () {
  "use strict";
  if (window.DiisooRecap) return;
  var CLE = "diisoo_recap_semaine";
  function $(id) { return document.getElementById(id); }
  function jour(d) { return d.toISOString().slice(0, 10); }
  function lire(k, v) { try { return JSON.parse(localStorage.getItem(k) || "null") || v; } catch (e) { return v; } }
  function semaine(d) { // cle = lundi de la semaine
    var x = new Date(d); x.setUTCHours(0, 0, 0, 0);
    x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
    return jour(x);
  }
  function bilan() {
    var log = lire("diisoo_daily_xp", {}), n = Date.now(), cur = { j: 0, xp: 0 }, avant = { j: 0, xp: 0 };
    for (var i = 0; i < 14; i++) {
      var v = log[jour(new Date(n - i * 86400000))] || 0, t = i < 7 ? cur : avant;
      if (v > 0) { t.j++; t.xp += v; }
    }
    var xp = lire("diisoo_xp", { total: 0 }).total || 0;
    return { cur: cur, avant: avant, serie: (lire("diisoo_streak", {}).count) || 0, niveau: Math.floor(xp / 50) + 1 };
  }
  function phrase(b) {
    if (b.cur.j >= 6) return "Semaine exceptionnelle. Tu es régulier, c'est ça qui fait progresser.";
    if (b.cur.j >= 4) return "Très belle semaine. Encore un jour de plus et tu fais encore mieux.";
    if (b.cur.xp > b.avant.xp && b.avant.xp > 0) return "Tu progresses par rapport à la semaine dernière. Continue comme ça.";
    return "Un bon début. Quelques minutes par jour valent mieux qu'une longue séance.";
  }

  var st = document.createElement("style");
  st.textContent =
    "#dii-recap{position:fixed;inset:0;z-index:9991;background:rgba(5,8,16,.88);display:flex;align-items:center;justify-content:center;padding:16px}" +
    "#dii-recap .rc{width:100%;max-width:380px;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px;padding:20px 16px;color:#F6F1E7;text-align:center}" +
    "#dii-recap h3{font-size:20px;font-weight:800;margin:0 0 2px}" +
    "#dii-recap .rc-s{font-size:12px;color:#A69C86;margin:0 0 14px}" +
    "#dii-recap .rc-g{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
    "#dii-recap .rc-c{background:#141A2B;border:1px solid #1E2740;border-radius:14px;padding:12px 6px}" +
    "#dii-recap .rc-c b{display:block;font-size:24px;font-weight:900}" +
    "#dii-recap .rc-c span{font-size:11px;color:#A69C86}" +
    "#dii-recap .rc-p{font-size:13px;color:#C9BFA8;margin:14px 4px 0}" +
    "#dii-recap button{width:100%;min-height:52px;margin-top:10px;border-radius:999px;border:0;font-size:15px;font-weight:800}" +
    "#dii-recap .rc-w{background:#25D366;color:#fff}#dii-recap .rc-f{background:none;color:#A69C86;font-size:13px;min-height:44px;font-weight:600}";
  document.head.appendChild(st);

  function afficher() {
    if ($("dii-recap")) return;
    var b = bilan(), diff = b.cur.xp - b.avant.xp;
    var ov = document.createElement("div"); ov.id = "dii-recap";
    ov.innerHTML = '<div class="rc"><h3>📊 Ta semaine</h3><p class="rc-s">Les 7 derniers jours</p><div class="rc-g">' +
      '<div class="rc-c"><b>' + b.cur.j + '/7</b><span>jours actifs</span></div>' +
      '<div class="rc-c"><b>+' + b.cur.xp + '</b><span>XP gagnés' + (b.avant.xp ? " (" + (diff >= 0 ? "+" : "") + diff + " vs sem. dernière)" : "") + '</span></div>' +
      '<div class="rc-c"><b>🔥 ' + b.serie + '</b><span>jours de série</span></div>' +
      '<div class="rc-c"><b>⭐ ' + b.niveau + '</b><span>niveau</span></div></div>' +
      '<p class="rc-p">' + phrase(b) + '</p>' +
      '<button type="button" class="rc-w" id="rc-share">Partager mon bilan</button>' +
      '<button type="button" class="rc-f" id="rc-close">Continuer</button></div>';
    document.body.appendChild(ov);
    $("rc-close").onclick = function () { ov.remove(); };
    $("rc-share").onclick = function () {
      var t = "Ma semaine sur Diisoo : " + b.cur.j + "/7 jours, +" + b.cur.xp + " XP, série de " + b.serie + " jours 🔥\nApprends l'anglais et le wolof gratuitement : https://diisoo.sn/?source=recap";
      try { window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank"); } catch (e) {}
    };
    try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", "recap_semaine", ""); } catch (e) {}
  }

  function peutAfficher() {
    var d = $("screen-dashboard");
    if (!d || d.classList.contains("hidden")) return false;
    return !document.querySelector("#dii-obj,#dii-arrivee,#dii-retour,[id^=screen-].fixed:not(.hidden)");
  }
  function verifier(force) {
    var cle = semaine(new Date());
    if (!force) {
      if (lire(CLE, "") === cle) return;
      var b = bilan();
      if (b.cur.j < 1) return;
      if (!peutAfficher()) return;
    }
    try { localStorage.setItem(CLE, JSON.stringify(cle)); } catch (e) {}
    afficher();
  }
  window.DiisooRecap = { afficher: afficher, verifier: verifier };
  var force = /[?&]recap=1/.test(location.search);
  setTimeout(function () { verifier(force); }, 4500);
})();
