"use client"

import { useRef, useEffect } from "react"

interface ChatMessagesProps {
  messages: string[]
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
    <div className="w-full flex flex-col-reverse">
      <div ref={messagesEndRef} />
      {messages.map((message, index) => (
        <span key={index}>
          {index % 2 === 0 ? (
            <div className="flex justify-end items-start mb-4">
              <div
                className={`${bubbleColor} p-3 rounded-lg shadow-md text-gray-800 text-sm sm:text-base max-w-[80%] sm:max-w-[70%] text-wrap break-words`}
              >
                <p>{message}</p>
              </div>
              <div className="w-[36px] h-[36px] rounded-md bg-gray-300 ml-2 flex-shrink-0 flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-start items-start mb-4">
              <div className="w-[36px] h-[36px] rounded-md bg-blue-100 mr-2 flex-shrink-0 flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <div
                className={`${bubbleColor} max-w-[80%] sm:max-w-[70%] shadow-md text-gray-800 text-wrap break-words p-3 rounded-lg text-sm sm:text-base`}
              >
                <p>{message}</p>
              </div>
            </div>
          )}
        </span>
      ))}
    </div>
  )
}

