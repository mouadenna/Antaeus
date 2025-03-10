import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"

interface WeatherAlertItemProps {
  icon: ReactNode
  type: string
  severity: string
  details: string
  expires: string
}

export function WeatherAlertItem({ icon, type, severity, details, expires }: WeatherAlertItemProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "advisory":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="flex items-start gap-3">
      <div
        className={`p-2 rounded-full ${
          type.toLowerCase().includes("rain")
            ? "bg-blue-100"
            : type.toLowerCase().includes("wind")
              ? "bg-teal-100"
              : "bg-amber-100"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-medium">{type}</h4>
          <Badge className={getSeverityColor(severity)}>{severity}</Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">{details}</p>
        <p className="text-xs text-gray-500 mt-1">Expires in: {expires}</p>
      </div>
    </div>
  )
}

