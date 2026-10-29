# Getting the practice's web address working

The free address supplied by the host can get the site online while the practice arranges its usual address. Moving the address may need the ICB, the domain provider or the old supplier. The assistant can prepare the site, explain the steps and draft the request; the person with access must make the account and address changes.

## First, find who can help

Ask one question at a time:

1. What exact address should patients use, including `www` if applicable? Is it already used by an existing website or email service?
2. Who manages changes to that address? For an nhs.uk address, start with the practice's ICB IT team or commissioning support unit. If the practice bought the address itself, ask who has the domain provider account. A domain provider and the company hosting the website may be different.
3. Can that person make the change, or should we write to them? Do not ask for passwords or access to their account.

If the old supplier registered the address and the practice cannot control it, ask the ICB for help and, if appropriate, contact the supplier's administrators about transferring it. Use the free address in the meantime and update the NHS.UK profile. Do not assume the address can be recovered immediately.

## GitHub Pages: connect a www address

For the recommended GitHub route, follow these steps together. The example is fictional: replace `www.your-practice.example` and `practice-account` with the real address and the practice's GitHub account name. The person needs administrator access to their GitHub copy. Screens can change; if a label differs, ask what they see.

1. **Check the website first.** Open the free GitHub Pages address and check the practice name, phone number and online consultation link. Agree the move with the person managing the address; changing it can temporarily interrupt access.
2. **Verify ownership if possible.** GitHub recommends verifying the address with the practice's GitHub account before adding it. Follow [GitHub's verification guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages); the person managing the address may need to add a verification record. This is separate from directing visitors to the site.
3. **Tell GitHub the address before changing the address records.** In the practice's copy, ask the person to click **Settings > Pages**. Under **Custom domain**, enter the exact address, for example `www.your-practice.example` (without `https://` or a trailing slash), then click **Save**. A check may fail until the next step is completed. Do not direct the address to GitHub before it is added here.
4. **Prepare and publish the correct site.** Set `site.custom_domain` to the same hostname and `site.url` to the full address, for example `https://www.your-practice.example/`. Run the checks and follow the normal sign-off and publishing process. Check **Actions > Publish to GitHub Pages** has a green tick. This rebuild is important because the links and styles must use the new address.
5. **Ask the address manager to connect it.** For a `www` address, GitHub's documented record is a CNAME named `www` pointing to `practice-account.github.io`, using the real GitHub account name. The value has no `https://`, repository name or slash. Some providers ask for the full hostname instead of `www`. Use the email below, or guide the account holder through their provider's screens; do not remove unrelated records. If the address has conflicting existing records, ask the address manager to resolve them.
6. **Wait and check.** Address changes can take up to 24 hours. In **Settings > Pages**, check the custom-domain status. Once GitHub offers **Enforce HTTPS**, tick it; the certificate can also take up to 24 hours. Open the full `https://` address on a phone and another connection, then check the home page, another page, images, phone link and online consultation link. Investigate any browser security warning before directing patients there.
7. **Confirm both forms only if needed.** `www.your-practice.example` and `your-practice.example` are different addresses. The second does not automatically work just because the first does: ask the address manager to configure both if the practice needs both, using [GitHub's guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). Check the intended redirect. If the chosen address has no `www`, ask the address manager to follow GitHub's apex-domain instructions rather than using the `www` CNAME example.

Keep the free address available for patients while the move is arranged, but check it after changing Pages settings: GitHub may redirect it to the custom address. If the new address is not working, coordinate with the address manager and restore the previous working settings if needed; check both the Pages settings and the website's `site.url` and `site.custom_domain` before republishing. Do not promise an uninterrupted switch.

## Other hosting services

For Netlify or Cloudflare, use the host's current custom-domain instructions: first add the address in the practice's hosting account, then ask the address manager to make the exact records the host specifies. Do not use the GitHub CNAME value for another host. Update `site.url`, rebuild and upload the site again, then check the address and HTTPS as above.

## Email template for the address manager

The assistant should fill in the brackets with confirmed details, show the draft to the person and let them send it. The CNAME lines below are for a `www` address on GitHub Pages only; for other addresses or hosts, ask the address manager to use the host's instructions instead.

> Subject: Please connect [practice name] ([ODS code]) website address
>
> Hello,
>
> We have a replacement website and would like to use [full website address]. The site is hosted in our practice's GitHub Pages account. Please help us verify the address in GitHub and coordinate the change so patients can reach the new site.
>
> After the address has been added in GitHub Pages, please arrange this website record:
>
> - Type: CNAME
> - Name: www (or [full hostname], depending on your system)
> - Value: [practice GitHub account].github.io
>
> Please let us know when the change is complete, whether the address without `www` will also work, and whether any existing website records conflict. Please preserve our email and other unrelated services. We can share the GitHub ownership-verification record separately if needed.
>
> The site can currently be checked at [free website address]. Please tell us if you need any other details before making the change.
>
> Thank you,
> [name, role, practice name, phone number]

## If something goes wrong

- **GitHub says the address is already in use:** it may be associated with another GitHub Pages site. Ask the address manager to investigate; do not attempt to claim an address the practice does not control.
- **The check is failing:** confirm the exact hostname, record type and value with the address manager, then allow time for changes to spread. GitHub's [troubleshooting guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages) has further checks.
- **The site loads but links or styling are broken:** confirm the site was rebuilt and published after Pages was configured for the custom address.
- **HTTPS is unavailable or the browser warns:** allow time for the certificate, check the Pages status and ask the address manager for help. Do not tell patients to ignore security warnings.
