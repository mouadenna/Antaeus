"use client"

import type { ReactNode } from "react"
import { DashboardCard } from "./dashboard-card"
import { TimelineItem } from "./timeline-item"

interface TimelineEvent {
  id: number | string
  title: string
  time: string
  icon: ReactNode
}

interface TimelineListProps {
  title: string
  events: TimelineEvent[]
}

export function TimelineList({ title, events }: TimelineListProps) {
  return (
    <DashboardCard title={title}>
      <div className="space-y-3">
        {events.map((event, index) => (
          <TimelineItem
            key={event.id}
            icon={event.icon}
            title={event.title}
            time={event.time}
            isLast={index === events.length - 1}
          />
        ))}
      </div>
    </DashboardCard>
  )
}

