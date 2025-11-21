"use client"

import { useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Phone, ChevronRight, ChevronLeft, Play, Pause, Download, Eye, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EmergencyButton from "@/components/emergency-button"
import MainNavigation from "@/components/main-navigation"

interface GuidePageProps {
  params: Promise<{
    id: string
  }>
}

export default function GuidePage({ params }: GuidePageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  
  // Unwrap the params Promise using React.use()
  const { id } = use(params)
  
  // In a real app, this would fetch data based on the ID
  const guideData = guides[id] || guides.cpr

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link href="/" className="mr-2 rounded-full p-2 hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
            <h1 className="text-xl font-bold">{guideData.title}</h1>
          </div>
          <Link href="/emergency" className="rounded-full bg-red-600 p-2 text-white hover:bg-red-700">
            <Phone className="h-5 w-5" />
            <span className="sr-only">Emergency</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="container px-4 py-6 max-w-6xl mx-auto">
          {/* Hero Section */}
          <Card className="mb-6">
            <div className="relative">
              {guideData.video ? (
                <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
                  <video
                    className="w-full h-full object-cover"
                    poster={guideData.image}
                    controls
                  >
                    <source src={guideData.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      Video Guide
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Image
                    src={guideData.image || "/placeholder.svg"}
                    alt={guideData.title}
                    width={800}
                    height={400}
                    className="w-full rounded-t-lg object-cover"
                  />
                  {guideData.audio && (
                    <div className="absolute bottom-4 right-4">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-black/50 text-white hover:bg-black/70"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{guideData.title}</CardTitle>
                  <CardDescription className="mt-2 text-base">
                    {guideData.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={guideData.priority === 'high' ? 'destructive' : 'default'}>
                    {guideData.priority} Priority
                  </Badge>
                  <Badge variant="outline">{guideData.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {guideData.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Multimedia Tabs */}
          <Tabs defaultValue="steps" className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="steps">Steps</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="steps" className="space-y-4">
              {guideData.steps.map((step, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Step {index + 1}</CardTitle>
                      {step.duration && (
                        <Badge variant="outline">{step.duration}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="mb-4 text-base leading-relaxed">{step.instruction}</p>
                    
                    {/* Step Media */}
                    <div className="space-y-4">
                      {step.image && (
                        <div className="relative group">
                          <Image
                            src={step.image}
                            alt={`Step ${index + 1} illustration`}
                            width={600}
                            height={400}
                            className="w-full rounded-lg object-cover"
                          />
                          <Button
                            size="sm"
                            variant="secondary"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => window.open(step.image, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      {step.video && (
                        <div className="relative">
                          <video
                            className="w-full rounded-lg"
                            controls
                            poster={step.image}
                          >
                            <source src={step.video} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                      
                      {step.audio && (
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsPlaying(!isPlaying)}
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Audio Guide</p>
                            <p className="text-xs text-muted-foreground">Listen to step-by-step instructions</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsMuted(!isMuted)}
                          >
                            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guideData.images?.map((image, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative group">
                      <Image
                        src={image.url}
                        alt={image.alt || `Guide image ${index + 1}`}
                        width={400}
                        height={300}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => window.open(image.url, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Full Size
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-sm text-muted-foreground">{image.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {guideData.videos?.map((video, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="aspect-video bg-black">
                      <video
                        className="w-full h-full object-cover"
                        controls
                        poster={video.thumbnail}
                      >
                        <source src={video.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">{video.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guideData.documents?.map((doc, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Download className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground">{doc.type} • {doc.size}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Navigation */}
          <div className="flex justify-between mb-8">
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              disabled={currentStep >= guideData.steps.length - 1}
              onClick={() => setCurrentStep(Math.min(guideData.steps.length - 1, currentStep + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Emergency Section */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Need Emergency Help?</CardTitle>
              <CardDescription className="text-red-700">
                If this is a life-threatening emergency, call emergency services immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmergencyButton />
            </CardContent>
          </Card>
        </div>
      </main>

      <MainNavigation />
    </div>
  )
}

// Sample guide data with multimedia support
const guides = {
  cpr: {
    title: "CPR (Cardiopulmonary Resuscitation)",
    description: "CPR can help save a life during a cardiac or breathing emergency. Learn the essential steps to perform effective CPR.",
    image: "/placeholder.svg?height=400&width=800",
    video: "/icons/CPRR.mp4",
    audio: "/placeholder.mp3",
    category: "Emergency",
    priority: "high",
    tags: ["cardiac", "resuscitation", "emergency", "breathing", "life-saving"],
    steps: [
      {
        instruction: "Call for help.",
        image: "/icons/1cpr.jpg?height=300&width=400",
        duration: "30 seconds",
      },
      {
        instruction: "Check pulse.",
        image: "/icons/2cpr.jpg?height=300&width=400",
        duration: "1 minute",
      },
      {
        instruction: "Check for breathing.",
        image: "/icons/3cpr.jpg?height=300&width=400",
        duration: "30 seconds"
      },
      {
        instruction: "Give rescue breaths.",
        image: "/icons/4cpr.jpg?height=300&width=400",
        duration: "1 minute",
      },
      {
        instruction: "Give chest compressions.",
        image: "/icons/5cpr.jpg?height=300&width=400",
        duration: "2 minutes",
      },
      {
        instruction: "Repeat until the emergency services take over.",
        image: "/icons/6cpr.jpg?height=300&width=400",
        duration: "2 minutes",
      },
    ],
    images: [
      {
        url: "/icons/Primar-CPR.jpg?height=300&width=400",
        alt: "CPR hand placement",
        description: "Proper hand placement for chest compressions"
      },
    ],
    videos: [
      {
        url: "/icons/CPRR.mp4",
        title: "Complete CPR Demonstration",
        description: "Full demonstration of CPR technique with proper timing",
        thumbnail: "/placeholder.svg?height=200&width=400"
      }
    ],
    documents: [
      {
        title: "CPR Quick Reference Card",
        type: "PDF",
        size: "2.3 MB",
        url: "/placeholder-cpr-guide.pdf"
      },
      {
        title: "CPR Checklist",
        type: "PDF",
        size: "1.1 MB",
        url: "/placeholder-cpr-checklist.pdf"
      }
    ]
  },
  burns: {
    title: "Burns Treatment",
    description: "Proper first aid for burns can prevent infection and reduce pain. Learn how to assess and treat different types of burns.",
    image: "/placeholder.svg?height=400&width=800",
    video: "/icons/BurnTreat.mp4",
    audio: "/placeholder.mp3",
    category: "Injury",
    priority: "high",
    tags: ["burns", "wound", "treatment", "first aid", "injury"],
    steps: [
      {
        instruction: "Turn off the heat source.",
        image: "/icons/burn1.jpg?height=300&width=400",
        duration: "1 minute"
      },
      {
        instruction: "Run cool water over the burn.",
        image: "/icons/burn2.jpg?height=300&width=400",
        duration: "2 minutes"
      },
      {
        instruction: "Cover burn with sterile dressing.",
        image: "/icons/burn3.jpg?height=300&width=400",
        duration: "15 minutes",
      },
      {
        instruction: "Get to a burn center.",
        image: "/icons/burn4.jpg?height=300&width=400",
        duration: "2 minutes"
      },
    ],
    images: [
      {
        url: "/icons/mainburn.png?height=400&width=600",
        alt: "Burn severity assessment",
        description: "How to assess the severity of burns"
      },
    ],
    videos: [
      {
        url: "/icons/BurnTreat.mp4",
        title: "Burn Treatment Demonstration",
        description: "Complete demonstration of burn first aid treatment",
        thumbnail: "/placeholder.svg?height=200&width=400"
      }
    ],
    documents: [
      {
        title: "Burn Treatment Guide",
        type: "PDF",
        size: "3.2 MB",
        url: "/placeholder-burn-guide.pdf"
      }
    ]
  },
}