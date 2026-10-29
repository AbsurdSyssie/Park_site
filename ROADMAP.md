# Roadmap

Legend: [x] done, [~] in progress, [ ] not started

## Guiding constraints

- Free to use, free to host, owned by the practice. No shared hosting that can fail all practices at once.
- No patient data, forms, cookies or tracking.
- Plain English for practice staff; no local developer tools required.
- Urgent help on every page, always.

## Now: rescue release

- [x] **R1 - Initial template**: Eleventy on NHS.UK frontend, 17 pages, one practice details file, build-time validation, England and Wales, fictional demo, tests, CI, GitHub Pages publishing, practice skill and starter hazard log.
- [x] **R2 - Clinical safety review**: initial review of the hazard log ratings (October 2026).
- [ ] **R3 - Publish the repository and demo**: make `pacharanero/open-gp-practice-website` public, set Pages source to GitHub Actions, enable private vulnerability reporting, add the repo description and topics, and confirm the demo at <https://pacharanero.github.io/open-gp-practice-website/>.
- [ ] **R4 - Forward-test the fork route** end to end with someone non-technical: new GitHub account, fork, enable Actions and Pages, Claude Code on the web, first publish. Fix every step that confuses them.
  - A 29 October 2026 agent test published a fictional practice successfully after enabling workflows. Its setup and safety feedback has been incorporated; a trial with someone non-technical is still needed.
- [ ] **R5 - Pull request safety in forks**: when a cloud assistant opens a pull request from a practice's fork, GitHub may default the target to the upstream template. Confirm what Claude Code on the web does, and if needed add a check or instruction so practice data is never proposed to the upstream repository.
- [ ] **R6 - Preview before going live**: today the first merge publishes straight to the practice's github.io address. Add a preview mode (for example a `preview: true` flag with banner and `noindex`, or pull request previews) so sign-off happens on the real rendered site before it is public.
- [ ] **R7 - One-page note for ICB digital teams**: what the template is, who maintains it, hosting, hazard log and accessibility, suitable for forwarding to practices.

## Next

- [ ] **R8 - Automated accessibility checks** (for example axe) in CI. (Hazard log open action.)
- [ ] **R9 - Content Security Policy** generated from the trusted embed domains. (Hazard log open action.)
- [ ] **R10 - Pre-fill from the ODS code** using the NHS ODS API, so the assistant can propose name, address and phone for the practice to confirm.
- [ ] **R11 - Template updates without conflicts**: keep upstream changes out of `practice/` so "Sync fork" stays a one-click update, and document how practices take NHS.UK frontend updates.
- [ ] **R12 - Issue templates** written for practice staff (problem with my site, request a feature).
- [ ] **R13 - Tested routes for other cloud assistants** that read `AGENTS.md`, such as OpenAI Codex and GitHub Copilot's coding agent.
- [ ] **R14 - Social preview image** and a short screen recording of the setup flow for the README.
- [ ] **R15 - Package the practice skill** as a downloadable zip on each release, for the claude.ai drag-and-drop route.
