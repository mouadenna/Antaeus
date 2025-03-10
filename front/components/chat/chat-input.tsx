"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  emergencyMode: boolean
  onSendMessage: (message: string) => void
}

export function ChatInput({ emergencyMode, onSendMessage }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      onSendMessage(inputValue)
      setInputValue("")
    }
  }

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue("")
    }
  }

  return (
    <div className="flex justify-center items-center bg-white">
      <Input
        type="text"
        placeholder={emergencyMode ? "Describe the emergency situation..." : "Type your message..."}
        className={`border-2 w-full bg-white border-stone-400 rounded-full focus:outline-none text-gray-800 focus:border-primary focus:ring-1 focus:ring-primary hover:shadow-sm ${
          emergencyMode ? "border-red-400" : ""
        }`}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <Button className="ml-2 rounded-full h-10 w-10 flex items-center justify-center" onClick={handleSend}>
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
        >
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      </Button>
    </div>
  )
}

