import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, CheckCircle2, CreditCard, Home, LogOut, Receipt, Sparkles, Wrench, FileText } from "lucide-react"
import { format } from "date-fns"

import { useAuthStore } from "../stores/auth.store"
import { usePaymentStore } from "@infrastructure/libs/store/payments.store"
import { Button } from "../components/common/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/common/card"
import { Avatar, AvatarFallback } from "../components/common/Avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/common/Dialog"
import { Input } from "../components/common/Input"
import { Textarea } from "../components/common/TextArea"
import UploadFileDialog from "../components/common/UploadFileDialog"
import { useToast } from "../components/hooks/useToast"
import type { MaintenanceType } from "@domain/types/enums.types"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import { cookieUtils } from "@shared/utils/cookie.utils"
import { jwtUtils } from "@shared/utils/jwt.utils"

function formatDate(date?: Date | string | null, fallback = "—") {
  if (!date) return fallback
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return fallback
  return format(parsedDate, "MMM dd, yyyy")
}

function formatCurrency(amount?: number | null) {
  if (!amount) return "$0"
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
}

export default function TenantDashboard() {
  const { fullName, userEmail, logout } = useAuthStore()
  const navigate = useNavigate()
  const { payments, getPayments } = usePaymentStore()
  const { toast } = useToast()

  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [maintenanceForm, setMaintenanceForm] = useState<{
    title: string
    description: string
    maintenanceType: MaintenanceType
  }>({
    title: "",
    description: "",
    maintenanceType: "ELECTRIC",
  })

  useEffect(() => {
    getPayments()
  }, [getPayments])

  const userPayments = useMemo(() => {
    if (!userEmail) return []
    return payments.filter((payment) => payment.contract?.user?.email?.toLowerCase() === userEmail.toLowerCase())
  }, [payments, userEmail])

  const activity = useMemo(
    () => [...userPayments].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()).slice(0, 5),
    [userPayments],
  )

  const initials =
    fullName
      ?.split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U"

  const firstName = fullName?.split(" ")[0] ?? "there"
  const primaryUnit = userPayments[0]?.contract?.unit?.unitNumber
  const hasPayments = userPayments.length > 0

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleSubmitMaintenance = async () => {
    if (!maintenanceForm.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please add a short title for your request.",
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)
    try {
      const authToken = cookieUtils.getAuthToken()
      const userId: string | null = authToken ? jwtUtils.getIdFromToken(authToken) : null
      const payload = {
        userId: userId,
        title: maintenanceForm.title,
        description: maintenanceForm.description || "",
        maintenanceType: maintenanceForm.maintenanceType,
      }
      await axiosInstance.post("/public/maintenances", payload)

      toast({ title: "Request sent", description: "We received your maintenance request." })
      setMaintenanceForm({ title: "", description: "", maintenanceType: "ELECTRIC" })
      setIsMaintenanceOpen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong"
      toast({ title: "Could not send", description: message, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUploadClick = async () => {
    const authToken = cookieUtils.getAuthToken()
    const userId: string | null = authToken ? jwtUtils.getIdFromToken(authToken) : null

    if (!userId) {
      toast({
        title: "Authentication error",
        description: "Unable to get user information.",
        variant: "destructive",
      })
      return
    }

    try {
      // Get invoices for this user
      const response = await axiosInstance.get(`/public/invoices?userId=${userId}`)
      const invoices = response.data.data

      if (!invoices || invoices.length === 0) {
        toast({
          title: "No invoices found",
          description: "You don't have any invoices to upload proof for.",
          variant: "destructive",
        })
        return
      }

      // Use the first invoice ID
      const invoiceId = invoices[0].id
      setSelectedInvoiceId(invoiceId)
      setIsUploadOpen(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch invoices"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    }
  }

  const quickActions = [
    {
      title: "Request maintenance",
      description: "Log an issue and track its status",
      icon: Wrench,
      action: () => setIsMaintenanceOpen(true),
    },
    {
      title: "Upload payment proof",
      description: "Share your transfer slip or confirmation",
      icon: CreditCard,
      action: handleUploadClick,
    },
    {
      title: "View invoices & receipts",
      description: "See your bills and download receipts",
      icon: FileText,
      action: () => navigate("/payments"),
    },
  ]

  const maintenanceTypes: MaintenanceType[] = [
    "ELECTRIC",
    "WATER",
    "PHONE",
    "AIR_CONDITIONAL",
    "FURNITURE",
    "FIRE_ALARM_SYSTEM",
    "WATER_LEAKAGE",
    "FLOOR_WALL",
    "BATHROOM",
    "PAINT",
    "CEMENT_WOOD",
    "OTHER",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 text-white shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-100">
                    <Sparkles className="h-4 w-4" />
                    <span>Tenant Hub</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-blue-100">Hi {firstName}, what would you like to do?</p>
                    <h1 className="text-3xl font-semibold leading-tight">Manage your home in one place</h1>
                  </div>
                  {hasPayments && (
                    <div className="flex flex-wrap gap-3 text-sm text-blue-100">
                      <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                        <Home className="h-4 w-4" />
                        <span>Unit {primaryUnit ?? "—"}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-white text-blue-700 hover:bg-blue-50" onClick={() => navigate("/payments")}>
                      View invoices
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/60 text-white hover:bg-white/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-5 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border border-white/20">
                      <AvatarFallback className="bg-blue-100 text-blue-700">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-blue-100">Signed in as</p>
                      <p className="text-lg font-semibold">{fullName ?? "Resident"}</p>
                      <p className="text-sm text-blue-100">{userEmail ?? "—"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-white/80 shadow-xl backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                What do you want to do?
              </CardTitle>
              <CardDescription>Pick an action to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    onClick={action.action}
                    className="group flex w-full items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
                  >
                    <div className="rounded-lg bg-white p-2 text-blue-600 shadow-sm group-hover:text-blue-700">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{action.title}</p>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ArrowRight className="text-gray-400 transition group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {hasPayments && (
          <div className="grid gap-6">
            <Card className="bg-white/90 shadow-lg backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Invoices & payments
                </CardTitle>
                <CardDescription>Your latest invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activity.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
                    No invoices yet.
                  </div>
                ) : (
                  activity.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {payment.contract?.unit?.unitNumber ? `Unit ${payment.contract.unit.unitNumber}` : "Invoice"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Billing {formatDate(payment.billingMonth)} • Due {formatDate(payment.dueDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(payment.totalAmount)}</p>
                        <p className="text-xs text-gray-500">{payment.status}</p>
                      </div>
                    </div>
                  ))
                )}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-700"
                    onClick={() => navigate("/payments")}
                  >
                    View all
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={isMaintenanceOpen} onOpenChange={setIsMaintenanceOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Request maintenance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                value={maintenanceForm.title}
                onChange={(e) => setMaintenanceForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Describe the issue briefly"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                value={maintenanceForm.description}
                onChange={(e) => setMaintenanceForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Any extra details (optional)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Maintenance type</label>
              <select
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                value={maintenanceForm.maintenanceType}
                onChange={(e) =>
                  setMaintenanceForm((prev) => ({ ...prev, maintenanceType: e.target.value as MaintenanceType }))
                }
              >
                {maintenanceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type
                      .replaceAll("_", " ")
                      .toLowerCase()
                      .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsMaintenanceOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmitMaintenance} disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Payment Proof Dialog */}
      <UploadFileDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        type="receipt"
        id={selectedInvoiceId}
      />
    </div>
  )
}
