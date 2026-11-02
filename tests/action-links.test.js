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
      const doc = parse(fs.readFileSync(path.join(output, "appointments/index.html"), "utf8"));
      const links = descendants(doc, "a").filter((a) =>
        attr(a, "class")?.split(/\s+/).includes("nhsuk-action-link"),
      );
      assert.equal(links.length, 2);
      for (const link of links) {
        const icons = descendants(link, "svg");
        assert.equal(icons.length, 1);
        assert.equal(icons[0].namespaceURI, svgNamespace);
        assert.equal(attr(icons[0], "viewBox"), "0 0 24 24");
        const paths = descendants(icons[0], "path");
        assert.equal(paths.length, 1, "official path must be a descendant of its SVG");
        assert.equal(paths[0].namespaceURI, svgNamespace);
        assert.equal(attr(paths[0], "d"), officialPath);
        assert.notEqual(link.parentNode.tagName, "p", "action link remains a complete HTML block");
      }
      for (const p of descendants(doc, "path")) {
        assert.equal(p.namespaceURI, svgNamespace, "no orphan HTML-namespace paths");
        assert.equal(p.parentNode.tagName, "svg");
      }
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
}
