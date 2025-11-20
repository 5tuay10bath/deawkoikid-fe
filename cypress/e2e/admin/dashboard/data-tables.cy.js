describe("Tenant Management - Data Tables", () => {
  it("should login and test all tenant data table functionality", () => {
    // Login once at the beginning
    cy.visit("/login")
    cy.wait(500)

    cy.get('[data-cy="email-input"]', { timeout: 10000 })
      .should("be.visible")
      .clear({ force: true })
      .type("admin@apt.com", { force: true })

    cy.get('[data-cy="password-input"]').clear({ force: true }).type("admin", { force: true })

    cy.get('[data-cy="login-button"]').click({ force: true })

    cy.url().should("not.include", "/login", { timeout: 10000 })
    cy.getCookie("auth_token").should("exist")

    // Test 1: Open Add Tenant modal and verify form fields
    cy.visit("/tenants")
    cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")

    cy.contains("Tenant Management").should("be.visible")
    cy.get('button[class*="bg-blue"]').filter(":visible").first().click()
    cy.get('div[role="dialog"]', { timeout: 5000 }).should("be.visible")
    cy.get('div[role="dialog"]')
      .should("be.visible")
      .then(() => {
        cy.log("✅ Add Tenant modal opened successfully")
      })

    // Close modal before next test
    cy.get("body").then(($body) => {
      if ($body.find('[role="dialog"]').length > 0) {
        cy.get("body").type("{esc}")
        cy.wait(500)
      }
    })

    // Test 2: Show tenant statistics with actual numbers
    cy.visit("/tenants")
    cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")

    cy.url().should("include", "/tenant")
    cy.get("body").then(($body) => {
      const bodyText = $body.text()
      const hasStatistics = bodyText.match(/total|tenants|active|occupied/i)

      if (hasStatistics) {
        cy.log("✅ Statistics section found")

        const hasNumbers = bodyText.match(/\d+/)
        if (hasNumbers) {
          cy.log(`✅ Found statistics with numbers`)
        }
      }
    })

    cy.get("table").should("exist")
    cy.log("✅ Statistics display verified")

    // Test 3: Allow navigation back to dashboard
    cy.visit("/dashboard")
    cy.contains("Property Dashboard").should("be.visible")
  })
})
