import type { DashboardEntity } from "@client/entities/dashboard.entity"
import type { DashboardModel } from "@domain/models/dashboard.model"
import { StrictBuilder } from "builder-pattern"

export class DashboardMapper {
  static toDomain(dashboardEntity: DashboardEntity): DashboardModel {
    return StrictBuilder<DashboardModel>()
      .id(dashboardEntity.id)
      .address(dashboardEntity.address)
      .unitNumber(dashboardEntity.unitNumber)
      .unitType(dashboardEntity.unitType)
      .unitSize(dashboardEntity.unitSize)
      .unitStatus(dashboardEntity.unitStatus)
      .floor(dashboardEntity.floor)
      .latestAirconService(dashboardEntity.latestAirconService)
      .contract(dashboardEntity.contract)
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
