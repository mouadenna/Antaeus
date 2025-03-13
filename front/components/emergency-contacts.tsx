"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, MapPin, Search, AlertTriangle, Ambulance, Shield } from "lucide-react"
import { useState } from "react"

export function EmergencyContacts() {
  const [zipCode, setZipCode] = useState("")
  const [showLocalContacts, setShowLocalContacts] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (zipCode.trim()) {
      setShowLocalContacts(true)
    }
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
          <h1 className="text-2xl font-bold">Emergency Contacts</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <EmergencyContactCard
            title="911 Emergency"
            description="For immediate life-threatening emergencies"
            icon={<Ambulance className="h-5 w-5 text-red-500" />}
            phoneNumber="911"
          />

          <EmergencyContactCard
            title="FEMA Disaster Assistance"
            description="Federal Emergency Management Agency"
            icon={<Shield className="h-5 w-5 text-blue-500" />}
            phoneNumber="1-800-621-3362"
          />

          <EmergencyContactCard
            title="National Poison Control Center"
            description="For poison emergencies"
            icon={<AlertTriangle className="h-5 w-5 text-purple-500" />}
            phoneNumber="1-800-222-1222"
          />

          <EmergencyContactCard
            title="National Suicide Prevention Lifeline"
            description="24/7 support for people in distress"
            icon={<Phone className="h-5 w-5 text-green-500" />}
            phoneNumber="988"
          />
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-gray-700" />
            Find Local Emergency Contacts
          </h2>

          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="flex-grow">
              <Label htmlFor="zipCode" className="sr-only">
                ZIP Code
              </Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="Enter your ZIP code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          {showLocalContacts && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Local Emergency Contacts for {zipCode}</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <LocalContactCard
                  title="Local Police Department"
                  address="123 Main Street"
                  phoneNumber="(555) 123-4567"
                />

                <LocalContactCard title="Fire Department" address="456 Oak Avenue" phoneNumber="(555) 765-4321" />

                <LocalContactCard
                  title="County Emergency Management"
                  address="789 Government Plaza"
                  phoneNumber="(555) 987-6543"
                />

                <LocalContactCard
                  title="Nearest Hospital"
                  address="321 Medical Center Drive"
                  phoneNumber="(555) 234-5678"
                />
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Note: These are example contacts. In a real application, this would display actual local emergency
                services based on the ZIP code.
              </p>
            </div>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Emergency Preparedness Tip</h2>
          <p>
            Save these emergency contacts in your phone and keep a printed copy in your emergency kit. Make sure all
            family members know how to reach emergency services.
          </p>
        </div>
      </div>
    </div>
  )
}

interface EmergencyContactCardProps {
  title: string
  description: string
  icon: React.ReactNode
  phoneNumber: string
}

function EmergencyContactCard({ title, description, icon, phoneNumber }: EmergencyContactCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <a
          href={`tel:${phoneNumber.replace(/[^0-9]/g, "")}`}
          className="flex items-center justify-center gap-2 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-md transition-colors"
        >
          <Phone className="h-4 w-4" />
          {phoneNumber}
        </a>
      </CardContent>
    </Card>
  )
}

interface LocalContactCardProps {
  title: string
  address: string
  phoneNumber: string
}

function LocalContactCard({ title, address, phoneNumber }: LocalContactCardProps) {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm border">
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-gray-600 flex items-center mt-1">
        <MapPin className="h-3 w-3 mr-1 inline" />
        {address}
      </p>
      <a
        href={`tel:${phoneNumber.replace(/[^0-9]/g, "")}`}
        className="text-sm text-blue-600 hover:text-blue-800 flex items-center mt-1"
      >
        <Phone className="h-3 w-3 mr-1 inline" />
        {phoneNumber}
      </a>
    </div>
  )
}

