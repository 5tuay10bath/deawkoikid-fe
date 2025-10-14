export interface ContractsModel {
  id: string
  tenantId: string
  unitId: string
  fullName: string
  email: string
  phone: string
  identificationNumber: string
  unitNumber: string
  unitType: string
  unitSize: string
  rentType: "monthly" | "yearly"
  rentAmount: number
  waterBillingType: "per_unit" | "flat_rate" | "tiered"
  internet: boolean
  startDate: Date
  endDate: Date
  status: "active" | "expired" | "terminated" | "pending"
}
