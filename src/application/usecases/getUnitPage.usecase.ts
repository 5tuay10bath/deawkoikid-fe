import type { IUnitPageRepository } from "@application/ports/unitPage.repository.port";
import type { IGetUnitPageUsecase } from "@domain/ports/getUnitPage.usecase.port";
import type { DefaultDto } from "@infrastructure/inbound/dtos/default.dto";
import { left, right } from "@shared/either";

export class GetUnitPageUsecase implements IGetUnitPageUsecase {
    private readonly unitPageRepository: IUnitPageRepository;

    constructor(unitPageRepository: IUnitPageRepository) {
        this.unitPageRepository = unitPageRepository;
    }

    async handler(dto: DefaultDto): IGetUnitPageUsecase.output {
        const result = await this.unitPageRepository.getUnitPage(dto);

        if (result.isRight()){
            return right(result.value);
        }
        return left(result.value);
    }
}