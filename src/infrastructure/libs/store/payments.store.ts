import { create } from "zustand/react"

import { mockDB, type Payment } from "src/infrastructure/mockData/mockData"

type PaymentState = {
  payments: Payment[]
  searchTerm: string
  selectedPayment: Payment | null
  isReceiptOpen: boolean
  setSelectedPayment: (payment: Payment | null) => void
  setIsReceiptOpen: (isOpen: boolean) => void
  setSearchTerm: (term: string) => void
  setPayments: (payments: Payment[]) => void
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: mockDB.getPayments(),
  searchTerm: "",
  selectedPayment: null,
  isReceiptOpen: false,
  setSelectedPayment: (payment) => set({ selectedPayment: payment }),
  setIsReceiptOpen: (isOpen) => set({ isReceiptOpen: isOpen }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setPayments: (payments) => set({ payments }),
}))
