import type { ContractsModel } from "@domain/models/contracts.model"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import type { CreateContractDto } from "@infrastructure/inbound/dtos/createContract.dto"
import type { UpdateContractDto } from "@infrastructure/inbound/dtos/updateContract.dto"
import type { Either } from "@shared/either"

export type { CreateContractDto, UpdateContractDto }

export interface IContractsRepository {
  getContracts: (dto: DefaultDto) => Promise<IContractsRepository.getContracts>
  createContract: (dto: CreateContractDto) => Promise<IContractsRepository.createContract>
  updateContract: (dto: UpdateContractDto) => Promise<IContractsRepository.updateContract>
}

export namespace IContractsRepository {
  export type getContracts = Promise<Either<any, ContractsModel[]>>
  export type createContract = Promise<Either<any, ApiResponse>>
  export type updateContract = Promise<Either<any, ApiResponse>>
}
