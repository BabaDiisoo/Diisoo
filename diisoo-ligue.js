/* diisoo-ligue.js v1 : Top 10 de la semaine (phase 1)
   - Carte « Ligue » sous le bloc Aujourd'hui, ouvre un classement public (prénoms seulement)
   - XP de la semaine = somme de diisoo_daily_xp depuis le lundi (UTC, comme le serveur)
   - Classement ouvert à 3 joueurs actifs minimum, sinon invitation à parrainer (pas de faux profils)
   - Option « Ne pas apparaître » (diisoo_ligue_off). Desactivable : ?ligue=0
   Serveur : tables/fonctions ligue_scores, ligue_maj, ligue_top (Supabase) */
(function () {
  "use strict";
  if (window.DiisooLigue || /[?&]ligue=0/.test(location.search)) return;
  var URL_SB = "https://jkwtyoefqvafnlqkhium.supabase.co/rest/v1/rpc/";
  var CLE = "sb_publishable__lzrlmMaJdFC_kav6DkfEA_UbH6DiTC";
  var MIN = 3;
  function lire(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function lundi() {
    var d = new Date(); d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    var j = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - j);
    return d.toISOString().slice(0, 10);
  }
  function xpSemaine() {
    var log = lire("diisoo_daily_xp", {}), l = lundi(), t = 0;
    Object.keys(log).forEach(function (k) { if (k >= l) t += Number(log[k]) || 0; });
    return t | 0;
  }
  function uid() { try { return monCodeRef(); } catch (e) { return lire("diisoo_ref_code", ""); } }
  function prenom() { var p = lire("diisoo_profile", null); return (p && (p.first_name || p.prenom)) || "Joueur"; }
  function visible() { return !lire("diisoo_ligue_off", false); }

  function rpc(nom, corps) {
    return fetch(URL_SB + nom, {
      method: "POST",
      headers: { "apikey": CLE, "Content-Type": "application/json" },
      body: JSON.stringify(corps)
    }).then(function (r) { if (!r.ok) throw new Error("ligue " + r.status); return r.text(); })
      .then(function (t) { return t ? JSON.parse(t) : null; });
  }
  var derniereMaj = 0;
  function envoyer(force) {
    var u = uid(); if (!u || u.length < 8) return Promise.resolve();
    var xp = xpSemaine();
    if (!force && Date.now() - derniereMaj < 3e5) return Promise.resolve();
    if (!xp && !force) return Promise.resolve();
    derniereMaj = Date.now();
    return rpc("ligue_maj", { p_uid: u, p_prenom: prenom(), p_xp: xp, p_visible: visible() }).catch(function () {});
  }
  function classement() { return rpc("ligue_top", { p_uid: uid() }); }

  var st = document.createElement("style");
  st.textContent =
    "#dii-ligue-c{flex:none;border:1px solid rgba(243,169,78,.35);background:rgba(243,169,78,.08);color:#F3A94E;border-radius:999px;padding:6px 10px!important;min-height:0!important;min-width:0!important;font-size:12px;font-weight:700;line-height:1.2;white-space:nowrap}" +
    "#dii-ligue{position:fixed;inset:0;z-index:10050;background:rgba(7,10,20,.94);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-ligue .bx{width:100%;max-width:480px;max-height:92vh;overflow:auto;background:#0F1424;border:1px solid #2A3454;border-radius:20px 20px 0 0;padding:16px 14px 20px;color:#F6F1E7}" +
    "#dii-ligue h2{font-size:17px;font-weight:800;margin:0 0 2px}#dii-ligue p{font-size:12.5px;color:#A69C86;margin:0 0 10px}" +
    "#dii-ligue .ln{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:12px;background:#141A2B;margin-bottom:6px;font-size:14px;font-weight:700}" +
    "#dii-ligue .ln.moi{background:#12351F;border:1px solid #3FAE74}#dii-ligue .ln i{font-style:normal;width:26px;text-align:center}" +
    "#dii-ligue .ln span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#dii-ligue .ln em{font-style:normal;color:#F3A94E;font-size:13px}" +
    "#dii-ligue button{display:block;width:100%;min-height:46px;border:0;border-radius:12px;font-weight:800;font-size:14px;margin-top:8px}" +
    "#dii-ligue .v{background:#25D366;color:#fff}#dii-ligue .g{background:#1B2238;color:#F6F1E7}" +
    "#dii-ligue label{display:flex;gap:8px;align-items:center;font-size:12.5px;color:#A69C86;margin-top:12px}";
  document.head.appendChild(st);

  var etat = null;
  function majCarte() {
    var c = $("dii-ligue-c"); if (!c) return;
    var t = "";
    if (etat && (etat.actifs | 0) >= MIN && etat.mon_rang) t = " " + etat.mon_rang + (etat.mon_rang === 1 ? "er" : "e");
    c.textContent = "🏆" + t; c.setAttribute("aria-label", "Ligue de la semaine");
  }
  function monterCarte() {
    if ($("dii-ligue-c")) return;
    var ref = $("xp-label"); if (!ref || !ref.parentNode) return;
    var c = document.createElement("button"); c.type = "button"; c.id = "dii-ligue-c";
    c.onclick = ouvrir; ref.parentNode.insertBefore(c, ref);
    majCarte();
    envoyer(false).then(classement).then(function (r) { etat = r; majCarte(); }).catch(function () {});
  }

  function fermer() { var o = $("dii-ligue"); if (o) o.remove(); }
  function dessiner(bx, r) {
    var h = "<h2>🏆 Top 10 de la semaine</h2><p>Remise à zéro chaque lundi. Seuls les prénoms sont visibles.</p>";
    if (!r) { h += "<p>Connexion impossible. Réessaie avec internet.</p>"; }
    else if ((r.actifs | 0) < MIN) {
      h += '<div class="ln"><i>👥</i><span>' + (r.actifs | 0) + " / " + MIN + " joueurs actifs</span></div>" +
        "<p>La ligue s'ouvre à " + MIN + " joueurs. Invite " + (MIN - (r.actifs | 0)) + " ami(s) : ils comptent dès leur premier exercice.</p>" +
        '<button class="v" id="lg-inv">Inviter un ami</button>';
    } else {
      var medal = ["🥇", "🥈", "🥉"];
      (r.top || []).forEach(function (l) {
        h += '<div class="ln' + (l.moi ? " moi" : "") + '"><i>' + (medal[l.rang - 1] || (Number(l.rang) || 0)) + "</i><span>" + esc(l.prenom) + (l.moi ? " (toi)" : "") + "</span><em>" + (Number(l.xp) || 0) + " XP</em></div>";
      });
      if (r.mon_rang && r.mon_rang > 10) h += '<div class="ln moi"><i>' + r.mon_rang + "</i><span>Toi</span><em>" + r.mon_xp + " XP</em></div>";
      if (r.mon_rang && r.mon_rang > 1 && r.xp_suivant != null) h += "<p>Encore " + Math.max(1, r.xp_suivant - r.mon_xp + 1) + " XP pour passer " + (r.mon_rang - 1) + (r.mon_rang === 2 ? "er" : "e") + ".</p>";
      if (!r.mon_rang) h += "<p>Fais un exercice pour entrer au classement.</p>";
    }
    h += '<label><input type="checkbox" id="lg-off"' + (visible() ? "" : " checked") + "> Ne pas apparaître dans le classement</label>" +
      '<button class="g" id="lg-x">Fermer</button>';
    bx.innerHTML = h;
    $("lg-x").onclick = fermer;
    var inv = $("lg-inv"); if (inv) inv.onclick = function () { try { partagerDiisoo(); } catch (e) {} };
    $("lg-off").onchange = function () {
      ecrire("diisoo_ligue_off", !!this.checked);
      envoyer(true).then(classement).then(function (x) { etat = x; majCarte(); dessiner(bx, x); }).catch(function () {});
    };
  }
  function ouvrir() {
    fermer();
    var o = document.createElement("div"); o.id = "dii-ligue";
    o.innerHTML = '<div class="bx"><p>Chargement...</p></div>';
    o.addEventListener("click", function (e) { if (e.target === o) fermer(); });
    document.body.appendChild(o);
    var bx = o.firstChild;
    envoyer(true).then(classement).then(function (r) { etat = r; majCarte(); dessiner(bx, r); }).catch(function () { dessiner(bx, null); });
  }

  window.DiisooLigue = { ouvrir: ouvrir, xpSemaine: xpSemaine, etat: function () { return etat; } };
  try { new MutationObserver(function () { if (!$("dii-ligue-c")) monterCarte(); }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  setTimeout(monterCarte, 800);
})();
