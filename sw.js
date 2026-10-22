// sw.js — Service worker offline-first de L'Herbier Médicinal.
// Stratégie :
//   - app shell + données + icônes : cache d'avance (précaché à l'installation)
//   - images : cache à la demande (cache-first, rempli au fil de la navigation)
//   - navigations hors-ligne : repli sur index.html en cache
const VERSION = "herbier-v13"; // v13 : quizz refondu selon la doctrine des signatures (réponses alignées sur le texte de référence)
const SHELL = [
  "./", "./index.html", "styles.css", "app.js", "assistant.js", "quizz.js", "data-loader.js",
  "data.js", "data-sup.js", "data-sup2.js", "data-sup3.js", "data-sup4.js", "manifest.webmanifest", "icon.svg",
  "icons/icon-192.png", "icons/icon-512.png",
  "user-data.js", "images-manifest.js",
  "carte-synergies.html", "carte-therapeutique.html",
  "carte-synergies.workflow.json", "carte-therapeutique.architecture.json",
  "export/stats.json", "fonts-local.css",
  "accueil-install.html", "qr-install.png",
];

// Precache des polices : la liste est générée par localize-fonts.mjs dans fonts-manifest.js
// (importScripts est synchrone ; si le fichier est absent, on degrade sans polices precachees)
try {
  importScripts("fonts-manifest.js"); // définit self.FONTS = ["fonts/…", …]
  if (Array.isArray(self.FONTS)) SHELL.push(...self.FONTS);
} catch (_) { /* fonts-manifest.js absent */ }

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // (toutes les polices sont désormais locales)
  // Les URLs de cache-bust (?v=N) doivent retrouver leur entrée précachée : on ignore
  // la query pour tout lookup, et on stocke les réponses sous leur URL sans query.
  const bareUrl = url.origin + url.pathname; // URL sans query, clé de stockage canonique
  const lookup = (req) => caches.match(req, { ignoreSearch: true, cacheName: VERSION });

  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(new Request(bareUrl), copy));
          return res;
        })
        .catch(() => lookup(e.request).then((r) => r || lookup("./index.html")))
    );
    return;
  }

  if (url.pathname.includes("/images/") || url.pathname.includes("/icons/")) {
    e.respondWith(
      lookup(e.request).then(
        (r) =>
          r ||
          fetch(e.request).then((res) => {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(new Request(bareUrl), copy));
            return res;
          })
      )
    );
    return;
  }

  e.respondWith(
    lookup(e.request).then(
      (r) =>
        r ||
        fetch(e.request).then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(new Request(bareUrl), copy));
          return res;
        })
    )
  );
});
