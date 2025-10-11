export interface ContractsModel {
  id: string
  tenantId: string
  tenantName: string
  unitNumber: string
  contractType: "rental" | "lease"
  startDate: Date
  endDate: Date
  rentAmount: number
  securityDeposit: number
  paymentFrequency: "monthly" | "quarterly" | "yearly"
  status: "active" | "expired" | "terminated" | "pending"
  signedDate: Date | null
  terminationDate: Date | null
}
