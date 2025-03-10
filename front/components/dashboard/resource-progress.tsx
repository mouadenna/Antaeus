import { Progress } from "@/components/ui/progress"

interface ResourceProgressProps {
  label: string
  available: number
  allocated: number
  unit: string
}

export function ResourceProgress({ label, available, allocated, unit }: ResourceProgressProps) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-gray-500">
          {allocated} / {available} {unit}
        </span>
      </div>
      <Progress value={(allocated / available) * 100} className="h-2" />
    </div>
  )
}

