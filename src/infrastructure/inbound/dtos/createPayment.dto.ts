export interface CreatePaymentDto {
  contractId: string
  billingMonth: Date
  dueDate: Date
  status: "PAID" | "UNPAID" | "OVERDUE"
}
