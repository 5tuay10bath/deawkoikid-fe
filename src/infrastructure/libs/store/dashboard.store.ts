import { create } from "zustand/react"

import type { DashboardModel } from "@domain/models/dashboard.model"
import { GetDashboardFactory } from "@infrastructure/inbound/factories/getDashboard.factory"
import { CheckInFactory } from "@infrastructure/inbound/factories/checkIn.factory"
import { CheckOutFactory } from "@infrastructure/inbound/factories/checkOut.factory"
import { UploadMeterCsvFactory } from "@infrastructure/inbound/factories/uploadMeterCsv.factory"
import type { CheckInDto } from "@infrastructure/inbound/dtos/checkIn.dto"
import type { CheckOutDto } from "@infrastructure/inbound/dtos/checkOut.dto"
import type { UploadMeterCsvDto } from "@infrastructure/inbound/dtos/uploadMeterCsv.dto"

type DashboardState = {
  dashboard: DashboardModel[]
  setDashboard: (dashboard: DashboardModel[]) => void
}

interface DashboardAction {
  getDashboard: () => Promise<void>
  checkIn: (dto: CheckInDto) => Promise<{ success: boolean; message: string }>
  checkOut: (dto: CheckOutDto) => Promise<{ success: boolean; message: string }>
  uploadMeterCsv: (dto: UploadMeterCsvDto) => Promise<{ success: boolean; message: string }>
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

  checkOut: async (dto: CheckOutDto) => {
    try {
      const result = await CheckOutFactory().handler(dto)
      if (result.isRight()) {
        // Refresh dashboard after check-out
        const dashboardResult = await GetDashboardFactory().handler({})
        if (dashboardResult.isRight()) {
          set({ dashboard: dashboardResult.value })
        }
        return { success: true, message: result.value.message }
      }
      return { success: false, message: "Check-out failed" }
    } catch {
      return { success: false, message: "An error occurred during check-out" }
    }
  },

  uploadMeterCsv: async (dto: UploadMeterCsvDto) => {
    try {
      const result = await UploadMeterCsvFactory().handler(dto)
      if (result.isRight()) {
        return { success: true, message: result.value.message }
      }
      return { success: false, message: "Failed to upload CSV" }
    } catch {
      return { success: false, message: "An error occurred during CSV upload" }
    }
  },
}))
