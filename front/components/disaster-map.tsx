"use client"

import { useState } from "react"
import { Search, Navigation2, Plus, Minus, AlertTriangle, Tent, Truck, Users, MapPin, Mic } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface MapMarker {
  id: number
  type: string
  coordinates: number[]
  title: string
  capacity?: number
  status?: string
  severity?: string
  reportTime?: string
  details?: string
}

interface DisasterMapProps {
  markers: MapMarker[]
  currentDisaster: string | null
}

export default function DisasterMap({ markers, currentDisaster }: DisasterMapProps) {
  const [center, setCenter] = useState([40.7128, -74.006]) // NYC coordinates
  const [zoom, setZoom] = useState(13)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [mapLayers, setMapLayers] = useState({
    shelters: true,
    dangerZones: true,
    evacuationRoutes: true,
    resources: true,
    teams: true,
    voiceReports: true,
  })
  const [reportingMode, setReportingMode] = useState(false)
  const [reportType, setReportType] = useState("")
  const [showVoiceReportModal, setShowVoiceReportModal] = useState(false)

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const toggleLayer = (layer: keyof typeof mapLayers) => {
    setMapLayers({
      ...mapLayers,
      [layer]: !mapLayers[layer],
    })
  }

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker)
  }

  const closeMarkerInfo = () => {
    setSelectedMarker(null)
  }

  const toggleReportingMode = () => {
    setReportingMode(!reportingMode)
    if (reportingMode) {
      setReportType("")
    }
  }

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "shelter":
        return <Tent className="h-6 w-6 text-green-600" />
      case "danger":
        return <AlertTriangle className="h-6 w-6 text-red-600" />
      case "evacuation":
        return <Navigation2 className="h-6 w-6 text-blue-600" />
      case "resource":
        return <Truck className="h-6 w-6 text-purple-600" />
      case "team":
        return <Users className="h-6 w-6 text-orange-600" />
      case "voice-report":
        return <Mic className="h-6 w-6 text-indigo-600" />
      default:
        return <MapPin className="h-6 w-6 text-gray-600" />
    }
  }

  const getDisasterSpecificControls = () => {
    if (!currentDisaster) return null

    switch (currentDisaster) {
      case "Flood":
        return (
          <div className="flex flex-col gap-2 mt-4">
            <h3 className="font-semibold">Flood Controls</h3>
            <Button variant="outline" size="sm" className="justify-start">
              <span className="w-4 h-4 mr-2 bg-blue-300 rounded-sm"></span>
              Show Water Levels
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <span className="w-4 h-4 mr-2 bg-blue-700 rounded-sm"></span>
              Show Flood Forecast
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <span className="w-4 h-4 mr-2 bg-green-500 rounded-sm"></span>
              Show High Ground
            </Button>
          </div>
        )
      case "Fire":
        return (
          <div className="flex flex-col gap-2 mt-4">
            <h3 className="font-semibold">Fire Controls</h3>
            <Button variant="outline" size="sm" className="justify-start">
              <span className="w-4 h-4 mr-2 bg-red-500 rounded-sm"></span>
              Show Active Fires
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <span className="w-4 h-4 mr-2 bg-orange-300 rounded-sm"></span>
              Show Wind Direction
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <span className="w-4 h-4 mr-2 bg-yellow-500 rounded-sm"></span>
              Show Fire Spread Prediction
            </Button>
          </div>
        )
      case "Earthquake":
        return (
          <div className="flex flex-col gap-2 mt-4">
            <h3 className="font-semibold">Earthquake Controls</h3>
            <Button variant="outline" size="sm" className="justify-start">
              <span className="w-4 h-4 mr-2 bg-red-500 rounded-sm"></span>
              Show Damage Assessment
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <span className="w-4 h-4 mr-2 bg-yellow-500 rounded-sm"></span>
              Show Aftershock Risk
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <span className="w-4 h-4 mr-2 bg-purple-500 rounded-sm"></span>
              Show Building Integrity
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full h-[calc(100vh-200px)] max-w-6xl mx-auto relative overflow-hidden rounded-lg bg-white shadow-lg">
      {/* Search bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
        <div className="bg-white rounded-lg shadow-lg flex items-center p-2 flex-grow">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <Input
            type="text"
            placeholder="Search locations..."
            className="w-full outline-none bg-transparent border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="shadow-lg" onClick={() => setShowVoiceReportModal(true)}>
          <Mic className="h-4 w-4 mr-2" />
          Voice Report
        </Button>
        <Button variant={reportingMode ? "destructive" : "default"} className="shadow-lg" onClick={toggleReportingMode}>
          {reportingMode ? "Cancel Report" : "Report Incident"}
        </Button>
      </div>

      {/* Map placeholder - in a real implementation, you would use the actual Map component */}
      <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
        {currentDisaster && (
          <div className="absolute top-16 left-0 right-0 bg-yellow-100 border-y border-yellow-300 py-2 px-4 text-center">
            <AlertTriangle className="inline-block mr-2 h-5 w-5 text-yellow-600" />
            <span className="font-semibold">{currentDisaster} Response Active</span> - Showing relevant information on
            the map
          </div>
        )}

        {reportingMode && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Report Incident</CardTitle>
                <CardDescription>Please provide details about the incident you're reporting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Incident Type</label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flood">Flood</SelectItem>
                        <SelectItem value="fire">Fire</SelectItem>
                        <SelectItem value="building-collapse">Building Collapse</SelectItem>
                        <SelectItem value="medical">Medical Emergency</SelectItem>
                        <SelectItem value="road-blockage">Road Blockage</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Severity</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - No immediate danger</SelectItem>
                        <SelectItem value="medium">Medium - Potential risk</SelectItem>
                        <SelectItem value="high">High - Immediate attention needed</SelectItem>
                        <SelectItem value="critical">Critical - Life-threatening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      placeholder="Describe the incident in detail..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Select on map or enter address" className="flex-grow" />
                      <Button variant="outline" size="icon" onClick={handleLocationClick}>
                        <Navigation2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Click on the map to set the exact location</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="flex-1">
                      <Mic className="h-4 w-4 mr-2" />
                      Record Audio
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Photo
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={toggleReportingMode}>
                  Cancel
                </Button>
                <Button>Submit Report</Button>
              </CardFooter>
            </Card>
          </div>
        )}

        <p className="text-gray-600 text-center">Interactive disaster response map would render here</p>

        {/* Visualization of markers */}
        <div className="absolute inset-0 pointer-events-none">
          {markers.map((marker) => (
            <div
              key={marker.id}
              className="absolute p-2 rounded-full bg-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${30 + Math.random() * 40}%`,
              }}
              onClick={() => handleMarkerClick(marker)}
            >
              {getMarkerIcon(marker.type)}
            </div>
          ))}
        </div>

        {/* Selected marker info */}
        {selectedMarker && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {getMarkerIcon(selectedMarker.type)}
                <h3 className="font-bold">{selectedMarker.title}</h3>
              </div>
              <button onClick={closeMarkerInfo} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="mt-2">
              {selectedMarker.type === "shelter" && (
                <div>
                  <p className="text-sm text-gray-600">Capacity: {selectedMarker.capacity} people</p>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span className={selectedMarker.status === "Open" ? "text-green-600" : "text-yellow-600"}>
                      {selectedMarker.status}
                    </span>
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline">
                      Get Directions
                    </Button>
                    <Button size="sm">Check In</Button>
                  </div>
                </div>
              )}

              {selectedMarker.type === "danger" && (
                <div>
                  {selectedMarker.severity && (
                    <Badge
                      className={
                        selectedMarker.severity === "Critical"
                          ? "bg-red-100 text-red-800 border-red-300"
                          : selectedMarker.severity === "High"
                            ? "bg-orange-100 text-orange-800 border-orange-300"
                            : "bg-yellow-100 text-yellow-800 border-yellow-300"
                      }
                    >
                      {selectedMarker.severity} Severity
                    </Badge>
                  )}
                  <p className="text-sm text-red-600 font-semibold mt-1">Danger Zone - Avoid This Area</p>
                  {selectedMarker.reportTime && (
                    <p className="text-sm text-gray-600">Reported: {selectedMarker.reportTime}</p>
                  )}
                  {selectedMarker.details && <p className="text-sm text-gray-600 mt-1">{selectedMarker.details}</p>}
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="destructive">
                      Report Update
                    </Button>
                    <Button size="sm" variant="outline">
                      Share Location
                    </Button>
                  </div>
                </div>
              )}

              {selectedMarker.type === "evacuation" && (
                <div>
                  <p className="text-sm text-blue-600">Active Evacuation Route</p>
                  <p className="text-sm text-gray-600">Traffic status: Moderate</p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm">Navigate</Button>
                    <Button size="sm" variant="outline">
                      Report Blockage
                    </Button>
                  </div>
                </div>
              )}

              {selectedMarker.type === "resource" && (
                <div>
                  <p className="text-sm text-purple-600">Resource Distribution Point</p>
                  <p className="text-sm text-gray-600">Available: Water, Food, Medical Supplies</p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm">Request Supplies</Button>
                    <Button size="sm" variant="outline">
                      Get Directions
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button
          onClick={handleLocationClick}
          variant="outline"
          size="icon"
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
        >
          <Navigation2 className="w-6 h-6 text-gray-700" />
        </Button>
        <Button
          onClick={() => setZoom(zoom + 1)}
          variant="outline"
          size="icon"
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
        >
          <Plus className="w-6 h-6 text-gray-700" />
        </Button>
        <Button
          onClick={() => setZoom(zoom - 1)}
          variant="outline"
          size="icon"
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
        >
          <Minus className="w-6 h-6 text-gray-700" />
        </Button>
      </div>

      {/* Map layers control */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
        <h3 className="font-semibold mb-2">Map Layers</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="shelters"
              checked={mapLayers.shelters}
              onChange={() => toggleLayer("shelters")}
              className="mr-2"
            />
            <label htmlFor="shelters" className="text-sm flex items-center">
              <Tent className="h-4 w-4 mr-1 text-green-600" /> Shelters
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="dangerZones"
              checked={mapLayers.dangerZones}
              onChange={() => toggleLayer("dangerZones")}
              className="mr-2"
            />
            <label htmlFor="dangerZones" className="text-sm flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-red-600" /> Danger Zones
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="evacuationRoutes"
              checked={mapLayers.evacuationRoutes}
              onChange={() => toggleLayer("evacuationRoutes")}
              className="mr-2"
            />
            <label htmlFor="evacuationRoutes" className="text-sm flex items-center">
              <Navigation2 className="h-4 w-4 mr-1 text-blue-600" /> Evacuation Routes
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="resources"
              checked={mapLayers.resources}
              onChange={() => toggleLayer("resources")}
              className="mr-2"
            />
            <label htmlFor="resources" className="text-sm flex items-center">
              <Truck className="h-4 w-4 mr-1 text-purple-600" /> Resources
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="teams"
              checked={mapLayers.teams}
              onChange={() => toggleLayer("teams")}
              className="mr-2"
            />
            <label htmlFor="teams" className="text-sm flex items-center">
              <Users className="h-4 w-4 mr-1 text-orange-600" /> Response Teams
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="voiceReports"
              checked={mapLayers.voiceReports}
              onChange={() => toggleLayer("voiceReports")}
              className="mr-2"
            />
            <label htmlFor="voiceReports" className="text-sm flex items-center">
              <Mic className="h-4 w-4 mr-1 text-indigo-600" /> Voice Reports
            </label>
          </div>
        </div>

        {getDisasterSpecificControls()}
      </div>
    </div>
  )
}

