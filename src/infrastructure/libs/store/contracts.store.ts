import { create } from "zustand/react"

import { mockDB, type Contract } from "src/infrastructure/mockData/mockData"

type ContractTemplate = {
  name: string
  content: string
}

type ContractState = {
  contracts: Contract[]
  searchTerm: string
  isTemplateOpen: boolean
  isViewOpen: boolean
  selectedContract: Contract | null
  template: ContractTemplate
  setContracts: (contracts: Contract[]) => void
  setSearchTerm: (term: string) => void
  setIsTemplateOpen: (isOpen: boolean) => void
  setIsViewOpen: (isOpen: boolean) => void
  setSelectedContract: (contract: Contract | null) => void
  setTemplate: (template: ContractTemplate) => void
  updateTemplate: (updates: Partial<ContractTemplate>) => void
}

export const useContractStore = create<ContractState>((set, get) => ({
  contracts: mockDB.getContracts(),
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
Tenant Signature: ____________________ Date: ___________`
  },
  setContracts: (contracts) => set({ contracts }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setIsTemplateOpen: (isOpen) => set({ isTemplateOpen: isOpen }),
  setIsViewOpen: (isOpen) => set({ isViewOpen: isOpen }),
  setSelectedContract: (contract) => set({ selectedContract: contract }),
  setTemplate: (template) => set({ template }),
  updateTemplate: (updates) => set({ template: { ...get().template, ...updates } }),
}))