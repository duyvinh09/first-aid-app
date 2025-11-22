// API integration layer for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export interface EmergencySituation {
  id: string
  name: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: string
  tags: string[]
  icon?: string
}

export interface Guide {
  id: string
  title: string
  description: string
  category: string
  priority: 'high' | 'medium' | 'low'
  tags: string[]
  image?: string
  video?: string
  audio?: string
  steps: GuideStep[]
  images?: MediaItem[]
  videos?: VideoItem[]
  documents?: DocumentItem[]
}

export interface GuideStep {
  instruction: string
  image?: string
  video?: string
  audio?: string
  duration?: string
}

export interface MediaItem {
  url: string
  alt: string
  description: string
}

export interface VideoItem {
  url: string
  title: string
  description: string
  thumbnail: string
}

export interface DocumentItem {
  title: string
  type: string
  size: string
  url: string
}

export interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  priority: 'high' | 'medium' | 'low'
  tags: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatResponse {
  message: string
  suggestions?: string[]
  relatedGuides?: string[]
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Emergency Situations API
  async getEmergencySituations(): Promise<EmergencySituation[]> {
    return this.request<EmergencySituation[]>('/emergency-situations')
  }

  async getEmergencySituation(id: string): Promise<EmergencySituation> {
    return this.request<EmergencySituation>(`/emergency-situations/${id}`)
  }

  // Guides API
  async getGuides(): Promise<Guide[]> {
    return this.request<Guide[]>('/guides')
  }

  async getGuide(id: string): Promise<Guide> {
    return this.request<Guide>(`/guides/${id}`)
  }

  async searchGuides(query: string, filters?: {
    category?: string
    priority?: string
    tags?: string[]
  }): Promise<SearchResult[]> {
    const params = new URLSearchParams({ q: query })
    
    if (filters?.category) params.append('category', filters.category)
    if (filters?.priority) params.append('priority', filters.priority)
    if (filters?.tags) params.append('tags', filters.tags.join(','))
    
    return this.request<SearchResult[]>(`/search?${params.toString()}`)
  }

  // AI Chat API
  async sendChatMessage(message: string, context?: {
    currentGuide?: string
    userLocation?: { lat: number; lng: number }
    emergencyType?: string
  }): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        context,
      }),
    })
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    return this.request<ChatMessage[]>('/chat/history')
  }

  // Voice Search API
  async processVoiceInput(audioBlob: Blob): Promise<{
    transcript: string
    confidence: number
  }> {
    const formData = new FormData()
    formData.append('audio', audioBlob)

    return this.request<{
      transcript: string
      confidence: number
    }>('/voice/transcribe', {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      },
      body: formData,
    })
  }

  // Emergency Services API
  async getNearbyHospitals(location: { lat: number; lng: number }): Promise<{
    id: number
    name: string
    distance: string
    address: string
    phone: string
    coordinates: { lat: number; lng: number }
  }[]> {
    const params = new URLSearchParams({
      lat: location.lat.toString(),
      lng: location.lng.toString(),
    })
    
    return this.request<{
      id: number
      name: string
      distance: string
      address: string
      phone: string
      coordinates: { lat: number; lng: number }
    }[]>(`/emergency/hospitals?${params.toString()}`)
  }

  async reportEmergency(emergencyData: {
    type: string
    location: { lat: number; lng: number }
    description: string
    severity: 'low' | 'medium' | 'high' | 'critical'
  }): Promise<{
    emergencyId: string
    estimatedResponseTime: number
    assignedUnit: string
  }> {
    return this.request<{
      emergencyId: string
      estimatedResponseTime: number
      assignedUnit: string
    }>('/emergency/report', {
      method: 'POST',
      body: JSON.stringify(emergencyData),
    })
  }

  // Analytics API
  async trackGuideView(guideId: string, userId?: string): Promise<void> {
    return this.request<void>('/analytics/guide-view', {
      method: 'POST',
      body: JSON.stringify({ guideId, userId }),
    })
  }

  async trackSearch(query: string, results: number): Promise<void> {
    return this.request<void>('/analytics/search', {
      method: 'POST',
      body: JSON.stringify({ query, results }),
    })
  }

  async trackEmergencyCall(emergencyType: string): Promise<void> {
    return this.request<void>('/analytics/emergency-call', {
      method: 'POST',
      body: JSON.stringify({ emergencyType }),
    })
  }
}

// Create a singleton instance
export const apiClient = new ApiClient()

// Utility functions for common operations
export const apiUtils = {
  // Retry mechanism for failed requests
  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
        }
      }
    }
    
    throw lastError!
  },

  // Debounced search
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  // Cache management
  createCache<T>(ttl: number = 5 * 60 * 1000) { // 5 minutes default
    const cache = new Map<string, { data: T; timestamp: number }>()
    
    return {
      get(key: string): T | null {
        const item = cache.get(key)
        if (!item) return null
        
        if (Date.now() - item.timestamp > ttl) {
          cache.delete(key)
          return null
        }
        
        return item.data
      },
      
      set(key: string, data: T): void {
        cache.set(key, { data, timestamp: Date.now() })
      },
      
      clear(): void {
        cache.clear()
      }
    }
  }
}

// Export types for use in components
export type {
  EmergencySituation,
  Guide,
  GuideStep,
  MediaItem,
  VideoItem,
  DocumentItem,
  SearchResult,
  ChatMessage,
  ChatResponse,
  ApiError
}

