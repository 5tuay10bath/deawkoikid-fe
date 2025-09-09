import { create } from 'zustand/react'
import { mockDB, type Tenant } from 'src/constant/mockData'

interface TenantState {
    tenants: Tenant[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    setTenants: (tenants: Tenant[]) => void;
}

export const useTenantStore = create<TenantState>((set) => ({
    tenants: mockDB.getTenants(),
    searchTerm: "",
    setSearchTerm: (term) => set({ searchTerm: term }),
    setTenants: (tenants) => set({ tenants })
}))