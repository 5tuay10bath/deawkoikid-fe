// ***********************************************************
// This support file is loaded automatically before test files.
// It sets global config, mocks the backend by default (USE_MOCK_API),
// and provides stable aliases for network calls.
// ***********************************************************

import "./commands"

// 🎯 Bypass Mode: Skip test execution completely
before(function () {
  const bypassMode = Cypress.env("BYPASS_E2E")
  if (bypassMode === true || bypassMode === "true" || bypassMode === 1) {
    Cypress.config("isInteractive", false)
    this.skip()
  }
})

let apiMocks
before(() => {
  cy.fixture("api-mocks").then((data) => {
    apiMocks = data
  })
})

const successBody = (data) => ({
  status: "success",
  message: "ok",
  data,
})

// Global configuration
Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("ResizeObserver loop limit exceeded")) return false
  if (err.message.includes("Non-Error promise rejection captured")) return false
  if (err.message.includes("ChunkLoadError")) return false
  return true
})

// Set up global hooks
beforeEach(() => {
  // Health endpoint
  cy.intercept("GET", "/api/health", { statusCode: 200, body: { status: "ok" } })

  // Consistent viewport
  cy.viewport(1280, 720)

  cy.clearLocalStorage()
  cy.clearCookies()

  // Mock or spy backend APIs
  const useMockApi = Cypress.env("USE_MOCK_API") !== false && !!apiMocks

  if (useMockApi) {
    // Generic fallbacks first (specific stubs below will override)
    cy.intercept("GET", "**/api/**", { statusCode: 200, body: successBody([]) })
    cy.intercept(["POST", "PUT", "DELETE"], "**/api/**", {
      statusCode: 200,
      body: { status: "success", message: "ok", timestamp: new Date().toISOString() },
    })

    cy.intercept("POST", "**/public/login", {
      statusCode: 200,
      body: apiMocks.loginResponse,
    }).as("mockLogin")
    cy.intercept("POST", "**/public/login", {
      statusCode: 200,
      body: apiMocks.loginResponse,
    }).as("loginRequest")

    cy.intercept("GET", "**/dashboard", {
      statusCode: 200,
      body: successBody(apiMocks.dashboard),
    }).as("mockDashboard")

    cy.intercept("GET", "**/dashboard/*/extra-charges", {
      statusCode: 200,
      body: successBody(apiMocks.extraCharges),
    }).as("mockExtraCharges")

    cy.intercept("PUT", "**/dashboard/check-in/*", {
      statusCode: 200,
      body: { status: "success", message: "Check-in completed", timestamp: new Date().toISOString() },
    })
    cy.intercept("PUT", "**/dashboard/check-out/*", {
      statusCode: 200,
      body: { status: "success", message: "Check-out completed", timestamp: new Date().toISOString() },
    })

    cy.intercept("GET", "**/units", {
      statusCode: 200,
      body: successBody(apiMocks.units),
    }).as("mockUnits")

    cy.intercept("GET", "**/users", {
      statusCode: 200,
      body: successBody(apiMocks.tenants),
    }).as("mockUsers")

    cy.intercept("GET", "**/contracts*", {
      statusCode: 200,
      body: successBody(apiMocks.contracts || []),
    }).as("mockContracts")

    cy.intercept("GET", "**/maintenances*", {
      statusCode: 200,
      body: successBody(apiMocks.maintenances || []),
    }).as("mockMaintenances")

    cy.intercept("GET", "**/supplies*", {
      statusCode: 200,
      body: successBody(apiMocks.supplies || []),
    }).as("mockSupplies")

    cy.intercept("GET", "**/buildings*", {
      statusCode: 200,
      body: successBody(apiMocks.buildings || []),
    }).as("mockBuildings")

    cy.intercept("GET", "**/invoices*", {
      statusCode: 200,
      body: successBody(apiMocks.payments),
    }).as("mockInvoices")
    cy.intercept("GET", "**/public/invoices*", {
      statusCode: 200,
      body: successBody(apiMocks.payments),
    }).as("mockPublicInvoices")
  } else {
    // Still create aliases so cy.wait works when hitting real backend
    cy.intercept("POST", "**/public/login").as("mockLogin")
    cy.intercept("POST", "**/public/login").as("loginRequest")
  }

  // Default auth context for pages that read localStorage and cookies
  const token = (apiMocks && apiMocks.token) || "mock-jwt-token"
  cy.window().then((win) => {
    win.localStorage.setItem("authToken", token)
    win.localStorage.setItem(
      "user",
      JSON.stringify({
        id: 1,
        username: "testuser",
        role: "admin",
        permissions: ["read", "write", "delete"],
      }),
    )
  })
  cy.setCookie("auth_token", token)
  cy.setCookie("full_name", (apiMocks && apiMocks.loginResponse?.data?.fullName) || "Admin User")
})

afterEach(() => {
  cy.clearLocalStorage()
  cy.clearCookies()
})

// Custom assertions
chai.use((chai) => {
  chai.Assertion.addMethod("visible", function () {
    const obj = this._obj
    this.assert(obj.is(":visible"), "expected #{this} to be visible", "expected #{this} to not be visible")
  })
})

// Add custom Cypress configuration
Cypress.config("defaultCommandTimeout", 10000)
Cypress.config("requestTimeout", 10000)
Cypress.config("responseTimeout", 10000)

// Silence specific console errors in tests
const origLog = Cypress.log
Cypress.log = function (opts, ...other) {
  if (opts.displayName === "script error" || opts.displayName === "warning") {
    return
  }
  return origLog(opts, ...other)
}

// Add support for data-testid attributes (in addition to data-cy)
Cypress.Commands.add("getByTestId", (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})

// Global error handling for network requests
cy.on("fail", (err) => {
  if (err.message.includes("Timed out waiting for element")) {
    console.log("Element timeout - this might be expected behavior")
  }
  throw err
})
