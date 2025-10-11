import { createColumnHelper } from "@tanstack/react-table"

import type { Contract } from "@client/types/IContractdata"

const columnHelper = createColumnHelper<Contract>()

export const contractColumns = [
  columnHelper.accessor("tenant_name", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <div className="mr-2">Tenant_name</div>
      </span>
    ),
  }),
  columnHelper.accessor("unit_name", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <div className="mr-2">Unit_name</div>
      </span>
    ),
  }),
  columnHelper.accessor("start_date", {
    header: () => (
      <span className="flex items-center">
        <div className="mr-2">start_date</div>
      </span>
    ),
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("end_date", {
    header: () => (
      <span className="flex items-center">
        <div className="mr-2">end_date</div>
      </span>
    ),
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: () => (
      <span className="flex items-center">
        <div className="mr-2">Status</div>
      </span>
    ),
    cell: (info) => info.getValue(),
  }),
]
export default contractColumns
