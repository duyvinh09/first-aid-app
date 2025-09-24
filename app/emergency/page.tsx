"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Phone, MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import MainNavigation from "@/components/main-navigation"

export default function EmergencyPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([])

  useEffect(() => {
    // In a real app, this would use the Geolocation API
    // For demo purposes, we'll set a mock location
    setUserLocation({ lat: 37.7749, lng: -122.4194 })

    // Mock nearby hospitals data
    setNearbyHospitals([
      { id: 1, name: "General Hospital", distance: "0.8 km", address: "123 Main St", phone: "555-1234" },
      { id: 2, name: "Emergency Medical Center", distance: "1.2 km", address: "456 Oak Ave", phone: "555-5678" },
      { id: 3, name: "Community Hospital", distance: "2.5 km", address: "789 Pine Rd", phone: "555-9012" },
    ])
  }, [])

  const handleEmergencyCall = () => {
    // In a real app, this would use the tel: protocol to initiate a call
    window.location.href = "tel:115"
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="mr-2 rounded-full p-2 hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
          <h1 className="text-xl font-bold">Emergency Assistance</h1>
        </div>
      </header>

      <main className="flex-1">
        <section className="container px-4 py-6">
          <Button
            onClick={handleEmergencyCall}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-6 text-xl font-bold text-white hover:bg-red-700"
          >
            <Phone className="h-6 w-6" />
            Call Emergency (115)
          </Button>

          <div className="mb-6 overflow-hidden rounded-lg border">
            <div className="relative h-[200px] w-full bg-muted">
              {userLocation ? (
                <Image
                  src={`/placeholder.svg?height=200&width=600&text=Map`}
                  alt="Map showing nearby hospitals"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p>Loading map...</p>
                </div>
              )}
              {userLocation && (
                <div className="absolute bottom-4 right-4 rounded-full bg-primary p-3 text-primary-foreground shadow-lg">
                  <Navigation className="h-5 w-5" />
                </div>
              )}
            </div>
          </div>

          <h2 className="mb-4 text-xl font-bold">Nearby Hospitals</h2>
          <div className="space-y-3">
            {nearbyHospitals.map((hospital) => (
              <div key={hospital.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{hospital.name}</h3>
                    <p className="text-sm text-muted-foreground">{hospital.address}</p>
                    <div className="mt-2 flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <span>{hospital.distance}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                      window.location.href = `tel:${hospital.phone.replace(/-/g, "")}`
                    }}
                  >
                    <Phone className="h-3 w-3" />
                    Call
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <MainNavigation />
    </div>
  )
}

interface Hospital {
  id: number
  name: string
  distance: string
  address: string
  phone: string
}

