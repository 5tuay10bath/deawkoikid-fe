import type { ContractsModel } from "@domain/models/contracts.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { Either } from "@shared/either"

export interface IContractsRepository {
  getContracts: (dto: DefaultDto) => Promise<IContractsRepository.getContracts>
}

export namespace IContractsRepository {
  export type getContracts = Promise<Either<any, ContractsModel[]>>
}
