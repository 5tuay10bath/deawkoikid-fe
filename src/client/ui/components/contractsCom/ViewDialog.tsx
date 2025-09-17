import { format } from "date-fns"
import { Download, Edit} from "lucide-react"
import { Button } from "../Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle} from "../Dialog"
import { useContractStore } from "@infrastructure/libs/store/contracts.store"

const ViewDialog = () => {
    const { isViewOpen, setIsViewOpen, selectedContract, template } = useContractStore()
  return (
    <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lease Agreement - {selectedContract?.tenantName}</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-4">
              <div className="border rounded-lg p-6 bg-muted/20 font-mono text-sm whitespace-pre-line">
                {template.content
                  .replace(/\[TENANT_NAME\]/g, selectedContract.tenantName)
                  .replace(/\[UNIT_NUMBER\]/g, selectedContract.unitNumber)
                  .replace(/\[START_DATE\]/g, format(selectedContract.startDate, "MMMM dd, yyyy"))
                  .replace(/\[END_DATE\]/g, format(selectedContract.endDate, "MMMM dd, yyyy"))
                  .replace(/\[RENT_AMOUNT\]/g, selectedContract.rentAmount.toString())
                  .replace(/\[SECURITY_DEPOSIT\]/g, selectedContract.rentAmount.toString())
                  .replace(/\[DATE\]/g, format(new Date(), "MMMM dd, yyyy"))
                  .replace(/\[PROPERTY_ADDRESS\]/g, "123 Main Street, City, State 12345")
                }
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                  Close
                </Button>
                <Button variant="outline">
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