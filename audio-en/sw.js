const VERSION = "diisoo-cache-v197";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./diisoo-update.js",
  "./diisoo-biz-plus.js",
  "./diisoo-assistant.js",
  "./diisoo-coach2.js",
  "./diisoo-parrainage.js",
  "./diisoo-oral.js",
  "./diisoo-exams2.js",
  "./diisoo-premium.js",
  "./diisoo-guide.js",
  "./diisoo-seance.js",
  "./diisoo-conversation.js",
  "./diisoo-indulgence.js",
  "./diisoo-priorites.js",
  "./diisoo-continuer.js",
  "./diisoo-access.js",
  "./diisoo-suivi.js",
  "./diisoo-bundle.js",
  "./diisoo-b1.js",
  "./diisoo-b2.js",
  "./diisoo-b3.js",
  "./diisoo-b4.js",
  "./diisoo-b5.js",
  "./diisoo-b6.js",
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
  "./diisoo-controle-oolel.js",
  "./diisoo-entree.js",
  "./diisoo-accueil3.js",
  "./diisoo-accueil4.js",
  "./diisoo-fin1.js",
  "./diisoo-wolof-plus.js",
  "./diisoo-fixe.js",
  "./diisoo-voix-court.js",
  "./diisoo-essai.js",
  "./diisoo-accueil.js",
  "./diisoo-partage.js",
  "./diisoo-ui.js",
  "./diisoo-coach.js",
  "./diisoo-themes-extra.js",
  "./diisoo-lecons.js",
  "./diisoo-lecons-plus.js",
  "./diisoo-arrivee.js","./diisoo-question-jour.js","./diisoo-quete.js","./diisoo-aujourdhui.js","./diisoo-accueil2.js","./diisoo-diag.js","./diisoo-ligue.js","./diisoo-invite-moment.js","./diisoo-ecoute.js","./diisoo-colobane-plus.js","./diisoo-mission-colobane.js","./diisoo-sandaga-plus.js","./diisoo-mission-sandaga.js","./diisoo-chine-plus.js","./diisoo-mission-chine.js","./diisoo-agriculture-plus.js","./diisoo-mission-agribiz.js","./diisoo-hotel-plus.js","./diisoo-mission-hotel.js","./diisoo-restaurant-plus.js","./diisoo-mission-restaurant.js","./diisoo-guide-plus.js","./diisoo-mission-guide.js","./diisoo-transport-plus.js","./diisoo-mission-transport.js","./diisoo-artisanat-plus.js","./diisoo-mission-artisanat.js","./diisoo-agence-plus.js","./diisoo-mission-agence.js","./diisoo-plage-plus.js","./diisoo-mission-plage.js","./diisoo-bazar-plus.js","./diisoo-mission-bazar.js","./diisoo-electronique-plus.js","./diisoo-mission-electronique.js","./diisoo-abc.js",
  "./diisoo-examens-hub.js",
  "./diisoo-universel.js",
  "./diisoo-reseau.js",
  "./diisoo-coach-liens.js",
  "./diisoo-examens-coach.js",
  "./diisoo-pron-business.js",
  "./diisoo-ios-audio.js",
  "./diisoo-ios-fix.js",
  "./diisoo-ielts-p1.js",
  "./diisoo-ielts-p2.js",
  "./diisoo-ielts-p3.js",
  "./diisoo-ielts-p4.js",
  "./diisoo-ielts-p5.js",
  "./diisoo-ielts-p6.js",
  "./diisoo-toefl.js",
  "./toefl-data.json",
  "./diisoo-toeic.js",
  "./toeic-data.json",
  "./diisoo-cambridge.js",
  "./cambridge-data.json",
  "./diisoo-duolingo.js",
  "./duolingo-data.json",
  "./diisoo-pte.js",
  "./diisoo-voix-en.js",
  "./diisoo-voix-wo.js",
  "./pte-data.json",
  "./diisoo-direct.js",
  "./diisoo-orga.js",
  "./diisoo-wamic.js",
  "./diisoo-aide-wolof.js",
  "./diisoo-biz.js",
  "./diisoo-passage.js",
  "./diisoo-stable.js",
  "./diisoo-tourisme.js","./diisoo-banque.js","./diisoo-mission-banque.js","./diisoo-telephone.js","./diisoo-mission-telephone.js","./diisoo-administration.js","./diisoo-mission-administration.js","./diisoo-etudes.js","./diisoo-mission-etudes.js","./diisoo-freelance.js","./diisoo-mission-freelance.js","./diisoo-fetes.js","./diisoo-mission-fetes.js","./diisoo-factures.js","./diisoo-mission-factures.js","./diisoo-diaspora.js","./diisoo-mission-diaspora.js",
  "./diisoo-son.js",
  "./diisoo-objectif.js","./diisoo-rappel.js","./diisoo-recap.js","./diisoo-defi.js","./diisoo-mission-visa.js","./diisoo-mission-marche.js","./diisoo-mission-voyage.js","./diisoo-mission-presentation.js","./diisoo-mission-famille.js","./diisoo-mission-emploi.js","./diisoo-mission-sante.js","./diisoo-mission-nourriture.js","./diisoo-mission-temps.js","./diisoo-mission-logement.js","./diisoo-mission-agriculture.js",
  "./diisoo-installer.js",
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

/* Préchargement par petits lots (au lieu de 155 téléchargements simultanés). Sur iPhone, lots de 6 et sans le bundle
   unique (1,1 Mo, simple secours) ni les bibliothèques externes : Safari manque de mémoire et ferme la page sinon. */
const IOS_SW = /iPhone|iPad|iPod/.test(self.navigator.userAgent || "");
const INUTILES_IOS = ["./diisoo-bundle.js", "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2", "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm", "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js", "./wolof_extraction_v1.json"];
function liste() {
  return IOS_SW ? SHELL.filter((u) => !INUTILES_IOS.includes(u)) : SHELL;
}
async function prechargerParLots(c, urls, taille) {
  for (let i = 0; i < urls.length; i += taille) {
    await Promise.all(urls.slice(i, i + taille).map((u) => c.add(u).catch(() => {})));
  }
}

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) => prechargerParLots(c, liste(), IOS_SW ? 6 : 12))
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

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) {}
  e.waitUntil(self.registration.showNotification(d.titre || "Diisoo", {
    body: d.corps || "Ton objectif du jour t'attend.",
    icon: "./icon-192.png", badge: "./icon-192.png",
    tag: "diisoo-rappel", renotify: false,
    data: { url: d.url || "/?source=rappel" }
  }));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/?source=rappel";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
    for (const c of cs) { if ("focus" in c) return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
