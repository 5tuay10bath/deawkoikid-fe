// Centralized Mock Database
export interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  emergencyContact: string
  emergencyPhone: string
  unitNumber: string
  checkIn: Date
  checkOut: Date
  rentAmount: number
  billingCycle: "monthly" | "yearly"
  securityDeposit: number
  status: "active" | "checkout-pending" | "overdue"
}

export interface Room {
  id: string
  number: string
  floor: number
  type: string
  size: string
  status: "available" | "occupied" | "maintenance" | "checkout-pending"
  tenant?: Tenant
}

export interface Payment {
  id: string
  tenantId: string
  tenantName: string
  unitNumber: string
  amount: number
  type: "rent" | "utilities" | "deposit" | "maintenance" | "addon"
  description?: string
  status: "paid" | "pending" | "overdue"
  dueDate: Date
  paidDate?: Date
}

export interface Contract {
  id: string
  tenantId: string
  tenantName: string
  unitNumber: string
  startDate: Date
  endDate: Date
  rentAmount: number
  status: "active" | "expired" | "draft"
  type: "standard" | "custom"
}

export interface MaintenanceTask {
  id: string
  title: string
  description: string
  unitNumber: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in-progress" | "completed"
  assignedTo: string
  dueDate: Date
  createdDate: Date
  type: "plumbing" | "electrical" | "hvac" | "general" | "cleaning"
}

export interface Supply {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  minStock: number
  cost: number
}

// Mock Database
class MockDatabase {
  private tenants: Tenant[] = []
  private rooms: Room[] = []
  private payments: Payment[] = []
  private contracts: Contract[] = []
  private maintenanceTasks: MaintenanceTask[] = []
  private supplies: Supply[] = []

  constructor() {
    this.initializeData()
  }

  private initializeData() {
    // Initialize Tenants
    this.tenants = [
      {
        id: "t1",
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        emergencyContact: "Jane Smith",
        emergencyPhone: "+1 (555) 987-6543",
        unitNumber: "101",
        checkIn: new Date(2024, 0, 15),
        checkOut: new Date(2024, 11, 15),
        rentAmount: 1200,
        billingCycle: "monthly",
        securityDeposit: 1200,
        status: "active"
      },
      {
        id: "t2",
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1 (555) 987-6543",
        emergencyContact: "Mike Johnson",
        emergencyPhone: "+1 (555) 456-7890",
        unitNumber: "203",
        checkIn: new Date(2024, 1, 1),
        checkOut: new Date(2025, 0, 31),
        rentAmount: 1100,
        billingCycle: "monthly",
        securityDeposit: 1100,
        status: "overdue"
      },
      {
        id: "t3",
        name: "Mike Davis",
        email: "mike.davis@email.com",
        phone: "+1 (555) 456-7890",
        emergencyContact: "Lisa Davis",
        emergencyPhone: "+1 (555) 234-5678",
        unitNumber: "105",
        checkIn: new Date(2024, 2, 10),
        checkOut: new Date(2024, 8, 30),
        rentAmount: 950,
        billingCycle: "monthly",
        securityDeposit: 950,
        status: "checkout-pending"
      },
      {
        id: "t4",
        name: "Emily Chen",
        email: "emily.chen@email.com",
        phone: "+1 (555) 345-6789",
        emergencyContact: "David Chen",
        emergencyPhone: "+1 (555) 678-9012",
        unitNumber: "207",
        checkIn: new Date(2024, 3, 20),
        checkOut: new Date(2025, 3, 20),
        rentAmount: 1300,
        billingCycle: "monthly",
        securityDeposit: 1300,
        status: "active"
      },
      {
        id: "t5",
        name: "Robert Wilson",
        email: "robert.wilson@email.com",
        phone: "+1 (555) 567-8901",
        emergencyContact: "Mary Wilson",
        emergencyPhone: "+1 (555) 890-1234",
        unitNumber: "112",
        checkIn: new Date(2024, 4, 5),
        checkOut: new Date(2024, 10, 5),
        rentAmount: 1150,
        billingCycle: "monthly",
        securityDeposit: 1150,
        status: "active"
      }
    ]

    // Initialize Rooms (24 total - 12 per floor, 2 floors)
    this.rooms = []
    const occupiedUnits = ["101", "203", "105", "207", "112"]
    const maintenanceUnits = ["103", "209"]
    const checkoutPendingUnits = ["105"]
    
    for (let floor = 1; floor <= 2; floor++) {
      for (let roomNum = 1; roomNum <= 12; roomNum++) {
        const roomNumber = `${floor}${roomNum.toString().padStart(2, '0')}`
        
        let status: Room['status'] = 'available'
        let tenant: Tenant | undefined = undefined
        
        if (occupiedUnits.includes(roomNumber)) {
          status = 'occupied'
          tenant = this.tenants.find(t => t.unitNumber === roomNumber)
        } else if (maintenanceUnits.includes(roomNumber)) {
          status = 'maintenance'
        } else if (checkoutPendingUnits.includes(roomNumber)) {
          status = 'checkout-pending'
        }
        
        this.rooms.push({
          id: roomNumber,
          number: roomNumber,
          floor,
          type: "Studio",
          size: "400 sq ft",
          status,
          tenant
        })
      }
    }

    // Initialize Payments
    this.payments = [
      {
        id: "p1",
        tenantId: "t1",
        tenantName: "John Smith",
        unitNumber: "101",
        amount: 1200,
        type: "rent",
        status: "paid",
        dueDate: new Date(2024, 7, 1),
        paidDate: new Date(2024, 7, 1)
      },
      {
        id: "p2",
        tenantId: "t2",
        tenantName: "Sarah Johnson",
        unitNumber: "203",
        amount: 150,
        type: "utilities",
        status: "overdue",
        dueDate: new Date(2024, 6, 15),
        description: "Electricity bill"
      },
      {
        id: "p3",
        tenantId: "t4",
        tenantName: "Emily Chen",
        unitNumber: "207",
        amount: 1300,
        type: "rent",
        status: "paid",
        dueDate: new Date(2024, 7, 20),
        paidDate: new Date(2024, 7, 18)
      },
      {
        id: "p4",
        tenantId: "t5",
        tenantName: "Robert Wilson",
        unitNumber: "112",
        amount: 75,
        type: "utilities",
        status: "pending",
        dueDate: new Date(2024, 7, 25),
        description: "Water bill"
      }
    ]

    // Initialize Contracts
    this.contracts = [
      {
        id: "c1",
        tenantId: "t1",
        tenantName: "John Smith",
        unitNumber: "101",
        startDate: new Date(2024, 0, 15),
        endDate: new Date(2024, 11, 15),
        rentAmount: 1200,
        status: "active",
        type: "standard"
      },
      {
        id: "c2",
        tenantId: "t2",
        tenantName: "Sarah Johnson",
        unitNumber: "203",
        startDate: new Date(2024, 1, 1),
        endDate: new Date(2025, 0, 31),
        rentAmount: 1100,
        status: "active",
        type: "custom"
      },
      {
        id: "c3",
        tenantId: "t4",
        tenantName: "Emily Chen",
        unitNumber: "207",
        startDate: new Date(2024, 3, 20),
        endDate: new Date(2025, 3, 20),
        rentAmount: 1300,
        status: "active",
        type: "standard"
      }
    ]

    // Initialize Maintenance Tasks
    this.maintenanceTasks = [
      {
        id: "m1",
        title: "Fix leaking faucet",
        description: "Kitchen faucet is dripping constantly in unit 101",
        unitNumber: "101",
        priority: "medium",
        status: "pending",
        assignedTo: "John Maintenance",
        dueDate: new Date(2024, 7, 25),
        createdDate: new Date(2024, 7, 20),
        type: "plumbing"
      },
      {
        id: "m2",
        title: "AC not cooling",
        description: "Air conditioning system not working properly",
        unitNumber: "203",
        priority: "high",
        status: "in-progress",
        assignedTo: "Mike HVAC",
        dueDate: new Date(2024, 7, 22),
        createdDate: new Date(2024, 7, 21),
        type: "hvac"
      },
      {
        id: "m3",
        title: "Replace broken window",
        description: "Bedroom window cracked and needs replacement",
        unitNumber: "103",
        priority: "high",
        status: "pending",
        assignedTo: "Bob Repair",
        dueDate: new Date(2024, 7, 28),
        createdDate: new Date(2024, 7, 22),
        type: "general"
      }
    ]

    // Initialize Supplies
    this.supplies = [
      {
        id: "s1",
        name: "Light Bulbs - LED 60W",
        category: "Electrical",
        quantity: 25,
        unit: "pieces",
        minStock: 10,
        cost: 8.99
      },
      {
        id: "s2",
        name: "Toilet Paper",
        category: "Cleaning",
        quantity: 5,
        unit: "rolls",
        minStock: 20,
        cost: 12.99
      },
      {
        id: "s3",
        name: "Air Filters",
        category: "HVAC",
        quantity: 15,
        unit: "pieces",
        minStock: 8,
        cost: 24.50
      },
      {
        id: "s4",
        name: "Plumbing Tape",
        category: "Plumbing",
        quantity: 3,
        unit: "rolls",
        minStock: 5,
        cost: 6.75
      }
    ]
  }

  // Getter methods
  getTenants(): Tenant[] { return [...this.tenants] }
  getRooms(): Room[] { return [...this.rooms] }
  getPayments(): Payment[] { return [...this.payments] }
  getContracts(): Contract[] { return [...this.contracts] }
  getMaintenanceTasks(): MaintenanceTask[] { return [...this.maintenanceTasks] }
  getSupplies(): Supply[] { return [...this.supplies] }

  // Individual getters
  getTenant(id: string): Tenant | undefined {
    return this.tenants.find(t => t.id === id)
  }

  getRoom(id: string): Room | undefined {
    return this.rooms.find(r => r.id === id)
  }

  getRoomByNumber(number: string): Room | undefined {
    return this.rooms.find(r => r.number === number)
  }

  // CRUD operations
  addTenant(tenant: Omit<Tenant, 'id'>): Tenant {
    const newTenant: Tenant = {
      id: `t${Date.now()}`,
      ...tenant
    }
    this.tenants.push(newTenant)
    return newTenant
  }

  updateTenant(id: string, updates: Partial<Tenant>): Tenant | null {
    const index = this.tenants.findIndex(t => t.id === id)
    if (index === -1) return null
    
    this.tenants[index] = { ...this.tenants[index], ...updates }
    return this.tenants[index]
  }

  addPayment(payment: Omit<Payment, 'id'>): Payment {
    const newPayment: Payment = {
      id: `p${Date.now()}`,
      ...payment
    }
    this.payments.push(newPayment)
    return newPayment
  }

  addMaintenanceTask(task: Omit<MaintenanceTask, 'id' | 'createdDate'>): MaintenanceTask {
    const newTask: MaintenanceTask = {
      id: `m${Date.now()}`,
      createdDate: new Date(),
      ...task
    }
    this.maintenanceTasks.push(newTask)
    return newTask
  }

  addSupply(supply: Omit<Supply, 'id'>): Supply {
    const newSupply: Supply = {
      id: `s${Date.now()}`,
      ...supply
    }
    this.supplies.push(newSupply)
    return newSupply
  }

  updateRoom(id: string, updates: Partial<Room>): Room | null {
    const index = this.rooms.findIndex(r => r.id === id)
    if (index === -1) return null
    
    this.rooms[index] = { ...this.rooms[index], ...updates }
    return this.rooms[index]
  }

  // Business logic methods
  checkInTenant(roomId: string, tenant: Omit<Tenant, 'id' | 'unitNumber'>): { success: boolean; message: string } {
    const room = this.getRoom(roomId)
    if (!room) {
      return { success: false, message: "Room not found" }
    }
    
    if (room.status !== 'available') {
      return { success: false, message: "Room is not available for check-in" }
    }

    // Add tenant
    const newTenant = this.addTenant({
      ...tenant,
      unitNumber: room.number
    })

    // Update room
    this.updateRoom(roomId, {
      status: 'occupied',
      tenant: newTenant
    })

    // Create contract
    const contract: Omit<Contract, 'id'> = {
      tenantId: newTenant.id,
      tenantName: newTenant.name,
      unitNumber: newTenant.unitNumber,
      startDate: newTenant.checkIn,
      endDate: newTenant.checkOut,
      rentAmount: newTenant.rentAmount,
      status: 'active',
      type: 'standard'
    }
    this.contracts.push({
      id: `c${Date.now()}`,
      ...contract
    })

    return { success: true, message: `Successfully checked in ${newTenant.name} to room ${room.number}` }
  }

  checkOutTenant(roomId: string): { success: boolean; message: string } {
    const room = this.getRoom(roomId)
    if (!room || !room.tenant) {
      return { success: false, message: "Room not found or not occupied" }
    }

    // Update room
    this.updateRoom(roomId, {
      status: 'available',
      tenant: undefined
    })

    // Update tenant status
    this.updateTenant(room.tenant.id, {
      status: 'checkout-pending'
    })

    return { success: true, message: `Successfully checked out ${room.tenant.name} from room ${room.number}` }
  }
}

// Export singleton instance
export const mockDB = new MockDatabase()