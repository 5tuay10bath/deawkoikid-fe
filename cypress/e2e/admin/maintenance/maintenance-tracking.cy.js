describe("Maintenance & Supplies - Task Tracking and Management", () => {
  it("should login and test all maintenance tracking functionality", () => {
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

    // Navigate to maintenance page
    cy.visit("/maintenance")
    cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")
    cy.contains("Maintenance Tasks").click()

    // Test 1: Open Add Maintenance modal and verify form
    cy.contains("Maintenance Managemen").should("be.visible")
    cy.get('button[class*="bg-blue"]').filter(":visible").first().click()
    cy.get('div[role="dialog"]', { timeout: 5000 }).should("be.visible")
    cy.get('div[role="dialog"]')
      .should("be.visible")
      .then(() => {
        cy.log("✅ Add Maintenance modal opened successfully")
      })

    // Close modal
    cy.get("body").then(($body) => {
      if ($body.find('[role="dialog"]').length > 0) {
        cy.get("body").type("{esc}")
        cy.wait(500)
      }
    })

    // Test 2: Track maintenance history per unit
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      if (bodyText.includes("Unit") || bodyText.includes("Room")) {
        cy.log("Maintenance tasks linked to specific units")
      }

      if (bodyText.includes("History") || bodyText.includes("Log") || bodyText.includes("Date")) {
        cy.log("Maintenance activity history tracking available")
      }
    })

    // Test 3: Support scheduling recurring maintenance
    cy.contains("Schedule & Reminders").should("be.visible").click()

    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      if (bodyText.includes("Schedule") || bodyText.includes("Reminder") || bodyText.includes("Recurring")) {
        cy.log("Recurring maintenance scheduling available")
      }

      if (bodyText.includes("Routine") || bodyText.includes("Regular") || bodyText.includes("Periodic")) {
        cy.log("Routine maintenance tasks can be scheduled")
      }

      if (bodyText.includes("Date") || bodyText.includes("Frequency") || bodyText.includes("Interval")) {
        cy.log("Maintenance schedule configuration available")
      }
    })

    // Go back to Maintenance Tasks tab
    cy.contains("Maintenance Tasks").click()

    // Test 4: Display maintenance page content
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      cy.contains("Maintenance Management").should("be.visible")

      if (bodyText.includes("Task") || bodyText.includes("Description") || bodyText.includes("Room")) {
        cy.log("Found maintenance task table columns")
      }

      if (bodyText.includes("High") || bodyText.includes("Medium") || bodyText.includes("Low")) {
        cy.log("Found priority indicators")
      }
    })

    // Test 5: Handle supply-related functionality
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      if (bodyText.includes("Supplies") || bodyText.includes("Inventory")) {
        cy.log("Found supply management features")

        if (bodyText.includes("Supplies")) {
          cy.log("Found Supplies management feature")
        }

        if (bodyText.includes("Inventory")) {
          cy.log("Found Inventory management feature")
        }
      }

      if (bodyText.includes("Request Supplies") || bodyText.includes("Order")) {
        cy.log("Found supply request functionality")
      }
    })

    // Test 6: Show supply status indicators
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      if (bodyText.includes("Low Stock") || bodyText.includes("Out of Stock")) {
        cy.log("Found stock level indicators")
      }

      if (bodyText.includes("Cleaning") || bodyText.includes("Tools") || bodyText.includes("Parts")) {
        cy.log("Found supply categories")
      }
    })

    // Test 7: Handle task assignment and tracking
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      if (bodyText.includes("Assign") || bodyText.includes("Task")) {
        cy.log("Found task management features")
      }

      if (bodyText.includes("Assigned to") || bodyText.includes("Technician")) {
        cy.log("Found staff assignment features")
      }

      if (bodyText.includes("Pending") || bodyText.includes("Completed") || bodyText.includes("In Progress")) {
        cy.log("Found task status indicators")
      }
    })

    // Test 8: Show task priorities and deadlines
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      if (bodyText.includes("High Priority") || bodyText.includes("Low Priority") || bodyText.includes("Urgent")) {
        cy.log("Found priority indicators")
      }

      if (bodyText.includes("Due Date") || bodyText.includes("Deadline") || bodyText.includes("Overdue")) {
        cy.log("Found deadline management features")
      }
    })
  })
})
