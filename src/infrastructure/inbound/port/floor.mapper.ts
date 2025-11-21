import type { FloorEntity } from "@client/entities/floor.entity"
import type { FloorModel } from "@domain/models/floor.model"
import { StrictBuilder } from "builder-pattern"

export class FloorMapper {
  static toDomain(floorEntity: FloorEntity): FloorModel {
    return StrictBuilder<FloorModel>()
      .id(floorEntity.id)
      .floorNumber(floorEntity.floorNumber)
      .unitCount(floorEntity.unitCount)
      .buildingId(floorEntity.buildingId)
      .build()
  }

  static toDomainArray(floorEntities: FloorEntity[]): FloorModel[] {
    if (!Array.isArray(floorEntities)) {
      console.error("Expected array but received:", typeof floorEntities)
      return []
    }

    return floorEntities.map((entity) => this.toDomain(entity))
  }
}
