# Clinical safety

## What the template does

Open GP Practice Website produces a plain information website for a GP practice: how to contact the practice, opening times, how to book or request care online, prescriptions, test results, registration, the team, services, and the policies practices are expected to publish. Every page tells patients to call 999 in an emergency and 111 for urgent help when the practice is closed.

## What it does not do

- It does not collect, store or process patient information. There are no forms, cookies, analytics or accounts.
- It does not give health advice. Health information is linked to nhs.uk.
- It does not provide online consultation, booking or messaging. It links to, or embeds, the service the practice already uses from its supplier.

It is not a medical device. It publishes a practice's service information and nothing more.

## Where the risk is

The realistic risk is mundane: a practice website that sends an unwell patient to the wrong phone number, wrong opening times or a broken online form link. The template reduces this with build checks (required details, phone number and opening hours formats, no leftover placeholder text) and with urgent help on every page that cannot be removed. It cannot know whether a practice's details are actually right. Only the practice can check that.

## Responsibilities

- **The template**: maintained by Marcus Baw, who carried out an initial review of the [hazard log](docs/clinical-safety/hazard-log.md) in October 2026.
- **Each practice's website**: before going live, each practice must satisfy itself that its site is correct and suitable for its patients, with sign-off from its own Clinical Safety Officer or equivalent under its usual DCB0160 process. The sign-off checklist in the [practice skill](skill/gp-practice-website/SKILL.md) is the minimum. Practices can use the hazard log as a starting point.

## Reporting a safety concern

Open an issue, or for anything that could be exploited, use the private route in [SECURITY.md](SECURITY.md). If the concern is about a specific practice's website, contact that practice directly.
