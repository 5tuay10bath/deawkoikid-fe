import type { ContractsModel } from "@domain/models/contracts.model"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { CreateContractDto } from "@infrastructure/inbound/dtos/createContract.dto"
import type { Either } from "@shared/either"

export type { CreateContractDto }

export interface IContractsRepository {
  getContracts: (dto: DefaultDto) => Promise<IContractsRepository.getContracts>
  createContract: (dto: CreateContractDto) => Promise<IContractsRepository.createContract>
}

export namespace IContractsRepository {
  export type getContracts = Promise<Either<any, ContractsModel[]>>
  export type createContract = Promise<Either<any, ApiResponse>>
}
