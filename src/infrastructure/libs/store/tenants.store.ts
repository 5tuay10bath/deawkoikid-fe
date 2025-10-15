import { create } from "zustand/react"

import type { TenantsPageModel } from "@domain/models/tenantsPage.model"
import { GetTenantsPageFactory } from "@infrastructure/inbound/factories/getTenantsPage.factory"

type TenantState = {
  tenants: TenantsPageModel[]
  searchTerm: string
  statusFilter: string
  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setTenants: (tenants: TenantsPageModel[]) => void
}

interface TenantAction {
  getTenants: () => Promise<void>
}

type TenantStore = TenantState & TenantAction

export const useTenantStore = create<TenantStore>((set) => ({
  tenants: [],
  searchTerm: "",
  statusFilter: "all",
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTenants: (tenants) => set({ tenants }),

  getTenants: async () => {
    try {
      const result = await GetTenantsPageFactory().handler({})
      if (result.isRight()) {
        set({ tenants: result.value })
      } else if (result.isLeft()) {
        console.error(result.value)
      }
    } catch (error) {
      console.error(error)
    }
  },
}))
