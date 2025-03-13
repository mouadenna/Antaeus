"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface ChatInputProps {
  emergencyMode: boolean
  onSendMessage: (message: string) => void
}

export function ChatInput({ emergencyMode, onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={
          emergencyMode
            ? "Describe your emergency situation..."
            : "Ask about shelters, evacuation routes, or report an incident..."
        }
        className={`pr-12 ${emergencyMode ? "border-red-300 focus-visible:ring-red-300" : ""}`}
      />
      <Button
        type="submit"
        size="icon"
        className={`absolute right-1 top-1 h-8 w-8 ${emergencyMode ? "bg-red-500 hover:bg-red-600" : ""}`}
        disabled={!message.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}

