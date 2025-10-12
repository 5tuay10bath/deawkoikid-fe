import { create } from "zustand/react"

import { mockDB, type Contract } from "src/infrastructure/mockData/mockData"
import type { ContractsModel } from "@domain/models/contracts.model"
import { GetContractsFactory } from "@infrastructure/inbound/factories/getContracts.factory"

type ContractTemplate = {
  name: string
  content: string
}

type ContractState = {
  contracts: Contract[]
  contractsTest: ContractsModel[]
  searchTerm: string
  isTemplateOpen: boolean
  isViewOpen: boolean
  selectedContract: Contract | null
  template: ContractTemplate
  //new
  isNewContractOpen: boolean
  newContract: ContractsModel
  //end new
  setContractsTest: (contracts: ContractsModel[]) => void
  setContracts: (contracts: Contract[]) => void
  setSearchTerm: (term: string) => void
  setIsTemplateOpen: (isOpen: boolean) => void
  setIsViewOpen: (isOpen: boolean) => void
  //new
  setIsNewContractOpen: (isOpen: boolean) => void
  updateNewContract: (updates: Partial<ContractsModel>) => void
  resetNewContract: () => void
  addContract: (contract: ContractsModel) => void
  //end new
  setSelectedContract: (contract: Contract | null) => void
  setTemplate: (template: ContractTemplate) => void
  updateTemplate: (updates: Partial<ContractTemplate>) => void
}

interface ContractAction {
  getContracts: () => Promise<void>
}

type ContractStore = ContractState & ContractAction

const initialNewContract = (): ContractsModel => ({
  id: "",
  tenantId: "",
  unitId: "",
  fullName: "",
  phone: "",
  identificationNumber: "",
  unitNumber: "",
  unitType: "",
  unitSize: "",
  rentType: "monthly",
  rentAmount: 0,
  waterBillingType: "per_unit",
  internet: false,
  startDate: new Date(),
  endDate: new Date(),
  status: "pending",
})

export const useContractStore = create<ContractStore>((set, get) => ({
  contracts: mockDB.getContracts(),
  contractsTest: [],
  searchTerm: "",
  isTemplateOpen: false,
  isViewOpen: false,
  selectedContract: null,
  //new
  isNewContractOpen: false,
  newContract: initialNewContract(),
  //end new
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
  setContractsTest: (contracts) => set({ contractsTest: contracts }),
  setContracts: (contracts) => set({ contracts }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setIsTemplateOpen: (isOpen) => set({ isTemplateOpen: isOpen }),
  setIsViewOpen: (isOpen) => set({ isViewOpen: isOpen }),
  setSelectedContract: (contract) => set({ selectedContract: contract }),
  //new
  setIsNewContractOpen: (isOpen) => set({ isNewContractOpen: isOpen }),
  updateNewContract: (updates) => set({ newContract: { ...get().newContract, ...updates } }),
  resetNewContract: () => set({ newContract: initialNewContract() }),
  addContract: (contract) => set({ contractsTest: [...get().contractsTest, contract] }),
  //end new
  setTemplate: (template) => set({ template }),
  updateTemplate: (updates) => set({ template: { ...get().template, ...updates } }),

  getContracts: async () => {
    try {
      const result = await GetContractsFactory().handler({})
      if (result.isRight()) {
        set({ contractsTest: result.value })
      } else if (result.isLeft()) {
        console.error(result.value)
      }
    } catch (error) {
      console.error(error)
    }
  },
}))
