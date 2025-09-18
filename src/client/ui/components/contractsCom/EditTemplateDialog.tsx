import { FileText } from "lucide-react"
import { Button } from "../common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { useContractStore } from "@infrastructure/libs/store/contracts.store"
import { Label } from "../common/Label"
import { Input } from "../common/Input"
import { Textarea } from "../common/TextArea"

const EditTemplateDialog = () => {
  const { isTemplateOpen, setIsTemplateOpen, template, updateTemplate } = useContractStore()
  return (
    <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Edit Template
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contract Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Template Name</Label>
            <Input
              value={template.name}
              onChange={(e) => updateTemplate({ name: e.target.value })}
              placeholder="Standard Lease Agreement"
            />
          </div>
          <div className="space-y-2">
            <Label>Contract Content</Label>
            <Textarea
              value={template.content}
              onChange={(e) => updateTemplate({ content: e.target.value })}
              className="min-h-[400px] font-mono text-sm"
              placeholder="Enter contract template..."
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              Available placeholders: [TENANT_NAME], [UNIT_NUMBER], [START_DATE], [END_DATE], [RENT_AMOUNT],
              [SECURITY_DEPOSIT], [DATE], [PROPERTY_ADDRESS]
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsTemplateOpen(false)}>
              Cancel
            </Button>
            <Button>Save Template</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditTemplateDialog
