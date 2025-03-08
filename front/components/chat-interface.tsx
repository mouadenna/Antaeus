"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Mic, MessageSquare, MapPin, Bell, Package } from "lucide-react"
import Sidebar from "./sidebar"
import AlertsPanel from "./alerts-panel"
import ResourcesPanel from "./resources-panel"
import AudioReport from "./audio-report"
import UserDashboard from "./user-dashboard"
import AdminDashboard from "./admin-dashboard"
import RoleSelector from "./role-selector"
import MapComponent from "./map-component"
import NotificationSystem, { useNotifications } from "./notification-system"

export default function ChatInterface() {
  const [inputState, setInputState] = useState("")
  const [bubbleColor, setBubbleColor] = useState("bg-gray-100")
  const [messages, setMessages] = useState<string[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [currentDisaster, setCurrentDisaster] = useState<string | null>(null)
  const [mapMarkers, setMapMarkers] = useState<any[]>([])
  const [userRole, setUserRole] = useState<"user" | "admin">("user")
  const { notifications, addNotification, removeNotification } = useNotifications()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleFAQ = (question: string) => {
    setMessages([...messages, question])

    // Simulate response based on the question
    setTimeout(() => {
      let response = ""

      if (question.includes("report")) {
        response =
          "To report a disaster, please provide the following information: 1) Type of disaster 2) Location 3) Severity 4) Any immediate needs. You can also use the Map tab to mark the exact location."

        // Show notification
        addNotification({
          title: "Report Instructions",
          message: "Please provide details about the emergency situation",
          type: "info",
        })
      } else if (question.includes("shelters")) {
        response =
          "I'm showing all available shelters on the map now. The nearest one to your location is Central High School (2.3 miles away) with capacity for 350 people."

        // Add shelter markers to map
        setMapMarkers([
          {
            id: 1,
            type: "shelter",
            coordinates: [40.7128, -74.006],
            title: "Central High School",
            capacity: 350,
            status: "Open",
          },
          {
            id: 2,
            type: "shelter",
            coordinates: [40.72, -74.01],
            title: "Community Center",
            capacity: 200,
            status: "Open",
          },
          {
            id: 3,
            type: "shelter",
            coordinates: [40.73, -74.02],
            title: "North Elementary",
            capacity: 150,
            status: "Almost Full",
          },
        ])

        // Show notification
        addNotification({
          title: "Shelters Located",
          message: "Showing 3 nearby shelters on the map",
          type: "success",
        })
      } else if (question.includes("supplies")) {
        response =
          "To request emergency supplies, please specify: 1) Type of supplies needed 2) Quantity 3) Delivery location 4) Urgency level. I've opened the Resources tab where you can also make formal requests."

        // Show notification
        addNotification({
          title: "Supply Request",
          message: "Please provide details about needed supplies",
          type: "info",
        })
      }

      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputState(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value !== "") {
      const message = e.currentTarget.value
      setMessages([...messages, message])
      e.currentTarget.value = ""
      setInputState("")

      // Process message for commands and responses
      processMessage(message)
    }
  }

  const processMessage = (message: string) => {
    const lowerMessage = message.toLowerCase()

    setTimeout(() => {
      let response = ""

      // Handle different types of queries
      if (lowerMessage.includes("emergency") || lowerMessage.includes("disaster")) {
        setEmergencyMode(true)
        response =
          "Emergency mode activated. What type of disaster are you reporting? (Flood, Fire, Earthquake, Hurricane, Other)"

        // Show notification
        addNotification({
          title: "Emergency Mode Activated",
          message: "Please provide details about the emergency",
          type: "alert",
          duration: 0, // Won't auto-dismiss
        })
      } else if (lowerMessage.includes("flood")) {
        setCurrentDisaster("Flood")
        response =
          "Flood alert registered. I'm showing flood-prone areas and evacuation routes on the map. Please share your specific location for more targeted assistance."

        // Add flood-related markers
        setMapMarkers([
          { id: 1, type: "danger", coordinates: [40.7128, -74.006], title: "Flood Zone A - High Risk" },
          { id: 2, type: "evacuation", coordinates: [40.72, -74.01], title: "Evacuation Route 1" },
          { id: 3, type: "shelter", coordinates: [40.73, -74.02], title: "Flood Shelter - Highland School" },
        ])

        // Show notification
        addNotification({
          title: "Flood Alert",
          message: "Flood warning issued for your area. Evacuation routes shown on map.",
          type: "alert",
        })
      } else if (lowerMessage.includes("fire")) {
        setCurrentDisaster("Fire")
        response =
          "Fire alert registered. Showing active fire zones, wind direction, and safe evacuation routes on the map. Please stay away from marked danger areas."

        // Add fire-related markers
        setMapMarkers([
          { id: 1, type: "danger", coordinates: [40.7128, -74.006], title: "Active Fire Zone" },
          { id: 2, type: "evacuation", coordinates: [40.72, -74.01], title: "Fire Evacuation Route" },
          { id: 3, type: "resource", coordinates: [40.73, -74.02], title: "Fire Response Team" },
        ])

        // Show notification
        addNotification({
          title: "Fire Alert",
          message: "Fire warning issued for your area. Evacuation routes shown on map.",
          type: "alert",
        })
      } else if (lowerMessage.includes("earthquake")) {
        setCurrentDisaster("Earthquake")
        response =
          "Earthquake alert registered. Showing damaged areas, structural risks, and safe gathering points on the map. Avoid marked buildings with structural damage."

        // Add earthquake-related markers
        setMapMarkers([
          { id: 1, type: "danger", coordinates: [40.7128, -74.006], title: "Building Collapse Risk" },
          { id: 2, type: "shelter", coordinates: [40.72, -74.01], title: "Safe Gathering Point" },
          { id: 3, type: "resource", coordinates: [40.73, -74.02], title: "Search & Rescue Team" },
        ])

        // Show notification
        addNotification({
          title: "Earthquake Alert",
          message: "Earthquake warning issued. Safe gathering points shown on map.",
          type: "alert",
        })
      } else if (lowerMessage.includes("shelter") || lowerMessage.includes("evacuation")) {
        response =
          "Showing all nearby shelters and evacuation routes on the map. The closest shelter to you is Central High School (2.3 miles away)."

        // Add shelter markers
        setMapMarkers([
          {
            id: 1,
            type: "shelter",
            coordinates: [40.7128, -74.006],
            title: "Central High School",
            capacity: 350,
            status: "Open",
          },
          {
            id: 2,
            type: "shelter",
            coordinates: [40.72, -74.01],
            title: "Community Center",
            capacity: 200,
            status: "Open",
          },
          { id: 3, type: "evacuation", coordinates: [40.73, -74.02], title: "Main Evacuation Route" },
        ])

        // Show notification
        addNotification({
          title: "Shelters Located",
          message: "Showing nearby shelters and evacuation routes",
          type: "info",
        })
      } else if (lowerMessage.includes("resource") || lowerMessage.includes("supplies")) {
        response =
          "Opening resources panel. You can request emergency supplies, view available resources, and track supply deliveries here."

        // Show notification
        addNotification({
          title: "Resources Available",
          message: "Check available emergency supplies and request what you need",
          type: "info",
        })
      } else if (lowerMessage.includes("alert") || lowerMessage.includes("warning")) {
        response =
          "Opening alerts panel. You can view all current emergency alerts, weather warnings, and status updates here."

        // Show notification
        addNotification({
          title: "Alerts Panel",
          message: "Showing all active alerts and warnings for your area",
          type: "warning",
        })
      } else if (lowerMessage.includes("voice") || lowerMessage.includes("audio") || lowerMessage.includes("record")) {
        response = "Opening voice reporting tool. You can record an audio description of your emergency situation."
      } else if (lowerMessage.includes("dashboard") || lowerMessage.includes("overview")) {
        response = "Opening the dashboard to give you an overview of the current situation."
      } else if (lowerMessage.includes("help")) {
        response =
          "I can help with: 1) Reporting disasters 2) Finding shelters and evacuation routes 3) Requesting resources 4) Viewing alerts and warnings 5) Coordinating response teams. What do you need assistance with?"
      } else {
        response =
          "I understand you're looking for assistance. Could you please specify if you need help with evacuation, shelter information, resource requests, or emergency reporting?"
      }

      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleNewChat = () => {
    setMessages([])
    setEmergencyMode(false)
    setCurrentDisaster(null)
    setMapMarkers([])
    setActiveTab("dashboard")
  }

  const activateEmergencyMode = () => {
    setEmergencyMode(true)
    setMessages([...messages, "Emergency mode activated. Please specify the type of disaster and your location."])

    // Show notification
    addNotification({
      title: "Emergency Mode Activated",
      message: "Please provide details about the emergency",
      type: "alert",
      duration: 0, // Won't auto-dismiss
    })
  }

  const handleAudioReportSubmitted = (reportData: any) => {
    console.log("Audio report submitted:", reportData)

    // Add a new marker to the map based on the report
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
      coordinates: reportData.coordinates,
      title: `${reportData.emergencyType} - ${reportData.location}`,
      severity: reportData.severity,
      reportTime: new Date().toLocaleTimeString(),
      details: reportData.transcription,
    }

    setMapMarkers((prev) => [...prev, newMarker])

    // Set the current disaster type if not already set
    if (!currentDisaster) {
      setCurrentDisaster(reportData.emergencyType)
    }

    // Add a message to the chat
    setMessages((prev) => [
      ...prev,
      `I've reported a ${reportData.severity.toLowerCase()} ${reportData.emergencyType.toLowerCase()} emergency at ${reportData.location}.`,
    ])

    // Show notification
    addNotification({
      title: "Emergency Report Submitted",
      message: `${reportData.severity} ${reportData.emergencyType} at ${reportData.location}`,
      type: "alert",
    })

    // Show a confirmation message
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        `Thank you for your report. Emergency services have been notified about the ${reportData.emergencyType.toLowerCase()} at ${reportData.location}. Your report has been added to the map. Please stay safe and follow any evacuation instructions.`,
      ])
    }, 1000)
  }

  const handleNavigate = (tab: string) => {
    setActiveTab(tab)
  }

  const handleRoleChange = (role: "user" | "admin") => {
    setUserRole(role)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Determine which tabs to show based on user role
  const userTabs = (
    <TabsList className="grid grid-cols-5 mb-4">
      <TabsTrigger value="dashboard" className="flex items-center gap-1">
        <span className="hidden sm:inline">Dashboard</span>
      </TabsTrigger>
      <TabsTrigger value="chat" className="flex items-center gap-1">
        <MessageSquare className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Chat</span>
      </TabsTrigger>
      <TabsTrigger value="map" className="flex items-center gap-1">
        <MapPin className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Map</span>
      </TabsTrigger>
      <TabsTrigger value="alerts" className="flex items-center gap-1">
        <Bell className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Alerts</span>
      </TabsTrigger>
      <TabsTrigger value="voice-report" className="flex items-center gap-1 bg-blue-50">
        <Mic className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Report</span>
      </TabsTrigger>
    </TabsList>
  )

  const adminTabs = (
    <TabsList className="grid grid-cols-5 mb-4">
      <TabsTrigger value="dashboard" className="flex items-center gap-1">
        <span className="hidden sm:inline">Dashboard</span>
      </TabsTrigger>
      <TabsTrigger value="map" className="flex items-center gap-1">
        <MapPin className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Map</span>
      </TabsTrigger>
      <TabsTrigger value="resources" className="flex items-center gap-1">
        <Package className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Resources</span>
      </TabsTrigger>
      <TabsTrigger value="alerts" className="flex items-center gap-1">
        <Bell className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Alerts</span>
      </TabsTrigger>
      <TabsTrigger value="chat" className="flex items-center gap-1">
        <MessageSquare className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Comms</span>
      </TabsTrigger>
    </TabsList>
  )

  return (
    <>
      <div className="flex flex-col justify-between items-center min-h-screen mx-auto">
        <header
          className={`flex sticky top-0 justify-between items-center px-4 py-2 w-full text-gray-800 z-20 shadow-md ${emergencyMode ? "bg-red-100" : "bg-white"}`}
        >
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="p-2 text-2xl">
              {isSidebarOpen ? "✕" : "☰"}
            </button>
            <h1 className="text-2xl font-bold ml-4">Antaeus</h1>
            {currentDisaster && (
              <Badge variant="destructive" className="ml-4">
                {currentDisaster} Response Active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <RoleSelector currentRole={userRole} onRoleChange={handleRoleChange} />
            <div className="flex gap-2">
              {!emergencyMode && userRole === "user" && (
                <Button variant="destructive" className="font-semibold" onClick={activateEmergencyMode}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Emergency</span>
                </Button>
              )}
              <Button
                variant="outline"
                className="hover:bg-stone-500 font-semibold hover:text-gray-100 border-2 border-gray-500"
                onClick={handleNewChat}
              >
                <span className="hidden sm:inline">New Chat</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Notification system */}
        <NotificationSystem notifications={notifications} removeNotification={removeNotification} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl">
          {userRole === "user" ? userTabs : adminTabs}

          <TabsContent value="dashboard" className="min-h-[calc(100vh-200px)]">
            {userRole === "user" ? (
              <UserDashboard currentDisaster={currentDisaster} onNavigate={handleNavigate} />
            ) : (
              <AdminDashboard currentDisaster={currentDisaster} onNavigate={handleNavigate} />
            )}
          </TabsContent>

          <TabsContent value="chat" className="min-h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Chat section */}
              <div className="min-h-full w-full">
                {messages.length > 0 && (
                  <div className="p-4 self-end align-text-bottom w-full overflow-y-auto max-h-[calc(100vh-280px)]">
                    {messages.map((message, index) => (
                      <span key={index}>
                        {index % 2 === 0 ? (
                          <div className="flex justify-end items-center mb-8">
                            <div
                              className={`${bubbleColor} p-3 rounded-lg shadow-lg text-gray-800 text-lg max-w-xl sm:max-w-fit text-wrap break-words`}
                            >
                              <p>{message}</p>
                            </div>
                            <span>
                              <div className="w-[40px] h-[40px] rounded-md bg-gray-300 ml-2 flex items-center justify-center">
                                <span className="text-xl">👤</span>
                              </div>
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-start items-center mb-8">
                            <span>
                              <div className="w-[40px] h-[40px] rounded-md bg-blue-100 mr-2 flex items-center justify-center">
                                <span className="text-xl">🤖</span>
                              </div>
                            </span>
                            <div
                              className={`${bubbleColor} max-w-xl shadow-md text-gray-800 text-wrap break-words p-3 rounded-lg text-lg`}
                            >
                              <p>{message}</p>
                            </div>
                          </div>
                        )}
                      </span>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                {messages.length === 0 && (
                  <div className="flex-col justify-center items-center p-4">
                    <div className="w-[100px] h-[100px] rounded-full bg-blue-100 mx-auto mb-6 flex items-center justify-center">
                      <span className="text-4xl">🤖</span>
                    </div>
                    <h2 className="text-xl font-bold text-center mb-4">
                      {userRole === "user" ? "Disaster Response Assistant" : "Team Communication Center"}
                    </h2>
                    <p className="text-center text-gray-600 mb-6">
                      Ask me about emergency resources, evacuation routes, or report a situation. I can show information
                      on the map as we chat.
                    </p>
                    <div className="flex flex-col gap-2">
                      {["Where are the nearest shelters?", "I need to report flooding", "Show evacuation routes"].map(
                        (suggestion, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            className="justify-start text-left"
                            onClick={() => handleFAQ(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Chat input */}
                <div className="flex justify-center items-center mt-4 p-2">
                  <Input
                    type="text"
                    placeholder={emergencyMode ? "Describe the emergency situation..." : "Type your message..."}
                    className={`p-2 border-2 w-full bg-white border-stone-400 rounded-3xl focus:outline-none text-blue-950 focus:border-stone-600 hover:shadow-xl ${emergencyMode ? "border-red-400" : ""}`}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              {/* Map section */}
              <div className="min-h-full w-full border rounded-lg overflow-hidden bg-gray-50 shadow-inner">
                <div className="h-full w-full relative">
                  <div className="absolute top-4 left-4 right-4 z-10 bg-white/90 rounded-lg p-3 shadow-md">
                    <h3 className="font-medium mb-1">Interactive Map</h3>
                    <p className="text-sm text-gray-600">
                      {mapMarkers.length > 0
                        ? `Showing ${mapMarkers.length} locations related to your conversation`
                        : "Ask about shelters, evacuation routes, or report an incident to see them on the map"}
                    </p>
                  </div>

                  {/* Map component */}
                  <MapComponent
                    markers={mapMarkers}
                    currentDisaster={currentDisaster}
                    compact={true}
                    onMarkerClick={(marker) => {
                      // Show notification about the marker
                      addNotification({
                        title: marker.title,
                        message: marker.details || `${marker.type} location`,
                        type: marker.type === "danger" ? "alert" : "info",
                      })
                    }}
                  />

                  <div className="absolute bottom-4 right-4">
                    <Button
                      size="sm"
                      onClick={() => handleNavigate("map")}
                      className="bg-white text-gray-800 hover:bg-gray-100 shadow-md"
                    >
                      Open Full Map
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="map">
            <MapComponent markers={mapMarkers} currentDisaster={currentDisaster} />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel currentDisaster={currentDisaster} />
          </TabsContent>

          <TabsContent value="resources">
            <ResourcesPanel currentDisaster={currentDisaster} />
          </TabsContent>

          <TabsContent value="voice-report">
            <AudioReport onReportSubmitted={handleAudioReportSubmitted} />
          </TabsContent>
        </Tabs>
      </div>

      <Sidebar isOpen={isSidebarOpen} currentDisaster={currentDisaster} userRole={userRole} />

      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={toggleSidebar} />}
    </>
  )
}

