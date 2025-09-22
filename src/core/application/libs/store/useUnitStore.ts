import { create } from "zustand"

import type { Unit } from "@client/types/IUnitData"
// หรือ import type มาจาก schema/db จริงก็ได้

import { axiosInstance } from "@core/application/libs/axios/axiosInstance"

type UnitState = {
  units: Unit[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  setUnits: (units: Unit[]) => void
  loadUnits: () => Promise<void>
  addUnit: (units: Omit<Unit, "id">) => Promise<void>
  updateUnit: (id: string, updates: Partial<Unit>) => Promise<void>
  deleteUnit: (id: string) => Promise<void>
}

export const useUnitStore = create<UnitState>((set) => ({
  units: [],
  searchTerm: "",

  // local state
  setSearchTerm: (term) => set({ searchTerm: term }),
  setUnits: (units) => set({ units }),

  // ---- CRUD Methods ----

  // READ
  loadUnits: async () => {
    const { data } = await axiosInstance.get("/units")
    set({ units: data })
  },

  // CREATE
  addUnit: async (unit) => {
    const { data } = await axiosInstance.post("/units", unit)
    set((state) => ({ units: [...state.units, data] }))
  },

  // UPDATE
  updateUnit: async (id, updates) => {
    const { data } = await axiosInstance.put(`/units/${id}`, updates)
    set((state) => ({
      units: state.units.map((u) => (u.id === id ? data : u)),
    }))
  },

  // DELETE
  deleteUnit: async (id) => {
    await axiosInstance.delete(`/units/${id}`)
    set((state) => ({
      units: state.units.filter((u) => u.id !== id),
    }))
  },
}))
