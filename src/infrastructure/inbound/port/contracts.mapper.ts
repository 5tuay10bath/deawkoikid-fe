import type { ContractsEntity } from "@client/entities/contracts.entity"
import type { ContractsModel } from "@domain/models/contracts.model"
import { StrictBuilder } from "builder-pattern"

export class ContractsMapper {
  static toDomain(contractsEntity: ContractsEntity): ContractsModel {
    return StrictBuilder<ContractsModel>()
      .id(contractsEntity.id)
      .tenantId(contractsEntity.tenantId)
      .tenantName(contractsEntity.tenantName)
      .unitNumber(contractsEntity.unitNumber)
      .contractType(contractsEntity.contractType)
      .startDate(contractsEntity.startDate)
      .endDate(contractsEntity.endDate)
      .rentAmount(contractsEntity.rentAmount)
      .securityDeposit(contractsEntity.securityDeposit)
      .paymentFrequency(contractsEntity.paymentFrequency)
      .status(contractsEntity.status)
      .signedDate(contractsEntity.signedDate)
      .terminationDate(contractsEntity.terminationDate)
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
