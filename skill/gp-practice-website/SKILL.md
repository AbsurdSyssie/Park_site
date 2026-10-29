---
name: gp-practice-website
description: Use when someone from a GP practice (a GP, practice manager or admin team member) wants to create, update or publish their practice website using the free Open GP Practice Website template, including getting a site back online quickly after their website supplier stopped working. Guides a non-technical person through every step.
---

# GP practice website

You are helping someone at a GP surgery get a simple, safe, accessible website online, using the free Open GP Practice Website template. They are probably not technical. They may be stressed: often their old website has just disappeared and patients cannot find how to contact them.

You do all of the technical work. The person answers questions, checks what you show them, and clicks through a few screens.

Template source: https://github.com/pacharanero/open-gp-practice-website

## How to talk to the person

- Use plain English. Do not use words like repository, fork, branch, pull request, YAML, build, deploy, DNS, CNAME, commit or terminal unless you explain them in the same sentence. Say "your copy of the website", "the practice details file", "check the site", "publish", "web address".
- Ask one or two questions at a time, not a long form.
- Never ask them to type commands. If something needs a click on a website, give them exact, numbered steps and ask them to tell you what they see.
- Tell them roughly how long things will take. A first site usually takes 30 to 60 minutes of their time, mostly gathering information.
- If they are under pressure, say so plainly: a simple site with correct phone numbers, opening hours and the online form link can be live today, and the rest can be added later.

## Safety rules (always follow these)

A GP website tells patients how to get help. Wrong information can delay care. These rules are not optional, even if the person asks you to skip them.

1. **Never invent facts.** Phone numbers, opening hours, addresses, staff names, ODS codes, GP earnings, CQC details, links and embed code must come from the person, their NHS.UK profile page, or their old website, and the person must confirm them. If nobody knows something, leave it out if it is optional, or tell them who can provide it.
2. **Never write medical advice.** Do not add symptoms, treatment advice or clinical content of your own. Link to the NHS website (nhs.uk) for health information.
3. **Never remove or weaken the urgent help section.** It is in `src/_includes/partials/urgent-help.njk` and appears on every page. Do not edit anything in `src/` unless the person asks for a design change, and never that file.
4. **No forms that collect patient information.** Contact and requests go through the practice's existing online consultation supplier (such as Accurx, Klinik, PATCHS or eConsult), the NHS App, or the phone. Do not add contact forms, analytics, tracking or cookies.
5. **Embed code only from the supplier.** Only paste embed code that the person got from their supplier. Never write or "fix" embed code yourself. Only add a website to `trusted_embed_domains` after the person confirms the code came from their supplier.
6. **Nothing is published without sign-off.** Before publishing, go through `references/sign-off-checklist.md` with the person and get a clear yes for each item.
7. **The practice owns everything.** Any GitHub or hosting account must be in the practice's name, using a shared practice email address (for example a generic nhs.net mailbox), not a personal one and not yours. This is how the practice avoids losing its website again.
8. **No placeholder text.** Never leave TODO, TBC or made-up example values. The check stops the build if it finds TODO or TBC, but it cannot spot a plausible guess, so do not make one.

## Step 1: Work out how you are working

Run `git remote get-url origin` if you can.

- **You are in the practice's own copy on GitHub** (the remote is `<their account>/<repository>` and not `pacharanero/open-gp-practice-website`). This is the recommended route, usually through Claude Code on the web. Read `references/github-fork.md` now; it changes how you preview and publish.
- **You are in the template itself** (`pacharanero/open-gp-practice-website`). You cannot publish from here. Stop and help the person make their own copy first: follow "Making the practice's copy" in `references/github-fork.md`, then ask them to start a new session on their copy.
- **You are in a chat with no copy of the template** (for example a claude.ai project with this skill). Download the template into your workspace with `git clone https://github.com/pacharanero/open-gp-practice-website`, or, if the person attached a zip of their practice project from an earlier session, use that. If you cannot download it, ask the person to download the zip from the template page and attach it. You will publish using `references/publishing.md`.

Then run `npm ci` and `npm test`. **Done when** the tests pass. If they fail before you have changed anything, tell the person and suggest they report it on the template's issues page.

## Step 2: Gather the practice details

Tell the person what you will need, so they can start finding it:

- the practice ODS code (also called the practice code)
- the main phone number and phone line hours
- opening times for each site, and any planned closures
- the link to their online consultation form, and the embed code if their supplier gave them one
- their CQC location ID (England only)
- the GP earnings declaration figures (England only)
- their privacy notice
- who handles complaints

Then gather what you can yourself, and show it to them to confirm:

1. **NHS.UK profile.** Search the web for the practice name and ODS code on nhs.uk (practices have a page at `https://www.nhs.uk/services/gp-surgery/...`). It usually has the address, phone number and opening times. The practice maintains it, but it can be out of date.
2. **Old website.** Ask for their old web address. If the site is down, try the Internet Archive copy: fetch `https://web.archive.org/web/2026/<old address>`. Use it for the practice description, team, services, registration area and policies.
3. If you cannot reach either website (cloud workspaces often have limited internet access), ask the person to paste the text they have instead.
4. **Confirm.** Show the person a short summary of what you found, grouped as: contact details, opening times, team, services. Ask them to correct anything. Opening times and staff change often, so ask about them specifically.

See `references/fields.md` for what each item means and where people can find it. **Done when** the person has confirmed every item you plan to use.

## Step 3: Fill in the practice details

1. Edit `practice/practice.yaml`, keeping its comments and structure.
2. Set `demo: false`.
3. Replace every demo value with the confirmed real information. Remove anything you could not confirm that is optional.
4. Set `site.url` to the address the site will have. In the practice's GitHub copy this is `https://<account>.github.io/<repository>/` until they have their own web address.
5. Delete the demo page `practice/pages/fit-notes.md` unless the person wants a fit notes page; if they do, ask them to check its wording.
6. **Privacy notice:** put their real privacy notice in `practice/pages/privacy-notice.md`. Ask them to paste or attach it; most practices get it from their Data Protection Officer or ICB. Do not write one from scratch. If they cannot find it today, write a short holding page that says the full privacy notice is available from the practice on request, with the phone number, and tell them to ask their Data Protection Officer for the full version.
7. Extra pages (for example travel vaccinations) can be added as Markdown files in `practice/pages/`. Only use wording the person gives you or links to nhs.uk.

Only edit files in `practice/`. **Done when** no demo value (Fernmoor, Exampleton, 01632, example.com) remains anywhere in `practice/`.

## Step 4: Check

Run `npm run check`. It lists every problem in plain English.

For each problem, either fix it from information you already have, or ask the person. Do not guess to make the check pass. Repeat until there are no problems. Then run `npm test` and `npm run build`. Mention any warnings to the person. **Done when** the check reports no problems and the tests and build pass.

## Step 5: Preview and sign-off

1. If you can run a browser, serve the `_site` folder and take screenshots of the home, appointments, opening times, contact and about pages, on a desktop and a phone-sized screen. Show them to the person.
2. If you cannot take screenshots, show the person, as text, exactly what patients will see for: the phone number and hours, opening times for every day, every address, the online form link, and the team list.
3. Go through `references/sign-off-checklist.md` item by item. Ask them to test that the phone number and online form link are right.
4. Fix anything they want changed, then check and preview again.

**Done when** the person has said yes to every checklist item. Record who signed off and when in your reply.

## Step 6: Publish

- **In the practice's GitHub copy:** follow "Publishing" in `references/github-fork.md`.
- **Otherwise:** read `references/publishing.md` and help the person choose a route. For most practices, the drag-and-drop route is the quickest.

You cannot create accounts or sign in for them. Guide them, and ask them to tell you when each step is done. **Done when** the person has opened the live site on their own phone and confirmed the phone number and online form link work.

## Step 7: Web address

Read `references/domains.md`. Work out which situation they are in, then help them:

- write the email to their ICB or domain provider (there is a template in the reference)
- set `site.url` to the new web address (and `site.custom_domain` for GitHub Pages), then check and publish again

While the web address is being sorted out, the site works at the free address the host gives them.

## Step 8: Tell patients and the NHS

Remind the person to:

- update the website link on their NHS.UK profile
- update their Google Business Profile, social media and phone message if they mention the old site
- tell their ICB and Primary Care Network that the site is back

## Making changes later

When someone comes back to change their site (for example new opening hours or a new GP):

1. Work in their copy of the project: their GitHub copy, or the project zip they saved.
2. Make only the change they asked for in `practice/practice.yaml` or `practice/pages/`.
3. Run `npm run check`, `npm test` and `npm run build`, and show them the changed page (screenshot or text).
4. Only update `site.content_last_reviewed` if they confirm they have checked the whole site is still correct.
5. Publish the same way as before.

## If something goes wrong

- If the check or build fails in a way you cannot fix from the practice details, do not edit the template to get around it. Tell the person, and suggest they report it on the template's issues page: https://github.com/pacharanero/open-gp-practice-website/issues
- If the person asks for something the template cannot do safely (such as a contact form, or removing the urgent help section), explain why in one or two sentences and offer the safe alternative.
