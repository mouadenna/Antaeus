"use client"

import { Button } from "@/components/ui/button"
import type { MapMarker } from "./map-component"
import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import type { DisasterFeature } from "./active-disasters"

// Use the same Mapbox access token as in map-component.tsx
const MAPBOX_ACCESS_TOKEN =
  "MAPBOX_ACCESS_TOKEN"

interface MapPreviewProps {
  markers: MapMarker[]
  currentDisaster: string | null
  onMarkerClick: (marker: MapMarker) => void
  onOpenFullMap: () => void
  geometryCode?: string
  locationCoordinates?: {
    latitude: string | number
    longitude: string | number
  }
  disasterFeatures: DisasterFeature[]
}

export function MapPreview({
  markers,
  currentDisaster,
  onMarkerClick,
  onOpenFullMap,
  geometryCode,
  locationCoordinates,
  disasterFeatures,
}: MapPreviewProps) {
  // At the beginning of the MapPreview function, add this line to ensure disasterFeatures is always an array
  const safeDisasterFeatures = disasterFeatures || []
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({})
  const routeLayerRef = useRef<boolean>(false)
  const locationMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const disasterLayersRef = useRef<string[]>([])

  // Initialize the map
  useEffect(() => {
    if (!mapContainer.current || map.current) return // Skip if already initialized or no container

    console.log("Initializing Mapbox map preview")
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-6.8, 34.05], // Center on Rabat, Morocco by default
      zoom: 12,
      // Add animation options
      animate: true,
      fadeDuration: 1000,
    })

    newMap.on("load", () => {
      console.log("Mapbox map preview loaded")
      setMapLoaded(true)
    })

    map.current = newMap

    // Cleanup on unmount
    return () => {
      if (map.current) {
        // Remove all disaster layers
        disasterLayersRef.current.forEach((layerId) => {
          if (map.current?.getLayer(layerId)) {
            map.current.removeLayer(layerId)
          }
        })

        // Remove all disaster sources
        disasterLayersRef.current.forEach((layerId) => {
          const sourceId = `source-${layerId}`
          if (map.current?.getSource(sourceId)) {
            map.current.removeSource(sourceId)
          }
        })

        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Load disaster areas from GeoJSON features
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Check if disasterFeatures exists and has data
    const hasDisasterData = safeDisasterFeatures.length > 0

    try {
      // Remove existing disaster layers
      disasterLayersRef.current.forEach((layerId) => {
        if (map.current?.getLayer(layerId)) {
          map.current.removeLayer(layerId)
        }
      })

      // Remove existing disaster sources
      disasterLayersRef.current.forEach((layerId) => {
        const sourceId = `source-${layerId}`
        if (map.current?.getSource(sourceId)) {
          map.current.removeSource(sourceId)
        }
      })

      // Reset the layers reference
      disasterLayersRef.current = []

      // If no disaster data, return early
      if (!hasDisasterData) {
        console.log("No disaster features to display in preview")
        return
      }

      console.log(`Adding ${safeDisasterFeatures.length} disaster features to map preview`)

      // Add each disaster feature to the map
      safeDisasterFeatures.forEach((feature, index) => {
        const disasterType = feature.properties.disasterType.toLowerCase()
        const fillLayerId = `preview-disaster-${disasterType}-fill-${index}`
        const outlineLayerId = `preview-disaster-${disasterType}-outline-${index}`
        const sourceId = `preview-source-${fillLayerId}`

        // Add source for the disaster area
        map.current?.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: feature.properties,
            geometry: feature.geometry,
          },
        })

        // Add fill layer
        map.current?.addLayer({
          id: fillLayerId,
          type: "fill",
          source: sourceId,
          paint: getDisasterFillPaint(disasterType),
        })

        // Add outline layer
        map.current?.addLayer({
          id: outlineLayerId,
          type: "line",
          source: sourceId,
          paint: getDisasterOutlinePaint(disasterType),
        })

        // Track the layers we've added
        disasterLayersRef.current.push(fillLayerId, outlineLayerId)
      })

      // If we have disaster areas, fit the map to them
      if (safeDisasterFeatures.length > 0) {
        // Create a bounds object
        const bounds = new mapboxgl.LngLatBounds()

        // Extend the bounds to include all disaster areas
        safeDisasterFeatures.forEach((feature) => {
          if (feature.geometry.type === "Polygon" && feature.geometry.coordinates.length > 0) {
            feature.geometry.coordinates[0].forEach((coord) => {
              bounds.extend(coord as [number, number])
            })
          }
        })

        // Only fit bounds if we have valid bounds
        if (!bounds.isEmpty()) {
          map.current?.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15,
            duration: 1500,
          })
        }
      }

      console.log("Successfully added disaster areas to map preview")
    } catch (error) {
      console.error("Error handling disaster areas in preview:", error)
    }
  }, [safeDisasterFeatures, mapLoaded])

  // Helper function to get fill paint properties based on disaster type
  const getDisasterFillPaint = (disasterType: string) => {
    switch (disasterType) {
      case "flood":
        return {
          "fill-color": "rgba(0, 102, 255, 0.5)",
          "fill-opacity": 0.7,
        }
      case "fire":
        return {
          "fill-color": "rgba(255, 59, 48, 0.5)",
          "fill-opacity": 0.7,
        }
      case "earthquake":
        return {
          "fill-color": "rgba(255, 149, 0, 0.5)",
          "fill-opacity": 0.7,
        }
      case "hurricane":
        return {
          "fill-color": "rgba(142, 68, 173, 0.5)",
          "fill-opacity": 0.7,
        }
      default:
        return {
          "fill-color": "rgba(128, 128, 128, 0.5)",
          "fill-opacity": 0.7,
        }
    }
  }

  // Helper function to get outline paint properties based on disaster type
  const getDisasterOutlinePaint = (disasterType: string) => {
    switch (disasterType) {
      case "flood":
        return {
          "line-color": "rgba(0, 102, 255, 1.0)",
          "line-width": 3,
          "line-dasharray": [3, 2],
        }
      case "fire":
        return {
          "line-color": "rgba(255, 59, 48, 1.0)",
          "line-width": 3,
          "line-dasharray": [3, 2],
        }
      case "earthquake":
        return {
          "line-color": "rgba(255, 149, 0, 1.0)",
          "line-width": 3,
          "line-dasharray": [3, 2],
        }
      case "hurricane":
        return {
          "line-color": "rgba(142, 68, 173, 1.0)",
          "line-width": 3,
          "line-dasharray": [3, 2],
        }
      default:
        return {
          "line-color": "rgba(128, 128, 128, 1.0)",
          "line-width": 3,
          "line-dasharray": [3, 2],
        }
    }
  }

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

    // If we have markers but no polyline or location, fit bounds to markers
    if (markers.length > 0 && !geometryCode && !locationCoordinates && safeDisasterFeatures.length === 0) {
      const bounds = new mapboxgl.LngLatBounds()
      markers.forEach((marker) => {
        bounds.extend(marker.coordinates)
      })
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
        duration: 1500, // Add animation duration in milliseconds
        essential: true, // Make animation smoother
      })
    }
  }, [markers, mapLoaded, onMarkerClick])

  // Enhance the LocationCoordinates effect in MapPreview component
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Enhanced debugging for locationCoordinates
    console.log("Processing locationCoordinates in MapPreview:", locationCoordinates)

    // Remove existing location marker if it exists
    if (locationMarkerRef.current) {
      locationMarkerRef.current.remove()
      locationMarkerRef.current = null
    }

    // If no location coordinates, return early
    if (!locationCoordinates) {
      console.log("No location coordinates provided to map preview")
      return
    }

    try {
      // Convert string values to numbers if needed and handle various coordinate formats
      const lat =
        typeof locationCoordinates.latitude === "string"
          ? Number.parseFloat(locationCoordinates.latitude.trim())
          : locationCoordinates.latitude

      const lng =
        typeof locationCoordinates.longitude === "string"
          ? Number.parseFloat(locationCoordinates.longitude.trim())
          : locationCoordinates.longitude

      console.log("Parsed location coordinates in preview:", { lat, lng })

      // Validate coordinates with less strict validation to handle edge cases
      if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
        console.warn("Invalid location coordinates in preview:", locationCoordinates)
        return
      }

      // Ensure coordinates are within valid ranges with clamping instead of rejection
      const validLat = Math.max(-90, Math.min(90, lat))
      const validLng = Math.max(-180, Math.min(180, lng))

      if (validLat !== lat || validLng !== lng) {
        console.warn("Coordinates were out of bounds and have been clamped in preview:", {
          original: { lat, lng },
          clamped: { validLat, validLng },
        })
      }

      console.log("Creating disaster marker in preview at:", validLng, validLat)

      // Create a more visually distinct marker element for disaster locations
      const el = document.createElement("div")
      el.className = "disaster-location-marker"
      el.style.width = "50px" // Slightly smaller for the preview
      el.style.height = "50px"
      el.style.borderRadius = "50%"
      el.style.backgroundColor = "rgba(239, 68, 68, 0.5)" // Semitransparent red
      el.style.border = "4px solid #ef4444" // Solid red border
      el.style.boxShadow = "0 0 0 2px rgba(255, 255, 255, 0.8), 0 0 12px rgba(0, 0, 0, 0.5)"
      el.style.display = "flex"
      el.style.alignItems = "center"
      el.style.justifyContent = "center"
      el.style.zIndex = "1000" // Ensure it's on top
      el.style.cursor = "pointer"
      el.style.transform = "translate(-50%, -50%)" // Center the marker on the coordinates

      // Add a warning icon
      const iconElement = document.createElement("div")
      iconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#ef4444" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`
      el.appendChild(iconElement)

      // Create popup with information
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        className: "disaster-location-popup",
      }).setHTML(`
        <div style="padding: 12px;">
          <h3 style="font-weight: 700; margin-bottom: 8px; color: #ef4444; font-size: 14px;">⚠️ Disaster Location</h3>
          <p style="margin-bottom: 8px; font-size: 12px;"><strong>Coordinates:</strong> ${validLat.toFixed(6)}, ${validLng.toFixed(6)}</p>
          <p style="margin-bottom: 0; font-size: 12px;"><strong>Status:</strong> High Risk Area</p>
        </div>
      `)

      // Create and add the marker with guaranteed valid coordinates
      const coordinates: [number, number] = [validLng, validLat]
      const marker = new mapboxgl.Marker({
        element: el,
      })
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map.current)

      // Store reference to the marker
      locationMarkerRef.current = marker

      // Add simple pulsing animation to make the marker more visible
      let opacity = 1
      let growing = false
      let scale = 1
      const pulse = () => {
        if (!el) return

        if (growing) {
          opacity += 0.02
          scale += 0.01
          if (opacity >= 1 || scale >= 1.15) {
            growing = false
          }
        } else {
          opacity -= 0.02
          scale -= 0.01
          if (opacity <= 0.7 || scale <= 1) {
            growing = true
          }
        }

        el.style.opacity = opacity.toString()
        el.style.transform = `translate(-50%, -50%) scale(${scale})`
        requestAnimationFrame(pulse)
      }

      requestAnimationFrame(pulse)

      // Fly to the location with animation
      map.current.flyTo({
        center: coordinates,
        zoom: 14,
        essential: true,
        duration: 1500,
      })

      console.log("Successfully added disaster marker to map preview")
    } catch (error) {
      console.error("Error adding location marker to preview:", error)
    }
  }, [locationCoordinates, mapLoaded])

  // Add polyline to the map when geometryCode changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    try {
      // Remove existing route layer if it exists and no geometryCode is provided
      if (!geometryCode) {
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

      // Import polyline dynamically to avoid server-side rendering issues
      import("@mapbox/polyline").then((polylineModule) => {
        const polyline = polylineModule.default

        try {
          // Decode the polyline
          const decodedCoordinates = polyline.decode(geometryCode)
          console.log(`Decoded ${decodedCoordinates.length} coordinates in preview`)

          if (decodedCoordinates.length === 0) {
            console.warn("No coordinates decoded from geometryCode in preview")
            return
          }

          // Convert [lat, lng] to [lng, lat] for Mapbox
          // This is critical - Mapbox expects [longitude, latitude] order
          const mapboxCoordinates = decodedCoordinates
            .map(([lat, lng]) => {
              // Validate coordinates
              if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
                console.warn("Invalid coordinate detected:", lat, lng)
                return null
              }

              // Ensure coordinates are within valid ranges
              const validLat = Math.max(-90, Math.min(90, lat))
              const validLng = Math.max(-180, Math.min(180, lng))

              return [validLng, validLat] // Mapbox uses [lng, lat] order
            })
            .filter((coord) => coord !== null) as [number, number][]

          console.log("Transformed coordinates for Mapbox:", mapboxCoordinates.slice(0, 3))

          // Wait for map to be fully loaded
          if (!map.current!.loaded()) {
            map.current!.once("load", () => {
              // Add a slight delay before adding the polyline for better visual transition
              setTimeout(() => addPolylineToMap(mapboxCoordinates), 300)
            })
          } else {
            // Add a slight delay before adding the polyline for better visual transition
            setTimeout(() => addPolylineToMap(mapboxCoordinates), 300)
          }
        } catch (decodeError) {
          console.error("Error decoding polyline:", decodeError)
        }
      })
    } catch (error) {
      console.error("Error processing polyline in preview:", error)
    }
  }, [geometryCode, mapLoaded])

  // Helper function to add polyline to map
  const addPolylineToMap = (coordinates: [number, number][]) => {
    if (!map.current || coordinates.length < 2) {
      console.warn("Cannot add polyline: map not initialized or insufficient coordinates")
      return
    }

    try {
      // Remove existing route layer if it exists
      if (routeLayerRef.current) {
        if (map.current.getLayer("route")) {
          map.current.removeLayer("route")
        }
        if (map.current.getLayer("route-glow")) {
          map.current.removeLayer("route-glow")
        }
        if (map.current.getSource("route")) {
          map.current.removeSource("route")
        }
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

      // Add a glow effect by adding multiple layers
      // First add a wider background layer for the glow effect
      map.current.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff6666",
          "line-width": 8,
          "line-opacity": 0.4,
          "line-blur": 3,
        },
      })

      // Then add the main route line
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
          "line-opacity": 0.9,
        },
      })

      routeLayerRef.current = true
      console.log("Added new route source and layers in preview")

      // Fit the map to the bounds of the polyline with smooth animation
      const bounds = new mapboxgl.LngLatBounds()
      coordinates.forEach((coord) => bounds.extend(coord))

      // Check if bounds are valid before fitting
      if (bounds.isEmpty()) {
        console.warn("Cannot fit to empty bounds")
        return
      }

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
        duration: 2000, // 2 seconds animation
        essential: true,
        animate: true,
      })
      console.log("Fitted map preview to polyline bounds with smooth animation")
    } catch (error) {
      console.error("Error adding polyline to map:", error)
    }
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
            : locationCoordinates
              ? "Showing reported location"
              : safeDisasterFeatures.length > 0
                ? `Showing ${safeDisasterFeatures.length} disaster ${safeDisasterFeatures.length > 1 ? "areas" : "area"}`
                : markers.length > 0
                  ? `Showing ${markers.length} locations`
                  : "Ask about locations to see them on the map"}
        </p>
      </div>

      <div ref={mapContainer} className="w-full h-full" />

      <div className="absolute bottom-4 right-4">
        <Button size="sm" onClick={onOpenFullMap} className="bg-white text-gray-800 hover:bg-gray-100 shadow-md">
          Open Full Map
        </Button>
      </div>

      {/* Simple legend when a route or location is displayed */}
      {(geometryCode || locationCoordinates || safeDisasterFeatures.length > 0) && (
        <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded-lg shadow-md">
          {geometryCode && (
            <div className="flex items-center mb-1">
              <div className="w-4 h-1 bg-red-500 mr-2"></div>
              <span className="text-xs text-gray-700">Route</span>
            </div>
          )}
          {locationCoordinates && (
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span className="text-xs text-gray-700">Location</span>
            </div>
          )}
          {safeDisasterFeatures.length > 0 && (
            <>
              {safeDisasterFeatures.some((f) => f?.properties?.disasterType?.toLowerCase() === "flood") && (
                <div className="flex items-center mb-1">
                  <div className="w-4 h-4 rounded-md bg-blue-400/60 border border-blue-600 mr-2"></div>
                  <span className="text-xs text-gray-700">Flood Zone</span>
                </div>
              )}
              {safeDisasterFeatures.some((f) => f?.properties?.disasterType?.toLowerCase() === "fire") && (
                <div className="flex items-center mb-1">
                  <div className="w-4 h-4 rounded-md bg-red-400/60 border border-red-600 mr-2"></div>
                  <span className="text-xs text-gray-700">Fire Zone</span>
                </div>
              )}
              {safeDisasterFeatures.some((f) => f?.properties?.disasterType?.toLowerCase() === "earthquake") && (
                <div className="flex items-center mb-1">
                  <div className="w-4 h-4 rounded-md bg-amber-400/60 border border-amber-600 mr-2"></div>
                  <span className="text-xs text-gray-700">Earthquake Zone</span>
                </div>
              )}
              {safeDisasterFeatures.some((f) => f?.properties?.disasterType?.toLowerCase() === "hurricane") && (
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-md bg-purple-400/60 border border-purple-600 mr-2"></div>
                  <span className="text-xs text-gray-700">Hurricane Zone</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

