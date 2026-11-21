const env = process.env;
const origin = env.SITE_ORIGIN ? new URL(env.SITE_ORIGIN) : null;
if (origin && (origin.protocol !== 'https:' || origin.href !== origin.origin + '/')) {
  throw new Error('SITE_ORIGIN must be an HTTPS origin without a path, query or fragment.');
}
if (env.ENABLE_INDEXING === 'true' && !origin) {
  throw new Error('An approved SITE_ORIGIN is required to enable indexing.');
}
const apiBase = env.API_BASE_PATH || '/api/';
if (!/^\/(?:[a-zA-Z0-9_-]+\/)+$/.test(apiBase)) {
  throw new Error('API_BASE_PATH must be a same-origin directory path.');
}
const contactEmail = env.PUBLIC_CONTACT_EMAIL || '';
const contactPhone = env.PUBLIC_CONTACT_PHONE || '';
if (contactEmail && !/^[\w.+-]+@[\w.-]+\.[a-z]+$/i.test(contactEmail)) throw new Error('Invalid contact email.');
if (contactPhone && !/^\+\d{7,15}$/.test(contactPhone)) throw new Error('Use an international contact number.');

export const site = {
  name: 'Makhuzwayo Investors',
  origin: origin?.origin || '',
  indexing: env.ENABLE_INDEXING === 'true',
  contactEmail,
  contactPhone,
  contactPhoneLabel: env.PUBLIC_CONTACT_PHONE_LABEL || contactPhone,
  footerCredit: {
    name: 'Inzalo Yamaqhawe Technologies',
    url: 'https://www.iytechnologies.co.za',
  },
};

export const endpoints = Object.fromEntries(Object.entries({
  submitInnovatorEnquiry: 'innovator-enquiries.php',
  submitInvestorEnquiry: 'investor-enquiries.php',
  submitContactEnquiry: 'contact-enquiries.php',
  signIn: 'sign-in.php',
  registerInnovator: 'register-innovator.php',
  registerInvestor: 'register-investor.php',
  requestPasswordReset: 'password-reset.php',
}).map(([service, path]) => [service, apiBase + path]));

export const protectedRoutes = ['/innovator/dashboard', '/investor/dashboard', '/admin/dashboard'];
