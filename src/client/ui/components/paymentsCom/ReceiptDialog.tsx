import { format } from "date-fns"
import { Download, Send } from "lucide-react"

import { usePaymentStore } from "@core/application/libs/store/payments.store"

import { Button } from "../Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../Dialog"
import { useToast } from "../hooks/useToast"

const ReceiptDialog = () => {
  const { isReceiptOpen, setIsReceiptOpen, selectedPayment } = usePaymentStore()
  const { toast } = useToast()

  const typeConfig = {
    rent: "Rent",
    utilities: "Utilities",
    deposit: "Deposit",
    maintenance: "Maintenance",
    addon: "Addon",
  }

  const handleDownloadReceipt = () => {
    toast({
      title: "Receipt Generated",
      description: "Receipt has been downloaded successfully",
    })
    setIsReceiptOpen(false)
  }

  const handleSendReceipt = () => {
    toast({
      title: "Receipt Sent",
      description: `Receipt has been sent to ${selectedPayment?.tenantName}`,
    })
    setIsReceiptOpen(false)
  }
  return (
    <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Generate Receipt</DialogTitle>
        </DialogHeader>
        {selectedPayment && (
          <div className="space-y-4">
            <div className="bg-muted/20 rounded-lg border p-4">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-bold">Property Manager</h3>
                <p className="text-muted-foreground text-sm">Payment Receipt</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tenant:</span>
                  <span className="font-medium">{selectedPayment.tenantName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unit:</span>
                  <span className="font-medium">{selectedPayment.unitNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium">{typeConfig[selectedPayment.type]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">${selectedPayment.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{format(selectedPayment.dueDate, "MMM dd, yyyy")}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsReceiptOpen(false)}>
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
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ReceiptDialog
