import { categories, faqs } from './data.mjs';
import { escape, link, idea, list, wrap, article, categoryGrid, processList, faqList, missionCards, valueCards, contactLinks, pageIntro, cta } from './ui.mjs';
import { ideaForm, investorForm, contactForm, signInForm, registrationForm, resetForm } from './forms.mjs';
import { legalPages } from './legal.mjs';

const para = (text) => '<p>' + text + '</p>';
const buttons = (...items) => `<div class="actions">${items.join('')}</div>`;
const panel = (content) => `<section class="section"><div class="wrap prose">${content}</div></section>`;
const more = link('/innovation-categories/', 'Browse All Categories', 'button secondary');
const investor = link('/investor-enquiry/', 'Become an Investor Partner', 'button primary');
const ip = link('/intellectual-property/', 'How We Respect Your Ideas');
const faqLink = link('/faqs/', 'Read All FAQs', 'button secondary');
const journey = link('/how-it-works/', 'See the Full Process', 'button secondary');
const end = () => cta('Your Next Step Could Begin Here', 'Whether you have an idea worth exploring or want to support meaningful innovation, we welcome the opportunity to hear from you.', idea() + link('/for-investors/', 'Explore Investor Opportunities', 'button outline'));

const home = `<section class="hero">
<picture class="hero-media"><source media="(max-width: 680px)" srcset="/assets/heritage-mobile.webp"><img src="/assets/heritage.webp" width="1536" height="1024" fetchpriority="high" alt=""></picture>
<div class="wrap hero-inner"><div class="hero-copy"><p class="eyebrow">Innovation development in South Africa</p>
<h1>Your Idea Deserves a Future.</h1>
<p class="lead">Great ideas can emerge from unexpected places. Makhuzwayo Investors aims to connect promising innovations with guidance, development support and potential investment opportunities.</p>
${buttons(idea(), link('/#mission', 'Explore Our Mission', 'button outline'))}</div></div></section>
${wrap('Where Ideas Meet Opportunity', `<div class="intro-grid"><p class="section-lead">A promising idea deserves consideration, whatever resources its creator starts with.</p><div><p>Makhuzwayo Investors is a South African innovation-development initiative. It aims to help people with practical ideas access guidance, technical knowledge and connections that can be difficult to find at the beginning.</p><p>We are especially interested in widening access for historically disadvantaged communities and Black South African innovators, so more people can participate in building solutions with lasting local value.</p>${link('/about/', 'About Makhuzwayo Investors')}</div></div>`)}
${wrap('Brilliant Ideas Shouldn’t Be Left Behind', `<div class="two-col"><article class="info-card"><h3>Where ideas can get stuck</h3><p>Limited funding, technical expertise, prototyping support, business guidance and professional networks can slow an idea down. Creators may also worry about protecting their work and receiving credit.</p></article><article class="info-card"><h3>How we aim to help</h3><p>We start by listening, reviewing potential and identifying development needs. Where feasible, we explore collaboration and connect innovators with relevant expertise to support responsible project development.</p></article></div>`, '', 'soft')}
${wrap('From Idea to Possibility', processList() + buttons(journey), 'process')}
${wrap('Every Industry Begins With an Idea', '<p class="section-lead">Find the area closest to your idea. The examples are illustrative.</p>' + categoryGrid() + buttons(more), 'categories', 'soft')}
${wrap('Your Vision Matters', `<div class="prose"><p>Individuals and organisations can prepare a practical concept, prototype or project for future review. Describe the problem, what you propose, who could benefit and how far you’ve developed the idea. Accurate, non-confidential information helps reviewers identify sensible next steps.</p><p>Participation criteria and review arrangements will be confirmed before submissions open.</p>${buttons(idea(), ip, link('/for-innovators/', 'Read the Innovator Guide'))}</div>`)}
${wrap('Support Innovation That Creates Meaningful Value', `<div class="prose"><p>Potential investors and partners can explore ways to support suitable projects through technical development, mentorship, strategic collaboration or project-specific investment, subject to review and agreement.</p>${buttons(investor, link('/for-investors/#opportunities', 'How Investment Opportunities Work'))}</div>`, '', 'soft')}
${wrap('Respecting the People Behind the Ideas', `<div class="prose"><p>Makhuzwayo Investors aims to recognise the people who create original ideas and to clarify contributions, responsibilities and ownership before substantial development. Future collaborations would use transparent, project-specific agreements.</p>${link('/intellectual-property/', 'Read the Intellectual Property Guide')}</div>`)}
${wrap('Mission, Vision and Values', missionCards() + valueCards(), 'mission', 'soft')}
${wrap('Frequently Asked Questions', faqList() + buttons(faqLink))}
${end()}`;

const pages = [
  { url: '/', title: 'Innovation Support in South Africa', description: 'Makhuzwayo Investors helps South African innovators explore guidance, collaboration, project development and potential investment opportunities.', body: home },
];

function add(url, title, description, body, options = {}) {
  const { crumbs, eyebrow, noindex, schema } = options;
  pages.push({ url, title, description, body: pageIntro(title, description, crumbs, eyebrow) + body, crumbs, noindex, schema });
}

add('/about/', 'About Us', 'Learn why Makhuzwayo Investors aims to help South African innovators build practical projects and be recognised for their contributions.',
  panel(article('Our purpose', para('Makhuzwayo Investors begins with a simple conviction: a person’s access to money, equipment or professional networks should not determine whether their idea is heard. The initiative aims to help innovators understand what their ideas need and explore suitable collaborators and resources.')) +
  article('Our founder’s vision', para('The founder’s vision is to help promising creators turn practical ideas into opportunities that can benefit their communities. The fuller story of the Makhuzwayo name and its family heritage will be shared once approved.'))) +
  wrap('Mission, Vision and Values', missionCards() + valueCards(), 'mission', 'soft') + end(), { schema: 'AboutPage' });

add('/how-it-works/', 'How It Works', 'Explore the five proposed stages from a first idea summary to project-specific collaboration.',
  wrap('From Idea to Possibility', processList()) +
  panel(article('What each stage means', list(['An idea is a concept or early proposal.', 'An idea under review is being considered for relevance and feasibility.', 'A potential development opportunity has an identified next step worth exploring.', 'A formally approved project has passed an internal decision and may proceed under agreed terms.', 'An agreed investment arrangement exists only once the relevant parties have signed the applicable project-specific agreement.'])) +
  article('What to prepare', para('Make the problem and intended beneficiaries clear. Include the project’s current stage and what you need to test or develop next.') + buttons(idea(), link('/for-innovators/', 'Read the Innovator Guide')))));

add('/innovation-categories/', 'Innovation Categories', 'Explore ten innovation areas, from renewable energy and software to education and community-led projects.', wrap('Every Industry Begins With an Idea', '<p class="section-lead">Examples show the kinds of ideas that could fit each sector.</p>' + categoryGrid()));

categories.forEach((category, index) => {
  const related = [categories[(index + 1) % categories.length], categories[(index + 4) % categories.length]];
  add(category.url, category.name, category.description,
    panel(article('Illustrative project ideas', list(category.examples)) + article('What to consider early', para(escape(category.challenge))) +
    article('Possible development support', para(escape(category.pathway))) +
    article('Category question', faqList([[category.question, category.answer]])) +
    buttons(idea('/submit-your-idea/?category=' + category.id), link('/innovation-categories/', 'See All Categories'))) +
    wrap('Explore Related Categories', categoryGrid(related), '', 'soft'),
    { crumbs: [['/innovation-categories/', 'Innovation Categories'], [null, category.name]] });
});

add('/for-innovators/', 'For Innovators', 'Prepare an early-stage idea, a prototype or a project for future consideration by Makhuzwayo Investors.',
  panel(article('Who this guide is for', para('Individuals and organisations can use the guide to prepare ideas in any of the innovation categories. The submission eligibility rules are awaiting approval.')) +
  article('Prepare your idea summary', list(['Describe the problem and who experiences it.', 'Summarise your proposed solution in plain language.', 'State the category and current development stage.', 'Share what you have learned so far and where you need help.', 'Keep confidential details private and describe only what is necessary for an initial review.'])) +
  article('Prepare for a possible discussion', para('The team may ask about feasibility, practical tests and what support could help. It is useful to document assumptions and separate them from evidence.') + buttons(idea(), ip, journey))));

add('/submit-your-idea/', 'Submit Your Idea', 'Use the four-step preview to see what an initial, non-confidential innovation enquiry will ask for.',
  ideaForm(), { noindex: true });
add('/for-investors/', 'For Investors', 'Explore responsible ways to support South African innovation through expertise, mentoring and potential project-specific investment.',
  panel(article('Ways to participate', list(['Explore innovation areas with practical development needs.', 'Offer mentorship, technical expertise or sector knowledge.', 'Consider strategic collaboration and commercial development.', 'Express interest in suitable opportunities that may later qualify for project-specific investment.'])) +
  '<article class="article" id="opportunities"><h2>How investment opportunities work</h2><p>Unreviewed ideas are at the discovery stage. Any prospective investment opportunity would follow appropriate screening, due diligence, conflict-of-interest checks and a separate written agreement. Long-term impact and responsible participation guide the proposed approach.</p><p>Investor enquiries are intended to capture interest. Funds and investment decisions are outside this website’s current scope.</p></article>' +
  buttons(investor, link('/innovation-categories/', 'Explore Innovation Categories'))));
add('/investor-enquiry/', 'Investor Enquiry', 'Preview how to share the areas, projects and forms of collaboration you may be interested in supporting.',
  investorForm(), { noindex: true });

add('/sign-in/', 'Sign In', 'Choose the innovator or investor sign-in preview for your intended role.', signInForm(), { noindex: true });
add('/register/innovator/', 'Create an Innovator Account', 'Preview registration for future idea submissions and application updates.', registrationForm('innovator'), { noindex: true, crumbs: [['/sign-in/', 'Sign In'], [null, 'Innovator Registration']] });
add('/register/investor/', 'Create an Investor Account', 'Preview registration for future access to approved opportunities and expressions of interest.', registrationForm('investor'), { noindex: true, crumbs: [['/sign-in/', 'Sign In'], [null, 'Investor Registration']] });
add('/forgot-password/', 'Forgot Password', 'Preview the email step for requesting a future account password reset.', resetForm(), { noindex: true, crumbs: [['/sign-in/', 'Sign In'], [null, 'Forgot Password']] });

add('/contact/', 'Contact', 'Find contact information and preview the general enquiry form for Makhuzwayo Investors.',
  panel(article('General enquiries', para(contactLinks()) + para('For an idea or investor enquiry, use the dedicated preparation pages.') + buttons(idea(), link('/investor-enquiry/', 'Investor Enquiry')))) + contactForm(), { schema: 'ContactPage' });
add('/faqs/', 'Frequently Asked Questions', 'Answers about the planned idea review process, access, confidentiality, recognition and investor participation.', wrap('Ideas, review and participation', faqList(faqs)));

for (const { url, title, description, content } of legalPages) {
  add(url, title, description, panel(`<aside class="notice"><strong>Draft for review</strong><p>This page is provisional and awaiting approval.</p></aside>${content}`), { noindex: true });
}

add('/404.html', 'Page Not Found', 'Try the homepage or browse the innovation categories.', panel(buttons(link('/', 'Return Home', 'button primary'), more)), { noindex: true });

export { pages };
