import { Search, Receipt, DollarSign, Download } from "lucide-react"

import { usePaymentStore } from "src/infrastructure/libs/store/payments.store"
import jsPDF from "jspdf"

import { Button } from "../components/common/Button"
import { StatsCard } from "../components/central/StatsCard"
import { Input } from "../components/common/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/common/Dialog"
import ReceiptDialog from "../components/paymentsCom/ReceiptDialog"
import DialogPayments from "../components/paymentsCom/Dialog"
import TablePayments from "../components/paymentsCom/Table"
import { useEffect, useState } from "react"
import { useDashboardStore } from "@infrastructure/libs/store/dashboard.store"

export default function Payments() {
  const { payments, searchTerm, setSearchTerm, getPayments } = usePaymentStore()
  const { getDashboard } = useDashboardStore()
  const [isExporting, setIsExporting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const totalRevenue = payments.filter((p) => p.status === "PAID").reduce((sum, p) => sum + p.totalAmount, 0)

  const pendingAmount = payments.filter((p) => p.status !== "PAID").reduce((sum, p) => sum + p.totalAmount, 0)

  const handleExportClick = () => {
    if (payments.length === 0) {
      return
    }
    setShowConfirmModal(true)
  }

  const confirmExport = async () => {
    setShowConfirmModal(false)
    setIsExporting(true)
    try {
      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = 210
      const margin = 20

      for (let i = 0; i < payments.length; i++) {
        const payment = payments[i]

        if (i > 0) {
          pdf.addPage()
        }

        pdf.setFontSize(24)
        pdf.setFont("helvetica", "bold")
        pdf.text("Property Manager", pageWidth / 2, margin + 10, { align: "center" })

        pdf.setFontSize(16)
        pdf.setFont("helvetica", "normal")
        pdf.text("Payment Receipt", pageWidth / 2, margin + 20, { align: "center" })

        pdf.setFontSize(12)
        pdf.text(`Receipt #${payment.id}`, margin, margin + 40)

        pdf.text("Tenant:", margin, margin + 55)
        pdf.text(payment.contract.user.fullName, margin + 40, margin + 55)

        pdf.text("Unit:", margin, margin + 70)
        pdf.text(payment.contract.unit.unitNumber, margin + 40, margin + 70)

        pdf.text("Billing Month:", margin, margin + 85)
        pdf.text(
          new Date(payment.billingMonth).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          margin + 40,
          margin + 85,
        )

        pdf.text("Due Date:", margin, margin + 100)
        pdf.text(new Date(payment.dueDate).toLocaleDateString(), margin + 40, margin + 100)

        pdf.setFontSize(18)
        pdf.setFont("helvetica", "bold")
        pdf.text("Total Amount:", margin, margin + 125)
        pdf.setTextColor(0, 150, 0)
        pdf.text(`$${payment.totalAmount.toFixed(2)}`, margin + 60, margin + 125)
        pdf.setTextColor(0, 0, 0)

        pdf.setFontSize(10)
        pdf.setFont("helvetica", "normal")
        pdf.text("Thank you for your payment", pageWidth / 2, margin + 150, { align: "center" })
        pdf.text(
          `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
          pageWidth / 2,
          margin + 160,
          { align: "center" },
        )
      }

      const fileName = `bulk-receipts-${new Date().toISOString().split("T")[0]}.pdf`
      pdf.save(fileName)
    } catch {
      console.error("Error exporting payment receipts")
    } finally {
      setIsExporting(false)
    }
  }

  useEffect(() => {
    getPayments()
    getDashboard()
  }, [getPayments, getDashboard])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">Generate receipts and track payments</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportClick} disabled={isExporting || payments.length === 0}>
            {isExporting ? (
              <>
                <Download className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Reports ({payments.length})
              </>
            )}
          </Button>
          <DialogPayments />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          label="Total Revenue"
          value={totalRevenue}
          prefix="$"
          icon={DollarSign}
          color={{
            valueColor: "text-emerald-500",
            iconColor: "text-emerald-500",
          }}
        />

        <StatsCard
          label="Pending Payments"
          value={pendingAmount}
          prefix="$"
          icon={DollarSign}
          color={{ valueColor: "text-amber-500", iconColor: "text-amber-500" }}
        />

        <StatsCard
          label="This Month"
          value={totalRevenue * 0.8}
          prefix="$"
          icon={Receipt}
          color={{ iconColor: "text-blue-500" }}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Payment History
            </CardTitle>
            <div className="relative">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TablePayments />
        </CardContent>
      </Card>

      {/* Receipt Generation Dialog */}
      <ReceiptDialog />

      {/* Export Confirmation Dialog */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
            <DialogDescription>Are you sure you want to export all payment receipts?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="text-sm text-gray-600">
              <p>
                <strong>Report Type:</strong> Payment Receipts
              </p>
              <p>
                <strong>Total Records:</strong> {payments.length} payments
              </p>
              <p>
                <strong>Export Date:</strong> {new Date().toLocaleDateString("th-TH")}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)} disabled={isExporting}>
              Cancel
            </Button>
            <Button onClick={confirmExport} disabled={isExporting}>
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
