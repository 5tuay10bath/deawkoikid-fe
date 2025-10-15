import { create } from "zustand/react"

import type { UnitPageModel } from "@domain/models/unitPage.model"
import { GetUnitPageFactory } from "@infrastructure/inbound/factories/getUnitPage.factory"

type UnitState = {
  units: UnitPageModel[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  setUnits: (units: UnitPageModel[]) => void
}

interface UnitAction {
  getUnits: () => Promise<void>
}

type UnitStore = UnitState & UnitAction

export const useUnitStore = create<UnitStore>((set) => ({
  units: [],
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
  setUnits: (units) => set({ units }),

  getUnits: async () => {
    try {
      const result = await GetUnitPageFactory().handler({})
      if (result.isRight()) {
        set({ units: result.value })
      } else if (result.isLeft()) {
        console.error(result.value)
      }
    } catch (error) {
      console.error(error)
    }
  },
}))
