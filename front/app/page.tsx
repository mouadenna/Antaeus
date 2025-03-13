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
}

// Sample map markers
const SAMPLE_MARKERS: MapMarker[] = [
  {
    id: 1,
    title: "Main Evacuation Center",
    coordinates: [-74.006, 40.7128], // NYC
    type: "shelter",
    details: "Capacity for 500 people",
    capacity: 500,
    status: "open",
  },
  {
    id: 2,
    title: "Flooded Area",
    coordinates: [-73.95, 40.72],
    type: "danger",
    details: "Severe flooding reported",
    severity: "high",
  },
  {
    id: 3,
    title: "Medical Supply Station",
    coordinates: [-74.02, 40.73],
    type: "resource",
    details: "First aid, medications, and medical staff available",
    status: "open",
  },
  {
    id: 4,
    title: "Evacuation Pickup Point",
    coordinates: [-73.98, 40.75],
    type: "evacuation",
    details: "Buses arrive every 30 minutes",
    status: "open",
  },
]

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: string
  geometryCODE?: string
  imageURL?: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [activeTab, setActiveTab] = useState("dashboard")
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>(SAMPLE_MARKERS)
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

        // Log when we receive a geometryCode
        if (parsedResponse.geometryCODE && parsedResponse.geometryCODE.trim() !== "") {
          console.log("Received geometryCode:", parsedResponse.geometryCODE.substring(0, 30) + "...")
          addNotification(NOTIFICATION_MESSAGES.routeGenerated)
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
  }

  const handleNewChat = () => {
    setEmergencyMode(false)
    setCurrentDisaster(null)
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

    if (!currentDisaster) {
      setCurrentDisaster(reportData.emergencyType)
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
                <UserDashboard currentDisaster={currentDisaster} onNavigate={handleNavigate} />
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
              />
            </TabsContent>

            <TabsContent value="map" className="m-0">
              <div className="w-full h-[calc(100vh-160px)] rounded-lg border overflow-hidden">
                <MapComponent
                  markers={mapMarkers}
                  currentDisaster={currentDisaster}
                  onMarkerClick={handleMarkerClick}
                  onClose={() => {}}
                  geometryCode={getLatestGeometryCode()}
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

