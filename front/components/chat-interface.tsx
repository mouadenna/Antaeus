
"use client"
//chat-interface
import { useState, useEffect } from "react"
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
import { faqSuggestions, notificationMessages } from "@/data/chat-data"
// (Removed unused import)
import { initializeAgent } from './chat/agent';
import { useMessageProcessor } from './chat/useMessageProcessor';

export default function ChatInterface() {
  const [inputState] = useState("")
  const [bubbleColor] = useState("bg-gray-100")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [currentDisaster, setCurrentDisaster] = useState<string | null>(null)
  const [mapMarkers, setMapMarkers] = useState<any[]>([])
  const [userRole, setUserRole] = useState<"user" | "admin">("user")
  const { notifications, addNotification, removeNotification } = useNotifications()

  // Initialize the agent and message processor
  const [executor, setExecutor] = useState<any>(null)
  const { messages, handleSend } = useMessageProcessor(executor)

  useEffect(() => {
    const initAgent = async () => {
      const agent = await initializeAgent()
      setExecutor(agent)
    }
    initAgent()
  }, [])

  const handleFAQ = (question: string) => {
    handleSend(question)
  }

  const handleSendMessage = (message: string) => {
    handleSend(message)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleNewChat = () => {
    setEmergencyMode(false)
    setCurrentDisaster(null)
    setMapMarkers([])
    if (activeTab !== "chat") {
      setActiveTab("chat")
    }
  }

  const activateEmergencyMode = () => {
    setEmergencyMode(true)
    handleSend("Activate emergency mode")
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

    handleSend(`I've reported a ${reportData.severity.toLowerCase()} ${reportData.emergencyType.toLowerCase()} emergency at ${reportData.location}.`)

    addNotification({
      title: "Emergency Report Submitted",
      message: `${reportData.severity} ${reportData.emergencyType} at ${reportData.location}`,
      type: "alert",
    })

    setTimeout(() => {
      handleSend(
        `Thank you for your report. Emergency services have been notified about the ${reportData.emergencyType.toLowerCase()} at ${reportData.location}. Your report has been added to the map. Please stay safe and follow any evacuation instructions.`
      )
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
          messages={messages.map((msg) => msg.text)}
          emergencyMode={emergencyMode}
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
          userRole={"user"}
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