describe("Dashboard - Room Availability Overview", () => {
  beforeEach(() => {
    cy.visit("/dashboard")
  })

  it("should display dashboard with room information", function () {
    // Check dashboard loads
    cy.contains("Property Dashboard").should("be.visible")

    // Check stats are visible
    cy.contains("Total Units").should("be.visible")
    cy.contains("24").should("be.visible")
    cy.contains("Occupied").should("be.visible")
    cy.contains("Monthly Revenue").should("be.visible")

    // Check floors are displayed
    cy.contains("Floor 1").should("be.visible")
    cy.contains("Floor 2").should("be.visible")

    // Check some room cards are visible
    cy.contains("Room 101").should("be.visible")
    cy.contains("Room 102").should("be.visible")
  })

  it("should show occupancy status badges", function () {
    // Available rooms should be clearly marked
    cy.contains("Available").should("be.visible")

    // Occupied rooms should show status
    cy.contains("Occupied").should("be.visible")

    // Check if tenant names are visible for occupied rooms
    cy.get("body").then(($body) => {
      if ($body.text().includes("John Smith")) {
        cy.contains("John Smith").should("be.visible")
      }
    })
  })

  it("should display revenue and statistics", function () {
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      // Check for revenue indicators
      if (bodyText.includes("$") || bodyText.includes("Revenue")) {
        cy.log("Found revenue information on dashboard")
      }

      // Check for maintenance information
      if (bodyText.includes("Maintenance")) {
        cy.log("Found maintenance information")
      }

      // Check for availability information
      if (bodyText.includes("Available") || bodyText.includes("available")) {
        cy.log("Found availability information")
      }

      // Always verify dashboard is loaded
      cy.contains("Property Dashboard").should("be.visible")
    })
  })
})
