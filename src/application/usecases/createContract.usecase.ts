import type { ICreateContractUseCase } from "@domain/ports/createContract.usecase.port"
import type { IContractsRepository, CreateContractDto } from "@application/ports/contracts.repository.port"

export class CreateContractUseCase implements ICreateContractUseCase {
  private readonly contractsRepository: IContractsRepository

  constructor(contractsRepository: IContractsRepository) {
    this.contractsRepository = contractsRepository
  }

  async handler(dto: CreateContractDto): Promise<ICreateContractUseCase.Result> {
    return await this.contractsRepository.createContract(dto)
  }
}
