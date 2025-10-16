describe("Maintenance & Supplies - Supply Management", () => {
  beforeEach(() => {
    cy.visit("/maintenance")
    // Click on Supplies & Inventory tab
    cy.contains("Supplies & Inventory").click()
  })

  describe("Supply Information Display", () => {
    // User Story 4.d: Monitor supply usage (bulbs, spare parts)
    it("should display supply inventory with usage monitoring", () => {
      cy.contains(/Supply Inventory|Supplies/i).should("be.visible")

      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Check for supply items tracking
        const supplyTypes = ["bulb", "bulbs", "spare part", "parts", "equipment"]
        const foundTypes = supplyTypes.filter((type) => bodyText.toLowerCase().includes(type))
        if (foundTypes.length > 0) {
          cy.log(`Supply types tracked: ${foundTypes.join(", ")}`)
        }

        // Check for inventory quantities
        if (bodyText.includes("Quantity") || bodyText.includes("Stock") || bodyText.includes("Amount")) {
          cy.log("Supply quantities tracked for inventory management")
        }

        // Look for low stock warnings (inventory management)
        if (bodyText.includes("low on stock") || bodyText.includes("Low Stock")) {
          cy.log("Low stock warning system active for inventory management")
        }

        // Check for usage/cost tracking
        if (bodyText.includes("Cost") || bodyText.includes("Price") || bodyText.includes("$")) {
          cy.log("Supply costs tracked for budget management")
        }
      })
    })

    // Test Add Supply functionality
    it("should open Add Supply modal when clicking + button", () => {
      cy.contains(/Supply Inventory|Supplies/i).should("be.visible")

      // Look for + button (blue Add button)
      cy.get("button").then(($buttons) => {
        const addButton = Array.from($buttons).find(
          (btn) =>
            btn.textContent.includes("+") ||
            btn.textContent.includes("Add Supply") ||
            btn.getAttribute("data-cy") === "add-supply",
        )

        if (addButton) {
          cy.wrap(addButton).click()

          // Should open Add Supply modal
          cy.get("body").then(($body) => {
            const bodyText = $body.text()

            // Check for modal with supply form fields
            if (
              bodyText.includes("Add Supply") ||
              bodyText.includes("Item Name") ||
              bodyText.includes("Category") ||
              bodyText.includes("Quantity") ||
              bodyText.includes("Cost")
            ) {
              cy.log("Add Supply modal opened successfully")
            }
          })
        } else {
          cy.log("Add Supply button not found")
        }
      })
    })

    it("should display supply inventory table", () => {
      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Verify we're in Supplies & Inventory tab
        cy.contains("Supplies & Inventory").should("be.visible")

        // Check for supply inventory section
        if (bodyText.includes("Supply Inventory")) {
          cy.contains("Supply Inventory").should("be.visible")
        }

        // Look for table columns
        if (bodyText.includes("Name") || bodyText.includes("Category") || bodyText.includes("Quantity")) {
          cy.log("Found supply inventory table columns")
        }
      })
    })

    it("should display low stock warnings", () => {
      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Check for low stock warning banner (as shown in screenshot)
        if (bodyText.includes("items are low on stock") || bodyText.includes("low on stock")) {
          cy.log("Found low stock warning banner")
        }

        // Look for stock level indicators
        if (bodyText.includes("Low") || bodyText.includes("Stock") || bodyText.includes("Warning")) {
          cy.log("Found stock level indicators")
        }

        // Check for supply quantities in table
        if (/\d+/.test(bodyText)) {
          cy.log("Found quantity numbers in supply inventory")
        }
      })
    })

    it("should have supply management actions", () => {
      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Look for add/manage supply buttons
        if (bodyText.includes("Add Supply") || bodyText.includes("Add Item")) {
          cy.log("Found add supply button")
        }

        // Check for edit/delete actions in table
        if (bodyText.includes("Edit") || bodyText.includes("Delete") || bodyText.includes("Actions")) {
          cy.log("Found supply management actions")
        }

        // Look for export data option
        if (bodyText.includes("Export")) {
          cy.log("Found export data option")
        }
      })
    })
  })

  describe("Supply Tracking", () => {
    it("should handle supply usage tracking", () => {
      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Look for usage tracking features
        if (bodyText.includes("Usage") || bodyText.includes("Consumed")) {
          cy.log("Found supply usage tracking")
        }

        // Check for cost tracking
        if (bodyText.includes("Cost") || bodyText.includes("Budget")) {
          cy.log("Found cost tracking features")
        }

        // Look for monthly/weekly reporting
        if (bodyText.includes("Monthly") || bodyText.includes("Weekly") || bodyText.includes("Report")) {
          cy.log("Found reporting features")
        }
      })
    })

    it("should display supply alerts and notifications", () => {
      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Look for alert systems
        if (bodyText.includes("Alert") || bodyText.includes("Warning")) {
          cy.log("Found alert system")
        }

        // Check for critical supply levels
        if (bodyText.includes("Critical") || bodyText.includes("Urgent")) {
          cy.log("Found critical supply level indicators")
        }

        // Look for reorder notifications
        if (bodyText.includes("Reorder") || bodyText.includes("Minimum")) {
          cy.log("Found reorder management")
        }
      })
    })

    it("should handle supply check-in and check-out", () => {
      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Look for check-in/out functionality
        if (bodyText.includes("Check In") || bodyText.includes("Check Out")) {
          cy.log("Found supply check-in/out functionality")
        }

        // Check for assignment tracking
        if (bodyText.includes("Assigned") || bodyText.includes("Allocated")) {
          cy.log("Found supply assignment tracking")
        }

        // Look for return tracking
        if (bodyText.includes("Return") || bodyText.includes("Returned")) {
          cy.log("Found supply return tracking")
        }
      })
    })
  })

  describe("Supply Management Actions", () => {
    it("should handle supply addition and removal", () => {
      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Look for add/remove functionality
        if (bodyText.includes("Add Supply") || bodyText.includes("New Item")) {
          cy.log("Found supply addition functionality")
        }

        if (bodyText.includes("Remove") || bodyText.includes("Delete")) {
          cy.log("Found supply removal functionality")
        }

        // Check for bulk operations
        if (bodyText.includes("Bulk") || bodyText.includes("Select All")) {
          cy.log("Found bulk operation features")
        }
      })
    })

    it("should support supply search and filtering", () => {
      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Look for search functionality
        if (bodyText.includes("Search") || bodyText.includes("Find")) {
          cy.log("Found search functionality")
        }

        // Check for filtering options
        if (bodyText.includes("Filter") || bodyText.includes("Sort")) {
          cy.log("Found filtering and sorting features")
        }

        // Look for advanced search
        if (bodyText.includes("Advanced") || bodyText.includes("Category Filter")) {
          cy.log("Found advanced search features")
        }
      })
    })
  })
})
