import type { BuildingModel } from "@domain/models/building.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { Either } from "@shared/either"

export interface IGetBuildingsUsecase {
  handler: (dto: DefaultDto) => IGetBuildingsUsecase.output
}

export namespace IGetBuildingsUsecase {
  export type output = Promise<Either<any, BuildingModel[]>>
}
