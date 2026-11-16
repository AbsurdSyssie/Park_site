# Site structure implementation review

Reviewed 16 November 2026 against `REVIEW.md` and `proposed-routes.json`. The approved changes are present in an isolated draft preview. No outstanding actionable implementation finding was identified in the reviewed scope; practice fact checking and clinical safety assessment remain open.

## Deterministic checks

- The isolated preview rendered all 49 mapped routes. All mapped page titles, ordered breadcrumb ancestors and unlinked current-page labels matched; no navigation landmark had a false or duplicate `aria-current`.
- All 82 specified contextual inbound links appeared in the main content of their specified source pages. All pages shared the six ordered primary destinations and five approved overflow destinations.
- Baseline rendered IDs, external HTTP(S) links and non-HTML output files were retained. The parse5 baseline audit of the implementation reported no broken local targets or fragments, duplicate IDs or titles, missing language, unexpected main or H1 counts, or heading skips. The 404 page was the expected orphan; Cookies relied on global navigation before its contextual links were added.
- Every page retained the CQC footer wrapper and Urgent help footer link. The shared urgent-help panel appeared on Home and Appointments only. Internal source archives and review artifacts were absent from output.
- A fictional production fixture confirmed that practice Markdown replaces matching generic wrappers, Home renders at `/` with its safety panel, and unrelated wrappers remain available. A production fixture with a path prefix rendered prefixed breadcrumb links. The preview configuration deliberately uses the root path.
- `npm test` and `npm run lint` passed. The implementation checker passed all 49 titles, 47 ordinary breadcrumb chains and 82 required contextual edges. HTML validation of the isolated output passed when run with `--config .htmlvalidate.json`; specifying the configuration is necessary when validating files outside the repository.

## Remaining work

GP earnings and the content review date remain production-build blockers; source and practice facts still require review and practice sign-off. The Home/Appointments urgent-help decision does not itself resolve hazard H1 and requires the normal clinical safety assessment. No publication or sign-off was performed.

The requested WCAG 2.0 criteria are a review baseline, not a conformance claim. Current NHS guidance references WCAG 2.2 AA. Browser-driven accessibility checks, keyboard and screen-reader journeys, responsive menu and visual checks, zoom/reflow, contrast, supplier widget runtime, and document accessibility remain to be assessed. No browser-driven accessibility engine ran for this review.
