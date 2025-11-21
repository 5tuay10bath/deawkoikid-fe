import type { BuildingEntity } from "@client/entities/building.entity"
import type { BuildingModel } from "@domain/models/building.model"
import { StrictBuilder } from "builder-pattern"

export class BuildingMapper {
  static toDomain(buildingEntity: BuildingEntity): BuildingModel {
    return StrictBuilder<BuildingModel>()
      .id(buildingEntity.id)
      .name(buildingEntity.name)
      .codeName(buildingEntity.codeName)
      .description(buildingEntity.description)
      .floorCount(buildingEntity.floorCount)
      .build()
  }

  static toDomainArray(buildingEntities: BuildingEntity[]): BuildingModel[] {
    if (!Array.isArray(buildingEntities)) {
      console.error("Expected array but received:", typeof buildingEntities)
      return []
    }

    return buildingEntities.map((entity) => this.toDomain(entity))
  }
}
