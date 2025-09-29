"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowLeft, Phone, MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import MainNavigation from "@/components/main-navigation"

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), { ssr: false })

type Hospital = {
  id: number
  name: string
  lat: number
  lon: number
  address?: string
  phone?: string
  distanceKm?: number
}

export default function EmergencyPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canRenderMap, setCanRenderMap] = useState(false)

  useEffect(() => {
    // Ensure MapContainer only renders on client after mount (avoids double init in Strict Mode)
    setCanRenderMap(true)

    if (!("geolocation" in navigator)) {
      setError("Device does not support location.")
      return
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setUserLocation({ lat, lng })
      },
      () => {
        setError("Cannot get current location.")
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  const fetchHospitals = useCallback(async (lat: number, lng: number) => {
    try {
      setLoading(true)
      setError(null)
      const url = `/api/emergency/hospitals?lat=${lat}&lng=${lng}&radius=4000`
      const res = await fetch(url, { cache: "no-store" })
      if (!res.ok) throw new Error("Error loading hospital data")
      const data = (await res.json()) as { hospitals: Hospital[] }
      const withDistance = data.hospitals
        .map((h) => ({
          ...h,
          distanceKm: haversineKm(lat, lng, h.lat, h.lon),
        }))
        .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
      setNearbyHospitals(withDistance)
    } catch (e: any) {
      setError(e.message || "Đã xảy ra lỗi")
    } finally {
      setLoading(false)
    }
  }, [])

  const openDirections = (lat: number, lon: number) => {
    const hasOrigin = !!userLocation
    const url = hasOrigin
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation!.lat},${userLocation!.lng}&destination=${lat},${lon}`
      : `https://www.google.com/maps/place/${lat},${lon}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  useEffect(() => {
    if (userLocation) {
      fetchHospitals(userLocation.lat, userLocation.lng)
    }
  }, [userLocation, fetchHospitals])

  const handleEmergencyCall = () => {
    // In a real app, this would use the tel: protocol to initiate a call
    window.location.href = "tel:115"
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-[1000] border-b bg-background">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="mr-2 rounded-full p-2 hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
          <h1 className="text-xl font-bold">Emergency Assistance</h1>
        </div>
      </header>

      <main className="flex-1">
        <section className="container px-4 py-6 max-w-6xl mx-auto">
          <Button
            onClick={handleEmergencyCall}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-6 text-xl font-bold text-white hover:bg-red-700"
          >
            <Phone className="h-6 w-6" />
            Call Emergency (115)
          </Button>

          <div className="mb-6 overflow-hidden rounded-lg border">
            <div className="relative h-[300px] w-full bg-muted">
              {userLocation && canRenderMap ? (
                <LeafletMap center={userLocation} hospitals={nearbyHospitals} />
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

          <h2 className="mb-2 text-xl font-bold">Hospital near you</h2>
          {loading && <p className="text-sm text-muted-foreground">Finding hospitals near you...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="space-y-3 mt-2">
            {nearbyHospitals.map((hospital) => (
              <div key={hospital.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{hospital.name}</h3>
                    {hospital.address && (
                      <p className="text-sm text-muted-foreground">{hospital.address}</p>
                    )}
                    <div className="mt-2 flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <span>
                        {typeof hospital.distanceKm === "number" ? `${hospital.distanceKm.toFixed(2)} km` : "—"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => openDirections(hospital.lat, hospital.lon)}
                    >
                      <Navigation className="h-3 w-3" />
                      {/* Dẫn đường */}
                    </Button>
                    {hospital.phone && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => {
                          window.location.href = `tel:${hospital.phone}`
                        }}
                      >
                        <Phone className="h-3 w-3" />
                        {/* Gọi */}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {!loading && nearbyHospitals.length === 0 && (
              <p className="text-sm text-muted-foreground">No hospitals found within 4km radius.</p>
            )}
          </div>
        </section>
      </main>

      <MainNavigation />
    </div>
  )
}

// Haversine distance
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

