// export.mjs — Exporte toute la base (plantes + associations) en JSON structuré et CSV.
// Usage : node export.mjs  (depuis le dossier de l'app)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PLANTES, ASSOCIATIONS, AVIS } from "./data-loader.js";
import { serializeAll, EXPORT_VERSION, CSV_SEP, LIST_SEP } from "./export-lib.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, "export");
const generatedAt = new Date().toISOString();

fs.mkdirSync(outDir, { recursive: true });

const files = serializeAll(PLANTES, ASSOCIATIONS, AVIS, generatedAt);
files["README.md"] = readme(PLANTES, ASSOCIATIONS, generatedAt);

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, name), content, "utf8");
}

console.log(`Export ${EXPORT_VERSION} → ${path.relative(process.cwd(), outDir)}/`);
for (const [name, content] of Object.entries(files)) {
  console.log(`  ${name.padEnd(28)} ${String(Buffer.byteLength(content, "utf8")).padStart(9)} octets`);
}
console.log(`\n${PLANTES.length} plantes · ${ASSOCIATIONS.length} associations · repères : ${generatedAt}`);

function readme(plantes, associations, generatedAt) {
  const liens = associations.reduce((n, a) => n + (a.plantes || []).length, 0);
  const bienfaits = new Set(plantes.flatMap((p) => p.bienfaits || [])).size;
  return `# Export de la base — Herbier Médicinal

Généré automatiquement par \`node export.mjs\` le ${generatedAt}.
Version du schéma : \`${EXPORT_VERSION}\`.

## Contenu

| Fichier | Format | Description |
| --- | --- | --- |
| \`herbier-base.json\` | JSON | Paquet complet : métadonnées, dictionnaire de champs, index des bienfaits, plantes et associations. **Recommandé** pour une intégration. |
| \`plantes.json\` | JSON | Tableau des ${plantes.length} plantes, tel quel. |
| \`associations.json\` | JSON | Tableau des ${associations.length} associations, avec \`plantes_ids\` résolus. |
| \`plantes.csv\` | CSV | ${plantes.length} lignes, une par plante. |
| \`associations.csv\` | CSV | ${associations.length} lignes, une par association. |
| \`plantes-associations.csv\` | CSV | Table de jointure : ${liens} liens plante ↔ association. |

## Conventions de lecture

- **Encodage** : UTF-8. Les CSV commencent par un BOM pour un import direct dans Excel.
- **Séparateur CSV** : \`${CSV_SEP}\` (point-virgule), valeurs toujours entre guillemets doubles ; les guillemets internes sont doublés (\`""\`).
- **Listes dans un CSV** : éléments joints par \`${LIST_SEP}\` (barre verticale), ex. \`"Sommeil${LIST_SEP}Stress"\`.
- **Retours à la ligne** : remplacés par des espaces dans les CSV (les JSON les conservent).
- **Images** : les chemins sont relatifs à la racine de l'app (\`images/<id>.jpg\`). Copiez le dossier \`images/\` avec les données si vous en avez besoin. ${plantes.filter((p) => !p.image).length} plantes n'ont pas de planche et utilisent leur \`emoji\`.

## Jointures

- \`associations[].plantes_ids\` → \`plantes[].id\` (clé étrangère, ${liens} liens, tous résolus).
- \`herbier-base.json → index_bienfaits\` : bienfait (${bienfaits} valeurs distinctes) → liste d'ids de plantes.

Exemple d'utilisation (JavaScript) :

\`\`\`js
import base from "./export/herbier-base.json" with { type: "json" };

const plante = Object.fromEntries(base.plantes.map((p) => [p.id, p]));
const sommeil = base.index_bienfaits["Sommeil"].map((id) => plante[id].nom);
const recettes = base.associations.filter((a) => a.plantes_ids.some((id) => sommeil.includes(plante[id].nom)));
\`\`\`

## Avertissement

${AVIS}
`;
}
