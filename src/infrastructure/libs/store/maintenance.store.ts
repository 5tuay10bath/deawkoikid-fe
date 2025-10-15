import { create } from "zustand/react"

import type { MaintenanceModel } from "@domain/models/maintenance.model"
import type { SupplyModel } from "@domain/models/supply.model"
import { GetMaintenanceFactory } from "@infrastructure/inbound/factories/getMaintenance.factory"
import { GetSupplyFactory } from "@infrastructure/inbound/factories/getSupply.factory"

type NewTask = {
  title: string
  description: string
  unitNumber: string
  priority: string
  assignedTo: string
  dueDate: Date | undefined
  type: string
}

type NewSupply = {
  name: string
  category: string
  quantity: string
  unit: string
  minStock: string
  cost: string
}

type MaintenanceState = {
  tasks: MaintenanceModel[]
  supplies: SupplyModel[]
  searchTerm: string
  isNewTaskOpen: boolean
  isNewSupplyOpen: boolean
  newTask: NewTask
  newSupply: NewSupply
  setTasks: (tasks: MaintenanceModel[]) => void
  setSupplies: (supplies: SupplyModel[]) => void
  setSearchTerm: (term: string) => void
  setIsNewTaskOpen: (isOpen: boolean) => void
  setIsNewSupplyOpen: (isOpen: boolean) => void
  setNewTask: (task: NewTask) => void
  setNewSupply: (supply: NewSupply) => void
  updateNewTask: (updates: Partial<NewTask>) => void
  updateNewSupply: (updates: Partial<NewSupply>) => void
  resetNewTask: () => void
  resetNewSupply: () => void
  addTask: (task: MaintenanceModel) => void
  addSupply: (supply: SupplyModel) => void
}

interface MaintenanceAction {
  getMaintenanceTasks: () => Promise<void>
  getSupplies: () => Promise<void>
}

type MaintenanceStore = MaintenanceState & MaintenanceAction

const initialNewTask: NewTask = {
  title: "",
  description: "",
  unitNumber: "",
  priority: "",
  assignedTo: "",
  dueDate: undefined,
  type: "",
}

const initialNewSupply: NewSupply = {
  name: "",
  category: "",
  quantity: "",
  unit: "",
  minStock: "",
  cost: "",
}

export const useMaintenanceStore = create<MaintenanceStore>((set, get) => ({
  tasks: [],
  supplies: [],
  searchTerm: "",
  isNewTaskOpen: false,
  isNewSupplyOpen: false,
  newTask: initialNewTask,
  newSupply: initialNewSupply,
  setTasks: (tasks) => set({ tasks }),
  setSupplies: (supplies) => set({ supplies }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setIsNewTaskOpen: (isOpen) => set({ isNewTaskOpen: isOpen }),
  setIsNewSupplyOpen: (isOpen) => set({ isNewSupplyOpen: isOpen }),
  setNewTask: (task) => set({ newTask: task }),
  setNewSupply: (supply) => set({ newSupply: supply }),
  updateNewTask: (updates) => set({ newTask: { ...get().newTask, ...updates } }),
  updateNewSupply: (updates) => set({ newSupply: { ...get().newSupply, ...updates } }),
  resetNewTask: () => set({ newTask: initialNewTask }),
  resetNewSupply: () => set({ newSupply: initialNewSupply }),
  addTask: (task) => set({ tasks: [...get().tasks, task] }),
  addSupply: (supply) => set({ supplies: [...get().supplies, supply] }),

  getMaintenanceTasks: async () => {
    try {
      const result = await GetMaintenanceFactory().handler({})
      if (result.isRight()) {
        set({ tasks: result.value })
      } else if (result.isLeft()) {
        console.error(result.value)
      }
    } catch (error) {
      console.error(error)
    }
  },

  getSupplies: async () => {
    try {
      const result = await GetSupplyFactory().handler({})
      if (result.isRight()) {
        set({ supplies: result.value })
      } else if (result.isLeft()) {
        console.error(result.value)
      }
    } catch (error) {
      console.error(error)
    }
  },
}))
