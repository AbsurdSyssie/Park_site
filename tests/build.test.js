// SPDX-FileCopyrightText: 2026 Marcus Baw
// SPDX-License-Identifier: MIT

// Builds the site from the practice's own details in practice/, the frozen
// demo practice and a Wales test practice, then checks the output. Tests that
// use "site" must pass for any valid practice, because practices run them on
// their own copy before publishing. These tests protect the clinical safety controls described
// in docs/clinical-safety/hazard-log.md.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Eleventy from "@11ty/eleventy";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "practice-build-"));

async function build(practiceDir, name) {
  const output = path.join(tmp, name);
  process.env.PRACTICE_DIR = practiceDir;
  const elev = new Eleventy("src", output, {
    configPath: "eleventy.config.js",
    quietMode: true,
  });
  await elev.write();
  delete process.env.PRACTICE_DIR;
  return output;
}

function htmlFiles(dir) {
  return fs
    .readdirSync(dir, { recursive: true })
    .filter((f) => f.endsWith(".html"))
    .map((f) => path.join(dir, f));
}

const read = (dir, file) => fs.readFileSync(path.join(dir, file), "utf8");

let site;
let demo;
let wales;

before(async () => {
  const warn = console.warn;
  console.warn = () => {};
  try {
    site = await build("practice", "site");
    demo = await build("tests/fixtures/demo-practice", "demo");
    wales = await build("tests/fixtures/wales-practice", "wales");
  } finally {
    console.warn = warn;
  }
});

after(() => fs.rmSync(tmp, { recursive: true, force: true }));

test("every page shows 999 and 111 urgent help (hazard H1)", () => {
  for (const dir of [site, demo, wales]) {
    const files = htmlFiles(dir);
    assert.ok(files.length > 10);
    for (const file of files) {
      const html = fs.readFileSync(file, "utf8");
      assert.match(html, /data-safety="urgent-help"/, `${file} is missing urgent help`);
      assert.match(html, /href="tel:999"/, `${file} is missing 999`);
      assert.match(html, /href="tel:111"/, `${file} is missing 111`);
    }
  }
});

test("urgent help links to the right 111 service for the nation", () => {
  assert.match(read(demo, "index.html"), /https:\/\/111\.nhs\.uk\//);
  assert.match(read(wales, "index.html"), /https:\/\/111\.wales\.nhs\.uk\//);
  assert.doesNotMatch(read(wales, "index.html"), /https:\/\/111\.nhs\.uk\//);
});

test("all standard pages are built", () => {
  for (const page of [
    "index.html",
    "appointments/index.html",
    "prescriptions/index.html",
    "test-results/index.html",
    "opening-times/index.html",
    "contact/index.html",
    "register/index.html",
    "our-team/index.html",
    "services/index.html",
    "news/index.html",
    "about/index.html",
    "urgent-help/index.html",
    "complaints/index.html",
    "accessibility-statement/index.html",
    "cookies/index.html",
    "privacy-notice/index.html",
    "404.html",
  ]) {
    assert.ok(fs.existsSync(path.join(site, page)), `${page} was not built`);
  }
});

test("NHS.UK frontend assets are copied", () => {
  for (const asset of [
    "assets/nhsuk-frontend.min.css",
    "assets/nhsuk-frontend.min.js",
    "assets/init.js",
    "assets/practice.css",
    "assets/images/favicon.svg",
  ]) {
    assert.ok(fs.existsSync(path.join(site, asset)), `${asset} is missing`);
  }
});

test("NHS.UK frontend macros render as HTML, not escaped text", () => {
  const html = read(site, "index.html");
  assert.match(html, /<header class="nhsuk-header/);
  assert.doesNotMatch(html, /&lt;div class=/);
});

test("the demo site is labelled and hidden from search engines", () => {
  const html = read(demo, "index.html");
  assert.match(html, /demonstration website for a fictional GP practice/);
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.doesNotMatch(read(wales, "index.html"), /fictional GP practice/);
});

test("the online consultation link and phone number are on the appointments page", () => {
  const html = read(demo, "appointments/index.html");
  assert.match(html, /href="https:\/\/example\.com\/fernmoor-online-consultation"/);
  assert.match(html, /href="tel:\+441632960000"/);
});

test("embed code is included as given", () => {
  assert.match(
    read(wales, "appointments/index.html"),
    /<script src="https:\/\/widget\.klinik\.co\.uk\/embed\.js"><\/script>/,
  );
});

test("England sites show CQC and GP earnings; Wales sites show HIW instead", () => {
  const england = read(demo, "about/index.html");
  assert.match(england, /cqc\.org\.uk\/location\/1-000000000/);
  assert.match(england, /£82,000 before tax and National Insurance/);
  const welsh = read(wales, "about/index.html");
  assert.match(welsh, /Healthcare Inspectorate Wales/);
  assert.doesNotMatch(welsh, /GP earnings/);
});

test("opening times are written in NHS style", () => {
  const html = read(demo, "opening-times/index.html");
  assert.match(html, /8am to 6:30pm/);
  assert.match(html, /7:30am to 6:30pm/);
  assert.match(html, /Saturday<\/th>\s*<td class="nhsuk-table__cell">\s*Closed/);
});

test("extra Markdown pages are built and linked from the services page", () => {
  assert.match(read(demo, "fit-notes/index.html"), /<h1>Fit notes<\/h1>/);
  assert.match(read(demo, "services/index.html"), /href="\/fit-notes\/">Fit notes</);
});

test("the accessibility statement names the practice and contact details", () => {
  const html = read(demo, "accessibility-statement/index.html");
  assert.match(html, /applies to the Fernmoor Medical Practice website/);
  assert.match(html, /01632\u00a0960000/);
});

test("Wales complaints point to Putting Things Right and the Welsh ombudsman", () => {
  const html = read(wales, "complaints/index.html");
  assert.match(html, /Putting Things Right/);
  assert.match(html, /ombudsman\.wales/);
});

test("the appointments page warns against using the form in an emergency (hazard H5)", () => {
  const html = read(demo, "appointments/index.html");
  assert.match(html, /nhsuk-card--care--emergency/);
  assert.match(html, /Do not use our online form/);
});
