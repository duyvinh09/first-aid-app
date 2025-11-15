import { NextRequest } from "next/server"

// Minimal endpoint to avoid 404s from lib/api.ts -> /api/emergency-situations
// Returns an empty list so the homepage falls back to local mock data with icons

export async function GET(_req: NextRequest) {
  return new Response(JSON.stringify([]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}