import { type NextRequest, NextResponse } from "next/server"

interface Location {
  id: string
  name: string
  lat: number
  lng: number
  address: string
}

interface RoutingRequest {
  start: Location
  end: Location
  profile?: string
}

// OpenRouteService API for real routing data
async function getRouteFromAPI(start: Location, end: Location, profile = "driving-car") {
  try {
    // Using OpenRouteService (free tier)
    const url = `https://api.openrouteservice.org/v2/directions/${profile}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        Authorization: "5b3ce3597851110001cf6248a707b5b4c8b24d7b9b0b4c5e8b5f5e5e5e5e5e5e", // Demo key - replace with your own
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        coordinates: [
          [start.lng, start.lat],
          [end.lng, end.lat],
        ],
        format: "geojson",
        instructions: true,
        language: "en",
      }),
    })

    if (!response.ok) {
      throw new Error(`Routing API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.features && data.features.length > 0) {
      const route = data.features[0]
      const coordinates = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]) // Flip to [lat, lng]
      const distance = route.properties.segments[0].distance / 1000 // Convert to km
      const duration = Math.round(route.properties.segments[0].duration / 60) // Convert to minutes
      const instructions = route.properties.segments[0].steps || []

      return {
        coordinates,
        distance,
        duration,
        instructions,
        waypoints: extractWaypoints(coordinates, instructions),
      }
    }
  } catch (error) {
    console.error("Routing API error:", error)
    // Fallback to straight line calculation
    return getFallbackRoute(start, end)
  }

  return getFallbackRoute(start, end)
}

// Extract key waypoints from the route
function extractWaypoints(coordinates: number[][], instructions: any[]) {
  const waypoints = []

  // Add start point
  waypoints.push({
    lat: coordinates[0][0],
    lng: coordinates[0][1],
    instruction: "Start your journey",
    type: "start",
  })

  // Add key turning points based on instructions
  instructions.forEach((instruction, index) => {
    if (instruction.type !== 0 && instruction.way_points && instruction.way_points.length > 0) {
      // Not straight ahead
      const waypointIndex = instruction.way_points[0]
      if (waypointIndex < coordinates.length) {
        waypoints.push({
          lat: coordinates[waypointIndex][0],
          lng: coordinates[waypointIndex][1],
          instruction: instruction.instruction || `Turn at waypoint ${index + 1}`,
          type: "waypoint",
          distance: instruction.distance,
          duration: instruction.duration,
        })
      }
    }
  })

  // Add end point
  waypoints.push({
    lat: coordinates[coordinates.length - 1][0],
    lng: coordinates[coordinates.length - 1][1],
    instruction: "Arrive at destination",
    type: "end",
  })

  return waypoints
}

// Fallback calculation using Haversine distance
function getFallbackRoute(start: Location, end: Location) {
  const distance = calculateHaversineDistance(start.lat, start.lng, end.lat, end.lng)
  const duration = Math.round(distance * 2) // Rough estimate: 2 minutes per km

  return {
    coordinates: [
      [start.lat, start.lng],
      [end.lat, end.lng],
    ],
    distance,
    duration,
    instructions: [{ instruction: `Head towards ${end.name}`, distance: distance * 1000, duration: duration * 60 }],
    waypoints: [
      { lat: start.lat, lng: start.lng, instruction: "Start your journey", type: "start" },
      { lat: end.lat, lng: end.lng, instruction: "Arrive at destination", type: "end" },
    ],
  }
}

function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Generate realistic route coordinates with waypoints
function generateRealisticRoute(start: Location, end: Location) {
  const distance = calculateHaversineDistance(start.lat, start.lng, end.lat, end.lng)
  const duration = Math.round(distance * 2.5) // More realistic: 2.5 minutes per km in city traffic

  // Generate intermediate waypoints to simulate real road routing
  const waypoints = []
  const numWaypoints = Math.min(Math.max(Math.floor(distance * 2), 2), 8) // 2-8 waypoints based on distance

  for (let i = 0; i <= numWaypoints; i++) {
    const ratio = i / numWaypoints

    // Add some realistic deviation from straight line to simulate roads
    const deviation = (Math.random() - 0.5) * 0.01 * distance // Random deviation

    const lat = start.lat + (end.lat - start.lat) * ratio + deviation
    const lng = start.lng + (end.lng - start.lng) * ratio + deviation * 0.8

    waypoints.push([lat, lng])
  }

  // Generate turn-by-turn instructions
  const instructions = [
    { instruction: `Head ${getDirection(start, end)} on ${getRandomRoad()}`, distance: distance * 300, duration: 180 },
    { instruction: `Continue straight for ${(distance * 0.4).toFixed(1)} km`, distance: distance * 400, duration: 240 },
    {
      instruction: `Turn ${Math.random() > 0.5 ? "right" : "left"} onto ${getRandomRoad()}`,
      distance: distance * 200,
      duration: 120,
    },
    { instruction: `Arrive at ${end.name}`, distance: 0, duration: 0 },
  ]

  // Generate navigation waypoints
  const navWaypoints = [
    { lat: start.lat, lng: start.lng, instruction: "Start your journey", type: "start" },
    ...waypoints.slice(1, -1).map((coord, index) => ({
      lat: coord[0],
      lng: coord[1],
      instruction: `Continue on route - Waypoint ${index + 1}`,
      type: "waypoint",
      distance: (distance * 1000) / waypoints.length,
      duration: duration / waypoints.length,
    })),
    { lat: end.lat, lng: end.lng, instruction: "Arrive at destination", type: "end" },
  ]

  return {
    coordinates: waypoints,
    distance,
    duration,
    instructions,
    waypoints: navWaypoints,
  }
}

function getDirection(start: Location, end: Location): string {
  const latDiff = end.lat - start.lat
  const lngDiff = end.lng - start.lng

  if (Math.abs(latDiff) > Math.abs(lngDiff)) {
    return latDiff > 0 ? "north" : "south"
  } else {
    return lngDiff > 0 ? "east" : "west"
  }
}

function getRandomRoad(): string {
  const roads = [
    "Rajpur Road",
    "Haridwar Road",
    "Sahastradhara Road",
    "Clock Tower Road",
    "Gandhi Road",
    "Paltan Bazaar",
    "Mussoorie Road",
    "Clement Town Road",
    "Race Course Road",
    "Malsi Road",
    "GMS Road",
    "Chakrata Road",
  ]
  return roads[Math.floor(Math.random() * roads.length)]
}

export async function POST(request: NextRequest) {
  try {
    const { start, end }: RoutingRequest = await request.json()

    if (!start || !end) {
      return NextResponse.json({ error: "Start and end locations required" }, { status: 400 })
    }

    // For demo purposes, always use the realistic route generator
    // In production, you could try the API first and fallback to this
    const routeData = generateRealisticRoute(start, end)

    return NextResponse.json(routeData)
  } catch (error) {
    console.error("Routing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
