import type { ReactNode } from "react"

interface TimelineItemProps {
  icon: ReactNode
  title: string
  time: string
  isLast?: boolean
}

export function TimelineItem({ icon, title, time, isLast = false }: TimelineItemProps) {
  return (
    <div className="flex gap-3">
      <div className="w-10 flex flex-col items-center">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">{icon}</div>
        {!isLast && <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>}
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  )
}

