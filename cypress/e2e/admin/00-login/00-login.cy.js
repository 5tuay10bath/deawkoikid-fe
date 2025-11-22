/**
 * Login Test - This runs first to establish authentication session
 * File named with 00- prefix to run before other tests alphabetically
 */

describe("Authentication", () => {
  it("should login successfully and verify dashboard access", () => {
    // Visit login page
    cy.visit("/login")
    cy.wait(500)

    // Wait for login form to be visible
    cy.get('[data-cy="email-input"]', { timeout: 10000 })
      .should("be.visible")
      .clear({ force: true })
      .type("admin@apt.com", { force: true })

    cy.get('[data-cy="password-input"]').clear({ force: true }).type("admin", { force: true })

    // Submit login
    cy.get('[data-cy="login-button"]').click({ force: true })

    // Wait for redirect with longer timeout for CI
    cy.url({ timeout: 30000 }).should("not.include", "/login")

    // Verify auth token exists
    cy.getCookie("auth_token").should("exist")

    // Verify we're on dashboard
    cy.url().should("include", "/dashboard")
    cy.contains("Property Dashboard", { timeout: 10000 }).should("be.visible")
  })
})
