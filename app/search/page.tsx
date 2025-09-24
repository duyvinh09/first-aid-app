"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Mic, Search, Filter, X, Play, Pause } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MainNavigation from "@/components/main-navigation"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Mock search results data
  const mockSearchResults: SearchResult[] = [
    {
      id: "cpr",
      title: "CPR (Cardiopulmonary Resuscitation)",
      description: "Learn how to perform CPR to save lives during cardiac emergencies",
      category: "Emergency",
      priority: "high",
      tags: ["cardiac", "resuscitation", "emergency", "breathing"]
    },
    {
      id: "burns",
      title: "Burn Treatment",
      description: "First aid for different types of burns and wound care",
      category: "Injury",
      priority: "high",
      tags: ["burns", "wound", "treatment", "first aid"]
    },
    {
      id: "bleeding",
      title: "Stop Bleeding",
      description: "How to control bleeding and apply pressure to wounds",
      category: "Injury",
      priority: "high",
      tags: ["bleeding", "wound", "pressure", "emergency"]
    },
    {
      id: "choking",
      title: "Choking - Heimlich Maneuver",
      description: "Step-by-step guide to help someone who is choking",
      category: "Emergency",
      priority: "high",
      tags: ["choking", "heimlich", "airway", "emergency"]
    }
  ]

  const categories = ["All", "Emergency", "Injury", "Medical", "Prevention"]
  const priorities = ["All", "High", "Medium", "Low"]

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        setIsListening(false)
        performSearch(transcript)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Filter results based on query and selected filters
    let filteredResults = mockSearchResults.filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase()) ||
      result.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )

    // Apply category filter
    if (selectedFilters.includes('Emergency')) {
      filteredResults = filteredResults.filter(result => result.category === 'Emergency')
    } else if (selectedFilters.includes('Injury')) {
      filteredResults = filteredResults.filter(result => result.category === 'Injury')
    }

    // Apply priority filter
    if (selectedFilters.includes('High')) {
      filteredResults = filteredResults.filter(result => result.priority === 'high')
    } else if (selectedFilters.includes('Medium')) {
      filteredResults = filteredResults.filter(result => result.priority === 'medium')
    } else if (selectedFilters.includes('Low')) {
      filteredResults = filteredResults.filter(result => result.priority === 'low')
    }

    setSearchResults(filteredResults)
    setIsSearching(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery)
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const clearFilters = () => {
    setSelectedFilters([])
  }

  const recentSearches = ["CPR", "Bleeding", "Snake bite", "Burn treatment", "Choking"]
  const suggestedKeywords = ["Heimlich maneuver", "Burn treatment", "Sprain", "Allergic reaction", "Shock", "Head injury"]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 px-4">
          <Link href="/" className="rounded-full p-2 hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search first aid guides, symptoms, treatments..."
              className="pl-9 pr-20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`rounded-full ${isListening ? "text-red-600 animate-pulse" : ""}`}
                onClick={handleVoiceSearch}
              >
                {isListening ? <Pause className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span className="sr-only">Voice search</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filters</span>
              </Button>
            </div>
          </form>
        </div>
      </header>

      {/* Filters */}
      {showFilters && (
        <div className="border-b bg-muted/30 p-4">
          <div className="container">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedFilters.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleFilter(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Priority</p>
                <div className="flex flex-wrap gap-2">
                  {priorities.map((priority) => (
                    <Badge
                      key={priority}
                      variant={selectedFilters.includes(priority) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleFilter(priority)}
                    >
                      {priority}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {searchResults.length > 0 ? (
          <section className="container px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">
                Search Results ({searchResults.length})
              </h2>
              {isSearching && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"></div>
                  Searching...
                </div>
              )}
            </div>
            <div className="space-y-4">
              {searchResults.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          <Link 
                            href={`/guide/${result.id}`}
                            className="hover:text-red-600 transition-colors"
                          >
                            {result.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {result.description}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={result.priority === 'high' ? 'destructive' : 
                                result.priority === 'medium' ? 'default' : 'secondary'}
                      >
                        {result.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{result.category}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {result.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : searchQuery ? (
          <section className="container px-4 py-6">
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                Try different keywords or check your spelling
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          </section>
        ) : (
          <>
            <section className="container px-4 py-6">
              <h2 className="mb-3 text-lg font-medium">Recent Searches</h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(term)
                      performSearch(term)
                    }}
                    className="rounded-full"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </section>

            <section className="container px-4 py-6">
              <h2 className="mb-3 text-lg font-medium">Suggested Keywords</h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {suggestedKeywords.map((keyword) => (
                  <Button
                    key={keyword}
                    variant="ghost"
                    className="justify-start h-auto p-3 text-left"
                    onClick={() => {
                      setSearchQuery(keyword)
                      performSearch(keyword)
                    }}
                  >
                    <div>
                      <div className="font-medium">{keyword}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <MainNavigation />
    </div>
  )
}

interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  priority: 'high' | 'medium' | 'low'
  tags: string[]
}

