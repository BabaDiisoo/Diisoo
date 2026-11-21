/* diisoo-b6.js : morceau 6/6 du bundle. Généré, ne pas modifier à la main. */
try{
/* ---- diisoo-conversation.js ---- */
/* diisoo-conversation.js v1 : conversation avec l'IA
   Un bouton « Converse avec l'IA » dans chaque secteur Business et chaque thème d'Anglais.
   L'IA joue le client (ou un ami), parle anglais, écoute la réponse de l'apprenant, la corrige gentiment
   et pose la question suivante. 6 échanges, puis un bilan avec les phrases à retenir.
   La clé OpenAI reste côté Supabase (fonction dynamic-processor) : rien de secret dans ce fichier. */
(function () {
  "use strict";
  if (window.DiisooConversation) return;
  var FONCTION = "dynamic-processor";
  var TOURS = 6, LIMITE_JOUR = 40;
  var $ = function (id) { return document.getElementById(id); };
  function pause(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  var SCENES = {
    colobane: "You are a customer in a car spare parts shop in Colobane market, Dakar. The learner is the seller. You want brake pads for a Toyota Corolla and you try to get a good price.",
    sandaga: "You are a customer in a clothes and fabric shop at Sandaga market, Dakar. The learner is the seller. You want to buy shirts and ask about sizes, colours and price.",
    electronique: "You are a customer in an electronics shop in Dakar. The learner is the seller. You want to buy a phone and ask about memory, battery, warranty and price.",
    bazar: "You are a customer in a furniture shop in Dakar. The learner is the seller. You want a sofa and a table and ask about price, delivery and payment.",
    agriculture: "You are a buyer at a fresh vegetable market in Senegal. The learner is the farmer or seller. You want to buy tomatoes and onions and ask about price and quality.",
    chine: "You are a Chinese supplier in Guangzhou. The learner is a Senegalese importer. Talk about price, minimum order, shipping time and payment.",
    tour_hotel: "You are a tourist arriving at a hotel in Dakar. The learner is the hotel receptionist. You have a reservation and ask about the room, breakfast and Wi-Fi.",
    tour_resto: "You are a tourist in a restaurant in Dakar. The learner is the waiter. You want to order Senegalese food and ask what is typical and if it is spicy.",
    tour_guide: "You are a tourist who wants to visit Gorée Island. The learner is the tour guide. Ask about the time, the price, what to see and if you can take photos.",
    tour_transport: "You are a tourist who needs a taxi from Dakar to Saly. The learner is the taxi driver. Ask about the price and the time, and try to negotiate.",
    tour_artisanat: "You are a tourist in a craft market in Senegal. The learner is the craftsman. You like a wooden mask and you want to negotiate the price.",
    tour_agence: "You are a customer in a travel agency in Thiès. The learner is the travel agent. You want a return flight to Paris next month and ask about price, luggage and visa.",
    tour_plage: "You are a tourist on a beach near Saly. The learner works for a boat tour company. You want a boat trip and ask about the price, the duration and safety."
  };

  var S = null, ov = null;

  function jourCle() { return "diisoo_conv_" + new Date().toISOString().slice(0, 10); }
  function utilises() { try { return +localStorage.getItem(jourCle()) || 0; } catch (e) { return 0; } }
  function compter() { try { localStorage.setItem(jourCle(), String(utilises() + 1)); } catch (e) {} }

  function appeler(corps) {
    if (window.__convStub) return Promise.resolve(window.__convStub(corps));
    try { return db.functions.invoke(FONCTION, { body: corps }); } catch (e) { return Promise.reject(e); }
  }
  function demander(texte) {
    compter();
    return appeler({ scene: S.scene, niveau: S.niveau, hist: S.hist, texte: texte || "" }).then(function (r) {
      var d = r && r.data;
      if (typeof d === "string") { try { d = JSON.parse(d); } catch (e) { d = null; } }
      if (!d || d.erreur || !d.reply) return { erreur: (d && d.erreur) || (r && r.error && "ia") || "ia" };
      return d;
    }).catch(function () { return { erreur: "ia" }; });
  }

  function css() {
    if ($("dcv-css")) return;
    var s = document.createElement("style"); s.id = "dcv-css";
    s.textContent =
      ".dcv-go{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:52px;margin:6px 0;border-radius:16px;border:1px solid #3FAE74;background:#10261A;color:#F6F1E7;font-weight:800;font-size:15px}" +
      "#dcv{position:fixed;inset:0;z-index:96;background:#0B0F1C;color:#F6F1E7;display:flex;flex-direction:column;padding:68px 18px 18px;overflow-y:auto}#dcv.hidden{display:none}" +
      "#dcv .top{display:flex;align-items:center;gap:10px}#dcv .x{min-height:44px;min-width:44px;border-radius:14px;background:#141A2B;border:1px solid #1E2740;color:#C9BFA8;font-size:13px;padding:0 14px}" +
      "#dcv .bar{flex:1;height:8px;border-radius:99px;background:#1E2740;overflow:hidden}#dcv .bar i{display:block;height:100%;background:linear-gradient(90deg,#3FAE74,#5FC98F);width:0;transition:width .4s}" +
      "#dcv .zone{flex:1;display:flex;flex-direction:column;gap:12px;justify-content:center;padding:10px 0}" +
      "#dcv .ia{background:#141A2B;border:1px solid #1E2740;border-radius:18px;padding:14px;font-size:20px;font-weight:800;line-height:1.3}" +
      "#dcv .moi{align-self:flex-end;background:#2a1a12;border:1px solid #E1693F;border-radius:18px;padding:10px 14px;font-size:16px;max-width:90%}" +
      "#dcv .fix{background:#12301f;border:1px solid #3FAE74;border-radius:14px;padding:10px 12px;font-size:14px;line-height:1.35}" +
      "#dcv .fix b{color:#5FC98F}#dcv .tip{color:#C9BFA8;font-size:13px;margin-top:4px}" +
      "#dcv .orb{align-self:center;width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;background:#141A2B;border:2px solid #1E2740}" +
      "#dcv .orb.on{background:linear-gradient(135deg,#F3A94E,#E1693F);border-color:transparent;animation:dcvp 1s infinite}@keyframes dcvp{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}" +
      "#dcv .msg{text-align:center;font-size:14px;color:#C9BFA8;min-height:20px}" +
      "#dcv .row{display:flex;gap:10px}#dcv .b{flex:1;min-height:56px;border-radius:16px;font-weight:800;font-size:15px;background:#141A2B;border:1px solid #1E2740;color:#F6F1E7}#dcv .b.p{background:linear-gradient(135deg,#F3A94E,#E1693F);color:#241505;border:0}";
    document.head.appendChild(s);
  }

  function fin() {
    if (!S) return;
    S.jeton++;
    try { S.h && S.h.stop(); } catch (e) {}
    try { stopAllAudio(); } catch (e) {}
    if (ov) ov.classList.add("hidden");
    S = null;
  }
  function dire(t) { try { return Promise.resolve(speak(t, "en-US", 0.9)).catch(function () {}); } catch (e) { return Promise.resolve(); } }
  function entete(pct) {
    return '<div class="top"><button class="x" type="button" id="dcv-q">✕ Arrêter</button><div class="bar"><i style="width:' + pct + '%"></i></div></div>';
  }
  function liens() { var q = $("dcv-q"); if (q) q.onclick = fin; }

  function ecouter(mon) {
    return new Promise(function (res) {
      var h, dernier = Date.now(), vu = "", debut = false;
      try {
        h = startListening("en-US", 12000, false, function (t) { if (t !== vu) { vu = t; dernier = Date.now(); debut = true; var e = $("dcv-heard"); if (e) e.textContent = "« " + t + " »"; } });
      } catch (e) { res({ texte: "", indispo: true }); return; }
      S.h = h;
      var iv = setInterval(function () {
        if (!S || mon !== S.jeton) { clearInterval(iv); return; }
        if (debut && Date.now() - dernier > 1700) { clearInterval(iv); try { h.stop(); } catch (e) {} }
      }, 250);
      h.promise.then(function (r) { clearInterval(iv); r = r || {}; res({ texte: (r.text || "").trim(), indispo: !!(r.unsupported || r.error === "not-allowed" || r.error === "service-not-allowed") }); });
    });
  }

  function erreurEcran(code) {
    var m = code === "limite" ? "Tu as beaucoup parlé aujourd'hui ! Reviens demain pour continuer." :
      code === "insufficient_quota" ? "L'IA n'est pas encore activée. Essaie le jeu de rôle en attendant." :
      "L'IA est indisponible pour le moment. Essaie le jeu de rôle en attendant.";
    ov.innerHTML = entete(0) + '<div class="zone"><div class="ia" style="font-size:17px">' + esc(m) + '</div></div><div class="row"><button class="b p" type="button" id="dcv-ok">Fermer</button></div>';
    liens(); $("dcv-ok").onclick = fin;
  }

  function jouer(i, mon) {
    if (!S || mon !== S.jeton) return Promise.resolve();
    var dernierIA = S.hist.length ? S.hist[S.hist.length - 1].content : "";
    var pct = Math.round(i / TOURS * 100);
    ov.innerHTML = entete(pct) + '<div class="zone"><div class="ia">' + esc(dernierIA) + '</div><div id="dcv-fix"></div><div class="moi" id="dcv-heard" style="visibility:hidden"></div></div>' +
      '<div class="orb" id="dcv-orb">🔊</div><div class="msg" id="dcv-msg">Écoute...</div>' +
      '<div class="row" style="margin-top:10px"><button class="b" type="button" id="dcv-skip">Passer</button></div>';
    liens();
    var passer = false;
    $("dcv-skip").onclick = function () { passer = true; try { S.h && S.h.stop(); } catch (e) {} };
    return dire(dernierIA).then(function () {
      if (!S || mon !== S.jeton) return null;
      var o = $("dcv-orb"), m = $("dcv-msg"), hh = $("dcv-heard");
      if (o) { o.textContent = "🎙️"; o.className = "orb on"; }
      if (m) m.textContent = "À toi : réponds en anglais";
      if (hh) hh.style.visibility = "visible";
      return ecouter(mon);
    }).then(function (r) {
      if (!S || mon !== S.jeton || !r) return null;
      if (r.indispo) { var m = $("dcv-msg"); if (m) m.textContent = "Micro indisponible. Autorise le micro et réessaie."; return null; }
      if (passer || !r.texte) { var mm = $("dcv-msg"); if (mm) mm.textContent = "Je n'ai rien entendu. On réessaie."; return pause(1000).then(function () { return jouer(i, mon); }); }
      var o2 = $("dcv-orb"); if (o2) { o2.textContent = "💭"; o2.className = "orb"; }
      var m2 = $("dcv-msg"); if (m2) m2.textContent = "L'IA réfléchit...";
      return demander(r.texte).then(function (d) {
        if (!S || mon !== S.jeton) return null;
        if (d.erreur) { erreurEcran(d.erreur); return null; }
        S.hist.push({ role: "user", content: r.texte });
        S.hist.push({ role: "assistant", content: d.reply });
        if (d.fix && d.fix.trim().toLowerCase() !== r.texte.trim().toLowerCase()) S.fixes.push({ avant: r.texte, apres: d.fix, tip: d.tip || "" });
        var z = $("dcv-fix");
        if (z && d.fix && d.fix.trim().toLowerCase() !== r.texte.trim().toLowerCase()) z.innerHTML = '<div class="fix"><b>Mieux :</b> ' + esc(d.fix) + (d.tip ? '<div class="tip">💡 ' + esc(d.tip) + '</div>' : '') + '</div>';
        else if (z) z.innerHTML = '<div class="fix"><b>✅ Très bien !</b></div>';
        return pause(d.fix ? 2600 : 1200).then(function () {
          if (!S || mon !== S.jeton) return null;
          if (i + 1 >= TOURS) return bilan();
          return jouer(i + 1, mon);
        });
      });
    });
  }

  function bilan() {
    var f = S.fixes.slice(0, 4);
    ov.innerHTML = entete(100) + '<div class="zone"><div style="font-size:44px;text-align:center">🎉</div><div class="ia" style="text-align:center">Bravo ! Tu as tenu une vraie conversation en anglais.</div>' +
      (f.length ? '<div style="font-size:13px;color:#8C8064;font-weight:800;text-transform:uppercase">À retenir</div>' + f.map(function (x) {
        return '<div class="fix"><span style="color:#C9BFA8">' + esc(x.avant) + '</span><br><b>→ ' + esc(x.apres) + '</b>' + (x.tip ? '<div class="tip">💡 ' + esc(x.tip) + '</div>' : '') + '</div>';
      }).join("") : '<div class="fix"><b>Aucune erreur à corriger. Excellent !</b></div>') + '</div>' +
      '<div class="row"><button class="b" type="button" id="dcv-redo">🔁 Recommencer</button><button class="b p" type="button" id="dcv-end">Terminer</button></div>';
    liens(); $("dcv-end").onclick = fin;
    var sc = S.scene, nv = S.niveau, ti = S.titre;
    $("dcv-redo").onclick = function () { fin(); demarrer(sc, nv, ti); };
    try { addXP(10); bumpDailyGoal(1); } catch (e) {}
    return null;
  }

  function demarrer(scene, niveau, titre) {
    css();
    if (!ov) { ov = document.createElement("div"); ov.id = "dcv"; ov.className = "hidden"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Conversation avec l'IA"); document.body.appendChild(ov); }
    if (S) fin();
    S = { scene: scene, niveau: niveau, titre: titre, hist: [], fixes: [], jeton: 1 };
    var mon = S.jeton;
    ov.classList.remove("hidden");
    if (utilises() >= LIMITE_JOUR) { erreurEcran("limite"); return; }
    ov.innerHTML = entete(0) + '<div class="zone"><div class="ia" style="text-align:center">💬 ' + esc(titre) + '</div><div class="msg">Je joue le rôle. Tu réponds en anglais, à voix haute. Je corrige gentiment.</div></div>' +
      '<div class="row"><button class="b p" type="button" id="dcv-go">▶️ Commencer</button></div>';
    liens();
    $("dcv-go").onclick = function () {
      ov.innerHTML = entete(0) + '<div class="zone"><div class="ia" style="text-align:center">...</div></div>';
      liens();
      demander("").then(function (d) {
        if (!S || mon !== S.jeton) return;
        if (d.erreur) { erreurEcran(d.erreur); return; }
        S.hist.push({ role: "assistant", content: d.reply });
        jouer(0, mon);
      });
    };
  }

  /* ---------- boutons ---------- */
  function niveauBiz() { try { return ["A1", "A2", "B1"][DiisooBiz.niveau() - 1] || "A2"; } catch (e) { return "A2"; } }
  function niveauGen() { try { return ["A1", "A2", "B1"][DiisooOrga.niveau("general") - 1] || "A2"; } catch (e) { return "A2"; } }
  function titreBiz() { try { return BUSINESS_SECTORS[DiisooBiz.secteur()].titre; } catch (e) { return "Conversation"; } }
  function titreGen() { try { return GENERAL_THEMES.filter(function (t) { return t.id === generalThemeId; })[0].title.replace(/🏝️?\s*/g, ""); } catch (e) { return "Conversation"; } }

  function poser() {
    var cfg = [
      ["business", "dsn-btn-business", "screen-business", function () { var k = DiisooBiz.secteur(); return SCENES[k] ? [SCENES[k], niveauBiz(), titreBiz()] : null; }],
      ["general", "dsn-btn-general", "screen-general", function () { var t = titreGen(); return ["You are a friendly person chatting with the learner about this topic: " + t + ". Ask simple questions about it.", niveauGen(), t]; }]
    ];
    cfg.forEach(function (c) {
      var ancre = $(c[1]), id = "dcv-btn-" + c[0], b = $(id);
      var ecran = $(c[2]), visible = ecran && !ecran.classList.contains("hidden");
      if (!ancre || !visible) { if (b) b.remove(); return; }
      if (b) return;
      b = document.createElement("button"); b.type = "button"; b.id = id; b.className = "dcv-go";
      b.innerHTML = "💬 Converse avec l'IA : joue la scène";
      b.onclick = function () { var p = c[3](); if (p) demarrer(p[0], p[1], p[2]); };
      ancre.parentNode.insertBefore(b, ancre.nextSibling);
    });
  }
  css();
  setInterval(function () { try { poser(); } catch (e) {} }, 700);

  window.DiisooConversation = { version: 1, demarrer: demarrer };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-conversation.js",e);}

try{
/* ---- diisoo-indulgence.js ---- */
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

}catch(e){console.error("Diisoo : erreur dans diisoo-indulgence.js",e);}

try{
/* ---- diisoo-priorites.js ---- */
/* diisoo-priorites.js v1 : les thèmes et les secteurs sont rangés par priorité d'usage, dans toute l'application.
   Anglais : Se présenter d'abord, puis nombres, famille, nourriture... ; les thèmes touristiques viennent après les thèmes de base.
   Wolof : Salutations d'abord. Tourisme (Business) : Hôtel, Restaurant, Taxi, Guide, Plage, Artisanat, Agence.
   Niveaux : « Demander son chemin » passe en niveau 1, « Réserver un hôtel » en niveau 2 (difficulté croissante). */
(function () {
  "use strict";
  if (window.__diisooPriorites) return;
  window.__diisooPriorites = true;
  var NIVEAU = { directions: 1, hotel: 2 };
  var ORDRE_EN = ["intro", "time", "family", "food", "directions",
    "tour-accueil", "tour-resto", "tour-taxi",
    "work", "market", "travel", "health", "housing", "hotel",
    "tour-goree", "tour-monuments", "tour-excursion", "tour-plage", "tour-artisanat",
    "interview", "pitch", "orders", "visa", "agri",
    "tour-circuit", "tour-agence", "tour-culture", "tour-urgence"];
  var ORDRE_WO = ["salutations", "famille", "temps", "marche", "nourriture", "voyage", "maison", "corps", "logement"];
  window.DIISOO_ORDRE_TOURISME = ["tour_hotel", "tour_resto", "tour_transport", "tour_guide", "tour_plage", "tour_artisanat", "tour_agence"];

  function rang(liste, id) { var i = liste.indexOf(id); return i < 0 ? 999 : i; }
  function trier() {
    try {
      GENERAL_THEMES.forEach(function (t) {
        var n = NIVEAU[t.id];
        if (n && t.niveau !== n) { t.niveau = n; t.title = String(t.title).replace(/^N\d/, "N" + n); }
      });
      GENERAL_THEMES.sort(function (a, b) { return (a.niveau || 3) - (b.niveau || 3) || rang(ORDRE_EN, a.id) - rang(ORDRE_EN, b.id); });
      var d = GENERAL_THEMES.find(function (t) { return t.id === "intro"; });
      if (d && typeof generalThemeId !== "undefined" && /^tour-/.test(generalThemeId)) generalThemeId = d.id;
    } catch (e) {}
    try {
      if (Array.isArray(WOLOF_THEMES)) WOLOF_THEMES.sort(function (a, b) { return rang(ORDRE_WO, a.id) - rang(ORDRE_WO, b.id); });
    } catch (e) {}
  }
  trier();
  setTimeout(trier, 1500);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-priorites.js",e);}

try{
/* ---- diisoo-continuer.js ---- */
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

}catch(e){console.error("Diisoo : erreur dans diisoo-continuer.js",e);}

try{
/* ---- diisoo-examens-hub.js ---- */
/* diisoo-examens-hub.js v1 : nouveau hub "Examens & visa" (remplace l'ancien simulateur) */
(function () {
  "use strict";
  var CSS =
    "#screen-test-simulation:not(.hidden) #test-phase-label,#screen-test-simulation:not(.hidden) #test-topic-label{display:none!important}" +
    "#screen-test-simulation.xh-on>div:first-child{display:none!important}" +
    "#screen-test-simulation.xh-on #test-picker>*:not(#xh-hub){display:none!important}" +
    "#screen-test-simulation.xh-on>div.flex-1{padding-top:4px!important;padding-bottom:4px!important;justify-content:flex-start!important}" +
    "#screen-test-simulation.xh-on>div:last-child{display:none!important}" +
    "#test-dots{flex-wrap:nowrap!important;gap:3px!important;padding:0 4px}" +
    "#test-dots button{flex:1 1 0;min-width:0;width:auto!important;height:8px!important;border-radius:4px!important;font-size:0!important;padding:0;border:0!important}" +
    "#test-dots button.bg-\\[\\#141A2B\\]{background:#2A3454!important}" +
    "body>div.fixed.bottom-6.pop-in{bottom:auto!important;top:62px!important;max-width:70vw!important;font-size:12.5px!important}" +
    "#screen-test-simulation:not(.xh-on) #test-live{gap:10px}" +
    "#xh-hub{display:flex;flex-direction:column;gap:8px}" +
    "#xh-hub h2{font-size:19px;font-weight:800;color:#F6F1E7;margin:2px 0 0}" +
    "#xh-hub .xh-s{font-size:12.5px;color:#A69C86;margin:0 0 2px}" +
    "#xh-hub .xh-g{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
    "#xh-hub button{text-align:left;border-radius:16px;border:1px solid #1E2740;background:#141A2B;color:#F6F1E7;display:flex;align-items:center;gap:10px;padding:8px 10px;min-height:56px}" +
    "#xh-hub button:active{border-color:#E1693F}" +
    "#xh-hub .xh-i{font-size:24px;line-height:1}" +
    "#xh-hub .xh-n{font-size:14px;font-weight:800;line-height:1.15}" +
    "#xh-hub .xh-n small{display:block;font-size:12px;font-weight:500;color:#A69C86;margin-top:1px}" +
    "#xh-hub .xh-big{min-height:64px;border:2px solid #F0906B;background:linear-gradient(135deg,#C2542D,#E1693F);box-shadow:0 6px 18px rgba(226,105,63,.3)}" +
    "#xh-hub .xh-big .xh-n small{color:#FFE7DA}" +
    "#xh-hub .xh-biz{border-color:#25D366}" +
    "#xh-hub .xh-l{font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#F0906B;margin-top:2px}" +
    "#xh-hub .xh-d{font-size:12px;color:#8C8064;text-align:center;line-height:1.35;margin-top:2px}";
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  var EX = [
    ["visa", "🛂", "Visa", "Consulat"], ["ielts", "🇬🇧", "IELTS", "Visa A1"], ["toefl", "🎓", "TOEFL", "Speaking"],
    ["toeic", "💼", "TOEIC", "Speaking"], ["duolingo", "🦉", "Duolingo", "English Test"],
    ["cambridge_a2", "📘", "Cambridge A2", "Key"], ["cambridge_b1", "📗", "Cambridge B1", "Preliminary"],
    ["pte", "🧪", "PTE", "Academic"], ["business", "🎯", "Business", "Simulation pro"]
  ];
  function ouv(k) { try { window.DiisooExams2.ouvrir(k); } catch (e) { console.warn("[diisoo] hub", e); } }
  function btn(cls, ic, nm, sm, fn) {
    var b = document.createElement("button"); b.type = "button"; if (cls) b.className = cls;
    b.innerHTML = '<span class="xh-i">' + ic + '</span><span class="xh-n">' + nm + (sm ? "<small>" + sm + "</small>" : "") + "</span>";
    b.onclick = fn; return b;
  }
  function monter() {
    var s = document.getElementById("screen-test-simulation"), p = document.getElementById("test-picker");
    if (!s || !p) return;
    s.classList.add("xh-on");
    var h = document.getElementById("xh-hub");
    if (h) { return; }
    h = document.createElement("div"); h.id = "xh-hub";
    h.innerHTML = "<h2>Examens &amp; visa</h2><p class='xh-s'>Format réel, avec ta voix. Choisis ton examen.</p>";
    var big = btn("xh-big", "🛂", "Entretien visa", "Simule l'entretien consulaire", function () {
      try { generalThemeId = "visa"; openGeneralModule(); } catch (e) {}
    });
    h.appendChild(big);
    var g = document.createElement("div"); g.className = "xh-g";
    EX.forEach(function (e) { g.appendChild(btn(e[0] === "business" ? "xh-biz" : "", e[1], e[2], e[3], function () { ouv(e[0]); })); });
    h.appendChild(g);
    var l = document.createElement("div"); l.className = "xh-l"; l.textContent = "S'entraîner avant"; h.appendChild(l);
    var g2 = document.createElement("div"); g2.className = "xh-g";
    g2.appendChild(btn("", "🗣️", "Parle", "Seul, avec correction", function () { ouv("parle"); }));
    g2.appendChild(btn("", "👂", "Écoute", "Comprendre", function () { try { openListeningModule(); } catch (e) {} }));
    h.appendChild(g2);
    var q = btn("", "⬅️", "Retour à l'accueil", "", function () { try { quitTest(); } catch (e) {} });
    q.style.minHeight = "44px"; h.appendChild(q);
    var d = document.createElement("div"); d.className = "xh-d";
    d.textContent = "Préparation indépendante. Diisoo n'est pas affilié aux organismes d'examen."; h.appendChild(d);
    p.insertBefore(h, p.firstChild);
  }
  var o = window.startTestSimulation;
  if (typeof o === "function") window.startTestSimulation = function () {
    var r = o.apply(this, arguments); try { monter(); } catch (e) {} return r;
  };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-examens-hub.js",e);}

try{
/* ---- diisoo-lecons-plus.js ---- */
/* diisoo-lecons-plus.js v1 : lecons epurees (carte mot empilee, actions secondaires sous "Plus", themes sans prefixe) */
(function () {
  "use strict";
  var st = document.createElement("style");
  st.textContent =
    ".fx-em>.flex.justify-between.items-start{flex-direction:column!important;align-items:flex-start!important;gap:3px!important}" +
    ".fx-em>.flex.justify-between.items-start>p:first-child{font-size:24px!important;font-weight:800!important;line-height:1.15!important;color:#F6F1E7!important}" +
    ".fx-em>.flex.justify-between.items-start .text-right{text-align:left!important}" +
    ".fx-em>.flex.justify-between.items-start .text-right>p:first-child{font-size:16px!important;color:#C9BFA8!important}" +
    ".fx-em .dl-sec{display:none!important}" +
    ".fx-em.dl-on .dl-sec{display:block!important}" +
    ".fx-em .dl-plus{width:100%;min-height:40px;border-radius:12px;border:1px solid #1E2740;background:transparent;color:#A69C86;font-size:13px;font-weight:700}";
  document.head.appendChild(st);

  function carte(c) {
    var ex = c.querySelector(".dl-plus");
    var sec = [];
    Array.prototype.forEach.call(c.children, function (e) {
      var t = (e.textContent || "").trim();
      if (e.tagName === "BUTTON" && (/^🎓\s*Coach vocal/.test(t) || e.classList.contains("as-btn"))) sec.push(e);
    });
    sec = sec.filter(function (e) { return !e.classList.contains("dl-sec"); });
    if (!sec.length) return;
    sec.forEach(function (e) { e.classList.add("dl-sec"); });
    if (ex) return;
    var p = document.createElement("button");
    p.type = "button"; p.className = "dl-plus"; p.textContent = "⋯ Plus";
    p.onclick = function () { var on = c.classList.toggle("dl-on"); p.textContent = on ? "▴ Moins" : "⋯ Plus"; };
    c.insertBefore(p, sec[0]);
  }
  function themes() {
    Array.prototype.forEach.call(document.querySelectorAll("#screen-general button,#screen-wolof button"), function (b) {
      var n = b.firstChild;
      var m = n && n.nodeType === 3 && /^(N\d\s·\s)/.exec(n.nodeValue);
      if (m) { var sp = document.createElement("span"); sp.style.display = "none"; sp.textContent = m[1]; n.nodeValue = n.nodeValue.slice(m[1].length); b.insertBefore(sp, n); }
    });
  }
  function passe() {
    Array.prototype.forEach.call(document.querySelectorAll(".fx-em"), carte);
    themes();
  }
  var plan = false;
  try {
    new MutationObserver(function () { if (plan) return; plan = true; setTimeout(function () { plan = false; try { passe(); } catch (e) {} }, 60); })
      .observe(document.body, { childList: true, subtree: true });
  } catch (e) {}
  passe();
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-lecons-plus.js",e);}

try{
/* ---- diisoo-universel.js ---- */
/* diisoo-universel.js v1 : compatibilite petits ecrans (<=700px de haut), polices minimales */
(function () {
  "use strict";
  var st = document.createElement("style");
  st.textContent =
    ".lvl-sub{font-size:12px!important}" +
    "@media (max-height:700px){" +
    "#xh-hub{gap:5px!important}#xh-hub .xh-s,#xh-hub h2{display:none!important}" +
    "#xh-hub button{min-height:46px!important;padding:5px 9px!important}#xh-hub .xh-big{min-height:52px!important}" +
    "#xh-hub .xh-i{font-size:20px!important}#xh-hub .xh-d{font-size:11.5px!important;margin-top:0!important}" +
    ".fx-em{padding:10px!important}.fx-em>.flex.justify-between.items-start>p:first-child{font-size:20px!important}" +
    ".fx-em .dl-plus{min-height:36px!important}.fx-em>div[data-em],.fx-em:before{font-size:30px!important}" +
    ".lvl-btn{min-height:54px!important;padding:6px 12px!important}.lvl-picker{gap:6px!important}" +
    "body.dnav-on [role=main]{padding-top:0!important;padding-bottom:0!important}" +
    "}" +
    "@media (max-height:600px){body.dnav-on{padding-top:48px!important}.fx-em{padding:8px!important}.lvl-btn{min-height:48px!important}}";
  document.head.appendChild(st);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-universel.js",e);}

try{
/* ---- diisoo-arrivee.js ---- */
/* diisoo-arrivee.js v2 : arrivee par lien (?source=tiktok) = mini-lecon d'1 minute. Par defaut : entretien visa. Avec &mini=wolof : Wolof > Anglais #2 (Nanga def, Jerejef, Ndank ndank). &revoir=1 force l'affichage. */
(function () {
  "use strict";
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var q = {};
  try { new URLSearchParams(location.search).forEach(function (v, k) { q[k] = v; }); } catch (e) {}
  var src = String(q.source || q.utm_source || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 24);
  if (!src) return;
  var MODE = String(q.mini || "").toLowerCase() === "wolof" ? "wo" : "visa";
  var CLE_VU = MODE === "wo" ? "diisoo_arrivee_vu_wo" : "diisoo_arrivee_vu";
  ecrire("diisoo_source", src);
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  setTimeout(function () { noter("arrivee", src); }, 3000);
  if (lire(CLE_VU) === "1" && q.mini !== "1" && q.revoir !== "1") return;

  var QUESTION = "Why do you want to study in Canada?";
  var MODELE = "I want to study in Canada because I want to improve my skills.";
  var st = document.createElement("style");
  st.textContent =
    "#dar{position:fixed;inset:0;z-index:99990;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px 20px 24px;font-family:inherit;text-align:center}" +
    "#dar .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#dar h1{font-size:24px;font-weight:800;line-height:1.2;margin:0}" +
    "#dar .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#dar .r{min-height:62px;font-size:17px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#dar button{border:0;border-radius:18px;font-weight:800;min-height:52px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#dar .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}" +
    "#dar .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}" +
    "#dar .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#dar .m{width:92px;height:92px;border-radius:50%;max-width:92px;padding:0;font-size:36px;background:#E1693F;color:#fff;box-shadow:0 0 0 0 rgba(225,105,63,.6)}" +
    "#dar .m.on{animation:darp 1s infinite}@keyframes darp{70%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#dar .d{font-size:12px;color:#8C8064;max-width:320px;line-height:1.35}" +
    "#dar .ok{color:#25D366}#dar .or{color:#FFAA3C}" +
    "#dar .wo{font-size:34px;font-weight:800;line-height:1.15;color:#E1693F;background:#F6F1E7;border-radius:20px;padding:18px 20px;max-width:320px;width:100%;box-sizing:border-box}" +
    "#dar .en{min-height:44px;font-size:26px;font-weight:800;color:#6FA8FF;max-width:320px}" +
    "#dar .li{font-size:19px;font-weight:700;line-height:1.5;max-width:320px}" +
    "#dar .li b{color:#E1693F}";
  document.head.appendChild(st);

  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }
  function fermer() { var e = document.getElementById("dar"); if (e) e.remove(); ecrire(CLE_VU, "1"); }
  var MOTS = [
    { wo: "Nanga def ?", say: "Nanga def", en: "How are you?", cle: "how" },
    { wo: "Jërëjëf", say: "Jërëjëf", en: "Thank you", cle: "thank" },
    { wo: "Ndank ndank", say: "Ndank ndank", en: "Slowly", cle: "slow" }
  ];
  function ouvrirWolof() {
    if (document.getElementById("dar")) return;
    var o = document.createElement("div"); o.id = "dar";
    document.body.appendChild(o);
    var i = 0, enCours = false;
    function dire(t, l, r) { try { if (typeof speak === "function") return speak(t, l, r); } catch (e) {} }
    function etape() {
      var m = MOTS[i];
      o.innerHTML =
        '<div class="k">Wolof &gt; Anglais #2 · mot ' + (i + 1) + ' sur 3</div>' +
        '<h1>Écoute, puis dis-le en anglais</h1>' +
        '<div class="wo" id="dw-wo">' + m.wo + '</div>' +
        '<button class="b2" id="dw-ec" type="button">🔊 Écouter en wolof</button>' +
        '<button class="b1" id="dw-voir" type="button">Voir l\'anglais</button>' +
        '<div class="en" id="dw-en"></div>' +
        '<button class="m" id="dw-mic" type="button" aria-label="Répéter" style="display:none">🎙️</button>' +
        '<div class="r" id="dw-r"></div>' +
        '<button class="b1" id="dw-suite" type="button" style="display:none">' + (i < 2 ? "Mot suivant" : "Terminer") + '</button>' +
        '<button class="b3" id="dw-pass" type="button">Passer</button>';
      var en = document.getElementById("dw-en"), r = document.getElementById("dw-r"), mic = document.getElementById("dw-mic"), suite = document.getElementById("dw-suite"), voir = document.getElementById("dw-voir");
      document.getElementById("dw-ec").onclick = function () { dire(m.say, "wo", 0.8); };
      document.getElementById("dw-pass").onclick = function () { noter("mini_wo_passer", src + ":" + (i + 1)); fermer(); };
      voir.onclick = function () {
        voir.style.display = "none";
        en.textContent = "= " + m.en;
        mic.style.display = "block"; suite.style.display = "block";
        r.textContent = "Touche le micro et répète : " + m.en;
        noter("mini_wo_mot", src + ":" + (i + 1));
        dire(m.en, "en-US", 0.9);
      };
      suite.onclick = function () { i++; if (i < MOTS.length) etape(); else fin(); };
      mic.onclick = function () {
        if (enCours) return;
        if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici. Continue."; return; }
        enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
        var h = null;
        try { h = startListening("en-US", 6000, false); } catch (e) { h = null; }
        Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
          enCours = false; mic.classList.remove("on");
          var t = res && res.text ? String(res.text).trim() : "";
          if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
          if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
          var bon = t.toLowerCase().indexOf(m.cle) >= 0;
          r.innerHTML = '<span class="' + (bon ? "ok" : "or") + '">' + (bon ? "Bien joué !" : "Presque, réessaie.") + '</span><br>« ' + t.replace(/</g, "&lt;") + ' »';
          noter("mini_wo_reponse", src + ":" + (i + 1));
        }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
      };
      setTimeout(function () { dire(m.say, "wo", 0.8); }, 600);
    }
    function fin() {
      noter("mini_wo_fin", src);
      var lien = "https://diisoo.sn/?source=whatsapp&mini=wolof";
      var txt = "Tu sais dire « Nanga def » en anglais ? Essaie sur Diisoo, c'est gratuit : " + lien;
      o.innerHTML =
        '<div class="k">Bravo</div>' +
        '<h1>3 mots wolof, 3 mots anglais</h1>' +
        '<div class="li"><b>Nanga def ?</b> = How are you?<br><b>Jërëjëf</b> = Thank you<br><b>Ndank ndank</b> = Slowly</div>' +
        '<button class="b1" id="dw-go" type="button">Continuer sur Diisoo</button>' +
        '<button class="b2" id="dw-wa" type="button">Envoyer à un ami (WhatsApp)</button>';
      document.getElementById("dw-go").onclick = function () { fermer(); };
      document.getElementById("dw-wa").onclick = function () { noter("mini_wo_partage", src); try { window.open("https://wa.me/?text=" + encodeURIComponent(txt), "_blank"); } catch (e) {} };
    }
    noter("mini_wo_vue", src);
    etape();
  }
  function ouvrir() {
    if (MODE === "wo") return ouvrirWolof();
    if (document.getElementById("dar")) return;
    var o = document.createElement("div"); o.id = "dar";
    o.innerHTML =
      '<div class="k">Entretien visa · 1 minute</div>' +
      '<h1>Écoute la question, réponds à voix haute</h1>' +
      '<div class="q" id="dar-q">' + QUESTION + '</div>' +
      '<button class="b2" id="dar-ec" type="button">🔊 Écouter la question</button>' +
      '<button class="m" id="dar-mic" type="button" aria-label="Parler">🎙️</button>' +
      '<div class="r" id="dar-r">Touche le micro et réponds en anglais.</div>' +
      '<div id="dar-fin" style="display:none;width:100%;max-width:320px;flex-direction:column;gap:8px;align-items:center">' +
      '<button class="b2" id="dar-mod" type="button">🔊 Écouter une réponse modèle</button>' +
      '<button class="b1" id="dar-visa" type="button">Continuer l\'entretien visa</button>' +
      '<button class="b2" id="dar-ex" type="button">Voir tous les examens</button></div>' +
      '<button class="b3" id="dar-pass" type="button">Passer</button>' +
      '<div class="d">Préparation indépendante. Diisoo n\'est pas affilié aux organismes d\'examen.</div>';
    document.body.appendChild(o);
    var r = document.getElementById("dar-r"), mic = document.getElementById("dar-mic"), fin = document.getElementById("dar-fin");
    document.getElementById("dar-ec").onclick = function () { parler(QUESTION); };
    document.getElementById("dar-mod").onclick = function () { parler(MODELE); };
    document.getElementById("dar-pass").onclick = function () { noter("mini_passer", src); fermer(); };
    document.getElementById("dar-visa").onclick = function () { noter("mini_visa", src); choisir("visa"); };
    document.getElementById("dar-ex").onclick = function () { noter("mini_examens", src); choisir("examens"); };
    var enCours = false;
    mic.onclick = function () {
      if (enCours) return;
      if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici. Continue avec les examens."; fin.style.display = "flex"; return; }
      enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
      var h = null;
      try { h = startListening("en-US", 7000, false); } catch (e) { h = null; }
      Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
        enCours = false; mic.classList.remove("on");
        var t = res && res.text ? String(res.text).trim() : "";
        if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; fin.style.display = "flex"; return; }
        if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
        var n = t.split(/\s+/).length;
        r.innerHTML = '<span class="' + (n >= 4 ? "ok" : "or") + '">' + (n >= 4 ? "Bien joué !" : "Essaie une phrase plus longue.") + '</span><br>« ' + t.replace(/</g, "&lt;") + ' »';
        noter("mini_reponse", src);
        if (n >= 4) fin.style.display = "flex";
      }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; fin.style.display = "flex"; });
    };
    noter("mini_vue", src);
    setTimeout(function () { parler(QUESTION); }, 800);
  }
  function visible(id) { var d = document.getElementById(id); return !!(d && !d.classList.contains("hidden") && d.offsetParent); }
  function agir(intent) {
    if (intent === "visa") { try { generalThemeId = "visa"; openGeneralModule(); } catch (e) {} }
    else if (intent === "examens") { try { startTestSimulation(); } catch (e) {} }
  }
  // Apres l'inscription : si le visiteur avait choisi une suite, on l'y emmene une seule fois.
  var tentatives = 0;
  var suite = setInterval(function () {
    var it = lire("diisoo_arrivee_suite");
    if (!it || ++tentatives > 900) { clearInterval(suite); return; }
    if (visible("screen-dashboard") && !document.getElementById("dar")) { ecrire("diisoo_arrivee_suite", ""); clearInterval(suite); agir(it); }
  }, 1000);
  function choisir(intent) {
    fermer();
    if (visible("screen-dashboard")) agir(intent); else ecrire("diisoo_arrivee_suite", intent);
  }
  function demarrer() { setTimeout(ouvrir, 500); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer); else demarrer();
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-arrivee.js",e);}

try{
/* ---- diisoo-question-jour.js ---- */
/* diisoo-question-jour.js v1 : carte "Question du jour" (entretien visa, examens, business) + serie de jours */
(function () {
  "use strict";
  var Q = [
    ["Why do you want to study in Canada?", "I want to study in Canada because I want to improve my skills."],
    ["What is your name and where are you from?", "My name is Awa and I am from Senegal."],
    ["What do you do for a living?", "I work in a travel agency in Thies."],
    ["Why do you want to visit France?", "I want to visit France to see my family and discover the country."],
    ["How long will you stay?", "I will stay for two weeks."],
    ["Who will pay for your trip?", "I will pay for the trip myself."],
    ["Do you have family in the country you want to visit?", "Yes, I have a cousin who lives there."],
    ["What is the purpose of your visit?", "The purpose of my visit is tourism."],
    ["Where will you stay?", "I will stay at a hotel in the city center."],
    ["Do you have a return ticket?", "Yes, I have a return ticket for the same month."],
    ["Do you have a job in your country?", "Yes, I have a job and my family is in Senegal."],
    ["Are you married?", "Yes, I am married and I have two children."],
    ["Why should we give you a visa?", "You should give me a visa because I will come back to my family and my job."],
    ["What will you study?", "I will study business management."],
    ["Why did you choose this university?", "I chose this university because it has a good program."],
    ["How will you pay for your studies?", "My family will pay for my studies."],
    ["What are your plans after your studies?", "After my studies, I will come back to Senegal and start my business."],
    ["Have you travelled abroad before?", "Yes, I travelled to Gambia last year."],
    ["Tell me about your job.", "I work in a travel agency. I help customers book flights and hotels."],
    ["How is your English?", "My English is good and I practise every day."],
    ["Why do you want to learn English?", "I want to learn English for my studies and my work."],
    ["Can you describe your family?", "I have a big family. I live with my parents and my two sisters."],
    ["What do you do in your free time?", "In my free time, I like football and music."],
    ["Tell me about your hometown.", "I come from Thies. It is a busy city near Dakar."],
    ["What is your favourite food?", "My favourite food is chicken with rice."],
    ["What time do you get up?", "I get up at six o'clock every morning."],
    ["Can you introduce your business?", "I sell clothes and I want to grow my business."],
    ["How much does this cost?", "This costs ten thousand francs."],
    ["Can you give me a discount?", "Can you give me a better price, please?"],
    ["Where is the nearest bank?", "The bank is next to the market, on the left."]
  ];
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function jour(dec) { var d = new Date(); d.setDate(d.getDate() + (dec || 0)); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function idx() { var d = new Date(); var n = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 0, 1)) / 86400000); return ((n % Q.length) + Q.length) % Q.length; }
  function etat() { var e; try { e = JSON.parse(lire("diisoo_qj") || "{}"); } catch (x) { e = {}; } return { last: e.last || "", serie: e.serie || 0 }; }
  function serieActive() { var e = etat(); return (e.last === jour(0) || e.last === jour(-1)) ? e.serie : 0; }
  function faitAujourdhui() { return etat().last === jour(0); }

  var st = document.createElement("style");
  st.textContent =
    "#dqj{order:3;display:flex;align-items:center;gap:10px;width:100%;min-height:50px;padding:6px 14px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;text-align:left}" +
    "#dqj .a{font-size:22px}#dqj .t{flex:1;font-size:14.5px;font-weight:800;line-height:1.2}#dqj .t small{display:block;font-size:12px;font-weight:600;color:#A69C86}" +
    "#dqj .s{font-size:13px;font-weight:800;color:#FFAA3C;white-space:nowrap}#dqj.ok{border-color:#25D366}#dqj.ok .s{color:#25D366}" +
    "@media (max-height:700px){#screen-dashboard:not(.hidden) .grid.grid-cols-2{grid-template-rows:repeat(2,142px)!important}}" +
    "#dqo{position:fixed;inset:0;z-index:99991;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px;text-align:center}" +
    "#dqo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#dqo .q{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;font-size:20px;font-weight:800;line-height:1.25;max-width:320px}" +
    "#dqo .r{min-height:62px;font-size:17px;font-weight:700;line-height:1.3;max-width:320px}" +
    "#dqo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:320px}" +
    "#dqo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#dqo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#dqo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#dqo .m{width:88px;height:88px;border-radius:50%;max-width:88px;padding:0;font-size:34px;background:#E1693F;color:#fff}" +
    "#dqo .m.on{animation:dqp 1s infinite}@keyframes dqp{0%{box-shadow:0 0 0 0 rgba(225,105,63,.6)}100%{box-shadow:0 0 0 26px rgba(225,105,63,0)}}" +
    "#dqo .ok{color:#25D366}#dqo .or{color:#FFAA3C}";
  document.head.appendChild(st);

  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }
  function ouvrir() {
    if (document.getElementById("dqo")) return;
    var i = idx(), qq = Q[i];
    var o = document.createElement("div"); o.id = "dqo";
    o.innerHTML =
      '<div class="k">Question du jour · ' + (i + 1) + '/' + Q.length + '</div>' +
      '<div class="q">' + qq[0] + '</div>' +
      '<button class="b2" id="dqo-ec" type="button">🔊 Écouter la question</button>' +
      '<button class="m" id="dqo-mic" type="button" aria-label="Parler">🎙️</button>' +
      '<div class="r" id="dqo-r">Touche le micro et réponds en anglais.</div>' +
      '<div id="dqo-fin" style="display:none;width:100%;flex-direction:column;gap:8px;align-items:center">' +
      '<button class="b2" id="dqo-mod" type="button">🔊 Écouter une réponse modèle</button>' +
      '<button class="b1" id="dqo-sh" type="button">Partager sur WhatsApp</button></div>' +
      '<button class="b3" id="dqo-x" type="button">Fermer</button>';
    document.body.appendChild(o);
    var r = document.getElementById("dqo-r"), mic = document.getElementById("dqo-mic"), fin = document.getElementById("dqo-fin");
    document.getElementById("dqo-ec").onclick = function () { parler(qq[0]); };
    document.getElementById("dqo-mod").onclick = function () { parler(qq[1]); };
    document.getElementById("dqo-x").onclick = function () { o.remove(); majCarte(); };
    document.getElementById("dqo-sh").onclick = function () {
      var txt = "Ma question d'entretien du jour sur Diisoo : « " + qq[0] + " ». Essaie, c'est gratuit : https://diisoo.sn/?source=whatsapp";
      noter("qj_partage");
      try { if (navigator.share) { navigator.share({ text: txt }); return; } } catch (e) {}
      window.open("https://wa.me/?text=" + encodeURIComponent(txt), "_blank");
    };
    var enCours = false;
    mic.onclick = function () {
      if (enCours) return;
      if (typeof startListening !== "function") { r.textContent = "Ton micro n'est pas disponible ici."; return; }
      enCours = true; mic.classList.add("on"); r.textContent = "Je t'écoute...";
      var h = null; try { h = startListening("en-US", 7000, false); } catch (e) { h = null; }
      Promise.resolve(h && h.promise ? h.promise : h).then(function (res) {
        enCours = false; mic.classList.remove("on");
        var t = res && res.text ? String(res.text).trim() : "";
        if (res && (res.unsupported || (res.error && !t))) { r.textContent = "Micro bloqué. Autorise-le dans le navigateur, puis réessaie."; return; }
        if (!t) { r.innerHTML = '<span class="or">Je n\'ai rien entendu.</span> Rapproche le téléphone et réessaie.'; return; }
        var n = t.split(/\s+/).length;
        if (n < 3) { r.innerHTML = '<span class="or">Essaie une phrase plus longue.</span><br>« ' + t.replace(/</g, "&lt;") + ' »'; return; }
        var e = etat(), s = e.serie;
        if (e.last !== jour(0)) { s = (e.last === jour(-1)) ? e.serie + 1 : 1; ecrire("diisoo_qj", JSON.stringify({ last: jour(0), serie: s })); }
        r.innerHTML = '<span class="ok">Bravo ! Série : ' + s + ' jour' + (s > 1 ? 's' : '') + '</span><br>« ' + t.replace(/</g, "&lt;") + ' »';
        fin.style.display = "flex"; noter("qj_reponse", String(s)); majCarte();
      }).catch(function () { enCours = false; mic.classList.remove("on"); r.textContent = "Réessaie dans un instant."; });
    };
    noter("qj_vue");
    setTimeout(function () { parler(qq[0]); }, 700);
  }
  function majCarte() {
    var c = document.getElementById("dqj"); if (!c) return;
    var fait = faitAujourdhui(), s = serieActive();
    c.className = fait ? "ok" : "";
    c.innerHTML = '<span class="a">' + (fait ? "✅" : "🎯") + '</span><span class="t">Question du jour<small>' + (fait ? "Bravo, à demain !" : "Réponds à voix haute, 1 minute") + '</small></span><span class="s">' + (s ? "🔥 " + s : "") + '</span>';
  }
  function monter() {
    var d = document.getElementById("screen-dashboard"); if (!d) return;
    if (document.getElementById("dqj")) return;
    var rev = document.getElementById("revision-card");
    if (!rev || !rev.parentNode) return;
    var b = document.createElement("button"); b.type = "button"; b.id = "dqj";
    b.onclick = ouvrir;
    rev.parentNode.insertBefore(b, rev.nextSibling);
    majCarte();
  }
  var essais = 0;
  (function boucle() { try { monter(); } catch (e) {} if (++essais < 40) setTimeout(boucle, 750); })();
  try { new MutationObserver(function () { if (!document.getElementById("dqj")) { try { monter(); } catch (e) {} } }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-question-jour.js",e);}

try{
/* ---- diisoo-quete.js ---- */
/* diisoo-quete.js v1 : Quete du jour (3 missions) + coffre a recompense variable + mot du jour wolof/anglais */
(function () {
  "use strict";
  /* Mots du jour : [wolof, francais, anglais, phrase anglaise d'exemple] */
  var MOTS = [
    ["Jërëjëf", "merci", "thank you", "Thank you for your help."],
    ["Ndank", "doucement", "slowly", "Please speak slowly."],
    ["Xaalis", "argent", "money", "I need money for the ticket."],
    ["Jaay", "vendre", "to sell", "I sell clothes at the market."],
    ["Jënd", "acheter", "to buy", "I want to buy this bag."],
    ["Ndox", "eau", "water", "Can I have some water, please?"],
    ["Mburu", "pain", "bread", "I eat bread in the morning."],
    ["Ceeb", "riz", "rice", "We eat rice for lunch."],
    ["Nelaw", "dormir", "to sleep", "I go to sleep at ten."],
    ["Liggéey", "travailler", "to work", "I work in a travel agency."],
    ["Jàng", "apprendre, étudier", "to learn", "I learn English every day."],
    ["Dégg", "entendre, comprendre", "to hear", "I can't hear you."],
    ["Wax", "parler", "to speak", "Can you speak English?"],
    ["Xam", "savoir, connaître", "to know", "I know this city well."],
    ["Bëgg", "vouloir, aimer", "to want", "I want to visit France."],
    ["Baax", "bon", "good", "This is a good price."],
    ["Réew", "pays", "country", "I love my country."],
    ["Kër", "maison", "house", "My house is in Thiès."],
    ["Mbokk", "parent, proche", "relative", "I have a relative in Paris."],
    ["Xale", "enfant", "child", "My child goes to school."],
    ["Tay", "aujourd'hui", "today", "I am busy today."],
    ["Suba", "demain", "tomorrow", "I will call you tomorrow."],
    ["Démb", "hier", "yesterday", "I travelled yesterday."],
    ["Guddi", "nuit", "night", "The bus leaves at night."],
    ["Bés", "jour", "day", "Have a nice day."],
    ["Ñaata", "combien", "how much", "How much is this?"],
    ["Fan", "où", "where", "Where is the bank?"],
    ["Naka", "comment", "how", "How do you say this in English?"],
    ["Lan", "quoi, quel", "what", "What is your name?"],
    ["Waaw", "oui", "yes", "Yes, of course."],
    ["Déedéet", "non", "no", "No, thank you."],
    ["Teranga", "hospitalité", "hospitality", "Senegal is famous for its hospitality."],
    ["Njaay", "commerce", "trade, business", "My business is growing."],
    ["Tukki", "voyage", "trip, journey", "I am preparing my trip."],
    ["Bataaxal", "lettre, message", "letter", "I have a letter for you."],
    ["Paspoor", "passeport", "passport", "This is my passport."],
    ["Njaboot", "famille", "family", "My family lives in Senegal."],
    ["Liggéeykat", "travailleur", "worker", "He is a good worker."],
    ["Dem", "partir, aller", "to go", "I go to Dakar every week."]
  ];
  /* Phrases rares gagnees dans les coffres : [francais, anglais] */
  var RARES = [
    ["Pouvez-vous répéter, s'il vous plaît ?", "Could you repeat that, please?"],
    ["Je n'ai pas compris.", "I didn't catch that."],
    ["Parlez plus lentement, s'il vous plaît.", "Could you speak more slowly, please?"],
    ["Quel est votre meilleur prix ?", "What is your best price?"],
    ["Je reviendrai demain.", "I will come back tomorrow."],
    ["Enchanté de faire votre connaissance.", "Nice to meet you."],
    ["Où se trouve la gare routière ?", "Where is the bus station?"],
    ["Je voudrais réserver une chambre.", "I would like to book a room."],
    ["Combien de temps dure le voyage ?", "How long does the journey take?"],
    ["Je suis ici pour affaires.", "I am here on business."],
    ["Pouvez-vous m'aider ?", "Can you help me, please?"],
    ["Je cherche un hôtel pas cher.", "I am looking for a cheap hotel."]
  ];
  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function jour(d) { var x = new Date(); x.setDate(x.getDate() + (d || 0)); return x.getFullYear() + "-" + ("0" + (x.getMonth() + 1)).slice(-2) + "-" + ("0" + x.getDate()).slice(-2); }
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  function json(k, def) { try { var v = JSON.parse(lire(k) || "null"); return v == null ? def : v; } catch (e) { return def; } }
  function etat() {
    var e = json("diisoo_quete", {});
    if (e.date !== jour(0)) { e = { date: jour(0), mot: false, coffre: false, deb: false, rec: "" }; ecrire("diisoo_quete", JSON.stringify(e)); }
    return e;
  }
  function sauver(e) { ecrire("diisoo_quete", JSON.stringify(e)); }
  function idxMot() { var d = new Date(); var n = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 0, 1)) / 86400000); return ((n % MOTS.length) + MOTS.length) % MOTS.length; }
  function m1() { var g = json("diisoo_goal", {}); return g.date === jour(0) && (g.done || 0) >= 3; }
  function m2() { var q = json("diisoo_qj", {}); return q.last === jour(0); }
  function m3() { return !!etat().mot; }
  function faites() { return (m1() ? 1 : 0) + (m2() ? 1 : 0) + (m3() ? 1 : 0); }
  function parler(t) { try { if (typeof speak === "function") return speak(t, "en-US", 0.9); } catch (e) {} }
  function esc(s) { return String(s).replace(/</g, "&lt;"); }

  var st = document.createElement("style");
  st.textContent =
    "#dqq{order:3;display:flex;align-items:center;gap:10px;width:100%;min-height:54px;padding:6px 14px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;text-align:left}" +
    "#dqq .a{font-size:24px}#dqq .t{flex:1;font-size:14.5px;font-weight:800;line-height:1.2}#dqq .t small{display:block;font-size:12px;font-weight:600;color:#A69C86}" +
    "#dqq .p{display:flex;gap:4px}#dqq .p i{width:12px;height:12px;border-radius:50%;background:#2A3454;display:block}#dqq .p i.on{background:#25D366}" +
    "#dqq.pret{border-color:#FFAA3C;animation:dqqp 1.6s infinite}@keyframes dqqp{0%{box-shadow:0 0 0 0 rgba(255,170,60,.5)}100%{box-shadow:0 0 0 14px rgba(255,170,60,0)}}" +
    "#dqq.ouvert{border-color:#25D366}" +
    "#dqqo{position:fixed;inset:0;z-index:99992;background:linear-gradient(180deg,#0B0F1C,#1B1426);color:#F6F1E7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;text-align:center;overflow:auto}" +
    "#dqqo .k{font-size:12.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#F0906B}" +
    "#dqqo .l{width:100%;max-width:330px;display:flex;flex-direction:column;gap:8px}" +
    "#dqqo .mi{display:flex;align-items:center;gap:10px;text-align:left;border:1px solid #2A3454;background:#141A2B;border-radius:14px;padding:10px 12px;font-size:15px;font-weight:700;min-height:48px}" +
    "#dqqo .mi.ok{border-color:#25D366}#dqqo .mi .c{font-size:20px}" +
    "#dqqo .w{background:#F6F1E7;color:#141828;border-radius:20px;padding:14px 18px;max-width:330px;width:100%}" +
    "#dqqo .w b{display:block;font-size:30px;line-height:1.1}#dqqo .w span{display:block;font-size:15px;margin-top:4px;font-weight:700}" +
    "#dqqo .w em{display:block;font-style:normal;font-size:14px;margin-top:8px;color:#5a5f73}" +
    "#dqqo button{border:0;border-radius:18px;font-weight:800;min-height:50px;padding:10px 18px;font-size:16px;width:100%;max-width:330px}" +
    "#dqqo .b1{background:linear-gradient(135deg,#C2542D,#E1693F);color:#fff}#dqqo .b2{background:#141A2B;color:#F6F1E7;border:1px solid #2A3454}#dqqo .b3{background:transparent;color:#A69C86;min-height:40px;font-size:14px}" +
    "#dqqo .cf{font-size:84px;line-height:1}#dqqo .cf.sec{animation:dqqs .5s infinite alternate}@keyframes dqqs{0%{transform:rotate(-8deg)}100%{transform:rotate(8deg)}}" +
    "#dqqo .rec{font-size:19px;font-weight:800;line-height:1.3;max-width:320px}#dqqo .ok{color:#25D366}";
  document.head.appendChild(st);

  function majCarte() {
    var c = document.getElementById("dqq"); if (!c) return;
    var n = faites(), e = etat(), pret = n >= 3 && !e.coffre;
    c.className = pret ? "pret" : (e.coffre ? "ouvert" : "");
    var sous = e.coffre ? "Coffre ouvert, à demain !" : (pret ? "Ton coffre t'attend, ouvre-le" : (3 - n) + " mission" + (3 - n > 1 ? "s" : "") + " pour ouvrir le coffre");
    c.innerHTML = '<span class="a">' + (e.coffre ? "✅" : "🎁") + '</span><span class="t">Quête du jour<small>' + sous + '</small></span><span class="p"><i class="' + (m1() ? "on" : "") + '"></i><i class="' + (m2() ? "on" : "") + '"></i><i class="' + (m3() ? "on" : "") + '"></i></span>';
    if (pret && !e.deb) { e.deb = true; sauver(e); try { if (typeof toast === "function") toast("🎁 Coffre débloqué ! Ouvre-le depuis l'accueil."); } catch (x) {} noter("quete_coffre_pret"); }
  }

  function tirer() {
    var r = Math.random() * 100;
    if (r < 55) return { t: "xp", v: 15 };
    if (r < 80) return { t: "xp", v: 30 };
    if (r < 95) return { t: "phrase" };
    return { t: "gel" };
  }
  function appliquer(rw) {
    var txt = "";
    if (rw.t === "xp") {
      try { if (typeof addXP === "function") addXP(rw.v); } catch (e) {}
      txt = "<span class='ok'>+" + rw.v + " XP</span> ajoutés à ton niveau";
    } else if (rw.t === "gel") {
      var s = json("diisoo_streak", null);
      if (s && typeof s === "object") { s.gel = 1; ecrire("diisoo_streak", JSON.stringify(s)); }
      txt = "<span class='ok'>❄️ Gel de série</span> : un jour manqué sera pardonné";
    } else {
      var vus = json("diisoo_rares", []), libres = [];
      for (var i = 0; i < RARES.length; i++) if (vus.indexOf(i) < 0) libres.push(i);
      if (!libres.length) { try { if (typeof addXP === "function") addXP(30); } catch (e) {} rw = { t: "xp", v: 30 }; txt = "<span class='ok'>+30 XP</span> (tu as toutes les phrases rares !)"; }
      else {
        var k = libres[Math.floor(Math.random() * libres.length)]; vus.push(k); ecrire("diisoo_rares", JSON.stringify(vus));
        rw.k = k; txt = "<span class='ok'>💎 Phrase rare</span> (" + vus.length + "/" + RARES.length + ")<br>« " + esc(RARES[k][1]) + " »<br><small>" + esc(RARES[k][0]) + "</small>";
      }
    }
    return { rw: rw, txt: txt };
  }

  function ouvrir() {
    if (document.getElementById("dqqo")) return;
    var o = document.createElement("div"); o.id = "dqqo"; document.body.appendChild(o);
    function fermer() { o.remove(); majCarte(); }
    function vueMissions() {
      var e = etat(), n = faites(), mm = MOTS[idxMot()];
      o.innerHTML =
        '<div class="k">Quête du jour · ' + n + '/3</div>' +
        '<div class="l">' +
        '<div class="mi ' + (m1() ? "ok" : "") + '"><span class="c">' + (m1() ? "✅" : "📘") + '</span>Fais 3 exercices dans une leçon</div>' +
        '<div class="mi ' + (m2() ? "ok" : "") + '"><span class="c">' + (m2() ? "✅" : "🎙️") + '</span>Réponds à la question du jour</div>' +
        '<div class="mi ' + (m3() ? "ok" : "") + '"><span class="c">' + (m3() ? "✅" : "💡") + '</span>Apprends le mot du jour</div></div>' +
        '<div class="w"><b>' + esc(mm[0]) + '</b><span>' + esc(mm[1]) + ' = <u>' + esc(mm[2]) + '</u></span><em>' + esc(mm[3]) + '</em></div>' +
        '<button class="b2" id="dqq-ec" type="button">🔊 Écouter en anglais</button>' +
        (m3() ? "" : '<button class="b1" id="dqq-ok" type="button">J\'ai appris ce mot</button>') +
        ((n >= 3 && !e.coffre) ? '<button class="b1" id="dqq-cf" type="button">🎁 Ouvrir mon coffre</button>' : "") +
        '<button class="b3" id="dqq-x" type="button">Fermer</button>';
      document.getElementById("dqq-x").onclick = fermer;
      document.getElementById("dqq-ec").onclick = function () { parler(mm[2] + ". " + mm[3]); };
      var ok = document.getElementById("dqq-ok");
      if (ok) ok.onclick = function () {
        var e2 = etat(); e2.mot = true; sauver(e2);
        var ap = json("diisoo_mots", []); if (ap.indexOf(idxMot()) < 0) { ap.push(idxMot()); ecrire("diisoo_mots", JSON.stringify(ap)); }
        noter("quete_mot", mm[0]); vueMissions();
      };
      var cf = document.getElementById("dqq-cf");
      if (cf) cf.onclick = vueCoffre;
    }
    function vueCoffre() {
      var e = etat(); if (e.coffre) { vueMissions(); return; }
      o.innerHTML = '<div class="k">Ton coffre du jour</div><div class="cf sec">🎁</div><div class="rec">Ouverture...</div>';
      setTimeout(function () {
        var e3 = etat(); if (e3.coffre) { vueMissions(); return; }
        var res = appliquer(tirer()); e3.coffre = true; e3.rec = res.rw.t; sauver(e3);
        try { if (typeof celebrate === "function") celebrate(); } catch (x) {}
        var mots = json("diisoo_mots", []).length;
        o.innerHTML = '<div class="k">Récompense</div><div class="cf">' + (res.rw.t === "phrase" ? "💎" : (res.rw.t === "gel" ? "❄️" : "⭐")) + '</div>' +
          '<div class="rec">' + res.txt + '</div>' +
          (res.rw.t === "phrase" && res.rw.k != null ? '<button class="b2" id="dqq-ph" type="button">🔊 Écouter la phrase</button>' : "") +
          '<div class="k">Mots appris : ' + mots + '</div>' +
          '<button class="b1" id="dqq-sh" type="button">Partager sur WhatsApp</button>' +
          '<button class="b3" id="dqq-x" type="button">Fermer</button>';
        document.getElementById("dqq-x").onclick = fermer;
        var ph = document.getElementById("dqq-ph"); if (ph) ph.onclick = function () { parler(RARES[res.rw.k][1]); };
        document.getElementById("dqq-sh").onclick = function () {
          var t = "J'ai ouvert mon coffre du jour sur Diisoo. Apprends l'anglais et le wolof gratuitement : https://diisoo.sn/?source=whatsapp";
          noter("quete_partage");
          try { if (navigator.share) { navigator.share({ text: t }); return; } } catch (x) {}
          window.open("https://wa.me/?text=" + encodeURIComponent(t), "_blank");
        };
        noter("quete_coffre_ouvert", res.rw.t); majCarte();
      }, 1100);
    }
    noter("quete_vue");
    if (faites() >= 3 && !etat().coffre) vueCoffre(); else vueMissions();
  }

  function monter() {
    var d = document.getElementById("screen-dashboard"); if (!d) return;
    if (document.getElementById("dqq")) return;
    var ref = document.getElementById("dqj") || document.getElementById("revision-card");
    if (!ref || !ref.parentNode) return;
    var b = document.createElement("button"); b.type = "button"; b.id = "dqq"; b.onclick = ouvrir;
    ref.parentNode.insertBefore(b, ref.nextSibling);
    majCarte();
  }
  var essais = 0;
  (function boucle() { try { monter(); } catch (e) {} if (++essais < 40) setTimeout(boucle, 750); })();
  try { new MutationObserver(function () { if (!document.getElementById("dqq")) { try { monter(); } catch (e) {} } }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  setInterval(function () { try { majCarte(); } catch (e) {} }, 3000);
  window.DiisooQuete = { ouvrir: ouvrir, faites: faites };
  if (/[?&]quete=1/.test(location.search)) setTimeout(ouvrir, 1200);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-quete.js",e);}

try{
/* ---- diisoo-aujourdhui.js ---- */
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

}catch(e){console.error("Diisoo : erreur dans diisoo-aujourdhui.js",e);}

try{
/* ---- diisoo-accueil2.js ---- */
/* diisoo-accueil2.js v1 : accueil plus compact (cartes moins hautes, sous-titres courts) et ecran Business sans grand vide en haut. Desactivable : ?accueil2=0 */
(function () {
  "use strict";
  if (window.DiisooAccueil2 || /[?&]accueil2=0/.test(location.search)) return;
  var st = document.createElement("style");
  st.textContent =
    "#screen-dashboard .grid.grid-cols-2>button{min-height:0!important;padding:12px 14px!important;display:flex;flex-direction:column;justify-content:flex-start;gap:2px}" +
    "#screen-dashboard .grid.grid-cols-2>button>*:first-child{font-size:30px!important;line-height:1.1!important;margin-bottom:2px!important}" +
    "#screen-dashboard .grid.grid-cols-2>button>*:empty{display:none!important}" +
    "#screen-dashboard .grid.grid-cols-2{height:auto!important;flex:none!important;grid-template-rows:auto!important;align-content:start}" +
    "#screen-dashboard p.text-center.leading-relaxed.text-\\[10px\\]{display:none!important}" +
    "html #screen-dashboard:not(.hidden)>div.space-y-3>.grid{grid-template-rows:repeat(2,128px)!important;gap:8px!important}" +
    "#screen-dashboard .grid.grid-cols-2>button *{line-height:1.25}" +
    "#screen-dashboard .grid.grid-cols-2>button h3{font-size:17px!important;line-height:1.2!important;margin:0!important}" +
    "#screen-dashboard .grid.grid-cols-2>button p{font-size:12.5px!important;line-height:1.3!important;margin:0!important;color:#A69C86}" +
    "body:has(#bizstep) .max-w-md.min-h-screen{padding-top:10px!important}" +
    "body:has(#bizstep) #screen-business{height:auto!important;margin-top:0!important}" +
    "";
  document.head.appendChild(st);
  var COURT = { "IELTS, TOEFL, TOEIC, Cambridge, Duolingo, PTE": "IELTS, TOEFL, TOEIC, visa..." };
  function maj() {
    var bs = document.querySelectorAll("#screen-dashboard .grid.grid-cols-2>button");
    for (var i = 0; i < bs.length; i++) {
      var all = bs[i].querySelectorAll("*");
      for (var j = 0; j < all.length; j++) {
        var el = all[j];
        if (el.children.length === 0) {
          var t = (el.textContent || "").trim();
          if (COURT[t]) el.textContent = COURT[t];
        }
      }
    }
  }
  var n = 0;
  (function boucle() { try { maj(); } catch (e) {} if (++n < 30) setTimeout(boucle, 800); })();
  window.DiisooAccueil2 = { maj: maj };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-accueil2.js",e);}

try{
/* ---- diisoo-diag.js ---- */
/* diisoo-diag.js v1 : page de test (?diag=1) pour verifier micro, voix, son et installation sur chaque telephone. */
(function () {
  "use strict";
  if (!/[?&]diag=1/.test(location.search) && location.hash !== "#diag") return;
  var R = {};
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function ua() { return navigator.userAgent || ""; }
  function modele() { var m = ua().match(/Android [^;]*;\s*([^)]*?)\s*(Build|\))/); return m ? m[1] : "inconnu"; }
  function chrome() { var m = ua().match(/(Chrome|SamsungBrowser|MiuiBrowser|HuaweiBrowser|UCBrowser|OPR|Firefox)\/([\d.]+)/); return m ? m[1] + " " + m[2].split(".")[0] : "inconnu"; }
  function android() { var m = ua().match(/Android ([\d.]+)/); return m ? m[1] : (/iPhone|iPad/.test(ua()) ? "iOS" : "inconnu"); }
  var box = document.createElement("div");
  box.id = "dii-diag";
  box.style.cssText = "position:fixed;inset:0;z-index:2147483000;background:#0B0F1C;color:#F6F1E7;overflow:auto;padding:14px 14px 40px;font:14px/1.45 Roboto,Arial,sans-serif";
  function btn(id, txt) { return '<button id="' + id + '" style="display:block;width:100%;margin:8px 0;padding:12px;border-radius:12px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-size:15px;font-weight:700">' + txt + "</button>"; }
  box.innerHTML = '<h2 style="margin:0 0 6px;font-size:20px">Test de ton téléphone</h2><p style="margin:0 0 10px;color:#A69C86">Touche chaque bouton, puis envoie le résultat.</p><div id="dd-info"></div>' +
    btn("dd-mic", "🎙️ Tester le micro") + btn("dd-voix", "🔊 Tester la voix anglaise") + btn("dd-son", "🎵 Tester le son") +
    '<pre id="dd-res" style="white-space:pre-wrap;background:#141A2B;border-radius:12px;padding:10px;margin:10px 0;font-size:13px"></pre>' +
    btn("dd-envoi", "📤 Envoyer le résultat par WhatsApp") + btn("dd-fermer", "⬅️ Retour à l’app");
  document.body.appendChild(box);
  function $(id) { return document.getElementById(id); }
  function rendre() {
    var l = [];
    Object.keys(R).forEach(function (k) { l.push(k + " : " + R[k]); });
    $("dd-res").textContent = l.join("\n");
  }
  function info() {
    R["Modèle"] = modele(); R["Android"] = android(); R["Navigateur"] = chrome();
    R["Écran"] = screen.width + "x" + screen.height + " (dpr " + (window.devicePixelRatio || 1) + ")";
    R["Installée"] = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) ? "oui" : "non (navigateur)";
    R["Internet"] = navigator.onLine ? "oui" : "non";
    R["Reconnaissance vocale"] = (window.SpeechRecognition || window.webkitSpeechRecognition) ? "disponible" : "NON DISPONIBLE";
    R["Synthèse vocale"] = ("speechSynthesis" in window) ? "disponible" : "NON DISPONIBLE";
    try { localStorage.setItem("dd", "1"); localStorage.removeItem("dd"); R["Stockage"] = "ok"; } catch (e) { R["Stockage"] = "BLOQUÉ"; }
    R["Service worker"] = ("serviceWorker" in navigator) ? "disponible" : "NON DISPONIBLE";
    if (window.caches && caches.keys) caches.keys().then(function (k) { R["Version app"] = k.join(", ") || "aucune"; rendre(); });
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) navigator.serviceWorker.getRegistration().then(function (r) { R["Service worker actif"] = r && r.active ? "oui" : "non"; rendre(); });
    if (window.speechSynthesis) { var v = speechSynthesis.getVoices(); R["Voix anglaises"] = v.filter(function (x) { return /^en/i.test(x.lang); }).length + " sur " + v.length; speechSynthesis.onvoiceschanged = function () { var w = speechSynthesis.getVoices(); R["Voix anglaises"] = w.filter(function (x) { return /^en/i.test(x.lang); }).length + " sur " + w.length; rendre(); }; }
    rendre();
  }
  $("dd-mic").onclick = function () {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { R["Test micro"] = "ÉCHEC : pas de reconnaissance vocale sur ce navigateur"; rendre(); return; }
    R["Test micro"] = "parle en anglais maintenant (5 s)..."; rendre();
    var r = new SR(), fini = false; r.lang = "en-US"; r.interimResults = true; r.maxAlternatives = 1;
    var t0 = Date.now(), vu = "";
    r.onresult = function (e) { vu = e.results[e.results.length - 1][0].transcript; R["Test micro"] = "entendu : « " + vu + " »"; rendre(); };
    r.onerror = function (e) { fini = true; R["Test micro"] = "ERREUR : " + e.error + (e.error === "not-allowed" ? " (autorise le micro dans les réglages)" : e.error === "network" ? " (pas d'Internet ou service vocal absent)" : ""); rendre(); };
    r.onend = function () { if (!fini && !vu) R["Test micro"] = "ÉCHEC : rien entendu en " + Math.round((Date.now() - t0) / 1000) + " s"; else if (!fini) R["Test micro"] = "OK · " + R["Test micro"]; rendre(); };
    try { r.start(); setTimeout(function () { try { r.stop(); } catch (e) {} }, 6000); } catch (e) { R["Test micro"] = "ERREUR : " + e.message; rendre(); }
  };
  $("dd-voix").onclick = function () {
    if (!window.speechSynthesis) { R["Test voix"] = "ÉCHEC : pas de synthèse vocale"; rendre(); return; }
    try {
      var u = new SpeechSynthesisUtterance("Hello, this is a voice test."); u.lang = "en-US";
      u.onstart = function () { R["Test voix"] = "lecture en cours : tu dois entendre une voix"; rendre(); };
      u.onend = function () { R["Test voix"] = "OK : lecture terminée (as-tu entendu ? oui / non)"; rendre(); };
      u.onerror = function (e) { R["Test voix"] = "ERREUR : " + (e.error || "inconnue"); rendre(); };
      speechSynthesis.cancel(); speechSynthesis.speak(u);
      setTimeout(function () { if (!R["Test voix"]) { R["Test voix"] = "ÉCHEC : aucune lecture démarrée"; rendre(); } }, 3000);
    } catch (e) { R["Test voix"] = "ERREUR : " + e.message; rendre(); }
  };
  $("dd-son").onclick = function () {
    try {
      var A = window.AudioContext || window.webkitAudioContext, c = new A(), o = c.createOscillator(), g = c.createGain();
      o.frequency.value = 660; g.gain.value = 0.2; o.connect(g); g.connect(c.destination); o.start(); setTimeout(function () { o.stop(); c.close(); R["Test son"] = "OK : tu as dû entendre un bip"; rendre(); }, 600);
    } catch (e) { R["Test son"] = "ERREUR : " + e.message; rendre(); }
  };
  $("dd-envoi").onclick = function () {
    var l = []; Object.keys(R).forEach(function (k) { l.push(k + " : " + R[k]); });
    window.open("https://wa.me/221772882109?text=" + encodeURIComponent("Test Diisoo\n" + l.join("\n")), "_blank");
  };
  $("dd-fermer").onclick = function () { location.href = location.pathname; };
  info();
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-diag.js",e);}

try{
/* ---- diisoo-ligue.js ---- */
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

}catch(e){console.error("Diisoo : erreur dans diisoo-ligue.js",e);}

try{
/* ---- diisoo-invite-moment.js ---- */
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

}catch(e){console.error("Diisoo : erreur dans diisoo-invite-moment.js",e);}

try{
/* ---- diisoo-ecoute.js ---- */
/* diisoo-ecoute.js v1 : Écoute par niveaux (remplace l'ancien entrainement de 12 questions)
   - 3 niveaux (Débutant, Intermédiaire, Avancé), séances de 8 questions tirées au hasard, les non vues d'abord
   - 2 écoutes maximum par question, puis question à choix ; le texte entendu s'affiche après la réponse
   - Niveau suivant débloqué à 6/8 ; XP par bonne réponse ; progression sauvegardée (diisoo_ecoute)
   Branche sur openListeningModule() existant (bouton « Écoute » du hub Examens). Desactivable : ?ecoute=0 */
(function () {
  "use strict";
  if (window.DiisooEcoute || /[?&]ecoute=0/.test(location.search)) return;
  function lire(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var TF = ["True", "False"];
  function tf(txt, st, vrai) { return [txt, "True or false? " + st, TF, vrai ? 0 : 1]; }

  var NIV = [
    { nom: "Débutant", ic: "🌱", rate: 0.82, q: [
      ["Attention please. The bus to Thiès will leave from platform two in ten minutes.", "Where does the bus leave from?", ["Platform one", "Platform two", "Platform three"], 1],
      ["Good morning. The doctor is ready to see you now. Please come to room five.", "Where should you go?", ["Room two", "Room five", "Room seven"], 1],
      ["The market closes at six o'clock today because of the holiday.", "What time does the market close today?", ["Five o'clock", "Six o'clock", "Seven o'clock"], 1],
      ["Excuse me, your flight to Paris is delayed. It will now leave at three thirty.", "What happened to the flight?", ["It is cancelled", "It is delayed", "It left early"], 1],
      ["Welcome to the class. Please sit down and open your books to page ten.", "What page should you open?", ["Page ten", "Page eleven", "Page twenty"], 0],
      ["We are sorry, the restaurant is full right now. Please wait fifteen minutes for a table.", "How long must you wait?", ["Five minutes", "Fifteen minutes", "Fifty minutes"], 1],
      ["Good morning. Fresh tomatoes are five hundred francs a kilo today. Onions are four hundred.", "How much are the tomatoes?", ["Four hundred francs", "Five hundred francs", "Six hundred francs"], 1],
      ["The rainy season starts next month. Farmers will plant groundnuts after the first rain.", "What will farmers plant?", ["Rice", "Millet", "Groundnuts"], 2],
      ["Hello. My name is Awa. I am twenty-five years old. I live in Thiès.", "Where does Awa live?", ["Dakar", "Thiès", "Saint-Louis"], 1],
      ["Please be quiet. The baby is sleeping.", "Why must you be quiet?", ["The baby is sleeping", "The class has started", "The shop is closed"], 0],
      ["The bus number twelve goes to the market. A ticket costs two hundred francs.", "How much is the ticket?", ["One hundred francs", "Two hundred francs", "Three hundred francs"], 1],
      ["I have two brothers and one sister. My sister is a teacher.", "What does his sister do?", ["She is a nurse", "She is a teacher", "She is a farmer"], 1],
      ["Today is Monday. The shop opens at eight and closes at five.", "When does the shop open?", ["At five", "At eight", "At nine"], 1],
      ["Excuse me, where is the pharmacy? It is next to the bank, on the left.", "Where is the pharmacy?", ["Next to the bank", "Next to the school", "Behind the market"], 0],
      ["I am hungry. I would like rice and fish, please.", "What does he want to eat?", ["Rice and fish", "Bread and eggs", "Chicken and chips"], 0],
      tf("My phone is new. I bought it last week.", "The phone is old.", false),
      ["I sell eggs and chickens. My farm is near Thiès, and I deliver to the market every Saturday.", "When does he deliver to the market?", ["Every Friday", "Every Saturday", "Every Sunday"], 1],
      ["Sorry, I cannot lower the price. But if you buy ten kilos, I can give you one kilo free.", "What do you get if you buy ten kilos?", ["A lower price", "One kilo free", "A free bag"], 1],
      ["Please remember to drink water. It is very hot in the field today.", "Why should you drink water?", ["It is hot", "It is late", "It is raining"], 0],
      ["Attention please. The truck with vegetables leaves for Dakar at six in the morning.", "What time does the truck leave?", ["At five", "At six", "At seven"], 1],
      ["Good evening. My name is Ibrahima. I am a taxi driver. I work every day except Sunday.", "When does he not work?", ["On Saturday", "On Sunday", "On Monday"], 1],
      ["Excuse me, is this seat free? Yes, please sit down.", "What does the person ask?", ["If the seat is free", "If the bus is late", "If the door is open"], 0],
      ["The water is cold, but the soup is hot. Be careful.", "What is hot?", ["The water", "The soup", "The rice"], 1],
      ["My birthday is in March. I will be thirty years old.", "How old will she be?", ["Twenty", "Thirty", "Forty"], 1],
      ["I need a ticket to Saint-Louis for tomorrow morning, please.", "When does he want to travel?", ["Tomorrow morning", "Tomorrow evening", "Today"], 0],
      tf("The school is near my house. I walk there every morning.", "He goes to school by bus.", false),
      ["Mama is cooking rice with chicken. Dinner will be ready at eight.", "What time is dinner?", ["At seven", "At eight", "At nine"], 1],
      ["Please turn off your phone. The film is starting.", "What must you do?", ["Turn off the phone", "Open the door", "Sit near the screen"], 0],
      ["I'm sorry, we don't have any more bread. Would you like biscuits?", "What does the shop offer?", ["Bread", "Biscuits", "Milk"], 1],
      ["It is a sunny day today, but tomorrow it will rain.", "What will the weather be tomorrow?", ["Sunny", "Rainy", "Windy"], 1]
    ] },
    { nom: "Intermédiaire", ic: "🌿", rate: 0.92, q: [
      ["Hi, this is Mr Sow from the travel agency. Your visa appointment is on Thursday at ten thirty. Please bring your passport and two photos.", "What should you bring?", ["Passport and two photos", "Passport and a letter", "Two photos and money"], 0],
      ["Good evening. I'd like a room for two nights, please. Certainly. Do you prefer a room with a sea view? Yes, if it isn't too expensive. It's thirty thousand francs a night.", "What does the guest want?", ["A room for two nights", "A table for two", "A taxi to the beach"], 0],
      ["The meeting has been moved from Tuesday to Wednesday because the manager is travelling. It will start at nine.", "Why was the meeting moved?", ["The manager is travelling", "The room is busy", "It is a holiday"], 0],
      ["If you want to open an account, you need an ID card, a proof of address and ten thousand francs.", "Which of these is NOT needed?", ["An ID card", "A proof of address", "A work contract"], 2],
      ["Our delivery from Guangzhou arrived two days late. The customs officer asked for more documents, so we waited until Friday.", "Why was the delivery late?", ["Customs asked for more documents", "The ship broke down", "The address was wrong"], 0],
      ["I'm calling about the apartment for rent. Is it still available? Yes. It has two bedrooms and a small garden. The rent is sixty thousand a month.", "How much is the rent?", ["Sixty thousand a month", "Sixteen thousand a month", "Sixty thousand a year"], 0],
      ["I've been working here for three years. Before that, I worked in a shop in Dakar for two years.", "How long has he worked here?", ["Two years", "Three years", "Five years"], 1],
      tf("The pharmacy closes at seven on Saturdays, but it is closed on Sundays.", "You can buy medicine there on Sunday.", false),
      ["Next week's weather: heavy rain on Monday and Tuesday, then sunny until the weekend.", "When will it be sunny?", ["Monday and Tuesday", "From Wednesday to the weekend", "Only on Sunday"], 1],
      ["Could you speak more slowly, please? I didn't catch your last name.", "What does the person ask?", ["To speak more slowly", "To write his address", "To call later"], 0],
      ["Passengers for flight two oh four to Casablanca, please go to gate eleven. Boarding closes in twenty minutes.", "Which gate must passengers go to?", ["Gate eleven", "Gate twelve", "Gate fourteen"], 0],
      ["I'd like to return this shirt. It's too small, and I don't have the receipt. I'm sorry, without a receipt we can only exchange it.", "What can the shop do?", ["Give a refund", "Exchange it", "Nothing at all"], 1],
      ["My farm produces tomatoes and onions. This year the harvest is bigger because we used a new irrigation system.", "Why is the harvest bigger?", ["A new irrigation system", "More land", "Cheaper seeds"], 0],
      ["The doctor says I must rest for three days and drink a lot of water. I can go back to work on Friday.", "When can he go back to work?", ["On Wednesday", "On Friday", "On Monday"], 1],
      tf("Our company was created in 2015. Since then, we have opened four shops in Senegal and one in Mali.", "The company has five shops.", true),
      ["Hello, I'd like to book a table for four people at eight o'clock tonight. Under the name Diallo.", "How many people is the table for?", ["Two", "Four", "Eight"], 1],
      ["We are looking for a shop assistant. The job is full-time, and you must speak English and French.", "Which languages must the person speak?", ["English and French", "French and Arabic", "English and Wolof"], 0],
      ["I'm sorry I'm late. My bus broke down on the highway, and I had to wait for another one.", "Why was he late?", ["His bus broke down", "He missed the train", "He overslept"], 0],
      ["The bank is open from eight to four on weekdays, and from eight to noon on Saturday.", "When does the bank close on Saturday?", ["At noon", "At four", "At eight"], 0],
      ["Please fill in the form with your name, address and phone number, and sign at the bottom.", "What must you do at the bottom?", ["Write your phone number", "Sign the form", "Pay the fee"], 1],
      tf("This hotel has a swimming pool and free breakfast, but there is no air conditioning.", "The rooms have air conditioning.", false),
      ["The price includes the flight and two nights in a hotel, but meals are not included.", "What is NOT included?", ["The flight", "The hotel", "The meals"], 2],
      ["I usually go to the gym three times a week, but this week I only went once because I was busy.", "How many times did he go this week?", ["Once", "Twice", "Three times"], 0],
      ["Our shop will be closed on Monday for the national holiday and will reopen on Tuesday at nine.", "When will the shop reopen?", ["Monday at nine", "Tuesday at nine", "Wednesday at nine"], 1],
      ["I'd like to send this parcel to France. How long will it take? About five working days, and it costs fifteen thousand francs.", "How long will it take?", ["Five working days", "Fifteen days", "Five weeks"], 0],
      ["My brother lives in Italy. He works in a factory and calls us every Sunday evening.", "When does he call?", ["Every Saturday", "Every Sunday evening", "Every morning"], 1],
      ["If it rains tomorrow, the match will be played on Sunday instead.", "When will the match be played if it rains?", ["Saturday", "Sunday", "Monday"], 1],
      ["The product you ordered is out of stock. We can send a similar one, or refund you.", "What can the company do?", ["Send a similar one or refund you", "Only refund you", "Only wait"], 0],
      tf("The course starts in September and lasts six months. Students must pay half the fee at registration.", "Students pay the full fee at registration.", false),
      ["Could you tell me where I can buy a SIM card? There is a shop just opposite the post office.", "Where is the shop?", ["Opposite the post office", "Next to the bank", "Behind the station"], 0]
    ] },
    { nom: "Avancé", ic: "🌳", rate: 1.0, q: [
      ["Despite the heavy rain, the match went ahead as planned, although attendance was lower than organisers had hoped.", "What happened to the match?", ["It was cancelled", "It went ahead", "It was postponed"], 1],
      ["I'd have called earlier, but my phone ran out of battery just as I was leaving the office.", "Why didn't he call earlier?", ["His phone battery died", "He was too busy", "He forgot the number"], 0],
      ["The proposal is interesting in principle, but we'd need to see detailed costs before committing to anything.", "What does the speaker want?", ["Detailed costs", "An immediate agreement", "A shorter proposal"], 0],
      ["Applicants must submit their file before the thirtieth of November. Late submissions will not be considered under any circumstances.", "What happens to late submissions?", ["They are accepted with a fee", "They are not considered", "They are reviewed later"], 1],
      ["Our exports have grown by twelve percent this year, mainly thanks to demand from the Gulf, whereas European sales remained flat.", "Which market stayed flat?", ["The Gulf", "Europe", "Asia"], 1],
      ["Unless you transfer the funds by Friday, the supplier won't release the goods, and the shipping slot will be lost.", "What must be done by Friday?", ["Transfer the funds", "Sign the contract", "Visit the supplier"], 0],
      ["I'm afraid the position has already been filled, but we'll keep your CV on file in case something suitable comes up.", "What will they do with his CV?", ["Throw it away", "Keep it on file", "Send it to another company"], 1],
      tf("Though the interview was short, the panel seemed impressed by her experience.", "The interview was long.", false),
      ["The visa officer asked whether I had sufficient funds and a return ticket, and then explained that processing could take up to three weeks.", "How long could processing take?", ["Three days", "Up to three weeks", "Three months"], 1],
      ["Rather than lowering our prices, we decided to improve the packaging, which turned out to be more effective.", "What did they do instead of lowering prices?", ["Improved the packaging", "Raised the prices", "Bought more advertising"], 0],
      ["Had I known the road was closed, I would have taken the coastal route.", "What does the speaker regret?", ["Not knowing the road was closed", "Taking the coastal route", "Being late for work"], 0],
      ["The clinic offers free consultations on Mondays, but medication must be paid for separately.", "What must patients pay for?", ["The consultation", "The medication", "The parking"], 1],
      ["To be eligible for the scholarship, candidates need a minimum overall score of six point five, with no band below six.", "What is the minimum overall score?", ["Six", "Six point five", "Seven"], 1],
      ["According to the forecast, temperatures will peak at forty degrees on Thursday before dropping sharply over the weekend.", "When will it be hottest?", ["On Thursday", "On Saturday", "On Sunday"], 0],
      tf("She wouldn't have accepted the offer if the salary hadn't been raised.", "She accepted because the salary increased.", true),
      ["Although the course is demanding, most students find that the skills they acquire are well worth the effort.", "What do most students think?", ["The skills are worth the effort", "The course is too easy", "The course is too short"], 0],
      ["Not only did the company cut costs, but it also managed to increase its output by fifteen percent.", "What happened to output?", ["It fell", "It rose by fifteen percent", "It stayed the same"], 1],
      ["I was supposed to meet the supplier at noon, but he cancelled at the last minute, which put me in a difficult position.", "What did the supplier do?", ["Cancelled at the last minute", "Arrived early", "Changed the price"], 0],
      ["The government has announced that fuel prices will be frozen until the end of the year.", "What will happen to fuel prices?", ["They will rise", "They will be frozen", "They will fall"], 1],
      tf("Contrary to what many people believe, regular exercise does not require expensive equipment.", "Exercise needs expensive equipment.", false),
      ["By the time the ambulance arrived, the patient had already been taken to the clinic by a neighbour.", "Who took the patient to the clinic?", ["The ambulance", "A neighbour", "A nurse"], 1],
      ["We would be grateful if you could send us the invoice by the end of the week, so that payment can be processed on time.", "What do they ask for?", ["The invoice", "A discount", "A new contract"], 0],
      ["Unlike his brother, who studied medicine, he chose to start a business right after high school.", "What did he do after high school?", ["Studied medicine", "Started a business", "Travelled abroad"], 1],
      ["The survey shows that sixty percent of young people prefer online shopping, mainly because it is more convenient.", "Why do they prefer online shopping?", ["It is cheaper", "It is more convenient", "It is safer"], 1],
      ["Provided that the weather holds, the harvest should be completed within two weeks.", "What is needed to finish within two weeks?", ["Good weather", "More workers", "New machines"], 0],
      ["She was so exhausted after the long flight that she went straight to bed without eating anything.", "What did she do after the flight?", ["She ate dinner", "She went straight to bed", "She called her family"], 1],
      tf("The manager insisted that all employees attend the training, even those who had completed it last year.", "Only new employees must attend.", false),
      ["I'd rather pay a little more for quality than buy something cheap that will break after a month.", "What does the speaker prefer?", ["Cheap products", "Quality products", "Second-hand products"], 1],
      ["The negotiations broke down because neither side was willing to compromise on the delivery date.", "Why did the negotiations fail?", ["Nobody would compromise", "The price was too high", "The contract was lost"], 0],
      ["Scholarship holders are expected to maintain a minimum average of fourteen out of twenty throughout the programme.", "What must scholarship holders maintain?", ["A minimum average of fourteen", "Perfect attendance", "A part-time job"], 0]
    ] }
  ];
  var TAILLE = 8, SEUIL = 6, ECOUTES = 2;

  function etat() { return lire("diisoo_ecoute", {}); }
  function sauver(e) { ecrire("diisoo_ecoute", e); }
  function debloque(i) { if (i === 0) return true; var e = etat(), p = e["n" + (i - 1)]; return !!(p && p.best >= SEUIL); }

  var st = document.createElement("style");
  st.textContent =
    "#ec-ov{position:fixed;inset:0;z-index:10040;background:#0B0F1C;color:#F6F1E7;overflow:auto;padding:14px 14px 24px}" +
    "#ec-ov .bk{min-height:44px;padding:0 14px;border:1px solid #2A3454;background:#141A2B;border-radius:14px;color:#F6F1E7;font-weight:800;font-size:14px}" +
    "#ec-ov h2{font-size:20px;font-weight:800;margin:14px 0 4px}#ec-ov .sub{font-size:13px;color:#A69C86;margin:0 0 12px}" +
    "#ec-ov .nv{display:flex;align-items:center;gap:12px;width:100%;min-height:68px;padding:10px 14px;margin-bottom:8px;border-radius:16px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;text-align:left;font-size:15px;font-weight:800}" +
    "#ec-ov .nv b{font-size:26px;font-weight:400}#ec-ov .nv small{display:block;font-size:12px;font-weight:600;color:#A69C86;margin-top:2px}" +
    "#ec-ov .nv.off{opacity:.45}" +
    "#ec-ov .pg{font-size:12.5px;color:#A69C86;text-align:center;margin:10px 0 2px}" +
    "#ec-ov .play{display:block;width:100%;min-height:58px;border:0;border-radius:16px;background:#F3A94E;color:#0B0F1C;font-size:17px;font-weight:800;margin:12px 0 6px}" +
    "#ec-ov .play:disabled{opacity:.45}#ec-ov .cp{font-size:12px;text-align:center;color:#A69C86;margin-bottom:10px}" +
    "#ec-ov .q{font-size:16px;font-weight:800;text-align:center;margin:10px 4px 12px;line-height:1.35}" +
    "#ec-ov .op{display:block;width:100%;min-height:50px;margin-bottom:8px;padding:8px 12px;border-radius:14px;border:1px solid #2A3454;background:#141A2B;color:#F6F1E7;font-size:15px;font-weight:700}" +
    "#ec-ov .op.ok{background:#12351F;border-color:#3FAE74}#ec-ov .op.no{background:#3a1a1a;border-color:#c0504d}" +
    "#ec-ov .tx{font-size:13px;color:#C9C0AA;background:#141A2B;border-radius:12px;padding:10px 12px;margin:8px 0;line-height:1.4}" +
    "#ec-ov .go{display:block;width:100%;min-height:50px;border:0;border-radius:14px;background:#25D366;color:#fff;font-size:15px;font-weight:800;margin-top:8px}" +
    "#ec-ov .go.g{background:#1B2238;color:#F6F1E7}#ec-ov .big{font-size:42px;text-align:center;font-weight:800;margin:16px 0 4px}";
  document.head.appendChild(st);

  var ov = null, S = null;
  function fermer() { if (ov) { ov.remove(); ov = null; } S = null; try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} }
  function nouveau() { if (ov) { ov.remove(); ov = null; } try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} ov = document.createElement("div"); ov.id = "ec-ov"; document.body.appendChild(ov); return ov; }
  function dire(txt, rate) { try { speak(txt, "en-GB", rate); } catch (e) {} }

  function accueil() {
    nouveau();
    var e = etat(), h = '<button class="bk" id="ec-x">⬅️ Revenir</button><h2>👂 Écoute</h2><p class="sub">Écoute, puis réponds. 2 écoutes par question. 6 bonnes réponses sur 8 débloquent le niveau suivant.</p>';
    NIV.forEach(function (n, i) {
      var p = e["n" + i], ok = debloque(i);
      var info = ok ? (p ? "Meilleur score : " + p.best + "/" + TAILLE + " · " + n.q.length + " passages" : n.q.length + " passages") : "🔒 Réussis le niveau précédent (6/8)";
      h += '<button class="nv' + (ok ? "" : " off") + '" data-i="' + i + '"><b>' + n.ic + "</b><span>" + n.nom + "<small>" + info + "</small></span></button>";
    });
    ov.innerHTML = h;
    $("ec-x").onclick = fermer;
    Array.prototype.forEach.call(ov.querySelectorAll(".nv"), function (b) {
      b.onclick = function () { var i = +b.getAttribute("data-i"); if (!debloque(i)) { try { toast("Réussis d'abord le niveau précédent (6/8)."); } catch (x) {} return; } seance(i); };
    });
  }

  function seance(i) {
    var e = etat(), p = e["n" + i] || { best: 0, vus: [] };
    var ids = NIV[i].q.map(function (_, k) { return k; });
    var neufs = ids.filter(function (k) { return p.vus.indexOf(k) < 0; }), vus = ids.filter(function (k) { return p.vus.indexOf(k) >= 0; });
    function mel(a) { for (var j = a.length - 1; j > 0; j--) { var r = Math.floor(Math.random() * (j + 1)), t = a[j]; a[j] = a[r]; a[r] = t; } return a; }
    var liste = mel(neufs).concat(mel(vus)).slice(0, TAILLE);
    S = { i: i, liste: liste, n: 0, bon: 0, ecoutes: 0, repondu: false };
    question();
  }

  function question() {
    var niv = NIV[S.i], k = S.liste[S.n], d = niv.q[k];
    S.ecoutes = 0; S.repondu = false;
    nouveau();
    var h = '<button class="bk" id="ec-x">⬅️ Quitter</button><p class="pg">' + niv.ic + " " + niv.nom + " · Question " + (S.n + 1) + " / " + S.liste.length + " · Score " + S.bon + "</p>" +
      '<button class="play" id="ec-p">🔊 Écouter</button><p class="cp" id="ec-c"></p><p class="q">' + esc(d[1]) + '</p><div id="ec-o"></div><div id="ec-f"></div>';
    ov.innerHTML = h;
    $("ec-x").onclick = accueil;
    $("ec-p").onclick = jouer;
    d[2].forEach(function (o, j) {
      var b = document.createElement("button"); b.className = "op"; b.type = "button"; b.textContent = o; b.onclick = function () { repondre(j); };
      $("ec-o").appendChild(b);
    });
    majEcoutes();
    setTimeout(jouer, 350);
  }
  function majEcoutes() {
    var p = $("ec-p"), c = $("ec-c"); if (!p) return;
    var r = ECOUTES - S.ecoutes;
    c.textContent = S.repondu ? "" : (r > 0 ? "Écoutes restantes : " + r : "Plus d'écoute : réponds avec ce que tu as compris");
    p.disabled = r <= 0 || S.repondu;
  }
  function jouer() {
    if (!S || S.repondu || S.ecoutes >= ECOUTES) return;
    S.ecoutes++; majEcoutes();
    dire(NIV[S.i].q[S.liste[S.n]][0], NIV[S.i].rate);
  }
  function repondre(j) {
    if (!S || S.repondu) return;
    S.repondu = true;
    var niv = NIV[S.i], d = niv.q[S.liste[S.n]], ok = j === d[3];
    if (ok) { S.bon++; try { addXP(3); } catch (e) {} }
    try { bumpDailyGoal(1); } catch (e) {}
    var bs = $("ec-o").children;
    Array.prototype.forEach.call(bs, function (b, x) { b.disabled = true; if (x === d[3]) b.className = "op ok"; else if (x === j) b.className = "op no"; });
    majEcoutes();
    var dernier = S.n + 1 >= S.liste.length;
    $("ec-f").innerHTML = '<p class="tx">' + (ok ? "✅ Bonne réponse. " : "❌ Bonne réponse : " + esc(d[2][d[3]]) + ". ") + "<br><b>Texte :</b> " + esc(d[0]) + '</p><button class="go" id="ec-n">' + (dernier ? "Voir mon score" : "Suivant") + "</button>";
    $("ec-n").onclick = function () { if (dernier) bilan(); else { S.n++; question(); } };
  }

  function bilan() {
    var i = S.i, e = etat(), p = e["n" + i] || { best: 0, vus: [] };
    S.liste.forEach(function (k) { if (p.vus.indexOf(k) < 0) p.vus.push(k); });
    if (p.vus.length >= NIV[i].q.length) p.vus = [];
    var avant = debloque(i + 1);
    if (S.bon > p.best) p.best = S.bon;
    e["n" + i] = p; sauver(e);
    var apres = debloque(i + 1), reussi = S.bon >= SEUIL;
    nouveau();
    var h = '<button class="bk" id="ec-x">⬅️ Revenir</button><p class="big">' + S.bon + " / " + S.liste.length + "</p>" +
      '<p class="sub" style="text-align:center">' + (reussi ? "Bravo ! Tu progresses." : "Encore un essai : il faut " + SEUIL + " sur " + TAILLE + " pour passer au niveau suivant.") + "</p>";
    if (apres && !avant && i + 1 < NIV.length) h += '<p class="tx" style="text-align:center">🔓 Niveau ' + NIV[i + 1].nom + " débloqué !</p>";
    h += '<button class="go" id="ec-r">Rejouer ce niveau</button>';
    if (apres && i + 1 < NIV.length) h += '<button class="go" id="ec-s">Niveau suivant : ' + NIV[i + 1].nom + "</button>";
    h += '<button class="go g" id="ec-m">Tous les niveaux</button>';
    ov.innerHTML = h;
    $("ec-x").onclick = fermer; $("ec-r").onclick = function () { seance(i); }; $("ec-m").onclick = accueil;
    var s = $("ec-s"); if (s) s.onclick = function () { seance(i + 1); };
  }

  window.openListeningModule = accueil;
  window.DiisooEcoute = { ouvrir: accueil, niveaux: NIV.map(function (n) { return n.q.length; }) };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-ecoute.js",e);}

try{
/* ---- diisoo-abc.js ---- */
/* diisoo-abc.js v1 : propositions ABC-GLOBAL au bon moment (fin de mission reussie), message WhatsApp prerempli, clic compte */
(function () {
  "use strict";
  if (window.DiisooABC) return;
  var CAS = [
    { fin: "mv-x2", ok: /Visa accordé/, cle: "visa", t: "Tu es prêt. Besoin d'aide pour ton dossier de visa ?", b: "Parler à ABC-GLOBAL",
      m: "Bonjour ABC-GLOBAL, j'ai réussi la mission visa sur Diisoo. Je voudrais de l'aide pour mon dossier de visa." },
    { fin: "mvy-x2", ok: /Bon voyage/, cle: "voyage", t: "Tu voyages bientôt ? On réserve ton billet.", b: "Demander un billet",
      m: "Bonjour ABC-GLOBAL, j'ai fini la mission voyage sur Diisoo. Je voudrais un billet d'avion." },
    { fin: "mp-x2", ok: /Belle rencontre/, cle: "presentation", t: "Tu veux parler anglais en confiance ? Cours accompagné ABC-GLOBAL.", b: "En savoir plus",
      m: "Bonjour ABC-GLOBAL, j'ai réussi la mission présentation sur Diisoo. Je voudrais en savoir plus sur le cours d'anglais accompagné." },
    { fin: "me-x2", ok: /Embauché/, cle: "emploi", t: "Prêt pour l'entretien en anglais ? Cours accompagné ABC-GLOBAL.", b: "En savoir plus",
      m: "Bonjour ABC-GLOBAL, j'ai réussi la mission entretien d'embauche sur Diisoo. Je voudrais en savoir plus sur le cours d'anglais accompagné." },
    { fin: "mm-x2", ok: /Vente conclue/, cle: "marche", t: "Tu veux parler anglais avec tes clients ? Cours accompagné ABC-GLOBAL.", b: "En savoir plus",
      m: "Bonjour ABC-GLOBAL, j'ai réussi la mission marché sur Diisoo. Je voudrais en savoir plus sur le cours d'anglais accompagné pour commerçants." }
  ];
  function noter(n, d) { try { if (window.DiisooSuivi && DiisooSuivi.noter) DiisooSuivi.noter("action", n, d || ""); } catch (e) {} }
  var st = document.createElement("style");
  st.textContent = ".dii-abc-c{width:100%;max-width:320px;border:1px solid #2A3454;background:#141A2B;border-radius:16px;padding:10px 12px;font-size:14px;font-weight:700;line-height:1.3;color:#F6F1E7;text-align:center}" +
    ".dii-abc-c button{margin-top:8px;border:0;border-radius:14px;min-height:44px;padding:8px 16px;font-size:14.5px;font-weight:800;background:#25D366;color:#08210F;width:100%}" +
    ".dii-abc-c small{display:block;margin-top:4px;font-size:11px;font-weight:600;color:#A69C86}";
  document.head.appendChild(st);
  function poser() {
    for (var i = 0; i < CAS.length; i++) {
      var c = CAS[i], x = document.getElementById(c.fin);
      if (!x || x.getAttribute("data-abc")) continue;
      x.setAttribute("data-abc", "1");
      var o = x.parentNode; if (!o || !c.ok.test(o.innerText || "")) continue;
      var d = document.createElement("div"); d.className = "dii-abc-c";
      d.innerHTML = c.t + '<button type="button">' + c.b + '</button><small>Un produit ABC-GLOBAL</small>';
      (function (cc) {
        d.querySelector("button").onclick = function () {
          noter("abc_" + cc.cle);
          window.open("https://wa.me/221772882109?text=" + encodeURIComponent(cc.m), "_blank");
        };
      })(c);
      o.insertBefore(d, x);
      noter("abc_vue_" + c.cle);
    }
  }
  try { new MutationObserver(function () { try { poser(); } catch (e) {} }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  window.DiisooABC = { poser: poser };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-abc.js",e);}

try{
/* ---- diisoo-access.js ---- */
/* diisoo-access.js v1 : accessibilité et confort de lecture
   - texte jamais plus petit que 12 px (les mentions de 9 et 10 px étaient trop petites sur téléphone)
   - réglage « Taille du texte » dans le menu : Normal / Grand / Très grand, mémorisé
   - noms lisibles (aria-label) pour les boutons faits d'un seul pictogramme
   - contour visible au clavier, zones tactiles d'au moins 44 px dans les leçons
   Aucun fichier existant n'est modifié. */
(function () {
  "use strict";
  if (window.DiisooAccess) return;
  var $ = function (id) { return document.getElementById(id); };
  var CLE = "diisoo_taille_texte";
  var TAILLES = [["1", "Normal"], ["1.12", "Grand"], ["1.2", "Très grand"]];

  function lire() { try { return localStorage.getItem(CLE) || "1"; } catch (e) { return "1"; } }
  function ecrire(v) { try { localStorage.setItem(CLE, v); } catch (e) {} }

  function css() {
    if ($("dacc-css")) return;
    var s = document.createElement("style"); s.id = "dacc-css";
    s.textContent =
      ".text-\\[9px\\],.text-\\[10px\\]{font-size:12px!important;line-height:1.35!important}" +
      ".text-\\[11px\\]{font-size:12.5px!important}" +
      "button:focus-visible,a:focus-visible,[role=button]:focus-visible,input:focus-visible{outline:3px solid #F3A94E!important;outline-offset:2px}" +
      "#general-tabs button,#wolof-tabs button{min-height:44px}" +
      "button[data-practice]{min-height:48px}" +
      "html[data-dacc=\"1.12\"] body{zoom:1.12}html[data-dacc=\"1.2\"] body{zoom:1.2}" +
      "#dacc-row{display:flex;gap:6px;padding:8px 16px 12px}" +
      "#dacc-row button{flex:1;min-height:44px;border-radius:12px;background:#0B0F1C;border:1px solid #1E2740;color:#C9BFA8;font-weight:700}" +
      "#dacc-row button[aria-pressed=true]{border-color:#E1693F;color:#F6F1E7;background:#2a1a12}";
    document.head.appendChild(s);
  }

  function appliquer(v) {
    document.documentElement.setAttribute("data-dacc", v);
    var b = $("dacc-row"); if (!b) return;
    Array.prototype.forEach.call(b.querySelectorAll("button"), function (x) { x.setAttribute("aria-pressed", x.dataset.v === v ? "true" : "false"); });
  }

  function menu() {
    var m = $("burger-menu"), fin = $("menu-session");
    if (!m || !fin || $("dacc-row")) return;
    var t = document.createElement("p");
    t.className = "px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#8C8064]"; t.id = "dacc-titre"; t.textContent = "Taille du texte";
    var row = document.createElement("div"); row.id = "dacc-row"; row.setAttribute("role", "group"); row.setAttribute("aria-label", "Taille du texte");
    TAILLES.forEach(function (x) {
      var b = document.createElement("button"); b.type = "button"; b.dataset.v = x[0]; b.textContent = x[1];
      b.onclick = function (e) { e.stopPropagation(); ecrire(x[0]); appliquer(x[0]); };
      row.appendChild(b);
    });
    m.insertBefore(t, fin); m.insertBefore(row, fin);
    appliquer(lire());
  }

  /* Un bouton qui ne contient qu'un pictogramme reçoit un nom lisible par les lecteurs d'écran */
  var NOMS = { "🔊": "Écouter", "🎤": "Parler", "🎙️": "Parler", "⬅️": "Retour", "⬅": "Retour", "☰": "Menu", "✕": "Fermer", "✖": "Fermer", "×": "Fermer", "💾": "Sauvegarder", "🔁": "Rejouer", "▶️": "Lancer", "⏸": "Pause" };
  function nommer(racine) {
    var bs = (racine || document).querySelectorAll("button:not([aria-label]),a[role=button]:not([aria-label])");
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i], t = (b.textContent || "").trim();
      if (b.title) { b.setAttribute("aria-label", b.title); continue; }
      if (t && NOMS[t]) b.setAttribute("aria-label", NOMS[t]);
    }
    var inps = (racine || document).querySelectorAll("input:not([aria-label]):not([type=hidden])");
    for (var j = 0; j < inps.length; j++) { var p = inps[j].placeholder; if (p) inps[j].setAttribute("aria-label", p); }
  }
  var plan = false;
  function planifier() { if (plan) return; plan = true; setTimeout(function () { plan = false; try { nommer(); menu(); } catch (e) {} }, 300); }

  css();
  appliquer(lire());
  try { new MutationObserver(planifier).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  planifier();
  window.DiisooAccess = { version: 1, taille: function (v) { ecrire(String(v)); appliquer(String(v)); } };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-access.js",e);}

try{
/* ---- diisoo-suivi.js ---- */
/* diisoo-suivi.js v1 : suivi d'usage anonyme et des erreurs
   Enregistre dans Supabase (table diisoo_evenements) : les erreurs de l'app et les actions clés (guide vocal, séances,
   conversation, examens, secteurs Business). Aucun nom, aucun numéro, aucun contenu parlé : seulement un identifiant
   aléatoire de l'appareil, le nom de l'action, l'écran et le modèle de téléphone.
   Pour l'arrêter sur un appareil : localStorage.setItem("diisoo_no_suivi", "1"). */
(function () {
  "use strict";
  if (window.DiisooSuivi) return;
  var VERSION = "b1", MAX_SESSION = 80, file = [], envoyes = 0, vus = {}, minuteur = null;

  function lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  if (lire("diisoo_no_suivi") === "1") { window.DiisooSuivi = { arret: true }; return; }

  function anonId() {
    var a = lire("diisoo_anon");
    if (!a) { a = "a" + Math.random().toString(36).slice(2, 12) + Date.now().toString(36); ecrire("diisoo_anon", a); }
    return a;
  }
  function base() { try { return SUPABASE_URL.replace(/\/$/, ""); } catch (e) { return ""; } }
  function cle() { try { return SUPABASE_KEY; } catch (e) { return ""; } }
  function ecran() {
    try {
      var e = document.querySelectorAll("[id^=screen-]");
      for (var i = 0; i < e.length; i++) if (!e[i].classList.contains("hidden") && e[i].offsetParent !== null && !/tutorial|feedback|progress|premium/.test(e[i].id)) return e[i].id.replace("screen-", "").slice(0, 40);
    } catch (x) {}
    return "";
  }
  function appareil() {
    var u = navigator.userAgent || "", m = /Android [^;)]*; ([^;)]*)/.exec(u);
    return (m ? "Android " + m[1] : /iPhone|iPad/.test(u) ? "iOS" : /Windows|Mac|Linux/.test(u) ? "Ordinateur" : "Autre").slice(0, 160);
  }

  function envoyer(garde) {
    if (!file.length) return;
    var lot = file.splice(0, 20), u = base(), k = cle();
    if (!u || !k) return;
    try {
      fetch(u + "/rest/v1/diisoo_evenements", {
        method: "POST", keepalive: !!garde,
        headers: { apikey: k, Authorization: "Bearer " + k, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify(lot)
      }).catch(function () {});
    } catch (e) {}
    if (file.length) envoyer(garde);
  }
  function planifier() { if (!minuteur) minuteur = setTimeout(function () { minuteur = null; envoyer(false); }, 8000); }

  function noter(type, nom, detail) {
    if (envoyes >= MAX_SESSION) return;
    nom = String(nom || "").slice(0, 80); if (!nom) return;
    if (type === "erreur") { var c = nom + "|" + (detail || ""); if (vus[c]) return; vus[c] = 1; }
    envoyes++;
    file.push({ anon: anonId(), type: type, nom: nom, detail: detail ? String(detail).slice(0, 300) : null, ecran: ecran(), appareil: appareil(), version: VERSION });
    planifier();
  }

  /* ---- erreurs ---- */
  window.addEventListener("error", function (e) {
    var m = String(e.message || "");
    if (!m || /ResizeObserver|^Script error/i.test(m)) return;
    noter("erreur", m, (String(e.filename || "").split("/").pop() || "") + ":" + (e.lineno || 0));
  });
  window.addEventListener("unhandledrejection", function (e) {
    var r = e.reason, m = String((r && (r.message || r)) || "");
    if (!m || /AbortError|NetworkError|Failed to fetch|Load failed/i.test(m)) return;
    noter("erreur", "promesse: " + m, "");
  });


  /* ---- erreurs avalees par les sections protegees ("[diisoo-xxx] ...") et parcours IELTS ---- */
  try {
    var ce = console.error;
    console.error = function () {
      try { var m = String(arguments[0] || ""); if (/^\[diisoo-/.test(m)) noter("erreur", m.slice(0, 80), String(arguments[1] && (arguments[1].message || arguments[1]) || "").slice(0, 200)); } catch (e) {}
      return ce.apply(this, arguments);
    };
  } catch (e) {}
  document.addEventListener("click", function (ev) {
    try {
      var b = ev.target && ev.target.closest && ev.target.closest("button");
      if (!b) return;
      var t = (b.getAttribute("aria-label") || b.textContent || "").trim().slice(0, 30);
      if (document.getElementById("ie-ov") && /Voir les 7|Life Skills|Écoute|Oral|Terminer/.test(t)) noter("action", "ielts_clic", t);
      else if (b.getAttribute("aria-label") === "Pause") noter("action", "examen_pause", "");
    } catch (e) {}
  }, true);

  /* ---- actions : on entoure les fonctions existantes sans les modifier ---- */
  function entourer(obj, nom, action, detail) {
    try {
      var f = obj[nom]; if (typeof f !== "function" || f.__suivi) return;
      var g = function () { try { noter("action", action, detail ? detail.apply(null, arguments) : ""); } catch (e) {} return f.apply(this, arguments); };
      g.__suivi = true; obj[nom] = g;
    } catch (e) {}
  }
  function brancher() {
    entourer(window, "openGeneralModule", "ouvre_anglais");
    entourer(window, "openWolofModule", "ouvre_wolof");
    entourer(window, "openBusinessModule", "ouvre_business");
    entourer(window, "startTestSimulation", "ouvre_examens");
    entourer(window, "openPremium", "ouvre_premium");
    entourer(window, "openRevision", "ouvre_revision");
    if (window.DiisooVoixGuide) entourer(window.DiisooVoixGuide, "ouvrir", "guide_vocal");
    if (window.DiisooSeance) entourer(window.DiisooSeance, "demarrer", "seance_debut", function (k) { return k; });
    if (window.DiisooConversation) entourer(window.DiisooConversation, "demarrer", "conversation_debut", function (s, n, t) { return t; });
    if (window.DiisooExams2) entourer(window.DiisooExams2, "ouvrir", "examen", function (k) { return k; });
    if (typeof window.selectBusinessModule === "function") entourer(window, "selectBusinessModule", "secteur_business", function (k) { return k; });
  }

  /* ---- fins de séance, de conversation, d'examen : on regarde apparaître l'écran de bilan ---- */
  var fins = { "dsn-end": "seance_fin", "dcv-end": "conversation_fin" }, deja = {};
  try {
    new MutationObserver(function () {
      for (var id in fins) { var e = document.getElementById(id); if (e && !e.__vu) { e.__vu = 1; noter("action", fins[id], ""); } else if (!e) { } }
      var f = document.getElementById("dii-fmt");
      if (f && /Indice Diisoo/.test(f.innerText || "") && !f.__bilan) { f.__bilan = 1; noter("action", "examen_fin", ""); }
    }).observe(document.body, { childList: true, subtree: true });
  } catch (e) {}

  /* ---- envoi ---- */
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") envoyer(true); });
  window.addEventListener("pagehide", function () { envoyer(true); });

  setTimeout(brancher, 500);
  setTimeout(brancher, 4000);
  noter("action", "session", lire("diisoo_premier") ? "retour" : "nouveau");
  ecrire("diisoo_premier", "1");

  window.DiisooSuivi = { version: 1, noter: noter, envoyer: function () { envoyer(false); } };
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-suivi.js",e);}

try{
/* ---- diisoo-entree.js ---- */
/* diisoo-entree.js : entree la plus simple possible.
 * Ecran d'accueil : un seul bouton "Commencer", prenom facultatif, plus de barre d'etapes, plus de carte "Ecoute d'abord",
 * Google en simple lien discret. Aucun faux profil : un seul appui de la personne est necessaire.
 * Interrupteur : ?entree=0 remet l'ancien ecran. Aucun fichier existant modifie. */
(function () {
  "use strict";
  if (window.__entreeOK) return; window.__entreeOK = true;
  try { if (new URLSearchParams(location.search).get("entree") === "0") return; } catch (e) {}

  var st = document.createElement("style");
  st.textContent =
    "#screen-onboarding > div:first-child{display:none!important}" +
    "#diisoo-essai{display:none!important}" +
    "#screen-onboarding > p.text-center{display:none!important}" +
    "#btn-google{background:transparent!important;border:0!important;box-shadow:none!important;color:#A69C86!important;font-size:12px!important;padding:4px!important;text-decoration:underline}" +
    "#btn-google svg{display:none!important}";
  (document.head || document.documentElement).appendChild(st);

  function txt(el, t) { if (el && el.textContent !== t) el.textContent = t; }
  function adapter() {
    try {
      var ob = document.getElementById("screen-onboarding");
      if (!ob) return;
      var h2 = ob.querySelector("h2");
      txt(h2, "Bienvenue 👋");
      var p = h2 && h2.nextElementSibling;
      if (p && p.tagName === "P") txt(p, "Apprends l'anglais et le wolof. Commence tout de suite.");
      var champ = document.getElementById("user-firstname");
      if (champ) { champ.required = false; champ.placeholder = "Ton prénom (facultatif)"; }
      txt(ob.querySelector('label[for="user-firstname"]'), "Ton prénom (facultatif)");
      var b = document.getElementById("btn-submit-onboarding");
      if (b && !b.disabled) txt(b, "Commencer");
      var g = document.getElementById("btn-google");
      if (g) {
        var n = g.lastChild;
        if (n && n.nodeType === 3 && n.textContent.trim() !== "J'ai déjà un compte (Google)") n.textContent = " J'ai déjà un compte (Google)";
      }
    } catch (e) {}
  }
  [300, 1000, 2500, 5000].forEach(function (t) { setTimeout(adapter, t); });

  /* Accueil : "Bonjour" sans nom si le prenom est vide */
  function corrigerBonjour() {
    try { var w = document.getElementById("welcome-tag"); if (w && /^Bonjour\s*$/.test(w.textContent)) w.textContent = "Bonjour 👋"; } catch (e) {}
  }
  var essais = 0, tm = setInterval(function () {
    var w = document.getElementById("welcome-tag");
    if (w && typeof MutationObserver === "function") { clearInterval(tm); new MutationObserver(corrigerBonjour).observe(w, { childList: true, characterData: true, subtree: true }); corrigerBonjour(); }
    else if (++essais > 100) clearInterval(tm);
  }, 200);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-entree.js",e);}

try{
/* ---- diisoo-accueil3.js ---- */
/* diisoo-accueil3.js : un seul gros bouton d'action sur l'accueil.
 * - Utilisateur qui revient : « Continuer » passe en premier, la carte micro devient une ligne discrete.
 * - Nouvel utilisateur : bouton « Commencer ma premiere lecon » en premier.
 * Interrupteur : ?accueil3=0 remet l'ancien accueil. Aucun fichier existant modifie. */
(function () {
  "use strict";
  if (window.__accueil3) return; window.__accueil3 = true;
  try { if (new URLSearchParams(location.search).get("accueil3") === "0") return; } catch (e) {}
  function $(id) { return document.getElementById(id); }

  var st = document.createElement("style");
  st.textContent =
    "#dg-open.dg-compact{padding:8px 12px!important;border:1px dashed #2A3454!important;background:transparent!important;animation:none!important;box-shadow:none!important;border-radius:14px!important}" +
    "#dg-open.dg-compact .dg-mic{width:30px!important;height:30px!important;font-size:16px!important}" +
    "#dg-open.dg-compact .dg-s{display:none!important}" +
    "#dg-open.dg-compact b{font-size:13px!important;font-weight:600!important;color:#C9BFA8}" +
    "#dstart{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:14px;border-radius:18px;background:linear-gradient(135deg,#E1693F,#F3A94E);color:#1a1208;border:0;min-height:64px}" +
    "#dstart .p{flex:none;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;font-size:18px}" +
    "#dstart b{display:block;font-size:17px;line-height:1.2}#dstart small{display:block;font-size:13px;opacity:.9;margin-top:2px}";
  document.head.appendChild(st);

  function demarrer() {
    try {
      if (window.DiisooVoixGuide && window.DiisooVoixGuide.aller) window.DiisooVoixGuide.aller({ type: "anglais", cle: "intro", niv: 1 });
    } catch (e) {}
  }

  function ajuster() {
    try {
      var d = $("screen-dashboard"), g = $("dg-open"), c = $("dcont"), s = $("dstart");
      if (!d || d.classList.contains("hidden") || !g) return;
      if (c) {
        if (s) s.remove();
        g.classList.add("dg-compact");
        if (c.nextElementSibling !== g && c.compareDocumentPosition(g) & 2) { /* g avant c : on remet c avant g */ }
        if (g.compareDocumentPosition(c) & 4) g.parentNode.insertBefore(c, g); /* c apres g : on le place avant */
      } else {
        g.classList.remove("dg-compact");
        if (!s) {
          s = document.createElement("button");
          s.type = "button"; s.id = "dstart";
          s.innerHTML = '<span class="p">▶</span><span><b>Commencer ma première leçon</b><small>Se présenter en anglais, 1 minute</small></span>';
          s.onclick = demarrer;
          g.parentNode.insertBefore(s, g);
        }
      }
    } catch (e) {}
  }
  setInterval(ajuster, 800);
  setTimeout(ajuster, 500);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-accueil3.js",e);}

try{
/* ---- diisoo-accueil4.js ---- */
/* diisoo-accueil4.js : accueil plus clair.
 * Les icones du bandeau portent un mot : Ligue pour le trophee, Rappel pour la cloche (sans casser la ligne sur petit ecran).
 * Interrupteur : ?accueil4=0 remet l'ancien affichage. Aucun fichier existant modifie. */
(function () {
  "use strict";
  if (window.__accueil4) return; window.__accueil4 = true;
  try { if (new URLSearchParams(location.search).get("accueil4") === "0") return; } catch (e) {}
  var st = document.createElement("style");
  st.textContent =
    "#xp-label{white-space:nowrap!important;font-size:12px!important}" +
    "#xp-label *{white-space:nowrap!important}" +
    "#dii-ligue-c{padding-left:8px!important;padding-right:8px!important;white-space:nowrap}" +
    "#streak-counter{white-space:nowrap}" +
    "*:has(> #dii-ligue-c){flex-wrap:wrap!important;row-gap:8px!important}" +
    "#dii-ligue-c::after{content:' Ligue';font-size:11.5px;font-weight:700;margin-left:3px}" +
    "body.rp-off #streak-counter::after{content:' 🔔 Rappel'!important;font-size:11.5px}";
  document.head.appendChild(st);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-accueil4.js",e);}

try{
/* ---- diisoo-fin1.js ---- */
/* diisoo-fin1.js : fin de la premiere lecon = UNE seule question.
 * Apres le premier exercice, l'app proposait une fiche de 4 questions (but, rythme, duree, heure).
 * Ici : « Bravo ! On te rappelle demain a quelle heure ? » avec 3 boutons (Matin, Midi, Soir).
 * Le reste utilise la fiche existante (aucune logique de rappel dupliquee). Lien discret pour choisir ses objectifs en detail.
 * Interrupteur : ?fin1=0 remet l'ancienne fiche. Aucun fichier existant modifie. */
(function () {
  "use strict";
  if (window.__fin1) return; window.__fin1 = true;
  try { if (new URLSearchParams(location.search).get("fin1") === "0") return; } catch (e) {}

  var st = document.createElement("style");
  st.textContent =
    "#dii-fin1{position:fixed;inset:0;z-index:9992;background:rgba(5,8,16,.86);display:flex;align-items:flex-end;justify-content:center}" +
    "#dii-fin1 .f-box{width:100%;max-width:480px;background:#0B0F1C;border:1px solid #1E2740;border-radius:22px 22px 0 0;padding:20px 16px 24px;color:#F6F1E7;text-align:center}" +
    "#dii-fin1 h3{font-size:20px;font-weight:800;margin:0 0 6px}" +
    "#dii-fin1 p{font-size:14px;color:#C9BFA8;margin:0 0 14px}" +
    "#dii-fin1 .f-g{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}" +
    "#dii-fin1 .f-c{min-height:72px;border-radius:14px;background:#141A2B;border:2px solid #1E2740;color:#F6F1E7;font-size:14px;font-weight:700}" +
    "#dii-fin1 .f-c small{display:block;font-size:12px;font-weight:400;color:#A69C86}" +
    "#dii-fin1 .f-c:active{border-color:#25D366;background:#12351F}" +
    "#dii-fin1 .f-no{width:100%;min-height:44px;margin-top:10px;background:none;border:0;color:#A69C86;font-size:13px}" +
    "#dii-fin1 .f-lien{background:none;border:0;color:#A69C86;font-size:12px;text-decoration:underline;min-height:36px}";
  document.head.appendChild(st);

  function traiter(ov) {
    try {
      var plus = ov.querySelector("#ob-plus");
      if (!plus || plus.textContent.trim() !== "Plus tard") return; /* fiche ouverte volontairement : on ne touche pas */
      if (document.getElementById("dii-fin1")) return;
      ov.style.display = "none";
      var m = document.createElement("div"); m.id = "dii-fin1";
      m.innerHTML =
        '<div class="f-box"><h3>🎉 Bravo, première leçon faite !</h3>' +
        "<p>Reviens demain pour garder ta série. On te rappelle à quelle heure ?</p>" +
        '<div class="f-g">' +
        '<button type="button" class="f-c" data-h="06:30">🌅<small>Matin 6h30</small></button>' +
        '<button type="button" class="f-c" data-h="12:30">☀️<small>Midi 12h30</small></button>' +
        '<button type="button" class="f-c" data-h="20:30">🌙<small>Soir 20h30</small></button></div>' +
        '<button type="button" class="f-no">Plus tard</button>' +
        '<button type="button" class="f-lien">Choisir mes objectifs en détail</button></div>';
      document.body.appendChild(m);
      Array.prototype.forEach.call(m.querySelectorAll(".f-c"), function (b) {
        b.onclick = function () {
          var h = ov.querySelector("#ob-heure");
          if (h) h.value = b.getAttribute("data-h");
          m.remove();
          var v = ov.querySelector("#ob-valider");
          if (v) v.click(); else ov.remove();
        };
      });
      m.querySelector(".f-no").onclick = function () { m.remove(); if (plus) plus.click(); else ov.remove(); };
      m.querySelector(".f-lien").onclick = function () { m.remove(); ov.style.display = ""; };
    } catch (e) { try { ov.style.display = ""; } catch (x) {} }
  }

  function observer() {
    if (!document.body || typeof MutationObserver !== "function") return;
    new MutationObserver(function (list) {
      list.forEach(function (r) {
        Array.prototype.forEach.call(r.addedNodes, function (n) { if (n && n.id === "dii-obj") traiter(n); });
      });
    }).observe(document.body, { childList: true });
  }
  if (document.body) observer(); else document.addEventListener("DOMContentLoaded", observer);
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-fin1.js",e);}

try{
/* ---- diisoo-wolof-plus.js ---- */
/* diisoo-wolof-plus.js : Anglais Wolof passe de 10 a 18 themes (8 nouveaux, 12 mots chacun, wolof relu par Babacar).
   Les themes sont ajoutes a la fin : les niveaux (Debutant, Intermediaire, Avance) se repartissent automatiquement par tiers (6, 6, 6).
   Aucun fichier existant modifie. */
(function () {
  "use strict";
  if (window.__wolofPlus) return; window.__wolofPlus = true;
  var NOUVEAUX = [
{
"id": "nature",
"title": "Nature & animaux",
"words": [
{
"en": "Tree",
"wo": "Garab",
"fr": "Arbre"
},
{
"en": "Sun",
"wo": "Jant",
"fr": "Soleil"
},
{
"en": "Moon",
"wo": "Weer",
"fr": "Lune"
},
{
"en": "Rain",
"wo": "Taw",
"fr": "Pluie"
},
{
"en": "Wind",
"wo": "Ngelaw",
"fr": "Vent"
},
{
"en": "Sea",
"wo": "Géej",
"fr": "Mer"
},
{
"en": "River",
"wo": "Dex",
"fr": "Fleuve"
},
{
"en": "Dog",
"wo": "Xaj",
"fr": "Chien"
},
{
"en": "Cat",
"wo": "Muus",
"fr": "Chat"
},
{
"en": "Horse",
"wo": "Fas",
"fr": "Cheval"
},
{
"en": "Bird",
"wo": "Picc",
"fr": "Oiseau"
},
{
"en": "Fish",
"wo": "Jën",
"fr": "Poisson"
}
]
},
{
"id": "sentiments",
"title": "Sentiments",
"words": [
{
"en": "Happy",
"wo": "Bég",
"fr": "Content"
},
{
"en": "Sad",
"wo": "Naqar",
"fr": "Triste"
},
{
"en": "Angry",
"wo": "Mer",
"fr": "En colère"
},
{
"en": "Afraid",
"wo": "Ragal",
"fr": "Avoir peur"
},
{
"en": "Patience",
"wo": "Muñ",
"fr": "Patience"
},
{
"en": "Hope",
"wo": "Yaakaar",
"fr": "Espoir"
},
{
"en": "Trust",
"wo": "Wóolu",
"fr": "Confiance"
},
{
"en": "Respect",
"wo": "Kersa",
"fr": "Respect"
},
{
"en": "Friend",
"wo": "Xarit",
"fr": "Ami"
},
{
"en": "Peace",
"wo": "Jàmm",
"fr": "Paix"
},
{
"en": "I love you",
"wo": "Bëgg naa la",
"fr": "Je t'aime"
},
{
"en": "I miss you",
"wo": "Dama la nammoon",
"fr": "Tu me manques"
}
]
},
{
"id": "ecole",
"title": "École & études",
"words": [
{
"en": "School",
"wo": "Ekool",
"fr": "École"
},
{
"en": "Teacher",
"wo": "Jàngalekat",
"fr": "Enseignant"
},
{
"en": "Student",
"wo": "Jàngkat",
"fr": "Élève"
},
{
"en": "Book",
"wo": "Téere",
"fr": "Livre"
},
{
"en": "Notebook",
"wo": "Kaye",
"fr": "Cahier"
},
{
"en": "Pen",
"wo": "Stilo",
"fr": "Stylo"
},
{
"en": "Lesson",
"wo": "Njàng",
"fr": "Leçon"
},
{
"en": "Exam",
"wo": "Ekzamen",
"fr": "Examen"
},
{
"en": "To read",
"wo": "Jàng",
"fr": "Lire"
},
{
"en": "To write",
"wo": "Bind",
"fr": "Écrire"
},
{
"en": "Question",
"wo": "Laaj",
"fr": "Question"
},
{
"en": "Answer",
"wo": "Tontu",
"fr": "Réponse"
}
]
},
{
"id": "telephone",
"title": "Téléphone & internet",
"words": [
{
"en": "Phone",
"wo": "Telefon",
"fr": "Téléphone"
},
{
"en": "Call",
"wo": "Woote",
"fr": "Appel"
},
{
"en": "Message",
"wo": "Bataaxal",
"fr": "Message"
},
{
"en": "Credit",
"wo": "Kredi",
"fr": "Crédit"
},
{
"en": "Charger",
"wo": "Cargeur",
"fr": "Chargeur"
},
{
"en": "Battery",
"wo": "Batri",
"fr": "Batterie"
},
{
"en": "Internet",
"wo": "Intërnet",
"fr": "Internet"
},
{
"en": "Network",
"wo": "Rezo",
"fr": "Réseau"
},
{
"en": "Number",
"wo": "Nimero",
"fr": "Numéro"
},
{
"en": "Video call",
"wo": "Woote wideo",
"fr": "Appel vidéo"
},
{
"en": "Photo",
"wo": "Nataal",
"fr": "Photo"
},
{
"en": "Screen",
"wo": "Ekraŋ",
"fr": "Écran"
}
]
},
{
"id": "metiers",
"title": "Métiers courants",
"words": [
{
"en": "Driver",
"wo": "Cofër",
"fr": "Chauffeur"
},
{
"en": "Mechanic",
"wo": "Mekanisiyeŋ",
"fr": "Mécanicien"
},
{
"en": "Tailor",
"wo": "Tayoor",
"fr": "Tailleur"
},
{
"en": "Doctor",
"wo": "Doktoor",
"fr": "Médecin"
},
{
"en": "Nurse",
"wo": "Infirmiye",
"fr": "Infirmier"
},
{
"en": "Builder",
"wo": "Maasoŋ",
"fr": "Maçon"
},
{
"en": "Electrician",
"wo": "Elektrisien",
"fr": "Électricien"
},
{
"en": "Hairdresser",
"wo": "Kuafëer",
"fr": "Coiffeur"
},
{
"en": "Guard",
"wo": "Garde",
"fr": "Gardien"
},
{
"en": "Boss",
"wo": "Patroŋ",
"fr": "Patron"
},
{
"en": "Employee",
"wo": "Liggéeykat",
"fr": "Employé"
},
{
"en": "Apprentice",
"wo": "Apranti",
"fr": "Apprenti"
}
]
},
{
"id": "fetes",
"title": "Fêtes & traditions",
"words": [
{
"en": "Tabaski",
"wo": "Tabaski",
"fr": "Tabaski"
},
{
"en": "Korité",
"wo": "Koriteh",
"fr": "Korité"
},
{
"en": "Magal",
"wo": "Màggal",
"fr": "Magal"
},
{
"en": "Gamou",
"wo": "Gàmmu",
"fr": "Gamou"
},
{
"en": "Wedding",
"wo": "Céet",
"fr": "Mariage"
},
{
"en": "Baptism",
"wo": "Ngénte",
"fr": "Baptême"
},
{
"en": "Prayer",
"wo": "Julli",
"fr": "Prière"
},
{
"en": "Mosque",
"wo": "Jàkka",
"fr": "Mosquée"
},
{
"en": "Guest",
"wo": "Gan",
"fr": "Invité"
},
{
"en": "Gift",
"wo": "Kado",
"fr": "Cadeau"
},
{
"en": "Dance",
"wo": "Fecc",
"fr": "Danse"
},
{
"en": "Song",
"wo": "Woy",
"fr": "Chanson"
}
]
},
{
"id": "papiers",
"title": "Administration",
"words": [
{
"en": "Passport",
"wo": "Paaspoor",
"fr": "Passeport"
},
{
"en": "ID card",
"wo": "Kart d'identité",
"fr": "Carte d'identité"
},
{
"en": "Form",
"wo": "Formilaar",
"fr": "Formulaire"
},
{
"en": "Office",
"wo": "Biro",
"fr": "Bureau"
},
{
"en": "Document",
"wo": "Kayit",
"fr": "Document"
},
{
"en": "Signature",
"wo": "Sinatiir",
"fr": "Signature"
},
{
"en": "Fee",
"wo": "Fere",
"fr": "Frais"
},
{
"en": "Appointment",
"wo": "Randevu",
"fr": "Rendez-vous"
},
{
"en": "Visa",
"wo": "Wisa",
"fr": "Visa"
},
{
"en": "Queue",
"wo": "Rang",
"fr": "File d'attente"
},
{
"en": "Stamp",
"wo": "Tampon",
"fr": "Tampon"
},
{
"en": "Request",
"wo": "Demaand",
"fr": "Demande"
}
]
},
{
"id": "banque",
"title": "Banque & argent",
"words": [
{
"en": "Money",
"wo": "Xaalis",
"fr": "Argent"
},
{
"en": "Bank",
"wo": "Bànk",
"fr": "Banque"
},
{
"en": "Account",
"wo": "Kompt",
"fr": "Compte"
},
{
"en": "Cash",
"wo": "Xaalis ci loxo",
"fr": "Espèces"
},
{
"en": "Send money",
"wo": "Yónnee xaalis",
"fr": "Envoyer de l'argent"
},
{
"en": "Withdraw",
"wo": "Génne xaalis",
"fr": "Retirer"
},
{
"en": "Deposit",
"wo": "Dugal xaalis",
"fr": "Déposer"
},
{
"en": "Balance",
"wo": "Sold",
"fr": "Solde"
},
{
"en": "Loan",
"wo": "Leb",
"fr": "Prêt"
},
{
"en": "Savings",
"wo": "Denc xaalis",
"fr": "Épargne"
},
{
"en": "To pay",
"wo": "Fay",
"fr": "Payer"
},
{
"en": "Receipt",
"wo": "Reesi",
"fr": "Reçu"
}
]
}
];
  try {
    if (typeof WOLOF_THEMES === "undefined") return;
    NOUVEAUX.forEach(function (n) {
      if (WOLOF_THEMES.some(function (t) { return t.id === n.id; })) return;
      WOLOF_THEMES.push(n);
    });
    if (typeof LEXICON !== "undefined") {
      var deja = {};
      LEXICON.forEach(function (w) { deja[w.cat + "|" + w.en + "|" + w.wo] = 1; });
      NOUVEAUX.forEach(function (t) { t.words.forEach(function (w) { if (!deja[t.id + "|" + w.en + "|" + w.wo]) LEXICON.push({ cat: t.id, en: w.en, wo: w.wo, fr: w.fr, audio: null }); }); });
    }
  } catch (e) { console.warn("[diisoo] wolof-plus", e); }
})();

}catch(e){console.error("Diisoo : erreur dans diisoo-wolof-plus.js",e);}

window.__diisooChunks=true;
