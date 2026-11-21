/* test-diisoo.js : test de fumée automatique de Diisoo (Android, iPhone, ordinateur).
 * Ouvre le vrai index.html dans Chromium, réseau externe simulé, et vérifie :
 *  1. aucun fichier du dépôt introuvable (404) parmi ceux que l'app charge ;
 *  2. aucune erreur JavaScript au démarrage ;
 *  3. le parcours IELTS s'ouvre et affiche ses écrans ;
 *  4. sw.js et le chargeur sont syntaxiquement valides.
 * Lancer : node test-diisoo.js     (Playwright requis : npm i playwright)
 * Code de sortie 1 si une vérification échoue (utilisé par .github/workflows/smoke.yml).
 */
const { chromium, devices } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path"), cp = require("child_process");
const ROOT = __dirname;
const TYPES = { ".js": "application/javascript; charset=utf-8", ".html": "text/html; charset=utf-8", ".json": "application/json; charset=utf-8", ".css": "text/css; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".xml": "application/xml" };
const MOCK_RPC = {
  ielts_liste_exercices: [{ code: "x", skill: "reading", level: "A2", titre: "Avis", nb_questions: 1, duree_min: 5 }, { code: "lsk-a1-presentation", skill: "listening", level: "A1", titre: "Se présenter", nb_questions: 3, duree_min: 4 }],
  ielts_questions_positionnement: [{ id: 1, skill: "grammar", level: "A1", prompt: "She ___", options: ["is", "are"] }],
  ielts_charger_exercice: { code: "x", skill: "reading", level: "A2", titre: "Avis", duree_min: 5, texte: "Platform 3.", questions: [{ id: 1, prompt: "Which platform?", options: ["1", "3"] }] },
  ielts_soumettre: { bons: 1, total: 1, taux: 100, mode: "exam", details: [{ id: 1, ok: true, choix: 1, bonne_option: 1 }] },
  ielts_corriger_positionnement: { niveau: "A1", bons: 1, total: 1, par_skill: { grammar: { bons: 1, total: 1 } }, details: [] }
};
let echecs = 0;
const ok = (m) => console.log("  ✔ " + m);
const ko = (m) => { echecs++; console.log("  ✘ " + m); };

for (const f of ["sw.js", "diisoo-secteurs-loader.js"]) {
  try { cp.execFileSync(process.execPath, ["--check", path.join(ROOT, f)], { stdio: "pipe" }); ok(f + " : syntaxe valide"); }
  catch (e) { ko(f + " : erreur de syntaxe"); }
}

const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end(); }
  r.setHeader("Content-Type", TYPES[path.extname(f)] || "application/octet-stream"); r.end(fs.readFileSync(f));
});

(async () => {
  await new Promise((r) => srv.listen(0, r));
  const base = "http://localhost:" + srv.address().port;
  const b = await chromium.launch();
  const profils = [["Android", devices["Pixel 7"]], ["iPhone", devices["iPhone 13"]], ["Ordinateur", { viewport: { width: 1280, height: 800 } }]];
  for (const [nom, opt] of profils) {
    console.log("\n" + nom);
    const c = await b.newContext({ ...opt, serviceWorkers: "block" });
    const p = await c.newPage();
    const erreurs = [], manquants = [];
    p.on("pageerror", (e) => erreurs.push(e.message));
    p.on("response", (r) => { if (r.url().startsWith(base) && r.status() === 404 && !/favicon/.test(r.url())) manquants.push(r.url().replace(base, "")); });
    await p.route(/^https?:\/\/(?!localhost)/, (route) => {
      const u = route.request().url();
      if (/supabase\.co\/rest\/v1\/rpc\/(\w+)/.test(u)) { const n = u.match(/rpc\/(\w+)/)[1]; return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MOCK_RPC[n] === undefined ? null : MOCK_RPC[n]) }); }
      if (/supabase\.co/.test(u)) return route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
      if (/jsdelivr.*supabase/.test(u)) return route.fulfill({ status: 200, contentType: "application/javascript", body: fs.readFileSync(path.join(ROOT, "supabase-js-2.118.0.js")) });
      return route.fulfill({ status: 200, contentType: "text/plain", body: "" });
    });
    try {
      const c2 = await b.newContext({ ...opt, serviceWorkers: "block" }); const p2 = await c2.newPage();
      await p2.route(/^https?:\/\/(?!localhost)/, (r) => r.fulfill({ status: 200, contentType: "application/json", body: "[]" }));
      await p2.goto(base + "/"); await p2.waitForTimeout(3500); await p2.click("#btn-submit-onboarding"); await p2.waitForTimeout(1000);
      const ec = await p2.evaluate(() => [...document.querySelectorAll("[id^=screen-]")].filter((e) => e.offsetParent !== null).map((e) => e.id));
      (ec.length === 1 && ec[0] === "screen-dashboard") ? ok("Commencer : accès direct au menu (1 clic, sans réseau)") : ko("Commencer n'ouvre pas le menu : " + ec.join(","));
      await c2.close();
    } catch (e) { ko("entrée : " + e.message.split("\n")[0]); }
    try {
      await p.goto(base + "/?ielts=1", { waitUntil: "load" });
      await p.waitForTimeout(6000);
      manquants.length ? ko("fichiers introuvables : " + [...new Set(manquants)].join(", ")) : ok("tous les fichiers chargés");
      const bloquantes = erreurs.filter((e) => !/Failed to fetch|NetworkError|Load failed|supabase|importScripts|ResizeObserver/i.test(e));
      bloquantes.length ? ko("erreurs JavaScript : " + bloquantes.slice(0, 3).join(" | ")) : ok("aucune erreur JavaScript au démarrage");
      if (!(await p.locator("#ie-ov").count())) { ko("le parcours IELTS ne s'ouvre pas"); await c.close(); continue; }
      ok("le parcours IELTS s'ouvre");
      await p.click("#ie-ov >> text=Voir les 7 examens"); await p.waitForTimeout(500);
      (await p.locator("#ie-ov .ie-tag").count()) === 7 ? ok("les 7 examens s'affichent") : ko("les 7 examens ne s'affichent pas");
      await p.click("#ie-ov >> text=Retour"); await p.click("#ie-ov >> text=Choisir mon objectif"); await p.click("#ie-ov >> text=Étudier à l");
      await p.waitForSelector(".ie-warn", { timeout: 3000 }); ok("objectif et avertissement visa");
      await p.click("#ie-ov >> text=← Retour"); await p.click("#ie-ov >> text=← Retour");
      await p.click("#ie-ov >> text=Life Skills A1, A2, B1"); await p.click("#ie-ov >> text=Life Skills A1");
      await p.click("#ie-ov >> text=Oral : 5 questions");
      await p.fill("#ie-ta", "My name is Amina and I live in London because my family is here.");
      await p.click("#ie-ov >> text=Voir mon retour"); await p.waitForSelector("#ie-ov >> text=assez développée", { timeout: 3000 });
      ok("Life Skills : oral et retour pédagogique");
      await p.click("#ie-ov >> text=Question suivante");
      await p.goto(base + "/?ielts=1"); await p.waitForTimeout(3000);
      await p.click("#ie-ov >> text=Life Skills A1, A2, B1"); await p.click("#ie-ov >> text=Life Skills A1"); await p.click("#ie-ov >> text=Écoute");
      await p.waitForSelector("#ie-ov >> text=Se présenter", { timeout: 3000 });
      (await p.locator("#ie-ov >> text=Avis").count()) === 0 ? ok("Life Skills : écoute filtrée (pas de mélange avec IELTS)") : ko("l'écoute Life Skills affiche des exercices IELTS");
      await p.goto(base + "/?ielts=1"); await p.waitForTimeout(3000);
      await p.click("#ie-ov >> text=Écriture (Writing)"); await p.click("#ie-ov >> text=Task 2 : essai d'opinion"); await p.click("#ie-ov >> text=Sujet 1");
      await p.fill("#ie-wr", "In my opinion, children should learn English early because it helps them. However, some parents worry about local languages.\n\nFor example, a child can learn both at home and at school. Moreover, English opens many doors for work.\n\nOn the other hand, teachers need good training. Therefore, the government must invest.\n\nIn conclusion, I believe early English is useful.");
      await p.click("#ie-ov >> text=Voir mon retour"); await p.waitForSelector("#ie-ov >> text=pas une note IELTS", { timeout: 3000 });
      (await p.locator("#ie-ov >> text=Conclusion").count()) > 0 ? ok("Écriture : brouillon et retour automatique") : ko("Écriture : retour incomplet");
      await p.goto(base + "/?ielts=1"); await p.waitForTimeout(3000);
      p.on("dialog", (d) => d.accept());
      await p.click("#ie-ov >> text=Examens blancs"); await p.click("#ie-ov >> text=Lecture seule"); await p.click("#ie-ov >> text=Commencer la partie");
      await p.waitForSelector("#ie-chrono", { timeout: 3000 });
      await p.click("#ie-ov >> text=3"); await p.click("#ie-ov >> text=Terminer cette partie");
      await p.waitForSelector("#ie-ov >> text=pas une note IELTS", { timeout: 3000 });
      ok("Examen blanc : chrono, envoi, résultat sans band");
      await p.goto(base + "/?ielts=stats"); await p.waitForSelector("#ie-ov >> text=Accès réservé", { timeout: 5000 });
      ok("Statistiques : refusées sans droit administrateur");
    } catch (e) { ko("parcours interrompu : " + e.message.split("\n")[0]); }
    await c.close();
  }
  await b.close(); srv.close();
  console.log(echecs ? "\n" + echecs + " vérification(s) en échec" : "\nTout est bon");
  process.exit(echecs ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
