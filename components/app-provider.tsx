"use client"

import { useEffect, ReactNode } from 'react'
import { useAppStore, storeUtils } from '@/lib/store'

interface AppProviderProps {
  children: ReactNode
}

export default function AppProvider({ children }: AppProviderProps) {
  const { fetchEmergencySituations, setLoading, setError } = useAppStore()

  useEffect(() => {
    // Initialize app data
    const initializeApp = async () => {
      try {
        setLoading(true)
        
        // Fetch emergency situations on app start
        await storeUtils.getEmergencySituations()
        
        // Request location permission if not already granted
        if (navigator.geolocation && !useAppStore.getState().userLocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              useAppStore.getState().updateUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              })
            },
            (error) => {
              console.warn('Location access denied:', error.message)
            }
          )
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to initialize app')
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [fetchEmergencySituations, setLoading, setError])

  return <>{children}</>
}

