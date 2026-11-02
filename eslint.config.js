// SPDX-FileCopyrightText: 2026 Marcus Baw
// SPDX-License-Identifier: MIT

import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["_site/", "_preview/", "node_modules/"] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
  },
  {
    files: ["src/assets/**/*.js"],
    languageOptions: { globals: { ...globals.browser } },
  },
];
