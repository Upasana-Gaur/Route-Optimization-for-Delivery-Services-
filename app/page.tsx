"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Route, Truck, ArrowRight, Clock, Target, Navigation } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const optimizationModes = [
    {
      id: "shortest",
      title: "Shortest Path",
      description: "Find the quickest route between two points using Dijkstra's algorithm",
      icon: Target,
      color: "from-blue-500 to-blue-600",
      features: ["Fastest delivery time", "Fuel efficient", "Real-time traffic consideration"],
    },
    {
      id: "alternative",
      title: "Alternative Route",
      description: "Discover backup routes using Bellman-Ford algorithm for reliability",
      icon: Navigation,
      color: "from-green-500 to-green-600",
      features: ["Avoid traffic jams", "Multiple route options", "Weather-resistant paths"],
    },
    {
      id: "multiple",
      title: "Multiple Deliveries",
      description: "Optimize delivery sequence for multiple stops using TSP algorithm",
      icon: Route,
      color: "from-purple-500 to-purple-600",
      features: ["Minimize total distance", "Optimize delivery order", "Maximum efficiency"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DeliveryOptimizer</h1>
                <p className="text-sm text-gray-500">Dehradun Route Intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <MapPin className="h-4 w-4 mr-2" />
              Serving Dehradun & Surrounding Areas
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart Delivery
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Route Optimization
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Revolutionize your delivery operations with AI-powered route optimization. Save time, reduce fuel costs,
              and improve customer satisfaction.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">40%</div>
              <div className="text-gray-600">Faster Deliveries</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">30%</div>
              <div className="text-gray-600">Fuel Savings</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Optimization Modes */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Optimization Mode</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect algorithm for your delivery needs. Each mode is designed for specific scenarios to
              maximize efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {optimizationModes.map((mode) => {
              const IconComponent = mode.icon
              return (
                <Card
                  key={mode.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${
                    hoveredCard === mode.id ? "scale-105" : ""
                  }`}
                  onMouseEnter={() => setHoveredCard(mode.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-5`} />
                  <CardHeader className="relative">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${mode.color} w-fit mb-4`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">{mode.title}</CardTitle>
                    <CardDescription className="text-gray-600">{mode.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <ul className="space-y-2 mb-6">
                      {mode.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/optimizer?mode=${mode.id}`}>
                      <Button className={`w-full bg-gradient-to-r ${mode.color} hover:opacity-90 transition-opacity`}>
                        Start Optimizing
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Optimize Your Deliveries?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of delivery businesses in Dehradun who have already transformed their operations with our
            smart routing technology.
          </p>
          <Link href="/optimizer">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50">
              <Clock className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">DeliveryOptimizer</span>
          </div>
          <p className="text-gray-400">© 2024 DeliveryOptimizer. Optimizing routes across Dehradun.</p>
        </div>
      </footer>
    </div>
  )
}
