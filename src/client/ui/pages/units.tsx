import { Search, Building } from "lucide-react"

import { useUnitStore } from "src/infrastructure/libs/store/units.store"

import { Input } from "../components/common/Input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/card"
import DialogUnits from "../components/unitsCom/Dialog"
import TableUnits from "../components/unitsCom/Table"
import { TableLoading } from "../components/common/TableLoading"
import { useEffect } from "react"

export default function Units() {
  const { searchTerm, isLoading, setSearchTerm, getUnits } = useUnitStore()

  useEffect(() => {
    getUnits()
  }, [getUnits])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Unit Management</h1>
          <p className="text-muted-foreground">Manage all property units</p>
        </div>
        <DialogUnits />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              All Units
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search units..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-64 pl-9"
                  data-cy="search-input"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>{isLoading ? <TableLoading /> : <TableUnits />}</CardContent>
      </Card>
    </div>
  )
}
