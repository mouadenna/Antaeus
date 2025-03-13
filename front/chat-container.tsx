"use client"

import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { FAQSuggestions } from "./faq-suggestions"
import { MapPreview } from "./map-preview"
import { ChatActions } from "./chat-actions"
import type { MapMarker } from "../map-component"
import { useState, useEffect, useCallback } from "react"

// Define the message structure
interface Message {
  id?: string
  text: string
  sender: "user" | "bot"
  timestamp?: string
  geometryCODE?: string
  imageURL?: string
}

interface ChatContainerProps {
  messages: string[] | Message[]
  emergencyMode: boolean
  userRole: "user" | "admin"
  mapMarkers: MapMarker[]
  currentDisaster: string | null
  faqSuggestions: string[]
  bubbleColor?: string
  onSendMessage: (message: string) => void
  onFAQSelect: (question: string) => void
  onActivateEmergency: () => void
  onNewChat: () => void
  onMarkerClick: (marker: MapMarker) => void
  onOpenFullMap: () => void
}

export function ChatContainer({
  messages,
  emergencyMode,
  userRole,
  mapMarkers,
  currentDisaster,
  faqSuggestions,
  bubbleColor = "bg-gray-100",
  onSendMessage,
  onFAQSelect,
  onActivateEmergency,
  onNewChat,
  onMarkerClick,
  onOpenFullMap,
}: ChatContainerProps) {
  // Extract the latest geometryCODE from bot messages
  const [currentGeometryCode, setCurrentGeometryCode] = useState<string | undefined>(undefined)

  // Process messages to find the latest geometryCODE
  const extractGeometryCode = useCallback(() => {
    if (messages.length === 0) return

    // Find the latest bot message with a geometryCODE
    for (let i = messages.length - 1; i >= 0; i--) {
      if (typeof messages[0] !== "string") {
        const structuredMessages = messages as Message[]

        // Find the latest bot message with a geometryCODE
        for (let i = structuredMessages.length - 1; i >= 0; i--) {
          if (
            structuredMessages[i].sender === "bot" &&
            structuredMessages[i].geometryCODE &&
            structuredMessages[i].geometryCODE.trim() !== ""
          ) {
            const code = structuredMessages[i].geometryCODE
            console.log("Found geometryCODE in message:", code?.substring(0, 20) + "...")
            setCurrentGeometryCode(code)
            return
          }
        }

        // If no geometryCODE found, clear the current one
        setCurrentGeometryCode(undefined)
      } else {
        // Try to parse string messages to find geometryCODE
        let foundCode = false

        for (let i = messages.length - 1; i >= 0; i--) {
          try {
            const msgText = messages[i] as string
            // Check if it's a JSON string
            if (msgText.startsWith("{") && msgText.endsWith("}")) {
              const msgObj = JSON.parse(msgText)
              if (msgObj.geometryCODE) {
                console.log("Found geometryCODE in parsed message:", msgObj.geometryCODE.substring(0, 20) + "...")
                setCurrentGeometryCode(msgObj.geometryCODE)
                foundCode = true
                break
              }
            }
          } catch (e) {
            // Not a valid JSON string, continue
            console.log("Error parsing message:", e)
          }
        }

        // If no geometryCODE found in any message, clear the current one
        if (!foundCode) {
          setCurrentGeometryCode(undefined)
        }
      }
    }
  }, [messages])

  useEffect(() => {
    extractGeometryCode()
  }, [extractGeometryCode])

  // Process messages for display
  const processedMessages = Array.isArray(messages)
    ? messages.map((msg) => {
        if (typeof msg === "string") {
          try {
            return JSON.parse(msg)
          } catch (e) {
            // If it's not valid JSON, create a basic message object
            return {
              text: msg,
              sender: msg.includes("User:") ? "user" : "bot",
              timestamp: new Date().toISOString(),
            }
          }
        }
        return msg
      })
    : []

  return (
    <div className="flex flex-col h-full">
      <ChatActions
        emergencyMode={emergencyMode}
        userRole={userRole}
        onActivateEmergency={onActivateEmergency}
        onNewChat={onNewChat}
      />

      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        <div className="flex flex-col w-full md:w-1/2 h-full">
          <div className="flex-grow overflow-hidden flex flex-col">
            {messages.length > 0 ? (
              <div className="flex-grow overflow-y-auto">
                <ChatMessages messages={processedMessages} bubbleColor={bubbleColor} />
              </div>
            ) : (
              <div className="flex-grow overflow-y-auto">
                <FAQSuggestions suggestions={faqSuggestions} onSelectSuggestion={onFAQSelect} userRole={userRole} />
              </div>
            )}
          </div>
          <div className="mt-4">
            <ChatInput emergencyMode={emergencyMode} onSendMessage={onSendMessage} />
          </div>
        </div>

        <div className="w-full md:w-1/2 h-[300px] md:h-full mt-4 md:mt-0 md:ml-4">
          <MapPreview
            markers={mapMarkers}
            currentDisaster={currentDisaster}
            onMarkerClick={onMarkerClick}
            onOpenFullMap={onOpenFullMap}
            geometryCode={currentGeometryCode}
          />
        </div>
      </div>
    </div>
  )
}

