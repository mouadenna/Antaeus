"use client"

import type { ReactNode } from "react"
import { StatCard } from "./stat-card"

interface StatItem {
  label: string
  value: string | number
  icon?: ReactNode
  color?: string
  onClick?: () => void
}

interface StatsSummaryProps {
  stats: StatItem[]
  columns?: 2 | 3 | 4 | 6
}

export function StatsSummary({ stats, columns = 6 }: StatsSummaryProps) {
  const colsClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-2 md:grid-cols-3"
        : columns === 4
          ? "grid-cols-2 md:grid-cols-4"
          : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"

  return (
    <div className={`grid ${colsClass} gap-4 mb-6`}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          onClick={stat.onClick}
        />
      ))}
    </div>
  )
}

