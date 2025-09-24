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
  updateUnit: (id: number, updates: Partial<Unit>) => Promise<void>
  deleteUnit: (id: number) => Promise<void>
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
    const res = await axiosInstance.get("/units")
    set({ units: res.data.data })
  },

  // CREATE
  addUnit: async (unit) => {
    const res = await axiosInstance.post("/units", unit)
    const createdUnit = res.data?.data
    if (createdUnit) {
      set((state) => ({ units: [...state.units, createdUnit] }))
    }
  },

  // UPDATE
  // updateUnit: async (id, updates) => {
  //   const res = await axiosInstance.put(`/units/${id}`, updates)
  //   set((state) => ({
  //     units: state.units.map((u) => (u.id === id ? res.data.data : u)),
  //   }))
  // },
  updateUnit: async (id, updates) => {
    const res = await axiosInstance.put(`/units/${id}`, updates)
    if (res.data && res.data.data) {
      set((state) => ({
        units: state.units.map((u) => (u.id === id ? res.data.data : u)),
      }))
    } else {
      await useUnitStore.getState().loadUnits()
    }
  },

  // DELETE
  deleteUnit: async (id) => {
    await axiosInstance.delete(`/units/${id}`)
    set((state) => ({
      units: state.units.filter((u) => u.id !== id),
    }))
  },
}))
