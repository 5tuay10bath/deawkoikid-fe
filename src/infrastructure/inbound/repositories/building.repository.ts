import type { IBuildingRepository } from "@application/ports/building.repository.port"
import type { CreateBuildingDto } from "../dtos/createBuilding.dto"
import type { DefaultDto } from "../dtos/default.dto"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import type { BuildingModel } from "@domain/models/building.model"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import { BuildingMapper } from "../port/building.mapper"
import { left, right } from "@shared/either"

export class BuildingRepository implements IBuildingRepository {
  private static instance: BuildingRepository

  public static getInstance(): BuildingRepository {
    if (!BuildingRepository.instance) {
      BuildingRepository.instance = new BuildingRepository()
    }
    return BuildingRepository.instance
  }

  async getBuildings(dto: DefaultDto): Promise<IBuildingRepository.getBuildings> {
    const {} = dto

    try {
      const url = `/buildings`

      const { data } = await axiosInstance.get(url)

      const result: BuildingModel[] = BuildingMapper.toDomainArray(data.data)

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }

  async createBuilding(dto: CreateBuildingDto): Promise<IBuildingRepository.createBuilding> {
    try {
      const url = `/buildings`

      const { data } = await axiosInstance.post(url, dto)

      const result: ApiResponse = {
        status: data.status || "success",
        message: data.message || "Building created successfully",
        timestamp: data.timestamp || new Date().toISOString(),
      }

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }
}
