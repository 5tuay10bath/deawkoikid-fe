import type { MaintenanceModel } from "@domain/models/maintenance.model"
import type { SupplyModel } from "@domain/models/supply.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { Either } from "@shared/either"

export interface IMaintenanceRepository {
  getMaintenance: (dto: DefaultDto) => Promise<IMaintenanceRepository.getMaintenance>
  getSupply: (dto: DefaultDto) => Promise<IMaintenanceRepository.getSupply>
}

export namespace IMaintenanceRepository {
  export type getMaintenance = Promise<Either<any, MaintenanceModel[]>>
  export type getSupply = Promise<Either<any, SupplyModel[]>>
}
