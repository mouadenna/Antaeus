"use client"

import type { ReactNode } from "react"
import { ActionCard } from "./action-card"

interface QuickAction {
  icon: ReactNode
  title: string
  badgeCount?: number
  badgeVariant?: "default" | "destructive"
  onClick: () => void
}

interface QuickActionsGridProps {
  actions: QuickAction[]
  title?: string
  columns?: 2 | 3 | 4
}

export function QuickActionsGrid({ actions, title, columns = 4 }: QuickActionsGridProps) {
  const colsClass =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : "grid-cols-2 md:grid-cols-4"

  return (
    <div className="mb-6">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      <div className={`grid ${colsClass} gap-4`}>
        {actions.map((action, index) => (
          <ActionCard
            key={index}
            icon={action.icon}
            title={action.title}
            badgeCount={action.badgeCount}
            badgeVariant={action.badgeVariant}
            onClick={action.onClick}
          />
        ))}
      </div>
    </div>
  )
}

