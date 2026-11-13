/* diisoo-aujourdhui.js v1 : accueil allege. Regroupe Revision + Question du jour + Quete en un seul bloc « Aujourd'hui »
   (les cartes d'origine restent dans la page, masquees, et gardent leur fonction) + raccourci « ABC-GLOBAL ». Desactivable : ?aujourdhui=0 */
(function () {
  "use strict";
  if (window.DiisooAujourdhui || /[?&]aujourdhui=0/.test(location.search)) return;
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function json(k, d) { try { var v = JSON.parse(lire(k) || "null"); return v == null ? d : v; } catch (e) { return d; } }
  function jour() { var x = new Date(); return x.getFullYear() + "-" + ("0" + (x.getMonth() + 1)).slice(-2) + "-" + ("0" + x.getDate()).slice(-2); }
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }

  var st = document.createElement("style");
  st.textContent =
    "#screen-dashboard #revision-card,#screen-dashboard #dqj,#screen-dashboard #dqq{display:none!important}" +
    "#screen-dashboard:not(.hidden)>div.space-y-3>#dii-auj{order:3}" +
    "#dii-auj{display:block;width:100%;border:1px solid #2A3454;background:#141A2B;border-radius:18px;padding:10px 10px 10px}" +
    "#dii-auj .h{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:800;color:#F6F1E7;margin:0 2px 8px}" +
    "#dii-auj .h small{font-size:11.5px;font-weight:700;color:#A69C86}" +
    "#dii-auj .r{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}" +
    "#dii-auj button{min-height:62px;border-radius:14px;border:1px solid #2A3454;background:#0F1424;color:#F6F1E7;padding:6px 4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;font-size:12px;font-weight:800;line-height:1.15;text-align:center}" +
    "#dii-auj button b{font-size:21px;font-weight:400}" +
    "#dii-auj button small{font-size:10.5px;font-weight:700;color:#A69C86}" +
    "#dii-auj button.ok{border-color:#25D366}#dii-auj button.ok small{color:#25D366}" +
    "#dii-auj button.pret{border-color:#FFAA3C;animation:diaup 1.6s infinite}@keyframes diaup{0%{box-shadow:0 0 0 0 rgba(255,170,60,.5)}100%{box-shadow:0 0 0 12px rgba(255,170,60,0)}}" +
    "#screen-dashboard #dg-open{min-height:44px!important;padding-top:4px!important;padding-bottom:4px!important}" +
    "#screen-dashboard #dg-open .dg-mic{width:32px!important;height:32px!important;font-size:18px!important}" +
    "#screen-dashboard button[onclick*=openPremium]{flex:none!important;height:auto!important;overflow:visible!important;min-height:36px!important;white-space:normal!important;line-height:1.2!important;padding:6px 12px!important;font-size:12.5px!important}" +
    "";
  document.head.appendChild(st);

  function nbRevision() { var c = document.getElementById("revision-card"); if (!c) return ""; var m = (c.innerText || "").match(/(\d+)/); return m ? m[1] : ""; }
  function maj() {
    var box = document.getElementById("dii-auj"); if (!box) return;
    var rev = document.getElementById("revision-card"), qj = document.getElementById("dqj"), qq = document.getElementById("dqq");
    var q = json("diisoo_qj", {}), fait = q.last === jour();
    var n = 0, coffre = json("diisoo_quete", {}); try { n = window.DiisooQuete ? DiisooQuete.faites() : 0; } catch (e) {}
    var ouvert = coffre.date === jour() && coffre.coffre, pret = n >= 3 && !ouvert;
    var nr = nbRevision();
    var b = box.querySelectorAll("button");
    b[0].className = ""; b[0].innerHTML = "<b>🔁</b>Révision<small>" + (nr ? nr + " à revoir" : "à faire") + "</small>";
    b[1].className = fait ? "ok" : ""; b[1].innerHTML = "<b>" + (fait ? "✅" : "🎯") + "</b>Question<small>" + (fait ? "faite" : "1 minute") + "</small>";
    b[2].className = ouvert ? "ok" : (pret ? "pret" : ""); b[2].innerHTML = "<b>" + (ouvert ? "✅" : "🎁") + "</b>Quête<small>" + (ouvert ? "coffre ouvert" : (pret ? "ouvre le coffre" : n + "/3")) + "</small>";
    b[0].hidden = !rev; b[1].hidden = !qj; b[2].hidden = !qq;
  }
  function monter() {
    var rev = document.getElementById("revision-card");
    if (!rev || !rev.parentNode || document.getElementById("dii-auj")) return;
    var box = document.createElement("div"); box.id = "dii-auj";
    box.innerHTML = '<div class="h"><span>Aujourd\'hui</span><small>3 petites tâches</small></div><div class="r"><button type="button"></button><button type="button"></button><button type="button"></button></div>';
    rev.parentNode.insertBefore(box, rev);
    var b = box.querySelectorAll("button");
    b[0].onclick = function () { noter("auj_revision"); var c = document.getElementById("revision-card"); if (c) c.click(); };
    b[1].onclick = function () { noter("auj_question"); var c = document.getElementById("dqj"); if (c) c.click(); };
    b[2].onclick = function () { noter("auj_quete"); var c = document.getElementById("dqq"); if (c) c.click(); };
    maj();
    // ligne « Un produit ABC-GLOBAL » touchable (WhatsApp)
    var ps = document.querySelectorAll("#screen-dashboard p");
    for (var k = 0; k < ps.length; k++) {
      if (/Un produit ABC-GLOBAL/i.test(ps[k].textContent || "") && !ps[k].getAttribute("data-abc")) {
        ps[k].setAttribute("data-abc", "1"); ps[k].style.cursor = "pointer"; ps[k].style.textDecoration = "underline";
        ps[k].onclick = function () {
          noter("abc_pied");
          window.open("https://wa.me/221772882109?text=" + encodeURIComponent("Bonjour ABC-GLOBAL, je viens de l'application Diisoo. Je voudrais des informations sur vos services."), "_blank");
        };
      }
    }
  }
  var essais = 0;
  (function boucle() { try { monter(); maj(); } catch (e) {} if (++essais < 40) setTimeout(boucle, 750); })();
  try { new MutationObserver(function () { if (!document.getElementById("dii-auj")) { try { monter(); } catch (e) {} } }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  setInterval(function () { try { maj(); } catch (e) {} }, 2500);
  window.DiisooAujourdhui = { maj: maj };
})();
