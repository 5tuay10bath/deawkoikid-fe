import { create } from "zustand/react"

import { mockDB, type Payment } from "src/infrastructure/mockData/mockData"
import type { PaymentsModel } from "@domain/models/payments.model"
import { GetPaymentsFactory } from "@infrastructure/inbound/factories/getPayments.factory"

type PaymentState = {
  payments: Payment[]
  paymentsTest: PaymentsModel[]
  searchTerm: string
  selectedPayment: Payment | null
  isReceiptOpen: boolean
  setPaymentsTest: (payments: PaymentsModel[]) => void
  setSelectedPayment: (payment: Payment | null) => void
  setIsReceiptOpen: (isOpen: boolean) => void
  setSearchTerm: (term: string) => void
  setPayments: (payments: Payment[]) => void
}

interface PaymentAction {
  getPayments: () => Promise<void>
}

type PaymentStore = PaymentState & PaymentAction

export const usePaymentStore = create<PaymentStore>((set) => ({
  payments: mockDB.getPayments(),
  paymentsTest: [],
  searchTerm: "",
  selectedPayment: null,
  isReceiptOpen: false,
  setPaymentsTest: (payments) => set({ paymentsTest: payments }),
  setSelectedPayment: (payment) => set({ selectedPayment: payment }),
  setIsReceiptOpen: (isOpen) => set({ isReceiptOpen: isOpen }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setPayments: (payments) => set({ payments }),

  getPayments: async () => {
    try {
      const result = await GetPaymentsFactory().handler({})
      if (result.isRight()) {
        set({ paymentsTest: result.value })
      } else if (result.isLeft()) {
        console.error(result.value)
      }
    } catch (error) {
      console.error(error)
    }
  },
}))
