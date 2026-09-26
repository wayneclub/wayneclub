# Deployment and security boundary

This is a static portfolio, with no contact-form submission endpoint, mail service, SQL database, or user-authored HTML. Contact links open the visitor's mail application. No Turnstile widget is needed for a nonexistent form.

## Active origin controls

- GET/HEAD only; POST/PUT/PATCH/DELETE return 405.
- Hidden paths and common dynamic/config extension probes return 404; directory listing is off.
- CSP restricts executable scripts to self, Google Tag Manager and Google's legacy compatibility script; no inline script or eval exception. Per-page JSON-LD has generated SHA-256 allowances. Google Fonts and Analytics have explicit source allowances.
- `object-src 'none'`, `base-uri 'self'`, `form-action 'none'`, `frame-ancestors 'none'`; X-Frame-Options, nosniff, referrer and permissions policies.
- 10 requests/sec/IP with a burst of 80 and 30 simultaneous connections; excess returns 429. Validated against isolated staging, not a production load test.
- Real IP trusts only the internal Docker network used by Nginx Proxy Manager, which overwrites X-Real-IP. If the Docker subnet changes, update the trust range. Do not publish the website container's port directly.
- Nginx Proxy Manager already applies its exploit-filter rules and TLS/HSTS to this hostname. These were preserved.

## Analytics

GA4 stream: `G-TV15PT58R3`. No Google script loads before visitor opt-in. Advertising consent remains denied; Google Signals and ad personalization are disabled. First-party language/theme choices are independent of analytics consent. Revocation disables the property and clears its GA cookies.

Custom events: `page_view`, `project_open`, `project_filter`, `resume_download`, `contact_click`, `email_copy`, `language_change`, `appearance_change`. Page locations exclude query strings and fragments; referrers are reduced to origin. Custom event payloads do not include email addresses or form contents. Admin-side enhanced-measurement/key-event settings are not managed by this repository. The production page_view endpoint returned 204 for the supplied measurement ID.

Cloudflare may inject its own analytics beacon; the site's CSP intentionally does not allow that optional script, so it can appear as a blocked console resource. This does not block GA4 or portfolio features.

## Active Cloudflare controls (2026-09-26)

Deployed and read back three zone entrypoint rulesets; `cloudflare-rules.json` records the intended configuration. Every added rule is scoped to the exact `wayneclub.com` hostname and excludes Cloudflare's `/cdn-cgi/` paths. Other subdomains and zone-wide SSL settings were left unchanged. The www hostname now redirects at the origin to the canonical HTTPS apex.

- Custom rules block unsupported methods (anything except GET/HEAD) and common `.env`, `.git`, WordPress and phpMyAdmin probes.
- Cloudflare Managed Free Ruleset is deployed with its default rule actions. This is the Free baseline, not the paid OWASP ruleset or a guarantee against every SQL injection/XSS variant.
- Edge rate limit: 120 requests per 10 seconds per IP and Cloudflare data center, with a 10-second block. This includes page assets; normal browsing passed. The deployed rate configuration was read back; no production burst/load test was performed.
- Rollback: remove only the three newly created entrypoint rulesets recorded in the private snapshot `/home/ubuntu/cloudflare-website-security-20260926-134026`. Each phase was absent before deployment. Re-read current configuration before rollback to avoid removing later changes.

Public homepage, Traditional/Simplified Chinese pages, robots.txt, sitemap and LinkedIn social image returned 200. Unsupported POST, `.env` and `wp-login.php` probes returned 403 at the edge. Googlebot, LinkedInBot and OAI-SearchBot user-agent probes returned 200; ClaudeBot still returned 403. These probes do not use verified crawler IPs and do not establish indexing or the exact cause of ClaudeBot's block.

Bot Management access subsequently succeeded. The previous zone-wide AI crawler block was disabled (`ai_bots_protection: disabled`), and Cloudflare-managed robots.txt was disabled so the site's own robots.txt remains authoritative. Cloudflare also reset synchronized AI preferences to disabled in its response. Bot Fight Mode remained off; no global bot challenge was enabled. Googlebot, LinkedInBot, OAI-SearchBot, ClaudeBot and GPTBot user-agent probes then all returned 200. These are UA probes, not verified crawler visits. WAF and rate limits continue to apply. Original and resulting bot configurations are saved in the private snapshot above.

Cloudflare Free Managed Ruleset is a suitable maintained baseline. Advanced bot scores depend on the account plan. If a real contact form is added later, use Turnstile with mandatory server-side Siteverify, per-IP and per-recipient limits, fixed recipients, strict field lengths/validation, anti-replay checks and server-side secrets. Honeypots alone are not sufficient. Parameterize any future SQL and escape untrusted output.

References:
- https://developers.cloudflare.com/waf/managed-rules/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.google.com/analytics/devguides/collection/ga4/web

## HTTPS and accessibility verification (2026-09-26)

HTTP apex redirects 301 to HTTPS and preserves path/query. HTTPS www redirects 301 to HTTPS apex; HTTP www first upgrades to HTTPS www and then redirects to apex. HTTPS apex returns 200 with HSTS. The origin config handles only www canonicalization; Nginx Proxy Manager already enforces the scheme upgrade.

Fixed low-contrast project-dialog badges in light appearance, made the skip-link main target explicitly focusable, prevented close controls shrinking, and ensured focused reveal content remains visible. Added axe-core WCAG A/AA checks across EN/Hant/Hans, light/dark, and mobile page plus three modal states. All 24 scans passed. Keyboard activation, Escape, focus restoration, skip link and 320px reflow were checked. Automated scans are not WCAG certification or a substitute for manual assistive-technology testing.

Production GA4 was rechecked in a fresh browser: no pre-consent event, then page_view returned HTTP 204 for G-TV15PT58R3 after consent. A successful collection response does not verify account-side filters or processed reports; use Analytics Realtime to verify property ingestion, allowing for processing delay.
