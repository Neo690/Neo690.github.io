// Déploiement Netlify par zip (sans fonctions — tout est statique).
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const CONFIG = JSON.parse(readFileSync('C:/Users/ghost/AppData/Roaming/netlify/Config/config.json', 'utf8'));
const token = CONFIG.users[CONFIG.userId].auth.token;
const root = 'C:/workspace/herbier-medicinal';
const out = `${root}/deploy-herbier.zip`;

const py = `
import zipfile, os
root = r'C:/workspace/herbier-medicinal'
out = r'C:/workspace/herbier-medicinal/deploy-herbier.zip'
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    base = os.path.join(root, 'www')
    for dirpath, dirs, files in os.walk(base):
        dirs[:] = [d for d in dirs if d not in ('.netlify', 'netlify')]
        for f in files:
            p = os.path.join(dirpath, f)
            z.write(p, os.path.relpath(p, base))
print('ZIP_OK', os.path.getsize(out))
`;
writeFileSync(`${root}/tmp-zip.py`, py);
console.log(execSync('python tmp-zip.py', { cwd: root, encoding: 'utf8' }));

const resp = JSON.parse(execSync(
  `curl -sS -H "Content-Type: application/zip" -H "Authorization: Bearer ${token}" --data-binary "@${out}" "https://api.netlify.com/api/v1/sites/269577db-c249-4cce-a66a-609419f1a46c/deploys"`,
  { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
));
if (!resp.id) { console.error('ECHEC:', JSON.stringify(resp).slice(0, 300)); process.exit(1); }
console.log('deploy_id:', resp.id, '| state:', resp.state);

for (let i = 0; i < 40; i++) {
  await new Promise(r => setTimeout(r, 3000));
  const s = JSON.parse(execSync(`curl -sS -H "Authorization: Bearer ${token}" "https://api.netlify.com/api/v1/deploys/${resp.id}"`, { encoding: 'utf8' }));
  console.log(`[${i}] ${s.state}`);
  if (s.state === 'ready') { console.log('DEPLOY PRET'); break; }
  if (s.state === 'error') { console.error('ERREUR', JSON.stringify(s).slice(0, 300)); process.exit(1); }
}
