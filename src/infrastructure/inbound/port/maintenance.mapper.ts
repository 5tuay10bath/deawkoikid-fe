import type { MaintenanceEntity } from "@client/entities/maintenance.entity"
import type { MaintenanceModel } from "@domain/models/maintenance.model"
import { StrictBuilder } from "builder-pattern"

export class MaintenanceMapper {
  static toDomain(maintenanceEntity: MaintenanceEntity): MaintenanceModel {
    return StrictBuilder<MaintenanceModel>()
      .id(maintenanceEntity.id)
      .unit(maintenanceEntity.unit)
      .title(maintenanceEntity.title)
      .description(maintenanceEntity.description)
      .price(maintenanceEntity.price)
      .priority(maintenanceEntity.priority as "LOW" | "MEDIUM" | "HIGH")
      .maintenanceType(maintenanceEntity.maintenanceType)
      .reportedBy(maintenanceEntity.reportedBy)
      .assignedTo(maintenanceEntity.assignedTo)
      .status(maintenanceEntity.status as "REPORTED" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED")
      .scheduledAt(maintenanceEntity.scheduledAt)
      .startedAt(maintenanceEntity.startedAt)
      .completedAt(maintenanceEntity.completedAt)
      .cancelledAt(maintenanceEntity.cancelledAt)
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
