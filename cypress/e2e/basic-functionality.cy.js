describe('Basic App Functionality', () => {
  it('should load the dashboard page with basic content', () => {
    cy.visit('/dashboard')
    
    // Wait for page to load and check basic content
    cy.contains('Property Dashboard').should('be.visible')
    cy.contains('Total Units').should('be.visible')
    cy.contains('24').should('be.visible') // Total units count
    cy.contains('Floor 1').should('be.visible')
    cy.contains('Floor 2').should('be.visible')
  })

  it('should show room cards on dashboard', () => {
    cy.visit('/dashboard')
    
    // Look for any element containing "Room" text
    cy.contains('Room 101').should('be.visible')
    cy.contains('Room 102').should('be.visible')
    
    // Check for status badges
    cy.contains('Available').should('be.visible')
    cy.contains('Occupied').should('be.visible')
  })

  it('should allow direct navigation to pages', () => {
    // Test direct navigation instead of clicking links
    cy.visit('/tenants')
    cy.url().should('include', '/tenants')
    cy.contains('Tenant Management').should('be.visible')
    
    cy.visit('/units')  
    cy.url().should('include', '/units')
    cy.contains('Unit Management').should('be.visible')
    
    cy.visit('/dashboard')
    cy.url().should('include', '/dashboard')
    cy.contains('Property Dashboard').should('be.visible')
  })

  it('should load tenants page', () => {
    cy.visit('/tenants')
    
    // Check tenants page loads
    cy.contains('Tenant Management').should('be.visible')
    cy.contains('Total Tenants').should('be.visible')
  })

  it('should load units page', () => {
    cy.visit('/units')
    
    // Check units page loads
    cy.contains('Unit Management').should('be.visible')
    cy.contains('All Units').should('be.visible')
  })
})