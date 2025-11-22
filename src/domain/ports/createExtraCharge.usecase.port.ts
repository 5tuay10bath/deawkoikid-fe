import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { CreateExtraChargeDto } from "@infrastructure/inbound/dtos/createExtraCharge.dto"
import type { Either } from "@shared/either"

export interface ICreateExtraChargeUsecase {
  handler: (dto: CreateExtraChargeDto) => ICreateExtraChargeUsecase.output
}

export namespace ICreateExtraChargeUsecase {
  export type output = Promise<Either<any, ApiResponse>>
}
