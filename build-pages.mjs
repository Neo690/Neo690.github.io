// Build du site GitHub Pages de « L'Herbier Médicinal ».
//
// Prépare un dépôt site utilisateur (Neo690.github.io) qui sert l'application à la racine
// du domaine : les chemins absolus (/images/..., /fonts/...) fonctionnent alors sans
// réécriture, contrairement à un dépôt de projet servi sous un sous-chemin.
//
// Le site est 100 % statique : les fonctions Netlify (/api/install-count, upload TikTok)
// ne sont pas reprises — aucun appel /api n'a été trouvé dans le front.
//
// Usage :
//   node build-pages.mjs            construit et pousse
//   node build-pages.mjs --dry-run  construit sans pousser

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const RACINE = "C:/workspace/herbier-medicinal";
const SRC = path.join(RACINE, "www");
const REPO = "Neo690/Neo690.github.io";
const WORK = "C:/Users/ghost/AppData/Local/Temp/herbier-app-pages";
const DRY = process.argv.includes("--dry-run");

// Fichiers de contrôle visuel / debug : inutiles en production, ~2 Mo au total.
const A_EXCLURE = [
  /visual-check/i,
  /^diag\.html$/i,
  /^lan-check\.png$/i,
  /^phone-screen\.png$/i,
  /\.log$/i,
];

const log = m => console.log(`[build] ${m}`);
const ignorer = nom => A_EXCLURE.some(rx => rx.test(nom));

// ---------------------------------------------------------------------------
// Copie
// ---------------------------------------------------------------------------
function copier(src, dst, stats) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entree of fs.readdirSync(src, { withFileTypes: true })) {
    const nom = entree.name;
    if (nom === ".git" || nom === "node_modules" || nom === ".netlify") continue;
    if (ignorer(nom)) { stats.exclues++; continue; }
    const s = path.join(src, nom);
    const d = path.join(dst, nom);
    if (entree.isDirectory()) copier(s, d, stats);
    else { fs.copyFileSync(s, d); stats.fichiers++; stats.octets += fs.statSync(s).size; }
  }
}

// ---------------------------------------------------------------------------
// En-têtes de cache (équivalent netlify.toml → GitHub Pages via _headers)
// GitHub Pages n'interprète PAS _headers : le fichier est inopérant en l'état.
// Il est conservé comme documentation du comportement attendu ; les versions
// sont gérées par le service worker (sw.js) côté client.
// ---------------------------------------------------------------------------
const HEADERS = `# GitHub Pages n'honore pas _headers (syntaxe Netlify).
# Conservé comme documentation : ces règles étaient appliquées par netlify.toml.
#
#   /sw.js                  Cache-Control: no-cache, no-store, must-revalidate
#   /manifest.webmanifest   Cache-Control: no-cache
#   /*.html                 Cache-Control: no-cache
#   /*.js                   Cache-Control: no-cache
#   /fonts/*                Cache-Control: public, max-age=2592000, immutable
#   /images/*               Cache-Control: public, max-age=2592000
`;

const NOT_FOUND = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Page introuvable — L'Herbier Médicinal</title>
  <link rel="stylesheet" href="/styles.css" />
  <style>
    body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; background: #f6f7f2; color: #1f2a1e;
           display: grid; place-items: center; min-height: 100vh; margin: 0; text-align: center; }
    .c { max-width: 520px; padding: 32px; }
    h1 { color: #1e3a24; font-size: 1.6rem; margin: 12px 0 8px; }
    p { color: #5c6b58; line-height: 1.6; }
    a { color: #2c6e49; }
  </style>
</head>
<body>
  <div class="c">
    <div style="font-size:3rem">🌿</div>
    <h1>Cette page n'existe pas</h1>
    <p>La page demandée est introuvable. Revenez à l'application ou consultez nos pages légales.</p>
    <p>
      <a href="/">Retour à l'application</a> ·
      <a href="/privacy-policy.html">Confidentialité</a> ·
      <a href="/terms-of-service.html">Conditions</a>
    </p>
  </div>
</body>
</html>
`;

// ---------------------------------------------------------------------------
log(`source : ${SRC}`);
if (!fs.existsSync(SRC)) { console.error("✗ www/ introuvable"); process.exit(1); }

fs.rmSync(WORK, { recursive: true, force: true });
const stats = { fichiers: 0, octets: 0, exclus: 0 };
copier(SRC, WORK, stats);

fs.writeFileSync(path.join(WORK, ".nojekyll"), "");
fs.writeFileSync(path.join(WORK, "_headers"), HEADERS);
fs.writeFileSync(path.join(WORK, "404.html"), NOT_FOUND);

// _redirects et .nojekyll : la redirection SPA `/* /index.html 200` est une Netlify
// qu GitHub Pages ignore — la laisser en place donnerait l'illusion que les routes
// fonctionnent. Le service worker assure déjà le repli hors-ligne sur index.html.
for (const f of ["_redirects"]) {
  const p = path.join(WORK, f);
  if (fs.existsSync(p)) { fs.unlinkSync(p); log(`${f} retiré (syntaxe Netlify, sans effet ici)`); }
}

log(`${stats.fichiers} fichiers copiés — ${(stats.octets / 1e6).toFixed(1)} Mo (${stats.exclus} exclus)`);

const lourd = 30e6;
if (stats.octets > lourd) {
  console.warn(`⚠ ${(stats.octets / 1e6).toFixed(1)} Mo : au-delà de ${lourd / 1e6} Mo,`)
  console.warn("  GitHub Pages reste en dessous de la limite de 1 Go, mais le build ralentit.");
}

if (DRY) { log("dry-run : rien n'a été poussé"); process.exit(0); }

// ---------------------------------------------------------------------------
const run = (cmd, args) => execFileSync(cmd, args, { cwd: WORK, stdio: "inherit" });

const dirGit = path.join(WORK, ".git");
if (fs.existsSync(dirGit)) fs.rmSync(dirGit, { recursive: true, force: true });

log("init du dépôt");
run("git", ["init", "-q", "-b", "main"]);
run("git", ["config", "user.name", "Neo690"]);
run("git", ["config", "user.email", "neo2lyon@gmail.com"]);

if (!fs.existsSync(path.join(WORK, "index.html"))) {
  console.error("✗ index.html absent — la racine du site ne s'affichera pas");
  process.exit(1);
}

log("commit");
run("git", ["add", "-A"]);
run("git", ["commit", "-q", "-m", "Site L'Herbier Médicinal sur GitHub Pages (migré de Netlify)"]);

log("push");
try {
  run("git", ["remote", "add", "origin", `https://github.com/${REPO}.git`]);
} catch { /* remote déjà présent */ }
run("git", ["push", "-q", "--force", "origin", "main"]);
log("poussé — https://neo690.github.io/");