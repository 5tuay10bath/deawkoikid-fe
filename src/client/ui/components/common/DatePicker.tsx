import type React from "react"
import { format } from "date-fns"
import { useMemo } from "react"

import { cn } from "@infrastructure/libs/cn/cn"

import { Button } from "./Button"
import { Input } from "./Input"
import { Label } from "./Label"

export type DatePickerProps = {
  label?: string
  value: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  withTime?: boolean
  disabled?: boolean
  allowClear?: boolean
  className?: string
  id?: string
  min?: string
  max?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

const formatValue = (value: Date | null, withTime: boolean) => {
  if (!value) return ""
  return format(value, withTime ? "yyyy-MM-dd'T'HH:mm" : "yyyy-MM-dd")
}

export const DatePicker = ({
  label,
  value,
  onChange,
  placeholder = "Select a date",
  withTime = false,
  disabled = false,
  allowClear = true,
  className,
  id,
  min,
  max,
  inputProps,
}: DatePickerProps) => {
  const displayValue = useMemo(() => formatValue(value, withTime), [value, withTime])

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="inline-block">
          {label}
        </Label>
      )}
      <div className="flex gap-2">
        <Input
          id={id}
          type={withTime ? "datetime-local" : "date"}
          value={displayValue}
          onChange={(e) => {
            const newValue = e.target.value
            if (!newValue) {
              onChange(null)
              return
            }

            const parsedDate = new Date(newValue)
            if (!Number.isNaN(parsedDate.getTime())) {
              onChange(parsedDate)
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          className="w-full"
          {...inputProps}
        />
        {allowClear && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(null)}
            disabled={disabled || !value}
            className="whitespace-nowrap"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}

export default DatePicker
