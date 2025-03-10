"use client"

import { Button } from "@/components/ui/button"

interface FAQSuggestionsProps {
  suggestions: string[]
  onSelectSuggestion: (suggestion: string) => void
  userRole: "user" | "admin"
}

export function FAQSuggestions({ suggestions, onSelectSuggestion, userRole }: FAQSuggestionsProps) {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="w-[100px] h-[100px] rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center">
        <span className="text-4xl">🤖</span>
      </div>
      <h2 className="text-xl font-bold text-center mb-2">
        {userRole === "user" ? "Disaster Response Assistant" : "Team Communication Center"}
      </h2>
      <p className="text-center text-gray-600 mb-4">
        Ask me about emergency resources, evacuation routes, or report a situation. I can show information on the map as
        we chat.
      </p>
      <div className="flex flex-col gap-2 w-full max-w-md">
        {suggestions.map((suggestion, i) => (
          <Button
            key={i}
            variant="outline"
            className="justify-start text-left"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}

