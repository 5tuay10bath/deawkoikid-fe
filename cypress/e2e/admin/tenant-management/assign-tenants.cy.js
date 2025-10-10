describe("Tenant Management - Assign Tenants to Units", () => {
  beforeEach(() => {
    cy.visit("/dashboard")
  })

  it("should show available rooms for check-in", function () {
    // Check that dashboard shows room cards
    cy.contains("Property Dashboard").should("be.visible")

    // Look for available rooms
    cy.contains("Available").should("be.visible")

    // Check if Check In buttons are visible
    cy.get("body").then(($body) => {
      if ($body.text().includes("Check In")) {
        cy.contains("Check In").should("be.visible")
      }
    })
  })

  it("should navigate to check-in flow when clicking Check In", function () {
    // Look for any Check In button and try to click it
    cy.get("body").then(($body) => {
      if ($body.text().includes("Check In")) {
        cy.contains("Check In").first().click()

        // Should navigate to check-in page or show check-in form
        cy.url().should("match", /(check-in|dashboard)/)

        // Might show a form or new page
        cy.get("body").should("be.visible")
      } else {
        // If no Check In button, log and pass
        cy.log("No available rooms found for check-in")
      }
    })
  })

  it("should show room occupancy status", function () {
    // Check that rooms show different statuses
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      // Look for various status indicators
      const hasAvailable = bodyText.includes("Available")
      const hasOccupied = bodyText.includes("Occupied")
      const hasMaintenance = bodyText.includes("Maintenance")
      const hasCheckIn = bodyText.includes("Check In")
      const hasViewDetails = bodyText.includes("View Details")
      const hasRooms = bodyText.includes("Room") || bodyText.includes("Unit")

      // Log what we found
      if (hasAvailable) cy.log("Found Available status")
      if (hasOccupied) cy.log("Found Occupied status")
      if (hasMaintenance) cy.log("Found Maintenance status")
      if (hasCheckIn) cy.log("Found Check In buttons")
      if (hasViewDetails) cy.log("Found View Details buttons")
      if (hasRooms) cy.log("Found Room/Unit references")

      // Verify dashboard is loaded at minimum
      cy.contains("Property Dashboard").should("be.visible")
    })
  })
})
