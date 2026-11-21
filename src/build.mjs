import { cp, mkdir, mkdtemp, rename, rm, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './config.mjs';
import { pages } from './pages.mjs';
import { escape, shell } from './ui.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const publicSource = join(root, 'public');
const titleOf = (page) => page.title + ' | ' + site.name;

function head(page) {
  const indexable = site.indexing && !page.noindex;
  const url = site.origin && page.url !== '/404.html' ? site.origin + page.url : '';
  const graph = [
    { '@type': 'Organization', '@id': site.origin ? site.origin + '/#organisation' : '#organisation', name: site.name, ...(site.origin && { url: site.origin + '/' }), ...(site.contactEmail && { email: site.contactEmail }), ...(site.contactPhone && { telephone: site.contactPhone }) },
    { '@type': 'WebSite', name: site.name, inLanguage: 'en-ZA', ...(site.origin && { url: site.origin + '/' }) },
  ];
  if (page.schema) graph.push({ '@type': page.schema, name: page.title, description: page.description, ...(url && { url }) });
  if (url && page.url !== '/') {
    const crumbs = [['/', 'Home'], ...(page.crumbs || [[null, page.title]])];
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map(([path, name], position) => ({
        '@type': 'ListItem', position: position + 1, name, item: path ? site.origin + path : url,
      })),
    });
  }
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  const image = site.origin && site.origin + '/assets/heritage.webp';
  const tabTitle = page.url === '/' ? site.name : page.title;
  return `<title>${escape(tabTitle)}</title>
<link rel="icon" type="image/png" sizes="64x64" href="/assets/favicon.png">
<meta name="description" content="${escape(page.description)}">
<meta name="robots" content="${indexable ? 'index, follow' : 'noindex, follow'}">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'none'; connect-src 'none'">
${url ? '<link rel="canonical" href="' + escape(url) + '">' : ''}
<meta property="og:site_name" content="${site.name}">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_ZA">
<meta property="og:title" content="${escape(titleOf(page))}">
<meta property="og:description" content="${escape(page.description)}">
${url ? '<meta property="og:url" content="' + escape(url) + '">' : ''}
${image ? '<meta property="og:image" content="' + escape(image) + '"><meta property="og:image:alt" content="Illustrative cultural gathering in the hills of KwaZulu-Natal">' : ''}
<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">
<meta name="twitter:title" content="${escape(titleOf(page))}">
<meta name="twitter:description" content="${escape(page.description)}">
${image ? '<meta name="twitter:image" content="' + escape(image) + '">' : ''}
${page.url !== '/404.html' ? '<script type="application/ld+json">' + schema + '</script>' : ''}`;
}

const robots = 'User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nDisallow: /innovator/\nDisallow: /investor/\n' +
  (site.indexing ? 'Sitemap: ' + site.origin + '/sitemap.xml\n' : '');
const apache = `DirectoryIndex index.html
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{THE_REQUEST} "\\s/+(.*/)?index\\.html[?\\s]" [NC]
  RewriteCond %{REQUEST_URI} !^/api/ [NC]
  RewriteRule ^(.*)index\\.html$ /$1 [R=301,L,NE]
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "DENY"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  <FilesMatch "\\.(?:css|mjs|webp|png)$">
    Header set Cache-Control "public, max-age=3600"
  </FilesMatch>
  <FilesMatch "\\.(?:html|txt|xml)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>

AddType text/javascript .mjs
AddType image/webp .webp
AddType image/png .png
`;

await Promise.all(['heritage.webp', 'heritage-mobile.webp', 'styles.css', 'main.mjs', 'milogo.png', 'mimark.png', 'favicon.png'].map((file) => access(join(publicSource, 'assets', file))));
const staging = await mkdtemp(join(root, '.dist-'));
try {
  await cp(publicSource, staging, { recursive: true });
  await Promise.all(pages.map(async (page) => {
    const output = join(staging, page.url.slice(1) + (page.url.endsWith('/') ? 'index.html' : ''));
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, shell(page, head(page)));
  }));
  await writeFile(join(staging, '.htaccess'), apache);
  await writeFile(join(staging, 'robots.txt'), robots);
  if (site.origin) {
    const entries = pages.filter((page) => !page.noindex).map((page) => '  <url><loc>' + escape(site.origin + page.url) + '</loc></url>').join('\n');
    await writeFile(join(staging, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + entries + '\n</urlset>\n');
  }
  await rm(dist, { recursive: true, force: true });
  await rename(staging, dist);
} finally {
  await rm(staging, { recursive: true, force: true });
}
console.log(`Built ${pages.length} pages in dist. Indexing ${site.indexing ? 'enabled' : 'off'}.`);
