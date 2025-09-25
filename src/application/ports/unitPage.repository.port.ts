import type { UnitPageModel } from "@domain/models/unitPage.model";
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto";
import type { Either } from "@shared/either";

export interface IUnitPageRepository {
    getUnitPage: (dto: DefaultDto) => Promise<IUnitPageRepository.getUnitPage>
}

export namespace IUnitPageRepository {
    export type getUnitPage = Promise<Either<any, UnitPageModel[]>>
}