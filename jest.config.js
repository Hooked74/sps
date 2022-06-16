const { resolve } = require("path");

module.exports = (testDir = "src") => ({
  roots: [`<rootDir>/${testDir}`],
  extensionsToTreatAsEsm: [".es.js", ".jsx", ".svelte", ".ts", ".tsx", ".vue"],
  setupFiles: [require.resolve("react-app-polyfill/jsdom")],
  setupFilesAfterEnv: [resolve(__dirname, "setupTests.ts")],
  collectCoverageFrom: [
    `<rootDir>/${testDir}/**/*.{js,jsx,ts,tsx}`,
    `!<rootDir>/${testDir}/**/*.d.ts`,
    `!<rootDir>/${testDir}/**/__tests__/**/*.{js,jsx,ts,tsx}`,
  ],
  testMatch: [`<rootDir>/${testDir}/**/__tests__/*.test.{js,jsx,ts,tsx}`],
  testRunner: require.resolve("jest-circus/runner"),
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": resolve(__dirname, "jest/babelTransform.js"),
    "^.+?(?<!\\.module)\\.css$": resolve(__dirname, "jest/cssTransform.js"),
    "^.+\\.module\\.(css|sass|scss)$": resolve(__dirname, "jest/styleModuleTransform.js"),
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|sass|scss|json)$)": resolve(
      __dirname,
      "jest/fileTransform.js"
    ),
  },
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$"],
  testPathIgnorePatterns: ["__mocks__"],
  modulePaths: [],
  moduleFileExtensions: [
    "web.js",
    "js",
    "web.ts",
    "ts",
    "web.tsx",
    "tsx",
    "json",
    "web.jsx",
    "jsx",
    "node",
  ],
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
  resolver: resolve(__dirname, "jest/resolver.js"),
  resetMocks: true,
});
