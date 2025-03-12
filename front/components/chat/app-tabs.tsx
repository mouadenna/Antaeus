"use client"
import { MessageSquare, MapPin, Bell, Mic, Package } from "lucide-react"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AppTabsProps {
  userRole: "user" | "admin"
}

export function AppTabs({ userRole }: AppTabsProps) {
  if (userRole === "user") {
    return (
      <TabsList className="grid w-full grid-cols-5 h-auto p-2 bg-transparent gap-2">
        <TabsTrigger
          value="dashboard"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
        >
          <span className="hidden sm:inline">Dashboard</span>
          <span className="sm:hidden">Home</span>
        </TabsTrigger>
        <TabsTrigger
          value="chat"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
        >
          <MessageSquare className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Chat</span>
        </TabsTrigger>
        <TabsTrigger value="map" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2">
          <MapPin className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Map</span>
        </TabsTrigger>
        <TabsTrigger
          value="alerts"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
        >
          <Bell className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Alerts</span>
        </TabsTrigger>
        <TabsTrigger
          value="voice-report"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
        >
          <Mic className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Report</span>
        </TabsTrigger>
      </TabsList>
    )
  }

  return (
    <TabsList className="grid w-full grid-cols-5 h-auto p-2 bg-transparent gap-2">
      <TabsTrigger
        value="dashboard"
        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
      >
        <span className="hidden sm:inline">Dashboard</span>
        <span className="sm:hidden">Home</span>
      </TabsTrigger>
      <TabsTrigger value="map" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2">
        <MapPin className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Map</span>
      </TabsTrigger>
      <TabsTrigger
        value="resources"
        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
      >
        <Package className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Resources</span>
      </TabsTrigger>
      <TabsTrigger
        value="alerts"
        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
      >
        <Bell className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Alerts</span>
      </TabsTrigger>
      <TabsTrigger 
      value="chat" 
      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2">
        <MessageSquare className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Comms</span>
      </TabsTrigger>
    </TabsList>
  )
}