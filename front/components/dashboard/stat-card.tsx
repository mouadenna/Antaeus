"use client"

import type { ReactNode } from "react"
import { DashboardCard } from "./dashboard-card"

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  color?: string
  onClick?: () => void
}

export function StatCard({ label, value, icon, color = "text-blue-600", onClick }: StatCardProps) {
  return (
    <DashboardCard onClick={onClick}>
      <div className="flex flex-col items-center justify-center text-center">
        {icon && <div className={`h-8 w-8 mb-2 ${color}`}>{icon}</div>}
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
      </div>
    </DashboardCard>
  )
}

