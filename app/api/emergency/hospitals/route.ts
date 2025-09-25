import { NextRequest } from "next/server"

// Overpass API endpoint (public, rate-limited). No key required.
const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter"

type OverpassElement = {
  type: string
  id: number
  lat?: number
  lon?: number
  tags?: Record<string, string>
  nodes?: number[]
}

type HospitalFeature = {
  id: number
  name: string
  lat: number
  lon: number
  address?: string
  phone?: string
}

function buildOverpassQuery(lat: number, lon: number, radiusMeters: number) {
  // Searches for hospitals and clinics within the radius
  return `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      node["amenity"="clinic"](around:${radiusMeters},${lat},${lon});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      way["amenity"="clinic"](around:${radiusMeters},${lat},${lon});
      relation["amenity"="hospital"](around:${radiusMeters},${lat},${lon});
      relation["amenity"="clinic"](around:${radiusMeters},${lat},${lon});
    );
    out center 30;
  `
}

function extractFeatures(elements: OverpassElement[]): HospitalFeature[] {
  const features: HospitalFeature[] = []
  for (const el of elements) {
    const tags = el.tags || {}
    const name = tags.name || "Unknown"
    // For ways/relations, Overpass returns a computed center
    const lat = (el as any).lat ?? (el as any).center?.lat
    const lon = (el as any).lon ?? (el as any).center?.lon
    if (typeof lat !== "number" || typeof lon !== "number") continue
    const addressParts = [
      tags["addr:housenumber"],
      tags["addr:street"],
      tags["addr:city"],
      tags["addr:state"],
      tags["addr:postcode"],
    ].filter(Boolean)
    const address = addressParts.join(", ") || undefined
    const phone = tags.phone || tags["contact:phone"]
    features.push({ id: el.id, name, lat, lon, address, phone })
  }
  // Deduplicate by id
  const seen = new Set<number>()
  return features.filter((f) => (seen.has(f.id) ? false : (seen.add(f.id), true)))
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lat = Number(searchParams.get("lat"))
    const lon = Number(searchParams.get("lng"))
    const radius = Number(searchParams.get("radius")) || 3000 // default 3km

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return new Response(JSON.stringify({ error: "lat and lng are required" }), { status: 400 })
    }

    const query = buildOverpassQuery(lat, lon, Math.min(Math.max(radius, 500), 20000))

    const res = await fetch(OVERPASS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      body: new URLSearchParams({ data: query }),
      // Overpass may be slow; allow longer timeout implicitly
      // Next.js edge runtimes might need node runtime for fetch body; this is fine in node
      cache: "no-store",
    })

    if (!res.ok) {
      const text = await res.text()
      return new Response(JSON.stringify({ error: "Overpass error", details: text }), { status: 502 })
    }

    const data = (await res.json()) as { elements: OverpassElement[] }
    const features = extractFeatures(data.elements || [])

    return new Response(JSON.stringify({ hospitals: features }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), { status: 500 })
  }
}


