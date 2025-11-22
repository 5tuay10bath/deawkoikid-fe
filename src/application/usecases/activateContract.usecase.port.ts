import type { IContractsRepository } from "@application/ports/contracts.repository.port"
import type { ActivateContractDto } from "@infrastructure/inbound/dtos/activateContract.dto"

export interface IActivateContractUseCase {
  handler: (dto: ActivateContractDto) => Promise<IContractsRepository.activateContract>
}
