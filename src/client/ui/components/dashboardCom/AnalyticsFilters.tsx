import { BarChart3 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"

interface AnalyticsFiltersProps {
  viewBy: "floor" | "room"
  timeFrame: "month" | "year"
  onViewByChange: (value: string) => void
  onTimeFrameChange: (value: string) => void
}

export function AnalyticsFilters({ viewBy, timeFrame, onViewByChange, onTimeFrameChange }: AnalyticsFiltersProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-bold">Usage Analytics</h2>
          <p className="text-muted-foreground">Water and electricity usage insights</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">View by:</span>
          <Select value={viewBy} onValueChange={onViewByChange}>
            <SelectTrigger
              className="w-24 relative z-10 bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 transition-all duration-200 cursor-pointer hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation()
                e.currentTarget.focus()
              }}
              onPointerDown={(e) => {
                e.stopPropagation()
              }}
            >
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              <SelectItem value="floor" className="cursor-pointer hover:bg-gray-100">
                Floor
              </SelectItem>
              <SelectItem value="room" className="cursor-pointer hover:bg-gray-100">
                Room
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Period:</span>
          <Select value={timeFrame} onValueChange={onTimeFrameChange}>
            <SelectTrigger
              className="w-20 relative z-10 bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 transition-all duration-200 cursor-pointer hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation()
                e.currentTarget.focus()
              }}
              onPointerDown={(e) => {
                e.stopPropagation()
              }}
            >
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              <SelectItem value="month" className="cursor-pointer hover:bg-gray-100">
                Month
              </SelectItem>
              <SelectItem value="year" className="cursor-pointer hover:bg-gray-100">
                Year
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
