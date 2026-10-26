/* Diisoo : images d'aide a l'apprentissage (emoji sur les mots concrets, emoji seulement).
   Affichage seulement : aucune donnee ni progression n'est modifiee. Desactiver : ?images=0 */
(function () {
  "use strict";
  if (window.DiisooImages || /[?&]images=0\b/.test(location.search)) return;
  var RULES = [
    [/\beggs?\b/, "🥚"], [/onion/, "🧅"], [/tomato/, "🍅"], [/groundnut|peanut/, "🥜"], [/chicken/, "🐔"], [/\bfish\b/, "🐟"], [/\bmeat\b/, "🥩"],
    [/\bbread\b/, "🍞"], [/\bmilk\b/, "🥛"], [/\brice\b|thieboudienne|\bdish\b|\bmeal\b|tasty|delicious|\bfood\b|hungry|\beat\b|menu|restaurant/, "🍚"],
    [/fruit/, "🍎"], [/vegetable/, "🥬"], [/\bcows?\b/, "🐄"], [/sheep/, "🐑"], [/\bgoats?\b/, "🐐"], [/seeds?\b/, "🌱"], [/fertili[sz]er/, "🧪"],
    [/tractor/, "🚜"], [/solar/, "☀️"], [/irrigation|water pump/, "🚿"], [/\bwater\b/, "💧"], [/rainy|\brain\b/, "🌧️"], [/harvest|crops?\b|\bfield|farm|agricult|garden|plants\b/, "🌾"],
    [/\bsun\b|\bhot\b/, "☀️"], [/ambulance/, "🚑"], [/hospital/, "🏥"], [/doctor/, "🩺"], [/medicine|tablet/, "💊"], [/headache|my head|\bhead\b/, "🤕"],
    [/tired|rest\b/, "😴"], [/sick|illness|heal\b|feel better/, "🤒"], [/\bhand\b/, "✋"], [/\bfoot\b/, "🦶"], [/\bbody\b/, "🧍"],
    [/airport|plane|flight/, "✈️"], [/passport|visa|consular|purpose of visit/, "🛂"], [/ticket/, "🎫"], [/truck/, "🚚"], [/\bbus\b/, "🚌"],
    [/\bcar\b|vehicle|driver/, "🚗"], [/road|\bway\b/, "🛣️"], [/container|cbm|cargo|shipping|bill of lading|packing|groupage|incoterm|fob/, "🚢"], [/customs/, "🛃"],
    [/invoice|receipt|\bbill\b|quote/, "🧾"], [/fabric|cotton|colou?r|textile|\bsize\b/, "🧵"], [/battery|charger|220v|voltage|device/, "🔋"],
    [/furniture|living room|sofa/, "🛋️"], [/brake|shock absorber|spare|\bparts?\b|warranty|oem|aftermarket|factory|installation|reference/, "🔧"],
    [/mobile money|money|franc|price|cost|\bpay|deposit|\brent\b|cheap|expensive|discount|wholesale|credit|instalment|lower/, "💰"],
    [/market|\bshops?\b|street trader|street vendor|\bsell|\bbuy|vendor|customers?\b|goods|supplier|catalogue|sample/, "🏪"],
    [/house|\bhome\b|apartment|\brooms?\b|kitchen|landlord|tenant|lease|neighbour|accommodation|electricity/, "🏠"],
    [/family|mother|father|brother|sister|sibling|child|grandmother|friend/, "👨‍👩‍👧"], [/office|colleague|\bjob\b|\bwork\b|business|meeting|busy/, "💼"],
    [/o'clock|time\b|morning|night|today|tomorrow|yesterday|\bnow\b|every day|wake/, "🕐"], [/hello|how are you|nice to meet|good night|see you|thank|i'm fine/, "👋"],
    [/\bnumber\b|\bone\b|\btwo\b|\bthree\b|hundred/, "🔢"], [/name|spell/, "🪪"], [/student|school/, "🎓"], [/speak|english|french/, "🗣️"], [/help|call/, "🆘"],
    [/how much|minimum order|bulk|ten pieces/, "💰"], [/from senegal/, "🇸🇳"], [/how old/, "🎂"], [/\blive\b/, "🏠"], [/going to|where are you going|\bgo\b|\bcome\b|coming/, "🚶"],
    [/\bnear\b|\bfar\b|where\?/, "📍"], [/hurts/, "🤕"], [/break|noon/, "☕"], [/people/, "👥"], [/exchange|after-sales|assembly|material|insurance|do you for a living|for a living/, "🔁"], [/how long|stay/, "⏳"]
  ];
  function emojiFor(en) {
    var t = String(en || "").toLowerCase();
    for (var i = 0; i < RULES.length; i++) if (RULES[i][0].test(t)) return RULES[i][1];
    return "";
  }
  var BOXES = [
    { id: "general-content", sel: "p.text-base", theme: function () { try { return generalThemeId; } catch (e) { return ""; } },
      scene: null },
    { id: "lexicon-container", sel: ".text-right p", theme: null, scene: null },
    { id: "business-content", sel: "p.text-sm.font-semibold", theme: null, scene: null }
  ];
  var css = document.createElement("style");
  css.textContent = ".fx-em::before{content:attr(data-em);display:block;text-align:center;font-size:44px;line-height:1.1;margin-bottom:6px}" +
    ".fx-banner{width:100%;height:112px;border-radius:14px;overflow:hidden;margin-bottom:10px;border:1px solid #1E2740}.fx-banner svg{width:100%;height:100%;display:block}";
  document.head.appendChild(css);
  function scan() {
    BOXES.forEach(function (b) {
      var box = document.getElementById(b.id); if (!box) return;
      Array.prototype.forEach.call(box.children, function (card) {
        if (card.tagName !== "DIV" || card.classList.contains("fx-nav") || card.hasAttribute("data-em")) return;
        var p = card.querySelector(b.sel); if (!p) return;
        var em = emojiFor(p.textContent);
        card.setAttribute("data-em", em);
        if (em) card.classList.add("fx-em");
      });
      banner(b, box);
    });
  }
  function banner(b, box) {
    if (!b.scene || !box.parentNode) return;
    var id = "fx-banner-" + b.id, el = document.getElementById(id), k = b.theme(), sc = b.scene[k];
    var S = window.DiisooExams && window.DiisooExams.scene;
    if (!sc || !S) { if (el) el.style.display = "none"; return; }
    if (!el) { el = document.createElement("div"); el.id = id; el.className = "fx-banner"; el.setAttribute("aria-hidden", "true"); box.parentNode.insertBefore(el, box); }
    if (el.dataset.k !== k) { var s = ""; try { s = S(sc).replace("<svg ", '<svg preserveAspectRatio="xMidYMid slice" '); } catch (e) {} el.innerHTML = s; el.dataset.k = k; }
    el.style.display = "";
  }
  var timer = null;
  function plan() { if (timer) return; timer = setTimeout(function () { timer = null; try { scan(); } catch (e) {} }, 120); }
  new MutationObserver(plan).observe(document.body, { childList: true, subtree: true });
  plan();
  window.DiisooImages = { version: 1, emojiFor: emojiFor };
})();
