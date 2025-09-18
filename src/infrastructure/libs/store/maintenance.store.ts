import { create } from "zustand/react"

import { mockDB, type MaintenanceTask, type Supply } from "src/infrastructure/mockData/mockData"

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
  tasks: MaintenanceTask[]
  supplies: Supply[]
  searchTerm: string
  isNewTaskOpen: boolean
  isNewSupplyOpen: boolean
  newTask: NewTask
  newSupply: NewSupply
  setTasks: (tasks: MaintenanceTask[]) => void
  setSupplies: (supplies: Supply[]) => void
  setSearchTerm: (term: string) => void
  setIsNewTaskOpen: (isOpen: boolean) => void
  setIsNewSupplyOpen: (isOpen: boolean) => void
  setNewTask: (task: NewTask) => void
  setNewSupply: (supply: NewSupply) => void
  updateNewTask: (updates: Partial<NewTask>) => void
  updateNewSupply: (updates: Partial<NewSupply>) => void
  resetNewTask: () => void
  resetNewSupply: () => void
  addTask: (task: MaintenanceTask) => void
  addSupply: (supply: Supply) => void
}

const initialNewTask: NewTask = {
  title: "",
  description: "",
  unitNumber: "",
  priority: "",
  assignedTo: "",
  dueDate: undefined,
  type: ""
}

const initialNewSupply: NewSupply = {
  name: "",
  category: "",
  quantity: "",
  unit: "",
  minStock: "",
  cost: ""
}

export const useMaintenanceStore = create<MaintenanceState>((set, get) => ({
  tasks: mockDB.getMaintenanceTasks(),
  supplies: mockDB.getSupplies(),
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
}))