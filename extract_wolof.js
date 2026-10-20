#!/usr/bin/env node
"use strict";
/**
 * Diisoo : extraction de la base wolof depuis index.html.
 * Usage : node scripts/extract_wolof.js [chemin/index.html] [dossier_sortie]
 * Sorties : wolof_extraction_v1.json et wolof_extraction_v1.csv
 * Aucune dependance externe (Node 16+).
 * Re-execution sure : les IDs, audio_status et review_status deja presents
 * dans wolof_extraction_v1.json sont conserves ; seules les nouvelles
 * phrases recoivent un nouvel ID.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const INDEX = path.resolve(process.argv[2] || path.join(ROOT, "index.html"));
const OUT_DIR = path.resolve(process.argv[3] || ROOT);
const OUT_JSON = path.join(OUT_DIR, "wolof_extraction_v1.json");
const OUT_CSV = path.join(OUT_DIR, "wolof_extraction_v1.csv");
let BUCKET_URL;
const FALLBACK_SUPABASE = "https://jkwtyoefqvafnlqkhium.supabase.co";
const LOCALE = "wo";
const SOURCES = ["GENERAL_THEMES", "GENERAL_EXTRA", "WOLOF_THEMES", "WOLOF_EXTRA", "CHINA_TRADE_WOLOF", "BUSINESS_DIALOGUES", "BIZ_EXTRA"];

/* ---------- 1. Extraction des blocs "const NOM = ...;" ---------- */
function findBlockEnd(src, start) {
  const open = src[start];
  const close = open === "[" ? "]" : "}";
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    const n = src[i + 1];
    if (c === "/" && n === "/") { i = src.indexOf("\n", i); if (i < 0) break; continue; }
    if (c === "/" && n === "*") { i = src.indexOf("*/", i + 2); if (i < 0) break; i++; continue; }
    if (c === '"' || c === "'" || c === "`") {
      for (i++; i < src.length && src[i] !== c; i++) if (src[i] === "\\") i++;
      continue;
    }
    if (c === open) depth++;
    else if (c === close && --depth === 0) return i;
  }
  throw new Error("Bloc non ferme a partir de la position " + start);
}

function loadConst(src, name) {
  const m = new RegExp("^const\\s+" + name + "\\s*=\\s*([\\[{])", "m").exec(src);
  if (!m) throw new Error("Constante introuvable dans index.html : " + name);
  const start = m.index + m[0].length - 1;
  const end = findBlockEnd(src, start);
  return vm.runInNewContext("(" + src.slice(start, end + 1) + ")", Object.create(null), { timeout: 2000 });
}

/* ---------- 2. Normalisation ---------- */
const clean = s => String(s == null ? "" : s).replace(/\s+/g, " ").trim();
const keyOf = (fr, wo) => (clean(fr) + "||" + clean(wo)).toLowerCase();

const GENERAL_CONTEXT = { intro: "salutation", market: "commerce", agri: "commerce", work: "business", visa: "business" };
const WOLOF_CONTEXT = { salutations: "salutation", marche: "commerce" };

function collect(data) {
  const rows = [];
  const add = (fr, wo, context, audio) => {
    fr = clean(fr); wo = clean(wo);
    if (!fr || !wo) return;
    rows.push({ fr, wo, context, native: !!audio });
  };

  // Themes wolof (+ extras)
  data.WOLOF_THEMES.forEach(t => {
    const ctx = WOLOF_CONTEXT[t.id] || "quotidien";
    (t.words || []).forEach(w => add(w.fr, w.wo, ctx, w.audio));
    ((data.WOLOF_EXTRA || {})[t.id] || []).forEach(w => add(w.fr, w.wo, ctx, w.audio));
  });

  // Themes d'anglais general (vocabulaire + dialogues, avec traduction wolof)
  data.GENERAL_THEMES.forEach(t => {
    const ctx = GENERAL_CONTEXT[t.id] || "quotidien";
    const x = (data.GENERAL_EXTRA || {})[t.id] || {};
    (t.vocab || []).concat(x.vocab || []).forEach(v => add(v.fr, v.wo, ctx, v.audio));
    (t.dialogue || []).concat(x.dialogue || []).forEach(d => add(d.fr, d.wo, ctx, d.audio));
  });

  // Business : vocabulaire par metier, dialogues, extras
  Object.keys(data.CHINA_TRADE_WOLOF).forEach(k => {
    (data.CHINA_TRADE_WOLOF[k].vocab || []).forEach(v => add(v.fr, v.wo, "business", v.audio));
  });
  Object.keys(data.BUSINESS_DIALOGUES).forEach(k => {
    (data.BUSINESS_DIALOGUES[k] || []).forEach(d => add(d.fr, d.wo, "business", d.audio));
  });
  Object.keys(data.BIZ_EXTRA || {}).forEach(k => {
    (data.BIZ_EXTRA[k] || []).forEach(v => add(v.fr, v.wo, "business", v.audio));
  });
  return rows;
}

/* ---------- 3. Fusion avec l'extraction precedente (IDs stables) ---------- */
function readPrevious() {
  try {
    const arr = JSON.parse(fs.readFileSync(OUT_JSON, "utf8"));
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

function build(rows, previous) {
  const prevByKey = new Map();
  let maxNum = 0;
  previous.forEach(p => {
    prevByKey.set(keyOf(p.french_text, p.wolof_current), p);
    const m = /^WO_(\d+)$/.exec(p.id || "");
    if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
  });
  const seen = new Set();
  const out = [];
  rows.forEach(r => {
    const k = keyOf(r.fr, r.wo);
    if (seen.has(k)) return;
    seen.add(k);
    const prev = prevByKey.get(k);
    let id;
    if (prev) id = prev.id;
    else { maxNum++; id = "WO_" + String(maxNum).padStart(3, "0"); }
    out.push({
      id,
      locale: LOCALE,
      french_text: r.fr,
      wolof_current: r.wo,
      context_usage: prev && prev.context_usage ? prev.context_usage : r.context,
      audio_status: prev && prev.audio_status ? prev.audio_status : (r.native ? "native" : "synthetic"),
      audio_url: BUCKET_URL + id.toLowerCase() + ".mp3",
      review_status: prev && prev.review_status ? prev.review_status : "pending"
    });
  });
  // Les entrees validees puis retirees de l'app restent dans le fichier
  previous.forEach(p => {
    if (!seen.has(keyOf(p.french_text, p.wolof_current)) && p.review_status === "approved") out.push(p);
  });
  out.sort((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));
  return out;
}

/* ---------- 4. Ecriture JSON + CSV ---------- */
const COLS = ["id", "locale", "french_text", "wolof_current", "context_usage", "audio_status", "audio_url", "review_status"];
const csvCell = v => {
  let s = String(v == null ? "" : v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // neutralise l'injection de formule tableur
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

function main() {
  const src = fs.readFileSync(INDEX, "utf8");
  // Le projet Supabase est lu dans index.html (source de verite) pour que les URL audio pointent vers le bon projet.
  const mu = /const\s+SUPABASE_URL\s*=\s*["'](https:\/\/[a-z0-9]+\.supabase\.co)["']/.exec(src);
  BUCKET_URL = (mu ? mu[1] : FALLBACK_SUPABASE) + "/storage/v1/object/public/audio-wolof/";
  const data = {};
  SOURCES.forEach(n => { data[n] = loadConst(src, n); });
  const entries = build(collect(data), readPrevious());
  if (!entries.length) throw new Error("Aucune entree extraite : abandon, fichiers existants conserves.");
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(entries, null, 2) + "\n", "utf8");
  const csv = [COLS.join(",")].concat(entries.map(e => COLS.map(c => csvCell(e[c])).join(","))).join("\r\n") + "\r\n";
  fs.writeFileSync(OUT_CSV, "﻿" + csv, "utf8");
  const byCtx = entries.reduce((a, e) => (a[e.context_usage] = (a[e.context_usage] || 0) + 1, a), {});
  console.log("OK " + entries.length + " entrees -> " + path.relative(process.cwd(), OUT_JSON) + " et .csv");
  console.log(JSON.stringify(byCtx));
}

try { main(); } catch (e) { console.error("ERREUR : " + e.message); process.exit(1); }
