// Loads and validates the practice's details from practice/practice.yaml.
//
// The validator is deliberately strict. A GP website is how patients find out
// how to get help, so missing or wrong information is a clinical safety issue,
// not a cosmetic one. Errors stop the build. Warnings are printed but do not.

import fs from "node:fs";
import path from "node:path";
import { load, CORE_SCHEMA } from "js-yaml";

export const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const NATIONS = ["england", "wales"];

// Domains that embedded widgets (online consultation tools, CQC ratings) are
// allowed to load from without the practice adding them explicitly.
export const DEFAULT_TRUSTED_EMBED_DOMAINS = [
  "accurx.com",
  "accurx.nhs.uk",
  "klinik.co.uk",
  "klinikhealthcaresolutions.com",
  "patchs.ai",
  "econsult.net",
  "cqc.org.uk",
];

// Pages a practice must provide as Markdown in practice/pages/.
export const REQUIRED_PAGES = ["privacy-notice"];

const PLACEHOLDER_PATTERN = /\b(TODO|TBC|FIXME|XXX)\b|lorem ipsum/i;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ODS_PATTERN = /^[A-Z]\d{5}$/;
const POSTCODE_PATTERN = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;

export function readPracticeFile(practiceDir) {
  const file = path.join(practiceDir, "practice.yaml");
  if (!fs.existsSync(file)) {
    throw new Error(`Could not find ${file}`);
  }
  // CORE_SCHEMA keeps values like 08:00 and 2026-11-12 as plain text, rather
  // than turning them into numbers or dates in surprising ways.
  return load(fs.readFileSync(file, "utf8"), { schema: CORE_SCHEMA }) ?? {};
}

export function listPages(practiceDir) {
  const dir = path.join(practiceDir, "pages");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({
      slug: f.replace(/\.md$/, ""),
      file: path.join(dir, f),
      content: fs.readFileSync(path.join(dir, f), "utf8"),
    }));
}

function get(obj, dotted) {
  return dotted.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function isBlank(value) {
  return (
    value === undefined || value === null || (typeof value === "string" && value.trim() === "")
  );
}

function parseDate(value) {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

// Returns every host that an embed snippet loads a script, frame or
// stylesheet from.
export function embedHosts(html) {
  const hosts = new Set();
  const pattern =
    /<(script|iframe|link|img|embed|object)\b[^>]*?\s(?:src|href|data)\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(pattern)) {
    const url = match[2];
    if (url.startsWith("//") || /^https?:/i.test(url)) {
      try {
        hosts.add(new URL(url, "https://placeholder.invalid").hostname);
      } catch {
        hosts.add(url);
      }
    }
  }
  return [...hosts];
}

function hostIsTrusted(host, trusted) {
  return trusted.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

function walkStrings(value, at, visit) {
  if (typeof value === "string") {
    visit(value, at);
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => walkStrings(item, `${at}[${i}]`, visit));
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      walkStrings(item, at ? `${at}.${key}` : key, visit);
    }
  }
}

export function validatePractice(data, { pages = [], today = new Date() } = {}) {
  const errors = [];
  const warnings = [];
  const error = (field, message) => errors.push({ field, message });
  const warn = (field, message) => warnings.push({ field, message });

  const require = (field, description) => {
    if (isBlank(get(data, field))) {
      error(field, `Missing ${description}.`);
      return false;
    }
    return true;
  };

  // Practice identity
  require("practice.name", "the practice name");
  if (require("practice.ods_code", "the practice ODS code")) {
    if (!ODS_PATTERN.test(String(data.practice.ods_code))) {
      error(
        "practice.ods_code",
        "ODS codes for GP practices are one capital letter followed by five digits, for example B82005.",
      );
    }
  }
  const nation = get(data, "practice.nation");
  if (!NATIONS.includes(nation)) {
    error(
      "practice.nation",
      `Must be one of: ${NATIONS.join(", ")}. This decides which urgent care, complaints and regulator information is shown.`,
    );
  }

  // Contact
  if (require("contact.phone", "the main phone number")) {
    const digits = String(data.contact.phone).replace(/\D/g, "");
    if (!/^0\d{9,10}$/.test(digits)) {
      error(
        "contact.phone",
        "This does not look like a UK phone number. Write it with the leading 0, for example 01632 960000.",
      );
    }
  }
  require("contact.phone_hours", "the hours the phone lines are open");
  const email = get(data, "contact.email");
  if (!isBlank(email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    error("contact.email", "This does not look like an email address.");
  }

  // Sites
  const sites = data.sites;
  if (!Array.isArray(sites) || sites.length === 0) {
    error("sites", "Add at least one surgery building with its address.");
  } else {
    sites.forEach((site, i) => {
      if (isBlank(site?.name)) error(`sites[${i}].name`, "Missing site name.");
      if (!Array.isArray(site?.address) || site.address.length === 0) {
        error(`sites[${i}].address`, "Missing address lines.");
      }
      if (isBlank(site?.postcode)) {
        error(`sites[${i}].postcode`, "Missing postcode.");
      } else if (!POSTCODE_PATTERN.test(String(site.postcode).trim())) {
        warn(`sites[${i}].postcode`, "This does not look like a UK postcode.");
      }
    });
  }

  // Opening hours
  const hours = data.opening_hours;
  if (!hours || typeof hours !== "object") {
    error("opening_hours", "Add opening hours for every day of the week.");
  } else {
    for (const day of DAYS) {
      const value = hours[day];
      const field = `opening_hours.${day}`;
      if (value === "closed") continue;
      if (!Array.isArray(value) || value.length === 0) {
        error(field, `Add opening times for ${day}, or write: closed`);
        continue;
      }
      value.forEach((slot, i) => {
        const opens = slot?.opens;
        const closes = slot?.closes;
        if (!TIME_PATTERN.test(String(opens)) || !TIME_PATTERN.test(String(closes))) {
          error(
            `${field}[${i}]`,
            'Times must be in 24 hour format with quotes, for example opens: "08:00" and closes: "18:30".',
          );
        } else if (opens >= closes) {
          error(`${field}[${i}]`, "The closing time must be after the opening time.");
        }
      });
    }
  }

  // Online services
  const oc = get(data, "online_services.online_consultation");
  if (!oc) {
    error(
      "online_services.online_consultation",
      "Add the online consultation service patients use to contact the practice (for example Accurx, Klinik, PATCHS or eConsult).",
    );
  } else {
    require("online_services.online_consultation.provider", "the online consultation provider name");
    if (require("online_services.online_consultation.url", "the online consultation link")) {
      if (!/^https:\/\//i.test(oc.url)) {
        error(
          "online_services.online_consultation.url",
          "The online consultation link must start with https://",
        );
      }
    }
  }

  // Embedded widgets must come from known providers
  const trusted = [
    ...DEFAULT_TRUSTED_EMBED_DOMAINS,
    ...(Array.isArray(data.trusted_embed_domains) ? data.trusted_embed_domains : []),
  ];
  const embeds = [
    ["online_services.online_consultation.embed_html", oc?.embed_html],
    ["cqc.embed_html", get(data, "cqc.embed_html")],
  ];
  for (const [field, html] of embeds) {
    if (isBlank(html)) continue;
    for (const host of embedHosts(String(html))) {
      if (!hostIsTrusted(host, trusted)) {
        error(
          field,
          `The embedded code loads content from ${host}, which is not a known provider. Only paste code that your supplier gave you. If you have confirmed it is genuine, add ${host} to trusted_embed_domains.`,
        );
      }
    }
  }

  // Information the practice is expected to publish
  if (nation === "england") {
    if (isBlank(get(data, "cqc.location_id")) && isBlank(get(data, "cqc.embed_html"))) {
      error(
        "cqc",
        "Practices in England must show their CQC rating. Add the CQC location ID, or the rating widget code from the CQC website.",
      );
    }
    const earnings = data.gp_earnings;
    if (!earnings) {
      error("gp_earnings", "Practices in England must publish the mean earnings of their GPs.");
    } else {
      require("gp_earnings.financial_year", "the financial year for the GP earnings figure");
      if (typeof earnings.mean_earnings !== "number" || earnings.mean_earnings <= 0) {
        error(
          "gp_earnings.mean_earnings",
          "Give the mean GP earnings as a number, for example 82000.",
        );
      }
      for (const key of ["full_time_gps", "part_time_gps", "locum_gps"]) {
        if (!Number.isInteger(earnings[key]) || earnings[key] < 0) {
          error(`gp_earnings.${key}`, "Give a whole number (use 0 if none).");
        }
      }
    }
  }

  require("complaints.contact", "who patients should contact about a complaint");
  require("accessibility.statement_prepared", "the date the accessibility statement was prepared");
  if (
    !isBlank(get(data, "accessibility.statement_prepared")) &&
    !parseDate(data.accessibility.statement_prepared)
  ) {
    error("accessibility.statement_prepared", 'Write the date as "YYYY-MM-DD" with quotes.');
  }

  const slugs = new Set(pages.map((p) => p.slug));
  for (const slug of REQUIRED_PAGES) {
    const page = pages.find((p) => p.slug === slug);
    if (!slugs.has(slug)) {
      error(`pages/${slug}.md`, `Add the ${slug.replace(/-/g, " ")} as practice/pages/${slug}.md`);
    } else if (page.content.replace(/^---[\s\S]*?---/, "").trim().length < 50) {
      error(`pages/${slug}.md`, `The ${slug.replace(/-/g, " ")} page looks empty.`);
    }
  }

  // Freshness
  const reviewed = get(data, "site.content_last_reviewed");
  const reviewedDate = parseDate(reviewed);
  if (!reviewedDate) {
    error(
      "site.content_last_reviewed",
      'Add the date the website content was last checked, as "YYYY-MM-DD".',
    );
  } else if (daysBetween(reviewedDate, today) > 183) {
    warn(
      "site.content_last_reviewed",
      "The website content has not been reviewed for over 6 months. Check everything is still correct and update this date.",
    );
  }

  for (const [i, closure] of (data.closures ?? []).entries()) {
    const date = parseDate(closure?.date);
    if (!date) {
      error(`closures[${i}].date`, 'Write the date as "YYYY-MM-DD" with quotes.');
    } else if (daysBetween(date, today) > 0) {
      warn(`closures[${i}]`, `The closure on ${closure.date} has passed. You can remove it.`);
    }
    if (isBlank(closure?.reason)) error(`closures[${i}].reason`, "Say why the practice is closed.");
  }

  for (const [i, notice] of (data.notices ?? []).entries()) {
    if (isBlank(notice?.title)) error(`notices[${i}].title`, "Missing notice title.");
    if (notice?.expires !== undefined) {
      const expires = parseDate(notice.expires);
      if (!expires) {
        error(`notices[${i}].expires`, 'Write the date as "YYYY-MM-DD" with quotes.');
      } else if (daysBetween(expires, today) > 0) {
        warn(
          `notices[${i}]`,
          `The notice "${notice.title}" expired on ${notice.expires}. It is hidden; you can remove it.`,
        );
      }
    }
  }

  // Unfinished content must never reach patients
  walkStrings(data, "", (value, at) => {
    if (PLACEHOLDER_PATTERN.test(value)) {
      error(
        at,
        "This still contains placeholder text (such as TODO or TBC). Replace it with real information.",
      );
    }
  });
  for (const page of pages) {
    if (PLACEHOLDER_PATTERN.test(page.content)) {
      error(
        `pages/${page.slug}.md`,
        "This page still contains placeholder text (such as TODO or TBC).",
      );
    }
  }

  if (data.demo === true) {
    warn(
      "demo",
      "This is a demonstration site. Set demo: false before publishing a real practice website.",
    );
  }

  return { errors, warnings };
}

// Adds derived values the templates need, so templates stay simple.
export function normalisePractice(data, { today = new Date() } = {}) {
  const todayIso = today.toISOString().slice(0, 10);
  const nation = data.practice?.nation ?? "england";
  const trustedEmbedDomains = [
    ...DEFAULT_TRUSTED_EMBED_DOMAINS,
    ...(Array.isArray(data.trusted_embed_domains) ? data.trusted_embed_domains : []),
  ];

  return {
    ...data,
    demo: data.demo === true,
    trusted_embed_domains: trustedEmbedDomains,
    // Non-breaking spaces stop phone numbers wrapping across two lines.
    phone_display: String(data.contact?.phone ?? "").replace(/ /g, "\u00a0"),
    phone_link: `tel:+44${String(data.contact?.phone ?? "")
      .replace(/\D/g, "")
      .replace(/^0/, "")}`,
    opening_hours_list: DAYS.map((day) => ({
      day,
      label: day[0].toUpperCase() + day.slice(1),
      closed: data.opening_hours?.[day] === "closed",
      slots: Array.isArray(data.opening_hours?.[day]) ? data.opening_hours[day] : [],
    })),
    active_notices: (data.notices ?? []).filter((n) => !n.expires || n.expires >= todayIso),
    upcoming_closures: (data.closures ?? []).filter((c) => c.date >= todayIso),
    nhs_app_link:
      nation === "wales"
        ? { name: "NHS Wales App", url: "https://app.nhs.wales/" }
        : { name: "NHS App", url: "https://www.nhs.uk/nhs-app/" },
    urgent: {
      nation,
      nhs111_url: nation === "wales" ? "https://111.wales.nhs.uk/" : "https://111.nhs.uk/",
      nhs111_name: nation === "wales" ? "NHS 111 Wales" : "NHS 111",
    },
  };
}

export function loadPractice(practiceDir, { today = new Date() } = {}) {
  const data = readPracticeFile(practiceDir);
  const pages = listPages(practiceDir);
  const result = validatePractice(data, { pages, today });
  return { data, pages, practice: normalisePractice(data, { today }), ...result };
}

export function formatProblems({ errors, warnings }) {
  const lines = [];
  if (errors.length) {
    lines.push(`${errors.length} problem(s) must be fixed before the site can be built:`);
    for (const e of errors) lines.push(`  - ${e.field}: ${e.message}`);
  }
  if (warnings.length) {
    lines.push(`${warnings.length} warning(s):`);
    for (const w of warnings) lines.push(`  - ${w.field}: ${w.message}`);
  }
  return lines.join("\n");
}
