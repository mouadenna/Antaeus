"use client"

import { Button } from "@/components/ui/button"
import MapComponent from "../map-component"
import type { MapMarker } from "../map-component"

interface MapPreviewProps {
  markers: MapMarker[]
  currentDisaster: string | null
  onMarkerClick: (marker: MapMarker) => void
  onOpenFullMap: () => void
}

export function MapPreview({ markers, currentDisaster, onMarkerClick, onOpenFullMap }: MapPreviewProps) {
  return (
    <div className="h-full w-full border rounded-lg overflow-hidden bg-gray-50">
      <div className="h-full w-full relative">
        <div className="absolute top-4 left-4 right-4 z-10 bg-white/90 rounded-lg p-2 shadow-md">
          <h3 className="font-medium">Interactive Map</h3>
          <p className="text-sm text-gray-600">
            {markers.length > 0
              ? `Showing ${markers.length} locations related to your conversation`
              : "Ask about shelters, evacuation routes, or report an incident to see them on the map"}
          </p>
        </div>

        <MapComponent
          markers={markers}
          currentDisaster={currentDisaster}
          compact={true}
          onMarkerClick={onMarkerClick}
        />

        <div className="absolute bottom-4 right-4">
          <Button size="sm" onClick={onOpenFullMap} className="bg-white text-gray-800 hover:bg-gray-100 shadow-md">
            Open Full Map
          </Button>
        </div>
      </div>
    </div>
  )
}

