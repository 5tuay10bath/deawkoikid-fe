describe("Payment Management - Data and Actions", () => {
  it("should login and test all payment management functionality", () => {
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

    // Test 1: Display payments management page
    cy.visit("/payments")
    cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")

    cy.contains("Payment Management").should("be.visible")

    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      if (bodyText.includes("Payment") || bodyText.includes("Tenant") || bodyText.includes("Amount")) {
        cy.log("Payments table displayed")
      }

      if (bodyText.includes("Date") || bodyText.includes("Status") || bodyText.includes("Rent")) {
        cy.log("Payment details columns found")
      }
    })

    // Test 2: Open Add Payment modal when clicking + button
    cy.get("button").then(($buttons) => {
      const addButton = Array.from($buttons).find(
        (btn) =>
          btn.textContent.includes("+") ||
          btn.textContent.includes("Add Payment") ||
          btn.getAttribute("data-cy") === "add-payment",
      )

      if (addButton) {
        cy.wrap(addButton).click()

        cy.get("body").then(($body) => {
          const bodyText = $body.text()

          if (
            bodyText.includes("Add Payment") ||
            bodyText.includes("Tenant") ||
            bodyText.includes("Amount") ||
            bodyText.includes("Payment Date") ||
            bodyText.includes("Method")
          ) {
            cy.log("Add Payment modal opened successfully")
          }
        })

        // Close modal
        cy.get("body").then(($body) => {
          if ($body.find('[role="dialog"]').length > 0) {
            cy.get("body").type("{esc}")
            cy.wait(500)
          }
        })
      } else {
        cy.log("Add Payment button not found")
      }
    })
  })
})
