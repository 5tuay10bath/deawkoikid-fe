import { create } from "zustand"

interface CheckInFormData {
  tenantName: string
  email: string
  phone: string
  checkInDate: Date
  checkOutDate: Date | undefined
  rentAmount: string
  billingCycle: string
  securityDeposit: string
  emergencyContact: string
  emergencyPhone: string
}

interface CheckInState {
  formData: CheckInFormData

  updateFormData: (updates: Partial<CheckInFormData>) => void
  resetFormData: () => void
  setFormField: (field: keyof CheckInFormData, value: string | Date) => void
}

const initialFormData: CheckInFormData = {
  tenantName: "",
  email: "",
  phone: "",
  checkInDate: new Date(),
  checkOutDate: undefined,
  rentAmount: "",
  billingCycle: "",
  securityDeposit: "",
  emergencyContact: "",
  emergencyPhone: "",
}

export const useCheckInStore = create<CheckInState>((set) => ({
  // Initial state
  formData: initialFormData,

  // Actions
  updateFormData: (updates) =>
    set((state) => ({
      formData: { ...state.formData, ...updates },
    })),

  resetFormData: () => set({ formData: initialFormData }),

  setFormField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),
}))
