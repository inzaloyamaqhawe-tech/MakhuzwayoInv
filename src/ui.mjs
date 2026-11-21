import { site } from './config.mjs';
import { nav, steps, categories, faqs, mission, vision, values } from './data.mjs';

export const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));
export const link = (url, label, style = 'text-link') => '<a class="' + style + '" href="' + escape(url) + '">' + escape(label) + '</a>';
export const idea = (url = '/submit-your-idea/') => link(url, 'Submit Your Idea', 'button primary');
export const list = (items) => '<ul>' + items.map((item) => '<li>' + escape(item) + '</li>').join('') + '</ul>';
export const wrap = (title, body, id = '', style = '') => `<section class="section ${style}" ${id ? 'id="' + id + '"' : ''}><div class="wrap"><h2>${title}</h2>${body}</div></section>`;
export const article = (title, body) => `<article class="article"><h2>${title}</h2>${body}</article>`;

const icons = {
  sun: 'M12 4v2m0 12v2M4 12h2m12 0h2M6 6l1.5 1.5m9 9L18 18M6 18l1.5-1.5m9-9L18 6M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-2-14-4 16',
  gear: 'M9 3h6l1 4 4 1v7l-4 1-1 4H9l-1-4-4-1V8l4-1 1-4Zm6 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  sprout: 'M12 21v-8m0 3C5 16 3 12 3 7c6 0 9 3 9 8m0-2c0-6 3-9 9-9 0 6-3 9-9 9Z',
  cycle: 'M4 10a8 8 0 0 1 14-4l2 3m0-5v5h-5m5 5a8 8 0 0 1-14 4l-2-3m0 5v-5h5',
  plus: 'M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z',
  book: 'M12 6c-3-3-6-3-9-2v14c3-1 6-1 9 2 3-3 6-3 9-2V4c-3-1-6-1-9 2Zm0 0v14',
  route: 'M5 19h10a4 4 0 0 0 0-8H9a3 3 0 0 1 0-6h7m-1-3 3 3-3 3M4 16v6m-3-3h6',
  people: 'M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2M4 6a3 3 0 0 0 0 6m16-6a3 3 0 0 1 0 6',
  spark: 'M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z',
};
const icon = (name) => `<svg class="icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[name]}"></path></svg>`;

export function categoryGrid(items = categories) {
  return `<div class="category-grid">${items.map((category) => `<article class="category-card">
    ${icon(category.icon)}<h3>${escape(category.name)}</h3><p>${escape(category.description)}</p>
    <p class="example"><strong>Example</strong> ${escape(category.examples[0])}</p>
    <a class="text-link" href="${category.url}">Explore Category<span class="sr-only">, ${escape(category.name)}</span><span aria-hidden="true"> ↗</span></a>
  </article>`).join('')}</div>`;
}

export function processList() {
  const ordered = steps.map(([title, description], index) => `<li><details ${index === 0 ? 'open' : ''} name="process"><summary><span class="step-number" aria-hidden="true">0${index + 1}</span>${title}</summary><p>${description}</p></details></li>`).join('');
  return `<ol class="process">${ordered}</ol><p class="muted">Progress depends on evaluation, available resources and mutually agreed terms.</p>`;
}

export function faqList(items = faqs) {
  return `<div class="faq-list">${items.map(([question, answer]) => `<details><summary>${escape(question)}</summary><p>${escape(answer)}</p></details>`).join('')}</div>`;
}

export function missionCards() {
  return `<div class="two-col"><article class="info-card"><h3>Mission</h3><p>${mission}</p></article>
  <article class="info-card"><h3>Vision</h3><p>${vision}</p></article></div>`;
}

export function valueCards() {
  return `<dl class="values">${values.map(([title, description]) => `<div><dt>${title}</dt><dd>${description}</dd></div>`).join('')}</dl>`;
}

export function contactLinks() {
  return [
    site.contactEmail && link('mailto:' + site.contactEmail, site.contactEmail),
    site.contactPhone && link('tel:' + site.contactPhone, site.contactPhoneLabel),
  ].filter(Boolean).join('<br>') || 'Official contact details will be published here once confirmed.';
}

export const crumb = (parts) => `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${parts.map(([url, title]) => `<li>${url ? link(url, title, 'crumb-link') : '<span aria-current="page">' + escape(title) + '</span>'}</li>`).join('')}</ol></nav>`;

export function pageIntro(title, description, parts = [[null, title]], eyebrow = '') {
  return `<header class="page-intro"><div class="wrap">${crumb(parts)}${eyebrow ? '<p class="eyebrow">' + escape(eyebrow) + '</p>' : ''}<h1>${escape(title)}</h1><p class="lead">${escape(description)}</p></div></header>`;
}

export function cta(title, description, buttons) {
  return `<section class="cta"><div class="wrap cta-inner"><div><h2>${title}</h2><p>${description}</p></div><div class="actions">${buttons}</div></div></section>`;
}

function footerGroup(title, items) {
  return `<div><h2>${title}</h2><ul>${items.map(([url, label]) => `<li>${link(url, label, 'footer-link')}</li>`).join('')}</ul></div>`;
}

export function shell(page, metadata) {
  const credit = site.footerCredit;
  const isActive = (url) => url === '/' ? page.url === '/' : page.url.startsWith(url);
  return `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${metadata}
<link rel="stylesheet" href="/assets/styles.css">
<script type="module" src="/assets/main.mjs"></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap header-inner">
<a class="brand header-brand" href="/"><img src="/assets/milogo.png" width="1254" height="1254" alt="Makhuzwayo Investors"></a>
<button type="button" class="menu-toggle" aria-expanded="false" aria-controls="site-nav" hidden>Menu <span aria-hidden="true">☰</span></button>
<nav id="site-nav" aria-label="Primary" class="site-nav">
<ul>${nav.map(([url, label]) => `<li><a href="${url}" ${isActive(url) ? 'aria-current="' + (url === page.url ? 'page' : 'location') + '"' : ''}>${label}</a></li>`).join('')}</ul>
<div class="header-actions"><a class="button secondary" href="/sign-in/" ${isActive('/sign-in/') ? 'aria-current="page"' : ''}>Sign In</a><a class="button primary" href="/submit-your-idea/" ${isActive('/submit-your-idea/') ? 'aria-current="page"' : ''}>Submit Your Idea</a></div>
</nav>
</div></header>
<main id="main" tabindex="-1">${page.body}</main>
<footer class="site-footer"><div class="wrap">
<div class="footer-grid">
<div class="footer-intro"><a class="brand footer-brand" href="/"><img src="/assets/mimark.png" width="1008" height="737" alt="" loading="lazy"><span class="brand-name">Makhuzwayo <span>Investors</span></span></a><p>Helping South African innovators explore ways to develop ideas that meet practical needs.</p><p>${contactLinks()}</p></div>
${footerGroup('Explore', [['/about/', 'About Us'], ['/how-it-works/', 'How It Works'], ['/innovation-categories/', 'Innovation Categories'], ['/innovation-categories/renewable-energy/', 'Renewable Energy'], ['/innovation-categories/technology-software/', 'Technology & Software'], ['/contact/', 'Contact']])}
${footerGroup('Get involved', [['/for-innovators/', 'For Innovators'], ['/submit-your-idea/', 'Submit Your Idea'], ['/for-investors/', 'For Investors'], ['/investor-enquiry/', 'Investor Enquiry'], ['/faqs/', 'FAQs']])}
${footerGroup('Policies and guidance', [['/privacy/', 'Privacy Policy'], ['/terms/', 'Terms of Use'], ['/idea-submission-terms/', 'Idea Submission Terms'], ['/intellectual-property/', 'Intellectual Property'], ['/privacy/#cookies', 'Cookie Information']])}
</div>
<div class="footer-bottom"><small>© ${new Date().getFullYear()} Makhuzwayo Investors</small><small class="developer-credit">Powered By: <a href="${escape(credit.url)}" target="_blank" rel="noopener noreferrer">${escape(credit.name)}</a></small></div>
</div></footer>
</body>
</html>`;
}
