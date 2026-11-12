/* diisoo-defi.js v1 : « Défie un ami »
   - Quand l'objectif du jour est atteint, une fenetre propose de defier un ami sur WhatsApp : « je suis a N jours de serie, tu peux me battre ? »
   - Le lien partage contient ?source=defi&serie=N. L'ami qui arrive voit un bandeau (une fois) et le defi est memorise
   - Quand l'ami depasse la serie de celui qui l'a defie, il recoit un message de victoire
   - Essai : https://diisoo.sn/?defi=1 (ouvre la fenetre de defi) */
(function () {
  "use strict";
  if (window.DiisooDefi) return;
  function $(id) { return document.getElementById(id); }
  function lire(k, v) { try { return JSON.parse(localStorage.getItem(k) || "null") || v; } catch (e) { return v; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function aujourd() { return new Date().toISOString().slice(0, 10); }
  function serie() { return (lire("diisoo_streak", {}).count) || 0; }
  function suivi(a) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", a, ""); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#dii-defi{position:fixed;inset:0;z-index:9991;background:rgba(5,8,16,.86);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-defi .df{width:100%;max-width:480px;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px 22px 0 0;padding:20px 16px 24px;color:#F6F1E7;text-align:center}" +
    "#dii-defi h3{font-size:19px;font-weight:800;margin:0 0 6px}" +
    "#dii-defi p{font-size:13px;color:#C9BFA8;margin:0 0 4px}" +
    "#dii-defi button{width:100%;min-height:52px;margin-top:10px;border-radius:999px;border:0;font-size:15px;font-weight:800}" +
    "#dii-defi .d-w{background:#25D366;color:#fff}#dii-defi .d-f{background:none;color:#A69C86;font-size:13px;min-height:44px;font-weight:600}" +
    "#dii-defi-ban{position:fixed;left:12px;right:12px;bottom:12px;z-index:9991;max-width:456px;margin:0 auto;background:#12351F;border:1px solid #25D366;border-radius:16px;padding:12px 14px;color:#F6F1E7;font-size:13px}" +
    "#dii-defi-ban button{margin-top:8px;min-height:44px;padding:0 16px;border-radius:999px;border:0;background:#25D366;color:#fff;font-weight:800;font-size:14px}";
  document.head.appendChild(st);

  function proposer() {
    if ($("dii-defi")) return;
    var n = Math.max(1, serie());
    var ov = document.createElement("div"); ov.id = "dii-defi";
    ov.innerHTML = '<div class="df"><h3>🎯 Objectif atteint !</h3><p>Tu es à <b>' + n + (n > 1 ? " jours" : " jour") + '</b> de série.</p><p>Défie un ami de te battre.</p>' +
      '<button type="button" class="d-w" id="df-go">Défier un ami sur WhatsApp</button>' +
      '<button type="button" class="d-f" id="df-no">Plus tard</button></div>';
    document.body.appendChild(ov);
    $("df-no").onclick = function () { ov.remove(); };
    $("df-go").onclick = function () {
      var t = "Je suis à " + n + (n > 1 ? " jours" : " jour") + " de série sur Diisoo 🔥 Tu peux me battre ?\nApprends l'anglais et le wolof gratuitement : https://diisoo.sn/?source=defi&serie=" + n;
      try { window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank"); } catch (e) {}
      suivi("defi_envoye");
      ov.remove();
    };
  }

  function bandeau(n) {
    if ($("dii-defi-ban") || $("dar") || $("dsr")) return;
    var b = document.createElement("div"); b.id = "dii-defi-ban";
    b.innerHTML = "🔥 Un ami t'a défié : il est à <b>" + n + (n > 1 ? " jours" : " jour") + "</b> de série. Pratique chaque jour pour le battre !<br><button type=\"button\">Relever le défi</button>";
    document.body.appendChild(b);
    b.querySelector("button").onclick = function () { b.remove(); };
    setTimeout(function () { if (b.parentNode) b.remove(); }, 12000);
    suivi("defi_recu");
  }

  function victoire() {
    var d = lire("diisoo_defi", null);
    if (!d || d.gagne || serie() <= d.serie) return;
    d.gagne = true; ecrire("diisoo_defi", d);
    try { toast("🏆 Tu as battu ton ami : " + serie() + " jours contre " + d.serie + " !"); } catch (e) {}
    suivi("defi_gagne");
  }

  var q = location.search, m = q.match(/[?&]serie=(\d{1,4})/);
  if (/[?&]source=defi/.test(q) && m && !lire("diisoo_defi", null)) {
    var n = Math.min(999, +m[1]);
    ecrire("diisoo_defi", { serie: n, date: aujourd(), gagne: false });
    setTimeout(function () { bandeau(n); }, 3500);
  }
  setTimeout(victoire, 5000);
  if (/[?&]defi=1/.test(q)) setTimeout(proposer, 3500);

  var essais = 0, t = setInterval(function () {
    essais++;
    if (typeof window.bumpDailyGoal === "function" && !window.bumpDailyGoal.__d) {
      var f = window.bumpDailyGoal;
      window.bumpDailyGoal = function () {
        var avant = 0; try { avant = getDailyGoal().done; } catch (e) {}
        var cible = 5; try { cible = (lire("diisoo_obj", null) || {}).rythme || DAILY_TARGET; } catch (e) {}
        var r = f.apply(this, arguments);
        var apres = 0; try { apres = getDailyGoal().done; } catch (e) {}
        if (avant < cible && apres >= cible) {
          setTimeout(function () { victoire(); if (!$("dii-obj") && !$("dar")) proposer(); }, 2200);
        }
        return r;
      };
      window.bumpDailyGoal.__d = 1; clearInterval(t);
    } else if (essais > 30) clearInterval(t);
  }, 500);
  window.DiisooDefi = { proposer: proposer };
})();
