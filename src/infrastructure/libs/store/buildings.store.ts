import { create } from "zustand/react"

import type { BuildingModel } from "@domain/models/building.model"
import type { CreateBuildingDto } from "@infrastructure/inbound/dtos/createBuilding.dto"
import type { UpdateBuildingDto } from "@infrastructure/inbound/dtos/updateBuilding.dto"
import type { UpdateFloorDto } from "@infrastructure/inbound/dtos/updateFloor.dto"
import { GetBuildingsFactory } from "@infrastructure/inbound/factories/getBuildings.factory"
import { CreateBuildingFactory } from "@infrastructure/inbound/factories/createBuilding.factory"
import { UpdateBuildingFactory } from "@infrastructure/inbound/factories/updateBuilding.factory"
import { UpdateFloorFactory } from "@infrastructure/inbound/factories/updateFloor.factory"

type BuildingState = {
  buildings: BuildingModel[]
  searchTerm: string
  isLoading: boolean
  setSearchTerm: (term: string) => void
  setBuildings: (buildings: BuildingModel[]) => void
}

interface BuildingAction {
  getBuildings: () => Promise<void>
  createBuilding: (dto: CreateBuildingDto) => Promise<{ success: boolean; message?: string }>
  updateBuilding: (dto: UpdateBuildingDto) => Promise<{ success: boolean; message?: string }>
  updateFloor: (dto: UpdateFloorDto) => Promise<{ success: boolean; message?: string }>
}

type BuildingStore = BuildingState & BuildingAction

export const useBuildingStore = create<BuildingStore>((set, get) => ({
  buildings: [],
  searchTerm: "",
  isLoading: false,
  setSearchTerm: (term) => set({ searchTerm: term }),
  setBuildings: (buildings) => set({ buildings }),

  getBuildings: async () => {
    set({ isLoading: true })
    try {
      const result = await GetBuildingsFactory().handler({})
      if (result.isRight()) {
        set({ buildings: result.value })
      } else if (result.isLeft()) {
        console.error(result.value)
      }
    } catch (error) {
      console.error(error)
    } finally {
      set({ isLoading: false })
    }
  },

  createBuilding: async (dto: CreateBuildingDto) => {
    try {
      const result = await CreateBuildingFactory().handler(dto)
      if (result.isRight()) {
        await get().getBuildings()
        return { success: true, message: result.value.message }
      } else if (result.isLeft()) {
        console.error(result.value)
        return { success: false, message: "Failed to create building" }
      }
      return { success: false }
    } catch (error) {
      console.error(error)
      return { success: false, message: "An error occurred" }
    }
  },

  updateBuilding: async (dto: UpdateBuildingDto) => {
    try {
      const result = await UpdateBuildingFactory().handler(dto)
      if (result.isRight()) {
        await get().getBuildings()
        return { success: true, message: result.value.message }
      } else if (result.isLeft()) {
        console.error(result.value)
        return { success: false, message: "Failed to update building" }
      }
      return { success: false }
    } catch (error) {
      console.error(error)
      return { success: false, message: "An error occurred" }
    }
  },

  updateFloor: async (dto: UpdateFloorDto) => {
    try {
      const result = await UpdateFloorFactory().handler(dto)
      if (result.isRight()) {
        await get().getBuildings()
        return { success: true, message: result.value.message }
      } else if (result.isLeft()) {
        console.error(result.value)
        return { success: false, message: "Failed to update floor" }
      }
      return { success: false }
    } catch (error) {
      console.error(error)
      return { success: false, message: "An error occurred" }
    }
  },
}))
