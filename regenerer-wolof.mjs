// Regenere les voix wolof de diisoo_lecons avec Oolel Voices v2 (voix female-1, WAV base64 brut).
// Ne remplace un audio que si la reponse est un vrai WAV. Reprend la ou il s'est arrete (colonne v2).
const SB = process.env.SUPABASE_URL;
const SK = process.env.SUPABASE_SERVICE_KEY;
const KEY = process.env.SOYNADE_API_KEY;
const MAX = parseInt(process.env.MAX || "0", 10) || Infinity;
const PAUSE = 3300; // 20 requetes par minute maximum
if (!SB || !SK || !KEY) { console.error("Secrets manquants"); process.exit(1); }

const H = { apikey: SK, Authorization: "Bearer " + SK, "Content-Type": "application/json" };
const dort = (ms) => new Promise((r) => setTimeout(r, ms));

async function lignes() {
  const u = SB + "/rest/v1/diisoo_lecons?select=hash,texte&v2=is.false&order=hash&limit=2000";
  const r = await fetch(u, { headers: H });
  if (!r.ok) throw new Error("Lecture Supabase " + r.status + " " + (await r.text()).slice(0, 200));
  return (await r.json()).filter((x) => x.texte && x.texte.trim() && x.texte.trim().toLowerCase() !== "test ecriture");
}

async function voix(texte) {
  for (let essai = 1; essai <= 5; essai++) {
    const r = await fetch("https://api.soynade.ai/v1/text-to-speech", {
      method: "POST",
      headers: { Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ text: texte, language: "wo", reference_voice: "female-1", output_format: "wav" }),
    });
    if (r.ok) {
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length > 2000 && buf.slice(0, 4).toString() === "RIFF") return buf;
      throw new Error("Reponse audio invalide (" + buf.length + " octets)");
    }
    if (r.status === 429 || r.status >= 500) { await dort(30000 * essai); continue; }
    const t = (await r.text()).slice(0, 200);
    if (r.status === 401 || r.status === 402 || r.status === 403) { console.error("ARRET " + r.status + " " + t); process.exit(2); }
    throw new Error("Soynade " + r.status + " " + t);
  }
  throw new Error("Trop d'echecs");
}

async function ecrire(hash, b64) {
  const r = await fetch(SB + "/rest/v1/diisoo_lecons?hash=eq." + encodeURIComponent(hash), {
    method: "PATCH", headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify({ audio_base64: b64, v2: true }),
  });
  if (!r.ok) throw new Error("Ecriture Supabase " + r.status + " " + (await r.text()).slice(0, 200));
}

const todo = (await lignes()).slice(0, MAX);
console.log("A regenerer :", todo.length);
let ok = 0, ko = 0;
for (const l of todo) {
  try {
    const b = await voix(l.texte);
    await ecrire(l.hash, b.toString("base64"));
    ok++;
    console.log(ok + "/" + todo.length, l.texte.slice(0, 40), Math.round(b.length / 1024) + " Ko");
  } catch (e) {
    ko++;
    console.error("ECHEC", l.texte.slice(0, 40), String(e.message || e).slice(0, 160));
  }
  await dort(PAUSE);
}
console.log("Termine. Reussis :", ok, "Echecs :", ko);
if (ko > 0) process.exit(3);
