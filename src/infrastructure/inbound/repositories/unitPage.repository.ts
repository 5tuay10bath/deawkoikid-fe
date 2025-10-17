import type { IUnitPageRepository } from "@application/ports/unitPage.repository.port"
import type { CreateUnitDto } from "../dtos/createUnit.dto"
import type { UpdateUnitDto } from "../dtos/updateUnit.dto"
import type { DefaultDto } from "../dtos/default.dto"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import type { UnitPageModel } from "@domain/models/unitPage.model"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import { UnitPageMapper } from "../port/unitPage.mapper"
import { left, right } from "@shared/either"

export class UnitPageRepository implements IUnitPageRepository {
  private static instance: UnitPageRepository
  public static getInstance(): UnitPageRepository {
    if (!UnitPageRepository.instance) {
      UnitPageRepository.instance = new UnitPageRepository()
    }
    return UnitPageRepository.instance
  }

  async getUnitPage(dto: DefaultDto): Promise<IUnitPageRepository.getUnitPage> {
    const {} = dto

    try {
      const url = `/units`

      const { data } = await axiosInstance.get(url)

      const result: UnitPageModel[] = UnitPageMapper.toDomainArray(data.data)

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }

  async createUnit(dto: CreateUnitDto): Promise<IUnitPageRepository.createUnit> {
    try {
      const url = `/units`

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

  async updateUnit(dto: UpdateUnitDto): Promise<IUnitPageRepository.updateUnit> {
    try {
      const url = `/units/${dto.id}`

      const { data } = await axiosInstance.put(url, dto)

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
