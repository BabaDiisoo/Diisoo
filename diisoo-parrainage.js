/* diisoo-parrainage.js v1 : parrainage plus parlant
   - Carte d'accueil : barre de progression vers 3 amis (1 mois Premium) puis 10 amis (Pack Commerçants)
   - Partage en un geste (menu de partage du téléphone, sinon WhatsApp), message adapté à l'objectif et à la série
   - Ami invité : message d'accueil « un ami t'invite », qui explique que son premier exercice récompense son parrain
   - Palier atteint : bouton « Réclamer ma récompense » qui ouvre WhatsApp avec un message prêt (code + numéro)
   S'appuie sur le système existant (monCodeRef, compter_parrainages, valider au premier exercice). Aucune table en plus. */
(function () {
  "use strict";

  var WA = "221772882109";
  function $(id) { return document.getElementById(id); }
  function lire(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function code() { try { return monCodeRef(); } catch (e) { return lire("diisoo_ref_code", ""); } }
  function nb() { return lire("diisoo_ref_nb", 0) | 0; }

  /* ---------- partage en un geste ---------- */
  var PHRASE = {
    visa: "pour préparer son visa et son examen d'anglais",
    business: "pour l'anglais du commerce et des affaires",
    tourisme: "pour parler anglais avec les touristes",
    wolof: "pour apprendre le wolof et l'anglais"
  };
  function message() {
    var o = lire("diisoo_obj", null), s = lire("diisoo_streak", null);
    var jours = s && typeof s === "object" ? (s.count || s.n || 0) : (+s || 0);
    var but = o && PHRASE[o.but] ? PHRASE[o.but] : "pour apprendre l'anglais et le wolof avec la voix";
    var deb = jours > 1 ? "🔥 " + jours + " jours d'affilée sur Diisoo, l'application " + but + ". " : "Je te recommande Diisoo, l'application " + but + ". ";
    return deb + "C'est gratuit, ça marche sur téléphone : https://diisoo.sn/?ref=" + code();
  }
  window.partagerDiisoo = function () {
    var m = message();
    if (navigator.share) {
      navigator.share({ title: "Diisoo", text: m }).catch(function () {});
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(m), "_blank", "noopener");
    }
    setTimeout(function () { try { majCompteurParrainage(); } catch (e) {} }, 2000);
  };

  /* ---------- carte avec progression ---------- */
  var st = document.createElement("style");
  st.textContent =
    ".pr-b{height:8px;border-radius:99px;background:#0B0F1C;overflow:hidden;margin:6px 0 4px;position:relative}" +
    ".pr-b i{display:block;height:100%;background:linear-gradient(90deg,#3FAE74,#F3A94E);border-radius:99px;transition:width .4s}" +
    ".pr-r{display:block;width:100%;min-height:44px;margin-top:6px;border:0;border-radius:12px;background:#25D366;color:#fff;font-size:13px;font-weight:800}" +
    "#pr-accueil{position:fixed;left:12px;right:12px;bottom:12px;z-index:9985;background:#12351F;border:1px solid #3FAE74;border-radius:16px;padding:12px 14px;color:#F6F1E7;font-size:13px;line-height:1.4;box-shadow:0 8px 24px rgba(0,0,0,.5)}" +
    "#pr-accueil button{margin-top:8px;min-height:44px;width:100%;border:0;border-radius:12px;background:#25D366;color:#fff;font-weight:800;font-size:14px}";
  document.head.appendChild(st);

  function dessiner() {
    var el = $("ref-compteur");
    if (!el) return;
    var n = nb(), cible = n >= 3 ? 10 : 3, pct = Math.min(100, Math.round(n / cible * 100));
    var txt = n >= 10 ? "🎁 " + n + " amis actifs : Pack Commerçants offert !"
      : n >= 3 ? "🎁 " + n + " amis actifs : 1 mois Premium gagné. Encore " + (10 - n) + " pour le Pack Commerçants."
      : n + " / 3 amis actifs. Encore " + (3 - n) + " pour 1 mois Premium.";
    var h = '<span style="display:block">' + txt + '</span><span class="pr-b"><i style="width:' + pct + '%"></i></span>' +
      '<span style="display:block;font-size:10px;color:#A69C86;font-weight:400">Un ami compte quand il a fait son premier exercice.</span>';
    var fait = lire("diisoo_ref_reclame", 0) | 0, palier = n >= 10 ? 10 : n >= 3 ? 3 : 0;
    el.innerHTML = h;
    if (palier && fait < palier) {
      var b = document.createElement("span");
      b.className = "pr-r"; b.setAttribute("role", "button"); b.style.lineHeight = "44px"; b.style.textAlign = "center";
      b.textContent = "🎁 Activée automatiquement. Un souci ? Écris-nous";
      b.onclick = function (ev) {
        ev.stopPropagation();
        var p = lire("diisoo_profile", {}) || {};
        var m = "Bonjour Diisoo, ma récompense de parrainage n'est pas activée. J'ai invité " + n + " amis. Mon code : " + code() + (p.phone ? ". Mon numéro WhatsApp : " + p.phone : "") +
          ". Récompense attendue : " + (palier >= 10 ? "le Pack Commerçants" : "1 mois Premium") + ".";
        window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(m), "_blank", "noopener");
        ecrire("diisoo_ref_reclame", palier);
        setTimeout(dessiner, 500);
      };
      el.appendChild(b);
    }
  }

  /* chaque mise à jour du compteur existant est redessinée avec la barre */
  var orig = window.majCompteurParrainage;
  if (typeof orig === "function") {
    window.majCompteurParrainage = function () {
      var r; try { r = orig.apply(this, arguments); } catch (e) {}
      Promise.resolve(r).then(dessiner, dessiner);
      return r;
    };
  }
  try { new MutationObserver(function () { var e = $("ref-compteur"); if (e && !e.querySelector(".pr-b")) dessiner(); }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  setTimeout(dessiner, 1500);

  /* ---------- lien code -> numéro : la récompense s'accorde alors toute seule ---------- */
  function lier() {
    try {
      var pr = lire("diisoo_profile", {}) || {};
      if (!pr.phone || typeof db === "undefined" || !db || lire("diisoo_ref_lie", "") === pr.phone + code()) return;
      db.rpc("lier_code_parrain", { p_code: code(), p_whatsapp: pr.phone }).then(function (r) {
        if (r && !r.error) {
          ecrire("diisoo_ref_lie", pr.phone + code());
          try { if (typeof majStatutAcces === "function") majStatutAcces(); } catch (e) {}
        }
      }, function () {});
    } catch (e) {}
  }
  setTimeout(lier, 4000);
  window.addEventListener("online", lier);
  setInterval(function () { try { if (typeof majStatutAcces === "function" && nb() >= 3) majStatutAcces(); } catch (e) {} }, 60000);

  /* ---------- accueil de l'ami invité ---------- */
  setTimeout(function () {
    var parrain = lire("diisoo_ref_parrain", ""), vu = lire("diisoo_ref_accueil", 0);
    var ecran = $("screen-dashboard");
    if (!parrain || vu || !ecran || ecran.offsetParent === null) return;
    ecrire("diisoo_ref_accueil", 1);
    var d = document.createElement("div"); d.id = "pr-accueil";
    d.innerHTML = "🎁 <b>Un ami t'a invité sur Diisoo.</b><br>Fais ton premier exercice : cela lui compte pour sa récompense, et tu démarres ton objectif.";
    var b = document.createElement("button"); b.type = "button"; b.textContent = "C'est parti";
    b.onclick = function () { d.remove(); };
    d.appendChild(b); document.body.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.remove(); }, 15000);
  }, 5000);

  window.DiisooParrainage = { version: 1, message: message };
})();
