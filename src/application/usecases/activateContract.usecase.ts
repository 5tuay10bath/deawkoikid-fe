import type { IActivateContractUseCase } from "./activateContract.usecase.port"
import type { IContractsRepository } from "@application/ports/contracts.repository.port"
import type { ActivateContractDto } from "@infrastructure/inbound/dtos/activateContract.dto"

export class ActivateContractUseCase implements IActivateContractUseCase {
  private contractsRepository: IContractsRepository

  constructor(contractsRepository: IContractsRepository) {
    this.contractsRepository = contractsRepository
  }

  async handler(dto: ActivateContractDto): Promise<IContractsRepository.activateContract> {
    return await this.contractsRepository.activateContract(dto)
  }
}
