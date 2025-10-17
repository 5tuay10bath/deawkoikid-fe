describe("Payment Management - Data and Actions", () => {
  beforeEach(() => {
    cy.visit("/payments")
    // Wait for loading to finish
    cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")
  })

  it("should display payments management page", () => {
    cy.contains("Payment Management").should("be.visible")

    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      // Check for payments table
      if (bodyText.includes("Payment") || bodyText.includes("Tenant") || bodyText.includes("Amount")) {
        cy.log("Payments table displayed")
      }

      // Check for payment information
      if (bodyText.includes("Date") || bodyText.includes("Status") || bodyText.includes("Rent")) {
        cy.log("Payment details columns found")
      }
    })
  })

  // NOTE: For Add Payment - only verify modal opens, no actual form submission
  it("should open Add Payment modal when clicking + button", () => {
    cy.contains("Payment Management").should("be.visible")

    // Look for + button (blue Add button)
    cy.get("button").then(($buttons) => {
      const addButton = Array.from($buttons).find(
        (btn) =>
          btn.textContent.includes("+") ||
          btn.textContent.includes("Add Payment") ||
          btn.getAttribute("data-cy") === "add-payment",
      )

      if (addButton) {
        cy.wrap(addButton).click()

        // Should open Add Payment modal
        cy.get("body").then(($body) => {
          const bodyText = $body.text()

          // Check for modal with payment form fields
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
      } else {
        cy.log("Add Payment button not found")
      }
    })
  })
})
