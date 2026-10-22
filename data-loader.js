// Chargeur de données unifié : fusionne les 4 datasets + les ajouts locaux
// (option « Mise à jour » de l'app, stockés dans localStorage par user-data.js)
// et résout les images.
import { PLANTES as B, ASSOCIATIONS as A0, AVIS } from "./data.js?v=15";
import { PLANTES_SUP as S1, ASSOCIATIONS_SUP as A1 } from "./data-sup.js?v=15";
import { PLANTES_SUP2 as S2, ASSOCIATIONS_SUP2 as A2 } from "./data-sup2.js?v=15";
import { PLANTES_SUP3 as S3, ASSOCIATIONS_SUP3 as A3 } from "./data-sup3.js?v=15";
import { ASSOCIATIONS_SUP4 as A4 } from "./data-sup4.js?v=15";
import { getUserData } from "./user-data.js";

// Images réellement présentes : liste générée par build.mjs (step polices) dans
// images-manifest.js — plus de liste codée en main à maintenir.
// En Node (build/audit), on lit le disque directement.
let IMG_DISPO;
try {
  if (typeof window === "undefined" && typeof process !== "undefined") {
    // Node (build/audit) : lecture directe du dossier images/
    const { readdirSync } = await import("node:fs");
    IMG_DISPO = new Set(readdirSync("images").filter((f) => f.endsWith(".jpg")).map((f) => f.replace(/\.jpg$/, "")));
  } else {
    // Navigateur : images-manifest.js est chargé par index.html (script classique,
    // il définit self.IMG_DISPO — self === window dans une page).
    IMG_DISPO = new Set((self.IMG_DISPO || []).map((p) => p.replace(/^images\//, "").replace(/\.jpg$/, "")));
  }
} catch (_) {
  IMG_DISPO = new Set();
}

export const PLANTES = (() => {
  const map = new Map(B.map((p) => [p.id, p]));
  for (const p of [...S1, ...S2, ...S3]) {
    if (map.has(p.id)) map.set(p.id, { ...map.get(p.id), ...p });
    else map.set(p.id, p);
  }
  // Ajouts locaux de l'utilisateur (option « Mise à jour ») : jamais en double (id « u-… »),
  // et une perso peut enrichir une fiche officielle de même slug.
  try {
    for (const p of getUserData().plantes) {
      if (map.has(p.id)) map.set(p.id, { ...map.get(p.id), ...p });
      else map.set(p.id, p);
    }
  } catch (_) { /* localStorage indisponible (navigation privée stricte) */ }
  const list = [...map.values()].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  for (const p of list) {
    if (!p.image && IMG_DISPO.has(p.id)) p.image = `images/${p.id}.jpg`;
  }
  return list;
})();

export const ASSOCIATIONS = [...A0, ...A1, ...A2, ...A3, ...A4, ...(getUserData()?.associations || [])];
export { AVIS };
