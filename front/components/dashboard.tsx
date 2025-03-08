"use client"

import { useState } from "react"
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Compass,
  Home,
  MapPin,
  Mic,
  Package,
  RefreshCw,
  Shield,
  Truck,
  Users,
  Waves,
  Wind,
  Flame,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DashboardProps {
  currentDisaster: string | null
  onNavigate: (tab: string) => void
}

export default function Dashboard({ currentDisaster, onNavigate }: DashboardProps) {
  const [activeView, setActiveView] = useState("overview")
  const [timeRange, setTimeRange] = useState("24h")
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString())

  // Sample data for the dashboard
  const emergencyStats = {
    activeIncidents: 14,
    pendingRequests: 8,
    deployedTeams: 6,
    affectedAreas: 3,
    evacuationCenters: 5,
    peopleEvacuated: 237,
  }

  const resourceStats = {
    water: { available: 2500, allocated: 1200, unit: "bottles" },
    food: { available: 850, allocated: 320, unit: "kits" },
    medical: { available: 320, allocated: 145, unit: "kits" },
    shelter: { available: 500, allocated: 237, unit: "spaces" },
  }

  const recentReports = [
    {
      id: 1,
      type: "Flood",
      location: "Main Street near Central Park",
      severity: "Critical",
      time: "15 minutes ago",
      reportMethod: "voice",
    },
    {
      id: 2,
      type: "Building Damage",
      location: "Downtown, 5th Avenue",
      severity: "High",
      time: "32 minutes ago",
      reportMethod: "text",
    },
    {
      id: 3,
      type: "Medical Emergency",
      location: "Riverside Community Center",
      severity: "Medium",
      time: "1 hour ago",
      reportMethod: "text",
    },
    {
      id: 4,
      type: "Road Blockage",
      location: "Highway 101, North Exit",
      severity: "Medium",
      time: "2 hours ago",
      reportMethod: "voice",
    },
  ]

  const teamStatus = [
    { id: 1, name: "Search & Rescue Alpha", members: 8, status: "Deployed", location: "Downtown" },
    { id: 2, name: "Medical Response Team", members: 6, status: "Deployed", location: "Riverside" },
    { id: 3, name: "Evacuation Support", members: 10, status: "Standby", location: "HQ" },
    { id: 4, name: "Infrastructure Assessment", members: 4, status: "Deployed", location: "North District" },
  ]

  const weatherAlerts = [
    {
      id: 1,
      type: "Heavy Rain",
      severity: "Warning",
      expires: "6 hours",
      details: "Potential for flash flooding in low-lying areas",
    },
    { id: 2, type: "Strong Winds", severity: "Advisory", expires: "12 hours", details: "Gusts up to 45mph expected" },
  ]

  const handleRefresh = () => {
    // In a real app, this would fetch fresh data
    setLastUpdated(new Date().toLocaleTimeString())
  }

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
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "advisory":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "deployed":
        return "bg-blue-100 text-blue-800"
      case "standby":
        return "bg-yellow-100 text-yellow-800"
      case "available":
        return "bg-green-100 text-green-800"
      case "unavailable":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Disaster Response Dashboard</h1>
          <p className="text-gray-500">
            {currentDisaster
              ? `Active Response: ${currentDisaster} • Last updated: ${lastUpdated}`
              : `Overview • Last updated: ${lastUpdated}`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          {currentDisaster && (
            <Button variant="destructive" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Emergency Mode
            </Button>
          )}
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate("map")}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <MapPin className="h-8 w-8 mb-2 text-blue-600" />
            <h3 className="font-medium">View Map</h3>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate("voice-report")}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Mic className="h-8 w-8 mb-2 text-indigo-600" />
            <h3 className="font-medium">Voice Report</h3>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate("alerts")}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Bell className="h-8 w-8 mb-2 text-amber-600" />
            <h3 className="font-medium">Alerts</h3>
            {weatherAlerts.length > 0 && <Badge className="mt-1">{weatherAlerts.length}</Badge>}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate("resources")}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Package className="h-8 w-8 mb-2 text-purple-600" />
            <h3 className="font-medium">Resources</h3>
            {emergencyStats.pendingRequests > 0 && (
              <Badge variant="destructive" className="mt-1">
                {emergencyStats.pendingRequests}
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <TabsContent value="overview" className="mt-0">
        {/* Status Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-sm text-gray-500 mb-1">Active Incidents</p>
                <h3 className="text-2xl font-bold text-red-600">{emergencyStats.activeIncidents}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
                <h3 className="text-2xl font-bold text-amber-600">{emergencyStats.pendingRequests}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-sm text-gray-500 mb-1">Deployed Teams</p>
                <h3 className="text-2xl font-bold text-blue-600">{emergencyStats.deployedTeams}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-sm text-gray-500 mb-1">Affected Areas</p>
                <h3 className="text-2xl font-bold text-purple-600">{emergencyStats.affectedAreas}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-sm text-gray-500 mb-1">Evacuation Centers</p>
                <h3 className="text-2xl font-bold text-green-600">{emergencyStats.evacuationCenters}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-sm text-gray-500 mb-1">People Evacuated</p>
                <h3 className="text-2xl font-bold text-indigo-600">{emergencyStats.peopleEvacuated}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports and Weather Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Recent Reports</span>
                <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onNavigate("map")}>
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        report.type.toLowerCase() === "flood"
                          ? "bg-blue-100"
                          : report.type.toLowerCase() === "fire"
                            ? "bg-red-100"
                            : report.type.toLowerCase() === "building damage"
                              ? "bg-orange-100"
                              : report.type.toLowerCase() === "medical emergency"
                                ? "bg-green-100"
                                : "bg-gray-100"
                      }`}
                    >
                      {getDisasterIcon(report.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{report.type}</h4>
                          <p className="text-sm text-gray-500">{report.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {report.reportMethod === "voice" && <Mic className="h-3 w-3 text-indigo-600" />}
                          <Badge className={getSeverityColor(report.severity)}>{report.severity}</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> {report.time}
                        </span>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Weather Alerts</span>
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onNavigate("alerts")}>
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weatherAlerts.length > 0 ? (
                  <div className="space-y-4">
                    {weatherAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            alert.type.toLowerCase().includes("rain")
                              ? "bg-blue-100"
                              : alert.type.toLowerCase().includes("wind")
                                ? "bg-teal-100"
                                : "bg-amber-100"
                          }`}
                        >
                          {getDisasterIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{alert.type}</h4>
                            <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{alert.details}</p>
                          <p className="text-xs text-gray-500 mt-1">Expires in: {alert.expires}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                    <h4 className="font-medium">No Active Weather Alerts</h4>
                    <p className="text-sm text-gray-500">The weather conditions are currently stable</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Response Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-10 flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Emergency Declared</h4>
                      <p className="text-sm text-gray-500">Today, 08:45 AM</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Response Teams Deployed</h4>
                      <p className="text-sm text-gray-500">Today, 09:15 AM</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Home className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Evacuation Centers Opened</h4>
                      <p className="text-sm text-gray-500">Today, 10:30 AM</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">Supply Distribution Started</h4>
                      <p className="text-sm text-gray-500">Today, 11:45 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="resources" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resource Allocation</CardTitle>
              <CardDescription>Current inventory and distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Water Supplies</span>
                    <span className="text-sm text-gray-500">
                      {resourceStats.water.allocated} / {resourceStats.water.available} {resourceStats.water.unit}
                    </span>
                  </div>
                  <Progress
                    value={(resourceStats.water.allocated / resourceStats.water.available) * 100}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Food Kits</span>
                    <span className="text-sm text-gray-500">
                      {resourceStats.food.allocated} / {resourceStats.food.available} {resourceStats.food.unit}
                    </span>
                  </div>
                  <Progress
                    value={(resourceStats.food.allocated / resourceStats.food.available) * 100}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Medical Supplies</span>
                    <span className="text-sm text-gray-500">
                      {resourceStats.medical.allocated} / {resourceStats.medical.available} {resourceStats.medical.unit}
                    </span>
                  </div>
                  <Progress
                    value={(resourceStats.medical.allocated / resourceStats.medical.available) * 100}
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Shelter Capacity</span>
                    <span className="text-sm text-gray-500">
                      {resourceStats.shelter.allocated} / {resourceStats.shelter.available} {resourceStats.shelter.unit}
                    </span>
                  </div>
                  <Progress
                    value={(resourceStats.shelter.allocated / resourceStats.shelter.available) * 100}
                    className="h-2"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => onNavigate("resources")}>
                  View Details
                </Button>
                <Button size="sm">Request Supplies</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Distribution Centers</CardTitle>
              <CardDescription>Active supply distribution points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Central Distribution Hub</h4>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
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
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-500">Highland District</p>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Capacity: Medium</span>
                      <span>Open 8AM-8PM</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Riverside School</h4>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-500">East Riverside</p>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Capacity: Medium</span>
                      <span>Open 8AM-6PM</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">South Medical Center</h4>
                      <Badge className="bg-amber-100 text-amber-800">Limited</Badge>
                    </div>
                    <p className="text-sm text-gray-500">South District</p>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Capacity: Low</span>
                      <span>Medical Only</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" size="sm" className="w-full" onClick={() => onNavigate("map")}>
                  View on Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Supply Requests</CardTitle>
            <CardDescription>Recent and pending resource requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Request ID</th>
                    <th className="text-left py-2 font-medium">Resource</th>
                    <th className="text-left py-2 font-medium">Quantity</th>
                    <th className="text-left py-2 font-medium">Location</th>
                    <th className="text-left py-2 font-medium">Priority</th>
                    <th className="text-left py-2 font-medium">Status</th>
                    <th className="text-left py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">REQ-1023</td>
                    <td className="py-2">Water</td>
                    <td className="py-2">500 bottles</td>
                    <td className="py-2">Riverside Shelter</td>
                    <td className="py-2">
                      <Badge className="bg-red-100 text-red-800">High</Badge>
                    </td>
                    <td className="py-2">
                      <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                    </td>
                    <td className="py-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        View
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">REQ-1022</td>
                    <td className="py-2">Medical Kits</td>
                    <td className="py-2">50 kits</td>
                    <td className="py-2">Downtown Medical Station</td>
                    <td className="py-2">
                      <Badge className="bg-red-100 text-red-800">Critical</Badge>
                    </td>
                    <td className="py-2">
                      <Badge className="bg-blue-100 text-blue-800">Dispatched</Badge>
                    </td>
                    <td className="py-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        View
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">REQ-1021</td>
                    <td className="py-2">Food</td>
                    <td className="py-2">100 kits</td>
                    <td className="py-2">North Community Center</td>
                    <td className="py-2">
                      <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                    </td>
                    <td className="py-2">
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </td>
                    <td className="py-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        View
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">REQ-1020</td>
                    <td className="py-2">Blankets</td>
                    <td className="py-2">200 units</td>
                    <td className="py-2">Highland School</td>
                    <td className="py-2">
                      <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                    </td>
                    <td className="py-2">
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </td>
                    <td className="py-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        View
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => onNavigate("resources")}>
                View All Requests
              </Button>
              <Button size="sm">New Request</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="teams" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Team Status</CardTitle>
              <CardDescription>Active response teams and their locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamStatus.map((team) => (
                  <div key={team.id} className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-indigo-100">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{team.name}</h4>
                        <Badge className={getStatusColor(team.status)}>{team.status}</Badge>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>{team.members} members</span>
                        <span>{team.location}</span>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          Contact
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          View on Map
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Teams
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Team Assignments</CardTitle>
              <CardDescription>Current mission assignments and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Search & Rescue Operation</h4>
                    <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Search & Rescue Alpha team conducting operations in Downtown area
                  </p>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Started: 2 hours ago</span>
                    <span>Priority: High</span>
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Medical Response</h4>
                    <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Medical Response Team providing emergency care at Riverside
                  </p>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Started: 1.5 hours ago</span>
                    <span>Priority: Critical</span>
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Infrastructure Assessment</h4>
                    <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Infrastructure Assessment Team evaluating building damage in North District
                  </p>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Started: 45 minutes ago</span>
                    <span>Priority: Medium</span>
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" size="sm" className="w-full">
                  Create New Assignment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Team Communication</CardTitle>
            <CardDescription>Recent updates from field teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-10 flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Search & Rescue Alpha</h4>
                    <span className="text-xs text-gray-500">15 minutes ago</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Completed search of Main Street area. Moving to 5th Avenue sector. Found 3 people requiring
                    assistance.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Medical Response Team</h4>
                    <span className="text-xs text-gray-500">32 minutes ago</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Treating 8 patients at Riverside. 2 critical, 6 stable. Need additional medical supplies.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Home className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Infrastructure Assessment</h4>
                    <span className="text-xs text-gray-500">45 minutes ago</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Identified 3 buildings with structural damage in North District. Marking as unsafe. Residents
                    evacuated.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Supply Distribution</h4>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Delivered water and food supplies to Central Distribution Hub. Moving to North Community Center
                    next.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" size="sm">
                View All Updates
              </Button>
              <Button size="sm">Send Message</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  )
}

