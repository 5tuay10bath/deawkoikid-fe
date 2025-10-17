import type { IContractsRepository } from "@application/ports/contracts.repository.port"
import type { IGetCreateUnitsUsecase } from "@domain/ports/getCreateUnits.usecase.port"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import { left, right } from "@shared/either"

export class GetCreateUnitsUsecase implements IGetCreateUnitsUsecase {
  private readonly contractsRepository: IContractsRepository

  constructor(contractsRepository: IContractsRepository) {
    this.contractsRepository = contractsRepository
  }

  async handler(dto: DefaultDto): IGetCreateUnitsUsecase.output {
    const result = await this.contractsRepository.getCreateUnits(dto)

    if (result.isRight()) {
      return right(result.value)
    }
    return left(result.value)
  }
}
