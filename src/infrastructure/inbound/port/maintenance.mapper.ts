import type { MaintenanceEntity } from "@client/entities/maintenance.entity"
import type { MaintenanceModel } from "@domain/models/maintenance.model"
import { StrictBuilder } from "builder-pattern"

export class MaintenanceMapper {
  static toDomain(maintenanceEntity: MaintenanceEntity): MaintenanceModel {
    return StrictBuilder<MaintenanceModel>()
      .id(maintenanceEntity.id)
      .unitNumber(maintenanceEntity.unitNumber)
      .type(maintenanceEntity.type)
      .description(maintenanceEntity.description)
      .status(maintenanceEntity.status)
      .priority(maintenanceEntity.priority)
      .requestDate(maintenanceEntity.requestDate)
      .scheduledDate(maintenanceEntity.scheduledDate)
      .completedDate(maintenanceEntity.completedDate)
      .assignedTo(maintenanceEntity.assignedTo)
      .cost(maintenanceEntity.cost)
      .build()
  }

  static toDomainArray(maintenanceEntities: MaintenanceEntity[]): MaintenanceModel[] {
    if (!Array.isArray(maintenanceEntities)) {
      console.error("Expected array but received:", typeof maintenanceEntities)
      return []
    }

    return maintenanceEntities.map((entity) => this.toDomain(entity))
  }
}
