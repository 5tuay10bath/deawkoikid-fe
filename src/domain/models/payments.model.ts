export interface PaymentsModel {
  id: string
  contractid: string
  apartmentConfigid: string
  billingMonth: Date
  electricUsage: number
  waterUsage: number
  status: "paid" | "unpaid" | "overdue"
  dueDate: Date
  totalAmount: number // Response only
  paidDate: Date

  // Apartment Config
  electricpriceperunit: number
  waterpriceperunit: number
  commonFee: number
  internetprice: number
}
