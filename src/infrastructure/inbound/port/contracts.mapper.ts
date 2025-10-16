import type { ContractsEntity } from "@client/entities/contracts.entity"
import type { ContractsModel } from "@domain/models/contracts.model"
import { StrictBuilder } from "builder-pattern"

export class ContractsMapper {
  static toDomain(contractsEntity: ContractsEntity): ContractsModel {
    return StrictBuilder<ContractsModel>()
      .id(contractsEntity.id)
      .user(contractsEntity.user)
      .unit(contractsEntity.unit)
      .rentType(contractsEntity.rentType as "MONTHLY" | "YEARLY")
      .rentAmount(contractsEntity.rentAmount)
      .waterBillingType(contractsEntity.waterBillingType as "PER_UNIT" | "FLAT_RATE" | "TIERED")
      .internet(contractsEntity.internet)
      .startDate(contractsEntity.startDate)
      .endDate(contractsEntity.endDate)
      .status(contractsEntity.status as "DRAFT" | "SIGNED" | "ACTIVE" | "EXPIRED")
      .build()
  }

  static toDomainArray(contractsEntities: ContractsEntity[]): ContractsModel[] {
    if (!Array.isArray(contractsEntities)) {
      console.error("Expected array but received:", typeof contractsEntities)
      return []
    }

    return contractsEntities.map((entity) => this.toDomain(entity))
  }
}
