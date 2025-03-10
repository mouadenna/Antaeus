"use client"

import { useState } from "react"
import MapComponent from "./map-component"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { floodMarkers, fireMarkers, earthquakeMarkers, hurricaneMarkers } from "@/data/map-data"

export default function MapDemo() {
  const [activeTab, setActiveTab] = useState("flood")

  // Get active markers based on selected tab
  const getActiveMarkers = () => {
    switch (activeTab) {
      case "flood":
        return floodMarkers
      case "fire":
        return fireMarkers
      case "earthquake":
        return earthquakeMarkers
      case "hurricane":
        return hurricaneMarkers
      default:
        return floodMarkers
    }
  }

  // Get current disaster name
  const getCurrentDisaster = () => {
    switch (activeTab) {
      case "flood":
        return "Flood"
      case "fire":
        return "Fire"
      case "earthquake":
        return "Earthquake"
      case "hurricane":
        return "Hurricane"
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Disaster Response Map</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-4 w-full md:w-[500px]">
              <TabsTrigger value="flood">Flood</TabsTrigger>
              <TabsTrigger value="fire">Fire</TabsTrigger>
              <TabsTrigger value="earthquake">Earthquake</TabsTrigger>
              <TabsTrigger value="hurricane">Hurricane</TabsTrigger>
            </TabsList>
          </Tabs>

          <p className="mb-4 text-gray-600">
            This interactive map shows {getCurrentDisaster()} response information including danger zones, shelters,
            evacuation routes, and resource distribution points. Click on markers for more details.
          </p>

          <MapComponent
            markers={getActiveMarkers()}
            currentDisaster={getCurrentDisaster()}
            onMarkerClick={(marker) => console.log("Marker clicked:", marker)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

