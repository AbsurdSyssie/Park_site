// SPDX-FileCopyrightText: 2026 Marcus Baw
// SPDX-License-Identifier: MIT

import path from "node:path";
import fs from "node:fs";
import nunjucks from "nunjucks";
import { HtmlBasePlugin } from "@11ty/eleventy";
import {
  loadPractice,
  formatProblems,
  validatePractice,
  normalisePractice,
} from "./lib/practice.js";
import * as filters from "./lib/filters.js";

const NHSUK_DIST = "node_modules/nhsuk-frontend/dist";

export default function (eleventyConfig) {
  return configureSite(eleventyConfig);
}

export function configureSite(eleventyConfig, { draftPreview = false } = {}) {
  const practiceDir = path.resolve(process.env.PRACTICE_DIR ?? "practice");
  const result = loadPractice(practiceDir);
  const suppressEarnings =
    draftPreview &&
    (result.data.gp_earnings?.financial_year == null ||
      String(result.data.gp_earnings.financial_year).trim() === "");
  if (suppressEarnings) {
    // H7: an unknown declaration is omitted, never filled with guessed figures.
    const previewData = { ...result.data };
    delete previewData.gp_earnings;
    Object.assign(result, validatePractice(previewData, { pages: result.pages }));
    result.practice = normalisePractice(previewData);
  }
  const deferred = draftPreview
    ? result.errors.filter((error) => {
        const fields = {
          ...(suppressEarnings ? { gp_earnings: undefined } : {}),
          "site.content_last_reviewed": result.data.site?.content_last_reviewed,
        };
        return (
          Object.hasOwn(fields, error.field) &&
          (fields[error.field] == null || String(fields[error.field]).trim() === "")
        );
      })
    : [];
  const blockingErrors = result.errors.filter((error) => !deferred.includes(error));

  // Stop the build if anything patients rely on is missing or wrong.
  const report = formatProblems(result);
  if (blockingErrors.length) {
    throw new Error(`\n${report}\n\nRun "npm run check" for this list again.`);
  }
  if (report) console.warn(report);

  eleventyConfig.addGlobalData("draftPreview", draftPreview);

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
    {
      const renderActionLink = (text, href) => {
        const html = env.renderString(
          `{% from "nhsuk/components/action-link/macro.njk" import actionLink %}{{ actionLink({ text: ${JSON.stringify(text)}, href: ${JSON.stringify(href)} }) }}`,
        );
        // Markdown ends raw HTML blocks at blank lines. The official macro has
        // blank lines inside its SVG: keep it in one uninterrupted div block so
        // Markdown cannot split the SVG or wrap its path in a paragraph.
        return `<div>\n${html.trim().replace(/\n\s*\n/g, "\n")}\n</div>`;
      };
      const serviceActions = {
        index: [["HOME", "Request an appointment or admin help", "/appointments/"]],
        "fit-notes": [["FIT_NOTE", "Request a fit note", "https://florey.accurx.com/p/P84045"]],
        prescriptions: [
          [
            "PRESCRIPTION",
            "Order repeat prescriptions using the NHS App",
            "https://www.nhs.uk/nhs-app/",
          ],
          [
            "MEDICATION",
            "Send a medication query",
            "https://accurx.nhs.uk/patient-initiated/p84045",
          ],
        ],
        "test-results": [
          ["RESULTS", "View results in the NHS App", "https://www.nhs.uk/nhs-app/"],
          [
            "RESULTS_ADMIN",
            "Send an online admin request",
            "https://accurx.nhs.uk/patient-initiated/p84045",
          ],
        ],
      };
      for (const [token, text, href] of serviceActions[page.slug] ?? []) {
        page.content = page.content.replaceAll(
          `{{OFFICIAL_${token}_ACTION_LINK}}`,
          renderActionLink(text, href),
        );
      }
      if (page.slug === "appointments") {
        page.content = page.content
          .replace(
            "{{OFFICIAL_APPOINTMENT_ACTION_LINK}}",
            renderActionLink(
              "Request an appointment",
              "https://accurx.nhs.uk/patient-initiated/p84045",
            ),
          )
          .replace(
            "{{OFFICIAL_ADMIN_ACTION_LINK}}",
            renderActionLink(
              "Send an admin request",
              "https://accurx.nhs.uk/patient-initiated/p84045",
            ),
          );
      } else if (page.slug === "register") {
        page.content = page.content.replace(
          "{{OFFICIAL_REGISTER_ACTION_LINK}}",
          renderActionLink("Register with The Park", "https://gp-registration.nhs.uk/P84045"),
        );
      }
    }
    // Preview content overrides journeys, never the urgent safety partial.
    const replaceable = [
      "index",
      "appointments",
      "prescriptions",
      "test-results",
      "contact",
      "register",
      "our-team",
      "services",
      "news",
      "complaints",
      "accessibility-statement",
      "opening-times",
      "cookies",
      "about",
    ];
    if (draftPreview && replaceable.includes(page.slug))
      eleventyConfig.ignores.add(`src/${page.slug}.njk`);
    eleventyConfig.addTemplate(`practice-pages/${page.slug}.md`, page.content, {
      layout: page.slug === "index" && draftPreview ? "base.njk" : "page.njk",
      permalink: page.slug === "index" && draftPreview ? "/" : `/${page.slug}/`,
    });
  }

  const customDomain = result.practice.site?.custom_domain;
  if (customDomain && !draftPreview) {
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
  // https://pacharanero.github.io/open-gp-practice-website/
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
