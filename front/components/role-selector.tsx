"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, User } from "lucide-react"

interface RoleSelectorProps {
  currentRole: "user" | "admin"
  onRoleChange: (role: "user" | "admin") => void
}

export default function RoleSelector({ currentRole, onRoleChange }: RoleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleRoleSelect = (role: "user" | "admin") => {
    onRoleChange(role)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={toggleDropdown} className="flex items-center gap-2">
        {currentRole === "user" ? (
          <>
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Civilian Mode</span>
          </>
        ) : (
          <>
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Admin Mode</span>
          </>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              className={`w-full text-left px-4 py-2 text-sm ${
                currentRole === "user" ? "bg-gray-100" : ""
              } hover:bg-gray-100 flex items-center gap-2`}
              onClick={() => handleRoleSelect("user")}
            >
              <User className="h-4 w-4" />
              Civilian Mode
            </button>
            <button
              className={`w-full text-left px-4 py-2 text-sm ${
                currentRole === "admin" ? "bg-gray-100" : ""
              } hover:bg-gray-100 flex items-center gap-2`}
              onClick={() => handleRoleSelect("admin")}
            >
              <Shield className="h-4 w-4" />
              Admin Mode
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

