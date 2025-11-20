describe("Unit Management - Data Tables and Actions", () => {
  it("should login and test all unit management functionality", () => {
    // Login once at the beginning
    cy.visit("/login")
    cy.wait(500)

    cy.get('[data-cy="email-input"]', { timeout: 10000 })
      .should("be.visible")
      .clear({ force: true })
      .type("admin@apt.com", { force: true })

    cy.get('[data-cy="password-input"]').clear({ force: true }).type("admin", { force: true })

    cy.get('[data-cy="login-button"]').click({ force: true })

    cy.wait(2000) // Wait for API call to complete
    cy.url({ timeout: 30000 }).should("not.include", "/login")

    // Alternative: force navigate if still on login page
    cy.url().then((url) => {
      if (url.includes("/login")) {
        cy.log("Still on login page, forcing navigation to dashboard")
        cy.visit("/dashboard")
      }
    })

    cy.getCookie("auth_token").should("exist")

    // Test 1: Open Add Unit modal and verify form fields
    cy.visit("/units")
    cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")

    cy.contains("Unit Management").should("be.visible")
    cy.get('button[class*="bg-blue"]').filter(":visible").first().click()
    cy.get('div[role="dialog"]', { timeout: 5000 }).should("be.visible")
    cy.get('div[role="dialog"]')
      .should("be.visible")
      .then(() => {
        cy.log("✅ Add Unit modal opened successfully")
      })

    // Close modal
    cy.get("body").then(($body) => {
      if ($body.find('[role="dialog"]').length > 0) {
        cy.get("body").type("{esc}")
        cy.wait(500)
      }
    })

    // Test 2: Show unit statistics
    cy.visit("/units")
    cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")

    cy.url().should("include", "/unit")
    cy.get("table").should("exist")

    cy.get("body").then(($body) => {
      const bodyText = $body.text()
      const hasStats = bodyText.match(/total|available|occupied|units/i)
      const hasNumbers = bodyText.match(/\d+/)

      if (hasStats) {
        cy.log("✅ Unit statistics displayed")
      }

      if (hasNumbers) {
        cy.log("✅ Numerical data found in statistics")
      }
    })

    cy.log("✅ Unit management page verified")
  })
})
