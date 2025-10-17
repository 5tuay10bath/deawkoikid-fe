/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to wait for table to load
Cypress.Commands.add("waitForTableLoad", () => {
  // Wait for loading spinner to disappear
  cy.get('[data-cy="loading-spinner"]', { timeout: 15000 }).should("not.exist")
  // Wait for table to be visible
  cy.get("table", { timeout: 15000 }).should("be.visible")
})

// Custom command to wait for page load
Cypress.Commands.add("waitForPageLoad", () => {
  cy.get('[data-cy="loading-spinner"]', { timeout: 15000 }).should("not.exist")
})

declare global {
  namespace Cypress {
    interface Chainable {
      waitForTableLoad(): Chainable<void>
      waitForPageLoad(): Chainable<void>
    }
  }
}
