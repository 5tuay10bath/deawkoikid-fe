export interface UpdateContractDto {
  id: string
  endDate: string
  rentAmount: number
  rentType: "MONTHLY" | "YEARLY"
  waterBillingType: "PER_UNIT" | "FLAT_RATE" | "TIERED"
  internet: boolean
}
