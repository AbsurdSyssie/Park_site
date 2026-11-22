# Site structure review and implementation plan

16 November 2026. Review only. No published page, template, configuration or practice fact was changed. This is a proposed information architecture for approval, not an accessibility conformance statement.

## Recommendation

Keep every existing public address and all substantive source material. Make the existing Services, About, Health information, Practice policies, Feedback and Contact pages act as clear indexes. Give each detail page one semantic parent and link to it from the relevant patient task. No new grouping pages, nested URL migration, search service or content deletion is needed for this first improvement.

Preserve the six requested primary navigation labels and their order: Home, Request An Appointment / Admin Query, Join The Surgery, Patient Feedback, Test Results, Prescriptions. Keep the official NHS header and its responsive Browse More mechanism. Reduce the additional menu destinations from ten to five: Sick / Fit Notes, Opening Hours, Contact Us, Services and support, About the practice. Put Research, Team and AI under About; Bereavement and Carers under relevant support indexes. This still leaves eleven menu destinations overall. It is a deliberate compromise with the existing primary-menu decision, not full adoption of NHS England's suggested six-item menu. Do not conceal that tradeoff by counting only the initially visible items.

Optional later alternative, requiring agreement: adopt NHS England's suggested Home, Appointments, Prescriptions, Services, About the surgery, Contact us menu, while keeping registration, results, feedback and fit notes prominent on the homepage and relevant indexes. This would be a separate navigation decision, not a prerequisite for the proposed page organisation.

## Deterministic evidence

The authoritative snapshot is a fresh isolated preview build at `/tmp/park-structure-preview`. Existing `_preview` was overwritten with older policy-index output by an unidentified concurrent process during the review. That transient output showed eight apparent orphans; rebuilding to an isolated directory confirmed these were not defects in current source. Input hashes and timestamps are in `provenance.json`.

- 49 rendered HTML routes, including the home page and 404; 1,773 local HTML link occurrences (duplicates and shared navigation included).
- No broken local page/file targets or invalid fragments detected in rendered anchors. External destinations and document contents were not fetched by this graph checker. The link graph follows root-relative and fragment anchors; it does not treat arbitrary relative or absolute-origin URLs as local routes. All current generated navigation links use the root-relative convention.
- No duplicate document titles, H1 sets or exact normalised main-content hashes. This is not a semantic duplicate-content test.
- Every page has one main landmark, one H1 and a document language; no heading-level skips, duplicate IDs, missing image alt attributes or obviously unnamed text links in these static checks.
- Full HTML validation passes on the isolated output. Every page has a skip link; each non-home breadcrumb has exactly one unlinked current-page label. These are static presence checks, not runtime accessibility tests.
- No unlinked content page. `/404.html` is intentionally unlinked and must not be added to navigation to satisfy an orphan rule.
- `/about/`, `/cookies/`, `/news/` have incoming global links but no contextual incoming links. Cookies in the footer is normal; About deserves a homepage entry and News needs a meaningful home under About and feedback reports.
- Eleven pages have contextual inbound links only from Home: planning ahead, AI, bereavement, bowel screening, NHS number, homeless support, pregnancy, prescriptions, research, results and update details. A top task such as prescriptions is already globally prominent; this metric is a prioritisation aid, not an automatic defect.
- Eight pages have an explicit non-Home breadcrumb parent, all Practice policies. Most other pages flatten directly to Home. Flat addresses are valid; the missed opportunity is useful semantic parents and index links, not URL depth.
- Header has sixteen distinct destinations plus a repeated home logo link. Label/H1 differences are enumerated in `metrics.json`; case differences and Home versus practice name are expected. More meaningful mismatches include Services / NHS Advice versus Clinics and services, and multiple general-information destinations.

The source coverage matrix records 58 captured source HTML responses and 25 linked documents. That is provenance, not confirmation that content is current or approved. The route mapping attaches matching source URLs where a literal local route is present. Multi-route, historical-document and source-to-NHS replacement rows still require human comparison with `SOURCE-TO-LOCAL-MATRIX.md`; a source route count cannot prove clinical/legal parity.

## Evidence-supported issues and editorial proposals

1. **Menu mixes levels.** Sixteen destinations combine high-frequency tasks, indexes, individual support subjects and organisational disclosures. The count is measurable; reducing its scope is an editorial recommendation informed by NHS guidance, not a WCAG failure by itself.
2. **Home carries too much discovery responsibility.** Several detail pages have no contextual index other than Home. Add them to existing relevant indexes before reducing homepage links. Do not remove routes or make current journeys harder to find.
3. **Overlapping indexes lack distinct jobs.** About is organisational; Services is patient tasks and local services; Health information is authoritative NHS information; Practice policies is rights, records and policies. `/news/` currently combines a generic directory with historical 2024 reports. Propose Past news and reports, retaining those files and explicit dates; About supplies general organisational information.
4. **Policy versus organisation is inconsistent.** Training is currently nested under policies. Propose About as its canonical parent, retaining a cross-link in policies. Keep AI under About with privacy and appointment cross-links, rather than implying it is a patient service.
5. **Duplicated facts require ownership.** About and the GP earnings page both contain earnings material, and Services summarises private work as well as the separate fees page. Keep one authoritative detailed local destination; other pages may give a short task description and link. Do not remove earnings declarations, fees or clinical/legal wording during structural work.

## Proposed hierarchy and links

All existing public URLs stay unchanged. The original route map keeps its flat addresses; the later Practice news implementation adds new article routes under `/news/`. Hierarchy is expressed through index sections, breadcrumb parents and contextual links. A child can be linked from several tasks but has one canonical breadcrumb parent. Header current-page semantics should identify the current page; do not put `aria-current="page"` on a different ancestor destination. A visual section treatment may be distinct from that attribute.

- Home: quick links for appointments/admin, prescriptions, fit notes, results, joining, phone/contact, opening times and location; short links to Services, About and feedback. Keep the agreed urgent-help presentation on Home and Appointments and the standalone Urgent help route/footer link.
- Appointments: booking/admin action first, then links to fit notes, changing details, results, joining and urgent help where relevant. Do not nest an unrelated health-information catalogue here.
- Prescriptions: ordering and medication requests, with Prescription charges as a child.
- Services and support: four scan-friendly sections on the existing page: everyday tasks (results, joining, referrals, NHS App), clinics (existing clinic information, contraception, cervical and bowel screening), support (carers, homeless support, pharmacy, podiatry), and other information (private services, Health information). Link to fit notes and changing details even though their canonical parent is Appointments. Use ordinary descriptive links; do not introduce hover submenus or duplicate full service copy.
- Health information: NHS resource links plus Planning ahead, Pregnancy and Bereavement; keep these routes' verified source-based details. Also link these support pages directly from Services so users do not need to guess whether they count as health information.
- About: Team, Research, Training, AI information, GP earnings, Past news and reports, Practice policies. Include CQC information and links to Contact and feedback.
- Practice policies: retain full standalone policy pages and original/authoritative references. Group data/records versus how the practice works. Privacy notice is canonically a child here while remaining directly available in the footer and joining journey. Keep useful existing fragment headings as compatibility anchors.
- Feedback: clear choices for general feedback, making a complaint, participation group and historical feedback reports. Complaints page title proposed Make a complaint; retain full complaints process and feedback cross-link.
- Contact: location, phone, access and link to Opening times, with no duplication of a second hours table unless generated from the same data. Opening times also remains directly linked from Home and the footer.
- Site utilities: Accessibility statement and Cookies remain top-level with footer links; they do not need artificial policy breadcrumbs. Add privacy-to-cookies contextual link if useful.

Footer: keep Getting help with appointments, prescriptions, results, urgent help. Keep The practice with opening times, contact, joining, team; replace ambiguous Practice information link with About the practice, and include Patient feedback. Keep Policies with policy index, complaints, privacy, accessibility and cookies. Preserve compact official CQC widget. Historical reports are reached from About/Feedback, not a broad footer directory.

The original 49-route mapping follows below and is also available in `proposed-routes.csv` and `proposed-routes.json`. “Required incoming” means planned contextual links in addition to global navigation; do not interpret it as a requirement to delete other useful existing links. The later Practice news implementation supersedes the earlier Past news and reports title: `/news/` is Practice news and appears in Browse More, with dated article routes under `/news/<slug>/`; the article pages use the `/news/` breadcrumb parent. Their top-level source files use the `news-<slug>.md` naming convention and an explicit `news_article: true` front matter flag, because the practice page loader reads only top-level Markdown files. Other pages whose filenames start with `news-` keep their usual flat URLs unless marked as news articles.

## WCAG 2.2 AA baseline and remaining testing

WCAG 2.2 AA is the current Park accessibility baseline, in line with NHS guidance. The original structure review used a subset of WCAG 2.0 criteria: 1.3.1 (structure/relationships), 2.4.1 (bypass blocks), 2.4.2 (page titles), 2.4.4 (link purpose in context), 2.4.5 (multiple ways), 2.4.6 (headings and labels), 3.2.3 (consistent navigation), 3.2.4 (consistent identification), and 4.1.2 (name, role, value). A route map and valid HTML support review of these; neither establishes conformance. Multiple ways does not mandate site search: indexes plus contextual navigation may provide suitable alternatives, subject to review. Do not add a search service merely to satisfy a crawler metric.

No browser-driven accessibility engine ran during the original structure review. The Chrome debugging connection was refused and no accessibility testing tools or browsers were installed for that review. Keyboard/focus behaviour, screen-reader output, responsive menu operation, zoom/reflow, colour contrast, visual grouping, touch targets and supplier-widget runtime accessibility remain untested. Static presence of a language, alternative text or heading does not establish its correctness. PDFs and Word files need a separate accessibility assessment. Source headings, accessible names and links need manual comprehension review. Do not claim WCAG compliance from the zero static flags.

Assess the applicable WCAG 2.2 A and AA criteria before publication. Use the earlier structural results as evidence for those checks only. Record outstanding browser and manual testing in the audit, including whether overlays obscure focused controls and whether pointer targets are large enough.

## Ordered implementation plan, after approval

1. Freeze a source-hashed isolated baseline and approve the parent/title mapping. Resolve the decisions below. Preserve all old routes, IDs, supplier action URLs and documents in a manifest.
2. Add missing links to the existing indexes and cross-links in the mapping. Verify every moved menu/home link has a permanent destination in an index before removing its old prominence. No page merge or medical/policy rewrite in this phase.
3. Apply breadcrumb parents consistently from approved metadata. Keep the current unlinked current-page label if retaining the existing design. NHS guidance says the current page is not needed in breadcrumbs; its presence alone is not a defect. Test mobile Back to parent separately. Change Training parent with a retained policy-index cross-link.
4. Rationalise the additional menu links and footer using the approved navigation option. Preserve the user's six primary labels until explicitly approved otherwise. Standardise labels for additional links in sentence case with terms consistent with their destination headings.
5. Give News its historical-record purpose and remove its duplicate directory introduction. Keep dated reports and downloads. Consolidate repeated earnings/private-fee summaries only after checking source parity and ownership.
6. Rebuild in an isolated directory, compare route/file/ID manifests and source coverage, run deterministic checks, then accessibility and task testing. Present changes for practice sign-off; do not publish as part of this review.

## Deterministic acceptance criteria for later work

- All 49 existing routes still render; no new page required by this plan. All current fragment IDs and document URLs remain resolvable, including policy-index legacy anchors. If a later approved merge changes a route, add a real hosting-supported permanent redirect with fragment handling verified; an HTML meta refresh alone is not the preferred substitute. No redirects are needed for this plan.
- Parse every rendered page using the existing parse5 parser. Zero broken local targets/fragments, duplicate IDs/titles, missing language, unexpected H1/main counts or heading skips. Keep an explicit 404 exception for orphan checks. Compare exact duplicate main text, but review substantive duplication manually.
- Verify each approved child appears as a real contextual anchor in its approved parent, each parent exists, parent graph has no cycles, breadcrumb ancestor chain matches approved hierarchy, and every content page has at least one meaningful index/task inbound link. Do not count its own breadcrumb or shared header/footer as contextual discovery. Utility Cookies may rely on the footer plus its planned privacy link.
- Confirm the six approved primary destinations/order and approved overflow set in generated HTML; verify shared navigation consistency across all pages. Check `aria-current` against the actual route; breadcrumb current-page labels must be unlinked, and no more than one current page per navigation landmark. Absence of primary current state on a detail page is preferable to falsely labelling its parent as the current page.
- Check current supplier action destinations and preserved external authoritative links against the baseline. Review SOURCE-TO-LOCAL-MATRIX row dispositions, including multi-page source mappings and all 25 original documents; unresolved or retired clinical links remain explicit, never silently dropped.
- Run HTML validation across the isolated output. Once a browser is available, run an accessibility checker that covers WCAG 2.2 A and AA on all routes and group repeated findings from shared components. Record criteria the tool cannot assess. Automated results need manual validation.
- Manually complete appointments, prescriptions, fit note, results, joining, changing details, contact/hours, complaint and policy journeys using keyboard and a screen reader, at mobile and desktop sizes. Check visible focus, menu expansion, focus order and no-JavaScript operation. Verify text enlargement to 200% and reflow at a width equivalent to 320 CSS pixels, for example with 400% zoom from a 1,280 CSS pixel viewport. Test the CQC widget as loaded, not only its source markup.
- Confirm no report artifacts are copied into the website. Internal directory is safe under current configuration: Eleventy reads `src`, explicitly loads `practice/pages`, and copies `practice/images`, not arbitrary `practice/` files.

## Decisions requiring approval

- Keep the six primary labels plus five overflow destinations (recommended first phase under current constraints), or adopt the NHS England six-category menu as a later option?
- Accept the proposed canonical parents, particularly Training under About, joining/results under Services, and pregnancy/bereavement/planning under Health information with direct Services cross-links?
- Accept Past news and reports for `/news/`, and Make a complaint for `/complaints/`? Existing document addresses and full complaint content remain.

No new clinical facts or service availability decisions are made by this plan. Outstanding earnings declaration/content-review checks continue to block the production build; this review uses the existing draft-preview mechanism without guessing values.

## Standards consulted

Verified 16 November 2026. Principles are source-based; the exact grouping and route mapping are editorial proposals.

- [NHS England: Creating a highly usable and accessible GP website for patients, version 3](https://www.england.nhs.uk/wp-content/uploads/2022/09/PRN00651-creating-a-highly-usable-and-accessible-gp-website-for-patients-v3.pdf), sections 1.1 and 3.4: prioritise patient tasks; suggested six-category menu and maximum seven items; groups need permanent locations beyond Home. Guidance is July 2023, not new research conducted for this practice.
- [NHS header component](https://service-manual.nhs.uk/design-system/components/header): use the shared NHS header consistently; responsive Browse More is a component behaviour, not evidence that unlimited menu destinations are usable.
- [NHS breadcrumbs](https://service-manual.nhs.uk/design-system/components/breadcrumbs): communicate location and parent context; mobile parent link; current-page label optional rather than required.
- [NHS formatting](https://service-manual.nhs.uk/content/formatting): descriptive structure and links, supporting scan-friendly indexes.
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) defines the criteria for the current AA baseline. [W3C WCAG 2.0](https://www.w3.org/TR/WCAG20/) documents the criteria used in the original structure review.
- [NHS digital service manual accessibility guidance](https://service-manual.nhs.uk/accessibility/what-all-nhs-services-need-to-do) specifies WCAG 2.2 AA.

## Reproduction and artifacts

Run the commands recorded in `provenance.json` from the project root. `audit.mjs` is a small deterministic parse5 audit; `make-plan.mjs` encodes the proposed editorial mapping and generates the CSV/JSON and metrics. Neither edits the website. `audit.json` contains raw routes, IDs, headings, links by region, incoming links, breadcrumb/current semantics and exact content hashes. `routes.csv` is the current inventory; `metrics.json` summarises current structure. `proposed-routes.*` contains every current route, proposed parent/title/placement/incoming links and source linkage. A parent route is semantic and does not imply an address change.

## Complete route mapping

| Route | Current title / parent | Proposed title / parent | Navigation | Required incoming | Action / URL |
| --- | --- | --- | --- | --- | --- |
| /404.html | Page not found / / | Page not found / / | contextual only | system/home | keep-system-page; retain |
| /about/ | About the practice / / | About the practice / / | Browse More, footer | /, /services/ | keep-page; change grouping/links where specified; retain |
| /accessibility-statement/ | Accessibility / / | Accessibility statement / / | footer | /contact/, /about/ | keep-page; change grouping/links where specified; retain |
| /advanced-care-planning/ | Planning ahead for future care / / | Planning ahead for future care / /health-information/ | contextual only | /health-information/, /services/ | keep-page; change grouping/links where specified; retain |
| /appointments/ | Appointments and admin requests / / | Appointments and admin requests / / | primary, footer | / | keep-page; change grouping/links where specified; retain |
| /artificial-intelligence/ | Artificial intelligence information / / | Artificial intelligence information / /about/ | contextual only | /about/, /appointments/, /privacy-notice/ | keep-page; change grouping/links where specified; retain |
| /bereavement/ | Bereavement support / / | Bereavement support / /health-information/ | contextual only | /health-information/, /services/ | keep-page; change grouping/links where specified; retain |
| /bowel-cancer-screening/ | Bowel cancer screening / / | Bowel cancer screening / /services/ | contextual only | /services/ | keep-page; change grouping/links where specified; retain |
| /carers/ | Support for carers / / | Support for carers / /services/ | contextual only | /services/ | keep-page; change grouping/links where specified; retain |
| /cervical-screening/ | Cervical screening / / | Cervical screening / /services/ | contextual only | /services/ | keep-page; change grouping/links where specified; retain |
| /chaperone-policy/ | Chaperone policy / /practice-policies/ | Chaperone policy / /practice-policies/ | contextual only | /practice-policies/ | keep-page; change grouping/links where specified; retain |
| /complaints/ | Feedback and complaints / / | Make a complaint / /feedback/ | footer | /feedback/ | keep-page; change grouping/links where specified; retain |
| /confidentiality/ | Confidentiality / /practice-policies/ | Confidentiality / /practice-policies/ | contextual only | /practice-policies/ | keep-page; change grouping/links where specified; retain |
| /contact/ | Contact and find us / / | Contact and find us / / | Browse More, footer | /, /about/, /appointments/ | keep-page; change grouping/links where specified; retain |
| /contraception/ | Contraception / / | Contraception / /services/ | contextual only | /services/ | keep-page; change grouping/links where specified; retain |
| /cookies/ | Cookies / / | Cookies / / | footer | /privacy-notice/, /accessibility-statement/ | keep-page; change grouping/links where specified; retain |
| /data-protection/ | Data protection / /practice-policies/ | Data protection / /practice-policies/ | contextual only | /practice-policies/ | keep-page; change grouping/links where specified; retain |
| /feedback/ | Patient feedback / / | Patient feedback / / | primary, footer | /about/, /contact/, / | keep-page; change grouping/links where specified; retain |
| /find-your-nhs-number/ | Find your NHS number / / | Find your NHS number / /register/ | contextual only | /register/, /nhs-app/ | keep-page; change grouping/links where specified; retain |
| /fit-notes/ | Sick notes and fit notes / / | Sick notes and fit notes / /appointments/ | Browse More | /appointments/, /, /services/ | keep-page; change grouping/links where specified; retain |
| /gp-earnings/ | GP earnings / / | GP earnings / /about/ | contextual only | /about/, /practice-policies/ | keep-page; change grouping/links where specified; retain |
| /health-information/ | Health information / / | Health information / /services/ | contextual only | /services/, / | keep-page; change grouping/links where specified; retain |
| /homeless-friendly-practice/ | Homeless support / / | Homeless support / /services/ | contextual only | /services/ | keep-page; change grouping/links where specified; retain |
| / | The Park Medical Centre / none | The Park Medical Centre / none | primary | system/home | keep-page; change grouping/links where specified; retain |
| /it-policy/ | Information technology policy / /practice-policies/ | Information technology policy / /practice-policies/ | contextual only | /practice-policies/ | keep-page; change grouping/links where specified; retain |
| /minor-ailments-scheme/ | Pharmacy services / / | Pharmacy services / /services/ | contextual only | /services/ | keep-page; change grouping/links where specified; retain |
| /news/ | Practice information / / | Practice news / /about/ | Browse More | /about/, /feedback/, /patient-participation-group/ | keep-page; change grouping/links where specified; retain |
| /nhs-app/ | NHS App / / | NHS App / /services/ | contextual only | /services/ | keep-page; change grouping/links where specified; retain |
| /opening-times/ | Opening times / / | Opening times / /contact/ | Browse More, footer | /contact/, /, /appointments/ | keep-page; change grouping/links where specified; retain |
| /our-team/ | Our team / / | Our team / /about/ | footer | /about/ | keep-page; change grouping/links where specified; retain |
| /patient-participation-group/ | Patient Participation Group / / | Patient Participation Group / /feedback/ | contextual only | /feedback/, /about/ | keep-page; change grouping/links where specified; retain |
| /personal-data/ | Personal data and online services / /practice-policies/ | Personal data and online services / /practice-policies/ | contextual only | /practice-policies/ | keep-page; change grouping/links where specified; retain |
| /podiatry-referral-options/ | Podiatry referral options / / | Podiatry referral options / /services/ | contextual only | /services/ | keep-page; change grouping/links where specified; retain |
| /practice-policies/ | Practice policies / / | Practice policies / /about/ | footer | /about/ | keep-page; change grouping/links where specified; retain |
| /pregnancy/ | Pregnancy information / / | Pregnancy information / /health-information/ | contextual only | /health-information/, /services/ | keep-page; change grouping/links where specified; retain |
| /prescription-fees/ | Prescription charges / / | Prescription charges / /prescriptions/ | contextual only | /prescriptions/, /services/ | keep-page; change grouping/links where specified; retain |
| /prescriptions/ | Prescriptions / / | Prescriptions / / | primary, footer | / | keep-page; change grouping/links where specified; retain |
| /privacy-notice/ | Privacy notice / / | Privacy notice / /practice-policies/ | footer | /practice-policies/, /register/, /personal-data/ | keep-page; change grouping/links where specified; retain |
| /private-services/ | Private services and fees / / | Private services and fees / /services/ | contextual only | /services/, /appointments/ | keep-page; change grouping/links where specified; retain |
| /register/ | Register with us / / | Register with us / /services/ | primary, footer | /services/, /, /appointments/, /homeless-friendly-practice/ | keep-page; change grouping/links where specified; retain |
| /research/ | Research / / | Research / /about/ | contextual only | /about/ | keep-page; change grouping/links where specified; retain |
| /self-referrals/ | Self-referrals and referral tracking / / | Self-referrals and referral tracking / /services/ | contextual only | /services/ | keep-page; change grouping/links where specified; retain |
| /services/ | Clinics and services / / | Services and support / / | Browse More | system/home | keep-page; change grouping/links where specified; retain |
| /summary-care-record/ | Summary Care Record / /practice-policies/ | Summary Care Record / /practice-policies/ | contextual only | /practice-policies/ | keep-page; change grouping/links where specified; retain |
| /test-results/ | Test results / / | Test results / /services/ | primary, footer | /services/, /, /appointments/, /nhs-app/ | keep-page; change grouping/links where specified; retain |
| /training/ | Training at the practice / /practice-policies/ | Training at the practice / /about/ | contextual only | /about/, /practice-policies/ | keep-page; change grouping/links where specified; retain |
| /update-your-details/ | Update your details / / | Update your details / /appointments/ | contextual only | /appointments/, /contact/, /register/, /nhs-app/ | keep-page; change grouping/links where specified; retain |
| /urgent-help/ | Urgent help / / | Urgent help / /appointments/ | footer | /appointments/ | keep-page; change grouping/links where specified; retain |
| /violence-zero-tolerance-policy/ | Respectful behaviour policy / /practice-policies/ | Respectful behaviour policy / /practice-policies/ | contextual only | /practice-policies/ | keep-page; change grouping/links where specified; retain |

Artifact validation: 49 unique proposed mappings match all 49 rendered routes; every proposed parent/incoming route exists and parent graph has no cycles. Internal review artifacts are absent from the isolated generated website.
