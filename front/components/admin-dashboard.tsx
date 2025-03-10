"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Bell,
  Compass,
  Home,
  MapPin,
  Mic,
  Package,
  Shield,
  Truck,
  Users,
  Waves,
  Wind,
  Flame,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "./dashboard/dashboard-header"
import { QuickActionsGrid } from "./dashboard/quick-actions-grid"
import { StatsSummary } from "./dashboard/stats-summary"
import { DashboardGrid } from "./dashboard/dashboard-grid"
import { AlertsList } from "./dashboard/alerts-list"
import { WeatherAlertsList } from "./dashboard/weather-alerts-list"
import { TimelineList } from "./dashboard/timeline-list"
import { ResourceAllocation } from "./dashboard/resource-allocation"
import { DashboardCard } from "./dashboard/dashboard-card"
import { Button } from "@/components/ui/button"
import {
  emergencyStats,
  resourceStats,
  recentReports,
  teamStatus,
  weatherAlerts,
  timelineEvents,
} from "@/data/dashboard-data"

interface DashboardProps {
  currentDisaster: string | null
  onNavigate: (tab: string) => void
}

export default function Dashboard({ currentDisaster, onNavigate }: DashboardProps) {
  const [activeView, setActiveView] = useState("overview")
  const [timeRange, setTimeRange] = useState("24h")
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString())

  const handleRefresh = () => {
    // In a real app, this would fetch fresh data
    setLastUpdated(new Date().toLocaleTimeString())
  }

  // Quick actions configuration
  const quickActions = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "View Map",
      onClick: () => onNavigate("map"),
    },
    {
      icon: <Mic className="h-8 w-8 text-indigo-600" />,
      title: "Voice Report",
      onClick: () => onNavigate("voice-report"),
    },
    {
      icon: <Bell className="h-8 w-8 text-amber-600" />,
      title: "Alerts",
      badgeCount: weatherAlerts.length > 0 ? weatherAlerts.length : undefined,
      onClick: () => onNavigate("alerts"),
    },
    {
      icon: <Package className="h-8 w-8 text-purple-600" />,
      title: "Resources",
      badgeCount: emergencyStats.pendingRequests > 0 ? emergencyStats.pendingRequests : undefined,
      badgeVariant: "destructive" as "destructive",
      onClick: () => onNavigate("resources"),
    },
  ]

  // Stats configuration
  const statsItems = [
    { label: "Active Incidents", value: emergencyStats.activeIncidents, color: "text-red-600" },
    { label: "Pending Requests", value: emergencyStats.pendingRequests, color: "text-amber-600" },
    { label: "Deployed Teams", value: emergencyStats.deployedTeams, color: "text-blue-600" },
    { label: "Affected Areas", value: emergencyStats.affectedAreas, color: "text-purple-600" },
    { label: "Evacuation Centers", value: emergencyStats.evacuationCenters, color: "text-green-600" },
    { label: "People Evacuated", value: emergencyStats.peopleEvacuated, color: "text-indigo-600" },
  ]

  // Format resources for ResourceAllocation component
  const formattedResources = {
    water: { label: "Water Supplies", ...resourceStats.water },
    food: { label: "Food Kits", ...resourceStats.food },
    medical: { label: "Medical Supplies", ...resourceStats.medical },
    shelter: { label: "Shelter Capacity", ...resourceStats.shelter },
  }

  // Get disaster icon
  const getDisasterIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "flood":
        return <Waves className="h-5 w-5" />
      case "fire":
        return <Flame className="h-5 w-5" />
      case "building damage":
        return <Home className="h-5 w-5" />
      case "medical emergency":
        return <Shield className="h-5 w-5" />
      case "road blockage":
        return <Compass className="h-5 w-5" />
      case "heavy rain":
        return <Waves className="h-5 w-5" />
      case "strong winds":
        return <Wind className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  // Add icons to reports
  const reportsWithIcons = recentReports.map((report) => ({
    ...report,
    icon: getDisasterIcon(report.type),
    reportMethod: report.reportMethod === "voice" ? "voice" as const : "text" as const,
  }))

  // Add icons to weather alerts
  const weatherAlertsWithIcons = weatherAlerts.map((alert) => ({
    ...alert,
    icon: getDisasterIcon(alert.type),
  }))

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Disaster Response Dashboard"
        currentDisaster={currentDisaster}
        lastUpdated={lastUpdated}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onRefresh={handleRefresh}
      />

      {/* Dashboard Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Quick Action Cards */}
      <QuickActionsGrid actions={quickActions} />

      {/* Main Dashboard Content */}
      <TabsContent value="overview" className="mt-0">
        {/* Status Summary Cards */}
        <StatsSummary stats={statsItems} />

        {/* Recent Reports and Weather Alerts */}
        <DashboardGrid>
          <AlertsList
            title="Recent Reports"
            alerts={reportsWithIcons}
            onViewAll={() => onNavigate("map")}
            onViewDetails={(id) => console.log("View details for report", id)}
          />

          <div className="space-y-6">
            <WeatherAlertsList alerts={weatherAlertsWithIcons} onViewAll={() => onNavigate("alerts")} />

            <TimelineList
              title="Response Timeline"
              events={timelineEvents.map((event) => ({
                ...event,
                icon:
                  event.icon === "alert-triangle" ? (
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                  ) : event.icon === "users" ? (
                    <Users className="h-5 w-5 text-indigo-600" />
                  ) : event.icon === "home" ? (
                    <Home className="h-5 w-5 text-green-600" />
                  ) : (
                    <Truck className="h-5 w-5 text-purple-600" />
                  ),
              }))}
            />
          </div>
        </DashboardGrid>
      </TabsContent>

      <TabsContent value="resources" className="mt-0">
        <DashboardGrid>
          <ResourceAllocation
            resources={formattedResources}
            onViewDetails={() => onNavigate("resources")}
            onRequestSupplies={() => console.log("Request supplies")}
          />

          <DashboardCard title="Distribution Centers" description="Active supply distribution points">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Central Distribution Hub</h4>
                    <Button variant="outline" size="sm">
                      View on Map
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">City Hall, Downtown</p>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Capacity: High</span>
                    <span>Open 24/7</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">North Community Center</h4>
                    <Button variant="outline" size="sm">
                      View on Map
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Highland District</p>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Capacity: Medium</span>
                    <span>Open 8AM-8PM</span>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </DashboardGrid>
      </TabsContent>

      <TabsContent value="teams" className="mt-0">
        <DashboardGrid>
          <DashboardCard
            title="Team Status"
            description="Active response teams and their locations"
            footer={
              <Button variant="outline" size="sm" className="w-full">
                Manage Teams
              </Button>
            }
          >
            <div className="space-y-4">
              {teamStatus.map((team) => (
                <div key={team.id} className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-indigo-100">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{team.name}</h4>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        Contact
                      </Button>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{team.members} members</span>
                      <span>{team.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Team Assignments"
            description="Current mission assignments and status"
            footer={
              <Button variant="outline" size="sm" className="w-full">
                Create New Assignment
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Search & Rescue Operation</h4>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                    View Details
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Search & Rescue Alpha team conducting operations in Downtown area
                </p>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Started: 2 hours ago</span>
                  <span>Priority: High</span>
                </div>
              </div>
            </div>
          </DashboardCard>
        </DashboardGrid>
      </TabsContent>
    </div>
  )
}

