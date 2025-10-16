import { create } from "zustand/react"

import type { ContractsModel } from "@domain/models/contracts.model"
import type { CreateContractDto } from "@infrastructure/inbound/dtos/createContract.dto"
import { GetContractsFactory } from "@infrastructure/inbound/factories/getContracts.factory"
import { CreateContractFactory } from "@infrastructure/inbound/factories/createContract.factory"

type ContractTemplate = {
  name: string
  content: string
}

type ContractState = {
  contracts: ContractsModel[]
  searchTerm: string
  isTemplateOpen: boolean
  isViewOpen: boolean
  selectedContract: ContractsModel | null
  template: ContractTemplate
  setContracts: (contracts: ContractsModel[]) => void
  setSearchTerm: (term: string) => void
  setIsTemplateOpen: (isOpen: boolean) => void
  setIsViewOpen: (isOpen: boolean) => void
  setSelectedContract: (contract: ContractsModel | null) => void
  setTemplate: (template: ContractTemplate) => void
  updateTemplate: (updates: Partial<ContractTemplate>) => void
}

interface ContractAction {
  getContracts: () => Promise<void>
  createContract: (dto: CreateContractDto) => Promise<{ success: boolean; message?: string }>
}

type ContractStore = ContractState & ContractAction

export const useContractStore = create<ContractStore>((set, get) => ({
  contracts: [],
  searchTerm: "",
  isTemplateOpen: false,
  isViewOpen: false,
  selectedContract: null,
  template: {
    name: "",
    content: `RESIDENTIAL LEASE AGREEMENT

This lease agreement is entered into on [DATE] between Property Manager (Landlord) and [TENANT_NAME] (Tenant).

PROPERTY DETAILS:
- Unit Number: [UNIT_NUMBER]
- Address: [PROPERTY_ADDRESS]

LEASE TERMS:
- Start Date: [START_DATE]
- End Date: [END_DATE]
- Monthly Rent: $[RENT_AMOUNT]
- Security Deposit: $[SECURITY_DEPOSIT]

TENANT RESPONSIBILITIES:
1. Pay rent on time each month
2. Maintain the property in good condition
3. Follow all building rules and regulations
4. Provide proper notice before moving out

LANDLORD RESPONSIBILITIES:
1. Maintain common areas
2. Ensure property is habitable
3. Respond to maintenance requests promptly
4. Respect tenant privacy rights

This agreement is governed by local rental laws.

Landlord Signature: ___________________ Date: ___________
Tenant Signature: ____________________ Date: ___________`,
  },
  setContracts: (contracts) => set({ contracts }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setIsTemplateOpen: (isOpen) => set({ isTemplateOpen: isOpen }),
  setIsViewOpen: (isOpen) => set({ isViewOpen: isOpen }),
  setSelectedContract: (contract) => set({ selectedContract: contract }),
  setTemplate: (template) => set({ template }),
  updateTemplate: (updates) => set({ template: { ...get().template, ...updates } }),

  getContracts: async () => {
    try {
      const result = await GetContractsFactory().handler({})
      if (result.isRight()) {
        set({ contracts: result.value })
      }
    } catch {
      // Error handling
    }
  },

  createContract: async (dto: CreateContractDto) => {
    try {
      const result = await CreateContractFactory().handler(dto)
      if (result.isRight()) {
        await get().getContracts()
        return { success: true, message: result.value.message }
      } else if (result.isLeft()) {
        return { success: false, message: "Failed to create contract" }
      }
      return { success: false }
    } catch {
      return { success: false, message: "An error occurred" }
    }
  },
}))
