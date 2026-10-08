import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = 'C:/Users/ghost/AppData/Local/Temp';
const srv = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const name = decodeURIComponent(req.url).replace(/^\/+/, '').split('?')[0] || 'icon-b64.txt';
  try {
    const data = await readFile(join(DIR, name));
    if (name.endsWith('.mp4')) res.setHeader('Content-Type', 'video/mp4');
    else res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(data);
  } catch (e) {
    res.statusCode = 404;
    res.end('not found: ' + name);
  }
});
srv.listen(8899, () => console.log('serveur base64 sur http://localhost:8899'));
