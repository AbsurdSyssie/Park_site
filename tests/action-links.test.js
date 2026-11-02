// SPDX-FileCopyrightText: 2026 Oscar
// SPDX-License-Identifier: MIT

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { parse } from "parse5";
import nunjucks from "nunjucks";

function descendants(node, tag) {
  return (node.childNodes ?? []).flatMap((child) => [
    ...(child.tagName === tag ? [child] : []),
    ...descendants(child, tag),
  ]);
}
const attr = (node, name) => node.attrs.find((a) => a.name === name)?.value;
const svgNamespace = "http://www.w3.org/2000/svg";
const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader("node_modules/nhsuk-frontend/dist"),
);
const official = parse(
  env.renderString(
    '{% from "nhsuk/components/action-link/macro.njk" import actionLink %}{{ actionLink({text: "Example", href: "https://example.com"}) }}',
  ),
);
const officialPath = attr(descendants(official, "path")[0], "d");

for (const fixture of ["minimal", "full"]) {
  test(`official action links survive Markdown in ${fixture} appointment content`, () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "action-links-"));
    try {
      const practice = path.join(tmp, "practice");
      fs.cpSync("tests/fixtures/demo-practice", practice, { recursive: true });
      const journeys = {
        index: ["HOME"],
        register: ["REGISTER"],
        "fit-notes": ["FIT_NOTE"],
        prescriptions: ["PRESCRIPTION", "MEDICATION"],
        "test-results": ["RESULTS", "RESULTS_ADMIN"],
      };
      for (const [slug, tokens] of Object.entries(journeys)) {
        fs.writeFileSync(
          path.join(practice, `pages/${slug}.md`),
          `---\ntitle: Example service\n---\n<div class="example">\n${tokens.map((token) => `{{OFFICIAL_${token}_ACTION_LINK}}`).join("\n\n")}\n</div>\n`,
        );
      }
      fs.writeFileSync(
        path.join(practice, "pages/appointments.md"),
        fixture === "full"
          ? fs.readFileSync("tests/fixtures/action-links/appointments.md", "utf8")
          : "---\ntitle: Appointments\n---\nBefore.\n\n{{OFFICIAL_APPOINTMENT_ACTION_LINK}}\n\nBetween.\n\n{{OFFICIAL_ADMIN_ACTION_LINK}}\n\nAfter.\n",
      );
      const output = path.join(tmp, "output");
      const build = spawnSync(
        process.execPath,
        [
          "node_modules/@11ty/eleventy/cmd.cjs",
          "--config=eleventy.preview.config.js",
          `--output=${output}`,
        ],
        { env: { ...process.env, PRACTICE_DIR: practice }, encoding: "utf8" },
      );
      assert.equal(build.status, 0, build.stderr);
      for (const [slug, count] of Object.entries({
        appointments: 2,
        ...Object.fromEntries(
          Object.entries(journeys).map(([slug, tokens]) => [slug, tokens.length]),
        ),
      })) {
        const html = fs.readFileSync(
          path.join(output, slug === "index" ? "index.html" : `${slug}/index.html`),
          "utf8",
        );
        assert.ok(!html.includes("{{OFFICIAL_"), "all action markers resolve");
        const doc = parse(html);
        const links = descendants(doc, "a").filter((a) =>
          attr(a, "class")?.split(/\s+/).includes("nhsuk-action-link"),
        );
        assert.equal(links.length, count, slug);
        if (slug === "register") {
          assert.equal(attr(links[0], "href"), "https://gp-registration.nhs.uk/P84045");
          assert.match(html, />\s*Register with The Park\s*<\/span>/);
        }
        for (const link of links) {
          const icons = descendants(link, "svg");
          assert.equal(icons.length, 1);
          assert.equal(icons[0].namespaceURI, svgNamespace);
          assert.equal(attr(icons[0], "viewBox"), "0 0 24 24");
          const paths = descendants(icons[0], "path");
          assert.equal(paths.length, 1, "official path must be a descendant of its SVG");
          assert.equal(paths[0].namespaceURI, svgNamespace);
          assert.equal(attr(paths[0], "d"), officialPath);
          assert.notEqual(
            link.parentNode.tagName,
            "p",
            "action link remains a complete HTML block",
          );
        }
        for (const p of descendants(doc, "path")) {
          assert.equal(p.namespaceURI, svgNamespace, "no orphan HTML-namespace paths");
          assert.equal(p.parentNode.tagName, "svg");
        }
      }
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
}
