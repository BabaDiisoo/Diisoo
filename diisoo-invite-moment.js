/* diisoo-invite-moment.js v1 : invitation au bon moment
   Une petite fenêtre « Invite un ami » apparait UNE fois par déclencheur, sur l'accueil seulement :
   badge gagné, série de 3 puis 7 jours, entrée au Top 10 de la ligue. Maximum 1 fenêtre par 24 h.
   Utilise le partage existant (partagerDiisoo). Desactivable : ?invite=0 */
(function () {
  "use strict";
  if (window.DiisooInvite || /[?&]invite=0/.test(location.search)) return;
  function lire(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function $(id) { return document.getElementById(id); }
  var TXT = {
    badge: ["🏅 Badge gagné !", "Invite un ami : vous apprenez ensemble et vous grimpez dans la ligue."],
    serie3: ["🔥 3 jours d'affilée !", "Invite un ami pour tenir la série à deux."],
    serie7: ["🔥 7 jours d'affilée !", "Bravo. Invite un ami, 3 amis actifs = 1 mois Premium."],
    top10: ["🏆 Tu es dans le Top 10 !", "Invite un ami pour le battre, la ligue est plus drôle à plusieurs."]
  };
  var st = document.createElement("style");
  st.textContent =
    "#dii-inv{position:fixed;left:12px;right:12px;bottom:12px;z-index:9984;background:#12351F;border:1px solid #3FAE74;border-radius:16px;padding:12px 14px;color:#F6F1E7;font-size:13px;line-height:1.4;box-shadow:0 8px 24px rgba(0,0,0,.5)}" +
    "#dii-inv b{display:block;font-size:14px}#dii-inv .r{display:flex;gap:8px;margin-top:8px}" +
    "#dii-inv button{min-height:44px;border:0;border-radius:12px;font-weight:800;font-size:14px}" +
    "#dii-inv .o{flex:1;background:#25D366;color:#fff}#dii-inv .n{background:#1B2238;color:#F6F1E7;padding:0 14px}";
  document.head.appendChild(st);

  function nbAmis() { return lire("diisoo_ref_nb", 0) | 0; }
  function serie() { var s = lire("diisoo_streak", null); return s && typeof s === "object" ? (s.count || s.n || 0) : (+s || 0); }
  function vus() { return lire("diisoo_inv_vus", {}); }
  function marquer(k) { var v = vus(); v[k] = Date.now(); ecrire("diisoo_inv_vus", v); ecrire("diisoo_inv_dernier", Date.now()); }
  function accueilVisible() { var e = $("screen-dashboard"); return !!(e && e.offsetParent !== null); }

  function declencheur() {
    var v = vus();
    if (lire("diisoo_inv_pending", "") && !v[lire("diisoo_inv_pending", "")]) return "badge";
    var s = serie();
    if (s >= 7 && !v.serie7) return "serie7";
    if (s >= 3 && !v.serie3) return "serie3";
    try {
      var e = window.DiisooLigue && DiisooLigue.etat && DiisooLigue.etat();
      if (e && (e.actifs | 0) >= 3 && e.mon_rang && e.mon_rang <= 10 && !v.top10) return "top10";
    } catch (x) {}
    return "";
  }
  function afficher(k) {
    if ($("dii-inv")) return;
    var t = TXT[k];
    var d = document.createElement("div"); d.id = "dii-inv";
    d.innerHTML = "<b>" + t[0] + "</b>" + t[1] + '<div class="r"><button class="o" type="button">Inviter sur WhatsApp</button><button class="n" type="button">Plus tard</button></div>';
    d.querySelector(".o").onclick = function () { try { partagerDiisoo(); } catch (e) {} d.remove(); };
    d.querySelector(".n").onclick = function () { d.remove(); };
    document.body.appendChild(d);
    marquer(k === "badge" ? lire("diisoo_inv_pending", "badge") : k);
    if (k === "badge") ecrire("diisoo_inv_pending", "");
    setTimeout(function () { if (d.parentNode) d.remove(); }, 14000);
  }
  function verifier() {
    try {
      if (!accueilVisible() || $("dii-inv") || $("dii-ligue")) return;
      if (Date.now() - (lire("diisoo_inv_dernier", 0) | 0) < 864e5) return;
      if (!lire("diisoo_profile", null)) return;
      var k = declencheur(); if (k) afficher(k);
    } catch (e) {}
  }
  /* un badge gagné (hors « premier pas ») arme le déclencheur */
  function brancher() {
    if (typeof window.awardBadge !== "function" || window.awardBadge.__inv) return;
    var o = window.awardBadge;
    window.awardBadge = function (id) {
      var avant = []; try { avant = JSON.parse(localStorage.getItem("diisoo_badges") || "[]"); } catch (e) {}
      var r = o.apply(this, arguments);
      try {
        if (id && id !== "premier-pas" && avant.indexOf(id) < 0 && !vus()["b:" + id]) { ecrire("diisoo_inv_pending", "b:" + id); }
      } catch (e) {}
      return r;
    };
    window.awardBadge.__inv = 1;
  }
  brancher(); setTimeout(brancher, 3000);
  setInterval(verifier, 5000);
  window.DiisooInvite = { verifier: verifier };
})();
