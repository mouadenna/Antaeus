// Resource statistics
export const resourceStats = {
  water: { available: 2500, allocated: 1200, unit: "bottles" },
  food: { available: 850, allocated: 320, unit: "kits" },
  medical: { available: 320, allocated: 145, unit: "kits" },
  shelter: { available: 500, allocated: 237, unit: "spaces" },
}

// Distribution centers
export const distributionCenters = [
  {
    id: 1,
    name: "Central Distribution Hub",
    location: "City Hall, Downtown",
    status: "Active",
    capacity: "High",
    hours: "24/7",
    resources: ["Water", "Food", "Medical", "Blankets"],
  },
  {
    id: 2,
    name: "North Community Center",
    location: "Highland District",
    status: "Active",
    capacity: "Medium",
    hours: "8AM-8PM",
    resources: ["Water", "Food", "Blankets"],
  },
  {
    id: 3,
    name: "Riverside School",
    location: "East Riverside",
    status: "Active",
    capacity: "Medium",
    hours: "8AM-6PM",
    resources: ["Water", "Food", "Blankets"],
  },
  {
    id: 4,
    name: "South Medical Center",
    location: "South District",
    status: "Limited",
    capacity: "Low",
    hours: "24/7",
    resources: ["Medical"],
  },
]

// Request history
export const requestHistory = [
  {
    id: "REQ-1023",
    resource: "Water",
    quantity: "500 bottles",
    location: "Riverside Shelter",
    priority: "High",
    status: "In Progress",
    requestedAt: "Today, 10:30 AM",
  },
  {
    id: "REQ-1022",
    resource: "Medical Kits",
    quantity: "50 kits",
    location: "Downtown Medical Station",
    priority: "Critical",
    status: "Dispatched",
    requestedAt: "Today, 09:15 AM",
  },
  {
    id: "REQ-1021",
    resource: "Food",
    quantity: "100 kits",
    location: "North Community Center",
    priority: "Medium",
    status: "Completed",
    requestedAt: "Today, 08:45 AM",
  },
  {
    id: "REQ-1020",
    resource: "Blankets",
    quantity: "200 units",
    location: "Highland School",
    priority: "Medium",
    status: "Completed",
    requestedAt: "Yesterday, 04:30 PM",
  },
]

// Available supplies
export const availableSupplies = {
  water: [
    { name: "Bottled Water (500ml)", quantity: 2000, unit: "units" },
    { name: "Water Containers (5 gal)", quantity: 500, unit: "units" },
    { name: "Water Purification Tablets", quantity: 5000, unit: "units" },
  ],
  food: [
    { name: "Ready-to-eat Meals", quantity: 750, unit: "units" },
    { name: "Family Food Kits (3-day)", quantity: 100, unit: "units" },
    { name: "Baby Formula", quantity: 50, unit: "units" },
  ],
  medical: [
    { name: "First Aid Kits", quantity: 200, unit: "units" },
    { name: "Emergency Medications", quantity: 100, unit: "units" },
    { name: "Trauma Supplies", quantity: 20, unit: "units" },
  ],
  shelter: [
    { name: "Blankets", quantity: 300, unit: "units" },
    { name: "Cots", quantity: 150, unit: "units" },
    { name: "Hygiene Kits", quantity: 250, unit: "units" },
  ],
}

// Get status color class
export const getStatusColorClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "in progress":
      return "bg-amber-100 text-amber-800"
    case "dispatched":
      return "bg-blue-100 text-blue-800"
    case "pending":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Get priority color class
export const getPriorityColorClass = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "critical":
      return "bg-red-100 text-red-800"
    case "high":
      return "bg-orange-100 text-orange-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

