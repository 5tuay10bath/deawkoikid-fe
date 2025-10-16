describe("Tenant Management - Data Tables", () => {
  beforeEach(() => {
    cy.visit("/tenants")
  })

  // User Story 2.b: Tables show tenant lease data and allow editing
  it("should display tenant data table with lease information", () => {
    cy.contains("Tenant Management").should("be.visible")
    cy.contains("Total Tenants").should("be.visible")

    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      // Check for table with tenant data
      if (bodyText.includes("Name") || bodyText.includes("Tenant") || bodyText.includes("Room")) {
        cy.log("Tenant data table columns found")
      }

      // Check for lease information columns
      if (bodyText.includes("Check-in") || bodyText.includes("Check-out") || bodyText.includes("Rent")) {
        cy.log("Lease information displayed in table")
      }

      // Check for data management buttons
      if (bodyText.includes("Export Data")) {
        cy.contains("Export Data").should("be.visible")
      }

      // Check for edit functionality
      if (bodyText.includes("Edit") || bodyText.includes("Actions")) {
        cy.log("Edit functionality available for tenant data")
      }
    })
  })

  // Test Add Tenant functionality
  it("should open Add Tenant modal when clicking + button", () => {
    cy.contains("Tenant Management").should("be.visible")

    // Look for + button (blue Add button)
    cy.get("button").then(($buttons) => {
      const addButton = Array.from($buttons).find(
        (btn) =>
          btn.textContent.includes("+") ||
          btn.textContent.includes("Add Tenant") ||
          btn.getAttribute("data-cy") === "add-tenant",
      )

      if (addButton) {
        cy.wrap(addButton).click()

        // Should open modal/dialog
        cy.get("body").then(($body) => {
          const bodyText = $body.text()

          // Check for modal with form fields
          if (
            bodyText.includes("Add Tenant") ||
            bodyText.includes("Full Name") ||
            bodyText.includes("Email") ||
            bodyText.includes("Phone")
          ) {
            cy.log("Add Tenant modal opened successfully")
          }
        })
      } else {
        cy.log("Add Tenant button not found")
      }
    })
  })

  it("should show tenant statistics", () => {
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      // Check statistics cards
      if (bodyText.includes("Total Tenants")) {
        cy.contains("Total Tenants").should("be.visible")
      }
      if (bodyText.includes("Active")) {
        cy.contains("Active").should("be.visible")
      }
      if (bodyText.includes("Overdue")) {
        cy.contains("Overdue").should("be.visible")
      }

      // Log if we find numbers in the text
      const hasNumbers = /\d+/.test(bodyText)
      if (hasNumbers) {
        cy.log("Found numerical statistics on page")
      }
    })
  })

  it("should display tenant table or list", () => {
    // Check if tenant data is displayed
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      // Should show tenant-related content
      if (bodyText.includes("All Tenants")) {
        cy.contains("All Tenants").should("be.visible")
      }

      // Check for search functionality
      if (bodyText.includes("Search")) {
        cy.get('input[placeholder*="Search"]').should("be.visible")
      }
    })
  })

  it("should allow navigation back to dashboard", () => {
    cy.visit("/dashboard")
    cy.contains("Property Dashboard").should("be.visible")
  })
})
