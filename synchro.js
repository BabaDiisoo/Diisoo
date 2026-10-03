const CLES = ["diisoo_xp", "diisoo_streak", "diisoo_daily_xp", "diisoo_badges", "diisoo_tests", "diisoo_word_stats", "diisoo_tiers", "diisoo_profile", "diisoo_goal", "diisoo_tuto_seen", "diisoo_feedback", "diisoo_coach_heard"];
const LOG = (...a) => console.log("[diisoo-synchro]", ...a);
const ERR = (...a) => console.error("[diisoo-synchro]", ...a);

let D = null;
let derniere = "";
let minuterie = null;
let enCours = false;
let puce = null;

function lire(k) {
  try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; }
}

function instantane() {
  const o = {};
  CLES.forEach((k) => { const v = lire(k); if (v !== null && v !== undefined) o[k] = v; });
  return o;
}

function maxObjets(a, b) {
  const r = Object.assign({}, a || {});
  Object.keys(b || {}).forEach((k) => { r[k] = Math.max(Number(r[k]) || 0, Number(b[k]) || 0); });
  return r;
}

function fusion(l, s) {
  const m = {};
  CLES.forEach((k) => {
    const a = l[k], b = s[k];
    if (a === undefined && b === undefined) return;
    if (a === undefined) { m[k] = b; return; }
    if (b === undefined) { m[k] = a; return; }
    if (k === "diisoo_xp") m[k] = (Number(b.total) || 0) > (Number(a.total) || 0) ? b : a;
    else if (k === "diisoo_streak") {
      const da = a.last || "", db = b.last || "";
      m[k] = db > da || (db === da && (Number(b.count) || 0) > (Number(a.count) || 0)) ? b : a;
    }
    else if (k === "diisoo_daily_xp") m[k] = maxObjets(a, b);
    else if (k === "diisoo_badges") m[k] = Array.from(new Set([].concat(Array.isArray(a) ? a : [], Array.isArray(b) ? b : [])));
    else if (k === "diisoo_tests") {
      const vus = new Set();
      m[k] = [].concat(Array.isArray(a) ? a : [], Array.isArray(b) ? b : [])
        .filter((t) => { const c = [t.date, t.topic, t.mode].join("|"); if (vus.has(c)) return false; vus.add(c); return true; })
        .sort((x, y) => String(x.date).localeCompare(String(y.date)))
        .slice(-300);
    }
    else if (k === "diisoo_word_stats") {
      const r = Object.assign({}, a);
      Object.keys(b).forEach((w) => {
        const x = r[w] || { correct: 0, wrong: 0 }, y = b[w] || {};
        r[w] = { correct: Math.max(x.correct || 0, y.correct || 0), wrong: Math.max(x.wrong || 0, y.wrong || 0) };
      });
      m[k] = r;
    }
    else if (k === "diisoo_tiers") {
      const r = Object.assign({}, a);
      Object.keys(b).forEach((t) => { if (!r[t] || (Number(b[t] && b[t].unlocked) || 0) > (Number(r[t].unlocked) || 0)) r[t] = b[t]; });
      m[k] = r;
    }
    else m[k] = a;
  });
  return m;
}

function appliquer(m) {
  CLES.forEach((k) => {
    if (m[k] === undefined) return;
    try { localStorage.setItem(k, JSON.stringify(m[k])); } catch (e) { ERR("ecriture locale", k, e.message); }
  });
}

function afficher(txt, titre) {
  if (!puce) return;
  puce.textContent = txt;
  puce.title = titre || "";
}

function connecte() {
  try { return !!(D && D.etat().connecte); } catch (e) { return false; }
}

async function pousser(force) {
  if (!connecte() || enCours) return;
  const snap = JSON.stringify(instantane());
  if (!force && snap === derniere) return;
  enCours = true;
  try {
    await D.synchro.sauvegarder(JSON.parse(snap));
    derniere = snap;
    const h = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    afficher("☁️ Sauvegardé " + h, "Progression sauvegardée sur ton compte");
    LOG("sauvegarde ok");
  } catch (e) {
    ERR("sauvegarde", e);
    afficher("☁️ Échec, nouvel essai", String(e && e.message || e));
  } finally { enCours = false; }
}

async function restaurer() {
  if (!connecte()) return;
  afficher("☁️ Restauration…");
  try {
    const serveur = (await D.synchro.charger()) || {};
    const local = instantane();
    const fus = fusion(local, serveur);
    const change = JSON.stringify(fus) !== JSON.stringify(local);
    if (change) appliquer(fus);
    derniere = "";
    await pousser(true);
    if (change && !sessionStorage.getItem("diisoo_synchro_rechargee")) {
      sessionStorage.setItem("diisoo_synchro_rechargee", "1");
      LOG("donnees restaurees, rechargement");
      location.reload();
    }
  } catch (e) {
    ERR("restauration", e);
    afficher("☁️ Restauration impossible", String(e && e.message || e));
  }
}

async function actionPuce() {
  if (!D) { afficher("☁️ Chargement…"); return; }
  if (!connecte()) {
    try { await D.connexion(); } catch (e) { ERR("connexion", e); }
    for (let i = 0; i < 20 && !connecte(); i++) await new Promise((r) => setTimeout(r, 500));
    if (connecte()) { try { await D.rafraichirProfil(); } catch (e) {} await restaurer(); }
    else afficher("☁️ Sauvegarder mon progrès");
  } else {
    await pousser(true);
  }
}

function creerPuce() {
  puce = document.createElement("button");
  puce.type = "button";
  puce.textContent = "☁️ Sauvegarder mon progrès";
  puce.style.cssText = "position:fixed;left:10px;bottom:10px;z-index:30;padding:8px 12px;border-radius:999px;border:1px solid #2e2e32;background:#1c1c1e;color:#F3A94E;font:700 11px system-ui,sans-serif;opacity:.92";
  puce.addEventListener("click", actionPuce);
  document.body.appendChild(puce);
}

async function demarrer() {
  creerPuce();
  try {
    await import("./diisoo-pro.js");
    D = window.Diisoo || null;
  } catch (e) { ERR("diisoo-pro.js", e); }
  if (!D) { afficher("☁️ Indisponible"); return; }
  for (let i = 0; i < 20 && !connecte(); i++) await new Promise((r) => setTimeout(r, 300));
  if (connecte()) {
    try { await D.rafraichirProfil(); } catch (e) {}
    await restaurer();
  }
  setInterval(() => pousser(false), 15000);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") pousser(false); });
  window.addEventListener("pagehide", () => pousser(false));
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(demarrer, 2500));
else setTimeout(demarrer, 2500);
