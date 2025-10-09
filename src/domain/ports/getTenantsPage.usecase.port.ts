import type { TenantsPageModel } from "@domain/models/tenantsPage.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { Either } from "@shared/either"

export interface IGetTenantsPageUseCase {
    handler: (dto: DefaultDto) => IGetTenantsPageUseCase.output
}

export namespace IGetTenantsPageUseCase {
    export type output = Promise<Either<any, TenantsPageModel>>
}
