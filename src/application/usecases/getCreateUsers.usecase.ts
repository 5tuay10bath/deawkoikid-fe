import type { IContractsRepository } from "@application/ports/contracts.repository.port"
import type { IGetCreateUsersUsecase } from "@domain/ports/getCreateUsers.usecase.port"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import { left, right } from "@shared/either"

export class GetCreateUsersUsecase implements IGetCreateUsersUsecase {
  private readonly contractsRepository: IContractsRepository

  constructor(contractsRepository: IContractsRepository) {
    this.contractsRepository = contractsRepository
  }

  async handler(dto: DefaultDto): IGetCreateUsersUsecase.output {
    const result = await this.contractsRepository.getCreateUsers(dto)

    if (result.isRight()) {
      return right(result.value)
    }
    return left(result.value)
  }
}
