// SPDX-FileCopyrightText: 2026 Marcus Baw
// SPDX-License-Identifier: MIT

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Eleventy from "@11ty/eleventy";
import { load, dump } from "js-yaml";

test("sitemap and robots output follow the indexing opt-in and path prefix", async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "seo-build-"));
  const practice = path.join(tmp, "practice");
  fs.cpSync("tests/fixtures/demo-practice", practice, { recursive: true });
  const configFile = path.join(practice, "practice.yaml");
  const data = load(fs.readFileSync(configFile, "utf8"));
  data.demo = false;
  data.site.url = "https://example.test/park/";
  data.site.search_indexing = true;
  fs.writeFileSync(configFile, dump(data));

  const oldPracticeDir = process.env.PRACTICE_DIR;
  const oldPathPrefix = process.env.PATH_PREFIX;
  process.env.PRACTICE_DIR = practice;
  process.env.PATH_PREFIX = "/park/";
  try {
    const output = path.join(tmp, "output");
    const eleventy = new Eleventy("src", output, {
      configPath: "eleventy.config.js",
      quietMode: true,
    });
    await eleventy.write();
    const sitemap = fs.readFileSync(path.join(output, "sitemap.xml"), "utf8");
    const actualUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    const expectedUrls = fs
      .readdirSync(output, { recursive: true })
      .filter((file) => file.endsWith(".html") && file !== "404.html")
      .map((file) => {
        const route = String(file).replaceAll(path.sep, "/");
        const urlPath = route === "index.html" ? "" : route.replace(/\/index\.html$/, "/");
        return `https://example.test/park/${urlPath}`;
      })
      .sort();
    assert.deepEqual(actualUrls, expectedUrls);
    assert.doesNotMatch(sitemap, /404\.html/);
    assert.equal(fs.existsSync(path.join(output, "robots.txt")), false);
    const homeHtml = fs.readFileSync(path.join(output, "index.html"), "utf8");
    assert.match(homeHtml, /<link rel="canonical" href="https:\/\/example\.test\/park\/">/);

    data.site.url = "https://example.test/";
    fs.writeFileSync(configFile, dump(data));
    process.env.PATH_PREFIX = "/";
    const rootOutput = path.join(tmp, "root");
    const rootBuild = new Eleventy("src", rootOutput, {
      configPath: "eleventy.config.js",
      quietMode: true,
    });
    await rootBuild.write();
    const rootRobots = fs.readFileSync(path.join(rootOutput, "robots.txt"), "utf8");
    assert.match(rootRobots, /Sitemap: https:\/\/example\.test\/sitemap\.xml/);
    assert.ok(fs.existsSync(path.join(rootOutput, "sitemap.xml")));
    process.env.PATH_PREFIX = "/park/";

    data.site.search_indexing = false;
    fs.writeFileSync(configFile, dump(data));
    const disabled = new Eleventy("src", rootOutput, {
      configPath: "eleventy.config.js",
      quietMode: true,
    });
    await disabled.write();
    assert.equal(fs.existsSync(path.join(rootOutput, "sitemap.xml")), false);
    assert.equal(fs.existsSync(path.join(rootOutput, "robots.txt")), false);
    const disabledHome = fs.readFileSync(path.join(rootOutput, "index.html"), "utf8");
    assert.match(disabledHome, /<meta name="robots" content="noindex">/);
    assert.doesNotMatch(disabledHome, /rel="canonical"/);

    delete data.site.url;
    data.site.search_indexing = true;
    fs.writeFileSync(configFile, dump(data));
    const missingUrlOutput = path.join(tmp, "missing-url");
    const missingUrl = new Eleventy("src", missingUrlOutput, {
      configPath: "eleventy.config.js",
      quietMode: true,
    });
    await missingUrl.write();
    assert.equal(fs.existsSync(path.join(missingUrlOutput, "sitemap.xml")), false);
    assert.equal(fs.existsSync(path.join(missingUrlOutput, "robots.txt")), false);
  } finally {
    if (oldPracticeDir === undefined) delete process.env.PRACTICE_DIR;
    else process.env.PRACTICE_DIR = oldPracticeDir;
    if (oldPathPrefix === undefined) delete process.env.PATH_PREFIX;
    else process.env.PATH_PREFIX = oldPathPrefix;
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
