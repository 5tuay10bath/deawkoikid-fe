import type { UnitPageEntity } from "@client/entities/unitPage.entity"
import type { UnitPageModel } from "@domain/models/unitPage.model"
import { StrictBuilder } from "builder-pattern"

export class UnitPageMapper {
  static toDomain(unitPageEntity: UnitPageEntity): UnitPageModel {
    // Handle both 'status' and 'unitStatus' from backend
    const status = (unitPageEntity as any).unitStatus || (unitPageEntity as any).status || "AVAILABLE"

    // Handle floor as object or number
    const floor =
      typeof (unitPageEntity as any).floor === "object" && (unitPageEntity as any).floor !== null
        ? (unitPageEntity as any).floor.floorNumber || (unitPageEntity as any).floor.id || 1
        : (unitPageEntity as any).floor || 1

    return StrictBuilder<UnitPageModel>()
      .id(unitPageEntity.id)
      .unitNumber(unitPageEntity.unitNumber)
      .floor(Number(floor))
      .unitType(unitPageEntity.unitType as "A" | "B" | "C")
      .unitSize(unitPageEntity.unitSize)
      .address(unitPageEntity.address)
      .unitStatus(typeof status === "string" ? status.toUpperCase() : status)
      .latestAirconService(new Date(unitPageEntity.latestAirconService))
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
