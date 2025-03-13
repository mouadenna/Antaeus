"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FAQSuggestionsProps {
  suggestions: string[]
  onSelectSuggestion: (question: string) => void
  userRole: "user" | "admin"
}

export function FAQSuggestions({ suggestions, onSelectSuggestion, userRole }: FAQSuggestionsProps) {
  // Different suggestions based on user role
  const getTitle = () => {
    if (userRole === "admin") {
      return "Admin Dashboard"
    }
    return "Disaster Response Assistant"
  }

  const getDescription = () => {
    if (userRole === "admin") {
      return "Manage emergency responses and monitor situations"
    }
    return "Get information about shelters, evacuation routes, and emergency services"
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Frequently Asked Questions</h3>
          <div className="grid gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto py-2 px-3 text-left"
                onClick={() => onSelectSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

