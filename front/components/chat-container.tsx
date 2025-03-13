"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"
import { MapPreview } from "./map-preview"
import type { MapMarker } from "./map-component"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: string
  geometryCODE?: string
  imageURL?: string
  locationCoordinates?: { latitude: number; longitude: number }
}

// Define the DisasterArea type
interface DisasterArea {
  id: string
  name: string
  geometry: any 
}

// Update the ChatContainerProps interface to include disasterAreas
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
  disasterAreas?: DisasterArea[]
}

// Update the destructuring in the function parameters to include disasterAreas
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
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [currentGeometryCode, setCurrentGeometryCode] = useState<string | undefined>(undefined)
  const [currentLocationCoordinates, setCurrentLocationCoordinates] = useState<
    { latitude: number; longitude: number } | undefined
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage("")
    }
  }

  // Render FAQ suggestions if no messages
  const renderFAQSuggestions = () => {
    if (messages.length === 0) {
      return (
        <div className="p-4 bg-gray-50 rounded-lg mb-4">
          <h3 className="text-sm font-medium mb-2">Frequently Asked Questions</h3>
          <div className="grid gap-2">
            {faqSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto py-2 px-3 text-left"
                onClick={() => onFAQSelect(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-160px)] gap-4">
      <div className="flex flex-col w-full md:w-3/5 h-full">
        <div className="flex justify-between items-center mb-4">
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

        <div className="flex-grow overflow-hidden flex flex-col bg-white rounded-lg border p-4">
          {renderFAQSuggestions()}

          <div className="flex-grow overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.sender === "user" ? "flex justify-end" : "flex justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 mr-2 flex-shrink-0 flex items-center justify-center">
                    <span className="text-sm">🤖</span>
                  </div>
                )}

                <div
                  className={`${bubbleColor} ${
                    message.sender === "user" ? "bg-blue-100" : ""
                  } max-w-[80%] p-3 rounded-lg shadow-sm`}
                >
                  <p className="text-sm">{message.text}</p>

                  {message.imageURL && message.imageURL !== "none" && (
                    <div className="mt-2">
                      <img
                        src={message.imageURL || "/placeholder.svg"}
                        alt="Response image"
                        className="rounded max-w-[250px] max-h-[200px] object-contain"
                      />
                    </div>
                  )}
                </div>

                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 ml-2 flex-shrink-0 flex items-center justify-center">
                    <span className="text-sm">👤</span>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 mr-2 flex-shrink-0 flex items-center justify-center">
                  <span className="text-sm">🤖</span>
                </div>
                <div className={`${bubbleColor} p-3 rounded-lg shadow-sm flex items-center`}>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="mt-4 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                emergencyMode
                  ? "Describe your emergency situation..."
                  : "Ask about shelters, evacuation routes, or report an incident..."
              }
              className={`pr-12 ${emergencyMode ? "border-red-300 focus-visible:ring-red-300" : ""}`}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className={`absolute right-1 top-1 h-8 w-8 ${emergencyMode ? "bg-red-500 hover:bg-red-600" : ""}`}
              disabled={!message.trim() || isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
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
  )
}

