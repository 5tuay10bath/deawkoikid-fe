import type { IBuildingRepository } from "@application/ports/building.repository.port"
import type { CreateBuildingDto } from "../dtos/createBuilding.dto"
import type { UpdateBuildingDto } from "../dtos/updateBuilding.dto"
import type { UpdateFloorDto } from "../dtos/updateFloor.dto"
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

  async updateBuilding(dto: UpdateBuildingDto): Promise<IBuildingRepository.updateBuilding> {
    try {
      const { id, name, codeName, description } = dto
      const url = `/buildings/${id}`

      const payload = { name, codeName, description }

      const { data } = await axiosInstance.put(url, payload)

      const result: ApiResponse = {
        status: data.status || "success",
        message: data.message || "Building updated successfully",
        timestamp: data.timestamp || new Date().toISOString(),
      }

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }

  async updateFloor(dto: UpdateFloorDto): Promise<IBuildingRepository.updateFloor> {
    try {
      const { id, unitCount } = dto
      const url = `/floors/${id}`

      const payload = { unitCount }

      const { data } = await axiosInstance.put(url, payload)

      const result: ApiResponse = {
        status: data.status || "success",
        message: data.message || "Floor updated successfully",
        timestamp: data.timestamp || new Date().toISOString(),
      }

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }
}
