"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import Sidebar from "./sidebar"
import AlertsPanel from "./alerts-panel"
import ResourcesPanel from "./resources-panel"
import AudioReport from "./audio-report"
import UserDashboard from "./user-dashboard"
import AdminDashboard from "./admin-dashboard"
import MapComponent from "./map-component"
import NotificationSystem, { useNotifications } from "./notification-system"
import { AppHeader } from "./chat/app-header"
import { AppTabs } from "./chat/app-tabs"
import { ChatContainer } from "./chat/chat-container"
import { faqSuggestions, chatResponses, notificationMessages } from "@/data/chat-data"
import { getMarkersByDisasterType } from "@/data/map-data"

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

  const handleFAQ = (question: string) => {
    setMessages([...messages, question])

    // Simulate response based on the question
    setTimeout(() => {
      let response = ""

      if (question.includes("report")) {
        response = chatResponses.emergency
        addNotification(notificationMessages.emergencyMode)
      } else if (question.includes("shelters")) {
        response = chatResponses.shelter
        setMapMarkers(getMarkersByDisasterType("flood").filter((marker) => marker.type === "shelter"))
        addNotification(notificationMessages.sheltersLocated)
      } else if (question.includes("supplies")) {
        response = chatResponses.supplies
        addNotification(notificationMessages.resourcesAvailable)
      } else {
        response = chatResponses.default
      }

      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  const processMessage = (message: string) => {
    const lowerMessage = message.toLowerCase()

    setTimeout(() => {
      let response = ""

      if (lowerMessage.includes("emergency") || lowerMessage.includes("disaster")) {
        setEmergencyMode(true)
        response = chatResponses.emergency
        addNotification(notificationMessages.emergencyMode)
      } else if (lowerMessage.includes("flood")) {
        setCurrentDisaster("Flood")
        response = chatResponses.flood
        setMapMarkers(getMarkersByDisasterType("flood"))
        addNotification(notificationMessages.floodAlert)
      } else if (lowerMessage.includes("fire")) {
        setCurrentDisaster("Fire")
        response = chatResponses.fire
        setMapMarkers(getMarkersByDisasterType("fire"))
        addNotification(notificationMessages.fireAlert)
      } else if (lowerMessage.includes("earthquake")) {
        setCurrentDisaster("Earthquake")
        response = chatResponses.earthquake
        setMapMarkers(getMarkersByDisasterType("earthquake"))
        addNotification(notificationMessages.earthquakeAlert)
      } else if (lowerMessage.includes("shelter") || lowerMessage.includes("evacuation")) {
        response = chatResponses.shelter
        setMapMarkers(
          getMarkersByDisasterType(currentDisaster).filter(
            (marker) => marker.type === "shelter" || marker.type === "evacuation",
          ),
        )
        addNotification(notificationMessages.sheltersLocated)
      } else if (lowerMessage.includes("resource") || lowerMessage.includes("supplies")) {
        response = chatResponses.supplies
        addNotification(notificationMessages.resourcesAvailable)
      } else if (lowerMessage.includes("alert") || lowerMessage.includes("warning")) {
        response = chatResponses.alerts
        addNotification(notificationMessages.alertsPanel)
      } else if (lowerMessage.includes("voice") || lowerMessage.includes("audio") || lowerMessage.includes("record")) {
        response = chatResponses.voice
      } else if (lowerMessage.includes("dashboard") || lowerMessage.includes("overview")) {
        response = chatResponses.dashboard
      } else if (lowerMessage.includes("help")) {
        response = chatResponses.help
      } else {
        response = chatResponses.default
      }

      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  const handleSendMessage = (message: string) => {
    setMessages([...messages, message])
    processMessage(message)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleNewChat = () => {
    setMessages([])
    setEmergencyMode(false)
    setCurrentDisaster(null)
    setMapMarkers([])
    // Don't change the active tab - stay in chat
    if (activeTab !== "chat") {
      setActiveTab("chat")
    }
  }

  const activateEmergencyMode = () => {
    setEmergencyMode(true)
    setMessages([...messages, chatResponses.emergency])
    addNotification(notificationMessages.emergencyMode)
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
      coordinates: reportData.coordinates,
      title: `${reportData.emergencyType} - ${reportData.location}`,
      severity: reportData.severity,
      reportTime: new Date().toLocaleTimeString(),
      details: reportData.transcription,
    }

    setMapMarkers((prev) => [...prev, newMarker])

    if (!currentDisaster) {
      setCurrentDisaster(reportData.emergencyType)
    }

    setMessages((prev) => [
      ...prev,
      `I've reported a ${reportData.severity.toLowerCase()} ${reportData.emergencyType.toLowerCase()} emergency at ${reportData.location}.`,
    ])

    addNotification({
      title: "Emergency Report Submitted",
      message: `${reportData.severity} ${reportData.emergencyType} at ${reportData.location}`,
      type: "alert",
    })

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

  const handleMarkerClick = (marker: any) => {
    addNotification({
      title: marker.title,
      message: marker.details || `${marker.type} location`,
      type: marker.type === "danger" ? "alert" : "info",
    })
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl flex-1 flex flex-col">
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

            <TabsContent value="chat" className="m-0 p-0  items-end">
              <ChatContainer
              messages={messages}
              emergencyMode={emergencyMode}
              userRole={userRole}
              mapMarkers={mapMarkers}
              currentDisaster={currentDisaster}
              faqSuggestions={faqSuggestions}
              bubbleColor={bubbleColor}
              onSendMessage={handleSendMessage}
              onFAQSelect={handleFAQ}
              onActivateEmergency={activateEmergencyMode}
              onNewChat={handleNewChat}
              onMarkerClick={handleMarkerClick}
              onOpenFullMap={() => handleNavigate("map")}
              />
            </TabsContent>

            <TabsContent value="map" className="m-0">
              <MapComponent markers={mapMarkers} currentDisaster={currentDisaster} />
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

