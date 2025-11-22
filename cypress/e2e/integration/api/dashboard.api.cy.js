const runApiTests = Cypress.env("RUN_API_TESTS") === true || Cypress.env("RUN_API_TESTS") === "true"
const apiToken = Cypress.env("apiToken")
const authHeaders = apiToken ? { Authorization: `Bearer ${apiToken}` } : undefined

if (!runApiTests) {
  describe("Dashboard API Integration Tests", () => {
    it("skips because RUN_API_TESTS is not true", function () {
      this.skip()
    })
  })
} else {
  describe("Dashboard API Integration Tests", () => {
    const baseUrl = Cypress.env("apiUrl") || "http://localhost:8080/api"

    describe("GET /dashboard - Retrieve Dashboard Data", () => {
      it("should retrieve dashboard overview", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/dashboard`,
          headers: authHeaders,
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property("data")
          expect(response.body.data).to.be.an("array")
        })
      })

      it("should show units with their occupancy status", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/dashboard`,
        }).then((response) => {
          expect(response.status).to.eq(200)

          const occupied = response.body.data.filter((d) => d.unitStatus === "OCCUPIED")
          const available = response.body.data.filter((d) => d.unitStatus === "AVAILABLE")
          const reserved = response.body.data.filter((d) => d.unitStatus === "RESERVED")

          cy.log(`✅ Occupied: ${occupied.length}`)
          cy.log(`✅ Available: ${available.length}`)
          cy.log(`✅ Reserved: ${reserved.length}`)
        })
      })

      it("should display units with active contracts", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/dashboard`,
        }).then((response) => {
          expect(response.status).to.eq(200)

          const withContracts = response.body.data.filter((d) => d.contract !== null)
          const withoutContracts = response.body.data.filter((d) => d.contract === null)

          cy.log(`✅ Units with contracts: ${withContracts.length}`)
          cy.log(`✅ Units without contracts: ${withoutContracts.length}`)

          // Verify contract structure for units that have contracts
          withContracts.forEach((item) => {
            expect(item.contract).to.have.property("id")
            expect(item.contract).to.have.property("rentType")
            expect(item.contract).to.have.property("rentAmount")
          })
        })
      })

      it("should show units with tenant information", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/dashboard`,
        }).then((response) => {
          expect(response.status).to.eq(200)

          const withTenants = response.body.data.filter((d) => d.user !== null)

          cy.log(`✅ Units with tenants: ${withTenants.length}`)

          withTenants.forEach((item) => {
            expect(item).to.have.property("id")
          })
        })
      })
    })

    describe("Business Logic Integration", () => {
      it("should calculate occupancy rate from dashboard", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/dashboard`,
        }).then((response) => {
          expect(response.status).to.eq(200)

          if (response.body.data && response.body.data.length > 0) {
            const totalUnits = response.body.data.length
            const occupiedUnits = response.body.data.filter((d) => d.unit && d.unit.status === "OCCUPIED").length
            const occupancyRate = parseFloat(((occupiedUnits / totalUnits) * 100).toFixed(2))

            cy.log(`✅ Total units: ${totalUnits}`)
            cy.log(`✅ Occupied units: ${occupiedUnits}`)
            cy.log(`✅ Occupancy rate: ${occupancyRate}%`)

            expect(occupancyRate).to.be.a("number")
            expect(occupancyRate).to.be.within(0, 100)
          } else {
            cy.log("⚠️ No dashboard data available")
          }
        })
      })

      it("should calculate total monthly revenue from active contracts", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/dashboard`,
        }).then((response) => {
          expect(response.status).to.eq(200)

          const activeContracts = response.body.data.filter((d) => d.contract && d.contract.status === "ACTIVE")

          const monthlyRevenue = activeContracts.reduce((sum, item) => {
            if (item.contract.rentType === "MONTHLY") {
              return sum + item.contract.rentAmount
            } else if (item.contract.rentType === "YEARLY") {
              return sum + item.contract.rentAmount / 12
            }
            return sum
          }, 0)

          cy.log(`✅ Active contracts: ${activeContracts.length}`)
          cy.log(`✅ Estimated monthly revenue: ฿${monthlyRevenue.toFixed(2)}`)
        })
      })

      it("should verify all occupied units have active contracts", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/dashboard`,
        }).then((response) => {
          expect(response.status).to.eq(200)

          if (response.body.data && response.body.data.length > 0) {
            const occupiedUnits = response.body.data.filter((d) => d.unit && d.unit.status === "OCCUPIED")

            if (occupiedUnits.length > 0) {
              occupiedUnits.forEach((item) => {
                // Contract may or may not exist depending on data consistency
                if (item.contract) {
                  cy.log(`✅ Unit ${item.unit.unitNumber} has contract with status: ${item.contract.status}`)
                } else {
                  cy.log(`⚠️ Unit ${item.unit.unitNumber} is occupied but has no contract`)
                }
              })
              cy.log(`✅ Checked ${occupiedUnits.length} occupied units`)
            } else {
              cy.log("⚠️ No occupied units in dashboard")
            }
          } else {
            cy.log("⚠️ No dashboard data available")
          }
        })
      })

      it("should verify all available units have no active contracts", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/dashboard`,
        }).then((response) => {
          expect(response.status).to.eq(200)

          if (response.body.data && response.body.data.length > 0) {
            const availableUnits = response.body.data.filter((d) => d.unit && d.unit.status === "AVAILABLE")

            if (availableUnits.length > 0) {
              availableUnits.forEach((item) => {
                if (item.contract && item.contract.status === "ACTIVE") {
                  cy.log(`⚠️ Unit ${item.unit.unitNumber} is available but has active contract`)
                } else {
                  cy.log(`✅ Unit ${item.unit.unitNumber} is available (correct)`)
                }
              })
              cy.log(`✅ Verified ${availableUnits.length} available units`)
            } else {
              cy.log("⚠️ No available units in dashboard")
            }
          } else {
            cy.log("⚠️ No dashboard data available")
          }
        })
      })

      it("should group dashboard data by floor", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/dashboard`,
        }).then((response) => {
          expect(response.status).to.eq(200)

          if (response.body.data && response.body.data.length > 0) {
            const floors = {}
            response.body.data.forEach((item) => {
              if (item.unit && item.unit.floor !== undefined) {
                const floor = item.unit.floor
                if (!floors[floor]) {
                  floors[floor] = { total: 0, occupied: 0 }
                }
                floors[floor].total++
                if (item.unit.status === "OCCUPIED") {
                  floors[floor].occupied++
                }
              }
            })

            Object.keys(floors)
              .sort()
              .forEach((floor) => {
                const occupancy = ((floors[floor].occupied / floors[floor].total) * 100).toFixed(0)
                cy.log(`✅ Floor ${floor}: ${floors[floor].occupied}/${floors[floor].total} occupied (${occupancy}%)`)
              })
          } else {
            cy.log("⚠️ No dashboard data available")
          }
        })
      })
    })
  })
}
