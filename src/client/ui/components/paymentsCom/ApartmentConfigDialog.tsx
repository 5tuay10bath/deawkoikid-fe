import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../common/Dialog"
import { Button } from "../common/Button"
import { Plus } from "lucide-react"
import { Label } from "../common/Label"
import { Input } from "../common/Input"

import { useToast } from "../hooks/useToast"
import { usePaymentStore } from "@infrastructure/libs/store/payments.store"

const NewApartmentConfigDialog = () => {
  const {
    isNewApartmentConfigOpen,
    setisNewApartmentConfigOpen,
    newApartmentConfig,
    updateNewApartmentConfig,
    resetNewApartmentConfig,
  } = usePaymentStore()
  const { toast } = useToast()
  const handleNewApartmentConfig = () => {
    if (
      !newApartmentConfig.electricpriceperunit ||
      !newApartmentConfig.waterpriceperunit ||
      !newApartmentConfig.commonFee ||
      !newApartmentConfig.internetprice
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "Apartment Config Created",
      description: `Config has been created`,
    })
    setisNewApartmentConfigOpen(false)
    resetNewApartmentConfig()
  }

  return (
    <Dialog open={isNewApartmentConfigOpen} onOpenChange={setisNewApartmentConfigOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Config
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create Apartment Config</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Electric Price Per Unit</Label>
              <Input
                type="number"
                onChange={(e) => {
                  const n = e.currentTarget.valueAsNumber
                  updateNewApartmentConfig({ electricpriceperunit: Number.isNaN(n) ? 0 : n })
                }}
                placeholder="Electric Usage"
              />
            </div>
            <div className="space-y-2">
              <Label>Water Usage</Label>
              <Input
                type="number"
                onChange={(e) => {
                  const n = e.currentTarget.valueAsNumber
                  updateNewApartmentConfig({ waterpriceperunit: Number.isNaN(n) ? 0 : n })
                }}
                placeholder="Water Usage"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Common Fee</Label>
              <Input
                type="number"
                onChange={(e) => {
                  const n = e.currentTarget.valueAsNumber
                  updateNewApartmentConfig({ commonFee: Number.isNaN(n) ? 0 : n })
                }}
                placeholder="Electric Usage"
              />
            </div>
            <div className="space-y-2">
              <Label>Water Usage</Label>
              <Input
                type="number"
                onChange={(e) => {
                  const n = e.currentTarget.valueAsNumber
                  updateNewApartmentConfig({ internetprice: Number.isNaN(n) ? 0 : n })
                }}
                placeholder="Water Usage"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setisNewApartmentConfigOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleNewApartmentConfig}>Create Config</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default NewApartmentConfigDialog
