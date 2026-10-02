const VERSION = 'diisoo-cache-v3';
const FICHIERS = [
  './', './index.html', './manifest.json', './diisoo-pro.js', './diisoo-update.js',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
];
/* Jamais interceptes : donnees live, voix Oolel (flux Gradio), paiement */
const EXCLUS = ['supabase.co', 'supabase.in', 'query.wikidata.org', 'hf.space', 'huggingface.co', 'gradio', 'paytech.sn', 'soynade'];

self.addEventListener('install', (e) => {
  /* Pas de skipWaiting ici : l'activation est declenchee par le message SKIP_WAITING */
  e.waitUntil(
    caches.open(VERSION).then((c) => Promise.all(FICHIERS.map((f) => c.add(f).catch(() => {}))))
  );
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function garder(req, res) {
  if (res && res.ok) {
    const copie = res.clone();
    caches.open(VERSION).then((c) => c.put(req, copie)).catch(() => {});
  }
  return res;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (EXCLUS.some((x) => req.url.includes(x))) return;
  if (req.headers.has('range')) return;

  /* Pages : reseau d'abord (version a jour), cache en secours hors ligne */
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req.url, { cache: 'no-cache' })
        .then((res) => garder(req, res))
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  /* Autres fichiers : cache immediat, mise a jour en arriere-plan */
  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => garder(req, res))
        .catch(() => cached || Response.error());
      return cached || network;
    })
  );
});
