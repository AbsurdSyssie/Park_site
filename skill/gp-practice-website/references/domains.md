# Getting the practice's web address working

The site works straight away at the free address the host provides. Pointing the practice's own web address at it is a separate step, and often needs someone else's help. Work out which situation the person is in.

## 1. The address ends in nhs.uk

Most practice addresses ending in nhs.uk are managed by the ICB's IT team or their commissioning support unit, not by the practice. The person needs to email them and ask for the address to be pointed at the new host.

First, the person adds their nhs.uk address as a custom domain in their hosting account (Netlify, Cloudflare or GitHub). The host will show what record is needed, usually a CNAME record pointing to the free address. Ask the person to tell you exactly what the host shows, then draft the email below.

## 2. The practice registered the address itself

The practice (or a partner) has an account with a domain registrar, such as 123 Reg, GoDaddy or IONOS. The person signs in there and changes the DNS records as their host instructs. Guide them step by step, and ask what they see.

## 3. The old supplier registered the address

If the old supplier registered the address in its own name and has gone out of business, the address may be held by the company's administrators. The person should:

1. tell their ICB, which may be coordinating this for several practices
2. contact the administrators to ask for the address to be transferred to the practice
3. use the free address in the meantime, and update their NHS.UK profile to point to it

## Email template for the ICB

Fill in the parts in square brackets with real details. Do not send it with anything left in brackets.

> Subject: DNS change needed for [practice name] ([ODS code]) website
>
> Hello,
>
> Our previous website supplier has stopped providing our website. We have set up a replacement website and need our web address, [web address], to point to it.
>
> Please add or change this DNS record:
>
> - Type: [record type, for example CNAME]
> - Name: [name, for example www]
> - Value: [value, for example riverbend-medical.netlify.app]
>
> The new website is already live at [free address] if you would like to check it first.
>
> The website is a simple information site. It does not collect or store any patient information. Patients contact us through [online consultation provider] and by phone, as before.
>
> Thank you,
> [name, role, practice name, phone number]

## After the address is working

- Set `site.url` to the new address and rebuild. For GitHub Pages, also set `site.custom_domain`.
- Check the site loads at the address, with and without `www` if both are used.
- Most hosts set up a security certificate (the padlock) automatically. It can take up to a day.
