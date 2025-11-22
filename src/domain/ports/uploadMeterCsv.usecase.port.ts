import type { ApiResponse } from "@domain/models/apiResponse.model"
import type { UploadMeterCsvDto } from "@infrastructure/inbound/dtos/uploadMeterCsv.dto"
import type { Either } from "@shared/either"

export interface IUploadMeterCsvUsecase {
  handler: (dto: UploadMeterCsvDto) => IUploadMeterCsvUsecase.output
}

export namespace IUploadMeterCsvUsecase {
  export type output = Promise<Either<any, ApiResponse>>
}
