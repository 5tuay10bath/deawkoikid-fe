import { GetPaymentsUsecase } from "@application/usecases/getPayments.usecase"
import { PaymentsRepository } from "../repositories/payments.repository"

export const GetPaymentsFactory = () => {
  const paymentsRepository = PaymentsRepository.getInstance()
  const getPaymentsUsecase = new GetPaymentsUsecase(paymentsRepository)
  return getPaymentsUsecase
}
