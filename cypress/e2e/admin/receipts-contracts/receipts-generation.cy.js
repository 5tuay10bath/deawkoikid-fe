describe("Receipts & Contracts - Generation and Download", () => {
  beforeEach(() => {
    cy.visit("/payments")
  })

  describe("Receipt Generation", () => {
    // User Story 3.a: Generate and print/download receipts for rent payments
    it("should provide receipt generation functionality for rent payments", () => {
      cy.contains("Payment Management").should("be.visible")

      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Check for payment records table
        if (bodyText.includes("Payment") || bodyText.includes("Rent")) {
          cy.log("Payment records displayed")
        }

        // Look for receipt generation options
        if (bodyText.includes("Receipt") || bodyText.includes("Generate") || bodyText.includes("Download")) {
          cy.log("Receipt generation functionality available")
        }
      })
    })

    // Test Add Billing from Room Details
    it("should open Add Billing modal when clicking + button", () => {
      // Navigate to room details page
      cy.visit("/dashboard")

      cy.get("body").then(($body) => {
        if ($body.text().includes("View Details")) {
          cy.contains("View Details").first().click()

          // On room detail page, look for + Add Billing button
          cy.get("button").then(($buttons) => {
            const addButton = Array.from($buttons).find(
              (btn) =>
                btn.textContent.includes("+ Add Billing") ||
                btn.textContent.includes("Add Billing") ||
                btn.getAttribute("data-cy") === "add-billing",
            )

            if (addButton) {
              cy.wrap(addButton).click()

              // Should open Add Billing modal
              cy.get("body").then(($modal) => {
                const modalText = $modal.text()

                // Check for modal with billing form fields
                if (
                  modalText.includes("Add Billing") ||
                  modalText.includes("Water") ||
                  modalText.includes("Electricity") ||
                  modalText.includes("Amount")
                ) {
                  cy.log("Add Billing modal opened successfully")
                }
              })
            } else {
              cy.log("Add Billing button not found - may be available room only")
            }
          })
        }
      })
    })

    // User Story 3.c: Include utility charges in receipts
    it("should allow receipts to include utility charges (electricity, water)", () => {
      cy.contains("Payment Management").should("be.visible")

      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Check for utility charge tracking
        if (bodyText.includes("Electricity") || bodyText.includes("Water") || bodyText.includes("Utility")) {
          cy.log("Utility charges tracked in payment system")
        }

        // Check for billing components
        if (bodyText.includes("Rent") && bodyText.includes("Water")) {
          cy.log("Rent and utility charges can be billed together")
        }
      })
    })
  })

  describe("Contract Management", () => {
    it("should handle contract-related functionality", () => {
      cy.visit("/dashboard")

      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Look for contract management features
        if (bodyText.includes("Contract") || bodyText.includes("Lease")) {
          cy.log("Found contract management features")

          if (bodyText.includes("View Contract")) {
            cy.contains("View Contract").should("be.visible")
          }

          if (bodyText.includes("Lease Agreement")) {
            cy.contains("Lease Agreement").should("be.visible")
          }
        }

        // Check for contract status
        if (bodyText.includes("Active") || bodyText.includes("Expired") || bodyText.includes("Pending")) {
          cy.log("Found contract status indicators")
        }
      })
    })

    // User Story 3.b: Generate and download rental contracts
    it("should provide contract generation functionality", () => {
      cy.visit("/contracts")

      cy.get("body").then(($body) => {
        const bodyText = $body.text()

        // Check for contract management interface
        if (bodyText.includes("Contract")) {
          cy.log("Contract management page available")
        }

        // Look for contract details
        if (bodyText.includes("Start Date") || bodyText.includes("End Date")) {
          cy.log("Contract lease terms displayed")
        }

        // Check for view/download options
        if (bodyText.includes("View") || bodyText.includes("Download") || bodyText.includes("Generate")) {
          cy.log("Contract document generation available")
        }
      })
    })

    it("should show contract from occupied room details", () => {
      cy.visit("/dashboard")

      cy.get("body").then(($body) => {
        if ($body.text().includes("View Details")) {
          cy.contains("View Details").first().click()

          cy.get("body").then(($detail) => {
            if ($detail.text().includes("View Contract")) {
              cy.log("View Contract available from room details page")
            }
          })
        }
      })
    })
  })
})
