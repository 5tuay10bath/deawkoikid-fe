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

  describe("POST /units - Create Unit", () => {
    it("should create a new unit with valid data", () => {
      // First get available floors to get a valid floor UUID
      cy.request({
        method: "GET",
        url: `${baseUrl}/floors`,
      }).then((floorsResponse) => {
        if (floorsResponse.body.data && floorsResponse.body.data.length > 0) {
          const floorId = floorsResponse.body.data[0].id

          const newUnit = {
            unitNumber: `TEST-${Date.now()}`,
            unitType: "A",
            unitSize: 35.5,
            floor: floorId, // Use floor UUID
          }

          cy.request({
            method: "POST",
            url: `${baseUrl}/units`,
            body: newUnit,
          }).then((response) => {
            expect(response.status).to.be.oneOf([200, 201])
            expect(response.body).to.have.property("status")
            expect(response.body).to.have.property("message")

            // Store for cleanup
            if (response.body.data && response.body.data.id) {
              createdUnitId = response.body.data.id
            }

            cy.log("✅ Unit created successfully")
          })
        } else {
          cy.log("⚠️ No floors available for creating unit")
        }
      })
    })

    it("should return 400 for invalid unit type", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/floors`,
      }).then((floorsResponse) => {
        if (floorsResponse.body.data && floorsResponse.body.data.length > 0) {
          cy.request({
            method: "POST",
            url: `${baseUrl}/units`,
            body: {
              unitNumber: `TEST-${Date.now()}`,
              unitType: "Z", // Invalid type
              unitSize: 35.5,
              floor: floorsResponse.body.data[0].id,
            },
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.be.oneOf([400, 422])
            cy.log("✅ Validation working: rejected invalid unit type")
          })
        }
      })
    })
  })

  describe("PUT /units/:id - Update Unit", () => {
    it("should return 500 when updating non-existent unit", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/floors`,
      }).then((floorsResponse) => {
        if (floorsResponse.body.data && floorsResponse.body.data.length > 0) {
          cy.request({
            method: "PUT",
            url: `${baseUrl}/units/99999999`,
            body: {
              id: "99999999",
              unitNumber: "NON-EXISTENT",
              unitType: "A",
              unitSize: 35,
              floor: floorsResponse.body.data[0].id,
            },
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.eq(500)
            cy.log("✅ Correctly returns 500 for non-existent ID")
          })
        }
      })
    })
  })

  describe("Business Logic Integration", () => {
    it("should calculate occupancy rate", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/units`,
      }).then((response) => {
        expect(response.status).to.eq(200)

        const totalUnits = response.body.data.length
        const occupiedUnits = response.body.data.filter((u) => u.status === "OCCUPIED").length
        const occupancyRate = parseFloat(((occupiedUnits / totalUnits) * 100).toFixed(2))

        cy.log(`✅ Total units: ${totalUnits}`)
        cy.log(`✅ Occupied units: ${occupiedUnits}`)
        cy.log(`✅ Occupancy rate: ${occupancyRate}%`)

        expect(occupancyRate).to.be.a("number")
        expect(occupancyRate).to.be.within(0, 100)
      })
    })

    it("should group units by floor", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/units`,
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
      }).then((unitsResponse) => {
        const availableUnits = unitsResponse.body.data.filter((u) => u.status === "AVAILABLE")

        cy.request({
          method: "GET",
          url: `${baseUrl}/contracts`,
        }).then((contractsResponse) => {
          const occupiedUnitIds = contractsResponse.body.data.filter((c) => c.status === "ACTIVE").map((c) => c.unit.id)

          availableUnits.forEach((unit) => {
            expect(occupiedUnitIds).to.not.include(unit.id)
          })

          cy.log(`✅ Verified ${availableUnits.length} available units have no active contracts`)
        })
      })
    })
  })
})
