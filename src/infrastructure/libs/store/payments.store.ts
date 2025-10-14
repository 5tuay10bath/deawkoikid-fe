import { create } from "zustand/react"

import { mockDB, type Payment } from "src/infrastructure/mockData/mockData"
import type { PaymentsModel } from "@domain/models/payments.model"
import { GetPaymentsFactory } from "@infrastructure/inbound/factories/getPayments.factory"

type NewApartmentConfig = {
  // id: string
  electricpriceperunit: number
  waterpriceperunit: number
  commonFee: number
  internetprice: number
}
type NewPayment = {
  billingMonth: Date
  electricUsage: number
  waterUsage: number
  status: "paid" | "unpaid" | "overdue"
  dueDate: Date
  paidDate: Date
}
type PaymentState = {
  payments: Payment[]
  paymentsTest: PaymentsModel[]
  searchTerm: string
  selectedPayment: Payment | null
  isReceiptOpen: boolean
  isNewPaymentOpen: boolean
  //new
  newPayment: NewPayment
  newApartmentConfig: NewApartmentConfig
  isNewApartmentConfigOpen: boolean
  setIsNewPaymentOpen: (isOpen: boolean) => void
  setisNewApartmentConfigOpen: (isOpen: boolean) => void
  updateNewPayment: (updates: Partial<NewPayment>) => void
  resetNewPayment: () => void
  // addPayment: (Payment: PaymentsModel) => void
  updateNewApartmentConfig: (updates: Partial<NewApartmentConfig>) => void
  resetNewApartmentConfig: () => void
  // addApartmentConfig: (ApartmentConfig: NewApartmentConfig) => void
  //end new
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

const initialNewPayment = (): NewPayment => ({
  // id: "",
  // contractid: "",
  // apartmentConfigid: "", // Should i put id here ?
  billingMonth: new Date(),
  electricUsage: 0,
  waterUsage: 0,
  status: "unpaid",
  dueDate: new Date(),
  paidDate: new Date(),
})

const initialApartmentConfig = (): NewApartmentConfig => ({
  electricpriceperunit: 0,
  waterpriceperunit: 0,
  commonFee: 0,
  internetprice: 0,
})

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  payments: mockDB.getPayments(),
  paymentsTest: [],
  searchTerm: "",
  selectedPayment: null,
  isReceiptOpen: false,
  isNewPaymentOpen: false,
  //new
  newPayment: initialNewPayment(),
  newApartmentConfig: initialApartmentConfig(),
  isNewApartmentConfigOpen: false,
  setIsNewPaymentOpen: (isOpen) => set({ isNewPaymentOpen: isOpen }),
  updateNewPayment: (updates) => set({ newPayment: { ...get().newPayment, ...updates } }),
  resetNewPayment: () => set({ newPayment: initialNewPayment() }),
  // addPayment: (Payment) => set({ paymentsTest: [...get().paymentsTest, Payment] }),

  //Apartment Config
  setisNewApartmentConfigOpen: (isOpen) => set({ isNewApartmentConfigOpen: isOpen }),
  updateNewApartmentConfig: (updates) => set({ newApartmentConfig: { ...get().newApartmentConfig, ...updates } }),
  resetNewApartmentConfig: () => set({ newApartmentConfig: initialApartmentConfig() }),
  // addApartmentConfig: (ApartmentConfig) => set({ paymentsTest: [...get().paymentsTest, ApartmentConfig] }),
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
