"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"

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

interface ChatMessagesProps {
  messages: Message[]
  bubbleColor?: string
}

export function ChatMessages({ messages, bubbleColor = "bg-gray-100" }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (messages.length === 0) {
    return null
  }

  return (
    <div className="w-full flex flex-col">
      {messages.map((message, index) => (
        <span key={index}>
          {message.sender === "bot" ? (
            // Bot layout
            <div className="flex justify-start items-start mb-4">
              <div className="w-[36px] h-[36px] rounded-md bg-blue-100 mr-2 flex-shrink-0 flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <div
                className={`${bubbleColor} max-w-[80%] sm:max-w-[70%] shadow-md text-gray-800 text-wrap break-words p-3 rounded-lg text-sm sm:text-base`}
              >
                <p>{message.text}</p>

                {/* Display image if imageURL is available */}
                {message.imageURL && message.imageURL !== "none" && (
                  <div className="mt-2">
                    <Image
                      src={message.imageURL || "/placeholder.svg"}
                      alt="Response image"
                      width={300}
                      height={200}
                      className="rounded max-w-full"
                    />
                  </div>
                )}

                {/* Display location coordinates if available with enhanced styling */}
                {message.locationCoordinates && (
                  <div className="mt-2 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                    <div className="flex items-center text-red-700 font-medium mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                      </svg>
                      Disaster Location Detected
                    </div>
                    <p className="text-sm text-red-600 font-medium">
                      Coordinates:{" "}
                      {typeof message.locationCoordinates.latitude === "string"
                        ? message.locationCoordinates.latitude
                        : message.locationCoordinates.latitude.toFixed(6)}
                      ,{" "}
                      {typeof message.locationCoordinates.longitude === "string"
                        ? message.locationCoordinates.longitude
                        : message.locationCoordinates.longitude.toFixed(6)}
                    </p>
                    <div className="flex items-center mt-2 bg-white/50 p-2 rounded text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1 text-red-500"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span className="text-gray-800">
                        This location has been marked on the map with a pulsing red marker
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Human layout
            <div className="flex justify-end items-start mb-4">
              <div
                className={`${bubbleColor} p-3 rounded-lg shadow-md text-gray-800 text-sm sm:text-base max-w-[80%] sm:max-w-[70%] text-wrap break-words`}
              >
                <p>{message.text}</p>
              </div>
              <div className="w-[36px] h-[36px] rounded-md bg-gray-300 ml-2 flex-shrink-0 flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
            </div>
          )}
        </span>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

