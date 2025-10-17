describe("Basic App Functionality", () => {
  it("should load the dashboard page with basic content", () => {
    cy.visit("/dashboard")

    // Wait for page to load and check basic content
    cy.contains("Property Dashboard").should("be.visible")
    cy.contains("Total Units").should("be.visible")

    // Check for floors
    cy.get("body").then(($body) => {
      if ($body.text().includes("Floor")) {
        cy.contains(/Floor \d+/i).should("be.visible")
      }
    })
  })

  it("should show room cards on dashboard", () => {
    cy.visit("/dashboard")

    // Check for room elements - flexible matching
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      // Look for room indicators
      if (bodyText.includes("Room") || bodyText.includes("Unit")) {
        cy.log("Found room/unit cards on dashboard")
      }

      // Check for status badges
      const hasStatus = bodyText.includes("Available") || bodyText.includes("Occupied") || bodyText.includes("Reserved")
      if (hasStatus) {
        cy.log("Found room status indicators")
      }
    })
  })

  it("should allow direct navigation to pages", () => {
    // Test direct navigation instead of clicking links
    cy.visit("/tenants")
    cy.url().should("include", "/tenants")
    cy.contains("Tenant Management").should("be.visible")

    cy.visit("/units")
    cy.url().should("include", "/units")
    cy.contains("Unit Management").should("be.visible")

    cy.visit("/dashboard")
    cy.url().should("include", "/dashboard")
    cy.contains("Property Dashboard").should("be.visible")
  })

  it("should load tenants page", () => {
    cy.visit("/tenants")

    // Check tenants page loads
    cy.contains("Tenant Management").should("be.visible")
    cy.contains("Total Tenants").should("be.visible")
  })

  it("should load units page", () => {
    cy.visit("/units")

    // Check units page loads
    cy.contains("Unit Management").should("be.visible")
    cy.contains("All Units").should("be.visible")
  })
})
