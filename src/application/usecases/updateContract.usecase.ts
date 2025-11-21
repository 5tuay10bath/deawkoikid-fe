import type { IUpdateContractUseCase } from "@domain/ports/updateContract.usecase.port"
import type { IContractsRepository, UpdateContractDto } from "@application/ports/contracts.repository.port"

export class UpdateContractUseCase implements IUpdateContractUseCase {
  private readonly contractsRepository: IContractsRepository

  constructor(contractsRepository: IContractsRepository) {
    this.contractsRepository = contractsRepository
  }

  async handler(dto: UpdateContractDto): Promise<IUpdateContractUseCase.Result> {
    return await this.contractsRepository.updateContract(dto)
  }
}
