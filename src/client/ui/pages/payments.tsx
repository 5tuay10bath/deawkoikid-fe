import { Search, Receipt, Plus, DollarSign } from "lucide-react"

import { usePaymentStore } from "src/infrastructure/libs/store/payments.store"

import { Button } from "../components/common/Button"
import { StatsCard } from "../components/central/StatsCard"
import { Input } from "../components/common/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/card"
import ReceiptDialog from "../components/paymentsCom/ReceiptDialog"
import TablePayments from "../components/paymentsCom/Table"

export default function Payments() {
  const { payments, searchTerm, setSearchTerm } = usePaymentStore()

  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)

  const pendingAmount = payments.filter((p) => p.status !== "paid").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">Generate receipts and track payments</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">Export Reports</Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
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
    </div>
  )
}
