import type { Room } from "@infrastructure/mockData/mockData"
import { create } from "zustand"

interface AddonForm {
  type: string
  amount: string
  description: string
}

interface RoomDetailState {
  room: Room | null
  isCheckOutOpen: boolean
  isAddonOpen: boolean
  addonForm: AddonForm

  setRoom: (room: Room | null) => void
  setIsCheckOutOpen: (isOpen: boolean) => void
  setIsAddonOpen: (isOpen: boolean) => void
  updateAddonForm: (updates: Partial<AddonForm>) => void
  resetAddonForm: () => void
}

const initialAddonForm: AddonForm = {
  type: "",
  amount: "",
  description: "",
}

export const useRoomDetailStore = create<RoomDetailState>((set) => ({
  room: null,
  isCheckOutOpen: false,
  isAddonOpen: false,
  addonForm: initialAddonForm,

  setRoom: (room) => set({ room }),
  setIsCheckOutOpen: (isOpen) => set({ isCheckOutOpen: isOpen }),
  setIsAddonOpen: (isOpen) => set({ isAddonOpen: isOpen }),
  updateAddonForm: (updates) =>
    set((state) => ({
      addonForm: { ...state.addonForm, ...updates },
    })),
  resetAddonForm: () => set({ addonForm: initialAddonForm }),
}))
