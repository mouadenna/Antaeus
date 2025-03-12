"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatActionsProps {
  emergencyMode: boolean
  userRole: "user" | "admin"
  onActivateEmergency: () => void
  onNewChat: () => void
}

export function ChatActions({ emergencyMode, userRole, onActivateEmergency, onNewChat }: ChatActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      {/* {!emergencyMode && userRole === "user" && (
        <Button variant="destructive" className="font-semibold" onClick={onActivateEmergency}>
          <AlertTriangle className="mr-2 h-4 w-4" />
          <span>Emergency</span>
        </Button>
      )} */}
      {/* <Button
        variant="outline"
        className="hover:bg-stone-500 font-semibold hover:text-gray-100 border-2 border-gray-500 fixed left-12"
        onClick={onNewChat}
      >
        <span>New Chat</span>
      </Button> */}
    </div>
  )
}

