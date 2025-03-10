"use client"

import { useEffect, useRef, useState } from "react"
import { Tent, AlertTriangle, Navigation2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Define marker types
export interface MapMarker {
  id: number
  type: string
  coordinates: [number, number] // [longitude, latitude]
  title: string
  details?: string
  severity?: string
  capacity?: number
  status?: string
}

interface MapComponentProps {
  markers: MapMarker[]
  currentDisaster: string | null
  compact?: boolean
  onMarkerClick?: (marker: MapMarker) => void
}

export default function MapComponent({ markers, currentDisaster, compact = false, onMarkerClick }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(true)
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({})

  // Initialize map
  useEffect(() => {
    if (map.current) return // Map already initialized

    // Set Mapbox access token
    mapboxgl.accessToken =
      "pk.eyJ1IjoibW91YWRlbm5hIiwiYSI6ImNseDB1d2VuczA0Y3gyaXM0Y2E5Z3A2OWoifQ.nnDPc-c8ndn7lpfEqukeXA"

    // Create map instance
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-74.5, 40], // Default to New York area
        zoom: 9,
        attributionControl: !compact,
      })

      // Add navigation controls
      if (!compact) {
        map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right")
      }

      // Add geolocate control
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })

      map.current.addControl(geolocateControl, "bottom-right")

      // Map load event
      map.current.on("load", () => {
        setMapLoaded(true)
        setLoading(false)

        // Try to get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userCoords: [number, number] = [position.coords.longitude, position.coords.latitude]
              setUserLocation(userCoords)

              if (map.current) {
                map.current.flyTo({
                  center: userCoords,
                  zoom: 12,
                  essential: true,
                })
              }
            },
            (error) => {
              console.error("Error getting location:", error)
            },
          )
        }
      })
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [compact])

  // Update markers when they change
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove())
    markersRef.current = {}

    // Add new markers
    markers.forEach((marker) => {
      // Create custom marker element
      const el = document.createElement("div")
      el.className = "custom-marker"
      el.style.width = "36px"
      el.style.height = "36px"
      el.style.borderRadius = "50%"
      el.style.display = "flex"
      el.style.alignItems = "center"
      el.style.justifyContent = "center"
      el.style.cursor = "pointer"

      // Set background color based on marker type
      if (marker.type === "shelter") {
        el.style.backgroundColor = "#dbeafe" // blue-100
      } else if (marker.type === "danger") {
        el.style.backgroundColor = "#fee2e2" // red-100
      } else if (marker.type === "evacuation") {
        el.style.backgroundColor = "#e0f2fe" // sky-100
      } else if (marker.type === "resource") {
        el.style.backgroundColor = "#f3e8ff" // purple-100
      } else {
        el.style.backgroundColor = "#f3f4f6" // gray-100
      }

      // Add icon based on marker type
      const iconElement = document.createElement("div")
      iconElement.innerHTML = getMarkerIcon(marker.type)
      iconElement.style.width = "24px"
      iconElement.style.height = "24px"
      el.appendChild(iconElement)

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px;">
            <h3 style="font-weight: 600; margin-bottom: 4px;">${marker.title}</h3>
            ${marker.details ? `<p style="margin-bottom: 4px;">${marker.details}</p>` : ""}
            ${marker.severity ? `<p style="margin-bottom: 4px;"><strong>Severity:</strong> ${marker.severity}</p>` : ""}
            ${marker.capacity ? `<p style="margin-bottom: 4px;"><strong>Capacity:</strong> ${marker.capacity}</p>` : ""}
            ${marker.status ? `<p style="margin-bottom: 4px;"><strong>Status:</strong> ${marker.status}</p>` : ""}
          </div>
        `)

      // Create marker
      const mapboxMarker = new mapboxgl.Marker(el).setLngLat(marker.coordinates).setPopup(popup).addTo(map.current!)

      // Add click event
      el.addEventListener("click", () => {
        if (onMarkerClick) {
          onMarkerClick(marker)
        }
      })

      // Store marker reference
      markersRef.current[marker.id] = mapboxMarker
    })

    // Fit bounds to markers if there are any
    if (markers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      markers.forEach((marker) => {
        bounds.extend(marker.coordinates)
      })

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      })
    }
  }, [markers, mapLoaded, onMarkerClick])

  // Helper function to get marker icon SVG
  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "shelter":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 20H7a2 2 0 0 1-2-2v-7.08A2 2 0 0 1 7 9h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2"/><path d="M9 9V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/><path d="M13 20v-5a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v5"/></svg>`
      case "danger":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`
      case "evacuation":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-6 9h12Z"/><path d="M12 12v9"/></svg>`
      case "resource":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.94 11A8.94 8.94 0 0 0 13 3.06M14.5 21.59A9 9 0 0 1 3.41 10.5"/><path d="M12 12H3"/><path d="m16 16-4-4 4-4"/></svg>`
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`
    }
  }

  // Center map on user location
  const centerOnUserLocation = () => {
    if (map.current && userLocation) {
      map.current.flyTo({
        center: userLocation,
        zoom: 14,
        essential: true,
      })
    } else if (map.current) {
      // If user location is not available, trigger geolocation
      const geolocateControl = document.querySelector(".mapboxgl-ctrl-geolocate") as HTMLElement
      if (geolocateControl) {
        geolocateControl.click()
      }
    }
  }

  return (
    <div
      className={`relative ${compact ? "h-[calc(100vh-280px)]" : "h-[calc(100vh-200px)]"} w-full overflow-hidden rounded-lg bg-white shadow-lg`}
    >
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Map controls */}
      <div className="absolute bottom-16 right-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
          onClick={centerOnUserLocation}
        >
          <Navigation2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Map layers control for non-compact view */}
      {!compact && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-semibold mb-2">Map Layers</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="shelters" defaultChecked={true} className="mr-2" />
              <label htmlFor="shelters" className="text-sm flex items-center">
                <Tent className="h-4 w-4 mr-1 text-green-600" /> Shelters
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="dangerZones" defaultChecked={true} className="mr-2" />
              <label htmlFor="dangerZones" className="text-sm flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-red-600" /> Danger Zones
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="evacuationRoutes" defaultChecked={true} className="mr-2" />
              <label htmlFor="evacuationRoutes" className="text-sm flex items-center">
                <Navigation2 className="h-4 w-4 mr-1 text-blue-600" /> Evacuation Routes
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Disaster overlay */}
      {currentDisaster && (
        <div className="absolute top-4 left-4 right-4 bg-red-50 border border-red-200 rounded-lg p-3 shadow-md">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <h3 className="font-medium text-red-800">{currentDisaster} Response Active</h3>
              <p className="text-xs text-red-600">Map showing affected areas and emergency resources</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

