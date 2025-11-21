import { useMemo, useState } from "react"
import { addDays, endOfDay, format, isValid, isWithinInterval, parseISO, startOfDay } from "date-fns"
import { CalendarIcon, Clock, Filter, MapPin, User, Wrench } from "lucide-react"
import type { DateRange } from "react-day-picker"

import type { MaintenanceModel } from "@domain/models/maintenance.model"
import type { MaintenancePriority } from "@domain/types/enums.types"
import type { MaintenanceStatus } from "@domain/types/status.types"
import { useMaintenanceStore } from "@infrastructure/libs/store/maintenance.store"

import { Badge } from "../common/Badge"
import { Button } from "../common/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../common/card"
import { Input } from "../common/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { TableEmpty, TableLoading } from "../common/TableLoading"

const statusTone = {
  REPORTED: { label: "Reported", className: "bg-amber-500 text-white" },
  SCHEDULED: { label: "Scheduled", className: "bg-blue-500 text-white" },
  IN_PROGRESS: { label: "In Progress", className: "bg-indigo-500 text-white" },
  COMPLETED: { label: "Completed", className: "bg-emerald-500 text-white" },
  CANCELLED: { label: "Cancelled", className: "bg-slate-500 text-white" },
}

const priorityTone = {
  LOW: { label: "Low", className: "bg-slate-200 text-slate-700" },
  MEDIUM: { label: "Medium", className: "bg-amber-100 text-amber-700" },
  HIGH: { label: "High", className: "bg-orange-200 text-orange-700" },
  URGENT: { label: "Urgent", className: "bg-red-500 text-white" },
}

const toMinutes = (value: string) => {
  if (!value) return null
  const [hours, minutes] = value.split(":").map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  return hours * 60 + minutes
}

const toTitle = (value: string) =>
  value
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")

type ScheduledTask = MaintenanceModel & { scheduledAt: Date }
type PriorityFilter = "all" | MaintenancePriority
type StatusFilter = "all" | MaintenanceStatus

const MaintenanceSchedule = () => {
  const { tasks, isLoading } = useMaintenanceStore()
  const today = startOfDay(new Date())

  const [range, setRange] = useState<DateRange>({ from: today, to: addDays(today, 14) })
  const [rangeInput, setRangeInput] = useState({
    from: format(today, "yyyy-MM-dd"),
    to: format(addDays(today, 14), "yyyy-MM-dd"),
  })
  const [timeWindow, setTimeWindow] = useState({ start: "06:00", end: "21:00" })
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const scheduledTasks = useMemo(() => tasks.filter((task): task is ScheduledTask => !!task.scheduledAt), [tasks])

  const filteredTasks = useMemo(() => {
    const windowStart = toMinutes(timeWindow.start)
    const windowEnd = toMinutes(timeWindow.end)

    const startDate = range.from ? startOfDay(range.from) : undefined
    const endDate = range.to ? endOfDay(range.to) : undefined

    return scheduledTasks
      .filter((task) => {
        const when = task.scheduledAt

        if (priorityFilter !== "all" && task.priority !== priorityFilter) return false
        if (statusFilter !== "all" && task.status !== statusFilter) return false

        if (startDate && endDate && !isWithinInterval(when, { start: startDate, end: endDate })) return false
        if (startDate && !endDate && when < startDate) return false
        if (endDate && !startDate && when > endDate) return false

        if (windowStart !== null && windowEnd !== null) {
          const current = when.getHours() * 60 + when.getMinutes()
          if (windowStart <= windowEnd) {
            return current >= windowStart && current <= windowEnd
          }
          return current >= windowStart || current <= windowEnd
        }

        return true
      })
      .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
  }, [scheduledTasks, range, timeWindow, priorityFilter, statusFilter])

  const groupedByDay = useMemo(() => {
    const map = new Map<string, { date: Date; items: ScheduledTask[] }>()

    filteredTasks.forEach((task) => {
      const key = format(task.scheduledAt, "yyyy-MM-dd")
      const existing = map.get(key)
      if (existing) {
        existing.items.push(task)
      } else {
        map.set(key, { date: startOfDay(task.scheduledAt), items: [task] })
      }
    })

    return Array.from(map.values()).sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [filteredTasks])

  const rangeLabel =
    range.from && range.to
      ? `${format(range.from, "d MMM yyyy")} – ${format(range.to, "d MMM yyyy")}`
      : range.from
        ? `From ${format(range.from, "d MMM yyyy")}`
        : "Pick a range"

  const unscheduledCount = tasks.length - scheduledTasks.length

  const handlePresetRange = (days: number) => {
    const start = startOfDay(new Date())
    const end = addDays(start, days)
    setRange({ from: start, to: end })
    setRangeInput({ from: format(start, "yyyy-MM-dd"), to: format(end, "yyyy-MM-dd") })
  }

  const handlePresetWindow = (start: string, end: string) => {
    setTimeWindow({ start, end })
  }

  const handleClearFilters = () => {
    setPriorityFilter("all")
    setStatusFilter("all")
  }

  const handleRangeInputChange = (key: "from" | "to", value: string) => {
    setRangeInput((prev) => ({ ...prev, [key]: value }))

    if (!value) {
      setRange((prev) => ({ ...prev, [key]: undefined }))
      return
    }

    const parsed = parseISO(value)
    if (isValid(parsed)) {
      const normalized = startOfDay(parsed)
      setRange((prev) => ({ ...prev, [key]: normalized }))
    }
  }

  if (isLoading) {
    return <TableLoading />
  }

  return (
    <Card className="overflow-hidden border-none shadow-xl">
      <CardHeader className="bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 text-white">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Schedule & Reminders</p>
            <CardTitle className="text-2xl text-white">{rangeLabel}</CardTitle>
            <p className="text-sm text-white/80">
              Showing {filteredTasks.length} of {scheduledTasks.length} scheduled tasks
              {unscheduledCount > 0 ? ` • ${unscheduledCount} without a scheduled time` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              onClick={() => handlePresetRange(0)}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              onClick={() => handlePresetRange(6)}
            >
              Next 7 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              onClick={() => handlePresetRange(29)}
            >
              30 days
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="bg-slate-50 pt-6">
        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-700">
                <CalendarIcon className="h-4 w-4 text-emerald-600" />
                Date range
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Start</p>
                    <Input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      value={rangeInput.from}
                      onChange={(e) => handleRangeInputChange("from", e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">End</p>
                    <Input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      value={rangeInput.to}
                      onChange={(e) => handleRangeInputChange("to", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  Time window
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Filter className="h-3.5 w-3.5" />
                  Filter by time of day
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500">Start</p>
                  <Input
                    type="time"
                    value={timeWindow.start}
                    onChange={(e) => setTimeWindow((prev) => ({ ...prev, start: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-500">End</p>
                  <Input
                    type="time"
                    value={timeWindow.end}
                    onChange={(e) => setTimeWindow((prev) => ({ ...prev, end: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handlePresetWindow("06:00", "12:00")}>
                  Morning
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePresetWindow("12:00", "17:00")}>
                  Afternoon
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePresetWindow("17:00", "22:00")}>
                  Evening
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePresetWindow("00:00", "23:59")}>
                  Full day
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Task filters</p>
                <Button variant="ghost" size="sm" className="text-xs px-2" onClick={handleClearFilters}>
                  Clear
                </Button>
              </div>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Priority</p>
                  <Select
                    value={priorityFilter}
                    onValueChange={(value: PriorityFilter) => setPriorityFilter(value as PriorityFilter)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <Select
                    value={statusFilter}
                    onValueChange={(value: StatusFilter) => setStatusFilter(value as StatusFilter)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="REPORTED">Reported</SelectItem>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Timeline</p>
                <p className="text-lg font-semibold text-slate-800">Scheduled maintenance</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800">
                {filteredTasks.length} task{filteredTasks.length === 1 ? "" : "s"}
              </Badge>
            </div>

            {filteredTasks.length === 0 ? (
              <TableEmpty message="No maintenance matches this date/time window yet." />
            ) : (
              <div className="mt-4 space-y-6">
                {groupedByDay.map((group) => (
                  <div key={group.date.toISOString()} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">{format(group.date, "EEEE, d MMM")}</span>
                      <Badge className="bg-slate-100 text-slate-700">{group.items.length} slot(s)</Badge>
                    </div>

                    <div className="space-y-4">
                      {group.items.map((task, index) => (
                        <div key={task.id} className="grid grid-cols-[90px,1fr] items-start gap-4">
                          <div className="relative flex items-center justify-end gap-3 text-sm text-slate-500 font-mono">
                            <span>{format(task.scheduledAt, "HH:mm")}</span>
                            <span className="relative h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow">
                              {index !== group.items.length - 1 && (
                                <span className="absolute left-1/2 top-3 h-6 w-px -translate-x-1/2 bg-slate-200" />
                              )}
                            </span>
                          </div>

                          <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                                <p className="text-xs text-slate-600">
                                  {task.unit.unitNumber} • {toTitle(task.maintenanceType)}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Badge
                                  className={priorityTone[task.priority]?.className || "bg-slate-200 text-slate-700"}
                                >
                                  {priorityTone[task.priority]?.label || task.priority}
                                </Badge>
                                <Badge className={statusTone[task.status]?.className || "bg-slate-500 text-white"}>
                                  {statusTone[task.status]?.label || task.status}
                                </Badge>
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                              <span className="inline-flex items-center gap-1">
                                <User className="h-3.5 w-3.5 text-emerald-600" />
                                {task.assignedTo ? task.assignedTo.fullName : "Unassigned"}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Wrench className="h-3.5 w-3.5 text-emerald-600" />
                                {statusTone[task.status]?.label || task.status}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                                Unit {task.unit.unitNumber}
                              </span>
                            </div>

                            <p className="mt-3 text-sm text-slate-700 line-clamp-2">{task.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MaintenanceSchedule
