/* Local static preview with byte ranges so video seeking works before full download. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.mp4':'video/mp4','.json':'application/json'};

function createServer() {
  return http.createServer(async (req, res) => {
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, {'Allow':'GET, HEAD'}); return res.end(); }
    let file;
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      file = path.resolve(root, '.' + pathname);
      if (file !== root && !file.startsWith(root + path.sep)) throw new Error('Outside site');
      if (pathname.includes('\0')) throw new Error('Invalid path');
    } catch (_) { res.writeHead(400); return res.end('Invalid path'); }
    try {
      let stat = await fs.promises.stat(file);
      if (stat.isDirectory()) { file = path.join(file, file === root ? '3.html' : 'index.html'); stat = await fs.promises.stat(file); }
      if (!stat.isFile()) throw new Error('Not a file');
      const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes','Last-Modified':stat.mtime.toUTCString(),'Cache-Control':'no-cache'};
      let start = 0, end = stat.size - 1, status = 200;
      if (req.headers.range && (!req.headers['if-range'] || req.headers['if-range'] === headers['Last-Modified'])) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        if (!match || (!match[1] && !match[2])) { res.writeHead(416, {...headers,'Content-Range':'bytes */'+stat.size}); return res.end(); }
        if (!match[1]) start = Math.max(0, stat.size - Number(match[2]));
        else { start = Number(match[1]); if (match[2]) end = Math.min(end, Number(match[2])); }
        if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= stat.size) {
          res.writeHead(416, {...headers,'Content-Range':'bytes */'+stat.size}); return res.end();
        }
        status = 206;
        headers['Content-Range'] = 'bytes '+start+'-'+end+'/'+stat.size;
      }
      headers['Content-Length'] = Math.max(0, end-start+1);
      res.writeHead(status, headers);
      if (req.method === 'HEAD' || stat.size === 0) return res.end();
      const stream = fs.createReadStream(file, {start, end});
      stream.on('error', () => res.destroy());
      res.on('close', () => stream.destroy());
      stream.pipe(res);
    } catch (_) { res.writeHead(404); res.end('Not found'); }
  });
}

module.exports = {createServer};
if (require.main === module) {
  const port = Number(process.env.PORT || 8000);
  createServer().listen(port, '127.0.0.1', () => console.log('SJF preview: http://127.0.0.1:'+port));
}
