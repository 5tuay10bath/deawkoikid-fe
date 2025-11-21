import type { ApartmentConfigModel } from "./apartmentConfig.model"
import type { ContractsModel } from "./contracts.model"
import type { PaymentStatus } from "../types/status.types"

export interface PaymentsModel {
  id: string
  contract: ContractsModel
  apartmentConfig: ApartmentConfigModel
  billingMonth: Date
  electricUsage: number
  waterUsage: number
  status: PaymentStatus
  dueDate: Date
  totalAmount: number
  paidDate: Date | null
}
