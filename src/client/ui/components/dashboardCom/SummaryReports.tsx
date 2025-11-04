import { useState, useRef } from "react"
import { FileBarChart, Users, Building, Calendar, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/Select"
import { Badge } from "../common/Badge"

import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import type { PaymentsModel } from "@domain/models/payments.model"

interface Room {
  id: string
  number: string
  floor: number
  type: string
  size: number
  status: "available" | "occupied" | "reserved" | "pending"
  tenant?: {
    name: string
    email: string
    phone: string
    checkIn: Date
    checkOut: Date
    rentAmount: number
    billingCycle: "monthly" | "yearly"
    emergencyContact: string
  }
}

interface SummaryReportsProps {
  rooms: Room[]
  payments: PaymentsModel[]
}

type ReportType = "unit" | "tenant" | "month"

interface UnitSummary {
  unitId: string
  unitNumber: string
  floor: number
  tenant?: string
  status: string
  totalRevenue: number
  waterUsage: number
  electricUsage: number
  lastPayment?: string
}

interface TenantSummary {
  tenantName: string
  unitNumber: string
  floor: number
  totalPaid: number
  averageWaterUsage: number
  averageElectricUsage: number
  contractStatus: string
  lastPaymentDate?: string
}

interface MonthlySummary {
  month: string
  totalRevenue: number
  totalWaterUsage: number
  totalElectricUsage: number
  occupancyRate: number
  activeUnits: number
}

export function SummaryReports({ rooms, payments }: SummaryReportsProps) {
  const [reportType, setReportType] = useState<ReportType>("unit")
  const [isExporting, setIsExporting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const handleExportClick = () => {
    setShowConfirmModal(true)
  }

  const confirmExport = () => {
    setShowConfirmModal(false)
    exportToPDF()
  }

  const exportToPDF = async () => {
    if (!reportRef.current) {
      return
    }

    setIsExporting(true)
    try {
      // Apply PDF styles to tables temporarily
      const tables = reportRef.current.querySelectorAll("table")
      const containers = reportRef.current.querySelectorAll(".overflow-x-auto")
      const cells = reportRef.current.querySelectorAll("th, td")

      // Store original styles
      const originalStyles: { element: Element; className: string; style: string }[] = []

      // Apply PDF styles
      tables.forEach((table) => {
        originalStyles.push({
          element: table,
          className: table.className,
          style: table.getAttribute("style") || "",
        })
        table.className = "w-full divide-y divide-gray-200 bg-white border border-gray-300"
        table.setAttribute("style", "font-size: 12px; table-layout: fixed;")
      })

      containers.forEach((container) => {
        originalStyles.push({
          element: container,
          className: container.className,
          style: container.getAttribute("style") || "",
        })
        container.className = "w-full"
      })

      cells.forEach((cell) => {
        originalStyles.push({
          element: cell,
          className: cell.className,
          style: cell.getAttribute("style") || "",
        })
        const isHeader = cell.tagName === "TH"
        if (isHeader) {
          cell.className =
            "px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300"
        } else {
          cell.className = "px-4 py-3 text-sm text-gray-900 border-r border-gray-200 border-b border-gray-200"
        }
      })

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const canvas = await html2canvas(reportRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      })

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error("Canvas has no content")
      }

      const imgData = canvas.toDataURL("image/png", 1.0)
      const pdf = new jsPDF("p", "mm", "a4")

      const pdfWidth = 210
      const pdfHeight = 297
      const margin = 15

      const contentStartY = margin
      const availableWidth = pdfWidth - margin * 2
      const availableHeight = pdfHeight - contentStartY - margin

      const aspectRatio = canvas.width / canvas.height
      const imgWidth = availableWidth
      const imgHeight = imgWidth / aspectRatio

      if (imgHeight > availableHeight) {
        const pageHeight = availableHeight
        let remainingHeight = imgHeight
        let yOffset = 0
        let pageNumber = 1

        while (remainingHeight > 0) {
          if (pageNumber > 1) {
            pdf.addPage()
          }

          const currentPageHeight = Math.min(pageHeight, remainingHeight)
          const sourceY = (yOffset / imgHeight) * canvas.height
          const sourceHeight = (currentPageHeight / imgHeight) * canvas.height

          // Create a temporary canvas for this page section
          const tempCanvas = document.createElement("canvas")
          const tempCtx = tempCanvas.getContext("2d")
          tempCanvas.width = canvas.width
          tempCanvas.height = sourceHeight

          tempCtx?.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight)
          const pageImgData = tempCanvas.toDataURL("image/png", 1.0)

          pdf.addImage(pageImgData, "PNG", margin, contentStartY, imgWidth, currentPageHeight)

          // Add page number
          pdf.setFontSize(10)
          pdf.text(`Page ${pageNumber}`, pdfWidth - margin, pdfHeight - 10, { align: "right" })

          remainingHeight -= currentPageHeight
          yOffset += currentPageHeight
          pageNumber++
        }
      } else {
        // Single page - center content
        const yPosition = contentStartY + (availableHeight - imgHeight) / 2
        pdf.addImage(imgData, "PNG", margin, yPosition, imgWidth, imgHeight)
      }

      // Save with better filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0]
      const fileName = `${reportType}-report-${timestamp}.pdf`
      pdf.save(fileName)

      // Restore original styles
      originalStyles.forEach(({ element, className, style }) => {
        element.className = className
        if (style) {
          element.setAttribute("style", style)
        } else {
          element.removeAttribute("style")
        }
      })
    } catch {
      // Silent error handling for PDF generation
    } finally {
      setIsExporting(false)
    }
  }

  const generateUnitSummary = (): UnitSummary[] => {
    // If no real data, provide sample data for testing
    if (rooms.length === 0) {
      return [
        {
          unitId: "sample-1",
          unitNumber: "101",
          floor: 1,
          tenant: "John Smith",
          status: "occupied",
          totalRevenue: 15000,
          waterUsage: 120,
          electricUsage: 250,
          lastPayment: "2025-11-01",
        },
        {
          unitId: "sample-2",
          unitNumber: "102",
          floor: 1,
          tenant: undefined,
          status: "available",
          totalRevenue: 0,
          waterUsage: 0,
          electricUsage: 0,
          lastPayment: undefined,
        },
        {
          unitId: "sample-3",
          unitNumber: "201",
          floor: 2,
          tenant: "Mary Johnson",
          status: "occupied",
          totalRevenue: 18000,
          waterUsage: 98,
          electricUsage: 280,
          lastPayment: "2025-10-28",
        },
      ]
    }

    return rooms.map((room) => {
      const unitPayments = payments.filter((payment) => payment.contract.unit.id === room.id)

      const totalRevenue = unitPayments.reduce((sum, payment) => sum + payment.contract.rentAmount, 0)
      const waterUsage = unitPayments.reduce((sum, payment) => sum + (payment.waterUsage || 0), 0)
      const electricUsage = unitPayments.reduce((sum, payment) => sum + (payment.electricUsage || 0), 0)
      const lastPayment =
        unitPayments.length > 0
          ? new Date(unitPayments[unitPayments.length - 1].billingMonth).toLocaleDateString()
          : undefined

      return {
        unitId: room.id,
        unitNumber: room.number,
        floor: room.floor,
        tenant: room.tenant?.name,
        status: room.status,
        totalRevenue,
        waterUsage,
        electricUsage,
        lastPayment,
      }
    })
  }

  const generateTenantSummary = (): TenantSummary[] => {
    const occupiedRooms = rooms.filter((room) => room.tenant)

    if (occupiedRooms.length === 0) {
      return [
        {
          tenantName: "John Smith",
          unitNumber: "101",
          floor: 1,
          totalPaid: 45000,
          averageWaterUsage: 115,
          averageElectricUsage: 260,
          contractStatus: "Active",
          lastPaymentDate: "2025-11-01",
        },
        {
          tenantName: "Mary Johnson",
          unitNumber: "201",
          floor: 2,
          totalPaid: 54000,
          averageWaterUsage: 92,
          averageElectricUsage: 275,
          contractStatus: "Active",
          lastPaymentDate: "2025-10-28",
        },
      ]
    }

    return occupiedRooms.map((room) => {
      const unitPayments = payments.filter((payment) => payment.contract.unit.id === room.id)

      const totalPaid = unitPayments.reduce((sum, payment) => sum + payment.contract.rentAmount, 0)
      const averageWaterUsage =
        unitPayments.length > 0
          ? unitPayments.reduce((sum, payment) => sum + (payment.waterUsage || 0), 0) / unitPayments.length
          : 0
      const averageElectricUsage =
        unitPayments.length > 0
          ? unitPayments.reduce((sum, payment) => sum + (payment.electricUsage || 0), 0) / unitPayments.length
          : 0
      const lastPaymentDate =
        unitPayments.length > 0
          ? new Date(unitPayments[unitPayments.length - 1].billingMonth).toLocaleDateString()
          : undefined

      return {
        tenantName: room.tenant!.name,
        unitNumber: room.number,
        floor: room.floor,
        totalPaid,
        averageWaterUsage,
        averageElectricUsage,
        contractStatus: "Active",
        lastPaymentDate,
      }
    })
  }

  const generateMonthlySummary = (): MonthlySummary[] => {
    // If no real data, provide sample data for testing
    if (payments.length === 0) {
      return [
        {
          month: "Oct 2025",
          totalRevenue: 99000,
          totalWaterUsage: 520,
          totalElectricUsage: 1150,
          occupancyRate: 85,
          activeUnits: 8,
        },
        {
          month: "Nov 2025",
          totalRevenue: 108000,
          totalWaterUsage: 480,
          totalElectricUsage: 1230,
          occupancyRate: 90,
          activeUnits: 9,
        },
      ]
    }

    const monthlyData: { [key: string]: MonthlySummary } = {}

    payments.forEach((payment) => {
      const month = new Date(payment.billingMonth).toLocaleDateString("en", {
        year: "numeric",
        month: "short",
      })

      if (!monthlyData[month]) {
        monthlyData[month] = {
          month,
          totalRevenue: 0,
          totalWaterUsage: 0,
          totalElectricUsage: 0,
          occupancyRate: 0,
          activeUnits: 0,
        }
      }

      monthlyData[month].totalRevenue += payment.contract.rentAmount
      monthlyData[month].totalWaterUsage += payment.waterUsage || 0
      monthlyData[month].totalElectricUsage += payment.electricUsage || 0
    })

    Object.keys(monthlyData).forEach((month) => {
      const occupiedUnits = rooms.filter((room) => room.status === "occupied").length
      monthlyData[month].occupancyRate = (occupiedUnits / rooms.length) * 100
      monthlyData[month].activeUnits = occupiedUnits
    })

    return Object.values(monthlyData).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
  }

  const renderUnitReport = () => {
    const unitSummaries = generateUnitSummary()

    return (
      <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Unit</th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Floor
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Water (L)
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Electric (kWh)
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Last Payment
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {unitSummaries.map((unit) => (
              <tr key={unit.unitId} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="px-8 py-6 whitespace-nowrap text-base font-medium text-gray-900">{unit.unitNumber}</td>
                <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900">{unit.floor}</td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <Badge
                    variant={
                      unit.status === "occupied" ? "default" : unit.status === "available" ? "secondary" : "outline"
                    }
                  >
                    {unit.status}
                  </Badge>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900">{unit.tenant || "N/A"}</td>
                <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900">
                  ${unit.totalRevenue.toLocaleString()}
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900">{unit.waterUsage}</td>
                <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900">{unit.electricUsage}</td>
                <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900">{unit.lastPayment || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderTenantReport = () => {
    const tenantSummaries = generateTenantSummary()

    return (
      <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gradient-to-r from-green-50 to-green-100">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                style={{ width: "18%" }}
              >
                Tenant Name
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                style={{ width: "10%" }}
              >
                Unit
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                style={{ width: "10%" }}
              >
                Floor
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                style={{ width: "15%" }}
              >
                Total Paid
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                style={{ width: "12%" }}
              >
                Status
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                style={{ width: "13%" }}
              >
                Avg Water (L)
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                style={{ width: "14%" }}
              >
                Avg Electric (kWh)
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                style={{ width: "8%" }}
              >
                Last Payment
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tenantSummaries.map((tenant, index) => (
              <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-300 truncate">
                  {tenant.tenantName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">{tenant.unitNumber}</td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">{tenant.floor}</td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                  ${tenant.totalPaid.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {tenant.contractStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                  {tenant.averageWaterUsage.toFixed(1)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                  {tenant.averageElectricUsage.toFixed(1)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{tenant.lastPaymentDate || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderMonthlyReport = () => {
    const monthlySummaries = generateMonthlySummary()

    return (
      <div className="w-full">
        <table
          className="w-full divide-y divide-gray-200 bg-white border border-gray-300"
          style={{ fontSize: "12px", tableLayout: "fixed" }}
        >
          <thead className="bg-gradient-to-r from-purple-50 to-purple-100">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                style={{ width: "20%" }}
              >
                Month
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                style={{ width: "15%" }}
              >
                Active Units
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                style={{ width: "15%" }}
              >
                Occupancy Rate
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                style={{ width: "17%" }}
              >
                Total Revenue
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300"
                style={{ width: "16%" }}
              >
                Water Usage (L)
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                style={{ width: "17%" }}
              >
                Electric Usage (kWh)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {monthlySummaries.map((monthly) => (
              <tr key={monthly.month} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-300">
                  {monthly.month}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">{monthly.activeUnits}</td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                  {monthly.occupancyRate.toFixed(1)}%
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                  ${monthly.totalRevenue.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-300">
                  {monthly.totalWaterUsage.toFixed(0)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{monthly.totalElectricUsage.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileBarChart className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold">Summary Reports</h2>
            <p className="text-muted-foreground">Comprehensive reports by unit, tenant, or month</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Report Type:</span>
            <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="unit" className="flex items-center gap-2">
                  <div className="flex flex-row gap-[6px]">
                    <Building className="h-4 w-4" />
                    Unit
                  </div>
                </SelectItem>
                <SelectItem value="tenant" className="flex items-center gap-2">
                  <div className="flex flex-row gap-[6px]">
                    <Users className="h-4 w-4" />
                    Tenant
                  </div>
                </SelectItem>
                <SelectItem value="month" className="flex items-center gap-2">
                  <div className="flex flex-row gap-[6px]">
                    <Calendar className="h-4 w-4" />
                    Monthly
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={handleExportClick}
            disabled={isExporting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isExporting
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
            title="Export to PDF"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4-5l5 5 5-5m-5 5V3" />
            </svg>
            <span>{isExporting ? "Exporting..." : "Export PDF"}</span>
          </button>
        </div>
      </div>

      <div
        ref={reportRef}
        className="report-content m-auto bg-white p-4 rounded-lg shadow-sm border pdf-export"
        style={{ fontSize: "16px", minWidth: "800px", width: "210mm", minHeight: "297mm" }}
      >
        <div className="mb-6 text-center border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontSize: "24px" }}>
            {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Summary Report
          </h1>
          <p className="text-gray-600 text-base" style={{ fontSize: "14px" }}>
            Generated on{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {reportType === "unit" && renderUnitReport()}
        {reportType === "tenant" && renderTenantReport()}
        {reportType === "month" && renderMonthlyReport()}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FileBarChart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Export Report</h3>
                  <p className="text-sm text-gray-500">Confirm PDF Export</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-3">
                Are you sure you want to export the{" "}
                <span className="font-semibold">{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</span>{" "}
                to PDF?
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Report Type:</span>
                    <span className="font-medium">{reportType.charAt(0).toUpperCase() + reportType.slice(1)}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Export Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString("th-TH")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmExport}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
