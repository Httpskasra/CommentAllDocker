/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
  root: true,
  ignorePatterns: ["node_modules/", "dist/", ".next/", "coverage/", "ops/"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./apps/*/tsconfig.json", "./packages/*/tsconfig.json"],
  },
  plugins: ["@typescript-eslint", "prettier", "import", "security"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:security/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "import/no-unresolved": "off",
    "import/order": [
      "warn",
      {
        "newlines-between": "always",
        groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
  },
  overrides: [
    {
      files: ["apps/web/**/*.{ts,tsx,js,jsx}"],
      extends: ["next/core-web-vitals", "plugin:jsx-a11y/recommended", "plugin:react/recommended"],
      settings: { react: { version: "detect" } },
      rules: {
        "react/react-in-jsx-scope": "off",
        "@next/next/no-html-link-for-pages": "off",
        "@next/next/no-img-element": "off",
        "react/no-unescaped-entities": "off",
      },
    },
    {
      files: ["apps/api/**/*.{ts,js}"],
      env: { node: true },
      rules: { "security/detect-object-injection": "off" },
    },
    {
      files: ["**/*.cjs", "**/*.js"],
      parserOptions: { project: null },
    },
  ],
};
