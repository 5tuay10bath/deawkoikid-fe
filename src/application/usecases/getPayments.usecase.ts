import type { IPaymentsRepository } from "@application/ports/payments.repository.port"
import type { IGetPaymentsUsecase } from "@domain/ports/getPayments.usecase.port"
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto"
import { left, right } from "@shared/either"

export class GetPaymentsUsecase implements IGetPaymentsUsecase {
  private readonly paymentsRepository: IPaymentsRepository

  constructor(paymentsRepository: IPaymentsRepository) {
    this.paymentsRepository = paymentsRepository
  }

  async handler(dto: DefaultDto): IGetPaymentsUsecase.output {
    const result = await this.paymentsRepository.getPayments(dto)

    if (result.isRight()) {
      return right(result.value)
    }
    return left(result.value)
  }
}
