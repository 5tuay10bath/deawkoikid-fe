import type { CreateUnitModel } from "@domain/models/contracts.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { Either } from "@shared/either"

export interface IGetCreateUnitsUsecase {
  handler: (dto: DefaultDto) => IGetCreateUnitsUsecase.output
}

export namespace IGetCreateUnitsUsecase {
  export type output = Promise<Either<any, CreateUnitModel[]>>
}
