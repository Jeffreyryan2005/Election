module.exports = [
  {
    ignores: ["public/js/*.min.js", "coverage/**", "node_modules/**"]
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        __dirname: "readonly",
        process: "readonly",
        console: "readonly",
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        IntersectionObserver: "readonly",
        requestAnimationFrame: "readonly",
        setTimeout: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
      "no-undef": "error"
    }
  }
];
