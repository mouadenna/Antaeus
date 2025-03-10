"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardCard } from "./dashboard-card"
import { Home, ShieldAlert, Bell } from "lucide-react"

interface NearbyResource {
  id: number | string
  name: string
  distance: string
  type: "shelter" | "medical" | "supplies"
  status: string
}

interface NearbyResourcesListProps {
  resources: NearbyResource[]
  onFindMore?: () => void
}

export function NearbyResourcesList({ resources, onFindMore }: NearbyResourcesListProps) {
  const getResourceIcon = (type: string): ReactNode => {
    switch (type) {
      case "shelter":
        return <Home className="h-5 w-5 text-blue-600" />
      case "medical":
        return <ShieldAlert className="h-5 w-5 text-green-600" />
      default:
        return <Bell className="h-5 w-5 text-purple-600" />
    }
  }

  return (
    <DashboardCard
      title="Nearby Resources"
      description="Available shelters and services near you"
      footer={
        onFindMore && (
          <Button variant="outline" className="w-full" onClick={onFindMore}>
            Find More Resources
          </Button>
        )
      }
    >
      <div className="space-y-4">
        {resources.map((resource) => (
          <div key={resource.id} className="flex items-start gap-3">
            <div
              className={`p-2 rounded-full ${
                resource.type === "shelter"
                  ? "bg-blue-100"
                  : resource.type === "medical"
                    ? "bg-green-100"
                    : "bg-purple-100"
              }`}
            >
              {getResourceIcon(resource.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{resource.name}</h4>
                  <p className="text-sm text-gray-500">{resource.distance} away</p>
                </div>
                <Badge
                  className={
                    resource.status === "Open" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {resource.status}
                </Badge>
              </div>
              <div className="flex justify-end mt-2">
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

