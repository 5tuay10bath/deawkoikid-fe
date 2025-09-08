import { create } from 'zustand/react'
import { mockDB, type Room } from 'src/constant/mockData'

interface UnitState {
  units: Room[];
  setUnits: (units: Room[]) => void;
}

export const useUnitStore = create<UnitState>((set) => ({
  units: mockDB.getRooms(),
  setUnits: (units) => set({ units })
}))