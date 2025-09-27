// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
// This is a great place to put global configuration and
// behavior that modifies Cypress.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing the test on uncaught exceptions
  // You can customize this based on your needs
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false
  }
  // Don't fail on these common React development errors
  if (err.message.includes('ChunkLoadError')) {
    return false
  }
  return true
})

// Set up global hooks
beforeEach(() => {
  // Mock common API endpoints that might be called by default
  cy.intercept('GET', '/api/health', { statusCode: 200, body: { status: 'ok' } })
  
  // Set up viewport consistently
  cy.viewport(1280, 720)
  
  // Clear localStorage and sessionStorage before each test
  cy.clearLocalStorage()
  cy.clearCookies()
  
  // Mock authentication for tests that need it
  cy.window().then((win) => {
    win.localStorage.setItem('authToken', 'mock-jwt-token')
    win.localStorage.setItem('user', JSON.stringify({
      id: 1,
      username: 'testuser',
      role: 'admin',
      permissions: ['read', 'write', 'delete']
    }))
  })
})

afterEach(() => {
  // Clean up after each test
  cy.clearLocalStorage()
  cy.clearCookies()
})

// Custom assertions
chai.use((chai, utils) => {
  chai.Assertion.addMethod('visible', function () {
    const obj = this._obj
    this.assert(
      obj.is(':visible'),
      'expected #{this} to be visible',
      'expected #{this} to not be visible'
    )
  })
})

// Add custom Cypress configuration
Cypress.config('defaultCommandTimeout', 10000)
Cypress.config('requestTimeout', 10000)
Cypress.config('responseTimeout', 10000)

// Silence specific console errors in tests
const origLog = Cypress.log
Cypress.log = function (opts, ...other) {
  if (opts.displayName === 'script error' || opts.displayName === 'warning') {
    return
  }
  return origLog(opts, ...other)
}

// Add support for data-testid attributes (in addition to data-cy)
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})

// Global error handling for network requests
cy.on('fail', (err, runnable) => {
  // Handle specific test failures
  if (err.message.includes('Timed out waiting for element')) {
    console.log('Element timeout - this might be expected behavior')
    // You can add custom logic here
  }
  throw err
})