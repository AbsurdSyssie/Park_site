# `s/`

Small convenience scripts for working on the template. Each one wraps an `npm` script and passes extra arguments through. Run `npm ci` once first.

Practices using the template through a cloud AI assistant do not need these; the assistant runs the same checks.

## `s/check`

Checks the practice's details in `practice/` and explains any problems in plain English.

- `s/check` - check `practice/`
- `PRACTICE_DIR=tests/fixtures/wales-practice s/check` - check another folder

## `s/preview`

Serves the site at <http://localhost:8080> with live reload.

- `s/preview`
- `s/preview --port=8081`

## `s/test`

Runs the unit tests and full build tests.

## `s/lint`

Runs ESLint and the Prettier formatting check.

## `s/build`

Builds the site into `_site/`.

- `s/build`
- `PATH_PREFIX=/open-practice-website/ s/build` - build for a sub folder
