# Publishing the website

The built website is a folder of plain files (`_site`). Any static hosting service can publish it. If you are working in the practice's own GitHub copy, use Route C. Otherwise, help the person choose one of these routes.

Before any route, remind the person:

- Create the account using a **shared practice email address**, not a personal one, so the practice keeps access if staff leave.
- Store the login details where the practice keeps other important passwords, and note it in the business continuity plan.
- You cannot create the account or sign in for them. They do those steps; you guide them.

Hosting services change their screens from time to time. Give the steps below, then ask the person to describe what they see if anything looks different.

## Route A: Netlify (drag and drop)

Good for: getting online fast, with no technical setup.

1. Build the site with `npm run build` and zip the contents of `_site` (the files inside it, not the folder itself). Send the zip to the person and ask them to unzip it on their computer.
2. Ask them to go to netlify.com and sign up with the shared practice email address.
3. In Netlify, they add a new site and choose the option to deploy manually, by dragging and dropping a folder.
4. They drag the unzipped folder onto the page.
5. Netlify gives the site a free address ending in `.netlify.app`. Ask them to send it to you, then check the site loads.
6. In the site settings they can change the site name, so the address reads well (for example `riverbend-medical.netlify.app`).
7. Put that address in `site.url` and rebuild, so the next upload has the right address.

To update the site later, they open the site in Netlify, go to its deploys, and drag the new folder onto it.

## Route B: Cloudflare Pages (upload)

Good for: practices that want a large, well-known provider with a free plan.

1. Send the person the zip of the contents of `_site`, as in Route A.
2. They sign up at cloudflare.com with the shared practice email address.
3. They create a new Pages project and choose to upload their files directly (not to connect to Git).
4. They give the project a name and upload the zip or the unzipped folder.
5. Cloudflare gives a free address ending in `.pages.dev`.

To update the site later, they create a new deployment in the same project and upload the new files.

## Route C: GitHub Pages

This is the recommended route for new sites, because updates need no uploads at all: the practice approves a change on GitHub and the site republishes itself. It needs the practice to have its own GitHub copy of the template. Follow `references/github-fork.md`.

## After publishing

- Visit the live site and check the home page, the online form link and the phone number.
- Give the person the live address, and remind them to keep the project zip safe.
