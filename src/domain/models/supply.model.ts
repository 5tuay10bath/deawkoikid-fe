export interface SupplyModel {
  id: string
  name: string
  category: "cleaning" | "repair" | "electrical" | "plumbing" | "other"
  quantity: number
  unit: string
  minQuantity: number
  supplier: string
  lastRestockDate: Date
  cost: number
  status: "in-stock" | "low-stock" | "out-of-stock"
}
