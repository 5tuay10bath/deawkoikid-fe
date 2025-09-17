import { format } from "date-fns"
import { Download, Receipt, Send } from "lucide-react"

import type { Payment } from "src/infrastructure/mockData/mockData"

import { usePaymentStore } from "src/infrastructure/libs/store/payments.store"

import { Badge } from "../Badge"
import { Button } from "../Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table/Table"

const TablePayments = () => {
  const { payments, searchTerm, setSelectedPayment, setIsReceiptOpen } = usePaymentStore()

  const filteredPayments = payments.filter(
    (payment) =>
      payment.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) || payment.unitNumber.includes(searchTerm),
  )

  const statusConfig = {
    paid: { color: "bg-green-500 text-white", label: "Paid" },
    pending: { color: "bg-yellow-500 text-white", label: "Pending" },
    overdue: { color: "bg-red-500 text-white", label: "Overdue" },
  }

  const typeConfig = {
    rent: "Rent",
    utilities: "Utilities",
    deposit: "Deposit",
    maintenance: "Maintenance",
    addon: "Addon",
  }

  const handleGenerateReceipt = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsReceiptOpen(true)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tenant</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredPayments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-medium">{payment.tenantName}</TableCell>
            <TableCell>{payment.unitNumber}</TableCell>
            <TableCell>{typeConfig[payment.type]}</TableCell>
            <TableCell>${payment.amount}</TableCell>
            <TableCell>{format(payment.dueDate, "MMM dd, yyyy")}</TableCell>
            <TableCell>
              <Badge className={statusConfig[payment.status].color}>{statusConfig[payment.status].label}</Badge>
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
