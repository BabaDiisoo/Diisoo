/* test-robustesse.js : tests de résistance de Diisoo.
 * Scénarios : stockage corrompu, stockage bloqué (navigation privée), fichiers de contenu indisponibles.
 * Réussite = aucune erreur JavaScript non gérée et l'app reste utilisable.
 * Lancer : node test-robustesse.js   (code de sortie 1 en cas d'échec) */
const { chromium, devices } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = __dirname;
const TYPES = { ".js": "application/javascript; charset=utf-8", ".html": "text/html; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png" };
const cles = new Set();
for (const f of fs.readdirSync(ROOT)) if (/^diisoo-.*\.js$/.test(f) && !/bundle|-b\d\.js|supabase/.test(f)) for (const m of fs.readFileSync(path.join(ROOT, f), "utf8").matchAll(/"(diisoo_[a-z0-9_]+)"/g)) cles.add(m[1]);
let echecs = 0; const ok = (m) => console.log("  ✔ " + m), ko = (m) => { echecs++; console.log("  ✘ " + m); };
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html"; const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end(); }
  r.setHeader("Content-Type", TYPES[path.extname(f)] || "application/octet-stream"); r.end(fs.readFileSync(f));
});
const PARCOURS = ["?ielts=1", "?toefl=1", "?toeic=1", "?cambridge=a2", "?cambridge=b1", "?duolingo=1", "?pte=1"];
async function scenario(b, nom, init, bloquerDonnees) {
  const c = await b.newContext({ ...devices["Pixel 7"], serviceWorkers: "block" }); const erreurs = [];
  if (init) await c.addInitScript(init, [...cles]);
  for (const q of PARCOURS) {
    const p = await c.newPage(); p.on("pageerror", (e) => erreurs.push(q + " : " + e.message.split("\n")[0]));
    await p.route(/^https?:\/\/(?!localhost)/, (r) => { const u = r.request().url(); if (/jsdelivr.*\+esm/.test(u)) return r.fulfill({ status: 200, contentType: "application/javascript", body: "export function createClient(){return {auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from(){const q={select:()=>q,eq:()=>q,order:()=>q,limit:()=>q,then:(f)=>f({data:[],error:null})};return q},rpc:async()=>({data:null,error:null})}}" });
      if (/jsdelivr.*supabase/.test(u)) return r.fulfill({ status: 200, contentType: "application/javascript", body: fs.readFileSync(path.join(ROOT, "supabase-js-2.118.0.js")) }); return r.fulfill({ status: 200, contentType: "application/json", body: "[]" }); });
    if (bloquerDonnees) await p.route(/(toefl|toeic|cambridge|duolingo|pte)-data\.json/, (r) => r.fulfill({ status: 500, body: "" }));
    await p.goto(base + "/" + q); await p.waitForTimeout(3200);
    if (bloquerDonnees && q !== "?ielts=1") {
      try { await p.locator("#ie-ov button.ie-n, #ie-ov .ie-n").first().click({ timeout: 1500 }); } catch (e) {}
      await p.waitForTimeout(300);
    }
    await p.close();
  }
  erreurs.length ? ko(nom + " : " + erreurs.slice(0, 3).join(" | ")) : ok(nom);
  await c.close();
}
let base;
(async () => {
  await new Promise((r) => srv.listen(0, r)); base = "http://localhost:" + srv.address().port;
  const b = await chromium.launch(); console.log("Clés de stockage trouvées : " + cles.size);
  await scenario(b, "stockage corrompu (JSON invalide partout)", (ks) => { ks.forEach((k) => { try { localStorage.setItem(k, "{[bad json"); } catch (e) {} }); });
  await scenario(b, "stockage rempli de valeurs inattendues (null, tableau, nombre)", (ks) => { ks.forEach((k, i) => { try { localStorage.setItem(k, ["null", "[]", "123", "\"x\"", "true"][i % 5]); } catch (e) {} }); });
  await scenario(b, "stockage bloqué (navigation privée)", () => { const th = () => { throw new Error("SecurityError"); }; try { Object.defineProperty(window, "localStorage", { get: th }); } catch (e) {} });
  await scenario(b, "fichiers de contenu indisponibles (erreur serveur)", null, true);
  await b.close(); srv.close();
  console.log(echecs ? "\n" + echecs + " scénario(s) en échec" : "\nTout résiste");
  process.exit(echecs ? 1 : 0);
})();
