# Cypress E2E Test Suite - Property Management System

A comprehensive Cypress end-to-end test suite covering all aspects of the Property Management System, including tenant management, dashboard functionality, receipts/contracts, and maintenance operations.

## 📁 Test Structure

```
cypress/
├── e2e/
│   └── property-management/
│       ├── tenant-management/
│       │   ├── assign-tenants.cy.js
│       │   ├── double-booking-prevention.cy.js
│       │   └── room-availability.cy.js
│       ├── dashboard/
│       │   └── data-tables.cy.js
│       ├── receipts-contracts/
│       │   └── receipts-generation.cy.js
│       └── maintenance/
│           ├── maintenance-tracking.cy.js
│           └── supply-management.cy.js
├── fixtures/
│   ├── tenants.json
│   ├── rooms.json
│   └── maintenance.json
├── support/
│   ├── commands.js
│   ├── e2e.js
│   └── component.js
└── cypress.config.js
```

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v16 or higher)
2. **pnpm** package manager
3. **Running application** on `http://localhost:5173`
4. **API server** running on `http://localhost:8000` (if applicable)

### Installation

```bash
# Install Cypress and dependencies
pnpm install cypress --save-dev

# Install additional reporting tools (optional)
pnpm install mochawesome mochawesome-merge mochawesome-report-generator --save-dev
```

### Running Tests

#### Interactive Mode (Cypress Test Runner)
```bash
# Open Cypress Test Runner
pnpm cypress open

# Open specific test category
pnpm run test:dashboard:open
pnpm run test:tenants:open
pnpm run test:maintenance:open
```

#### Headless Mode (CI/CD)
```bash
# Run all E2E tests
pnpm cypress run

# Run specific test categories
pnpm run test:tenant-management
pnpm run test:dashboard
pnpm run test:receipts-contracts
pnpm run test:maintenance

# Run with specific browser
pnpm run cy:run:chrome
pnpm run cy:run:firefox
```

#### Different Viewports
```bash
# Mobile testing
pnpm run test:mobile

# Tablet testing
pnpm run test:tablet

# Desktop testing (high resolution)
pnpm run test:desktop
```

## 📋 Test Coverage

### 1. Tenant Management Tests
- **assign-tenants.cy.js**: Tenant assignment workflows
- **double-booking-prevention.cy.js**: Conflict prevention and validation
- **room-availability.cy.js**: Room availability checking and filtering

#### Key Test Scenarios:
- ✅ Create new tenants with complete information
- ✅ Assign tenants to available rooms
- ✅ Prevent double-booking conflicts
- ✅ Handle lease date overlaps
- ✅ Validate tenant information requirements
- ✅ Test emergency contact management

### 2. Dashboard Tests
- **data-tables.cy.js**: Data display, filtering, sorting, and export functionality

#### Key Test Scenarios:
- ✅ Display tenants, rooms, and maintenance data
- ✅ Search and filter capabilities
- ✅ Sorting by different columns
- ✅ Pagination functionality
- ✅ Export data to Excel/PDF
- ✅ Responsive table behavior

### 3. Receipts & Contracts Tests
- **receipts-generation.cy.js**: Receipt generation, contract management

#### Key Test Scenarios:
- ✅ Generate receipts for rent payments
- ✅ Create and manage lease contracts
- ✅ Handle payment history tracking
- ✅ Export receipts and contracts
- ✅ Validate payment calculations
- ✅ Contract renewal workflows

### 4. Maintenance Tests
- **maintenance-tracking.cy.js**: Task management, scheduling, history
- **supply-management.cy.js**: Inventory, purchasing, usage tracking

#### Key Test Scenarios:
- ✅ Create and track maintenance tasks
- ✅ Schedule recurring maintenance
- ✅ Manage supply inventory
- ✅ Track usage and costs
- ✅ Generate maintenance reports
- ✅ Handle vendor management

## 🛠 Custom Commands

The test suite includes comprehensive custom commands for common operations:

### Authentication
```javascript
cy.login(username, password)  // Login with credentials
```

### Navigation
```javascript
cy.navigateTo('tenants')      // Navigate to specific page
cy.waitForTableData()         // Wait for data to load
```

### Tenant Management
```javascript
cy.createTenant(tenantData)   // Create new tenant
cy.assignTenantToRoom(tenant, room, startDate, endDate)
```

### Maintenance
```javascript
cy.createMaintenanceTask(taskData)  // Create maintenance task
```

### Utilities
```javascript
cy.verifyToast(message, type)       // Verify notifications
cy.searchTable(searchTerm)          // Search in tables
cy.exportData(format, options)      // Export functionality
cy.setDateRange(start, end)         // Date filtering
```

## 📊 Test Data & Fixtures

### Fixtures Overview
- **tenants.json**: Sample tenant data for testing
- **rooms.json**: Room information and availability
- **maintenance.json**: Maintenance tasks and supply data

### Sample Tenant Data
```json
{
  "validTenant": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123",
    "emergencyContact": "Jane Doe",
    "emergencyPhone": "+1-555-0124"
  }
}
```

## 🔧 Configuration

### Cypress Configuration (`cypress.config.js`)
```javascript
{
  baseUrl: 'http://localhost:5173',
  viewportWidth: 1280,
  viewportHeight: 720,
  video: true,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 10000,
  retries: { runMode: 2, openMode: 0 }
}
```

### Environment Variables
```bash
# Set API base URL
CYPRESS_api_base_url=http://localhost:8000

# Set record key for Cypress Dashboard
CYPRESS_RECORD_KEY=your-record-key
```

## 📈 Reporting

### Generate Test Reports
```bash
# Generate Mochawesome HTML report
pnpm run report:generate

# Merge multiple JSON reports
pnpm run report:merge

# Generate final HTML report
pnpm run report:html
```

### Report Locations
- **Screenshots**: `cypress/screenshots/`
- **Videos**: `cypress/videos/`
- **HTML Reports**: `cypress/reports/`

## 🔍 Debugging

### Debug Mode
```bash
# Open Cypress with file watching
pnpm run test:debug

# Run specific test with headed browser
cypress run --spec "cypress/e2e/path/to/test.cy.js" --headed
```

### Common Debugging Tips
1. **Use `cy.pause()`** to pause test execution
2. **Add `cy.screenshot()`** for visual debugging
3. **Check browser console** in Cypress Test Runner
4. **Use `cy.debug()`** to inspect element state
5. **Enable verbose logging** in configuration

## 🚨 Test Data Management

### Before Running Tests
1. **Ensure clean database state** (if using real backend)
2. **Seed test data** as needed
3. **Check API endpoints** are accessible
4. **Verify authentication setup**

### After Tests
1. **Clean up test data** to avoid conflicts
2. **Reset application state** for consistency
3. **Archive test artifacts** (videos, screenshots)

## 🏗 CI/CD Integration

### GitHub Actions Example
```yaml
name: Cypress Tests
on: [push, pull_request]
jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Cypress run
        uses: cypress-io/github-action@v5
        with:
          build: pnpm install
          start: pnpm dev
          wait-on: 'http://localhost:5173'
          record: true
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
```