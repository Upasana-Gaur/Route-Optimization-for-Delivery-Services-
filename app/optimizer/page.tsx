"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapComponent } from "@/components/map-component"
import { RouteResults } from "@/components/route-results"
import { RoutePathDisplay } from "@/components/route-path-display"
import { Target, Navigation, Route, MapPin, ArrowLeft, X } from "lucide-react"
import Link from "next/link"

interface Location {
  id: string
  name: string
  lat: number
  lng: number
  address: string
}

interface RouteData {
  distance: number
  duration: number
  path: Location[]
  algorithm: string
  fuelCost: number
  coordinates?: number[][]
  waypoints?: any[]
  instructions?: any[]
}

// Real Dehradun locations from the data file
const dehradunLocations: Location[] = [
  { id: "1", name: "ISBT Dehradun", lat: 30.3255, lng: 78.0436, address: "ISBT, Dehradun" },
  { id: "2", name: "Dehradun Railway Station", lat: 30.3242, lng: 78.0348, address: "Railway Station Road, Dehradun" },
  { id: "3", name: "Jolly Grant Airport", lat: 30.1897, lng: 78.1804, address: "Jolly Grant, Dehradun" },
  { id: "4", name: "Inter State Bus Terminal", lat: 30.3255, lng: 78.0436, address: "ISBT, Dehradun" },
  { id: "5", name: "Mussoorie Bus Stand", lat: 30.3242, lng: 78.0348, address: "Mussoorie Road, Dehradun" },
  { id: "6", name: "Pacific Mall", lat: 30.3609, lng: 78.0664, address: "Rajpur Road, Dehradun" },
  { id: "7", name: "Crossroads Mall", lat: 30.3178, lng: 78.0356, address: "GMS Road, Dehradun" },
  { id: "8", name: "Paltan Bazaar", lat: 30.3158, lng: 78.0322, address: "Paltan Bazaar, Dehradun" },
  { id: "9", name: "Rajpur Road Market", lat: 30.3609, lng: 78.0664, address: "Rajpur Road, Dehradun" },
  { id: "10", name: "Prince Chowk Market", lat: 30.3158, lng: 78.0322, address: "Prince Chowk, Dehradun" },
  { id: "11", name: "Ballupur Chowk Market", lat: 30.3445, lng: 78.0234, address: "Ballupur, Dehradun" },
  { id: "12", name: "Astaranga Market", lat: 30.3203, lng: 78.0348, address: "Astaranga, Dehradun" },
  { id: "13", name: "Vasant Vihar", lat: 30.3203, lng: 78.0348, address: "Vasant Vihar, Dehradun" },
  { id: "14", name: "Race Course", lat: 30.3203, lng: 78.0348, address: "Race Course, Dehradun" },
  { id: "15", name: "Rajendra Nagar", lat: 30.3234, lng: 78.0345, address: "Rajendra Nagar, Dehradun" },
  { id: "16", name: "Indira Nagar", lat: 30.3203, lng: 78.0348, address: "Indira Nagar, Dehradun" },
  { id: "17", name: "Prem Nagar", lat: 30.3456, lng: 78.0789, address: "Prem Nagar, Dehradun" },
  { id: "18", name: "Subhash Nagar", lat: 30.3234, lng: 78.0345, address: "Subhash Nagar, Dehradun" },
  { id: "19", name: "Patel Nagar", lat: 30.3189, lng: 78.0267, address: "Patel Nagar, Dehradun" },
  { id: "20", name: "Karanpur Extension", lat: 30.3178, lng: 78.0356, address: "Karanpur Extension, Dehradun" },
  { id: "21", name: "Dharampur Block", lat: 30.3234, lng: 78.0345, address: "Dharampur Block, Dehradun" },
  { id: "22", name: "Bhagat Singh Colony", lat: 30.3189, lng: 78.0267, address: "Bhagat Singh Colony, Dehradun" },
  { id: "23", name: "Panditwadi", lat: 30.3456, lng: 78.0789, address: "Panditwadi, Dehradun" },
  { id: "24", name: "Niranjanpur", lat: 30.3234, lng: 78.0345, address: "Niranjanpur, Dehradun" },
  { id: "25", name: "Doon University", lat: 30.3789, lng: 78.0234, address: "Kedarpur, Dehradun" },
  { id: "26", name: "UPES University", lat: 30.4012, lng: 78.0234, address: "Energy Acres, Dehradun" },
  { id: "27", name: "Graphic Era University", lat: 30.3789, lng: 78.0456, address: "Bell Road, Clement Town" },
  { id: "28", name: "Indian Military Academy", lat: 30.3567, lng: 78.0789, address: "IMA, Dehradun" },
  { id: "29", name: "St. Joseph's Academy", lat: 30.3609, lng: 78.0664, address: "Rajpur Road, Dehradun" },
  { id: "30", name: "Convent of Jesus & Mary", lat: 30.3178, lng: 78.0356, address: "Rajpur Road, Dehradun" },
  { id: "31", name: "Max Hospital", lat: 30.3609, lng: 78.0664, address: "Malsi, Dehradun" },
  { id: "32", name: "Doon Hospital", lat: 30.3242, lng: 78.0348, address: "Sharanpur Road, Dehradun" },
  { id: "33", name: "Shri Mahant Indiresh Hospital", lat: 30.3234, lng: 78.0345, address: "Patel Nagar, Dehradun" },
  { id: "34", name: "Shri Guru Ram Rai Hospital", lat: 30.3234, lng: 78.0345, address: "Patel Nagar, Dehradun" },
  { id: "35", name: "Secretariat Building", lat: 30.3178, lng: 78.0356, address: "Rajpur Road, Dehradun" },
  { id: "36", name: "Uttarakhand High Court", lat: 30.3158, lng: 78.0322, address: "Nainital Road, Dehradun" },
  { id: "37", name: "Passport Office", lat: 30.3203, lng: 78.0348, address: "Kaulagarh Road, Dehradun" },
  { id: "38", name: "GMVN Tourist Office", lat: 30.3203, lng: 78.0348, address: "Rajpur Road, Dehradun" },
  { id: "39", name: "Ellora Market Food Court", lat: 30.3158, lng: 78.0322, address: "Paltan Bazaar, Dehradun" },
  { id: "40", name: "Rajpur Road Cafes", lat: 30.3609, lng: 78.0664, address: "Rajpur Road, Dehradun" },
  { id: "41", name: "Pacific Mall Food Court", lat: 30.3609, lng: 78.0664, address: "Pacific Mall, Dehradun" },
  { id: "42", name: "Amazon Delivery Station", lat: 30.3203, lng: 78.0348, address: "Industrial Area, Dehradun" },
  { id: "43", name: "Flipkart Hub Clement Town", lat: 30.3728, lng: 78.0492, address: "Clement Town, Dehradun" },
  { id: "44", name: "Clock Tower", lat: 30.3165, lng: 78.0322, address: "Paltan Bazaar, Dehradun" },
  { id: "45", name: "Robber's Cave", lat: 30.3733, lng: 78.0122, address: "Anarwala, Dehradun" },
  { id: "46", name: "Mindrolling Monastery", lat: 30.3728, lng: 78.0492, address: "Clement Town, Dehradun" },
  { id: "47", name: "Forest Research Institute", lat: 30.3355, lng: 77.9993, address: "FRI, Dehradun" },
  { id: "48", name: "Tapkeshwar Temple", lat: 30.3847, lng: 78.0323, address: "Garhi Cantt, Dehradun" },
  { id: "49", name: "Sahastradhara Road", lat: 30.3596, lng: 78.0856, address: "Sahastradhara Road, Dehradun" },
  { id: "50", name: "Malsi Deer Park", lat: 30.4089, lng: 78.0456, address: "Malsi, Dehradun" },
  { id: "51", name: "Parade Ground", lat: 30.3203, lng: 78.0348, address: "Parade Ground, Dehradun" },
  { id: "52", name: "EC Park", lat: 30.3203, lng: 78.0348, address: "EC Road, Dehradun" },
  { id: "53", name: "Gandhi Park", lat: 30.3203, lng: 78.0348, address: "Gandhi Road, Dehradun" },
]

function OptimizerContent() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get("mode") || "shortest"

  const [activeTab, setActiveTab] = useState(initialMode)
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([])
  const [routeData, setRouteData] = useState<RouteData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [startLocationId, setStartLocationId] = useState("")
  const [endLocationId, setEndLocationId] = useState("")
  const [multipleLocationIds, setMultipleLocationIds] = useState<string[]>([])

  const handleStartLocationChange = (locationId: string) => {
    setStartLocationId(locationId)
    const location = dehradunLocations.find((loc) => loc.id === locationId)
    if (location) {
      const endLocation = endLocationId ? dehradunLocations.find((loc) => loc.id === endLocationId) : null
      setSelectedLocations(endLocation ? [location, endLocation] : [location])
    }
  }

  const handleEndLocationChange = (locationId: string) => {
    setEndLocationId(locationId)
    const location = dehradunLocations.find((loc) => loc.id === locationId)
    if (location) {
      const startLocation = startLocationId ? dehradunLocations.find((loc) => loc.id === startLocationId) : null
      setSelectedLocations(startLocation ? [startLocation, location] : [location])
    }
  }

  const handleMultipleLocationAdd = (locationId: string) => {
    if (!multipleLocationIds.includes(locationId)) {
      const newIds = [...multipleLocationIds, locationId]
      setMultipleLocationIds(newIds)
      const locations = newIds.map((id) => dehradunLocations.find((loc) => loc.id === id)!).filter(Boolean)
      setSelectedLocations(locations)
    }
  }

  const handleMultipleLocationRemove = (locationId: string) => {
    const newIds = multipleLocationIds.filter((id) => id !== locationId)
    setMultipleLocationIds(newIds)
    const locations = newIds.map((id) => dehradunLocations.find((loc) => loc.id === id)!).filter(Boolean)
    setSelectedLocations(locations)
  }

  const handleOptimize = async () => {
    if (selectedLocations.length < 2) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locations: selectedLocations,
          algorithm: activeTab,
        }),
      })

      const data = await response.json()
      // API already returns `path` as an array of Location objects
      setRouteData(data as RouteData)
    } catch (error) {
      console.error("Optimization failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearSelections = () => {
    setSelectedLocations([])
    setStartLocationId("")
    setEndLocationId("")
    setMultipleLocationIds([])
    setRouteData(null)
  }

  const tabConfig = {
    shortest: {
      icon: Target,
      title: "Shortest Path",
      description: "Find the quickest route using Dijkstra's algorithm with real Dehradun distances",
      color: "text-blue-600",
    },
    alternative: {
      icon: Navigation,
      title: "Alternative Route",
      description: "Discover backup routes using Bellman-Ford algorithm",
      color: "text-green-600",
    },
    multiple: {
      icon: Route,
      title: "Multiple Deliveries",
      description: "Optimize delivery sequence using TSP algorithm",
      color: "text-purple-600",
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">Real-World Route Optimizer</h1>
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              <MapPin className="h-3 w-3 mr-1" />
              53 Dehradun Locations
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 bg-white p-1 shadow-sm">
            {Object.entries(tabConfig).map(([key, config]) => {
              const IconComponent = config.icon
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex items-center space-x-2 data-[state=active]:bg-gray-50"
                >
                  <IconComponent className={`h-4 w-4 ${config.color}`} />
                  <span className="hidden sm:inline">{config.title}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Tab Content */}
          {Object.entries(tabConfig).map(([key, config]) => (
            <TabsContent key={key} value={key} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <config.icon className={`h-6 w-6 ${config.color}`} />
                    <div>
                      <CardTitle>{config.title}</CardTitle>
                      <CardDescription>{config.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Controls */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          {key === "multiple" ? "Select Delivery Points" : "Select Route Points"}
                        </Label>

                        {key !== "multiple" && (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs text-gray-500 mb-1 block">Start Location</Label>
                              <Select value={startLocationId} onValueChange={handleStartLocationChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose start location" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                  {dehradunLocations.map((location) => (
                                    <SelectItem key={location.id} value={location.id}>
                                      <div>
                                        <div className="font-medium">{location.name}</div>
                                        <div className="text-xs text-gray-500">{location.address}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500 mb-1 block">End Location</Label>
                              <Select value={endLocationId} onValueChange={handleEndLocationChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose end location" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                  {dehradunLocations.map((location) => (
                                    <SelectItem key={location.id} value={location.id}>
                                      <div>
                                        <div className="font-medium">{location.name}</div>
                                        <div className="text-xs text-gray-500">{location.address}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        {key === "multiple" && (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs text-gray-500 mb-1 block">Add Delivery Location</Label>
                              <Select onValueChange={handleMultipleLocationAdd}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose delivery location" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                  {dehradunLocations
                                    .filter((location) => !multipleLocationIds.includes(location.id))
                                    .map((location) => (
                                      <SelectItem key={location.id} value={location.id}>
                                        <div>
                                          <div className="font-medium">{location.name}</div>
                                          <div className="text-xs text-gray-500">{location.address}</div>
                                        </div>
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {multipleLocationIds.length > 0 && (
                              <div>
                                <Label className="text-xs text-gray-500 mb-2 block">
                                  Selected Locations ({multipleLocationIds.length})
                                </Label>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                  {multipleLocationIds.map((locationId) => {
                                    const location = dehradunLocations.find((loc) => loc.id === locationId)
                                    return (
                                      <div
                                        key={locationId}
                                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                                      >
                                        <div className="text-sm">
                                          <div className="font-medium">{location?.name}</div>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleMultipleLocationRemove(locationId)}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={handleOptimize}
                          disabled={selectedLocations.length < 2 || isLoading}
                          className="w-full"
                        >
                          {isLoading ? "Optimizing..." : "Optimize Route"}
                        </Button>
                        <Button onClick={clearSelections} variant="outline" className="w-full">
                          Clear Selection
                        </Button>
                      </div>

                      {routeData && <RouteResults data={routeData} />}
                    </div>

                    {/* Map */}
                    <div className="lg:col-span-2 space-y-4">
                      <MapComponent
                        locations={dehradunLocations}
                        selectedLocations={selectedLocations}
                        routeData={routeData}
                      />

                      {routeData && <RoutePathDisplay routeData={routeData} />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

export default function OptimizerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OptimizerContent />
    </Suspense>
  )
}
