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

## Cloudflare boundary / pending account access

The existing DNS token returned HTTP 403 for zone rulesets and security settings. No Cloudflare WAF or bot settings were changed. Googlebot, LinkedInBot and OAI-SearchBot user-agent probes returned 200; a ClaudeBot probe received 403 from Cloudflare. These tests use identifying strings, not the crawlers' verified source IPs, and do not prove future indexing.

With authorized zone access, inspect the matching Security Events and AI crawler controls, preserve managed exploit protections, scope any changes to `wayneclub.com` and `www.wayneclub.com`, and remove only rules that unintentionally block permitted search crawlers. Do not turn off global WAF, blanket-block Selenium/headless clients, or bypass all security for a claimed User-Agent.

Cloudflare Free Managed Ruleset is a suitable maintained baseline. Advanced bot scores depend on the account plan. If a real contact form is added later, use Turnstile with mandatory server-side Siteverify, per-IP and per-recipient limits, fixed recipients, strict field lengths/validation, anti-replay checks and server-side secrets. Honeypots alone are not sufficient. Parameterize any future SQL and escape untrusted output.

References:
- https://developers.cloudflare.com/waf/managed-rules/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.google.com/analytics/devguides/collection/ga4/web
