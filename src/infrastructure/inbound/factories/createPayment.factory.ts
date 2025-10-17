import { CreatePaymentUseCase } from "@application/usecases/createPayment.usecase"
import { PaymentsRepository } from "../repositories/payments.repository"

export const CreatePaymentFactory = () => {
  const paymentsRepository = PaymentsRepository.getInstance()
  const createPaymentUseCase = new CreatePaymentUseCase(paymentsRepository)
  return createPaymentUseCase
}
