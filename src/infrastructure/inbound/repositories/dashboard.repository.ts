import type { IDashboardRepository } from "@application/ports/dashboard.repository.port"
import type { CheckInDto } from "../dtos/checkIn.dto"
import type { DefaultDto } from "../dtos/default.dto"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import type { DashboardModel } from "@domain/models/dashboard.model"
import type { ApiResponse } from "@domain/models/apiResponse.model"
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
      const url = `/contracts`

      const { data } = await axiosInstance.get(url)

      console.log("data:", data)

      const result: DashboardModel = DashboardMapper.toDomain(data.data)

      console.log("result:", result)

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }

  async checkIn(dto: CheckInDto): Promise<IDashboardRepository.checkIn> {
    try {
      const url = `/contracts`

      const { data } = await axiosInstance.post(url, dto)

      const result: ApiResponse = {
        status: data.status,
        message: data.message,
        timestamp: data.timestamp,
      }

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }
}
