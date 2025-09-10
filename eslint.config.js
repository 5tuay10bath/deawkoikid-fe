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
      ...reactHooks.configs.recommended.rules,
      "prettier/prettier": [
        "error",
        {
          plugins: ["prettier-plugin-tailwindcss"],
          tailwindStylesheet: "./src/index.css",
          tailwindFunctions: ["tv"],
        },
      ],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // 📦 Organize imports by group
      // "import/order": [
      //   "error",
      //   {
      //     groups: ["builtin", "external", "internal"],
      //     pathGroups: [
      //       {
      //         pattern: "@/**",
      //         group: "internal",
      //         position: "after",
      //       },
      //     ],
      //     alphabetize: { order: "asc", caseInsensitive: true },
      //     "newlines-between": "always",
      //   },
      // ],
      "import/no-unresolved": "off",

      // 🧹 Clean up unused imports and vars
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],

      // ♿ JSX accessibility
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",

      // 🧠 SonarJS — cognitive complexity & duplication
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/no-identical-functions": "warn",

      // ⏳ Promise handling best practices
      "promise/always-return": "warn",
      "promise/no-return-wrap": "warn",

      // 📘 General JS/TS rules
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "@typescript-eslint/no-redeclare": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "no-console": "warn",
      "node/prefer-global/process": ["off"],
      "node/no-process-env": ["warn"],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-empty-function": "warn",
      "no-alert": "error",
      "no-magic-numbers": "warn",
      "prefer-const": "error",
      "@typescript-eslint/no-unused-vars": ["error", { args: "none", varsIgnorePattern: "^_" }],

      // 🧠 Sort imports for readability
      "perfectionist/sort-imports": ["error", { tsconfigRootDir: "." }],

      // 📁 Enforce consistent file naming
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            kebabCase: false,
            camelCase: true,
            pascalCase: true,
            snakeCase: false,
          },
          ignore: ["README.md", "vite-env.d.ts"],
        },
      ],
    },
  },
)
