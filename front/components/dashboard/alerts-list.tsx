"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { DashboardCard } from "./dashboard-card"
import { AlertItem } from "./alert-item"
import { CheckCircle2 } from "lucide-react"

interface Alert {
  id: number | string
  type: string
  location: string
  severity: string
  time: string
  reportMethod?: "voice" | "text"
  icon?: ReactNode
}

interface AlertsListProps {
  title: string
  alerts: Alert[]
  emptyStateTitle?: string
  emptyStateMessage?: string
  emptyStateIcon?: ReactNode
  onViewAll?: () => void
  onViewDetails?: (alertId: number | string) => void
}

export function AlertsList({
  title,
  alerts,
  emptyStateTitle = "No Active Alerts",
  emptyStateMessage = "You're all caught up!",
  emptyStateIcon = <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />,
  onViewAll,
  onViewDetails,
}: AlertsListProps) {
  return (
    <DashboardCard
      title={title}
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
            <AlertItem
              key={alert.id}
              icon={alert.icon}
              title={alert.type}
              location={alert.location}
              severity={alert.severity}
              time={alert.time}
              reportMethod={alert.reportMethod as "voice" | "text"}
              onViewDetails={() => onViewDetails && onViewDetails(alert.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          {emptyStateIcon}
          <h4 className="font-medium">{emptyStateTitle}</h4>
          <p className="text-sm text-gray-500">{emptyStateMessage}</p>
        </div>
      )}
    </DashboardCard>
  )
}

