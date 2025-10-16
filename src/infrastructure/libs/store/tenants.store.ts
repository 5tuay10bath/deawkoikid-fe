import { create } from "zustand/react"

import type { TenantsPageModel } from "@domain/models/tenantsPage.model"
import type { CreateTenantDto } from "@infrastructure/inbound/dtos/createTenant.dto"
import { GetTenantsPageFactory } from "@infrastructure/inbound/factories/getTenantsPage.factory"
import { CreateTenantFactory } from "@infrastructure/inbound/factories/createTenant.factory"

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
  createTenant: (dto: CreateTenantDto) => Promise<{ success: boolean; message?: string }>
}

type TenantStore = TenantState & TenantAction

export const useTenantStore = create<TenantStore>((set, get) => ({
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

  createTenant: async (dto: CreateTenantDto) => {
    try {
      const result = await CreateTenantFactory().handler(dto)
      if (result.isRight()) {
        // Refresh the tenants list after creating
        await get().getTenants()
        return { success: true, message: result.value.message }
      } else if (result.isLeft()) {
        console.error(result.value)
        return { success: false, message: "Failed to create tenant" }
      }
      return { success: false }
    } catch (error) {
      console.error(error)
      return { success: false, message: "An error occurred" }
    }
  },
}))
