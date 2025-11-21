import { create } from "zustand/react"

import type { DashboardModel } from "@domain/models/dashboard.model"
import type { ExtraChargeModel } from "@domain/models/extraCharge.model"
import { GetDashboardFactory } from "@infrastructure/inbound/factories/getDashboard.factory"
import { CheckInFactory } from "@infrastructure/inbound/factories/checkIn.factory"
import { CheckOutFactory } from "@infrastructure/inbound/factories/checkOut.factory"
import { UploadMeterCsvFactory } from "@infrastructure/inbound/factories/uploadMeterCsv.factory"
import { GetExtraChargesFactory } from "@infrastructure/inbound/factories/getExtraCharges.factory"
import { CreateExtraChargeFactory } from "@infrastructure/inbound/factories/createExtraCharge.factory"
import type { CheckInDto } from "@infrastructure/inbound/dtos/checkIn.dto"
import type { CheckOutDto } from "@infrastructure/inbound/dtos/checkOut.dto"
import type { UploadMeterCsvDto } from "@infrastructure/inbound/dtos/uploadMeterCsv.dto"
import type { GetExtraChargesDto } from "@infrastructure/inbound/dtos/getExtraCharges.dto"
import type { CreateExtraChargeDto } from "@infrastructure/inbound/dtos/createExtraCharge.dto"

type DashboardState = {
  dashboard: DashboardModel[]
  extraCharges: ExtraChargeModel[]
  setDashboard: (dashboard: DashboardModel[]) => void
  setExtraCharges: (extraCharges: ExtraChargeModel[]) => void
}

interface DashboardAction {
  getDashboard: () => Promise<void>
  checkIn: (dto: CheckInDto) => Promise<{ success: boolean; message: string }>
  checkOut: (dto: CheckOutDto) => Promise<{ success: boolean; message: string }>
  uploadMeterCsv: (dto: UploadMeterCsvDto) => Promise<{ success: boolean; message: string }>
  getExtraCharges: (dto: GetExtraChargesDto) => Promise<{ success: boolean; message: string }>
  createExtraCharge: (dto: CreateExtraChargeDto) => Promise<{ success: boolean; message: string }>
}

type DashboardStore = DashboardState & DashboardAction

export const useDashboardStore = create<DashboardStore>((set) => ({
  dashboard: [],
  extraCharges: [],
  setDashboard: (dashboard) => set({ dashboard }),
  setExtraCharges: (extraCharges) => set({ extraCharges }),

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

  getExtraCharges: async (dto: GetExtraChargesDto) => {
    try {
      const result = await GetExtraChargesFactory().handler(dto)
      if (result.isRight()) {
        set({ extraCharges: result.value })
        return { success: true, message: "Extra charges loaded successfully" }
      }
      return { success: false, message: "Failed to load extra charges" }
    } catch {
      return { success: false, message: "An error occurred while loading extra charges" }
    }
  },

  createExtraCharge: async (dto: CreateExtraChargeDto) => {
    try {
      const result = await CreateExtraChargeFactory().handler(dto)
      if (result.isRight()) {
        // Refresh extra charges after creation
        const extraChargesResult = await GetExtraChargesFactory().handler({ id: dto.id })
        if (extraChargesResult.isRight()) {
          set({ extraCharges: extraChargesResult.value })
        }
        return { success: true, message: result.value.message }
      }
      return { success: false, message: "Failed to create extra charge" }
    } catch {
      return { success: false, message: "An error occurred while creating extra charge" }
    }
  },
}))
