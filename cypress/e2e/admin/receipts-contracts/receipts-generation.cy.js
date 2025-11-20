describe("Receipts & Contracts - Generation and Download", () => {
  it("should login and test all receipt generation functionality", () => {
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

    // Test: Generate receipt for payments with Paid status
    cy.visit("/payments")
    cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")

    cy.contains("Payment Management").should("be.visible")

    cy.wait(1500)

    cy.get("body").then(($body) => {
      if ($body.text().includes("Paid")) {
        cy.contains("tr", /Paid/i)
          .first()
          .within(() => {
            cy.get("button").first().click({ force: true })
          })

        cy.log("✅ Clicked receipt button for Paid payment")

        cy.wait(500)
        cy.contains(/Generate Receipt|Payment Receipt/i, { timeout: 3000 }).should("be.visible")

        cy.get("body").should("contain.text", "Tenant:")
        cy.get("body").should("contain.text", "Unit:")
        cy.get("body").should("contain.text", "Total Amount:")

        cy.log("✅ Receipt details verified")

        cy.contains("button", /Download/i).click({ force: true })

        cy.wait(1000)

        cy.contains(/success/i, { timeout: 5000 }).should("be.visible")

        cy.log("✅ Receipt downloaded successfully with SUCCESS toast")

        cy.contains("button", /Cancel/i).click({ force: true })
      } else {
        cy.log("⚠️ No paid payments found")
      }
    })
  })
})
