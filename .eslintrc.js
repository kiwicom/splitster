module.exports = {
  extends: ["@kiwicom"],
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
  overrides: [
    {
      // Flow
      files: ["*.js", "*.jsx", "*.js.flow"],
      extends: ["@kiwicom/eslint-config/flow"],
    },
  ],
  reportUnusedDisableDirectives: true,
};
