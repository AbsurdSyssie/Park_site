# Park Medical Centre personal demonstration

This is a separate, personal, unofficial demonstration, authorised by its personal account owner, not by The Park Medical Centre. It is not the practice website, has no clinical sign-off and must not be represented as practice-approved or used to replace its official service.

Fresh upstream clone: `https://github.com/pacharanero/open-gp-practice-website`. The upstream `origin` is preserved. Only the separate `personal` remote points to `AbsurdSyssie/Park_site`.

## Build and publish

`npm ci`, `npm run lint`, `npm test`, `PRACTICE_DIR=tests/fixtures/demo-practice npm run check`, `PRACTICE_DIR=tests/fixtures/demo-practice npm run build`, `npm run lint:html`, `npm run build:demo`, `npm run lint:html:demo`.

Only `_preview` is eligible for the authorised personal Cloudflare Pages direct upload. `npm run build:demo` removes old preview output first. No Git-based Cloudflare automatic deployment is configured. GitHub Pages publishing is manual only and retains strict validation of actual practice data. CI checks valid fictional fixtures and independently builds and HTML-validates the real unapproved demo; it does not hardcode today's missing fields.

Preview tooling is adapted from Range's real-practice preview infrastructure. It does not change `lib/practice.js`, set the practice to fictional/demo data, manufacture missing review dates or infer GP cohort figures. All ordinary source-specific content is under `practice/`. The safety partial is unchanged. Every page retains one unofficial banner, urgent 999/111 links and noindex. `_headers` also prevents transformations. No forms, external embeds or tracking run on this demo.

## Production is blocked

The actual `npm run check` and production build must fail until the required practice approval date and complete structured GP earnings declaration are supplied. The published source has a known financial year but omits the full-time count. Its exact disclosed facts remain on the about page; the incomplete structured declaration is deliberately absent, not completed with a fabricated zero. See `practice/MIGRATION-QUERIES.md`.

Source evidence is retained locally at `/tmp/opencode/park-source`; durable findings and the rendered external-link audit are in `practice/`. These administrative records are not web pages.
