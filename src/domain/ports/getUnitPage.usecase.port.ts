import type { UnitPageModel } from "@domain/models/unitPage.model"
import type { GetUnitDto } from "@infrastructure/inbound/dtos/unitPage.dto"
import type { Either } from "@shared/either"

export interface IGetUnitPageUsecase {
    handler : (dto : GetUnitDto) => IGetUnitPageUsecase.output
}

export namespace IGetUnitPageUsecase {
    export type output = Promise<Either<any, UnitPageModel[]>>
}