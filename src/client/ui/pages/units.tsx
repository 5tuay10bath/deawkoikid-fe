import { Search, Building } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/mock/card"
import { Input } from "../components/Input"
import { useUnitStore } from "@core/application/libs/store/units.store"
import DialogUnits from "../components/unitsCom/Dialog"
import TableUnits from "../components/unitsCom/Table"

export default function Units() {
  const { searchTerm, setSearchTerm } = useUnitStore()

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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search units..."
                  value={searchTerm}
                  onChange={(e : React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TableUnits />
        </CardContent>
      </Card>
    </div>
  )
}