import type { DashboardEntity } from "@client/entities/dashboard.entity"
import type { DashboardModel } from "@domain/models/dashboard.model"
import { StrictBuilder } from "builder-pattern"

export class DashboardMapper {
  static toDomain(dashboardEntity: DashboardEntity): DashboardModel {
    // Handle both 'status' and 'unitStatus' from backend
    const status = (dashboardEntity as any).unitStatus || (dashboardEntity as any).status || "AVAILABLE"

    // Handle floor as object or number
    const floor =
      typeof (dashboardEntity as any).floor === "object" && (dashboardEntity as any).floor !== null
        ? (dashboardEntity as any).floor.floorNumber || (dashboardEntity as any).floor.id || 1
        : (dashboardEntity as any).floor || 1

    const builder = StrictBuilder<DashboardModel>()
      .id(dashboardEntity.id)
      .address(dashboardEntity.address)
      .unitNumber(dashboardEntity.unitNumber)
      .unitType(dashboardEntity.unitType)
      .unitSize(dashboardEntity.unitSize)
      .unitStatus(typeof status === "string" ? status.toUpperCase() : status)
      .floor(Number(floor))
      .latestAirconService(new Date(dashboardEntity.latestAirconService))

    // Only add contract if it exists
    if (dashboardEntity.contract) {
      builder.contract(dashboardEntity.contract)
    }

    return builder.build()
  }

  static toDomainArray(dashboardEntities: DashboardEntity[]): DashboardModel[] {
    if (!Array.isArray(dashboardEntities)) {
      console.error("Expected array but received:", typeof dashboardEntities)
      return []
    }

    return dashboardEntities.map((entity) => this.toDomain(entity))
  }
}
