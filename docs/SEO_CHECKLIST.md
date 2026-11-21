# SEO and discoverability

- Provide the approved HTTPS origin through `SITE_ORIGIN`. The build generates canonical URLs, absolute social preview metadata, a sitemap and breadcrumb structured data.
- Set `ENABLE_INDEXING=true` only for the approved public launch. A build without an origin contains no guessed domain, canonical or sitemap. Preview forms, draft legal pages and the error document retain their noindex metadata when generic indexing is enabled.
- Confirm visible titles, descriptions and internal links match the published copy. Review indexing, domain redirects, live HTTP errors and sitemap retrieval after deployment.
- HTML is generated at build time for every public page. Structured data uses Organisation and WebSite entities, relevant page types, and breadcrumb markup where an approved URL exists. FAQ content is rendered as readable questions and answers.
- Retest social image previews and Core Web Vitals on the actual host. Review search performance after indexing.

## Future analytics events

Definitions only. Keep analytics off until approved and applicable consent controls exist.

| Event | Trigger |
| --- | --- |
| hero_cta_click | Primary hero action |
| innovator_page_visit | Innovator guide view |
| idea_form_start | First visible idea-form interaction |
| idea_form_complete | Live success confirmed by the server |
| investor_page_visit | Investor information view |
| investor_enquiry_start | First visible investor enquiry interaction |
| investor_enquiry_complete | Live success confirmed by the server |
| sign_in_selection | Innovator or investor role selection |
| contact_form_complete | Live success confirmed by the server |

Use coarse event names and public route or role context only. Exclude names, contact details, message text, project details, credentials, references and URL query values.
