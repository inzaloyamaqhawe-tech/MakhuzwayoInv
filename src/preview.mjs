import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const mime = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };

export function previewServer() {
  return createServer(async (request, response) => {
    const missing = async () => {
      if (!response.headersSent) response.writeHead(404, { 'Content-Type': mime['.html'], 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : await readFile(resolve(root, '404.html')).catch(() => 'Page not found. Run the build first.'));
    };
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end();
      return;
    }
    try {
      const url = new URL(request.url, 'http://localhost');
      const path = decodeURIComponent(url.pathname);
      if (path.includes('\\') || path.split('/').some((segment) => segment.startsWith('.'))) return await missing();
      const target = resolve(root, '.' + path + (path.endsWith('/') ? 'index.html' : ''));
      const inside = relative(root, target);
      if (inside.startsWith('..') || isAbsolute(inside)) return await missing();
      if (!path.endsWith('/') && !extname(path)) {
        await readFile(resolve(target, 'index.html'));
        response.writeHead(301, { Location: url.pathname + '/' + url.search });
        response.end();
        return;
      }
      if (path.endsWith('/index.html')) {
        await readFile(target);
        response.writeHead(301, { Location: url.pathname.slice(0, -'index.html'.length) + url.search });
        response.end();
        return;
      }
      const content = await readFile(target);
      response.writeHead(200, { 'Content-Type': mime[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch {
      await missing();
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 4173);
  previewServer().listen(port, '127.0.0.1', () => console.log(`Local preview http://127.0.0.1:${port}/`));
}
