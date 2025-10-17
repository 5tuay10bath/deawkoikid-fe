import { format } from "date-fns"
import { Download, Edit } from "lucide-react"
import { useRef } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

import type { DashboardModel } from "@domain/models/dashboard.model"

import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../common/Dialog"
import { useToast } from "../hooks/useToast"

interface RoomContractDialogProps {
  isOpen: boolean
  onClose: () => void
  unit: DashboardModel | undefined
}

const RoomContractDialog = ({ isOpen, onClose, unit }: RoomContractDialogProps) => {
  const { toast } = useToast()
  const contractRef = useRef<HTMLDivElement>(null)

  const dateFormat = "MMMM dd, yyyy"

  const defaultTemplate = `RESIDENTIAL LEASE AGREEMENT

This lease agreement is entered into on [DATE] between Property Manager (Landlord) and [TENANT_NAME] (Tenant).

PROPERTY DETAILS:
- Unit Number: [UNIT_NUMBER]
- Address: [PROPERTY_ADDRESS]

LEASE TERMS:
- Start Date: [START_DATE]
- End Date: [END_DATE]
- Monthly Rent: $[RENT_AMOUNT]
- Security Deposit: $[SECURITY_DEPOSIT]

TENANT RESPONSIBILITIES:
1. Pay rent on time each month
2. Maintain the property in good condition
3. Follow all building rules and regulations
4. Provide proper notice before moving out

LANDLORD RESPONSIBILITIES:
1. Maintain common areas
2. Ensure property is habitable
3. Respond to maintenance requests promptly
4. Respect tenant privacy rights

This agreement is governed by local rental laws.

Landlord Signature: ___________________ Date: ___________
Tenant Signature: ____________________ Date: ___________`

  const contractContent = unit
    ? defaultTemplate
        .replace(/\[TENANT_NAME\]/g, unit.contract?.user.fullName || "N/A")
        .replace(/\[UNIT_NUMBER\]/g, unit.unitNumber)
        .replace(/\[START_DATE\]/g, unit.contract ? format(new Date(unit.contract.startDate), dateFormat) : "N/A")
        .replace(/\[END_DATE\]/g, unit.contract ? format(new Date(unit.contract.endDate), dateFormat) : "N/A")
        .replace(/\[RENT_AMOUNT\]/g, unit.contract?.rentAmount.toString() || "0")
        .replace(/\[SECURITY_DEPOSIT\]/g, "N/A")
        .replace(/\[DATE\]/g, format(new Date(), dateFormat))
        .replace(/\[PROPERTY_ADDRESS\]/g, unit.address || "N/A")
    : ""

  const handleDownloadPDF = async () => {
    if (!contractRef.current || !unit) return

    try {
      toast({
        title: "Generating Contract PDF...",
        description: "Please wait while we generate your contract",
      })

      const canvas = await html2canvas(contractRef.current, {
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

      const tenantName = unit.contract?.user.fullName.replace(/\s+/g, "_") || "tenant"
      const fileName = `contract_${tenantName}_${format(new Date(), "yyyyMMdd")}.pdf`
      pdf.save(fileName)

      toast({
        title: "Contract Generated",
        description: "Contract has been downloaded successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate contract. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!unit) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lease Agreement - {unit.contract?.user.fullName || "N/A"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Contract Content - This will be exported as PDF */}
          <div ref={contractRef} className="border rounded-lg p-8 bg-white">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">RESIDENTIAL LEASE AGREEMENT</h2>
                <p className="text-gray-500 text-sm mt-2">Property Manager</p>
              </div>

              {/* Contract Content */}
              <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line font-serif">
                {contractContent}
              </div>

              {/* Signature Section */}
              <div className="border-t pt-6 mt-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Landlord Signature:</p>
                    <div className="border-b border-gray-400 h-10"></div>
                    <p className="text-xs text-gray-500 mt-2">Property Manager</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Tenant Signature:</p>
                    <div className="border-b border-gray-400 h-10"></div>
                    <p className="text-xs text-gray-500 mt-2">{unit.contract?.user.fullName || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-400 border-t pt-4 mt-6">
                <p>Generated on {format(new Date(), "MMMM dd, yyyy 'at' HH:mm")}</p>
                <p className="mt-1">Contract ID: {unit.id}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Contract
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RoomContractDialog
