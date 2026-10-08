// sync-ios-icons.mjs — Après `npx cap add ios` ou `npx cap sync ios`, replace l'icône
// générique Capacitor par le logo de l'Herbier dans l'AppIconSet et le Splash iOS.
import fs from "node:fs";

const ICON = "icons/icon-512.png";
const targets = [
  "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png",
  "ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732.png",
  "ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732-1.png",
  "ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732-2.png",
];

if (!fs.existsSync(ICON)) {
  console.error("icône source absente : " + ICON);
  process.exit(1);
}
let n = 0;
for (const t of targets) {
  if (fs.existsSync(t)) {
    fs.copyFileSync(ICON, t);
    n++;
  } else {
    console.warn("cible ignorée (absente) : " + t);
  }
}
console.log(`${n} fichier(s) iOS mis à jour avec le logo Herbier`);
