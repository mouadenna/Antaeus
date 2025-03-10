"use client"

import type { ReactNode } from "react"
import { RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  currentDisaster: string | null
  lastUpdated: string
  timeRange?: string
  onTimeRangeChange?: (value: string) => void
  onRefresh?: () => void
  actions?: ReactNode
}

export function DashboardHeader({
  title,
  subtitle,
  currentDisaster,
  lastUpdated,
  timeRange,
  onTimeRangeChange,
  onRefresh,
  actions,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-500">
          {currentDisaster
            ? `Active Response: ${currentDisaster} • Last updated: ${lastUpdated}`
            : subtitle || `Overview • Last updated: ${lastUpdated}`}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
        {timeRange && onTimeRangeChange && (
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
        )}

        {onRefresh && (
          <Button variant="outline" onClick={onRefresh} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        )}

        {currentDisaster && (
          <Button variant="destructive" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Emergency Mode
          </Button>
        )}

        {actions}
      </div>
    </div>
  )
}

