import type React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "../components/hooks/useToast"
import { Button } from "../components/common/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/card"
import { Label } from "../components/common/Label"
import { Input } from "../components/common/Input"
import { Popover, PopoverContent, PopoverTrigger } from "../components/common/Popover"
import { Calendar } from "../components/common/Calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/common/Select"
import { useCheckInStore } from "@infrastructure/libs/store/checkIn.store"

export default function CheckIn() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const { formData, setFormField, resetFormData } = useCheckInStore()

  const handleInputChange = (field: string, value: string | Date) => {
    setFormField(field as keyof typeof formData, value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.tenantName || !formData.email || !formData.checkOutDate || !formData.rentAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: `Room ${roomId} has been assigned to ${formData.tenantName}`,
    })

    resetFormData()
    navigate("/dashboard")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Check In - Room {roomId}</h1>
          <p className="text-muted-foreground">Enter tenant information and lease details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenant Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenantName">Full Name *</Label>
                <Input
                  id="tenantName"
                  data-cy="tenant-name"
                  value={formData.tenantName}
                  onChange={(e) => handleInputChange("tenantName", e.target.value)}
                  placeholder="Enter tenant's full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  data-cy="tenant-email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="tenant@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  data-cy="tenant-phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  data-cy="emergency-contact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  placeholder="Emergency contact name"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Lease Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check-in Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        data-cy="check-in-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.checkInDate ? format(formData.checkInDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.checkInDate}
                        onSelect={(date) => date && handleInputChange("checkInDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Check-out Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        data-cy="check-out-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.checkOutDate ? format(formData.checkOutDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.checkOutDate}
                        onSelect={(date) => date && handleInputChange("checkOutDate", date)}
                        disabled={!formData.checkInDate}
                        min={formData.checkInDate ? format(formData.checkInDate, "yyyy-MM-dd") : undefined}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rentAmount">Rent Amount *</Label>
                  <Input
                    id="rentAmount"
                    type="number"
                    data-cy="rent-amount"
                    value={formData.rentAmount}
                    onChange={(e) => handleInputChange("rentAmount", e.target.value)}
                    placeholder="1200"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Billing Cycle *</Label>
                  <Select
                    value={formData.billingCycle}
                    onValueChange={(value) => handleInputChange("billingCycle", value)}
                  >
                    <SelectTrigger data-cy="billing-cycle">
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="securityDeposit">Security Deposit</Label>
                  <Input
                    id="securityDeposit"
                    type="number"
                    data-cy="security-deposit"
                    value={formData.securityDeposit}
                    onChange={(e) => handleInputChange("securityDeposit", e.target.value)}
                    placeholder="1200"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetFormData()
                  navigate("/dashboard")
                }}
              >
                Cancel
              </Button>
              <Button type="submit" data-cy="complete-check-in">
                Complete Check-in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
