# Phase 2 backend handoff

Target PHP, MySQL and PHPMailer on Xneelo. Live feature activation requires separate instructions and the applicable founder, privacy and legal approvals.

## Enquiry processing

1. Parse and validate bounded request bodies, verify anti-spam tokens and apply rate limits.
2. Confirm consent or other applicable processing grounds and record the approved policy version as appropriate.
3. Normalise fields, use parameterised MySQL queries, and insert the record and idempotency information transactionally.
4. Generate a unique enquiry reference. Queue administrator notification and applicant acknowledgement after durable commit.
5. Use PHPMailer with authenticated Xneelo SMTP. Keep credentials in protected configuration outside `public_html`. Escape user-provided values in HTML mail and keep technical details out of notification subjects.
6. Record and retry delivery failures separately, with bounded retry and privacy-safe logging. An email failure must not duplicate or erase the enquiry.

## Accounts and authorisation

Keep innovator, investor and administrator roles enforced on the server with verified identity records. Reserve the intended dashboard paths listed in `src/config.mjs`. Use secure server-side sessions and separate investor enquiries from registrations. Create application status and investor-project interest records only when authorised workflows are agreed.

Use discrete permissions for profiles, submissions, review, status changes, project communications, documents and administration. Define retention, correction, deletion, audit and lawful ownership reporting procedures. Public recognition or showcasing requires appropriate consent and approval.

Before enabling investment features, obtain South African legal and regulatory review of the participation model, any licence or authorisation requirements, due diligence, conflicts, and financial communications. See the [FSCA FAIS resources](https://www.fsca.co.za/LR-FAIS-Fit-and-Proper/).
