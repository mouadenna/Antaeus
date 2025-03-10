"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { DashboardCard } from "./dashboard-card"
import { WeatherAlertItem } from "./weather-alert-item"
import { CheckCircle2 } from "lucide-react"

interface WeatherAlert {
  id: number | string
  type: string
  severity: string
  details: string
  expires: string
  icon?: ReactNode
}

interface WeatherAlertsListProps {
  alerts: WeatherAlert[]
  onViewAll?: () => void
}

export function WeatherAlertsList({ alerts, onViewAll }: WeatherAlertsListProps) {
  return (
    <DashboardCard
      title="Weather Alerts"
      footer={
        onViewAll && (
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={onViewAll}>
            View All
          </Button>
        )
      }
    >
      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <WeatherAlertItem
              key={alert.id}
              icon={alert.icon}
              type={alert.type}
              severity={alert.severity}
              details={alert.details}
              expires={alert.expires}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
          <h4 className="font-medium">No Active Weather Alerts</h4>
          <p className="text-sm text-gray-500">The weather conditions are currently stable</p>
        </div>
      )}
    </DashboardCard>
  )
}

