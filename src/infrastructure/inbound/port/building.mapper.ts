import type { BuildingEntity } from "@client/entities/building.entity"
import type { BuildingModel } from "@domain/models/building.model"
import { FloorMapper } from "./floor.mapper"
import { StrictBuilder } from "builder-pattern"

export class BuildingMapper {
  static toDomain(buildingEntity: BuildingEntity): BuildingModel {
    const building = StrictBuilder<BuildingModel>()
      .id(buildingEntity.id)
      .name(buildingEntity.name)
      .codeName(buildingEntity.codeName)
      .description(buildingEntity.description)
      .floorCount(buildingEntity.floorCount)

    // Map floors if they exist in the response
    if (buildingEntity.floors && Array.isArray(buildingEntity.floors)) {
      building.floors(FloorMapper.toDomainArray(buildingEntity.floors))
    }

    return building.build()
  }

  static toDomainArray(buildingEntities: BuildingEntity[]): BuildingModel[] {
    if (!Array.isArray(buildingEntities)) {
      console.error("Expected array but received:", typeof buildingEntities)
      return []
    }

    return buildingEntities.map((entity) => this.toDomain(entity))
  }
}
