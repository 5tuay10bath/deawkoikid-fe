import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table"
import { Badge } from "../common/Badge"
import { Button } from "../common/Button"
import { ConfirmDialog } from "../common/ConfirmDialog"
import { format } from "date-fns"
import { Eye, Edit, Upload, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useContractStore } from "@infrastructure/libs/store/contracts.store"
import { useToast } from "../hooks/useToast"
import type { ContractsModel } from "@domain/models/contracts.model"
import EditContractDialog from "./EditContractDialog"
import UploadFileDialog from "../common/UploadFileDialog"

const ContractsTable = () => {
  const { contracts, searchTerm, setSelectedContract, setIsViewOpen, activateContract } = useContractStore()
  const { toast } = useToast()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedContractForEdit, setSelectedContractForEdit] = useState<ContractsModel | null>(null)
  const [uploadContractId, setUploadContractId] = useState<string | null>(null)
  const [isActivating, setIsActivating] = useState(false)
  const [confirmActivateId, setConfirmActivateId] = useState<string | null>(null)

  const handleEditClick = (contract: ContractsModel) => {
    setSelectedContractForEdit(contract)
    setIsEditOpen(true)
  }

  const handleActivateClick = (contractId: string) => {
    setConfirmActivateId(contractId)
  }

  const handleConfirmActivate = async () => {
    if (!confirmActivateId) return

    setIsActivating(true)
    const result = await activateContract({ id: confirmActivateId })
    setIsActivating(false)
    setConfirmActivateId(null)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message || "Contract activated successfully",
      })
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to activate contract",
        variant: "destructive",
      })
    }
  }
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
    <>
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
                <Badge className={getStatusConfig(contract.status).color}>
                  {getStatusConfig(contract.status).label}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleViewContract(contract)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditClick(contract)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {/* <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button> */}
                  {contract.status === "DRAFT" && (
                    <Button variant="ghost" size="sm" onClick={() => setUploadContractId(contract.id)}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  )}
                  {contract.status === "SIGNED" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleActivateClick(contract.id)}
                      disabled={isActivating}
                      title="Activate Contract"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Confirm Activate Dialog */}
      <ConfirmDialog
        isOpen={!!confirmActivateId}
        onClose={() => setConfirmActivateId(null)}
        onConfirm={handleConfirmActivate}
        title="Activate Contract"
        description="Are you sure you want to activate this contract? This action will change the contract status to Active."
        confirmText="Activate"
        cancelText="Cancel"
        isLoading={isActivating}
        variant="default"
      />

      {/* Edit Contract Dialog */}
      <EditContractDialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} contract={selectedContractForEdit} />

      {/* Upload File Dialog */}
      {uploadContractId && (
        <UploadFileDialog
          isOpen={!!uploadContractId}
          onClose={() => setUploadContractId(null)}
          type="contracts"
          id={uploadContractId}
        />
      )}
    </>
  )
}

export default ContractsTable
