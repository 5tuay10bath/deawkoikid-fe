import type { ITenantsPageRepository } from "@application/ports/tenantsPage.repository.port"
import type { CreateTenantDto } from "../dtos/createTenant.dto"
import type { UpdateTenantDto } from "../dtos/updateTenant.dto"
import type { DefaultDto } from "../dtos/default.dto"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import type { TenantsPageModel } from "@domain/models/tenantsPage.model"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import { TenantsPageMapper } from "../port/tenantsPage.mapper"
import { left, right } from "@shared/either"

export class TenantsPageRepository implements ITenantsPageRepository {
  private static instance: TenantsPageRepository
  public static getInstance(): TenantsPageRepository {
    if (!TenantsPageRepository.instance) {
      TenantsPageRepository.instance = new TenantsPageRepository()
    }
    return TenantsPageRepository.instance
  }

  async getTenantsPage(dto: DefaultDto): Promise<ITenantsPageRepository.getTenantsPage> {
    const {} = dto

    try {
      const url = `/users`

      const { data } = await axiosInstance.get(url)

      const result: TenantsPageModel[] = TenantsPageMapper.toDomainArray(data.data)

      return right(result)
    } catch (error) {
      console.error(error)
      return left(error)
    }
  }

  async createTenant(dto: CreateTenantDto): Promise<ITenantsPageRepository.createTenant> {
    try {
      const url = `/users`

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

  async updateTenant(dto: UpdateTenantDto): Promise<ITenantsPageRepository.updateTenant> {
    try {
      const url = `/users/${dto.id}`

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
