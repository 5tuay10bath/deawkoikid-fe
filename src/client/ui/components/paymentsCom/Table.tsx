import { format } from "date-fns"
import { Download, Receipt, Send } from "lucide-react"

import type { PaymentsModel } from "@domain/models/payments.model"

import { usePaymentStore } from "src/infrastructure/libs/store/payments.store"

import { Badge } from "../common/Badge"
import { Button } from "../common/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table"

const TablePayments = () => {
  const { payments, searchTerm, setSelectedPayment, setIsReceiptOpen } = usePaymentStore()

  const filteredPayments = payments.filter(
    (payment) =>
      payment.contract.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.contract.unit.unitNumber.includes(searchTerm),
  )

  const statusConfig = {
    PAID: { color: "bg-green-500 text-white", label: "Paid" },
    UNPAID: { color: "bg-yellow-500 text-white", label: "Unpaid" },
    OVERDUE: { color: "bg-red-500 text-white", label: "Overdue" },
  }

  const getStatusConfig = (status: string) => {
    const upperStatus = status.toUpperCase()
    return statusConfig[upperStatus as keyof typeof statusConfig] || { color: "bg-gray-500 text-white", label: status }
  }

  const handleGenerateReceipt = (payment: PaymentsModel) => {
    setSelectedPayment(payment)
    setIsReceiptOpen(true)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tenant</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Billing Month</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredPayments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-medium">{payment.contract.user.fullName}</TableCell>
            <TableCell>{payment.contract.unit.unitNumber}</TableCell>
            <TableCell>{format(payment.billingMonth, "MMM yyyy")}</TableCell>
            <TableCell>${payment.totalAmount}</TableCell>
            <TableCell>{format(payment.dueDate, "MMM dd, yyyy")}</TableCell>
            <TableCell>
              <Badge className={getStatusConfig(payment.status).color}>{getStatusConfig(payment.status).label}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleGenerateReceipt(payment)}>
                  <Receipt className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TablePayments
