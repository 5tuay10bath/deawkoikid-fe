import { create } from "zustand/react"

import { mockDB, type Room } from "src/infrastructure/mockData/mockData"
import type { UnitPageModel } from "@domain/models/unitPage.model"
import { GetUnitPageFactory } from "@infrastructure/inbound/factories/getUnitPage.factory"

type UnitState = {
  units: Room[]
  unitsTest: UnitPageModel[]
  searchTerm: string
  setUnitsTest: (units: UnitPageModel[]) => void
  setSearchTerm: (term: string) => void
  setUnits: (units: Room[]) => void
}

interface UnitAction {
  getUnits: () => Promise<void>
}

type UnitStore = UnitState & UnitAction


export const useUnitStore = create<UnitStore>((set) => ({
  units: mockDB.getRooms(),
  searchTerm: "",
  unitsTest: [],
  setUnitsTest: (units) => set({ unitsTest: units }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setUnits: (units) => set({ units }),

  getUnits: async () => {
    try {
      const result = await GetUnitPageFactory().handler({})
      if (result.isRight()) {
        set({ unitsTest: result.value })
      }else if (result.isLeft()){
        console.error(result.value)
      }
    }catch (error) {
      console.error(error)
    }
  }
}))
