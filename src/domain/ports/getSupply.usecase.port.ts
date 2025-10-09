import type { SupplyModel } from "@domain/models/supply.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { Either } from "@shared/either"

export interface IGetSupplyUsecase {
  handler: (dto: DefaultDto) => IGetSupplyUsecase.output
}

export namespace IGetSupplyUsecase {
  export type output = Promise<Either<any, SupplyModel[]>>
}
