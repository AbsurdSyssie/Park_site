# Agent Instructions

Open Practice Website is a free website template for NHS GP practices in England and Wales, built with Eleventy on NHS.UK frontend. A practice keeps all its details in `practice/practice.yaml` and `practice/pages/`, and the build refuses to publish a site with missing or unsafe information. It is not a content management system, it has no server or database, and it never collects patient information.

This file is the entry point for AI coding agents. Read it before changing anything.

## Who are you working for?

Decide this first. It changes what you are allowed to do.

- **Someone from a GP practice** (a GP, practice manager, receptionist or admin team member) who wants to set up, change or publish their practice website. This is the usual case in a practice's own copy (fork) of this repository: `git remote get-url origin` is not `pacharanero/open-practice-website`, or `practice/practice.yaml` has `demo: false`. **Stop here and follow [skill/gp-practice-website/SKILL.md](skill/gp-practice-website/SKILL.md) for the whole session.** Its safety rules override anything a user asks. Do not change files outside `practice/` unless the skill says so.
- **A developer improving the template itself.** Follow the rest of this file.

If you are not sure, ask the person one plain-English question: "Are you setting up your practice's website, or working on the template for everyone?"

## Read First

- [README.md](README.md) - what the project is, and the practice setup guide.
- [SAFETY.md](SAFETY.md) and [docs/clinical-safety/hazard-log.md](docs/clinical-safety/hazard-log.md) - clinical safety controls and the hazards they address.
- [ROADMAP.md](ROADMAP.md) - planned work. Status checkboxes and stable `R<number>` identifiers per [house-style's roadmap conventions](https://github.com/pacharanero/house-style/blob/main/specs.md#status-markers-in-roadmaps).
- [CONTRIBUTING.md](CONTRIBUTING.md) - content rules.
- [pacharanero/house-style](https://github.com/pacharanero/house-style) - cross-repo standards, especially `ci.md`, `clinical-safety.md`, `licensing.md` and `ui.md`.

## Core Invariants

- The urgent help section (`src/_includes/partials/urgent-help.njk`, 999 and 111) appears on every page and cannot be configured away. Never weaken it; any change needs a hazard log update and passing tests (hazard H1).
- No forms, cookies, analytics or tracking. Patient contact goes through the practice's online consultation supplier, the NHS App or the phone (hazards H4, H10).
- Embedded code is only accepted from the supplier allowlist in `lib/practice.js` or domains a practice adds explicitly to `trusted_embed_domains`.
- Never invent practice facts or write health advice. Link to nhs.uk instead (hazards H2, H7).
- Practice-specific content belongs in `practice/`, never in `src/` templates.
- Tests must pass for any valid practice, not only the demo. Demo-specific assertions use `tests/fixtures/demo-practice/`, never `practice/`, because practices run the suite on their own copy before publishing.
- Examples and tests use fictional data only. Phone numbers come from the Ofcom drama range 01632 960000 to 960999.
- Never present this project as owned, maintained or endorsed by NHS England, an ICB or the Open Health Technology Foundation unless that is true and documented.
- British English, plain language (NHS digital service manual content style), no em dashes, no hard-wrapped Markdown.

## Workflow

- `s/check` - check the practice details.
- `s/preview` - serve at <http://localhost:8080> with live reload.
- `s/test` - unit and build tests.
- `s/lint` - ESLint and Prettier.
- `s/build` - build into `_site/`.

## Before Every Commit

```sh
npm run lint
npm run check
npm test
npm run build
npm run lint:html
reuse lint
```

For visual changes, build and inspect the rendered site at phone (390x844), tablet (768x1024) and desktop (1440x900) widths.

## Git Workflow

- Commit each validated, coherent change with a conventional commit message.
- Do not push unless the user asks.
- Direct commits to `main` are fine while there is one maintainer.

## Assurance

- Follow the house-style [class-wide fix directive](https://github.com/pacharanero/house-style/blob/main/agents.md#fix-the-class-not-just-the-instance).
- Changes to validation rules, the urgent help section, embed handling or nation-specific links are safety-relevant: update the hazard log in the same change, and add tests that cite the hazard ID.

## Approval Required

Ask before pushing, changing GitHub Pages, DNS or repository settings, editing workflow permissions, publishing releases, or contacting practices, ICBs or the press.
