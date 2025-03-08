"use client"

import { useEffect, useRef, useState } from "react"
import { Tent, AlertTriangle, Navigation2, Truck, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import mapboxgl from 'mapbox-gl';

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
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined') return; // Ensure this runs only on the client side

    // Check if mapboxgl is available
    if (!window.mapboxgl) {
      // Load Mapbox script and CSS
      const script = document.createElement("script")
      script.src = "https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js"
      script.async = true

      const link = document.createElement("link")
      link.href = "https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css"
      link.rel = "stylesheet"

      document.head.appendChild(script)
      document.head.appendChild(link)

      script.onload = initializeMap
    } else {
      initializeMap()
    }

    return () => {
      if (mapInstance) {
        mapInstance.remove()
      }
    }
  }, [])

  // Initialize the map
  const initializeMap = () => {
    if (!mapRef.current || mapLoaded) return

    // Use your Mapbox token
    window.mapboxgl.accessToken = "pk.eyJ1IjoibW91YWRlbm5hIiwiYSI6ImNseDB1d2VuczA0Y3gyaXM0Y2E5Z3A2OWoifQ.nnDPc-c8ndn7lpfEqukeXA"

    try {
      // Create a new map instance
      const map = new window.mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-74.006, 40.7128], // Default to NYC
        zoom: 12,
      })

      map.on("load", () => {
        setMapLoaded(true)
        setMapInstance(map)

        // Get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userCoords: [number, number] = [position.coords.longitude, position.coords.latitude]
              setUserLocation(userCoords)
              map.flyTo({ center: userCoords, zoom: 14 })
            },
            (error) => {
              console.error("Error getting location:", error)
            },
          )
        }
      })
    } catch (error) {
      console.error("Error initializing map:", error)
      // Fallback to static map display
      setMapLoaded(true)
    }
  }

  // Update markers when they change
  useEffect(() => {
    if (!mapLoaded || !mapInstance) return

    // Clear existing markers
    const existingMarkers = document.querySelectorAll(".mapboxgl-marker")
    existingMarkers.forEach((marker) => marker.remove())

    // Add new markers
    markers.forEach((marker) => {
      // Create marker element
      const el = document.createElement("div")
      el.className = "marker"
      el.style.width = "30px"
      el.style.height = "30px"
      el.style.borderRadius = "50%"
      el.style.backgroundColor = "white"
      el.style.display = "flex"
      el.style.alignItems = "center"
      el.style.justifyContent = "center"
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)"

      // Add icon based on marker type
      const icon = document.createElement("div")
      icon.style.width = "20px"
      icon.style.height = "20px"

      if (marker.type === "shelter") {
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 19V9.8c0-1-.8-1.7-1.7-1.7H6.7c-1 0-1.7.8-1.7 1.7V19"/><path d="m2 19 10-7 10 7"/><path d="M12 12v7"/><path d="M12 12 2 5l10 7 10-7-10 7"/></svg>`
      } else if (marker.type === "danger") {
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`
      } else if (marker.type === "evacuation") {
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M12 12V3"/></svg>`
      } else if (marker.type === "resource") {
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.29 7 12 12l8.71-5"/><path d="M12 22V12"/></svg>`
      } else {
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`
      }

      el.appendChild(icon)

      // Add popup
      const popup = new window.mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div>
          <h3 class="font-bold">${marker.title}</h3>
          ${marker.details ? `<p>${marker.details}</p>` : ""}
          ${marker.status ? `<p>Status: ${marker.status}</p>` : ""}
          ${marker.capacity ? `<p>Capacity: ${marker.capacity}</p>` : ""}
        </div>`,
      )

      // Create the marker
      new window.mapboxgl.Marker(el)
        .setLngLat(marker.coordinates) // Corrected order: [longitude, latitude]
        .setPopup(popup)
        .addTo(mapInstance)

      // Add click handler
      el.addEventListener("click", () => {
        if (onMarkerClick) {
          onMarkerClick(marker)
        }
      })
    })

    // If there are markers, fit the map to show all of them
    if (markers.length > 0 && mapInstance) {
      const bounds = new window.mapboxgl.LngLatBounds()
      markers.forEach((marker) => {
        bounds.extend(marker.coordinates) // Corrected order: [longitude, latitude]
      })
      mapInstance.fitBounds(bounds, { padding: 50 })
    }
  }, [markers, mapLoaded, mapInstance, onMarkerClick])

  // Apply disaster-specific styling
  useEffect(() => {
    if (!mapLoaded || !mapInstance || !currentDisaster) return

    // Add disaster-specific layers
    if (currentDisaster === "Flood") {
      // Add flood zone layer
      if (!mapInstance.getSource("flood-zones")) {
        mapInstance.addSource("flood-zones", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-74.01, 40.71],
                  [-74.01, 40.72],
                  [-74.0, 40.72],
                  [-74.0, 40.71],
                  [-74.01, 40.71],
                ],
              ],
            },
            properties: {},
          },
        })

        mapInstance.addLayer({
          id: "flood-zones-fill",
          type: "fill",
          source: "flood-zones",
          layout: {},
          paint: {
            "fill-color": "#2563eb",
            "fill-opacity": 0.3,
          },
        })
      }
    } else if (currentDisaster === "Fire") {
      // Add fire zone layer
      if (!mapInstance.getSource("fire-zones")) {
        mapInstance.addSource("fire-zones", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-74.02, 40.72],
                  [-74.02, 40.73],
                  [-74.01, 40.73],
                  [-74.01, 40.72],
                  [-74.02, 40.72],
                ],
              ],
            },
            properties: {},
          },
        })

        mapInstance.addLayer({
          id: "fire-zones-fill",
          type: "fill",
          source: "fire-zones",
          layout: {},
          paint: {
            "fill-color": "#dc2626",
            "fill-opacity": 0.3,
          },
        })
      }
    }
  }, [currentDisaster, mapLoaded, mapInstance])

  // Fallback for when map can't be loaded
  const renderFallbackMap = () => {
    return (
      <div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 mb-4">Interactive map would display here</p>

          {/* Visualization of markers */}
          <div className="absolute inset-0">
            {markers.map((marker) => (
              <div
                key={marker.id}
                className="absolute p-2 rounded-full bg-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${30 + Math.random() * 40}%`,
                }}
                onClick={() => onMarkerClick && onMarkerClick(marker)}
              >
                {marker.type === "shelter" ? (
                  <Tent className="h-5 w-5 text-green-600" />
                ) : marker.type === "danger" ? (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                ) : marker.type === "evacuation" ? (
                  <Navigation2 className="h-5 w-5 text-blue-600" />
                ) : marker.type === "resource" ? (
                  <Truck className="h-5 w-5 text-purple-600" />
                ) : (
                  <MapPin className="h-5 w-5 text-gray-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative ${compact ? "h-[calc(100vh-280px)]" : "h-[calc(100vh-200px)]"} w-full overflow-hidden rounded-lg bg-white shadow-lg`}
    >
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Fallback content if map fails to load */}
      {!mapLoaded && renderFallbackMap()}

      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
          onClick={() => {
            if (userLocation && mapInstance) {
              mapInstance.flyTo({ center: userLocation, zoom: 14 })
            } else if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const userCoords: [number, number] = [position.coords.longitude, position.coords.latitude]
                  setUserLocation(userCoords)
                  if (mapInstance) {
                    mapInstance.flyTo({ center: userCoords, zoom: 14 })
                  }
                },
                (error) => {
                  console.error("Error getting location:", error)
                },
              )
            }
          }}
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
    </div>
  )
}

// Add this to the global Window interface
declare global {
  interface Window {
    mapboxgl: typeof mapboxgl
  }
}