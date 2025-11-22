const runApiTests = Cypress.env("RUN_API_TESTS") === true || Cypress.env("RUN_API_TESTS") === "true"
const apiToken = Cypress.env("apiToken")
const authHeaders = apiToken ? { Authorization: `Bearer ${apiToken}` } : undefined

if (!runApiTests) {
  describe("Unit API Integration Tests", () => {
    it("skips because RUN_API_TESTS is not true", function () {
      this.skip()
    })
  })
} else {
  describe("Unit API Integration Tests", () => {
    const baseUrl = Cypress.env("apiUrl") || "http://localhost:8080/api"
    let createdUnitId = null

    // Clean up after all tests
    after(() => {
      if (createdUnitId) {
        cy.request({
          method: "DELETE",
          url: `${baseUrl}/units/${createdUnitId}`,
          failOnStatusCode: false,
        })
      }
    })

    describe("GET /units - List All Units", () => {
      it("should retrieve all units", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/units`,
          headers: authHeaders,
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property("data")
          expect(response.body.data).to.be.an("array")

          if (response.body.data.length > 0) {
            const firstUnit = response.body.data[0]
            expect(firstUnit).to.have.property("id")
            expect(firstUnit).to.have.property("unitNumber")
            expect(firstUnit).to.have.property("unitType")
            expect(firstUnit).to.have.property("unitSize")
            expect(firstUnit).to.have.property("floor")
            expect(firstUnit).to.have.property("status")

            cy.log(`✅ Retrieved ${response.body.data.length} units`)
          } else {
            cy.log("ℹ️ No units found")
          }
        })
      })

      it("should filter units by status", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/units`,
          headers: authHeaders,
        }).then((response) => {
          expect(response.status).to.eq(200)

          const available = response.body.data.filter((u) => u.status === "AVAILABLE")
          const occupied = response.body.data.filter((u) => u.status === "OCCUPIED")
          const reserved = response.body.data.filter((u) => u.status === "RESERVED")

          cy.log(`✅ Available units: ${available.length}`)
          cy.log(`✅ Occupied units: ${occupied.length}`)
          cy.log(`✅ Reserved units: ${reserved.length}`)
        })
      })

      it("should list units by type", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/units`,
          headers: authHeaders,
        }).then((response) => {
          expect(response.status).to.eq(200)

          const typeA = response.body.data.filter((u) => u.unitType === "A")
          const typeB = response.body.data.filter((u) => u.unitType === "B")
          const typeC = response.body.data.filter((u) => u.unitType === "C")

          cy.log(`✅ Type A units: ${typeA.length}`)
          cy.log(`✅ Type B units: ${typeB.length}`)
          cy.log(`✅ Type C units: ${typeC.length}`)
        })
      })
    })

    describe("Business Logic Integration", () => {
      it("should group units by floor", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/units`,
          headers: authHeaders,
        }).then((response) => {
          expect(response.status).to.eq(200)

          const floors = {}
          response.body.data.forEach((unit) => {
            if (!floors[unit.floor]) {
              floors[unit.floor] = []
            }
            floors[unit.floor].push(unit)
          })

          Object.keys(floors).forEach((floor) => {
            cy.log(`✅ Floor ${floor}: ${floors[floor].length} units`)
          })
        })
      })

      it("should verify available units are not assigned to contracts", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/units`,
          headers: authHeaders,
        }).then((unitsResponse) => {
          const availableUnits = unitsResponse.body.data.filter((u) => u.status === "AVAILABLE")

          cy.request({
            method: "GET",
            url: `${baseUrl}/contracts`,
            headers: authHeaders,
          }).then((contractsResponse) => {
            const occupiedUnitIds = contractsResponse.body.data
              .filter((c) => c.status === "ACTIVE")
              .map((c) => c.unit.id)

            availableUnits.forEach((unit) => {
              expect(occupiedUnitIds).to.not.include(unit.id)
            })

            cy.log(`✅ Verified ${availableUnits.length} available units have no active contracts`)
          })
        })
      })
    })
  })
}
