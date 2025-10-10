import { create } from "zustand/react"

import { mockDB, type Tenant } from "src/infrastructure/mockData/mockData"
import type { TenantsPageModel } from "@domain/models/tenantsPage.model"
import { GetTenantsPageFactory } from "@infrastructure/inbound/factories/getTenantsPage.factory"

type TenantState = {
  tenants: Tenant[]
  tenantsTest: TenantsPageModel[]
  searchTerm: string
  statusFilter: string
  setTenantsTest: (tenants: TenantsPageModel[]) => void
  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setTenants: (tenants: Tenant[]) => void
}

interface TenantAction {
  getTenants: () => Promise<void>
}

type TenantStore = TenantState & TenantAction

export const useTenantStore = create<TenantStore>((set) => ({
  tenants: mockDB.getTenants(),
  tenantsTest: [],
  searchTerm: "",
  statusFilter: "all",
  setTenantsTest: (tenants) => set({ tenantsTest: tenants }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTenants: (tenants) => set({ tenants }),

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
