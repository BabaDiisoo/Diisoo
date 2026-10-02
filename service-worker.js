const VERSION = 'diisoo-v2';
const FICHIERS = ['./', './index.html', './manifest.json', './diisoo-pro.js'];
const EXCLUS = ['supabase.co', 'supabase.in', 'hf.space', 'huggingface.co', 'gradio', 'paytech.sn', 'soynade'];

self.addEventListener('install', (e) => {
  // Pas de skipWaiting ici : l'activation est declenchee par le message SKIP_WAITING
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

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (EXCLUS.some((x) => url.hostname.includes(x) || url.pathname.includes(x))) return;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((rep) => {
        if (rep && rep.ok) {
          const copie = rep.clone();
          caches.open(VERSION).then((c) => c.put(req, copie)).catch(() => {});
        }
        return rep;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
  );
});
