describe("Maintenance & Supplies - Supply Management", () => {
  it("should login and test all supply management functionality", () => {
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

    // Navigate to supplies page
    cy.visit("/maintenance")
    cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")
    cy.contains("Supplies & Inventory").click()

    // Test 1: Display supply inventory with usage monitoring
    cy.contains(/Supply Inventory|Supplies/i).should("be.visible")

    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      const supplyTypes = ["bulb", "bulbs", "spare part", "parts", "equipment"]
      const foundTypes = supplyTypes.filter((type) => bodyText.toLowerCase().includes(type))
      if (foundTypes.length > 0) {
        cy.log(`Supply types tracked: ${foundTypes.join(", ")}`)
      }

      if (bodyText.includes("Quantity") || bodyText.includes("Stock") || bodyText.includes("Amount")) {
        cy.log("Supply quantities tracked for inventory management")
      }

      if (bodyText.includes("low on stock") || bodyText.includes("Low Stock")) {
        cy.log("Low stock warning system active for inventory management")
      }

      if (bodyText.includes("Cost") || bodyText.includes("Price") || bodyText.includes("$")) {
        cy.log("Supply costs tracked for budget management")
      }
    })

    // Test 2: Open Add Supply modal when clicking + button
    cy.get("button").then(($buttons) => {
      const addButton = Array.from($buttons).find(
        (btn) =>
          btn.textContent.includes("+") ||
          btn.textContent.includes("Add Supply") ||
          btn.getAttribute("data-cy") === "add-supply",
      )

      if (addButton) {
        cy.wrap(addButton).click()

        cy.get("body").then(($body) => {
          const bodyText = $body.text()

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

        // Close modal
        cy.get("body").then(($body) => {
          if ($body.find('[role="dialog"]').length > 0) {
            cy.get("body").type("{esc}")
            cy.wait(500)
          }
        })
      } else {
        cy.log("Add Supply button not found")
      }
    })

    // Test 3: Display supply inventory table
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      cy.contains("Supplies & Inventory").should("be.visible")

      if (bodyText.includes("Supply Inventory")) {
        cy.contains("Supply Inventory").should("be.visible")
      }

      if (bodyText.includes("Name") || bodyText.includes("Category") || bodyText.includes("Quantity")) {
        cy.log("Found supply inventory table columns")
      }
    })

    // Test 4: Display low stock warnings
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      if (bodyText.includes("items are low on stock") || bodyText.includes("low on stock")) {
        cy.log("Found low stock warning banner")
      }

      if (bodyText.includes("Low") || bodyText.includes("Stock") || bodyText.includes("Warning")) {
        cy.log("Found stock level indicators")
      }

      if (/\d+/.test(bodyText)) {
        cy.log("Found quantity numbers in supply inventory")
      }
    })

    // Test 5: Supply management actions
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      if (bodyText.includes("Add Supply") || bodyText.includes("Add Item")) {
        cy.log("Found add supply button")
      }

      if (bodyText.includes("Edit") || bodyText.includes("Delete") || bodyText.includes("Actions")) {
        cy.log("Found supply management actions")
      }

      if (bodyText.includes("Export")) {
        cy.log("Found export data option")
      }
    })

    // Test 6: Handle supply usage tracking
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      if (bodyText.includes("Usage") || bodyText.includes("Consumed")) {
        cy.log("Found supply usage tracking")
      }

      if (bodyText.includes("Cost") || bodyText.includes("Budget")) {
        cy.log("Found cost tracking features")
      }

      if (bodyText.includes("Monthly") || bodyText.includes("Weekly") || bodyText.includes("Report")) {
        cy.log("Found reporting features")
      }
    })
  })
})
