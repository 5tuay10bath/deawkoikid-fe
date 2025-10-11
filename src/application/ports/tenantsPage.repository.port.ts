import type { TenantsPageModel } from "@domain/models/tenantsPage.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { Either } from "@shared/either"

export interface ITenantsPageRepository {
  getTenantsPage: (dto: DefaultDto) => Promise<ITenantsPageRepository.getTenantsPage>
}

export namespace ITenantsPageRepository {
  export type getTenantsPage = Promise<Either<any, TenantsPageModel[]>>
}
