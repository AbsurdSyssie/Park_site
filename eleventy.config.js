// SPDX-FileCopyrightText: 2026 Marcus Baw
// SPDX-License-Identifier: MIT

import path from "node:path";
import fs from "node:fs";
import nunjucks from "nunjucks";
import { HtmlBasePlugin } from "@11ty/eleventy";
import { loadPractice, formatProblems } from "./lib/practice.js";
import * as filters from "./lib/filters.js";

const NHSUK_DIST = "node_modules/nhsuk-frontend/dist";

export default function (eleventyConfig) {
  const practiceDir = path.resolve(process.env.PRACTICE_DIR ?? "practice");
  const result = loadPractice(practiceDir);

  // Stop the build if anything patients rely on is missing or wrong.
  const report = formatProblems(result);
  if (result.errors.length) {
    throw new Error(`\n${report}\n\nRun "npm run check" for this list again.`);
  }
  if (report) console.warn(report);

  eleventyConfig.addGlobalData("practice", result.practice);
  eleventyConfig.addGlobalData(
    "practicePages",
    result.pages.map((p) => p.slug),
  );

  // Templates can use NHS.UK frontend macros directly, for example:
  // {% from "nhsuk/components/card/macro.njk" import card %}
  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(["src/_includes", NHSUK_DIST]),
  );
  eleventyConfig.setLibrary("njk", env);

  for (const [name, fn] of Object.entries(filters)) {
    eleventyConfig.addFilter(name, fn);
  }

  // Each Markdown file in practice/pages becomes a page at /<file-name>/
  for (const page of result.pages) {
    eleventyConfig.addTemplate(`practice-pages/${page.slug}.md`, page.content, {
      layout: "page.njk",
      permalink: `/${page.slug}/`,
    });
  }

  const customDomain = result.practice.site?.custom_domain;
  if (customDomain) {
    eleventyConfig.addTemplate("cname.njk", customDomain, {
      permalink: "/CNAME",
      eleventyExcludeFromCollections: true,
    });
  }

  eleventyConfig.addPassthroughCopy({
    [`${NHSUK_DIST}/nhsuk/nhsuk-frontend.min.css`]: "assets/nhsuk-frontend.min.css",
    [`${NHSUK_DIST}/nhsuk/nhsuk-frontend.min.js`]: "assets/nhsuk-frontend.min.js",
    [`${NHSUK_DIST}/nhsuk/assets`]: "assets",
    "src/assets": "assets",
  });
  const imagesDir = path.join(practiceDir, "images");
  if (fs.existsSync(imagesDir)) {
    eleventyConfig.addPassthroughCopy({ [imagesDir]: "images" });
  }
  eleventyConfig.addWatchTarget(practiceDir);

  // Lets the same build work at a domain root or in a sub folder, such as
  // https://example.github.io/open-practice-website/
  eleventyConfig.addPlugin(HtmlBasePlugin);

  return {
    // Output defaults to _site; not set here so tests can build elsewhere.
    dir: { input: "src", includes: "_includes" },
    pathPrefix: process.env.PATH_PREFIX ?? "/",
    // Practice pages are plain Markdown; never run them as templates.
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
