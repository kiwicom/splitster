module.exports = {
  extends: ["@kiwicom"],
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "jest/prefer-expect-assertions": "OFF",
  },
  overrides: [
    {
      // TypeScript
      files: ["*.ts", "*.tsx"],
      extends: ["@kiwicom/eslint-config/ts"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    {
      // Flow
      files: ["*.js", "*.jsx", "*.js.flow"],
      extends: ["@kiwicom/eslint-config/flow"],
    },
  ],
  reportUnusedDisableDirectives: true,
};
