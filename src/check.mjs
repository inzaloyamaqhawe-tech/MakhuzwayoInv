import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { pages } from './pages.mjs';
import { buildTarget } from './config.mjs';
import { previewServer } from './preview.mjs';

const server = previewServer().listen(0, '127.0.0.1');
await new Promise((done) => server.once('listening', done));
const { directory, basePath } = buildTarget;
const origin = 'http://127.0.0.1:' + server.address().port + basePath;
const resources = new Map();
function get(path) {
  if (!resources.has(path)) resources.set(path, fetch(origin + path).then(async (response) => ({ status: response.status, body: await response.text(), type: response.headers.get('content-type') })));
  return resources.get(path);
}
try {
  const titles = new Set();
  const descriptions = new Set();
  const links = new Set();
  for (const page of pages) {
    const { status, body: rendered } = await get(page.url);
    for (const [, route] of rendered.matchAll(/\b(?:href|src|srcset)="(\/(?!\/)[^"]*)"/g)) {
      assert.ok(route.startsWith(basePath + '/'), route);
      links.add(route.slice(basePath.length).replace(/&amp;/g, '&'));
    }
    const body = basePath ? rendered.replaceAll('="' + basePath + '/', '="/') : rendered;
    if (basePath) assert.match(body, /name="robots" content="noindex, follow"/);
    assert.equal(status, 200, page.url);
    assert.equal([...body.matchAll(/<h1[ >]/g)].length, 1, page.url);
    titles.add(body.match(/<title>(.*?)<\/title>/)?.[1]);
    descriptions.add(body.match(/name="description" content="([^"]+)"/)?.[1]);
    assert.doesNotMatch(body.split('<footer')[0], /iytech|inzalo yamaqhawe|Powered By:/i, page.url);
    assert.equal([...body.matchAll(/Powered By:/g)].length, 1, page.url);
    assert.match(body, /<footer[\s\S]*Powered By: <a href="https:\/\/www\.iytechnologies\.co\.za"[^>]*>Inzalo Yamaqhawe Technologies<\/a>/, page.url);
    assert.match(body, /<title>[^<]{1,45}<\/title>/, page.url);
    assert.match(body, /rel="icon"[^>]*href="\/assets\/favicon\.png"/, page.url);
    assert.match(body, /class="brand header-brand"[^>]*><img src="\/assets\/milogo\.png"/, page.url);
    assert.match(body, /<strong class="header-company">Makhuzwayo Investors<\/strong><span class="header-slogan">Empowering Ideas\. Building Legacies\.<\/span>/, page.url);
    assert.match(body, /class="brand footer-brand"[^>]*><img src="\/assets\/mimark\.png"/, page.url);
    const ids = [...body.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(ids.length, new Set(ids).size, 'duplicate IDs: ' + page.url);
    if (body.includes('data-preview-form')) {
      assert.match(body, /form-action 'none'/);
      assert.match(body, /type="submit" [^>]*disabled/);
    }
  }
  assert.equal(titles.size, pages.length);
  assert.equal(descriptions.size, pages.length);
  assert.ok(!titles.has(undefined) && !descriptions.has(undefined));
  await Promise.all([...links].map(async (path) => {
    const [resource, anchor] = path.split('#');
    const { status, body } = await get(resource);
    assert.equal(status, 200, path);
    if (anchor) assert.ok(body.includes('id="' + anchor + '"'), path);
  }));
  assert.match((await get('/assets/main.mjs')).type, /^text\/javascript/);
  assert.match((await get('/assets/heritage.webp')).type, /^image\/webp/);
  for (const file of ['milogo.png', 'mimark.png', 'favicon.png']) {
    assert.equal((await get('/assets/' + file)).type, 'image/png', file);
  }
  assert.deepEqual(
    await readFile(new URL('../' + directory + '/assets/milogo.png', import.meta.url)),
    await readFile(new URL('../public/assets/milogo.png', import.meta.url)),
  );
  const missing = await get('/this-page-does-not-exist/');
  assert.equal(missing.status, 404);
  assert.match(missing.body, /<h1>Page Not Found<\/h1>/);
  assert.equal((await get('/api/sign-in.php')).status, 404);
  assert.equal((await get('/.env')).status, 404);
  assert.equal((await fetch(origin + '/sign-in/', { method: 'POST' })).status, 405);
  assert.equal((await fetch(origin + '/index.html', { redirect: 'manual' })).headers.get('location'), basePath + '/');
  assert.equal((await fetch(origin + '/innovation-categories', { redirect: 'manual' })).headers.get('location'), basePath + '/innovation-categories/');
  const output = new URL('../' + directory + '/', import.meta.url);
  const entries = await readdir(output);
  if (basePath) {
    assert.ok(!entries.includes('.htaccess'));
    assert.equal((await fetch(origin + '/README.md')).status, 404);
  } else {
    assert.match(await readFile(new URL('.htaccess', output), 'utf8'), /ErrorDocument 404 \/404\.html/);
  }
  assert.ok(!entries.some((name) => /^\.(?:env|git)/.test(name) || ['docs', 'src'].includes(name)));
  console.log(`Verified ${pages.length} pages and ${links.size} unique internal links and assets, route redirects, 404 status, brand assets, footer credit and inactive forms.`);
} finally {
  server.close();
}
