"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClient, apiUtils, type EmergencySituation, type Guide, type SearchResult, type ChatResponse } from '@/lib/api'

// Generic hook for API calls with loading and error states
export function useApiCall<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    execute()
  }, [execute])

  return { data, loading, error, refetch: execute }
}

// Hook for emergency situations
export function useEmergencySituations() {
  return useApiCall(() => apiClient.getEmergencySituations())
}

// Hook for individual guide
export function useGuide(id: string) {
  return useApiCall(() => apiClient.getGuide(id), [id])
}

// Hook for search with debouncing
export function useSearch() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<{
    category?: string
    priority?: string
    tags?: string[]
  }>({})
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const debouncedSearch = useRef(
    apiUtils.debounce(async (searchQuery: string, searchFilters: typeof filters) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const searchResults = await apiClient.searchGuides(searchQuery, searchFilters)
        setResults(searchResults)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }, 300)
  ).current

  const search = useCallback((searchQuery: string, searchFilters = filters) => {
    setQuery(searchQuery)
    setFilters(searchFilters)
    debouncedSearch(searchQuery, searchFilters)
  }, [debouncedSearch, filters])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setError(null)
  }, [])

  return {
    query,
    filters,
    results,
    loading,
    error,
    search,
    clearSearch,
    setFilters
  }
}

// Hook for AI chat
export function useChat() {
  const [messages, setMessages] = useState<Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const sendMessage = useCallback(async (
    message: string,
    context?: {
      currentGuide?: string
      userLocation?: { lat: number; lng: number }
      emergencyType?: string
    }
  ) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.sendChatMessage(message, context)
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat
  }
}

// Hook for voice search
export function useVoiceSearch() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<Error | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event: any) => {
        setError(new Error(`Speech recognition error: ${event.error}`))
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError(new Error('Speech recognition not supported in this browser'))
      return
    }

    setError(null)
    setTranscript('')
    recognitionRef.current.start()
    setIsListening(true)
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }, [])

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening
  }
}

// Hook for emergency services
export function useEmergencyServices() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [hospitals, setHospitals] = useState<Array<{
    id: number
    name: string
    distance: string
    address: string
    phone: string
    coordinates: { lat: number; lng: number }
  }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation is not supported by this browser'))
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setLocation(userLocation)

        try {
          const nearbyHospitals = await apiClient.getNearbyHospitals(userLocation)
          setHospitals(nearbyHospitals)
        } catch (err) {
          setError(err as Error)
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        setError(new Error(`Geolocation error: ${err.message}`))
        setLoading(false)
      }
    )
  }, [])

  const reportEmergency = useCallback(async (emergencyData: {
    type: string
    description: string
    severity: 'low' | 'medium' | 'high' | 'critical'
  }) => {
    if (!location) {
      throw new Error('Location not available')
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.reportEmergency({
        ...emergencyData,
        location
      })
      return response
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }, [location])

  return {
    location,
    hospitals,
    loading,
    error,
    getCurrentLocation,
    reportEmergency
  }
}

// Hook for analytics tracking
export function useAnalytics() {
  const trackGuideView = useCallback(async (guideId: string, userId?: string) => {
    try {
      await apiClient.trackGuideView(guideId, userId)
    } catch (error) {
      console.error('Failed to track guide view:', error)
    }
  }, [])

  const trackSearch = useCallback(async (query: string, results: number) => {
    try {
      await apiClient.trackSearch(query, results)
    } catch (error) {
      console.error('Failed to track search:', error)
    }
  }, [])

  const trackEmergencyCall = useCallback(async (emergencyType: string) => {
    try {
      await apiClient.trackEmergencyCall(emergencyType)
    } catch (error) {
      console.error('Failed to track emergency call:', error)
    }
  }, [])

  return {
    trackGuideView,
    trackSearch,
    trackEmergencyCall
  }
}

