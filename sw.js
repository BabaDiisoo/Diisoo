const VERSION = "diisoo-cache-v5";
const SHELL = [
  "./",
  "./index.html",
  "./commerce.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./diisoo-update.js",
  "./diisoo-pro.js",
  "./voix-wolof.js",
  "./synchro.js",
  "./pwa-install.js",
  "https://cdn.tailwindcss.com",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm",
  "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js",
  "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
];
const EXCLUS = ["supabase.co", "supabase.in", "query.wikidata.org", "hf.space", "huggingface.co", "gradio.live", "paytech.sn", "soynade"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {}))))
  );
});

self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function garder(req, res) {
  if (res && (res.ok || res.type === "opaque")) {
    const copie = res.clone();
    caches.open(VERSION).then((c) => c.put(req, copie)).catch(() => {});
  }
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (EXCLUS.some((x) => req.url.includes(x))) return;
  if (req.headers.has("range")) return;
  if (!/^https?:/i.test(req.url)) return;

  e.respondWith(
    caches.match(req, { ignoreSearch: req.mode === "navigate" }).then((cache) => {
      const reseau = fetch(req).then((res) => garder(req, res)).catch(() => null);
      if (cache) {
        e.waitUntil(reseau);
        return cache;
      }
      return reseau.then((res) => {
        if (res) return res;
        if (req.mode === "navigate") return caches.match("./index.html");
        return Response.error();
      });
    })
  );
});
