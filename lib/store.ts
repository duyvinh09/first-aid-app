"use client"

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { apiClient, type EmergencySituation, type Guide, type SearchResult } from './api'

// Types for the store
// Notification type used in the store
export type NotificationItem = {
  id: string
  title: string
  content: string
  isRead: boolean
  createdAt: string // ISO string
  type: 'message' | 'system' | 'alert'
}

interface AppState {
  // User preferences
  userPreferences: {
    language: string
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    locationEnabled: boolean
  }
  
  // Search state
  searchHistory: string[]
  recentSearches: string[]
  savedSearches: string[]
  
  // Guide state
  favoriteGuides: string[]
  recentlyViewedGuides: string[]
  guideProgress: Record<string, number> // guideId -> step number
  
  // Emergency state
  emergencyContacts: Array<{
    id: string
    name: string
    phone: string
    type: 'emergency' | 'hospital' | 'doctor' | 'family'
  }>
  userLocation: { lat: number; lng: number } | null
  
  // Cache
  emergencySituations: EmergencySituation[]
  guides: Record<string, Guide>
  searchCache: Record<string, SearchResult[]>

  // Notifications
  notifications: NotificationItem[]
  
  // UI state
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
}

interface AppActions {
  // User preferences
  updatePreferences: (preferences: Partial<AppState['userPreferences']>) => void
  
  // Search actions
  addToSearchHistory: (query: string) => void
  addToRecentSearches: (query: string) => void
  saveSearch: (query: string) => void
  removeSavedSearch: (query: string) => void
  clearSearchHistory: () => void
  
  // Guide actions
  addToFavorites: (guideId: string) => void
  removeFromFavorites: (guideId: string) => void
  addToRecentlyViewed: (guideId: string) => void
  updateGuideProgress: (guideId: string, step: number) => void
  
  // Emergency actions
  addEmergencyContact: (contact: AppState['emergencyContacts'][0]) => void
  removeEmergencyContact: (contactId: string) => void
  updateUserLocation: (location: { lat: number; lng: number } | null) => void
  
  // Data actions
  setEmergencySituations: (situations: EmergencySituation[]) => void
  setGuide: (guide: Guide) => void
  setSearchResults: (query: string, results: SearchResult[]) => void
  
  // UI actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // Data fetching
  fetchEmergencySituations: () => Promise<void>
  fetchGuide: (id: string) => Promise<void>
  searchGuides: (query: string, filters?: any) => Promise<SearchResult[]>
  // Notifications actions
  addNotification: (notification: NotificationItem) => void
  markNotificationAsRead: (id: string) => void
  markNotificationAsUnread: (id: string) => void
  fetchNotifications: () => Promise<void>
}

// Initial state
const initialState: AppState = {
  userPreferences: {
    language: 'en',
    theme: 'system',
    notifications: true,
    locationEnabled: false
  },
  searchHistory: [],
  recentSearches: [],
  savedSearches: [],
  favoriteGuides: [],
  recentlyViewedGuides: [],
  guideProgress: {},
  emergencyContacts: [
    {
      id: 'emergency-115',
      name: 'Emergency Services',
      phone: '115',
      type: 'emergency'
    }
  ],
  userLocation: null,
  emergencySituations: [],
  guides: {},
  searchCache: {},
  notifications: [],
  isLoading: false,
  error: null,
  lastUpdated: null
}

// Create the store
export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // User preferences
      updatePreferences: (preferences) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences }
        })),
      
      // Search actions
      addToSearchHistory: (query) =>
        set((state) => ({
          searchHistory: [query, ...state.searchHistory.filter(q => q !== query)].slice(0, 50)
        })),
      
      addToRecentSearches: (query) =>
        set((state) => ({
          recentSearches: [query, ...state.recentSearches.filter(q => q !== query)].slice(0, 10)
        })),
      
      saveSearch: (query) =>
        set((state) => ({
          savedSearches: [...state.savedSearches.filter(q => q !== query), query]
        })),
      
      removeSavedSearch: (query) =>
        set((state) => ({
          savedSearches: state.savedSearches.filter(q => q !== query)
        })),
      
      clearSearchHistory: () =>
        set({ searchHistory: [] }),
      
      // Guide actions
      addToFavorites: (guideId) =>
        set((state) => ({
          favoriteGuides: [...state.favoriteGuides.filter(id => id !== guideId), guideId]
        })),
      
      removeFromFavorites: (guideId) =>
        set((state) => ({
          favoriteGuides: state.favoriteGuides.filter(id => id !== guideId)
        })),
      
      addToRecentlyViewed: (guideId) =>
        set((state) => ({
          recentlyViewedGuides: [guideId, ...state.recentlyViewedGuides.filter(id => id !== guideId)].slice(0, 20)
        })),
      
      updateGuideProgress: (guideId, step) =>
        set((state) => ({
          guideProgress: { ...state.guideProgress, [guideId]: step }
        })),
      
      // Emergency actions
      addEmergencyContact: (contact) =>
        set((state) => ({
          emergencyContacts: [...state.emergencyContacts, contact]
        })),
      
      removeEmergencyContact: (contactId) =>
        set((state) => ({
          emergencyContacts: state.emergencyContacts.filter(c => c.id !== contactId)
        })),
      
      updateUserLocation: (location) =>
        set({ userLocation: location }),
      
      // Data actions
      setEmergencySituations: (situations) =>
        set({ emergencySituations: situations, lastUpdated: new Date() }),

      // Notifications actions
      addNotification: (notification) =>
        set((state) => ({ notifications: [notification, ...state.notifications] })),

      markNotificationAsRead: (id) =>
        set((state) => ({ notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n) })),

      markNotificationAsUnread: (id) =>
        set((state) => ({ notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: false } : n) })),

      fetchNotifications: async () => {
        try {
          const notifications = await apiClient.getNotifications()
          // normalize createdAt to ISO strings if needed
          const normalized = (notifications || []).map((n: any) => ({
            id: n.id,
            title: n.title,
            content: n.content,
            isRead: !!n.isRead,
            createdAt: n.createdAt || new Date().toISOString(),
            type: n.type || 'system',
          }))
          set({ notifications: normalized })
        } catch (e) {
          // fallback: keep existing notifications
        }
      },
      
      setGuide: (guide) =>
        set((state) => ({
          guides: { ...state.guides, [guide.id]: guide }
        })),
      
      setSearchResults: (query, results) =>
        set((state) => ({
          searchCache: { ...state.searchCache, [query]: results }
        })),
      
      // UI actions
      setLoading: (loading) =>
        set({ isLoading: loading }),
      
      setError: (error) =>
        set({ error }),
      
      clearError: () =>
        set({ error: null }),
      
      // Data fetching
      fetchEmergencySituations: async () => {
        const { setLoading, setError, setEmergencySituations } = get()
        
        try {
          setLoading(true)
          setError(null)
          
          const situations = await apiClient.getEmergencySituations()
          setEmergencySituations(situations)
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to fetch emergency situations')
        } finally {
          setLoading(false)
        }
      },
      
      fetchGuide: async (id) => {
        const { setLoading, setError, setGuide, addToRecentlyViewed } = get()
        
        try {
          setLoading(true)
          setError(null)
          
          const guide = await apiClient.getGuide(id)
          setGuide(guide)
          addToRecentlyViewed(id)
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to fetch guide')
        } finally {
          setLoading(false)
        }
      },
      
      searchGuides: async (query, filters) => {
        const { setLoading, setError, setSearchResults, addToSearchHistory, addToRecentSearches, searchCache } = get()
        
        // Check cache first
        const cacheKey = `${query}-${JSON.stringify(filters || {})}`
        if (searchCache[cacheKey]) {
          return searchCache[cacheKey]
        }
        
        try {
          setLoading(true)
          setError(null)
          
          const results = await apiClient.searchGuides(query, filters)
          setSearchResults(cacheKey, results)
          addToSearchHistory(query)
          addToRecentSearches(query)
          
          return results
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to search guides')
          return []
        } finally {
          setLoading(false)
        }
      }
    }),
    {
      name: 'first-aid-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userPreferences: state.userPreferences,
        searchHistory: state.searchHistory,
        recentSearches: state.recentSearches,
        savedSearches: state.savedSearches,
        favoriteGuides: state.favoriteGuides,
        recentlyViewedGuides: state.recentlyViewedGuides,
        guideProgress: state.guideProgress,
        emergencyContacts: state.emergencyContacts,
        userLocation: state.userLocation,
        emergencySituations: state.emergencySituations,
        guides: state.guides,
        searchCache: state.searchCache,
        notifications: state.notifications,
        lastUpdated: state.lastUpdated
      })
    }
  )
)

// Selectors for common use cases
export const useUserPreferences = () => useAppStore((state) => state.userPreferences)
export const useSearchHistory = () => useAppStore((state) => state.searchHistory)
export const useRecentSearches = () => useAppStore((state) => state.recentSearches)
export const useFavoriteGuides = () => useAppStore((state) => state.favoriteGuides)
export const useRecentlyViewedGuides = () => useAppStore((state) => state.recentlyViewedGuides)
export const useEmergencyContacts = () => useAppStore((state) => state.emergencyContacts)
export const useUserLocation = () => useAppStore((state) => state.userLocation)
export const useAppLoading = () => useAppStore((state) => state.isLoading)
export const useAppError = () => useAppStore((state) => state.error)

// Action selectors
export const useAppActions = () => useAppStore((state) => ({
  updatePreferences: state.updatePreferences,
  addToSearchHistory: state.addToSearchHistory,
  addToRecentSearches: state.addToRecentSearches,
  saveSearch: state.saveSearch,
  removeSavedSearch: state.removeSavedSearch,
  clearSearchHistory: state.clearSearchHistory,
  addToFavorites: state.addToFavorites,
  removeFromFavorites: state.removeFromFavorites,
  addToRecentlyViewed: state.addToRecentlyViewed,
  updateGuideProgress: state.updateGuideProgress,
  addEmergencyContact: state.addEmergencyContact,
  removeEmergencyContact: state.removeEmergencyContact,
  updateUserLocation: state.updateUserLocation,
  setEmergencySituations: state.setEmergencySituations,
  setGuide: state.setGuide,
  setSearchResults: state.setSearchResults,
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError,
  fetchEmergencySituations: state.fetchEmergencySituations,
  fetchGuide: state.fetchGuide,
  searchGuides: state.searchGuides
}))

// Utility functions
export const storeUtils = {
  // Check if data is stale (older than 5 minutes)
  isDataStale: (lastUpdated: Date | null) => {
    if (!lastUpdated) return true
    return Date.now() - lastUpdated.getTime() > 5 * 60 * 1000
  },
  
  // Clear all cached data
  clearCache: () => {
    useAppStore.setState({
      emergencySituations: [],
      guides: {},
      searchCache: {},
      lastUpdated: null
    })
  },
  
  // Get cached guide or fetch if not available
  getGuide: async (id: string) => {
    const state = useAppStore.getState()
    const cachedGuide = state.guides[id]
    
    if (cachedGuide) {
      return cachedGuide
    }
    
    await state.fetchGuide(id)
    return useAppStore.getState().guides[id]
  },
  
  // Get cached emergency situations or fetch if not available
  getEmergencySituations: async () => {
    const state = useAppStore.getState()
    const { emergencySituations, lastUpdated, fetchEmergencySituations } = state
    
    if (emergencySituations.length > 0 && !storeUtils.isDataStale(lastUpdated)) {
      return emergencySituations
    }
    
    await fetchEmergencySituations()
    return useAppStore.getState().emergencySituations
  }
}

