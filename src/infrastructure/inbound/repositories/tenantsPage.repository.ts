import type { ITenantsPageRepository } from "@application/ports/tenantsPage.repository.port"
import type { DefaultDto } from "../dtos/default.dto"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import type { TenantsPageModel } from "@domain/models/tenantsPage.model"
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
}
