import { categories } from './data.mjs';
import { escape, link } from './ui.mjs';

const field = (name, label, { type = 'text', required = true, autocomplete = '', maxlength = 160, extra = '' } = {}) => {
  const id = 'field-' + name;
  const attrs = `id="${id}" name="${name}" ${required ? 'required' : ''} maxlength="${maxlength}" ${autocomplete ? 'autocomplete="' + autocomplete + '"' : ''} ${extra}`;
  return `<div class="field"><label for="${id}">${label}${required ? '' : ' <span>(optional)</span>'}</label>${type === 'textarea' ? `<textarea ${attrs} rows="4"></textarea>` : `<input type="${type}" ${attrs}>`}</div>`;
};
const select = (name, label, options, { required = true, extra = '' } = {}) => `<div class="field"><label for="field-${name}">${label}</label><select id="field-${name}" name="${name}" ${required ? 'required' : ''} ${extra}><option value="">Select an option</option>${options.map((option) => {
  const [value, text] = Array.isArray(option) ? option : [option, option];
  return `<option value="${escape(value)}">${escape(text)}</option>`;
}).join('')}</select></div>`;
const choices = (name, label, options, type = 'checkbox', required = false) => `<fieldset class="choice-set"><legend>${label}</legend><div class="choice-grid">${options.map((option, index) => {
  const [value, text] = Array.isArray(option) ? option : [option, option];
  return `<label class="choice"><input type="${type}" name="${name}" value="${escape(value)}" ${required && index === 0 ? 'required' : ''}><span>${escape(text)}</span></label>`;
}).join('')}</div></fieldset>`;
const ack = (name, content) => `<label class="choice acknowledgement"><input type="checkbox" name="${name}" value="yes" required><span>${content}</span></label>`;
const cols = (...fields) => `<div class="field-grid">${fields.join('')}</div>`;

const name = () => field('fullName', 'Full name', { autocomplete: 'name' });
const email = () => field('email', 'Email address', { type: 'email', autocomplete: 'email', maxlength: 254 });
const phone = (required = true) => field('phone', 'Phone number', { type: 'tel', autocomplete: 'tel', required, maxlength: 32 });
const org = () => `<div data-organisational>${field('organisation', 'Organisation name', { required: false, autocomplete: 'organization' })}</div>`;
const privacy = () => ack('privacyAcknowledged', 'I have read the draft ' + link('/privacy/', 'Privacy Policy') + '.');
const password = (registration = false) => `<div class="password-wrap">${field('password', 'Password', { type: 'password', autocomplete: registration ? 'new-password' : 'current-password', maxlength: 128, extra: registration ? 'minlength="12"' : '' })}<button type="button" class="button secondary password-toggle" data-password aria-controls="field-password" aria-pressed="false">Show password</button></div>`;
const categoryOptions = categories.map(({ id, name: label }) => [id, label]);
const stages = [
  ['concept', 'Concept only'], ['research', 'Research underway'], ['early-prototype', 'Early prototype'],
  ['working-prototype', 'Working prototype'], ['pilot', 'Testing or pilot stage'], ['existing-business', 'Existing business seeking development'],
];
const assistance = [
  ['technical-guidance', 'Technical guidance'], ['prototype', 'Prototype development'],
  ['software', 'Software development'], ['engineering', 'Engineering support'],
  ['planning', 'Business planning'], ['mentorship', 'Mentorship'], ['investment', 'Investment consideration'],
  ['commercialisation', 'Commercialisation support'], ['other', 'Other'],
];
const investorTypes = [
  ['individual', 'Individual'], ['corporate', 'Business or corporate investor'],
  ['investment-organisation', 'Investment organisation'], ['development-partner', 'Development partner'],
  ['technical-partner', 'Technical or strategic partner'], ['other', 'Other'],
];
const involvement = [
  ['project-investment', 'Project-specific investment'], ['mentorship', 'Mentorship'], ['technical', 'Technical collaboration'],
  ['strategic', 'Strategic partnership'], ['general', 'General enquiry'],
];

const disabledText = {
  submitInnovatorEnquiry: 'Idea submissions are closed.',
  submitInvestorEnquiry: 'Investor enquiries are closed.',
  submitContactEnquiry: 'Online contact enquiries are closed.',
  signIn: 'Sign-in is unavailable.',
  registerInnovator: 'Innovator registration is closed.',
  registerInvestor: 'Investor registration is closed.',
  requestPasswordReset: 'Password reset is unavailable.',
};
function frame(service, fields, actions = '', notice = 'This preview accepts sample details for validation. Details stay on this page and are not sent.') {
  return `<section class="section form-section"><div class="wrap"><div class="form-shell">
  <aside class="notice" aria-label="Service availability"><strong>${disabledText[service]}</strong><p>${notice}</p></aside>
  <noscript><p>Enable JavaScript to use the form preview. All public information pages remain available.</p></noscript>
  <form data-preview-form data-service="${service}" autocomplete="off" hidden>
    <p class="form-helper">Fields are required unless marked optional.</p>
    <p class="form-error" data-form-error tabindex="-1" role="alert" hidden></p>
    ${fields}${actions || '<div class="form-actions"><button type="button" class="button primary" data-validate>Check sample details</button><button type="submit" class="button secondary" disabled>Sending unavailable</button></div>'}
    <p class="form-status" data-form-status role="status"></p>
  </form></div></div></section>`;
}

export function ideaForm() {
  const sections = [
    ['Innovator details', cols(name(), email(), phone(), field('location', 'Province or location')) + select('applicantType', 'Applying as', [['individual', 'Individual'], ['organisation', 'Organisation']], { extra: 'data-org-select data-org-required' }) + org()],
    ['Idea details', `<p>Use a non-confidential summary. Keep trade secrets, source code and patentable mechanisms private.</p>` + cols(field('projectTitle', 'Project title'), select('categoryId', 'Innovation category', categoryOptions, { extra: 'data-category-select' })) +
      field('summary', 'Short project summary', { type: 'textarea', maxlength: 800 }) +
      field('problem', 'Problem the idea aims to solve', { type: 'textarea', maxlength: 1500 }) +
      field('solution', 'Proposed solution', { type: 'textarea', maxlength: 1500 }) +
      cols(field('beneficiaries', 'Intended beneficiaries or customers', { maxlength: 500 }), select('stage', 'Current development stage', stages))],
    ['Assistance required', choices('assistance', 'Support you would like (optional)', assistance) + field('fundingZar', 'Indicative funding requirement in rand', { type: 'number', required: false, extra: 'min="0" max="1000000000000" step="0.01"' })],
    ['Review and submit', '<p>A live enquiry would support initial screening for relevance, feasibility and next steps.</p><dl class="review-list" data-review></dl>' + privacy() +
      ack('termsAcknowledged', 'I have read the draft ' + link('/idea-submission-terms/', 'Idea Submission Terms') + '.') +
      ack('noFundingGuarantee', 'I understand that submitting an idea does not guarantee funding.')],
  ];
  const progress = `<ol class="form-progress">${sections.map(([label], index) => `<li data-progress ${index === 0 ? 'aria-current="step"' : ''}><span>${index + 1}</span>${label}</li>`).join('')}</ol>`;
  const panels = sections.map(([title, content], index) => `<section data-step ${index ? 'hidden' : ''} aria-labelledby="step-${index}"><h2 id="step-${index}" tabindex="-1">${title}</h2>${content}</section>`).join('');
  const controls = `<div class="form-actions"><button class="button secondary" type="button" data-back hidden>Back</button><button class="button primary" type="button" data-next>Continue</button><button class="button primary" type="button" data-validate hidden>Check sample details</button><button class="button secondary" type="submit" data-submit-preview disabled hidden>Submission unavailable</button></div>`;
  return frame('submitInnovatorEnquiry', progress + panels, controls);
}

export function investorForm() {
  return frame('submitInvestorEnquiry', cols(name(), email(), phone(), field('location', 'Country or province')) +
    select('investorType', 'Investor type', investorTypes, { extra: 'data-org-select' }) + org() +
    choices('industryIds', 'Industries of interest (optional)', categoryOptions) +
    select('involvement', 'Preferred involvement', involvement) +
    field('investmentRange', 'Indicative investment range', { required: false }) +
    field('experience', 'Relevant experience', { type: 'textarea', required: false, maxlength: 1200 }) +
    field('message', 'Additional message', { type: 'textarea', required: false, maxlength: 1500 }) + privacy());
}

export function contactForm() {
  return frame('submitContactEnquiry', cols(name(), email(), phone(false), field('subject', 'Subject')) +
    field('message', 'Message', { type: 'textarea', maxlength: 2000 }) + privacy());
}

export function signInForm() {
  return frame('signIn', choices('intendedRole', 'Choose a sign-in role', [
    ['innovator', 'Innovator Sign In'], ['investor', 'Investor Sign In'],
  ], 'radio', true) + email() + password() +
    '<label class="choice"><input type="checkbox" name="remember" value="yes" disabled><span>Remember me (unavailable)</span></label>' +
    `<p class="form-context" data-role-info></p><div class="auth-links">${link('/forgot-password/', 'Forgot password?')}${link('/register/innovator/', 'Create innovator account')}${link('/register/investor/', 'Create investor account')}</div>`,
    undefined, 'This form is for preview only. Use sample details and keep real account credentials private.');
}

export function registrationForm(role) {
  const service = role === 'innovator' ? 'registerInnovator' : 'registerInvestor';
  return frame(service, cols(name(), email()) + password(true) +
    field('confirmPassword', 'Confirm password', { type: 'password', autocomplete: 'new-password', maxlength: 128 }) +
    '<p class="muted">Use at least 12 characters for a sample password.</p>' + privacy(),
    undefined, 'Use sample details only. This preview cannot create accounts.');
}

export const resetForm = () => frame('requestPasswordReset', email(), undefined, 'Use a sample email address. Reset emails are currently unavailable.');
