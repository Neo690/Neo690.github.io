// export-lib.js — Sérialisation de la base (JSON structuré + CSV) pour réutilisation
// par d'autres applications. Logique partagée entre le script Node (export.mjs)
// et l'export côté navigateur.

export const EXPORT_VERSION = "1.0.0";
export const CSV_SEP = ";";
export const LIST_SEP = "|";
export const BOM = "\ufeff";

/** Normalise une chaîne pour les comparaisons de noms (accents/casse/espaces). */
function normName(s) {
  return String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Index nom complet → plante, + index « premier mot » pour les variantes (ex. « Cassis »). */
export function indexPlantes(plantes) {
  const byName = new Map();
  const byFirst = new Map();
  for (const p of plantes) {
    byName.set(normName(p.nom), p);
    const first = normName(p.nom).split(" ")[0];
    if (!byFirst.has(first)) byFirst.set(first, p);
  }
  return {
    /** Résout un nom d'association vers l'id de la plante, ou null. */
    resolve(name) {
      const k = normName(name);
      const exact = byName.get(k);
      if (exact) return exact.id;
      const loose = byFirst.get(k.split(" ")[0]);
      return loose ? loose.id : null;
    },
  };
}

/** Formate une valeur pour une cellule CSV (guillemets systématiques, listes jointes). */
function csvCell(v) {
  let s;
  if (Array.isArray(v)) s = v.map((x) => String(x).replace(/\s+/g, " ").trim()).join(LIST_SEP);
  else if (v === null || v === undefined) s = "";
  else s = String(v);
  s = s.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
  return '"' + s.replace(/"/g, '""') + '"';
}

/** Construit un CSV (en-têtes + lignes) à partir d'une liste de colonnes {header, get}. */
export function toCSV(rows, columns) {
  const head = columns.map((c) => csvCell(c.header)).join(CSV_SEP);
  const body = rows.map((r) => columns.map((c) => csvCell(c.get(r))).join(CSV_SEP));
  return [head, ...body].join("\r\n") + "\r\n";
}

/** Colonnes du CSV « plantes » (ordre = ordre du fichier). */
export const PLANTE_COLUMNS = [
  { header: "id", get: (p) => p.id },
  { header: "nom", get: (p) => p.nom },
  { header: "nom_latin", get: (p) => p.latin },
  { header: "famille", get: (p) => p.famille },
  { header: "image", get: (p) => p.image || "" },
  { header: "emoji", get: (p) => p.emoji || "" },
  { header: "bienfaits", get: (p) => p.bienfaits || [] },
  { header: "parties_utilisees", get: (p) => p.parties },
  { header: "usages", get: (p) => p.usages },
  { header: "preparation", get: (p) => p.preparation },
  { header: "actifs", get: (p) => p.actifs },
  { header: "formes", get: (p) => p.formes },
  { header: "posologie", get: (p) => p.posologie },
  { header: "interactions", get: (p) => p.interactions },
  { header: "grossesse", get: (p) => p.grossesse },
  { header: "precaution", get: (p) => p.precaution },
];

/** Colonnes du CSV « associations ». */
export const ASSOC_COLUMNS = [
  { header: "id", get: (a) => a.id },
  { header: "nom", get: (a) => a.nom },
  { header: "objectif", get: (a) => a.objectif },
  { header: "plantes", get: (a) => a.plantes || [] },
  { header: "plantes_ids", get: (a) => a.plantes_ids || [] },
  { header: "effet", get: (a) => a.effet },
  { header: "temps", get: (a) => a.temps },
  { header: "ingredients", get: (a) => a.ingredients || [] },
  { header: "preparation", get: (a) => a.preparation || [] },
  { header: "posologie", get: (a) => a.posologie },
  { header: "conservation", get: (a) => a.conservation },
  { header: "avertissement", get: (a) => a.avertissement },
];

/** Ajoute « plantes_ids » aux associations (résolution nom → id). */
export function withPlantesIds(associations, plantes) {
  const idx = indexPlantes(plantes);
  return associations.map((a) => ({
    ...a,
    plantes_ids: (a.plantes || []).map((n) => idx.resolve(n)).filter(Boolean),
  }));
}

/** Table de jointure plante ↔ association (une ligne par lien). */
export function buildLiens(plantes, associations) {
  const withIds = withPlantesIds(associations, plantes);
  const byId = new Map(plantes.map((p) => [p.id, p]));
  const rows = [];
  for (const a of withIds) {
    (a.plantes || []).forEach((nom, i) => {
      const id = a.plantes_ids[i];
      rows.push({
        plante_id: id || "",
        plante_nom: nom,
        plante_latin: id && byId.get(id) ? byId.get(id).latin : "",
        association_id: a.id,
        association_nom: a.nom,
        objectif: a.objectif,
      });
    });
  }
  return rows;
}

export const LIEN_COLUMNS = [
  { header: "plante_id", get: (r) => r.plante_id },
  { header: "plante_nom", get: (r) => r.plante_nom },
  { header: "plante_latin", get: (r) => r.plante_latin },
  { header: "association_id", get: (r) => r.association_id },
  { header: "association_nom", get: (r) => r.association_nom },
  { header: "objectif", get: (r) => r.objectif },
];

/** Index inversé bienfait → ids de plantes (utile pour filtrer par indication). */
export function buildIndexBienfaits(plantes) {
  const idx = {};
  for (const p of plantes) {
    for (const b of p.bienfaits || []) {
      if (!idx[b]) idx[b] = [];
      idx[b].push(p.id);
    }
  }
  for (const k of Object.keys(idx)) idx[k].sort((a, b) => a.localeCompare(b, "fr"));
  return Object.fromEntries(Object.keys(idx).sort((a, b) => a.localeCompare(b, "fr")).map((k) => [k, idx[k]]));
}

/** Construit le paquet JSON structuré complet (métadonnées + données + index). */
export function buildBundle(plantes, associations, avis, generatedAt = new Date().toISOString()) {
  const assoc = withPlantesIds(associations, plantes);
  return {
    schema: "herbier-medicinal/base",
    version: EXPORT_VERSION,
    genere_le: generatedAt,
    langue: "fr",
    licence: "Contenu éducatif — ne remplace pas un avis médical professionnel.",
    avertissement: avis,
    compteurs: {
      plantes: plantes.length,
      associations: assoc.length,
      liens: assoc.reduce((n, a) => n + a.plantes_ids.length, 0),
      bienfaits: new Set(plantes.flatMap((p) => p.bienfaits || [])).size,
    },
    champs_plante: {
      id: "identifiant unique (slug)",
      nom: "nom vernaculaire français",
      latin: "nom botanique",
      famille: "famille botanique",
      image: "chemin relatif de la planche botanique",
      emoji: "repli si aucune image",
      bienfaits: "liste de domaines thérapeutiques (tags)",
      parties: "parties utilisées",
      usages: "indications principales",
      preparation: "mode de préparation",
      actifs: "principes actifs",
      formes: "formes galéniques disponibles",
      posologie: "posologie usuelle",
      interactions: "interactions et mises en garde médicamenteuses",
      grossesse: "conduite à tenir pendant la grossesse / allaitement",
      precaution: "précautions générales",
    },
    champs_association: {
      id: "identifiant unique (slug)",
      nom: "nom de la synergie",
      objectif: "objectif thérapeutique",
      plantes: "noms vernaculaires des plantes composant le mélange",
      plantes_ids: "identifiants des plantes (clé étrangère vers plantes.json)",
      effet: "effet attendu",
      temps: "temps de préparation",
      ingredients: "liste des ingrédients dosés",
      preparation: "étapes de préparation",
      posologie: "posologie du mélange",
      conservation: "conseils de conservation",
      avertissement: "mise en garde spécifique",
    },
    index_bienfaits: buildIndexBienfaits(plantes),
    plantes,
    associations: assoc,
  };
}

/**
 * Produit le contenu de tous les fichiers d'export.
 * @returns {Record<string,string>} nom de fichier → contenu texte
 */
export function serializeAll(plantes, associations, avis, generatedAt = new Date().toISOString()) {
  const assoc = withPlantesIds(associations, plantes);
  const liens = buildLiens(plantes, associations);
  return {
    "herbier-base.json": JSON.stringify(buildBundle(plantes, associations, avis, generatedAt), null, 2) + "\n",
    "plantes.json": JSON.stringify(plantes, null, 2) + "\n",
    "associations.json": JSON.stringify(assoc, null, 2) + "\n",
    "plantes.csv": BOM + toCSV(plantes, PLANTE_COLUMNS),
    "associations.csv": BOM + toCSV(assoc, ASSOC_COLUMNS),
    "plantes-associations.csv": BOM + toCSV(liens, LIEN_COLUMNS),
  };
}
