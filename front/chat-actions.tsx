"use client"

import { Button } from "@/components/ui/button"

interface ChatActionsProps {
  emergencyMode: boolean
  userRole: "user" | "admin"
  onActivateEmergency: () => void
  onNewChat: () => void
}

export function ChatActions({ emergencyMode, userRole, onActivateEmergency, onNewChat }: ChatActionsProps) {
  return (
    <div className="flex justify-between items-center mb-4 p-2 bg-white rounded-lg shadow-sm">
      <div className="flex items-center">
        {userRole === "admin" && !emergencyMode && (
          <Button onClick={onActivateEmergency} variant="destructive" size="sm" className="mr-2">
            Activate Emergency Mode
          </Button>
        )}

        {emergencyMode && (
          <div className="flex items-center text-red-600 font-medium">
            <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse"></span>
            Emergency Mode Active
          </div>
        )}
      </div>

      <Button onClick={onNewChat} variant="outline" size="sm">
        New Conversation
      </Button>
    </div>
  )
}

