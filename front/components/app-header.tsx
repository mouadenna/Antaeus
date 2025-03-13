"use client"

import { Menu, Bell, AlertTriangle, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AppHeaderProps {
  title: string
  currentDisaster: string | null
  userRole: "user" | "admin"
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function AppHeader({ title, currentDisaster, userRole, isSidebarOpen, onToggleSidebar }: AppHeaderProps) {
  return (
    <header className="w-full bg-white border-b sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="mr-2">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-primary">{title}</h1>
          {currentDisaster && (
            <div className="ml-4 flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-sm font-medium text-red-600">{currentDisaster} Response Active</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex items-center ml-2 bg-gray-100 p-1 rounded-full">
            {userRole === "admin" ? (
              <div className="bg-blue-100 text-blue-800 p-1 rounded-full">
                <Shield className="h-5 w-5" />
              </div>
            ) : (
              <div className="bg-gray-200 text-gray-700 p-1 rounded-full">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

