import { create } from "zustand/react"

import { mockDB, type Tenant } from "src/infrastructure/mockData/mockData"

type TenantState = {
  tenants: Tenant[]
  searchTerm: string
  statusFilter: string
  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setTenants: (tenants: Tenant[]) => void
}

export const useTenantStore = create<TenantState>((set) => ({
  tenants: mockDB.getTenants(),
  searchTerm: "",
  statusFilter: "all",
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setTenants: (tenants) => set({ tenants }),
}))
