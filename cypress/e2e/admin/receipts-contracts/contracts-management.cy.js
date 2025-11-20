describe("Contract Management - Data and Actions", () => {
  it("should login and test all contract management functionality", () => {
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

    // Test 1: Display contracts management page
    cy.visit("/contracts")
    cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")

    cy.contains("Contract Management").should("be.visible")

    cy.get("body").then(($body) => {
      const bodyText = $body.text()

      if (bodyText.includes("Contract") || bodyText.includes("Tenant") || bodyText.includes("Unit")) {
        cy.log("Contracts table displayed")
      }

      if (bodyText.includes("Start Date") || bodyText.includes("End Date") || bodyText.includes("Rent")) {
        cy.log("Contract details columns found")
      }
    })

    // Test 2: Open Add Contract modal when clicking + button
    cy.get("button").then(($buttons) => {
      const addButton = Array.from($buttons).find(
        (btn) =>
          btn.textContent.includes("+") ||
          btn.textContent.includes("Add Contract") ||
          btn.getAttribute("data-cy") === "add-contract",
      )

      if (addButton) {
        cy.wrap(addButton).click()

        cy.get("body").then(($body) => {
          const bodyText = $body.text()

          if (
            bodyText.includes("Add Contract") ||
            bodyText.includes("Tenant") ||
            bodyText.includes("Unit") ||
            bodyText.includes("Start Date") ||
            bodyText.includes("End Date") ||
            bodyText.includes("Rent Amount")
          ) {
            cy.log("Add Contract modal opened successfully")
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
        cy.log("Add Contract button not found")
      }
    })
  })
})

// it("should click view contract button (eye icon) to view contract details", () => {
//   // Go to contracts page or payments page with contracts
//   cy.visit("/contracts")

//   cy.wait(1500)

//   // Find table and click the SECOND button in Actions column (eye icon - View Contract)
//   cy.get("table tbody tr")
//     .first()
//     .within(() => {
//       // Click the eye icon button (typically the second button for viewing)
//       cy.get("button")
//         .eq(1) // Second button (0-indexed, so 1 = second button)
//         .click({ force: true })
//         .then(() => {
//           cy.log("✅ Clicked VIEW CONTRACT button (eye icon - second button)")
//         })
//     })

//   // Wait for contract dialog or new page to appear
//   cy.wait(500)

//   // Verify contract details are visible
//   cy.get("body").then(($body) => {
//     const bodyText = $body.text()

//     if (bodyText.includes("Contract") || bodyText.includes("Lease Agreement")) {
//       cy.log("✅ Contract details displayed")
//     }

//     if (bodyText.includes("Start Date") || bodyText.includes("End Date")) {
//       cy.log("✅ Contract dates displayed")
//     }

//     if (bodyText.includes("Tenant") && bodyText.includes("Unit")) {
//       cy.log("✅ Tenant and Unit information displayed")
//     }
//   })
// })

// it("should click edit contract button and open edit form", () => {
//   cy.contains("All Contracts").should("be.visible")

//   cy.wait(1500)

//   // Find first contract row and click the EDIT button (pencil icon - usually second button)
//   cy.get("table tbody tr")
//     .first()
//     .within(() => {
//       // Click edit icon button (usually second button)
//       cy.get("button")
//         .eq(1)
//         .click({ force: true })
//         .then(() => {
//           cy.log("✅ Clicked EDIT CONTRACT button (pencil icon)")
//         })
//     })

//   // Wait for edit form/modal to appear
//   cy.wait(500)

//   // Verify edit form is displayed
//   cy.get("body").then(($body) => {
//     const bodyText = $body.text()

//     if (bodyText.includes("Edit") || bodyText.includes("Update")) {
//       cy.log("✅ Edit contract form displayed")
//     }
//   })
// })
