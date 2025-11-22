import { useEffect } from "react"
import { Search, Building } from "lucide-react"
import { useBuildingStore } from "@infrastructure/libs/store/buildings.store"
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/card"
import { Input } from "../components/common/Input"
import { TableLoading } from "../components/common/TableLoading"
import DialogBuildings from "../components/buildingsCom/Dialog"
import TableBuildings from "../components/buildingsCom/Table"

export default function Buildings() {
  const { searchTerm, isLoading, setSearchTerm, getBuildings } = useBuildingStore()

  useEffect(() => {
    getBuildings()
  }, [getBuildings])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Building Management</h1>
          <p className="text-muted-foreground">Manage all buildings</p>
        </div>
        <DialogBuildings />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              All Buildings
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search buildings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>{isLoading ? <TableLoading /> : <TableBuildings />}</CardContent>
      </Card>
    </div>
  )
}
