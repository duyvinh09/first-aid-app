"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import L from "leaflet"
import { Button } from "@/components/ui/button"

type Hospital = {
  id: number
  name: string
  lat: number
  lon: number
  address?: string
  phone?: string
  distanceKm?: number
}

type Props = {
  center: { lat: number; lng: number }
  hospitals: Hospital[]
}

export default function LeafletMap({ center, hospitals }: Props) {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const userMarkerRef = useRef<any>(null)
  const hospitalsLayerRef = useRef<any>(null)

  // Initialize map once on mount
  useEffect(() => {
    setMounted(true)
    return () => {
      // Cleanup any lingering leaflet id on container to avoid double-init
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      const el = containerRef.current as any
      if (el && el._leaflet_id) {
        try {
          delete el._leaflet_id
        } catch {}
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return
    if (mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom: 14,
      zoomControl: true,
    })
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map)

    // User marker
    const userMarker = L.marker([center.lat, center.lng]).addTo(map)
    userMarker.bindPopup("Vị trí của bạn")

    // Hospitals layer
    const hospitalsLayer = L.layerGroup().addTo(map)

    mapRef.current = map
    userMarkerRef.current = userMarker
    hospitalsLayerRef.current = hospitalsLayer
  }, [mounted])

  // Update center/user marker when center changes
  useEffect(() => {
    if (!mapRef.current || !userMarkerRef.current) return
    userMarkerRef.current.setLatLng([center.lat, center.lng])
    mapRef.current.setView([center.lat, center.lng])
  }, [center])

  // Update hospitals markers when list changes
  useEffect(() => {
    if (!hospitalsLayerRef.current) return
    const layer = hospitalsLayerRef.current
    layer.clearLayers()
    hospitals.slice(0, 50).forEach((h) => {
      const m = L.marker([h.lat, h.lon])
      const lines: string[] = [
        `<div class=\"font-medium\">${escapeHtml(h.name)}</div>`,
      ]
      if (h.address) lines.push(`<div class=\"text-sm\">${escapeHtml(h.address)}</div>`)
      if (typeof h.distanceKm === "number")
        lines.push(`<div class=\"text-sm\">Cách khoảng ${h.distanceKm.toFixed(2)} km</div>`)
      if (h.phone)
        lines.push(
          `<button data-phone=\"${escapeHtml(h.phone)}\" class=\"call-btn\">Gọi</button>`
        )
      const dirUrl = `https://www.google.com/maps/dir/?api=1&origin=${center.lat},${center.lng}&destination=${h.lat},${h.lon}`
      lines.push(`<a href=\"${dirUrl}\" target=\"_blank\" rel=\"noopener\" class=\"dir-link\">Dẫn đường</a>`)
      m.bindPopup(lines.join(""))
      m.addTo(layer)
      m.on("popupopen", (e: any) => {
        const btn = (e.popup.getElement() as HTMLElement)?.querySelector(".call-btn") as HTMLButtonElement | null
        if (btn) {
          btn.onclick = () => {
            const phone = btn.getAttribute("data-phone") || ""
            if (phone) window.location.href = `tel:${phone}`
          }
        }
      })
    })
  }, [hospitals])

  return <div ref={containerRef} style={{ height: "100%", width: "100%", position: 'relative', zIndex: 0 }} />
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;")
}


