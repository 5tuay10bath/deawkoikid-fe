import type { IDashboardRepository } from "@application/ports/dashboard.repository.port"
import type { DefaultDto } from "../dtos/default.dto"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import type { DashboardEntity } from "@client/entities/dashboard.entity"
import type { DashboardModel } from "@domain/models/dashboard.model"
import { DashboardMapper } from "../port/dashboard.mapper"
import { left, right } from "@shared/either"

export class DashboardRepository implements IDashboardRepository {
  private static instance: DashboardRepository
  public static getInstance(): DashboardRepository {
    if (!DashboardRepository.instance) {
      DashboardRepository.instance = new DashboardRepository()
    }
    return DashboardRepository.instance
  }

  async getDashboard(dto: DefaultDto): Promise<IDashboardRepository.getDashboard> {
    const {} = dto

    try {
      const url = `/dashboard`

      const { data } = await axiosInstance.get<DashboardEntity>(url)

      const result: DashboardModel = DashboardMapper.toDomain(data)

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }
}
