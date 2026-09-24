const CACHE = "diisoo-cache-v1";
const APP_SHELL = [
    "./",
    "./index.html",
    "https://cdn.tailwindcss.com",
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
    "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
];

self.addEventListener("install", (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE).then((c) =>
            Promise.all(APP_SHELL.map((url) => c.add(url).catch(() => {})))
        )
    );
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

/* Stale-while-revalidate : sert le cache immédiatement si présent, met à jour en arrière-plan.
   N'intercepte pas les appels Supabase ni Wikidata (données live), seulement l'app shell. */
self.addEventListener("fetch", (e) => {
    if (e.request.method !== "GET") return;
    const url = e.request.url;
    if (url.includes("supabase.co") || url.includes("query.wikidata.org")) return;

    e.respondWith(
        caches.match(e.request).then((cached) => {
            const network = fetch(e.request)
                .then((res) => {
                    if (res && res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
                    return res;
                })
                .catch(() => cached);
            return cached || network;
        })
    );
});
