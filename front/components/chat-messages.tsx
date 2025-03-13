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
                      className="rounded"
                    />
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

