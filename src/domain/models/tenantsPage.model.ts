export interface TenantsPageModel {
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
