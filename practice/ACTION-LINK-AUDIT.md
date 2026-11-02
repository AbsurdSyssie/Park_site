# Service action audit

Checked all 23 rendered demo HTML pages on 2 November 2026, including shared navigation, footer and urgent help. Nine primary actions now use the installed NHS.UK `actionLink` macro. Its SVG is kept in an uninterrupted HTML block using the existing Markdown-safe integration, not handwritten icons. All 27 unique external hrefs still exactly match the external-link audit. No clinical instructions, phone numbers, request availability or supplier URLs changed.

## Primary actions

| Page | Action | Decision |
| --- | --- | --- |
| / | Request an appointment or admin help | Converted the hero button; unchanged /appointments/ destination. |
| /appointments/ | Request an appointment | Existing official macro retained, unchanged Accurx URL. |
| /appointments/ | Send an admin request | Existing official macro retained, unchanged Accurx URL. |
| /register/ | Register with The Park | Existing official macro retained with the exact short label and unchanged https://gp-registration.nhs.uk/P84045 URL. |
| /fit-notes/ | Request a fit note | Converted, preserving https://florey.accurx.com/p/P84045 exactly. |
| /prescriptions/ | Order repeat prescriptions using the NHS App | Converted the ordering link to a standalone primary action; existing NHS App information URL preserved, not replaced with an invented app deep link. |
| /prescriptions/ | Send a medication query | Converted the task link, unchanged Accurx URL. |
| /test-results/ | View results in the NHS App | Converted the results task link, unchanged NHS App URL. |
| /test-results/ | Send an online admin request | Converted the fallback task link, unchanged Accurx URL. |

The homepage registration card now also says **Register with The Park**. It remains a navigation card to /register/, not a second external registration action.

## Other candidates and exclusions, by page

| Page | Other candidates and decision |
| --- | --- |
| / | Six service navigation cards retained: appointments, prescriptions, results, registration, fit notes, contact/directions. Team, services, self-referrals, PPG, feedback, NHS App and health-information links remain navigation or information. |
| /appointments/ | Cancellation Accurx link stays inline alongside its specific timing/text-message instructions. Cancellation via text, home visits and extended appointments have no separate verified action URL. Telephone fallbacks unchanged. |
| /register/ | Find your NHS number is a supporting utility, not registration; privacy information remains a policy link. Temporary registration remains reception-only. |
| /prescriptions/ | Find a pharmacy is a supporting external search, not the practice's ordering task. Medicines information stays informational. Written/postal requests, EPS sign-up and medication reviews have no verified separate action URL; no new route invented. |
| /test-results/ | Blood-test and X-ray information stays informational. Reception and phone fallbacks unchanged. |
| /fit-notes/ | NHS fit-note and GOV.UK sick-leave information stay informational. |
| /contact/ | Online request service and appointments/admin links remain contextual inline links. Directions stays a supporting map utility. Phone and correspondence email unchanged, not promoted as clinical request actions. |
| /opening-times/ | Appointments/admin cross-link remains inline navigation; NHS 111 and telephone/emergency routes unchanged. |
| /nhs-app/ | Find out about the NHS App is information, not a verified login/deep link. Appointment cross-link remains contextual navigation. |
| /self-referrals/ | Maternity, Northern sexual health, Carers Manchester, 42nd Street and urgent dental links are service information/directory destinations, not verified direct submission routes. Care Gateway information stays informational; referral tracking phone unchanged. |
| /services/ | Self-referrals, fit notes, carers and NHS App links remain service navigation. Armed Forces and health A-to-Z links remain informational. Nurse clinics, family planning, screening, minor surgery, injections, blood tests, private work and veteran record updates have no verified separate online action URL; reception instructions retained. |
| /carers/ | Carers Manchester information and reception contact unchanged; no verified online notification route. |
| /patient-participation-group/ | Joining remains reception/phone only; no verified online join action. |
| /feedback/ | Feedback remains in person/on paper. PPG and complaints links stay navigation; no verified feedback submission endpoint. |
| /complaints/ | Phone/write-to-manager instructions and feedback navigation unchanged; no verified online complaint submission route. |
| /about/ | Team/services/PPG navigation, CQC, NHS profile, earnings and policy information unchanged. |
| /privacy-notice/ | Privacy notices and PDF remain policy links; phone unchanged. |
| /accessibility-statement/ | Alternative-format request remains phone/reception only. |
| /news/ | Service information cross-links and reception phone unchanged. |
| /our-team/ | No body action links. |
| /cookies/ | No body action links. |
| /urgent-help/ | NHS 111 and reception links unchanged; emergency/safety content excluded. |
| /404.html | Home/contact recovery navigation unchanged. |

**Change contact details:** no published task link or verified dedicated destination exists on any rendered page. Not added, and not inferred from the general Accurx route. Shared header/footer navigation, skip/back links, policy links and all urgent-help links remain unchanged throughout.

## Verification

All 44 tests pass, with the Markdown regression tests extended across home, registration, prescriptions/medication, results and fit-note actions as well as appointment/admin actions. Lint, fictional production check/build/HTML validation, real demo build/HTML validation, all-page internal destinations, external-destination equality and official glyph/DOM checks pass. Every action has one official SVG and path; every rendered path has the SVG namespace and an SVG parent, with no orphan paths. Browser checks at 390×844, 768×1024 and 1440×900 show no horizontal overflow across all six action pages; screenshots retained locally under /tmp/opencode/park-*.png.

The strict actual-practice check/build remains blocked by the missing approved review date and structured GP earnings declaration. This is an authorised personal unofficial demo only, not practice production approval. REUSE verification could not run because `reuse` is not installed. The Playwright MCP browser executable was unavailable; verification instead used the existing local Playwright package and Chromium installation.
