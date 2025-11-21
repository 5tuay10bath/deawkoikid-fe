import type { ExtraChargeEntity } from "@client/entities/extraCharge.entity"
import type { ExtraChargeModel } from "@domain/models/extraCharge.model"
import { StrictBuilder } from "builder-pattern"

export class ExtraChargeMapper {
  static toDomain(extraChargeEntity: ExtraChargeEntity): ExtraChargeModel {
    return StrictBuilder<ExtraChargeModel>()
      .id(extraChargeEntity.id)
      .topic(extraChargeEntity.topic)
      .description(extraChargeEntity.description)
      .price(extraChargeEntity.price)
      .createdAt(extraChargeEntity.createdAt)
      .build()
  }

  static toDomainArray(extraChargeEntities: ExtraChargeEntity[]): ExtraChargeModel[] {
    if (!Array.isArray(extraChargeEntities)) {
      console.error("Expected array but received:", typeof extraChargeEntities)
      return []
    }

    return extraChargeEntities.map((entity) => this.toDomain(entity))
  }
}
