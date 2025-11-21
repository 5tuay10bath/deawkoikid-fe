import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000/fivetuay10bath-frontend",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      // Add any environment variables your tests need
      api_base_url: process.env.CYPRESS_API_BASE_URL || "http://localhost:8088",
    },
    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0,
    },
    // Test file patterns
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    // Support file
    supportFile: "cypress/support/e2e.js",
    // Fixture folder
    fixturesFolder: "cypress/fixtures",
    // Screenshots and videos
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    // Test execution settings - Increased timeouts for CI/CD
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 60000,
    // Browser settings
    chromeWebSecurity: false,
    experimentalStudio: true,
  },
  component: {
    devServer: {
      framework: "vite",
      bundler: "vite",
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.js",
  },
})
