import type { IMaintenanceRepository } from "@application/ports/maintenance.repository.port"
import type { DefaultDto } from "../dtos/default.dto"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import type { MaintenanceEntity } from "@client/entities/maintenance.entity"
import type { SupplyEntity } from "@client/entities/supply.entity"
import type { MaintenanceModel } from "@domain/models/maintenance.model"
import type { SupplyModel } from "@domain/models/supply.model"
import { MaintenanceMapper } from "../port/maintenance.mapper"
import { SupplyMapper } from "../port/supply.mapper"
import { left, right } from "@shared/either"

export class MaintenanceRepository implements IMaintenanceRepository {
  private static instance: MaintenanceRepository
  public static getInstance(): MaintenanceRepository {
    if (!MaintenanceRepository.instance) {
      MaintenanceRepository.instance = new MaintenanceRepository()
    }
    return MaintenanceRepository.instance
  }

  async getMaintenance(dto: DefaultDto): Promise<IMaintenanceRepository.getMaintenance> {
    const {} = dto

    try {
      const url = `/maintenance`

      const { data } = await axiosInstance.get<MaintenanceEntity[]>(url)

      const result: MaintenanceModel[] = MaintenanceMapper.toDomainArray(data)

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }

  async getSupply(dto: DefaultDto): Promise<IMaintenanceRepository.getSupply> {
    const {} = dto

    try {
      const url = `/supplies`

      const { data } = await axiosInstance.get<SupplyEntity[]>(url)

      const result: SupplyModel[] = SupplyMapper.toDomainArray(data)

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }
}
