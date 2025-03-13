"use client"

import { Button } from "@/components/ui/button"
import type { MapMarker } from "../map-component"
import { useEffect, useRef, useState } from "react"
import polyline from "@mapbox/polyline"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Use the same Mapbox access token as in map-component.tsx
const MAPBOX_ACCESS_TOKEN =
  "MAPBOX_ACCESS_TOKEN"

interface MapPreviewProps {
  markers: MapMarker[]
  currentDisaster: string | null
  onMarkerClick: (marker: MapMarker) => void
  onOpenFullMap: () => void
  geometryCode?: string
}

export function MapPreview({ markers, currentDisaster, onMarkerClick, onOpenFullMap, geometryCode }: MapPreviewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({})
  const routeLayerRef = useRef<boolean>(false)

  // Initialize the map
  useEffect(() => {
    if (!mapContainer.current || map.current) return // Skip if already initialized or no container

    console.log("Initializing Mapbox map")
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40], // Default center (New York area)
      zoom: 9,
    })

    newMap.on("load", () => {
      console.log("Mapbox map loaded")
      setMapLoaded(true)
    })

    map.current = newMap

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Add markers to the map
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
        onMarkerClick(marker)
      })

      // Store marker reference
      markersRef.current[marker.id] = mapboxMarker
    })

    // If we have markers but no polyline, fit bounds to markers
    if (markers.length > 0 && !geometryCode) {
      const bounds = new mapboxgl.LngLatBounds()
      markers.forEach((marker) => {
        bounds.extend(marker.coordinates)
      })
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 })
    }
  }, [markers, mapLoaded, onMarkerClick])

  // Add polyline to the map when geometryCode changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    try {
      // Remove existing route layer if it exists and no geometryCode is provided
      if (!geometryCode || geometryCode.trim() === "") {
        if (routeLayerRef.current && map.current.getLayer("route")) {
          map.current.removeLayer("route")
          if (map.current.getLayer("route-glow")) {
            map.current.removeLayer("route-glow")
          }
          map.current.removeSource("route")
          routeLayerRef.current = false
          console.log("Removed route layer due to empty geometryCode")
        }
        return
      }

      console.log("Processing geometryCode in preview:", geometryCode.substring(0, 20) + "...")

      // Decode the polyline
      const decodedCoordinates = polyline.decode(geometryCode)
      console.log(`Decoded ${decodedCoordinates.length} coordinates`)

      if (decodedCoordinates.length === 0) {
        console.warn("No coordinates decoded from geometryCode")
        return
      }

      // Convert [lat, lng] to [lng, lat] for Mapbox
      const mapboxCoordinates = decodedCoordinates.map(([lat, lng]) => [lng, lat])

      // Wait for map to be fully loaded
      if (!map.current.loaded()) {
        map.current.once("load", () => addPolylineToMap(mapboxCoordinates))
      } else {
        addPolylineToMap(mapboxCoordinates)
      }
    } catch (error) {
      console.error("Error processing polyline:", error)
    }
  }, [geometryCode, mapLoaded])

  // Helper function to add polyline to map
  const addPolylineToMap = (coordinates: number[][]) => {
    if (!map.current) return

    // Remove existing route layer if it exists
    if (routeLayerRef.current && map.current.getLayer("route")) {
      map.current.removeLayer("route")
      map.current.removeSource("route")
      routeLayerRef.current = false
    }

    // Add new source and layer
    map.current.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: coordinates,
        },
      },
    })

    map.current.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#ff0000",
        "line-width": 4,
        "line-opacity": 0.75,
      },
    })

    routeLayerRef.current = true
    console.log("Added new route source and layer")

    // Fit the map to the bounds of the polyline
    const bounds = new mapboxgl.LngLatBounds()
    coordinates.forEach((coord) => bounds.extend(coord as [number, number]))
    map.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15,
    })
    console.log("Fitted map to polyline bounds")
  }

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

  return (
    <div className="h-full w-full border rounded-lg overflow-hidden bg-gray-50 relative">
      <div className="absolute top-4 left-4 right-4 z-10 bg-white/90 rounded-lg p-2 shadow-md">
        <h3 className="font-medium">Interactive Map</h3>
        <p className="text-sm text-gray-600">
          {geometryCode
            ? "Showing recommended route"
            : markers.length > 0
              ? `Showing ${markers.length} locations related to your conversation`
              : "Ask about shelters, evacuation routes, or report an incident to see them on the map"}
        </p>
      </div>

      <div ref={mapContainer} className="w-full h-full" />

      <div className="absolute bottom-4 right-4">
        <Button size="sm" onClick={onOpenFullMap} className="bg-white text-gray-800 hover:bg-gray-100 shadow-md">
          Open Full Map
        </Button>
      </div>
    </div>
  )
}

