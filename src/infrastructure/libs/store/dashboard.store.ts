import { create } from "zustand/react"

import type { DashboardModel } from "@domain/models/dashboard.model"
import { GetDashboardFactory } from "@infrastructure/inbound/factories/getDashboard.factory"

type DashboardState = {
  dashboard: DashboardModel | null
  setDashboard: (dashboard: DashboardModel) => void
}

interface DashboardAction {
  getDashboard: () => Promise<void>
}

type DashboardStore = DashboardState & DashboardAction

export const useDashboardStore = create<DashboardStore>((set) => ({
  dashboard: null,
  setDashboard: (dashboard) => set({ dashboard }),

  getDashboard: async () => {
    try {
      const result = await GetDashboardFactory().handler({})
      if (result.isRight()) {
        set({ dashboard: result.value })
      } else if (result.isLeft()) {
        console.error(result.value)
      }
    } catch (error) {
      console.error(error)
    }
  },
}))
