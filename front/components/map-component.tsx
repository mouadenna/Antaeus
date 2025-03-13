"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Button } from "@/components/ui/button"
import { X, Users, Home, AlertTriangle, ArrowUp, Package } from "lucide-react"
import type { DisasterFeature } from "./active-disasters"

// Mapbox access token
export const MAPBOX_ACCESS_TOKEN =
  "MAPBOX_ACCESS_TOKEN"

// Define the marker structure
export interface MapMarker {
  id: number
  title: string
  coordinates: [number, number] // [longitude, latitude]
  type: "shelter" | "danger" | "evacuation" | "resource" | "general"
  details?: string
  severity?: "low" | "medium" | "high"
  capacity?: number
  status?: "open" | "closed" | "full" | "limited"
}

interface MapComponentProps {
  markers: MapMarker[]
  currentDisaster: string | null
  onMarkerClick: (marker: MapMarker) => void
  onClose: () => void
  geometryCode?: string
  locationCoordinates?: {
    latitude: string | number
    longitude: string | number
  }
  disasterFeatures: DisasterFeature[]
}

export function MapComponent({
  markers,
  currentDisaster,
  onMarkerClick,
  onClose,
  geometryCode,
  locationCoordinates,
  disasterFeatures,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({})
  const routeLayerRef = useRef<boolean>(false)
  const locationMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const disasterLayersRef = useRef<string[]>([])
  const safeDisasterFeatures = disasterFeatures || []

  // Calculate statistics based on markers and disaster features
  const [statistics, setStatistics] = useState({
    estimatedAffected: 0,
    shelterCapacity: 0,
    shelterCount: 0,
    dangerZones: 0,
    evacuationPoints: 0,
    resourceCenters: 0,
  })

  // Calculate statistics when markers or disaster features change
  useEffect(() => {
    // Count markers by type
    const shelterMarkers = markers.filter((m) => m.type === "shelter")
    const dangerMarkers = markers.filter((m) => m.type === "danger")
    const evacuationMarkers = markers.filter((m) => m.type === "evacuation")
    const resourceMarkers = markers.filter((m) => m.type === "resource")

    // Calculate total shelter capacity
    const totalCapacity = shelterMarkers.reduce((sum, marker) => sum + (marker.capacity || 0), 0)

    // Estimate affected people based on disaster features and danger zones
    // This is a simplified estimation for demonstration purposes
    let estimatedAffected = 0

    if (safeDisasterFeatures.length > 0) {
      // Base estimate on disaster type and severity
      safeDisasterFeatures.forEach((feature) => {
        const basePopulation = Math.floor(Math.random() * 50000) + 10000 // Random base between 10,000-60,000
        const severityMultiplier =
          feature.properties?.severity === "high" ? 0.8 : feature.properties?.severity === "medium" ? 0.5 : 0.2

        const disasterTypeMultiplier =
          feature.properties?.disasterType === "flood"
            ? 0.7
            : feature.properties?.disasterType === "fire"
              ? 0.5
              : feature.properties?.disasterType === "earthquake"
                ? 0.9
                : feature.properties?.disasterType === "hurricane"
                  ? 0.8
                  : 0.6

        estimatedAffected += Math.floor(basePopulation * severityMultiplier * disasterTypeMultiplier)
      })
    } else if (dangerMarkers.length > 0) {
      // If no disaster features but danger markers exist, estimate based on those
      estimatedAffected = dangerMarkers.length * 5000
    }

    setStatistics({
      estimatedAffected,
      shelterCapacity: totalCapacity,
      shelterCount: shelterMarkers.length,
      dangerZones: dangerMarkers.length,
      evacuationPoints: evacuationMarkers.length,
      resourceCenters: resourceMarkers.length,
    })
  }, [markers, safeDisasterFeatures])

  // Initialize the map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-6.8, 34.05], // Default center (Rabat, Morocco)
      zoom: 12,
      animate: true,
      fadeDuration: 1000,
    })

    newMap.on("load", () => {
      console.log("Full map loaded")
      setMapLoaded(true)
    })

    map.current = newMap

    // Add navigation controls
    newMap.addControl(new mapboxgl.NavigationControl(), "top-right")

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
        console.log("No disaster features to display")
        return
      }

      console.log(`Adding ${safeDisasterFeatures.length} disaster features to map`)

      // Add each disaster feature to the map
      safeDisasterFeatures.forEach((feature, index) => {
        const disasterType = feature.properties?.disasterType?.toLowerCase() || "unknown"
        const fillLayerId = `disaster-${disasterType}-fill-${index}`
        const outlineLayerId = `disaster-${disasterType}-outline-${index}`
        const sourceId = `source-${fillLayerId}`

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

        // Add popup on hover
        map.current?.on("mouseenter", fillLayerId, () => {
          map.current!.getCanvas().style.cursor = "pointer"
        })

        map.current?.on("mouseleave", fillLayerId, () => {
          map.current!.getCanvas().style.cursor = ""
        })

        // Add click event to show popup
        map.current?.on("click", fillLayerId, (e) => {
          if (!e.features || e.features.length === 0) return

          const properties = e.features[0].properties
          if (!properties) return

          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="padding: 10px;">
                <h3 style="font-weight: 600; margin-bottom: 5px;">${properties.name}</h3>
                <p style="margin-bottom: 5px;"><strong>Type:</strong> ${properties.disasterType}</p>
                <p style="margin-bottom: 5px;"><strong>Severity:</strong> ${properties.severity}</p>
                <p style="margin-bottom: 0;">${properties.description}</p>
              </div>
            `)
            .addTo(map.current!)
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

      console.log("Successfully added disaster areas to map")
    } catch (error) {
      console.error("Error handling disaster areas:", error)
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

  // Add location marker when locationCoordinates changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Enhanced debugging for locationCoordinates
    console.log("Processing locationCoordinates in MapComponent:", locationCoordinates)

    // Remove existing location marker if it exists
    if (locationMarkerRef.current) {
      locationMarkerRef.current.remove()
      locationMarkerRef.current = null
    }

    // If no location coordinates, return early
    if (!locationCoordinates) {
      console.log("No location coordinates provided to map component")
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

      console.log("Parsed location coordinates:", { lat, lng })

      // Validate coordinates with less strict validation to handle edge cases
      if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
        console.warn("Invalid location coordinates:", locationCoordinates)
        return
      }

      // Ensure coordinates are within valid ranges with clamping instead of rejection
      const validLat = Math.max(-90, Math.min(90, lat))
      const validLng = Math.max(-180, Math.min(180, lng))

      if (validLat !== lat || validLng !== lng) {
        console.warn("Coordinates were out of bounds and have been clamped:", {
          original: { lat, lng },
          clamped: { validLat, validLng },
        })
      }

      console.log("Creating disaster marker at:", validLng, validLat)

      // Create a more visually distinct marker element for disaster locations
      const el = document.createElement("div")
      el.className = "disaster-location-marker"
      el.style.width = "60px" // Larger size for better visibility
      el.style.height = "60px"
      el.style.borderRadius = "50%"
      el.style.backgroundColor = "rgba(239, 68, 68, 0.5)" // Semitransparent red
      el.style.border = "5px solid #ef4444" // Solid red border
      el.style.boxShadow = "0 0 0 3px rgba(255, 255, 255, 0.8), 0 0 15px rgba(0, 0, 0, 0.5)"
      el.style.display = "flex"
      el.style.alignItems = "center"
      el.style.justifyContent = "center"
      el.style.zIndex = "1000" // Ensure it's on top
      el.style.cursor = "pointer"
      el.style.transform = "translate(-50%, -50%)" // Center the marker on the coordinates

      // Add a more prominent warning icon
      const iconElement = document.createElement("div")
      iconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#ef4444" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`
      el.appendChild(iconElement)

      // Create popup with more detailed information
      const popup = new mapboxgl.Popup({
        offset: 30,
        closeButton: true,
        closeOnClick: false,
        maxWidth: "350px",
        className: "disaster-location-popup",
      }).setHTML(`
      <div style="padding: 15px;">
        <h3 style="font-weight: 700; margin-bottom: 10px; color: #ef4444; font-size: 16px;">⚠️ Disaster Location</h3>
        <p style="margin-bottom: 8px; font-size: 14px;"><strong>Coordinates:</strong> ${validLat.toFixed(6)}, ${validLng.toFixed(6)}</p>
        <p style="margin-bottom: 8px; font-size: 14px;"><strong>Status:</strong> High Risk Area</p>
        <p style="margin-bottom: 0; font-size: 14px;"><strong>Recommendation:</strong> Avoid this area and follow evacuation routes if provided.</p>
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

      // Open popup by default to draw attention
      marker.togglePopup()

      // Store reference to the marker
      locationMarkerRef.current = marker

      // Add secondary visual elements to draw attention to the location
      addRippleEffect(coordinates)
      addPulsingEffect(el)

      // Fly to the location with animation
      map.current.flyTo({
        center: coordinates,
        zoom: 15, // Closer zoom for better visibility
        essential: true,
        duration: 2000,
        pitch: 60,
        bearing: Math.random() * 60 - 30, // Random bearing for dynamic view
      })

      console.log("Successfully added disaster marker to map")
    } catch (error) {
      console.error("Error adding location marker:", error)
    }
  }, [locationCoordinates, mapLoaded])

  // Add these new helper functions within the MapComponent function for cleaner effects
  const addPulsingEffect = (element: HTMLElement) => {
    if (!element) return

    let opacity = 1
    let growing = false
    let scale = 1

    const pulse = () => {
      if (!element) return

      if (growing) {
        opacity += 0.02
        scale += 0.01
        if (opacity >= 1 || scale >= 1.2) {
          growing = false
        }
      } else {
        opacity -= 0.02
        scale -= 0.01
        if (opacity <= 0.7 || scale <= 1) {
          growing = true
        }
      }

      element.style.opacity = opacity.toString()
      element.style.transform = `translate(-50%, -50%) scale(${scale})`
      requestAnimationFrame(pulse)
    }

    requestAnimationFrame(pulse)
  }

  const addRippleEffect = (coordinates: [number, number]) => {
    if (!map.current) return

    const createRipple = () => {
      // Create a ripple element
      const ripple = document.createElement("div")
      ripple.className = "disaster-ripple"
      ripple.style.position = "absolute"
      ripple.style.width = "60px"
      ripple.style.height = "60px"
      ripple.style.borderRadius = "50%"
      ripple.style.backgroundColor = "rgba(239, 68, 68, 0.2)"
      ripple.style.border = "2px solid rgba(239, 68, 68, 0.5)"
      ripple.style.transform = "translate(-50%, -50%)"
      ripple.style.zIndex = "999"

      // Add to map container at the marker position
      const { x, y } = map.current.project(coordinates)
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      map.current.getContainer().appendChild(ripple)

      // Animate the ripple
      let size = 1
      const animateRipple = () => {
        size += 0.05
        ripple.style.transform = `translate(-50%, -50%) scale(${size})`
        ripple.style.opacity = (1.5 - size).toString()

        if (size < 3) {
          requestAnimationFrame(animateRipple)
        } else {
          ripple.remove()
        }
      }

      requestAnimationFrame(animateRipple)
    }

    // Start ripple effect and repeat every 3 seconds
    createRipple()
    const rippleInterval = setInterval(createRipple, 3000)

    // Store the interval ID for cleanup
    return rippleInterval
  }

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

      // Import polyline dynamically to avoid server-side rendering issues
      import("@mapbox/polyline").then((polylineModule) => {
        const polyline = polylineModule.default

        try {
          console.log("Processing geometryCode:", geometryCode.substring(0, 20) + "...")

          // Decode the polyline
          const decodedCoordinates = polyline.decode(geometryCode)
          console.log(`Decoded ${decodedCoordinates.length} coordinates`)

          if (decodedCoordinates.length === 0) {
            console.warn("No coordinates decoded from geometryCode")
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
      console.error("Error processing polyline:", error)
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
      console.log("Added new route source and layers")

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
      console.log("Fitted map to polyline bounds with smooth animation")
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

  // Format number with commas for thousands
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <div className="relative w-full h-full bg-white">
      <div className="absolute top-4 left-4 right-4 z-10 bg-white/90 rounded-lg p-3 shadow-md flex justify-between items-center">
        <div>
          <h2 className="font-medium text-lg">Disaster Response Map</h2>
          <p className="text-sm text-gray-600">
            {safeDisasterFeatures.length > 0
              ? `${safeDisasterFeatures.length} active disaster ${safeDisasterFeatures.length > 1 ? "areas" : "area"}`
              : "No active disasters"}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div ref={mapContainer} className="w-full h-full" />

      {/* Statistics Panel */}
      <div className="absolute top-20 right-4 z-10 bg-white/90 p-4 rounded-lg shadow-md w-64">
        <h3 className="font-medium text-lg mb-3 border-b pb-2">Disaster Statistics</h3>

        <div className="space-y-3">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <p className="text-sm font-medium">Estimated Affected</p>
              <p className="text-lg font-bold">{formatNumber(statistics.estimatedAffected)}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Home className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium">Shelters</p>
              <p className="text-lg font-bold">
                {statistics.shelterCount}{" "}
                <span className="text-sm font-normal text-gray-500">
                  ({formatNumber(statistics.shelterCapacity)} capacity)
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <p className="text-sm font-medium">Danger Zones</p>
              <p className="text-lg font-bold">{statistics.dangerZones}</p>
            </div>
          </div>

          <div className="flex items-center">
            <ArrowUp className="h-5 w-5 text-sky-500 mr-3" />
            <div>
              <p className="text-sm font-medium">Evacuation Points</p>
              <p className="text-lg font-bold">{statistics.evacuationPoints}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Package className="h-5 w-5 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium">Resource Centers</p>
              <p className="text-lg font-bold">{statistics.resourceCenters}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white/90 p-3 rounded-lg shadow-md">
          <h3 className="font-medium mb-2">Map Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <div dangerouslySetInnerHTML={{ __html: getMarkerIcon("shelter") }} />
              </div>
              <span className="text-sm">Shelter</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-2">
                <div dangerouslySetInnerHTML={{ __html: getMarkerIcon("danger") }} />
              </div>
              <span className="text-sm">Danger Zone</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center mr-2">
                <div dangerouslySetInnerHTML={{ __html: getMarkerIcon("evacuation") }} />
              </div>
              <span className="text-sm">Evacuation Point</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                <div dangerouslySetInnerHTML={{ __html: getMarkerIcon("resource") }} />
              </div>
              <span className="text-sm">Resource Center</span>
            </div>
            {locationCoordinates && (
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
                <span className="text-sm">Reported Location</span>
              </div>
            )}
            {safeDisasterFeatures.length > 0 && (
              <>
                {safeDisasterFeatures.some((f) => f?.properties?.disasterType?.toLowerCase() === "flood") && (
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-md bg-blue-400/60 border border-blue-600 mr-2"></div>
                    <span className="text-sm">Flood Zone</span>
                  </div>
                )}
                {safeDisasterFeatures.some((f) => f?.properties?.disasterType?.toLowerCase() === "fire") && (
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-md bg-red-400/60 border border-red-600 mr-2"></div>
                    <span className="text-sm">Fire Zone</span>
                  </div>
                )}
                {safeDisasterFeatures.some((f) => f?.properties?.disasterType?.toLowerCase() === "earthquake") && (
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-md bg-amber-400/60 border border-amber-600 mr-2"></div>
                    <span className="text-sm">Earthquake Zone</span>
                  </div>
                )}
                {safeDisasterFeatures.some((f) => f?.properties?.disasterType?.toLowerCase() === "hurricane") && (
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-md bg-purple-400/60 border border-purple-600 mr-2"></div>
                    <span className="text-sm">Hurricane Zone</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

