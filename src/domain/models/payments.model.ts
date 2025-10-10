export interface PaymentsModel {
  id: string
  tenantId: string
  tenantName: string
  unitNumber: string
  amount: number
  paymentType: "rent" | "deposit" | "utility" | "maintenance" | "late-fee" | "other"
  paymentMethod: "cash" | "bank-transfer" | "credit-card" | "mobile-payment"
  status: "paid" | "pending" | "overdue" | "cancelled"
  dueDate: Date
  paidDate: Date | null
  invoiceNumber: string
  description: string | null
}
