# Migration verification

## Identity and sources

Observed live on 2 November 2026: The Park Medical Centre, ODS **P84045**, 434 Altrincham Road, Baguley, Wythenshawe, Manchester, **M23 9AB**, reception **0161 998 5538**. This is not the Timperley, Chester, Leek or another Park practice.

The supplied live website is available. No Internet Archive content or capture dates were used. All 57 discovered source content pages were fetched and inspected as text/links; candidate-level inventory records exact URLs, HTTP status, title and dispositions. Evidence at `/tmp/opencode/park-source` includes raw HTML, text, JSON, rendered provider text and the registration PDF text. Latest live observation is used rather than archive selection.

The NHS profile `/services/gp-surgery/the-park-medical-centre/P84045` matches the address. Its linked `/contact-details-and-opening-times` confirms reception number and core Monday-Friday 8am-6:30pm, weekends closed (NHS profile confirmation date: 17 March 2025). The practice's own current weekly table agrees. A guessed NHS `/opening-times` URL returned 404 during research and is not published.

CQC location **1-571476646** was inspected in a real browser: The Park Medical Centre, same full address and telephone, overall **Good**, report published 8 April 2022. An automated request later got 403; browser verification succeeded. No invented inspection date or star rating is used.

## Core journeys

Accurx URLs were copied from actual source anchors, not constructed from ODS. `https://florey.accurx.com/p/P84045` redirects to `https://accurx.nhs.uk/patient-initiated/p84045`. HTTP body and rendered browser both show The Park Medical Centre, **434 Altrincham Road, Manchester, M23 9AB**, medical and admin/routine-care categories. They were temporarily closed at observation, explicitly reopening 7:30am the next working day, not a generic disabled-ODS landing. No service selection or patient submission was made.

Registration source `https://gp-registration.nhs.uk/P84045` redirects in the browser to `/P84045/gpregistration/landing`, explicitly titled **Register with a GP surgery: The Park Medical Centre, Manchester**. Only the landing page was inspected, not Start now. Plain HTTP HTML is a JavaScript fallback and was not treated as identity proof.

Prescriptions use NHS App and written/in-person/post routes from the source; phone ordering is not accepted. Accurx is labelled for medication queries only. Results use NHS App or the admin route and reception; fit notes use the exact source Florey URL; cancellations retain source reminder-link/Check and Cancel/Admin Request distinctions, not an invented NHS App cancellation route. Referrals use the source Care Gateway URL, independently showing Manchester GP referrals and **0161 947 0770**. Directions retain the source's encoded 434 Altrincham Road/M23 9AB query; Google consent prevents final map identity verification and this is explicitly recorded in the link audit.

## Scope and safeguards

Source-based practice details, full team, services and patient journeys replace the fictional sample. No clinical advice was authored. The existing urgent partial is unchanged. Unknown optional material and stale news are omitted. Privacy links point to the actual supplied practice notice and downloaded source PDF; no legal policy was invented. Complaints uses a phone/postal enquiry route pending the practice procedure. There is one compact unapproved demo banner and no indexing, forms, cookies, tracking or external embeds.

Only the new Park repository/project and authorised `park.oddtv.uk` host are in scope. Upstream origin and other practice repositories, deployments and DNS must remain untouched. Account-owner permission is not recorded as practice sign-off.

## Verification log

Baseline fresh upstream: npm install and 40 tests passed. npm reported seven moderate development dependency advisories; no forced/breaking dependency update was attempted. `npm audit` details are retained in local evidence.

After changes: lint, **42 tests**, valid fictional fixture check/build/HTML validation, fresh actual demo build and all demo HTML validation passed. REUSE 3.3 lint passed using `uv tool run reuse lint`. Actual production check and production build correctly fail for missing required earnings and review date. `lib/practice.js` has no changes. First demo HTML validation found ordinary spaces in phone links; these were replaced by non-breaking spaces without changing dial targets. A subsequent lint discovered generated `_preview` assets were not ignored; ESLint and Prettier now exclude that generated output and lint was rerun successfully.

All **23 HTML pages** passed an independent internal-link, fragment, local-asset, urgent 999/111, single-banner and no-forms/embeds audit. All **27 external HTTP(S) destinations** were GET-checked with redirects and reviewed by title/body or browser identity: 26 intended destinations verified, Google Maps final pin remains consent-blocked. CQC was browser-verified despite automated 403. No final published link is known dead or misrouted. Source-only broken, blocked and omitted candidates remain documented honestly. See EXTERNAL-LINK-AUDIT.md.

Headless Chromium responsive checks covered all 23 pages at **390×844, 768×1024 and 1440×900**: 69 page/width checks, zero horizontal overflow and zero forms/iframes. Full-page screenshots of home, contact and appointments were inspected at all three sizes. Local evidence includes nine screenshots and `visual-results.json`. The desktop browser tool was disconnected and the Playwright MCP Chrome version was missing; an already installed Chromium was used through a local Playwright runtime instead, without changing other repositories.

## Personal hosting

Cloudflare project `park-site` was created separately and allocated **park-site-1u2.pages.dev**. Initial Wrangler creation attempted unwanted Workers delegation and failed without deployment; the documented `--force` Pages creation option succeeded. Subsequent uploads use normal `wrangler pages deploy`, not Workers.

`park.oddtv.uk` was attached through the supported Pages project-domain API and initially reported `initializing`. The account can read the oddtv.uk zone but listing records for the exact authorised hostname returned **403 Authentication error**. Therefore no DNS records were read/changed and no unrelated hostname, apex, wildcard, mail or other practice deployment was touched. The custom host must not be described as live until its HTTPS body is verified.

Required manual DNS step if the binding remains pending: inspect and privately back up any existing exact-host record, then add/update only **CNAME `park` → `park-site-1u2.pages.dev`** in oddtv.uk. Do not overwrite an unrelated existing record. No automatic Git deployment is configured; publishing is manual direct upload of the validated `_preview` directory.
