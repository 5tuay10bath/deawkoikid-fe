describe("Basic App Functionality", () => {
  it("should login and test all basic functionality", () => {
    // Login once at the beginning
    cy.visit("/login")
    cy.wait(500)

    cy.get('[data-cy="email-input"]', { timeout: 10000 })
      .should("be.visible")
      .clear({ force: true })
      .type("admin@apt.com", { force: true })

    cy.get('[data-cy="password-input"]').clear({ force: true }).type("admin", { force: true })

    cy.get('[data-cy="login-button"]').click({ force: true })

    // Wait for redirect and verify login
    cy.url({ timeout: 30000 }).should("not.include", "/login")

    // Alternative: force navigate if still on login page
    cy.url().then((url) => {
      if (url.includes("/login")) {
        cy.log("Still on login page, forcing navigation to dashboard")
        cy.visit("/dashboard")
      }
    })

    cy.getCookie("auth_token").should("exist")

    // Test 1: Load the dashboard page with basic content
    cy.visit("/dashboard")
    cy.contains("Property Dashboard").should("be.visible")
    cy.contains("Total Units").should("be.visible")

    cy.get("body").then(($body) => {
      if ($body.text().includes("Floor")) {
        cy.contains(/Floor \d+/i).should("be.visible")
      }
    })

    // Test 2: Direct navigation to tenants page
    cy.visit("/tenants")
    cy.url().should("include", "/tenants")
    cy.contains("Tenant Management").should("be.visible")

    // Test 3: Direct navigation to units page
    cy.visit("/units")
    cy.url().should("include", "/units")
    cy.contains("Unit Management").should("be.visible")

    // Test 4: Navigate back to dashboard
    cy.visit("/dashboard")
    cy.url().should("include", "/dashboard")
    cy.contains("Property Dashboard").should("be.visible")

    // Test 5: Load tenants page details
    cy.visit("/tenants")
    cy.contains("Tenant Management").should("be.visible")
    cy.contains("Total Tenants").should("be.visible")

    // Test 6: Load units page details
    cy.visit("/units")
    cy.contains("Unit Management").should("be.visible")
    cy.contains("All Units").should("be.visible")
  })
})
