#!/usr/bin/env node
// gen-docs.mjs — Génère docs/*.html à partir des 8 documents Markdown du dossier
// business (BP, pitch deck, gamme de tisanes, comparatif prix, note Algérie,
// tableau croisé fournisseurs, certificats, guide 148 plantes) pour intégration
// dans l'app « L'Herbier Médicinal ».
//
// Conversion Markdown → HTML autonome (sans dépendance npm) : titres, tableaux,
// listes, gras/italique, code, liens. Les liens inter-documents sont réécrits
// vers les .md bruts à la racine (téléchargement / lecture dans l'app bureau).
//
// Usage : node gen-docs.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = ".";
const DOCS = "docs";
fs.mkdirSync(DOCS, { recursive: true });

const DOCS_MD = [
  { md: "../148-plantes/GUIDE-148-PLANTES.md", html: "docs/guide-148-plantes.html",
    titre: "Guide des 148 plantes autorisées", sous: "Cadre réglementaire — décret 2008-841",
    icone: "📜", resume: "La liste légale des plantes vendables hors pharmacie et les règles du jeu." },
  { md: "../148-plantes/tableau-croise-plantes-fournisseurs.md", html: "docs/tableau-croise-fournisseurs.html",
    titre: "Tableau croisé 148 plantes × fournisseurs", sous: "Qui fournit quoi, chez qui",
    icone: "🗂", resume: "148 lignes × 9 fournisseurs bio, marquage ●/◐/○ et double sourcing." },
  { md: "../148-plantes/certificats-fournisseurs.md", html: "docs/certificats-fournisseurs.html",
    titre: "Certificats bio des fournisseurs", sous: "Vérification Ecocert du 8 octobre 2026",
    icone: "✅", resume: "5 certifiés EU 2018/848 en cours de validité, 3 à clarifier avant commande." },
  { md: "COMPARATIF-PRIX-20-REFS.md", html: "docs/comparatif-prix.html",
    titre: "Comparatif de prix — 20 réf. cœur × 3 fournisseurs", sous: "COGS mesuré 27,75 €/kg",
    icone: "💶", resume: "Prix réels Herbier du Diois + repères Cailleau/Alp'Erbo, marge par plante." },
  { md: "BUSINESS-PLAN-HERBORISTERIE.md", html: "docs/business-plan.html",
    titre: "Business plan — herboristerie bio en ligne", sous: "Version octobre 2026, COGS mesuré",
    icone: "📋", resume: "25 réf., ~24 k€ d'investissement, break-even ~2 766 €/mois dès le M4-M5." },
  { md: "GAMME-TISANES-LANCEMENT.md", html: "docs/gamme-tisanes.html",
    titre: "Gamme de lancement — 19 SKUs", sous: "18 tisanes + coffret, mélanges autorisés uniquement",
    icone: "🫖", resume: "6 collections avec noms, compositions 100 % légales et positionnement." },
  { md: "PITCH-DECK-HERBORISTERIE.md", html: "docs/pitch-deck.html",
    titre: "Pitch deck", sous: "Le projet en 10 slides",
    icone: "🎯", resume: "L'argumentaire condensé pour partenaires, banque et praticiens." },
  { md: "NOTE-ALGERIE-REGLEMENTATION.md", html: "docs/note-algerie.html",
    titre: "Note — créer la société en Algérie ?", sous: "Analyse réglementaire comparée",
    icone: "🌍", resume: "Verdict : plus restrictif pour la vente par envoi, alternatives UE détaillées." },
];

// --- Mini convertisseur Markdown → HTML -------------------------------------
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function inline(s) {
  s = esc(s);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "<em>🖼 $1</em>");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, txt, href) => {
    if (/^https?:/.test(href)) return `<a href="${href}" target="_blank" rel="noopener">${txt}</a>`;
    return `<a href="${href}" data-md-link>${txt}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  return s;
}
function mdToHtml(md) {
  const out = [];
  let inCode = false, codeBuf = [];
  let listType = null, tableBuf = [];
  const flushList = () => { if (listType) { out.push(`</${listType}>`); listType = null; } };
  const flushTable = () => {
    if (!tableBuf.length) return;
    const rows = tableBuf.filter(r => !/^\s*\|[\s:|-]+\|\s*$/.test(r));
    const cells = r => r.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim());
    const head = cells(rows[0]);
    out.push("<div class=\"md-table-wrap\"><table><thead><tr>" +
      head.map(c => `<th>${inline(c)}</th>`).join("") + "</tr></thead><tbody>");
    for (const r of rows.slice(1)) {
      out.push("<tr>" + cells(r).map(c => `<td>${inline(c)}</td>`).join("") + "</tr>");
    }
    out.push("</tbody></table></div>");
    tableBuf = [];
  };
  for (const raw of md.split(/\r?\n/)) {
    if (raw.trim().startsWith("```")) {
      if (inCode) { out.push(`<pre><code>${esc(codeBuf.join("\n"))}</code></pre>`); codeBuf = []; }
      inCode = !inCode; continue;
    }
    if (inCode) { codeBuf.push(raw); continue; }
    if (/^\s*\|.*\|\s*$/.test(raw)) { flushList(); tableBuf.push(raw); continue; }
    flushTable();
    const h = raw.match(/^(#{1,6})\s+(.*)$/);
    if (h) { flushList(); out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); continue; }
    if (/^\s*[-*]\s+/.test(raw)) {
      if (listType !== "ul") { flushList(); out.push("<ul>"); listType = "ul"; }
      out.push(`<li>${inline(raw.replace(/^\s*[-*]\s+/, ""))}</li>`); continue;
    }
    if (/^\s*\d+[.)]\s+/.test(raw)) {
      if (listType !== "ol") { flushList(); out.push("<ol>"); listType = "ol"; }
      out.push(`<li>${inline(raw.replace(/^\s*\d+[.)]\s+/, ""))}</li>`); continue;
    }
    if (/^\s*>/.test(raw)) { flushList(); out.push(`<blockquote>${inline(raw.replace(/^\s*>\s?/, ""))}</blockquote>`); continue; }
    if (/^\s*(---|\*\*\*)\s*$/.test(raw)) { flushList(); out.push("<hr>"); continue; }
    if (!raw.trim()) { flushList(); continue; }
    flushList();
    out.push(`<p>${inline(raw)}</p>`);
  }
  flushList(); flushTable();
  return out.join("\n");
}

// --- Gabarit de page ---------------------------------------------------------
const page = (d, body) => `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${d.titre} — L'Herbier Médicinal</title>
<link rel="stylesheet" href="docs.css">
<link rel="icon" href="../icon.svg" type="image/svg+xml">
<script>try{document.documentElement.dataset.theme=sessionStorage.getItem('herbier-theme')||localStorage.getItem('herbier-theme')||'light'}catch(e){}</script>
</head>
<body>
<header class="doc-head">
  <a class="doc-back" href="index.html">← Dossier business</a>
  <span class="doc-icone" aria-hidden="true">${d.icone}</span>
  <div>
    <h1>${d.titre}</h1>
    <p>${d.sous}</p>
  </div>
</header>
<main class="doc-body">
${body}
</main>
<footer class="doc-foot">Document du dossier business — L'Herbier Médicinal · <a href="${path.basename(d.md)}" download>Télécharger le .md source</a></footer>
</body>
</html>
`;

// --- Génération --------------------------------------------------------------
let n = 0;
for (const d of DOCS_MD) {
  const mdPath = path.join(ROOT, d.md);
  if (!fs.existsSync(mdPath)) { console.error(`MANQUANT: ${mdPath}`); continue; }
  const html = page(d, mdToHtml(fs.readFileSync(mdPath, "utf-8")));
  fs.writeFileSync(path.join(ROOT, d.html), html);
  n++;
  console.log(`  ✓ ${d.html}`);
}

// --- Index « Dossier business » ---------------------------------------------
const cards = DOCS_MD.map(d => `
  <a class="doc-card" href="${path.basename(d.html)}">
    <span class="doc-card-icone" aria-hidden="true">${d.icone}</span>
    <h2>${d.titre}</h2>
    <p class="doc-card-sous">${d.sous}</p>
    <p class="doc-card-resume">${d.resume}</p>
  </a>`).join("\n");

fs.writeFileSync(path.join(ROOT, "docs/index.html"), `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Dossier business — L'Herbier Médicinal</title>
<link rel="stylesheet" href="docs.css">
<link rel="icon" href="../icon.svg" type="image/svg+xml">
<script>try{document.documentElement.dataset.theme=sessionStorage.getItem('herbier-theme')||localStorage.getItem('herbier-theme')||'light'}catch(e){}</script>
</head>
<body>
<header class="doc-head">
  <a class="doc-back" href="../index.html">← Retour à l'herbier</a>
  <span class="doc-icone" aria-hidden="true">💼</span>
  <div>
    <h1>Dossier business</h1>
    <p>Réglementation, fournisseurs, COGS mesuré, gamme et plan — tout le projet en 8 documents.</p>
  </div>
</header>
<main class="doc-grid">
${cards}
</main>
<footer class="doc-foot">Mis à jour le ${new Date().toISOString().slice(0, 10)} · L'Herbier Médicinal</footer>
</body>
</html>
`);
console.log(`  ✓ docs/index.html (${n}/8 documents convertis)`);
