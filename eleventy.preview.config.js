// SPDX-FileCopyrightText: 2026 Marcus Baw
// SPDX-License-Identifier: MIT

import { configureSite } from "./eleventy.config.js";

export default function (eleventyConfig) {
  eleventyConfig.addTemplate(
    "preview-headers.njk",
    "/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Cache-Control: public, max-age=0, must-revalidate, no-transform\n",
    { permalink: "/_headers", eleventyExcludeFromCollections: true },
  );
  eleventyConfig.addTemplate("preview-robots.njk", "User-agent: *\nDisallow: /\n", {
    permalink: "/robots.txt",
    eleventyExcludeFromCollections: true,
  });
  return {
    ...configureSite(eleventyConfig, { draftPreview: true }),
    pathPrefix: "/",
    dir: { input: "src", includes: "_includes", output: "_preview" },
  };
}
