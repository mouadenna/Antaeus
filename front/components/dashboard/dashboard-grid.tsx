"use client"

import type { ReactNode } from "react"

interface DashboardGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function DashboardGrid({ children, columns = 2, className = "" }: DashboardGridProps) {
  const colsClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 md:grid-cols-2"
        : columns === 3
          ? "grid-cols-1 md:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

  return <div className={`grid ${colsClass} gap-6 mb-6 ${className}`}>{children}</div>
}

