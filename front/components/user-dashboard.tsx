"use client"
import { AlertTriangle, Bell, ShieldAlert, Home, Phone, Info, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface UserDashboardProps {
  currentDisaster: string | null
  onNavigate: (tab: string) => void
}

export default function UserDashboard({ currentDisaster, onNavigate }: UserDashboardProps) {
  // Sample data for user dashboard
  const nearbyResources = [
    { id: 1, name: "Central High School Shelter", distance: "1.2 miles", type: "shelter", status: "Open" },
    { id: 2, name: "Downtown Medical Station", distance: "0.8 miles", type: "medical", status: "Open" },
    { id: 3, name: "Water Distribution Point", distance: "1.5 miles", type: "supplies", status: "Open" },
  ]

  const activeAlerts = [
    { id: 1, type: "Flood Warning", area: "Downtown", expires: "2 hours", severity: "high" },
    { id: 2, type: "Road Closure", area: "Main Street Bridge", expires: "Until further notice", severity: "medium" },
  ]

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
                <p className="text-red-600">Stay safe and follow official instructions</p>
              </div>
              <Button variant="destructive" className="ml-auto" size="sm" onClick={() => onNavigate("chat")}>
                Get Help
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold mb-4">I Need Help With...</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate("voice-report")}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <ShieldAlert className="h-8 w-8 mb-2 text-red-600" />
            <h3 className="font-medium">Report Emergency</h3>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate("map")}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Home className="h-8 w-8 mb-2 text-blue-600" />
            <h3 className="font-medium">Find Shelter</h3>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate("chat")}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Phone className="h-8 w-8 mb-2 text-green-600" />
            <h3 className="font-medium">Contact Help</h3>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate("alerts")}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Info className="h-8 w-8 mb-2 text-amber-600" />
            <h3 className="font-medium">Get Updates</h3>
          </CardContent>
        </Card>
      </div>

      {/* Nearby Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Nearby Resources</span>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onNavigate("map")}>
                View Map
              </Button>
            </CardTitle>
            <CardDescription>Available shelters and services near you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nearbyResources.map((resource) => (
                <div key={resource.id} className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      resource.type === "shelter"
                        ? "bg-blue-100"
                        : resource.type === "medical"
                          ? "bg-green-100"
                          : "bg-purple-100"
                    }`}
                  >
                    {resource.type === "shelter" ? (
                      <Home className="h-5 w-5 text-blue-600" />
                    ) : resource.type === "medical" ? (
                      <ShieldAlert className="h-5 w-5 text-green-600" />
                    ) : (
                      <Bell className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{resource.name}</h4>
                        <p className="text-sm text-gray-500">{resource.distance} away</p>
                      </div>
                      <Badge
                        className={
                          resource.status === "Open" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {resource.status}
                      </Badge>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => onNavigate("map")}>
              Find More Resources
            </Button>
          </CardFooter>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Active Alerts</span>
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onNavigate("alerts")}>
                View All
              </Button>
            </CardTitle>
            <CardDescription>Current warnings and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {activeAlerts.length > 0 ? (
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        alert.severity === "high"
                          ? "bg-red-100"
                          : alert.severity === "medium"
                            ? "bg-amber-100"
                            : "bg-blue-100"
                      }`}
                    >
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{alert.type}</h4>
                        <Badge
                          className={
                            alert.severity === "high"
                              ? "bg-red-100 text-red-800"
                              : alert.severity === "medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Area: {alert.area}</p>
                      <p className="text-xs text-gray-500 mt-1">Expires: {alert.expires}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Bell className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-600">No Active Alerts</h3>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => onNavigate("alerts")}>
              View All Alerts
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Emergency Instructions */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Emergency Instructions</CardTitle>
          <CardDescription>What to do during an emergency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-medium">Stay calm and assess the situation</h4>
                <p className="text-sm text-gray-600">
                  Check yourself and others for injuries. Determine if your location is safe.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-medium">Report your emergency</h4>
                <p className="text-sm text-gray-600">
                  Use the voice report feature or chat to describe your situation and location.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-medium">Follow official instructions</h4>
                <p className="text-sm text-gray-600">Check alerts for evacuation routes and safety information.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-medium">Seek shelter if needed</h4>
                <p className="text-sm text-gray-600">Use the map to find the nearest shelter or safe location.</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => onNavigate("chat")}>
            Get Personalized Help <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

