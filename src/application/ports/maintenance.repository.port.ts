import type { MaintenanceModel } from "@domain/models/maintenance.model"
import type { SupplyModel } from "@domain/models/supply.model"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { CreateMaintenanceDto } from "@infrastructure/inbound/dtos/createMaintenance.dto"
import type { CreateSupplyDto } from "@infrastructure/inbound/dtos/createSupply.dto"
import type { Either } from "@shared/either"

export type { CreateMaintenanceDto, CreateSupplyDto }

export interface IMaintenanceRepository {
  getMaintenance: (dto: DefaultDto) => Promise<IMaintenanceRepository.getMaintenance>
  getSupply: (dto: DefaultDto) => Promise<IMaintenanceRepository.getSupply>
  createMaintenance: (dto: CreateMaintenanceDto) => Promise<IMaintenanceRepository.createMaintenance>
  createSupply: (dto: CreateSupplyDto) => Promise<IMaintenanceRepository.createSupply>
}

export namespace IMaintenanceRepository {
  export type getMaintenance = Promise<Either<any, MaintenanceModel[]>>
  export type getSupply = Promise<Either<any, SupplyModel[]>>
  export type createMaintenance = Promise<Either<any, ApiResponse>>
  export type createSupply = Promise<Either<any, ApiResponse>>
}
