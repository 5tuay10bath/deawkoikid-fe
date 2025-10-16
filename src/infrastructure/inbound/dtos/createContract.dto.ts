export interface CreateContractDto {
  userId: string
  unitId: string
  rentType: "MONTHLY" | "YEARLY"
  rentAmount: number
  waterBillingType: "PER_UNIT" | "FLAT_RATE" | "TIERED"
  internet: boolean
  startDate: Date
  endDate: Date
}
