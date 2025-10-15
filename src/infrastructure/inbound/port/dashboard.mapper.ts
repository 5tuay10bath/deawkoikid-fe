import type { DashboardEntity } from "@client/entities/dashboard.entity"
import type { DashboardModel } from "@domain/models/dashboard.model"
import { StrictBuilder } from "builder-pattern"

export class DashboardMapper {
  static toDomain(dashboardEntity: DashboardEntity): DashboardModel {
    return StrictBuilder<DashboardModel>()
      .id(dashboardEntity.id)
      .user(dashboardEntity.user)
      .unit(dashboardEntity.unit)
      .rentType(dashboardEntity.rentType as "MONTHLY" | "YEARLY")
      .rentAmount(dashboardEntity.rentAmount)
      .waterBillingType(dashboardEntity.waterBillingType as "PER_UNIT" | "FLAT_RATE" | "TIERED")
      .internet(dashboardEntity.internet)
      .startDate(dashboardEntity.startDate)
      .endDate(dashboardEntity.endDate)
      .status(dashboardEntity.status as "DRAFT" | "SIGNED" | "ACTIVE" | "EXPIRED")
      .build()
  }

  static toDomainArray(dashboardEntities: DashboardEntity[]): DashboardModel[] {
    if (!Array.isArray(dashboardEntities)) {
      console.error("Expected array but received:", typeof dashboardEntities)
      return []
    }

    return dashboardEntities.map((entity) => this.toDomain(entity))
  }
}
