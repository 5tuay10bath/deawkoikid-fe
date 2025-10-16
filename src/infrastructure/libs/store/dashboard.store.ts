import { create } from "zustand/react"

import type { DashboardModel } from "@domain/models/dashboard.model"
import { GetDashboardFactory } from "@infrastructure/inbound/factories/getDashboard.factory"
import { CheckInFactory } from "@infrastructure/inbound/factories/checkIn.factory"
import type { CheckInDto } from "@infrastructure/inbound/dtos/checkIn.dto"

type DashboardState = {
  dashboard: DashboardModel[]
  setDashboard: (dashboard: DashboardModel[]) => void
}

interface DashboardAction {
  getDashboard: () => Promise<void>
  checkIn: (dto: CheckInDto) => Promise<{ success: boolean; message: string }>
}

type DashboardStore = DashboardState & DashboardAction

export const useDashboardStore = create<DashboardStore>((set) => ({
  dashboard: [],
  setDashboard: (dashboard) => set({ dashboard }),

  getDashboard: async () => {
    try {
      const result = await GetDashboardFactory().handler({})
      if (result.isRight()) {
        set({ dashboard: result.value })
      }
    } catch {
      // Error handling
    }
  },

  checkIn: async (dto: CheckInDto) => {
    try {
      const result = await CheckInFactory().handler(dto)
      if (result.isRight()) {
        // Refresh dashboard after check-in
        const dashboardResult = await GetDashboardFactory().handler({})
        if (dashboardResult.isRight()) {
          set({ dashboard: dashboardResult.value })
        }
        return { success: true, message: result.value.message }
      }
      return { success: false, message: "Check-in failed" }
    } catch {
      return { success: false, message: "An error occurred during check-in" }
    }
  },
}))
