// Déploiement Netlify par digests — site (www/) + fonctions (netlify/functions).
// Format documenté : POST /deploys avec { files, functions } (sha1), puis upload
// des blobs manquants via /deploys/:id/files/<path> et /deploys/:id/functions/<name>.
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const CONFIG = JSON.parse(readFileSync('C:/Users/ghost/AppData/Roaming/netlify/Config/config.json', 'utf8'));
const userId = CONFIG.userId;
const token = CONFIG.users[userId].auth.token;
const SITE_ID = '269577db-c249-4cce-a66a-609419f1a46c';
const root = 'C:/workspace/herbier-medicinal';
const dirWww = path.join(root, 'www');
const dirFn = path.join(root, 'netlify', 'functions');
const api = (chemin) => `https://api.netlify.com/api/v1${chemin}`;
const sha1 = (buf) => createHash('sha1').update(buf).digest('hex');

const requete = async (chemin, opts = {}) => {
  const r = await fetch(api(chemin), {
    ...opts,
    headers: { Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
  });
  const texte = await r.text();
  let json = null;
  try { json = JSON.parse(texte); } catch { json = { brut: texte.slice(0, 300) }; }
  if (!r.ok) throw new Error(`${r.status} ${JSON.stringify(json).slice(0, 300)}`);
  return json;
};

// 1) Digests des fichiers du site
const files = {};
const parcourir = (dir, prefixe = '') => {
  for (const f of readdirSync(dir)) {
    if (f === '.netlify' || f === 'netlify') continue; // dossier fonctions géré à part
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) parcourir(p, prefixe + '/' + f);
    else files[prefixe + '/' + f] = sha1(readFileSync(p));
  }
};
parcourir(dirWww);

// 2) Bundles des fonctions (zip contenant le .js à la racine)
const functions = {};
const bundles = {};
for (const f of readdirSync(dirFn)) {
  if (!f.endsWith('.js')) continue;
  const nom = f.replace(/\.js$/, '');
  const zip = `${root}/.netlify/fn-${nom}.zip`;
  execSync(`python -c "import zipfile;zipfile.ZipFile(r'${zip}','w',zipfile.ZIP_DEFLATED).write(r'${path.join(dirFn, f)}','${f}')"`);
  const contenu = readFileSync(zip);
  bundles[nom] = contenu;
  functions[nom] = sha1(contenu);
}
console.log('fichiers:', Object.keys(files).length, '| fonctions:', Object.keys(functions).join(', ') || '(aucune)');

// 3) Création du déploiement
const dep = await requete(`/sites/${SITE_ID}/deploys`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ files, functions, async: true }),
});
console.log('deploy_id:', dep.id, '| state:', dep.state);

// 4) Upload des blobs requis
for (const digest of dep.required || []) {
  for (const [p, h] of Object.entries(files)) {
    if (h === digest) {
      await requete(`/deploys/${dep.id}/files${p.split('/').map(encodeURIComponent).join('/')}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: readFileSync(path.join(dirWww, p)),
      });
      console.log('  file ↑', p);
    }
  }
}
for (const nom of dep.required_functions || []) {
  await requete(`/deploys/${dep.id}/functions/${encodeURIComponent(nom)}?runtime=js`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/zip' },
    body: bundles[nom],
  });
  console.log('  fonction ↑', nom);
}

// 5) Attente
for (let i = 0; i < 60; i++) {
  await new Promise(r => setTimeout(r, 3000));
  const s = await requete(`/deploys/${dep.id}`);
  console.log(`[${i}] ${s.state}`);
  if (s.state === 'ready') { console.log('DEPLOY PRET'); process.exit(0); }
  if (s.state === 'error') { console.error('ERREUR DEPLOIEMENT', JSON.stringify(s).slice(0, 500)); process.exit(1); }
}
console.error('TIMEOUT attente deploy');
process.exit(1);
