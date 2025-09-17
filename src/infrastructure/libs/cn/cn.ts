import { cn as tvCN, type CnOptions, type CnReturn } from "tailwind-variants"

export const cn: (...classes: CnOptions) => CnReturn = (...classes: CnOptions) => {
  return tvCN(classes)({ twMerge: true })
}
