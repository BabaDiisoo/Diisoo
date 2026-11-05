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
