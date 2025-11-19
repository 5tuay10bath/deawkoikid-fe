import { format } from "date-fns"
import { Download, Edit } from "lucide-react"
import { useRef } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../common/Dialog"
import { useContractStore } from "@infrastructure/libs/store/contracts.store"
import { useToast } from "../hooks/useToast"

const ViewDialog = () => {
  const { isViewOpen, setIsViewOpen, selectedContract, template } = useContractStore()
  const { toast } = useToast()
  const contractRef = useRef<HTMLDivElement>(null)

  const dateFormat = "MMMM dd, yyyy"

  const contractContent = selectedContract
    ? template.content
        .replace(/\[TENANT_NAME\]/g, selectedContract.user.fullName)
        .replace(/\[UNIT_NUMBER\]/g, selectedContract.unit.unitNumber)
        .replace(/\[START_DATE\]/g, format(selectedContract.startDate, dateFormat))
        .replace(/\[END_DATE\]/g, format(selectedContract.endDate, dateFormat))
        .replace(/\[RENT_AMOUNT\]/g, selectedContract.rentAmount.toString())
        .replace(/\[SECURITY_DEPOSIT\]/g, selectedContract.rentAmount.toString())
        .replace(/\[DATE\]/g, format(new Date(), dateFormat))
        .replace(/\[PROPERTY_ADDRESS\]/g, selectedContract.unit.address)
    : ""

  const handleDownloadPDF = async () => {
    if (!contractRef.current || !selectedContract) return

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

      const fileName = `contract_${selectedContract.user.fullName.replace(/\s+/g, "_")}_${format(new Date(), "yyyyMMdd")}.pdf`
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

  return (
    <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lease Agreement - {selectedContract?.user.fullName}</DialogTitle>
        </DialogHeader>
        {selectedContract && (
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
                      <p className="text-xs text-gray-500 mt-2">{selectedContract.user.fullName}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-400 border-t pt-4 mt-6">
                  <p>Generated on {format(new Date(), "MMMM dd, yyyy 'at' HH:mm")}</p>
                  <p className="mt-1">Contract ID: {selectedContract.id}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>
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
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ViewDialog
