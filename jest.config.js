module.exports = {
  testEnvironment: "node",
  testMatch: [
    "**/tests/**/*.test.js",
    "**/__tests__/**/*.js"
  ],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!**/node_modules/**"
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  verbose: true,
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"]
};
