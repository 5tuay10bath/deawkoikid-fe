import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table"
import { Badge } from "../common/Badge"
import { Button } from "../common/Button"
import { format } from "date-fns"
import { Download, Eye, Edit } from "lucide-react"
import { useContractStore } from "@infrastructure/libs/store/contracts.store"
import type { ContractsModel } from "@domain/models/contracts.model"

const ContractsTable = () => {
  const { contracts, searchTerm, setSelectedContract, setIsViewOpen } = useContractStore()
  const filteredContracts = contracts.filter(
    (contract) =>
      contract.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.unit.unitNumber.includes(searchTerm),
  )

  const statusConfig = {
    ACTIVE: { color: "bg-green-500 text-white", label: "Active" },
    EXPIRED: { color: "bg-red-500 text-white", label: "Expired" },
    DRAFT: { color: "bg-yellow-500 text-white", label: "Draft" },
    SIGNED: { color: "bg-blue-500 text-white", label: "Signed" },
  }

  const getStatusConfig = (status: string) => {
    const upperStatus = status.toUpperCase()
    return statusConfig[upperStatus as keyof typeof statusConfig] || { color: "bg-gray-500 text-white", label: status }
  }

  const handleViewContract = (contract: ContractsModel) => {
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
            <TableCell className="font-medium">{contract.user.fullName}</TableCell>
            <TableCell>{contract.unit.unitNumber}</TableCell>
            <TableCell>{format(contract.startDate, "MMM dd, yyyy")}</TableCell>
            <TableCell>{format(contract.endDate, "MMM dd, yyyy")}</TableCell>
            <TableCell>
              ${contract.rentAmount}/{contract.rentType === "MONTHLY" ? "mo" : "yr"}
            </TableCell>
            <TableCell>
              <Badge className={getStatusConfig(contract.status).color}>{getStatusConfig(contract.status).label}</Badge>
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
