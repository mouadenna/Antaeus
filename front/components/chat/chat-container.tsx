"use client"

import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { FAQSuggestions } from "./faq-suggestions"
import { MapPreview } from "./map-preview"
import { ChatActions } from "./chat-actions"
import type { MapMarker } from "../map-component"

interface ChatContainerProps {
  messages: string[]
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
  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
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

            <div className="mt-auto">
              <ChatInput emergencyMode={emergencyMode} onSendMessage={onSendMessage} />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 h-[300px] md:h-full">
          <MapPreview
            markers={mapMarkers}
            currentDisaster={currentDisaster}
            onMarkerClick={onMarkerClick}
            onOpenFullMap={onOpenFullMap}
          />
        </div>
      </div>
    </div>
  )
}

