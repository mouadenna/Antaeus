"use client"

import { AlertTriangle, MapPin, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface DisasterFeature {
  id?: string
  properties: {
    name: string
    disasterType: string
    severity: string
    description: string
  }
  geometry: {
    type: string
    coordinates: number[][][]
  }
}

interface ActiveDisastersProps {
  disasters: DisasterFeature[]
  onViewMap: () => void
}

export default function ActiveDisasters({ disasters, onViewMap }: ActiveDisastersProps) {
  if (!disasters || disasters.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Info className="h-4 w-4 mr-2 text-blue-500" />
            Disaster Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No active disasters reported at this time.</p>
        </CardContent>
      </Card>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDisasterIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "flood":
        return <AlertTriangle className="h-5 w-5 text-blue-600" />
      case "fire":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "earthquake":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      case "hurricane":
        return <AlertTriangle className="h-5 w-5 text-purple-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const getDisasterColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "flood":
        return "border-blue-200 bg-blue-50"
      case "fire":
        return "border-red-200 bg-red-50"
      case "earthquake":
        return "border-amber-200 bg-amber-50"
      case "hurricane":
        return "border-purple-200 bg-purple-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
          Active Disasters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {disasters.map((disaster, index) => (
          <div key={index} className={`p-3 rounded-lg border ${getDisasterColor(disaster.properties.disasterType)}`}>
            <div className="flex items-start gap-2">
              {getDisasterIcon(disaster.properties.disasterType)}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm">{disaster.properties.name}</h3>
                  <Badge className={getSeverityColor(disaster.properties.severity)}>
                    {disaster.properties.severity}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">{disaster.properties.description}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>Affected area shown on map</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <Button size="sm" onClick={onViewMap} className="w-full mt-2">
          View on Map
        </Button>
      </CardContent>
    </Card>
  )
}

