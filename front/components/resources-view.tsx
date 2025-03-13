"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, ShieldAlert, Droplets, Wind } from "lucide-react"

interface ResourcesViewProps {
  currentDisaster: string | null
}

export function ResourcesView({ currentDisaster }: ResourcesViewProps) {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Disaster Resources</h1>

        {currentDisaster && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h2 className="text-lg font-semibold flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5 text-amber-600" />
              Current Disaster: {currentDisaster}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              The following resources are specifically relevant to the current disaster situation.
            </p>
          </div>
        )}

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General Preparedness</TabsTrigger>
            <TabsTrigger value="hurricane">Hurricane</TabsTrigger>
            <TabsTrigger value="flood">Flood</TabsTrigger>
            <TabsTrigger value="tornado">Tornado</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid gap-4 md:grid-cols-2">
              <ResourceCard
                title="Emergency Kit Checklist"
                description="Essential items to include in your emergency preparedness kit"
                icon={<FileText className="h-5 w-5 text-blue-500" />}
                content={
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Water (one gallon per person per day for at least three days)</li>
                    <li>Non-perishable food (at least a three-day supply)</li>
                    <li>Battery-powered or hand crank radio</li>
                    <li>Flashlight and extra batteries</li>
                    <li>First aid kit</li>
                    <li>Whistle to signal for help</li>
                    <li>Dust mask, plastic sheeting, and duct tape</li>
                    <li>Moist towelettes, garbage bags, and plastic ties</li>
                    <li>Wrench or pliers to turn off utilities</li>
                    <li>Manual can opener</li>
                    <li>Local maps</li>
                    <li>Cell phone with chargers and a backup battery</li>
                  </ul>
                }
              />

              <ResourceCard
                title="Family Emergency Plan"
                description="How to create and practice your family emergency plan"
                icon={<FileText className="h-5 w-5 text-green-500" />}
                content={
                  <div className="space-y-3">
                    <p>Create a family emergency plan that includes:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Meeting locations (both in your neighborhood and outside your neighborhood)</li>
                      <li>Emergency contact information for all family members</li>
                      <li>Out-of-town contact person</li>
                      <li>Evacuation routes from your home</li>
                      <li>Location of utility shut-offs</li>
                      <li>Important medical information</li>
                      <li>Plan for pets</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-2">Practice your plan at least twice a year.</p>
                  </div>
                }
              />

              <ResourceCard
                title="Important Documents"
                description="Critical documents to protect during an emergency"
                icon={<FileText className="h-5 w-5 text-purple-500" />}
                content={
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Insurance policies</li>
                    <li>Identification documents (passports, driver's licenses, birth certificates)</li>
                    <li>Bank account records</li>
                    <li>Medical information (prescriptions, medical conditions)</li>
                    <li>Emergency contact information</li>
                    <li>Property deeds or leases</li>
                    <li>Keep these documents in a waterproof, portable container</li>
                    <li>Consider storing digital copies in a secure cloud service</li>
                  </ul>
                }
              />

              <ResourceCard
                title="Emergency Alerts"
                description="How to stay informed during emergencies"
                icon={<FileText className="h-5 w-5 text-red-500" />}
                content={
                  <div className="space-y-3">
                    <p>Sign up for emergency alerts through:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Wireless Emergency Alerts (WEA) on your mobile phone</li>
                      <li>NOAA Weather Radio</li>
                      <li>Local emergency management apps</li>
                      <li>Social media accounts of local emergency services</li>
                      <li>Community warning systems</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-2">
                      Keep a battery-powered or hand-crank radio for when power and cellular networks are down.
                    </p>
                  </div>
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="hurricane">
            <div className="grid gap-4 md:grid-cols-2">
              <ResourceCard
                title="Hurricane Preparedness"
                description="How to prepare for a hurricane"
                icon={<Wind className="h-5 w-5 text-blue-500" />}
                content={
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Know your evacuation zone and route</li>
                    <li>Prepare your home by covering windows with storm shutters</li>
                    <li>Secure outdoor objects that could become projectiles</li>
                    <li>Fill your car's gas tank and prepare an emergency kit</li>
                    <li>Follow evacuation orders from local officials</li>
                    <li>Stay informed through NOAA Weather Radio or local news</li>
                  </ul>
                }
              />

              <ResourceCard
                title="Hurricane Safety"
                description="What to do during and after a hurricane"
                icon={<Wind className="h-5 w-5 text-red-500" />}
                content={
                  <div className="space-y-3">
                    <p className="font-medium">During:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Stay indoors away from windows and glass doors</li>
                      <li>Take refuge in a small interior room, closet, or hallway</li>
                      <li>Do not go outside during the eye of the storm</li>
                    </ul>
                    <p className="font-medium mt-2">After:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Return home only when authorities say it's safe</li>
                      <li>Avoid walking or driving through flood waters</li>
                      <li>Stay away from downed power lines</li>
                      <li>Document property damage with photographs for insurance</li>
                    </ul>
                  </div>
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="flood">
            <div className="grid gap-4 md:grid-cols-2">
              <ResourceCard
                title="Flood Preparedness"
                description="How to prepare for flooding"
                icon={<Droplets className="h-5 w-5 text-blue-500" />}
                content={
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Know your flood risk and have flood insurance</li>
                    <li>Prepare an emergency kit with supplies</li>
                    <li>Elevate electrical systems and appliances</li>
                    <li>Install check valves in plumbing to prevent backflow</li>
                    <li>Consider a sump pump with battery backup</li>
                    <li>Have a waterproof container for important documents</li>
                  </ul>
                }
              />

              <ResourceCard
                title="Flood Safety"
                description="What to do during and after a flood"
                icon={<Droplets className="h-5 w-5 text-red-500" />}
                content={
                  <div className="space-y-3">
                    <p className="font-medium">During:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Evacuate immediately if told to do so</li>
                      <li>Move to higher ground away from rivers, streams, and creeks</li>
                      <li>Do not walk, swim, or drive through flood waters</li>
                      <li>Stay off bridges over fast-moving water</li>
                    </ul>
                    <p className="font-medium mt-2">After:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Return home only when authorities say it's safe</li>
                      <li>Be aware of areas where floodwaters have receded</li>
                      <li>Clean and disinfect everything that got wet</li>
                      <li>Do not use electrical appliances that have been wet</li>
                    </ul>
                  </div>
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="tornado">
            <div className="grid gap-4 md:grid-cols-2">
              <ResourceCard
                title="Tornado Preparedness"
                description="How to prepare for a tornado"
                icon={<Wind className="h-5 w-5 text-green-500" />}
                content={
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Know the signs of a tornado: rotating, funnel-shaped cloud</li>
                    <li>Identify a safe room in your home (basement, storm cellar, interior room)</li>
                    <li>Practice tornado drills with your family</li>
                    <li>Have a weather radio with a warning alarm</li>
                    <li>Prepare an emergency kit with supplies</li>
                    <li>Know the difference between a tornado watch and warning</li>
                  </ul>
                }
              />

              <ResourceCard
                title="Tornado Safety"
                description="What to do during and after a tornado"
                icon={<Wind className="h-5 w-5 text-red-500" />}
                content={
                  <div className="space-y-3">
                    <p className="font-medium">During:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Go to your pre-designated safe room</li>
                      <li>If outside, seek shelter in a sturdy building</li>
                      <li>If in a vehicle, do not try to outrun a tornado</li>
                      <li>Protect your head and neck with your arms</li>
                    </ul>
                    <p className="font-medium mt-2">After:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Stay clear of fallen power lines or broken gas lines</li>
                      <li>Check for injuries and provide first aid</li>
                      <li>Watch out for debris and damaged buildings</li>
                      <li>Use text messages or social media to contact family</li>
                    </ul>
                  </div>
                }
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface ResourceCardProps {
  title: string
  description: string
  icon: React.ReactNode
  content: React.ReactNode
}

function ResourceCard({ title, description, icon, content }: ResourceCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}

