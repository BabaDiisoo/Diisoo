const SUPA_URL = "https://jkwtyoefqvafnlqkhium.supabase.co";
const SUPA_KEY = "sb_publishable__lzrlmMaJdFC_kav6DkfEA_UbH6DiTC";
const SPACE = "soynade-research/Oolel-Voices-Demo";
const ENDPOINT = "/generate_tts_audio";
const CLIENT_URL = "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";
const MAX_CARS = 500;
const MAX_BASE64 = 600000;

const LOG = (...a) => console.log("[diisoo-voix]", ...a);
const ERR = (...a) => console.error("[diisoo-voix]", ...a);

function avecDelai(p, ms, nom) {
  let h;
  const limite = new Promise((_, rej) => { h = setTimeout(() => rej(new Error(nom + " : delai depasse")), ms); });
  return Promise.race([p, limite]).finally(() => clearTimeout(h));
}

async function hacher(t) {
  try {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
    return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("");
  } catch (_) {
    let h = 0;
    for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0;
    return "h" + h;
  }
}

function ouvrirIDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open("DiisooStore", 1);
    r.onupgradeneeded = () => {
      if (!r.result.objectStoreNames.contains("audio_cache")) r.result.createObjectStore("audio_cache", { keyPath: "hash" });
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error || new Error("IndexedDB indisponible"));
  });
}

async function idbGet(hash) {
  try {
    const db = await ouvrirIDB();
    return await new Promise((res) => {
      const q = db.transaction("audio_cache", "readonly").objectStore("audio_cache").get(hash);
      q.onsuccess = () => res(q.result ? q.result.blob : null);
      q.onerror = () => res(null);
    });
  } catch (e) { ERR("idbGet", e.message); return null; }
}

async function idbPut(hash, blob) {
  try {
    const db = await ouvrirIDB();
    await new Promise((res) => {
      const tx = db.transaction("audio_cache", "readwrite");
      tx.objectStore("audio_cache").put({ hash, blob, mime: blob.type, taille: blob.size, date: Date.now() });
      tx.oncomplete = () => res();
      tx.onerror = () => res();
    });
  } catch (e) { ERR("idbPut", e.message); }
}

const entetes = { apikey: SUPA_KEY, Authorization: "Bearer " + SUPA_KEY, "Content-Type": "application/json" };

async function supaLire(hash) {
  try {
    const r = await avecDelai(fetch(SUPA_URL + "/rest/v1/diisoo_lecons?hash=eq." + hash + "&select=audio_base64,mime&limit=1", { headers: entetes }), 8000, "cache serveur");
    if (!r.ok) { LOG("cache serveur non lisible", r.status); return null; }
    const l = await r.json();
    if (!l.length || !l[0].audio_base64) return null;
    const rep = await fetch("data:" + (l[0].mime || "audio/wav") + ";base64," + l[0].audio_base64);
    return await rep.blob();
  } catch (e) { ERR("supaLire", e.message); return null; }
}

function versBase64(blob) {
  return new Promise((res, rej) => {
    const f = new FileReader();
    f.onload = () => res(String(f.result).split(",")[1]);
    f.onerror = rej;
    f.readAsDataURL(blob);
  });
}

async function supaEcrire(texte, blob) {
  try {
    const b64 = await versBase64(blob);
    if (!b64 || b64.length > MAX_BASE64) { LOG("audio trop gros pour le cache serveur"); return; }
    const r = await avecDelai(fetch(SUPA_URL + "/rest/v1/rpc/enregistrer_lecon", {
      method: "POST", headers: entetes,
      body: JSON.stringify({ p_texte: texte, p_audio: b64, p_mime: blob.type || "audio/wav" })
    }), 15000, "ecriture cache");
    LOG("cache serveur ecriture", r.status);
  } catch (e) { ERR("supaEcrire", e.message); }
}

let promesseClient = null;

function obtenirClient() {
  if (promesseClient) return promesseClient;
  promesseClient = (async () => {
    const mod = await avecDelai(import(CLIENT_URL), 30000, "import gradio");
    if (!mod.Client) throw new Error("Client Gradio absent");
    LOG("connexion au Space");
    const c = await avecDelai(mod.Client.connect(SPACE, { events: ["data", "status"] }), 120000, "connexion Space");
    LOG("Space connecte");
    return c;
  })().catch((e) => { promesseClient = null; throw e; });
  return promesseClient;
}

async function generer(texte) {
  const client = await obtenirClient();
  const flux = client.submit(ENDPOINT, {
    text_input: texte, exaggeration_input: 0.3, temperature_input: 0.2, seed_num_input: 0, cfgw_input: 0.5
  });
  let sortie = null;
  for await (const ev of flux) {
    if (ev.type === "status") {
      LOG("statut", ev.stage || ev.status || "", ev.position !== undefined && ev.position !== null ? "file=" + ev.position : "", ev.message || "");
      if (ev.stage === "error" || ev.status === "error") throw new Error(ev.message || "erreur du Space (quota ou Space endormi)");
    } else if (ev.type === "data") sortie = ev.data;
  }
  const p = Array.isArray(sortie) ? sortie[0] : sortie;
  const url = p && (typeof p === "string" ? p : p.url || p.path);
  if (!url || !/^https:\/\//i.test(url)) throw new Error("reponse du Space sans audio");
  const r = await avecDelai(fetch(url), 60000, "telechargement audio");
  if (!r.ok) throw new Error("audio HTTP " + r.status);
  const blob = await r.blob();
  if (!blob.size) throw new Error("audio vide");
  return blob;
}

const memoire = new Map();
const enCours = new Map();

async function url(texte) {
  const t = String(texte || "").replace(/\s+/g, " ").trim().slice(0, MAX_CARS);
  if (!t) throw new Error("texte vide");
  const hash = await hacher(t);
  if (memoire.has(hash)) return memoire.get(hash);
  if (enCours.has(hash)) return enCours.get(hash);
  const travail = (async () => {
    let blob = await idbGet(hash);
    if (blob) LOG("source : cache local");
    if (!blob) {
      blob = await supaLire(hash);
      if (blob) { LOG("source : cache serveur"); idbPut(hash, blob); }
    }
    if (!blob) {
      LOG("source : generation Oolel");
      blob = await avecDelai(generer(t), 180000, "generation vocale");
      idbPut(hash, blob);
      supaEcrire(t, blob);
    }
    const u = URL.createObjectURL(blob);
    memoire.set(hash, u);
    return u;
  })();
  enCours.set(hash, travail);
  try { return await travail; } finally { enCours.delete(hash); }
}

window.VoixWolof = { url, prechauffer: () => obtenirClient().then(() => true, (e) => { ERR("prechauffage", e.message); return false; }) };
setTimeout(() => window.VoixWolof.prechauffer(), 3000);
