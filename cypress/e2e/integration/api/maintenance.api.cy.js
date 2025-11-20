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

  describe("POST /maintenances - Create Maintenance Request", () => {
    it("should create a new maintenance request with valid data", () => {
      // First get a unit and users
      cy.request({
        method: "GET",
        url: `${baseUrl}/units`,
      }).then((unitsResponse) => {
        if (unitsResponse.body.data.length > 0) {
          cy.request({
            method: "GET",
            url: `${baseUrl}/users`,
          }).then((usersResponse) => {
            if (usersResponse.body.data.length > 0) {
              const unit = unitsResponse.body.data[0]
              const reporter = usersResponse.body.data[0]

              const newMaintenance = {
                unitId: unit.id,
                title: "Integration Test - Air Conditioner Not Working",
                description: "The air conditioner in the living room is not cooling properly",
                priority: "HIGH",
                maintenanceType: "AIR_CONDITIONAL",
                reportedById: reporter.id,
                assignedToId: reporter.id, // Required field
                scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
              }

              cy.request({
                method: "POST",
                url: `${baseUrl}/maintenances`,
                body: newMaintenance,
              }).then((response) => {
                expect(response.status).to.be.oneOf([200, 201])
                expect(response.body).to.have.property("status")
                expect(response.body).to.have.property("message")

                // Store for cleanup
                if (response.body.data && response.body.data.id) {
                  createdMaintenanceId = response.body.data.id
                }

                cy.log("✅ Maintenance request created successfully")
              })
            }
          })
        } else {
          cy.log("⚠️ No units or users available for test")
        }
      })
    })

    it("should return 400 for missing required fields", () => {
      cy.request({
        method: "POST",
        url: `${baseUrl}/maintenances`,
        body: {
          title: "Test",
          // Missing other required fields
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422])
        cy.log("✅ Validation working: rejected incomplete data")
      })
    })

    it("should return 400 for invalid priority", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/units`,
      }).then((unitsResponse) => {
        if (unitsResponse.body.data.length > 0) {
          cy.request({
            method: "GET",
            url: `${baseUrl}/users`,
          }).then((usersResponse) => {
            if (usersResponse.body.data.length > 0) {
              cy.request({
                method: "POST",
                url: `${baseUrl}/maintenances`,
                body: {
                  unitId: unitsResponse.body.data[0].id,
                  title: "Test",
                  description: "Test description",
                  priority: "INVALID", // Invalid priority
                  maintenanceType: "ELECTRIC",
                  reportedById: usersResponse.body.data[0].id,
                  scheduledAt: new Date().toISOString(),
                },
                failOnStatusCode: false,
              }).then((response) => {
                expect(response.status).to.be.oneOf([400, 422])
                cy.log("✅ Validation working: rejected invalid priority")
              })
            }
          })
        }
      })
    })

    it("should return 400 for invalid maintenance type", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/units`,
      }).then((unitsResponse) => {
        if (unitsResponse.body.data.length > 0) {
          cy.request({
            method: "GET",
            url: `${baseUrl}/users`,
          }).then((usersResponse) => {
            if (usersResponse.body.data.length > 0) {
              cy.request({
                method: "POST",
                url: `${baseUrl}/maintenances`,
                body: {
                  unitId: unitsResponse.body.data[0].id,
                  title: "Test",
                  description: "Test description",
                  priority: "HIGH",
                  maintenanceType: "INVALID_TYPE", // Invalid type
                  reportedById: usersResponse.body.data[0].id,
                  scheduledAt: new Date().toISOString(),
                },
                failOnStatusCode: false,
              }).then((response) => {
                expect(response.status).to.be.oneOf([400, 422])
                cy.log("✅ Validation working: rejected invalid maintenance type")
              })
            }
          })
        }
      })
    })

    it("should create maintenance with optional assignee", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/units`,
      }).then((unitsResponse) => {
        if (unitsResponse.body.data.length > 0) {
          cy.request({
            method: "GET",
            url: `${baseUrl}/users`,
          }).then((usersResponse) => {
            if (usersResponse.body.data.length >= 2) {
              const unit = unitsResponse.body.data[0]
              const reporter = usersResponse.body.data[0]
              const assignee = usersResponse.body.data[1]

              cy.request({
                method: "POST",
                url: `${baseUrl}/maintenances`,
                body: {
                  unitId: unit.id,
                  title: "Test with Assignee",
                  description: "Test description",
                  priority: "MEDIUM",
                  maintenanceType: "ELECTRIC",
                  assignedToId: assignee.id, // Optional field
                  reportedById: reporter.id,
                  scheduledAt: new Date().toISOString(),
                },
              }).then((response) => {
                expect(response.status).to.be.oneOf([200, 201])
                cy.log("✅ Maintenance created with assignee")
              })
            }
          })
        }
      })
    })
  })

  describe("Business Logic Integration", () => {
    it("should count urgent maintenance requests", () => {
      cy.request({
        method: "GET",
        url: `${baseUrl}/maintenances`,
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
