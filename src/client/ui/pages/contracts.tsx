import { FileText, Search } from "lucide-react"
import { useContractStore } from "@infrastructure/libs/store/contracts.store"
import { Input } from "../components/common/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/card"
import { StatsCard } from "../components/central/StatsCard"
import ContractsTable from "../components/contractsCom/Table"
import ViewDialog from "../components/contractsCom/ViewDialog"
import EditTemplateDialog from "../components/contractsCom/EditTemplateDialog"
import NewContractDialog from "../components/contractsCom/AddDialog"

export default function Contracts() {
  const { contracts, searchTerm, setSearchTerm } = useContractStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contract Management</h1>
          <p className="text-muted-foreground">Manage lease contracts and templates</p>
        </div>

        <div className="flex gap-2">
          <EditTemplateDialog />

          <NewContractDialog />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Active Contracts"
          value={contracts.filter((c) => c.status === "active").length}
          icon={FileText}
          color={{
            valueColor: "text-emerald-500",
            iconColor: "text-emerald-500",
          }}
        />

        <StatsCard
          label="Expiring Soon"
          value={2}
          icon={FileText}
          color={{
            valueColor: "text-amber-500",
            iconColor: "text-amber-500",
          }}
        />

        <StatsCard
          label="Draft Contracts"
          value={contracts.filter((c) => c.status === "draft").length}
          icon={FileText}
          color={{
            valueColor: "text-blue-500",
            iconColor: "text-blue-500",
          }}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              All Contracts
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ContractsTable />
        </CardContent>
      </Card>

      {/* Contract Viewer */}
      <ViewDialog />
    </div>
  )
}
