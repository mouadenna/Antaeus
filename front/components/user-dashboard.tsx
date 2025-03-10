"use client"

import { ShieldAlert, Home, Phone, Info, Bell, AlertTriangle } from "lucide-react"
import { DashboardSection } from "./dashboard/dashboard-section"
import { EmergencyBanner } from "./dashboard/emergency-banner"
import { QuickActionsGrid } from "./dashboard/quick-actions-grid"
import { DashboardGrid } from "./dashboard/dashboard-grid"
import { NearbyResourcesList } from "./dashboard/nearby-resources-list"
import { AlertsList } from "./dashboard/alerts-list"
import { EmergencyInstructions } from "./dashboard/emergency-instructions"
import { nearbyResources, activeAlerts } from "@/data/dashboard-data"

interface UserDashboardProps {
  currentDisaster: string | null
  onNavigate: (tab: string) => void
}

export default function UserDashboard({ currentDisaster, onNavigate }: UserDashboardProps) {
  // Quick actions configuration
  const quickActions = [
    {
      icon: <ShieldAlert className="h-8 w-8 text-red-600" />,
      title: "Report Emergency",
      onClick: () => onNavigate("voice-report"),
    },
    {
      icon: <Home className="h-8 w-8 text-blue-600" />,
      title: "Find Shelter",
      onClick: () => onNavigate("map"),
    },
    {
      icon: <Phone className="h-8 w-8 text-green-600" />,
      title: "Contact Help",
      onClick: () => onNavigate("chat"),
    },
    {
      icon: <Info className="h-8 w-8 text-amber-600" />,
      title: "Get Updates",
      onClick: () => onNavigate("alerts"),
    },
  ]

  // Emergency instructions
  const emergencyInstructions = [
    {
      step: 1,
      title: "Stay calm and assess the situation",
      description: "Check yourself and others for injuries. Determine if your location is safe.",
    },
    {
      step: 2,
      title: "Report your emergency",
      description: "Use the voice report feature or chat to describe your situation and location.",
    },
    {
      step: 3,
      title: "Follow official instructions",
      description: "Check alerts for evacuation routes and safety information.",
    },
    {
      step: 4,
      title: "Seek shelter if needed",
      description: "Use the map to find the nearest shelter or safe location.",
    },
  ]

  // Alert icons
  const getAlertIcon = (type: string) => {
    return <AlertTriangle className="h-5 w-5 text-red-600" />
  }

  // Add icons to alerts
  const alertsWithIcons = activeAlerts.map((alert) => ({
    ...alert,
    icon: getAlertIcon(alert.type),
  }))

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Emergency Banner */}
      {currentDisaster && <EmergencyBanner disasterType={currentDisaster} onGetHelpClick={() => onNavigate("chat")} />}

      {/* Quick Actions */}
      <DashboardSection>
        <QuickActionsGrid title="I Need Help With..." actions={quickActions} />
      </DashboardSection>

      {/* Nearby Resources and Active Alerts */}
      <DashboardSection>
        <DashboardGrid>
          <NearbyResourcesList resources={nearbyResources} onFindMore={() => onNavigate("map")} />

          <AlertsList
            title="Active Alerts"
            alerts={alertsWithIcons}
            emptyStateIcon={<Bell className="h-10 w-10 text-gray-400 mx-auto mb-2" />}
            onViewAll={() => onNavigate("alerts")}
          />
        </DashboardGrid>
      </DashboardSection>

      {/* Emergency Instructions */}
      <DashboardSection>
        <EmergencyInstructions instructions={emergencyInstructions} onGetPersonalizedHelp={() => onNavigate("chat")} />
      </DashboardSection>
    </div>
  )
}

