# Working in the practice's own copy on GitHub

This is the recommended route. The practice has its own GitHub account and its own copy (a "fork") of the template. You, the assistant, work on that copy in the cloud. Publishing happens automatically on GitHub whenever the practice approves a change, so nobody at the practice needs any software on their computer.

## Making the practice's copy

The step-by-step clicks are in the template README, under "Set up your practice's website", steps 1 to 4: https://github.com/pacharanero/open-gp-practice-website#set-up-your-practices-website

Walk the person through them one at a time and ask what they see after each. Check especially that:

- the GitHub account uses a shared practice email address, not a personal one (safety rule 7)
- they turned on two-factor authentication and saved the recovery codes with the practice's other important passwords
- they renamed their copy to something like `riverbend-surgery-website`
- they switched on Actions in their copy, and set Settings > Pages > Source to "GitHub Actions"

## Publishing

1. Commit your changes with a short plain-English message, for example "Add Riverbend opening times and contact details". Only `practice/` files should have changed; if anything else has, undo it.
2. Push your branch to the practice's copy.
3. Open a pull request (a proposed change) **into the practice's own copy**. The target must be `<their account>/<their repository>`, branch `main`. Never open a pull request, issue or comment on `pacharanero/open-gp-practice-website` that contains practice details. If your tools default to the template, change the target, or ask the person to check that the page they see says their own account name on both sides.
4. Ask the person to open the pull request, read your summary, and click **Merge pull request**, then **Confirm merge**. Merging is the moment the site is published, so only ask after sign-off (Step 5 of the skill).
5. Publishing takes two or three minutes. Ask the person to open the **Actions** tab of their copy and tell you whether "Publish to GitHub Pages" has a green tick.
   - Green tick: the site is live at `https://<account>.github.io/<repository>/`. Ask them to open it on their phone.
   - Red cross: ask them to click on it and copy the error text to you. "Get Pages site failed" means Settings > Pages > Source is not set to "GitHub Actions"; once fixed, they can click **Re-run all jobs**. A failure in "Check practice details" lists the problem in plain English; fix it in `practice/` and repeat from step 1.

## Their own web address

Their site works at the github.io address straight away. For their own address (for example `www.riverbendsurgery.nhs.uk`):

1. Set `site.custom_domain` and `site.url` in `practice/practice.yaml`, and publish.
2. Ask them to go to Settings > Pages > Custom domain in their copy, type the address and click Save. GitHub then shows whether the address is pointing at it yet.
3. The records needed are in GitHub's guide: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site. For a `www` address it is usually a CNAME record pointing to `<account>.github.io`. Use `references/domains.md` to work out who can change the records, and draft the email.
4. Once the address works, ask them to tick "Enforce HTTPS" on the same settings page.

## Taking template updates

When the template improves (for example a new version of the NHS design), the practice's copy shows "This branch is X commits behind pacharanero/open-gp-practice-website:main".

1. Ask them to click **Sync fork**, then **Update branch**. This publishes the update automatically.
2. If GitHub says there are conflicts, ask them not to discard anything. Tell them to report it on the template's issues page, without including any practice details beyond the practice name.
3. Afterwards, check the Actions tab has a green tick and the site still looks right.
