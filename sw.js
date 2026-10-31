const VERSION = "diisoo-cache-v48";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./diisoo-update.js",
  "./diisoo-pro.js",
  "./synchro.js",
  "./pwa-install.js",
  "./diisoo-step4.js",
  "./diisoo-whatsapp.js",
  "./diisoo-autoupdate.js", "./diisoo-field.js", "./diisoo-ai.js", "./diisoo-audio-cache.js",
  "./diisoo-secteurs-loader.js",
  "./diisoo-secteurs.js",
  "./diisoo-secteurs-ui.js",
  "./diisoo-secteurs-init.js",
  "./diisoo-pron.js",
  "./diisoo-voix-court.js",
  "./diisoo-essai.js",
  "./diisoo-accueil.js",
  "./diisoo-partage.js",
  "./diisoo-ui.js",
  "./diisoo-coach.js",
  "./diisoo-themes-extra.js",
  "./diisoo-lecons.js",
  "./diisoo-reseau.js",
  "./diisoo-coach-liens.js",
  "./diisoo-examens-coach.js",
  "./diisoo-pron-business.js",
  "./diisoo-ios-audio.js",
  "./supabase-js-2.118.0.js",
  "./diisoo-tests-extra.js",
  "./diisoo-focus.js",
  "./diisoo-exams.js",
  "./diisoo-images.js",
  "./diisoo-piliers-1-2.js",
  "./diisoo-pilier3-business.js",
  "./diisoo-pilier4-ielts.js",
  "./wolof_extraction_v1.json",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm",
  "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js",
  "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
];
const EXCLUS = ["version.json", "supabase.co", "supabase.in", "query.wikidata.org", "hf.space", "huggingface.co", "gradio.live", "paytech.sn", "soynade"];

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
      .then((ks) => Promise.all(ks.filter((k) => k !== VERSION && !k.startsWith("diisoo-audio-")).map((k) => caches.delete(k))))
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
