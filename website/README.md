# Wayne Wei — personal website

Live: https://wayneclub.com

A static portfolio inspired by Apple's native app materials and controls. No production JavaScript dependencies or build step.

## Features

- English, Traditional Chinese, Simplified Chinese. Device preference uses `navigator.languages` in order; explicit script subtags take precedence, TW/HK/MO map to Traditional Chinese, other Chinese locales to Simplified Chinese, unsupported languages fall back to English.
- Language and light/dark appearance settings, saved locally; Automatic returns to browser/system preferences. Storage-disabled browsing remains functional.
- Project filters and native dialog detail sheets, expandable achievements, email clipboard action, pointer lighting, restrained card tilt, section highlighting and reading progress.
- Keyboard navigation, Escape dismissal, native dialog focus management, reduced-motion/reduced-transparency/high-contrast media queries, and responsive safe-area-aware sheets.

## Content

Career information follows the user-provided `Ting-Long Wei_Resume.pdf`. Project descriptions are based on public GitHub repositories. The older GitHub resume differs from this PDF and is not used for career claims. LinkedIn is linked, not scraped. The English PDF is provided as-is; page content supports all three languages. The GitHub avatar is supplied by the owner's public profile.

Edit `index.html` for structure/English content, `assets/i18n.js` for translations, `assets/portfolio.css` and `assets/native.css` for styles. `assets/preferences.js` resolves preferences before first paint.

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

The production host serves `/home/ubuntu/website` through the existing Nginx container. Copy only `index.html` and `assets/` into the web root (assets first, HTML last). Do not copy repository files, tests or configuration, and do not delete unrelated pre-existing files. Existing VPN/subscription resources must be preserved. Back up current HTML and assets before deploying.

The root README in the parent repository is the GitHub profile and should not be overwritten.

## References

- https://developer.apple.com/design/human-interface-guidelines/materials
- https://developer.apple.com/design/human-interface-guidelines/motion
- https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages

This is a web interpretation, not a native SwiftUI application or a claim of pixel-identical Apple UI.
