/* diisoo-indulgence.js v1 : micro indulgent + voix wolof plus rapide
   1) Les noms propres et les lieux (Senegal, Dakar, Gorée, Awa, Colobane...) ne comptent ni juste ni faux : ils sont ignorés.
   2) Le seuil de validation baisse : il suffit de dire environ 60 % des mots pour passer à l'étape suivante.
   3) Le préchargement de la voix wolof utilise le même texte que la lecture (avant, les phrases avec « ñ » ou des parenthèses
      n'étaient jamais retrouvées dans le cache et la voix repartait de zéro).
   Ne modifie aucun fichier existant : remplace voixJuste, voixHeatmap, practiceWord, practiceBusinessPhrase, prefetchVoix. */
(function () {
  "use strict";
  if (window.__diisooIndulgence) return;
  window.__diisooIndulgence = true;

  function nz(s) {
    return String(s == null ? "" : s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z\s']/g, " ").replace(/\s+/g, " ").trim();
  }
  function lev(a, b) {
    try { if (typeof levenshtein === "function") return levenshtein(a, b); } catch (e) {}
    var m = a.length, n = b.length, p = [], i, j, c;
    for (j = 0; j <= n; j++) p[j] = j;
    for (i = 1; i <= m; i++) {
      var prev = p[0]; p[0] = i;
      for (j = 1; j <= n; j++) {
        c = p[j];
        p[j] = Math.min(p[j] + 1, p[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = c;
      }
    }
    return p[n];
  }
  function sim(a, b) { var L = Math.max(a.length, b.length); return L ? 1 - lev(a, b) / L : 0; }

  /* ---- noms propres et lieux ignorés ---- */
  var ENT = {};
  ("senegal dakar thies goree saly mbour saloum casamance ziguinchor touba kaolack louga saint louis st retba rose " +
   "colobane sandaga centenaire guangzhou china chine africa africain france europe paris london canada usa america " +
   "wolof french english diisoo teranga thieboudienne thiebou yassa mafe dibi bissap wave orange money " +
   "awa fatou moussa ousmane ibrahima mamadou aminata khady babacar abdou cheikh modou omar samba ndeye mariama " +
   "pinterest abc global").split(" ").forEach(function (w) { if (w) ENT[w] = 1; });
  var COMMUN = {}; ("the and you are how what who where when why can could would will please thank thanks yes no hello hi good fine okay ok welcome sorry excuse today tomorrow monday tuesday wednesday thursday friday saturday sunday").split(" ").forEach(function (w) { COMMUN[w] = 1; });
  var DEJA_APPRIS = false;
  function apprendre() {
    if (DEJA_APPRIS) return;
    var textes = [];
    try { Object.keys(CHINA_TRADE_WOLOF).forEach(function (k) { (CHINA_TRADE_WOLOF[k].vocab || []).forEach(function (v) { textes.push(v.en); }); }); } catch (e) {}
    try { Object.keys(BUSINESS_DIALOGUES).forEach(function (k) { (BUSINESS_DIALOGUES[k] || []).forEach(function (l) { textes.push(l.en); }); }); } catch (e) {}
    try { GENERAL_THEMES.forEach(function (t) { (t.vocab || []).forEach(function (v) { textes.push(v.en); }); (t.dialogue || []).forEach(function (l) { textes.push(l.en || l.text); }); }); } catch (e) {}
    textes.forEach(function (s) {
      var mots = String(s || "").split(/\s+/);
      for (var i = 1; i < mots.length; i++) {
        if (/[.!?;:\u2026"\u00AB\u201C(\-\u2013\u2014]$/.test(mots[i - 1]) || /^[-\u2013\u2014]$/.test(mots[i - 1])) continue;
        var w = mots[i].replace(/[^A-Za-zÀ-ÿ']/g, "");
        if (w.length > 2 && /^[A-ZÀ-Þ]/.test(w) && !/^I'/.test(w)) ENT[nz(w)] = 1;
      }
    });
    DEJA_APPRIS = true;
  }
  function mots(s) { return nz(s).split(" ").filter(Boolean); }
  function sansNoms(arr) { return arr.filter(function (w) { return !ENT[w]; }); }

  /* ---- validation indulgente ---- */
  function voixJuste(heard, target) {
    apprendre();
    if (!String(heard || "").trim() || !String(target || "").trim()) return false;
    var H = mots(heard), Tall = mots(target), T = sansNoms(Tall);
    if (!T.length) return H.length > 0;                  /* la cible n'est qu'un nom : tout ce qui est dit passe */
    var Hs = sansNoms(H);
    if (!Hs.length) return false;
    var h = Hs.join(" "), t = T.join(" ");
    if ((" " + h + " ").indexOf(" " + t + " ") > -1) return true;
    if (sim(h, t) >= 0.6) return true;
    var utilise = [], bons = 0;
    T.forEach(function (w) {
      var best = 0, bi = -1;
      for (var i = 0; i < Hs.length; i++) {
        if (utilise[i]) continue;
        var s = Hs[i] === w ? 1 : (Hs[i].indexOf(w) === 0 || w.indexOf(Hs[i]) === 0) && Math.min(w.length, Hs[i].length) >= 3 ? 0.8 : sim(w, Hs[i]);
        if (s > best) { best = s; bi = i; }
      }
      if (best >= 0.6 && bi > -1) { utilise[bi] = true; bons++; }
    });
    return bons >= Math.max(1, Math.round(T.length * 0.6));
  }
  window.voixJuste = voixJuste;

  function voixHeatmap(heard, target) {
    apprendre();
    if (!target) return "";
    var T = String(target).split(" ").filter(Boolean), H = sansNoms(mots(heard)), used = [], total = 0, compte = 0;
    var out = T.map(function (word) {
      var w = nz(word);
      if (!w || ENT[w]) return '<span style="color:#8C8064">⚪ ' + word + "</span>";
      compte++;
      var best = 0, bi = -1;
      for (var i = 0; i < H.length; i++) {
        if (used[i]) continue;
        var s = H[i] === w ? 1 : sim(w, H[i]);
        if (s > best) { best = s; bi = i; }
      }
      if (best >= 0.45 && bi > -1) used[bi] = true;
      total += best >= 0.7 ? 1 : best >= 0.45 ? 0.7 : 0;
      var c = best >= 0.7 ? ["🟢", "#5FC98F", ""] : best >= 0.45 ? ["🟡", "#F3A94E", "text-decoration:underline wavy;"] : ["🔴", "#E1693F", "text-decoration:underline;font-weight:800;"];
      return '<span style="color:' + c[1] + ";" + c[2] + '">' + c[0] + " " + word + "</span>";
    });
    var pct = compte ? Math.round(total / compte * 100) : 100;
    return '<div style="margin-top:6px;font-size:12px;line-height:1.9">' + out.join(" &nbsp;") +
      '<div style="color:#A69C86;font-size:11px">Prononciation : ' + pct + " %" + (ENT[nz(T[0])] || T.some(function (x) { return ENT[nz(x)]; }) ? " · les noms propres ne comptent pas" : "") + "</div></div>";
  }
  window.voixHeatmap = voixHeatmap;

  /* ---- les deux exercices qui comparaient en mots exacts utilisent maintenant la même règle ---- */
  function $(id) { return document.getElementById(id); }
  window.practiceBusinessPhrase = async function (sectionKey, idx) {
    var v = CHINA_TRADE_WOLOF[sectionKey].vocab[idx];
    var res = $("biz-res-" + sectionKey + "-" + idx);
    if (!res) return;
    if (!SR) { res.textContent = "Reconnaissance vocale indisponible sur ce navigateur. Utilise Chrome."; return; }
    res.innerHTML = '<span class="text-[#F0906B]">🎤 Parle... relâche pour valider</span>';
    stopAllAudio();
    var h = startListening("en-US", 15000, true); window.__micHandle = h; if (window.__micReleased) h.stop();
    var r = await h.promise;
    if (r.error === "not-allowed" || r.error === "service-not-allowed") { res.textContent = "Micro bloqué. Autorise le micro dans le navigateur."; return; }
    if (!r.text) { res.textContent = "Rien entendu. Garde le bouton enfoncé pendant que tu parles."; return; }
    var heard = normalize(r.text), target = normalize(v.en);
    if (voixJuste(heard, target)) {
      res.innerHTML = '<span class="text-[#5FC98F] pop-in">✅ ' + encourageMsg() + "</span>";
      addXP(3); bumpDailyGoal(1);
    } else {
      res.innerHTML = '<span class="text-amber-400">J\'ai entendu : « ' + heard + " ». Objectif : « " + v.en + " ». Réessaie.</span>";
    }
    res.innerHTML += voixHeatmap(heard, target);
  };
  window.practiceWord = async function (i) {
    var w = LEXICON[i], res = $("res-" + i);
    if (!res) return;
    if (!SR) { res.textContent = "La reconnaissance vocale n'est pas disponible sur ce navigateur. Utilise Chrome."; return; }
    res.innerHTML = '<span class="text-[#F0906B]">🎤 Parle... relâche pour valider</span>';
    stopAllAudio();
    var h = startListening("en-US", 15000, true); window.__micHandle = h; if (window.__micReleased) h.stop();
    var r = await h.promise;
    if (r.error === "not-allowed" || r.error === "service-not-allowed") { res.textContent = "Micro bloqué. Autorise le micro dans le navigateur."; return; }
    if (!r.text) { res.textContent = "Rien entendu. Garde le bouton enfoncé pendant que tu parles."; return; }
    var heard = normalize(r.text), target = normalize(w.en);
    if (voixJuste(heard, target)) {
      res.innerHTML = '<span class="text-[#5FC98F] pop-in">✅ ' + encourageMsg() + " J'ai entendu : « " + heard + " »</span>";
      bumpWordStat(w.en, "correct");
      addXP(3); bumpDailyGoal(1); checkBilingueBadge();
      var fu = pickFollowUp(heard);
      res.innerHTML += '<p class="text-[11px] text-[#A69C86] mt-1">💬 ' + fu + "</p>";
      speak(fu, "en-US", 0.85);
    } else {
      res.innerHTML = '<span class="text-amber-400">J\'ai entendu : « ' + heard + " ». Objectif : « " + w.en + " ». Réessaie.</span>";
      bumpWordStat(w.en, "wrong");
    }
    res.innerHTML += voixHeatmap(heard, target);
  };

  /* ---- voix wolof : même texte au préchargement et à la lecture, plus quelques nettoyages sûrs ---- */
  try {
    var pw = window.prononciationWolof;
    if (typeof pw === "function" && !pw.__indulg) {
      var pw2 = function (t) {
        t = String(t || "").replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, " ").replace(/[«»"“”]/g, " ").replace(/’/g, "'");
        return pw(t);
      };
      pw2.__indulg = true; window.prononciationWolof = pw2;
    }
  } catch (e) {}
  try {
    var pf = window.prefetchVoix;
    if (typeof pf === "function" && !pf.__indulg) {
      var pf2 = function (textes, langue) {
        var liste = (textes || []).filter(Boolean);
        if (langue === "wo" && typeof window.prononciationWolof === "function") liste = liste.map(function (t) { return window.prononciationWolof(String(t).trim().slice(0, 500)); }).filter(Boolean);
        return pf(liste, langue);
      };
      pf2.__indulg = true; window.prefetchVoix = pf2;
    }
  } catch (e) {}
  /* le préchargement direct (autres scripts) passe par la même transformation */
  var essais = 0, t = setInterval(function () {
    try {
      var v = window.Diisoo && window.Diisoo.voix;
      if (v && v.precharger && !v.precharger.__indulg) {
        var p0 = v.precharger;
        v.precharger = function (textes, langue, nom) {
          var l = textes || [];
          if (langue === "wo" && typeof window.prononciationWolof === "function") l = l.filter(Boolean).map(function (x) { return window.prononciationWolof(String(x).trim().slice(0, 500)); }).filter(Boolean);
          return p0.call(this, l, langue, nom);
        };
        v.precharger.__indulg = true; clearInterval(t);
      }
    } catch (e) {}
    if (++essais > 40) clearInterval(t);
  }, 500);
})();
