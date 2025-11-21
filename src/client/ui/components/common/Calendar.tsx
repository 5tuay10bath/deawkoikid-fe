import DatePicker, { type DatePickerProps } from "./DatePicker"

export type CalendarProps = {
  selected?: Date | null
  onSelect?: (date?: Date | null) => void
} & Omit<DatePickerProps, "value" | "onChange"> &
  Record<string, unknown>

// Wrapper that keeps existing Calendar imports working while using the input-based DatePicker.
const Calendar = ({ selected, onSelect, ...props }: CalendarProps) => (
  <DatePicker {...props} value={selected ?? null} onChange={(date) => onSelect?.(date ?? null)} />
)

export { Calendar }
export default Calendar
