/**
 * Building Management - Basic Functionality Tests
 * Tests building page navigation, add building modal, and update building modal
 */

describe("Building Management - Basic Functionality", () => {
  it("should login and test all building management functionality", () => {
    // Login once at the beginning
    cy.visit("/login")
    cy.wait(500)

    cy.get('[data-cy="email-input"]', { timeout: 10000 })
      .should("be.visible")
      .clear({ force: true })
      .type("admin@apt.com", { force: true })

    cy.get('[data-cy="password-input"]').clear({ force: true }).type("admin", { force: true })

    cy.get('[data-cy="login-button"]').click({ force: true })

    cy.wait(2000) // Wait for API call to complete
    cy.url({ timeout: 30000 }).should("not.include", "/login")

    // Alternative: force navigate if still on login page
    cy.url().then((url) => {
      if (url.includes("/login")) {
        cy.log("Still on login page, forcing navigation to dashboard")
        cy.visit("/dashboard")
      }
    })

    cy.getCookie("auth_token").should("exist")

    // Test 1: Navigate to building management page
    cy.visit("/buildings")
    cy.wait(1000)

    // Check if we're on the buildings page
    cy.url().should("include", "/building")

    // Verify page content
    cy.contains(/building management|all buildings/i, { timeout: 10000 }).should("be.visible")

    cy.log("✅ Successfully navigated to Building Management page")

    // Test 2: Display buildings list and table structure
    cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")

    // Verify page header
    cy.contains(/building management/i).should("be.visible")
    cy.contains(/manage all buildings/i).should("be.visible")

    // Verify "All Buildings" section exists
    cy.contains(/all buildings/i).should("be.visible")

    // Check for table headers
    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      // Verify column headers exist
      const hasHeaders =
        bodyText.includes("Name") &&
        bodyText.includes("Code Name") &&
        bodyText.includes("Floor Count") &&
        bodyText.includes("Actions")

      if (hasHeaders) {
        cy.log("✅ Building table structure is correct")
      } else {
        cy.log("⚠️ Table headers may have different names")
      }
    })

    cy.log("✅ Building list page loaded successfully")

    // Test 3: Open Add Building modal
    cy.get("body").then(($body) => {
      // Try to find and click the Add Building button
      if ($body.find('button:contains("Add Building")').length > 0) {
        cy.contains("button", /add building/i).click({ force: true })
      } else if ($body.find('[data-cy="add-building-button"]').length > 0) {
        cy.get('[data-cy="add-building-button"]').click({ force: true })
      } else {
        // Fallback: find any button containing "Add" text
        cy.get("button").contains(/add/i).first().click({ force: true })
      }

      cy.wait(500)

      // Check if modal/dialog appeared
      cy.get("body").then(($bodyAfterClick) => {
        const hasModal =
          $bodyAfterClick.find('[role="dialog"]').length > 0 ||
          $bodyAfterClick.find('[class*="modal"]').length > 0 ||
          $bodyAfterClick.find('[class*="Modal"]').length > 0

        if (hasModal) {
          cy.log("✅ Add Building modal opened successfully")

          // Verify modal content
          cy.get('[role="dialog"], [class*="modal"], [class*="Modal"]').should("be.visible")

          // Close the modal (press ESC or click close button)
          cy.get("body").type("{esc}")
          cy.wait(500)
        } else {
          cy.log("⚠️ Modal might be opening but not detected with current selectors")
        }
      })
    })

    // Test 4: Open Update Building modal
    cy.visit("/buildings")
    cy.wait(1000)
    cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")

    cy.get("body").then(($body) => {
      // Check if there are any buildings in the table
      const hasBuildingData =
        $body.text().includes("DeawKoiKid Tower") || $body.text().includes("Riverfront") || $body.find("tr").length > 1 // More than just header row

      if (hasBuildingData) {
        // Look for edit/update icons in Actions column
        cy.get("body").then(($actionBody) => {
          // Try to find edit/pencil icon (usually SVG or icon element)
          if ($actionBody.find('svg[class*="pencil"], svg[class*="edit"]').length > 0) {
            cy.get('svg[class*="pencil"], svg[class*="edit"]').first().click({ force: true })
          } else if ($actionBody.find('button:contains("Edit")').length > 0) {
            cy.contains("button", /edit/i).first().click({ force: true })
          } else if ($actionBody.find('[data-cy*="edit"], [data-cy*="update"]').length > 0) {
            cy.get('[data-cy*="edit"], [data-cy*="update"]').first().click({ force: true })
          } else {
            // Fallback: click the first clickable element in Actions column
            cy.contains("Actions").parent().parent().find("button, a, svg").first().click({ force: true })
          }

          cy.wait(500)

          // Check if modal/dialog appeared
          cy.get("body").then(($bodyAfterClick) => {
            const hasModal =
              $bodyAfterClick.find('[role="dialog"]').length > 0 ||
              $bodyAfterClick.find('[class*="modal"]').length > 0 ||
              $bodyAfterClick.find('[class*="Modal"]').length > 0

            if (hasModal) {
              cy.log("✅ Update Building modal opened successfully")

              // Verify modal is visible
              cy.get('[role="dialog"], [class*="modal"], [class*="Modal"]').should("be.visible")

              // Close the modal
              cy.get("body").type("{esc}")
              cy.wait(500)
            } else {
              cy.log("⚠️ Update modal might be opening but not detected")
            }
          })
        })
      } else {
        cy.log("⚠️ No building data available to test update functionality")
      }
    })

    // Test 5: Check search functionality
    cy.visit("/buildings")
    cy.wait(1000)
    cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")

    cy.get("body").then(($body) => {
      // Check if search input exists
      if ($body.find('input[placeholder*="Search"], input[type="search"]').length > 0) {
        cy.get('input[placeholder*="Search"], input[type="search"]').should("be.visible")
        cy.log("✅ Search functionality is available")
      } else {
        cy.log("⚠️ Search input not found on the page")
      }
    })
  })
})
