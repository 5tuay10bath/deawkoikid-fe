import type { IContractsRepository } from "@application/ports/contracts.repository.port"
import type { IGetContractsUsecase } from "@domain/ports/getContracts.usecase.port"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import { left, right } from "@shared/either"

export class GetContractsUsecase implements IGetContractsUsecase {
  private readonly contractsRepository: IContractsRepository

  constructor(contractsRepository: IContractsRepository) {
    this.contractsRepository = contractsRepository
  }

  async handler(dto: DefaultDto): IGetContractsUsecase.output {
    const result = await this.contractsRepository.getContracts(dto)

    if (result.isRight()) {
      return right(result.value)
    }
    return left(result.value)
  }
}
