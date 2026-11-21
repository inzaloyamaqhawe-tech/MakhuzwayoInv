# Makhuzwayo Investors

Phase 1 public website and local form previews. The source uses native HTML, CSS and JavaScript, with Node.js used only during the build and local preview.

## Build and preview

From this project folder on Windows, with Node.js 22.9 or newer:

```powershell
npm.cmd run build
npm.cmd run check
npm.cmd run preview
```

Open the printed local URL. Stop the server with Ctrl+C. The check script audits the default build, including the linked footer credit and brand assets. There are no npm dependencies.

Copy `.env.example` to `.env` for approved public deployment settings. The normal build deliberately has indexing disabled and omits public contact details, canonical URLs and sitemap entries when there is no approved origin. The hero is a provisional, AI-generated illustration of a cultural gathering in KwaZulu-Natal. The header uses the supplied logo. The footer and favicon use crops derived from its emblem.

## Files

- `src/` contains the generator, page and form templates, data, and the central configuration.
- `public/assets/` contains the published CSS, small browser module and optimised hero images.
- `dist/` is the generated Xneelo web root.
- `docs/` is the private handoff. Keep it outside the hosting web root.

Forms are local previews, including registration, sign-in and password reset. They validate sample inputs without posting anything. Live processing, accounts, email delivery and dashboards are Phase 2.

## Handoff

- [Xneelo deployment](docs/DEPLOYMENT_XNEELO.md)
- [API contracts](docs/API_CONTRACTS.md)
- [Backend handoff](docs/BACKEND_HANDOFF.md)
- [SEO checklist](docs/SEO_CHECKLIST.md)
- [Security checklist](docs/SECURITY_CHECKLIST.md)
- [Founder approvals](docs/FOUNDER_APPROVALS.md)
