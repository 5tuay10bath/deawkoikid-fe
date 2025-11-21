import type { IDashboardRepository } from "@application/ports/dashboard.repository.port"
import type { CheckInDto } from "../dtos/checkIn.dto"
import type { CheckOutDto } from "../dtos/checkOut.dto"
import type { DefaultDto } from "../dtos/default.dto"
import type { UploadMeterCsvDto } from "../dtos/uploadMeterCsv.dto"
import type { GetExtraChargesDto } from "../dtos/getExtraCharges.dto"
import type { CreateExtraChargeDto } from "../dtos/createExtraCharge.dto"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import type { DashboardModel } from "@domain/models/dashboard.model"
import type { ExtraChargeModel } from "@domain/models/extraCharge.model"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import { DashboardMapper } from "../port/dashboard.mapper"
import { ExtraChargeMapper } from "../port/extraCharge.mapper"
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

      const { data } = await axiosInstance.get(url)

      const result: DashboardModel[] = DashboardMapper.toDomainArray(data.data)

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }

  async checkIn(dto: CheckInDto): Promise<IDashboardRepository.checkIn> {
    try {
      const url = `/dashboard/check-in/${dto.id}`

      const { data } = await axiosInstance.put(url)

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

  async checkOut(dto: CheckOutDto): Promise<IDashboardRepository.checkOut> {
    try {
      const url = `/dashboard/check-out/${dto.id}`

      const { data } = await axiosInstance.put(url)

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

  async uploadMeterCsv(dto: UploadMeterCsvDto): Promise<IDashboardRepository.uploadMeterCsv> {
    try {
      const url = `/units/meter/csv`

      const formData = new FormData()
      formData.append("file", dto.file)

      const { data } = await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const result: ApiResponse = {
        status: data.status || "success",
        message: data.message || "CSV meter update completed",
        timestamp: data.timestamp || new Date().toISOString(),
      }

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }

  async getExtraCharges(dto: GetExtraChargesDto): Promise<IDashboardRepository.getExtraCharges> {
    try {
      const url = `/dashboard/${dto.id}/extra-charges`

      const { data } = await axiosInstance.get(url)

      const result: ExtraChargeModel[] = ExtraChargeMapper.toDomainArray(data.data)

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }

  async createExtraCharge(dto: CreateExtraChargeDto): Promise<IDashboardRepository.createExtraCharge> {
    try {
      const url = `/dashboard/${dto.id}/extra-charges`

      const payload = {
        topic: dto.topic,
        description: dto.description,
        price: dto.price,
      }

      const { data } = await axiosInstance.post(url, payload)

      const result: ApiResponse = {
        status: data.status || "success",
        message: data.message || "Extra charge added successfully",
        timestamp: data.timestamp || new Date().toISOString(),
      }

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }
}
