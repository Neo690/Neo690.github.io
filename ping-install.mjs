// ping-install.mjs — Signal d'installation PWA envoyé une fois par installation.
// Événements comptés (aucune donnée personnelle, un simple POST /api/install-count) :
//   1. `appinstalled` : Chrome/Android — l'utilisateur a accepté l'installation.
//   2. 1re visite en mode standalone (display-mode standalone + sessionStorage vide) :
//      couvre iOS (ajout écran d'accueil, pas d'événement) et relances d'app installée.
// En cas d'échec réseau : silencieux (le compteur reste approximatif par design).

export function initInstallPing() {
  const ping = () => {
    try {
      if (sessionStorage.getItem("herbier-install-ping")) return;
      sessionStorage.setItem("herbier-install-ping", "1");
      // Endpoint direct (l'alias /api/install-count peut être masqué par le cache
      // du service worker sur les téléphones déjà installés) ; sinon fallback /api/.
      fetch("/.netlify/functions/install-count", { method: "POST", keepalive: true })
        .catch(() => fetch("/api/install-count", { method: "POST", keepalive: true }).catch(() => {}));
    } catch (_) { /* sessionStorage indisponible (navigation privée) */ }
  };

  // 1. Installation acceptée via le prompt Chrome/Android
  window.addEventListener("appinstalled", ping);

  // 2. App déjà installée (standalone) : compte une fois par session de navigation.
  //    Délai court : laisse la priorité au chargement de l'app.
  if (window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true) {
    setTimeout(ping, 2500);
  }
}
