import type { CreatePaymentDto } from "@application/ports/payments.repository.port"
import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { Either } from "@shared/either"

export interface ICreatePaymentUseCase {
  handler: (dto: CreatePaymentDto) => Promise<ICreatePaymentUseCase.Result>
}

export namespace ICreatePaymentUseCase {
  export type Result = Either<any, ApiResponse>
}
