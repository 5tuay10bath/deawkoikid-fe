export interface CreateContractDto {
  unitId: string
  userId: string
  rentType: "MONTHLY" | "YEARLY"
  rentAmount: number
  waterBillingType: "PER_UNIT" | "FLAT_RATE" | "TIERED"
  internet: boolean
  startDate: Date
  endDate: Date
}
