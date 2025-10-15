import type { SupplyEntity } from "@client/entities/supply.entity"
import type { SupplyModel } from "@domain/models/supply.model"
import { StrictBuilder } from "builder-pattern"

export class SupplyMapper {
  static toDomain(supplyEntity: SupplyEntity): SupplyModel {
    return StrictBuilder<SupplyModel>()
      .id(supplyEntity.id)
      .name(supplyEntity.name)
      .category(supplyEntity.category)
      .quantity(supplyEntity.quantity)
      .minStock(supplyEntity.minStock)
      .build()
  }

  static toDomainArray(supplyEntities: SupplyEntity[]): SupplyModel[] {
    if (!Array.isArray(supplyEntities)) {
      console.error("Expected array but received:", typeof supplyEntities)
      return []
    }

    return supplyEntities.map((entity) => this.toDomain(entity))
  }
}
