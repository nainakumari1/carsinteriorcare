'use strict';
/* Zero-dependency static server. Injects config (phone, address, Maps key) into pages. */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, 'public');
let cfg = {};
try { cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8')); } catch (e) { console.warn('config.json not read:', e.message); }
const conf = {
  phoneDisplay: process.env.PHONE_DISPLAY || cfg.phoneDisplay || '647-675-5869',
  phoneTel: process.env.PHONE_TEL || cfg.phoneTel || '+16476755869',
  address: (process.env.BUSINESS_ADDRESS || cfg.address || '').trim(),
  mapsKey: process.env.GOOGLE_MAPS_API_KEY || cfg.googleMapsApiKey || ''
};
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml' };

function inject(html) {
  return html.replace(/(<script type="application\/json" id="site-data">)([\s\S]*?)(<\/script>)/, (m, a, json, c) => {
    try {
      const d = JSON.parse(json);
      d.phone = { display: conf.phoneDisplay, tel: conf.phoneTel };
      d.address = conf.address; d.mapsKey = conf.mapsKey; d.testMode = false;
      return a + JSON.stringify(d).replace(/</g, '\\u003c') + c;
    } catch (e) { return m; }
  });
}
const pages = {};
for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) pages[f] = inject(fs.readFileSync(path.join(ROOT, f), 'utf8'));

const server = http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch (e) { res.writeHead(400); return res.end('Bad request'); }
  if (p === '/healthz') { res.writeHead(200); return res.end('ok'); }
  if (p === '/') p = '/index.html';
  else if (!path.extname(p) && pages[p.slice(1) + '.html']) p += '.html';
  const sec = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' };
  const name = p.slice(1);
  if (pages[name]) { res.writeHead(200, { ...sec, 'Content-Type': MIME['.html'], 'Cache-Control': 'no-cache' }); return res.end(req.method === 'HEAD' ? undefined : pages[name]); }
  const file = path.join(ROOT, path.normalize(p));
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end('<h1>404</h1><p><a href="/">Back to home</a></p>'); }
    res.writeHead(200, { ...sec, 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': 'public, max-age=604800' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
});
server.listen(process.env.PORT || 3000, () => console.log('Cars Interior Care running on port ' + (process.env.PORT || 3000)));
