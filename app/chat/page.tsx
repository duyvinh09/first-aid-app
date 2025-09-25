"use client"

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bot, Send, Mic, MicOff, Trash2, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MainNavigation from '@/components/main-navigation'
import { useChat, useVoiceSearch } from '@/hooks/use-api'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('chat')
  const supportChatUrl = process.env.NEXT_PUBLIC_SUPPORT_CHAT_URL || ''
  const [ticketEmail, setTicketEmail] = useState('')
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketMessage, setTicketMessage] = useState('')
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  
  const { messages, loading, error, sendMessage, clearChat } = useChat()
  const { 
    isListening, 
    transcript, 
    error: voiceError, 
    startListening, 
    stopListening 
  } = useVoiceSearch()

  const handleQuickSend = useCallback(async (text: string) => {
    if (!text || loading) return
    setActiveTab('chat')
    await sendMessage(text)
  }, [loading, sendMessage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || loading) return

    const messageToSend = message.trim()
    setMessage('')

    await sendMessage(messageToSend)
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const quickActions = [
    {
      title: "Emergency Situations",
      actions: [
        "How do I perform CPR?",
        "What should I do for a burn?",
        "How to stop bleeding?",
        "Choking first aid"
      ]
    },
    {
      title: "General Health",
      actions: [
        "First aid kit checklist",
        "Emergency contact numbers",
        "When to call 911",
        "Basic wound care"
      ]
    },
    {
      title: "Prevention",
      actions: [
        "How to prevent accidents?",
        "Safety tips for home",
        "Emergency preparedness",
        "Health monitoring"
      ]
    }
  ]

  const suggestions = [
    "I need help with a medical emergency",
    "What's in a basic first aid kit?",
    "How do I treat a sprained ankle?",
    "What are the signs of a heart attack?",
    "How to perform the Heimlich maneuver?",
    "First aid for allergic reactions"
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link href="/" className="mr-2 rounded-full p-2 hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-red-600" />
              <h1 className="text-xl font-bold">AI Assistant</h1>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Chat
          </Button>
        </div>
      </header>

      <main className="flex-1 flex">
        <div className="container mx-auto w-full max-w-5xl flex-1 flex flex-col px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mt-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="suggestions">Quick Help</TabsTrigger>
              <TabsTrigger value="support">Ticket & FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col mt-2">
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-red-600" />
                    First Aid Assistant
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 px-6">
                    <div className="space-y-4 py-4">
                      {messages.length === 0 && (
                        <div className="text-center py-8">
                          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Welcome to AI First Aid Assistant</h3>
                          <p className="text-muted-foreground mb-6">
                            I'm here to help you with first aid questions, emergency guidance, and health information.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
                            {suggestions.slice(0, 4).map((suggestion, index) => (
                          <Button
                                key={index}
                                variant="outline"
                                className="text-left justify-start h-auto p-3"
                            onClick={() => handleQuickSend(suggestion)}
                            disabled={loading}
                              >
                                <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="text-sm">{suggestion}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              msg.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-red-600 text-white'
                            }`}>
                              {msg.role === 'user' ? (
                                <span className="text-sm font-medium">U</span>
                              ) : (
                                <Bot className="h-4 w-4" />
                              )}
                            </div>
                            <div className={`rounded-lg px-4 py-3 ${
                              msg.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-muted'
                            }`}>
                              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                              <p className={`text-xs mt-2 ${
                                msg.role === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                              }`}>
                                {msg.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {loading && (
                        <div className="flex gap-3 justify-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="bg-muted rounded-lg px-4 py-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {(error || voiceError) && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-sm text-red-800">
                            {error?.message || voiceError?.message || 'An error occurred'}
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  <div className="border-t p-4">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask about first aid, emergencies, or health..."
                        className="flex-1"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleVoiceToggle}
                        disabled={loading}
                        className={isListening ? 'text-red-600' : ''}
                      >
                        {isListening ? (
                          <MicOff className="h-4 w-4" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        type="submit"
                        size="icon"
                        className="bg-red-600 hover:bg-red-700"
                        disabled={!message.trim() || loading}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                    
                    {isListening && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                        Listening... Speak now
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suggestions" className="flex-1 mt-2">
              <div className="space-y-6">
                {quickActions.map((category, categoryIndex) => (
                  <Card key={categoryIndex}>
                    <CardHeader>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {category.actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            variant="outline"
                            className="text-left justify-start h-auto p-3"
                            onClick={() => handleQuickSend(action)}
                            disabled={loading}
                          >
                            <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">{action}</span>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="support" className="flex-1 mt-2">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-red-600" />
                      Send Support Ticket
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ticketSubmitted ? (
                      <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
                        Your ticket has been sent. Please wait for a response via email.
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          if (!ticketEmail.trim() || !ticketSubject.trim() || !ticketMessage.trim()) return
                          setTicketSubmitted(true)
                          setTicketEmail('')
                          setTicketSubject('')
                          setTicketMessage('')
                        }}
                        className="space-y-3"
                      >
                        <Input
                          type="email"
                          placeholder="Email"
                          value={ticketEmail}
                          onChange={(e) => setTicketEmail(e.target.value)}
                          required
                        />
                        <Input
                          placeholder="Title"
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          required
                        />
                        <Textarea
                          placeholder="Description..."
                          value={ticketMessage}
                          onChange={(e) => setTicketMessage(e.target.value)}
                          rows={10}
                          required
                        />
                        <div className="flex items-center gap-2">
                          <Button type="submit" className="bg-red-600 hover:bg-red-700">
                            Gửi Ticket
                          </Button>
                          {supportChatUrl && (
                            <Button type="button" variant="outline" onClick={() => window.open(supportChatUrl, '_blank', 'noopener,noreferrer')}>
                              Open chat
                            </Button>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Or contact quickly: <a href="tel:115" className="underline">115</a>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>FAQ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>How to use AI assistant?</AccordionTrigger>
                        <AccordionContent>
                          Go to Chat tab, enter a question or use voice to speak, the system will respond immediately.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>How to find the nearest hospital?</AccordionTrigger>
                        <AccordionContent>
                          Go to Emergency page, grant location permission. The list of hospitals and direction buttons will be displayed.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>How to report an emergency?</AccordionTrigger>
                        <AccordionContent>
                          Press the 115 button on the Emergency page, or send a Ticket with contact information.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <MainNavigation />
    </div>
  )
}

