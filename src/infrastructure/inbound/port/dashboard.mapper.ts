import type { DashboardEntity } from "@client/entities/dashboard.entity"
import type { DashboardModel } from "@domain/models/dashboard.model"
import { StrictBuilder } from "builder-pattern"

export class DashboardMapper {
  static toDomain(dashboardEntity: DashboardEntity): DashboardModel {
    return StrictBuilder<DashboardModel>()
      .id(dashboardEntity.id)
      .totalUnits(dashboardEntity.totalUnits)
      .occupiedUnits(dashboardEntity.occupiedUnits)
      .availableUnits(dashboardEntity.availableUnits)
      .totalRevenue(dashboardEntity.totalRevenue)
      .pendingMaintenance(dashboardEntity.pendingMaintenance)
      .overduePayments(dashboardEntity.overduePayments)
      .build()
  }
}
