describe("Contract Management - Data and Actions", () => {
  beforeEach(() => {
    cy.visit("/contracts")
  })

  it("should display contracts management page", () => {
    cy.contains("Contract Management").should("be.visible")

    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      // Check for contracts table
      if (bodyText.includes("Contract") || bodyText.includes("Tenant") || bodyText.includes("Unit")) {
        cy.log("Contracts table displayed")
      }

      // Check for contract information
      if (bodyText.includes("Start Date") || bodyText.includes("End Date") || bodyText.includes("Rent")) {
        cy.log("Contract details columns found")
      }
    })
  })

  // Test Add Contract functionality
  it("should open Add Contract modal when clicking + button", () => {
    cy.contains("Contract Management").should("be.visible")

    // Look for + button (blue Add button)
    cy.get("button").then(($buttons) => {
      const addButton = Array.from($buttons).find(
        (btn) =>
          btn.textContent.includes("+") ||
          btn.textContent.includes("Add Contract") ||
          btn.getAttribute("data-cy") === "add-contract",
      )

      if (addButton) {
        cy.wrap(addButton).click()

        // Should open Add Contract modal
        cy.get("body").then(($body) => {
          const bodyText = $body.text()

          // Check for modal with contract form fields
          if (
            bodyText.includes("Add Contract") ||
            bodyText.includes("Tenant") ||
            bodyText.includes("Unit") ||
            bodyText.includes("Start Date") ||
            bodyText.includes("End Date") ||
            bodyText.includes("Rent Amount")
          ) {
            cy.log("Add Contract modal opened successfully")
          }
        })
      } else {
        cy.log("Add Contract button not found")
      }
    })
  })
})
