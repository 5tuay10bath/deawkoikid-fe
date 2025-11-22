import type { DashboardEntity } from "@client/entities/dashboard.entity"
import type { DashboardModel } from "@domain/models/dashboard.model"
import { StrictBuilder } from "builder-pattern"

export class DashboardMapper {
  static toDomain(dashboardEntity: DashboardEntity): DashboardModel {
    const status = (dashboardEntity as any).unitStatus || (dashboardEntity as any).status || "AVAILABLE"

    const floorData = (dashboardEntity as any).floor
    const floor =
      typeof floorData === "object" && floorData !== null ? floorData.floorNumber || floorData.id || 1 : floorData || 1

    const floorId = typeof floorData === "object" && floorData !== null ? floorData.id : undefined

    const buildingId =
      typeof floorData === "object" && floorData !== null && floorData.building
        ? floorData.building.id || floorData.building
        : (dashboardEntity as any).buildingId || undefined

    const builder = StrictBuilder<DashboardModel>()
      .id(dashboardEntity.id)
      .address(dashboardEntity.address)
      .unitNumber(dashboardEntity.unitNumber)
      .unitType(dashboardEntity.unitType)
      .unitSize(dashboardEntity.unitSize)
      .contracts(dashboardEntity.contracts || null)
      .unitStatus(typeof status === "string" ? status.toUpperCase() : status)
      .floor(Number(floor))
      .latestAirconService(new Date(dashboardEntity.latestAirconService))

    if (floorId) {
      builder.floorId(floorId)
    }
    if (buildingId) {
      builder.buildingId(buildingId)
    }

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
