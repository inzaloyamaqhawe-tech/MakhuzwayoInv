# Xneelo deployment

The generated pages are designed for the root of the approved domain or a dedicated preview subdomain. Their paths are root-relative. Use a dedicated preview origin if staging alongside another website. Production publishing requires explicit approval.

## Upload map

Upload the following from the **contents** of local `dist/` into the domain’s `public_html/` folder. Preserve directory names and enable visibility of dotfiles when using File Manager or FTP.

| Local path | Xneelo destination |
| --- | --- |
| `dist/index.html` | `public_html/index.html` |
| `dist/404.html` | `public_html/404.html` |
| `dist/.htaccess` | `public_html/.htaccess` |
| `dist/robots.txt` | `public_html/robots.txt` |
| `dist/sitemap.xml`, when generated | `public_html/sitemap.xml` |
| `dist/assets/` | `public_html/assets/` |
| Every other generated route directory | The same directory under `public_html/` |

Only upload generated web files. Keep source, docs, configuration, environment files and local preview tooling private. Inspect and back up any existing `.htaccess` before merging site rules into an occupied host. The supplied rules assume this is the domain root. HTTPS and any canonical-host redirect should be configured on the approved account after the certificate is valid.

## Verify on the hosting account

1. Request the homepage and a category URL directly. Both should return HTTP 200 over HTTPS.
2. Check a URL without its ending slash and an explicit `index.html` URL. They should redirect to the preferred version.
3. Request an unknown URL. Confirm HTTP 404 and the custom error page.
4. Confirm the two WebP files, CSS and JavaScript load with the correct MIME types.
5. Open the browser console for CSP or asset errors. Check the mobile menu and sample forms.
6. Confirm the enabled metadata matches the approved origin and that the muted developer link appears only in the footer. If indexing is approved, check the sitemap and robots directives.
7. Keep `/api/` reserved for Phase 2. It should have no live handlers in Phase 1. The route rules leave PHP and other paths available for future integration.

HTML is revalidated, static assets are cached for one hour, and no source maps are generated. Review Xneelo’s [File Manager guidance](https://xneelo.co.za/help-centre/website/file-manager/) and [custom error pages](https://xneelo.co.za/help-centre/website/custom-error-pages/) when applying hosting changes.
