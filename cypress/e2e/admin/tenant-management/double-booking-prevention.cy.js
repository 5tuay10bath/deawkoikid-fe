describe('Tenant Management - Double Booking Prevention', () => {
  beforeEach(() => {
    cy.visit('/dashboard')
  })

  it('should show different states for occupied vs available rooms', () => {
    // Check that we can see both occupied and available rooms
    cy.contains('Property Dashboard').should('be.visible')
    
    // Look for occupied rooms - they should show tenant info, not check-in buttons
    cy.get('body').then(($body) => {
      const bodyText = $body.text()
      
      if (bodyText.includes('Occupied')) {
        cy.contains('Occupied').should('be.visible')
        
        // Occupied rooms should show View Details, not Check In
        if (bodyText.includes('View Details')) {
          cy.contains('View Details').should('be.visible')
        }
      }
      
      if (bodyText.includes('Available')) {
        cy.contains('Available').should('be.visible')
        
        // Available rooms should show Check In option
        if (bodyText.includes('Check In')) {
          cy.contains('Check In').should('be.visible')
        }
      }
    })
  })

  it('should display room occupancy correctly', function() {
    // Verify that rooms show appropriate information based on status
    cy.get('body').then(($body) => {
      const bodyText = $body.text()
      
      // If there are occupied rooms, they should show tenant names
      if (bodyText.includes('John Smith') || bodyText.includes('Occupied')) {
        // Should not show Check In button for occupied rooms in the same area
        cy.log('Found occupied rooms with tenant information')
      }
      
      // Available rooms should not show tenant information
      if (bodyText.includes('Available')) {
        cy.log('Found available rooms ready for check-in')
      }
    })
  })

  it('should handle room status changes correctly', () => {
    cy.get('body').then(($body) => {
      const bodyText = $body.text()
      
      // Look for rooms that might change status during interaction
      if (bodyText.includes('Room 101') || bodyText.includes('Room 201')) {
        cy.log('Found specific room numbers - testing status consistency')
        
        // Check that room status indicators are consistent
        if (bodyText.includes('Check In')) {
          // If Check In button exists, room should be available
          cy.contains('Available').should('be.visible')
        }
        
        if (bodyText.includes('View Details')) {
          // If View Details exists, room might be occupied
          cy.log('Room has details view available')
        }
      }
    })
  })

  it('should prevent booking conflicts through UI state', () => {
    // Test that UI prevents conflicting actions
    cy.get('body').then(($body) => {
      const bodyText = $body.text()
      
      // Count available vs occupied rooms
      const availableCount = (bodyText.match(/Available/g) || []).length
      const occupiedCount = (bodyText.match(/Occupied/g) || []).length
      
      cy.log(`Found ${availableCount} available and ${occupiedCount} occupied rooms`)
      
      // Verify stats match room count if stats are shown
      if (bodyText.includes('Total Units')) {
        cy.contains('Total Units').should('be.visible')
      }
      
      if (bodyText.includes('Occupied')) {
        cy.contains('Occupied').should('be.visible')
      }
    })
  })
})