import type { ExtraChargeModel } from "@domain/models/extraCharge.model"
import type { GetExtraChargesDto } from "@infrastructure/inbound/dtos/getExtraCharges.dto"
import type { Either } from "@shared/either"

export interface IGetExtraChargesUsecase {
  handler: (dto: GetExtraChargesDto) => IGetExtraChargesUsecase.output
}

export namespace IGetExtraChargesUsecase {
  export type output = Promise<Either<any, ExtraChargeModel[]>>
}
