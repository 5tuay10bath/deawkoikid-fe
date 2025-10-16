import { format } from "date-fns"
import { Download, Send } from "lucide-react"
import { useRef } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

import type { DashboardModel } from "@domain/models/dashboard.model"

import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../common/Dialog"
import { useToast } from "../hooks/useToast"

interface RoomReceiptDialogProps {
  isOpen: boolean
  onClose: () => void
  unit: DashboardModel | undefined
}

const RoomReceiptDialog = ({ isOpen, onClose, unit }: RoomReceiptDialogProps) => {
  const { toast } = useToast()
  const receiptRef = useRef<HTMLDivElement>(null)

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current || !unit) return

    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we generate your receipt",
      })

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 190
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight)

      const fileName = `receipt_${unit.unitNumber}_${format(new Date(), "yyyyMMdd")}.pdf`
      pdf.save(fileName)

      toast({
        title: "Receipt Generated",
        description: "Receipt has been downloaded successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate receipt. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendReceipt = () => {
    if (!unit) return
    toast({
      title: "Receipt Sent",
      description: `Receipt has been sent to ${unit.contract?.user.fullName || "tenant"}`,
    })
    onClose()
  }

  if (!unit) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Generate Receipt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Receipt Content - This will be exported as PDF */}
          <div ref={receiptRef} className="bg-white rounded-lg border p-6">
            <div className="mb-6 text-center border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-900">Property Manager</h3>
              <p className="text-gray-500 text-sm mt-1">Payment Receipt</p>
              <p className="text-gray-400 text-xs mt-2">Receipt #{unit.id}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Tenant:</span>
                <span className="font-semibold text-gray-900">{unit.contract?.user.fullName || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Unit:</span>
                <span className="font-semibold text-gray-900">{unit.unitNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Payment Type:</span>
                <span className="font-semibold text-gray-900">Rent</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Payment Date:</span>
                <span className="font-semibold text-gray-900">{format(new Date(), "MMMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between py-3 mt-4 bg-gray-50 rounded-lg px-4">
                <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-emerald-600">
                  ${unit.contract?.rentAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-xs text-gray-500">Thank you for your payment</p>
              <p className="text-xs text-gray-400 mt-1">
                Generated on {format(new Date(), "MMMM dd, yyyy 'at' HH:mm")}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleDownloadReceipt}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={handleSendReceipt}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RoomReceiptDialog
