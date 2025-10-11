import type { UnitPageModel } from "@domain/models/unitPage.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { Either } from "@shared/either"

export interface IGetUnitPageUsecase {
  handler: (dto: DefaultDto) => IGetUnitPageUsecase.output
}

export namespace IGetUnitPageUsecase {
  export type output = Promise<Either<any, UnitPageModel[]>>
}
