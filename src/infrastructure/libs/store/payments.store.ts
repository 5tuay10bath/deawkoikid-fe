import { create } from "zustand/react"

import type { PaymentsModel } from "@domain/models/payments.model"
import { GetPaymentsFactory } from "@infrastructure/inbound/factories/getPayments.factory"

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
}

type PaymentStore = PaymentState & PaymentAction

export const usePaymentStore = create<PaymentStore>((set) => ({
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
}))
