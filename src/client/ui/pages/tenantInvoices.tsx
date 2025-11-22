import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Download, FileText, Loader2, RefreshCcw } from "lucide-react"
import { format } from "date-fns"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/common/card"
import { Badge } from "../components/common/Badge"
import { Button } from "../components/common/Button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/common/Table"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import { cookieUtils } from "@shared/utils/cookie.utils"
import { jwtUtils } from "@shared/utils/jwt.utils"

type TenantInvoice = {
  id: string
  billingMonth: string
  electricUsage: number
  waterUsage: number
  status: string
  dueDate: string
  totalAmount: number
  paidDate: string | null
  path?: string | null
}

const statusBadgeStyles: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700",
  UNPAID: "bg-amber-100 text-amber-700",
  OVERDUE: "bg-red-100 text-red-700",
  PENDING: "bg-blue-100 text-blue-700",
}

const formatCurrency = (value?: number | null) => {
  if (!value && value !== 0) return "—"
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  })
}

const formatDate = (value?: string | null) => {
  if (!value) return "—"
  try {
    return format(new Date(value), "MMM dd, yyyy")
  } catch {
    return value
  }
}

const formatMonth = (value?: string | null) => {
  if (!value) return "—"
  try {
    return format(new Date(value), "MMMM yyyy")
  } catch {
    return value
  }
}

const normalizeInvoice = (invoice: any): TenantInvoice => ({
  id: invoice.id ?? "",
  billingMonth: invoice.billingMonth ?? invoice.billingMonthDate ?? "",
  electricUsage: Number(invoice.electricUsage) || 0,
  waterUsage: Number(invoice.waterUsage) || 0,
  status: invoice.status ?? "UNKNOWN",
  dueDate: invoice.dueDate ?? "",
  totalAmount: typeof invoice.totalAmount === "number" ? invoice.totalAmount : Number(invoice.totalAmount) || 0,
  paidDate: invoice.paidDate ?? null,
  path: invoice.path ?? invoice.receiptPath ?? null,
})

export default function TenantInvoices() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState<TenantInvoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const resolveReceiptUrl = (path?: string | null) => {
    if (!path) return null
    if (/^https?:\/\//i.test(path)) return path
    const base = import.meta.env.VITE_DEAWKOIKID_API_BASE_URL ?? ""
    const sanitizedBase = base.endsWith("/") ? base.slice(0, -1) : base
    const sanitizedPath = path.startsWith("/") ? path : `/${path}`
    return `${sanitizedBase}${sanitizedPath}`
  }

  const fetchInvoices = async (overrideUserId?: string) => {
    const currentUserId = overrideUserId ?? userId
    if (!currentUserId) {
      setError("Unable to find your account. Please sign in again.")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const { data } = await axiosInstance.get("/public/invoices", {
        params: { userId: currentUserId },
      })

      const rawInvoices = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
      const normalized = rawInvoices.map(normalizeInvoice)
      setInvoices(normalized)
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Could not load invoices right now. Please try again."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = cookieUtils.getAuthToken()
    const idFromToken = token ? jwtUtils.getIdFromToken(token) : null
    setUserId(idFromToken)
    void fetchInvoices(idFromToken ?? undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totals = useMemo(() => {
    const outstanding = invoices
      .filter((invoice) => invoice.status === "UNPAID" || invoice.status === "OVERDUE")
      .reduce((sum, invoice) => sum + invoice.totalAmount, 0)
    const paid = invoices
      .filter((invoice) => invoice.status === "PAID")
      .reduce((sum, invoice) => sum + invoice.totalAmount, 0)

    return { outstanding, paid }
  }, [invoices])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-blue-200 text-blue-700"
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1)
                } else {
                  navigate("/tenant/dashboard")
                }
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Invoices & Receipts</h1>
              <p className="text-sm text-gray-600">Review your monthly invoices and download receipts.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => fetchInvoices()} disabled={isLoading}>
              <RefreshCcw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => navigate("/tenant/dashboard")}>
              Go to dashboard
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white/90 shadow-md backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <FileText className="h-5 w-5 text-blue-600" />
                Billing overview
              </CardTitle>
              <CardDescription>Quick snapshot of your balances</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm text-gray-600">Outstanding</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(totals.outstanding)}</p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm text-gray-600">Paid to date</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(totals.paid)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/95 shadow-lg backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FileText className="h-5 w-5 text-blue-600" />
              Invoice history
            </CardTitle>
            <CardDescription>Your latest invoices and receipts</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span>{error}</span>
                <Button size="sm" variant="outline" onClick={() => fetchInvoices()} disabled={isLoading}>
                  Retry
                </Button>
              </div>
            )}

            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex animate-pulse items-center justify-between rounded-lg border border-gray-100 p-4"
                  >
                    <div className="space-y-2">
                      <div className="h-3 w-32 rounded bg-gray-200" />
                      <div className="h-3 w-24 rounded bg-gray-200" />
                    </div>
                    <div className="h-3 w-16 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : invoices.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
                <FileText className="h-10 w-10 text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-900">No invoices yet</p>
                  <p className="text-sm text-gray-600">
                    We&apos;ll list your invoices and receipts here once available.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => fetchInvoices()} disabled={isLoading}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Check again
                  </Button>
                  <Button onClick={() => navigate("/tenant/dashboard")}>Go back</Button>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Billing Month</TableHead>
                    <TableHead className="text-center">Usage</TableHead>
                    <TableHead className="text-center">Due Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-right">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => {
                    const badgeClass =
                      statusBadgeStyles[invoice.status?.toUpperCase()] ??
                      "bg-gray-100 text-gray-700 border border-gray-200"

                    return (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-900">{formatMonth(invoice.billingMonth)}</p>
                            <p className="text-xs text-gray-500">ID: {invoice.id}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-700">
                          <div className="flex items-center justify-center gap-4">
                            <span className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">
                              Electric {invoice.electricUsage} u
                            </span>
                            <span className="rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                              Water {invoice.waterUsage} u
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-700">
                          {formatDate(invoice.dueDate)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={badgeClass}>{invoice.status}</Badge>
                          <p className="text-xs text-gray-500">Paid: {formatDate(invoice.paidDate)}</p>
                        </TableCell>
                        <TableCell className="text-center font-semibold text-gray-900">
                          {formatCurrency(invoice.totalAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {invoice.path ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const url = resolveReceiptUrl(invoice.path)
                                if (url) {
                                  window.open(url, "_blank")
                                }
                              }}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Receipt
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-500">No file</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      {isLoading && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center bg-black/5">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm text-gray-700">Loading invoices...</span>
          </div>
        </div>
      )}
    </div>
  )
}
