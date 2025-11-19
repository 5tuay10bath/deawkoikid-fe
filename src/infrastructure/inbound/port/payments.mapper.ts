import type { PaymentsEntity } from "@client/entities/payments.entity"
import type { PaymentsModel } from "@domain/models/payments.model"
import { StrictBuilder } from "builder-pattern"

export class PaymentsMapper {
  static toDomain(paymentsEntity: PaymentsEntity): PaymentsModel {
    return StrictBuilder<PaymentsModel>()
      .id(paymentsEntity.id)
      .contract(paymentsEntity.contract)
      .apartmentConfig(paymentsEntity.apartmentConfig)
      .billingMonth(new Date(paymentsEntity.billingMonth))
      .electricUsage(paymentsEntity.electricUsage)
      .waterUsage(paymentsEntity.waterUsage)
      .status(paymentsEntity.status as "UNPAID" | "PAID" | "OVERDUE")
      .dueDate(new Date(paymentsEntity.dueDate))
      .totalAmount(paymentsEntity.totalAmount)
      .paidDate(paymentsEntity.paidDate ? new Date(paymentsEntity.paidDate) : null)
      .build()
  }

  static toDomainArray(paymentsEntities: PaymentsEntity[]): PaymentsModel[] {
    if (!Array.isArray(paymentsEntities)) {
      console.error("Expected array but received:", typeof paymentsEntities)
      return []
    }

    return paymentsEntities.map((entity) => this.toDomain(entity))
  }
}
