import { Card, CardContent, CardHeader, CardTitle } from "../components/mock/card"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { StatsCard } from "../components/common/StatsCard"
import { Search, Receipt, Plus, DollarSign } from "lucide-react"
import { usePaymentStore } from "@core/application/libs/store/payments.store"
import TablePayments from "../components/paymentsCom/Table"
import ReceiptDialog from "../components/paymentsCom/ReceiptDialog"

export default function Payments() {
  const { payments, searchTerm, setSearchTerm } = usePaymentStore()

  const totalRevenue = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingAmount = payments
    .filter(p => p.status !== 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">Generate receipts and track payments</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            Export Reports
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Total Revenue"
          value={totalRevenue}
          prefix="$"
          icon={DollarSign}
          color = {{ valueColor: "text-emerald-500", iconColor: "text-emerald-500" }}
        />
        
        <StatsCard
          label="Pending Payments"
          value={pendingAmount}
          prefix="$"
          icon={DollarSign}
          color = {{ valueColor: "text-amber-500", iconColor: "text-amber-500" }}
        />
        
        <StatsCard
          label="This Month"
          value={totalRevenue * 0.8}
          prefix="$"
          icon={Receipt}
          color = {{iconColor: "text-blue-500" }}
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
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