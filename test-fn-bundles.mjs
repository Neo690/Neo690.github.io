// Matrice de variantes pour l'upload de fonction Netlify (API deploys).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import path from 'node:path';

const CONFIG = JSON.parse(readFileSync('C:/Users/ghost/AppData/Roaming/netlify/Config/config.json', 'utf8'));
const token = CONFIG.users[CONFIG.userId].auth.token;
const SITE = '269577db-c249-4cce-a66a-609419f1a46c';
const root = 'C:/workspace/herbier-medicinal';
const SRC = path.join(root, 'netlify', 'functions', 'tiktok-demo-upload.js');
const VARIANTE = path.join(root, '.netlify', 'variant.zip');
const sha1 = (b) => createHash('sha1').update(b).digest('hex');

const zip = (cmd) => { execSync(cmd); return readFileSync(VARIANTE); };
const plat = zip(`python -c "import zipfile;zipfile.ZipFile(r'${VARIANTE}','w',zipfile.ZIP_DEFLATED).write(r'${SRC}','tiktok-demo-upload.js')"`);

const files = {};
const parcourir = (dir, pref = '') => {
  for (const f of readdirSync(dir)) {
    if (f === 'netlify' || f === '.netlify') continue;
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) parcourir(p, pref + '/' + f);
    else files[pref + '/' + f] = sha1(readFileSync(p));
  }
};
parcourir(path.join(root, 'www'));

const dep = await (await fetch(`https://api.netlify.com/api/v1/sites/${SITE}/deploys`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ files, functions: { 'tiktok-demo-upload': sha1(plat) }, async: false }),
})).json();
console.log('deploy:', dep.id, '| required_functions:', JSON.stringify(dep.required_functions), '| functions cfg:', JSON.stringify(dep.functions || null).slice(0, 100));

const variantes = [
  { nom: 'ct-zip+stateless', url: '?runtime=js&invocation_mode=stateless', ct: 'application/zip' },
  { nom: 'ct-octet+stateless', url: '?runtime=js&invocation_mode=stateless', ct: 'application/octet-stream' },
  { nom: 'ct-zip+buffered', url: '?runtime=js&invocation_mode=buffered', ct: 'application/zip' },
  { nom: 'ct-zip+size', url: `?runtime=js&size=${plat.length}`, ct: 'application/zip' },
  { nom: 'ct-zip+simple', url: '?runtime=js', ct: 'application/zip' },
];
for (const v of variantes) {
  const r = await fetch(`https://api.netlify.com/api/v1/deploys/${dep.id}/functions/tiktok-demo-upload${v.url}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': v.ct },
    body: plat,
  });
  const t = await r.text();
  console.log(`${v.nom} -> HTTP ${r.status} ${t.slice(0, 130)}`);
  if (r.ok) { console.log('*** SUCCES avec', v.nom); break; }
}
