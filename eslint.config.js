import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"

import prettierPlugin from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"

import importPlugin from "eslint-plugin-import"
import unusedImports from "eslint-plugin-unused-imports"
import jsxA11y from "eslint-plugin-jsx-a11y"
import sonarjs from "eslint-plugin-sonarjs"
import promise from "eslint-plugin-promise"
import node from "eslint-plugin-node"
import unicorn from "eslint-plugin-unicorn"
import perfectionist from "eslint-plugin-perfectionist"

export default tseslint.config(
  { ignores: ["dist"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      // reactHooks.configs['recommended-latest'],
      // reactRefresh.configs.vite,
      prettierConfig,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettierPlugin,
      import: importPlugin,
      "unused-imports": unusedImports,
      "jsx-a11y": jsxA11y,
      sonarjs: sonarjs,
      promise: promise,
      node: node,
      unicorn: unicorn,
      perfectionist: perfectionist,
    },
    rules: {
      // Keep react-hooks checks
      ...reactHooks.configs.recommended.rules,

      /*** 🔕 Turn off the noisy stuff ***/
      // Don’t force `type` over `interface`
      "@typescript-eslint/consistent-type-definitions": "off",

      // Don’t force import ordering/group spacing
      "import/order": "off",

      // Don’t auto-sort imports
      "perfectionist/sort-imports": "off",

      // Prettier: accept both LF/CRLF, and (importantly) remove Tailwind sorting
      // NOTE: removing the prettier-plugin-tailwindcss stops “bg-white p-3” reordering
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          // ⛔️ intentionally NOT including `plugins: ["prettier-plugin-tailwindcss"]`
          // to prevent Tailwind class reordering suggestions
        },
      ],

      // Optional: keep react-refresh warning
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      /*** ✅ Useful cleanups ***/
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],

      /*** Accessibility / quality ***/
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/no-identical-functions": "warn",
      "promise/always-return": "warn",
      "promise/no-return-wrap": "warn",

      /*** General TS/JS ***/
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-unresolved": "off",
      "@typescript-eslint/no-redeclare": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { args: "none", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-console": "warn",
      "no-alert": "error",
      "no-magic-numbers": "off",
      "no-empty-pattern": "off",
      "prefer-const": "error",
      "node/prefer-global/process": "off",
      "node/no-process-env": "warn",
      semi: ["error", "never"],

      /*** File naming ***/
      "unicorn/filename-case": [
        "error",
        {
          cases: { kebabCase: false, camelCase: true, pascalCase: true, snakeCase: false },
          ignore: ["README.md", "vite-env.d.ts"],
        },
      ],
    },
  },
  // 🔇 Relax rules for infrastructure folder
  {
    files: ["src/infrastructure/**/*.{ts,tsx}"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  // 🔇 Allow 'any' type in port files
  {
    files: ["src/application/ports/**/*.ts", "src/domain/ports/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
)
