import React from "react"
import DialogBuildings from "../components/buildingsCom/Dialog"

export default function Buildings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Building Management</h1>
        </div>
        <DialogBuildings />
      </div>
    </div>
  )
}
