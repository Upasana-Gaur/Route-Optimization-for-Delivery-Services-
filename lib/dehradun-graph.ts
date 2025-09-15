// // Dehradun Graph Implementation - Converted from C++ to TypeScript
// // Based on real-world distance data from Dehradun

// interface Edge {
//   dest: number
//   weight: number
// }

// interface Node {
//   id: number
//   name: string
// }

// interface RouteResult {
//   distance: number
//   duration: number
//   path: string[]
//   coordinates?: number[][]
//   waypoints?: any[]
//   instructions?: any[]
//   alternativePaths?: {
//     path: string[]
//     distance: number
//     duration: number
//   }[]
// }

// class DehradunGraph {
//   private nodes: Node[] = []
//   private adjList: Edge[][] = []
//   private nodeMap: Map<string, number> = new Map()
//   private locationList: string[] = []
//   private nodeCount = 0
//   private isInitialized = false

//   constructor() {
//     this.initializeGraph()
//   }

//   private async initializeGraph() {
//     try {
//       // Load the distance data from the public folder
//       const response = await fetch("/dehradun-distances.txt")
//       if (!response.ok) {
//         throw new Error(`Failed to fetch: ${response.status}`)
//       }
//       const distanceData = await response.text()
//       this.parseDistanceData(distanceData)
//       this.isInitialized = true
//       console.log(`✅ Graph initialized with ${this.nodeCount} locations and real distance data`)
//     } catch (error) {
//       console.error("❌ Failed to load distance data:", error)
//       this.initializeDefaultLocations()
//       this.isInitialized = true
//     }
//   }

//   private parseDistanceData(distanceData: string) {
//     const lines = distanceData.trim().split("\n")
//     const locationCount = Number.parseInt(lines[0])

//     console.log(`📍 Loading ${locationCount} Dehradun locations...`)

//     // Parse location names
//     for (let i = 1; i <= locationCount; i++) {
//       const locationName = lines[i].trim()
//       this.addNode(locationName)
//     }

//     // Parse distance relationships
//     let edgeCount = 0
//     for (let i = locationCount + 1; i < lines.length; i++) {
//       const line = lines[i].trim()
//       if (line.includes("|")) {
//         const parts = line.split("|")
//         if (parts.length === 3) {
//           const source = parts[0].trim()
//           const destination = parts[1].trim()
//           const distance = Number.parseInt(parts[2].trim())
//           if (!isNaN(distance) && distance > 0) {
//             this.addEdge(source, destination, distance)
//             edgeCount++
//           }
//         }
//       }
//     }
//     console.log(`🛣️ Loaded ${edgeCount} real distance relationships`)
//   }

//   private initializeDefaultLocations() {
//     console.log("⚠️ Using fallback locations...")
//     // Fallback locations if file loading fails
//     const defaultLocations = [
//       "ISBT Dehradun",
//       "Dehradun Railway Station",
//       "Jolly Grant Airport",
//       "Pacific Mall",
//       "Crossroads Mall",
//       "Paltan Bazaar",
//       "Clock Tower",
//       "Forest Research Institute",
//       "Robber's Cave",
//       "Sahastradhara Road",
//     ]

//     defaultLocations.forEach((name) => this.addNode(name))

//     // Add some default connections with realistic distances
//     this.addEdge("ISBT Dehradun", "Dehradun Railway Station", 5)
//     this.addEdge("ISBT Dehradun", "Pacific Mall", 12)
//     this.addEdge("Dehradun Railway Station", "Clock Tower", 2)
//     this.addEdge("Pacific Mall", "Sahastradhara Road", 3)
//     this.addEdge("Clock Tower", "Paltan Bazaar", 1)
//     this.addEdge("Forest Research Institute", "Robber's Cave", 8)
//     this.addEdge("Jolly Grant Airport", "ISBT Dehradun", 29)
//     this.addEdge("Crossroads Mall", "Paltan Bazaar", 3)
//   }

//   private addNode(name: string) {
//     if (!this.nodeMap.has(name)) {
//       this.nodes.push({ id: this.nodeCount, name })
//       this.adjList.push([])
//       this.nodeMap.set(name, this.nodeCount)
//       this.locationList.push(name)
//       this.nodeCount++
//     }
//   }

//   private addEdge(src: string, dest: string, weight: number) {
//     this.addNode(src)
//     this.addNode(dest)

//     const srcId = this.nodeMap.get(src)!
//     const destId = this.nodeMap.get(dest)!

//     // Add bidirectional edges
//     this.adjList[srcId].push({ dest: destId, weight })
//     this.adjList[destId].push({ dest: srcId, weight })
//   }

//   // Wait for initialization
//   async waitForInitialization(): Promise<void> {
//     let attempts = 0
//     while (!this.isInitialized && attempts < 50) {
//       await new Promise((resolve) => setTimeout(resolve, 100))
//       attempts++
//     }
//     if (!this.isInitialized) {
//       throw new Error("Graph initialization timeout")
//     }
//   }

//   // Dijkstra's Algorithm - Exact port from C++
//   dijkstraShortestPath(startName: string, endName: string): RouteResult {
//     const startId = this.nodeMap.get(startName)
//     const endId = this.nodeMap.get(endName)

//     console.log(`🔍 Dijkstra: Finding path from "${startName}" to "${endName}"`)

//     if (startId === undefined || endId === undefined) {
//       console.warn("❌ Invalid location names")
//       return { distance: 0, duration: 0, path: [] }
//     }

//     const distances = new Array(this.nodeCount).fill(Number.POSITIVE_INFINITY)
//     const previous = new Array(this.nodeCount).fill(-1)
//     const visited = new Array(this.nodeCount).fill(false)

//     distances[startId] = 0

//     for (let i = 0; i < this.nodeCount; i++) {
//       let minDist = Number.POSITIVE_INFINITY
//       let current = -1

//       // Find unvisited node with minimum distance
//       for (let j = 0; j < this.nodeCount; j++) {
//         if (!visited[j] && distances[j] < minDist) {
//           minDist = distances[j]
//           current = j
//         }
//       }

//       if (current === -1 || current === endId) break

//       visited[current] = true

//       // Update distances to neighbors
//       for (const edge of this.adjList[current]) {
//         const neighbor = edge.dest
//         const newDist = distances[current] + edge.weight

//         if (newDist < distances[neighbor]) {
//           distances[neighbor] = newDist
//           previous[neighbor] = current
//         }
//       }
//     }

//     // Reconstruct path
//     const path: string[] = []
//     let current = endId

//     while (current !== -1) {
//       path.unshift(this.nodes[current].name)
//       current = previous[current]
//     }

//     const totalDistance = distances[endId] === Number.POSITIVE_INFINITY ? 0 : distances[endId]
//     const duration = Math.round(totalDistance * 2.5) // 2.5 minutes per km in city traffic

//     console.log(`✅ Dijkstra Path: ${path.join(" → ")}, Distance: ${totalDistance}km, Duration: ${duration}min`)

//     return {
//       distance: totalDistance,
//       duration,
//       path,
//       coordinates: this.generateRouteCoordinates(path),
//       waypoints: this.generateWaypoints(path),
//       instructions: this.generateInstructions(path),
//     }
//   }

//   // Enhanced Bellman-Ford Algorithm for multiple alternative routes
//   bellmanFordAlternativePath(startName: string, endName: string): RouteResult {
//     const startId = this.nodeMap.get(startName)
//     const endId = this.nodeMap.get(endName)

//     console.log(`🔍 Bellman-Ford: Finding alternative paths from "${startName}" to "${endName}"`)

//     if (startId === undefined || endId === undefined) {
//       return { distance: 0, duration: 0, path: [] }
//     }

//     // Find multiple alternative paths using different approaches
//     const alternativePaths = this.findMultipleAlternativePaths(startId, endId, startName, endName)

//     if (alternativePaths.length === 0) {
//       // Fallback to basic Bellman-Ford
//       return this.basicBellmanFord(startId, endId, startName, endName)
//     }

//     // Return the best alternative path as main, with others as alternatives
//     const mainPath = alternativePaths[0]
//     const otherPaths = alternativePaths.slice(1)

//     console.log(`✅ Bellman-Ford found ${alternativePaths.length} alternative paths`)
//     alternativePaths.forEach((alt, i) => {
//       console.log(`   Path ${i + 1}: ${alt.path.join(" → ")} (${alt.distance}km)`)
//     })

//     return {
//       distance: mainPath.distance,
//       duration: mainPath.duration,
//       path: mainPath.path,
//       coordinates: this.generateRouteCoordinates(mainPath.path),
//       waypoints: this.generateWaypoints(mainPath.path),
//       instructions: this.generateInstructions(mainPath.path),
//       alternativePaths: otherPaths,
//     }
//   }

//   private findMultipleAlternativePaths(startId: number, endId: number, startName: string, endName: string) {
//     const paths: { path: string[]; distance: number; duration: number }[] = []

//     // Method 1: Find path through major hubs
//     const majorHubs = ["Clock Tower", "Paltan Bazaar", "ISBT Dehradun", "Dehradun Railway Station", "Pacific Mall"]

//     for (const hubName of majorHubs) {
//       const hubId = this.nodeMap.get(hubName)
//       if (hubId !== undefined && hubId !== startId && hubId !== endId) {
//         const pathViaHub = this.findPathViaIntermediate(startId, endId, hubId)
//         if (pathViaHub && pathViaHub.distance > 0) {
//           paths.push(pathViaHub)
//         }
//       }
//     }

//     // Method 2: Find path avoiding direct connections
//     const pathAvoidingDirect = this.findPathAvoidingDirectRoute(startId, endId)
//     if (pathAvoidingDirect && pathAvoidingDirect.distance > 0) {
//       paths.push(pathAvoidingDirect)
//     }

//     // Method 3: Find path through different neighborhoods
//     const neighborhoodPath = this.findPathThroughNeighborhoods(startId, endId, startName, endName)
//     if (neighborhoodPath && neighborhoodPath.distance > 0) {
//       paths.push(neighborhoodPath)
//     }

//     // Sort by distance and remove duplicates
//     const uniquePaths = this.removeDuplicatePaths(paths)
//     return uniquePaths.sort((a, b) => a.distance - b.distance).slice(0, 3) // Return top 3 alternatives
//   }

//   private findPathViaIntermediate(startId: number, endId: number, intermediateId: number) {
//     // Find path: start -> intermediate -> end
//     const pathToIntermediate = this.dijkstraInternal(startId, intermediateId)
//     const pathFromIntermediate = this.dijkstraInternal(intermediateId, endId)

//     if (
//       pathToIntermediate.distance === Number.POSITIVE_INFINITY ||
//       pathFromIntermediate.distance === Number.POSITIVE_INFINITY
//     ) {
//       return null
//     }

//     const combinedPath = [
//       ...pathToIntermediate.path,
//       ...pathFromIntermediate.path.slice(1), // Remove duplicate intermediate node
//     ]

//     const totalDistance = pathToIntermediate.distance + pathFromIntermediate.distance
//     const duration = Math.round(totalDistance * 2.8) // Slightly longer for alternative route

//     return {
//       path: combinedPath,
//       distance: totalDistance,
//       duration,
//     }
//   }

//   private findPathAvoidingDirectRoute(startId: number, endId: number) {
//     // Temporarily remove direct edges between start and end
//     const originalEdges = [...this.adjList[startId]]

//     // Remove direct connections to end
//     this.adjList[startId] = this.adjList[startId].filter((edge) => edge.dest !== endId)

//     const result = this.dijkstraInternal(startId, endId)

//     // Restore original edges
//     this.adjList[startId] = originalEdges

//     if (result.distance === Number.POSITIVE_INFINITY) {
//       return null
//     }

//     return {
//       path: result.path,
//       distance: result.distance,
//       duration: Math.round(result.distance * 2.8),
//     }
//   }

//   private findPathThroughNeighborhoods(startId: number, endId: number, startName: string, endName: string) {
//     // Find paths through different area types (markets, hospitals, universities, etc.)
//     const areaTypes = {
//       markets: ["Paltan Bazaar", "Rajpur Road Market", "Prince Chowk Market"],
//       hospitals: ["Max Hospital", "Doon Hospital", "Shri Mahant Indiresh Hospital"],
//       universities: ["Doon University", "UPES University", "Graphic Era University"],
//       transport: ["ISBT Dehradun", "Dehradun Railway Station", "Jolly Grant Airport"],
//     }

//     for (const [areaType, locations] of Object.entries(areaTypes)) {
//       for (const locationName of locations) {
//         const locationId = this.nodeMap.get(locationName)
//         if (locationId !== undefined && locationId !== startId && locationId !== endId) {
//           const pathViaArea = this.findPathViaIntermediate(startId, endId, locationId)
//           if (pathViaArea && pathViaArea.distance > 0) {
//             return pathViaArea
//           }
//         }
//       }
//     }

//     return null
//   }

//   private dijkstraInternal(startId: number, endId: number) {
//     const distances = new Array(this.nodeCount).fill(Number.POSITIVE_INFINITY)
//     const previous = new Array(this.nodeCount).fill(-1)
//     const visited = new Array(this.nodeCount).fill(false)

//     distances[startId] = 0

//     for (let i = 0; i < this.nodeCount; i++) {
//       let minDist = Number.POSITIVE_INFINITY
//       let current = -1

//       for (let j = 0; j < this.nodeCount; j++) {
//         if (!visited[j] && distances[j] < minDist) {
//           minDist = distances[j]
//           current = j
//         }
//       }

//       if (current === -1 || current === endId) break

//       visited[current] = true

//       for (const edge of this.adjList[current]) {
//         const neighbor = edge.dest
//         const newDist = distances[current] + edge.weight

//         if (newDist < distances[neighbor]) {
//           distances[neighbor] = newDist
//           previous[neighbor] = current
//         }
//       }
//     }

//     // Reconstruct path
//     const path: string[] = []
//     let current = endId

//     while (current !== -1) {
//       path.unshift(this.nodes[current].name)
//       current = previous[current]
//     }

//     return {
//       path,
//       distance: distances[endId],
//     }
//   }

//   private basicBellmanFord(startId: number, endId: number, startName: string, endName: string): RouteResult {
//     const distances = new Array(this.nodeCount).fill(Number.POSITIVE_INFINITY)
//     const previous = new Array(this.nodeCount).fill(-1)

//     distances[startId] = 0

//     // Relax edges V-1 times
//     for (let i = 0; i < this.nodeCount - 1; i++) {
//       for (let u = 0; u < this.nodeCount; u++) {
//         if (distances[u] === Number.POSITIVE_INFINITY) continue

//         for (const edge of this.adjList[u]) {
//           const v = edge.dest
//           const weight = edge.weight

//           if (distances[u] + weight < distances[v]) {
//             distances[v] = distances[u] + weight
//             previous[v] = u
//           }
//         }
//       }
//     }

//     // Reconstruct path
//     const path: string[] = []
//     let current = endId

//     while (current !== -1) {
//       path.unshift(this.nodes[current].name)
//       current = previous[current]
//     }

//     const totalDistance = distances[endId] === Number.POSITIVE_INFINITY ? 0 : distances[endId]
//     const adjustedDistance = totalDistance * 1.15 // Add 15% for alternative route
//     const duration = Math.round(adjustedDistance * 3)

//     return {
//       distance: adjustedDistance,
//       duration,
//       path,
//       coordinates: this.generateRouteCoordinates(path),
//       waypoints: this.generateWaypoints(path),
//       instructions: this.generateInstructions(path),
//     }
//   }

//   private removeDuplicatePaths(paths: { path: string[]; distance: number; duration: number }[]) {
//     const unique: { path: string[]; distance: number; duration: number }[] = []
//     const seen = new Set<string>()

//     for (const pathObj of paths) {
//       const pathKey = pathObj.path.join("->")
//       if (!seen.has(pathKey)) {
//         seen.add(pathKey)
//         unique.push(pathObj)
//       }
//     }

//     return unique
//   }

//   // TSP Nearest Neighbor Algorithm
//   tspNearestNeighbor(startName: string, deliveryPoints: string[]): RouteResult {
//     const startId = this.nodeMap.get(startName)

//     console.log(`🔍 TSP: Optimizing delivery route from "${startName}" to [${deliveryPoints.join(", ")}]`)

//     if (startId === undefined) {
//       return { distance: 0, duration: 0, path: [] }
//     }

//     const validPoints = deliveryPoints.filter((point) => this.nodeMap.has(point) && point !== startName)

//     if (validPoints.length === 0) {
//       return { distance: 0, duration: 0, path: [startName] }
//     }

//     const unvisited = new Set(validPoints)
//     const route: string[] = [startName]
//     let current = startName
//     let totalDistance = 0

//     while (unvisited.size > 0) {
//       let nearest = ""
//       let minDistance = Number.POSITIVE_INFINITY

//       // Find nearest unvisited point
//       for (const point of unvisited) {
//         const result = this.dijkstraShortestPath(current, point)
//         if (result.distance < minDistance && result.distance > 0) {
//           minDistance = result.distance
//           nearest = point
//         }
//       }

//       if (nearest) {
//         const pathToNearest = this.dijkstraShortestPath(current, nearest)
//         // Add intermediate points from the path (excluding start)
//         route.push(...pathToNearest.path.slice(1))
//         totalDistance += pathToNearest.distance
//         unvisited.delete(nearest)
//         current = nearest
//       } else {
//         break
//       }
//     }

//     // Return to start
//     if (current !== startName) {
//       const returnPath = this.dijkstraShortestPath(current, startName)
//       if (returnPath.path.length > 1) {
//         route.push(...returnPath.path.slice(1))
//         totalDistance += returnPath.distance
//       }
//     }

//     const duration = Math.round(totalDistance * 2.5)

//     console.log(`✅ TSP optimized route: ${route.join(" → ")}, Total: ${totalDistance}km, ${duration}min`)

//     return {
//       distance: totalDistance,
//       duration,
//       path: route,
//       coordinates: this.generateRouteCoordinates(route),
//       waypoints: this.generateWaypoints(route),
//       instructions: this.generateInstructions(route),
//     }
//   }

//   public generateRouteCoordinates(path: string[]): number[][] {
//     // Generate realistic coordinates for the route
//     const coordinates: number[][] = []

//     // Actual coordinates for major Dehradun locations
//     const locationCoords: { [key: string]: { lat: number; lng: number } } = {
//       "ISBT Dehradun": { lat: 30.3255, lng: 78.0436 },
//       "Dehradun Railway Station": { lat: 30.3242, lng: 78.0348 },
//       "Jolly Grant Airport": { lat: 30.1897, lng: 78.1804 },
//       "Pacific Mall": { lat: 30.3609, lng: 78.0664 },
//       "Crossroads Mall": { lat: 30.3178, lng: 78.0356 },
//       "Paltan Bazaar": { lat: 30.3158, lng: 78.0322 },
//       "Clock Tower": { lat: 30.3165, lng: 78.0322 },
//       "Forest Research Institute": { lat: 30.3355, lng: 77.9993 },
//       "Robber's Cave": { lat: 30.3733, lng: 78.0122 },
//       "Sahastradhara Road": { lat: 30.3596, lng: 78.0856 },
//       "Rajpur Road Market": { lat: 30.3609, lng: 78.0664 },
//       "Prince Chowk Market": { lat: 30.3158, lng: 78.0322 },
//       "Max Hospital": { lat: 30.3609, lng: 78.0664 },
//       "Doon Hospital": { lat: 30.3242, lng: 78.0348 },
//       "Tapkeshwar Temple": { lat: 30.3847, lng: 78.0323 },
//       "Malsi Deer Park": { lat: 30.4089, lng: 78.0456 },
//       "Race Course": { lat: 30.3203, lng: 78.0348 },
//       "Vasant Vihar": { lat: 30.3203, lng: 78.0348 },
//       "Patel Nagar": { lat: 30.3189, lng: 78.0267 },
//       "UPES University": { lat: 30.4012, lng: 78.0234 },
//     }

//     // Base coordinates for Dehradun center
//     const baseLatLng = { lat: 30.3165, lng: 78.0322 }

//     for (let i = 0; i < path.length; i++) {
//       const location = path[i]
//       const coords = locationCoords[location] || {
//         lat: baseLatLng.lat + (Math.random() - 0.5) * 0.05,
//         lng: baseLatLng.lng + (Math.random() - 0.5) * 0.05,
//       }

//       coordinates.push([coords.lat, coords.lng])

//       // Add intermediate points for smoother routes
//       if (i < path.length - 1) {
//         const nextLocation = path[i + 1]
//         const nextCoords = locationCoords[nextLocation] || {
//           lat: baseLatLng.lat + (Math.random() - 0.5) * 0.05,
//           lng: baseLatLng.lng + (Math.random() - 0.5) * 0.05,
//         }

//         // Add 2-3 intermediate points
//         for (let j = 1; j <= 2; j++) {
//           const ratio = j / 3
//           const intermediateLat = coords.lat + (nextCoords.lat - coords.lat) * ratio
//           const intermediateLng = coords.lng + (nextCoords.lng - coords.lng) * ratio
//           coordinates.push([intermediateLat, intermediateLng])
//         }
//       }
//     }

//     return coordinates
//   }

//   private generateWaypoints(path: string[]): any[] {
//     const waypoints = []

//     for (let i = 0; i < path.length; i++) {
//       const location = path[i]
//       const isStart = i === 0
//       const isEnd = i === path.length - 1

//       waypoints.push({
//         lat: 30.3165 + (Math.random() - 0.5) * 0.05,
//         lng: 78.0322 + (Math.random() - 0.5) * 0.05,
//         instruction: isStart ? "Start your journey" : isEnd ? "Arrive at destination" : `Continue to ${location}`,
//         type: isStart ? "start" : isEnd ? "end" : "waypoint",
//       })
//     }

//     return waypoints
//   }

//   private generateInstructions(path: string[]): any[] {
//     const instructions = []

//     for (let i = 0; i < path.length - 1; i++) {
//       const from = path[i]
//       const to = path[i + 1]

//       instructions.push({
//         instruction: `Head from ${from} to ${to}`,
//         distance: Math.random() * 2000 + 500, // Random distance in meters
//         duration: Math.random() * 300 + 120, // Random duration in seconds
//       })
//     }

//     return instructions
//   }

//   getLocationList(): string[] {
//     return [...this.locationList]
//   }

//   isReady(): boolean {
//     return this.isInitialized
//   }
// }

// export default DehradunGraph
// Dehradun Graph Implementation - Enhanced with Path Validation
// Based on real-world distance data from Dehradun

interface Edge {
  dest: number
  weight: number
}

interface Node {
  id: number
  name: string
}

interface RouteResult {
  distance: number
  duration: number
  path: string[]
  coordinates?: number[][]
  waypoints?: any[]
  instructions?: any[]
  alternativePaths?: {
    path: string[]
    distance: number
    duration: number
  }[]
  isValid: boolean
  errorMessage?: string
}

class DehradunGraph {
  private nodes: Node[] = []
  private adjList: Edge[][] = []
  private nodeMap: Map<string, number> = new Map()
  private locationList: string[] = []
  private nodeCount = 0
  private isInitialized = false

  constructor() {
    this.initializeGraph()
  }

  private async initializeGraph() {
    try {
      // Load the distance data from the public folder
      const response = await fetch("/dehradun-distances.txt")
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      const distanceData = await response.text()
      this.parseDistanceData(distanceData)
      this.isInitialized = true
      console.log(`✅ Graph initialized with ${this.nodeCount} locations and real distance data`)

      // Validate graph connectivity
      this.validateGraphConnectivity()
    } catch (error) {
      console.error("❌ Failed to load distance data:", error)
      this.initializeDefaultLocations()
      this.isInitialized = true
    }
  }

  private validateGraphConnectivity() {
    console.log("🔍 Validating graph connectivity...")

    let totalConnections = 0
    let isolatedNodes = 0

    for (let i = 0; i < this.nodeCount; i++) {
      const connections = this.adjList[i].length
      totalConnections += connections

      if (connections === 0) {
        isolatedNodes++
        console.warn(`⚠️ Isolated node found: ${this.nodes[i].name}`)
      }
    }

    console.log(`📊 Graph Statistics:`)
    console.log(`   • Total Nodes: ${this.nodeCount}`)
    console.log(`   • Total Connections: ${totalConnections / 2}`) // Divided by 2 because edges are bidirectional
    console.log(`   • Isolated Nodes: ${isolatedNodes}`)
    console.log(`   • Average Connections per Node: ${(totalConnections / this.nodeCount).toFixed(2)}`)

    // Test connectivity between major hubs
    this.testMajorHubConnectivity()
  }

  private testMajorHubConnectivity() {
    const majorHubs = [
      "ISBT Dehradun",
      "Dehradun Railway Station",
      "Clock Tower",
      "Pacific Mall",
      "Jolly Grant Airport",
    ]
    const availableHubs = majorHubs.filter((hub) => this.nodeMap.has(hub))

    console.log("🏢 Testing connectivity between major hubs...")

    for (let i = 0; i < availableHubs.length; i++) {
      for (let j = i + 1; j < availableHubs.length; j++) {
        const from = availableHubs[i]
        const to = availableHubs[j]
        const result = this.dijkstraShortestPath(from, to)

        if (!result.isValid || result.distance === 0) {
          console.warn(`⚠️ No path found between major hubs: ${from} ↔ ${to}`)
        } else {
          console.log(`✅ ${from} ↔ ${to}: ${result.distance}km`)
        }
      }
    }
  }

  private parseDistanceData(distanceData: string) {
    const lines = distanceData.trim().split("\n")
    const locationCount = Number.parseInt(lines[0])

    console.log(`📍 Loading ${locationCount} Dehradun locations...`)

    // Parse location names
    for (let i = 1; i <= locationCount; i++) {
      const locationName = lines[i].trim()
      this.addNode(locationName)
    }

    // Parse distance relationships
    let edgeCount = 0
    for (let i = locationCount + 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.includes("|")) {
        const parts = line.split("|")
        if (parts.length === 3) {
          const source = parts[0].trim()
          const destination = parts[1].trim()
          const distance = Number.parseInt(parts[2].trim())
          if (!isNaN(distance) && distance > 0) {
            this.addEdge(source, destination, distance)
            edgeCount++
          }
        }
      }
    }
    console.log(`🛣️ Loaded ${edgeCount} real distance relationships`)
  }

  private initializeDefaultLocations() {
    console.log("⚠️ Using fallback locations...")
    // All 10 locations
    const defaultLocations = [
      "ISBT Dehradun",
      "Dehradun Railway Station",
      "Jolly Grant Airport",
      "Pacific Mall",
      "Crossroads Mall",
      "Paltan Bazaar",
      "Clock Tower",
      "Forest Research Institute",
      "Robber's Cave",
      "Sahastradhara Road",
    ];

    defaultLocations.forEach((name) => this.addNode(name));

    // All connections between these 10 locations
    // ISBT Dehradun connections
    this.addEdge("ISBT Dehradun", "Dehradun Railway Station", 5);
    this.addEdge("ISBT Dehradun", "Jolly Grant Airport", 29);
    this.addEdge("ISBT Dehradun", "Pacific Mall", 12);
    this.addEdge("ISBT Dehradun", "Crossroads Mall", 8);
    this.addEdge("ISBT Dehradun", "Paltan Bazaar", 6);
    this.addEdge("ISBT Dehradun", "Clock Tower", 7);
    this.addEdge("ISBT Dehradun", "Forest Research Institute", 8);
    this.addEdge("ISBT Dehradun", "Robber's Cave", 13);
    this.addEdge("ISBT Dehradun", "Sahastradhara Road", 14);

    // Dehradun Railway Station connections
    this.addEdge("Dehradun Railway Station", "Jolly Grant Airport", 26);
    this.addEdge("Dehradun Railway Station", "Pacific Mall", 7);
    this.addEdge("Dehradun Railway Station", "Crossroads Mall", 3);
    this.addEdge("Dehradun Railway Station", "Paltan Bazaar", 1);
    this.addEdge("Dehradun Railway Station", "Clock Tower", 2);
    this.addEdge("Dehradun Railway Station", "Forest Research Institute", 7);
    this.addEdge("Dehradun Railway Station", "Robber's Cave", 10);
    this.addEdge("Dehradun Railway Station", "Sahastradhara Road", 9);

    // Jolly Grant Airport connections
    this.addEdge("Jolly Grant Airport", "Pacific Mall", 31);
    this.addEdge("Jolly Grant Airport", "Crossroads Mall", 27);
    this.addEdge("Jolly Grant Airport", "Paltan Bazaar", 27);
    this.addEdge("Jolly Grant Airport", "Clock Tower", 26);
    this.addEdge("Jolly Grant Airport", "Forest Research Institute", 31);
    this.addEdge("Jolly Grant Airport", "Robber's Cave", 34);
    this.addEdge("Jolly Grant Airport", "Sahastradhara Road", 31);

    // Pacific Mall connections
    this.addEdge("Pacific Mall", "Crossroads Mall", 6);
    this.addEdge("Pacific Mall", "Paltan Bazaar", 8);
    this.addEdge("Pacific Mall", "Clock Tower", 7);
    this.addEdge("Pacific Mall", "Forest Research Institute", 12);
    this.addEdge("Pacific Mall", "Robber's Cave", 5);
    this.addEdge("Pacific Mall", "Sahastradhara Road", 3);

    // Crossroads Mall connections
    this.addEdge("Crossroads Mall", "Paltan Bazaar", 3);
    this.addEdge("Crossroads Mall", "Clock Tower", 2);
    this.addEdge("Crossroads Mall", "Forest Research Institute", 7);
    this.addEdge("Crossroads Mall", "Robber's Cave", 6);
    this.addEdge("Crossroads Mall", "Sahastradhara Road", 6);

    // Paltan Bazaar connections
    this.addEdge("Paltan Bazaar", "Clock Tower", 1);
    this.addEdge("Paltan Bazaar", "Forest Research Institute", 6);
    this.addEdge("Paltan Bazaar", "Robber's Cave", 9);
    this.addEdge("Paltan Bazaar", "Sahastradhara Road", 7);

    // Clock Tower connections
    this.addEdge("Clock Tower", "Forest Research Institute", 6);
    this.addEdge("Clock Tower", "Robber's Cave", 8);
    this.addEdge("Clock Tower", "Sahastradhara Road", 6);

    // Forest Research Institute connections
    this.addEdge("Forest Research Institute", "Robber's Cave", 9);
    this.addEdge("Forest Research Institute", "Sahastradhara Road", 11);

    // Robber's Cave connections
    this.addEdge("Robber's Cave", "Sahastradhara Road", 7);
}

  private addNode(name: string) {
    if (!this.nodeMap.has(name)) {
      this.nodes.push({ id: this.nodeCount, name })
      this.adjList.push([])
      this.nodeMap.set(name, this.nodeCount)
      this.locationList.push(name)
      this.nodeCount++
    }
  }

  private addEdge(src: string, dest: string, weight: number) {
    this.addNode(src)
    this.addNode(dest)

    const srcId = this.nodeMap.get(src)!
    const destId = this.nodeMap.get(dest)!

    // Add bidirectional edges
    this.adjList[srcId].push({ dest: destId, weight })
    this.adjList[destId].push({ dest: srcId, weight })
  }

  // Wait for initialization
  async waitForInitialization(): Promise<void> {
    let attempts = 0
    while (!this.isInitialized && attempts < 50) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      attempts++
    }
    if (!this.isInitialized) {
      throw new Error("Graph initialization timeout")
    }
  }

  // Enhanced Dijkstra's Algorithm with validation
  // dijkstraShortestPath(startName: string, endName: string): RouteResult {
  //   const startId = this.nodeMap.get(startName)
  //   const endId = this.nodeMap.get(endName)

  //   console.log(`🔍 Dijkstra: Finding path from "${startName}" to "${endName}"`)

  //   // Validation checks
  //   if (startId === undefined || endId === undefined) {
  //     console.warn(`❌ Start location "${startName}" not found in graph`)
  //     return {
  //       distance: 0,
  //       duration: 0,
  //       path: [],
  //       isValid: false,
  //       errorMessage: `Start location "${startName}" not found`,
  //     }
  //   }

  //   if (endId === undefined) {
  //     console.warn(`❌ End location "${endName}" not found in graph`)
  //     return {
  //       distance: 0,
  //       duration: 0,
  //       path: [],
  //       isValid: false,
  //       errorMessage: `End location "${endName}" not found`,
  //     }
  //   }

  //   if (startId === endId) {
  //     console.log(`ℹ️ Start and end locations are the same`)
  //     return {
  //       distance: 0,
  //       duration: 0,
  //       path: [startName],
  //       isValid: true,
  //       coordinates: this.generateRouteCoordinates([startName]),
  //       waypoints: this.generateWaypoints([startName]),
  //       instructions: [],
  //     }
  //   }

  //   const distances = new Array(this.nodeCount).fill(Number.POSITIVE_INFINITY)
  //   const previous = new Array(this.nodeCount).fill(-1)
  //   const visited = new Array(this.nodeCount).fill(false)

  //   distances[startId] = 0

  //   for (let i = 0; i < this.nodeCount; i++) {
  //     let minDist = Number.POSITIVE_INFINITY
  //     let current = -1

  //     // Find unvisited node with minimum distance
  //     for (let j = 0; j < this.nodeCount; j++) {
  //       if (!visited[j] && distances[j] < minDist) {
  //         minDist = distances[j]
  //         current = j
  //       }
  //     }

  //     if (current === -1) break // No more reachable nodes

  //     if (current === endId) break // Reached destination

  //     visited[current] = true

  //     // Update distances to neighbors
  //     for (const edge of this.adjList[current]) {
  //       const neighbor = edge.dest
  //       const newDist = distances[current] + edge.weight

  //       if (newDist < distances[neighbor]) {
  //         distances[neighbor] = newDist
  //         previous[neighbor] = current
  //       }
  //     }
  //   }

  //   // Check if path exists
  //   if (distances[endId] === Number.POSITIVE_INFINITY) {
  //     console.warn(`❌ No path found from "${startName}" to "${endName}"`)
  //     return {
  //       distance: 0,
  //       duration: 0,
  //       path: [],
  //       isValid: false,
  //       errorMessage: `No path exists between "${startName}" and "${endName}"`,
  //     }
  //   }

  //   // Reconstruct path
  //   const path: string[] = []
  //   let current = endId

  //   while (current !== -1) {
  //     path.unshift(this.nodes[current].name)
  //     current = previous[current]
  //   }

  //   const totalDistance = distances[endId]
  //   const duration = Math.round(totalDistance * 2.5) // 2.5 minutes per km in city traffic

  //   console.log(`✅ Dijkstra Path: ${path.join(" → ")}, Distance: ${totalDistance}km, Duration: ${duration}min`)

  //   return {
  //     distance: totalDistance,
  //     duration,
  //     path,
  //     isValid: true,
  //     coordinates: this.generateRouteCoordinates(path),
  //     waypoints: this.generateWaypoints(path),
  //     instructions: this.generateInstructions(path),
  //   }
  // }

  dijkstraShortestPath(startName: string, endName: string): RouteResult {
    const startId = this.nodeMap.get(startName)
    const endId = this.nodeMap.get(endName)

    console.log(`🔍 Dijkstra: Finding path from "${startName}" to "${endName}"`)

    if (startId === undefined || endId === undefined) {
      console.warn("❌ Invalid location names")
      return {
        distance: 0,
        duration: 0,
        path: [],
        isValid: false,
        errorMessage: `Start location "${startName}" not found`,
      }
    }

    const distances = new Array(this.nodeCount).fill(Number.POSITIVE_INFINITY)
    const previous = new Array(this.nodeCount).fill(-1)
    const visited = new Array(this.nodeCount).fill(false)

    distances[startId] = 0

    for (let i = 0; i < this.nodeCount; i++) {
      let minDist = Number.POSITIVE_INFINITY
      let current = -1

      // Find unvisited node with minimum distance
      for (let j = 0; j < this.nodeCount; j++) {
        if (!visited[j] && distances[j] < minDist) {
          minDist = distances[j]
          current = j
        }
      }

      if (current === -1 || current === endId) break

      visited[current] = true

      // Update distances to neighbors
      for (const edge of this.adjList[current]) {
        const neighbor = edge.dest
        const newDist = distances[current] + edge.weight

        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist
          previous[neighbor] = current
        }
      }
    }

    // Reconstruct path
    const path: string[] = []
    let current = endId

    while (current !== -1) {
      path.unshift(this.nodes[current].name)
      current = previous[current]
    }

    const totalDistance = distances[endId] === Number.POSITIVE_INFINITY ? 0 : distances[endId]
    const duration = Math.round(totalDistance * 2.5) // 2.5 minutes per km in city traffic

    console.log(`✅ Dijkstra Path: ${path.join(" → ")}, Distance: ${totalDistance}km, Duration: ${duration}min`)

    return {
      distance: totalDistance,
      duration,
      path,
      isValid: true,
      coordinates: this.generateRouteCoordinates(path),
      waypoints: this.generateWaypoints(path),
      instructions: this.generateInstructions(path),
    }
  }
  

  // Enhanced Bellman-Ford Algorithm with validation
  bellmanFordAlternativePath(startName: string, endName: string): RouteResult {
    const startId = this.nodeMap.get(startName)
    const endId = this.nodeMap.get(endName)

    console.log(`🔍 Bellman-Ford: Finding alternative paths from "${startName}" to "${endName}"`)

    // Validation checks
    if (startId === undefined || endId === undefined) {
      return {
        distance: 0,
        duration: 0,
        path: [],
        isValid: false,
        errorMessage: "Invalid start or end location",
      }
    }

    // First check if basic path exists using Dijkstra
    const basicPath = this.dijkstraShortestPath(startName, endName)
    if (!basicPath.isValid) {
      return basicPath // Return the error from Dijkstra
    }

    // Find multiple alternative paths using different approaches
    const alternativePaths = this.findMultipleAlternativePaths(startId, endId, startName, endName)

    if (alternativePaths.length === 0) {
      // Fallback to basic Bellman-Ford
      const fallbackResult = this.basicBellmanFord(startId, endId, startName, endName)
      if (!fallbackResult.isValid) {
        // If even basic Bellman-Ford fails, return the Dijkstra result as the only option
        console.log(`⚠️ No alternative paths found, returning main path only`)
        return {
          ...basicPath,
          alternativePaths: [],
        }
      }
      return fallbackResult
    }

    // Return the best alternative path as main, with others as alternatives
    const mainPath = alternativePaths[0]
    const otherPaths = alternativePaths.slice(1)

    console.log(`✅ Bellman-Ford found ${alternativePaths.length} alternative paths`)
    alternativePaths.forEach((alt, i) => {
      console.log(`   Path ${i + 1}: ${alt.path.join(" → ")} (${alt.distance}km)`)
    })

    return {
      distance: mainPath.distance,
      duration: mainPath.duration,
      path: mainPath.path,
      isValid: true,
      coordinates: this.generateRouteCoordinates(mainPath.path),
      waypoints: this.generateWaypoints(mainPath.path),
      instructions: this.generateInstructions(mainPath.path),
      alternativePaths: otherPaths,
    }
  }

  // Enhanced TSP Algorithm with validation
  tspNearestNeighbor(startName: string, deliveryPoints: string[]): RouteResult {
    const startId = this.nodeMap.get(startName)

    console.log(`🔍 TSP: Optimizing delivery route from "${startName}" to [${deliveryPoints.join(", ")}]`)

    // Validation checks
    if (startId === undefined) {
      return {
        distance: 0,
        duration: 0,
        path: [],
        isValid: false,
        errorMessage: `Start location "${startName}" not found`,
      }
    }

    const validPoints = deliveryPoints.filter((point) => {
      const isValid = this.nodeMap.has(point) && point !== startName
      if (!isValid && !this.nodeMap.has(point)) {
        console.warn(`⚠️ Delivery point "${point}" not found in graph`)
      }
      return isValid
    })

    if (validPoints.length === 0) {
      return {
        distance: 0,
        duration: 0,
        path: [startName],
        isValid: true,
        coordinates: this.generateRouteCoordinates([startName]),
        waypoints: this.generateWaypoints([startName]),
        instructions: [],
      }
    }

    // Check connectivity to all delivery points
    const unreachablePoints: string[] = []
    for (const point of validPoints) {
      const pathCheck = this.dijkstraShortestPath(startName, point)
      if (!pathCheck.isValid) {
        unreachablePoints.push(point)
      }
    }

    if (unreachablePoints.length > 0) {
      console.warn(`❌ Unreachable delivery points: ${unreachablePoints.join(", ")}`)
      return {
        distance: 0,
        duration: 0,
        path: [],
        isValid: false,
        errorMessage: `Cannot reach delivery points: ${unreachablePoints.join(", ")}`,
      }
    }

    const unvisited = new Set(validPoints)
    const route: string[] = [startName]
    let current = startName
    let totalDistance = 0
    let failedConnections = 0

    while (unvisited.size > 0) {
      let nearest = ""
      let minDistance = Number.POSITIVE_INFINITY

      // Find nearest unvisited point
      for (const point of unvisited) {
        const result = this.dijkstraShortestPath(current, point)
        if (result.isValid && result.distance < minDistance && result.distance > 0) {
          minDistance = result.distance
          nearest = point
        }
      }

      if (nearest) {
        const pathToNearest = this.dijkstraShortestPath(current, nearest)
        if (pathToNearest.isValid) {
          // Only add the destination, avoiding duplicates
          if (!route.includes(nearest)) {
            route.push(nearest)
          }
          totalDistance += pathToNearest.distance
          unvisited.delete(nearest)
          current = nearest
        } else {
          failedConnections++
          unvisited.delete(nearest) // Remove unreachable point
        }
      } else {
        console.warn(`⚠️ No reachable points remaining from ${current}`)
        break
      }
    }

    // Return to start
    if (current !== startName) {
      const returnPath = this.dijkstraShortestPath(current, startName)
      if (returnPath.isValid && returnPath.path.length > 1) {
        route.push(startName)
        totalDistance += returnPath.distance
      } else {
        console.warn(`⚠️ Cannot return to start from ${current}`)
        return {
          distance: 0,
          duration: 0,
          path: [],
          isValid: false,
          errorMessage: `Cannot return to start location from ${current}`,
        }
      }
    }

    const duration = Math.round(totalDistance * 2.5)

    if (failedConnections > 0) {
      console.warn(`⚠️ TSP completed with ${failedConnections} failed connections`)
    }

    console.log(`✅ TSP optimized route: ${route.join(" → ")}, Total: ${totalDistance}km, ${duration}min`)

    return {
      distance: totalDistance,
      duration,
      path: route,
      isValid: true,
      coordinates: this.generateRouteCoordinates(route),
      waypoints: this.generateWaypoints(route),
      instructions: this.generateInstructions(route),
    }
  }

  // Helper methods remain the same but with enhanced error handling
  private findMultipleAlternativePaths(startId: number, endId: number, startName: string, endName: string) {
    const paths: { path: string[]; distance: number; duration: number }[] = []

    // Method 1: Find path through major hubs
    const majorHubs = ["Clock Tower", "Paltan Bazaar", "ISBT Dehradun", "Dehradun Railway Station", "Pacific Mall"]

    for (const hubName of majorHubs) {
      const hubId = this.nodeMap.get(hubName)
      if (hubId !== undefined && hubId !== startId && hubId !== endId) {
        const pathViaHub = this.findPathViaIntermediate(startId, endId, hubId)
        if (pathViaHub && pathViaHub.distance > 0) {
          paths.push(pathViaHub)
        }
      }
    }

    // Method 2: Find path avoiding direct connections
    const pathAvoidingDirect = this.findPathAvoidingDirectRoute(startId, endId)
    if (pathAvoidingDirect && pathAvoidingDirect.distance > 0) {
      paths.push(pathAvoidingDirect)
    }

    // Method 3: Find path through different neighborhoods
    const neighborhoodPath = this.findPathThroughNeighborhoods(startId, endId, startName, endName)
    if (neighborhoodPath && neighborhoodPath.distance > 0) {
      paths.push(neighborhoodPath)
    }

    // Sort by distance and remove duplicates
    const uniquePaths = this.removeDuplicatePaths(paths)
    return uniquePaths.sort((a, b) => a.distance - b.distance).slice(0, 3) // Return top 3 alternatives
  }

  private findPathViaIntermediate(startId: number, endId: number, intermediateId: number) {
    // Find path: start -> intermediate -> end
    const pathToIntermediate = this.dijkstraInternal(startId, intermediateId)
    const pathFromIntermediate = this.dijkstraInternal(intermediateId, endId)

    if (
      pathToIntermediate.distance === Number.POSITIVE_INFINITY ||
      pathFromIntermediate.distance === Number.POSITIVE_INFINITY
    ) {
      return null
    }

    const combinedPath = [
      ...pathToIntermediate.path,
      ...pathFromIntermediate.path.slice(1), // Remove duplicate intermediate node
    ]

    const totalDistance = pathToIntermediate.distance + pathFromIntermediate.distance
    const duration = Math.round(totalDistance * 2.8) // Slightly longer for alternative route

    return {
      path: combinedPath,
      distance: totalDistance,
      duration,
    }
  }

  private findPathAvoidingDirectRoute(startId: number, endId: number) {
    // Temporarily remove direct edges between start and end
    const originalEdges = [...this.adjList[startId]]

    // Remove direct connections to end
    this.adjList[startId] = this.adjList[startId].filter((edge) => edge.dest !== endId)

    const result = this.dijkstraInternal(startId, endId)

    // Restore original edges
    this.adjList[startId] = originalEdges

    if (result.distance === Number.POSITIVE_INFINITY) {
      return null
    }

    return {
      path: result.path,
      distance: result.distance,
      duration: Math.round(result.distance * 2.8),
    }
  }

  private findPathThroughNeighborhoods(startId: number, endId: number, startName: string, endName: string) {
    // Find paths through different area types (markets, hospitals, universities, etc.)
    const areaTypes = {
      markets: ["Paltan Bazaar", "Rajpur Road Market", "Prince Chowk Market"],
      hospitals: ["Max Hospital", "Doon Hospital", "Shri Mahant Indiresh Hospital"],
      universities: ["Doon University", "UPES University", "Graphic Era University"],
      transport: ["ISBT Dehradun", "Dehradun Railway Station", "Jolly Grant Airport"],
    }

    for (const [areaType, locations] of Object.entries(areaTypes)) {
      for (const locationName of locations) {
        const locationId = this.nodeMap.get(locationName)
        if (locationId !== undefined && locationId !== startId && locationId !== endId) {
          const pathViaArea = this.findPathViaIntermediate(startId, endId, locationId)
          if (pathViaArea && pathViaArea.distance > 0) {
            return pathViaArea
          }
        }
      }
    }

    return null
  }

  private dijkstraInternal(startId: number, endId: number) {
    const distances = new Array(this.nodeCount).fill(Number.POSITIVE_INFINITY)
    const previous = new Array(this.nodeCount).fill(-1)
    const visited = new Array(this.nodeCount).fill(false)

    distances[startId] = 0

    for (let i = 0; i < this.nodeCount; i++) {
      let minDist = Number.POSITIVE_INFINITY
      let current = -1

      for (let j = 0; j < this.nodeCount; j++) {
        if (!visited[j] && distances[j] < minDist) {
          minDist = distances[j]
          current = j
        }
      }

      if (current === -1 || current === endId) break

      visited[current] = true

      for (const edge of this.adjList[current]) {
        const neighbor = edge.dest
        const newDist = distances[current] + edge.weight

        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist
          previous[neighbor] = current
        }
      }
    }

    // Reconstruct path
    const path: string[] = []
    let current = endId

    while (current !== -1) {
      path.unshift(this.nodes[current].name)
      current = previous[current]
    }

    return {
      path,
      distance: distances[endId],
    }
  }

  private basicBellmanFord(startId: number, endId: number, startName: string, endName: string): RouteResult {
    const distances = new Array(this.nodeCount).fill(Number.POSITIVE_INFINITY)
    const previous = new Array(this.nodeCount).fill(-1)

    distances[startId] = 0

    // Relax edges V-1 times
    for (let i = 0; i < this.nodeCount - 1; i++) {
      for (let u = 0; u < this.nodeCount; u++) {
        if (distances[u] === Number.POSITIVE_INFINITY) continue

        for (const edge of this.adjList[u]) {
          const v = edge.dest
          const weight = edge.weight

          if (distances[u] + weight < distances[v]) {
            distances[v] = distances[u] + weight
            previous[v] = u
          }
        }
      }
    }

    // Check if path exists
    if (distances[endId] === Number.POSITIVE_INFINITY) {
      return {
        distance: 0,
        duration: 0,
        path: [],
        isValid: false,
        errorMessage: `No alternative path found between "${startName}" and "${endName}"`,
      }
    }

    // Reconstruct path
    const path: string[] = []
    let current = endId

    while (current !== -1) {
      path.unshift(this.nodes[current].name)
      current = previous[current]
    }

    const totalDistance = distances[endId]
    const adjustedDistance = totalDistance * 1.15 // Add 15% for alternative route
    const duration = Math.round(adjustedDistance * 3)

    return {
      distance: adjustedDistance,
      duration,
      path,
      isValid: true,
      coordinates: this.generateRouteCoordinates(path),
      waypoints: this.generateWaypoints(path),
      instructions: this.generateInstructions(path),
    }
  }

  private removeDuplicatePaths(paths: { path: string[]; distance: number; duration: number }[]) {
    const unique: { path: string[]; distance: number; duration: number }[] = []
    const seen = new Set<string>()

    for (const pathObj of paths) {
      const pathKey = pathObj.path.join("->")
      if (!seen.has(pathKey)) {
        seen.add(pathKey)
        unique.push(pathObj)
      }
    }

    return unique
  }

  private generateRouteCoordinates(path: string[]): number[][] {
    // Generate realistic coordinates for the route
    const coordinates: number[][] = []

    // Actual coordinates for major Dehradun locations
    const locationCoords: { [key: string]: { lat: number; lng: number } } = {
      "ISBT Dehradun": { lat: 30.3255, lng: 78.0436 },
      "Dehradun Railway Station": { lat: 30.3242, lng: 78.0348 },
      "Jolly Grant Airport": { lat: 30.1897, lng: 78.1804 },
      "Pacific Mall": { lat: 30.3609, lng: 78.0664 },
      "Crossroads Mall": { lat: 30.3178, lng: 78.0356 },
      "Paltan Bazaar": { lat: 30.3158, lng: 78.0322 },
      "Clock Tower": { lat: 30.3165, lng: 78.0322 },
      "Forest Research Institute": { lat: 30.3355, lng: 77.9993 },
      "Robber's Cave": { lat: 30.3733, lng: 78.0122 },
      "Sahastradhara Road": { lat: 30.3596, lng: 78.0856 },
      "Rajpur Road Market": { lat: 30.3609, lng: 78.0664 },
      "Prince Chowk Market": { lat: 30.3158, lng: 78.0322 },
      "Max Hospital": { lat: 30.3609, lng: 78.0664 },
      "Doon Hospital": { lat: 30.3242, lng: 78.0348 },
      "Tapkeshwar Temple": { lat: 30.3847, lng: 78.0323 },
      "Malsi Deer Park": { lat: 30.4089, lng: 78.0456 },
      "Race Course": { lat: 30.3203, lng: 78.0348 },
      "Vasant Vihar": { lat: 30.3203, lng: 78.0348 },
      "Patel Nagar": { lat: 30.3189, lng: 78.0267 },
      "UPES University": { lat: 30.4012, lng: 78.0234 },
    }

    // Base coordinates for Dehradun center
    const baseLatLng = { lat: 30.3165, lng: 78.0322 }

    for (let i = 0; i < path.length; i++) {
      const location = path[i]
      const coords = locationCoords[location] || {
        lat: baseLatLng.lat + (Math.random() - 0.5) * 0.05,
        lng: baseLatLng.lng + (Math.random() - 0.5) * 0.05,
      }

      coordinates.push([coords.lat, coords.lng])

      // Add intermediate points for smoother routes
      if (i < path.length - 1) {
        const nextLocation = path[i + 1]
        const nextCoords = locationCoords[nextLocation] || {
          lat: baseLatLng.lat + (Math.random() - 0.5) * 0.05,
          lng: baseLatLng.lng + (Math.random() - 0.5) * 0.05,
        }

        // Add 2-3 intermediate points
        for (let j = 1; j <= 2; j++) {
          const ratio = j / 3
          const intermediateLat = coords.lat + (nextCoords.lat - coords.lat) * ratio
          const intermediateLng = coords.lng + (nextCoords.lng - coords.lng) * ratio
          coordinates.push([intermediateLat, intermediateLng])
        }
      }
    }

    return coordinates
  }

  private generateWaypoints(path: string[]): any[] {
    const waypoints = []

    for (let i = 0; i < path.length; i++) {
      const location = path[i]
      const isStart = i === 0
      const isEnd = i === path.length - 1

      waypoints.push({
        lat: 30.3165 + (Math.random() - 0.5) * 0.05,
        lng: 78.0322 + (Math.random() - 0.5) * 0.05,
        instruction: isStart ? "Start your journey" : isEnd ? "Arrive at destination" : `Continue to ${location}`,
        type: isStart ? "start" : isEnd ? "end" : "waypoint",
      })
    }

    return waypoints
  }

  private generateInstructions(path: string[]): any[] {
    const instructions = []

    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i]
      const to = path[i + 1]

      instructions.push({
        instruction: `Head from ${from} to ${to}`,
        distance: Math.random() * 2000 + 500, // Random distance in meters
        duration: Math.random() * 300 + 120, // Random duration in seconds
      })
    }

    return instructions
  }

  getLocationList(): string[] {
    return [...this.locationList]
  }

  isReady(): boolean {
    return this.isInitialized
  }

  // New method to check if two locations are connected
  areLocationsConnected(location1: string, location2: string): boolean {
    const result = this.dijkstraShortestPath(location1, location2)
    return result.isValid && result.distance > 0
  }

  // New method to get graph statistics
  getGraphStatistics() {
    let totalConnections = 0
    let isolatedNodes = 0

    for (let i = 0; i < this.nodeCount; i++) {
      const connections = this.adjList[i].length
      totalConnections += connections

      if (connections === 0) {
        isolatedNodes++
      }
    }

    return {
      totalNodes: this.nodeCount,
      totalConnections: totalConnections / 2, // Divided by 2 because edges are bidirectional
      isolatedNodes,
      averageConnections: totalConnections / this.nodeCount,
      isFullyConnected: isolatedNodes === 0,
    }
  }
}

export default DehradunGraph
