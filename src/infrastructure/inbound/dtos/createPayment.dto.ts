export interface CreatePaymentDto {
  contractId: string
  apartmentConfigId: string
  billingMonth: Date
  electricUsage: number
  waterUsage: number
  dueDate: Date
  paidDate: Date
  status: "PAID" | "UNPAID" | "OVERDUE"
}
