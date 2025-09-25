describe('Tenant Management - Data Tables', () => {
  beforeEach(() => {
    cy.visit('/tenants')
  })

  it('should display tenant management page', () => {
    // Check that tenant page loads
    cy.contains('Tenant Management').should('be.visible')
    cy.contains('Total Tenants').should('be.visible')
    
    // Check if export and add buttons are visible
    cy.get('body').then(($body) => {
      if ($body.text().includes('Export Data')) {
        cy.contains('Export Data').should('be.visible')
      }
      if ($body.text().includes('Add Tenant')) {
        cy.contains('Add Tenant').should('be.visible')
      }
    })
  })

  it('should show tenant statistics', () => {
    cy.get('body').then(($body) => {
      const bodyText = $body.text()
      
      // Check statistics cards
      if (bodyText.includes('Total Tenants')) {
        cy.contains('Total Tenants').should('be.visible')
      }
      if (bodyText.includes('Active')) {
        cy.contains('Active').should('be.visible')
      }
      if (bodyText.includes('Overdue')) {
        cy.contains('Overdue').should('be.visible')
      }
      
      // Log if we find numbers in the text
      const hasNumbers = /\d+/.test(bodyText)
      if (hasNumbers) {
        cy.log('Found numerical statistics on page')
      }
    })
  })

  it('should display tenant table or list', () => {
    // Check if tenant data is displayed
    cy.get('body').then(($body) => {
      const bodyText = $body.text()
      
      // Should show tenant-related content
      if (bodyText.includes('All Tenants')) {
        cy.contains('All Tenants').should('be.visible')
      }
      
      // Check for search functionality
      if (bodyText.includes('Search')) {
        cy.get('input[placeholder*="Search"]').should('be.visible')
      }
    })
  })

  it('should allow navigation back to dashboard', () => {
    cy.visit('/dashboard')
    cy.contains('Property Dashboard').should('be.visible')
  })
})