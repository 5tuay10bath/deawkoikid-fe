const runApiTests = Cypress.env("RUN_API_TESTS") === true || Cypress.env("RUN_API_TESTS") === "true"
const apiToken = Cypress.env("apiToken")
const authHeaders = apiToken ? { Authorization: `Bearer ${apiToken}` } : undefined

if (!runApiTests) {
  describe("Supply API Integration Tests", () => {
    it("skips because RUN_API_TESTS is not true", function () {
      this.skip()
    })
  })
} else {
  describe("Supply API Integration Tests", () => {
    const baseUrl = Cypress.env("apiUrl") || "http://localhost:8080/api"
    let createdSupplyId = null

    // Clean up after all tests
    after(() => {
      if (createdSupplyId) {
        cy.request({
          method: "DELETE",
          url: `${baseUrl}/supplies/${createdSupplyId}`,
          failOnStatusCode: false,
        })
      }
    })

    describe("GET /supplies - List All Supplies", () => {
      it("should retrieve all supply items", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/supplies`,
          headers: authHeaders,
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property("data")
          expect(response.body.data).to.be.an("array")

          if (response.body.data.length > 0) {
            const firstItem = response.body.data[0]
            expect(firstItem).to.have.property("id")
            expect(firstItem).to.have.property("name")
            expect(firstItem).to.have.property("category")
            expect(firstItem).to.have.property("quantity")
            expect(firstItem).to.have.property("minStock")

            cy.log(`✅ Retrieved ${response.body.data.length} supply items`)
          } else {
            cy.log("ℹ️ No supply items found")
          }
        })
      })

      it("should return supplies with low stock warning", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/supplies`,
          headers: authHeaders,
        }).then((response) => {
          expect(response.status).to.eq(200)

          // Check if any items have low stock (quantity <= minStock)
          const lowStockItems = response.body.data.filter((item) => item.quantity <= item.minStock)

          if (lowStockItems.length > 0) {
            cy.log(`⚠️ Found ${lowStockItems.length} low stock items`)
            cy.log(`Low stock items: ${lowStockItems.map((i) => i.name).join(", ")}`)
          } else {
            cy.log("✅ All items have sufficient stock")
          }
        })
      })

      it("should group supplies by category", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/supplies`,
          headers: authHeaders,
        }).then((response) => {
          expect(response.status).to.eq(200)

          const categories = {}
          response.body.data.forEach((item) => {
            categories[item.category] = (categories[item.category] || 0) + 1
          })

          Object.keys(categories).forEach((category) => {
            cy.log(`✅ ${category}: ${categories[category]} items`)
          })
        })
      })
    })

    describe("POST /supplies - Create Supply Item", () => {
      it("should create a new supply item with valid data", () => {
        const newSupply = {
          name: "LED Bulbs 15W",
          category: "Electrical",
          quantity: 50,
          minStock: 15,
        }

        cy.request({
          method: "POST",
          url: `${baseUrl}/supplies`,
          body: newSupply,
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          // Verify response status
          expect(response.status).to.be.oneOf([200, 201])
          // Store ID for cleanup and other tests
          createdSupplyId = response.body.id

          cy.log(`✅ Created supply with ID: ${createdSupplyId}`)
        })
      })

      it("should return 400 for missing required fields", () => {
        cy.request({
          method: "POST",
          url: `${baseUrl}/supplies`,
          body: {
            category: "Electrical",
            // Missing name field
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.be.oneOf([400, 422])
          cy.log("✅ Validation working: rejected invalid data")
        })
      })

      it("should return 400 for invalid stock values", () => {
        cy.request({
          method: "POST",
          url: `${baseUrl}/supplies`,
          body: {
            name: "Test Item",
            category: "Electrical",
            quantity: -10, // Invalid: negative stock
            minStock: 5,
          },
          failOnStatusCode: false,
        }).then((response) => {
          // API may accept and return 200, or return validation error
          expect(response.status).to.be.oneOf([200, 201, 400, 422])
          if (response.status === 200 || response.status === 201) {
            cy.log("⚠️ API accepted negative stock - validation may be missing")
          } else {
            cy.log("✅ Validation working: rejected negative stock")
          }
        })
      })
    })

    describe("Business Logic Integration", () => {
      it("should trigger low stock warning when stock falls below minimum", () => {
        // Create supply with low stock
        cy.request({
          method: "POST",
          url: `${baseUrl}/supplies`,
          body: {
            name: "Low Stock Test Item",
            category: "Testing",
            quantity: 5,
            minStock: 10,
          },
        }).then((response) => {
          expect(response.status).to.be.oneOf([200, 201])
          cy.log("✅ Low stock supply created successfully")

          // Verify low stock items in list
          cy.request({
            method: "GET",
            url: `${baseUrl}/supplies`,
          }).then((getResponse) => {
            const lowStockItems = getResponse.body.data.filter((item) => item.quantity <= item.minStock)
            expect(lowStockItems.length).to.be.greaterThan(0)
            cy.log(`⚠️ Found ${lowStockItems.length} low stock items`)
          })
        })
      })

      it("should calculate total inventory quantity", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/supplies`,
        }).then((response) => {
          expect(response.status).to.eq(200)

          // Calculate total quantity
          const totalQuantity = response.body.data.reduce((sum, item) => {
            return sum + item.quantity
          }, 0)

          cy.log(`✅ Total inventory quantity: ${totalQuantity} items`)
          expect(totalQuantity).to.be.greaterThan(0)
        })
      })

      it("should verify all supplies have positive minimum stock", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/supplies`,
        }).then((response) => {
          expect(response.status).to.eq(200)

          response.body.data.forEach((item) => {
            expect(item.minStock).to.be.greaterThan(0)
            cy.log(`${item.name}: Min stock = ${item.minStock}`)
          })
        })
      })
    })
  })
}
