#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parse } from 'parse5';

const args = process.argv.slice(2);
const renderedArg = args[0];
let reportPath = null;
for (let index = 1; index < args.length; index += 1) {
  if (args[index] === '--report' && args[index + 1]) {
    reportPath = path.resolve(args[index + 1]);
    index += 1;
  } else if (args[index].startsWith('--report=')) {
    reportPath = path.resolve(args[index].slice('--report='.length));
  } else {
    console.error(`Unknown option: ${args[index]}`);
    process.exit(2);
  }
}
if (!renderedArg) {
  console.error('Usage: node practice/site-structure-review/check-implementation.mjs <rendered-site-directory> [--report <json-path>]');
  process.exit(2);
}
const renderedRoot = path.resolve(renderedArg);
const routeMapPath = path.resolve('practice/site-structure-review/proposed-routes.csv');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') {
      row.push(cell);
      cell = '';
    } else if (char === '\n') {
      row.push(cell.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      cell = '';
    } else cell += char;
  }
  if (cell || row.length) {
    row.push(cell.replace(/\r$/, ''));
    rows.push(row);
  }
  const [headers, ...records] = rows;
  return records.filter((record) => record.some(Boolean)).map((record) =>
    Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ''])),
  );
}

function attrs(node) {
  return Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
}
function hasClass(node, className) {
  return (attrs(node).class ?? '').split(/\s+/).includes(className);
}
function walk(node, visit) {
  visit(node);
  for (const child of node.childNodes ?? []) walk(child, visit);
  if (node.content) walk(node.content, visit);
}
function textContent(node) {
  if (node.nodeName === '#text') return node.value;
  return (node.childNodes ?? []).map(textContent).join('');
}
function collect(root, predicate) {
  const found = [];
  walk(root, (node) => { if (predicate(node)) found.push(node); });
  return found;
}
function routeFromOutput(file) {
  if (path.resolve(file) === path.join(renderedRoot, '404.html')) return '/404.html';
  const rel = path.relative(renderedRoot, path.dirname(file)).split(path.sep).filter(Boolean);
  return rel.length ? `/${rel.join('/')}/` : '/';
}
function normaliseInternalHref(href) {
  if (!href || !href.startsWith('/')) return null;
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return '/';
  return clean.endsWith('/') ? clean : `${clean}/`;
}
function flatten(node) {
  return textContent(node).replace(/\s+/g, ' ').trim();
}

const rows = parseCsv(fs.readFileSync(routeMapPath, 'utf8'));
const byRoute = new Map(rows.map((row) => [row.route, row]));
const errors = [];
if (rows.length !== 49) errors.push(`Expected 49 route-map rows, found ${rows.length}`);
if (!fs.existsSync(renderedRoot)) errors.push(`Rendered directory does not exist: ${renderedRoot}`);

const rendered = new Map();
if (fs.existsSync(renderedRoot)) {
  const visitDir = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visitDir(file);
      else if (entry.isFile() && entry.name === 'index.html' || entry.isFile() && entry.name === '404.html') {
        const route = routeFromOutput(file);
        const document = parse(fs.readFileSync(file, 'utf8'));
        const mains = collect(document, (node) => node.tagName === 'main');
        const main = mains[0];
        const h1 = main && collect(main, (node) => node.tagName === 'h1')[0];
        const breadcrumbs = collect(document, (node) => node.tagName === 'nav' && attrs(node)['aria-label'] === 'Breadcrumb')[0];
        const crumbLinks = breadcrumbs ? collect(breadcrumbs, (node) => node.tagName === 'a' && hasClass(node, 'nhsuk-breadcrumb__link')) : [];
        const currentCrumb = breadcrumbs ? collect(breadcrumbs, (node) => node.tagName === 'span' && attrs(node)['aria-current'] === 'page')[0] : null;
        const links = new Set(main ? collect(main, (node) => node.tagName === 'a').map((node) => normaliseInternalHref(attrs(node).href)).filter(Boolean) : []);
        rendered.set(route, {
          document,
          title: h1 ? flatten(h1) : null,
          links,
          breadcrumbLinks: crumbLinks.map((node) => normaliseInternalHref(attrs(node).href)),
          breadcrumbCurrent: currentCrumb ? flatten(currentCrumb) : null,
        });
      }
    }
  };
  visitDir(renderedRoot);
}

for (const row of rows) {
  const page = rendered.get(row.route);
  if (!page) {
    errors.push(`Missing rendered route: ${row.route}`);
    continue;
  }
  if (page.title !== row.proposedTitle) errors.push(`Title mismatch ${row.route}: expected "${row.proposedTitle}", got "${page.title ?? '(missing h1)'}"`);

  if (row.route !== '/' && row.action !== 'keep-system-page') {
    const expectedParents = [];
    let parentRoute = row.proposedParent;
    const seen = new Set([row.route]);
    while (parentRoute) {
      if (seen.has(parentRoute)) {
        errors.push(`Breadcrumb parent cycle at ${row.route}`);
        break;
      }
      seen.add(parentRoute);
      expectedParents.unshift(parentRoute);
      const parent = byRoute.get(parentRoute);
      parentRoute = parent?.proposedParent ?? '';
    }
    const actualParentLinks = page.breadcrumbLinks;
    if (JSON.stringify(actualParentLinks) !== JSON.stringify(expectedParents)) {
      errors.push(`Breadcrumb chain mismatch ${row.route}: expected ${JSON.stringify(expectedParents)}, got ${JSON.stringify(actualParentLinks)}`);
    }
    if (page.breadcrumbCurrent !== row.proposedTitle) errors.push(`Current breadcrumb mismatch ${row.route}: expected "${row.proposedTitle}", got "${page.breadcrumbCurrent ?? '(missing)'}"`);
  }
}

let requiredEdges = 0;
const missingEdges = [];
for (const row of rows) {
  const destination = normaliseInternalHref(row.route);
  for (const source of row.requiredContextualInbound.split(';').map((item) => item.trim()).filter(Boolean)) {
    requiredEdges += 1;
    const sourceRoute = normaliseInternalHref(source);
    if (!rendered.get(sourceRoute)?.links.has(destination)) missingEdges.push({ from: sourceRoute, to: destination });
  }
}
for (const edge of missingEdges) errors.push(`Missing required main-content link ${edge.from} -> ${edge.to}`);

const home = rendered.get('/');
const menu = home && collect(home.document, (node) => node.tagName === 'nav' && attrs(node)['aria-label'] === 'Menu')[0];
const menuLinks = menu ? collect(menu, (node) => node.tagName === 'a' && hasClass(node, 'nhsuk-header__navigation-link')).map(flatten) : [];
const expectedPrimary = ['Home', 'Request An Appointment / Admin Query', 'Join The Surgery', 'Patient Feedback', 'Test Results', 'Prescriptions'];
const expectedOverflow = ['Fit notes', 'Opening times', 'Contact us', 'Services and support', 'About the practice'];
if (JSON.stringify(menuLinks.slice(0, 6)) !== JSON.stringify(expectedPrimary)) errors.push(`Primary navigation mismatch: ${JSON.stringify(menuLinks.slice(0, 6))}`);
if (JSON.stringify(menuLinks.slice(6)) !== JSON.stringify(expectedOverflow)) errors.push(`Overflow navigation mismatch: ${JSON.stringify(menuLinks.slice(6))}`);

const summary = {
  status: errors.length ? 'fail' : 'pass',
  routeRows: rows.length,
  renderedRoutes: rendered.size,
  titlesChecked: [...rendered.keys()].filter((route) => byRoute.has(route)).length,
  breadcrumbChainsChecked: rows.filter((row) => row.route !== '/' && row.action !== 'keep-system-page').length,
  requiredEdgesChecked: requiredEdges,
  missingRequiredEdges: missingEdges.length,
  errors,
};
console.log(JSON.stringify(summary, null, 2));
if (reportPath) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(summary, null, 2)}\n`);
}
process.exitCode = errors.length ? 1 : 0;
