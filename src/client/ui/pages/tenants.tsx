import { Search, Users } from "lucide-react"

import { useTenantStore } from "src/infrastructure/libs/store/tenants.store"

import { Button } from "../components/common/Button"
import { StatsCard } from "../components/central/StatsCard"
import { Input } from "../components/common/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/common/Select"
import TableTenants from "../components/tenantsCom/Table"
import DialogTenant from "../components/tenantsCom/Dialog"

export default function Tenants() {
  const { tenants, searchTerm, statusFilter, setSearchTerm, setStatusFilter } = useTenantStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenant Management</h1>
          <p className="text-muted-foreground">Manage all tenants and their information</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" data-cy="export-tenants">
            Export Data
          </Button>
          <DialogTenant />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatsCard label="Total Tenants" value={tenants.length} icon={Users} />

        <StatsCard
          label="Active"
          value={tenants.filter((t) => t.status === "active").length}
          color={{ valueColor: "text-green-500" }}
        />

        <StatsCard
          label="Overdue"
          value={tenants.filter((t) => t.status === "overdue").length}
          color={{ valueColor: "text-red-500" }}
        />

        <StatsCard
          label="Check-out Pending"
          value={tenants.filter((t) => t.status === "checkout-pending").length}
          color={{ valueColor: "text-blue-500" }}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Tenants
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-9"
                  data-cy="search-tenants"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48" data-cy="filter-tenant-status">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="checkout-pending">Checked Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TableTenants />
        </CardContent>
      </Card>
    </div>
  )
}
