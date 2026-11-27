import { categories, faqs, steps } from './data.mjs';
import { escape, link, idea, investorPreviewLabel, list, wrap, article, categoryGrid, processList, faqList, missionCards, valueCards, contactLinks, pageIntro, cta } from './ui.mjs';
import { ideaForm, investorForm, contactForm, signInForm, registrationForm, resetForm } from './forms.mjs';
import { legalPages } from './legal.mjs';

const para = (text) => '<p>' + text + '</p>';
const buttons = (...items) => `<div class="actions">${items.join('')}</div>`;
const panel = (content) => `<section class="section"><div class="wrap prose">${content}</div></section>`;
const more = link('/innovation-categories/', 'Browse All Categories', 'button primary');
const investor = link('/investor-enquiry/', investorPreviewLabel, 'button primary');
const ip = link('/intellectual-property/', 'How We Respect Your Ideas');
const faqLink = link('/faqs/', 'Read All FAQs', 'button secondary');
const journey = link('/how-it-works/', 'See the Full Process', 'button secondary');
const end = () => cta('Your Next Step Could Begin Here', 'Learn what to prepare for future idea submissions or explore ways to support developing projects.', link('/for-innovators/', 'Read the Innovator Guide', 'button primary') + link('/for-investors/', 'Explore Ways to Support', 'button outline'));

const homeCategories = categories.filter(({ id }) =>
  ['renewable-energy', 'technology-software', 'engineering-manufacturing', 'community-social'].includes(id),
);
const homeFaqs = faqs.filter(([question]) => [
  'Who can submit an idea?',
  'Does submitting an idea guarantee funding?',
  'Can I submit an early-stage concept?',
  'Will my idea be kept confidential?',
  'Can I submit an idea or enquiry now?',
].includes(question));
const homeProcess = `<ol class="process-overview">${steps.map(([title, description]) => `<li><div><strong>${escape(title)}</strong><p>${escape(description)}</p></div></li>`).join('')}</ol>`;

const home = `<section class="hero">
<picture class="hero-media"><source media="(max-width: 680px)" srcset="/assets/heritage-mobile.webp"><img src="/assets/heritage.webp" width="1536" height="1024" fetchpriority="high" alt=""></picture>
<div class="wrap hero-inner"><div class="hero-copy"><p class="eyebrow">Innovation development in South Africa</p>
<h1>Your Idea Deserves a Future.</h1>
<p class="lead">Makhuzwayo Investors is developing a process to help South African innovators understand what their ideas need next, from technical guidance and prototyping to introductions to potential investors.</p>
<p class="preview-note">Website preview · Idea submissions are closed</p>
${buttons(link('/how-it-works/', 'See How It Works', 'button primary'), idea(undefined, 'button outline'))}</div></div></section>
${wrap('Where Ideas Meet Opportunity', `<p class="section-lead">A promising idea deserves consideration, whatever resources its creator starts with.</p><div class="two-col audience-grid"><article class="info-card"><h3>For Innovators</h3><p>Prepare an early concept, prototype or pilot for future review. Find out what to include in a non-confidential idea summary. Keep trade secrets and source code private.</p>${link('/for-innovators/', 'Prepare an Idea')}</article><article class="info-card"><h3>For Investors</h3><p>Explore ways to support suitable projects through mentorship, technical expertise or potential project-specific investment.</p>${link('/for-investors/', 'Explore Investor Participation')}</article></div>`, 'get-involved', 'home-section')}
${wrap('From Idea to Possibility', '<p class="section-lead">A five-stage guide to how an idea could move from a first summary to an agreed project.</p>' + homeProcess + para('Progress depends on evaluation, available resources and mutually agreed terms.') + buttons(journey), 'process', 'soft home-section')}
${wrap('Every Industry Begins With an Idea', categoryGrid(homeCategories) + buttons(more), 'categories', 'home-section featured-categories')}
${wrap('Respecting the People Behind the Ideas', `<div class="prose"><p>Makhuzwayo Investors aims to recognise the people who create original ideas and to clarify contributions, responsibilities and ownership before substantial development. Future collaborations would use transparent, project-specific agreements.</p>${link('/intellectual-property/', 'Read the Intellectual Property Guide')}</div>`)}
${wrap('Mission and Vision', missionCards() + buttons(link('/about/#mission', 'Explore Our Values')), 'mission', 'soft home-section')}
${wrap('Frequently Asked Questions', faqList(homeFaqs) + buttons(faqLink), '', 'home-section')}
${end()}`;

const pages = [
  { url: '/', title: 'Innovation Support in South Africa', description: 'Makhuzwayo Investors helps South African innovators explore guidance, collaboration, project development and potential investment opportunities.', body: home },
];

function add(url, title, description, body, options = {}) {
  const { crumbs, eyebrow, introStyle, noindex, schema } = options;
  pages.push({ url, title, description, body: pageIntro(title, description, crumbs, eyebrow, introStyle) + body, crumbs, noindex, schema });
}

add('/about/', 'About Us', 'Learn why Makhuzwayo Investors aims to help South African innovators build practical projects and be recognised for their contributions.',
  panel(article('Our purpose', para('Makhuzwayo Investors begins with a simple conviction: a person’s access to money, equipment or professional networks should not determine whether their idea is heard. The initiative aims to help innovators understand what their ideas need and explore suitable collaborators and resources.') + "<p>We are especially interested in widening access for historically disadvantaged communities and Black South African innovators, so more people can participate in building solutions with lasting local value.</p>") +
  article('Our founder’s vision', para('The founder’s vision is to help promising creators turn practical ideas into opportunities that can benefit their communities. The fuller story of the Makhuzwayo name and its family heritage will be shared once approved.'))) +
  wrap('Mission, Vision and Values', missionCards() + valueCards(), 'mission', 'soft') + end(), { schema: 'AboutPage' });

add('/how-it-works/', 'How It Works', 'Explore the five proposed stages from a first idea summary to project-specific collaboration.',
  wrap('From Idea to Possibility', processList()) +
  panel(article('What each stage means', list(['An idea is a concept or early proposal.', 'An idea under review is being considered for relevance and feasibility.', 'A potential development opportunity has an identified next step worth exploring.', 'A formally approved project has passed an internal decision and may proceed under agreed terms.', 'An agreed investment arrangement exists only once the relevant parties have signed the applicable project-specific agreement.'])) +
  article('What to prepare', para('Make the problem and intended beneficiaries clear. Include the project’s current stage and what you need to test or develop next.') + buttons(link('/for-innovators/', 'Prepare an Idea', 'button primary'), idea(undefined, 'button secondary')))));

add('/innovation-categories/', 'Innovation Categories', 'Explore ten innovation areas, from renewable energy and software to education and community-led projects.', wrap('Every Industry Begins With an Idea', categoryGrid(), '', 'home-section'), { introStyle: 'compact-intro' });

categories.forEach((category, index) => {
  const related = [categories[(index + 1) % categories.length], categories[(index + 4) % categories.length]];
  add(category.url, category.name, category.description,
    panel(article('Illustrative project ideas', list(category.examples)) + article('What to consider early', para(escape(category.challenge))) +
    article('Possible development support', para(escape(category.pathway))) + article('Illustrative first test', para(escape(category.firstTest))) +
    article('Category question', faqList([[category.question, category.answer]])) +
    buttons(idea('/submit-your-idea/?category=' + category.id), link('/innovation-categories/', 'See All Categories'))) +
    wrap('Explore Related Categories', categoryGrid(related), '', 'soft'),
    { crumbs: [['/innovation-categories/', 'Innovation Categories'], [null, category.name]] });
});

add('/for-innovators/', 'For Innovators', 'Prepare an early-stage idea, a prototype or a project for future consideration by Makhuzwayo Investors.',
  panel(article('Who this guide is for', para('Individuals and organisations can use the guide to prepare ideas in any of the innovation categories. The submission eligibility rules are awaiting approval.')) +
  article('Prepare your idea summary', list(['Describe the problem and who experiences it.', 'Summarise your proposed solution in plain language.', 'State the category and current development stage.', 'Share what you have learned so far and where you need help.', 'Keep confidential details private and describe only what is necessary for an initial review.'])) +
  article('Five-part idea summary', list(['Problem — What needs to change?', 'Intended users — Who experiences the problem?', 'Broad approach — What would the idea do?', 'Current stage — What has been tried?', 'Support needed — What would help test or develop it?']) +
    para('Example — A community shop loses track of stock during handovers. Staff would use a shared device to record sales offline. The idea is at concept stage. We need help testing a simple prototype during a stocktake.') + para(ip)) +
  article('Prepare for a possible discussion', para('The team may ask about feasibility, practical tests and what support could help. It is useful to document assumptions and separate them from evidence.') + buttons(idea(), ip, journey))));

add('/submit-your-idea/', 'Idea Form Preview', 'See what you’ll need to prepare for an initial innovation enquiry.',
  ideaForm(), { noindex: true, eyebrow: 'Idea submissions are closed', introStyle: 'compact-intro' });
add('/for-investors/', 'For Investors', 'Explore responsible ways to support South African innovation through expertise, mentoring and potential project-specific investment.',
  panel(article('Ways to participate', list(['Explore innovation areas with practical development needs.', 'Offer mentorship, technical expertise or sector knowledge.', 'Consider strategic collaboration and commercial development.', 'Express interest in suitable opportunities that may later qualify for project-specific investment.'])) +
  article('What to include in an enquiry', para('Describe your areas of interest and the kind of help you could offer. A mentor could help a team plan its first customer interviews. A technical collaborator could advise on a prototype test. A potential investor could indicate which project stages they would consider.')) +
  '<article class="article" id="opportunities"><h2>How investment opportunities work</h2><p>Unreviewed ideas are at the discovery stage. Any prospective investment opportunity would follow appropriate screening, due diligence, conflict-of-interest checks and a separate written agreement. Long-term impact and responsible participation guide the proposed approach.</p><p>Investor enquiries are intended to capture interest. Funds and investment decisions are outside this website’s current scope.</p></article>' +
  '<p class="notice"><strong>Current availability</strong><br>Project opportunities and investor enquiries are currently closed.</p>' + buttons(investor, link('/innovation-categories/', 'Explore Innovation Categories'))));
add('/investor-enquiry/', 'Investor Enquiry Preview', 'See how you can indicate the projects and forms of collaboration that interest you.',
  investorForm(), { noindex: true, eyebrow: 'Investor enquiries are closed', introStyle: 'compact-intro' });

add('/sign-in/', 'Sign-in Preview', 'Choose the innovator or investor sign-in preview for your intended role.', signInForm(), { noindex: true, eyebrow: 'Sign-in is unavailable', introStyle: 'compact-intro' });
add('/register/innovator/', 'Create an Innovator Account', 'Preview registration for an account that could help you manage future idea submissions and receive review updates.', registrationForm('innovator'), { noindex: true, crumbs: [['/sign-in/', 'Sign-in Preview'], [null, 'Innovator Registration']] });
add('/register/investor/', 'Create an Investor Account', 'Preview a future account for managing expressions of interest. Use the investor enquiry preview to explore how to indicate your interests first.', registrationForm('investor'), { noindex: true, crumbs: [['/sign-in/', 'Sign-in Preview'], [null, 'Investor Registration']] });
add('/forgot-password/', 'Forgot Password', 'Preview the email step for requesting a future account password reset.', resetForm(), { noindex: true, crumbs: [['/sign-in/', 'Sign-in Preview'], [null, 'Forgot Password']] });

add('/contact/', 'Contact', 'Find contact information and preview the general enquiry form for Makhuzwayo Investors.',
  panel(article('General enquiries', para(contactLinks()) + para('For an idea or investor enquiry, use the dedicated preparation pages.') + buttons(link('/contact/#general-enquiry', 'Preview a General Enquiry', 'button secondary'), idea(), link('/investor-enquiry/', investorPreviewLabel)))) + contactForm(), { schema: 'ContactPage', eyebrow: 'Online enquiries are closed', introStyle: 'compact-intro' });
const faqGroups = [
  ['Ideas and eligibility', [0, 1, 2, 4, 5, 9]],
  ['Review and funding', [3, 6, 11, 12, 13]],
  ['Ownership and confidentiality', [7, 8]],
  ['Investor participation', [10]],
];
add('/faqs/', 'Frequently Asked Questions', 'Answers about the planned idea review process, access, confidentiality, recognition and investor participation.',
  panel(faqGroups.map(([title, entries]) => article(title, faqList(entries.map((index) => faqs[index])))).join('')));

for (const { url, title, description, content } of legalPages) {
  add(url, title, description, panel(`<aside class="notice"><strong>Draft for review</strong><p>This page is provisional and awaiting approval.</p></aside>${content}`), { noindex: true });
}

add('/404.html', 'Page Not Found', 'Try the homepage or browse the innovation categories.', panel(buttons(link('/', 'Return Home', 'button primary'), more)), { noindex: true });

export { pages };
