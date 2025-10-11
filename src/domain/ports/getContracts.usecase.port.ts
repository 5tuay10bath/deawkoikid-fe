import type { ContractsModel } from "@domain/models/contracts.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { Either } from "@shared/either"

export interface IGetContractsUsecase {
  handler: (dto: DefaultDto) => IGetContractsUsecase.output
}

export namespace IGetContractsUsecase {
  export type output = Promise<Either<any, ContractsModel[]>>
}
