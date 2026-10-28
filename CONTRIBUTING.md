# Contributing

Thank you for helping. This template is used by GP practices to tell patients how to get care, so changes are judged first on safety, then on simplicity.

## Before you open a pull request

```sh
npm ci
npm run lint
npm test
npm run build
npm run lint:html
```

All of these run in CI and must pass.

- Add tests for new functionality. Validation rules go in `tests/practice.test.js`; anything about the built pages goes in `tests/build.test.js`.
- Keep practice-specific content in `practice/practice.yaml`, not in the templates.
- Use NHS.UK frontend components and the NHS digital service manual content style.
- Do not add cookies, analytics, tracking, or forms that collect patient information.
- Do not change the urgent help section without updating the hazard log (`docs/clinical-safety/hazard-log.md`) and its tests.
- Do not use real people, places or phone numbers in examples or tests. Use the Ofcom drama range (01632 960000 to 960999) for phone numbers.

## Changes to the Claude skill

The skill in `skill/gp-practice-website/` is written for non-technical users. Keep its instructions in plain English, and keep the safety rules intact.
