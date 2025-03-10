// Sample FAQ suggestions for the chat interface
export const faqSuggestions = [
  "Where are the nearest shelters?",
  "I need to report flooding",
  "Show evacuation routes",
  "How do I request emergency supplies?",
  "What should I do during an earthquake?",
]

// Sample chat responses based on keywords
export const chatResponses = {
  emergency:
    "Emergency mode activated. What type of disaster are you reporting? (Flood, Fire, Earthquake, Hurricane, Other)",

  flood:
    "Flood alert registered. I'm showing flood-prone areas and evacuation routes on the map. Please share your specific location for more targeted assistance.",

  fire: "Fire alert registered. Showing active fire zones, wind direction, and safe evacuation routes on the map. Please stay away from marked danger areas.",

  earthquake:
    "Earthquake alert registered. Showing damaged areas, structural risks, and safe gathering points on the map. Avoid marked buildings with structural damage.",

  hurricane:
    "Hurricane alert registered. Showing storm surge zones, wind projections, and evacuation routes on the map. Please follow evacuation orders if in a marked zone.",

  shelter:
    "Showing all nearby shelters and evacuation routes on the map. The closest shelter to you is Central High School (2.3 miles away).",

  supplies:
    "Opening resources panel. You can request emergency supplies, view available resources, and track supply deliveries here.",

  alerts: "Opening alerts panel. You can view all current emergency alerts, weather warnings, and status updates here.",

  voice: "Opening voice reporting tool. You can record an audio description of your emergency situation.",

  dashboard: "Opening the dashboard to give you an overview of the current situation.",

  help: "I can help with: 1) Reporting disasters 2) Finding shelters and evacuation routes 3) Requesting resources 4) Viewing alerts and warnings 5) Coordinating response teams. What do you need assistance with?",

  default:
    "I understand you're looking for assistance. Could you please specify if you need help with evacuation, shelter information, resource requests, or emergency reporting?",
}

// Sample notification messages
export const notificationMessages = {
  emergencyMode: {
    title: "Emergency Mode Activated",
    message: "Please provide details about the emergency",
    type: "alert" as const,
    duration: 0,
  },

  floodAlert: {
    title: "Flood Alert",
    message: "Flood warning issued for your area. Evacuation routes shown on map.",
    type: "alert" as const,
  },

  fireAlert: {
    title: "Fire Alert",
    message: "Fire warning issued for your area. Evacuation routes shown on map.",
    type: "alert" as const,
  },

  earthquakeAlert: {
    title: "Earthquake Alert",
    message: "Earthquake warning issued. Safe gathering points shown on map.",
    type: "alert" as const,
  },

  sheltersLocated: {
    title: "Shelters Located",
    message: "Showing nearby shelters and evacuation routes",
    type: "info" as const,
  },

  resourcesAvailable: {
    title: "Resources Available",
    message: "Check available emergency supplies and request what you need",
    type: "info" as const,
  },

  alertsPanel: {
    title: "Alerts Panel",
    message: "Showing all active alerts and warnings for your area",
    type: "warning" as const,
  },
}

