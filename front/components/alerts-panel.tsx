"use client"

import { useState } from "react"
import { AlertTriangle, Bell, Info, Filter, MapPin, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AlertsPanelProps {
  currentDisaster: string | null
}

export default function AlertsPanel({ currentDisaster }: AlertsPanelProps) {
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")

  // Sample data for alerts
  const alerts = [
    {
      id: "alert-001",
      title: "Flash Flood Warning",
      message:
        "Flash flood warning for downtown area. Expect rapid water level rise in low-lying areas. Avoid downtown and seek higher ground immediately if in the affected area.",
      type: "warning",
      severity: "high",
      location: "Downtown District",
      time: "10 minutes ago",
      expires: "2 hours",
      source: "National Weather Service",
    },
    {
      id: "alert-002",
      title: "Evacuation Order",
      message:
        "Mandatory evacuation order for Riverside neighborhood. Proceed to the nearest evacuation center. Bring essential items only.",
      type: "alert",
      severity: "critical",
      location: "Riverside Neighborhood",
      time: "30 minutes ago",
      expires: "Until further notice",
      source: "Emergency Management Agency",
    },
    {
      id: "alert-003",
      title: "Road Closure",
      message: "Main Street Bridge closed due to flooding. Use alternate routes.",
      type: "info",
      severity: "medium",
      location: "Main Street Bridge",
      time: "1 hour ago",
      expires: "12 hours",
      source: "Department of Transportation",
    },
    {
      id: "alert-004",
      title: "Shelter Opening",
      message: "Emergency shelter now open at Central High School. Food, water, and medical assistance available.",
      type: "info",
      severity: "medium",
      location: "Central High School",
      time: "2 hours ago",
      expires: "Until further notice",
      source: "Red Cross",
    },
  ]

  const historicalAlerts = [
    {
      id: "hist-001",
      title: "All Clear - Downtown Flooding",
      message: "The flash flood warning for downtown has been lifted. Water levels have receded to safe levels.",
      type: "info",
      severity: "low",
      location: "Downtown District",
      time: "Yesterday, 8:30 PM",
      expires: "N/A",
      source: "National Weather Service",
    },
    {
      id: "hist-002",
      title: "Power Restored",
      message: "Electrical service has been restored to all affected areas in the eastern district.",
      type: "info",
      severity: "low",
      location: "Eastern District",
      time: "Yesterday, 6:15 PM",
      expires: "N/A",
      source: "Power Company",
    },
  ]

  // Filter alerts based on search query and filters
  const filteredAlerts = alerts.filter((alert) => {
    // Filter by search query
    if (
      searchQuery &&
      !alert.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !alert.message.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !alert.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by type
    if (filterType !== "all" && alert.type !== filterType) {
      return false
    }

    // Filter by severity
    if (filterSeverity !== "all" && alert.severity !== filterSeverity) {
      return false
    }

    return true
  })

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "warning":
        return <Bell className="h-5 w-5 text-amber-500" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getAlertColor = (type: string, severity: string) => {
    if (type === "alert") {
      return "bg-red-50 border-red-200"
    } else if (type === "warning") {
      return severity === "high" ? "bg-amber-50 border-amber-200" : "bg-yellow-50 border-yellow-200"
    } else {
      return "bg-blue-50 border-blue-200"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critical</Badge>
      case "high":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
      case "low":
      default:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Alerts Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Emergency Alerts</h1>
          <p className="text-gray-500">
            {currentDisaster
              ? `Active alerts for ${currentDisaster} response`
              : "Stay informed with the latest emergency information"}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Alerts Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="historical">Historical Alerts</TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap gap-4 mt-4 mb-6">
          <div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="alert">Alerts</SelectItem>
                <SelectItem value="warning">Warnings</SelectItem>
                <SelectItem value="info">Information</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="active" className="mt-6 space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Info className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Alerts Found</h3>
                <p className="text-gray-500">There are no active alerts matching your search criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <Card key={alert.id} className={`border ${getAlertColor(alert.type, alert.severity)}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {alert.location}
                        </CardDescription>
                      </div>
                    </div>
                    {getSeverityBadge(alert.severity)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{alert.message}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Issued: {alert.time}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Expires: {alert.expires}</span>
                    </div>
                    <div>
                      <span>Source: {alert.source}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" className="mr-2">
                      View on Map
                    </Button>
                    <Button size="sm">More Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="historical" className="mt-6 space-y-4">
          {historicalAlerts.map((alert) => (
            <Card key={alert.id} className="border bg-gray-50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {alert.location}
                      </CardDescription>
                    </div>
                  </div>
                  {getSeverityBadge(alert.severity)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{alert.message}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Issued: {alert.time}</span>
                  </div>
                  <div>
                    <span>Source: {alert.source}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

