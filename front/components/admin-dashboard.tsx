"use client"

import { AlertTriangle, Users, MapPin, Package, Activity, ArrowRight, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface AdminDashboardProps {
  currentDisaster: string | null
  onNavigate: (tab: string) => void
}

export default function AdminDashboard({ currentDisaster, onNavigate }: AdminDashboardProps) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Emergency Management Dashboard</h1>
          <p className="text-gray-500">
            {currentDisaster
              ? `Active response for ${currentDisaster}`
              : "Monitor and manage emergency response operations"}
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <Button className="bg-red-600 hover:bg-red-700">Activate Emergency Response</Button>
        </div>
      </div>

      {/* Emergency Status */}
      {currentDisaster && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <CardTitle className="flex items-center text-red-800">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                {currentDisaster} Emergency Active
              </CardTitle>
              <Badge className="bg-red-200 text-red-800 hover:bg-red-300 mt-2 md:mt-0">Level 3 Response</Badge>
            </div>
            <CardDescription className="text-red-700">
              Emergency response is in progress. Coordinate resources and monitor situation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-red-700 font-medium">Duration:</span>
                <span className="ml-2">12 hours, 34 minutes</span>
              </div>
              <div>
                <span className="text-red-700 font-medium">Affected Areas:</span>
                <span className="ml-2">3 Districts</span>
              </div>
              <div>
                <span className="text-red-700 font-medium">Evacuation Status:</span>
                <span className="ml-2">In Progress (64%)</span>
              </div>
              <div>
                <span className="text-red-700 font-medium">Incidents:</span>
                <span className="ml-2">27 Reported</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="border-red-300 text-red-800 hover:bg-red-100">
              View Situation Report
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">Manage Response</Button>
          </CardFooter>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Affected Population</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">12,450</span>
              <span className="ml-2 text-xs text-red-600">+1,230 in last 2h</span>
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Users className="h-3 w-3 mr-1" />
              <span>3,200 in shelters</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Resource Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">76%</span>
              <span className="ml-2 text-xs text-amber-600">Critical supplies at 42%</span>
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Package className="h-3 w-3 mr-1" />
              <span>8 distribution centers active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Emergency Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">342</span>
              <span className="ml-2 text-xs text-green-600">94% response rate</span>
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Activity className="h-3 w-3 mr-1" />
              <span>Avg. response time: 8 min</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Evacuation Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline mb-2">
              <span className="text-2xl font-bold">64%</span>
              <span className="ml-2 text-xs text-blue-600">Target: 100% by 18:00</span>
            </div>
            <Progress value={64} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Incidents */}
      <h2 className="text-lg font-semibold mb-4">Recent Incidents</h2>
      <div className="space-y-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-red-100 mr-4">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="font-medium">Building Collapse Reported</h3>
                  <Badge className="bg-red-100 text-red-800 mt-1 md:mt-0">High Priority</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Structural damage reported at 123 Main St. Multiple people potentially trapped. First responders en
                  route.
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>Downtown District</span>
                  </div>
                  <div className="flex items-center">
                    <span>Reported: 10 minutes ago</span>
                  </div>
                  <div className="flex items-center">
                    <span>Status: Response in progress</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="ml-2 flex-shrink-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-amber-100 mr-4">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-grow">
                <div className />
              </div>
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="font-medium">Road Flooding on Highway 101</h3>
                  <Badge className="bg-amber-100 text-amber-800 mt-1 md:mt-0">Medium Priority</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Multiple lanes flooded near exit 25. Traffic backed up for 3 miles. Road crews dispatched.
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>North District</span>
                  </div>
                  <div className="flex items-center">
                    <span>Reported: 45 minutes ago</span>
                  </div>
                  <div className="flex items-center">
                    <span>Status: Mitigation in progress</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="ml-2 flex-shrink-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Status */}
      <h2 className="text-lg font-semibold mb-4">Resource Status</h2>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resource Allocation</CardTitle>
          <CardDescription>Current status of emergency resources and supplies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Emergency Shelters</span>
                <span className="text-sm text-gray-500">4/6 Active</span>
              </div>
              <Progress value={66.7} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Medical Supplies</span>
                <span className="text-sm text-gray-500">42% Remaining</span>
              </div>
              <Progress value={42} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Food & Water</span>
                <span className="text-sm text-gray-500">78% Remaining</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Emergency Personnel</span>
                <span className="text-sm text-gray-500">85% Deployed</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onNavigate("resources")}>
            View Resource Details
          </Button>
          <Button>Manage Resources</Button>
        </CardFooter>
      </Card>

      <div className="flex justify-end">
        <Button className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          View Full Analytics
        </Button>
      </div>
    </div>
  )
}

