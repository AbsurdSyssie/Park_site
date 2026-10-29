# Contributing

Thank you for helping. This template is used by GP practices to tell patients how to get care, so changes are judged first on safety, then on simplicity.

## Before you open a pull request

You need Node.js 24 (see `.nvmrc`) and, for the licensing check, [reuse](https://reuse.software/).

```sh
npm ci
npm run lint
npm run check
npm test
npm run build
npm run lint:html
reuse lint
```

All of these run in CI and must pass. The `s/` scripts wrap the common ones; see [s/README.md](s/README.md).

- New source files start with the same two-line SPDX copyright and licence header as the existing ones (copy it from `lib/practice.js`). Markdown and data files are covered by `REUSE.toml`.
- Use conventional commit messages (`feat:`, `fix:`, `docs:`, `test:`, `ci:`, `chore(deps):`).
- Tests must pass for any valid practice. Put demo-specific assertions against `tests/fixtures/demo-practice/`, not `practice/`, because practices run the tests on their own copy before their site publishes.

- Add tests for new functionality. Validation rules go in `tests/practice.test.js`; anything about the built pages goes in `tests/build.test.js`.
- Keep practice-specific content in `practice/practice.yaml`, not in the templates.
- Use NHS.UK frontend components and the NHS digital service manual content style.
- Do not add cookies, analytics, tracking, or forms that collect patient information.
- Do not change the urgent help section without updating the hazard log (`docs/clinical-safety/hazard-log.md`) and its tests.
- Do not use real people, places or phone numbers in examples or tests. Use the Ofcom drama range (01632 960000 to 960999) for phone numbers.

## Changes to the Claude skill

The skill in `skill/gp-practice-website/` is written for non-technical users. Keep its instructions in plain English, and keep the safety rules intact.
