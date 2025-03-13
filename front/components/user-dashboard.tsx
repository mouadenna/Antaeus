"use client"

import { AlertTriangle, MapPin, Info, ArrowRight, Mic, MessageCircle, Map } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ActiveDisasters, { type DisasterFeature } from "./active-disasters"

interface UserDashboardProps {
  currentDisaster: string | null
  onNavigate: (tab: string) => void
  disasterFeatures: DisasterFeature[]
}

export default function UserDashboard({ currentDisaster, onNavigate, disasterFeatures }: UserDashboardProps) {
  const hasActiveDisasters = disasterFeatures && disasterFeatures.length > 0

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Disaster Response Dashboard</h1>
        <p className="text-gray-500">
          {hasActiveDisasters
            ? `Active disaster response${
                disasterFeatures.length > 1 ? "s" : ""
              } in progress for ${disasterFeatures.length} affected area${disasterFeatures.length > 1 ? "s" : ""}`
            : "Get emergency information and assistance"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          {/* Emergency Status */}
          {hasActiveDisasters ? (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-red-800">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                  Emergency Response Active
                </CardTitle>
                <CardDescription className="text-red-700">
                  Emergency response is in progress. Stay informed and follow official guidance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-white text-red-800 border-red-300">
                      Alert Level: High
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-white text-red-800 border-red-300">
                      Affected Areas: {disasterFeatures.length}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-white text-red-800 border-red-300">
                      Evacuation: In Progress
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="border-red-300 text-red-800 hover:bg-red-100">
                  View Emergency Details
                </Button>
                <Button className="bg-red-600 hover:bg-red-700" onClick={() => onNavigate("voice-report")}>
                  <Mic className="mr-2 h-4 w-4" />
                  Report Emergency
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-green-800">
                  <Info className="mr-2 h-5 w-5 text-green-600" />
                  No Active Emergencies
                </CardTitle>
                <CardDescription className="text-green-700">
                  There are currently no active emergencies in your area.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-green-700">
                  Use this time to prepare for potential emergencies. Review your emergency plan and ensure your
                  emergency kit is up to date.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="border-green-300 text-green-800 hover:bg-green-100">
                  View Preparedness Resources
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Quick Actions */}
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Find Nearest Shelter</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500">Locate emergency shelters and evacuation centers near you</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-between" onClick={() => onNavigate("map")}>
                  View Map
                  <Map className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Get Assistance</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500">Chat with our AI assistant for emergency guidance</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-between" onClick={() => onNavigate("chat")}>
                  Start Chat
                  <MessageCircle className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Report Emergency</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500">Report an emergency situation or request assistance</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full justify-between" onClick={() => onNavigate("voice-report")}>
                  Record Report
                  <Mic className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Alerts */}
          <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
          <div className="space-y-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Flash Flood Warning</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Flash flood warning for downtown area. Expect rapid water level rise in low-lying areas.
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>Downtown District</span>
                    <span className="mx-2">•</span>
                    <span>10 minutes ago</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto flex-shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-start gap-4">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Shelter Opening</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Emergency shelter now open at Central High School. Food, water, and medical assistance available.
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>Central High School</span>
                    <span className="mx-2">•</span>
                    <span>2 hours ago</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto flex-shrink-0">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onNavigate("alerts")}>
              View All Alerts
            </Button>
          </div>
        </div>

        {/* Right sidebar for active disasters */}
        <div className="space-y-6">
          <ActiveDisasters disasters={disasterFeatures} onViewMap={() => onNavigate("map")} />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-500" />
                Emergency Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Shelters Available:</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Medical Centers:</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Supply Stations:</span>
                <span className="font-medium">6</span>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-2" onClick={() => onNavigate("resources")}>
                View Resources
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-500" />
                Weather Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Current:</span>
                <span className="text-sm font-medium">Rainy, 18°C</span>
              </div>
              <div className="text-xs text-gray-500">
                Heavy rainfall expected to continue for the next 24 hours. Stay indoors if possible.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

