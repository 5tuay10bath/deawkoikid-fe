// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your component test files.
// This is a great place to put global configuration and
// behavior that modifies Cypress.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Import global styles that your components depend on
import '../../src/index.css'

import { mount } from 'cypress/react18'

// Custom mount command that includes common providers
Cypress.Commands.add('mount', (component, options = {}) => {
  const { providers = [], ...mountOptions } = options

  const wrapped = providers.reduce(
    (acc, provider) => provider(acc),
    component
  )

  return mount(wrapped, mountOptions)
})

// Example wrapper for React Context providers
const withProviders = (providers) => (component) => {
  return providers.reduce(
    (acc, Provider) => {
      // Return wrapped component with provider
      return { wrapped: acc, provider: Provider }
    },
    component
  )
}

// Mock common utilities
beforeEach(() => {
  // Mock window.matchMedia (often needed for responsive components)
  cy.window().then((win) => {
    Object.defineProperty(win, 'matchMedia', {
      writable: true,
      value: cy.stub().returns({
        matches: false,
        media: '',
        onchange: null,
        addListener: cy.stub(),
        removeListener: cy.stub(),
        addEventListener: cy.stub(),
        removeEventListener: cy.stub(),
        dispatchEvent: cy.stub(),
      }),
    })
  })
})

// Add custom commands for component testing
Cypress.Commands.add('mountWithTheme', (component, theme = 'light') => {
  // Example theme provider wrapper
  return cy.mount(component, {
    providers: [
      // Add your theme providers here
      // (component) => <ThemeProvider theme={theme}>{component}</ThemeProvider>
    ]
  })
})

Cypress.Commands.add('mountWithProps', (Component, props = {}) => {
  // Mount component with props
  return cy.mount(Component, { props })
})

// Global error handling for component tests
Cypress.on('uncaught:exception', (err) => {
  // Don't fail tests on React development warnings
  if (err.message.includes('Warning:')) {
    return false
  }
  return true
})