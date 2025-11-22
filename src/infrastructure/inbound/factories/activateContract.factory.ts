import { ActivateContractUseCase } from "@application/usecases/activateContract.usecase"
import { ContractsRepository } from "@infrastructure/inbound/repositories/contracts.repository"

export class ActivateContractFactory {
  static getInstance(): ActivateContractUseCase {
    const contractsRepository = ContractsRepository.getInstance()
    return new ActivateContractUseCase(contractsRepository)
  }
}
