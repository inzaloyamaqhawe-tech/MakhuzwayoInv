# Draft PHP API contracts

The service and endpoint registry lives in `src/config.mjs`. The adapter in src/services.mjs requires an explicit transport and stays outside the public output. The browser previews make no requests. This contract is the proposed Phase 2 integration boundary.

All listed endpoints are same-origin JSON POST requests under `/api/` by default. Use server validation for length, format, required fields, limits, allowed enum values and conditional fields. Category IDs come from `src/data.mjs`. Omit absent optional values. POST preparation and transport remain separate from form rendering.

| Service | PHP path | Proposed JSON body |
| --- | --- | --- |
| submitInnovatorEnquiry | innovator-enquiries.php | fullName, email, phone, location, applicantType, organisation (required for organisation), projectTitle, categoryId, summary, problem, solution, beneficiaries, stage, assistance[], fundingZar, privacyAcknowledged, termsAcknowledged, noFundingGuarantee |
| submitInvestorEnquiry | investor-enquiries.php | fullName, email, phone, investorType, organisation, location, industryIds[], involvement, investmentRange, experience, message, privacyAcknowledged |
| submitContactEnquiry | contact-enquiries.php | fullName, email, phone, subject, message, privacyAcknowledged |
| signIn | sign-in.php | email, password, intendedRole (routing hint only), remember |
| registerInnovator | register-innovator.php | fullName, email, password, privacyAcknowledged |
| registerInvestor | register-investor.php | fullName, email, password, privacyAcknowledged |
| requestPasswordReset | password-reset.php | email |

Normalise acknowledgement values to booleans, multi-select fields to arrays, whitespace in text fields as appropriate, and currency to validated decimal strings. Do not send confirmation passwords or raw request bodies to logs. Investor enquiries and account registration are independent.

## Proposed responses

- Enquiries: HTTP 201 with an opaque reference after durable storage. Use an Idempotency-Key header and an appropriate server-side request fingerprint. Repeated valid requests with the same key return the original reference.
- Authentication: HTTP 200 on success with a server-set session cookie. Use a generic HTTP 401 message for invalid credentials. Determine all roles from trusted records.
- Registration and password reset: use a generic HTTP 202 response where appropriate to avoid account enumeration. Confirm the eventual signup and verification policy before implementation.
- Validation: HTTP 422 with `{code, message, fields}`, where field keys match the contract. Use generic messages and never echo sensitive values.
- HTTP 429 with Retry-After for throttling. Unavailable services should return HTTP 503. Use an opaque request identifier for unexpected errors.

Implement CSRF and anti-spam requirements before connecting a live transport. Never substitute a preview success state for a server acknowledgement.
