import type { PaymentsEntity } from "@client/entities/payments.entity"
import type { PaymentsModel } from "@domain/models/payments.model"
import { StrictBuilder } from "builder-pattern"

export class PaymentsMapper {
  static toDomain(paymentsEntity: PaymentsEntity): PaymentsModel {
    return StrictBuilder<PaymentsModel>()
      .id(paymentsEntity.id)
      .tenantId(paymentsEntity.tenantId)
      .tenantName(paymentsEntity.tenantName)
      .unitNumber(paymentsEntity.unitNumber)
      .amount(paymentsEntity.amount)
      .paymentType(paymentsEntity.paymentType)
      .paymentMethod(paymentsEntity.paymentMethod)
      .status(paymentsEntity.status)
      .dueDate(paymentsEntity.dueDate)
      .paidDate(paymentsEntity.paidDate)
      .invoiceNumber(paymentsEntity.invoiceNumber)
      .description(paymentsEntity.description)
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
