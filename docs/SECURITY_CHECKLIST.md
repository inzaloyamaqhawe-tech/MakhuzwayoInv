# Security handoff

## Phase 1

- Ship only static files from `dist/`. Use HTTPS on the approved host. Review Apache rules and existing host headers before enabling production traffic.
- The document CSP allows local assets, blocks form posts and programmatic network connections, and prohibits embedded objects. Apache adds frame denial, MIME sniffing protection, and a permissions policy.
- Keep disabled services offline. Form review entries are rendered using text nodes, never HTML. No trackers or persistent form storage are implemented.
- Do not publish private shareholder, investor, partner, supplier or ownership information. Keep legal reporting and required regulatory transparency available through appropriate channels.

## Before a Phase 2 release

- Enforce RBAC and object-level access server-side. Use Argon2id or appropriately configured bcrypt, expiring single-use reset tokens, safe recovery responses and strong administrative controls.
- Use secure server-side sessions with HttpOnly, Secure and SameSite cookies. Rotate session identifiers at sign-in and privilege transitions. Implement CSRF protection.
- Validate and bound all requests, use rate limits and appropriate anti-spam controls, and parameterise all SQL. Maintain least-privilege database and service accounts.
- Define retention and deletion controls, backup recovery, incident handling, and privacy-safe audit trails for sensitive administrative actions.
- Implement private file storage, access controls, allowed types and malware scanning before enabling uploads.
- Review CSP connect-src and form-action directives specifically when connecting approved backend services. Verify behaviour against the live hosting configuration.
