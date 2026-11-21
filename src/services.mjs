import { endpoints } from './config.mjs';

export function createApiServices(post) {
  if (typeof post !== 'function') throw new TypeError('An approved API transport is required.');
  const send = (service, payload) => post(endpoints[service], payload);
  return {
    submitInnovatorEnquiry: (payload) => send('submitInnovatorEnquiry', payload),
    submitInvestorEnquiry: (payload) => send('submitInvestorEnquiry', payload),
    submitContactEnquiry: (payload) => send('submitContactEnquiry', payload),
    signIn: (payload) => send('signIn', payload),
    registerInnovator: (payload) => send('registerInnovator', payload),
    registerInvestor: (payload) => send('registerInvestor', payload),
    requestPasswordReset: (payload) => send('requestPasswordReset', payload),
  };
}
