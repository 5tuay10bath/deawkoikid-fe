import { useMaintenanceStore } from "@infrastructure/libs/store/maintenance.store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs"
import { AlertTriangle, Clock, Package, Search, Wrench } from "lucide-react"
import { Input } from "../components/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/mock/card"
import { StatsCard } from "../components/common/StatsCard"
import NewTaskDialog, { NewSupplyDialog } from "../components/maintenanceCom/Dialog"
import MaintainTable, { SupplyTable } from "../components/maintenanceCom/Table"

export default function Maintenance() {
  const { tasks, supplies, searchTerm, setSearchTerm } = useMaintenanceStore()

  const lowStockSupplies = supplies.filter((supply) => supply.quantity <= supply.minStock)

  const filteredTasks = tasks.filter((task) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.unitNumber.toLowerCase().includes(searchLower) ||
      task.assignedTo.toLowerCase().includes(searchLower) ||
      task.priority.toLowerCase().includes(searchLower) ||
      task.status.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Management</h1>
          <p className="text-gray-500">Track maintenance tasks and manage supplies</p>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tasks">Maintenance Tasks</TabsTrigger>
          <TabsTrigger value="supplies">Supplies & Inventory</TabsTrigger>
          <TabsTrigger value="schedule">Schedule & Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>

            <NewTaskDialog />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              label="Total Tasks"
              value={filteredTasks.length}
              icon={Wrench}
              color={{
                iconColor: "text-blue-500",
              }}
            />

            <StatsCard
              label="Pending"
              value={filteredTasks.filter((t) => t.status === "pending").length}
              icon={Clock}
              color={{
                valueColor: "text-amber-500",
                iconColor: "text-amber-500",
              }}
            />

            <StatsCard
              label="High Priority"
              value={filteredTasks.filter((t) => t.priority === "high" || t.priority === "urgent").length}
              icon={AlertTriangle}
              color={{
                valueColor: "text-red-500",
                iconColor: "text-red-500",
              }}
            />

            <StatsCard
              label="Completed"
              value={filteredTasks.filter((t) => t.status === "completed").length}
              icon={Wrench}
              color={{
                valueColor: "text-emerald-500",
                iconColor: "text-emerald-500",
              }}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Maintenance Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MaintainTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplies" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              {lowStockSupplies.length > 0 && (
                <div className="flex items-center gap-2 text-yellow-500 mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{lowStockSupplies.length} items are low on stock</span>
                </div>
              )}
            </div>

            <NewSupplyDialog />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Supply Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SupplyTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Feature coming soon - Schedule recurring maintenance reminders</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
