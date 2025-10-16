import { create } from "zustand/react"

import type { PaymentsModel } from "@domain/models/payments.model"
import type { CreatePaymentDto } from "@infrastructure/inbound/dtos/createPayment.dto"
import { GetPaymentsFactory } from "@infrastructure/inbound/factories/getPayments.factory"
import { CreatePaymentFactory } from "@infrastructure/inbound/factories/createPayment.factory"

type PaymentState = {
  payments: PaymentsModel[]
  searchTerm: string
  selectedPayment: PaymentsModel | null
  isReceiptOpen: boolean
  setSelectedPayment: (payment: PaymentsModel | null) => void
  setIsReceiptOpen: (isOpen: boolean) => void
  setSearchTerm: (term: string) => void
  setPayments: (payments: PaymentsModel[]) => void
}

interface PaymentAction {
  getPayments: () => Promise<void>
  createPayment: (dto: CreatePaymentDto) => Promise<{ success: boolean; message?: string }>
}

type PaymentStore = PaymentState & PaymentAction

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  payments: [],
  searchTerm: "",
  selectedPayment: null,
  isReceiptOpen: false,
  setSelectedPayment: (payment) => set({ selectedPayment: payment }),
  setIsReceiptOpen: (isOpen) => set({ isReceiptOpen: isOpen }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setPayments: (payments) => set({ payments }),

  getPayments: async () => {
    try {
      const result = await GetPaymentsFactory().handler({})
      if (result.isRight()) {
        set({ payments: result.value })
      } else if (result.isLeft()) {
        console.error(result.value)
      }
    } catch (error) {
      console.error(error)
    }
  },

  createPayment: async (dto: CreatePaymentDto) => {
    try {
      const result = await CreatePaymentFactory().handler(dto)
      if (result.isRight()) {
        // Refresh the payments list after creating
        await get().getPayments()
        return { success: true, message: result.value.message }
      } else if (result.isLeft()) {
        console.error(result.value)
        return { success: false, message: "Failed to create payment" }
      }
      return { success: false }
    } catch (error) {
      console.error(error)
      return { success: false, message: "An error occurred" }
    }
  },
}))
