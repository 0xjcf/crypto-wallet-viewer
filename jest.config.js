module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testMatch: ["<rootDir>/src/tests/**/*.test.ts"],
  globalSetup: "<rootDir>/globalSetup.ts",
  globalTeardown: "<rootDir>/globalTeardown.ts",
  setupFilesAfterEnv: ["<rootDir>/setupFile.ts"],
};
