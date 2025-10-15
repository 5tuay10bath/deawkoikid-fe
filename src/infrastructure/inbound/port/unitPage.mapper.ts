import type { UnitPageEntity } from "@client/entities/unitPage.entity"
import type { UnitPageModel } from "@domain/models/unitPage.model"
import { StrictBuilder } from "builder-pattern"

export class UnitPageMapper {
  static toDomain(unitPageEntity: UnitPageEntity): UnitPageModel {
    return StrictBuilder<UnitPageModel>()
      .id(unitPageEntity.id)
      .unitNumber(unitPageEntity.unitNumber)
      .floor(unitPageEntity.floor)
      .unitType(unitPageEntity.unitType as "A" | "B" | "C")
      .unitSize(unitPageEntity.unitSize)
      .address(unitPageEntity.address)
      .status(unitPageEntity.status as "available" | "reserved" | "occupied")
      .latestAirconService(unitPageEntity.latestAirconService)
      .build()
  }

  static toDomainArray(unitPageEntities: UnitPageEntity[]): UnitPageModel[] {
    if (!Array.isArray(unitPageEntities)) {
      console.error("Expected array but received:", typeof unitPageEntities)
      return []
    }

    return unitPageEntities.map((entity) => this.toDomain(entity))
  }
}
