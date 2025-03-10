// Emergency Stats
export const emergencyStats = {
  activeIncidents: 14,
  pendingRequests: 8,
  deployedTeams: 6,
  affectedAreas: 3,
  evacuationCenters: 5,
  peopleEvacuated: 237,
}

// Resource Stats
export const resourceStats = {
  water: { available: 2500, allocated: 1200, unit: "bottles" },
  food: { available: 850, allocated: 320, unit: "kits" },
  medical: { available: 320, allocated: 145, unit: "kits" },
  shelter: { available: 500, allocated: 237, unit: "spaces" },
}

// Recent Reports
export const recentReports = [
  {
    id: 1,
    type: "Flood",
    location: "Main Street near Central Park",
    severity: "Critical",
    time: "15 minutes ago",
    reportMethod: "voice",
  },
  {
    id: 2,
    type: "Building Damage",
    location: "Downtown, 5th Avenue",
    severity: "High",
    time: "32 minutes ago",
    reportMethod: "text",
  },
  {
    id: 3,
    type: "Medical Emergency",
    location: "Riverside Community Center",
    severity: "Medium",
    time: "1 hour ago",
    reportMethod: "text",
  },
  {
    id: 4,
    type: "Road Blockage",
    location: "Highway 101, North Exit",
    severity: "Medium",
    time: "2 hours ago",
    reportMethod: "voice",
  },
]

// Team Status
export const teamStatus = [
  { id: 1, name: "Search & Rescue Alpha", members: 8, status: "Deployed", location: "Downtown" },
  { id: 2, name: "Medical Response Team", members: 6, status: "Deployed", location: "Riverside" },
  { id: 3, name: "Evacuation Support", members: 10, status: "Standby", location: "HQ" },
  { id: 4, name: "Infrastructure Assessment", members: 4, status: "Deployed", location: "North District" },
]

// Weather Alerts
export const weatherAlerts = [
  {
    id: 1,
    type: "Heavy Rain",
    severity: "Warning",
    expires: "6 hours",
    details: "Potential for flash flooding in low-lying areas",
  },
  {
    id: 2,
    type: "Strong Winds",
    severity: "Advisory",
    expires: "12 hours",
    details: "Gusts up to 45mph expected",
  },
]

// Nearby Resources
export const nearbyResources = [
  { id: 1, name: "Central High School Shelter", distance: "1.2 miles", type: "shelter", status: "Open" },
  { id: 2, name: "Downtown Medical Station", distance: "0.8 miles", type: "medical", status: "Open" },
  { id: 3, name: "Water Distribution Point", distance: "1.5 miles", type: "supplies", status: "Open" },
]

// Active Alerts
export const activeAlerts = [
  { id: 1, type: "Flood Warning", area: "Downtown", expires: "2 hours", severity: "high" },
  { id: 2, type: "Road Closure", area: "Main Street Bridge", expires: "Until further notice", severity: "medium" },
]

// Timeline Events
export const timelineEvents = [
  {
    id: 1,
    title: "Emergency Declared",
    time: "Today, 08:45 AM",
    icon: "alert-triangle",
  },
  {
    id: 2,
    title: "Response Teams Deployed",
    time: "Today, 09:15 AM",
    icon: "users",
  },
  {
    id: 3,
    title: "Evacuation Centers Opened",
    time: "Today, 10:30 AM",
    icon: "home",
  },
  {
    id: 4,
    title: "Supply Distribution Started",
    time: "Today, 11:45 AM",
    icon: "truck",
  },
]

