import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table"
import { Badge } from "../common/Badge"
import { Button } from "../common/Button"
import { format } from "date-fns"
import { Download, Eye, Edit } from "lucide-react"
import { useContractStore } from "@infrastructure/libs/store/contracts.store"
import type { Contract } from "@infrastructure/mockData/mockData"

const ContractsTable = () => {
  const { contracts, searchTerm, setSelectedContract, setIsViewOpen } = useContractStore()
  const filteredContracts = contracts.filter(
    (contract) =>
      contract.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) || contract.unitNumber.includes(searchTerm),
  )

  const statusConfig = {
    active: { color: "bg-green-500 text-white", label: "Active" },
    expired: { color: "bg-red-500 text-white", label: "Expired" },
    draft: { color: "bg-yellow-500 text-white", label: "Draft" },
  }

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract)
    setIsViewOpen(true)
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tenant</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Rent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredContracts.map((contract) => (
          <TableRow key={contract.id}>
            <TableCell className="font-medium">{contract.tenantName}</TableCell>
            <TableCell>{contract.unitNumber}</TableCell>
            <TableCell>{format(contract.startDate, "MMM dd, yyyy")}</TableCell>
            <TableCell>{format(contract.endDate, "MMM dd, yyyy")}</TableCell>
            <TableCell>${contract.rentAmount}/mo</TableCell>
            <TableCell>
              <Badge className={statusConfig[contract.status].color}>{statusConfig[contract.status].label}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleViewContract(contract)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ContractsTable
