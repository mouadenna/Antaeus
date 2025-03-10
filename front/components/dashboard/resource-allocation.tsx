"use client"

import { Button } from "@/components/ui/button"
import { DashboardCard } from "./dashboard-card"
import { ResourceProgress } from "./resource-progress"

interface ResourceItem {
  label: string
  available: number
  allocated: number
  unit: string
}

interface ResourceAllocationProps {
  resources: {
    [key: string]: ResourceItem
  }
  onViewDetails?: () => void
  onRequestSupplies?: () => void
}

export function ResourceAllocation({ resources, onViewDetails, onRequestSupplies }: ResourceAllocationProps) {
  return (
    <DashboardCard
      title="Resource Allocation"
      description="Current inventory and distribution"
      footer={
        <div className="flex justify-between">
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              View Details
            </Button>
          )}
          {onRequestSupplies && (
            <Button size="sm" onClick={onRequestSupplies}>
              Request Supplies
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {Object.values(resources).map((resource, index) => (
          <ResourceProgress
            key={index}
            label={resource.label}
            available={resource.available}
            allocated={resource.allocated}
            unit={resource.unit}
          />
        ))}
      </div>
    </DashboardCard>
  )
}

