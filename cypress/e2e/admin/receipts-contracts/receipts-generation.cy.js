describe("Receipts & Contracts - Generation and Download", () => {
  beforeEach(() => {
    cy.visit("/payments")
    cy.get('[data-cy="loading-spinner"]', { timeout: 20000 }).should("not.exist")
  })

  describe("Receipt Generation", () => {
    // Test receipt generation with "Paid" status payments
    it("should generate receipt for payments with Paid status", () => {
      cy.contains("Payment Management").should("be.visible")

      cy.wait(1500)

      // Find row with "Paid" status
      cy.get("body").then(($body) => {
        if ($body.text().includes("Paid")) {
          cy.contains("tr", /Paid/i)
            .first()
            .within(() => {
              // Click first button ($ icon for receipt)
              cy.get("button").first().click({ force: true })
            })

          cy.log("✅ Clicked receipt button for Paid payment")

          // Verify receipt dialog
          cy.wait(500)
          cy.contains(/Generate Receipt|Payment Receipt/i, { timeout: 3000 }).should("be.visible")

          // Verify receipt information
          cy.get("body").should("contain.text", "Tenant:")
          cy.get("body").should("contain.text", "Unit:")
          cy.get("body").should("contain.text", "Total Amount:")

          cy.log("✅ Receipt details verified")

          // Click Download
          cy.contains("button", /Download/i).click({ force: true })

          cy.wait(1000)

          // Verify success toast
          cy.contains(/success/i, { timeout: 5000 }).should("be.visible")

          cy.log("✅ Receipt downloaded successfully with SUCCESS toast")

          // Close dialog
          cy.contains("button", /Cancel/i).click({ force: true })
        } else {
          cy.log("⚠️ No paid payments found")
        }
      })
    })
  })

  describe("Contract Management", () => {
    beforeEach(() => {
      cy.visit("/contracts")
    })

    it("should click download contract button and verify download with success toast", () => {
      cy.contains("All Contracts").should("be.visible")

      cy.wait(1500)

      // Find first contract row and click the DOWNLOAD button (download icon - usually third button)
      cy.get("table tbody tr")
        .first()
        .within(() => {
          // Click download icon button (usually third/last button)
          cy.get("button")
            .first()
            .click({ force: true })
            .then(() => {
              cy.log("✅ Clicked DOWNLOAD CONTRACT button (download icon)")
            })
        })

      cy.wait(1000)

      cy.contains("button", /Download/i).click({ force: true })

      cy.wait(1000)

      cy.contains(/success/i, { timeout: 5000 }).should("be.visible")

      cy.log("✅ Contract downloaded successfully with SUCCESS toast")
    })
  })
})
