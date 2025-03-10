// Sample data for alerts
export const alerts = [
  {
    id: 1,
    type: "Flood Warning",
    severity: "critical",
    area: "Downtown and Riverside",
    message: "Flash flooding expected in low-lying areas. Evacuate immediately if in a flood-prone area.",
    issued: "Today, 08:30 AM",
    expires: "Today, 08:30 PM",
    source: "National Weather Service",
    category: "weather",
  },
  {
    id: 2,
    type: "Road Closure",
    severity: "high",
    area: "Main Street Bridge",
    message: "Main Street Bridge closed due to structural damage. Use alternate routes.",
    issued: "Today, 10:15 AM",
    expires: "Until further notice",
    source: "Department of Transportation",
    category: "infrastructure",
  },
  {
    id: 3,
    type: "Evacuation Order",
    severity: "critical",
    area: "East Riverside District",
    message: "Mandatory evacuation for all residents in East Riverside. Report to designated shelters.",
    issued: "Today, 09:45 AM",
    expires: "Until further notice",
    source: "Emergency Management Agency",
    category: "evacuation",
  },
  {
    id: 4,
    type: "Shelter Opening",
    severity: "info",
    area: "Central High School",
    message: "Emergency shelter opened at Central High School. Capacity for 350 people.",
    issued: "Today, 11:00 AM",
    expires: "Until further notice",
    source: "Red Cross",
    category: "shelter",
  },
  {
    id: 5,
    type: "Boil Water Advisory",
    severity: "medium",
    area: "North and East Districts",
    message: "Water system compromised. Boil all water before consumption.",
    issued: "Yesterday, 06:30 PM",
    expires: "Until further notice",
    source: "Public Health Department",
    category: "health",
  },
]

// Weather alerts
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

// Get alerts by category
export const getAlertsByCategory = (category: string, severity = "all") => {
  return alerts.filter((alert) => {
    if (category !== "all" && alert.category !== category) return false
    if (severity !== "all" && alert.severity !== severity) return false
    return true
  })
}

// Get severity color class
export const getSeverityColorClass = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-300"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-300"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-300"
    case "low":
      return "bg-green-100 text-green-800 border-green-300"
    case "info":
      return "bg-blue-100 text-blue-800 border-blue-300"
    case "warning":
      return "bg-amber-100 text-amber-800 border-amber-300"
    case "advisory":
      return "bg-blue-100 text-blue-800 border-blue-300"
    default:
      return "bg-gray-100 text-gray-800 border-gray-300"
  }
}

