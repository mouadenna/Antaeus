import type { MapMarker } from "@/components/map-component"

// Flood scenario markers
export const floodMarkers: MapMarker[] = [
  {
    id: 1,
    type: "danger",
    coordinates: [-74.006, 40.7128],
    title: "Flood Zone - High Risk",
    details: "Active flooding reported. Water level rising.",
    severity: "Critical",
  },
  {
    id: 2,
    type: "shelter",
    coordinates: [-74.02, 40.73],
    title: "Highland School Shelter",
    details: "Emergency shelter with capacity for 350 people",
    capacity: 350,
    status: "Open",
  },
  {
    id: 3,
    type: "evacuation",
    coordinates: [-74.01, 40.72],
    title: "Evacuation Route 1",
    details: "Main evacuation route to higher ground",
  },
  {
    id: 4,
    type: "resource",
    coordinates: [-74.015, 40.725],
    title: "Water Distribution Point",
    details: "Clean water and emergency supplies available",
    status: "Active",
  },
]

// Fire scenario markers
export const fireMarkers: MapMarker[] = [
  {
    id: 1,
    type: "danger",
    coordinates: [-74.006, 40.7128],
    title: "Active Fire Zone",
    details: "Uncontained wildfire spreading eastward",
    severity: "Critical",
  },
  {
    id: 2,
    type: "shelter",
    coordinates: [-74.03, 40.74],
    title: "Community Center Shelter",
    details: "Emergency shelter for fire evacuees",
    capacity: 200,
    status: "Open",
  },
  {
    id: 3,
    type: "evacuation",
    coordinates: [-74.02, 40.73],
    title: "Fire Evacuation Route",
    details: "Safe route away from fire zone",
  },
  {
    id: 4,
    type: "resource",
    coordinates: [-74.025, 40.735],
    title: "Fire Response Team",
    details: "Firefighters and emergency personnel stationed here",
    status: "Active",
  },
]

// Earthquake scenario markers
export const earthquakeMarkers: MapMarker[] = [
  {
    id: 1,
    type: "danger",
    coordinates: [-74.006, 40.7128],
    title: "Building Collapse Risk",
    details: "Structural damage reported in this area",
    severity: "High",
  },
  {
    id: 2,
    type: "shelter",
    coordinates: [-74.02, 40.73],
    title: "Safe Gathering Point",
    details: "Open area away from buildings",
    capacity: 500,
    status: "Open",
  },
  {
    id: 3,
    type: "resource",
    coordinates: [-74.01, 40.72],
    title: "Search & Rescue Team",
    details: "Emergency responders conducting search operations",
    status: "Active",
  },
  {
    id: 4,
    type: "resource",
    coordinates: [-74.015, 40.725],
    title: "Medical Station",
    details: "First aid and emergency medical care",
    status: "Active",
  },
]

// Hurricane scenario markers
export const hurricaneMarkers: MapMarker[] = [
  {
    id: 1,
    type: "danger",
    coordinates: [-74.006, 40.7128],
    title: "Storm Surge Zone",
    details: "High risk of flooding from storm surge",
    severity: "Critical",
  },
  {
    id: 2,
    type: "shelter",
    coordinates: [-74.03, 40.74],
    title: "Hurricane Shelter",
    details: "Reinforced building safe from high winds",
    capacity: 300,
    status: "Open",
  },
  {
    id: 3,
    type: "evacuation",
    coordinates: [-74.01, 40.72],
    title: "Hurricane Evacuation Route",
    details: "Designated route inland away from coastal areas",
  },
  {
    id: 4,
    type: "resource",
    coordinates: [-74.015, 40.725],
    title: "Emergency Supply Center",
    details: "Hurricane preparedness kits and supplies",
    status: "Active",
  },
]

// Get markers by disaster type
export const getMarkersByDisasterType = (disasterType: string | null): MapMarker[] => {
  switch (disasterType?.toLowerCase()) {
    case "flood":
      return floodMarkers
    case "fire":
      return fireMarkers
    case "earthquake":
      return earthquakeMarkers
    case "hurricane":
      return hurricaneMarkers
    default:
      return []
  }
}

