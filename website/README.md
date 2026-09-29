# Wayne Club — personal website

Live: https://wayneclub.com

A static portfolio inspired by Apple's native app materials and controls. No application framework or backend dependency; optional Google Analytics loads only after consent. Static locale pages are generated with Python and Node.

## Features

- "Now Playing" liquid-glass theme (see `deploy/DESIGN.md`): refractive glass lens, navigation and chapter dock; eight interactive project miniatures; career episodes; dictionary-style about; rolling credits.
- English, Traditional Chinese, Simplified Chinese. Device preference uses `navigator.languages` in order; explicit script subtags take precedence, TW/HK/MO map to Traditional Chinese, other Chinese locales to Simplified Chinese, unsupported languages fall back to English. The CC button offers each language or Automatic.
- Appearance button cycles Automatic / Light / Dark; choices are saved locally. Storage-disabled browsing remains functional.
- Play/pause for all motion; reduced motion starts paused. Reduced transparency and forced colors are supported. Keyboard: sheets, filters, disclosures, demos and the lens (arrow keys).

## Content

Career information follows the user-provided `Ting-Long Wei_Resume.pdf`. Project descriptions are based on public GitHub repositories. The older GitHub resume differs from this PDF and is not used for career claims. LinkedIn is linked, not scraped. The English PDF is provided as-is; page content supports all three languages. The logo and wordmark are exported directly from the owner's Wayne Club.sketch vector paths, preserving Bézier curves and source transformations. Browser SVG/PNG/ICO favicons and the 180px iOS touch icon use that original mark. 

Edit `src/index.html` for structure/English content, `assets/i18n.js` for translations, `assets/theme.css` for styles and `assets/app.js` for interactions, then run `npm run build`. `assets/preferences.js` resolves preferences before first paint.

## Local preview and verification

```sh
python3 -m http.server 18940 --bind 127.0.0.1
npm ci
npx playwright install --with-deps chromium
npm run check
npm test
```

Tests run against `http://127.0.0.1:18940` by default. Override `BASE_URL` to verify another deployment. The test suite covers regional and script-based locales, fallback and preference order, locale changes, persistence, disabled storage, small screens, reduced motion, themes, filters, dialogs and disclosures. Browser locale emulation is not a physical iOS device test.

## Deployment

The production host serves `/home/ubuntu/website` through the existing Nginx container. Copy only `index.html`, `favicon.ico` and `assets/` into the web root (assets first, HTML last). Do not copy repository files, tests or configuration, and do not delete unrelated pre-existing files. Existing VPN/subscription resources must be preserved. Back up current HTML and assets before deploying.

The root README in the parent repository is the GitHub profile and should not be overwritten.

## References

- https://developer.apple.com/design/human-interface-guidelines/materials
- https://developer.apple.com/design/human-interface-guidelines/motion
- https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages

This is a web interpretation, not a native SwiftUI application or a claim of pixel-identical Apple UI.

## Warm theme, static languages and discovery

The current design uses cream white, warm gray and restrained wood tones; floating navigation and dialogs retain the glass material. The original Sketch logo remains unchanged. Contact email, including the PDF, is `me@wayneclub.com`.

`src/index.html` is the English template. Run `npm run build` after editing it or translations. The build emits `/`, `/en/`, `/zh-hant/`, `/zh-hans/`, reciprocal hreflang links, canonical/OG/Twitter metadata, JSON-LD ProfilePage/Person/WebSite data, robots.txt, sitemap.xml and llms.txt. The locale pages contain translated HTML without JavaScript; the root can adapt to device preferences. `llms.txt` is an optional summary, not an indexing or ranking guarantee.

`assets/wayne-club-social.png` is a 1200×630 PNG for LinkedIn/Open Graph. Regenerate with `node scripts/social-card.cjs` (Playwright installed). Inspect with LinkedIn Post Inspector if an old share remains cached. Google Search Console property verification/submission requires account access and is not claimed by this deployment.

Deploy `index.html`, `favicon.ico`, `robots.txt`, `sitemap.xml`, `llms.txt`, `assets/` and the three locale folders. Also copy `deploy/nginx.conf` to the host's persistent Nginx config mount, test with `nginx -t`, then reload. Keep source, tests and deployment configuration outside the public root. The generated CSP hashes must be rebuilt and deployed whenever JSON-LD changes. See `deploy/SECURITY.md` for the security boundary and pending Cloudflare settings.
