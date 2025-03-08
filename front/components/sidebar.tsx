"use client"

import { Home, AlertTriangle, Map, Bell, Package, Users, Settings, HelpCircle, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  isOpen: boolean
  currentDisaster: string | null
  userRole: "user" | "admin"
}

export default function Sidebar({ isOpen, currentDisaster, userRole }: SidebarProps) {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-md text-gray-800 transform transition-transform duration-300 ease-in-out overflow-y-auto z-20 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="p-6 pt-28">
        {currentDisaster && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
            <h3 className="font-semibold text-red-700 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {currentDisaster} Response
            </h3>
            <p className="text-sm text-red-600 mt-1">Active emergency response in progress</p>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-6">
          {userRole === "admin" ? "Response Management" : "Emergency Services"}
        </h2>

        <nav>
          <ul className="space-y-2 mb-6">
            <li>
              <a href="#dashboard" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
                <Home className="h-5 w-5" />
                <span>{userRole === "admin" ? "Command Center" : "Dashboard"}</span>
              </a>
            </li>

            <li>
              <a href="#map" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
                <Map className="h-5 w-5" />
                <span>{userRole === "admin" ? "Situation Map" : "Find Help"}</span>
              </a>
            </li>

            <li>
              <a href="#alerts" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
                <Bell className="h-5 w-5" />
                <span>Alerts</span>
                {userRole === "user" && (
                  <Badge variant="destructive" className="ml-auto">
                    3
                  </Badge>
                )}
              </a>
            </li>

            {userRole === "admin" ? (
              <>
                <li>
                  <a href="#resources" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
                    <Package className="h-5 w-5" />
                    <span>Resources</span>
                    <Badge className="ml-auto">8</Badge>
                  </a>
                </li>
                <li>
                  <a href="#teams" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
                    <Users className="h-5 w-5" />
                    <span>Response Teams</span>
                  </a>
                </li>
              </>
            ) : (
              <li>
                <a href="#report" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Report Emergency</span>
                </a>
              </li>
            )}
          </ul>

          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Settings</h3>
          <ul className="space-y-2 mb-6">
            <li>
              <a href="#account" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
                <Settings className="h-5 w-5" />
                <span>Account Settings</span>
              </a>
            </li>
            <li>
              <a href="#help" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
                <HelpCircle className="h-5 w-5" />
                <span>Help & Support</span>
              </a>
            </li>
            <li>
              <a href="#logout" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </a>
            </li>
          </ul>

          {currentDisaster && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-semibold text-blue-700">Emergency Contacts</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Emergency Services:</span>
                  <span className="font-medium">911</span>
                </li>
                <li className="flex justify-between">
                  <span>Command Center:</span>
                  <span className="font-medium">555-123-4567</span>
                </li>
                <li className="flex justify-between">
                  <span>Medical Support:</span>
                  <span className="font-medium">555-987-6543</span>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>
    </div>
  )
}

