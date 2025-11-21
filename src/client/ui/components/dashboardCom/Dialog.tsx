import { Plus, Upload, X } from "lucide-react"
import { useState, useRef, type ChangeEvent } from "react"
import Papa from "papaparse"
import type { ParseResult } from "papaparse"

import { useDashboardStore } from "@infrastructure/libs/store/dashboard.store"
import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../common/Table"
import { useToast } from "../hooks/useToast"

interface CsvRow {
  unit_Id: string
  electric_Usage: string
  water_Usage: string
}

const DialogCSV = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [csvData, setCsvData] = useState<CsvRow[]>([])
  const [fileName, setFileName] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { uploadMeterCsv } = useDashboardStore()

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setSelectedFile(file)

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<CsvRow>) => {
        if (results.data) {
          setCsvData(results.data)
          toast({
            title: "File loaded",
            description: `${results.data.length} rows ready to import`,
          })
        }
      },
      error: (error: Error) => {
        toast({
          title: "Error",
          description: `Failed to parse CSV: ${error.message}`,
          variant: "destructive",
        })
      },
    })
  }

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleChangeFile = () => {
    setCsvData([])
    setFileName("")
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    fileInputRef.current?.click()
  }

  const handleClearData = () => {
    setCsvData([])
    setFileName("")
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await uploadMeterCsv({ file: selectedFile })

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "CSV meter update completed",
        })
        setIsOpen(false)
        handleClearData()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to upload CSV",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const headers = csvData.length > 0 ? (Object.keys(csvData[0]) as (keyof CsvRow)[]) : []

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white flex flex-col max-h-[90vh]">
        <DialogHeader className="mb-4 flex-shrink-0">
          <DialogTitle>Import CSV</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col flex-1 min-h-0 space-y-4">
          {csvData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 flex-1">
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
              <Upload className="mb-4 h-12 w-12 text-gray-400" />
              <p className="mb-4 text-sm text-gray-600">Select a CSV file to import</p>
              <Button onClick={handleFileButtonClick} variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Upload className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{fileName}</p>
                    <p className="text-xs text-gray-500">{csvData.length} rows imported</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleChangeFile}>
                    Change File
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClearData}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-auto rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map((key, index) => (
                        <TableHead
                          key={String(key)}
                          className={`bg-gray-50 font-semibold ${index < headers.length - 1 ? "border-r border-gray-200" : ""}`}
                        >
                          {String(key).replace(/_/g, " ")}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvData.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {headers.map((key, colIndex) => (
                          <TableCell
                            key={String(key)}
                            className={colIndex < headers.length - 1 ? "border-r border-gray-200" : ""}
                          >
                            {row[key] || "-"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
          <div className="flex gap-3 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false)
                handleClearData()
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedFile || isSubmitting}>
              {isSubmitting ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogCSV
