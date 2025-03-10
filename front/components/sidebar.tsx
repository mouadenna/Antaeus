"use client"

import { Home, AlertTriangle, Settings, HelpCircle, LogOut, User, Shield } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  currentDisaster: string | null
  userRole: "user" | "admin"
  onRoleChange: (role: "user" | "admin") => void
}

export default function Sidebar({ isOpen, currentDisaster, userRole, onRoleChange }: SidebarProps) {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 text-gray-800 transform transition-transform duration-300 ease-in-out overflow-y-auto z-20 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="p-6 pt-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-primary">Antaeus</h2>
        </div>

        {currentDisaster && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-700 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {currentDisaster} Response
            </h3>
            <p className="text-sm text-red-600 mt-2">Active emergency response in progress</p>
          </div>
        )}

        <nav className="flex-grow">
          <div className="mb-8">
            <a
              href="#dashboard"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-900 font-medium"
            >
              <Home className="h-5 w-5 text-primary" />
              <span>Dashboard</span>
            </a>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Settings</h3>
            <div className="space-y-1">
              <a href="#account" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="h-5 w-5 text-gray-500" />
                <span>Account Settings</span>
              </a>
              <a href="#help" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <HelpCircle className="h-5 w-5 text-gray-500" />
                <span>Help & Support</span>
              </a>
              <a href="#logout" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <LogOut className="h-5 w-5 text-gray-500" />
                <span>Logout</span>
              </a>
            </div>
          </div>

          {currentDisaster && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">Emergency Contacts</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center">
                  <span className="text-gray-600">Emergency Services:</span>
                  <span className="font-medium text-blue-800">911</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-600">Command Center:</span>
                  <span className="font-medium text-blue-800">555-123-4567</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-600">Medical Support:</span>
                  <span className="font-medium text-blue-800">555-987-6543</span>
                </li>
              </ul>
            </div>
          )}
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Switch Mode</h3>
          <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded-lg">
            <button
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-colors ${
                userRole === "user"
                  ? "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              onClick={() => onRoleChange("user")}
            >
              <User className={`h-5 w-5 ${userRole === "user" ? "text-blue-600" : "text-gray-500"}`} />
              <span className="text-sm font-medium">Civilian</span>
            </button>
            <button
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-colors ${
                userRole === "admin"
                  ? "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              onClick={() => onRoleChange("admin")}
            >
              <Shield className={`h-5 w-5 ${userRole === "admin" ? "text-blue-600" : "text-gray-500"}`} />
              <span className="text-sm font-medium">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

