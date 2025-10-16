import type { TenantsPageModel } from "@domain/models/tenantsPage.model"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { CreateTenantDto } from "@infrastructure/inbound/dtos/createTenant.dto"
import type { Either } from "@shared/either"

export type { CreateTenantDto }

export interface ITenantsPageRepository {
  getTenantsPage: (dto: DefaultDto) => Promise<ITenantsPageRepository.getTenantsPage>
  createTenant: (dto: CreateTenantDto) => Promise<ITenantsPageRepository.createTenant>
}

export namespace ITenantsPageRepository {
  export type getTenantsPage = Promise<Either<any, TenantsPageModel[]>>
  export type createTenant = Promise<Either<any, ApiResponse>>
}
