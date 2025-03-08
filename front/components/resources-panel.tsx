"use client"

import { useState } from "react"
import { Package, Users, PlusCircle, Droplet, Utensils, Pill, Battery, AmbulanceIcon as FirstAid } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ResourcesPanelProps {
  currentDisaster: string | null
}

export default function ResourcesPanel({ currentDisaster }: ResourcesPanelProps) {
  const [requestFormOpen, setRequestFormOpen] = useState(false)

  // Sample resources data
  const resources = [
    {
      id: 1,
      name: "Drinking Water",
      category: "essential",
      available: 2500,
      unit: "bottles",
      location: "Central Distribution Center",
      icon: <Droplet className="h-5 w-5" />,
    },
    {
      id: 2,
      name: "Emergency Food Kits",
      category: "essential",
      available: 850,
      unit: "kits",
      location: "Central Distribution Center",
      icon: <Utensils className="h-5 w-5" />,
    },
    {
      id: 3,
      name: "First Aid Supplies",
      category: "medical",
      available: 320,
      unit: "kits",
      location: "Medical Response Center",
      icon: <FirstAid className="h-5 w-5" />,
    },
    {
      id: 4,
      name: "Medications",
      category: "medical",
      available: 1200,
      unit: "doses",
      location: "Medical Response Center",
      icon: <Pill className="h-5 w-5" />,
    },
    {
      id: 5,
      name: "Portable Power Banks",
      category: "equipment",
      available: 450,
      unit: "units",
      location: "Tech Support Center",
      icon: <Battery className="h-5 w-5" />,
    },
  ]

  // Sample teams data
  const teams = [
    {
      id: 1,
      name: "Search & Rescue Team Alpha",
      members: 12,
      status: "active",
      location: "Downtown District",
      specialty: "Urban Search & Rescue",
    },
    {
      id: 2,
      name: "Medical Response Team",
      members: 8,
      status: "active",
      location: "Central Hospital",
      specialty: "Emergency Medical Care",
    },
    {
      id: 3,
      name: "Infrastructure Assessment Team",
      members: 6,
      status: "standby",
      location: "Operations Center",
      specialty: "Structural Assessment",
    },
    {
      id: 4,
      name: "Supply Distribution Team",
      members: 10,
      status: "active",
      location: "Central Distribution Center",
      specialty: "Resource Management",
    },
  ]

  // Sample requests data
  const requests = [
    {
      id: 1,
      resource: "Drinking Water",
      quantity: 200,
      requestedBy: "Riverside Shelter",
      status: "in-progress",
      priority: "high",
      estimatedDelivery: "1 hour",
    },
    {
      id: 2,
      resource: "First Aid Kits",
      quantity: 50,
      requestedBy: "Downtown Medical Station",
      status: "pending",
      priority: "critical",
      estimatedDelivery: "ASAP",
    },
    {
      id: 3,
      resource: "Emergency Food",
      quantity: 100,
      requestedBy: "Highland Community Center",
      status: "completed",
      priority: "medium",
      estimatedDelivery: "Delivered",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "standby":
        return "bg-yellow-100 text-yellow-800"
      case "deployed":
        return "bg-blue-100 text-blue-800"
      case "unavailable":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const toggleRequestForm = () => {
    setRequestFormOpen(!requestFormOpen)
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Resource Management</h2>
        {currentDisaster && (
          <Badge variant="destructive" className="text-base py-1 px-3">
            {currentDisaster} Response Active
          </Badge>
        )}
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="inventory">Resource Inventory</TabsTrigger>
          <TabsTrigger value="teams">Response Teams</TabsTrigger>
          <TabsTrigger value="requests">Supply Requests</TabsTrigger>
          <TabsTrigger value="distribution">Distribution Map</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                All Resources
              </Button>
              <Button variant="outline" size="sm">
                Essential
              </Button>
              <Button variant="outline" size="sm">
                Medical
              </Button>
              <Button variant="outline" size="sm">
                Equipment
              </Button>
            </div>

            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full mr-2 bg-gray-100">{resource.icon}</div>
                      <CardTitle className="text-lg">{resource.name}</CardTitle>
                    </div>
                    <Badge>{resource.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Available:</span>
                        <span className="font-medium">
                          {resource.available} {resource.unit}
                        </span>
                      </div>
                      <Progress
                        value={resource.available > 1000 ? 75 : resource.available > 500 ? 50 : 25}
                        className="h-2 mt-1"
                      />
                    </div>
                    <p className="text-sm text-gray-500">Location: {resource.location}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm" onClick={toggleRequestForm}>
                    Request
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teams">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                All Teams
              </Button>
              <Button variant="outline" size="sm">
                Active
              </Button>
              <Button variant="outline" size="sm">
                Standby
              </Button>
            </div>

            <Button>
              <Users className="h-4 w-4 mr-2" />
              Manage Teams
            </Button>
          </div>

          <div className="space-y-4">
            {teams.map((team) => (
              <Card key={team.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <Badge className={getStatusColor(team.status)}>{team.status.toUpperCase()}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Members</p>
                      <p className="font-medium">{team.members}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{team.location}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Specialty</p>
                      <p className="font-medium">{team.specialty}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm">
                    Contact Team
                  </Button>
                  <Button size="sm">View on Map</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                All Requests
              </Button>
              <Button variant="outline" size="sm">
                Pending
              </Button>
              <Button variant="outline" size="sm">
                In Progress
              </Button>
              <Button variant="outline" size="sm">
                Completed
              </Button>
            </div>

            <Button onClick={toggleRequestForm}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>

          {requestFormOpen && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Request Supplies</CardTitle>
                <CardDescription>Fill out this form to request emergency supplies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Resource Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select resource type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="water">Drinking Water</SelectItem>
                          <SelectItem value="food">Emergency Food</SelectItem>
                          <SelectItem value="medical">Medical Supplies</SelectItem>
                          <SelectItem value="shelter">Shelter Supplies</SelectItem>
                          <SelectItem value="power">Power/Electricity</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quantity</label>
                      <div className="flex gap-2">
                        <Input type="number" placeholder="Amount" className="flex-grow" />
                        <Select defaultValue="units">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="units">Units</SelectItem>
                            <SelectItem value="boxes">Boxes</SelectItem>
                            <SelectItem value="pallets">Pallets</SelectItem>
                            <SelectItem value="liters">Liters</SelectItem>
                            <SelectItem value="kg">Kilograms</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Delivery Location</label>
                      <Input placeholder="Enter delivery address or coordinates" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Priority</label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical - Immediate (Life-threatening)</SelectItem>
                          <SelectItem value="high">High - Urgent (Within hours)</SelectItem>
                          <SelectItem value="medium">Medium - Important (Within 24 hours)</SelectItem>
                          <SelectItem value="low">Low - When available</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Additional Details</label>
                    <textarea
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      placeholder="Provide any additional information about your request..."
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={toggleRequestForm}>
                  Cancel
                </Button>
                <Button>Submit Request</Button>
              </CardFooter>
            </Card>
          )}

          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{request.resource}</CardTitle>
                      <CardDescription>Requested by: {request.requestedBy}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(request.priority)}>{request.priority.toUpperCase()}</Badge>
                      <Badge className={getRequestStatusColor(request.status)}>
                        {request.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-medium">{request.quantity} units</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Delivery</p>
                      <p className="font-medium">{request.estimatedDelivery}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {request.status !== "completed" && <Button size="sm">Track Status</Button>}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="distribution">
          <div className="bg-gray-100 rounded-lg p-8 text-center h-[400px] flex flex-col items-center justify-center">
            <Package className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Resource Distribution Map</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              View the current distribution of resources, supply routes, and delivery status on an interactive map.
            </p>
            <Button>Open Distribution Map</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

