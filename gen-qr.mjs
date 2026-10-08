// gen-qr.mjs — Régénère les QR codes de distribution de « L'Herbier Médicinal ».
// Le lien d'installation est aujourd'hui GitHub Pages (Netlify n'est plus
// finançable sur ce compte) : un QR qui pointe encore l'ancien domaine envoie
// vers un site mort. Lancer après tout changement d'URL de distribution.
//
//   node gen-qr.mjs
//
// Sorties : qr-install.png (application en ligne), qr-apk.png (page d'installation
// Android), qr-tiktok.png (série TikTok) — à la racine et dans www/.
//
// L'APK signé (37 Mo) n'est volontairement PAS hébergé dans le site : l'app
// s'installe depuis le web (PWA) sans téléchargement, et gonfler chaque build
// Pages de 37 Mo n'apporterait rien. Le binaire reste à la racine du projet
// (`herbier-medicinal-release.apk`) pour le Play Store et le sideloading.

import fs from "node:fs";
import QRCode from "qrcode";

const CIBLES = [
  { fichier: "qr-install.png", url: "https://neo690.github.io/" },
  { fichier: "qr-apk.png", url: "https://neo690.github.io/accueil-install.html" },
  { fichier: "qr-tiktok.png", url: "https://www.tiktok.com/@lherbiermedicinal" },
];

for (const { fichier, url } of CIBLES) {
  const png = await QRCode.toBuffer(url, {
    type: "png",
    width: 800,
    margin: 1,
    color: { dark: "#33553fff", light: "#ffffffff" },
    errorCorrectionLevel: "M",
  });
  for (const dossier of ["", "www"]) {
    const chemin = dossier ? `${dossier}/${fichier}` : fichier;
    fs.writeFileSync(chemin, png);
  }
  console.log(`${fichier} → ${url}`);
}
console.log("QR régénérés (racine + www/).");
