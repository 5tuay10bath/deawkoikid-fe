import type { ICreatePaymentUseCase } from "@domain/ports/createPayment.usecase.port"
import type { IPaymentsRepository, CreatePaymentDto } from "@application/ports/payments.repository.port"

export class CreatePaymentUseCase implements ICreatePaymentUseCase {
  private readonly paymentsRepository: IPaymentsRepository

  constructor(paymentsRepository: IPaymentsRepository) {
    this.paymentsRepository = paymentsRepository
  }

  async handler(dto: CreatePaymentDto): Promise<ICreatePaymentUseCase.Result> {
    return await this.paymentsRepository.createPayment(dto)
  }
}
