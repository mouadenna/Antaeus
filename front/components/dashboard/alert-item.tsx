"use client"

import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AlertItemProps {
  icon: ReactNode
  title: string
  location: string
  severity: string
  time: string
  reportMethod?: "voice" | "text"
  onViewDetails?: () => void
}

export function AlertItem({ icon, title, location, severity, time, reportMethod, onViewDetails }: AlertItemProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="flex items-start gap-3">
      <div
        className={`p-2 rounded-full ${
          title.toLowerCase().includes("flood")
            ? "bg-blue-100"
            : title.toLowerCase().includes("fire")
              ? "bg-red-100"
              : title.toLowerCase().includes("building")
                ? "bg-orange-100"
                : title.toLowerCase().includes("medical")
                  ? "bg-green-100"
                  : "bg-gray-100"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
          <div className="flex items-center gap-2">
            {reportMethod === "voice" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-600"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" x2="12" y1="19" y2="22"></line>
              </svg>
            )}
            <Badge className={getSeverityColor(severity)}>{severity}</Badge>
          </div>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {time}
          </span>
          {onViewDetails && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={onViewDetails}>
              Details
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

