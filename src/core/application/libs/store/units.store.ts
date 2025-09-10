import { create } from 'zustand/react'
import { mockDB, type Room } from 'src/constant/mockData'

interface UnitState {
    units: Room[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    setUnits: (units: Room[]) => void;
}

export const useUnitStore = create<UnitState>((set) => ({
    units: mockDB.getRooms(),
    searchTerm: "",
    setSearchTerm: (term) => set({ searchTerm: term }),
    setUnits: (units) => set({ units })
}))