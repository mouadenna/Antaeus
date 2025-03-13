"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { initializeAgent } from "../agent"
import { MapComponent, type MapMarker } from "../components/map-component"
import { ChatContainer } from "../components/chat-container"
import { AppHeader } from "../components/app-header"
import { AppTabs } from "../components/app-tabs"
import Sidebar from "../components/sidebar"
import AlertsPanel from "../components/alerts-panel"
import ResourcesPanel from "../components/resources-panel"
import AudioReport from "../components/audio-report"
import UserDashboard from "../components/user-dashboard"
import AdminDashboard from "../components/admin-dashboard"
import NotificationSystem, { useNotifications } from "../components/notification-system"
import type { DisasterFeature } from "../components/active-disasters"

// Sample FAQ suggestions
const FAQ_SUGGESTIONS = [
  "Where is the nearest shelter?",
  "How do I prepare for a hurricane?",
  "What should I include in my emergency kit?",
  "How do I report a dangerous situation?",
  "What evacuation routes are available?",
  "How can I check if my area is affected?",
]

// Sample notification messages
const NOTIFICATION_MESSAGES = {
  emergencyMode: {
    id: "emergency-mode",
    title: "Emergency Mode Activated",
    message: "Your messages are now prioritized. Emergency services have been notified.",
    type: "alert" as const,
    duration: 10000,
  },
  routeGenerated: {
    id: "route-generated",
    title: "Evacuation Route Generated",
    message: "A safe evacuation route has been mapped for you. Please follow the highlighted path.",
    type: "info" as const,
    duration: 8000,
  },
  locationFound: {
    id: "location-found",
    title: "Location Found",
    message: "A location has been identified and marked on the map.",
    type: "info" as const,
    duration: 5000,
  },
  disasterAlert: (disasterType: string, isMultiple: boolean) => ({
    id: "disaster-alert",
    title: isMultiple
      ? "Multiple Disasters Alert"
      : `${disasterType.charAt(0).toUpperCase() + disasterType.slice(1)} Alert`,
    message: isMultiple
      ? "Multiple disaster areas have been identified. Affected areas are marked on the map."
      : `A ${disasterType} disaster area has been identified. Affected areas are marked on the map.`,
    type: "alert" as const,
    duration: 10000,
  }),
}

// Sample map markers
const SAMPLE_MARKERS: MapMarker[] = [
  
    {
      "id": 1,
      "title": "Main Evacuation Center",
      "coordinates": [-8.0059, 31.6349], // Near Marrakesh, Al Haouz region
      "type": "shelter",
      "details": "Capacity for 500 people",
      "capacity": 500,
      "status": "open"
    },
    {
      "id": 2,
      "title": "Flooded Area",
      "coordinates": [-7.9789, 31.6091], // Near Marrakesh, Al Haouz region
      "type": "danger",
      "details": "Severe flooding reported",
      "severity": "high"
    },
    {
      "id": 3,
      "title": "Medical Supply Station",
      "coordinates": [-7.9604, 31.6344], // Near Marrakesh, Al Haouz region
      "type": "resource",
      "details": "First aid, medications, and medical staff available",
      "status": "open"
    },
    {
      "id": 4,
      "title": "Evacuation Pickup Point",
      "coordinates": [-7.9453, 31.6192], // Near Marrakesh, Al Haouz region
      "type": "evacuation",
      "details": "Buses arrive every 30 minutes",
      "status": "open"
    }
  ]
  

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: string
  geometryCODE?: string
  imageURL?: string
  locationCoordinates?: {
    latitude: string | number
    longitude: string | number
  }
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [activeTab, setActiveTab] = useState("dashboard")
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>(SAMPLE_MARKERS)
  const [disasterFeatures, setDisasterFeatures] = useState<DisasterFeature[]>([])
  const [currentDisaster, setCurrentDisaster] = useState<string | null>(null)
  const [agentExecutor, setAgentExecutor] = useState<((input: string) => Promise<string>) | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [userRole, setUserRole] = useState<"user" | "admin">("user")
  const { notifications, addNotification, removeNotification } = useNotifications()
  const [bubbleColor] = useState("bg-gray-100")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize the agent on component mount
  useEffect(() => {
    const initAgent = async () => {
      try {
        const agent = await initializeAgent()
        setAgentExecutor(() => agent) // Ensure we're setting a function
      } catch (error) {
        console.error("Failed to initialize agent:", error)
      }
    }

    initAgent()
  }, []) // Empty dependency array means this runs once on mount

  // Load GeoJSON data
  useEffect(() => {
    const loadGeoJSONData = async () => {
      try {
        // In a real app, this would be fetched from an API
        // For this example, we'll use the provided GeoJSON data
        const geoJSONData = {
          type: "FeatureCollection",
          features: [
            {
              "type": "Feature",
              "properties": {
                "name": "Rabat Flood Zone",
                "disasterType": "flood",
                "severity": "high",
                "description": "Severe flooding affecting residential and commercial areas"
              },
              "geometry": {
                "type": "Polygon",
                "coordinates": [
                  [
                    [-6.830116, 34.046417],
                    [-6.819884, 34.043697],
                    [-6.801479, 34.052744],
                    [-6.787285, 34.055607],
                    [-6.777244, 34.06906],
                    [-6.789772, 34.083933],
                    [-6.830116, 34.046417]
                  ]
                ]
              }
            }
          ],
        }

        // Convert GeoJSON features to DisasterFeature format
        const features: DisasterFeature[] = []
        if (geoJSONData && Array.isArray(geoJSONData.features)) {
          geoJSONData.features.forEach((feature: any, index) => {
            if (feature && feature.properties && feature.geometry) {
              features.push({
                id: `disaster-${index}`,
                properties: feature.properties,
                geometry: feature.geometry,
              })
            }
          })
        }

        console.log("Loaded disaster features:", features)
        setDisasterFeatures(features)

        // Update current disaster based on features
        if (features.length > 0) {
          // Get unique disaster types
          const disasterTypes = [...new Set(features.map((f) => f.properties.disasterType))]

          if (disasterTypes.length === 1) {
            // If only one type, use it directly
            setCurrentDisaster(disasterTypes[0].charAt(0).toUpperCase() + disasterTypes[0].slice(1))
          } else if (disasterTypes.length > 1) {
            // If multiple types, use "Multiple Disasters"
            setCurrentDisaster("Multiple Disasters")
          }

          // Add notification about the disaster(s)
          setTimeout(() => {
            const isMultiple = disasterTypes.length > 1
            const disasterType = isMultiple ? "" : features[0].properties.disasterType
            addNotification(NOTIFICATION_MESSAGES.disasterAlert(disasterType, isMultiple))
          }, 1000)
        } else {
          // If no features, set currentDisaster to null
          setCurrentDisaster(null)

          // Reset emergency mode if it was active
          if (emergencyMode) {
            setEmergencyMode(false)
          }
        }
      } catch (error) {
        console.error("Error loading GeoJSON data:", error)
        setDisasterFeatures([])
      }
    }

    loadGeoJSONData()
  }, [])

  // Update the handleSendMessage function to ensure proper API communication
  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    if (!agentExecutor) {
      // If agent isn't initialized yet, show an error message
      const errorMessage: Message = {
        id: uuidv4(),
        text: "Sorry, I'm still initializing. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
      return
    }

    try {
      console.log("Sending message to agent:", text)
      // Call the agent with the user's message
      const response = await agentExecutor(text)
      console.log("Received raw response from agent:", response)

      try {
        // Try to parse the response as JSON
        const parsedResponse = JSON.parse(response)
        console.log("Parsed response:", parsedResponse)

        // Handle the case where the API returns "image" instead of "imageURL"
        if (parsedResponse.image && !parsedResponse.imageURL) {
          parsedResponse.imageURL = parsedResponse.image
          console.log("Converted 'image' field to 'imageURL':", parsedResponse.imageURL)
        }

        // Log when we receive a geometryCode
        if (parsedResponse.geometryCODE && parsedResponse.geometryCODE.trim() !== "") {
          console.log("Received geometryCode:", parsedResponse.geometryCODE.substring(0, 30) + "...")
          addNotification(NOTIFICATION_MESSAGES.routeGenerated)
        }

        // Enhanced handling of location coordinates
        if (parsedResponse.locationCoordinates) {
          console.log("Received location coordinates:", parsedResponse.locationCoordinates)

          try {
            // Validate coordinates before processing
            const lat =
              typeof parsedResponse.locationCoordinates.latitude === "string"
                ? Number.parseFloat(parsedResponse.locationCoordinates.latitude.trim())
                : parsedResponse.locationCoordinates.latitude

            const lng =
              typeof parsedResponse.locationCoordinates.longitude === "string"
                ? Number.parseFloat(parsedResponse.locationCoordinates.longitude.trim())
                : parsedResponse.locationCoordinates.longitude

            console.log("Parsed coordinates:", { lat, lng })

            // Check if coordinates are valid numbers
            if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) {
              // Clamp to valid ranges
              const validLat = Math.max(-90, Math.min(90, lat))
              const validLng = Math.max(-180, Math.min(180, lng))

              console.log("Valid coordinates:", { validLat, validLng })

              // Show notification for valid coordinates
              addNotification({
                ...NOTIFICATION_MESSAGES.locationFound,
                message: `Disaster location found at ${validLat.toFixed(6)}, ${validLng.toFixed(6)}. The map has been updated.`,
              })

              // Add a new marker for the location
              const newMarker: MapMarker = {
                id: Date.now(),
                title: "Disaster Location",
                coordinates: [validLng, validLat], // Mapbox uses [lng, lat] order
                type: "danger", // Mark as danger type for better visibility
                details: `Location identified from your query: ${text}`,
                severity: "high",
              }

              // Add the new marker to the map
              setMapMarkers((prev) => {
                // Filter out any previous disaster location markers to avoid duplicates
                const filteredMarkers = prev.filter((marker) => marker.title !== "Disaster Location")
                return [...filteredMarkers, newMarker]
              })

              // If we're not already on the map tab, show a prompt to view the map
              if (activeTab !== "map") {
                setTimeout(() => {
                  addNotification({
                    id: "view-map-prompt",
                    title: "Disaster Location Detected",
                    message: "Click to see the location on the full map",
                    type: "alert",
                    duration: 10000,
                  })
                }, 2000)
              }
            } else {
              console.warn("Invalid coordinates received:", parsedResponse.locationCoordinates)
            }
          } catch (error) {
            console.error("Error processing location coordinates:", error)
          }
        }

        // Create a bot message with the parsed response
        const botMessage: Message = {
          id: uuidv4(),
          text: parsedResponse.output || "I couldn't process your request properly.",
          sender: "bot",
          timestamp: new Date().toISOString(),
          geometryCODE:
            parsedResponse.geometryCODE && parsedResponse.geometryCODE.trim() !== ""
              ? parsedResponse.geometryCODE
              : undefined,
          imageURL:
            parsedResponse.imageURL && parsedResponse.imageURL.trim() !== "" ? parsedResponse.imageURL : undefined,
          locationCoordinates: parsedResponse.locationCoordinates || undefined,
        }

        setMessages((prev) => [...prev, botMessage])
      } catch (e) {
        console.error("Error parsing response:", e)
        // If parsing fails, use the response as plain text
        const botMessage: Message = {
          id: uuidv4(),
          text: response,
          sender: "bot",
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, botMessage])
      }
    } catch (error) {
      console.error("Error calling agent:", error)

      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        text: "Sorry, I encountered an error processing your request. Please try again.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFAQSelect = (question: string) => {
    handleSendMessage(question)
  }

  const activateEmergencyMode = () => {
    // Only activate emergency mode if there are active disasters
    if (disasterFeatures.length > 0) {
      setEmergencyMode(true)
      handleSendMessage("Activate emergency mode")
      addNotification(NOTIFICATION_MESSAGES.emergencyMode)

      // Add system message about emergency mode
      const systemMessage: Message = {
        id: uuidv4(),
        text: "⚠️ Emergency Mode Activated. Your messages will be prioritized. Please describe your situation.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, systemMessage])
    } else {
      // If no active disasters, show a notification that emergency mode can't be activated
      addNotification({
        id: "no-emergency-available",
        title: "No Active Disasters",
        message: "Emergency mode can only be activated during an active disaster event.",
        type: "info",
        duration: 5000,
      })
    }
  }

  const handleNewChat = () => {
    setEmergencyMode(false)
    setMessages([])
    if (activeTab !== "chat") {
      setActiveTab("chat")
    }
  }

  const handleMarkerClick = (marker: MapMarker) => {
    // Add a message about the marker that was clicked
    const markerMessage: Message = {
      id: uuidv4(),
      text: `You selected: ${marker.title}. ${marker.details || ""}`,
      sender: "bot",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, markerMessage])

    // Add notification
    addNotification({
      id: `marker-${marker.id}`,
      title: marker.title,
      message: marker.details || `${marker.type} location`,
      type: marker.type === "danger" ? "alert" : "info",
      duration: 5000,
    })

    // Switch to chat tab to show the message
    setActiveTab("chat")
  }

  const handleAudioReportSubmitted = (reportData: any) => {
    console.log("Audio report submitted:", reportData)

    const newMarker = {
      id: Date.now(),
      type:
        reportData.emergencyType.toLowerCase() === "flood"
          ? "danger"
          : reportData.emergencyType.toLowerCase() === "fire"
            ? "danger"
            : reportData.emergencyType.toLowerCase() === "medical"
              ? "resource"
              : "danger",
      coordinates: reportData.coordinates || [-74.01, 40.71], // Default to NYC if no coordinates
      title: `${reportData.emergencyType} - ${reportData.location}`,
      severity: reportData.severity,
      details: reportData.transcription,
      status: "open",
    }

    setMapMarkers((prev) => [...prev, newMarker])

    // Add a new disaster feature if it's a disaster type
    if (["flood", "fire", "earthquake", "hurricane"].includes(reportData.emergencyType.toLowerCase())) {
      // Create a simple polygon around the reported location
      const lng = reportData.coordinates[0]
      const lat = reportData.coordinates[1]
      const offset = 0.01 // Roughly 1km

      const newDisaster: DisasterFeature = {
        id: `disaster-report-${Date.now()}`,
        properties: {
          name: `${reportData.emergencyType} at ${reportData.location}`,
          disasterType: reportData.emergencyType.toLowerCase(),
          severity: reportData.severity.toLowerCase(),
          description: reportData.transcription,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [lng - offset, lat - offset],
              [lng + offset, lat - offset],
              [lng + offset, lat + offset],
              [lng - offset, lat + offset],
              [lng - offset, lat - offset],
            ],
          ],
        },
      }

      setDisasterFeatures((prev) => [...prev, newDisaster])

      // Update current disaster if needed
      if (!currentDisaster) {
        setCurrentDisaster(reportData.emergencyType)
      }
    }

    handleSendMessage(
      `I've reported a ${reportData.severity.toLowerCase()} ${reportData.emergencyType.toLowerCase()} emergency at ${reportData.location}.`,
    )

    addNotification({
      id: `report-${Date.now()}`,
      title: "Emergency Report Submitted",
      message: `${reportData.severity} ${reportData.emergencyType} at ${reportData.location}`,
      type: "alert",
      duration: 8000,
    })

    setTimeout(() => {
      handleSendMessage(
        `Thank you for your report. Emergency services have been notified about the ${reportData.emergencyType.toLowerCase()} at ${reportData.location}. Your report has been added to the map. Please stay safe and follow any evacuation instructions.`,
      )
    }, 1000)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleRoleChange = (role: "user" | "admin") => {
    setUserRole(role)
  }

  const handleNavigate = (tab: string) => {
    setActiveTab(tab)
  }

  // Extract the latest geometryCode from messages
  const getLatestGeometryCode = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].geometryCODE) {
        return messages[i].geometryCODE
      }
    }
    return undefined
  }

  // Extract the latest location coordinates from messages
  const getLatestLocationCoordinates = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].locationCoordinates) {
        console.log("Found location coordinates in message:", messages[i].locationCoordinates)
        return messages[i].locationCoordinates
      }
    }
    return undefined
  }

  return (
    <>
      <div className="flex flex-col justify-between items-center min-h-screen mx-auto">
        <AppHeader
          title="Antaeus"
          currentDisaster={currentDisaster}
          userRole={userRole}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />

        <NotificationSystem notifications={notifications} removeNotification={removeNotification} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
          <div className="sticky top-[57px] z-10 bg-background border-b px-4 py-2">
            <AppTabs userRole={userRole} />
          </div>

          <div className="flex-1 p-4">
            <TabsContent value="dashboard" className="m-0">
              {userRole === "user" ? (
                <UserDashboard
                  currentDisaster={currentDisaster}
                  onNavigate={handleNavigate}
                  disasterFeatures={disasterFeatures}
                />
              ) : (
                <AdminDashboard currentDisaster={currentDisaster} onNavigate={handleNavigate} />
              )}
            </TabsContent>

            <TabsContent value="chat" className="m-0 p-0 items-end">
              <ChatContainer
                messages={messages}
                emergencyMode={emergencyMode}
                mapMarkers={mapMarkers}
                currentDisaster={currentDisaster}
                faqSuggestions={FAQ_SUGGESTIONS}
                bubbleColor={bubbleColor}
                onSendMessage={handleSendMessage}
                onFAQSelect={handleFAQSelect}
                onActivateEmergency={activateEmergencyMode}
                onNewChat={handleNewChat}
                onMarkerClick={handleMarkerClick}
                onOpenFullMap={() => handleNavigate("map")}
                userRole={userRole}
                isLoading={isLoading}
                disasterFeatures={disasterFeatures}
              />
            </TabsContent>

            <TabsContent value="map" className="m-0 h-[calc(100vh-160px)]">
              <div className="w-full h-full rounded-lg border overflow-hidden">
                <MapComponent
                  markers={mapMarkers}
                  currentDisaster={currentDisaster}
                  onMarkerClick={handleMarkerClick}
                  onClose={() => setActiveTab("dashboard")}
                  geometryCode={getLatestGeometryCode()}
                  locationCoordinates={getLatestLocationCoordinates()}
                  disasterFeatures={disasterFeatures}
                />
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="m-0">
              <AlertsPanel currentDisaster={currentDisaster} />
            </TabsContent>

            <TabsContent value="resources" className="m-0">
              <ResourcesPanel currentDisaster={currentDisaster} />
            </TabsContent>

            <TabsContent value="voice-report" className="m-0">
              <AudioReport onReportSubmitted={handleAudioReportSubmitted} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        currentDisaster={currentDisaster}
        userRole={userRole}
        onRoleChange={handleRoleChange}
      />

      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={toggleSidebar} />}
    </>
  )
}

