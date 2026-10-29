# Open Practice Website

A free, open source website template for GP practices in England and Wales, built on [NHS.UK frontend](https://github.com/nhsuk/nhsuk-frontend).

It is designed for practices that need a simple, safe website online quickly, for example after a website supplier stops trading. A practice fills in one details file, the site is checked for missing or unsafe information, and the result is a folder of plain files that can be published for free on Netlify, Cloudflare Pages or GitHub Pages.

It comes with a Claude skill that guides a non-technical person (a GP, practice manager or admin team member) through the whole process, from gathering the practice's details to publishing and getting the web address working.

**[See the demo site](https://OWNER.github.io/open-practice-website/)** for a fictional practice.

## What you get

- The pages patients need: appointments and online consultation, prescriptions, test results, opening times, contact and directions, registration, team, services, news, and urgent help
- The information practices are expected to publish: privacy notice, complaints, accessibility statement, cookies, and in England the CQC rating and GP earnings declaration
- Urgent and emergency signposting (999 and 111) on every page, which cannot be turned off
- Space for the online consultation link and embed code from the practice's supplier (Accurx, Klinik, PATCHS, eConsult and others)
- No cookies, tracking or patient data: contact goes through the practice's existing supplier, the NHS App and the phone
- An NHS.UK frontend design that patients recognise and that is built to meet accessibility standards

## For practices

You do not need to read the rest of this page. Use the Claude skill in [`skill/gp-practice-website`](skill/gp-practice-website/SKILL.md), or ask someone technical to help you follow it.

Your website belongs to your practice. Keep a copy of your project files on the practice shared drive, and create any hosting accounts with a shared practice email address.

## How it works

```
practice/
  practice.yaml       All the practice's details. This is the file practices edit.
  pages/*.md          The privacy notice, plus any extra pages, in Markdown.
  images/             Optional logo and images.
src/                  Page templates and layouts. Practices should not need to edit these.
lib/practice.js       Loads and checks the practice details.
skill/                The Claude skill and its reference guides.
docs/                 Clinical safety and other documentation.
```

The site is built with [Eleventy](https://www.11ty.dev/) and uses the NHS.UK frontend Nunjucks macros directly.

When the site builds, `lib/practice.js` checks the practice details. The build stops, with plain English explanations, if anything patients rely on is missing or wrong: phone number, opening hours for every day, the online consultation link, required published information, or any leftover placeholder text such as TODO. Embedded code is only allowed from known suppliers, unless the practice adds a domain explicitly.

## Development

You need Node.js 24 (see `.nvmrc`).

```sh
npm ci
npm run check      # check the practice details
npm start          # preview at http://localhost:8080
npm test           # unit tests and full build tests
npm run lint       # ESLint and Prettier
npm run build      # build to _site/
npm run lint:html  # validate the built HTML
```

To build another practice's details, set `PRACTICE_DIR`, for example `PRACTICE_DIR=tests/fixtures/wales-practice npm run build`. To build for a sub folder, set `PATH_PREFIX`, for example `PATH_PREFIX=/open-practice-website/ npm run build`.

## Publishing the demo on GitHub Pages

The `Publish to GitHub Pages` workflow builds and publishes the site on every push to `main`. In the repository settings, set Pages > Source to "GitHub Actions". The demo practice in `practice/` is fictional and shows a "Demo" banner.

## Clinical safety

This template is used to give patients information about how to get care, so it has a starter hazard log in [`docs/clinical-safety/hazard-log.md`](docs/clinical-safety/hazard-log.md). Each practice that uses it remains responsible for the accuracy of its own content and for any local DCB0160 assessment.

## NHS identity

The code is open source, but the NHS logo, the NHS identity and the Frutiger font are not covered by this licence. GP practices may use the NHS logo under the NHS identity guidelines. Check the guidelines before publishing, and use your own logo (`site.logo`) if you are not entitled to use the NHS logo.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

The code is released under the [MIT Licence](LICENSE). NHS.UK frontend is © NHS England and also released under the MIT Licence.
