import type { DashboardModel } from "@domain/models/dashboard.model"
import { create } from "zustand"

interface AddonForm {
  topic: string
  price: string
  description: string
  status: "UNPAID" | "PAID"
}

interface RoomDetailState {
  room: DashboardModel | null
  isCheckOutOpen: boolean
  isAddonOpen: boolean
  isReceiptOpen: boolean
  isContractOpen: boolean
  addonForm: AddonForm

  setRoom: (room: DashboardModel | null) => void
  setIsCheckOutOpen: (isOpen: boolean) => void
  setIsAddonOpen: (isOpen: boolean) => void
  setIsReceiptOpen: (isOpen: boolean) => void
  setIsContractOpen: (isOpen: boolean) => void
  updateAddonForm: (updates: Partial<AddonForm>) => void
  resetAddonForm: () => void
}

const initialAddonForm: AddonForm = {
  topic: "",
  price: "",
  description: "",
  status: "UNPAID",
}

export const useRoomDetailStore = create<RoomDetailState>((set) => ({
  room: null,
  isCheckOutOpen: false,
  isAddonOpen: false,
  isReceiptOpen: false,
  isContractOpen: false,
  addonForm: initialAddonForm,

  setRoom: (room) => set({ room }),
  setIsCheckOutOpen: (isOpen) => set({ isCheckOutOpen: isOpen }),
  setIsAddonOpen: (isOpen) => set({ isAddonOpen: isOpen }),
  setIsReceiptOpen: (isOpen) => set({ isReceiptOpen: isOpen }),
  setIsContractOpen: (isOpen) => set({ isContractOpen: isOpen }),
  updateAddonForm: (updates) =>
    set((state) => ({
      addonForm: { ...state.addonForm, ...updates },
    })),
  resetAddonForm: () => set({ addonForm: initialAddonForm }),
}))
