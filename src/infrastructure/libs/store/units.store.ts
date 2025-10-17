import { create } from "zustand/react"

import type { UnitPageModel } from "@domain/models/unitPage.model"
import type { CreateUnitDto } from "@infrastructure/inbound/dtos/createUnit.dto"
import type { UpdateUnitDto } from "@infrastructure/inbound/dtos/updateUnit.dto"
import { GetUnitPageFactory } from "@infrastructure/inbound/factories/getUnitPage.factory"
import { CreateUnitFactory } from "@infrastructure/inbound/factories/createUnit.factory"
import { UpdateUnitFactory } from "@infrastructure/inbound/factories/updateUnit.factory"

type UnitState = {
  units: UnitPageModel[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  setUnits: (units: UnitPageModel[]) => void
}

interface UnitAction {
  getUnits: () => Promise<void>
  createUnit: (dto: CreateUnitDto) => Promise<{ success: boolean; message?: string }>
  updateUnit: (dto: UpdateUnitDto) => Promise<{ success: boolean; message?: string }>
}

type UnitStore = UnitState & UnitAction

export const useUnitStore = create<UnitStore>((set, get) => ({
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

  createUnit: async (dto: CreateUnitDto) => {
    try {
      const result = await CreateUnitFactory().handler(dto)
      if (result.isRight()) {
        await get().getUnits()
        return { success: true, message: result.value.message }
      } else if (result.isLeft()) {
        console.error(result.value)
        return { success: false, message: "Failed to create unit" }
      }
      return { success: false }
    } catch (error) {
      console.error(error)
      return { success: false, message: "An error occurred" }
    }
  },

  updateUnit: async (dto: UpdateUnitDto) => {
    try {
      const result = await UpdateUnitFactory().handler(dto)
      if (result.isRight()) {
        await get().getUnits()
        return { success: true, message: result.value.message }
      } else if (result.isLeft()) {
        console.error(result.value)
        return { success: false, message: "Failed to update unit" }
      }
      return { success: false }
    } catch (error) {
      console.error(error)
      return { success: false, message: "An error occurred" }
    }
  },
}))
