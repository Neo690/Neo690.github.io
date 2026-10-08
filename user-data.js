// user-data.js — Mises à jour locales de la base (option « Mise à jour » de l'app).
// Les plantes/associations créées par l'utilisateur sont stockées dans localStorage
// (clé « herbier-user-data »), fusionnées par data-loader.js avec la base embarquée.
// Fonctionne 100 % hors-ligne ; export/import JSON pour sauvegarde et partage.
// Format minimal garanti : les champs manquants sont complétés par des défauts sûrs.

const KEY = "herbier-user-data";
const SCHEMA = 1;

export const CHAMPS_PLANTE = {
  requis: ["nom", "latin", "famille", "bienfaits"],
  optionnels: {
    parties: "",
    usages: "",
    preparation: "",
    actifs: "",
    formes: "",
    posologie: "",
    interactions: "Aucune connue aux doses usuelles.",
    grossesse: "Non documenté.",
    precaution: "Fiche personnelle : vérifier les précautions avant usage.",
    emoji: "🌿",
  },
};

export const CHAMPS_ASSOC = {
  requis: ["nom", "objectif", "plantes", "effet", "ingredients", "preparation"],
  optionnels: {
    temps: "5 min",
    posologie: "1 à 2 tasses par jour.",
    conservation: "Mélange sec : 12 mois au sec et à l'abri de la lumière.",
    avertissement: "Fiche personnelle : ne remplace pas un avis médical.",
  },
};

const slug = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function load() {
  if (typeof localStorage === "undefined") return { schema: SCHEMA, plantes: [], associations: [] }; // Node (build/audit)
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || "{}");
    if (d && typeof d === "object") {
      return {
        schema: SCHEMA,
        plantes: Array.isArray(d.plantes) ? d.plantes : [],
        associations: Array.isArray(d.associations) ? d.associations : [],
      };
    }
  } catch (_) { /* stockage corrompu : on repart propre */ }
  return { schema: SCHEMA, plantes: [], associations: [] };
}

function save(d) {
  if (typeof localStorage === "undefined") return false; // Node (build/audit)
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
    return true;
  } catch (e) {
    console.warn("Sauvegarde impossible (stockage plein ?)", e);
    return false;
  }
}

/* ── Validation ──────────────────────────────────────────────── */
function validerPlante(p, idsPris) {
  const erreurs = [];
  for (const c of CHAMPS_PLANTE.requis) {
    const v = p[c];
    if (c === "bienfaits" ? !(Array.isArray(v) && v.length) : !String(v || "").trim()) {
      erreurs.push(`Champ requis : ${c}`);
    }
  }
  if (!erreurs.length && idsPris.has(slug(p.nom))) erreurs.push(`Un élément « ${p.nom} » existe déjà`);
  return erreurs;
}

function validerAssoc(a, idsPris, nomsPlantes) {
  const erreurs = [];
  for (const c of CHAMPS_ASSOC.requis) {
    const v = a[c];
    const ok = Array.isArray(v) ? v.length > 0 : String(v || "").trim();
    if (!ok) erreurs.push(`Champ requis : ${c}`);
  }
  if (!erreurs.length && idsPris.has(slug(a.nom))) erreurs.push(`Un élément « ${a.nom} » existe déjà`);
  // Chaque plante citée doit exister (base ou perso) pour garder le comparateur cohérent
  if (Array.isArray(a.plantes)) {
    for (const n of a.plantes) {
      if (!nomsPlantes.has(String(n).trim().toLowerCase())) erreurs.push(`Plante inconnue : ${n}`);
    }
    if (a.plantes.length < 2) erreurs.push("Une association réunit au moins 2 plantes");
  }
  return erreurs;
}

/* ── Opérations ──────────────────────────────────────────────── */
export function getUserData() { return load(); }

export function getUserCounts() {
  const d = load();
  return { plantes: d.plantes.length, associations: d.associations.length };
}

/** Ajoute une plante personnalisée. Retourne { ok, erreurs?, plante? } */
export function addPlante(draft) {
  const d = load();
  const pris = new Set(d.plantes.map((p) => slug(p.nom)));
  const erreurs = validerPlante(draft, pris);
  if (erreurs.length) return { ok: false, erreurs };
  const plante = {
    id: "u-" + slug(draft.nom),
    ...CHAMPS_PLANTE.optionnels,
    ...draft,
    nom: String(draft.nom).trim(),
    bienfaits: draft.bienfaits.map((b) => String(b).trim()).filter(Boolean),
    perso: true,
    ajouteLe: new Date().toISOString().slice(0, 10),
  };
  d.plantes.push(plante);
  return save(d) ? { ok: true, plante } : { ok: false, erreurs: ["Stockage plein"] };
}

/** Ajoute une association personnalisée. nomsConnus : Set des noms (minuscules) existants. */
export function addAssociation(draft, nomsConnus) {
  const d = load();
  const pris = new Set([
    ...d.associations.map((a) => slug(a.nom)),
  ]);
  const erreurs = validerAssoc(draft, pris, nomsConnus);
  if (erreurs.length) return { ok: false, erreurs };
  const assoc = {
    id: "u-" + slug(draft.nom),
    ...CHAMPS_ASSOC.optionnels,
    ...draft,
    nom: String(draft.nom).trim(),
    plantes: draft.plantes.map((p) => String(p).trim()),
    ingredients: draft.ingredients.map((i) => String(i).trim()),
    preparation: draft.preparation.map((s) => String(s).trim()),
    perso: true,
    ajouteLe: new Date().toISOString().slice(0, 10),
  };
  d.associations.push(assoc);
  return save(d) ? { ok: true, assoc } : { ok: false, erreurs: ["Stockage plein"] };
}

/** Supprime un ajout perso (par id, préfixé « u- »). */
export function removeEntry(id) {
  const d = load();
  const avant = d.plantes.length + d.associations.length;
  d.plantes = d.plantes.filter((p) => p.id !== id);
  d.associations = d.associations.filter((a) => a.id !== id);
  const apres = d.plantes.length + d.associations.length;
  if (apres === avant) return false;
  save(d);
  return true;
}

/** Vide tout l'ajout personnel (la base officielle reste intacte). */
export function resetAll() {
  save({ schema: SCHEMA, plantes: [], associations: [] });
}

/** Export complet (téléchargeable par l'app). */
export function exportJSON() {
  return JSON.stringify({ ...load(), exporteLe: new Date().toISOString() }, null, 2);
}

/**
 * Importe un export précédent. Mode :
 *  - "merge" (défaut) : complète, écrase un perso de même id ;
 *  - "replace" : remplace tout l'ajout personnel.
 *  Retourne { ok, plantes, associations, erreurs[] }.
 */
export function importJSON(texte, mode = "merge") {
  let data;
  try { data = JSON.parse(texte); } catch { return { ok: false, erreurs: ["JSON invalide"] }; }
  const plantes = Array.isArray(data.plantes) ? data.plantes : [];
  const assocs = Array.isArray(data.associations) ? data.associations : [];
  if (!plantes.length && !assocs.length) return { ok: false, erreurs: ["Aucune plante ni association dans ce fichier"] };
  // Normalisation minimale : id, nom, champs requis présents
  const norm = (arr, type) => arr.filter((x) => x && x.nom && (type === "p" ? x.bienfaits : x.plantes));
  const P = norm(plantes, "p"), A = norm(assocs, "a");
  const d = mode === "replace" ? { schema: SCHEMA, plantes: [], associations: [] } : load();
  for (const p of P) { d.plantes = d.plantes.filter((x) => x.id !== p.id); d.plantes.push(p); }
  for (const a of A) { d.associations = d.associations.filter((x) => x.id !== a.id); d.associations.push(a); }
  const ok = save(d);
  return { ok, plantes: P.length, associations: A.length, erreurs: ok ? [] : ["Stockage plein"] };
}

/** Noms (minuscules) des plantes de la base + des ajouts perso. */
export function nomsPlantesConnus(baseNoms) {
  const d = load();
  return new Set([
    ...baseNoms.map((n) => n.toLowerCase()),
    ...d.plantes.map((p) => p.nom.toLowerCase()),
  ]);
}
