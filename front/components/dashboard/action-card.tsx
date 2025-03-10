"use client"

import type { ReactNode } from "react"
import { DashboardCard } from "./dashboard-card"
import { Badge } from "@/components/ui/badge"

interface ActionCardProps {
  icon: ReactNode
  title: string
  badgeCount?: number
  badgeVariant?: "default" | "destructive"
  onClick: () => void
}

export function ActionCard({ icon, title, badgeCount, badgeVariant = "default", onClick }: ActionCardProps) {
  return (
    <DashboardCard onClick={onClick}>
      <div className="p-4 flex flex-col items-center justify-center text-center">
        <div className="mb-2">{icon}</div>
        <h3 className="font-medium">{title}</h3>
        {badgeCount !== undefined && (
          <Badge className="mt-1" variant={badgeVariant}>
            {badgeCount}
          </Badge>
        )}
      </div>
    </DashboardCard>
  )
}

