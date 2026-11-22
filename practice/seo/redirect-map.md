# Legacy URL redirect map and handoff notes

Draft for review, prepared 21 November 2026 from the 16 November source crawl and approved route plan. This map records proposed destinations for a later hosting configuration.

## Scope and rules

- Preserve every currently rendered local URL. This map considers only the legacy source paths in [the source-to-local coverage matrix](../SOURCE-TO-LOCAL-MATRIX.md); it does not propose changing local canonical paths.
- The source matrix records 58 HTML responses: 57 content pages, including Home, and one structural sitemap. The 25 document rows remain governed by that matrix; do not discard or redirect them as HTML pages. Their current dispositions include local policy/support copies, six clearly dated historical items and twelve clinical leaflets retained in the private archive while current NHS guidance is linked. Do not infer document redirects from this page map.
- A path match ignores a trailing slash only. Preserve the exact existing local route when the source path is already the same under that rule. A `301 candidate` means one old path has one plausible local destination in the matrix; it is not approval to publish. Several different legacy pages can share a destination.
- No blanket catch-all, guessed destination, or redirect based solely on a similar title. Clinical, legal, service-status, content-parity and practice sign-off checks still apply. Keep unresolved cases explicit below.
- Cloudflare Pages `_redirects` rules are path based and cannot select a destination based on the legacy query value for `/_common/getdocument?id=...`. Do not make a blanket rule for that endpoint or pretend one destination preserves its 25 different documents. Keep the archived document disposition and any separately approved local document link as recorded in the matrix. See [Cloudflare Pages redirects](https://developers.cloudflare.com/pages/configuration/redirects/).

## Complete legacy HTML path inventory

“Local route or disposition” repeats the source matrix so every HTML row can be audited here. `301 candidate` entries are only proposed one-to-one path mappings. Review entries are deliberately not executable.

| Legacy source path | Mapped local route or disposition | Decision |
| --- | --- | --- |
| `/` | / (homepage) | No redirect: source and local paths match after trailing-slash normalisation. |
| `/Sitemap` | / (homepage links; structural sitemap) | Practice decision: structural sitemap has no equivalent local route. Decide whether losing the directory is acceptable before any redirect; no new route is authorised by the approved plan. |
| `/FooterLinks/CookiePolicy` | /cookies/ | 301 candidate after practice approval and target checks. |
| `/appointments--admin-requests` | /appointments/ | 301 candidate after practice approval and target checks. |
| `/patient-registration` | /register/ | 301 candidate after practice approval and target checks. |
| `/patient-feedback` | /feedback/ | 301 candidate after practice approval and target checks. |
| `/test-results` | /test-results/ | No redirect: source and local paths match after trailing-slash normalisation. |
| `/prescriptions` | /prescriptions/ | No redirect: source and local paths match after trailing-slash normalisation. |
| `/sick--fit-notes` | /fit-notes/ | 301 candidate after practice approval and target checks. |
| `/opening-hourscontact-us` | /contact/ and /opening-times/ | Practice review: one old page covers both contact and opening times. A redirect to either page would hide half its purpose; retain pending an agreed route decision. |
| `/research-at-the-park` | /research/ | 301 candidate after practice approval and target checks. |
| `/meet-the-team` | /our-team/ | 301 candidate after practice approval and target checks. |
| `/services-availablenhs-health-advice` | /services/ and /health-information/ | Practice review: source combines practice services and health advice. Two local indexes are plausible; choose only after confirming the source content split. |
| `/in-times-of-bereavement` | /bereavement/ | 301 candidate after practice approval and target checks. |
| `/carers-support` | /carers/ | 301 candidate after practice approval and target checks. |
| `/artificial-intelligence-at-the-park-medical-centre` | /artificial-intelligence/ | 301 candidate after practice approval and target checks. |
| `/health-information` | /health-information/ | No redirect: source and local paths match after trailing-slash normalisation. |
| `/cervical-screening-smear-test` | /cervical-screening/ | 301 candidate after practice approval and target checks. |
| `/nhs-bowel-cancer-screening` | /bowel-cancer-screening/ | 301 candidate after practice approval and target checks. |
| `/practice-updates` | /news/ (general information plus historical 2024 material) | 301 candidate after practice approval and target checks. |
| `/self-referrals` | /self-referrals/ | No redirect: source and local paths match after trailing-slash normalisation. |
| `/patient-participation-group` | /patient-participation-group/ | No redirect: source and local paths match after trailing-slash normalisation. |
| `/the-nhs-app` | /nhs-app/ | 301 candidate after practice approval and target checks. |
| `/clinics-we-offer` | /services/ | 301 candidate after practice approval and target checks. |
| `/homeless-friendly-practice` | /homeless-friendly-practice/ | No redirect: source and local paths match after trailing-slash normalisation. |
| `/find-your-nhs-number` | /find-your-nhs-number/ | No redirect: source and local paths match after trailing-slash normalisation. |
| `/update-my-details` | /update-your-details/ | 301 candidate after practice approval and target checks. |
| `/friends-and-family-test-results` | /news/ (historical 2024 Friends and Family Test reports) | 301 candidate after practice approval and target checks. |
| `/you-and-your-general-practice` | /practice-policies/#your-and-your-general-practice (NHS England source link) | 301 candidate after practice approval and target checks. |
| `/advanced-care-planning` | /advanced-care-planning/ | No redirect: source and local paths match after trailing-slash normalisation. |
| `/gp-earnings` | /gp-earnings/ | No redirect: source and local paths match after trailing-slash normalisation. |
| `/pregnancy-care-planner` | /pregnancy/ (current NHS pregnancy guide; legacy planner links retired) | Practice review: legacy planner links are retired and the destination is current NHS pregnancy information. Confirm the intended patient journey before redirecting this old clinical path. |
| `/practice-policies` | /practice-policies/ | No redirect: source and local paths match after trailing-slash normalisation. |
| `/FooterLinks/Accessibility` | /accessibility-statement/ | 301 candidate after practice approval and target checks. |
| `/FooterLinks/YourData` | /privacy-notice/ | 301 candidate after practice approval and target checks. |
| `/gp-extended-hours` | /opening-times/ (extended hours section) | 301 candidate after practice approval and target checks. |
| `/opening-hours-1` | /opening-times/ | 301 candidate after practice approval and target checks. |
| `/electronic-prescribing-service` | /prescriptions/ (electronic prescriptions section) | 301 candidate after practice approval and target checks. |
| `/prescription-fees` | /prescription-fees/ (current NHSBSA source linked) | No redirect: source and local paths match after trailing-slash normalisation. |
| `/minor-ailments-scheme` | /minor-ailments-scheme/ (NHS pharmacy finder; scheme status remains an internal question) | Practice review: the source-to-local matrix says scheme status remains an internal question. Do not route the legacy path until the service status and destination are confirmed. |
| `/non-nhs-services` | /private-services/ | 301 candidate after practice approval and target checks. |
| `/practice-news` | /news/ (historical 2024 Friends and Family reports and event documents) | 301 candidate after practice approval and target checks. |
| `/anxiety` | /health-information/#mental-health-information (current NHS links) | Practice/clinical review: this distinct legacy health page now points into a shared NHS-link index. Confirm that the consolidated destination is an acceptable replacement. |
| `/depression` | /health-information/#mental-health-information (current NHS links) | Practice/clinical review: this distinct legacy health page now points into a shared NHS-link index. Confirm that the consolidated destination is an acceptable replacement. |
| `/dressing-clinic` | /services/#dressing-clinic (Wythenshawe Forum Dressing Clinic, 0300 303 9650) | Hold: proposed fragment `/services/#dressing-clinic` is missing from the current `_site` build (built 2026-11-21 21:02 UTC). Correct or approve a real destination before considering a redirect; also confirm the listed service details. |
| `/podiatry-referral-options` | /podiatry-referral-options/ (Manchester University NHS Foundation Trust route and South Manchester referral form) | Practice/clinical review: this route concerns referral options and a referral form. Confirm the current provider route, form and wording before redirecting. |
| `/stress` | /health-information/#mental-health-information (current NHS links) | Practice/clinical review: this distinct legacy health page now points into a shared NHS-link index. Confirm that the consolidated destination is an acceptable replacement. |
| `/contraception-and-smear-recall` | /contraception/ and /cervical-screening/ | Practice/clinical review: source combines contraception and cervical-screening recall; two local pages are mapped. No single destination is justified by this matrix. |
| `/chaperone-policy` | /chaperone-policy/ (full local policy; indexed at /practice-policies/#chaperones) | No redirect: source and local paths match after trailing-slash normalisation. |
| `/confidentiality` | /confidentiality/ (full local page; indexed at /practice-policies/#confidentiality-and-access-to-records) | No redirect: source and local paths match after trailing-slash normalisation. |
| `/data-protection` | /data-protection/ (full local policy) | No redirect: source and local paths match after trailing-slash normalisation. |
| `/disabled-access` | /contact/#parking-and-access and /accessibility-statement/ | Practice review: both `/contact/#parking-and-access` and `/accessibility-statement/` are mapped. Confirm which route best replaces the source page, and verify access details. |
| `/it-policy` | /it-policy/ (full local policy; indexed at /practice-policies/#information-technology) | No redirect: source and local paths match after trailing-slash normalisation. |
| `/personal-data` | /personal-data/ (full local systems list) | No redirect: source and local paths match after trailing-slash normalisation. |
| `/privacy-policy` | /privacy-notice/ (full notice requested from practice; source wording awaits DPO review) | 301 candidate after practice approval and target checks. |
| `/summary-care-record` | /summary-care-record/ (full local page; indexed at /practice-policies/#summary-care-record) and current NHS England Digital link | No redirect: source and local paths match after trailing-slash normalisation. |
| `/training` | /training/ (full local page; indexed at /practice-policies/#training-at-the-practice) | No redirect: source and local paths match after trailing-slash normalisation. |
| `/violence--zero-tolerance-policy` | /violence-zero-tolerance-policy/ (full local policy; indexed at /practice-policies/#respectful-behaviour) | 301 candidate after practice approval and target checks. |

## Pilot examples for a later approved launch

These lines show the shape of a few simple path redirects only. They are examples in this Markdown plan, not a `_redirects` file. Do not copy them into hosting until the destination content has been checked, practice approval is recorded, and the hostname/cutover gates below are met.

```text
/appointments--admin-requests /appointments/ 301
/patient-registration /register/ 301
/sick--fit-notes /fit-notes/ 301
/meet-the-team /our-team/ 301
/FooterLinks/Accessibility /accessibility-statement/ 301
/FooterLinks/YourData /privacy-notice/ 301
```

The candidate list in the inventory is the complete starting set, not just these examples. Redirects for a path that differs only by a trailing slash are unnecessary for the mapping; the host may separately normalise slashes as part of its normal routing.

## Cutover dependencies and handoff

Keep `site.search_indexing: false` in Park until the hostname and practice launch approvals are complete. At the approved launch, set `site.url` to the approved HTTPS hostname, enable indexing, and check the live canonical URLs, sitemap and `robots.txt`. Serve only path redirects that have been reviewed and tested against the approved destination map. This is a dependency note, not an instruction to make those changes now.

Before an approved cutover, the implementation owner should:

1. Ask the practice to resolve the review cases in this map and confirm content parity, service facts, legal/policy wording and clinical destinations. No GP earnings or source/fact review is complete by virtue of this map; do not record practice sign-off.
2. Confirm all candidate destinations and fragments against the exact isolated build intended for launch. The current generated `_site` was checked as a reference only (file timestamps 2026-11-21 21:02 UTC), not treated as a release build. The route files for candidate destinations exist there; the proposed `/services/#dressing-clinic` fragment does not. Fragment checks for the other fragments recorded in the matrix passed in that build. Recheck after any page edits.
3. Prepare the host-specific redirects only from approved entries, including case-sensitive source paths. Test representative old paths, final status and destination, then check for chains/loops and accidental broad matching. The official [Google site-move guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) recommends mapping old URLs to relevant new URLs and verifying redirects; it does not make this unapproved map a migration.
4. Keep deployment, DNS changes and publication outside this task. Do not commit or sync a redirect configuration from this document.

## Count and unresolved items

- Source inventory: **58 HTML rows** (57 content pages plus `/Sitemap`).
- Same path after trailing-slash normalisation: **19**, no redirect proposed.
- One-to-one local route candidates: **27**, subject to practice approval and the shared launch gates.
- Explicit practice/clinical/structural review or target-fix cases: **12**. These include the combined Opening hours/Contact and Services/Health advice source pages, the structural sitemap, the retired pregnancy planner, three consolidated mental-health paths, the unverified dressing-clinic fragment, combined contraception/smear recall, disabled access, unresolved minor-ailments scheme status, and podiatry referral details.
- Query-document endpoint: **25 individual document responses** remain outside this HTML path map; Cloudflare Pages path rules cannot dispatch their `id` values.

No practice sign-off is recorded. GP earnings and source/fact review remain pending. No public URL, clinical hazard, service or content issue is described here as resolved.
