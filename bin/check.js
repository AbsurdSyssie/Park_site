#!/usr/bin/env node
// Checks practice/practice.yaml and practice/pages/ for problems, in plain
// English. Run with: npm run check

import path from "node:path";
import { loadPractice, formatProblems } from "../lib/practice.js";

const practiceDir = path.resolve(process.env.PRACTICE_DIR ?? "practice");

try {
  const result = loadPractice(practiceDir);
  const report = formatProblems(result);
  if (report) console.log(report);
  if (result.errors.length) {
    process.exitCode = 1;
  } else {
    console.log(`\nAll required information is present for ${result.data.practice.name}.`);
  }
} catch (err) {
  console.error(`Could not read the practice details: ${err.message}`);
  process.exitCode = 1;
}
