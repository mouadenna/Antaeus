"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardCard } from "./dashboard-card"

interface EmergencyBannerProps {
  disasterType: string
  onGetHelpClick?: () => void
}

export function EmergencyBanner({ disasterType, onGetHelpClick }: EmergencyBannerProps) {
  return (
    <DashboardCard className="mb-6 border-red-300 bg-red-50">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-bold text-red-700">{disasterType} Emergency Active</h3>
          <p className="text-red-600">Stay safe and follow official instructions</p>
        </div>
        {onGetHelpClick && (
          <Button variant="destructive" className="ml-auto" size="sm" onClick={onGetHelpClick}>
            Get Help
          </Button>
        )}
      </div>
    </DashboardCard>
  )
}

