"use client"

import { useState } from "react"
import { Package, MapPin, Search, Plus, Droplet, Pizza, Pill, Home } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

interface ResourcesPanelProps {
  currentDisaster: string | null
}

export default function ResourcesPanel({ currentDisaster }: ResourcesPanelProps) {
  const [activeTab, setActiveTab] = useState("available")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data for resources
  const resourceStats = {
    water: { available: 2500, allocated: 1200, unit: "bottles" },
    food: { available: 850, allocated: 320, unit: "kits" },
    medical: { available: 320, allocated: 145, unit: "kits" },
    shelter: { available: 500, allocated: 237, unit: "spaces" },
  }

  const distributionCenters = [
    {
      id: 1,
      name: "Central Distribution Hub",
      location: "City Hall, Downtown",
      status: "Active",
      capacity: "High",
      hours: "24/7",
      resources: ["Water", "Food", "Medical", "Blankets"],
    },
    {
      id: 2,
      name: "North Community Center",
      location: "Highland District",
      status: "Active",
      capacity: "Medium",
      hours: "8AM-8PM",
      resources: ["Water", "Food", "Blankets"],
    },
    {
      id: 3,
      name: "Riverside School",
      location: "East Riverside",
      status: "Active",
      capacity: "Medium",
      hours: "8AM-6PM",
      resources: ["Water", "Food", "Blankets"],
    },
    {
      id: 4,
      name: "South Medical Center",
      location: "South District",
      status: "Limited",
      capacity: "Low",
      hours: "24/7",
      resources: ["Medical"],
    },
  ]

  const requestHistory = [
    {
      id: "REQ-1023",
      resource: "Water",
      quantity: "500 bottles",
      location: "Riverside Shelter",
      priority: "High",
      status: "In Progress",
      requestedAt: "Today, 10:30 AM",
    },
    {
      id: "REQ-1022",
      resource: "Medical Kits",
      quantity: "50 kits",
      location: "Downtown Medical Station",
      priority: "Critical",
      status: "Dispatched",
      requestedAt: "Today, 09:15 AM",
    },
    {
      id: "REQ-1021",
      resource: "Food",
      quantity: "100 kits",
      location: "North Community Center",
      priority: "Medium",
      status: "Completed",
      requestedAt: "Today, 08:45 AM",
    },
    {
      id: "REQ-1020",
      resource: "Blankets",
      quantity: "200 units",
      location: "Highland School",
      priority: "Medium",
      status: "Completed",
      requestedAt: "Yesterday, 04:30 PM",
    },
  ]

  const getResourceIcon = (resource: string) => {
    switch (resource.toLowerCase()) {
      case "water":
        return <Droplet className="h-5 w-5 text-blue-600" />
      case "food":
        return <Pizza className="h-5 w-5 text-green-600" />
      case "medical":
      case "medical kits":
        return <Pill className="h-5 w-5 text-red-600" />
      case "blankets":
        return <Home className="h-5 w-5 text-purple-600" />
      default:
        return <Package className="h-5 w-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-amber-100 text-amber-800"
      case "dispatched":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Resources Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Emergency Resources</h1>
          <p className="text-gray-500">Available supplies and distribution centers</p>
        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search resources..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Request Resources
          </Button>
        </div>
      </div>

      {/* Resource Allocation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Water Supplies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-1">
              <span className="text-2xl font-bold">{resourceStats.water.available}</span>
              <span className="text-sm text-gray-500">{resourceStats.water.allocated} allocated</span>
            </div>
            <Progress value={(resourceStats.water.allocated / resourceStats.water.available) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Food Kits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-1">
              <span className="text-2xl font-bold">{resourceStats.food.available}</span>
              <span className="text-sm text-gray-500">{resourceStats.food.allocated} allocated</span>
            </div>
            <Progress value={(resourceStats.food.allocated / resourceStats.food.available) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Medical Supplies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-1">
              <span className="text-2xl font-bold">{resourceStats.medical.available}</span>
              <span className="text-sm text-gray-500">{resourceStats.medical.allocated} allocated</span>
            </div>
            <Progress
              value={(resourceStats.medical.allocated / resourceStats.medical.available) * 100}
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Shelter Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-1">
              <span className="text-2xl font-bold">{resourceStats.shelter.available}</span>
              <span className="text-sm text-gray-500">{resourceStats.shelter.allocated} allocated</span>
            </div>
            <Progress
              value={(resourceStats.shelter.allocated / resourceStats.shelter.available) * 100}
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Resources Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="available">Available Resources</TabsTrigger>
          <TabsTrigger value="distribution">Distribution Centers</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplet className="h-5 w-5 mr-2 text-blue-600" />
                  Water Supplies
                </CardTitle>
                <CardDescription>Bottled water and water containers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Bottled Water (500ml)</span>
                    <span className="font-medium">2,000 units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Water Containers (5 gal)</span>
                    <span className="font-medium">500 units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Water Purification Tablets</span>
                    <span className="font-medium">5,000 units</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Request Water Supplies
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Pizza className="h-5 w-5 mr-2 text-green-600" />
                  Food Supplies
                </CardTitle>
                <CardDescription>Ready-to-eat meals and food kits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Ready-to-eat Meals</span>
                    <span className="font-medium">750 units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Family Food Kits (3-day)</span>
                    <span className="font-medium">100 units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Baby Formula</span>
                    <span className="font-medium">50 units</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Request Food Supplies
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Pill className="h-5 w-5 mr-2 text-red-600" />
                  Medical Supplies
                </CardTitle>
                <CardDescription>First aid kits and medical equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>First Aid Kits</span>
                    <span className="font-medium">200 units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency Medications</span>
                    <span className="font-medium">100 units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trauma Supplies</span>
                    <span className="font-medium">20 units</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Request Medical Supplies
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2 text-purple-600" />
                  Shelter Supplies
                </CardTitle>
                <CardDescription>Blankets, cots, and hygiene kits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Blankets</span>
                    <span className="font-medium">300 units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cots</span>
                    <span className="font-medium">150 units</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hygiene Kits</span>
                    <span className="font-medium">250 units</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Request Shelter Supplies
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="mt-6">
          <div className="space-y-4">
            {distributionCenters.map((center) => (
              <Card key={center.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="p-3 rounded-full bg-blue-100 flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 className="text-lg font-bold">{center.name}</h3>
                        <Badge
                          className={
                            center.status === "Active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }
                        >
                          {center.status}
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-4">{center.location}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <span>Capacity: {center.capacity}</span>
                        </div>
                        <div className="flex items-center">
                          <span>Hours: {center.hours}</span>
                        </div>
                        <div className="flex items-center">
                          <span>Resources: {center.resources.join(", ")}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <Button variant="outline" size="sm">
                          View on Map
                        </Button>
                        <Button size="sm">Get Directions</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Resource Requests</CardTitle>
              <CardDescription>Track the status of your supply requests</CardDescription>
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
                      <th className="text-left py-2 font-medium">Requested</th>
                      <th className="text-left py-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestHistory.map((request) => (
                      <tr key={request.id} className="border-b">
                        <td className="py-2">{request.id}</td>
                        <td className="py-2 flex items-center">
                          {getResourceIcon(request.resource)}
                          <span className="ml-2">{request.resource}</span>
                        </td>
                        <td className="py-2">{request.quantity}</td>
                        <td className="py-2">{request.location}</td>
                        <td className="py-2">
                          <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                        </td>
                        <td className="py-2">
                          <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                        </td>
                        <td className="py-2">{request.requestedAt}</td>
                        <td className="py-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View All Requests</Button>
              <Button>New Request</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

