// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Property Management Custom Commands

/**
 * Login command for authentication - Updated for CI/CD compatibility
 */
Cypress.Commands.add("login", (email = "admin@apt.com", password = "admin") => {
  cy.session(
    [email, password],
    () => {
      // Intercept login API call
      cy.intercept("POST", "**/public/login").as("loginRequest")

      cy.visit("/login")
      cy.wait(500)

      // Fill in credentials
      cy.get('[data-cy="email-input"]', { timeout: 10000 })
        .should("be.visible")
        .clear({ force: true })
        .type(email, { force: true })

      cy.get('[data-cy="password-input"]').clear({ force: true }).type(password, { force: true })

      // Submit login
      cy.get('[data-cy="login-button"]').click({ force: true })

      // Wait for login API to complete
      cy.wait("@loginRequest", { timeout: 30000 })

      // Verify redirect and auth
      cy.url({ timeout: 30000 }).should("not.include", "/login")
      cy.getCookie("auth_token").should("exist")
    },
    {
      cacheAcrossSpecs: true,
    },
  )
})

/**
 * Navigate to specific page with proper loading wait
 */
Cypress.Commands.add("navigateTo", (page) => {
  cy.visit(`/${page}`)
  cy.get('[data-cy="loading-spinner"]', { timeout: 2000 }).should("not.exist")
  cy.get('[data-cy="page-content"]').should("be.visible")
})

/**
 * Create a new tenant with default or custom data
 */
Cypress.Commands.add("createTenant", (tenantData = {}) => {
  const defaultTenant = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    emergencyContact: "Jane Doe",
    emergencyPhone: "+1-555-0124",
  }

  const tenant = { ...defaultTenant, ...tenantData }

  cy.get('[data-cy="add-tenant"]').click()
  cy.get('[data-cy="tenant-first-name"]').type(tenant.firstName)
  cy.get('[data-cy="tenant-last-name"]').type(tenant.lastName)
  cy.get('[data-cy="tenant-email"]').type(tenant.email)
  cy.get('[data-cy="tenant-phone"]').type(tenant.phone)
  cy.get('[data-cy="emergency-contact"]').type(tenant.emergencyContact)
  cy.get('[data-cy="emergency-phone"]').type(tenant.emergencyPhone)
  cy.get('[data-cy="save-tenant"]').click()

  return cy.wrap(tenant)
})

/**
 * Assign tenant to room
 */
Cypress.Commands.add(
  "assignTenantToRoom",
  (tenantName, roomNumber, startDate = "2024-10-01", endDate = "2025-09-30") => {
    cy.get('[data-cy="assign-tenant"]').click()
    cy.get('[data-cy="select-tenant"]').select(tenantName)
    cy.get('[data-cy="select-room"]').select(`Room ${roomNumber}`)
    cy.get('[data-cy="lease-start-date"]').type(startDate)
    cy.get('[data-cy="lease-end-date"]').type(endDate)
    cy.get('[data-cy="monthly-rent"]').type("800")
    cy.get('[data-cy="confirm-assignment"]').click()
  },
)

/**
 * Create maintenance task
 */
Cypress.Commands.add("createMaintenanceTask", (taskData = {}) => {
  const defaultTask = {
    type: "General Maintenance",
    unit: "Room 101",
    description: "Routine maintenance check",
    priority: "Medium",
    scheduledDate: "2024-10-15",
    estimatedCost: "100",
  }

  const task = { ...defaultTask, ...taskData }

  cy.get('[data-cy="add-maintenance-task"]').click()
  cy.get('[data-cy="task-type"]').select(task.type)
  cy.get('[data-cy="task-unit"]').select(task.unit)
  cy.get('[data-cy="task-description"]').type(task.description)
  cy.get('[data-cy="task-priority"]').select(task.priority)
  cy.get('[data-cy="task-scheduled-date"]').type(task.scheduledDate)
  cy.get('[data-cy="task-estimated-cost"]').type(task.estimatedCost)
  cy.get('[data-cy="save-maintenance-task"]').click()

  return cy.wrap(task)
})

/**
 * Wait for table to load with data
 */
Cypress.Commands.add("waitForTableData", (tableSelector = '[data-cy="data-table"]') => {
  cy.get(tableSelector).should("be.visible")
  cy.get(`${tableSelector} [data-cy="loading-row"]`, { timeout: 1000 }).should("not.exist")
  cy.get(`${tableSelector} tbody tr`).should("have.length.at.least", 1)
})

/**
 * Search and filter table data
 */
Cypress.Commands.add("searchTable", (searchTerm, searchFieldSelector = '[data-cy="table-search"]') => {
  cy.get(searchFieldSelector).clear().type(searchTerm)
  cy.get('[data-cy="search-loading"]', { timeout: 2000 }).should("not.exist")
})

/**
 * Verify toast notification
 */
Cypress.Commands.add("verifyToast", (message, type = "success") => {
  cy.get(`[data-cy="${type}-toast"]`).should("be.visible").and("contain", message)
  cy.get(`[data-cy="${type}-toast"]`).should("not.exist", { timeout: 6000 })
})

/**
 * Check room availability for specific dates
 */
Cypress.Commands.add("checkRoomAvailability", (roomNumber, startDate, endDate) => {
  cy.get('[data-cy="check-availability"]').click()
  cy.get('[data-cy="availability-room"]').select(`Room ${roomNumber}`)
  cy.get('[data-cy="availability-start-date"]').type(startDate)
  cy.get('[data-cy="availability-end-date"]').type(endDate)
  cy.get('[data-cy="check-availability-button"]').click()
})

/**
 * Generate receipt
 */
Cypress.Commands.add("generateReceipt", (tenantName, amount, description = "Monthly Rent") => {
  cy.get('[data-cy="generate-receipt"]').click()
  cy.get('[data-cy="receipt-tenant"]').select(tenantName)
  cy.get('[data-cy="receipt-amount"]').type(amount)
  cy.get('[data-cy="receipt-description"]').type(description)
  cy.get('[data-cy="receipt-date"]').type(new Date().toISOString().split("T")[0])
  cy.get('[data-cy="save-receipt"]').click()
})

/**
 * Export data with format selection
 */
Cypress.Commands.add("exportData", (format = "Excel", includeOptions = []) => {
  cy.get('[data-cy="export-data"]').click()
  cy.get('[data-cy="export-format"]').select(format)

  includeOptions.forEach((option) => {
    cy.get(`[data-cy="include-${option}"]`).check()
  })

  cy.get('[data-cy="generate-export"]').click()
})

/**
 * Navigate through pagination
 */
Cypress.Commands.add("goToPage", (pageNumber) => {
  cy.get(`[data-cy="page-${pageNumber}"]`).click()
  cy.get('[data-cy="loading-spinner"]', { timeout: 2000 }).should("not.exist")
})

/**
 * Set date range filter
 */
Cypress.Commands.add("setDateRange", (startDate, endDate) => {
  cy.get('[data-cy="date-range-picker"]').click()
  cy.get('[data-cy="start-date"]').clear().type(startDate)
  cy.get('[data-cy="end-date"]').clear().type(endDate)
  cy.get('[data-cy="apply-date-range"]').click()
})

/**
 * Clear all filters
 */
Cypress.Commands.add("clearAllFilters", () => {
  cy.get('[data-cy="clear-filters"]').click()
  cy.get('[data-cy="filters-cleared-toast"]').should("be.visible")
})

/**
 * Drag and drop for file uploads
 */
Cypress.Commands.add("uploadFile", (fileName, fileType = "image/jpeg") => {
  cy.fixture(fileName).then((fileContent) => {
    cy.get('[data-cy="file-upload"]').selectFile(
      {
        contents: Cypress.Buffer.from(fileContent),
        fileName: fileName,
        mimeType: fileType,
      },
      { force: true },
    )
  })
})

/**
 * Wait for API response
 */
Cypress.Commands.add("waitForApi", (aliasName) => {
  cy.wait(aliasName).then((interception) => {
    expect(interception.response.statusCode).to.be.oneOf([200, 201, 204])
  })
})

/**
 * Mock API responses for testing
 */
Cypress.Commands.add("mockApiResponse", (method, url, response, statusCode = 200) => {
  cy.intercept(method, url, {
    statusCode: statusCode,
    body: response,
  }).as("mockedApi")
})

// Add support for data-cy attribute selection
Cypress.Commands.add("getByDataCy", (selector) => {
  return cy.get(`[data-cy="${selector}"]`)
})

// Add support for within data-cy contexts
Cypress.Commands.add("withinDataCy", (selector, callback) => {
  return cy.get(`[data-cy="${selector}"]`).within(callback)
})

/**
 * Verify table row count
 */
Cypress.Commands.add("verifyRowCount", (expectedCount) => {
  cy.get('[data-cy="table-row"]').should("have.length", expectedCount)
})

/**
 * Sort table by column
 */
Cypress.Commands.add("sortTableBy", (columnName, direction = "asc") => {
  cy.get(`[data-cy="sort-${columnName}"]`).click()
  if (direction === "desc") {
    cy.get(`[data-cy="sort-${columnName}"]`).click()
  }
})

/**
 * Bulk select items
 */
Cypress.Commands.add("bulkSelect", (itemIndices) => {
  itemIndices.forEach((index) => {
    cy.get('[data-cy="table-row"]')
      .eq(index)
      .within(() => {
        cy.get('[data-cy="row-checkbox"]').check()
      })
  })
})

/**
 * Wait for element to be visible with custom timeout
 */
Cypress.Commands.add("waitForVisible", (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should("be.visible")
})

// Example of how to use these commands:
// cy.login()
// cy.navigateTo('tenants')
// cy.createTenant({ firstName: 'Jane', lastName: 'Smith' })
// cy.verifyToast('Tenant created successfully')
// cy.waitForTableData()
// cy.searchTable('Jane Smith')
