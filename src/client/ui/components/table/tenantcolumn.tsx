import { createColumnHelper } from "@tanstack/react-table"

import type { Tenant } from "@client/types/ITenantdata"

const columnHelper = createColumnHelper<Tenant>()

export const tenantcolumns = [
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <div className="mr-2">Name</div>
      </span>
    ),
  }),
  columnHelper.accessor("email", {
    id: "email",
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <div className="mr-2">Email</div>
      </span>
    ),
  }),
  columnHelper.accessor("phone", {
    header: () => (
      <span className="flex items-center">
        <div className="mr-2">Phone</div>
      </span>
    ),
    cell: (info) => info.getValue(),
  }),
]
export default tenantcolumns
