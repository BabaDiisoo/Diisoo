// Veille des formats d'examens : lit les sources de exam-formats.json, compare leur empreinte
// avec la dernière vérification (veille-formats-etat.json) et ouvre une alerte (issue GitHub) si une page a changé.
// Lancé chaque semaine par .github/workflows/veille-formats.yml. Aucune modification de l'app : l'alerte demande une relecture humaine.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

const FORMATS = process.env.VEILLE_FORMATS || "exam-formats.json";
const ETAT = process.env.VEILLE_ETAT || "veille-formats-etat.json";
const reg = JSON.parse(readFileSync(FORMATS, "utf8"));
const etat = existsSync(ETAT) ? JSON.parse(readFileSync(ETAT, "utf8")) : {};
const alertes = [];

function texte(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}
async function empreinte(url) {
  const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (Diisoo veille formats)" }, redirect: "follow" });
  if (!r.ok) throw new Error("HTTP " + r.status);
  const type = r.headers.get("content-type") || "";
  const buf = Buffer.from(await r.arrayBuffer());
  const brut = /pdf|octet/.test(type) || url.endsWith(".pdf") ? buf : Buffer.from(texte(buf.toString("utf8")));
  return createHash("sha256").update(brut).digest("hex");
}

for (const [cle, ex] of Object.entries(reg.examens)) {
  for (const url of ex.sources || []) {
    const k = cle + "|" + url;
    try {
      const h = await empreinte(url);
      const avant = etat[k] && etat[k].hash;
      if (avant && avant !== h) alertes.push({ cle, nom: ex.nom, url, type: "changement" });
      etat[k] = { hash: h, vu: new Date().toISOString().slice(0, 10), echecs: 0 };
    } catch (e) {
      const n = ((etat[k] && etat[k].echecs) || 0) + 1;
      etat[k] = { ...(etat[k] || {}), echecs: n, erreur: String(e.message || e) };
      if (n === 3) alertes.push({ cle, nom: ex.nom, url, type: "injoignable" });
    }
  }
}
writeFileSync(ETAT, JSON.stringify(etat, null, 1));

function issue(titre, corps) {
  if (!process.env.GITHUB_TOKEN) { console.log("ALERTE (simulation) :", titre, "\n" + corps); return; }
  try {
    const ouvertes = execFileSync("gh", ["issue", "list", "--state", "open", "--search", titre + " in:title", "--json", "title"], { encoding: "utf8" });
    if (ouvertes.includes(titre)) return;
    execFileSync("gh", ["issue", "create", "--title", titre, "--body", corps, "--label", "veille-examens"], { stdio: "inherit" });
  } catch (e) { console.log("Alerte non créée :", titre, "\n" + corps); }
}
for (const a of alertes) {
  const corps = a.type === "changement"
    ? `La page officielle suivie pour **${a.nom}** a changé depuis la dernière vérification.\n\n${a.url}\n\nÀ faire : lire la page, comparer avec exam-formats.json (tâches, nombre de questions, durées), puis demander la mise à jour du registre. L'application se met alors à jour toute seule chez les apprenants.\n\nIl peut s'agir d'un simple changement de mise en page : vérifier avant de modifier.`
    : `La page suivie pour **${a.nom}** est injoignable depuis 3 semaines : ${a.url}\n\nÀ faire : trouver la nouvelle adresse et la remplacer dans exam-formats.json (champ sources).`;
  issue(`${a.type === "changement" ? "Format" : "Source"} ${a.nom} : ${a.type === "changement" ? "page officielle modifiée" : "page injoignable"}`, corps);
}
console.log("Sources vérifiées :", Object.keys(etat).length, "· alertes :", alertes.length);
