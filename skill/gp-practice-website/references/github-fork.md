# Working in the practice's own copy on GitHub

This is the recommended route. The practice has its own GitHub account and its own copy (a "fork") of the template. You, the assistant, work on that copy in the cloud. Publishing happens automatically on GitHub whenever the practice approves a change, so nobody at the practice needs any software on their computer.

## Making the practice's copy

The step-by-step clicks are in the template README, under "Set up your practice's website", steps 1 to 4: https://github.com/pacharanero/open-gp-practice-website#set-up-your-practices-website

Walk the person through them one at a time and ask what they see after each. Check especially that:

- the GitHub account uses a shared practice email address, not a personal one (safety rule 7)
- they turned on two-factor authentication and saved the recovery codes with the practice's other important passwords
- they renamed their copy to something like `fernmoor-surgery-website`
- they switched on Actions in their copy, and set Settings > Pages > Source to "GitHub Actions"
- they installed the Claude GitHub App with access to their copy when using Claude Code on the web

## Checks for an existing copy

Before gathering details, confirm the account belongs to the practice and uses its shared email address. Ask the person to open their copy's **Actions** tab and enable workflows if prompted, then check **Settings > Pages > Build and deployment > Source** is **GitHub Actions**. Confirm the copy's name with them: it forms part of the free web address. If they want to rename it, they can do so in **Settings > General**, then start a new session on the renamed copy.

For Claude Code on the web, confirm the Claude GitHub App is installed and has access to this copy. Before collecting practice details, if your environment permits pushing, push an empty working branch to the practice's copy to check access. If the push fails or your environment does not permit this test, tell the person and help them check the app's repository access; do not claim access is confirmed. Never merge an access test or publish practice content before sign-off.

## Publishing

1. Commit your changes with a short plain-English message, for example "Add Fernmoor opening times and contact details". Only `practice/` files should have changed; if anything else has, undo it.
2. Push your branch to the practice's copy.
3. Open a pull request (a proposed change) **into the practice's own copy**. The target must be `<their account>/<their repository>`, branch `main`. Never open a pull request, issue or comment on `pacharanero/open-gp-practice-website` that contains practice details. If your tools default to the template, change the target, or ask the person to check that the page they see says their own account name on both sides.
4. Ask the person to open the pull request, read your summary, and click **Merge pull request**, then **Confirm merge**. Merging is the moment the site is published, so only ask after sign-off (Step 5 of the skill).
   - For testers: merging also brings the branch's earlier commits into the target's history. Use a dedicated fictional test copy.
5. Publishing takes two or three minutes. Ask the person to open the **Actions** tab of their copy and tell you whether "Publish to GitHub Pages" has a green tick.
   - Green tick: the site is live at `https://<account>.github.io/<repository>/`. Ask them to open it on their phone.
   - Red cross: ask them to click on it and copy the error text to you. "Get Pages site failed" means Settings > Pages > Source is not set to "GitHub Actions"; once fixed, they can click **Re-run all jobs**. A failure in "Check practice details" lists the problem in plain English; fix it in `practice/` and repeat from step 1.
   - No publishing run: ask them to enable workflows in **Actions**, then select **Publish to GitHub Pages > Run workflow** and confirm **Run workflow**. Check for the green tick before opening the site.

## Taking the site offline

If the practice needs to remove the site urgently, ask them to open their copy's **Settings > Pages**, choose **Unpublish site** from the menu and confirm. Check the public address afterwards. Correct the information and follow the publishing and sign-off steps before restoring it. If a custom domain or another host is in use, check that address too; unpublishing GitHub Pages does not remove copies hosted elsewhere.

## Their own web address

For their own address, follow `references/domains.md`: it covers who to ask, the order of the GitHub and address changes, a ready-to-send request and checks after the move.

## Taking template updates

When the template improves (for example a new version of the NHS design), the practice's copy shows "This branch is X commits behind pacharanero/open-gp-practice-website:main".

1. Ask them to click **Sync fork**, then **Update branch**. This publishes the update automatically.
2. If GitHub says there are conflicts, ask them not to discard anything. Tell them to report it on the template's issues page, without including any practice details beyond the practice name.
3. Afterwards, check the Actions tab has a green tick and the site still looks right.
