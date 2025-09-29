import Link from "next/link"
import { Phone, MapPin } from "lucide-react"

export default function EmergencyButton() {
  return (
    <Link
      href="/emergency"
      className="flex flex-col items-center rounded-lg border border-red-200 bg-red-50 p-6 text-center shadow-sm transition-colors hover:bg-red-100"
    >
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white">
        <Phone className="h-8 w-8" />
      </div>
      <h3 className="mb-1 text-lg font-bold text-red-600">Emergency Help</h3>
      <p className="mb-3 text-sm text-muted-foreground">Call 115 or find the nearest hospital</p>
      <div className="flex items-center gap-1 text-sm">
        <MapPin className="h-4 w-4 text-red-600" />
        <span>Using your current location</span>
      </div>
    </Link>
  )
}

