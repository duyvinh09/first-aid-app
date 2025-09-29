"use client"

import { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Bot, User, Trash2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChat, useVoiceSearch } from '@/hooks/use-api'

interface AIChatProps {
  currentGuide?: string
  userLocation?: { lat: number; lng: number }
  emergencyType?: string
  className?: string
}

export default function AIChat({ 
  currentGuide, 
  userLocation, 
  emergencyType,
  className = "" 
}: AIChatProps) {
  const [message, setMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { messages, loading, error, sendMessage, clearChat } = useChat()
  const { 
    isListening, 
    transcript, 
    error: voiceError, 
    startListening, 
    stopListening 
  } = useVoiceSearch()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle voice transcript
  useEffect(() => {
    if (transcript) {
      setMessage(transcript)
      inputRef.current?.focus()
    }
  }, [transcript])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || loading) return

    const messageToSend = message.trim()
    setMessage('')

    await sendMessage(messageToSend, {
      currentGuide,
      userLocation,
      emergencyType
    })
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const quickActions = [
    "How do I perform CPR?",
    "What should I do for a burn?",
    "How to stop bleeding?",
    "Emergency contact numbers",
    "First aid kit checklist"
  ]

  return (
    <div className={`fixed bottom-20 right-4 z-50 ${className}`}>
      {!isExpanded ? (
        <Button
          onClick={() => setIsExpanded(true)}
          className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700 shadow-lg"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 h-96 shadow-xl border-0 bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-red-600" />
                AI Assistant
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-full">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 pb-4">
                {messages.length === 0 && (
                  <div className="text-center py-4">
                    <Bot className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Hi! I'm your AI first aid assistant. How can I help you?
                    </p>
                    <div className="space-y-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full text-left justify-start text-xs"
                          onClick={() => setMessage(action)}
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-red-600 text-white'
                      }`}>
                        {msg.role === 'user' ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <Bot className="h-3 w-3" />
                        )}
                      </div>
                      <div className={`rounded-lg px-3 py-2 text-sm ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-muted'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.role === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                        }`}>
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex gap-2 justify-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center">
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {(error || voiceError) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      {error?.message || voiceError?.message || 'An error occurred'}
                    </p>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="border-t p-3">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about first aid..."
                  className="flex-1 text-sm"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={handleVoiceToggle}
                  disabled={loading}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 text-red-600" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  className="h-9 w-9 bg-red-600 hover:bg-red-700"
                  disabled={!message.trim() || loading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              
              {isListening && (
                <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  Listening...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

