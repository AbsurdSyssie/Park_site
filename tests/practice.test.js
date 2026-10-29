// SPDX-FileCopyrightText: 2026 Marcus Baw
// SPDX-License-Identifier: MIT

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  readPracticeFile,
  listPages,
  validatePractice,
  normalisePractice,
  embedHosts,
} from "../lib/practice.js";

const TODAY = new Date("2026-10-28T12:00:00Z");
// A frozen copy of the Riverbend demo, so these tests keep passing after a
// practice replaces the details in practice/ with its own.
const DEMO = "tests/fixtures/demo-practice";
const demoData = () => structuredClone(readPracticeFile(DEMO));
const demoPages = listPages(DEMO);

function check(data, pages = demoPages) {
  return validatePractice(data, { pages, today: TODAY });
}

function fields(problems) {
  return problems.map((p) => p.field);
}

test("the demo practice passes with only the demo warning", () => {
  const { errors, warnings } = check(demoData());
  assert.deepEqual(errors, []);
  assert.deepEqual(fields(warnings), ["demo"]);
});

test("the Wales test practice passes without CQC or GP earnings", () => {
  const dir = "tests/fixtures/wales-practice";
  const { errors } = validatePractice(readPracticeFile(dir), {
    pages: listPages(dir),
    today: TODAY,
  });
  assert.deepEqual(errors, []);
});

test("a missing phone number is an error", () => {
  const data = demoData();
  delete data.contact.phone;
  assert.ok(fields(check(data).errors).includes("contact.phone"));
});

test("a phone number that is not a UK number is an error", () => {
  const data = demoData();
  data.contact.phone = "555 1234";
  assert.ok(fields(check(data).errors).includes("contact.phone"));
});

test("an ODS code in the wrong format is an error", () => {
  const data = demoData();
  data.practice.ods_code = "riverbend";
  assert.ok(fields(check(data).errors).includes("practice.ods_code"));
});

test("an unsupported nation is an error", () => {
  const data = demoData();
  data.practice.nation = "scotland";
  assert.ok(fields(check(data).errors).includes("practice.nation"));
});

test("every day of the week needs opening hours or closed", () => {
  const data = demoData();
  delete data.opening_hours.wednesday;
  assert.ok(fields(check(data).errors).includes("opening_hours.wednesday"));
});

test("opening times must be valid and in order", () => {
  const data = demoData();
  data.opening_hours.monday = [{ opens: "18:30", closes: "08:00" }];
  data.opening_hours.tuesday = [{ opens: "8am", closes: "6pm" }];
  const errors = fields(check(data).errors);
  assert.ok(errors.includes("opening_hours.monday[0]"));
  assert.ok(errors.includes("opening_hours.tuesday[0]"));
});

test("the online consultation link is required and must use https", () => {
  const data = demoData();
  data.online_services.online_consultation.url = "http://example.com/form";
  assert.ok(fields(check(data).errors).includes("online_services.online_consultation.url"));
  delete data.online_services.online_consultation;
  assert.ok(fields(check(data).errors).includes("online_services.online_consultation"));
});

test("embed code from an unknown website is an error", () => {
  const data = demoData();
  data.online_services.online_consultation.embed_html =
    '<script src="https://evil.example/steal.js"></script>';
  const { errors } = check(data);
  const embedError = errors.find(
    (e) => e.field === "online_services.online_consultation.embed_html",
  );
  assert.ok(embedError);
  assert.match(embedError.message, /evil\.example/);
});

test("embed code from a known provider, or an added domain, is allowed", () => {
  const data = demoData();
  data.online_services.online_consultation.embed_html =
    '<iframe src="https://forms.patchs.ai/practice/1"></iframe>';
  data.cqc.embed_html = '<script src="https://supplier.example/cqc.js"></script>';
  data.trusted_embed_domains = ["supplier.example"];
  assert.deepEqual(check(data).errors, []);
});

test("practices in England must publish CQC rating and GP earnings", () => {
  const data = demoData();
  delete data.cqc;
  delete data.gp_earnings;
  const errors = fields(check(data).errors);
  assert.ok(errors.includes("cqc"));
  assert.ok(errors.includes("gp_earnings"));
});

test("GP earnings figures must be numbers", () => {
  const data = demoData();
  data.gp_earnings.mean_earnings = "about 80k";
  data.gp_earnings.locum_gps = -1;
  const errors = fields(check(data).errors);
  assert.ok(errors.includes("gp_earnings.mean_earnings"));
  assert.ok(errors.includes("gp_earnings.locum_gps"));
});

test("the privacy notice page is required", () => {
  const pages = demoPages.filter((p) => p.slug !== "privacy-notice");
  assert.ok(fields(check(demoData(), pages).errors).includes("pages/privacy-notice.md"));
});

test("placeholder text anywhere stops the build", () => {
  const data = demoData();
  data.contact.phone_hours = "TBC";
  data.team[0].people[0].details = "todo: check with Amara";
  const errors = fields(check(data).errors);
  assert.ok(errors.includes("contact.phone_hours"));
  assert.ok(errors.includes("team[0].people[0].details"));
});

test("placeholder text in a page stops the build", () => {
  const pages = [
    ...demoPages,
    { slug: "travel", content: "---\ntitle: Travel\n---\nTODO write this" },
  ];
  assert.ok(fields(check(demoData(), pages).errors).includes("pages/travel.md"));
});

test("content not reviewed for over 6 months gives a warning", () => {
  const data = demoData();
  data.site.content_last_reviewed = "2026-01-01";
  assert.ok(fields(check(data).warnings).includes("site.content_last_reviewed"));
});

test("past closures and expired notices give warnings", () => {
  const data = demoData();
  data.closures.push({ date: "2026-01-01", reason: "New Year's Day" });
  data.notices.push({ title: "Old", text: "Old notice", expires: "2026-02-01" });
  const warnings = fields(check(data).warnings);
  assert.ok(warnings.includes(`closures[${data.closures.length - 1}]`));
  assert.ok(warnings.includes(`notices[${data.notices.length - 1}]`));
});

test("normalising hides expired notices and past closures", () => {
  const data = demoData();
  data.closures.push({ date: "2026-01-01", reason: "Past" });
  data.notices.push({ title: "Old", expires: "2026-02-01" });
  const practice = normalisePractice(data, { today: TODAY });
  assert.ok(practice.upcoming_closures.every((c) => c.date >= "2026-10-28"));
  assert.ok(practice.active_notices.every((n) => n.title !== "Old"));
});

test("normalising sets nation specific links and a phone link", () => {
  const england = normalisePractice(demoData(), { today: TODAY });
  assert.equal(england.urgent.nhs111_url, "https://111.nhs.uk/");
  assert.equal(england.phone_link, "tel:+441632960000");

  const data = demoData();
  data.practice.nation = "wales";
  const wales = normalisePractice(data, { today: TODAY });
  assert.equal(wales.urgent.nhs111_url, "https://111.wales.nhs.uk/");
  assert.equal(wales.nhs_app_link.name, "NHS Wales App");
});

test("embedHosts finds every external host in embed code", () => {
  const html = `
    <script src="https://a.example/x.js"></script>
    <iframe title="form" src='//b.example/form'></iframe>
    <link rel="stylesheet" href="https://c.example/s.css">
    <img src="/local.png" alt="">`;
  assert.deepEqual(embedHosts(html).sort(), ["a.example", "b.example", "c.example"]);
});
