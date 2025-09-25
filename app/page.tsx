"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import EmergencyButton from "@/components/emergency-button"
import MainNavigation from "@/components/main-navigation"
import AIChat from "@/components/ai-chat"
import { useAppStore, useAppLoading, useAppError } from "@/lib/store"

export default function HomePage() {
  const { emergencySituations, fetchEmergencySituations } = useAppStore()
  const isLoading = useAppLoading()
  const error = useAppError()

  useEffect(() => {
    if (emergencySituations.length === 0) {
      fetchEmergencySituations()
    }
  }, [emergencySituations.length, fetchEmergencySituations])
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-red-600">Quick First Aid</h1>
          <Link href="/search" className="rounded-full p-2 hover:bg-muted">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container px-4 py-6 max-w-6xl mx-auto">
          <h2 className="mb-6 text-2xl font-bold">Common Emergencies</h2>
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-2">Loading emergency situations...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(emergencySituations.length > 0 ? emergencySituations : mockEmergencySituations).map((situation) => (
              <Link
                key={situation.id}
                href={`/guide/${situation.id}`}
                className="group rounded-lg border p-4 transition-all hover:shadow-md hover:border-red-200"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    situation.priority === 'high' ? 'bg-red-100' : 
                    situation.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    {(() => {
                      const IconComp: any = (situation as any).icon
                      if (!IconComp) return null
                      return (
                        <IconComp className={`h-6 w-6 ${
                          situation.priority === 'high' ? 'text-red-600' : 
                          situation.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`} />
                      )
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-red-600 transition-colors">
                      {situation.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {situation.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        situation.priority === 'high' ? 'bg-red-100 text-red-700' : 
                        situation.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {situation.priority === 'high' ? 'High Priority' : 
                         situation.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="container px-4 py-6 max-w-6xl mx-auto">
          <h2 className="mb-4 text-2xl font-bold">Emergency Assistance</h2>
          <EmergencyButton />
        </section>
      </main>

      <MainNavigation />
      <AIChat />
    </div>
  )
}

import { Heart, Flame, Droplets, Skull, LigatureIcon as Bandage, Thermometer, Pill, Scissors, Zap, Eye, Brain, Shield } from "lucide-react"

const mockEmergencySituations = [
  { id: "cpr", name: "CPR", icon: Heart, description: "Cardiopulmonary resuscitation", priority: "high" },
  { id: "burns", name: "Burns", icon: Flame, description: "Burn treatment and care", priority: "high" },
  { id: "bleeding", name: "Bleeding", icon: Droplets, description: "Stop bleeding and wound care", priority: "high" },
  { id: "choking", name: "Choking", icon: Skull, description: "Heimlich maneuver", priority: "high" },
  { id: "fractures", name: "Fractures", icon: Bandage, description: "Bone fracture first aid", priority: "medium" },
  { id: "fever", name: "Fever", icon: Thermometer, description: "High temperature management", priority: "medium" },
  { id: "poisoning", name: "Poisoning", icon: Pill, description: "Poison exposure treatment", priority: "high" },
  { id: "cuts", name: "Cuts & Wounds", icon: Scissors, description: "Minor wound care", priority: "low" },
  { id: "shock", name: "Shock", icon: Zap, description: "Shock management", priority: "high" },
  { id: "eye-injury", name: "Eye Injury", icon: Eye, description: "Eye trauma first aid", priority: "high" },
  { id: "head-injury", name: "Head Injury", icon: Brain, description: "Head trauma assessment", priority: "high" },
  { id: "allergic-reaction", name: "Allergic Reaction", icon: Shield, description: "Anaphylaxis treatment", priority: "high" },
]

