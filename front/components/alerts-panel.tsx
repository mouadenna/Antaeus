"use client"

import { useState } from "react"
import { AlertTriangle, Bell, Info, MapPin, Calendar, Clock, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AlertsPanelProps {
  currentDisaster: string | null
}

export default function AlertsPanel({ currentDisaster }: AlertsPanelProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

  // Sample data for alerts
  const alerts = [
    {
      id: 1,
      type: "Flood Warning",
      severity: "critical",
      area: "Downtown and Riverside",
      message: "Flash flooding expected in low-lying areas. Evacuate immediately if in a flood-prone area.",
      issued: "Today, 08:30 AM",
      expires: "Today, 08:30 PM",
      source: "National Weather Service",
      category: "weather",
    },
    {
      id: 2,
      type: "Road Closure",
      severity: "high",
      area: "Main Street Bridge",
      message: "Main Street Bridge closed due to structural damage. Use alternate routes.",
      issued: "Today, 10:15 AM",
      expires: "Until further notice",
      source: "Department of Transportation",
      category: "infrastructure",
    },
    {
      id: 3,
      type: "Evacuation Order",
      severity: "critical",
      area: "East Riverside District",
      message: "Mandatory evacuation for all residents in East Riverside. Report to designated shelters.",
      issued: "Today, 09:45 AM",
      expires: "Until further notice",
      source: "Emergency Management Agency",
      category: "evacuation",
    },
    {
      id: 4,
      type: "Shelter Opening",
      severity: "info",
      area: "Central High School",
      message: "Emergency shelter opened at Central High School. Capacity for 350 people.",
      issued: "Today, 11:00 AM",
      expires: "Until further notice",
      source: "Red Cross",
      category: "shelter",
    },
    {
      id: 5,
      type: "Boil Water Advisory",
      severity: "medium",
      area: "North and East Districts",
      message: "Water system compromised. Boil all water before consumption.",
      issued: "Yesterday, 06:30 PM",
      expires: "Until further notice",
      source: "Public Health Department",
      category: "health",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getAlertIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "weather":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "evacuation":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "infrastructure":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case "shelter":
        return <Info className="h-5 w-5 text-blue-600" />
      case "health":
        return <Info className="h-5 w-5 text-yellow-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (activeTab !== "all" && alert.category !== activeTab) return false
    if (severityFilter !== "all" && alert.severity !== severityFilter) return false
    return true
  })

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Emergency Banner */}
      {currentDisaster && (
        <Card className="mb-6 border-red-300 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-red-700">{currentDisaster} Emergency Active</h3>
                <p className="text-red-600">Stay alert and follow all emergency instructions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Emergency Alerts</h1>
          <p className="text-gray-500">Current warnings and notifications for your area</p>
        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="info">Informational</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Subscribe
          </Button>
        </div>
      </div>

      {/* Alerts Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-6 md:w-[600px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="evacuation">Evacuation</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="shelter">Shelters</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className="overflow-hidden">
              <div
                className={`h-2 ${
                  alert.severity === "critical"
                    ? "bg-red-500"
                    : alert.severity === "high"
                      ? "bg-orange-500"
                      : alert.severity === "medium"
                        ? "bg-yellow-500"
                        : alert.severity === "low"
                          ? "bg-green-500"
                          : "bg-blue-500"
                }`}
              />
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="p-3 rounded-full bg-gray-100 flex-shrink-0">{getAlertIcon(alert.category)}</div>
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <h3 className="text-lg font-bold">{alert.type}</h3>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-4">{alert.message}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{alert.area}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Issued: {alert.issued}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Expires: {alert.expires}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Source: {alert.source}</span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">No Alerts Found</h3>
            <p className="text-gray-500 mt-2">There are no active alerts matching your current filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

