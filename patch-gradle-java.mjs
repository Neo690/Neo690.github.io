// patch-gradle-java.mjs — Après chaque `npx cap sync android`, Capacitor régénère des
// fichiers gradle exigeant Java 21. Cette machine n'a qu'un JDK 17 : on bascule les
// trois fichiers concernés en VERSION_17 (le code Capacitor est compatible Java 17).
import fs from "node:fs";

const FILES = [
  "android/app/capacitor.build.gradle",
  "android/capacitor-cordova-android-plugins/build.gradle",
  "node_modules/@capacitor/android/capacitor/build.gradle",
];

let patched = 0;
for (const f of FILES) {
  if (!fs.existsSync(f)) continue;
  const src = fs.readFileSync(f, "utf8");
  const out = src
    .replaceAll("JavaVersion.VERSION_21", "JavaVersion.VERSION_17");
  if (out !== src) {
    fs.writeFileSync(f, out);
    patched++;
    console.log(`patched → Java 17 : ${f}`);
  }
}
console.log(patched ? `${patched} fichier(s) corrigé(s)` : "rien à corriger");
