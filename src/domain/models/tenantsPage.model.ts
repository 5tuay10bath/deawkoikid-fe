export interface TenantsPageModel {
  id: string
  fullName: string
  phone: string
  email: string
  emergencyContactName: string
  emergencyContactPhone: string
  unitNumber: string
  startDate: Date
  endDate: Date
  rentAmount: number
  billingCycle: "monthly" | "yearly"
  // securityDeposit: number
  status: "active" | "checkout-pending" | "overdue"
}
