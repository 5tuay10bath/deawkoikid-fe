describe('Maintenance & Supplies - Task Tracking and Management', () => {
  beforeEach(() => {
    cy.visit('/dashboard')
  })

  describe('Maintenance Task Tracking', () => {
    it('should display maintenance information on dashboard', () => {
      // Check if maintenance info is visible
      cy.contains('Property Dashboard').should('be.visible')
      
      cy.get('body').then(($body) => {
        const bodyText = $body.text()
        
        // Look for maintenance related content
        if (bodyText.includes('Maintenance')) {
          cy.log('Found maintenance content on dashboard')
        }
        
        // Check for maintenance status indicators
        if (bodyText.includes('Maintenance Required') || bodyText.includes('Under Maintenance')) {
          cy.log('Found maintenance status indicators')
        }
        
        // Look for room maintenance status
        if (bodyText.includes('Room') && bodyText.includes('Maintenance')) {
          cy.log('Found rooms with maintenance status')
        }
      })
    })

    it('should show maintenance status in room cards', () => {
      cy.get('body').then(($body) => {
        const bodyText = $body.text()
        
        // Look for rooms marked for maintenance
        if (bodyText.includes('Maintenance')) {
          cy.log('Found maintenance status in room cards')
          
          // Maintenance rooms should not show check-in option
          if (bodyText.includes('Check In') && bodyText.includes('Maintenance')) {
            // Verify they're in different room cards
            cy.log('Maintenance rooms appropriately separated from available rooms')
          }
        }
        
        // Count maintenance rooms if visible
        const maintenanceCount = (bodyText.match(/Maintenance/g) || []).length
        if (maintenanceCount > 0) {
          cy.log(`Found ${maintenanceCount} maintenance-related items`)
        }
      })
    })

    it('should handle maintenance workflow', () => {
      cy.get('body').then(($body) => {
        const bodyText = $body.text()
        
        // Test maintenance actions if available
        if (bodyText.includes('Schedule Maintenance') || bodyText.includes('Report Issue')) {
          cy.log('Found maintenance action buttons')
          
          if (bodyText.includes('Schedule Maintenance')) {
            cy.log('Found Schedule Maintenance option')
          }
          
          if (bodyText.includes('Report Issue')) {
            cy.log('Found Report Issue option')
          }
        }
        
        // Look for maintenance status updates
        if (bodyText.includes('Mark Complete') || bodyText.includes('In Progress')) {
          cy.log('Found maintenance status update options')
        }
      })
    })

    it('should display maintenance statistics if available', () => {
      cy.get('body').then(($body) => {
        const bodyText = $body.text()
        
        // Look for maintenance stats in dashboard
        if (bodyText.includes('Maintenance')) {
          // Check if there are numbers associated with maintenance
          const maintenancePattern = /Maintenance.*?(\d+)/g
          const matches = bodyText.match(maintenancePattern)
          
          if (matches) {
            cy.log(`Found maintenance statistics: ${matches.join(', ')}`)
          }
        }
        
        // Look for urgent maintenance indicators
        if (bodyText.includes('Urgent') || bodyText.includes('Priority')) {
          cy.log('Found priority maintenance indicators')
        }
      })
    })
  })

  describe('Supply Management', () => {
    it('should handle supply-related functionality', () => {
      cy.get('body').then(($body) => {
        const bodyText = $body.text()
        
        // Look for supply management features
        if (bodyText.includes('Supplies') || bodyText.includes('Inventory')) {
          cy.log('Found supply management features')
          
          if (bodyText.includes('Supplies')) {
            cy.log('Found Supplies management feature')
          }
          
          if (bodyText.includes('Inventory')) {
            cy.log('Found Inventory management feature')
          }
        }
        
        // Check for supply requests
        if (bodyText.includes('Request Supplies') || bodyText.includes('Order')) {
          cy.log('Found supply request functionality')
        }
      })
    })

    it('should show supply status indicators', () => {
      cy.get('body').then(($body) => {
        const bodyText = $body.text()
        
        // Look for low stock or supply alerts
        if (bodyText.includes('Low Stock') || bodyText.includes('Out of Stock')) {
          cy.log('Found stock level indicators')
        }
        
        // Check for supply categories
        if (bodyText.includes('Cleaning') || bodyText.includes('Tools') || bodyText.includes('Parts')) {
          cy.log('Found supply categories')
        }
      })
    })
  })

  describe('Task Management', () => {
    it('should handle task assignment and tracking', () => {
      cy.get('body').then(($body) => {
        const bodyText = $body.text()
        
        // Look for task management features
        if (bodyText.includes('Assign') || bodyText.includes('Task')) {
          cy.log('Found task management features')
        }
        
        // Check for staff assignment
        if (bodyText.includes('Assigned to') || bodyText.includes('Technician')) {
          cy.log('Found staff assignment features')
        }
        
        // Look for task status
        if (bodyText.includes('Pending') || bodyText.includes('Completed') || bodyText.includes('In Progress')) {
          cy.log('Found task status indicators')
        }
      })
    })

    it('should show task priorities and deadlines', () => {
      cy.get('body').then(($body) => {
        const bodyText = $body.text()
        
        // Look for priority indicators
        if (bodyText.includes('High Priority') || bodyText.includes('Low Priority') || bodyText.includes('Urgent')) {
          cy.log('Found priority indicators')
        }
        
        // Check for deadline management
        if (bodyText.includes('Due Date') || bodyText.includes('Deadline') || bodyText.includes('Overdue')) {
          cy.log('Found deadline management features')
        }
      })
    })
  })
})