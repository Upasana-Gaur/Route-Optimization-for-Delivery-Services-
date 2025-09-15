// route.ts
import { type NextRequest, NextResponse } from "next/server"
import DehradunGraph from "@/lib/dehradun-graph"

interface Location {
  id: string
  name: string
  lat: number
  lng: number
  address: string
}

interface OptimizeRequest {
  locations: Location[]
  algorithm: string
}

// Initialize the graph once
let graph: DehradunGraph | null = null

async function getGraph() {
  if (!graph) {
    console.log("Initializing new graph...")
    graph = new DehradunGraph()
    // Wait for the graph to initialize properly
    await graph.waitForInitialization()
    console.log("Graph ready!")
  }
  return graph
}

export async function POST(request: NextRequest) {
  try {
    const { locations, algorithm }: OptimizeRequest = await request.json()

    console.log(`Optimization request: ${algorithm} with ${locations.length} locations`)

    if (!locations || locations.length < 2) {
      return NextResponse.json({ error: "At least 2 locations required" }, { status: 400 })
    }

    const dehradunGraph = await getGraph()
    let result

    switch (algorithm) {
      case "shortest": {
        const startName = locations[0].name
        const endName = locations[1].name
        console.log(`Dijkstra: ${startName} -> ${endName}`)
        result = dehradunGraph.dijkstraShortestPath(startName, endName)
        break
      }
      case "alternative": {
        const startName = locations[0].name
        const endName = locations[1].name
        console.log(`Bellman-Ford: ${startName} -> ${endName}`)
        result = dehradunGraph.bellmanFordAlternativePath(startName, endName)
        break
      }
      case "multiple": {
        const startName = locations[0].name
        const deliveryPoints = locations.slice(1).map((loc) => loc.name)
        console.log(`TSP: Start at ${startName}, deliver to ${deliveryPoints.join(", ")}`)
        result = dehradunGraph.tspNearestNeighbor(startName, deliveryPoints)
        break
      }
      default:
        return NextResponse.json({ error: "Invalid algorithm" }, { status: 400 })
    }

    // Calculate fuel cost (assuming ₹100 per liter, 15 km/l)
    const fuelCost = (result.distance / 15) * 100

    console.log(`Result: ${result.distance}km, ${result.duration}min, ₹${fuelCost.toFixed(0)} fuel`)

    // Convert path names back to location objects for frontend
    const pathLocations = result.path.map((name) => {
      const location = locations.find((loc) => loc.name === name)
      return (
        location || {
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name,
          lat: 30.3165,
          lng: 78.0322,
          address: `${name}, Dehradun`,
        }
      )
    })

    // Convert alternative paths if they exist
    const alternativePaths = result.alternativePaths?.map((altPath) => ({
      ...altPath,
      path: altPath.path.map((name) => {
        const location = locations.find((loc) => loc.name === name)
        return (
          location || {
            id: name.toLowerCase().replace(/\s+/g, "-"),
            name,
            lat: 30.3165,
            lng: 78.0322,
            address: `${name}, Dehradun`,
          }
        )
      }),
      coordinates: dehradunGraph.generateRouteCoordinates(altPath.path),
    }))

    return NextResponse.json({
      distance: result.distance,
      duration: result.duration,
      path: pathLocations,
      algorithm,
      fuelCost,
      coordinates: result.coordinates,
      waypoints: result.waypoints,
      instructions: result.instructions,
      alternativePaths,
    })
  } catch (error) {
    console.error("Optimization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}