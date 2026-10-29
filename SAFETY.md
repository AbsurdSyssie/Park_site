# Clinical safety

## What the template does

Open GP Practice Website produces an information website for a GP practice: how to contact the practice, opening times, how to book or request care online, prescriptions, test results, registration, the team, services, and the policies practices are expected to publish. Every page tells patients to call 999 in an emergency and 111 for urgent help when the practice is closed.

## What it does not do

- It does not collect, store or process patient information. There are no forms, cookies, analytics or accounts.
- It does not give health advice. Health information is linked to nhs.uk.
- It does not provide online consultation, booking or messaging. It links to, or embeds, the service the practice already uses from its supplier.
- It is designed to make no clinical claims. The formal medical-device applicability record below is not yet completed.

## Intended users and setting

- **Patients** of an NHS GP practice in England or Wales, reading the practice's public website.
- **Practice staff** (GPs, practice managers, admin teams) who set up and update their own copy, usually with help from an AI assistant following [the practice skill](skill/gp-practice-website/SKILL.md).

## Responsibilities

- **The template**: maintained by Marcus Baw. The template's own clinical safety work is recorded in this repository.
- **Each practice's website**: the practice is responsible for the accuracy of its content and for any local DCB0160 clinical risk management. Practices and ICBs can use the hazard log as a starting point.

## Current safety status

- Starter [hazard log](docs/clinical-safety/hazard-log.md) with hazards H1 to H10 and their controls.
- Safety controls are enforced by the build (the site will not build with missing or invalid key information) and by automated tests that cite the hazard they protect.
- Initial review of the hazard log and ratings by Marcus Baw, October 2026.
- **Each practice must satisfy itself, before going live, that its site is correct and suitable for its patients.** The sign-off checklist in the practice skill is the minimum; it does not replace the practice's own judgement or local DCB0160 process.
- No DCB0129 safety case has been written. Whether DCB0129 applies to a free template that practices deploy themselves has not yet been assessed.

## Medical-device applicability

This record has not yet been completed. It must be completed and dated by a named decision-maker before the template is promoted to practices.

- Intended purpose: to publish a GP practice's non-clinical service information (contact details, opening times, access routes and required policies) and fixed urgent care signposting to patients. No clinical decision support, triage, diagnosis or treatment recommendations.
- Decision-maker and role: not yet recorded.
- Decision date: not yet recorded.
- Next review date: not yet recorded.
- Evidence considered: not yet recorded. Start from the MHRA guidance on [borderline products](https://www.gov.uk/guidance/borderline-products-how-to-tell-if-your-product-is-a-medical-device) and NHS England guidance on [DCB0129 and DCB0160 applicability](https://digital.nhs.uk/services/clinical-safety/applicability-of-dcb-0129-and-dcb-0160/step-by-step-guidance).
- Conclusion: not yet recorded.
- Actions and owner: complete this record (Marcus Baw, roadmap R2).
- Reassessment triggers: any feature that adds symptom content, triage, forms, patient data, or changes the urgent help section.

## Reporting a safety concern

Open an issue, or for anything that could be exploited, use the private route in [SECURITY.md](SECURITY.md). If the concern is about a specific practice's website, contact that practice directly.
