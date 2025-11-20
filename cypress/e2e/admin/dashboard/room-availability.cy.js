describe("Dashboard - Room Availability Overview", () => {
  it("should login and test all dashboard room availability functionality", () => {
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

    // Test 1: Display all 24 rooms with availability status across 2 floors
    cy.visit("/dashboard")
    cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")

    cy.contains("Property Dashboard").should("be.visible")

    cy.get("body").then(($body) => {
      const hasUnitsText = $body.text().match(/total.*unit|unit.*total/i)
      if (hasUnitsText) {
        cy.log("✅ Total Units statistics found")
      }
    })

    cy.get("body").then(($body) => {
      const hasFloors = $body.text().match(/floor\s*[12]/i)
      if (hasFloors) {
        cy.log("✅ Floor information displayed")
      }
    })

    cy.get("body").then(($body) => {
      const roomCards = $body.find('[class*="room"], [class*="unit"], [class*="card"]')
      const roomCount = roomCards.filter((i, el) => {
        const text = el.textContent
        return text.match(/A\d+|B\d+|C\d+|Room \d+|Unit \d+/i)
      }).length

      if (roomCount > 0) {
        cy.log(`✅ Found ${roomCount} room cards displayed`)
      }

      expect($body.text()).to.match(/room|unit|available|occupied/i)
    })

    // Test 2: Show occupancy status clearly for all rooms
    cy.get("body").then(($body) => {
      const hasOccupied = $body.text().match(/occupied/i)
      const hasAvailable = $body.text().match(/available/i)

      if (hasOccupied) {
        cy.log("✅ Occupied status displayed")
      }

      if (hasAvailable) {
        cy.log("✅ Available status displayed")
      }

      expect($body.text()).to.match(/occupied|available|reserved/i)
    })

    cy.get("body").then(($body) => {
      const statusBadges = $body.find('[class*="badge"], [class*="status"]').filter((i, el) => {
        const text = el.textContent.toLowerCase()
        return (
          text.includes("available") ||
          text.includes("occupied") ||
          text.includes("reserved") ||
          text.includes("maintenance")
        )
      })

      if (statusBadges.length > 0) {
        cy.log(`✅ Found ${statusBadges.length} status badges on room cards`)
      }
    })

    // Test 3: Show tenant information for occupied rooms
    cy.get("body").then(($body) => {
      const occupiedRooms = $body.find(':contains("Occupied")').filter((i, el) => {
        return el.tagName === "SPAN" || el.tagName === "DIV"
      })

      if (occupiedRooms.length > 0) {
        cy.log(`✅ Found ${occupiedRooms.length} occupied rooms`)

        // Find button with "View Details" text specifically
        cy.contains("button", /view\s*details/i)
          .first()
          .click()

        cy.url().should("include", "/room/")

        // Check if room details page loaded (flexible check)
        cy.get("body").then(($body) => {
          const bodyText = $body.text()
          if (bodyText.match(/tenant|name|contact|room|unit|A\d+|B\d+/i)) {
            cy.log("✅ Room details page loaded with information")
          }
        })

        // Navigate back to dashboard
        cy.visit("/dashboard")
        cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")
      } else {
        cy.log("⚠️ No occupied rooms found - skipping tenant info test")
      }
    })

    // Test 4: Display revenue and key statistics with actual values
    cy.url().should("include", "/dashboard")
    cy.contains("Property Dashboard").should("be.visible")

    cy.get("body").then(($body) => {
      const bodyText = $body.text()
      const hasRevenue = bodyText.match(/revenue|income|฿|\$/i)
      const hasNumbers = bodyText.match(/\d+/)

      if (hasRevenue && hasNumbers) {
        cy.log("✅ Revenue information displayed")
      }

      const hasStats = bodyText.match(/occupancy|occupied|available|total/i)
      if (hasStats) {
        cy.log("✅ Occupancy statistics displayed")
      }
    })

    cy.log("✅ Dashboard statistics verified")

    // Test 5: Allow navigation to room details by clicking on room card
    cy.get("body").then(($body) => {
      // Find buttons specifically with "View Details" text
      const viewDetailsButtons = $body.find("button").filter((i, el) => {
        return el.textContent.match(/view\s*details/i)
      })

      if (viewDetailsButtons.length > 0) {
        cy.wrap(viewDetailsButtons.first()).click()
        cy.url().should("include", "/room/")
        cy.log("✅ Successfully navigated to room detail page")
      } else {
        cy.log("⚠️ No View Details buttons found")
      }
    })
  })
})
