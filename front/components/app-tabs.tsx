"use client"

import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, MessageCircle, Map, Bell, Package, Mic } from "lucide-react"

interface AppTabsProps {
  userRole: "user" | "admin"
}

export function AppTabs({ userRole }: AppTabsProps) {
  return (
    <TabsList className="grid grid-cols-6 h-14">
      <TabsTrigger
        value="dashboard"
        className="flex flex-col items-center justify-center data-[state=active]:bg-blue-50"
      >
        <Home className="h-4 w-4" />
        <span className="text-xs mt-1">Dashboard</span>
      </TabsTrigger>
      <TabsTrigger value="chat" className="flex flex-col items-center justify-center data-[state=active]:bg-blue-50">
        <MessageCircle className="h-4 w-4" />
        <span className="text-xs mt-1">Chat</span>
      </TabsTrigger>
      <TabsTrigger value="map" className="flex flex-col items-center justify-center data-[state=active]:bg-blue-50">
        <Map className="h-4 w-4" />
        <span className="text-xs mt-1">Map</span>
      </TabsTrigger>
      <TabsTrigger value="alerts" className="flex flex-col items-center justify-center data-[state=active]:bg-blue-50">
        <Bell className="h-4 w-4" />
        <span className="text-xs mt-1">Alerts</span>
      </TabsTrigger>
      <TabsTrigger
        value="resources"
        className="flex flex-col items-center justify-center data-[state=active]:bg-blue-50"
      >
        <Package className="h-4 w-4" />
        <span className="text-xs mt-1">Resources</span>
      </TabsTrigger>
      <TabsTrigger
        value="voice-report"
        className="flex flex-col items-center justify-center data-[state=active]:bg-blue-50"
      >
        <Mic className="h-4 w-4" />
        <span className="text-xs mt-1">Report</span>
      </TabsTrigger>
    </TabsList>
  )
}

