"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardCardProps {
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
  onClick?: () => void
}

export function DashboardCard({ title, description, children, footer, className = "", onClick }: DashboardCardProps) {
  return (
    <Card
      className={`${className} ${onClick ? "hover:shadow-md transition-shadow cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {(title || description) && (
        <CardHeader className={`${description ? "pb-2" : ""}`}>
          {title && <CardTitle className={`${description ? "text-lg" : ""}`}>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={`${!title && !description ? "pt-6" : ""}`}>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}

