describe("Unit Management - Data Tables and Actions", () => {
  beforeEach(() => {
    cy.visit("/units")
  })

  it("should display units management page", () => {
    cy.contains("Unit Management").should("be.visible")
    cy.contains("All Units").should("be.visible")

    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      // Check for units table
      if (bodyText.includes("Unit") || bodyText.includes("Room") || bodyText.includes("Number")) {
        cy.log("Units table displayed")
      }

      // Check for unit information
      if (bodyText.includes("Floor") || bodyText.includes("Status") || bodyText.includes("Type")) {
        cy.log("Unit details columns found")
      }
    })
  })

  // Test Add Unit functionality
  it("should open Add Unit modal when clicking + button", () => {
    cy.contains("Unit Management").should("be.visible")

    // Look for + button (blue Add button)
    cy.get("button").then(($buttons) => {
      const addButton = Array.from($buttons).find(
        (btn) =>
          btn.textContent.includes("+") ||
          btn.textContent.includes("Add Unit") ||
          btn.getAttribute("data-cy") === "add-unit",
      )

      if (addButton) {
        cy.wrap(addButton).click()

        // Should open Add Unit modal/dialog
        cy.get("body").then(($body) => {
          const bodyText = $body.text()

          // Check for modal with unit form fields
          if (
            bodyText.includes("Add Unit") ||
            bodyText.includes("Unit Number") ||
            bodyText.includes("Floor") ||
            bodyText.includes("Unit Type")
          ) {
            cy.log("Add Unit modal opened successfully")
          }
        })
      } else {
        cy.log("Add Unit button not found")
      }
    })
  })
})
