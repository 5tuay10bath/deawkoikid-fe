import type { ApartmentConfigModel } from "./apartmentConfig.model"
import type { ContractsModel } from "./contracts.model"

export interface PaymentsModel {
  id: string
  contract: ContractsModel
  apartmentConfig: ApartmentConfigModel
  billingMonth: Date
  electricUsage: number
  waterUsage: number
  status: "UNPAID" | "PAID" | "OVERDUE"
  dueDate: Date
  totalAmount: number
  paidDate: Date | null
}
