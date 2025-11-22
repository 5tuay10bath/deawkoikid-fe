import { useState, useRef, useEffect } from "react"
import { Upload, Check, Loader2, AlertCircle, RefreshCcw } from "lucide-react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../common/Dialog"
import { Button } from "../common/Button"
import { useToast } from "../hooks/useToast"
import { axiosInstance } from "@infrastructure/libs/axios/axiosInstance"
import { cookieUtils } from "@shared/utils/cookie.utils"
import { jwtUtils } from "@shared/utils/jwt.utils"

interface UploadPaymentDialogProps {
  isOpen: boolean
  onClose: () => void
}

type TenantInvoice = {
  id: string
  billingMonth: string
  status: string
  dueDate: string
  totalAmount: number
}

const resolveQrUrl = () => {
  const raw = "fivetuay10bath-frontend/payment-qr.jpg"

  // If absolute URL, return as-is
  if (/^https?:\/\//i.test(raw)) return raw

  // If provided with leading slash, respect it
  if (raw.startsWith("/")) return raw

  // If they referenced the public folder, strip it and ensure leading slash
  if (raw.toLowerCase().startsWith("public/")) {
    return `/${raw.slice("public/".length)}`
  }

  return `/${raw}`
}

const QR_IMAGE_URL = resolveQrUrl()

export default function UploadPaymentDialog({ isOpen, onClose }: UploadPaymentDialogProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null)
  const [isLoadingUrl, setIsLoadingUrl] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false)
  const [invoiceError, setInvoiceError] = useState<string | null>(null)
  const [unpaidInvoices, setUnpaidInvoices] = useState<TenantInvoice[]>([])
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null)
      setPresignedUrl(null)
      setUploadSuccess(false)
      setInvoiceError(null)
      setUnpaidInvoices([])
      setSelectedInvoiceId(null)
    }
  }, [isOpen])

  const formatCurrency = (value?: number | null) => {
    if (value === null || value === undefined) return "—"
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    })
  }

  const formatDateSafe = (value?: string | null, pattern = "MMM dd, yyyy") => {
    if (!value) return "—"
    try {
      return format(new Date(value), pattern)
    } catch {
      return "—"
    }
  }

  const fetchUnpaidInvoices = async () => {
    setIsLoadingInvoice(true)
    setInvoiceError(null)
    try {
      const token = cookieUtils.getAuthToken()
      const userId = token ? jwtUtils.getIdFromToken(token) : null

      if (!userId) {
        setInvoiceError("Could not find your account. Please sign in again.")
        return
      }

      const { data } = await axiosInstance.get("/public/invoices", {
        // Some backends expect lowercase userid, some expect camelCase userId
        params: { userId, userid: userId },
      })
      const invoices = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
      const normalized: TenantInvoice[] = invoices.map((invoice: any) => ({
        id: invoice.id ?? "",
        billingMonth: invoice.billingMonth ?? invoice.billingMonthDate ?? "",
        status: invoice.status ?? "UNKNOWN",
        dueDate: invoice.dueDate ?? "",
        totalAmount: typeof invoice.totalAmount === "number" ? invoice.totalAmount : Number(invoice.totalAmount) || 0,
      }))

      const openInvoices = normalized
        .filter((inv) => inv.status === "UNPAID" || inv.status === "OVERDUE")
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

      if (!openInvoices.length) {
        setInvoiceError("No unpaid invoice found.")
        setUnpaidInvoices([])
        setSelectedInvoiceId(null)
      } else {
        setUnpaidInvoices(openInvoices)
        setSelectedInvoiceId(openInvoices[0].id)
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Could not load invoice details."
      setInvoiceError(message)
    } finally {
      setIsLoadingInvoice(false)
    }
  }

  const fetchPresignedUrl = async (fileExtension: string, invoiceId: string) => {
    setIsLoadingUrl(true)
    try {
      const filePath = `img/receipt/${invoiceId}${fileExtension}`
      const { data } = await axiosInstance.get("/public/presigned-url/upload", {
        params: { filePath },
      })

      if (data) {
        setPresignedUrl(data)
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to prepare upload. Please try again.",
        variant: "destructive",
      })
      setSelectedFile(null)
    } finally {
      setIsLoadingUrl(false)
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!selectedInvoiceId) {
      toast({
        title: "No invoice selected",
        description: "Please select an invoice before uploading a payment proof.",
        variant: "destructive",
      })
      event.target.value = ""
      return
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Unsupported file",
        description: "Please upload an image file (jpg, png, webp, etc).",
        variant: "destructive",
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    const fileName = file.name
    const lastDot = fileName.lastIndexOf(".")
    const fileExtension = lastDot !== -1 ? fileName.substring(lastDot) : ""

    setSelectedFile(file)

    await fetchPresignedUrl(fileExtension, selectedInvoiceId)
  }

  const handleUpload = async () => {
    if (!selectedFile || !presignedUrl || !selectedInvoice) {
      toast({
        title: "Error",
        description: "Please select an invoice and a file first",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      await axiosInstance.put(presignedUrl, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type || "application/octet-stream",
        },
      })

      setUploadSuccess(true)
      toast({
        title: "Upload successful!",
        description: "Your payment proof has been uploaded successfully.",
      })

      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch {
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSelectFileClick = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    if (isOpen) {
      void fetchUnpaidInvoices()
    }
  }, [isOpen])

  const selectedInvoice = unpaidInvoices.find((inv) => inv.id === selectedInvoiceId) || null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Payment Proof</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          {isLoadingUrl ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
              <p className="text-sm text-gray-600">Preparing upload...</p>
            </div>
          ) : uploadSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-green-100 p-3 mb-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900">Upload Successful!</p>
              <p className="text-sm text-gray-600">Your payment proof has been uploaded.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-wide text-gray-500">Select an unpaid invoice</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={fetchUnpaidInvoices}
                        disabled={isLoadingInvoice}
                      >
                        <RefreshCcw className={`mr-1 h-3 w-3 ${isLoadingInvoice ? "animate-spin" : ""}`} />
                        Refresh
                      </Button>
                    </div>

                    {isLoadingInvoice ? (
                      <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        Loading invoices...
                      </div>
                    ) : unpaidInvoices.length === 0 ? (
                      <div className="rounded-md border border-dashed border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
                        {invoiceError ?? "No unpaid invoices found."}
                      </div>
                    ) : (
                      <div className="grid max-h-96 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                        {unpaidInvoices.map((inv) => (
                          <label
                            key={inv.id}
                            className={`flex h-full flex-col gap-2 rounded-md border px-3 py-2 text-sm transition ${selectedInvoiceId === inv.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-200"}`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                className="mt-1"
                                type="radio"
                                name="invoice"
                                value={inv.id}
                                checked={selectedInvoiceId === inv.id}
                                onChange={() => setSelectedInvoiceId(inv.id)}
                              />
                              <div className="space-y-1">
                                <p className="font-semibold text-gray-900">{formatCurrency(inv.totalAmount)}</p>
                                <p className="text-xs text-gray-600">
                                  Billing {formatDateSafe(inv.billingMonth, "MMMM yyyy")}
                                </p>
                                <p className="text-xs text-gray-600">Due {formatDateSafe(inv.dueDate)}</p>
                              </div>
                            </div>
                            <span className="text-[11px] uppercase tracking-wide text-gray-500">{inv.status}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {invoiceError && unpaidInvoices.length > 0 && (
                      <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        <span>{invoiceError}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-xs font-semibold text-gray-700">Scan to pay</p>
                    <div className="rounded-lg border border-gray-200 bg-white p-2">
                      <img src={QR_IMAGE_URL} alt="Payment QR code" className="h-24 w-24 object-contain" />
                    </div>
                  </div>
                </div>
              </div>

              <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="image/*" />

              {/* File selection area */}
              <div
                onClick={handleSelectFileClick}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    <p className="text-xs text-blue-600 mt-2">Click to change file</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Click to select file</p>
                    <p className="text-xs text-gray-500">Any image (jpg, png, webp...), max 10MB</p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} disabled={isUploading || isLoadingUrl} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedInvoice || !selectedFile || !presignedUrl || isUploading || isLoadingUrl}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
