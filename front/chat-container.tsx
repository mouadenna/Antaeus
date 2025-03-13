"use client"

import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { FAQSuggestions } from "./faq-suggestions"
import { MapPreview } from "./map-preview"
import { ChatActions } from "./chat-actions"
import type { MapMarker } from "./map-component"
import { useState, useEffect, useCallback } from "react"

// Define the message structure
interface Message {
  id?: string
  text: string
  sender: "user" | "bot"
  timestamp?: string
  geometryCODE?: string
  imageURL?: string
  locationCoordinates?: {
    latitude: string | number
    longitude: string | number
  }
}

interface ChatContainerProps {
  messages: Message[]
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
  isLoading?: boolean
  disasterAreas?: any // TODO: Define the type for disasterAreas
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
  isLoading = false,
  disasterAreas,
}: ChatContainerProps) {
  // Extract the latest geometryCODE from bot messages
  const [currentGeometryCode, setCurrentGeometryCode] = useState<string | undefined>(undefined)
  // Extract the latest locationCoordinates from bot messages
  const [currentLocationCoordinates, setCurrentLocationCoordinates] = useState<
    | {
        latitude: string | number
        longitude: string | number
      }
    | undefined
  >(undefined)

  // Process messages to find the latest geometryCODE and locationCoordinates
  const extractDataFromMessages = useCallback(() => {
    if (messages.length === 0) return

    let foundGeometryCode = false
    let foundLocationCoordinates = false

    // Find the latest bot message with geometryCODE or locationCoordinates
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i]

      // Check for geometryCODE if not found yet
      if (
        !foundGeometryCode &&
        message.sender === "bot" &&
        message.geometryCODE &&
        message.geometryCODE.trim() !== ""
      ) {
        console.log("Found geometryCODE in message:", message.geometryCODE.substring(0, 20) + "...")
        setCurrentGeometryCode(message.geometryCODE)
        foundGeometryCode = true
      }

      // Check for locationCoordinates if not found yet
      if (!foundLocationCoordinates && message.sender === "bot" && message.locationCoordinates) {
        console.log("Found locationCoordinates in message:", message.locationCoordinates)
        setCurrentLocationCoordinates(message.locationCoordinates)
        foundLocationCoordinates = true
      }

      // If both are found, we can stop searching
      if (foundGeometryCode && foundLocationCoordinates) {
        break
      }
    }

    // If no geometryCODE found in any message, clear the current one
    if (!foundGeometryCode) {
      setCurrentGeometryCode(undefined)
    }

    // If no locationCoordinates found in any message, clear the current one
    if (!foundLocationCoordinates) {
      setCurrentLocationCoordinates(undefined)
    }
  }, [messages])

  useEffect(() => {
    extractDataFromMessages()
  }, [extractDataFromMessages])

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
                <ChatMessages messages={messages} bubbleColor={bubbleColor} />
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

        <div className="w-full md:w-2/5 h-[250px] md:h-full">
          <MapPreview
            markers={mapMarkers}
            currentDisaster={currentDisaster}
            onMarkerClick={onMarkerClick}
            onOpenFullMap={onOpenFullMap}
            geometryCode={currentGeometryCode}
            locationCoordinates={currentLocationCoordinates}
            disasterAreas={disasterAreas}
          />
        </div>
      </div>
    </div>
  )
}

