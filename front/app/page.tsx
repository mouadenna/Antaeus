"use client"
import ChatInterface from "@/components/chat-interface"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="disaster-response-theme">
      <div className="min-h-screen bg-background">
        <main className="container mx-auto">
          <ChatInterface />
        </main>
      </div>
    </ThemeProvider>
  )
}

