import { Loader2 } from "lucide-react"

export function TableLoading() {
  return (
    <div className="flex items-center justify-center py-12" data-cy="loading-spinner">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Loading data...</p>
      </div>
    </div>
  )
}

export function TableEmpty({ message = "No data available" }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12" data-cy="table-empty">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
