import { create } from "zustand/react"

import { mockDB, type Tenant } from "src/infrastructure/mockData/mockData"
import type { TenantsPageModel } from "@domain/models/tenantsPage.model"
import { GetTenantsPageFactory } from "@infrastructure/inbound/factories/getTenantsPage.factory"

type TenantState = {
  tenants: Tenant[]
  tenantsTest: TenantsPageModel[]
  newTenantsTest: TenantsPageModel
  searchTerm: string
  statusFilter: string
  setTenantsTest: (tenants: TenantsPageModel[]) => void
  setNewTenant: (patch: Partial<TenantsPageModel>) => void
  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setTenants: (tenants: Tenant[]) => void
  resetTenantsTest: () => void
}

interface TenantAction {
  getTenants: () => Promise<void>
}

type TenantStore = TenantState & TenantAction

const initialNewTenant = (): TenantsPageModel => ({
  id: "",
  fullName: "",
  phone: "",
  email: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  unitNumber: "",
  startDate: new Date(),
  endDate: new Date(),
  rentAmount: 0,
  billingCycle: "monthly",
  status: "active",
})

export const useTenantStore = create<TenantStore>((set) => ({
  tenants: mockDB.getTenants(),
  tenantsTest: [],
  newTenantsTest: initialNewTenant(),
  searchTerm: "",
  statusFilter: "all",
  setTenantsTest: (tenants) => set({ tenantsTest: tenants }),
  setNewTenant: (patch) => set((s) => ({ newTenantsTest: { ...s.newTenantsTest, ...patch } })),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTenants: (tenants) => set({ tenants }),
  resetTenantsTest: () => set({ newTenantsTest: initialNewTenant() }),

  getTenants: async () => {
    try {
      const result = await GetTenantsPageFactory().handler({})
      if (result.isRight()) {
        set({ tenantsTest: result.value })
      } else if (result.isLeft()) {
        console.error(result.value)
      }
    } catch (error) {
      console.error(error)
    }
  },
}))
