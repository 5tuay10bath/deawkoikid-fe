import type { ContractsModel } from "./contracts.model"

export interface DashboardModel {
  id: string
  address: string
  unitNumber: string
  unitType: "A" | "B" | "C"
  unitSize: number
  unitStatus: "AVAILABLE" | "RESERVED" | "OCCUPIED" | "PENDING"
  floor: number
  latestAirconService: Date
  contract: ContractsModel
}
