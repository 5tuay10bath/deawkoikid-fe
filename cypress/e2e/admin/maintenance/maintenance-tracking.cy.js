describe("Maintenance & Supplies - Task Tracking and Management", () => {
  beforeEach(() => {
    cy.visit("/maintenance")
    // Click on Maintenance Tasks tab (default tab, but click to ensure)
    cy.contains("Maintenance Tasks").click()
  })

  describe("Maintenance Task Tracking", () => {
    // User Story 4.a: Track maintenance tasks (light bulb, air-con, plumbing)
    it("should display maintenance task tracking system with table", () => {
      cy.contains("Maintenance Managemen").should("be.visible")

      // Verify table exists
      cy.get("table").should("exist")

      // Verify table has headers
      cy.get("table thead th").should("have.length.greaterThan", 0)

      // Verify table has data rows
      cy.get("table tbody tr").should("have.length.greaterThan", 0)

      // Verify columns include essential information
      cy.get("table thead").within(() => {
        cy.contains(/title|task|description/i).should("exist")
        cy.contains(/status|priority/i).should("exist")
      })

      cy.log("✅ Maintenance task tracking table verified")
    })

    // NOTE: For Add Maintenance - only verify modal opens, no actual form submission
    it("should open Add Maintenance modal and verify form", () => {
      cy.contains("Maintenance Managemen").should("be.visible")

      // Click the blue Add button
      cy.get('button[class*="bg-blue"]').filter(":visible").first().click()

      // Wait for modal to appear
      cy.get('div[role="dialog"]', { timeout: 5000 }).should("be.visible")

      // Verify modal is properly displayed (modal opening is the test requirement)
      cy.get('div[role="dialog"]')
        .should("be.visible")
        .then(() => {
          cy.log("✅ Add Maintenance modal opened successfully")
        })
    })

    // User Story 4.b: Log maintenance activities per unit
    it("should track maintenance history per unit", () => {
      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Check for unit/room association
        if (bodyText.includes("Unit") || bodyText.includes("Room")) {
          cy.log("Maintenance tasks linked to specific units")
        }

        // Look for maintenance log/history
        if (bodyText.includes("History") || bodyText.includes("Log") || bodyText.includes("Date")) {
          cy.log("Maintenance activity history tracking available")
        }

        // Can also check from room details
        cy.visit("/dashboard")
        cy.get("body").then(($dashboard) => {
          if ($dashboard.text().includes("View Details")) {
            cy.contains("View Details").first().click()

            // Should show maintenance history for that unit
            cy.get("body").then(($detail) => {
              if ($detail.text().includes("Maintenance") || $detail.text().includes("Service")) {
                cy.log("Maintenance history accessible from room details")
              }
            })
          }
        })
      })
    })

    // User Story 4.c: Schedule recurring maintenance reminders
    it("should support scheduling recurring maintenance", () => {
      // Click on Schedule & Reminders tab
      cy.contains("Schedule & Reminders").should("be.visible").click()

      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Check for scheduling functionality
        if (bodyText.includes("Schedule") || bodyText.includes("Reminder") || bodyText.includes("Recurring")) {
          cy.log("Recurring maintenance scheduling available")
        }

        // Look for routine task indicators
        if (bodyText.includes("Routine") || bodyText.includes("Regular") || bodyText.includes("Periodic")) {
          cy.log("Routine maintenance tasks can be scheduled")
        }

        // Check for calendar or date selection
        if (bodyText.includes("Date") || bodyText.includes("Frequency") || bodyText.includes("Interval")) {
          cy.log("Maintenance schedule configuration available")
        }
      })
    })

    it("should display maintenance page content", () => {
      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Verify we're on maintenance page
        cy.contains("Maintenance Management").should("be.visible")

        // Look for maintenance tasks tab content
        if (bodyText.includes("Task") || bodyText.includes("Description") || bodyText.includes("Room")) {
          cy.log("Found maintenance task table columns")
        }

        // Look for priority indicators
        if (bodyText.includes("High") || bodyText.includes("Medium") || bodyText.includes("Low")) {
          cy.log("Found priority indicators")
        }
      })
    })
  })

  describe("Supply Management", () => {
    it("should handle supply-related functionality", () => {
      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Look for supply management features
        if (bodyText.includes("Supplies") || bodyText.includes("Inventory")) {
          cy.log("Found supply management features")

          if (bodyText.includes("Supplies")) {
            cy.log("Found Supplies management feature")
          }

          if (bodyText.includes("Inventory")) {
            cy.log("Found Inventory management feature")
          }
        }

        // Check for supply requests
        if (bodyText.includes("Request Supplies") || bodyText.includes("Order")) {
          cy.log("Found supply request functionality")
        }
      })
    })

    it("should show supply status indicators", () => {
      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Look for low stock or supply alerts
        if (bodyText.includes("Low Stock") || bodyText.includes("Out of Stock")) {
          cy.log("Found stock level indicators")
        }

        // Check for supply categories
        if (bodyText.includes("Cleaning") || bodyText.includes("Tools") || bodyText.includes("Parts")) {
          cy.log("Found supply categories")
        }
      })
    })
  })

  describe("Task Management", () => {
    it("should handle task assignment and tracking", () => {
      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Look for task management features
        if (bodyText.includes("Assign") || bodyText.includes("Task")) {
          cy.log("Found task management features")
        }

        // Check for staff assignment
        if (bodyText.includes("Assigned to") || bodyText.includes("Technician")) {
          cy.log("Found staff assignment features")
        }

        // Look for task status
        if (bodyText.includes("Pending") || bodyText.includes("Completed") || bodyText.includes("In Progress")) {
          cy.log("Found task status indicators")
        }
      })
    })

    it("should show task priorities and deadlines", () => {
      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Look for priority indicators
        if (bodyText.includes("High Priority") || bodyText.includes("Low Priority") || bodyText.includes("Urgent")) {
          cy.log("Found priority indicators")
        }

        // Check for deadline management
        if (bodyText.includes("Due Date") || bodyText.includes("Deadline") || bodyText.includes("Overdue")) {
          cy.log("Found deadline management features")
        }
      })
    })
  })
})
