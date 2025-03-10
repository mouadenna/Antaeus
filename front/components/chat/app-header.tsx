"use client"

import { Badge } from "@/components/ui/badge"

interface AppHeaderProps {
  title: string
  currentDisaster: string | null
  userRole: "user" | "admin"
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function AppHeader({ title, currentDisaster, userRole, isSidebarOpen, onToggleSidebar }: AppHeaderProps) {
  return (
    <header
      className={`flex sticky top-0 justify-between items-center px-3 sm:px-6 py-3 w-full text-gray-800 z-20 border-b ${
        currentDisaster ? "bg-red-100 border-red-200" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <span className="text-xl">✕</span> : <span className="text-xl">☰</span>}
        </button>
        <h1 className="text-lg sm:text-2xl font-bold ml-3 sm:ml-4">{title}</h1>
        {currentDisaster && (
          <Badge variant="destructive" className="ml-3 sm:ml-4 text-xs sm:text-sm whitespace-nowrap">
            {currentDisaster} Response Active
          </Badge>
        )}
      </div>
      <div className="flex items-center">
        <span className="text-xs sm:text-sm text-gray-500 mr-2 hidden sm:inline-block">
          {userRole === "user" ? "Civilian Mode" : "Admin Mode"}
        </span>
      </div>
    </header>
  )
}

