const runApiTests = Cypress.env("RUN_API_TESTS") === true || Cypress.env("RUN_API_TESTS") === "true"
const apiToken = Cypress.env("apiToken")
const authHeaders = apiToken ? { Authorization: `Bearer ${apiToken}` } : undefined

if (!runApiTests) {
  describe("Maintenance API Integration Tests", () => {
    it("skips because RUN_API_TESTS is not true", function () {
      this.skip()
    })
  })
} else {
  describe("Maintenance API Integration Tests", () => {
    const baseUrl = Cypress.env("apiUrl") || "http://localhost:8080/api"
    let createdMaintenanceId = null

    // Clean up after all tests
    after(() => {
      if (createdMaintenanceId) {
        cy.request({
          method: "DELETE",
          url: `${baseUrl}/maintenances/${createdMaintenanceId}`,
          failOnStatusCode: false,
        })
      }
    })

    describe("GET /maintenances - List All Maintenance Requests", () => {
      it("should retrieve all maintenance requests", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/maintenances`,
          headers: authHeaders,
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property("data")
          expect(response.body.data).to.be.an("array")

          if (response.body.data.length > 0) {
            const firstMaintenance = response.body.data[0]
            expect(firstMaintenance).to.have.property("id")
            expect(firstMaintenance).to.have.property("title")
            expect(firstMaintenance).to.have.property("description")
            expect(firstMaintenance).to.have.property("priority")
            expect(firstMaintenance).to.have.property("maintenanceType")
            expect(firstMaintenance).to.have.property("status")

            cy.log(`✅ Retrieved ${response.body.data.length} maintenance requests`)
          } else {
            cy.log("ℹ️ No maintenance requests found")
          }
        })
      })

      it("should filter maintenance by priority", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/maintenances`,
          headers: authHeaders,
        }).then((response) => {
          expect(response.status).to.eq(200)

          const low = response.body.data.filter((m) => m.priority === "LOW")
          const medium = response.body.data.filter((m) => m.priority === "MEDIUM")
          const high = response.body.data.filter((m) => m.priority === "HIGH")
          const urgent = response.body.data.filter((m) => m.priority === "URGENT")

          cy.log(`✅ Low priority: ${low.length}`)
          cy.log(`✅ Medium priority: ${medium.length}`)
          cy.log(`✅ High priority: ${high.length}`)
          cy.log(`✅ Urgent priority: ${urgent.length}`)
        })
      })

      it("should group maintenance by type", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/maintenances`,
          headers: authHeaders,
        }).then((response) => {
          expect(response.status).to.eq(200)

          const types = {}
          response.body.data.forEach((m) => {
            types[m.maintenanceType] = (types[m.maintenanceType] || 0) + 1
          })

          Object.keys(types).forEach((type) => {
            cy.log(`✅ ${type}: ${types[type]} requests`)
          })
        })
      })

      it("should filter maintenance by status", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/maintenances`,
          headers: authHeaders,
        }).then((response) => {
          expect(response.status).to.eq(200)

          const statuses = {}
          response.body.data.forEach((m) => {
            statuses[m.status] = (statuses[m.status] || 0) + 1
          })

          Object.keys(statuses).forEach((status) => {
            cy.log(`✅ ${status}: ${statuses[status]} requests`)
          })
        })
      })
    })

    describe("Business Logic Integration", () => {
      it("should count urgent maintenance requests", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/maintenances`,
          headers: authHeaders,
        }).then((response) => {
          expect(response.status).to.eq(200)

          const urgentRequests = response.body.data.filter((m) => m.priority === "URGENT")
          const highPriorityRequests = response.body.data.filter((m) => m.priority === "HIGH")

          cy.log(`✅ Urgent requests: ${urgentRequests.length}`)
          cy.log(`✅ High priority requests: ${highPriorityRequests.length}`)

          if (urgentRequests.length > 0) {
            cy.log("⚠️ WARNING: There are urgent maintenance requests requiring immediate attention!")
          }
        })
      })

      it("should verify maintenance scheduled dates are valid", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/maintenances`,
        }).then((response) => {
          expect(response.status).to.eq(200)

          const now = new Date()
          response.body.data.forEach((maintenance) => {
            const scheduledDate = new Date(maintenance.scheduledAt)

            // Scheduled date should be a valid date
            expect(scheduledDate.toString()).to.not.equal("Invalid Date")

            cy.log(`Maintenance: ${maintenance.title} - Scheduled: ${scheduledDate.toLocaleDateString()}`)
          })
        })
      })

      it("should group maintenance by unit", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/maintenances`,
        }).then((response) => {
          expect(response.status).to.eq(200)

          const byUnit = {}
          response.body.data.forEach((m) => {
            const unitId = m.unit.id
            byUnit[unitId] = (byUnit[unitId] || 0) + 1
          })

          Object.keys(byUnit).forEach((unitId) => {
            cy.log(`✅ Unit ${unitId}: ${byUnit[unitId]} maintenance requests`)
          })
        })
      })

      it("should identify maintenance types requiring most attention", () => {
        cy.request({
          method: "GET",
          url: `${baseUrl}/maintenances`,
        }).then((response) => {
          expect(response.status).to.eq(200)

          // Find pending maintenance by type
          const pendingByType = {}
          response.body.data
            .filter((m) => m.status === "PENDING" || m.status === "IN_PROGRESS")
            .forEach((m) => {
              pendingByType[m.maintenanceType] = (pendingByType[m.maintenanceType] || 0) + 1
            })

          const sortedTypes = Object.entries(pendingByType).sort((a, b) => b[1] - a[1])

          cy.log("📊 Pending maintenance by type:")
          sortedTypes.forEach(([type, count]) => {
            cy.log(`✅ ${type}: ${count} pending`)
          })
        })
      })
    })
  })
}
