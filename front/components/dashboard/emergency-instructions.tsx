"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardCard } from "./dashboard-card"

interface Instruction {
  step: number
  title: string
  description: string
}

interface EmergencyInstructionsProps {
  instructions: Instruction[]
  onGetPersonalizedHelp?: () => void
}

export function EmergencyInstructions({ instructions, onGetPersonalizedHelp }: EmergencyInstructionsProps) {
  return (
    <DashboardCard
      title="Emergency Instructions"
      description="What to do during an emergency"
      footer={
        onGetPersonalizedHelp && (
          <Button className="w-full" onClick={onGetPersonalizedHelp}>
            Get Personalized Help <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )
      }
    >
      <div className="space-y-4">
        {instructions.map((instruction) => (
          <div key={instruction.step} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-blue-600">{instruction.step}</span>
            </div>
            <div>
              <h4 className="font-medium">{instruction.title}</h4>
              <p className="text-sm text-gray-600">{instruction.description}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

