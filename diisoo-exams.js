/* Diisoo : autres examens d'anglais (TOEFL, TOEIC, Cambridge, Duolingo, PTE).
   Meme moteur que le simulateur IELTS (4 phases, voix, minuteur). Aucune donnee existante n'est modifiee. */
(function () {
  "use strict";
  if (window.DiisooExams) return;
  var $ = function (id) { return document.getElementById(id); };
  var SK = ["#8a5a3c", "#6e4a30", "#a9714b", "#5b3a26", "#7a4d33"];
  function R(x, y, w, h, f, r, o) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"' + (r ? ' rx="' + r + '"' : "") + ' fill="' + f + '"' + (o ? ' opacity="' + o + '"' : "") + "/>"; }
  function C(x, y, r, f, o) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (o ? ' opacity="' + o + '"' : "") + "/>"; }
  function E(x, y, rx, ry, f, o) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (o ? ' opacity="' + o + '"' : "") + "/>"; }
  function PL(pts, f, o) { return '<polygon points="' + pts + '" fill="' + f + '"' + (o ? ' opacity="' + o + '"' : "") + "/>"; }
  function L(x1, y1, x2, y2, c, w) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="' + (w || 3) + '" stroke-linecap="round"/>'; }
  function T(x, y, t, sz, f, b) { return '<text x="' + x + '" y="' + y + '" font-family="sans-serif" font-size="' + (sz || 14) + '"' + (b ? ' font-weight="bold"' : "") + ' fill="' + (f || "#333") + '">' + t + "</text>"; }
  /* personne debout ou assise ; s = echelle ; o: sk, top, bot, hair (couleur), wrap (foulard), sit */
  function H(x, y, s, o) {
    var k = o.sk || SK[0], top = o.top || "#2f5ca3", bot = o.bot || "#333", g = "";
    s = s || 1;
    g += '<g transform="translate(' + x + " " + y + ") scale(" + s + ')">';
    if (o.sit) {
      g += R(-12, 10, 24, 18, bot, 5) + R(-12, 24, 34, 9, bot, 4) + R(14, 30, 8, 24, bot, 3);
    } else {
      g += R(-10, 16, 9, 42, bot, 4) + R(1, 16, 9, 42, bot, 4) + R(-12, 55, 12, 6, "#222", 3) + R(0, 55, 12, 6, "#222", 3);
    }
    g += R(-13, -22, 26, 42, top, 9);
    g += L(-12, -14, -19, 8, k, 6) + L(12, -14, 19, 8, k, 6);
    g += R(-3, -30, 6, 9, k, 2) + E(0, -40, 11, 13, k);
    if (o.wrap) g += '<path d="M-13 -42 Q0 -62 13 -42 L11 -34 Q0 -40 -11 -34 Z" fill="' + o.wrap + '"/>';
    else g += '<path d="M-11 -44 Q0 -56 11 -44 L10 -48 Q0 -52 -10 -48 Z" fill="' + (o.hair || "#1a1210") + '"/>';
    g += C(-4, -40, 1.3, "#111") + C(4, -40, 1.3, "#111") + '<path d="M-4 -34 Q0 -31 4 -34" stroke="#3a1c10" stroke-width="1.5" fill="none"/>';
    return g + "</g>";
  }
  function defs(id, a, b) { return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs>'; }
  function svg(body) { return '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">' + body + "</svg>"; }
  var WAX = function (x, y, w, h, c1, c2) { var s = R(x, y, w, h, c1); for (var i = 0; i < w; i += 14) for (var j = 0; j < h; j += 14) s += C(x + i + 7, y + j + 7, 3.2, c2, 0.9); return s; };
  var SC = {
    office: function () { return svg(defs("o", "#dfe8f3", "#f4f6fa") + R(0, 0, 400, 260, "url(#o)") + R(0, 0, 400, 150, "#e6edf6") + R(30, 22, 100, 60, "#bfe0f5", 4) + L(80, 22, 80, 82, "#fff", 3) + L(30, 52, 130, 52, "#fff", 3) + R(260, 28, 110, 70, "#fff", 4) + R(268, 36, 94, 6, "#2f5ca3") + R(268, 50, 70, 5, "#c2542d") + R(268, 62, 80, 5, "#2f8f5c") + R(268, 74, 55, 5, "#999") + R(0, 205, 400, 55, "#bda987") + E(200, 150, 150, 18, "#d9c9a8") + R(50, 148, 300, 12, "#8b6b45", 5) + R(70, 160, 10, 48, "#6a4f30") + R(320, 160, 10, 48, "#6a4f30") + H(105, 98, 1, { sk: SK[1], top: "#2f5ca3", sit: false }) + H(200, 92, 1, { sk: SK[2], top: "#c2542d", wrap: "#f0b429" }) + H(295, 98, 1, { sk: SK[0], top: "#2f8f5c" }) + R(160, 128, 80, 18, "#222", 3) + R(165, 131, 70, 12, "#9fd0f0", 2) + R(110, 140, 22, 8, "#fff", 2) + C(290, 140, 7, "#fff") + T(18, 245, "Meeting room", 11, "#445")); },
    library: function () { return svg(R(0, 0, 400, 260, "#f1e4cb") + R(0, 0, 400, 150, "#7b5a38") + [0, 1, 2].map(function (r) { var s = R(10, 18 + r * 46, 380, 6, "#4d3620"); var cols = ["#c2542d", "#2f5ca3", "#2f8f5c", "#f0b429", "#8e44ad", "#d9381e"]; for (var i = 0; i < 26; i++) { var h = 28 + (i * 7) % 12; s += R(14 + i * 14.4, 18 + r * 46 - h, 11, h, cols[(i + r) % 6]); } return s; }).join("") + R(0, 170, 400, 90, "#d8c39b") + R(40, 160, 320, 14, "#a07a50", 4) + R(60, 174, 8, 70, "#7a5a36") + R(332, 174, 8, 70, "#7a5a36") + H(130, 120, 1, { sk: SK[1], top: "#2f5ca3", sit: true, bot: "#222" }) + H(270, 120, 1, { sk: SK[2], top: "#8e44ad", wrap: "#2f8f5c", sit: true, bot: "#222" }) + R(105, 142, 34, 10, "#fff", 2) + R(245, 142, 34, 10, "#f0b429", 2) + R(168, 140, 20, 12, "#c2542d") + T(168, 14, "LIBRARY", 12, "#f6e7c9", true)); },
    classroom: function () { return svg(R(0, 0, 400, 260, "#eef3e3") + R(40, 18, 320, 104, "#2e5240", 5) + R(46, 24, 308, 92, "#35604c", 3) + T(105, 50, "English class", 24, "#fff", true) + R(0, 190, 400, 70, "#cdb98f") + [60, 150, 240, 325].map(function (x, i) { return R(x - 34, 160, 68, 8, "#8b6b45", 3) + R(x - 28, 168, 5, 38, "#6a4f30") + R(x + 23, 168, 5, 38, "#6a4f30") + H(x, 112, 0.9, { sk: SK[i], top: ["#c2542d", "#2f5ca3", "#2f8f5c", "#8e44ad"][i], wrap: i % 2 ? null : "#f0b429", sit: true, bot: "#222" }) + R(x - 14, 152, 28, 8, "#fff", 1); }).join("") + H(370, 120, 0.85, { sk: SK[3], top: "#d9381e" }) + L(352, 76, 340, 52, SK[3], 5)); },
    market: function () { return svg(defs("m", "#ffe2a8", "#ffc97a") + R(0, 0, 400, 260, "url(#m)") + E(340, 40, 30, 30, "#fff3c4", 0.8) + R(0, 195, 400, 65, "#c79a63") + PL("20,70 210,70 230,100 0,100", "#c2542d") + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return PL((20 + i * 24) + ",70 " + (44 + i * 24) + ",70 " + (46 + i * 24) + ",100 " + (22 + i * 24) + ",100", i % 2 ? "#f6e7c9" : "#c2542d"); }).join("") + R(20, 100, 8, 100, "#6a4f30") + R(214, 100, 8, 100, "#6a4f30") + R(28, 150, 188, 14, "#8b6b45", 3) + R(34, 164, 176, 36, "#a67c4a") + [0, 1, 2, 3, 4, 5].map(function (i) { return C(55 + i * 28, 140, 12, ["#d9381e", "#f08a1e", "#f6c000", "#5aa02c", "#d9381e", "#f08a1e"][i]); }).join("") + E(150, 126, 30, 10, "#f6e7c9") + [0, 1, 2, 3].map(function (i) { return C(130 + i * 14, 122, 7, "#5aa02c"); }).join("") + R(240, 160, 120, 40, "#a67c4a") + R(246, 140, 108, 22, "#e8dcc0", 3) + [0, 1, 2].map(function (i) { return E(272 + i * 36, 140, 14, 6, ["#f08a1e", "#5aa02c", "#d9381e"][i]); }).join("") + H(110, 80, 1.05, { sk: SK[1], top: "#2f8f5c", wrap: "#f0b429" }) + H(285, 100, 1, { sk: SK[2], top: "#2f5ca3" }) + H(330, 104, 0.95, { sk: SK[0], top: "#f6e7c9", wrap: "#c2542d" }) + T(38, 62, "FRUITS & VEGETABLES", 11, "#fff", true)); },
    bus: function () { return svg(defs("b", "#bfe0f5", "#eaf5fc") + R(0, 0, 400, 260, "url(#b)") + R(0, 175, 400, 85, "#8f8f8f") + R(0, 172, 400, 6, "#cfcfcf") + R(40, 218, 40, 6, "#fff") + R(160, 218, 40, 6, "#fff") + R(280, 218, 40, 6, "#fff") + R(25, 66, 250, 104, "#f0b429", 14) + R(25, 140, 250, 18, "#2f5ca3") + R(25, 118, 250, 6, "#d9381e") + [0, 1, 2, 3, 4].map(function (i) { return R(38 + i * 46, 80, 38, 30, "#bfe0f5", 4); }).join("") + R(246, 80, 24, 30, "#8fc0e0", 4) + E(260, 140, 8, 4, "#fffbe0") + C(80, 172, 20, "#222") + C(80, 172, 9, "#aaa") + C(220, 172, 20, "#222") + C(220, 172, 9, "#aaa") + T(70, 154, "DAKAR  - THIES", 12, "#fff", true) + R(306, 44, 6, 132, "#555") + R(288, 34, 44, 24, "#2f5ca3", 4) + T(296, 51, "BUS", 14, "#fff", true) + H(335, 112, 1.05, { sk: SK[1], top: "#c2542d", wrap: "#fff" }) + H(372, 120, 0.95, { sk: SK[3], top: "#2f8f5c" }) + R(325, 150, 14, 18, "#8b6b45", 3)); },
    kitchen: function () { return svg(R(0, 0, 400, 260, "#f8f0e2") + R(0, 0, 400, 120, "#efe0c4") + R(30, 26, 90, 60, "#fff", 4) + R(36, 32, 78, 48, "#bfe0f5") + R(280, 30, 90, 8, "#8b6b45") + [0, 1, 2].map(function (i) { return R(284 + i * 28, 38, 22, 30, ["#c2542d", "#2f5ca3", "#2f8f5c"][i], 3); }).join("") + R(0, 168, 400, 92, "#c4a672") + R(20, 140, 360, 30, "#d9c9a8", 3) + R(40, 112, 90, 30, "#888", 5) + E(85, 112, 46, 10, "#999") + R(50, 96, 70, 20, "#555", 4) + '<path d="M62 96 q8 -22 16 0 q8 -20 16 0" stroke="#fff" stroke-width="3" fill="none" opacity="0.7"/>' + C(220, 135, 15, "#f6e7c9") + C(250, 133, 12, "#d9381e") + C(276, 134, 10, "#5aa02c") + R(300, 128, 60, 14, "#fff", 3) + H(185, 82, 1.1, { sk: SK[1], top: "#c2542d", wrap: "#f0b429" }) + L(165, 62, 130, 112, SK[1], 5) + T(30, 245, "Thieboudienne", 13, "#6a4f30", true)); },
    beach: function () { return svg(defs("s", "#8fd0f5", "#e6f5fc") + R(0, 0, 400, 260, "url(#s)") + C(330, 52, 28, "#ffd34d") + R(0, 118, 400, 46, "#2fa6d8") + R(0, 132, 400, 4, "#8fd9f5") + R(0, 160, 400, 100, "#f2dca6") + PL("40,150 110,150 100,162 52,162", "#d9381e") + R(72, 142, 6, 20, "#6a4f30") + PL("40,150 75,128 110,150", "#f0b429") + R(250, 100, 8, 54, "#6a4f30") + '<path d="M254 100 q-30 -20 -50 6 M254 100 q30 -20 50 6 M254 100 q-4 -34 -22 -38 M254 100 q10 -30 34 -30" stroke="#2f8f5c" stroke-width="5" fill="none"/>' + H(160, 150, 0.9, { sk: SK[0], top: "#2f5ca3", bot: "#f6e7c9" }) + H(205, 156, 0.9, { sk: SK[2], top: "#c2542d", bot: "#f6e7c9", wrap: "#fff" }) + H(310, 160, 0.8, { sk: SK[3], top: "#2f8f5c", bot: "#222" }) + E(130, 238, 40, 8, "#6a4f30", 0.4) + C(60, 220, 14, "#fff") + '<path d="M46 220 h28 M60 206 v28" stroke="#d9381e" stroke-width="2"/>'); },
    shop: function () { return svg(R(0, 0, 400, 260, "#f1f1ea") + R(0, 190, 400, 70, "#c3bda8") + R(20, 40, 150, 150, "#d6c19a", 4) + [0, 1, 2].map(function (i) { var s = R(26, 70 + i * 40, 138, 6, "#8b6b45"); for (var j = 0; j < 6; j++) s += R(32 + j * 22, 52 + i * 40, 16, 18, ["#c2542d", "#2f5ca3", "#2f8f5c", "#f0b429", "#8e44ad", "#d9381e"][(i + j) % 6], 2); return s; }).join("") + R(200, 130, 170, 28, "#8b6b45", 4) + R(205, 158, 160, 34, "#a67c4a") + R(300, 110, 40, 22, "#222", 3) + R(305, 114, 30, 14, "#9fd0f0") + H(250, 82, 1, { sk: SK[1], top: "#2f8f5c", wrap: "#f0b429" }) + H(345, 92, 1, { sk: SK[2], top: "#2f5ca3" }) + R(330, 126, 20, 16, "#c2542d", 3) + R(140, 14, 120, 22, "#c2542d", 5) + T(172, 30, "SHOP", 14, "#fff", true)); },
    gym: function () { return svg(R(0, 0, 400, 260, "#ebe7f4") + R(0, 0, 400, 130, "#dcd6ec") + R(0, 195, 400, 65, "#b4abc8") + R(24, 30, 80, 70, "#fff", 4) + L(24, 65, 104, 65, "#cfc8e0", 2) + R(270, 30, 110, 12, "#8e44ad", 3) + [0, 1, 2].map(function (i) { return C(290 + i * 38, 70, 16, ["#c2542d", "#2f5ca3", "#2f8f5c"][i]); }).join("") + R(60, 140, 130, 8, "#333", 3) + R(52, 118, 14, 52, "#222", 3) + R(184, 118, 14, 52, "#222", 3) + H(125, 112, 1.05, { sk: SK[1], top: "#c2542d", bot: "#222" }) + L(106, 96, 100, 124, SK[1], 5) + L(144, 96, 150, 124, SK[1], 5) + E(300, 215, 60, 12, "#2f8f5c") + H(300, 160, 0.95, { sk: SK[2], top: "#2f5ca3", bot: "#222", sit: true }) + T(170, 245, "GYM", 12, "#5a4f78", true)); },
    tech: function () { return svg(R(0, 0, 400, 260, "#e7edf6") + R(0, 200, 400, 60, "#c4b08a") + R(30, 40, 100, 70, "#fff", 4) + R(38, 50, 40, 6, "#2f5ca3") + R(38, 64, 70, 5, "#c2542d") + R(38, 78, 55, 5, "#2f8f5c") + R(110, 118, 190, 14, "#9a7a4e", 4) + R(130, 132, 8, 70, "#7a5a36") + R(272, 132, 8, 70, "#7a5a36") + R(150, 64, 120, 62, "#2c3446", 5) + R(157, 70, 106, 50, "#9fd0f0", 2) + R(166, 78, 40, 6, "#2f5ca3") + R(166, 90, 70, 5, "#fff") + R(166, 100, 54, 5, "#fff") + R(205, 126, 10, 10, "#444") + R(160, 134, 100, 5, "#444", 2) + R(300, 96, 22, 36, "#222", 4) + R(303, 100, 16, 26, "#7fd0a0") + H(70, 150, 1.05, { sk: SK[3], top: "#8e44ad", sit: true, bot: "#222" }) + L(86, 146, 130, 128, SK[3], 5) + R(325, 108, 40, 24, "#f6e7c9", 3)); },
    cafe: function () { return svg(R(0, 0, 400, 260, "#f7e7d0") + R(0, 0, 400, 100, "#ead2ad") + R(130, 14, 140, 34, "#c2542d", 6) + T(146, 38, "RESTAURANT", 17, "#fff", true) + C(50, 70, 14, "#f0b429", 0.8) + C(350, 70, 14, "#f0b429", 0.8) + R(0, 190, 400, 70, "#b79b73") + [60, 200, 340].map(function (x, i) { return E(x, 165, 42, 10, "#8b6b45") + R(x - 4, 165, 8, 36, "#6a4f30") + E(x - 12, 160, 10, 3, "#fff") + E(x + 14, 158, 8, 3, "#fff") + R(x + 2, 146, 10, 12, "#f6e7c9", 2); }).join("") + H(40, 108, 1, { sk: SK[1], top: "#2f5ca3", sit: true }) + H(100, 112, 1, { sk: SK[2], top: "#c2542d", wrap: "#2f8f5c", sit: true }) + H(180, 108, 1, { sk: SK[0], top: "#8e44ad", sit: true }) + H(235, 112, 1, { sk: SK[4], top: "#f0b429", sit: true }) + H(350, 92, 1.05, { sk: SK[3], top: "#fff", bot: "#222" }) + R(330, 130, 30, 6, "#ccc", 2)); },
    family: function () { return svg(R(0, 0, 400, 260, "#f6edd9") + R(0, 0, 400, 150, "#f0dfba") + R(30, 30, 80, 70, "#bfe0f5", 3) + L(70, 30, 70, 100, "#fff", 3) + WAX(290, 28, 80, 60, "#2f5ca3", "#f0b429") + R(0, 200, 400, 60, "#b79b73") + R(70, 150, 260, 54, "#a9714b", 12) + R(80, 120, 240, 46, "#b9835a", 12) + H(130, 98, 1.05, { sk: SK[1], top: "#c2542d", wrap: "#f0b429", sit: true, bot: "#222" }) + H(200, 94, 1.1, { sk: SK[0], top: "#2f5ca3", sit: true, bot: "#222" }) + H(270, 98, 1.05, { sk: SK[2], top: "#2f8f5c", wrap: "#fff", sit: true, bot: "#222" }) + H(165, 130, 0.6, { sk: SK[3], top: "#d9381e", sit: true, bot: "#222" }) + H(235, 132, 0.55, { sk: SK[4], top: "#8e44ad", sit: true, bot: "#222" })); },
    airport: function () { return svg(defs("a", "#cfe6f5", "#eef6fb") + R(0, 0, 400, 260, "url(#a)") + R(0, 0, 400, 150, "#e3edf5") + R(20, 20, 360, 70, "#bfe0f5", 3) + PL("250,40 340,60 250,66", "#fff") + R(240, 52, 90, 12, "#fff", 6) + R(0, 190, 400, 70, "#bdbdbd") + R(26, 118, 150, 70, "#dcd0b4", 4) + R(26, 100, 150, 18, "#2f5ca3", 3) + T(40, 114, "CHECK-IN", 11, "#fff", true) + R(40, 128, 50, 28, "#2c3446", 3) + R(44, 132, 42, 18, "#9fd0f0") + H(230, 130, 1.05, { sk: SK[1], top: "#2f5ca3" }) + H(285, 134, 1, { sk: SK[2], top: "#c2542d", wrap: "#f0b429" }) + R(246, 176, 30, 22, "#a33f3f", 4) + R(260, 172, 6, 6, "#555") + R(308, 178, 28, 20, "#2f8f5c", 4) + R(318, 174, 6, 6, "#555") + H(350, 138, 0.95, { sk: SK[3], top: "#8e44ad" }) + T(250, 245, "DEPARTURES", 12, "#445", true)); }
  };
  var PH = {
    toefl: ["Warm-up Interview", "Campus Life Questions", "Describe the Image", "Independent Opinion"],
    toeic: ["Personal Information", "Respond to Questions", "Describe a Picture", "Express an Opinion"],
    cambridge: ["Part 1 · Interview", "Part 1 · Daily Life", "Part 2 · The Photo", "Part 3 · Discussion"],
    duolingo: ["Warm-up", "Speak About the Topic", "Describe the Image", "Extended Speaking"],
    pte: ["Personal Introduction", "Answer Short Questions", "Describe Image", "Respond to a Situation"]
  };
  var INTRO = "Regarde bien la photo pendant quelques secondes. Tu vas décrire ce que tu vois : les personnes, le lieu et ce qu'elles font. Réponds en phrases complètes.";
  function mk(exam, id, topic, scene, a, b, c, d, lvl) {
    var L = PH[exam];
    return { exam: exam, id: exam + "-" + id, topic: topic, scene: scene, lvl: lvl || "A2", phases: [
      { id: "1a", label: L[0], questions: a }, { id: "1b", label: L[1], questions: b },
      { id: "2a", label: L[2], introFR: INTRO, questions: c }, { id: "2b", label: L[3], questions: d }] };
  }
  var TESTS = [
    mk("toefl", "library", "Campus Library", "library",
      ["What is your name?", "Where are you from?", "What do you study or what do you do?"],
      ["Do you like to study alone or with friends?", "Where do you usually study?", "How do you prepare for an exam?", "What is the most difficult subject for you?"],
      ["What can you see in this picture?", "What do you think the students are doing?"],
      ["Some students prefer to study in a library. Others prefer to study at home. Which do you prefer?", "Why is that better for you?", "Give one example from your own life."]),
    mk("toefl", "course", "Choosing a Course", "classroom",
      ["Can you tell me your name?", "Which city do you live in?", "Why are you learning English?"],
      ["What kind of courses do you enjoy?", "Do you prefer small classes or big classes?", "What do you do when you do not understand a lesson?", "Do you like homework? Why or why not?"],
      ["Describe the people in this classroom.", "What is the teacher probably doing?"],
      ["Is it better to learn from a teacher or from the internet?", "Explain your choice with reasons.", "What advice would you give to a new student?"]),
    mk("toefl", "student-life", "Student Life", "cafe",
      ["Tell me your name and your age.", "What do you like to do in your free time?", "Who is your best friend?"],
      ["Do you like to eat on campus or at home?", "How do you travel to school or to work?", "What do you do on weekends?", "Do you work and study at the same time?"],
      ["What is happening in this picture?", "What are the people talking about, do you think?"],
      ["Do you think students should have a part-time job?", "Why do you think so?", "Tell me about a time you were very busy."]),
    mk("toeic", "office", "Office Meeting", "office",
      ["Please tell me your name.", "What is your job?", "Where do you work?"],
      ["What time does your workday start?", "Do you prefer to work alone or in a team?", "How do you go to work every day?", "What do you usually do at lunch time?"],
      ["Describe this picture in detail.", "What are the people in the picture doing?"],
      ["Do you think meetings are useful at work?", "Explain your opinion with two reasons.", "How can a company make meetings shorter?"]),
    mk("toeic", "business-trip", "Business Trip", "airport",
      ["What is your name?", "What kind of work do you do?", "How long have you worked there?"],
      ["Have you ever travelled for work?", "What do you take with you on a trip?", "Do you prefer to travel by plane or by bus?", "Where would you like to go for a meeting?"],
      ["What can you see in this airport picture?", "What are the travellers going to do next?"],
      ["Is it better to have a meeting online or in person?", "Give reasons for your answer.", "What problems can happen when you travel for work?"]),
    mk("toeic", "customer", "Customer Service", "shop",
      ["Please say your name.", "Do you work with customers?", "What do you sell or what service do you offer?"],
      ["How do you greet a new customer?", "What do you say when a customer is angry?", "How do you give the price of a product?", "What do you say at the end of a sale?"],
      ["Describe what you see in this shop.", "What is the customer doing?"],
      ["What makes good customer service?", "Explain with examples.", "Why do customers leave a shop and never come back?"]),
    mk("cambridge", "family", "Family Weekend", "family",
      ["What is your name?", "Where do you live?", "Who do you live with?"],
      ["What do you like to do at the weekend?", "Do you help at home? What do you do?", "What is your favourite meal?", "How often do you see your family?"],
      ["What can you see in the photo?", "Where are the people, and what are they doing?"],
      ["Do you prefer to spend time with family or with friends?", "Why?", "What can families do together on Sunday?"]),
    mk("cambridge", "shopping", "Shopping Day", "market",
      ["Tell me your name, please.", "Where are you from?", "What do you do every day?"],
      ["Where do you buy your food?", "Do you like shopping? Why or why not?", "What did you buy last week?", "Do you go shopping alone or with someone?"],
      ["Look at the photo. What can you see?", "What do you think they are buying?"],
      ["Do you prefer to shop in a market or in a big shop?", "Why do you prefer it?", "What do you do when something is too expensive?"]),
    mk("cambridge", "beach", "Holiday at the Beach", "beach",
      ["What is your name?", "How old are you?", "What is your favourite place in Senegal?"],
      ["Do you like the sea? Why?", "What do you do on holiday?", "Who do you go on holiday with?", "What do you take to the beach?"],
      ["What can you see in this photo?", "What are the people doing at the beach?"],
      ["Which is better for a holiday, the beach or a big city?", "Tell me why.", "Describe your best holiday."]),
    mk("duolingo", "market", "At the Market", "market",
      ["Say your name.", "Where are you from?", "What do you do?"],
      ["Describe a market you know.", "What fruits and vegetables do you like?", "How do you ask for a lower price?", "Who do you go to the market with?"],
      ["Look at the picture and say what you see.", "What do you think will happen next?"],
      ["Talk about your favourite place to buy food. Say what you buy and why you like it.", "Talk about a time you made a good deal.", "Explain how a market is different from a supermarket."]),
    mk("duolingo", "transport", "Public Transport", "bus",
      ["Tell me your name.", "How old are you?", "Do you work or study?"],
      ["How do you go to work or school?", "Do you like to take the bus? Why?", "How long is your trip every day?", "What do you do on the bus?"],
      ["Describe the picture in a few sentences.", "Who do you see at the bus stop?"],
      ["Talk about the good and bad things about public transport.", "Explain what a city can do to make travel easier.", "Describe a long trip you remember."]),
    mk("duolingo", "cooking", "Cooking at Home", "kitchen",
      ["What is your name?", "Where do you live?", "Who cooks at your home?"],
      ["What is your favourite dish?", "Can you cook? What can you cook?", "What do you eat for breakfast?", "Do you cook for friends?"],
      ["What can you see in this kitchen?", "What is the person doing?"],
      ["Explain how to cook a simple meal you like.", "Talk about a special meal with your family.", "Is it better to cook at home or to eat in a restaurant? Why?"]),
    mk("pte", "health", "Health and Fitness", "gym",
      ["Please introduce yourself.", "Where are you from?", "What do you like to do after work?"],
      ["Do you play any sport?", "How often do you exercise?", "What do you do when you feel tired?", "Why is water important?"],
      ["Describe what you see in the image.", "Why do people go to a place like this?"],
      ["Your friend wants to be healthier but has little time. What advice do you give?", "Explain why sleep matters.", "How can a company help workers stay healthy?"]),
    mk("pte", "technology", "Technology Daily", "tech",
      ["Tell me about yourself.", "What is your job?", "Where do you work or study?"],
      ["What do you use your phone for?", "Do you use a computer every day?", "What app do you use the most?", "Is the internet easy to find in your area?"],
      ["Describe the image in detail.", "What technology can you see?"],
      ["A friend asks you how to use video calls. Explain what to do.", "Talk about one good and one bad thing about phones.", "How can technology help a small business?"]),
    mk("pte", "restaurant", "Local Restaurant", "cafe",
      ["Please say your full name.", "What is your favourite food?", "Where do you usually eat lunch?"],
      ["Do you eat in restaurants?", "What do you order when you go out?", "Do you prefer hot or cold drinks?", "How do you ask for the bill?"],
      ["Describe this restaurant scene.", "What are the waiters and customers doing?"],
      ["You ordered a meal but the wrong dish arrived. What do you say to the waiter?", "Describe the best restaurant you know.", "What makes a good restaurant?"])
    ,mk("toefl", "online", "Online Learning", "tech",
      ["Tell me your name and where you study or work.", "How long have you been learning English?", "What are your goals for the next year?"],
      ["Is learning online as good as learning in a classroom?", "What technology do you use to study?", "Describe a skill you learned recently.", "What distracts you when you study?"],
      ["Describe the image. What is the person doing?", "How can this kind of technology help students?"],
      ["Some people say that universities should be free for everyone. Do you agree or disagree?", "Give two reasons and one example.", "What could be a problem with your opinion?"], "B1"),
    mk("toefl", "city-village", "City or Village Life", "bus",
      ["What is your name and what do you do?", "Where did you grow up?", "Do you plan to stay in your town in the future?"],
      ["What do you like most about the place where you live?", "How do people travel in your city?", "Is it easy to find a job where you live?", "What would you change in your neighbourhood?"],
      ["Describe the scene in the picture.", "What problems might people have in this place?"],
      ["Do you think young people should move to big cities to find work? Why or why not?", "Give examples from your own experience.", "How does life change when people leave their village?"], "B1"),
    mk("toefl", "group-work", "Group Project", "gym",
      ["Please introduce yourself.", "What is your favourite activity after class or work?", "Who inspires you the most?"],
      ["Do you prefer to work in a group or alone?", "What is your role when you work in a team?", "How do you solve a disagreement with a colleague?", "Describe a team project you enjoyed."],
      ["What is happening in the picture?", "How do the people in the picture work together?"],
      ["Is it better to be a leader or a team member? Explain your choice.", "Support your answer with details.", "How can a team become stronger?"], "B1"),
    mk("toeic", "interview", "Job Interview", "office",
      ["Please state your name and your current job.", "How long have you worked in this field?", "Why do you want a new job?"],
      ["What are your main strengths at work?", "Tell me about a difficult situation at work.", "How do you manage your time?", "Where do you see yourself in five years?"],
      ["Describe this picture. Who is speaking and who is listening?", "What do you think they are discussing?"],
      ["Do you think experience is more important than education when you hire someone?", "Explain your opinion with reasons.", "What question would you ask a new employer?"], "B1"),
    mk("toeic", "event", "Planning an Event", "cafe",
      ["What is your name?", "Do you organise events in your work or community?", "What was the last event you attended?"],
      ["What do you need to plan a meeting or a party?", "How do you invite people?", "Who helps you prepare an event?", "What do you do if the place is too small?"],
      ["Describe the place in the picture.", "Would this place be good for a small event? Why?"],
      ["Is it better to organise an event in a restaurant or at the office?", "Give two reasons.", "How can you keep a budget under control?"], "B1"),
    mk("toeic", "refund", "Complaint and Refund", "shop",
      ["Please say your name.", "Have you ever returned something to a shop?", "What do you usually buy online or in a shop?"],
      ["What do you do if a product does not work?", "How do you ask for a refund politely?", "What information do you give a customer service agent?", "How long should a company take to answer a complaint?"],
      ["What can you see in the picture?", "What problem could the customer have?"],
      ["Imagine you bought a phone that stopped working after two days. What do you say to the manager?", "What solution do you want?", "Why is good after-sales service important for a business?"], "B1"),
    mk("cambridge", "birthday", "Birthday Party", "family",
      ["What is your name and how old are you?", "What do you do in your free time?", "Tell me about your family."],
      ["How do you celebrate your birthday?", "Who was at your last party?", "What present would you like to receive?", "Do you prefer a big party or a quiet evening?"],
      ["Describe what is happening in the photo.", "How do you think the people feel?"],
      ["Do you think it is important to celebrate birthdays? Why?", "Tell me about the best party you have been to.", "What can you do if a friend is sad on their birthday?"], "B1"),
    mk("cambridge", "hobbies", "Sports and Hobbies", "gym",
      ["Tell me your name and where you live.", "What sport do you like?", "How often do you practise it?"],
      ["Which hobby would you like to try?", "Do you prefer to play or to watch sport?", "Who do you do sport with?", "How much does it cost to practise your hobby?"],
      ["What can you see in the photo?", "Why do you think these people chose this activity?"],
      ["Is it better to do sport in a club or alone? Explain.", "What can sport teach young people?", "Describe a match or a race that you remember."], "B1"),
    mk("cambridge", "city-trip", "A Trip to the City", "bus",
      ["What is your name?", "Which city do you know best?", "How do you usually travel to the city?"],
      ["What would you do on a day trip to Dakar?", "What do you take with you when you travel?", "Do you prefer to travel with friends or with family?", "Tell me about a trip you want to make."],
      ["Describe the people and the vehicle in the photo.", "Where do you think they are going?"],
      ["Which is better for a long trip, the bus or the car? Give reasons.", "What problems can happen on a journey?", "How can you save money when you travel?"], "B1"),
    mk("duolingo", "memorable", "A Memorable Day", "beach",
      ["Say your name and your age.", "Where do you live?", "What did you do yesterday?"],
      ["Describe a day you will never forget.", "Who was with you that day?", "How did you feel at the end of the day?", "What did you learn from that experience?"],
      ["Describe the picture in as much detail as you can.", "Say what the people might talk about."],
      ["Talk about the best day of your life and why it was special.", "Explain what you would do differently if you could live that day again.", "Give advice to a friend who wants to make good memories."], "B1"),
    mk("duolingo", "tech-friends", "Technology and Friends", "tech",
      ["What is your name?", "What do you do?", "How often do you use your phone?"],
      ["How do you keep in touch with friends who live far away?", "Do you prefer to call or to send a message?", "What apps do you use every day?", "Is it healthy to spend a lot of time online?"],
      ["Look at the picture and describe it.", "What do you think the person is looking at?"],
      ["Talk about the way technology has changed friendships.", "Explain one danger of social media and how to avoid it.", "Describe how you would teach an older person to use a smartphone."], "B1"),
    mk("duolingo", "neighbourhood", "My Neighbourhood", "market",
      ["Please say your name.", "Where do you live in the city or the village?", "Who are your neighbours?"],
      ["What shops are near your house?", "Is your neighbourhood safe and clean?", "What do people do in the evening there?", "How do neighbours help each other?"],
      ["Describe what you see in the picture.", "How is this place different from your neighbourhood?"],
      ["Talk about what makes a good neighbourhood.", "Explain what you would improve if you were the mayor.", "Describe a festival or an event in your area."], "B1"),
    mk("pte", "bus-problem", "Public Transport Problem", "bus",
      ["Please introduce yourself.", "Where do you work or study?", "How do you travel there?"],
      ["Is public transport good in your city?", "What is the biggest problem for travellers?", "How much do you spend on transport each week?", "What would make your journey better?"],
      ["Describe the image in detail.", "What problems could passengers have here?"],
      ["Your bus is always late and you will miss an important meeting. What do you say to your manager?", "Suggest two solutions to the problem.", "Explain how the city can improve its buses."], "B1"),
    mk("pte", "abroad", "Studying Abroad", "airport",
      ["Tell me about yourself.", "What would you like to study?", "Which country would you like to visit?"],
      ["What are the benefits of studying in another country?", "What would be difficult for you abroad?", "How would you stay in touch with your family?", "What documents do you need for a trip abroad?"],
      ["Describe what you see in the image.", "What are the travellers feeling, do you think?"],
      ["A friend is afraid to study abroad. What advice do you give?", "Explain the good and bad sides of living in another country.", "How can a student find a part-time job abroad?"], "B1"),
    mk("pte", "remote-work", "Working from Home", "family",
      ["Please say your full name.", "What is your job?", "Where do you work, at home or in an office?"],
      ["What are the advantages of working from home?", "How do you stay focused at home?", "What tools do you need for remote work?", "Do you miss your colleagues when you work alone?"],
      ["Describe the image in detail.", "What kind of work could this person be doing?"],
      ["Your company wants everyone to work from home two days a week. Give your opinion.", "Explain how to keep good communication in a remote team.", "Describe a typical day of someone who works from home."], "B1")
  ];
  /* Reponses types : description de photo (par scene) et opinion (par test). Servent au pourcentage de precision. */
  var M2A = {
    office: ["In the picture, I can see three people in a meeting room. They are sitting around a table and talking.", "There is a screen on the table and the colleagues are looking at it together.", "The photo shows a business meeting in an office."],
    library: ["In the picture, I can see two students in a library. They are sitting at a desk with books.", "There are many books on the shelves behind them and the students are studying.", "The photo shows a quiet place where people read and learn."],
    classroom: ["In the picture, I can see a classroom with four students. They are sitting at their desks.", "There is a green board at the front with the words English class.", "The photo shows students who are learning English together."],
    market: ["In the picture, I can see a market with fruits and vegetables. There are tomatoes, oranges and green fruits.", "Two people are standing near the stall and they are buying food.", "The photo shows a busy market where people buy and sell."],
    bus: ["In the picture, I can see a yellow bus at a bus stop. There are people waiting for the bus.", "A man and a woman are standing near the stop and they look ready to travel.", "The photo shows public transport in a city."],
    kitchen: ["In the picture, I can see a kitchen. A person is cooking near the table.", "There is a pot on the stove and vegetables on the counter.", "The photo shows someone who prepares a meal at home."],
    beach: ["In the picture, I can see a beach with the sea and a bright sun. Three people are on the sand.", "There is a red umbrella and the people are relaxing.", "The photo shows people on holiday at the beach."],
    shop: ["In the picture, I can see a shop with shelves full of products. A customer is standing near the counter.", "Another person is looking at the products on the shelf.", "The photo shows people who are shopping in a supermarket."],
    gym: ["In the picture, I can see a health club. One person is lifting weights and another is doing exercise on a mat.", "They are practising sport to stay healthy.", "The photo shows people who are exercising in a gym."],
    tech: ["In the picture, I can see a person at a desk with a big computer screen and a phone.", "The person is using technology to work or to study.", "The photo shows a modern workplace with a computer."],
    cafe: ["In the picture, I can see a restaurant. Three people are sitting at tables with cups and plates.", "They are eating, drinking and talking together.", "The photo shows customers in a restaurant."],
    family: ["In the picture, I can see a family at home. Four people are sitting together near a sofa.", "They are smiling and spending time together.", "The photo shows a happy family in their living room."],
    airport: ["In the picture, I can see an airport. Two travellers are standing near the check-in desk with their bags.", "A plane is flying in the sky behind the building.", "The photo shows people who are going to travel."]
  };
  var M2B = {
    "toefl-library": ["I prefer to study in a library because it is quiet and I can focus.", "For example, at home my family talks and I cannot concentrate."],
    "toefl-course": ["I think a teacher is better because he can explain and answer my questions.", "The internet is useful too, but I do not always understand alone."],
    "toefl-student-life": ["I think students should have a part-time job because they learn to manage money.", "However, they must not forget their studies."],
    "toefl-online": ["I agree that universities should be free because education is a right for everyone.", "For example, many talented students cannot pay the fees."],
    "toefl-city-village": ["I think young people should move to the city because there are more jobs.", "However, they can also build a business in their village."],
    "toefl-group-work": ["I think it is better to be a team member because every person has a role.", "A good leader also listens to the team and helps everyone."],
    "toeic-office": ["I think meetings are useful because they help the team share information.", "They should be short and have a clear plan."],
    "toeic-business-trip": ["I think meeting in person is better because we can build trust.", "Online meetings are cheaper and save time."],
    "toeic-customer": ["Good customer service means to listen, to be polite and to solve the problem quickly.", "Customers come back when they feel respected."],
    "toeic-interview": ["I think experience is very important because it shows that you can do the job.", "Education is also useful because it gives you a good base."],
    "toeic-event": ["I think a restaurant is better for an event because the food and the room are ready.", "The office is cheaper but less comfortable."],
    "toeic-refund": ["Good morning, I bought this phone two days ago and it does not work. I would like a refund or a new phone.", "Good after-sales service makes customers trust the company."],
    "cambridge-family": ["I prefer to spend time with my family because they know me well.", "On Sunday we can cook, eat and talk together."],
    "cambridge-shopping": ["I prefer the market because the products are fresh and the prices are lower.", "When something is too expensive, I ask for a discount."],
    "cambridge-beach": ["I think the beach is better for a holiday because it is calm and the air is fresh.", "A big city is exciting but it is noisy."],
    "cambridge-birthday": ["I think it is important to celebrate birthdays because it makes people feel special.", "The best party I went to was with my family and friends."],
    "cambridge-hobbies": ["I think it is better to do sport in a club because you meet people and you have a coach.", "Sport teaches young people discipline and teamwork."],
    "cambridge-city-trip": ["I think the bus is better for a long trip because it is cheaper.", "To save money, we can travel with friends and bring our own food."],
    "duolingo-market": ["My favourite place to buy food is the market near my house.", "I buy fresh vegetables and fish because the quality is good and the prices are fair."],
    "duolingo-transport": ["Public transport is cheap but it is often crowded and slow.", "A city can build more bus lines and respect the timetable."],
    "duolingo-cooking": ["First, I wash the rice and I cook the fish with onions and tomatoes.", "I prefer to cook at home because it is cheaper and healthier."],
    "duolingo-memorable": ["The best day of my life was when I passed my exam and my family was proud of me.", "I would not change anything because it was perfect."],
    "duolingo-tech-friends": ["Technology helps friends to stay in touch, but people can also spend too much time on their phones.", "To avoid problems, we should limit screen time and meet in person."],
    "duolingo-neighbourhood": ["A good neighbourhood is safe, clean and friendly, with shops and schools nearby.", "If I were the mayor, I would improve the roads and the lighting."],
    "pte-health": ["I would advise my friend to walk for twenty minutes every day and to drink water.", "Sleep is important because the body needs rest to stay strong."],
    "pte-technology": ["First, open the app, then press the video button and wait for your friend to answer.", "Phones are useful and fast, but they can distract us."],
    "pte-restaurant": ["Excuse me, I ordered chicken but you brought fish. Could you please change it?", "A good restaurant has tasty food, clean tables and friendly staff."],
    "pte-bus-problem": ["Good morning, my bus was late again and I will miss the meeting. I am very sorry.", "The city can add more buses and publish a clear timetable."],
    "pte-abroad": ["I would tell my friend that studying abroad is a great chance to learn and to meet new people.", "It can be hard because you are far from your family, but you grow stronger."],
    "pte-remote-work": ["I think working from home two days a week is a good idea because it saves time and money.", "To communicate well, the team should have a daily call and use a group chat."]
  };
  var M1 = {
    toefl: ["My name is [nom] and I study English because I want to continue my studies.", "I am from Thiès in Senegal and I live with my family.", "In my free time, I like to read and to study with my friends."],
    toeic: ["My name is [nom] and I work as a [métier] in Thiès.", "I have worked in this job for three years and I like working with customers.", "I start work at eight o'clock and I finish at five."],
    cambridge: ["My name is [nom] and I am [âge] years old. I live in Thiès with my family.", "In my free time I like to listen to music and to play football with my friends.", "I usually go to the market on Saturday with my mother."],
    duolingo: ["My name is [nom] and I am from Senegal. I live in Thiès.", "I work as a [métier] and I like my job.", "Yesterday I went to the market and I cooked dinner for my family."],
    pte: ["My name is [nom] and I am from Senegal. I work as a [métier].", "After work I like to relax, to read and to see my friends.", "I usually have lunch at home with my family."]
  };
  var DEFAULT_MODELS = null;
  function setModels(t) {
    try {
      if (!DEFAULT_MODELS) DEFAULT_MODELS = { "1": MODEL_ANSWERS["1"].slice(), "2a": MODEL_ANSWERS["2a"].slice(), "2b": MODEL_ANSWERS["2b"].slice() };
      var ex = t && TESTS.indexOf(t) >= 0;
      MODEL_ANSWERS["1"] = ex ? M1[t.exam].slice() : DEFAULT_MODELS["1"];
      MODEL_ANSWERS["2a"] = ex ? M2A[t.scene].slice() : DEFAULT_MODELS["2a"];
      MODEL_ANSWERS["2b"] = ex ? (M2B[t.id] || DEFAULT_MODELS["2b"]).slice() : DEFAULT_MODELS["2b"];
    } catch (e) {}
  }
  /* Vraies photos : si photos/examens/<id>.jpg existe, elle remplace le dessin. */
  var PHOTO_OK = {};
  function sonder(t) {
    return new Promise(function (res) {
      if (PHOTO_OK[t.id] !== undefined) return res();
      var urls = ["photos/examens/" + t.id + ".jpg", "photos/examens/scene-" + t.scene + ".jpg"], k = 0, done = false;
      function fin(u) {
        if (done) return; done = true; PHOTO_OK[t.id] = !!u;
        if (u) TEST_PHOTOS[t.id] = '<img src="' + u + '" alt="Photo du test" style="width:100%;max-height:260px;object-fit:cover;border-radius:12px">';
        res();
      }
      function essai() {
        if (k >= urls.length) return fin(null);
        var u = urls[k++], im = new Image();
        im.onload = function () { fin(u); }; im.onerror = essai; im.src = u;
      }
      setTimeout(function () { fin(null); }, 3000);
      essai();
    });
  }
  var EXAMS = [["ielts", "IELTS"], ["toefl", "TOEFL"], ["toeic", "TOEIC"], ["cambridge", "Cambridge"], ["duolingo", "Duolingo"], ["pte", "PTE"]];
  var NAMES = { ielts: "IELTS Life Skills A1", toefl: "TOEFL Speaking", toeic: "TOEIC Speaking", cambridge: "Cambridge A2/B1 Speaking", duolingo: "Duolingo English Test", pte: "PTE Academic Speaking" };
  TESTS.forEach(function (t) { try { TEST_PHOTOS[t.id] = SC[t.scene](); } catch (e) {} });
  var cur = "ielts";
  try { var sv = localStorage.getItem("diisoo_exam"); if (sv && NAMES[sv]) cur = sv; } catch (e) {}
  function list(ex) { return TESTS.filter(function (t) { return t.exam === ex; }); }
  function chipCls(on) { return "px-3 py-1.5 rounded-full text-[11px] font-bold border transition " + (on ? "bg-[#C2542D] border-[#E1693F] text-white" : "bg-[#0B0F1C] border-[#1E2740] text-[#A69C86]"); }
  function setExam(ex) {
    cur = ex;
    try { localStorage.setItem("diisoo_exam", ex); } catch (e) {}
    try {
      if (ex === "ielts") { if (currentTest && /^[a-z]+-/.test(currentTest.id) && TESTS.some(function (t) { return t.id === currentTest.id; })) currentTest = TEST_BANK[0]; }
      else { var l = list(ex); if (!l.some(function (t) { return currentTest && t.id === currentTest.id; })) currentTest = l[0]; }
    } catch (e) {}
    window.renderTestPicker();
  }
  function ui() {
    var box = $("test-topic-buttons"); if (!box) return;
    var old = $("autres-examens"); if (old) old.style.display = "none";
    var tabs = $("exam-tabs");
    if (!tabs) { tabs = document.createElement("div"); tabs.id = "exam-tabs"; tabs.className = "flex flex-wrap justify-center gap-1.5"; box.parentNode.insertBefore(tabs, box); }
    tabs.innerHTML = "";
    EXAMS.forEach(function (e) {
      var b = document.createElement("button"); b.type = "button"; b.className = chipCls(e[0] === cur); b.textContent = e[1];
      b.onclick = function () { setExam(e[0]); }; tabs.appendChild(b);
    });
    var lab = $("test-phase-label"), top = $("test-topic-label");
    if (cur === "ielts") { window.__examList = null; if (top && /^Simulateur /.test(top.textContent)) top.textContent = "Simulateur IELTS Life Skills A1"; return; }
    var l = list(cur); window.__examList = l;
    if (top && /^Simulateur /.test(top.textContent)) top.textContent = "Simulateur " + NAMES[cur];
    if (lab && /tests? (complets?)?/.test(lab.textContent) && !/^Phase/.test(lab.textContent)) lab.textContent = l.length + " tests complets";
    var seen = {}; try { (JSON.parse(localStorage.getItem("diisoo_tests") || "[]") || []).forEach(function (h) { if (h && h.topic) seen[h.topic] = 1; }); } catch (e) {}
    box.innerHTML = "";
    l.forEach(function (t, idx) {
      var verrou = idx >= 1 && !aAcces("premium");
      var active = currentTest && currentTest.id === t.id;
      var b = document.createElement("button");
      b.className = "w-full text-left px-4 py-3 rounded-xl text-sm font-semibold border transition " + (active ? "bg-[#C2542D] border-[#E1693F] text-white" : "bg-[#141A2B] border-[#1E2740] text-[#C9BFA8]");
      b.textContent = (verrou ? "⭐ " : "") + (seen[t.topic] ? "✅ " : "") + "Test : " + t.topic + " · " + t.lvl;
      b.onclick = verrou ? function () { toast("Ce test est réservé aux abonnés Premium."); openPremium(); }
        : function () { currentTest = t; window.renderTestPicker(); runTest(); };
      box.appendChild(b);
    });
  }
  var orp = window.renderTestPicker;
  if (typeof orp !== "function") return;
  window.renderTestPicker = function () { var r = orp.apply(this, arguments); try { ui(); } catch (e) { console.warn("[diisoo] examens", e); } return r; };
  try { var tile = document.querySelector('button[onclick="startTestSimulation()"] p'); if (tile) tile.textContent = "IELTS, TOEFL, TOEIC, Cambridge, Duolingo, PTE"; } catch (e) {}
  var ort = window.runTest;
  if (typeof ort === "function") {
    window.runTest = async function () {
      var t = null; try { t = currentTest; } catch (e) {}
      setModels(t);
      try { if (t && TESTS.indexOf(t) >= 0) await sonder(t); } catch (e) {}
      return ort.apply(this, arguments);
    };
  }
  window.DiisooExams = { version: 5, tests: TESTS.length, scene: function (n) { return SC[n](); } };
})();
