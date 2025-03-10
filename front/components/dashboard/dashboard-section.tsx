"use client"

import type { ReactNode } from "react"

interface DashboardSectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function DashboardSection({ title, description, children, className = "" }: DashboardSectionProps) {
  return (
    <div className={`mb-8 ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          {description && <p className="text-gray-500">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

