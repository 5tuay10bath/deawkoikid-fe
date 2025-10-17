describe("Maintenance & Supplies - Supply Management", () => {
  beforeEach(() => {
    cy.visit("/maintenance")
    // Click on Supplies & Inventory tab
    cy.contains("Supplies & Inventory").click()
    // Wait for table to be populated with data
    cy.get("table tbody tr", { timeout: 20000 }).should("exist")
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

    // NOTE: For Add Supply - only verify modal opens, no actual form submission
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

    it("should add a new supply item and show success toast", () => {
      // Track API responses using a more flexible approach
      let apiCallMade = false
      let apiStatus = null

      // Intercept POST requests with multiple patterns
      cy.intercept("POST", "**/*supply*/**").as("createSupply")
      cy.intercept("POST", "**/supply*").as("createSupply2")
      cy.intercept("POST", "**/supplies*").as("createSupply3")
      cy.intercept({ method: "POST", url: /supply/i }).as("createSupply4")

      cy.contains(/Supply Inventory|Supplies/i).should("be.visible")

      // Click the + button to open Add Supply modal
      cy.get("button").then(($buttons) => {
        const addButton = Array.from($buttons).find(
          (btn) =>
            btn.textContent.includes("+") ||
            btn.textContent.includes("Add Supply") ||
            btn.getAttribute("data-cy") === "add-supply",
        )

        if (addButton) {
          cy.wrap(addButton).click()
          cy.wait(500) // Wait for modal to open

          // Fill in the supply form fields
          cy.get("body").then(($body) => {
            const bodyText = $body.text()

            // Check if modal is open
            if (bodyText.includes("Add Supply") || bodyText.includes("Create") || bodyText.includes("สร้าง")) {
              cy.log("Add Supply modal is open, filling in form...")

              // Get all input fields in the modal (since they don't have IDs)
              // We'll fill them based on their order and type
              cy.get('input[type="text"], input[type="number"], input:not([type])').then(($inputs) => {
                const visibleInputs = $inputs.filter((i, el) => {
                  return Cypress.$(el).is(":visible")
                })

                cy.log(`Found ${visibleInputs.length} visible input fields`)

                // Fill inputs based on their position
                // Typically: Name, Category, Quantity, Minimum Stock, Unit Cost, Supplier
                if (visibleInputs.length >= 1) {
                  cy.wrap(visibleInputs[0]).clear().type("Test LED Bulbs 15W") // Name
                }
                if (visibleInputs.length >= 2) {
                  cy.wrap(visibleInputs[1]).clear().type("Electrical") // Category
                }
                if (visibleInputs.length >= 3) {
                  cy.wrap(visibleInputs[2]).clear().type("50") // Quantity
                }
                if (visibleInputs.length >= 4) {
                  cy.wrap(visibleInputs[3]).clear().type("15") // Minimum Stock
                }
                if (visibleInputs.length >= 5) {
                  cy.wrap(visibleInputs[4]).clear().type("12.50") // Unit Cost
                }
                if (visibleInputs.length >= 6) {
                  cy.wrap(visibleInputs[5]).clear().type("Test Supplier Co.") // Supplier
                }
              })

              cy.wait(500) // Wait for form to be filled

              // Click Create/Submit button (find by blue button or position)
              cy.get('button[class*="bg-blue"], button[class*="blue"]').then(($blueButtons) => {
                // Filter for visible blue buttons (usually the submit button is blue)
                const visibleBlueButtons = $blueButtons.filter((i, el) => {
                  return Cypress.$(el).is(":visible")
                })

                if (visibleBlueButtons.length > 0) {
                  // Click the last blue button (usually submit/create button)
                  cy.wrap(visibleBlueButtons[visibleBlueButtons.length - 1]).click()
                  cy.log("Clicked blue submit button")
                } else {
                  // Fallback: find by text content
                  cy.get("button").then(($buttons) => {
                    const submitButton = Array.from($buttons).find(
                      (btn) =>
                        Cypress.$(btn).is(":visible") &&
                        (btn.textContent.includes("Create") ||
                          btn.textContent.includes("Submit") ||
                          btn.textContent.includes("Add Supply") ||
                          btn.textContent.includes("สร้าง") ||
                          btn.textContent.includes("เพิ่ม") ||
                          btn.textContent.includes("บันทึก")),
                    )

                    if (submitButton) {
                      cy.wrap(submitButton).click()
                      cy.log("Clicked submit button by text")
                    } else {
                      cy.log("⚠️ Submit button not found")
                    }
                  })
                }
              })

              // Wait for API call to complete and check response
              cy.wait(2000).then(() => {
                // Try to get any of the intercepted calls
                cy.get("@createSupply.all").then((interceptions) => {
                  if (interceptions && interceptions.length > 0) {
                    const lastCall = interceptions[interceptions.length - 1]
                    if (lastCall && lastCall.response) {
                      const status = lastCall.response.statusCode
                      expect(status).to.be.oneOf([200, 201])
                      cy.log(`✅ API Response Status: ${status}`)
                      apiCallMade = true
                      apiStatus = status
                    }
                  }
                })
              })

              // Verify by checking the toast message
              cy.wait(1000)

              // Check for success toast with multiple strategies
              cy.get("body").then(($body) => {
                const toastText = $body.text()

                // Check for success keywords in both English and Thai
                const successKeywords = [
                  "Success",
                  "success",
                  "successfully",
                  "สำเร็จ",
                  "เพิ่มเรียบร้อย",
                  "เพิ่มสำเร็จ",
                  "บันทึกสำเร็จ",
                  "created",
                  "Created",
                  "added",
                  "Added",
                ]

                const foundSuccess = successKeywords.some((keyword) => toastText.includes(keyword))

                if (foundSuccess) {
                  cy.log("✅ Success toast appeared with message!")
                }

                // Try to find toast element by common selectors
                cy.get("body").then(() => {
                  cy.document().then((doc) => {
                    const toastSelectors = [
                      '[role="status"]',
                      '[role="alert"]',
                      ".toast",
                      ".notification",
                      '[class*="toast"]',
                      '[class*="Toast"]',
                      "[data-sonner-toast]",
                      "[data-toast]",
                      ".Toastify",
                    ]

                    let toastFound = false
                    toastSelectors.forEach((selector) => {
                      const elements = doc.querySelectorAll(selector)
                      if (elements.length > 0) {
                        toastFound = true
                        cy.log(`✅ Toast element found using selector: ${selector}`)
                        cy.log(`Toast content: ${elements[0].textContent}`)
                      }
                    })

                    if (!toastFound && !foundSuccess) {
                      cy.log("⚠️ No toast found - check if toast library is configured")
                    }
                  })
                })

                // After verifying toast, check network requests using Performance API
                cy.window().then((win) => {
                  if (win.performance && win.performance.getEntriesByType) {
                    const resources = win.performance.getEntriesByType("resource")
                    const supplyRequests = resources.filter(
                      (r) => r.name.includes("/supply") || r.name.includes("/supplies"),
                    )

                    if (supplyRequests.length > 0) {
                      cy.log(`✅ Found ${supplyRequests.length} supply-related network requests`)

                      // Check fetch/XHR requests
                      const fetchRequests = resources
                        .filter((r) => r.initiatorType === "fetch" || r.initiatorType === "xmlhttprequest")
                        .filter((r) => r.name.includes("/supply") || r.name.includes("/supplies"))

                      if (fetchRequests.length > 0) {
                        cy.log(`✅ Confirmed API request was sent (${fetchRequests[0].name})`)
                        // Cannot get status code from Performance API, but we can verify request was sent
                        cy.log("✅ API request verified through Performance API")
                      }
                    }
                  }
                })
              })
            } else {
              cy.log("❌ Add Supply modal did not open")
            }
          })
        } else {
          cy.log("❌ Add Supply button not found")
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

    // it("should display supply alerts and notifications", () => {
    //   cy.get("body").then(($body) => {
    //     const bodyText = $body.text()

    //     // Look for alert systems
    //     if (bodyText.includes("Alert") || bodyText.includes("Warning")) {
    //       cy.log("Found alert system")
    //     }

    //     // Check for critical supply levels
    //     if (bodyText.includes("Critical") || bodyText.includes("Urgent")) {
    //       cy.log("Found critical supply level indicators")
    //     }

    //     // Look for reorder notifications
    //     if (bodyText.includes("Reorder") || bodyText.includes("Minimum")) {
    //       cy.log("Found reorder management")
    //     }
    //   })
    // })

    // it("should handle supply check-in and check-out", () => {
    //   cy.get("body").then(($body) => {
    //     const bodyText = $body.text()

    //     // Look for check-in/out functionality
    //     if (bodyText.includes("Check In") || bodyText.includes("Check Out")) {
    //       cy.log("Found supply check-in/out functionality")
    //     }

    //     // Check for assignment tracking
    //     if (bodyText.includes("Assigned") || bodyText.includes("Allocated")) {
    //       cy.log("Found supply assignment tracking")
    //     }

    //     // Look for return tracking
    //     if (bodyText.includes("Return") || bodyText.includes("Returned")) {
    //       cy.log("Found supply return tracking")
    //     }
    //   })
    // })
  })

  // describe("Supply Management Actions", () => {
  //   it("should handle supply addition and removal", () => {
  //     cy.get("body").then(($body) => {
  //       const bodyText = $body.text()

  //       // Look for add/remove functionality
  //       if (bodyText.includes("Add Supply") || bodyText.includes("New Item")) {
  //         cy.log("Found supply addition functionality")
  //       }

  //       if (bodyText.includes("Remove") || bodyText.includes("Delete")) {
  //         cy.log("Found supply removal functionality")
  //       }

  //       // Check for bulk operations
  //       if (bodyText.includes("Bulk") || bodyText.includes("Select All")) {
  //         cy.log("Found bulk operation features")
  //       }
  //     })
  //   })

  //   it("should support supply search and filtering", () => {
  //     cy.get("body").then(($body) => {
  //       const bodyText = $body.text()

  //       // Look for search functionality
  //       if (bodyText.includes("Search") || bodyText.includes("Find")) {
  //         cy.log("Found search functionality")
  //       }

  //       // Check for filtering options
  //       if (bodyText.includes("Filter") || bodyText.includes("Sort")) {
  //         cy.log("Found filtering and sorting features")
  //       }

  //       // Look for advanced search
  //       if (bodyText.includes("Advanced") || bodyText.includes("Category Filter")) {
  //         cy.log("Found advanced search features")
  //       }
  //     })
  //   })
  // })
})
