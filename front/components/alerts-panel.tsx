"use client"

import { useState } from "react"
import { AlertTriangle, Bell, CloudRain, Flame, Wind, Waves, ThermometerSun } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface AlertsPanelProps {
  currentDisaster: string | null
}

export default function AlertsPanel({ currentDisaster }: AlertsPanelProps) {
  const [alertFilter, setAlertFilter] = useState("all")
  const [notificationsEnabled, setNotificationsEnabled] = useState({
    emergency: true,
    weather: true,
    updates: true,
    resources: false,
    community: false,
  })

  // Sample alerts data
  const alerts = [
    {
      id: 1,
      type: "emergency",
      title: "Flash Flood Warning",
      description:
        "Flash flood warning in effect for downtown area. Seek higher ground immediately if in affected areas.",
      severity: "critical",
      time: "15 minutes ago",
      icon: <Waves className="h-5 w-5" />,
    },
    {
      id: 2,
      type: "weather",
      title: "Severe Thunderstorm Watch",
      description: "Severe thunderstorms possible in the next 6 hours. Be prepared for heavy rain and strong winds.",
      severity: "warning",
      time: "1 hour ago",
      icon: <CloudRain className="h-5 w-5" />,
    },
    {
      id: 3,
      type: "emergency",
      title: "Evacuation Order",
      description:
        "Mandatory evacuation ordered for Riverside district due to rising water levels. Proceed to designated shelters.",
      severity: "critical",
      time: "2 hours ago",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      id: 4,
      type: "update",
      title: "Road Closure Update",
      description: "Main Street bridge closed due to flooding. Use alternate routes via Highland Avenue.",
      severity: "info",
      time: "3 hours ago",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      id: 5,
      type: "weather",
      title: "Heat Advisory",
      description: "Heat advisory in effect from noon to 8 PM. Stay hydrated and limit outdoor activities.",
      severity: "warning",
      time: "5 hours ago",
      icon: <ThermometerSun className="h-5 w-5" />,
    },
  ]

  // Filter alerts based on selected filter
  const filteredAlerts = alertFilter === "all" ? alerts : alerts.filter((alert) => alert.type === alertFilter)

  // Get disaster-specific alerts
  const getDisasterAlerts = () => {
    if (!currentDisaster) return null

    let disasterAlerts = []

    switch (currentDisaster) {
      case "Flood":
        disasterAlerts = [
          {
            id: 101,
            type: "emergency",
            title: "Dam Overflow Warning",
            description:
              "North County Dam at 95% capacity. Potential overflow in next 2-3 hours. Evacuation recommended for downstream areas.",
            severity: "critical",
            time: "30 minutes ago",
            icon: <Waves className="h-5 w-5" />,
          },
          {
            id: 102,
            type: "update",
            title: "Rescue Operations Active",
            description:
              "Rescue teams deployed to Riverside and Downtown areas. If stranded, signal for help with bright clothing or flashlights.",
            severity: "info",
            time: "45 minutes ago",
            icon: <Bell className="h-5 w-5" />,
          },
        ]
        break
      case "Fire":
        disasterAlerts = [
          {
            id: 201,
            type: "emergency",
            title: "Fire Containment Update",
            description:
              "Westside fire now 35% contained. Wind direction shifting north. Northern neighborhoods should prepare for evacuation.",
            severity: "critical",
            time: "20 minutes ago",
            icon: <Flame className="h-5 w-5" />,
          },
          {
            id: 202,
            type: "weather",
            title: "High Wind Advisory",
            description:
              "Winds of 25-30 mph expected, potentially accelerating fire spread. Secure loose items and stay alert.",
            severity: "warning",
            time: "1 hour ago",
            icon: <Wind className="h-5 w-5" />,
          },
        ]
        break
      case "Earthquake":
        disasterAlerts = [
          {
            id: 301,
            type: "emergency",
            title: "Aftershock Warning",
            description:
              "Significant aftershocks possible in the next 24-48 hours. Stay away from damaged buildings and be prepared to drop, cover, and hold on.",
            severity: "critical",
            time: "10 minutes ago",
            icon: <AlertTriangle className="h-5 w-5" />,
          },
          {
            id: 302,
            type: "update",
            title: "Infrastructure Assessment",
            description:
              "Gas lines being checked in affected areas. Report any smell of gas by calling emergency services immediately.",
            severity: "warning",
            time: "40 minutes ago",
            icon: <Bell className="h-5 w-5" />,
          },
        ]
        break
      default:
        break
    }

    return disasterAlerts
  }

  const disasterAlerts = getDisasterAlerts()

  // Combine regular and disaster-specific alerts
  const allAlerts = disasterAlerts ? [...disasterAlerts, ...filteredAlerts] : filteredAlerts

  // Sort alerts by severity and time
  const sortedAlerts = allAlerts.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 }
    return (
      severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder]
    )
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const toggleNotification = (type: keyof typeof notificationsEnabled) => {
    setNotificationsEnabled({
      ...notificationsEnabled,
      [type]: !notificationsEnabled[type],
    })
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Emergency Alerts & Notifications</h2>
        {currentDisaster && (
          <Badge variant="destructive" className="text-base py-1 px-3">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {currentDisaster} Response Active
          </Badge>
        )}
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="current">Current Alerts</TabsTrigger>
          <TabsTrigger value="history">Alert History</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button
                variant={alertFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlertFilter("all")}
              >
                All
              </Button>
              <Button
                variant={alertFilter === "emergency" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlertFilter("emergency")}
                className={alertFilter === "emergency" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Emergency
              </Button>
              <Button
                variant={alertFilter === "weather" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlertFilter("weather")}
              >
                <CloudRain className="h-4 w-4 mr-1" />
                Weather
              </Button>
              <Button
                variant={alertFilter === "update" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlertFilter("update")}
              >
                <Bell className="h-4 w-4 mr-1" />
                Updates
              </Button>
            </div>

            <Button variant="outline" size="sm">
              Mark All as Read
            </Button>
          </div>

          <div className="space-y-4">
            {sortedAlerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-2 ${
                          alert.severity === "critical"
                            ? "bg-red-100"
                            : alert.severity === "warning"
                              ? "bg-yellow-100"
                              : "bg-blue-100"
                        }`}
                      >
                        {alert.icon}
                      </div>
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                    </div>
                    <Badge
                      variant={
                        alert.severity === "critical"
                          ? "destructive"
                          : alert.severity === "warning"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription className="text-right">{alert.time}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{alert.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">Take Action</Button>
                </CardFooter>
              </Card>
            ))}

            {sortedAlerts.length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-600">No alerts to display</h3>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full mr-2 bg-gray-100">
                      <CloudRain className="h-5 w-5 text-gray-600" />
                    </div>
                    <CardTitle className="text-lg">Flood Warning Expired</CardTitle>
                  </div>
                  <Badge variant="outline">RESOLVED</Badge>
                </div>
                <CardDescription>Yesterday, 3:45 PM</CardDescription>
              </CardHeader>
              <CardContent>
                <p>The flood warning for downtown area has expired. Water levels have receded to safe levels.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full mr-2 bg-gray-100">
                      <Bell className="h-5 w-5 text-gray-600" />
                    </div>
                    <CardTitle className="text-lg">Evacuation Order Lifted</CardTitle>
                  </div>
                  <Badge variant="outline">RESOLVED</Badge>
                </div>
                <CardDescription>Yesterday, 5:30 PM</CardDescription>
              </CardHeader>
              <CardContent>
                <p>The evacuation order for Riverside district has been lifted. Residents may return to their homes.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full mr-2 bg-gray-100">
                      <Wind className="h-5 w-5 text-gray-600" />
                    </div>
                    <CardTitle className="text-lg">Wind Advisory Expired</CardTitle>
                  </div>
                  <Badge variant="outline">RESOLVED</Badge>
                </div>
                <CardDescription>2 days ago, 10:15 AM</CardDescription>
              </CardHeader>
              <CardContent>
                <p>The wind advisory has expired. Wind speeds have decreased to normal levels.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure which types of alerts and notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Emergency Alerts</Label>
                  <p className="text-sm text-muted-foreground">Critical alerts about immediate dangers and threats</p>
                </div>
                <Switch
                  checked={notificationsEnabled.emergency}
                  onCheckedChange={() => toggleNotification("emergency")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Weather Alerts</Label>
                  <p className="text-sm text-muted-foreground">Warnings about severe weather conditions</p>
                </div>
                <Switch checked={notificationsEnabled.weather} onCheckedChange={() => toggleNotification("weather")} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Status Updates</Label>
                  <p className="text-sm text-muted-foreground">Updates on ongoing situations and response efforts</p>
                </div>
                <Switch checked={notificationsEnabled.updates} onCheckedChange={() => toggleNotification("updates")} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Resource Notifications</Label>
                  <p className="text-sm text-muted-foreground">Updates about available resources and supplies</p>
                </div>
                <Switch
                  checked={notificationsEnabled.resources}
                  onCheckedChange={() => toggleNotification("resources")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Community Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Updates from community members and local organizations
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled.community}
                  onCheckedChange={() => toggleNotification("community")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

